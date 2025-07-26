---
title: (TTS) OpenAI로 음성 파일을 텍스트 요약 & TTS 음성 변환까지 자동화 (Python 실습)
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- Multimodal
- LLM
- ChatGPT
tags:
- AI
- Multimodal
- LLM
- ChatGPT
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - OpenAI로 음성 파일을 텍스트 요약 & TTS 음성 변환까지 자동화 (Python 실습)
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, Multimodal
last_modified_at: '2025-04-10 21:00:00 +0800'
---


# OpenAI로 음성 파일을 텍스트 요약 & TTS 음성 변환까지 자동화 (Python 실습)

## 1. 소개

이번 글에서는 OpenAI의 최신 API를 활용해

* **음성 파일(예: mp3)을 → 텍스트로 변환(STT, Whisper)**
* **변환된 텍스트를 ChatGPT로 요약**
* **요약 결과를 TTS(음성합성)로 다시 mp3로 변환**
* **최종적으로 음성 파일 자동 재생**

까지 전 과정을 파이썬 코드 한 번에 구현하는 예제를 공유합니다.

---

## 2. 전체 코드 구조

### 2.1 환경 변수 및 클라이언트 준비

```python
import os
from openai import OpenAI
import openai
from playsound import playsound
import warnings
from dotenv import load_dotenv
warnings.filterwarnings("ignore", category=UserWarning)

load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key
client = OpenAI()
```

* **dotenv**로 `.env`에서 OPENAI\_API\_KEY를 안전하게 관리
* OpenAI 클라이언트 생성 (최신 openai 패키지 기준)

---

### 2.2 주요 기능 함수

#### 1) **오디오 파일 → 텍스트 변환 (Whisper STT)**

```python
def transcribe_audio(file_path):
    """오디오 파일을 Whisper 모델로 텍스트로 변환"""
    with open(file_path, 'rb') as fp:
        transcription = client.audio.transcriptions.create(
            file=fp,
            model='whisper-1'
        )
    return transcription.text
```

#### 2) **텍스트 요약 (ChatGPT)**

```python
def transcribe_and_summarize(transcription_text):
    """변환된 텍스트를 요약"""
    response = client.chat.completions.create(
        model='gpt-3.5-turbo',
        messages=[
            {'role': 'system', 'content': 'You are a helpful assistant that summarizes text'},
            {'role': 'user', 'content': f'다음 내용을 간단히 요약해줘:\n{transcription_text}'}
        ]
    )
    return response.choices[0].message.content
```

#### 3) **요약 텍스트 → 음성 변환 (OpenAI TTS)**

```python
def text_to_speech(text, output_file='out.mp3'):
    """텍스트를 TTS 모델로 음성 파일 생성"""
    response = client.audio.speech.create(
        model='tts-1',
        input=text,
        voice='nova'
    )
    with open(output_file, 'wb') as fp:
        fp.write(response.content)
    return output_file
```

#### 4) **음성 파일 재생**

```python
def play_audio(file_path):
    """음성 파일 재생"""
    playsound(file_path)
```

---

### 2.3 메인 실행부

```python
if __name__ == "__main__":
    audio_file_path = 'audio/베트남여행.mp3'  # 변환할 오디오 파일 경로

    print("🎙️ 음성 → 텍스트 변환 중...")
    transcription_text = transcribe_audio(audio_file_path)
    print("📝 추출된 텍스트:\n", transcription_text)

    print("\n🧠 텍스트 요약 중...")
    summary = transcribe_and_summarize(transcription_text)
    print("📋 요약된 내용:\n", summary)

    print("\n🔊 요약 내용을 음성으로 변환 중...")
    output_mp3 = text_to_speech(summary)

    print("🎧 음성 재생 중...")
    play_audio(output_mp3)
```

* 오디오(mp3) 파일을 지정하면
  Whisper → ChatGPT 요약 → TTS → 자동재생까지 전과정 자동화!

---

## 3. 실습 팁 & 확장 아이디어

* **오디오 파일**만 바꾸면

  * 강의, 회의록, 여행 브이로그 등 다양한 음성 파일을 바로 요약해서
    \*"핵심만 음성으로 다시 듣기"\*에 활용할 수 있음
* **TTS 모델/목소리** 변경, 다국어 변환 등 다양한 옵션도 제공
* **실제 업무 활용**: 회의록 요약 음성, 강의 핵심 리뷰, 음성 뉴스레터 등

---

## 4. 마치며

이 코드는 단순한 오디오 → 텍스트를 넘어
**AI가 자동으로 “듣고, 요약하고, 말해주는” 자동화 파이프라인**을 제공합니다.

* 누구나 빠르게 “AI 비서” 경험을 할 수 있는 실전 예제!
* 추가 확장(번역, 내용 편집, 파일 저장 등)도 자유롭게 적용 가능

---

### 참고

* [OpenAI Whisper 문서](https://platform.openai.com/docs/guides/speech-to-text)
* [OpenAI TTS 문서](https://platform.openai.com/docs/guides/text-to-speech)
* [파이썬 playsound 문서](https://github.com/TaylorSMarks/playsound)

---
