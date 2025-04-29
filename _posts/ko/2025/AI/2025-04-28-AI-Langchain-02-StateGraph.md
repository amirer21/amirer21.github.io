---
title: 인공지능 - LangChain으로 여행지 소개 문서 요약 시스템 만들기 — 구조와 원리 완벽 해설
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
description: 인공지능 - LangChain으로 여행지 소개 문서 요약 시스템 만들기 — 구조와 원리 완벽 해설
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


# 🛠 LangChain으로 여행지 소개 문서 요약 시스템 만들기 — 구조와 원리 완벽 해설

요즘 AI를 이용해 문서를 요약하거나, 문서 기반 질문에 답변하는 시스템을 많이 만듭니다.  
그 핵심에는 언제나 다음과 같은 과정이 숨어 있습니다:

> ✨ 문서를 적절히 쪼개고(chunk), 의미를 벡터로 변환(embedding)하고,  
> ✨ 질문에 맞는 부분을 유사도 검색(retrieval)하고,  
> ✨ GPT에 넘겨 답변을 생성하는 전체 흐름.

오늘은 이를 **LangChain**과 함께 어떻게 구축하는지,  
그리고 **StateGraph**를 활용한 프로세스 구성까지 함께 살펴보겠습니다.

---

## 🧩 LangChain 전체 흐름 요약

| 단계 | 설명 |
|:---|:---|
| 입력 | 문장 또는 문서 입력 (예: 여행지 소개) |
| 번역 | 입력을 다른 언어로 번역 (예: 한국어로) |
| 요약 | 번역된 문장을 간단히 요약 |
| 결과 출력 | 최종 요약된 문장 제공 |

---

## 📄 코드 구조

### 1. 모델 및 환경 설정

```python
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
import warnings

warnings.filterwarnings("ignore", category=UserWarning)
load_dotenv(dotenv_path='openapi_key.env')

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
```

- OpenAI의 `gpt-3.5-turbo` 모델을 사용합니다.
- `.env` 파일에서 API 키를 로드해 보안을 유지합니다.

---

### 2. 상태(State) 정의

```python
class Mystate(dict):
    sentence: str
    translate: str
    summary: str
```

- **State**는 입력부터 출력까지 흐름을 연결하는 데이터 구조입니다.
- 각 단계 함수는 이 `state`를 읽고, 업데이트합니다.

---

### 3. 단계별 작업 함수

```python
def translate(state):
    text = state['sentence']
    prompt = f"다음 문장을 한국어로 번역하세요:\n{text}"
    result = llm.invoke(prompt)
    return {'translate': result.content}

def summary(state):
    text = state['translate']
    prompt = f"다음 문장을 요약하세요:\n{text}"
    result = llm.invoke(prompt)
    return {'summary': result.content}
```

- `translate()`: 입력 문장을 **한국어로 번역**합니다.
- `summary()`: 번역된 문장을 **짧고 간결하게 요약**합니다.

---

### 4. StateGraph를 이용해 단계 연결

```python
from langgraph.graph import StateGraph
from langchain.schema.runnable import RunnableLambda

graph = StateGraph(Mystate)
graph.add_node("번역", RunnableLambda(translate))
graph.add_node("요약", RunnableLambda(summary))

graph.set_entry_point("번역")
graph.add_edge("번역", "요약")
graph.set_finish_point("요약")

runnable = graph.compile()
```

- **StateGraph**를 통해 프로세스 순서를 시각적으로 관리합니다:
  - "번역" → "요약" → 종료

✅ **StateGraph란?**  
함수들의 연결(Flow)을 명확하게 표현하고, 다양한 조건 분기(branching)도 쉽게 추가할 수 있게 해줍니다.

---

### 5. 문서 예시 입력 및 실행

```python
sentence = """
Paris is known for its beautiful landmarks such as the Eiffel Tower and the Louvre Museum.
It offers charming cafes, historic streets, and a romantic atmosphere.
Many tourists also enjoy visiting the Seine River and Montmartre district.
"""

result = runnable.invoke({"sentence": sentence})
print("📌 최종 요약 결과:", result)
```

- 문서 예시는 **"파리 여행지 소개"** 로 설정했습니다.
- 전체 문서를 한국어로 번역하고, 핵심만 요약합니다.

✅ **GPT 쿼리 매커니즘**  
- Prompt: "다음 문장을 한국어로 번역하세요: (텍스트)"
- → 번역 결과를 다시: "다음 문장을 요약하세요: (번역된 텍스트)"
- → 최종 요약 생성

---

## 🔍 Chunk, Embedding, Retrieval은 어떻게 연관될까?

이번 예제에서는 작은 문장 하나만 처리했지만,  
긴 문서나 책을 처리하려면 아래 단계를 추가로 거쳐야 합니다:

| 개념 | 설명 |
|:---|:---|
| **Chunk 분할** | 긴 문서를 일정 길이(예: 500~1000자)로 나눕니다. |
| **Embedding(임베딩)** | 각 청크를 1536차원 벡터로 변환해 의미를 숫자화합니다. |
| **Vector DB 저장** | 변환된 벡터를 FAISS 같은 벡터 데이터베이스에 저장합니다. |
| **Retrieval(검색)** | 사용자의 질문도 임베딩한 후, 의미상 가까운 청크를 검색합니다. |
| **Context + Query** | 검색된 문맥(Context)과 질문(Query)을 합쳐 LLM에 보내 답변 생성합니다. |

👉 **짧은 문장 예제**든, **긴 책 전체 요약**이든  
👉 핵심은 결국 **Chunk → Embedding → Retrieval → GPT 쿼리**입니다.

---

# 📝 마무리

정리하면,

> **LangChain은 여러 작업(번역, 요약, 검색)을 연결하는 파이프라인을 아주 깔끔하게 구성할 수 있게 도와주는 프레임워크입니다.**

특히:
- 문서를 어떻게 쪼갤까(Chunking)
- 어떻게 의미를 표현할까(Embedding)
- 어떻게 필요한 부분만 찾을까(Retrieval)
- 어떻게 최종 답변을 만들까(GPT 쿼리)

이 4단계를 이해하는 것이 **RAG 기반 AI 서비스**를 만드는 첫걸음입니다.

---

# 🚀 다음 글 예고

👉 "**StateGraph에서 조건 분기(Branching) 처리하는 방법**"  
👉 "**stuff vs map_reduce vs refine 체인 방식 비교**"  
👉 "**Streamlit으로 문서 요약 웹앱 만들기**"  