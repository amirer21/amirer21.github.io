---
title: Python - Django 웹 만들기 (1)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Django
tags:
- Python
- Django
- Web
toc: true
toc_sticky: true
toc_label: 목차
description: Python, Django 웹 만들기 (1)
article_tag1: python
article_tag2: web
article_tag3: Django
article_section: Django
meta_keywords: python, Django, web
last_modified_at: '2023-10-23 21:00:00 +0800'
---

# 파이썬 Django 웹 프로그래밍 (1) : 장고 웹 프로젝트 시작하기

## Django(장고)란?
파이썬 오픈소스 웹 프레임워크이다.(웹 프레임워크 : 웹 개발에 필요한 기능을 미리 만들어 놓은 것) 장고는 웹 개발에 필요한 기능을 미리 만들어 놓았기 때문에 웹 개발자는 이를 사용하여 웹 사이트를 빠르게 개발할 수 있다. 어플리케이션을 만드는 데 집중할 수 있어서 유연성이 향상될 수 있다. Django(장고)를 사용한 웹의 대표적인 예로는 인스타그램, 핀터레스트, 넷플릭스, 스포티파이, 레딧 등이 있다.

## 장고의 특징
사용자 인증, 콘텐츠 관리, 사이트 맵, RSS 피드 등의 기능을 제공한다.

## 아키텍처 
장고는 MVT(Model-View-Template) 아키텍처를 사용한다.
- Model : 데이터베이스에 저장되는 데이터를 관리하는 부분
- View : 웹 요청을 받고, 전달받은 데이터를 처리해서 가공하는 부분
- Template : 사용자에게 보여지는 화면을 만드는 부분

이 예제에서는 Django(장고)를 사용하여 웹 페이지를 만들어보자.

## 예제 순서
- 예제 (1) 기본적인 서버 구축, 실행
- 예제 (2) 기본 : 장고 템플릿 시스템을 알아본다. (index.html)
- 예제 (3) 응용 : 계좌 잔고 확인 페이지를 만들어본다. (balance.html)


## 1. 장고 설치

> 설치 : pip install django

경로 : Django/mySite

## django-admin : 장고 프로젝트를 생성하거나 관리하는 커맨드라인 도구
> django-admin startproject Investar

## 2. 장고 프로젝트 생성
> python manage.py migrate : 데이터베이스 초기화

##  : 서버 실행
>python manage.py runserver 0.0.0.0:8000


## 프로젝트 생성
> django-admin startproject mySite

### 프로젝트 기본구조
```
 mySite
     ㄴ mySite
         ㄴ __init__.py : 해당 디렉터리가 패키지의 일부임을 알려주는 역할
         ㄴ settings.py : 웹사이트 설정
         ㄴ urls.py : 웹사이트의 URL과 뷰를 연결하는 URLconf 
         ㄴ wsgi.py : WSGI 호환 웹 서버의 진입점을 작성하는 파일
     ㄴ manage.py : 장고 프로젝트와 다양한 방법으로 상호작용하는 커맨드라인의 유틸리티
```

 여기에서 mySite가 프로젝트의 전반적인 설정을 담당하는 디렉터리이고 manage.py는 프로젝트 관리를 위한 커맨드라인 유틸리티이다.


## 서버 실행
>  python manage.py runserver 0.0.0.0:8000

(또는)

>  python manage.py startapp hello

----------

## 프로젝트 환경 설정

### Host IP 설정
파일 : settings.py

```py
ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
```

## 장고 어플리케이션 생성
> python manage.py startapp hello

### hello 라는 이름의 앱 생성
> python manage.py migrate : 데이터베이스 초기화


### 어플리케이션 등록
파일 : settings.py
```py
INSTALLED_APPS = [...,'hello']
```

### URLconf 설정
파일 : urls.py
import : hello/views.py를 import
views.py에 있는 sayHello 함수를 사용하기 위해 hello/views.py를 import

```py
from hello import views
urlpatterns = [..., path('hello/', views.sayHello)]
```
/hello 로 요청이 들어오면 views.sayHello 함수를 호출한다.views.py에 있는 sayHello 함수를 호출한다.

### 변경 전
```py
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]
```

### 변경 후 
hello 앱의 views.py에 있는 sayHello 함수를 호출한다.
 url로 접근할때, re_path를 사용하면 정규표현식을 사용할 수 있다.
> ^(?P<name>[A-Z][a-z]*)/$ (정규표현식) : 대문자로 시작하고 소문자로 끝나는 문자열

>  예: http://127.0.0.1:8000/Hello/

URL Path에 대문자로 시작하고 소문자로 끝나는 문자열을 입력하면 views.py에 있는 sayHello 함수를 호출한다.

```py
from django.contrib import admin
from django.urls import path, re_path #re_path : 경로에 정규표현식을 사용하기 위해 추가
from hello import views #hello 추가

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^(?P<name>[A-Z][a-z]*)/$', views.sayHello), #규칙 : 대문자로 시작하고 소문자로 끝나는 문자열. # P: parameter <name>: name이라는 이름으로 파라미터를 받겠다.
]
```

## 접속하기

> http://127.0.0.1:8000/Hello/


---------------

### 잠깐! 정규표현식
```
 ^ : 문자열의 시작
 $ : 문자열의 끝
 . : 임의의 문자 1개
 * : 앞 문자가 0개 이상
 + : 앞 문자가 1개 이상
 ? : 앞 문자가 없거나 1개
 [] : 문자의 집합이나 범위([a-z]: a부터 z까지, [^0-9]: 숫자가 아닌 문자)
 {} : 앞 문자의 개수({2}: 2개, {2,4}: 2개 이상 4개 이하)
 () : 그룹화(1개의 문자처럼 인식)
 | : or 연산
 \d : 숫자([0-9]와 동일). d는 digit의 약자
 \D : 숫자가 아닌 것([0-9]를 제외한 문자)
 \s : 공백 문자(띄어쓰기, 탭, 엔터 등). s는 space의 약자
 \S : 공백 문자가 아닌 것
 \w : 알파벳 대소문자, 숫자([a-zA-Z0-9]와 동일). w는 word의 약자
 \W : non alpha-numeric 문자([a-zA-Z0-9]를 제외한 문자)
 (?P<이름>...) : 그룹에 이름을 지정
 (?P=이름) : 지정한 그룹 참조
```

## view.py 수정 하기

### 생성된 앱의 기본 코드는 다음과 같다.
render : 템플릿을 로딩할 때 사용하는 함수
파일은 빈 파일이다. 이제 추가해보자.

### 수정 전
```py
from django.shortcuts import render

# Create your views here.
```

### 수정 후
```py
from django.shortcuts import render
from django.http import HttpResponse

def sayHello(request, name):
    html = '<h1>Hello, {}!</h1>'.format(name)
    return HttpResponse(html)
```

## 접속해보자.


## 관리자 페이지
> http://local:8000/admin

# 관리자 계정 생성
> python manage.py createsuperuser

- ID : admin
- #PW : 1111

>  http://127.0.0.1:8000/admin/ 접속

