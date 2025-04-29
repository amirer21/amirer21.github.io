---
title: 인공지능 - LangChain으로 스타트업 창업 가이드 문서 검색 시스템 만들기
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
description: 인공지능 - LangChain으로 스타트업 창업 가이드 문서 검색 시스템 만들기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---



# 🛠 LangChain으로 스타트업 창업 가이드 문서 검색 시스템 만들기

AI 시대에 "문서에서 질문하고 답변하는" 기능은 정말 흔하게 요구됩니다.  
이를 구현하려면 단순히 LLM 호출만으로는 부족합니다.

> ✨ 문서를 **쪼개고**, **벡터로 바꾸고**, **의미상 비슷한 걸 찾아** LLM에 던져줘야 합니다.

이런 과정을 자동화하는 것이 바로 **LangChain**의 힘입니다.

오늘은  
- LangChain 전체 흐름  
- 청크(Chunk) 분할  
- 임베딩(Embedding)  
- 유사도 검색(Retrieval)  
- GPT 쿼리(질문-답변 매커니즘)  
까지 실습 코드와 함께 **한 번에** 정리해보겠습니다.

---

## 🛠 전체 흐름 요약

1. PDF 문서를 로드
2. 문서를 적당한 길이로 쪼개기 (Chunk)
3. 각 청크를 임베딩(벡터화)
4. 벡터를 FAISS에 저장
5. 질문을 임베딩하여 가장 유사한 문서 조각 검색
6. 검색된 내용을 기반으로 GPT가 답변 생성

---

## 📄 코드 설명

### 1. 문서 로드

```python
from langchain.document_loaders import PyPDFLoader

pdfloader = PyPDFLoader("pdf/Startup_Guide.pdf")
documents = pdfloader.load()
print(f"불러온 문서 수: {len(documents)}")
```

- PDF 파일을 한 페이지 단위로 읽어옵니다.
- 각 페이지는 텍스트와 메타데이터를 포함하는 **Document** 객체가 됩니다.

---

### 2. 문서 청크(Chunk) 분할

```python
from langchain.text_splitter import RecursiveCharacterTextSplitter

txt_split = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
docs = txt_split.split_documents(documents)
print(f"생성된 청크 수: {len(docs)}")
```

- 긴 문서를 **1000자 단위**로 쪼개고, **200자씩 겹치게** 합니다.
- 이유는?  
  > 문맥이 부드럽게 이어지도록 일부 내용을 중복시켜 연결성을 높이기 위함입니다.

✅ **Chunking이 중요한 이유**  
LLM은 한 번에 처리할 수 있는 토큰 수(약 4000~8000 tokens)가 제한되어 있기 때문에, 문서를 나누어야 합니다.

---

### 3. 임베딩(Embedding) 생성 및 저장

```python
from langchain_openai import OpenAIEmbeddings
from langchain.vectorstores import FAISS

embeddings = OpenAIEmbeddings(model="text-embedding-ada-002")
vdb = FAISS.from_documents(docs, embeddings)
vdb.save_local("myfaiss")
```

- 각 청크를 OpenAI의 **"text-embedding-ada-002"** 모델로 1536차원 벡터로 변환합니다.
- 변환된 벡터를 **FAISS**라는 벡터 데이터베이스에 저장합니다.

✅ **Embedding이 중요한 이유**  
텍스트를 **숫자 공간**으로 변환하면, 텍스트끼리 **'의미상 가까운 정도'** 를 수치로 비교할 수 있습니다.

---

### 4. 질문 임베딩 및 유사도 검색 (Retrieval)

```python
gpt_llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
retriever = vdb.as_retriever()
```

- 사용자가 질문을 입력하면,
- 질문도 임베딩으로 변환해서,
- 저장된 문서 청크들 중 **의미상 가장 가까운 조각들 4~5개**를 검색합니다.

✅ **Retrieval이 중요한 이유**  
GPT에게 "전체 문서"를 던지면 토큰 초과 오류가 나지만,  
**질문과 관련된 부분만 추려서** 보내면 훨씬 정확하고 빠릅니다.

---

### 5. GPT에게 문맥(Context) + 질문(Query) 보내 답변 생성

```python
from langchain.chains import RetrievalQA

qa = RetrievalQA.from_chain_type(
    llm=gpt_llm,
    chain_type='stuff',
    retriever=retriever,
    return_source_documents=True
)

query = "스타트업 초기 투자 유치 방법 알려줘."
result = qa.invoke({'query': query})

print(f"질문: {query}")
print(f"답변: {result['result']}")
```

- 검색된 문서 조각들을 하나로 **Stuff(이어붙이기)** 합니다.
- 이어붙인 Context + 질문을 LLM에게 보내서 답변을 생성합니다.

✅ **여기서 'stuff'란?**  
검색된 문서들을 "하나로 합쳐서" (stuffing) 프롬프트에 넣는다는 뜻입니다.  
(문서가 적을 때 효과적)

---

## 📈 전체 구조 그림 요약

| 단계 | 설명 |
|:---|:---|
| 문서 로드 | PDF 등에서 원본 문서를 가져옴 |
| 청크 분할 | 문서를 적절한 크기로 조각냄 |
| 임베딩 생성 | 문서 조각을 의미 벡터로 변환 |
| 벡터 저장 | FAISS에 벡터 저장 |
| 질문 임베딩 | 질문도 의미 벡터로 변환 |
| 유사도 검색 | 질문과 가장 비슷한 문서 조각 찾기 |
| GPT 호출 | 문맥(Context) + 질문을 입력해 답변 생성 |

---

## 🧩 추가로 알아두면 좋은 개념

| 개념 | 설명 |
|:---|:---|
| **Chunk 크기** | 너무 작으면 맥락을 잃고, 너무 크면 검색/토큰 초과 문제가 생김 |
| **임베딩 모델** | text-embedding-ada-002가 가장 일반적이지만, 다양한 모델 존재 |
| **검색 방법** | 코사인 유사도(Cosine Similarity)나 L2 거리 기반 |
| **chain_type='stuff'** | 단순 이어붙이기 방식. 문서가 클 경우는 'map_reduce' 같은 다른 방법도 고려 |

---

# 📝 마무리

정리하면,

> **LangChain은 문서를 다루는 전체 AI 파이프라인(로드 → 분할 → 임베딩 → 검색 → 답변)을 깔끔하게 관리하는 프레임워크입니다.**

특히 "청크 분할 + 임베딩 + 유사도 검색 + GPT 호출" 이 4단계를 이해하면,  
대부분의 "내 데이터로 답변하기" 시스템을 직접 구현할 수 있습니다. 🚀

---

# 🚀 다음 글 예고

👉 "**Chunk 크기와 Overlap 설정 최적화 방법**"  
👉 "**stuff, map_reduce, refine 체인 방식 비교**"  
👉 "**FAISS 인덱스를 파일로 저장하고 불러오는 실습**"  
