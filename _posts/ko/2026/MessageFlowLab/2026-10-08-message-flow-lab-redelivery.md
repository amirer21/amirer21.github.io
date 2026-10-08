---
title: "[03] ACK 전에 Consumer가 죽으면 무슨 일이 생길까?"
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
description: "ACK 전후 강제 종료로 재전달과 중복 업무가 발생하는 지점을 확인합니다."
excerpt: "ACK 전후 강제 종료로 재전달과 중복 업무가 발생하는 지점을 확인합니다."
series: message-flow-lab
series_order: 3
permalink: /ko/2026/message-flow-lab/03-redelivery/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

Consumer가 업무를 반영한 직후 죽으면 RabbitMQ는 그 업무가 끝났다는 사실을 알 수 있을까요? ACK 전에 연결이 끊기면 같은 메시지가 다시 전달될 수 있습니다. 업무 기록은 이미 남아 있으므로 재전달된 메시지를 다시 처리하면 업무가 중복됩니다.

**범위:** Phase 2의 독립 Consumer 강제 종료 코드와 기존 실제 검증 기록입니다. 실제 결제나 이메일 대신 디스크에 학습용 업무 기록을 추가합니다.

## 장애 지점을 두 개로 나누기

~~~text
메시지 전달 ──> 업무 기록 저장 ──> ACK 전송 ──> Broker 확인 반영
                       A                  B
                  ACK 전 종료         확인 반영 후 종료
~~~

A에서는 Broker가 아직 확인되지 않은 전달을 되돌릴 수 있습니다. B에서는 해당 전달의 ACK가 반영됐으므로 다시 받을 대상이 사라집니다. ACK 호출 직후와 Broker 확인 반영 이후를 구분하는 것이 실험의 핵심입니다.

## 프로젝트 코드 해설

Phase 2는 Phase 1의 스레드 Consumer와 별도로 Python 자식 프로세스를 실행합니다. API와 Broker는 유지하면서 그 Consumer만 종료하기 위해서입니다.

`backend/app/experiments.py`의 시작 코드입니다.

~~~python
self._process = subprocess.Popen(
    [sys.executable, "-u", "-m", "app.phase2_worker"],
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.DEVNULL,
    text=True,
    encoding="utf-8",
    bufsize=1,
)
~~~

표준 입력에는 고정된 명령과 request ID를, 표준 출력에는 JSON 이벤트·응답을 사용합니다. 사용자가 임의 실행 파일이나 PID를 지정하는 기능은 없습니다. 제어기의 `process.kill()`은 자신이 만든 자식 프로세스에만 적용합니다.

자식의 `process` 명령은 업무 효과를 먼저 저장합니다.

~~~python
effect = append_effect(pending["message_id"], pending["attempt_id"])
pending["processed"] = True
emit("event", event_type="PROCESSED", pending=pending, effect=effect)
~~~

`append_effect`는 JSONL 파일에 append·flush·fsync하는 학습용 효과입니다. 같은 전달 시도의 중복 클릭은 막지만 Message ID별 멱등 처리는 의도적으로 하지 않습니다. 새 전달 시도는 같은 메시지의 업무를 다시 반영할 수 있습니다.

## 실험 A: 업무 반영 후 ACK 전 강제 종료

1. Phase 2 Queue에 메시지 1개를 발행합니다.
2. Consumer를 시작하고 Message ID와 Attempt ID를 적습니다.
3. **업무 반영**을 눌러 기록 1건을 확인합니다.
4. ACK를 누르지 않고 **Consumer 강제 종료**를 실행합니다.
5. Consumer를 다시 시작합니다.
6. 같은 Message ID, 새 Attempt ID, `redelivered=true`를 확인합니다.
7. 업무를 다시 반영하고 같은 메시지의 기록 2건을 확인합니다.
8. ACK 후 Queue가 비었는지 확인합니다.

| 비교 항목 | 첫 전달 | 재전달 |
|---|---|---|
| Message ID | M | M |
| Attempt ID | A1 | A2 |
| 업무 기록 누적 | 1건 | 2건 |
| redelivered | 최초 전달이면 false | true |

프로젝트 검증 문서에는 이 재전달과 업무 기록 2회가 실제 Broker 실험 결과로 기록되어 있습니다.

## 실험 B: ACK 반영 확인 후 강제 종료

새 메시지를 발행하고 업무 반영 후 ACK합니다. **Ready와 Unacked가 모두 0으로 수집된 것을 확인한 뒤** Consumer를 강제 종료하고 다시 시작합니다. 해당 메시지가 재전달되지 않고 업무 기록도 1건인지 확인합니다.

검증 기록의 ACK 이후 종료 실험도 이 순서입니다. `ACK_SENT` 이벤트 하나만 보고 전송 중 ACK까지 Broker가 받았다고 단정하지 않습니다.

## 결과 해석: 재전달은 업무 취소가 아니다

Broker는 Consumer의 JSONL·DB·외부 API 효과를 되돌리지 않습니다. ACK가 없다는 사실만으로 업무 미실행을 판별할 수 없습니다. 재전달은 복구에 필요하지만 중복 실행 가능성도 함께 가져옵니다.

`redelivered`는 재전달 여부를 관측하는 힌트이며 업무 중복 방어의 유일한 기준으로 쓰지 않습니다. Producer의 재발행처럼 별도의 메시지로 같은 업무가 도착할 수도 있습니다. 7편에서는 업무 키와 DB 트랜잭션으로 방어합니다.

## 흔한 오해와 실험 범위

ACK를 업무보다 먼저 보내면 재전달은 줄일 수 있지만 ACK 후 업무 전에 죽었을 때 업무가 누락될 수 있습니다. 따라서 “빨리 ACK하면 안전하다”는 결론을 내리지 않습니다.

현재 실험은 제어기가 소유한 Linux 자식 프로세스 종료를 다룹니다. 전원 차단, Broker 복제 장애, 외부 시스템의 업무 처리까지 검증한 결과는 아닙니다.

## 학습 확인 및 참고 자료

업무 반영 1건과 ACK 0회를 보고 Broker와 앱이 각각 무엇을 알고 있는지 설명해 보세요. 같은 시도의 중복 클릭 방어가 재전달 중복 업무를 막지 못하는 이유도 확인하세요.

- [Phase 2 실험 안내](https://github.com/amirer21/message-flow-lab/blob/main/docs/phase2.md)
- [Phase 2 자식 Consumer](https://github.com/amirer21/message-flow-lab/blob/main/backend/app/phase2_worker.py)
- [실행 검증 기록](https://github.com/amirer21/message-flow-lab/blob/main/docs/verification.md)

{% include message-flow-lab-series.html compact=true %}
