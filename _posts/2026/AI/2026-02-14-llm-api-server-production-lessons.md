---
title: LLM API 서버 운영 실전기
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
- FastAPI
- SRE
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: LLM API 서버를 실제 운영하면서 겪은 장애 유형과 대응 전략, Python 운영 코드 예시
article_tag1: AI
article_tag2: LLM
article_tag3: API
article_section: Engineering
meta_keywords: LLM API, FastAPI, Rate Limit, Observability, Python
last_modified_at: '2026-02-14 14:20:00 +0900'
---

# LLM API 서버 운영 실전기

PoC 단계에서는 잘 되던 LLM API가 운영에 들어가면 가장 먼저 맞닥뜨리는 것은 **불규칙한 지연과 비용 편차**입니다.

## 운영 아키텍처

```text
Client -> API Gateway -> FastAPI
                    -> Queue(Redis/Kafka)
                    -> Worker(LLM call)
                    -> Cache
                    -> DB(usage/audit)
                    -> Metrics/Tracing
```

## 실전 이슈 TOP 4

1. **Rate limit 폭발**
   - 해결: tenant별 quota + token bucket + 재시도 jitter
2. **긴 tail latency(P95/P99 악화)**
   - 해결: timeout 표준화, 모델 fallback, streaming 응답
3. **비용 급등**
   - 해결: prompt 템플릿 축소, response max token 제한, 캐시 적중률 개선
4. **관측 불가 장애**
   - 해결: request_id 기반 분산 추적 + prompt/version 로깅

## Python 구현 예시: FastAPI + Rate Limit + 관측 로그

### 예제 코드

```python
import os
import time
import uuid
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi import _rate_limit_exceeded_handler
from openai import OpenAI

app = FastAPI(title="LLM Gateway")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# slowapi: FastAPI/Starlette 환경에서 rate limiting 제공
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

class ChatRequest(BaseModel):
    prompt: str
    tenant_id: str

@app.post("/v1/chat")
@limiter.limit("30/minute")
def chat(req: ChatRequest, request: Request):
    request_id = str(uuid.uuid4())
    started = time.time()

    try:
        res = client.chat.completions.create(
            model="gpt-4.1-mini",
            temperature=0.2,
            max_tokens=300,
            messages=[
                {"role": "system", "content": "You are a production LLM assistant."},
                {"role": "user", "content": req.prompt},
            ],
        )

        latency_ms = int((time.time() - started) * 1000)
        usage = res.usage

        # 실제 운영에서는 JSON 로거/OTel exporter로 전송
        print({
            "request_id": request_id,
            "tenant_id": req.tenant_id,
            "model": "gpt-4.1-mini",
            "latency_ms": latency_ms,
            "prompt_tokens": getattr(usage, "prompt_tokens", None),
            "completion_tokens": getattr(usage, "completion_tokens", None),
        })

        return {
            "request_id": request_id,
            "answer": res.choices[0].message.content,
            "model": "gpt-4.1-mini",
            "latency_ms": latency_ms,
        }

    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Upstream LLM error: {e}")
```

### 코드 설명

- `FastAPI`
  - HTTP API 엔드포인트를 빠르게 구성하고 타입 힌트 기반 검증을 제공합니다.
- `slowapi`
  - `@limiter.limit("30/minute")`처럼 간단한 데코레이터로 요청 제한을 걸 수 있습니다.
  - 폭주 트래픽으로 인한 외부 LLM 과금 폭발을 1차로 막는 데 유용합니다.
- `openai` SDK
  - 모델 호출, 토큰 사용량(`usage`) 추적, 응답 구조화에 사용합니다.
- `request_id` + latency 로그
  - 장애 분석 시 "어느 요청이 느렸는지"를 빠르게 추적하기 위한 필수 운영 정보입니다.

## FastAPI 운영 패턴

- 동기 처리 대신 큐 기반 비동기 처리 채택
- 서킷 브레이커로 외부 LLM 장애 전파 차단
- 응답에 `model`, `prompt_version`, `token_usage` 포함

## 체크리스트

- SLA/SLO 정의 여부
- 모델별 fallback 경로 준비 여부
- 장애 시 degraded mode 제공 여부
- 비용 대시보드 실시간 모니터링 여부

LLM API는 "모델 붙이면 끝"이 아니라, 일반 마이크로서비스보다 더 엄격한 SRE 기준이 필요한 시스템입니다.
