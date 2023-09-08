---
title: Python - with
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
description: with
article_tag1: python
article_tag2: with
article_tag3: 
article_section: with
meta_keywords: python, with
last_modified_at: '2023-06-13 21:00:00 +0800'
---

## with
파일 스트림에서 리소스 관리를 단순화하는데 도움을 준다.
파일 스트림에서 예외가 발생하더라도  try-except-finally 블록을 명시적으로 작성하지 않고도 리소스 관리를 쉽게 처리할 수 있다. 파일 실행 또는 종료 코드가 실행되도록 하는 방법을 제공한다.

## 1. with를 사용해서 작성하기

예를 들면 아래와 같이 작성한다.
```py
with open('example.txt', 'r') as file:
    contents = file.read()
    # 파일을 불러와서 어떤 작업을 수행
```

'with' 블록 이후에는 파일은 자동으로 close된다.


## 2. with를 사용하지 않고 작성하기
```py
file = open('example.txt', 'r')
try:
    contents = file.read()
    # 파일을 불러와서 어떤 작업을 수행
finally:
    file.close()
```

 파이썬에서는 파일을 열거나 쓰는 작업을 할 때 open() 함수를 사용하는데 이 경우 위와 같이 close()를 해줘야 한다.

 이렇게 파일 작업의 경우 리소스 관리를 위해 명시적으로 파일을 열고 닫는 작업이 포함되므로 파일 작업을 한번만 하거나 그 로직이 적은 경우는 상관없지만, 여러 개의 경우 코드가 늘어날 것이다.

 하지만 with를 사용하면 리소스 획득 및 해제를 수동으로 관리하는 코드에서 조금 편해줄 수 있다. good!