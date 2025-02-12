---
title: Angular 프레임워크 - 브라우저의 표준 이벤트 객체란?
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
description: Angular 이벤트 객체 제어를 위한 표준 이벤트 객체 이해
article_tag1: Angular
article_tag2: Framework
article_tag3: event
article_section: Angular
meta_keywords: Angular, event
last_modified_at: '2025-02-09 21:00:00 +0800'
---


### Angular에서 브라우저의 표준 이벤트 객체란?

Angular에서 **브라우저의 표준 이벤트 객체(Standard Event Object)** 란, JavaScript의 **DOM 이벤트 객체(DOM Event Object)** 를 의미합니다. 브라우저에서 발생하는 **마우스 클릭, 키보드 입력, 폼 제출 등**의 이벤트를 감지하고 핸들링할 때 사용됩니다.

---

## 📌 **브라우저의 표준 이벤트 객체란?**
**DOM 이벤트 객체**는 **브라우저에서 제공하는 이벤트 관련 정보를 담고 있는 객체**입니다. JavaScript의 `Event` 인터페이스를 기반으로 하며, 이벤트의 유형에 따라 `MouseEvent`, `KeyboardEvent`, `InputEvent` 등 다양한 이벤트 객체가 있습니다.

**예제: 표준 이벤트 객체 확인**
```html
<button (click)="onClick($event)">Click Me</button>
```

```typescript
onClick(event: MouseEvent) {
  console.log(event);  // MouseEvent 객체 출력
}
```
📌 `$event`는 **브라우저의 표준 이벤트 객체**로, `MouseEvent` 타입을 가집니다.

---

## 📌 **Angular에서의 이벤트 처리 방식**
Angular는 **브라우저의 표준 이벤트 객체를 직접 활용**합니다. 하지만 Angular의 **이벤트 바인딩(Event Binding)** 을 통해 보다 직관적이고 효율적으로 이벤트를 다룰 수 있습니다.

### ✅ **1. DOM 이벤트 객체 전달 (`$event`)**
Angular에서 이벤트 바인딩 시 `$event`를 사용하면 **기본 JavaScript 이벤트 객체를 직접 핸들러에서 접근**할 수 있습니다.

```html
<input (input)="onInput($event)">
```

```typescript
onInput(event: InputEvent) {
  const inputElement = event.target as HTMLInputElement;
  console.log(inputElement.value);  // 입력된 값 출력
}
```
📌 `event.target`을 `HTMLInputElement`로 캐스팅하여 `value`를 가져옵니다.

---

### ✅ **2. 이벤트 객체의 주요 속성**

| 이벤트 타입     | 속성 예시            | 설명              |
|---------------|-------------------|------------------|
| MouseEvent   | event.clientX      | 클릭한 마우스 X 좌표 |
| KeyboardEvent | event.key          | 눌린 키 값         |
| InputEvent   | event.target.value | 입력 필드의 값      |
| FocusEvent   | event.target       | 포커스를 받은 요소  |

---

## 📌 **브라우저의 표준 이벤트 객체를 활용한 예제**

### 🖱️ **1. 마우스 클릭 이벤트 (`MouseEvent`)**
```html
<button (click)="onClick($event)">Click Me</button>
```

```typescript
onClick(event: MouseEvent) {
  console.log(`X: ${event.clientX}, Y: ${event.clientY}`);  
}
```
📌 마우스를 클릭한 좌표를 출력합니다.

---

### ⌨️ **2. 키보드 이벤트 (`KeyboardEvent`)**
```html
<input (keydown)="onKeyPress($event)">
```

```typescript
onKeyPress(event: KeyboardEvent) {
  console.log(`Pressed key: ${event.key}`);
}
```
📌 눌린 키 값을 출력합니다.

---

### 📝 **3. 입력 필드 값 가져오기 (`InputEvent`)**
```html
<input (input)="onInputChange($event)">
```

```typescript
onInputChange(event: InputEvent) {
  const inputElement = event.target as HTMLInputElement;
  console.log(`Input value: ${inputElement.value}`);
}
```
📌 입력 필드의 값을 가져옵니다.

---

### ✅ **Angular의 이벤트 바인딩과 표준 이벤트 객체 차이점**

| 구분          | JavaScript                                   | Angular                         |
|--------------|-------------------------------------------|--------------------------------|
| 이벤트 등록 방식 | element.addEventListener('click', handler) | (click)="handler($event)"     |
| 이벤트 객체 접근 | event                                   | $event                        |
| 기본 이벤트 방지 | event.preventDefault()                 | $event.preventDefault()       |
| 커스텀 이벤트  | new Event('custom')                    | @Output() EventEmitter        |


---

## 📌 **결론**
Angular에서 **브라우저의 표준 이벤트 객체**는 JavaScript의 **DOM 이벤트 객체**를 의미합니다. `$event`를 활용하여 `MouseEvent`, `KeyboardEvent`, `InputEvent` 등의 이벤트 정보를 얻고, Angular의 **이벤트 바인딩을 통해 효율적으로 이벤트를 처리**할 수 있습니다.

💡 **핵심 요약**
- Angular의 `$event`는 **브라우저의 표준 이벤트 객체**(DOM 이벤트 객체)이다.
- DOM 이벤트 객체에는 `MouseEvent`, `KeyboardEvent`, `InputEvent` 등의 다양한 타입이 존재한다.
- Angular 이벤트 바인딩(`(event)="handler($event)"`)을 사용하면 **직관적이고 깔끔한 코드 작성이 가능**하다.
- 기본적인 JavaScript 이벤트 핸들링(`addEventListener`)보다 Angular 이벤트 바인딩이 더 **간편하고 유지보수가 용이**하다.
