---
title: Python 에서도 Private을 사용하려면?
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: private
article_tag1: python
article_tag2: private
article_tag3: 
article_section: python
meta_keywords: python, private
last_modified_at: '2023-05-10 21:00:00 +0800'
---

# 접근제어자 Private 

자바에서는 접근제어자로 private을 사용하는데
파이썬에서도 private을 사용할 수 있을까?

> 참고 : https://www.quora.com/Why-does-Java-have-public-and-private-while-Python-does-not

1.  자바 예제
```java
public class PrivateClassExample {
	private String returnCode;
	private String userName;
	private List<SampleObject> objectList;
	private int userNumber;
	private long totalScore;
}
```

파이썬에서 private을 구현하려면 ._클래스이름__변수이름 형식으로 접근이 가능하다.

> _(한개) 클래스 __(두개) 필드

2. 파이썬 예제
```python
class PrivateClassExample:
	def __init__(self, returnCode, userName, userNames: List, userNumber, totalScore):
		self.__returnCode = returnCode
		self.__userName = userName
		self.__userNames = userNames
		self.__userNumber = userNumber
		self.__totalScore = totalScore


privatePrint = PrivateClassExample("0", "test", [1, 2], 1, 2)
print('privatePrint :: ', privatePrint.__dict__)
print('privatePrint totalScore :: ', privatePrint._PrivateClassExample__totalScore)
```

> "양식의 모든 식별자 __name(최소 두 개의 선행 밑줄, 최대 하나의 후행 밑줄)는 공개적으로 로 대체됩니다 _classname__name. 여기서 classname는 선행 밑줄이 제거된 현재 클래스 이름입니다.
따라서 __name에 직접 액세스할 수 없지만 _classname__name. 으로 액세스할 수 있습니다."

참고 : https://stackoverflow.com/questions/70528/why-are-pythons-private-methods-not-actually-private