---
title: "AI 세부 실습 16 - 파인튜닝과 LoRA"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- FineTuning
tags:
- AI
- FineTuning
- LoRA
- JSONL
toc: true
toc_sticky: true
toc_label: 목차
description: "47번 실습 파일을 기준으로 파인튜닝 데이터 생성, JSONL, LoRA 개념을 정리합니다."
article_tag1: AI
article_tag2: FineTuning
article_tag3: LoRA
article_section: AI
meta_keywords: AI, 파인튜닝, LoRA, JSONL, 학습 데이터
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# 파인튜닝과 LoRA

이 글은 다음 원본 실습 파일을 기준으로 정리합니다.

```text
47_finetunning_20250515_01_generate_and_finetune.py
47_finetunning_20250519_01_test_pipeline.py
48_finetunning_20250519_lora_01.py_실행하진말것
```

파인튜닝은 기존 모델을 특정 목적에 맞게 추가 학습시키는 작업입니다.

## 파인튜닝이 필요한 경우

다음 상황에서 파인튜닝을 고려할 수 있습니다.

- 특정 답변 형식을 항상 지키게 하고 싶을 때
- 특정 분류 기준을 학습시키고 싶을 때
- 특정 말투나 응답 스타일을 유지하고 싶을 때
- 반복되는 업무 패턴을 모델에 익히게 하고 싶을 때

문서 내용이 자주 바뀌는 경우에는 파인튜닝보다 RAG가 더 적합할 수 있습니다.

## JSONL 학습 데이터

강의 코드에서는 질문과 답변을 JSONL로 저장합니다.

```python
import json

item = {
    "messages": [
        {"role": "system", "content": "당신은 유용한 AI 어시스턴트입니다."},
        {"role": "user", "content": "Tom은 왜 학교에 가기 싫어했어?"},
        {"role": "assistant", "content": "Tom은 놀고 싶어서 학교에 가기 싫어했습니다."},
    ]
}

with open("tom_sawyer.jsonl", "w", encoding="utf-8") as f:
    f.write(json.dumps(item, ensure_ascii=False) + "\n")
```

JSONL은 한 줄에 JSON 하나씩 들어가는 형식입니다.

## 파인튜닝 흐름

```text
학습 데이터 준비
-> JSONL 저장
-> 파일 업로드
-> 파인튜닝 작업 생성
-> 작업 상태 확인
-> 학습된 모델 테스트
```

## LoRA

LoRA는 큰 모델 전체를 다시 학습하지 않고 일부 작은 가중치만 학습하는 방식입니다.
전체 파인튜닝보다 자원을 덜 사용할 수 있습니다.

하지만 쉬운 작업은 아닙니다.

- 데이터 품질이 중요함
- GPU 메모리 필요 가능
- 학습 설정에 따라 결과가 크게 달라짐
- 저작권과 개인정보 주의 필요

## 정리

47번 실습은 모델을 사용하는 단계에서 모델을 조정하는 단계로 넘어가는 내용입니다.
처음에는 RAG로 해결 가능한지 확인하고, 형식과 스타일 학습이 필요할 때 파인튜닝을 검토하는 것이 좋습니다.
