---
title: RAG 아키텍처 설계 실험기
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
- Architecture
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: 실제 서비스에서 RAG 아키텍처를 설계하고 실패를 반복하며 얻은 실험 기록과 Python 구현 예시
article_tag1: AI
article_tag2: RAG
article_tag3: Architecture
article_section: Engineering
meta_keywords: RAG, Vector DB, Retrieval, LLM, Python
last_modified_at: '2026-02-14 14:10:00 +0900'
---

# RAG 아키텍처 설계 실험기

RAG를 처음 붙일 때 대부분의 실패는 모델 선택이 아니라 **검색 파이프라인 설계 미스**에서 발생합니다.
이 글은 실험 중심으로, 왜 실패했는지와 어떻게 개선했는지를 코드와 함께 정리합니다.

## 핵심 결론 먼저

- 임베딩 모델보다 **문서 분할(chunking) 전략**이 성능에 더 큰 영향을 준다.
- 벡터 검색 단독보다 **hybrid retrieval(BM25 + vector)**가 운영 질의에 강하다.
- `정답이 문서에 있었는가`를 계측하지 않으면 품질 개선이 멈춘다.

## 실험했던 아키텍처

```text
[Ingestion]
  -> parser(pdf/html/md)
  -> chunker(semantic + heading-aware)
  -> embedder
  -> vector db

[Query]
  -> query rewrite
  -> hybrid retrieval (BM25 + vector)
  -> reranker
  -> context packer
  -> LLM answer
  -> citation validator
```

## 실패했던 실험

1. **고정 1,000자 chunk**
   - 표/코드 문맥이 잘려 정답률 급락
2. **벡터 검색 단독 사용**
   - 정확 키워드가 중요한 장애 질의에서 재현율 저하
3. **긴 컨텍스트 무작정 주입**
   - 비용 증가 + 근거 희석

## Python 구현 예시: Hybrid Retrieval 최소 구현

### 예제 코드

```python
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer
import numpy as np

# 1) 샘플 코퍼스
corpus = [
    "DB connection timeout when pool is exhausted",
    "Playwright test fails due to element not found in checkout page",
    "Kubernetes pod restart caused by OOMKill",
    "Retry policy for flaky e2e tests in staging",
]

# 2) BM25 인덱스 구성
# rank_bm25: 전통 정보검색 기법(BM25) 구현 라이브러리
# 장점: 키워드/정확 매칭에 강함
bm25_tokens = [doc.lower().split() for doc in corpus]
bm25 = BM25Okapi(bm25_tokens)

# 3) 벡터 임베딩 구성
# sentence-transformers: 문장을 dense vector로 바꿔 의미 유사도 검색 가능
embedder = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
doc_vectors = embedder.encode(corpus, normalize_embeddings=True)

def hybrid_search(query: str, alpha: float = 0.6, top_k: int = 2):
    # alpha: 벡터 점수 비중
    q_tokens = query.lower().split()
    bm25_scores = bm25.get_scores(q_tokens)

    q_vec = embedder.encode([query], normalize_embeddings=True)[0]
    vec_scores = np.dot(doc_vectors, q_vec)

    # min-max 정규화
    def normalize(x):
        x = np.asarray(x, dtype=float)
        if x.max() == x.min():
            return np.zeros_like(x)
        return (x - x.min()) / (x.max() - x.min())

    bm25_norm = normalize(bm25_scores)
    vec_norm = normalize(vec_scores)

    final_scores = alpha * vec_norm + (1 - alpha) * bm25_norm
    top_indices = np.argsort(final_scores)[::-1][:top_k]

    return [(corpus[i], float(final_scores[i])) for i in top_indices]

if __name__ == "__main__":
    q = "checkout page timeout and flaky retry"
    results = hybrid_search(q)
    for doc, score in results:
        print(f"{score:.3f} | {doc}")
```

### 코드 설명

- `rank_bm25.BM25Okapi`
  - 토큰 기반 키워드 검색 점수를 계산합니다.
  - 장애 코드/에러코드/고정 문자열처럼 **정확 단어가 중요한 질의**에서 강합니다.
- `sentence_transformers.SentenceTransformer`
  - 문장을 임베딩 벡터로 변환합니다.
  - 의미가 비슷하지만 단어가 다를 때도 검색되는 **semantic retrieval**에 유리합니다.
- `alpha` 가중치
  - `alpha`를 높이면 의미 검색 비중 증가, 낮추면 키워드 비중 증가.
  - 실무에서는 질의 타입별로 `alpha`를 다르게 적용합니다(운영 장애 질의는 BM25 비중↑).

## 개선안

- 섹션 헤더 단위 + 슬라이딩 윈도우 혼합 chunking
- hybrid retrieval + cross-encoder reranker
- context budget(토큰 상한)과 evidence priority 도입

## 운영 지표

- retrieval hit-rate@k
- grounded answer ratio
- no-answer precision
- cost per successful answer

RAG는 한 번의 설계로 끝나는 프로젝트가 아니라, 검색/평가/피드백 루프를 지속적으로 돌리는 운영 시스템입니다.
