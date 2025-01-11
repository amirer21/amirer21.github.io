---
title: Algorithm 03 - (Basic Pattern 03) - (3) DFS (Depth-First Search) - What Is Recursion?
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
toc_label: Table of Contents
description: Algorithm - DFS (Depth-First Search) - Understanding Recursion
article_tag1: Algorithm
article_tag2: DFS
article_tag3: Recursion
article_section: Algorithm
meta_keywords: Algorithm, DFS, Recursion
last_modified_at: '2025-01-10 21:00:00 +0800'
---

### **Explaining Recursion Using Algorithm Problems**

---

### **1. What Is Recursion?**

**Recursion** refers to a function that **calls itself** as part of its operation.  
It works by **breaking down a problem into smaller subproblems**.

#### **Core Concepts of Recursion**
1. **Base Case**
   - The stopping condition for the recursive calls.
   - It returns a result when the problem is reduced to its simplest form.
2. **Recursive Call**
   - The function solves smaller subproblems by calling itself.

---

### **2. Why Use Recursion?**

- **Breaking Down Problems**
  - Suited for dividing a large problem into smaller, manageable parts.
- **Expressiveness**
  - Easily translate mathematical definitions into code (e.g., Fibonacci, factorial).
- **Data Structure Exploration**
  - Ideal for tree and graph traversal.

---

### **3. Structure of a Recursive Function**

#### **Template**
```python
def recursive_function(parameters):
    # 1. Base Case
    if base_condition:
        return result

    # 2. Recursive Call
    recursive_function(smaller_problem)
```

---

### **4. Example Problem Using Recursion**

#### **Problem: Calculate Factorial**

The factorial \( n! \) is defined as:
\[
n! = n \times (n-1) \times (n-2) \times \dots \times 1
\]
- Example: \( 5! = 5 \times 4 \times 3 \times 2 \times 1 = 120 \)

#### **Steps**
1. **Base Case**: When \( n = 0 \) or \( n = 1 \), \( n! = 1 \).
2. **Recursive Case**: \( n! = n \times (n-1)! \).

---

#### **Code**
```python
def factorial(n):
    # 1. Base Case
    if n == 0 or n == 1:
        return 1

    # 2. Recursive Call
    return n * factorial(n - 1)

# Test
print(factorial(5))  # Output: 120
```

---

### **5. Tracing the Execution of Recursion**

#### **Input: \( n = 5 \)**

```python
def factorial(n):
    print(f"Entering factorial({n})")
    if n == 0 or n == 1:
        print(f"Base case reached: factorial({n}) = 1")
        return 1

    result = n * factorial(n - 1)
    print(f"Returning: factorial({n}) = {result}")
    return result

# Test Execution
print(factorial(5))
```

#### **Output**
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

### **6. Key Steps in Solving Recursive Problems**

#### **1. Define the Base Case**
- Ensure recursion stops by defining a clear condition (e.g., \( n = 0 \)).

#### **2. Break the Problem Down**
- Express the problem in terms of smaller subproblems.

#### **3. Trace the Flow**
- Visualize how the function calls itself and returns values.

---

### **7. Easy Memorization and Understanding**

#### **Core Idea**
1. "Divide the problem into smaller parts and hand it back to yourself."
2. "If it can't be divided further (base case), return the result."

#### **Memorization Tips**
- "Without a base case, recursion never stops!"
- "Recursion splits the problem and accumulates the results during the return phase."

---

### **8. Practice Problems**

#### **1. Fibonacci Sequence**
The Fibonacci sequence is defined as:
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

# Test
print(fibonacci(5))  # Output: 5
```

---

#### **2. Reverse a String**
```python
def reverse_string(s):
    if len(s) == 0:
        return ""
    return s[-1] + reverse_string(s[:-1])

# Test
print(reverse_string("hello"))  # Output: "olleh"
```

---

#### **3. Binary Search**
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

# Test
arr = [1, 3, 5, 7, 9]
print(binary_search(arr, 7, 0, len(arr) - 1))  # Output: 3
```

---

### **9. Recursion vs Iteration**

| **Aspect**              | **Recursion**                         | **Iteration**                        |
|-------------------------|---------------------------------------|--------------------------------------|
| **Problem Decomposition** | Breaks the problem into subproblems   | Repeats steps using loops            |
| **Data Structure**       | Uses the call stack                   | Uses loop control variables          |
| **Best Suited For**      | Tree/graph traversal, hierarchical problems | Repeatedly solvable problems         |
| **Code Readability**     | Simple and close to mathematical definitions | Structured and easy to follow        |
| **Performance**          | May have overhead due to function calls | Faster with lower memory usage       |

---

### **10. Summary**

1. **Definition of Recursion**:
   - A function calling itself.
   - Built on a **base case** and **recursive calls**.

2. **Use Cases**:
   - Factorials, Fibonacci, string reversal, graph traversal (DFS), binary search, and more.

3. **Memorization Tips**:
   - "Break it down, and return from the base case."
   - Solve problems step by step, building solutions from the smallest subproblem.