---
title: 인공지능 - RAG 어플리케이션 구조와 핵심요소
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
tags:
- AI
- RAG
toc: true
toc_sticky: true
toc_label: 목차
description: RAG 어플리케이션 구조와 핵심요소
article_tag1: AI
article_tag2: RAG
article_tag3: 
article_section: 
meta_keywords: AI, RAG
last_modified_at: '2024-08-19 21:00:00 +0800'
---

### **RAG Application 개발 핵심 요소**

이 이미지는 RAG(Retrieval-Augmented Generation) 응용 프로그램의 개발에 중요한 핵심 구성 요소와 그 구조를 보여줍니다. 각 구성 요소는 다음과 같이 설명할 수 있습니다:

1. **Governance & LLMops**:
   - **역할**: RAG 응용 프로그램 개발에서 데이터 거버넌스와 LLMops(대형 언어 모델 운영)를 담당하는 가장 하위의 기본적인 계층입니다. 이 계층은 데이터의 관리와 모델 운영에 관한 규칙을 정립하고, 시스템이 안정적으로 운영되도록 합니다.

2. **Data Pipeline**:
   - **구성 요소**:
     - **Parse raw documents**: 원시 문서를 분석하여 중요한 데이터를 추출합니다.
     - **Extract document metadata**: 문서에서 메타데이터를 추출하여 추가적인 정보로 활용합니다.
     - **Chunk documents**: 문서를 작은 조각으로 나누어 처리할 수 있도록 합니다.
     - **Embed documents**: 문서를 벡터로 변환하여 모델이 처리할 수 있도록 합니다.
     - **Sync to index**: 처리된 데이터를 인덱스와 동기화하여 검색 가능하게 만듭니다.
   - **역할**: 전체 데이터 처리 흐름을 관리하며, 원시 데이터를 가공하여 모델이 사용할 수 있는 형태로 준비합니다.

3. **RAG Chain**:
   - **역할**: 사용자 요청에 따라 검색된 데이터를 기반으로 텍스트를 생성하는 단계입니다. 여기에는 벡터/검색 인덱스와 임베딩 및 기초 모델이 포함됩니다.
   - **데이터 흐름**:
     - **User request**: 사용자가 요청을 보내면, 이 요청은 RAG Chain을 통해 처리됩니다.
     - **Vector/search index**: 사용자 요청에 따라 검색된 데이터를 벡터/검색 인덱스에서 가져옵니다.
     - **Embedding and foundational models**: 검색된 데이터를 바탕으로 응답을 생성하는 모델을 사용합니다.
     - **Response to user**: 생성된 응답이 사용자에게 전달됩니다.

4. **Evaluation & Monitoring**:
   - **역할**: RAG 시스템의 성능을 평가하고 모니터링하는 단계입니다. 모델의 결과물을 검토하고, 시스템의 지속적인 개선을 위해 모니터링을 수행합니다.

### **구조도 재구성**

제가 설명한 내용을 바탕으로 RAG Application의 구조도를 텍스트로 표현하자면 다음과 같습니다:



- **RAG Chain**은 핵심 처리 단계로, 사용자 요청을 받아 검색 및 응답을 생성하는 과정을 거칩니다.
- **Data Pipeline**은 데이터를 준비하고 처리하여 RAG Chain에서 사용할 수 있는 상태로 만듭니다.
- **Evaluation & Monitoring**은 시스템의 성능을 지속적으로 평가하고 개선합니다.
- **Governance & LLMops**는 전체 시스템 운영과 거버넌스를 관리합니다.

이 구조도는 RAG 기반 응용 프로그램의 개발과 운영에서 고려해야 할 주요 구성 요소들을 시각적으로 이해하는 데 도움이 됩니다.