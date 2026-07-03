---
title: "AI 세부 실습 08 - PDF RAG와 FAISS"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- RAG
tags:
- AI
- RAG
- PDF
- FAISS
- LangChain
toc: true
toc_sticky: true
toc_label: 목차
description: "19, 25, 30번 실습 파일을 기준으로 PDF 기반 RAG 흐름을 정리합니다."
article_tag1: AI
article_tag2: RAG
article_tag3: FAISS
article_section: AI
meta_keywords: AI, RAG, PDF, FAISS, LangChain
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# PDF RAG와 FAISS

이 글은 다음 실습 주제를 기준으로 정리합니다.

- PDF 문서 로딩과 텍스트 추출
- 문서 청크 분할과 임베딩
- FAISS 벡터 저장소 검색
- 대화형 PDF RAG 챗봇

이 실습의 목표는 PDF 문서를 읽고, 질문에 맞는 부분을 찾아 AI가 답하게 만드는 것입니다.

## RAG 흐름

```text
PDF 읽기
-> 텍스트 추출
-> 청크 분할
-> 임베딩 생성
-> FAISS 저장
-> 질문과 유사한 청크 검색
-> LLM 답변 생성
```

RAG는 모델이 모르는 문서 내용을 검색해서 답변에 활용하는 방식입니다.

## PDF 읽기

LangChain에서는 PDF loader를 사용할 수 있습니다.

```python
from langchain.document_loaders import PyPDFLoader

loader = PyPDFLoader("pdf/The_Adventures_of_Tom_Sawyer.pdf")
documents = loader.load()
```

`documents`에는 페이지별 텍스트와 metadata가 들어갑니다.

## 문서 나누기

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)

docs = splitter.split_documents(documents)
```

`chunk_overlap`은 앞뒤 청크가 일부 겹치게 해서 문맥 손실을 줄입니다.

## FAISS 벡터 DB

```python
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS

embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
vdb = FAISS.from_documents(docs, embeddings)
vdb.save_local("myfaiss")
```

FAISS는 임베딩 벡터를 저장하고 비슷한 문서를 빠르게 검색합니다.

## RetrievalQA

```python
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
retriever = vdb.as_retriever()

qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
)

result = qa.invoke({"query": "톰 소여는 누구인가?"})
```

`RetrievalQA`는 검색과 답변 생성을 연결합니다.

## 대화식 RAG 챗봇

`30.rag대화식챗봇.py`처럼 대화형으로 만들면 사용자가 여러 질문을 이어서 할 수 있습니다.

```text
사용자 질문
-> 관련 문서 검색
-> 답변
-> 다음 질문
```

대화 기록까지 반영하려면 Conversation Memory나 session state가 필요합니다.

## 정리

PDF RAG는 문서 기반 챗봇의 기본 패턴입니다.
PDF를 텍스트로 읽고, 청크로 나누고, 임베딩으로 검색한 뒤 AI에게 문맥을 제공하는 구조를 익히면 다양한 문서 QA 시스템을 만들 수 있습니다.
