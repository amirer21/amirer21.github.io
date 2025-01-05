---
title: Angular - JavaScript 01 - 주요 문법
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
description: Angular - JavaScript 01 - 주요 문법
article_tag1: Angular
article_tag2: NodeJS
article_tag3: 
article_section: 
meta_keywords: Angular, NodeJS
last_modified_at: '2025-01-05 21:00:00 +0800'
---


Angular는 TypeScript로 작성된 프레임워크이지만, TypeScript는 JavaScript의 상위 집합으로 **JavaScript의 모든 핵심 문법**을 지원합니다. Angular 개발 시 이해해야 할 JavaScript의 주요 문법과 이를 Angular에서 사용하는 방식은 다음과 같습니다.

---

## **1. 변수 선언**
### **JavaScript 문법**
- **`let`과 `const`**:
  - `let`: 블록 스코프 변수.
  - `const`: 값이 변경되지 않는 상수.

#### **예제**
```javascript
let count = 0;
const maxCount = 10;
```

### **Angular 사용**
```typescript
export class AppComponent {
  title: string = 'Angular App'; // 변수 선언과 초기화
  readonly maxItems: number = 10; // const와 유사한 readonly
}
```

---

## **2. 함수**
### **JavaScript 문법**
- 일반 함수와 화살표 함수.

#### **일반 함수**
```javascript
function add(a, b) {
  return a + b;
}
```

#### **화살표 함수**
```javascript
const multiply = (a, b) => a * b;
```

### **Angular 사용**
```typescript
export class AppComponent {
  add(a: number, b: number): number {
    return a + b; // 일반 함수
  }

  multiply = (a: number, b: number): number => a * b; // 화살표 함수
}
```

---

## **3. 클래스**
### **JavaScript 문법**
- ES6 클래스 문법을 사용하여 객체 지향 프로그래밍(OOP) 가능.

#### **예제**
```javascript
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
}
```

### **Angular 사용**
- Angular 컴포넌트, 서비스, 모듈 등은 클래스 기반으로 작성.
```typescript
export class UserService {
  private users: string[] = [];

  addUser(user: string) {
    this.users.push(user);
  }

  getUsers(): string[] {
    return this.users;
  }
}
```

---

## **4. 비동기 처리**
### **JavaScript 문법**
- **`Promise`와 `async/await`**는 비동기 작업에서 중요.
- **`setTimeout`**, **`setInterval`** 등으로 비동기 작업 수행 가능.

#### **Promise**
```javascript
const fetchData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('Data loaded'), 1000);
  });
};
fetchData().then((data) => console.log(data));
```

#### **Async/Await**
```javascript
const fetchDataAsync = async () => {
  const data = await fetchData();
  console.log(data);
};
fetchDataAsync();
```

### **Angular 사용**
Angular에서 **RxJS의 Observable**과 함께 비동기 처리에 자주 사용됩니다.
```typescript
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}

  async ngOnInit() {
    const data = await this.http.get('https://api.example.com/data').toPromise();
    console.log(data);
  }
}
```

---

## **5. 배열 및 객체**
### **JavaScript 문법**
- 배열 메서드: `map`, `filter`, `reduce` 등.
- 객체 디스트럭처링과 스프레드 연산자.

#### **예제**
```javascript
const arr = [1, 2, 3];
const squares = arr.map(x => x * x);

const obj = { name: 'John', age: 30 };
const { name, age } = obj;

const newObj = { ...obj, city: 'New York' };
```

### **Angular 사용**
```typescript
export class AppComponent {
  users = ['Alice', 'Bob', 'Charlie'];
  userDetails = { name: 'Alice', age: 25 };

  getSquares(): number[] {
    return this.users.map((_, index) => index * index);
  }

  getUserDetails() {
    const { name, age } = this.userDetails;
    return `${name}, Age: ${age}`;
  }
}
```

---

## **6. 모듈과 가져오기/내보내기**
### **JavaScript 문법**
- **ES6 모듈**을 사용하여 파일 간 의존성 관리.

#### **예제**
**`math.js`**
```javascript
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
```

**`main.js`**
```javascript
import { add, multiply } from './math.js';
console.log(add(2, 3)); // 5
```

### **Angular 사용**
Angular는 파일 간 의존성을 관리하기 위해 **모듈**과 **컴포넌트**를 사용합니다.
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  imports: [BrowserModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

---

## **7. 템플릿 문자열**
### **JavaScript 문법**
- 백틱(```)을 사용하여 여러 줄 문자열이나 변수 삽입.

#### **예제**
```javascript
const name = 'Alice';
const greeting = `Hello, ${name}!`;
console.log(greeting); // Hello, Alice!
```

### **Angular 사용**
- 템플릿에서 데이터 바인딩 표현식에 사용.
```typescript
export class AppComponent {
  user = { name: 'Alice' };

  greet(): string {
    return `Hello, ${this.user.name}!`;
  }
}
```

---

## **8. 조건문 및 반복문**
### **JavaScript 문법**
- **`if` 조건문**과 **`for` 반복문**.
- **`for...of`**, **`for...in`** 구문.

#### **예제**
```javascript
const items = [1, 2, 3];
for (const item of items) {
  console.log(item);
}
```

### **Angular 사용**
- 템플릿에서 조건문과 반복문을 사용하려면 **디렉티브**가 필요.
```html
<div *ngIf="isVisible">Visible Content</div>
<ul>
  <li *ngFor="let user of users">{{ user }}</li>
</ul>
```

---

## **9. 객체 지향 프로그래밍(OOP)**
### **JavaScript 문법**
- 상속과 메서드 오버라이딩.

#### **예제**
```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a noise.`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks.`);
  }
}

const dog = new Dog('Rex');
dog.speak(); // Rex barks.
```

### **Angular 사용**
```typescript
export class Animal {
  constructor(public name: string) {}

  speak(): void {
    console.log(`${this.name} makes a noise.`);
  }
}

export class Dog extends Animal {
  speak(): void {
    console.log(`${this.name} barks.`);
  }
}
```

---

## **10. 기타 유용한 문법**
- **삼항 연산자**:
  ```javascript
  const isActive = true;
  const status = isActive ? 'Active' : 'Inactive';
  ```

  {% raw %}
  ```html
  <p>{{ isActive ? 'Active' : 'Inactive' }}</p>
  ```
  {% endraw %}
  
- **기본값 매개변수**:
  ```javascript
  const greet = (name = 'Guest') => `Hello, ${name}!`;
  console.log(greet()); // Hello, Guest!
  ```

---

### **Angular와 JavaScript**
Angular는 JavaScript의 모든 핵심 문법을 활용하며, TypeScript로 보강된 기능(엄격한 타입 검사, 인터페이스 등)을 제공합니다.  
JavaScript의 문법을 이해하면 Angular의 템플릿, 컴포넌트, 서비스 등에서 활용하기 쉬워집니다.
