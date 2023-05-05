---
title: Python - Flask로 간단한 API 만들기 2
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
toc: true
toc_sticky: true
toc_label: 목차
description: Python Flask로 간단한 API 만들기 2
article_tag1: python
article_tag2: Flask
article_tag3: API
article_section: API
meta_keywords: python, API, Flask
last_modified_at: '2023-04-24 21:00:00 +0800'
---
① ② *Python* 

## Flask API 간단한 예제 2

ubuntu 환경에서 shell script를 실행시키고 응답결과를 반환하는 예제

기능

1. Run shell script
2. Save log file(로그 저장)

### subprocess

### open


python flask api
```python
from flask import Flask, json, jsonify, request
import subprocess
import sys
import logging
from datetime import datetime

app = Flask(__name__)

# API 접근 라우팅 /runshellExam 
@app.route('/runshellExam', methods=['GET'])
def get_run():
    print('Run Api')
    # 시간 가져오기
    timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')    
    directory = "/usr/local/testShell"
    result = subprocess.run(["./run"], capture_output=True, cwd=directory)
    
    # 로그 이벤트의 출력 포맷을 설정
    logging.basicConfig(filename=f'api_{timestamp}.log', level=logging.DEBUG,
                        format='%(asctime)s %(levelname)s %(message)s')
    
    # 명령어 실행, 결과 가져오기    
    # subprocess.run : 현재 소스코드에서 다른 프로세스 실행, 입출력 제어
    # stdout, stderr 각각 표준 출력, 표준 에러의 리다이렉션을 지정
    # 파이프(pipe) : 데이터를 서브프로세스로 보낸 다음 서브프로세스의 결과
    # shell=True : 제공 명령어 사용
    cmd = 'ls -l'
    log_result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)    
    
    # 로그 정보
    logging.info('Starting program')
    logging.debug('This is a debug message')
    logging.warning('This is a warning message')
    logging.error('This is an error message')
    logging.critical('This is a critical message')

    # 기존 로그에 서버 응답결과를 추가 : open(파일 이름, 파일 열기 모드), a는 추가모드
    with open(f'api_{timestamp}.log', 'a') as f:
        f.write('===== [ Execution response result] =====\n')
        f.write(log_result.stdout.decode('utf-8')) 
        f.write('===== [ Client response result ] =====\n')
        f.write(result.stdout.decode('utf-8'))

    #결과 반환
    #shell script 응답결과 반환
    print('run response :: ', result.stdout)            
    return result.stdout

#서버 호스트, 포트 설정
if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5000', debug=True)
```