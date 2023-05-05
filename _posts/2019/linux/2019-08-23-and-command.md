---
title: 리눅스 명령어 - & vs &&
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- linux
toc: true
toc_sticky: true
toc_label: 목차
description: 리눅스 명령어 - & vs &&
article_tag1: linux
article_tag2: 
article_tag3: 
article_section:  
meta_keywords: linux
last_modified_at: '2019-08-23 10:00:00 +0800'
---

### 리눅스 명령어
- & : & 앞의 명령어는 백그라운드실행 +  & 뒤의 명령어를 실행
- && : & 앞의 명령어가 성공 후 & 뒤의 명령어를 실행
- ; : & 앞의 명령어가 실패해도 & 뒤의 명령를 실행

### & vs &&

> mkdir test & cd test

>(1) & (2)

(1) 백그라운드로 test 디렉토리를 생성하면서 (2) 동시에 test 디렉토리로 이동하게되므로 & 뒤에 명령어가 실행될 수 없다.

> mkdir test && cd test

>(1) && (2)
이전 명령이 성공했을 때에만 다음 명령을 실행하려면 &&를 사용한다.

성공, 실패와 상관없이 연속적으로 실행해야 할 명령이 있을 때 ;를 쓴다. 