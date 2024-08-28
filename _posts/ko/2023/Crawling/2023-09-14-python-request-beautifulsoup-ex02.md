---
title: Python - how to Crawling and Scraping (2)
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

# 크롤링, 스크래핑이란?
## 파이썬 크롤링 예제 (2) -Request, Urllib, BeautifulSoup 사용하기
웹 페이지는 HTML로 작성되어 있으며, 이러한 웹에서 필요한 데이터를 추출하는 것을 스크래핑이라고 한다.
스크래핑을 하기 위해서는 HTML을 파싱하는 작업이 필요하다.

파싱이란 HTML을 분석해서 필요한 데이터만 추출하는 것을 말한다.
파싱을 하기 위해서는 파이썬의 모듈 BeautifulSoup을 사용한다.

크롤링이란 웹 페이지에 접속해서 HTML을 가져오는 것을 말한다. 
크롤링을 하기 위해서는 파이썬의 모듈 requests를 사용한다. requests를 통해 웹 페이지에 접속하고, HTML을 가져온다.
이 HTML 파일은 웹 페이지의 소스코드를 의미한다.

이 HTML 데이터를 파싱해서 필요한 데이터만 추출하는 것을 스크래핑이라고 한다.
스크래핑이란 웹 페이지에서 필요한 데이터를 추출하는 것을 말한다. 
스트래핑을 하기 위해서는 파이썬의 모듈 BeautifulSoup을 사용한다.

### 순서 (크롤링 -> 스크래핑 -> 결과 출력)
- (1) requests : URL에 접속하고, HTML 가져오기
- (2) bs4 : 가져온 HTML을 파싱하기
- (3) find : 필요한 데이터만 추출하기
- (4) get text(value) : 필요한 데이터에서 값을 추출하기
- (5) 출력


## 크롤링 예제 (1)
네이버 날씨 페이지에서 날씨 데이터를 가져와서 출력해보자.
다음은 네이버 날씨 웹 페이지에서 체감온도, 습도, 동풍을 가져오는 예제이다.

```py
import requests
import bs4
from bs4 import BeautifulSoup

## 크롤링
url = "https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=%EB%82%A0%EC%94%A8"
res = requests.get(url)
if res.status_code == requests.codes.ok:
    print("정상입니다.")
else:
    print("문제가 생겼습니다. [에러코드", res.status_code, "]")
    res.raise_for_status() # 문제가 생기면 바로 프로그램 종료

#print(len(res.text))
#print(res.text)

## 스크래핑 : html parsing. 스크래핑이란 웹사이트에서 필요한 데이터를 추출하는 것을 말한다.
bs_obj = bs4.BeautifulSoup(res.text, "html.parser")

## html을 보면 dd tag는 여러개가 있다.
## find() : 하나만 찾는다.
dd_obj = bs_obj.find("dd", {"class":"desc"})
print(dd_obj.text)

## 두번째 dd tag를 찾기위해서 findAll() 사용
dd_obj2 = bs_obj.findAll("dd", {"class":"desc"})
print(dd_obj2[1].text) 
print(dd_obj2[2].text)
'''
26.8°
85%
1.5m/s
'''

soup = BeautifulSoup(res.text, "html.parser")
li = soup.find("dl", {"class":"summary_list"}) # find : 하나만 찾는다.
lis = li.findAll("div", {"class":"sort"}) # findAll : 여러개 찾는다.
for i in range(len(lis)):  
    lis_term = lis[i].find("dt", {"class":"term"})
    lis_desc = lis[i].find("dd", {"class":"desc"})
    print(lis_term, lis_desc)
'''
<dt class="term">체감</dt> <dd class="desc">26.8°</dd>
<dt class="term">습도</dt> <dd class="desc">85%</dd>
<dt class="term">동풍</dt> <dd class="desc">1.5m/s</dd>
'''
```

--------

## 크롤링 예제 (2)
다음 영화, 역대 관객 영화 이미지 수집

다음은 웹 페이지에서 이미지의 주소를 가져와서 파일로 저장하는 예제이다.

### 순서는 : 1.크롤링, 2.스크래핑, 3.출력 이다.
- (1) requests : URL에 접속하고, HTML 가져오기
- (2) bs4 : 가져온 HTML을 파싱하기
- (3) find : 필요한 데이터만 추출하기
- (4) 출력

```py
import requests
import bs4

## 크롤링 : URL 웹 페이지에 접속해서 HTML 가져오기 - requests
url = "https://search.daum.net/search?w=tot&DA=UME&t__nil_searchbox=suggest&sug=&sugo=15&sq=2022+%EC%98%81%ED%99%94&o=1&q=2022+%EC%98%81%ED%99%94+%EC%88%9C%EC%9C%84"
try: 
    res = requests.get(url)
    res.raise_for_status() # 문제가 생기면 바로 프로그램 종료
    print("정상 입니다.")
except HTTPError as e:
    print(e)
    
## 스크래핑 : html parsing. 스크래핑이란 웹사이트에서 필요한 데이터를 추출하는 것을 말한다. - bs4
bs_obj = bs4.BeautifulSoup(res.text, "html.parser")

# find : html 태그 중 하나만 찾는다.
img_obj = bs_obj.find("img", {"class":"thumb_img"})
img_url = img_obj["src"]
print(img_url)

# findAll : html에서 동일한 태그를 모두 찾는다.
img_obj = bs_obj.findAll("img", {"class":"thumb_img"})
print(img_obj[0]["src"])
print(img_obj[1]["src"])

## 이미지 파일 저장하기
#https://search1.kakaocdn.net/thumb/R232x328.q85/?fname=https%3A%2F%2Ft1.daumcdn.net%2Fmovie%2F3f7e3035989e7918c6426e541c864d0d8a295de2
'''
response = requests.get(img_url)

if response.status_code == 200:
    file_path = "image.jpg"
    with open(file_path, "wb") as image_file:
        image_file.write(response.content)
    print(f"Image saved to {file_path}")
else:
    print("Failed to download the image.")
'''

## 이미지 주소 가져오기
## 웹 페이지를 보면 이미지들은 img 태그에 src 속성에 저장되어 있다.
## 따라서 img 태그를 찾고, src 속성을 가져와서 이미지 주소를 가져와본다.
soup = BeautifulSoup(res.text, "html.parser")
main = soup.find("ol", {"class":"type_plural list_exact movie_list"})  #ol태그 찾기
movies_li = main.find_all("li") #li태그 찾기

for idx, movie in enumerate(movies_li):
    wrap_thumb = movie.find("div", {"class":"wrap_thumb"})
    image = wrap_thumb.find("img", {"class":"thumb_img"})  
    print(idx+1, image["src"])
    
    if idx >= 4:
        break # 5개만 가져오기. 0부터 시작하니까 0~4까지 5개가 된다.

# 이미지 가져와서 파일 저장하기.
img_objs = bs_obj.findAll("img", {"class": "thumb_img"}) #findAll : 여러개 찾는다.
for i, img_obj in enumerate(img_objs): #enumerate : 인덱스와 값을 같이 가져온다.
    img_url = img_obj["src"]
    print("img_url : ", img_url)
    '''
    print(f"Downloading and saving image {i + 1}")
    
    response = requests.get(img_url)
    
    # 파일 저장
    if response.status_code == 200:
        file_path = f"image_{i + 1}.jpg"
        with open(file_path, "wb") as image_file:
            image_file.write(response.content)
        print(f"Image {i + 1} saved to {file_path}")
    else:
        print(f"Failed to download image {i + 1}")
    '''
```
    
----------

## 크롤링 예제 (3)  
특정 기간의 영화 이미지 수집
```py
import urllib.request

# 이미지 주소 가져오기
for year in range(2017, 2022):
    url =  "https://search.daum.net/search?w=tot&q=%EC%97%AD%EB%8C%80%EA%B4%80%EA%B0%9D%EC%88%9C%EC%9C%84&DA=MOR&rtmaxcoll=MOR".format(year)
    # request객체에 url, header정보를 넣어서 요청한다.
    req = urllib.request.Request(
        url,
        data=None,
        headers={
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.47 Safari/537.36'
        }
    )
    f = urllib.request.urlopen(req)
    print(f.read().decode('utf-8'))

    res = requests.get(url)
    res.raise_for_status() # 문제가 생기면 바로 프로그램 종료

    soup = BeautifulSoup(res.text, "html.parser") # html parsing
    main = soup.find("ol", {"class":"type_plural list_exact movie_list"})  #ol태그 찾기
    movies_li = main.find_all("li") #li태그 찾기
    
    # 반복문으로 이미지 주소 가져오기
    for idx, movie in enumerate(movies_li):
        wrap_thumb = movie.find("div", {"class":"wrap_thumb"})
        image = wrap_thumb.find("img", {"class":"thumb_img"})  
        print(idx+1, image["src"])
        img_url = image["src"]  
        if img_url.startswith("//"):
            img_url = "https:" + img_url
            
        img_res = requests.get(img_url)
        img_res.raise_for_status
        
        with open("movie{0}.jpg".format(idx+1), "wb") as f:
            f.write(img_res.content)
        if idx >= 4:
            break
```