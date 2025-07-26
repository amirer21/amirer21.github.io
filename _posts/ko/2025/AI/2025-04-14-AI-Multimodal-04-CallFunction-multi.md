---
title: (MultiModal) Function Calling 멀티툴로 "지금 서울 날씨는?" "뉴욕 시간은?" 챗봇 만들기
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
description: (MultiModal) Function Calling 멀티툴로 "지금 서울 날씨는?" "뉴욕 시간은?" 챗봇 만들기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, Multimodal
last_modified_at: '2025-04-14 21:00:00 +0800'
---


# Function Calling 멀티툴로 "지금 서울 날씨는?" "뉴욕 시간은?" 챗봇 만들기

## 1. 소개

이번 글에서는 OpenAI GPT-3.5-turbo의 **Function Calling** 기능을 활용해

* **"지금 서울 날씨는 어때?"**
* **"지금 뉴욕 시간은?"**
  처럼 자연어로 질문하면
  **도시에 따라 실시간 시간 또는 날씨 정보를 자동 안내하는**
  실전 멀티툴 챗봇 파이썬 코드를 소개합니다.

---

## 2. 전체 코드 구조

```python
import os
import warnings
from openai import OpenAI
import openai
from dotenv import load_dotenv
from datetime import datetime
import pytz
import requests
import json

warnings.filterwarnings("ignore", category=UserWarning)
load_dotenv(dotenv_path='openapi_key.env')
openai.api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI()

# 도시 시간 조회 함수
def get_local_time(city):
    timezones = {
        '서울': 'Asia/Seoul', 'Seoul': 'Asia/Seoul',
        '도쿄': 'Asia/Tokyo', 'Tokyo': 'Asia/Tokyo',
        '뉴욕': 'America/New_York', 'New York': 'America/New_York',
        '런던': 'Europe/London', 'London': 'Europe/London'
    }
    if city not in timezones:
        return f"{city}은(는) 지원되지 않는 도시입니다."
    tz = pytz.timezone(timezones[city])
    local_time = datetime.now(tz)
    return local_time.strftime(f"{city} 시간: %Y-%m-%d %H:%M:%S")

# 위도/경도를 받아 날씨 조회
def get_weather(latitude, longitude):
    response = requests.get(
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={latitude}&longitude={longitude}"
        f"&current=temperature_2m,wind_speed_10m"
    )
    data = response.json()
    print('API 응답:', data['current'])
    return f"현재 기온: {data['current']['temperature_2m']}°C"

# tools 정의 (2개 함수)
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_local_time",
            "description": "도시의 현재 시간을 반환합니다.",
            "parameters": {
                "type": "object",
                "properties": {
                    "city": {
                        "type": "string",
                        "description": "도시 이름 (예: 서울, 뉴욕)"
                    }
                },
                "required": ["city"],
                "additionalProperties": False
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get current temperature for provided coordinates in celsius.",
            "parameters": {
                "type": "object",
                "properties": {
                    "latitude": {
                        "type": "number",
                        "description": "Latitude of the location.",
                    },
                    "longitude": {
                        "type": "number",
                        "description": "Longitude of the location.",
                    },
                },
                "required": ["latitude", "longitude"],
                "additionalProperties": False
            }
        }
    }
]

# 사용자 질문
messages = [{
    "role": "user",
    "content": "지금 서울 날씨는 어때?"
    #  "content": "지금 뉴욕 시간은?"
}]

# GPT 호출
completion = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=messages,
    tools=tools,
    tool_choice="auto"
)

# GPT 응답 처리
response_message = completion.choices[0].message
tool_call = response_message.tool_calls[0]
func_name = tool_call.function.name
args = json.loads(tool_call.function.arguments)

# 함수 실행
if func_name == "get_local_time":
    result = get_local_time(args["city"])
elif func_name == "get_weather":
    result = get_weather(args["latitude"], args["longitude"])
else:
    result = "지원되지 않는 함수 호출입니다."

print(f"\n호출된 함수: {func_name}")
print(f"GPT가 넘긴 인자: {args}")
print(f"최종 응답: {result}")
```

---

## 3. 주요 동작 설명

1. **tools**에 "도시 시간 조회"와 "날씨 조회" 함수 등록
2. 사용자가

   * `"지금 서울 날씨는 어때?"`
   * `"지금 뉴욕 시간은?"`
     등 다양한 질문을 자연어로 입력
3. GPT가 **질문 의도에 따라**

   * 적절한 함수와 인자(city, latitude, longitude 등)를 자동으로 추출
4. 해당 Python 함수가 실시간 시간/날씨 데이터를 반환

---

## 4. 확장/활용 팁

* 도시-위경도 매핑(예: `"서울"`→ 37.5665, 126.978) 로직을 추가하면
  "OOO 날씨" 요청도 바로 자동 처리 가능
* 함수(tool)만 더 등록하면

  * 환율, 미세먼지, 뉴스 등 "실시간 AI 챗봇"으로 무한 확장
* 업무봇, Q\&A 서비스, Slack/Discord 연동 등 다양한 실무에 적용 가능

---

## 5. 마치며

* GPT-3.5 Function Calling을 활용하면

  * "자연어 → 적절한 함수 선택/실행 → 결과 반환"을
  * **파이썬 한 파일**에서 바로 자동화할 수 있습니다!
* 팀/회사에서 챗봇 자동화, 데이터 안내, 실시간 정보봇에 적극 추천합니다.

---

### 참고

* [OpenAI Function Calling 공식 문서](https://platform.openai.com/docs/guides/function-calling)
* [pytz 공식 문서](https://pythonhosted.org/pytz/)
* [Open-Meteo API](https://open-meteo.com/)

---
