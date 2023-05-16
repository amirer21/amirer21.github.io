---
title: Python - byte literal (바이트 리터럴)
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
description: 바이트 리터럴
article_tag1: python
article_tag2: byte
article_tag3: literal
article_section: python
meta_keywords: python, byte, literal
last_modified_at: '2023-05-17 21:00:00 +0800'
---

## python 바이트 리터럴 (접두사 'b')

파이썬에서 'b'가 붙은 접두사는 무엇일까?

파이썬에서 접두사 'b'는 "바이트" 리터럴임을 나타낸다. 문자열이 문자 시퀀스가 ​​아닌 바이트 시퀀스로 취급되어야 함을 나타냅니다.


- 'b' 접두사는 문자열이 일련의 바이트로 표시된다.

> 바이트로 처리하는 이유 : 이진 데이터로 작업하거나 이진 데이터를 처리하는 파일 또는 네트워크 스트림에서 읽고 쓰기 위해서이다.

Python에서 문자열은 유니코드 문자열 또는 바이트 문자열로 나타낼 수 있다. 

- 유니코드 문자열은 일반적으로 텍스트 데이터를 처리하는데 사용
- 바이트 문자열은 파일 내용이나 네트워크 통신과 같은 이진 데이터에 사용

따라서, UTF-8과 같은 적절한 문자 인코딩을 사용하여 문자열 형식으로 디코딩해야 한다.

```python
import json

response_content = b'{"returnCode":"200","name":"search name"}}'
decoded_content = response_content.decode('utf-8')
response_data = json.loads(decoded_content)

print(response_data)
```

이래와 같이 __dict__ 로 나타난 데이터가 있다.
name의 값을 가져오려면 아래와 같이 한다.

'b' 접두사가 있는 부분을 바이트를 UTF-8로 인코딩한 후에
> name = response_data['name']

```python
print('response_entity :: ', response_entity.__dict__)
response_entity ::  {'_content': b'{"returnCode":"200","name":"search name"}}
response_data = json.loads(response_entity.__dict__['_content'].decode('utf-8'))
```
