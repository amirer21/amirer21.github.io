---
title: Python - 컴퓨터 비전, OpenCV (5) 영상 속성과 픽셀 값 참조방법
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

## cv2, glob 불러오기
cv2을 불러오고, 디렉터리 내의 파일들을 읽기 위해 glob, 파일 접근을 위해 sys 모듈도 불러온다.

```py
import sys
import glob
import cv2
```

## glob
glob 모듈은 디렉터리 내의 파일들을 읽어서 리스트로 반환하는 함수


```py
# image 폴더에 있는 모든 jpg 파일을 읽어온다.
img_files = glob.glob('.\\images\\*.jpg')
print("img_files:", img_files)

# 파일이 없으면 종료
if not img_files:
    print("There are no jpg files in 'images' folder")
    sys.exit()

# namedWindow : 윈도우 창을 생성하는 함수
# WINDOW_NORMAL : 사용자가 창의 크기를 조절할 수 있음
cv2.namedWindow('image', cv2.WINDOW_NORMAL)

# setWindowProperty : 창의 속성을 변경하는 함수
# 파라미터
# setWindowProperty(winname, prop_id, prop_value) -> None
# winname : 창의 이름
# prop_id : 창의 속성
# prop_value : 창의 속성 값

# cv2.WND_PROP_FULLSCREEN : 전체 화면 모드
# cv2.WINDOW_FULLSCREEN : 전체 화면 모드
cv2.setWindowProperty('image', cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

# 이미지를 차례대로 출력
cnt = len(img_files)
idx = 0
while True:
    img = cv2.imread(img_files[idx])
    
    if img is None:
        print('Image load failed!')
        break
    
    cv2.imshow('image', img)
    if cv2.waitKey(1000) >= 0:
        break
    
    idx += 1
    if idx >= cnt:
        idx = 0
        
cv2.destroyAllWindows()

########################################################
#영상 속성과 필셀 값 참조방법
import sys
import cv2

img1 = cv2.imread('.\\images\\cat.bmp', cv2.IMREAD_GRAYSCALE)
img2 = cv2.imread('.\\images\\cat.bmp', cv2.IMREAD_COLOR)

if img1 is None or img2 is None:
    print('Image load failed!')
    sys.exit()
    
    
#영상 속성 확인
# shape : 영상 크기(높이, 너비)를 튜플 형태로 반환
# dtype : 픽셀값의 데이터 타입을 반환
print('type(img1):', type(img1)) #<class 'numpy.ndarray'>
print('img1.shape:', img1.shape) #(480, 640)
print('img2.shape:', img2.shape) #(480, 640, 3)
print('img1.dtype:', img1.dtype) #uint8


#영상의 크기 확인
h, w = img2.shape[:2]
print('img2 size: {} x {}'.format(w, h)) #640 x 480

if len(img1.shape) == 2:
    print('img1 is a grayscale image')
elif len(img1.shape) == 3:
    print('img1 is a truecolor image')
    
cv2.imshow('img1', img1)
cv2.imshow('img2', img2)
cv2.waitKey()
cv2.destroyAllWindows()
```

- 이미지 출력 (1) : img1 (흑백)

![img](/assets/images/opencv/exam04_figure_2.png "opencv.png")

- 이미지 출력 (2) : img2 (컬러)

![img](/assets/images/opencv/exam04_figure_1.png "opencv.png")



```py
#영상의 픽셀값 참조
# h, w = 각각 행과 열의 크기
# h, w 는 640, 480 이다.
# 반복문으로 각각의 픽셀값을 참조할 수 있다.
# 픽셀값이란 행렬의 원소값을 의미한다.
for y in range(h):
    for x in range(w):
        img1[y, x] = 255 # (y, x) 위치의 픽셀값을 255로 변경
        img2[y, x] = (0, 0, 255) # (y, x) 위치의 픽셀값을 (0, 0, 255)로 변경
        

cv2.imshow('img11', img1)
cv2.imshow('img22', img2)
#cv2.destroyAllWindows()
cv2.waitKey()

cv2.destroyWindow('img11')
cv2.destroyWindow('img22')
```


- 이미지 출력 (3)

![img](/assets/images/opencv/exam05_img1.png "opencv.png")


- 이미지 출력 (4)

![img](/assets/images/opencv/exam05_img2.png "opencv.png")