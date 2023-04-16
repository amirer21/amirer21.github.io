---
title: AWS EC2 SSH - MobaXterm
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AWS
toc: true
toc_sticky: true
toc_label: 목차
description: AWS
article_tag1: AWS
article_tag2: 
article_tag3: 
article_section: AWS
meta_keywords: AWS
last_modified_at: '2023-04-10 21:00:00 +0800'
---
① ② *AWS EC2* 

# 

**AWS EC2, SSH, MobaXterm**

#

## 마주한 에러

Disconnected: No supported authentication methods available (server sent: publickey)

mobaxterm
.pem 키 use private key 
https://cocoon1787.tistory.com/850

## 비밀 번호 변경

> $ mount -rw -o remount /

>$ passwd root

https://coding-factory.tistory.com/497

# 재시작 
> sudo systemctl start ssh

https://askubuntu.com/questions/1334828/failed-to-restart-sshd-service
