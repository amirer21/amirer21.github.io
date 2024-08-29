---
title: Artificial Intelligence - Conditional Logic and Parallel Processing with LangChain
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
description: Conditional Logic and Parallel Processing with LangChain
article_tag1: AI
article_tag2: LLM
article_tag3: Langchain
article_section: 
meta_keywords: AI, LLM, Langchain
last_modified_at: '2024-08-22 21:00:00 +0800'
---

# Artificial Intelligence - Conditional Logic and Parallel Processing with LangChain

This tutorial code focuses on learning how to use conditional logic and parallel processing in LangChain. The key takeaways and features of LangChain that you can learn from this code are summarized as follows:

### 1. **Using RunnableLambda**
   - **Function Wrapping**: `RunnableLambda` wraps an existing function and converts it into an executable object within LangChain’s workflow. This allows you to integrate a single function or task as part of a chain.
   - **Flexible Function Use**: Increases the reusability of functions and enables flexible use within a workflow.

### 2. **Using RunnableSequence**
   - **Sequential Task Processing**: By using `RunnableSequence`, multiple `RunnableLambda` objects can be executed sequentially. This allows you to chain multiple steps together and process them in sequence.
   - **Automation of Data Flow**: The output of each step is automatically passed as input to the next step, simplifying the construction of complex workflows.

### 3. **Using RunnableBranch**
   - **Conditional Execution**: `RunnableBranch` is used to execute different tasks based on conditions. Conditional logic allows you to build workflows that handle inputs differently based on their values.
   - **Condition-Based Task Branching**: It evaluates the condition of the input value and performs specific tasks only when that condition is met, allowing for flexible handling of complex business logic.

### 4. **Using RunnableParallel**
   - **Parallel Processing**: `RunnableParallel` allows you to execute multiple tasks in parallel. For example, you can filter and sort even and odd lists simultaneously.
   - **Performance Optimization**: Optimizes task performance through parallel processing. By processing independent tasks in parallel, you can reduce overall processing time.

### 5. **Combination and Extensibility of LangChain**
   - **Modular Design**: Due to LangChain’s modular design, you can combine `RunnableLambda`, `RunnableSequence`, `RunnableBranch`, and `RunnableParallel` to build complex workflows. Each module works independently while harmonizing with others.
   - **Building Scalable Workflows**: This code teaches you how to build scalable workflows using LangChain. For example, you can construct scenarios for processing complex data by combining conditional logic and parallel processing.

### 6. **Handling Various Input Data**
   - **Handling Various Inputs**: You can learn how to handle various types of input data, process them differently based on conditions, and perform only the necessary tasks.
   - **Managing Data Structures**: Learn how to manage input data in list form and effectively handle complex data structures through filtering and sorting based on conditions.

### 7. **Branching and Outputting Results**
   - **Branching Results Based on Conditions**: You can learn how to create different results based on conditions and process them in parallel.
   - **Output of Parallel Processed Results**: By outputting the results processed in parallel individually, you can check whether each task was executed correctly and independently.

A simple example will be provided to explain the usage of `RunnableLambda`, `RunnableSequence`, `RunnableBranch`, and `RunnableParallel`.

Through this code, you can learn how to structure complex workflows using LangChain and implement efficient task processing with conditional branching and parallel processing.

### Scenario:
- There are two lists of numbers: one consisting of only even numbers and the other of only odd numbers.
- Given these lists as input, each list is sorted; the even list is doubled, and the odd list is tripled.
- Finally, these two tasks are processed in parallel, and the results are output.

### Example Code:

```python
from langchain.schema.runnable import RunnableLambda, RunnableSequence, RunnableBranch, RunnableParallel

# 1. Function to filter even numbers from a list
def filter_even_numbers(input_list):
    return [num for num in input_list if num % 2 == 0]

# 2. Function to filter odd numbers from a list
def filter_odd_numbers(input_list):
    return [num for num in input_list if num % 2 != 0]

# 3. Function to sort a list
def sort_list(input_list):
    return sorted(input_list)

# 4. Function to double all numbers in a list
def double_numbers(input_list):
    return [num * 2 for num in input_list]

# 5. Function to triple all numbers in a list
def triple_numbers(input_list):
    return [num * 3 for num in input_list]

# 6. Wrapping functions with RunnableLambda
filter_even_runnable = RunnableLambda(filter_even_numbers)
filter_odd_runnable = RunnableLambda(filter_odd_numbers)
sort_runnable = RunnableLambda(sort_list)
double_runnable = RunnableLambda(double_numbers)
triple_runnable = RunnableLambda(triple_numbers)

# 7. Creating chains to process even and odd numbers using RunnableSequence
even_sequence = RunnableSequence(filter_even_runnable, sort_runnable, double_runnable)
odd_sequence = RunnableSequence(filter_odd_runnable, sort_runnable, triple_runnable)

# 8. Configuring parallel processing with RunnableParallel
parallel_sequence = RunnableParallel(
    even=even_sequence,
    odd=odd_sequence
)

# 9. Input list
input_list = [7, 2, 9, 4, 3, 6, 1, 8]

# 10. Execute the parallel chain
parallel_result = parallel_sequence.invoke(input_list)

# 11. Output the results
print("Parallel processed even list:", parallel_result['even'])
print("Parallel processed odd list:", parallel_result['odd'])
```

### Code Explanation:
1. **filter_even_numbers** and **filter_odd_numbers** functions filter even and odd numbers, respectively.
2. The **sort_list** function sorts the list in ascending order.
3. The **double_numbers** function doubles all the numbers in the list.
4. The **triple_numbers** function triples all the numbers in the list.
5. Each function is wrapped with **RunnableLambda** to create executable objects.
6. **RunnableSequence** creates chains to process the even and odd lists.
7. **RunnableParallel** runs both chains in parallel.
8. **parallel_sequence.invoke** executes the parallel processing and outputs the results for each.

### Execution Results:
```python
Parallel processed even list: [4, 8, 12, 16]
Parallel processed odd list: [3, 9, 21, 27]
```

### Explanation:
- The even list `[2, 4, 6, 8]` is sorted and then doubled to `[4, 8, 12, 16]`.
- The odd list `[7, 9, 3, 1]` is sorted and then tripled to `[3, 9, 21, 27]`.

This example helps you understand how to chain tasks and process them in parallel using LangChain’s `RunnableLambda`, `RunnableSequence`, `RunnableBranch`, and `RunnableParallel`.