---
title: (Automation) - 유튜브 영상 자막을 요약해 텍스트 파일로 저장하는 자동화 실습
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- OpenAI
- LLM
- Automation
- Colab
tags:
- AI
- OpenAI
- LLM
- Automation
- Colab
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - 유튜브 영상 자막을 요약해 텍스트 파일로 저장하는 자동화 실습
article_tag1: AI
article_tag2: Automation
article_tag3: LLM
article_section: 
meta_keywords: AI, Automation, LLM, OpenAI, Colab
last_modified_at: '2025-05-20 21:00:00 +0800'
---


## 유튜브 영상 자막을 요약해 텍스트 파일로 저장하는 자동화 실습

이 글에서는 Python과 OpenAI, LangChain, YouTube Transcript API를 활용하여 **유튜브 영상의 자막을 자동으로 추출하고 요약하는 파이프라인**을 구현해봅니다.
GPT-3.5-turbo 모델을 기반으로 자막을 간결하게 요약하며, 결과는 `.txt` 파일로 저장됩니다.

실습은 로컬 Python 환경 또는 Google Colab에서 모두 가능하며, 특히 Colab에서 손쉽게 API 키를 관리하고 실습할 수 있도록 `.env` 파일 활용법도 함께 다룹니다.

---

## 1. 실습 목표

* 유튜브 영상의 자막을 자동으로 추출하기
* LangChain과 OpenAI GPT를 이용해 자막 요약 생성
* 결과를 텍스트 파일로 저장하는 전체 파이프라인 구성
* 예외 처리 및 파일 저장 기능 구현 경험

---

## 2. Colab 실습 시작하기

### Colab에서 실행 시 사전 설정

1. 런타임 유형을 "Python3 + CPU" 또는 "GPU"로 설정 (필수는 아님)
2. 다음 패키지를 설치:

```python
pip install openai langchain youtube-transcript-api python-dotenv
```

3. `.env` 파일 업로드:

```python
from google.colab import files
uploaded = files.upload()  # openapi_key.env 파일 업로드
```

4. `openapi_key.env` 파일 구조 예시:

```
OPENAI_API_KEY=sk-xxxxxx
```

---

## 3. 전체 코드 구성 및 설명

### (1) 환경 설정

OpenAI API 키와 Hugging Face 키(향후 확장을 위한 옵션)를 `.env` 파일에서 안전하게 불러옵니다.

```python
from dotenv import load_dotenv
load_dotenv("openapi_key.env")
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)
```

---

### (2) 유튜브 자막 추출 함수

유튜브 영상의 자막을 가져옵니다. 한국어(`ko`) 또는 영어(`en`) 자막이 있는 경우 자동으로 처리합니다.

```python
from youtube_transcript_api import YouTubeTranscriptApi

def extract_transcript_from_youtube(video_id: str) -> str:
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=["ko", "en"])
        return " ".join([item["text"] for item in transcript])
    except Exception as e:
        print(f"[에러] 자막을 가져올 수 없습니다: {str(e)}")
        return ""
```

---

### (3) 텍스트 요약 함수

LangChain을 통해 GPT 모델에게 자막 내용을 요약하도록 지시합니다.

```python
from langchain.chat_models import ChatOpenAI

def summarize_text(text: str) -> str:
    chat = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0)
    prompt = f"다음 유튜브 자막을 한국어로 요약해줘:\n\n{text}"
    return chat.invoke(prompt).content
```

---

### (4) 요약된 내용을 `.txt` 파일로 저장

생성된 요약 결과를 타임스탬프 기반 파일명으로 저장합니다.

```python
from datetime import datetime

def save_summary_to_txt(summary: str) -> str:
    filename = f"summary_{datetime.now().strftime('%Y-%m-%d_%H_%M_%S')}.txt"
    with open(filename, "w", encoding="utf-8") as f:
        f.write("유튜브 요약\n\n")
        f.write(summary)
    return filename
```

---

### (5) 전체 실행 흐름

입력받은 유튜브 링크로부터 video ID를 추출하고, 요약 및 저장을 순차적으로 실행합니다.

```python
if __name__ == "__main__":
    url = input("YouTube 링크를 입력하세요: ").strip()
    video_id = url.split("v=")[-1] if "v=" in url else url.split("/")[-1]

    transcript = extract_transcript_from_youtube(video_id)
    if not transcript:
        print("자막이 없어 요약을 진행할 수 없습니다.")
        exit(1)

    summary = summarize_text(transcript)
    file_path = save_summary_to_txt(summary)

    print(f"요약 저장 완료: {file_path}")
```

---

## 4. 이 실습으로 배울 수 있는 것

* YouTube Transcript API 사용법과 예외 처리 방식
* LangChain과 OpenAI GPT 모델을 활용한 텍스트 요약
* 사용자 입력 → 자동 추출 → 요약 → 저장까지의 전체 파이프라인 설계 경험
* `.env`를 통한 안전한 API 키 관리

---

## 5. 확장 아이디어

* 영어 자막만 있는 영상 자동 감지 및 번역 추가
* 요약 결과를 이메일로 전송하는 기능 추가
* 자막에서 키워드를 추출하거나 목차 자동 생성 기능 구현

---

## 6. 참고자료

* [YouTube Transcript API GitHub](https://github.com/jdepoix/youtube-transcript-api)
* [LangChain 문서](https://docs.langchain.com/)
* [OpenAI GPT-3.5 API 문서](https://platform.openai.com/docs)
