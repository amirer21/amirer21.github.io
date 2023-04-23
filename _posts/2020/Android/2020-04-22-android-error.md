---
title: 안드로이드 에러 - android_Error inflating class
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
description: 안드로이드 에러 - android_Error inflating class
article_tag1: Android
article_tag2: error
article_tag3: 

article_section:  
meta_keywords: Android, error
last_modified_at: '2020-03-04 10:00:00 +0800'
---


## android_Error inflating class 에러 해결

### 에러 (1)
> Error inflating class android.support.v4.view.ViewPager

 simply Replaced the code with this and it worked
```xml
   <androidx.viewpager.widget.ViewPager
       android:id="@+id/main_tabPager"
       android:layout_width="match_parent">
```

> 참고 : https://stackoverflow.com/questions/10780413/error-inflating-class-android-support-v4-view-viewpager

### 에러 (2)
> Error inflating class android.support.v4.widget.SwipeRefreshLayout

This issue seems to happen when migrating to AndroidX as there are many build artifact to be changed when Migrating to AndroidX.

### Solution 1: Do it manually
For exemple:

>android.support.v4.widget.SwipeRefreshLayout changed to => androidx.swiperefreshlayout.widget.SwipeRefreshLayout

You must update all the build artifact listed in Migrating to AndroidX

> 참고 : https://stackoverflow.com/questions/54932305/inflating-class-android-support-v4-widget-swiperefreshlayout

### 에러 (3)
> Error inflating class android.support.v7.widget.RecyclerView

- Replaced

> android.support.v7.widget.RecyclerView

- with

> androidx.recyclerview.widget.RecyclerView

and it worked! :)

> 참고 : https://stackoverflow.com/questions/25477860/error-inflating-class-android-support-v7-widget-recyclerview
