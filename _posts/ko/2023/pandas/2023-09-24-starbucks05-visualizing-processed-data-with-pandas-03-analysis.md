---
title: 파이썬(Pandas, Folium) - 데이터 수집하여 지도에 표시하기 (시각화) (3)
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

# Pandas, 데이터 시각화 - 지도에 표시하기 (3)
- Transforming Data into Meaningful Maps. A Hands-On Tutorial with Python(Pandas, Folium)

파이썬의 pandas, folium, json 라이브러리를 사용하여, 지도에 시각화해보자.
pandas는 데이터를 다루는 데에 특화된 라이브러리이다. pandas를 사용하여 데이터를 불러오고, 데이터를 다루고, 데이터를 시각화할 것이다. folium은 지도를 다루는 데에 특화된 라이브러리이다. folium을 사용하여 지도를 불러오고, 지도에 데이터를 매핑할 것이다. 

스타벅스 매장 수와 서울시 시군구별 주민등록인구수, 사업체 종사자수를 지도에 시각화해보자.
어떤 지역에 스타벅스 매장이 많이 입지해 있는지, 어떤 지역에 스타벅스 매장이 적게 입지해 있는지 알아보고자한다.


- 순서
  - 1. 지도 베이스 만들기 -> 2. 지도에 데이터 매핑하기

- folium 함수 설명
  - folium.Map : 지도 베이스 만들기
  - folium.GeoJson : 지도에 데이터를 매핑하는 함수
  - folium.Choropleth : 단계구분도를 만드는 함수. 단계구분도는 지도에 색상을 입히는 방식으로 데이터를 시각화하는 방법이다.
  - folium.CircleMarker : 원형 마커를 만드는 함수. 원형마커는 지도에 원형으로 데이터를 시각화하는 방법이다.

```py
import pandas as pd
import folium
import json

# 지도 베이스 만들기
#서울시 시군구 행정 경계 지도 데이터 읽어오기
seoul_sgg_stat = pd.read_excel('./data_output/seoul_sgg_stat.xlsx')
pd.set_option('display.max_columns', 10)                  # 출력할 최대 열의 개수
pd.set_option('display.max_colwidth', 20)                 # 출력할 열의 너비
pd.set_option('display.unicode.east_asian_width', True)   # 유니코드 사용 너비 조정
print("seoul_sgg_stat :: ", seoul_sgg_stat.head())
print("=============================================")
```

- 출력 결과
```
seoul_sgg_stat ::     시군구코드  시군구명       위도        경도  스타벅스_매장수  주민등록인구  \
0       11320    도봉구  37.665861  127.031767                6        312858
1       11380    은평구  37.617612  126.922700               13        468766
2       11230  동대문구  37.583801  127.050700               10        354884
3       11590    동작구  37.496504  126.944307               11        390377
4       11545    금천구  37.460097  126.900155               12        242467

   종사자수  사업체수
0     79097     25391
1    109031     36509
2    146383     42813
3    109281     27915
4    255449     47964
```

### 서울시 시군구 행정 경계 지도 데이터 불러오기
```py
seoul_geojson_file_path = './api_files/seoul_sgg.geojson' #지도데이터 국제 표준
seoul_sgg_geo_2 = json.load(open(seoul_geojson_file_path, encoding='utf-8'))
print("type :: ", type(seoul_sgg_geo_2)) #<class 'dict'>
print("=============================================")
```

### 서울시 시군구별 주민등록인구수 단계구분도 지도 시각화
- Map : 지도 베이스 만들기
- location : 지도 초기 화면의 중심 좌표
- tiles : 지도 스타일
- zoom_start : 지도 초기 화면의 확대 정도

```py
starbucks_choropleth = folium.Map(
    location=[37.573050, 126.979189],
    tiles='CartoDB dark_matter',
    zoom_start=11
)
```

### Choropleth() : 단계구분도를 만드는 함수

- geo_data : 지도 데이터. json 파일을 읽어온 변수. 이 파일에는 위도, 경도 데이터가 들어있다.
- data : 시각화할 데이터. 스타벅스의 매장 위치(위도, 경도) 데이터가 들어있다.
- columns : 컬럼 이름. 시각화할 데이터의 컬럼 이름을 지정한다.

```py
folium.Choropleth(
    geo_data=seoul_sgg_geo_2,
    data=seoul_sgg_stat,
    columns=['시군구명', '주민등록인구'],
    fill_color = 'YlGn',
    fill_opacity=0.7,
    line_opacity=0.5,
    key_on='properties.SIG_KOR_NM'
    ).add_to(starbucks_choropleth)

starbucks_choropleth.save('./data_output/crawling_07_01_basemap.html')
```

- 지도

![img](/assets/images/pandas_starbucks/starbucks_pandas_visual_1.png "pandas")



## 인구 만 명당 스타벅스 매장 수 칼럼 추가

> 공식은 다음과 같다. 만 명당 스타벅스 매장 수 = 스타벅스 매장 수 / (주민등록인구 / 10000)

```py
seoul_sgg_stat['만명당_매장수'] = seoul_sgg_stat['스타벅스_매장수']/ \
                    (seoul_sgg_stat['주민등록인구']/10000)
                    
print("만 명당 스타벅스 매장 수 칼럼 추가 :: ", seoul_sgg_stat.head())
```

- 출력 결과

```
만 명당 스타벅스 매장 수 칼럼 추가 ::     
   시군구코드  시군구명        위도       경도  스타벅스_매장수 주민등록인구   종사자수 사업체수   만명당_매장수
0      11320    도봉구  37.665861  127.031767         6          312858      79097  25391        0.191780
1      11380    은평구  37.617612  126.922700        13          468766     109031  36509        0.277324
2      11230  동대문구  37.583801  127.050700        10          354884     146383  42813        0.281782
3      11590    동작구  37.496504  126.944307        11          390377     109281  27915        0.281779
4       11545   금천구  37.460097  126.900155        12          242467     255449  47964        0.494913
```


## 인구 만 명당 스타벅스 매장 수 지도 시각화


### 지도 베이스 만들기 시작

- 코드

```py
SGG_GEOJSON_FILE_PATH = './api_files/seoul_sgg.geojson'
seoul_sgg_geo_1 = json.load(open(SGG_GEOJSON_FILE_PATH, encoding='utf-8'))
viz_map_1 = folium.Map(
    location=[37.573050, 126.979189],
    tiles='CartoDB dark_matter',
    zoom_start=11
)
```

### 서울시 시군구 경계 지도 그리기

- 코드

```py
def style_function(feature):
    return {
        'opacity': 0.7,
        'weight': 1,
        'fillOpacity':0,
    }
    
# 서울시 시군구 경계 지도 그리기
folium.GeoJson(
    seoul_sgg_geo_2,
    style_function=style_function,
).add_to(viz_map_1)
viz_map_1.save('./data_output/crawling_07_02_basemap.html')
```

- 지도
![img](/assets/images/pandas_starbucks/starbucks_pandas_visual_2.png "pandas")


### 만명당 매장수 기준 상위 10% 추출 값

- 코드

```py
top = seoul_sgg_stat ['만명당_매장수'].quantile(0.9) #quantile() : 분위수를 구하는 함수. 0.9는 90%를 의미한다. 

for idx in seoul_sgg_stat.index:
    lat = seoul_sgg_stat.loc[idx, '위도']
    lng = seoul_sgg_stat.loc[idx, '경도']
    r = seoul_sgg_stat.loc[idx, '만명당_매장수']
    if r > top:
        fillColor = '#FF3300' # (Red)
    else:
        fillColor = '#CCFF33' # (Green)
    #CircleMarker() : 원형 마커를 만드는 함수
    # location : 위도, 경도 데이터
    # color : 테두리 색상
    folium.CircleMarker( 
        location=[lat, lng],
        color='#FFFF00',     # (Yellow)
        fill_color=fillColor,
        fill_opacity=0.7,
        weight=1.5,
        radius= r * 10 # 반지름
    ).add_to(viz_map_1)
#viz_map_1
viz_map_1.save('./data_output/crawling_07_03_store_10000.html')
```

- 지도
![img](/assets/images/pandas_starbucks/starbucks_pandas_visual_3.png "pandas")

--------------------------


### 서울시 시군구별 종사자수 단계구분도 지도 시각화 
(스타벅스 매장 수와 사업체 종사자수)

직장인이 많은 지역에 스타벅스 매장이 많이 입지해 있을 것이다." 라는 가설을 세우고, 스타벅스 매장 수와 서울시 시군구별 종사자수를 비교해서 시각화 해보기로 한다.

- 코드

```py
starbucks_choropleth = folium.Map(
    location=[37.573050, 126.979189],
    tiles='CartoDB dark_matter',
    zoom_start=11
)

folium.Choropleth( # Choropleth() : 단계구분도를 만드는 함수
    geo_data=seoul_sgg_geo_2,
    data=seoul_sgg_stat,
    columns=['시군구명', '종사자수'],
    fill_color = 'YlGn',
    fill_opacity=0.7,
    line_opacity=0.5,
    key_on='properties.SIG_KOR_NM'
    ).add_to(starbucks_choropleth)
#starbucks_choropleth
starbucks_choropleth.save('./data_output/crawling_07_04_store_office.html')
```

- 지도
![img](/assets/images/pandas_starbucks/starbucks_pandas_visual_4.png "pandas")


```py
seoul_sgg_stat['종사자수_만명당_매장수'] = \
        seoul_sgg_stat['스타벅스_매장수']/(seoul_sgg_stat['종사자수']/10000)       

#종사자수_만명당_매장수가 키가 되어 매핑이 되게 할 것이다.
print("seoul_sgg_stat 22 :: ", seoul_sgg_stat.head())
```

- 출력 결과
```
seoul_sgg_stat 22 ::    
     시군구코드  시군구명       위도        경도   스타벅스_매장수   주민등록인구  \
0       11320    도봉구  37.665861  127.031767                6        312858
1       11380    은평구  37.617612  126.922700               13        468766
2       11230  동대문구  37.583801  127.050700               10        354884
3       11590    동작구  37.496504  126.944307               11        390377
4       11545    금천구  37.460097  126.900155               12        242467

    종사자수  사업체수    만명당_매장수  종사자수_만명당_매장수
0     79097     25391       0.191780              0.758562
1    109031     36509       0.277324              1.192321
2    146383     42813       0.281782              0.683139
3    109281     27915       0.281779              1.006579
4    255449     47964       0.494913              0.469761
```


## 종사자 수 1만 명당 스타벅스 매장 수 시각화

### 1.지도베이스 만들기

```py
seoul_sgg_geo_1 = json.load(open(SGG_GEOJSON_FILE_PATH, encoding='utf-8'))
#folium.Map : 지도베이스 만들기
viz_map_1 = folium.Map(
    location=[37.573050, 126.979189], #위도, 경도
    tiles='CartoDB dark_matter', #지도 스타일
    zoom_start=11 #확대 정도
)

#folium.GeoJson
folium.GeoJson(
    seoul_sgg_geo_1,
    style_function=style_function,
).add_to(viz_map_1)

viz_map_1.save('./data_output/crawling_07_05_store_office_10000.html')
```

- 지도
![img](/assets/images/pandas_starbucks/starbucks_pandas_visual_5.png "pandas")


### 2. 시각화
```py
top = seoul_sgg_stat['종사자수_만명당_매장수'].quantile(0.9)
for idx in seoul_sgg_stat.index:
    name = seoul_sgg_stat.at[idx, '시군구명']
    lat = seoul_sgg_stat.loc[idx, '위도']
    lng = seoul_sgg_stat.loc[idx, '경도']
    r = seoul_sgg_stat.loc[idx, '종사자수_만명당_매장수']
    if r > top:
        fillColor = '#FF3300'
    else:
        fillColor = '#CCFF33'
    folium.CircleMarker( #CircleMarker() : 원형 마커를 만드는 함수
        location=[lat, lng],
        color='#FFFF00',
        fill_color=fillColor,
        fill_opacity=0.7,
        weight=1.5,
        radius= r * 10
    ).add_to(viz_map_1)
viz_map_1.save('./data_output/crawling_07_06_store_office_10000.html')
```

- 지도
![img](/assets/images/pandas_starbucks/starbucks_pandas_visual_6.png "pandas")