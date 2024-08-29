---
title: 인공지능 - Transformer (1)
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

`Transformer`는 2017년에 구글에서 발표한 논문 "Attention is All You Need"에서 소개된 신경망 아키텍처로, 자연어 처리(NLP)와 컴퓨터 비전(CV) 분야에서 혁신적인 성과를 이뤄냈습니다. `BERT`와 `GPT`와 같은 최신 언어 모델들은 모두 Transformer 아키텍처를 기반으로 만들어졌습니다.

이번 답변에서는 Transformer의 기본 개념과 구조를 설명하고, 간단한 예제 코드를 통해 이해를 도울 것입니다.

## 🔍 Transformer란 무엇인가?

Transformer는 순차적인 데이터 처리에 적합한 기존의 RNN(Recurrent Neural Network)이나 CNN(Convolutional Neural Network)과 달리, **Self-Attention 메커니즘**을 활용하여 병렬 처리가 가능하고 긴 문맥을 효과적으로 학습할 수 있는 구조입니다.

### 주요 특징

- **병렬 처리 가능**: 순차적인 처리에 의존하지 않기 때문에 대량의 데이터를 빠르게 학습할 수 있습니다.
- **긴 의존성 학습**: 문장 내의 먼 단어들 간의 관계를 효과적으로 학습하여 더 정확한 문맥 이해가 가능합니다.
- **유연한 구조**: Encoder와 Decoder로 구성되어 있어 다양한 작업에 맞게 조정이 가능합니다.

## 🏗️ Transformer의 구성 요소

Transformer는 크게 **Encoder**와 **Decoder** 두 부분으로 구성됩니다.

### 1. Encoder

- 입력 문장을 받아 내부 표현으로 변환합니다.
- 여러 개의 동일한 레이어로 구성되며, 각 레이어는 **Self-Attention**과 **피드포워드 신경망(Feed-Forward Neural Network)**으로 이루어져 있습니다.

### 2. Decoder

- Encoder의 출력을 받아 목표 출력(sequence)을 생성합니다.
- 역시 여러 개의 동일한 레이어로 구성되며, 각 레이어는 **Self-Attention**, **Encoder-Decoder Attention**, 그리고 **피드포워드 신경망**으로 구성됩니다.

### 3. Self-Attention 메커니즘

- 입력 시퀀스 내의 단어들 간의 관계를 학습합니다.
- 각 단어가 문장 내의 다른 단어들을 어떻게 참조해야 하는지를 결정하여 더 풍부한 표현을 제공합니다.

### 4. Multi-Head Attention

- 여러 개의 Self-Attention을 병렬로 수행하여 다양한 표현 공간에서 정보를 추출합니다.
- 이를 통해 모델이 다양한 문맥 정보를 동시에 학습할 수 있습니다.

### 5. Position Encoding

- 순서 정보가 없는 입력에 위치 정보를 추가하여 단어의 순서를 인식할 수 있도록 합니다.

## 🧪 예제 코드

이제 PyTorch를 사용하여 간단한 Transformer 모델을 구현하는 예제를 살펴보겠습니다.

### 필요한 라이브러리 설치

```bash
pip install torch torchvision torchtext
```

### 라이브러리 임포트

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torchtext.datasets import Multi30k
from torchtext.data import Field, BucketIterator
```

### 데이터 전처리

```python
SRC = Field(tokenize="spacy", tokenizer_language="de", init_token='<sos>', eos_token='<eos>', lower=True)
TRG = Field(tokenize="spacy", tokenizer_language="en", init_token='<sos>', eos_token='<eos>', lower=True)

train_data, valid_data, test_data = Multi30k.splits(exts=('.de', '.en'), fields=(SRC, TRG))

SRC.build_vocab(train_data, min_freq=2)
TRG.build_vocab(train_data, min_freq=2)
```

### 모델 정의

```python
class TransformerModel(nn.Module):
    def __init__(self, src_vocab_size, trg_vocab_size, src_pad_idx, trg_pad_idx, embed_size=512, num_heads=8, num_layers=3, forward_expansion=4, dropout=0.1, max_len=100):
        super(TransformerModel, self).__init__()
        
        self.src_word_embedding = nn.Embedding(src_vocab_size, embed_size)
        self.src_position_embedding = nn.Embedding(max_len, embed_size)
        
        self.trg_word_embedding = nn.Embedding(trg_vocab_size, embed_size)
        self.trg_position_embedding = nn.Embedding(max_len, embed_size)
        
        self.transformer = nn.Transformer(embed_size, num_heads, num_layers, num_layers, forward_expansion * embed_size, dropout)
        
        self.fc_out = nn.Linear(embed_size, trg_vocab_size)
        
        self.dropout = nn.Dropout(dropout)
        
        self.src_pad_idx = src_pad_idx
        self.trg_pad_idx = trg_pad_idx
        
    def make_src_mask(self, src):
        src_mask = src.transpose(0, 1) == self.src_pad_idx
        return src_mask
    
    def make_trg_mask(self, trg):
        trg_len = trg.shape[0]
        trg_mask = self.transformer.generate_square_subsequent_mask(trg_len).to(trg.device)
        return trg_mask
    
    def forward(self, src, trg):
        src_seq_length, N = src.shape
        trg_seq_length, N = trg.shape
        
        src_positions = torch.arange(0, src_seq_length).unsqueeze(1).expand(src_seq_length, N).to(src.device)
        trg_positions = torch.arange(0, trg_seq_length).unsqueeze(1).expand(trg_seq_length, N).to(trg.device)
        
        embed_src = self.dropout(self.src_word_embedding(src) + self.src_position_embedding(src_positions))
        embed_trg = self.dropout(self.trg_word_embedding(trg) + self.trg_position_embedding(trg_positions))
        
        src_padding_mask = self.make_src_mask(src)
        trg_mask = self.make_trg_mask(trg)
        
        out = self.transformer(embed_src, embed_trg, src_key_padding_mask=src_padding_mask, tgt_mask=trg_mask)
        out = self.fc_out(out)
        
        return out
```

### 모델 초기화 및 학습 설정

```python
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

src_vocab_size = len(SRC.vocab)
trg_vocab_size = len(TRG.vocab)
src_pad_idx = SRC.vocab.stoi['<pad>']
trg_pad_idx = TRG.vocab.stoi['<pad>']

model = TransformerModel(src_vocab_size, trg_vocab_size, src_pad_idx, trg_pad_idx).to(device)

optimizer = optim.Adam(model.parameters(), lr=0.0005)
criterion = nn.CrossEntropyLoss(ignore_index=trg_pad_idx)
```

### 학습 루프

```python
for epoch in range(10):
    model.train()
    
    for batch in train_iterator:
        src = batch.src.to(device)
        trg = batch.trg.to(device)
        
        output = model(src, trg[:-1, :])
        output = output.reshape(-1, output.shape[2])
        trg = trg[1:, :].reshape(-1)
        
        optimizer.zero_grad()
        loss = criterion(output, trg)
        loss.backward()
        optimizer.step()
        
    print(f'Epoch {epoch} Loss {loss.item():.4f}')
```

### 예제 설명

1. **데이터 전처리**: `torchtext`를 사용하여 독일어-영어 번역 데이터를 로드하고 전처리합니다.
2. **모델 정의**: `TransformerModel` 클래스를 정의하여 Transformer 아키텍처를 구현합니다.
3. **모델 초기화**: 어휘 크기, 패딩 인덱스 등을 설정하고 모델을 초기화합니다.
4. **학습 루프**: 데이터를 반복하며 모델을 학습시킵니다.

이 예제는 Transformer의 기본 개념을 이해하기 위한 간단한 구현이며, 실제로는 더 많은 튜닝과 데이터 전처리가 필요합니다.

## 🔗 BERT와 GPT에서의 Transformer

### BERT (Bidirectional Encoder Representations from Transformers)

- **구조**: Transformer의 **Encoder** 부분만 사용합니다.
- **특징**:
  - 양방향으로 문맥을 이해합니다.
  - 마스킹된 언어 모델링(Masked Language Modeling)을 사용하여 학습합니다.
- **용도**:
  - 문장 분류, 개체명 인식, 질문 응답 등 다양한 NLP 작업에 활용됩니다.

### GPT (Generative Pretrained Transformer)

- **구조**: Transformer의 **Decoder** 부분만 사용합니다.
- **특징**:
  - 단방향(순방향)으로 문맥을 이해합니다.
  - 다음 단어를 예측하는 언어 모델링을 사용하여 학습합니다.
- **용도**:
  - 텍스트 생성, 번역, 요약 등 생성 관련 작업에 뛰어난 성능을 보입니다.

## 🧐 결론

Transformer는 현대 NLP의 핵심적인 아키텍처로, 그 유연성과 성능으로 인해 다양한 모델과 작업에서 활용되고 있습니다. 이번 답변에서는 Transformer의 기본 개념과 구조를 살펴보고, 간단한 구현 예제를 통해 이해를 도왔습니다. 더 깊이 있는 이해를 위해서는 공식 논문과 다양한 구현 예제를 참고하는 것을 권장합니다.

## 📚 참고 자료

- [Attention is All You Need 논문](https://arxiv.org/abs/1706.03762)
- [PyTorch Transformer 튜토리얼](https://pytorch.org/tutorials/beginner/transformer_tutorial.html)
- [BERT 논문](https://arxiv.org/abs/1810.04805)
- [GPT 논문](https://openai.com/research/language-unsupervised)