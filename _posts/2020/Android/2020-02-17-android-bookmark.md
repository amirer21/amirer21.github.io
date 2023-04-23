---
title: Android 북마크 가져오기
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
description: Android 북마크 가져오기
article_tag1: Android
article_tag2: bookmark
article_tag3: 

article_section:  
meta_keywords: Android, bookmark
last_modified_at: '2020-02-17 10:00:00 +0800'
---

## 모바일 브라우저 앱(chrome browser app)

> 연구 : 크롬 앱에 접근하여 북마크, History(브라우저의 방문기록) 가져오기

- 시도1
안드로이드 6.0(api level 23)부터 URL 정보 가져오는 메서드, API, 퍼미션등 제공을 안한다. 안드로이드가 아닌 브라우저 앱에서 제공하는 api 를 사용해보려고 검토중

- 시도2
기록이 저장되는 data 폴더경로 안보임

- 시도3
root권한으로 폴더검색

### 이유1
브라우저 책갈피 변경 사항

```
이 릴리스에서는 전역 책갈피 지원이 제거되었습니다. 
android.provider.Browser.getAllBookmarks()와 android.provider.Browser.saveBookmark() 메서드는 이제 제거되었습니다.
마찬가지로 READ_HISTORY_BOOKMARKS와 WRITE_HISTORY_BOOKMARKS 권한도 제거되었습니다.
 앱이 Android 6.0(API 레벨 23) 이상을 대상으로 하면 전역 제공자에서 책갈피에 액세스하거나 책갈피 권한을 사용하지 마십시오. 대신 앱은 내부에서 책갈피 데이터를 저장해야 합니다.
 ```
> https://developer.android.com/about/versions/marshmallow/android-6.0-changes.html#behavior-bookmark-browser

```
API 레벨 23에서 Browser.BookmarkColumns 클래스를 제거되었기 때문에 IDE가 API 레벨 23에 대한 컴파일 시간 오류를 표시합니다 .

이 문제에 대한 해결책은?

Android 6.0 릴리스 정보 :
"앱이 Android 6.0 (API 레벨 23) 이상을 대상으로하는 경우 글로벌 공급자의 책갈피에 액세스하거나 책갈피 권한을 사용하지 마십시오. 대신 책갈피 데이터를 내부에 저장해야합니다."
북마크`를 사용하지 않는 것이 좋습니다. 이제는 권장하지 않습니다.
```

> https://github.com/zxing/zxing/issues/557

try it: (run perfectly in android > 4.0 and 5 or 6.0 ); Anything, create a contentObserver array in FOREACH and add a list and record a different URI for each.
in service android (background):

```java
HistoryObserver hObserver;

 public void onCreate() {
   hObserver = new HistoryObserver(new Handler(), this); 
   getApplicationContext().getContentResolver().registerContentObserver(Uri.parse("content://com.android.chrome.browser/history"), true, hObserver);
 }

Class historicObserver:

import java.text.SimpleDateFormat;
import java.util.Calendar;

import android.annotation.SuppressLint;
import android.content.Context;
import android.database.ContentObserver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Handler;
import android.provider.Browser;
import android.util.Log;

public class HistoryObserver extends ContentObserver {

public final String TAG = "HistoryObserver";

Context context;

public HistoryObserver(Handler handler, Context c) {
    super(handler);
    Log.d(TAG, "Creating new HistoryObserver");
    context = c;
}

public HistoryObserver(Context c) {
    super(null);
    Log.d(TAG, "Creating a new HistoryObserver without a Handler");
    context = c;
}

@Override
public boolean deliverSelfNotifications() {
    Log.d(TAG, "delivering self notifications");
    return true;
}

@Override
public void onChange(boolean selfChange) {
    super.onChange(selfChange);
    Log.d(TAG, "onChange without uri: " + selfChange);
    // onChange(selfChange, null);
}

@SuppressLint("NewApi")
public void onChange(boolean selfChange, Uri uri) {
    super.onChange(selfChange, uri);


    Log.d(TAG, "onChange: " + selfChange + "\t " + uri.toString());

    String[] proj = new String[] { Browser.BookmarkColumns.TITLE,
            Browser.BookmarkColumns.URL, Browser.BookmarkColumns.DATE };
    String selection = Browser.BookmarkColumns.BOOKMARK + " = 0"; // 0 =
                                                                    // history,
                                                                    // 1 =
                                                                    // bookmark

    try {
        Thread.sleep(1500);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }

    Cursor mCursor = context.getContentResolver().query(Browser.BOOKMARKS_URI,
            proj, selection, null, null);
    // this.startManagingCursor(mCursor);
    mCursor.moveToFirst();
    int count = mCursor.getColumnCount();
    String COUNT = String.valueOf(count);
    Log.e("Browser sayac", COUNT);

    String title = "";
    String url = "";
    String date = "";
    if (mCursor.moveToFirst() && mCursor.getCount() > 0) {

        while (mCursor.isAfterLast() == false) {

            title = mCursor.getString(mCursor
                    .getColumnIndex(Browser.BookmarkColumns.TITLE));
            url = mCursor.getString(mCursor
                    .getColumnIndex(Browser.BookmarkColumns.URL));
            date = mCursor.getString(mCursor
                    .getColumnIndex(Browser.BookmarkColumns.DATE));
            Long timestamp = Long.parseLong(date);

            SimpleDateFormat dateFormat = new SimpleDateFormat(
                    "dd/MM/yyyy/HH:mm");
            Calendar calendar = Calendar.getInstance();
            calendar.setTimeInMillis(timestamp);
            String finaldate = dateFormat.format(calendar.getTime());
            String smsDate = finaldate.toString();

            // Log.e("DTE", date);
            Log.e("URL", title);

            Log.e("TARIH", smsDate);
            mCursor.moveToNext();
        }
    }
}
}
```

> https://stackoverflow.com/questions/31536607/android-browser-history-uri/33137176#33137176



```java
public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        String[] proj = new String[] { Browser.BookmarkColumns.TITLE, Browser.BookmarkColumns.URL , Browser.BookmarkColumns.DATE};
        Uri uriCustom = Uri.parse("content://com.android.chrome.browser/bookmarks");
        //String sel = Browser.BookmarkColumns.BOOKMARK + " = 0"; // 0 = history, 1 = bookmark
        //Cursor mCur = getContentResolver().query(uriCustom, proj, sel, null, null);
        String sel = Browser.BookmarkColumns.BOOKMARK + " = 0 " +" AND " + Browser.BookmarkColumns.DATE + "BETWEEN ? AND ?"; // 0 = history, 1 = bookmark
        Cursor mCur = getContentResolver().query(uriCustom, proj, sel, new String[]{startdate, enddate}, null);
        //this.startManagingCursor(mCur);
        mCur.moveToFirst();

        String title = "";
        String url = "";
        String date_time="";
        if (mCur.moveToFirst() && mCur.getCount() > 0) {
            while (mCur.isAfterLast() == false) {

                title = mCur.getString(mCur.getColumnIndex(Browser.BookmarkColumns.TITLE));
                url = mCur.getString(mCur.getColumnIndex(Browser.BookmarkColumns.URL));
                date_time=mCur.getString(mCur.getColumnIndex(Browser.BookmarkColumns.DATE));
                // Do something with title and url
                System.out.println("Title="+title+"---"+url);
                mCur.moveToNext();
            }
        }
    }
}
```
> https://stackoverflow.com/questions/29531370/how-to-get-the-browsing-history-in-android-for-a-particular-time-period



### 이유2

크롬 저장소 직접 접근
디렉터리 안보임

Android에서 Chrome의 전체 브라우저 기록을 파일 형식 (csv, xml 등)으로 내보내는 방법이 있습니까?
(Android 4.2.2에 Chrome 42.0.2311.111이 있습니다.)

데스크톱 기반 Chrome에서는이를 처리하는 애드온을 설치할 수 있습니다. 이름은 Export History 입니다. Android에서는 사용할 수없는 것 같습니다

> https://android.stackexchange.com/questions/110053/export-chrome-history-in-android


content provider
use this instead of accessing directly from browser Because Once i had the same issue and solved it by this hope it will help you
```java
public final Uri BOOKMARKS_URI = Uri.parse("content://browser/bookmarks");
public final String[] HISTORY_PROJECTION = new String[]{
            "_id", // 0
            "url", // 1
            "visits", // 2
            "date", // 3
            "bookmark", // 4
            "title", // 5
            "favicon", // 6
            "thumbnail", // 7
            "touch_icon", // 8
            "user_entered", // 9
    };
public final int HISTORY_PROJECTION_TITLE_INDEX = 5;
public final int HISTORY_PROJECTION_URL_INDEX = 1;
```

> https://stackoverflow.com/questions/32535325/browser-bookmarks-uri-not-working-in-android-studio/33360583



Using content provider you can read these shared datas of chrome.
content://com.android.chrome.browser/bookmarks
content://com.android.chrome.browser/searches
content://com.android.chrome.browser/history
content://com.android.chrome.browser/combined
content://com.android.chrome.browser/hierarchy
Accessing data using Content Provider Uri

```java
String URL = "content://com.android.chrome.browser/bookmarks";

    Uri students = Uri.parse(URL);
    Cursor cursor = managedQuery(students, null, null, null, null);

    if (cursor.moveToFirst()) {
        do {
            StringBuilder sb = new StringBuilder();
            int columnsQty = cursor.getColumnCount();
            for (int idx=0; idx<columnsQty; ++idx) {
                try {
                    sb.append(cursor.getInt(idx));
                }catch (Exception e1){
                    try {
                        sb.append(cursor.getString(idx));
                    }catch (Exception e2){
                        try {
                            sb.append(cursor.getDouble(idx));
                        }catch (Exception e3){
                            try {
                                sb.append(cursor.getBlob(idx));
                            }catch (Exception e4){
                                try {
                                    sb.append(cursor.getFloat(idx));
                                }catch (Exception e5){
                                    try {
                                        sb.append(cursor.getLong(idx));
                                    }catch (Exception e6){
                                        sb.append("Error");
                                    }
                                }
                            }
                        }
                    }
                }

                if (idx < columnsQty)
                    sb.append(" ").append("( ").append(cursor.getColumnName(idx)).append(" )").append(" | ");
            }
            Log.e(TAG, String.format("Row: %d, Values: %s", cursor.getPosition(),
                    sb.toString()));
        } while (cursor.moveToNext());
    }
```
https://stackoverflow.com/questions/44643521/get-all-url-of-chrome-in-android
