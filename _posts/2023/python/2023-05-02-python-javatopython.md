---
title: java object class to python object class
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- Java
- Class
toc: true
toc_sticky: true
toc_label: 목차
description: java object class to python object class
article_tag1: python
article_tag2: java
article_tag3: object
article_section: python
meta_keywords: python, java, object
last_modified_at: '2023-04-27 21:00:00 +0800'
---


## *자바 object 클래스*를 *파이썬 object 클래스*로 바꾸기
-------------

### 1. 자바 Object 클래스
```java
@Data
@NoArgsConstructor
public class ModelSearchResponse {
	private String returnCode;
	private String model;
	private Long modelUid;
	
	public ModelSearchResponse(String returnCode, String model, Long modelUid) {
		this.setReturnCode(returnCode);
		this.setModel(model);
		this.setModelUid(modelUid);
	}
} I have this java code, convert it to python
```
-------------

### 2. 파이썬 Object 클래스
```python
class ModelSearchResponse:
    def __init__(self, return_code, model, model_uid):
        self.return_code = return_code
        self.model = model
        self.model_uid = model_uid

```
-------------

### 3. 파이썬 동적 클래스

좀 더 dynamic 하게

### object class
```python
import json

class userDtoClass:
    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

    def to_json(self):
        return json.dumps(self.__dict__)
```
-------------
### **잠깐** from import 정리

>#import os  : 모듈을 불러오기

>#from os import* : os모듈로부터 os모듈이 가진 모든 함수를 불러옴

>#from os import 함수 : os모듈의 특정 함수를 불러옴

-------------

### 호출 main 클래스
```python
import json
from userDto import userDtoClass
#userDtoClass 객체 생성
person = userDtoClass(name="John", age=30, city="New York", state="NY", zip="10001")
print(person.to_json())
print('person :: ', person.name)

#새로운 키와 값 넣고
person.address = "Seoul"
# 불러오기
print('person :: ', person.address)

```

### **__dict\__** 란?

#### (1) 사용 목적 

클래스 객체의 속성을 dictionary 형태로 확인할 수 있다.
따라서 동적으로 속성 값들을 가져오거나 바꿀 수 있다.

#### (2) 접근 범위

객체에 별도로 보관되는 데이터 **인스턴스** 변수와 값에 쉽게 접근할 수 있다.

#### (3) 
특징(주의할 점)
외부에서 "새로운 필드(멤버)를 자유롭게 추가" 할 수 있다.
