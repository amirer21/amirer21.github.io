---
title: Angular - 주요 매커니즘 02 - 디렉티브(Directive)
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
description: Angular - 주요 매커니즘 - 디렉티브(Directive)
article_tag1: Angular
article_tag2: NodeJS
article_tag3: 
article_section: 
meta_keywords: Angular, NodeJS
last_modified_at: '2025-01-05 21:00:00 +0800'
---

Angular 에서는 디렉티브(Directive) 라는 매커니즘이 있습니다.
이번에는 이 매커니즘을 알아보고자 합니다. 디렉티브는 Angular의 선언적 프로그래밍 스타일을 돕는 핵심 메커니즘입니다.


## **디렉티브(Directive)의 어원**  
**Directive**는 라틴어 "dirigere"에서 유래했으며 "지시하다" 또는 "길을 인도하다"라는 의미를 가집니다.  
소프트웨어 개발에서 디렉티브는 **프로그램이나 시스템에 특정 동작을 지시하는 선언적 명령**을 의미합니다.  

Angular에서 **디렉티브**는 **HTML 요소나 속성의 동작을 확장**하거나 **DOM을 조작**하는 기능을 제공합니다.  
HTML 자체가 정적인 언어인데 Angular의 디렉티브를 통해 이를 동적으로 만들어 **템플릿에서 자바스크립트(Angular 로직)를 연결**할 수 있게 합니다.

---

## **디렉티브의 역할: HTML에서 자바스크립트를 활용**  
Angular 디렉티브는 HTML 문서에서 **JavaScript(컴포넌트 로직)**를 자연스럽게 연결하여 다음과 같은 작업을 수행합니다:
1. **HTML 구조 변경 (구조 디렉티브)**: 동적으로 요소를 추가하거나 제거.
2. **속성 동적 변경 (속성 디렉티브)**: 스타일, 클래스, 이벤트 처리 등을 자바스크립트 코드로 제어.
3. **사용자 정의 동작 추가**: 커스텀 디렉티브를 통해 특정 DOM 동작을 정의.

즉, **디렉티브는 HTML과 JavaScript를 연결하는 브리지 역할**을 합니다.

---

## **디렉티브의 종류**  
디렉티브는 Angular에서 3가지 종류로 분류됩니다:

### (1) **구조 디렉티브 (Structural Directive)**  
DOM 구조를 동적으로 변경하는 디렉티브입니다. 요소를 추가하거나 제거하여 HTML 구조를 제어합니다.  

- **주요 디렉티브**:
  - `*ngIf`: 조건에 따라 DOM에 요소를 추가/제거.
  - `*ngFor`: 반복적으로 요소를 생성.
  - `*ngSwitch`: 조건에 따라 여러 DOM 블록 중 하나를 렌더링.

- **예시**:
  ```html
  <!-- *ngIf -->
  <div *ngIf="isLoggedIn">Welcome back!</div>

  <!-- *ngFor -->
  <ul>
    <li *ngFor="let item of items">{{ item }}</li>
  </ul>

  <!-- *ngSwitch -->
  <div [ngSwitch]="userRole">
    <p *ngSwitchCase="'admin'">Admin Panel</p>
    <p *ngSwitchCase="'user'">User Dashboard</p>
    <p *ngSwitchDefault>Guest View</p>
  </div>
  ```

---

### (2) **속성 디렉티브 (Attribute Directive)**  
HTML 요소의 속성이나 스타일을 동적으로 변경합니다.  

- **주요 디렉티브**:
  - `[class]`, `[style]`: 요소의 CSS 클래스와 스타일 변경.
  - `ngClass`: 여러 CSS 클래스를 조건부로 설정.
  - `ngStyle`: 여러 스타일 속성을 동적으로 설정.

- **예시**:
  ```html
  <!-- ngClass -->
  <div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }">Dynamic Class</div>

  <!-- ngStyle -->
  <div [ngStyle]="{ 'color': textColor, 'font-size': fontSize + 'px' }">Dynamic Styles</div>
  ```

---

### (3) **사용자 정의 디렉티브 (Custom Directive)**  
사용자가 특정 요구에 맞는 동작을 정의할 수 있습니다.  
예를 들어, 요소에 마우스를 올리면 색상을 변경하는 디렉티브를 만들 수 있습니다.

- **구조**:
  - `@Directive` 데코레이터를 사용하여 정의.
  - **HostListener**: DOM 이벤트 리스너 설정.
  - **HostBinding**: 호스트 요소 속성 바인딩.

- **예시: 텍스트 색상 변경 디렉티브**:
  ```typescript
  import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

  @Directive({
    selector: '[appHighlight]'
  })
  export class HighlightDirective {
    constructor(private el: ElementRef, private renderer: Renderer2) {}

    @HostListener('mouseenter') onMouseEnter() {
      this.renderer.setStyle(this.el.nativeElement, 'color', 'blue');
    }

    @HostListener('mouseleave') onMouseLeave() {
      this.renderer.setStyle(this.el.nativeElement, 'color', 'black');
    }
  }
  ```

  - **사용법**:
    ```html
    <p appHighlight>Hover to change color!</p>
    ```

---

## **디렉티브의 핵심 메커니즘**
- **선택자 (Selector)**: 디렉티브를 적용할 요소를 지정.
- **HostBinding**: 디렉티브가 호스트 요소의 속성을 바인딩.
- **HostListener**: 디렉티브가 호스트 요소의 이벤트를 감지.

---

## **Angular 디렉티브와 HTML/JavaScript 관계**
Angular 디렉티브는 **HTML에 동적인 JavaScript 기능을 추가하는 도구**입니다.  
이를 통해 HTML 템플릿이 단순한 구조적 마크업에서 벗어나 애플리케이션 로직과 상호작용할 수 있게 합니다.

| **HTML의 한계**                        | **디렉티브로 가능해지는 일**                              |
|----------------------------------------|----------------------------------------------------------|
| HTML은 정적 구조를 정의하는 데 적합함.  | 동적으로 요소를 추가, 제거, 반복, 스타일 조작 가능.       |
| JavaScript는 직접 DOM 조작이 필요함.   | 디렉티브로 선언적으로 DOM 제어 가능.                     |
| 스타일과 클래스 변경에 조건문 사용 어려움 | 디렉티브로 조건부 클래스 및 스타일 변경을 간단히 처리.    |
