---
title: Algorithm 03 - (Basic Pattern 02) - (3) Graph Traversal, BFS (Breadth-First Search) - When Does a Value Leave the Queue?
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
- Queue
toc: true
toc_sticky: true
toc_label: Table of Contents
description: Algorithm - Graph Traversal, Timing of Dequeue in a BFS Queue
article_tag1: Algorithm
article_tag2: BFS
article_tag3: Queue
article_section: Algorithm
meta_keywords: Algorithm, BFS, Queue
last_modified_at: '2025-01-11 13:00:00 +0800'
---

### **When Does a Value Leave the Queue?**

A **queue** is a **FIFO (First-In, First-Out)** data structure.  
This means that the value that is **enqueued first** will be the **first to be dequeued**.

---

### **When Does a Value Leave the Queue?**

1. **In BFS (Breadth-First Search)**:
   - A value leaves the queue when it is dequeued using `queue.popleft()`.
   - The dequeued value (node) is the **current node** being processed, and its **adjacent nodes** are enqueued.

2. **In General Queue Operations**:
   - Values added to the queue are placed at the back (`enqueue`).
   - Values leave the queue only when dequeued from the front (`dequeue`).
   - A value remains in the queue until it reaches the front.

---

### **Example of Value Leaving the Queue in BFS**

#### **Graph Representation**
```python
graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
```

#### **BFS Implementation**
```python
from collections import deque

def bfs(graph, start):
    visited = set()  # To track visited nodes
    queue = deque([start])  # Initialize queue with the start node

    while queue:
        # Value leaving the queue
        node = queue.popleft()
        print(f"Value dequeued: {node}")

        if node not in visited:
            visited.add(node)
            print(f"Visited Node: {node}")
            queue.extend(graph[node])  # Add adjacent nodes to the queue
            print(f"Current Queue State: {list(queue)}")

bfs(graph, 1)
```

---

#### **Output**
```
Value dequeued: 1
Visited Node: 1
Current Queue State: [2, 3]
Value dequeued: 2
Visited Node: 2
Current Queue State: [3, 4]
Value dequeued: 3
Visited Node: 3
Current Queue State: [4, 5]
Value dequeued: 4
Visited Node: 4
Current Queue State: [5]
Value dequeued: 5
Visited Node: 5
Current Queue State: []
```

---

### **Order of Values Leaving the Queue**

1. **Initial State**:
   - Start node `1` is added to the queue → Queue: `[1]`.

2. **Step 1**:
   - `1` is dequeued (`popleft`) → Queue: `[]`.
   - Adjacent nodes `[2, 3]` are added → Queue: `[2, 3]`.

3. **Step 2**:
   - `2` is dequeued → Queue: `[3]`.
   - Adjacent node `[4]` is added → Queue: `[3, 4]`.

4. **Step 3**:
   - `3` is dequeued → Queue: `[4]`.
   - Adjacent node `[5]` is added → Queue: `[4, 5]`.

5. **Step 4**:
   - `4` is dequeued → Queue: `[5]`.
   - No adjacent nodes → Queue: `[5]`.

6. **Step 5**:
   - `5` is dequeued → Queue: `[]`.
   - BFS ends.

---

### **Summary**

- **When Does a Value Leave the Queue?**
  - A value leaves the queue when it is dequeued from the front (`popleft`).
  - The dequeued value is the **current node** being processed in BFS.

- **Order in BFS**:
  - Values are processed in the same order they are added to the queue.
  - BFS ensures all neighbors of a node are processed before moving to the next level.