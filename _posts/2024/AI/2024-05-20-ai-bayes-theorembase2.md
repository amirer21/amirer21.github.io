---
title: 인공지능 - 베이즈 정리(Bayes' theorem) - 2
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
tags:
- AI
- theory
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - 베이즈 정리(Bayes' theorem)
article_tag1: AI
article_tag2: theory
article_tag3: 
article_section: 
meta_keywords: AI, theory, 
last_modified_at: '2024-05-20 21:00:00 +0800'
---

## 음성 인식에서의 확률 의미

### $ P $ (Probability, 확률)
- 확률을 나타내며, 음성 인식 문제에서 확률은 주어진 조건 하에서 어떤 사건이 발생할 가능성을 의미합니다.
- 예를 들어, $ P(x|w) $는 단어 $ w $가 주어졌을 때 음성 신호 $ x $가 발생할 확률입니다.

### $ x $ (음성 신호의 특징 벡터)
- 음성 신호를 나타내며, 보통 음성 신호의 특징 벡터(feature vector)로 표현됩니다.
- 음성 신호는 마이크로 수집된 후, 디지털화 및 전처리 과정을 통해 분석 가능한 형태로 변환됩니다. 이 변환된 형태가 특징 벡터 $ x $입니다.
- 특징 벡터 $ x $는 음성 신호의 스펙트럼, 피치, 에너지 등 다양한 음향적 특성을 포함할 수 있습니다.

### $ w $ (단어)
- 단어를 나타내며, 음성 인식 시스템이 인식하고자 하는 가능한 단어들의 집합 중 하나입니다.
- $ w $는 음성 인식 시스템의 어휘(vocabulary)에 포함된 단어들로 구성됩니다.
- 예를 들어, "hello", "hi", "help"와 같은 단어들이 $ w $에 해당할 수 있습니다.

### 수식의 의미 정리
수식 $ \hat{w} = \arg \max_{w} P(x|w)P(w) $는 다음과 같은 의미를 가집니다:
- **$ \hat{w} $ (예측된 단어)**: 주어진 음성 신호 $ x $에 대해 가장 가능성 높은 단어를 찾는 것.
- **$ \arg \max_{w} $**: 가능한 모든 단어 $ w $에 대해 최대값을 갖는 $ w $를 찾는 연산.
- **$ P(x|w) $ (음향 모델, Likelihood)**: 단어 $ w $가 주어졌을 때 음성 신호 $ x $가 발생할 확률. 이는 음성 신호와 단어 $ w $의 음향적 특징을 비교하여 계산됩니다.
- **$ P(w) $ (언어 모델, Prior Probability)**: 단어 $ w $의 사전 확률. 이는 단어 $ w $가 일반적으로 얼마나 자주 사용되는지를 나타냅니다.