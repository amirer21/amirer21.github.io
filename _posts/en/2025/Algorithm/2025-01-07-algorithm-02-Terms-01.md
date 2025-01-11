---
title: Algorithm 02 - (Terminology 01) Frequently Used Terms in Algorithm Problems
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Algorithm
tags:
- Algorithm
toc: true
toc_sticky: true
toc_label: Table of Contents
description: Algorithm Problems - Frequently Used Terms in Algorithm Problems
article_tag1: Algorithm
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Algorithm, 
last_modified_at: '2025-01-07 21:00:00 +0800'
---


### **Frequently Used Terms in Algorithm Problems**

This article organizes commonly appearing terms in algorithm problems. Each concept is explained with examples to help you understand and reference them while solving problems.

---

## **1. Complement**

### **Definition**
- The complement is the **value needed** to complete a specific calculation.
- Typically defined as the difference between the **target value** and the **current value**.

### **Formula**
\[
\text{Complement} = \text{Target} - \text{Current Value}
\]

### **Use Cases**
- **Two Sum Problem**:
  - Used to find indices in an array where the sum of two numbers equals a target value.
  - Utilize a dictionary to store and quickly retrieve complements.

#### **Example**
```python
nums = [2, 7, 11, 15]
target = 9

# Calculate complement and use a dictionary
num_dict = {}
for i, num in enumerate(nums):
    complement = target - num
    if complement in num_dict:
        print([num_dict[complement], i])  # Output: [0, 1]
    num_dict[num] = i
```

---

## **2. Time Complexity**

### **Definition**
- Time complexity measures how long an algorithm takes to execute as a function of input size \( n \).
- Indicates how execution time scales with increasing input size.

### **Types**
1. **Best Case Time Complexity**: Fastest execution time.
2. **Average Time Complexity**: Average execution time over all cases.
3. **Worst Case Time Complexity**: Longest execution time.

### **Examples of Time Complexity**
- Array Search: \( O(n) \) (linear search).
- Sorting: \( O(n \log n) \) (quick sort).
- Search: \( O(\log n) \) (binary search).

---

## **3. Big-O Notation**

### **Definition**
- A mathematical representation of **algorithm performance**.
- Expresses time complexity for the worst-case scenario as a function of input size \( n \).

### **Common Big-O Notations**
| **Notation**     | **Description**                           | **Example**                      |
|-------------------|-------------------------------------------|-----------------------------------|
| \( O(1) \)        | Constant time: Execution time is fixed.   | Accessing a specific index in an array. |
| \( O(\log n) \)   | Logarithmic time: Input size halves.      | Binary search.                   |
| \( O(n) \)        | Linear time: Proportional to input size.  | Iterating through an array.      |
| \( O(n \log n) \) | Linear-log time: Common in sorting.       | Quick sort, merge sort.          |
| \( O(n^2) \)      | Quadratic time: Nested loops.             | Bubble sort.                     |
| \( O(2^n) \)      | Exponential time: Explores all cases.     | Recursive Fibonacci.             |

---

## **4. Sliding Window**

### **Definition**
- A technique for efficiently calculating **subarrays** of a fixed or variable size by updating data as the window slides.

### **Use Cases**
- Finding maximum/minimum subarray sums.
- Pattern matching in strings.

#### **Example**
- Longest substring without repeating characters:
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

print(max_length)  # Output: 3
```

---

## **5. Two Pointers**

### **Definition**
- A method using two pointers to efficiently search or traverse arrays or lists.
- Commonly used with **sorted arrays** to find pairs or ranges satisfying conditions.

### **Use Cases**
- Finding two numbers in a sorted array whose sum equals a target.
- Maximum/minimum subarray problems.

#### **Example**
- Two Sum Problem (Sorted Array):
```python
nums = [1, 2, 3, 4, 6]
target = 6
left, right = 0, len(nums) - 1

while left < right:
    s = nums[left] + nums[right]
    if s == target:
        print([left, right])  # Output: [1, 3]
        break
    elif s < target:
        left += 1
    else:
        right -= 1
```

---

## **6. Graph Traversal (BFS/DFS)**

### **Definition**
- Methods for exploring nodes in a graph.

1. **BFS (Breadth-First Search)**:
   - Explores neighbors layer by layer (uses a queue).
   - Commonly used for shortest path problems.
2. **DFS (Depth-First Search)**:
   - Explores as deep as possible before backtracking (uses a stack/recursion).
   - Used for exploring all paths, permutations, and combinations.

#### **Example**
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
# Output: 1 2 3 4 5 6
```

---

## **7. Pruning**

### **Definition**
- A technique in **backtracking** to eliminate paths that do not meet conditions, reducing the search space.

### **Use Cases**
- Problems like N-Queens or subset generation.

#### **Example**
- Pruning invalid paths in the N-Queens problem:
```python
def is_valid(board, row, col):
    for i in range(row):
        if board[i] == col or abs(board[i] - col) == abs(i - row):
            return False
    return True
```

---

## **8. Optimal Substructure**

### **Definition**
- A property where the **optimal solution** of a problem can be constructed from the optimal solutions of its **subproblems**.
- Key concept in dynamic programming.

#### **Example**
- Fibonacci Sequence:
  \[
  F(n) = F(n-1) + F(n-2)
  \]

---

## **9. Memoization**

### **Definition**
- A technique to store intermediate results to avoid redundant calculations.
- Core concept in dynamic programming.

#### **Example**
```python
def fibonacci(n, memo={}):
    if n <= 1:
        return n
    if n not in memo:
        memo[n] = fibonacci(n-1, memo) + fibonacci(n-2, memo)
    return memo[n]

print(fibonacci(10))  # Output: 55
```

---
