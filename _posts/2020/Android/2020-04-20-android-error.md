---
title: 안드로이드 에러
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
description: 안드로이드 에러
article_tag1: Android
article_tag2: error
article_tag3: 

article_section:  
meta_keywords: Android, error
last_modified_at: '2020-03-04 10:00:00 +0800'
---

## 에러 : AAPT: error: resource string/about_app (aka com.example.proxyex02:string/about_app) not found.
 
 
```xml
<TextView
    android:id="@+id/title"
    android:layout_width="match_parent"
    android:layout_height="50dp"
    android:background="@color/black_DBDBDB"

    android:gravity="center"
    android:text="@string/about_app" />
```

에러가 발생한 설정 파일
> src\main\res\values\strings.xml

아래 위치에 있어야될 name 값이 없어서 발생되는 에러이다. name을 맞춰준다.

- res/layout에 있는 name

- activity_package_list.xml
android:text="@string/select_package" />
res/values에 name

strings.xml
```xml
<string name="select_package">Select the app which you want capture packet. </string>
```
