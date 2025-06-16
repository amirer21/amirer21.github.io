---
title: 인공지능 - 실시간 웹캠 객체 인식 - YOLOv8을 활용한 AI 시각 시스템
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
description: 인공지능 - 실시간 웹캠 객체 인식 - YOLOv8을 활용한 AI 시각 시스템
article_tag1: AI
article_tag2: HuggingFace
article_tag3: LLM
article_section: 
meta_keywords: AI, HuggingFace, LLM, LangChain
last_modified_at: '2025-05-14 21:00:00 +0800'
---


## 실시간 웹캠 객체 인식 - YOLOv8을 활용한 AI 시각 시스템

---

## 개요

AI가 실시간으로 카메라를 통해 세상을 바라보며 "저건 사람, 저건 고양이야!"라고 말할 수 있을까요?

이번 글에서는 **YOLOv8**이라는 최신 객체 탐지 모델을 사용하여, **웹캠 화면에 등장하는 객체를 실시간으로 인식하고 화면에 표시**해보겠습니다.


좋은 질문입니다.
"컴퓨터가 어떻게 사물을 보고 인식할 수 있을까?"
이건 마치 \*\*'눈이 없는 존재에게 세상을 이해시키는 방법'\*\*과 같습니다.

---

## 컴퓨터에게 '이미지'란?

우리 눈에는 고양이 사진이 보이지만,
컴퓨터는 이 이미지를 **숫자 배열**로만 인식합니다.

예:
이미지 한 장 →

```
[
  [ [123, 255, 0], [124, 254, 1], ... ],  ← 1행: RGB 값
  ...
]
```

즉, 이미지 = 수많은 픽셀(Pixel) = 각 픽셀 = RGB 숫자 3개
→ 컴퓨터에겐 그냥 수천만 개의 숫자 덩어리입니다.

---

## 그럼 AI는 어떻게 '의미'를 이해할까?

이제 핵심은 **숫자 배열 속에서 패턴을 찾아내는 것**입니다.
이걸 해주는 게 바로 **딥러닝 모델**, 그중에서도 \*\*CNN (Convolutional Neural Network)\*\*입니다.

### CNN의 작동 방식 비유:

> 초등학생이 처음 고양이를 배울 때를 떠올려 보세요.
>
> 엄마가 고양이 사진을 보여주며 말합니다:
> "이게 고양이야. 이 귀 모양, 이 눈, 이 수염, 기억해!"
>
> 반복해서 수많은 고양이와 강아지 사진을 보여주면,
> 아이는 **두 동물의 공통점과 차이점**을 스스로 느끼고 분류할 수 있게 됩니다.

CNN도 비슷하게 학습합니다:

* 처음에는 그냥 필터(Filter)를 통해 모양(선, 둥근 것 등)을 감지하고
* 점점 더 깊은 층으로 갈수록 고양이의 귀, 코, 눈 같은 고유 특징을 학습합니다
* 마지막에는 "이건 98% 확률로 고양이야!"라고 판단합니다

---

## YOLO의 방식은 무엇이 다른가요?

YOLO(You Only Look Once)는 객체 탐지를 위한 CNN 기반 모델입니다.
YOLO의 특징은 다음과 같습니다:

* \*\*한 번의 시선(연산)\*\*으로 이미지 전체를 빠르게 파악함
* \*\*객체의 위치(Box 좌표)\*\*와 \*\*종류(Label)\*\*를 동시에 예측함

YOLO는 이미지를 격자(Grid)로 나누고,
각 격자에서 객체가 있을지, 어디에 있을지를 **동시에 예측**합니다.

### 간단한 흐름 요약:

1. 입력 이미지 → 숫자 배열로 변환
2. CNN이 특징 추출
3. YOLO가 각 영역별로:

   * "이 위치에 사람 있음"
   * "이건 고양이일 확률 92%"
   * "박스는 (x1, y1) \~ (x2, y2)"

---

## 쉽게 말해서...

> **컴퓨터는 수천 장의 고양이 사진을 보고,
> ‘고양이스러운 숫자 조합’을 외우고,
> 비슷한 패턴이 다시 나타나면 ‘이건 고양이구나!’라고 판단하는 겁니다.**

---

## 요약

| 단계     | 설명                        |
| ------ | ------------------------- |
| 이미지 입력 | RGB 숫자 배열로 변환             |
| 특징 추출  | CNN이 선, 형태, 구조 인식         |
| 객체 탐지  | YOLO가 위치 + 클래스 동시에 예측     |
| 출력     | '사람(0.98)' → 사각형과 라벨로 시각화 |

---

## 2. 코드

아래는 필요한 부분만 정리한 **실시간 객체 인식 코드**입니다.

```python
import cv2
from ultralytics import YOLO

# YOLOv8 모델 로드 (경량화된 yolov8n 사용)
model = YOLO('yolov8n.pt')

# 웹캠 열기
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
if not cap.isOpened():
    print("카메라를 열 수 없습니다.")
    exit()

print("ESC를 누르면 종료됩니다.")

while True:
    ret, frame = cap.read()
    if not ret:
        break

    # 객체 인식 수행
    results = model.predict(source=frame, imgsz=640, conf=0.5, verbose=False)[0]

    # 결과 박스 출력
    for box in results.boxes:
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        conf = float(box.conf[0])
        cls = int(box.cls[0])
        label = model.names[cls]

        if conf > 0.5:
            cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 255, 0), 2)
            cv2.putText(frame, f"{label} {conf:.2f}", (x1, y1 - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 2)

    cv2.imshow("YOLOv8 Webcam", frame)

    # ESC 키를 누르면 종료
    if cv2.waitKey(10) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()
```

---

## 3. 코드 설명

### 3.1 `YOLO('yolov8n.pt')`

* `YOLOv8`은 Ultralytics에서 제공하는 객체 탐지 모델입니다.
* `yolov8n.pt`는 가장 가벼운(nano) 버전으로 빠른 속도에 적합합니다.
* GPU가 없어도 충분히 작동하며 실시간 처리가 가능합니다.

### 3.2 `model.predict(source=frame)`

* 현재 프레임(이미지 한 장)을 분석하여 **객체의 위치와 종류를 예측**합니다.
* 반환값에는 `boxes` (사각형 좌표), `conf` (신뢰도), `cls` (클래스 번호) 정보가 포함됩니다.

### 3.3 `cv2.rectangle()`과 `cv2.putText()`

* 인식된 객체의 **사각형 박스와 이름, 정확도**를 화면에 그려줍니다.

---

## 4. AI 구조와 객체 인식 매커니즘

### 4.1 YOLOv8 구조 요약

YOLO는 "You Only Look Once"라는 이름처럼, 이미지를 딱 한 번만 보고 그 안에 있는 **모든 객체를 동시에 예측**합니다.

#### 비유: 초능력 관찰자

마치 아래와 같은 상황이라고 상상해보세요:

> 누군가 방에 들어옵니다.
> AI는 방 전체를 단 1초 만에 스캔하면서 동시에 "왼쪽 구석엔 고양이, 오른쪽엔 사람, 책상 위엔 노트북"이라고 알려줍니다.

즉, 사람처럼 **하나씩 시선을 옮기지 않고**, 전체를 한눈에 파악합니다. 이게 YOLO가 빠르고 강력한 이유입니다.

### 4.2 YOLO 인식 흐름 요약

```text
[이미지 또는 영상 프레임]
        ↓
[YOLO 네트워크 처리]
        ↓
[객체의 위치 좌표, 클래스 번호, 신뢰도]
        ↓
[화면에 사각형 박스와 라벨 표시]
```

YOLO는 이미지 전체를 격자로 나누고, 각 격자 안에 어떤 객체가 있는지를 예측합니다. 그 결과로 **(좌표, 클래스, 확률)** 정보를 출력하게 됩니다.

---

## 5. 실시간 탐지 결과 예시

웹캠을 실행하면 다음과 같은 결과가 화면에 출력됩니다:

* 사람이 등장하면 `"person 0.98"` 라벨이 뜨고, 그 주위에 초록 박스가 표시됨
* 고양이나 노트북이 등장하면 `"cat"`, `"laptop"` 등의 라벨이 표시됨

---

## 6. 정리 및 확장 아이디어

YOLOv8을 사용하면 **이미지든, 실시간 영상이든 객체를 빠르게 탐지**할 수 있습니다.
아래와 같은 방향으로 발전시킬 수 있습니다.

* 특정 객체(예: 사람)만 인식해서 알람 울리기
* 실시간 CCTV 분석 시스템 만들기
* Streamlit을 통해 웹 기반 시각화

---

## 7. 참고자료

* [Ultralytics YOLOv8 공식 문서](https://docs.ultralytics.com/)
* [YOLO 논문: You Only Look Once](https://arxiv.org/abs/1506.02640)
