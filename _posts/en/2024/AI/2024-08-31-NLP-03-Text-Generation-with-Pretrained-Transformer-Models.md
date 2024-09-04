---
title : AI - NLP (3) Text Generation with Pre-trained Transformer Models
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
description: Text generation using pre-trained Transformer models
article_tag1: AI
article_tag2: NLP
article_tag3: DeepLearning
article_section: 
meta_keywords: AI, OpenAI, LangChain, Transformer
last_modified_at: '2024-08-31 21:00:00 +0800'
---

This example code demonstrates how to quickly predict sentiment using a pre-trained Transformer model.

### Example Code

https://github.com/amirer21/RAG-Explorer/blob/master/NLP/NLP_03_Transformer_model_text_generation.py

```python
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer
import numpy as np

# Load pre-trained Transformer model and tokenizer
model_name = "distilbert-base-uncased"  # Set the name of the pre-trained model to use (DistilBERT)
tokenizer = AutoTokenizer.from_pretrained(model_name)  # Load the tokenizer for the selected model
model = TFAutoModelForSequenceClassification.from_pretrained(model_name)  # Load the pre-trained DistilBERT model

# Prepare text data
sample_text = ["I enjoy learning new things"]  # Input sentence for prediction
input_encoding = tokenizer(sample_text, truncation=True, padding=True, max_length=128, return_tensors="tf")
# Tokenize the sentence, apply padding and truncation, and encode the input for the model
# Set max_length=128 to use up to 128 tokens only

# Make prediction using the Transformer model
logits = model(input_encoding).logits  # Pass encoded text to the model and get logits output
predicted_label = np.argmax(logits, axis=-1)  # Select the index of the largest logit as the predicted label

# Print prediction result
print("Predicted label (Transformer):", "Positive" if predicted_label == 1 else "Negative")
# If the predicted label is 1, print "Positive"; otherwise, print "Negative"
# Code execution result: Predicted label (Transformer): Positive
```

This code is an example of using a pre-trained Transformer model, DistilBERT, to classify the sentiment of text. It predicts whether the input sentence is positive or negative. Here are the main features and insights from the code execution:

### Code Explanation:

1. **Loading Model and Tokenizer**:
   - `model_name = "distilbert-base-uncased"`: Uses the pre-trained DistilBERT model, a lighter version of BERT that maintains performance while being faster and using less memory.
   - `AutoTokenizer.from_pretrained(model_name)`: Loads the tokenizer specific to DistilBERT. This tokenizer converts text into tokens that the model can understand.
   - `TFAutoModelForSequenceClassification.from_pretrained(model_name)`: Loads the pre-trained DistilBERT model configured for sequence classification, suitable for tasks like sentiment analysis.

2. **Preprocessing Input Text**:
   - `sample_text = ["I enjoy learning new things"]`: A sample text for sentiment prediction.
   - `tokenizer(sample_text, truncation=True, padding=True, max_length=128, return_tensors="tf")`: 
     - Tokenizes the input text and encodes it to a format suitable for the model.
     - The options `truncation=True` and `padding=True` ensure the sequence is truncated to a maximum length of 128 tokens and padded if shorter.
     - `return_tensors="tf"` returns the encoded input as a TensorFlow tensor, ready for model input.

3. **Model Prediction**:
   - `logits = model(input_encoding).logits`: Passes the encoded input to the model to obtain logits, which represent the scores for the predicted classes (labels).
   - `predicted_label = np.argmax(logits, axis=-1)`: Selects the index of the highest value in the logits as the predicted label. The DistilBERT model is configured for binary classification, predicting one of two labels (positive or negative).

4. **Output the Result**:
   - Prints "Positive" if the predicted label is 1; otherwise, it prints "Negative".
   - In this example, the output is `Predicted label (Transformer): Positive`.

### Insights from the Execution:

- **Sentiment Prediction**: For the input sentence "I enjoy learning new things", the model classifies it as having a positive sentiment ("Positive").
- **Using Pre-trained Models**: By leveraging a pre-trained DistilBERT model, the code performs sentiment classification without additional training. This is possible because BERT models have been pre-trained on large text datasets to understand contextual meaning, and their performance depends on the dataset and training approach.
- **Application of Transformer Models**: This example shows that Transformer-based models can understand the sentiment of text and classify sentences as positive or negative.

**In conclusion**, this code demonstrates the ability to predict whether an input sentence is positive or negative using a pre-trained Transformer model like DistilBERT. Pre-trained models excel at understanding context, making them highly effective for text classification tasks.