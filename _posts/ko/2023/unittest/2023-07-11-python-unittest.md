---
title: Python - 단위테스트 Unit test 사용법
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- Unittest
toc: true
toc_sticky: true
toc_label: 목차
description: unittest
article_tag1: python
article_tag2: unittest
article_tag3: 
article_section: unittest
meta_keywords: python, unittest
last_modified_at: '2023-07-11 21:00:00 +0800'
---

## 파이썬 단위 테스트

코드를 작성하고 pull request를 하여 팀원들의 코드 리뷰를 받는 것과 
코드를 일일히 테스트 해보는 것은 반드시 필요한 작업이다.

테스트는 선택이 아닌 필수이지만 일일히 확인하기에는 시간이 많이 소요될 수 있는 작업이므로 효율적으로 테스트하도록 지원해주는 도구를 사용할 것이다.

각 테스트 케이스마다 함수를 실행하고 결과 로그를 일일히 확인하는 방법도 있지만, 더 조직적이고 규모가 있는 조직일수록 더욱 전문화된 테스트 수준을 요구한다.

단위 테스트와 관련된 도구들은 신뢰할 수 있는 애플리케이션을 완성하기 필수적으로 알아야하는 내용이다.
Python에 포함된 다양한 테스트를 자동화할 수 있는 기능이 포함되어 있는 표준 라이브러리가 있는데, 여기에서는 unittest를 소개한다.
unittest java의 JUnit과 같은 단위테스트 프레임워크이다.

## 1. test case 구조
![img](/assets/images/unittestimg/20230711_testcase.png "unittest")


## 2. unittest의 객체지향적인 개념

 unittest는 객체 지향적인 방법으로 몇 가지 중요한 개념을 지원한다.

- **테스트 픽스쳐(test fixture)** 는 1개 이상의 테스트를 수행할 때 필요한 작업을 수행한다. 예를 들면, 로그인을 위해 계정 정보를 설정하거나 DB 접속 정보 설정과 같은 것이다.

- **테스트 케이스(test case)** 는 테스트의 개별 단위이다. 특정한 입력에 대해서 특정한 결과를 확인한다. 이 클래스에서는 새로운 테스트 케이스를 만들도록 지원한다.

- **테스트 묶음(test suite)** 은 여러 테스트 케이스 묶음이다.

- **테스트 실행자(test runner)** 는 테스트 실행을 조율하고 테스트 결과를 사용자에게 제공하는 역할을 하는 컴포넌트이다. 실행자는 테스트 실행 결과를 보여주기 위해 그래픽 인터페이스, 텍스트 인터페이스를 사용하거나 특별한 값을 반환할 수도 있다.

- **assertion** unittest의 테스트 결과(Pass or Fail)를 결정한다.
bool test, 객체의 적합성, 적절한 예외 발생 등 다양한 확인을 할 수 있다.

## 3. 특징

- 각각의 메소드는 독립적으로 테스트되며 서로 영향을 주지 않는다.
- 전체 테스트 메서드를 실행할 시에 테스트 메서드의 순서는 문자열 이름순으로 동작한다.

## 4. unittest 순서

(1) unittest 모듈 가져오기(import)

(2) unittest.TestCase을 상속하여 사용자 클래스를 만든다. 이 클래스에서 테스트 하고자 하는 메서드를 작성한다.

(3) 테스트 메서드를 생성한다. 테스트 타켓 function을 호출하고 그 결과값을 self.assert*() 메서드를 원하는 결과값으로 나오는지 확인한다.

## 5. 소스코드 구조
```py
from unittest

class 테스트 대상 클래스
    def 테스트 대상 함수 1
        return

    def 테스트 대상 함수 2
        return
    .
    .
    .

class 테스트 리포팅할 사용자 클래스(unittest.Testcase 상속)
    def 테스트 수행할 메서드
        assertEqual()로 확인
    .
    .
    .

if __name__ == '__main__': # unittest 실행
    unittest.main()
```

## 6. 테스트 전 또는 후 설정을 도와주는 함수

### (1) 테스트 전 setUp()
setUp() 메소드를 통해서 테스트 전에 실행하는 함수를 작성할 수 있다.

    
    1. 인스턴스 생성 및 초기화 : 테스트 메서드가 실행되기 전에 새로운 인스턴스를 만들고 초기화 한다.
    2. 테스트 데이터 또는 픽스처 설정: 테스트에 일부 초기 데이터 또는 픽스처가 있어야 하는 경우 메서드에서 설정할 수 있다.
    3. 테스트 환경 구성: 각 테스트 사례가 실행 전에 예상되는 환경을 갖추도록 한다.
    

### (2) 테스트 후 tearDown()
tearDown() 메소드를 통해서 테스트 후에 실행하는 함수를 작성할 수 있다.



## 7. sample code (python 3.10)

[소스코드 바로가기](https://github.com/amirer21/python-exam/tree/main/unittestExam "소스코드 바로가기")

```py
import unittest

#테스트 대상이 되는 클래스와 함수
class ApiFunctions:
    def getMethod(self, x, y):
        if x == "apiUrl" and y == "testQuery":
            return 200
        else:
            return 400
        
    def postMethod(self, x, y):
        if x == "apiUrl" and y == "testQuery":
            return 433
        else:
            return 400
    
    def chkResponse(self, x, y):
        if x == y:
            return True
        else:
            return False        
        
    
    def chkTextResponse(self, x, y):
        if x == y:
            return True
        else:
            return False        
        
# unittest.TestCase를 상속받아 테스트
class ApiFunctionsTest(unittest.TestCase):

    def setUp(self):
        # 테스트 케이스 객체 생성
        self.apiTestTarget = ApiFunctions()

    def tearDown(self):
        # 사용 후 리소스 초기화
        pass

    def test_getMethod(self):
        result = self.apiTestTarget.getMethod("apiUrl", "testQuery")
        self.assertEqual(result, 200)

    def test_postMethod(self):
        result = self.apiTestTarget.postMethod("apiUrl", "testQuery")
        self.assertEqual(result, 433)
        
    def test_chkResponse(self):
        result = self.apiTestTarget.chkResponse("apiTest", "apiTest")
        self.assertEqual(result, True)
        
    def test_chkTextResponse(self):
        result = self.apiTestTarget.chkTextResponse("abc", "def")
        self.assertEqual(result, True)

# Run the tests
if __name__ == '__main__':
    unittest.main()
```

## 7.1 실행 명령어

> (형식) python -m unittest 모듈화된_파이썬_파일이름.unittest.TestCase를_상속받은_클래스.실행할_function
> python -m unittest testSampleHttp.ApiFunctionsTest
> python -m unittest testSampleHttp.ApiFunctionsTest.test_getMethod

### 7.2 위의 코드 실행 
> python -m unittest testSampleHttp

### 7.3 로그 
```
.F..
======================================================================
FAIL: test_chkTextResponse (testSampleHttp.ApiFunctionsTest)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "D:\python_workspace\insta\testSampleHttp.py", line 57, in test_chkTextResponse
    self.assertEqual(result, True)
AssertionError: False != True

----------------------------------------------------------------------
Ran 4 tests in 0.003s

FAILED (failures=1)
```

## 8. assert 함수
```
assertEqual(a, b)   	a==b 비교
assertNotEqual(a, b)	a!=b 비교
assertTrue(expr)	    bool(expr) is True 비교
assertFalse(expr)	    bool(expr) is False 비교
assertIs(a, b)	        a is b 비교
assertIsNot(a, b)	    a is not b 비교
assertIsNone(expr)	    expr is None 비교
assertInNotNone(expr)	        expr is not None 비교
assertIn(member, container)	    member in container 비교
assertNotIn(member, container)	member not in container 비교
assertIsInstance(obj, cls)	    isinstance(obj, cls) 비교
assertNotIsInstance(obj, cls)	not isinstance(obj, cls) 비교
```

### 참고

https://docs.python.org/ko/3/library/unittest.html#unittest.TestCase

https://docs.python.org/ko/3/library/unittest.html