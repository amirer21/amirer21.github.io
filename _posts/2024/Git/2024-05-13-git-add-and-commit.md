---
title: Git - add 와 commit 은 무엇인가?
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Git
tags:
- Git
- Commit
toc: true
toc_sticky: true
toc_label: 목차
description: Git add 와 commit 은 무엇인가?
article_tag1: git
article_tag2: commit
article_tag3: add
article_section: git
meta_keywords: git, add, commit
last_modified_at: '2024-05-13 21:00:00 +0800'
---

# Git add, commit 이란?

## Git 이란?

Git은 코드의 버전을 관리하는 데 사용되는 분산 버전 관리 시스템입니다. 이 시스템을 사용하여 개발자들은 코드 변경 사항을 추적하고, 이전 버전으로 롤백하며, 여러 개발자들과 협업할 수 있습니다.
Git의 핵심 구조와 add, commit 명령어의 사용법을 설명하겠습니다.

## Git의 주요 구성 요소

### 1) 작업 디렉토리(Working Directory):

실제 파일들이 저장되는 곳으로, 개발자가 현재 작업하고 있는 환경입니다.

### 2) 스테이징 영역(Staging Area):

다음 커밋에 포함될 변경사항을 임시로 모아두는 곳입니다. git add를 사용해 여기에 파일을 추가할 수 있습니다.

### 3) 리포지토리(Repository):

커밋된 모든 데이터와 메타데이터를 포함하는 Git의 데이터베이스입니다. 이곳에는 프로젝트의 변경 이력이 저장됩니다.

## git add 명령어

> git add .

git add는 작업 디렉토리에서 변경된 파일을 스테이징 영역으로 옮기는 과정입니다. 이 명령어를 통해 달성되는 주요 작업은 다음과 같습니다:

### 변경 사항 스테이징:

(변경 준비) 변경된 파일이나 디렉토리를 스테이징 영역에 추가함으로써, 이 변경사항들이 다음 커밋에 포함될 준비가 됩니다.

## git commit 명령어

> git commit -m "git init"

git commit은 스테이징 영역에 추가된 변경 사항들을 리포지토리의 기록으로 확정하는 명령어입니다. git commit의 실행 결과는 다음과 같습니다:

### 변경 사항 확정:

(확정) 스테이징 영역에 있는 변경 사항들이 하나의 커밋으로 리포지토리에 저장됩니다. 이 커밋은 고유한 ID(해시 값)를 가지며, 커밋 메시지를 통해 변경 내용을 설명할 수 있습니다.

### 프로젝트 이력 갱신:

각 커밋은 이전 커밋을 참조함으로써 프로젝트의 전체 이력을 구성합니다. 이를 통해 언제든지 과거의 상태로 돌아갈 수 있고, 변경 이력을 추적할 수 있습니다.