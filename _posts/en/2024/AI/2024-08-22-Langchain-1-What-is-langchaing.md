---
title: Artificial Intelligence - What is LangChain?
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
description: What is LangChain and where is it used?
article_tag1: AI
article_tag2: LLM
article_tag3: Langchain
article_section: 
meta_keywords: AI, LLM, Langchain
last_modified_at: '2024-08-22 21:00:00 +0800'
---

# Artificial Intelligence - What is LangChain?
### What is LangChain?
**LangChain** is a framework for developing applications that utilize large language models (LLMs). This framework simplifies all the necessary steps for the development, production, and deployment of applications using LLMs, providing various tools and libraries for this purpose.

#### Source: https://python.langchain.com/v0.2/docs/introduction/

**LangChain** is a framework for developing applications that utilize large language models (LLMs). This framework simplifies all the necessary steps for the development, production, and deployment of applications using LLMs, providing various tools and libraries for this purpose.

### Main Uses and Features of LangChain

1. **Development**:
   - **Open-Source Building Blocks**: LangChain provides tools needed to build applications through various open-source components and third-party integrations.
   - **LangGraph**: Enables the construction of state management agents with streaming and human-in-the-loop capabilities.

2. **Production**:
   - **LangSmith**: Helps optimize and confidently deploy applications by inspecting, monitoring, and evaluating Chains.

3. **Deployment**:
   - **LangGraph Cloud**: Converts developed LangGraph applications into APIs and Assistants, allowing them to be deployed to production immediately.

### LangChain Framework Components

![img](/assets/images/ai/langchain_stack_062024.svg "ai exam")

LangChain is composed of various open-source libraries, each performing specific functions:

1. **langchain-core**:
   - Provides the core abstractions and representation language of LangChain.

2. **langchain-community**:
   - Supports third-party integrations.

3. **Partner Packages**:
   - Lightweight packages for specific integrations, such as `langchain-openai` and `langchain-anthropic`. These depend only on `langchain-core`.

4. **langchain**:
   - Includes Chains, Agents, and retrieval strategies that make up the cognitive architecture of applications.

5. **LangGraph**:
   - Models steps as edges and nodes in a graph structure, allowing the construction of robust state-based multi-actor applications using LLMs. It can be integrated with LangChain but can also be used independently.

6. **LangServe**:
   - Allows LangChain chains to be deployed as REST APIs.

7. **LangSmith**:
   - A developer platform for debugging, testing, evaluating, and monitoring LLM applications.

### Summary

**LangChain** is a framework designed for the development of applications utilizing large language models (LLMs). It provides various tools and libraries to help developers easily develop and deploy LLM-based applications. LangChain is particularly strong in handling complex conditional logic, parallel processing, and building state management agents, making AI application development and operations more efficient and flexible.