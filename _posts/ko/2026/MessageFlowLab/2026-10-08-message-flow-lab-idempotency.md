---
title: "[07] 중복 메시지에도 업무를 한 번만 반영하기"
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
description: "SQLite 고유 제약과 트랜잭션, Commit 이후 ACK로 업무 중복을 방어합니다."
excerpt: "SQLite 고유 제약과 트랜잭션, Commit 이후 ACK로 업무 중복을 방어합니다."
series: message-flow-lab
series_order: 7
permalink: /ko/2026/message-flow-lab/07-idempotency/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

메시지를 한 번만 받도록 만들기보다, 같은 요청이 다시 와도 업무 효과가 한 번만 남도록 만들 수 있을까요? Phase 2에서 재현한 중복 업무를 Phase 6의 DB 트랜잭션으로 방어해 봅니다.

**범위:** 현재 로컬 소스의 Phase 6은 PostgreSQL이 아닌 **SQLite**를 사용합니다. 초기 PostgreSQL 계획과 구분해 실제 코드를 설명합니다. 장애 시나리오는 프로세스 종료 대신 NACK 재큐잉으로 재전달을 만드는 모의 실험입니다.

## 메시지 식별자와 업무 키

| 식별자 | 무엇을 식별하는가? |
|---|---|
| Message ID | 논리 메시지 |
| Attempt ID | 한 번의 전달·처리 시도 |
| Idempotency Key | 반복돼도 한 번만 적용할 업무 요청 |
| Consumer Scope | 해당 업무 키를 처리하는 소비 영역 |

Producer가 같은 주문을 두 번 발행하면 Message ID가 달라도 업무 키는 같아야 합니다. 반대로 새로운 업무에 이전 키를 재사용하면 정상 요청이 중복으로 처리될 수 있습니다.

현재 실험은 `consumer_scope="phase6-lab"`와 `idempotency_key` 조합으로 중복을 판별합니다. 같은 키의 amount가 달라져도 새 업무로 적용하지 않습니다. 실무에서는 요청 내용의 일치 여부와 충돌 응답도 설계해야 합니다.

## DB 구조와 원자성

`backend/app/database.py`는 `data/idempotency.db`에 두 테이블을 만듭니다. 저장 경로는 `EVENT_LOG` 부모 디렉터리에서 결정됩니다.

~~~sql
CREATE TABLE processed_commands (
    consumer_scope TEXT NOT NULL,
    idempotency_key TEXT NOT NULL,
    processed_at TEXT NOT NULL,
    PRIMARY KEY (consumer_scope, idempotency_key)
);
~~~

`business_effects`에는 키·금액·생성 시각을 저장합니다. 중복 방어의 핵심은 먼저 SELECT로 존재를 확인하는 것이 아니라 DB 고유 제약에 삽입을 시도하는 것입니다. [SQLite의 ON CONFLICT 설명](https://www.sqlite.org/lang_conflict.html)에 따라 `INSERT OR IGNORE`의 고유 키 충돌 동작을 이해할 수 있습니다.

처리 키 삽입과 업무 효과 삽입을 **같은 트랜잭션**에서 수행합니다. 먼저 처리 키만 별도 커밋하면 그 뒤 업무 실패 시 재전달을 잘못 무시할 수 있습니다.

## 실제 처리 코드 해설

다음은 `idempotency.py`의 핵심을 축약한 코드입니다. 연결·시각 변수는 이미 준비되어 있다고 가정합니다.

~~~python
try:
    cursor = conn.execute(
        "INSERT OR IGNORE INTO processed_commands "
        "(consumer_scope, idempotency_key, processed_at) VALUES (?, ?, ?)",
        (scope, key, timestamp),
    )
    if cursor.rowcount == 1:
        conn.execute(
            "INSERT INTO business_effects "
            "(consumer_scope, idempotency_key, amount, created_at) "
            "VALUES (?, ?, ?, ?)",
            (scope, key, amount, timestamp),
        )
    conn.commit()
except Exception:
    conn.rollback()
    raise
finally:
    conn.close()

channel.basic_ack(delivery_tag=method.delivery_tag)
~~~

새 키이면 효과를 추가하고 이미 있으면 건너뜁니다. 정상 트랜잭션 종료 후 ACK합니다. DB 오류가 발생하면 rollback하고 ACK까지 진행하지 않습니다. 미확인 전달의 회수·복구는 연결과 Consumer 생명주기에서 별도로 다뤄야 합니다.

보호 범위는 같은 SQLite 트랜잭션의 데이터입니다. 트랜잭션 안에서 외부 이메일을 보내거나 외부 결제를 호출한다고 그 효과까지 rollback되는 것은 아닙니다.

## 실험 1: 같은 키로 두 메시지 발행

Phase 6의 새 실험을 만들고 키 `order-1001`, amount 100으로 발행한 뒤 처리합니다. 같은 키·금액으로 다시 발행하고 처리합니다.

| 관측 | 첫 처리 | 두 번째 처리 |
|---|---|---|
| Message ID | 새 ID M1 | 새 ID M2 |
| 업무 키 | order-1001 | order-1001 |
| 처리 결과 | applied | skipped |
| 업무 효과 누적 | 1건 | 1건 |

`EFFECT_APPLIED`와 `DUPLICATE_SKIPPED`를 비교합니다. 메시지는 두 번 받았지만 효과는 한 건이라는 구분이 중요합니다. 새 실험의 setup은 기존 Phase 6 Queue와 DB 실험 데이터를 초기화하므로 비교 중에는 다시 setup하지 않습니다.

## 실험 2: Commit 이후 ACK 전 장애 모의

현재 `crash_after_commit` 흐름은 DB commit 이후 다음 명령을 실행합니다.

~~~python
channel.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
~~~

이벤트는 `CRASH_BEFORE_ACK`이지만 실제 OS 프로세스 강제 종료는 아닙니다. 재큐잉 후 같은 메시지를 다시 처리하여 중복 효과를 건너뛰는 경로를 관찰합니다.

예상 결과는 재전달과 업무 효과 1건입니다. 실제 Worker 강제 종료·동시 Worker 경쟁·DB rollback 장애는 각각 별도 실험이 필요합니다. 기존 10월 7일 검증 문서에는 Phase 6 실제 통합 검증이 없어 이 글에서는 완료 결과로 표현하지 않습니다.

## 멱등 처리의 한계와 확장

이 설계는 메시지 전달 횟수를 1회로 제한하지 않습니다. 업무 키별 DB 효과를 한 번만 반영하는 방식입니다. SQLite의 로컬 실험을 다중 서버 PostgreSQL 구성의 검증으로 대신할 수도 없습니다.

외부 업무까지 다루려면 외부 서비스의 멱등 키, 상태 조회, 보상 처리 등을 검토합니다. 업무 DB와 이벤트 발행의 사이를 보호하는 방법은 마지막 Outbox 글로 이어집니다.

## 학습 확인 및 참고 자료

처리 키와 업무 효과를 따로 커밋하면 어떤 장애가 생길까요? 같은 Message ID가 아니라 업무 키를 사용하는 이유와 NACK 모의 실험의 검증 한계를 설명해 보세요.

- [Phase 6 안내](https://github.com/amirer21/message-flow-lab/blob/main/docs/phase6.md)
- [SQLite 구조](https://github.com/amirer21/message-flow-lab/blob/main/backend/app/database.py)
- [멱등 처리 코드](https://github.com/amirer21/message-flow-lab/blob/main/backend/app/idempotency.py)

{% include message-flow-lab-series.html compact=true %}
