---
title: Comparing .equals and == Operators for Null Checks in JAVA
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
toc_label: Table of Contents
description: Comparing "".equals and == null in JAVA
article_tag1: null
article_tag2: equals
article_tag3: ==
article_section: Value Comparison
meta_keywords: java, .equals, null, .equals(), ""
last_modified_at: '2022-02-15 14:00:00 +0800'
---


# Value Comparison in JAVA

**Value Comparison in JAVA**  
When checking for null or comparing values, the `==` operator and `.equals()` method are commonly used. This article explains when to use the `==` operator and `.equals()` method in JAVA and how they are structured.

## ① "".equals()
In `"A".equals(B)`, A is the value you want to compare, and B is the object.  
> `"value_to_compare".equals(object)`

Looking at **"".equals(String)**, it uses the `equals` method of the String class.

### The equals Method of the String Class
```java
public boolean equals(Object anObject) {
        if (this == anObject) {
            return true;
        }
        // The instanceOf operator checks if the object is an instance of a class or a subclass.
        // Here, it checks if it is a String.
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

## ② Differences Between == and .equals()

The `==` operator compares values for primitive types like `int` and `boolean`, while for reference types, it compares memory addresses.

> `.equals`: Call by Value (compares values)  
> `== null`: Call by Reference (compares addresses)

In primitive types, it can also be seen as comparing addresses because it references specific constants in the Constant Pool.  
When referencing the same constant, the address is the same, so the values are considered equal.

## Comparing Values and Addresses (".equals() vs == null")
```java
String test1 = null;
System.out.println(".equals(test1) :: " + "".equals(test1)); // Value comparison: false
System.out.println("null==test1 :: " + null==test1); // Address comparison: true

String test2 = "";
System.out.println(".equals(test2) :: " + "".equals(test2)); // Value comparison: true
System.out.println("null==test2 :: " + null==test2); // Address comparison: false
```

## Checking for Null
```java
String testString = "";
if(testString == null || "".equals(testString) ){
    System.out.println("The value is null.");
}
```