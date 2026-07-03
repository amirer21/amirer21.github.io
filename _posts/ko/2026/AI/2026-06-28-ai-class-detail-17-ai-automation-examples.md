---
title: "AI 세부 실습 17 - 유튜브, 이메일, OCR, 문서 요약 자동화"
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
- YouTube
- Email
- OCR
toc: true
toc_sticky: true
toc_label: 목차
description: "50번 실습 파일을 기준으로 유튜브 자막 요약, 이메일 발송, OCR, PDF/Excel 요약 자동화를 정리합니다."
article_tag1: AI
article_tag2: Automation
article_tag3: OCR
article_section: AI
meta_keywords: AI, 자동화, 유튜브 요약, 이메일, OCR, 문서 요약
last_modified_at: '2026-06-28 21:00:00 +0900'
---

# 유튜브, 이메일, OCR, 문서 요약 자동화

이 글은 다음 실습 주제를 기준으로 정리합니다.

- 유튜브 자막 추출과 요약
- 유튜브 음성 처리
- LangGraph 기반 자동화 워크플로
- 이메일 계정 연결과 기본 발송
- 텍스트 이메일 발송
- 첨부 파일 이메일 발송
- 마우스와 키보드 자동 조작
- MP3와 PPT 요약
- PDF와 Excel 문서 요약
- 이메일 자동화 확장
- OCR로 이미지 문자 추출
- 유튜브 요약 자동화 개선

50번 실습은 앞에서 배운 내용을 실제 업무 자동화로 연결합니다.

## 유튜브 요약

```text
유튜브 URL 입력
-> 영상 ID 추출
-> 자막 가져오기
-> 번역
-> 요약
-> 파일 저장
```

자막이 없는 영상은 처리할 수 없으므로 예외 처리가 필요합니다.

## LangGraph 자동화

LangGraph를 사용하면 각 단계를 노드로 나눌 수 있습니다.

```text
ExtractTranscript
-> TranslateText
-> SaveTranslationTxt
-> SummarizeText
-> SaveSummaryTxt
```

상태 객체에 자막, 번역문, 요약문, 저장 경로를 담아 단계별로 전달합니다.

## 이메일 전송

`smtplib`를 사용하면 요약 결과를 이메일로 보낼 수 있습니다.

중요한 점은 비밀번호를 코드에 직접 넣지 않는 것입니다.

```text
EMAIL_PASSWORD=앱_비밀번호
```

그리고 `.env` 파일에서 불러옵니다.

```python
load_dotenv("email.env")
email_password = os.getenv("EMAIL_PASSWORD")
```

## OCR 자동화

OCR은 이미지 속 글자를 추출합니다.

```text
이미지 입력
-> OCR
-> 텍스트 추출
-> AI 요약
-> 결과 저장
```

영수증, 스캔 문서, 강의 자료 사진 정리에 활용할 수 있습니다.

## PDF, Excel, PPT 요약

문서 요약 자동화는 다음 흐름입니다.

```text
파일 읽기
-> 텍스트 또는 표 추출
-> 긴 내용은 나누기
-> AI 요약
-> txt, docx 등으로 저장
```

Excel은 pandas로 읽고, PDF는 PyMuPDF나 문서 로더를 사용할 수 있습니다.

## 안전장치

자동화에서 다음 작업은 바로 실행하지 않는 것이 좋습니다.

- 이메일 발송
- 파일 삭제
- 개인정보 포함 문서 업로드
- 외부 서비스 전송
- 결제나 예약

가능하면 AI가 초안을 만들고 사람이 확인한 뒤 실행하도록 설계합니다.

## 정리

50번 실습은 AI를 실제 업무에 적용하는 종합 예제입니다.
유튜브, 이메일, OCR, 문서 요약을 연결하면 반복 업무를 크게 줄일 수 있지만, 전송과 삭제 같은 작업에는 반드시 확인 단계를 두는 것이 좋습니다.
