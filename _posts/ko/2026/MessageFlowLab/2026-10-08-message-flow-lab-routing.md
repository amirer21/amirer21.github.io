---
title: "[04] Exchange와 Binding으로 메시지 라우팅하기"
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
description: "Direct, Fanout, Topic의 라우팅 규칙을 Queue별 수신 결과와 비교합니다."
excerpt: "Direct, Fanout, Topic의 라우팅 규칙을 Queue별 수신 결과와 비교합니다."
series: message-flow-lab
series_order: 4
permalink: /ko/2026/message-flow-lab/04-routing/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

같은 메시지를 여러 Queue로 보내거나 특정 종류만 골라 전달하려면 어떻게 해야 할까요? RabbitMQ에서는 Producer가 Exchange에 발행하고 Exchange의 종류, Routing Key, Binding으로 대상 Queue를 결정합니다.

**범위:** Phase 3의 실제 Direct·Fanout·Topic 실습입니다. Queue A/B/C의 Binding을 바꾸고 발행 전 예측과 실제 수신을 비교합니다.

## 전체 흐름과 용어

~~~text
Producer ── Routing Key와 메시지 ──> Exchange
                                      ├─ Binding 규칙 ──> Queue A
                                      ├─ Binding 규칙 ──> Queue B
                                      └─ Binding 규칙 ──> Queue C
~~~

Routing Key는 발행자가 붙이는 값, Binding은 Exchange와 Queue를 잇는 규칙입니다. Exchange를 업무 실행자나 모든 메시지의 저장소로 생각하지 않습니다. 이 실습에서 대기 메시지를 보관하는 곳은 Queue입니다.

| 종류 | 전달 기준 | 활용 예 |
|---|---|---|
| Direct | Binding Key와 Routing Key의 정확한 일치 | 로그 등급별 분리 |
| Fanout | Routing Key와 무관하게 연결된 Queue로 전달 | 여러 구독자에 같은 이벤트 배포 |
| Topic | 점으로 나눈 단어의 패턴 매칭 | 도메인·이벤트 종류별 구독 |

## 프로젝트 코드와 토폴로지 수명

`backend/app/routing.py`는 전용 스레드에서 Phase 3의 연결과 임시 토폴로지를 소유합니다. Exchange 이름은 `phase3.<uuid>` 형식이고 Queue는 exclusive 임시 자원입니다. 아래는 선언 명령의 구조를 이해하기 위한 예시이며 실제 파일의 전체 발췌는 아닙니다.

~~~python
channel.exchange_declare(exchange=exchange_name, exchange_type="direct")
channel.queue_bind(
    queue=queue_name,
    exchange=exchange_name,
    routing_key="error",
)
channel.basic_publish(
    exchange=exchange_name,
    routing_key="error",
    body=payload,
)
~~~

Queue별 수신·ACK는 실제로 메시지를 꺼내는 실험 동작입니다. 조회 버튼으로 모든 대기 메시지를 비파괴적으로 열람하는 것과 같지 않습니다.

새 실험은 해당 Phase의 기존 토폴로지와 대기 메시지를 초기화합니다. 소유 API 연결이 종료돼도 exclusive Queue가 삭제되므로 Phase 3 Queue로 재시작 영속성 실험을 하지 않습니다.

## Direct 실험

Binding을 A=`error`, B=`info`, C=`error`로 설정합니다. 발행하기 전에 대상 Queue를 적고 Queue별 수신으로 확인합니다.

| Routing Key | 예상 수신 Queue |
|---|---|
| error | A, C |
| info | B |
| unmatched | 없음 |

두 Queue에 전달되면 같은 논리 Message ID의 복사가 각각 보관됩니다. A에서 ACK해도 C의 복사가 함께 사라지는 것은 아닙니다. 한 Queue에 Consumer 여러 개를 붙여 메시지를 나눠 받는 경우와도 다릅니다.

## Fanout 실험

Fanout으로 새 실험을 만들고 A/B/C를 연결합니다. Routing Key를 `anything`, `error` 등으로 바꿔 발행해도 세 Queue 모두 수신하는지 확인합니다.

“모든 Consumer가 같은 메시지를 받는다”는 표현은 부정확합니다. 이 실험의 복제 대상은 Binding된 Queue입니다. 각 Queue에 여러 Consumer가 있으면 그 Queue의 전달을 나눠 받습니다.

## Topic 실험: 별표와 샵

A=`order.*`, B=`payment.*`, C=`#`로 설정합니다.

| Routing Key | 예상 수신 Queue | 해석 |
|---|---|---|
| order.created | A, C | order 뒤 한 단어 |
| payment.completed | B, C | payment 뒤 한 단어 |
| order.created.eu | C | order 뒤 두 단어라 A에는 불일치 |
| order | C | A는 추가 한 단어 필요 |

Topic의 `*`는 한 단어, `#`는 0개 이상의 단어를 의미합니다. 따라서 `order.#`는 `order` 자체도 받습니다. 문자열 부분 일치와 다르므로 점으로 나뉜 단어 수를 먼저 세어 보세요.

## Binding 변경과 결과 해석

한 메시지를 발행해 Queue에 남겨 둔 뒤 Binding을 바꿉니다. 기존 대기 메시지는 그대로 있고 이후 발행부터 새 규칙이 적용되는지 확인합니다. Binding은 이미 저장된 메시지의 이동 규칙이 아닙니다.

프로젝트 검증 문서에는 Direct·Fanout·Topic과 `order.#`의 0단어 매칭 결과가 기록되어 있습니다. 같은 Exchange 이름의 종류 변경 요청은 409로 거절되는 실험도 포함합니다.

이 Phase에는 Publisher Confirm이 없습니다. 아무 Queue도 받지 않은 메시지에 대해 발행 호출이 반환됐다는 사실만으로 라우팅 성공을 주장하면 안 됩니다. 다음 글에서 Confirm과 mandatory Return을 나누어 관찰합니다.

## 학습 확인 및 참고 자료

Fanout의 세 Queue 복제와 한 Queue의 세 Consumer 분배는 어떻게 다를까요? Binding을 변경해도 이미 Queue에 들어온 메시지가 남는 이유를 설명해 보세요.

- [Phase 3 실험 안내](https://github.com/amirer21/message-flow-lab/blob/main/docs/phase3.md)
- [Routing 코드](https://github.com/amirer21/message-flow-lab/blob/main/backend/app/routing.py)
- [RabbitMQ 튜토리얼](https://www.rabbitmq.com/tutorials)

{% include message-flow-lab-series.html compact=true %}
