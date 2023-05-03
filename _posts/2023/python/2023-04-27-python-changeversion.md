---
title: Python 버전 변경 방법 (ubuntu)
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
description: Python 버전 변경 방법 (ubuntu)
article_tag1: python
article_tag2: version
article_tag3: 
article_section: python
meta_keywords: python, version
last_modified_at: '2023-05-02 21:00:00 +0800'
---


### Ubuntu 파이썬 버전 변경

우분투(Ubuntu)는 python path가 2.7로 설정되어 있다.

파이썬 버전을 변경하는 설정을 해보자.

**Alternatives**는 기본 커맨드의 심볼릭 링크를 관리해주는 리눅스 프로그램이다.

# update-alternatives --config python 옵션은 python 버전을 변경하는 옵션
> sudo update-alternatives --config python


# 버전 변경 설정이 등록되어 있는지 확인
update-alternatives: error: no alternatives for python

만약 위와 같다면, 등록된 것이 없다는 의미이다.
--------------------

# 파이썬 설치 목록 확인(python 3)
> ls /usr/bin/ | grep python3

```
dh_python2
python
python2
python2.7
python3
python3-jsondiff
python3-jsonpatch
python3-jsonpointer
python3-jsonschema
python3.10
python3.6
python3.6m
python3m
```

# 명령어 설명

실행파일을 등록하는 명령어 형식

> update-alternatives --install [symbolic link path] python [real path] number 

어떤 파일을 가리키는지 확인할 수 있습니다
> ls -al /usr/bin/python

# 버전 확인
> python3 -V
```
Python 3.6.9
```

> sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.6 1

> sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.10 2

> sudo update-alternatives --config python3

------------------------

## python --version (python)
> python --version
```
Python 2.7.17
```

>sudo update-alternatives --install /usr/bin/python python /usr/bin/python2.7 1

>sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.10 2

>sudo update-alternatives --config python

## 어떤 파일을 가리키는지 확인할 수 있습니다
> ls -al /usr/bin/python

변경 후
> /usr/bin/python -> /etc/alternatives/python

pip 설치 (python3 버전 기준)
> apt-get install python3-pip

pip upgrade
> pip install --upgrade pip

## 에러
> pip install --upgrade pip

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

## 해결 -안됨
Reinstall apt_pkg using:

> sudo apt-get install --reinstall python3-apt

참고 : https://askubuntu.com/questions/480908/problem-with-update-manager-no-module-named-apt-pkg-in-ubuntu-13-10-having-i

## 해결 -안됨
> sudo apt-get remove python3-apt

> sudo apt-get install python3-apt

참고 : https://askubuntu.com/questions/1069087/modulenotfounderror-no-module-named-apt-pkg-error


#
```
pip: command not found
```

> pip install --upgrade pip (x) 로 하지말고

> apt-get install python3-pip (o) 로 하자

> **Ubuntu의 경우 apt-get install python3-pip 로 설치**

참고 : https://stackoverflow.com/questions/9780717/bash-pip-command-not-found