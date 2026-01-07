---
title: 머신러닝 - EDA부터 분류 모델까지(Seaborn 라이브러리와 펭귄 데이터)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- MachineLearning
tags:
- AI
- MachineLearning
toc: true
toc_sticky: true
toc_label: 목차
description: 머신러닝 - EDA부터 분류 모델까지(Seaborn 라이브러리와 펭귄 데이터)
article_tag1: AI
article_tag2: MachineLearning
article_tag3: 
article_section: 
meta_keywords: AI, MachineLearning
last_modified_at: '2025-08-10 21:00:00 +0800'
---


펭귄 데이터 탐색 및 전처리

**seaborn 라이브러리에 내장된 펭귄(penguins) 데이터셋**을 사용해 데이터의 특성을 파악하고 머신러닝 모델에 적용할 수 있도록 데이터를 가공하는 **탐색적 데이터 분석(EDA) 및 전처리 과정**을 살펴보도록 하겠습니다.

주요 분석 목표는 펭귄의 신체 측정 데이터(부리 길이, 부리 깊이 등)를 기반으로 **펭귄의 종(species)을 예측**하기 위한 사전 작업을 수행하는 것입니다.

-----

### 분석 과정 및 코드 설명

#### 1\. 데이터 로드 및 기본 탐색

```python
# 필요한 라이브러리 불러오기
import seaborn as sns
import pandas as pd
# ... (생략) ...

# 데이터 로드 & 기본 확인
penguins = sns.load_dataset("penguins") # seaborn에서 펭귄 데이터셋 로드
print(penguins.shape) # 데이터의 행/열 개수 출력 (344, 7)
display(penguins.head()) # 데이터 앞부분 5개 행 확인
penguins.info() # 데이터의 타입, 결측치 등 요약 정보 확인
penguins.describe(include="all") # 기술 통계량 확인
```

```
species	island	bill_length_mm	bill_depth_mm	flipper_length_mm	body_mass_g	sex
0	Adelie	Torgersen	39.1	18.7	181.0	3750.0	Male
1	Adelie	Torgersen	39.5	17.4	186.0	3800.0	Female
2	Adelie	Torgersen	40.3	18.0	195.0	3250.0	Female
3	Adelie	Torgersen	NaN	NaN	NaN	NaN	NaN
4	Adelie	Torgersen	36.7	19.3	193.0	3450.0	Female
```

```
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 344 entries, 0 to 343
Data columns (total 7 columns):
 #   Column             Non-Null Count  Dtype  
---  ------             --------------  -----  
 0   species            344 non-null    object 
 1   island             344 non-null    object 
 2   bill_length_mm     342 non-null    float64
 3   bill_depth_mm      342 non-null    float64
 4   flipper_length_mm  342 non-null    float64
 5   body_mass_g        342 non-null    float64
 6   sex                333 non-null    object 
dtypes: float64(4), object(3)
memory usage: 18.9+ KB
```

```
species	island	bill_length_mm	bill_depth_mm	flipper_length_mm	body_mass_g	sex
count	344	344	342.000000	342.000000	342.000000	342.000000	333
unique	3	3	NaN	NaN	NaN	NaN	2
top	Adelie	Biscoe	NaN	NaN	NaN	NaN	Male
freq	152	168	NaN	NaN	NaN	NaN	168
mean	NaN	NaN	43.921930	17.151170	200.915205	4201.754386	NaN
std	NaN	NaN	5.459584	1.974793	14.061714	801.954536	NaN
min	NaN	NaN	32.100000	13.100000	172.000000	2700.000000	NaN
25%	NaN	NaN	39.225000	15.600000	190.000000	3550.000000	NaN
50%	NaN	NaN	44.450000	17.300000	197.000000	4050.000000	NaN
75%	NaN	NaN	48.500000	18.700000	213.000000	4750.000000	NaN
max	NaN	NaN	59.600000	21.500000	231.000000	6300.000000	NaN
```

분석을 시작하기 위해 필요한 라이브러리(pandas, seaborn 등)를 불러온 후, `sns.load_dataset()` 함수로 펭귄 데이터를 불러옵니다.

  * `penguins.shape`: 데이터가 \*\*344개의 행(데이터)과 7개의 열(특성)\*\*로 이루어져 있음을 확인합니다.
  * `penguins.head()`: 데이터를 직접 눈으로 확인하며 어떤 값들이 있는지 파악합니다.
  * `penguins.info()`: 각 열의 데이터 타입(숫자형 float64, 문자열 object)과 \*\*결측치(Non-Null Count)\*\*가 있는지 확인합니다. `bill_length_mm`, `sex` 등 여러 열에 결측치가 있음을 알 수 있습니다.
  * `penguins.describe()`: 숫자형 데이터의 평균, 표준편차, 최솟값, 최댓값 등을 확인하고, 문자열 데이터의 고유값 개수(unique), 최빈값(top) 등을 파악합니다.

#### 2\. 결측치 처리

결측치(Missing Value)란? 데이터셋에서 값이 비어 있는 상태, 즉 기록되지 않았거나 측정되지 않은 값을 말합니다.


```python
# 결측치 처리
penguins.isnull().sum() # 각 열의 결측치 개수 확인
penguins = penguins.dropna() # 결측치가 있는 행을 모두 제거
penguins.isnull().sum() # 결측치가 모두 제거되었는지 재확인
```

```
species              0
island               0
bill_length_mm       0
bill_depth_mm        0
flipper_length_mm    0
body_mass_g          0
sex                  0
dtype: int64
```


`info()`에서 확인한 결측치를 처리하는 과정입니다. 머신러닝 모델은 대부분 결측치가 있는 데이터를 처리하지 못하기 때문에 이 과정은 필수적입니다. 여기서는 가장 간단한 방법인 \*\*결측치가 포함된 행을 모두 제거(`dropna()`)\*\*하는 방식을 사용했습니다. 처리 후 데이터는 333개로 줄어들었습니다.

#### 3\. 탐색적 데이터 분석 (EDA) 및 시각화

결측치 처리 후, 데이터의 분포와 특성 간의 관계를 시각적으로 파악합니다.

```python
fig, axes = plt.subplots(1, 2, figsize=(12,4))
# 왼쪽: 종(species) 별 데이터 개수
sns.countplot(data=penguins, x="species", ax=axes[0])
# 오른쪽: 부리 길이와 깊이의 관계 (종 별로 색상 구분)
sns.scatterplot(data=penguins, x="bill_length_mm", y="bill_depth_mm", hue="species", ax=axes[1])
plt.show()
```

![대체 텍스트](/home/hong/amirer21.github.io/assets/images/ai/output.png)

  * **왼쪽 (Class Distribution):** `countplot`은 **각 종(species)에 해당하는 펭귄의 수**를 보여줍니다. Adelie 종이 가장 많고, Chinstrap 종이 가장 적어 데이터가 다소 불균형함을 알 수 있습니다.
  * **오른쪽 (bill\_length vs bill\_depth):** `scatterplot`은 **부리 길이(bill\_length\_mm)와 부리 깊이(bill\_depth\_mm)의 관계**를 나타냅니다.
      * **Adelie** (파란색): 부리 길이가 짧고 깊이가 다양하게 분포합니다.
      * **Chinstrap** (주황색): 부리 길이가 길고 깊이도 깊은 편에 속합니다.
      * **Gentoo** (초록색): 부리 길이는 길지만 깊이는 얕은, 뚜렷한 군집을 형성합니다.
      * ➡️ 이처럼 **종(species)에 따라 부리의 형태가 시각적으로 잘 구분**되므로, 이 두 특성은 펭귄의 종을 예측하는 데 매우 중요한 역할을 할 것임을 짐작할 수 있습니다.

#### 4\. 데이터 전처리 (인코딩)

머신러닝 모델이 이해할 수 있도록 문자열 데이터를 숫자형 데이터로 변환하는 과정입니다.

```python
# 문자열 → 숫자 변환
df = penguins.copy()
y = df["species"] # 예측할 대상(타겟)인 'species'를 y에 저장
X = df.drop(columns=["species"]) # 타겟을 제외한 나머지 특성들을 X에 저장

# 타겟 인코딩 (LabelEncoder)
le_species = LabelEncoder()
y = le_species.fit_transform(y) # "Adelie", "Chinstrap", "Gentoo"를 각각 0, 1, 2로 변환

# 특성 인코딩 (원-핫 인코딩)
cat_cols = X.select_dtypes(include=["object", "category"]).columns
X = pd.get_dummies(X, columns=cat_cols, drop_first=True) # 'island', 'sex'를 0과 1로 이루어진 열로 변환
```

  * **라벨 인코딩 (Label Encoding):** 예측해야 할 목표 값인 `species` 열의 "Adelie", "Chinstrap", "Gentoo"라는 문자열을 각각 0, 1, 2와 같은 숫자로 변환합니다.
  * **원-핫 인코딩 (One-Hot Encoding):** `island`, `sex`와 같은 범주형 특성을 0과 1로 이루어진 가변수(dummy variable)로 변환합니다. 예를 들어 `sex` 열은 `sex_Male`이라는 새로운 열로 바뀌고, 성별이 남성이면 1, 아니면 0의 값을 갖게 됩니다.

#### 5\. 상관관계 분석

전처리가 완료된 숫자형 데이터들 간의 상관관계를 분석합니다.

```python
# 상관관계(숫자형만)
plt.figure(figsize=(8,6))
sns.heatmap(pd.DataFrame(X).corr(), cmap="coolwarm")
plt.title("penguins: feature correlation")
plt.show()
```

![대체 텍스트](/home/hong/amirer21.github.io/assets/images/ai/output2.png)

`heatmap`은 특성 간의 **상관관계**를 색상으로 표현한 것입니다.

  * **진한 빨간색**에 가까울수록 **강한 양의 상관관계**를 의미합니다. (예: `flipper_length_mm`와 `body_mass_g` - 날개(지느러미) 길이가 길수록 몸무게도 많이 나가는 경향)
  * **진한 파란색**에 가까울수록 **강한 음의 상관관계**를 의미합니다. (예: `bill_depth_mm`와 `flipper_length_mm` - 부리 깊이가 깊을수록 날개 길이는 짧아지는 경향)
  * **색이 옅을수록** 상관관계가 **약함**을 의미합니다.
  * ➡️ 이 분석을 통해 서로 매우 높은 상관관계를 갖는 **중복된 특성을 제거**하거나, 모델 성능에 영향을 줄 수 있는 **다중공선성(multicollinearity) 문제를 미리 파악**할 수 있습니다.



#### 6\. 데이터 분할 및 스케일링

```python
# 데이터 분할/스케일링
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)
```

모델을 학습시키기 전에 데이터를 두 그룹으로 나눕니다.

  * **`train_test_split`**: 데이터를 \*\*학습용(Training set)\*\*과 \*\*테스트용(Test set)\*\*으로 분리합니다.
      * `test_size=0.2`: 전체 데이터의 80%를 학습에, 20%를 모델 성능 평가에 사용합니다.
      * `stratify=y`: 학습용과 테스트용 데이터에 있는 펭귄 종(Adelie, Chinstrap, Gentoo)의 비율이 원래 데이터의 비율과 동일하게 유지되도록 합니다. 이는 데이터 불균형으로 인한 학습 왜곡을 방지합니다.
  * **`StandardScaler`**: **데이터 스케일링**을 수행합니다. 각 특성(부리 길이, 몸무게 등)은 단위와 범위가 모두 다르기 때문에, 이를 표준화하여 모든 특성이 모델에 공평하게 영향을 주도록 만듭니다.
      * `fit_transform`은 학습용 데이터에 맞춰 스케일링 규칙을 만들고 적용합니다.
      * `transform`은 학습용 데이터에서 만든 그 규칙을 그대로 테스트용 데이터에 적용합니다. (테스트 데이터의 정보가 학습 과정에 유출되는 것을 방지하기 위함)

#### 7\. 모델 학습 및 성능 평가

```python
# 모델 학습/평가 (Logistic Regression)
clf_peng = LogisticRegression(max_iter=5000) # 로지스틱 회귀 모델 생성
clf_peng.fit(X_train_scaled, y_train) # 스케일링된 학습 데이터로 모델을 학습
y_pred = clf_peng.predict(X_test_scaled) # 학습된 모델로 테스트 데이터의 종을 예측

print("Accuracy:", accuracy_score(y_test, y_pred)) # 정확도 출력
print("\nClassification Report:\n", classification_report(y_test, y_pred, target_names=le_species.classes_)) # 분류 리포트 출력
```

  * **`LogisticRegression`**: 분류 문제에 널리 사용되는 로지스틱 회귀 모델을 생성합니다.
  * **`fit`**: 준비된 학습용 데이터(`X_train_scaled`, `y_train`)를 사용하여 모델에게 펭귄의 신체 특징과 종 사이의 패턴을 학습시킵니다.
  * **`predict`**: 학습이 완료된 모델을 이용해, 한 번도 본 적 없는 테스트 데이터(`X_test_scaled`)의 펭귄 종을 예측합니다.
  * **`accuracy_score` (정확도)**: **전체 테스트 데이터 중 모델이 얼마나 정확하게 예측했는지**를 나타냅니다. `0.985`는 약 \*\*98.5%\*\*의 매우 높은 정확도를 보였음을 의미합니다.
  * **`classification_report` (분류 리포트)**: 정확도보다 더 상세한 성능 지표를 보여줍니다.
      * **precision (정밀도)**: 모델이 특정 종으로 예측한 것 중, 실제 그 종이었던 비율. (예: Adelie의 정밀도 1.00은 모델이 Adelie라고 예측한 펭귄은 100% 진짜 Adelie였음을 의미)
      * **recall (재현율)**: 실제 특정 종인 것 중, 모델이 그 종이라고 올바르게 예측한 비율. (예: Adelie의 재현율 0.97은 실제 Adelie 펭귄 중 97%를 Adelie라고 맞혔음을 의미)
      * **f1-score**: 정밀도와 재현율의 조화 평균으로, 두 지표가 모두 중요할 때 사용됩니다.

#### 8\. 혼동 행렬 (Confusion Matrix) 시각화

```python
# 혼동 행렬 시각화
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
            xticklabels=le_species.classes_, yticklabels=le_species.classes_)
plt.xlabel("Predicted") # X축: 모델의 예측값
plt.ylabel("Actual") # Y축: 실제 정답값
plt.title("penguins: Confusion Matrix")
plt.show()
```

**혼동 행렬**은 모델이 어떤 클래스를 어떤 클래스로 잘못 예측했는지 한눈에 보여주는 표입니다. 이를 통해 모델의 약점을 파악할 수 있습니다.

-----

### 이미지 결과 분석: Confusion Matrix

위의 혼동 행렬 이미지는 모델의 예측 결과를 시각적으로 요약한 것입니다.

  * **축 의미**:
      * **Y축 (Actual)**: 실제 펭귄의 종
      * **X축 (Predicted)**: 모델이 예측한 펭귄의 종
  * **대각선 (진한 파란색 셀)**: **정답을 맞힌 경우**
      * `(Actual: Adelie, Predicted: Adelie)` = **28**: 실제 Adelie 펭귄 28마리를 Adelie라고 정확히 예측했습니다.
      * `(Actual: Chinstrap, Predicted: Chinstrap)` = **14**: 실제 Chinstrap 펭귄 14마리를 모두 정확히 예측했습니다.
      * `(Actual: Gentoo, Predicted: Gentoo)` = **24**: 실제 Gentoo 펭귄 24마리를 모두 정확히 예측했습니다.
  * **대각선 외 (밝은 색 셀)**: **오답인 경우**
      * `(Actual: Adelie, Predicted: Chinstrap)` = **1**: **실제로는 Adelie인 펭귄 1마리를 Chinstrap이라고 잘못 예측**했습니다. 이것이 이 모델이 저지른 유일한 실수입니다.
      * 나머지 칸은 모두 0으로, 추가적인 실수는 없었습니다.

**결론적으로, 이 로지스틱 회귀 모델은 펭귄의 종을 분류하는 데 매우 뛰어난 성능(정확도 98.5%)을 보였으며, 단 1건의 오류만 발생시킨 것을 혼동 행렬을 통해 명확히 확인할 수 있습니다.**



### 결론

해당 코드는 **펭귄의 종을 분류**하기 위한 데이터 분석의 초기 단계를 보여줍니다.

1.  **분석 대상:** 펭귄의 종, 서식지, 신체 측정치(부리 길이/깊이, 날개 길이, 몸무게), 성별 데이터
2.  **분석 과정:** 데이터 로드 → 결측치 제거 → 시각화를 통한 데이터 특성 파악 → 머신러닝을 위한 데이터 인코딩 → 특성 간 상관관계 분석

3.  **분석 결과:**
      * 펭귄의 종(species)은 부리 길이, 부리 깊이 등 **신체적 특징으로 뚜렷하게 구분**될 수 있음을 시각적으로 확인했습니다.
      * 날개 길이와 몸무게처럼 **서로 강한 상관관계를 가지는 특성들**이 존재함을 파악했습니다.
      * 모든 데이터를 숫자 형태로 변환하여 **머신러닝 모델 학습에 바로 사용할 수 있는 상태로 준비**를 마쳤습니다.