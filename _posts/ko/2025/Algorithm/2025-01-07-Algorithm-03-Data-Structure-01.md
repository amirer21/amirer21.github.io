---
title: 알고리즘 03 - (자료구조 01 ) 알고리즘 문제를 스스로 사고해서 풀기 위해서는 어떻게 해야될까?
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Algorithm
tags:
- Algorithm
- Data structure
- 
toc: true
toc_sticky: true
toc_label: 목차
description: 알고리즘 - 알고리즘 문제를 스스로 사고해서 풀기 위해서는 어떻게 해야될까?
article_tag1: Algorithm
article_tag2: 
article_tag3: 
article_section: 
meta_keywords: Algorithm, 
last_modified_at: '2025-01-07 21:00:00 +0800'
---


### **알고리즘 문제에서 자주 사용되는 자료구조 유형**


알고리즘은 문제의 특성에 따라 자료구조 유형도 달라집니다. 
자료구조는 데이터를 저장하고 관리하는 방법을 정의하며 특정 문제를 해결할 때 **효율적인 알고리즘**을 설계하기 위해 필수적으로 사용됩니다. 
이번 글에서는 알고리즘 문제에서 자주 등장하는 자료구조 유형과 각 자료구조가 사용되는 사례를 설명합니다.

---

## **1. 배열(Array)**

### **설명**
- 고정된 크기를 가지는 데이터 구조.
- 모든 요소는 동일한 데이터 타입을 가지며 메모리에 연속적으로 저장됩니다.
- 인덱스를 통해 **O(1)**의 시간으로 접근할 수 있습니다.

### **사용 사례**
- 정렬 문제.
- 연속된 데이터를 저장하거나 순서가 중요한 경우.
- 2D 배열(행렬): 그래프 표현, 이미지 처리 등.

#### **예제**
- **문제**: 배열에서 최대값 찾기.
  ```python
  nums = [1, 3, 7, 2, 5]

  # 첫 번째 값을 초기 최대값으로 설정
  max_num = nums[0]

  # 배열을 순회하며 최대값 갱신
  for num in nums:
      if num > max_num:
          max_num = num

  print(max_num)  # 출력: 7
  ```

---

## **2. 리스트(List)**

### **설명**
- 파이썬의 리스트는 동적 배열로 배열과 유사하지만 크기를 동적으로 조정할 수 있습니다.
- 다양한 데이터 타입을 저장 가능.

### **사용 사례**
- 데이터가 동적으로 추가/삭제되는 경우.
- 순서가 중요하며 크기가 고정되지 않는 경우.

#### **예제**
- **문제**: 동적으로 데이터 추가 및 제거.
  ```python
  nums = [1, 2, 3]
  nums.append(4)  # 추가
  nums.remove(2)  # 제거
  print(nums)  # 출력: [1, 3, 4]
  ```

---

## **3. 스택(Stack)**

### **설명**
- LIFO(Last In, First Out): 가장 마지막에 삽입된 데이터가 가장 먼저 제거됩니다.
- 삽입과 삭제는 **O(1)** 시간.

### **사용 사례**
- 함수 호출 스택.
- 괄호 검사 문제.
- 뒤로가기/앞으로가기 기능.

#### **예제**
- **문제**: 올바른 괄호 검사.
  ```python
  def is_valid(s):
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    print(f"입력 문자열: {s}")
    print(f"매핑 정보: {mapping}")
    print("=========================================")
    
    for index, char in enumerate(s):
        print(f"Step {index + 1}: 현재 문자 = '{char}'")
        if char in mapping:
            # 닫는 괄호인 경우
            # 삼항 연산자
            # value = <값1> if <조건> else <값2>
            # <값1>: 조건이 **참(True)**일 때 사용될 값.
            # <값2>: 조건이 **거짓(False)**일 때 사용될 값.
            top = stack.pop() if stack else '#'            
            print(f" - 스택에서 꺼낸 값: {top}")
            if mapping[char] != top:
                print(f" - 불일치: '{char}'는 '{top}'와 매칭되지 않음. 결과: False")
                return False
        else:
            # 여는 괄호인 경우
            stack.append(char)
            print(f" - 스택에 추가: {stack}")
        
        print(f" - 스택 상태: {stack}")
        print("-----------------------------------------")
    
    result = not stack
    print(f"스택이 비었는가? {result}")
    return result

  # 테스트
  s = "()[]{}"
  print("결과:", is_valid(s))  # 출력: True
  ```

  ```
  입력 문자열: ()[]{}
  매핑 정보: {')': '(', '}': '{', ']': '['}
  =========================================
  Step 1: 현재 문자 = '('
  - 스택에 추가: ['(']
  - 스택 상태: ['(']
  -----------------------------------------
  Step 2: 현재 문자 = ')'
  - 스택에서 꺼낸 값: (
  - 스택 상태: []
  -----------------------------------------
  Step 3: 현재 문자 = '['
  - 스택에 추가: ['[']
  - 스택 상태: ['[']
  -----------------------------------------
  Step 4: 현재 문자 = ']'
  - 스택에서 꺼낸 값: [
  - 스택 상태: []
  -----------------------------------------
  Step 5: 현재 문자 = '{'
  - 스택에 추가: ['{']
  - 스택 상태: ['{']
  -----------------------------------------
  Step 6: 현재 문자 = '}'
  - 스택에서 꺼낸 값: {
  - 스택 상태: []
  -----------------------------------------
  스택이 비었는가? True
  결과: True
  ```

---

## **4. 큐(Queue)**

### **설명**
- FIFO(First In, First Out): 가장 먼저 삽입된 데이터가 가장 먼저 제거됩니다.
- 삽입과 삭제는 **O(1)** 시간.

### **사용 사례**
- 데이터가 순서대로 처리되는 경우.
- 너비 우선 탐색(BFS).

#### **예제**
- **문제**: BFS 구현.
  아래는 **BFS 코드에 해설 출력문을 추가한 버전**입니다. 각 단계에서 **큐의 상태**, **현재 노드**, **방문 여부**, **다음 탐색 노드**를 출력하여 BFS 알고리즘의 실행 과정을 쉽게 이해할 수 있도록 작성했습니다.

---

### **코드**

  ```python
  from collections import deque

  def bfs(graph, start):
      visited = set()
      queue = deque([start])
      print(f"그래프 구조: {graph}")
      print(f"시작 노드: {start}")
      print("=====================================")
      
      step = 1
      while queue:
          print(f"Step {step}:")
          print(f" - 현재 큐 상태: {list(queue)}")
          
          # 큐에서 노드를 꺼냄
          node = queue.popleft()
          print(f" - 큐에서 꺼낸 노드: {node}")
          
          # 방문하지 않은 경우
          if node not in visited:
              visited.add(node)
              print(f" - 방문한 노드: {node}")
              print(f" - 방문 상태: {visited}")
              
              # 인접 노드를 큐에 추가
              next_nodes = [n for n in graph[node] if n not in visited]
              queue.extend(next_nodes)
              print(f" - 추가된 노드들: {next_nodes}")
          else:
              print(f" - 노드 {node}는 이미 방문됨")
          
          print(f" - 큐 상태 갱신: {list(queue)}")
          print("-------------------------------------")
          step += 1
      
      print("탐색 완료!")
      print(f"방문한 노드 순서: {visited}")

  # 테스트
  graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
  bfs(graph, 1)  # 출력: 1 2 3 4 5
  ```

  ---

  ### **출력 예시**

  #### **입력 그래프**
  ```python
  graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
  ```

  #### **실행 결과**
  ```
  그래프 구조: {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
  시작 노드: 1
  =====================================
  Step 1:
  - 현재 큐 상태: [1]
  - 큐에서 꺼낸 노드: 1
  - 방문한 노드: 1
  - 방문 상태: {1}
  - 추가된 노드들: [2, 3]
  - 큐 상태 갱신: [2, 3]
  -------------------------------------
  Step 2:
  - 현재 큐 상태: [2, 3]
  - 큐에서 꺼낸 노드: 2
  - 방문한 노드: 2
  - 방문 상태: {1, 2}
  - 추가된 노드들: [4]
  - 큐 상태 갱신: [3, 4]
  -------------------------------------
  Step 3:
  - 현재 큐 상태: [3, 4]
  - 큐에서 꺼낸 노드: 3
  - 방문한 노드: 3
  - 방문 상태: {1, 2, 3}
  - 추가된 노드들: [5]
  - 큐 상태 갱신: [4, 5]
  -------------------------------------
  Step 4:
  - 현재 큐 상태: [4, 5]
  - 큐에서 꺼낸 노드: 4
  - 방문한 노드: 4
  - 방문 상태: {1, 2, 3, 4}
  - 추가된 노드들: []
  - 큐 상태 갱신: [5]
  -------------------------------------
  Step 5:
  - 현재 큐 상태: [5]
  - 큐에서 꺼낸 노드: 5
  - 방문한 노드: 5
  - 방문 상태: {1, 2, 3, 4, 5}
  - 추가된 노드들: []
  - 큐 상태 갱신: []
  -------------------------------------
  탐색 완료!
  방문한 노드 순서: {1, 2, 3, 4, 5}
  ```

  1. **Step-by-Step 출력**:
    - 각 단계에서 현재 **큐의 상태**를 보여줌.
    - 어떤 노드를 꺼내고, 방문했는지를 출력.
    
  2. **큐 상태와 방문 상태 갱신**:
    - 큐에 추가된 노드와 갱신된 큐 상태를 출력.
    - 방문한 노드 집합(visited)을 확인 가능.

  3. **탐색 완료 메시지**:
    - BFS 탐색이 종료되면, 방문한 노드의 순서를 출력.


---

## **5. 우선순위 큐 (Priority Queue)**

### **설명**
- 각 요소에 우선순위를 부여하며 가장 높은 우선순위를 가진 요소가 먼저 처리됩니다.
- 일반적으로 힙(Heap)을 사용해 구현.

### **사용 사례**
- 다익스트라 알고리즘(최단 경로 찾기).
- 이벤트 처리 시스템.

#### **예제**
- **문제**: 우선순위 큐로 가장 작은 값 추출.
  ```python
  import heapq

  nums = [3, 1, 4, 1, 5]
  heapq.heapify(nums)  # 힙 생성
  print(heapq.heappop(nums))  # 출력: 1
  ```

---

## **6. 해시 테이블 (Hash Table)**

### **설명**
- 데이터를 키-값(Key-Value) 형태로 저장.
- 키를 해싱(Hashing)하여 데이터를 빠르게 조회, 삽입, 삭제 가능 (\(O(1)\)).

### **사용 사례**
- 빠른 데이터 조회가 필요한 경우.
- 두 수의 합(Two Sum) 문제.

#### **예제**
- **문제**: Two Sum 문제.
  ```python
  nums = [2, 7, 11, 15]
  target = 9
  num_dict = {}

  for i, num in enumerate(nums):
      complement = target - num
      if complement in num_dict:
          print([num_dict[complement], i])  # 출력: [0, 1]
      num_dict[num] = i
  ```

---

## **7. 집합(Set)**

### **설명**
- 중복을 허용하지 않는 데이터 구조.
- 합집합, 교집합, 차집합 등의 집합 연산이 빠름.

### **사용 사례**
- 중복 제거.
- 빠른 멤버십 테스트(값이 존재하는지 확인).

#### **예제**
- **문제**: 중복 제거.
  ```python
  nums = [1, 2, 2, 3, 4, 4]
  unique_nums = set(nums)
  print(unique_nums)  # 출력: {1, 2, 3, 4}
  ```

---

## **8. 트리(Tree)**

### **설명**
- 계층적 데이터 구조. 부모와 자식 노드로 구성.
- 대표적인 예: 이진 탐색 트리(Binary Search Tree), 힙(Heap), 트라이(Trie).

### **사용 사례**
- 검색, 정렬, 계층적 데이터 표현.
- 힙 정렬, 다익스트라 알고리즘.

#### **예제**
- **문제**: 이진 트리 순회 (DFS).
  ```python
  class TreeNode:
      def __init__(self, val=0, left=None, right=None):
          self.val = val
          self.left = left
          self.right = right

  def inorder_traversal(root):
      if not root:
          return []
      return inorder_traversal(root.left) + [root.val] + inorder_traversal(root.right)

  root = TreeNode(1, None, TreeNode(2, TreeNode(3)))
  print(inorder_traversal(root))  # 출력: [1, 3, 2]
  ```

---

## **9. 그래프(Graph)**

### **설명**
- 정점(Vertex)과 간선(Edge)으로 이루어진 자료구조.
- 방향성, 가중치 여부에 따라 다양한 유형의 그래프가 존재.

### **사용 사례**
- 경로 탐색 (BFS/DFS).
- 최단 경로 문제 (다익스트라, 플로이드 워셜).

#### **예제**
- **문제**: DFS 구현.
  ```python
  def dfs(graph, node, visited=None):
      if visited is None:
          visited = set()
      visited.add(node)
      print(node, end=" ")
      for neighbor in graph[node]:
          if neighbor not in visited:
              dfs(graph, neighbor, visited)

  graph = {1: [2, 3], 2: [4], 3: [5], 4: [], 5: []}
  dfs(graph, 1)  # 출력: 1 2 4 3 5
  ```

---

### **자료구조 선택의 기준**

| **문제 유형**                  | **적합한 자료구조**            |
|--------------------------------|-------------------------------|
| 데이터 순차적 저장 및 검색       | 배열(Array), 리스트(List)      |
| 데이터 중복 제거                | 집합(Set)                     |
| 빠른 데이터 검색 및 저장         | 해시 테이블(Hash Table)        |
| LIFO 구조                       | 스택(Stack)                   |
| FIFO 구조                       | 큐(Queue)                     |
| 최단 경로, 최적화               | 우선순위 큐(Priority Queue)    |
| 계층적 데이터 표현              | 트리(Tree)                    |
| 경로 탐색, 연결된 데이터 탐색    | 그래프(Graph)                 |

---
