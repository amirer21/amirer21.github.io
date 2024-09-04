---
title: AI - Smith LangChain Integration Example Code
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
tags:
- AI
- OpenAI
- LangChain
toc: true
toc_sticky: true
toc_label: Table of Contents
description: AI - Simple Integration Example Code for Smith LangChain
article_tag1: AI
article_tag2: OpenAI
article_tag3: LangChain
article_section: 
meta_keywords: AI, OpenAI, LangChain
last_modified_at: '2024-08-30 21:00:00 +0800'
---

# Let's Integrate and Explore Code on smith.langchain.com

### Prerequisites

- LangChain Account
- LangChain API Key
- OpenAI Account
- OpenAI API Key
- Python Development Environment
- Example Code for Integration

## Generating a LangChain API Key

### Visit https://smith.langchain.com/

Click on the settings gear icon at the bottom left of the page.

![img](/assets/images/langchain/Smith_LangChain.png "langchain")

### Generate API Key

Copy the key when it is generated and save it for use in your code. Note that the generated key cannot be viewed again on the web, so save it carefully when created.

![img](/assets/images/langchain/Smith_LangChain_02_key.png "langchain")


## Example Code

```python
from langchain_openai import ChatOpenAI
import os
import openai
from dotenv import load_dotenv  # Package to load .env files
# Load environment variables
load_dotenv(dotenv_path='openapi_key.env')

# Load OPENAI_API_KEY
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    print("OpenAI API Key loaded successfully.")
    openai.api_key = api_key
else:
    raise ValueError("OPENAI_API_KEY environment variable is not set. Check your .env file.")

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_PROJECT"] = "MyTestProject03"

# Verify environment variables are set correctly
print("LANGCHAIN_TRACING_V2:", os.getenv("LANGCHAIN_TRACING_V2"))
print("LANGCHAIN_ENDPOINT:", os.getenv("LANGCHAIN_ENDPOINT"))
print("LANGCHAIN_API_KEY:", os.getenv("LANGCHAIN_API_KEY"))
print("LANGCHAIN_PROJECT:", os.getenv("LANGCHAIN_PROJECT"))

# Create ChatOpenAI object
llm = ChatOpenAI()
# Send a message using the ChatOpenAI object
answer = llm.invoke("Hello, world!")
print(answer)
```

### Detailed Code Explanation

This code is an example of using OpenAI and LangChain APIs to set environment variables and generate simple text responses using LangChain's `ChatOpenAI` model. Below are explanations of each step:

#### 1. Import Required Packages
```python
from langchain_openai import ChatOpenAI
import os
import openai
from dotenv import load_dotenv
```
- **`ChatOpenAI`**: Imports the class for using OpenAI's chatbot model in LangChain.
- **`os`**: Used for interacting with the operating system and managing environment variables.
- **`openai`**: The package required for interacting with OpenAI's API.
- **`dotenv`**: Used to load environment variables from a `.env` file.

#### 2. Load Environment Variables
```python
load_dotenv(dotenv_path='openapi_key.env')
```
- Loads environment variables from a `.env` file (`openapi_key.env`). This file should contain important information like API keys.

#### 3. Load and Set the OpenAI API Key
```python
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    print("OpenAI API Key loaded successfully.")
    openai.api_key = api_key
else:
    raise ValueError("OPENAI_API_KEY environment variable is not set. Check your .env file.")
```
- **Load API Key**: Retrieves the OpenAI API key from the environment variable `OPENAI_API_KEY`.
- **Check and Set Key**: Verifies if the key was loaded successfully, and if not, it displays an error message. If the key is loaded, it sets the OpenAI API key for the OpenAI package.

#### 4. Set LangChain Environment Variables
```python
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_PROJECT"] = "MyTestProject03"
```
- Sets various environment variables for use with LangChain:
  - **`LANGCHAIN_TRACING_V2`**: Enables tracing features.
  - **`LANGCHAIN_ENDPOINT`**: Sets the endpoint for the LangChain API.
  - **`LANGCHAIN_PROJECT`**: Specifies the project name for tracking tasks in LangChain.

#### 5. Print Set Environment Variables
```python
print("LANGCHAIN_TRACING_V2:", os.getenv("LANGCHAIN_TRACING_V2"))
print("LANGCHAIN_ENDPOINT:", os.getenv("LANGCHAIN_ENDPOINT"))
print("LANGCHAIN_API_KEY:", os.getenv("LANGCHAIN_API_KEY"))
print("LANGCHAIN_PROJECT:", os.getenv("LANGCHAIN_PROJECT"))
```
- Outputs the set environment variables to the console for verification.

#### 6. Create and Send Messages with ChatOpenAI
```python
# Create ChatOpenAI object
llm = ChatOpenAI()

# Send a message using the ChatOpenAI object
answer = llm.invoke("Hello, world!")
print(answer)
```
- **Create `ChatOpenAI` Object**: Initializes LangChain's OpenAI chatbot model.
- **Send Message and Print Response**: Sends the message `"Hello, world!"` to the model and prints the model's response.

This code demonstrates how to configure and use the OpenAI and LangChain APIs for simple message processing.

## LangChain Project Dashboard

After running the code above, the project will be registered on LangChain, and you can review the execution details. The LangChain Project Dashboard offers key features and tools:

1. **Runs Monitoring**:
   - **Manage Runs**: Monitor and manage all tasks (e.g., model calls, queries) executed in the project.
   - **Review Inputs and Outputs**: Check the inputs and outputs of each run to assess the model's behavior.
   - **Performance Metrics**: View performance metrics like execution time, latency, token usage, and error rates.

2. **Filtering and Searching**:
   - **Use Filters**: Filter execution logs by specific conditions (e.g., time range, message type) to easily find the data you need.
   - **Detailed Search**: Perform detailed searches on executed tasks to find and analyze specific data.

3. **Project Settings and Setup**:
   - **Project Configuration**: Set up environment settings, tracing, endpoints, etc., for your project.
   - **Manage Model and API Configurations**: Configure and manage API keys for the models connected to LangChain.

4. **Resource Management**:
   - **Resource Management**: Monitor and manage resources (models, API calls) used in the project.
   - **Cost Monitoring**: Monitor token usage and associated costs to manage your budget effectively.

5. **Debugging and Analysis**:
   - **Debugging Tools**: Analyze logs and performance data from executed tasks to resolve issues with the model or workflow.
   - **Detailed Run Analysis**: Review detailed logs of each run to closely analyze the model's response and performance.

This dashboard mainly provides features for monitoring the execution and performance of LangChain projects, helping to optimize or troubleshoot your project.

### Visit https://smith.langchain.com/

![img](/assets/images/langchain/Smith_LangChain_03_Project_01.png "langchain")

### Navigate to the Project Menu

![img](/assets/images/langchain/Smith_LangChain_03_Project_02.png "langchain")

### Review Project Execution Details

![img](/assets/images/langchain/Smith_LangChain_03_Project_03.png "langchain")