---
title: AI - NLP (1) Using Deep Learning Models for NLP Tasks
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
description: Example code and explanation for using deep learning models in NLP tasks
article_tag1: AI
article_tag2: NLP
article_tag3: DeepLearning
article_section: 
meta_keywords: AI, OpenAI, LangChain
last_modified_at: '2024-08-31 21:00:00 +0800'
---

This example code demonstrates sentiment analysis using a BERT-based model in NLP tasks.

https://github.com/amirer21/RAG-Explorer/blob/master/NLP/NLP_01_DeepLearningTasks.py

```python
# Python module installation
# pip install --upgrade tensorflow keras
# pip install tensorflow transformers
# pip install scikit-learn

import tensorflow as tf
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import numpy as np

# Prepare example data
texts = ["I love sunset", "Sky is beautiful", "I hate rain", "Cloud is beautiful"]
labels = ["positive", "positive", "negative", "positive"]  # Define labels as positive and negative

# Label encoding
label_encoder = LabelEncoder()
labels_encoded = label_encoder.fit_transform(labels)  # Convert text labels to integer values (0: Negative, 1: Positive)

# Split data (train/validation)
train_texts, val_texts, train_labels, val_labels = train_test_split(texts, labels_encoded, test_size=0.2)
# Split data into 80% for training and 20% for validation

# Load pre-trained model and tokenizer
model_name = "distilbert-base-uncased"  # Set the model name to a lightweight version of BERT
tokenizer = AutoTokenizer.from_pretrained(model_name)  # Load the tokenizer for the model
model = TFAutoModelForSequenceClassification.from_pretrained(model_name, num_labels=2)
# Load the pre-trained BERT model, set it up for binary classification (positive/negative)

# Text tokenization
train_encodings = tokenizer(train_texts, truncation=True, padding=True, max_length=128, return_tensors="tf")
val_encodings = tokenizer(val_texts, truncation=True, padding=True, max_length=128, return_tensors="tf")
# Tokenize training and validation data to be processed by the BERT model

# Prepare TensorFlow datasets
train_dataset = tf.data.Dataset.from_tensor_slices((dict(train_encodings), train_labels)).shuffle(100).batch(2)
val_dataset = tf.data.Dataset.from_tensor_slices((dict(val_encodings), val_labels)).batch(2)
# Convert to TensorFlow datasets, shuffle training data, set batch size to 2

# Compile the model
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=5e-5),
              loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
              metrics=['accuracy'])
# Compile the model with Adam optimizer, binary cross-entropy loss, and accuracy as a metric

# Train the model
model.fit(train_dataset, validation_data=val_dataset, epochs=3)
# Train the model for 3 epochs and evaluate performance on validation data

# Prediction
sample_text = ["I love to take a picture of sunset"]
sample_encoding = tokenizer(sample_text, truncation=True, padding=True, max_length=128, return_tensors="tf")
logits = model(sample_encoding).logits
predicted_label = np.argmax(logits, axis=1)
# Predict sentiment for new text, tokenize the text, use the model to predict, select the label with the highest probability

print(f"Predicted label: {label_encoder.inverse_transform(predicted_label)[0]}")
# Convert the predicted label back to the original text label and print it

"""
2/2 [==============================] - 15s 2s/step - loss: 0.5507 - accuracy: 1.0000 - val_loss: 0.9798 - val_accuracy: 0.0000e+00
Epoch 2/3
2/2 [==============================] - 1s 655ms/step - loss: 0.4002 - accuracy: 1.0000 - val_loss: 1.3466 - val_accuracy: 0.0000e+00
Epoch 3/3
2/2 [==============================] - 1s 664ms/step - loss: 0.2355 - accuracy: 1.0000 - val_loss: 1.8205 - val_accuracy: 0.0000e+00
Predicted label: positive
"""
# Training and prediction results, the final predicted label is "positive"
```

This code is an example of using a pre-trained BERT model for sentiment analysis in text. The primary function of this code is to classify text data as positive or negative. Here's what the code accomplishes:

1. **Label Encoding and Data Splitting**:
   - Prepare text data (`texts`) and labels (`labels`), then encode the labels into integer values using `LabelEncoder`.
   - Split the data into training and validation sets with an 80:20 ratio.

2. **Loading Pre-trained Model and Tokenizer**:
   - Use a lightweight version of the pre-trained BERT model, "distilbert-base-uncased", to set up a text classification model.
   - Load the tokenizer associated with the model to tokenize the text data.

3. **Tokenizing Data and Creating TensorFlow Datasets**:
   - Tokenize the training and validation data so that the BERT model can process it, using `truncation` and `padding` options.
   - Convert the tokenized data into TensorFlow datasets, shuffle the training data, and set the batch size to 2.

4. **Compiling and Training the Model**:
   - Compile the model using the Adam optimizer, binary cross-entropy loss (`SparseCategoricalCrossentropy`), and set accuracy as the evaluation metric.
   - Train the model for 3 epochs, evaluating its performance on the validation data.

5. **Predicting New Text**:
   - Predict sentiment for a new piece of text. The text is tokenized, and the model predicts the sentiment, selecting the label with the highest probability and printing the result.
