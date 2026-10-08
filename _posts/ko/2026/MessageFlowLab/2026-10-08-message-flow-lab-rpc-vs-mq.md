---
title: "[12] Pyro5 RPC와 메시지 큐 방식 비교하기"
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
description: "같은 계산을 RPC와 Celery로 요청하며 대기, 서비스 중단, Timeout을 비교합니다."
excerpt: "같은 계산을 RPC와 Celery로 요청하며 대기, 서비스 중단, Timeout을 비교합니다."
series: message-flow-lab
series_order: 12
permalink: /ko/2026/message-flow-lab/12-rpc-vs-mq/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

원격 함수를 호출하고 바로 응답을 기다리는 방식과 Queue에 작업을 남기는 방식은 장애 때 어떻게 다를까요? 같은 합산 함수로 계산 로직을 고정하고 호출 모델의 차이를 비교해 봅니다.

**범위:** Phase 11의 Pyro5·Celery 비교 설계입니다. 현재 Compose에는 Pyro5 서비스가 없으며 아래 코드는 추가할 Linux 컨테이너 환경의 예시입니다.

## 전체 호출 흐름

~~~text
RPC: 브라우저 ──> Gateway ── Pyro Proxy ──> Daemon ──> Calculator
                                  <────── 결과 응답 ────────

MQ:  브라우저 ──> Gateway ──> RabbitMQ ──> Celery Worker
                     │                         │
                     └─ Task ID 반환           └─ 결과 저장소
~~~

이번 비교에서 RPC 호출자는 응답을 기다리고 MQ 호출자는 Task ID를 먼저 받습니다. MQ도 request/reply를 구현할 수 있고 RPC에도 다른 호출 방식이 있으므로 모든 RPC·MQ의 가능성을 이 그림 하나로 제한하지 않습니다.

Pyro5 Proxy는 클라이언트의 원격 객체 표현, Daemon은 서버에서 객체를 등록하고 요청을 처리하는 실행 주체입니다. Name Server 없이 직접 URI부터 연결하는 설계로 시작합니다.

## 학습용 Calculator 서버

~~~python
import Pyro5.api

@Pyro5.api.expose
class Calculator:
    def add(self, x, y):
        return x + y

with Pyro5.api.Daemon(host="0.0.0.0", port=9090) as daemon:
    uri = daemon.register(Calculator(), objectId="calculator")
    print(uri)
    daemon.requestLoop()
~~~

`expose`로 공개할 메서드를 지정하고 `calculator` ID로 등록합니다. 컨테이너 내부에서 접근할 수 있도록 바인딩하는 예시이며 호스트 포트를 공개하는 Compose 설정까지 포함한 코드는 아닙니다.

브라우저는 Pyro 프로토콜에 직접 연결하지 않습니다. Gateway의 Python 코드가 원격 호출을 수행합니다. 사용자에게 임의 URI나 메서드 경로를 입력받는 대신 고정된 계산 API와 입력 범위를 제공합니다.

## Gateway 호출과 Timeout

~~~python
import Pyro5.api
import Pyro5.errors

def rpc_add(x, y):
    with Pyro5.api.Proxy("PYRO:calculator@pyro-service:9090") as proxy:
        proxy._pyroTimeout = 3
        try:
            return {"result": proxy.add(x, y)}
        except Pyro5.errors.TimeoutError:
            return {
                "outcome": "TIMEOUT",
                "server_execution": "UNKNOWN",
            }
~~~

`pyro-service`는 앞으로 추가할 Compose 서비스 이름입니다. Gateway와 같은 네트워크에서 접근한다고 가정합니다. 현재 localhost에 이 서비스가 있다는 의미는 아닙니다.

Timeout은 호출자의 응답 대기 제한입니다. 서버 업무의 취소나 미실행을 증명하지 않으므로 예시 응답은 서버 실행 상태를 UNKNOWN으로 표시합니다. Proxy 호출과 timeout 설정은 [Pyro5 Clients 문서](https://pyro5.readthedocs.io/en/latest/clientcode.html)에서 확인할 수 있습니다.

실제 Gateway에는 연결 오류, 입력 검증, 호출 이력, HTTP 오류 매핑과 동시성 제어도 필요합니다. 동기 원격 호출이 긴 시간 걸리면 API 실행 방식과 timeout을 함께 설계해야 합니다.

## 같은 계산으로 비교하는 실험

RPC의 `add(2, 3)`과 Celery의 `lab.add(2, 3)`를 같은 입력으로 요청합니다. 정상 결과 5를 확인한 뒤 하나씩 장애 조건을 바꿉니다.

| 조건 | RPC에서 볼 것 | MQ에서 볼 것 |
|---|---|---|
| 모두 정상 | 응답 결과와 대기 시간 | Task ID, 실행 시각, 결과 5 |
| 실행 서비스 정지 | 연결·호출 오류 | Broker 정상일 때 Queue 대기 |
| 계산 지연 | 응답 대기와 Timeout | 실행 상태와 완료 조회 시간 |
| 호출 중 연결 단절 | 결과 미확인과 서버 기록 | 발행 확인·Task 이력·업무 결과 |

Worker가 없어도 MQ 요청을 남길 수 있으려면 Broker가 정상이어야 합니다. Broker까지 중단되면 발행이 실패하거나 결과 미확인일 수 있으므로 “MQ는 언제나 요청을 받아 준다”고 설명하지 않습니다.

## Timeout 이후 재시도의 위험

순수 합산을 두 번 실행해도 눈에 띄는 외부 효과가 없지만 주문 생성이나 결제는 다릅니다. RPC 응답이 오지 않아 다시 호출하면 첫 요청이 이미 처리됐을 수 있습니다.

요청에 안정된 업무 키를 포함하고 서버의 결과 기록을 조회하는 방식이 필요합니다. 새 HTTP 요청마다 무조건 새 키를 만들면 같은 업무의 재시도를 연결하기 어렵습니다. 7편의 멱등성은 메시지 큐 전용 개념이 아닙니다.

관측에는 correlation ID, 호출 시작·응답 시각, 서버 시작·완료 기록을 함께 남깁니다. 클라이언트의 Timeout 이벤트만으로 서버 rollback을 추정하지 않습니다.

## 예상 결과와 구현 범위

이 글은 실행 모델을 비교하는 실험 안내이며 실제 Pyro5·Celery 연동 결과가 아닙니다. 완료 기준은 정상 계산 일치, 서비스 중단의 차이, Timeout 이후 서버 결과 확인입니다.

다음 글에서는 호출 모델에 관계없이 업무 DB 저장과 이벤트 발행을 따로 수행할 때 생기는 중단 지점을 Outbox로 다룹니다.

## 학습 확인 및 참고 자료

RPC Timeout 후 같은 주문을 다시 요청할 때 어떤 식별자가 필요할까요? Celery Worker가 정지했는데도 요청을 보관할 수 있는 조건도 설명해 보세요.

- [Phase 11 기술 가이드](https://github.com/amirer21/message-flow-lab/blob/main/docs/technical-guides/phase-11.md)
- [Pyro5 Servers](https://pyro5.readthedocs.io/en/latest/servercode.html)

{% include message-flow-lab-series.html compact=true %}
