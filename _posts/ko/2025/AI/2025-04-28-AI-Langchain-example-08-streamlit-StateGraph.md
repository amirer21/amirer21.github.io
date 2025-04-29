---
title: 인공지능 - LangChain StateGraph를 활용한 번역 + 요약 파이프라인 만들기
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
description: 인공지능 - LangChain StateGraph를 활용한 번역 + 요약 파이프라인 만들기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


# 🛠 LangChain StateGraph를 활용한 번역 + 요약 파이프라인 만들기

AI 모델을 활용해 문서를 다룰 때,  
단순히 텍스트 생성만 하는 게 아니라  
**여러 단계를 거쳐 자연스럽게 처리**하는 경우가 많습니다.

예를 들면:
- **1단계**: 영어 문장을 한글로 번역하고
- **2단계**: 번역한 문장을 간결하게 요약하는 작업.

이렇게 복잡한 작업을 체계적으로 연결하고 싶다면,  
**LangChain의 StateGraph**를 활용하면 훨씬 깔끔하고 관리하기 쉬운 구조를 만들 수 있습니다.

오늘은 이 과정을 실습해보면서,  
**StateGraph**의 개념과 사용법을 함께 익혀보겠습니다!

---

## 🛠 전체 코드 흐름

(※ 이번 예제 문장은 "NASA가 달 기지 건설 계획을 발표했다"로 변경해서 설명합니다.)

### 📄 전체 코드

```python
# 설치 필요
# pip install langchain langchain-openai langgraph

import os
import warnings
from dotenv import load_dotenv
from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain.schema.runnable import RunnableLambda
from langgraph.graph import StateGraph

warnings.filterwarnings("ignore", category=UserWarning)

# API 키 로드
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")

# LLM 모델 준비
llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

# ✅ 상태 정의
class MyState(dict):
    sentence: str
    translate: str
    summary: str

# 1단계: 번역 함수
def translate(state):
    text = state['sentence']
    prompt = f"다음 문장을 한국어로 번역하세요:\n{text}"
    result = llm.invoke(prompt)
    return {'translate': result.content}

# 2단계: 요약 함수
def summarize(state):
    text = state['translate']
    prompt = f"다음 문장을 한 문장으로 요약하세요:\n{text}"
    result = llm.invoke(prompt)
    return {'summary': result.content}

# ✅ StateGraph 생성
graph = StateGraph(MyState)
graph.add_node("번역", RunnableLambda(translate))
graph.add_node("요약", RunnableLambda(summarize))

graph.set_entry_point("번역")
graph.add_edge("번역", "요약")
graph.set_finish_point("요약")

# 그래프 컴파일
runnable = graph.compile()

# ✅ 입력 문장
sentence = """
NASA has announced plans to establish a permanent lunar base by 2035. 
The project aims to support scientific research, enable sustainable human presence on the Moon, and serve as a stepping stone for future Mars missions.
Construction will involve international collaboration, innovative building materials, and advanced robotics to withstand harsh lunar conditions.
"""

# 체인 실행
result = runnable.invoke({"sentence": sentence})
print("📌 최종 요약 결과:", result)
```

---

## 🧩 코드 설명

| 단계 | 설명 |
|:---|:---|
| 1 | **StateGraph**를 만들고, 상태(`MyState`)를 정의합니다. |
| 2 | **"번역" 노드**를 추가해 입력 문장을 한국어로 번역합니다. |
| 3 | **"요약" 노드**를 추가해 번역된 문장을 한 문장으로 요약합니다. |
| 4 | **번역 → 요약** 흐름으로 엣지를 연결합니다. |
| 5 | 전체 그래프를 `compile()` 해서 실행 가능한 파이프라인으로 만듭니다. |
| 6 | 입력 문장을 넣고 `invoke()` 하면 자동으로 번역과 요약이 이어서 실행됩니다. |

---

## 📈 실행 결과 예시

```plaintext
📌 최종 요약 결과:
NASA는 2035년까지 달에 영구 기지를 건설해 과학 연구와 지속 가능한 인간 거주, 화성 탐사를 위한 발판을 마련할 계획입니다.
```

아주 자연스럽고, 필요한 핵심만 담은 요약 결과를 얻을 수 있습니다!

---

## 🎯 StateGraph를 사용하는 이유

| 이유 | 설명 |
|:---|:---|
| **복잡한 워크플로우 구성** | 여러 단계를 순서대로 연결할 수 있어, 코드 관리가 쉬워집니다. |
| **모듈화된 설계** | 번역, 요약 같은 각각의 작업을 독립적인 노드로 구성할 수 있습니다. |
| **확장성** | 추후 '감성 분석', '태깅' 같은 추가 작업을 손쉽게 연결할 수 있습니다. |
| **디버깅 용이** | 중간 상태를 쉽게 추적하고 디버깅할 수 있습니다. |

---

# 📝 마무리

정리하자면,  
> **LangChain StateGraph는 여러 단계를 체계적으로 연결해 복잡한 AI 파이프라인을 깔끔하게 구현할 수 있게 해주는 도구**입니다.

번역 → 요약 같은 간단한 흐름은 물론,  
추후 복잡한 브랜칭(조건 분기)이나 다양한 후처리 작업까지도 확장할 수 있습니다.

AI 워크플로우를 제대로 관리하고 싶다면,  
**StateGraph**를 꼭 활용해보세요! 🚀

---