---
title: 파이썬 pip error (resolved)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: 파이썬 pip error (resolved)
article_tag1: python
article_tag2: pip
article_tag3: error
article_section: error
meta_keywords: python, pip, error
last_modified_at: '2023-05-02 21:00:00 +0800'
---

## 파이썬 모듈 설치 에러

### 서버 및 버전

- ubuntu 18.04
- 파이썬 버전 : 3.10

### flask 설치 하는데 에러발생

> pip install flask

```
에러 내용 : AttributeError: module 'collections' has no attribute 'MutableMapping'
```

### 시도 (1) 다음 코드를 사용하여 pip 업데이트

> curl -sS https://bootstrap.pypa.io/get-pip.py | python3.10

참고 : https://stackoverflow.com/questions/69512672/getting-attributeerror-module-collections-has-no-attribute-mutablemapping-w

> 다시 설치 명령어 실행 : pip install flask

### 에러 발생 :

```
ERROR: Cannot uninstall 'blinker'. It is a distutils installed project and thus we cannot accurately determine which files belong to it which would lead to only a partial uninstall.
```

## 시도 (2) --ignore-installed 옵션 사용

> pip install --ignore-installed [package name]==[package version]

> pip install --ignore-installed flask

참고 : https://stackoverflow.com/questions/53807511/pip-cannot-uninstall-package-it-is-a-distutils-installed-project