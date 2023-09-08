---
title: Pandas - 시각화(visualization) 그래프 그리기 (0)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Pandas
toc: true
toc_sticky: true
toc_label: 목차
description: Pandas - 시각화(visualization) 그래프 그리기
article_tag1: Pandas
article_tag2: matplotlib  
article_tag3: pyplot
article_section: Pandas
meta_keywords: Pandas, matplotlib, pyplot
last_modified_at: '2023-09-07 21:00:00 +0800'
---

# Pandas 시각화 그래프 그리기 (0)
matplotlib 에 다양한 그래프 예제가 있다.
> https://matplotlib.org/stable/gallery/index.html

여기서는 그래프 예제로 선그래프, 막대그래프, 히스토그램, 산점도등으로 나타내는 방법을 알아본다.

matplotlib 에서는 파일(엑셀, csv 등)을 읽어서 데이터프레임으로 변환하는 방법이 여러가지가 있다.
- 엑셀 : read_excel()
- csv : read_csv()
- json : read_json()

## 필요한 모듈
```py
import warnings
import pandas as pd
#MatPlotLib
import matplotlib.pyplot as plt
import plotly.express as px

warnings.simplefilter("ignore") #경고 무시
```

## 엑셀 파일 가져와서 그래프 그리기
```py
df = pd.read_excel("./Data_full/남북한발전전력량.xlsx", engine='openpyxl')
df_ns = df.iloc[[0, 5], 2:]  # 0, 5행, 2열부터 끝까지
df_ns.index = ['South', 'North'] # 행 인덱스 변경
print("df_ns :: ", df_ns) 
print('\n')

df_ns.columns = df_ns.columns.map(int) # 열 이름의 자료형을 정수형으로 변경
print("df_ns :: ", df_ns)

#그래프 그리기
df_ns.plot()
```
![img](/assets/images/pandas/Figure_1.png "pandas")

```py
tdf_ns = df_ns.T # 행, 열 전치하여 다시 그리기
print("tdf_ns :: ", tdf_ns.head())
print('\n')
tdf_ns.plot()

df = pd.read_excel('./Data_full/남북한발전전력량.xlsx', engine='openpyxl')
df_ns = df.iloc[[0, 5], 2:]
df_ns.index = ['South','North']
df_ns.columns = df_ns.columns.map(int)
df_ns.plot()
```
![img](/assets/images/pandas/Figure_2.png "pandas")


-----------
## 막대그래프
```py
tdf_ns = df_ns.T
print(tdf_ns.head())
print('\n')
tdf_ns.plot(kind='bar')  # 막대그래프
```
![img](/assets/images/pandas/Figure_5.png "pandas")


-----------
## 히스토그램
```py
tdf_ns = df_ns.T
tdf_ns['North'] = pd.to_numeric(tdf_ns['North'])
tdf_ns['South'] = pd.to_numeric(tdf_ns['South'])
tdf_ns.plot(kind='hist') # 히스토그램
```
![img](/assets/images/pandas/Figure_6.png "pandas")


-----------
## 산점도
```py
df = pd.read_csv("./Data_full/auto-mpg.csv", header=None)
df.columns = ['mpg', 'cylinders', 'displacement', 'horsepower', 'weight', 'acceleration', 'model year', 'origin', 'name']
df.plot(x='weight', y='mpg', kind='scatter') #plot는 기본적으로 선그래프
```
![img](/assets/images/pandas/Figure_7.png "pandas")


```py
#MatPlotLib
#import matplotlib.pyplot as plt
pf = pd.read_excel("./Data_full/시도별_전출입_인구수.xlsx", engine='openpyxl', header=0)
df = df.fillna(method='ffill') # 누락값을 앞 데이터로 채움  
print(pf.head())
#서울에서 다른 지역으로 이동한 데이터만 추출하여 정리
mask = (pf['전출지별'] == '서울특별시') & (pf['전입지별'] != '서울특별시')
df_seoul = pf[mask]
print(df_seoul.head())
```

## pyplot

matplotlib 모듈을 사용하여 title, x축, y축 라벨링하고 show() 함수를 사용하여 그래프를 설정할 수 있다.
Pandas의 시리즈나 데이터프레임은 plot이라는 시각화 메서드를 내장하고 있다. 
plot은 matplotlib를 내부에서 임포트하여 사용한다.

```py
plt.title("Pandas의 Plot메소드 사용 예")
#plt.xlabel("시간")
#plt.ylabel("Data")
plt.show()
```