---
title: (DALL·E) DALL·E 2 이미지 편집 - 마스크(mask)로 원하는 부분만 AI로 수정하기
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- Multimodal
- LLM
- ChatGPT
tags:
- AI
- Multimodal
- LLM
- ChatGPT
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - DALL·E 2 이미지 편집 - 마스크(mask)로 원하는 부분만 AI로 수정하기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, Multimodal
last_modified_at: '2025-04-10 21:00:00 +0800'
---


# DALL·E 2 이미지 편집: 마스크(mask)로 원하는 부분만 AI로 수정하기

## 1. 소개

이번 글에서는 **OpenAI DALL·E 2 API**의 이미지 편집 기능을 활용하여,
원본 이미지에서 **특정 부분만 AI로 자연스럽게 다시 그려주는 자동화 방법**을 다룹니다.

핵심은 \*\*“마스크 이미지”\*\*를 만들어,

* **원본의 일부 영역만 비우고**
* **비운(투명한) 영역만 AI가 새로 생성**하도록 명령하는 것!

---

## 2. 전체 코드 구조

```python
import os
import requests
import warnings
from openai import OpenAI
import openai
from dotenv import load_dotenv

warnings.filterwarnings("ignore", category=UserWarning)
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key
client = OpenAI()

# 1) 편집할 원본 이미지와 마스크 이미지 지정
image_path = 'image/sunlit.png'
mask_path = 'image/mask3.png'

prompt = 'A sunlit indoor lounge area with a pool containing a fish'

# 2) DALL·E 2 편집 API 호출
response = client.images.edit(
    model='dall-e-2',
    image=open(image_path, 'rb'),
    mask=open(mask_path, 'rb'),
    prompt=prompt,
    n=2,
    size='1024x1024',
)

# 3) 생성 결과 다운로드 및 저장
for idx, image_data in enumerate(response.data):
    image_url = image_data.url
    print(f"✅ 생성된 이미지 URL {idx + 1}: {image_url}")
    image_bytes = requests.get(image_url).content
    output_file = f'edit_image_{idx + 1}.png'
    with open(output_file, 'wb') as f:
        f.write(image_bytes)
    print(f"📁 이미지 저장 완료: {output_file}")
```

* **원본 이미지**와 **마스크 이미지**를 지정해 편집 요청
* 프롬프트(예: `"실내 수영장에 물고기가 있는 햇살 가득한 라운지"`)를 입력
* 결과 이미지는 파일로 자동 저장

---

## 3. 마스크(mask)란 무엇인가?

### 🧠 마스크의 개념

* **마스크 이미지**는 `RGBA(투명도)` 채널을 가진 PNG 파일입니다.
* **편집하고 싶은 영역을 투명하게**(알파 0),
  **그대로 둘 영역은 불투명하게**(알파 255) 만듭니다.

### ⚙️ 동작 메커니즘

* **투명(알파=0)**: AI가 새로 그릴 부분
* **불투명(알파=255)**: 원본을 그대로 유지할 부분
* 즉, 마스크에서 **“비워진 영역만”** DALL·E가 프롬프트에 따라 자연스럽게 생성

### 💡 예시

* 소파 부분만 투명하게 만든 마스크 → 소파 부분만 새로 그림
* 인물 얼굴, 풍경 일부 등 원하는 영역만 선택적으로 AI로 리터치 가능

---

## 4. 마스크 이미지는 어떻게 만들까?

1. **포토샵, GIMP, Figma 등** 툴에서

   * 원하는 부분을 지우거나 투명하게 만든 뒤
   * **반드시 PNG(알파 채널 포함)로 저장**
2. **Python 코드로도 자동 마스킹** 가능

   * OpenCV, Pillow 등 활용 (예시 코드 요청시 제공 가능)

---

## 5. 마치며

* 이 방식으로 “부분 리터치”, “합성”, “배경/오브젝트 교체” 등
  자유자재로 이미지를 AI가 다시 만들어줍니다!
* 인공지능 디자인 워크플로우, 포트폴리오 제작, 아이디어 스케치 등에 적극 추천

---

### 참고

* [OpenAI DALL·E 공식 문서](https://platform.openai.com/docs/guides/images/usage)
* 마스킹 자동화/생성 스크립트가 필요하다면 댓글로 요청해 주세요!

---
