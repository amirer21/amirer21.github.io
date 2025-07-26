---
title: (MultiModal) OpenAI Function Calling으로 자연어 계산기 만들기 (두 수 더하기 자동화 예제)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- Multimodal
- LLM
- ChatGPT
tags:
- AI
- Multimodal
- LLM
- ChatGPT
toc: true
toc_sticky: true
toc_label: 목차
description: (MultiModal) OpenAI Function Calling으로 자연어 계산기 만들기 (두 수 더하기 자동화 예제)
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, Multimodal
last_modified_at: '2025-04-14 21:00:00 +0800'
---


# OpenAI Function Calling으로 "서울 시간 알려줘" 챗봇 만들기 (도시별 실시간 안내 예제)

## 1. 소개

이번 포스팅에서는 **OpenAI GPT-3.5-turbo의 Function Calling 기능**을 활용해
"서울(Seoul)의 현재 시간을 알려줘"와 같이 자연어로 요청하면

* GPT가 도시명을 추출해
* Python에서 **실시간 현지 시간**을 계산해서
* 최종 답변까지 자동화하는 실전 챗봇 예제를 소개합니다.

---

## 2. 전체 코드 구조

```python
import os
import warnings
from openai import OpenAI
import openai
from dotenv import load_dotenv
import json
from datetime import datetime
import pytz

warnings.filterwarnings("ignore", category=UserWarning)
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key
client = OpenAI()

# 도시별 현지 시간 반환 함수
def get_local_time(city):
    timezones = {
        '서울': 'Asia/Seoul', 'Seoul': 'Asia/Seoul',
        '도쿄': 'Asia/Tokyo', 'Tokyo': 'Asia/Tokyo',
        '뉴욕': 'America/New_York', 'New York': 'America/New_York',
        '런던': 'Europe/London', 'London': 'Europe/London',
        '베를린': 'Europe/Berlin', 'Berlin': 'Europe/Berlin',
        '시드니': 'Australia/Sydney', 'Sydney': 'Australia/Sydney'
    }
    if city not in timezones:
        return f"{city}은(는) 지원되지 않는 도시입니다."
    tz = pytz.timezone(timezones[city])
    local_time = datetime.now(tz)
    return local_time.strftime(f"{city} 시간: %Y-%m-%d %H:%M:%S")

# Function tool 선언
city_time_tool = [{
    "type": "function",
    "function": {
        "name": "get_local_time",
        "description": "도시의 현재 시간을 반환합니다.",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "도시 이름"
                }
            },
            "required": ["city"],
            "additionalProperties": False
        }
    }
}]

# 자연어 입력 → GPT Function Calling
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{
        "role": "user",
        "content": "서울(Seoul)의 현재 시간을 알려줘."  
    }],
    tools=city_time_tool
)

# GPT가 반환한 함수 호출 파라미터 추출
response_message = response.choices[0].message
tool_call = response_message.tool_calls[0]
args = json.loads(tool_call.function.arguments)

# Python 함수 실제 실행
result = get_local_time(args['city'])
print("\최종 결과:", result)
```

---

## 3. 주요 동작 설명

1. **Function tool 선언**

   * `get_local_time(city)` 함수 정의
   * 도시명별 타임존 정보 포함

2. **자연어 → 함수 호출 자동화**

   * 사용자의 질문에 따라

     * GPT가 `"city": "서울"` 등 파라미터 자동 추출
   * `tool_calls`로 함수명/인자 파싱

3. **실제 Python 함수 실행**

   * `get_local_time()` 함수로

     * 해당 도시의 **실시간 시간** 반환

---

## 4. 실전 활용 팁

* 도시 추가: timezones 딕셔너리에 원하는 도시/국가 확장 가능
* Function tool에 여러 함수 등록 시

  * "날씨 알려줘", "시차 계산해줘" 등 다양한 자동화 챗봇 구성 가능

---

## 5. 마치며

* Function Calling을 활용하면

  * **자연어 입력 → 함수 자동실행 → 데이터 반환**이 매우 간단해집니다.
* 사내 챗봇, 일정 추천, 시차 안내 등 실전 활용에 강추!

---

### 참고

* [OpenAI Function Calling 공식 문서](https://platform.openai.com/docs/guides/function-calling)
* [pytz 공식 문서](https://pythonhosted.org/pytz/)
