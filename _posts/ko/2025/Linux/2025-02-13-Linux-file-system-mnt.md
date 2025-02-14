---
title: Linux - 파일시스템 mnt(Mount)란?
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Linux
tags:
- Linux
- mnt
- 
toc: true
toc_sticky: true
toc_label: 목차
description:  mnt 마운트는 무엇이고 어디에 쓰일까까
article_tag1: Linux
article_tag2: 
article_tag3: 
article_section: Linux
meta_keywords: Linux, mnt
last_modified_at: '2025-02-13 21:00:00 +0800'
---


`mnt`는 **"mount"**의 약자로, 일반적으로 **파일 시스템을 마운트(mount)하는 디렉터리**를 의미합니다.  

### 1. **`/mnt`란?**
- 리눅스와 유닉스 계열 운영체제에서는 특정 장치를 시스템에 연결할 때 마운트(mount)라는 과정을 거칩니다.
- `/mnt`는 **일시적으로 마운트된 파일 시스템을 보관하는 표준 디렉터리**입니다.
- 보통 외부 스토리지(예: USB, 외장하드), 네트워크 드라이브, 추가적인 디스크 파티션을 연결할 때 사용됩니다.

### 2. **어디에서 사용되는가?**
다음과 같은 경우에 `/mnt`를 사용할 수 있습니다.

#### ① **외장 드라이브 연결**
```bash
sudo mount /dev/sdb1 /mnt
```
- `/dev/sdb1` (예: USB 드라이브)을 `/mnt`에 마운트하면 `/mnt` 아래에서 드라이브의 파일을 접근할 수 있습니다.

#### ② **네트워크 드라이브 마운트**
```bash
sudo mount -t nfs 192.168.1.10:/shared /mnt
```
- `192.168.1.10` 서버의 공유 폴더 `/shared`를 `/mnt`에 마운트하면 해당 폴더를 로컬 디렉터리처럼 사용할 수 있습니다.

#### ③ **ISO 파일 마운트**
```bash
sudo mount -o loop ubuntu.iso /mnt
```
- `ubuntu.iso`를 `/mnt`에 마운트하여 직접 파일을 확인할 수 있습니다.

### 3. **`/mnt`와 `/media`의 차이**
| 디렉터리  | 용도 |
|-----------|------|
| `/mnt`    | 수동으로 마운트할 때 사용 (일시적인 마운트) |
| `/media`  | GUI 환경에서 자동으로 마운트되는 장치 (예: USB, CD-ROM) |

- 예를 들어, 데스크톱 환경에서 USB를 연결하면 `/media/username/USB_DRIVE_NAME/` 같은 경로로 자동 마운트됨.

### 4. **WSL(Windows Subsystem for Linux)에서 `mnt`**
- WSL(Windows의 리눅스 서브시스템)에서는 Windows의 드라이브를 `/mnt`에 마운트합니다.
- 예를 들어, `C:\` 드라이브는 WSL에서 `/mnt/c/`로 접근할 수 있습니다.

```bash
cd /mnt/c/Users/yourname/
```

### 5. **Docker 컨테이너에서 `mnt`**
- Docker에서는 `/mnt`를 **볼륨 마운트**나 임시 저장소로 사용할 수도 있습니다.
```bash
docker run -v /mnt/data:/app/data my_container
```
- 이 경우, 호스트 시스템의 `/mnt/data`가 컨테이너 내부 `/app/data`에 마운트됨.

### 6. **결론**
- `/mnt`는 마운트 포인트로 사용되는 디렉터리이며, **수동 마운트**할 때 주로 사용됨.
- 외장 드라이브, 네트워크 스토리지, ISO 파일, Docker 볼륨 마운트 등에 활용됨.
- WSL에서는 Windows 드라이브(`/mnt/c` 등)를 연결하는 용도로 사용됨.
