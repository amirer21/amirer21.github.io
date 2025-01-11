---
title: 알고리즘 03 - (기본 패턴 02) - (3) 그래프 탐색, BFS (너비 우선 탐색, Breadth-First Search) 큐(Queue)에서 값이 빠지는 시점?
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
toc_label: 목차
description: 알고리즘 - 그래프 탐색, 큐(Queue)에서 값이 빠지는 시점
article_tag1: Algorithm
article_tag2: BFS
article_tag3: Queue
article_section: Algorithm
meta_keywords: Algorithm, BFS
last_modified_at: '2025-01-11 13:00:00 +0800'
---


### **큐(Queue)에서 값이 빠지는 시점**

**큐(Queue)**는 **FIFO(First-In, First-Out)** 자료구조입니다.  
즉, **먼저 들어간 값(Enqueue)**이 **먼저 빠지는(Dequeue)** 구조입니다.

---

### **큐에서 값이 빠지는 시점**

1. **BFS(너비 우선 탐색)에서**:
   - 큐의 앞에서 값을 꺼낼 때(`queue.popleft()`).
   - 꺼낸 값(노드)은 현재 탐색 중인 노드로 처리되며, 그 노드의 **인접 노드**가 큐에 추가됩니다.

2. **일반적인 큐 동작**:
   - 값이 큐에 추가되면 끝에 붙고(`enqueue`), 값이 빠질 때는 맨 앞에서 제거됩니다(`dequeue`).
   - 맨 앞에 있는 값이 처리되기 전까지는 큐에서 빠지지 않습니다.

---

### **BFS 코드에서 값이 빠지는 예제**

#### **그래프**
```python
graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
```

#### **BFS 코드**
```python
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])  # 큐 초기화

    while queue:
        # 큐에서 값이 빠지는 시점
        node = queue.popleft()  
        print(f"큐에서 빠진 값: {node}")

        if node not in visited:
            visited.add(node)
            print(f"방문한 노드: {node}")
            queue.extend(graph[node])  # 인접 노드를 큐에 추가
            print(f"현재 큐 상태: {list(queue)}")

bfs(graph, 1)
```

---

#### **출력**
```
큐에서 빠진 값: 1
방문한 노드: 1
현재 큐 상태: [2, 3]
큐에서 빠진 값: 2
방문한 노드: 2
현재 큐 상태: [3, 4]
큐에서 빠진 값: 3
방문한 노드: 3
현재 큐 상태: [4, 5]
큐에서 빠진 값: 4
방문한 노드: 4
현재 큐 상태: [5]
큐에서 빠진 값: 5
방문한 노드: 5
현재 큐 상태: []
```

---

### **큐에서 값이 빠지는 순서**

1. **초기 상태**:
   - 큐에 시작 노드 `1` 추가 → 큐: `[1]`.

2. **Step 1**:
   - `1`이 큐에서 빠짐(`popleft`) → 큐: `[]`.
   - `1`의 인접 노드 `[2, 3]` 추가 → 큐: `[2, 3]`.

3. **Step 2**:
   - `2`가 큐에서 빠짐 → 큐: `[3]`.
   - `2`의 인접 노드 `[4]` 추가 → 큐: `[3, 4]`.

4. **Step 3**:
   - `3`이 큐에서 빠짐 → 큐: `[4]`.
   - `3`의 인접 노드 `[5]` 추가 → 큐: `[4, 5]`.

5. **Step 4**:
   - `4`가 큐에서 빠짐 → 큐: `[5]`.
   - `4`의 인접 노드 없음 → 큐: `[5]`.

6. **Step 5**:
   - `5`가 큐에서 빠짐 → 큐: `[]`.
   - 탐색 종료.

---

### **정리**

- **값이 큐에서 빠지는 시점**:
  - 큐의 **맨 앞 값**이 꺼내질 때(`popleft`).
  - 큐에서 빠진 값은 현재 처리 중인 값입니다.

- **BFS에서의 순서**:
  - 먼저 큐에 들어간 값이 먼저 처리되며, 인접 노드를 큐에 추가하여 탐색을 계속 진행합니다.

