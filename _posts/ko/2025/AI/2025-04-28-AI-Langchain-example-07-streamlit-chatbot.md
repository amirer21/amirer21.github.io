---
title: 인공지능 - LangChain 세션 기반 대화 메모리 만들기 — RunnableWithMessageHistory
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
description: 인공지능 - LangChain 세션 기반 대화 메모리 만들기 — RunnableWithMessageHistory
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, LangChain
last_modified_at: '2025-04-28 21:00:00 +0800'
---


# 🛠 LangChain 세션 기반 대화 메모리 만들기 — RunnableWithMessageHistory

AI 챗봇을 만들다 보면, 꼭 필요하지만 쉽게 지나칠 수 있는 기능이 있습니다.  
바로 **대화 기록(메모리)** 기능입니다.

> "이전 대화를 기억하지 못하는 AI는, 진짜 '대화'를 할 수 있을까?"

오늘은 **LangChain**을 이용해,  
**세션별로 대화 히스토리를 저장하고 이어가는 챗봇**을 만드는 방법을 알아보겠습니다.

특히 **RunnableWithMessageHistory** 클래스를 활용해서  
- 각 세션마다 독립적으로 대화를 저장하고
- 대화 흐름을 자연스럽게 이어가는 구조를 만들어볼게요.

---

## 🛠 전체 코드 흐름

(※ 예제 문장은 "우주여행에 대해 알려줘"로 시작합니다.)

### 📄 전체 코드

```python
# 설치 필요
# pip install langchain langchain-openai

import os
import warnings
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.messages import AIMessage, HumanMessage

warnings.filterwarnings("ignore", category=UserWarning)

# API 키 로드
load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")

# ✅ 간단한 메모리 클래스 구현
class SimpleMemory(BaseChatMessageHistory):
    def __init__(self):
        self._messages = []

    @property
    def messages(self):
        return self._messages

    def add_user_message(self, content: str):
        self._messages.append(HumanMessage(content=content))

    def add_ai_message(self, content: str):
        self._messages.append(AIMessage(content=content))

    def add_message(self, message):
        self._messages.append(message)

    def add_messages(self, messages):
        self._messages.extend(messages)

    def clear(self):
        self._messages.clear()

# 1. LLM 준비
gpt = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)

# 2. 프롬프트 템플릿 (히스토리 포함)
prompt = ChatPromptTemplate.from_messages([
    ("system", "당신은 친절하고 명확한 AI 어시스턴트입니다."),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{input}")
])

# 3. 체인 구성
chain = prompt | gpt | StrOutputParser()

# 4. 세션 ID 기반 메모리 저장소
session_memory = {}

def get_memory(session_id: str) -> BaseChatMessageHistory:
    if session_id not in session_memory:
        session_memory[session_id] = SimpleMemory()
    return session_memory[session_id]

# 5. RunnableWithMessageHistory로 체인 구성
conversation = RunnableWithMessageHistory(
    runnable=chain,
    get_session_history=get_memory,
    input_messages_key="input",
    history_messages_key="history"
)

# 6. 대화 세션 시작
session_id = "session-001"

conversation.invoke({"input": "우주여행에 대해 알려줘."}, config={"configurable": {"session_id": session_id}})
conversation.invoke({"input": "간단하게 요약해줄래?"}, config={"configurable": {"session_id": session_id}})
conversation.invoke({"input": "더 짧게 정리해줘."}, config={"configurable": {"session_id": session_id}})
result = conversation.invoke({"input": "조금 더 길게 설명해줘."}, config={"configurable": {"session_id": session_id}})

# 결과 출력
print("📌 마지막 응답 결과:", result)

# ✅ 대화 히스토리 출력
print("\n🧠 대화 히스토리:")
for msg in session_memory[session_id].messages:
    prefix = "👤 사용자" if isinstance(msg, HumanMessage) else "🤖 GPT"
    print(f"{prefix}: {msg.content}")
```

---

## 🧩 코드 설명

1. **SimpleMemory 클래스**로 간단한 메모리 구현
2. **ChatPromptTemplate**로 프롬프트에 `history` 변수를 삽입
3. **RunnableWithMessageHistory**를 사용해
   - `session_id` 별로 대화 히스토리를 관리
   - 매 요청마다 과거 메시지를 프롬프트에 자동으로 포함
4. **invoke() 호출**할 때 `session_id`를 넘겨 같은 세션 대화를 이어나감

---

## 📈 실제 실행 결과 예시

```plaintext
📌 마지막 응답 결과:
우주여행은 우주의 다양한 지역을 탐험하거나 연구하기 위해 이루어지는 활동입니다. 일반적으로 우주선을 타고 지구 대기권을 벗어나며, 과학 연구, 인류 확장, 관광 등의 목적을 가질 수 있습니다.

🧠 대화 히스토리:
👤 사용자: 우주여행에 대해 알려줘.
🤖 GPT: (우주여행 개념 설명)
👤 사용자: 간단하게 요약해줄래?
🤖 GPT: (간결 요약)
👤 사용자: 더 짧게 정리해줘.
🤖 GPT: (초간단 요약)
👤 사용자: 조금 더 길게 설명해줘.
🤖 GPT: (상세한 설명)
```

---

## 🎯 이렇게 하면 좋은 점

| 이유 | 설명 |
|:---|:---|
| **세션별 대화 유지** | 사용자마다 독립적으로 대화 히스토리를 유지할 수 있습니다. |
| **대화 흐름 자연스러움** | 이전 대화가 누적되어 맥락을 이해한 답변이 가능해집니다. |
| **서비스 확장성** | 여러 사용자를 동시에 지원하는 멀티 세션 챗봇 개발에 필수입니다. |
| **코드 재사용성 높음** | 메모리와 체인을 분리해 관리할 수 있어 유지보수가 쉽습니다. |

---

# 📝 마무리

정리하면,  
> **RunnableWithMessageHistory를 이용하면 LangChain에서 세션별 대화 히스토리를 쉽게 관리할 수 있습니다.**

단순한 1회성 챗봇이 아니라,  
**사용자와 자연스럽게 맥락을 이어가는 똑똑한 대화형 서비스**를 만들 수 있게 됩니다. 🚀

---