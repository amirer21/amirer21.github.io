---
title: "[13] Transactional Outbox와 종합 장애 실험"
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
description: "업무와 발행 의도를 같은 트랜잭션에 저장하고 Relay 중단과 중복 발행을 다룹니다."
excerpt: "업무와 발행 의도를 같은 트랜잭션에 저장하고 Relay 중단과 중복 발행을 다룹니다."
series: message-flow-lab
series_order: 13
permalink: /ko/2026/message-flow-lab/13-outbox/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

주문을 DB에 저장한 직후 프로세스가 죽어서 메시지를 발행하지 못하면 어떻게 복구할까요? 업무 저장과 Broker 발행은 서로 다른 시스템에 쓰는 두 동작입니다. Outbox는 발행할 의도도 업무와 같은 DB 트랜잭션에 저장합니다.

**범위:** Phase 12의 PostgreSQL·Pika 기반 후속 설계입니다. 현재 Phase 6 SQLite 코드와 별개이며 PostgreSQL, Relay, 종합 장애 실험은 아직 준비되지 않았습니다.

## Dual Write의 두 가지 중단 지점

DB를 먼저 commit하고 발행하면 commit 이후 발행 전 종료에서 업무만 남을 수 있습니다. 반대로 메시지를 먼저 발행하면 DB rollback 이후에도 그 메시지가 소비될 수 있습니다.

~~~text
업무 변경 + Outbox INSERT ── 같은 DB commit
                               │
                               v
                   Relay가 미발행 이벤트 claim
                               │
                   RabbitMQ 발행 + Confirm
                               │
                    Outbox published 표시
                               │
                    멱등 Consumer 업무 반영
~~~

Outbox는 발행 의도를 commit된 데이터로 남겨 Relay가 다시 찾을 수 있게 합니다. 업무와 Outbox를 서로 다른 DB에 저장하면 이 단일 트랜잭션의 보호를 적용할 수 없습니다.

## 업무와 발행 의도를 함께 저장하기

다음은 PostgreSQL 학습용 테이블입니다. 업무 테이블과 실제 migration은 별도로 준비해야 합니다.

~~~sql
CREATE TABLE outbox (
    event_id UUID PRIMARY KEY,
    payload JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at TIMESTAMPTZ,
    lease_owner UUID,
    lease_until TIMESTAMPTZ,
    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
~~~

업무 변경 SQL과 최초 outbox INSERT를 같은 트랜잭션에 넣고 함께 commit합니다. event ID는 최초 생성 후 재발행에도 유지합니다. Consumer에서 업무 키로 사용하거나 별도의 업무 키를 payload에 명시합니다.

Outbox에 쓸 내용을 메모리에만 담아 놓고 commit 후 별도 INSERT하면 다시 두 쓰기 사이의 장애가 생깁니다.

## Relay의 짧은 Claim 트랜잭션

여러 Relay가 경쟁할 때 미발행 행을 하나 선택하고 임대 토큰을 기록하는 설계입니다.

~~~sql
WITH candidate AS (
    SELECT event_id
    FROM outbox
    WHERE published_at IS NULL
      AND next_attempt_at <= now()
      AND (lease_until IS NULL OR lease_until < now())
    ORDER BY created_at, event_id
    LIMIT 1
    FOR UPDATE SKIP LOCKED
)
UPDATE outbox o
SET lease_owner = %s,
    lease_until = now() + interval '30 seconds'
FROM candidate c
WHERE o.event_id = c.event_id
RETURNING o.event_id, o.payload;
~~~

`%s`는 Psycopg 드라이버에 바인딩할 새 UUID claim token입니다. 이 SQL은 짧은 트랜잭션 안에서 실행하고 commit한 뒤 네트워크 발행을 시작합니다.

`SKIP LOCKED`는 잠긴 행을 건너뛰어 여러 소비 주체가 일감을 선택하는 용도로 사용할 수 있습니다. 일반적인 일관된 조회와는 목적이 다릅니다. [PostgreSQL SELECT 문서](https://www.postgresql.org/docs/current/sql-select.html)를 함께 확인하세요.

Lease가 만료되면 다른 Relay가 회수할 수 있습니다. 매 claim마다 새 토큰을 사용하고 늦게 돌아온 이전 Relay가 완료 표시를 덮어쓰지 못하게 해야 합니다. 임대가 중복 발행 자체를 제거하는 것은 아닙니다.

## Confirm 이후 완료 표시

다음 함수는 claim 트랜잭션이 이미 commit되고, `ch.confirm_delivery()`와 토폴로지가 준비됐다는 전제의 학습용 예시입니다.

~~~python
import json
import pika

def send_claimed(conn, ch, event_id, payload, claim_token):
    ch.basic_publish(
        exchange="phase12.events",
        routing_key="job",
        mandatory=True,
        body=json.dumps(payload).encode("utf-8"),
        properties=pika.BasicProperties(
            message_id=str(event_id),
            delivery_mode=2,
            content_type="application/json",
        ),
    )
    with conn.transaction():
        cursor = conn.execute(
            "UPDATE outbox SET published_at = now(), lease_until = NULL "
            "WHERE event_id = %s AND lease_owner = %s "
            "AND lease_until > now() AND published_at IS NULL",
            (event_id, claim_token),
        )
        return cursor.rowcount == 1
~~~

발행 예외가 발생하면 완료 표시로 진행하지 않습니다. UPDATE가 0행이면 소유권이나 lease가 바뀐 상태일 수 있으며 발행 결과와 DB 표시 결과를 별도로 기록합니다.

실제 Relay에는 오류 분류, 제한된 backoff, attempts·최종 격리, polling, 인덱스, 종료 처리와 payload 검증이 더 필요합니다. 위 함수 하나가 운영용 Relay 전체는 아닙니다.

## Outbox에도 중복 발행이 남는 이유

Broker가 Confirm한 뒤 published 표시 전에 Relay가 종료되면 같은 이벤트를 다시 발행할 수 있습니다. 따라서 Consumer는 안정된 event ID 또는 업무 키와 고유 제약으로 중복 효과를 막아야 합니다.

먼저 published로 표시하고 나중에 발행하면 중단 시 아직 보내지 않은 이벤트가 완료된 것처럼 숨어 버립니다. 발행 이후 표시를 선택하고 남는 중복 가능성은 멱등 소비로 처리합니다.

## 종합 장애 실험과 예상 관찰

전용 환경에서 장애 지점을 나누어 관측합니다.

| 장애 위치 | 예상 복구 흐름 | 대조할 데이터 |
|---|---|---|
| 업무 트랜잭션 중 오류 | 업무와 Outbox 함께 rollback | 업무 행·Outbox 행 |
| Broker 중단 중 업무 commit | 미발행 Outbox 누적 | commit된 업무·미발행 수 |
| claim 후 Relay 종료 | lease 만료 후 회수 | claim token·lease·재발행 |
| Confirm 후 표시 전 종료 | 동일 이벤트 재발행 가능 | Message ID·발행 이력 |
| Consumer commit 후 ACK 전 종료 | 재전달, 효과 중복 방어 | 처리 키·업무 효과·ACK |

이는 완료된 실제 장애 결과가 아닙니다. 구현 후에는 발행 수만 세지 않고 최종 업무 건수와 금액까지 대조합니다. 순서 보장이 필요하면 같은 업무 묶음의 이벤트 순서·Relay 병렬성도 별도 설계해야 합니다.

## 시리즈에서 연결한 책임

발행 확인은 Producer와 Broker 사이, ACK는 Broker와 Consumer 사이, 멱등 트랜잭션은 Consumer의 업무 DB 안을 보호합니다. Outbox는 업무 DB와 발행 의도를 묶습니다. 각 경계의 확인을 함께 사용해도 모든 외부 효과가 자동 원자화되지는 않습니다.

처음의 “발행 성공이면 업무도 성공인가?”라는 질문에 답하려면 어떤 단계의 성공인지 먼저 말해야 합니다. 실험 기록에 요청, 관측 위치, 장애 시점과 실제 업무 결과를 남기는 이유입니다.

## 학습 확인 및 참고 자료

Confirm 이후 표시 전 종료에서 재발행하는 것이 왜 가능한지 설명해 보세요. Outbox가 중복 없는 발행을 보장한다고 표현하지 않아야 하는 이유도 확인하세요.

- [Phase 12 기술 가이드](https://github.com/amirer21/message-flow-lab/blob/main/docs/technical-guides/phase-12.md)
- [남은 단계 개발 계획](https://github.com/amirer21/message-flow-lab/blob/main/docs/remaining-development-plan.md)

{% include message-flow-lab-series.html compact=true %}
