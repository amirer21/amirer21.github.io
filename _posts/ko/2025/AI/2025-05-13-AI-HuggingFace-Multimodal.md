---
title: (Hugging Face) Hugging Face 멀티모달 파이프라인 실습 예제 정리
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
- HuggingFace
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - Hugging Face 멀티모달 파이프라인 실습 예제 정리
article_tag1: AI
article_tag2: HuggingFace
article_tag3: LLM
article_section: 
meta_keywords: AI, HuggingFace, LLM, LangChain
last_modified_at: '2025-05-13 21:00:00 +0800'
---


## Hugging Face 멀티모달 파이프라인 실습 예제 정리

AI와 딥러닝 프레임워크들이 점점 더 다양한 입력을 이해하고 처리하는 방향으로 발전하고 있습니다. 이번 글에서는 Hugging Face의 `transformers`, `diffusers`, 그리고 LangChain을 활용하여 다음과 같은 입력을 처리하는 전체 실습 예제를 소개합니다:

* 텍스트 감정 분석
* 번역
* 이미지 캡셔닝
* 음성 인식
* 이미지 분류
* 얼굴 감정 분류
* 텍스트 기반 이미지 생성

---

## 1. 환경 설정

```python
os.environ["USER_AGENT"] = "Mozilla/5.0 ..."
load_dotenv(dotenv_path='openapi_key.env')
load_dotenv(dotenv_path='huggingface_key.env')
```

* Hugging Face의 인증 토큰을 불러오기 위해 `.env` 파일을 사용합니다.
* ffmpeg 환경도 미리 지정하여 오디오 처리를 위한 준비를 완료합니다.

---

## 2. 감정 분석 (Sentiment Analysis)

```python
classifier = pipeline("sentiment-analysis", device=-1)
# print(classifier("I love Hugging Face!"))
```

* 간단한 문장을 넣으면 긍정/부정을 판단해주는 모델입니다.
* 현재 예제에서는 주석 처리되어 있지만, CPU 환경에서도 충분히 작동합니다.

---

## 3. 번역 파이프라인 (Translation)

```python
translator = pipeline("translation_en_to_fr", device=-1)
result = translator("Hello, how are you?")
print(result)
```

* 영어 → 프랑스어 번역을 수행합니다.
* PyTorch가 설치되어 있다면 손쉽게 실행 가능합니다.

---

## 4. 이미지 캡셔닝 (Image Captioning)

```python
image_to_text = pipeline('image-to-text', model='Salesforce/blip-image-captioning-base')
image = Image.open('image/dog.jpg')
```

* 이미지를 입력하면 사람이 설명하듯 자연어로 설명을 생성합니다.
* `BLIP` 모델을 사용해 간단한 이미지에 대한 문장을 만들어냅니다.

---

## 5. 음성 인식 (Speech Recognition)

```python
pipe = pipeline("automatic-speech-recognition", model="openai/whisper-small")
result = pipe(audio_file, return_timestamps=True)
```

* OpenAI의 Whisper 모델로 mp3 파일의 내용을 텍스트로 변환합니다.
* ffmpeg이 설치되어 있어야 `.mp3` 파일을 로딩할 수 있습니다.

---

## 6. 이미지 분류 (Image Classification)

```python
pipe = pipeline("image-classification", model="google/vit-base-patch16-224")
result = pipe('image/dog.jpg')
```

* 이미지에 무엇이 있는지 분류해주는 비전 트랜스포머 기반 모델입니다.
* 예: 개, 고양이, 컵 등 일상 사물을 잘 분류합니다.

---

## 7. 얼굴 감정 분류 (Face Emotion Classification)

```python
pipe = pipeline("image-classification", model="RickyIG/emotion_face_image_classification_v3")
rst = pipe('image/d.jpg')
```

* 얼굴 표정을 인식해 감정 상태(행복, 슬픔 등)를 분류합니다.
* 감정 기반 UI/UX 개발 시 활용할 수 있습니다.

---

## 8. 텍스트 기반 이미지 생성 (Text-to-Image)

```python
pipe = StableDiffusionPipeline.from_pretrained("CompVis/stable-diffusion-v1-4")
image = pipe("cute cat").images[0]
```

* 자연어로 묘사한 내용을 기반으로 이미지를 생성합니다.
* 생성된 이미지는 `.save()`로 저장 가능하며, 웹 UI에서도 활용할 수 있습니다.

---

## 9. 정리 및 활용 팁

이 예제 하나로 Hugging Face의 거의 모든 주요 입력 타입(text, image, audio)에 대한 파이프라인을 한 번에 실습할 수 있습니다. 특히 다음과 같은 상황에 매우 유용합니다:

* 자연어 처리뿐만 아니라 이미지, 음성까지 연계된 멀티모달 서비스 기획
* AI 도입을 고민 중인 기획자/개발자 POC
* LLM(대형언어모델) 기반 응용서비스 구성

---

## 10. 참고 사항

* PyTorch 또는 TensorFlow 둘 중 하나는 반드시 설치되어야 합니다.
* `ffmpeg` 설치 및 환경변수 등록은 Whisper 모델 사용 시 필수입니다.
* `pip install torch transformers diffusers huggingface_hub` 등 주요 패키지를 미리 설치해 두는 것이 좋습니다.
