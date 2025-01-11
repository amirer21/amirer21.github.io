---
title: Algorithm 03 - (Basic Pattern 02) - (5) Graph Traversal, BFS (Breadth-First Search) - Difference Between "Visited Nodes" and "Visit Status"
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
- visitedNode
toc: true
toc_sticky: true
toc_label: Table of Contents
description: Algorithm - BFS, Differences Between "Visited Nodes" and "Visit Status"
article_tag1: Algorithm
article_tag2: BFS
article_tag3: visitedNode
article_section: Algorithm
meta_keywords: Algorithm, BFS, visitedNode
last_modified_at: '2025-01-11 13:00:00 +0800'
---

### **Difference Between "Visited Nodes" and "Visit Status"**

In graph traversal algorithms such as **Breadth-First Search (BFS)** or **Depth-First Search (DFS)**, the terms **"Visited Nodes"** and **"Visit Status"** often appear. These are related but distinct concepts that serve different purposes.

---

### **1. What Are "Visited Nodes"?**

**Visited nodes** are the **specific nodes that have already been explored** during the traversal process.

- **Focus**: Nodes in the graph (vertices).
- Refers to **nodes that have been processed** during the traversal.
- Actions performed when visiting a node:
  1. Processing the data (e.g., printing or storing it).
  2. Adding adjacent nodes of the visited node to the exploration queue or stack.

#### **Example**
```plaintext
Visited Node: 1
Visited Node: 2
Visited Node: 3
```
Here, `1`, `2`, and `3` are the nodes that have been processed during the traversal.

---

### **2. What Is "Visit Status"?**

**Visit status** refers to the **tracking information** that indicates whether a node has been visited or not during the traversal process.

- **Purpose**:
  - **Prevent redundant exploration**: Ensures already visited nodes are not revisited.
  - **Control traversal flow**: Helps manage the traversal process, especially in DFS, to distinguish between "currently being explored" and "fully explored."
  - **Efficiency**: Reduces unnecessary computations.
  
#### **How Visit Status Is Represented**
- **Set**:
  - Nodes are added to a set to track which nodes have been visited.
  - Example: `visited = {1, 2, 3}` (Nodes 1, 2, and 3 have been visited).
- **List**:
  - A list where the index represents the node, and the value represents whether it has been visited (`True`/`False`).
  - Example: `visited = [False, True, True, True]` (Nodes 1 to 3 have been visited).
- **Dictionary**:
  - A mapping of node values to their visit status (`True`/`False`).
  - Example: `visited = {1: True, 2: True, 3: True}`.

---

### **3. Differences Between "Visited Nodes" and "Visit Status"**

| **Feature**              | **Visited Nodes**                          | **Visit Status**                          |
|--------------------------|---------------------------------------------|-------------------------------------------|
| **Definition**            | Specific nodes that have already been processed. | Information tracking the visit state of each node. |
| **Purpose**               | Indicates the currently processed node.     | Prevents redundant exploration and manages flow. |
| **Data Structure**        | Individual node values (e.g., `1`, `2`, `3`). | Set, list, or dictionary.                |
| **Role**                  | Represents the nodes being traversed.       | Tracks whether a node has been visited or not. |
| **Example**               | "Visited Node: 1"                          | `visited = {1, 2, 3}` (Nodes 1, 2, and 3 visited). |

---

### **4. Example for Better Understanding**

#### **Graph Representation**
```python
graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
```

#### **BFS Implementation**
```python
from collections import deque

def bfs(graph, start):
    visited = set()  # Tracks visit status
    queue = deque([start])  # Nodes to be explored

    while queue:
        node = queue.popleft()  # Dequeue the next node

        if node not in visited:  # Check visit status
            visited.add(node)  # Update visit status
            print(f"Visited Node: {node}")  # Print the visited node
            queue.extend(graph[node])  # Add adjacent nodes to the queue
            print(f"Visit Status: {visited}")  # Print visit status
```

#### **Output**
```plaintext
Visited Node: 1
Visit Status: {1}
Visited Node: 2
Visit Status: {1, 2}
Visited Node: 3
Visit Status: {1, 2, 3}
Visited Node: 4
Visit Status: {1, 2, 3, 4}
Visited Node: 5
Visit Status: {1, 2, 3, 4, 5}
```

---

### **5. Summary**

- **"Visited Nodes"**:
  - Refers to the **nodes currently being processed** in the traversal.
  - Example: Printing or storing node values.

- **"Visit Status"**:
  - Tracks whether a node has been visited to **prevent redundant traversal** and manage traversal flow.
  - Example: Using a set or list to track visited nodes.

---

### **6. Easy Memory Tips**

1. **Visited Nodes**:
   - "Currently processed nodes."
   - Think of it as the action: "Which node am I visiting now?"

2. **Visit Status**:
   - "Tracking whether nodes are visited."
   - Think of it as the record: "Have I visited this node already?"

---

By understanding these distinctions, you can efficiently implement graph traversal algorithms like BFS and DFS while maintaining clarity in tracking the traversal process.