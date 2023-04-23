---
title: Android 서비스(Service) 란?
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
description: Android 서비스(Service) 란?
article_tag1: Android
article_tag2: service
article_tag3: 

article_section:  
meta_keywords: Android, service
last_modified_at: '2020-02-17 10:00:00 +0800'
---

## Service 란?

Service 란 안드로이드 Application을 구성하는 4가지 컴포넌트 중에 하나이다.안드로이드 앱의 백그라운드에서 실행되는 작업을 수행하는 컴포넌트이다.  Activity 처럼 사용자와 상호작용 하는 컴포넌트가 아니고, Background(화면뒷단)에서 동작하는 컴포넌트이다.

## Service의 목적

안드로이드 앱이 실행되어 보여지는 화면에서 뿐만 아니라, Activity가 종료되어 있는 상태에서도 동작이 필요한 기능을 수행하기 위해서 이다.

##  Service 사용방법
 - (1) startService()
 - (2) bindService()

## 서비스에는 3가지 종류가 있다.

    - **Foreground**
Foreground Service는 사용자에게 눈에 보이는 작업을 수행한다. 예를 들어, 오디오 앱은 Foreground Service를 사용하여 오디오 트랙을 재생한다. Foreground Service는 알림을 표시해야한다. Foreground Service는 사용자가 앱과 상호 작용하지 않아도 계속 실행된다.

    - **Background**
Background Service는 사용자에게 보이지 않는 작업을 수행한다. 예를 들어 앱이 서비스를 사용하여 스토리지를 압축 한 경우 일반적으로 Background Service가된다.

    - ** Bound **
bindService ()를 호출하여 응용 프로그램 구성 요소가 바인딩 될 때 서비스가 바인딩된다. 바인딩 된 서비스는 구성 요소가 서비스와 상호 작용하고, 요청을 보내고, 결과를 받고, 프로세스 간 통신 (IPC)을 통해 프로세스간에 수행 할 수있는 클라이언트-서버 인터페이스를 제공한다. 바인딩 된 서비스는 다른 응용 프로그램 구성 요소가 바인딩 된 경우에만 실행된다. 여러 구성 요소가 한 번에 서비스에 바인딩 될 수 있지만 모든 구성 요소가 바인딩 해제되면 서비스가 삭제된다.
