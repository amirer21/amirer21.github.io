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


# OpenAI Function Calling으로 자연어 계산기 만들기 (두 수 더하기 자동화 예제)

## 1. 소개

이번 포스팅에서는 **OpenAI GPT-3.5-turbo의 Function Calling 기능**을 활용하여
사용자가 `"2와 3을 더해줘"`처럼 **자연어로 요청**하면

* GPT가 파라미터를 자동 인식해
* Python 함수로 실제 계산(덧셈)
* **최종 답변을 자연어로 출력**하는
  **AI 기반 계산기 챗봇** 예제를 소개합니다.

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

def add_number(num1, num2):
    print('call', num1, num2)
    return {'sum': num1 + num2}

sumtool = [{
    "type": "function",
    "function": {
        "name": "add_number",
        "description": "두 숫자의 합을 계산합니다.",
        "parameters": {
            "type": "object",
            "properties": {
                "num1": {"type": "number", "description": "First number to add."},
                "num2": {"type": "number", "description": "Second number to add."},
            },
            "required": ["num1", "num2"],
        },
    },
}]

# 1. 자연어 입력 → GPT에게 함수 사용 선언
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "2와 3을 더해줘."},
        ],
    }],
    tools=sumtool)

response_message = response.choices[0].message
print('response_message:', response_message)

# 2. GPT가 함수 파라미터 자동 추출
argV = response_message.tool_calls[0].function.arguments
args = json.loads(argV)
print(args['num1'], args['num2'])

# 3. 실제 Python 함수 실행
rst = add_number(args['num1'], args['num2'])
print(rst)

# 4. 결과를 함수 메시지로 GPT에게 추가 전달 (role: function)
messages = [{
    "role": "user",
    "content": "2와 3을 더해줘."
}]
messages.append({'role':'function',
                'name':'add_number',
                'content':json.dumps(rst)})

# 5. 최종 자연어 답변 생성 요청
response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=messages)
print('response choices:', response.choices[0].message.content)
```

---

## 3. 주요 동작 설명

1. **Function tool 정의**

   * `add_number(num1, num2)` 함수 구조/설명/파라미터 타입을 tool로 선언

2. **자연어 → 함수 호출 자동화**

   * "2와 3을 더해줘" 등 자연어 입력 →
     GPT가 함수에 맞는 파라미터(`num1=2`, `num2=3`)를 추출

3. **실제 Python 함수 실행**

   * `add_number()`로 직접 계산

4. **함수 실행 결과 → GPT에게 전달**

   * 결과(`{"sum": 5}`)를 function 메시지로 추가
   * GPT가 자연어로 "2와 3을 더하면 5입니다."와 같이 최종 응답 생성

---

## 4. 활용 팁

* 덧셈뿐만 아니라 뺄셈, 곱셈, 나눗셈 등 다양한 계산 함수로 확장 가능
* 여러 함수, 멀티툴, 조건문 등 실전 챗봇 설계에 바로 응용
* 계산, 변환, 데이터 조회, 자동화 등
  Function Calling은 모든 “AI + 실제 코드 실행” 패턴의 핵심

---

## 5. 마치며

Function Calling은

* **AI가 자연어를 이해하고, 적절한 함수 실행을 자동화**
* 결과를 자연어로 설명까지 해주는
* **실전 AI 챗봇/자동화의 필수 도구**입니다!

---

### 참고

* [OpenAI Function Calling 공식 문서](https://platform.openai.com/docs/guides/function-calling)
* 다양한 확장/실전 예제는 Issues/댓글로 남겨주세요!
