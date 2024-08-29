---
title: 인공지능 - LangChain 간단한 예제로 알아보자
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
description: 인공지능 - LangChain 간단한 예제로 학습해보자
article_tag1: AI
article_tag2: LLM
article_tag3: Langchain
article_section: 
meta_keywords: AI, LLM, Langchain
last_modified_at: '2024-08-22 21:00:00 +0800'
---

### LangChain 설치 방법과 간단한 LLM 예제 코드
LangChain을 사용하려면 먼저 Python 환경에서 LangChain 라이브러리를 설치해야 합니다. 이를 위해서는 pip 패키지 관리자를 사용하면 됩니다.

#### 설치 명령어:

```bash
pip install langchain
```

추가적으로 OpenAI와 같은 LLM을 사용하려면 해당 API 클라이언트도 설치해야 합니다. 예를 들어, OpenAI를 사용하려면 아래와 같이 설치할 수 있습니다:

```bash
pip install openai
```

### LangChain의 간단한 사용 예제

아래는 LangChain을 사용해 간단한 체인을 구성하고 실행하는 예제입니다. 이 예제는 OpenAI의 GPT-3를 사용해 입력된 질문에 답변을 생성하는 체인을 구성합니다.

#### 기본 설정:

먼저, OpenAI API 키를 설정해야 합니다. 이 키는 OpenAI에서 발급받을 수 있습니다.

```python
import os
from langchain import OpenAI, LLMChain

# OpenAI API 키 설정
os.environ["OPENAI_API_KEY"] = "your-openai-api-key-here"
```

#### 간단한 체인 생성:

이 예제에서는 사용자로부터 질문을 받아 OpenAI의 GPT-3 모델을 통해 답변을 생성하는 체인을 만듭니다.

```python
from langchain.prompts import PromptTemplate

# 프롬프트 템플릿 정의
prompt_template = PromptTemplate(
    input_variables=["question"],
    template="Q: {question}\nA:"
)

# OpenAI LLM 설정
llm = OpenAI(temperature=0.7)

# LLMChain 생성
chain = LLMChain(llm=llm, prompt=prompt_template)

# 입력 질문
question = "What is the capital of France?"

# 체인 실행 및 출력
answer = chain.run(question)
print(f"Question: {question}")
print(f"Answer: {answer}")
```

#### 실행 결과:

위 코드를 실행하면, OpenAI GPT-3 모델이 질문에 대한 답변을 생성합니다. 예를 들어, 입력 질문이 "What is the capital of France?"라면, 출력은 다음과 같습니다:

```plaintext
Question: What is the capital of France?
Answer: The capital of France is Paris.
```

### 요약

- **설치**: `pip install langchain` 명령어로 LangChain을 설치합니다.
- **API 키 설정**: OpenAI API 키를 환경 변수로 설정합니다.
- **간단한 체인 생성**: LLMChain과 PromptTemplate을 사용해 질문에 답하는 체인을 만듭니다.
- **실행**: 체인을 실행하여 모델의 답변을 출력합니다.

이 간단한 예제를 통해 LangChain을 사용해 LLM 기반의 애플리케이션을 쉽게 개발할 수 있음을 알 수 있습니다. LangChain은 이 외에도 다양한 기능을 제공하여 복잡한 AI 워크플로우를 지원합니다.