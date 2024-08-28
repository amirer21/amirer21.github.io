---
title: Java List and Map
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
description: Java List and Map 비교
article_tag1: java
article_tag2: list
article_tag3: map
article_section:  
meta_keywords: java, list, map
last_modified_at: '2019-12-08 10:00:00 +0800'
---

## 자바에서 List와 Map 비교

### 1. 공통점

List와 Map은 데이터를 저장하는 자료구조라는 점에서 공통점이 있다. 하지만 다음과 같은 차이가 있다.

### 2. 차이점

List는 메모리의 특정한 동일 공간에 저장된다.
내부 구현은 배열로 되어 있다. 또한, 순차적으로 데이터를 저장하므로 데이터가 연속적인 의미가 있는 경우에 사용하는 것이 좋다. 


### 3.	List
```java
ArrayList add()로 데이터 추가

ArrayList<String> arrayList = new ArrayList<>();

arrayList.add("apple");
arrayList.add("banana");
arrayList.add("pineapple");
arrayList.add("pear");
arrayList.add("grape");

int index = 0;
for(String fruitsItem : arrayList){
  System.out.println((index++ )+ " :: " + fruitsItem);
}
```

출력 결과
```
0 :: apple
1 :: banana
2 :: pineapple
3 :: pear
4 : grape
```

데이터는 순차적으로 출력된다.

#### List 특징 : 데이터를 추가하거나 삭제하는 경우

**add()** ArrayList에서는 add()로 데이터를 추가할 수 있다. ArrayList 배열의 크기를 변경하고 기존 배열의 데이터를 추가한다. 순서가 있는 데이터의 모임이다.

**빈틈 없이 데이터를 추가**특정 index에 추가하거나 삭제하려면 기존 데이터를 복사한 뒤 새로운 배열에 기존 데이터를 다시 채우는 방식이다.

이러한 방식에서는 데이터의 크기가 크다면 성능에 영향을 주게 된다.

데이터의 변경을 하지 않고 순차적인 데이터를 다룰 때는 유리한 자료 구조이다.


### 4. Map

Map은 데이터를 저장할때 List와 달리 빈공간을 찾아서 저장한다. 또한, Key, Value 형식으로 값을 저장한다.

데이터에 Key를 부여해서 Key를 기준으로 값을 찾기에 매우 유용한 구조이다.

```java
HashMap<String,String> hashMap = new HashMap<>();
hashMap.put("Name" , "kim");
hashMap.put("number" , "000-111-1111");
hashMap.put("address" , "Busan");

System.out.println(hashMap.get("Name");
System.out.println(hashMap.get("number");
System.out.println(hashMap.get("address");
```

출력 결과
```
kim
000-111-1111
Busan
```

Key에 다른 value를 넣는다면 기존 value가 바뀌게된다.
key는 중복될 수 없지만, value는 중복될 수 있다.

배열의 index를 모르더라도 Key를 알면 데이터를 가져올 수 있다. 따라서 hashMap의 경우 key를 통해 데이터를 쉽게 검색할 수 있다.