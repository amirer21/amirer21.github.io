---
title: Angular - 컴포넌트(Component) 데코레이터란?
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Angular
tags:
- Angular
- Component
- Typescript
toc: true
toc_sticky: true
toc_label: 목차
description: Angular 컴포넌트(Component) 기본 구조 및 주요 속성
article_tag1: Angular
article_tag2: Component
article_tag3: Typescript
article_section: Angular
meta_keywords: Angular, Component, Typescript
last_modified_at: '2025-02-16 21:00:00 +0800'
---


## 🔹 **`@Component()` 데코레이터 상세 설명**

`@Component()` 데코레이터는 **Angular에서 컴포넌트를 정의하는 핵심 데코레이터**입니다.  
이 데코레이터는 클래스에 메타데이터를 추가하여 **Angular가 해당 클래스를 컴포넌트로 인식하고 사용할 수 있도록 합니다.**  

---

## 🔹 **1. `@Component()`의 기본 구조**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-example', // 1️⃣ 컴포넌트의 커스텀 태그 정의
  templateUrl: './example.component.html', // 2️⃣ HTML 템플릿 파일 연결
  styleUrls: ['./example.component.scss'], // 3️⃣ 스타일 파일 연결
})
export class ExampleComponent {
  title = 'Hello Angular'; // 4️⃣ 컴포넌트의 변수 정의
}
```

✅ **설명**  
- `@Component()`는 컴포넌트 클래스를 선언할 때 **반드시 필요**한 데코레이터입니다.  
- 내부의 객체(메타데이터)에서 다양한 옵션을 설정할 수 있습니다.

---

## 🔹 **2. `@Component()`의 주요 속성들**

| 속성 | 설명 |
|------|------|
| **`selector`** | 컴포넌트의 태그 이름을 지정 |
| **`template`** | 컴포넌트의 HTML을 직접 정의 |
| **`templateUrl`** | 외부 HTML 파일을 연결 |
| **`styles`** | 컴포넌트의 CSS 스타일을 직접 작성 |
| **`styleUrls`** | 외부 CSS/SCSS 파일을 연결 |
| **`providers`** | 컴포넌트에서 사용할 서비스 제공자 설정 |
| **`animations`** | Angular 애니메이션 정의 |

---

## 🔹 **3. `@Component()` 속성별 상세 설명**
### ✅ **1) `selector` (컴포넌트의 태그명)**
```typescript
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
```
📌 **설명:**  
- `selector: 'app-dashboard'`는 `<app-dashboard></app-dashboard>` 라는 **커스텀 태그를 사용할 수 있도록 지정**합니다.
- 다른 HTML 파일에서 `<app-dashboard></app-dashboard>`를 사용하면 이 컴포넌트가 렌더링됩니다.

---

### ✅ **2) `template` (HTML 템플릿 직접 작성)**
```typescript
@Component({
  selector: 'app-inline',
  template: `<h1>인라인 템플릿 사용</h1>`,
})
```
📌 **설명:**  
- `template` 속성을 사용하면 별도의 HTML 파일 없이 **직접 HTML을 작성**할 수 있습니다.
- 단, **HTML 코드가 길어지면 가독성이 떨어지므로 `templateUrl`을 사용하는 것이 좋습니다.**

---

### ✅ **3) `templateUrl` (외부 HTML 파일 연결)**
```typescript
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
```
📌 **설명:**  
- `templateUrl`은 **외부 HTML 파일을 컴포넌트의 템플릿으로 사용**할 수 있습니다.
- Angular는 지정된 HTML 파일을 불러와 **뷰를 생성**합니다.

---

### ✅ **4) `styles` (인라인 스타일 작성)**
```typescript
@Component({
  selector: 'app-inline-style',
  template: `<h1>인라인 스타일 사용</h1>`,
  styles: ['h1 { color: red; font-size: 20px; }']
})
```
📌 **설명:**  
- `styles` 속성을 사용하면 **컴포넌트에 대한 CSS를 직접 작성**할 수 있습니다.
- 여러 개의 스타일을 배열로 넣을 수도 있습니다.
- **단, 유지보수가 어렵기 때문에 보통 `styleUrls`을 사용합니다.**

---

### ✅ **5) `styleUrls` (외부 스타일 파일 연결)**
```typescript
@Component({
  selector: 'app-styled',
  templateUrl: './styled.component.html',
  styleUrls: ['./styled.component.scss']
})
```
📌 **설명:**  
- `styleUrls`은 **외부 CSS/SCSS 파일을 연결**하는 속성입니다.
- 여러 개의 스타일 파일을 적용할 수도 있습니다.

---

### ✅ **6) `providers` (서비스 제공자 설정)**
```typescript
@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  providers: [MyService] // 서비스 제공
})
```
📌 **설명:**  
- `providers`는 **해당 컴포넌트에서 사용할 서비스를 등록**하는 속성입니다.
- 여기에서 등록된 서비스는 **이 컴포넌트 및 자식 컴포넌트에서만 사용**할 수 있습니다.

---

### ✅ **7) `animations` (애니메이션 설정)**
```typescript
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-animated',
  templateUrl: './animated.component.html',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 }))
      ])
    ])
  ]
})
```
📌 **설명:**  
- `animations` 속성을 사용하면 Angular 애니메이션을 정의할 수 있습니다.
- `@angular/animations` 모듈과 함께 사용됩니다.

---

## 🔹 **4. `@Component()`를 활용한 실전 예제**
### ✅ **컴포넌트 코드 (`example.component.ts`)**
```typescript
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent {
  @Input() title: string = '기본 제목';
}
```

### ✅ **템플릿 코드 (`example.component.html`)**
```html
<h1>{{ title }}</h1>
```

### ✅ **부모 컴포넌트에서 사용**
```html
<app-example [title]="'Angular 컴포넌트 이해하기'"></app-example>
```
📌 **결과:**  
```html
<h1>Angular 컴포넌트 이해하기</h1>
```
✅ `@Input()` 데코레이터를 사용하여 **부모 컴포넌트에서 데이터를 받아 화면에 표시**합니다.

---

## 🔹 **5. `@Component()` 데코레이터의 전체적인 동작 순서**
1️⃣ **Angular 애플리케이션이 실행되면** `main.ts`에서 `AppModule`이 로드됨  
2️⃣ `AppModule` 내의 `declarations`에 등록된 모든 컴포넌트가 초기화됨  
3️⃣ HTML 내에서 `selector`와 일치하는 커스텀 태그를 찾음 (`<app-example>`)  
4️⃣ 해당 컴포넌트의 **템플릿(`templateUrl`)과 스타일(`styleUrls`)을 로드**함  
5️⃣ `@Input()`과 같은 **바인딩이 적용**되어 데이터가 화면에 표시됨  
6️⃣ 최종적으로 **렌더링이 완료**되고 사용자의 입력을 대기함  

---

## 🔹 **📌 결론**
| 개념 | 설명 |
|------|------|
| **`@Component()`** | Angular에서 **컴포넌트를 정의하는 핵심 데코레이터** |
| **`selector`** | HTML에서 사용할 **커스텀 태그 이름** 설정 |
| **`template` vs `templateUrl`** | 직접 HTML 작성 vs **외부 파일 사용 (추천)** |
| **`styles` vs `styleUrls`** | 직접 CSS 작성 vs **외부 CSS 파일 사용 (추천)** |
| **`providers`** | **컴포넌트에서 사용할 서비스 등록** |
| **`animations`** | **Angular 애니메이션 정의** |

`@Component()`는 **Angular에서 UI를 구성하는 기본 단위**이며, 위의 속성들을 활용하면 **동적이고 재사용 가능한 컴포넌트**를 만들 수 있습니다.