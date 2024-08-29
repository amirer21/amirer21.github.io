---
title: Python - how to Crawling and Scraping (1)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Crawling
tags:
- Python
- Crawling
- BeautifulSoup
toc: true
toc_sticky: true
toc_label: 목차
description: Python - Crawling(Request, Urllib, BeautifulSoup)
article_tag1: crawling
article_tag2: Request  
article_tag3: BeautifulSoup
article_section: crawling
meta_keywords: request, urllib, beutifulsoup, python
last_modified_at: '2023-09-14 21:00:00 +0800'
---

# 파이썬 크롤링 예제 (1) -Request, Urllib, BeautifulSoup 사용하기
웹 크롤링으로 웹에서 데이터를 수집하기 위해 간단한 예제를 통해 기본적인 기능을 알아본다.
웹 크롤링은 웹에서 데이터를 수집하는 것을 말한다. 웹 크롤링을 하기 위해서는 웹에서 데이터를 가져오는 것이 필요하다.

웹에서 데이터를 가져오는 방법은 여러가지가 있다.
그 중에서도 가장 기본적인 방법은 requests를 사용하는 것이다.
requests는 URL에 접속하고, 상태코드를 확인하고, HTML을 가져오는 역할을 한다.

requests를 사용하기 위해서는 다음과 같이 명령어로 설치할 수 있다.

> 설치는 pip install requests를 통해 설치할 수 있다.

> https://pypi.org/project/requests/

설치가 완료되면 import requests를 통해 사용할 수 있다.


## Request 예제

requests를 사용하여 웹에서 데이터를 가져오는 예제이다.
어떤 URL 주소를 사용하여 데이터를 가져올 수 있는지 확인한다. 

GET 방식, POST 방식, PUT 방식, DELETE 방식 등이 있는데, 이러한 방식을 HTTP Method라고 한다.
HTTP Method는 서버에게 어떤 동작을 요청하는지 알려주는 역할을 한다.

다음은 어떤 URL 에 접근하여 정상적인 경우와 비정상적인 경우를 확인하는 예제이다.

``` py
import requests

# 정상적인 경우
res = requests.get("http://naver.com")
print("응답코드 :", res.status_code) # 200이면 정상

# 정상적이지 않은 경우
res = requests.get("http://nooooooooo.tistory.com")
if res.status_code == requests.codes.ok:
    print("정상입니다.")
else:
    print("문제가 생겼습니다. [에러코드", res.status_code, "]")
    
res = requests.get("http://naver.com")
res.raise_for_status() # 문제가 생기면 바로 프로그램 종료
print("정상 입니다.")
print(len(res.text))
#print(res.text)
```


# Urllib
Urllib은 URL에 접속하고, HTML을 가져오는 역할을 한다.
requests와 비슷한 역할을 한다.

```py
from urllib.request import urlopen

url = "http://naver.com"
html = urlopen(url)
#print(html.read())

from urllib.request import urlopen
from urllib.request import HTTPError
from urllib.request import URLError

try:
    #html = urlopen("http://www.google.com/kim.html") #HTTPError
    html = urlopen("http://www.google.com/test22.html") #URLError
except HTTPError as e:
    print(e)
except URLError as e:
    print("서버를 찾을 수 없습니다.")
else:
    print("성공")
```
---------

# BeautifulSoup는
BeautifulSoup는 가져온 HTML을 파싱하는 역할을 한다.
파싱이란 HTML을 분석해서 필요한 데이터만 추출하는 것을 말한다.

- 기본 사용법은 다음과 같다.

> BeautifulSoup(HTML데이터, 파싱방법)

파싱방법은 html.parser, lxml 등이 있다.

## BeautifulSoup 예제 (1)
BeautifulSoup에서는 HTML 웹 페이지에서 필요한 데이터를 추출하는데 사용하는 함수가 있다.

- find() 함수는 HTML에서 특정 태그를 검색하는 역할을 한다. 기본적으로 HTML에서 처음 발견되는 태그를 검색한다.

사용 방식 : find(태그, 속성)

예 : find("div", {"class":"hello"})

- find_all() 함수는 HTML에서 특정 태그를 모두 검색하는 역할을 한다. 기본적으로 HTML에서 발견되는 모든 태그를 검색한다.

사용 방식 : find_all(태그, 속성)

예 : find_all("div", {"class":"hello"})

아래와 같이 HTML(html_str)을 가져와서 hello 텍스트만 출력한다.
```py
import bs4

html_str = "<html><div>hello</div></html>"
bs_obj = bs4.BeautifulSoup(html_str, "html.parser")

print(type(bs_obj))
print(bs_obj)
print(bs_obj.find("div"))
```

같은 위치의 태그에 여러 값이 있는 경우

```py
import bs4
html_str = """
<html>
    <body>
        <ul>
            <li>hello</li>
            <li>bye</li>
            <li>welcome</li>
        </ul>
    </body>
</html>
"""

bs_obj = bs4.BeautifulSoup(html_str, "html.parser")
ul = bs_obj.find("ul")
print(ul)

# find <li> tag, get text
li = ul.find("li")
print(li)
print(li.text)

# find all <li> tag, get text
lis = ul.findAll("li")
print(lis)
print(lis[1])
print(lis[1].text)
```

------------------

## BeautifulSoup 예제 (2)

- BeautifulSoup - find (태그, 클래스로 찾기)
```py
import bs4

html_str = """
<html>
    <body>
        <ul class="greet">
            <li>hello</li>
            <li>bye</li>
            <li>welcome</li>
        </ul>
        <ul class="reply">
            <li>ok</li>
            <li>no</li>
            <li>sure</li>   
        </ul>
    </body>
</html>
"""

## 태그로 찾기
bs_obj = bs4.BeautifulSoup(html_str, "html.parser")
ul = bs_obj.find("ul")   
print(ul)
print("=====================================")

## 클래스로 찾기
bs_obj = bs4.BeautifulSoup(html_str, "html.parser")
ul = bs_obj.find("ul", {"class":"reply"})
print(ul)
print("=====================================")
```