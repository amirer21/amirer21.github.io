---
title: Python - 컴퓨터 비전, OpenCV (7) 복사하기(깊은 복사, 얕은 복사 비교)
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

이 예제에서는 영상을 복사하는 방법에 대해 알아본다.

## 영상을 복사하는 방법은 크게 2가지가 있다.
1. 얕은 복사(참조 복사)
2. 깊은 복사(값 복사)

### 얕은 복사(참조 복사)란, 원본의 주소를 복사하는 것이다.
원본의 주소를 복사하기 때문에 원본의 값을 변경하면 복사한 객체의 값도 변경된다.
원본과 복사한 객체가 같은 주소를 가지고 있기 때문에 원본의 값을 변경하면 복사한 객체의 값도 변경되는 것이다.

### 깊은 복사(값 복사)란, 원본의 값을 복사하는 것이다.
원본의 값을 복사하기 때문에 원본의 값을 변경해도 복사한 객체의 값은 변경되지 않는다.
원본과 복사한 객체가 다른 주소를 가지는 독립적인 객체이므로 원본의 값을 변경해도 복사한 객체의 값은 변경되지 않는다.

얕은 복사와 깊은 복사의 차이점을 이해하기 위해 다음 예제를 살펴보자.


### 이미지 불러와서 복사하기


#### 이미지는 총 3개로 비교해본다.

- img1 : 원본
- img2 : img1을 참조(얕은 복사)한 이미지
- img3 : img1을 복사(깊은 복사)한 이미지

```py
import numpy as np
import cv2

#영상 복사

#img1 : 원본
img1 = cv2.imread('.\\resource\\HappyFish.jpg')

#img2 : img1을 참조(얕은 복사)한 이미지
img2 = img1 #얕은 복사 : 참조 복사

#img3 : img1을 복사(깊은 복사)한 이미지
img3 = img1.copy() #깊은 복사 : 값 복사
#얕은 복사와 깊은 복사의 차이점은 img1의 값을 변경했을 때 img2와 img3의 값이 어떻게 변하는지 확인해보면 알 수 있음
#얕은 복사란 img1의 주소를 img2에 복사하는 것이고, 깊은 복사란 img1의 값을 img3에 복사하는 것임
#주소를 복사한다는 것은 img1의 값을 변경하면 img2의 값도 변경되는 것이고, 값만 복사한다는 것은 img1의 값을 변경해도 img3의 값은 변경되지 않는 것임
#즉, 얕은 복사는 참조 복사이고, 깊은 복사는 값 복사임

## img1을 노란색으로 채워보자
#img1을 노란색으로 채워보자
img1[:, :] = (0, 255, 255) 
```

### 복사 결과 확인 (1) : 이미지 출력
```py
#img1
cv2.imshow('img1', img1)

#img2 역시 노란색으로 채워졌음을 확인할 수 있다.
#img2는 img1의 주소를 복사(참조)했기 때문에 img1의 값을 변경하면 img2의 값도 변경된다.
cv2.imshow('img2', img2)

#반면에, img3는 img1의 값을 복사(원본을 복사해 새로 생성)했기 때문에 img1의 값을 변경해도 img3의 값은 변경되지 않는다.
cv2.imshow('img3', img3)
```

- img1

![img](/assets/images/opencv/copy_img1.png "opencv.png")

- img2

![img](/assets/images/opencv/copy_img2.png "opencv.png")

- img3

![img](/assets/images/opencv/copy_img3.png "opencv.png")



### 복사 결과 확인 (2) : 주소값 확인
```py
#instance 주소값 확인해보자
#img1, img2, img3의 주소값을 확인해보면 
#img1과 img2의 주소값이 같고, img3의 주소값은 다르다.
#img3는 img1의 값을 복사해 새로 생성했기 때문에 img1과 img3의 주소값이 다른 것이다.
print(id(img1)) #img1의 주소값 : 2032685886288
print(id(img2)) #img2의 주소값 : 2032685886288
print(id(img3)) #img3의 주소값 : 2032965928304

cv2.waitKey()
cv2.destroyAllWindows()
```


## 관심 영역 복사

관심 영역 복사란, 영상의 일부분을 복사하는 것이다.

관심 영역 복사에서 얕은 복사와 깊은 복사의 차이점을 이해하기 위해 다음 예제를 살펴보자.

```py
import numpy as np
import cv2

#img1 : 원본
img1 = cv2.imread(".\\resource\\HappyFish.jpg")

#img2 : img1의 관심영역을 참조(얕은 복사)한 이미지
img2 = img1[40:120, 30:150] #관심영역 지정

#img3 : img1의 관심영역을 복사(깊은 복사)한 이미지
img3 = img1[40:120, 30:150].copy() #깊은 복사

## img2를 검은색으로 채워보자
img2.fill(0) #img2를 검은색으로 채움
```

## 복사 결과 확인 (1) : 이미지 출력
```py
# img2에 img1의 관심영역을 참조(얕은 복사)했다.
# 그래서 img2.fill(0)으로 img2 파일을 검은색으로 채우면 img1의 관심영역도 검은색으로 채워진다.
cv2.imshow('img1', img1)

# img2는 img1의 관심영역이다. (img1의 일부분을 참조(얕은 복사)했다.)
cv2.imshow('img2', img2)

# img3는 img1의 관심영역을 복사(깊은 복사)했다.
cv2.imshow('img3', img3)
```

- img1

![img](/assets/images/opencv/copy_area_img1.png "opencv.png")

- img2

![img](/assets/images/opencv/copy_area_img2.png "opencv.png")

- img3

![img](/assets/images/opencv/copy_area_img3.png "opencv.png")



## 복사 결과 확인 (2) : 주소값 확인
```py
# img1, img2, img3의 주소값을 확인해보면 
# img1, img2, img3의 주소값이 모두 다르다.
# 각각 새로운 객체를 생성했기 때문에 주소값이 다른 것이다.
# 하지만, img1과 img2의 관심영역은 같은 주소값을 가지고 있기 때문에 img2를 변경하면 img1의 관심영역도 변경된다.
print(id(img1)) #img1의 주소값 : 1890897578768
print(id(img2)) #img2의 주소값 : 1890897580208
print(id(img3)) #img3의 주소값 : 1890897580304
```

## 복사 결과 확인 (3) : 관심영역 주소값 확인
```py
# 관심 영역의 주소값 확인하기
# img1, img2, img3의 관심영역 주소값을 확인해보면, 모두 같은 주소값을 가지고 있다.
print(id(img1[40:120, 30:150])) #img1의 관심영역 주소값 : 1743643814736
print(id(img2[40:120, 30:150])) #img2의 관심영역 주소값 : 1743643814736
print(id(img3[40:120, 30:150])) #img3의 관심영역 주소값 : 1743643814736


cv2.waitKey()
cv2.destroyAllWindows()
```



