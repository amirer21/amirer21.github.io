---
title: Git - 05 - cherry-pick 이란?
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
description:  cherry pick 은 무엇이고 언제 써야되는 걸까?
article_tag1: Git
article_tag2: 
article_tag3: 
article_section: Git
meta_keywords: Git, Branch
last_modified_at: '2025-02-12 21:00:00 +0800'
---


## **🍒 Git `cherry-pick` 이란?**
### **📌 `cherry-pick` 개념**
`git cherry-pick`은 **특정 커밋만 선택해서 현재 브랜치에 적용하는 Git 명령어**입니다.  
즉, **다른 브랜치에서 특정 커밋만 가져와서 반영할 때** 사용합니다.

> **💡 예를 들어:**  
> `feature/ABC-123` 브랜치에서 `B 브랜치`로 가야 할 코드를 실수로 작업한 경우,  
> `git cherry-pick`을 사용하면 **특정 커밋만** `B 브랜치`에 가져올 수 있습니다.

---

### **📌 `cherry-pick`을 쓰는 이유**
보통 Git에서 특정 브랜치의 코드를 가져오는 방법은 **`merge` 또는 `rebase`** 가 있습니다.  
하지만 `merge`나 `rebase`를 하면 **전체 변경 사항**이 반영됩니다.  
그렇다면...  
✅ **"특정 커밋만 가져오고 싶다면?"**  
➡️ 이때 `git cherry-pick`을 사용하면 됩니다!

---

## **🍒 체리(Cherry)는 왜 붙었을까?**
Git에서 `cherry-pick`이란 단어는 **"체리 따기"** 에서 유래했습니다.  
즉, **체리 나무에서 원하는 열매(커밋)만 골라 따듯이**,  
Git에서도 **필요한 커밋만 골라서 가져오는 방식**을 의미합니다.

---

## **🛠 `git cherry-pick` 사용 방법**

### **✅ 1. 특정 커밋을 가져오기**
먼저, **가져오고 싶은 커밋의 해시(commit hash)를 확인**해야 합니다.
```bash
git log --oneline
```
출력 예시:
```
a1b2c3d Modify report template UI and update env settings
d4e5f6g Fix bug in authentication flow
```
위에서 `a1b2c3d` 커밋을 가져오고 싶다면:
```bash
git cherry-pick a1b2c3d
```
이제 해당 커밋이 **현재 브랜치에 적용됩니다.** 🚀

---

### **✅ 2. 여러 개의 커밋 가져오기**
한 번에 여러 개의 커밋을 선택하려면:
```bash
git cherry-pick a1b2c3d d4e5f6g
```

---

### **✅ 3. 특정 브랜치의 마지막 커밋 가져오기**
다른 브랜치(`feature/ABC-123` 브랜치)의 최신 커밋을 가져오려면:
```bash
git cherry-pick feature/ABC-123
```
✅ 이렇게 하면 **feature/ABC-123의 최신 커밋만** 현재 브랜치에 반영됩니다!

---

### **⚠️ `cherry-pick` 중 충돌이 발생하면?**
만약 `cherry-pick` 과정에서 충돌(conflict)이 발생하면:
```bash
git status  # 충돌이 난 파일 확인
```
충돌을 해결한 후:
```bash
git add .
git cherry-pick --continue
```
✅ 정상적으로 `cherry-pick`이 완료됩니다.

---

## **🍒 `cherry-pick` vs `merge` vs `rebase` 비교**
| 기능 | `merge` | `rebase` | `cherry-pick` |
|---|---|---|---|
| **용도** | 전체 브랜치를 합칠 때 | 특정 브랜치를 기반으로 커밋을 다시 정렬할 때 | 특정 커밋만 가져올 때 |
| **전체 커밋 반영 여부** | ✅ 전체 가져옴 | ✅ 전체 가져옴 (순서 변경) | ❌ 특정 커밋만 선택 |
| **원본 브랜치 영향** | 유지됨 | 재정렬됨 | 유지됨 |
| **커밋 히스토리** | 브랜치 전체 병합됨 | 히스토리 정리됨 | 원하는 커밋만 추가됨 |
| **사용 예시** | `feature` 브랜치를 `develop`에 합칠 때 | 깔끔한 히스토리를 만들 때 | 특정 기능만 다른 브랜치에 반영할 때 |

---

## **🍒 `git cherry-pick`을 언제 써야 할까?**
✅ **실수로 다른 브랜치에서 작업한 경우**  
✅ **특정 커밋만 적용해야 할 때**  
✅ **핫픽스(Hotfix) 적용 시**  
✅ **다른 브랜치의 기능 중 일부만 가져오고 싶을 때**  

---

## **🎯 마무리**
### **`git cherry-pick` 정리**
- **특정 커밋만 선택하여 다른 브랜치에 적용**하는 Git 명령어
- **"체리 따기"처럼 원하는 커밋만 골라서 가져옴**
- **불필요한 변경 사항 없이 필요한 기능만 반영 가능**
- **충돌 발생 시 해결 후 `git cherry-pick --continue` 실행**

---