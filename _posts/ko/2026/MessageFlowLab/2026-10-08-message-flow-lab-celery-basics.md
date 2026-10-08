---
title: "[10] Celery로 비동기 Task 실행하기"
date: 2026-10-08 09:00:00 +0900
last_modified_at: 2026-10-08 09:00:00 +0900
lang: ko
categories:
  - MessageFlowLab
tags:
  - Python
  - RabbitMQ
  - MessageFlowLab
  - Celery
toc: true
toc_sticky: true
toc_label: 목차
description: "Broker, Worker, Result Backend를 분리하고 Task ID로 결과를 조회하는 흐름을 설계합니다."
excerpt: "Broker, Worker, Result Backend를 분리하고 Task ID로 결과를 조회하는 흐름을 설계합니다."
series: message-flow-lab
series_order: 10
permalink: /ko/2026/message-flow-lab/10-celery-basics/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

HTTP 요청에서 오래 걸리는 Python 함수를 실행하지 않고 Worker에 넘기려면 어떻게 해야 할까요? Celery는 함수를 Task로 등록하고 실행 요청을 Broker로 전달합니다. API는 Task ID를 먼저 반환하고 결과는 나중에 조회할 수 있습니다.

**범위:** Phase 9의 후속 설계 예시입니다. 현재 Compose에는 Celery Worker와 결과 저장소가 없으며 아래 코드 실행에는 별도 환경 준비가 필요합니다.

## 요청·실행·결과의 분리

~~~text
브라우저 ──> FastAPI ── apply_async ──> RabbitMQ Task Queue
               │                              │
               └─ Task ID 반환                 v
                                        Celery Worker
                                              │
브라우저 ── 상태 조회 ──> FastAPI ──> Result Backend
~~~

RabbitMQ는 Task 요청을 전달하고 Celery Worker가 등록된 Python 함수를 실행합니다. Result Backend는 상태와 결과를 저장합니다. Broker와 Result Backend는 역할이 다르며 같은 서비스일 필요가 없습니다.

이 설계는 RabbitMQ Broker와 Redis Result Backend를 가정합니다. Redis는 추가할 서비스이고 현재 Phase 6 SQLite 업무 DB와도 다른 역할입니다. 결과 저장소의 만료가 업무 데이터 삭제를 의미하지 않습니다.

## Task 등록과 설정 코드

별도 `tasks.py`를 준비하는 학습용 예시입니다. `BROKER_URL`과 `RESULT_BACKEND`는 해당 환경에서 주입합니다.

~~~python
import os
from celery import Celery

app = Celery(
    "messageflow",
    broker=os.environ["BROKER_URL"],
    backend=os.environ["RESULT_BACKEND"],
)
app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    task_track_started=True,
)

@app.task(name="lab.add")
def add(x: int, y: int):
    return x + y

def submit_add(x, y):
    job = add.apply_async(args=[x, y], queue="phase9.tasks")
    return {"task_id": job.id}

def lookup(task_id):
    job = app.AsyncResult(task_id)
    return {
        "state": job.state,
        "result": job.result if job.successful() else None,
    }
~~~

`@app.task`는 이름과 함수의 대응을 등록합니다. `apply_async`는 실행 요청을 발행하며 Worker 쪽에서 함수 본문을 실행합니다. 타입 힌트만으로 HTTP 입력을 검증하지는 않으므로 FastAPI 요청 모델에서 허용 범위를 검증합니다.

이 `lookup`은 성공 결과만 반환하는 핵심 예시입니다. 실제 API에는 실패·만료·접근 권한·알 수 없는 ID 처리도 필요합니다.

## Worker 실행 환경

아래 명령은 Celery와 tasks 모듈이 설치된 **Linux Worker 컨테이너 안에서** 실행하는 설계 예시입니다. 현재 api 컨테이너에 바로 실행하는 명령은 아닙니다.

~~~shell
celery -A tasks worker --loglevel=INFO --queues=phase9.tasks --concurrency=1
~~~

Worker가 소비하는 Queue와 API가 발행한 Queue가 맞아야 합니다. 다른 Queue를 듣는 Worker가 정상 실행 중이어도 해당 Task는 대기할 수 있습니다. Worker에는 `lab.add` Task도 등록되어 있어야 합니다.

## 실험 순서와 예상 결과

1. Broker와 Result Backend를 실행하고 Celery Worker는 정지합니다.
2. `submit_add(2, 3)`으로 Task를 발행해 ID를 기록합니다.
3. Queue에 요청이 대기하는지 확인합니다.
4. 해당 Queue의 Worker를 시작합니다.
5. 같은 Task ID로 조회하여 성공 결과 5를 확인합니다.
6. 존재하지 않는 ID와 결과가 만료된 ID도 조회해 표시 정책을 비교합니다.

이는 후속 환경에서 확인할 예상 관찰입니다. 현재 MessageFlow Lab의 실제 통합 검증 결과가 아닙니다.

## PENDING과 결과 조회의 해석

`PENDING`은 미실행 Task뿐 아니라 저장된 상태가 없는 ID에서도 보일 수 있습니다. 모르는 ID나 만료된 결과를 “정상 대기 중”으로 확정하지 않습니다. Task ID 발급 이력을 별도로 저장하면 알려진 요청인지 먼저 판별할 수 있습니다.

FastAPI 요청 안에서 긴 `AsyncResult.get()`으로 완료를 기다리면 HTTP 요청이 계속 대기합니다. API는 ID를 반환하고 브라우저가 별도 조회하는 구조로 시작합니다. 업무 원장은 Task 결과 저장소와 구분합니다.

Celery의 Task와 재시도 모델은 [공식 Tasks 문서](https://docs.celeryq.dev/en/stable/userguide/tasks.html), 발행 API는 [Calling 문서](https://docs.celeryq.dev/en/stable/userguide/calling.html)에서 확인할 수 있습니다.

## 일반 Pika 메시지와의 차이

Phase 1의 `{"body": "hello"}`를 Celery Queue로 보내도 Task 요청이 되지 않습니다. Celery는 Task 이름, ID, 인자 등을 포함하는 프로토콜을 사용하므로 `delay`나 `apply_async`로 메시지를 만들게 합니다.

또한 비동기 Task 요청이 자동 멱등 처리를 제공하지는 않습니다. 업무 Task에는 Phase 6에서 배운 키·트랜잭션 보호를 적용해야 합니다. 다음 글은 실행 중 오류와 Worker 종료를 나누어 다룹니다.

## 학습 확인 및 참고 자료

Broker는 살아 있지만 Result Backend가 중단되면 발행·실행·조회 중 어떤 기능이 달라질까요? 모르는 Task ID의 PENDING을 대기 중인 실제 작업의 증거로 읽으면 안 되는 이유도 설명해 보세요.

- [Phase 9 기술 가이드](https://github.com/amirer21/message-flow-lab/blob/main/docs/technical-guides/phase-09.md)
- [Celery 호출 안내](https://docs.celeryq.dev/en/stable/userguide/calling.html)

{% include message-flow-lab-series.html compact=true %}
