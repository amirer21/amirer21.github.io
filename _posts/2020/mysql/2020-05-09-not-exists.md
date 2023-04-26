---
title: 데이터가 없는지 확인해서 값 넣기
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- MySQL
toc: true
toc_sticky: true
toc_label: 목차
description: 데이터가 없는지 확인해서 값 넣기
article_tag1: MySQL
article_tag2: EXISTS
article_tag3: query
article_section:  
meta_keywords: MySQL, EXISTSm, query
last_modified_at: '2020-05-09 10:00:00 +0800'
---


## 데이터가 없는지 확인해서 값 넣기

###	데이터 기본 입력

> INSERT INTO user_table(user_name, user_address) VALUES(3, 'seoul');

###	데이터 없는 경우만 입력

#### (1) 형식

> INSERT INTO table (field)  SELECT 'value' FROM DUAL  
WHERE NOT EXISTS (SELECT * FROM table WHERE field='value')  

여기에서 DUAL은 가상의 테이블이다. 

**WHERE NOT EXISTS : 존재하지 않으면**

#### (2) 성공한 쿼리

> INSERT INTO user_table(user_name, user_address) SELECT 5, 'seoul' FROM DUAL
WHERE NOT EXISTS (SELECT user_address FROM user_table WHERE user_address='seoul');

### 테이블

> CREATE TABLE `user_table` (
`user_name` INT(20) NULL DEFAULT NULL COMMENT 'URL 일련번호',
`user_address` VARCHAR(100) NULL DEFAULT NULL COMMENT 'URL 주소',
UNIQUE INDEX `user_name` (`user_name`))