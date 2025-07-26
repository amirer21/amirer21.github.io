---
title: (DALL·E) OpenAI DALL·E 3로 원하는 이미지를 자동 생성하는 파이썬 코드 실습
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
description: 인공지능 - OpenAI DALL·E 3로 원하는 이미지를 자동 생성하는 파이썬 코드 실습
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, Multimodal
last_modified_at: '2025-04-10 21:00:00 +0800'
---

# OpenAI DALL·E 3로 원하는 이미지를 자동 생성하는 파이썬 코드 실습

## 1. 소개

이번 글에서는 **OpenAI의 DALL·E 3 API**를 파이썬에서 직접 호출하여
내가 원하는 \*\*프롬프트(텍스트 설명)\*\*만 입력하면 AI가 이미지를 생성하고,
자동으로 내 PC에 저장하는 코드를 다뤄봅니다.

* ✅ **실습 예시**: `"a white siamese cat"` 프롬프트로 고양이 이미지를 생성해봄
* ✅ 환경 변수로 API 키 관리
* ✅ 이미지 생성, 다운로드, 저장까지 전 과정 자동화

---

## 2. 코드 전체 구조

### 2.1 환경 준비 및 API 키 설정

```python
import os
import requests
from openai import OpenAI
import openai
import warnings
warnings.filterwarnings("ignore", category=UserWarning)
from dotenv import load_dotenv  # .env 파일에서 환경 변수 읽기

# .env 파일에서 OPENAI_API_KEY 가져오기
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key

# OpenAI 클라이언트 객체 생성
client = OpenAI()
```

* **dotenv** 패키지로 `.env` 파일에서 `OPENAI_API_KEY`를 읽어옴
* **보안상 API 키를 코드에 직접 쓰지 않고, 환경 변수로 관리**
* `OpenAI()` 객체 생성(최신 openai 패키지 기준)

---

### 2.2 이미지 생성 함수

```python
def generate_image(prompt, output_path='genimage.jpg', size='1024x1024', quality='standard'):
    """DALL·E 3로 이미지 생성 및 저장"""
    print(f"🖼️ '{prompt}' 프롬프트로 이미지 생성 중...")
    response = client.images.generate(
        model='dall-e-3',
        prompt=prompt,
        size=size,
        quality=quality,
        n=1
    )

    # 이미지 URL 추출 및 다운로드
    image_url = response.data[0].url
    print(f"✅ 이미지 URL:\n{image_url}")

    image_data = requests.get(image_url).content
    with open(output_path, 'wb') as fp:
        fp.write(image_data)
    print(f"📁 이미지가 '{output_path}'에 저장되었습니다.")
```

* **프롬프트**만 입력하면 DALL·E 3가 이미지를 생성해줌
* **생성 결과는 URL 형태**로 오며, 직접 다운로드하여 파일로 저장

---

### 2.3 메인 실행부

```python
if __name__ == "__main__":
    prompt = "a white siamese cat"   # 원하는 이미지 설명
    output_file = "genimage.jpg"     # 저장 파일명

    generate_image(prompt, output_file)
```

* 코드 실행 시 `"a white siamese cat"` 프롬프트로 이미지를 만들어
  `genimage.jpg`로 저장
* **다른 프롬프트, 파일명, 이미지 크기도 자유롭게 변경 가능**

---

## 3. 사용법 및 실습 팁

1. **OpenAI API 키 발급**

   * [OpenAI 홈페이지](https://platform.openai.com/api-keys)에서 발급
   * `.env` 파일에 아래처럼 저장

     ```
     OPENAI_API_KEY=sk-xxxxxx...
     ```

2. **필요 패키지 설치**

   ```
   pip install openai requests python-dotenv
   ```

3. **프롬프트만 바꿔서 다양한 이미지 생성**

   * `"A futuristic city skyline at sunset"`
   * `"A cartoon dog riding a skateboard"`
   * 자신만의 프롬프트로 무한한 이미지를 생성 가능

---

## 4. 마치며

이 코드를 활용하면 **복잡한 UI/웹 없이도, 프롬프트 한 줄로 AI가 이미지를 생성하고 자동 저장**까지 할 수 있습니다.

* 블로그 썸네일, 발표 자료, 아이디어 스케치 등
  빠르게 이미지가 필요할 때 적극 추천하는 방법입니다!

---

### 참고 링크

* [OpenAI DALL·E 3 API 공식 문서](https://platform.openai.com/docs/guides/images)
* [python-dotenv 공식](https://pypi.org/project/python-dotenv/)
