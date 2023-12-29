---
title: Python - 컴퓨터 비전, OpenCV (6) 영상 픽셀 변경하기
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

## 파이썬 numpy 로 객체를 생성하고 영상으로 변환하기

numpy : 수치 계산을 위한 라이브러리이다.
empty, zeros, ones, full 함수를 사용하여 numpy 객체를 생성할 수 있다.

이번 예제에서는 numpy로 객체를 생성하고, 이 객체를 영상으로 변환하여 출력해보자.

### 불러오기
```py
import numpy as np
import cv2
```

## 1. numpy - empy 함수

```py
#empty : numpy 객체를 생성만 하고 초기화하지 않는 함수
#240x320 그레이스케일 영상 생성
img1 = np.empty((240, 320), dtype=np.uint8) 
print("img1 :: ", img1)

'''
img1 ::  
[[ 80   1   9 ...   0  90  30]
 [100  20 132 ...   0 171   0]
 [  0   0   0 ...  61 166   2]
 ...
 [  0   0   0 ... 108 101  91]
 [116  48  44 ... 136  70 221]
 [ 11  14 136 ...   0 101   0]]
'''


print("img1.shape :: ", img1.shape)
#img1.shape ::  (240, 320)
```


## 2. numpy - zeros 함수

```py
#zeros : numpy 객체를 생성하고 0으로 초기화하는 함수
#240x320 컬러 영상 생성
img2 = np.zeros((240, 320, 3), dtype=np.uint8) 
print("img2 :: ", img2)
'''
img2 ::  
[[[0 0 0]
  [0 0 0]
  [0 0 0]
  ...
  [0 0 0]
  [0 0 0]
  [0 0 0]]

 ...

 [[0 0 0]
  [0 0 0]
  [0 0 0]
  ...
  [0 0 0]
  [0 0 0]
  [0 0 0]]
'''
```


## 3. numpy - ones 함수

ones : numpy 객체를 생성하고 1로 초기화하는 함수

ones()는 1로 초기화된 배열을 생성하는데, 255를 곱하면 255로 초기화된 배열을 생성할 수 있다.

```py
#240x320 흰색 영상 생성
img3 = np.ones((240, 320), dtype=np.uint8) * 255 
print("img3 :: ", img3)
# ones으로만 출력하면 1이지만, 255를 곱하면 255로 초기화된 배열을 생성할 수 있다.
'''
img3 ::  
[[1 1 1 ... 1 1 1]
 [1 1 1 ... 1 1 1]
 [1 1 1 ... 1 1 1]
 ...
 [1 1 1 ... 1 1 1]
 [1 1 1 ... 1 1 1]
 [1 1 1 ... 1 1 1]]
'''
```

## 4. numpy - full 함수

full : numpy 객체를 생성하고 픽셀값을 지정한 값으로 초기화하는 함수

```py
#240x320 노란색 영상 생성
img4 = np.full((240, 320, 3), (0, 255, 255), dtype=np.uint8) 
print("img4 :: ", img4)
'''
img4 :: 
[[255 255 255 ... 255 255 255]
 [255 255 255 ... 255 255 255]
 [255 255 255 ... 255 255 255]
 ...
 [255 255 255 ... 255 255 255]
 [255 255 255 ... 255 255 255]
 [255 255 255 ... 255 255 255]]
'''
```

## 이미지 출력해보기
```py
cv2.imshow('img1', img1)
cv2.imshow('img2', img2)
cv2.imshow('img3', img3)
cv2.imshow('img4', img4)
cv2.waitKey()
cv2.destroyAllWindows()
```
- img1

![img](/assets/images/opencv/create_img1.png "opencv.png")

- img2

![img](/assets/images/opencv/create_img2.png "opencv.png")

- img3

![img](/assets/images/opencv/create_img3.png "opencv.png")

- img4

![img](/assets/images/opencv/create_img4.png "opencv.png")