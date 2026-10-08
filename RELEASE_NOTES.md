# Giblog Jekyll Project Release Notes

## 2026-10-08 — MessageFlow Lab 기술 블로그 시리즈

### 추가 내용

- MessageFlow Lab 프로젝트 문서와 실제 코드를 바탕으로 한국어 기술 글 14편(00–13)을 추가했습니다.
- 소개, Docker 환경 구축, Pika·수동 ACK, 재전달, Exchange 라우팅, Confirm·Return·영속성, Retry·TTL·DLQ, SQLite 멱등 처리, Worker·Prefetch, Kombu, Celery 기본·운영, Pyro5 RPC 비교, Transactional Outbox 순서로 구성했습니다.
- 각 글에 코드 해설, 실험 절차와 예상 관찰, 결과 해석, 학습 질문, 프로젝트·공식 문서 링크를 포함했습니다.
- 공통 Liquid include로 전체 시리즈 목차와 이전·다음 글 링크를 추가했습니다.
- 글마다 한국어 메타데이터, 목차, 시리즈 순서와 고정 permalink를 설정했습니다.

### 내용 기준과 검증 범위

- 2026-10-08 로컬 소스를 확인했습니다. Phase 0–6 코드가 있으며, Phase 6은 SQLite 구현입니다.
- Phase 1–5의 실제 실험 결과는 프로젝트의 기존 `docs/verification.md` 기록을 인용했습니다. 이번 블로그 작업에서 RabbitMQ 실험을 새로 실행하지 않았습니다.
- Phase 6의 Commit 이후 장애 시나리오는 NACK 재큐잉 모의 실험으로 명시했습니다. 실제 프로세스 강제 종료와 동시 Worker 검증 결과로 표현하지 않았습니다.
- Phase 7–12는 미구현 후속 설계·학습 예시로 구분했습니다. Phase 4 Broker 재시작·실제 네트워크 장애도 검증 완료로 표현하지 않았습니다.
- 게시글 14개의 필수 메타데이터, 00–13 순서, permalink 중복, 코드 블록 닫힘과 공통 include 참조를 정적으로 확인했습니다.
- 프로젝트 참조 링크 31개를 로컬 원본 파일과 대조해 누락이 없음을 확인했습니다.
- Jekyll 빌드는 Ruby/Bundler 실행 파일이 없는 환경 때문에 수행하지 못했습니다. HTML 렌더링·화면 확인은 후속 빌드 환경에서 필요합니다.

## Version 1.0.1

Release Date: [2024-08-28]

### Major Changes

- **Added Multilingual Support**: Implemented page separation for Korean and English using the jekyll-polyglot gem.
  - Users can now view content optimized for their language preference.
  - Supported languages: Korean, English

### Technical Details

- **Gem Used**: jekyll-polyglot
- **Gem Version**: 

### Installation and Upgrade Instructions

1. Add the following line to your Gemfile:
   ```ruby
   gem 'jekyll-polyglot'
   ```
2. Run the following command in your terminal:
   ```
   bundle install
   ```
3. Update your `_config.yml` file to include jekyll-polyglot settings.

--------------------------------------------------------------