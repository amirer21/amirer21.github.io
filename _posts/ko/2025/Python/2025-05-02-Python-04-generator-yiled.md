---
title: 파이썬 - yield 사용법 정리 — 제너레이터의 핵심
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
- Generator
tags:
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: 파이썬 - yield 사용법 정리 — 제너레이터의 핵심
article_tag1: Python
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Python, Generator
last_modified_at: '2025-05-02 21:00:00 +0800'
---


### 파이썬 `yield` 사용법 정리 — 제너레이터의 핵심

파이썬에서 반복 가능한 객체를 만들 때 꼭 클래스로 `__iter__`와 `__next__`를 구현하지 않아도 된다.
더 간단하고 우아한 방법이 있다. 바로 **`yield` 키워드를 사용하는 것**, 즉 \*\*제너레이터(generator)\*\*다.

---

## 1. `yield`란?

> `yield`는 함수의 실행을 \*\*중단(pause)\*\*하고,
> 현재 값을 **바깥에 반환**하면서도 **상태를 기억**하는 키워드이다.

`return`은 함수를 종료하지만,
`yield`는 **중간에 멈췄다가 다음 호출에서 이어서 실행된다.**

---

## 2. 기본 예제: 1부터 3까지 숫자 생성기

```python
def my_generator():
    yield 1
    yield 2
    yield 3
```

사용:

```python
for num in my_generator():
    print(num)
```

결과:

```
1
2
3
```

이 함수는 **리스트를 반환하지 않지만**, 반복 가능한 객체로 사용할 수 있다.

---

## 3. `yield` vs `return` 차이

| 구분    | `return`          | `yield`                        |
| ----- | ----------------- | ------------------------------ |
| 실행    | 함수 실행 후 **즉시 종료** | 값을 반환하고 **멈춘 상태 유지**           |
| 반복 여부 | 반복 불가능            | 반복 가능 (`for`, `next()`) 사용 가능  |
| 반환 타입 | 일반 값              | **제너레이터 객체(generator object)** |
| 상태 유지 | 불가능               | 가능 (다음 `yield` 지점부터 재개됨)       |

---

## 4. 실제 예제: 숫자 범위 생성기

```python
def my_range(start, end):
    current = start
    while current < end:
        yield current
        current += 1

for i in my_range(3, 6):
    print(i)
```

결과:

```
3
4
5
```

→ 마치 `range()` 함수처럼 동작하는 **간단한 반복기**를 직접 만든 것이다.

---

## 5. `yield` 함수는 어떤 객체를 반환하나?

```python
gen = my_range(1, 3)
print(gen)               # <generator object ...>
print(next(gen))         # 1
print(next(gen))         # 2
print(next(gen))         # StopIteration 예외 발생
```

`yield`가 있는 함수는 **제너레이터 객체**를 반환하며, `next()`로 하나씩 꺼낼 수 있다.

---

## 6. 장점

* 리스트처럼 **한꺼번에 메모리에 올릴 필요 없음** → 매우 **효율적**
* **무한 반복** 같은 구조도 쉽게 구현 가능
* `__iter__`, `__next__` 없이도 반복자 만들 수 있음

---

## 7. 실전 예: 파일 한 줄씩 처리

```python
def read_lines(filename):
    with open(filename, "r") as f:
        for line in f:
            yield line.strip()

for line in read_lines("data.txt"):
    print(line)
```

→ 파일을 **한 줄씩 읽으면서 처리**하므로 메모리 부담이 적다.

---

## 마무리 요약

* `yield`는 **상태를 기억하며 반복할 수 있는 함수**를 만든다.
* `yield` 함수는 일반 함수와 달리 **한 번에 종료되지 않음**.
* 반복 가능한 **제너레이터 객체**를 만들어, `for`, `next()`와 함께 사용됨.
* `yield`는 `__iter__`, `__next__` 없이도 반복자(iterator)를 쉽게 만들 수 있는 **파이썬스러운 방식**이다.
