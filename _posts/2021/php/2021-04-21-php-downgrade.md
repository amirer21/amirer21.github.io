---
title: PHP 버전 다운그레이드 방법
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- PHP
tags:
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
last_modified_at: '2021-04-21 10:00:00 +0800'
---

# PHP 버전 다운그레이드 방법

PHP 7 에서 PHP 5.6 으로 다운그레이드하는 방법

## 1. add-apt-repository를 설치
> sudo apt-get install python-software-properties

## 2. PHP 5.6의 repository를 추가
> sudo add-apt-repository -y ppa:ondrej/php

## 3. 패키지 목록을 업데이트
> sudo apt-get update

## 4. php5-fpm를 설치
> sudo apt-get install php5.6-fpm

## 5. 결과를 확인
> php -v

## 6. php 이동
> sudo mv /usr/bin/php /usr/bin/php7
> sudo mv /usr/bin/php5.6 /usr/bin/php

## 7. 다시 PHP 버전을 확인하여 정상적으로 버전이 나온다면 성공
> php -v