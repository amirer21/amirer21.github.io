---
title: Angular - 주요 매커니즘 03 - Angular CLI 매커니즘
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Angular
tags:
- Angular
- NodeJS
- 
toc: true
toc_sticky: true
toc_label: 목차
description: Angular - 주요 매커니즘 - Angular CLI 매커니즘
article_tag1: Angular
article_tag2: NodeJS
article_tag3: 
article_section: 
meta_keywords: Angular, NodeJS
last_modified_at: '2025-01-05 21:00:00 +0800'
---

이번에는 Angular CLI 매커니즘을 알아보고자 합니다.
Angular 프로젝트를 빌드할때 터미널에서 명령어를 입력해서 빌드 또는 구동하게 됩니다. 이 CLI의 매커니즘을 알아보고자 합니다.
Angular CLI는 터미널 기반 명령어로 Angular 개발을 간소화하고 표준화된 환경을 제공합니다.

## **Angular CLI 매커니즘**  

**Angular CLI(Command Line Interface)**는 Angular 애플리케이션의 생성, 개발, 빌드, 배포를 간편하게 수행할 수 있도록 돕는 도구입니다. CLI는 Angular 프로젝트의 표준을 유지하면서 효율적으로 작업을 처리할 수 있게 해줍니다.

---

### **1. Angular CLI의 주요 기능**  

#### (1) **프로젝트 생성 및 설정**
- **명령어**: `ng new <project-name>`
  - Angular 애플리케이션의 기본 디렉토리 구조와 설정 파일을 생성.
  - 기본적으로 TypeScript, Webpack, Karma, Jasmine 등의 설정을 포함.

#### (2) **컴포넌트, 서비스, 모듈 등 생성**
- CLI를 통해 컴포넌트, 서비스, 디렉티브, 파이프, 모듈 등을 자동으로 생성.
- **명령어 예시**:
  - 컴포넌트 생성: `ng generate component <component-name>` 또는 `ng g c <component-name>`
  - 서비스 생성: `ng generate service <service-name>` 또는 `ng g s <service-name>`
  - 모듈 생성: `ng generate module <module-name>` 또는 `ng g m <module-name>`

#### (3) **애플리케이션 실행 (Development Server)**
- **명령어**: `ng serve`
  - Angular 애플리케이션을 로컬 개발 서버에서 실행.
  - 기본적으로 `http://localhost:4200`에서 애플리케이션을 미리 볼 수 있음.
  - 실시간 코드 변경 감지가 가능 (Hot Module Replacement).

#### (4) **빌드 및 배포**
- **명령어**: `ng build` 또는 `ng build --prod`
  - 애플리케이션을 배포할 수 있는 최적화된 프로덕션 빌드 생성.
  - 결과물은 `dist/<project-name>` 디렉토리에 생성됨.
  - `--prod` 플래그를 사용하면 코드 축소(Minification), 트리 쉐이킹(Tree Shaking), AOT 컴파일 등 최적화 수행.

#### (5) **테스트**
- 단위 테스트와 엔드투엔드(E2E) 테스트를 실행.
- **명령어**:
  - 단위 테스트: `ng test`
  - E2E 테스트: `ng e2e`

#### (6) **Linting 및 형식 검사**
- **명령어**: `ng lint`
  - 프로젝트의 코드 품질을 검사하고 스타일 규칙을 확인.

#### (7) **환경 설정**
- 개발, 테스트, 프로덕션 등 환경에 따라 설정을 쉽게 변경 가능.
- 환경 파일: `src/environments/environment.ts` 및 `environment.prod.ts`.

#### (8) **플러그인 및 라이브러리 추가**
- **명령어**: `ng add <library>`
  - 예: `ng add @angular/material` (Angular Material 설치 및 설정)

---

### **2. Angular CLI 매커니즘**  

Angular CLI는 내부적으로 다음과 같은 과정을 통해 작업을 처리합니다:

1. **스캐폴딩(Scaffolding)**:
   - 프로젝트 생성 시 Angular의 표준 디렉토리 구조와 설정 파일을 자동으로 생성.
   - 생성된 파일들은 TypeScript, HTML, CSS(SCSS), JSON 등으로 구성.

2. **Webpack 번들링**:
   - Angular CLI는 내부적으로 Webpack을 사용하여 프로젝트를 빌드하고 번들링.
   - 개발 서버 실행(`ng serve`)과 프로덕션 빌드(`ng build`)에서 Webpack 설정이 자동으로 적용.

3. **Angular Schematics**:
   - CLI는 Angular Schematics를 사용하여 파일 생성 및 변경 작업을 수행.
   - 예: `ng generate component`는 템플릿에 따라 컴포넌트 파일과 메타데이터를 생성.

4. **타입스크립트 컴파일**:
   - Angular CLI는 TypeScript를 컴파일하여 JavaScript로 변환(AOT 또는 JIT 컴파일).

5. **빌드 최적화**:
   - 프로덕션 빌드에서는 코드 축소, 트리 쉐이킹, AOT 컴파일 등을 통해 결과물 크기를 줄이고 성능을 최적화.

---

### **3. Angular CLI는 어디에서 명령어를 실행하는가?**  

Angular CLI 명령어는 **터미널(명령 프롬프트)** 또는 **통합 개발 환경(IDE)**의 터미널에서 실행합니다.

#### (1) **OS별 터미널 위치**:
- **Windows**: 명령 프롬프트(CMD), PowerShell, 또는 Windows 터미널.
- **macOS/Linux**: 터미널(Terminal) 앱.
- **IDE 내 터미널**:
  - Visual Studio Code, WebStorm, IntelliJ 등 대부분의 IDE에서 통합 터미널 제공.

#### (2) **실행 조건**:
- Angular CLI가 **전역으로 설치**되어 있어야 합니다.
  - 설치 명령어: `npm install -g @angular/cli`
- 프로젝트 디렉토리에서 CLI 명령어를 실행해야 합니다.
  - 예: `cd <project-directory>` 후 `ng serve`.

---

### **4. Angular CLI 명령어 예시**

```bash
# 1. Angular CLI 설치
npm install -g @angular/cli

# 2. 새 프로젝트 생성
ng new my-angular-app

# 3. 디렉토리 이동
cd my-angular-app

# 4. 개발 서버 실행
ng serve

# 5. 컴포넌트 생성
ng generate component my-component

# 6. 프로덕션 빌드
ng build --prod

# 7. 코드 품질 검사
ng lint

# 8. 테스트 실행
ng test
```

---
