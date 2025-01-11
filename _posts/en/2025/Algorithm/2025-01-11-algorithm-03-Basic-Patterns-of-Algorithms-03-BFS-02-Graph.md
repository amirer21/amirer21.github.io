---
title: Algorithm 03 - (Basic Pattern 02) - (2) What is a Graph in BFS (Breadth-First Search)?
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
- Graph
toc: true
toc_sticky: true
toc_label: Table of Contents
description: Algorithm - Graph Traversal and Mathematical Definition of Graph
article_tag1: Algorithm
article_tag2: BFS
article_tag3: Graph
article_section: 
meta_keywords: Algorithm, BFS, Graph
last_modified_at: '2025-01-11 13:00:00 +0800'
---

### **What is a Graph in BFS (Mathematical Definition)?**

BFS (Breadth-First Search) is an algorithm designed to traverse a **graph**.  
A **graph** is mathematically defined as a collection of **vertices (nodes)** and **edges (connections)**.

---

### **Vertices and Edges: Origins and Meaning**

#### **1. Vertex**
- **Etymology**:  
  - The word **"vertex"** originates from the Latin **"vertere"**, meaning "to turn" or "to pivot."
  - In geometry, a vertex refers to the "corner" or "point of intersection" of edges in a polygon or polyhedron.

- **In a Graph**:  
  - A vertex represents a **data point** or **node** in the graph.
  - Examples: Cities in a map, users in a network, or pages on a website.

#### **2. Edge**
- **Etymology**:  
  - The word **"edge"** comes from Old English **"ecg"**, meaning "a sharp boundary" or "a line connecting points."
  - In geometry, it represents the boundary or connection between vertices.

- **In a Graph**:  
  - An edge indicates the **relationship** or **connection** between two vertices.
  - Examples: Roads between cities, friendships between users, or hyperlinks between pages.

---

### **Memory Aid for Understanding Graphs**

#### **1. Vertex**
- Think of **"V"** in **Vertex** as **a point (dot)**.
  - "Vertex is a point in a graph that represents data."

#### **2. Edge**
- Think of **"E"** in **Edge** as **a line (connection)**.
  - "Edge connects the points in the graph."

#### **Visualization**:
```plaintext
Vertex: ● (a point)
Edge: ─ (a line connecting points)
Graph: A structure of vertices connected by edges
```

---

### **Graph Example**

#### **Graph Representation**:
```plaintext
Vertices: {A, B, C, D}
Edges: {(A, B), (B, C), (C, D)}
```

#### **How to Memorize**:
1. "A, B, C, and D are points (vertices)."
2. "Edges connect the points, like roads connecting cities."

---

### **1. Mathematical Definition of a Graph**

A **graph** is denoted as \( G = (V, E) \), where:
- \( V \): A set of **vertices** (nodes).
  - These represent the fundamental data points in the graph.
  - Example: \( V = \{1, 2, 3, 4\} \) (4 vertices).

- \( E \): A set of **edges** (connections).
  - These describe the relationships between vertices.
  - Example: \( E = \{(1, 2), (2, 3), (3, 4)\} \) (3 edges).

---

### **2. Key Components of a Graph**

#### **(1) Vertices**:
- Fundamental units or data points in a graph.
- Example: \( V = \{1, 2, 3, 4\} \) (4 vertices).

#### **(2) Edges**:
- Represent the connections or relationships between vertices.
- Example: \( E = \{(1, 2), (2, 3), (3, 4)\} \).

#### **(3) Types of Graphs**:
1. **Undirected Graph**:
   - Edges are bidirectional.
   - Example: \( (u, v) \) and \( (v, u) \) are the same.

2. **Directed Graph**:
   - Edges are unidirectional.
   - Example: \( (u, v) \) represents \( u \to v \).

3. **Weighted Graph**:
   - Edges have weights (values) associated with them.
   - Example: \( (u, v, w) \), where \( w \) is the weight of the edge \( u \to v \).

---

### **3. Representations of a Graph**

#### **(1) Adjacency List**:
- Stores vertices and their connected neighbors in a list format.
- Memory-efficient (\( O(V + E) \)).

**Example**:
```plaintext
Vertices: {1, 2, 3, 4}
Edges: {(1, 2), (1, 3), (3, 4)}
Adjacency List:
1: [2, 3]
2: [1]
3: [1, 4]
4: [3]
```

#### **(2) Adjacency Matrix**:
- Represents a graph as an \( n \times n \) matrix (\( n \) = number of vertices).
- Space-intensive (\( O(V^2) \)).

**Example**:
```plaintext
Vertices: {1, 2, 3, 4}
Edges: {(1, 2), (1, 3), (3, 4)}
Adjacency Matrix:
    1  2  3  4
1 [ 0, 1, 1, 0 ]
2 [ 1, 0, 0, 0 ]
3 [ 1, 0, 0, 1 ]
4 [ 0, 0, 1, 0 ]
```

---

### **4. Role of Graphs in BFS**

In BFS, graphs provide the structure for exploring relationships or paths:
- **Vertices** are the points to be visited.
- **Edges** define how vertices are connected.

BFS systematically explores the graph level by level, starting from a designated vertex.

---

### **5. Real-Life Applications of Graphs**

1. **Social Networks**:
   - Vertices: Users
   - Edges: Friend connections

2. **Shortest Path Problems**:
   - Vertices: Cities
   - Edges: Roads
   - Weights: Distances

3. **Web Crawling**:
   - Vertices: Webpages
   - Edges: Hyperlinks

---

### **6. BFS Example Implementation**

```python
from collections import deque

# Define the graph
graph = {
    1: [2, 3],
    2: [4],
    3: [5],
    4: [],
    5: []
}

# BFS function
def bfs(graph, start):
    visited = set()  # Track visited nodes
    queue = deque([start])  # Initialize queue

    while queue:
        node = queue.popleft()  # Remove a node from the queue
        if node not in visited:
            visited.add(node)  # Mark as visited
            print(f"Visited Node: {node}")
            queue.extend(graph[node])  # Add neighbors to the queue

bfs(graph, 1)
```

#### **Output**:
```
Visited Node: 1
Visited Node: 2
Visited Node: 3
Visited Node: 4
Visited Node: 5
```

---

### **7. Summary**
- **Graph**:
  - A mathematical structure consisting of vertices (nodes) and edges (connections).
- **Key Features**:
  - Provides a framework for representing relationships.
- **BFS and Graphs**:
  - BFS uses graphs to explore connected components or shortest paths systematically.
- **Memory Aid**:
  - "Vertices are points, and edges are the lines connecting those points."