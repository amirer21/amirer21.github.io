---
title: (LangChain) Langchain을 활용한 대화형 질문 응답 시스템 구축하기 (Conversational Retrieval Chain)
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
description: 인공지능 - Langchain을 활용한 대화형 질문 응답 시스템 구축하기 (Conversational Retrieval Chain)
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


## Langchain을 활용한 대화형 질문 응답 시스템 구축하기 (Conversational Retrieval Chain)

물론입니다! 아래는 두 번째 글(대화형 질문 응답 시스템)에 대한 **블로그 글 형식 재작성본**입니다.  
**LangChain의 ConversationalRetrievalChain 기능**을 중심으로, **대화 문맥을 기억하며 응답하는 시스템**을 어떻게 구현하는지를 초보자도 이해할 수 있도록 구성했습니다.

---

## 🧠 LangChain으로 대화형 문서 QA 시스템 만들기  
### “금액만 알려줘”도 알아듣는 GPT 기반 문서 비서

지난 글에서는 LangChain과 FAISS를 활용하여  
**PDF 문서를 벡터화하고, 질문에 대한 정확한 답을 생성하는 시스템**을 만들었습니다.

하지만 사용자가 이런 질문을 하면 어떨까요?

> 💬 **“금액만 알려줘.”**

이전 방식으로는 이 질문을 **이해하지 못합니다.**  
이유는? 이전 질문과 대답을 **기억하지 못하기 때문**입니다.

이번 글에서는 이 한계를 뛰어넘어,  
**대화의 흐름을 기억하며 문서에서 정보를 추론**하는 시스템을 만들어봅니다.  
즉, 진짜 비서처럼 **대화를 이어가는 LLM 시스템**을 구축하는 것이 목표입니다.

---

## ✅ 이번 실습의 핵심 목표

- GPT가 질문과 문서만 보고 답하는 구조 → ❌  
- **대화 문맥까지 반영해 응답**하는 구조 → ✅

이를 위해 사용하는 LangChain 컴포넌트가 바로  
👉 `ConversationalRetrievalChain`

---

## 🔧 환경 준비

```python
import os
import warnings
from dotenv import load_dotenv
from openai import OpenAI

warnings.filterwarnings("ignore", category=UserWarning)

load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
```

- 환경 변수에서 API 키 로드
- OpenAI 클라이언트 생성

---

## 📄 PDF 문서 불러오기 & 벡터화

```python
from glob import glob
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS

def create_vector_db():
    alldoc = []
    for path in glob('./test_source/*.pdf'):
        loader = PyPDFLoader(path)
        documents = loader.load()
        splitter = RecursiveCharacterTextSplitter(chunk_size=700, chunk_overlap=20)
        chunks = splitter.split_documents(documents)
        alldoc.extend(chunks)
    embedding = OpenAIEmbeddings()
    vector_db = FAISS.from_documents(alldoc, embedding)
    return vector_db
```

- PDF를 불러와 텍스트 분할
- OpenAI 임베딩으로 벡터화
- FAISS로 검색 가능한 인덱스 생성

---

## 🤖 ConversationalRetrievalChain 구성

```python
from langchain.chains import ConversationalRetrievalChain
from langchain_openai import ChatOpenAI

vdb = create_vector_db()
gpt = ChatOpenAI(model='gpt-3.5-turbo', temperature=0)
retriever = vdb.as_retriever()

qa_chain = ConversationalRetrievalChain.from_llm(
    llm=gpt,
    retriever=retriever
)
```

### 여기서 중요한 포인트:

| 구성요소 | 설명 |
|----------|------|
| `retriever` | FAISS 기반 검색기 (문서에서 관련 내용 찾기) |
| `llm` | 답변 생성기 (GPT-3.5) |
| `ConversationalRetrievalChain` | 질문뿐 아니라 **이전 대화도 함께 고려**해서 답변 |

---

## 💬 대화 시뮬레이션 예시

```python
# 대화 이력 저장 리스트
hist = []

# 첫 번째 질문
query = '2022년 서울시 창업지원사업업의 예산은 얼마인가요?'
result = qa_chain.invoke({'question': query, 'chat_history': hist})
print(f"Q1: {query}")
print(f"A1: {result['answer']}")
hist.append((query, result['answer']))

# 두 번째 질문 (문맥을 포함해야 의미가 있음!)
followup = '금액만 알려줘'
result = qa_chain.invoke({'question': followup, 'chat_history': hist})
print(f"Q2: {followup}")
print(f"A2: {result['answer']}")
```

### 결과 예시:

```
Q1: 2022년 혁신창업사업화자금(융자)의 예산은 얼마인가요?
A1: 2022년 해당 사업의 예산은 총 1000억 원입니다.

Q2: 금액만 알려줘
A2: 1000억 원입니다.
```

> GPT는 "금액만 알려줘"라는 **모호한 질문에도 정확히 반응**합니다.  
> 그 이유는 `chat_history` 덕분에 **대화 문맥을 파악**할 수 있기 때문입니다.

---

## 🧠 첫 번째 글과의 차이점 요약

| 항목 | 첫 번째 글 (RetrievalQA) | 두 번째 글 (ConversationalRetrievalChain) |
|------|---------------------------|--------------------------------------------|
| 답변 방식 | 질문 1개당 답변 1개 (단절된 응답) | 대화 문맥에 따라 이어지는 응답 |
| 메모리 | 없음 | `chat_history`로 대화 흐름 유지 |
| 활용도 | FAQ, 단문 질의 응답 | 사용자 맞춤형 문서 상담, 비서 챗봇 |
| 체인 종류 | `RetrievalQA` | `ConversationalRetrievalChain` |

---

## ✅ 마무리

이번 실습에서는 LangChain의 `ConversationalRetrievalChain`을 사용하여  
**문서 기반 대화형 QA 시스템**을 구현해보았습니다.

✔️ LLM이 단지 문서를 읽는 것에서 나아가  
✔️ **대화 흐름을 이해하고 이어서 응답하는 기능**까지 포함된 구조였습니다.

---

## ✨ 다음에 다뤄볼 내용

- 대화 기록을 **Session 기반으로 저장**하는 방법  
- 유사도 검색 품질을 높이기 위한 **reranker 적용**  
- 응답을 **요약하거나 포맷팅**해서 표로 보여주는 방식 등

> 이제부터 여러분도, 문서를 기억하고 대화하는  
> 나만의 GPT 문서 비서를 만들 수 있습니다. 🙌
