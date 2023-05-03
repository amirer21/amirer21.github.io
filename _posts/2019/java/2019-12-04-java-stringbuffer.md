---
title: Java StringBuffer 란?
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Java
toc: true
toc_sticky: true
toc_label: 목차
description: Java StringBuffer 란?
article_tag1: java
article_tag2: StringBuffer
article_tag3: 
article_section: java
meta_keywords: java, StringBuffer
last_modified_at: '2019-12-04 10:00:00 +0800'
---


## 1.	StringBuffer란?

**StringBuffer** 는 문자열을 추가하거나 변경 할 때 사용하는 자료형이다.

**StringBuffer 클래스**는 자바 프로그램 내에서 변하는 문자열을 다룰 때 사용한다. StringBuffer 클래스의 객체는 크기가 동적인데, 객체 생성시 크기를 지정하지 않아도 기본적으로 16개의 문자를 저장할 수 있는 버퍼 공간을 가진다.

**String 클래스**의 객체는 한 번 생성되면 그 내용이 변하지 않는다. 그러나, **StringBuffer 클래스**의 객체는 한 번 생성된 후에도 기존 데이터의 내용을 변경할 수 있다. 


## 2. StringBuffer 클래스 생성자

**StringBuffer()** 	초기 문자열이 없고 16개의 문자를 저장할 수 있는 버퍼를 가진 객체를 생성한다. 

**StringBuffer(String str)**	str의 초기 문자열을 가지고 16개의 문자를 저장할 수 있는 버퍼를 가진 객체를 생성한다.

 **StringBuffer(int length)**	초기 문자열이 없고 length개의 문자를 저장할 수 있는 버퍼를 가진 객체를 생성한다. 


## 3. StringBuffer 클래스의 메소드

### append() : 데이터 추가

append 메서드는 현재 문자열 끝에 새로운 데이터(다양한 타입으로)를 계속해서 추가할 수 있다.
(append로 다양한 타입의 데이터를 넣을 수 있으므로 출력할때는 toString()으로 타입을 변환해준다.)

```java
public class AddData {
    public static void main(String[] args) {
        StringBuffer sb = new StringBuffer();
        //sb는 관습적으로 표현한다.
        sb.append(dataOne");
        sb.append(" ");
        sb.append("add data hello");
        System.out.println(sb.toString());
    }
}
```

결과
> hello add data hello


 String 자료형으로 문자열을 추가하면 다음과 같이 할 수 있다.

```java
public class AddData {
    public static void main(String[] args) {
        String temp = "";
        temp += dataOne";
        temp += " ";
        temp += "add data hello";
        System.out.println(temp);
    }
}
```

결과
> hello add data hello

## StringBuffer vs String

StringBuffer와 String은 객체의 생성과 메모리 사용 과정에서 차이가 있다.

- **StringBuffer** 객체는 단 한번만 생성된다. 

- **String** 객체는 데이터를 추가하는 작업이 있을 때마다 새로운 String 객체가 생성된다.

(immutable : 값을 변경할 수 없는 것) **String** 자료형은 한번 값이 생성되면 그 값을 변경할 수가 없다. trim, toUpperCase, toLowerCase 등의 메소드가 있는데 문자열이 변경되는 것처럼 보이지만 해당 메소드 수행 후 또 다른 String 객체를 생성하는 것이다.

```java
String str = "test";
String newStr = "test ";
newStr = newStr.trim();//공백 제거
System.out.println(str == newStr); //결과는 false
```

> Java API에서 trim() 메서드를 살펴보면 substring()을 사용하는데, substring()메서드에 new String()이 있다.
다시말해, 새로운 객체를 생성하는 것을 알 수 있다.

(mutable : 값을 변경할 수 있는 것) **StringBuffer** 는 값을 변경할 수 있다. 생성된 값은 언제든지 수정할 수 있다.

**StringBuffer** 은 문자열 추가나 변경이 많은 경우 그만큼 메모리 사용량이 많아지게 되므로 String 보다 메모리에 영향을 더 주게 된다. 문자열 변경 작업이 거의 없다면 String 으로 사용하는게 유용하다.

------

### insert() : 특정 위치에 삽입

insert 메소드는 특정 위치(offset)에 원하는 문자열을 삽입할 수 있다.

```java
public class AddData {
    public static void main(String[] args) {
        StringBuffer sb = new StringBuffer();
        sb.append("add data hello");
        sb.insert(0, "dataOne");
        //0 번째에 "dataOne"을 삽입
        System.out.println(sb.toString());
    }
}
```
결과
> hello add data hello

------

### substring()

substring(start 위치, end 전 위치)와 같이 사용하면 StringBuffer 객체의 start위치부터 end위치 전까지의 문자를 뽑아내게 된다.

```java
public class AddData {
    public static void main(String[] args) {
        StringBuffer sb = new StringBuffer();
        sb.append("hello world");
        System.out.println(sb.substring(0, 4));
    }
}
```
결과
> hell

