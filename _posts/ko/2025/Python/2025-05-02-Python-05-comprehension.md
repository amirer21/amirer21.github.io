---
title: 파이썬 - 파이썬답게 코딩하기 – comprehension 문법 완전 정복
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
description: 파이썬 - 파이썬답게 코딩하기 – comprehension 문법 완전 정복
article_tag1: Python
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Python, Generator
last_modified_at: '2025-05-02 21:00:00 +0800'
---


파이썬을 배우다 보면 아래와 같은 문법을 자주 접하게 된다.

```python
squares = [x * x for x in range(10)]
```

처음 보면 낯설 수 있지만, 이게 바로 **comprehension(컴프리헨션)** 문법이다.
코드를 더 짧고 명확하게 만들어주는 이 문법은 **파이썬스러운(Pythonic)** 스타일의 대표적인 예다.
이 글에서는 comprehension의 개념부터 다양한 형태, 장단점, 활용 방법까지 정리해본다.

---

## 목차

1. comprehension이란?
2. 왜 사용할까?
3. 리스트 컴프리헨션
4. 조건이 포함된 컴프리헨션
5. 딕셔너리 컴프리헨션
6. 집합 컴프리헨션
7. 제너레이터 표현식
8. 일반 for문과의 비교
9. 언제 사용하고 언제 피해야 할까?
10. 마무리 정리

---

## 1. comprehension이란?

comprehension은 **반복 가능한 객체를 기반으로 리스트, 딕셔너리, 집합 등의 컬렉션을 간결하게 생성하는 문법**이다.
복잡한 반복문과 조건문을 한 줄로 표현할 수 있어 **가독성과 생산성**을 크게 높여준다.

영어 단어 *comprehension*은 '이해', '포괄', '포함'이라는 뜻을 가지며,
파이썬에서는 **값들을 포괄적으로 모아서 표현하는 문법**이라는 의미로 쓰인다.

---

## 2. 왜 사용할까?

| 장점      | 설명                          |
| ------- | --------------------------- |
| 코드 간결화  | for문 + 조건문을 한 줄로 표현 가능      |
| 가독성 향상  | 반복과 필터링을 명확하게 표현            |
| 성능 향상   | 일반 for문보다 내부 최적화로 빠른 경우도 많음 |
| 파이썬 스타일 | Pythonic한 코드 작성법으로 권장됨      |

---

## 3. 리스트 컴프리헨션

리스트를 생성하는 가장 기본적인 형태의 comprehension이다.

```python
squares = [x * x for x in range(5)]
print(squares)  # [0, 1, 4, 9, 16]
```

---

## 4. 조건이 포함된 컴프리헨션

`if` 조건문을 함께 사용하여 원하는 값만 필터링할 수 있다.

```python
even = [x for x in range(10) if x % 2 == 0]
print(even)  # [0, 2, 4, 6, 8]
```

---

## 5. 딕셔너리 컴프리헨션

키와 값을 지정하여 딕셔너리를 생성할 수 있다.

```python
squared_map = {x: x * x for x in range(5)}
print(squared_map)  # {0: 0, 1: 1, 2: 4, 3: 9, 4: 16}
```

---

## 6. 집합 컴프리헨션

중복을 제거한 값들로 구성된 집합을 생성할 수 있다.

```python
unique_chars = {char for char in "banana"}
print(unique_chars)  # {'b', 'a', 'n'}
```

---

## 7. 제너레이터 표현식

리스트 컴프리헨션과 유사하지만 `[]` 대신 `()`를 사용하여 **lazy evaluation** 방식으로 값을 생성한다.

```python
gen = (x * x for x in range(3))
print(next(gen))  # 0
print(next(gen))  # 1
```

---

## 8. 일반 for문과의 비교

```python
# 일반 for문
result = []
for x in range(10):
    if x % 2 == 0:
        result.append(x * x)

# 리스트 컴프리헨션
result = [x * x for x in range(10) if x % 2 == 0]
```

→ 동일한 결과를 훨씬 간결하게 작성할 수 있다.

---

## 9. 언제 사용하고 언제 피해야 할까?

| 사용이 적합한 경우       | 사용을 피해야 할 경우          |
| ---------------- | --------------------- |
| 짧고 단순한 조건/반복일 때  | 중첩된 조건이 많아 가독성이 떨어질 때 |
| 리스트/딕셔너리 초기화 시   | 사이드 이펙트(부작용)가 많은 경우   |
| 필터링이나 변환이 필요한 경우 | 복잡한 로직을 포함할 경우        |

---

## 10. 마무리 정리

* **comprehension은 파이썬답게 코딩하는 대표적인 기술**이다.
* 리스트, 딕셔너리, 집합, 제너레이터 등 다양한 형태로 활용할 수 있다.
* 코드의 **간결성, 가독성, 성능**까지 고려한 실용적인 문법이다.
* 하지만 과도하게 복잡한 표현은 오히려 **가독성을 해칠 수 있으므로 주의**해야 한다.

---

이제부터는 단순한 for문 대신, comprehension을 활용해 더 파이썬다운 코드를 작성해보자.
실무에서도 아주 자주 쓰이므로 반드시 익혀두는 것이 좋다.