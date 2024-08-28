---
title: Web Scraping Automation with Selenium and Pandas
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Pandas
tags:
- Python
- Pandas
toc: true
toc_sticky: true
toc_label: 목차
description: Web Scraping Automation with Selenium and Pandas
article_tag1: Pandas
article_tag2: Selenium  
article_tag3: crawling
article_section: Pandas
meta_keywords: Pandas, selenium, crawling
last_modified_at: '2023-09-23 21:00:00 +0800'
---

# Selenium 및 Pandas를 사용한 웹 스크래핑 자동화

Selenium으로 웹에서 데이터를 수집하고 Pandas로 데이터를 가공하는 방법을 알아본다.

* 순서 : 웹 페이지 접속 -> 데이터 수집 -> 데이터 가공 -> 데이터 저장

    * 데이터 수집 : 서울 전체 매장 목록

    * 데이터 가공 : 매장명, 위도, 경도, 매장타입, 주소, 전화번호

    * 데이터 저장 : 엑셀 파일

    * 데이터 분석 : 지도 시각화(추가)

* 사용 도구 : Selenium, Pandas, BeautifulSoup, ChromeDriver

* 데이터 출처 : 스타벅스 매장 찾기 https://www.starbucks.co.kr/store/store_map.do?disp=locale




## 02-1 크롤링으로 스타벅스 매장 목록 데이터 수집하기(생성)

### 라이브러리 설치
```py
import time
import pandas as pd
import openpyxl
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service   
```

### Service() : 크롬 드라이버를 위한 서비스 객체를 생성한다.
options.add_experimental_option("detach", True)# 크롬 브라우저 종료 방지
크롬 드라이버는 온라인으로 다운받게된다.
```py
service = Service()
options = webdriver.ChromeOptions()
driver = webdriver.Chrome(service=service, options=options) 
```

### 스타벅스 매장 목록 페이지 접속하기
```py
url = "https://www.starbucks.co.kr/store/store_map.do?disp=locale"
driver.get(url)
```   

매장 목록을 가져오는 태그. 브라우저 개발자도구에서 CSS Selector로 가져온다.
```py
seoul_btn = "#container > div > form > fieldset > div > section > article.find_store_cont > article > article:nth-child(4) > div.loca_step1 > div.loca_step1_cont > ul > li:nth-child(1) > a"

#wait and click
#WebDriverWait : 해당 태그가 나올 때까지 기다린다. 
#형식 WebDriverWait(크롬 드라이버, 기다릴 시간).until(EC.조건)
WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.CSS_SELECTOR, seoul_btn))).click()

#서울 전체 목록 조회 버튼 클릭
select_all_btn = "#mCSB_2_container > ul > li:nth-child(1) > a"
WebDriverWait(driver, 20).until(EC.element_to_be_clickable((By.CSS_SELECTOR, select_all_btn))).click()

time.sleep(5)#페이지가 로딩되는 시간을 기다려야 한다.
```

# BeautifulSoup으로 HTML 파서 만들기

BeautifulSoup는 HTML과 XML 파일로부터 데이터를 뽑아내기 위한 파이썬 라이브러리이다.위에서 가져온 HTML 전체 소스코드를 가져온 뒤 원하는 태그를 찾아서 가져올 수 있다.

> BeautifulSoup(HTML 소스코드, 파싱할 파서)

```py
html = driver.page_source # 현재 페이지의 html 소스 가져오기
soup = BeautifulSoup(html, 'html.parser') # html 소스를 html.parser로 파싱하기
#print(soup.prettify()) # html 소스를 보기 좋게 출력하기
starbucks_soup_list = soup.select("li.quickResultLstCon") # select()로 찾은 태그는 리스트 형태로 반환된다.
#print('starbucks_soup_list 0 : ', starbucks_soup_list[1])

#해당 페이지에 태그 요소가 없으면 빈 리스트를 반환한다.
if len(starbucks_soup_list) > 0:
    print('starbucks_soup_list 0:', starbucks_soup_list[0].prettify())
else:
    print('No element at index 1 in starbucks_soup_list')

#가져온 태그
'''
<li class="quickResultLstCon" data-code="3762" data-hlytag="null" data-index="0" data-lat="37.501087" data-long="127.043069" data-name="역삼아레나빌딩" data-storecd="1509" style="background:#fff">
 <strong data-my_siren_order_store_yn="N" data-name="역삼아레나빌딩" data-store="1509" data-yn="N">
  역삼아레나빌딩
 </strong>
 <p class="result_details">
  서울특별시 강남구 언주로 425 (역삼동)
  <br/>
  1522-3232
 </p>
 <i class="pin_general">
  리저브 매장 2번
 </i>
</li>
'''

#매장 정보 샘플 확인
#위 Element에서 원하는 정보를 추출한다.
starbucks_store = starbucks_soup_list[0]
# select : 해당 태그를 모두 찾는다.
# strip() : 공백 제거. 왜 공백을 제거 하는가? 공백이 있으면 데이터를 가공할 때 문제가 생길 수 있다.
name = starbucks_store.select('strong')[0].text.strip() #매장명
lat = starbucks_store['data-lat'].strip() #위도
lng = starbucks_store['data-long'].strip() #경도
print("lng:", lng, "lat:", lat, "name:", name) # lng: 127.043069 lat: 37.501087 name: 역삼아레나빌딩
print("=========================================")


#store_type = starbucks_store.select('i')[0].text.strip() #매장 타입 #strip() : 공백 제거
store_type = starbucks_store.select('i')[0]['class'][0] #매장 타입
#address = starbucks_store.select('p.result_details')[0].text.strip() #매장 주소
#address =  str(starbucks_store.select('p.result_details')[0]).split('<br/>')[0].split('>')[1] # 주소
add_tel = str(starbucks_store.select('p.result_details')[0]).split('<br/>')
#tel = starbucks_store.select('p.result_details')[0].text.split('<br/>') #매장 전화번호 
#split() : 문자열을 나누어 리스트로 만든다. split('<br/>') : <br/>을 기준으로 나눈다.
#tel =  str(starbucks_store.select('p.result_details')[0]).split('<br/>')[1].split('<')[0] # 전화번호
address = add_tel[0].split('>')[1] # 주소
tel = add_tel[1].split('<')[0] # 주소
print("store_type:", store_type, "address:", address, "tel:", tel) 

#수정 전
#store_type: 리저브 매장 2번 address: 서울특별시 강남구 언주로 425 (역삼동)1522-3232 tel: ['서울특별시 강남구 언주로 425 (역삼동)1522-3232']
#수정 후
#store_type: 리저브 매장 2번 address: 서울특별시 강남구 언주로 425 (역삼동) tel: 1522-3232
print("=========================================")
```

### 매장 목록 데이터 만들기

```py
starbucks_list = []
for starbucks_store in starbucks_soup_list:
    name = starbucks_store.select('strong')[0].text.strip() #매장명
    lat = starbucks_store['data-lat'].strip() #위도
    lng = starbucks_store['data-long'].strip() #경도
    #store_type = starbucks_store.select('i')[0].text.strip() #매장 타입
    #class 이름 가져오기    
    store_type = starbucks_store.select('i')[0]['class'][0]
    #address =  str(starbucks_store.select('p.result_details')[0]).split('<br/>')[0].split('>')[1] # 주소
    #tel =  str(starbucks_store.select('p.result_details')[0]).split('<br/>')[1].split('<')[0] # 전화번호
    add_tel = str(starbucks_store.select('p.result_details')[0]).split('<br/>')
    address = add_tel[0].split('>')[1] # 주소
    tel = add_tel[1].split('<')[0] # 전화번호
    starbucks_list.append([name, lat, lng, store_type, address, tel])    

print('starbucks_list :: ', starbucks_list)
print("=========================================")
```

### pandas 데이터프레임으로 변환
pandas는 데이터 분석을 위한 파이썬 라이브러리이다.
pandas의 데이터프레임은 2차원 배열 형태의 테이블을 만들 수 있다.
위에서 가져온 데이터를 데이터프레임으로 변환한다.

```py
columns = ['매장명', '위도', '경도', '매장타입', '주소', '전화번호']
seoul_starbucks_df = pd.DataFrame(starbucks_list, columns=columns)
print('count :: ', seoul_starbucks_df.shape) # (528, 6)
print('dataframe :: ', seoul_starbucks_df.head())
```

- 출력 내용
```
count ::  (603, 6)
          매장명          위도         경도        매장타입                            주소            전화번호
0  역삼아레나빌딩     37.501087   127.043069  리저브 매장 2번     서울특별시 강남구 언주로 425 (역삼동)  1522-3232
1   논현역사거리      37.510178   127.022223  리저브 매장 2번    서울특별시 강남구 강남대로 538 (논현동)  1522-3232
2  신사역성일빌딩     37.5139309  127.0206057  리저브 매장 2번    서울특별시 강남구 강남대로 584 (논현동)  1522-3232
3   국기원사거리      37.499517   127.031495  리저브 매장 2번    서울특별시 강남구 테헤란로 125 (역삼동)  1522-3232
4  대치재경빌딩R      37.494668   127.062583  리저브 매장 2번  서울특별시 강남구 남부순환로 2947 (대치동)  1522-3232
```

```py
print("info :: ", seoul_starbucks_df.info())
```

- 출력 내용
```
Data columns (total 6 columns):
 #   Column  Non-Null Count  Dtype
---  ------  --------------  -----
 0   매장명     603 non-null    object
 1   위도      603 non-null    object
 2   경도      603 non-null    object
 3   매장타입    603 non-null    object
 4   주소      603 non-null    object
 5   전화번호    603 non-null    object
dtypes: object(6)
memory usage: 28.4+ KB
info ::  None
```

### 엑셀 파일로 저장한다.
```py
seoul_starbucks_df.to_excel('./data_output/seoul_starbucks.xlsx', index=False)
```