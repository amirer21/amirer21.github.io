---
title: Angular - 주요 매커니즘
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
description: Angular - 주요 매커니즘
article_tag1: Angular
article_tag2: NodeJS
article_tag3: 
article_section: 
meta_keywords: Angular, NodeJS
last_modified_at: '2025-01-05 21:00:00 +0800'
---

Angular 프로젝트에 대해 분석하고 정리하고자 합니다.
이를 위해서 Angular 주요 매커니즘을 분석하도록 할 것 입니다.

Angular는 웹 애플리케이션 개발을 위한 프레임워크로 주요 매커니즘을 정리해보았습니다. 각 매커니즘은 Angular 애플리케이션 구조와 작동 방식을 이해하는 데 핵심적입니다.



---

## 1. **모듈(Module)**  
Angular 애플리케이션은 최소 하나의 **루트 모듈**(일반적으로 `AppModule`)로 구성되며 애플리케이션의 주요 빌딩 블록입니다.

- **NgModule**: Angular의 모듈 시스템으로 구성 요소와 서비스를 묶는 데 사용.
- 주요 메타데이터:
  - **`declarations`**: 컴포넌트, 디렉티브, 파이프 선언.
  - **`imports`**: 외부 Angular 모듈 가져오기.
  - **`providers`**: 서비스 주입(Dependency Injection).
  - **`bootstrap`**: 애플리케이션의 시작 컴포넌트 정의.

---

## 2. **컴포넌트(Component)**  
애플리케이션의 UI를 정의하는 기본 단위입니다.

- **구조**:
  - HTML 템플릿(`template`)과 CSS 스타일(`styles`)을 가짐.
  - TypeScript 클래스(`@Component` 데코레이터로 정의)가 비즈니스 로직과 데이터 바인딩을 처리.
  
- **주요 기능**:

- **데이터 바인딩**: 템플릿과 클래스 간 데이터를 연동.
{% raw %}
```
  - 양방향 바인딩 : `[(ngModel)]`
  - 단방향 바인딩 : `{{}}`, `[property]`
```
{% endraw %}

- **이벤트 바인딩**: `(event)="handler()"`

---

## 3. **디렉티브(Directive)**  
템플릿의 구조 또는 동작을 확장하는 데 사용됩니다.

- **종류**:
  - **구조 디렉티브**: DOM 구조 변경.
    - 예: `*ngIf`, `*ngFor`, `*ngSwitch`
  - **속성 디렉티브**: DOM 요소의 동작 변경.
    - 예: `[class]`, `[style]`, `ngClass`, `ngStyle`
  - **사용자 정의 디렉티브**: 커스텀 동작 추가.

---

## 4. **서비스(Service)와 의존성 주입(DI)**  
비즈니스 로직을 캡슐화하고, 컴포넌트 간에 공유되는 데이터를 관리.

- **서비스**:
  - 주로 `@Injectable()` 데코레이터로 정의.
  - HTTP 요청, 데이터 처리, 상태 관리 등에 사용.

- **의존성 주입(DI)**:
  - 서비스나 기타 종속성을 컴포넌트나 클래스에 제공하는 시스템.
  - `providers`를 통해 주입.

---

## 5. **라우팅 및 네비게이션(Routing)**  
애플리케이션의 URL 경로와 컴포넌트 간의 매핑을 관리.

- **라우터 설정**:
  - `RouterModule.forRoot(routes)`로 라우트 설정.
  - `routes` 배열은 각 경로와 컴포넌트를 매핑.

- **라우팅 기능**:
  - **`routerLink`**: 템플릿에서 링크 정의.
  - **라우트 가드**: 경로 접근 제어.
    - 예: `CanActivate`, `CanDeactivate`

---

## 6. **HTTP 통신**  
HTTP 요청/응답 처리.

- Angular의 `HttpClientModule` 사용.
- 주요 메서드:
  - `get()`, `post()`, `put()`, `delete()`
- RxJS와 연동하여 비동기 데이터 처리.

---

## 7. **RxJS와 반응형 프로그래밍**  
Angular는 반응형 프로그래밍을 지원하기 위해 **RxJS**를 사용.

- **Observable**: 데이터 스트림을 처리.
- 주요 연산자:
  - `map`, `filter`, `mergeMap`, `switchMap`, `catchError` 등.

---

## 8. **폼(Form) 처리**  
Angular는 사용자 입력을 처리하기 위한 두 가지 주요 방식 제공.

- **템플릿 기반 폼**: HTML 템플릿에서 주로 설정.
- **반응형 폼**: TypeScript 클래스에서 폼 제어.
  - `FormGroup`, `FormControl`, `Validators` 사용.

---

## 9. **파이프(Pipe)**  
데이터를 변환하여 템플릿에 표시.

- 내장 파이프:
  - `date`, `uppercase`, `lowercase`, `currency`, `percent` 등.
- **사용자 정의 파이프**: `@Pipe` 데코레이터로 정의.

---

## 10. **빌드 및 배포**  
Angular CLI를 사용하여 프로젝트를 빌드하고 배포.

- 개발 서버 실행: `ng serve`
- 프로덕션 빌드: `ng build --prod`
- 서버 배포를 위해 빌드 파일 생성.

---
