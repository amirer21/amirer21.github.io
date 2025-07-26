---
title: (Hugging Face) YOLOv8을 활용한 이미지 객체 탐지 실습
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
description: 인공지능 - YOLOv8을 활용한 이미지 객체 탐지 실습
article_tag1: AI
article_tag2: HuggingFace
article_tag3: LLM
article_section: 
meta_keywords: AI, HuggingFace, LLM, LangChain
last_modified_at: '2025-05-14 21:00:00 +0800'
---


# YOLOv8을 활용한 이미지 객체 탐지 실습

---

## 1. 개요

AI에게 고양이와 강아지를 보여주면 알아볼 수 있을까요?
이 글에서는 Ultralytics에서 제공하는 **YOLOv8 모델**을 사용해 이미지 속 객체(고양이, 강아지 등)를 탐지하고 시각화하는 과정을 살펴봅니다.

YOLO(You Only Look Once)는 이미지 내 여러 객체를 빠르고 정확하게 탐지하는 대표적인 딥러닝 모델입니다. Ultralytics는 이를 Python 코드 한 줄로 쉽게 사용할 수 있도록 라이브러리를 제공합니다.

---

## 2. 필요한 환경 설정

### 2.1 라이브러리 설치

```bash
pip install ultralytics opencv-python python-dotenv
```

### 2.2 Hugging Face와 OpenAI 관련 모듈도 같이 포함된 이유

이 코드는 다양한 AI 실험을 위한 베이스 환경을 포함하고 있습니다. 하지만 YOLO만 사용할 경우 아래 부분은 삭제해도 무방합니다:

* `openai`, `ChatOpenAI`, `langchain_*`
* `huggingface_hub`, `transformers`, `ImageCaptionLoader`, `torch`, `PromptTemplate` 등

---

## 3. YOLOv8 객체 탐지 코드

```python
import os
import warnings
from dotenv import load_dotenv
import cv2
from ultralytics import YOLO

# 경고 무시
warnings.filterwarnings("ignore")
os.environ["USER_AGENT"] = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) LangChainBot/1.0"
load_dotenv(dotenv_path='openapi_key.env')  # openapi 키가 필요 없다면 생략 가능

# 1. YOLO 모델 로드 (yolov8n은 경량 모델, yolov8s는 조금 더 정확)
model = YOLO('yolov8n.pt')

# 2. 이미지 예측 수행
results = model.predict('image/catdog.jpg')
rst = results[0]

# 3. 이미지 불러오기 (OpenCV 사용)
image = cv2.imread('image/catdog.jpg')

# 4. 탐지된 객체 정보를 이용해 이미지에 박스 및 텍스트 표시
for box in rst.boxes:
    x1, y1, x2, y2 = map(int, box.xyxy[0])  # 좌표 정수화
    conf = box.conf[0]
    cls = int(box.cls[0])
    label = model.names[cls]  # 클래스명 추출

    if conf > 0.5:  # confidence가 50% 이상일 때만 시각화
        cv2.rectangle(image, (x1, y1), (x2, y2), (0, 255, 0), 2)
        cv2.putText(image, f'{label}', (x1, y1),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

# 5. 결과 이미지 출력
cv2.imshow("yolo", image)
cv2.waitKey(0)
cv2.destroyAllWindows()
```

---

## 4. 설명: AI가 이미지를 이해하는 과정

1. **YOLO 모델 로딩**
   `YOLO('yolov8n.pt')`를 통해 사전 학습된 모델을 메모리에 불러옵니다.
   이 모델은 다양한 객체(동물, 사람, 사물 등)를 미리 학습한 상태입니다.

2. **예측 수행**
   `model.predict()`에 이미지를 입력하면, YOLO는 해당 이미지에서 객체를 찾고 각 객체의 위치(좌표), 클래스(예: cat, dog), 신뢰도(confidence)를 계산합니다.

3. **결과 시각화**
   OpenCV를 사용해 탐지된 객체 주변에 **초록색 박스와 라벨을 그림**으로써 사용자가 눈으로 쉽게 확인할 수 있게 만듭니다.

---

## 5. 결과 예시

실행하면 아래와 같은 결과를 확인할 수 있습니다:

* 고양이와 강아지를 인식한 후, 화면에 박스를 그려 보여줍니다.
* 각 객체의 이름과 함께 예측 정확도를 시각적으로 표시합니다.

---

## 6. 마무리

YOLOv8과 OpenCV만으로도 강력한 객체 탐지 시스템을 빠르게 구축할 수 있습니다.
추후에는 영상 처리, 웹 연동(Streamlit, Flask), 자동 분류 시스템 등에 활용해보세요.

---

## 7. 참고자료

* [Ultralytics YOLOv8 공식 문서](https://docs.ultralytics.com/)
* [YOLOv8 GitHub](https://github.com/ultralytics/ultralytics)

