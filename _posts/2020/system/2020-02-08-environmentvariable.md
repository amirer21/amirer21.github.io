---
title: 환경변수 설정 의미
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- System
tags:
- System
toc: true
toc_sticky: true
toc_label: 목차
description: 환경변수 설정 의미
article_tag1: environment_variable
article_tag2: environment
article_tag3: 
article_section: system 
meta_keywords: environment_variable, java
last_modified_at: '2020-02-08 10:00:00 +0800'
---

## 환경변수 설정 의미

ubuntu에서 자바 환경변수 설정에 대한 설명

> vi /etc/profile


### JAVA 환경변수를 설정할때

> 경로 : /etc/profile

> 형식 : export 환경변수명=값

```
1 export JAVA_HOME=/usr/local/java
2 export PATH=$JAVA_HOME/bin:$PATH
3 export CLASS_PATH=$JAVA_HOME/lib:$CLASS_PATH
```

- **export** : 자식프로세스까지 환경 변수를 전달하기 위함
- 리눅스에서는 각 PATH를 :(콜론)으로 구분하고,
- 윈도우에서는 각 PATH를 ;(세미콜론)으로 구분한다.

- $(변수명) 의 의미는 변수를 참조 하겠다는 뜻이다.
따라서 $JAVA_HOME은 변수 JAVA_HOME의 /usr/local/java의 값을 사용하겠다는 뜻

2번 라인의 의미는 기존의 PATH 값의 앞에 /usr/local/java 값을 추가 하겠다는 뜻이다.