---
title: Angular - CSS 스타일링 01 - SCSS, LESS, SASS의 차이와 활용
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
description: Angular - CSS 스타일링 01 - SCSS, LESS, SASS의 차이와 활용
article_tag1: Angular
article_tag2: NodeJS
article_tag3: 
article_section: 
meta_keywords: Angular, NodeJS
last_modified_at: '2025-01-05 21:00:00 +0800'
---


Angular 프로젝트 생성 시 선택할 수 있는 **CSS 전처리기 및 스타일링 옵션(SCSS, CSS, LESS, SASS)**가 있습니다. 각각의 차이를 아래에 설명하고자 합니다. 이 옵션은 프로젝트의 스타일링 방식을 결정합니다.

---

## **1. CSS (Cascading Style Sheets)**

### **특징**
- 기본 스타일링 언어로 브라우저에서 직접 해석.
- 가장 단순하고 범용적으로 사용.
- Angular에서 기본 제공되는 선택지.

### **장점**
- 별도의 컴파일 과정이 필요하지 않아 간단.
- 브라우저에서 바로 해석되므로 추가 툴 없이 사용 가능.
- 학습 곡선이 낮고 모든 웹 개발자가 익숙.

### **단점**
- 변수나 중첩 규칙이 없기 때문에 반복 작업이 많아질 수 있음.
- 코드의 재사용성과 유지보수성이 떨어짐.

### **언제 사용하나?**
- 간단한 프로젝트 또는 스타일링이 복잡하지 않은 경우.
- 팀이 CSS만을 사용하도록 규정된 경우.

---

## **2. SCSS (Sassy CSS)**

### **특징**
- **SASS**의 최신 문법을 사용하는 스타일링 언어.
- CSS와 완전히 호환되며, CSS 파일처럼 작성 가능.
- Angular CLI에서 가장 널리 선택되는 옵션.

### **장점**
- CSS와 유사한 문법으로 학습 곡선이 낮음.
- **변수, 중첩(Nesting), 믹스인(Mixin), 상속** 등의 강력한 기능 제공.
- 코드 재사용과 모듈화가 쉬움.
- SASS와 달리 **세미콜론(;)**과 **중괄호({})**를 사용하여 CSS와 호환 가능.

### **단점**
- 컴파일이 필요 (Angular CLI에서 자동 처리 가능).
- 러닝 커브가 CSS보다는 조금 높음.

### **언제 사용하나?**
- 대규모 프로젝트 또는 팀 개발 환경에서 사용.
- CSS 재사용과 유지보수성이 중요한 경우.
- 최신 문법과 기능이 필요한 경우.

---

## **3. LESS (Leaner CSS)**

### **특징**
- JavaScript로 작성된 CSS 전처리기.
- CSS에 변수와 함수, 믹스인 등을 추가로 지원.

### **장점**
- CSS와 유사한 문법.
- **계산, 변수, 믹스인, 중첩** 등의 기능으로 스타일링 효율 증가.
- 컴파일 속도가 빠름.

### **단점**
- SCSS만큼의 유연성과 기능은 부족.
- SASS/SCSS에 비해 덜 사용됨.
- Angular 생태계에서 LESS 관련 예제나 문서가 적음.

### **언제 사용하나?**
- LESS를 사용하는 기존 코드베이스가 있는 경우.
- LESS에 익숙한 개발자가 많은 경우.

---

## **4. SASS (Syntactically Awesome Stylesheets)**

### **특징**
- CSS 전처리기의 초기 버전으로, Python 기반.
- SCSS보다 간결한 문법을 사용 (중괄호와 세미콜론을 사용하지 않음).

### **장점**
- 중첩(Nesting), 변수, 믹스인(Mixin) 등 강력한 기능 제공.
- CSS보다 간결하고, 유지보수가 쉬움.

### **단점**
- SCSS에 비해 러닝 커브가 높음.
- Angular 프로젝트에서 기본적으로 사용되지 않으며 SCSS보다 덜 사용됨.

### **언제 사용하나?**
- 간결한 문법을 선호하는 경우.
- 기존 프로젝트가 SASS로 작성된 경우.

---

## **5. Stylus**

### **특징**
- Node.js 기반의 CSS 전처리기.
- 자유로운 문법(세미콜론과 중괄호 생략 가능) 제공.

### **장점**
- 유연한 문법과 다양한 스타일링 기능 제공.
- 믹스인, 함수, 변수 등 풍부한 기능.

### **단점**
- SCSS/LESS만큼의 대중성과 문서 지원 부족.
- Angular에서 기본적으로 지원하지 않음.

### **언제 사용하나?**
- Stylus를 사용하던 프로젝트를 Angular로 전환하는 경우.
- 스타일링에 최대한 유연성을 필요로 하는 경우.

---

## **비교 표**

| **옵션** | **기본 문법** | **컴파일 필요** | **주요 기능**                           | **대중성** |
|----------|---------------|-----------------|------------------------------------------|------------|
| **CSS**  | CSS           | 불필요          | 없음                                    | 매우 높음   |
| **SCSS** | CSS-like      | 필요            | 변수, 중첩, 믹스인, 상속, 모듈화        | 매우 높음   |
| **LESS** | CSS-like      | 필요            | 변수, 중첩, 믹스인, 계산                | 중간        |
| **SASS** | 간결한 문법    | 필요            | SCSS와 동일한 기능                      | 낮음        |
| **Stylus**| 자유로운 문법 | 필요            | 함수, 변수, 자유로운 문법               | 낮음        |

---

## **Angular에서 어떤 옵션을 선택해야 하나?**

### **SCSS 추천**
- **Angular CLI에서 기본적으로 SCSS를 가장 많이 사용**하며, CSS와 완벽히 호환되므로 CSS에서 SCSS로 쉽게 전환 가능.
- 대규모 프로젝트나 협업 환경에서 코드 재사용성과 유지보수성에 유리.

### **CSS 추천**
- 간단한 프로젝트이거나, 전통적인 CSS만 사용하는 팀이라면 CSS 선택.

### **LESS 또는 SASS**
- 팀이 특정 전처리기를 선호하거나, 기존 프로젝트가 해당 스타일링 언어로 작성된 경우.

---

### **CLI에서 스타일링 옵션 선택**

Angular 프로젝트 생성 시 스타일 옵션을 선택하려면 아래 명령어를 사용합니다:
```bash
ng new <project-name> --style=scss   # SCSS 선택
ng new <project-name> --style=css    # CSS 선택
ng new <project-name> --style=less   # LESS 선택
ng new <project-name> --style=sass   # SASS 선택
```

---
