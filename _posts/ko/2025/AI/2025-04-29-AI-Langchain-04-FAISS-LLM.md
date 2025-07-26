---
title: (LangChain) FAISS (Facebook AI Similarity Search), 대규모 벡터 검색의 핵심
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- LangChain
- LLM
- ChatGPT
tags:
- AI
- LangChain
- LLM
- ChatGPT
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - FAISS(Facebook AI Similarity Search), 대규모 벡터 검색의 핵심
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


## 대규모 벡터 검색의 핵심 - FAISS (Facebook AI Similarity Search) 


### 🔍 FAISS란? LLM 실습에서 벡터 검색이 중요한 이유

대형 언어 모델(LLM)을 활용한 질문 응답 시스템이나 RAG(Retrieval-Augmented Generation)를 구현할 때, 우리는 “문서 중 어떤 게 이 질문에 관련 있을까?”를 먼저 알아야 합니다.  
이때 쓰는 도구가 바로 **FAISS (Facebook AI Similarity Search)**입니다.

> FAISS는 고차원 벡터 데이터에서 가장 유사한 항목을 **빠르고 효율적으로 검색**할 수 있게 도와주는 오픈소스 라이브러리입니다.  
> 특히 LLM과 함께 **외부 지식 검색 → 생성 모델로 답변 생성** 흐름에서 필수 도구로 자리잡고 있습니다.

---

## 🧠 실습의 목적: LLM은 '기억력'이 짧다

LLM은 똑똑하지만, 질문 하나로 모든 걸 알 수는 없습니다.  
그래서 LLM에게 도움을 주기 위해 우리는 **외부 문서**에서 관련 내용을 **검색(Retrieval)**하고,  
그 정보를 바탕으로 **답변을 생성(Generation)**하는 구조인 **RAG**를 사용합니다.

### ✅ 실습에서 우리가 하고 싶은 일
1. PDF 같은 문서를 파싱하고,
2. 각 문서를 작은 조각으로 나누고,
3. 각 조각을 **벡터로 변환(임베딩)**하고,
4. 질문도 벡터로 만들어서,
5. **가장 가까운 문서 조각을 검색**해 GPT에게 주는 것.

👉 여기서 **문서 벡터들 중, 질문 벡터와 가장 가까운 것**을 빠르게 찾는 것이 핵심입니다.  
그 역할을 하는 게 바로 **FAISS**입니다.

---

## 🧩 FAISS의 기본 메커니즘

### 1. 벡터화 (Embedding)

먼저 문서를 GPT에게 이해 가능한 벡터로 바꿉니다.  
예: “창업자금 예산은 100억 원입니다.” → `[0.1, 0.7, -0.3, ..., 0.25]` (1536차원 벡터)

문서가 많아지면 벡터도 수천, 수만 개가 됩니다.  
이걸 효율적으로 저장하고, 질문과 가장 가까운 걸 **빠르게 찾기** 위해 FAISS가 필요합니다.

### 2. 인덱싱 (Indexing)

```python
import faiss
index = faiss.IndexFlatL2(1536)  # 1536차원 벡터를 위한 L2 거리 인덱스
index.add(vectors)  # 문서 임베딩들을 저장
```

- FAISS는 이 벡터들을 **인덱스 구조**로 저장합니다.
- 추후 질문 벡터와 **거리 계산**을 할 때 빠르게 검색할 수 있도록 준비해둡니다.

### 3. 유사도 기반 검색

```python
D, I = index.search(query_vector, k=3)  # 가장 가까운 3개 문서 검색
```

- `query_vector`: 사용자가 입력한 질문을 임베딩한 벡터
- FAISS는 수만 개의 문서 중에서 **가장 가까운 3개**를 빠르게 찾아냅니다.

---

## ⚙️ FAISS가 제공하는 인덱스 종류

FAISS는 데이터 양과 정확도/속도 요구사항에 따라 다양한 인덱스를 제공합니다:

| 인덱스 유형 | 설명 | 특징 |
|-------------|------|------|
| `IndexFlatL2` | 모든 벡터를 직접 비교 | **가장 정확하지만 느림** |
| `IVF` (Inverted File) | 벡터를 군집화하고 일부만 비교 | **속도 빠름**, 정확도 약간 손해 |
| `HNSW` | 그래프 기반 탐색 | **빠르고 정확도 높음**, 메모리 사용 높음 |

> 실습에서는 `IndexFlatL2`로 시작하고, 데이터가 많아지면 `IVF`나 `HNSW`로 전환해도 좋습니다.

---

## 🧪 실습 예시 코드

```python
import faiss
import numpy as np

# 문서 벡터 (예: 100개 문서, 1536차원 임베딩)
vectors = np.random.rand(100, 1536).astype('float32')

# 쿼리 벡터 (사용자 질문)
query = np.random.rand(1, 1536).astype('float32')

# 인덱스 생성 및 저장
index = faiss.IndexFlatL2(1536)
index.add(vectors)

# 가장 유사한 문서 5개 검색
distances, indices = index.search(query, k=5)
```

---

## 🤝 FAISS와 LLM은 어떻게 연결될까?

### 📌 RAG 구조

```
사용자 질문 → [임베딩] → 벡터로 변환  
          ↓  
FAISS 검색 → 관련 문서 조각 검색  
          ↓  
LLM(GPT 등) → 답변 생성  
```

- GPT는 문서를 직접 검색하지 않습니다.
- FAISS가 먼저 **문맥에 맞는 자료를 찾아주고**, GPT는 그걸 읽고 **답변만 잘 쓰면 됩니다**.

---

## 🧾 결론

FAISS는 LLM 기반 질문 응답 시스템에서 **문맥 이해력을 극대화하는 핵심 도구**입니다.  
텍스트 데이터를 벡터로 변환한 뒤, **FAISS를 통해 빠르고 정확하게 검색**하면,  
LLM은 그 문서를 기반으로 **풍부하고 관련성 높은 답변을 생성**할 수 있습니다.

> 📌 LLM이 잘 대답하기 위해선, **좋은 문서를 검색해주는 시스템**이 먼저 필요합니다.  
> FAISS는 그 검색의 핵심 기술입니다.
