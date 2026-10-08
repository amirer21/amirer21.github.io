---
title: "[06] 실패 메시지 처리 — Retry, TTL, DLQ"
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
description: "일시 실패와 영구 실패를 구분하고 지연 재시도와 최종 격리 흐름을 살펴봅니다."
excerpt: "일시 실패와 영구 실패를 구분하고 지연 재시도와 최종 격리 흐름을 살펴봅니다."
series: message-flow-lab
series_order: 6
permalink: /ko/2026/message-flow-lab/06-retry-dlq/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

실패한 메시지를 계속 Queue에 돌려놓으면 언젠가 성공할까요? 다시 시도해도 같은 오류가 나는 메시지는 반복 비용만 늘릴 수 있습니다. Phase 5는 실패를 분류하고 지연·횟수 제한·최종 격리를 적용합니다.

**범위:** 현재 `backend/app/retry.py`의 실제 구현과 Phase 5 검증 기록입니다. 업무 성공은 학습 시나리오의 이벤트이며 외부 업무 DB 효과를 수행하는 실험은 아닙니다.

## Retry와 Requeue 구분하기

`basic_nack(requeue=True)`는 현재 전달을 Queue로 돌려보냅니다. 앱이 별도 대기와 제한을 설계하지 않으면 빠른 실패·재전달 루프가 생길 수 있습니다.

현재 Retry는 별도 Queue로 새 메시지를 발행하고 TTL이 지난 뒤 작업 Queue로 돌아오게 합니다. 영구 실패나 재시도 한도 초과는 최종 DLQ로 보냅니다.

~~~text
work.q ── 일시 실패 ──> retry.q ── TTL + DLX ──> work.q
   │
   └─ 영구 실패 / 한도 초과 ──> dead.q
~~~

DLX는 만료 등의 이유로 dead-letter된 메시지를 보내는 Exchange입니다. DLQ는 최종 격리용 Queue입니다. 이 프로젝트의 retry.q도 DLX를 사용하지만 최종 격리 위치는 dead.q입니다.

## 코드 해설: 지연과 횟수 제한

현재 상수는 `MAX_RETRIES = 3`, `RETRY_TTL_MS = 5000`입니다. 재시도 Queue 선언에는 다음 인자가 들어갑니다.

~~~python
channel.queue_declare(
    queue=retry_q,
    durable=True,
    arguments={
        "x-message-ttl": RETRY_TTL_MS,
        "x-dead-letter-exchange": self._work_exchange,
        "x-dead-letter-routing-key": "job",
    },
)
~~~

TTL 만료 후 작업 Exchange로 dead-letter됩니다. TTL 5000ms가 “정확히 5초에 업무 시작”을 뜻하지는 않습니다. 만료 처리, Queue 상태와 소비 시점 때문에 실제 재수신까지 더 걸릴 수 있습니다.

재시도 발행은 원래 Message ID를 유지하고 `x-retry-count`를 증가시킵니다.

~~~python
channel.basic_publish(
    exchange=self._retry_exchange,
    routing_key="job",
    body=body,
    properties=retry_props,
    mandatory=True,
)
channel.basic_ack(delivery_tag=method.delivery_tag)
~~~

채널은 Confirm 모드입니다. 정상적인 재발행 확인 이후 원본을 ACK하는 순서이며, 발행 예외가 발생하면 그 ACK까지 진행하지 않습니다. 다만 새 발행의 확인과 원본 ACK는 하나의 원자적 동작이 아닙니다.

## 세 가지 시나리오 실험

새 실험에서 시나리오를 발행하고 작업 Queue의 메시지를 한 건씩 처리합니다. retry.q에 대기 중이면 바로 다음 처리를 누르기보다 작업 Queue로 돌아오는 것을 관찰합니다.

| 시나리오 | 분류 | 예상 최종 결과 |
|---|---|---|
| transient_2x | 처음 두 번 일시 실패 | 세 번째 시도 성공 |
| permanent | 영구 실패 | 첫 시도에서 DLQ 격리 |
| retry_exceed | 계속 일시 실패 | 추가 재시도 3회 후 DLQ |

재시도 3회는 최초 시도를 포함한 3회가 아닙니다. 계속 실패하면 retry count 0, 1, 2, 3으로 총 4번 처리하게 됩니다. 최초 시도와 추가 재시도를 따로 기록하세요.

`PROCESSING_STARTED`, `PROCESSING_FAILED`, `RETRY_SCHEDULED`, `RETRY_RETURNED`, `DLQ_STORED`를 같은 Message ID로 연결하면 이동과 시도 횟수를 추적할 수 있습니다.

## 기존 결과와 해석

검증 기록에는 일시 실패 두 번 후 성공, 영구 실패 즉시 격리, 재시도 한도 초과 후 DLQ가 기록되어 있습니다. 이것은 고정 시나리오의 실제 Queue 이동 결과입니다. 실제 외부 API의 모든 오류를 자동 분류한다는 의미는 아닙니다.

DLQ에 들어갔다고 원인이 해결되지는 않습니다. 운영에서는 원인 확인, 입력 수정, 멱등성 확인, 재처리 정책이 필요합니다. Queue에서 메시지를 꺼내 목록을 보여 주는 행위도 소비이므로 관측 이력 조회와 구분해야 합니다.

## 중복과 유실 경계

Retry 발행이 확인된 뒤 원본 ACK 전에 종료되면 원본과 재시도 메시지가 함께 남을 수 있습니다. Message ID나 업무 키를 보존하는 이유가 여기에 있습니다. 7편의 멱등 처리와 결합해야 업무 중복을 방어할 수 있습니다.

또한 Confirm으로 retry.q에 넣었다는 사실이 이후 DLX 이동까지 같은 안전성을 보장하지는 않습니다. DLX의 전달 보장은 Queue 종류와 정책에 따라 다릅니다. [RabbitMQ DLX 공식 문서](https://www.rabbitmq.com/docs/dlx)에서 사용 구성의 보장을 따로 확인하세요.

## 학습 확인 및 참고 자료

영구 입력 오류를 계속 재시도하면 무엇이 달라질까요? 추가 재시도 3회에서 총 시도 수가 4회인 이유와 새 발행 후 원본 ACK 사이의 중복 가능성을 설명해 보세요.

- [Phase 5 안내](https://github.com/amirer21/message-flow-lab/blob/main/docs/phase5.md)
- [Retry 코드](https://github.com/amirer21/message-flow-lab/blob/main/backend/app/retry.py)
- [실행 검증 기록](https://github.com/amirer21/message-flow-lab/blob/main/docs/verification.md)

{% include message-flow-lab-series.html compact=true %}
