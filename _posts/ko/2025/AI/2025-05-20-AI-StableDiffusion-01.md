---
title: 인공지능 - Stable Diffusion + LoRA 실습: 연필 스케치 스타일 이미지 생성
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- OpenAI
- LLM
- StableDiffusion
- Colab
tags:
- AI
- OpenAI
- LLM
- StableDiffusion
- Colab
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - Stable Diffusion + LoRA 실습: 연필 스케치 스타일 이미지 생성
article_tag1: AI
article_tag2: StableDiffusion
article_tag3: LLM
article_section: 
meta_keywords: AI, StableDiffusion, LLM, OpenAI, Colab
last_modified_at: '2025-05-20 21:00:00 +0800'
---


## Stable Diffusion + LoRA 실습: 연필 스케치 스타일 이미지 생성

이 글에서는 **Stable Diffusion**과 **LoRA (Low-Rank Adaptation)** 기술을 활용해, 텍스트 프롬프트를 기반으로 **연필 스케치 스타일의 이미지를 생성하는 실습**을 진행합니다.
Python 코드 실행은 **Google Colab** 환경에서 이루어지며, 사전 학습된 Stable Diffusion 모델에 LoRA 가중치를 적용하는 과정을 통해 **스타일 전환 기반 이미지 생성**의 원리를 체험할 수 있습니다.

---

## 1. 실습 목표

* Stable Diffusion 모델을 Colab에서 실행하고 이미지 생성해보기
* LoRA 가중치 파일(`.safetensors`)을 활용해 모델 스타일을 변화시키기
* 텍스트 프롬프트로부터 이미지 생성 및 저장까지의 전체 워크플로우 익히기

---

## 2. 이 실습으로 알 수 있는 것

* Hugging Face 기반 모델 불러오기 및 커스터마이징 방법
* OpenAI API 키와 Hugging Face 키를 안전하게 관리하는 방법
* Google Colab에서 GPU 런타임 설정 및 가중치 업로드 과정
* LoRA 기법으로 이미지 스타일을 바꾸는 실습 경험

---

## 3. Colab 시작 및 준비 작업

### 런타임 설정 변경 (GPU 사용)

1. 상단 메뉴에서 `런타임 > 런타임 유형 변경` 선택
2. 하드웨어 가속기를 `GPU`로 설정한 뒤 저장

### 필수 라이브러리 설치

```python
!pip install --upgrade diffusers transformers accelerate safetensors
!pip install python-dotenv openai
```

LoRA 실행 시 `jax` 오류가 발생할 수 있으므로 다음도 함께 실행합니다:

```python
!pip uninstall -y jax jaxlib
!pip install --upgrade jax jaxlib
```

---

## 4. API 키 환경 설정 (.env 파일 사용)

`.env` 파일을 통해 OpenAI API 키를 안전하게 불러올 수 있습니다.

### .env 파일 업로드

```python
from google.colab import files
uploaded = files.upload()  # openapi_key.env, huggingface_key.env 업로드
```

### 환경변수 로드 및 확인

```python
import os
import warnings
from dotenv import load_dotenv
from openai import OpenAI

warnings.simplefilter("ignore")
load_dotenv("/content/openapi_key.env")
load_dotenv("/content/huggingface_key.env")

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

print("✅ API 키 불러오기 완료:", api_key[:5] + "..." if api_key else "❌ 키 없음")
```

---

## 5. LoRA 모델 파일 업로드 및 설정

### `.safetensors` 파일 업로드

```python
from google.colab import files
uploaded = files.upload()  # Pencil_Sketch.safetensors 선택
```

### 파일 이동 및 디렉토리 구성

```bash
!mkdir -p lora_file
!mv Pencil_Sketch.safetensors lora_file/
```

---

## 6. Stable Diffusion 모델 불러오기 및 이미지 생성

```python
from diffusers import StableDiffusionPipeline
import torch
from PIL import Image

assert torch.cuda.is_available(), "CUDA 사용 불가. 런타임 > GPU로 설정했는지 확인"

pipe = StableDiffusionPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    torch_dtype=torch.float16,
    safety_checker=None
).to("cuda")

pipe.load_lora_weights("lora_file/Pencil_Sketch.safetensors")
pipe.fuse_lora()

prompt = "a portrait of a young girl, pencil sketch style, monochrome, highly detailed"

image = pipe(prompt, num_inference_steps=30, guidance_scale=7.5).images[0]
image.save("output_sketch_pencil.png")
image.show()
```

---

## 7. 마무리 및 활용 팁

이 실습을 통해 우리는 **기존 Stable Diffusion 모델에 LoRA 스타일을 적용**해 보는 경험을 했습니다.
이제 여러분은 원하는 스타일의 LoRA 가중치를 사용해 다양한 결과물을 생성할 수 있습니다.

### 추가 아이디어

* 다른 LoRA 가중치 파일을 적용해 다양한 그림 스타일 실험
* 사용자 입력 프롬프트를 받아서 자동 생성 앱 만들기
* 생성된 이미지를 HTML이나 PDF로 자동 저장하는 파이프라인 구성

---

## 8. 참고자료

* [Hugging Face Diffusers 문서](https://huggingface.co/docs/diffusers/index)
* [LoRA란 무엇인가 (Low-Rank Adaptation)](https://arxiv.org/abs/2106.09685)
* [Stable Diffusion 모델 목록](https://huggingface.co/models?library=diffusers&sort=downloads)
