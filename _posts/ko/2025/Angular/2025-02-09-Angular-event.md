---
title: Angular 프레임워크 - $event 란?
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


### Angular에서 $event란?

$event는 Angular에서 **DOM 이벤트 객체**를 가리키는 특별한 변수로, 이벤트 바인딩을 사용할 때 이벤트 핸들러로 전달됩니다. 이벤트가 발생하면 해당 이벤트 객체가 자동으로 $event 변수에 담겨 컴포넌트에서 사용할 수 있습니다.

---

### $event는 어디에서 오는가?

1. **템플릿 이벤트 바인딩 (`(event)="handler($event)"`)**

   - Angular의 **템플릿(event binding)** 문법에서 이벤트 핸들러에 전달됩니다.
   - `$event`는 JavaScript의 **DOM 이벤트 객체(Event Object)** 입니다.
   - 이벤트가 발생하면 Angular가 자동으로 `$event`를 핸들러 함수에 전달합니다.

   ```html
   <button (click)="onClick($event)">Click Me</button>
   ```

   ```typescript
   onClick(event: MouseEvent) {
     console.log(event); // MouseEvent 객체 출력
   }
   ```

2. **커스텀 이벤트 바인딩 (`@Output`)**

   - `@Output`을 사용하여 **자식 컴포넌트에서 부모 컴포넌트로 데이터를 전달**할 때, `$event`는 `EventEmitter`가 전달하는 값이 됩니다.

   ```typescript
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
   <app-child (messageEvent)="receiveMessage($event)"></app-child>
   ```

   ```typescript
   receiveMessage(message: string) {
     console.log(message); // 'Hello Parent!' 출력
   }
   ```

3. **`$event.target`을 이용한 입력값 가져오기**

   - `input`, `select` 같은 입력 요소에서 값이 변경될 때 `$event.target.value`를 사용하여 값을 가져올 수 있습니다.

   ```html
   <input (input)="onInputChange($event)">
   ```

   ```typescript
   onInputChange(event: Event) {
     const inputElement = event.target as HTMLInputElement;
     console.log(inputElement.value);
   }
   ```

---

### `$event`의 주요 특징

1. **DOM 이벤트 객체**
   - 일반적인 HTML 이벤트(예: `click`, `input`, `keydown`)에서는 `$event`가 해당 이벤트의 **Event 객체**를 포함합니다.
   - `MouseEvent`, `KeyboardEvent`, `InputEvent` 등 다양한 이벤트 타입이 있음.

2. **커스텀 이벤트에서 전달값**
   - `@Output()`으로 커스텀 이벤트를 정의한 경우, `$event`는 `emit()` 메서드의 인자가 됩니다.

3. **타입스크립트와 함께 사용 가능**
   - `$event`를 받을 때 명시적으로 타입을 지정하면 코드의 안정성이 올라갑니다.
   ```typescript
   onClick(event: MouseEvent) {
     console.log(event.clientX, event.clientY);
   }
   ```

---

### 결론

- `$event`는 Angular에서 이벤트 핸들러로 전달되는 **DOM 이벤트 객체** 또는 **커스텀 이벤트의 전달 값**입니다.

- 일반적인 이벤트 바인딩에서는 **JavaScript의 `Event` 객체**를 포함하며, `@Output`을 사용할 경우 `EventEmitter`가 전달하는 값이 `$event`가 됩니다.

- 타입을 지정하여 사용하면 더욱 안정적인 코드 작성이 가능합니다.