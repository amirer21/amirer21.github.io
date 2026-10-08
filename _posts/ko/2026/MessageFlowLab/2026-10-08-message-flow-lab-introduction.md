---
title: "[00] MessageFlow Lab 소개 — 메시지 큐를 실험으로 배우기"
date: 2026-10-08 09:00:00 +0900
last_modified_at: 2026-10-08 09:00:00 +0900
lang: ko
categories:
  - MessageFlowLab
tags:
  - Python
  - RabbitMQ
  - MessageFlowLab
toc: true
toc_sticky: true
toc_label: 목차
description: "프로젝트 구조와 기술별 역할, Phase 0–12의 학습 순서를 정리합니다."
excerpt: "프로젝트 구조와 기술별 역할, Phase 0–12의 학습 순서를 정리합니다."
series: message-flow-lab
series_order: 0
permalink: /ko/2026/message-flow-lab/00-introduction/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

메시지를 발행했다는 로그가 찍히면 업무까지 성공한 것일까요? MessageFlow Lab은 이 질문을 작은 실험으로 나누는 Python 메시징 학습 프로젝트입니다. 결과를 예측하고, 실제 Queue와 Consumer를 관찰한 뒤, 예상과 다른 이유를 설명하는 방식으로 배웁니다.

이 시리즈는 프로젝트 문서와 코드를 바탕으로 정상 발행부터 중복 업무, 재시도, 원격 호출, DB 저장과 발행 사이의 장애까지 연결합니다.

## 기술별 역할과 전체 흐름

~~~text
Vue 대시보드 ── HTTP + X-Lab-Token ──> FastAPI Gateway
                                        ├─ Pika ──> RabbitMQ
                                        ├─ Management API ──> Queue 지표
                                        ├─ Phase 2 자식 Consumer 제어
                                        └─ JSONL 기록 / Phase 6 SQLite
~~~

브라우저는 AMQP로 RabbitMQ에 직접 연결하지 않습니다. FastAPI가 실험 명령을 받고 Pika로 Broker와 통신합니다. Ready와 Unacked 지표는 RabbitMQ Management API에서 수집합니다. 버튼 응답, 앱 이벤트, Broker 지표는 관측 위치가 다릅니다.

| 기술 | 프로젝트에서 맡는 역할 |
|---|---|
| RabbitMQ | 메시지 보관, 라우팅, 전달과 ACK 관리 |
| Pika | Python에서 AMQP 연결과 채널 명령 실행 |
| FastAPI | HTTP API, 인증, 실험 제어와 조회 |
| Vue·TypeScript | 예측·실행·관찰을 위한 학습 화면 |
| Docker Compose | 로컬 서비스 구성과 실행 |
| SQLite | Phase 6의 처리 키와 업무 효과를 트랜잭션으로 저장 |
| Kombu·Celery·Pyro5 | 후속 단계의 메시징 추상화, Task, RPC 비교 |

Kombu는 메시징 객체를 추상화하고 Celery는 Task 등록·실행·결과 모델을 추가합니다. Pyro5는 원격 객체의 메서드를 호출하는 RPC 라이브러리입니다. Pika와 Pyro5는 서로 다른 역할입니다.

## 프로젝트 코드에서 시작할 위치

[README](https://github.com/amirer21/message-flow-lab/blob/main/README.md)를 읽고 다음 파일을 따라가면 화면과 Broker 사이의 경계를 파악할 수 있습니다.

1. `docker-compose.yml`: 서비스·네트워크·데이터 보존 위치.
2. `backend/app/main.py`: API 진입점과 앱 생명주기.
3. `backend/app/messaging.py`: 연결·Queue 선언·발행.
4. `backend/app/consumer.py`: 수동 ACK와 전달 시도 제어.
5. `backend/app/experiments.py`: Phase 2 자식 프로세스 관리.
6. `backend/app/database.py`, `idempotency.py`: Phase 6 중복 업무 방어.

API는 한 프로세스로 실행하는 학습 구성입니다. Consumer 제어 상태가 메모리에 있으므로 여러 API Worker로 바꾸려면 상태 공유와 소유권 설계가 먼저 필요합니다.

## 학습 순서와 구현 범위

2026년 10월 8일에 확인한 로컬 소스에는 Phase 0–6 코드가 있습니다. 10월 7일의 검증 문서는 Phase 1–5의 실제 Broker 실험을 기록합니다. Phase 6은 코드 해설과 실험 절차를 제공하지만 이 글에서 새로 실제 실행 검증을 했다고 주장하지 않습니다. Phase 7–12는 후속 설계·학습 예시입니다.

| 구간 | 학습 질문 |
|---|---|
| Phase 0–1 | 연결은 어떻게 하고 메시지는 언제 Queue에서 제거되는가? |
| Phase 2–3 | 장애가 나면 무엇이 반복되고 어느 Queue가 메시지를 받는가? |
| Phase 4–5 | 발행 확인과 실패 재시도를 어떻게 구분하는가? |
| Phase 6 | 다시 도착한 요청의 업무 효과를 어떻게 한 번만 반영하는가? |
| Phase 7–10 | 성능 측정과 라이브러리·Task Framework 전환에서 무엇이 달라지는가? |
| Phase 11–12 | RPC와 MQ의 대기, DB와 발행 사이의 장애를 어떻게 다루는가? |

일부 초기 문서에는 Phase 4 이후가 설계 예시로 남아 있습니다. 이 시리즈는 그 문구만으로 구현 상태를 결정하지 않고 실제 파일과 검증 기록을 함께 확인합니다. 프로젝트 업데이트 이후에는 독자도 같은 방식으로 확인하세요.

## 첫 관찰: 예시와 실제 연결 구분하기

대시보드의 기본 모드는 설명용 예시입니다. 버튼을 눌러도 실제 RabbitMQ에 메시지가 들어가지 않습니다. 실제 실습은 Docker 서비스를 실행하고 로컬 대시보드에서 Gateway와 토큰을 입력한 뒤 진행합니다.

첫 실험에서는 메시지 3개를 발행하고 하나씩 ACK하면서 상태를 관찰합니다. 다음 세 가지를 구분해 기록하세요.

- 요청: 메시지 발행, Consumer 시작, ACK 클릭.
- 앱 관측: `PUBLISH_SENT`, `DELIVERED`, `ACK_SENT`.
- Broker 수집: Ready, Unacked, Consumer 수.

API 세션 카운터는 재시작하면 초기화되지만 영속 Queue에는 메시지가 남을 수 있습니다. 서로 다른 수치가 보인다는 이유만으로 유실이라고 판단하면 안 됩니다.

## 학습 확인과 다음 글

예시 모드의 발행이 실제 Broker에 들어가지 않는 이유를 설명해 보세요. RabbitMQ, FastAPI, Consumer가 각각 어떤 역할인지도 구분해 보세요.

다음 글에서는 Docker Compose로 서비스를 실행하고 실제 연결을 확인합니다.

## 프로젝트 문서와 참고 자료

- [MessageFlow Lab 저장소](https://github.com/amirer21/message-flow-lab)
- [학습 대시보드](https://messageflow-lab-amire.mirohong.chatgpt.site)
- [Phase별 기술 학습 문서](https://github.com/amirer21/message-flow-lab/blob/main/docs/technical-learning-guide.md)
- [실행 검증 기록](https://github.com/amirer21/message-flow-lab/blob/main/docs/verification.md)

{% include message-flow-lab-series.html compact=true %}
