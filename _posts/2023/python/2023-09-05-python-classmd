---
title: Python - 클래스(Class)
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
description: type
article_tag1: python
article_tag2: class  
article_tag3: 
article_section: python
meta_keywords: python, class
last_modified_at: '2023-09-05 21:00:00 +0800'
---

# 클래스 정의
파이썬에서 클래스 정의, 상속하는 방법을 알아본다.
그리고 모듈(from, import)을 가져오는 방법을 알아본다.

 - 함수 : method, 동사
 - 변수 : 속성, attribute, member, 명사

```py
class FourCal:
    def setdata(self, first, second):
        self.first = first
        self.second = second
    
    def add(self):
        result = self.first + self.second
        return result
    
    def mul(self):
        result = self.first * self.second
        return result
    
    def sub(self):
        result = self.first - self.second
        return result
    
    def div(self):
        result = self.first / self.second
        return result
    
a = FourCal()
print(type(a))
a.setdata(4,2)
```

## 클래스 이름.함수(인자) vs 객체.함수(인자)
```py
four_cal = FourCal()
# 클래스 이름.함수(인자)로 호출하려면 self 인자(여기서는 FourCal()클래스의 객체 a)를 넣어줘야 한다.
FourCal.setdata(four_cal, 4, 2)

four_cal = FourCal()
#객체.함수(인자)로 호출면 생략 가능하다.
four_cal.setdata(4,2)
print(four_cal.add(), four_cal.mul(), four_cal.sub(), four_cal.div())
```

## 클래스 상속
클래스를 상속하면 그 클래스에서 구현한 함수를 그대로 사용할 수 있다.
파이썬에서는 클래스의 상속을 다음과 같이 표현한다.

> class 클래스 이름(상속할 클래스 이름)

```py
class MoreFourCal(FourCal):
    pass

b = MoreFourCal()
b.setdata(4,2)
print(b.add(), b.mul(), b.sub(), b.div())
```

## 모듈 가져오는 형식

파이썬에서는 모듈을 불러올때 다음과 같은 방식으로 불러온다.
- import 모듈이름
- import 모듈이름 as 별명
- from 모듈이름 import 모듈함수
- from 모듈이름 import 모듈함수 as 별명
- from 모듈이름 import *
- from 모듈이름 import 모듈함수1, 모듈함수2, 모듈함수3

```py
import mod1
print(mod1.add(3,4))

from mod1 import add
print(add(3,4))

from mod1 import *
print(add(3,4))
print(sub(3,4))
      
from mod1 import add, sub
print(add(3,4))
print(sub(3,4))
```