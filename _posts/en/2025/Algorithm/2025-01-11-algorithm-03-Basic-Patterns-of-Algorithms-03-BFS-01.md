---
title: Algorithm 03 - (Basic Pattern 02) - (1) Graph Traversal, BFS (Breadth-First Search)
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
- 
toc: true
toc_sticky: true
toc_label: Table of Contents
description: Algorithm - Graph Traversal, BFS (Breadth-First Search)
article_tag1: Algorithm
article_tag2: BFS
article_tag3: 
article_section: Algorithm
meta_keywords: Algorithm, BFS
last_modified_at: '2025-01-11 13:00:00 +0800'
---

### **Graph Traversal: BFS (Breadth-First Search)**

---

### **1. What is BFS?**

BFS is a **graph traversal algorithm** that explores all nodes level by level, starting from a given node.  
It uses a **queue** data structure and visits nodes **horizontally (breadth-first)**.

---

### **2. How BFS Works**

1. **Initialization**:
   - Add the starting node to a queue.
   - Prepare a data structure (e.g., a set or list) to track visited nodes.

2. **Traversal Loop**:
   - Remove a node from the queue and mark it as visited.
   - Add all unvisited neighbors of the current node to the queue.
   - Repeat until the queue is empty.

3. **Termination**:
   - When the queue is empty, all reachable nodes have been visited.

---

### **3. Characteristics of BFS**

- **Traversal Order**:
  - Start node → Immediate neighbors (level 1) → Neighbors of neighbors (level 2), and so on.
- **Shortest Path Guarantee**:
  - BFS guarantees the shortest path in an unweighted graph.
- **Time Complexity**:
  - \( O(V + E) \): \( V \) is the number of vertices, and \( E \) is the number of edges.

---

### **4. Easy-to-Remember Explanation**

1. **"Visit nodes closest to the start first."**
   - BFS starts at the root node and explores all immediate neighbors before moving to the next level.
2. **"Use a queue."**
   - BFS uses a **queue** to manage nodes to be explored, visiting nodes in the order they are added to the queue.

---

### **5. BFS Implementation with Detailed Steps**

#### **Graph Representation**
```python
graph = {1: [2, 3], 2: [4, 5], 3: [6, 7], 4: [], 5: [], 6: [], 7: []}
```

#### **BFS Code**
```python
from collections import deque

def bfs(graph, start):
    visited = set()  # To track visited nodes
    queue = deque([start])  # Queue to manage nodes to be explored

    print(f"Graph Structure: {graph}")
    print(f"Starting Node: {start}")
    print("========================================")

    step = 1
    while queue:
        print(f"Step {step}:")
        print(f" - Current Queue: {list(queue)}")

        # Remove a node from the queue
        node = queue.popleft()
        print(f" - Dequeued Node: {node}")

        # If not visited, process the node
        if node not in visited:
            visited.add(node)
            print(f" - Visited Node: {node}")
            print(f" - Visited Set: {visited}")

            # Add unvisited neighbors to the queue
            next_nodes = [n for n in graph[node] if n not in visited]
            queue.extend(next_nodes)
            print(f" - Added Nodes: {next_nodes}")
        else:
            print(f" - Node {node} already visited")

        print(f" - Updated Queue: {list(queue)}")
        print("----------------------------------------")
        step += 1

    print("Traversal Complete!")
    print(f"Visited Nodes in Order: {visited}")
```

#### **Execution**
```python
bfs(graph, 1)
```

#### **Output**
```
Graph Structure: {1: [2, 3], 2: [4, 5], 3: [6, 7], 4: [], 5: [], 6: [], 7: []}
Starting Node: 1
========================================
Step 1:
 - Current Queue: [1]
 - Dequeued Node: 1
 - Visited Node: 1
 - Visited Set: {1}
 - Added Nodes: [2, 3]
 - Updated Queue: [2, 3]
----------------------------------------
Step 2:
 - Current Queue: [2, 3]
 - Dequeued Node: 2
 - Visited Node: 2
 - Visited Set: {1, 2}
 - Added Nodes: [4, 5]
 - Updated Queue: [3, 4, 5]
----------------------------------------
Step 3:
 - Current Queue: [3, 4, 5]
 - Dequeued Node: 3
 - Visited Node: 3
 - Visited Set: {1, 2, 3}
 - Added Nodes: [6, 7]
 - Updated Queue: [4, 5, 6, 7]
----------------------------------------
Step 4:
 - Current Queue: [4, 5, 6, 7]
 - Dequeued Node: 4
 - Visited Node: 4
 - Visited Set: {1, 2, 3, 4}
 - Added Nodes: []
 - Updated Queue: [5, 6, 7]
----------------------------------------
Step 5:
 - Current Queue: [5, 6, 7]
 - Dequeued Node: 5
 - Visited Node: 5
 - Visited Set: {1, 2, 3, 4, 5}
 - Added Nodes: []
 - Updated Queue: [6, 7]
----------------------------------------
Step 6:
 - Current Queue: [6, 7]
 - Dequeued Node: 6
 - Visited Node: 6
 - Visited Set: {1, 2, 3, 4, 5, 6}
 - Added Nodes: []
 - Updated Queue: [7]
----------------------------------------
Step 7:
 - Current Queue: [7]
 - Dequeued Node: 7
 - Visited Node: 7
 - Visited Set: {1, 2, 3, 4, 5, 6, 7}
 - Added Nodes: []
 - Updated Queue: []
----------------------------------------
Traversal Complete!
Visited Nodes in Order: {1, 2, 3, 4, 5, 6, 7}
```

---

### **6. Tips for Remembering and Practicing BFS**

1. **Core Idea**:
   - **"Visit nodes closest to the start first."**
   - Use **a queue** to manage nodes.

2. **Memory Aids**:
   - "Enqueue nodes → Dequeue and visit → Enqueue neighbors."

3. **Practice by Drawing**:
   - Create a small graph, manually track the queue, and mark visited nodes.

4. **Repeat with Variations**:
   - Test BFS on graphs with cycles or disconnected components.

---

### **7. Summary**
- **BFS** is a traversal algorithm that explores nodes level by level.
- **Key Features**:
  - Uses a queue.
  - Guarantees the shortest path in an unweighted graph.
- **Core Process**:
  - Enqueue → Dequeue → Visit → Add neighbors to the queue.
- **Memory Aid**:
  - "Queue nodes → Dequeue and visit → Add neighbors."