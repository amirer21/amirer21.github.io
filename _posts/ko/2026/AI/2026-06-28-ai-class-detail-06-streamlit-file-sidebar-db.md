---
title: "AI 세부 실습 06 - Streamlit 파일 업로드, 탭, 사이드바, DB 저장"
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
- SQLite
- File Upload
toc: true
toc_sticky: true
toc_label: 목차
description: "15-16번 실습 파일을 기준으로 Streamlit 파일 업로드, 탭, 사이드바, SQLite 저장을 정리합니다."
article_tag1: AI
article_tag2: Streamlit
article_tag3: SQLite
article_section: AI
meta_keywords: AI, Streamlit, SQLite, 파일 업로드, 사이드바
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# Streamlit 파일 업로드, 탭, 사이드바, DB 저장

이 글은 다음 원본 실습 파일을 기준으로 정리합니다.

```text
15_streamlit_20250416_01_file.py
15_streamlit_20250416_02_tab.py
15_streamlit_20250416_03_sidebar.py
15_streamlit_20250416_04_sidebar.py
16_streamlit_20250417_01_file_upload.py
16_streamlit_20250417_02.py
16_streamlit_20250417_03.py
16_streamlit_20250417_04_pandas.py
16_streamlit_20250417_05.py
16_streamlit_20250417_06_routing.py
16_streamlit_20250417_07_img_db.py
```

15-16번 실습은 Streamlit 앱을 실제 서비스에 가깝게 만드는 내용입니다.

## 파일 업로드

AI 앱에서 파일 업로드는 매우 중요합니다.

```python
uploaded_file = st.file_uploader("파일을 선택하세요")

if uploaded_file is not None:
    st.write(uploaded_file.name)
    st.write(uploaded_file.type)
```

업로드된 파일은 다음 작업에 사용할 수 있습니다.

- PDF 요약
- 이미지 설명
- CSV 분석
- 음성 텍스트 변환

## 탭

탭은 한 화면에서 여러 기능을 나눌 때 좋습니다.

```python
tab1, tab2 = st.tabs(["입력", "결과"])

with tab1:
    st.write("입력 화면")

with tab2:
    st.write("결과 화면")
```

AI 앱에서는 `질문`, `검색 결과`, `원문`, `설정` 같은 영역을 탭으로 나눌 수 있습니다.

## 사이드바

사이드바는 설정값을 배치하기 좋습니다.

```python
model = st.sidebar.selectbox("모델", ["gpt-3.5-turbo", "gpt-4"])
temperature = st.sidebar.slider("창의성", 0.0, 1.0, 0.3)
```

사용자는 메인 화면을 보면서 왼쪽에서 모델이나 옵션을 바꿀 수 있습니다.

## SQLite 저장

`16_streamlit_20250417_03.py`는 입력값을 SQLite에 저장합니다.

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

사용자가 입력한 값을 DB에 저장하면 앱을 껐다 켜도 데이터가 남습니다.

## SQL에서 ?를 쓰는 이유

다음처럼 문자열을 직접 붙이면 위험합니다.

```python
sql = f"insert into student values('{name}', {age}, '{birth}')"
```

사용자 입력에 SQL 문법이 섞이면 의도하지 않은 쿼리가 실행될 수 있습니다.
그래서 `?`를 사용해 값을 안전하게 전달합니다.

```python
cur.execute(sql, (name, age, birth))
```

## 이미지와 DB 연결

`16_streamlit_20250417_07_img_db.py`는 이미지와 DB 저장 흐름과 연결됩니다.

예를 들어 다음 구조를 만들 수 있습니다.

```text
이미지 업로드
-> 파일 저장
-> 파일 경로를 DB에 저장
-> 화면에서 이미지 목록 조회
```

이미지 자체를 DB에 넣는 방식도 있지만, 초보 단계에서는 파일은 폴더에 저장하고 DB에는 경로만 저장하는 방식이 이해하기 쉽습니다.

## 정리

15-16번 실습은 Streamlit 앱을 실제 사용 가능한 도구로 확장하는 과정입니다.
파일 업로드, 탭, 사이드바, DB 저장을 익히면 AI 챗봇이나 문서 분석 앱의 기본 구조를 만들 수 있습니다.
