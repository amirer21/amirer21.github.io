---
title: PHP, MySQL 연동 에러 해결
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
last_modified_at: '2021-04-24 10:00:00 +0800'
---

# PHP, MySQL 연동 에러 해결

PHP 파일에서 mysqli_connect를 넣어준뒤 발생된 에러 해결
```php
//db connection
    $GLOBALS['DB_CONNECTION'] = mysqli_connect(
        '127.0.0.1',
        'ubuntu',
        '1234',
        'PhpBlog',
    );
```

## 1. 발생된 에러 내용
> PHP Fatal error:  Uncaught Error: Call to undefined function mysqli_connect()

## 해결 시도 1)
Php.ini 에 추가
```
mysql.default_socket = /var/run/mysqld/mysqld.sock
mysqli.default_socket = /var/run/mysqld/mysqld.sock
```

https://stackoverflow.com/questions/13769504/mysqlimysqli-hy000-2002-cant-connect-to-local-mysql-server-through-sock

**주의** 버전별 php.ini 경로가 다르다.

현재 버전은 php 7.4 이므로… 7.4

> /etc/php/7.4/apache2/php.ini

https://stackoverflow.com/questions/35424982/how-can-i-enable-the-mysqli-extension-in-php-7

## 2. 발생된 에러 내용
> PHP Warning:  mysqli_connect(): (HY000/2002): Connection timed out in /var/www/html/index.php on line 12

## 해결 시도 2)

버전을 명시해준 php-mysqli를 설치
> apt-get install php7.4-mysqli

https://stackoverflow.com/questions/35424982/how-can-i-enable-the-mysqli-extension-in-php-7

## 해결 시도 3)
```
mysqli_connect(
        '127.0.0.1',
    );
```

아이피 주소를 넣어 주었었는데 
(ex) 12.123.100.00 -> mysql 서버는 같은 로컬에 있으므로 로컬 아이피(127.0.0.1)로 넣어준다.



