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


### 또다른 방법으로 풀어보기 : 재귀를 이용한 접근

반복문 없이 문제를 해결하려면, 문제의 크기를 줄이고 특정 인덱스를 직접 계산하여 접근해야 합니다. 이를 위해 **수학적인 접근** 또는 문제를 특정 조건으로 단순화하는 방식이 필요합니다. 아래는 반복문 없이 `two_sum` 문제를 해결하는 방법입니다.

---

### **풀이: 재귀를 이용한 접근**

재귀를 사용하여 반복문의 역할을 대체할 수 있습니다. 다음은 이를 구현한 코드입니다.

```python
def two_sum_recursive(nums, target, i=0, j=1):
    # 기저 조건: j가 배열 끝까지 가면 i를 증가시키고 j 초기화
    if i >= len(nums) - 1:
        return None  # 대상이 없으면 None 반환
    if j >= len(nums):
        return two_sum_recursive(nums, target, i + 1, i + 2)

    # 현재 숫자와 보완 숫자가 일치하면 결과 반환
    if nums[i] + nums[j] == target:
        return [i, j]

    # 다음 비교로 이동
    return two_sum_recursive(nums, target, i, j + 1)

# 테스트
nums = [2, 7, 11, 15]
target = 9
print(two_sum_recursive(nums, target))  # 출력: [0, 1]
```

---

### **코드 설명**

1. **재귀 파라미터**:
   - `i`: 첫 번째 숫자의 인덱스.
   - `j`: 두 번째 숫자의 인덱스 (`i`보다 항상 큼).

2. **기저 조건**:
   - `j`가 배열 끝에 도달했을 경우, `i`를 증가시키고 `j`를 초기화 (`i + 1`)로 이동.
   - `i`가 배열 끝에 도달하면 더 이상 비교할 필요가 없으므로 `None` 반환.

3. **조건 검사**:
   - `nums[i] + nums[j] == target`이면 `[i, j]` 반환.
   - 조건에 맞지 않으면 `j`를 증가시키며 다음 재귀 호출.

4. **결과 반환**:
   - 조건이 만족되면 인덱스를 반환.
   - 만족되지 않으면 다음 단계로 이동.

---

### **실행 과정 (`nums = [2, 7, 11, 15], target = 9`)**

| i   | j   | nums[i] | nums[j] | nums[i] + nums[j] | 결과     |
|-----|-----|---------|---------|-------------------|----------|
| 0   | 1   | 2       | 7       | 9                 | [0, 1]   |

**중간 과정 출력 예시:**

```plaintext
i=0, j=1: nums[0] + nums[1] = 2 + 7 = 9 -> [0, 1]
```

---

### **특징**
- **반복문을 사용하지 않음**: 재귀로 반복을 대체.
- **시간 복잡도**: O(n²) (브루트 포스와 동일).
- **공간 복잡도**: O(n) (재귀 호출 스택 사용).

---

### **주의점**
- 재귀는 입력 크기가 큰 경우 호출 스택이 넘칠 수 있으므로, 일반적으로 반복문보다 비효율적일 수 있습니다.
- 학습 목적으로 적합하며, 실제 문제에서는 해시맵을 활용한 O(n) 풀이가 권장됩니다. 😊


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

