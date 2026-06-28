---
title: "AI 강의 정리 02 - OpenAI 멀티모달: 이미지 생성, 이미지 이해, 음성 처리"
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
- Multimodal
- Image
- Audio
toc: true
toc_sticky: true
toc_label: 목차
description: "이미지 생성, 이미지 설명, 이미지 문자 추출, 음성 녹음과 TTS를 비전공자 기준으로 정리합니다."
article_tag1: AI
article_tag2: OpenAI
article_tag3: Multimodal
article_section: AI
meta_keywords: AI, OpenAI, 멀티모달, 이미지 생성, TTS, OCR
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# 멀티모달 AI란?

멀티모달 AI는 텍스트만 다루는 AI가 아니라 이미지, 음성, 문서 같은 여러 형태의 데이터를 함께 다루는 AI를 말합니다.

사람은 글을 읽고, 그림을 보고, 말을 듣고, 사진 속 글자를 이해합니다.
멀티모달 AI도 비슷한 방향으로 발전하고 있습니다.

강의 폴더의 다음 파일들이 이 주제에 해당합니다.

```text
09_multi_modal_image.py
09_multi_modal_tts.py
10_multi_modal_edit_image.py
10_multi_modal_record.py
12_multi_modal_image_description_20250410_01.py
12_multi_modal_image_description_20250410_02.py
12_multi_modal_image_text_extract_20250410_03.py
```

## 전체 흐름

멀티모달 예제의 흐름은 다음과 같습니다.

```text
프롬프트 작성
-> AI 모델에 요청
-> 이미지, 음성, 설명 텍스트 같은 결과 받기
-> 파일로 저장하거나 화면에 표시
```

텍스트 챗봇과 다른 점은 결과물이 텍스트만이 아니라는 것입니다.

## 이미지 생성 예제

`09_multi_modal_image.py`의 핵심은 문장 프롬프트를 입력해 이미지를 생성하는 것입니다.

예를 들어 다음 문장을 AI에게 보냅니다.

```text
a white siamese cat
```

그러면 모델은 이 문장을 바탕으로 이미지를 생성하고, 코드에서는 생성된 이미지 URL을 받아 파일로 저장합니다.

기본 구조는 다음과 같습니다.

```python
import os
import requests
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv(dotenv_path="openapi_key.env")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_image(prompt, output_path="genimage.jpg"):
    response = client.images.generate(
        model="dall-e-3",
        prompt=prompt,
        size="1024x1024",
        quality="standard",
        n=1,
    )

    image_url = response.data[0].url
    image_data = requests.get(image_url).content

    with open(output_path, "wb") as fp:
        fp.write(image_data)

generate_image("a white siamese cat")
```

비전공자가 이해해야 할 부분은 세 가지입니다.

| 코드 | 의미 |
| --- | --- |
| `prompt` | AI에게 원하는 이미지를 설명하는 문장 |
| `client.images.generate()` | 이미지 생성 API 호출 |
| `requests.get()` | 생성된 이미지 URL에서 실제 이미지 파일 다운로드 |

## 좋은 이미지 프롬프트 작성법

이미지 생성은 프롬프트 품질에 영향을 많이 받습니다.

나쁜 예:

```text
고양이
```

좋은 예:

```text
햇빛이 들어오는 거실 창가에 앉아 있는 흰색 샴고양이, 따뜻한 분위기, 사실적인 사진 스타일
```

프롬프트에는 다음 요소를 넣으면 좋습니다.

| 요소 | 예시 |
| --- | --- |
| 대상 | 흰색 샴고양이 |
| 장소 | 거실 창가 |
| 분위기 | 따뜻한 햇빛 |
| 스타일 | 사실적인 사진, 수채화, 일러스트 |
| 구도 | 정면, 위에서 내려다본 장면 |

## 이미지 편집

`10_multi_modal_edit_image.py`는 기존 이미지를 바탕으로 수정하는 흐름입니다.

이미지 편집은 보통 다음 요소가 필요합니다.

```text
원본 이미지
수정할 영역 또는 마스크
수정 지시문
```

예를 들어 "배경을 도시 야경으로 바꿔줘", "옷 색상을 파란색으로 바꿔줘" 같은 식입니다.

이미지 생성은 처음부터 새로 만드는 것이고, 이미지 편집은 기존 이미지를 유지하면서 일부를 바꾸는 작업입니다.

## 이미지 설명

`12_multi_modal_image_description_20250410_01.py`와 `12_multi_modal_image_description_20250410_02.py`는 이미지를 모델에 보내고 설명을 받는 예제입니다.

활용 예시는 다음과 같습니다.

- 상품 사진 자동 설명
- 시각 자료 요약
- 영수증이나 문서 이미지 분석
- 웹 접근성을 위한 대체 텍스트 생성

흐름은 다음과 같습니다.

```text
이미지 파일 읽기
-> base64 또는 파일 입력 형태로 변환
-> 모델에 "이 이미지를 설명해줘" 요청
-> 설명 텍스트 받기
```

여기서 중요한 개념은 AI가 이미지를 직접 "보는" 것이 아니라, 코드가 이미지를 API가 이해할 수 있는 형태로 변환해서 보낸다는 점입니다.

## 이미지에서 문자 추출하기

`12_multi_modal_image_text_extract_20250410_03.py`는 이미지 안의 글자를 읽어내는 예제입니다.
이 작업은 보통 OCR이라고 부릅니다.

OCR은 Optical Character Recognition의 약자로, 이미지 속 문자를 텍스트로 바꾸는 기술입니다.

예를 들어 사진 안에 다음 글자가 있다면,

```text
회의 일정: 2025년 4월 10일 오후 7시
```

AI는 이 내용을 텍스트로 추출할 수 있습니다.

OCR은 다음 상황에서 유용합니다.

- 영수증 데이터 추출
- 계약서 스캔본 정리
- 칠판 사진을 텍스트로 변환
- 이미지 기반 자료를 검색 가능한 문서로 변환

## 음성 녹음과 TTS

`10_multi_modal_record.py`는 음성 녹음 실습과 연결됩니다.
`09_multi_modal_tts.py`는 텍스트를 음성으로 바꾸는 TTS 흐름에 해당합니다.

TTS는 Text To Speech의 약자입니다.

```text
텍스트 입력
-> 음성 생성 모델
-> mp3 또는 wav 파일 저장
```

예시는 다음과 같습니다.

```python
from openai import OpenAI

client = OpenAI()

text = "안녕하세요. 오늘은 AI 멀티모달 기능을 실습합니다."

response = client.audio.speech.create(
    model="tts-1",
    voice="alloy",
    input=text,
)

response.stream_to_file("out.mp3")
```

모델명과 음성 이름은 사용하는 SDK와 계정에서 지원하는 값으로 바꿔야 할 수 있습니다.

## 실습할 때 자주 나는 오류

### API 키가 없는 경우

```text
OPENAI_API_KEY를 찾을 수 없습니다.
```

이 경우 `openapi_key.env` 파일이 있는지, 파일 안에 `OPENAI_API_KEY=...` 형식으로 들어 있는지 확인합니다.

### 이미지 파일이 저장되지 않는 경우

이미지 URL을 받은 뒤 `requests.get()`으로 다운로드하는 과정에서 실패할 수 있습니다.
인터넷 연결, 저장 경로, 파일 권한을 확인해야 합니다.

### 모델명이 맞지 않는 경우

강의 코드는 수업 당시 모델명을 기준으로 되어 있습니다.
실습 시점에 계정에서 사용할 수 있는 모델명으로 바꿔야 할 수 있습니다.

## 정리

멀티모달 AI는 "글자만 주고받는 챗봇"에서 한 단계 더 나아갑니다.

- 텍스트로 이미지를 만들 수 있습니다.
- 이미지를 보고 설명할 수 있습니다.
- 이미지 안의 글자를 추출할 수 있습니다.
- 텍스트를 음성으로 만들 수 있습니다.

비전공자에게 가장 좋은 첫 실습은 이미지 생성입니다. 결과가 바로 눈에 보이기 때문에 API가 어떻게 동작하는지 이해하기 쉽습니다.

다음 글에서는 AI에게 함수나 도구를 사용하게 만드는 `function calling` 개념을 정리합니다.
