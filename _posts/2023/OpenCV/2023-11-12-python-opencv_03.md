---
title: Python - 컴퓨터 비전, OpenCV (3) 이미지 출력 후 사용자 입력(Keyboard) 제어
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

## waitKey()

### 키보드 입력을 처리하는 함수 : waitKey()
# cv2.waitKey() 함수는 키보드 입력을 처리하는 함수이다.

사용자가 어떤 키를 눌렀는지 알아내기 위해서는 waitKey() 함수를 사용해야 한다.만약, 사용자가 'q'키를 누른다면, waitKey() 함수는 'q'의 아스키 코드 값을 반환한다.그리고 이 값을 ord() 함수를 사용하여 문자로 변환하면 'q'를 얻을 수 있다.

이미지가 출력되었을때 키보드 입력을 처리하려면 waitKey() 함수를 사용해야 한다. 이미지가 출력되고 나서 사용자가 키보드 입력을 하기 전에는 아무런 작동을 하지 않는다.사용자가 키보드 입력을 하면, 출력된 이미지 창이 종료되는 예제를 살펴보자.

### 함수 : waitKey(delay=None) -> retval

- delay : delay <= 0이면 무한히 기다림. delay > 0이면 지정한 시간(단위: ms)만큼 대기
- retval : 사용자가 입력한 키 값. 키보드 입력이 없으면 -1을 반환

## 설치

> pip install opencv-python

```py
import cv2
import matplotlib.pyplot as plt

#imread : 이미지 파일을 읽어서 numpy 객체로 만드는 함수
#numpy 객체란 numpy 라이브러리에서 사용하는 행렬 객체
img = cv2.imread('./images/cat.bmp', cv2.IMREAD_GRAYSCALE) 

# cvtColor : 이미지 색상 형태 변경 함수. 
# cv2.COLOR_BGR2RGB : BGR 형태의 이미지를 RGB 형태로 변경
plt.imshow(cv2.cvtColor(img, cv2.COLOR_BGR2RGB)) 
plt.show()

if img is None:
    print("Image load failed!")
    sys.exit()

cv2.imwrite('cat_gray.png', img) #imwrite : 이미지를 파일로 저장하는 함수
cv2.imshow('image', img) #imshow : 이미지를 화면에 출력하는 함수
cv2.waitKey() #waitKey : 키보드 입력을 처리하는 함수
#delay : delay <= 0이면 무한히 기다림. delay > 0이면 지정한 시간(단위: ms)만큼 대기
#retval : 사용자가 입력한 키 값. 키보드 입력이 없으면 -1을 반환

while True:
    # ord() : 문자의 아스키 코드 값을 리턴하는 함수
    # waitKey : 키보드 입력을 처리하는 함수. q를 입력하면 종료
    if cv2.waitKey() == ord('q'): 
        break       

cv2.destroyAllWindows() #destroyAllWindows : 모든 윈도우 창을 닫는 함수
```