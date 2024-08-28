---
title: Python - Django 웹 만들기 (3)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Django
tags:
- Python
- Django
- Web
toc: true
toc_sticky: true
toc_label: 목차
description: Python, Django 웹 만들기 (3)
article_tag1: python
article_tag2: web
article_tag3: Django
article_section: Django
meta_keywords: python, Django, web
last_modified_at: '2023-10-23 21:00:00 +0800'
---


# 파이썬 Django 웹 프로그래밍 (3) : 계좌 잔고 확인 페이지

기본적인 순서는 다음과 같다.

- 1. balance 어플리케이션 생성
- 2. settings.py에 앱 등록
- 3. URLconf 설정
- 4. views.py에 get_data, main_view 함수(잔고 확인 페이지에서 주식 정보를 조회하는 함수) 추가
- 5. html : templates/balance.html 생성
- 6. css : static/b_style.css 생성
- 7. 접속해보기 : http://127.0.0.1:8000/balance/?035420=20&005930=100 (/balance/?주식 코드=주식 수량&주식 코드=주식 수량)

## balance 앱 기본구조
```
balance
    ㄴ migrations : 데이터베이스 마이그레이션 파일이 저장되는 디렉터리
        ㄴ __init__.py
    ㄴ static : 정적 파일이 저장되는 디렉터리
        ㄴ balance
            ㄴ b_style.css
    ㄴ templates : html 템플릿 파일이 저장되는 디렉터리
        ㄴ balance
            ㄴ balance.html
    ㄴ __init__.py
    ㄴ admin.py   : 관리자 페이지에서 balance 앱을 관리하기 위한 설정 파일
    ㄴ apps.py    : balance 앱의 정보를 저장하는 설정 파일
    ㄴ models.py  : balance 앱에서 사용하는 모델을 정의하는 파일
    ㄴ tests.py   : balance 앱의 테스트를 작성하는 파일
    ㄴ views.py   : balance 앱의 뷰를 정의하는 파일
```

## 1. balance 어플리케이션 생성

> cd \mySite\Investar

> python manage.py startapp balance

## 2. settings.py에 앱 등록
```py
INSTALLED_APPS = [...,'balance']
```

## 3. URLconf 설정
파일 : urls.py
```py
import : balance/views.py를 import
urlpatterns = [..., path('balance/', views.main_view)]
```


```py
from django.contrib import admin
from hello import views #hello 추가
from django.urls import path, re_path #re_path 추가
from index import views as index_views #index 추가
from balance import views as balance_views #balance 추가

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^(?P<name>[A-Z][a-z]*)/$', views.sayHello), #규칙 : 대문자로 시작하고 소문자로 끝나는 문자열. # P: parameter <name>: name이라는 이름으로 파라미터를 받겠다.    
    path('index/', index_views.main_view), #index 추가
    path('balance/', balance_views.main_view), #balance 추가
]
```


## views.py 추가
```py
from urllib.request import urlopen
from bs4 import BeautifulSoup
from django.shortcuts import render


def get_data(symbol):
    """
        symbol에 해당하는 주식에 대한 현재 가격, 등락률을 반환한다.
        
        Args:
            symbol(str): 주식의 심볼
        Returns:
            cur_price(str): 주식의 현재가
            cur_rate(str): 주식의 등락률
            stock_name(str): 주식의 이름    
    """
    url = 'http://finance.naver.com/item/sise.nhn?code={}'.format(symbol)
    with urlopen(url) as doc:
        soup = BeautifulSoup(doc, "lxml", from_encoding="euc-kr")#BeautifulSoup : html을 파싱하는 라이브러리
        cur_price = soup.find('strong', id='_nowVal') #_nowVal : 현재가
        cur_rate = soup.find('strong', id='_rate') #_rate : 등락률
        stock = soup.find('title') #title : 주식 이름
        print(stock)
        stock_name = stock.text.split(':')[0].strip()
        print(stock_name)
        return cur_price.text, cur_rate.text.strip(), stock_name
    
def main_view(request):
    """
        사용자가 입력한 주식의 심볼과 수량에 대한 정보를 가져와서
        현재가, 등락률, 주식 이름을 조회한 후 이를 템플릿에 전달한다.
        Args:
            request(HttpRequest): HttpRequest 객체
        Returns:
            render : 템플릿(html : balance.html)에 조회한 주식 정보를 전달한다.            
    """
    #mylist = [['035420', '20'], ['005930','100']]
    querydict = request.GET.copy()
    mylist = querydict.lists()
    rows = []
    total = 0
    for x in mylist:
        cur_price, cur_rate, stock_name = get_data(x[0]) #get_data : 주식의 현재가, 등락률, 주식 이름을 조회
        price = cur_price.replace(',', '')
        stock_count = format(int(x[1][0]), ',')
        sum = int(price) * int(x[1][0])
        stock_sum = format(sum, ',')
        rows.append([stock_name, x[0], cur_price, stock_count, cur_rate, stock_sum])
        total = total + int(price) * int(x[1][0])
    total_amount = format(total, ',')
    values = {'rows' : rows, 'total' : total_amount}
    print(values)
    return render(request, 'balance.html', values)
```

------------    

## html 코드

<script src="https://gist.github.com/amirer21/58b7b4eecfe1a350e5d840fd18cedeb0.js"></script>

## 접속해보기

> http://127.0.0.1:8000/balance/?035420=20&005930=100


