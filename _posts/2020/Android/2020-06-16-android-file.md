---
title: 안드로이드 file 권한 체크, 부여 및 내부 파일 정보 가져오기
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
description: 안드로이드 file 권한 부여, 파일 정보 가져오기
article_tag1: Android
article_tag2: file
article_tag3: 

article_section:  
meta_keywords: Android, file
last_modified_at: '2020-06-16 10:00:00 +0800'
---

## 안드로이드 권한 체크 & 파일 정보 가져오기

파일 관련 접근 시 권한 문제가 발생할 수 있다.
이 경우 권한부여 여부확인를 확인하는 기능을 추가한다.

1. checkPermission() 메서드에서 권한이 부여된 목록을 확인하고, 파일 접근 권한을 부여하도록 한다.

2. 디바이스에 내장된 파일 경로를 찾고, 해당 경로에 있는 파일명, 파일 정보 등 목록으로 가져온다.

- 전체 소스 코드

```java
package com.example.fileex01;

import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import android.Manifest;
import android.app.DownloadManager;
import android.content.Context;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.util.Log;
import android.view.View;
import android.webkit.MimeTypeMap;
import android.webkit.URLUtil;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.ListView;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class MainActivity extends AppCompatActivity {
    private TextView textView;
    private ListView listView;
    private ArrayAdapter<String> listAdapter;
    private ArrayList<String> items;
    private String rootPath = "";
    private String nextPath = "";
    private String prevPath = "";
    private String currentPath = "";
    private TextView messageView;

    @SuppressWarnings("deprecation")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        textView = (TextView)findViewById(R.id.textView);
        listView = (ListView)findViewById(R.id.listView);

        items = new ArrayList<>();
        listAdapter = new ArrayAdapter<String>(MainActivity.this,
                android.R.layout.simple_list_item_1, items);

        // 루트 경로 가져오기
        //rootPath = Environment.getExternalStorageDirectory().getAbsolutePath(); ///mnt/sdcard/0
        //Download 폴더 경로 가져오기
        //Environment.DIRECTORY_DOWNLOADS
        //Environment.getExternalStoragePublicDirectory(DIRECTORY_DOWNLOADS) -> /mnt/sdcard/Download
        
        //파일목록 가져오기 1
        rootPath = Environment.getExternalStorageDirectory().getAbsolutePath() + "/" + "Download"; ///mnt/sdcard/0
        boolean result = Init(rootPath);
        
        //파일목록 가져오기 3
        File downloadDir = new File(Environment.getExternalStoragePublicDirectory(
                Environment.DIRECTORY_DOWNLOADS).getAbsolutePath());


        //권한부여 여부 확인
        checkPermission(Manifest.permission.READ_EXTERNAL_STORAGE,100);

        Log.d("File getExternalStorageDirectory().getAbsolutePath() : " , Environment.getExternalStorageDirectory().getAbsolutePath());
        Log.d("File getRootDirectory().getAbsolutePath() : " , Environment.getRootDirectory().getAbsolutePath());
        Log.d("File Environment.getRootDirectory().list() : " , Arrays.toString(Environment.getRootDirectory().list()));
        Log.d("File Environment.getExternalStorageDirectory().list() : " , Arrays.toString(Environment.getExternalStorageDirectory().list()));
        Log.d("File Environment.getExternalStorageState() : " , Environment.getExternalStorageState());
        Log.d("File Environment.getExternalStorageDirectory().listFiles() : " , String.valueOf(Environment.getExternalStorageDirectory().listFiles() != null));
        Log.d("File rootPath 참조변수 출력: " , rootPath);


        if ( result == false )
            return;

        listView.setAdapter(listAdapter);
        listView.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {
                Log.d("File Test", position + " : " + items.get(position).toString());
                currentPath = textView.getText().toString();
                String path = items.get(position).toString();
                // ".."을 누르면 이전으로 아니라면 다음으로
                if (path.equals("..")) {
                    prevPath(path);
                } else {
                    nextPath(path);
                }
            }
        });

        /*디렉터리 안에 있는 파일 가져오기 시작*/
        String path = Environment.getExternalStorageDirectory().toString()+"/Download";
        Log.d("File ", "Path: " + path);
        //File 객체 생성
        File directory = new File(path); 
        //File객체에 담긴 파일들을 File배열로
        File[] files = directory.listFiles(); 
        Log.d("File ", "Size: "+ files.length);
        for (int i = 0; i < files.length; i++)
        {
            Log.d("File getName ", "FileName:" + files[i].getName()); //FileName:dummy.pdf
        }
        /*디렉터리 안에 있는 파일 가져오기 끝*/

        /*디렉터리 안에 있는 파일 가져오기 시작2 - List*/
        List<String> filesNameList = new ArrayList<>();

        for (int i=0; i< files.length; i++) {
            filesNameList.add(files[i].getName());
            Log.d("File 2 getName ", "FileName:" + files[i].getName()); //FileName:dummy.pdf
        }
        /*디렉터리 안에 있는 파일 가져오기 끝2 - List*/

        //파일목록 가져오기3
        getFilesFromDir(downloadDir);

        //파일목록 가져오기4 (특정 확장자만 가져오기)
        List<File> files4 = getListFiles(new File(rootPath));

    }


    private void checkPermission(String permission, Integer requestCode) {
        if (ContextCompat.checkSelfPermission(MainActivity.this, permission) != PackageManager.PERMISSION_GRANTED) {

            // Should we show an explanation?
            if (ActivityCompat.shouldShowRequestPermissionRationale(MainActivity.this, permission)) {
                //This is called if user has denied the permission before
                //In this case I am just asking the permission again
                ActivityCompat.requestPermissions(MainActivity.this, new String[]{permission}, requestCode);
            } else {
                ActivityCompat.requestPermissions(MainActivity.this, new String[]{permission}, requestCode);
            }
        } else {
            Toast.makeText(this, "" + permission + " is already granted.", Toast.LENGTH_SHORT).show();
        }
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (ActivityCompat.checkSelfPermission(this, permissions[0]) == PackageManager.PERMISSION_GRANTED) {
            //permission granted
            Log.d("granted File getExternalStorageDirectory().getAbsolutePath() : " , Environment.getExternalStorageDirectory().getAbsolutePath());
            Log.d("granted File getRootDirectory().getAbsolutePath() : " , Environment.getRootDirectory().getAbsolutePath());
            Log.d("granted File Environment.getRootDirectory().list() : " , Arrays.toString(Environment.getRootDirectory().list())); 
            //권한이 없는경우 list는 null값이지만 권한부여 후에 출력결과는 [Android, Music, Podcasts, Ringtones, Alarms, Notifications, Pictures, Movies, Download, DCIM, VpnCapture]
            Log.d("granted File Environment.getExternalStorageDirectory().list() : " , Arrays.toString(Environment.getExternalStorageDirectory().list()));
            Log.d("granted File Environment.getExternalStorageState() : " , Environment.getExternalStorageState());
            Log.d("granted File Environment.getExternalStorageDirectory().listFiles() : " , String.valueOf(Environment.getExternalStorageDirectory().listFiles() != null));
            Log.d("granted File rootPath 참조변수 출력: " , rootPath);
        } else {
            //Permission Denied
        }
    }

    public boolean Init(String rootPath)    {
        // 파일 객체 생성
        File fileRoot = new File(rootPath);
        if(fileRoot.isDirectory() == false)        {
            Toast.makeText(MainActivity.this, "Not Directory" , Toast.LENGTH_SHORT).show();
            Log.d("File root : " , String.valueOf(fileRoot));
            return false;
        }
        textView.setText(rootPath);

        // 파일 리스트 가져오기
        String[] fileList = fileRoot.list();
        if ( fileList == null )        {
            Toast.makeText(MainActivity.this, "Could not find List" , Toast.LENGTH_SHORT).show();
            Log.d("File list : " , String.valueOf(fileList));
            return false;
        }

        // 아이템 리스트 전부 삭제
        items.clear();

        // 리스트의 첫 항목은 뒤로가기 위해 ".." 세팅
        items.add("..");
        for ( int i = 0; i < fileList.length; i++ )        {
            items.add(fileList[i]);
        }

        // 리스트 뷰에 적용
        listAdapter.notifyDataSetChanged();
        return true;
    }

    public void nextPath(String str)    {
        prevPath = currentPath;

        // 현재 경로에서 / 와 다음 경로 붙이기
        nextPath = currentPath + "/" + str;
        File file = new File(nextPath);
        if ( file.isDirectory() == false )        {
            Toast.makeText(MainActivity.this, "Not Directory" , Toast.LENGTH_SHORT).show();
            return;
        }

        String[] fileList = file.list();
        items.clear();
        items.add("..");

        for ( int i = 0; i < fileList.length; i++ )        {
            items.add(fileList[i]);
        }

        textView.setText(nextPath);
        listAdapter.notifyDataSetChanged();

    }

    public void prevPath(String str)    {
        nextPath = currentPath;
        prevPath = currentPath;


        // 마지막 / 의 위치 찾기
        int lastSlashPosition = prevPath.lastIndexOf("/");

        // 처음부터 마지막 / 까지의 문자열 가져오기
        prevPath = prevPath.substring(0, lastSlashPosition);
        File file = new File(prevPath);

        if ( file.isDirectory() == false)        {
            Toast.makeText(MainActivity.this, "Not Directory" , Toast.LENGTH_SHORT).show();
            return;
        }

        String[] fileList = file.list();
        items.clear();
        items.add("..");

        for( int i = 0; i < fileList.length; i++ )        {
            items.add(fileList[i]);
        }

        Log.d("File : " , prevPath);

        textView.setText(prevPath);
        listAdapter.notifyDataSetChanged();
    }

    /*디렉터리 안에 있는 파일 가져오기 시작 3*/
    // if a directory is found in Downloads folder, list its files
    public void getFilesFromDir(File filesFromSD) {

        File listAllFiles[] = filesFromSD.listFiles();

        if (listAllFiles != null && listAllFiles.length > 0) {
            for (File currentFile : listAllFiles) {
                if (currentFile.isDirectory()) {
                    Log.e("File 3 path isDirectory", String.valueOf(currentFile.isDirectory()));
                    getFilesFromDir(currentFile);
                } else {
                    if (currentFile.getName().endsWith("")) {
                        Log.e("File 3 isDirectory : ", String.valueOf(currentFile.isDirectory()));
                        // File absolute path
                        Log.d("File 3 getAbsolutePath : ", currentFile.getAbsolutePath());
                        // File Name
                        Log.d("File 3 getName : ", currentFile.getName());

                    }
                }
            }
        }
    }
    /*디렉터리 안에 있는 파일 가져오기 끝 3*/

    /*디렉터리 안에 있는 파일 가져오기 시작 4*/
    //특정 확장자만 가져오기 & ArrayList
    private List<File> getListFiles(File parentDir) {
        ArrayList<File> inFiles = new ArrayList<File>();
        File[] files4 = parentDir.listFiles();
        for (File file : files4) {
            if (file.isDirectory()) {
                inFiles.addAll(getListFiles(file));
                Log.d("File 4 inFiles : ", String.valueOf(inFiles));
            } else {
                if(file.getName().endsWith(".pdf")){
                    inFiles.add(file);
                    Log.d("File 4 inFiles :", String.valueOf(inFiles)); //[/storage/emulated/0/Download/dummy.pdf, /storage/emulated/0/Download/dummy (1).pdf]
                }
            }
        }
        return inFiles;
    }
    /*디렉터리 안에 있는 파일 가져오기 끝 4*/

}
```


* 참고 
    - Environment.getExternalStorageDirectory().getAbsolutePath()에서 file list null값 권한부여 해결
https://stackoverflow.com/questions/48001046/environment-getexternalstoragedir-list-returns-null

    - 파일 이름 가져오기
https://stackoverflow.com/questions/8646984/how-to-list-files-in-an-android-directory

    - 파일 이름 가져오기 2 List
https://kdsoft-zeros.tistory.com/101

    - 파일 이름 가져오기 3
https://stackoverflow.com/questions/28262275/how-to-get-complete-path-and-name-of-each-file-in-download-directory-in-android

    - 파일 이름 가져오기 4 - 특정 확장자 파일 가져오기 & arrayList
https://stackoverflow.com/questions/9530921/list-all-the-files-from-all-the-folder-in-a-single-list
