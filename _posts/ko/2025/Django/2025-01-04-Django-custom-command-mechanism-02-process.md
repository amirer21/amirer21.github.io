---
title: Django - 커스텀 명령어 탐지 메커니즘 02 - 실행 과정
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
description: Django 커스텀 명령어 탐지 메커니즘
article_tag1: Django
article_tag2: Python
article_tag3: 
article_section: 
meta_keywords: Django, Python
last_modified_at: '2025-01-04 21:00:00 +0800'
---

앞의 설명에 이어서 Django에서 커스텀 명령어 파일을 읽어서 수행하는 과정을 정리해보았습니다.

`python manage.py dosomething` 명령어를 입력했을 때, Django가 `dosomething` 파일을 찾아 해당 명령어를 실행하는 과정은 다음과 같이 이루어집니다.

---

## **Django에서 명령어 실행 과정**

1. **`manage.py` 실행**
   - 사용자가 `python manage.py dosomething` 명령어를 실행하면 Django의 `manage.py` 스크립트가 실행됩니다.
   - `manage.py`의 주요 역할은 사용자 입력을 받아 Django의 명령어 실행 시스템에 전달하는 것입니다.

   ```python
   # manage.py 내부
   os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'myproject.settings')
   from django.core.management import execute_from_command_line
   execute_from_command_line(sys.argv)
   ```

   여기서:
   - `sys.argv`는 입력된 명령어를 포함하는 리스트로 예를 들어:
     ```python
     sys.argv = ['manage.py', 'dosomething']
     ```

---

2. **`execute_from_command_line` 호출**
   - `execute_from_command_line()` 함수는 `sys.argv`에서 명령어 이름(`dosomething`)을 추출합니다.
   - 이 함수는 Django의 명령어 처리 시스템을 호출하여 입력된 명령어를 처리합니다.

---

3. **명령어 검색**
   Django는 명령어 이름(`dosomething`)을 기반으로 다음 위치에서 명령어를 검색합니다:

   ### **(1) 기본 Django 명령어 확인**
   - Django는 내장 명령어(예: `runserver`, `migrate`, `createsuperuser`)에서 `dosomething` 명령어가 있는지 확인합니다.
   - 찾을 수 없으면 다음 단계로 넘어갑니다.

   ### **(2) `INSTALLED_APPS`의 앱 탐색**
   Django는 프로젝트의 `INSTALLED_APPS` 설정에 등록된 모든 앱의 디렉터리를 순회하며 `management/commands/` 폴더를 탐색합니다.

   - **경로 예시**:
     - `myapp/management/commands/dosomething.py`

   - 명령어 이름(`dosomething`)은 파일 이름과 일치해야 합니다:
     - `commands/dosomething.py` → 명령어 이름은 `dosomething`.

---

4. **`Command` 클래스 로드**
   - `dosomething.py` 파일이 발견되면 Django는 해당 파일의 `Command` 클래스를 로드합니다.
   - 이 클래스는 반드시 `BaseCommand`를 상속받아야 하며 명령어 실행 로직은 `handle()` 메서드에 작성됩니다.

   #### **`dosomething.py` 예시**
   ```python
   from django.core.management.base import BaseCommand

   class Command(BaseCommand):
       help = 'This is a custom command to do something.'

       def handle(self, *args, **kwargs):
           self.stdout.write("Executing the 'dosomething' command!")
   ```

---

5. **명령어 실행**
   - Django는 `Command` 클래스의 `handle()` 메서드를 호출하여 명령어를 실행합니다.
   - `handle()` 메서드 내부의 로직이 실행되어 사용자 정의 작업을 수행합니다.
   - 명령어 실행 중 발생하는 출력은 `self.stdout.write()` 또는 `self.stderr.write()`를 통해 사용자에게 표시됩니다.

   #### **명령어 실행 결과**
   ```bash
   python manage.py dosomething
   ```

   출력 예시:
   ```plaintext
   Executing the 'dosomething' command!
   ```

---

## **Django 명령어 실행 과정 요약**

1. **명령어 입력**:
   - 사용자가 `python manage.py dosomething`을 입력합니다.

2. **`manage.py`가 명령어 전달**:
   - `manage.py`는 `dosomething` 명령어를 Django의 명령어 처리 시스템에 전달합니다.

3. **명령어 검색**:
   - Django는 `INSTALLED_APPS`의 각 앱 디렉터리에서 `management/commands/dosomething.py` 파일을 탐색합니다.

4. **`Command` 클래스 로드 및 실행**:
   - `dosomething.py`에서 `Command` 클래스를 로드하고, `handle()` 메서드를 실행합니다.

5. **명령어 결과 출력**:
   - `handle()` 메서드의 결과가 터미널에 출력됩니다.

---

### **명령어 실행 흐름 그림**

```plaintext
python manage.py dosomething
        │
        ▼
  manage.py 실행
        │
        ▼
  execute_from_command_line
        │
        ▼
  명령어 검색:
    - 기본 명령어
    - INSTALLED_APPS의 각 앱
        │
        ▼
  dosomething.py 발견
        │
        ▼
  Command 클래스 로드
        │
        ▼
  handle() 메서드 실행
        │
        ▼
  결과 출력
```

---

### **참고 사항**
- **파일 이름**:
  명령어 이름과 파일 이름이 정확히 일치해야 합니다(`dosomething` → `dosomething.py`).
  
- **`INSTALLED_APPS`**:
  명령어 파일은 반드시 `INSTALLED_APPS`에 등록된 앱의 디렉터리에 있어야 합니다.

- **명령어 도움말**:
  커스텀 명령어를 추가한 후 `python manage.py help` 명령어를 실행하면 `dosomething` 명령어가 표시됩니다.
