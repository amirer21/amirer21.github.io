---
title: "AI 세부 실습 04 - Function Calling과 도구 호출"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- OpenAI
tags:
- AI
- Function Calling
- Tool Calling
toc: true
toc_sticky: true
toc_label: 목차
description: "13번 실습 파일을 기준으로 AI가 함수를 선택하고 호출하는 흐름을 정리합니다."
article_tag1: AI
article_tag2: Function Calling
article_tag3: Tool
article_section: AI
meta_keywords: AI, Function Calling, Tool Calling, 함수 호출
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# Function Calling과 도구 호출

이 글은 다음 실습 주제를 기준으로 정리합니다.

- Function Calling 기본 구조
- 함수 스키마 작성과 모델 호출
- 단일 도구 선택 실습
- 여러 도구 중 필요한 함수 선택 실습

13번 실습의 핵심은 AI에게 단순 답변을 시키는 것이 아니라, 필요한 함수를 고르게 만드는 것입니다.

## 왜 함수 호출이 필요할까?

AI 모델은 문장을 잘 만들지만 직접 할 수 없는 일이 많습니다.

예를 들어 다음 작업은 외부 기능이 필요합니다.

- 현재 날씨 조회
- 데이터베이스 검색
- 이메일 발송
- 파일 저장
- 계산
- 회사 내부 API 호출

Function Calling은 사용자의 요청을 보고 어떤 함수를 실행해야 하는지 AI가 판단하게 하는 방식입니다.

## 기본 흐름

```text
사용자 질문
-> AI가 필요한 함수 판단
-> Python 코드가 실제 함수 실행
-> 함수 결과를 AI에게 다시 전달
-> 최종 답변 생성
```

중요한 점은 AI가 함수를 직접 실행하는 것이 아니라는 점입니다.
AI는 "이 함수를 이 인자로 호출하면 좋겠다"고 제안하고, 실제 실행은 Python 코드가 합니다.

## 함수 정의 예시

```python
def get_subject_info(subject: str) -> str:
    subjects = {
        "AI": "인공지능 기초와 실습을 배우는 과목입니다.",
        "Python": "프로그래밍 기초를 배우는 과목입니다.",
    }
    return subjects.get(subject, "해당 과목 정보를 찾을 수 없습니다.")
```

이 함수는 과목명을 입력받아 설명을 반환합니다.

## 도구 설명

AI가 함수를 사용하려면 함수 설명을 제공해야 합니다.

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_subject_info",
            "description": "과목명으로 과목 설명을 조회합니다.",
            "parameters": {
                "type": "object",
                "properties": {
                    "subject": {
                        "type": "string",
                        "description": "조회할 과목명",
                    }
                },
                "required": ["subject"],
            },
        },
    }
]
```

이 정보는 AI에게 "사용 가능한 도구 목록"을 알려주는 역할을 합니다.

## 여러 도구 사용

`13.multi_modal_call_function_20250414_04_subject_multi.py`처럼 여러 함수를 등록하면 AI는 질문에 맞는 도구를 선택할 수 있습니다.

예를 들어 다음 도구들이 있을 수 있습니다.

- 과목 정보 조회
- 수강생 정보 조회
- 과제 제출 여부 확인
- 점수 계산

사용자가 "AI 과목 설명 알려줘"라고 하면 과목 조회 함수를 선택합니다.
"홍길동 점수 알려줘"라고 하면 점수 조회 함수를 선택합니다.

## 보안 주의

함수 호출은 강력하지만 위험할 수 있습니다.

다음 함수는 바로 실행하면 안 됩니다.

- 파일 삭제
- 결제
- 이메일 발송
- 데이터베이스 수정
- 외부 API로 개인정보 전송

이런 작업은 사용자 확인 단계를 넣어야 합니다.

## 정리

13번 실습은 AI와 실제 프로그램 기능을 연결하는 핵심 단계입니다.
Function Calling을 이해하면 이후 Agent, LangGraph, 업무 자동화 흐름을 훨씬 쉽게 이해할 수 있습니다.
