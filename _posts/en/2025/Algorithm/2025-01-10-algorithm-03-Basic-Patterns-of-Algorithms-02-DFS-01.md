---
title: Algorithm 03 - (Basic Pattern 02) - (1) Graph Traversal, DFS (Depth-First Search)
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
- 
toc: true
toc_sticky: true
toc_label: Table of Contents
description: Algorithm - Graph Traversal, DFS (Depth-First Search)
article_tag1: Algorithm
article_tag2: DFS
article_tag3: 
article_section: Algorithm
meta_keywords: Algorithm, DFS
last_modified_at: '2025-01-10 21:00:00 +0800'
---

### **Graph Traversal: DFS (Depth-First Search)**

---

### **1. What is DFS?**

**DFS (Depth-First Search)** is a **graph traversal algorithm** that starts at a specific node and explores as far as possible along one branch before backtracking. 

#### **Key Concepts of DFS**
1. **Deep Exploration**:
   - Keeps exploring adjacent nodes in a single direction until no further nodes can be visited.
2. **Backtracking**:
   - Returns to the previous node when there are no more unvisited nodes in the current path.
3. **Recursive or Stack-based**:
   - Uses recursion (implicit stack) or an explicit stack to keep track of the traversal.

---

### **2. Characteristics of DFS**

- **Traversal Order**:
  - Explores as deeply as possible along one path before backtracking.
- **Primary Data Structures**:
  - Recursion (implicit stack) or explicit stack.
- **Time Complexity**:
  - \( O(V + E) \), where \( V \) is the number of vertices, and \( E \) is the number of edges.
- **Applications**:
  - Pathfinding, connected component detection, permutations/combinations generation, cycle detection.

---

### **3. How DFS Works**

#### **Steps of DFS**
1. Start at the initial node.
2. Mark the current node as visited.
3. Move to an unvisited adjacent node.
4. Backtrack when no adjacent nodes are available.
5. Repeat until all nodes are visited.

---

### **4. DFS Implementation: Step-by-Step with Output**

#### **Graph Representation**
```python
graph = {
    1: [2, 3],
    2: [4, 5],
    3: [6],
    4: [],
    5: [],
    6: []
}
```

#### **DFS Code (Recursive)**
```python
def dfs(graph, node, visited):
    if node not in visited:  # If the node is not visited
        visited.add(node)  # Mark as visited
        print(f"Visited Node: {node}")  # Output visited node

        # Recursively visit adjacent nodes
        for neighbor in graph[node]:
            print(f" → Exploring Edge: {node} → {neighbor}")
            dfs(graph, neighbor, visited)
        print(f" ← Backtracking from Node: {node}")  # Indicate backtracking
```

#### **Execution**
```python
visited = set()
dfs(graph, 1, visited)
```

**Output**:
```
Visited Node: 1
 → Exploring Edge: 1 → 2
Visited Node: 2
 → Exploring Edge: 2 → 4
Visited Node: 4
 ← Backtracking from Node: 4
 → Exploring Edge: 2 → 5
Visited Node: 5
 ← Backtracking from Node: 5
 ← Backtracking from Node: 2
 → Exploring Edge: 1 → 3
Visited Node: 3
 → Exploring Edge: 3 → 6
Visited Node: 6
 ← Backtracking from Node: 6
 ← Backtracking from Node: 3
 ← Backtracking from Node: 1
```

---

### **5. Tips for Remembering DFS**

#### **Key Points to Memorize**
1. **"Go Deep"**:
   - DFS explores one path fully before moving to another.
2. **"Backtrack When Done"**:
   - Returns to the previous node when no further nodes can be visited.
3. **"Use Stack or Recursion"**:
   - Tracks the traversal path and helps backtrack when needed.

#### **Illustration for Visualization**
```plaintext
Graph:
1 → 2 → 4
       → 5
  → 3 → 6

Traversal Order: 1 → 2 → 4 → 5 → 3 → 6
```

---

### **6. Tips for Practicing DFS**

1. **Draw the Graph**:
   - Visualize the graph and trace the traversal path manually.
   - Mark nodes as "Visited" during traversal.

2. **Remember the DFS Process**:
   - "Visit the current node → Explore adjacent nodes → Backtrack when done."

3. **Solve Problems Using DFS**:
   - Pathfinding, maze solving, and generating combinations are good practice problems.

---

### **7. DFS (Stack-Based Implementation)**

DFS can also be implemented using an **explicit stack**.

#### **Stack-Based DFS Code**
```python
def dfs_stack(graph, start):
    visited = set()
    stack = [start]  # Initialize stack

    while stack:
        node = stack.pop()  # Pop a node from the stack
        if node not in visited:
            visited.add(node)
            print(f"Visited Node: {node}")

            # Add adjacent nodes to stack (in reverse order for correct order)
            for neighbor in reversed(graph[node]):
                print(f" → Adding Edge to Stack: {node} → {neighbor}")
                stack.append(neighbor)

    print(f"Visited Order: {visited}")
```

#### **Execution**
```python
dfs_stack(graph, 1)
```

**Output**:
```
Visited Node: 1
 → Adding Edge to Stack: 1 → 3
 → Adding Edge to Stack: 1 → 2
Visited Node: 2
 → Adding Edge to Stack: 2 → 5
 → Adding Edge to Stack: 2 → 4
Visited Node: 4
Visited Node: 5
Visited Node: 3
 → Adding Edge to Stack: 3 → 6
Visited Node: 6
Visited Order: {1, 2, 3, 4, 5, 6}
```

---

### **8. DFS vs BFS**

| **Feature**            | **DFS**                              | **BFS**                              |
|------------------------|--------------------------------------|--------------------------------------|
| **Traversal Direction**| Depth-first (explore deep first)     | Breadth-first (explore all neighbors first) |
| **Traversal Method**   | Recursion or Stack                  | Queue                               |
| **Key Applications**   | Pathfinding, cycle detection, generating permutations/combinations | Shortest path, level-order traversal |

---

### **9. Summary**

- **DFS** is a traversal method where you "go deep" into a graph along one path until no further nodes can be visited, then backtrack.
- It is implemented using **recursion** or a **stack** and is well-suited for problems involving connected data or finding all possible paths.
- **Key Tip**: "Go deep, then backtrack!" to fully understand DFS.
