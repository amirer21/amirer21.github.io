---
title: (Fine-tuning) - 나만의 ChatGPT 만들기
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
description: 인공지능 - 나만의 ChatGPT 만들기
article_tag1: AI
article_tag2: FineTunning
article_tag3: LLM
article_section: 
meta_keywords: AI, FineTunning, LLM, OpenAI
last_modified_at: '2025-05-19 21:00:00 +0800'
---


## 나만의 ChatGPT 만들기

OpenAI 파인튜닝 실전 예제 따라하기

## 1. 시작하며

“ChatGPT가 다 잘하긴 하는데, 내 말투, 내 도메인, 내 데이터를 기억하진 않잖아?”
그럴 때 필요한 게 바로 \*\*파인튜닝(Fine-tuning)\*\*입니다.
GPT 모델을 내 데이터로 재학습시켜서, 마치 우리 조직 전용 AI처럼 활용할 수 있죠.

이번 글에서는 **소설 ‘톰 소여의 모험’을 예로 들어**, 특정 질문에 전문적으로 답변하는 AI를 만드는 전 과정을 따라가 봅니다.

---

## 2. 파인튜닝 흐름 미리 보기

* 질문 리스트를 만든다
* GPT로 질문에 대한 답변을 생성한다
* 데이터를 JSONL 포맷으로 저장한다
* OpenAI에 업로드하고 파인튜닝을 시작한다
* 학습 완료된 모델을 실제로 호출해본다

---

## 3. 코드와 함께 배우는 파인튜닝

### 환경 준비

```python
# 필수 설치
# pip install openai python-dotenv pandas
```

```python
import os, json, warnings
import pandas as pd
from dotenv import load_dotenv
from openai import OpenAI

# 설정
os.environ["USER_AGENT"] = "Mozilla/5.0"
warnings.filterwarnings("ignore")

# .env에서 OpenAI 키 로딩
load_dotenv("openapi_key.env")
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
```

* `.env` 파일에 `OPENAI_API_KEY`를 넣어두고, `load_dotenv()`로 불러옵니다.
* Hugging Face 키는 지금은 쓰지 않지만, 이후 활용을 위해 미리 불러올 수도 있습니다.

---

### 질문 리스트 만들기

```python
questions = [
    "Tom은 왜 학교에 가기 싫어했어?",
    "Tom이 Becky에게 화가 난 이유는 뭐야?",
    "왜 Tom과 Huck은 무덤에 갔어?",
    "Tom이 법정에서 한 말은 뭐였어?",
    "Injun Joe는 왜 위험한 인물이야?"
]
```

* 소설 내용과 관련된 질문을 몇 개 정리합니다.

---

### GPT로 답변 생성하고 저장하기

```python
data = []
for q in questions:
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "당신은 'The Adventures of Tom Sawyer' 전문가인 AI 어시스턴트입니다."},
            {"role": "user", "content": q}
        ]
    )
    answer = response.choices[0].message.content
    data.append({
        "messages": [
            {"role": "system", "content": "당신은 유용한 AI 어시스턴트입니다."},
            {"role": "user", "content": q},
            {"role": "assistant", "content": answer}
        ]
    })
```

* `system` 메시지로 AI의 역할을 지정합니다.
* 각 질문에 대해 답변을 받고, 이를 JSON 형식으로 저장합니다.

---

### JSONL 포맷으로 저장

```python
jsonl_path = "tom_sawyer.jsonl"
with open(jsonl_path, "w", encoding="utf-8") as f:
    for item in data:
        f.write(json.dumps(item, ensure_ascii=False) + "\n")
```

* 파인튜닝은 `.jsonl` 포맷만 지원합니다.
* 한 줄에 하나의 JSON 오브젝트가 있어야 합니다.

---

### OpenAI에 업로드 및 파인튜닝 시작

```python
upload_result = client.files.create(file=open(jsonl_path, "rb"), purpose="fine-tune")
training_file_id = upload_result.id

fine_tune_result = client.fine_tuning.jobs.create(
    training_file=training_file_id,
    model="gpt-3.5-turbo"
)

print(f"파인튜닝 Job 생성 완료: {fine_tune_result.id}")
```

* JSONL 파일을 업로드한 뒤, 해당 파일을 기반으로 파인튜닝을 시작합니다.

---

### 학습 상태 확인 및 모델 목록 출력

```python
status = client.fine_tuning.jobs.retrieve(fine_tune_result.id)
print("현재 상태:", status.status)

models = client.models.list()
for m in models.data:
    if m.id.startswith("ft:"):
        print(m.id)
```

* 파인튜닝 작업의 상태(`running`, `succeeded`, `failed`)를 확인할 수 있습니다.
* 학습 완료된 모델은 `ft:`로 시작하는 ID를 가집니다.

---

### 완성된 모델로 테스트 해보기

```python
finetuned_model_id = "ft:gpt-3.5-turbo-0125:personal::BYsBBbnq"  # 본인의 모델 ID로 변경

response = client.chat.completions.create(
    model=finetuned_model_id,
    messages=[
        {"role": "system", "content": "당신은 유용한 AI 어시스턴트입니다."},
        {"role": "user", "content": "Tom과 Huck은 어떻게 보물 위치를 알아냈어?"}
    ]
)

print("모델 응답:", response.choices[0].message.content)
```

* 완성된 모델을 호출해 응답을 테스트합니다.
* `model`에 사용한 모델 ID는 학습이 완료된 ID로 교체해야 합니다.

---

## 주요 함수 요약

| 함수명                                  | 설명                    |
| ------------------------------------ | --------------------- |
| `client.chat.completions.create()`   | GPT 모델에게 질문하고 응답 받기   |
| `json.dump()`                        | JSON 형식으로 파일 저장       |
| `client.files.create()`              | OpenAI에 학습 데이터 파일 업로드 |
| `client.fine_tuning.jobs.create()`   | 파인튜닝 학습 작업 생성         |
| `client.fine_tuning.jobs.retrieve()` | 파인튜닝 상태 조회            |
| `client.models.list()`               | 생성된 모델 목록 확인          |

---

## 마무리

OpenAI 파인튜닝은 아주 복잡해 보일 수 있지만, 흐름을 따라가 보면 단순합니다.
한 마디로 \*\*"내 데이터로 나만의 GPT를 만드는 과정"\*\*이죠.
기업의 업무 매뉴얼, 제품 설명서, 고객상담 패턴 등을 학습시켜 AI를 내부 시스템에 적용하는 데 큰 도움이 됩니다.

---