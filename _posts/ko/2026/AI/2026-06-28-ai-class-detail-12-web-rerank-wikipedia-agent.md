---
title: "AI 세부 실습 12 - 웹 문서 검색, 리랭킹, Wikipedia Agent"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- Agent
tags:
- AI
- WebLoader
- Rerank
- Wikipedia
- Agent
toc: true
toc_sticky: true
toc_label: 목차
description: "27번 실습 파일을 기준으로 웹 문서 요약, 검색, 리랭킹, Wikipedia Agent를 정리합니다."
article_tag1: AI
article_tag2: Rerank
article_tag3: Agent
article_section: AI
meta_keywords: AI, 웹문서검색, 리랭킹, Wikipedia Agent, LangChain
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# 웹 문서 검색, 리랭킹, Wikipedia Agent

이 글은 다음 실습 주제를 기준으로 정리합니다.

- 웹 문서 로딩과 요약
- 웹 문서 기반 검색
- 검색 결과 리랭킹
- Wikipedia 도구를 사용하는 Agent
- 웹 검색 흐름 복습

27번 실습은 문서가 로컬 PDF에만 있지 않고, 웹 문서나 외부 지식 도구로 확장되는 단계입니다.

## 웹 문서 로딩

웹 문서를 읽어오면 해당 페이지 내용을 요약하거나 검색할 수 있습니다.

```python
from langchain_community.document_loaders import WebBaseLoader

loader = WebBaseLoader("https://example.com")
documents = loader.load()
```

가져온 문서는 PDF와 마찬가지로 청크 분할, 임베딩, 검색 과정을 거칠 수 있습니다.

## 웹 문서 RAG

```text
웹 페이지 읽기
-> 텍스트 추출
-> 청크 분할
-> 임베딩
-> 유사 문서 검색
-> 답변 생성
```

회사 공지, 기술 문서, 뉴스 페이지 요약 등에 활용할 수 있습니다.

## 리랭킹

리랭킹은 1차 검색 결과를 다시 정렬하는 과정입니다.

```text
벡터 검색으로 후보 20개 찾기
-> 리랭커가 더 관련 있는 순서로 재정렬
-> 상위 3-5개만 LLM에 전달
```

문서가 많아질수록 1차 검색만으로는 부족할 수 있습니다.
리랭킹은 답변 품질을 높이는 데 도움이 됩니다.

## Wikipedia Agent

Wikipedia Agent는 필요할 때 Wikipedia 같은 외부 지식 도구를 사용합니다.

```text
사용자 질문
-> Agent가 Wikipedia 검색 필요 판단
-> 검색 실행
-> 결과 요약
```

Agent는 사용자의 질문에 따라 도구를 고르는 방식이므로 단순 체인보다 유연합니다.

## 정리

27번 실습은 RAG를 웹과 외부 도구로 확장하는 단계입니다.
웹 로더, 리랭킹, Wikipedia Agent를 이해하면 더 실용적인 검색 기반 AI 앱을 만들 수 있습니다.
