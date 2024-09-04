---
title: 인공지능 - NLP (1) NLP작업을 위한 딥러닝 모델활용
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
toc: true
toc_sticky: true
toc_label: 목차
description: NLP작업을 위한 딥러닝 모델활용 예제코드와 설명
article_tag1: AI
article_tag2: NLP
article_tag3: DeepLearning
article_section: 
meta_keywords: AI, OpenAI, LangChain
last_modified_at: '2024-08-31 21:00:00 +0800'
---

딥러닝 모델을 활용하여 NLP 작업에서 BERT 기반의 감정 분석을 수행하는 코드입니다.

https://github.com/amirer21/RAG-Explorer/blob/master/NLP/NLP_01_DeepLearningTasks.py

```py
# python module install
# pip install --upgrade tensorflow keras
# pip install tensorflow transformers
# pip install scikit-learn

import tensorflow as tf
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import numpy as np

# 예제 데이터 준비
texts = ["I love sunset", "Sky is beautiful", "I hate rain", "Cloud is beautiful"]
labels = ["positive", "positive", "negative", "positive"]  # 레이블로 긍정(positive)과 부정(negative) 값을 정의

# 레이블 인코딩
label_encoder = LabelEncoder()
labels_encoded = label_encoder.fit_transform(labels)  # 텍스트 레이블을 정수 값으로 변환 (0: Negative, 1: Positive)

# 데이터 분할 (학습/검증)
train_texts, val_texts, train_labels, val_labels = train_test_split(texts, labels_encoded, test_size=0.2)
# 데이터를 학습용과 검증용으로 80:20 비율로 분할

# 사전 학습된 모델과 토크나이저 로드
model_name = "distilbert-base-uncased"  # BERT 경량 버전의 모델 이름 설정
tokenizer = AutoTokenizer.from_pretrained(model_name)  # 해당 모델의 토크나이저 불러오기
model = TFAutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
# 사전 학습된 BERT 모델을 불러와, 2개의 레이블(긍정/부정) 분류 모델로 설정

# 텍스트 토크나이징
train_encodings = tokenizer(train_texts, truncation=True, padding=True, max_length=128, return_tensors="tf")
val_encodings = tokenizer(val_texts, truncation=True, padding=True, max_length=128, return_tensors="tf")
# 학습 및 검증 데이터를 BERT 모델이 처리할 수 있도록 토큰화

# TensorFlow 데이터셋 준비
train_dataset = tf.data.Dataset.from_tensor_slices((dict(train_encodings), train_labels)).shuffle(100).batch(2)
val_dataset = tf.data.Dataset.from_tensor_slices((dict(val_encodings), val_labels)).batch(2)
# TensorFlow 데이터셋으로 변환, 학습 데이터는 셔플하고 배치 크기는 2로 설정

# 모델 컴파일
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=5e-5),
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])
# 모델을 컴파일, 옵티마이저는 Adam, 손실 함수는 이진 교차 엔트로피 사용, 정확도를 평가 지표로 설정

# 모델 학습
model.fit(train_dataset, validation_data=val_dataset, epochs=3)
# 모델을 학습, 3번의 에포크 동안 학습을 진행하고 검증 데이터로 성능을 평가

# 예측
sample_text = ["I love to take a picture of sunset"]
sample_encoding = tokenizer(sample_text, truncation=True, padding=True, max_length=128, return_tensors="tf")
logits = model(sample_encoding).logits
predicted_label = np.argmax(logits, axis=1)
# 새로운 텍스트에 대해 예측, 텍스트를 토큰화하고 모델을 통해 예측한 뒤, 가장 높은 확률의 레이블 선택

print(f"Predicted label: {label_encoder.inverse_transform(predicted_label)[0]}")
# 예측된 레이블을 다시 원래 텍스트 레이블로 변환하여 출력

"""
2/2 [==============================] - 15s 2s/step - loss: 0.5507 - accuracy: 1.0000 - val_loss: 0.9798 - val_accuracy: 0.0000e+00
Epoch 2/3
2/2 [==============================] - 1s 655ms/step - loss: 0.4002 - accuracy: 1.0000 - val_loss: 1.3466 - val_accuracy: 0.0000e+00
Epoch 3/3
2/2 [==============================] - 1s 664ms/step - loss: 0.2355 - accuracy: 1.0000 - val_loss: 1.8205 - val_accuracy: 0.0000e+00
Predicted label: positive
"""
# 학습과 예측 결과를 출력, 최종적으로 "positive" 레이블이 예측됨
```

이 코드는 사전 학습된 BERT 모델을 사용하여 텍스트 감정 분석을 수행하는 예제입니다. 코드의 주요 기능은 텍스트 데이터를 긍정(positive) 또는 부정(negative)으로 분류하는 것입니다. 이를 통해 다음과 같은 것을 알 수 있습니다:

1. **레이블 인코딩 및 데이터 분할**:
   - 텍스트 데이터(`texts`)와 레이블(`labels`)을 준비하고, 레이블을 정수 값으로 변환합니다 (`LabelEncoder` 사용).
   - 데이터를 학습용과 검증용으로 80:20 비율로 분할합니다.

2. **사전 학습된 모델과 토크나이저 로드**:
   - 사전 학습된 BERT 모델의 경량 버전인 "distilbert-base-uncased"를 사용하여 텍스트 분류 모델을 설정합니다.
   - 해당 모델의 토크나이저를 사용하여 텍스트를 토큰화합니다.

3. **데이터 토크나이징 및 TensorFlow 데이터셋 생성**:
   - 학습 및 검증 데이터를 BERT 모델이 이해할 수 있는 형식으로 토큰화합니다 (`truncation`, `padding` 옵션 사용).
   - 토큰화된 데이터를 TensorFlow 데이터셋으로 변환하고, 학습 데이터는 셔플하여 배치 크기 2로 설정합니다.

4. **모델 컴파일 및 학습**:
   - 모델을 컴파일합니다. 옵티마이저로는 Adam, 손실 함수로는 이진 교차 엔트로피(`SparseCategoricalCrossentropy`)를 사용하며, 정확도를 평가 지표로 설정합니다.
   - 모델을 학습합니다. 학습은 3번의 에포크 동안 진행되며, 검증 데이터를 통해 성능을 평가합니다.

5. **새로운 텍스트 예측**:
   - 새로운 텍스트에 대해 감정을 예측합니다. 텍스트를 토큰화하고, 모델을 통해 예측을 수행하며, 가장 높은 확률의 레이블을 선택하여 출력합니다.

이 코드로 알 수 있는 것은 텍스트가 긍정적인지 부정적인지를 예측할 수 있다는 것입니다. 예제에서는 "I love to take a picture of sunset"이라는 텍스트에 대해 모델이 예측한 레이블을 출력하며, 이 예측을 통해 해당 텍스트의 감정이 긍정적인지 부정적인지를 확인할 수 있습니다.

