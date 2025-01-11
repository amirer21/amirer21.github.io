---
title: Algorithm 03 - (Data Structure 01) How to Think and Solve Algorithm Problems Independently?
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Algorithm
tags:
- Algorithm
- Data structure
- 
toc: true
toc_sticky: true
toc_label: Table of Contents
description: Algorithm - How to think and solve algorithm problems independently?
article_tag1: Algorithm
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Algorithm, 
last_modified_at: '2025-01-07 21:00:00 +0800'
---

### **Frequently Used Data Structures in Algorithm Problems**

Algorithms often rely on different data structure types depending on the problem's characteristics.  
Data structures define how data is stored and managed, and they are essential for designing **efficient algorithms**.  
In this article, we explore commonly used data structures in algorithm problems, their applications, and examples.

---

## **1. Array**

### **Description**
- A fixed-size data structure where elements are stored in contiguous memory locations.
- All elements have the same data type, and they can be accessed in **O(1)** time using indices.

### **Use Cases**
- Sorting problems.
- Storing sequential data or when order matters.
- 2D arrays (matrices): Representing graphs, image processing, etc.

#### **Example**
- **Problem**: Find the maximum value in an array.
  ```python
  nums = [1, 3, 7, 2, 5]

  max_num = nums[0]

  for num in nums:
      if num > max_num:
          max_num = num

  print(max_num)  # Output: 7
  ```

---

## **2. List**

### **Description**
- In Python, lists are dynamic arrays that can adjust their size dynamically.
- Can store elements of various data types.

### **Use Cases**
- Dynamically adding or removing elements.
- Storing data where order matters and size is not fixed.

#### **Example**
- **Problem**: Add and remove elements dynamically.
  ```python
  nums = [1, 2, 3]
  nums.append(4)  # Add element
  nums.remove(2)  # Remove element
  print(nums)  # Output: [1, 3, 4]
  ```

---

## **3. Stack**

### **Description**
- Follows the LIFO (Last In, First Out) principle: The last element added is the first to be removed.
- Insertion and deletion operations have **O(1)** time complexity.

### **Use Cases**
- Function call stack.
- Parentheses matching problems.
- Undo/Redo functionality.

#### **Example**
- **Problem**: Check if parentheses are valid.
  ```python
  def is_valid(s):
      stack = []
      mapping = {')': '(', '}': '{', ']': '['}

      for char in s:
          if char in mapping:
              top = stack.pop() if stack else '#'
              if mapping[char] != top:
                  return False
          else:
              stack.append(char)

      return not stack

  # Test
  s = "()[]{}"
  print(is_valid(s))  # Output: True
  ```

---

## **4. Queue**

### **Description**
- Follows the FIFO (First In, First Out) principle: The first element added is the first to be removed.
- Insertion and deletion operations have **O(1)** time complexity.

### **Use Cases**
- Processing data in the order it arrives.
- Breadth-First Search (BFS).

#### **Example**
- **Problem**: BFS implementation.
  ```python
  from collections import deque

  def bfs(graph, start):
      visited = set()
      queue = deque([start])

      while queue:
          node = queue.popleft()
          if node not in visited:
              visited.add(node)
              print(node, end=" ")
              queue.extend([n for n in graph[node] if n not in visited])

  # Test
  graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
  bfs(graph, 1)  # Output: 1 2 3 4 5
  ```

---

## **5. Priority Queue**

### **Description**
- Each element has a priority, and the element with the highest priority is processed first.
- Often implemented using heaps.

### **Use Cases**
- Dijkstra's algorithm for shortest paths.
- Task scheduling systems.

#### **Example**
- **Problem**: Extract the smallest value using a priority queue.
  ```python
  import heapq

  nums = [3, 1, 4, 1, 5]
  heapq.heapify(nums)  # Create a heap
  print(heapq.heappop(nums))  # Output: 1
  ```

---

## **6. Hash Table**

### **Description**
- Stores data as key-value pairs.
- Enables fast lookup, insertion, and deletion in **O(1)** time using hashing.

### **Use Cases**
- Fast data retrieval.
- Solving problems like the Two Sum.

#### **Example**
- **Problem**: Two Sum.
  ```python
  nums = [2, 7, 11, 15]
  target = 9
  num_dict = {}

  for i, num in enumerate(nums):
      complement = target - num
      if complement in num_dict:
          print([num_dict[complement], i])  # Output: [0, 1]
      num_dict[num] = i
  ```

---

## **7. Set**

### **Description**
- A collection of unique elements.
- Allows fast union, intersection, and difference operations.

### **Use Cases**
- Removing duplicates.
- Checking for membership.

#### **Example**
- **Problem**: Remove duplicates from a list.
  ```python
  nums = [1, 2, 2, 3, 4, 4]
  unique_nums = set(nums)
  print(unique_nums)  # Output: {1, 2, 3, 4}
  ```

---

## **8. Tree**

### **Description**
- A hierarchical data structure consisting of parent and child nodes.
- Common types: Binary Search Tree (BST), Heap, Trie.

### **Use Cases**
- Hierarchical data representation.
- Heap sort, Dijkstra's algorithm.

#### **Example**
- **Problem**: Inorder traversal of a binary tree.
  ```python
  class TreeNode:
      def __init__(self, val=0, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right

  def inorder_traversal(root):
      if not root:
          return []
      return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right)

  root = TreeNode(1, None, TreeNode(2, TreeNode(3)))
  print(inorder_traversal(root))  # Output: [1, 3, 2]
  ```

---

## **9. Graph**

### **Description**
- A data structure consisting of vertices (nodes) and edges (connections).
- Can be directed or undirected, weighted or unweighted.

### **Use Cases**
- Pathfinding (BFS/DFS).
- Shortest path algorithms (Dijkstra, Floyd-Warshall).

#### **Example**
- **Problem**: DFS implementation.
  ```python
  def dfs(graph, node, visited=None):
      if visited is None:
          visited = set()
      visited.add(node)
      print(node, end=" ")
      for neighbor in graph[node]:
          if neighbor not in visited:
              dfs(graph, neighbor, visited)

  graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
  dfs(graph, 1)  # Output: 1 2 4 3 5
  ```

---

### **Criteria for Choosing Data Structures**

| **Problem Type**            | **Recommended Data Structure**   |
|------------------------------|-----------------------------------|
| Sequential storage and search| Array, List                     |
| Removing duplicates          | Set                             |
| Fast lookup and storage       | Hash Table                      |
| LIFO structure               | Stack                           |
| FIFO structure               | Queue                           |
| Shortest path, optimization  | Priority Queue                  |
| Hierarchical data representation | Tree                       |
| Pathfinding, connected data  | Graph                           |

---