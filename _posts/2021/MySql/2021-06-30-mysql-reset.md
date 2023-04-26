---
title: MySQL AUTO_INCREMENT 초기화
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
description: MySQL AUTO_INCREMENT reset
article_tag1: MySQL
article_tag2: AUTO_INCREMENT
article_tag3: 
article_section:  
meta_keywords: MySQL, AUTO_INCREMENT, reset
last_modified_at: '2021-06-30 10:00:00 +0800'
---

## mysql AUTO_INCREMENT 초기화

>ALTER TABLE test_table AUTO_INCREMENT = 1;

>SET @cnt = 0;

>UPDATE test_table SET id = @cnt:=@cnt+1;