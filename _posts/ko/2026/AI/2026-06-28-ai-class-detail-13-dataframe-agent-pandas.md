---
title: "AI 세부 실습 13 - DataFrame Agent와 Pandas 분석"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- Pandas
tags:
- AI
- Pandas
- DataFrame Agent
- LangChain
toc: true
toc_sticky: true
toc_label: 목차
description: "28, 31, 38번 실습 파일을 기준으로 Pandas DataFrame Agent와 데이터 분석 자동화를 정리합니다."
article_tag1: AI
article_tag2: Pandas
article_tag3: Agent
article_section: AI
meta_keywords: AI, Pandas Agent, DataFrame, 데이터 분석, LangChain
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# DataFrame Agent와 Pandas 분석

이 글은 다음 원본 실습 파일을 기준으로 정리합니다.

```text
28.langchaing_Agent_20250507_01.py
28.langchaing_Agent_20250507_02_dataframe.py
31.langchain_pandas_20250508_01_vs_agent.py
31.langchain_pandas_20250508_02_platform.py
31.langchain_pandas_20250508_03_streamlit.py
31.langchain_pandas_20250508_04_ImageCaptionLoader.py
31일차풀이(김태원).py
38_timeAgent.py
```

이 실습은 CSV나 DataFrame을 AI가 자연어 질문으로 분석하게 만드는 내용입니다.

## DataFrame 읽기

```python
import pandas as pd

df = pd.read_csv("data/CCTV_in_Seoul.csv", index_col="기관명")
```

DataFrame은 표 형태의 데이터입니다.

## Pandas Agent

```python
from langchain_openai import ChatOpenAI
from langchain_experimental.agents.agent_toolkits import create_pandas_dataframe_agent

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

agent = create_pandas_dataframe_agent(
    llm=llm,
    df=df,
    verbose=True,
    agent_type="openai-tools",
    handle_parsing_errors=True,
    allow_dangerous_code=True,
)
```

사용자는 Pandas 문법을 몰라도 자연어로 질문할 수 있습니다.

```python
response = agent.run("cctv 소계가 가장 많은 구는 어디인가요?")
```

## 주의할 옵션

```python
allow_dangerous_code=True
```

이 옵션은 Agent가 Python 코드를 실행할 수 있게 합니다.
실습에는 편리하지만 실제 서비스에서는 격리 환경과 권한 제한이 필요합니다.

## Streamlit과 결합

CSV 업로드와 DataFrame Agent를 연결하면 다음 앱을 만들 수 있습니다.

```text
CSV 업로드
-> DataFrame 생성
-> 자연어 질문
-> 분석 결과 출력
```

## 정리

DataFrame Agent는 비전공자도 데이터 분석을 쉽게 시작할 수 있게 해 줍니다.
다만 내부적으로 코드를 실행할 수 있으므로 실제 서비스에서는 보안 설계가 필수입니다.
