---
title: Ubuntu - Systemd 파일(ExecStart) & Bash Script 반환값 설정
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Ubuntu
tags:
- Ubuntu
- systemd
toc: true
toc_sticky: true
toc_label: 목차
description: Ubuntu - Systemd 파일(ExecStart) & Bash Script 반환값 설정
article_tag1: ubuntu
article_tag2: systemd
article_tag3: bash
article_section: ubuntu
meta_keywords: ubuntu, systemd, bash
last_modified_at: '2024-04-05 21:00:00 +0800'
---

## Systemd 파일(ExecStart) & Bash Script 반환값 설정

이 코드는 일반적으로 서비스의 실행에 실패했을 때, 해당 실패 상태를 로깅하고 추가적인 오류 처리를 할 수 있는 구조를 제공합니다.
시스템의 서비스 관리자인 systemd의 단위 파일(unit file) 내의 ExecStart 지시문에 사용될 수 있는 명령어입니다.

### 1. 서비스 코드 예제

```bash
ExecStart=/bin/bash -c '/home/../SomethingScript.sh -c --start || /tmp/exit_handler $?'
```

### 설명 

- /bin/bash -c

 : 새 bash 세션을 시작하고, -c 옵션 다음에 오는 명령어를 실행합니다.

- /home/../SomethingScript.sh --start

 : /home/../ 디렉토리에 위치한 SomethingScript.sh 스크립트를 -c와 --start 옵션과 함께 실행합니다. 이 스크립트는 아마도 특정 노드 애플리케이션을 시작하는 역할을 할 것입니다.

- ||

 : 이전 명령어가 실패했을 경우 (즉, 0이 아닌 종료 코드를 반환했을 경우) 뒤따르는 명령어를 실행합니다.

- /tmp/exit_handler $?

 : exit_handler 스크립트를 /tmp 디렉토리에서 실행합니다.
 $?는 바로 이전에 실행된 명령어의 종료 코드를 나타냅니다. 이 스크립트는 명령어 실행 실패 시 어떤 조치를 취할지 정의합니다.

## 2. bash 스크립트  예제

```bash
#!/bin/bash

CODE="${1:-N/A}"

echo CODE: $CODE
```

## bash 스크립트 설명

### (1) #!/bin/bash

 : 이 스크립트가 bash 쉘을 사용하여 실행될 것임을 정의합니다.

### (2) CODE="${1:-N/A}"

 : 스크립트에 전달된 첫 번째 인자를 CODE 변수에 할당합니다. 인자가 없을 경우 N/A (Not Available)로 기본값을 설정합니다.

- $ 기호

$ 기호는 변수의 값을 참조할 때 사용됩니다. 예를 들어, CODE라는 변수가 있고, 이 변수의 값을 출력하고 싶다면 $CODE라고 작성합니다. 또한, $1, $2 등은 스크립트로 전달된 인자들을 참조할 때 사용되는 위치 매개변수입니다. $1은 첫 번째 인자, $2는 두 번째 인자를 의미하며, 이런 식으로 계속됩니다.

- {} (중괄호)

{}는 매개변수 확장, 명령어 대체, 혹은 산술 연산을 위한 구문에 사용됩니다. 변수 이름을 중괄호로 감싸는 것은 그 변수를 명확히 정의하는 데 도움이 되며, 특히 변수 이름과 그 뒤에 오는 텍스트가 구분이 필요한 경우 유용합니다.

- "${1:-N/A}"

이 구문은 매개변수 확장의 한 예로, 첫 번째 인자 $1의 값을 사용하되, 만약 $1이 설정되지 않았거나 null일 경우 기본값 N/A로 대체한다는 의미입니다. 즉, 스크립트에 첫 번째 인자가 전달되지 않으면 CODE 변수에는 N/A가 할당됩니다.

**기본값 설정**, ${variable:-default} 형식은 variable이 설정되어 있고 비어있지 않으면 그 값을 사용하고, 그렇지 않을 경우 default 값을 사용하라는 의미입니다.

${1:-N/A} 구문의 의미는 "첫 번째 위치 매개변수($1)가 설정되어 있고 null이 아니면 그 값을 사용하고, 그렇지 않으면 'N/A'를 사용하라"는 것입니다. 

### (3) echo CODE: $CODE

 : 할당된 CODE 변수의 값을 CODE: 라는 텍스트와 함께 출력합니다. 이는 스크립트가 실행됐을 때 어떤 종료 코드가 반환되었는지 확인하는 데 도움이 됩니다.