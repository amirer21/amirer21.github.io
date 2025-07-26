---
title: (LangChain) LangChain XMLOutputParser 사용법 — 쉽게 예제와 함께 알아보기
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- LangChain
- LLM
- ChatGPT
tags:
- AI
- LangChain
- LLM
- ChatGPT
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - LangChain XMLOutputParser 사용법 — 쉽게 예제와 함께 알아보기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


# 🛠 LangChain XMLOutputParser 사용법 — 쉽게 예제와 함께 알아보기

요즘 생성형 AI를 활용한 다양한 프로젝트를 개발하면서  
"AI가 만들어준 응답을 깔끔하게 구조화하고 싶다"는 생각, 많이 해보셨을 겁니다.

그럴 때 아주 유용한 도구가 바로  
**LangChain의 OutputParser**, 그 중에서도 **XMLOutputParser**입니다.

오늘은 **XMLOutputParser**가 무엇인지, 그리고 실제로 어떻게 사용하는지  
간단한 예제와 함께 알아보겠습니다.

---

## ✨ XMLOutputParser란?

**XMLOutputParser**는  
> "AI 모델이 생성한 텍스트를 XML 포맷으로 변환하고, 이를 다시 구조화된 데이터로 파싱해주는 도구"  
입니다.

쉽게 말해,  
- 모델에게 **XML 포맷**으로 답변하라고 요청하고
- 그 결과를 **딕셔너리(dictionary)** 형태로 쉽게 다룰 수 있게 도와줍니다.

XML은 태그(`<tag>`)를 이용해서 정보를 구분하기 때문에,  
나중에 데이터를 다루거나 후처리할 때 매우 편리합니다.

---

## 🛠 코드 예제로 살펴보기

아래는 **세계의 유명 도시**를 주제로 XMLOutputParser를 사용하는 예제입니다.

### 📄 전체 코드

```python
# 설치 필요
# pip install langchain langchain-openai

import os
import warnings
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.output_parsers import XMLOutputParser

warnings.filterwarnings("ignore", category=UserWarning)

# API 키 불러오기
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")

# GPT 모델 초기화
gpt = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

# XMLOutputParser 생성
xml_out = XMLOutputParser()
format_instructions = xml_out.get_format_instructions()

# 프롬프트 템플릿
template = "10개의 세계 유명 도시를 알려줘.\n{format_instuctions}"
prompt = PromptTemplate(
    template=template,
    input_variables=[],
    partial_variables={'format_instuctions': format_instructions}
)

# 프롬프트 포맷팅
formatted_prompt = prompt.format()

# GPT에 요청
response = gpt.invoke(formatted_prompt)
print(response.content)

# XML 파싱
parsed_result = xml_out.parse(response.content)
print(parsed_result)
```

---

## 🧩 코드 흐름 설명

1. **XMLOutputParser**를 통해 **XML 포맷 지시사항**을 가져옵니다.
2. 프롬프트에 이 지시사항을 포함해 GPT에게 **"10개의 세계 도시"** 를 요청합니다.
3. GPT는 **<cities><city>런던</city><city>파리</city>...</cities>** 와 같은 형태로 응답합니다.
4. `parse()`를 호출해 XML을 **딕셔너리 형태**로 변환합니다.

---

## 📈 예상 출력 결과

모델로부터 받은 응답은 대략 이런 형태가 됩니다.

```xml
<cities>
    <city>London</city>
    <city>Paris</city>
    <city>New York</city>
    <city>Tokyo</city>
    <city>Seoul</city>
    <city>Rome</city>
    <city>Beijing</city>
    <city>Sydney</city>
    <city>Barcelona</city>
    <city>Dubai</city>
</cities>
```

그리고 `xml_out.parse()`를 통해 파싱한 결과는:

```python
{
  'cities': [
    {'city': 'London'},
    {'city': 'Paris'},
    {'city': 'New York'},
    {'city': 'Tokyo'},
    {'city': 'Seoul'},
    {'city': 'Rome'},
    {'city': 'Beijing'},
    {'city': 'Sydney'},
    {'city': 'Barcelona'},
    {'city': 'Dubai'}
  ]
}
```

깔끔하게 딕셔너리 리스트로 변환된 것을 볼 수 있습니다!

---

## 🎯 XMLOutputParser를 왜 사용할까?

| 이유 | 설명 |
|:---|:---|
| **1. 구조화된 데이터 생성** | 모델 출력 결과를 손쉽게 딕셔너리나 리스트 형태로 다룰 수 있습니다. |
| **2. 오류 감소** | 자연어보다 포맷이 명확해 오류 가능성이 줄어듭니다. |
| **3. 후처리 편의성** | 파싱된 결과를 바로 데이터베이스 저장, 화면 출력 등에 사용할 수 있습니다. |
| **4. 확장성** | 복잡한 데이터 구조(예: nested tags)에도 대응할 수 있습니다. |

---

# 📝 마무리

요약하자면,  
> **XMLOutputParser는 생성형 AI 결과를 쉽게 다루고, 깔끔하게 정리하는 강력한 무기**입니다.

- 여러 항목을 정리해서 받고 싶을 때,
- 구조화된 답변이 필요한 챗봇을 만들 때,
- 외부 시스템과 데이터 연결을 해야 할 때,

LangChain의 **XMLOutputParser**는 정말 강력한 도구가 되어줄 것입니다. 🚀

---