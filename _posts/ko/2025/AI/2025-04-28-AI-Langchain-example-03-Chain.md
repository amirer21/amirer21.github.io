---
title: (LangChain) LangChain 체인이란 무엇인가? 예제와 함께 쉽게 이해하기
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
description: 인공지능 - LangChain 체인이란 무엇인가? 예제와 함께 쉽게 이해하기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


# 🛠 LangChain 체인이란 무엇인가? 예제와 함께 쉽게 이해하기

요즘 생성형 AI를 활용한 프로젝트를 만들다 보면,  
"프롬프트 만들기 → 모델 호출 → 결과 받기" 과정을 매번 반복하게 됩니다.

이 과정을 더 **깔끔하고 체계적으로 연결**해주는 도구가 있는데,  
바로 **LangChain의 체인(Chain)** 입니다.

오늘은 **LangChain Chain**의 개념을 이해하고,  
간단한 예제를 통해 **어떻게 사용하는지** 알아보겠습니다.

---

## 🔗 체인(Chain)이란?

**LangChain의 체인(Chain)**은  
> "프롬프트 → 모델 → 출력까지의 과정을 하나의 연결된 작업 흐름으로 묶은 것"  
입니다.

간단히 말하면,

- 프롬프트를 만들고
- LLM에 넘기고
- 결과를 받고

이 일련의 단계를 **하나의 객체**처럼 다룰 수 있게 만들어주는 기능입니다.

**즉, 체인은 여러 단계를 연결하는 "파이프라인"** 이라고 생각하면 됩니다.

---

## 🛠 LangChain 체인 예제 살펴보기

이번에는 "커피 머신"이라는 제품을 주제로  
프롬프트와 모델을 **체인**으로 연결해보겠습니다.

### 📄 전체 코드

```python
# 설치 필요
# pip install langchain langchain-openai

import os
import warnings
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

warnings.filterwarnings("ignore", category=UserWarning)

# API 키 로드
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")

# GPT 모델 준비
gpt = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

# 프롬프트 템플릿 정의
template = "{product} 제품 홍보 문구를 작성해줘"
prompt = PromptTemplate(input_variables=["product"], template=template)

# 프롬프트와 모델을 체인으로 연결
chain = prompt | gpt

# 체인 정보 출력
print(f"체인 :: {chain}\n type :: {type(chain)}")

# 체인 실행 (입력값 제공)
result = chain.invoke({'product': '커피 머신'})

# 결과 출력
print(f"결과: {result.content}")
```

---

## 🧩 코드 흐름 설명

1. **PromptTemplate**를 만들어 `{product}`라는 변수를 포함시킵니다.
2. **ChatOpenAI** 모델을 준비합니다.
3. `|` 연산자를 사용해 프롬프트와 모델을 **체인**으로 연결합니다.
4. 체인에 `invoke()` 메서드를 사용해 제품 이름(커피 머신)을 넘깁니다.
5. 모델이 홍보 문구를 작성해줍니다.

---

## 📈 예상 실행 결과

```plaintext
결과: "아침을 특별하게 시작하세요!  
우리 커피 머신으로 신선한 향과 부드러운 맛을 집에서도 간편하게 즐겨보세요."
```

매우 자연스럽고 마케팅에 바로 쓸 수 있는 문구를 얻을 수 있습니다.

---

## 🎯 체인을 사용하는 이유

| 장점 | 설명 |
|:---|:---|
| **코드 간결화** | 프롬프트 → 모델 호출 → 출력까지 한 줄로 연결할 수 있습니다. |
| **유연한 확장성** | 여러 프롬프트, 여러 모델, 후처리 단계를 체인으로 계속 추가할 수 있습니다. |
| **구조화된 개발** | 복잡한 AI 워크플로우를 모듈처럼 관리할 수 있습니다. |
| **직관적 사용** | `invoke()` 하나로 입력과 출력을 다룰 수 있습니다. |

---

# 📝 마무리

정리하자면,  
> **LangChain의 체인(Chain)은 프롬프트-모델-출력 과정을 하나로 묶는 강력한 연결 도구**입니다.

단순히 모델을 호출하는 것 이상으로,
- 여러 단계를 연결하고
- 조건부 흐름을 만들고
- 외부 시스템과 통합하는

진짜 **AI 애플리케이션**을 만들 때 필수적인 개념입니다.

체인을 이해하고 활용하기 시작하면,  
AI 프로젝트를 훨씬 더 체계적이고 확장성 있게 설계할 수 있게 됩니다. 🚀

---