---
title: 머신러닝 - [PyTorch 기초] 숲속 나무 종류 예측하기
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
description: PyTorch 숲속 나무 종류 예측하기
article_tag1: AI
article_tag2: MachineLearning
article_tag3: 
article_section: 
meta_keywords: AI, MachineLearning, Regression
last_modified_at: '2025-08-14 21:00:00 +0800'
---


# [PyTorch] 숲속 나무 종류 예측하기: fetch\_covtype 데이터셋으로 배우는 딥러닝 모델링 A to Z

인공지능은 어떻게 광활한 숲속 나무의 종류를 구분할 수 있을까요? 이번 포스트에서는 Scikit-learn의 `fetch_covtype` 데이터셋을 활용하여, 54개의 지리적 특성으로 7가지 종류의 나무를 분류하는 딥러닝 모델을 만들어 보겠습니다.

이 글은 인공지능 기초 과정의 전체 흐름을 따르며, 단순히 코드를 나열하는 것을 넘어 각 단계가 갖는 의미와 핵심 개념을 깊이 있게 이해하는 것을 목표로 합니다.

**🚀 전체 과정:**

1.  **데이터 파헤치기 (EDA)**
2.  **인공지능 두뇌 설계 (PyTorch 모델링)**
3.  **모델 훈련 및 성능 검증**
4.  **심화 개념 (왜 CNN이 필요한가?)**

-----

## 📚 1단계: 데이터 파헤치기 - 탐색적 데이터 분석 (EDA)

모델을 만들기 전, 우리가 다룰 데이터가 무엇인지 이해하는 과정이 가장 중요합니다. \*\*탐색적 데이터 분석(Exploratory Data Analysis, EDA)\*\*을 통해 데이터의 특징과 패턴을 파악하고 모델링 전략을 세워보겠습니다.

### 데이터 로드와 첫 만남

`fetch_covtype` 데이터셋은 미국 콜로라도 야생 지역의 나무 종류(Cover Type)를 예측하는 과제를 담고 있습니다. 고도, 경사, 토양 종류 등 \*\*54개의 특성(Feature)\*\*을 사용해 **7가지 나무 종류(Class)** 중 하나로 분류하는 **다중 클래스 분류(Multi-class Classification)** 문제입니다.

```python
# 필요한 라이브러리 로드
import pandas as pd
from sklearn.datasets import fetch_covtype

# 데이터 로드
covtype = fetch_covtype()

# 데이터에 대한 설명 확인
# print(covtype.DESCR)

# 분석하기 편한 pandas DataFrame으로 변환
df = pd.DataFrame(covtype.data, columns=covtype.feature_names)
df['target'] = covtype.target
```

### 데이터 속 숨은 단서 찾기

이제 데이터프레임의 여러 함수를 통해 데이터를 직접 관찰하며 인사이트를 찾아봅니다.

  * `df.head()`: 데이터의 처음 5행을 보며 구조를 파악합니다.
  * `df.info()`: 각 컬럼의 데이터 타입과 비어있는 값(결측치) 유무를 확인합니다. 다행히 이 데이터셋에는 결측치가 없습니다.
  * `df.describe()`: **매우 중요한 과정**입니다. 각 특성의 개수, 평균, 표준편차, 최소/최대값 등 기술 통계량을 보여줍니다.

> 🔍 **Point: `describe()`에서 최소/최대값을 왜 눈여겨봐야 할까?**
>
> 통계량을 보면 어떤 특성은 값이 0\~255 사이인 반면, 고도(Elevation) 같은 특성은 0\~7000대의 값을 갖는 등 **특성 간의 값의 범위(Scale)가 크게 다름**을 알 수 있습니다. 이렇게 스케일이 차이 나면 모델이 특정 특성에만 과도하게 영향을 받을 수 있으므로, 추후에 \*\*데이터 스케일링(Data Scaling)\*\*과 같은 전처리를 고려해볼 수 있습니다.
> 또한, `target` 컬럼의 min/max가 1과 7인 것을 통해 우리가 예측할 클래스가 7개라는 사실을 다시 한번 확인할 수 있습니다.

-----

## 🧠 2단계: 인공지능 두뇌 설계하기 - PyTorch 모델링

데이터 탐색을 마쳤으니, 이제 PyTorch를 이용해 나무 종류를 분류할 신경망 모델을 만듭니다.

### 모델 구조 설계

```python
import torch
import torch.nn as nn

# 모델 클래스 정의
class CovTypeModel(nn.Module):
    def __init__(self, input_size, output_size):
        super(CovTypeModel, self).__init__()
        self.layer = nn.Sequential(
            nn.Linear(input_size, 128),
            nn.ReLU(),
            nn.Linear(128, output_size)
        )

    def forward(self, x):
        x = self.layer(x)
        return x
```

  * `nn.Module`: PyTorch의 모든 신경망 모델은 `nn.Module`을 상속받아 만듭니다.
  * `nn.Sequential`: 여러 개의 레이어를 순서대로 쌓아놓은 컨테이너입니다.
  * `nn.Linear(54, 128)`: 54개의 입력 특성을 받아 128개의 노드로 연결하는 \*\*선형 레이어(Fully Connected Layer)\*\*입니다.
  * `nn.ReLU()`: 모델에 \*\*비선형성(non-linearity)\*\*을 부여하는 **활성화 함수**입니다. 이게 없다면 여러 층을 쌓는 의미가 희미해지죠.
  * `nn.Linear(128, 7)`: 128개 노드로부터 최종적으로 7개 클래스에 대한 예측값을 출력합니다.

### 모델을 위한 데이터 준비

모델에 입력하려면 데이터를 PyTorch가 이해할 수 있는 **Tensor** 객체로 변환하고, 학습용과 평가용으로 분리해야 합니다.

```python
from sklearn.model_selection import train_test_split

# 특성(X)과 타겟(y) 분리
X = df.drop('target', axis=1).values
y = df['target'].values

# 학습용(80%)과 평가용(20%) 데이터 분리
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Numpy 배열을 PyTorch Tensor로 변환
X_train = torch.FloatTensor(X_train)
X_test = torch.FloatTensor(X_test)
y_train = torch.LongTensor(y_train)
y_test = torch.LongTensor(y_test)
```

> 💡 **왜 데이터를 분리할까요?**
>
> 모델을 학습시킨 데이터로 평가하는 것은 마치 시험공부한 문제지로 시험을 보는 것과 같습니다. 당연히 점수가 높겠죠. 우리가 원하는 것은 모델이 **처음 보는 데이터**에 대해서도 얼마나 잘 예측하는지, 즉 일반화 성능을 아는 것입니다. 그래서 데이터를 **학습용**과 **평가용**으로 반드시 나눠야 합니다.

-----

## ⚙️ 3단계: 모델 훈련 및 성능 검증

이제 똑똑한 모델을 만들기 위한 훈련(Training)을 시작하고, 그 성능을 객관적으로 검증합니다.

### 학습의 핵심 요소들

  * **Optimizer (최적화 도구)**: `torch.optim.Adam`을 사용합니다. Adam은 모델의 예측이 정답에 가까워지도록 파라미터(가중치)를 효율적으로 업데이트하는 똑똑한 알고리즘입니다.
  * **Criterion (손실 함수)**: `nn.CrossEntropyLoss`를 사용합니다. 모델의 예측이 실제 정답과 얼마나 다른지(오차, 손실)를 계산하는 함수입니다. **학습의 목표는 이 손실(loss) 값을 최소화하는 것**입니다.

### 학습 과정 엿보기 (Training Loop)

아래 코드가 바로 모델을 학습시키는 핵심 루프입니다.

```python
# ... (optimizer, criterion, model 초기화) ...
for epoch in range(n_epochs):
    # 1. 순전파 (Forward Pass): 모델에 데이터를 넣어 예측값 계산
    y_pred, _ = model(X_train)

    # 2. 손실 계산: 예측값과 실제 정답 비교
    loss = criterion(y_pred, target)

    # 3. 기울기 초기화
    optimizer.zero_grad()
    
    # 4. 역전파 (Backpropagation): 손실을 줄이기 위해 각 파라미터의 기울기 계산
    loss.backward()

    # 5. 파라미터 업데이트: 계산된 기울기에 따라 파라미터 값 수정
    optimizer.step()
```

> 🔍 **Point: 꼭 알아야 할 핵심 개념들**
>
>   * `target = y_train - 1` **의 비밀**: `fetch_covtype` 데이터의 레이블은 1\~7입니다. 하지만 PyTorch의 `CrossEntropyLoss`는 클래스 번호가 **0부터 시작(0, 1, ..., 6)할 것으로 예상**합니다. 따라서 모든 타겟 값에서 1을 빼주어 `[1, 7]` 범위를 `[0, 6]` 범위로 맞춰주는 것입니다. 이는 컴퓨터가 인덱스를 0부터 세기 때문에 발생하는 흔한 데이터 전처리 과정입니다.
>   * **Loss가 갑자기 올라가는 이유**: 학습 과정에서 Loss는 보통 감소하지만, 때때로 출렁이며 증가할 수 있습니다. 이는 최적의 해를 찾아가는 과정이 항상 매끄럽지만은 않기 때문입니다. 마치 산을 내려갈 때 가장 낮은 길을 찾기 위해 작은 언덕을 잠시 오르내리는 것과 같습니다. 보통 학습률(learning rate)이 너무 크거나 데이터 자체가 복잡할 때 나타나는 자연스러운 현상입니다.
>   * `model.train()` vs `model.eval()`:
>       * `model.train()`: 모델을 **학습 모드**로 설정합니다. 드롭아웃(Dropout)이나 배치 정규화(Batch Normalization)처럼 학습 시에만 필요한 기능들을 활성화합니다.
>       * `model.eval()`: 모델을 **평가 모드**로 설정합니다. 위 기능들을 비활성화하여 일관성 있는 예측 결과를 얻기 위함입니다. 학습 중간에 테스트 데이터로 성능을 확인할 때는 반드시 `eval()` 모드로 전환해야 합니다.

### 결과 분석: 우리 모델은 얼마나 똑똑해졌을까?

**Loss 그래프 분석**
학습이 진행됨에 따라 Training Loss와 Test Loss가 어떻게 변하는지 관찰하는 것은 매우 중요합니다.

  * **이상적인 상황**: 두 loss가 함께 꾸준히 감소하며 낮은 값으로 수렴합니다.
  * **과적합(Overfitting)**: Training loss는 계속 감소하는데 Test loss가 어느 시점부터 다시 상승하는 경우입니다. 모델이 학습 데이터에만 너무 익숙해져서, 새로운 데이터에는 오히려 성능이 떨어지는 현상입니다.

**정확도(Accuracy) 분석**
66%의 정확도는 어느 정도의 성능일까요?

> 🔍 **Point: "66%면 학습이 된 건가요?"**
>
> 총 7개의 클래스가 있으므로, 아무것도 모르는 상태에서 무작위로 찍었을 때 맞출 확률은 1/7, 즉 약 \*\*14.3%\*\*입니다. 66%의 정확도는 무작위 추측보다 월등히 높은 수치이며, 이는 **모델이 데이터로부터 유의미한 패턴을 성공적으로 학습했음**을 의미합니다. 물론 100%에 비하면 아쉽지만, "학습이 잘 이루어졌다"고 판단할 충분한 근거가 됩니다.

-----

## 💡 4단계 (심화): 왜 우리는 CNN을 배워야 할까?

지금까지 다룬 데이터는 54개 특성이 나열된 표(tabular) 데이터였습니다. 만약 데이터가 **이미지**라면 어떨까요? 여기서 `nn.Linear` (완전연결계층)의 한계와 CNN의 필요성이 드러납니다.

### 완전연결계층(Fully Connected Layer)의 한계

예를 들어, `256x256` 픽셀의 컬러(RGB, 3채널) 이미지를 `nn.Linear`에 입력한다고 가정해 봅시다.

1.  이미지를 1차원 벡터로 펼쳐야 합니다.
      * 입력 노드의 수 = `256 * 256 * 3` = **196,608개**
2.  이것이 128개 노드의 은닉층으로 연결된다면, 첫 번째 레이어에만 필요한 파라미터(가중치+편향)의 수는?
      * `(196,608 * 128) + 128` = `25,165,824 + 128` = **25,165,952개**

> 😱 **"첫 번째 층에만 파라미터가 2,500만 개?"**
>
> 맞습니다. 이처럼 입력 데이터의 차원이 커짐에 따라 파라미터 수가 기하급수적으로 늘어나는 것을 \*\*'차원의 저주'\*\*라고도 부릅니다. 이는 엄청난 계산량과 메모리를 요구하며, 모델을 과적합시키기 매우 쉬운 환경을 만듭니다.

### CNN의 스마트한 해결책: 특징 추출과 파라미터 공유

CNN(Convolutional Neural Network)은 바로 이 문제를 해결하기 위해 등장했습니다.

> "사람은 이미지의 모든 픽셀 값을 보고 사물을 구분하지 않습니다. '고양이는 뾰족한 귀와 수염이 있다' 와 같은 **핵심적인 특징(Feature)과 패턴**으로 분류합니다."

이것이 CNN의 핵심 아이디어입니다.

1.  **특징 추출 (Feature Extraction)**: CNN은 \*\*커널(Kernel) 또는 필터(Filter)\*\*라는 작은 창문으로 이미지의 일부 영역을 훑으면서 \*\*지역적인 특징(Local Feature)\*\*을 뽑아냅니다. 어떤 커널은 '뾰족한 귀'를, 다른 커널은 '둥근 코'와 같은 특징을 감지하도록 학습됩니다.

2.  **파라미터 공유 (Parameter Sharing)**: '뾰족한 귀'를 감지하는 **하나의 커널**이 이미지의 왼쪽 위, 중앙, 오른쪽 아래 등 모든 위치를 돌아다니며 동일하게 적용됩니다. 즉, 특징을 감지하는 파라미터(커널의 값)를 이미지 전체에서 **공유**하는 것입니다.

이 두 가지 강력한 아이디어 덕분에, CNN은 완전연결계층에 비해 **훨씬 적은 파라미터**로 이미지의 공간적인 구조와 패턴을 효과적으로 학습할 수 있습니다. 이것이 바로 이미지 처리 분야에서 CNN이 압도적인 성능을 보이는 이유입니다.