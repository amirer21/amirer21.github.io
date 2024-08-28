---
title: Python - Dynamic data collection and processing(Selenium and Pandas)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Selenium
tags:
- Python
- Crawling
- Selenium
toc: true
toc_sticky: true
toc_label: 목차
description: Python - Selenium and pandas
article_tag1: selenium
article_tag2: pandas  
article_tag3: crawling
article_section: crawling
meta_keywords: selenium, pandas, crawling, python
last_modified_at: '2023-09-14 21:00:00 +0800'
---

# 파이썬 - 동적 데이터 수집 및 가공(selenium, pandas)
selenium 은 웹 브라우저를 제어하는 프레임워크이다.
웹 브라우저에서 동적으로 데이터를 수집할 수 있다. 

그리고 웹 브라우저에서 수집한 데이터는 파이썬의 pandas 모듈을 사용하여 데이터를 가공할 수 있다.pandas는 데이터를 가공하고, 분석하는데 사용하는 파이썬 라이브러리이다.


### selenium 설치
>  pip install selenium

### 크롬 드라이버 관리 모듈 설치
> pip install webdriver-manager

### 예제 코드 설명

다음 예제는 쿠팡에서 식품 카테고리에서 상품명, 가격, 배송, URL을 수집하는 예제이다. 그리고 이 데이터를 pandas의 DataFrame 객체로 만들어서 출력해보고, csv 파일로 저장해본다.

### 예제 코드
```py
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
import pandas as pd
from webdriver_manager.chrome import ChromeDriverManager

"""
service의 구조는 selenium.webdriver.chrome.service.Service 클래스를 참고
https://www.selenium.dev/selenium/docs/api/py/webdriver_chrome/selenium.webdriver.chrome.service.html
executable_path는 이 클래스의 생성자의 인자로 들어가는데, 이는 chromedriver의 경로를 의미함
"""
service = Service()
options = webdriver.ChromeOptions() # ChromeOptions : 크롬 브라우저의 설정을 위한 객체
driver = webdriver.Chrome(service=service, options=options) # Chrome() : 크롬 브라우저를 실행하기 위한 객체

## 크롬 브라우저 get()으로 URL 요청
driver.get("https://www.coupang.com/np/categories/194276")

## 상품 리스트 수집 - ID태그로 찾기, find_element()는 하나만 찾음
productList = driver.find_element(By.ID, 'productList')
## 상품 리스트에서 상품 정보 수집 - TAG_NAME으로 찾기, li태그가 여러개이므로 find_elements()로 찾음
lis = productList.find_elements(By.TAG_NAME, "li")
#print(len(lis))   
#print(lis)

## 상품명, 가격, 배송, URL 수집 배열 선언
prd_name = []
prd_price = []
prd_deli = []
prd_url = []   

## 상품명, 가격, 배송, URL 수집 - 반복문 사용
for idx, li in enumerate(lis):
    try:
        prd_name.append(li.find_element(By.CLASS_NAME, 'name').text)
        prd_price.append(li.find_element(By.CLASS_NAME, 'price-value').text)
        prd_deli.append(li.find_element(By.CLASS_NAME, 'delivery').text)
        prd_url.append(li.find_element(By.CLASS_NAME, 'baby-product-link').get_attribute('href'))
        if idx >= 5:
            break
    except Exception:
        pass
    
## 수집 데이터 확인
## pandas의 DataFrame 객체로 만들어서 출력
final = pd.DataFrame({'이름': prd_name, '가격': prd_price, 'Delivery': prd_deli, 'URL': prd_url})
pd.set_option('display.max_columns', 10)                  # 출력할 최대 열의 개수
pd.set_option('display.max_colwidth', 20)                 # 출력할 열의 너비
pd.set_option('display.unicode.east_asian_width', True)   # 유니코드 사용 너비 조정
print(final)
'''
(출력된 내용에 상품명은 'ㅁ'로 수정하였음)
                     이름           가격                 Delivery                  URL
0  ㅁㅁ 햇 꼬마사과 (13~17...      22,950   내일(일) 새벽 도착 보장.....    https://www.coup...
1  ㅁㅁㅁㅁ 제로 블루라임 탄산...   17,030   내일(일) 도착 보장              https://www.coup...
2  ㅁㅁㅁ 명작 2FL 분유 2...       56,700   내일(일) 도착 보장             https://www.coup...
3  ㅁㅁ 산지직송 산채로 포장한...   26,200   모레(월) 새벽 도착 보장.....     https://www.coup...
4  ㅁㅁ 현미밥, 130g, 24...        16,900   내일(일) 도착 보장            https://www.coup...
5  ㅁㅁㅁ ㅁㅁ 오트 바리스...       25,920    내일(일) 도착 보장              https://www.coup...
'''

## csv 파일로 저장
#final.to_csv('쿠팡식품.csv', encoding='euc-kr') #eur-kr로 하면 한글이 깨짐
final.to_csv('쿠팡식품.csv', encoding='utf-8-sig', index=False)
```
