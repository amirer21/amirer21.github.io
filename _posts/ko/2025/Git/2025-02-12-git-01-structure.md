---
title: Git - 01 -구조와 코드 저장 방식
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Git
tags:
- Git
- Branch
- 
toc: true
toc_sticky: true
toc_label: 목차
description:  git 구조 기본 이해
article_tag1: Git
article_tag2: 
article_tag3: 
article_section: Git
meta_keywords: Git, Branch
last_modified_at: '2025-02-12 21:00:00 +0800'
---


# **📌 Git의 구조와 코드 저장 방식**

Git은 단순한 파일 저장소가 아니라 **분산형 버전 관리 시스템(DVCS)** 입니다.  
즉, **파일의 변경 내역을 기록하고, 언제든 과거 버전으로 되돌릴 수 있도록 관리**하는 시스템입니다.

Git의 구조는 크게 다음과 같은 4가지 핵심 요소로 이루어집니다:

---
## **1️⃣ Git의 기본 구조**
```
작업 디렉토리 (Working Directory)  --->  스테이징 영역 (Staging Area)  --->  로컬 저장소 (Local Repository)  --->  원격 저장소 (Remote Repository)
```

| **영역**               | **역할** |
|----------------------|--------|
| **작업 디렉토리 (Working Directory)** | 사용자가 작업하는 실제 파일이 있는 곳 |
| **스테이징 영역 (Staging Area, Index)** | 커밋할 준비가 된 변경 사항을 저장 |
| **로컬 저장소 (Local Repository)** | 사용자의 PC에 저장되는 Git 데이터베이스 (`.git` 폴더) |
| **원격 저장소 (Remote Repository)** | GitHub, GitLab 등 원격 서버에 저장된 저장소 |

---
## **2️⃣ Git의 내부 구조**
Git은 파일을 일반적인 방식으로 저장하지 않고, **SHA-1 해시를 기반으로 한 객체 저장소**를 사용합니다.  
파일을 변경할 때마다 전체 파일을 저장하는 것이 아니라, **차이점(Diff)과 스냅샷(Snapshot)을 저장**합니다.

Git 저장 방식은 **4가지 주요 객체**를 통해 관리됩니다:
- **Blob (Binary Large Object)**
- **Tree (트리)**
- **Commit (커밋)**
- **Tag (태그)**

---

### **📌 1. Blob (블롭) – 파일 내용 저장**
✅ **Blob은 Git이 파일을 저장하는 방식**입니다.  
✅ Git은 파일을 그대로 저장하지 않고, **파일의 내용을 해시(SHA-1) 값으로 변환하여 저장**합니다.

**📌 예제:**
```bash
echo "Hello Git" > hello.txt  # 파일 생성
git add hello.txt  # 스테이징
```
이때 `hello.txt` 파일의 내용이 **SHA-1 해시값**을 사용하여 `.git/objects/` 내부에 저장됩니다.

**📌 저장 방식 예시 (`ls .git/objects/`)**
```
.git/objects/
    ├── a1
    │   └── b2c3d4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9
```
💡 **즉, Git은 파일을 직접 저장하는 것이 아니라, 파일 내용을 해시로 변환하여 Blob으로 저장함!**

---

### **📌 2. Tree (트리) – 디렉토리 구조 저장**
✅ Tree는 **파일과 폴더(디렉토리) 구조를 저장하는 객체**입니다.  
✅ 커밋할 때 **Tree는 Blob과 Tree를 포함**하여 폴더 구조를 유지합니다.

**📌 예제:**
```bash
mkdir project
cd project
echo "Hello Git" > file1.txt
echo "Git is amazing" > file2.txt
git add .
git commit -m "Initial commit"
```
이제 `.git/objects/` 내부에는 **Tree 객체**가 생성됩니다.

**📌 Tree 저장 방식**
```
Tree
├── Blob (file1.txt)
├── Blob (file2.txt)
└── Tree (서브 디렉토리)
```
💡 **즉, Tree는 Blob(파일)과 다른 Tree(폴더)를 연결하여 파일 시스템 구조를 저장함!**

---

### **📌 3. Commit (커밋) – 버전 정보 저장**
✅ Commit은 **Git이 변경 사항을 기록하는 방식**입니다.  
✅ Commit은 **Tree를 가리키며**, **이전 커밋(Parent Commit)을 포함**하여 연결 리스트 형태로 저장됩니다.

**📌 커밋 예제**
```bash
git commit -m "Add file1.txt and file2.txt"
```
이제 `.git/objects/` 내부에 **Commit 객체**가 생성됩니다.

**📌 Commit 저장 방식**
```
Commit
├── Parent Commit (이전 커밋)
├── Tree (현재 디렉토리 구조)
├── Author (작성자)
└── Message (커밋 메시지)
```
💡 **즉, Commit은 특정 시점의 Tree를 가리키며, 변경 이력을 연결하는 역할!**

---

### **📌 4. Tag (태그) – 특정 커밋에 레이블 지정**
✅ Tag는 **특정 커밋을 가리키는 객체**입니다.  
✅ 보통 **소프트웨어 버전(Tag v1.0.0 등)을 만들 때 사용**됩니다.

**📌 태그 생성 예제**
```bash
git tag v1.0.0
git show v1.0.0  # 태그 상세 정보 확인
```
💡 **즉, Tag는 특정 커밋을 쉽게 참조할 수 있도록 하는 라벨 역할!**

---

## **📌 Git의 전체 저장 과정**
Git에서 파일이 어떻게 저장되는지 전체 과정을 정리하면 다음과 같습니다:

### **🚀 1. 파일 추가**
```
[ Working Directory ]
    |
    |-- (git add) -->  [ Staging Area ]
```
- `git add` 실행 → **Blob이 생성되고 Staging Area에 등록됨**

---

### **🚀 2. 커밋**
```
[ Staging Area ]
    |
    |-- (git commit) -->  [ Local Repository ]
```
- `git commit` 실행 → **Tree + Commit 객체가 생성됨**

---

### **🚀 3. 원격 저장소로 푸시**
```
[ Local Repository ]
    |
    |-- (git push) -->  [ Remote Repository ]
```
- `git push` 실행 → **원격 저장소(GitHub 등)로 업로드됨**

---

## **📌 정리: Git에서 코드가 저장되는 방식**
| **영역** | **설명** | **저장 방식** |
|----------|---------|--------------|
| **Working Directory** | 사용자가 실제로 작업하는 파일 위치 | 일반 파일 시스템 |
| **Staging Area** | `git add` 후 커밋 대기 중인 변경 사항 | Blob (SHA-1 해시) |
| **Local Repository** | `git commit` 하면 저장되는 공간 | Commit + Tree + Blob |
| **Remote Repository** | `git push` 하면 업로드되는 원격 저장소 | 원격 서버 (GitHub, GitLab 등) |

---

## **🔍 마무리**
### **📌 Git이 코드를 저장하는 방식**
1. **파일의 변경 사항을 직접 저장하는 것이 아니라, 해시(SHA-1) 기반의 Blob, Tree, Commit 구조로 저장**
2. **Commit은 이전 커밋을 가리키면서 버전 이력을 관리하는 연결 리스트 형태**
3. **Staging Area → Local Repository → Remote Repository 순서로 코드가 저장됨**
4. **각 단계마다 Git이 "변경 사항(스냅샷)"을 저장하고, 필요할 때 되돌릴 수 있음**


Git이 단순히 파일을 저장하는 것이 아니라 버전 관리 시스템을 통해 데이터를 효율적으로 관리하는 방식입니다.