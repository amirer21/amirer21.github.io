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
tags:
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

# pandas 란?

**pandas** 는 데이타 분석(Data Analysis)을 위해 널리 사용되는 파이썬 라이브러리 패키지이다. <br>

**테이블 형식의 데이터** DB처럼 테이블 형식의 데이터를 쉽게 처리할 수 있는 라이브러리이다. 데이터가 테이블 형식(DB Table, csv 등)으로 이루어진 경우가 많아 데이터 분석 시 자주 사용하게 될 Python 패키지이다.
<br>
<br>
# Install & import

pandas는 과학용 파이썬 배포판인 아나콘다(Anaconda)에 기본적으로 제공되지만, 

아나콘다를 사용하지 않을 경우에는 

> pip install pandas

를 통해 설치할 수 있다.

import를 할 때 pandas 라는 네임스페이스를 그대로 사용해도 되지만 pd 라는 축약된 이름을 관례적 사용한다.

>import pandas as pd

보통은 배열 구조나 랜덤 값 생성 등의 기능을 활용하기 위한 numpy 와 그래프를 그리기 위한 matplotlib 패키지들도 함께 import 한다.

>import numpy as np<br>
>import matplotlib.pyplot as plt

<br>
<br>


# 데이터 오브젝트 생성

데이터 오브젝트는 ‘데이터를 담고 있는 그릇’이다.
될 데이터 오브젝트는 Series 와 DataFrame 이 있다.

Series 는 1차원 배열, <br>
DataFrame 은 2차원 배열의 데이터를 담는다.

#

- 참고 : 
    - https://pandas.pydata.org/pandas-docs/stable/user_guide/10min.html
    - https://wikidocs.net/32829