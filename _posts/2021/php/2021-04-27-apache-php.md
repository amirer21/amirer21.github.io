---
title: Ubuntu 18.04 apache2, php, mysql 설치
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- PHP
toc: true
toc_sticky: true
toc_label: 목차
description: PHP
article_tag1: Apache
article_tag2: php
article_tag3: mysql
article_section:  
meta_keywords: Apache, php, mysql, ubuntu
last_modified_at: '2021-04-27 10:00:00 +0800'
---

# Ubuntu 18.04 apache2, php, mysql 설치


## 1. Apache 설치

> sudo apt install apache2

---------------------------
## 2. PHP 설치

Ubuntu 18.04 php 8.1은 아래 참조

### (1)	우분투 시스템 업데이트
> sudo apt update && sudo apt -y upgrade
> sudo systemctl reboot

### (2)	레포지토리 추가
> sudo apt update
> sudo apt install lsb-release ca-certificates apt-transport-https > software-properties-common -y
> sudo add-apt-repository ppa:ondrej/php

### (3)	php 8.1 설치
> sudo apt install php8.1

### (4)	php 모듈 추가 (mysql, mbsting등 필요한 것들을 설치해야 php 구동이 잘된다.)
> sudo apt install php8.1-<extension>

https://computingforgeeks.com/how-to-install-php-on-ubuntu-linux-system/

### 이전에 설치방법
> apt-get update <br>
> apt-get -y install software-properties-common <br>
> add-apt-repository ppa:ondrej/php <br>
> apt-get update

### 버전에 맞는 모듈 설치

아래는 7.4라고 되어있는데 php 버전에 맞춰서 모두 변경하여 실행할 것.

```ubuntu
apt-get install php7.4-cli php7.4-fpm php7.4-bcmath php7.4-bz2 php7.4-common php7.4-curl php7.4-dba php7.4-gd php7.4-json php7.4-mbstring php7.4-opcache php7.4-readline php7.4-soap php7.4-xml php7.4-xmlrpc php7.4-zip php7.4-ctype php7.4-pdo php7.4-redis php7.4-mysql php7.4-imagick php7.4-intl
```

https://ncube.net/ubuntu-18-04-%EC%84%9C%EB%B2%84-php-7-4-%EC%A0%81%EC%9A%A9/

> sudo apt-get install php8.1-mbstring

### 에러발생
소스 코드가 그대로 출력이되었는데
일단 위와 같이 모듈만 설치되어서 그랬던 것 같다…

### 해결
> apt install php

> sudo apt-get install -y php7.4 (2022.02.08 추가)

로 다시 설치하였다.

### 모듈 설치

버전은 최신버전 8.0대로 바뀌었지만 진행하려는 프로젝트에는 상관없을 듯하여 그대로 진행한다.아래 모듈들도 추가로 설치하였다.

다국어 처리모듈
> apt install php-mbstring
- 이미지 처리모듈
> apt install php-gd
- 원격지 정보 불러는 모듈 (워드프레스 등에서 쓰임)
> apt install php-curl php-xml
- 수학 연산 확장 모듈
> apt install php-bcmath
- OAuth 인증 모듈 (클라우드 API 등 연동서비스에서 쓰임)
> apt install php-oauth
- MySQL 연동 모듈 (mysqli, pdo-mysql 관련 함수를 사용할 수 있게됨)
> apt install php-mysql
- Composer 설치 (PHP 패키지 의존성 관리 프로그램)
> apt install composer


https://blog.lael.be/post/7264

나중에는 아래 참고하여 설치하여 보자
> sudo apt -y install php7.4

https://computingforgeeks.com/how-to-install-php-on-ubuntu/

### 수동설치시 참고

수동설치할 때 아래와 같이 해보자

> Cd /usr/local <br>
> Wget http://...php-7.4.1.tar.gz <br>
> Tar xzvf php-7.4.1.tar.gz	

참고 : https://soobarkbar.tistory.com/218

---------------------------
# 3. Apache 설정

## (1) php 접속 경로 수정하기

> sudo nano /etc/apache2/apache2.conf

```conf
<Directory /var/www/html/phpblog>
        Options Indexes FollowSymLinks
        AllowOverride None
        Require all granted
</Directory>
```

> sudo nano /etc/apache2/sites-available/000-default.conf

```conf
DocumentRoot /var/www/html/phpblog
```

참고 : https://m.blog.naver.com/yexx/220720241912


## (2) bind address 설정
> cd /etc/mysql/mysql.conf.d/mysqld.cnf 파일에서 수정한다.
```
bind-address = 0.0.0.0 으로 변경
```

## (3) php.ini 설정 확인
경로는 phpinfo()? 로 출력해서 위치 확인
> /etc/php/8.0/apache2/php.ini


---------------------------
# 4. mysql 설치

## (1) 클라이언트 설치 - 외부 DB를 사용하든 안하든 설치한다.
> apt install mysql-client

이유 : 위의 패키지는 콘솔 환경에서도 mysql 명령어를 사용할 수 있게 된다.

## (2) MySQL 서버 설치

> apt install mysql-server

> sudo /usr/bin/mysql_secure_installation

설치 시 선택 기본값이 NO 이므로 확인하여 y 를 입력하자.
모두 y, password strength 는 0, 비밀번호 입력

참고 : https://blog.lael.be/post/7264

## (3) 사용자 추가 및 비번 변경 

> create user '(사용자 계정명)'@'%' identified by '(비밀번호)';
설명 : @ 뒤의 '%'는 사용자 계정을 허용하는 접속 IP 이다.

> grant all privileges on *.* to '(사용자계정명)'@'%';

참고 : https://sosobaba.tistory.com/218


### DB foreign key 추가
이 프로젝트에서는 DB에서 Foreign key를 추가하는 부분이 있는데
이부분은 mysql cli에서 아래 명령어로 변경했다.
키추가 명령어 : 
> ALTER TABLE posts ADD FOREIGN KEY(id) REFERENCES users(id);

>sudo mysql
>use phpblog
>ALTER TABLE posts ADD FOREIGN KEY(user_id) REFERENCES users(id);
 

## php 테스트

> <?php phpinfo(); ?>

### php 프로젝트 구동시 에러 발생 확인을 위한 로그 실시간 출력하기

Apache의 에러 로그파일을 실시간으로 출력한다.

> tail -f /var/log/apache2/error.log


## 폴더 권한 부여 명령어

### 폴더에 사용자 변경
> chown Ubuntu:Ubuntu ./파일 또는 폴더

```ubuntu
chmod 
읽기 : r 4
쓰기 : w 2
실행 : x 1
```

> sudo chmod –R 755 ./파일 또는 폴더

참고 : https://lookingfor.tistory.com/entry/%EB%A6%AC%EB%88%85%EC%8A%A4-%ED%8F%B4%EB%8D%94-%ED%8C%8C%EC%9D%BC-%EA%B6%8C%ED%95%9C-%EB%B6%80%EC%97%AC-%EB%AA%85%EB%A0%B9%EC%96%B4-chmod-chown

이미지 등록할 때 파일 업로드가 안되는 이슈가 발생한다.
해당 폴더에 권한이 없기때문
일단,

> sudo chmod –R 777 모든권한부여

#

php –ini 에서 
```ini
session.use.strict_mode =1
session.use_cookies =1
session.use_only_cookies =1
session.cookie_httponly = 1
```
모두 켜줄 것

### php 윈도우 실행?
> php –s localhost:8080
