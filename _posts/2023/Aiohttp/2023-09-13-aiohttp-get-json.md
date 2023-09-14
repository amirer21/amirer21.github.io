---
title: aiohttp - (3) 응용(Json 객체 가져오기)
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
description: aiohttp - 응용(Json 객체 가져오기)
article_tag1: aiohttp
article_tag2: python  
article_tag3: asyncio
article_section: aiohttp
meta_keywords: aiohttp, python, asyncio
last_modified_at: '2023-09-13 21:00:00 +0800'
---

# aiohttp (3) 응용 : uiautomation, platform, os 모듈로 PC정보를 json 객체로 전송하기
서버에서 JSON을 반환하는 예제이다.
json 객체 : get_device_info 함수에서 반환하는 딕셔너리를 JSON으로 변환한다.

+ 추가로 서버에서는 PC정보를 읽어와서 그 정보를 json 객체로 포장한다.

  -  platform 모듈을 사용하여 서버의 운영체제 정보를 JSON으로 반환한다.

  -  uiAutomation 모듈을 사용하여 서버의 정보를 JSON으로 반환한다.



## 서버 코드
```py
import aiohttp
from aiohttp import web
import platform
import uiautomation as winapi
import os
import json  # Import the json module

async def handle(request):
    return web.Response(text="Hello, this is the server!")

async def handle_second(request):
    return web.Response(text="Hello, this is second handle!")

async def get_device_info(request):
    width, height = winapi.GetScreenSize()
    info = {
        'screen_width': width,
        'screen_height': height,
        'platform': platform.system(),
        'platform_version': platform.machine(),
        'product_model': platform.node(),
        'build_target_country': os.environ.get("LANG", "INT"),
        'build_version_release': platform.release(),
        'hw_revision': platform.processor(),
        'revision': platform.version(),
        'os_version': platform.release(),
    }
    # Set the Content-Type header to application/json
    return web.json_response(info)

app = web.Application()
app.router.add_get('/', handle)
app.router.add_get('/second', handle_second)
app.router.add_get('/getDeviceInfo', get_device_info)

# Set the desired domain and port
host = '0.0.0.0'  # Listen on all available network interfaces
port = 8080

web.run_app(app, host=host, port=port)
```

# 클라이언트 코드
서버의 getDeviceInfo() 함수를 호출하여 json 객체를 열어서 각 값들을 출력하는 코드이다.
```py
import requests

# Set the server's address (replace with the appropriate address)
server_url = 'http://localhost:8080/getDeviceInfo'

try:
    print('try!')
    response = requests.get(server_url)
    if response.status_code == 200:
        device_info = response.json()
        print("Received Device Info:")
        print("Screen Width:", device_info['screen_width'])
        print("Screen Height:", device_info['screen_height'])
        print("Platform:", device_info['platform'])
        print("Platform Version:", device_info['platform_version'])
        print("Product Model:", device_info['product_model'])
        print("Build Target Country:", device_info['build_target_country'])
        print("Build Version Release:", device_info['build_version_release'])
        print("Hardware Revision:", device_info['hw_revision'])
        print("Revision:", device_info['revision'])
        print("OS Version:", device_info['os_version'])
    else:
        print(f"Failed to retrieve Device Info. Status code: {response.status_code}")
except requests.exceptions.RequestException as e:
    print(f"Error: {e}")
```

-------

- async  : 비동기 함수를 만들 때 사용하는 키워드이다.

- await : 비동기 함수 안에서 비동기 함수를 호출할 때 사용하는 키워드이다.
await는 async 키워드가 붙은 함수 안에서만 사용할 수 있다.
기능은 비동기 함수가 호출되면, 비동기 함수가 끝날 때까지 기다린다.

비동기 함수는 호출되면, 이벤트 루프에 의해 실행된다.

이벤트 루프란 이벤트를 받고, 처리하는 역할을 한다. 여기서 이벤트란 사용자의 요청이나, 파일의 입출력 등을 말한다.

-------


# 클라이언트 코드(전체)
```py
import aiohttp
import asyncio
import requests

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

async def fetch_device_info(url):
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()


async def main():
    url = "http://localhost:8080"  # Assuming the server is running locally on port 8080
    response = await fetch_url(url)
    print("Server Response:", response)
    
    #server response: Hello, this is second handle!
    second_url = "http://localhost:8080/second"
    response = await fetch_url(second_url)
    print("Server Response seconde :", response)

    # Fetching DeviceInfo from the '/getDeviceInfo' endpoint
    device_info_url = "http://localhost:8080/getDeviceInfo"
    device_info = await fetch_device_info(device_info_url)
    print("Device Info:", device_info)

if __name__ == "__main__":
    loop = asyncio.get_event_loop()
    loop.run_until_complete(main())
```