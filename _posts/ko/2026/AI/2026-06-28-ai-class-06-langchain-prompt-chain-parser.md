---
title: "AI 강의 정리 06 - LangChain 기초: PromptTemplate, Chain, OutputParser"
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
- LLM
- Chain
toc: true
toc_sticky: true
toc_label: 목차
description: "LangChain의 PromptTemplate, Runnable Chain, OutputParser를 초보자 기준으로 설명합니다."
article_tag1: AI
article_tag2: LangChain
article_tag3: LLM
article_section: AI
meta_keywords: AI, LangChain, PromptTemplate, Chain, OutputParser
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# LangChain을 왜 사용할까?

OpenAI API만 사용해도 AI에게 질문하고 답을 받을 수 있습니다.
그런데 실제 서비스를 만들다 보면 질문 하나로 끝나지 않습니다.

예를 들어 다음 작업을 생각해 보겠습니다.

```text
영어 문장을 입력받는다
-> 한국어로 번역한다
-> 번역 결과를 한 문장으로 요약한다
-> 결과만 깔끔하게 화면에 출력한다
```

이런 작업은 여러 단계를 연결해야 합니다.
LangChain은 이런 LLM 작업 흐름을 쉽게 구성하도록 도와주는 Python 라이브러리입니다.

강의 폴더에서는 다음 실습들이 이 주제에 해당합니다.

- PromptTemplate으로 프롬프트 재사용
- OutputParser로 응답 형식 정리
- Prompt, LLM, Parser를 Chain으로 연결
- LangChain LLM 호출 기초
- Sequential Chain으로 여러 단계 연결
- 대화형 Chain과 메모리 흐름
- 스트리밍 채팅 출력

## LangChain의 핵심 구성요소

LangChain을 처음 볼 때는 다음 세 가지를 먼저 이해하면 됩니다.

| 구성요소 | 역할 |
| --- | --- |
| PromptTemplate | 프롬프트 문장 틀 만들기 |
| LLM | 실제 AI 모델 호출 |
| OutputParser | AI 응답을 원하는 형태로 변환 |

이 세 가지를 연결하면 Chain이 됩니다.

```text
PromptTemplate
-> LLM
-> OutputParser
```

## PromptTemplate

PromptTemplate은 프롬프트를 매번 직접 문자열로 만들지 않도록 도와줍니다.

예를 들어 제품 홍보 문구를 만드는 프롬프트가 있다고 가정합니다.

```python
from langchain.prompts import PromptTemplate

template = "{product} 제품 홍보 문구를 작성해줘"
prompt = PromptTemplate(
    input_variables=["product"],
    template=template,
)

formatted_prompt = prompt.format(product="컴퓨터")
print(formatted_prompt)
```

출력은 다음과 같습니다.

```text
컴퓨터 제품 홍보 문구를 작성해줘
```

비전공자 관점에서는 메일 병합과 비슷합니다.
문장 틀을 만들어 두고, 필요한 값만 바꿔 넣는 방식입니다.

## LLM 호출

LangChain에서는 `ChatOpenAI` 같은 클래스로 모델을 호출합니다.

```python
from langchain_openai import ChatOpenAI

gpt = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
result = gpt.invoke("컴퓨터 제품 홍보 문구를 작성해줘")

print(result.content)
```

`temperature=0`은 답변을 비교적 일관되게 만들겠다는 뜻입니다.
값이 높아질수록 더 창의적이지만 예측하기 어려운 답변이 나올 수 있습니다.

## OutputParser

AI 모델의 응답은 객체 형태로 돌아오는 경우가 많습니다.
화면에 표시하거나 다음 단계로 넘기려면 문자열만 필요할 때가 있습니다.

이때 `StrOutputParser`를 사용합니다.

```python
from langchain_core.output_parsers import StrOutputParser

parser = StrOutputParser()
```

체인에 붙이면 모델 응답에서 텍스트만 꺼내 다음 단계로 넘길 수 있습니다.

## Runnable Chain

최근 LangChain 예제에서는 `|` 연산자를 사용해 체인을 연결하는 방식이 많이 사용됩니다.

```python
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

prompt = PromptTemplate.from_template(
    "다음 문장을 한글로 번역하세요:\n\n{sentence}"
)

chain = prompt | llm | StrOutputParser()

result = chain.invoke({
    "sentence": "Starbucks Korea plans to open a new store near Sinchon Station in Seoul."
})

print(result)
```

이 코드는 다음 흐름입니다.

```text
입력값 sentence
-> PromptTemplate에 넣어 프롬프트 완성
-> LLM 호출
-> 문자열로 변환
```

## 여러 단계를 연결하기

강의 코드에는 번역 후 요약하는 예제가 있습니다.

```python
from langchain_core.runnables import RunnableLambda

prompt_translate = PromptTemplate.from_template(
    "다음 문장을 한글로 번역하세요:\n\n{sentence}"
)

prompt_summary = PromptTemplate.from_template(
    "다음 문장을 한 문장으로 요약하세요:\n\n{translation}"
)

chain = (
    prompt_translate
    | llm
    | StrOutputParser()
    | RunnableLambda(lambda output: {"translation": output})
    | prompt_summary
    | llm
    | StrOutputParser()
)
```

여기서 중요한 부분은 `RunnableLambda`입니다.

첫 번째 LLM의 결과는 그냥 문자열입니다.
그런데 두 번째 프롬프트는 `{translation}`이라는 이름의 입력값을 기대합니다.
그래서 문자열을 딕셔너리 형태로 바꿔 줍니다.

```python
RunnableLambda(lambda output: {"translation": output})
```

흐름을 그림처럼 쓰면 다음과 같습니다.

```text
영어 문장
-> 번역 프롬프트
-> LLM
-> 한국어 번역문
-> {"translation": 번역문}
-> 요약 프롬프트
-> LLM
-> 최종 요약문
```

## 예전 방식과 새 방식

강의 코드에는 다음 메모가 있습니다.

```text
0.3.13: LLMChain, SequentialChain 사용 가능
0.3.23 이상: RunnableSequence와 | 연산자 중심 권장
```

LangChain은 버전 변화가 빠른 편입니다.
그래서 예전 블로그 글이나 강의 자료를 그대로 실행하면 import 경로나 클래스 이름이 바뀌어 오류가 날 수 있습니다.

자주 보는 오류는 다음과 같습니다.

```text
ModuleNotFoundError: No module named 'langchain_community'
```

이 경우 필요한 패키지를 추가 설치해야 합니다.

```bash
pip install langchain-community
```

## LangChain을 쓰면 좋은 경우

LangChain은 다음 상황에서 유용합니다.

- 프롬프트를 여러 개 연결할 때
- PDF, CSV, 웹 문서 같은 로더를 사용할 때
- RAG를 구성할 때
- 챗봇 대화 기록을 관리할 때
- Agent를 만들 때
- LangGraph와 함께 상태 기반 워크플로를 만들 때

반대로 단순히 질문 하나 보내고 답 하나 받는 정도라면 OpenAI SDK만 써도 충분할 수 있습니다.

## 정리

LangChain의 기초는 어렵게 생각할 필요가 없습니다.

- PromptTemplate은 프롬프트 틀입니다.
- LLM은 AI 모델 호출입니다.
- OutputParser는 결과 정리입니다.
- Chain은 이 단계들을 순서대로 연결한 것입니다.
- `|` 연산자를 사용하면 파이프라인처럼 읽을 수 있습니다.

다음 글에서는 LangGraph를 사용해 여러 단계를 상태 기반 워크플로로 연결하는 방법을 정리합니다.
