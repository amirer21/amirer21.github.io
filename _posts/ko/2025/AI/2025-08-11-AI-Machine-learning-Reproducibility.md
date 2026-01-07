---
title: 머신러닝 - 머신러닝 실험 재현성과 모델 성능 평가
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
description: 머신러닝 - Random Seed, Classification Metrics
article_tag1: AI
article_tag2: MachineLearning
article_tag3: 
article_section: 
meta_keywords: AI, MachineLearning
last_modified_at: '2025-08-11 21:00:00 +0800'
---

# 머신러닝 실험 재현성과 모델 성능 평가

## 1. Random Seed 고정

### 1.1 개념

* **Random Seed**: 난수 생성기의 시작값
* 모델의 초기 가중치, 데이터 섞기(shuffle), 학습/검증 데이터 분리 등에 난수가 쓰입니다.
* Seed 값을 고정하면 매번 같은 난수를 생성 → 동일한 실행 결과를 얻을 수 있음

### 1.2 왜 고정해야 하나?

* **재현성(Reproducibility)** 확보

  * 동일한 코드와 데이터로 같은 결과를 재실행 가능
  * 논문, 보고서, 디버깅 시 필수
* 고정하지 않으면 매번 결과가 달라져 정확한 비교 불가능

### 1.3 코드 예시

```python
import random, os
import numpy as np
import torch

seed = 42

random.seed(seed)
np.random.seed(seed)
torch.manual_seed(seed)
os.environ['PYTHONHASHSEED'] = str(seed)

if torch.cuda.is_available():
    torch.cuda.manual_seed(seed)
    torch.cuda.manual_seed_all(seed)
```

> **Tip**: GPU 사용 시 완전 재현을 원하면
> `torch.use_deterministic_algorithms(True)` 설정 필요

### 1.4 쉬운 비유

* **난수 생성기 = 주사위**
* Seed를 지정하지 않으면 매번 던질 때 눈이 랜덤하게 바뀜
* Seed를 고정하면 "특정 순서의 주사위 눈"이 매번 그대로 재현됨 → 실험 조건이 변하지 않음

---

## 2. Classification Metrics

### 2.1 Confusion Matrix 기본 구조

![대체 텍스트](/home/hong/amirer21.github.io/assets/images/ai/classification_matrix.png)


|                     | **Predicted Positive** | **Predicted Negative** |
| ------------------- | ---------------------- | ---------------------- |
| **Actual Positive** | True Positive (TP)     | False Negative (FN)    |
| **Actual Negative** | False Positive (FP)    | True Negative (TN)     |

* **TP**: 실제 Positive, 예측도 Positive
* **FP**: 실제 Negative인데 Positive로 예측
* **FN**: 실제 Positive인데 Negative로 예측
* **TN**: 실제 Negative, 예측도 Negative

---

### 2.2 주요 성능 지표

1. **Accuracy (정확도)**

   $$
   \frac{TP + TN}{TP + TN + FP + FN}
   $$

   → 전체 예측 중 맞춘 비율

   > 비유: 시험에서 전체 문제 중 맞게 푼 문제 비율

2. **Precision (정밀도)**

   $$
   \frac{TP}{TP + FP}
   $$

   → Positive라고 예측한 것 중 실제 Positive 비율

   > 비유: "합격이라고 한 사람들 중 진짜 합격한 사람의 비율"

3. **Recall (재현율)**

   $$
   \frac{TP}{TP + FN}
   $$

   → 실제 Positive 중 모델이 맞춘 비율

   > 비유: "실제 합격자 중에서 모델이 합격이라고 맞춘 비율"

4. **Specificity (특이도)**

   $$
   \frac{TN}{TN + FP}
   $$

   → 실제 Negative 중 맞춘 비율

5. **F1-score**

   $$
   2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}}
   $$

   → Precision과 Recall의 조화 평균

   > 비유: 정밀함과 놓치지 않는 능력을 동시에 반영한 종합 점수

---

### 2.3 Python 코드 예시

```python
from sklearn import metrics

y_pred = model.predict(X_test)

print('Accuracy:', metrics.accuracy_score(y_test, y_pred))
print('Balanced Accuracy:', metrics.balanced_accuracy_score(y_test, y_pred))
print('Classification Report:\n', metrics.classification_report(y_test, y_pred))
```

* **accuracy\_score**: 전체 정확도
* **balanced\_accuracy\_score**: 클래스 불균형 고려
* **classification\_report**: Precision, Recall, F1-score, support(샘플 수) 제공

---

### 2.4 쉬운 비유로 이해하기

* **Precision** = "합격하라고 보낸 합격 통지서 중에서 진짜 합격자가 몇 명이냐?"
* **Recall** = "실제 합격한 사람들 중에 통지서를 받은 사람이 몇 명이냐?"
* **Accuracy** = "전체 사람 중에 판단이 맞은 비율"
* **F1-score** = "Precision과 Recall 모두 잘해야 점수가 높은 종합 평가 점수"

---

📌 **정리**

* **Random Seed 고정**: 실험 결과 재현성을 위해 필수
* **성능 지표 선택**: 데이터 불균형 시 Accuracy보다 F1-score, Recall 등을 고려
* **비유를 통해 이해**: 합격자 예시, 주사위 예시 등을 사용하면 헷갈리지 않음