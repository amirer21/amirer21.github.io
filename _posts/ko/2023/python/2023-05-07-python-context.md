---
title: Python - context manager 란?
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
description: context manager 란?
article_tag1: python
article_tag2: context
article_tag3: contextmanager
article_section: python
meta_keywords: python, context, contextmanager
last_modified_at: '2023-05-07 21:00:00 +0800'
---

## context manager 란?

**context manager**가 무엇인지, 왜 사용하는지 알아보기 전에
**context**에 대해 정리하고 시작해본다.


--------------------------

### 1. **context** 란?

### (1) 사전적 정의

> the situation within which something exists or happens, and **that can help explain it**

(어떤 것이 존재하거나 발생 하고 **이를 설명하는 데 도움이 되는** 상황)

>the influences and events related to a particular event or situation:

(특정 사건 또는 상황 과 관련된 영향 및 사건)

(참고 : cambridge dictionary, 
https://dictionary.cambridge.org/ko/%EC%82%AC%EC%A0%84/%EC%98%81%EC%96%B4/context)

### (2) 의미

어떤 수행 작업(Task, Method 등)을 위해 필요한 정보 또는 어떤 객체를 핸들링하기 위해 접근하기 위한 수단의 의미를 가진다. 크게는 코드의 실행 환경을 의미한다.

### (3) 예시

> 예시 : 공항에서 수하물 찾기위해 제공하는 정보(신원, 비행정보, 수하물코드 정보)

> 필수 컨텍스트 - (신원, 비행정보, 수하물코드 정보)

> 선택적 컨텍스트 -  추가적인 정보 제공으로 검색 범위를 좁히는데 도움이 되는 정보 (캐리어 색상, 크기 등)

참고 : 
context - https://stackoverflow.com/questions/6145091/the-term-context-in-programming/28073970

------------------------

### 2. context manager(컨텍스트 관리자) 란?

컨텍스트 관리자는 명령문 내에서 실행되는 런타임 컨텍스트를 정의하는 개체

사용 목적 : 컨텍스트 관리자를 사용하면 리소스를 할당하고 해제할 수 있다. 파일 여는 기능인 open가 컨텍스트 관리자의 가장 좋은 예 중 하나이다.

#### (1) 사용 이유 (무엇을 위해서 사용하는 것일까?)

(예시)
> 파일을 열고 -> 어떤 작업을 수행하고 -> 종료

위와 같이 리소스를 관리할 목적으로 이 패턴으로 프로그래밍하게 된다.
특히, 예외가 발생되더라도 파일이 안전하게 종료될 수 있도록 finally 절을 통해서 파일 close()를 보장해야된다. 

만약 이런 경우가 여러 경우라면 일일히 코딩을 해주어야한다. 이를 더 간단하게 하기 위해 컨텍스트 관리자를 사용한다. 컨텍스트 관리자는 이러한 상황의 코드를 캡슐화하고 비즈니스 논리에서 분리하기 때문에 훨씬 더 깔끔하게해준다.


#### (2) context manager 사용 전

> try-except-finally

파일로 작업할 때 try-except-finally를 사용하여 예외가 있더라도 사용 후 파일 리소스가 닫히도록 한다. 

```python
f = None
try:
    f = open('sample.txt', 'r')
    doSomething = f.read()
    # doSomething : 특정 작업을 수행
except Exception as e:
    print(e)
finally:
    if f:
      f.close()
```

#### (3) context manager 사용 후

Python에서는 리소스를 관리하는 쉬운 방법인 컨텍스트 관리자를 제공한다.
컨텍스트 관리자의 예 중 하나는 with 이다.
아래와 같이 with 로 간단하게 표현할 수 있다.

```python
with open('sample.txt') as f:
    doSomething = f.read()
    # doSomething : 특정 작업을 수행 
```

#### (4) 수행 순서도 (python 호출 method)

![img](/assets/images/python/python_contextmanager.png "contextmanager")

----------------

참고 : 
context - https://stackoverflow.com/questions/6145091/the-term-context-in-programming/28073970

https://book.pythontips.com/en/latest/context_managers.html
https://www.geeksforgeeks.org/context-manager-in-python/
context manager 소개 - https://www.pythontutorial.net/advanced-python/python-context-managers/