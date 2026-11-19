---
title: "Gemini 4 Neon 출시: API 가격과 Antigravity·Copilot 사용 조건"
description: "2026년 11월 18일 발표된 Gemini 4 Neon의 API 가격, Antigravity의 512K 컨텍스트와 Orchestrator, GitHub Copilot 제공 조건을 공식 자료로 정리합니다."
date: '2026-11-20 08:33:00 +0900'
last_modified_at: '2026-11-20 08:33:00 +0900'
lang: ko
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
  - AI
tags:
  - Gemini
  - Gemini 4 Neon
  - Antigravity
  - GitHub Copilot
  - AI코딩
toc: true
toc_sticky: true
toc_label: 목차
article_section: AI
---

**Gemini 4 Neon은 복잡한 코딩과 분석 작업에서 추론 깊이와 처리 효율을 함께 겨냥한 모델입니다.** 다만 같은 Neon이라도 API로 사용하는지, Antigravity나 GitHub Copilot에서 사용하는지에 따라 이용 조건과 확인할 한도가 다릅니다.

Google은 [영문 공식 발표][launch]에 2026년 11월 18일이라는 날짜를 표시했습니다. 이 글은 **2026년 11월 20일 한국 시간에 확인한 공식 문서**를 바탕으로, 가격과 사용 경로를 구분해 정리합니다. 직접 측정한 성능 후기는 아닙니다.

## Gemini 4 Neon은 어떤 위치의 모델인가요?

Google은 Carbon을 가장 어려운 장기 작업, Hydrogen을 빠른 일상 작업에 배치하고 Neon은 그 사이에서 깊이와 효율을 균형 있게 제공하는 모델로 설명합니다. [공식 발표][launch]

실무에서는 “가장 높은 점수의 모델인가”보다 **현재 작업을 끝내는 데 어떤 도움이 되는가**가 중요합니다.

예를 들어 여러 파일을 수정해야 하는 오류 해결에서는 코드를 생성하는 능력 외에도 수정 범위를 지키는지, 테스트 실패 후 원인을 좁히는지, 결과를 과장하지 않는지를 살펴야 합니다. 이런 조건을 고정한 뒤 기존 모델과 비교하는 편이 평가하기 쉽습니다.

## API와 Antigravity의 한도는 다릅니다

| 확인 항목 | Gemini API | Antigravity의 Neon |
|---|---|---|
| 컨텍스트 안내 | 입력·출력 통합 1,048,576 토큰 | 최대 512K 토큰 |
| 입력 방식 | 텍스트·이미지·동영상·음성·PDF | 개발 도구가 제공하는 작업 환경 기준 |
| 출력 | 텍스트 | 코드 수정·도구 실행 등의 작업 흐름 |
| 설정 기준 | API 모델·요금 문서 | Antigravity 모델·플랜 문서 |

출처: [Neon API 모델 문서][model], [Antigravity 모델 선택 문서][agy].

여기서 Antigravity의 “작업 흐름”은 모델 자체의 출력 형식과 다른 개념입니다. 모델이 계획하거나 도구 호출을 요청하면 개발 도구가 편집·실행을 이어가는 구조로 이해하시면 됩니다.

**API의 약 100만 토큰 안내를 Antigravity에도 그대로 적용하면 안 됩니다.** 같은 모델 이름이어도 제품의 제한을 따로 확인해야 합니다. 컨텍스트 창 역시 입력만을 무조건 최대치까지 채워도 된다는 뜻은 아닙니다.

## Gemini 4 Neon API 가격은 얼마인가요?

2026년 11월 20일 확인한 [공식 가격표][pricing]의 **Standard 처리 방식**, 100만 토큰당 미국 달러 기준입니다.

| 과금 항목 | 가격 |
|---|---:|
| 일반 입력 | US$3.00 |
| 캐시된 입력 | US$0.15 |
| 출력·추론 토큰 | US$15.00 |

API 무료 티어는 제공되지 않습니다. 캐시는 암묵적 캐싱만 지원하며, 명시적 캐싱은 지원하지 않는다고 안내합니다. 위 표는 Google AI 구독료나 Copilot 구독료가 아닌 **Gemini API 단가**입니다.

### 입력 10만·출력 1만 토큰이면 얼마인가요?

캐시와 검색 등 별도 도구 비용을 제외하고, **과금 대상 출력**이 1만 토큰이라고 가정하겠습니다.

- 입력: 100,000 ÷ 1,000,000 × US$3 = **US$0.30**
- 출력: 10,000 ÷ 1,000,000 × US$15 = **US$0.15**
- 합계: **US$0.45**

추론 토큰도 출력 과금에 포함되므로 눈에 보이는 최종 답변 분량만 세면 예상 비용과 차이가 생길 수 있습니다.

같은 입력 전체가 캐시 적중 조건을 충족한다면 입력 비용은 US$0.015로 계산됩니다. 하지만 실제 캐시 적중을 확인하지 않은 채 모든 요청에 이 요율을 적용해서는 안 됩니다.

Batch·Flex·Priority의 요율과 검색 도구 비용도 별도로 확인해야 합니다. 업무 예산은 호출 한 번의 계산보다 **실패와 재시도를 포함한 작업 한 건의 비용**으로 기록하는 편이 좋습니다.

## Antigravity에서 Neon을 쓰려면

[Antigravity 공식 문서][agy]는 Neon을 Google AI Ultra, 유료 Pro 또는 적격 프리미엄 기기 체험판, Gemini Enterprise에 제공한다고 안내합니다. Free·Google AI Plus에는 포함되지 않습니다.

직접 Neon을 선택하면 추론 강도를 Low·Medium·High·Extra로 조절할 수 있으며 기본값은 High입니다. 반면 Orchestrator는 고정된 구성을 사용합니다.

### Orchestrator (Neon)은 무엇이 다른가요?

Orchestrator (Neon)은 **Neon이 계획·검토하고 Hydrogen이 구현을 수행하도록 묶은 선택지**입니다. 모델 하나를 선택해 모든 단계를 처리하는 방식과 구분해야 합니다.

| 선택 | 공식 문서상 역할 |
|---|---|
| Gemini 4 Neon | 단일 모델로 작업하며 추론 강도 선택 가능 |
| Orchestrator (Neon) | Neon의 계획·검토와 Hydrogen의 구현을 결합 |

Orchestrator (Neon)은 유료 Pro 또는 적격 기기 체험판과 Ultra 대상이며 Enterprise에는 포함되지 않는 것으로 안내됩니다. 최신 조건은 [모델 선택 표][agy]에서 확인하세요.

이 구조를 평가할 때는 계획이 그럴듯한지만 보지 말고, 구현이 계획과 일치하는지 확인하는 것이 좋습니다. 인계가 있다고 해서 코드의 정확성이나 테스트 통과가 자동 보장되는 것은 아닙니다.

## GitHub Copilot에서도 사용할 수 있나요?

GitHub은 [11월 18일 변경 기록][copilot]에서 Gemini 4 Neon의 정식 제공을 발표했습니다.

| 항목 | GitHub 안내 |
|---|---|
| 대상 플랜 | Copilot Pro+, Max, Business, Enterprise |
| 선택 위치 예시 | VS Code, Visual Studio, Copilot CLI, JetBrains 등 |
| 제공 방식 | 순차 배포 |
| 조직 계정 | 관리자의 모델 정책에 따라 접근 가능 |
| 과금 안내 | 사용량 기반 과금에서 공급자 정가 적용 |

Gemini 구독과 Copilot 구독은 별개이므로, Google AI Pro를 사용한다고 Copilot에서도 같은 권한이 생기는 것은 아닙니다. 비용 역시 각 제품의 청구 기준으로 확인해야 합니다.

Copilot에서 모델이 보이지 않는다면 지원 플랜, 조직 정책, 순차 배포 여부를 먼저 확인하세요. 이번 글에서는 국내 계정의 모델 선택이나 실제 청구를 직접 검증하지 않았습니다.

## 성능 점수보다 먼저 비교할 세 가지

Google은 Neon의 코딩·분석 성능과 작업당 비용 개선을 발표했습니다. 다만 공급자의 평가 조건이 내 프로젝트와 같지는 않습니다. 이 글에서는 그 수치를 근거로 GPT나 Claude보다 모든 작업에서 우수하다고 결론내리지 않습니다.

도입을 검토한다면 다음처럼 **완료 기준이 분명한 작은 과제**로 비교해 보세요.

| 평가 과제 | 좋은 결과의 기준 |
|---|---|
| 여러 파일에 걸친 버그 수정 | 재현 문제 해결, 기존 동작 유지, 관련 테스트 통과 |
| 테스트 로그 분석 | 관찰 사실과 원인 가설 구분, 근거 위치 제시 |
| 문서 기반 기능 변경 | 요구사항 누락 없음, 무관한 파일 변경 최소화 |

아래는 직접 사용 후기가 아닌 **평가용 요청 예시**입니다.

> 이 오류를 재현하는 최소 조건을 먼저 확인해주세요. 관련 파일만 수정하고, 기존 공개 함수의 인터페이스를 유지해주세요. 수정 후 관련 테스트를 실행하고, 실행하지 못한 검사는 별도로 알려주세요. 완료 보고에는 수정 이유, 실제 실행한 검증, 남은 제약을 적어주세요.

같은 입력으로 기존 모델과 Neon을 비교하고, 결과의 정확성·도구 사용량·재시도·사람의 수정 시간을 함께 기록하세요. 빠른 첫 응답과 빠른 작업 완료도 구분해야 합니다.

## 어떤 경로부터 선택하면 좋을까요?

이미 사용하는 도구가 있다면 그 환경에서 작은 과제부터 평가하는 방식을 제안합니다.

- **프로그램에 직접 연결:** API 단가와 요청별 사용량을 측정할 수 있는 Gemini API
- **계획과 구현을 묶어 평가:** 접근 가능한 플랜에서 Antigravity의 Neon·Orchestrator
- **기존 IDE 흐름 유지:** 지원되는 Copilot 플랜과 조직 정책 확인 후 모델 선택

새 구독부터 결제하기보다는 기존 권한으로 사용할 수 있는지 확인하고, 실제로 자주 겪는 문제 하나를 해결해 보시는 편이 판단에 도움이 됩니다.

선택의 기준은 모델 이름이나 발표 순위보다 **작업 완료 품질과 전체 비용**입니다. 특히 API 한도와 개발 도구의 한도, 구독 권한과 종량제 요금을 나누어 확인하면 도입 과정의 혼동을 줄일 수 있습니다.

### 함께 읽기

- [제미나이 작업 모드 한국 무료 제공: 예약 방법과 유료 기능 차이]({% post_url /ko/2026/AI/2026-11-19-gemini-tasks-korea-free-scheduling-guide %})
- [GPT-6.2 Astra·Sol 출시: 차이와 API 가격]({% post_url /ko/2026/AI/2026-11-18-gpt-6-2-astra-sol-api-pricing-comparison %})
- [Function Calling으로 AI에게 도구 사용시키기]({% post_url /ko/2026/AI/2026-06-28-ai-class-03-function-calling-tool-use %})

### 공식 출처

- [Google의 Gemini 4 Neon 발표 — 2026년 11월 18일][launch]
- [Gemini 4 Neon API 모델 문서][model]
- [Gemini Developer API 가격표][pricing]
- [Antigravity 모델·Orchestrator 선택 문서][agy]
- [GitHub Copilot의 Neon 제공 안내 — 2026년 11월 18일][copilot]

이 글은 AI의 도움으로 작성했으며, 공식 자료를 바탕으로 정리했습니다. 모델 성능이나 국내 계정 이용 가능 여부를 직접 시험한 후기는 아닙니다.

[launch]: https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-4-neon/
[model]: https://aistudio.google.com/docs/models/gemini-4-neon
[pricing]: https://aistudio.google.com/docs/pricing#gemini-4-neon
[agy]: https://antigravity.google/docs/models
[copilot]: https://github.blog/changelog/2026-11-18-gemini-4-neon-in-github-copilot/
