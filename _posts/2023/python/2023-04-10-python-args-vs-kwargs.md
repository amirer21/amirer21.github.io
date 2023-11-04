---
title: Python python *args와 **kwargs 차이
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
description: Python *args와 **kwargs 차이
article_tag1: python
article_tag2: args와
article_tag3: kwargs
article_section: python *args와 **kwargs 차이
meta_keywords: python, args와, kwargs
last_modified_at: '2023-04-10 21:00:00 +0800'
---
① ② *Python* 

# Python *args와 **kwargs 차이





파이썬에너 *(asterisk)는 여러 개의 인자를 함수로 전달하거나 키워드를 전달할 때 쓰인다.

### 형식

> *변수명 , **변수명
관례상 args라는 단어와 함께 자주 사용

#

***args** 
*args 는 튜플 형태의 여러개의 파라미터를 전달할때 사용됩니다.
(튜플은 소괄호로 묶어서 표현하거나 ,(쉼표)를 이용해서 표현)
> t1 = () <br>
> t2 = (1,) <br>
> t3 = (1, 2, 3)

```python
argsFunc('1','2','3','4')

def argFuc(*args):
    for value in args:
        print value
```

#

****kwargs** 
 **kwargs 는 dictionary 형태의 값을 전달할 때 사용
(파이썬에서 딕셔너리(dictionary)란 사전형 데이터를 의미하며, key와 value를 1대1로 대응시킨 형태)

(키워드 = 특정 값으로 입력) 
>{Key1:Value1, Key2:Value2, Key3:Value3, ...}

*args에서 더 나아가 입력값의 키워드를 함께 줄 때 사용합니다.

```python
def kwargsFunc(**kwargs):
    result = ""
    # Iterating over the Python kwargs dictionary
    for arg in kwargs.values():
        result += arg
    return result

print(kwargsFunc(a="python", b="is", c="amazing"))
```


순서

> *args > **kwargs

---
|구분	|   *args	| ** kwargs         |
|---    |---        |---            |	
|인자 형식	    |   key와 value 제외한 형식 |key와 value 형식|
|열	    |스칼라(값)s|데이터의 속성(차원)
|가로(axis=0)	|2차원이 넘아가면 <br>가로 세로 개념이 아니라 <br>axis=0 ~ n 의 n차원. 개념적으로 인식할 수 밖에 없다	|모든 데이터 개체
|세로(axis=1)	|           |데이터 차원 
|       |인덱스로 값을 찾는다. | 인덱스가 아닌 행,열 이름으로 값을 찾는다.
|       |1,2 차원              | 2차원 형태의 데이터를 다룬다
|       |데이터 타입 : 숫자     | 다양한 데이터 타입
---


 
#

참고
튜플 vs 딕셔너리 : https://bbuljj.tistory.com/162
튜플 : https://wikidocs.net/15
딕셔너리 : https://wikidocs.net/16
예제 : https://realpython.com/python-kwargs-and-args/

#