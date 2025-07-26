---
title: (LangChain) LangChain이란 무엇인가? 쉽게 예제와 함께 알아보기
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
description: 인공지능 - LangChain이란 무엇인가? 쉽게 예제와 함께 알아보기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


# 🛠 LangChain이란 무엇인가? 쉽게 예제와 함께 알아보기

AI를 활용해 무언가를 만들고 싶을 때, 요즘 빠질 수 없는 도구가 있습니다.  
바로 **LangChain**입니다.

LangChain은 LLM(대형 언어 모델)을 실제 애플리케이션에 쉽게 연결하고 활용할 수 있도록 도와주는  
**파워풀한 Python 프레임워크**입니다.

오늘은 LangChain이 무엇인지, 어떤 식으로 동작하는지 간단한 예제를 통해 살펴보겠습니다.

---

## 🚀 LangChain이란?

**LangChain**은 한마디로,

> "LLM을 중심으로 다양한 작업을 체계적이고 쉽게 처리할 수 있도록 도와주는 라이브러리"

입니다.

GPT 같은 모델에 단순히 질문하고 답변을 받는 것을 넘어,  
- 입력 프롬프트를 정교하게 설계하고,
- 여러 단계를 연결하고,
- 외부 데이터(문서, DB)와 상호작용하며,
- 복잡한 워크플로우를 구성할 수 있게 해줍니다.

특히 **검색(Retrieval)**, **체인(Chaining)**, **에이전트(Agent)** 기능이 강력합니다.

---

## 🛠 LangChain 기본 예제 살펴보기

아래는 아주 간단한 LangChain 사용 예제입니다.  
(※ 이번에는 제품 이름 대신 "**음식**"을 사용했습니다.)

### 📄 코드 예제

```python
# 필수 패키지 설치
# pip install langchain langchain-openai

import os
import warnings
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

warnings.filterwarnings("ignore", category=UserWarning)

# .env 파일에서 OpenAI API 키 불러오기
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")

# 프롬프트 템플릿 만들기
template = "{food} 음식 홍보 문구를 작성해줘"
prompt = PromptTemplate(input_variables=["food"], template=template)

# GPT 모델 준비
gpt = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

# "김치찌개"에 대해 프롬프트 완성
formatted_prompt = prompt.format(food='김치찌개')

# GPT에 요청하고 결과 받기
result = gpt.invoke(formatted_prompt)

# 결과 출력
print(f"결과: {result}")
```

### 🧩 코드 설명
- `.env` 파일에서 OpenAI API 키를 불러옵니다.
- `PromptTemplate` 클래스를 이용해 "**음식 홍보 문구를 작성해줘**" 라는 기본 틀을 만듭니다.
- GPT-3.5-turbo 모델을 사용해, 김치찌개에 대한 홍보 문구를 생성합니다.

---

## 📈 실행 결과 예시

출력되는 결과는 다음과 같이 자연스러운 마케팅 문구가 될 수 있습니다.

> "뜨끈하고 얼큰한 한입!  
> 깊고 진한 국물 맛, 김치찌개로 오늘 하루를 따뜻하게 채워보세요."

LangChain이 없었다면 이런 프롬프트 관리와 모델 호출을 매번 직접 일일이 짜야 했겠지만,  
LangChain 덕분에 **깔끔하고 확장성 높은 방식으로 작성**할 수 있습니다.

---

## ✨ LangChain을 왜 사용할까?

| 장점 | 설명 |
|:---|:---|
| **프롬프트 관리** | 다양한 입력 변수를 활용해 유연한 프롬프트를 작성할 수 있다. |
| **체인 연결** | 여러 작업(검색 → 요약 → 생성 등)을 순서대로 연결할 수 있다. |
| **외부 데이터 연동** | 문서, DB, API 등 외부 리소스를 쉽게 활용할 수 있다. |
| **에이전트 구성** | 조건에 따라 다양한 행동을 자동으로 선택하는 시스템을 만들 수 있다. |
| **확장성** | 작은 실습부터 대규모 서비스까지 자연스럽게 확장할 수 있다. |

---

# 📝 마무리

정리하자면,  
> **LangChain은 "LLM을 실용적으로 연결하고 활용하는 최고의 프레임워크"**입니다.

단순히 GPT에 질문하는 수준을 넘어서,  
- 프롬프트 관리
- 다단계 체인 구성
- 외부 데이터 결합

등을 손쉽게 구현할 수 있습니다.

AI를 진짜 서비스로 만들고 싶다면,  
**LangChain은 반드시 배워야 할 도구**입니다. 🚀
