---
title: MySQL - Auto_increment
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- MySQL
tags:
- MySQL
toc: true
toc_sticky: true
toc_label: 목차
description: MySQL
article_tag1: MySQL
article_tag2: Auto_increment
article_tag3: 
article_section:  
meta_keywords: MySQL, Auto_increment
last_modified_at: '2020-07-29 10:00:00 +0800'
---


# 원하는 값으로 초기화
```sql
ALTER TABLE 테이블이름 AUTO_INCREMENT=1;
#기존 ROW 재정렬
SET @cnt = 0;
UPDATE 테이블이름 SET 테이블이름.컬럼이름 = @cnt:=@cnt+1;
```
#

```sql
ALTER TABLE test_table AUTO_INCREMENT=1;
SET @cnt = 0;
UPDATE test_table SET test_table.app_seq = @cnt:=@cnt+1;
```
