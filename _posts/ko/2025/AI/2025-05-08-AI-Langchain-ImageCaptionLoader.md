---
title: 인공지능 - Hugging Face와 LangChain을 활용한 이미지 캡셔닝 처리 예제 (ImageCaptionLoader)
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
- HuggingFace
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - Hugging Face와 LangChain을 활용한 이미지 캡셔닝 처리 예제 (ImageCaptionLoader)
article_tag1: AI
article_tag2: HuggingFace
article_tag3: LLM
article_section: 
meta_keywords: AI, HuggingFace, LLM, LangChain
last_modified_at: '2025-05-08 21:00:00 +0800'
---

# Hugging Face와 LangChain을 활용한 이미지 캡셔닝 처리 예제 (ImageCaptionLoader)

## 1. 서론

최근 LLM(Large Language Model) 기반의 애플리케이션이 주목받고 있으며, 다양한 입력 타입(텍스트, 이미지, 문서 등)을 처리할 수 있는 기술들이 등장하고 있습니다. 특히 **LangChain**은 다양한 입력 데이터와 외부 도구를 조합하여 LLM의 응용력을 확장시켜주는 프레임워크입니다. 여기에 **Hugging Face**의 모델을 결합하면 더욱 풍부한 AI 기반 애플리케이션을 구축할 수 있습니다.

이 글에서는 Python 코드 기반으로 이미지에서 설명을 추출하는 **이미지 캡셔닝(Image Captioning)** 예제를 중심으로 Hugging Face + LangChain의 활용 흐름을 설명합니다.

---

## 2. 사전 준비

### 2.1 필요 라이브러리 설치

```bash
pip install langchain-openai langchain-experimental huggingface_hub transformers torch python-dotenv streamlit matplotlib
```

### 2.2 Hugging Face 토큰 발급 및 로그인

1. Hugging Face 로그인: [https://huggingface.co](https://huggingface.co)
2. 토큰 발급: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
3. `.env` 파일에 아래와 같이 저장:

```env
HUGGINGFACEHUB_API_TOKEN=hf_...
OPENAI_API_KEY=sk-...
```

---

## 3. 코드 구조 개요

### 3.1 주요 사용 모듈

| 모듈                                            | 설명                             |
| --------------------------------------------- | ------------------------------ |
| `ImageCaptionLoader`                          | 이미지를 받아 Hugging Face 모델로 설명 추출 |
| `dotenv`                                      | API Key 등의 환경 변수 로딩            |
| `langchain.vectorstores.FAISS`                | 벡터 DB로서 텍스트 검색 처리              |
| `RetrievalQA`, `ConversationalRetrievalChain` | LLM에 기반한 질의응답 처리               |

---

## 4. 예제 코드 설명

### 4.1 환경설정 및 API 키 로드

```python
from dotenv import load_dotenv
load_dotenv(dotenv_path='openapi_key.env')
load_dotenv(dotenv_path='huggingface_key.env')
```

* `.env` 파일에서 OpenAI와 HuggingFace API 키를 불러옵니다.

---

### 4.2 이미지 설명 처리: `ImageCaptionLoader`

```python
from langchain_community.document_loaders import ImageCaptionLoader

loader = ImageCaptionLoader(['image/cat.jpg', 'image/dog.jpg'])
documents = loader.load()
print(f"documents :: {documents}")
```

* 내부적으로 Hugging Face의 이미지-텍스트 모델(`BLIP` 등)을 사용하여 각 이미지에 대해 문장을 생성합니다.
* 예시 출력:

```
documents :: 
[
  Document(metadata={'image_path': 'image/cat.jpg'}, page_content='an image of a cat in a ham [SEP]'),
  Document(metadata={'image_path': 'image/dog.jpg'}, page_content='an image of a small white dog sitting in the grass [SEP]')
]
```

---

### 4.3 LangChain + FAISS 벡터 검색 연동 (선택)

* 추출된 캡션들을 FAISS 벡터 DB로 저장하여 유사 이미지 검색이나 질의응답 형태로 활용 가능

```python
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

embeddings = OpenAIEmbeddings()
db = FAISS.from_documents(documents, embeddings)
retriever = db.as_retriever()
```

* 이 구성은 텍스트 기반 유사도 검색이나, RetrievalQA 등과 연결해 응답형 시스템으로 확장 가능합니다.

---

## 5. 출력 결과 확인

* 코드 실행 시 `documents` 변수에 이미지 설명이 저장됩니다.
* 이후 Streamlit 등으로 웹 UI를 구성하여 이미지를 업로드하고 캡션을 바로 확인할 수도 있습니다.

---

## 6. 확장 아이디어

* 업로드된 이미지를 LangChain → FAISS → GPT 연결로 질의응답 처리
* 이미지 외 PDF, 웹페이지 등도 같이 처리
* UI 연동: Streamlit 기반 시각화 및 챗 인터페이스 구성

---

## 7. 결론

이 예제는 Hugging Face의 이미지 캡셔닝 모델을 LangChain의 document loader 형태로 감싸서, 자연스럽게 LLM 기반 응용에 통합하는 방식입니다. LangChain을 통해 이미지 → 설명 → 검색/질의응답의 전체 파이프라인을 구성할 수 있으며, 이를 통해 실제 AI 제품 수준의 기능을 빠르게 구현할 수 있습니다.

---

## 부록: 전체 코드 정리

```python
import os
import warnings
from dotenv import load_dotenv
from langchain_community.document_loaders import ImageCaptionLoader

# 환경 변수 로드
load_dotenv(dotenv_path='openapi_key.env')
load_dotenv(dotenv_path='huggingface_key.env')

# 이미지 캡션 추출
loader = ImageCaptionLoader(['image/cat.jpg', 'image/dog.jpg'])
documents = loader.load()

# 결과 출력
print(f"documents :: {documents}")
```