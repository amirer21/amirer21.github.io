---
title: "AI 강의 정리 01 - 비전공자를 위한 Python과 OpenAI API 준비"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- Python
tags:
- AI
- Python
- OpenAI
- API
toc: true
toc_sticky: true
toc_label: 목차
description: "AI 실습을 시작하기 전에 Python, 가상환경, API 키, 환경 변수의 의미를 비전공자 기준으로 정리합니다."
article_tag1: AI
article_tag2: Python
article_tag3: OpenAI
article_section: AI
meta_keywords: AI, Python, OpenAI, API, 환경변수
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# AI 실습을 시작하기 전에 알아야 할 것들

이 글은 `D:\2025_03_AI_Workspace\ChatGPTLLMProject`에 정리해 둔 AI 강의 코드들을 블로그용으로 다시 풀어 쓴 첫 번째 글입니다.
강의 파일에는 이미지 생성, 음성 처리, Streamlit 웹앱, RAG, LangChain, LangGraph, Hugging Face, 자동화까지 다양한 예제가 들어 있습니다.

그런데 코드를 바로 실행하기 전에 반드시 이해해야 하는 기초가 있습니다.

- Python 파일은 어떻게 실행하는가?
- 패키지는 왜 설치해야 하는가?
- API 키는 왜 코드에 직접 적으면 안 되는가?
- `.env` 파일과 `load_dotenv()`는 무슨 역할을 하는가?
- AI 모델에 질문을 보낸다는 것은 정확히 어떤 의미인가?

이 글에서는 이 기초를 먼저 정리합니다.

## Python 파일이란?

Python 파일은 보통 `.py` 확장자를 가집니다.

예를 들어 강의 폴더에는 다음과 같은 파일이 있습니다.

```text
09_multi_modal_image.py
16_streamlit_20250417_03.py
17_20250421_01_embedding.py
25.langchain_20250428_02_graph.py
50_automation_20250520_02_LangGraph.py
```

파일 이름 앞의 숫자는 수업 차시나 흐름을 의미합니다.
`09_multi_modal_image.py`는 9번째 수업에서 이미지 생성 실습을 했다는 뜻이고, `16_streamlit_20250417_03.py`는 2025년 4월 17일 Streamlit 실습 중 세 번째 예제라는 뜻으로 볼 수 있습니다.

Python 파일은 터미널에서 다음처럼 실행합니다.

```bash
python 09_multi_modal_image.py
```

Streamlit 웹앱 파일은 일반 Python 실행이 아니라 Streamlit 명령으로 실행합니다.

```bash
streamlit run 16_streamlit_20250417_03.py
```

## 가상환경을 쓰는 이유

AI 실습은 설치해야 할 패키지가 많습니다.

예를 들면 다음과 같습니다.

```bash
pip install openai python-dotenv requests streamlit
pip install langchain langchain-openai faiss-cpu pymupdf
pip install transformers datasets torch
```

이 패키지들을 컴퓨터 전체 Python에 전부 설치하면 프로젝트마다 버전이 꼬일 수 있습니다.
그래서 보통 프로젝트 폴더 안에 가상환경을 만들고 그 안에 패키지를 설치합니다.

Windows 기준 예시는 다음과 같습니다.

```bash
python -m venv .venv
.venv\Scripts\activate
pip install openai python-dotenv streamlit
```

가상환경이 켜지면 터미널 앞에 `(.venv)` 같은 표시가 붙습니다.

## API란?

API는 프로그램끼리 대화하기 위한 약속입니다.

사람이 ChatGPT 웹사이트에 들어가서 질문을 입력하면 브라우저 화면을 통해 답변을 받습니다.
Python 프로그램은 화면 대신 API를 통해 질문을 보냅니다.

흐름은 다음과 같습니다.

```text
내 Python 코드
-> OpenAI API로 요청 전송
-> AI 모델이 답변 생성
-> Python 코드가 답변을 받아 출력하거나 저장
```

즉, API를 사용하면 내가 만든 프로그램 안에 AI 기능을 넣을 수 있습니다.

## API 키는 비밀번호처럼 다뤄야 한다

OpenAI 같은 서비스는 API를 사용할 때 API 키를 요구합니다.
API 키는 "이 요청을 누가 보내는가"를 확인하는 비밀번호에 가깝습니다.

따라서 다음처럼 코드에 직접 적으면 안 됩니다.

```python
api_key = "sk-..."
```

이렇게 적은 코드가 GitHub에 올라가면 다른 사람이 내 키로 비용을 사용할 수 있습니다.

대신 `.env` 파일이나 별도 환경 변수 파일에 보관합니다.
강의 코드에서는 `openapi_key.env` 파일을 사용했습니다.

```text
OPENAI_API_KEY=여기에_본인_API_키
```

그리고 Python에서는 다음처럼 불러옵니다.

```python
import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="openapi_key.env")
api_key = os.getenv("OPENAI_API_KEY")
```

이 방식의 장점은 코드와 비밀값을 분리할 수 있다는 점입니다.

## OpenAI 클라이언트 만들기

강의 코드에서 자주 등장하는 기본 구조는 다음과 같습니다.

```python
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(dotenv_path="openapi_key.env")
api_key = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=api_key)
```

여기서 `client`는 OpenAI API를 호출하기 위한 객체입니다.
이미지 생성, 음성 변환, 채팅, 임베딩 생성 같은 기능을 호출할 때 이 객체를 사용합니다.

## AI 모델에 질문한다는 것

AI 모델에 질문을 보낼 때는 보통 다음 세 가지가 중요합니다.

| 항목 | 의미 |
| --- | --- |
| model | 어떤 AI 모델을 사용할지 |
| prompt 또는 messages | AI에게 전달할 질문이나 지시문 |
| temperature | 답변의 창의성 정도 |

예를 들어 "고양이 이미지를 만들어줘"라고 요청하면 모델은 이미지를 생성합니다.
"이 문서를 요약해줘"라고 요청하면 모델은 텍스트를 생성합니다.

중요한 점은 AI가 마법처럼 내 컴퓨터 안에서 자동으로 도는 것이 아니라, 코드가 API 서버에 요청을 보내고 결과를 받아온다는 것입니다.

## 실습 폴더를 읽는 방법

강의 폴더의 흐름은 대략 다음 순서로 볼 수 있습니다.

| 차시 | 주제 |
| --- | --- |
| 09-12 | 이미지 생성, 이미지 편집, 음성 녹음, 이미지 설명, OCR |
| 13 | 함수 호출과 도구 사용 |
| 14-16 | Streamlit 웹앱 만들기 |
| 17-19 | 임베딩, 벡터 검색, RAG |
| 20-22 | LangChain 기본과 챗봇 |
| 24-27 | LangGraph, 문서 검색, 리랭킹, Agent |
| 28-31 | 데이터프레임 Agent, 웹 문서, 이미지 로더 |
| 43-46 | Hugging Face, 로컬 모델, LM Studio |
| 47-49 | 파인튜닝, LoRA, 이미지 모델 |
| 50 | 유튜브, 이메일, OCR, 문서 요약 자동화 |

처음 공부한다면 09번부터 차례로 따라가도 좋지만, 비전공자라면 다음 순서를 추천합니다.

1. API 키와 Python 실행 이해
2. 이미지 생성처럼 결과가 바로 보이는 예제 실행
3. Streamlit으로 웹 화면 만들기
4. 임베딩과 RAG 개념 이해
5. LangChain과 LangGraph로 구조화하기
6. Agent와 자동화로 실제 업무에 연결하기

## 정리

AI 개발의 첫 단계는 복잡한 수학이 아니라 실행 환경을 안정적으로 만드는 것입니다.

Python 파일을 실행할 수 있고, 패키지를 설치할 수 있고, API 키를 안전하게 불러올 수 있으면 대부분의 AI 예제를 따라갈 준비가 된 것입니다.

다음 글에서는 `09_multi_modal_image.py`, `10_multi_modal_edit_image.py`, `12_multi_modal_image_description_20250410_01.py` 같은 파일을 바탕으로 이미지 생성과 멀티모달 AI를 정리합니다.
