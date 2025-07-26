---
title: (LangChain) 텍스트 임베딩과 유사도 검색의 원리를 이해하기 - 간단한 FAISS 실습
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
description: 인공지능 - 텍스트 임베딩과 유사도 검색의 원리를 이해하기 - 간단한 FAISS 실습
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


# 🛠 텍스트 임베딩과 유사도 검색의 원리를 이해하기 - 간단한 FAISS 실습

생성형 AI를 다루다 보면 이런 시스템을 자주 듣게 됩니다:

> "문서에서 질문에 맞는 내용을 검색해서 답변하는 시스템(RAG, Retrieval Augmented Generation)"

이걸 제대로 이해하려면, 먼저 다음 과정을 알아야 합니다:

- **텍스트를 임베딩(embedding)** 한다
- **벡터 기반으로 의미상 유사도를 계산**한다
- **FAISS 같은 검색 엔진**을 통해 가장 가까운 문장을 찾는다

오늘 소개하는 코드는 바로 이 과정을 직접 눈으로 보고 체험할 수 있게 설계되었습니다.  
**즉, 텍스트 임베딩과 의미 기반 검색의 기본 원리를 이해하는 것**이 목표입니다.

---

## 🧠 이 코드가 설명하는 핵심 원리

| 단계 | 설명 | 예시 |
|:---|:---|:---|
| 1 | 텍스트를 조각(청크)으로 나눈다 | "Tom and Becky went to the cave" → 청크 |
| 2 | 각 청크를 벡터(embedding)로 변환한다 | [0.023, -0.055, ..., 0.078] (1536차원) |
| 3 | 질문을 벡터로 변환한다 | "등장 인물은 누구야?" → 벡터 |
| 4 | 질문 벡터와 문서 벡터 간 유사도를 계산한다 | 코사인 유사도, L2 거리 기반 |
| 5 | 가장 비슷한 문서를 찾아낸다 | 가장 의미가 가까운 문장들 반환 |

---

## 📄 전체 코드 흐름

### 1. PDF 파일에서 텍스트 추출 + 청크 분할

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

- 긴 텍스트를 **500자 단위**로 잘게 나눕니다.
- 이렇게 해야 LLM이나 임베딩 모델이 잘 처리할 수 있습니다.

---

### 2. 청크 → 임베딩 변환

```python
from openai import OpenAI

def get_embedding(text):
    response = client.embeddings.create(input=text, model="text-embedding-ada-002")
    emb = np.array(response.data[0].embedding, dtype=np.float32)
    return emb
```

- 각 청크를 OpenAI API를 사용해 **1536차원 벡터**로 변환합니다.
- 텍스트의 **의미를 숫자로 표현**하는 과정입니다.

---

### 3. FAISS 인덱스에 저장

```python
import faiss
import numpy as np

embeddings_matrix = np.vstack([emb for _, emb in chunk_embedding_pairs])
index = faiss.IndexFlatL2(embeddings_matrix.shape[1])
index.add(embeddings_matrix)
```

- 모든 임베딩을 하나의 거대한 행렬로 묶습니다.
- FAISS에 저장해서 **빠른 유사도 검색**이 가능하게 합니다.

---

### 4. 질문 → 임베딩 변환 후 검색

```python
question = "등장 인물에 대해 알려줄래?"
q_emb = get_embedding(question).reshape(1, -1)

_, top_index = index.search(q_emb, k=5)
```

- 질문도 벡터화합니다.
- 문서 청크 벡터들과 **거리 비교**를 해서 가장 가까운 5개를 찾습니다.

---

### 5. 결과 출력

```python
for i in top_index[0]:
    chunk, emb = chunk_embedding_pairs[i]
    print(f"텍스트 미리보기: {chunk[:200]}...")
    print(f"임베딩 일부: {emb[:5]}...")
```

- 유사한 문장들을 실제로 출력해서 확인합니다.
- **"이 질문에는 이 문장이 제일 비슷하구나"** 를 직접 볼 수 있습니다.

---

## 🎯 정리: 이 코드가 알려주는 것

| 주제 | 설명 |
|:---|:---|
| 토크나이징 | 문장을 조각(청크)으로 나눈다 |
| 임베딩 | 텍스트를 고차원 숫자 벡터로 변환한다 |
| 의미 비교 | 임베딩 벡터끼리 거리를 계산해서 의미 유사도를 판단한다 |
| 유사 문서 검색 | 가장 가까운 청크를 검색한다 |
| 벡터 DB | 검색을 빠르게 하기 위해 FAISS 인덱스를 사용한다 |

---

## 🧩 추가 심화 개념

- **임베딩 모델**: `text-embedding-ada-002`를 사용하여 문장의 의미를 벡터로 변환
- **L2 거리**: 두 벡터 간 "유클리드 거리"를 계산하여 가장 가까운 것을 선택
- **코사인 유사도**: 각도를 계산해 유사성을 판단하는 방법도 있다
- **RAG 시스템**: 위 과정을 GPT 같은 LLM과 결합하면 "내 문서에서 답변하는 AI"가 완성된다

---

# 📝 마무리

정리하자면,

> **텍스트를 벡터로 변환해 의미를 비교하고, 빠르게 유사한 문장을 찾는 원리**  
> 이 과정을 실제로 체험하고 이해하는 것이 이 코드의 핵심 목표입니다.

생성형 AI 시대에,  
**임베딩 → 검색 → 답변** 흐름은 모든 AI 서비스의 기본 뼈대가 되고 있습니다. 🚀

---

# 🚀 다음 글 예고

다음에는  
👉 "**FAISS 인덱스를 파일로 저장하고 다시 불러오는 방법**"  
👉 "**검색된 문서를 기반으로 GPT가 답변 생성하는 방법(RAG 완성)**"  
도 함께 다뤄보겠습니다!
