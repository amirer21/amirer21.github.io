---
title: Algorithm 03 - (Basic Pattern 02) - (4) Graph Traversal, BFS (Breadth-First Search) vs Sliding Window
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Algorithm
tags:
- Algorithm
- BFS
- Sliding Window
toc: true
toc_sticky: true
toc_label: Table of Contents
description: Algorithm - Comparing BFS and Sliding Window Techniques
article_tag1: Algorithm
article_tag2: BFS
article_tag3: Sliding Window
article_section: Algorithm
meta_keywords: Algorithm, BFS, Sliding Window
last_modified_at: '2025-01-11 13:00:00 +0800'
---

### **Graph Traversal: BFS vs Sliding Window**

Both **Breadth-First Search (BFS)** and the **Sliding Window** technique are commonly used approaches in algorithms. While they may seem similar due to their iterative nature, their purposes, operations, and underlying mechanics differ significantly. 

---

### **BFS: Traversing Connected Graph Nodes**

**BFS** is an algorithm used to **traverse or search graph data structures**, starting from a node and exploring all its neighbors before moving to the next level of neighbors. It relies on a **queue** to track nodes to visit.

#### **How BFS Works**
1. Begin at a starting node and enqueue it.
2. Dequeue a node, mark it as visited, and enqueue all its unvisited neighbors.
3. Repeat until the queue is empty.

#### **Key Features of BFS**
- Uses a **queue** (FIFO) for tracking exploration.
- Explores nodes **level by level** in a graph.
- Ideal for finding the **shortest path** in an unweighted graph.

---

### **Sliding Window: Processing a Continuous Subarray**

The **Sliding Window** technique is used to solve problems involving **subarrays or substrings** in linear data structures like arrays or strings. It involves moving a window of a fixed or variable size across the data while maintaining a running calculation.

#### **How Sliding Window Works**
1. Define a window size (fixed or dynamic).
2. Compute values for the initial window.
3. Slide the window forward by adding the next element and removing the first element in the window.
4. Repeat until the entire array or string is processed.

#### **Key Features of Sliding Window**
- Operates on **contiguous elements** of arrays or strings.
- Focuses on efficiently computing values for **subarrays** or **substrings**.
- Reduces redundant computations by reusing results from the previous window.

---

### **Comparing BFS and Sliding Window**

| **Feature**             | **BFS**                                 | **Sliding Window**                        |
|-------------------------|-----------------------------------------|------------------------------------------|
| **Data Structure Used** | Queue                                   | Index-based pointers                      |
| **Primary Objective**   | Graph traversal                         | Efficiently compute values in subarrays   |
| **Data Type**           | Graph (nodes and edges)                 | Arrays or strings                         |
| **Processing**          | Explores connected nodes                | Processes contiguous elements             |
| **Traversal Type**      | Level-by-level (breadth-first)          | Linear, maintaining a dynamic window      |
| **Common Applications** | Shortest path, connected components     | Maximum/minimum subarray, pattern search  |

---

### **BFS Example**

#### **Graph Representation**
```python
graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
```

#### **BFS Implementation**
```python
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])

    while queue:
        node = queue.popleft()
        if node not in visited:
            visited.add(node)
            print(f"Visited Node: {node}")
            queue.extend(graph[node])

bfs(graph, 1)
```

#### **Output**
```
Visited Node: 1
Visited Node: 2
Visited Node: 3
Visited Node: 4
Visited Node: 5
```

---

### **Sliding Window Example**

#### **Problem: Find the Sum of Subarrays of Size 3**
```python
nums = [1, 3, 5, 7, 9]
k = 3

# Sliding Window for Subarray Sum
window_sum = sum(nums[:k])  # Initial window sum
print(f"Initial Window Sum: {window_sum}")

for i in range(k, len(nums)):
    window_sum += nums[i] - nums[i - k]  # Slide the window
    print(f"Updated Window Sum: {window_sum}")
```

#### **Output**
```
Initial Window Sum: 9
Updated Window Sum: 15
Updated Window Sum: 21
Updated Window Sum: 27
```

---

### **When to Use BFS or Sliding Window**

1. **Use BFS when:**
   - Traversing or searching a graph.
   - Exploring all neighbors of a node.
   - Finding the shortest path or connected components.

2. **Use Sliding Window when:**
   - Operating on **linear data structures** like arrays or strings.
   - Solving problems involving **contiguous subarrays** or substrings.
   - Efficiently calculating sums, maximums, or specific patterns in subarrays.

---

### **Summary**

- BFS is ideal for **graph-based problems**, using a queue to explore nodes level by level.
- Sliding Window excels in **array or string problems**, reducing redundant computations in contiguous subarrays.
- Both techniques are versatile but cater to distinctly different types of problems. Understanding their mechanics and applications is key to solving algorithmic challenges effectively.