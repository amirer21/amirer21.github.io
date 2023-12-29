---
title: Python - 컴퓨터 비전, OpenCV (1) 이미지 불러오기, 저장하기
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
description:        
article_tag1: python
article_tag2: OpenCV
article_tag3: 
article_section: python
meta_keywords: python, OpenCV
last_modified_at: '2023-11-12 21:00:00 +0800'
---

 OpenCV(Open Source Computer Vision Library)는 영상 처리 및 컴퓨터 비전 관련 알고리즘을 구현한 오픈 소스 라이브러리이다.C++, Python, Java, MATLAB 등의 언어 지원이 되며, 다양한 플랫폼에서 사용 가능(Windows, Linux, Mac OS, iOS, Android)하다.  영상 처리, 객체 인식, 얼굴 인식, 동작 인식, 기계 학습, 로봇, 모바일 등에 사용되고 있다.

CV2의 기본적인 기능으로 이미지 읽기, 이미지 출력, 이미지 저장의 기능을 살펴보도록 한다.

## 순서
1. 이미지 읽기 -> imread()
2. 이미지 출력 -> imshow()
3. 이미지 저장 -> imwrite()


## 설치

> pip install opencv-python

## 불러오기

```py
import cv2
import sys

print("hello, opencv", cv2.__version__)
```

# 1. 이미지 읽기
# imread : 이미지 파일을 읽어서 numpy 객체로 만드는 함수

```py
original_img = cv2.imread('./images/cat.bmp')
```

# 2. 이미지 출력
# imshow : 이미지를 화면에 출력하는 함수
```py
if original_img is None:
    print("Image load failed!")
    sys.exit() #프로그램 종료 함수.
    
cv2.namedWindow('image') #namedWindow : 윈도우 창을 생성하는 함수
cv2.imshow('image', original_img) #imshow : 이미지를 화면에 출력하는 함수
cv2.waitKey() #waitKey : 키보드 입력을 처리하는 함수

cv2.destroyAllWindows() #destroyAllWindows : 모든 윈도우 창을 닫는 함수
```


# 3. 이미지 저장
# imwrite : 이미지를 파일로 저장하는 함수
```
cv2.imwrite('./save_images/original_cat.png', original_img)
```

------------------------------------------

## 전체 코드 및 설명
```py
import cv2
import sys

### 이미지 출력 함수
def showImage(img):
    if img is None:
        print("Image load failed!")
        sys.exit() #프로그램 종료 함수.
        
    cv2.namedWindow('image') #namedWindow : 윈도우 창을 생성하는 함수
    cv2.imshow('image', img) #imshow : 이미지를 화면에 출력하는 함수
    cv2.waitKey() #waitKey : 키보드 입력을 처리하는 함수

    cv2.destroyAllWindows() #destroyAllWindows : 모든 윈도우 창을 닫는 함수
```

### 이미지 읽기

## 형식 : cv2.imread(파일명, 플래그)

### 플래그 : 이미지 파일을 읽을 때 사용할 옵션 지정
- IMREAD_COLOR : 컬러 이미지로 로드
- IMREAD_GRAYSCALE : 그레이스케일 이미지로 로드
- IMREAD_UNCHANGED : 알파 채널을 포함하여 이미지 그대로 로드
- IMREAD_ANYCOLOR : 가능한 32비트 이미지로 로드

### 플래그 옵션
-  0 : 그레이스케일 이미지로 로드
-  -1 : 알파 채널을 포함하여 이미지 그대로 로드
-  3 : 컬러 이미지로 로드
-  4 : 가능한 32비트 이미지로 로드

### 원본 이미지

```py
original_img = cv2.imread('./images/cat.bmp')
showImage(original_img)
```
- 이미지
![img](/assets/images/opencv/original_cat.png "opencv.png")



```py
#cv2.IMREAD_COLOR : 컬러 이미지로 로드
color_img = cv2.imread('./images/cat.bmp', cv2.IMREAD_COLOR)
showImage(color_img)
```
- 이미지
![img](/assets/images/opencv/color_cat.png "opencv.png")



```py
#cv2.IMREAD_GRAYSCALE : 그레이스케일 이미지로 로드
gray_img = cv2.imread('./images/cat.bmp', cv2.IMREAD_GRAYSCALE)
showImage(gray_img)
```
- 이미지
![img](/assets/images/opencv/gray_cat.png "opencv.png")


```py
#cv2.IMREAD_UNCHANGED : 알파 채널을 포함하여 이미지 그대로 로드
#알파 채널 : 투명도를 나타내는 채널
unchange_img = cv2.imread('./images/cat.bmp', cv2.IMREAD_UNCHANGED)
showImage(unchange_img)
```
- 이미지
![img](/assets/images/opencv/unchanged_cat.png "opencv.png")



## 3. 이미지 저장

- imwrite : 이미지를 파일로 저장하는 함수
- 형식 : cv2.imwrite(파일명, 이미지)
- 반환 값 : 성공하면 True, 실패하면 False

```py
#original image
cv2.imwrite('./save_images/original_cat.png', original_img)

#cv2.IMREAD_COLOR : 컬러 이미지로 로드
cv2.imwrite('./save_images/color_cat.png', color_img)

#cv2.IMREAD_GRAYSCALE : 그레이스케일 이미지로 로드
cv2.imwrite('./save_images/gray_cat.png', gray_img)

#cv2.IMREAD_UNCHANGED : 알파 채널을 포함하여 이미지 그대로 로드
cv2.imwrite('./save_images/unchanged_cat.png', unchange_img)
```
