---
title: 안드로이드 아키텍처 관련 에러
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Android
tags:
- Android
toc: true
toc_sticky: true
toc_label: 목차
description: 안드로이드 아키텍처 관련 에러
article_tag1: Android
article_tag2: error
article_tag3: 

article_section:  
meta_keywords: Android, error
last_modified_at: '2020-04-27 10:00:00 +0800'
---

## 안드로이드 에러 **INSTALL_FAILED_NO_MATCHING_**
 
> Installation did not succeed.
The application could not be installed: INSTALL_FAILED_NO_MATCHING_ABIS
Installation failed due to: 'null'

### 에러 (1)
ERROR: Conflicting configuration : 'armeabi' in ndk abiFilters cannot be present when splits abi filters are set : x86,armeabi-v7a
Affected Modules: app

> https://stackoverflow.com/questions/24572052/install-failed-no-matching-abis-when-install-apk

### 에러 (2) 
device supports x86 but apk only supports armeabi-v7a

----------------
## 에러를 해결하기 위한 사전 지식

### **CPU 아키텍쳐**

x86, AMD64, ARM, RISC-V, POWER, PowerPC, MIPS등이 있다.
Arm이 일반 대중에게 널리 알려진 계기는 대체로 2010년 이후로, 스마트폰이 대세가 되면서 스마트폰에서 CPU 역할을 하는 AP(Application Processor)가 확산되면서부터 급격히 커지기 시작했다.

https://namu.wiki/w/ARM(CPU)

### **ndk 란??**

**Android NDK(Native Development Kit)**: Android에서 C 및 C++ 코드를 사용할 수 있도록 지원하고 네이티브 활동을 관리하며 물리적 기기 구성요소(예: 센서 및 터치 입력)에 액세스할 수 있는 플랫폼 라이브러리를 제공하는 도구 모음입니다.

> https://developer.android.com/studio/projects/add-native-code?hl=ko


### **64비트 아키텍처 시작**

2019년 8월 1일부터 Google Play에 게시되는 앱에서는 64비트 아키텍처를 지원해야 합니다. 64비트 CPU는 사용자에게 더 빠르고 풍부한 환경을 제공합니다. 앱의 64비트 버전을 추가하면 성능이 향상되고 향후 혁신을 이룰 가능성이 높아지며 64비트 전용 하드웨어가 장착된 기기에 대응할 수 있습니다.
이 가이드에서는 32비트 앱에서 64비트 기기를 지원할 준비가 되었는지 확인하기 위해 현재 취할 수 있는 단계를 설명합니다.

앱에 64비트 라이브러리가 포함되어 있는지 확인

**ARM 아키텍처의 경우** 32비트 라이브러리는 armeabi-v7a에 있으며 이때 64비트에 해당하는 라이브러리는 arm64-v8a입니다.
**x86 아키텍처의 경우** 32비트용 x86과 64비트용 x86_64를 찾아보세요.

가장 먼저 해야 할 일은 이러한 두 폴더에 네이티브 라이브러리가 있는지 확인하는 것입니다. 요약하면 다음과 같습니다.

| 플랫폼| 32비트 라이브러리 폴더 | 64비트 라이브러리 폴더|
|-------|---------------------|---------------------|
|  ARM	| lib/armeabi-v7a     |	lib/arm64-v8a       |
|  x86	| lib/x86             | lib/x86_64          |

> 참고 : https://developer.android.com/distribute/best-practices/develop/64-bit


### **ABI**

안드로이드 디바이스는 제조사의 사정에 따라서 입맛대로 CPU를 골라 쓸 수 있다. 이쪽에서 가장 대표적인 ARM을 비롯하여 MIPS, x86을 지원한다. 이들이 사용하는 명령 세트는 모두 다르며, 각 아키텍쳐 – 명령세트의 조합은 자신들에게 맞는 ABI(Application Binary Interface)를 갖는다.
ABI란, 런타임에 시스템과 앱의 머신코드가 어떻게 상호작용할지를 기술한 인터페이스이다.

> 참고 : https://blog.yatopark.net/2016/03/12/%EC%95%88%EB%93%9C%EB%A1%9C%EC%9D%B4%EB%93%9C%EC%9D%98-abi-%EA%B4%80%EB%A6%AC/

----------------------------------------------

## 에러 분석

### 에러의 원인?

export한 project의 native library가 x86(에뮬레이터)용만 포함하고 있는 것 같습니다. 그래서 arm계열(스마트폰)을 지원 못하는 상황으로 보이네요.
> http://www.masterqna.com/android/83764/%EB%9F%B0-%EA%B4%80%EB%A0%A8%EC%A7%88%EB%AC%B8-%EB%93%9C%EB%A6%BD%EB%8B%88%EB%8B%A4


### 해결

export한 project가 native build source를 포함하고 있으면 가능합니다.
ndk { abiFilters }에 arm abi를 추가하거나 미리 정의되어 있는
build variant가 있는지 확인해 보세요.

> https://stackoverflow.com/questions/41775988/what-is-the-reason-for-the-error-device-supports-x86-but-apk-only-supports-arm?rq=1

build.gradle에서 ndk로 armeabi 부분이 보인다.

```gradle
ndk {
    abiFilters "armeabi"
}
```


