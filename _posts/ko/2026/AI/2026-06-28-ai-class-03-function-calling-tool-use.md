---
title: "AI 강의 정리 03 - Function Calling으로 AI에게 도구 사용시키기"
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
- OpenAI
toc: true
toc_sticky: true
toc_label: 목차
description: "AI 모델이 직접 함수를 고르는 Function Calling 개념을 비전공자도 이해할 수 있도록 정리합니다."
article_tag1: AI
article_tag2: Function Calling
article_tag3: Tool Calling
article_section: AI
meta_keywords: AI, Function Calling, Tool Calling, OpenAI, 함수호출
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# Function Calling이란?

Function Calling은 AI 모델이 상황에 맞는 함수를 선택하게 만드는 방식입니다.

일반 챗봇은 질문을 받으면 텍스트로 답변합니다.
하지만 실제 프로그램에서는 텍스트 답변만으로 부족할 때가 많습니다.

예를 들어 사용자가 이렇게 말한다고 가정해 보겠습니다.

```text
서울의 오늘 날씨를 알려줘.
```

AI가 그냥 추측해서 답하면 위험합니다.
대신 날씨 API를 호출하는 함수가 있다면 AI는 다음처럼 판단할 수 있습니다.

```text
이 질문은 날씨 조회 함수가 필요하다.
지역은 서울이다.
```

그 다음 Python 코드가 실제 함수를 실행하고 결과를 다시 AI에게 전달합니다.

강의 폴더에서는 다음 파일들이 이 흐름에 해당합니다.

```text
13_multi_modal_call_function_20250414_01.py
13_multi_modal_call_function_20250414_02.py
13.multi_modal_call_function_20250414_03_subject.py
13.multi_modal_call_function_20250414_04_subject_multi.py
```

## 왜 필요한가?

AI 모델은 문장을 잘 만들지만, 다음과 같은 일은 외부 도구가 필요합니다.

| 작업 | 필요한 도구 |
| --- | --- |
| 현재 날씨 조회 | 날씨 API |
| DB에 회원 저장 | 데이터베이스 함수 |
| 이메일 발송 | SMTP 또는 Gmail API |
| 파일 요약 | 파일 읽기 함수 |
| 계산 | 계산 함수 |

Function Calling은 AI와 실제 프로그램 기능을 연결하는 접착제 역할을 합니다.

## 기본 구조

Function Calling은 보통 세 단계로 구성됩니다.

```text
1. Python 함수 정의
2. AI에게 사용 가능한 함수 목록 설명
3. AI가 고른 함수와 인자를 실제 Python 코드에서 실행
```

예를 들어 학생 정보를 조회하는 함수를 생각해 보겠습니다.

```python
def get_student_score(name: str) -> str:
    scores = {
        "홍길동": "수학 90점, 영어 85점",
        "김철수": "수학 75점, 영어 95점",
    }
    return scores.get(name, "학생 정보를 찾을 수 없습니다.")
```

사람이 직접 호출하면 다음과 같습니다.

```python
result = get_student_score("홍길동")
print(result)
```

Function Calling에서는 AI가 사용자의 문장을 보고 `get_student_score`를 호출해야 한다고 판단합니다.

## AI에게 함수 설명하기

AI가 함수를 사용하려면 함수 이름과 인자 구조를 알아야 합니다.

예시는 다음과 같습니다.

```python
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_student_score",
            "description": "학생 이름으로 시험 점수를 조회합니다.",
            "parameters": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "조회할 학생 이름",
                    }
                },
                "required": ["name"],
            },
        },
    }
]
```

이 코드는 AI에게 다음 정보를 알려줍니다.

- 사용할 수 있는 함수 이름은 `get_student_score`
- 이 함수는 학생 점수를 조회한다
- 필요한 입력값은 `name`
- `name`은 문자열이다

## 전체 흐름 예시

사용자가 다음처럼 말합니다.

```text
홍길동 점수 알려줘.
```

AI는 텍스트 답변을 바로 만들지 않고 다음처럼 판단합니다.

```text
get_student_score(name="홍길동") 함수를 호출해야 한다.
```

Python 코드는 이 요청을 받아 실제 함수를 실행합니다.

```python
tool_result = get_student_score("홍길동")
```

결과는 다음과 같습니다.

```text
수학 90점, 영어 85점
```

마지막으로 이 결과를 다시 AI에게 전달하면 AI는 자연어 답변으로 정리할 수 있습니다.

```text
홍길동 학생의 점수는 수학 90점, 영어 85점입니다.
```

## 비전공자 관점에서 이해하기

Function Calling은 식당 주문 시스템으로 비유할 수 있습니다.

손님이 말합니다.

```text
아메리카노 한 잔 주세요.
```

직원이 직접 커피를 만들 수도 있지만, 실제로는 바리스타에게 주문을 전달합니다.

```text
make_coffee(menu="아메리카노", count=1)
```

AI는 직원 역할을 합니다.
사용자의 말을 이해하고, 어떤 도구를 써야 하는지 고릅니다.
Python 함수는 바리스타 역할을 합니다. 실제 작업을 수행합니다.

## 여러 함수를 등록하는 경우

실제 서비스에서는 함수가 하나만 있지 않습니다.

예를 들어 다음 함수들이 있을 수 있습니다.

```python
def get_weather(city: str) -> str:
    return f"{city}의 날씨는 맑음입니다."

def get_exchange_rate(currency: str) -> str:
    return f"{currency} 환율 정보입니다."

def search_document(keyword: str) -> str:
    return f"{keyword} 관련 문서를 찾았습니다."
```

AI는 사용자 질문을 보고 어떤 함수를 쓸지 선택합니다.

| 사용자 질문 | 선택될 함수 |
| --- | --- |
| 서울 날씨 알려줘 | `get_weather` |
| 달러 환율 알려줘 | `get_exchange_rate` |
| 계약서에서 위약금 찾아줘 | `search_document` |

## 주의할 점

AI가 함수를 "실행"하는 것은 아닙니다.
AI는 어떤 함수를 실행해야 할지 제안합니다.
실제 실행은 Python 코드가 합니다.

이 차이를 이해해야 합니다.

```text
AI 모델: 이 함수를 호출하세요.
Python 코드: 실제 함수를 실행합니다.
```

그래서 보안상 중요한 함수는 반드시 검증 로직을 넣어야 합니다.

예를 들어 파일 삭제, 결제, 이메일 발송 같은 함수는 AI가 골랐다고 바로 실행하면 안 됩니다.
사용자 확인 절차나 권한 검사를 추가해야 합니다.

## Function Calling이 쓰이는 곳

Function Calling은 다음과 같은 AI 서비스의 기반이 됩니다.

- 예약 챗봇
- 고객센터 자동 응답
- 사내 문서 검색
- 데이터베이스 조회 챗봇
- 이메일 자동 작성
- 보고서 생성 자동화
- Agent 시스템

LangChain과 LangGraph에서 나오는 Agent도 결국 "AI가 도구를 선택하고 실행 흐름을 만든다"는 점에서 Function Calling과 연결됩니다.

## 정리

Function Calling은 AI를 단순 대화 상대에서 실제 프로그램의 조종자로 확장하는 핵심 개념입니다.

- 함수는 Python 코드로 만든 실제 기능입니다.
- AI는 사용자의 말을 보고 필요한 함수를 고릅니다.
- Python 코드가 함수를 실행합니다.
- 실행 결과를 다시 AI가 자연어로 정리합니다.

다음 글에서는 Streamlit을 사용해 Python 코드를 웹앱으로 만드는 방법을 정리합니다.
