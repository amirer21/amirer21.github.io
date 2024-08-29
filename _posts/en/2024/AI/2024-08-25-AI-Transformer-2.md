---
title: Artificial Intelligence - Transformer (2)
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
description: Artificial Intelligence - Transformer (2)
article_tag1: AI
article_tag2: Transformer
article_tag3: 
article_section: 
meta_keywords: AI, LLM, Transformer
last_modified_at: '2024-08-25 21:00:00 +0800'
---

# Artificial Intelligence - Transformer

### What is a Transformer?

The Transformer is a neural network architecture widely used in natural language processing (NLP) and other sequence modeling tasks. Introduced in the 2017 paper "Attention is All You Need," this model overcomes the limitations of traditional Recurrent Neural Networks (RNNs) and Long Short-Term Memory (LSTM) networks by being more efficient in parallel processing and learning long-term dependencies.

The core component of the Transformer is the **attention mechanism** (specifically, self-attention). This mechanism allows the model to learn the relationships between words within an input sequence and focus more on important information.

Examples of models based on the Transformer architecture include BERT (Bidirectional Encoder Representations from Transformers) and GPT (Generative Pretrained Transformer).

---

### Component Combination Order

The order in which the components are combined to implement a Transformer model is as follows:

1. **Embedding Layer**: Converts input tokens into high-dimensional vectors.
2. **Positional Encoding**: Adds position information of words in a sequence to the embeddings.
3. **Transformer Encoder**: Composed of multiple encoder layers that process input data and extract features.
4. **Output Layer**: Transforms the encoder's output into the desired form.

---

### Execution

To run a Transformer model, follow these steps:

1. **Import Necessary Libraries**: Import PyTorch and other necessary modules.
2. **Define Model Components**: Define the embedding, positional encoding, encoder, output layer, etc.
3. **Initialize the Model**: Combine the defined components to initialize the model.
4. **Prepare Input Data**: Prepare the data to be fed into the model.
5. **Run the Model**: Pass the input data through the model to obtain the output.
6. **Check the Output**: Verify the model's output and perform any necessary post-processing.

---

### Code

Below is an example code that implements a simple Transformer model using PyTorch:

```python
import torch
import torch.nn as nn
import math

# Define the Positional Encoding class
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

# Define a simple Transformer model class
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

# Set model parameters
input_dim = 1000  # Vocabulary size (e.g., 1000)
model_dim = 512
num_heads = 8
num_layers = 6
output_dim = 1000  # Output dimension (e.g., vocabulary size)

# Initialize the model
model = SimpleTransformer(input_dim, model_dim, num_heads, num_layers, output_dim)

# Example input data (sequence length 10, batch size 32)
src = torch.randint(0, input_dim, (10, 32))  # [seq_length, batch_size]

# Run the model
output = model(src)

# Check the output
print(output.shape)  # Expected output: [10, 32, 1000]
```

---

### Explanation

1. **Positional Encoding**:
   - Adds positional information to embedding vectors so the model can recognize the order of words in a sequence.
   - Uses sine and cosine functions to create unique patterns for each position.

2. **Embedding Layer**:
   - Converts input token indices (e.g., words) into high-dimensional vectors.
   - Uses `nn.Embedding` to define the vocabulary size (`input_dim`) and model dimension (`model_dim`).

3. **Transformer Encoder**:
   - Built by stacking multiple `TransformerEncoderLayer`s.
   - Each encoder layer consists of multi-head attention and feed-forward neural networks.

4. **Output Layer**:
   - Uses `nn.Linear` to transform the encoder's output to the desired dimension.
   - For language modeling tasks, the output dimension is set to match the vocabulary size.

5. **Run the Model and Check Output**:
   - Generates arbitrary input data and runs it through the model.
   - Checks the shape of the output to confirm it is `[sequence length, batch size, output dimension]` as expected.

This example explains the basic structure of the Transformer architecture. In real applications, additional components such as data preprocessing, training loops, and loss functions are required. Explore and experiment with Transformer models to implement various NLP tasks.

--- 

This is the translated version of your original Korean article about the Transformer architecture.