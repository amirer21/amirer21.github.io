---
title: "AI 세부 실습 05 - Streamlit 기초와 입력 폼"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- Streamlit
tags:
- AI
- Streamlit
- Form
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: "14번 실습 파일을 기준으로 Streamlit 기초 출력, Markdown, Form 입력을 정리합니다."
article_tag1: AI
article_tag2: Streamlit
article_tag3: Form
article_section: AI
meta_keywords: AI, Streamlit, Form, Python 웹앱
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# Streamlit 기초와 입력 폼

이 글은 다음 원본 실습 파일을 기준으로 정리합니다.

```text
14_streamlit_20250415_01.py
14_streamlit_20250415_02_markdown.py
14_streamlit_20250415_03_form.py
14_streamlit_20250415_04_form.py
14_streamlit_20250415_05_form.py
14_streamlit_chatgpt_과제_홍성학_0415_02.py
14_과제_홍성학_0415.py
```

14번 실습은 Streamlit을 처음 배우는 단계입니다.
Python 코드만으로 웹 화면을 만들고, 사용자의 입력을 받는 방법을 익힙니다.

## Streamlit 실행

Streamlit 파일은 다음처럼 실행합니다.

```bash
streamlit run 14_streamlit_20250415_01.py
```

일반 Python 실행과 다릅니다.

```bash
python 14_streamlit_20250415_01.py
```

위 방식으로 실행하면 Streamlit 웹앱이 제대로 뜨지 않을 수 있습니다.

## 기본 출력

```python
import streamlit as st

st.title("AI 실습 웹앱")
st.write("Streamlit으로 만든 첫 화면입니다.")
```

`st.title()`은 제목을 출력합니다.
`st.write()`는 텍스트, 숫자, 표, 데이터프레임까지 다양하게 출력할 수 있습니다.

## Markdown 출력

Markdown을 사용하면 글을 더 보기 좋게 만들 수 있습니다.

```python
st.markdown("""
# 큰 제목
## 작은 제목
- 목록 1
- 목록 2
""")
```

블로그 글을 쓰는 Markdown 문법과 비슷하게 사용할 수 있습니다.

## 입력 위젯

Streamlit은 입력창을 쉽게 만들 수 있습니다.

```python
name = st.text_input("이름")
age = st.number_input("나이", min_value=0, max_value=100)

if st.button("확인"):
    st.write(f"{name}님의 나이는 {age}세입니다.")
```

입력값은 Python 변수에 저장됩니다.

## Form 사용

여러 입력값을 한 번에 제출하려면 `st.form()`을 사용합니다.

```python
with st.form("user_form"):
    name = st.text_input("이름")
    age = st.number_input("나이", min_value=0, max_value=100)
    submit = st.form_submit_button("제출")

    if submit:
        st.write(f"이름: {name}, 나이: {age}")
```

폼을 쓰면 입력 중간마다 코드가 처리되는 것을 줄이고, 제출 버튼을 눌렀을 때 한 번에 처리할 수 있습니다.

## AI 앱으로 연결하기

Streamlit 입력값을 AI API에 전달하면 간단한 AI 웹앱이 됩니다.

```text
사용자 입력
-> Python 변수
-> AI API 요청
-> 답변 출력
```

예를 들어 사용자가 상품명을 입력하면 AI가 홍보 문구를 작성하게 만들 수 있습니다.

## 정리

14번 실습은 Streamlit의 기본기를 익히는 단계입니다.
제목, 텍스트, Markdown, 입력창, 버튼, Form을 이해하면 이후 챗봇이나 RAG 웹앱으로 확장할 수 있습니다.
