---
title: Algorithm 03 - (Basic Patterns 00) Types
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
description: Understanding Basic Pattern Types
article_tag1: Algorithm
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Algorithm, 
last_modified_at: '2025-01-07 21:00:00 +0800'
---


### **Basic Patterns**

Mastering **basic patterns** for solving algorithm problems is the first step to efficient problem-solving. By repeatedly practicing these patterns, you will naturally become more adept at tackling more difficult problems. Below, I've outlined various patterns along with problem types, thinking strategies, and memorization tips.

---

## **1. Brute Force**

### **Explanation**
- The brute force method explores all possible cases to find the solution.
- It is the simplest and most intuitive method, but can be inefficient.

### **Use Cases**
- Small-sized input data.
- When optimization is not required.

### **Example: Two Sum**
Find two numbers in an array whose sum equals the `target`.

```python
nums = [2, 7, 11, 15]
target = 9

for i in range(len(nums)):
    for j in range(i + 1, len(nums)):
        if nums[i] + nums[j] == target:
            print([i, j])  # Output: [0, 1]
```

### **Memorization Tip**
"**Explore** all cases and **check** those that satisfy the condition."

---

## **2. Sliding Window**

### **Explanation**
- This technique efficiently processes **contiguous subarrays/strings** in an array or string.
- The window (or range) is moved across the data, updating only the necessary calculations.

### **Use Cases**
- Fixed-size subarray sums or maximum values.
- Subarrays satisfying variable-sized conditions.

### **Example: Sum of Fixed-size Subarrays**
Find the maximum sum of subarrays of length 3.

```python
nums = [1, 2, 3, 4, 5]
k = 3
window_sum = sum(nums[:k])
max_sum = window_sum

for i in range(k, len(nums)):
    window_sum += nums[i] - nums[i - k]
    max_sum = max(max_sum, window_sum)

print(max_sum)  # Output: 12
```

### **Memorization Tip**
"**Slide** the window while **reusing** previous calculations."

---

## **3. Two Pointers**

### **Explanation**
- This technique uses two pointers to efficiently solve problems when traversing an array.
- Usually applied to **sorted arrays**.

### **Use Cases**
- Finding two numbers that sum to a specific value.
- Verifying conditions for subarrays.

### **Example: Sum of Two Numbers in Sorted Array**
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

### **Memorization Tip**
"**Narrow down** the search from both ends."

---

## **4. Dynamic Programming (DP)**

### **Explanation**
- DP breaks down a large problem into **smaller subproblems**, saving intermediate results to avoid redundant calculations.

### **Use Cases**
- Optimization problems (maximum/minimum values).
- Fibonacci sequence, knapsack problem, string comparison.

### **Example: Fibonacci Sequence**
```python
def fibonacci(n):
    dp = [0] * (n + 1)
    dp[0], dp[1] = 0, 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]

print(fibonacci(10))  # Output: 55
```

### **Memorization Tip**
"**Break down** the problem, **store** results, and **combine** them."

---

## **5. Backtracking**

### **Explanation**
- This approach explores all possibilities but **prunes** paths that do not meet the criteria.
- Based on Depth-First Search (DFS).

### **Use Cases**
- Generating permutations, combinations.
- N-Queens problem, maze solving.

### **Example: Generating Combinations**
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

print(combine(4, 2))  # Output: [[1, 2], [1, 3], [1, 4], [2, 3], [2, 4], [3, 4]]
```

### **Memorization Tip**
"Explore all possibilities but **backtrack** when the path doesn't satisfy the condition."

---

## **6. Binary Search**

### **Explanation**
- A technique to find a specific value in **sorted data** by halving the search range with each iteration, yielding \( O(\log n) \) time complexity.

### **Use Cases**
- Searching for a specific value or solving optimization problems.

### **Example: Finding a Value in Sorted Array**
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
print(binary_search(nums, 4))  # Output: 3
```

### **Memorization Tip**
"**Divide and conquer** by halving the search space."

---

## **7. Greedy Algorithm**

### **Explanation**
- Greedy algorithms make the **optimal choice at each step**, hoping that these choices will lead to an optimal solution.
- It does not always guarantee the best solution, but it is fast and simple.

### **Use Cases**
- Minimum coin problem, activity selection problem.

### **Example: Minimum Coin Problem**
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

print(min_coins([1, 5, 10, 25], 63))  # Output: 6 (25+25+10+1+1+1)
```

### **Memorization Tip**
"Make the **best choice** at each step."

---

## **8. Graph Traversal (BFS/DFS)**

### **Explanation**
- Graph traversal algorithms explore the **nodes and edges** in a graph.
- **BFS**: Explores nodes level by level (using a queue).
- **DFS**: Explores deeply into nodes (using a stack/recursion).

### **Use Cases**
- Pathfinding, finding connected components.

#### **Example: DFS**
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
dfs(graph, 1)  # Output: 1 2 4 3 5
```

### **Memorization Tip**
- BFS: "Explore **wide** first."
- DFS: "Explore **deep** first."

---

### **Thinking and Memorization Tips**

1. **Think in Patterns**:
   - "Is this problem about a continuous range?" → Sliding Window.
   - "Do I need to generate combinations?" → Backtracking.
   - "Is it an optimization problem?" → Greedy Algorithm.

2. **Memorization Keywords**:
   - Brute Force: "**Explore all possibilities.**"
   - Sliding Window: "**Move the window.**"
   - Two Pointers: "**Narrow down** from both ends."
   - DP: "**Break down** and **store** results."
   - Backtracking: "**Explore** and **backtrack** when conditions fail."

3. **Practice by Hand**:
   - Solve problems manually to discover patterns, then implement the solution in code.

---