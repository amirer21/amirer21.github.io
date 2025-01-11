---
title: Algorithm 03 - (Data Structure 03) Queue - What Does "Visited State" Mean?
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
description: Algorithm - Data Structure, Queue - What Does "Visited State" Mean?
article_tag1: Algorithm
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Algorithm, 
last_modified_at: '2025-01-07 21:00:00 +0800'
---

### **What Does "Visited State" Mean?**

The **visited state** refers to the status of a node in a **graph traversal** that indicates whether the node is **currently being explored**, **has already been explored**, or **has not yet been explored**.

#### **Role of the "Visited State"**
1. **Prevent Redundant Exploration**:
   - Nodes that are already visited are not explored again.
   - Essential for **avoiding infinite loops** and **enhancing traversal efficiency**.

2. **Track Traversal Progress**:
   - During BFS/DFS, it keeps a record of which nodes have been explored.

3. **Verify Completion**:
   - After traversal, the visited state helps confirm which nodes were reached.

---

### **Ways to Represent the Visited State**

#### **1. Set**
- A set is used to store visited nodes.
- In Python: `visited = set()`.

```python
visited.add(node)  # Mark the node as visited
if node in visited:  # Check if the node is already visited
    pass
```

#### **2. List**
- Uses the node's index to record its visited status.
- `True` for visited, `False` for not visited.

```python
visited = [False] * num_nodes
visited[node] = True  # Mark the node as visited
```

#### **3. Dictionary**
- For dictionary-based graph representations, store each node's visited state as a key-value pair.

```python
visited = {}
visited[node] = True  # Mark the node as visited
```

---

### **Example of Using Visited State**

#### **BFS with Visited State**
In the following BFS example, the **`visited` set** keeps track of the visited nodes.

1. **Check if a Node is Visited**:
   ```python
   if node not in visited:  # If the node has not been visited
   ```

2. **Update Visited State**:
   ```python
   visited.add(node)  # Mark the current node as visited
   ```

3. **Handle Neighboring Nodes**:
   ```python
   next_nodes = [n for n in graph[node] if n not in visited]
   queue.extend(next_nodes)  # Add only unvisited nodes to the queue
   ```

---

### **Visited State in the Traversal Process**

1. **Initial State**:
   - Visited state: an empty set `{}`.
   - Start node added to the queue: `[1]`.

2. **Traversal Steps**:
   - Dequeue a node.
   - Add it to the visited state.
   - Enqueue unvisited neighbors.

3. **Termination**:
   - Traversal ends when the queue is empty.

---

### **Visited State vs. Sorting**

- The visited state is a **record of nodes explored during traversal**, not a sorting operation.
- In BFS, nodes are visited in the order they are dequeued, which depends on traversal logic, not on node values.

#### Example:
Input graph:
```python
graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
```

Visited state:
- The nodes are visited in the order `{1, 2, 3, 4, 5}`, based on traversal.
- This order reflects the traversal process, not a sorting operation.

---

### **Summary**

- **What is the "Visited State"?**
  - Tracks whether a node has been explored during graph traversal.
  - Used to prevent redundant exploration, manage traversal flow, and confirm completion.
  
- **How is it Represented?**
  - Using sets, lists, or dictionaries depending on the graph representation.

- **Visited State vs. Sorting**:
  - The visited state is a record of traversal, whereas sorting involves rearranging values in a specific order.
