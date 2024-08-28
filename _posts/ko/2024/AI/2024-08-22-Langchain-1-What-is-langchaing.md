---
title: 인공지능 - LangChain이란?
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
description: 인공지능 - LangChain은 무엇이고, 어디에 쓰이는가?
article_tag1: AI
article_tag2: LLM
article_tag3: Langchain
article_section: 
meta_keywords: AI, LLM, Langchain
last_modified_at: '2024-08-22 21:00:00 +0800'
---

### LangChain이란?
**LangChain**은 대규모 언어 모델(LLM)을 활용하여 애플리케이션을 개발하기 위한 프레임워크입니다. 이 프레임워크는 LLM을 사용한 애플리케이션의 개발, 생산화, 배포 과정에서 필요한 모든 단계를 단순화하고, 이를 위한 다양한 도구와 라이브러리를 제공합니다.

#### 출처 : https://python.langchain.com/v0.2/docs/introduction/

**LangChain**은 대규모 언어 모델(LLM)을 활용하여 애플리케이션을 개발하기 위한 프레임워크입니다. 이 프레임워크는 LLM을 사용한 애플리케이션의 개발, 생산화, 배포 과정에서 필요한 모든 단계를 단순화하고, 이를 위한 다양한 도구와 라이브러리를 제공합니다.

### LangChain의 주요 용도와 기능

1. **개발**:
   - **오픈소스 빌딩 블록**: LangChain은 다양한 오픈소스 구성 요소와 타사 통합을 통해 애플리케이션을 빌드하는 데 필요한 도구를 제공합니다.
   - **LangGraph**: 스트리밍 및 인간 참여 지원 기능이 포함된 상태 관리 에이전트를 구축할 수 있습니다.

2. **생산화**:
   - **LangSmith**: 체인(Chain)을 검사, 모니터링 및 평가하여 애플리케이션을 최적화하고 자신감을 가지고 배포할 수 있도록 돕습니다.

3. **배포**:
   - **LangGraph Cloud**: 개발된 LangGraph 애플리케이션을 API와 Assistant로 변환하여 즉시 프로덕션에 배포할 수 있습니다.

### LangChain 프레임워크 구성 요소

![img](/assets/images/ai/langchain_stack_062024.svg "ai exam")


LangChain은 다양한 오픈소스 라이브러리로 구성되어 있으며, 각각의 라이브러리는 특정한 기능을 수행합니다:

1. **langchain-core**:
   - LangChain의 기본 추상화와 표현 언어를 제공합니다.

2. **langchain-community**:
   - 타사 통합을 지원합니다.

3. **파트너 패키지**:
   - 특정 통합을 위한 경량 패키지로, 예를 들어 `langchain-openai`, `langchain-anthropic` 등이 있습니다. 이들은 `langchain-core`에만 의존합니다.

4. **langchain**:
   - 애플리케이션의 인지 아키텍처를 구성하는 체인(Chain), 에이전트(Agent), 그리고 검색 전략을 포함합니다.

5. **LangGraph**:
   - 그래프 구조에서 단계를 에지와 노드로 모델링하여, LLM을 사용한 견고한 상태 기반 멀티 액터 애플리케이션을 구축할 수 있습니다. LangChain과 통합되어 사용할 수 있지만, 독립적으로도 사용 가능합니다.

6. **LangServe**:
   - LangChain 체인을 REST API로 배포할 수 있게 해줍니다.

7. **LangSmith**:
   - LLM 애플리케이션을 디버깅, 테스트, 평가, 모니터링할 수 있는 개발자 플랫폼입니다.

### 요약

**LangChain**은 대규모 언어 모델(LLM)을 활용한 애플리케이션 개발을 위해 설계된 프레임워크로, 개발자들이 LLM 기반의 애플리케이션을 쉽게 개발하고 배포할 수 있도록 돕는 다양한 도구와 라이브러리를 제공합니다. LangChain은 특히 복잡한 조건부 로직, 병렬 처리, 상태 관리 에이전트 구축에 강점을 가지며, 이를 통해 AI 애플리케이션의 개발과 운영을 보다 효율적이고 유연하게 만들 수 있습니다.