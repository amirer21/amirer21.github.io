---
title: "[08] Worker와 Prefetch로 처리량 실험하기"
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
description: "Worker 수와 Prefetch를 따로 바꾸는 실험을 설계하고 처리량과 완료 시간을 해석합니다."
excerpt: "Worker 수와 Prefetch를 따로 바꾸는 실험을 설계하고 처리량과 완료 시간을 해석합니다."
series: message-flow-lab
series_order: 8
permalink: /ko/2026/message-flow-lab/08-worker-prefetch/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

Worker를 세 개로 늘리면 처리량이 세 배가 될까요? Prefetch를 크게 하면 동시 실행도 늘어날까요? 두 설정의 역할을 나누고 같은 입력으로 측정해야 원인을 판단할 수 있습니다.

**범위:** Phase 7은 후속 실험 설계입니다. 아래 통계 코드는 순수 계산 예시이며 현재 대시보드에 Benchmark 기능이 구현됐다는 의미는 아닙니다.

## Worker 수, 동시성, Prefetch의 차이

Worker 수는 소비 프로세스 수, 동시성은 동시에 실행하는 업무 수, Prefetch는 ACK하지 않은 전달의 허용량과 관련됩니다. 일반적인 `basic_consume`과 manual ACK 조건에서 한 Worker가 순차 처리해도 Prefetch 10이면 실행 전 메시지까지 미리 전달받을 수 있습니다.

따라서 Unacked 10을 업무 10개 동시 실행으로 읽지 않습니다. RabbitMQ에서 Consumer 단위 QoS와 global 옵션의 적용 범위는 [Consumer Prefetch 문서](https://www.rabbitmq.com/docs/consumer-prefetch)에서 확인할 수 있습니다. 이 글은 Consumer별 Prefetch를 명시한 실험을 가정합니다.

~~~text
Queue ──> Worker A: 실행 1개 + 미리 받은 대기 메시지
      └─> Worker B: 실행 1개 + 미리 받은 대기 메시지
~~~

Prefetch가 크면 전달 왕복 대기를 줄일 수 있지만 느린 Worker에 메시지가 많이 예약되어 다른 Worker가 기다릴 수도 있습니다. 설정 하나에 고정된 정답이 있는 것은 아닙니다.

## 공정한 부하와 비교 조건

예를 들어 30개 메시지에 짧은 작업 200ms와 긴 작업 2초를 섞고 입력 순서를 고정합니다. 작업은 실제 CPU 계산인지 대기 모의인지 기록합니다. sleep 작업 결과를 CPU 연산 처리량으로 일반화하지 않습니다.

| 실험 | Worker 수 | Worker별 동시성 | Prefetch |
|---|---:|---:|---:|
| 기준 | 1 | 1 | 1 |
| Worker 비교 | 3 | 1 | 1 |
| 예약량 비교 A | 3 | 1 | 10 |
| 예약량 비교 B | 3 | 1 | 100 |

각 비교에서 바꾼 조건 하나를 적고 Queue 종류·메시지 크기·ACK 시점·DB 처리·장비 조건은 유지합니다. 최소 3회 반복해 편차를 기록합니다. 실제 실험에서는 독립 run ID와 전용 Queue를 사용합니다.

## 무엇을 측정할 것인가?

- **처리량:** 완료한 작업 수 / 측정 경과 시간.
- **완료 지연:** 발행부터 완료까지의 시간.
- **시작 대기:** 발행부터 실제 업무 시작까지의 시간.
- **p50·p95:** 완료 지연 분포의 중앙과 느린 쪽.
- **분배:** Worker별 완료 수와 작업 시간.
- **누락 대조:** 발행·성공·실패·미완료 개수.

생산 종료를 측정 종료로 삼으면 Consumer에 남은 대기를 숨깁니다. 모든 메시지의 최종 결과를 대조하거나 timeout 시 미완료를 명시해야 합니다.

## 학습용 통계 코드

다음은 프로젝트 가이드의 nearest-rank 방식입니다. 수집·Worker 운영 코드는 포함하지 않습니다.

~~~python
import math

def summarize(completion_latencies, elapsed_seconds):
    if not completion_latencies or elapsed_seconds <= 0:
        raise ValueError("완료 표본과 양의 경과 시간이 필요합니다")
    ordered = sorted(completion_latencies)

    def percentile(p):
        return ordered[max(0, math.ceil(len(ordered) * p) - 1)]

    return {
        "completed": len(ordered),
        "throughput_per_sec": len(ordered) / elapsed_seconds,
        "p50_sec": percentile(0.50),
        "p95_sec": percentile(0.95),
    }
~~~

표본이 적으면 p95가 최댓값과 비슷할 수 있으므로 표본 수도 표시합니다. 실패한 작업을 정상 완료 표본에 넣어 수치를 좋게 만들지 않습니다. 실패 완료 지연이 필요하면 별도 분포로 표시합니다.

## 실험 순서와 예상 관찰

1. 이전 run의 Consumer와 Ready·Unacked를 확인합니다.
2. 새로운 run ID, 전용 Queue, 고정 입력을 준비합니다.
3. Worker를 시작하고 설정값을 기록합니다.
4. 같은 메시지를 발행해 시작·완료 시각과 Worker를 수집합니다.
5. 전체 결과를 대조한 뒤 통계를 계산합니다.
6. 한 조건만 바꿔 반복하고 편차를 비교합니다.

Worker가 늘면 처리량이 높아질 수 있지만 DB 경합이나 CPU 제한이 병목이면 선형 증가하지 않을 수 있습니다. Prefetch 증가 시 평균은 줄고 p95는 커질 수도 있으므로 한 개의 숫자로 결론을 내리지 않습니다.

단일 시계에서 경과 시간은 monotonic 계열로, 표시용 이벤트 시각은 UTC로 기록합니다. 여러 호스트의 UTC를 빼면 시계 오차가 섞이므로 측정 주체와 동기화 조건을 함께 기록합니다.

## 구현과 검증 범위

현재 프로젝트에는 이 비교의 실제 측정 결과가 없습니다. 예상 관찰은 “더 빨라진다”라는 보장 대신 비교해야 할 항목을 제시합니다. 구현 시에는 종료 신호, heartbeat, 처리 timeout, 실험 정리와 최대 부하도 준비해야 합니다.

Pika callback에서 긴 처리를 모의할 때는 프로젝트 독립 Consumer처럼 연결 이벤트 처리를 고려합니다. 단순한 긴 blocking sleep은 실험하려던 Prefetch 외에 연결 문제를 섞을 수 있습니다.

## 학습 확인 및 참고 자료

Unacked가 크지만 CPU 사용률은 낮은 상황을 어떻게 해석할까요? Worker 수와 Prefetch를 동시에 변경하면 원인을 판단하기 어려운 이유도 설명해 보세요.

- [Phase 7 기술 가이드](https://github.com/amirer21/message-flow-lab/blob/main/docs/technical-guides/phase-07.md)
- [후속 개발 계획](https://github.com/amirer21/message-flow-lab/blob/main/docs/remaining-development-plan.md)

{% include message-flow-lab-series.html compact=true %}
