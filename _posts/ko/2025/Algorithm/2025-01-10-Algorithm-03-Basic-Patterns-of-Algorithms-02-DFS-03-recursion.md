---
title: 알고리즘 03 - (기본 패턴 03) - (3) DFS(깊이 우선 탐색, Depth-First Search) - 재귀(Recursion)란?
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Algorithm
tags:
- Algorithm
- DFS
- Recursion
toc: true
toc_sticky: true
toc_label: 목차
description: 알고리즘 - DFS(깊이 우선 탐색, Depth-First Search) - 재귀(Recursion) 정리
article_tag1: Algorithm
article_tag2: DFS
article_tag3: Recursion
article_section: Algorithm
meta_keywords: Algorithm, DFS
last_modified_at: '2025-01-10 21:00:00 +0800'
---


### **알고리즘 문제로 재귀(Recursion)를 설명**

---

### **1. 재귀(Recursion)란?**

**재귀(Recursion)**는 **자기 자신을 호출하는 함수**를 말합니다.  
재귀는 문제를 **더 작은 하위 문제로 나누어 해결**하는 방식으로 동작합니다.

#### **재귀의 핵심 개념**
1. **기저 조건(Base Case)**
   - 재귀 호출이 멈추는 조건.
   - 문제가 더 이상 나눌 수 없을 때, 결과를 반환.
2. **재귀 호출(Recursive Call)**
   - 문제를 더 작은 부분으로 나누어 자신을 호출.

---

### **2. 재귀를 사용하는 이유**

- **문제를 분할**
  - 큰 문제를 더 작은 문제로 나누는 데 적합.
- **자연스러운 표현**
  - 예: 수학적 정의를 그대로 코드로 옮길 수 있음(피보나치, 팩토리얼 등).
- **데이터 구조 탐색**
  - 트리, 그래프 탐색에 유용.

---

### **3. 재귀의 구조**

#### **재귀 함수 구조**
```python
def recursive_function(parameters):
    # 1. 기저 조건
    if base_condition:
        return result

    # 2. 재귀 호출
    recursive_function(smaller_problem)
```

---

### **4. 재귀 알고리즘 문제**

#### **문제: 팩토리얼 계산**

팩토리얼 \( n! \)은 다음과 같이 정의됩니다:
\[
n! = n \times (n-1) \times (n-2) \times \dots \times 1
\]
- 예: \( 5! = 5 \times 4 \times 3 \times 2 \times 1 = 120 \)

#### **문제 풀이**
1. **기저 조건**: \( n = 0 \) 또는 \( n = 1 \)일 때 \( n! = 1 \).
2. **재귀 호출**: \( n! = n \times (n-1)! \).

---

#### **코드**
```python
def factorial(n):
    # 1. 기저 조건
    if n == 0 or n == 1:
        return 1

    # 2. 재귀 호출
    return n * factorial(n - 1)

# 테스트
print(factorial(5))  # 출력: 120
```

---

### **5. 재귀의 실행 과정 출력**

#### **입력: \( n = 5 \)**

```python
def factorial(n):
    print(f"Entering factorial({n})")
    if n == 0 or n == 1:
        print(f"Base case reached: factorial({n}) = 1")
        return 1

    result = n * factorial(n - 1)
    print(f"Returning: factorial({n}) = {result}")
    return result

# 테스트 실행
print(factorial(5))
```

#### **출력 결과**
```
Entering factorial(5)
Entering factorial(4)
Entering factorial(3)
Entering factorial(2)
Entering factorial(1)
Base case reached: factorial(1) = 1
Returning: factorial(2) = 2
Returning: factorial(3) = 6
Returning: factorial(4) = 24
Returning: factorial(5) = 120
120
```

---

### **6. 재귀 문제 해결의 핵심**

#### **1. 기저 조건 설정**
- 재귀가 무한히 호출되지 않도록 **멈추는 조건**을 명확히 정의.

#### **2. 문제를 더 작은 부분으로 나누기**
- \( n! = n \times (n-1)! \)와 같이 문제를 축소.

#### **3. 재귀 호출의 흐름 이해**
- 함수가 호출될 때마다 스택에 쌓이며, 기저 조건에 도달하면 스택이 하나씩 반환.

---

### **7. 스스로 사고하고 암기하기 쉽게 정리**

#### **핵심 아이디어**
1. "문제를 작게 쪼개서 나 자신에게 다시 맡긴다."
2. "내가 해결할 수 없는 경우(기저 조건)는 정답을 직접 반환한다."

#### **암기 문장**
- "기저 조건(Base Case)이 없으면 재귀는 끝나지 않는다!"
- "재귀는 문제를 작게 쪼개고, 결과를 쌓아서 반환한다."

---

### **8. 연습 문제**

#### **1. 피보나치 수열**
피보나치 수열은 다음과 같이 정의됩니다:
\[
F(0) = 0, \, F(1) = 1, \, F(n) = F(n-1) + F(n-2) \, (n \geq 2)
\]

```python
def fibonacci(n):
    if n == 0:
        return 0
    if n == 1:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 2)

# 테스트
print(fibonacci(5))  # 출력: 5
```

---

#### **2. 문자열 뒤집기**
```python
def reverse_string(s):
    if len(s) == 0:
        return ""
    return s[-1] + reverse_string(s[:-1])

# 테스트
print(reverse_string("hello"))  # 출력: "olleh"
```

---

#### **3. 이진 탐색**
```python
def binary_search(arr, target, left, right):
    if left > right:
        return -1

    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search(arr, target, mid + 1, right)
    else:
        return binary_search(arr, target, left, mid - 1)

# 테스트
arr = [1, 3, 5, 7, 9]
print(binary_search(arr, 7, 0, len(arr) - 1))  # 출력: 3
```

---

### **9. 재귀 vs 반복문**

| **특징**              | **재귀(Recursion)**                   | **반복문(Iteration)**                 |
|-----------------------|---------------------------------------|---------------------------------------|
| **문제 분할**          | 문제를 작은 문제로 나누어 해결         | 루프를 사용하여 반복적으로 해결        |
| **사용되는 자료구조**   | 함수 호출 스택(Stack)                 | 반복문의 내부 상태 변수                |
| **적합한 문제**        | 트리, 그래프 탐색 등 계층적 문제        | 반복적으로 해결 가능한 문제            |
| **코드 가독성**        | 수학적 정의를 코드로 표현하기 간단      | 구조적 사고에 적합                    |
| **속도/효율성**        | 함수 호출로 인해 오버헤드 발생 가능     | 더 빠르고 메모리 사용량 적음           |

---

### **10. 정리**

1. **재귀의 정의**:
   - 자기 자신을 호출하는 함수.
   - 기저 조건(Base Case)과 재귀 호출(Recursive Call)로 구성.

2. **적합한 문제**:
   - 팩토리얼, 피보나치, 문자열 뒤집기, 그래프 탐색(DFS), 이진 탐색 등.

3. **재귀를 쉽게 기억하는 방법**:
   - "작게 나누고, 끝에서부터 돌아온다."
   - 문제를 분할하고, 기저 조건에 도달했을 때 결과를 반환.