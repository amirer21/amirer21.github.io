---
title: Python - args, kwargs 이해하기(가변인자란?)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- args
- kwargs
toc: true
toc_sticky: true
toc_label: 목차
description: args
article_tag1: python
article_tag2: args
article_tag3: kwargs
article_section: args
meta_keywords: python, args, kwargs
last_modified_at: '2023-08-11 21:00:00 +0800'
---

## 파이썬 args, kwargs 이해하기(가변인자란?)
*args, **kwargs는 함수에 가변 개수의 인수를 전달하는 데 사용되는 Python의 특수 구문이다. 임의의 여러 개의 위치 및 키워드 인수를 허용할 수 있다.

### *args: 
 이 표기법을 사용하면 가변 개수의 위치 인수를 함수에 전달할 수 있다. arguments의 줄임말이다. *args은 튜플로 함수에 전달된 추가 위치 인수를 전달한다.

### **kwargs: 
 이 표기법을 사용하면 가변 개수의 키워드 인수를 함수에 전달할 수 있다. "kwargs"라는 용어는 "keyword arguments"의 줄임말이다. 구문 은 **kwargs함수에 사전으로 전달된 추가 키워드 인수를 전달한다.


### 사용 예시
다음은 *args 와 **kwargs. 사용법을 보여주는 예시이다.


```py
def example_function(arg1, *args, kwarg1=None, **kwargs):
    print("arg1:", arg1)
    print("args:", args)
    print("kwarg1:", kwarg1)
    print("kwargs:", kwargs)

example_function(1, 2, 3, kwarg1=4, kwarg2=5)
```

### 출력 결과
```
arg1: 1
args: (2, 3)
kwarg1: 4
kwargs: {'kwarg2': 5}
```

### 예제 설명

1. arg1 : 정규 위치 인수(regular positional argument)이다.
2. *args : 이후의 추가 위치 인수를 전달 받으면 arg1튜플에 저장한다.
3. kwarg1 : 기본값이 있는 키워드 인수이다.
4. **kwargs : 함수 서명에 명시적으로 언급되지 않은 추가 키워드 인수를 전달받아 사전에 저장한다.

(*args, **kwargs를 설명하때 영어에서 capture(캡쳐) 한다는 표현이 사용되고 있다. 전달받은 인수를 분류하여 알맞게 조정한다는 의미로 해석된다.)

*args는 추가 위치 인수를 캡처하는 데 사용되며 **kwargs는 추가 키워드 인수를 캡처하는 데 사용된다. 파이썬에서는 이렇게 서로 다른 개수의 인수를 처리해야 하는 함수를 정의할 때 유연성을 제공한다.


#### 참고

*args와 **kwars에서 *, ** 다음에 이름은 관습적으로 쓰일 뿐이며, 고정되어 있는 예약 키워드는 아니다.

```py
def example_function(arg1, *some_name_args, kwarg1=None, **some_name_kwargs):
    print("arg1:", arg1)
    print("args:", some_name_args)
    print("kwarg1:", kwarg1)
    print("kwargs:", some_name_kwargs)

example_function(1, 2, 3, kwarg1=4, kwarg2=5)
```

### asterisk * & double asterisk **
Python에서 별표 *와 이중 별표는 **특정 컨텍스트에서 사용될 때 특정한 의미를 갖는다.

#### *(별표) - Iterables 및 가변 길이 인수 목록의 패킹 풀기:

*iterable(예: 리스트, 튜플)에서 요소를 패킹 해제하고 별도의 인수로 함수에 전달하는 데 사용된다.
함수 정의에서 *args추가 위치 인수를 튜플로 수집한다.

#### **(이중 별표) - 사전(Dictionaries) 및 키워드 인수의 패킹 풀기:

**사전에서 키-값 쌍의 패킹을 해제하고 별도의 키워드 인수로 함수에 전달하는 데 사용된다.
함수 정의에서 **kwargs추가 키워드 인수를 사전으로 수집한다.


### 용도 요약

#### * (별표)

(1) 패킹 해제(Unpacking) : *iterable함수 호출 또는 할당을 위해 iterable(예: 목록, 튜플)의 요소를 패킹 해제한다.

(2) 기능 정의: *args추가 위치 인수를 튜플로 수집한다.

#### ** (이중 별표)

(1) 패킹 해제(Unpacking) : **dictionary함수 호출에 대한 사전의 키-값 쌍을 패킹 해제한다.

(2) 기능 정의: **kwargs추가 키워드 인수를 사전으로 수집한다.

```py
# Unpacking
numbers = [1, 2, 3]
print(*numbers)  # Unpacks and prints: 1 2 3

data = {'x': 10, 'y': 20}
print(**data)  # Raises an error, ** used with dictionaries is typically for function calls

# Function Definitions
def example_function(arg1, *args, kwarg1=None, **kwargs):
    pass

# Function Calls
example_function(1, 2, 3, kwarg1=4, kwarg2=5)
```