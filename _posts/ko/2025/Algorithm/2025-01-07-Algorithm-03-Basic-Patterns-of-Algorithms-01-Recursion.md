---
title: 알고리즘 03 - (기본 패턴 01) 유형 - 재귀(Recursion)란?
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Algorithm
tags:
- Algorithm
- Recursion
- 
toc: true
toc_sticky: true
toc_label: 목차
description: 기본 패턴 유형 정리, 재귀(Recursion)란?
article_tag1: Algorithm
article_tag2: Recursion
article_tag3: 
article_section: 
meta_keywords: Algorithm, Recursion
last_modified_at: '2025-01-07 21:00:00 +0800'
---


### **1. 재귀(Recursion)란?**

**재귀(Recursion)**란 함수가 자기 자신을 호출하여 문제를 해결하는 프로그래밍 기법입니다. 재귀는 **문제를 더 작고 간단한 하위 문제**로 나누어 반복적으로 해결하는 방식으로 작동합니다.

---

### **2. 재귀의 기본 구조**

재귀 함수는 일반적으로 다음 두 가지 요소로 구성됩니다:

#### 2.1 **기저 조건(Base Case)**
- 재귀 호출이 멈추는 조건입니다.
- 기저 조건을 만족하면 함수가 더 이상 자신을 호출하지 않고 값을 반환하거나 종료됩니다.

#### 2.2 **재귀 단계(Recursive Step)**
- 함수가 자신을 호출하여 문제를 더 작은 문제로 나누는 단계입니다.
- 문제를 해결하기 위해 함수가 반복적으로 자신을 호출합니다.

#### 예시: 팩토리얼 계산
```python
def factorial(n):
    if n == 0:  # 기저 조건
        return 1
    return n * factorial(n - 1)  # 재귀 단계
```

#### 실행 과정 (`factorial(4)` 호출):
1. `factorial(4)` → `4 * factorial(3)`
2. `factorial(3)` → `3 * factorial(2)`
3. `factorial(2)` → `2 * factorial(1)`
4. `factorial(1)` → `1 * factorial(0)`
5. `factorial(0)` → `1` (기저 조건에 도달)
6. 결과: `4 * 3 * 2 * 1 = 24`

---

### **3. 재귀의 장단점**

#### 3.1 **장점**
1. **문제의 간결한 표현**:
   - 복잡한 문제를 단순하고 직관적으로 표현할 수 있습니다.
   - 예: 트리 순회, 분할 정복, 백트래킹 등.

2. **재귀적 구조에 적합한 문제**:
   - 데이터 구조가 트리, 그래프, 또는 계층적인 경우 재귀가 직관적이고 효과적입니다.

#### 3.2 **단점**
1. **오버헤드**:
   - 각 함수 호출은 메모리에 스택 프레임(Stack Frame)을 생성합니다.
   - 깊은 재귀 호출이 많으면 스택 오버플로우(Stack Overflow) 발생 가능.

2. **비효율성**:
   - 동일한 계산을 반복할 경우, 불필요한 계산이 많아질 수 있습니다.
   - 예: 피보나치 수열 계산(메모이제이션으로 개선 가능).

---

### **4. 재귀와 반복의 비교**

| **특징**       | **재귀(Recursion)**                | **반복(Iteration)**                |
|-----------------|------------------------------------|------------------------------------|
| **직관성**     | 문제를 자연스럽게 표현 가능        | 비교적 덜 직관적                   |
| **성능**       | 스택 오버플로우 가능               | 메모리 효율적                      |
| **사용 예시**  | 트리 순회, 하노이 탑, 분할 정복    | 배열 탐색, 루프 기반 문제          |

---

### **5. 재귀 사용 예시**

#### 5.1 **피보나치 수열**
```python
def fibonacci(n):
    if n <= 1:  # 기저 조건
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)  # 재귀 단계
```

#### 5.2 **리스트의 합 구하기**
```python
def sum_list(arr):
    if not arr:  # 기저 조건 (리스트가 비어 있으면 0 반환)
        return 0
    return arr[0] + sum_list(arr[1:])  # 재귀 단계
```

#### 5.3 **트리 순회**
```python
class Node:
    def __init__(self, value):
        self.value = value
        self.left = None
        self.right = None

def inorder_traversal(node):
    if not node:  # 기저 조건 (노드가 없으면 종료)
        return
    inorder_traversal(node.left)  # 왼쪽 서브트리 방문
    print(node.value)             # 현재 노드 출력
    inorder_traversal(node.right) # 오른쪽 서브트리 방문
```

---

### **6. 재귀 최적화 방법**

#### 6.1 **메모이제이션(Memoization)**
- 이전에 계산한 결과를 저장하여 동일한 계산을 반복하지 않도록 합니다.
```python
cache = {}
def fibonacci(n):
    if n in cache:  # 캐시에서 결과를 가져옴
        return cache[n]
    if n <= 1:
        return n
    cache[n] = fibonacci(n - 1) + fibonacci(n - 2)
    return cache[n]
```

#### 6.2 **꼬리 재귀(Tail Recursion)**
- 재귀 호출이 함수의 마지막에만 이루어지는 경우 최적화 가능합니다.
```python
def factorial_tail(n, acc=1):
    if n == 0:
        return acc
    return factorial_tail(n - 1, acc * n)
```

#### 6.3 **반복문으로 변환**
- 재귀를 반복문으로 변환하여 스택 오버플로우를 방지합니다.
```python
def factorial_iterative(n):
    result = 1
    while n > 0:
        result *= n
        n -= 1
    return result
```

---

### **7. 재귀가 유용한 문제 유형**

1. **분할 정복**:
   - 예: 병합 정렬(Merge Sort), 이진 탐색(Binary Search).

2. **트리와 그래프 탐색**:
   - 예: DFS(깊이 우선 탐색).

3. **백트래킹**:
   - 예: N-Queens 문제, 미로 탐색.

4. **계층적 문제**:
   - 예: 하노이 탑 문제, 디렉토리 구조 탐색.

---

### **8. 사고력을 키우는 질문**

1. **재귀의 흐름 이해**:
   - 왜 `j`가 배열 끝에 도달했을 때 `i`를 증가시킬까?
   - 재귀 호출마다 `i`와 `j`는 어떻게 변하고 왜 그럴까?

2. **비효율성의 원인**:
   - 재귀 호출의 깊이가 증가하면 메모리 사용량이 늘어납니다. 이를 어떻게 개선할 수 있을까요?

3. **문제 확장**:
   - 동일한 숫자가 배열에 여러 번 존재한다면 결과는 어떻게 처리해야 할까요?

---

### **9. 결론**

- 재귀는 문제를 작게 나누어 반복적으로 해결하는 강력한 기법입니다.
- **장점**: 직관적이고 간단한 표현.
- **단점**: 비효율적 계산, 스택 오버플로우 가능성.
- 적절히 사용하지 않으면 성능 저하를 초래할 수 있으므로, 효율성과 최적화 기술을 고려하며 사용하는 것이 중요합니다.

---


