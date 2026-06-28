---
title: "AI 세부 실습 14 - Hugging Face 텍스트, 이미지, 음성 모델"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- HuggingFace
tags:
- AI
- HuggingFace
- Transformers
- Vision
- Audio
toc: true
toc_sticky: true
toc_label: 목차
description: "43-45번 실습 파일을 기준으로 Hugging Face pipeline과 멀티모달 모델을 정리합니다."
article_tag1: AI
article_tag2: HuggingFace
article_tag3: Transformers
article_section: AI
meta_keywords: AI, Hugging Face, Transformers, 이미지 분류, 음성 인식
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# Hugging Face 텍스트, 이미지, 음성 모델

이 글은 다음 원본 실습 파일을 기준으로 정리합니다.

```text
43.langchain_huggingface_01_model.py
43.langchain_huggingface_02_korean_sentiment.py
44.huggingface_01_model.py
44.huggingface_02_multi_modal.py
45.huggingface_01_img_object.py
45.huggingface_02_img_object.py
45.huggingface_03_img_object.py
```

Hugging Face는 다양한 AI 모델을 쉽게 내려받아 사용할 수 있는 생태계입니다.

## pipeline

가장 쉬운 시작은 `pipeline`입니다.

```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis", device=-1)
result = classifier("I love Hugging Face!")
```

`pipeline`은 모델 로딩, 입력 전처리, 추론, 결과 후처리를 묶어 줍니다.

## 한국어 감성 분석

한국어 감성 분석 모델을 사용하면 문장이 긍정인지 부정인지 분류할 수 있습니다.

```text
나는 이 제품이 좋아.
-> 긍정
```

모델마다 지원 언어와 성능이 다르므로 모델 설명을 확인해야 합니다.

## 이미지 설명

```python
image_to_text = pipeline(
    "image-to-text",
    model="Salesforce/blip-image-captioning-base",
)
```

이미지를 넣으면 설명 문장을 생성합니다.

## 음성 인식

```python
pipe = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-small",
)
```

음성 파일을 텍스트로 바꾸는 작업입니다.
mp3 처리를 위해 FFmpeg가 필요할 수 있습니다.

## 이미지 분류

```python
pipe = pipeline(
    "image-classification",
    model="google/vit-base-patch16-224",
)
```

이미지 전체가 무엇인지 분류합니다.

## 정리

43-45번 실습은 Hugging Face의 여러 모델을 빠르게 사용해 보는 과정입니다.
텍스트, 이미지, 음성 모델을 모두 경험하면 멀티모달 AI 앱을 더 넓게 설계할 수 있습니다.
