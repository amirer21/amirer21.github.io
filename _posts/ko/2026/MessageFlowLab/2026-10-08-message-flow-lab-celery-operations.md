---
title: "[11] Celery Retry와 Worker 종료 동작 이해하기"
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
description: "Task Retry, Broker 재전달, ACK 정책과 Worker 종료를 구분하는 실험을 설계합니다."
excerpt: "Task Retry, Broker 재전달, ACK 정책과 Worker 종료를 구분하는 실험을 설계합니다."
series: message-flow-lab
series_order: 11
permalink: /ko/2026/message-flow-lab/11-celery-operations/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

Task가 재시도되었다는 말은 항상 같은 동작일까요? Celery가 새 시도를 요청한 경우와 Broker가 미확인 전달을 다시 준 경우는 다릅니다. ACK 시점뿐 아니라 종료된 프로세스와 관련 설정을 함께 기록해야 합니다.

**범위:** Phase 10은 후속 운영 실험 설계입니다. Celery를 설치하고 설정을 적용한 Linux Worker 환경이 필요하며 실제 장애 측정 결과는 아직 없습니다.

## Retry와 Broker 재전달 구분하기

| 구분 | 발생 경로 | 관측할 항목 |
|---|---|---|
| Celery Retry | Task가 `self.retry()` 등으로 다음 실행 요청 발행 | Task ID, retries, 새 실행 시도 |
| Broker redelivery | 확인되지 않은 전달의 재큐잉 | redelivered, 연결·ACK 상태 |
| 업무 중복 | 같은 업무가 다시 적용됨 | 업무 키, DB 효과 건수 |

같은 Task ID에도 실행 시도는 여러 번 생길 수 있습니다. Task ID, attempt ID, Worker, retries, 시각을 함께 저장해야 실행 이력을 구분할 수 있습니다. Broker 재전달이 Celery retries를 증가시켰다고 가정하지 않습니다.

## ACK 설정만으로 끝나지 않는 이유

early ACK는 업무 실행 전에 전달을 확인하는 정책입니다. late ACK는 실행 이후 확인을 목표로 하지만 자식 프로세스 종료·실패·timeout의 처리는 추가 설정에 영향을 받습니다.

확인할 설정에는 `task_acks_late`, `task_reject_on_worker_lost`, `task_acks_on_failure_or_timeout` 등이 있습니다. late ACK를 켰다는 이유만으로 모든 자식 종료에서 재실행된다고 단정하지 않습니다.

이 설정들의 관계와 worker-lost의 별도 처리는 [Celery Tasks 공식 문서](https://docs.celeryq.dev/en/stable/userguide/tasks.html)를 기준으로 설치한 버전과 대조해야 합니다.

## 코드 해설: 제한된 Retry와 Queue 분리

아래는 10편의 Celery 앱을 확장하는 학습용 코드입니다. 외부 API 대신 정해진 횟수만큼 실패하는 시나리오를 만듭니다.

~~~python
app.conf.task_routes = {
    "lab.flaky": {"queue": "phase10.slow"},
}

@app.task(
    bind=True,
    name="lab.flaky",
    max_retries=3,
    acks_late=True,
    reject_on_worker_lost=True,
)
def flaky(self, failures_before_success=2):
    if self.request.retries < failures_before_success:
        delay = min(2 ** self.request.retries, 30)
        raise self.retry(
            exc=ConnectionError("학습용 일시 오류"),
            countdown=delay,
        )
    return {
        "attempt_number": self.request.retries + 1,
        "status": "ok",
    }
~~~

`bind=True`로 실행 요청 상태에 접근합니다. `max_retries=3`은 추가 재시도 한도이며 `failures_before_success=2`이면 세 번째 실행에서 성공하도록 설계했습니다. `phase10.slow`를 듣는 전용 Worker가 필요합니다.

이 제한은 Celery Retry 횟수에 대한 것입니다. worker-lost requeue가 같은 횟수 제한으로 자동 제어된다고 생각하면 안 됩니다. 반복적으로 Worker를 죽이는 Task에는 별도 격리·시도 추적 정책이 필요합니다.

## 장애 실험 행렬

실행 자식 종료와 전체 Worker 종료를 다른 실험으로 준비합니다. 설정은 프로필로 저장하고 Worker를 재시작해 적용을 확인합니다.

| 프로필 | ACK 정책 | 장애 위치 | 관찰 질문 |
|---|---|---|---|
| A | early | 업무 실행 중 전체 Worker 종료 | 이미 확인된 전달과 미완료 업무가 어떻게 남는가? |
| B | late, worker-lost 기본 정책 | 실행 자식 종료 | 자식 종료 시 ACK·재큐잉 결과는 무엇인가? |
| C | late, worker-lost requeue 활성 | 실행 자식 종료 | 재전달과 반복 실패는 어떻게 나타나는가? |
| D | late | 업무 commit 후 ACK 전 종료 | 재실행돼도 업무 효과가 1건인가? |

전용 실험 Worker에만 장애를 주고 정상 종료와 강제 종료를 구분합니다. 정확한 최종 결과는 설치 버전·전체 설정·종료 시점에 따라 실제로 기록해야 합니다. 표를 이미 검증된 결과로 읽지 않습니다.

## 관측 자료를 대조하는 방법

Celery 이벤트가 없다는 사실이 실행되지 않았다는 증거는 아닙니다. 이벤트 수집기가 중단됐거나 누락될 수 있으므로 세 자료를 함께 봅니다.

1. RabbitMQ의 Ready·Unacked와 Consumer 연결 상태.
2. Celery의 Task 상태·Worker 이벤트·실행 시도 이력.
3. 업무 DB의 처리 키와 실제 효과.

Result Backend의 성공 상태만으로 외부 업무의 전체 일관성을 판단하지 않습니다. 반대로 업무가 commit된 뒤 결과 저장이 실패했을 수도 있습니다. 관측과 업무 효과의 출처를 기록해야 합니다.

## 중복 업무 보호와 구현 범위

Task Retry, 전체 Worker 종료, 응답 미확인 모두 업무가 반복될 가능성을 고려해야 합니다. Phase 6 방식의 보호를 Task에 적용하되 DB 밖의 외부 효과는 별도 멱등 정책을 사용합니다.

현재 프로젝트에는 이 Celery Worker 프로필·이벤트 수집·실제 종료 기능이 구현되어 있지 않습니다. 완료 기준은 최소 대표 프로필에서 실제 결과를 기록하고, Retry와 재전달을 구분하며, 반복 실패가 무한 루프를 만들지 않음을 확인하는 것입니다.

## 학습 확인 및 참고 자료

Celery retries가 0인데 같은 업무가 다시 실행될 수 있을까요? max_retries가 worker-lost 루프까지 제한한다고 생각하면 안 되는 이유를 설명해 보세요.

- [Phase 10 기술 가이드](https://github.com/amirer21/message-flow-lab/blob/main/docs/technical-guides/phase-10.md)
- [후속 개발 계획](https://github.com/amirer21/message-flow-lab/blob/main/docs/remaining-development-plan.md)

{% include message-flow-lab-series.html compact=true %}
