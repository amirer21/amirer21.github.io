---
title: 파이썬(Pandas), 오픈 데이터 수집하여 데이터프레임으로 변환하기 (1)
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
description: Open Data Explorer, Converting Open Data into Structured DataFrames using Python and Pandas (1)
article_tag1: Pandas
article_tag2: opendata  
article_tag3: python
article_section: Pandas
meta_keywords: Pandas, opendata, python
last_modified_at: '2023-09-23 21:00:00 +0800'
---

# Pandas, 오픈 데이터 수집하여 데이터프레임으로 변환하기 (1)
## 서울시 주민등록 인구(구별) 데이터 분석

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
#pandas 라이브러리 불러오기
import pandas as pd

#위의 공개 데이터를 다운로드 받아서 작업 폴더에 저장한 후, 불러온다.
#이 파일에는 수집하여 분석하려는 데이터가 들어있다.
sgg_pop_df = pd.read_csv('./api_files/report.txt', sep='\t', header=1)
pd.set_option('display.max_columns', 10)                  # 출력할 최대 열의 개수
pd.set_option('display.max_colwidth', 20)                 # 출력할 열의 너비
pd.set_option('display.unicode.east_asian_width', True)   # 유니코드 사용 너비 조정
print("ssg_pop_df :: ", sgg_pop_df.head())
```

- 출력 내용
```
ssg_pop_df ::   
   시점 동별(1) 동별(2)     소계   소계.1  ...  소계.3  남자.2  여자.2    소계.4   소계.5 
0  2023 1/4    합계    소계  4463385  9668008  ...  241604  105871  135733    2.11  1690961
1  2023 1/4    합계  종로구    72679   152212  ...   11152    4649    6503    1.94    28265
2  2023 1/4    합계    중구    63862   131390  ...   10427    4877    5550    1.89    25353
3  2023 1/4    합계  용산구   109735   232482  ...   14726    7968    6758    1.98    39478
4  2023 1/4    합계  성동구   133513   287240  ...    7000    2938    4062    2.10    48238
```

컬럼명 변경을 위한 작업이다. 파이썬 딕셔너리 자료형을 사용한다.
딕셔너리 자료형은 키(key)와 값(value)의 쌍을 요소로 가지는 자료형이다.
딕셔너리 자료형은 {키1:값1, 키2:값2, 키3:값3, ...}와 같은 형태로 표현한다.

```py
columns = {
    '시점': 'GIGAN',
    '동별(1)': 'SUM',
    '동별(2)': 'JACHIGU',
    '소계': 'SEDAE',
    '소계.1': 'GYE_1',
    '남자': 'NAMJA_1',
    '여자': 'YEOJA_1',
    '소계.2': 'GYE_2', # 한국인
    '남자.1': 'NAMJA_2',
    '여자.1': 'YEOJA_2',
    '소계.3': 'GYE_3', # 등록외국인
    '남자.2': 'NAMJA_3',
    '여자.2': 'YEOJA_3',
    '소계.4': 'SEDAEDANGINGU',
    '소계.5': 'N_65SEISANGGORYEONGJA'
}
```

rename() 메소드를 사용하여 컬럼명을 변경한다.
rename(columns={'바꾸고 싶은 컬럼명':'바꿀 컬럼명'})
여기에서 원래 컬럼명은 columns 딕셔너리 자료형의 키(key)에 있고, 바꿀 컬럼명은 values에 있다.

```py
rename = sgg_pop_df.rename(columns = columns, inplace = True)
print(rename)
print("sgg_pop_df.head() :: ", sgg_pop_df.head())
print("=========================================")
```

- 출력 내용
```
sgg_pop_df.head() :: 
     GIGAN   SUM JACHIGU    SEDAE    GYE_1  ...   GYE_3  NAMJA_3  YEOJA_3     SEDAEDANGINGU  N_65SEISANGGORYEONGJA
0  2023 1/4  합계    소계  4463385  9668008  ...  241604   105871   135733           2.11              1690961
1  2023 1/4  합계  종로구    72679   152212  ...   11152     4649     6503           1.94                28265
2  2023 1/4  합계    중구    63862   131390  ...   10427     4877     5550           1.89                25353
3  2023 1/4  합계  용산구   109735   232482  ...   14726     7968     6758           1.98                39478
4  2023 1/4  합계  성동구   133513   287240  ...    7000     2938     4062           2.10                48238
```

info
```py
print("info :: ", sgg_pop_df.info())
```

# 참고
컬럼에서 특정 조건을 만족하는 데이터만 추출할 수도 있다.

```py
condition = sgg_pop_df['JACHIGU'] != '소계' # '소계' 제외
sgg_pop_df_selected = sgg_pop_df[condition]
print("sgg_pop_df_selected :: ", sgg_pop_df_selected.head())
```

- 출력 내용
```
  GIGAN   SUM JACHIGU   SEDAE   GYE_1  ...  GYE_3  NAMJA_3  YEOJA_3     SEDAEDANGINGU  N_65SEISANGGORYEONGJA
1  2023 1/4  합계  종로구   72679  152212  ...  11152     4649     6503     1.94                28265
2  2023 1/4  합계    중구   63862  131390  ...  10427     4877     5550     1.89                25353
3  2023 1/4  합계  용산구  109735  232482  ...  14726     7968     6758     1.98                39478
4  2023 1/4  합계  성동구  133513  287240  ...   7000     2938     4062     2.10                48238
5  2023 1/4  합계  광진구  169787  350925  ...  14124     5774     8350     1.98                54854
```

# 분석에 필요한 컬럼 선택

```py
columns = ['JACHIGU', 'GYE_1']
sgg_pop_df_final = sgg_pop_df_selected[columns] #컬럼에서 특정 컬럼만 선택
print("sgg_pop_df_final :: ", sgg_pop_df_final.head())
```

- 출력 내용
```
  JACHIGU   GYE_1
1  종로구  152212
2    중구  131390
3  용산구  232482
4  성동구  287240
5  광진구  350925
```

# 데이터프레임의 컬럼명 변경
위의 'ssg_pop_df_final' 데이터프레임의 컬럼명을 변경한다.

```py
sgg_pop_df_final.columns = ['시군구명', '주민등록인구']
#info
print("info :: ", sgg_pop_df_final.info())
print("sgg_pop_df_final :: ", sgg_pop_df_final.head())
```

- 출력 내용
```
    시군구명  주민등록인구
1   종로구        152212
2     중구        131390
3   용산구        232482
4   성동구        287240
5   광진구        350925
```

# 파일로 저장
```py
sgg_pop_df_final.to_excel('./data_output/sgg_pop.xlsx', index=False)
```


```
files
- seoul_starbucks.xlsx  : 크롤링
- seoul_sgg_list.xlsx   : 공공데이터 저장  # 시군구코드	시군구명	위도	경도
- sgg_pop.xlsx          : 공공데이터 저장(가공) [report.txt]
- sgg_biz.xlsx          : 공공데이터 저장(가공) [report1.txt]
```