---
title: "AI 강의 정리 07 - LangGraph로 상태 기반 AI 워크플로 만들기"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- AI
- LangGraph
tags:
- AI
- LangGraph
- LangChain
- Workflow
toc: true
toc_sticky: true
toc_label: 목차
description: "LangGraph의 StateGraph, 노드, 엣지, 상태 객체를 유튜브 자막 번역과 요약 예제로 설명합니다."
article_tag1: AI
article_tag2: LangGraph
article_tag3: Workflow
article_section: AI
meta_keywords: AI, LangGraph, StateGraph, LangChain, 워크플로
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# LangGraph란?

LangGraph는 AI 작업을 그래프 구조로 연결하는 라이브러리입니다.

LangChain의 Chain이 보통 일직선 흐름에 가깝다면, LangGraph는 여러 단계의 상태를 가지고 분기, 반복, 병렬 처리에 가까운 구조를 만들 수 있습니다.

강의 폴더에서는 다음 실습들이 이 주제에 해당합니다.

- 딕셔너리로 상태를 전달하는 기본 그래프
- LangGraph 노드와 엣지 구성
- StateGraph 상태 관리
- 조건 분기와 단계별 실행
- 그래프 실행 결과 확인
- 유튜브 자막 번역과 요약 자동화

## 그래프 구조란?

그래프는 노드와 엣지로 구성됩니다.

| 용어 | 의미 |
| --- | --- |
| 노드 | 실제 작업을 수행하는 함수 |
| 엣지 | 다음에 실행할 노드로 이어지는 연결 |
| 상태 | 노드들이 공유하는 데이터 |

예를 들어 유튜브 자막을 처리하는 흐름은 다음과 같습니다.

```text
자막 추출
-> 번역
-> 번역 파일 저장
-> 요약
-> 요약 파일 저장
-> 종료
```

각 단계가 노드입니다.
화살표가 엣지입니다.
자막, 번역 결과, 요약 결과가 상태입니다.

## 상태 정의하기

LangGraph에서는 상태 구조를 먼저 정의합니다.

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

이 코드는 "이 워크플로 안에서 어떤 데이터를 들고 다닐지"를 정합니다.

비전공자 관점에서는 작업용 서류 봉투라고 생각하면 됩니다.
각 단계는 같은 봉투를 받아서 필요한 내용을 추가한 뒤 다음 단계로 넘깁니다.

## 노드 함수 만들기

노드는 상태를 입력받고, 수정된 상태를 반환하는 함수입니다.

```python
def extract_transcript(state: PipelineState) -> PipelineState:
    text = "유튜브 자막 내용"
    return {**state, "transcript": text}
```

`{**state, "transcript": text}`는 기존 상태를 유지하면서 `transcript` 값만 새로 넣는 방식입니다.

번역 노드는 다음처럼 만들 수 있습니다.

```python
from langchain_openai import ChatOpenAI

def translate_text(state: PipelineState) -> PipelineState:
    if not state["transcript"]:
        return state

    chat = ChatOpenAI(model="gpt-3.5-turbo", temperature=0)
    prompt = f"다음 유튜브 자막을 한국어로 번역해줘:\n\n{state['transcript']}"
    translated = chat.invoke(prompt).content

    return {**state, "translated": translated}
```

입력 자막이 없으면 아무 작업도 하지 않고 상태를 그대로 반환합니다.
이런 방어 코드가 있어야 중간 단계가 실패해도 전체 프로그램이 갑자기 무너지지 않습니다.

## 그래프 구성하기

노드 함수를 만들었으면 그래프에 등록합니다.

```python
from langgraph.graph import StateGraph, END

graph = StateGraph(PipelineState)

graph.add_node("ExtractTranscript", extract_transcript)
graph.add_node("TranslateText", translate_text)
graph.add_node("SummarizeText", summarize_text)
graph.add_node("SaveTranslationTxt", save_translation_txt)
graph.add_node("SaveSummaryTxt", save_summary_txt)
```

그 다음 시작점과 연결 순서를 정합니다.

```python
graph.set_entry_point("ExtractTranscript")
graph.add_edge("ExtractTranscript", "TranslateText")
graph.add_edge("TranslateText", "SaveTranslationTxt")
graph.add_edge("SaveTranslationTxt", "SummarizeText")
graph.add_edge("SummarizeText", "SaveSummaryTxt")
graph.add_edge("SaveSummaryTxt", END)
```

마지막으로 컴파일합니다.

```python
app = graph.compile()
```

## 실행하기

초기 상태를 넣어 실행합니다.

```python
final_state = app.invoke({
    "video_id": "유튜브_video_id",
    "transcript": "",
    "translated": "",
    "summary": "",
    "translation_txt": "",
    "summary_txt": "",
})
```

실행이 끝나면 `final_state`에는 모든 단계의 결과가 들어 있습니다.

```text
video_id: 입력한 영상 ID
transcript: 추출된 자막
translated: 번역 결과
summary: 요약 결과
translation_txt: 저장된 번역 파일 경로
summary_txt: 저장된 요약 파일 경로
```

## LangGraph가 유용한 이유

단순한 작업은 함수 몇 개를 순서대로 호출해도 됩니다.

```python
transcript = extract()
translated = translate(transcript)
summary = summarize(translated)
```

하지만 실제 AI 자동화는 더 복잡합니다.

- 자막이 없으면 종료
- 번역은 성공했지만 요약은 실패할 수 있음
- 결과를 파일로도 저장하고 이메일로도 보낼 수 있음
- 사용자 검토 후 다음 단계로 넘어가야 할 수 있음
- Agent가 도구를 선택하며 반복 실행할 수 있음

이런 경우 상태와 흐름을 명확히 관리하는 LangGraph가 도움이 됩니다.

## 유튜브 자막 처리 예제

강의 코드의 핵심 흐름은 다음과 같습니다.

```text
유튜브 URL 입력
-> video_id 추출
-> 자막 가져오기
-> 한국어 번역
-> 텍스트 파일 저장
-> 한국어 요약
-> 텍스트 파일 저장
```

자막 추출에는 `youtube_transcript_api`가 사용됩니다.

```python
from youtube_transcript_api import YouTubeTranscriptApi

transcript_data = YouTubeTranscriptApi.get_transcript(
    video_id,
    languages=["ko", "en"],
)

text = " ".join(item["text"] for item in transcript_data)
```

자막이 비활성화된 영상, 삭제된 영상, 지원하지 않는 언어의 영상은 실패할 수 있습니다.
그래서 예외 처리가 필요합니다.

```python
from youtube_transcript_api._errors import (
    TranscriptsDisabled,
    NoTranscriptFound,
    VideoUnavailable,
)
```

## 정리

LangGraph는 AI 작업을 단계별 워크플로로 관리할 때 유용합니다.

- State는 작업 중 공유되는 데이터입니다.
- Node는 상태를 받아 처리하는 함수입니다.
- Edge는 다음 실행 단계입니다.
- Graph는 전체 작업 흐름입니다.

다음 글에서는 Agent를 사용해 AI가 도구를 선택하고 데이터프레임이나 문서를 분석하는 방법을 정리합니다.
