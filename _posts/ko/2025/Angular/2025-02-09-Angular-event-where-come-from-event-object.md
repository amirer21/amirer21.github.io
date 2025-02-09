---
title: Angular 프레임워크 - 이벤트 객체 디버깅으로 흐름 보기
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
description: Angular 이벤트 객체 디버깅으로 흐름 보기
article_tag1: Angular
article_tag2: Framework
article_tag3: event
article_section: Angular
meta_keywords: Angular, event
last_modified_at: '2025-02-09 21:00:00 +0800'
---


Angular에서 `$event`가 **어디에서 오는지** 디버깅을 통해 확인해보겠습니다.

---

## 🔍 **디버깅을 통한 `$event` 분석**
### **1. 코드 작성**
다음과 같이 **HTML과 TypeScript 코드를 작성**하여 이벤트 발생 시 `$event`가 어떻게 전달되는지 확인하겠습니다.

```html
<!-- HTML 코드 -->
<button (click)="onClick($event)">Click Me</button>
```

```typescript
// TypeScript 코드
onClick(event: MouseEvent) {
  console.log("MouseEvent 객체:", event);  // 전체 객체 출력
  console.log(`X: ${event.clientX}, Y: ${event.clientY}`); // 클릭 좌표 출력
  console.log("Event target:", event.target); // 클릭된 요소
  console.log("Event currentTarget:", event.currentTarget); // 이벤트 리스너가 바인딩된 요소
  console.log("Event type:", event.type); // 이벤트 타입 확인
}
```

---

### **2. 개발자 도구(F12)에서 디버깅**
#### **(1) `console.log("MouseEvent 객체:", event);` 출력 확인**
1. 브라우저에서 **F12(개발자 도구) → Console 탭**을 엽니다.
2. 버튼을 클릭하면, 다음과 같은 **MouseEvent 객체**가 출력됩니다.

```plaintext
MouseEvent 객체: MouseEvent {isTrusted: true, screenX: 500, screenY: 300, clientX: 200, clientY: 150, ...}
```
📌 `MouseEvent` 객체가 브라우저에서 생성됨을 확인할 수 있습니다.

#### **(2) `console.log("Event target:", event.target);` 출력 확인**
```plaintext
Event target: <button>Click Me</button>
```
📌 클릭된 요소(`<button>Click Me</button>`)가 `event.target`으로 출력됩니다.

#### **(3) `console.log("Event currentTarget:", event.currentTarget);` 출력 확인**
```plaintext
Event currentTarget: <button>Click Me</button>
```
📌 `currentTarget`도 `<button>`을 가리키며, 이는 이벤트가 **리스너가 바인딩된 요소에서 실행**되었음을 나타냅니다.

#### **(4) `console.log("Event type:", event.type);` 출력 확인**
```plaintext
Event type: click
```
📌 발생한 이벤트가 `click`임을 확인할 수 있습니다.

---

### **3. 이벤트 흐름 분석**
이제 `$event`가 어떻게 전달되는지 살펴보겠습니다.

1️⃣ **사용자가 버튼을 클릭하면 브라우저가 `MouseEvent` 객체를 생성**  
2️⃣ 브라우저의 이벤트 루프를 통해 해당 객체가 Angular 이벤트 시스템으로 전달됨  
3️⃣ Angular는 `click` 이벤트가 발생한 것을 감지하고, `(click)="onClick($event)"` 바인딩을 해석  
4️⃣ `onClick()` 함수가 실행되면서 `$event`가 인자로 전달됨  
5️⃣ `console.log(event)`를 통해 실제 **브라우저의 표준 이벤트 객체**임을 확인 가능  

---

## ✅ **결론**
- `$event`는 **브라우저의 표준 이벤트 시스템에서 생성된 MouseEvent 객체**이다.
- Angular는 이벤트 바인딩을 통해 `$event`를 **자동으로 핸들러 함수의 매개변수로 전달**한다.
- 개발자 도구(F12)에서 `console.log(event)`를 찍어 보면, `$event`가 **브라우저에서 발생한 실제 이벤트 객체**라는 것을 확인할 수 있다.
