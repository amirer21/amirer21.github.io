---
title: Angular - 주요 매커니즘 01 - 데이터 바인딩
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
description: Angular - 주요 매커니즘 - 데이터 바인딩
article_tag1: Angular
article_tag2: NodeJS
article_tag3: 
article_section: 
meta_keywords: Angular, NodeJS
last_modified_at: '2025-01-05 21:00:00 +0800'
---

Angular의 **데이터 바인딩** 방식과 그 차이를 알아보고자 합니다.
Angular에서는 데이터 바인딩 방식이 여러자기 있는데 데이터 바인딩을 독립적으로 사용되거나 조합하여 유연한 데이터 바인딩을 제공합니다. 

---

## 1. **데이터 바인딩 (Data Binding)**  
Angular에서 데이터 바인딩은 **클래스(컴포넌트)**와 **HTML 템플릿** 사이에 데이터를 주고받는 메커니즘입니다.  
이를 통해 UI와 애플리케이션 로직을 동기화할 수 있습니다.  
데이터 바인딩에는 아래 3가지 방식이 포함됩니다:
- **단방향 바인딩**
- **양방향 바인딩**
- **이벤트 바인딩**

---

## 2. **양방향 바인딩 (Two-Way Binding)**  

양방향 바인딩은 **모델 데이터와 뷰(UI)가 실시간으로 동기화**되는 방식입니다.

- 사용법: `[(ngModel)]`  
- 특징:
  - 입력된 값이 즉시 컴포넌트의 속성으로 업데이트되고, 컴포넌트의 속성이 변경되면 입력값도 자동으로 반영.
  - 주로 **폼 입력 요소**에서 사용.  
- 예시:
  ```html
  <input [(ngModel)]="username" placeholder="Enter your name">
  <p>Hello, {{ username }}</p>
  ```
  - 텍스트 입력 필드에 이름을 입력하면 `username` 속성이 업데이트되고, 동시에 템플릿에서도 실시간으로 반영됩니다.

---

## 3. **단방향 바인딩 (One-Way Binding)**  

단방향 바인딩은 **데이터가 한 방향으로만 전달**됩니다.

### (1) **프로퍼티 바인딩 (Property Binding)**  
템플릿에서 **컴포넌트 속성 값을 뷰(UI)에 전달**합니다.

- 사용법: `[property]="expression"`
- 특징:
  - 속성 값이 템플릿에 표시되지만, UI 변경이 컴포넌트에 반영되지 않음.
- 예시:
  ```html
  <img [src]="imageUrl" alt="Dynamic Image">
  ```
  - `imageUrl`의 값이 바뀌면 이미지의 `src` 속성이 자동 업데이트.

---

### (2) **인터폴레이션 (Interpolation)**  
템플릿에서 **컴포넌트 속성을 문자열로 표현**합니다.

- 사용법: `{{ expression }}`
- 특징:
  - 텍스트 노드에서만 사용 가능.
  - 데이터가 단방향으로 흐름(컴포넌트 → 템플릿).
- 예시:
  ```html
  <h1>{{ title }}</h1>
  ```
  - `title` 속성 값이 텍스트로 표시.

---

## 4. **이벤트 바인딩 (Event Binding)**  

이벤트 바인딩은 **템플릿에서 발생한 이벤트를 컴포넌트 클래스의 메서드로 전달**합니다.

- 사용법: `(event)="handler($event)"`
- 특징:
  - UI에서 발생한 사용자 동작(클릭, 키 입력 등)을 컴포넌트가 처리.
- 예시:
  ```html
  <button (click)="onClick()">Click Me</button>
  ```
  - 버튼을 클릭하면 `onClick` 메서드가 호출.

- `$event`를 통해 이벤트 객체를 전달 가능:
  ```html
  <input (input)="onInput($event)">
  ```

---

## 5. **차이점 정리**  

| **종류**         | **데이터 흐름**            | **용도**                                      | **사용법**                  |
|-------------------|----------------------------|-----------------------------------------------|-----------------------------|
| **양방향 바인딩** | 양방향 (컴포넌트 ↔ 템플릿) | 입력 요소와 모델 데이터 동기화                | `[(ngModel)]`              |
| **단방향 바인딩** | 단방향 (컴포넌트 → 템플릿) | 데이터를 화면에 표시하거나 속성 설정           | `{{ expression }}`, `[property]` |
| **이벤트 바인딩** | 단방향 (템플릿 → 컴포넌트) | UI 이벤트를 컴포넌트에서 처리                  | `(event)="handler()"`      |

