---
title: (LangChain) LangChain ModelLaboratory로 여러 LLM을 비교해보자!
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
description: 인공지능 - LangChain ModelLaboratory로 여러 LLM을 비교해보자!
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


# 🌟 LangChain ModelLaboratory로 여러 LLM을 비교해보자!

최근 생성형 AI를 사용하다 보면 이런 고민을 하게 됩니다.

> "GPT만 쓸까? 아니면 다른 오픈소스 모델도 괜찮을까?"  
> "모델별로 답변 스타일이나 정확도는 얼마나 다를까?"

이럴 때 모델들을 손쉽게 비교하고 실험할 수 있도록 도와주는 강력한 기능이 바로  
**LangChain의 ModelLaboratory**입니다.

오늘은 간단한 예제를 통해 **ModelLaboratory**가 무엇이고, 어떻게 사용하는지 살펴보겠습니다!

---

## 🛠 ModelLaboratory란?

**ModelLaboratory**는 LangChain에서 제공하는 기능으로,  
> "여러 LLM(대형 언어 모델)을 동시에 실행해 결과를 비교하는 도구"  
입니다.

- GPT, Llama, Claude, Mistral 같은 다양한 모델들을
- 하나의 프롬프트에 대해 동시에 테스트하고
- 결과를 비교 분석할 수 있게 해줍니다.

덕분에 **모델 선택**과 **성능 평가**가 훨씬 쉬워집니다!

---

## 📄 기본 사용 예제

이번에는 "세계에서 가장 큰 바다는 어디야?" 라는 질문을  
**GPT-3.5**와 **Llama3** 모델에게 동시에 던져서 비교해보겠습니다.

### 전체 코드

```python
# 설치 필요
# pip install langchain langchain-openai

import os
import warnings
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_ollama import ChatOllama
from langchain.model_laboratory import ModelLaboratory

warnings.filterwarnings("ignore", category=UserWarning)

# API 키 로드
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")

# 모델 준비
gpt = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
llama = ChatOllama(model="llama3", temperature=0)  # 로컬에 설치된 Llama3 모델 사용

# ModelLaboratory 초기화
model_lab = ModelLaboratory.from_llms([gpt, llama])

# 비교할 프롬프트
prompt = "세계에서 가장 큰 바다는 어디야?"

# 모델 비교 실행
model_lab.compare(prompt)
```

---

## 🧩 코드 설명

1. `.env` 파일을 통해 OpenAI API 키를 불러옵니다.
2. `ChatOpenAI`로 GPT-3.5-turbo를, `ChatOllama`로 Llama3를 준비합니다.
3. `ModelLaboratory.from_llms()`를 통해 두 모델을 등록합니다.
4. `compare()` 메서드를 사용해 동일한 질문을 두 모델에 동시에 던집니다.

---

## 📈 예상 결과 예시

실행 결과는 대략 다음과 같이 출력됩니다.

**gpt-3.5-turbo 모델의 답변:**

> "세계에서 가장 큰 바다는 태평양입니다.  
> 태평양은 지구 표면의 약 30%를 차지하고 있으며, 가장 넓은 바다로 잘 알려져 있습니다."

**llama3 모델의 답변:**

> "The Pacific Ocean is the largest ocean on Earth, covering about one-third of the planet's surface."

두 모델 모두 정확한 답을 주었지만,
- **GPT**는 한글로 상세하게 설명했고,
- **Llama**는 영어로 간결하게 설명하는 스타일을 보였습니다.

이런 식으로 **모델 간 스타일 차이, 표현 방식, 세부 정보량** 등을 비교할 수 있습니다!

---

## 🎯 ModelLaboratory를 사용하는 이유

| 이유 | 설명 |
|:---|:---|
| **모델 성능 비교** | 같은 질문을 여러 모델에 동시에 테스트할 수 있다. |
| **답변 스타일 분석** | 어떤 모델이 더 친절하거나 더 정확한지 쉽게 비교할 수 있다. |
| **최적 모델 선택** | 서비스 성격에 맞는 모델을 고를 수 있다. (예: 짧은 답 vs 긴 설명) |
| **개발 시간 단축** | 여러 모델을 번갈아 테스트할 필요 없이 한 번에 결과를 얻을 수 있다. |

---

# 📝 마무리

요약하자면,  
> **ModelLaboratory는 여러 LLM을 동시에 비교 분석할 수 있게 해주는 LangChain의 강력한 도구**입니다.

- 모델 선택을 고민할 때
- 성능 튜닝을 하고 싶을 때
- 답변 스타일을 분석하고 싶을 때

**ModelLaboratory**를 사용하면 훨씬 더 효율적으로 실험하고 결론을 낼 수 있습니다. 🚀

---