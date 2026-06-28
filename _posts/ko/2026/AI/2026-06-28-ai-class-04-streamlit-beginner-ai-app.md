---
title: "AI 강의 정리 04 - Streamlit으로 AI 웹앱 만들기"
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
- Python
- WebApp
toc: true
toc_sticky: true
toc_label: 목차
description: "Streamlit 기초 위젯, 폼, 파일 업로드, 탭, 사이드바, SQLite 저장까지 비전공자 기준으로 정리합니다."
article_tag1: AI
article_tag2: Streamlit
article_tag3: Python
article_section: AI
meta_keywords: AI, Streamlit, Python, 웹앱, 챗봇
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# Streamlit이란?

Streamlit은 Python 코드만으로 간단한 웹앱을 만들 수 있게 해 주는 도구입니다.

일반적인 웹 개발은 HTML, CSS, JavaScript, 서버 프레임워크를 함께 알아야 합니다.
하지만 Streamlit은 Python 문법만으로 입력창, 버튼, 파일 업로드, 그래프, 챗봇 화면을 만들 수 있습니다.

강의 폴더에서는 다음 파일들이 Streamlit 실습에 해당합니다.

```text
14_streamlit_20250415_01.py
14_streamlit_20250415_02_markdown.py
14_streamlit_20250415_03_form.py
14_streamlit_20250415_04_form.py
14_streamlit_20250415_05_form.py
15_streamlit_20250416_01_file.py
15_streamlit_20250416_02_tab.py
15_streamlit_20250416_03_sidebar.py
15_streamlit_20250416_04_sidebar.py
16_streamlit_20250417_01_file_upload.py
16_streamlit_20250417_03.py
16_streamlit_20250417_07_img_db.py
21_streamlit_20250423_04_ChatBot_session.py
22_streamlit_20250424_03_ChatBot_streamlit_chat_module.py
```

## 설치와 실행

Streamlit은 다음처럼 설치합니다.

```bash
pip install streamlit
```

실행은 `python 파일명.py`가 아니라 다음 명령을 사용합니다.

```bash
streamlit run 14_streamlit_20250415_01.py
```

실행하면 브라우저가 열리고 Python 코드로 만든 화면이 나타납니다.

## 가장 간단한 화면

```python
import streamlit as st

st.title("나의 첫 AI 웹앱")
st.write("Streamlit으로 만든 화면입니다.")
```

`st.title()`은 큰 제목을 보여줍니다.
`st.write()`는 텍스트, 숫자, 표, 데이터프레임 등을 화면에 출력합니다.

## 입력창 만들기

사용자에게 값을 입력받으려면 `text_input`, `number_input`, `date_input` 같은 함수를 사용합니다.

```python
import streamlit as st

name = st.text_input("이름:")
age = st.number_input("나이:", min_value=0, max_value=100, step=1)

if st.button("확인"):
    st.write(f"이름: {name}, 나이: {age}")
```

비전공자 입장에서 중요한 점은 "입력창도 변수에 담긴다"는 것입니다.

```python
name = st.text_input("이름:")
```

이 코드는 화면에 입력창을 만들고, 사용자가 입력한 값을 `name` 변수에 저장합니다.

## form 사용하기

`16_streamlit_20250417_03.py`는 입력 폼과 SQLite 저장을 다룹니다.

폼은 여러 입력값을 한 번에 제출할 때 사용합니다.

```python
import streamlit as st

with st.form("myform"):
    name = st.text_input("이름:")
    age = st.number_input("나이:", value=0, step=1, min_value=0, max_value=100)
    birth = st.date_input("생일:")
    submit = st.form_submit_button("확인")

    if submit:
        st.write(f"이름:{name} 나이:{age} 생일:{birth}")
```

`with st.form("myform"):` 아래에 있는 입력 요소들은 하나의 묶음이 됩니다.
사용자가 `확인` 버튼을 눌렀을 때 한 번에 처리됩니다.

## SQLite에 저장하기

강의 코드에서는 입력값을 SQLite 데이터베이스에 저장합니다.

```python
import sqlite3

conn = sqlite3.connect("test.db")

def insert_data(name, age, birth):
    sql = "insert into student(name, age, birth) values(?, ?, ?)"
    cur = conn.cursor()
    cur.execute(sql, (name, age, birth))
    conn.commit()
    return "추가성공"
```

여기서 중요한 부분은 `?`입니다.

```python
values(?, ?, ?)
```

사용자 입력값을 SQL 문자열에 직접 붙이지 않고 `?` 자리에 안전하게 전달합니다.
이 방식은 SQL Injection 같은 문제를 줄이는 기본 습관입니다.

전체 흐름은 다음과 같습니다.

```text
사용자가 화면에 입력
-> form 제출
-> insert_data 함수 실행
-> SQLite DB에 저장
-> 성공 메시지 출력
```

## 파일 업로드

AI 서비스에서는 사용자가 PDF, 이미지, CSV 파일을 업로드하는 경우가 많습니다.
Streamlit에서는 `file_uploader`를 사용합니다.

```python
uploaded_file = st.file_uploader("파일을 선택하세요")

if uploaded_file is not None:
    st.write(uploaded_file.name)
    st.write(uploaded_file.type)
```

활용 예시는 다음과 같습니다.

- 이미지 업로드 후 설명 생성
- PDF 업로드 후 요약
- CSV 업로드 후 데이터 분석
- 음성 파일 업로드 후 텍스트 변환

## 탭과 사이드바

화면이 복잡해지면 탭과 사이드바를 사용합니다.

```python
tab1, tab2 = st.tabs(["요약", "상세"])

with tab1:
    st.write("요약 결과")

with tab2:
    st.write("상세 분석")
```

사이드바는 설정값을 넣을 때 좋습니다.

```python
temperature = st.sidebar.slider("창의성", 0.0, 1.0, 0.3)
model_name = st.sidebar.selectbox("모델", ["기본 모델", "고급 모델"])
```

AI 앱에서는 보통 사이드바에 모델명, temperature, 업로드 옵션, 검색 개수 같은 설정을 둡니다.

## 챗봇 화면 만들기

Streamlit은 챗봇 UI도 쉽게 만들 수 있습니다.

```python
import streamlit as st

if "messages" not in st.session_state:
    st.session_state.messages = []

user_input = st.chat_input("질문을 입력하세요")

if user_input:
    st.session_state.messages.append({"role": "user", "content": user_input})
    st.session_state.messages.append({"role": "assistant", "content": "AI 답변 예시입니다."})

for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.write(message["content"])
```

여기서 `st.session_state`가 중요합니다.

Streamlit은 버튼을 누르거나 입력할 때마다 코드가 다시 실행됩니다.
그런데 대화 기록은 유지되어야 합니다.
이때 `st.session_state`에 메시지를 저장합니다.

## AI 앱으로 확장하기

Streamlit과 OpenAI API를 연결하면 다음 구조가 됩니다.

```text
사용자 질문 입력
-> Streamlit이 질문을 Python 변수로 받음
-> OpenAI API 호출
-> AI 답변을 Streamlit 화면에 출력
```

예시는 다음과 같습니다.

```python
from openai import OpenAI
import streamlit as st

client = OpenAI()

question = st.chat_input("질문을 입력하세요")

if question:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": question}],
    )
    st.write(response.choices[0].message.content)
```

강의 코드의 모델명은 수업 당시 기준이므로, 실습 시점에 계정에서 사용 가능한 모델명으로 바꾸면 됩니다.

## 정리

Streamlit은 AI 실습 결과를 사람에게 보여주는 가장 쉬운 방법 중 하나입니다.

- `st.write()`로 출력합니다.
- `st.text_input()`으로 입력을 받습니다.
- `st.form()`으로 여러 값을 한 번에 제출합니다.
- `st.file_uploader()`로 파일을 받습니다.
- `st.session_state`로 대화 상태를 유지합니다.
- SQLite와 연결하면 간단한 저장 기능도 만들 수 있습니다.

다음 글에서는 임베딩, 벡터 검색, RAG를 다룹니다. 이 내용은 문서 기반 챗봇을 만들 때 핵심이 됩니다.
