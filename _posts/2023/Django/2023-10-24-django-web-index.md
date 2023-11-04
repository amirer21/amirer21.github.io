---
title: Python - Django 웹 만들기 (2)
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
description: Python, Django 웹 만들기 (2)
article_tag1: python
article_tag2: web
article_tag3: Django
article_section: Django
meta_keywords: python, Django, web
last_modified_at: '2023-10-23 21:00:00 +0800'
---


# 파이썬 Django 웹 프로그래밍 (2) : 장고 템플릿 시스템

### index 앱 기본구조
```
 index
     ㄴ migrations : 데이터베이스 마이그레이션 파일이 저장되는 디렉터리
         ㄴ __init__.py
     ㄴ static : 정적 파일이 저장되는 디렉터리
         ㄴ index
             ㄴ style.css
     ㄴ templates : html 템플릿 파일이 저장되는 디렉터리
         ㄴ index
             ㄴ index.html
     ㄴ __init__.py
     ㄴ admin.py   : 관리자 페이지에서 index 앱을 관리하기 위한 설정 파일
     ㄴ apps.py    : index 앱의 정보를 저장하는 설정 파일
     ㄴ models.py  : index 앱에서 사용하는 모델을 정의하는 파일
     ㄴ tests.py   : index 앱의 테스트를 작성하는 파일
     ㄴ views.py   : index 앱의 뷰를 정의하는 파일
```

## (1) index app 생성

> cd \mySite\Investar

> python manage.py startapp index

## (2) settings.py에 앱 등록
경로 : DjangoExam/mySite/Investar/Investar/settings.py

```py
INSTALLED_APPS = [...,'index']
```

```py
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'hello', #hello 추가
    'index', #index 추가
]
```

## (3) urls.py에 index app의 url 추가

경로 : DjangoExam/mySite/Investar/Investar/urls.py
```py
from index import views as index_views #index 추가
urlpatterns = [..., path('index/', index_views.main_view)]
```

```py
from django.contrib import admin
from django.urls import path, re_path #re_path : 경로에 정규표현식을 사용하기 위해 추가
from hello import views #hello 추가
from index import views as index_views #index 추가

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^(?P<name>[A-Z][a-z]*)/$', views.sayHello), #규칙 : 대문자로 시작하고 소문자로 끝나는 문자열. # P: parameter <name>: name이라는 이름으로 파라미터를 받겠다.
    path('index/', index_views.main_view), #index 추가
]
```

## (4) index/views.py에 main_view 함수 추가
경로 : DjangoExam/mySite/index/views.py

```py
def main_view(request):
   return render(request, 'index.html')
```


```py
from django.shortcuts import render

def main_view(request):
    return render(request, 'index.html')
```

## (5) index/templates/index.html 생성

index 앱의 templates 디렉터리를 생성하고 index.html 파일을 생성한다.

경로 : \mySite\Investar\index\templates\index.html

------------    

## html 코드

<script src="https://gist.github.com/amirer21/85daa4a999dcaba2d1956e4e4f9da2cc.js"></script>

## 접속해보기

> http://127.0.0.1:8000/index/