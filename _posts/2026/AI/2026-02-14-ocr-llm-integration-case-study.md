---
title: OCR + LLM 결합 사례
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
tags:
- AI
- OCR
- LLM
- Document AI
toc: true
toc_sticky: true
toc_label: 목차
description: OCR과 LLM을 결합해 문서 자동 처리 파이프라인을 구축한 사례 정리
article_tag1: AI
article_tag2: OCR
article_tag3: LLM
article_section: Engineering
meta_keywords: OCR, LLM, Document Parsing, Extraction
last_modified_at: '2026-02-14 10:30:00 +0900'
---

# OCR + LLM 결합 사례

OCR 단독으로는 텍스트 추출까지만 가능하고, 문서의 의미 해석은 제한적입니다.
반대로 LLM 단독으로는 이미지/스캔 품질 이슈에 취약합니다. 그래서 두 기술의 결합이 현실적인 해법입니다.

## 파이프라인

```text
[Document Upload]
    -> Image Preprocess(denoise, deskew)
    -> OCR Engine
    -> Layout Reconstruction
    -> LLM Extraction(JSON schema)
    -> Validation Rules
    -> Human Review(optional)
```

## 실제 적용 예: 세금계산서 처리

추출 필드:
- 공급자/공급받는자
- 사업자번호
- 발행일
- 합계금액/세액

LLM 프롬프트에서 JSON schema를 강제하면, 후처리 검증과 DB 적재가 쉬워집니다.

## 실패 포인트

1. 저해상도 스캔으로 OCR 오인식 증가
2. 표 레이아웃 붕괴로 숫자-항목 매핑 실패
3. LLM이 없는 필드를 추정해서 hallucination 발생

## 해결 전략

- 이미지 전처리 표준화 및 OCR confidence 기반 재처리
- layout-aware parser 추가
- "모르면 null" 정책과 필드별 검증 룰 적용

## 운영 팁

- OCR confidence와 LLM confidence를 분리 저장
- low confidence 문서는 자동으로 검수 큐로 전달
- 문서 유형 분류기를 선행해 프롬프트 라우팅

OCR + LLM은 정확도와 자동화율의 균형을 맞추는 시스템이며, 검증 루프를 포함할 때 비로소 실무에서 안정적으로 동작합니다.
