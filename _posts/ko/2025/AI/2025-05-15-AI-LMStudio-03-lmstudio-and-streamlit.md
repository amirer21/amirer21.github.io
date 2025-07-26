---
title: (LM Studio) LangChain과 LM Studio로 Streamlit 실시간 답변 UI 만들기
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- LangChain
- LLM
- HuggingFace
- LMStudio
tags:
- AI
- LangChain
- LLM
- HuggingFace
- LMStudio
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - LangChain과 LM Studio로 Streamlit 실시간 답변 UI 만들기
article_tag1: AI
article_tag2: HuggingFace
article_tag3: LLM
article_section: 
meta_keywords: AI, HuggingFace, LLM, LangChain, LMStudio
last_modified_at: '2025-05-15 21:00:00 +0800'
---


## LangChain과 LM Studio로 Streamlit 실시간 답변 UI 만들기

## 목차

1. 개요
2. 설치 및 준비
3. 프로젝트 목표
4. 스트리밍 핸들러 설계
5. LLM 설정 및 사용자 입력 처리
6. 전체 동작 흐름 설명
7. 마무리

---

## 1. 개요

이 글에서는 LangChain과 LM Studio, 그리고 Streamlit을 활용하여 사용자가 입력한 질문에 대해 **로컬 LLM이 실시간으로 답변을 생성**해주는 간단한 웹 UI를 구현해봅니다. ChatGPT처럼 토큰이 하나씩 출력되는 형태를 지원하여, 사용자 경험을 자연스럽게 만듭니다.

---

## 2. 설치 및 준비

먼저 필요한 라이브러리를 설치합니다:

```bash
pip install streamlit langchain langchain-openai
```

그리고 LM Studio를 실행한 뒤, 모델을 로드하고 `OpenAI API Compatible Server`를 켜둡니다.
기본 주소는 `http://127.0.0.1:1234/v1`이며, API Key는 `"lmstudio"`로 설정합니다.

---

## 3. 프로젝트 목표

* **Streamlit**으로 간단한 입력창 + 버튼 UI 구성
* **LangChain**을 통해 LM Studio LLM 호출
* **스트리밍 방식**으로 실시간 답변 생성
* 사용자의 이전 응답도 화면에 표시

---

## 4. 스트리밍 핸들러 설계

LangChain은 LLM에서 토큰이 생성될 때마다 이벤트를 발생시킬 수 있도록 `BaseCallbackHandler`를 제공합니다.
이를 활용해 실시간 출력용 클래스를 아래와 같이 정의합니다:

```python
class StreamHandler(BaseCallbackHandler):
    def __init__(self, container):
        self.container = container
        self.output = ""

    def on_llm_new_token(self, token: str, **kwargs) -> None:
        self.output += token
        self.container.markdown(f"**{self.output}**")
```

* `container`: `st.empty()`로 생성한 출력 위치
* `output`: 스트리밍된 토큰들을 누적 저장
* `markdown()`을 통해 실시간으로 출력 업데이트

---

## 5. LLM 설정 및 사용자 입력 처리

LM Studio를 기반으로 LangChain의 `ChatOpenAI` 객체를 생성합니다:

```python
llm_stream = ChatOpenAI(
    base_url="http://127.0.0.1:1234/v1",
    api_key="lmstudio",
    model="gpt-3.5-turbo",  # LM Studio에서 실행 중인 모델명
    temperature=0.7,
    streaming=True,
    callbacks=[stream_handler]
)
```

그리고 `invoke()` 메서드를 사용해 스트리밍 출력이 가능하도록 처리합니다.

---

## 6. 전체 동작 흐름 설명

아래는 전체 동작 로직을 요약한 구조입니다:

```python
user_input = st.text_input("입력:", "")
if st.button("입력"):
    response_placeholder = st.empty()
    handler = StreamHandler(response_placeholder)
    llm = ChatOpenAI(..., callbacks=[handler])
    llm.invoke(user_input)
    st.session_state.response = handler.output
```

* 사용자가 입력창에 텍스트를 입력
* 버튼 클릭 시, `llm.invoke()`로 질문 전송
* 모델 응답이 스트리밍되어 `StreamHandler`가 화면에 토큰 단위로 출력
* 마지막 응답은 `session_state`에 저장되어 재출력 가능

---

## 7. 마무리

이처럼 Streamlit과 LangChain, 그리고 LM Studio를 활용하면 로컬 LLM 기반의 대화형 웹 앱을 쉽게 만들 수 있습니다. 실시간 출력 기능을 통해 대화가 보다 자연스럽고 즉각적으로 느껴지며, 향후 사용자 맞춤형 챗봇 UI로 확장하기에도 매우 적합한 구조입니다.

> 다음 글에서는 이 구조를 확장하여 PDF 질의응답, 챗 히스토리 저장 등으로 발전시키는 방법도 다룰 예정입니다.

이 프로젝트를 시작으로 나만의 로컬 챗봇이나 도메인 특화 QA 앱을 만들어보세요!
