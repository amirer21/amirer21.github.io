---
title: (LangChain) FAISS로 해리포터 책을 의미 검색해보기 — 원리부터 코드까지 쉽게 이해하기
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
description: 인공지능 - FAISS로 해리포터 책을 의미 검색해보기 — 원리부터 코드까지 쉽게 이해하기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


# 📚 FAISS로 해리포터 책을 의미 검색해보기 — 원리부터 코드까지 쉽게 이해하기

생성형 AI를 활용해 "내 문서에서 답변하는" 시스템을 만들고 싶으신가요?  
그 첫걸음은 **문서를 벡터(embedding)로 변환**하고,  
**FAISS** 같은 **벡터 검색엔진**을 활용해  
**비슷한 내용**을 찾아내는 과정입니다.

오늘은 아주 간단한 실습 예제를 통해,  
**PDF 문서 → 임베딩 → FAISS 검색** 흐름을 직접 체험해보겠습니다.

예시 문서는 바로,  
> **"해리포터와 마법사의 돌"** 이라고 가정해보겠습니다. 🪄

---

## 🛠 전체 프로젝트 흐름

1. PDF 문서 열기
2. 텍스트를 500자씩 청크로 나누기
3. OpenAI Embedding API로 청크를 벡터로 변환
4. FAISS 인덱스에 벡터 저장
5. 질문을 벡터화해 가장 비슷한 청크 5개 찾기
6. 검색된 청크 출력

---

## 📄 코드 설명

### 1. PDF 파일에서 텍스트 추출 + 청크 분할

```python
import fitz  # PyMuPDF

text_chunks = []
chunk_size = 500

with fitz.open("pdf/Harry_Potter_and_the_Sorcerers_Stone.pdf") as doc:
    for page_num, page in enumerate(doc, 1):
        text = page.get_text()
        chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        text_chunks.extend(chunks)
```

- 문서의 텍스트를 **500자 단위**로 조각냅니다.
- 한 번에 처리할 수 있는 크기로 나눠야 임베딩이 가능합니다.

**✅ 출력 예시**  
"페이지 1, 청크 5개 생성 완료"  
"페이지 2, 청크 6개 생성 완료" ...

---

### 2. 텍스트를 임베딩(벡터)로 변환

```python
from openai import OpenAI

def get_embedding(text):
    response = client.embeddings.create(input=text, model="text-embedding-ada-002")
    emb = np.array(response.data[0].embedding, dtype=np.float32)
    return emb
```

- 각 청크를 **1536차원 벡터**로 변환합니다.
- OpenAI의 `text-embedding-ada-002` 모델을 사용합니다.

**✅ 출력 예시**  
"✅ 임베딩 벡터 크기: (1536,)"

---

### 3. FAISS 인덱스 생성

```python
import faiss
import numpy as np

def store_embedding_in_faiss(text_chunks):
    embeddings = [get_embedding(chunk) for chunk in text_chunks]
    embeddings_matrix = np.vstack(embeddings)

    index = faiss.IndexFlatL2(embeddings_matrix.shape[1])
    index.add(embeddings_matrix)
    return index

index = store_embedding_in_faiss(text_chunks)
```

- 모든 임베딩을 하나의 행렬로 묶어 FAISS에 저장합니다.
- FAISS는 빠른 유사도 검색을 지원하는 라이브러리입니다.

---

### 4. 질문 입력 → 유사한 청크 찾기

```python
question = "해리포터의 친구들은 누구야?"
q_emb = get_embedding(question).reshape(1, -1)

_, top_index = index.search(q_emb, k=5)
```

- 질문도 **벡터**로 변환하고
- **가장 비슷한 5개 청크**를 검색합니다.

**✅ 출력 예시**  
"🔍 top_index: [[0 23 12 48 5]]"

---

### 5. 검색된 청크 내용 출력

```python
for i in top_index[0]:
    print(f"📌 관련 청크 (index={i}):\n{text_chunks[i][:300]}...")
```

- 검색된 청크를 읽어보면,  
  **해리포터의 친구들(론, 헤르미온느 등)에 대한 설명**이 나올 것입니다!

---

## 🎯 동작 원리 요약

| 단계 | 내용 |
|:---|:---|
| 문서 분할 | 문서를 500자씩 조각냄 |
| 임베딩 | 각 조각을 의미 기반 벡터로 변환 |
| 벡터 저장 | FAISS 인덱스에 벡터 저장 |
| 질문 처리 | 질문도 벡터화 |
| 유사도 검색 | 질문과 가장 유사한 문서 조각 5개 검색 |

---

## ✨ 핵심 개념 정리

| 개념 | 설명 |
|:---|:---|
| **임베딩(Embedding)** | 텍스트를 고차원 숫자 벡터로 변환하는 과정 |
| **FAISS** | 대규모 벡터를 빠르게 검색하기 위한 라이브러리 |
| **L2 거리** | 벡터 간 "거리"를 기준으로 유사도를 계산 (가까울수록 유사) |
| **청크(Chunk)** | 긴 문서를 적당히 나눈 작은 단위 텍스트 |

---

# 📝 마무리

정리하면,

> **PDF 문서 → 텍스트 청크 → 임베딩 변환 → FAISS 저장 → 질문 검색**  
> 이 흐름을 이해하면 "내 문서에서 답변하는 AI 시스템"을 만들 수 있습니다!

"그냥 문자열 검색"이 아니라,  
**문장의 의미를 이해하고 찾는 것**이 포인트입니다. 🚀

---

# 🚀 다음 글 예고

다음에는  
👉 "**FAISS 인덱스를 저장하고 다시 불러오는 방법**"  
👉 "**검색된 청크들을 LLM에 넣어 답변 생성하는 방법**"  
도 함께 소개해드리겠습니다!