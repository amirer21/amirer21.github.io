---
title: Artificial Intelligence - Learn LangChain with Simple Examples
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
- Langchain
toc: true
toc_sticky: true
toc_label: 목차
description: Learn LangChain with Simple Examples
article_tag1: AI
article_tag2: LLM
article_tag3: Langchain
article_section: 
meta_keywords: AI, LLM, Langchain
last_modified_at: '2024-08-22 21:00:00 +0800'
---

# Artificial Intelligence - Learn LangChain with Simple Examples

### How to Install LangChain and a Simple LLM Example Code
To use LangChain, you first need to install the LangChain library in your Python environment. You can do this using the pip package manager.

#### Installation Command:

```bash
pip install langchain
```

Additionally, if you want to use an LLM (Large Language Model) like OpenAI, you need to install the corresponding API client. For example, to use OpenAI, you can install it as follows:

```bash
pip install openai
```

### Simple Example of Using LangChain

Below is an example of setting up and running a simple chain using LangChain. This example creates a chain that generates answers to input questions using OpenAI's GPT-3.

#### Basic Setup:

First, you need to set your OpenAI API key, which you can obtain from OpenAI.

```python
import os
from langchain import OpenAI, LLMChain

# Set OpenAI API key
os.environ["OPENAI_API_KEY"] = "your-openai-api-key-here"
```

#### Creating a Simple Chain:

In this example, we create a chain that takes a question from the user and generates an answer using OpenAI's GPT-3 model.

```python
from langchain.prompts import PromptTemplate

# Define a prompt template
prompt_template = PromptTemplate(
    input_variables=["question"],
    template="Q: {question}\nA:"
)

# Set up OpenAI LLM
llm = OpenAI(temperature=0.7)

# Create LLMChain
chain = LLMChain(llm=llm, prompt=prompt_template)

# Input question
question = "What is the capital of France?"

# Run the chain and print the output
answer = chain.run(question)
print(f"Question: {question}")
print(f"Answer: {answer}")
```

#### Execution Result:

When you run the above code, the OpenAI GPT-3 model generates an answer to the question. For example, if the input question is "What is the capital of France?", the output would be:

```plaintext
Question: What is the capital of France?
Answer: The capital of France is Paris.
```

### Summary

- **Installation**: Install LangChain with the command `pip install langchain`.
- **Set API Key**: Set the OpenAI API key as an environment variable.
- **Create a Simple Chain**: Use LLMChain and PromptTemplate to create a chain that answers questions.
- **Execution**: Run the chain to output the model's response.

Through this simple example, you can see how easy it is to develop LLM-based applications using LangChain. LangChain also provides various other features to support complex AI workflows.