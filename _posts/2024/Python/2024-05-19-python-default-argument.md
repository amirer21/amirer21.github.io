---
title: Python - 기본 인수(Default argument) 란? 사용 시 주요할 점은?
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- Language
toc: true
toc_sticky: true
toc_label: 목차
description: Python Default argument (기본 인자) 정의와 주의할 사항
article_tag1: python
article_tag2: laguage
article_tag3: argument
article_section: python
meta_keywords: python, laguage, argument
last_modified_at: '2024-05-19 21:00:00 +0800'
---

# 기본 인수란 무엇인가?

파이썬에서 함수 정의 시 인수에 기본값을 제공할 수 있습니다. 이러한 인수를 기본 인수(default argument)라고 합니다. 기본 인수는 함수 호출 시 해당 인수가 제공되지 않을 때 사용됩니다.

## 동작 방식

기본 인수는 함수 정의 시 한 번만 평가되고, 이후 함수가 호출될 때마다 그 값이 재사용됩니다. 이는 모든 함수 호출이 동일한 기본 인수 객체를 공유한다는 의미입니다. 기본 인수는 가변 객체(mutable objects, 예: 리스트, 딕셔너리 등)를 포함하여 어떤 객체든 될 수 있습니다.

###코드 예제

```python
def greet(name, greeting="Hello"):
    return f"{greeting}, {name}!"

print(greet("Alice"))      # Hello, Alice!
print(greet("Bob", "Hi"))  # Hi, Bob!
```

위 예제에서 greeting은 기본 인수로 설정되어 있습니다. 함수 호출 시 greeting 인수를 제공하지 않으면 기본값 "Hello"가 사용됩니다.

## 문제점

기본 인수로 가변 객체를 사용하면 예상치 못한 동작이 발생할 수 있습니다. 함수가 정의될 때 한 번만 평가되기 때문에, 함수가 호출될 때마다 동일한 객체가 사용됩니다. 이를 예시로 살펴보겠습니다.

### 문제 코드

```python
def add_to_list(value, my_list=[]):
    my_list.append(value)
    return my_list

print(add_to_list(1))  # [1]
print(add_to_list(2))  # [1, 2]
print(add_to_list(3))  # [1, 2, 3]
```

위 예제에서 my_list는 기본 인수로 설정된 가변 객체입니다. 함수가 호출될 때마다 동일한 리스트 객체가 사용되므로, 모든 호출이 동일한 리스트를 공유하게 됩니다.

## 해결 방법

이 문제를 해결하려면 기본값으로 None을 사용하고, 함수 내부에서 새로운 객체를 생성하는 방식을 사용해야 합니다. 이렇게 하면 함수 호출 시마다 새로운 객체가 생성되므로, 호출 간에 객체가 공유되지 않습니다.

### 해결 코드

```python
def add_to_list(value, my_list=None):
    if my_list is None:
        my_list = []
    my_list.append(value)
    return my_list

print(add_to_list(1))  # [1]
print(add_to_list(2))  # [2]
print(add_to_list(3))  # [3]
```

## 결론

파이썬에서 기본 인수는 함수 정의 시 한 번만 평가되고, 이후 함수 호출 시마다 재사용됩니다. 이로 인해 가변 객체를 기본 인수로 사용할 때 예기치 않은 동작이 발생할 수 있습니다. 이러한 문제를 피하려면 기본값으로 None을 사용하고, 함수 내부에서 필요한 객체를 생성하는 패턴을 사용하는 것이 좋습니다.