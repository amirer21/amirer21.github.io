---
title: "AI 강의 정리 05 - 임베딩과 RAG: PDF를 읽고 답하는 AI 만들기"
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
- Embedding
- RAG
- FAISS
- LangChain
toc: true
toc_sticky: true
toc_label: 목차
description: "임베딩, 청크, 벡터 DB, FAISS, RAG의 흐름을 PDF 검색 예제로 설명합니다."
article_tag1: AI
article_tag2: RAG
article_tag3: Embedding
article_section: AI
meta_keywords: AI, RAG, 임베딩, FAISS, 벡터DB, PDF 챗봇
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# RAG가 필요한 이유

일반적인 AI 챗봇은 모델이 이미 학습한 지식을 바탕으로 답합니다.
하지만 회사 내부 문서, 내가 올린 PDF, 최신 공지사항처럼 모델이 모르는 자료에 대해서는 정확히 답하기 어렵습니다.

이 문제를 해결하는 대표적인 방식이 RAG입니다.

RAG는 Retrieval Augmented Generation의 약자입니다.
한국어로 풀면 "검색으로 보강한 생성" 정도로 이해할 수 있습니다.

강의 폴더에서는 다음 파일들이 이 주제에 해당합니다.

```text
17_20250421_01_embedding.py
17_20250421_01_embedding02.py
17_20250421_01_embedding03_chunk_and_embedding.py
19_20250422_01_base_code_00.py
25.langchain_20250428_02_graph.py
27.langchain_20250430_02_web_doc_summary_retrieval.py
27.langchain_20250430_03_rerank.py
30.rag대화식챗봇.py
```

## RAG 전체 흐름

RAG는 다음 순서로 동작합니다.

```text
문서 읽기
-> 문서를 작은 조각으로 나누기
-> 각 조각을 임베딩 벡터로 변환
-> 벡터 DB에 저장
-> 질문도 임베딩으로 변환
-> 질문과 비슷한 문서 조각 검색
-> 검색된 조각을 AI에게 함께 전달
-> AI가 근거를 바탕으로 답변 생성
```

이 흐름을 이해하면 PDF 챗봇, 사내 문서 검색, FAQ 챗봇을 만들 수 있습니다.

## 임베딩이란?

임베딩은 글자를 숫자 벡터로 바꾸는 작업입니다.

사람은 "고양이"와 "강아지"가 어느 정도 비슷한 단어라는 것을 압니다.
컴퓨터는 글자 자체만 보면 그 의미를 알 수 없습니다.

그래서 AI 모델을 사용해 문장을 숫자 배열로 바꿉니다.

```text
"고양이는 소파 위에서 잠을 잔다"
-> [0.12, -0.03, 0.88, ...]
```

이 숫자 배열을 벡터라고 부릅니다.
의미가 비슷한 문장은 벡터 공간에서도 가까운 위치에 놓이게 됩니다.

## 청크란?

문서 전체를 한 번에 AI에게 넣기는 어렵습니다.
PDF 한 권은 너무 길고, 모델에는 한 번에 처리할 수 있는 길이 제한이 있습니다.

그래서 문서를 작은 조각으로 나눕니다.
이 조각을 청크라고 합니다.

강의 코드에서는 예를 들어 500자 단위로 나누었습니다.

```python
chunk_size = 500
chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
```

비전공자 관점에서는 책을 여러 장의 메모지로 잘라 둔다고 생각하면 됩니다.

## PDF 텍스트 추출

강의 코드에서는 `fitz`를 사용해 PDF에서 텍스트를 추출합니다.
`fitz`는 PyMuPDF 패키지에서 사용하는 모듈입니다.

```python
import fitz

text_chunks = []
chunk_size = 500

with fitz.open("pdf/The_Adventures_of_Tom_Sawyer.pdf") as doc:
    for page in doc:
        text = page.get_text()
        chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        text_chunks.extend(chunks)
```

흐름은 다음과 같습니다.

```text
PDF 열기
-> 페이지별 텍스트 읽기
-> 500자 단위로 자르기
-> text_chunks 리스트에 저장
```

## 임베딩 생성

각 청크를 임베딩으로 변환합니다.

```python
import numpy as np
from openai import OpenAI

client = OpenAI()

def get_embedding(text):
    response = client.embeddings.create(
        input=text,
        model="text-embedding-ada-002",
    )
    return np.array(response.data[0].embedding, dtype=np.float32)
```

`text-embedding-ada-002`는 강의 코드에서 사용한 임베딩 모델입니다.
실습 시점에 다른 임베딩 모델을 사용한다면 벡터 차원이 달라질 수 있습니다.

## FAISS에 저장하기

FAISS는 벡터 검색을 빠르게 해 주는 라이브러리입니다.

```python
import faiss
import numpy as np

embeddings_matrix = np.vstack([emb for _, emb in chunk_embedding_pairs])
index = faiss.IndexFlatL2(embeddings_matrix.shape[1])
index.add(embeddings_matrix)
```

여기서 `IndexFlatL2`는 유클리드 거리 기반으로 가까운 벡터를 찾는 방식입니다.

쉽게 말하면 다음 질문에 답하는 도구입니다.

```text
질문 벡터와 가장 가까운 문서 조각 5개를 찾아줘.
```

## 질문 검색하기

사용자의 질문도 임베딩으로 변환합니다.

```python
question = "등장 인물에 대해 알려줄래?"
q_emb = get_embedding(question).reshape(1, -1)

_, top_index = index.search(q_emb, k=5)
```

`k=5`는 가장 비슷한 청크 5개를 가져오겠다는 뜻입니다.

```python
context = " ".join([text_chunks[i] for i in top_index[0]])
```

이렇게 가져온 `context`를 AI에게 질문과 함께 전달합니다.

```text
Context: 검색된 문서 조각들
Question: 등장 인물에 대해 알려줄래?
Answer:
```

## RAG와 일반 질문의 차이

일반 질문:

```text
톰 소여는 누구야?
```

RAG 질문:

```text
다음 문서 내용을 참고해서 답해줘.

Context:
PDF에서 검색된 관련 문단...

Question:
톰 소여는 누구야?
```

RAG는 모델의 기억에만 의존하지 않고, 검색된 문서 조각을 근거로 답하게 만듭니다.

## LangChain으로 단순화하기

직접 구현하면 PDF 읽기, 청크 나누기, 임베딩, FAISS 저장을 하나씩 처리해야 합니다.
LangChain을 사용하면 이 과정을 더 간단히 구성할 수 있습니다.

강의 코드에는 다음 흐름이 있습니다.

```python
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA

loader = PyPDFLoader("pdf/The_Adventures_of_Tom_Sawyer.pdf")
documents = loader.load()

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
docs = splitter.split_documents(documents)

embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
vdb = FAISS.from_documents(docs, embeddings)

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
retriever = vdb.as_retriever()

qa = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True,
)

result = qa.invoke({"query": "톰 소여는 누구인가?"})
print(result["result"])
```

## chunk_size와 chunk_overlap

`chunk_size`는 한 조각의 크기입니다.
`chunk_overlap`은 조각끼리 겹치는 부분입니다.

```python
RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=200,
)
```

왜 겹치게 할까요?

문장을 자르다 보면 중요한 내용이 청크 경계에서 끊길 수 있습니다.
겹침을 주면 앞뒤 문맥이 일부 유지됩니다.

## 정리

RAG는 문서를 읽고 답하는 AI를 만들 때 가장 중요한 패턴입니다.

- 임베딩은 문장을 숫자 벡터로 바꾸는 작업입니다.
- 청크는 긴 문서를 작은 조각으로 나누는 것입니다.
- FAISS는 비슷한 벡터를 빠르게 찾는 도구입니다.
- RAG는 검색된 문서 조각을 AI 답변의 근거로 사용합니다.

다음 글에서는 LangChain의 PromptTemplate, OutputParser, Chain 개념을 정리합니다.
