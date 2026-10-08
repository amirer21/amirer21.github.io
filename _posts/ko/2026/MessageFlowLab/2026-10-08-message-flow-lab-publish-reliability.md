---
title: "[05] 발행 성공의 의미 — Confirm, Return, 영속성"
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
description: "Publisher Confirm, mandatory Return, durable Queue와 persistent 메시지의 경계를 구분합니다."
excerpt: "Publisher Confirm, mandatory Return, durable Queue와 persistent 메시지의 경계를 구분합니다."
series: message-flow-lab
series_order: 5
permalink: /ko/2026/message-flow-lab/05-publish-reliability/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

발행 성공을 한 개의 boolean으로 표현할 수 있을까요? Broker의 수락, Queue로의 라우팅, Consumer의 업무 완료는 다른 사실입니다. Phase 4에서는 Confirm, mandatory Return, 영속성 설정을 각각 관찰합니다.

**범위:** 실제 Phase 4 코드와 기존 검증 기록입니다. Broker 재시작·실제 네트워크 단절 결과는 검증 완료로 표시하지 않습니다.

## 세 가지 확인 경계

| 질문 | 확인 방법 | 그 사실만으로 알 수 없는 것 |
|---|---|---|
| Broker가 발행을 수락했는가? | Publisher Confirm ACK/NACK | Consumer 업무 완료 |
| 대상 Queue로 라우팅되지 않았는가? | mandatory 발행의 Return | 업무 DB 반영 여부 |
| Consumer가 전달을 확인했는가? | Consumer ACK | 모든 외부 업무 효과의 원자성 |

Confirm과 Consumer ACK는 독립적입니다. 특히 라우팅할 Queue가 없는 mandatory 메시지에서도 Return과 Confirm ACK를 함께 받을 수 있습니다. [RabbitMQ 공식 설명](https://www.rabbitmq.com/docs/confirms)에 따라 이 사실들을 분리해 다룹니다.

## 프로젝트의 Confirm 발행 코드

`backend/app/reliability.py`는 전용 채널을 Confirm 모드로 설정하고, 단계 전용 Exchange와 Queue를 준비합니다. 다음은 제어 흐름을 보여 주는 축약 예시입니다.

~~~python
channel.confirm_delivery()
try:
    channel.basic_publish(
        exchange=exchange_name,
        routing_key=routing_key,
        body=body_bytes,
        properties=properties,
        mandatory=True,
    )
except pika.exceptions.UnroutableError:
    # Confirm 모드의 반환 메시지: Return 정보와 Confirm 결과를 분리
    handle_return()
except pika.exceptions.NackError:
    handle_nack()
except (pika.exceptions.AMQPError, OSError):
    handle_unknown_outcome()
~~~

위 `handle_*` 함수는 설명용 자리표시자이며 프로젝트 함수 이름이 아닙니다. 실제 코드는 `PUBLISH_CONFIRMED`, `PUBLISH_RETURNED`, `PUBLISH_NACKED`, `PUBLISH_OUTCOME_UNKNOWN` 등으로 관측 결과를 구분합니다.

연결이 끊겨 확인을 받지 못한 경우 “실패했으니 아무것도 전송되지 않았다”로 해석하지 않습니다. 이미 Broker가 받은 뒤 응답만 잃었을 수 있습니다.

## 정상 Confirm과 mandatory Return 실험

Phase 4 새 실험을 만든 뒤 시나리오를 하나씩 실행합니다. 새 실험은 해당 Phase의 기존 자원을 초기화하므로 이전 결과를 먼저 기록합니다.

| 시나리오 | 발행 조건 | 예상 결과 |
|---|---|---|
| normal | 정상 Binding으로 발행 | Confirm ACK, Queue A 보관 |
| mandatory_unroutable | Binding 없는 Routing Key, mandatory | Return과 Confirm ACK, Queue 미보관 |
| persistent | durable Queue B, delivery_mode=2 | Confirm ACK, Queue B 보관 |
| transient | 비영속 Queue C, delivery_mode=1 | Confirm ACK, 실행 중 Queue C 보관 |

프로젝트 검증 기록에는 위 발행·라우팅 결과와 수신·ACK 결과가 있습니다. Return을 받았다는 사실과 Confirm ACK를 받았다는 사실을 한 개의 성공/실패 값으로 합치지 않은 점을 확인합니다.

## durable과 persistent는 다른 속성

`durable=True`는 Queue 선언의 속성이고 `delivery_mode=2`는 메시지 속성입니다. 재시작 실험에서는 둘을 함께 확인해야 합니다.

~~~python
channel.queue_declare(queue=queue_name, durable=True)
properties = pika.BasicProperties(delivery_mode=2)
~~~

Phase 4의 비교 Queue C는 `durable=False, auto_delete=True`이며 메시지도 비영속입니다. 따라서 B/C 재시작 비교는 Queue와 메시지 조건을 함께 바꾼 실험입니다. 메시지 영속성만의 효과를 분리하려면 같은 durable Queue 조건에서 delivery mode만 바꾸는 추가 실험이 필요합니다.

auto-delete는 Consumer 사용과 수명 조건이 관련된 속성입니다. 모든 auto-delete Queue가 단순 연결 종료만으로 삭제된다고 일반화하지 않습니다.

## 재시작·장애 실험의 범위

재시작 관찰은 다른 실습에 영향을 주지 않는 별도 Broker 환경에서 준비합니다. 메시지를 소비하지 않은 상태로 Queue 이름·속성·Message ID를 기록하고 정상 재시작 전후를 비교합니다.

**기존 검증 문서에서는 Broker 재시작 잔존을 미검증으로 표시합니다.** NACK와 결과 미확인 분기는 mock 검증이며 실제 네트워크 장애를 수행한 기록은 없습니다. 글의 예상 관찰을 실제 측정 결과로 읽지 않아야 합니다.

정상 재시작에서 메시지가 남았더라도 디스크 손상·전원 차단·복제 장애 전체에 대한 보장으로 확대하지 않습니다. Queue 종류와 저장·복제 정책까지 별도 조건으로 기록해야 합니다.

## 학습 확인 및 참고 자료

Confirm ACK와 Return이 동시에 보일 수 있는 이유를 설명해 보세요. 연결 오류 뒤 자동 재발행하면 왜 중복 가능성이 생기는지도 생각해 보세요.

다음 글에서는 실패한 업무를 제한된 횟수로 다시 시도하고 최종 DLQ에 격리합니다.

- [Phase 4 실험 안내](https://github.com/amirer21/message-flow-lab/blob/main/docs/phase4.md)
- [발행 신뢰성 코드](https://github.com/amirer21/message-flow-lab/blob/main/backend/app/reliability.py)
- [검증과 미검증 범위](https://github.com/amirer21/message-flow-lab/blob/main/docs/verification.md)

{% include message-flow-lab-series.html compact=true %}
