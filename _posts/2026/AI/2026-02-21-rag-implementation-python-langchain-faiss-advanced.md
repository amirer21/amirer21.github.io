---
title: Python으로 RAG 시스템 심화 구현하기 (LangChain + FAISS 실전 구조 확장)
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
description: RAG 구현 방법을 심화로 확장한다. 문서 로딩, 전처리, chunking 전략, retriever 튜닝, 출처 반환, 캐시까지 실전형 구조로 정리.
article_tag1: AI
article_tag2: RAG
article_tag3: Python
article_section: Engineering
meta_keywords: RAG 구현 방법, LangChain, FAISS, Python, Chunking, Retriever, Citation
last_modified_at: '2026-02-21 11:00:00 +0900'
---

# Python으로 RAG 시스템 심화 구현하기 (LangChain + FAISS 실전 구조 확장)

입문편에서 “RAG 구현 방법”의 최소 구조를 만들었다면, 심화편에서는 **실제 서비스에 가까운 구조**로 확장해 봅니다. 핵심은 세 가지입니다. **문서 전처리**, **검색 품질**, **답변 신뢰도**. 이 세 축을 잡으면 RAG는 바로 실전으로 넘어갈 수 있습니다.

## 오늘의 목표

- 실제 파일을 로딩하고 전처리한다
- chunking 전략을 바꿔 검색 품질을 끌어올린다
- 출처(citation)와 메타데이터를 함께 반환한다
- 검색 튜닝과 캐시로 비용과 응답 시간을 줄인다

## 1. 심화 RAG 구조 그림

입문형과 달리, 심화형은 파이프라인을 한 단계씩 명확히 나눕니다.

```text
[Ingestion]
  -> loader (pdf/html/md)
  -> cleaning
  -> chunking
  -> embedding
  -> FAISS index

[Query]
  -> query rewrite(선택)
  -> retriever(k 조정)
  -> context formatter
  -> LLM answer + citations
  -> cache
```

## 2. 파일 로딩 + 전처리

실전에서는 문서가 깨끗하지 않습니다. 불필요한 줄바꿈, 중복 공백, 머리글/꼬리글은 **검색 품질을 크게 떨어뜨립니다**. 아래는 Markdown 파일을 로딩하고 간단히 전처리하는 예시입니다.

```python
import re
from pathlib import Path
from langchain.schema import Document

def clean_text(text: str) -> str:
    text = re.sub(r"\s+", " ", text)
    text = text.replace("\u200b", "")
    return text.strip()

files = list(Path("./docs").glob("*.md"))
raw_docs = []
for f in files:
    content = f.read_text(encoding="utf-8")
    content = clean_text(content)
    raw_docs.append(Document(page_content=content, metadata={"source": f.name}))
```

핵심은 `metadata`에 **source 정보를 반드시 넣는 것**입니다. 그래야 답변에 출처를 붙일 수 있습니다.

## 3. Chunking 전략: 성능 차이를 만드는 핵심

입문형은 고정 크기 분할이었죠. 심화형에서는 **문장 단위 + 적절한 overlap**이 훨씬 안정적입니다.

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=400,
    chunk_overlap=80,
    separators=["\n\n", "\n", ". ", " "]
)

split_docs = splitter.split_documents(raw_docs)
```

- 너무 큰 chunk는 핵심 정보가 묻힙니다
- 너무 작은 chunk는 문맥이 끊깁니다
- **400~600자 + overlap 60~100**이 실전에서 무난합니다

## 4. FAISS 인덱스 + 저장/로드

서비스 운영을 하려면 매번 임베딩을 다시 만들 수 없습니다. **FAISS 인덱스 저장/로드**는 필수입니다.

```python
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings

embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(split_docs, embeddings)
vectorstore.save_local("./faiss_index")

# 재로드
vectorstore = FAISS.load_local("./faiss_index", embeddings, allow_dangerous_deserialization=True)
```

## 5. Retriever 튜닝: k 값과 검색 옵션

검색 결과가 답을 결정합니다. `k`는 적절히 조정해야 합니다.

```python
retriever = vectorstore.as_retriever(
    search_kwargs={"k": 5}
)
```

- **답이 짧으면 k=3**
- **설명형 질문이면 k=5~7**
- “왜?” 질문은 문맥이 넓어야 합니다

## 6. 출처 포함 답변 생성 (신뢰도 강화)

실전형에서는 **답변과 함께 근거 문서를 반환**하는 구조가 안전합니다.

```python
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True,
)

query = "RAG 구현 방법을 설명해줘"
result = qa({"query": query})

print(result["result"])
for doc in result["source_documents"]:
    print(doc.metadata.get("source"), doc.page_content[:120])
```

이제 답변이 나올 때 **출처 파일명과 근거 문장**을 함께 제공할 수 있습니다.

## 7. 캐시로 비용과 속도 최적화

같은 질문이 반복된다면 캐시를 쓰는 게 맞습니다. 간단한 파일 캐시 예시입니다.

```python
import json
from hashlib import md5

cache_path = "./cache.json"
cache = json.loads(Path(cache_path).read_text()) if Path(cache_path).exists() else {}

def get_cache(query: str):
    key = md5(query.encode()).hexdigest()
    return cache.get(key)

def set_cache(query: str, result: str):
    key = md5(query.encode()).hexdigest()
    cache[key] = result
    Path(cache_path).write_text(json.dumps(cache, ensure_ascii=False, indent=2))
```

RAG는 토큰 비용이 빠르게 늘어납니다. 캐시는 비용 방어막입니다.

## 8. 실전 품질을 올리는 5가지 체크리스트

- 문서 전처리(공백/줄바꿈/머리글 제거) 했는가
- chunk_size / overlap을 실험했는가
- retriever `k`를 질문 유형에 맞게 조정했는가
- 답변에 출처를 붙였는가
- 캐시로 비용을 줄였는가

## 정리

심화형 RAG는 결국 **문서를 얼마나 잘 준비하느냐**에서 승부가 납니다. 구조는 복잡해 보이지만, 핵심은 단순합니다.

- RAG 구현 방법의 품질은 **문서 전처리 + chunking + 검색 튜닝**에 달려 있다
- FAISS 인덱스 저장/로드로 운영 가능성을 확보한다
- 출처 반환은 신뢰도를 만든다

이제 이 구조를 PDF/웹 크롤링 데이터로 확장하면 실전 서비스에 가까워집니다. 다음 단계로 **하이브리드 검색(BM25 + 벡터)**이나 **Reranker**를 붙이면 더욱 안정적인 품질을 얻을 수 있습니다.
