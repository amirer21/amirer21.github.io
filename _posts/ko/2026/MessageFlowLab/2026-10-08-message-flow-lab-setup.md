---
title: "[01] Docker로 RabbitMQ 실습 환경 구축하기"
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
description: "Docker Compose로 RabbitMQ, FastAPI, Vue 대시보드를 실행하고 실제 연결을 확인합니다."
excerpt: "Docker Compose로 RabbitMQ, FastAPI, Vue 대시보드를 실행하고 실제 연결을 확인합니다."
series: message-flow-lab
series_order: 1
permalink: /ko/2026/message-flow-lab/01-setup/
---

{% include message-flow-lab-series.html %}

## 이번 글에서 답할 질문

RabbitMQ만 실행하면 학습 화면에서 메시지를 발행할 수 있을까요? MessageFlow Lab에는 Broker, HTTP Gateway, 대시보드가 함께 필요합니다. 저장소 루트에서 Compose를 실행하고 각 서비스의 연결을 확인해 봅니다.

**범위:** 현재 프로젝트의 로컬 실행 구성입니다. 명령은 Windows PowerShell에서 실행하며 Docker Desktop은 Linux 컨테이너 모드로 준비합니다.

## 실행 환경과 통신 경계

| 서비스 | 컨테이너 역할 | 호스트 접속 주소 |
|---|---|---|
| rabbitmq | AMQP Broker와 관리 API | `localhost:5672`, `http://localhost:15672` |
| api | FastAPI와 Pika 실험 제어 | `http://localhost:8000` |
| frontend | 빌드된 Vue 화면 제공 | `http://localhost:5173` |

RabbitMQ 이미지는 `rabbitmq:4.2-management`입니다. API 컨테이너는 Broker를 `rabbitmq`라는 서비스 이름으로 찾습니다. 컨테이너 안의 `localhost`는 그 컨테이너 자신을 가리키므로 호스트 브라우저 주소와 구분해야 합니다.

Compose는 호스트 포트를 `127.0.0.1`에 바인딩합니다. 같은 PC에서 사용하는 구성입니다. 재현성이 중요한 실험에서는 실제 이미지와 실행 환경도 기록하세요.

## 도구 확인과 저장소 준비

Git, Python 3.12 이상, Docker Desktop과 Compose를 준비합니다. 기본 실습은 컨테이너에서 API와 화면을 실행하므로 호스트 Node.js 설치는 필요하지 않습니다.

~~~powershell
git --version
python --version
docker --version
docker compose version
docker info
~~~

처음 내려받는 경우:

~~~powershell
git clone https://github.com/amirer21/message-flow-lab.git
cd message-flow-lab
python scripts/init_env.py
~~~

환경 생성 스크립트는 무작위 비밀번호·토큰이 포함된 `.env`를 준비하며 기존 파일은 덮어쓰지 않습니다. 비밀번호와 토큰은 자신의 PC에서 사용하고 Git에 올리지 않습니다.

| 변수 | 의미 |
|---|---|
| `RABBIT_USER`, `RABBIT_PASSWORD` | Broker 로그인과 API의 AMQP 접속 |
| `LAB_TOKEN` | 실제 실험 API 인증 |
| `ALLOWED_ORIGINS` | 브라우저 API 호출을 허용하는 Origin |
| `EVENT_LOG` | Compose가 지정하는 컨테이너 내부 이벤트 파일 |

## Compose 코드 읽기

아래는 실제 구성 중 관련 부분을 발췌한 것입니다.

~~~yaml
api:
  environment:
    RABBIT_HOST: rabbitmq
    RABBIT_VHOST: lab
    EVENT_LOG: /lab/data/events.jsonl
  volumes:
    - ./data:/lab/data
  depends_on:
    rabbitmq:
      condition: service_healthy
~~~

healthcheck 조건은 초기 시작 순서를 조정합니다. 실행 중 장애가 없음을 보장하지는 않습니다. API의 `/health`는 API 프로세스 응답을 확인하고, Broker 연결과 Queue 지표는 `/snapshot` 등 실제 연결 조회로 확인합니다.

호스트 `data/`는 컨테이너 `/lab/data`에 연결되어 JSONL 기록과 Phase 6 SQLite 파일을 보존합니다. RabbitMQ 자체 데이터는 `rabbit-data` named volume에 저장합니다.

## 실행과 실제 연결 실험

~~~powershell
docker compose up --build -d
docker compose ps
Invoke-RestMethod http://localhost:8000/health
~~~

대시보드에서 **실제 연결**을 선택하고 Gateway에 `http://localhost:8000`, 토큰에 자신의 `LAB_TOKEN`을 입력합니다. FastAPI 문서는 `http://localhost:8000/docs`에서 열 수 있으며 보호된 API에는 `X-Lab-Token` 헤더가 필요합니다.

Phase 1 Consumer를 멈추고 이전 메시지가 없는지 확인한 뒤 3개를 발행합니다. Ready 3 / Unacked 0을 예상하고 Consumer를 시작한 뒤 Ready 2 / Unacked 1을 예상합니다. 상태 변화의 원리는 다음 글에서 다룹니다.

시작 오류는 로그로 확인합니다.

~~~powershell
docker compose logs --tail 100 rabbitmq api frontend
~~~

## 결과 해석과 문제 해결

| 증상 | 먼저 확인할 것 |
|---|---|
| 화면은 열리지만 Broker 변화가 없음 | 설명용 예시 모드인지 확인 |
| API 401 | 실제 연결 토큰 확인 |
| 브라우저 CORS 오류 | 화면 Origin과 `ALLOWED_ORIGINS` 비교 |
| API 503 | Broker 상태와 API 로그 확인 |
| Broker 로그인 실패 | 기존 volume 생성 시 계정과 현재 설정 비교 |
| Ready가 예상보다 큼 | 이전 실험 메시지와 다른 Producer 확인 |

발행 오류 뒤 즉시 반복 클릭하면 이미 전송된 메시지가 중복될 수 있습니다. Queue와 로그를 먼저 대조합니다. 게시된 HTTPS 화면의 실제 연결에는 HTTPS Gateway가 별도로 필요하므로 첫 실습은 로컬 화면을 사용합니다.

## 종료와 데이터 보존

Consumer를 멈추고 서비스를 종료합니다.

~~~powershell
docker compose down
~~~

일반 종료는 named volume과 호스트 `data/`를 유지합니다. `down -v`는 RabbitMQ volume을 삭제하므로 일상 종료에 사용하지 않습니다. 기존 volume에서는 `.env` 계정을 바꿔도 Broker 계정이 자동 변경되지 않습니다.

브라우저를 닫거나 예시 모드로 전환하는 것만으로 실제 Consumer가 종료되지는 않습니다. 명시적인 멈춤을 사용하세요.

## 학습 확인 및 참고 자료

`/health`가 성공해도 발행이 실패할 수 있는 이유를 설명해 보세요. API의 Broker 주소가 `localhost`가 아닌 `rabbitmq`인 이유도 확인해 보세요.

- [실습 환경 구축 및 실행 가이드](https://github.com/amirer21/message-flow-lab/blob/main/docs/setup-and-run.md)
- [Docker Compose 구성](https://github.com/amirer21/message-flow-lab/blob/main/docker-compose.yml)

{% include message-flow-lab-series.html compact=true %}
