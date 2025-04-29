---
title: 인공지능 - LangChain PromptTemplate - Partial Variables를 활용해보기
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- LangChain
- LLM
- ChatGPT
tags:
- AI
- LangChain
- LLM
- ChatGPT
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - LangChain PromptTemplate - Partial Variables를 활용해보기
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


# 📝 LangChain PromptTemplate - Partial Variables를 활용해보기

AI 프로젝트를 개발할 때,  
"프롬프트 안에 고정된 값과 사용자가 입력하는 값"을 동시에 다뤄야 하는 경우가 많습니다.

예를 들어, 매일 변하지 않는 인사말이나 시스템 정보를 프롬프트에 항상 넣고,  
사용자 이름이나 질문 같은 입력만 따로 받고 싶을 때가 있죠.

이럴 때 유용하게 사용할 수 있는 기능이 바로  
**LangChain의 PromptTemplate의 `partial_variables` 옵션**입니다.

오늘은 간단한 예제 코드를 통해 이 기능을 쉽게 이해해보겠습니다!

---

## 📄 기본 예제 코드

아래는 LangChain을 이용해  
**고정된 날짜(day)와 입력받는 사용자 이름(name)** 을 조합해 문장을 만드는 예제입니다.

```python
# 설치 필요
# pip install langchain langchain-openai

import os
import warnings
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate

warnings.filterwarnings("ignore", category=UserWarning)

# .env에서 OpenAI API 키 로드
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")

# 프롬프트 템플릿 정의
template = "오늘은 {day}입니다. {name}님, 좋은 하루 되세요!"
prompt = PromptTemplate(
    template=template,
    input_variables=["name"],  # 입력 받을 변수
    partial_variables={"day": "월요일"}  # 고정할 변수
)

# 프롬프트 사용
formatted_prompt = prompt.format(name="민수")

# 결과 출력
print(formatted_prompt)
```

---

## 🧩 코드 흐름 설명

1. **PromptTemplate**을 생성합니다.
2. `template`에는 `{day}`와 `{name}` 두 개의 변수를 사용합니다.
3. `input_variables`에는 `"name"`만 지정합니다. (사용자 입력)
4. `partial_variables`에는 `"day"`를 `"월요일"`로 고정합니다.
5. `.format()` 호출 시 사용자 이름(`name`)만 입력하면 됩니다.

결국, 시스템이 항상 "**오늘은 월요일입니다.**" 라고 말하게 만들고,  
사용자 이름만 바꿔서 개인화된 인삿말을 생성하는 것입니다.

---

## 📈 실행 결과

실행하면 다음과 같은 출력이 나옵니다.

```plaintext
오늘은 월요일입니다. 민수님, 좋은 하루 되세요!
```

깔끔하게 **고정 값 + 입력 값** 조합된 문장을 만들 수 있습니다.

---

## ✨ Partial Variables를 사용하는 이유

| 장점 | 설명 |
|:---|:---|
| **고정 정보 관리** | 매번 입력할 필요 없이 변하지 않는 값을 미리 설정할 수 있습니다. |
| **프롬프트 간결화** | 사용자 입력만 신경쓰면 되기 때문에 코드가 훨씬 깔끔해집니다. |
| **유연성 확보** | 필요할 때 고정값만 바꿔서 다른 상황에도 쉽게 재사용할 수 있습니다. |
| **에러 방지** | 누락된 입력 변수로 인한 에러를 예방할 수 있습니다. |

---

# 📝 마무리

정리하면,  
> **PromptTemplate의 `partial_variables` 기능은 고정된 값과 유동적인 값을 분리해서 관리하는 매우 유용한 방법**입니다.

- 시스템 메타데이터,
- 날짜/시간 정보,
- 기본 설정값

같은 것을 **고정**하고,  
사용자 입력은 **필요한 것만 받아서** 깔끔하게 프롬프트를 구성할 수 있습니다.

LangChain을 조금 더 체계적으로 다루고 싶다면,  
**PromptTemplate**과 **Partial Variables** 기능은 꼭 익혀두세요! 🚀

---