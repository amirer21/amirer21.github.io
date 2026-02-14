---
title: AI Agent 구조 설계 완전 정리
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
tags:
- AI
- Agent
- Architecture
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: AI Agent 시스템을 설계할 때 고려해야 할 구조, 보호장치, Python 구현 예시 정리
article_tag1: AI
article_tag2: Agent
article_tag3: Architecture
article_section: Engineering
meta_keywords: AI Agent, Planner, Tool Use, Memory, Python
last_modified_at: '2026-02-14 14:40:00 +0900'
---

# AI Agent 구조 설계 완전 정리

AI Agent를 만들 때 가장 흔한 실패는 "모델이 똑똑하면 알아서 하겠지"라는 기대입니다.
실전에서는 계획, 도구 실행, 메모리, 검증이 분리된 구조가 필요합니다.

## 기본 구성요소

```text
[User Goal]
   -> Planner
   -> Executor(Tool Caller)
   -> Memory(Short/Long term)
   -> Verifier(Policy/Quality)
   -> Response Composer
```

## 설계 원칙 7가지

1. **계획과 실행 분리**: Planner output을 명시적 step으로 저장
2. **도구 호출 제한**: allowlist 기반 tool permission
3. **메모리 만료 정책**: TTL/importance score로 정리
4. **검증 우선**: 실행 결과를 verifier가 먼저 검토
5. **재시도 정책 명확화**: 무한 루프 방지
6. **관측 가능성 확보**: step trace + token/cost 로그
7. **휴먼 핸드오프 지원**: 실패 시 즉시 사람에게 이관

## Python 구현 예시: 최소 Agent Loop

### 예제 코드

```python
from typing import Callable, Dict, Any, List
from pydantic import BaseModel

class PlanStep(BaseModel):
    action: str
    tool: str | None = None
    input: str | None = None

class AgentState(BaseModel):
    goal: str
    steps: List[PlanStep] = []
    tool_results: List[str] = []

# 예시 도구

def search_runbook(query: str) -> str:
    return f"[runbook] Found incident guide for: {query}"

def check_policy(text: str) -> bool:
    blocked = ["delete production", "drop database"]
    return not any(x in text.lower() for x in blocked)

TOOLS: Dict[str, Callable[[str], str]] = {
    "runbook_search": search_runbook,
}


def planner(goal: str) -> List[PlanStep]:
    # 실제로는 LLM이 생성; 예시는 deterministic
    return [
        PlanStep(action="find relevant runbook", tool="runbook_search", input=goal),
        PlanStep(action="summarize mitigation plan"),
    ]


def executor(state: AgentState) -> AgentState:
    for step in state.steps:
        if step.tool:
            if step.tool not in TOOLS:
                state.tool_results.append(f"Tool not allowed: {step.tool}")
                continue
            result = TOOLS[step.tool](step.input or "")
            state.tool_results.append(result)
    return state


def responder(state: AgentState) -> str:
    joined = "\n".join(state.tool_results)
    answer = f"Goal: {state.goal}\nEvidence:\n{joined}\n\nNext: apply rollback + notify on-call"
    if not check_policy(answer):
        return "Blocked by policy guard. Hand-off to human operator."
    return answer


if __name__ == "__main__":
    state = AgentState(goal="payment timeout incident on staging")
    state.steps = planner(state.goal)
    state = executor(state)
    print(responder(state))
```

### 코드 설명

- `pydantic.BaseModel`
  - Agent 상태(`AgentState`)와 계획(`PlanStep`)을 타입 안정적으로 관리합니다.
  - 운영 중 입력 스키마가 바뀌어도 검증이 쉬워집니다.
- `planner / executor / responder` 분리
  - 계획과 실행을 분리하면 실패 지점을 추적하기 쉽고, 재시도 정책을 분기하기 좋습니다.
- `TOOLS` allowlist
  - 허용된 도구만 실행하게 만들어 권한 오남용을 방지합니다.
- `check_policy`
  - 금지된 작업을 차단하는 guardrail 예시입니다.
  - Agent의 핵심은 자율성보다 **통제 가능성**이라는 점을 코드 수준에서 반영합니다.

## 운영에서 꼭 필요한 보호장치

- `max_iterations`
- `max_tool_calls`
- `budget_guard`(token/cost)
- `policy_guard`(금지 명령 차단)

## 멀티 에이전트가 필요한 경우

- 도메인이 완전히 분리된 작업(법무/재무/개발)
- 단일 컨텍스트로 처리하면 성능이 급감하는 경우

그 외에는 단일 에이전트 + 명확한 도구 계층이 유지보수 측면에서 유리합니다.

## 결론

AI Agent 아키텍처의 핵심은 자율성이 아니라 **통제 가능한 자율성**입니다.
잘 설계된 Agent는 문제를 해결할 뿐 아니라, 실패했을 때도 원인을 설명할 수 있어야 합니다.
