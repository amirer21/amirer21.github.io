---
title: 인공지능 - LangGraph로 구현하는 유튜브 자막 자동 처리 파이프라인
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
- LangGraph
tags:
- AI
- OpenAI
- LLM
- Automation
- LangGraph
toc: true
toc_sticky: true
toc_label: 목차
description: 인공지능 - LangGraph로 구현하는 유튜브 자막 자동 처리 파이프라인
article_tag1: AI
article_tag2: Automation
article_tag3: LLM
article_section: 
meta_keywords: AI, Automation, LLM, OpenAI, LangGraph
last_modified_at: '2025-05-20 21:00:00 +0800'
---


## LangGraph로 구현하는 유튜브 자막 자동 처리 파이프라인

이번 실습에서는 **유튜브 영상의 자막을 자동으로 추출하고, 번역 및 요약한 뒤 텍스트 파일로 저장하는 전체 파이프라인**을 구현합니다.
핵심은 **LangGraph**라는 새로운 워크플로우 프레임워크를 활용해, 각 단계를 구조화된 상태 머신으로 연결하는 것입니다.

---

## 1. 실습 목적

이 실습은 다음과 같은 기능을 자동화하기 위한 것입니다:

* 유튜브 영상에서 자막(한글/영문) 추출
* 자막 내용을 한국어로 번역 (GPT-3.5-turbo 사용)
* 자막 내용을 요약
* 번역 및 요약 결과를 각각 `.txt` 파일로 저장
* 전체 흐름을 LangGraph로 구성해 **선언적 파이프라인 실행** 경험

---

## 2. 사용 기술

| 기술/라이브러리                     | 용도                     |
| ---------------------------- | ---------------------- |
| `YouTubeTranscriptApi`       | 유튜브 영상에서 자막 추출         |
| `LangChain`, `LangGraph`     | GPT 모델과 상태 기반 파이프라인 구성 |
| `ChatOpenAI (gpt-3.5-turbo)` | 자막 번역 및 요약             |
| `.env` 파일                    | OpenAI API 키 보안 관리     |
| `datetime`, `os`             | 파일 저장 이름 및 시스템 설정      |

---

## 3. 이 실습으로 알 수 있는 것

* LangGraph로 복잡한 비동기 흐름을 구조화하는 방법
* GPT 모델을 활용한 자막 요약 및 번역 자동화
* 유튜브 자막 추출 및 예외 처리 구현
* 텍스트 파일 저장 및 자동화 워크플로우 설계

---

## 4. 실습 환경 준비 (LangGraph 기준)

### 패키지 설치

LangGraph에서 다음 명령어로 필수 패키지를 설치합니다:

```python
!pip install openai langchain youtube-transcript-api python-dotenv langgraph
```

### .env 파일 업로드

OpenAI API 키를 보안상 안전하게 관리하기 위해 `.env` 파일을 사용합니다.

```python
from google.LangGraph import files
files.upload()  # openapi_key.env
```

`.env` 파일 예시:

```
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

업로드 후 다음 코드로 키를 불러옵니다:

```python
from dotenv import load_dotenv
load_dotenv("openapi_key.env")
```

---

## 5. 주요 코드 구조 설명

### (1) 상태 구조 정의 (PipelineState)

LangGraph는 각 상태를 **딕셔너리 구조로 정의**합니다. 여기서는 자막, 번역 결과, 요약 결과 등 6개의 필드를 관리합니다.

```python
class PipelineState(TypedDict):
    video_id: str
    transcript: str
    translated: str
    summary: str
    translation_txt: str
    summary_txt: str
```

---

### (2) 단계별 기능 함수

각 단계는 함수로 분리되어 있으며, 모두 동일한 `PipelineState`를 입력/출력합니다.

* `extract_transcript`: 자막 추출
* `translate_text`: 자막 번역
* `summarize_text`: 자막 요약
* `save_translation_txt`: 번역 결과 저장
* `save_summary_txt`: 요약 결과 저장

LangChain의 `ChatOpenAI`로 GPT를 호출하며, `openai_api_key`는 명시적으로 전달합니다.

---

### (3) LangGraph로 워크플로우 구성

`StateGraph`를 사용하여 각 노드를 연결하고 흐름을 설정합니다.

```python
graph = StateGraph(PipelineState)
graph.add_node("ExtractTranscript", extract_transcript)
...
graph.add_edge("ExtractTranscript", "TranslateText")
...
graph.set_entry_point("ExtractTranscript")
graph.add_edge("SaveSummaryTxt", END)
```

최종적으로 `graph.compile()`을 통해 실행 가능한 파이프라인으로 변환합니다.

---

### (4) 실행 흐름

사용자로부터 유튜브 URL을 입력받고, 전체 파이프라인을 실행합니다:

```python
if __name__ == "__main__":
    url = input("유튜브 링크 입력: ")
    ...
    final_state = app.invoke({...})
```

결과 파일 경로를 출력하고, 번역/요약 실패 여부를 안내합니다.

---

## 6. 실행 예시

```
🎥 유튜브 링크 입력 (예: https://www.youtube.com/watch?v=xxxxxx):
🔍 자막 추출 → 번역 → 요약 시작...

✅ 번역 저장 완료: translated_2024-05-20_14_32_12.txt
✅ 요약 저장 완료: summary_2024-05-20_14_32_13.txt
```

---

## 7. 확장 아이디어

* 영어 자막이 없을 경우 자동 번역 API 연동
* 결과 요약을 PDF로 저장
* LangGraph의 분기 조건을 사용한 요약 제외/선택 실행

---

## 8. 참고 링크

* [LangGraph 공식 문서](https://docs.langchain.com/langgraph/)
* [YouTube Transcript API](https://github.com/jdepoix/youtube-transcript-api)
* [OpenAI GPT-3.5 API 문서](https://platform.openai.com/docs)
