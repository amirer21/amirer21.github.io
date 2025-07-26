---
title: (Fine-tuning) - OpenAI 파인튜닝(Fine-tuning)이 뭐길래?
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- OpenAI
- LLM
- FineTunning
tags:
- AI
- OpenAI
- LLM
- FineTunning
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - OpenAI 파인튜닝(Fine-tuning)이 뭐길래?
article_tag1: AI
article_tag2: FineTunning
article_tag3: LLM
article_section: 
meta_keywords: AI, FineTunning, LLM, OpenAI
last_modified_at: '2025-05-19 21:00:00 +0800'
---


## OpenAI 파인튜닝(Fine-tuning)이 뭐길래?

직접 데이터로 내 AI를 훈련시키는 법

## 1. 파인튜닝이란?

처음 GPT를 만났을 때, “이야, 진짜 똑똑하네!”라는 감탄이 나왔습니다.
하지만 몇 번 써보면 아쉽기도 하죠.

“우리 회사 매뉴얼 기반으로만 답해줘.”
“이런 어투로만 이야기해줘.”
“질문이 이런 형식일 땐 이런 방식으로 대답해줘.”

이럴 때 필요한 게 \*\*파인튜닝(fine-tuning)\*\*입니다.
쉽게 말해, GPT 모델에게 나만의 데이터를 가르쳐서 **맞춤형 AI**로 만드는 과정이죠.

## 2. 예제로 배우는 파인튜닝

이번에는 `카페 창업자`를 위한 AI를 만든다고 해보겠습니다.
질문이 들어오면, 카페 창업에 적합한 조언을 정해진 톤으로 해주는 AI입니다.

### 예시 질문 리스트

* 카페를 열려면 어떤 준비가 필요할까?
* 창업 비용은 어느 정도 들지?
* 입지는 어떻게 고르면 좋을까?
* 혼자 해도 될까?
* 브랜드 창업이 좋을까, 개인 창업이 좋을까?

이제 이 질문들에 GPT가 답하도록 시켜서, 그 결과를 **학습용 JSONL 파일**로 만들어볼 거예요.

---

## 3. 전체 코드 흐름 설명

### (1) 환경 설정

```python
import os, json, warnings
from dotenv import load_dotenv
from openai import OpenAI

warnings.filterwarnings("ignore")
load_dotenv("openapi_key.env")
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
```

* `.env` 파일에서 API 키를 불러옵니다.
* `OpenAI` 클라이언트를 초기화합니다.

### (2) 질문 리스트 생성 & 답변 생성

```python
questions = [
    "카페 창업에 필요한 준비는?",
    "카페 입지는 어떻게 고르면 좋을까?",
    "개인 창업이랑 브랜드 창업 중 뭐가 나아?",
    "혼자 창업하면 힘들까?",
    "마케팅은 어떻게 시작해야 할까?"
]

data = []
for q in questions:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "당신은 카페 창업 컨설턴트입니다. 실용적이고 현실적인 조언을 제공합니다."},
            {"role": "user", "content": q}
        ]
    )
    answer = response.choices[0].message.content
    data.append({
        "messages": [
            {"role": "system", "content": "당신은 카페 창업 컨설턴트입니다."},
            {"role": "user", "content": q},
            {"role": "assistant", "content": answer}
        ]
    })
```

* 질문마다 GPT에게 답변을 요청하고, 그 결과를 파인튜닝 형식(`messages`)으로 저장합니다.
* 이 데이터를 기반으로 모델을 훈련시킬 수 있습니다.

### (3) JSONL 파일로 저장

```python
with open("cafe_finetune.jsonl", "w", encoding="utf-8") as f:
    for item in data:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")
```

* OpenAI 파인튜닝은 `.jsonl` 포맷만 지원합니다.
* 한 줄에 하나의 JSON 오브젝트, 총 질문/답변 쌍들이 들어갑니다.

### (4) 파일 업로드 및 파인튜닝 요청

```python
uploaded_file = client.files.create(
    file=open("cafe_finetune.jsonl", "rb"),
    purpose="fine-tune"
)

fine_tune_job = client.fine_tuning.jobs.create(
    training_file=uploaded_file.id,
    model="gpt-3.5-turbo"
)
```

* JSONL 파일을 업로드하고,
* 파인튜닝 작업을 생성합니다.

### (5) 학습 작업 확인

```python
job_status = client.fine_tuning.jobs.retrieve(fine_tune_job.id)
print("현재 상태:", job_status.status)
```

* 학습이 얼마나 진행되었는지 확인할 수 있습니다.
* "running", "succeeded", "failed" 등의 상태가 나옵니다.

---

## 4. 주요 함수 쉽게 이해하기

| 함수                                 | 설명                          |
| ---------------------------------- | --------------------------- |
| `client.chat.completions.create`   | GPT에게 질문하고 답변을 받음           |
| `json.dump`                        | 데이터를 JSON 형식으로 저장           |
| `client.files.create`              | `.jsonl` 파일을 OpenAI 서버에 업로드 |
| `client.fine_tuning.jobs.create`   | 업로드한 파일로 파인튜닝 시작            |
| `client.fine_tuning.jobs.retrieve` | 작업 상태를 확인                   |

---

## 5. 마무리

Fine-tuning은 마치 "나만의 GPT 선생님을 직접 훈련시키는 것"과도 같습니다.
한 번 고정된 지식으로 훈련되기 때문에, 자주 바뀌는 정보에는 적합하지 않지만,
**정형화된 응답**, **특정 도메인에 특화된 상담**, **문체 통일**에는 굉장히 유용합니다.

---

## 참고 링크

* [OpenAI Fine-tuning 공식 문서](https://platform.openai.com/docs/guides/fine-tuning)
* [OpenAI API 키 발급 및 .env 설정 방법](https://platform.openai.com/account/api-keys)
