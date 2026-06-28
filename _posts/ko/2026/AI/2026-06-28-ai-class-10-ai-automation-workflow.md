---
title: "AI 강의 정리 10 - AI 업무 자동화: 유튜브 요약, 이메일, OCR, 문서 처리"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- Automation
tags:
- AI
- Automation
- LangGraph
- OCR
- Email
toc: true
toc_sticky: true
toc_label: 목차
description: "LangGraph와 OpenAI를 이용한 유튜브 자막 요약, 이메일 발송, OCR, 문서 요약 자동화 흐름을 정리합니다."
article_tag1: AI
article_tag2: Automation
article_tag3: LangGraph
article_section: AI
meta_keywords: AI, 업무자동화, LangGraph, 유튜브 요약, 이메일 자동화, OCR
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# AI 자동화란?

AI 자동화는 반복적인 업무 흐름에 AI 모델을 연결하는 작업입니다.

단순히 "질문하면 답하는 챗봇"에서 멈추지 않고, 다음과 같은 실제 작업을 자동으로 처리하게 만드는 것입니다.

- 유튜브 자막 추출
- 자막 번역
- 내용 요약
- 결과 파일 저장
- 이메일 발송
- OCR로 이미지 속 글자 추출
- PDF와 Excel 요약
- 마우스와 키보드 자동 조작

강의 폴더에서는 다음 파일들이 이 주제에 해당합니다.

```text
50_automation_20250520_01_youtube.py
50_automation_20250520_01_youtube_voice.py
50_automation_20250520_02_LangGraph.py
50_automation_20250520_03_email_01.py
50_automation_20250520_03_email_02_sendtext.py
50_automation_20250520_03_email_03_sendfile.py
50_automation_20250520_04_pyautoui_01.py
50_automation_20250520_04_pyautoui_02.py
50_automation_20250520_05_summary_01_mp3_ppt.py
50_automation_20250520_05_summary_02_pdf_excel_01.py
50_automation_20250520_05_summary_02_pdf_excel_02.py
50_automation_20250521_01_email.py
50_automation_20250521_02_ocr.py
50_automation_20250907_01_youtube.py
```

## 자동화의 기본 구조

AI 자동화는 보통 다음 형태입니다.

```text
입력 수집
-> AI 처리
-> 결과 저장
-> 알림 또는 전송
```

예를 들어 유튜브 요약 자동화는 다음과 같습니다.

```text
유튜브 URL 입력
-> 영상 ID 추출
-> 자막 가져오기
-> 한국어 번역
-> 한국어 요약
-> txt 파일 저장
-> 이메일 발송
```

## 유튜브 자막 추출

유튜브 자막은 `youtube_transcript_api`로 가져올 수 있습니다.

```python
from youtube_transcript_api import YouTubeTranscriptApi

transcript_data = YouTubeTranscriptApi.get_transcript(
    video_id,
    languages=["ko", "en"],
)

text = " ".join(item["text"] for item in transcript_data)
```

자막이 없는 영상은 실패할 수 있습니다.
그래서 예외 처리를 반드시 넣어야 합니다.

```python
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)
```

자동화에서 중요한 것은 "성공 흐름"보다 "실패했을 때 어떻게 처리할지"입니다.

## LangGraph로 자동화 흐름 만들기

강의 코드에서는 LangGraph로 다음 노드들을 연결했습니다.

```text
ExtractTranscript
-> TranslateText
-> SaveTranslationTxt
-> SummarizeText
-> SaveSummaryTxt
-> SendEmail
-> END
```

상태는 다음처럼 정의합니다.

```python
from typing import TypedDict

class PipelineState(TypedDict):
    video_id: str
    transcript: str
    translated: str
    summary: str
    translation_txt: str
    summary_txt: str
```

각 함수는 상태를 받아 필요한 값을 추가합니다.

```python
def summarize_text(state: PipelineState) -> PipelineState:
    if not state["transcript"]:
        return state

    prompt = f"다음 유튜브 자막을 한국어로 요약해줘:\n\n{state['transcript']}"
    summary = chat.invoke(prompt).content

    return {**state, "summary": summary}
```

이렇게 만들면 어느 단계에서 어떤 데이터가 생기는지 추적하기 쉽습니다.

## 결과 파일 저장

AI가 만든 번역문과 요약문은 텍스트 파일로 저장합니다.

```python
from datetime import datetime

def save_summary_txt(state: PipelineState) -> PipelineState:
    if not state["summary"]:
        return state

    cur = datetime.now().strftime("%Y-%m-%d_%H_%M_%S")
    path = f"summary_{cur}.txt"

    with open(path, "w", encoding="utf-8") as f:
        f.write("유튜브 자막 요약\n\n")
        f.write(state["summary"])

    return {**state, "summary_txt": path}
```

파일 이름에 시간을 넣는 이유는 이전 결과를 덮어쓰지 않기 위해서입니다.

## 이메일 발송

강의 코드에서는 `smtplib`를 사용해 Gmail SMTP로 이메일을 보냅니다.

```python
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email_summary(state: PipelineState) -> PipelineState:
    sender = "example@gmail.com"
    receiver = "example@gmail.com"

    msg = MIMEMultipart()
    msg["Subject"] = "유튜브 자막 요약 결과"
    msg["From"] = sender
    msg["To"] = receiver
    msg.attach(MIMEText(state["summary"], "plain"))

    with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
        server.login(sender, email_password)
        server.sendmail(sender, receiver, msg.as_string())

    return state
```

실제 사용 시에는 이메일 비밀번호를 코드에 직접 넣지 않아야 합니다.

```text
EMAIL_PASSWORD=앱_비밀번호
```

그리고 Python에서 환경 변수로 불러옵니다.

```python
from dotenv import load_dotenv
import os

load_dotenv("email.env")
email_password = os.getenv("EMAIL_PASSWORD")
```

Gmail은 일반 계정 비밀번호가 아니라 앱 비밀번호 또는 OAuth 방식을 요구할 수 있습니다.

## OCR 자동화

OCR은 이미지 안의 글자를 텍스트로 바꾸는 기술입니다.

자동화 흐름은 다음과 같습니다.

```text
이미지 또는 PDF 입력
-> OCR로 텍스트 추출
-> AI로 요약 또는 정리
-> 결과 저장
```

활용 예시는 많습니다.

- 영수증 정리
- 스캔 문서 텍스트화
- 강의 자료 사진 정리
- 계약서 이미지에서 주요 조항 추출

OCR 결과는 완벽하지 않을 수 있으므로, 중요한 문서는 사람이 확인하는 단계가 필요합니다.

## PDF와 Excel 요약

강의 코드에는 PDF와 Excel을 요약하는 자동화 예제도 있습니다.

문서 처리 자동화는 보통 다음 흐름입니다.

```text
파일 읽기
-> 텍스트 또는 표 데이터 추출
-> 긴 내용은 청크로 분할
-> AI 요약
-> 결과 파일 저장
```

Excel 파일은 pandas로 읽을 수 있습니다.

```python
import pandas as pd

df = pd.read_excel("financial_summary.xlsx")
```

PDF는 PyMuPDF나 LangChain의 PDF loader를 사용할 수 있습니다.

```python
import fitz

with fitz.open("sample.pdf") as doc:
    text = ""
    for page in doc:
        text += page.get_text()
```

긴 문서는 한 번에 모델에 넣지 말고 나누어 처리해야 합니다.

## PyAutoGUI 자동화

`50_automation_20250520_04_pyautoui_01.py`, `50_automation_20250520_04_pyautoui_02.py`는 마우스와 키보드 자동화와 관련됩니다.

PyAutoGUI는 사람이 직접 클릭하고 입력하는 작업을 코드로 대신할 수 있습니다.

예를 들어 다음 작업에 사용할 수 있습니다.

- 정해진 위치 클릭
- 텍스트 입력
- 스크린샷 찍기
- 반복적인 UI 작업 수행

다만 PyAutoGUI는 화면 좌표에 의존하기 때문에 해상도나 창 위치가 바뀌면 실패할 수 있습니다.
가능하면 API나 파일 처리 방식으로 자동화하고, 마지막 수단으로 UI 자동화를 쓰는 것이 좋습니다.

## 자동화에서 조심해야 할 것

AI 자동화는 편리하지만 실수의 영향도 커집니다.

특히 다음 작업은 바로 실행하지 말고 확인 단계를 두는 것이 좋습니다.

- 이메일 발송
- 파일 삭제 또는 이동
- 결제
- 외부 서비스에 데이터 업로드
- 개인정보가 포함된 문서 처리

권장 흐름은 다음과 같습니다.

```text
AI가 초안 생성
-> 사람이 확인
-> 승인 후 전송 또는 저장
```

완전 자동화가 항상 좋은 것은 아닙니다.
업무 성격에 따라 사람이 확인해야 하는 지점을 남겨야 합니다.

## 정리

AI 자동화는 여러 작은 기능을 연결해 실제 업무 흐름을 만드는 작업입니다.

- 유튜브 자막을 가져와 번역하고 요약할 수 있습니다.
- LangGraph를 사용하면 단계별 상태를 관리하기 쉽습니다.
- 결과를 txt 파일로 저장하거나 이메일로 보낼 수 있습니다.
- OCR, PDF, Excel 처리와 결합하면 문서 업무 자동화가 가능합니다.
- 이메일 발송, 파일 조작, 개인정보 처리는 반드시 안전장치를 둬야 합니다.

이 시리즈의 전체 흐름은 Python 기초에서 시작해 멀티모달, Streamlit, RAG, LangChain, LangGraph, Agent, Hugging Face, 자동화까지 이어집니다.
각 글의 코드를 하나씩 실행해 보면 AI 기능이 실제 애플리케이션으로 확장되는 흐름을 자연스럽게 이해할 수 있습니다.
