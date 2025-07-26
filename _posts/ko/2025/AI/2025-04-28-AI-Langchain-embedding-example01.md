---
title: (LangChain) FAISS를 이용한 PDF 문서 검색 원리 - 실습 예제로 쉽게 이해하기
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
description: 인공지능 - FAISS를 이용한 PDF 문서 검색 원리 - 실습 예제로 쉽게 이해하기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


# 🛠 FAISS를 이용한 PDF 문서 검색 원리 - 실습 예제로 쉽게 이해하기

요즘 생성형 AI와 RAG(Retrieval Augmented Generation) 시스템을 공부하다 보면,  
"문서를 벡터로 변환해서 검색하는" 기술이 자주 등장합니다.

그 핵심 도구 중 하나가 바로 **FAISS**입니다.

그런데 처음 보면 이런 의문이 들죠.

> "FAISS가 뭔데?"  
> "PDF 문서를 어떻게 벡터로 만들고, 어떻게 검색하는 거야?"

오늘은 아주 간단한 실습 예제를 통해  
**FAISS 기반 문서 검색의 원리**를 차근차근 이해해보겠습니다!

---

## 🛠 전체 코드 요약

이번 예제는 다음 과정을 따릅니다.

1. PDF 문서 읽기
2. 문서를 적당히 쪼개서 텍스트 청크 생성
3. 각 청크를 OpenAI Embedding API를 이용해 벡터로 변환
4. FAISS에 벡터 저장
5. 질문을 입력해서 가장 비슷한 문서 조각 검색

---

## 📄 주요 코드 흐름 설명

### 1. PDF 문서 열고 텍스트 청크로 분할

```python
import fitz  # PyMuPDF

text_chunks = []
chunk_size = 500

with fitz.open("pdf/The_Adventures_of_Tom_Sawyer.pdf") as doc:
    for page_num, page in enumerate(doc, 1):
        text = page.get_text()
        chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        text_chunks.extend(chunks)
```

- **500자**씩 끊어서 문서를 조각냅니다.
- 한 번에 너무 큰 문서를 처리하면 임베딩 오류가 나기 때문입니다.

**✅ 결과**: 텍스트 조각 리스트 완성

---

### 2. 텍스트 청크를 임베딩(벡터)로 변환

```python
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def get_embedding(text):
    response = client.embeddings.create(input=text, model="text-embedding-ada-002")
    emb = np.array(response.data[0].embedding, dtype=np.float32)
    return emb
```

- 각 청크를 **OpenAI 임베딩 모델(text-embedding-ada-002)** 로 1536차원 벡터로 변환합니다.
- 실패하면 0벡터를 반환해 안전하게 처리합니다.

**✅ 결과**: 모든 문서 청크를 벡터로 변환

---

### 3. FAISS에 벡터 저장

```python
import faiss
import numpy as np

def store_embedding_in_faiss(text_chunks):
    embeddings = [get_embedding(chunk) for chunk in text_chunks]
    embeddings_matrix = np.vstack(embeddings)

    index = faiss.IndexFlatL2(embeddings_matrix.shape[1])  # L2 거리 기반 인덱스 생성
    index.add(embeddings_matrix)
    return index

index = store_embedding_in_faiss(text_chunks)
```

- **FAISS 인덱스**를 생성해서 모든 벡터를 저장합니다.
- 이 인덱스는 나중에 빠른 유사도 검색을 가능하게 합니다.

**✅ 결과**: 검색 가능한 벡터 DB 생성

---

### 4. 질문을 입력해 유사한 문서 검색

```python
question = "등장 인물에 대해 알려줄래?"
q_emb = get_embedding(question).reshape(1, -1)

_, top_index = index.search(q_emb, k=5)
```

- 질문을 임베딩(벡터화)하고
- 저장된 문서 벡터들과 **L2 거리**로 가장 가까운 5개를 찾습니다.

**✅ 결과**: 질문과 가장 비슷한 문서 조각 5개를 찾아줌

---

## 🧩 동작 원리 요약

| 단계 | 설명 |
|:---|:---|
| 문서 읽기 | PDF 파일을 열고 텍스트 추출 |
| 텍스트 청크 분리 | 500자 단위로 나눔 |
| 임베딩 변환 | 각 청크를 1536차원 벡터로 변환 |
| 벡터 DB 생성 | FAISS에 벡터 저장 |
| 질문 처리 | 질문을 벡터화하고 가장 가까운 문서 조각 검색 |

---

## 🎯 중요한 포인트

| 항목 | 설명 |
|:---|:---|
| **FAISS** | 대규모 벡터를 빠르게 검색해주는 라이브러리 (L2 거리, 코사인 유사도 등 지원) |
| **임베딩** | 문장을 벡터 공간에 의미적으로 매핑하는 과정 |
| **유사도 검색** | 입력 쿼리 벡터와 저장된 문서 벡터 간 거리 계산 (거리가 가까울수록 의미가 유사) |
| **텍스트 조각(Chunking)** | 문서가 너무 길 경우 토큰 초과를 방지하기 위해 미리 나눔 |

---

# 📝 마무리

정리하면,

> **PDF 문서를 의미 기반으로 검색하려면,**  
> **임베딩 → FAISS 저장 → 벡터 검색**이라는 과정을 거쳐야 합니다.

- 문서 전체를 한 번에 이해하는 것이 아니라
- 작은 청크들을 의미적으로 연결하고,
- 질문과 가장 잘 맞는 조각을 찾아주는 방식입니다.

FAISS와 임베딩 덕분에  
**"문자 일치"가 아니라 "의미 일치" 검색**이 가능해진 것입니다. 🚀
