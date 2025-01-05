---
title: Django - 프로젝트 설정 파일에서 `INSTALLED_APPS` 읽기 메커니즘
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
toc: true
toc_sticky: true
toc_label: 목차
description: Django 프로젝트 설정 파일에서 `INSTALLED_APPS` 읽기 메커니즘
article_tag1: Django
article_tag2: Python
article_tag3: 
article_section: 
meta_keywords: Django, Python
last_modified_at: '2025-01-04 21:00:00 +0800'
---

Django 프로젝트를 개발하면서 Django에 있는 매커니즘들을 이해하기 위해 공부한 내용을 정리하였습니다. 기본 명령어로 실행하면 앱은 작동됩니다.이것은 하다보니 알겠는데... 그런데, 기본 파일에는 각각의 파일을 어떻게 불러오는지 매커니즘을 알고 싶었습니다.

아래는 Django의 기본 구조와 `INSTALLED_APPS` 읽기 메커니즘을 자세히 설명한 내용입니다. 

---

## **Django의 기본 구조**

Django는 Python 기반의 웹 프레임워크로 **모델(Model), 뷰(View), 템플릿(Template)** 아키텍처(MVT)와 앱(App) 중심 구조를 사용합니다. 이 구조는 프로젝트를 체계적으로 관리하고 확장성을 높이기 위해 설계되었습니다.

### **1. Django 프로젝트 구조**
Django 프로젝트는 여러 앱(App)으로 구성되며 프로젝트 루트 디렉터리는 아래와 같은 구조를 가집니다:

```plaintext
myproject/
├── manage.py             # Django 명령어 도구
├── myproject/            # 프로젝트 설정 디렉터리
│   ├── __init__.py       # Python 패키지로 인식되도록 설정
│   ├── settings.py       # 프로젝트 설정 파일
│   ├── urls.py           # URL 라우팅 설정
│   ├── wsgi.py           # WSGI 서버 설정
│   └── asgi.py           # ASGI 서버 설정 (비동기 지원)
├── app_name/             # 앱 디렉터리 (여러 개 가능)
│   ├── migrations/       # 데이터베이스 마이그레이션 파일
│   │   └── __init__.py
│   ├── __init__.py       # Python 패키지로 인식되도록 설정
│   ├── admin.py          # 관리자 사이트 설정
│   ├── apps.py           # 앱 설정 클래스
│   ├── models.py         # 데이터베이스 모델 정의
│   ├── tests.py          # 테스트 코드
│   └── views.py          # 뷰 로직
├── templates/            # HTML 템플릿 디렉터리
│   └── (HTML 파일들)
├── static/               # 정적 파일(css, js 등)
│   ├── css/
│   ├── js/
│   └── images/
└── requirements.txt      # Python 패키지 의존성 목록
```

### **2. 주요 구성 요소**
- **`manage.py`**:
  Django 프로젝트의 명령어 인터페이스로 서버 실행(`runserver`), 마이그레이션(`migrate`), 테스트 실행(`test`) 등에 사용됩니다.

- **`settings.py`**:
  프로젝트 전역 설정 파일로 `INSTALLED_APPS`, 데이터베이스 설정, 미들웨어, 정적 파일 경로 등을 정의합니다.

- **`urls.py`**:
  URL과 뷰를 매핑하는 라우팅 파일로 요청을 처리할 뷰를 결정합니다.

- **앱(App)**:
  Django는 기능별로 앱을 구성하며 각 앱은 독립적으로 동작할 수 있습니다.

---

## **Django 프로젝트 설정 파일에서 `INSTALLED_APPS` 읽기 메커니즘**

### **1. `INSTALLED_APPS`란?**
`INSTALLED_APPS`는 Django 프로젝트에서 사용될 앱들을 정의하는 설정 항목입니다. 이 리스트에 등록된 앱만 Django가 로드하고 초기화합니다.

#### **`INSTALLED_APPS` 예시**
```python
INSTALLED_APPS = [
    'django.contrib.admin',       # 관리자 사이트
    'django.contrib.auth',        # 인증 시스템
    'django.contrib.contenttypes',# 콘텐츠 유형 프레임워크
    'django.contrib.sessions',    # 세션 관리
    'myapp',                      # 사용자 정의 앱
    'another_app',                # 또 다른 사용자 정의 앱
]
```

---

### **2. `INSTALLED_APPS` 읽기 메커니즘**

#### **1) `DJANGO_SETTINGS_MODULE` 환경 변수 설정**
- Django는 실행 시 `DJANGO_SETTINGS_MODULE` 환경 변수를 통해 설정 파일의 경로를 확인합니다.
- `manage.py` 또는 WSGI/ASGI 서버에서 설정합니다:
  ```python
  os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
  ```

#### **2) 설정 파일 로드**
- Django는 `DJANGO_SETTINGS_MODULE`에서 지정된 설정 파일(`myproject/settings.py`)을 Python 모듈로 로드합니다.

#### **3) `INSTALLED_APPS` 읽기**
- Django는 설정 파일(`settings.py`)에서 정의된 `INSTALLED_APPS` 리스트를 읽습니다.
- 각 항목은 Python 경로 문자열이며 앱의 위치를 나타냅니다.
  - 예: `'myapp'`은 `myproject/myapp/` 디렉터리를 의미합니다.

#### **4) 앱 탐색**
- `INSTALLED_APPS` 리스트를 순회하며 각 항목의 유효성을 검사합니다:
  1. **Python 모듈 확인**:
     - 항목이 유효한 Python 패키지인지 확인합니다(`__init__.py` 존재 여부).
  2. **`apps.py` 파일 탐색**:
     - 각 앱의 `apps.py`에서 `AppConfig` 클래스를 찾습니다.
     - `AppConfig`가 정의되지 않은 경우에는 기본 설정을 사용합니다.

---

### **3. 앱 초기화**
- Django는 `INSTALLED_APPS`에 등록된 각 앱을 초기화하며 다음 리소스를 자동으로 로드합니다:
  1. **모델(`models.py`)**:
     - 데이터베이스 테이블 정의를 로드합니다.
  2. **관리자 설정(`admin.py`)**:
     - 관리자 사이트와 관련된 설정을 로드합니다.
  3. **템플릿(`templates/`)**:
     - 템플릿 경로를 프로젝트 템플릿 경로에 추가합니다.
  4. **정적 파일(`static/`)**:
     - 정적 파일 경로를 로드합니다.
  5. **신호(Signals)**:
     - `signals.py`에 정의된 신호를 연결합니다.

---

### **4. `INSTALLED_APPS`와 앱 검색 과정 요약**

1. **환경 변수 설정**:
   - `DJANGO_SETTINGS_MODULE`에서 설정 파일 경로를 가져옵니다.

2. **설정 파일 로드**:
   - 지정된 설정 파일(`settings.py`)을 Python 모듈로 가져옵니다.

3. **앱 탐색**:
   - `INSTALLED_APPS` 리스트를 순회하며 각 앱의 경로를 확인합니다.

4. **`AppConfig` 초기화**:
   - 각 앱의 `apps.py`에서 정의된 `AppConfig` 클래스를 로드하거나 기본 설정을 사용합니다.

5. **리소스 로드**:
   - 모델, 관리자 설정, 템플릿, 정적 파일 등을 자동으로 검색하고 로드합니다.

---

## **요약**
- Django의 `INSTALLED_APPS`는 프로젝트에서 사용할 앱을 정의하는 핵심 설정입니다.
- Django는 `INSTALLED_APPS`를 통해 각 앱을 탐색하고, 관련 리소스(모델, 관리자, 템플릿 등)를 자동으로 로드합니다.
- 설정 파일(`settings.py`)의 `INSTALLED_APPS` 리스트는 Django 프로젝트의 확장성과 유지보수성을 높이는 데 중요한 역할을 합니다.

