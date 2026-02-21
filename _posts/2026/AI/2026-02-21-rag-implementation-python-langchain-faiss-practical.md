---
title: Python으로 RAG 시스템 실전 구현하기 (LangChain + FAISS 운영 구조)
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
- Production
toc: true
toc_sticky: true
toc_label: 목차
description: RAG 구현 방법의 실전편. 대용량 문서 인덱싱, 배치 파이프라인, 하이브리드 검색, 재랭킹, 모니터링까지 운영 기준으로 정리.
article_tag1: AI
article_tag2: RAG
article_tag3: Production
article_section: Engineering
meta_keywords: RAG 구현 방법, LangChain, FAISS, Production, Hybrid Retrieval, Reranker, Monitoring
last_modified_at: '2026-02-21 12:00:00 +0900'
---

# Python으로 RAG 시스템 실전 구현하기 (LangChain + FAISS 운영 구조)

입문편과 심화편을 지나면 결국 남는 질문은 하나입니다. **“이걸 운영 환경에서 어떻게 굴리지?”** 실전편에서는 **RAG 구현 방법을 서비스 기준으로 정리**합니다. 목표는 품질과 비용, 운영 안정성을 동시에 잡는 것입니다.

## 실전 목표

- 대용량 문서 인덱싱 파이프라인 구축
- 하이브리드 검색 + 재랭킹으로 정확도 개선
- 응답 품질 계측과 모니터링
- 장애 대응을 위한 예외 처리 구조

## 1. 실전 RAG 아키텍처

```text
[Batch Ingestion]
  -> loader
  -> cleaning
  -> chunking
  -> embedding
  -> index (FAISS)
  -> versioning

[Online Query]
  -> query rewrite
  -> hybrid retrieval (BM25 + vector)
  -> reranker
  -> context packer
  -> LLM answer + citation
  -> cache
  -> logs/metrics
```

실전 RAG는 **배치 파이프라인**과 **온라인 질의 파이프라인**을 분리하는 것이 핵심입니다.

## 2. 배치 인덱싱: 대용량 문서 처리

문서가 많아지면 한 번에 임베딩하기 어렵습니다. 배치 단위로 처리하고, 인덱스 버전을 관리해야 합니다.

```python
from pathlib import Path
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS

BATCH_SIZE = 200

files = list(Path("./docs").glob("*.md"))
docs = [Document(page_content=f.read_text(encoding="utf-8"), metadata={"source": f.name}) for f in files]

splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
chunks = splitter.split_documents(docs)

embeddings = OpenAIEmbeddings()

vectorstore = None
for i in range(0, len(chunks), BATCH_SIZE):
    batch = chunks[i:i+BATCH_SIZE]
    if vectorstore is None:
        vectorstore = FAISS.from_documents(batch, embeddings)
    else:
        vectorstore.add_documents(batch)

vectorstore.save_local("./faiss_index_v1")
```

- **배치 크기**를 조절해 메모리 폭주를 막습니다
- 인덱스는 `v1`, `v2`처럼 버전을 붙여 롤백 가능하게 합니다

## 3. 하이브리드 검색 도입

실전에서는 벡터 검색만으로는 부족합니다. **정확 키워드에 강한 BM25**를 섞어야 합니다.

```python
from rank_bm25 import BM25Okapi

corpus = [d.page_content for d in chunks]
bm25 = BM25Okapi([c.split() for c in corpus])

def hybrid_search(query: str, k: int = 5):
    bm25_scores = bm25.get_scores(query.split())
    vector_docs = vectorstore.similarity_search(query, k=k)
    return vector_docs, bm25_scores
```

실무에서는 **BM25 결과와 벡터 결과를 합산/가중치**로 조정합니다.

## 4. 재랭킹으로 정확도 올리기

검색 결과가 많을수록 LLM에 넣기 전에 **재랭킹**이 필요합니다. 심플하게는 LLM을 이용한 리랭킹도 가능합니다.

```python
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

prompt = PromptTemplate(
    input_variables=["query", "candidates"],
    template="""
    질문: {query}
    후보 문서:
    {candidates}

    질문과 가장 관련 있는 문서 3개를 순서대로 번호만 출력하세요.
    """
)

# 후보 문서를 묶어 재랭킹 요청
```

**재랭킹은 비용이 늘지만 정답률이 급상승**합니다. 검색 품질이 중요한 서비스라면 필수입니다.

## 5. 응답 품질 계측

실전에서 중요한 건 “정답이 문서에 있었는가?”를 확인하는 것입니다.

- 검색된 문서에 정답 근거가 있었는가
- 답변이 그 근거를 제대로 활용했는가
- 잘못된 답변 비율(환각률)이 얼마나 되는가

이 지표가 없으면, 개선이 불가능합니다.

## 6. 운영 안정성: 예외 처리와 폴백

```python
try:
    result = qa({"query": query})
except Exception:
    # LLM 장애 시 폴백
    result = {"result": "현재 답변을 생성할 수 없습니다. 잠시 후 다시 시도해주세요."}
```

- LLM 장애 시 폴백 메시지 제공
- 검색 실패 시 “문서 없음” 안내
- 캐시 사용으로 동일 질문 반복 비용 감소

## 7. 실전 운영 체크리스트

- 인덱스 버전 관리 및 롤백 가능 여부
- 하이브리드 검색 도입 여부
- 재랭킹 적용 여부
- 답변 출처 제공 여부
- 로그/메트릭/에러 트래킹 여부

## 정리

실전 RAG는 단순한 “검색 + 생성”이 아니라 **운영 시스템**입니다.

- RAG 구현 방법의 핵심은 **검색 품질과 운영 안정성**
- 배치 인덱싱 + 하이브리드 검색 + 재랭킹이 실전 정답률을 만든다
- 로그와 지표 없이는 개선이 멈춘다

여기까지 구축하면, RAG는 단순 실험이 아니라 **비즈니스 기능**이 됩니다. 다음 단계로는 **평가 데이터셋 구축**과 **자동화된 품질 테스트**를 도입해보세요.
