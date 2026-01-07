---
title: Python - 2차원 리스트 생성 방식과 차이점 정리
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
description: Python - 2차원 리스트 생성 방식과 차이점 정리
article_tag1: Python
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Python
last_modified_at: '2026-01-07 21:00:00 +0800'
---


# 파이썬 2차원 리스트 생성 방식과 차이점 정리

## 1. 문제 배경

파이썬에서 2차원 리스트(배열)를 만들 때,
겉보기에는 동일해 보이는 코드라도 **내부 메모리 구조가 완전히 달라질 수 있습니다**.

이 차이를 이해하지 못하면 다음과 같은 문제가 발생합니다.

* BFS/DFS에서 `visited` 배열이 비정상적으로 동작
* 한 칸만 수정했는데 여러 행이 동시에 바뀜
* 원인을 찾기 어려운 논리 오류 발생

---

## 2. 실험 코드

아래는 **2차원 리스트를 만드는 대표적인 3가지 방법**입니다.

```python
N = 3
M = 4

# 방법 A: for문 + append
a = []
for _ in range(N):
    row = [False] * M
    a.append(row)

# 방법 B: 리스트 컴프리헨션
b = [[False] * M for _ in range(N)]

# 방법 C: 곱셈(*) 사용
c = [[False] * M] * N

print("초기 a:", a)
print("초기 b:", b)
print("초기 c:", c)

print("\n--- 한 칸 수정: [0][0] = True ---")
a[0][0] = True
b[0][0] = True
c[0][0] = True

print("수정 후 a:", a)
print("수정 후 b:", b)
print("수정 후 c:", c)
```

---

## 3. 초기 출력 결과 (왜 다 똑같아 보이는가?)

```text
초기 a: [[False, False, False, False], [False, False, False, False], [False, False, False, False]]
초기 b: [[False, False, False, False], [False, False, False, False], [False, False, False, False]]
초기 c: [[False, False, False, False], [False, False, False, False], [False, False, False, False]]
```

### 설명

* 세 방식 모두 **초기 값(value)** 만 보면 동일
* 이 시점에서는 **차이가 드러나지 않는 것이 정상**
* 문제는 **수정(mutation)** 이 발생할 때 나타남

---

## 4. 수정 후 결과 비교 (핵심 차이 발생)

```text
수정 후 a: [[True, False, False, False], [False, False, False, False], [False, False, False, False]]
수정 후 b: [[True, False, False, False], [False, False, False, False], [False, False, False, False]]
수정 후 c: [[True, False, False, False], [True, False, False, False], [True, False, False, False]]
```

---

## 5. 각 방식의 내부 동작 원리

### 5.1 방법 A – for문 + append (정상)

```python
a = []
for _ in range(N):
    row = [False] * M   # 매번 새로운 리스트 생성
    a.append(row)
```

#### 구조 개념

* 각 `row`는 **서로 다른 리스트 객체**
* 행 간 **메모리 공유 없음**

-  안전
-  직관적
-  BFS/DFS 사용 가능

---

### 5.2 방법 B – 리스트 컴프리헨션 (정상, 권장)

```python
b = [[False] * M for _ in range(N)]
```

#### 내부적으로는 다음과 동일

```python
b = []
for _ in range(N):
    b.append([False] * M)
```

#### 구조 개념

* 반복마다 **새 리스트 생성**
* 모든 행이 **독립적인 객체**

가장 많이 쓰는 방식
- 가독성 좋음
- 코딩 테스트 표준 방식

---

### 5.3 방법 C – 곱셈(`* N`) 방식 (문제 발생)

```python
c = [[False] * M] * N
```

#### 실제 동작 방식

```python
row = [False] * M
c = [row, row, row]   # 같은 리스트를 N번 참조
```

#### 구조 개념

* 모든 행이 **같은 리스트 객체를 공유**
* 한 칸 수정 → 모든 행에 동시에 반영

BFS/DFS에서 사용 금지
visited 배열로 절대 사용하면 안 됨

---

## 6. 차이를 표로 정리

| 구분         | 방법 A (append) | 방법 B (컴프리헨션) | 방법 C (`* N`) |
| ---------- | ------------- | ------------ | ------------ |
| 초기 출력      | 동일            | 동일           | 동일           |
| 행 객체       | 서로 다름         | 서로 다름        | 모두 동일        |
| 메모리 공유     | 없음            | 없음           | 있음           |
| 한 칸 수정 영향  | 해당 행만         | 해당 행만        | 모든 행         |
| BFS/DFS 사용 | 가능            | 가능 (권장)      | ❌ 불가         |

---

## 7. 왜 이런 문제가 중요한가?

### BFS/DFS에서 흔히 사용하는 코드

```python
visited[nr][nc] = True
```

* `visited` 행이 공유된 상태라면

  * **의도하지 않은 위치까지 방문 처리**
  * 탐색 경로 왜곡
  * 정답 불일치 발생

겉보기엔 정상인데, 결과만 틀리는 **가장 위험한 버그 유형**

---

## 8. 실무·코딩테스트 암기 문장

> **2차원 리스트는 반드시 컴프리헨션으로 생성한다.**
> `[[x]*M]*N` 은 값은 같아 보여도 구조가 다르다.

---

## 9. 권장 패턴 정리

```python
# 2차원 boolean 배열
visited = [[False] * M for _ in range(N)]

# 2차원 거리 배열
dist = [[-1] * M for _ in range(N)]
```

---

## 10. 핵심 요약

* 출력 결과만 보고 구조를 판단하면 안 된다
* 차이는 **“수정 시점”** 에 나타난다
* `* N` 은 값 복사가 아니라 **참조 복사**
* BFS/DFS, DP, 그래프 문제에서는 **컴프리헨션이 표준**
