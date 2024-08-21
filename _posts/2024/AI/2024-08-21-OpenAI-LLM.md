---
title: 인공지능 - OpenAI LLM Chat 기능 맛보기
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
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - LLM Chat 기능 맛보기
article_tag1: AI
article_tag2: LLM
article_tag3: 
article_section: 
meta_keywords: AI, LLM
last_modified_at: '2024-08-19 21:00:00 +0800'
---

# OpenAI LLM Chat Bot 만들기(카드 등록, 결제 등 유료 방법 포함)

OpenAI API 사용을 위해 카드를 등록하고 결제하는 방법을 간단하게 설명해드리겠습니다.

### 1. OpenAI 계정 생성 및 로그인
1. [OpenAI 공식 웹사이트](https://platform.openai.com/)에 접속합니다.
2. 아직 계정이 없다면 회원가입을 진행하고, 이미 계정이 있다면 로그인합니다.

### 2. 결제 정보 추가
1. 로그인 후, 오른쪽 상단의 프로필 아이콘을 클릭하고 **"Manage Account"**를 선택합니다.
2. 왼쪽 메뉴에서 **"Billing"**을 클릭합니다.
3. **"Add Payment Method"** 버튼을 클릭하여 결제 정보를 추가합니다.
4. 카드 정보를 입력하고 **"Submit"** 버튼을 눌러 결제 수단을 등록합니다.

### 3. 결제 확인 및 사용
1. 결제 수단이 등록되면, 사용한 API에 대한 비용이 매월 자동으로 청구됩니다.
2. **Billing** 페이지에서 결제 내역을 확인할 수 있으며, 필요시 인보이스를 다운로드할 수도 있습니다.

### 추가 팁
- **예산 설정**: 월별 예산을 설정하여 예상치 못한 과다 청구를 방지할 수 있습니다.
- **알림 설정**: 사용량이 특정 한도에 도달하면 이메일 알림을 받도록 설정할 수 있습니다.


### 그냥 사용한다면, 아래 에러가 나타난다.

```
You exceeded your current quota, please check your plan and billing details. For more information on this error,...
```

```
We couldn't process your payment. If this issue persists, please contact us through our help center at https://help.openai.com.
```

API 사용을 위해 아래 절차대로 카드를 등록하고, 비용을 결제한다.

## 카드 등록 방법

사이트
https://platform.openai.com/settings/organization/billing/overview

이미지
![img](/assets/images/openai_site/openai_card.png "ai exam")

메뉴에 있는대로 카드를 등록하고,
일부 결제를 지불해야됩니다.


## OpenAI Key 생성 방법

사이트
https://platform.openai.com/settings/profile?tab=api-keys

이미지
![img](/assets/images/openai_site/open_ai_key.png "ai exam")


## 코드 작성해보기

아래 참고 사이트에서, 예제 코드를 받아서 사용한다.

### 참고

https://api.python.langchain.com/en/latest/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html#langchain_openai.chat_models.base.ChatOpenAI


https://platform.openai.com/docs/guides/text-generation

https://platform.openai.com/docs/api-reference/chat/create?lang=python

![img](/assets/images/openai_site/open_ai_exam.png "ai exam")



### 예제 코드

```py
# pip install -U langchain-openai
from langchain_openai import ChatOpenAI

import os
os.environ["OPENAI_API_KEY"] = "YOUR_API_KEY..."

from openai import OpenAI

api_key = os.getenv("OPENAI_API_KEY")
OpenAI.api_key = api_key
client = OpenAI()

completion = client.chat.completions.create(
  model="gpt-4o-mini",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"},
    {"role": "user", "content": "오늘 날씨는 어때?"}
  ],
  max_tokens=100,
  temperature=0.5  # 결과 파라미터 창의성
)

print(completion.choices[0].message.content)
print(completion.choices[0].message)
```