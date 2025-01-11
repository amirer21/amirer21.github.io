---
title: 알고리즘 03 - (기본 패턴 00) 유형
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
description: 기본 패턴 유형 정리
article_tag1: Algorithm
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Algorithm, 
last_modified_at: '2025-01-07 21:00:00 +0800'
---


### **기본 패턴**


알고리즘 문제를 해결할 때 자주 사용하는 **기본 패턴**을 익히는 것은 효율적인 문제 해결의 첫걸음입니다. 아래 패턴들을 반복적으로 연습하며 문제를 푸는 과정을 익히면 자연스럽게 더 어려운 문제도 해결할 수 있을 것 입니다.
각 패턴을 문제 유형과 함께 이해하고 스스로 사고하는 법과 암기 팁을 함께 작성해 보았습니다.

---

## **1. 브루트 포스 (Brute Force)**

### **설명**
- 가능한 모든 경우를 탐색하여 정답을 찾는 방식.
- 가장 단순하고 직관적이지만, 비효율적일 수 있음.

### **사용 사례**
- 작은 크기의 입력 데이터.
- 최적화가 필요 없는 경우.

### **예제: 두 수의 합**
배열에서 두 수의 합이 `target`인 경우를 찾으세요.
```python
nums = [2, 7, 11, 15]
target = 9

for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if nums[i] + nums[j] == target:
            print([i, j])  # 출력: [0, 1]
```

### **암기 팁**
"모든 경우를 **탐색**하고 조건을 만족하는 경우를 **확인**한다."

---

## **2. 슬라이딩 윈도우 (Sliding Window)**

### **설명**
- 배열이나 문자열에서 **연속된 부분 배열/문자열**을 처리할 때 효율적으로 사용하는 기법.
- 윈도우(구간)를 이동하면서 필요한 계산만 업데이트.

### **사용 사례**
- 고정 크기의 부분 배열 합/최댓값.
- 가변 크기의 조건을 만족하는 부분 배열.

### **예제: 고정 크기 부분 배열의 합**
배열에서 길이가 3인 부분 배열의 최대 합을 구하세요.
```python
nums = [1, 2, 3, 4, 5]
k = 3
window_sum = sum(nums[:k])
max_sum = window_sum

for i in range(k, len(nums)):
    window_sum += nums[i] - nums[i - k]
    max_sum = max(max_sum, window_sum)

print(max_sum)  # 출력: 12
```

### **암기 팁**
"창을 **이동**하며 이전 계산을 **재활용**한다."

---

## **3. 투 포인터 (Two Pointers)**

### **설명**
- 배열을 탐색할 때, 두 개의 포인터를 사용하여 효율적으로 문제를 해결.
- 보통 **정렬된 배열**에서 사용.

### **사용 사례**
- 두 수의 합, 부분 배열의 조건 만족 여부.

### **예제: 정렬된 배열에서 두 수의 합**
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

### **암기 팁**
"왼쪽과 오른쪽에서 **좁혀가며** 답을 찾는다."

---

## **4. 동적 프로그래밍 (Dynamic Programming, DP)**

### **설명**
- 큰 문제를 **작은 하위 문제**로 나누어 해결하고 결과를 **저장(메모이제이션)**하여 중복 계산을 방지.

### **사용 사례**
- 최적화 문제(최대/최소 값).
- 피보나치 수열, 배낭 문제, 문자열 비교.

### **예제: 피보나치 수열**
```python
def fibonacci(n):
    dp = [0] * (n + 1)
    dp[0], dp[1] = 0, 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

print(fibonacci(10))  # 출력: 55
```

### **암기 팁**
"문제를 **작게 쪼개고**, **저장**하며 결과를 **조합**한다."

---

## **5. 백트래킹 (Backtracking)**

### **설명**
- 가능한 모든 경우를 탐색하되 조건을 만족하지 않는 경로는 **가지치기**로 제외.
- DFS(깊이 우선 탐색) 기반.

### **사용 사례**
- 순열, 조합 생성.
- N-Queens 문제, 미로 탐색.

### **예제: 조합 생성**
```python
def combine(n, k):
    def backtrack(start, path):
        if len(path) == k:
            result.append(path[:])
            return
        for i in range(start, n + 1):
            path.append(i)
            backtrack(i + 1, path)
            path.pop()

    result = []
    backtrack(1, [])
    return result

print(combine(4, 2))  # 출력: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
```

### **암기 팁**
"모든 경우를 **탐색**하되 조건에 맞지 않으면 **돌아간다**."

---

## **6. 이분 탐색 (Binary Search)**

### **설명**
- 정렬된 데이터에서 특정 값을 빠르게 찾는 기법.
- 탐색 범위를 절반씩 줄여 \(O(\log n)\)의 시간 복잡도.

### **사용 사례**
- 특정 값 검색, 최적화 문제.

### **예제: 정렬된 배열에서 값 찾기**
```python
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

nums = [1, 2, 3, 4, 5]
print(binary_search(nums, 4))  # 출력: 3
```

### **암기 팁**
"정렬된 데이터를 **반으로 나누며** 찾는다."

---

## **7. 그리디 알고리즘 (Greedy Algorithm)**

### **설명**
- 매 순간 최적의 선택을 하여 문제를 해결.
- 항상 최적의 해를 보장하지는 않지만, 단순하고 빠름.

### **사용 사례**
- 최소 동전 문제, 활동 선택 문제.

### **예제: 최소 동전 문제**
```python
def min_coins(coins, amount):
    coins.sort(reverse=True)
    count = 0
    for coin in coins:
        if amount == 0:
            break
        count += amount // coin
        amount %= coin
    return count

print(min_coins([1, 5, 10, 25], 63))  # 출력: 6 (25+25+10+1+1+1)
```

### **암기 팁**
"**가장 좋은 선택**을 반복하며 답에 가까워진다."

---

### **8. 그래프 탐색 (BFS/DFS)**

### **설명**
- 그래프의 노드와 간선을 탐색하는 알고리즘.
- **BFS**: 가까운 노드부터 탐색 (큐 사용).
- **DFS**: 깊이 우선 탐색 (스택/재귀 사용).

### **사용 사례**
- 경로 탐색, 연결된 컴포넌트 찾기.

#### **예제: DFS**
```python
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    visited.add(start)
    print(start, end=" ")
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
dfs(graph, 1)  # 출력: 1 2 4 3 5
```

### **암기 팁**
- BFS: "넓게 탐색한다."
- DFS: "깊게 탐색한다."

---

### **스스로 사고하고 외우기**

1. **패턴화된 질문을 떠올리기**:
   - "이 문제는 연속된 구간인가?" → 슬라이딩 윈도우.
   - "조건을 만족하는 조합을 구해야 하는가?" → 백트래킹.
   - "최적의 값을 반복적으로 구할 수 있는가?" → 그리디.

2. **핵심 키워드로 외우기**:
   - 브루트 포스: "모두 탐색."
   - 슬라이딩 윈도우: "구간 이동."
   - 투 포인터: "양끝에서 좁혀간다."
   - DP: "작게 쪼개고 저장."
   - 백트래킹: "조건 만족 경로 탐색."

3. **문제를 손으로 풀어보며 연습**:
   - 간단한 입력으로 규칙을 발견하고 이를 코드로 구현해보세요.

---

