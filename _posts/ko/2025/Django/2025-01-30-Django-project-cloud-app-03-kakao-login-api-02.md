---
title: Django - 카카오 로그인 02 - 카카오톡 로그인 API 매커니즘
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


## **카카오톡 로그인 API 매커니즘: Django + `social-auth-app-django`**

카카오 로그인 API의 작동 방식과 Django에서 이를 처리하는 흐름을 설명하겠습니다.

---

## **1. 카카오 로그인 흐름**
카카오 소셜 로그인은 **OAuth 2.0**을 기반으로 작동합니다. Django에서 이를 구현할 때, 사용자는 다음과 같은 과정을 거치게 됩니다.

### **🔹 1단계: 사용자가 `/login/` URL을 요청**
- 사용자가 `http://www.devmiro.co.kr/login/`에 접근합니다.
- Django `urls.py`에서 이 경로를 카카오 로그인 URL(`/accounts/oauth/login/kakao/`)로 리디렉션합니다.

> 📌 **Django 처리:**  
> `/login/` 요청 → `redirect_to_kakao_login()` → `/accounts/oauth/login/kakao/`로 이동

---

### **🔹 2단계: 카카오 로그인 요청**
- Django의 `social-auth-app-django`가 자동으로 `https://kauth.kakao.com/oauth/authorize`로 이동하도록 설정합니다.
- 이 요청에는 `client_id`, `redirect_uri`, `response_type=code` 등의 파라미터가 포함됩니다.

> 📌 **전송되는 데이터 (GET 요청)**  
> ```http
> GET https://kauth.kakao.com/oauth/authorize?
> client_id=REST_API_KEY
> &redirect_uri=http://www.devmiro.co.kr/accounts/oauth/complete/kakao/
> &response_type=code
> ```

---

### **🔹 3단계: 카카오가 사용자 인증**
- 사용자가 카카오 로그인 페이지에서 **카카오 계정으로 로그인**합니다.
- **첫 로그인 시, 권한 동의 화면**이 나타나고 사용자가 승인하면 카카오는 `인가 코드 (Authorization Code)`를 Django 서버로 반환합니다.

> 📌 **카카오 로그인 성공 시 Redirect URL:**  
> ```http
> http://www.devmiro.co.kr/accounts/oauth/complete/kakao/?code=인가코드&state=randomstring
> ```

---

### **🔹 4단계: Django가 카카오에서 Access Token 요청**
- Django 서버는 카카오에서 받은 `인가 코드`를 사용해 **Access Token**을 요청합니다.
- Django가 `https://kauth.kakao.com/oauth/token` 엔드포인트로 POST 요청을 보냅니다.

> 📌 **POST 요청:**  
> ```http
> POST https://kauth.kakao.com/oauth/token
> Content-Type: application/x-www-form-urlencoded
> ```
> **전송되는 데이터**
> ```
> grant_type=authorization_code
> client_id=REST_API_KEY
> redirect_uri=http://www.devmiro.co.kr/accounts/oauth/complete/kakao/
> code=인가코드
> ```

> 📌 **카카오 응답 (JSON)**
> ```json
> {
>   "access_token": "ACCESS_TOKEN",
>   "token_type": "bearer",
>   "refresh_token": "REFRESH_TOKEN",
>   "expires_in": 21599
> }
> ```

---

### **🔹 5단계: Access Token을 사용해 사용자 정보 요청**
Django는 발급받은 `access_token`을 이용해 카카오 사용자 정보를 가져옵니다.

> 📌 **GET 요청:**  
> ```http
> GET https://kapi.kakao.com/v2/user/me
> Authorization: Bearer ACCESS_TOKEN
> ```

> 📌 **카카오 응답 예시 (JSON)**  
> ```json
> {
>   "id": 123456789,
>   "connected_at": "2025-01-30T12:34:56Z",
>   "properties": {
>     "nickname": "홍길동",
>     "profile_image": "http://k.kakaocdn.net/dn/image.jpg"
>   },
>   "kakao_account": {
>     "email": "user@example.com",
>     "profile": {
>       "nickname": "홍길동"
>     }
>   }
> }
> ```

---

### **🔹 6단계: Django가 사용자 로그인 및 세션 생성**
- Django는 위에서 받은 사용자 ID를 이용해 **User 모델**을 자동으로 생성하거나 기존 유저와 매핑합니다.
- `social_django`가 이를 자동 처리하며, 사용자 정보를 Django `User` 모델과 연동할 수 있습니다.

> 📌 **Django의 내부 동작**
> - `social_django`가 카카오 ID를 기반으로 사용자를 자동으로 생성 (`social_auth_usersocialauth` 테이블에 저장)
> - 기존 사용자가 있다면 기존 계정과 연결
> - Django의 `request.user`에 로그인된 사용자 객체가 저장됨

---

### **🔹 7단계: 로그인 성공 후 리디렉션**
- Django는 `LOGIN_REDIRECT_URL` (`/download-list/`)로 사용자를 리디렉션합니다.
- 이제 사용자는 로그인된 상태로 다운로드 페이지에 접근할 수 있습니다.

> 📌 **최종 Redirect URL**
> ```
> http://www.devmiro.co.kr/download-list/
> ```

---

## **📌 전체 로그인 흐름 요약**
1. **사용자가 `/login/` 요청** → `/accounts/oauth/login/kakao/`로 리디렉션
2. **Django가 카카오 로그인 페이지로 이동** → 사용자가 로그인 & 동의
3. **카카오가 `인가 코드` 반환** → Django가 이를 받아 `Access Token` 요청
4. **Django가 `Access Token` 발급 후, 사용자 정보 요청**
5. **Django가 사용자 정보를 기반으로 로그인 및 세션 저장**
6. **사용자를 `/download-list/`로 리디렉션**
7. **로그인 완료 후 Django의 `request.user`에 유저 정보 저장**

---

## **🛠 추가 기능**
### **🔹 로그인 버튼 추가**
템플릿 (`login.html`)에 카카오 로그인 버튼을 직접 추가할 수도 있습니다.

```html
<a href="url 'social:begin' 'kakao' ">
    <img src="https://developers.kakao.com/assets/img/about/logos/kakaologin/logo/kakao_login_medium_wide.png" alt="카카오 로그인">
</a>
```

---

### **🔹 로그아웃 설정**
카카오 로그인 후 로그아웃하려면 Django의 `logout` 뷰를 사용합니다.

#### **1. `urls.py`에 로그아웃 URL 추가**
```python
from django.contrib.auth.views import LogoutView

urlpatterns += [
    path('logout/', LogoutView.as_view(next_page='/'), name='logout'),
]
```

#### **2. 로그아웃 버튼 추가 (`base.html`)**
```html
<a href="url 'logout' ">로그아웃</a>
```

---

## **✅ 결론**
이제 Django에서 **카카오 로그인 API**를 사용하여 OAuth 인증을 구현하고, `/login/`에서 자동 리디렉션되도록 설정되었습니다.  
로그인 흐름이 정상적으로 동작하면, `request.user`를 통해 사용자 정보를 가져와 원하는 기능을 추가할 수 있습니다. 🚀  
