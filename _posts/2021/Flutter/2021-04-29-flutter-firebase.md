---
title: 플러터 & 파이어베이스 구글로그인 연동하기
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Flutter
tags:
- Flutter
- Login
toc: true
toc_sticky: true
toc_label: 목차
description: 플러터 & 파이어베이스 구글로그인 연동하기
article_tag1: Flutter
article_tag2: firebase
article_tag3: android
article_section:  
meta_keywords: Flutter, firebase
last_modified_at: '2021-04-29 10:00:00 +0800'
---

# 플러터 & 파이어베이스 구글로그인 연동하기

- 참고 
https://fkkmemi.github.io/ff/ff-007/

- 파이어베이스
https://console.firebase.google.com/?hl=ko

- 구글 api
https://console.cloud.google.com/home/dashboard?folder=&organizationId=&project=newsky-a6582&supportedpurview=project

------------
## 1) 발생 에러

> [core/no-app] No Firebase App '[DEFAULT]' has been created - call Firebase.initializeApp()

```dart
void main() {
  runApp(MyApp());
}
```

를

```dart
void main() async{
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}
```
로 수정해준다.

설명 : 앱이 시작이 되기 전에 firebase에도 연결되게 해야한다.
initializeApp() 비동기로 실행한다.

------------

## 2) 발생 에러
- 에러 : Undefined name 'Firebase'
- 해결 : 아래 import 추가
```dart
import 'package:firebase_core/firebase_core.dart';
```

소스코드 전체
```dart
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:google_sign_in/google_sign_in.dart';

void main() async{
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        home: HomeWidget()
    );
  }
}

class AppState {
  bool loading;
  User user;
  AppState(this.loading, this.user);
}

class HomeWidget extends StatefulWidget {
  @override
  _HomeWidgetState createState() => _HomeWidgetState();
}

class _HomeWidgetState extends State<HomeWidget> {
  final app = AppState(false, null);
  @override
  Widget build(BuildContext context) {
    if (app.loading) return _loading();
    if (app.user == null) return _logIn();
    return _main();
  }
  Widget _loading () {
    return Scaffold(
        appBar: AppBar(title: Text('loading...')),
        body: Center(child: CircularProgressIndicator())
    );
  }
  Widget _logIn () {
    return Scaffold(
        appBar: AppBar(
            title: Text('login page')
        ),
        body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: <Widget>[
                RaisedButton(
                    child: Text('login'),
                    onPressed: () {
                      _signIn();
                    }
                )
              ],
            )
        )
    );
  }
  Widget _main () {
    return Scaffold(
        appBar: AppBar(
          title: Text('loginsss'),
          actions: <Widget>[
            IconButton(
              icon: Icon(Icons.account_circle),
              onPressed: () {
                _signOut();
              },
            )
          ],
        ),
        body: Center(child: Text('contents'))
    );
  }

  final GoogleSignIn googleSignIn = GoogleSignIn();
  final FirebaseAuth _auth = FirebaseAuth.instance;

  Future<String> _signIn() async {
    setState(() => app.loading = true);
    final GoogleSignInAccount googleSignInAccount = await googleSignIn.signIn();
    final GoogleSignInAuthentication googleSignInAuthentication =
    await googleSignInAccount.authentication;

    final AuthCredential credential = GoogleAuthProvider.credential(
      accessToken: googleSignInAuthentication.accessToken,
      idToken: googleSignInAuthentication.idToken,
    );

    final UserCredential authResult = await _auth.signInWithCredential(credential);
    final User user = authResult.user;
    print(user);

    setState(() {
      app.loading = false;
      app.user = user;
    });

    return 'success';
  }

  void _signOut() async{
    await googleSignIn.signOut();
    // await _auth.signOut();
    setState(() {
      app.user = null;
    });
  }
}
```