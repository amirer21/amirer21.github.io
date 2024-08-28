---
title: 파이썬(Pandas), 오픈 데이터 수집하여 데이터프레임으로 변환하기 (2)
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
- Opendata
toc: true
toc_sticky: true
toc_label: 목차
description: Open Data Explorer, Converting Open Data into Structured DataFrames using Python and Pandas (2)
article_tag1: Pandas
article_tag2: opendata  
article_tag3: python
article_section: Pandas
meta_keywords: Pandas, opendata, python
last_modified_at: '2023-09-23 21:00:00 +0800'
---

# Pandas, 오픈 데이터 수집하여 데이터프레임으로 변환하기 (2)
## 서울시 사업체현황(산업대분류별/동별) 데이터 분석

### 오픈 데이터 수집하여 데이터프레임으로 변환하기
```
* 서울시 주민등록 인구(구별)통계 정보 수집 : Txt
    * https://data.seoul.go.kr/dataList/419/S/2/datasetView.do
* 서울시 사업체현황(산업대분류별/동별) 통계 정보 수집 : Txt
    * https://data.seoul.go.kr/dataList/104/S/2/datasetView.do
```

## 서울시 통계 정보 : 공공 데이터 수집
### 서울시 주민등록 인구(구별) 데이터 분석

```py
import pandas as pd
sgg_biz_df = pd.read_csv('./api_files/report1.txt', sep='\t', header=3) 
pd.set_option('display.max_columns', 10)    # 출력할 최대 열의 개수
pd.set_option('display.max_colwidth', 20)   # 출력할 열의 너비
pd.set_option('display.unicode.east_asian_width', True)   # 유니코드 사용 너비 조정
print("sgg_biz_df :: ", sgg_biz_df.head())
print("=========================================")

columns = {
    '시점': 'GIGAN',
    '동별(1)': 'GIGAN',
    '동별(2)': 'JACHIGU',
    '동별(3)': 'DONG',
    '소계': 'SAEOPCHESU_1',
    '여성대표자': 'YEOSEONGDAEPYOJA',
    '소계.1': 'GYE',
    '남': 'NAM',
    '여': 'YEO'
}
sgg_biz_df.rename(columns = columns, inplace = True)
print("sgg_biz_df.head(10) :: ", sgg_biz_df.head(10))
print("=========================================")
```

- 출력
```
sgg_biz_df.head(10) ::    
 GIGAN GIGAN JACHIGU             DONG  SAEOPCHESU_1  ...  소계.35  소계.36  \
0  2021  합계  종로구             소계         48361  ...    19143     1141
1  2021  합계  종로구           사직동          5035  ...     1207      114
2  2021  합계  종로구           삼청동           956  ...       40       37
3  2021  합계  종로구           부암동           894  ...      286       39
4  2021  합계  종로구           평창동          1321  ...      521       81
5  2021  합계  종로구           무악동           761  ...      560       14
6  2021  합계  종로구           교남동           592  ...     3568       17
7  2021  합계  종로구           가회동           969  ...       88       47
8  2021  합계  종로구  종로1.2.3.4가동         17286  ...     1850      243
9  2021  합계  종로구      종로5.6가동          7972  ...      441       50

   소계.37  소계.38 소계.39
0     5650     2591    7297
1     1612      285     944
2      307       39     146
3       99       81     226
4      195      123     281
5       27       51     168
6       64       57     154
7      132       69     178
8     1031      911    2509
9      136      252     764
```


## condition
### 시군구별 사업체 현황 데이터 추출(행)

### 소계만 추출
```py
condition = sgg_biz_df['DONG'] == '소계' # 소계만 추출
sgg_biz_df_selected = sgg_biz_df[condition]
print("sgg_biz_df_selected 소계 :: ", sgg_biz_df_selected.head(10))
print("=========================================")
```

- 출력
```
sgg_biz_df_selected 소계 ::    
GIGAN GIGAN   JACHIGU  DONG  SAEOPCHESU_1  ...  소계.35  소계.36  소계.37  \
0    2021  합계    종로구  소계         48361  ...    19143     1141     5650
18   2021  합계      중구  소계         70308  ...    11585      632     3258
34   2021  합계    용산구  소계         29680  ...     8219      651     3006
51   2021  합계    성동구  소계         41665  ...     9635      844     2956
69   2021  합계    광진구  소계         33706  ...    12785     1139     3202
85   2021  합계  동대문구  소계         42813  ...    17183      889     2282
100  2021  합계    중랑구  소계         39310  ...    14806     1029     2273
117  2021  합계    성북구  소계         34712  ...    16668     1043     2444
138  2021  합계    강북구  소계         26385  ...    11540      869     1885
152  2021  합계    도봉구  소계         25391  ...    12804      738     1594

     소계.38 소계.39
0       2591    7297
18      2175    7632
34      1866    5572
51      2341    7334
69      2799    5121
85      2790    4906
100     3099    4937
117     2931    5502
138     2508    4270
152     2264    4184
```

## 필요한 칼럼만 선택
```py
columns = ['JACHIGU', 'GYE', 'SAEOPCHESU_1']
sgg_biz_df_final = sgg_biz_df_selected[columns] # 필요한 칼럼만 선택
sgg_biz_df_final.columns = ['시군구명', '종사자수','사업체수'] # 칼럼명 변경
print("시군구명, 종사자수, 사업체수 :: ", sgg_biz_df_final.head())
print("=========================================")
```
GIGAN GIGAN JACHIGU  DONG  SAEOPCHESU_1  ...  소계.35  소계.36  소계.37 ...
위에서 해당되는 컬럼명을 '시군구명', '종사자수', '사업체수'로 변경

- 출력
```
시군구명  종사자수  사업체수
0    종로구    275063     48361
18     중구    386564     70308
34   용산구    152605     29680
51   성동구    203221     41665
69   광진구    129707     33706
```


## 데이터프레임 인덱스 초기화
```py
sgg_biz_df_final = sgg_biz_df_final.reset_index(drop=True)
print("sgg_biz_df_final :: ", sgg_biz_df_final.head())
print("=========================================")
```

- 출력
```
sgg_biz_df_final ::    
시군구명  종사자수  사업체수
0   종로구    275063     48361
1     중구    386564     70308
2   용산구    152605     29680
3   성동구    203221     41665
4   광진구    129707     33706
```

```py
sgg_biz_df_final.to_excel('./data_output/sgg_biz.xlsx', index=False)
```