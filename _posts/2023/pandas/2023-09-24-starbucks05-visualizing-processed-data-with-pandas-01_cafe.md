---
title: 파이썬(Pandas, Folium) - 데이터 수집하여 지도에 표시하기 (시각화) (1)
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
- Folium
toc: true
toc_sticky: true
toc_label: 목차
description: 파이썬(Pandas, Folium) - 데이터 수집하여 지도에 표시하기 (시각화)
article_tag1: Pandas
article_tag2: merge
article_tag3: python
article_section: Pandas
meta_keywords: Pandas, merge, python
last_modified_at: '2023-09-23 21:00:00 +0800'
---

## Pandas, 데이터 시각화 - 지도에 표시하기 (1)

- Transforming Data into Meaningful Maps. A Hands-On Tutorial with Python(Pandas, Folium)

데이터를 수집하고 분석한 후에는 데이터를 시각화하는 내용을 다룬다. **pandas**와 **folium**을 사용하여 스타벅스 매장 분포를 지도에 표시한다.

- 순서 
  - (1) 스타벅스 매장 목록 데이터 읽기(.xlsx 엑셀 파일)
  - (2) 스타벅스 매장 목록 데이터를 csv 파일로 저장하기
  - (3) 지도 베이스 만들기
  - (4) 지도에 데이터 매핑하기

**스타벅스 매장 위치**를 나타내는 서클 마커 그리기와

스타벅스 **매장 타입별** 위치 서클 마커 그리기(리저브 매장, 일반 매장, 드라이브 스루)를 해볼 것이다.



### 필요한 모듈 불러오기

```py
import pandas as pd
import folium
import json
```

### 데이터 가져오기

seoul_starbucks_list.xlsx 은 이전에 스타벅스 웹사이트에서 수집한 데이터로 만든 엑셀 파일이다. 다시 csv로 저장한 이유는 엑셀 파일을 읽어서 지도에 표시하는 것보다 csv 파일을 읽어서 지도에 표시하는 것이 더 빠르기 때문이다.

```py
seoul_starbucks = pd.read_excel('./data_output/seoul_starbucks_list.xlsx')
pd.set_option('display.max_columns', 10)                  # 출력할 최대 열의 개수
pd.set_option('display.max_colwidth', 20)                 # 출력할 열의 너비
pd.set_option('display.unicode.east_asian_width', True)   # 유니코드 사용 너비 조정
print("starbucks 데이터 :: ", seoul_starbucks.head())
#save to csv
seoul_starbucks.to_csv('./data_output/seoul_starbucks_list.csv', encoding='utf-8-sig', index=False)
print("=============================================")
```

- 출력 내용

```
starbucks 데이터 :: 
          매장명       위도        경도     매장타입                            주소         전화번호 시군구명
0  역삼아레나빌딩  37.501087  127.043069  pin_general     서울특별시 강남구 언주로 42...    1522-3232   강남구
1    논현역사거리  37.510178  127.022223  pin_general     서울특별시 강남구 강남대로 5...   1522-3232   강남구
2  신사역성일빌딩  37.513931  127.020606  pin_general     서울특별시 강남구 강남대로 5...   1522-3232   강남구
3    국기원사거리  37.499517  127.031495  pin_general     서울특별시 강남구 테헤란로 1...   1522-3232   강남구
4   대치재경빌딩R  37.494668  127.062583  pin_reserve     서울특별시 강남구 남부순환로 ...  1522-3232   강남구  
```

## 지도 베이스 만들기

서울시 중심에 스타벅스 매장을 표시하기 위해 서울시의 중심 좌표를 구한다.
38.0, 127.0은 서울시의 중심 좌표이다.

```py
starbucks_map = folium.Map(location=[37.573050, 126.979189], zoom_start=11)
print("starbucks_map :: ", starbucks_map)
starbucks_map.save('./data_output/starbucks_map.html')
print("=============================================")
```

- 서울 지도이다.

![img](/assets/images/pandas_starbucks/pandas_visual_01.png "pandas")

## 스타벅스 매장 위치를 나타내는 서클 마커 그리기

seoul_starbucks_list.csv 파일을 읽어서 지도에 표시한다.
seoul_starbucks의 index를 사용해서 스타벅스 매장 위치를 지도에 표시한다.

### 위도, 경도를 사용해서 지도에 표시한다.

```py
for idx in seoul_starbucks.index:
  lat = seoul_starbucks.loc[idx, '위도']
  lng = seoul_starbucks.loc[idx, '경도']
  
  folium.CircleMarker(
      location=[lat, lng],
      fill=True,
      fill_color='green',
      fill_opacity=1,
      color='yellow',
      weight=1,
      radius=3
  ).add_to(starbucks_map)
  
print("starbucks_map :: ", starbucks_map)
starbucks_map.save('./data_output/starbucks_map_circle.html')
print("=============================================")
```

- 스타벅스의 매장 위치 지도

![img](/assets/images/pandas_starbucks/pandas_visual_02.png "pandas")


## 스타벅스 매장 타입별 위치 서클 마커 그리기

```py
unique = seoul_starbucks['매장타입'].unique() # 중복 제거
print("unique :: ", unique) # ['리저브 매장 2번']
cnt = seoul_starbucks['매장타입'].value_counts() # 중복 제거 후 갯수
print("cnt :: ", cnt) # 리저브 매장 2번    510
print("=============================================")
starbucks_map2 = folium.Map(location=[37.573050, 126.979189], zoom_start=11)
```
### 종류별로 마커 색상 다르게 표시하기

스타벅스 매장 종류 : general(일반매장), reserve(리저브 매장), generalDT(일반 매장 + 드라이브 스루)

```py
for idx in seoul_starbucks.index:
  lat = seoul_starbucks.loc[idx, '위도']
  lng = seoul_starbucks.loc[idx, '경도']
  store_type = seoul_starbucks.loc[idx, '매장타입']
  fillcolor = ''
  size = 0
  if store_type == 'pin_general': # 일반 매장
    fillcolor = 'gray'
    size = 1
  elif store_type == 'pin_reserve':# 리저브 매장
    fillcolor = 'green'
    size = 5
  elif store_type == 'pin_generalDT':# 일반 매장 + 드라이브 스루
    fillcolor = 'red'
    size = 5
  elif store_type == 'pin_generalWT':# 일반 매장 + 워크 스루
    fillcolor = 'blue'
    size = 5
    
  folium.CircleMarker(
      location=[lat, lng],
      color=fillcolor,
      fill=True,
      fill_color=fillcolor,
      fill_opacity=1,
      weight=1,
      radius=size
  ).add_to(starbucks_map2)
  
print("starbucks_map2 :: ", starbucks_map2)
starbucks_map2.save('./data_output/starbucks_map_circle2.html')
print("=============================================")
```

- 매장 타입별 구분 표시

![img](/assets/images/pandas_starbucks/pandas_visual_03.png "pandas")