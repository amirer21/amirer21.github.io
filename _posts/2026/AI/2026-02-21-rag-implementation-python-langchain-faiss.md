---
title: Python으로 RAG 시스템 직접 구현하기 (LangChain + FAISS 실습 코드 포함)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
tags:
- AI
- RAG
- LangChain
- FAISS
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: RAG 구현 방법을 처음부터 끝까지 직접 실습하는 입문 가이드. LangChain과 FAISS로 최소 동작 RAG를 만드는 과정과 오류 해결까지 정리.
article_tag1: AI
article_tag2: RAG
article_tag3: Python
article_section: Engineering
meta_keywords: RAG 구현 방법, LangChain, FAISS, Python, Vector DB, Embedding
last_modified_at: '2026-02-21 10:00:00 +0900'
---

# Python으로 RAG 시스템 직접 구현하기 (LangChain + FAISS 실습 코드 포함)

처음 RAG를 공부할 때 가장 막혔던 건 “그래서 내가 뭘부터 만들면 되지?”였습니다. 이 글은 **RAG 구현 방법**을 가장 작은 단위로 끝까지 완성해보는 입문형 실습 글입니다. 목표는 단 하나, **내 문서로 질문에 답하게 만드는 최소 RAG**를 직접 실행하는 것입니다.

## 오늘의 목표

- RAG가 뭔지 한 문장으로 이해한다
- LangChain + FAISS로 **최소 동작 RAG**를 만든다
- 자주 발생하는 에러 포인트를 미리 피한다

## RAG란? (한 문장 요약)

RAG는 **검색(Retrieval)으로 문서를 찾고, 그 문서를 근거로 답을 생성(Generation)하는 방식**입니다. 즉, LLM이 모르는 정보도 내 문서를 기반으로 정확하게 답하게 만드는 구조입니다.

## 왜 RAG가 필요한가

- LLM은 최신 정보나 내부 문서를 모른다
- 단순 프롬프트만으로는 환각(없는 내용을 지어냄)이 발생한다
- RAG는 “근거 있는 답변”을 가능하게 한다

한마디로, **LLM을 내 지식으로 똑똑하게 만드는 방법**이 RAG입니다.

## 최소 RAG 구조

오늘은 아래 3단계만 성공하면 됩니다.

- 문서 로딩
- 임베딩 후 FAISS에 저장
- 질문 → 유사 문서 검색 → LLM 답변 생성

## 실습 준비

필요한 라이브러리를 설치합니다.

```bash
pip install langchain faiss-cpu openai tiktoken
```

환경 변수에 API 키가 필요합니다.

```bash
export OPENAI_API_KEY="your_key_here"
```

## LangChain + FAISS 실습 코드

아래 코드는 **가장 작은 RAG 구현**입니다. 이 구조만 제대로 돌아가면, 이후에는 파일 로딩과 데이터 확장만 추가하면 됩니다.

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.schema import Document
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

# 1) 문서 준비 (실전에서는 파일/DB로 대체)
docs = [
    Document(page_content="RAG는 검색과 생성이 결합된 구조입니다."),
    Document(page_content="FAISS는 벡터 검색을 위한 라이브러리입니다."),
    Document(page_content="LangChain은 LLM 애플리케이션을 빠르게 구현하도록 돕습니다."),
]

# 2) 문서 분할 (긴 문서는 반드시 쪼개기)
splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
split_docs = splitter.split_documents(docs)

# 3) 임베딩 & FAISS 인덱스 생성
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(split_docs, embeddings)

# 4) Retrieval + LLM 연결
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
)

# 5) 질문 테스트
query = "RAG 구현 방법이 뭐야?"
result = qa.run(query)
print(result)
```

정상 실행되면, **내 문서 내용 기반으로 답변이 생성**됩니다. 이게 바로 RAG의 핵심입니다.

## 자주 터지는 에러와 해결

- API 키 오류
- `OPENAI_API_KEY` 환경 변수가 빠졌는지 확인
- `.env`를 쓴다면 `load_dotenv()` 누락 여부 확인

- FAISS 설치 오류
- 윈도우는 `faiss-cpu` 권장
- 리눅스는 `faiss-cpu` 또는 `faiss-gpu`

- 답변 품질이 낮음
- `chunk_size`를 200~500 사이로 조정
- `k` 값을 3~5로 늘려 재현율 확보

## 입문자용 품질 개선 팁

- **문서 전처리**가 품질을 크게 좌우합니다
- 너무 긴 문서는 꼭 쪼개야 합니다
- `temperature=0`은 정답률에 유리합니다
- 검색 결과가 부족하면 `k=5`로 확장해 보세요

## 정리

오늘 만든 RAG는 아주 작지만 핵심 구조는 완벽합니다.

- RAG 구현 방법은 **문서 → 벡터 → 검색 → 생성** 흐름이다
- LangChain + FAISS 조합이면 입문자도 빠르게 구현 가능하다
- 이후에는 PDF, 웹 문서, 데이터베이스로 확장하면 된다

처음엔 어렵게 느껴져도 직접 구현하면 “아, 결국 검색 + 생성이구나”라는 감이 잡힙니다. 다음 글에서는 **실제 파일 로딩 버전**과 **로컬 임베딩 모델**로 확장하는 방법을 이어서 다뤄보겠습니다.
