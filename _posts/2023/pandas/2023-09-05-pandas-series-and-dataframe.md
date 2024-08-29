---
title: Pandas - Series & Dataframe 란?
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
description: Pandas - Series & Dataframe 란?
article_tag1: Pandas
article_tag2: Series  
article_tag3: Dataframe
article_section: Pandas
meta_keywords: Pandas, Series, Dataframe
last_modified_at: '2023-09-05 21:00:00 +0800'
---

# Pandas : Series & Dataframe 란?
pandas는 데이터 분석을 위한 파이썬 라이브러리이다.
행과 열로 이루어진 2차원 데이터프레임을 만들어 다룰 수 있다.

### 다음과 같은 기능을 제공한다.
- 데이터 핸들링
- 결측치 처리
- 데이터 정렬
- 데이터 요약
- 데이터 병합
- 데이터 변환
- 데이터 시각화

### pandas의 자료구조
- 시리즈(Series) : 1차원 배열
- 데이터프레임(DataFrame) : 2차원 배열
- 패널(Panel) : 3차원 배열

### pandas 라이브러리를 불러온다.
> import pandas as pd

# 1. 시리즈(series)

 pandas의 시리즈는 1차원 배열이다. series는 index와 value로 구성된다. series는 index를 지정하지 않으면 0부터 시작하는 정수형 인덱스를 사용한다.

## 1-1. series
```py
dict_data = {'name': ['A', 'B', 'C', 'D'],
        'score': [100, 90, 80, 70],
        'grade': ['A', 'B', 'C', 'D']}
# dictionary -> series 타입으로 변환
print(type(dict_data)) #<class 'dict'>
# 형태 : pandas.Series(딕셔너리)
df = pd.Series(dict_data)
print(type(df)) #<class 'pandas.core.series.Series'>
print(df)
```

```
출력 결과 : 키와 값이 출력된다.
name          [A, B, C, D]
score    [100, 90, 80, 70]
grade         [A, B, C, D]
```
        
## 1-2. series index
```py
list_data = ['2019-01-02', 3.14, 'ABC', 100, True]
sr = pd.Series(list_data)
print(sr)
```

```
출력 결과 : 인덱스가 자동으로 생성된다.
0    2019-01-02
1          3.14
2           ABC
3           100
4          True
```

```py
idx = sr.index
val = sr.values
print(idx) #RangeIndex(start=0, stop=5, step=1)
print(val) #['2019-01-02' 3.14 'ABC' 100 True]
```

## 1-3. series element
tuple -> series 타입으로 변환
```py
tup_data = ('영인', '2010-05-01', '여', True)
sr = pd.Series(tup_data, index=['이름', '생년월일', '성별', '학생여부'])
print(sr)

#원소 1개 선택
print(sr[0])
print(sr['이름'])

#원소 여러 개 선택
print(sr[[1,2]])
print(sr[['생년월일', '성별']])

#원소 범위 선택
print(sr[1:2])
print(sr['생년월일':'성별'])
```

# 2. 데이터프레임(DataFrame)
 
 DataFrame은 2차원 배열이다. DataFrame은 행과 열로 이루어진 2차원 배열이다. DataFrame은 index와 column으로 구성된다. DataFrame은 index를 지정하지 않으면 0부터 시작하는 정수형 인덱스를 사용한다.

## 2-1. DataFrame
> 데이터 프레임 변환 형식 : pandas.DataFrame(딕셔너리)
 dict -> dataframe 타입으로 변환
```py
dict_data = {'c0': [1,2,3], 'c1': [4,5,6], 'c2': [7,8,9], 'c3': [10,11,12], 'c4': [13,14,15]}
df = pd.DataFrame(dict_data)
print(type(df)) #<class 'pandas.core.frame.DataFrame'>
print(df)
```

```
출력 결과 :
   c0  c1  c2  c3  c4
0   1   4   7  10  13
1   2   5   8  11  14
2   3   6   9  12  15
```

```py
print(df.index) #행
print(df.columns) #열
#행(index), 열 이름 변경
df.index = ['r0', 'r1', 'r2']
df.columns = ['a', 'b', 'c', 'd', 'e']
print(df)
```

```
출력 결과 :
    a  b  c   d   e
r0  1  4  7  10  13
r1  2  5  8  11  14
r2  3  6  9  12  15
```

```py
df.rename(columns={'a': 'c0', 'b': 'c1', 'c': 'c2', 'd': 'c3', 'e': 'c4'}, inplace=True)
df.rename(index={'r0': 'r00', 'r1': 'r11', 'r2': 'r22'}, inplace=True)
print(df)
#df memory address
print(id(df)) #1661031989056
```


- inplace=True : 원본 객체를 변경한다.
- inplace=False : 원본 객체를 변경하지 않고, 변경된 결과를 새로운 객체에 저장한다.

```py
tmp_df = df.rename(columns={'c0': 'a', 'c1': 'b', 'c2': 'c', 'c3': 'd', 'c4': 'e'}, inplace=False)
tmp_df = df.rename(index={'r00': 'r0', 'r11': 'r1', 'r22': 'r2'}, inplace=False)
print(tmp_df)
print(id(tmp_df)) #1661031988912

def rename(colums, inplace):
    if inplace:
        df.columns = colums
    else:
        tmp_df = df[:] #원본 복사하여 새로운 공간에 저장
        tmp_df.columns = colums
        return tmp_df
```


## data remove
```py
tmp_df1 = df[:]
print("remove before :: ", tmp_df1)
```

```
출력 결과 :
     c0  c1  c2  c3  c4
r00   1   4   7  10  13
r11   2   5   8  11  14
r22   3   6   9  12  15
```

```py
tmp_df1.drop('r00', inplace=True)
print("index remove after :: ", tmp_df1)
```
행(index)에서 r00 삭제
```
출력 결과 :
     c0  c1  c2  c3  c4
r11   2   5   8  11  14
r22   3   6   9  12  15
```

```py
tmp_df2 = df[:]
tmp_df2.drop(['r11', 'r22'], axis=0, inplace=True)
print("index remove after :: ", tmp_df2)
```

```
출력 결과 :
     c0  c1  c2  c3  c4
r00   1   4   7  10  13
```

```py
drop column   
tmp_df3 = df[:]
tmp_df3.drop('c0', axis=1, inplace=True)
print("column remove after :: ", tmp_df3)
```

```
출력 결과 :
     c1  c2  c3  c4
r00   4   7  10  13
r11   5   8  11  14
r22   6   9  12  15
```