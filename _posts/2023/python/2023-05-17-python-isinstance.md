---
title: Python - 클래스 타입 확인 방법 isinstance()
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
description: isinstance 클래스 타입 확인 방법
article_tag1: python
article_tag2: isinstance
article_tag3: json
article_section: python
meta_keywords: python, isinstance, json
last_modified_at: '2023-05-17 21:00:00 +0800'
---


## python에서 클래스 타입을 확인하고 JSON 타입으로 변환하기


### DTO Class

```python
class ModelCreateRequest:
	def __init__(self, name, id, description):
		self.name = name
		self.id = id
		self.description = description
		
	#JSON 타입으로 하면 아래와 같다.
	'''	
	def to_dict(self):
			return {
				'name': self.name,
				'id': self.id,
				'description': self.description,
			}
	'''			
			
#객체 타입 확인
if isinstance(body, (ModelCreateRequest)):
    # 위의 클래스 타입을 JSON 타입으로 직렬화 한다.
	json_data = json.dumps(body.__dict__)    
else:
	json_data = None
print(f'-------- handleRestApi -----------  json_data :: {json_data}')
```