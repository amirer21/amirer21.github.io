---
title: 알고리즘 03 - (기본 패턴 01) - DFS(Depth-First Search)와 BFS(Breadth-First Search)의 차이
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
toc_label: 목차
description: 알고리즘 - DFS(Depth-First Search)와 BFS(Breadth-First Search)의 차이
article_tag1: Algorithm
article_tag2: DFS
article_tag3: BFS
article_section: Algorithm
meta_keywords: Algorithm, DFS, BFS
last_modified_at: '2025-01-07 21:00:00 +0800'
---


DFS(Depth-First Search)와 BFS(Breadth-First Search)의 차이를 도식화로 살펴보겠습니다.

**예시 트리 구조**  
```
       1
     / | \
    2  3  4
   / \    |
  5   6   7
```

---

### 1. **DFS (깊이 우선 탐색)**
- 한 경로를 끝까지 탐색한 후 다른 경로로 이동합니다.
- 예: 1 → 2 → 5 → 6 → 3 → 4 → 7

도식화:
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

### 2. **BFS (너비 우선 탐색)**
- 각 레벨별로 탐색하며, 동일한 깊이의 모든 노드를 탐색한 후 다음 깊이로 넘어갑니다.
- 예: 1 → 2 → 3 → 4 → 5 → 6 → 7

도식화:
```
Level 0: 1
        |
Level 1: 2 → 3 → 4
        |
Level 2: 5 → 6 → 7
```

---

### 주요 차이점
| **특징**         | **DFS**                                   | **BFS**                        |
|-------------------|-------------------------------------------|---------------------------------|
| **탐색 방식**     | 깊이 우선 (한 경로 끝까지 탐색)            | 너비 우선 (레벨별 탐색)          |
| **구현 방식**     | 스택(재귀 호출 또는 명시적 스택 사용)       | 큐(선입선출 구조 사용)          |
| **경로 탐색 순서** | 경로를 깊게 파고듦 (Backtracking 포함)      | 모든 노드를 동일 깊이로 탐색    |

