---
title: 머신러닝 - [PyTorch 기초] 딥러닝으로 회귀(Regression) 모델 만들기 - 당뇨병 데이터 예측
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
description: 딥러닝으로 회귀(Regression) 모델 만들기 - 당뇨병 데이터 예측
article_tag1: AI
article_tag2: MachineLearning
article_tag3: 
article_section: 
meta_keywords: AI, MachineLearning, Regression
last_modified_at: '2025-08-14 21:00:00 +0800'
---


이번 글에서는 파이토치(PyTorch)를 사용해 가장 기본적인 머신러닝 문제 중 하나인 **회귀(Regression)** 모델을 만드는 과정을 정리해보려고 합니다. 
이론과 실습 코드를 함께 살펴보겠습니다.

이번에 다루는 주제인 "회귀 모델링"은 인공지능의 큰 그림에서 다음과 같은 위치에 있습니다.

  - **인공지능 (AI)**: 기계가 인간처럼 학습하고 사고하는 기술
  - **머신러닝 (Machine Learning)**: 데이터로부터 스스로 패턴을 학습하는 AI의 한 분야
  - **딥러닝 (Deep Learning)**: 인간의 뇌 신경망을 모방한 '인공신경망'을 사용한 머신러닝 기법
  - **지도학습 (Supervised Learning)**: '문제(Input)'와 '정답(Label)'이 함께 있는 데이터를 사용해 학습
  - **회귀 (Regression)**: '집값', '주가', '온도'처럼 **연속적인 숫자**를 예측하는 문제

즉, 이번 실습은 **딥러닝** 기술을 이용해 **지도학습** 기반의 **회귀** 문제를 푸는 과정입니다.

-----

## 2 프로젝트 파이프라인 📊

모든 머신러닝 프로젝트는 비슷한 흐름을 따릅니다. 이 순서를 기억하면 전체 과정을 이해하기 쉽습니다.

1.  **데이터 준비 및 탐색**: 사용할 데이터를 불러오고 특성을 파악합니다. (EDA)
2.  **모델 설계**: 데이터로부터 예측을 수행할 인공신경망의 구조를 정의합니다.
3.  **학습 설정**: 모델을 어떤 기준으로, 어떤 방식으로 학습시킬지 손실 함수와 옵티마이저를 정합니다.
4.  **모델 훈련**: 데이터를 모델에 반복적으로 입력하며 최적의 예측을 하도록 훈련시킵니다.
5.  **성능 평가**: 훈련된 모델이 새로운 데이터에도 잘 작동하는지 평가합니다.

-----

## 3 코드와 함께 배우기 ✍️

이제 위 파이프라인에 따라 코드를 단계별로 살펴보겠습니다.

### Step 1: 데이터 준비 및 탐색

먼저, 필요한 라이브러리와 `scikit-learn`에 내장된 당뇨병 데이터를 불러옵니다. 이 데이터는 환자의 정보(나이, BMI, 혈압 등 10개)를 바탕으로 1년 후의 당뇨 진행 지수를 예측하는 데 사용됩니다.

```python
# !pip install scikit-learn
import torch
import torch.nn as nn
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split

# 데이터 로드
diabetes_data = load_diabetes()
X = torch.Tensor(diabetes_data.data)
y = torch.Tensor(diabetes_data.target)

# 데이터를 훈련용과 테스트용으로 분리 (8:2 비율)
# 모델이 처음 보는 데이터로 성능을 공정하게 평가하기 위함
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"훈련 데이터 크기: {X_train.shape}")
print(f"테스트 데이터 크기: {X_test.shape}")
```

### Step 2: 모델 설계

이제 데이터를 입력받아 예측값을 출력할 인공신경망 모델을 설계합니다.

```python
class DiabetesModel(nn.Module):
    def __init__(self, input_size, output_size):
        super(DiabetesModel, self).__init__()
        # nn.Sequential: 여러 레이어를 순서대로 담는 컨테이너
        self.model = nn.Sequential(
            # 입력 특성 10개를 받아 16개 노드로 변환
            nn.Linear(input_size, 16),
            # 비선형성을 추가해 모델의 표현력을 높이는 활성화 함수
            nn.ReLU(),
            # 16개 노드를 받아 최종 예측값 1개를 출력
            nn.Linear(16, output_size)
        )

    # 데이터가 모델을 통과하는 흐름을 정의
    def forward(self, x):
        output = self.model(x)
        return output

# 입력 특성은 10개, 출력은 1개의 숫자
model = DiabetesModel(10, 1)
print(model)
```

  - `nn.Linear(in, out)`: 입력 노드 수(`in`)와 출력 노드 수(`out`)를 받아 선형 변환을 수행하는 **핵심 레이어**입니다. 이 레이어의 가중치(weights)를 학습하는 것이 목표입니다.
  - `nn.ReLU()`: **활성화 함수**입니다. 선형 레이어만으로는 복잡한 관계를 학습할 수 없기 때문에, 중간에 ReLU 같은 비선형 함수를 추가하여 모델이 더 유연하게 학습하도록 돕습니다.

### Step 3: 학습 설정 (손실 함수와 옵티마이저)

모델을 어떻게 훈련시킬지 '평가 기준'과 '개선 방법'을 정합니다.

  - **손실 함수 (Loss Function)**: 모델의 예측이 정답과 얼마나 다른지(오차)를 측정하는 함수.
  - **옵티마이저 (Optimizer)**: 계산된 오차를 줄이는 방향으로 모델의 파라미터(가중치)를 업데이트하는 알고리즘.

<!-- end list -->

```python
# 손실 함수: 평균 제곱 오차(Mean Squared Error) 사용
# L = 1/N * Σ(y_실제 - y_예측)²
criterion = nn.MSELoss()

# 옵티마이저: Adam 사용 (가장 대중적이고 성능이 좋은 옵티마이저 중 하나)
# lr은 학습률(learning rate)로, 파라미터를 얼마나 크게 업데이트할지 결정
optimizer = torch.optim.Adam(model.parameters(), lr=0.001)
```

### Step 4: 모델 훈련 (The Training Loop)

이제 `for` 루프를 돌면서 모델을 반복적으로 훈련시킵니다. 데이터를 한 번에 하나씩 처리하는 것보다, \*\*전체 데이터를 묶어서 한 번에 처리(배치 학습)\*\*하는 것이 훨씬 효율적입니다.

훈련 과정의 핵심 3단계는 다음과 같습니다.

1.  `optimizer.zero_grad()`: 이전 스텝의 기울기(gradient)가 누적되지 않도록 **초기화**합니다.
2.  `loss.backward()`: 손실을 기반으로 각 파라미터의 **기울기를 계산**합니다 (역전파).
3.  `optimizer.step()`: 계산된 기울기를 사용해 **파라미터를 업데이트**합니다.

<!-- end list -->

```python
# 10000번 반복 학습
n_epochs = 10000

for epoch in range(n_epochs):
    # 1. 모델 예측
    y_pred = model(X_train)

    # 2. 손실 계산 (차원을 맞춰주기 위해 unsqueeze 사용)
    target = torch.unsqueeze(y_train, dim=1)
    loss = criterion(y_pred, target)

    # 3. 기울기 초기화 -> 역전파 -> 파라미터 업데이트
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if (epoch + 1) % 1000 == 0:
        print(f'Epoch [{epoch+1}/{n_epochs}], Loss: {loss.item():.4f}')
```

### Step 5: 성능 평가

훈련이 끝난 모델이 **한 번도 보지 못한** 테스트 데이터에 대해서도 예측을 잘하는지 확인합니다.

```python
# 모델을 평가 모드로 전환
model.eval()

# 테스트 데이터로 예측 수행 (기울기 계산 불필요)
with torch.no_grad():
    y_pred_test = model(X_test)
    test_loss = criterion(y_pred_test, torch.unsqueeze(y_test, dim=1))
    print(f'\n테스트 데이터에서의 최종 Loss: {test_loss.item():.4f}')

# 예측 결과 샘플 확인
print("\n--- 예측 샘플 ---")
for i in range(5):
    print(f"실제값: {y_test[i]:.2f}, 예측값: {y_pred_test[i].item():.2f}")
```

> **Tip:** `model.eval()`과 `with torch.no_grad()`는 평가 시 불필요한 연산(기울기 계산 등)을 막아 메모리를 효율적으로 사용하게 해주는 좋은 습관입니다.

-----

## 4 마무리하며 💡

이번 포스트에서는 PyTorch를 사용해 간단한 회귀 모델을 만들고 훈련시키는 전체 과정을 다뤄봤습니다.

  - 데이터를 준비하고 **훈련/테스트용으로 분리**했습니다.
  - `nn.Sequential`과 `nn.Linear`로 간단한 **인공신경망을 설계**했습니다.
  - \*\*손실 함수(`MSELoss`)\*\*와 \*\*옵티마이저(`Adam`)\*\*를 설정했습니다.
  - **`zero_grad() -> backward() -> step()`** 3단계를 반복하며 모델을 **훈련**했습니다.

여기서 더 나아가 모델의 층을 더 깊게 쌓거나, 학습률을 조절하거나, 다른 옵티마이저를 사용해보는 등 다양한 실험을 통해 성능을 개선해볼 수 있습니다.