---
title: Java classpath
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Java
tags:
- Java
toc: true
toc_sticky: true
toc_label: 목차
description: Java classpath
article_tag1: java
article_tag2: classpath
article_tag3: 
article_section:  
meta_keywords: java, classpath
last_modified_at: '2019-01-01 10:00:00 +0800'
---

## 1. JAVA에서 환경변수란?

**환경 변수** 란 실행 파일이 위치한 디렉토리 경로를  직접 지정하여 어느 위치에서든지 사용할 수 있도록 하는 것이다. 

### java에서 환경 변수를 설정하는 이유
JVM에 의해 java는 다른 폴더에서도 실행이 되지만, java를 컴파일 할 때 필요한 javac는 path를 설정해주어야 한다.

---------------

## 2. 클래스패스(Classpath)란?

클래스를 찾기위한 경로이다. 
자바에서 JVM이 프로그램을 실행할 때 class파일을 찾는 기준 경로이다. 
자바에서 java 파일(.java)을 컴파일하면 바이너리 형태의 class 파일(.class)로 변환된다.

**java runtime**으로 .class 파일을 실행하기 위해 이 파일을 찾게 되는데 .class 파일을 찾을 때 **classpath**에 지정된 경로를 사용한다. 
classpath에 지정된 경로를 기준으로 .class 파일을 찾고, .class 파일이 포함된 디렉토리와 파일을 콜론으로 구분하여 나타낸다.
 또한, **classpath**설정에 의해 첫 번째로 찾은 파일을 사용한다.

### classpath 지정 방법
- 환경 변수 CLASSPATH 설정
- java runtime -classpath 플래그 사용

JDK폴더에는 API와 컴파일러(javac)가 설치되고, JDK bin은 자바소스(.java파일)가 컴파일되어 생성되는 .class 파일이 있다.
JRE에는 자바프로그램 실행을 위한 JVM과 java.exe가 설치된다.

---------------

## 3. JAVA 환경변수 (PATH, CLASSPATH, JAVA_HOME)

### (1) path
- Path : OS에서 명령어를 실행할 때 환경 변수에 명령어를 실행하기 위해 찾을 폴더의 순위를 지정해준다. 실행 파일 경로를 지정한다.
    > %JAVA_HOME%\bin; (javac에 대한 path를 설정 예시)

### (2) CLASSPATH

- CLASSPATH	: JVM이 시작될 때 JVM의 클래스 로더는 이 환경 변수를 호출한다. 그래서 환경 변수에 설정되어 있는 디렉토리가 호출되면 그 디렉토리에 있는 클래스들을 먼저 JVM에 로드한다. 그러므로 CLASSPATH 환경 변수에는 필스 클래스들이 위치한 디렉토리를 등록하도록 한다.

    >.;%JAVA_HOME%\lib\tools.jar : .(현재폴더)에서 찾아보고 없으면 .;%JAVA_HOME%\lib\tools.jar 에서 찾으라는 의미

### (3) JAVA_HOME

- JAVA_HOME : JDK가 설치된 홈 디렉토리를 설정하기 위한 환경 변수다. 반드시 필요한 환경 변수는 아니지만 Path와 CALLPATH 환경 변수에 값을 설정할 때 JAVA_HOME 환경 변수를 포함하여 설정한다.
 자바 버전을 변경하는 경우에 java_home만 변경하면 path와 classpath는 변경하지 않아도 된다.