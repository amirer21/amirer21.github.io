---
title: (MultiModal) GPT-3.5-turbo Function Calling으로 "서울 날씨" 자동조회 챗봇 만들기
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
description: (MultiModal) GPT-3.5-turbo Function Calling으로 "서울 날씨" 자동조회 챗봇 만들기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, Multimodal
last_modified_at: '2025-04-14 21:00:00 +0800'
---


# GPT-3.5-turbo Function Calling으로 "서울 날씨" 자동조회 챗봇 만들기

## 1. 소개

이번 글에서는 **OpenAI GPT-3.5-turbo의 Function Calling** 기능을 활용하여
자연어로 "현재 서울 날씨는?"을 입력하면

* GPT가 **자동으로 서울의 위도/경도**를 추출해 함수에 넘기고
* Python에서 실제 **기상 API를 호출해 실시간 기온을 받아오는**
  자동화 챗봇 예제를 소개합니다.

---

## 2. 전체 코드 구조

```python
import os
import requests
import warnings
import base64
from openai import OpenAI
import openai
from dotenv import load_dotenv
from playsound import playsound
import sounddevice as sd
import json
from scipy.io.wavfile import write

warnings.filterwarnings("ignore", category=UserWarning)
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key
client = OpenAI()

# Function: 위도/경도를 받아 실시간 날씨 반환
def get_weather(latitude, longitude):
    response = requests.get(
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={latitude}&longitude={longitude}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m"
    )
    data = response.json()
    print('data:', data['current'])
    return data['current']['temperature_2m']

# Function Calling tool 정의
wtool = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "Get current temperature for provided coordinates in celsius.",
        "parameters": {
            "type": "object",
            "properties": {
                "latitude": {"type": "number", "description": "Latitude of the location."},
                "longitude": {"type": "number", "description": "Longitude of the location."},
            },
            "required": ["latitude", "longitude"],
            "additionalProperties": False,
        }
    }
}]

# 자연어 입력 → GPT에게 함수 연결 선언
response = client.chat.completions.create(
    model='gpt-3.5-turbo',
    messages=[{'role':'user', 'content':'현재 서울 날씨는?'}],
    tools=wtool
)

message = response.choices[0].message
print(f"message :: {message}")

# GPT가 함수 호출 정보와 파라미터(서울 위도/경도) 자동 생성
args = json.loads(message.tool_calls[0].function.arguments)
print(args['latitude'], args['longitude'])

# 실제 Python 함수 호출로 실시간 기온 조회
c = get_weather(args['latitude'], args['longitude'])
print('현재기온', c)
```

---

## 3. 주요 동작 설명

1. **자연어 질의 → Function Calling**

   * `"현재 서울 날씨는?"` 입력
   * tools로 `get_weather` 함수 구조를 GPT에게 알림
   * GPT가 \*\*서울의 위도/경도(37.5665, 126.978)\*\*를 파라미터로 자동 지정

2. **함수 인자 파싱 및 실제 API 호출**

   * tool\_calls에서 인자 파싱
   * `get_weather()`를 직접 실행해

     * `open-meteo.com` API로 **실시간 기온** 반환

3. **최종 결과 출력**

   * 함수 결과(기온) 출력

---

## 4. 실전 활용 팁

* 다양한 함수(tool) 등록으로

  * **날씨, 시간, 환율, 교통, 뉴스 등** 다양한 챗봇 기능 확장 가능
* GPT가 **의미 파악 → 인자 생성 → 실제 데이터 호출 → 결과 연결**의 워크플로우를

  * 자연스럽게 자동화

---

## 5. 마치며

* OpenAI Function Calling을 활용하면

  * "자연어 → 데이터 자동조회" 챗봇을
  * 파이썬에서 **몇 줄로 바로 구현**할 수 있습니다.
* 사내봇, 서비스 연동, Slack 챗봇 등 실무 자동화에 바로 적용 가능!

---

### 참고

* [OpenAI Function Calling 공식 문서](https://platform.openai.com/docs/guides/function-calling)
* [Open-Meteo 날씨 API 문서](https://open-meteo.com/)

