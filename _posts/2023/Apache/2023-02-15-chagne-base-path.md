---
title: apache
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
description: apache
article_tag1: apache
article_tag2: 
article_tag3: 
article_section: apache
meta_keywords: apache
last_modified_at: '2023-04-10 21:00:00 +0800'
---
① ② *apache html* 

# Apache 기본 경로 변경?

**Apache html 기본 경로 변경**
> 경로 이동 : cd /etc/apache2/sites-available
> vim 000-default.conf 입력
약 12번째 줄의 DocumentRoot /var/www/html 부분을 희망하는 경로로 수정
Esc, :,wq로 저장 후 종료

> 경로 이동 : cd /etc/apache2/
vim apache2.conf입력
약 164번 줄의 directory /var/www/html 부분을 희망하는 경로로 수정
Esc, :,wq로 저장 후 종료

```
service apache2 restart
```

https://velog.io/@castlehoouoo/Ubuntu-Apache2-%EC%95%84%ED%8C%8C%EC%B9%982-%EC%9B%B9-%EC%84%9C%EB%B2%84-%EA%B8%B0%EB%B3%B8-%EA%B2%BD%EB%A1%9C-%EC%84%A4%EC%A0%95


