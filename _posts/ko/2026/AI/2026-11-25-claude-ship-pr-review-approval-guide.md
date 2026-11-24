---
title: "Claude Ship 공개: PR 검토·수정·승인 자동화와 /ship 사용 조건"
description: "11월 23일 공개된 Claude Ship의 Code Review·PR Steward·Claude Approvals 역할, /ship과 조직 자동화의 차이, GitHub 병합 규칙·Windows 제약·비용을 정리합니다."
date: '2026-11-25 08:15:00 +0900'
last_modified_at: '2026-11-25 08:15:00 +0900'
lang: ko
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
  - AI
tags:
  - Claude
  - Claude Code
  - Claude Ship
  - GitHub
  - 코드리뷰
  - PR자동화
toc: true
toc_sticky: true
toc_label: 목차
article_section: AI
---

**Claude Ship은 GitHub PR의 검토, 수정, 승인 판단을 나누어 자동화하는 기능입니다.** 다만 `/ship` 한 번으로 모든 저장소의 변경이 자동 병합되는 것은 아닙니다. 로컬 명령과 조직용 에이전트의 실행 방식이 다르고, 실제 병합은 저장소 규칙과 권한의 영향을 받습니다.

Anthropic은 [2026년 11월 23일 Claude Ship을 발표][release]했습니다. 이 글은 **11월 25일 한국 시간에 확인한 공식 문서**를 기준으로 도입 판단에 필요한 조건을 정리합니다. 직접 설치하거나 PR 자동화를 실행한 체험기는 아닙니다.

## 핵심 요약: 세 역할을 구분하세요

[Claude Ship 개요][overview]는 다음 세 에이전트를 설명합니다.

| 구성 요소 | 주된 역할 | 구분할 점 |
|---|---|---|
| Code Review | 코드 주변 맥락과 변경 사항을 검토 | 문제를 찾는 단계 |
| PR Steward | 실패한 검사·리뷰 의견·충돌에 대응해 수정 | 승인·병합을 담당하도록 설계된 에이전트는 아님 |
| Claude Approvals | 저장소 정책에 따라 필요한 승인을 판단 | GitHub의 필수 검사·병합 규칙과 함께 설정 |

Code Review는 정식 제공 상태이며, PR Steward와 Claude Approvals는 공개 베타입니다. 새 모델 출시 소식이 아니라 **PR 이후 작업 흐름을 다루는 제품 발표**입니다.

예를 들어 테스트 실패를 고치는 것, 수정 코드가 적절한지 검토하는 것, 최종 병합을 허용하는 것은 각각 다른 판단입니다. 역할을 나누면 자동화가 어디에서 멈췄는지도 파악하기 쉽습니다.

## /ship과 조직용 Claude Ship은 어떻게 다른가요?

같은 이름이 등장하지만 실행 위치와 청구 대상을 구분하셔야 합니다.

| 구분 | 로컬 /ship·/steward | 조직용 에이전트 |
|---|---|---|
| 시작 | 개발자가 Claude Code 세션에서 실행 | 관리자가 저장소별로 설정 |
| 작업 위치 | 자신의 로컬 체크아웃·세션 | 조직이 연결한 GitHub PR을 대상으로 동작 |
| 비용 구분 | 자신의 세션 사용량 | 조직의 토큰 사용량 과금 |
| 적합한 시작점 | 자신의 작은 변경 한 건 | 팀의 반복적인 PR 운영 |

[명령 문서][command]에 따르면 `/ship`은 PR 생성과 리뷰를 거쳐 피드백·실패한 검사를 처리하는 감시 작업을 시작합니다. 이미 열린 자신의 PR에서 리뷰를 건너뛰고 감시를 시작하려면 `/steward`를 사용합니다.

여기서 로컬 감시와 조직용 **PR Steward**는 별도 기능입니다. [PR Steward 문서][steward]는 조직용 에이전트가 클라우드 세션에서 수정하고 GitHub App으로 동작한다고 설명합니다.

개인 세션에서 명령을 쓸 수 있다는 안내를 조직 전체의 자동 검토 서비스까지 구독에 포함된다는 뜻으로 해석해서는 안 됩니다.

## 로컬에서 시작하기 전에 확인할 조건

[공식 명령 문서][command]의 확인 시점 요구 사항은 다음과 같습니다.

- Claude Code **v2.1.330 이상**
- GitHub CLI **2.63 이상**, GitHub 로그인
- Git **2.38 이상**
- 자신의 저장소 로컬 복제본과 작업 브랜치

문서는 v2.1.331 이전 버전과 이후의 동작 차이도 여러 곳에서 설명합니다. 최소 버전만 맞추기보다 최신 지원 버전의 안내를 확인하는 편이 좋습니다.

특히 **네이티브 Windows에서는 감시 작업이 시작되지 않는다**고 명시합니다. Windows에서 실행 파일이 열리는 것과 PR 감시까지 지원되는 것은 다릅니다. WSL 등 다른 환경을 검토한다면 해당 환경에서 도구 버전과 로그인 상태를 별도로 확인하십시오. 이 글에서는 WSL 호환성을 시험하지 않았습니다.

실행 전에는 다음 사항을 확인하시는 것이 좋습니다.

1. PR에 넣을 변경과 다른 작업을 분리합니다.
2. `git status`로 새 파일과 수정 파일을 확인합니다.
3. 비밀키·개인 메모가 포함되지 않았는지 살펴봅니다.
4. Claude Code 안에서 명령을 실행하기 전에 커밋·푸시 범위를 확인합니다.

`/ship`은 단순 조회 명령이 아닙니다. 공식 문서는 상황에 따라 커밋·푸시·PR 생성을 수행한다고 설명합니다. 공개 저장소에서는 미커밋 변경을 자동 커밋하지 않는 등 예외가 있으므로, [명령별 동작 조건][command]을 확인하셔야 합니다.

## 팀에서 켜려면 무엇이 필요한가요?

[설정 안내][setup]는 Claude 조직의 Owner 권한, GitHub App 설치·연결, 대상 저장소 쓰기 권한을 구분합니다. 관리자 설정은 **Organization settings → Claude Ship**에서 진행합니다.

처음부터 모든 저장소를 대상으로 삼기보다 작은 저장소 하나로 시작할 수 있습니다. 설정 문서는 리뷰 수준을 Quick·Standard·Deep으로 나누고, 실행 시점도 PR 생성 시·매 푸시·수동 요청으로 선택하도록 안내합니다.

운영 측면에서는 다음 순서를 제안합니다.

1. Code Review의 지적과 실제 오류를 대조합니다.
2. PR Steward가 수정한 diff와 테스트 결과를 확인합니다.
3. 승인 정책을 관찰 모드에서 실행해 팀의 판단과 비교합니다.
4. 결과가 안정된 범위부터 필수 검사와 연결합니다.

이는 모든 팀에 적용되는 제품 설정값이 아니라 도입을 위한 제안입니다. 결제·권한·데이터 변경처럼 영향이 큰 부분은 어떤 자동 판단을 허용할지 먼저 합의하는 편이 좋습니다.

## 자동 승인과 자동 병합은 같은가요?

[Claude Approvals 문서][approvals]는 정책 파일 `.claude/approvals.yml`에 따라 경로별로 필요한 승인 등을 판단한다고 설명합니다. 이 검사가 병합을 막으려면 GitHub에서 필수 검사로 설정해야 하며, 관찰 모드는 일반적으로 정책을 강제하지 않습니다.

중요한 점은 **관찰 모드도 단순한 무료 미리보기가 아니라는 것**입니다. 정책이 시작하는 리뷰·분류 작업에는 비용이 발생할 수 있습니다.

또한 승인 정책의 조건이 CI 결과를 직접 읽을 수 없다고 문서는 명시합니다. 따라서 테스트·빌드 검사는 GitHub의 별도 필수 검사로 유지해야 합니다.

예를 들어 문서만 수정한 PR은 자동 승인을 허용하더라도, 링크 검사나 사이트 빌드가 실패했다면 병합을 막는 구성이 필요합니다. “AI가 승인했다”는 한 가지 신호로 검증 전체를 대체하지 않는 편이 좋습니다.

기존 auto-merge나 merge queue 설정도 함께 확인하십시오. 정책이 사람의 승인을 요구하지 않고 GitHub의 조건이 충족되면 사람의 추가 동작 없이 병합될 수 있습니다.

## 이용 가능 범위와 비용

[공식 개요][overview]에서 조직용 Claude Ship은 **Team·Enterprise 조직**을 대상으로 안내합니다. Zero Data Retention, HIPAA 구성, 고객 관리 암호화 키를 사용하는 조직에는 제공되지 않는다고 명시되어 있습니다. 한국 조직의 실제 계약·접속 조건은 직접 검증하지 않았습니다.

[Code Review 비용 문서][costs]에 따르면 리뷰 한 건의 고정 요금은 없습니다. 변경 규모·주변 코드 복잡도·리뷰 수준·실행 횟수 등이 비용에 영향을 줍니다. 조직용 Code Review는 플랜 포함 사용량과 별도로 조직의 사용 크레딧에 토큰 기준으로 청구됩니다.

비용을 비교할 때는 PR 수뿐 아니라 **한 PR에서 리뷰가 몇 번 실행됐는지** 기록하셔야 합니다. 매 푸시 검토는 수정 커밋을 자주 올리는 팀에서 실행 횟수를 늘릴 수 있습니다.

[PR Steward][steward]는 자체 지출 한도를 설정하기 전까지 한도가 없다고 안내합니다. 도입 시에는 리뷰와 수정 에이전트의 한도를 각각 확인하십시오. 이 글에서는 고정 토큰 단가나 월 예상 비용을 확인하지 않아 임의의 금액을 제시하지 않습니다.

## 어떤 팀에 먼저 유용할까요?

테스트 실패나 작은 리뷰 수정 때문에 PR이 오래 대기하는 팀이라면 검토할 가치가 있습니다. 반면 테스트가 거의 없거나 승인 기준이 정리되지 않은 저장소라면 자동화 결과를 판별하기가 어렵습니다.

작은 실험에서는 “병합이 빨라졌는가”와 함께 다음 내용을 기록해 보십시오.

- 리뷰가 찾은 실제 오류와 잘못된 지적
- 에이전트 수정 후 사람이 다시 바꾼 부분
- 리뷰·수정 반복 횟수와 사용량
- 병합 후 되돌린 변경의 원인

출시 발표의 생산성 사례를 자신의 팀에 그대로 적용하기보다, 같은 유형의 PR에서 직접 얻은 기록으로 판단하시는 것이 좋습니다. 이 글 작성 과정에서는 저장소에 Claude Ship을 설치하거나 승인 정책·보호 규칙을 변경하지 않았습니다.

## 함께 읽으면 좋은 글

- [Mistral Vibe Desktop의 로컬·클라우드 코딩 환경]({% post_url /ko/2026/AI/2026-11-21-mistral-vibe-desktop-windows-local-cloud-guide %})
- [AI 자동화 워크플로의 기본 구성]({% post_url /ko/2026/AI/2026-06-28-ai-class-10-ai-automation-workflow %})

## 공식 출처

**확인 기준일: 2026년 11월 25일, Asia/Seoul. Claude Ship 발표일: 11월 23일.**

- [Claude Ship 발표][release]
- [Claude Ship 개요·제공 조건][overview]
- [/ship·/steward 명령과 제약][command]
- [Code Review 설정][setup]
- [PR Steward][steward]
- [Claude Approvals][approvals]
- [Code Review 비용·사용량][costs]

이 글은 AI의 도움으로 작성했으며 공식 자료를 바탕으로 정리했습니다.

[release]: https://claude.com/resources/articles/introducing-claude-ship
[overview]: https://code.claude.com/docs/en/claude-ship
[command]: https://code.claude.com/docs/en/ship-command
[setup]: https://code.claude.com/docs/en/code-review-setup
[steward]: https://code.claude.com/docs/en/pr-steward
[approvals]: https://code.claude.com/docs/en/approvals
[costs]: https://code.claude.com/docs/en/code-review-costs
