---
title: How to instail Python Ubuntu 
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
description: How to instail Python Ubuntu
article_tag1: python
article_tag2: ubuntu
article_tag3: install
article_section: python
meta_keywords: python, ubuntu, install
last_modified_at: '2023-05-05 21:00:00 +0800'
---


## Ubuntu에서 파이썬 환경 구축 방법

Ubuntu에 파이썬 3.10 버전으로 설치하려는데 이미 설치되어있어서
버전을 변경해야되었다. 그 과정을 기록하였음.

Ubuntu에는 Python 기본 경로가 2.7로 설정되어 있으므로 변경 필요.
리눅스의 Alternatives로 버전 변경해본다.


(1) 파이썬 현재 버전 확인

> python --version
출력 내용 : Python 2.7.17


(2) 파이썬 3.10 설치 확인

> ls /usr/bin/ | grep python3



(3) 목록에 없다면 파이썬 설치

 # 패키지 관리 도구를 설치

> sudo apt install software-properties-common -y

 # 패키지 저장소 신규 등록

> sudo add-apt-repository ppa:deadsnakes/ppa -y

 # 파이썬 3.10 설치

> sudo apt install python3.10



(4) 파이썬 버전 변경

아래 옵션은 python 버전을 변경하는 옵션
> update-alternatives --config python 



(Alternatives는 기본 커맨드의 심볼릭 링크를 관리해주는 리눅스 프로그램)

(형식 : update-alternatives --install [symbolic link path] python [real path] number)

> sudo update-alternatives --install /usr/bin/python python /usr/bin/python2.7 1

> sudo update-alternatives --install /usr/bin/python python /usr/bin/python3.10 2

> sudo update-alternatives --config python



#적용 확인
> ls -al /usr/bin/python

출력내용 : /usr/bin/python -> /etc/alternatives/python



(5) python 모듈 설치를 위한 pip 설치

(pip : 파이썬으로 작성된 패키지 라이브러리를 관리해주는 시스템)

> apt-get install python3-pip

(6) python flask 설치

> pip install --ignore-installed flask