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
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: OCR과 LLM을 결합해 문서 자동 처리 파이프라인을 구축한 사례와 Python 코드 예시
article_tag1: AI
article_tag2: OCR
article_tag3: LLM
article_section: Engineering
meta_keywords: OCR, LLM, Document Parsing, Extraction, Python
last_modified_at: '2026-02-14 14:30:00 +0900'
---

# OCR + LLM 결합 사례

OCR 단독으로는 텍스트 추출까지만 가능하고, 문서 의미 해석은 제한적입니다.
반대로 LLM 단독으로는 스캔 품질 이슈에 취약합니다. 그래서 실무에서는 두 기술을 함께 씁니다.

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

## Python 구현 예시: 영수증 필드 추출

### 예제 코드

```python
import re
import json
import pytesseract
from PIL import Image
from openai import OpenAI

client = OpenAI()

def mask_sensitive(text: str) -> str:
    # 카드번호/전화번호 마스킹 예시
    text = re.sub(r"\b\d{4}-\d{4}-\d{4}-\d{4}\b", "****-****-****-****", text)
    text = re.sub(r"\b01\d-\d{3,4}-\d{4}\b", "***-****-****", text)
    return text


def extract_receipt_fields(image_path: str) -> dict:
    # 1) OCR
    image = Image.open(image_path)
    ocr_text = pytesseract.image_to_string(image, lang="kor+eng")
    safe_text = mask_sensitive(ocr_text)

    # 2) LLM 구조화 추출
    prompt = f"""
다음 OCR 텍스트에서 영수증 정보를 JSON으로 추출하세요.
키는 merchant, date, total_amount, vat, items(list)로 고정.
모르면 null.

[OCR TEXT]
{safe_text}
"""

    res = client.chat.completions.create(
        model="gpt-4.1-mini",
        temperature=0,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You extract receipt fields strictly as JSON."},
            {"role": "user", "content": prompt},
        ],
    )

    parsed = json.loads(res.choices[0].message.content)

    # 3) 간단 검증
    if parsed.get("total_amount") is not None and parsed["total_amount"] < 0:
        raise ValueError("total_amount must be >= 0")

    return parsed
```

### 코드 설명

- `pytesseract`
  - Tesseract OCR 엔진을 Python에서 호출하는 라이브러리입니다.
  - 문서 이미지에서 텍스트를 추출하는 1차 레이어로 사용합니다.
- `Pillow(PIL)`
  - 이미지 로딩/전처리(리사이즈, 회전 보정 등)의 기본 도구입니다.
- `openai` SDK
  - OCR 결과를 정형 JSON으로 변환하는 의미 해석 레이어를 담당합니다.
- `response_format={"type": "json_object"}`
  - 자연어가 아닌 구조화된 응답을 강제해 후처리 안정성을 높입니다.
- `mask_sensitive`
  - 개인정보를 제거한 뒤 LLM에 전달해 보안 리스크를 줄입니다.

## 실패 포인트

1. 저해상도 스캔으로 OCR 오인식 증가
2. 표 레이아웃 붕괴로 숫자-항목 매핑 실패
3. LLM이 없는 필드를 추정해 hallucination 발생

## 해결 전략

- 이미지 전처리 표준화 및 OCR confidence 기반 재처리
- layout-aware parser 추가
- "모르면 null" 정책 + 필드 검증 룰 적용

## 운영 팁

- OCR confidence와 LLM confidence를 분리 저장
- low confidence 문서는 자동 검수 큐로 전달
- 문서 유형 분류기를 선행해 프롬프트 라우팅

OCR + LLM은 정확도와 자동화율의 균형을 맞추는 시스템이며, 검증 루프를 포함할 때 비로소 실무에서 안정적으로 동작합니다.
