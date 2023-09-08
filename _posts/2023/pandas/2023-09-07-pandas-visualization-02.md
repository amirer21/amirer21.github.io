---
title: Pandas - 시각화(visualization) 그래프 그리기 (1)
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
description: Pandas - 시각화(visualization) 그래프 그리기 (1)
article_tag1: Pandas
article_tag2: matplotlib  
article_tag3: pyplot
article_section: Pandas
meta_keywords: Pandas, matplotlib, pyplot
last_modified_at: '2023-09-07 21:00:00 +0800'
---

# Pandas 시각화 그래프 그리기 (1)
데이터를 불러와서 그래프로 그리고 그래프 세부 설정하는 방법을 알아본다.
matplotlib.pyplot 모듈을 사용한다.
- 그래프 사이즈, x축, y축 라벨링, 범례 표시, 그래프 제목, 주석 표시 등을 설정할 수 있다.

```py
import warnings
import pandas as pd
#MatPlotLib
import matplotlib.pyplot as plt
from matplotlib import font_manager, rc
import plotly.express as px

#matplotlib 에 다양한 그래프 예제가 있다.
#https://matplotlib.org/stable/gallery/index.html

#경고 메시지 무시
warnings.simplefilter("ignore")

#외부에서 폰트를 불러오는 방법
fnot_path = "./font_data/malgun.ttf"
font_name = font_manager.FontProperties(fname=fnot_path).get_name()
rc('font', family=font_name)

#MatPlotLib
#import matplotlib.pyplot as plt
pf = pd.read_excel("./Data_full/시도별_전출입_인구수.xlsx", engine='openpyxl', header=0)
pf = pf.fillna(method='ffill') # 누락값을 앞 데이터로 채움  
print(pf.head())

#서울에서 다른 지역으로 이동한 데이터만 추출하여 정리
mask = (pf['전출지별'] == '서울특별시') & (pf['전입지별'] != '서울특별시')
df_seoul = pf[mask]
print(df_seoul.head())

# 서울에서 다른 지역으로 이동한 데이터만 추출하여 정리
df_seoul = df_seoul.drop(['전출지별'], axis=1) # '전출지별' 열 삭제
df_seoul.rename({'전입지별':'전입지'}, axis=1, inplace=True) # '전입지별' 열 -> '전입지'로 바꾸기
print("df_seoul :: ", df_seoul)


# 서울에서 경기도로 이동한 인구 데이터 값만 선택
df_seoul.set_index('전입지', inplace=True)
print("df_seoul :: ", df_seoul)

# 서울에서 경기도로 이동한 인구 데이터 값만 선택
sr_one = df_seoul.loc['경기도']
print("sr_one :: ", sr_one)

#####################################
# x, y축 데이터를 plot 함수에 입력
df = pd.read_excel('./Data_full/시도별_전출입_인구수.xlsx', engine= 'openpyxl', header=0)
df = df.fillna(method='ffill')
mask = (df['전출지별'] == '서울특별시') & (df['전입지별'] != '서울특별시')
df_seoul = df[mask]
df_seoul = df_seoul.drop(['전출지별'], axis=1) #drop : 열 삭제
df_seoul.rename({'전입지별':'전입지'}, axis=1, inplace=True) #rename : 열 이름 바꾸기
df_seoul.set_index('전입지', inplace=True) #set_index : 행 인덱스 설정
sr_one = df_seoul.loc['경기도'] #loc : 행 인덱스를 기준으로 행 데이터 추출

"""
그래프 세부 설정
"""
#그래프 사이즈 지정
plt.figure(figsize=(14,5)) #figsize는 가로, 세로 길이
plt.xticks(size=10, rotation='vertical') #rotation은 글자를 세로로 쓸지 가로로 쓸지 정하는 것
# x, y축 데이터를 plot 함수에 입력
#plt.plot(sr_one.index, sr_one.values, markersize=10) #x축 : index, y축 : values, marker 가 없으면 기본값으로 선이 그려짐
plt.plot(sr_one.index, sr_one.values, marker='o', markersize=10) #x축 : index, y축 : values, marker : 점의 모양, markersize : 점의 크기
plt.title('서울 -> 경기 인구 이동') # 그래프 제목
plt.xlabel('기간') # x축 이름
plt.ylabel('이동 인구수') # y축 이름
plt.legend(labels=['서울 -> 경기'], loc='best', fontsize=15) # 범례 표시(우측 상단) #loc : best는 알아서 위치를 잡아줌, fontsize : 글자 크기

#스타일 리스트 출력
print(plt.style.available)
plt.style.use('ggplot') # 스타일 서식 지정. ggplot스타일 : 격자 무늬 스타일

#y축 범위 지정(최소값, 최대값)
plt.ylim(50000, 800000)


# 주석 표시 - 화살표
plt.annotate('',
             xy=(20, 620000),       #화살표의 머리 부분(끝점)
             xytext=(2, 290000),    #화살표의 꼬리 부분(시작점)
             xycoords='data',       #좌표체계
             arrowprops=dict(arrowstyle='->', color='skyblue', lw=5), #화살표 서식
             )
plt.annotate('',
             xy=(47, 450000),       #화살표의 머리 부분(끝점)
             xytext=(30, 580000),   #화살표의 꼬리 부분(시작점)
             xycoords='data',       #좌표체계
             arrowprops=dict(arrowstyle='->', color='olive', lw=5),  #화살표 서식
             )
# 주석 표시 - 텍스트
plt.annotate('인구이동 증가(1970-1995)',  #텍스트 입력
             xy=(10, 550000),            #텍스트 위치 기준점
             rotation=25,                #텍스트 회전각도
             va='baseline',              #텍스트 상하 정렬
             ha='center',                #텍스트 좌우 정렬
             fontsize=15,                #텍스트 크기
             )
plt.annotate('인구이동 감소(1995-2017)',  #텍스트 입력
             xy=(40, 560000),            #텍스트 위치 기준점
             rotation=-11,               #텍스트 회전각도
             va='baseline',              #텍스트 상하 정렬
             ha='center',                #텍스트 좌우 정렬
             fontsize=15,                #텍스트 크기
             )


plt.show() #그래프를 보여주는 것
```

![img](/assets/images/pandas/ex02_Figure_1.png "pandas")