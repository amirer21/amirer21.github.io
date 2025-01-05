---
title: Django - 주요 매커니즘
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
last_modified_at: '2025-01-04 21:00:00 +0800'
---


Django는 **웹 애플리케이션 개발을 위한 고수준 Python 프레임워크**로, 개발을 간소화하고 유지보수성을 높이기 위해 여러 핵심 메커니즘을 제공합니다. 여기에서는 Django의 주요 매커니즘을 소개하고 간략히 설명하겠습니다.

---

## **1. URL 라우팅 메커니즘**

### **개요**
Django의 URL 라우팅은 사용자가 브라우저에서 입력한 URL을 적절한 뷰(View)에 매핑하는 역할을 합니다.

### **작동 방식**
1. **URL 패턴 정의**:
   - `urls.py` 파일에서 URL 패턴과 해당 뷰를 매핑합니다.
   - 예:
     ```python
     from django.urls import path
     from . import views

     urlpatterns = [
         path('home/', views.home, name='home'),
         path('about/', views.about, name='about'),
     ]
     ```

2. **URL 매칭**:
   - Django는 클라이언트가 요청한 URL을 위에서부터 차례로 검사하여 가장 먼저 일치하는 패턴을 찾습니다.

3. **뷰 호출**:
   - 일치하는 패턴을 찾으면, 해당 뷰 함수를 호출하여 요청을 처리합니다.

---

## **2. 미들웨어(Middleware) 메커니즘**

### **개요**
미들웨어는 **HTTP 요청(Request)**과 **응답(Response)** 사이에서 동작하는 처리 계층입니다. 요청 및 응답의 전후 처리를 담당합니다.

### **작동 방식**
1. 요청(Request) → 미들웨어 → 뷰(View)
2. 응답(Response) ← 미들웨어 ← 뷰(View)

### **사용 예시**
- 요청/응답 로깅
- 인증 및 권한 검사
- 세션 처리

#### **설정**
`settings.py`에서 활성화된 미들웨어를 정의합니다:
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
]
```

---

## **3. ORM (Object-Relational Mapping) 메커니즘**

### **개요**
Django ORM은 데이터베이스와 Python 객체 간의 매핑을 제공하여, SQL 없이 Python 코드로 데이터베이스를 조작할 수 있게 합니다.

### **작동 방식**
1. **모델 정의**:
   - `models.py`에서 데이터베이스 테이블 구조를 Python 클래스로 정의합니다.
     ```python
     from django.db import models

     class Post(models.Model):
         title = models.CharField(max_length=100)
         content = models.TextField()
         created_at = models.DateTimeField(auto_now_add=True)
     ```

2. **쿼리 실행**:
   - ORM 메서드를 사용하여 데이터베이스 작업을 수행합니다.
     ```python
     # 데이터 생성
     Post.objects.create(title='My Post', content='Hello, World!')

     # 데이터 조회
     posts = Post.objects.filter(title__icontains='Post')
     ```

3. **마이그레이션**:
   - 모델 변경사항을 데이터베이스에 반영하기 위해 마이그레이션을 생성하고 실행합니다.
     ```bash
     python manage.py makemigrations
     python manage.py migrate
     ```

---

## **4. 인증 및 권한 메커니즘**

### **개요**
Django는 강력한 인증(Authentication) 및 권한(Authorization) 시스템을 제공합니다. 사용자를 인증하고, 리소스에 접근 권한을 제어할 수 있습니다.

### **주요 기능**
1. **사용자 모델**:
   - 기본 사용자 모델을 사용하거나, 커스텀 사용자 모델을 정의할 수 있습니다.

2. **인증**:
   - 로그인 및 로그아웃 기능:
     ```python
     from django.contrib.auth import authenticate, login, logout

     user = authenticate(username='john', password='secret')
     if user is not None:
         login(request, user)
     ```

3. **권한**:
   - 사용자 그룹 및 권한을 설정하여 리소스 접근을 제어합니다.

4. **데코레이터**:
   - 뷰에서 인증을 쉽게 검사할 수 있도록 데코레이터를 제공합니다.
     ```python
     from django.contrib.auth.decorators import login_required

     @login_required
     def my_view(request):
         return HttpResponse('Hello, logged-in user!')
     ```

---

## **5. 템플릿 메커니즘**

### **개요**
Django의 템플릿 시스템은 동적인 HTML 페이지를 생성하기 위한 기능을 제공합니다.

### **작동 방식**
1. **템플릿 작성**:
   - HTML 파일 내에서 Django 템플릿 태그와 변수를 사용합니다.
   {% raw %}
     ```html
     <h1>{{ post.title }}</h1>
     <p>{{ post.content }}</p>
     ```
   {% endraw %}

2. **템플릿 렌더링**:
   - 뷰에서 데이터를 템플릿에 전달하고 HTML을 생성합니다.
     ```python
     from django.shortcuts import render

     def post_detail(request, post_id):
         post = Post.objects.get(id=post_id)
         return render(request, 'post_detail.html', {'post': post})
     ```

3. **템플릿 상속**:
   - 템플릿 상속을 통해 공통 레이아웃을 재사용할 수 있습니다.
   {% raw %}
     ```html
     <!-- base.html -->
     <html>
     <body>
         {% block content %}{% endblock %}
     </body>
     </html>
     ```
   {% endraw %}

   {% raw %}
     ```html
     <!-- child.html -->
     {% extends "base.html" %}
     {% block content %}
         <h1>Child Content</h1>
     {% endblock %}
     ```
   {% endraw %}

---

## **6. 캐싱(Caching) 메커니즘**

### **개요**
Django의 캐싱 메커니즘은 성능을 최적화하기 위해 데이터베이스 쿼리나 뷰 결과를 메모리에 저장합니다.

### **캐싱 레벨**
1. **뷰 캐싱**:
   특정 뷰의 결과를 캐싱.
   ```python
   from django.views.decorators.cache import cache_page

   @cache_page(60 * 15)  # 15분 캐싱
   def my_view(request):
       return HttpResponse("Hello, Cache!")
   ```

2. **템플릿 캐싱**:
   템플릿의 특정 부분만 캐싱.
   {% raw %}
   ```html
   {% load cache %}
   {% cache 500 some_key %}
       Cached Content
   {% endcache %}
   ```
   {% endraw %}
   
3. **데이터베이스 캐싱**:
   쿼리셋 결과를 캐싱하여 데이터베이스 부하를 줄입니다.

---

## **7. 신호(Signals) 메커니즘**

### **개요**
Django의 신호 시스템은 특정 이벤트가 발생했을 때 자동으로 연결된 동작을 실행할 수 있습니다.

### **작동 방식**
1. **신호 정의**:
   - Django는 여러 기본 신호를 제공합니다(예: `post_save`, `pre_delete`).

2. **신호 연결**:
   - 특정 이벤트와 신호 핸들러를 연결합니다.
     ```python
     from django.db.models.signals import post_save
     from django.dispatch import receiver
     from .models import Post

     @receiver(post_save, sender=Post)
     def post_saved_handler(sender, instance, **kwargs):
         print(f"Post saved: {instance.title}")
     ```

---

## **8. 파일 업로드 및 관리 메커니즘**

### **개요**
Django는 파일 업로드와 관리를 위한 간단한 도구를 제공합니다.

### **작동 방식**
1. **모델 필드**:
   - `FileField` 또는 `ImageField`를 사용하여 파일 업로드를 처리합니다.
     ```python
     class Document(models.Model):
         file = models.FileField(upload_to='uploads/')
     ```

2. **뷰 처리**:
   - 업로드된 파일은 `request.FILES`를 통해 처리됩니다.
     ```python
     def upload_file(request):
         if request.method == 'POST':
             file = request.FILES['file']
             handle_uploaded_file(file)
     ```

3. **미디어 파일 설정**:
   - `settings.py`에서 미디어 파일 경로를 설정합니다.
     ```python
     MEDIA_URL = '/media/'
     MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
     ```

---

이 외에도 Django는 관리자(Admin), 국제화(I18N), REST API 통합 등 많은 강력한 기능을 제공합니다.



