---
title: "AI 세부 실습 10 - 대화형 챗봇과 Streamlit Chat UI"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- Chatbot
tags:
- AI
- Chatbot
- Streamlit
- Conversation
toc: true
toc_sticky: true
toc_label: 목차
description: "21-22, 24번 실습 파일을 기준으로 대화형 챗봇, 세션, 스트리밍 출력 흐름을 정리합니다."
article_tag1: AI
article_tag2: Chatbot
article_tag3: Streamlit
article_section: AI
meta_keywords: AI, 챗봇, Streamlit, ConversationChain, Chat UI
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# 대화형 챗봇과 Streamlit Chat UI

이 글은 다음 실습 주제를 기준으로 정리합니다.

- ConversationChain으로 대화 기록 유지
- 최신 LangChain 방식의 대화 체인
- Streamlit 챗봇 기본 UI
- 컨테이너를 활용한 답변 출력
- session_state로 대화 기록 저장
- Streamlit 채팅 컴포넌트 활용
- 토큰 단위 스트리밍 채팅

이 실습은 한 번 묻고 끝나는 AI가 아니라, 대화 기록을 유지하는 챗봇을 만드는 내용입니다.

## 대화 기록이 필요한 이유

사용자가 이렇게 질문한다고 가정합니다.

```text
톰 소여에 대해 알려줘.
그 인물의 친구는 누구야?
```

두 번째 질문의 "그 인물"은 앞 질문을 기억해야 이해할 수 있습니다.
그래서 챗봇에는 대화 기록이 필요합니다.

## Streamlit session_state

Streamlit은 입력이 발생할 때마다 코드가 다시 실행됩니다.
대화 기록을 유지하려면 `st.session_state`에 저장합니다.

```python
import streamlit as st

if "messages" not in st.session_state:
    st.session_state.messages = []

user_input = st.chat_input("질문을 입력하세요")

if user_input:
    st.session_state.messages.append({
        "role": "user",
        "content": user_input,
    })
```

## Chat UI 출력

```python
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])
```

`role`은 보통 `user`와 `assistant`를 사용합니다.

## 스트리밍 출력

스트리밍은 답변이 완성될 때까지 기다렸다가 한 번에 보여주는 것이 아니라, 생성되는 대로 조금씩 보여주는 방식입니다.

```text
답변 생성 중...
한 글자 또는 한 토큰씩 화면에 표시
```

사용자 입장에서는 AI가 실시간으로 답하는 느낌을 받습니다.

## 챗봇 구조

```text
사용자 입력
-> 대화 기록에 추가
-> AI 모델 호출
-> AI 답변 저장
-> 화면에 전체 메시지 출력
```

RAG와 연결하면 문서 기반 챗봇이 됩니다.

## 정리

21-22, 24번 실습은 AI 앱의 사용자 경험을 개선하는 단계입니다.
대화 기록, Chat UI, 스트리밍을 이해하면 실제 서비스 형태의 챗봇에 가까워집니다.
