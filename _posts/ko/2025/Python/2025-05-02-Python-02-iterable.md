---
title: 파이썬 - 이터러블(iterable) 객체와 "__iter__" 완전 정복
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
- iterable
tags:
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: 파이썬 - 이터러블(iterable) 객체와 "__iter__" 완전 정복
article_tag1: Python
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Python, iterable
last_modified_at: '2025-05-02 21:00:00 +0800'
---


# 파이썬 이터러블(iterable) 객체와 `__iter__` 완전 정복

프로그래밍을 하다 보면 `for` 문이나 `in` 연산자를 자주 사용하게 된다. 그런데 이게 작동하는 핵심 원리가 바로 \*\*이터러블(iterable)\*\*이다. 파이썬은 반복을 매우 강력하고 유연하게 지원하는 언어이고, 그 중심에 있는 개념이 `이터러블`과 `__iter__` 메서드다.

이 글에서는 `이터러블 객체`가 무엇인지, `__iter__`는 어떤 역할을 하는지 개념부터 예제까지 정리해본다.

---

## 1. 이터러블 객체란?

\*\*이터러블(iterable)\*\*은 말 그대로 **반복할 수 있는 객체**를 뜻한다.
즉, `for` 문으로 순회할 수 있는 객체는 모두 iterable이다.

### 대표적인 이터러블 예시:

```python
[1, 2, 3]       # 리스트
"hello"         # 문자열
(1, 2, 3)       # 튜플
{"a": 1}        # 딕셔너리
{1, 2, 3}       # 집합
```

이런 객체들은 내부적으로 `__iter__()`라는 메서드를 가지고 있어, 반복 가능한 객체가 된다.

---

## 2. 반복의 실제 동작 원리

```python
for x in [1, 2, 3]:
    print(x)
```

이 코드는 내부적으로 다음과 같이 동작한다:

```python
it = iter([1, 2, 3])  # 리스트의 __iter__() 호출 → 반복자(iterator) 반환
print(next(it))       # 1
print(next(it))       # 2
print(next(it))       # 3
```

즉, `iter()` 함수는 `__iter__()` 메서드를 호출하고,
`next()` 함수는 `__next__()` 메서드를 호출해서 값을 하나씩 꺼내는 것이다.

---

## 3. iterable vs iterator

| 구분     | iterable (이터러블)  | iterator (이터레이터)           |
| ------ | ---------------- | -------------------------- |
| 정의     | 반복 가능한 객체        | `next()`로 값을 하나씩 꺼낼 수 있음   |
| 필수 메서드 | `__iter__()`     | `__iter__()`, `__next__()` |
| 예시     | 리스트, 문자열, 딕셔너리 등 | `iter(리스트)`, `iter(문자열)` 등 |

이터러블은 **반복자를 생성할 수 있는 객체**,
이터레이터는 **직접 next()를 호출해 값을 꺼내는 객체**라고 이해하면 된다.

---

## 4. `__iter__()` 메서드란?

`__iter__()`는 이터러블 객체가 \*\*반복자(iterator)\*\*를 반환하는 메서드다.
이 메서드는 `for`문이나 `iter()` 함수가 호출될 때 자동으로 실행된다.

---

## 5. 커스텀 이터러블 객체 만들기

직접 `__iter__`와 `__next__`를 구현해서 반복 가능한 객체를 만들 수 있다.

```python
class MyRange:
    def __init__(self, start, end):
        self.current = start
        self.end = end

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.end:
            raise StopIteration
        val = self.current
        self.current += 1
        return val

for i in MyRange(1, 4):
    print(i)
```

출력:

```
1
2
3
```

---

## 6. 이터러블인지 확인하는 방법

```python
from collections.abc import Iterable

print(isinstance([1, 2, 3], Iterable))  # True
print(isinstance(123, Iterable))        # False
```

`collections.abc.Iterable` 클래스를 사용하면 어떤 객체가 이터러블인지 확인할 수 있다.

---

## 마무리 정리

* **이터러블**: `__iter__()` 메서드를 가진, 반복 가능한 객체
* **이터레이터**: `__iter__()`와 `__next__()`를 모두 가진 객체
* `for`, `in`, `next()` 같은 문법은 내부적으로 이 메서드들을 호출해 동작한다
* 파이썬은 반복 구조가 유연하고 강력하며, 커스텀 객체도 쉽게 이터러블로 만들 수 있다

