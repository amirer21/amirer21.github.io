---
title: Python - 데코레이터 란? (+ args, kwargs)
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
description: decoration
article_tag1: python
article_tag2: decoration
article_tag3: args
article_section: drcoration
meta_keywords: python, decoration, args, kwargs
last_modified_at: '2023-08-11 21:00:00 +0800'
---

## 파이썬 데코레이터 란? (+ args, kwargs)

Python의 데코레이터는 코드를 변경하지 않고도 함수나 메서드의 동작을 수정하거나 확장할 수 있는 강력하고 유연한 기능이다. 함수와 메서드에 기능을 추가하는 모듈 방식을 제공한다. 데코레이터는 로깅, 인증 등과 같은 작업에 자주 사용된다. 

데코레이터는 다른 함수(또는 메서드)를 인수로 사용하고 원래 함수의 동작을 확장하거나 수정하는 새 함수(또는 메서드)를 반환하는 고차 함수이다. 

데코레이터는 "@" 기호 다음에 데코레이터 함수의 이름을 사용하여 적용되며 데코레이터할 함수 바로 위에 작성한다.

```
@my_decorator
def say_hello(name):
```


데코레이터의 기본 예는 다음과 같다.

### 예제

```py
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print("Arguments passed to the function:", args)
        print("Keyword arguments passed to the function:", kwargs)
        print("Something is happening before the function is called.")
        func(*args, **kwargs)
        print("Something is happening after the function is called.")
    return wrapper

@my_decorator
def say_hello(name):
    print(f"Hello, {name}!")

@my_decorator
def add_numbers(a, b):
    result = a + b
    print(f"The sum of {a} and {b} is {result}")

say_hello("Alice")
add_numbers(3, 5)

@my_decorator
def example_function(a, b, c=None, d=None):
    print("Inside example_function")
    print("a:", a)
    print("b:", b)
    print("c:", c)
    print("d:", d)

example_function(1, 2, c=3, d="test")

```

### 예제 설명

1. my_decorator함수를 func인수로 취하고 새 함수 wrapper()를 반환하는 데코레이터 함수를 정의한다.
2. wrapper() 함수 내부에서 func()를 호출하기 전과 후에 동작을 추가할 수 있습니다.
3. say_hello()에 @my_decorator syntax를 작성하면 my_decorator() 데코레이터가 이 함수에 적용된다.
4. say_hello()를 호출하면 데코레이터에 정의된 wrapper() 함수를 호출하고, 이 함수 안에서 다시 원래 함수 say_hello()를 호출한다.

