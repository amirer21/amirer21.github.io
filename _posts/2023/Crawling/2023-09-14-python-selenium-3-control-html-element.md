---
title: Python - Selenium (3) - Control html element
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
description: Python - Selenium (control html element)
article_tag1: selenium
article_tag2: element  
article_tag3: crawling
article_section: crawling
meta_keywords: selenium, element, crawling, python
last_modified_at: '2023-09-14 21:00:00 +0800'
---

# 파이썬 selenium 으로 웹 페이지에서 HTML 태그 가져오기
Selenium의 Serivce 클래스와 Chrome 에 대해 간단한 예제를 통해 알아본다. 다음 예제는 selenium을 사용하여 네이버 로그인을 하는 예제이다.

## Selenium Servic 구조

service의 구조는 selenium.webdriver.chrome.service.Service 클래스를 참고


## 모듈 다운로드

>  pip install selenium

>  pip install webdriver-manager


> https://www.selenium.dev/selenium/docs/api/py/webdriver_chrome/selenium.webdriver.chrome.service.html

- executable_path는 이 클래스의 생성자의 인자로 들어가는데, 이는 chromedriver의 경로를 의미함

## 예제 코드

```py
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By


service = Service()
options = webdriver.ChromeOptions() # ChromeOptions : 크롬 브라우저의 설정을 위한 객체
driver = webdriver.Chrome(service=service, options=options) # Chrome() : 크롬 브라우저를 실행하기 위한 객체
# serivce : 크롬 드라이버를 실행하기 위한 객체, options : 크롬 브라우저의 설정을 위한 객체

## 크롬 브라우저 get()으로 URL 요청
## 아래 코드는 크롬 브라우저를 실행하고, 네이버 홈페이지를 요청하는 코드이다.
## 아이디와 비밀번호를 입력하고 로그인 버튼을 클릭하는 코드를 추가하면된다.
URL = "https://www.naver.com/"
try:
    driver.get(URL)
    element = driver.find_element(By.CLASS_NAME, "MyView-module__link_login__HpHMW")
    element.click()    
    #id, pass 입력
    element = driver.find_element(By.ID, "id").send_keys("본인 아이디")
    element = driver.find_element(By.ID, "pw").send_keys("본인 비밀번호")    
    driver.find_element(By.ID, "log.login").click()
    print(driver.page_source)
except Exception as e:
    print(e)
```