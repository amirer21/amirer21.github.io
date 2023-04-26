---
title: MySQL 비밀번호 변경 방법
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
description: MySQL - how to change password
article_tag1: MySQL
article_tag2: password
article_tag3: 
article_section:  
meta_keywords: MySQL, password
last_modified_at: '2021-06-30 10:00:00 +0800'
---

## mysql 비밀번호 변경 방법

### jdbc 에러발생
 ```java
java.sql.SQLException: Access denied for user 'root'@'ip.address.xx.xx' (using password: YES)

ERROR 1698 (28000): Access denied for user 'root'@'localhost'
```
### root 비밀번호를 바꿔보자.

우선 mysql 접속

> mysql> UPDATE mysql.user SET authentication_string=PASSWORD('1234') WHERE user='root' AND Host='localhost';

에러 발생(변경하려는 비밀번호가 현재 조건에 안맞는다고 한다.)
```php
ERROR 1819 (HY000): Your password does not satisfy the current policy requirements
```
현재 비밀번호 조건을 확인하고 조건을 수정하자
 

### 비밀번호 조건확인
> mysql> SHOW VARIABLES LIKE 'validate_password%';

+--------------------------------------+--------+
| Variable_name                        | Value  |
+--------------------------------------+--------+
| validate_password_check_user_name    | OFF    |
| validate_password_dictionary_file    |        |
| validate_password_length             | 8      |
| validate_password_mixed_case_count   | 1      |
| validate_password_number_count       | 1      |
| validate_password_policy             | MEDIUM |
| validate_password_special_char_count | 1      |
+--------------------------------------+--------+
7 rows in set (0.01 sec)

**mixed_case_count**는 대소문자 구분, **special_char_count**는 특수문자 구분이다. 둘다 꺼준다.

> SET GLOBAL validate_password_mixed_case_count = 0;
> SET GLOBAL validate_password_special_char_count = 0;

그리고 나서 비빌번호를 다시 update해준다.
**주의!** mysql를 restart하면 설정이 초기화되므로 다시 설정해야된다.


> UPDATE mysql.user SET authentication_string=PASSWORD('1234') WHERE user='ubuntu' AND Host='%';

> FLUSH PRIVILEGES;


## root 계정 접속이 안될 때!

### 에러
```php
ERROR 1045 (28000): Access denied for user 'ubuntu'@'localhost' (using password: YES)
```

### (1) mysql 사용자 목록이 담긴 데이터 베이스 접근

> mysql> USE mysql;
```
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A
Database changed
```

### (2) 사용자 목록 확인

> mysql> SELECT User, Host, plugin FROM mysql.user;

+------------------+-----------+-----------------------+
| User             | Host      | plugin                |
+------------------+-----------+-----------------------+
| root             | localhost | auth_socket           |
| mysql.session    | localhost | mysql_native_password |
| mysql.sys        | localhost | mysql_native_password |
| debian-sys-maint | localhost | mysql_native_password |
| ubuntu           | %         | mysql_native_password |
+------------------+-----------+-----------------------+
5 rows in set (0.00 sec)

> mysql> update user set plugin='mysql_native_password' where user='root';

### (3) 권한부여 

사용자에게 외부에서 접근할 수 있도록 권한을 부여한다

> 형식 : grant all privileges on *.* to 'User Name'@'Host';

> grant all privileges on *.* to 'ubuntu'@'ip.address.xx.xx';

> FLUSH PRIVILEGES;

이렇게 했더니 아래 에러가 나온다.
```php
RROR 1819 (HY000): Your password does not satisfy the current policy requirements
```

### (4) identified by '1234';

비밀번호를 뒤에 추가해서 권한을 변경하는 명령어로 다시 입력하니 성공하였다. (+ identified by '1234';)

> 형식 : grant all privileges on *.* to userid@'%' identified by 'password';

> grant all privileges on *.* to ubuntu@'ip.address.xx.xx' identified by '1234';

> FLUSH PRIVILEGES;

### mysql 로그를 살펴보자
> tail -f /var/log/mysql/error.log

```
2021-06-30T13:04:05.658889Z 2 [Warning] IP address 'ip.address.xx.xx' could not be resolved: Name or service not known
```

### 설정파일로 이동
#### 경로 : /etc/mysql/mysql.conf.d/mysqld.cnf
#### 설정 추가 : skip-name-resolve

### mysql 재시작