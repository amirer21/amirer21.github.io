---
title: 인공지능 - Hugging Face를 활용한 이미지 객체 탐지 실습
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
- HuggingFace
tags:
- AI
- LangChain
- LLM
- HuggingFace
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - Hugging Face를 활용한 이미지 객체 탐지 실습
article_tag1: AI
article_tag2: HuggingFace
article_tag3: LLM
article_section: 
meta_keywords: AI, HuggingFace, LLM, LangChain
last_modified_at: '2025-05-14 21:00:00 +0800'
---


## Hugging Face를 활용한 이미지 객체 탐지 실습

---

## 1. 개요

AI가 사람처럼 이미지를 보고 "이건 고양이고, 저건 강아지야"라고 말할 수 있을까요?
이번 글에서는 Hugging Face의 사전 학습된 모델을 이용해, **이미지 속 객체를 인식하고 위치를 시각화하는 간단한 프로젝트**를 다뤄봅니다.

---

## 2. 사용 기술 소개

* 🤗 Hugging Face Transformers: 객체 탐지 및 다양한 NLP 태스크용 모델 제공
* PyTorch / timm: 모델 실행 백엔드
* matplotlib, Pillow: 이미지 시각화
* pipeline API: 모델을 손쉽게 불러와 사용할 수 있도록 도와주는 고수준 인터페이스

---

## 3. 사전 준비

### 3.1 필요한 라이브러리 설치

```bash
pip install transformers huggingface_hub matplotlib pillow
```

### 3.2 Hugging Face 토큰 발급 및 로그인

[https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)에서 토큰을 생성 후, `.env` 파일에 저장하거나 코드에서 직접 사용합니다.

---

## 4. 코드 구현

### 4.1 전체 코드

```python
import os
from dotenv import load_dotenv
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from transformers import pipeline
from huggingface_hub import login

# 환경 변수 로드
load_dotenv(dotenv_path='huggingface_key.env')
hf_token = os.getenv("HUGGINGFACEHUB_API_TOKEN")
login(token=hf_token)

# 객체 탐지 파이프라인 생성 (DETR 모델 사용)
detector = pipeline("object-detection", model="facebook/detr-resnet-50")

# 이미지 탐지 실행
result = detector('image/catdog.jpg')

# 결과 출력
for obj in result:
    print(f"Label: {obj['label']}, Score: {obj['score']:.2f}, Box: {obj['box']}")

# 이미지 시각화
image = Image.open('image/catdog.jpg')
fig, ax = plt.subplots(1)
ax.imshow(image)

for r in result:
    box = r['box']
    rect = patches.Rectangle(
        (box['xmin'], box['ymin']),
        box['xmax'] - box['xmin'],
        box['ymax'] - box['ymin'],
        linewidth=2,
        edgecolor='r',
        facecolor='none'
    )
    ax.add_patch(rect)
    ax.text(box['xmin'], box['ymin'], f"{r['label']} {r['score']:.2f}",
            color='blue', fontsize=15)

plt.axis('off')
plt.show()
```

---

## 5. 코드 설명 (AI가 객체를 인식하는 과정)

1. **모델 불러오기**
   Hugging Face에서 사전 학습된 객체 탐지 모델 `facebook/detr-resnet-50`을 사용합니다. 이 모델은 이미 많은 이미지를 학습해, 새로운 이미지에서도 고양이, 강아지, 사람 등을 식별할 수 있습니다.

2. **탐지 실행**
   `pipeline("object-detection")`을 통해 이미지를 입력하면, 이미지 안에 있는 객체들의 종류와 위치(Box), 확신도(Score)를 반환합니다.

3. **결과 시각화**
   Pillow로 이미지를 열고, Matplotlib으로 Bounding Box를 그립니다. 모델이 탐지한 객체의 이름과 확률도 함께 출력하여 사람이 쉽게 이해할 수 있도록 합니다.

---

## 6. 결과 예시

모델이 인식한 결과는 다음과 같습니다:

```
Label: cat, Score: 0.98, Box: {'xmin': ..., 'ymin': ..., 'xmax': ..., 'ymax': ...}
Label: dog, Score: 0.95, Box: {'xmin': ..., 'ymin': ..., 'xmax': ..., 'ymax': ...}
```

그리고 이미지에는 고양이와 강아지를 둘러싼 빨간 사각형이 표시되며, 각 객체의 이름이 표시됩니다.

---

## 7. 마무리

이처럼 Hugging Face와 Transformers를 활용하면 복잡한 딥러닝 코드를 작성하지 않고도, **간단한 파이프라인 호출만으로 객체 탐지**를 구현할 수 있습니다.

이후에는 사용자 이미지 업로드, 웹 인터페이스 연결, 다양한 모델 실험 등으로 발전시킬 수 있습니다.

---

## 8. 참고 자료

* [facebook/detr-resnet-50 모델 카드](https://huggingface.co/facebook/detr-resnet-50)
* [Hugging Face Transformers Documentation](https://huggingface.co/docs/transformers)