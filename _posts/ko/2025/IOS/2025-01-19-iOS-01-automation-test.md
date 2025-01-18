---
title: iOS 자동화 테스트 - (1) PC와 iOS 디바이스 연결 및 iOS UI 객체 인식과 제어(자동화 테스트 도구와 환경)
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


### **PC와 iOS 디바이스 연결 및 iOS UI 객체 인식과 제어: 자동화 테스트 도구와 환경**

---

### **1. PC와 iOS 디바이스 연결을 위한 도구**

#### **1.1 지원 도구**
1. **usbmuxd**:
   - **iOS 17 미만**에서 PC와 iOS 디바이스 간 **USB 기반 통신**을 지원.
   - iTunes 설치 시 포함된 **Apple Mobile Service**를 통해 PC에서 사용 가능.
   - 주요 역할:
     - PC와 iOS 간의 **TCP 포트 프록시**를 제공.
     - iOS 장치와의 데이터 송수신 및 디버깅 작업 지원.

2. **pymobiledevice3**:
   - iOS 디바이스와의 통신을 위한 오픈 소스 Python 라이브러리.
   - **CLI(Command Line Interface)**와 **Python API**를 제공.
   - **iOS 17 이상**에서 **RemoteXPC** 기반 보안 통신을 지원.

3. **iTunes (Windows)**:
   - iOS 디바이스와의 기본 연결 및 데이터 동기화.
   - **Apple Mobile Service**를 포함하여 USB 기반 연결 제공.

4. **libimobiledevice**:
   - **오픈 소스 도구**로, Linux에서 iOS 디바이스와의 통신 지원.
   - iOS 17 미만 버전에 적합.

---

### **2. iOS UI 객체 인식 및 제어를 위한 자동화 테스트 도구**

#### **2.1 WebDriverAgent (WDA)**
- **역할**:
  - iOS UI를 제어하는 서버.
  - Appium과 같은 클라이언트가 WDA를 통해 iOS 장치의 UI 요소를 탐색하고 조작.
- **특징**:
  - iOS 장치에 설치되어 HTTP 요청으로 명령을 처리.
  - 버튼 클릭, 텍스트 입력, 화면 스크롤 등을 자동화.

#### **2.2 XCUITest**
- **역할**:
  - **iOS 공식 UI 테스트 프레임워크**.
  - XCTest 기반으로, WDA와 함께 UI 자동화에 사용.
- **특징**:
  - UI 요소의 탐색 및 동작 수행.
  - 앱의 성능, 안정성 테스트 가능.

#### **2.3 WebKit Proxy**
- **역할**:
  - iOS 앱의 WebView를 디버깅.
  - DOM 구조, CSS 스타일, JavaScript 오류를 확인하고 수정 가능.
- **사용 명령어**:
  ```bash
  ios_webkit_debug_proxy -c <UDID>:<PORT>
  ```

#### **2.4 DeveloperDiskImage (DDI)**
- **역할**:
  - iOS 장치의 개발자 모드를 활성화.
  - 디버깅, 프로파일링, XCUITest 실행을 지원.
- **특징**:
  - iOS 버전에 맞는 DDI를 선택하여 장치에 마운트 필요.

---

### **3. PC와 iOS 디바이스 연결 환경에서 사용되는 프로토콜**

#### **3.1 주요 프로토콜**

| **프로토콜**         | **역할 및 특징**                                                                 |
|----------------------|-------------------------------------------------------------------------------|
| **usbmuxd**          | USB를 통해 PC와 iOS 간 TCP 포트 프록싱. **iOS 17 미만**에서 사용.                    |
| **RemoteXPC**        | **iOS 17 이상**에서 보안 통신 터널을 제공. RSD를 통해 터널 주소 및 포트를 설정.            |
| **TCP**              | 데이터 송수신을 위한 신뢰성 있는 전송 프로토콜. RemoteXPC 터널의 기본 통신 방식.           |
| **RSD**              | **Remote Service Discovery**: iOS 장치의 서비스 주소와 포트를 검색.                      |
| **XPC**              | Apple의 내부 **Cross-Process Communication** 프로토콜. RemoteXPC의 기반.               |


#### **3.2 연결 원리**

1. **iOS 17 미만**:
   - **usbmuxd**를 통해 USB로 PC와 iOS 디바이스를 연결.
   - TCP 포트 프록시를 통해 WDA 및 WebKit Proxy와 통신.

2. **iOS 17 이상**:
   - **RemoteXPC** 기반으로 보안 터널 생성.
   - **RSD**를 사용해 터널의 주소와 포트를 검색.
   - 터널을 통해 WDA 및 개발자 서비스와 통신.


---


### **4. iOS 17 미만과 이상의 차이점**

#### **4.1 연결 방식**
- **iOS 17 미만**:
  - **usbmuxd**를 통해 USB 연결.
  - 별도의 보안 터널 없이 TCP 포트를 직접 사용.

- **iOS 17 이상**:
  - **RemoteXPC** 기반의 보안 터널 필수.
  - 터널 설정을 위해 **RSD**를 사용하여 장치의 주소와 포트를 검색.

#### **4.2 보안**
- **iOS 17 미만**:
  - 기본적인 페어링 과정으로 신뢰 관계 설정.
  - 통신이 단순하고 직접적.

- **iOS 17 이상**:
  - 강화된 보안 요구사항:
    - RemoteXPC로 모든 통신이 암호화된 터널을 통해 이루어짐.
    - 추가 페어링 및 인증 과정 필요.

#### **4.3 개발자 도구 활용**
- **iOS 17 미만**:
  - 기존의 개발자 도구(libimobiledevice 등)로 대부분의 작업 가능.

- **iOS 17 이상**:
  - pymobiledevice3와 같은 도구 필요.
  - 새로운 API와 터널링 방식 학습 필요.

---

### **5. 요약 정리**

1. **PC와 iOS 디바이스 연결 도구**:
   - **usbmuxd**: iOS 17 미만.
   - **pymobiledevice3**: iOS 17 이상.

2. **자동화 테스트 핵심 도구**:
   - **WDA**: UI 제어 서버.
   - **XCUITest**: 공식 UI 테스트 프레임워크.
   - **WebKit Proxy**: WebView 디버깅.
   - **DDI**: 개발자 모드 활성화.

3. **iOS 17 미만과 이상 차이**:
   - **17 미만**: usbmuxd 기반, 간단한 통신.
   - **17 이상**: RemoteXPC 기반, 보안 터널 필수.
