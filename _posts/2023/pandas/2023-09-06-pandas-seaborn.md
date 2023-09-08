---
title: Pandas - Seaborn 이란?
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
description: Pandas - Seaborn
article_tag1: Pandas
article_tag2: Seaborn  
article_tag3: 
article_section: Pandas
meta_keywords: Pandas, Seaborn
last_modified_at: '2023-09-05 21:00:00 +0800'
---

## seaborn 이란?
seaborn은 python 기본 데이터셋을 제공한다.
seaborn을 사용하면, 데이터셋을 불러오는 코드를 작성할 필요가 없다.
> 형식은 seaborn.load_dataset('데이터셋 이름')
 titanic은 seaborn에서 제공하는 데이터셋 이름이다.
 
```py
titanic = sns.load_dataset('titanic')
df = titanic.loc[:, ['age', 'fare']]
print(df)
```

```
#출력
0    22.0   7.2500
1    38.0  71.2833
2    26.0   7.9250
3    35.0  53.1000
4    35.0   8.0500
..    ...      ...
886  27.0  13.0000
887  19.0  30.0000
888   NaN  23.4500
889  26.0  30.0000
890  32.0   7.7500
```
------------ 

```py
print("head :: ", df.head()) #head() : 처음 5행만 표시
print('\n')

#첫 5행만 표시
addition = df + 10 # 모든 데이터에 10씩 더하기
print("addition head :: ", addition.head()) 
print('\n')
print(type(addition))
```

```
#출력
    age     fare
0  32.0  17.2500
1  48.0  81.2833
2  36.0  17.9250
3  45.0  63.1000
```