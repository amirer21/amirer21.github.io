---
title: Python Numpy & Pandas
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: Python 데이터 처리를 위한 Numpy & Pandas 비교
article_tag1: python
article_tag2: pandas
article_tag3: numpy
article_section: 데이터 처리
meta_keywords: python, numpy, pandas
last_modified_at: '2023-04-10 21:00:00 +0800'
---
① ② *Python* 

# Python Numpy 란?

**Numpy**
는 Numerical Python의 약자이다. 다차원 배열을 쉽게 처리하고 효율적으로 사용할 수 있도록 지원하는 파이썬의 패키지이다.수치 계산을 위해 효율적으로 구현된 기능을 제공한다.

사람이 가진 실제의 데이터를 컴퓨터가 이해할 수 있도록 숫자 형식으로 변환하는 것이다.

#
## ① Numpy 특징
(1) 일반 List에 비해 빠르고, 메모리를 효율적으로 사용한다. <br>
(2) 반복문 없이 데이터 배열에 대한 처리를 지원하여 빠르고 편리하다. <br>
(3) 선형대수와 관련된 다양한 기능을 제공한다. <br>
(4) C, C++, 포트란 등의 언어와 통합이 가능하다.


**Numpy의 핵심은 ndarray 이다.** 다차원 행렬 자료구조인 ndarray를 통해 벡터 및 행렬을 사용하는 선형 대수 계산에서 주로 사용된다. 배열의 모든 원소는 동일한 데이터 타입어어야 된다.


**Numpy의 경우 np라는 alias 별칭으로 임포트하는 것이 관례이다.**

> import numpy as np

**ndarray클래스는 벡터화 연산(vectorized operation)을 지원한다.**

**배열**

컴퓨터 과학에서 배열(array)이란 인덱스와 그 인덱스에 대응하는 데이터들로 이루어진 자료 구조
>> np.array( list ) : 가장 기본적인 단순 배열을 생성


**벡터**는 1차원 배열 (행 벡터와 열 벡터의 차이는 없다)을, <br>
**행렬**은 2차원 배열을 말하여, <br>
**텐서(tensor)**는 3차원 이상의 배열의 경우를 말한다.

 벡터화 연산이란? 

예를 들어 원소 모두를 제곱하기 위해서는 반복문을 이용해 원소를 각각 제곱할 필요 없이 객체 자체를 제곱하는 것만으로도 원하는 결과를 얻을 수 있다.

벡터와 행렬

벡터는 크기와 방향을 가진 양입니다. 숫자가 나열된 형상이며 파이썬에서는 1차원 배열 또는 리스트로 표현합니다. 반면, 행렬은 행과 열을 가지는 2차원 형상을 가진 구조입니다. 파이썬에서는 2차원 배열로 표현합니다. 가로줄을 행(row)라고 하며, 세로줄을 열(column)이라고 합니다. 

벡터화 연산은 벡터의 같은 인덱스에 위치한 원소들끼리 연산을 수행하는 기능이다.

벡터화 연산을 사용하면 다음과 같이 for 반복문이 없이 한번의 연산으로 할 수 있다. 계산 속도도 반복문을 사용할 때 보다 훨씬 빠르다.

```python
#for문으로 돌리기
arrayData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
resultArr = []
for di in arrayData:
    resultArr.append(2 * di)
print('resultArr :: ', resultArr)
# >> resultArr ::  [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

#numpy로 돌리기
x = np.array(arrayData)
print('2 * x :: ', 2 * x)
# >> 2 * x ::  [ 0  2  4  6  8 10 12 14 16 18]
```


## null 체크하기
#

* ## 참고
    * 사용이유(컴퓨터 이해): https://brownbears.tistory.com/480
    * 백터(숫자가 나열된 1차원 배열 또는 리스트)와 행렬 : https://wikidocs.net/37001
    * 특징 : https://firework-ham.tistory.com/30
    * for문 vs 빅터 예제: https://datascienceschool.net/01%20python/03.01%20%EB%84%98%ED%8C%8C%EC%9D%B4%20%EB%B0%B0%EC%97%B4.html
    * 넘파이 배열 다양한 예제(백터화 연산) : https://ooyoung.tistory.com/141
    *배열 기본(벡터, 행렬, 텐서), 생성함수 : https://gksid102.tistory.com/27
    *배열 함수 : https://modulabs.co.kr/blog/python-numpy/
#
