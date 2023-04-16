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

# pandas vs numpy



**pandas** 
자료형이 달라도 된다.
테이블 수정, 조작하는 기능 제공
SQL 처럼 테이블에 쿼리, 조인 수행 가능
엑셀, CSV 파일 읽고, 쓰기 가능

**numpy** 
자료형이 같아야 된다.
배열을 이용한 데이터 처리
객체이므로 객체 주소만 참조


---
|구분	|   numpy	|pandas         |
|---    |---        |---            |	
|행	    |   벡터s	|각 데이터(관측치)|
|열	    |스칼라(값)s|데이터의 속성(차원)
|가로(axis=0)	|2차원이 넘아가면 <br>가로 세로 개념이 아니라 <br>axis=0 ~ n 의 n차원. 개념적으로 인식할 수 밖에 없다	|모든 데이터 개체
|세로(axis=1)	|           |데이터 차원 
|       |인덱스로 값을 찾는다. | 인덱스가 아닌 행,열 이름으로 값을 찾는다.
|       |1,2 차원              | 2차원 형태의 데이터를 다룬다
|       |데이터 타입 : 숫자     | 다양한 데이터 타입
---


## 결론
숫자만 쓸거면 Numpy
다양한 자료형을 다룬다면 pandas

 머신러닝, 딥러닝에서는 numpy로 분석해야 연산의 속도가 빨라지기 때문에 pandas로 기본 분석을 수행한 후 넘파이로 변환하여 머신러닝이나 딥러닝을 수행한다. 반면에 numpy는 데이터를 눈으로 확인하기 어려워 pandas로 변환하여 데이터를 확인한다.

 

참고
https://challenge.tistory.com/32
https://super-master.tistory.com/m/72
전환 : https://sunning-10.tistory.com/m/entry/python-%ED%8C%8C%EC%9D%B4%EC%8D%AC-pandas-%ED%8C%90%EB%8B%A4%EC%8A%A4-pandas%EC%99%80-numpy-%EC%A0%84%ED%99%98