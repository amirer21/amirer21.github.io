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

## 안드로이드 스튜디오 "waiting for target device to come online"

 

> bcdedit /v

> bcdedit /set hypervisorlaunchtype off

> bcdedit /set hypervisorlaunchtype auto

시도 방법 1. SDK 툴에서 에뮬레이터 관련, USB 드라이버 를 체크 해제 -> 적용 -> 체크 -> 적용 해서 재설치

시도 방법 2. Invalidate cacjes / restart

시도 방법 3. AVD 에뮬레이터 목록에서 해당 에뮬레이터 wipe data

> https://jm4488.tistory.com/17


시도 방법 4
Emulated Performance의 설정을 Software로 바꿔준다 

> Go to SDK tools > SDK Tools 
Check Android Emulator and click Apply

> https://stackoverflow.com/questions/42757928/waiting-for-target-device-to-come-online-in-android-studio-2-3#
