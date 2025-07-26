---
title: (LangChain) Langchain에서 chain_type 선택하기 - 문서 처리 방식 이해하기
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
description: 인공지능 - Langchain에서 chain_type 선택하기 문서 처리 방식 이해하기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


## Langchain에서 `chain_type` 선택하기: 문서 처리 방식 이해하기

Langchain을 사용하면서 **문서 검색**과 **답변 생성을 최적화**하는 다양한 방법을 제공하는데, 그 중 하나가 바로 `chain_type`입니다. `chain_type`은 검색된 문서들을 어떻게 처리하여 LLM(대형 언어 모델)에게 전달할지에 대한 방식을 정의합니다. 이를 잘 이해하면, 다양한 문서 처리 방식에 맞는 최적의 방법을 선택할 수 있습니다.

이번 글에서는 Langchain의 주요 `chain_type` 방식에 대해 소개하고, 각 방식의 특징과 사용하는 목적에 맞는 선택 방법을 알아보겠습니다.

---

### 1. `stuff`: 빠르고 간단한 방식

`stuff`는 가장 **단순**하고 **빠른** 방법으로, 검색된 문서들을 **그대로 이어 붙여서 한 번에 LLM에게 전달**하는 방식입니다. 문서가 적고 **간단한 답변을 빠르게 생성**해야 할 때 적합합니다.

#### 특징:
- 문서들을 한 번에 이어붙여 처리하므로 **빠르고 간단**합니다.
- 문서의 양이 많으면 **토큰 초과** 문제로 에러가 발생할 수 있습니다.

#### 예시:
여러 개의 뉴스 기사를 검색한 후, 그 기사를 모두 합쳐서 한 번에 LLM에 넘깁니다.

```python
# 예시
documents = [doc1, doc2, doc3]  # 검색된 문서들
query = "뉴스의 주요 내용은 무엇인가?"
context = " ".join(documents)  # 문서들을 이어 붙임
response = llm(query, context)
```

#### 언제 사용하나?
- 문서 수가 적고, 토큰 길이를 넘지 않을 때.
- 빠른 답변을 원하는 경우.

---

### 2. `map_reduce`: 대량 문서 처리

`map_reduce`는 검색된 문서들을 **하나씩 요약(map)** 한 뒤, 그 요약들을 **합쳐서 최종 답변(reduce)** 을 생성하는 방식입니다. 문서가 많거나 길어도 처리할 수 있는 방식으로, **속도는 느리지만** 답변의 **정확도**는 높을 수 있습니다.

#### 특징:
- 문서가 많거나 길더라도 안정적으로 처리할 수 있습니다.
- 속도는 `stuff`보다 **느리지만**, 품질은 더 좋아질 수 있습니다.

#### 예시:
여러 개의 연구 논문을 검색한 후, 각 논문을 개별적으로 요약하고, 마지막에 그 요약들을 결합하여 최종 결론을 도출합니다.

```python
# 예시
summaries = []
for doc in documents:
    summary = summarize(doc)  # 각 문서 요약
    summaries.append(summary)
final_summary = combine(summaries)  # 요약을 합침
response = llm(query, final_summary)
```

#### 언제 사용하나?
- 긴 문서나 많은 문서를 다룰 때.
- 문서의 세부 사항까지 반영하려는 경우.

---

### 3. `refine`: 점진적인 답변 개선

`refine`는 **첫 번째 문서로 초벌 답변을 만들고**, 이후 문서를 **추가하면서 점진적으로 답변을 개선**하는 방식입니다. 답변 품질을 **최고로** 만들고 싶지만, **시간이 오래 걸릴 수** 있습니다.

#### 특징:
- 점진적으로 **정확한 답변**을 도출합니다.
- **시간이 오래 걸릴 수 있으므로**, 고품질의 답변이 필요할 때 사용합니다.

#### 예시:
첫 번째 문서로 대략적인 답변을 생성하고, 두 번째 문서에서 그 답변을 조금 수정하며 점차적으로 완성도를 높입니다.

```python
# 예시
answer = generate_answer(documents[0])  # 첫 번째 문서로 초벌 답변 생성
for doc in documents[1:]:
    answer = refine_answer(answer, doc)  # 나머지 문서들로 답변 개선
response = llm(query, answer)
```

#### 언제 사용하나?
- **고품질의 답변**을 얻고 싶을 때.
- 문서가 많고 **점진적인 수정**이 필요한 경우.

---

### 4. `map_rerank`: 관련성 높은 문서 선택

`map_rerank`는 **각 문서마다 질문과의 관련성 점수를 평가하고**, 그 중에서 **가장 관련성이 높은 문서 하나만 선택**하여 답변을 생성하는 방식입니다. 여러 문서들 중에서 **가장 중요한 하나만 선택**하여 빠르고 정확한 답변을 제공합니다.

#### 특징:
- 여러 문서 중에서 **가장 관련성 높은 문서**만 선택합니다.
- **연산량**이 많지만, 정확도가 높습니다.

#### 예시:
여러 문서를 검색한 후 각 문서와 질문의 관련성 점수를 평가하고, **가장 높은 점수를 받은 문서 하나를 선택**하여 답변을 생성합니다.

```python
# 예시
scores = []
for doc in documents:
    score = evaluate_relevance(doc, query)  # 각 문서와 질문의 관련성 점수 계산
    scores.append((score, doc))
best_doc = max(scores, key=lambda x: x[0])[1]  # 가장 높은 점수의 문서 선택
response = llm(query, best_doc)
```

#### 언제 사용하나?
- **다양한 문서 중 최적의 답변**을 원할 때.
- **빠른 응답**과 정확도가 중요할 때.

---

### 5. `rerank`: 문서 재정렬로 품질 높이기

`rerank`는 **검색된 문서들을 더 좋은 순서로 재정렬**하여 LLM에 넘기는 방법입니다. 이를 통해 질문과 더 관련성이 높은 문서가 상위에 오도록 하여, **답변의 정확도**를 높일 수 있습니다.

#### 특징:
- 벡터 유사도 기반의 검색에서 **정확히 질문에 맞는 문서**를 선택합니다.
- 별도의 `reranker` 모델을 사용하여 문서를 평가하고, **더 정확한 답변을 생성**합니다.

#### 예시:
1. 벡터 DB에서 여러 문서를 검색합니다.
2. `reranker` 모델이 각 문서와 질문의 조합을 평가하여 점수를 매깁니다.
3. 점수가 높은 순서대로 문서를 재정렬하여 **최고의 문서만 선택**합니다.

```python
# 예시
retrieved_docs = search_docs(query)
reranked_docs = rerank(retrieved_docs, query)
top_docs = reranked_docs[:3]  # 상위 3개 문서 선택
response = llm(query, top_docs)
```

#### 언제 사용하나?
- **정확한 질문-문서 매칭**을 원할 때.
- **검색 품질을 높이고 싶을 때**.

---

### 결론

`chain_type`을 적절히 선택하는 것은 Langchain을 활용한 AI 프로젝트에서 **효율성**과 **정확성**을 높이는 데 중요합니다. 문서의 양이나 길이, 원하는 답변의 품질에 맞춰 `stuff`, `map_reduce`, `refine`, `map_rerank` 등의 방식 중 적합한 것을 선택하면 최적의 결과를 얻을 수 있습니다.

| **목적**                         | **추천 `chain_type`** |
|----------------------------------|-----------------------|
| 문서가 적고 짧을 때                | `stuff`               |
| 문서가 많고 길 때                  | `map_reduce`          |
| 점진적으로 세밀한 답변이 필요할 때  | `refine`              |
| 가장 관련성 높은 문서 하나로 빠르게 답변할 때 | `map_rerank`          |
