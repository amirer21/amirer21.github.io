---
title: "[02] Pika로 배우는 메시지 발행과 수동 ACK"
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
description: "Ready와 Unacked, Prefetch 1, 수동 ACK를 실제 메시지 상태 변화로 이해합니다."
excerpt: "Ready와 Unacked, Prefetch 1, 수동 ACK를 실제 메시지 상태 변화로 이해합니다."
series: message-flow-lab
series_order: 2
permalink: /ko/2026/message-flow-lab/02-pika-ack/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

메시지를 받았다는 사실과 업무를 끝냈다는 사실은 어떻게 구분할까요? Phase 1 Consumer는 메시지를 받아도 자동 ACK하지 않습니다. 사용자가 ACK 버튼을 눌러야 Broker에 확인을 보내므로 전달과 확인 사이의 상태를 볼 수 있습니다.

**범위:** 실제 Phase 1 코드와 기존 검증 기록을 설명합니다. 이 글 작성 과정에서 Docker 실험을 새로 수행한 것은 아닙니다.

## 핵심 개념과 상태 전이

~~~text
Producer 발행 ──> Ready ── Consumer 전달 ──> Unacked
                   ^                         │
                   │ 연결 종료 / 재큐잉        └─ ACK ──> 확인된 전달 제거
                   └─────────────────────────
~~~

Ready는 전달을 기다리는 메시지, Unacked는 전달됐지만 확인되지 않은 메시지입니다. 이 실험은 Prefetch 1이므로 ACK를 기다리는 동안 같은 Consumer에 다음 메시지를 추가 전달하지 않습니다.

Consumer ACK는 Consumer에서 Broker로 보냅니다. 발행자가 Broker의 수락을 확인하는 Publisher Confirm은 별도로 5편에서 다룹니다. [RabbitMQ ACK와 Confirm 설명](https://www.rabbitmq.com/docs/confirms)도 두 경계를 구분합니다.

## 발행 코드 해설

`backend/app/messaging.py`는 기본 Exchange를 사용합니다. 주요 인자를 보여 주는 축약 코드입니다.

~~~python
channel.queue_declare(queue=queue, durable=True)
channel.basic_publish(
    exchange="",
    routing_key=queue,
    body=json.dumps({"body": text}, ensure_ascii=False).encode("utf-8"),
    properties=pika.BasicProperties(
        message_id=message_id,
        correlation_id=message_id,
        content_type="application/json",
        delivery_mode=2,
    ),
)
~~~

기본 Exchange는 Queue 이름과 일치하는 Routing Key로 전달합니다. `message_id`는 앱이 만든 논리 식별자이며 그 값만으로 Broker가 업무 중복을 제거하지는 않습니다.

Queue의 `durable=True`와 메시지의 `delivery_mode=2`는 다른 속성입니다. Phase 1은 Confirm 모드를 켜지 않으므로 `PUBLISH_SENT` 반환을 Broker 수락 확인이나 업무 완료로 해석하지 않습니다.

## 수동 ACK와 채널 소유권

`backend/app/consumer.py`의 ConsumerSession은 전용 스레드에서 연결을 관리합니다.

~~~python
channel.basic_qos(prefetch_count=1)
channel.basic_consume(
    queue=settings.queue,
    on_message_callback=self._received,
    auto_ack=False,
)
~~~

수신 callback은 Message ID와 새 Attempt ID를 저장하고 delivery tag를 보관합니다. HTTP ACK 요청은 Python Queue로 소유 스레드에 전달합니다. 요청 스레드가 Pika 채널을 직접 조작하지 않습니다.

ACK는 현재 전달인지 먼저 확인합니다.

~~~python
if not pending or pending["attempt_id"] != attempt_id:
    raise ValueError("현재 전달과 일치하지 않는 ACK입니다.")
channel.basic_ack(delivery_tag=tag)
~~~

Attempt ID가 없으면 늦게 도착한 이전 버튼 요청이 다음 전달을 ACK할 수 있습니다. delivery tag는 해당 채널의 전달 식별자이므로 업무 키처럼 영구 재사용하지 않습니다.

## 실험 절차와 예상 결과

이전 메시지와 다른 Consumer가 없는 조건으로 시작합니다.

| 순서 | 동작 | Ready | Unacked |
|---|---|---:|---:|
| 1 | Consumer 정지, 3개 발행 | 3 | 0 |
| 2 | Consumer 시작 | 2 | 1 |
| 3 | 첫 ACK, 다음 전달 도착 | 1 | 1 |
| 4 | 두 번째 ACK, 다음 전달 도착 | 0 | 1 |
| 5 | 마지막 ACK 반영 | 0 | 0 |

표는 수집이 안정된 뒤의 예상 값입니다. Management API 갱신과 callback 사이의 시차로 중간 값이 보일 수 있으므로 이벤트와 수집 시각을 함께 확인합니다.

Python으로 직접 실습하려면 UI Consumer를 먼저 멈춥니다.

~~~powershell
docker compose exec api python scripts/producer.py hello --count 3
docker compose exec api python workers/pika_worker/consumer.py --seconds 2
~~~

독립 Consumer는 처리 대기를 흉내 낸 뒤 ACK하며 `Ctrl+C`로 종료합니다. 콘솔 관측과 API 세션 카운터는 같은 집계가 아닙니다.

## 관측 결과와 해석

검증 문서에는 3개 발행, Ready 3, Unacked 1, ACK 3회 후 Queue 비움이 기록되어 있습니다. 현재 조건의 수동 ACK 흐름을 확인한 결과이며 모든 장애에서 업무가 한 번만 실행된다는 증거는 아닙니다.

`ACK_SENT`는 앱의 ACK 전송 기록입니다. Broker 내부 처리 순간을 관측한 이벤트는 아닙니다. 다음 글에서는 ACK 전후에 프로세스를 종료하여 재전달을 비교합니다.

## 학습 확인 및 참고 자료

Ready 0 / Unacked 1을 보고 모든 업무가 끝났다고 말할 수 있을까요? 이전 ACK 요청이 다음 전달을 확인하지 않도록 Attempt ID를 사용하는 이유도 설명해 보세요.

- [Phase 1 코드 학습](https://github.com/amirer21/message-flow-lab/blob/main/docs/code-study/phase1.md)
- [Consumer 코드](https://github.com/amirer21/message-flow-lab/blob/main/backend/app/consumer.py)
- [실행 검증 기록](https://github.com/amirer21/message-flow-lab/blob/main/docs/verification.md)

{% include message-flow-lab-series.html compact=true %}
