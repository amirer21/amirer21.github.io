---
title: Angular - 5 -바인딩 매커니즘 순서 자세히 설명
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
description: Angular의 바인딩 매커니즘 Change Detection 기반 동작, 자동 UI 업데이트 구조
article_tag1: Angular
article_tag2: Framework
article_tag3: html
article_section: Angular
meta_keywords: Angular, html, binding, mechanism
last_modified_at: '2025-02-16 21:00:00 +0800'
---


Angular에서 **바인딩 매커니즘**이란 **데이터가 컴포넌트와 뷰(HTML) 간에 어떻게 연결되고 업데이트되는지**를 의미합니다.  
Angular의 바인딩 메커니즘은 **단방향 바인딩(One-Way Binding)**과 **양방향 바인딩(Two-Way Binding)**으로 나뉘며, **Change Detection(변경 감지)**을 통해 UI가 자동으로 업데이트됩니다.

---

## ✅ **1. Angular 바인딩의 4가지 방식**

| 바인딩 유형              | 기호         | 데이터 흐름    | 설명                            |
|--------------------------|-------------|---------------|--------------------------------|
| Interpolation(보간법)   | `{{ }}`      | 컴포넌트 → HTML | 텍스트를 HTML에서 표시        |
| Property Binding(속성 바인딩) | `[property]` | 컴포넌트 → HTML | HTML 요소의 속성을 동적으로 변경 |
| Event Binding(이벤트 바인딩)   | `(event)`    | HTML → 컴포넌트 | 사용자의 이벤트를 감지하여 함수 실행 |
| Two-Way Binding(양방향 바인딩) | `[(ngModel)]` | 컴포넌트 ↔ HTML | 데이터 변경이 양방향으로 동기화됨 |


---

## ✅ **2. Angular 바인딩 순서**
Angular에서 **컴포넌트가 로드되고 바인딩이 실행되는 과정**을 순서대로 설명하겠습니다.

### 📌 **(1) 부모 컴포넌트에서 자식 컴포넌트로 데이터 전달**
```html
<app-child [data]="parentData"></app-child>
```
- 부모 컴포넌트에서 **속성 바인딩**을 통해 데이터를 전달합니다.

```typescript
export class ParentComponent {
  parentData = '부모 데이터';
}
```

---

### 📌 **(2) 자식 컴포넌트에서 `@Input()`을 통해 데이터 받기**
```typescript
export class ChildComponent {
  @Input() data: string;
}
```
- `@Input()`을 통해 **부모로부터 전달된 데이터**를 받을 수 있습니다.

---

### 📌 **(3) Interpolation(보간법) 적용**
```html
<p>{{ data }}</p>
```
📌 **설명:**  
- `data` 값이 `"부모 데이터"`이면 화면에는 `<p>부모 데이터</p>`로 표시됩니다.

---

### 📌 **(4) Property Binding(속성 바인딩) 실행**
```html
<img [src]="imageUrl">
```
📌 **설명:**  
- `imageUrl` 값이 변경되면 **자동으로 `<img>`의 `src` 속성이 업데이트**됩니다.

---

### 📌 **(5) Event Binding(이벤트 바인딩) 실행**
```html
<button (click)="changeData()">클릭</button>
```

```typescript
export class ExampleComponent {
  data = '초기 데이터';

  changeData() {
    this.data = '업데이트된 데이터';
  }
}
```
📌 **설명:**  
- 버튼 클릭 시 `changeData()`가 실행되면서 `data` 값이 변경됩니다.
- Angular의 **Change Detection(변경 감지)**이 동작하여 화면이 업데이트됩니다.

---

### 📌 **(6) Two-Way Binding(양방향 바인딩) 실행**
```html
<input [(ngModel)]="username">
<p>입력한 이름: {{ username }}</p>
```

```typescript
export class ExampleComponent {
  username = '홍길동';
}
```
📌 **설명:**  
- 사용자가 `<input>`에 값을 입력하면 `username` 값이 즉시 변경됩니다.
- `username` 값이 변경되면 **자동으로 `<p>` 태그의 내용도 업데이트**됩니다.

---

## ✅ **3. Angular 바인딩 매커니즘의 내부 동작 과정**
Angular에서 바인딩이 동작하는 **구체적인 과정**을 순서대로 설명하겠습니다.

### 🔹 **1) 템플릿(HTML)이 로드됨**
```html
<p>{{ data }}</p>
<img [src]="imageUrl">
<button (click)="changeData()">변경</button>
<input [(ngModel)]="username">
```
- Angular는 템플릿(HTML)에서 바인딩이 적용된 부분을 **컴파일**합니다.

---

### 🔹 **2) 컴포넌트 클래스가 실행됨**
```typescript
export class ExampleComponent {
  data = '초기 데이터';
  imageUrl = 'https://example.com/image.jpg';
  username = '홍길동';
}
```
- `data`, `imageUrl`, `username` 변수들이 초기화됩니다.

---

### 🔹 **3) Angular의 Change Detection(변경 감지) 실행**
Angular는 **Change Detection(변경 감지)**을 통해 데이터 변경을 감지하고 UI를 업데이트합니다.

📌 **변경 감지 과정**
1. 사용자의 이벤트(예: 클릭, 입력)가 발생하면 Angular가 이를 감지
2. 변경된 데이터를 컴포넌트에 반영
3. **DOM을 다시 렌더링하여 화면 업데이트**

```typescript
export class ExampleComponent {
  data = '초기 데이터';

  changeData() {
    this.data = '변경된 데이터';
  }
}
```
- 버튼을 클릭하면 `changeData()`가 실행되어 `data` 값이 변경됩니다.
- Angular는 변경된 값을 감지하고 **자동으로 화면을 업데이트**합니다.

---

### 🔹 **4) 화면 업데이트 완료**
- 변경된 데이터가 템플릿(HTML)에 반영됩니다.
- 새로운 값이 표시되며, 사용자가 입력한 값도 반영됩니다.

---

## ✅ **4. Angular 바인딩 순서 정리**
| 단계 | 동작 |
|------|------|
| **1. 부모 → 자식 데이터 전달** | `@Input()`을 통해 부모 컴포넌트에서 자식 컴포넌트로 데이터 전달 |
| **2. 템플릿 바인딩 실행** | `{{ }}`, `[property]`, `(event)`, `[(ngModel)]` 등이 동작 |
| **3. 이벤트 발생** | 사용자의 입력 또는 버튼 클릭 |
| **4. 데이터 변경** | `this.value = newValue;` |
| **5. Angular 변경 감지 실행** | 데이터 변경을 감지하고 UI 업데이트 |
| **6. 화면이 자동으로 업데이트됨** | 변경된 데이터가 반영된 HTML이 다시 렌더링됨 |

---

## ✅ **5. Change Detection(변경 감지)와 바인딩**
Angular는 바인딩이 적용된 값이 변경되면 **Change Detection(변경 감지)**을 통해 UI를 자동으로 업데이트합니다.

📌 **변경 감지 과정**
1. **사용자가 데이터를 변경**하면 `ngZone`이 이를 감지
2. **Angular의 Change Detection이 실행됨**
3. 변경된 데이터가 **템플릿에 반영됨**
4. 최종적으로 새로운 HTML이 렌더링됨

---

## ✅ **6. 결론**
| 개념 | 설명 |
|------|------|
| **Interpolation (`{{ }}`)** | 변수 값을 템플릿에서 직접 표시 |
| **Property Binding (`[property]`)** | 요소 속성을 동적으로 변경 |
| **Event Binding (`(event)`)** | 이벤트 발생 시 메서드 실행 |
| **Two-Way Binding (`[(ngModel)]`)** | 데이터 변경이 즉시 반영됨 |
| **Change Detection (변경 감지)** | 데이터가 변경되면 UI를 자동으로 업데이트 |

Angular의 바인딩 매커니즘은 **Change Detection**을 기반으로 동작하며, **자동으로 UI를 업데이트하는 구조**를 가지고 있습니다.