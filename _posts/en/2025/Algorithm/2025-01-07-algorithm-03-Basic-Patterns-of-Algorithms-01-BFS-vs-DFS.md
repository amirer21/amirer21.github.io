---
title: Algorithm 03 - (Basic Pattern 01) - Differences Between DFS (Depth-First Search) and BFS (Breadth-First Search)
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
- BFS
toc: true
toc_sticky: true
toc_label: Table of Contents
description: Algorithm - Differences Between DFS (Depth-First Search) and BFS (Breadth-First Search)
article_tag1: Algorithm
article_tag2: DFS
article_tag3: BFS
article_section: Algorithm
meta_keywords: Algorithm, DFS, BFS
last_modified_at: '2025-01-07 21:00:00 +0800'
---

Let’s explore the differences between DFS (Depth-First Search) and BFS (Breadth-First Search) using a visual representation.

**Example Tree Structure**  
```
       1
     / | \
    2  3  4
   / \    |
  5   6   7
```

---

### 1. **DFS (Depth-First Search)**
- Explores one path completely before moving to another path.
- Example: 1 → 2 → 5 → 6 → 3 → 4 → 7

Visualization:
```
1
|
2
|
5 → backtrack → 6 → backtrack
|
3 → backtrack
|
4
|
7 → backtrack
```

---

### 2. **BFS (Breadth-First Search)**
- Explores all nodes at the current level before moving to the next level.
- Example: 1 → 2 → 3 → 4 → 5 → 6 → 7

Visualization:
```
Level 0: 1
        |
Level 1: 2 → 3 → 4
        |
Level 2: 5 → 6 → 7
```

---

### Key Differences
| **Feature**       | **DFS**                                   | **BFS**                        |
|-------------------|-------------------------------------------|---------------------------------|
| **Search Method**  | Depth-first (explores one path to the end) | Breadth-first (explores level by level) |
| **Implementation** | Stack (via recursion or explicit stack)    | Queue (FIFO structure)          |
| **Traversal Order**| Dives deeply into paths (includes backtracking) | Explores all nodes at the same depth first |
