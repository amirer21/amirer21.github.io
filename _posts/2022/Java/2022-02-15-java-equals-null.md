---
title: JAVA Null 체크를 위한 .equals와 == 연산자 비교
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
description: JAVA 비교("".equals vs == null)
article_tag1: null
article_tag2: equals
article_tag3: ==
article_section: 값 비교
meta_keywords: java, .equals, null, .equals(), ""
last_modified_at: '2022-02-15 14:00:00 +0800'
---
① ② *java10* 

# JAVA에서의 값 비교

**JAVA에서의 값 비교**
null을 체크하거나 값에 대해 비교할때 == 구문, .equals()를 사용한다. JAVA에서는 == 구문과 .equals()를 어느 경우에 사용하고 어떻게 구성된 것인지 설명한다.

#
## ① "".equals()
"A".equals(B)를 살펴보면 A에는 비교하려는값 B에는 객체를 넣어야된다.
> "비교하려는값".equals(객체)

**"".equals(String)** 를 살펴보면 String 클래스의 equal 메소드를 사용하게 된다.

### String 클래스의 equals 메서드
```java
public boolean equals(Object anObject) {
        if (this == anObject) {
            return true;
        }
		//instanceOf 연산자는 객체가 어떤 클래스인지, 어떤 클래스를 상속받았는지 확인한다. 여기서는 String인지 확인한다.
        if (anObject instanceof String) {		
            String anotherString = (String)anObject;
            int n = value.length;
            if (n == anotherString.value.length) {
                char v1[] = value;
                char v2[] = anotherString.value;
                int i = 0;
                while (n-- != 0) {
                    if (v1[i] != v2[i])
                        return false;
                    i++;
                }
                return true;
            }
        }
        return false;
    }
```
#

## ② == 와 .equals() 의 차이

== 연산자는 int,boolean primitive type에 대해서는 값을 비교한다. 
reference type에 대해서는 주소값을 비교한다. <br>

>. equals : Call by Value(값 비교) <br>
> == null : Call by Reference(주소 비교)

primitive type에서도 Constant Pool에 있는 특정 상수를 참조하는 것이기 때문에 주소값을 비교하는 것으로 볼 수 있다. <br>
같은 상수를 참조할 때는 주소값이 같기 때문에 동일한 값이라고 볼 수 있다.
#

## 값과 주소 비교("".equals() 와 == null)
```java
String test1 = null;
System.out.println(".equals(test1) :: " + "".equals(test1)); // 값 비교 false
System.out.println("null==test1 :: " + null==test1); // 주소 비교 true
	
String test2 = "";
System.out.println(".equals(test2) :: " + "".equals(test2)); // 값 비교 true
System.out.println("null==test2 :: " + null==test2); // 주소 비교 false
```

## null 체크하기
```java
String testString = "";
if(testString == null || "".equals(testString) ){
	System.out.println("null 입니다.");
}
```