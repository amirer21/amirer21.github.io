---
title: 인공지능 -  NLP (2) 신경망 모델을 활용한 텍스트 분류
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
description: 신경망 모델을 활용한 텍스트 분류
article_tag1: AI
article_tag2: NLP
article_tag3: DeepLearning
article_section: 
meta_keywords: AI, OpenAI, LangChain, Transformer
last_modified_at: '2024-08-31 21:00:00 +0800'
---

간단한 신경망을 사용하여 텍스트를 긍정/부정으로 분류하는 과정.

https://github.com/amirer21/RAG-Explorer/blob/master/NLP/NLP_02_Transformer_model_text_classification.py

### 예제 코드

```py
import tensorflow as tf
from tensorflow.keras.layers import Dense, Embedding, GlobalAveragePooling1D
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.model_selection import train_test_split
import numpy as np

# 예제 데이터 준비
texts = ["I love sunset", "Sky is beautiful", "I hate rain", "Cloud is beautiful"]
labels = [1, 1, 0, 1]  # 레이블: 1은 Positive, 0은 Negative를 의미

# 텍스트 토크나이징 및 패딩
tokenizer = Tokenizer(num_words=1000)  # 사전에 사용할 최대 단어 수를 1000으로 제한
tokenizer.fit_on_texts(texts)  # 텍스트에 나오는 단어들에 번호를 부여 (토크나이징)
sequences = tokenizer.texts_to_sequences(texts)  # 텍스트를 숫자의 시퀀스로 변환
padded_sequences = pad_sequences(sequences, maxlen=10, padding='post')
# 시퀀스 길이를 10으로 맞추고, 부족한 부분은 'post'(뒤)에 0을 추가

# 데이터 분할 (학습/검증)
train_texts, val_texts, train_labels, val_labels = train_test_split(padded_sequences, labels, test_size=0.2)
# 데이터를 80%는 학습용, 20%는 검증용으로 분할

# 레이블을 NumPy 배열로 변환
train_labels = np.array(train_labels)
val_labels = np.array(val_labels)

# 신경망 모델 정의
model = tf.keras.Sequential([
    Embedding(input_dim=1000, output_dim=16, input_length=10),  # 임베딩 레이어: 단어를 16차원 벡터로 변환
    GlobalAveragePooling1D(),  # 임베딩 벡터의 평균을 구함
    Dense(16, activation='relu'),  # 은닉층: 16개의 노드, ReLU 활성화 함수
    Dense(1, activation='sigmoid')  # 출력층: 1개의 노드, 시그모이드 활성화 함수 (이진 분류)
])

# 모델 컴파일
model.compile(optimizer='adam',
              loss='binary_crossentropy',  # 이진 교차 엔트로피 손실 함수 사용
              metrics=['accuracy'])  # 모델 성능 지표로 정확도를 사용

# 모델 학습
model.fit(train_texts, train_labels, validation_data=(val_texts, val_labels), epochs=10)
# 모델을 10번의 에포크 동안 학습하고, 검증 데이터로 성능을 평가

# 예측
sample_text = ["I love to take a picture of sunset"]  # 새로운 샘플 텍스트 입력
sample_sequence = tokenizer.texts_to_sequences(sample_text)  # 샘플 텍스트를 시퀀스로 변환
padded_sample = pad_sequences(sample_sequence, maxlen=10, padding='post')
# 시퀀스 길이를 학습 데이터와 동일하게 10으로 맞추고, 부족한 부분은 0으로 채움
prediction = model.predict(padded_sample)  # 모델을 사용해 예측 수행
print("Predicted label (Simple Neural Network):", "Positive" if prediction > 0.5 else "Negative")
# 예측 결과가 0.5보다 크면 Positive, 그렇지 않으면 Negative로 출력

"""
To enable the following instructions: AVX2 FMA, in other operations, rebuild TensorFlow with the appropriate compiler flags.
Epoch 1/10
1/1 ━━━━━━━━━━━━━━━━━━━━ 1s 1s/step - accuracy: 0.6667 - loss: 0.6890 - val_accuracy: 1.0000 - val_loss: 0.6765
Epoch 2/10
1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 63ms/step - accuracy: 0.6667 - loss: 0.6875 - val_accuracy: 1.0000 - val_loss: 0.6730
Epoch 3/10
1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 62ms/step - accuracy: 0.6667 - loss: 0.6861 - val_accuracy: 1.0000 - val_loss: 0.6695
Epoch 4/10
1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 63ms/step - accuracy: 0.6667 - loss: 0.6848 - val_accuracy: 1.0000 - val_loss: 0.6662
Epoch 5/10
1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 64ms/step - accuracy: 0.6667 - loss: 0.6834 - val_accuracy: 1.0000 - val_loss: 0.6628
Epoch 6/10
1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 65ms/step - accuracy: 0.6667 - loss: 0.6821 - val_accuracy: 1.0000 - val_loss: 0.6595
Epoch 7/10
1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 64ms/step - accuracy: 0.6667 - loss: 0.6808 - val_accuracy: 1.0000 - val_loss: 0.6561
Epoch 8/10
1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 62ms/step - accuracy: 0.6667 - loss: 0.6795 - val_accuracy: 1.0000 - val_loss: 0.6528
Epoch 9/10
1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 62ms/step - accuracy: 0.6667 - loss: 0.6782 - val_accuracy: 1.0000 - val_loss: 0.6494
Epoch 10/10
1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 66ms/step - accuracy: 0.6667 - loss: 0.6769 - val_accuracy: 1.0000 - val_loss: 0.6461
1/1 ━━━━━━━━━━━━━━━━━━━━ 0s 65ms/step
Predicted label (Simple Neural Network): Positive
"""
```

이 코드는 간단한 신경망을 사용하여 텍스트 감정 분석을 수행하는 예제입니다. 코드의 주요 목적은 텍스트 데이터를 입력으로 받아 긍정(Positive) 또는 부정(Negative)으로 분류하는 것입니다. 이를 통해 알 수 있는 내용은 다음과 같습니다:

1. **텍스트 전처리**:
   - 텍스트 데이터를 숫자 시퀀스로 변환하기 위해 `Tokenizer`를 사용하여 텍스트를 토크나이징하고, 각 단어에 번호를 부여합니다.
   - `pad_sequences` 함수를 사용해 시퀀스를 일정한 길이(여기서는 10)로 맞추며, 길이가 부족한 시퀀스는 뒤쪽(`post`)에 0을 추가해 패딩합니다.

2. **데이터 분할**:
   - 텍스트와 레이블 데이터를 학습용과 검증용으로 분할합니다. 학습 데이터는 80%, 검증 데이터는 20%로 나눕니다.
   - 레이블을 NumPy 배열로 변환하여 모델 학습에 사용할 수 있도록 준비합니다.

3. **신경망 모델 정의**:
   - 모델은 `tf.keras.Sequential`을 사용해 순차적으로 쌓은 신경망으로 구성됩니다.
   - **임베딩 레이어**: 단어를 16차원의 벡터로 임베딩합니다 (`Embedding` 레이어 사용). 이는 텍스트를 수치적으로 표현하여 모델이 학습할 수 있도록 돕습니다.
   - **Global Average Pooling 레이어**: 임베딩 벡터의 평균을 구하여 입력을 축소합니다.
   - **Dense 레이어**: 첫 번째 은닉층은 16개의 노드와 ReLU 활성화 함수를 사용합니다.
   - **출력 레이어**: 출력층은 1개의 노드를 가지며, 시그모이드 활성화 함수를 사용하여 이진 분류를 수행합니다. 예측 값은 0과 1 사이의 확률로 표현되며, 0.5를 기준으로 긍정 또는 부정으로 분류됩니다.

4. **모델 컴파일 및 학습**:
   - 모델을 컴파일할 때 Adam 옵티마이저와 이진 교차 엔트로피 손실 함수(`binary_crossentropy`)를 사용합니다. 평가 지표로는 정확도(`accuracy`)를 설정합니다.
   - 모델은 학습 데이터와 검증 데이터를 사용하여 10번의 에포크 동안 학습합니다.

5. **새로운 텍스트 예측**:
   - 새로운 텍스트("I love to take a picture of sunset")를 입력으로 받아 예측합니다.
   - 샘플 텍스트를 시퀀스로 변환하고, 학습 데이터와 동일한 길이로 패딩합니다.
   - 모델을 사용해 예측을 수행하며, 예측 값이 0.5보다 크면 Positive(긍정), 작으면 Negative(부정)으로 분류하여 결과를 출력합니다.

**이 코드로 알 수 있는 것:**
- 간단한 신경망을 사용한 텍스트 분류가 가능하며, 텍스트 데이터를 전처리하고, 신경망을 통해 학습하여 긍정/부정 감정을 예측할 수 있습니다.
- 텍스트 분류에 있어서 기본적인 임베딩, 글로벌 풀링, 그리고 Dense 레이어의 조합으로 간단한 감정 분석 모델을 구현할 수 있음을 보여줍니다.
- 모델의 예측 정확도는 텍스트의 특성과 모델의 학습 정도에 따라 달라질 수 있으며, 데이터의 양과 품질이 성능에 영향을 미칩니다.
