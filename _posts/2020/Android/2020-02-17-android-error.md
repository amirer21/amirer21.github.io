---
title: failed to parse xml in androidmanifest.xml 해결
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Android
toc: true
toc_sticky: true
toc_label: 목차
description: failed to parse xml in androidmanifest.xml 해결
article_tag1: Android
article_tag2: error
article_tag3: 

article_section:  
meta_keywords: Android, error
last_modified_at: '2020-02-17 10:00:00 +0800'
---

## 에러 해결

![img](/assets/images/android-error/1.error.jpg "android-error")

정상적으로 작동하던 소스코드가 빌드하여도 실행이 되질 않음

- 에러 : failed to parse xml in androidmanifest.xml

- 해결  
androidmanifest.xml 에 문제가 있는것으로 보인다.

프로젝트 구조를 보니 androidmanifest파일이 안보인다.

![img](/assets/images/android-error/2.error.jpg "android-error")

project로 바꾸어서 경로에 있는 AndroidManifest.xml 파일을 열어보았다.

 ![img](/assets/images/android-error/3.error.jpg "android-error")

주석이 문제인가 하여 주석을 지운 뒤 

![img](/assets/images/android-error/4.error.jpg "android-error")

sync project with Gradle Files를 실행
 
![img](/assets/images/android-error/5.error.jpg "android-error")


X표시가 없어지면서 정상적으로 빌드된다.

![img](/assets/images/android-error/6.error.jpg "android-error")


> Android App 프로젝트 소스 세트의 루트에는 AndroidManifest.xml 파일(정확히 이 이름)이 있어야 한다.
