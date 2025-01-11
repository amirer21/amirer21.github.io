---
title: 알고리즘 03 - (기본 패턴 02) - (1) 그래프 탐색, DFS (깊이 우선 탐색, Depth-First Search)?
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
toc_label: 목차
description: 알고리즘 - 그래프 탐색, DFS (깊이 우선 탐색, Depth-First Search)
article_tag1: Algorithm
article_tag2: DFS
article_tag3: 
article_section: Algorithm
meta_keywords: Algorithm, DFS
last_modified_at: '2025-01-10 21:00:00 +0800'
---


### **그래프 탐색: DFS (깊이 우선 탐색, Depth-First Search)**

---

### **1. DFS란?**

**DFS(깊이 우선 탐색)**은 **그래프 탐색 알고리즘**으로,
시작 정점에서 출발하여 **한 방향으로 가능한 깊이까지 탐색**한 뒤, 
더 이상 갈 곳이 없으면 되돌아오는 방식입니다.

#### **DFS의 핵심 개념**
1. **깊게 탐색**:
   - 한 노드에서 인접한 노드로 계속 내려가며 탐색.
2. **백트래킹**:
   - 더 이상 탐색할 곳이 없으면 이전 노드로 돌아옴.
3. **재귀(Recursive) 또는 스택(Stack)**:
   - 탐색 경로를 기록하고, 되돌아갈 때 재귀 호출이나 스택을 활용.

---

### **2. DFS의 특징**

- **탐색 순서**:
  - 한 방향으로 탐색할 수 있는 만큼 깊게 들어가며 탐색.
- **주요 데이터 구조**:
  - 재귀 호출(스택 구조를 암묵적으로 활용) 또는 명시적인 스택 사용.
- **시간 복잡도**:
  - \( O(V + E) \): \( V \)는 노드(정점) 수, \( E \)는 간선 수.
- **사용 예**:
  - 경로 찾기, 연결 요소 찾기, 순열/조합 생성, 사이클 탐지.

---

### **3. DFS 동작 방식**

#### **작동 과정**
1. 시작 노드에서 출발.
2. 현재 노드를 방문 상태로 표시.
3. 인접한 노드 중 방문하지 않은 노드로 이동.
4. 이동 가능한 노드가 없으면 이전 노드로 돌아감(백트래킹).
5. 모든 노드를 탐색할 때까지 반복.

---

### **4. DFS 구현: 과정 출력**

#### **그래프**
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

#### **DFS 코드 (재귀 방식)**
```python
def dfs(graph, node, visited):
    if node not in visited:  # 방문하지 않은 경우
        visited.add(node)  # 방문 처리
        print(f"Visited Node: {node}")  # 현재 방문한 노드 출력

        # 인접 노드 재귀 호출
        for neighbor in graph[node]:
            print(f" → Exploring Edge: {node} → {neighbor}")
            dfs(graph, neighbor, visited)
        print(f" ← Backtracking from Node: {node}")  # 백트래킹 표시
```

#### **출력 과정**
```python
visited = set()
dfs(graph, 1, visited)
```

**출력 결과**:
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

### **5. 스스로 사고하고 암기하기 쉽게 정리**

#### **암기 포인트**
1. **"깊이로 들어간다"**:
   - DFS는 하나의 경로로 **끝까지 탐색**합니다.
2. **"다 탐색했으면 되돌아간다"**:
   - 더 이상 갈 곳이 없으면 **백트래킹**으로 돌아옵니다.
3. **"스택 또는 재귀 사용"**:
   - 탐색 경로를 저장하고 되돌아가는 데 사용.

#### **DFS를 기억하기 위한 그림**
```plaintext
Graph:
1 → 2 → 4
       → 5
  → 3 → 6

탐색 순서: 1 → 2 → 4 → 5 → 3 → 6
```

---

### **6. DFS를 위한 팁**

1. **손으로 그림 그리기**:
   - 그래프를 그려서 탐색 경로를 따라가며 손으로 직접 해보기.
   - 예: 노드 방문 시 "Visited"를 표시.

2. **DFS의 순서와 원칙 기억**:
   - "현재 노드를 방문 → 인접 노드 탐색 → 더 이상 없으면 백트래킹."

3. **실제 문제로 연습**:
   - 경로 찾기, 미로 탐색, 조합 생성 등의 문제를 DFS로 풀어보기.

---

### **7. DFS (스택 기반 구현)**

DFS는 **명시적인 스택**으로도 구현할 수 있습니다.

#### **스택 기반 DFS 코드**
```python
def dfs_stack(graph, start):
    visited = set()
    stack = [start]  # 스택 초기화

    while stack:
        node = stack.pop()  # 스택에서 노드 꺼냄
        if node not in visited:
            visited.add(node)
            print(f"Visited Node: {node}")

            # 스택에 인접 노드 추가 (뒤에서부터 처리되므로 역순으로 추가)
            for neighbor in reversed(graph[node]):
                print(f" → Adding Edge to Stack: {node} → {neighbor}")
                stack.append(neighbor)

    print(f"Visited Order: {visited}")
```

#### **출력**
```python
dfs_stack(graph, 1)
```

**출력 결과**:
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

| **특징**               | **DFS**                             | **BFS**                             |
|------------------------|-------------------------------------|-------------------------------------|
| **탐색 방향**          | 깊이 우선 (한 경로로 깊이 탐색)      | 너비 우선 (모든 인접 노드 탐색)      |
| **탐색 방식**          | 재귀 또는 스택 사용                 | 큐 사용                             |
| **주요 사용 사례**     | 경로 찾기, 사이클 탐지, 조합/순열 생성 | 최단 경로, 레벨 탐색                |

---

### **9. 정리**
- **DFS**는 "한 방향으로 끝까지 탐색하고, 더 이상 갈 곳이 없으면 돌아오는" 탐색 방식입니다.
- **재귀**와 **스택**을 사용하며, 연결된 데이터를 처리하는 데 적합합니다.
- 암기법: "깊게 들어가고, 되돌아온다!"
