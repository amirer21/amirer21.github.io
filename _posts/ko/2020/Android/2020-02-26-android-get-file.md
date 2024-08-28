---
title: Android InternalStorage 장치내부 파일 생성 / 읽기 예제
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Android
tags:
- Android
toc: true
toc_sticky: true
toc_label: 목차
description: Android InternalStorage 장치내부 파일 생성 / 읽기 예제
article_tag1: Android
article_tag2: InernalStorage
article_tag3: File

article_section:  
meta_keywords: Android, InernalStorage, File
last_modified_at: '2020-02-26 10:00:00 +0800'
---

## 안드로이드 파일 생성 및 읽기 예제

저장된 파일은 안드로이드 스튜디오에서 확인할 수 있다.

> 메뉴 위치 : View -> Tool Windows -> Device File Explorer (우측하단에 메뉴가 생김)

> 저장 경로 : /data/user/0/com.file_project.exam01/files
 
 openFileOutput(), openFileInput()을 사용하여 안드로이드 내부저장장치에 파일을 생성, 쓰기, 읽기를 한다.
 Internal Storage은 External Storage 와는 다르게 별도의 Permission 추가 없이 사용할 수 있는 저장장치이다.


```java
package com.file_project.exam01;


import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        final EditText et = (EditText) findViewById(R.id.editText1);  //입력창
        Button bSave = (Button) findViewById(R.id.button1); //추가저장 버튼
        Button bLoad = (Button) findViewById(R.id.button2); //읽어오기 버튼
        final TextView tv = (TextView) findViewById(R.id.textView1); //출력창

        bSave.setOnClickListener(new View.OnClickListener() {
            // Button의 setOnClickListener() 객체를 사용하여 이벤트 리스너를 지정
            // 익명class는 선언과 생성이 동시에 된다. 하나의 객체에 대해서 1회 사용하려 할때 사용한다
            // 여기서는 View.OnClickListener()가 익명class이다.
            // OnClickListner에 객체를 넣는 방법이 2가지 있는데 여기에는 new생성자를 사용한다.
            @Override    // 입력한 데이터를 파일에 추가로 저장하기
            public void onClick(View v) {
                String data = et.getText().toString(); //getText() textView에 있는 text내용 가져오기

                try {
                    FileOutputStream fos = openFileOutput
                            ("myfile.txt", // 파일명 지정
                                    Context.MODE_APPEND);// 저장모드
                    // openFileOutput() 하위 디렉토리 /files에 있는 응용프로그램 파일을 쓰기모드로 열거나 생성한다.
                    // 생성경로 : /data/user/0/응용프로그램 패키지이름/files/파일명

          long now = System.currentTimeMillis(); // 현재시간 받아오기

          Date date = new Date(now); // Date 객체 생성
          SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss", Locale.KOREA);
          String nowTime = sdf.format(date);

                    PrintWriter out = new PrintWriter(fos);
                    //PrintWriter 클래스 : PrintStream의 Print메서드를 모두 구현하여, Char단위 출력메서드 print를 사용할 수 있도록 구현된 클래스
          out.println(nowTime + data);
                    out.close();

                    /*
                    long now = System.currentTimeMillis(); // 현재시간 받아오기
                    Date date = new Date(now); // Date 객체 생성
                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
                    String nowTime = sdf.format(date);

        BufferedWriter buf = new BufferedWriter(new FileWriter(getFilesDir()+"myfile.txt", true));
                    buf.append(nowTime + " "); // 날짜 쓰기
                    buf.append(data); // 파일 쓰기
                    buf.newLine(); // 개행
                    buf.close();
                    */

                    tv.setText("파일 저장 완료");
                    Log.i("mylog", "cur dir : "+getFilesDir().toString());

                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });

        bLoad.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // 파일의 내용을 읽어서 TextView 에 보여주기
                try {
                    // 파일에서 읽은 데이터를 저장하기 위해서 만든 변수
                    StringBuffer data = new StringBuffer();
                    FileInputStream fis = openFileInput("myfile.txt");//파일명
                    BufferedReader buffer = new BufferedReader
                            (new InputStreamReader(fis));
                    String str = buffer.readLine(); // 파일에서 한줄을 읽어옴
                    while (str != null) {
                        data.append(str + "\n");
                        str = buffer.readLine();
                    }
                    tv.setText(data);
                    buffer.close();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
}
```