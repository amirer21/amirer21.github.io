---
title: iOS 자동화 테스트 - (4) iOS 장치 연결부터 테스트 과정까지의 로직
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


### **iOS 장치 연결부터 테스트 과정까지의 로직**

---

### **1. 장치 연결부터 테스트 과정의 전체 흐름**


### **iOS 자동화 테스트의 흐름도**

아래는 장치 연결부터 테스트 실행까지의 과정을 도식화로 표현한 흐름도입니다.

---

```plaintext
1. PC와 iOS 장치 연결
   ┌─────────────────────────────────────────────────────────────┐
   │                                                             │
   │ PC (Python 실행 환경)                                       │
   │ ┌─────────────────────────────────────────────────────────┐ │
   │ │ CLI 명령어 or Python API                                │ │
   │ │ e.g., pymobiledevice3 lockdown start-tunnel             │ │
   │ └─────────────────────────────────────────────────────────┘ │
   │                                                             │
   └─────────────────────────────────────────────────────────────┘
                 │
                 ▼
   ┌──────────────────────────┐
   │ 2. 터널 생성 (RemoteXPC) │
   │                          │
   │ - RSD 주소 및 포트 검색  │
   │ - 보안 터널 설정         │
   └──────────────────────────┘
                 │
                 ▼
   ┌──────────────────────────────┐
   │ 3. DeveloperDiskImage (DDI)  │
   │      마운트                  │
   │                              │
   │ - 장치 디버깅 및 프로파일링  │
   │ - UI 테스트 활성화          │
   └──────────────────────────────┘
                 │
                 ▼
   ┌──────────────────────────────┐
   │ 4. WebDriverAgent (WDA) 실행 │
   │                              │
   │ - WDA 서버 시작              │
   │ - HTTP 요청 대기             │
   │                              │
   └──────────────────────────────┘
                 │
                 ▼
   ┌──────────────────────────────┐
   │ 5. XCUITest 실행             │
   │                              │
   │ - UI 테스트 자동화 실행      │
   │ - 버튼 클릭, 텍스트 입력 등  │
   │ - 결과 반환                  │
   └──────────────────────────────┘
```

### **흐름 요약**

```plaintext
[PC와 iOS 장치 연결] → [터널 생성] → [DDI 마운트] → [WDA 실행] → [XCUITest 실행]
```

1. **PC와 iOS 장치 연결, 탐지**:
   - USB 또는 Wi-Fi로 PC와 iOS 장치를 연결.
   - Windows 환경에서도 iTunes 설치를 통해 연결 지원.
   - iOS 17 이상에서는 **터널링**을 통해 통신 준비.
   - iOS 17 미만에서는 **usbmuxd**로 간단히 연결.

2. **터널 생성**:
   - iOS 17 이상에서는 **RemoteXPC** 기반 보안 터널 필요.
   - RSD로 터널 주소(`RSD Address`)와 포트(`RSD Port`)를 검색 후 설정.

3. **DeveloperDiskImage(DDI) 마운트**:
   - 장치를 **개발자 모드로 전환**하여 디버깅과 테스트를 활성화.

4. **WebDriverAgent(WDA) 실행**:
   - WDA 서버를 장치에 설치하고 실행하여 테스트 요청을 받을 준비.
   - **WebDriverAgent 서버**를 실행하여 클라이언트(예 : Appium) 요청을 처리.

5. **XCUITest 실행**:
   - WDA와 통합된 XCUITest를 통해 UI 제어 및 자동화 테스트 실행.
   - 클라이언트 요청에 따라 UI 테스트 실행.
   - UI 요소를 탐색하고 작업을 수행한 결과를 반환.

6. **테스트 결과 반환**:
   - 테스트 완료 후 결과를 PC로 전송.

---

### **2. 터널 생성: 이유와 역할**

#### **2.1 터널 생성이 필요한 이유**
- **iOS 17 이상에서는 RemoteXPC 기반 보안 통신 필수**:
  - 보안 요구사항 강화로 인해 기존의 직접 통신(usbmuxd)이 불가능.
  - RemoteXPC는 보안 터널을 생성하여 데이터를 암호화하고 안전하게 송수신.

#### **2.2 터널 생성의 과정**
1. **터널 시작**:
   ```bash
   pymobiledevice3 lockdown start-tunnel
   ```
   - Remote Service Discovery(RSD)를 통해 장치의 주소와 포트를 검색.
2. **터널 설정**:
   - 터널 주소(`RSD Address`)와 포트(`RSD Port`)를 기반으로 통신.

#### **2.3 터널의 역할**
- **보안**:
  - 데이터 암호화로 안전한 통신 보장.
- **서비스 접근**:
  - WebDriverAgent, WebKit Debug Proxy 등 개발자 서비스를 실행하고 관리.

---

### **3. DeveloperDiskImage(DDI): 역할과 마운트의 의미**

#### **3.1 DDI란 무엇인가?**
- **DeveloperDiskImage**:
  - iOS 장치에서 **디버깅 및 개발자 기능**을 활성화하기 위한 디스크 이미지 파일.
  - Apple이 iOS 버전별로 제공하며, 해당 이미지가 마운트되지 않으면 디버깅 및 XCUITest 실행 불가능.

#### **3.2 DDI의 역할**
1. **디버깅 활성화**:
   - 앱의 성능 분석, 메모리 디버깅 등을 지원.
2. **테스트 지원**:
   - XCUITest, WDA 실행에 필요한 환경 제공.
3. **개발자 전용 서비스 활성화**:
   - 프로세스 관리, 위치 시뮬레이션 등.

#### **3.3 마운트(Mount)의 의미**
- **마운트**는 특정 디스크 이미지(Disk Image)를 장치의 파일 시스템에 연결하여 사용할 준비를 하는 작업.
- **DDI 마운트 과정**:
  1. 장치와 연결.
  2. pymobiledevice3를 통해 자동으로 DDI를 마운트:
     ```bash
     pymobiledevice3 mounter auto-mount
     ```
  3. 성공 시 장치에서 디버깅 및 테스트 가능.

---

### **4. WebDriverAgent(WDA): 원리와 역할**

#### **4.1 WDA란?**
- **WebDriverAgent**:
  - iOS UI를 제어하는 HTTP 기반 **자동화 서버**.
  - 클라이언트(Appium 등)와 iOS 장치 간의 중간 브릿지 역할 수행.

#### **4.2 WDA의 원리**
1. **서버 역할**:
   - WDA는 iOS 장치에서 실행되며, HTTP 요청을 처리하여 iOS UI 제어.
   - 예: 버튼 클릭, 텍스트 입력, 화면 스크롤.
2. **통신 흐름**:
   - 클라이언트 → WDA 서버 → iOS UI.
   - 클라이언트가 WDA에 명령을 보내면, WDA가 iOS 장치의 UI를 조작.
3. **XCUITest 통합**:
   - WDA는 XCUITest와 통합되어 iOS 공식 UI 테스트 프레임워크를 사용.

#### **4.3 WDA 실행 과정**
1. **설치 및 실행**:
   - WDA를 iOS 장치에 설치:
     ```bash
     pymobiledevice3 developer dvt launch com.apple.mobilesafari
     ```
   - FBWebServer를 통해 HTTP 요청을 수신.
2. **클라이언트와 통신**:
   - 클라이언트(Appium)가 WDA 서버에 명령을 전달.

#### **4.4 WDA의 주요 기능**
- UI 요소 탐색 및 제어:
  - 버튼 클릭, 텍스트 입력, 화면 스크롤.
- 디버깅 지원:
  - UI 상태 정보 제공.
- 테스트 실행 및 결과 반환.

---

### **5. 로직 요약**

| **단계**                 | **작업 내용**                                                                                         |
|--------------------------|-----------------------------------------------------------------------------------------------------|
| **1. 장치 연결**          | USB 또는 Wi-Fi로 PC와 iOS 연결.                                                                     |
| **2. 터널 생성**          | RemoteXPC 기반 보안 터널 생성. RSD를 통해 장치 주소와 포트 검색.                                       |
| **3. DDI 마운트**         | DeveloperDiskImage를 장치에 연결하여 디버깅 및 테스트 활성화.                                           |
| **4. WDA 실행**           | WebDriverAgent를 통해 iOS UI 제어 서버 실행.                                                         |
| **5. XCUITest 실행**      | UI 제어 및 테스트 실행. 버튼 클릭, 텍스트 입력 등 작업 수행 후 결과 반환.                                |

---

### **6. 요약 정리**

1. **터널 생성 이유**:
   - iOS 17 이상에서 **보안 요구사항 강화**로 RemoteXPC 기반 통신 필수.

2. **DDI란?**:
   - iOS 장치를 개발자 모드로 전환하는 **디스크 이미지**.
   - 디버깅과 XCUITest 실행의 전제 조건.

3. **WDA의 원리**:
   - **iOS UI 제어 서버**로, 클라이언트(Appium)가 명령을 전달하면 WDA가 실행.
   - XCUITest와 통합하여 UI 테스트를 공식 지원.


> **"터널은 보안, DDI는 디버깅 활성화, WDA는 UI 제어 서버"**  