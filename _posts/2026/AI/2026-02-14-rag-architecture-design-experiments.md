---
title: RAG 아키텍처 설계 실험기
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
- Architecture
toc: true
toc_sticky: true
toc_label: 목차
description: 실제 서비스에서 RAG 아키텍처를 설계하고 실패를 반복하며 얻은 실험 기록
article_tag1: AI
article_tag2: RAG
article_tag3: Architecture
article_section: Engineering
meta_keywords: RAG, Vector DB, Retrieval, LLM
last_modified_at: '2026-02-14 10:10:00 +0900'
---

# RAG 아키텍처 설계 실험기

RAG를 처음 붙일 때 대부분의 실패는 모델 선택이 아니라 **검색 파이프라인 설계 미스**에서 발생합니다.

## 핵심 결론 먼저

- 임베딩 모델보다 **문서 분할 전략**이 성능에 더 큰 영향을 준다.
- 검색 상위 3개 문서만 넣는 구조는 실무 질의에서 자주 실패한다.
- "정답이 문서에 있었는가"를 측정하지 않으면 품질 개선이 정체된다.

## 실험했던 아키텍처

```text
[Ingestion]
  -> parser(pdf/html/md)
  -> chunker(semantic + heading-aware)
  -> embedder
  -> vector db

[Query]
  -> query rewrite
  -> hybrid retrieval (BM25 + vector)
  -> reranker
  -> context packer
  -> LLM answer
  -> citation validator
```

## 실패했던 실험

1. **고정 1,000자 chunk**
   - 표/코드 문맥이 깨져서 정답률 급락
2. **벡터 검색 단독 사용**
   - 키워드가 중요한 운영 질의에서 재현율 저하
3. **긴 컨텍스트 무작정 주입**
   - 비용 증가, 답변 근거 희석

## 개선안

- 섹션 헤더 단위 + 슬라이딩 윈도우 혼합 chunking
- hybrid retrieval + cross-encoder reranker
- context budget(토큰 상한)과 evidence priority 도입

## 운영 지표

- retrieval hit-rate@k
- grounded answer ratio
- no-answer precision
- cost per successful answer

RAG는 한 번의 설계로 끝나는 프로젝트가 아니라, 검색/평가/피드백 루프를 지속적으로 돌리는 운영 시스템입니다.
