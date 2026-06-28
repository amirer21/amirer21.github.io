---
title: "AI 세부 실습 09 - LangChain Prompt, Parser, Chain"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- LangChain
tags:
- AI
- LangChain
- PromptTemplate
- OutputParser
toc: true
toc_sticky: true
toc_label: 목차
description: "20번 실습 파일을 기준으로 LangChain의 PromptTemplate, OutputParser, Chain을 정리합니다."
article_tag1: AI
article_tag2: LangChain
article_tag3: Chain
article_section: AI
meta_keywords: AI, LangChain, PromptTemplate, OutputParser, Chain
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# LangChain Prompt, Parser, Chain

이 글은 다음 원본 실습 파일을 기준으로 정리합니다.

```text
20_langchain_20250422_01_langchain_PromptTemplate.py
20_langchain_20250422_02_langchain_XMLOutputParser.py
20_langchain_20250422_03_langchain_chain.py
20_langchain_20250422_04_llm.py
```

20번 실습은 LangChain의 기본 부품을 다룹니다.

## PromptTemplate

PromptTemplate은 프롬프트 틀입니다.

```python
from langchain.prompts import PromptTemplate

template = "{product} 제품 홍보 문구를 작성해줘"
prompt = PromptTemplate(
    input_variables=["product"],
    template=template,
)

text = prompt.format(product="컴퓨터")
```

매번 문자열을 직접 조립하지 않고, 필요한 값만 넣어 재사용할 수 있습니다.

## LLM

```python
from langchain_openai import ChatOpenAI

gpt = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
result = gpt.invoke(text)
```

LLM은 실제 AI 모델을 호출하는 부분입니다.

## OutputParser

OutputParser는 모델 응답을 원하는 형태로 바꿉니다.

예를 들어 문자열만 필요하면 `StrOutputParser`를 사용합니다.

```python
from langchain_core.output_parsers import StrOutputParser

parser = StrOutputParser()
```

XML이나 JSON 형식으로 결과를 받고 싶을 때도 Parser를 활용할 수 있습니다.

## Chain

Chain은 여러 단계를 연결한 것입니다.

```python
chain = prompt | gpt | StrOutputParser()
result = chain.invoke({"product": "컴퓨터"})
```

이 코드는 다음 순서로 실행됩니다.

```text
입력값
-> 프롬프트 완성
-> LLM 호출
-> 문자열 출력
```

## 정리

20번 실습은 LangChain의 기초 문법입니다.
PromptTemplate, LLM, OutputParser를 이해하면 이후 RAG, Agent, LangGraph 코드를 읽기가 쉬워집니다.
