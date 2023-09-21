---
title: Python - 클래스의 인스턴스(Class instance)
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
description: class
article_tag1: python
article_tag2: class
article_tag3: instance
article_section: python
meta_keywords: python, class, instance
last_modified_at: '2023-05-10 21:00:00 +0800'
---

## 클래스의 인스턴스 변수에 대한 이해
클래스의 인스턴스 변수에 대한 이해를 위한 예제이다.

클래스의 인스턴스 변수는 클래스의 인스턴스가 생성될 때마다 새로운 값을 가지게 된다.
한번 생성된 클래스의 인스턴스는 다른 클래스의 인스턴스와는 독립적으로 동작한다.
이 인스턴스는 메모리에 저장되고, 이 인스턴스를 통해서만 클래스의 변수에 접근할 수 있다.
메모리에 저장된 인스턴스를 호출해서 사용하는 과정을 설명하였다.

예제에서는 3가지 클래스를 생성하고, 각 클래스의 인스턴스를 생성하여, 인스턴스 변수에 값을 저장하고, 저장된 값을 출력하는 예제이다.

첫번째 클래스는 ExamClassFirst 클래스이다. 이 클래스는 context라는 인스턴스 변수를 가지고 있다. 그리고 get_context_1() 메서드와 set_context_1() 메서드를 가지고 있다.
get_context_1() 메서드는 context 변수에 저장된 값을 리턴한다. set_context_1() 메서드는 인자로 넘겨받은 값을 context 변수에 저장한다.

두번째 클래스는 ExamClassSecond 클래스이다. 이 클래스는 context라는 인스턴스 변수를 가지고 있다.
get_context_2() 메서드는 context 변수에 저장된 값을 리턴한다. 초기화할 때, context 변수에 None 값을 저장한다. 이 클래스를 호출하여 저장되는 값은 없다.
호출하여도 None 값만이 리턴된다.

세번째 클래스는 ExamClassThird 클래스이다. 이 클래스는 ExamClassFirst 클래스의 인스턴스 주소를 인자로 받아서, ExamClassFirst 클래스의 인스턴스 변수에 저장된 값을 가져온다.

ExamClassFirst 클래스의 인스턴스를 생성하고, ExamClassFirst 클래스의 인스턴스 주소를 ExamClassThird 클래스의 생성자에 넘겨준다.
ExamClassThird 클래스의 생성자에서는 넘겨받은 ExamClassFirst 클래스의 인스턴스 주소를 self.context에 저장한다.

## 예제 소스코드
```py
# 클래스 1
class ExamClassFirst:
    """
    설명 : 데이터를 가지게될 기본 클래스 1
    """
    def __init__(self):
        self.context = None
        print("ExamClassFirst constructor")
        
    def __del__(self):
        print("ExamClassFirst destructor")
        
    #__str__ : print() 함수로 객체를 출력할 때 호출되는 메서드
    #만약 __str__을 정의하지 않았다면, 객체를 출력할 때는 <__main__.ExamClassFirst object at 0x0000020B0F4F4E80> 와 같은 형태로 출력된다.
    #정의되어 있다면, __str__의 리턴값이 출력된다. 아래의 경우에는 "ExamClassFirst class" 가 출력된다.
    '''
    def __str__(self): 
        return "ExamClassFirst class"
    '''
    
    def set_context_1(self, context):
        print("set_context :: ", context)#출력값:set context exam1
        self.context = context    
    
    def get_context_1(self):
        return self.context
        
# 클래스 2        
class ExamClassSecond:
    """
    설명 : 데이터를 가지게될 기본 클래스 1
    """
    def __init__(self):
        self.context = None
        print("[ExamClassSecond] -2 constructor")
    
    def get_context_2(self):
        return self.context

# 클래스 3   
class ExamClassThird:
    #초기화로 ExamClassFirst 클래스의 인스턴스 주소를 넘겨받는다.
    def __init__(self, ExamClassFirst): 
        self.context = ExamClassFirst.get_context_1()
        #ExamClassFirst의 인스턴스 주소는?        
        print("[ExamClassThird] -3 ExamClassFirst instance address :: ", ExamClassFirst) #출력값:0x0000020732D06B50>
        #출력해보면 현재 생성된 ExamClassFirst의 인스턴스 주소와 동일하다.
        #이 ExamClassThird 클래스가 생성될 때, ExamClassFirst의 인스턴스 주소를 넘겨받아서,
        #ExamClassFirst의 인스턴스 주소를 self.context에 저장하기 때문이다.
        print("[ExamClassThird] -3 constructor :: ", self.context) #출력값: set context exam1  
    
    
#main 
if __name__ == "__main__":
    exam1 = ExamClassFirst() #첫번째 클래스의 인스턴스 생성
    exam2 = ExamClassSecond() #두번째 클래스의 인스턴스 생성
    
    #첫번째 클래스의 인스턴스에 context값을 저장
    set_exam1_val = exam1.set_context_1("set context exam1") 
    print("[main] ExamClassFirst instance addree :: ", exam1) #출력값:0x0000020732D06B50>
    print("[main] ExamClassFirst set val : ", set_exam1_val) #출력값:None
    
    #첫번째 클래스의 인스턴스에 저장된 context값을 가져온다.
    get_exam1_val = exam1.get_context_1() 
    print("[main] ExamClassFirst get val : ", get_exam1_val) #출력값:set context exam1
    
    get_exam2_val = exam2.get_context_2()    
    #두번째 클래스의 인스턴스에 저장된 context값을 가져온다. 값은 None
    print("[main] ExamClassSecond contextval : ", get_exam2_val) #출력값:None
    print("[main] ExamClassSecond instance addree :: ", exam2) #출력값:0x0000020732D06B50>
    
    #run ExamClassThird
    exam3 = ExamClassThird(exam1) #세번째 클래스의 인스턴스 생성
```