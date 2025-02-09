---
title: Django - 웹 구축 과정 총정리
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Django
tags:
- Django
- Python
- Framework
toc: true
toc_sticky: true
toc_label: 목차
description: Django 주요 매커니즘
article_tag1: Django
article_tag2: Python
article_tag3: Framework
article_section: Django
meta_keywords: Django, Python
last_modified_at: '2025-01-30 21:00:00 +0800'
---


# **Django 웹 구축 과정 총정리**

Django 웹 애플리케이션을 구축하는 전체 과정을 처음부터 끝까지 정리했습니다.  
이 가이드는 **Django 프로젝트 생성 → 개발 → 배포**까지의 모든 단계를 포함합니다.

---

## **1. Django 프로젝트 생성**
### **1-1. 가상 환경 설정**
Django 프로젝트를 관리하기 위해 **Python 가상 환경**을 설정합니다.

#### **(1) WSL에서 실행하는 경우**
```bash
sudo apt update && sudo apt install python3-venv -y
python3 -m venv venv
source venv/bin/activate
```

#### **(2) Windows에서 실행하는 경우**
```bash
python -m venv venv
venv\Scripts\activate
```

### **1-2. Django 설치 및 프로젝트 생성**
```bash
pip install django
django-admin startproject myproject
cd myproject
python manage.py startapp file_manager  # 앱 생성
```

---

## **2. Django 기본 설정 (`settings.py`)**
`myproject/settings.py`에서 필요한 설정을 추가합니다.

### **2-1. 기본 설정**
```python
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DEBUG = True  # 개발 환경에서만 True, 배포 시 False
ALLOWED_HOSTS = ['*']  # 배포 시에는 도메인 또는 IP만 허용

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'file_manager',  # 추가한 앱 등록
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'myproject.urls'

WSGI_APPLICATION = 'myproject.wsgi.application'
```

---

### **2-2. 데이터베이스 설정**
기본값은 SQLite이지만, MySQL 또는 PostgreSQL을 사용하려면 다음과 같이 설정합니다.

#### **(1) SQLite (기본값)**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}
```

#### **(2) MySQL**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mydatabase',
        'USER': 'root',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

#### **(3) PostgreSQL**
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'mydatabase',
        'USER': 'postgres',
        'PASSWORD': 'password',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}
```
**MySQL/PostgreSQL 사용 시 `pip install mysqlclient` 또는 `pip install psycopg2` 필요**

---

### **2-3. 정적 파일 및 미디어 파일 설정**
```python
STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

MEDIA_URL = '/media/'
MEDIA_ROOT = "/mnt/e/내보내기/2025-01-피아노"
```
- `STATICFILES_DIRS`: 개발 환경에서 정적 파일 폴더 지정
- `STATIC_ROOT`: `collectstatic` 실행 시 정적 파일이 모이는 폴더
- `MEDIA_URL` & `MEDIA_ROOT`: 업로드된 파일이 저장될 폴더 설정

---

## **3. Django 앱 개발**
### **3-1. `urls.py` 설정**
`myproject/urls.py` 수정:
```python
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('file_manager.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

`file_manager/urls.py` 생성:
```python
from django.urls import path
from . import views

urlpatterns = [
    path('', views.file_list, name='file_list'),
    path('download/<str:file_name>/', views.download_file, name='download_file'),
]
```

---

### **3-2. `views.py` 구현**
#### **(1) 파일 목록을 보여주는 `file_list` 뷰**
```python
import os
from django.shortcuts import render
from django.conf import settings

BASE_DIR = settings.MEDIA_ROOT

def file_list(request):
    images = [f for f in os.listdir(BASE_DIR) if f.endswith('.jpg')]
    return render(request, 'file_manager/file_list.html', {'images': images})
```

#### **(2) 파일 다운로드 기능**

```python
from django.http import FileResponse, HttpResponse

def download_file(request, file_name):
    file_path = os.path.join(BASE_DIR, file_name)
    if os.path.exists(file_path):
        return FileResponse(open(file_path, 'rb'), as_attachment=True)
    return HttpResponse("File not found", status=404)
```

---

### **3-3. `templates/file_manager/file_list.html` 작성**
```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>파일 목록</title>
</head>
<body>
    <h1>파일 목록</h1>
    <ul>
        {% for image in images %}
            <li>
                <img src="/media/{{ image }}" width="200">
                <a href="/download/{{ image }}" download>다운로드</a>
            </li>
        {% endfor %}
    </ul>
</body>
</html>
```

---

## **4. 서버 실행 및 테스트**
### **4-1. 마이그레이션 실행**
```bash
python manage.py migrate
```

### **4-2. 슈퍼유저 생성 (관리자 페이지 접속용)**
```bash
python manage.py createsuperuser
```

### **4-3. Django 서버 실행**
```bash
python manage.py runserver 0.0.0.0:8088
```

---

## **5. 배포 (Nginx + Gunicorn)**
### **5-1. Gunicorn 설치 및 실행**
```bash
pip install gunicorn
gunicorn --bind 0.0.0.0:8088 myproject.wsgi
```

### **5-2. Nginx 설정**
`/etc/nginx/sites-available/default` 수정:
```nginx
server {
    listen 80;
    server_name 123.12.123.12;

    location / {
        proxy_pass http://127.0.0.1:8088;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /static/ {
        alias /home/hong/python-workspace/file-cloud/static/;
    }

    location /media/ {
        alias /mnt/e/내보내기/2025-01-피아노/;
    }
}
```
Nginx 재시작:
```bash
sudo nginx -t
sudo systemctl restart nginx
```

---

## **결론**
이제 Django 프로젝트는 **파일 목록을 제공하고 다운로드할 수 있으며**, WSL2 및 Nginx를 활용하여 **포트 80에서 외부 접속이 가능**하게 되었습니다. 🚀
