---
title: Python - 개발 환경 설정
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- Evironment
toc: true
toc_sticky: true
toc_label: 목차
description: Python 개발 환경 설정
article_tag1: python
article_tag2: environment
article_tag3: version
article_section: python
meta_keywords: python, environment, versoin
last_modified_at: '2023-11-03 21:00:00 +0800'
---

# 파이썬 버전, 라이브러리 설치 경로 확인 방법

하나의 PC에 여러 버전의 파이썬이 설치된 경우.

pip를 사용하여 패키지를 설치하면, 기본적으로 가장 최근에 설치된 파이썬에 패키지가 설치된다.
환경 설정이 잘못되거나 버전이 달라서 충돌 나는 경우가 있다. 이 경우에 설치하려는 파이썬 라이브러리의 위치를 확인하고 설치하는 것이 좋다. 파이썬 라이브러리의 위치를 확인하는 방법을 알아보자.



## 버전확인
> python --version

## 파이썬 설치 경로 확인

### Mac OS : 
> $ which python

### Windows : 
> > where python


## 파이썬 라이브러리 설치 목록 확인

> $ pip list
```
Package                       Version
----------------------------- ------------
absl-py                       2.0.0       
aiohttp                       3.8.5       
aiosignal                     1.3.1       
alabaster                     0.7.13   
...(생략)
```

## 파이썬 라이브러리의 기본 경로
> pip library path

일반적으로 파이썬 라이브러리는 아래 경로에 설치된다.
> C:/Users/user/AppData/Local/Programs/Python/Python38/Lib/site-packages

## 파이썬 특정 라이브러리의 경로 확인
> pip show -f <package name>
> (예시) pip show -f aiohttp

```
Name: aiohttp
Version: 3.8.5
Summary: Async http client/server framework (asyncio)
Home-page: https://github.com/aio-libs/aiohttp
Author:
Author-email:
License: Apache 2
Location: C:/Users/hong/AppData/Local/Programs/Python/Python311/Lib/site-packages
Requires: aiosignal, async-timeout, attrs, charset-normalizer, frozenlist, multidict, yarl
Required-by:
Files:
    aiohttp-3.8.5.dist-info\INSTALLER
    aiohttp-3.8.5.dist-info\LICENSE.txt
    aiohttp-3.8.5.dist-info\METADATA
    aiohttp-3.8.5.dist-info\RECORD
    aiohttp-3.8.5.dist-info\REQUESTED
...(생략)
```

위 Location 항목만 가져오기
(windows)
> (예시) pip show -f aiohttp | findstr "Location"

> (출력결과) Location: C:\Users\hong\AppData\Local\Programs\Python\Python311\Lib\site-packages

## 라이브러리를 특정 경로에 설치하기
> pip install --target <path> <package name>

## 시스템 경로 확인
sys : system path. 시스템 경로에서 참조할 수 있는 모든 경로를 가지고 있는 리스트이다.

> import sys 
> print(sys.path) 
```
['D:\\python_workspace\\python-exam\\pythonEnvironment', 'C:\\Users\\hong\\AppData\\Local\\Programs\\Python\\Python311\\python311.zip', 'C:\\Users\\hong\\AppData\\Local\\Programs\\Python\\Python311\\DLLs', 'C:\\Users\\hong\\AppData\\Local\\Programs\\Python\\Python311\\Lib', 'C:\\Users\\hong\\AppData\\Local\\Programs\\Python\\Python311', 'C:\\Users\\hong\\AppData\\Local\\Programs\\Python\\Python311\\Lib\\site-packages']
```

## sys.path[0] : 현재 실행되는 파일의 경로를 나타낸다.
> print(sys.path[0])
```
D:\python_workspace\python-exam\pythonEnvironment
```

## MacOS에서 환경 변수 설정하기
1. Open Terminal
2. Open .bash_profile 
$ open ~/.bash_profile
3. Add the following line to the end of the file
export PYTHONPATH="${PYTHONPATH}:/path/to/your/python/file"
4. Save the file
5. Restart Terminal
6. Check the environment variable
$ echo $PYTHONPATH
7. Check the environment variable in python
$ python
>>> import sys
>>> sys.path


## Mac OS, pip3, pip 설정

Mac OS에서는 기본적으로 python2와 python3가 설치되어 있다.
pip3는 python3의 pip이고, pip는 python2의 pip이다.
pip를 pip3로 설정하고 싶다면, 아래와 같이 설정하면 된다.

> $ alias pip=pip3 >> ~/.bash_profile
명령어 설명 : alias(별칭) "별칭"="명령어" >>(추가할 파일) ~/.bash_profile(파일 경로)

> $ source ~/.bash_profile
명령어 설명 : source 명령어는 현재 쉘 환경에서 지정된 파일을 읽어서 환경 변수를 설정하거나 명령어를 실행하는 기능을 한다.
