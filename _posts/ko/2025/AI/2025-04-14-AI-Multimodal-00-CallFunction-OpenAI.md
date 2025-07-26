---
title: (MultiModal) OpenAI의 Function Calling - AI와 현실 세계를 연결하는 똑똑한 비서
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
description: (MultiModal) OpenAI의 Function Calling - AI와 현실 세계를 연결하는 똑똑한 비서
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, Multimodal
last_modified_at: '2025-04-14 21:00:00 +0800'
---


## OpenAI의 Function Calling: AI와 현실 세계를 연결하는 똑똑한 비서

OpenAI의 **Function Calling**은 대규모 언어 모델(LLM)이 미리 정의된 외부 함수를 호출하여, 실시간 정보 조회, 데이터베이스 연동, 외부 시스템 제어 등 다양한 작업을 수행할 수 있도록 하는 강력한 기능입니다. 단순히 텍스트를 생성하는 것을 넘어, AI가 개발자가 만들어 놓은 '도구'를 적재적소에 활용하여 보다 정확하고 동적인 답변을 생성하게 해주는 핵심 기술이라고 할 수 있습니다.

---

### Function Calling, 왜 필요한가요?

LLM은 방대한 텍스트 데이터로 학습했지만, 몇 가지 본질적인 한계를 가집니다.

* **최신 정보 부족:** 특정 시점까지의 데이터로 학습했기 때문에, "오늘 서울 날씨 어때?"와 같은 실시간 정보에 답변할 수 없습니다.
* **외부 시스템 연동 불가:** "내일 9시에 회의실 예약해줘"처럼 기업 내부 데이터베이스나 외부 API와 직접 상호작용할 수 없습니다.
* **정형 데이터 출력의 어려움:** 답변을 일반적인 문장 형태가 아닌, 특정 JSON 형식으로 반환하도록 제어하기 어렵습니다.

**Function Calling**은 이러한 한계를 극복하고 LLM을 단순한 '언어 모델'에서 실질적인 '문제 해결사'로 발전시키는 역할을 합니다.

**주요 이점:**

* **외부 도구 연동:** 날씨 API, 주가 정보 API, 사내 데이터베이스 등 외부 서비스와 연결하여 최신 및 비공개 데이터에 접근할 수 있습니다.
* **정형 데이터 추출:** 사용자의 자연어 요청을 분석하여, 원하는 정보를 명확한 JSON 형식으로 추출하고 구조화할 수 있습니다.
* **작업 자동화:** 이메일 전송, 회의 일정 등록, 스마트홈 기기 제어 등 실제적인 작업을 자동화하는 AI 에이전트를 구축할 수 있습니다.

---

### 어떻게 작동하나요? 🤖

Function Calling은 개발자와 OpenAI 모델 간의 명확한 역할 분담을 통해 이루어집니다. 전체 과정은 보통 다음과 같은 단계로 진행됩니다.

1.  **함수 정의 (개발자):** 개발자는 특정 작업을 수행하는 함수를 코드로 작성합니다. 예를 들어, `get_current_weather(location)`와 같은 함수를 만듭니다. 그리고 이 함수의 이름, 기능 설명, 필요한 인자(파라미터) 등을 정해진 JSON 형식에 맞춰 OpenAI API에 전달할 '도구(tool)'로 정의합니다.

2.  **모델의 판단 (OpenAI):** 사용자가 "파리의 현재 날씨 알려줘"라고 질문하면, OpenAI 모델은 대화의 맥락과 미리 정의된 '도구' 목록을 보고 `get_current_weather` 함수를 호출해야 한다고 판단합니다.

3.  **함수 호출 정보 반환 (OpenAI):** 모델은 함수를 직접 실행하는 대신, 어떤 함수를 호출해야 하는지와 해당 함수에 전달할 인자(`{"location": "Paris"}`)가 담긴 JSON 객체를 응답으로 보냅니다.

4.  **함수 실행 (개발자):** 개발자는 모델이 보낸 JSON 응답을 받아, 실제로 자신의 코드 환경에서 `get_current_weather("Paris")` 함수를 실행합니다. 이 함수는 외부 날씨 API를 호출하여 실제 날씨 정보를 가져올 것입니다.

5.  **결과 전달 및 최종 답변 생성 (개발자 → OpenAI):** 개발자는 함수 실행 결과("파리의 현재 기온은 22도, 맑음")를 다시 OpenAI 모델에게 전달합니다. 모델은 이 결과를 바탕으로 사용자에게 "파리의 현재 날씨는 맑고 기온은 22도입니다."와 같이 자연스러운 최종 답변을 생성하여 전달합니다.

#### 간단한 예시: 날씨 확인 챗봇

| 단계 | 주체 | 내용 |
| :--- | :--- | :--- |
| **사용자** | | "서울 날씨 어때?" |
| **1. 함수 정의** | **개발자** | `get_weather(location)` 함수와 그에 대한 설명을 API 요청에 포함 |
| **2. 모델 판단** | **OpenAI** | 이 질문은 `get_weather` 함수가 필요하다고 판단 |
| **3. 함수 정보 반환** | **OpenAI** | `{ "name": "get_weather", "arguments": { "location": "서울" } }` JSON 반환 |
| **4. 함수 실행** | **개발자** | 자신의 서버에서 `get_weather("서울")`을 실행하고, 실제 날씨 API에서 "25도, 맑음" 결과 획득 |
| **5. 최종 답변** | **OpenAI** | 개발자가 전달한 실행 결과를 바탕으로 "현재 서울의 날씨는 맑고, 기온은 25도입니다."라고 답변 생성 |

이처럼 Function Calling은 OpenAI 모델의 지능적인 판단력과 개발자의 실제 실행 능력을 결합하여, AI가 할 수 있는 일의 범위를 비약적으로 확장시키는 핵심적인 기능입니다.

여기서는 사용자가 특정 도시의 날씨를 묻거나, 특정 회사의 주가를 물어보면 AI가 그에 맞는 함수를 호출하여 답변하는 간단한 챗봇 예제를 파이썬(Python) 코드로 보여드리겠습니다.

### 예제 목표: 날씨와 주가 정보를 알려주는 AI 챗봇

  * **기능 1:** "서울 날씨 어때?"라고 물으면, 현재 날씨 정보를 알려준다.
  * **기능 2:** "삼성전자 주가 알려줘"라고 물으면, 현재 주가를 알려준다.

### 전체 코드 (Python)

```python
# 1. 필요 라이브러리 설치
# pip install openai

import os
import json
from openai import OpenAI

# 2. OpenAI API 키 설정
# 실제 사용 시에는 환경 변수 등으로 안전하게 관리해야 합니다.
# os.environ["OPENAI_API_KEY"] = "YOUR_API_KEY"
client = OpenAI()

# 3. 모델이 사용할 함수(도구) 정의
# 실제로는 외부 API를 호출하거나 데이터베이스를 조회해야 하지만,
# 여기서는 간단한 예제를 위해 정해진 값을 반환하는 가짜(dummy) 함수를 만듭니다.

def get_current_weather(location):
    """특정 지역의 현재 날씨 정보를 가져옵니다."""
    print(f"DEBUG: get_current_weather 함수 호출됨. location: {location}")
    weather_info = {
        "location": location,
        "temperature": "25",
        "unit": "celsius",
        "forecast": "맑음",
    }
    return json.dumps(weather_info)

def get_stock_price(company_name):
    """특정 회사의 현재 주식 가격을 가져옵니다."""
    print(f"DEBUG: get_stock_price 함수 호출됨. company_name: {company_name}")
    stock_info = {
        "company_name": company_name,
        "price": "75,000",
        "currency": "KRW",
    }
    return json.dumps(stock_info)


def run_conversation(user_prompt):
    # 4. 첫 번째 API 호출: 사용자의 질문과 함수 목록 전달
    
    messages = [{"role": "user", "content": user_prompt}]
    
    # 모델에게 제공할 함수(도구) 목록
    tools = [
        {
            "type": "function",
            "function": {
                "name": "get_current_weather",
                "description": "Get the current weather in a given location",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "The city and state, e.g. San Francisco, CA",
                        },
                    },
                    "required": ["location"],
                },
            },
        },
        {
            "type": "function",
            "function": {
                "name": "get_stock_price",
                "description": "Get the current stock price for a given company",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "company_name": {
                            "type": "string",
                            "description": "The name of the company, e.g. Samsung Electronics",
                        }
                    },
                    "required": ["company_name"],
                },
            },
        }
    ]

    print(f"\n>>>> 사용자 질문: {user_prompt}")
    
    response = client.chat.completions.create(
        model="gpt-4o", # 또는 gpt-3.5-turbo
        messages=messages,
        tools=tools,
        tool_choice="auto",  # 모델이 함수 호출 여부를 자동으로 결정
    )

    response_message = response.choices[0].message
    
    # 5. 모델의 응답 확인 및 함수 호출 처리
    
    # 모델이 함수 호출을 결정했는지 확인
    tool_calls = response_message.tool_calls
    if tool_calls:
        print("DEBUG: 모델이 함수 호출을 결정했습니다.")
        
        # 호출할 함수와 인자 정보 저장
        available_functions = {
            "get_current_weather": get_current_weather,
            "get_stock_price": get_stock_price,
        }
        
        # 대화 기록에 모델의 첫 번째 응답(함수 호출 요청) 추가
        messages.append(response_message)

        # 모든 함수 호출 실행
        for tool_call in tool_calls:
            function_name = tool_call.function.name
            function_to_call = available_functions[function_name]
            function_args = json.loads(tool_call.function.arguments)
            
            # 실제 함수 실행
            function_response = function_to_call(**function_args)
            
            print(f"DEBUG: 함수 실행 결과: {function_response}")
            
            # 대화 기록에 함수 실행 결과 추가
            messages.append(
                {
                    "tool_call_id": tool_call.id,
                    "role": "tool",
                    "name": function_name,
                    "content": function_response,
                }
            )
        
        # 6. 두 번째 API 호출: 함수 실행 결과를 포함하여 최종 답변 요청
        print("DEBUG: 함수 실행 결과를 바탕으로 최종 답변을 요청합니다.")
        second_response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
        )
        final_response = second_response.choices[0].message.content
        print(f"<<<< 최종 답변: {final_response}")
        return final_response
        
    else:
        # 함수 호출이 필요 없는 경우, 바로 답변 출력
        final_response = response_message.content
        print(f"<<<< 최종 답변: {final_response}")
        return final_response

# --- 실행 ---
run_conversation("오늘 서울 날씨 어때?")
run_conversation("삼성전자 주가는 얼마야?")
run_conversation("너는 누구니?")
```

### 코드 해설

1.  **라이브러리 설치 (`pip install openai`)**: OpenAI API를 사용하기 위한 파이썬 라이브러리를 설치합니다.
2.  **API 키 설정**: OpenAI 서비스에 접근하기 위한 API 키를 설정합니다.
3.  **함수(도구) 정의**: `get_current_weather`와 `get_stock_price`라는 두 개의 파이썬 함수를 만듭니다. 이 함수들이 바로 모델이 사용할 '도구'입니다.
4.  **첫 번째 API 호출**:
      * `messages`: 사용자의 질문을 담아 전달합니다.
      * `tools`: **가장 중요한 부분**입니다. 우리가 정의한 함수들의 이름(`name`), 기능 설명(`description`), 필요한 인자(`parameters`)를 JSON 형식으로 자세히 기술하여 모델에게 알려줍니다. 이 정보를 바탕으로 모델은 어떤 상황에 어떤 함수를 써야 할지 학습합니다.
      * `tool_choice="auto"`: 모델이 대화의 맥락에 따라 함수를 호출할지, 아니면 그냥 대답할지를 스스로 결정하게 합니다.
5.  **모델 응답 처리**:
      * API 응답에 `tool_calls`가 포함되어 있다면, 그것은 모델이 함수를 호출해달라고 요청했다는 의미입니다.
      * `tool_calls` 안에는 호출할 함수의 이름(`name`)과 필요한 인자(`arguments`)가 들어있습니다. 예를 들어 "서울 날씨" 질문에는 `{"name": "get_current_weather", "arguments": "{\"location\": \"서울\"}"}` 과 같은 정보가 담겨 있습니다.
      * 코드는 이 정보를 바탕으로 실제 `get_current_weather("서울")` 함수를 실행합니다.
6.  **두 번째 API 호출**:
      * 함수를 실행해서 얻은 결과(예: 날씨 정보)를 대화 기록(`messages`)에 추가합니다. 이때 `role`을 `"tool"`로 지정하여 이것이 함수 실행 결과임을 명확히 합니다.
      * 이 새로운 대화 기록을 모델에게 다시 보내 최종 답변을 생성하도록 요청합니다. 모델은 함수 결과를 보고 "현재 서울의 날씨는 맑고, 기온은 25도입니다."와 같이 자연스러운 문장을 만들어냅니다.

### 실행 결과 예시

```text
>>>> 사용자 질문: 오늘 서울 날씨 어때?
DEBUG: 모델이 함수 호출을 결정했습니다.
DEBUG: get_current_weather 함수 호출됨. location: 서울
DEBUG: 함수 실행 결과: {"location": "서울", "temperature": "25", "unit": "celsius", "forecast": "맑음"}
DEBUG: 함수 실행 결과를 바탕으로 최종 답변을 요청합니다.
<<<< 최종 답변: 현재 서울의 날씨는 맑으며, 기온은 25도입니다.

>>>> 사용자 질문: 삼성전자 주가는 얼마야?
DEBUG: 모델이 함수 호출을 결정했습니다.
DEBUG: get_stock_price 함수 호출됨. company_name: 삼성전자
DEBUG: 함수 실행 결과: {"company_name": "삼성전자", "price": "75,000", "currency": "KRW"}
DEBUG: 함수 실행 결과를 바탕으로 최종 답변을 요청합니다.
<<<< 최종 답변: 삼성전자의 현재 주가는 75,000 KRW입니다.

>>>> 사용자 질문: 너는 누구니?
<<<< 최종 답변: 저는 OpenAI에 의해 훈련된 대규모 언어 모델입니다.
```

마지막 "너는 누구니?" 질문처럼 함수 호출이 필요 없는 경우에는 모델이 `tool_calls` 없이 바로 답변을 생성하는 것을 볼 수 있습니다. 이처럼 Function Calling은 AI가 필요할 때만 '도구'를 사용하는 똑똑한 비서처럼 행동하게 만드는 강력한 기능입니다.