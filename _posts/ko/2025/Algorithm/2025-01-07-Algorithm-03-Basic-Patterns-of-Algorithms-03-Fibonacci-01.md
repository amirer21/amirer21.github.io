---
title: 알고리즘 03 - (기본 패턴 03) 유형 - 1. 피보나치 수열이란?
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
description: 기본 패턴 유형 정리, 피보나치 수열이란?
article_tag1: Algorithm
article_tag2: Recursion
article_tag3: 
article_section: 
meta_keywords: Algorithm, Recursion
last_modified_at: '2025-01-07 21:00:00 +0800'
---


### **1. 피보나치 수열이란?**

피보나치 수열은 **각 항이 이전 두 항의 합으로 정의되는 수열**입니다.  

기본적으로 다음과 같이 정의됩니다
\[
F(0) = 0, \, F(1) = 1
\]
\[
F(n) = F(n-1) + F(n-2) \, \text{(n ≥ 2)}
\]

---

### **2. 피보나치 수열의 유래**

#### 2.1 **역사적 배경**
- 피보나치 수열은 이탈리아의 수학자 **레오나르도 피보나치(Leonardo Fibonacci)**가 1202년에 저술한 《Liber Abaci》(계산서)라는 책에서 소개되었습니다.
- **토끼 번식 문제**를 다루는 과정에서 유도된 수열입니다.

#### 2.2 **토끼 번식 문제**
- 문제: 한 쌍의 토끼가 매달 새끼를 낳는다고 가정할 때, 한 쌍의 토끼가 **성숙(한 달 후)**하면 새끼를 낳는다고 할 때, \( n \)개월 후에는 몇 쌍의 토끼가 있을까요?
- 조건:
  1. 첫 달에는 한 쌍의 새끼 토끼가 있다.
  2. 한 달이 지나면 새끼 토끼는 성숙한다.
  3. 성숙한 토끼는 매달 새끼를 낳는다.
  4. 토끼는 죽지 않는다.

##### **해결 과정**
1. 첫 번째 달: \( 1 \)쌍.
2. 두 번째 달: \( 1 \)쌍 (성숙).
3. 세 번째 달: 새끼가 태어나서 \( 2 \)쌍.
4. 네 번째 달: \( 3 \)쌍.
5. 다섯 번째 달: \( 5 \)쌍.
6. 여섯 번째 달: \( 8 \)쌍.

이런 과정을 수학적으로 일반화하면 **피보나치 수열**이 유도됩니다:
\[
F(n) = F(n-1) + F(n-2)
\]

---

### **3. 피보나치 수열의 목적**

#### 3.1 **수학적 패턴 분석**
피보나치 수열은 **수학적 패턴과 구조**를 분석하는 데 사용됩니다. 이 수열은 자연계와 밀접한 관계가 있어, 많은 현상을 설명하는 데 쓰입니다.

#### 3.2 **황금비율(1.618...)**
피보나치 수열의 인접한 두 항의 비율은 점점 **황금비율(Φ)**에 가까워집니다.
\[
\Phi = \frac{1 + \sqrt{5}}{2} \approx 1.618
\]

#### 3.3 **응용 분야**
1. **자연 현상 모델링**:
   - 해바라기 씨앗의 배열, 나선형 조개 껍질, 파인애플 껍질 등.
2. **컴퓨터 알고리즘**:
   - 동적 프로그래밍 문제의 기초.
3. **암호학**:
   - 난수 생성 및 보안 알고리즘.
4. **예술과 건축**:
   - 황금비율을 기반으로 한 디자인.

---

### **4. 수학적 기초**

#### 4.1 **점화식(Recurrence Relation)**

- **점화식(漸化式)**은 수열에서 특정 항이 이전 항들과의 관계로 정의되는 식을 말합니다. 
- 수학적으로, 점화식은 수열의 한 항을 이전 항(또는 몇몇 이전 항들)과의 관계로 나타내는 수식입니다.

- 한자 뜻:
    - 漸(점): 점점, 점진적으로.
    - 化(화): 변화하다, 바뀌다.
    - 式(식): 수식이나 식.

피보나치 수열은 점화식으로 정의됩니다:
\[
F(n) = F(n-1) + F(n-2) \quad (n \geq 2)
\]

#### 4.2 **초기 조건**
\[
F(0) = 0, \, F(1) = 1
\]

#### 4.3 **일반항(Closed Form Formula)**
점화식을 일반항으로 표현하면 다음과 같습니다:
\[
F(n) = \frac{\Phi^n - \psi^n}{\sqrt{5}}
\]
여기서,
\[
\Phi = \frac{1 + \sqrt{5}}{2}, \quad \psi = \frac{1 - \sqrt{5}}{2}
\]

#### 4.4 **행렬 표현**
피보나치 수열은 행렬 곱셈으로도 계산할 수 있습니다:
\[
\begin{bmatrix}
F(n+1) \\
F(n)
\end{bmatrix}
=
\begin{bmatrix}
1 & 1 \\
1 & 0
\end{bmatrix}
\cdot
\begin{bmatrix}
F(n) \\
F(n-1)
\end{bmatrix}
\]

이를 통해 반복적인 계산 없이 행렬 거듭제곱으로 효율적으로 값을 구할 수 있습니다.

---

### **5. 관련 알고리즘**

#### 5.1 **재귀를 이용한 피보나치**
가장 직관적인 방법입니다.
```python
def fibonacci_recursive(n):
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)
```
##### **시간 복잡도**: \( O(2^n) \)

---

#### 5.2 **반복문을 이용한 피보나치**
효율적으로 계산하기 위해 반복문을 사용합니다.
```python
def fibonacci_iterative(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```
##### **시간 복잡도**: \( O(n) \)

---

#### 5.3 **동적 프로그래밍**
이전 계산값을 저장하여 반복 계산을 줄이는 방법입니다.
```python
def fibonacci_dynamic(n):
    dp = [0] * (n + 1)
    dp[0], dp[1] = 0, 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]
```
##### **시간 복잡도**: \( O(n) \), **공간 복잡도**: \( O(n) \)

---

#### 5.4 **행렬을 이용한 피보나치**
행렬 곱셈을 통해 효율적으로 계산합니다.
```python
def fibonacci_matrix(n):
    def multiply_matrices(A, B):
        return [
            [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
            [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
        ]

    def power_matrix(matrix, n):
        if n == 1:
            return matrix
        if n % 2 == 0:
            half = power_matrix(matrix, n // 2)
            return multiply_matrices(half, half)
        else:
            return multiply_matrices(matrix, power_matrix(matrix, n - 1))

    if n <= 1:
        return n

    base_matrix = [[1, 1], [1, 0]]
    result_matrix = power_matrix(base_matrix, n - 1)
    return result_matrix[0][0]
```
##### **시간 복잡도**: \( O(\log n) \)

---

### **6. 사고력을 키우기 위한 질문**

1. **점화식의 유도**:
   - 왜 \( F(n) = F(n-1) + F(n-2) \)인가? 이전 두 값이 새 값을 결정하는 구조를 수학적으로 설명하세요.

2. **일반항 이해**:
   - 왜 \( \Phi^n - \psi^n \)이 피보나치 값을 나타낼까요?

3. **효율성 개선**:
   - 왜 반복문이나 행렬 방식을 사용하면 성능이 개선되나요?

---


아래는 위의 6번 항목에 대해 추가된 내용입니다.

---


### **1. 점화식의 유도**
#### **1.1 \( F(n) = F(n-1) + F(n-2) \)의 의미**
- \( F \): 피보나치 수열의 항을 나타내는 함수.  
  - \( F(n) \): 피보나치 수열의 \( n \)번째 값을 의미합니다.
  - 예: \( F(0) = 0, F(1) = 1, F(2) = 1, F(3) = 2 \).

- **왜 \( F(n) = F(n-1) + F(n-2) \)인가?**  
  이 식은 **현재 항(\( F(n) \))이 이전 두 항(\( F(n-1) \), \( F(n-2) \))의 합으로 계산됨**을 의미합니다. 이는 다음과 같은 논리에서 나옵니다:
  
  1. **토끼 번식 문제**: 
     - \( n \)번째 달에 있는 토끼 쌍의 수는 이전 달에 성숙한 토끼의 수와 그 이전 달에 태어난 새끼 토끼의 수의 합과 같습니다.
  2. **구조적 특성**: 
     - 피보나치 수열은 현재 항을 만들기 위해 이전 두 항만 필요로 합니다. 따라서 점화식은 이렇게 단순하게 정의됩니다.

#### **1.2 \( n-1 \)과 \( n-2 \)의 역할**
- **\( F(n-1) \)**: \( n-1 \)번째 항은 현재 항(\( n \)) 바로 직전의 값을 나타냅니다.
- **\( F(n-2) \)**: \( n-2 \)번째 항은 \( n \)번째 항에서 두 번째로 이전 값을 나타냅니다.
- 왜 두 항을 더하나요?
  - 이 수열에서는 \( F(n-1) \)은 이전 값, \( F(n-2) \)은 그보다 더 이전 값을 나타내므로, \( n \)번째 항은 자연스럽게 이 두 값을 더한 결과로 정의됩니다.

#### **1.3 \( F(n) = F(n-1) + F(n-2) \)의 수학적 사고**
- 수학적으로, 이 수열은 **점화식(Recurrence Relation)**으로 정의되며, **현재 값을 과거의 값을 기반으로 정의**합니다.
- \( n \geq 2 \)일 때, 모든 \( F(n) \)는 \( F(n-1) \)과 \( F(n-2) \)의 합으로 설명 가능합니다.

---

### **2. 일반항 이해: \( F(n) = \frac{\Phi^n - \psi^n}{\sqrt{5}} \)**

#### **2.1 \( \Phi \)와 \( \psi \)란?**
- \( \Phi = \frac{1 + \sqrt{5}}{2} \): **황금비율**. 약 \( 1.618 \).
- \( \psi = \frac{1 - \sqrt{5}}{2} \): 약 \( -0.618 \). 황금비율의 음수 버전.

#### **2.2 왜 일반항에 \( \Phi^n - \psi^n \)이 나타나는가?**
1. 피보나치 수열은 2차 점화식을 따릅니다:
   \[
   F(n) = F(n-1) + F(n-2)
   \]
2. 이 점화식을 만족하는 일반해를 구하기 위해 **특성방정식**을 풉니다:
   \[
   x^2 = x + 1
   \]
   이 방정식의 해는 \( \Phi \)와 \( \psi \)입니다.
3. 따라서 피보나치 수열은 다음과 같은 형태로 일반화됩니다:
   \[
   F(n) = A \cdot \Phi^n + B \cdot \psi^n
   \]
   여기서 \( A \)와 \( B \)는 초기 조건으로 결정됩니다.
4. 초기 조건 \( F(0) = 0, F(1) = 1 \)을 대입하여 계산하면:
   \[
   A = \frac{1}{\sqrt{5}}, \, B = -\frac{1}{\sqrt{5}}
   \]
5. 결과적으로:
   \[
   F(n) = \frac{\Phi^n - \psi^n}{\sqrt{5}}
   \]

#### **2.3 일반항의 직관적 이해**
- \( \Phi^n \): 피보나치 수열의 증가 속도를 주도.
- \( \psi^n \): \( n \)이 커질수록 작아지므로 거의 무시됩니다.
- 따라서, 피보나치 수열은 점차적으로 \( \Phi^n / \sqrt{5} \)에 수렴합니다.

---

### **3. 효율성 개선: 왜 반복문이나 행렬 방식을 사용하면 성능이 좋아지는가?**

#### **3.1 재귀 방식의 문제**
- 재귀는 동일한 계산을 반복합니다.
- 예를 들어 \( F(5) \)를 구하기 위해 \( F(4) \)와 \( F(3) \)를 계산하며, 이 과정에서 \( F(3) \)는 다시 \( F(2) \)와 \( F(1) \)을 계산합니다.
- **시간 복잡도**: \( O(2^n) \) (매우 비효율적).

#### **3.2 반복문 방식**
- 반복문은 이전 두 값을 변수에 저장하면서 순차적으로 계산합니다.
- 중복 계산이 없으므로 **시간 복잡도**는 \( O(n) \).

#### **3.3 행렬 방식**
- 피보나치 수열은 행렬 곱셈으로 표현 가능합니다:
  \[
  \begin{bmatrix}
  F(n+1) \\
  F(n)
  \end{bmatrix}
  =
  \begin{bmatrix}
  1 & 1 \\
  1 & 0
  \end{bmatrix}
  \cdot
  \begin{bmatrix}
  F(n) \\
  F(n-1)
  \end{bmatrix}
  \]
- 이 행렬을 \( n \)번 곱하는 대신 **분할정복**을 통해 \( O(\log n) \) 시간 복잡도로 계산할 수 있습니다.

---

### **4. 관련된 알고리즘**

#### **4.1 재귀 알고리즘**
```python
def fibonacci_recursive(n):
    if n <= 1:
        return n
    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)
```

#### **4.2 반복문 알고리즘**
```python
def fibonacci_iterative(n):
    if n <= 1:
        return n
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b
```

#### **4.3 행렬 알고리즘**
```python
def fibonacci_matrix(n):
    def multiply_matrices(A, B):
        return [
            [A[0][0] * B[0][0] + A[0][1] * B[1][0], A[0][0] * B[0][1] + A[0][1] * B[1][1]],
            [A[1][0] * B[0][0] + A[1][1] * B[1][0], A[1][0] * B[0][1] + A[1][1] * B[1][1]]
        ]

    def power_matrix(matrix, n):
        if n == 1:
            return matrix
        if n % 2 == 0:
            half = power_matrix(matrix, n // 2)
            return multiply_matrices(half, half)
        else:
            return multiply_matrices(matrix, power_matrix(matrix, n - 1))

    if n <= 1:
        return n

    base_matrix = [[1, 1], [1, 0]]
    result_matrix = power_matrix(base_matrix, n - 1)
    return result_matrix[0][0]
```

---

### **5. 결론**

1. **점화식(漸化式)**:
   - 현재 항은 과거 두 항의 합으로 정의되며, 이는 구조적으로 간단하면서도 강력한 수학적 패턴입니다.
2. **일반항**:
   - 황금비율과 관련된 수학적 성질이 피보나치 수열을 일반적으로 설명합니다.
3. **효율성**:
   - 반복문이나 행렬 방식을 통해 계산 시간을 크게 줄일 수 있습니다.

피보나치 수열은 단순하지만 깊은 수학적 의미를 지니며, 자연계와 컴퓨터 과학 전반에서 중요한 역할을 합니다. 다양한 구현 방식과 최적화 방법을 통해 큰 범위에서도 효율적으로 계산할 수 있으며, 이를 이해하는 과정에서 수학적 사고와 문제 해결 능력을 키울 수 있습니다. 😊