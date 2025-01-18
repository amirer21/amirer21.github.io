---
title: iOS 자동화 테스트 - (2) iOS 17, 보안 요소 변경 사항과 자동화 테스트 방식의 변화
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


### **iOS 17: 보안 요소 변경 사항과 자동화 테스트 방식의 변화**

---

**iOS 17부터 보안 요소가 대폭 강화**되면서 기존 iOS 디바이스와 PC 간의 연결 및 테스트 방식이 크게 변경되었습니다. 이로 인해 자동화 테스트 환경에서도 새로운 기술과 도구가 요구되고 있습니다. 이번 글에서는 **iOS 17 미만과 이상의 차이점**, **Windows와 macOS에서 iOS 디바이스를 연결하고 테스트하는 방법**에 대해 알아보겠습니다.

---

### **1. iOS 17 미만과 이상의 차이**

#### **1.1 보안 변경 사항**
- **iOS 17 미만**:
  - **usbmuxd 기반 통신**:
    - USB를 통한 단순 연결로 장치와 통신 가능.
    - 보안 터널 없이 TCP 포트 연결.
  - **테스트 방식**:
    - DeveloperDiskImage(DDI) 마운트 후 WebDriverAgent(WDA)로 UI 자동화 테스트 실행.
    - 기존 도구(libimobiledevice, Appium)로 대부분 작업 가능.

- **iOS 17 이상**:
  - **RemoteXPC 기반 통신**:
    - 모든 통신이 **보안 터널**을 통해 이루어짐.
    - Remote Service Discovery(RSD)로 터널 주소 및 포트 검색.
  - **테스트 방식**:
    - WDA 실행 전 RemoteXPC 터널 필수.
    - pymobiledevice3와 같은 최신 도구 사용 필요.

---

#### **1.2 기술적 차이**
| **항목**              | **iOS 17 미만**                             | **iOS 17 이상**                             |
|-----------------------|---------------------------------------------|---------------------------------------------|
| **통신 방식**         | usbmuxd 기반                                | RemoteXPC 기반                              |
| **보안 수준**         | 낮음 (터널링 없음)                         | 높음 (보안 터널 필수)                       |
| **장치 연결**         | USB를 통해 TCP 포트로 직접 연결             | RSD로 터널 주소/포트 검색 후 보안 연결      |
| **사용 도구**         | libimobiledevice, Appium                   | pymobiledevice3, Appium (RemoteXPC 지원)   |
| **테스트 준비**       | DDI 마운트 후 WDA 실행                     | 터널 생성 → DDI 마운트 → WDA 실행           |

---

### **2. Windows OS에서 iOS 디바이스 연결 및 테스트**

#### **2.1 Windows 환경에서의 제한**
- Windows에서는 기본적으로 macOS에서 제공되는 **usbmuxd**와 같은 도구가 없습니다.
- **Apple Mobile Service(iTunes 설치 시 포함)**를 통해 USB 기반 연결 지원.

#### **2.2 pymobiledevice3로 테스트 준비**
1. **Apple Mobile Service 설치**:
   - iTunes 설치를 통해 Windows에서 iOS 장치를 탐지 가능.
2. **pymobiledevice3 설치**:
   - Python 환경에서 pymobiledevice3 설치:
     ```bash
     pip install pymobiledevice3
     ```

#### **2.3 테스트 과정**
1. **장치 연결**:
   - USB를 통해 Windows와 iOS 디바이스 연결.
2. **보안 터널 생성(RemoteXPC)**:
   ```bash
   pymobiledevice3 lockdown start-tunnel
   ```
   - RSD로 터널 주소 및 포트 검색 후 터널 생성.
3. **DeveloperDiskImage(DDI) 마운트**:
   ```bash
   pymobiledevice3 mounter auto-mount
   ```
4. **WDA 실행**:
   ```bash
   pymobiledevice3 developer dvt launch com.apple.mobilesafari
   ```
5. **테스트 실행**:
   - Appium과 같은 클라이언트를 사용하여 UI 테스트 수행.

---

### **3. macOS에서 iOS 디바이스 연결 및 테스트**

#### **3.1 macOS 환경의 이점**
- macOS는 기본적으로 **usbmuxd**와 **Xcode**를 제공.
- iOS 디바이스와의 연결 및 테스트를 위한 Apple의 공식 도구(Xcode, Instruments) 사용 가능.

#### **3.2 pymobiledevice3로 테스트 준비**
1. **pymobiledevice3 설치**:
   ```bash
   pip install pymobiledevice3
   ```

#### **3.3 테스트 과정**
1. **장치 연결**:
   - USB 또는 Wi-Fi를 통해 macOS와 iOS 디바이스 연결.
2. **보안 터널 생성(RemoteXPC)**:
   ```bash
   pymobiledevice3 lockdown start-tunnel
   ```
3. **DeveloperDiskImage(DDI) 마운트**:
   ```bash
   pymobiledevice3 mounter auto-mount
   ```
4. **Xcode를 통한 WDA 빌드 및 설치**:
   - Xcode를 사용해 WebDriverAgent를 빌드하고 디바이스에 설치.
5. **WDA 실행**:
   ```bash
   pymobiledevice3 developer dvt launch com.apple.mobilesafari
   ```
6. **테스트 실행**:
   - Appium이나 Instruments를 통해 UI 테스트 수행.

---

### **4. iOS 17 이상에서 pymobiledevice3를 활용한 테스트의 핵심**

#### **4.1 보안 터널 생성**
- **터널 생성 명령**:
  ```bash
  pymobiledevice3 lockdown start-tunnel
  ```
- **이유**:
  - 모든 통신이 RemoteXPC 기반 보안 터널을 통해 이루어짐.
  - 터널 없이는 WDA 실행 불가.

#### **4.2 DeveloperDiskImage(DDI) 마운트**
- **명령어**:
  ```bash
  pymobiledevice3 mounter auto-mount
  ```
- **역할**:
  - iOS 장치를 디버깅 및 테스트 모드로 활성화.

#### **4.3 WebDriverAgent(WDA) 실행**
- **역할**:
  - iOS UI 제어 서버.
- **명령어**:
  ```bash
  pymobiledevice3 developer dvt launch com.apple.mobilesafari
  ```

---

### **정리**

#### **1. iOS 17 미만과 이상의 주요 차이**
- **17 미만**: 단순한 USB 연결 및 통신.
- **17 이상**: RemoteXPC 기반 보안 터널 필수.

#### **2. Windows와 macOS 테스트 환경의 차이**
- **Windows**:
  - Apple Mobile Service로 USB 연결.
  - pymobiledevice3로 RemoteXPC 터널 생성.
- **macOS**:
  - Xcode 및 Instruments 제공.
  - pymobiledevice3로 RemoteXPC 터널 생성 및 WDA 실행.

#### **3. pymobiledevice3의 중요성**
- iOS 17 이후 테스트 환경에서 **보안 요구사항을 충족**하고, 디바이스 연결, 터널 생성, 테스트를 자동화.

> **"iOS 17의 보안 강화로 인해 pymobiledevice3는 필수 도구가 되었으며, Windows와 macOS 환경에서도 안정적인 테스트를 지원합니다."**  
