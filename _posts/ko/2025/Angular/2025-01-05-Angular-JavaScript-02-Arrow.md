---
title: Angular - JavaScript 02 - 화살표 함수(Arrow Function)
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
description: Angular - JavaScript 02 - 화살표 함수(Arrow Function)
article_tag1: Angular
article_tag2: NodeJS
article_tag3: 
article_section: 
meta_keywords: Angular, NodeJS
last_modified_at: '2025-01-05 21:00:00 +0800'
---


### **`=>` 화살표(Arrow Function)**

`=>`는 **JavaScript의 화살표 함수(Arrow Function)**를 정의하는 문법입니다.  
화살표 함수는 간결한 함수 표현식으로, 특히 **콜백 함수**를 작성할 때 자주 사용됩니다.

---

## **1. 기본 문법**

### **일반 함수 표현식과 화살표 함수의 비교**
```javascript
// 일반 함수 표현식
const add = function (a, b) {
    return a + b;
};

// 화살표 함수
const add = (a, b) => a + b;
```

### **특징**
1. **간결한 문법**:
   - 화살표 함수는 코드가 간결하며, 특히 한 줄짜리 함수에서 유용.
2. **`this` 바인딩의 변경**:
   - 화살표 함수는 `this`를 **외부 컨텍스트**(상위 스코프)로 고정.

---

## **2. 화살표 함수의 동작 원리**

### **문법 형식**
```javascript
(parameter1, parameter2, ...) => expression
```

- **매개변수(parameter1, parameter2, ...)**: 함수에 전달된 입력값.
- **`=>`**: 화살표 함수 선언.
- **표현식(expression)**: 함수의 반환값(중괄호 없이 작성 시 암시적으로 반환).

### **예제**
1. **한 줄 표현식 (암시적 반환)**:
   ```javascript
   const multiply = (a, b) => a * b; // 결과를 반환
   console.log(multiply(2, 3)); // 6
   ```

2. **여러 줄 표현식 (명시적 반환)**:
   ```javascript
   const multiply = (a, b) => {
       const result = a * b;
       return result; // 명시적 반환
   };
   ```

3. **매개변수가 없는 경우**:
   ```javascript
   const greet = () => 'Hello, World!';
   console.log(greet()); // Hello, World!
   ```

4. **매개변수가 하나인 경우**:
   - 괄호를 생략할 수 있음.
   ```javascript
   const square = x => x * x;
   console.log(square(4)); // 16
   ```

---

## **3. 화살표 함수의 특징**

### **(1) `this`의 바인딩**
화살표 함수는 **`this`를 외부 컨텍스트(상위 스코프)의 `this`에 바인딩**합니다.  
일반 함수와 비교하여 `this` 동작이 다릅니다.

#### **일반 함수의 `this`**
- `this`는 함수가 호출될 때 **동적으로 결정**됩니다.
```javascript
function NormalFunction() {
    console.log(this); // 호출 컨텍스트에 따라 달라짐
}
```

#### **화살표 함수의 `this`**
- 화살표 함수의 `this`는 선언 당시의 상위 스코프의 `this`에 **고정**됩니다.
```javascript
const obj = {
    value: 42,
    normalFunc: function () {
        return function () {
            console.log(this.value); // undefined (동적 바인딩)
        };
    },
    arrowFunc: function () {
        return () => {
            console.log(this.value); // 42 (상위 스코프의 this 사용)
        };
    },
};

obj.normalFunc()(); // undefined
obj.arrowFunc()(); // 42
```

---

### **(2) 콜백 함수에서의 활용**
화살표 함수는 **`this`를 상위 스코프에 고정**하므로, 콜백 함수에서 자주 사용됩니다.

#### **예제: 일반 함수의 문제**
```javascript
function Timer() {
    this.seconds = 0;
    setInterval(function () {
        this.seconds++; // `this`는 setInterval의 컨텍스트를 참조 (문제 발생)
    }, 1000);
}

const timer = new Timer(); // TypeError 발생
```

#### **해결: 화살표 함수 사용**
```javascript
function Timer() {
    this.seconds = 0;
    setInterval(() => {
        this.seconds++; // `this`는 Timer 객체를 참조
    }, 1000);
}

const timer = new Timer();
```

---

## **4. `saveUser` 함수에서의 화살표 함수**
```typescript
saveUser() {
    this.userService.saveUser(this.user).subscribe(() => {
        this.getUsers();  // 저장 후 사용자 목록 갱신
    });
}
```

- **`(() => { ... })`**:
  - 비동기 작업의 콜백으로 사용된 화살표 함수.
  - `this`는 상위 스코프(컴포넌트 클래스)의 `this`로 고정.

#### **장점**
1. **`this` 고정**:
   - 화살표 함수 내부에서 호출된 `this.getUsers()`는 컴포넌트의 메서드를 정확히 참조.
   - 일반 함수로 작성 시 `this`가 바뀌어 오류 발생 가능.
2. **간결한 문법**:
   - 한 줄의 작업에서 유용하며 가독성이 향상.

---

## **5. 요약**
- **`=>` 화살표 함수**는 함수 표현식을 간결하게 작성하며, 특히 **`this`를 외부 컨텍스트로 고정**하는 데 유용.
- Angular에서 화살표 함수는 **RxJS Observable의 콜백 처리** 또는 **비동기 작업**에서 자주 사용됩니다.  
- 일반 함수와 비교해 가독성과 유지보수성이 뛰어납니다.  
