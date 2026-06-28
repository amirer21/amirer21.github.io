---
title: "AI 강의 정리 09 - Hugging Face, 로컬 모델, 파인튜닝 기초"
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
- FineTuning
- LMStudio
toc: true
toc_sticky: true
toc_label: 목차
description: "Hugging Face pipeline, 이미지/음성 모델, LM Studio, 파인튜닝과 LoRA의 기본 개념을 정리합니다."
article_tag1: AI
article_tag2: HuggingFace
article_tag3: FineTuning
article_section: AI
meta_keywords: AI, Hugging Face, Transformers, 파인튜닝, LoRA, LM Studio
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# Hugging Face란?

Hugging Face는 AI 모델과 데이터셋을 공유하고 사용할 수 있는 플랫폼입니다.
OpenAI API처럼 서버에 요청하는 방식도 있지만, Hugging Face에서는 모델을 내려받아 내 컴퓨터나 서버에서 실행하는 경우도 많습니다.

강의 폴더에서는 다음 파일들이 이 주제에 해당합니다.

```text
43.langchain_huggingface_01_model.py
43.langchain_huggingface_02_korean_sentiment.py
44.huggingface_01_model.py
44.huggingface_02_multi_modal.py
45.huggingface_01_img_object.py
45.huggingface_02_img_object.py
45.huggingface_03_img_object.py
46_huggingface_lmstudio_01.py
46_lmstudio_20250515_01.py
46_lmstudio_20250515_02.py
47_finetunning_20250515_01_generate_and_finetune.py
47_finetunning_20250519_01_test_pipeline.py
48_finetunning_20250519_lora_01.py_실행하진말것
49.lora_image_20250520.ipynb
```

## transformers pipeline

Hugging Face에서 가장 쉽게 시작하는 방법은 `pipeline`입니다.

```python
from transformers import pipeline

classifier = pipeline("sentiment-analysis", device=-1)
result = classifier("I love Hugging Face!")

print(result)
```

`pipeline`은 모델 로딩, 전처리, 추론, 후처리를 한 번에 처리해 줍니다.

| pipeline 작업 | 의미 |
| --- | --- |
| sentiment-analysis | 감성 분석 |
| translation_en_to_fr | 영어를 프랑스어로 번역 |
| image-to-text | 이미지 설명 생성 |
| automatic-speech-recognition | 음성을 텍스트로 변환 |
| image-classification | 이미지 분류 |
| text-generation | 텍스트 생성 |

## CPU와 GPU

강의 코드에는 `device=-1`이 등장합니다.

```python
pipeline("sentiment-analysis", device=-1)
```

`device=-1`은 CPU를 사용하겠다는 뜻입니다.
GPU가 있는 환경에서는 GPU를 사용하도록 설정할 수 있습니다.

비전공자 기준으로는 다음처럼 이해하면 됩니다.

| 장치 | 특징 |
| --- | --- |
| CPU | 대부분의 컴퓨터에 있음, 느리지만 기본 실행 가능 |
| GPU | AI 연산에 유리함, 큰 모델 실행에 필요할 수 있음 |

큰 이미지 생성 모델이나 음성 인식 모델은 CPU에서 매우 느릴 수 있습니다.

## 이미지 설명 생성

`44.huggingface_02_multi_modal.py`에는 이미지 설명 생성 예제가 있습니다.

```python
from transformers import pipeline
from PIL import Image

image_to_text = pipeline(
    "image-to-text",
    model="Salesforce/blip-image-captioning-base",
)

image = Image.open("image/dog.jpg")
result = image_to_text(image)

print(result)
```

이미지를 넣으면 모델이 "개가 잔디밭에 앉아 있다" 같은 설명을 생성합니다.

## 음성 인식

음성을 텍스트로 바꾸는 작업은 ASR이라고 부릅니다.
ASR은 Automatic Speech Recognition의 약자입니다.

```python
from transformers import pipeline

pipe = pipeline(
    "automatic-speech-recognition",
    model="openai/whisper-small",
)

result = pipe("audio/sample.mp3", return_timestamps=True)
print(result)
```

mp3 파일을 처리하려면 FFmpeg가 필요할 수 있습니다.
강의 폴더에도 `FFmpeg` 경로 설정 코드가 들어 있습니다.

```python
import os

os.environ["FFMPEG_BINARY"] = r"FFmpeg\ffmpeg-build\bin\ffmpeg.exe"
```

환경 변수 설정이 잘못되면 오디오 파일을 읽지 못하는 오류가 날 수 있습니다.

## 이미지 분류와 객체 탐지

이미지 분류는 이미지 전체가 무엇인지 판단합니다.

```python
pipe = pipeline(
    "image-classification",
    model="google/vit-base-patch16-224",
)

result = pipe("image/dog.jpg")
print(result)
```

객체 탐지는 이미지 안의 여러 물체 위치까지 찾는 작업입니다.
강의 폴더에는 `yolo_webcam.py`, `yolov8n.pt` 같은 YOLO 관련 파일도 있습니다.

```text
이미지 분류: 이 사진은 강아지입니다.
객체 탐지: 사진의 왼쪽 아래에 강아지가 있고, 오른쪽 위에 공이 있습니다.
```

## Stable Diffusion 이미지 생성

Hugging Face 생태계에서는 `diffusers` 라이브러리로 이미지 생성 모델을 사용할 수 있습니다.

```python
from diffusers import StableDiffusionPipeline

pipe = StableDiffusionPipeline.from_pretrained(
    "CompVis/stable-diffusion-v1-4"
)

prompt = "A high tech solarpunk utopia in the Amazon rainforest"
image = pipe(prompt).images[0]
image.save("solarpunk.png")
```

이미지 생성 모델은 용량이 크고 연산량도 많습니다.
GPU가 없는 환경에서는 실행이 오래 걸리거나 메모리 부족이 날 수 있습니다.

## LM Studio와 로컬 LLM

LM Studio는 로컬 컴퓨터에서 LLM을 실행하고 API처럼 사용할 수 있게 해 주는 도구입니다.

로컬 모델을 쓰는 이유는 다음과 같습니다.

- 외부 API 비용을 줄이고 싶을 때
- 민감한 데이터를 외부로 보내기 어려울 때
- 오프라인 실험이 필요할 때
- 여러 모델을 비교하고 싶을 때

다만 로컬 모델은 하드웨어 영향을 크게 받습니다.
큰 모델일수록 RAM, VRAM, 저장 공간이 많이 필요합니다.

## 파인튜닝이란?

파인튜닝은 기존 모델을 특정 목적에 맞게 추가 학습시키는 작업입니다.

예를 들어 기본 모델은 톰 소여 이야기에 대해 일반적인 답변을 할 수 있습니다.
하지만 특정 문체나 특정 질문 형식을 잘 따르게 만들고 싶다면 학습 데이터를 만들어 파인튜닝할 수 있습니다.

강의 코드에서는 질문과 답변을 JSONL 형식으로 저장합니다.

```python
import json

data = {
    "messages": [
        {"role": "system", "content": "당신은 유용한 AI 어시스턴트입니다."},
        {"role": "user", "content": "Tom은 왜 학교에 가기 싫어했어?"},
        {"role": "assistant", "content": "Tom은 자유롭게 놀고 싶어 학교에 가기 싫어했습니다."},
    ]
}

with open("tom_sawyer.jsonl", "w", encoding="utf-8") as f:
    f.write(json.dumps(data, ensure_ascii=False) + "\n")
```

JSONL은 한 줄에 JSON 객체 하나씩 들어가는 파일 형식입니다.

## RAG와 파인튜닝의 차이

RAG와 파인튜닝은 자주 혼동됩니다.

| 구분 | RAG | 파인튜닝 |
| --- | --- | --- |
| 목적 | 외부 문서를 검색해 답변 근거로 사용 | 모델의 응답 패턴이나 특정 지식을 추가 학습 |
| 데이터 반영 | 문서 교체가 쉬움 | 학습 작업이 필요 |
| 비용 | 주로 검색과 추론 비용 | 학습 비용과 추론 비용 |
| 적합한 경우 | 문서가 자주 바뀜 | 말투, 형식, 분류 기준을 고정하고 싶음 |

대부분의 문서 기반 챗봇은 먼저 RAG로 시작하는 편이 좋습니다.
파인튜닝은 데이터 품질과 목적이 명확할 때 사용하는 것이 좋습니다.

## LoRA란?

LoRA는 큰 모델 전체를 다시 학습하지 않고, 일부 작은 가중치만 학습하는 방식입니다.
전체 파인튜닝보다 자원이 적게 들 수 있어 이미지 모델이나 LLM 실험에서 자주 사용됩니다.

다만 LoRA도 쉬운 작업은 아닙니다.

- 데이터셋 품질이 중요합니다.
- GPU 메모리가 필요할 수 있습니다.
- 학습률, 배치 크기 같은 설정이 결과에 영향을 줍니다.
- 저작권과 개인정보 데이터 사용에 주의해야 합니다.

## 정리

Hugging Face는 다양한 AI 모델을 실험하기 좋은 생태계입니다.

- `pipeline`으로 감성 분석, 번역, 음성 인식, 이미지 분류를 쉽게 시작할 수 있습니다.
- 큰 모델은 GPU와 메모리 요구량을 확인해야 합니다.
- LM Studio를 사용하면 로컬 LLM을 실험할 수 있습니다.
- RAG는 문서를 검색해 답변하는 방식입니다.
- 파인튜닝은 모델의 응답 방식을 추가 학습시키는 방식입니다.
- LoRA는 더 가벼운 파인튜닝 방식입니다.

다음 글에서는 유튜브 요약, 이메일 발송, OCR, PDF/Excel 요약 같은 AI 자동화 예제를 정리합니다.
