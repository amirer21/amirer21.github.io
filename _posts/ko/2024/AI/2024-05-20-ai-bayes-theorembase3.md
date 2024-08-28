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

# 음성 인식 문제 수식화

## 음성 인식을 수식으로 정의
음성 인식 문제는 다음과 같은 확률적인 방법으로 정의할 수 있습니다:

### 수식 1
$$ \hat{w} = \arg \max_{w} P(w|x) $$

이 수식은 주어진 음성 신호 $ x $에 대해 가능한 단어 $ w $ 중에서 후행 확률 $ P(w|x) $이 최대가 되는 단어 $ \hat{w} $를 찾는다는 것을 의미합니다.
- $ \hat{w} $: 인식된 단어
- $ \arg \max_{w} $: 가능한 모든 단어 $ w $에 대해 후행 확률이 최대가 되는 $ w $를 찾는 연산
- $ P(w|x) $: 음성 신호 $ x $가 주어졌을 때 단어 $ w $가 나타날 확률

### 수식 2
$$ \hat{w} = \arg \max_{w} \frac{P(x|w)P(w)}{P(x)} $$

베이즈 정리를 적용하여 $ P(w|x) $를 다음과 같이 변환합니다:
$$ P(w|x) = \frac{P(x|w)P(w)}{P(x)} $$
- $ P(x|w) $: 단어 $ w $가 주어졌을 때 음성 신호 $ x $가 나타날 확률
- $ P(w) $: 단어 $ w $의 사전 확률
- $ P(x) $: 음성 신호 $ x $의 전체 확률로, 모든 가능한 단어에 대해 음성 신호 $ x $가 나타날 확률의 총합

### 수식 3
$$ \hat{w} = \arg \max_{w} P(x|w)P(w) $$

음성 신호 $ x $는 주어졌기 때문에, $ P(x) $는 모든 $ w $에 대해 동일하여 최대화를 할 때 영향을 미치지 않습니다. 따라서 $ P(x) $를 생략하고 다음과 같은 최적화 문제로 단순화할 수 있습니다:
$$ \hat{w} = \arg \max_{w} P(x|w)P(w) $$

이 최종 수식은 음성 인식 시스템이 주어진 음성 신호 $ x $에 대해 음향 모델 $ P(x|w) $과 언어 모델 $ P(w) $의 곱이 최대가 되는 단어를 찾는다는 것을 나타냅니다.

## 예시: "hello"라는 단어를 인식하는 과정

### 1. 음성 신호 수집
사용자가 "hello"라고 말한다고 가정합니다. 이 음성 신호는 마이크를 통해 수집되고, 신호 처리 과정을 거쳐 특징 벡터 $ x $로 변환됩니다.

### 2. 후보 단어 집합 설정
음성 인식 시스템은 사전 정의된 단어 집합 (예: "hello", "hi", "help", "halo")을 가지고 있습니다. 여기서는 간단히 "hello", "hi", "help", "halo" 네 개의 후보 단어가 있다고 가정합니다.

### 3. 확률 계산
각 후보 단어 $ w $에 대해 $ P(x|w) $와 $ P(w) $를 계산합니다.
- $ P(x|w) $ (음향 모델): 단어 $ w $가 주어졌을 때 음성 신호 $ x $가 발생할 확률입니다.
- $ P(w) $ (언어 모델): 단어 $ w $의 사전 확률입니다.

예를 들어, 다음과 같은 값을 얻었다고 가정합니다:
- "hello"에 대해 $ P(x|hello) = 0.6 $, $ P(hello) = 0.5 $
- "hi"에 대해 $ P(x|hi) = 0.3 $, $ P(hi) = 0.4 $
- "help"에 대해 $ P(x|help) = 0.1 $, $ P(help) = 0.3 $
- "halo"에 대해 $ P(x|halo) = 0.4 $, $ P(halo) = 0.1 $

### 4. 결합 확률 계산
각 후보 단어에 대해 결합 확률 $ P(x|w)P(w) $를 계산합니다.
- "hello": $ P(x|hello)P(hello) = 0.6 \times 0.5 = 0.3 $
- "hi": $ P(x|hi)P(hi) = 0.3 \times 0.4 = 0.12 $
- "help": $ P(x|help)P(help) = 0.1 \times 0.3 = 0.03 $
- "halo": $ P(x|halo)P(halo) = 0.4 \times 0.1 = 0.04 $

### 5. 최적의 단어 선택
가장 높은 결합 확률을 가진 단어를 선택합니다.
- "hello"의 결합 확률이 0.3으로 가장 높습니다.

따라서, 음성 인식 시스템은 사용자가 말한 단어가 "hello"일 가능성이 가장 높다고 판단합니다.