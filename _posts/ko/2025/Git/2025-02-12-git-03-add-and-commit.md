---
title: Git - 03 - git add 와 git commit의 역할과 차이점
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
description:  git add 와 git commit에 대한 이해
article_tag1: Git
article_tag2: 
article_tag3: 
article_section: Git
meta_keywords: Git, Branch
last_modified_at: '2025-02-12 21:00:00 +0800'
---


### **📌 `git add` 와 `git commit`의 역할과 차이점**

Git을 사용하다 보면 **`git add`** 와 **`git commit`** 을 자주 사용하게 됩니다.  
이 두 명령어는 각각 **다른 역할**을 하며, Git의 저장 방식과 밀접한 관련이 있습니다.  

---

## **🛠 `git add`란?**
✅ **"변경된 파일을 스테이징(Staging Area)에 올리는 작업"**  
즉, **현재 작업한 변경 사항을 Git이 추적할 수 있도록 준비하는 과정**입니다.

**📌 예제: 파일 추가 후 `git add` 실행**
```bash
echo "Hello Git" > hello.txt  # 파일 생성
git status  # 변경된 파일 확인
git add hello.txt  # 스테이징
git status  # 스테이징 된 파일 확인
```
`git status` 를 실행하면 **"Changes to be committed"** 상태가 됩니다.

✅ `git add`를 하면 변경된 파일이 **"스테이징 영역(Staging Area)"** 에 올라감  
✅ 하지만 아직 **로컬 저장소(Local Repository)에 영구 저장된 상태는 아님!**  

---

## **🛠 `git commit`이란?**
✅ **"스테이징된 변경 사항을 로컬 저장소(Local Repository)에 영구 저장하는 작업"**  
✅ 즉, **현재까지의 변경 사항을 하나의 버전(스냅샷)으로 기록하는 것**  

**📌 예제: `git commit` 실행**
```bash
git commit -m "Add hello.txt file"
```
이제 이 변경 사항이 **로컬 저장소(Local Repository)** 에 저장되었습니다.

✅ **`git commit`을 하면 변경 사항이 로컬 저장소에 확정됨**  
✅ **이전 상태로 되돌릴 수도 있음 (`git log` 로 커밋 기록 확인 가능)**  

---

## **📌 `git add` 후 `git commit` 하기 전과 후의 차이점**
| 상태 | 설명 |
|------|------|
| **`git add` 전** | 파일이 수정되었지만, Git이 추적하지 않음 (`Untracked` 상태) |
| **`git add` 후 (`Staging Area`)** | Git이 변경된 내용을 추적하지만, 아직 영구 저장되지 않음 |
| **`git commit` 후 (`Local Repository`)** | 변경 사항이 Git의 로컬 저장소에 기록됨 (스냅샷 생성) |

**📌 예제: `git status` 로 상태 확인**
```bash
echo "New line" >> hello.txt  # 파일 수정
git status  # 변경 사항 확인 (Untracked 상태)
git add hello.txt
git status  # 스테이징 상태 (Changes to be committed)
git commit -m "Update hello.txt"
git status  # Working tree clean (로컬 저장소에 저장됨)
```

---

## **📌 그럼 `git commit` 하면 어디에 저장될까?**
✅ **Git의 로컬 저장소(Local Repository)에 저장됨**  
✅ **파일 자체가 저장되는 것이 아니라, "변경 사항(스냅샷)"이 저장됨**  
✅ **모든 커밋은 고유한 `SHA-1` 해시값을 가짐 (`git log` 로 확인 가능)**  

```bash
git log --oneline
```
출력 예시:
```
3f5c9d2 Add hello.txt file
1a2b3c4 Initial commit
```

이제 이 커밋을 원격 저장소(`origin`, GitHub 등)에 업로드하려면 `git push`를 사용하면 됩니다.

---

## **📌 정리**
| 명령어 | 역할 | 저장 위치 |
|--------|------|----------|
| git add | 변경된 파일을 스테이징 영역에 추가 | **스테이징 영역 (Staging Area)** |
| git commit | 스테이징된 변경 사항을 로컬 저장소에 영구 저장 | **로컬 저장소 (Local Repository)** |
| git push | 로컬 저장소의 커밋을 원격 저장소로 업로드 | **원격 저장소 (Remote Repository)** |

