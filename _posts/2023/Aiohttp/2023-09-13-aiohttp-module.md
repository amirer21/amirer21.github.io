---
title: aiohttp - (2) 모듈 추가하기
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Aiohttp
toc: true
toc_sticky: true
toc_label: 목차
description: aiohttp - 모듈 추가하기
article_tag1: aiohttp
article_tag2: python  
article_tag3: asyncio
article_section: aiohttp
meta_keywords: aiohttp, python, asyncio
last_modified_at: '2023-09-13 21:00:00 +0800'
---

# aiohttp (2) 모듈 추가하기
실제로 서버에서는 여러 라우터를 추가할 수 있다. 라우터는 URL 경로와 핸들러 함수를 매핑하는 역할을 한다.
라우터를 추가할 때는 add_get() 메서드를 사용한다. add_get() 메서드는 GET 요청을 처리하는 핸들러를 추가한다.
첫 번째 인자는 URL 경로이고, 두 번째 인자는 핸들러 함수이다.

## 서버 코드
```py
import aiohttp
from aiohttp import web

async def handle(request):
    return web.Response(text="Hello, this is the server!")

async def handle_second(request):
    return web.Response(text="Hello, this is second handle!")

app = web.Application()
# add_get('/url', 호출하려는함수) 로 url 라우팅을 할 수 있다.
app.router.add_get('/', handle)
app.router.add_get('/second', handle_second)

# Set the desired domain and port
host = '0.0.0.0'  # Listen on all available network interfaces
port = 8080

web.run_app(app, host=host, port=port)
```

-------

- async  : 비동기 함수를 만들 때 사용하는 키워드이다.

- await : 비동기 함수 안에서 비동기 함수를 호출할 때 사용하는 키워드이다.
await는 async 키워드가 붙은 함수 안에서만 사용할 수 있다.
기능은 비동기 함수가 호출되면, 비동기 함수가 끝날 때까지 기다린다.

비동기 함수는 호출되면, 이벤트 루프에 의해 실행된다.

이벤트 루프란 이벤트를 받고, 처리하는 역할을 한다. 여기서 이벤트란 사용자의 요청이나, 파일의 입출력 등을 말한다.

-------

## 클라이언트 코드
```py
import aiohttp
import asyncio

async def fetch_url(url):
    """
        ClientSession() 은 aiohttp의 핵심 클래스이다.
        이 클래스는 HTTP 클라이언트의 상태를 유지하고, 쿠키를 저장하고, 리다이렉션을 처리하고,
        기본 인증을 지원하며, 프록시를 지원하며, 기타 많은 기능을 제공한다.
        이 클래스는 단일 웹 서버에 대한 모든 요청을 처리하는 데 사용할 수 있다.
    """
    async with aiohttp.ClientSession() as session:
        # get() 메소드는 GET 요청을 보내고, 응답을 기다린다.
        async with session.get(url) as response:
            return await response.text()

async def main():
    url = "http://localhost:8080"  # Assuming the server is running locally on port 8080
    response = await fetch_url(url)
    print("Server Response:", response)
    
    #server response: Hello, this is second handle!
    second_url = "http://localhost:8080/second"
    response = await fetch_url(second_url)
    print("Server Response seconde :", response)
    

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
```