---
title: Python - ChatGPT 웹 서비스 구현하기
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- ChatGPT
toc: true
toc_sticky: true
toc_label: 목차
description: Python 개발 환경 설정
article_tag1: python
article_tag2: chatGPT
article_tag3: ai
article_section: python
meta_keywords: python, ChatGPT, ai
last_modified_at: '2023-11-10 21:00:00 +0800'
---

# Python으로 간단한 ChatGPT 채팅 웹 서비스 구현하기

> python version : 3.11.5

OpenAI의 ChatGPT를 이용하여 질문에 대한 답변을 생성하는 웹 서비스를 구현한다.

OpenAI에는 질문에 대한 답변을 생성하는 API가 있다. 이를 이용하여 질문에 대한 답변을 생성하는 웹 서비스를 구현해보고자 한다. ChatGPT의 모델은 GPT-3를 기반으로 한다. 

## 1. 흐름을 요약하면 다음과 같다.

 사용자가 질문을 입력하면, 이를 서버로 전송한다.
 서버는 OpenAI의 API를 이용하여 질문에 대한 답변을 생성한다.
 생성된 답변을 사용자에게 전달한다.

## 2. 프로젝트 구조

이 프로젝트에서 백엔드 서버와 프론트엔드의 구조는 다음과 같다.
OpenAI 서버와 통신하여 질문에 대한 답변을 생성하는 백엔드 서버와, 사용자의 질문을 입력받고, 백엔드 서버에 전송하여 답변을 출력하는 프론트엔드 서버로 구성된다.

### 2.1 백엔드 서버

#### (1) FastAPI를 이용하여 구현한다. 

FastAPI는 ASGI 서버를 실행하는 웹 프레임워크이다.
ASGI(Asynchronous Server Gateway Interface)는 비동기 웹 서버를 위한 파이썬의 표준 인터페이스이다.

#### (2) backend.py

 백엔드 서버에서는 질문에 대한 답변을 생성하는 함수를 구현한다.
질문에 대한 답변을 생성을 위해 OpenAI의 API를 이용한다.

### 2.2 프론트엔드

#### (1) Streamlit을 이용하여 구현한다.

Streamlit은 간단하게 웹 애플리케이션을 만들 수 있는 파이썬 라이브러리이다.
데이터 시각화, 머신러닝 등 다양한 분야에서 사용이 가능하다.

> https://docs.streamlit.io/en/stable/

#### (2) app.py

 프론트엔드 서버에서는 사용자의 질문을 입력받고, 백엔드 서버에 전송한다.
백엔드 서버에서 받은 답변을 출력한다.

## 3. 코드 살펴보기

### 3.1 backend.py

openai : OpenAI API를 이용하기 위한 라이브러리

- 설치 : 

>  pip install openai

```py
#import open AI
import openai
from typing import List
from fastapi import FastAPI #fastapi : 웹 프레임워크
from pydantic import BaseModel #pydantic : 데이터 검증


# backend 서버 실행하고 접속 하기 
# http://localhost:8501/


#ChatGPT 웹에서 API Key를 생성하고 복사해온다.
openai.api_key = "Open AI에서 생성한 API 키 값"


#FastAPI 객체 생성
#FastAPI는 ASGI 서버를 실행하는 웹 프레임워크이다.
# ASGI(Asynchronous Server Gateway Interface)는 비동기 웹 서버를 위한 파이썬의 표준 인터페이스이다.
app = FastAPI() 


# 질문에 대한 답변을 생성하는 함수
def chat(messages):    
    response = openai.ChatCompletion.create(model="gpt-3.5-turbo", messages=messages)
    resp_dict = response.to_dict_recursive()
    assistant_turn = resp_dict['choices'][0]['message']
    
    print("response :: ", response)
    
    return assistant_turn


class Turn(BaseModel):
    role: str
    content: str    

class Messages(BaseModel):
    messages: List[Turn]
    
# 백엔드 서버에 질문을 전송하는 API
# URL : http://localhost:8000/chat 로 접속한다.
# messages : 질문에 대한 답변을 생성하기 위한 대화 내용
# POST /chat HTTP/1.1
@app.post("/chat", response_model=Turn)
def post_chat(messages: Messages):
    messages = messages.dict()
    #chat : 질문에 대한 답변을 생성하는 함수
    assistant_turn = chat(messages=messages['messages'])
    
    return assistant_turn

'''
messages = [{"role":"user", "content":"Hello Who are you?"}]
response = chat(messages=messages)
print("response :: ", response)
'''
```
![img](/assets/images/chatgpt/backend_start.png "chatgpt.png")

--------------

### 3.2 app.py

streamlit 을 이용하여 프론트엔드를 구현해보자.
streamlit 을 설치한다. 코드를 작성하고 실행할때는 streamlit run app.py 으로 실행한다.

- 설치 
> pip install streamlit

- 실행 
> streamlit run app.py

```py
import streamlit as st
from streamlit_chat import message
#pip install streamlit_chat
import requests
#pip install uvicorn
if 'messages' not in st.session_state:
    st.session_state['messages'] = []
    
chat_url = "http://localhost:8000/chat" #백엔드 서버 주소

# 질문에 대한 답변을 생성하는 함수
def chat(text):
    user_turn = {"role":"user", "content":text} # 사용자의 입력
    messages = st.session_state['messages'] # 대화 내용
    resp = requests.post(chat_url, json={"messages":messages + [user_turn]}) # 백엔드 서버에 대화 내용 전송(request : post)
    assistant_turn = resp.json() # 백엔드 서버에서 받은 답변
    
    st.session_state['messages'].append(user_turn) # 대화 내용에 사용자의 입력 추가
    st.session_state['messages'].append(assistant_turn) # 대화 내용에 백엔드 서버에서 받은 답변 추가
    
st.title("챗봇 서비스") # 타이틀

# 컨테이너 생성
# 컨테이너는 화면을 구성하는 요소들을 그룹화하는 역할을 한다.
row1 = st.container() 
row2 = st.container()

# 컨테이너에 컴포넌트 추가
# row2 : 컨테이너에는 사용자의 입력을 받는 텍스트 박스를 추가한다.
with row2:
    input_text = st.text_input("You")
    if input_text:
        chat(input_text)
  
# row1 : 대화 내용을 출력하는 컨테이너      
with row1:
    for i, msg_obj in enumerate(st.session_state['messages']):
        msg = msg_obj['content']
        is_user = False
        if i % 2 == 0:
            is_user = True

        message(msg, is_user=is_user, key=f"chat_{i}")
        
#uvicorn은 ASGI 서버를 실행하는 명령어
#설치 pip install uvicorn
#실행 uvicorn backend:app --reload
```
![img](/assets/images/chatgpt/app_start.png "chatgpt.png")

--------------

## 웹 화면

"localhost:8501" 로 접속해보면 아래와 같은 채팅 웹 페이지가 출력된다.
하단 입력창에 텍스트를 입력하면 OpenAI 서버에 질문(요청)을 보내고,
응답 결과값이 출력된다.

![img](/assets/images/chatgpt/chatBotWebApp.png "chatgpt.png")


--------------

## 응답 결과값 살펴보기

질문에 대해 응답 결과값을 살펴보면 다음과 같다.

> 질문 : Hi.

- id : 대화의 고유 ID
- object : 대화의 종류
- created : 대화가 생성된 시간
- model : 사용된 모델
- choices : 답변
- index : 답변의 인덱스
- message : 답변의 내용
- role : 답변의 역할
- content : 답변의 내용
- finish_reason : 답변의 종료 이유
- usage : 사용량
- prompt_tokens : 입력 토큰의 개수(토큰이란 문자열을 의미한다.)
- completion_tokens : 출력 토큰의 개수
- total_tokens : 전체 토큰의 개수

-----


```
response ::  {
  "id": "chatcmpl-8HBgxxn3yH4OFT3r5v03mUPx07a0g",
  "object": "chat.completion",
  "created": 1699107211,
  "model": "gpt-3.5-turbo-0613",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Hello! How can I assist you today?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 8,
    "completion_tokens": 9,
    "total_tokens": 17
  }
}
INFO:     127.0.0.1:3444 - "POST /chat HTTP/1.1" 200 OK
```

## 또다른 응답 결과값
> 질문 : How are you?

```
response ::  {
  "id": "chatcmpl-8HBhYs4wevQfbck6eZ7RMqfYbuhLJ",
  "object": "chat.completion",
  "created": 1699107248,
  "model": "gpt-3.5-turbo-0613",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "I'm an AI, so I don't have feelings, but I'm here to help you with any questions or concerns you may have. Is there something specific you'd like assistance with?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 29,
    "completion_tokens": 38,
    "total_tokens": 67
  }
}
INFO:     127.0.0.1:3475 - "POST /chat HTTP/1.1" 200 OK
```

## 또다른 응답 결과값

> 질문 : What day is it today?

```
response ::  {
  "id": "chatcmpl-8HBiMOeEYCUuMfM7vFJ4zWJbuvgiP",
  "object": "chat.completion",
  "created": 1699107298,
  "model": "gpt-3.5-turbo-0613",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Today is Tuesday. How can I further assist you?"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 81,
    "completion_tokens": 11,
    "total_tokens": 92
  }
}
INFO:     127.0.0.1:3493 - "POST /chat HTTP/1.1" 200 OK
```

-----------------