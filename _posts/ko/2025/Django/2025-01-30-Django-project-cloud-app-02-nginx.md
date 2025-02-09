---
title: Django - WSL에서 Django 웹 서버를 외부에서 접속 가능하도록 설정하기
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
description: WSL에서 Django 웹 서버를 외부에서 접속 가능하도록 설정하기
article_tag1: Django
article_tag2: Python
article_tag3: Framework
article_section: Django
meta_keywords: Django, Python
last_modified_at: '2025-01-30 21:00:00 +0800'
---


## **WSL에서 Django 웹 서버를 외부 설정**  

Django 웹 서버를 WSL에서 구동 중이며, 외부에서 `http://devmiro.co.kr`로 접속하려고 할 때, 공유기의 관리자 페이지(`http://devmiro.co.kr:8899/login/login`)로 리다이렉트되는 문제가 발생하고 있습니다.  

이 문제를 해결하기 위해 **포트 포워딩, Nginx 설정, Django 설정**을 올바르게 구성하는 방법을 정리하겠습니다.

---

## **1. 포트 포워딩 설정 (공유기 설정)**
외부에서 들어오는 HTTP 요청(`80`번 포트)을 WSL 내부의 Django 서버(`123.12.123.22:8088`)로 전달하기 위해 **공유기에서 포트 포워딩 설정**을 해야 합니다.

1. **공유기 관리자 페이지 접속**
   - `http://123.123.123.1:8899` (현재 공유기 관리자 페이지)로 접속하여 로그인합니다.

2. **포트 포워딩 메뉴로 이동**
   - 메뉴 이름은 제조사마다 다를 수 있으며, "포트 포워딩", "가상 서버", "NAT 설정" 등의 이름으로 되어 있습니다.

3. **새 포트 포워딩 규칙 추가**
   - **소스 IP 주소**: `0.0.0.0` (모든 외부 IP 허용)  
   - **소스 포트**: (비워 둠)  
   - **외부 포트**: `80`  
   - **내부 IP 주소**: `123.12.123.22` (WSL의 내부 IP)  
   - **내부 포트**: `8088`  
   - **프로토콜**: `TCP`  
   - **설명**: `Django Server`

4. **저장 후 공유기 재부팅**
   - 설정을 적용한 후 공유기를 재부팅합니다.

---

## **2. WSL에서 Nginx 설치 및 설정**
Nginx를 리버스 프록시로 설정하여 외부에서 들어오는 요청을 Django 서버로 전달합니다.

### **2-1. Nginx 설치**
```bash
sudo apt update
sudo apt install nginx -y
```

### **2-2. Nginx 설정 파일 수정**
```bash
sudo nano /etc/nginx/sites-available/devmiro
```
아래 내용을 입력합니다.
```nginx
server {
    listen 80;
    server_name devmiro.co.kr www.devmiro.co.kr;

    location / {
        proxy_pass http://127.0.0.1:8088;  # Django 서버로 프록시
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

설정을 적용하기 위해 사이트를 활성화합니다.
```bash
sudo ln -s /etc/nginx/sites-available/devmiro /etc/nginx/sites-enabled/
```

### **2-3. Nginx 설정 테스트 및 재시작**
```bash
sudo nginx -t  # 설정 확인
sudo service nginx restart  # Nginx 재시작
```

---

## **3. Django 설정 변경**
Django가 외부 접속을 허용하도록 설정해야 합니다.

### **3-1. `settings.py` 수정**
```python
ALLOWED_HOSTS = ['devmiro.co.kr', 'www.devmiro.co.kr', 
'localhost', '127.0.0.1']
```

### **3-2. Django 실행 시 0.0.0.0으로 바인딩**
```bash
python manage.py runserver 0.0.0.0:8088
```
이제 Django는 외부에서도 `8088` 포트로 접속할 수 있습니다.

---

## **4. 방화벽 설정 (UFW)**
Django 서버의 `8088` 포트가 방화벽에 의해 차단되지 않도록 허용합니다.

```bash
sudo ufw allow 8088
sudo ufw allow 80
```

---

## **5. 최종 확인**
1. **도메인 DNS 설정**  
   - 도메인 관리 사이트에서 `devmiro.co.kr`의 **A 레코드**를 `123.123.123.1`로 설정했는지 확인합니다.  
   - 변경 사항이 반영되기까지 최대 24시간이 걸릴 수 있습니다.

2. **브라우저에서 접속 확인**  
   - `http://devmiro.co.kr`에 접속하여 Django 서버가 정상적으로 뜨는지 확인합니다.

---

## **최종 정리**
| 설정 단계 | 설명 |
|-----------|-----------------------------------|
| **포트 포워딩** | 공유기에서 `80` → `123.12.123.22:8088`로 포워딩 |
| **Nginx 설정** | `80`번 포트 요청을 Django로 리버스 프록시 |
| **Django 설정** | `ALLOWED_HOSTS` 설정 및 `0.0.0.0:8088`에서 실행 |
| **방화벽 설정** | `8088`, `80` 포트 허용 |
| **DNS 설정** | 도메인의 A 레코드를 `123.123.123.1`로 설정 |

위 설정을 모두 완료하면 **외부에서 `devmiro.co.kr`로 접속 시 WSL의 Django 서버로 연결**됩니다! 🚀