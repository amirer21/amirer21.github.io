---
title: Python - 인터프리터와 컴파일러
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- Interpreter
- Compiler
toc: true
toc_sticky: true
toc_label: 목차
description: 파이썬 인터프리터와 컴파일러
article_tag1: python
article_tag2: interpreter
article_tag3: compiler
article_section: python interpreter compiler
meta_keywords: python, interpreter, compiler
last_modified_at: '2023-05-30 21:00:00 +0800'
---


## 파이썬 파일을 실행하면 생성되는 파일 **.pyc**

python으로 코드를 구성한 프로그램을 실행하면 .pyc라는 파일이 생긴다. 
구체적으로 살펴보면 \_\_pycache\_\_ 라는 디렉토리 밑에 패키지마다 .pyc 파일이 생성된다.

이 파일이 왜 생기는지 알아보기 위해서 컴파일러와 인터프리터에 대해서 다시 정리할 필요가 있다.


### **.pyc** 파일은 무엇일까?

Python에서는 *.py 파일을 실행시킬 때 아래의 단계를 거친다.

**1 단계** : 사람이 코드한 파일인 *.py를 파이썬 가상 머신(Python Virtual Machine)이 이해할 수 있는 Byte codes 형태로 변환(컴파일)한다.

**2 단계** : 이 변환(컴파일)된 Byte codes를 파이썬 가상 머신이 실행한다.


### 왜 이렇게 단계를 구분한 것일까?

(신속한 실행) 다음에 실행할 때는 단계 1을 거치지 않고 단계 2로 넘어가서 캐시화된 임시파일(*.pyc)을 실행하여 속도를 높인다.
위와 같이 파이썬에서도 컴파일 과정을 거치는데 컴파일이라는 용어에 대해서 다시 알아보자


## 컴퓨터가 사람의 명령을 해석하는 과정

컴퓨터는 사람의 명령을 최종적으로 0, 1로 해석하여 처리한다. 컴퓨터가 인식할 수 있는 0, 1로 구성된 코드를 이진 코드 또는 바이너리 코드(binary code)라고 한다. 
사람이 작성한 코드를 컴퓨터가 이해할 수 있는 이진코드로 해석과정이 필요하다. 이 번역해주는 번역기가 인터프리터, 컴파일러이다.

둘 다 고레벨 언어로 작성된 프로그래밍 언어를 기계어로 번역하는 것은 공통점이다.


## 컴파일이란?

컴파일은 하나의 언어 코드를 다른 언어로 변환하는 것을 말한다. 
(의미에 변화가 있었던 것일까?) 컴파일 언어라고 하면 런타임 전에 기계어 코드로 번역되는 언어를 말한다. 

그런데 변환되는 언어가 바로 기계어가 아니라 중간단계에서 다른 언어로 변환되는 경우도 있다.

### **TypeScript**
TypeScript의 경우 JavaScript로 코드로 변환되는 과정을 거친다. ① 타입스크립트 컴파일러(TSC)는 타입스크립트 코드를 추상 구문 트리(Abstract Syntax Tree, AST)라는 자료구조로 코드를 변환한다. ② 타입검사기(Typechecker)가 코드의 타입 안정성을 검증하고, ③ 타입스크립트 AST에 의해서 자바스크립트 소스로 변환하게 된다. 
 이후부터는 다시 **JavaScript**의 과정이다. ④ 자바스크립트 소스는 자바스크립트 AST로 변환, ⑤ AST에 의해 Bytecode로 변환한다.⑥ Runtime에 의해서 Bytecode를 평가하고 처리한다.

> (**Abstract Syntax Tree란?**, AST(추상 구문 트리)는 프로그래밍 언어의 문법에 따라 소스 코드 구조를 표시하는 계층적 프로그램 표현이다. 자바스크립트 코드를 실행 단위인 Bytecode로 변환시키기 위한 자료 구조이다.)

### **JAVA**
JAVA 의 경우에는 JAVAC를 통해 바이트코드로 컴파일되고, 자바 인터피리터에 의해서 한 줄 씩 해석하여 기계어로 변환한다.
자바는 인터프리트 방식, 컴파일 방식을 사용한다.

Java에서 인터프티트, 컴파일 과정을 예로들면, javac 명령어를 통해 helloworld.java 파일을 자바 컴파일러(javac)가 helloworld.class로 변환시키고 자바 인터프리터를 통해 기계어로 변환한다.

> .java -> 컴파일러(javac) -> .class -> 인터프리터 -> 기계어

각 언어마다 변환 과정의 차이가 있을 뿐이다.


## 인터프리터 vs 컴파일 방식

**(인터프리트)** 런타임 전에 기계어로 컴파일 되는 과정을 거치지 않고 소스코드 해석기(파이썬 가상머신, 실행환경)에 의해서 프로그래밍을 할 때마다 동시에 컴퓨터에서 해석해주는 방식을 **인터프리트(interpret)** 방식이라고 한다.
고급 언어로 작성된 프로그램을 한줄씩 번역해서 컴퓨터 OS에서 인식하는 기계어로 변역하는 역할을 수행한다.

**(컴파일)** 프로그래밍이 다 이루어지고 나면 전체를 한번에 컴퓨터에게 해석해 주는 것을 **컴파일(compile)** 방식이라고 한다.

파이썬은 작성된 소스 코드를 한 줄씩 해석하는 인터프리트 방식입니다. 이런 작업을 수행하는 것은 파이썬 셸이며 인터프리터(interpreter)라고 한다.

## 파이썬 VS 자바 컴파일 방식

### 파이썬

- 바이트코드 컴파일: Python은 먼저 소스 코드를 바이트코드라는 중간 형식으로 컴파일합니다. 이 컴파일은 간단한 프로세스이며 Python 스크립트를 실행할 때 자동으로 수행됩니다.

- PVM(Python Virtual Machine): 그러면 바이트코드가 PVM(Python Virtual Machine)에서 실행됩니다. 이는 시뮬레이션된 환경에서 실행하는 것과 유사하므로 Python 플랫폼에 독립적입니다.

- JIT(Just-in-Time) 컴파일: PyPy와 같은 일부 Python 구현에서는 JIT 컴파일을 사용하여 성능을 향상시킵니다. JIT 컴파일은 런타임에 발생하며 실행 직전에 바이트코드를 기계어 코드로 변환합니다.

### 자바

- 바이트코드 컴파일: Java 소스 코드는 Java 컴파일러(javac)를 사용하여 바이트코드로 컴파일됩니다. 이 바이트코드는 플랫폼 독립적이므로 Java가 "한 번 작성하면 어디서나 실행"이라는 철학을 고수할 수 있습니다.

- JVM(Java Virtual Machine): JVM은 바이트코드를 해석하거나 최신 구현에서는 실행을 위해 JIT(Just-In-Time)를 기본 기계어 코드로 컴파일합니다. 이는 플랫폼 간 호환성과 성능 간의 균형을 제공합니다.
Python과 달리 이는 한 줄씩 발생하지 않고 더 큰 덩어리로 발생하며 효율성을 위해 전체 메소드 또는 코드 블록을 최적화하는 경우가 많습니다.

- AOT(Ahead-of-Time) 컴파일: 일부 Java 구현은 JVM에서 실행되기 전에 바이트코드를 기본 기계어 코드로 컴파일할 수 있는 AOT 컴파일을 제공합니다. 이는 성능 향상으로 이어질 수 있습니다.

### 주요 차이점

- 실행 방법: Python은 일반적으로 해석된 언어로 간주되는 반면 Java는 컴파일과 해석을 혼합하여 사용합니다.

- 컴파일 단계: Python은 실행 시 바이트코드로 컴파일되는 반면, Java는 바이트코드로 사전 컴파일된 후 JVM에 의해 실행됩니다.

- 개발 속도: Python의 해석된 특성으로 인해 코드 변경 시 재컴파일이 필요하지 않으므로 개발 및 디버깅이 더욱 유연하고 빨라집니다.

- 바이트코드가 기계어로 번역되는 방법과 시기 : Java는 실행 전에 모든 코드를 바이트코드로 컴파일하고, JVM은 런타임에서 기계어로의 변환을 처리합니다. 반면 Python은 바이트코드로 컴파일하고 이를 PVM 내에서 실행하며, 실행 중에 바이트코드에서 기계어로의 변환이 발생합니다.

### 인터프리터 방식은 전통적인 컴파일 방식과는 다르다.

해석된 언어에서는 C나 Java와 같은 컴파일 언어의 맥락에서 이해되는 전통적인 컴파일 프로세스가 필요하지 않습니다. 그러나 이것이 번역이나 처리가 전혀 이루어지지 않는다는 의미는 아닙니다. 

직접 실행: 해석된 언어에는 일반적으로 소스 코드가 해석기에 의해 직접 실행되는 프로세스가 포함됩니다. 인터프리터는 일반적으로 한 줄씩 코드를 읽은 다음 코드에 작성된 지침을 수행합니다.

명시적 컴파일 단계 없음: 소스 코드를 먼저 명시적으로 실행 파일(기계어 코드)로 변환해야 하는 컴파일된 언어와 달리 해석된 언어에는 이러한 별도의 컴파일 단계가 필요하지 않습니다.


해석된 언어는 기계 코드로의 별도의 명시적인 컴파일 프로세스가 필요하지 않지만 여전히 인터프리터에 의해 직접 또는 중간 바이트코드 단계를 통해 일종의 번역 또는 처리 과정을 거칩니다. 

### 파이썬 바이트코드 변환 과정(중간 형태)

Python은 먼저 개발자가 작성한 코드를 바이트코드로 변환합니다. 이것은 직접적인 기계어가 아닌 중간 형태입니다. 이 변환은 Python 스크립트를 실행할 때 자동으로 발생합니다. 

그러면 바이트코드가 Python 가상 머신에서 실행됩니다. PVM(Python Virtual Machine)은 바이트코드를 읽고 해석하여 컴퓨터 프로세서가 이해할 수 있는 기계어 명령어로 변환합니다. 

### 라인별 해석의 의미

라인별 해석: Python을 코드를 한 줄씩 해석하는 것으로 생각하는 것이 일반적이지만 원본 소스 코드를 바이트코드로 변환하는 것이 더 정확합니다.

### 예제 코드로 보는 자바와 파이썬 컴파일 과정 비교

간단한 예를 통해 Python과 Java의 컴파일 프로세스를 살펴보겠습니다. 우리는 "Hello, World!"를 출력하는 소스 코드입니다.

#### 파이썬 예제

Python 코드(hello.py):

```python
print("Hello, World!")
```

- Python 컴파일 프로세스:

(1) 코드 작성: Python 코드를 파일(예: hello.py)에 작성합니다.

(2) 코드 실행: Python 인터프리터를 사용하여 코드를 실행하면(예: 명령줄에 python hello.py 입력) 몇 가지 일이 발생합니다.

> 바이트코드 컴파일: 
Python 인터프리터는 소스 코드(hello.py)를 Python 바이트코드로 컴파일합니다. 이는 플랫폼 독립적인 중간 표현입니다.

> PVM에 의한 실행: 
이 바이트코드는 Python 가상 머신(PVM)에 의해 즉시 실행됩니다. PVM은 바이트코드를 해석하여 실행을 위한 기계별 명령어로 변환합니다.


#### 자바 예제

자바 코드(HelloWorld.java):

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

- 자바 컴파일 프로세스:

(1) 코드 작성: Java 코드를 파일(예: HelloWorld.java)에 작성합니다.

(2) 코드 컴파일: 코드를 실행하기 전에 코드를 컴파일해야 합니다. Java 컴파일러(javac)를 사용하여 코드를 컴파일합니다.

> 명령: javac HelloWorld.java
이렇게 하면 HelloWorld.class라는 바이트코드 파일이 생성됩니다.

(3) 컴파일된 코드 실행: 그런 다음 JVM(Java Virtual Machine)을 사용하여 컴파일된 바이트코드를 실행합니다.

> 명령: java HelloWorld
JVM은 HelloWorld.class 파일을 읽고 JVM 내의 JIT 컴파일러는 이 바이트코드를 기계어 코드로 컴파일합니다.
기계어 코드는 컴퓨터 프로세서에 의해 실행됩니다.


### 더욱 와닿게 이해하기(IDE 말고 CLI로 컴파일, 실행 해보자.)

개발을 하면 IDE로 코드를 작성하고 실행하게 되는데, 자바와 파이썬에서 어떤 차이가 있는지 눈으로 직접 알아채기는 어렵다. IDE에서 자동으로 컴파일하고 실행하는 과정들이 묶여있기때문이다. 

실제로 CLI에서 명령어로 실행해보면, 언어 마다 컴파일, 실행 차이를 알 수 있다.

명령줄 인터페이스(CLI)에서 Python 및 Java 프로그램을 실행하면 각 단계를 수동으로 실행해야 하므로 컴파일 및 실행 프로세스를 더 명확하게 볼 수 있습니다. 두 언어에 대한 프로세스를 살펴보겠습니다.


#### Python

코드 작성: 텍스트 편집기에서 Python 코드를 작성하고 .py 확장자로 저장합니다(예: hello.py).

```python

# hello.py
print("Hello, World!")
```

코드 실행: 명령줄 인터페이스를 열고 hello.py 파일이 포함된 디렉터리로 이동합니다. Python 인터프리터를 사용하여 Python 스크립트를 실행합니다.

```bash
python hello.py
```

일어나는 일은 다음과 같습니다.

바이트코드 컴파일: Python은 내부적으로 hello.py 파일을 바이트코드로 컴파일합니다. 이 단계는 사용자에게 보이지 않으며 메모리에서 발생합니다. 스크립트가 가져온 모듈의 일부가 아닌 이상 '.pyc' 파일은 생성되지 않습니다.

실행: 그러면 PVM(Python Virtual Machine)이 이 바이트코드를 실행합니다. 
간단한 스크립트라면 별도의 컴파일 단계나 .pyc 파일 생성이 표시되지 않습니다.

### Java

코드 작성: 텍스트 편집기에서 Java 코드를 작성하고 .java 확장자로 저장합니다(예: HelloWorld.java).

```java

// HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

코드 컴파일: 명령줄 인터페이스를 열고 HelloWorld.java 파일이 포함된 디렉터리로 이동합니다. Java 컴파일러 javac을 사용하여 Java 프로그램을 컴파일합니다.

```bash
javac HelloWorld.java
```

그러면 동일한 디렉터리에 바이트코드가 포함된 HelloWorld.class 파일이 생성됩니다.

컴파일된 코드 실행: java 명령을 사용하여 컴파일된 Java 프로그램을 실행합니다.

```bash
java HelloWorld
```

JVM(Java Virtual Machine)은 HelloWorld.class 바이트코드 파일을 읽고 실행합니다.

#### 주요 차이점

- 파이썬:

직접 실행: Python 인터프리터가 '.py' 파일을 직접 실행합니다.

암시적 컴파일: 바이트코드 컴파일은 모듈을 다루지 않는 한 일반적으로 표시되지 않는 암시적 단계입니다.

별도의 실행 파일 없음: 독립형 Python 스크립트용으로 생성된 별도의 실행 파일이 없습니다.

- 자바:

명시적 컴파일: javac을 사용하여 .java 파일을 .class 파일로 명시적으로 컴파일해야 합니다.

별도의 실행 단계: 컴파일된 바이트코드(.class 파일)는 JVM에 의해 실행됩니다.

2단계 프로세스: Java에는 두 가지 별개의 단계(컴파일 및 실행)가 필요하며 둘 다 CLI에서 표시되고 수동으로 실행됩니다.

Python 및 Java 프로그램을 실행하기 위해 CLI를 사용하면 실행 모델의 차이점, 즉 암시적 컴파일을 사용하는 Python의 해석 특성과 Java의 명시적인 컴파일 및 실행 접근 방식의 차이점이 명확하게 설명됩니다.



#### 주요 차이점

- Python: 바이트코드로의 컴파일과 실행이 동시에 이루어지며, 바이트코드는 별도의 파일에 저장되지 않습니다(표준 사용 시). 이 프로세스는 사용자에게 거의 보이지 않습니다.

- Java: 소스 코드는 명시적으로 바이트코드로 컴파일되고 .class 파일에 저장된 후 JVM에 의해 실행됩니다. 이 프로세스는 더욱 가시적이며 별도의 단계를 포함합니다.

두 언어 모두 소스 코드가 컴퓨터에서 실행될 수 있는 형태로 변환되지만 이러한 프로세스의 단계와 가시성이 다릅니다.


--------------------------------------------------

## 파이썬에서는 소스 코드 변환 과정

> .py 파일은 -> Byte code로 '변환'하여 .pyc 파일이 된다.


## .pyc 파일이란?

PYC 파일은 Python 프로그래밍 언어로 작성된 소스 코드에서 생성된 컴파일된 출력 파일이다.

## .pyc 파일이 생성되는 시기

다음은 .pyc 파일이 생성되는 시기와 이유에 대한 개요입니다:

- 모듈 가져오기: Python 모듈을 가져올 때 Python 인터프리터는 모듈의 소스 코드(.py 파일)를 바이트코드로 컴파일합니다. 이 컴파일은 모듈을 처음 가져올 때 발생합니다.

- 바이트코드 캐싱: 컴파일된 바이트코드는 .py 파일과 동일한 디렉터리에 있는 __pycache__ 디렉터리 내의 .pyc 파일에 저장됩니다. 이 프로세스는 이후 모듈 사용 시 시간을 절약하기 위해 수행됩니다.

- 후속 가져오기: 다음에 동일한 모듈을 가져올 때(동일하거나 다른 Python 프로그램에서) Python은 __pycache__ 디렉터리에 .pyc 파일이 있는지 확인합니다. .pyc 파일이 존재하고 최신인 경우(즉, 해당 .py 파일이 변경되지 않은 경우) Python은 re 대신 .pyc 파일에서 바이트코드를 로드합니다.


## 파이썬 가상 머신

파이썬 가상 머신(virtual machine)은 컴파일러와 인터프리터가 있다.

인터프리터는 .py 파일에 작성된 원시 파이썬 코드를 곧바로 해석할 수 없다
그렇기 때문에 우선 원시 코드는 byte 코드로 변환되어야 한다. 이 과정에서 .pyc 파일이 생성되고 그 안에 byte 코드가 작성된다.

Python 인터프리터를 사용하여 PY 파일을 실행하면 실행을 위해 바이트 코드로 변환된다. 

## 파이썬 .pyc 파일 재사용(캐시)

.pyc 파일을 두게되면 이 파일을 캐시에서 재사용할 수 있다. 처음부터 다시 byte 코드로 변환하는 것이 아니라 캐시상태에서 byte 코드를 저장하게 된다.
또한, 이 byte 코드를 파이썬 인터프리터로 실행하기 때문에 속도가 향상된다.

## 파이썬 .pyc 파일과 자바 .class 파일과의 차이

Python의 .pyc 파일은 목적과 기능 모두에서 Java의 .class 파일과 다릅니다. 차이점을 강조하기 위한 비교는 다음과 같습니다.

### Python .pyc 파일

바이트코드 캐시: .pyc 파일은 본질적으로 Python 모듈의 바이트코드에 대한 캐시입니다. Python 모듈을 처음 가져올 때 생성되며 동일한 모듈의 후속 가져오기 속도를 높이는 데 사용됩니다.

자동 생성: .pyc 파일 생성은 Python 인터프리터가 처리하는 자동화된 프로세스입니다. 일반적으로 .py 소스 파일과 동일한 디렉토리에 있는 __pycache__ 디렉토리에 생성되어 저장됩니다.

최적화 전용: .pyc 파일의 목적은 오로지 로딩 시간을 최적화하는 것입니다. 이는 독립적인 실행 파일이 아니며 실행을 위해 여전히 Python 인터프리터가 필요합니다.

플랫폼 독립성: .pyc 파일의 바이트코드는 플랫폼 독립적이지만 이를 생성한 Python 버전에 따라 다릅니다.

### Java .class 파일

컴파일된 바이트코드: Java의 .class 파일은 Java 소스 코드(.java 파일)를 컴파일한 결과입니다. 여기에는 JVM(Java Virtual Machine)이 실행할 수 있는 플랫폼 독립적 코드인 바이트코드가 포함되어 있습니다.

명시적 컴파일: .class 파일 생성은 Java 개발의 의도적인 단계입니다. 프로그래머는 이러한 파일이 생성되기 전에 Java 컴파일러(javac)를 사용하여 소스 코드를 컴파일해야 합니다.

실행 가능한 바이트 코드: Python의 .pyc 파일과 달리 Java의 .class 파일은 JVM에서 실행 가능합니다. 이는 Java 프로그램을 배포하고 실행하는 기본 형태입니다.

플랫폼 및 JVM 버전: Java 바이트코드는 플랫폼 독립적이지만 작성된 Java 언어 버전에 바인딩됩니다. 다양한 JVM 버전과의 호환성은 사용되는 언어 기능에 따라 달라질 수 있습니다.

### 주요 차이점

#### 목적: 
.pyc 파일은 Python 모듈의 로딩 속도를 높이기 위한 반면, .class 파일은 Java 애플리케이션을 실행하기 위한 실행 가능한 바이트코드 파일입니다.

#### 생성 프로세스: 
Python에서는 '.pyc' 파일이 런타임 중에 자동으로 생성되는 반면, Java에서는 '.class' 파일이 명시적인 컴파일 단계를 통해 생성됩니다.

#### 실행 종속성: 
.pyc 파일은 독립적으로 실행될 수 없으며 Python 인터프리터가 필요합니다. .class 파일은 JVM에 의해 실행되며 Java 환경 내 실행 측면에서 독립형입니다.

요약하자면 .pyc 및 .class 파일에는 모두 바이트코드가 포함되어 있지만 역할, 생성 프로세스 및 실행 모델이 상당히 다르며 이는 프로그래밍 언어로서 Python과 Java의 고유한 특성을 반영합니다.

 
## 결론

최종적으로 기계어로 변환하여 컴퓨터가 이해할 수 있도록 하는 과정을 거치는 것은 같다. 인터프리트와 컴파일의 차이는 소스 코드를 컴퓨터에게 해석하게 하는데 어떤 도구로 해석하게 할지, 어떤 순서를 거쳐서 해석할지의 차이라고 볼 수 있다.