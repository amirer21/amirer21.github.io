---
title: 알고리즘 02 - (용어 02) 슬라이딩 윈도우 (Sliding Window)란
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
description: 알고리즘 문제 - 슬라이딩 윈도우 (Sliding Window)란
article_tag1: Algorithm
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Algorithm, 
last_modified_at: '2025-01-07 21:00:00 +0800'
---


### **슬라이딩 윈도우 (Sliding Window)란?**


슬라이딩 윈도우는 배열이나 문자열에서 **효율적으로 구간을 탐색하는 기법**으로 매우 유용합니다. 

`슬라이딩 윈도우`는 **배열**이나 **문자열**에서 **연속된 부분 배열** 또는 **부분 문자열**을 효율적으로 계산하는 알고리즘 기법입니다. 윈도우(Window)는 일정한 크기의 **구간**을 의미하며, 이 구간을 **슬라이딩(이동)**시켜가며 필요한 정보를 계산합니다. 

이 기법은 **고정 크기 윈도우**와 **가변 크기 윈도우**로 나눌 수 있습니다.

#### **윈도우(Window)**는 **"부분 구간"**을 의미합니다.  
그렇기 때문에 '창(Window)'과 비슷한 개념으로 이해할 수 있는데, 윈도우는 배열이나 문자열의 특정 부분을 가리키며, **슬라이딩(이동)**하면서 구간을 탐색합니다.

---

### **슬라이딩 윈도우 기법의 핵심 개념**
1. **슬라이딩 윈도우**는 **배열**이나 **문자열**을 일정한 크기나 조건에 맞는 범위로 나누고, 이 범위를 오른쪽으로 이동하면서 필요한 값을 계산하는 방식입니다.
   
2. **윈도우 크기**는 두 가지로 나뉩니다
   - **고정 크기 윈도우**: 구간 크기가 일정하며, 슬라이딩을 할 때 구간 크기는 변하지 않습니다.
   - **가변 크기 윈도우**: 구간 크기가 조건에 따라 달라집니다.

---

### **슬라이딩 윈도우 사용 예시**

#### **1. 고정 크기 윈도우**
구간의 크기가 일정하고, 그 구간을 오른쪽으로 슬라이딩하면서 필요한 계산을 합니다. 가장 자주 사용되는 예시 중 하나는 **부분 배열 합**을 구하는 문제입니다.

#### **예시: 배열의 부분합 구하기**

(문제) 배열 `nums`와 크기 `k`가 주어졌을 때, **길이가 k인 연속된 부분 배열들의 합**을 구하세요.

예: `nums = [1, 2, 3, 4, 5], k = 3`

부분 배열의 합은 `1+2+3 = 6`, `2+3+4 = 9`, `3+4+5 = 12`입니다.

#### **고정 크기 윈도우 코드 예시 (부분합 구하기)**

- 잠깐! 파이썬 문법 (1)

### 파이썬 `num[]` 문법 설명
```
nums = [1, 2, 3, 4, 5]
print(nums[:3])  # 출력: [1, 2, 3] (0번째부터 2번째까지 슬라이싱)
print(nums[1:])  # 출력: [2, 3, 4, 5] (1번째부터 끝까지 슬라이싱)
print(nums[:])   # 출력: [1, 2, 3, 4, 5] (전체 리스트 복사)
```

- 잠깐! 파이썬 문법 (2)

### 파이썬 `range()` 문법 설명

`range()` 함수는 특정 범위의 숫자를 생성하는 **반복 가능한 객체**를 반환합니다.  
반복문에서 주로 사용되며, 간단한 수열을 생성하는 데 유용합니다.

---

### `range()`의 기본 사용법

#### 1. **`range(stop)`**
- 0부터 `stop-1`까지의 정수를 생성합니다.
- 기본적으로 시작 값은 0이며, 1씩 증가합니다.

```python
for i in range(5):
    print(i)
# 출력: 0, 1, 2, 3, 4
```

#### 2. **`range(start, stop)`**
- `start`부터 `stop-1`까지의 정수를 생성합니다.

```python
for i in range(2, 6):
    print(i)
# 출력: 2, 3, 4, 5
```

#### 3. **`range(start, stop, step)`**
- `start`부터 `stop-1`까지 `step` 간격으로 숫자를 생성합니다.
- `step`이 음수면 감소 방향으로 생성합니다.

```python
for i in range(1, 10, 2):
    print(i)
# 출력: 1, 3, 5, 7, 9

for i in range(10, 0, -2):
    print(i)
# 출력: 10, 8, 6, 4, 2
```

---

### 주요 특징
1. **Lazy Evaluation**:
   - `range()`는 실제 리스트를 생성하지 않고, 필요할 때 숫자를 하나씩 반환합니다.
   - 메모리를 효율적으로 사용합니다.

2. **리스트 변환 가능**:
   - `list()`를 사용하면 `range()` 객체를 리스트로 변환할 수 있습니다.

```python
print(list(range(5)))          # 출력: [0, 1, 2, 3, 4]
print(list(range(1, 5)))       # 출력: [1, 2, 3, 4]
print(list(range(1, 10, 3)))   # 출력: [1, 4, 7]
```

---

### 예외 처리
- **`step` 값이 0이면 에러 발생**:
```python
range(1, 10, 0)  # ValueError: range() arg 3 must not be zero
```

- **`start`와 `stop` 순서**:
  - `step`이 양수면 `start < stop`이어야 값이 생성됩니다.
  - `step`이 음수면 `start > stop`이어야 값이 생성됩니다.

```python
print(list(range(5, 1, -1)))  # 출력: [5, 4, 3, 2]
print(list(range(1, 5, -1)))  # 출력: []
```

---

### 실생활 예제

#### 1. **숫자 반복**
```python
for i in range(5):
    print(f"반복 횟수: {i}")
# 출력: 반복 횟수: 0, 1, 2, 3, 4
```

#### 2. **배열 인덱스 접근**
```python
nums = [10, 20, 30, 40]
for i in range(len(nums)):
    print(f"Index {i}: {nums[i]}")
# 출력:
# Index 0: 10
# Index 1: 20
# Index 2: 30
# Index 3: 40
```

#### 3. **짝수만 출력**
```python
for i in range(2, 11, 2):
    print(i)
# 출력: 2, 4, 6, 8, 10
```

#### 4. **역순 반복**
```python
for i in range(10, 0, -1):
    print(i)
# 출력: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1
```


### 요약
`range(start, stop, step)`:
- `start`: 시작 값 (기본값: 0)
- `stop`: 끝 값 (포함되지 않음)
- `step`: 증가 또는 감소 간격 (기본값: 1) 

`range()`는 반복문에서 필수적으로 사용되며, 수열 생성에 매우 유용합니다! 😊


### 풀이 코드

```python
def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])  # 초기 윈도우의 합
    max_sum = window_sum

    for i in range(k, len(nums)):
        # 윈도우를 슬라이딩
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)

    return max_sum

# 테스트
nums = [1, 2, 3, 4, 5]
k = 3
print(max_sum_subarray(nums, k))  # 출력: 12
```

##### **작동 과정:**
1. 첫 번째 윈도우는 `[1, 2, 3]`이고 합은 `6`.
2. 두 번째 윈도우는 `[2, 3, 4]`이고 합은 `9`.
3. 세 번째 윈도우는 `[3, 4, 5]`이고 합은 `12`.

---

### 코드 설명: `[:]` 파이썬 배열 문법

`[:]`는 파이썬에서 **슬라이싱(Slicing)**을 나타내는 문법입니다. 
- `nums[:]`는 리스트 `nums`의 **모든 요소를 복사**하는 것을 의미합니다.
- 시작 인덱스와 끝 인덱스를 지정하지 않으면 리스트 전체를 슬라이싱합니다.
- 이 문법은 리스트의 부분을 선택하거나 복사할 때 주로 사용됩니다.

#### 예시
```python
nums = [1, 2, 3, 4, 5]
print(nums[:3])  # 출력: [1, 2, 3] (0번째부터 2번째까지 슬라이싱)
print(nums[1:])  # 출력: [2, 3, 4, 5] (1번째부터 끝까지 슬라이싱)
print(nums[:])   # 출력: [1, 2, 3, 4, 5] (전체 리스트 복사)
```

---

### 주어진 코드 풀이 과정

#### 함수 `max_sum_subarray`의 동작

1. 배열 `nums`의 길이가 `k` 이상이라고 가정합니다.
2. 첫 번째 윈도우(크기 `k`)의 합을 계산합니다.
3. 윈도우를 한 칸씩 오른쪽으로 이동하면서, 새로운 윈도우의 합을 업데이트하고 최대값을 갱신합니다.

---

### 풀이 과정 (테스트 케이스)
입력값:
```python
nums = [1, 2, 3, 4, 5]
k = 3
```

1. **초기화**
   - `window_sum = sum(nums[:k]) = sum([1, 2, 3]) = 6`
   - `max_sum = 6`

2. **슬라이딩 윈도우 반복**
   - `i = 3`:  
     - 새로운 `window_sum = window_sum + nums[3] - nums[3 - 3]`  
       → `window_sum = 6 + 4 - 1 = 9`  
     - `max_sum = max(max_sum, window_sum)`  
       → `max_sum = max(6, 9) = 9`
   - `i = 4`:  
     - 새로운 `window_sum = window_sum + nums[4] - nums[4 - 3]`  
       → `window_sum = 9 + 5 - 2 = 12`  
     - `max_sum = max(max_sum, window_sum)`  
       → `max_sum = max(9, 12) = 12`

3. **최종 결과**:
   - 최대 서브배열 합: `12`

---

### 코드 실행 흐름 요약
| Iteration | `window_sum` 계산           | `max_sum` 업데이트 |
|-----------|-----------------------------|---------------------|
| 초기화    | `window_sum = 6`            | `max_sum = 6`      |
| `i = 3`   | `window_sum = 6 + 4 - 1 = 9`| `max_sum = 9`      |
| `i = 4`   | `window_sum = 9 + 5 - 2 = 12`| `max_sum = 12`    |

---

#### max(), sum() 없이 구현해보기

`max()`와 `sum()` 함수를 사용하지 않고 동일한 기능을 구현하려면, 각각의 기능을 직접 구현하면 됩니다. 아래는 이를 기반으로 작성한 코드입니다.

```python
def max_sum_subarray(nums, k):
    # 초기 윈도우 합 계산 (sum 없이 직접 더하기)
    window_sum = 0
    for i in range(k):
        window_sum += nums[i]

    # 초기 최대값 설정
    max_sum = window_sum

    # 슬라이딩 윈도우로 값 갱신
    for i in range(k, len(nums)):
        window_sum = window_sum + nums[i] - nums[i - k]
        # max 없이 최대값 계산
        if window_sum > max_sum:
            max_sum = window_sum

    return max_sum

# 테스트
nums = [1, 2, 3, 4, 5]
k = 3
print(max_sum_subarray(nums, k))  # 출력: 12
```

---

### 코드 설명

#### 1. **`sum()` 없이 초기 합 계산**
- 직접 반복문을 사용하여 배열의 처음 `k`개의 값을 더합니다.
```python
window_sum = 0
for i in range(k):
    window_sum += nums[i]
```

#### 2. **`max()` 없이 최대값 갱신**
- `if` 조건문을 사용하여 직접 최대값을 비교하고 갱신합니다.
```python
if window_sum > max_sum:
    max_sum = window_sum
```

#### 3. **슬라이딩 윈도우로 합 갱신**
- 새 값을 더하고, 이전 윈도우의 첫 번째 값을 뺍니다.
```python
window_sum = window_sum + nums[i] - nums[i - k]
```

---

### 테스트 케이스
#### 입력:
```python
nums = [1, 2, 3, 4, 5]
k = 3
```

#### 출력:
```plaintext
12
```

#### 과정:
1. 초기 윈도우 합: `1 + 2 + 3 = 6`
2. 첫 번째 이동: `(6 - 1) + 4 = 9`
3. 두 번째 이동: `(9 - 2) + 5 = 12`
4. 최종 최대값: `12`

이렇게 하면 `sum()`과 `max()`를 사용하지 않고도 동일한 결과를 얻을 수 있습니다! 😊

---


### 슬라이딩 윈도우의 작동 방식

1. **초기값 계산**:
   - 배열의 처음 `k`개 요소를 더해서 첫 번째 윈도우의 합(`window_sum`)을 계산합니다.

2. **윈도우를 오른쪽으로 이동**:
   - 윈도우를 한 칸 오른쪽으로 이동하면서, 새로운 요소를 더하고 이전 윈도우의 첫 번째 요소를 뺍니다.
   - 즉, 윈도우의 크기는 일정하게 유지됩니다.

3. **최댓값 갱신**:
   - 매번 윈도우 합을 계산한 후, 현재까지의 최댓값(`max_sum`)과 비교하여 갱신합니다.

---

### 코드의 핵심 아이디어

#### 윈도우의 갱신 방식
- `window_sum += nums[i] - nums[i - k]`  
  - `nums[i]`: 새로운 윈도우에 추가된 값.
  - `nums[i - k]`: 이전 윈도우에서 제외된 값.

이 방식은 매번 새로운 윈도우를 전체적으로 합산하는 대신, **필요한 값만 더하고 뺌으로써 계산량을 줄입니다**.


### 슬라이딩 윈도우의 장점
- 매번 윈도우를 재계산하지 않아도 되므로 **시간 복잡도가 O(n)**으로 매우 효율적입니다.
- 큰 배열에서도 빠르게 최대값을 구할 수 있습니다.

이 알고리즘은 데이터의 일부를 더하고 빼는 방식으로 효율성을 극대화한 좋은 예입니다! 😊


---


#### **2. 가변 크기 윈도우**

가변 크기 윈도우는 구간의 크기가 고정되지 않고, 조건에 따라 윈도우의 크기가 늘어나거나 줄어듭니다. 주로 **조건을 만족하는 부분 배열**을 찾을 때 사용됩니다.

#### **문제 : 중복 문자가 없는 가장 긴 부분 문자열의 길이 구하기**

문자열에서 중복되지 않는 가장 긴 부분 문자열의 길이를 구하는 문제입니다. 이 문제는 가변 크기 윈도우로 해결할 수 있습니다.

#### **가변 크기 윈도우 코드 예시 (중복 없는 부분 문자열)**

```python
def longest_substring(s):
    char_set = set()
    left = 0
    max_length = 0

    for right in range(len(s)):
        # 중복이 있으면 왼쪽 포인터를 이동시켜 중복을 제거
        while s[right] in char_set:
            char_set.remove(s[left])
            left += 1
        # 현재 문자 추가
        char_set.add(s[right])
        # 최대 길이 갱신
        max_length = max(max_length, right - left + 1)

    return max_length

# 테스트
s = "abcabcbb"
print(longest_substring(s))  # 출력: 3
```

##### **작동 과정**
1. 첫 번째 문자는 `a`, `b`, `c`를 추가하고, 그 길이는 `3`.
2. 두 번째 `a`가 등장하면 중복이 발생하므로 왼쪽 포인터를 이동하여 `b`, `c`를 제거하고, 새로 추가된 `a`와 함께 길이를 계산합니다.
3. 중복을 없애면서 계속 진행해 최종적으로 가장 긴 부분 문자열의 길이를 찾습니다.


`set()`과 `max()` 없이 문제를 해결하려면, 해당 기능을 직접 구현해야 합니다. 아래는 이를 기반으로 작성한 코드입니다.

```python
def longest_substring(s):
    char_list = []  # 중복 검사를 위한 리스트 (set 대체)
    left = 0
    max_length = 0

    for right in range(len(s)):
        # 중복이 있으면 왼쪽 포인터 이동
        while s[right] in char_list:
            char_list.remove(s[left])  # 가장 왼쪽 문자 제거
            left += 1
        
        # 현재 문자 추가
        char_list.append(s[right])
        
        # 최대 길이 갱신 (max 대체)
        current_length = right - left + 1
        if current_length > max_length:
            max_length = current_length

    return max_length

# 테스트
s = "abcabcbb"
print(longest_substring(s))  # 출력: 3
```

---

### 파이선 set(), max() 사용하지 않고 구하는 방법.

#### 1. **`set()` 대신 리스트 사용**
- `set` 대신 리스트 `char_list`를 사용하여 중복을 관리합니다.
- 리스트의 `remove()` 메서드를 이용해 왼쪽 포인터에서 제거합니다.
```python
char_list = []  # 중복 관리
while s[right] in char_list:
    char_list.remove(s[left])
    left += 1
```

#### 2. **`max()` 대신 조건문 사용**
- 현재 문자열 길이를 계산한 후, 직접 비교하여 최대값을 갱신합니다.
```python
current_length = right - left + 1
if current_length > max_length:
    max_length = current_length
```

---

### 테스트 과정
#### 입력: 
```python
s = "abcabcbb"
```

#### 동작:
1. `right = 0`: `'a'` 추가 → 길이 `1`
2. `right = 1`: `'b'` 추가 → 길이 `2`
3. `right = 2`: `'c'` 추가 → 길이 `3`
4. `right = 3`: `'a'` 중복 → `left` 이동 후 `'a'` 제거 → `'b', 'c', 'a'` 유지 → 길이 `3`
5. `right = 4`: `'b'` 중복 → `left` 이동 후 `'b'` 제거 → `'c', 'a', 'b'` 유지 → 길이 `3`

최종 결과: 최대 길이 `3`.

---

이 방식은 `set()`과 `max()`를 사용하지 않고도 동일한 기능을 제공합니다. 😊

---

### **슬라이딩 윈도우의 장점**
1. **효율성**: 한 번의 탐색으로 문제를 해결하므로 시간 복잡도가 줄어듭니다. 특히 **O(n)**로 해결할 수 있는 문제들이 많습니다.
2. **메모리 절약**: 구간을 계속 갱신하기 때문에 추가적인 메모리 공간을 거의 사용하지 않습니다.

---

### **슬라이딩 윈도우의 단점**

1. **문제의 특성에 맞는 경우에만 유효**: 배열이나 문자열에서 연속된 부분 배열이나 부분 문자열을 처리하는 문제에서 효과적입니다. 그 외의 문제에서는 사용할 수 없습니다.
2. **구간 조작에 주의**: 슬라이딩 윈도우를 구현할 때, 윈도우의 크기나 구간을 올바르게 갱신하는 데 주의해야 합니다.

---

### **슬라이딩 윈도우를 기억하는 법**

1. **"창이 슬라이딩 한다"**는 이미지를 떠올려 보세요. 창을 **좌우로 이동**시키며 구간을 갱신하는 느낌입니다.

2. **"한 번에 전체를 탐색"**하는 방식으로 생각하세요. 구간을 계속 갱신하면서, 매번 전체를 다시 탐색하지 않고, 이전 계산 결과를 바탕으로 효율적으로 진행하는 방식입니다.

---

### **슬라이딩 윈도우 연습 문제**
1. **문제**: 정수 배열에서 합이 `target`이 되는 부분 배열의 개수를 구하세요.
2. **문제**: 문자열에서 **최소 길이의 부분 문자열**을 구하세요. (주어진 문자들을 모두 포함해야 함).

---
