---
title: 인공지능 - LangChain을 활용한 조건부 논리와 병렬 처리
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
tags:
- AI
- LLM
- Langchain
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - LangChain을 활용한 조건부 논리와 병렬 처리 학습
article_tag1: AI
article_tag2: LLM
article_tag3: Langchain
article_section: 
meta_keywords: AI, LLM, Langchain
last_modified_at: '2024-08-22 21:00:00 +0800'
---

이 실습 코드는 LangChain에서 조건부 논리와 병렬 처리를 사용하는 방법을 학습하는 데 중점을 둡니다. 이 코드를 통해 배울 수 있는 주요 내용과 LangChain의 기능을 다음과 같이 정리할 수 있습니다:

### 1. **RunnableLambda 사용**
   - **함수 래핑**: `RunnableLambda`는 기존 함수를 래핑하여 LangChain의 워크플로우에서 실행 가능한 객체로 변환합니다. 이를 통해 단일 함수나 작업을 체인의 일부로 통합할 수 있습니다.
   - **유연한 함수 사용**: 함수의 재사용성을 높이고, 이를 워크플로우 내에서 유연하게 사용할 수 있습니다.

### 2. **RunnableSequence 사용**
   - **작업의 순차적 처리**: `RunnableSequence`를 사용하면 여러 `RunnableLambda` 객체를 순차적으로 실행할 수 있습니다. 이는 여러 단계로 구성된 작업을 체인 형태로 구성하여 처리할 수 있게 해줍니다.
   - **데이터 흐름의 자동화**: 각 단계의 출력이 다음 단계의 입력으로 자동으로 전달되며, 복잡한 워크플로우를 간단하게 구성할 수 있습니다.

### 3. **RunnableBranch 사용**
   - **조건부 실행**: `RunnableBranch`는 조건에 따라 다른 작업을 실행하는 데 사용됩니다. 조건부 로직을 통해 입력 값에 따라 다르게 처리하는 워크플로우를 구축할 수 있습니다.
   - **조건 기반 작업 분기**: 입력 값의 조건을 평가한 후, 해당 조건을 만족할 때만 특정 작업을 수행하도록 합니다. 이를 통해 복잡한 비즈니스 로직을 유연하게 처리할 수 있습니다.

### 4. **RunnableParallel 사용**
   - **병렬 처리**: `RunnableParallel`을 사용하여 여러 작업을 병렬로 실행할 수 있습니다. 예를 들어, 짝수와 홀수 리스트를 병렬로 필터링하고 정렬하는 작업을 동시에 수행할 수 있습니다.
   - **성능 최적화**: 병렬 처리를 통해 작업의 성능을 최적화할 수 있습니다. 특히, 독립적인 작업을 병렬로 처리함으로써 전체 처리 시간을 줄일 수 있습니다.

### 5. **LangChain의 조합 및 확장성**
   - **모듈식 설계**: LangChain의 모듈식 설계로 인해, `RunnableLambda`, `RunnableSequence`, `RunnableBranch`, `RunnableParallel` 등을 조합하여 복잡한 워크플로우를 구축할 수 있습니다. 각 모듈은 독립적으로 동작하면서도 서로 조화를 이룹니다.
   - **확장 가능한 워크플로우 구축**: 이 코드를 통해 LangChain을 사용하여 확장 가능한 워크플로우를 구축하는 방법을 배울 수 있습니다. 예를 들어, 조건부 로직과 병렬 처리를 결합하여 복잡한 데이터를 처리하는 시나리오를 구성할 수 있습니다.

### 6. **다양한 입력 데이터 처리**
   - **다양한 입력에 대한 대응**: 입력 데이터가 다양한 형태로 들어올 때, 조건에 따라 다르게 처리하고, 필요한 작업만 수행하는 방법을 배울 수 있습니다.
   - **데이터 구조 관리**: 입력 데이터를 리스트 형태로 관리하고, 이를 조건에 맞게 필터링 및 정렬하는 과정을 통해 복잡한 데이터 구조를 효과적으로 다루는 방법을 익힐 수 있습니다.

### 7. **결과의 분기 및 출력**
   - **조건에 따른 결과 분기**: 조건에 따라 다른 결과를 생성하고 이를 병렬로 처리하는 방법을 학습할 수 있습니다.
   - **병렬 처리된 결과의 출력**: 병렬로 처리된 결과를 개별적으로 출력하여, 각 작업이 독립적으로 올바르게 수행되었는지 확인할 수 있습니다.


간단한 예제를 통해 `RunnableLambda`, `RunnableSequence`, `RunnableBranch`, 그리고 `RunnableParallel`의 사용법을 설명하겠습니다.

이 코드를 통해, LangChain을 사용하여 복잡한 워크플로우를 어떻게 구성하고, 조건에 따른 분기와 병렬 처리를 통해 효율적인 작업 처리를 구현하는 방법을 학습할 수 있습니다.

### 시나리오:
- 두 개의 숫자 리스트가 있습니다: 하나는 짝수들로만 구성되고, 다른 하나는 홀수들로만 구성됩니다.
- 이 리스트들을 입력으로 받아 각각 정렬한 후, 짝수 리스트는 두 배로 만들고, 홀수 리스트는 세 배로 만듭니다.
- 마지막으로, 이 두 작업을 병렬로 처리하여 결과를 출력합니다.

### 코드 예제:

```python
from langchain.schema.runnable import RunnableLambda, RunnableSequence, RunnableBranch, RunnableParallel

# 1. 리스트에서 짝수만 필터링하는 함수
def filter_even_numbers(input_list):
    return [num for num in input_list if num % 2 == 0]

# 2. 리스트에서 홀수만 필터링하는 함수
def filter_odd_numbers(input_list):
    return [num for num in input_list if num % 2 != 0]

# 3. 리스트를 정렬하는 함수
def sort_list(input_list):
    return sorted(input_list)

# 4. 리스트의 모든 숫자를 두 배로 만드는 함수
def double_numbers(input_list):
    return [num * 2 for num in input_list]

# 5. 리스트의 모든 숫자를 세 배로 만드는 함수
def triple_numbers(input_list):
    return [num * 3 for num in input_list]

# 6. RunnableLambda로 함수들을 래핑
filter_even_runnable = RunnableLambda(filter_even_numbers)
filter_odd_runnable = RunnableLambda(filter_odd_numbers)
sort_runnable = RunnableLambda(sort_list)
double_runnable = RunnableLambda(double_numbers)
triple_runnable = RunnableLambda(triple_numbers)

# 7. RunnableSequence로 짝수와 홀수를 처리하는 체인 생성
even_sequence = RunnableSequence(filter_even_runnable, sort_runnable, double_runnable)
odd_sequence = RunnableSequence(filter_odd_runnable, sort_runnable, triple_runnable)

# 8. RunnableParallel을 사용해 병렬 처리 구성
parallel_sequence = RunnableParallel(
    even=even_sequence,
    odd=odd_sequence
)

# 9. 입력 리스트
input_list = [7, 2, 9, 4, 3, 6, 1, 8]

# 10. 병렬 체인 실행
parallel_result = parallel_sequence.invoke(input_list)

# 11. 결과 출력
print("병렬 처리된 짝수 리스트:", parallel_result['even'])
print("병렬 처리된 홀수 리스트:", parallel_result['odd'])
```

### 코드 설명:
1. **filter_even_numbers**와 **filter_odd_numbers** 함수는 각각 짝수와 홀수를 필터링합니다.
2. **sort_list** 함수는 리스트를 오름차순으로 정렬합니다.
3. **double_numbers** 함수는 리스트의 모든 숫자를 두 배로 만듭니다.
4. **triple_numbers** 함수는 리스트의 모든 숫자를 세 배로 만듭니다.
5. **RunnableLambda**로 각각의 함수를 래핑하여 실행 가능한 객체로 만듭니다.
6. **RunnableSequence**로 짝수와 홀수 리스트를 처리하는 체인을 만듭니다.
7. **RunnableParallel**로 두 개의 체인을 병렬로 실행합니다.
8. **parallel_sequence.invoke**로 병렬 처리를 실행하고, 각각의 결과를 출력합니다.

### 실행 결과:
```python
병렬 처리된 짝수 리스트: [4, 8, 12, 16]
병렬 처리된 홀수 리스트: [3, 9, 21, 27]
```

### 설명:
- 짝수 리스트 `[2, 4, 6, 8]`는 정렬된 후 두 배로 증가하여 `[4, 8, 12, 16]`이 됩니다.
- 홀수 리스트 `[7, 9, 3, 1]`는 정렬된 후 세 배로 증가하여 `[3, 9, 21, 27]`이 됩니다.

이 예제는 LangChain의 `RunnableLambda`, `RunnableSequence`, `RunnableBranch`, `RunnableParallel` 등을 사용해 작업을 체인으로 연결하고, 병렬로 처리하는 방법을 이해하는 데 도움이 됩니다.