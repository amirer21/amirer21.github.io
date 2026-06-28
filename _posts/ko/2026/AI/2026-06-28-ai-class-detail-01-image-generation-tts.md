---
title: "AI 세부 실습 01 - 이미지 생성과 TTS"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- OpenAI
tags:
- AI
- OpenAI
- Image Generation
- TTS
toc: true
toc_sticky: true
toc_label: 목차
description: "09번 실습 파일을 기준으로 이미지 생성과 텍스트 음성 변환을 정리합니다."
article_tag1: AI
article_tag2: Image
article_tag3: TTS
article_section: AI
meta_keywords: AI, 이미지 생성, TTS, OpenAI
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# 이미지 생성과 TTS

이 글은 다음 원본 실습 파일을 기준으로 정리합니다.

```text
09_multi_modal_image.py
09_multi_modal_tts.py
```

09번 실습의 핵심은 텍스트를 다른 형태의 결과물로 바꾸는 것입니다.

```text
텍스트 프롬프트 -> 이미지
텍스트 문장 -> 음성 파일
```

## 이미지 생성 흐름

이미지 생성은 사용자가 작성한 문장을 바탕으로 AI가 이미지를 만드는 작업입니다.

```python
from openai import OpenAI

client = OpenAI()

response = client.images.generate(
    model="dall-e-3",
    prompt="a white siamese cat",
    size="1024x1024",
    quality="standard",
    n=1,
)
```

여기서 가장 중요한 값은 `prompt`입니다.
프롬프트는 AI에게 어떤 이미지를 만들지 설명하는 문장입니다.

## 이미지 저장

이미지 생성 API는 보통 이미지 URL을 돌려줍니다.
이미지를 내 컴퓨터에 저장하려면 URL에서 파일을 다운로드해야 합니다.

```python
import requests

image_url = response.data[0].url
image_data = requests.get(image_url).content

with open("genimage.jpg", "wb") as fp:
    fp.write(image_data)
```

`wb`는 바이너리 쓰기 모드입니다.
이미지는 텍스트가 아니라 바이너리 데이터이기 때문에 `w`가 아니라 `wb`를 사용합니다.

## 좋은 이미지 프롬프트

짧은 프롬프트도 동작하지만 결과를 예측하기 어렵습니다.

```text
고양이
```

다음처럼 구체적으로 쓰는 편이 좋습니다.

```text
햇빛이 들어오는 창가에 앉아 있는 흰색 샴고양이, 사실적인 사진 스타일, 따뜻한 분위기
```

프롬프트에는 대상, 장소, 분위기, 스타일, 구도를 넣으면 좋습니다.

## TTS란?

TTS는 Text To Speech의 약자입니다.
텍스트를 음성으로 변환하는 기술입니다.

```python
from openai import OpenAI

client = OpenAI()

response = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input="안녕하세요. 오늘은 AI 음성 생성을 실습합니다.",
)

response.stream_to_file("out.mp3")
```

이 코드는 문장을 읽어 주는 음성 파일을 생성합니다.

## 활용 예시

이미지 생성과 TTS는 다음과 같은 서비스로 확장할 수 있습니다.

- 블로그 썸네일 자동 생성
- 상품 소개 이미지 생성
- 안내 방송 음성 생성
- 교육 콘텐츠 내레이션 생성
- 영상 자막을 음성으로 변환

## 실습 체크리스트

실행 전에 다음을 확인합니다.

```text
openapi_key.env 파일이 있는가?
OPENAI_API_KEY 값이 들어 있는가?
openai, requests, python-dotenv 패키지를 설치했는가?
결과 파일을 저장할 권한이 있는가?
```

## 정리

09번 실습은 멀티모달 AI의 가장 쉬운 입문 예제입니다.
텍스트가 이미지와 음성으로 바뀌는 과정을 직접 확인할 수 있어 API 호출 구조를 이해하기 좋습니다.
