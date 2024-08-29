---
title: Artificial Intelligence - Transformer (1)
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
description: Artificial Intelligence - Transformer (1)
article_tag1: AI
article_tag2: Transformer
article_tag3: 
article_section: 
meta_keywords: AI, LLM, Transformer
last_modified_at: '2024-08-25 21:00:00 +0800'
---

`Transformer` is a neural network architecture introduced in the 2017 Google research paper, "Attention is All You Need." It has achieved groundbreaking results in the fields of natural language processing (NLP) and computer vision (CV). Modern language models like `BERT` and `GPT` are all based on the Transformer architecture.

In this article, we will explain the basic concepts and structure of the Transformer and provide a simple example code to help you understand it better.

## 🔍 What is a Transformer?

Unlike traditional Recurrent Neural Networks (RNNs) or Convolutional Neural Networks (CNNs), which are suitable for sequential data processing, Transformers leverage the **Self-Attention mechanism**. This allows them to perform parallel processing and effectively learn long-range dependencies.

### Key Features

- **Parallel Processing Capable**: Transformers do not rely on sequential processing, allowing them to learn from large amounts of data quickly.
- **Learning Long Dependencies**: They can effectively learn relationships between distant words in a sentence, leading to more accurate context understanding.
- **Flexible Structure**: Comprising an Encoder and Decoder, the Transformer can be adapted for various tasks.

## 🏗️ Components of a Transformer

A Transformer is broadly composed of two parts: the **Encoder** and the **Decoder**.

### 1. Encoder

- Converts input sentences into internal representations.
- Composed of multiple identical layers, each consisting of **Self-Attention** and **Feed-Forward Neural Networks**.

### 2. Decoder

- Takes the output from the Encoder and generates the target output sequence.
- Similarly, it comprises multiple identical layers, each consisting of **Self-Attention**, **Encoder-Decoder Attention**, and **Feed-Forward Neural Networks**.

### 3. Self-Attention Mechanism

- Learns the relationships between words within an input sequence.
- Determines how each word should reference other words in the sentence, providing richer representations.

### 4. Multi-Head Attention

- Performs several Self-Attention operations in parallel to extract information from different representation spaces.
- Enables the model to learn diverse contextual information simultaneously.

### 5. Position Encoding

- Adds positional information to input sequences, which lack inherent order, allowing the model to recognize word sequences.

## 🧪 Example Code

Now, let's look at a simple example of implementing a Transformer model using PyTorch.

### Installing Required Libraries

```bash
pip install torch torchvision torchtext
```

### Importing Libraries

```python
import torch
import torch.nn as nn
import torch.optim as optim
from torchtext.datasets import Multi30k
from torchtext.data import Field, BucketIterator
```

### Data Preprocessing

```python
SRC = Field(tokenize="spacy", tokenizer_language="de", init_token='<sos>', eos_token='<eos>', lower=True)
TRG = Field(tokenize="spacy", tokenizer_language="en", init_token='<sos>', eos_token='<eos>', lower=True)

train_data, valid_data, test_data = Multi30k.splits(exts=('.de', '.en'), fields=(SRC, TRG))

SRC.build_vocab(train_data, min_freq=2)
TRG.build_vocab(train_data, min_freq=2)
```

### Model Definition

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

### Model Initialization and Training Setup

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

### Training Loop

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

### Example Explanation

1. **Data Preprocessing**: Loads and preprocesses German-English translation data using `torchtext`.
2. **Model Definition**: Implements the Transformer architecture in the `TransformerModel` class.
3. **Model Initialization**: Sets vocabulary sizes, padding indices, and initializes the model.
4. **Training Loop**: Iterates over the data to train the model.

This example is a simple implementation to understand the basic concept of Transformers, and further tuning and data preprocessing are required for practical use.

## 🔗 Transformers in BERT and GPT

### BERT (Bidirectional Encoder Representations from Transformers)

- **Structure**: Uses only the **Encoder** part of the Transformer.
- **Characteristics**:
  - Understands context bidirectionally.
  - Trained using Masked Language Modeling.
- **Applications**:
  - Used for various NLP tasks like sentence classification, named entity recognition, and question answering.

### GPT (Generative Pretrained Transformer)

- **Structure**: Uses only the **Decoder** part of the Transformer.
- **Characteristics**:
  - Understands context in a unidirectional (forward) manner.
  - Trained using language modeling to predict the next word.
- **Applications**:
  - Excels in generative tasks like text generation, translation, and summarization.

## 🧐 Conclusion

The Transformer is a pivotal architecture in modern NLP, and its flexibility and performance have led to its application across various models and tasks. In this article, we explored the basic concepts and structure of Transformers and provided a simple implementation example to aid understanding. For a deeper understanding, it is recommended to refer to the original paper and various implementation examples.

## 📚 References

- [Attention is All You Need paper](https://arxiv.org/abs/1706.03762)
- [PyTorch Transformer Tutorial](https://pytorch.org/tutorials/beginner/transformer_tutorial.html)
- [BERT paper](https://arxiv.org/abs/1810.04805)
- [GPT paper](https://openai.com/research/language-unsupervised)

--- 

This is the translated version of your original Korean article on the Transformer architecture.