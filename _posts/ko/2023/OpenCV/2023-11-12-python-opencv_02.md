---
title: Python - 컴퓨터 비전, OpenCV (2) 이미지를 그래프로 출력하는 방법
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- OpenCV
tags:
- Python
- OpenCV
toc: true
toc_sticky: true
toc_label: 목차
description: Python opencv example
article_tag1: python
article_tag2: OpenCV
article_tag3: 
article_section: python
meta_keywords: python, OpenCV
last_modified_at: '2023-11-12 21:00:00 +0800'
---

## matplotlib.pyplot : 그래프를 그리는 라이브러리

### 설치

> pip install opencv-python

### 예제 코드 및 설명

```py
import cv2
import matplotlib.pyplot as plt

#img = cv2.imread('cat.bmp')
#gray
img = cv2.imread('./images/cat.bmp', cv2.IMREAD_GRAYSCALE)

# cvtColor : 이미지 색상 형태 변경 함수.
# cv2.COLOR_BGR2RGB : BGR 형태의 이미지를 RGB 형태로 변경
# RGB 형태란 Red, Green, Blue 색상을 의미
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)) 

#show() : 그래프를 화면에 출력하는 함수
plt.show()

if img is None:
    print("Image load failed!")
    sys.exit()
    
cv2.imwrite('cat_gray.png', img) #imwrite : 이미지를 파일로 저장하는 함수
cv2.imshow('image', img) #imshow : 이미지를 화면에 출력하는 함수
cv2.waitKey() #waitKey : 키보드 입력을 처리하는 함수

cv2.destroyAllWindows() #destroyAllWindows : 모든 윈도우 창을 닫는 함수
```

- 이미지

![img](/assets/images/opencv/exam02_figure_1.png "opencv.png")
