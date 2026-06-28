---
title: "AI 세부 실습 11 - LangGraph 그래프와 상태 관리"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- LangGraph
tags:
- AI
- LangGraph
- StateGraph
- Workflow
toc: true
toc_sticky: true
toc_label: 목차
description: "24-26번 실습 파일을 기준으로 LangGraph의 노드, 엣지, 상태 관리를 정리합니다."
article_tag1: AI
article_tag2: LangGraph
article_tag3: Workflow
article_section: AI
meta_keywords: AI, LangGraph, StateGraph, 그래프, 상태관리
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# LangGraph 그래프와 상태 관리

이 글은 다음 원본 실습 파일을 기준으로 정리합니다.

```text
24.langchain_20250424_05_dict_graph.py
24.python_dict.py
25.langchain_20250428_01_graph.py
25.langchain_20250428_02_graph.py
26.langchain_20250429_01.py
26.langchain_20250429_02.py
26.langchain_20250429_03.py
26.langchain_20250429_04.py
26일차풀이.py
```

LangGraph는 여러 단계를 노드와 엣지로 연결해 AI 워크플로를 만드는 도구입니다.

## 상태

상태는 각 단계가 공유하는 데이터입니다.

```python
from typing import TypedDict

class State(TypedDict):
    question: str
    answer: str
```

각 노드는 상태를 입력받고, 수정된 상태를 반환합니다.

## 노드

노드는 실제 작업을 수행하는 함수입니다.

```python
def answer_node(state: State) -> State:
    return {
        **state,
        "answer": "AI 답변입니다.",
    }
```

## 엣지

엣지는 다음에 실행할 노드를 정합니다.

```python
graph.add_edge("Start", "Answer")
```

그래프 전체는 다음처럼 읽을 수 있습니다.

```text
시작 노드
-> 처리 노드
-> 다음 노드
-> 종료
```

## 딕셔너리 그래프에서 시작하기

`24.python_dict.py`, `24.langchain_20250424_05_dict_graph.py`는 상태를 딕셔너리로 다루는 감각을 익히는 데 좋습니다.

LangGraph의 상태도 결국 여러 값을 가진 딕셔너리처럼 생각할 수 있습니다.

```python
state = {
    "question": "오늘 배운 내용은?",
    "answer": "",
}
```

## 정리

LangGraph는 복잡한 AI 작업을 단계별로 나누고 상태를 추적하기 좋습니다.
26번 실습까지 이해하면 이후 자동화 파이프라인을 만들 때 흐름을 훨씬 명확하게 설계할 수 있습니다.
