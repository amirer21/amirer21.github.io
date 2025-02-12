---
title: Git - 04 - A 브랜치에서 작업한 코드를 B 브랜치로 이동하기
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
description:  어떤 브랜치에서 작업했는데 알고보니 다른 브랜치에서 작업한 경우 코드 이동하는 방법
article_tag1: Git
article_tag2: 
article_tag3: 
article_section: Git
meta_keywords: Git, Branch
last_modified_at: '2025-02-12 21:00:00 +0800'
---


# **Git 브랜치 : A 브랜치에서 작업한 코드를 B 브랜치로 이동하기** 🚀

---

개발을 하면서 어떤 구현을 완료하였는데 알고보니 다른 브랜치에서 작업한 경우.
그리고 다른 브랜치는 최신 코드가 아니어서 업데이트를 해야되는 경우.
이런 경우에서 Git 작업을 어떻게 해야되는지 정리해보았습니다.

## **📌 상황 정리**
우리는 `B 브랜치 (feature/BBB-22344)`에 코드를 올려야 합니다.  
하지만 실수로 `A 브랜치 (feature/AAA-11233)`에서 작업을 진행했습니다.  
또한, `B 브랜치`는 `A 브랜치`에서 생성되었으며, `A 브랜치`의 최신 코드도 함께 업데이트해야 합니다.

**즉, 목표는 다음과 같습니다:**
1. **현재 `A 브랜치`에서 작업한 코드**를 `B 브랜치`로 옮긴다.
2. **`B 브랜치`가 `A 브랜치`의 최신 코드도 반영하도록 한다.**
3. **최종적으로 `B 브랜치`에 Push한다.**

---

## **⚠️ 발생한 문제 및 해결 방법**
### **🔴 문제 1: 원격 브랜치가 로컬에 없음**
```bash
error: pathspec 'feature/BBB-22344' did not match any file(s) known to git
```
이는 `B 브랜치 (feature/BBB-22344)`가 원격(`origin`)에는 있지만,  
로컬에는 존재하지 않기 때문에 발생한 오류입니다.

> **🛠 해결 방법:**  
> `git fetch origin`으로 원격 브랜치를 가져온 후 `git checkout -b`로 로컬 브랜치를 생성하면 됩니다.

---

## **🚀 Git 과정 단계별 정리**

### **1️⃣ 현재 작업한 코드 커밋 (`A 브랜치`)**
우선, `A 브랜치`에서 작업한 코드가 사라지지 않도록 안전하게 **커밋**합니다.

```bash
git checkout feature/AAA-11233  # 혹시 다른 브랜치에 있다면 이동
git add .  # 모든 변경 사항 스테이징
git commit -m "Modify something"
```
✅ 이제 로컬에서 변경 사항이 저장되었습니다.

---

### **2️⃣ `B 브랜치` 가져오기 (없다면 생성)**  
원격에만 존재하는 `feature/BBB-22344` 브랜치를 로컬로 가져옵니다.

```bash
git fetch origin  # 원격 브랜치 최신화
git checkout -b feature/BBB-22344 origin/feature/BBB-22344
```
✅ 이제 로컬에 `feature/BBB-22344` 브랜치가 생성되었습니다.

- 만약 `B 브랜치`가 이미 로컬에 있다면 아래 명령어만 실행하면 됩니다.
  ```bash
  git checkout feature/BBB-22344
  ```

---

### **3️⃣ `A 브랜치`의 최신 코드 가져오기**  
이제 `B 브랜치`에서 `A 브랜치`의 최신 코드를 병합합니다.

```bash
git pull origin feature/AAA-11233
```
✅ **이슈 발생 가능:**  
- 충돌이 발생하면 **충돌을 해결한 후**, 다음을 실행합니다.
  ```bash
  git add .
  git commit -m "Resolve merge conflicts"
  ```

---

### **4️⃣ `A 브랜치`에서 작업한 코드 가져오기 (체리픽)**  
이제 **방금 `A 브랜치`에서 커밋한 변경 사항을 `B 브랜치`로 옮깁니다.**

```bash
git cherry-pick feature/AAA-11233
```
✅ **이슈 발생 가능:**  
- 체리픽 도중 충돌이 발생하면 **충돌을 해결한 후**, 다음을 실행합니다.
  ```bash
  git add .
  git cherry-pick --continue
  ```

---

### **5️⃣ 최종적으로 `B 브랜치`에 Push**
이제 `B 브랜치`에 변경된 코드가 반영되었으므로, 원격 저장소로 업로드합니다.

```bash
git push origin feature/BBB-22344
```

✅ 이제 **최신 코드가 반영된 `B 브랜치`가 원격 저장소에 정상적으로 업로드되었습니다!** 🚀

---

## **📌 최종 요약**
> **🎯 목표:**  
> `B 브랜치 (feature/BBB-22344)`에서 개발해야 했지만 실수로  
> `A 브랜치 (feature/AAA-11233)`에서 작업한 경우,  
> `A 브랜치`의 최신 코드와 함께 `B 브랜치`로 코드 이동 후 Push하는 방법

### **✅ 단계별 정리**
1️⃣ **현재 `A 브랜치`에서 작업한 코드 커밋**
```bash
git checkout feature/AAA-11233
git add .
git commit -m "Modify something"
```

2️⃣ **업로드할 `B 브랜치` 가져오기 (없다면 생성)**
```bash
git fetch origin
git checkout -b feature/BBB-22344 origin/feature/BBB-22344
```
_(이미 로컬에 존재하면 `git checkout feature/BBB-22344` 실행)_

3️⃣ **최신 `A 브랜치` 코드 반영**
```bash
git pull origin feature/AAA-11233
```

4️⃣ **커밋된 코드 체리픽**
```bash
git cherry-pick feature/AAA-11233
```

5️⃣ **Push**
```bash
git push origin feature/BBB-22344
```

✅ **이제 `B 브랜치`에 최신 코드와 내가 작업한 내용이 반영됨!** 🎉

---

## **🔍 추가 TIP**

✅ **로컬에 `B 브랜치`가 없을 때만** `git checkout -b` 명령어를 사용하세요.  

✅ **충돌이 발생할 경우**, `git status`로 충돌 파일을 확인한 후 해결하세요.  

✅ **이미 `B 브랜치`에서 작업 중이라면**, `git checkout feature/BBB-22344` 후 `git pull origin feature/AAA-11233` 만 해주면 됩니다.  
