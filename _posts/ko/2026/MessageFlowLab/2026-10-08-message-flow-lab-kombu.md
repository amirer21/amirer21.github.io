---
title: "[09] Pika에서 Kombu로 — 메시징 추상화 이해하기"
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
description: "Kombu 객체와 Pika 명령을 비교하고 추상화 이후에도 남는 신뢰성 책임을 설명합니다."
excerpt: "Kombu 객체와 Pika 명령을 비교하고 추상화 이후에도 남는 신뢰성 책임을 설명합니다."
series: message-flow-lab
series_order: 9
permalink: /ko/2026/message-flow-lab/09-kombu/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

Pika에서 연결·선언·발행을 반복하는 코드를 줄일 수 있을까요? Kombu는 Connection, Exchange, Queue, Producer, Consumer 객체로 메시징 구성을 표현합니다. API가 달라져도 ACK 시점과 중복 업무의 책임은 계속 남습니다.

**범위:** Phase 8의 학습용 설계 예시입니다. 현재 API 이미지의 requirements에는 Kombu가 없으므로 그대로 실행되는 프로젝트 기능이 아닙니다.

## Pika 명령과 Kombu 객체 대응

| Pika에서 읽은 동작 | Kombu 표현 |
|---|---|
| 연결 생성과 종료 | Connection의 수명 관리 |
| exchange_declare | Exchange 객체와 선언 |
| queue_declare·queue_bind | Queue 객체에 Exchange·Routing Key 지정 |
| basic_publish | Producer.publish |
| basic_consume callback | Consumer callbacks |
| basic_ack | message.ack |

Kombu는 여러 transport를 추상화합니다. RabbitMQ에서 배운 기능이 다른 transport에서도 같은 방식과 보장으로 동작한다고 가정하지 않습니다. 이 글은 RabbitMQ AMQP 연결을 기준으로 읽습니다.

## 선언·발행·소비 코드 해설

아래 코드는 프로젝트 기술 가이드의 send-once/consume-once 예시입니다. Kombu를 설치한 별도 학습 환경, 실행 중인 RabbitMQ, `BROKER_URL` 환경 변수가 필요합니다.

~~~python
import os
from kombu import Connection, Exchange, Queue, Producer, Consumer

exchange = Exchange("phase8.jobs", type="direct", durable=True)
queue = Queue(
    "phase8.jobs.q",
    exchange=exchange,
    routing_key="job",
    durable=True,
)

def received(body, message):
    print("수신 본문:", body)
    message.ack()

with Connection(os.environ["BROKER_URL"]) as conn:
    Producer(conn).publish(
        {"body": "hello"},
        exchange=exchange,
        routing_key="job",
        serializer="json",
        declare=[queue],
        delivery_mode=2,
    )
    with Consumer(
        conn,
        queues=[queue],
        callbacks=[received],
        accept=["json"],
        prefetch_count=1,
    ):
        conn.drain_events(timeout=10)
~~~

`declare=[queue]`는 발행 전에 필요한 토폴로지를 선언합니다. `serializer="json"`은 발행 인코딩, `accept=["json"]`은 소비 허용 형식입니다. callback의 body는 디코딩된 데이터로 다룹니다.

`drain_events`는 한 이벤트를 기다리는 예시입니다. 계속 대기하는 Worker에는 timeout 처리와 반복 루프, 종료 신호, 연결 복구가 필요합니다. print 후 ACK한 이 코드가 DB 업무를 완료했다는 뜻도 아닙니다.

Consumer의 ACK와 callback 수명은 [Kombu Consumers 문서](https://docs.celeryq.dev/projects/kombu/en/stable/userguide/consumers.html)에서도 확인할 수 있습니다.

## 실험 설계: 같은 조건으로 비교하기

Pika와 Kombu를 비교할 때 Queue 속성, payload, ACK 시점과 장애 위치를 맞춥니다. 같은 Queue에서 동시에 Consumer를 실행하면 메시지가 분배되므로 라이브러리 비교 결과가 섞일 수 있습니다. 독립 Queue 또는 순차 실험을 사용합니다.

| 실험 | 비교할 관측 |
|---|---|
| 정상 발행과 수동 ACK | 본문·Message ID·최종 Ready·Unacked |
| ACK 전 Consumer 연결 종료 | 재전달과 업무 기록 |
| Direct·Topic 라우팅 | Queue별 대상 일치 여부 |
| Confirm·mandatory | 사용 버전의 지원 방식과 반환 처리 |
| 연결 실패 후 publish retry | 재발행 여부와 중복 가능성 |

정상 코드 길이만 비교하면 장애 처리 책임이 빠집니다. 추상화의 효과는 줄어든 선언·수명 관리 코드와 여전히 작성해야 하는 업무 정책을 나누어 평가합니다.

## 남는 책임과 예상 결과

ACK는 업무 commit 이후 보내야 하고, 중복 요청은 7편의 업무 키로 보호해야 합니다. Producer publish retry를 사용하면 확인을 잃은 발행의 재시도가 중복을 만들 수 있습니다.

위 예시에는 Publisher Confirm 설정을 추가하지 않았습니다. persistent 메시지와 durable Queue가 있다고 Confirm까지 사용했다고 해석하지 않습니다. Confirm·Return 처리는 설치한 Kombu와 AMQP transport의 지원 설정을 확인하고 실제 Broker에서 별도로 검증합니다.

이 단계의 예상 결과는 정상 메시지의 내용과 Queue 상태가 Pika 실험과 대응한다는 것입니다. 프로젝트에서 실제 비교를 수행한 기록은 아직 없습니다.

## Kombu와 Celery 구분하기

Kombu의 메시지에는 앱이 정한 데이터가 들어갑니다. Celery는 Task 이름·인자·Task ID·실행 상태 모델을 추가합니다. `Producer.publish` 호출을 Celery Task 실행과 동일하게 설명하지 않습니다.

다음 글에서는 같은 RabbitMQ 위에 Celery Worker와 결과 저장소를 추가했을 때 요청·실행·결과가 어떻게 분리되는지 살펴봅니다.

## 학습 확인 및 참고 자료

Kombu Queue 객체는 어떤 Pika 선언 명령을 표현할까요? `message.ack()`를 언제 호출해야 하는 책임이 왜 그대로 남는지도 설명해 보세요.

- [Phase 8 기술 가이드](https://github.com/amirer21/message-flow-lab/blob/main/docs/technical-guides/phase-08.md)
- [Kombu Producers](https://docs.celeryq.dev/projects/kombu/en/stable/userguide/producers.html)

{% include message-flow-lab-series.html compact=true %}
