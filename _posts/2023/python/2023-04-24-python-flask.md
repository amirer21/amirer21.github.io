---
title: Python - Flask로 간단한 API 만들기
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
description: Python Flask로 간단한 API 만들기
article_tag1: python
article_tag2: Flask
article_tag3: API
article_section: API
meta_keywords: python, API, Flask
last_modified_at: '2023-04-24 21:00:00 +0800'
---
① ② *Python* 

## Flask API 간단한 예제

### 소스코드

```python
from flask import Flask, jsonify, request

app = Flask(__name__)

# sample data
users = [
    {'id': 1, 'title': 'tile111', 'author': 'Hong'},
    {'id': 2, 'title': 'tile111222', 'author': 'Lee'},
    {'id': 3, 'title': 'tile111333', 'author': 'Kim'}
]

# GET all users
@app.route('/users', methods=['GET'])
def get_users():
    print('run shellSciprt!!!')
    return jsonify(users)

# GET a single user
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = [user for user in users if user['id'] == user_id]
    if len(user) == 0:
        abort(404)
    return jsonify(user[0])

# CREATE a new user
@app.route('/users', methods=['POST'])
def create_user():
    user = {
        'id': users[-1]['id'] + 1,
        'title': request.json['title'],
        'author': request.json['author']
    }
    users.append(user)
    return jsonify(user), 201

# UPDATE an existing user
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    user = [user for user in users if user['id'] == user_id]
    if len(user) == 0:
        abort(404)
    user[0]['title'] = request.json.get('title', user[0]['title'])
    user[0]['author'] = request.json.get('author', user[0]['author'])
    return jsonify(user[0])

# DELETE an existing user
@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = [user for user in users if user['id'] == user_id]
    if len(user) == 0:
        abort(404)
    users.remove(user[0])
    return jsonify({'result': True})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='5001', debug=True)
```


### 실행 에러 (Could not locate a Flask application)

```
Error: Could not locate a Flask application. Use the 'flask --app' option, 'FLASK_APP' environment variable, or a 'wsgi.py' or 'app.py' file in the current directory.
```

### 해결 

환경 변수에 flask app 지정

> set FLASK_APP=현재 실행하려는 파일


- 실행방법

    - 형식
    > flask --app .\실행하려는 파일.py run

    - 예시
    > flask --app .\testApi.py run

    - 다른 실행방법
    > python .\SimpleApi.py
