---
title: "Python 3.13 - 스레드(Threads)에서 달라진 점: Free-Threading(실험적) 정리"
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- Threading
toc: true
toc_sticky: true
toc_label: "목차"
description: "Python 3.13의 스레딩 변화 핵심: free-threaded 빌드, GIL 비활성화, 확인 방법, 제한 사항까지 요약"
article_tag1: Python
article_tag2: Threading
article_tag3: 
article_section: 
meta_keywords: "Python 3.13, threading, GIL, free-threaded"
last_modified_at: '2026-02-20 12:00:00 +0900'
---

# Python 3.13 - 스레드(Threads)에서 달라진 점: Free-Threading(실험적) 정리

Python 3.13(2024-10-07 릴리스)에서 스레딩과 관련해 **가장 큰 변화는 GIL을 끌 수 있는 free-threaded 빌드가 공식적으로 들어왔다는 점**입니다. 다만 **실험적(Experimental)** 기능이며, 기본 빌드에서는 여전히 GIL이 켜져 있습니다.

아래는 3.13 기준 핵심 변화와 실무 관점에서의 영향 요약입니다.

---

## 1. 핵심 요약

* **GIL 비활성화 빌드 제공**: 3.13부터 free-threaded 모드가 공식 지원(실험적)되었습니다.
* **별도 실행 파일**: free-threaded 빌드는 `t` 접미사로 구분됩니다(예: `python3.13t`).
* **공식 설치 지원**: Windows/macOS 설치 프로그램에서 free-threaded 빌드를 선택 설치할 수 있습니다.
* **실행 중 GIL 재활성화 가능**: `PYTHON_GIL` 또는 `-X gil` 옵션으로 런타임에 GIL을 켤 수 있습니다.

---

## 2. 왜 중요한가? (스레드 병렬성 관점)

GIL(Global Interpreter Lock)은 CPython에서 **동시에 한 스레드만 바이트코드를 실행하도록 제한**해 왔습니다. Python 3.13의 free-threaded 빌드는 **멀티코어에서 스레드 병렬 실행을 가능하게 하는 방향**으로 설계되었습니다. 이 변화는 **PEP 703**에서 정의되었습니다.

---

## 3. 실제로 어떻게 쓰나? (빌드/확인 방법)

### 3.1 free-threaded 빌드 설치/빌드

* **Windows/macOS**: 공식 인스톨러에서 free-threaded 빌드를 선택 설치 가능
* **소스 빌드**: `--disable-gil` 옵션으로 빌드
* **macOS 참고**: 설치 시 `python3.13t` 실행 파일이 함께 제공됩니다.

### 3.2 현재 인터프리터가 free-threaded 인지 확인

* `python -VV` 또는 `sys.version`에 "experimental free-threading build" 표시 여부 확인
* `sys._is_gil_enabled()`로 **현재 실행 중 GIL 활성 여부** 확인 가능
* `sysconfig.get_config_var(\"Py_GIL_DISABLED\")`로 **빌드 자체가 free-threaded인지** 판별 가능

---

## 4. 동작상의 변화 및 제한 사항

### 4.1 스레드 안전성

* `dict`, `list`, `set` 등 내장 타입은 **내부 락을 사용**해 기본 동작이 GIL 빌드와 유사하도록 설계됨
* 다만 이는 **구현 세부사항**이므로 동기화는 `threading.Lock` 등 **명시적 락을 권장**

### 4.2 알려진 제한 사항 (3.13)

* **Immortalization**: 특정 객체는 해제되지 않는 "immortal" 상태로 남아 **메모리 사용량 증가** 가능
* **Frame 객체**: 다른 스레드에서 `frame` 접근 시 **크래시 위험** → `sys._current_frames()`는 일반적으로 안전하지 않음
* **Iterator 공유**: 동일 iterator를 여러 스레드가 공유하면 **누락/중복/크래시** 가능
* **싱글 스레드 성능**: 3.13 기준 pyperformance에서 **약 40% 오버헤드**. 원인은 PEP 659 전문화 인터프리터 비활성화

---

## 5. C 확장 모듈과의 관계 (중요)

* C 확장 모듈은 **free-threaded 빌드용으로 별도 빌드**가 필요합니다.
* 확장이 free-threading을 명시적으로 지원하지 않으면, import 시 **GIL이 자동으로 켜질 수 있음**(경고 출력).
* 빌드/패키징에서는 `t` 접미사 ABI를 사용하므로 **별도 휠**이 필요합니다.

---

## 6. 예제: 3.13 이전(GIL) vs 3.13 free-threaded

아래 예제는 **동일 코드가 GIL 빌드에서는 병렬 CPU 실행이 제한되고**, free-threaded 빌드에서는 **코어 수만큼 병렬성이 기대될 수 있음**을 보여줍니다. (환경, 워크로드, OS, 확장 모듈에 따라 결과는 달라질 수 있습니다.)

### 6.1 CPU 바운드 (스레드 vs 프로세스)

```python
import os
import time
import threading
from multiprocessing import Process

def cpu_bound(n: int) -> int:
    s = 0
    for i in range(n):
        s += i * i
    return s

def run_threads(workers: int, n: int):
    ts = [threading.Thread(target=cpu_bound, args=(n,)) for _ in range(workers)]
    t0 = time.perf_counter()
    for t in ts: t.start()
    for t in ts: t.join()
    return time.perf_counter() - t0

def run_processes(workers: int, n: int):
    ps = [Process(target=cpu_bound, args=(n,)) for _ in range(workers)]
    t0 = time.perf_counter()
    for p in ps: p.start()
    for p in ps: p.join()
    return time.perf_counter() - t0

if __name__ == "__main__":
    workers = os.cpu_count() or 4
    n = 30_000_000
    print("threads:", run_threads(workers, n))
    print("procs  :", run_processes(workers, n))
```

해석 가이드:
* **3.12 이하 GIL 빌드**: `threads`가 CPU 병렬 이득이 제한됨. `procs`가 유리.
* **3.13 free-threaded**: `threads`도 **CPU 병렬성이 나타날 가능성**이 있음.

관련 근거:
* CPython은 기본적으로 GIL 때문에 **한 번에 하나의 스레드만 Python 바이트코드 실행**
* `multiprocessing`은 **프로세스 분리로 GIL을 우회**

### 6.2 I/O 바운드 (GIL 빌드에서도 스레드가 유리)

```python
import time
import threading

def io_bound():
    time.sleep(0.1)

def run_threads(workers: int):
    ts = [threading.Thread(target=io_bound) for _ in range(workers)]
    t0 = time.perf_counter()
    for t in ts: t.start()
    for t in ts: t.join()
    return time.perf_counter() - t0

print(run_threads(50))
```

I/O 바운드 작업에서는 **3.12 이하 GIL 빌드에서도 스레딩이 유효**합니다.

### 6.3 현재 인터프리터에서 GIL/Free-Threading 확인

```python
import sys
import sysconfig

print(sys.version)
print("GIL enabled?", sys._is_gil_enabled())
print("Free-threaded build?", bool(sysconfig.get_config_var(\"Py_GIL_DISABLED\")))
```

* `sys._is_gil_enabled()`는 **3.13 이상에서 런타임 GIL 여부 확인**
* `Py_GIL_DISABLED`는 **빌드 자체가 free-threaded인지 확인**

---

## 7. 프로세스/스레드 구조 비교 (개념)

아래는 GIL/Thread/Process의 구조적 차이를 간단히 정리한 비교입니다.

### 7.1 구조 비교 요약

**Threading (기본 GIL 빌드)**  
하나의 프로세스, 여러 스레드, **동일 메모리 공간 공유**.  
**GIL 때문에 CPU 바이트코드 병렬 실행 불가**.

**Threading (free-threaded 빌드)**  
하나의 프로세스, 여러 스레드, **동일 메모리 공간 공유**.  
**GIL 비활성화 가능** → CPU 병렬 실행 가능성.

**Multiprocessing**  
여러 프로세스, **각 프로세스는 독립된 메모리 공간**.  
**GIL을 우회**하며 멀티코어 활용 가능.

### 7.2 그림으로 보기

```
GIL 빌드 (Threading)
┌─────────────────────┐
│ Process             │
│  ├─ Thread A (GIL)   │
│  ├─ Thread B (wait)  │  -> 한 번에 하나만 Python 실행
│  └─ Thread C (wait)  │
└─────────────────────┘

Free-threaded 빌드
┌─────────────────────┐
│ Process             │
│  ├─ Thread A (run)   │
│  ├─ Thread B (run)   │  -> 여러 스레드 동시 실행 가능
│  └─ Thread C (run)   │
└─────────────────────┘

Multiprocessing
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Proc A   │  │ Proc B   │  │ Proc C   │  -> 각각 독립 메모리
└──────────┘  └──────────┘  └──────────┘
```

---

## 8. 실무 체크리스트

* **CPU 바운드 스레딩** 성능이 중요한 워크로드인가?
* **C 확장 모듈 의존성**이 많다면, free-threaded 대응 여부를 먼저 확인
* `sys._is_gil_enabled()` / `python -VV`로 **환경을 확실히 구분**
* 성능 저하(싱글 스레드)와 안정성(실험적)을 고려

---

## 9. 정리

Python 3.13의 free-threaded 빌드는 **스레드 병렬성의 큰 변곡점**입니다. 다만 아직 **실험적이며 성능/호환성 제약**이 있어, 현업에서는 **선별적 테스트 도입**이 안전합니다.

---

### 참고 링크

* What’s New In Python 3.13: https://docs.python.org/3.13/whatsnew/3.13.html
* Python experimental support for free threading (3.13): https://docs.python.org/3.13/howto/free-threading-python.html
* C API Extension Support for Free Threading (3.13): https://docs.python.org/3.13/howto/free-threading-extensions.html
* Python on macOS (3.13) - Installing Free-threaded Binaries: https://docs.python.org/3.13/using/mac.html
* PEP 703 – Making the GIL Optional: https://peps.python.org/pep-0703/
