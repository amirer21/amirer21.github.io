---
title: (Vision) GPT-4o Vision API로 명함 이미지에서 문자 추출하기 (로컬 파일 OCR 자동화)
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
description: 인공지능 - GPT-4o Vision API로 명함 이미지에서 문자 추출하기 (로컬 파일 OCR 자동화)
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, Multimodal
last_modified_at: '2025-04-10 21:00:00 +0800'
---


# GPT-4o Vision API로 명함 이미지에서 문자 추출하기 (로컬 파일 OCR 자동화)

## 1. 소개

이 글에서는 **로컬 명함 이미지 파일**을
**GPT-4o-mini Vision API**에 Data URL(base64) 방식으로 전달해
이미지 안의 \*\*문자를 AI가 자동으로 추출(OCR)\*\*하는 실전 코드를 소개합니다.

* ✅ 별도 OCR 라이브러리 없이 OpenAI만으로 OCR 가능
* ✅ 명함, 영수증, 문서 등 다양한 이미지에 활용
* ✅ 한글, 영어 모두 자동 지원

---

## 2. 전체 코드 구조

```python
import os
import requests
import warnings
import base64
from openai import OpenAI
import openai
from dotenv import load_dotenv
from playsound import playsound
import sounddevice as sd
from scipy.io.wavfile import write

# 경고 무시
warnings.filterwarnings("ignore", category=UserWarning)

# .env에서 API 키 로드
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key
client = OpenAI()

def encode_image(image_path):
    with open(image_path, "rb") as f:
        return base64.b64encode(f.read()).decode("utf-8")

image_base64 = encode_image("image/namecard.jpg")  # 명함 이미지 경로
data_url = f"data:image/jpeg;base64,{image_base64}"

response = client.chat.completions.create(
    model="gpt-4o-mini",  # Vision 기능은 현재 mini에서 더 안정적
    messages=[{
        "role": "user",
        "content": [
            {"type": "text", "text": "이 이미지에서 글자를 추출해줘."},
            {"type": "image_url", "image_url": {"url": data_url}},
        ],
    }]
)
print(response.choices[0].message.content)
```

---

## 3. 주요 동작 설명

* **encode\_image()**: 로컬 이미지 파일을 **base64 문자열**로 변환
* **Data URL** 포맷(`data:image/jpeg;base64,...`)으로 Vision API에 전송

  * 별도의 서버 업로드 없이 내 PC 파일도 AI 분석 가능
* `"이 이미지에서 글자를 추출해줘."`라는 프롬프트와 함께

  * \*\*명함 속 문자(이름, 이메일, 회사명 등)\*\*를 AI가 자동 추출

---

## 4. 실전 활용 팁

* **png/jpg 등 파일 타입에 맞게 Data URL MIME 타입 수정**
* `"이 이미지를 요약해줘."`, `"이메일 주소만 뽑아줘."` 등 다양한 프롬프트 응용 가능
* 여러 이미지 OCR, 표 변환, JSON 파싱 등 추가 자동화로 확장 가능

---

## 5. 마치며

OpenAI GPT-4o Vision은

* 별도의 복잡한 OCR 세팅 없이

* **파이썬에서 단 몇 줄로 명함 문자 추출 자동화**가 가능합니다!

* 다양한 문서, 사진, 증명서, 스캔본에도 바로 적용할 수 있으니
  AI 문서 자동화가 필요한 분께 강력 추천합니다.

---

### 참고

* [OpenAI Vision 공식 문서](https://platform.openai.com/docs/guides/vision)
* [Python base64 인코딩 공식 문서](https://docs.python.org/3/library/base64.html)

---