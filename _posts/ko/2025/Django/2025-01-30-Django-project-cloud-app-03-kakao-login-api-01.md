---
title: Django - 카카오 로그인 01 - Django에서 카카오 소셜 로그인을 설정하고 `/login/`으로 연결하는 방법
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
description: 카카오톡 로그인 API 매커니즘
article_tag1: Django
article_tag2: Python
article_tag3: Framework
article_section: Django
meta_keywords: Django, Python, Kakao
last_modified_at: '2025-01-30 21:00:00 +0800'
---


## **Django에서 카카오 소셜 로그인을 설정하고 `/login/`으로 연결하는 방법**

Django 프로젝트에서 카카오 소셜 로그인을 설정하고 `/login/` URL에서 카카오 로그인으로 자동 리디렉션되도록 구현하는 방법을 단계별로 정리했습니다.

---

## **1. 카카오 디벨로퍼스 설정**
### **1.1. 카카오 개발자 계정 가입**
- [카카오 디벨로퍼스](https://developers.kakao.com/)에서 계정을 생성하고 **새 애플리케이션**을 등록합니다.

### **1.2. 플랫폼 및 Redirect URI 등록**
- **[내 애플리케이션] > [카카오 로그인] > [Redirect URI]** 에 아래 URI를 추가합니다:
  ```
  http://www.devmiro.co.kr/accounts/oauth/complete/kakao/
  ```
  - 개발 환경에서는:
    ```
    http://localhost:8088/accounts/oauth/complete/kakao/
    ```

### **1.3. 카카오 REST API 키 확인**
- **앱 키**에서 `REST API 키`를 확인하여 Django 설정에 반영할 준비를 합니다.

---

## **2. Django 프로젝트 설정**
### **2.1. 패키지 설치**
```bash
pip install social-auth-app-django
```

### **2.2. `settings.py` 수정**
카카오 OAuth 설정을 추가합니다.

```python
INSTALLED_APPS += [
    'social_django',  # 소셜 로그인 앱 추가
]

AUTHENTICATION_BACKENDS = [
    'social_core.backends.kakao.KakaoOAuth2',  # 카카오 OAuth2 백엔드
    'django.contrib.auth.backends.ModelBackend',  # Django 기본 인증
]

# 카카오 OAuth 키 설정
SOCIAL_AUTH_KAKAO_KEY = '<REST_API_KEY>'  # 카카오 REST API 키
SOCIAL_AUTH_KAKAO_SECRET = ''  # Secret Key는 필요 없음
SOCIAL_AUTH_KAKAO_REDIRECT_URI = 'http://www.devmiro.co.kr/accounts/oauth/complete/kakao/'  # 배포 환경
# 개발 환경에서는 아래처럼 변경 가능
# SOCIAL_AUTH_KAKAO_REDIRECT_URI = 'http://localhost:8088/accounts/oauth/complete/kakao/'

# 로그인/로그아웃 URL 설정
LOGIN_URL = '/login/'  # 로그인 페이지
LOGIN_REDIRECT_URL = '/download-list/'  # 로그인 성공 후 이동할 페이지
LOGOUT_REDIRECT_URL = '/'  # 로그아웃 후 이동할 페이지

# HTTPS 강제 여부 (배포 환경에서는 True, 개발 환경에서는 False)
SOCIAL_AUTH_REDIRECT_IS_HTTPS = False
```

---

## **3. URL 설정**
Django에서 `/login/`을 카카오 로그인 페이지로 자동 리디렉션하도록 설정합니다.

### **3.1. `urls.py` 수정**
```python
from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect

def redirect_to_kakao_login(request):
    """ /login/ URL을 카카오 로그인으로 리디렉션 """
    return redirect('/accounts/oauth/login/kakao/')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('file_manager.urls')),
    path('accounts/oauth/', include('social_django.urls', namespace='social')),
    path('login/', redirect_to_kakao_login, name='login'),  # /login/을 카카오 로그인으로 리디렉션
]
```

---

## **4. Django 데이터베이스 마이그레이션**
카카오 OAuth 데이터를 저장할 테이블을 생성합니다.

```bash
python manage.py makemigrations social_django
python manage.py migrate
```

---

## **5. 테스트 및 검증**
### **5.1. Django 서버 실행**
```bash
python manage.py runserver
```

### **5.2. 카카오 로그인 테스트**
1. **브라우저에서 `/login/` 접속**
   - `http://www.devmiro.co.kr/login/`을 열면 자동으로 `http://www.devmiro.co.kr/accounts/oauth/login/kakao/`로 이동합니다.
   
2. **카카오 로그인 창에서 인증**
   - 카카오 계정으로 로그인 후, `LOGIN_REDIRECT_URL` (`/download-list/`)로 이동하는지 확인합니다.

---

## **6. 추가 기능**
### **6.1. 카카오 로그인 버튼 추가**
템플릿 (`templates/login.html`)에서 직접 카카오 로그인 버튼을 추가할 수 있습니다.

```html
<a href="url 'social:begin' 'kakao' ">카카오로 로그인</a>
```

---

### **6.2. 사용자 정보 저장**
카카오 로그인 시 이메일이나 프로필 정보를 가져오려면 `settings.py`에 다음을 추가합니다:

```python
SOCIAL_AUTH_KAKAO_SCOPE = ['account_email', 'profile']
```

Django 관리자 페이지에서 사용자 정보를 확인하려면:
```bash
python manage.py createsuperuser
```
생성된 계정으로 `http://localhost:8088/admin/`에 로그인하면 `social_django` 테이블에서 인증된 사용자 정보를 볼 수 있습니다.

---

## **7. 최종 정리**
- 카카오 디벨로퍼스에서 Redirect URI 설정
- `social-auth-app-django` 패키지 설치 및 `settings.py` 설정
- `/login/`을 카카오 로그인으로 리디렉션 (`urls.py` 수정)
- 마이그레이션 적용 (`python manage.py migrate`)
- 테스트 (`http://www.devmiro.co.kr/login/`에서 카카오 로그인 확인)

이제 Django에서 `/login/`을 사용하여 카카오 소셜 로그인을 구현할 수 있습니다! 🚀  
