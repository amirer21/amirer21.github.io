---
title: iOS 자동화 테스트 - (5) Windows와 iOS 디바이스 연결 기반 아키텍처
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- iOS
tags:
- iOS
- PyMobileDevice3
- 
toc: true
toc_sticky: true
toc_label: 목차
description: 
article_tag1: iOS
article_tag2: PyMobileDevice3
article_tag3: 
article_section: iOS
meta_keywords: iOS, PyMobileDevice3
last_modified_at: '2025-01-19 21:00:00 +0800'
---


### **Windows와 iOS 디바이스 연결 기반 아키텍처**

Windows에서 iOS 디바이스와 연결하기 위해서는 **iTunes** 설치로 제공되는 **Apple Mobile Service**를 활용합니다. 이 서비스는 iOS 장치와 PC 간의 USB 기반 통신을 관리하며, pymobiledevice3를 통해 고급 작업(테스트, 디버깅 등)을 수행할 수 있습니다.

---

### **아키텍처 도식화**

```plaintext
┌──────────────────────────┐
│        Windows PC        │
│  (Python & pymobiledevice3) │
│                          │
│  ┌────────────────────┐  │
│  │ Apple Mobile Service │  │
│  │  (Windows에서 USB 연결) │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ RemoteXPC (터널 생성) │  │
│  │  - RSD로 포트 검색   │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │ pymobiledevice3     │  │
│  │ - DDI 마운트        │  │
│  │ - WDA 실행          │  │
│  │ - XCUITest 실행     │  │
│  └────────────────────┘  │
└──────────────────────────┘
                 │
                 ▼
      ┌────────────────────┐
      │   iOS Device       │
      │  (iPhone/iPad)     │
      │                    │
      │  ┌──────────────┐  │
      │  │ DeveloperDisk│  │
      │  │ Image (DDI)  │  │
      │  └──────────────┘  │
      │                    │
      │  ┌──────────────┐  │
      │  │ WebDriverAgent│  │
      │  │  (UI 서버)    │  │
      │  └──────────────┘  │
      │                    │
      │  ┌──────────────┐  │
      │  │ XCUITest     │  │
      │  │  (UI 테스트)  │  │
      │  └──────────────┘  │
      └────────────────────┘
```

---

### **구성 요소 설명**

#### **1. Windows PC**
- **Python & pymobiledevice3**:
  - iOS 디바이스와 연결, 디버깅, 테스트를 수행하는 Python 기반 도구.
  - CLI 또는 API를 통해 작업 수행 가능.

- **Apple Mobile Service**:
  - iTunes 설치 시 제공되는 서비스.
  - **usbmuxd**와 유사한 역할로, USB 연결을 통해 iOS 장치 탐색 및 통신.

- **RemoteXPC**:
  - iOS 17 이상에서 보안 터널을 생성하여 데이터 암호화 및 서비스 연결.

---

#### **2. iOS Device**
- **DeveloperDiskImage (DDI)**:
  - iOS 장치를 **디버깅 및 테스트 모드**로 활성화.
  - DDI가 마운트되지 않으면 WDA 및 XCUITest 실행 불가.

- **WebDriverAgent (WDA)**:
  - iOS UI를 제어하는 HTTP 기반 서버.
  - Appium 등 클라이언트에서 WDA를 통해 명령을 전달.

- **XCUITest**:
  - iOS의 공식 UI 테스트 프레임워크.
  - WDA와 통합되어 UI 테스트 수행.

---

### **작동 원리**

#### **1. Windows와 iOS 연결**
1. USB 케이블로 Windows와 iOS 장치를 연결.
2. **Apple Mobile Service**가 장치를 탐지하고 기본 통신 설정.

#### **2. 터널 생성 및 장치 설정**
1. pymobiledevice3를 통해 **RemoteXPC 터널 생성**.
2. RSD를 통해 iOS 디바이스의 주소와 포트 검색.
3. DDI를 마운트하여 개발자 모드 활성화.

#### **3. WDA 및 XCUITest 실행**
1. pymobiledevice3를 통해 **WebDriverAgent 실행**.
2. Appium 등 클라이언트가 WDA로 명령 전달.
3. XCUITest를 사용해 UI 테스트 수행.

---

### **흐름 요약**
```plaintext
1. Windows에서 pymobiledevice3 실행
   → 2. USB로 iOS 장치 연결
   → 3. RemoteXPC 터널 생성 (iOS 17 이상)
   → 4. DDI 마운트
   → 5. WDA 서버 실행
   → 6. XCUITest로 UI 테스트 실행
```

---

### **요약 정리리**
1. **Windows-PC**:
   - Apple Mobile Service로 iOS 디바이스 연결 관리.
   - pymobiledevice3로 RemoteXPC 터널 생성 및 테스트 제어.

2. **iOS-Device**:
   - DDI 마운트로 개발자 모드 활성화.
   - WDA 서버로 UI 테스트 명령 처리.

> **"Windows와 iOS를 연결하고, RemoteXPC 터널을 통해 안전하게 UI 테스트를 실행."**  