---
title: AI - NLP (5) Comparative Analysis of DNN, CNN, RNN, and GRU Models on Text Classification Task
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
toc_label: Table of Contents
description: Comparative Analysis of DNN, CNN, RNN, and GRU Models on Text Classification Task
article_tag1: AI
article_tag2: NLP
article_tag3: DeepLearning
article_section: 
meta_keywords: AI, OpenAI, LangChain
last_modified_at: '2024-08-31 21:00:00 +0800'
---

This article explains the content of example code and the meaning of the output graph for a comparative analysis of DNN, CNN, RNN, and GRU models on text classification tasks.

### Code Explanation

1. **Data Preprocessing**:
   - Converts text data into integer sequences and adds padding to standardize sequence lengths.
   - Training labels are converted to one-hot encoding.

2. **Model Definition**:
   - Defines four types of models:
     - **DNN (Deep Neural Network)**: A simple dense neural network with text embedding, followed by Flatten and multiple Dense layers.
     - **CNN (Convolutional Neural Network)**: Extracts features using 1D convolution and max pooling layers after text embedding.
     - **RNN (Recurrent Neural Network)**: Uses LSTM layers to process sequential data (text).
     - **GRU (Gated Recurrent Unit)**: A recurrent neural network similar to LSTM but with a simpler structure.

3. **Model Training and Evaluation**:
   - Each model is trained, and its accuracy on the training data is calculated.
   - The training accuracy of each model is compared, and the results are printed and visualized.

```python
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Embedding, Flatten, Conv1D, MaxPooling1D, LSTM, GRU
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.utils import to_categorical
import matplotlib.pyplot as plt

def preprocess_texts(train_texts, train_labels, new_texts, num_words=1000, max_len=20):
    """
    Converts text data into integer sequences and applies padding for model input preparation.
    
    Args:
        train_texts (list): Training text data.
        train_labels (list): Labels for training data.
        new_texts (list): New text data for prediction.
        num_words (int): Maximum number of words to use.
        max_len (int): Maximum length of sequences.
    
    Returns:
        tuple: Preprocessed training data (x_train, y_train) and new data (x_new).
    """
    tokenizer = Tokenizer(num_words=num_words)
    tokenizer.fit_on_texts(train_texts)

    x_train = tokenizer.texts_to_sequences(train_texts)
    x_new = tokenizer.texts_to_sequences(new_texts)

    x_train = pad_sequences(x_train, maxlen=max_len, padding='post')
    x_new = pad_sequences(x_new, maxlen=max_len, padding='post')

    y_train = to_categorical(train_labels, 2)  # Convert labels to one-hot encoding

    return x_train, y_train, x_new

def train_and_evaluate_model(model, x_train, y_train):
    """
    Trains and evaluates a model.
    
    Args:
        model (Sequential): Model to train.
        x_train (array): Training data.
        y_train (array): Training labels.
    
    Returns:
        tuple: Training history and model accuracy.
    """
    model.compile(optimizer='adam',
                  loss='categorical_crossentropy',
                  metrics=['accuracy'])

    history = model.fit(x_train, y_train, epochs=10, batch_size=2, verbose=0)
    scores = model.evaluate(x_train, y_train, verbose=0)
    return history, scores[1]

def build_dnn_model(input_dim, max_len):
    """
    Builds a simple DNN model.
    
    Args:
        input_dim (int): Dimension of input data (number of words).
        max_len (int): Maximum length of input sequences.
    
    Returns:
        Sequential: Defined DNN model.
    """
    model = Sequential()
    model.add(Embedding(input_dim=input_dim, output_dim=128, input_length=max_len))
    model.add(Flatten())
    model.add(Dense(128, activation='relu'))
    model.add(Dropout(rate=0.5))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(2, activation='softmax'))
    return model

def build_cnn_model(input_dim, max_len):
    """
    Builds a CNN model with Conv1D and MaxPooling1D layers.
    
    Args:
        input_dim (int): Dimension of input data (number of words).
        max_len (int): Maximum length of input sequences.
    
    Returns:
        Sequential: Defined CNN model.
    """
    model = Sequential()
    model.add(Embedding(input_dim=input_dim, output_dim=128, input_length=max_len))
    model.add(Conv1D(128, 5, activation='relu'))
    model.add(MaxPooling1D(pool_size=2))
    model.add(Flatten())
    model.add(Dense(64, activation='relu'))
    model.add(Dense(2, activation='softmax'))
    return model

def build_rnn_model(input_dim, max_len):
    """
    Builds an RNN model with an LSTM layer.
    
    Args:
        input_dim (int): Dimension of input data (number of words).
        max_len (int): Maximum length of input sequences.
    
    Returns:
        Sequential: Defined RNN model.
    """
    model = Sequential()
    model.add(Embedding(input_dim=input_dim, output_dim=128, input_length=max_len))
    model.add(LSTM(128))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(2, activation='softmax'))
    return model

def build_gru_model(input_dim, max_len):
    """
    Builds a GRU model.
    
    Args:
        input_dim (int): Dimension of input data (number of words).
        max_len (int): Maximum length of input sequences.
    
    Returns:
        Sequential: Defined GRU model.
    """
    model = Sequential()
    model.add(Embedding(input_dim=input_dim, output_dim=128, input_length=max_len))
    model.add(GRU(128))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(2, activation='softmax'))
    return model

# Preparing data
# Example text data and labels for training and testing
train_texts = ["This food is really delicious", "Not very tasty", "I recommend this food", "The taste is very bad"]
train_labels = [1, 0, 1, 0]
new_texts = ["This food is amazing!", "It's not worth the money."]

# Preprocess data
x_train, y_train, x_new = preprocess_texts(train_texts, train_labels, new_texts)

# Define a list of models to train and evaluate
models = [
    ("DNN", build_dnn_model(1000, 20)),
    ("CNN", build_cnn_model(1000, 20)),
    ("RNN", build_rnn_model(1000, 20)),
    ("GRU", build_gru_model(1000, 20))
]

# Dictionary to store results
results = {}

# Train and evaluate each model
for name, model in models:
    print(f"Training {name} model...")
    history, accuracy = train_and_evaluate_model(model, x_train, y_train)
    results[name] = (history, accuracy)

# Compare and visualize results
for name, (history, accuracy) in results.items():
    print(f"{name} Model - Training Accuracy: {accuracy * 100:.2f}%")

# Plotting the training accuracy of each model
plt.figure(figsize=(10, 5))
for name, (history, _) in results.items():
    plt.plot(history.history['accuracy'], label=f'{name} Accuracy')
plt.title('Model Accuracy Comparison')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.show()
```

### Graph Explanation

![img](/assets/images/ai/Figure_1.png "models")

- The graph visualizes the training accuracy of each model over the epochs.
- **DNN, CNN, and RNN models** gradually improve and reach 100% accuracy, indicating they correctly classified all samples in the training data.
- **GRU model** maintained a low accuracy of 50%, showing no improvement during training, suggesting it did not learn effectively from the given dataset.

#### Graph Interpretation
- The DNN and CNN models quickly achieve 100% accuracy, showing stable learning processes.
- The RNN model shows some fluctuations but eventually reaches 100% accuracy.
- The GRU model fails to learn, maintaining an accuracy of 50% throughout training. This could indicate that the data is too simple or that the GRU is not well-suited for this dataset.

These results demonstrate how each model learns on a simple dataset, clearly highlighting that some models fail to learn from the data provided.