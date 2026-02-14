---
title: 기존 자동화 테스트 플랫폼에 LLM을 붙이는 방법
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
tags:
- AI
- LLM
- Test Automation
- FastAPI
toc: true
toc_sticky: true
toc_label: 목차
description: 기존 자동화 테스트 플랫폼에 LLM을 결합해 로그 분석과 원인 추론을 자동화하는 실전 설계 가이드
article_tag1: AI
article_tag2: LLM
article_tag3: Test
article_section: Engineering
meta_keywords: LLM, 자동화 테스트, FastAPI, 로그 분석
last_modified_at: '2026-02-14 10:00:00 +0900'
---

# 기존 자동화 테스트 플랫폼에 LLM을 붙이는 방법

테스트 자동화는 이미 성숙했지만, **실패 원인 분석(Why failed?)**은 여전히 사람이 많이 개입합니다. 
CI가 빨라져도, Slack에 "테스트 깨짐" 알람이 오면 결국 누군가 로그를 열어보고 분류하고 담당자를 지정합니다.

이 글은 "LLM으로 테스트를 대신 실행"이 아니라, **기존 자동화 테스트 플랫폼에 LLM 분석 레이어를 추가**해서
다음 과정을 자동화하는 데 초점을 맞춥니다.

- 실패 로그 요약
- 원인 카테고리 분류(테스트 결함/제품 버그/인프라 이슈)
- 재현 힌트 제안
- 이슈 트래커 자동 티켓화

---

## 1. 왜 자동화 테스트에 LLM이 필요한가

### 기존 방식의 한계

중급/시니어 개발팀에서 자주 보는 병목은 아래와 같습니다.

1. **실패 건수 > 분석 인력**
2. **로그 형식이 팀마다 다름**
3. **Flaky 테스트가 제품 버그처럼 오인됨**
4. **같은 장애를 매번 새로 분석함**

즉, 실행 자동화는 되어도 **해석 자동화는 미완성**입니다.

### LLM이 특히 잘하는 일

- 장문의 로그를 읽고 핵심 신호 추출
- "이 오류는 DB 커넥션 풀 고갈 패턴과 유사" 같은 패턴 기반 추론
- 사람이 읽을 수 있는 형태로 요약/권고안 생성

핵심은 "LLM이 정답을 100% 맞춘다"가 아니라, **분석자의 1차 필터 비용을 60~80% 줄이는 것**입니다.

---

## 2. 기존 테스트 플랫폼 구조

대부분의 조직은 아래와 비슷한 구조를 갖고 있습니다.

```text
[Git Push]
   │
   ▼
[CI Orchestrator: Jenkins/GitHub Actions]
   │
   ├─▶ [Test Runner: pytest, junit, playwright]
   │        │
   │        ├─▶ junit.xml
   │        ├─▶ stdout/stderr logs
   │        └─▶ screenshots/videos
   │
   └─▶ [Report DB + Dashboard]
            │
            └─▶ [Slack/Email Alert]
```

여기에 LLM을 붙일 때 가장 중요한 원칙은 하나입니다.

> **기존 러너/CI 파이프라인은 최대한 건드리지 않고, 후처리 파이프라인으로 분리하라.**

이 원칙을 지키면 롤백이 쉽고, 실패 시 테스트 자체는 영향을 받지 않습니다.

---

## 3. LLM 결합 아키텍처 설계

### 목표 플로우: 기존 자동화 로그 → LLM 분석 → 원인 추론

```text
(1) Test Execution Completed
          │
          ▼
(2) Log Collector
    - junit.xml
    - test stdout/stderr
    - infra metrics (optional)
          │
          ▼
(3) Preprocessor
    - PII/Secrets masking
    - noise filtering
    - chunking + metadata tagging
          │
          ▼
(4) LLM Analyzer API (FastAPI)
    - summarize
    - classify root-cause
    - confidence scoring
          │
          ├─▶ (4-1) RAG Retriever (past incidents/runbooks)
          │
          ▼
(5) Result Writer
    - store JSON result
    - attach to test report
    - create Jira/Slack notification
          │
          ▼
(6) Human Review Loop
    - accept/reject/edit label
    - feedback to prompt/rules
```

### 설계 포인트

1. **분석 입력을 표준화**
   - `{test_id, suite, env, error_snippet, stacktrace, history}` 스키마로 고정
2. **정답 강제 포맷**
   - 자연어만 받지 말고 JSON schema 응답 강제
3. **신뢰도 기반 분기**
   - confidence < 0.65 이면 "인간 검토"로 라우팅
4. **RAG는 선택이 아닌 필수에 가까움**
   - 사내 장애 이력/런북 없이는 분류 정확도가 낮음

---

## 4. 로그 분석 자동화 구현 예시 (Python + FastAPI)

아래는 실무에서 바로 확장 가능한 최소 예시입니다.

### 4.1 데이터 모델

```python
from pydantic import BaseModel, Field
from typing import Literal, List

class TestLogInput(BaseModel):
    run_id: str
    test_name: str
    suite: str
    environment: str
    error_log: str
    stack_trace: str
    history_summary: str = ""

class LLMAnalysisResult(BaseModel):
    summary: str
    root_cause: Literal["test_code", "product_bug", "infra", "dependency", "unknown"]
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: List[str]
    next_actions: List[str]
```

### 4.2 FastAPI 엔드포인트

```python
from fastapi import FastAPI, HTTPException
from openai import OpenAI
import os, json

app = FastAPI(title="LLM Test Analyzer")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

SYSTEM_PROMPT = """
You are a senior QA platform engineer.
Return ONLY JSON with keys:
summary, root_cause, confidence, evidence, next_actions.
"""

@app.post("/analyze", response_model=LLMAnalysisResult)
def analyze_test_failure(payload: TestLogInput):
    prompt = f"""
[Run ID] {payload.run_id}
[Test] {payload.test_name}
[Suite] {payload.suite}
[Env] {payload.environment}
[History] {payload.history_summary}

[Error Log]
{payload.error_log}

[Stack Trace]
{payload.stack_trace}
"""

    try:
        res = client.chat.completions.create(
            model="gpt-4.1-mini",
            temperature=0.1,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            response_format={"type": "json_object"},
        )
        content = res.choices[0].message.content
        parsed = json.loads(content)

        # Guardrail: low confidence fallback
        if parsed.get("confidence", 0) < 0.65:
            parsed["root_cause"] = "unknown"
            parsed["next_actions"] = parsed.get("next_actions", []) + [
                "Route to human triage queue"
            ]

        return LLMAnalysisResult(**parsed)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM analyze failed: {e}")
```

### 4.3 CI 후처리 연동 예시

```python
import requests

payload = {
  "run_id": "run-20260214-1021",
  "test_name": "test_checkout_discount",
  "suite": "e2e-payments",
  "environment": "staging",
  "error_log": "Timeout waiting for element #coupon-submit ...",
  "stack_trace": "PlaywrightTimeoutError: ...",
  "history_summary": "Last 7 days: 23 failures on staging only"
}

r = requests.post("http://llm-analyzer.internal/analyze", json=payload, timeout=20)
analysis = r.json()
print(analysis)
# 결과를 junit report 확장 필드 또는 별도 DB에 저장
```

---

## 5. 실제 운영 시 고려사항

### 실패 사례 1) 로그 원문을 그대로 넣었다가 비용 폭증

- 문제: 1건당 2~5MB 로그를 그대로 전송
- 결과: 토큰 비용 급증 + 응답 지연
- 해결:
  - 상위 N줄 + 에러 주변 window만 추출
  - 정규식 기반 노이즈 제거(health check, 반복 stack)
  - 샘플링 레벨 도입(중요 suite 우선)

### 실패 사례 2) 모델 환각으로 잘못된 원인 라벨링

- 문제: "product_bug"로 분류했지만 실제로는 test data 문제
- 해결:
  - evidence 필드를 강제해 근거 없는 결론 차단
  - confidence threshold 운영
  - 최종 라벨은 human-in-the-loop 승인

### 실패 사례 3) 보안 사고 위험

- 문제: 로그에 토큰, 이메일, 내부 URL 포함
- 해결:
  - 전처리 단계에서 PII/Secret 마스킹
  - 민감 프로젝트는 VPC 엔드포인트/사설 모델 사용

### 비용 이슈: 반드시 숫자로 관리

권장 KPI:

- `cost_per_failure_analysis`
- `auto_triage_coverage` (자동 분류 비율)
- `human_reopen_rate` (자동 분류 후 재오픈율)
- `mean_time_to_assign` 감소율

현업에서는 "정확도"보다 **운영 지표 개선**이 ROI를 더 잘 설명합니다.

---

## 6. 한계와 개선 방향

### 현재 한계

1. **신규 장애 타입에 취약**: 과거 히스토리가 없으면 판단이 흔들림
2. **테스트 문맥 부족 문제**: 코드 diff/배포 정보 없으면 오판 증가
3. **실시간성 한계**: 대량 병렬 실행 시 분석 큐가 병목

### 개선 방향

- **RAG 고도화**: 장애 리포트 + 커밋 diff + 런북 통합 검색
- **모델 라우팅**: 경량 모델(1차) + 고성능 모델(재분석) 2단계
- **피드백 루프**: 사람이 수정한 라벨을 주기적으로 프롬프트/룰셋에 반영
- **Flaky 전용 분류기 병행**: LLM + 통계 기반 flaky detector 결합

---

## 마무리

자동화 테스트에 LLM을 붙이는 핵심은 "마법 같은 AI 도입"이 아니라,
**기존 플랫폼에 안전한 분석 레이어를 증설하고, 신뢰도 기반 운영 체계를 만드는 것**입니다.

처음부터 완벽한 자동 분류를 목표로 하지 말고,
1) 요약 자동화 → 2) 원인 후보 제시 → 3) 부분 자동 티켓화 순서로 단계적으로 확장해보세요.

이 접근이 실제로 가장 빠르게 성과를 만듭니다.
