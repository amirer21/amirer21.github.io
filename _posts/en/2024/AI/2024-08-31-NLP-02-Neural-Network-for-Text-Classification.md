---
title : AI - NLP (2) Text Classification Using Neural Network Models
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
toc_label: Table of Contents
description: Text classification using neural network models
article_tag1: AI
article_tag2: NLP
article_tag3: DeepLearning
article_section: 
meta_keywords: AI, OpenAI, LangChain, Transformer
last_modified_at: '2024-08-31 21:00:00 +0800'
---

This article demonstrates how to classify text as positive or negative using a simple neural network.

https://github.com/amirer21/RAG-Explorer/blob/master/NLP/NLP_02_Transformer_model_text_classification.py

### Example Code

```python
import tensorflow as tf
from tensorflow.keras.layers import Dense, Embedding, GlobalAveragePooling1D
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.model_selection import train_test_split
import numpy as np

# Prepare example data
texts = ["I love sunset", "Sky is beautiful", "I hate rain", "Cloud is beautiful"]
labels = [1, 1, 0, 1]  # Labels: 1 indicates Positive, 0 indicates Negative

# Tokenize and pad text sequences
tokenizer = Tokenizer(num_words=1000)  # Limit the vocabulary size to 1000 words
tokenizer.fit_on_texts(texts)  # Assign numbers to words in the texts (tokenization)
sequences = tokenizer.texts_to_sequences(texts)  # Convert texts into sequences of numbers
padded_sequences = pad_sequences(sequences, maxlen=10, padding='post')
# Pad sequences to a length of 10, adding zeros at the end ('post') if needed

# Split data (train/validation)
train_texts, val_texts, train_labels, val_labels = train_test_split(padded_sequences, labels, test_size=0.2)
# Split data into 80% for training and 20% for validation

# Convert labels to NumPy arrays
train_labels = np.array(train_labels)
val_labels = np.array(val_labels)

# Define the neural network model
model = tf.keras.Sequential([
    Embedding(input_dim=1000, output_dim=16, input_length=10),  # Embedding layer: Converts words to 16-dimensional vectors
    GlobalAveragePooling1D(),  # Computes the average of the embedding vectors
    Dense(16, activation='relu'),  # Hidden layer: 16 nodes with ReLU activation
    Dense(1, activation='sigmoid')  # Output layer: 1 node with sigmoid activation (binary classification)
])

# Compile the model
model.compile(optimizer='adam',
              loss='binary_crossentropy',  # Use binary cross-entropy loss
              metrics=['accuracy'])  # Use accuracy as the performance metric

# Train the model
model.fit(train_texts, train_labels, validation_data=(val_texts, val_labels), epochs=10)
# Train the model for 10 epochs, evaluating performance on validation data

# Prediction
sample_text = ["I love to take a picture of sunset"]  # New sample text input
sample_sequence = tokenizer.texts_to_sequences(sample_text)  # Convert the sample text into a sequence
padded_sample = pad_sequences(sample_sequence, maxlen=10, padding='post')
# Pad the sequence to match the training data length of 10, adding zeros if needed
prediction = model.predict(padded_sample)  # Make a prediction using the model
print("Predicted label (Simple Neural Network):", "Positive" if prediction > 0.5 else "Negative")
# Print "Positive" if the prediction is greater than 0.5, otherwise "Negative"

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

This code demonstrates how to perform sentiment analysis using a simple neural network. The primary goal of the code is to classify input text data as either Positive or Negative. Here are the key components:

1. **Text Preprocessing**:
   - The `Tokenizer` is used to tokenize text data, assigning numbers to each word in the text.
   - The `pad_sequences` function is used to standardize the length of sequences to 10, padding with zeros at the end (`post`) where necessary.

2. **Data Splitting**:
   - Text and label data are split into training and validation sets, with 80% of the data used for training and 20% for validation.
   - Labels are converted into NumPy arrays for use in model training.

3. **Defining the Neural Network Model**:
   - The model is defined using `tf.keras.Sequential`, stacking layers sequentially.
   - **Embedding Layer**: Converts words into 16-dimensional vectors using the `Embedding` layer, allowing the model to learn numerical representations of words.
   - **Global Average Pooling Layer**: Computes the average of the embedding vectors to reduce input dimensions.
   - **Dense Layer**: The first hidden layer contains 16 nodes with ReLU activation.
   - **Output Layer**: The output layer has one node with sigmoid activation, used for binary classification. Predictions are expressed as probabilities between 0 and 1, with a threshold of 0.5 for classification as positive or negative.

4. **Compiling and Training the Model**:
   - The model is compiled with the Adam optimizer and binary cross-entropy loss (`binary_crossentropy`). Accuracy (`accuracy`) is set as the evaluation metric.
   - The model is trained over 10 epochs using the training and validation data.

5. **Predicting New Text**:
   - The model predicts the sentiment of a new text input ("I love to take a picture of sunset").
   - The sample text is converted to a sequence and padded to match the length used in training.
   - The model makes a prediction, and if the prediction value is greater than 0.5, it is classified as Positive; otherwise, it is classified as Negative.

**Key Takeaways from the Code:**
- This demonstrates that text classification using a simple neural network is feasible, with text data being preprocessed and fed into the network to predict positive or negative sentiment.
- The combination of embedding, global pooling, and Dense layers provides a basic sentiment analysis model.
- The model's predictive accuracy depends on the characteristics of the text and the extent of the model's training, with the quality and quantity of data significantly impacting performance.