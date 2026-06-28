---
title: "AI 강의 정리 08 - Agent와 문서, 데이터 분석 자동화"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- Agent
tags:
- AI
- Agent
- LangChain
- Pandas
- RAG
toc: true
toc_sticky: true
toc_label: 목차
description: "LangChain Agent, Pandas DataFrame Agent, 웹 문서 검색, 리랭킹 개념을 초보자 기준으로 정리합니다."
article_tag1: AI
article_tag2: Agent
article_tag3: Pandas
article_section: AI
meta_keywords: AI, Agent, LangChain, Pandas Agent, 문서검색, 리랭킹
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# Agent란?

Agent는 AI가 단순히 답변만 하는 것이 아니라, 필요한 도구를 선택해 작업을 수행하는 구조입니다.

예를 들어 사용자가 이렇게 질문합니다.

```text
CCTV 소계가 가장 많은 구는 어디인가요?
```

일반 챗봇은 데이터를 보지 못하면 답할 수 없습니다.
하지만 Pandas DataFrame을 다루는 도구가 연결되어 있다면 Agent는 다음처럼 작업할 수 있습니다.

```text
데이터프레임 확인
-> CCTV 소계 컬럼 찾기
-> 가장 큰 값의 행 찾기
-> 사용자에게 자연어로 답변
```

강의 폴더에서는 다음 파일들이 이 주제에 해당합니다.

```text
27.langchain_20250430_04_agent_wikipedia.py
28.langchaing_Agent_20250507_01.py
28.langchaing_Agent_20250507_02_dataframe.py
31.langchain_pandas_20250508_01_vs_agent.py
31.langchain_pandas_20250508_02_platform.py
31.langchain_pandas_20250508_03_streamlit.py
31.langchain_pandas_20250508_04_ImageCaptionLoader.py
38_timeAgent.py
```

## Chain과 Agent의 차이

Chain은 정해진 순서대로 실행됩니다.

```text
번역 -> 요약 -> 저장
```

Agent는 상황에 따라 다음 행동을 고릅니다.

```text
질문 분석
-> 어떤 도구가 필요한지 선택
-> 도구 실행
-> 결과 확인
-> 추가 도구가 필요하면 다시 실행
-> 최종 답변
```

정해진 공정표대로 움직이는 것이 Chain이라면, Agent는 상황을 보면서 도구를 고르는 작업자에 가깝습니다.

## Pandas DataFrame Agent

강의 코드에서는 서울 CCTV 데이터를 읽고 질문하는 예제가 있습니다.

```python
import pandas as pd

df = pd.read_csv("data/CCTV_in_Seoul.csv", index_col="기관명")
```

그리고 LangChain의 Pandas Agent를 만듭니다.

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

response = agent.run("cctv 소계가 가장 많은 구는 어디인가요?")
print(response)
```

이 예제에서 Agent는 데이터프레임을 분석하기 위해 Python 코드를 생성하고 실행할 수 있습니다.

## allow_dangerous_code 주의

위 코드에서 가장 조심해야 할 부분은 다음 옵션입니다.

```python
allow_dangerous_code=True
```

이 옵션은 Agent가 Python 코드를 실행할 수 있게 허용합니다.
실습 환경에서는 편리하지만, 실제 서비스에서 사용자 입력을 그대로 받아 실행하면 위험합니다.

가능한 위험은 다음과 같습니다.

- 파일 삭제 코드 실행
- 민감한 파일 읽기
- 외부 네트워크 요청
- 서버 자원 과다 사용

따라서 실제 서비스에서는 다음 원칙을 지켜야 합니다.

- 신뢰할 수 있는 사용자에게만 허용
- 별도 격리 환경에서 실행
- 읽을 수 있는 파일과 디렉터리 제한
- 실행 시간 제한
- 로그 기록

## Agent가 내부적으로 하는 일

Agent는 보통 다음 흐름을 반복합니다.

```text
Thought: 무엇을 해야 하는지 판단
Action: 사용할 도구 선택
Action Input: 도구에 넣을 입력값 결정
Observation: 도구 실행 결과 확인
Final Answer: 최종 답변
```

요즘 도구 호출 기반 Agent에서는 이 과정을 함수 호출 형태로 처리하는 경우가 많습니다.

## 문서 검색 Agent

RAG와 Agent를 함께 쓰면 문서 기반 질문 답변 시스템을 만들 수 있습니다.

```text
사용자 질문
-> 문서 검색 도구 사용
-> 관련 문단 가져오기
-> 필요하면 웹 검색 또는 추가 분석
-> 답변 생성
```

단순 RAG는 "검색 후 답변" 흐름이 고정되어 있습니다.
Agent는 질문에 따라 검색, 계산, 요약, 표 분석을 조합할 수 있습니다.

## 웹 문서 로더

LangChain에는 웹 페이지를 읽어오는 로더도 있습니다.

```python
from langchain_community.document_loaders import WebBaseLoader

loader = WebBaseLoader("https://example.com")
documents = loader.load()
```

웹 문서를 읽은 뒤에는 PDF와 마찬가지로 다음 흐름을 적용할 수 있습니다.

```text
웹 문서 읽기
-> 청크 분할
-> 임베딩
-> 벡터 DB 저장
-> 질문에 맞는 문단 검색
-> 답변 생성
```

## 리랭킹이란?

`27.langchain_20250430_03_rerank.py`는 리랭킹 주제와 연결됩니다.

벡터 검색은 질문과 비슷한 문서를 빠르게 찾지만, 항상 가장 좋은 순서로 정렬되지는 않습니다.
리랭킹은 1차 검색 결과를 다시 평가해 더 적절한 순서로 재정렬하는 과정입니다.

흐름은 다음과 같습니다.

```text
질문
-> 벡터 검색으로 후보 문서 20개 찾기
-> 리랭커가 후보 문서 재평가
-> 상위 3-5개만 LLM에 전달
```

문서가 많아질수록 리랭킹의 효과가 커질 수 있습니다.

## Streamlit과 연결하기

DataFrame Agent를 Streamlit과 연결하면 사용자는 웹 화면에서 CSV를 업로드하고 질문할 수 있습니다.

```text
CSV 업로드
-> pandas DataFrame 생성
-> Agent 생성
-> 사용자가 자연어로 질문
-> Agent가 데이터 분석
-> 답변 출력
```

예를 들어 다음 질문이 가능합니다.

```text
인구 대비 CCTV가 가장 많은 구는?
최근 증가율이 높은 구 5개만 표로 보여줘.
강남구와 종로구를 비교해줘.
```

이 방식은 비전공자가 SQL이나 Pandas 문법을 몰라도 데이터를 탐색할 수 있게 해 줍니다.

## 정리

Agent는 AI 앱을 더 능동적으로 만듭니다.

- Chain은 정해진 순서로 실행됩니다.
- Agent는 질문에 맞게 도구를 고릅니다.
- DataFrame Agent는 표 데이터를 자연어로 분석할 수 있게 해 줍니다.
- 문서 검색 Agent는 RAG와 결합해 강력해집니다.
- 코드 실행 권한은 반드시 조심해서 다뤄야 합니다.

다음 글에서는 Hugging Face, 로컬 모델, 이미지/음성 모델, 파인튜닝 기초를 정리합니다.
