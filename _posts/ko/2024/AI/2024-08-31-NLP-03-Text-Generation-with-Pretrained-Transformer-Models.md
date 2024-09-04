---
title: 인공지능 -  NLP (3) 사전 학습된 Transformer 모델로 텍스트 생성
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
tags:
- AI
- NLP
- DeepLearning
- Transformer
toc: true
toc_sticky: true
toc_label: 목차
description: 사전 학습된 Transformer 모델로 텍스트 생성
article_tag1: AI
article_tag2: NLP
article_tag3: DeepLearning
article_section: 
meta_keywords: AI, OpenAI, LangChain, Transformer
last_modified_at: '2024-08-31 21:00:00 +0800'
---

사전 학습된 Transformer 모델을 사용하여 텍스트 감정을 빠르게 예측하는 예제 코드입니다.

### 예제 코드

https://github.com/amirer21/RAG-Explorer/blob/master/NLP/NLP_03_Transformer_model_text_generation.py

```py
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer
import numpy as np

# 사전 학습된 Transformer 모델과 토크나이저 로드
model_name = "distilbert-base-uncased"  # 사용할 사전 학습된 모델 이름 설정 (DistilBERT)
tokenizer = AutoTokenizer.from_pretrained(model_name)  # 해당 모델에 맞는 토크나이저 불러오기
model = TFAutoModelForSequenceClassification.from_pretrained(model_name)  # 사전 학습된 DistilBERT 모델 불러오기

# 텍스트 데이터 준비
sample_text = ["I enjoy learning new things"]  # 예측할 입력 문장 준비
input_encoding = tokenizer(sample_text, truncation=True, padding=True, max_length=128, return_tensors="tf")
# 문장을 토큰화하고 패딩 및 자르기(truncation) 적용하여 입력 데이터를 모델에 맞게 인코딩
# max_length=128로 설정하여 최대 128개의 토큰까지만 사용

# Transformer 모델을 사용해 예측
logits = model(input_encoding).logits  # 모델에 인코딩된 텍스트를 입력하여 로짓(logits) 출력
predicted_label = np.argmax(logits, axis=-1)  # 로짓에서 가장 큰 값을 가지는 인덱스를 예측된 레이블로 선택

# 예측 결과 출력
print("Predicted label (Transformer):", "Positive" if predicted_label == 1 else "Negative")
# 예측된 레이블이 1이면 "Positive", 그렇지 않으면 "Negative"로 출력
# 코드 실행 결과: Predicted label (Transformer): Positive
```

이 코드는 사전 학습된 Transformer 모델인 DistilBERT를 사용하여 텍스트의 감정을 분류하는 예제입니다. 이 코드는 입력된 문장이 긍정적인지 부정적인지를 예측하는 감정 분석 모델의 예시입니다. 주요 기능과 실행 결과로 알 수 있는 내용은 다음과 같습니다:

### 코드 설명:

1. **모델과 토크나이저 로드**:
   - `model_name = "distilbert-base-uncased"`: 사전 학습된 DistilBERT 모델을 사용합니다. DistilBERT는 BERT의 경량화 버전으로, 성능을 어느 정도 유지하면서도 속도가 빠르고 메모리 사용이 적습니다.
   - `AutoTokenizer.from_pretrained(model_name)`: DistilBERT에 맞는 토크나이저를 로드합니다. 이 토크나이저는 텍스트를 모델이 이해할 수 있는 토큰 형식으로 변환합니다.
   - `TFAutoModelForSequenceClassification.from_pretrained(model_name)`: 사전 학습된 DistilBERT 모델을 불러옵니다. 이 모델은 시퀀스 분류를 위해 미리 학습된 상태이며, 감정 분류와 같은 작업에 사용될 수 있습니다.

2. **입력 텍스트 전처리**:
   - `sample_text = ["I enjoy learning new things"]`: 감정을 예측할 샘플 텍스트입니다.
   - `tokenizer(sample_text, truncation=True, padding=True, max_length=128, return_tensors="tf")`: 
     - 입력 텍스트를 토크나이저를 통해 토큰화하고, 모델이 요구하는 형태로 인코딩합니다.
     - `truncation=True`와 `padding=True` 옵션은 입력 시퀀스를 최대 길이 128로 자르고, 부족한 길이는 패딩합니다.
     - `return_tensors="tf"` 옵션은 TensorFlow 텐서로 반환하여 모델에 바로 입력할 수 있도록 합니다.

3. **모델 예측**:
   - `logits = model(input_encoding).logits`: 인코딩된 입력을 모델에 전달하여 로짓(logit) 값을 출력합니다. 로짓은 예측된 클래스(레이블)에 대한 점수를 나타냅니다.
   - `predicted_label = np.argmax(logits, axis=-1)`: 로짓에서 가장 큰 값을 가지는 인덱스를 선택하여 예측된 레이블로 정합니다. DistilBERT 모델은 이진 분류 문제로 설정되어 있어 두 개의 레이블(긍정, 부정) 중 하나를 예측합니다.

4. **결과 출력**:
   - 예측된 레이블이 1이면 "Positive"(긍정), 0이면 "Negative"(부정)으로 출력합니다.
   - 예제에서 출력은 `Predicted label (Transformer): Positive`입니다.

### 실행 결과로 알 수 있는 것:

- **문장 감정 예측**: 입력 문장 "I enjoy learning new things"에 대해 모델은 긍정적인 감정("Positive")으로 분류합니다.
- **사전 학습된 모델 사용**: 사전 학습된 DistilBERT 모델을 사용하여, 학습 없이도 텍스트의 감정을 분류할 수 있습니다. 이는 BERT 모델이 대규모 텍스트 데이터에서 문맥적 의미를 학습했기 때문에 가능하며, 모델의 성능은 데이터셋과 학습 방식에 따라 달라질 수 있습니다.
- **Transformer의 활용**: 이 예제는 Transformer 기반 모델이 텍스트의 감정을 이해하고, 문장을 긍정 또는 부정으로 분류할 수 있음을 보여줍니다. 

**결론적으로**, 이 코드의 실행 결과는 입력된 문장이 긍정적인지 부정적인지 예측할 수 있다는 것을 보여줍니다. DistilBERT와 같은 사전 학습된 Transformer 모델은 문맥적 이해 능력이 뛰어나며, 텍스트 분류 작업에 높은 성능을 발휘합니다.
