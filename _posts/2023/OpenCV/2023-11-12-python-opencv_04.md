---
title: Python - 컴퓨터 비전, OpenCV (4) 2개의 이미지를 나열해서 출력하기
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

```py
#pip install opencv-python
import cv2
import matplotlib.pyplot as plt

# 이미지 파일 (1) : 컬러 이미지
# 컬러이미지를 불러와서 "imgBGR"이라는 변수에 저장
#imread : 이미지 파일을 읽어서 numpy 객체로 만드는 함수
imgBGR = cv2.imread('./images/cat.bmp')
#cvtColor : 이미지 색상 형태 변경 함수.
imgRGB = cv2.cvtColor(imgBGR, cv2.COLOR_BGR2RGB)

plt.axis('off') #축 제거
plt.imshow(imgRGB)
plt.show()
```
- 이미지 출력 (1)

![img](/assets/images/opencv/exam04_figure_1.png "opencv.png")

```py
# 이미지 파일 (2) : 그레이스케일 이미지
# 그레이스케일 이미지를 불러와서 "imgGray"이라는 변수에 저장
imgGray = cv2.imread('./images/cat.bmp', cv2.IMREAD_GRAYSCALE)
plt.axis('off') #축 제거
plt.imshow(imgGray, cmap='gray') #cmap='gray' : 그레이스케일로 출력
plt.show()
```

- 이미지 출력 (2)

![img](/assets/images/opencv/exam04_figure_2.png "opencv.png")


### 두 개의 이미지를 함께 출력

```py
# subplot : 여러 개의 그래프를 한 번에 그리기 위해 사용하는 함수
# subplot(행, 열, 위치)
# 불러온 이미지의 위치를 지정하여 출력
# axis('off') : 축 제거
plt.subplot(121), plt.axis('off'), plt.imshow(imgRGB) # 1행 2열의 1번째
plt.subplot(122), plt.axis('off'), plt.imshow(imgGray, cmap='gray') # 1행 2열의 2번째
plt.show()
```

- 이미지 출력 (3)

![img](/assets/images/opencv/exam04_figure_3.png "opencv.png")