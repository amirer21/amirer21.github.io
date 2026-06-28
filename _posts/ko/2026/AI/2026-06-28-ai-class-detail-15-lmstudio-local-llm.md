---
title: "AI 세부 실습 15 - LM Studio와 로컬 LLM"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- LLM
tags:
- AI
- LM Studio
- Local LLM
- HuggingFace
toc: true
toc_sticky: true
toc_label: 목차
description: "46번 실습 파일을 기준으로 LM Studio와 로컬 LLM 사용 흐름을 정리합니다."
article_tag1: AI
article_tag2: LM Studio
article_tag3: Local LLM
article_section: AI
meta_keywords: AI, LM Studio, 로컬 LLM, Hugging Face
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# LM Studio와 로컬 LLM

이 글은 다음 원본 실습 파일을 기준으로 정리합니다.

```text
46_huggingface_lmstudio_01.py
46_lmstudio_20250515_01.py
46_lmstudio_20250515_02.py
```

46번 실습은 OpenAI 같은 외부 API뿐 아니라 로컬에서 LLM을 실행하는 방법과 연결됩니다.

## 로컬 LLM이란?

로컬 LLM은 내 컴퓨터나 사내 서버에서 직접 실행하는 언어 모델입니다.

외부 API 방식:

```text
내 코드 -> 외부 API 서버 -> 답변
```

로컬 LLM 방식:

```text
내 코드 -> 내 컴퓨터의 모델 서버 -> 답변
```

## LM Studio

LM Studio는 로컬 모델을 다운로드하고 실행할 수 있게 해 주는 도구입니다.
일부 설정에서는 OpenAI API와 비슷한 형태의 로컬 엔드포인트를 제공합니다.

## 로컬 모델을 쓰는 이유

- 외부 API 비용을 줄이고 싶을 때
- 민감한 데이터를 외부로 보내기 어려울 때
- 인터넷 연결 없이 실험하고 싶을 때
- 여러 오픈소스 모델을 비교하고 싶을 때

## 주의할 점

로컬 모델은 하드웨어 영향을 많이 받습니다.

| 항목 | 영향 |
| --- | --- |
| RAM | 모델 로딩 가능 여부 |
| VRAM | GPU 추론 속도 |
| 저장 공간 | 모델 파일 크기 |
| CPU/GPU 성능 | 응답 속도 |

큰 모델일수록 실행이 느리거나 아예 로딩되지 않을 수 있습니다.

## OpenAI API와 비교

| 구분 | 외부 API | 로컬 LLM |
| --- | --- | --- |
| 설정 난이도 | 비교적 쉬움 | 모델 다운로드와 실행 필요 |
| 비용 | 사용량 과금 | 장비 비용 중심 |
| 속도 | 서버 성능에 의존 | 내 장비 성능에 의존 |
| 데이터 보안 | 외부 전송 발생 | 내부 처리 가능 |

## 정리

46번 실습은 LLM 사용 방식을 확장하는 단계입니다.
처음에는 외부 API로 배우고, 이후 비용이나 데이터 보안 요구가 생기면 로컬 LLM을 검토하는 흐름이 좋습니다.
