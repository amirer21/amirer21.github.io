---
title: Python - JSON, Dictionary 정리(json load and dump)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- JSON
- Dictionary
toc: true
toc_sticky: true
toc_label: 목차
description: type
article_tag1: python
article_tag2: json  
article_tag3: dictionary
article_section: type
meta_keywords: python, json, dictionary
last_modified_at: '2023-08-18 21:00:00 +0800'
---

## 파이썬 JSON, Dictionary 정리 - loads(), load(), dumps(), dump()
### json 이란?
JSON은 JavaScript 객체 표기법(JavaScript Object Notation)을 뜻합니다. JSON은 서버와 웹 애플리케이션 간의 데이터 교환에 일반적으로 사용되는 경량(lightweight) 데이터 교환 형식이다.

웹 애플리케이션 상에서 정보를 저장하고 전달하는 데 쓰이는 데이터 포맷이다.

이 방법은 네트워크를 통해 쉽게 전송하거나 파일에 저장할 수 있는 형식으로 데이터를 직렬화하려는 경우에 유용하다.

-----------------
#### 기본 JSON 문법

JSON에서 데이터는 다음과 같이 키(key)-값(value)의 쌍으로 표기한다.

Key(속성)은 "쌍따옴표"로 묶어서 문자열로 표기한다. 숫자도 문자열로 표현된다.

Value(값)은 모든 자료형이 가능하며 자료형에 따라 표기 방법이 달라진다.

```
"name": "Kim"
```
JSON object는 {중괄호}로 표기한다.
JSON array는 [대괄호]로 표기한다.

```
{
    "first_name": "Katie",  
    "last_name": "Rodgers"
}
```
-----------------
### json.loads()

- json.loads() : JSON 문자열을 파싱하여 Dictionary 의 Key, Value 형태로 변경해준다.

### json.load()

- json.load(파일 객체)

- **JSON 파일**을 읽을 때는 json.load()를 사용한다. load() 함수는 읽은 데이터를 Dictionary 자료형으로 반환한다.
> JSON file -> Dictionary

### json.dumps()

- json.dumps() :  파이썬 객체를 JSON 형태로(문자열) 바꿔준다.

- dumps 메서드는 jsonPython 객체(일반적으로 사전)를 JSON 형식 문자열로 변환하는 데 사용되는 Python 의 라이브러리에서 제공하는 메서드이다.


### json.dump()

- json.dump(Dictionary, 파일 객체)

- **JSON 파일**에 write 하는데 사용할 수 있다. Dictionary 자료형을 JSON 파일로 생성할 때는 json.dump(Dictionary, 파일 객체)를 사용한다. 
> Dictionary -> JSON file

파이썬에서는 JSON 타입의 데이터를 Dictionary로 주로 처리하고 외부로 전달할 때는 JSON 형태로 바꾸어 전달한다.

-----------------

### 예제

#### 예제 설명

json_exam_data 라는 사전(Dictioonary) 타입 데이터를 만든다.

json.dump() : "data.json"이라는 JSON 파일에 사전을 json.dump()쓰는 데 사용한다.

json.load() :  "data.json" 파일에서 데이터를 읽고 사전(Dictioonary)타입으로 로드한다.


```py
import json

# Creating a dictionary
json_exam_data = {
    "name": "John",
    "age": 30,
    "city": "New York"
}

dumped_data = json.dumps(json_exam_data)
print("dumped_data :: ", dumped_data)
print("dumped_data data type :: ", type(dumped_data))

# Writing the dictionary to a JSON file
with open("data.json", "w") as json_file:
    json.dump(json_exam_data, json_file)

# Reading the JSON file and loading the data back into a dictionary
with open("data.json", "r") as json_file:
    loaded_data = json.load(json_file)

print(loaded_data)
#{'name': 'John', 'age': 30, 'city': 'New York'}
print("loaded_data type :: ", type(loaded_data))
# loaded_data type ::  <class 'dict'>
```



### 예제
```py
# Creating a dictionary
student = {
    "name": "Alice",
    "age": 22,
    "major": "Computer Science",
    "gpa": 3.8
}

# Accessing values in the dictionary
print("Name:", student["name"])
print("Age:", student["age"])
print("Major:", student["major"])
print("GPA:", student["gpa"])

# Modifying values in the dictionary
student["age"] = 23
student["gpa"] = 3.9

# Adding a new key-value pair
student["university"] = "XYZ University"

# Deleting a key-value pair
del student["major"]

# Iterating through dictionary keys and values
for key, value in student.items():
    print(key, ":", value)

# Checking if a key exists in the dictionary
if "age" in student:
    print("Age:", student["age"])
else:
    print("Age not found")

# Getting a default value if key is not found
print("Major:", student.get("major", "N/A"))

# Getting all keys and values as lists
keys = list(student.keys())
values = list(student.values())

# Getting the number of key-value pairs in the dictionary
num_entries = len(student)

# Clearing all entries from the dictionary
#student.clear()

# Printing the modified dictionary
print(student)
#{'name': 'Alice', 'age': 23, 'gpa': 3.9, 'university': 'XYZ University'}
```

----------------------------------

'''
사전(Dictionary) 형태로 데이터의 구조화된 표현을 만드는 예제 코드
to_dict() 메서드는 객체의 속성을 사전(Dictionary) 형태로 변환하기 위한 커스텀 메서드이다.
일반적으로 개체의 상태를 키-값 쌍의 컬렉션으로 나타내려는 경우에 사용된다.

'''

### 예제
```py
class Person:
    def __init__(self, name, age, city):
        self.name = name
        self.age = age
        self.city = city
    
    def to_dict(self):
        return {
            "name": self.name,
            "age": self.age,
            "city": self.city
        }


# Creating an instance of the Person class
person = Person("John", 30, "New York")

# Converting the instance to a dictionary using to_dict()
person_dict = person.to_dict()

# Printing the dictionary
print(person_dict)
#{'name': 'John', 'age': 30, 'city': 'New York'}
```


### 타입 확인 (Dictionary, JSON 비교) 그리고 "", ''

json string은 ""로 나타낸다.dict는 ''로 나타나는 것을 확인할 수 있다.

JSON에서 큰따옴표("")는 표준이며 키 및 문자열 값을 정의하는 데 사용한다. JSON에서 작은따옴표('')를 사용하면 유효한 JSON 구문이 아니다?

요약하면 큰따옴표("")와 작은따옴표('')를 모두 사용하여 Python에서 문자열을 정의할 수 있지만 JSON에서는 키와 문자열 값 주위에 큰따옴표를 사용해야 한다. 사전(Dicitionary) 타입으로 작업할 때 키에 두 가지 유형의 따옴표를 사용할 수 있지만 JSON 형식과 일치시키기 위해 큰따옴표("")를 사용하는 것이 일반적이다.


### 예제
```py
json_data = {
    "name": "John",
    "age": 30
}

print("json_data :: ", json_data)
print("json_data type :: ", type(json_data))

#json dump
json_dump = json.dumps(json_data)
print("json_string :: ", json_dump)
print("json_data tpye :: ", type(json_dump))

#json load
#dictironary를 json으로 변환
#타입 에러 TypeError: the JSON object must be str, bytes or bytearray, not dict
#json_load = json.loads(json_data)

json_load = json.loads(json_dump)
print("json_load :: ", json_load)
print("json_load type :: ", type(json_load))

```

### 출력
```
json_data ::  {'name': 'John', 'age': 30}
json_data type ::  <class 'dict'>
json_string ::  {"name": "John", "age": 30}
json_data tpye ::  <class 'str'>
json_load ::  {'name': 'John', 'age': 30}
json_load type ::  <class 'dict'>
```
----------------------------------