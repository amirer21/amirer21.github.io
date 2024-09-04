---
title: 인공지능 - Smith LangChain 연동 예제 코드
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
toc_label: 목차
description: 인공지능 - Smith LangChain 간단한 연동 예제 코드
article_tag1: AI
article_tag2: OpenAI
article_tag3: LangChain
article_section: 
meta_keywords: AI, OpenAI, LangChain
last_modified_at: '2024-08-30 21:00:00 +0800'
---

# smith.langchain.com 코드를 연동하고 살펴보자

### 준비물

- LangChain 계정
- LangChain API Key 생성
- OpenAI 계정
- OpenAI API Key 생성
- 파이썬 개발 환경
- 연동을 위한 예제 코드

## LangChain API Key 생성

### https://smith.langchain.com/ 페이지

페이지 왼쪽 하단 설정 톱니바퀴 클릭

![img](/assets/images/langchain/Smith_LangChain.png "langchain")

### API Key 생성

생성할 때 Key를 복사하여, 코드에서 불러올 수 있도록 가져옵니다.
웹에서 생성된 Key는 웹에서 다시 확인할 수 없으므로 생성할 때 잘 저장해둡니다.

![img](/assets/images/langchain/Smith_LangChain_02_key.png "langchain")


## 예제 코드

```py
from langchain_openai import ChatOpenAI
import os
import openai
from dotenv import load_dotenv  # .env 파일을 불러오는 패키지
# 환경 변수 로드
load_dotenv(dotenv_path='openapi_key.env')

# PENAI_API_KEY 로드
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    print("OpenAI API 키가 정상적으로 로드되었습니다.")
    openai.api_key = api_key
else:
    raise ValueError("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.")

os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_PROJECT"] = "MyTestProject03"

# 환경 변수가 제대로 설정되었는지 확인
print("LANGCHAIN_TRACING_V2:", os.getenv("LANGCHAIN_TRACING_V2"))
print("LANGCHAIN_ENDPOINT:", os.getenv("LANGCHAIN_ENDPOINT"))
print("LANGCHAIN_API_KEY:", os.getenv("LANGCHAIN_API_KEY"))
print("LANGCHAIN_PROJECT:", os.getenv("LANGCHAIN_PROJECT"))

# ChatOpenAI 객체 생성
llm = ChatOpenAI()
# ChatOpenAI 객체로 메시지 전송
answer = llm.invoke("Hello, world!")
print(answer)
```

### 코드 세부 설명

이 코드는 OpenAI와 LangChain API를 사용하여 환경 변수를 설정하고, LangChain의 `ChatOpenAI` 모델을 통해 간단한 텍스트 응답을 생성하는 예제입니다.
각 단계에서 수행하는 작업과 관련된 설명은 다음과 같습니다:

#### 1. 필요한 패키지 임포트
```python
from langchain_openai import ChatOpenAI
import os
import openai
from dotenv import load_dotenv
```
- **`ChatOpenAI`**: LangChain에서 OpenAI의 챗봇 모델을 사용하는 클래스를 가져옵니다.
- **`os`**: 운영 체제와 상호작용하고 환경 변수를 관리하기 위해 사용됩니다.
- **`openai`**: OpenAI API와 상호작용하는 데 필요한 패키지입니다.
- **`dotenv`**: `.env` 파일에서 환경 변수를 불러오기 위한 패키지입니다.

#### 2. 환경 변수 로드
```python
load_dotenv(dotenv_path='openapi_key.env')
```
- `.env` 파일(`openapi_key.env`)에서 환경 변수를 불러옵니다. 이 파일에는 API 키와 같은 중요한 정보가 저장되어 있어야 합니다.

#### 3. OpenAI API 키 로드 및 설정
```python
api_key = os.getenv("OPENAI_API_KEY")
if api_key:
    print("OpenAI API 키가 정상적으로 로드되었습니다.")
    openai.api_key = api_key
else:
    raise ValueError("OPENAI_API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인하세요.")
```
- **API 키 로드**: 환경 변수 `OPENAI_API_KEY`에서 OpenAI API 키를 가져옵니다.
- **키 확인 및 설정**: 키가 정상적으로 로드되었는지 확인하고, 로드되지 않았다면 오류 메시지를 출력합니다. 키가 로드되었다면 OpenAI 패키지의 API 키로 설정합니다.

#### 4. LangChain 환경 변수 설정
```python
os.environ["LANGCHAIN_TRACING_V2"] = "true"
os.environ["LANGCHAIN_ENDPOINT"] = "https://api.smith.langchain.com"
os.environ["LANGCHAIN_PROJECT"] = "MyTestProject03"
```
- LangChain에서 사용할 몇 가지 환경 변수를 설정합니다:
  - **`LANGCHAIN_TRACING_V2`**: 트레이싱 기능을 활성화합니다.
  - **`LANGCHAIN_ENDPOINT`**: LangChain API의 엔드포인트를 설정합니다.
  - **`LANGCHAIN_PROJECT`**: 프로젝트 이름을 설정하여 이 프로젝트에서 사용하는 LangChain 작업을 구분합니다.

#### 5. 설정된 환경 변수 출력
```python
print("LANGCHAIN_TRACING_V2:", os.getenv("LANGCHAIN_TRACING_V2"))
print("LANGCHAIN_ENDPOINT:", os.getenv("LANGCHAIN_ENDPOINT"))
print("LANGCHAIN_API_KEY:", os.getenv("LANGCHAIN_API_KEY"))
print("LANGCHAIN_PROJECT:", os.getenv("LANGCHAIN_PROJECT"))
```
- 환경 변수가 제대로 설정되었는지 콘솔에 출력하여 확인합니다. 

#### 6. ChatOpenAI 객체 생성 및 메시지 전송
```python
# ChatOpenAI 객체 생성
llm = ChatOpenAI()

# ChatOpenAI 객체로 메시지 전송
answer = llm.invoke("Hello, world!")
print(answer)
```
- **`ChatOpenAI` 객체 생성**: LangChain의 OpenAI 챗봇 모델을 초기화합니다.
- **메시지 전송 및 응답 출력**: `"Hello, world!"`라는 메시지를 모델에 보내고, 모델의 응답을 출력합니다.

이 코드를 통해 OpenAI와 LangChain API의 설정 및 간단한 메시지 처리를 실습할 수 있습니다.


## LangChain Project 대시보드

위의 코드를 실행하고 나면, LangChain에 Project가 올라오고, 실행 내용을 확인할 수 있습니다.
LangChain Project 대시보드에서 할 수 있는 주요 기능과 사용 가능한 도구는 다음과 같습니다

1. **Runs Monitoring**:
   - **실행 관리**: 프로젝트에서 실행된 모든 작업(예: 모델 호출, 쿼리 등)을 모니터링하고 관리할 수 있습니다.
   - **입력과 출력 확인**: 각 실행의 입력 및 출력 내용을 확인하여 모델의 동작을 검토할 수 있습니다.
   - **성능 지표**: 실행 시간, 레이턴시, 토큰 사용량, 오류율 등의 성능 지표를 확인할 수 있습니다.

2. **Filtering and Searching**:
   - **필터 사용**: 실행 기록을 특정 조건(예: 시간 범위, 메시지 유형 등)으로 필터링하여 필요한 데이터를 쉽게 찾을 수 있습니다.
   - **세부 검색**: 실행된 작업에 대한 상세한 조건 검색을 통해 특정 데이터를 찾고 분석할 수 있습니다.

3. **Project Settings and Setup**:
   - **프로젝트 설정**: 프로젝트의 환경 설정, 트레이싱, 엔드포인트 등을 설정할 수 있습니다.
   - **모델 및 API 구성**: LangChain과 연결된 모델의 구성 및 API 키 설정을 관리할 수 있습니다.

4. **Resource Management**:
   - **리소스 관리**: 프로젝트에서 사용하는 리소스(모델, API 호출 등)의 사용량을 관리하고 모니터링할 수 있습니다.
   - **비용 모니터링**: 토큰 사용량과 이에 따른 비용을 모니터링하여 예산 관리가 가능합니다.

5. **Debugging and Analysis**:
   - **디버깅 도구**: 실행된 작업의 로그와 성능 데이터를 분석하여 모델이나 워크플로우의 문제를 해결할 수 있습니다.
   - **실행 세부사항 분석**: 각 실행의 자세한 로그를 확인하여 모델의 응답과 성능을 세밀하게 분석할 수 있습니다.

이 대시보드는 주로 LangChain 프로젝트의 실행 내역과 성능을 모니터링하고, 이를 통해 프로젝트를 최적화하거나 문제를 해결하는 데 유용한 기능들을 제공합니다.

### https://smith.langchain.com/ 페이지

![img](/assets/images/langchain/Smith_LangChain_03_Project_01.png "langchain")

### Proejct 메뉴로 이동

![img](/assets/images/langchain/Smith_LangChain_03_Project_02.png "langchain")

### Proejct 실행내용 세부 확인

![img](/assets/images/langchain/Smith_LangChain_03_Project_03.png "langchain")