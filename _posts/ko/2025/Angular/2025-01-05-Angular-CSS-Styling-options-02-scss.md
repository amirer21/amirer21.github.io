---
title: Angular - CSS 스타일링 02 - SCSS 포함 프로젝트의 구조
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
description: Angular - CSS 스타일링 02 - SCSS 포함 프로젝트의 구조
article_tag1: Angular
article_tag2: NodeJS
article_tag3: 
article_section: 
meta_keywords: Angular, NodeJS
last_modified_at: '2025-01-05 21:00:00 +0800'
---


## **Angular 프로젝트에서 SCSS 포함 앱의 기본 구조**

Angular CLI를 사용하여 **SCSS**를 포함한 프로젝트를 생성하면 기본 디렉토리 구조는 다음과 같습니다.

---

### **1. 프로젝트 디렉토리 구조**

```plaintext
my-angular-app/
├── e2e/                     # End-to-End 테스트 코드 디렉토리
├── node_modules/            # 프로젝트 종속성
├── src/                     # 소스 코드 디렉토리
│   ├── app/                 # 애플리케이션 코드 디렉토리
│   │   ├── app.component.html  # 루트 컴포넌트 템플릿
│   │   ├── app.component.scss  # 루트 컴포넌트 스타일 (SCSS)
│   │   ├── app.component.spec.ts  # 루트 컴포넌트 테스트 코드
│   │   ├── app.component.ts   # 루트 컴포넌트 로직
│   │   └── app.module.ts      # 루트 모듈 정의
│   ├── assets/               # 정적 자산 (이미지, 폰트 등)
│   ├── environments/         # 환경 설정 파일 (dev/prod)
│   │   ├── environment.ts     # 개발 환경 설정
│   │   └── environment.prod.ts # 프로덕션 환경 설정
│   ├── styles.scss           # 전역 SCSS 스타일 파일
│   ├── index.html            # 애플리케이션의 메인 HTML 파일
│   ├── main.ts               # 애플리케이션 진입점
│   ├── polyfills.ts          # 브라우저 호환성을 위한 폴리필
│   └── test.ts               # 단위 테스트 설정
├── angular.json              # Angular 프로젝트 설정 파일
├── package.json              # 프로젝트 종속성 및 스크립트
├── tsconfig.json             # TypeScript 설정
└── karma.conf.js             # 단위 테스트를 위한 Karma 설정
```

---

### **2. SCSS 관련 주요 파일**
#### (1) **`src/styles.scss`**
- **용도**: 애플리케이션의 **전역 스타일** 정의.
- SCSS 문법을 사용하여 CSS 스타일을 작성.
- 모든 컴포넌트에서 공통으로 사용하는 스타일을 여기에 추가.

#### (2) **`src/app/app.component.scss`**
- **용도**: **루트 컴포넌트의 스타일** 정의.
- 각 컴포넌트는 자체 `.scss` 파일을 가질 수 있으며, 해당 파일은 해당 컴포넌트에만 적용됩니다.

---

### **3. SCSS 파일 관리**
Angular 프로젝트에서 SCSS를 효율적으로 관리하려면 다음 전략을 사용할 수 있습니다:
- **모듈화**: SCSS를 여러 파일로 분리하여 코드 유지보수성을 높임.
- **변수 사용**: 공통 색상, 폰트 크기 등을 변수로 정의 (`_variables.scss`).
- **믹스인(Mixin)**: 반복되는 스타일 패턴을 믹스인으로 정의.
- **전역 SCSS 설정**: `angular.json` 파일에서 전역 SCSS 파일을 설정.

```json
"styles": [
  "src/styles.scss"
]
```

---

## **테스트 코드 실행 시점**

### **1. Angular 테스트 코드의 종류**
#### (1) **단위 테스트(Unit Test)**:
- **파일 위치**: `*.spec.ts` 파일에 작성.
- 컴포넌트, 서비스, 파이프 등의 개별 단위를 테스트.
- **도구**:
  - **Karma**: 테스트 러너.
  - **Jasmine**: 테스트 프레임워크.

#### (2) **엔드투엔드 테스트(E2E Test)**:
- **파일 위치**: `e2e/` 디렉토리에 작성.
- 애플리케이션의 전체 동작을 테스트.
- **도구**:
  - **Protractor**: Angular 전용 E2E 테스트 도구.

---

### **2. 테스트 코드 실행 시점**
테스트 코드는 **명령어 실행 시점**에만 실행됩니다. Angular CLI에서 테스트 명령어를 실행하면 Karma 또는 Protractor가 실행됩니다.

#### **(1) 단위 테스트 실행**
- **명령어**:
  ```bash
  ng test
  ```
  - Karma 테스트 러너가 실행됩니다.
  - 브라우저가 열리고 테스트 결과를 표시합니다.
  - 파일이 변경될 때마다 자동으로 테스트를 다시 실행합니다.

#### **(2) 엔드투엔드 테스트 실행**
- **명령어**:
  ```bash
  ng e2e
  ```
  - Protractor가 실행되어 브라우저에서 E2E 테스트를 수행합니다.
  - 주로 사용자 상호작용 시나리오를 테스트합니다.

---

### **3. 테스트 실행 조건**
- 단위 테스트는 **빌드 후 컴포넌트와 서비스가 올바르게 동작하는지 확인**하는 단계에서 실행.
- 프로덕션 빌드 전에 QA 단계에서 **E2E 테스트**를 실행하여 전체 워크플로우 검증.

---

### **테스트 주기**

1. **개발 단계**:
   - 새로운 컴포넌트나 기능을 추가한 후 `ng test`로 단위 테스트 수행.
2. **병합 요청(Pull Request)**:
   - 코드 병합 전에 모든 단위 테스트와 E2E 테스트를 실행하여 안정성 확인.
3. **배포 전**:
   - 프로덕션 빌드 전에 E2E 테스트를 실행하여 전체 동작 확인.

---
