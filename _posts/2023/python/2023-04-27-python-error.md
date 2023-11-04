---
title: 파이썬 ModuleNotFoundError No module named 'apt_pkg' error (resolved)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- Error
toc: true
toc_sticky: true
toc_label: 목차
description: 파이썬 ModuleNotFoundError No module named 'apt_pkg' error (resolved)
article_tag1: python
article_tag2: error
article_tag3: 
article_section: error
meta_keywords: python, error
last_modified_at: '2023-04-27 21:00:00 +0800'
---


## pip install 에러발생 

> pip install --upgrade pip

실행하였더니,
ModuleNotFoundError: No module named 'apt_pkg' 에러가 발생하였다.

### 에러 내용
```
Traceback (most recent call last):
File "/usr/lib/command-not-found", line 28, in <module>
from CommandNotFound import CommandNotFound
File "/usr/lib/python3/dist-packages/CommandNotFound/CommandNotFound.py", line 19, in <module>
from CommandNotFound.db.db import SqliteDatabase
File "/usr/lib/python3/dist-packages/CommandNotFound/db/db.py", line 5, in <module>
import apt_pkg
ModuleNotFoundError: No module named 'apt_pkg'
```

### 시도 (1) 재설치
Reinstall apt_pkg using:

> sudo apt-get install --reinstall python3-apt

참고 : https://askubuntu.com/questions/480908/problem-with-update-manager-no-module-named-apt-pkg-in-ubuntu-13-10-having-i

### 시도 (2) 삭제 후 설치

> sudo apt-get remove python3-apt

> sudo apt-get install python3-apt

참고 : https://askubuntu.com/questions/1069087/modulenotfounderror-no-module-named-apt-pkg-error

```
pip: command not found
```

### 해결 

> pip install --upgrade pip (x) 로 하지말고

> apt-get install python3-pip (o) 로 하자

> **Ubuntu의 경우 apt-get install python3-pip 로 설치**

참고 : https://stackoverflow.com/questions/9780717/bash-pip-command-not-found