---
title: 파이썬 - generator?
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
description: 파이썬 - generator?
article_tag1: Python
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Python, Generator
last_modified_at: '2025-05-02 21:00:00 +0800'
---


\*\*파이썬의 제너레이터(generator)\*\*는 **반복 가능한 값을 하나씩 만들어내는 특별한 함수**입니다.
메모리를 아끼고, 실행 흐름을 일시 정지했다가 이어서 실행할 수 있는 아주 유용한 구조예요.

---

## 제너레이터란?

> **`yield` 키워드를 사용하여 값을 하나씩 생성하고, 함수 상태를 유지한 채 실행을 멈췄다가 다시 시작할 수 있는 함수**

* 일반 함수: `return`을 만나면 즉시 종료됨
* 제너레이터 함수: `yield`를 만나면 **값을 반환하고 중단**, 다시 호출되면 **중단 지점부터 이어서 실행**

---

## 제너레이터 함수 예제

```python
def my_gen():
    yield 1
    yield 2
    yield 3
```

사용:

```python
for val in my_gen():
    print(val)
```

출력:

```
1
2
3
```

→ `my_gen()`은 한 번에 값을 모두 반환하는 것이 아니라 **하나씩 차례로 생성**합니다.

---

## 제너레이터 vs 리스트 비교

| 항목       | 리스트         | 제너레이터                |
| -------- | ----------- | -------------------- |
| 메모리 사용   | 모든 값을 미리 저장 | 하나씩 생성 (메모리 효율 ↑)    |
| 반환 방법    | 한 번에 모든 값   | `yield`로 하나씩         |
| 반복 가능 여부 | ✅           | ✅ (`next()`로 하나씩 꺼냄) |
| 사용 예     | 고정된 데이터 집합  | 큰 데이터, 무한 반복 등       |

---

## `yield` 동작 이해

```python
def count_up_to(n):
    count = 1
    while count <= n:
        yield count
        count += 1

gen = count_up_to(3)
print(next(gen))  # 1
print(next(gen))  # 2
print(next(gen))  # 3
print(next(gen))  # StopIteration 예외 발생
```

---

## 제너레이터 표현식 (Generator Expression)

```python
gen = (x * x for x in range(5))
print(next(gen))  # 0
```

→ 리스트 컴프리헨션과 유사하지만 `()`를 사용하며, **lazy evaluation**으로 메모리를 덜 사용합니다.

---

## 언제 제너레이터를 사용할까?

* 매우 큰 데이터 집합을 처리할 때 (`파일 한 줄씩`, `무한 수열`, `API 스트리밍 등`)
* 반복하면서 **메모리 아끼고 싶을 때**
* 상태를 유지한 반복이 필요할 때

---

## 요약

| 개념    | 설명                                   |
| ----- | ------------------------------------ |
| 제너레이터 | `yield`를 사용해 값을 하나씩 반환하며 상태를 유지하는 함수 |
| 특징    | 메모리 효율적, 중단/재개 가능                    |
| 사용    | `for`, `next()`로 반복 가능               |

