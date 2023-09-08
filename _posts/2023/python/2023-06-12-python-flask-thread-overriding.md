---
title: Python - Thread 오버라이딩
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
description: Thread 커스텀하게 만들기
article_tag1: python
article_tag2: flask
article_tag3: thread
article_section: thread
meta_keywords: python, flask, thread
last_modified_at: '2023-06-12 21:00:00 +0800'
---

## Thread 커스텀하게 만들기
> **프레임워크 및 구현 내용** : 파이썬 API Flask 프레임워크 적용
리눅스 서버에서 리눅스 명령어를 실행하는 기능을 수행하고 있다.
해당 프로그램은 쓰레드로 실행된다.

Python의 Thread클래스에는 내장 result속성이 없다.
따라서, 스레드 실행 결과를 저장하는 사용자 지정 하위 클래스를 정의하였다.
Thread 클래스에 있는 run 메서드를 오버라이딩(Overriding)

### 예제 코드
```py
class RunShellTestClass:
    def runShellCommand(self):
        os.chdir("/usr/local/test") 
        # 현재 작업 디렉토리를 변경하는 데 사용되는 Python 모듈 의 함수이다. 리눅스에서 pwd로 가져오는 현재 작업 디렉토리에 이런식으로 미리 경로를 설정할 수 있다.
        #os.getcwd() 업데이트된 작업 디렉토리를 확인하는 데 다시 사용된다.
		script_path = "/usr/local/test/tester.sh"    
        log_file = "/usr/local/test/tester_shell_log.txt"

        try:
            result = subprocess.run([script_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)            
            # Save the shell script execution log
            #w+ 옵션을 데이터를 파일에 write하는데 기존에 데이터가 있다면 새로 쓴다.
            with open(log_file, "w+") as file:
                timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                file.write(f"Timestamp: {timestamp}\n")
                file.write(f"Return Code: {result.returncode}\n")
                file.write(f"STDOUT:\n{result.stdout.strip()}\n")
                file.write(f"STDERR:\n{result.stderr.strip()}\n")
                file.write("-------------------------------------------------\n")                            
            
            if result.returncode == 0:                
                stdout = result.stdout.strip()               
                true"#특정 조건문에 따라 "success", "fail" 문자열 반환
                if #somthing == "something" is ture
                    return "success"
                else:
                    return "fail"                
            else:
                return result.stderr.strip()
        except Exception as e:
            print(f"Error: {e}")
		
#쓰레드 클래스를 재정의한다.			
class shellTestThread(threading.Thread):
    def __init__(self, target_obj):
        super().__init__()
        self.target_obj = target_obj
        self.result = None
	
	# 메서드 run()는 스레드 실행의 진입점이다. 스레드가 시작될 때 실행될 코드를 정의합니다. 메서드 내부에 run()스레드가 수행할 논리 또는 작업을 배치한다.
    def run(self):
        self.result = self.target_obj.runShellCommand() #위에 정의한 클래스의 메서드를 쓰레드 실행 타겟으로 한다. 
		

# 기존 shell script 파일을 백그라운드로 실행 -> /test &
@app.route('/Test', methods=['GET'])
def runTest():
    target_obj = RunShellTestClass()
    #thread = threading.Thread(target=target_obj.runShellCommand)
    #재정의한 쓰레드 객체에 실행 타켓 객체를 전달한다.
    thread = shellTestThread(target_obj) 
    thread.start() #쓰레드 실행   
    thread.join()  #스레드가 실행을 완료할 때까지 기다리는 개체 join()에서 호출됩
    result = thread.result # 쓰레드 실행 결과를 반환한다.
    return jsonify(message=result) #json 타입으로 반환
```


다음과 같이 Thread 모듈에 있는 내용을 살펴보자. 친절하게 주석으로 내용을 설명하고 있다.

```py
"""Thread module emulating a subset of Java's threading model."""
```
> "자바 스레딩 모델의 하위 집합을 에뮬레이트하는 스레드 모듈입니다."

## 2. Main class for threads

### 2.1 class Thread: 의 주석
```py
"""A class that represents a thread of control.

This class can be safely subclassed in a limited fashion. There are two ways
to specify the activity: by passing a callable object to the constructor, or
by overriding the run() method in a subclass.
"""
```

Thread 클래스를 살펴보면 이러한 설명이 있다.

쓰레드를 사용하려면, 
- (1) 호출 가능한 객체를 생성자에 전달하거나 
- (2) 하위 클래스에서 run() 메서드를 재정의하여 사용한다.

### 2.2 run 메서드

run 메서드를 살펴보자.

하위 클래스에서 이 메서드를 재정의할 수 있다

#### run 메서드의 주석 설명
```py
# def run(self): 의 주석
"""Method representing the thread's activity.

You may override this method in a subclass. The standard run() method
invokes the callable object passed to the object's constructor as the
target argument, if any, with sequential and keyword arguments taken
from the args and kwargs arguments, respectively.

"""
```