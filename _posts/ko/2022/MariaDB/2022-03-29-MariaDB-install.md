---
title: AWS EC2 MariaDB & PHP 설치
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- MariaDB
tags:
- MariaDB
- PHP
toc: true
toc_sticky: true
toc_label: 목차
description: AWS EC2 MariaDB & PHP 설치
article_tag1: MariaDB
article_tag2: PHP
article_tag3: AWS
article_section: MariaDB
meta_keywords: MariaDB, PHP, AWS
last_modified_at: '2022-03-29 14:00:00 +0800'
---

## AWS EC2에 MariaDB서버 설치하고 인바운드 설정까지

세부적으로 MariaDB에서 비밀번호, 외부접속, 로그 설정하는 방법을 설명한다.

### 순서 
1.	php 설치
2.	mariaDB 설치
3.	사용자 비밀번호 설정
4.	외부접속 설정
5.	AWS 인바운드 규칙 편집

### 1. php

 php 설치할때 필요한 모듈도 추가적으로 설치한다.

> apt-get install php7.4-cli php7.4-fpm php7.4-bcmath php7.4-bz2 php7.4-common php7.4-curl php7.4-dba php7.4-gd php7.4-json php7.4-mbstring php7.4-opcache php7.4-readline php7.4-soap php7.4-xml php7.4-xmlrpc php7.4-zip php7.4-ctype php7.4-pdo php7.4-redis php7.4-mysql php7.4-imagick php7.4-intl php7.4-mbstring

### 2. mariaDB 설치

#### (1) mariadb-server 설치

>apt install mariadb-server

(mysql로 설치하고 mariadb를 설치하면 충돌이 발생해서 에러가 발생할 수 있다. 따라서, mariadb로 설치할 것)

#### (2) mariadb 원격 접속 설정

root 원격접속 허용하지 않습니까? 

원격접속 허용을 위해 n으로 설정

> mysql_secure_installation

 ![img](/assets/images/mariadb/mariadb1.png "mariadb")


### 3. 비밀번호 설정

#### (1) 비밀번호 설정 및 변경

> mysql –u root –p 비밀번호
 
 ![img](/assets/images/mariadb/mariadb2.png "mariadb")

#### (2) mysql db선택
 
 ![img](/assets/images/mariadb/mariadb3.png "mariadb")

> use mysql

#### (3) 사용자 비밀번호 설정

> update user set password=password('변경하려는비밀번호') where user='사용자명';

> update user set password=password('test2022@') where user='root';

#### (4) 비밀번호 변경

비밀 번호를 수정한다면 아래 명령어로 변경한다.

> SET PASSWORD FOR '사용자명'@'localhost' = '수정하려는비밀번호';


#### (5) 계정권한부여(외부접속) 및 비밀번호 설정
 
 ![img](/assets/images/mariadb/mariadb4.png "mariadb")

> GRANT ALL PRIVILEGES ON *.* to 'root'@'%' IDENTIFIED BY '비밀번호';

![img](/assets/images/mariadb/mariadb5.png "mariadb")

> FLUSH PRIVILEGES;

### 4. 외부접속 설정

#### (1) mariaDB 파일 설정 경로
![img](/assets/images/mariadb/mariadb6.png "mariadb")

#### (2) 파일 선택 50-server.cnf
![img](/assets/images/mariadb/mariadb7.png "mariadb")

#### (3) bind-address

127.0.0.1을 0.0.0.0으로 변경하거나 주석처리

![img](/assets/images/mariadb/mariadb8.png "mariadb")
 
#### (4)  mysql 로그 설정
MySQL 실행 시 쿼리 실행 내용, 에러 내용 확인을 위해서 로그에 대해 설정한다.

![img](/assets/images/mariadb/mariadb9.png "mariadb")

- general 로그 설정 확인
> mysql> show variables like 'general%';

- general 로그 사용으로 변경
> mysql> set global general_log = ON;

- general 로그 파일 위치 설정
> mysql> set global general_log_file = '/var/lib/mysql/mysql-query.log';


## 5. AWS 인바운드 규칙 편집

mysql 포트(3306) 추가하고 접근 사용자 IP 설정를 설정한다.
 
![img](/assets/images/mariadb/mariadb10.png "mariadb")
