---
title: 인공지능 - Speech to Text 
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
tags:
- AI
- Voice
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - Speech to Text 
article_tag1: AI
article_tag2: Voice
article_tag3: 
article_section: 
meta_keywords: AI, Voice, STT
last_modified_at: '2024-05-21 21:00:00 +0800'
---

# Speech to Text (Listen, Attend and Spell) 모델 순서 설명

음성 인식에서 "Speech to Text (Listen, Attend and Spell)" 모델의 순서를 설명드리겠습니다.

## 1. Input Speech (입력 음성)

### 설명
음성 인식 프로세스의 첫 번째 단계는 마이크나 녹음 장치에서 입력된 음성 신호입니다. 이 단계에서는 원시 오디오 데이터를 수집합니다.

### 예시
- **입력 음성**: "안녕하세요, 오늘 날씨가 참 좋네요."

## 2. Feature Extraction (특징 추출)

### 설명
입력된 음성 신호로부터 중요한 특징을 추출합니다. 이 특징들은 음성의 주파수 성분, 시간 변화 등을 포함할 수 있으며, 일반적으로 MFCC(Mel-Frequency Cepstral Coefficients)와 같은 기법을 사용하여 계산됩니다. 특징 추출 과정은 음성 신호를 수학적으로 분석하여 의미 있는 정보를 얻는 과정입니다.

### 예시
- **입력 음성**: "안녕하세요, 오늘 날씨가 참 좋네요."
- **특징 추출 결과**: [MFCC 계수 배열]

## 3. DNN/RNN Acoustic Model (DNN/RNN 음향 모델)

### 설명
특징 추출 단계에서 얻은 데이터를 Deep Neural Network(DNN) 또는 Recurrent Neural Network(RNN)와 같은 음향 모델에 입력합니다. 이 모델은 음향 특징과 음성의 음소 간의 관계를 학습합니다. RNN의 경우, 특히 LSTM(Long Short-Term Memory)이나 GRU(Gated Recurrent Units) 같은 구조를 사용하여 시간적 의존성을 처리할 수 있습니다.

### 예시
- **입력 데이터**: MFCC 계수 배열
- **모델 출력**: 음성 음소 확률 분포

## 4. Decoder (디코더)

### 설명
디코더는 음향 모델의 출력을 사용하여 음성 신호를 텍스트로 변환하는 단계입니다. 이 과정에서는 음성 인식의 언어 모델을 사용하여 가능한 단어와 문장을 예측합니다. 디코더는 음향 모델의 출력을 가능한 텍스트 시퀀스로 매핑하는 작업을 수행합니다.

### 예시
- **입력 데이터**: 음성 음소 확률 분포
- **디코딩 결과**: "안녕하세요, 오늘 날씨가 참 좋네요."

## 5. Second-Pass Rescoring (2차 점수 재평가)

### 설명
디코더에서 생성된 텍스트 후보들을 다시 평가하고 최종 출력을 결정하는 단계입니다. 이 단계에서는 보다 복잡한 언어 모델이나 문맥 정보를 사용하여 첫 번째 디코딩 결과를 재평가하고 최적의 텍스트를 선택합니다. 예를 들어, n-그램 언어 모델이나 Transformer 기반 언어 모델을 사용할 수 있습니다.

### 예시
- **첫 번째 디코딩 결과**: "안녕하세요, 오늘 날씨가 참 좋네요."
- **재평가 결과**: "안녕하세요, 오늘 날씨가 참 좋네요."

## 6. Output Words (출력 단어)

### 설명
최종적으로 선택된 텍스트가 출력됩니다. 이 텍스트는 입력 음성 신호에 해당하는 인식된 단어들입니다.

### 예시
- **최종 출력**: "안녕하세요, 오늘 날씨가 참 좋네요."

---

이러한 과정은 음성 인식 시스템이 입력된 음성 신호를 텍스트로 변환하는 일반적인 순서입니다. 각 단계는 음성 인식의 정확도와 성능을 높이기 위해 중요한 역할을 합니다.
