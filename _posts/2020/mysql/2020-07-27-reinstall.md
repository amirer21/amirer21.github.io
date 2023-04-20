---
title: MySQL 수동 삭제 & bin_log 설정하기
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
description: MySQL
article_tag1: MySQL
article_tag2: bin_log
article_tag3: 
article_section:  
meta_keywords: MySQL, bin_log
last_modified_at: '2020-07-27 10:00:00 +0800'
---


# mysql 완전 삭제, 재설치

node.js의 mysql-event를 사용하려고 하는데 MariaDB에서 bin_log 활성화로 설정을 하였으나,
data를 insert하는 이벤트는 감지하지만 update, select 이벤트는 감지하지 못하였다.
여러 방법을 확인하였으나 더 이상 진행이 어렵다고 판단하여
MariaDB를 삭제하고 mysql로 다시 설치하기로 하였다.

(결론 : 순서대로 삭제 후 설치하였고, bin_log 설정도 하여 성공함. 설정문제였음)


#

## 1. 기존 경로에 있는 파일들과 버전 확인
	
### (1) my.cnf 경로
 
![img](/assets/images/mysql/1.mycnf.png "mycnf")

### (2) 로그 파일 위치(bin_log)
![img](/assets/images/mysql/2.bin_log.png "mycnf")

### (3) MariaDB 버전
![img](/assets/images/mysql/3.version.png "mycnf")

### (4) ubuntu 설치된 패키지 확인
dpkg -l
 
![img](/assets/images/mysql/4.package.png "mycnf")

```ubuntu
ii  mariadb-client                    10.0.38-0ubuntu0.16.0 all                   MariaDB database client (metapackage depending on the latest version)
ii  mariadb-client-10.0               10.0.38-0ubuntu0.16.0 amd64                 MariaDB database client binaries
ii  mariadb-client-core-10.0          10.0.38-0ubuntu0.16.0 amd64                 MariaDB database core client binaries
ii  mariadb-common                    10.0.38-0ubuntu0.16.0 all                   MariaDB common metapackage
ii  mariadb-server                    10.0.38-0ubuntu0.16.0 all                   MariaDB database server (metapackage depending on the latest version)
ii  mariadb-server-10.0               10.0.38-0ubuntu0.16.0 amd64                 MariaDB database server binaries
ii  mariadb-server-core-10.0          10.0.38-0ubuntu0.16.0 amd64                 MariaDB database core server files
ii  mysql-common                      5.7.30-0ubuntu0.16.04 all                   MySQL database common files, e.g. /etc/mysql/my.cnf
```

#

## 2. 삭제하기 

### (1) mysql-common 삭제 & 재설치

**mysql-common** 이것만 한번 삭제해보자
삭제하고 나니 아래와 같이 mysql 설정파일도 삭제되었다.

![img](/assets/images/mysql/5.mysql_common.png "mycnf")

![img](/assets/images/mysql/6.mysql_common.png "mycnf")

다시 설치하고 설정파일을 확인해보니 아예 공백이다.

### (2) mariadb-server 삭제

삭제하고 mysql을 다시 설치해보자.

> sudo apt-get purge mariadb-server

이 명령어를 실행하면 패지키 목록에서 패키지목록에서 **client, common, server**가 mariadb 가 완전히 삭제된다

> mysql –version 또는 -V으로 더 이상 버전확인은 되지 않고 
> mysql -u root -p 로도 더 이상 접속은 되지 않지만
외부에서 **heisql**로 접속하면 데이터를 볼 수 있다? 아직 어딘가 삭제되지 않았다…

![img](/assets/images/mysql/7.remove_mysql_folder.png "mycnf")

/etc 경로에 mysql 폴더가 남아있는데 이 폴더를 삭제하자.
![img](/assets/images/mysql/8.remove_mysql_folder.png "mycnf")
 
/var/lib 경로에 있는 mysql도 삭제하자.

[공용작업]
```ubuntu
sudo rm -rf /var/log/mysql
sudo rm -rf /var/log/mysql.*
sudo rm -rf /var/lib/mysql
sudo rm -rf /etc/mysql
```
출처: https://elfinlas.tistory.com/367 [MHLab Blog]

![img](/assets/images/mysql/9.remove_mysql_folder.png "mycnf")

 
**/var/log 경로**의 mysql 도 삭제하자.
![img](/assets/images/mysql/10.remove_mysql_folder.png "mycnf")

> ps -ef | grep mysql

다 삭제하였는데도 DB 외부접속이 가능하다. mysql이 아직도 실행되고 있었다..

강제종료로 다 종료시킨다.
이제 더 이상 외부접속은 불가하다.

### (3) 재설치

이제 다시 재설치!
> sudo apt install mariadb-server 로 재설치

#

### 에러 : mysql 접속시 로그인 에러
![img](/assets/images/mysql/11.login_error.png "mycnf")

ERROR 1045 (28000): Access denied for user 'ubuntu'@'localhost' (using password: NO)

### 해결 : 옵션을 붙여서 패스워드 설정

> mysql -pP@ssw0rd

https://zetawiki.com/wiki/MySQL_ERROR_1045_%EC%A0%91%EA%B7%BC_%EA%B1%B0%EB%B6%80



#

## 3. bin log 설정하기

**mysql bin log**란 ? - mysql 쿼리를 수행 하면서 쌓는 로그, 추후 트렉젝션하여 시점 복구 등을 수행하는 등의 역할

고쳐야되는 DB서버의 설정내용
![img](/assets/images/mysql/12.db_setting.png "mycnf")

정상적인 DB서버 설정내용
![img](/assets/images/mysql/13.db_setting.png "mycnf")

### binlog_format 설정

binlog_format  | STATEMENT
이 부분을 수정해보자.
![img](/assets/images/mysql/14.db_setting.png "mycnf")
 

명령어로는 적용되지 않는다…
명령어http://www.mysqlkorea.com/sub.html?mcode=manual&scode=01_1&m_no=22396&cat1=753&cat2=802&cat3=938&lang=k

**mysql restart와 kill**로 mysql 를 강제 종료한 후 다시 적용하였으나
그래도 적용되지 않는다.
![img](/assets/images/mysql/15.db_setting.png "mycnf")


**50-server.cnf** 설정파일에서 **binlog_format**을 **ROW** 로 설정한다.
>log-bin=/home/mysql_log/bin_log/bin # 빈로그 저장 설정 및 저장할 디렉토리 지정

>binlog_cache_size = 2M # binlog cache 사이즈

>max_binlog_size = 50M # bin로그 최대 파일 사이즈

>expire_logs_days = 10 # 보관기간

https://hyorock.tistory.com/94

저장 후 mysql restart 또는 kill로 강제 종료 후 재시작
![img](/assets/images/mysql/16.db_setting.png "mycnf")
 

잘 적용이 되었다.

### 참고

값을 영구적으로 설정하고 **my.cnf**에 액세스 할 수 있다고 가정하려면 다음을 추가하십시오.

[mysqld]
```mysql
binlog_format=XX

```
그런 다음 서버를 다시 시작하십시오.
https://qastack.kr/dba/2678/how-do-i-show-the-binlog-format-on-a-mysql-server


**Binary log**는 DDL 및 DML 작업과 같이 데이터베이스 내에서 발생하는 변경 event들이 저장되는 로그 파일이다.
MySQL에서는 이러한 이벤트들을 Binary log 파일에 로깅할 때 로깅 포맷을 어떻게 가져갈 것인가에 대해 사용자가 선택할 수 있도록 binlog_format 이라는 설정변수(system variable)를 제공하고 있다.

```mysql
binlog_format
```
사용자는 아래 3가지 타입 중 하나를 선택하여 설정할 수 있다.

## Possible values
- STATEMENT : logging to be statement based 데이터 변경에서 사용되는 모든 쿼리를 쿼리대로 저장.
- ROW : logging to be row based (Default value, >= 5.7.7) 변경 작업으로 변경된 모든 Row 정보 기록
- MIXED : logging to use mixed format (statement와 row image가 mix되어 로깅됨) 혼합
(MySQL 5.7.7 이전까지는 statement-based logging format이 디폴트 값이였으며, 5.7.7 부터는 row-based logging format 이 디폴트 값으로 지정되었다.)
http://small-dbtalk.blogspot.com/2016/12/
