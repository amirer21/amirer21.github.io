---
title: 알고리즘 02 - (용어 01) 알고리즘 문제에서 자주 나오는 용어 정리
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Algorithm
tags:
- Algorithm
- 
- 
toc: true
toc_sticky: true
toc_label: 목차
description: 알고리즘 문제 - 알고리즘 문제에서 자주 나오는 용어 정리
article_tag1: Algorithm
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Algorithm, 
last_modified_at: '2025-01-07 21:00:00 +0800'
---


### **알고리즘 문제에서 자주 나오는 용어 정리**

알고리즘 문제를 풀 때 자주 등장하는 용어들을 정리했습니다. 
각각의 개념과 함께 예시를 포함해 설명하니, 문제를 풀 때 참고하세요.

---

## **1. 보완값 (Complement)**

### **정의**
- 보완값은 특정 계산을 완성하기 위해 **필요한 값**을 말합니다.
- 보통 **목표값(Target)**에서 **현재 값(Current Value)**을 뺀 값으로 정의됩니다.

### **공식**
\[
\text{보완값 (Complement)} = \text{Target} - \text{Current Value}
\]

### **사용 사례**
- **Two Sum 문제**:
  - 배열에서 두 숫자의 합이 특정 목표값이 되는 인덱스를 찾는 문제에서 사용.
  - 딕셔너리를 사용하여 보완값을 저장하고 빠르게 찾음.

#### **예제**
```python
nums = [2, 7, 11, 15]
target = 9

# 보완값 계산 및 딕셔너리 사용
num_dict = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in num_dict:
        print([num_dict[complement], i])  # 출력: [0, 1]
    num_dict[num] = i
```

---

## **2. 시간 복잡도 (Time Complexity)**

### **정의**
- 알고리즘이 실행되는 데 걸리는 **시간**을 입력 크기 \( n \)에 따라 분석한 것.
- 입력 크기가 증가하면 알고리즘의 실행 시간이 어떻게 변하는지 표현.

### **종류**
1. **최선의 경우 시간 복잡도**: 가장 빠르게 실행될 때의 시간.
2. **평균 시간 복잡도**: 모든 경우의 평균.
3. **최악의 경우 시간 복잡도**: 가장 오래 걸리는 경우.

### **시간 복잡도의 예시**
- 배열 검색: \( O(n) \) (선형 탐색).
- 정렬: \( O(n \log n) \) (퀵 정렬).
- 탐색: \( O(\log n) \) (이진 탐색).

---

## **3. 빅오 표기법 (Big-O Notation)**

### **정의**
- 알고리즘의 **성능을 수학적으로 표현**한 표기법.
- 최악의 경우를 기준으로 입력 크기 \( n \)에 따라 성능을 표현.

### **주요 빅오 표기법**
| **표기법**     | **설명**                                   | **예제**                            |
|----------------|-------------------------------------------|-------------------------------------|
| \( O(1) \)     | 상수 시간: 입력 크기에 관계없이 일정 시간   | 배열에서 특정 인덱스 접근            |
| \( O(\log n) \)| 로그 시간: 입력 크기를 절반씩 줄이며 탐색    | 이진 탐색                            |
| \( O(n) \)     | 선형 시간: 입력 크기에 비례                 | 배열 전체 순회                       |
| \( O(n \log n) \)| 선형 로그 시간: 정렬 알고리즘에서 자주 등장 | 퀵 정렬, 병합 정렬                   |
| \( O(n^2) \)   | 제곱 시간: 중첩 반복문 사용                | 버블 정렬                            |
| \( O(2^n) \)   | 지수 시간: 모든 경우를 탐색                | 피보나치 수열 (재귀 구현)             |

---

## **4. 슬라이딩 윈도우 (Sliding Window)**

### **정의**
- 고정된 크기나 가변적인 범위의 **부분 배열**을 효율적으로 계산하는 알고리즘 기법.
- 범위를 이동하면서 필요한 데이터만 갱신.

### **사용 사례**
- 최대/최소 부분 배열 합 구하기.
- 문자열에서 특정 패턴 찾기.

#### **예제**
- 가장 긴 중복 없는 부분 문자열의 길이:
```python
s = "abcabcbb"
char_set = set()
max_length, left = 0, 0

for right in range(len(s)):
    while s[right] in char_set:
        char_set.remove(s[left])
        left += 1
    char_set.add(s[right])
    max_length = max(max_length, right - left + 1)

print(max_length)  # 출력: 3
```

---

## **5. 투 포인터 (Two Pointers)**

### **정의**
- 두 개의 포인터를 사용해 배열이나 리스트를 효율적으로 탐색.
- 보통 **정렬된 배열**에서 특정 조건을 만족하는 쌍이나 구간을 찾는 데 사용.

### **사용 사례**
- 정렬된 배열에서 합이 특정 값이 되는 두 수 찾기.
- 부분 배열의 최대/최소 합.

#### **예제**
- 두 수의 합 문제 (정렬된 배열):
```python
nums = [1, 2, 3, 4, 6]
target = 6
left, right = 0, len(nums) - 1

while left < right:
    s = nums[left] + nums[right]
    if s == target:
        print([left, right])  # 출력: [1, 3]
        break
    elif s < target:
        left += 1
    else:
        right -= 1
```

---

## **6. 그래프 탐색 (BFS/DFS)**

### **정의**
- 그래프 구조에서 데이터를 탐색하는 알고리즘.

1. **BFS (Breadth-First Search)**:
   - 너비 우선 탐색: 가까운 노드부터 탐색 (큐 사용).
   - 주로 최단 경로 문제에 사용.
2. **DFS (Depth-First Search)**:
   - 깊이 우선 탐색: 한 방향으로 끝까지 탐색 (스택/재귀 사용).
   - 모든 경로 탐색, 순열/조합 문제에 사용.

#### **예제**
- BFS:
```python
from collections import deque

graph = {1: [2, 3], 2: [4, 5], 3: [6], 4: [], 5: [], 6: []}
queue = deque([1])
visited = set()

while queue:
    node = queue.popleft()
    if node not in visited:
        visited.add(node)
        print(node, end=" ")
        queue.extend(graph[node])
# 출력: 1 2 3 4 5 6
```

---

## **7. 가지치기 (Pruning)**

### **정의**
- 백트래킹(Backtracking)에서 조건에 맞지 않는 경로를 **미리 제거**하여 탐색 범위를 줄이는 기법.

### **사용 사례**
- N-Queens 문제, 부분 집합 생성 등.

#### **예제**
- N-Queens 문제에서 같은 열/대각선에 퀸이 있는 경우 가지치기:
```python
def is_valid(board, row, col):
    for i in range(row):
        if board[i] == col or abs(board[i] - col) == abs(i - row):
            return False
    return True
```

---

## **8. 최적 부분 구조 (Optimal Substructure)**

### **정의**
- 문제의 최적해가 **작은 하위 문제의 최적해**로 구성되는 성질.
- 동적 프로그래밍(DP)에서 사용.

#### **예제**
- 피보나치 수열:
  \[
  F(n) = F(n-1) + F(n-2)
  \]

---

## **9. 메모이제이션 (Memoization)**

### **정의**
- 계산 결과를 저장하여 동일한 계산을 반복하지 않도록 최적화.
- 동적 프로그래밍의 핵심 기법.

#### **예제**
```python
def fibonacci(n, memo={}):
    if n <= 1:
        return n
    if n not in memo:
        memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]

print(fibonacci(10))  # 출력: 55
```

---