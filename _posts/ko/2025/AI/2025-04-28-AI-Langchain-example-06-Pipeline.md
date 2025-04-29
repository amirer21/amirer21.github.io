---
title: 인공지능 - LangChain 파이프라인 체인 만들기: 번역하고 요약하는 워크플로우
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
description: 인공지능 - LangChain 파이프라인 체인 만들기: 번역하고 요약하는 워크플로우
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


# 🛠 LangChain 파이프라인 체인 만들기: 번역하고 요약하는 워크플로우

생성형 AI를 다루다 보면  
"입력 문장을 번역하고, 요약하고, 후처리까지"  
**여러 단계를 연결해서 작업**하고 싶을 때가 많습니다.

그때마다 코드로 모든 단계를 일일이 작성하는 것은 매우 비효율적입니다.  
이 문제를 깔끔하게 해결해주는 방법이 바로,  
**LangChain의 체인(Chain)과 파이프라인(Pipeline) 구성**입니다.

오늘은 하나의 입력을  
**1) 한글로 번역 → 2) 요약**하는 과정을  
**한 줄 흐름(chain)** 으로 만드는 방법을 알아보겠습니다!

---

## 🛠 전체 코드 예제

아래는 예제 코드입니다.  
(※ 번역 대상 문장은 "Google이 새로운 AI 연구소를 설립했다"로 설정했습니다.)

```python
# 설치 필요
# pip install langchain langchain-openai

import os
import warnings
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda

warnings.filterwarnings("ignore", category=UserWarning)

# API 키 로드
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")

# 1. LLM 모델 준비
gpt = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

# 2. 프롬프트 준비
prompt_translate = PromptTemplate.from_template(
    "다음 문장을 한글로 번역하세요:\n\n{sentence}"
)
prompt_summary = PromptTemplate.from_template(
    "다음 문장을 한 문장으로 요약하세요:\n\n{translation}"
)

# 3. 체인 구성 (| 연산자 활용)
chain = (
    prompt_translate
    | gpt
    | StrOutputParser()
    | RunnableLambda(lambda output: {"translation": output})
    | prompt_summary
    | gpt
    | StrOutputParser()
)

# 4. 실행
input_data = {"sentence": "Google has established a new AI research center in Paris."}
result = chain.invoke(input_data)

print("📌 최종 요약 결과:", result)
```

---

## 🧩 코드 흐름 설명

1. **프롬프트 1 (번역용)**: 입력 문장을 **한글로 번역**하도록 지시합니다.
2. **gpt 모델 호출**: 번역 작업 수행.
3. **출력 파싱 (StrOutputParser)**: GPT의 결과를 문자열로 정리합니다.
4. **Lambda 함수**: 번역 결과를 `"translation"` 키로 감싸서 다음 프롬프트에 넘깁니다.
5. **프롬프트 2 (요약용)**: 번역된 문장을 **한 문장으로 요약**하라고 지시합니다.
6. **gpt 모델 호출**: 요약 작업 수행.
7. **최종 결과 출력**: 완성된 요약문을 출력합니다.

---

## 📈 예상 출력 결과

실행하면 다음과 같은 결과가 출력됩니다:

```plaintext
📌 최종 요약 결과: 구글이 파리에 새로운 AI 연구소를 설립했습니다.
```

처음에는 영어 문장이었지만,
- 한글 번역
- 자연스러운 요약

까지 자동으로 처리된 것을 볼 수 있습니다!

---

## 🎯 이렇게 체인을 구성하면 좋은 점

| 장점 | 설명 |
|:---|:---|
| **여러 작업을 자동 연결** | 번역 → 요약처럼 여러 단계를 자동으로 이어서 처리할 수 있다. |
| **코드 간결화** | 한 줄 체인 연결로 복잡한 로직을 깔끔하게 표현할 수 있다. |
| **확장성** | 이후에도 요약 → 감성 분석 같은 추가 작업을 쉽게 이어붙일 수 있다. |
| **유지보수 편리** | 각 단계가 명확히 분리되어 있어 수정이나 교체가 쉽다. |

---

# 📝 마무리

정리하자면,  
> **LangChain 체인을 파이프라인처럼 구성하면 여러 AI 작업을 자연스럽게 이어서 처리할 수 있습니다.**

- 하나의 문장을 입력하면
- 여러 단계를 거쳐
- 최종 깔끔한 결과물을 자동으로 만들어낼 수 있습니다.

특히 번역, 요약, 분석, 데이터 가공 같은 작업을  
**자동화하려는 모든 프로젝트**에서 매우 유용하게 활용할 수 있습니다. 🚀

---