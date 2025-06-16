---
title: 인공지능 - 실시간 웹캠 객체 인식 - YOLOv8을 활용한 AI 시각 시스템LangChain과 LM Studio로 로컬 LLM 스트리밍 실습하기
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- LangChain
- LLM
- LMStudio
tags:
- AI
- LangChain
- LLM
- LMStudio
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - LangChain과 LM Studio로 로컬 LLM 스트리밍 실습하기
article_tag1: AI
article_tag2: LMStudio
article_tag3: LLM
article_section: 
meta_keywords: AI, LMStudio, LLM, LangChain
last_modified_at: '2025-05-15 21:00:00 +0800'
---


## LangChain과 LM Studio로 로컬 LLM 스트리밍 실습하기

## 목차

1. LM Studio란?
2. 실습 목표
3. 기본 구성 요소
4. 단일 응답 처리 (`invoke`)
5. 실시간 스트리밍 응답 (`stream`)
6. 마무리

---

## 1. LM Studio란?

**LM Studio**는 로컬에서 LLM(Large Language Model)을 실행할 수 있도록 도와주는 데스크탑 애플리케이션입니다. Hugging Face에 있는 다양한 모델(Mistral, LLaMA 등)을 로컬 PC에서 다운로드해 실행할 수 있으며, **OpenAI API 호환 서버** 기능을 제공하여, 실제로 `langchain`이나 `OpenAI SDK`와도 동일한 방식으로 통신할 수 있습니다.

* API Endpoint: `http://127.0.0.1:1234/v1`
* API Key: `"lmstudio"` (형식상만 필요)

---

## 2. 실습 목표

이번 실습에서는 LangChain과 LM Studio를 연결하여 다음 두 가지 작업을 수행해 봅니다.

* **단일 질문에 대한 응답 출력**
* **스트리밍 방식으로 실시간 응답 출력**

---

## 3. 기본 구성 요소

아래는 LangChain의 `ChatOpenAI` 클래스를 사용하는 설정입니다.

```python
from langchain_openai import ChatOpenAI

BASE_URL = "http://127.0.0.1:1234/v1"
API_KEY = "lmstudio"
MODEL_NAME = "gpt-3.5-turbo"  # LM Studio에서 실행한 모델 이름
```

여기서 중요한 점은 `base_url`에 반드시 `/v1` 경로가 포함되어야 하고, `api_key`는 아무 값이나 사용해도 됩니다 (`lmstudio` 고정값 권장).

---

## 4. 단일 응답 처리 (`invoke`)

`invoke()` 함수는 하나의 질문을 보내고, 응답 전체를 한 번에 받아올 때 사용합니다.

```python
llm = ChatOpenAI(
    base_url=BASE_URL,
    api_key=API_KEY,
    model=MODEL_NAME
)

response = llm.invoke("자신에 대해 소개해줄래?")
print(response.content)
```

### 핵심 포인트

* **ChatOpenAI** 클래스는 LangChain의 LLM 통합 인터페이스입니다.
* `invoke()`는 간단한 대화 기반 요청에 적합하며, 텍스트 완성 전체를 한 번에 반환합니다.

---

## 5. 실시간 스트리밍 응답 (`stream`)

스트리밍 방식은 응답이 생성되는 순서대로 토큰을 받아오는 방식입니다. 사용자 경험이 즉각적으로 향상됩니다.

```python
llm_stream = ChatOpenAI(
    base_url=BASE_URL,
    api_key=API_KEY,
    model=MODEL_NAME
)

for chunk in llm_stream.stream("서울에 대해 간략히 알려줄래?"):
    print(chunk.content, end="", flush=True)
```

### 핵심 함수 설명

| 함수              | 설명                                   |
| --------------- | ------------------------------------ |
| `stream()`      | 응답을 한 번에 받지 않고, 토큰이 생성될 때마다 실시간으로 반환 |
| `chunk.content` | 생성된 응답 조각(토큰 단위)                     |
| `flush=True`    | 출력 버퍼를 바로 비워 실시간으로 출력되게 함            |

---

## 전체 코드

```py
# langchain_openai 설치 필요
# pip install langchain langchain-openai

from langchain_openai import ChatOpenAI

# ───────────────────────────────
# 1. 공통 설정
# ───────────────────────────────
BASE_URL = "http://127.0.0.1:1234/v1"  # 꼭 /v1 포함
API_KEY = "lmstudio"  # LM Studio는 이 키를 요구하지 않지만, 형식상 필요
MODEL_NAME = "gpt-3.5-turbo"  # LM Studio에서 실행 중인 모델 이름 그대로 사용 (예: mistral, llama2 등)

# ───────────────────────────────
# 2. 단일 요청 (invoke)
# ───────────────────────────────
llm = ChatOpenAI(
    base_url=BASE_URL,
    api_key=API_KEY,
    model=MODEL_NAME
)

response = llm.invoke("자신에 대해 소개해줄래?")
print("\n[단일 응답 결과]")
print(response.content)
print("================================")

# ───────────────────────────────
# 3. 스트리밍 요청 (stream)
# ───────────────────────────────
llm_stream = ChatOpenAI(
    base_url=BASE_URL,
    api_key=API_KEY,
    model=MODEL_NAME
)

print("\n[스트리밍 응답 결과]")
for chunk in llm_stream.stream("서울에 대해 간략히 알려줄래?"):
    print(chunk.content, end="", flush=True)
print("\n================================")

```


## 6. 마무리

LangChain과 LM Studio를 연동하면 OpenAI API를 쓰지 않고도 로컬에서 프라이버시를 지키며 LLM 기능을 활용할 수 있습니다. 이번 실습에서는 `invoke()`와 `stream()` 두 가지 요청 방식을 익혔고, 향후 Streamlit이나 Gradio UI에도 쉽게 확장할 수 있습니다.

> LM Studio의 OpenAI 호환 기능 덕분에, 기존 코드 변경 없이도 다양한 모델을 빠르게 테스트할 수 있다는 점이 큰 장점입니다.

---

다음 편에서는 Streamlit과 결합하여 실시간 챗봇 UI를 만드는 방법도 다룰 예정입니다.
