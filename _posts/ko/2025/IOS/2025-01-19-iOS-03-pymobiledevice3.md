---
title: iOS 자동화 테스트 - (3) pymobiledevice3, iOS 자동화 테스트를 위한 도구
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
toc: true
toc_sticky: true
toc_label: 목차
description: 
article_tag1: iOS
article_tag2: PyMobileDevice3
article_tag3: automation
article_section: iOS
meta_keywords: iOS, PyMobileDevice3
last_modified_at: '2025-01-19 21:00:00 +0800'
---


### **pymobiledevice3: iOS 자동화 테스트를 위한 도구**

---

### **1. pymobiledevice3란?**

**pymobiledevice3**는 iOS 장치와의 **통신, 제어, 자동화 테스트**를 지원하는 **Python 기반 오픈 소스 라이브러리**입니다.  
**iOS 17 이상에서 강화된 보안 요구사항**에 대응하기 위해 설계되었으며, **RemoteXPC 기반 통신**을 지원합니다.

#### **주요 특징**
- **iOS 디바이스 연결 및 관리**:
  - USB 및 Wi-Fi를 통한 장치 연결.
  - iOS 장치의 정보 조회, 로그 수집, 진단.
- **자동화 및 디버깅**:
  - WebDriverAgent(WDA)와 통합하여 UI 테스트 및 제어.
  - DeveloperDiskImage(DDI) 마운트 및 관리.
- **CLI와 Python API 제공**:
  - CLI로 간단한 명령어 실행.
  - Python API를 활용해 복잡한 작업 구현 가능.

#### **지원 플랫폼**
- **Windows, macOS, Linux**:
  - Windows에서도 iOS와의 연결 지원.
  - iTunes 설치를 통해 Windows에서 `usbmuxd`와 같은 역할 수행.

---

### **2. pymobiledevice3의 역할: iOS 자동화 테스트**

#### **2.1 주요 역할**
1. **장치 연결 관리**:
   - iOS 디바이스의 정보를 조회하고 연결.
   - TCP 포트를 통해 개발자 서비스 접근.

2. **보안 통신 지원**:
   - **RemoteXPC** 기반으로 터널을 생성하여 iOS 17 이상 장치와 통신.
   - 터널 주소와 포트를 자동 검색(RSD 사용).

3. **자동화 테스트 실행**:
   - WebDriverAgent와 XCUITest를 통해 iOS UI 제어.
   - UI 요소 탐색, 버튼 클릭, 텍스트 입력 등의 작업 지원.

4. **디버깅 및 개발 지원**:
   - WebKit Debug Proxy로 WebView 디버깅.
   - DeveloperDiskImage를 장치에 마운트하여 디버깅 및 프로파일링.

---

### **3. pymobiledevice3의 작동 원리와 아키텍처**

#### **3.1 작동 원리**
1. **장치 연결**:
   - USB 또는 Wi-Fi를 통해 장치와 연결.
   - iOS 17 이상에서는 **RemoteXPC** 터널 생성.

2. **서비스 접근**:
   - **RSD(Remote Service Discovery)**로 장치의 서비스 주소와 포트를 검색.
   - 검색된 정보를 통해 WDA, WebKit Debug Proxy 등 서비스 실행.

3. **CLI 및 API 작동**:
   - CLI 명령어를 통해 터널 생성, 디스크 이미지 마운트 등 작업 수행.
   - Python API로 사용자 정의 작업 구현.

#### **3.2 아키텍처**
- **Core Components**:
  - **usbmuxd**:
    - USB 및 TCP 통신 관리.
    - Windows에서는 iTunes의 "Apple Mobile Service" 사용.
  - **RemoteXPC**:
    - iOS 17 이상에서 보안 터널 생성.
  - **RSD**:
    - 서비스 검색 및 연결 정보 제공.

- **pymobiledevice3 Modules**:
  - **lockdown**:
    - 장치 정보 조회, 페어링, Wi-Fi 설정.
  - **services**:
    - 다양한 서비스 접근(WDA, WebKit Proxy 등).
  - **diagnostics**:
    - 장치 진단 및 로그 수집.

---

### **4. `Understanding iDevice Protocol Layers` 요약**

#### **4.1 Overview: iDevice 프로토콜 계층**
- **iOS 장치와 통신하기 위한 주요 계층**:
  - **usbmuxd**: USB 연결 관리.
  - **lockdownd**: 장치 정보 및 서비스 관리.
  - **DeveloperDiskImage (DDI)**: 디버깅 및 개발자 기능 활성화.
  - **RemoteXPC**: iOS 17 이상에서 보안 터널 제공.

#### **4.2 주요 계층 및 동작**
1. **usbmuxd**:
   - **역할**: USB 연결된 장치 탐지 및 TCP 프록싱.
   - 주요 명령:
     ```bash
     pymobiledevice3 usbmux list
     pymobiledevice3 usbmux forward 2222 22
     ```

2. **lockdownd**:
   - **역할**: 페어링 관리, 장치 정보 조회.
   - 주요 명령:
     ```bash
     pymobiledevice3 lockdown pair
     pymobiledevice3 lockdown info
     ```

3. **Lockdown Services**:
   - 장치의 다양한 서비스 실행.
   - 예: 앱 설치/삭제, 디버깅, 로그 수집.

4. **RemoteXPC**:
   - **iOS 17 이상에서만 사용**:
     - XPC 기반으로 터널 생성.
     - 보안 터널을 통해 장치와 통신.
   - 명령 예:
     ```bash
     pymobiledevice3 lockdown start-tunnel
     ```

5. **DeveloperDiskImage (DDI)**:
   - **역할**: 디버깅 기능 활성화.
   - 명령 예:
     ```bash
     pymobiledevice3 mounter auto-mount
     ```

---

### **5. iOS 17 미만과 이상에서의 차이점**

#### **5.1 iOS 17 미만**
- **통신 방식**:
  - USB 연결을 통한 단순 TCP 프록싱(usbmuxd).
  - 페어링 이후 직접 서비스 호출 가능.

- **특징**:
  - 보안 요구사항이 비교적 낮음.
  - 기존 도구(libimobiledevice 등)와 호환성 높음.

#### **5.2 iOS 17 이상**
- **통신 방식**:
  - RemoteXPC 기반 보안 터널 필요.
  - RSD로 터널 주소와 포트를 검색 후 연결.

- **특징**:
  - 강화된 보안 요구사항.
  - pymobiledevice3와 같은 최신 도구 필요.

---

### **6. 주요 명령어 요약**

1. **장치 목록 확인**:
   ```bash
   pymobiledevice3 usbmux list
   ```

2. **터널 생성**:
   ```bash
   pymobiledevice3 lockdown start-tunnel
   ```

3. **DDI 마운트**:
   ```bash
   pymobiledevice3 mounter auto-mount
   ```

4. **WDA 실행**:
   ```bash
   pymobiledevice3 developer dvt launch com.apple.mobilesafari
   ```

---

### **7. 요약 정리**

1. **pymobiledevice3의 역할**:
   - iOS 장치 연결, 자동화 테스트, 디버깅을 지원하는 **만능 도구**.

2. **iOS 17의 변화**:
   - 보안 강화 → RemoteXPC 터널링 도입.
   - RSD로 서비스 주소 및 포트 검색.

3. **주요 프로토콜**:
   - **usbmuxd**: USB 기반 연결.
   - **RemoteXPC**: iOS 17 이상에서 보안 통신.

4. **자동화 테스트 핵심 도구**:
   - **DDI**: 개발자 모드 활성화.
   - **WDA**: UI 제어 서버.
   - **WebKit Proxy**: WebView 디버깅.


> **"pymobiledevice3로 iOS 17 이상에서도 자동화 테스트를 실행가능"**