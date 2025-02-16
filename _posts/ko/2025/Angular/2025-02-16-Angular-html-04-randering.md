---
title: Angular - 4 -HTML 렌더링 순서
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
description: Angular 컴포넌트가 로드되고 HTML이 렌더링되는 과정
article_tag1: Angular
article_tag2: Framework
article_tag3: html
article_section: Angular
meta_keywords: Angular, html
last_modified_at: '2025-02-16 21:00:00 +0800'
---


Angular 애플리케이션이 실행될 때 **컴포넌트가 로드되고 HTML이 렌더링되는 과정**을 자세히 알아보겠습니다.

---

## ✅ **1. Angular 애플리케이션 부트스트랩 과정**
Angular 애플리케이션이 실행될 때 가장 먼저 수행되는 과정은 **부트스트랩(bootstrap)**입니다.

### 🔹 **1) `main.ts` 실행 (앱 시작)**
```typescript
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```
- `platformBrowserDynamic().bootstrapModule(AppModule)`을 호출하여 **앱을 실행**합니다.
- `AppModule`이 애플리케이션의 루트 모듈로 등록됩니다.

---

### 🔹 **2) `AppModule`에서 `AppComponent` 부트스트랩**
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],  // 컴포넌트 등록
  imports: [BrowserModule],      // Angular 필수 모듈 로드
  bootstrap: [AppComponent]      // AppComponent를 루트 컴포넌트로 설정
})
export class AppModule {}
```
- `bootstrap: [AppComponent]`에 의해 **앱이 실행되면 `AppComponent`가 HTML의 루트 컴포넌트가 됩니다.**
- 이때, **Angular는 `index.html`에서 `<app-root>` 태그를 찾아 `AppComponent`를 해당 태그에 렌더링합니다.**

---

## ✅ **2. HTML 렌더링 순서**
### 📌 **1) `index.html`에서 루트 컴포넌트 찾기**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Angular App</title>
</head>
<body>
  <app-root></app-root>  <!-- Angular가 이 태그를 찾아 `AppComponent`를 렌더링 -->
</body>
</html>
```
📌 **Angular는 `<app-root>` 태그를 찾고, 여기에 `AppComponent`를 렌더링합니다.**

---

### 📌 **2) `AppComponent`가 로드됨**
```typescript
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',  // index.html의 <app-root>에 매칭
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular App';
}
```
📌 **설명**
- `selector: 'app-root'` → `<app-root></app-root>` 태그와 매칭됨
- `templateUrl: './app.component.html'` → HTML 파일을 로드하여 화면을 구성

---

### 📌 **3) `app.component.html`이 렌더링됨**
```html
<h1>{{ title }}</h1>
<app-dashboard></app-dashboard>  <!-- 자식 컴포넌트 -->
```
📌 **설명**
- `{{ title }}` → **Interpolation(보간법)**을 통해 `title` 변수의 값이 `"Angular App"`으로 변환됨.
- `<app-dashboard></app-dashboard>` → **자식 컴포넌트(`AppDashboardComponent`)를 로드함.**

---

### 📌 **4) `AppDashboardComponent` 로드됨**
```typescript
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class AppDashboardComponent {
  message = 'Welcome to the Dashboard!';
}
```
📌 **설명**
- `<app-dashboard></app-dashboard>`가 **`AppDashboardComponent`와 연결됨**.
- `dashboard.component.html`을 읽고 렌더링함.

```html
<p>{{ message }}</p>
```
- `message = 'Welcome to the Dashboard!';` 값이 보간법(`{{ message }}`)을 통해 HTML에 표시됨.

---

## ✅ **3. 데이터 바인딩과 화면 업데이트 과정**
### Angular는 **데이터 바인딩과 변경 감지(Change Detection) 메커니즘**을 사용하여 화면을 렌더링합니다.

### 🔹 **1) 컴포넌트 클래스에서 데이터를 정의**
```typescript
export class ExampleComponent {
  name = 'Angular';  // 바인딩할 데이터
}
```

### 🔹 **2) 템플릿에서 보간법 사용**
```html
<h1>Welcome to {{ name }}</h1>
```
📌 **렌더링 결과**  
```html
<h1>Welcome to Angular</h1>
```

---

### 🔹 **3) 속성 바인딩 적용**
```html
<img [src]="imageUrl">
```
📌 **설명**
- `imageUrl`의 값이 변경되면 Angular가 즉시 `src` 속성을 업데이트함.

---

### 🔹 **4) 이벤트 바인딩 처리**
```html
<button (click)="changeMessage()">클릭</button>
<p>{{ message }}</p>
```

```typescript
export class ExampleComponent {
  message = '초기 메시지';

  changeMessage() {
    this.message = '버튼 클릭됨!';
  }
}
```
📌 **클릭 전**
```html
<p>초기 메시지</p>
```
📌 **클릭 후**
```html
<p>버튼 클릭됨!</p>
```
**Angular는 `changeMessage()`가 호출되면 `message`의 값을 업데이트하고 이를 화면에 반영합니다.**

---

## ✅ **4. Angular HTML 렌더링 순서 정리**

### 📌 **Angular가 HTML을 렌더링하는 과정**

| 단계 | 동작 |
|------|------|
| **1. 부트스트랩** | `main.ts`에서 `AppModule`을 실행 |
| **2. 루트 컴포넌트 찾기** | `index.html`의 `<app-root>` 태그를 찾아 `AppComponent`를 렌더링 |
| **3. 부모 컴포넌트 로드** | `AppComponent`가 실행되며 `app.component.html`을 렌더링 |
| **4. 자식 컴포넌트 로드** | `<app-dashboard>` 등 자식 컴포넌트를 찾아 렌더링 |
| **5. 데이터 바인딩 적용** | `{{ }}`, `[ ]`, `( )`, `[( )]` 등을 통해 데이터를 화면에 반영 |
| **6. Change Detection (변경 감지) 실행** | 데이터가 변경되면 자동으로 UI를 업데이트 |

---

## ✅ **5. 변경 감지(Change Detection)와 렌더링 업데이트**
Angular는 **Change Detection(변경 감지) 메커니즘**을 사용하여 데이터 변경이 발생하면 자동으로 화면을 업데이트합니다.

### 🔹 **변경 감지 과정**
1. **이벤트 발생 (예: 버튼 클릭)**
2. **컴포넌트의 데이터 변경 (`this.message = '새로운 메시지';`)**
3. **Angular의 변경 감지(Zone.js)가 데이터 변경을 감지**
4. **렌더링 엔진이 변경된 부분을 찾아 UI 업데이트**
5. **최종적으로 새로운 HTML이 반영됨**

---

## ✅ **결론**
Angular에서 **HTML이 렌더링되는 순서**는 다음과 같습니다:

1️⃣ **`main.ts` 실행 → `AppModule` 부트스트랩**  
2️⃣ **`index.html`에서 `<app-root>` 찾기 → `AppComponent` 렌더링**  
3️⃣ **`AppComponent` 내의 템플릿(`app.component.html`) 렌더링**  
4️⃣ **자식 컴포넌트(`AppDashboardComponent`)가 렌더링됨**  
5️⃣ **데이터 바인딩(`{{ }}`, `[ ]`, `( )`, `[( )]`) 적용됨**  
6️⃣ **이벤트 발생 시 변경 감지(Change Detection) → UI 업데이트**  