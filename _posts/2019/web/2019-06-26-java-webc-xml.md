---
title: Java web.xml 구조 및 설정 방법
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Web
toc: true
toc_sticky: true
toc_label: 목차
description: Java web.xml 구조 및 설정 방법
article_tag1: web.xml
article_tag2: java
article_tag3: 
article_section:  
meta_keywords: web.xml, java
last_modified_at: '2019-06-26 10:00:00 +0800'
---

## 1.	web.xml 개념 및 역할

### 개념 : web application의 설정을 위한 deployment descriptor
### 역할 :  Deploy할 때 Servlet의 정보를 설정해준다.

브라우저가 Java Servlet에 접근하기 위해서는 WAS(Ex. Tomcat)에 필요한 정보를 알려줘야 해당하는 Servlet을 호출할 수 있다.
- 정보 1) 배포할 Servlet이 무엇인지
- 정보 2) 해당 Servlet이 어떤 URL에 매핑되는지

## 2.	web.xml 설정 

### (1)	aliases 설정

서블릿 이름을 실제 서블릿 클래스에 연결
```
<servlet-name>welcome</servlet-name>
```
매핑 설정(2) 에서의 servlet-name은 반드시 같아야 한다.

```
<servlet-class>servlets.WelcomeServlet</servlet-class>
```
은 개발자에 의해 작성된 실제 클래스 이름으로 설정해야 한다.
Ex. (패키지 이름).(서블릿 클래스 이름)

### (2)	매핑
URL을 서블릿 이름에 연결
```
<url-pattern>/welcome</url-pattern>
```
은 클라이언트(browser)의 요청 URL에서 앱(프로젝트) 이름 뒤에 오는 부분으로, 슬래시('/')로 시작해야 한다.
참고 클라이언트(browser)가 요청하는 URL 정보

> 요청을 보낼 서버의 IP 주소 : Port 번호 / App 이름 / 달라고 요청하는 HTML

> localhost:8080/FormHandlingServlet/LoginForm.html

