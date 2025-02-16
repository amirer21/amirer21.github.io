---
title: Angular - 1 - HTML 데이터 바인딩(Binding) 유형
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Angular
tags:
- Angular
- binding
- html
toc: true
toc_sticky: true
toc_label: 목차
description: Angular 프레임워크 HTML 데이터 바인딩(Binding) 유형
article_tag1: Angular
article_tag2: Framework
article_tag3: html
article_section: Angular
meta_keywords: Angular, html
last_modified_at: '2025-02-16 21:00:00 +0800'
---


Angular의 HTML에서 데이터 바인딩(Data Binding)은 크게 네 가지 유형으로 나눌 수 있습니다.
각각의 바인딩 방식은 특정한 목적과 사용 사례에 따라 적용됩니다.

---

## 🔹 1. **단방향 바인딩 (One-Way Binding)**
데이터가 한 방향으로만 흐르는 방식입니다. 컴포넌트 → 뷰 또는 뷰 → 컴포넌트로 이동할 수 있습니다.

### 📌 (1) **Interpolation (보간법) - `{{}}`**
- **컴포넌트의 데이터를 HTML에서 표시할 때 사용**합니다.
- 텍스트만 삽입할 수 있으며, HTML 태그는 적용되지 않습니다.

```html
<p>안녕하세요, {{ userName }}님!</p>
```

```typescript
export class AppComponent {
  userName = '철수';
}
```

📌 **결과:**  
```html
안녕하세요, 철수님!
```

---

### 📌 (2) **Property Binding - `[property]`**
- HTML 요소의 속성(Property)에 **변수를 바인딩**할 때 사용합니다.
- `[]` 안에 변수명을 넣어 사용합니다.

```html
<img [src]="imageUrl" [alt]="imageAlt">
```

```typescript
export class AppComponent {
  imageUrl = 'https://example.com/photo.jpg';
  imageAlt = 'Example Image';
}
```

📌 **주의사항:**  
- `class`, `style` 등의 속성도 `property binding`을 통해 제어할 수 있습니다.

```html
<div [class.active]="isActive">활성 상태</div>
<div [style.color]="textColor">색상 변경</div>
```

---

## 🔹 2. **이벤트 바인딩 (Event Binding) - `(event)`**
- HTML 요소에서 발생하는 이벤트(클릭, 입력 등)를 **컴포넌트 메서드와 연결**할 때 사용합니다.
- `(이벤트명)="메서드()"` 형식으로 사용됩니다.

```html
<button (click)="onClick()">클릭하세요</button>
```

```typescript
export class AppComponent {
  onClick() {
    alert('버튼이 클릭되었습니다!');
  }
}
```

📌 **입력 이벤트 바인딩 예제**
```html
<input (input)="onInputChange($event)">
<p>입력값: {{ userInput }}</p>
```

```typescript
export class AppComponent {
  userInput = '';

  onInputChange(event: Event) {
    this.userInput = (event.target as HTMLInputElement).value;
  }
}
```

---

## 🔹 3. **양방향 바인딩 (Two-Way Binding) - `[(ngModel)]`**
- **뷰와 컴포넌트 간 데이터가 동기화되는 방식**입니다.
- `[(ngModel)]`을 사용하려면 **FormsModule**을 import해야 합니다.

```html
<input [(ngModel)]="userName">
<p>입력된 이름: {{ userName }}</p>
```

```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  userName = '철수';
}
```

📌 **결과:**  
사용자가 입력한 값이 실시간으로 `userName` 변수에 반영됩니다.

---

## 🔹 4. **템플릿 참조 변수 (Template Reference Variables) - `#변수명`**
- 특정 요소를 참조하고 JavaScript처럼 직접 조작할 수 있습니다.

```html
<input #myInput type="text">
<button (click)="showValue(myInput.value)">값 확인</button>
```

```typescript
export class AppComponent {
  showValue(value: string) {
    alert('입력된 값: ' + value);
  }
}
```

---

## 📌 요약 정리표

| 바인딩 유형        | 기호            | 설명 |
|-------------------|---------------|--------------------------------|
| **Interpolation** | `{{ }}`       | 변수를 HTML에 출력 |
| **Property Binding** | `[property]`  | HTML 속성 값을 변수로 설정 |
| **Event Binding** | `(event)`      | HTML 이벤트와 메서드 연결 |
| **Two-Way Binding** | `[(ngModel)]` | 뷰와 컴포넌트 간 데이터 동기화 |
| **Template Reference Variables** | `#변수명` | 특정 요소를 직접 참조 |
