---
title: Pandas - 행과 열을 다루는 방법
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
description: Pandas - Series, Dataframe
article_tag1: Pandas
article_tag2: Series  
article_tag3: Dataframe
article_section: Pandas
meta_keywords: Pandas, Series, Dataframe
last_modified_at: '2023-09-06 21:00:00 +0800'
---

# Pandas 행과 열을 다루는 방법
행과 열을 설정하는 다양한 기능들에 대해 정리해보았다.
- 행(인덱스), 열 이름 설정 방법
- loc, iloc 사용하여 행 선택 방법
- 행과 열 선택 방법
- 범위 슬라이싱을 사용하여 행 선택 방법
- 행(인덱스), 열로 바꾸는 방법
- 행, 열의 위치 바꾸는 방법
- 행, 열 추가 방법
- 덧셈, 뺄셈, 곱셈, 나눗셈 연산 방법

## 행 인덱스, 열 이름 설정

```py
dict_data = {'국어': [90, 95, 80, 85], '영어': [85, 90, 85, 90], '수학': [80, 85, 90, 95]}
df = pd.DataFrame(dict_data)
df.index = ['길동', '영희', '철수', '영수'] #행 인덱스 설정
df.columns = ['국어', '영어', '수학'] # 열 이름 설정
print(df)
```

```
출력 내용
     국어  영어  수학
길동  90  85  80
영희  95  90  85
철수  80  85  90
영수  85  90  95
```
--------------------

## loc, iloc 사용하여 행 선택하기
인덱스 이름 : DataFrame 객체.loc[행 인덱스, 열 이름]
> 예 : df.loc['길동', '국어']

> 형식 :DataFrame객체.iloc[행 번호, 열 번호]
> 예 : df.iloc[0, 0]

--------------------

## 행 인덱스를 사용하여 2개 이상의 행 선택

```py
label2 = df.loc[['길동', '영희']]
position2 = df.iloc[[0, 1]]
print("label2 :: ", label2)
print('\n')
print(position2)
print('\n')
```

--------------------

# 행 인덱스의 범위를 지정하여 행 선택
```py
label3 = df.loc['길동':'영희']
position3 = df.iloc[0:1]
print("label3 :: ", label3)
print('\n')
print(position3)
```
--------------------

## 2개 이상 원소 출력
```py
label4 = df.loc['길동', ['국어', '영어']]
print("label4 :: ", label4)
```

```
출력
국어    90
영어    85
```

```py
d = df.iloc[0, [0, 1]]
print("d :: ", d)
```

```
출력
국어    90
영어    85
```

```py
math1 = df['수학']
print("수학 :: ", math1)
print(type(math1))
print('\n')
```

```
수학 ::  
길동    80
영희    85
철수    90
영수    95
```
```py
english = df['영어']
print("영어 :: ", english)
```

```
영어 ::  
길동    85
영희    90
철수    85
영수    90
```

```py
print(type(english))
print('\n')

music_gym = df[['국어', '영어']]
print(music_gym)
print(type(music_gym))
print('\n')

math2 = df[['수학']]
print(math2)
print(type(math2))
```

--------------------

## set_index는 행 인덱스를 열로 바꾼다.
```py
exam_data = {'이름' : [ '서준', '우현', '인아'],
             '수학' : [ 90, 80, 70],
             '영어' : [ 98, 89, 95],
             '음악' : [ 85, 95, 100],
             '체육' : [ 100, 90, 90]}
df = pd.DataFrame(exam_data)
df.set_index('이름', inplace=True)
print(df)
print('\n')

g = df.loc[['서준', '우현'], ['음악', '체육']]
print(g)
h = df.iloc[[0, 1], [2, 3]] 
print(h)
```

```
출력 내용
    음악   체육
이름
서준  85  100
우현  95   90
```

## 행 추가하기

```py
df['국어'] = 80 #모든 컬럼의 값을 80으로 변경
print(df)

#새로운 행 추가 - 같은 원소 값 입력
df.loc[3] = 0
print(df)
```

```
    수학  영어   음악   체육  국어
이름
서준  90  98   85  100  80
우현  80  89   95   90  80
인아  70  95  100   90  80
3    0   0    0    0   0
```

## 새로운 행 추가 - 여러 개의 원소 값 입력
```py
df.loc[4] = ['동규', 90, 80, 70, 60]
print(df)
```

```
    수학  영어   음악   체육  국어
이름
서준  90  98   85  100  80
우현  80  89   95   90  80
인아  70  95  100   90  80
3    0   0    0    0   0
4   동규  90   80   70  60
```

## 새로운 행 추가 - 기존 행 복사
```py
df.loc['행5'] = df.loc[3]
print(df)
```

```
    수학  영어   음악   체육  국어
이름
서준  90  98   85  100  80
우현  80  89   95   90  80
인아  70  95  100   90  80
3    0   0    0    0   0
4   동규  90   80   70  60
행5   0   0    0    0   0
```

## 기존 행 수정하기(modify element)
```py
exam_data = {'이름' : [ '서준', '우현', '인아'],
             '수학' : [ 90, 80, 70],
             '영어' : [ 98, 89, 95],
             '음악' : [ 85, 95, 100],
             '체육' : [ 100, 90, 90]}
df = pd.DataFrame(exam_data)
df.set_index('이름', inplace=True)
print("exam_data :: ", df)
print('=======================================')
print('\n')
```

```
수학  영어   음악   체육
이름
서준  90  98   85  100
우현  80  89   95   90
인아  70  95  100   90
```

```py
df.iloc[0][3] = 33
print(df)
```

```
    수학  영어   음악  체육
이름
서준  90  98   85  33
우현  80  89   95  90
인아  70  95  100  90
```

```py
df.loc['서준']['체육'] = 99
print(df)
```

```
    수학  영어   음악  체육
이름
서준  90  98   85  99
우현  80  89   95  90
인아  70  95  100  90
```

```py
df.loc['서준', '체육'] = 90
print(df)
```

```
    수학  영어   음악  체육
이름
서준  90  98   85  90
우현  80  89   95  90
인아  70  95  100  90
```

```py
df.loc['서준', ['음악', '체육']] = 50
print(df)
```

```
    수학  영어   음악  체육
이름
서준  90  98   50  50
우현  80  89   95  90
인아  70  95  100  90
```

```py
df.loc['서준', ['음악', '체육']] = 100, 50
print(df)
```

```
    수학  영어   음악  체육
이름
서준  90  98  100  50
우현  80  89   95  90
인아  70  95  100  90
```


## 행, 열 위치 바꾸기 (transpose())
> 형식 : DataFrame 객체.transpose() 또는 DataFrame 객체.T

### 원래 데이터
```py
exam_data = {'이름' : [ '서준', '우현', '인아'],
             '수학' : [ 90, 80, 70],
             '영어' : [ 98, 89, 95],
             '음악' : [ 85, 95, 100],
             '체육' : [ 100, 90, 90]}
df = pd.DataFrame(exam_data)
df.set_index('이름', inplace=True)
print("exam_data :: ", df)
print('=======================================')
print('\n')
```

```
    수학  영어   음악   체육
이름
서준  90  98   85  100
우현  80  89   95   90
인아  70  95  100   90
```

### transpose() : 행과 열을 바꾼다.

```py
df = df.transpose()
print(df)
```

```
    이름   서준  우현   인아
수학   90  80   70
영어   98  89   95
음악   85  95  100
체육  100  90   90
```

---------------------

## 덧셈, 뺄셈, 곱셈, 나눗셈 연산

```py
exam_data = {'이름' : [ '서준', '우현', '인아'],
             '수학' : [ 90, 80, 70],
             '영어' : [ 98, 89, 95],
             '음악' : [ 85, 95, 100],
             '체육' : [ 100, 90, 90]}
df = pd.DataFrame(exam_data)
ndf = df.set_index('이름') # inplace가 false이면 원본은 그대로 두고 새로운 객체를 반환한다.
print(ndf)

## index 초기화
ndf2 = ndf.reset_index()
print(ndf2)

student1 = pd.Series({'국어':100, '영어':80, '수학':90})
student2 = pd.Series({'수학':80, '국어':90, '영어':80})
print(student1)
print('\n')
print(student2)
print('\n')
addition = student1 + student2               #덧셈
subtraction = student1 - student2            #뺄셈
multiplication = student1 * student2         #곱셈
division = student1 / student2               #나눗셈
print(type(division))
result = pd.DataFrame([addition, subtraction, multiplication, division],
                      index=['덧셈', '뺄셈', '곱셈', '나눗셈'])
print(result)
```