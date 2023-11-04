---
title: Git - 자주 사용하는 명령어
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Git
tags:
- Git
toc: true
toc_sticky: true
toc_label: 목차
description: Git - 자주 사용하는 명령어
article_tag1: Git
article_tag2: Vcs
article_tag3: 
article_section: Git
meta_keywords: git, vcs
last_modified_at: '2023-09-13 21:00:00 +0800'
---

# Git 자주 사용하는 명령어 모음
개발할 때 버전 관리를 위한 관리 시스템으로 Git, SVN 을 사용한다. 어느 도구를 사용하든 개발 회사의 상황에 맞게, 개발자에 따라서 그 유용함이 달라진다. 

작은 조직이거나 보수적인 조직일수록 리더 개발자의 성향에 따라 이러한 관리 도구와 그 사용 체계는 큰 영향을 받는다. 아무리 좋은 도구라도 그 쓰임을 제대로 활용하지 않는다면, 관리에 소요되는 시간이 줄지 않아 생산성이 높아지지 않을 것이다.

현재는 Bitbucket JIRA 이슈 관리, Git 관리 도구를 효율적으로 사용하고 있는 조직에서 일하게 되어, 이 유용한 도구가 현업에 얼마나 도움이 되는지 실제로 체감하고 있다. 어느 조직에 속하여 개발하느냐, 그 조직은 얼마나 체계적으로 일하느냐가 중요한지 다시 느끼게 되었다.

기본적으로 자주 사용하는 Git 명령어를 정리해보았다.

git 버전 관리란?

(참고 : https://git-scm.com/book/ko/v2/%EC%8B%9C%EC%9E%91%ED%95%98%EA%B8%B0-%EB%B2%84%EC%A0%84-%EA%B4%80%EB%A6%AC%EB%9E%80%3F)


## git 초기화

git 저장소 초기화

``` git init```


## git 원격 저장소 명령어(remote)

- 원격 저장소 추가

```git remote add origin <remote_repo>```

- 원격 저장소 확인

```git remote -v ```

- 원격 저장소 상세 정보 확인

```git remote show origin ```

- 원격 저장소의 브랜치 정보를 로컬에 업데이트

```git remote update ```

- 원격 저장소 삭제

```git remote rm <remote_repo>```

- 원격 저장소 수정

```git remote set-url origin <remote_repo>```

- 원격 저장소의 더 이상 존재하지 않는 브랜치를 로컬에서 삭제

```git remote prune origin ```

## git 브랜치 명령어(branch)
    
- 브랜치 생성  

```git branch <branch name>```

- 브랜치 삭제

```git branch -d <branch name>```

- 브랜치 확인

```git branch ```

- 브랜치 확인(커밋 메세지도 확인 가능)

```git branch -v ```

- 원격 브랜치 확인

```git branch -r ```

## 브랜치 이동(checkout)

```git checkout <branch name>```

## git clone 

- 원격 저장소의 특정 브랜치를 가져옴

```git clone --branch <branch name><remote_repo>```

## 원격 저장도 코드를 가져와서, 로컬 저장소에 덮어씌우기

- git fetch : 원격 저장소의 변경사항을 가져옴

```git fetch --all```

- git reset --hard : 로컬의 모든 변경 내용을 삭제하고 원격 저장소의 내용으로 변경한다.

```git reset --hard origin/<branch name>```

## git 소스코드 가져오기 (pull)
- 원격 저장소의 변경사항을 가져와서, 로컬 저장소에 덮어씌우기

```git pull ```

- 원격 저장소의 특정 브랜치를 가져와서, 로컬 저장소에 덮어씌우기

```git pull origin <branch name>```

- 두 저장소의 커밋 히스토리가 다를 때, 강제로 덮어씌우기

```git pull origin <branch name> --allow-unrelated-histories``` 

# 실무에서 자주 쓰는 명령어 추가

## git commit

```git commit -m "commit message"```

bitbucket의 이슈를 commit에 달아놓으면 해당 commit에 대한 이슈를 달아준다.

```예 : git commit -m "code: Solve aiohttp sample code #1"```

## git branch 이름 작성
git branch 에서 feature/ 브랜치를 만들고 해당 브랜치에서 작업을 하게 되는데
형식은 feature/이슈번호-이슈제목 으로 작성한다.

```예 : feature/12345-aiohttp-sample-code```

## git push

- 원격 저장소의 특정 브랜치에 푸시하기(최초 1회). u : upstream, 원격 저장소의 특정 브랜치를 추적하겠다는 의미

```git push -u origin <branch name>```
