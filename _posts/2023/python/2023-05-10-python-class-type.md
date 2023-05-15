---
title: Python - class type
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
description: class type
article_tag1: python
article_tag2: class
article_tag3: type
article_section: python
meta_keywords: python, class, type
last_modified_at: '2023-05-10 21:00:00 +0800'
---

## 자바 vs 파이썬 클래스 타입(자료형) 비교

자바에서는 자료형(데이터 유형)이 기본형(primitive type : 정수, 실수, 문자, 논리값 등), 참조형(reference type : 배열, 클래스, 인터페이스 등)로 구분된다. 참조 유형의 변수는 데이터를 그대로 저장하지 않고 데이터를 저장하는 메모리의 주소만 저장한다. 참조형 변수는 인스턴스를 생성해서 사용하는 것이다.

자바에서 아래와 같은 형식으로 클래스 타입을 선언한다.

> 클래스타입 참조변수 = 받아오는 데이터

> DtoClass타입 dtoData변수 = 받아오는 데이터

```java
DtoClass dtoData = this.someClass.someMethod("name", "number", "address");
```

파이썬에서는 아래와 같은 형식으로 클래스 타입을 선언한다.

> ' : ' 콜론을 사용한다.

> 참조변수: 클래스타입 = 데이터

> dtoData변수: DtoClass타입 = 받아오는 데이터

```python
dtoData: DtoClass= someClass.someMethod("name", "number", "address")
```

아래와 같이 변수에 클래스 객체 데이터를 받아올 수도 있다.

```python
 dtoData = DtoClass("name", "number", "address")
```

main에서는 AnoterDtoClass(Class B)의 데이터를 DtoClass(Class A)의 타입으로 변수를 담는 예제이다.

```python
#DTO Class A
class DtoClass:
	def __init__(self, returnCode, modelName, modelNumber):
		self.returnCode = returnCode
		self.modelName = modelName
		self.modelNumber = modelNumber

#DTO Class B
class AnoterDtoClass:
    def __init__(self, returnCode, modelName, modelNumber):
        self.returnCode = returnCode
        self.modelName = modelName
        self.modelNumber = modelNumber

    def createData(returnCode, modelName, modelNumber):
        return AnoterDtoClass(returnCode, modelName, modelNumber)

#main
class MainClass:
    def testMain(self):
        createResponse: DtoClass = AnoterDtoClass.createData(1, "modelName", "modelNumber")
        #createResponse: DtoClass = AnoterDtoClass.createData(1, "modelName", "modelNumber")
        print('createResponse :: ', createResponse.__dict__)


printExam = MainClass()
print('printExam :: ', printExam.testMain())

```