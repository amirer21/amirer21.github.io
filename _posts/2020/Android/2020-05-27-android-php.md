---
title: 안드로이드 PHP 연동하여 Json 가져오기
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Android
toc: true
toc_sticky: true
toc_label: 목차
description: 안드로이드 PHP 연동하여 Json 가져오기
article_tag1: Android
article_tag2: error
article_tag3: 

article_section:  
meta_keywords: Android, error
last_modified_at: '2020-04-27 10:00:00 +0800'
---

## 안드로이드 & PHP - JSON 데이터 가져오기
 
### DB : mysql

> Database name : SampleDB

> table name : 

> table user_table

- 유저 정보가 담긴 테이블

```mysql
CREATE TABLE `user_table` (
`userID` VARCHAR(50) NOT NULL,
`userPassword` VARCHAR(50) NOT NULL,
`userName` VARCHAR(50) NOT NULL,
`userAge` VARCHAR(50) NOT NULL,
PRIMARY KEY (`userID`)
)
COMMENT='test용'
COLLATE='utf8_general_ci'
ENGINE=InnoDB
;
```

### 안드로이드 main 클래스

MainActivity.java

```java
package com.example.jsonparsing;

import androidx.appcompat.app.AppCompatActivity;

import android.os.AsyncTask;
import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

public class MainActivity extends AppCompatActivity {

    ListView listView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        listView = (ListView) findViewById(R.id.listView);
        getJSON("http://15.164.94.221/api2.php");
    }

    private void getJSON(final String urlWebService) {

        class GetJSON extends AsyncTask<Void, Void, String> {

            @Override
            protected void onPreExecute() {
                super.onPreExecute();
            }


            @Override
            protected void onPostExecute(String s) {
                super.onPostExecute(s);
                if (s != null) {
                    Toast.makeText(getApplicationContext(), s, Toast.LENGTH_SHORT).show();
                    try {
                        loadIntoListView(s);
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
            }

            @Override
            protected String doInBackground(Void... voids) {
                try {
                    URL url = new URL(urlWebService);
                    HttpURLConnection con = (HttpURLConnection) url.openConnection();
                    StringBuilder sb = new StringBuilder();
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(con.getInputStream()));
                    String json;
                    while ((json = bufferedReader.readLine()) != null) {
                        sb.append(json + "\n");
                    }
                    return sb.toString().trim();
                } catch (Exception e) {
                    return null;
                }
            }
        }
        GetJSON getJSON = new GetJSON();
        getJSON.execute();
    }

    private void loadIntoListView(String json) throws JSONException {
        JSONArray jsonArray = new JSONArray(json);
        String[] array_data = new String[jsonArray.length()];
        for (int i = 0; i < jsonArray.length(); i++) {
            JSONObject obj = jsonArray.getJSONObject(i);
            array_data[i] = obj.getString("userID");
        }
        ArrayAdapter<String> arrayAdapter = new ArrayAdapter<String>(this, android.R.layout.simple_list_item_1, array_data);
        listView.setAdapter(arrayAdapter);
    }
}
```


### android manifest 설정

AndroidManifest.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.jsonparsing">

    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity android:name=".MainActivity">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
```

### activity 설정

activity_main.xml

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <ListView
        android:id="@+id/listView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_alignParentLeft="true"
        android:layout_alignParentStart="true"
        android:layout_alignParentTop="true" />

</RelativeLayout>
```
### API 서버

DB와 연결하여 간단하게 값을 가져오는 API가 2개가 있다.
(아래 2개는 서로 동일하므로 둘 중 하나만 사용해도됨)

### Apache DB 접속 서버(PHP) (1)

api.php

```php
<?php	
	$con = mysqli_connect("localhost", "root", "password1234", "SampleDB");
	
	//$userID = $_POST["userID"];
	//$userPassword = $_POST["userPassword"];
	
	//데이터를 담을 array 배열 생성
	$array_data = array();
	
	$statement = mysqli_prepare($con, "SELECT userID, userName, userAge FROM user_table;");
	//mysqli_stmt_bind_param($statement, "ss", $userID, $userPassword);
	mysqli_stmt_execute($statement);
	
	mysqli_stmt_store_result($statement);
	mysqli_stmt_bind_result($statement, $userID, $userName, $userAge);
	
	$response = array();
	$response["success"] = false;
	
	while(mysqli_stmt_fetch($statement)){
		//담아온 데이터를 담을 그릇
		$temp = [
		'userID'=>$userID,
		'userName'=>$userName,
		'userAge'=>$userAge
		];		
		//data 전달할 배열에 담는다
		array_push($array_data, $temp);
	}
	
	echo json_encode($array_data);
?>
```
### Apache DB 접속 서버(PHP) (2)

api2.php

```php
<?php
$servername = "localhost";
$username = "root";
$password = "password1234";
$database = "SampleDB";
 
//MySQLi mysql 연결 객체 생성
$conn = new mysqli($servername, $username, $password, $database);
 
//DB 연결 실패시 출력되는 에러
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
 
//데이터를 저장할 배열 선언
$array_data = array(); 
 
//쿼리문
$sql = "SELECT userID, userName, userAge FROM user_table;";
 
//쿼리 statment 생성
$stmt = $conn->prepare($sql);
 
//쿼리 statment 실행
$stmt->execute();
 
//결과 binding
$stmt->bind_result($userID, $userName, $userAge);
 
//반복하여 데이터 저장
while($stmt->fetch()){
 
 //배열 데이터를 담을 그릇
 $temp = [
 'userID'=>$userID,
 'userName'=>$userName,
 'userAge'=>$userAge
 ];
 
 //배열에 데이터 추가
 array_push($array_data, $temp);
}
 
//json 형식으로 데이터를 꾸며준다.
echo json_encode($array_data);

?>
```

###	결과 (1)
http://1xx.1xx.1x.1xx/api.php
[{"userID":"test01","userName":"test","userAge":"22"},{"userID":"test02","userName":"test2","userAge":"23"}]
 
###	결과 (1)
http://1xx.1xx.1x.1xx/api2.php
[{"userID":"test01","userName":"test","userAge":"22"},{"userID":"test02","userName":"test2","userAge":"23"}]
 
