---
title: Python - ValueError too many values to unpack (expected 2)
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
description: Python error, ValueError too many values to unpack (expected 2)
article_tag1: python
article_tag2: error  
article_tag3: 
article_section: python
meta_keywords: python, return, error
last_modified_at: '2023-09-16 21:00:00 +0800'
---

# 파이썬 결과 반환 에러

```py
rc, result = SomeObject.SomeFunction()
```

에러 발생
> ValueError: too many values to unpack (expected 2)


## 에러 원인 

함수의 반환값으로 2개 이상의 값을 반환하지만, 해당 값을 두 개의 변수(위와 같이 rc, result)로 압축 해제하려고 하기때문에 발생되는 에러이다. 이 오류를 해결하려면 압축을 풀고 있는 변수 수를 조정하거나 예상되는 값 수를 반환하도록 함수를 수정해야 한다.

## '_' 사용

'_'는 반환된 나머지 값을 무시한다.
추가 값은 '_'변수에 수집되는데, 의미는 추가적으로 반환되는 값들은 관심이 없다는 것을 의미한다.

> Only unpack the first two values and ignore the rest

```py
rc, result, *_ = SomeObject.SomeFunction()

print("rc:", rc)
print("result:", result)
```

## * 의미
Python에서 *(별표)는 "변수로 압축 풀기" 또는 "표시 연산자"라고도 알려진 확장 압축 풀기에 사용된다. 이를 통해 반복 가능한 항목(예: 목록 또는 튜플)의 여러 항목을 변수에 할당할 수 있다. 이는 추가 항목을 무시하기 위한 *_의 특정 용도이다.

사용법을 분석하면 다음과 같다.
```py
a, b, *rest = [1, 2, 3, 4, 5]
print(a)     # Output: 1
print(b)     # Output: 2
print(rest)  # Output: [3, 4, 5]
```

