---
title: Python - Selenium (1) - Controlling the web browser (forward, back, refresh, exit)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Selenium
toc: true
toc_sticky: true
toc_label: 목차
description: Python - Selenium(WebDriver)
article_tag1: selenium
article_tag2: webdriver  
article_tag3: crawling
article_section: crawling
meta_keywords: selenium, webdriver, crawling, python
last_modified_at: '2023-09-14 21:00:00 +0800'
---

# selenium 으로 웹 브라우저 제어하기(앞으로가기, 뒤로가기, 새로고침, 종료)
selenium 은 웹 브라우저를 제어하는 프레임워크
아래 코드는 크롬 브라우저를 실행하고, 네이버 홈페이지를 요청하는 코드이다.

브라우저의 뒤로가기, 앞으로가기, 새로고침, 탭 종료 등을 할 수 있다.

> pip install selenium

> pip install webdriver-manager

```py
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
import time

url = "https://www.naver.com/"

service = Service() # Selenium 4부터는 Service 객체를 생성해야 함  
options = webdriver.ChromeOptions() # ChromeOptions : 크롬 브라우저의 설정을 위한 객체
driver = webdriver.Chrome(service=service, options=options) # Chrome() : 크롬 브라우저를 실행하기 위한 객체
# serivce : 크롬 드라이버를 실행하기 위한 객체, options : 크롬 브라우저의 설정을 위한 객체

delay = 3
driver.get(url)

driver.back() # 뒤로가기
time.sleep(1)

driver.forward() # 앞으로가기
time.sleep(1)

driver.refresh() # 새로고침
time.sleep(1)

driver.close() # 현재 열려있는 탭만 종료
time.sleep(1)
```