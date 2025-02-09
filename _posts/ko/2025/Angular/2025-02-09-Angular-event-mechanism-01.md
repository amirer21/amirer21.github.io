---
title: Angular 프레임워크 - Event 매커니즘 01 - 역할, 동작원리
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Angular
tags:
- Angular
- Framework
- event
toc: true
toc_sticky: true
toc_label: 목차
description: Angular 프레임워크에서 이벤트 객체 매커니즘
article_tag1: Angular
article_tag2: Framework
article_tag3: event
article_section: Angular
meta_keywords: Angular, event
last_modified_at: '2025-02-09 21:00:00 +0800'
---


# 🔍 **Angular에서 `$event`의 역할, 동작 원리, 메커니즘**

Angular에서 `$event`는 **템플릿에서 이벤트가 발생할 때, 해당 이벤트 객체를 핸들러 함수로 전달하는 특별한 변수**입니다.  
이는 **브라우저의 표준 이벤트 객체(DOM Event Object)를 자동으로 바인딩하여 Angular 이벤트 시스템과 연결하는 역할**을 합니다.

---

## 📌 **1. `$event`의 역할**
### ✅ **1) `$event`는 DOM 이벤트 객체를 참조**
- Angular에서 발생하는 **클릭, 입력, 키보드, 마우스 이동 등의 이벤트**에 대한 **브라우저 표준 이벤트 객체를 전달하는 변수**입니다.
- `$event`는 Angular 템플릿 문법에서 자동으로 제공됩니다.

```html
<button (click)="onClick($event)">Click Me</button>
```

```typescript
onClick(event: MouseEvent) {
  console.log(event); // MouseEvent 객체 출력
}
```
📌 `$event`는 브라우저에서 발생한 `MouseEvent` 객체를 핸들러 함수로 전달합니다.

---

### ✅ **2) `$event`는 Angular의 이벤트 바인딩과 함께 동작**
- Angular에서는 **(이벤트)="핸들러($event)"** 방식으로 템플릿과 컴포넌트를 연결합니다.
- 이때 `$event`는 **이벤트 객체를 자동으로 핸들러에 전달**합니다.

```html
<input (keydown)="onKeyPress($event)">
```

```typescript
onKeyPress(event: KeyboardEvent) {
  console.log(`Pressed Key: ${event.key}`);
}
```
📌 `$event`는 `KeyboardEvent` 객체를 전달하여 눌린 키 값을 확인할 수 있습니다.

---

### ✅ **3) `$event`는 커스텀 이벤트에서도 사용 가능**
- **`@Output` 데코레이터와 `EventEmitter`** 를 사용하여 `$event`를 통해 데이터 전달이 가능합니다.

#### **예제: 자식 컴포넌트에서 부모 컴포넌트로 데이터 전달**
```typescript
// child.component.ts (자식 컴포넌트)
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<button (click)="sendMessage()">Send Message</button>`
})
export class ChildComponent {
  @Output() messageEvent = new EventEmitter<string>();

  sendMessage() {
    this.messageEvent.emit('Hello Parent!');
  }
}
```

```html
<!-- 부모 컴포넌트 -->
<app-child (messageEvent)="receiveMessage($event)"></app-child>
```

```typescript
// parent.component.ts (부모 컴포넌트)
receiveMessage(message: string) {
  console.log(message); // 'Hello Parent!' 출력
}
```
📌 `$event`는 `EventEmitter`가 전달하는 값(여기서는 `'Hello Parent!'`)을 자동으로 매핑합니다.

---

## 📌 **2. `$event`의 동작 원리**
### **💡 Angular의 이벤트 바인딩 흐름**
1️⃣ 사용자가 **버튼 클릭** 등의 이벤트를 발생  
2️⃣ 브라우저가 **이벤트 객체(`MouseEvent`, `KeyboardEvent` 등)를 생성**  
3️⃣ Angular가 `(click)="onClick($event)"` 이벤트 바인딩을 감지  
4️⃣ `$event`를 **이벤트 핸들러 함수(`onClick(event: MouseEvent)`)에 자동으로 전달**  
5️⃣ 핸들러 함수가 실행되며, `$event`를 활용하여 이벤트 정보를 추출  

---

## 📌 **3. `$event`의 메커니즘**
### ✅ **1) Angular가 `$event`를 자동으로 제공하는 방식**
- Angular의 **템플릿 엔진**이 이벤트 바인딩을 해석할 때, `$event`가 자동으로 정의됩니다.
- 내부적으로 `$event`는 **이벤트 바인딩된 요소의 이벤트 객체를 참조**합니다.

#### **Angular 내부 동작 방식**
1. 사용자가 `<button (click)="onClick($event)">Click Me</button>` 클릭  
2. Angular의 **템플릿 엔진이 이벤트를 감지하고 `$event`를 생성**  
3. Angular의 **Zone.js가 이벤트 객체를 추적**  
4. `$event`를 자동으로 핸들러(`onClick()`)에 전달  
5. `onClick(event: MouseEvent)`가 실행되며, `$event`를 활용하여 이벤트 정보를 추출  

---

### ✅ **2) `$event`는 브라우저의 표준 이벤트 객체를 포함**
| 이벤트 타입  | `$event`의 타입 | `$event` 내부 속성 예시 |
|-------------|--------------|------------------|
| `click` | `MouseEvent` | `clientX`, `clientY`, `target` |
| `keydown` | `KeyboardEvent` | `key`, `code`, `altKey` |
| `input` | `InputEvent` | `target.value` |
| `submit` | `SubmitEvent` | `preventDefault()` |
| `change` | `Event` | `target.value` |

---

### ✅ **3) `$event`를 활용한 주요 예제**
#### **📍 마우스 이벤트 확인**
```html
<button (click)="onClick($event)">Click Me</button>
```
```typescript
onClick(event: MouseEvent) {
  console.log(`Clicked at X: ${event.clientX}, Y: ${event.clientY}`);
}
```

#### **📍 키보드 이벤트 확인**
```html
<input (keydown)="onKeyPress($event)">
```
```typescript
onKeyPress(event: KeyboardEvent) {
  console.log(`Pressed Key: ${event.key}`);
}
```

#### **📍 입력 필드 값 확인**
```html
<input (input)="onInputChange($event)">
```
```typescript
onInputChange(event: InputEvent) {
  const inputElement = event.target as HTMLInputElement;
  console.log(`Input value: ${inputElement.value}`);
}
```

---

## **📌 결론**
✔ `$event`는 **Angular 템플릿에서 자동으로 제공되는 변수**이며, **DOM 이벤트 객체를 핸들러 함수에 전달**하는 역할을 한다.  
✔ Angular는 **브라우저의 표준 이벤트 객체**(`MouseEvent`, `KeyboardEvent`, `InputEvent` 등)를 `$event`로 자동으로 바인딩한다.  
✔ `$event`는 이벤트 바인딩을 통해 **자동으로 생성되고 핸들러 함수에 전달되는 구조**이며, 개발자가 직접 선언할 필요가 없다.  
✔ `$event`는 기본 DOM 이벤트뿐만 아니라, **커스텀 이벤트(`@Output`)에서도 데이터 전달에 사용**될 수 있다.  

이제 `$event`의 역할, 동작 원리, 그리고 내부 메커니즘이 명확하게 이해되었나요? 😊