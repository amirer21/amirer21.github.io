---
title: Pandas - 시각화(visualization) 지도 그리기(folium)
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
description: Pandas - 시각화(visualization) 지도 그리기
article_tag1: Pandas
article_tag2: matplotlib  
article_tag3: folium
article_section: Pandas
meta_keywords: Pandas, matplotlib, folium
last_modified_at: '2023-09-07 21:00:00 +0800'
---

# Pandas 시각화 - 지도 그리기(folium)
folium은 python에서 제공하는 지도를 다루는 패키지이다. 여기에 나오는 지도는 구글 에서 불어오는 지도이다. 이것을 사용하여 지도를 생성하고 Marker를 추가하여 시각화하거나 원등의 작업을 할 수 있다. 엑셀 파일을 읽어서 지도에 편집하고 HTML 파일로 만드는 과정을 알아본다. 

### 순서 

1. 엑셀 파일에서 위도, 경도 데이터를 읽는다.불러온 엑셀 파일의 첫번째 열은 대학교 이름, 두번째 열은 위도, 세번째 열은 경도 데이터이다.

2. 지도에 마커를 표시한다. 

3. 데이터는 html 파일로 저장하여 웹 브라우저에서 지도를 확인한다.


### 필요한 모듈

- python pip
> pip install folium

- ananconda prompt에서 설치하려면 아래 명령어를 입력
> conda install -c conda-forge folium

## 지도1. 지도 불러오기
```py
import warnings
import pandas as pd
#MatPlotLib
import matplotlib.pyplot as plt
from matplotlib import font_manager, rc
import plotly.express as px
import seaborn as sns
from folium.map import Popup
import folium


seoul_map = folium.Map(location=[37.55, 126.98], zoom_start=12) #지도 객체 생성
seoul_map.save('./output_file/seoul.html') #지도 객체를 html 파일로 저장
```
![img](/assets/images/pandas/ex07_map01.png "pandas")

## 지도2. 지도 불러오기
```py
seoul_map2 = folium.Map(location=[37.55, 126.98], tiles='Stamen Terrain', zoom_start=12) #지도 객체 생성
seoul_map2.save('./output_file/seoul2.html') #지도 객체를 html 파일로 저장
```
![img](/assets/images/pandas/ex07_map02.png "pandas")

--------------------

## 지도3. 지도 불러오기
```py
seoul_map3 = folium.Map(location=[37.55, 126.98], tiles='Stamen Toner', zoom_start=15) #지도 객체 생성
seoul_map3.save('./output_file/seoul3.html') #지도 객체를 html 파일로 저장
```
![img](/assets/images/pandas/ex07_map03.png "pandas")

--------------
## 지도4. 지도 불러오기
```py
pf =pd.read_excel('./Data_full/서울지역_대학교_위치.xlsx') #위도와 경도 데이터를 가진 엑셀 파일
seoul_map4 = folium.Map(location=[37.55, 126.98], tiles='Stamen Terrain', zoom_start=12) #지도 객체 생성
seoul_map4.save('./output_file/seoul4.html') #지도 객체를 html 파일로 저장
```
![img](/assets/images/pandas/ex07_map04.png "pandas")

## 지도5. 지도에 마커 표시하기
> 형식 zip(엑셀 열 순서대로) : zip(pf['Unnamed: 0'], pf['위도'], pf['경도']. 

만약 엑셀 첫번째 열이름이 "이름"이면, 
> zip(pf['이름'], pf['위도'], pf['경도'])

반복문으로 엑셀 컬럼의 값들을 읽어온다.
> for name, lat, lng in zip(pf['Unnamed: 0'], pf['위도'], pf['경도']): 

```py
for name, lat, lng in zip(pf['이름'], pf['위도'], pf['경도']): #name: 대학교 이름, lat: 위도, lng: 경도, zip: 같은 길이의 리스트를 같은 인덱스끼리 잘라서 리스트로 반환
    folium.Marker([lat, lng], popup=name).add_to(seoul_map4)   #Marker : 지도에 마커를 표시하는 함수, add_to(지도객체) : 지도에 마커를 추가하는 함수
seoul_map4.save('./output_file/seoul4.html') #지도 객체를 html 파일로 저장

print("pf :: ", pf)
```
![img](/assets/images/pandas/ex07_map04.png "pandas")

------------

## 지도6. 지도에 마커 표시하고, 이름을 팝업으로 표시하기(팝업설정)

```py
pf =pd.read_excel('./Data_full/서울지역_대학교_위치.xlsx') #위도와 경도 데이터를 가진 엑셀 파일
seoul_map5 = folium.Map(location=[37.55, 126.98], tiles='Stamen Terrain', zoom_start=12) #지도 객체 생성
for name, lat, lng in zip(pf['이름'], pf['위도'], pf['경도']): #name: 대학교 이름, lat: 위도, lng: 경도, zip: 같은 길이의 리스트를 같은 인덱스끼리 잘라서 리스트로 반환
    iframe = folium.IFrame(name, width=200, height=50) #IFrame : html 태그를 지원하는 함수, width, height : 크기
    popup = folium.Popup(iframe, max_width=600) #Popup : 마커를 클릭했을 때 나오는 팝업창
    folium.Marker([lat, lng], popup=popup).add_to(seoul_map5)   #Marker : 지도에 마커를 표시하는 함수, add_to(지도객체) : 지도에 마커를 추가하는 함수
    
seoul_map5.save('./output_file/seoul5.html') #지도 객체를 html 파일로 저장
```
![img](/assets/images/pandas/ex07_map05.png "pandas")
