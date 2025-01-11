---
title: Algorithm 03 - (Data Structure 02) Queue - What Does "Visited Node" Mean?
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
toc_label: Table of Contents
description: Algorithm - Data Structure, Queue - What Does "Visited Node" Mean?
article_tag1: Algorithm
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Algorithm, 
last_modified_at: '2025-01-07 21:00:00 +0800'
---

### **What Does "Visited Node" Mean?**

A **"visited node"** refers to a **vertex (node)** in a graph that has already been explored during a **graph traversal** process.  
In graph traversal algorithms, such as BFS (Breadth-First Search) or DFS (Depth-First Search), we keep track of visited nodes to **avoid redundant exploration** and **prevent infinite loops**.

---

### **Definition of Graph and Node**

- **Graph (Graph)**:
  - A data structure consisting of **vertices (nodes)** and **edges (connections)**.
  - Example: \( G = (V, E) \), where \( V \) is the set of vertices, and \( E \) is the set of edges.

- **Node (Vertex)**:
  - A fundamental unit of a graph, representing data or entities.
  - Example: In a graph of social relationships, each person is a node.

- **Difference Between Index and Node**:
  - **Node**: Represents the graph's vertex, often labeled with values like 1, 2, or 3.
  - **Index**: Refers to the position of a node when represented in an array or list.

---

### **Meaning of "Visited Node"**

1. **Tracking Visited Nodes During Traversal**:
   - Keeps a record of nodes that have already been explored.
   - Prevents **redundant exploration** and **infinite loops** in BFS and DFS.

2. **Nodes Represent Values, Not Just Indices**:
   - A visited node refers to a vertex in the graph.
   - Example: In the graph \( G = \{1: [2, 3], 2: [4]\} \), visited nodes are `1`, `2`, `3`, etc., representing the graph's vertex values.

---

### **Example**

#### **Graph Representation**
```python
graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
```

#### **BFS Traversal**
```python
from collections import deque

def bfs(graph, start):
    visited = set()  # Set of visited nodes
    queue = deque([start])  # Queue of nodes to explore

    while queue:
        node = queue.popleft()  # Remove a node from the queue
        if node not in visited:
            visited.add(node)  # Mark node as visited
            print(f"Visited Node: {node}")
            queue.extend(graph[node])  # Add adjacent nodes to the queue

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

### **Relationship Between "Visited Node" and Index**

1. **Mapping Nodes to Indices**:
   - Nodes represent vertices in a graph, and the representation may vary.
   - In array-based graph representations, nodes correspond to indices.

   **Example**:
   ```python
   graph = [[1, 2], [3], [3], []]  # Nodes: 0, 1, 2, 3
   ```
   Here:
   - Node `0` has neighbors `[1, 2]`.
   - "Visited Node" can be the index of an array.

2. **Dictionary-Based Graphs**:
   - When graphs are represented as dictionaries, nodes are the dictionary keys.
   - "Visited Nodes" refer to the keys of the graph.

   **Example**:
   ```python
   graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
   ```
   Here:
   - "Visited Nodes" are `1`, `2`, `3`, `4`, and `5`, representing the graph's vertex values.

---

### **Summary**

- A **"visited node"** refers to a **vertex** in the graph, tracked during traversal to prevent **redundant exploration**.
- The concept of "visited" helps enhance traversal efficiency by avoiding revisits and ensuring that each node is processed only once.
- Whether the graph is represented as an array or a dictionary, the term "visited node" applies to the vertices being explored.
