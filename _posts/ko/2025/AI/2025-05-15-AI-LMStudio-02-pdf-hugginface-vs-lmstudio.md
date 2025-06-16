---
title: 인공지능 - LangChain으로 PDF 문서 요약하기 - Hugging Face vs LM Studio 실습 비교실시간 웹캠 객체 인식 - YOLOv8을 활용한 AI 시각 시스템
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
description: 인공지능 - LangChain으로 PDF 문서 요약하기 - Hugging Face vs LM Studio 실습 비교
article_tag1: AI
article_tag2: HuggingFace
article_tag3: LLM
article_section: 
meta_keywords: AI, HuggingFace, LLM, LangChain, LMStudio
last_modified_at: '2025-05-15 21:00:00 +0800'
---


## LangChain으로 PDF 문서 요약하기: Hugging Face vs LM Studio 실습 비교

## 목차

1. 개요
2. LM Studio와 Hugging Face 차이
3. 실습 목표
4. PDF 문서 처리 단계별 설명
5. 전체 코드 요약
6. 마무리

---

## 1. 개요

LangChain은 다양한 문서 소스(PDF, 웹, CSV 등)를 불러와 LLM을 활용한 질의응답 시스템을 구성할 수 있는 파워풀한 프레임워크입니다. 이번 글에서는 LangChain을 사용하여 **PDF 파일을 요약하고 질의응답을 수행하는 워크플로우**를 정리해보겠습니다.

특히, 이 실습은 두 가지 방식으로 비교합니다:

* Hugging Face 임베딩 + OpenAI or HuggingFaceHub LLM (주석 처리된 부분)
* Hugging Face 임베딩 + LM Studio LLM (실행 코드)

---

## 2. LM Studio와 Hugging Face 차이

| 항목      | Hugging Face 방식                         | LM Studio 방식                   |
| ------- | --------------------------------------- | ------------------------------ |
| 임베딩     | `sentence-transformers` (공통)            | 동일                             |
| LLM 호출  | `openai.ChatOpenAI` 또는 `HuggingFaceHub` | `ChatOpenAI` + `LM Studio API` |
| 모델 위치   | 클라우드(HF 서버)                             | 로컬 (GPU 활용 가능)                 |
| 요청 방식   | 인터넷 필요                                  | 오프라인 가능                        |
| latency | 네트워크 의존                                 | 빠르고 즉시 응답                      |

즉, **Hugging Face는 클라우드 기반**, **LM Studio는 로컬 API 서버 방식**이라는 점이 핵심 차이입니다.

---

## 3. 실습 목표

우리는 `The Adventures of Tom Sawyer`라는 PDF 파일을 불러온 후, 그 내용을 벡터로 변환하고, LLM을 통해 다음과 같은 질문에 답하게 만듭니다.

> “줄거리 요약해 줄래?”

이 과정을 통해 LangChain의 `RetrievalQA` 체인과 `HuggingFaceEmbeddings`, `FAISS`, `ChatOpenAI`를 함께 사용하는 방법을 익힐 수 있습니다.

---

## 4. PDF 문서 처리 단계별 설명

### 1단계: PDF 문서 로드

```python
pdfloader = PyPDFLoader('pdf/The_Adventures_of_Tom_Sawyer.pdf')
documents = pdfloader.load()
```

LangChain에서 제공하는 `PyPDFLoader`를 사용하여 PDF 문서를 불러옵니다. 반환값은 `Document` 객체 리스트입니다.

---

### 2단계: 텍스트 분할

```python
text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20)
docs = text_splitter.split_documents(documents)
```

* 문서 길이가 너무 길면 LLM이 처리하기 어렵기 때문에 적절한 크기로 잘라줍니다.
* `chunk_overlap`을 줘서 문맥 손실을 방지합니다.

---

### 3단계: 임베딩 및 벡터 저장소 생성

```python
embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(docs, embedding)
```

* 텍스트를 벡터로 변환해주는 모델은 `MiniLM-L6`를 사용합니다.
* `FAISS`는 효율적인 유사도 검색이 가능한 벡터 저장소입니다.

---

### 4단계: LM Studio LLM 설정

```python
llm = ChatOpenAI(
    base_url="http://127.0.0.1:1234/v1",
    api_key="lmstudio",
    model="lmstudio"
)
```

* LM Studio는 OpenAI 호환 API 서버를 로컬에서 실행할 수 있습니다.
* 반드시 `/v1` 경로 포함, `api_key`는 아무 문자열도 무방하지만 `"lmstudio"`로 통일합니다.

---

### 5단계: 질의응답 체인 구성

```python
retriever = vectorstore.as_retriever(search_kwargs={"k": 7})
qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever)
```

* 벡터 저장소에서 유사한 문서를 검색해 `k=7`개 반환
* LangChain의 `RetrievalQA` 체인이 검색된 문서를 바탕으로 LLM이 응답을 생성합니다

---

### 6단계: 질의 및 응답 출력

```python
query = "줄거리 요약해 줄래?"
result = qa.invoke({"query": query})
print(result["result"])
```

* `invoke()`는 LangChain 체인에서 사용되는 실행 메서드입니다.
* 출력은 LLM의 응답으로, 문서 기반 요약이 됩니다.

---

## 5. 전체 코드 요약 (LM Studio 방식)

```python
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI

pdfloader = PyPDFLoader('pdf/The_Adventures_of_Tom_Sawyer.pdf')
documents = pdfloader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=20)
docs = text_splitter.split_documents(documents)

embedding = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
vectorstore = FAISS.from_documents(docs, embedding)

llm = ChatOpenAI(
    base_url="http://127.0.0.1:1234/v1",
    api_key="lmstudio",
    model="lmstudio"
)

retriever = vectorstore.as_retriever(search_kwargs={"k": 7})
qa = RetrievalQA.from_chain_type(llm=llm, chain_type="stuff", retriever=retriever)

query = "줄거리 요약해 줄래?"
result = qa.invoke({"query": query})
print(result["result"])
```

---

## 6. 마무리

이번 글에서는 LangChain을 이용하여 PDF 문서에서 정보를 추출하고 LLM으로 요약하는 전체 흐름을 실습해봤습니다. Hugging Face 기반과 LM Studio 기반의 차이도 살펴보았고, 특히 LM Studio는 로컬 환경에서 빠르고 자유롭게 LLM을 활용할 수 있는 훌륭한 도구입니다.

> LangChain + LM Studio 조합은 로컬 개발 환경에서 프라이버시와 성능 모두를 잡을 수 있는 강력한 솔루션입니다.

---

이제 이 구조를 기반으로 사용자 맞춤형 Q\&A 챗봇을 만드는 방향으로도 확장해볼 수 있습니다.
