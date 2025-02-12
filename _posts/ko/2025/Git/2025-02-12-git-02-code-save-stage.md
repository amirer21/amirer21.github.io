---
title: Git - 02 - 코드가 저장되는 영역별 구조
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
description:  Staging Area 와 Local, Remote Repository 이해
article_tag1: Git
article_tag2: 
article_tag3: 
article_section: Git
meta_keywords: Git, Branch
last_modified_at: '2025-02-12 21:00:00 +0800'
---


# **📌 Git에서 코드가 저장되는 영역별 구조**
Git은 파일을 **여러 저장 영역(Stage)** 에 걸쳐 관리하며, **각 단계에서 파일이 저장되는 방식**이 다릅니다.  
Git에서 코드가 저장되는 주요 영역은 다음과 같습니다:

### **1️⃣ 작업 디렉토리 (Working Directory)**
### **2️⃣ 스테이징 영역 (Staging Area, Index)**
### **3️⃣ 로컬 저장소 (Local Repository)**
### **4️⃣ 원격 저장소 (Remote Repository)**

---

## **🛠 1️⃣ 작업 디렉토리 (Working Directory)**
**📌 역할:**  
- 실제로 **파일을 생성하고 수정하는 영역**
- Git이 아직 **추적하지 않거나(Untracked)** 변경이 이루어진 파일이 존재하는 공간

**📌 특징:**  
✅ Git이 직접 관리하지 않는 상태의 파일 (`Untracked`)  
✅ 수정했지만 아직 Git에 반영되지 않은 파일 (`Modified`)  

**📌 예제:**
```bash
echo "Hello Git" > hello.txt  # 새 파일 생성
git status  # 상태 확인
```
> **출력 예시 (Git이 아직 추적하지 않는 파일)**
```
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        hello.txt
```
💡 **즉, 작업 디렉토리는 파일을 편집하는 공간이지만, Git이 바로 추적하지는 않음!**

---

## **🛠 2️⃣ 스테이징 영역 (Staging Area, Index)**
**📌 역할:**  
- 커밋할 파일을 **준비(추적)** 하는 공간  
- `git add` 명령을 실행하면 **변경 사항이 스테이징 영역에 추가됨**

**📌 특징:**  
✅ Git이 추적하는 상태 (`Staged`)  
✅ `git commit`을 실행하면 **로컬 저장소로 이동**

**📌 예제:**
```bash
git add hello.txt  # 스테이징 영역에 추가
git status  # 상태 확인
```
> **출력 예시 (스테이징 상태)**
```
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        new file:   hello.txt
```
💡 **즉, 스테이징 영역은 "Git에 커밋할 준비가 된 변경 사항을 저장하는 공간"!**

---

## **🛠 3️⃣ 로컬 저장소 (Local Repository)**
**📌 역할:**  
- `git commit`을 실행하면 **로컬 저장소(Local Repository)** 에 영구 저장됨
- Git이 관리하는 `.git` 폴더 내부에서 **히스토리(스냅샷)로 기록됨**
- 필요할 때 **과거 버전으로 되돌릴 수 있음**

**📌 특징:**  
✅ `git commit`을 하면 **로컬 저장소에 스냅샷으로 저장됨**  
✅ `git log` 를 통해 커밋 히스토리 확인 가능  
✅ `.git/objects` 폴더에 내부적으로 관리됨  

**📌 예제:**
```bash
git commit -m "Add hello.txt file"
git status  # 상태 확인
```
> **출력 예시 (커밋 완료)**
```
On branch main
nothing to commit, working tree clean
```
💡 **즉, 로컬 저장소는 "내 컴퓨터에 저장되는 Git의 버전 관리 공간"!**

---

## **🛠 4️⃣ 원격 저장소 (Remote Repository)**
**📌 역할:**  
- `git push` 명령을 실행하면 **원격 저장소(GitHub, GitLab, Bitbucket 등)로 업로드됨**
- 협업을 위해 여러 개발자들과 코드 공유 가능
- `git clone` 또는 `git pull` 로 원격 저장소에서 코드를 가져올 수 있음

**📌 특징:**  
✅ 원격 서버(GitHub, GitLab 등)에 저장됨  
✅ `git push` 명령을 실행해야 반영됨  
✅ 협업을 위한 브랜치 관리 가능  

**📌 예제:**
```bash
git push origin main  # 원격 저장소로 코드 업로드
```
> **출력 예시 (원격 저장소에 업로드 완료)**
```
To github.com:user/repo.git
 * [new branch]      main -> main
```
💡 **즉, 원격 저장소는 "GitHub 등의 서버에서 공유되는 코드 저장 공간"!**

---

## **🔍 Git에서 코드가 저장되는 흐름**
```
[ 작업 디렉토리 ] --(git add)--> [ 스테이징 영역 ] --(git commit)--> [ 로컬 저장소 ] --(git push)--> [ 원격 저장소 ]
```
| 상태 | 명령어 | 설명 |
|------|--------|------|
| 작업 디렉토리 (Working Directory) | `git status` | 파일을 생성하거나 수정한 상태 |
| 스테이징 영역 (Staging Area) | `git add` | 변경된 파일을 커밋할 준비 완료 |
| 로컬 저장소 (Local Repository) | `git commit` | 변경 사항이 기록되어 버전 관리됨 |
| 원격 저장소 (Remote Repository) | `git push` | 원격 서버(GitHub 등)에 업로드됨 |

---

## **📌 정리**
### **Git의 주요 저장 공간**
| **영역** | **역할** | **관련 명령어** |
|---------|--------|----------------|
| **작업 디렉토리 (Working Directory)** | 파일을 생성하고 수정하는 공간 | `git status`, `git diff` |
| **스테이징 영역 (Staging Area, Index)** | `git add`를 실행하면 커밋할 준비 상태 | `git add`, `git restore --staged` |
| **로컬 저장소 (Local Repository)** | `git commit` 하면 영구 저장됨 | `git commit`, `git log` |
| **원격 저장소 (Remote Repository)** | `git push` 하면 서버(GitHub 등)에 업로드 | `git push`, `git pull`, `git clone` |

---

## **💡 마무리**
1. **`git add` 하면 변경 사항이 "스테이징 영역"에 저장됨**
2. **`git commit` 하면 변경 사항이 "로컬 저장소"에 영구 저장됨**
3. **`git push` 하면 원격 저장소(GitHub 등)에 업로드됨**
4. **Git은 "변경 사항(스냅샷)"만 저장하므로 효율적인 버전 관리가 가능함**
