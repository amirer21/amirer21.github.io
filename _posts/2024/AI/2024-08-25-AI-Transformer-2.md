---
title: 인공지능 - Transformer
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- Transformer
tags:
- AI
- Transformer
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - Transformer
article_tag1: AI
article_tag2: Transformer
article_tag3: 
article_section: 
meta_keywords: AI, LLM, Transformer
last_modified_at: '2024-08-25 21:00:00 +0800'
---

### 트랜스포머(Transformer)란?
트랜스포머는 자연어 처리(NLP) 및 기타 시퀀스 모델링 작업에서 널리 사용되는 신경망 아키텍처입니다. 2017년 "Attention is All You Need" 논문에서 소개된 이 모델은 기존의 RNN(Recurrent Neural Networks)이나 LSTM(Long Short-Term Memory)과 같은 순환 신경망의 한계를 극복하며, 병렬 처리에 효율적이고 장기 의존성을 잘 학습할 수 있습니다.

트랜스포머의 핵심 구성 요소는 **어텐션 메커니즘**(특히, 셀프 어텐션)입니다. 이를 통해 모델은 입력 시퀀스 내에서 단어 간의 관계를 학습하고, 중요한 정보에 더 집중할 수 있습니다.

BERT(Bidirectional Encoder Representations from Transformers)와 GPT(Generative Pretrained Transformer) 등은 트랜스포머 아키텍처를 기반으로 한 대표적인 모델들입니다.

---

### 결합 순서

트랜스포머 모델을 구현하기 위한 구성 요소들의 결합 순서는 다음과 같습니다:

1. **임베딩 레이어(Embedding Layer)**: 입력 토큰을 고차원 벡터로 변환합니다.
2. **포지셔널 인코딩(Positional Encoding)**: 시퀀스 내 단어의 위치 정보를 임베딩에 추가합니다.
3. **트랜스포머 인코더(Transformer Encoder)**: 여러 개의 인코더 레이어로 구성되어, 입력 데이터를 처리하고 특성을 추출합니다.
4. **출력 레이어(Output Layer)**: 인코더의 출력을 원하는 형태로 변환합니다.

---

### 실행

트랜스포머 모델을 실행하기 위해서는 다음 단계를 따릅니다:

1. **필요한 라이브러리 임포트**: PyTorch와 필요한 모듈을 불러옵니다.
2. **모델 구성 요소 정의**: 임베딩, 포지셔널 인코딩, 인코더, 출력 레이어 등을 정의합니다.
3. **모델 초기화**: 정의한 구성 요소들을 결합하여 모델을 초기화합니다.
4. **입력 데이터 준비**: 모델에 입력할 데이터를 준비합니다.
5. **모델 실행**: 입력 데이터를 모델에 통과시켜 출력을 얻습니다.
6. **출력 확인**: 모델의 출력을 확인하고 필요에 따라 후처리합니다.

---

### 코드

아래는 PyTorch를 사용하여 간단한 트랜스포머 모델을 구현하는 예제 코드입니다:

```python
import torch
import torch.nn as nn
import math

# 포지셔널 인코딩 클래스 정의
class PositionalEncoding(nn.Module):
    def __init__(self, model_dim, max_len=5000):
        super(PositionalEncoding, self).__init__()
        pe = torch.zeros(max_len, model_dim)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)
        div_term = torch.exp(torch.arange(0, model_dim, 2).float() * (-math.log(10000.0) / model_dim))
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        pe = pe.unsqueeze(1)  # [max_len, 1, model_dim]
        self.register_buffer('pe', pe)

    def forward(self, x):
        # x shape: [seq_length, batch_size, model_dim]
        x = x + self.pe[:x.size(0), :]
        return x

# 간단한 트랜스포머 모델 클래스 정의
class SimpleTransformer(nn.Module):
    def __init__(self, input_dim, model_dim, num_heads, num_layers, output_dim):
        super(SimpleTransformer, self).__init__()
        self.embedding = nn.Embedding(input_dim, model_dim)
        self.positional_encoding = PositionalEncoding(model_dim)
        encoder_layer = nn.TransformerEncoderLayer(d_model=model_dim, nhead=num_heads)
        self.transformer_encoder = nn.TransformerEncoder(encoder_layer, num_layers=num_layers)
        self.fc = nn.Linear(model_dim, output_dim)

    def forward(self, src):
        # src shape: [seq_length, batch_size]
        embedded = self.embedding(src) * math.sqrt(self.embedding.embedding_dim)
        embedded = self.positional_encoding(embedded)
        output = self.transformer_encoder(embedded)
        output = self.fc(output)
        return output

# 모델 파라미터 설정
input_dim = 1000  # 어휘 수 (예: 1000)
model_dim = 512
num_heads = 8
num_layers = 6
output_dim = 1000  # 출력 차원 (예: 어휘 수)

# 모델 초기화
model = SimpleTransformer(input_dim, model_dim, num_heads, num_layers, output_dim)

# 예시 입력 데이터 (시퀀스 길이 10, 배치 크기 32)
src = torch.randint(0, input_dim, (10, 32))  # [seq_length, batch_size]

# 모델 실행
output = model(src)

# 출력 결과 확인
print(output.shape)  # 예상 출력: [10, 32, 1000]
```

---

### 설명

1. **포지셔널 인코딩(Positional Encoding)**:
   - 시퀀스 내 단어의 위치 정보를 임베딩 벡터에 추가하여, 모델이 단어의 순서를 인식할 수 있도록 합니다.
   - 사인과 코사인 함수를 사용하여 각 위치에 대한 고유한 패턴을 생성합니다.

2. **임베딩 레이어(Embedding Layer)**:
   - 입력 토큰(예: 단어)의 인덱스를 고차원 벡터로 변환합니다.
   - `nn.Embedding`을 사용하여 어휘 수(`input_dim`)와 모델 차원(`model_dim`)을 정의합니다.

3. **트랜스포머 인코더(Transformer Encoder)**:
   - 여러 개의 `TransformerEncoderLayer`를 쌓아 구성합니다.
   - 각 인코더 레이어는 멀티-헤드 어텐션과 피드포워드 신경망으로 구성됩니다.

4. **출력 레이어(Output Layer)**:
   - 인코더의 출력을 원하는 차원으로 변환하기 위해 `nn.Linear`를 사용합니다.
   - 예를 들어, 언어 모델링 작업에서는 출력 차원을 어휘 수와 동일하게 설정합니다.

5. **모델 실행 및 출력 확인**:
   - 임의의 입력 데이터를 생성하여 모델을 실행합니다.
   - 출력의 형태를 확인하여 예상한 대로 `[시퀀스 길이, 배치 크기, 출력 차원]`인지 확인합니다.

이 예제는 트랜스포머 아키텍처의 기본적인 구조를 설명하고 있으며, 실제 응용에서는 데이터 전처리, 학습 루프, 손실 함수 등 추가적인 요소가 필요합니다. 트랜스포머 모델을 활용하여 다양한 NLP 작업을 구현하고 실험해보시기 바랍니다.