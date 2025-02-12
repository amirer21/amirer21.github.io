---
title: Angular 프레임워크 - Event 매커니즘 02 - 흐름도
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


# 📌 **Angular에서 Event 매커니즘 설명 및 흐름도**

Angular에서 이벤트 매커니즘은 **브라우저의 표준 이벤트 시스템을 기반으로, Zone.js 및 Change Detection과 연계하여 동작**합니다.  
즉, 이벤트가 발생하면 **Angular가 이를 감지하고 핸들러를 실행한 후 Change Detection을 트리거하여 UI를 업데이트**하는 방식으로 작동합니다.

---

## 🔍 **1. Angular 이벤트 매커니즘 개요**
### ✅ **1. 브라우저 이벤트 모델을 기반으로 동작**
Angular는 브라우저의 기본 이벤트 시스템(이벤트 루프, 버블링, 캡처링)을 활용합니다.  
예를 들어, 사용자가 버튼을 클릭하면 브라우저에서 `MouseEvent` 객체를 생성하고 이벤트를 전파합니다.

### ✅ **2. Angular 이벤트 바인딩을 통해 이벤트 핸들링**
Angular에서는 **템플릿에서 이벤트 바인딩을 통해 이벤트를 감지하고 처리**할 수 있습니다.

```html
<button (click)="handleClick($event)">Click Me</button>
```

```typescript
handleClick(event: MouseEvent) {
  console.log(`Clicked at X: ${event.clientX}, Y: ${event.clientY}`);
}
```
📌 Angular가 **브라우저에서 발생한 이벤트를 감지하고, `$event`를 핸들러 함수에 전달**합니다.

### ✅ **3. Zone.js가 이벤트 실행을 감지하고 Change Detection 실행**
- Angular는 **Zone.js를 사용하여 이벤트 실행을 감지**하고, 실행 후 Change Detection을 트리거합니다.
- Change Detection이 실행되면, **컴포넌트의 데이터 변경을 감지하고 UI를 업데이트**합니다.

---

## 🛠 **2. Angular 이벤트 매커니즘 동작 원리**
### **🔹 이벤트 발생부터 UI 업데이트까지의 과정**
1️⃣ 사용자가 **버튼 클릭**  
2️⃣ 브라우저가 **`MouseEvent` 객체를 생성**  
3️⃣ Angular가 **(click) 이벤트 바인딩을 감지하여 이벤트 핸들러 호출**  
4️⃣ Angular가 `$event`를 핸들러 함수에 전달  
5️⃣ **Zone.js가 이벤트 실행을 감지하고 Change Detection을 예약**  
6️⃣ Change Detection이 실행되어 **컴포넌트 데이터 변경 확인**  
7️⃣ 데이터가 변경되었다면, **Angular가 변경된 값으로 UI 업데이트**  
8️⃣ 브라우저가 변경된 DOM을 다시 렌더링  

---

## 🏗 **3. Angular 이벤트 매커니즘 흐름도**

```plaintext
사용자 이벤트 발생 (예: 클릭, 입력, 키보드 조작)
        │
        ▼
브라우저가 이벤트 객체 생성 (MouseEvent, KeyboardEvent 등)
        │
        ▼
Angular 이벤트 바인딩 실행 (click, input 등의 이벤트 감지)
        │
        ▼
Angular가 이벤트 핸들러 호출 및 `$event` 전달
        │
        ▼
Zone.js가 이벤트 실행을 감지하고 Change Detection 실행 예약
        │
        ▼
Change Detection이 실행되어 변경된 데이터 확인
        │
        ▼
변경된 데이터가 있으면 UI 업데이트
        │
        ▼
브라우저가 변경된 DOM을 다시 렌더링
```

---

## 🏗 **4. Angular 이벤트 흐름 예제**
### ✅ **예제 코드**
```html
<button (click)="incrementCounter($event)">Increment</button>
<p>Counter: {{ counter }}</p>
```

```typescript
counter = 0;

incrementCounter(event: MouseEvent) {
  console.log(`Event Target: ${event.target}`);
  this.counter++;  // 데이터 변경
}
```

### ✅ **이벤트 흐름 분석**
1️⃣ **사용자가 버튼 클릭**  
2️⃣ **브라우저가 `MouseEvent` 생성** (`event.target`은 `<button>`)  
3️⃣ **Angular `(click)` 이벤트 바인딩이 실행됨**  
4️⃣ **Angular가 `$event`를 `incrementCounter(event)`로 전달**  
5️⃣ **Zone.js가 이벤트 실행을 감지하고 Change Detection을 실행하도록 예약**  
6️⃣ **핸들러 함수가 실행되어 `this.counter++` 값을 변경**  
7️⃣ **Change Detection이 실행되어 `{{ counter }}` 변경 감지**  
8️⃣ **Angular가 UI 업데이트 (`Counter: 1` → `Counter: 2` 등으로 변경됨)**  
9️⃣ **브라우저가 변경된 DOM을 렌더링하여 업데이트된 UI 표시**  

---

## 📌 **5. Angular 이벤트 매커니즘 요약**

| 단계 | 설명 |
|------|------|
| **1. 이벤트 발생** | 사용자가 버튼 클릭, 입력, 키보드 입력 등의 이벤트 발생 |
| **2. 브라우저 이벤트 객체 생성** | MouseEvent, KeyboardEvent 등 브라우저가 이벤트 객체 생성 |
| **3. Angular 이벤트 바인딩 실행** | (click)="onClick($event)" 와 같은 바인딩이 트리거됨 |
| **4. $event 전달** | Angular가 $event를 이벤트 핸들러 함수에 자동으로 전달 |
| **5. Zone.js 감지** | Zone.js가 이벤트 실행을 가로채고 Angular에 알림 |
| **6. Change Detection 실행** | Angular가 변경 사항을 감지하고 UI 업데이트 수행 |
| **7. UI 업데이트** | 변경된 데이터를 반영하여 DOM을 다시 렌더링 |

---

## ✅ **결론**
- Angular의 이벤트 매커니즘은 **브라우저의 표준 이벤트 시스템을 기반으로, Zone.js 및 Change Detection과 통합**되어 동작합니다.
- 이벤트가 발생하면 **Angular는 이를 감지하고, `$event`를 통해 이벤트 객체를 핸들러에 전달**합니다.
- **Zone.js가 이벤트 실행을 감지하여 Change Detection을 트리거**하고, UI를 동기화하여 최신 상태를 유지합니다.
- 개발자는 **이벤트 바인딩만 설정하면 Angular가 자동으로 UI 업데이트까지 수행**하므로, 복잡한 DOM 조작이 필요 없습니다.