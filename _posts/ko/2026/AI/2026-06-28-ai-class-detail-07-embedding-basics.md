---
title: "AI 세부 실습 07 - 임베딩 기초와 벡터 검색"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- Embedding
tags:
- AI
- Embedding
- Vector
- FAISS
toc: true
toc_sticky: true
toc_label: 목차
description: "17번 실습 파일을 기준으로 임베딩, 청크, 벡터 검색의 기초를 정리합니다."
article_tag1: AI
article_tag2: Embedding
article_tag3: Vector
article_section: AI
meta_keywords: AI, 임베딩, 벡터, FAISS, 청크
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# 임베딩 기초와 벡터 검색

이 글은 다음 원본 실습 파일을 기준으로 정리합니다.

```text
17_20250421_01.py
17_20250421_01_embedding.py
17_20250421_01_embedding02.py
17_20250421_01_embedding03_chunk_and_embedding.py
```

17번 실습은 RAG로 가기 전 가장 중요한 개념인 임베딩을 다룹니다.

## 임베딩이란?

임베딩은 문장이나 단어를 숫자 배열로 바꾸는 작업입니다.

```text
"고양이는 소파에서 잔다"
-> [0.12, -0.04, 0.33, ...]
```

컴퓨터는 문자의 의미를 직접 이해하지 못합니다.
그래서 AI 모델을 사용해 의미를 숫자 벡터로 표현합니다.

## 왜 숫자로 바꿀까?

숫자로 바꾸면 문장끼리의 유사도를 계산할 수 있습니다.

예를 들어 다음 두 문장은 의미가 비슷합니다.

```text
고양이가 잠을 잔다.
고양이가 자고 있다.
```

임베딩 벡터로 바꾸면 두 문장의 위치가 가까워집니다.

## 청크

긴 문서를 한 번에 임베딩하기 어렵기 때문에 작은 조각으로 나눕니다.

```python
chunk_size = 500
chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
```

이 조각을 청크라고 부릅니다.

## 임베딩 생성 함수

강의 코드의 핵심 구조는 다음과 같습니다.

```python
from openai import OpenAI
import numpy as np

client = OpenAI()

def get_embedding(text):
    response = client.embeddings.create(
        input=text,
        model="text-embedding-ada-002",
    )
    return np.array(response.data[0].embedding, dtype=np.float32)
```

문장을 넣으면 벡터가 반환됩니다.

## 벡터 검색

질문도 임베딩으로 바꾼 뒤, 문서 청크 임베딩과 비교합니다.

```text
질문 벡터
-> 문서 벡터들과 거리 계산
-> 가장 가까운 청크 선택
```

이 과정을 빠르게 해 주는 대표적인 도구가 FAISS입니다.

## 정리

17번 실습은 RAG의 기초입니다.
임베딩을 이해하면 "AI가 문서에서 관련 내용을 어떻게 찾는지" 이해할 수 있습니다.
