---
title: 파이썬(Pandas, Folium) - 데이터 수집하여 지도에 표시하기 (시각화) (2)
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

## Pandas, 데이터 시각화 - 지도에 표시하기 (2)
- Transforming Data into Meaningful Maps. A Hands-On Tutorial with Python(Pandas, Folium)
데이터를 수집하고 분석한 후에는 데이터를 시각화하는 내용을 다룬다. 데이터 시각화는 데이터를 이해하는데 도움이 되며, 데이터 분석 결과를 다른 사람에게 효과적으로 전달할 수 있다. **pandas**와 **folium**을 사용하여 다음과 같이 지도에 표시해 볼 것이다.

- 지도 종류
  - 서울시 시군구 경계 지도 그리기
  - 서울시 시군수별 스타벅스 평균 매장 수 계산
  - 서울시 시군구별 스타벅스 매장 수를 버블 지도로 표시하기
  - 서울시 시군구별 스타벅스 매장 수를 단계구분도로 시각화

- 순서 
  - (1) 지도 데이터 읽어오기(서울시 행정 경계 지도 데이터)
  - (2) 지도 데이터 불러오기(서울시 행정 경계 지도 데이터)
  - (3) 기본 지도 만들기
  - (4) 데이터에 따라 지도에 표시하기, 다양한 지도 종류 활용



### 모듈 불러오기
```py
import pandas as pd
import folium
import json
```

## 기본 데이터 불러오기
### 서울시 시군구 행정 경계 지도 데이터 읽어오기

```py
seoul_sgg_stat = pd.read_excel('./data_output/seoul_sgg_stat.xlsx')
print("seoul_sgg_stat :: ", seoul_sgg_stat.head())
print("=============================================")
```

### 서울시 시군구 행정 경계 지도 데이터 불러오기
이 json 파일은 서울시 행정 경계 지도 데이터를 GeoJSON 포맷으로 변환한 파일이다.
GeoJSON은 지리 정보를 표현하기 위한 국제 표준 포맷이다.

```py
seoul_geojson_file_path = './api_files/seoul_sgg.geojson' #지도데이터 국제 표준
seoul_geo_str = json.load(open(seoul_geojson_file_path, encoding='utf-8'))
print("type :: ", type(seoul_geo_str)) #<class 'dict'>
#print("seoul_geo_str :: ", seoul_geo_str)
print("=============================================")

properties = seoul_geo_str['features'][0]['properties']
print("properties :: ", properties)
print("=============================================")
#properties ::  {'SIG_CD': '11320', 'SIG_KOR_NM': '도봉구', 'SIG_ENG_NM': 'Dobong-gu', 'ESRI_PK': 0, 'SHAPE_AREA': 0.00210990544544, 'SHAPE_LEN': 0.239901251347}
```

## 기본 지도 만들기
```py
starbucks_bubble = folium.Map(location=[37.573050, 126.979189], tiles ='CartoDB dark_matter',  zoom_start=11)
print("starbucks_bubble :: ", starbucks_bubble)
starbucks_bubble.save('./data_output/starbucks_bubble_0.html')
print("=============================================")
```

- 지도
![img](/assets/images/pandas_starbucks/pandas_visual_04.png "pandas")


## 서울시 시군구 경계 지도 그리기

지도의 경계면을 표시하는 스타일을 지정하는 함수이다.
jeojson 포맷의 지도 데이터를 지도에 표시할 때 스타일을 지정하는 함수

```py
def style_fuction(feature):
  return {
    'opacity': 0.7, #투명도
    'weight': 1, #경계면 두께
    'color': 'white', #경계면 색상
    'fillOpacity': 0, #경계면 채우기 색상
    'dashArray': '5, 5' #경계면 대시(점선) 표시
  }
```

### folium.GeoJson() 함수는 GeoJSON 포맷의 지도 데이터를 지도에 표시하는 함수이다.

매개변수로 지도 데이터와 스타일 함수를 지정한다.
지도 데이터는 위의 json.load() 함수로 읽어온 서울시 시군구 경계 지도 데이터이다.
name은 지도에 표시할 때 사용할 이름이다.

```py
folium.GeoJson(
    seoul_geo_str,
    name='seoul_sgg'
).add_to(starbucks_bubble)

print("starbucks_bubble :: ", starbucks_bubble)
starbucks_bubble.save('./data_output/starbucks_bubble.html')
print("=============================================")
```

- 지도
![img](/assets/images/pandas_starbucks/pandas_visual_05.png "pandas")

### 서울시 시군수별 스타벅스 평균 매장 수 계산
mean() 함수는 평균을 계산하는 함수이다.

```py
starbucks_mean = seoul_sgg_stat['스타벅스_매장수'].mean()
print("starbucks_mean :: ", starbucks_mean) # 16.5
print("=============================================")
```
## 서울시 시군구별 스타벅스 매장 수를 버블 지도로 표시하기

loc() 함수는 행과 열을 지정하여 데이터를 추출하는 함수이다.
반복문으로 seoul_sgg_stat 데이터프레임의 행을 하나씩 읽어오면서 지도에 표시한다.
그리고 위도, 경도, 스타벅스 매장 수를 지정한다.

```py
for idx in seoul_sgg_stat.index:
  lat = seoul_sgg_stat.loc[idx, '위도']
  lng = seoul_sgg_stat.loc[idx, '경도']
  cnt = seoul_sgg_stat.loc[idx, '스타벅스_매장수']
  
  #스타벅스 매장 수에 따라 원의 크기를 다르게 표시하기
  if cnt > starbucks_mean:
    fillColor = 'red'
  else:
    fillColor = 'blue'
    
  folium.CircleMarker(
      location=[lat, lng],
      fill=True,
      fill_color=fillColor,
      fill_opacity=0.7,
      color='#FFFF00',
      weight=1,
      radius=cnt/2
  ).add_to(starbucks_bubble)
  
print("starbucks_bubble :: ", starbucks_bubble)
starbucks_bubble.save('./data_output/starbucks_bubble_sgg.html')
print("=============================================")
```

- 지도
![img](/assets/images/pandas_starbucks/pandas_visual_06.png "pandas")

## 서울시 시군구별 스타벅스 매장 수를 단계구분도로 시각화
```py
sgg_geojson_file_path = './api_files/seoul_sgg.geojson'
seoul_sgg_geo_2 = json.load(open(sgg_geojson_file_path, encoding='utf-8'))
starbucks_choropleth = folium.Map(location=[37.573050, 126.979189], zoom_start=11)
```

### folium.Choropleth() 함수는 단계구분도를 표시하는 함수이다.
단계구분도는 지도의 특정 지역에 색상을 다르게 표시하는 방법이다.
매개변수로 지도 데이터, 데이터, 데이터의 열 이름, 색상, 키, 투명도, 선의 투명도를 지정한다.

```py
folium.Choropleth(
    geo_data=seoul_sgg_geo_2,
    data=seoul_sgg_stat,
    columns=['시군구명', '스타벅스_매장수'],
    fill_color='YlGnBu',
    key_on='feature.properties.SIG_KOR_NM',
    file_opactiy=0.7,
    line_opactiy=0.5,
).add_to(starbucks_choropleth)

print("starbucks_choropleth :: ", starbucks_choropleth)
starbucks_choropleth.save('./data_output/starbucks_choropleth.html')
print("=============================================")
```

- 지도
![img](/assets/images/pandas_starbucks/pandas_visual_07.png "pandas")
