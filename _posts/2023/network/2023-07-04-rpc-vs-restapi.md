---
title: RPC(Remote Procedure Call) vs REST API
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Network
tags:
- Network
toc: true
toc_sticky: true
toc_label: 목차
description: RPC(Remote Procedure Call) vs REST API
article_tag1: rpc
article_tag2: rest
article_tag3: api
article_section: network
meta_keywords: network, rpc, rest, api, http
last_modified_at: '2023-07-04 21:00:00 +0800'
---

## RPC(Remote Procedure Call) vs REST API

네트워크에서는 서비스를 제공하는 서버(Server)와 서비스를 이용하는 클라이언트(Client)로 구성된다. Client는 Server에 데이터 혹은 어떤 동작을 요청하고 Server는 요청 받은 내용에 대해 응답하여 결과를 반환한다.

이러한 서버, 클라이언트 관계에서 둘 이상의 소프트웨어가 서로 통신하기 위해 인터페이스가 필요하게 되었는데 이를 API(Application Programming Interface)라고 한다.

이러한 네트워크 방식에서 프로토콜에 따라 여러가지 방법이 있는데 REST API와 RPC에 대해 살펴보고자 한다.

## 1. RPC(Remote Proceure Call) 란

용어를 살펴보자.

> Remote : 원격 

>Proceure : 프로시저는 소프트웨어에서 특정 동작을 수행하는 일정 코드 부분을 의미

>Call : 호출

원격지(예: 로컬 컴퓨터에서 다른 컴퓨터로)의 프로세스에 접근하여 **프로시저 또는 함수를** 호출하여 사용한다. 자신(로컬)의 컴퓨터에 있는 프로세스를 호출(실행)하는 것 뿐만 아니라 다른(원격) 컴퓨터에 있는 프로세스에 접근하여 그 프로세스를 호출하는 기술이다. 분산 컴퓨팅 환경(인터넷 네트워크 등)으로 발전하면서 상호 통신 및 컴퓨팅 자원을 사용한 위한 기술이다.

### 1.1 특징

TCP(Transmission Control Protocol), HTTP, WebSocket 등에서 동작한다. 
하나의 엔드포인트 URL에서 모든 요청과 응답을 받는다.

### 1.2 요청

클라이언트에서는 RPC 서버에서 구현된 메소드를 호출하는데, 통신방식은 HTTP 또는 TCP/IP을 사용하며, 이 리모트 요청에 의해 메소드가 호출된다. 

요청은 다음 3가지의 속성을 포함해야한다.

**method** 호출하려는 메소드의 이름

**params** 메소드의 파라미터로서 전달하는 객체들의 배열

**id** 임의의 값으로 요청에 대해 대응되는 응답을 일치 시킨다. 

### 1.3 응답

요청을 수신받으면 해당 요청에 대해 유효한 응답하는데 다음 속성들을 포함하여 응답한다.

**result** 호출된 메소드에서 반환되는 결과

**error** 메소드가 호출되었는데 에러가 발생되면 에러 내용을 반환한다.

**id** 응답하는 요청의 id

## 2. 흐름
### 2.1 서버와 클라이언트의 흐름

(1) 클라이언트의 요청 : Stub의 비즈니스 메소드를 호출한다. 호출된 메소드명과 매개변수로 전달된 값들이 스트림 형태로 서버에 전달된다. 서버는 스트림을 분석하여 어떤 메소드가 요청되었는지를 파악한다.

(2) 서버 호출(실행) : 서버에 있는 객체의 비즈니스 메소드를 호출한다.호출 결과를 기다린다.

(3) 서버의 결과 반환 : 실행 결과값은 다시 클라이언트로 전달한다. (로컬 컴퓨터에서 처리한 것처럼)


### 2.2 레이어 구성

- **Client/Server** : 사용자가 필요한 비즈니스 로직을 작성하는 레이어이다.
IDL(interface definition language)로 작성한다.

- **Stub** : 클라이언트와 서버 간 네트워크에서 이해될 수 있는 코드를 구현해야 하는데 이러한 코드들을 Stub 코드라고 한다. 
Stub Compiler가 IDL 파일을 읽어 이해가능한 언어로 생성한다.
Parameter 객체를 Message 형태로 Marshaling/Unmarshalling 하는 레이어이다. 
서버와 클라이언트는 서로 다른 주소 공간을 사용하므로 함수 호출에 사용된 매개변수를 변경시키는 역할을 담당한다
  - client stub : 함수 호출에 사용된 파라미터의 변환(Marshalling) 및 함수 실행 후 서버로부터 전달받은 결과를 반환
  - server stub : 클라이언트가 전달한 매개변수의 역변환(Unmarshalling) 및 함수 실행 결과 변환을 담당

```
"스텁은 기존 코드(예를 들어 원격 머신의 프로시저)를 시뮬레이션하거나 아직 개발되지 않은 코드를 임시로 대치하는 역할을 수행한다.". 위키백과
```
- **RPC Runtime** : Client와 Server를 연결하는 레이어이다. 통신 중 발생한 에러처리한다.

> **Marshaling**은 데이터를 바이트로 쪼개서 TCP/IP 같은 통신 채널을 통해 전송될 수 있는 형태로 바꿔주는 과정이다.

> **UnMarshaling**은 반대로 전송받은 바이트를 원래의 형태로 복원하는 과정이다.

### 2.3 레이어에서의 흐름
 
(1) 클라이언트에서 매개변수를 Stub에 전달한다.

(2) 클라이언트 Stub에서 매개변수를 메시지로 마샬링한다.

(3) 클라이언트 Stub은 메세지를 전송계층으로 전달하여 Server에 보낸다.

(4) 서버에서 메시지를 받아 Stub으로 전달하고 매개 변수를 언마샬링 하여 함수를 호출한다.

(5) 함수 수행이 완료되면 서버 Stub으로 리턴되며 리턴값을 메시지로 마샬링한다.

(6) 결과 메시지를 클라이언트에 보내고 클라이언트는 언마샬링 후, 리턴값을 호출자에게 반환한다.

### 2.4 IDL을 사용한 동작 흐름

```
"인터페이스 정의 언어(Interface Description Language 또는 Interface Definition Language, IDL)는 소프트웨어 컴포넌트의 인터페이스를 묘사하기 위한 명세 언어이다...(중략)...다른 두 개의 시스템을 연결하는 다리 역할을 한다." - 위키백과 -
```

IDL(Interface Definition Language)을 사용하여 서버의 호출 규약을 정의한다. IDL 파일은 RPC 인터페이스 및 해당 기능을 정의하는 파일이다.
IDL 파일(함수명, 인자, 반환값에 대한 데이터 형이 저장된 파일)은 rpcgen 컴파일러를 통해서 컴파일하여 stub 코드를 자동으로 생성한다.

Stub은 원시소스코드의 형태로 만들어지며 클라이언트, 서버에서 각각 빌드한다.

클라이언트 입장에서는 자신의 프로세스 주소공간의 함수를 호출하는 것처럼 동일하게 stub에 정의된 함수를 호출할 수 있게 된다.

stub 코드는 데이터형을 XDR(External Data Representation) 형식으로 변환하여 RPC 호출을 실행한다.

**XDR 변환 이유**는 기본 데이터 타입(정수형, 부동소수점 등)에 대한 메모리 저장방식(리틀엔디안, 빅엔디안)이 CPU 아키텍처별로 다르며, 네트워크 전송과정에서 바이트 전송 순서를 보장하기 위함이다.

### 2.5 **리틀엔디안? 빅엔디안?**
```
컴퓨터는 데이터를 메모리에 저장할 때 Byte 단위로 저장한다. 따라서 연속되는 바이트를 순서대로 저장해야 하는데, 이것을 바이트 저장 순서(Byte Order)라고 한다. 이때 바이트가 저장된 순서에 따라 빅 엔디안, 리틀 엔디안 두 가지 방식으로 나눌 수 있다.

- 빅 엔디안(Big-endian) : 낮은 주소에 데이터의 높은 바이트(MSB : Most Significant Byte)부터 저장하는 방식
- 리틀 엔디안(Little-endian) : 낮은 주소에 데이터의 낮은 바이트(LSB : Least Significant Byte)를 저장하는 방식
```

서버는 수신된 함수 또는 프로시저 호출에 대한 처리를 완료한 후, 결과값을 XDR 변환하여 반환한다.

최종적으로 클라이언트 프로그램은 서버의 결과값을 반환받는다.

## 3. RPC 장단점 

장단점이라고는 해두었지만 각 환경과 쓰임새에 따라 맞추어 사용하면 될듯하다. 하지만 특징으로 장단점을 구분해본다.

### 3.1 장점

- TCP 위에서 동작하므로 좀 더 다양한 프로토콜에서 사용할 수 있다. 
- 네트워크 프로토콜 관련 작업에 크게 신경쓰지 않아도 되므로 고유 프로세스 개발 집중 가능하다.
- 프로세스간 통신 기능을 비교적 쉽게 구현하고 정교한 제어가 가능
- 원격지에 있는 프로그램을 로컬에서 있는 것처럼 사용할 수 있다.
- 플랫폼에 제약 없이 사용할 수 있어 분산 시스템 기법에 효과적이다.

### 3.2 단점

- 호출 실행과 반환 시간이 보장되지 않는다.

---------------

## 4. REST(Representational State Trasfer) API란

자원을 이름으로 구분하여 해당 자원의 상태(정보)를 주고 받는 모든것을 의미한다. 현재 웹 기반 네트워크에서 많이 사용하는 방식이다.

### 4.1 특징 

- HTTP(s) 프로토콜 위에서 동작하는 표준이다.
- 리소스에 기반하는 API 인터페이스이다.
- 리소스(자원)는 URI로 표현하고 이 리소스를 요청하기 위해서 URL에 접근해야한다. URI은 고유해야한다.

- REST는 요청을 보낼 때 여러 HTTP Method를 통해서 보낸다. 

REST 방식은 어떤 객체에 대해서 CRUD(Creat, Read, Update, Delete) 작업을 하는 것에 설계 되었다. 
**REST API는 리소스 중심의 CRUD 작업에 적합하게 설계되어 있다.**
```
POST: Create(추가/생성)
GET: Read(조회)
PUT: Update(수정)
DELETE: Delete(삭제)
```

### 4.2 REST 구성요소

- **자원(Resource)** : URI
REST API는 HTTP의 URI를 사용해 자원(리소스)을 명시한다. 리소스란 클라이언트에서 접근할 수 있는 모든 개체, 데이터, 서비스를 포함한다.
모든 자원에 서버 내에서 고유한 HTTP URI로 존재한다.
클라이언트는 URI를 이용해서 자원의 상태(정보)에 대한 행위를 서버에 요청한다.

- **행위(Verb)** : HTTP Method
HTTP 프로토콜의 Method (GET, POST, PUT, DELETE)를 사용하여 리소스에 CRUD를 수행한다.

- **표현(Representation of Resource)**
클라이언트가 자원의 상태(정보)에 대해 어떤 행위을 요청하면 서버는 이에 적절한 응답을 보낸다.
JSON, XML, TEXT, RSS등 다양한 형태의 Representation(표현)가 있다.



### 참고 

-PRC : https://ko.wikipedia.org/wiki/%EC%9B%90%EA%B2%A9_%ED%94%84%EB%A1%9C%EC%8B%9C%EC%A0%80_%ED%98%B8%EC%B6%9C

- rest api vs rpc : https://stackoverflow.com/questions/15056878/rest-vs-json-rpc/37823128#37823128

- stub : https://ko.wikipedia.org/wiki/%EB%A9%94%EC%86%8C%EB%93%9C_%EC%8A%A4%ED%85%81

- 엔디안 : https://ko.wikipedia.org/wiki/%EC%97%94%EB%94%94%EC%96%B8



