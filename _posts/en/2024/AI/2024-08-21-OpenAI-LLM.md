---
title: AI - Getting Started with OpenAI LLM Chat Feature
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
tags:
- AI
- LLM
toc: true
toc_sticky: true
toc_label: 목차
description: Taste the LLM Chat feature
article_tag1: AI
article_tag2: LLM
article_tag3: 
article_section: 
meta_keywords: AI, LLM
last_modified_at: '2024-08-19 21:00:00 +0800'
---

# AI - Getting Started with OpenAI LLM Chat Feature

# Creating an OpenAI LLM Chat Bot (Including Card Registration and Payment Methods)

This guide provides a quick overview of how to register a card and set up payment for using the OpenAI API.

### 1. Create an OpenAI Account and Log In
1. Visit the [OpenAI official website](https://platform.openai.com/).
2. If you don’t have an account, sign up; if you already have an account, log in.

### 2. Add Payment Information
1. After logging in, click on the profile icon at the top right corner and select **"Manage Account."**
2. In the left menu, click on **"Billing."**
3. Click the **"Add Payment Method"** button to add your payment information.
4. Enter your card details and click the **"Submit"** button to register your payment method.

### 3. Payment Confirmation and Usage
1. Once the payment method is registered, the fees for using the API will be automatically charged each month.
2. You can check your payment history on the **Billing** page and download invoices if needed.

### Additional Tips
- **Set a Budget**: Set a monthly budget to avoid unexpected overcharges.
- **Set Alerts**: Set up email notifications to be alerted when usage reaches a specific limit.

### If Not Set Up Correctly, You May Encounter the Following Errors:

```
You exceeded your current quota, please check your plan and billing details. For more information on this error,...
```

```
We couldn't process your payment. If this issue persists, please contact us through our help center at https://help.openai.com.
```

To use the API, follow the steps below to register a card and set up payment.

## How to Register a Card

Website:  
https://platform.openai.com/settings/organization/billing/overview

Image:  
![img](/assets/images/openai_site/openai_card.png "ai exam")

Register your card as indicated in the menu and make a partial payment.

## How to Generate an OpenAI Key

Website:  
https://platform.openai.com/settings/profile?tab=api-keys

Image:  
![img](/assets/images/openai_site/open_ai_key.png "ai exam")

## Writing Code

You can refer to the example code provided on the following reference sites.

### References

https://api.python.langchain.com/en/latest/chat_models/langchain_openai.chat_models.base.ChatOpenAI.html#langchain_openai.chat_models.base.ChatOpenAI

https://platform.openai.com/docs/guides/text-generation

https://platform.openai.com/docs/api-reference/chat/create?lang=python

![img](/assets/images/openai_site/open_ai_exam.png "ai exam")

### Example Code

```python
# pip install -U langchain-openai
from langchain_openai import ChatOpenAI

import os
os.environ["OPENAI_API_KEY"] = "YOUR_API_KEY..."

from openai import OpenAI

api_key = os.getenv("OPENAI_API_KEY")
OpenAI.api_key = api_key
client = OpenAI()

completion = client.chat.completions.create(
  model="gpt-4o-mini",
  messages=[
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello!"},
    {"role": "user", "content": "How is the weather today?"}
  ],
  max_tokens=100,
  temperature=0.5  # Adjusts the creativity of the response
)

print(completion.choices[0].message.content)
print(completion.choices[0].message)
```

--- 

This is the English translation of your original Korean article on how to get started with the OpenAI LLM chat feature.