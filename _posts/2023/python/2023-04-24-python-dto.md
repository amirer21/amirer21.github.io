---
title: Python - DTO Class
layout: single
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
description: Python DTO (__init__, __str__ 이란)
article_tag1: python
article_tag2: DTO
article_tag3: 
article_section: DTO
meta_keywords: python, DTO
last_modified_at: '2023-04-24 21:00:00 +0800'
---
① ② *Python* 

## Python DTO 클래스 (추가적으로 __init__, __str__ 이란?)

### (1) DTO 클래스 - TestRequestDto.py
```python
class TestRequestDto:
    # __init__ 역할은?
    # 이 클래스(객체)가 호출되어 클래스가 인스턴스화되는 경우
    # 클래스 객체가 생성될 때 데이터를 초기화하는 역할을 수행한다.
    def __init__(self, userId, userEmail, fileName, fileSize):
        self.userId = userId
        self.userEmail = userEmail
        self.fileName = fileName
        self.fileSize = fileSize
    
    # __str__ 역할은?
    # interface로서의 역할을 수행한다.
    #서로 다른 타입을 가진 데이터끼리 상호작용 할 때 문자열로 변환시켜 호환되게 한다.
    def __str__(self):
        return str(self.userId)
    
    #getter
    def getuserId(self):
        return self.userId

    def getuserEmail(self):
        return self.userEmail

    def getFileName(self):
        return self.fileName

    def getFileSize(self):
        return self.fileSize

    #setter
    def setuserId(self, userId):
        self.userId = userId

    def setuserEmail(self, userEmail):
        self.userEmail = userEmail

    def setFileName(self, fileName):
        self.fileName = fileName

    def setFileSize(self, fileSize):
        self.fileSize = fileSize 
```

### (2) 호출 클래스 - TestMain.py
```python
#데이터 초기화
userId = "miro"
userEmail = tester + "@devmiro.com"
fileName = "miro/api/test.txt"
fileSize = 9268

#DTO 클래스 객체 생성
apiTestRequestDto = TestRequestDto.TestRequestDto(userId, userEmail, fileName, fileSize)

# 출력해보기
print('apiTestDto :: ', apiTestRequestDto.getUserId())
# 값 변경해보기
apiTestRequestDto.setUserId("set User id")
print('apiTestDto :: ', apiTestRequestDto.getUserId())
```