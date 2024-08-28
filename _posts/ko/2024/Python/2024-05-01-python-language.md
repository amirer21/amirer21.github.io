---
title: Python - language 기술적인 특징
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- Language
toc: true
toc_sticky: true
toc_label: 목차
description: Python 언어의 주요 기술적인 특징
article_tag1: python
article_tag2: laguage
article_tag3: 
article_section: python
meta_keywords: python, laguage
last_modified_at: '2024-05-01 21:00:00 +0800'
---

# 파이썬의 주요 기술적 특징

파이썬은 다양한 프로그래밍 패러다임을 지원하는 유연하고 강력한 프로그래밍 언어입니다. 이 문서에서는 파이썬의 주요 기술적 특징을 다룹니다.

## 1. 인터프리터 언어

파이썬은 인터프리터 언어로, 소스 코드를 별도로 **컴파일하는 과정 없이 런타임에 바로 해석하고 실행***합니다. 이 특징은 개발 과정을 빠르고 유연하게 만들며, 즉각적인 피드백을 가능하게 합니다.

### 예제 코드

```python
print("Hello, World!")
```

이 간단한 예제는 파이썬 인터프리터를 통해 바로 실행할 수 있습니다. 프로그램을 별도로 컴파일할 필요 없이 소스 코드를 작성하고 실행만 하면 결과를 볼 수 있습니다.

> 참고 : (Python - 인터프리터와 컴파일러) https://amirer21.github.io/python/python-pyc/


## 2. 객체 지향 프로그래밍 지원

**객체 지향 프로그래밍(Object-Oriented Programming, OOP**)은 프로그래밍을 객체의 모음으로 구성하는 개발 방식입니다. 객체는 데이터와 이 데이터를 처리하는 함수(메서드)를 포함할 수 있는 소프트웨어 블록입니다. 

### OOP의 주요 특징은 다음과 같습니다:

- **캡슐화(Encapsulation)**: 데이터(속성)와 데이터를 조작하는 함수(메서드)를 함께 묶음으로써, 객체의 구현 세부사항을 숨기고 사용자 인터페이스만을 제공합니다.

- **상속(Inheritance)**: 한 클래스(부모 클래스)의 특성을 다른 클래스(자식 클래스)가 상속받아 사용할 수 있게 합니다. 이를 통해 코드 재사용성을 높이고, 복잡성을 관리할 수 있습니다.

- **다형성(Polymorphism)**: 같은 인터페이스나 메서드 호출이 서로 다른 객체들에 대해 서로 다른 동작을 할 수 있도록 합니다.


### 예제

다음은 파이썬에서의 간단한 객체 지향 프로그래밍 예제입니다. 이 예제에서는 Car 클래스를 정의하고, 이를 상속받는 ElectricCar 클래스를 만들어 보겠습니다:

```py
class Car:
    def __init__(self, make, model):
        self.make = make
        self.model = model

    def display_info(self):
        print(f"This car is a {self.make} {self.model}")

class ElectricCar(Car):
    def __init__(self, make, model, battery_size):
        super().__init__(make, model)  # 부모 클래스의 생성자 호출
        self.battery_size = battery_size

    def display_battery(self):
        print(f"This car has a {self.battery_size}-kWh battery")

# 객체 생성 및 사용
my_car = Car("Hyundai", "Sonata")
my_electric_car = ElectricCar("Tesla", "Model S", 85)

my_car.display_info()  # "This car is a Hyundai Sonata"
my_electric_car.display_info()  # "This car is a Tesla Model S"
my_electric_car.display_battery()  # "This car has a 85-kWh battery"

```

## 3. 동적 메모리 관리

**동적 메모리 관리(dynamic memory management)** 는 프로그램이 실행 중에 필요한 메모리를 할당하고, 더 이상 사용되지 않는 메모리를 자동으로 해제하는 과정을 말합니다. 이 과정은 메모리 누수(memory leak)를 방지하고, 효율적인 메모리 사용을 도모합니다. 대부분의 현대 프로그래밍 언어는 어느 정도의 자동 메모리 관리 기능을 제공하는데, 파이썬도 그 중 하나입니다.

파이썬은 내부적으로 **가비지 컬렉터(garbage collector)** 를 사용하여 자동으로 메모리 관리를 수행합니다. 파이썬의 가비지 컬렉터는 주로 **레퍼런스 카운팅(reference counting)** 방식을 사용하여 객체에 대한 **참조가 더 이상 존재하지 않을 때 해당 객체를 메모리에서 해제** 합니다. 또한, 순환 참조(circular reference)가 있는 경우를 감지하여 메모리를 정리할 수 있습니다.

### 예제 (1) 참조
```py
a = 10
b = a
del a
print(b)
```

이 코드는 변수 a에 할당된 메모리가 b에도 참조되고 있기 때문에 del a로 a를 삭제해도 b는 여전히 10을 출력합니다.

### 예제 (2)동적 메모리 관리

다음 예제에서는 파이썬에서 동적 메모리 관리가 어떻게 이루어지는지 설명하겠습니다.


```py
import gc

class MyClass:
    def __init__(self, value):
        self.value = value
    def __del__(self):
        print(f"{self.value} 객체가 메모리에서 해제되었습니다.")

# 객체 생성
obj1 = MyClass(1)
obj2 = MyClass(2)

# 레퍼런스 카운트를 확인하기 위한 참조 추가
ref = obj1

# 레퍼런스 삭제
del obj1

# 강제 가비지 컬렉션 실행
gc.collect()

# 두 번째 객체 참조 제거
del obj2

# 다시 강제 가비지 컬렉션 실행
gc.collect()
```


## 4. 확장성

파이썬은 C나 C++로 작성된 라이브러리를 통해 확장할 수 있습니다. 이를 통해 
파이썬 프로그램은 필요에 따라 성능을 향상시킬 수 있습니다.

### 예제

```py
from ctypes import cdll

# C 라이브러리 로드
lib = cdll.LoadLibrary('example.dll')

# C 함수 호출
lib.my_function()
```

이 예제는 ctypes 모듈을 사용하여 C 라이브러리를 로드하고 그 안에 정의된 함수를 호출합니다.

### C나 C++ 외부 라이브러리를 활용 가능한 다른 프로그래밍 언어

C나 C++로 작성된 외부 라이브러리를 활용하여 확장할 수 있는 프로그래밍 언어는 여러 가지가 있습니다. 파이썬 외에도 이 기능을 지원하는 주요 언어들을 아래에 소개합니다:

- 루비(Ruby): 루비 언어는 내부적으로 C를 사용하여 구현되었습니다. 루비의 확장 라이브러리는 주로 C로 작성되며, Ruby C API를 사용하여 루비 프로그램 내에서 쉽게 호출할 수 있습니다.

- Node.js: Node.js는 자바스크립트 런타임으로, C++로 작성된 네이티브 모듈을 통해 확장할 수 있습니다. node-gyp 같은 도구를 사용해 C/C++ 코드를 컴파일하고, V8 엔진에 바인딩하여 자바스크립트 코드와 통합할 수 있습니다.

- 자바(Java): 자바는 JNI(Java Native Interface)를 통해 C나 C++ 코드를 자바 애플리케이션에 통합할 수 있습니다. 이를 통해 자바 프로그램은 네이티브 코드의 성능 이점을 활용할 수 있습니다.

