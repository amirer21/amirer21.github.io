---
title: Apache2 서버 충돌시 프로세스 죽이기
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Apache2
toc: true
toc_sticky: true
toc_label: 목차
description: 포트 충돌시 프로세스 죽이기
article_tag1: apache2
article_tag2: port
article_tag3: kill
article_section:  
meta_keywords: apache2, port, kill
last_modified_at: '2019-06-26 10:00:00 +0800'
---

## Apache2 서버 접속이 안될 때 확인

### apache2 포트 open
> iptables open

apache2 실행시 다음 명령어로 실시간 로그를 확인할 수 있는데
apache2에서의 오류는 없었음
> tail -f error.log 

### 문제 : 포트는 열려있으나, 웹에서 접속이 안됨
### 해결 : 
> systemctl status apache2 상태확인

> netstat -ltnp | grep ':80' : 포트확인

> lsof -i:80

> kill -9 해당 포트 pid 

There are three files in /var/log/apache2/ 이동 후 로그보기

> tail -f error.log

> 다른 로그 파일 access.log, other_vhosts_access.log

> systemctl status apache2 

아래와 같이 나온다.
 
● apache2.service - LSB: Apache2 web server
   Loaded: loaded (/etc/init.d/apache2; bad; vendor preset: enabled)
  Drop-In: /lib/systemd/system/apache2.service.d
           └─apache2-systemd.conf
   Active: inactive (dead) since Tue 2019-06-25 17:00:59 KST; 20h ago
     Docs: man:systemd-sysv-generator(8)
  Process: 1766 ExecStop=/etc/init.d/apache2 stop (code=exited, status=0/SUCCESS)
  Process: 1749 ExecStart=/etc/init.d/apache2 start (code=exited, status=0/SUCCESS)

Jun 25 17:00:59 ubuntu-63380 apache2[1749]: (98)Address already in use: AH00072: make_sock: could not bind to address [::]:80
Jun 25 17:00:59 ubuntu-63380 apache2[1749]: (98)Address already in use: AH00072: make_sock: could not bind to address 0.0.0.0:80
Jun 25 17:00:59 ubuntu-63380 apache2[1749]: no listening sockets available, shutting down
Jun 25 17:00:59 ubuntu-63380 apache2[1749]: AH00015: Unable to open logs
Jun 25 17:00:59 ubuntu-63380 apache2[1749]: Action 'start' failed.
Jun 25 17:00:59 ubuntu-63380 apache2[1749]: The Apache error log may have more information.
Jun 25 17:00:59 ubuntu-63380 apache2[1749]:  *
Jun 25 17:00:59 ubuntu-63380 apache2[1766]:  * Stopping Apache httpd web server apache2
Jun 25 17:00:59 ubuntu-63380 apache2[1766]:  *
Jun 25 17:00:59 ubuntu-63380 systemd[1]: Started LSB: Apache2 web server.