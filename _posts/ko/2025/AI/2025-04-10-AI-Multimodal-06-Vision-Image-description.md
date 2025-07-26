---
title: (Vision) GPT-4o Vision - 파이썬과 GPT-4o로 로컬 이미지 완벽 분석하기
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
description: 인공지능 - GPT-4o Vision - 파이썬과 GPT-4o로 로컬 이미지 완벽 분석하기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, Multimodal
last_modified_at: '2025-04-10 21:00:00 +0800'
---


최근 OpenAI가 발표한 **GPT-4o**는 텍스트뿐만 아니라 이미지와 음성까지 실시간으로 이해하는 멀티모달 AI입니다.  
이제 "AI가 내 컴퓨터에 저장된 이미지를 보고 설명해준다면?"이라는 상상이 현실이 되었습니다.

이 글에서는 **GPT-4o와 파이썬**을 이용해 **로컬 이미지 파일을 AI에게 보여주고 설명을 받아오는 방법**을 단계별로 소개합니다.  
간단한 코드 몇 줄로 나만의 이미지 분석기를 만들 수 있습니다.

---

## 만들 결과물 미리보기

사용자가 선택한 **로컬 이미지 파일을 OpenAI API로 전송**하고,  
**GPT-4o가 분석한 내용을 텍스트로 출력**하는 프로그램을 만들게 됩니다.

---

## 준비물

### ✅ 사전 준비 사항

- **Python 3.6+** 설치
- **OpenAI API 키 발급**  
  👉 [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)

- **필요 라이브러리 설치**

```bash
pip install openai python-dotenv
````

---

## 프로젝트 구조

```
/my_project
├── image_analyzer.py       # 메인 파이썬 스크립트
├── openapi_key.env         # API 키를 저장하는 파일
└── /image
    └── d.jpg               # 분석할 이미지
```

---

## 1단계: API 키 안전하게 관리하기

`.env` 파일을 만들어 OpenAI API 키를 안전하게 저장합니다.

**📄 openapi\_key.env**

```env
OPENAI_API_KEY="여기에_발급받은_API_키를_붙여넣으세요"
```

파이썬 코드에서는 이 파일을 로드하여 키를 사용합니다.

---

## 2단계: 라이브러리 불러오기 및 클라이언트 설정

**🐍 image\_analyzer.py (초기화 코드)**

```python
import os
import base64
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(dotenv_path='openapi_key.env')  # API 키 로드
client = OpenAI()  # OpenAI 클라이언트 생성
```

---

## 3단계: 이미지 Base64 인코딩 함수 작성

OpenAI API는 이미지를 **Base64로 인코딩된 문자열**로 받아야 합니다.

```python
def encode_image(image_path):
    """이미지를 Base64 문자열로 인코딩합니다."""
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")
```

---

## 4단계: 이미지 분석 요청 보내기

GPT-4o에게 이미지를 전송하고 "이 이미지에 대해 설명해줘"라는 프롬프트를 함께 전달합니다.

```python
def analyze_image(image_path, prompt="이 이미지에 대해 상세하고 친절하게 설명해줘."):
    print(f"분석 시작: '{image_path}'")

    try:
        base64_image = encode_image(image_path)
    except FileNotFoundError:
        return f"오류: 이미지 파일을 찾을 수 없습니다. 경로 확인: {image_path}"

    data_url = f"data:image/jpeg;base64,{base64_image}"

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": data_url}},
            ],
        }],
        max_tokens=500
    )

    return response.choices[0].message.content
```

---

## 전체 코드

**🐍 image\_analyzer.py**

```python
import os
import base64
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv(dotenv_path='openapi_key.env')
client = OpenAI()

def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")

def analyze_image(image_path, prompt="이 이미지에 대해 상세하고 친절하게 설명해줘."):
    print(f"분석 시작: '{image_path}'")

    try:
        base64_image = encode_image(image_path)
    except FileNotFoundError:
        return f"오류: 이미지 파일을 찾을 수 없습니다. 경로 확인: {image_path}"

    data_url = f"data:image/jpeg;base64,{base64_image}"

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": prompt},
                {"type": "image_url", "image_url": {"url": data_url}},
            ],
        }],
        max_tokens=500
    )

    return response.choices[0].message.content

if __name__ == "__main__":
    target_image = "image/d.jpg"
    description = analyze_image(target_image)
    print("\n--- GPT-4o의 이미지 분석 결과 ---")
    print(description)
```

💡 **TIP**: `messages`의 `content`는 텍스트 + 이미지 URL을 함께 보내는 멀티모달 포맷입니다.

---

## 마무리하며

이제 여러분은 로컬 이미지 파일을 **GPT-4o로 분석하는 프로그램**을 만들 수 있습니다.
AI가 이미지의 맥락을 이해하고 설명해주는 새로운 가능성을 체험해보세요!

---

## 확장 아이디어

* **💻 웹 애플리케이션으로 확장**
  Streamlit이나 Flask로 이미지 업로드 및 결과 확인 UI 만들기

* **🤔 다양한 프롬프트 실험**
  "이 음식의 레시피는?", "이 인물은 행복해 보여?", "글자 모두 추출해줘" 등

* **🎞️ 동영상 프레임 분석**
  동영상을 여러 장으로 분할해 순차적으로 분석하고 요약하기

---

GPT-4o의 멀티모달 능력은 이제 시작일 뿐입니다.
여러분의 창의적인 상상력을 더해, 더 멋진 AI 애플리케이션을 만들어보세요!

---
