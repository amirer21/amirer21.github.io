---
title: Python - flask Framework(API) & python으로 Linux Command(Shell Script) 실행하기
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Python
tags:
- Python
- Flask
- API
toc: true
toc_sticky: true
toc_label: 목차
description: 파이썬 flask API로 Linux Command 실행
article_tag1: python
article_tag2: flask
article_tag3: linux
article_section: python flask
meta_keywords: python, flask, linux
last_modified_at: '2023-06-09 21:00:00 +0800'
---

## 파이썬 flask API 기반의 Linux Command 실행하기
리눅스 서버에서 실행되는 shell script 기반의 프로젝트가 있었는데 shell script 파일 중 일부분은 외부에서 실행시키도록 변경하게 되었다.

따라서 일부 파일을 실행시키는 인터페이스가 필요했다.

파이썬 기반의 API 프레임워크 중에서 Flask라는 프레임워크가 현재 프로젝트에 적합하여 이를 사용하기로 결정하였다.

간단하게 전체 구조를 설명하자면
외부에서 각각의 API 를 호출하면 API 서버는 요청에 따라 해당되는 Shell script 파일을 실행하거나 리눅스 명령어(파일 생성, 삭제, 쓰기, 권한 변경 둥)를 수행하게 된다.

이 내용에는 다음 기능들이 포함되어있다. 


> 1. 리눅스 명령어 실행 (권한부여, 파일 읽고 쓰기)
> 2. 리눅스 서버 안에 있는 파일 실행
> 3. 결과 로그 파일 저장
> 4. 쓰레드
> 5. json 파일 불러와서 text 파일에 업로드(수정)

(이 예제는 ubuntu 18.04에 기본으로 설치된 파이썬 3.6 버전을 그대로 유지하여 구현하였다. 3.10 버전으로 한다면 하단에 기재한 내용과 같이 수정하면된다.)

## 1. 명령어 실행

### 1.1 권한 부여

Error: [Errno 8] Exec format error: '/usr/local/test/test.sh' 에러가 발생하여 다음과 같이 해결하였다.
이 오류는 일반적으로 시스템 아키텍처와 호환되지 않거나 필요한 권한이 없는 스크립트 또는 바이너리 파일을 실행하려고 할 때 발생한다.
따라서 파일 생성 시 해당 파일에 실행하는 소유자에게 권한을 부여하도록 하였다.

### 클라이언트 코드
```py
run_script_path = f"{username}/test/test.sh"
try:                    
	#os.chmod(f"{username}/test/test.sh", permissions)	
	os.chmod(run_script_path, 0o755) # 0o755 값은 소유자에 대한 읽기, 쓰기 및 실행 권한 / 그룹 및 기타 사용자에 읽기, 실행 권한을 설정
	print("File permissions changed successfully")
except Exception as e:
	return f"Error: {e}"                                
```

### 1.2 파일 읽고 쓰기

예제가 수행하는 내용 간단 설명 : shell script 파일을 열고 상단에 # Bash shell 기본형식으로 맞춰준다.

(에러 발생) : OSError: [Errno 8] Exec format error 

"#!/bin/bash" 은 hashbang이라고 한다.
Unix 계열의 운영체제에서 스크립트 파일의 시작 부분에 있는 해쉬뱅( #!)은 스크립트를 실행시 사용하게되는 인터프리터의 경로를 나타낸다. 
여기서는 /bin/bash에 있는 Bash 셸 인터프리터를 나타낸다 /bin.
스크립트를 실행하면 #!/bin/bashBash 셸을 사용하여 실행하도록 시스템에 지시하게 된다.
형식에 맞게 수정하여 에러를 해결한다.

```py
# 클라이언트 코드
run_script_path = f"{username}/test/test.sh"     
try:                                  
	with open(run_script_path, "r") as file:
		lines = file.readlines()                
	lines.insert(0, "#!/bin/bash\n")
	
	with open(run_script_path, "w") as file:
		file.writelines(lines)                    
except Exception as e:
	print(f"Error: {e}")    
```

### 1.3 

shell script code
```shell
#!/bin/bash

home=`pwd`
testPath=$home/test
```
위와 같이 코드가 된 shell script가 있는데 다음과 같이 에러를 해결하였다.

```py
os.chdir("/usr/local/test") # Set the working directory
```

작업 디렉터리를 명시적으로 설정한다.
스크립트가 특정 작업 디렉터리 또는 상대 경로에 의존하는 경우 API 에서 해당 작업 디렉터리를 명시적으로 설정할 수 있도록 하였다.

이렇게 하면 스크립트를 실행하기 전에 작업 디렉터리를 지정된 경로로 변경하여 스크립트 내에서 사용된 상대 경로가 올바르게 확인되도록 한다.

----------------------

## 2. 파일 실행
파일 실행 기본 샘플
```py
# API 코드
@app.route('/test', methods=['GET'])
def runTest():
    script_path = "/usr/local/test/test1.sh"
    try:        
        result = subprocess.run([script_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        if result.returncode == 0:
            return result.stdout.strip()
        else:
            return result.stderr.strip()
    except Exception as e:
        return f"Error: {e}"
```

----------------------

## 3. 응답결과 로그 저장

```py
# 클라이언트 코드
project_path = os.getcwd()
#project_path = "C:/Users/user/workspace/testProject"
project_path = project_path.replace("\\", "/") #윈도우에서의 경로 기호를 \(백슬래시)로 표시하므로 리눅스의 /로 변경

# save log file
with open(project_path + '/log' + f'/{file_name}', 'w') as f:
	f.write(response_text)
```

----------------------

## 4. 쓰레드 실행 

shell script 파일을 백그라운드로 실행하는 코드가 있는데
파이썬으로 변경하였다.


### 4.1 쓰레드 호출
```py
# 클라이언트 코드
def runThreadCustom(self):        
	print('[mtester method] -- start')        
	mtester = ThreadCustomClass()
	thread1 = threading.Thread(target=mtester.runThreadCustom())
	thread1.start()
	thread1.join()
	print('------------------------------------------------------------')
```
	
### 4.2 쓰레드 호출되는 기능 메서드

```py
# 클라이언트 코드
class ThreadCustomClass:
    def __init__(self):  
        self.num = 0
        self.connectTest = 0       
        
    def runThreadCustom(self):
        print('[runTreadCustom method] -- start] tester :: ', self.tester)
		#호출시 실행할 기능...

```

----------------------

## 5. json 파일 불러와서 text 파일에 업로드(수정)

### 5.1 api 서버 소스코드
```py
'''
API : /config
기능 : config 업로드
설명 : config.json 파일의 데이터가 넘어오면 -> config.txt 파일에 업로드
'''
# API 코드
@app.route('/config', methods=['POST'])
def updateConifg(): 
    print('[API - 0] run updateConifg()')   
    config_path = "/usr/local/test/config"    
    getConfigData = request.get_json()        
    configObj = json.loads(getConfigData)#json 형태의 문자열을 파이썬 객체로 변환
    
    # 리눅스의 config text 파일 읽어오기
    with open(config_path, 'r') as text_file:
        configTextLines = text_file.readlines()        
        response_data = {'message': 'Read config file successfully'}
        
    for key, value in configObj.items(): #키-값 쌍을 반복하는 루프
        found = False #일치하는 키가 있는지 확인하기 위해 bool 변수 초기화
		#enumerate()에서 인덱스와 해당 값을 포함하는 튜플을 생성하는 반복 가능한 객체를 반환
        for i, line in enumerate(configTextLines): 
            if line.startswith('export ' + key + '='): #문자열 'export '로 시작하는지 확인
                configTextLines[i] = 'export ' + key + '=' + str(value) + '\n' #일치하는 줄이 발견되면 업데이트
                found = True # True 일치 항목이 발견
                break            
        if not found: #목록에서 일치하는 줄이 없으면 새로 생성
            configTextLines.append('export ' + key + '=' + str(value) + '\n')                                    
    
    with open(config_path, 'w') as text_file:
        text_file.writelines(configTextLines)
        response_data = {'message': 'Overwrite config file successfully'}
    
    return jsonify(response_data), 200
# -------------------------------------------------------------------------------
```

### 5.2 클라이언트 소스코드
```py
# 클라이언트 코드
def runConfig(self):        
	print('[config method] -- start')
	url_path_config = "http://아이피 주소:포트 번호/config"
	project_path = os.getcwd()
	print('project_path config :: ', project_path)	
	
	with open(project_path+"/config.json", "r", encoding="utf-8") as json_file:
		config_data = json.load(json_file)            
		json_config_data = json.dumps(config_data)            

	response = requests.post(url_path_config, json=json_config_data)

	#응답 코드
	status_code = response.status_code
	print(f"Response Status Code: {status_code}")

	#응답 결과 텍스트 출력
	response_text = response.text
	print(f"Response Body: {response_text}")  
	
	timestamp = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')        
	file_name = f'config_output-{timestamp}.txt'

	# 결과 로그 파일 저장        	
	with open(project_path + '/log' + f'/{file_name}', 'w') as f:	
		f.write(response_text)
	print('------------------------------------------------------------')
       
```

### 5.3 config.json 
```json
{    
    "NUMBER": 5,
    "NAME": "TestName", 
    "TEST_NUMBER": 2,
    "TEST_CODE": "test1",
}
```

### 5.4 config.txt
```text
#!/bin/bash

export NUMBER=5
export NAME=TestName
export TEST_NUMBER=2
export TEST_CODE=test1
```

json 파일의 key,value 한쌍을 그대로 txt 파일에 업데이트하는 내용이다.

5.3의 config.json 파일을 읽어서 json 객체로 API서버에 전달하면
API 서버는 config.txt 파일에서 해당되는 키에 맞는 값으로 수정해준다.

---------------------- 

## python 버전에 따른 subprocess.run 옵션 차이

파이썬 버전에 따라서 subprocess.run 속성에서 capture_output=True, text=True 등 차이가 있다. 

### python version 3.7 이상

```py
#/test
@app.route('/test', methods=['GET'])
def runTest():
    script_path = "/usr/local/test/test.sh"
    try:
        result = subprocess.run([script_path], capture_output=True, text=True)        
        if result.returncode == 0:
            return result.stdout.strip()
        else:
            return result.stderr.strip()
    except FileNotFoundError:
        return f"Script not found: {script_path}"
```

### python version 3.6 미만

```py
#/test
@app.route('/test', methods=['GET'])
def runTest():
    script_path = "/usr/local/test/test1.sh"
    try:        
        result = subprocess.run([script_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
        if result.returncode == 0:
            return result.stdout.strip()
        else:
            return result.stderr.strip()
    except Exception as e:
        return f"Error: {e}"
```