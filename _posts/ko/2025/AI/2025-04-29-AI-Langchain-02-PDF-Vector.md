---
title: 인공지능 - Langchain을 활용한 질문 응답 시스템 구축 (벡터 DB와 GPT 모델 결합)
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
description: 인공지능 - Langchain을 활용한 질문 응답 시스템 구축 (벡터 DB와 GPT 모델 결합)
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


## Langchain을 활용한 질문 응답 시스템 구축 (벡터 DB와 GPT 모델 결합)

## 🧠 LangChain으로 문서 기반 질문 응답 시스템 만들기  
### PDF 문서를 검색 가능한 LLM 지식으로 바꾸는 첫 걸음

LLM(GPT 같은 대형 언어 모델)은 아주 똑똑하지만, **"기억력"은 짧습니다**.  
즉, 모델이 미리 학습한 데이터 외에 **최신 문서**나 **특정 기관의 내부 자료**에 대한 질문에는 답하기 어렵습니다.

이 문제를 해결하려면?  
→ **문서를 직접 검색해서 모델에게 전달하는 구조**, 즉 **RAG(Retrieval-Augmented Generation)**가 필요합니다.

이번 글에서는 LangChain을 이용해 다음과 같은 구조를 구현합니다:

```
PDF 문서 → 텍스트 분할 → 벡터화 → 벡터 DB 저장 → 검색 → GPT 응답 생성
```

---

## 🛠️ 실습 목표

- ✅ PDF 문서를 불러와 텍스트로 변환하고
- ✅ 적절한 단위로 쪼개고
- ✅ 임베딩을 통해 벡터화하고
- ✅ FAISS 벡터 데이터베이스에 저장한 후
- ✅ 사용자의 질문을 받아 관련 문서를 검색하고
- ✅ GPT로부터 최종 응답을 생성합니다.

---

## 1. 🔧 기본 환경 설정

```python
import os
import warnings
from dotenv import load_dotenv
from openai import OpenAI

warnings.filterwarnings("ignore", category=UserWarning)
load_dotenv(dotenv_path='openapi_key.env')  # API 키 로드
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
```

`.env` 파일에 저장된 OpenAI 키를 불러와 **GPT 모델을 사용할 준비**를 합니다.

---

## 2. 📄 문서 불러오기 및 텍스트 분할

```python
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from glob import glob

def create_vector_db():
    alldoc = []
    for path in glob('./test_source/*.pdf'):
        loader = PyPDFLoader(path)
        documents = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=700, chunk_overlap=20)
        chunks = splitter.split_documents(documents)
        alldoc.extend(chunks)

    return alldoc
```

- **PyPDFLoader**: PDF에서 텍스트 추출  
- **Text Splitter**: 텍스트를 모델이 이해하기 쉬운 작은 단위로 나눕니다 (토큰 초과 방지)

---

## 3. 🔢 벡터화 및 FAISS 인덱싱

```python
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS

docs = create_vector_db()
embedding_model = OpenAIEmbeddings()
vector_db = FAISS.from_documents(docs, embedding_model)
```

- 각 텍스트 조각은 **OpenAI 임베딩 모델**로 변환되어 벡터로 바뀝니다.
- 이 벡터들을 FAISS DB에 저장하면 **질문에 가장 가까운 문서를 빠르게 검색**할 수 있습니다.

---

## 4. 🤖 질문 → 검색 → 응답 생성

```python
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI

gpt = ChatOpenAI(model='gpt-3.5-turbo', temperature=0)
retriever = vector_db.as_retriever()
qa_chain = RetrievalQA.from_chain_type(llm=gpt, chain_type='stuff', retriever=retriever)
```

- **RetrievalQA**: 검색 + 생성 자동 조합 체인
- `chain_type='stuff'`: 검색된 문서들을 그대로 GPT에 **붙여서 전달**하는 가장 단순한 방식

---

## 5. 📥 질문하고 답 받아보기

```python
query = '2021년 서울시 창업지원 사업에 대한 예산은 얼마인가?'
result = qa_chain.invoke({'query': query})
print("답변:", result['result'])
```

GPT가 **벡터 검색을 통해 찾아낸 문서 내용**을 바탕으로 질문에 대해 정확하게 응답합니다.

---

## 📌 이 실습으로 이해할 수 있는 것들

| 이해 항목 | 설명 |
|-----------|------|
| ✅ 문서 검색 기반 응답 생성 | 단순 GPT 사용을 넘어, **외부 문서 기반으로 응답을 만드는 구조** 학습 |
| ✅ 벡터 DB의 필요성 | 문서가 많을 때도 빠르고 정확한 검색을 위한 **FAISS 벡터 검색** |
| ✅ LangChain 구성 흐름 | 문서 로딩 → 분할 → 임베딩 → 검색 → 응답까지의 체인 구축 이해 |

---

## ✅ 마무리

이 글에서 우리는 LangChain, FAISS, OpenAI를 활용해  
**PDF 문서를 검색 가능한 LLM 지식 기반**으로 바꾸는 구조를 구현했습니다.

이 시스템은 다음 단계로 확장할 수 있습니다:

- 대화형 응답 (`ConversationalRetrievalChain`)
- 다양한 파일 형식(JSON, CSV 등) 지원
- 검색 품질 향상을 위한 reranker 도입

---

다음 글에서는 이 시스템을 **대화형으로 확장**하는 방법, 즉  
“**금액만 알려줘**” 같은 **문맥을 기억하는 응답** 시스템으로 발전시켜보겠습니다! 🚀
