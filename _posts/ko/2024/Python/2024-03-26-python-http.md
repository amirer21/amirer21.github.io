---
title: Python - aiohttp web.HTTPFound, ClientSession() 서버 HTTP 리다이렉트 처리 방식 비교
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- HTTP
toc: true
toc_sticky: true
toc_label: 목차
description: aiohttp - web.HTTPFound, ClientSession() 서버 HTTP 리다이렉트 처리 방식 비교
article_tag1: python
article_tag2: aiohttp
article_tag3: 
article_section: python
meta_keywords: python, aiohttp
last_modified_at: '2024-03-26 21:00:00 +0800'
---

# aiohttp - web.HTTPFound, ClientSession() : 서버 HTTP 리다이렉트 처리 방식 비교


## 1. aiohttp?

- aiohttp : 비동기 웹 서버와 클라이언트를 위한 비동기 HTTP 클라이언트/서버 프레임워크입니다. 이 라이브러리는 비동기 I/O를 사용하여 고성능 네트워크 애플리케이션을 구축할 수 있게 해줍니다.

웹 서버에서 HTTP 리다리엑트를 하기 위해 아래 2가지 방식이 있다.
web.HTTPFound, ClientSession() 두 가지는 어떤 방식으로 HTTP 요청을 어떤 방식으로 리다이렉트 하는지 비교해본다.

## 2. aiohttp - web.HTTPFound 

```py
raise web.HTTPFound(location=f"http://localhost:{cfg.agent.port}{request.path_qs}")
```

이 코드는 aiohttp 웹 프레임워크에서 제공하는 web.HTTPFound 예외를 사용하여 HTTP 리다이렉션을 처리합니다. 

### HTTPFound를 사용한 방식:

HTTPFound는 응답으로 로컬 URL을 반환하는 방식으로, 실제 응답을 기다리는 데 사용됩니다. 즉, 외부 IP를 통해 GET 요청을 보내면, 웹 엔진은 응답 코드 302와 함께 로컬 주소를 응답으로 받게 됩니다.

클라이언트를 localhost에 있는 특정 포트와 경로로 리다이렉트합니다. 이 방식은 몇 가지 사용 주의 사항이 있습니다.

### 주의사항

- 제한된 접근성: 이 코드는 서버와 클라이언트가 동일한 로컬 시스템에서 실행될 때만 제대로 작동합니다. 외부 시스템이나 다른 네트워크의 사용자가 접근할 경우, localhost 주소는 그들의 로컬 시스템을 가리키게 되므로, 실제 서버로의 연결이 불가능합니다.

- 외부 접근 불가: 제3자 .Net 애플리케이션 내에서 실행되며 외부 접근을 허용하지 않는 경우, localhost 리다이렉션은 외부 사용자에게 아무런 의미가 없습니다.


## 3. aiohttp - ClientSession()

```py
async with ClientSession() as session:
    async with session.request(request.method, f"http://localhost:{cfg.agent.port}{request.path_qs}") as resp:
        res = resp
        raw = await res.read()

return web.Response(body=raw, status=res.status, headers=res.headers)
```

aiohttp.ClientSession을 사용하여 비동기 HTTP 요청을 보내고, 받은 응답을 처리합니다. 또한, 최종적으로 web.Response를 사용하여 응답을 구성하고 클라이언트에게 전송합니다.

- aiohttp.ClientSession: 비동기 HTTP 클라이언트 세션을 관리합니다. 이를 통해 HTTP 요청을 비동기적으로 보내고 응답을 처리할 수 있습니다. 세션을 사용하면 여러 요청 간에 쿠키를 유지하고 연결을 재사용하는 등의 기능을 사용할 수 있습니다.

- web.Response: aiohttp에서 제공하는 응답 객체로, HTTP 응답의 바디, 상태 코드, 헤더 등을 설정할 수 있습니다.


async with ClientSession을 사용하는 방식은 외부 웹 요청과 내부 로컬 웹 서비스 사이에 위치하는 프록시 서버를 만드는 표준 방법입니다. 이 방식은 외부 요청을 내부 서비스로 중계하고, 필요에 따라 응답을 조작할 수 있는 유연성을 제공합니다. 특히, 동일한 PC에서 작동하는 것이 아니라 실제 분산된 환경에서 효과적으로 작동합니다

- 외부 접근을 고려한 구조로 변경: 서비스가 외부 사용자에게도 접근 가능하도록 구성하려면, localhost를 사용하는 대신 실제 서버의 공개 도메인 이름이나 IP 주소로 리다이렉션하는 방식을 고려해야 합니다. 그러나 이 경우에는 제3자 애플리케이션 내에서 외부 접근이 제한되므로, 다른 접근 방법이 필요합니다.

- 프록시 서버 사용: 내부적으로 실행되는 서비스에 외부에서 접근하도록 하려면, 프록시 서버를 사용하는 방법이 있습니다. 프록시 서버는 외부 요청을 받아 내부 서비스로 전달하고, 그 응답을 다시 클라이언트에게 전송하는 역할을 합니다. 이를 위해 async with ClientSession()을 사용하는 비동기 HTTP 요청 처리 방식을 적용할 수 있습니다.


## 4. 차이점

주된 차이는 요청을 처리하는 방식과 응답을 클라이언트에 전달하는 방식에 있습니다

### 4.1 aiohttp - web.HTTPFound 

```py
raise web.HTTPFound(location=f"http://localhost:{cfg.agent.port}
```

이 코드는 HTTP 요청을 받은 후 클라이언트를 다른 URL로 리다이렉트합니다. 여기서는 클라이언트를 localhost의 특정 포트로 리다이렉트하도록 설정되어 있습니다. 이 방식은 웹 서버가 클라이언트에게 직접 응답 내용을 제공하는 것이 아니라, 클라이언트가 리다이렉트된 주소로 다시 요청을 보내도록 합니다. 즉, 실제 요청 처리는 리다이렉트된 주소에서 이루어집니다.

#### 주의할 점 

이 과정에서 주의할 점은 외부에서 접근할 경우 localhost 주소가 외부 사용자의 로컬 시스템을 가리키기 때문에, 실제 서비스에 접근할 수 없다는 점입니다.

## 4.3 aiohttp - aiohttp.ClientSession

```py
async with ClientSession() ...
```

이 코드는 비동기 HTTP 클라이언트 세션을 생성하여 localhost의 특정 포트로 요청을 보내고, 그 응답을 받아 처리합니다.
여기서 중요한 점은 서버가 클라이언트에게 리다이렉트 주소를 제공하는 것이 아니라, 서버 자체가 localhost의 특정 주소로 요청을 보내고, 그 응답을 클라이언트에 직접 전달합니다. 즉, 서버가 중간에서 요청을 받아 처리하고, 그 결과를 클라이언트에게 돌려주는 역할을 합니다.
이 방식은 프록시 서버 또는 중계 서버의 역할과 유사하며, 이를 통해 내부 서비스에 대한 요청을 중개하고 결과를 클라이언트에게 전달할 수 있습니다. 이 경우, 외부 사용자가 직접 localhost에 접근하는 것이 아니라, 서버가 내부적으로 요청을 처리하고 결과를 외부로 전달하는 구조입니다.