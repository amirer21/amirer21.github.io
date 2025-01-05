---
title: Angular - SCSS 프로젝트 기반 Angular 데이터 바인딩 01 - 프론트엔드에서 DB까지 데이터 흐름 이해
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
description: Angular - SCSS 프로젝트 기반 Angular 데이터 바인딩 01 - 프론트엔드에서 DB까지 데이터 흐름 이해
article_tag1: Angular
article_tag2: NodeJS
article_tag3: 
article_section: 
meta_keywords: Angular, NodeJS
last_modified_at: '2025-01-05 21:00:00 +0800'
---


### **Angular 프로젝트에서 백엔드 데이터베이스(DB)와의 데이터 흐름 프로세스**

이 문서는 **Angular 프론트엔드부터 데이터베이스까지 데이터가 전달되고 처리되는 전체 흐름**을 설명합니다. 백엔드 서버는 **Node.js/Express**를 사용하며, 데이터베이스는 **MySQL**로 설정된 예제를 다룹니다.

---

## **1. 데이터 흐름: 프론트엔드에서 데이터베이스까지**

1. **프론트엔드 (Angular)**  
   - 사용자가 입력한 데이터를 템플릿에서 컴포넌트로 전달.  
   - 컴포넌트는 서비스를 통해 데이터를 백엔드로 전송.  

2. **백엔드 서버 (Node.js/Express)**  
   - 백엔드는 Angular에서 받은 데이터를 처리하여 데이터베이스와 상호작용.  
   - 데이터베이스에서 데이터를 읽거나 쓰는 작업 수행.  

3. **데이터베이스 (MySQL)**  
   - 백엔드가 SQL 쿼리 또는 ORM(Object-Relational Mapping)을 사용하여 데이터베이스와 통신.  
   - 결과를 백엔드로 반환.  

4. **응답**  
   - 백엔드가 처리된 데이터를 Angular로 응답.  
   - Angular는 데이터를 컴포넌트와 템플릿에 바인딩하여 UI에 표시.  

---

## **2. 데이터 흐름과 파일별 역할**

### **(1) 프론트엔드: Angular 템플릿 (`.html`)**
HTML 템플릿은 데이터 바인딩을 통해 사용자 입력과 화면 표시를 제어합니다.

#### **템플릿 예제**
```html
<!-- 사용자 입력 -->
<input [(ngModel)]="user.name" placeholder="Enter Name">
<button (click)="saveUser()">Save</button>

<!-- 데이터 출력 -->
<ul>
  <li *ngFor="let user of users">{{ user.name }}</li>
</ul>
```
- **`[(ngModel)]`**: 양방향 데이터 바인딩.  
- **`*ngFor`**: 배열 데이터를 순회하며 리스트를 생성.

---

### **(2) 프론트엔드: Angular 컴포넌트 (`.ts`)**
Angular 컴포넌트는 프론트엔드 로직을 처리하고 서비스를 통해 백엔드와 통신합니다.

#### **컴포넌트 예제**
```typescript
import { Component } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  user = { name: '' };  // 사용자 입력 데이터
  users: any[] = [];    // 백엔드에서 받은 데이터

  constructor(private userService: UserService) {}

  // 사용자 저장
  saveUser() {
    this.userService.saveUser(this.user).subscribe(() => {
      this.getUsers();  // 저장 후 사용자 목록 갱신
    });
  }

  // 사용자 목록 가져오기
  getUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.users = data;
    });
  }
}
```
- **`user` 변수**: 사용자 입력을 저장하는 객체.  
- **`saveUser` 메서드**: 사용자 데이터를 백엔드로 전송.  
- **`getUsers` 메서드**: 사용자 목록을 백엔드에서 가져옴.

---

### **(3) 프론트엔드: Angular 서비스 (`.ts`)**
Angular 서비스는 HTTP 요청을 통해 백엔드와 데이터를 주고받는 역할을 합니다.

#### **서비스 예제**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // 백엔드 엔드포인트

  constructor(private http: HttpClient) {}

  // 사용자 데이터 저장
  saveUser(user: any): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  // 사용자 목록 가져오기
  getUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
```
- **`saveUser`**: 사용자 데이터를 백엔드에 전송.  
- **`getUsers`**: 백엔드에서 사용자 목록을 가져옴.

---

### **(4) 백엔드: Node.js/Express**
백엔드 서버는 Angular에서 받은 요청을 처리하고 데이터베이스와 통신합니다.

#### **백엔드 예제**
```javascript
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
app.use(bodyParser.json());

// MySQL 데이터베이스 연결
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'testdb'
});

// 사용자 데이터 저장
app.post('/api/users', (req, res) => {
  const { name } = req.body;
  const sql = 'INSERT INTO users (name) VALUES (?)';
  db.query(sql, [name], (err) => {
    if (err) throw err;
    res.status(201).send('User added');
  });
});

// 사용자 목록 가져오기
app.get('/api/users', (req, res) => {
  const sql = 'SELECT * FROM users';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

// 서버 실행
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```
- **`POST /api/users`**: 데이터베이스에 새로운 사용자 추가.  
- **`GET /api/users`**: 데이터베이스에서 사용자 목록 가져오기.  

---

### **(5) 데이터베이스 (MySQL)**

#### **테이블 생성**
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);
```

---

## **3. 데이터 흐름 요약**

1. **사용자 입력**:
   - Angular 템플릿에서 사용자 입력을 받아 `user.name` 변수에 저장.
2. **HTTP 요청**:
   - Angular 서비스가 데이터를 백엔드 서버로 전송 (`POST`) 또는 데이터를 요청 (`GET`).
3. **백엔드 처리**:
   - Express 서버가 데이터를 데이터베이스에 저장하거나 조회.
4. **데이터베이스 작업**:
   - 저장 요청: 데이터베이스에 새로운 레코드 추가.  
   - 조회 요청: 데이터베이스에서 데이터를 가져옴.
5. **응답**:
   - 백엔드가 처리된 데이터를 Angular로 반환.
   - Angular가 데이터를 템플릿에 바인딩하여 화면에 표시.

---

## **4. SCSS로 UI 스타일링**

#### **SCSS 파일 (`app.component.scss`)**
```scss
.container {
  max-width: 600px;
  margin: 0 auto;

  input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
  }

  button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: darken(#007bff, 10%);
    }
  }

  ul {
    list-style: none;
    padding: 0;

    li {
      padding: 10px;
      border-bottom: 1px solid #ccc;
    }
  }
}
```

---

### **결론**
이 프로세스는 Angular와 백엔드(Node.js/Express), 그리고 데이터베이스(MySQL) 간의 데이터 흐름을 효율적으로 연결합니다. 각 단계에서 데이터가 어떻게 처리되고 전달되는지 명확히 이해하고, 이를 기반으로 프로젝트를 확장할 수 있습니다.  
