---
title: (Whisper) OpenAI Whisper & 파이썬으로 마이크 녹음 STT(음성 → 텍스트) 자동화 실습
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
description: 인공지능 - OpenAI Whisper & 파이썬으로 마이크 녹음 STT(음성 → 텍스트) 자동화 실습
article_tag1: AI
article_tag2: GPT
article_tag3: LLM
article_section: 
meta_keywords: AI, GPT, LLM, Multimodal, Whisper
last_modified_at: '2025-04-10 21:00:00 +0800'
---


# OpenAI Whisper & 파이썬으로 마이크 녹음 STT(음성 → 텍스트) 자동화 실습

## 1. 소개

이번 실습에서는

* **파이썬으로 마이크에서 바로 음성 녹음**하고
* **OpenAI Whisper API**로 **음성을 자동으로 텍스트(자막)로 변환**하는
  최소한의 코드 예제를 다룹니다.

회의록, 아이디어 기록, 음성 메모 등 실전 자동화에 즉시 활용 가능합니다!

---

## 2. 전체 코드 설명

### 2.1 환경 변수 및 OpenAI 클라이언트 설정

```python
import os
import requests
import warnings
from openai import OpenAI
import openai
from dotenv import load_dotenv
from playsound import playsound
import sounddevice as sd
from scipy.io.wavfile import write

warnings.filterwarnings("ignore", category=UserWarning)

load_dotenv(dotenv_path='openapi_key.env')
api_key = os.getenv("OPENAI_API_KEY")
openai.api_key = api_key

client = OpenAI()
```

* **dotenv**로 `.env`에서 OpenAI API 키를 안전하게 관리
* Whisper 등 최신 OpenAI API 사용 준비

---

### 2.2 마이크로 실시간 음성 녹음

```python
try: 
    fs = 16000  # 샘플레이트(Hz)
    duration = 5  # 녹음 시간(초)
    print('녹음시작')
    audio_data = sd.rec(int(duration * fs), samplerate=fs, channels=1)
    sd.wait()  # 녹음이 끝날 때까지 대기
    print('녹음종료')
    write('rec.wav', fs, audio_data)  # WAV 파일로 저장
except Exception as e:
    print(f"Error during recording: {e}")
```

* **sounddevice** 라이브러리로 **마이크에서 5초간 녹음**
* `rec.wav` 파일로 저장
* (녹음 시간, 파일명은 자유롭게 변경 가능)

---

### 2.3 Whisper로 음성 파일 STT(음성→텍스트) 변환

```python
fp = open('rec.wav', 'rb')
trascript = client.audio.transcriptions.create(file=fp, model='whisper-1')
print(trascript.text)
fp.close()
```

* 저장된 `rec.wav` 파일을 **Whisper API**에 전송
* Whisper가 자동으로 **음성을 텍스트(자막)로 변환**
* 변환된 텍스트를 콘솔에 출력

---

## 3. 실습 팁 & 활용 예시

* **녹음 시간, 파일명, 채널 수**는 자유롭게 커스터마이징 가능
* **아이디어 메모, 회의록, 실시간 자막** 등 다양한 활용 가능
* Whisper의 언어 감지 및 번역 기능을 응용해 **다국어 자막 자동화**도 가능

---

## 4. 마치며

* 파이썬과 OpenAI Whisper API를 결합하면
  **마이크 입력만으로도 음성→텍스트 변환**을 매우 간단하게 자동화할 수 있습니다.
* 노코드 녹음 앱, 실시간 인터뷰 기록, 유튜브 자동 자막 등 다양한 AI 음성 프로젝트에 적용해보세요!

---

### 참고

* [OpenAI Whisper 공식 문서](https://platform.openai.com/docs/guides/speech-to-text)
* [sounddevice 공식 문서](https://python-sounddevice.readthedocs.io/)

