---
title: Android Intent 데이터 전달
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
description: Android Intent 데이터 전달
article_tag1: Android
article_tag2: Intent
article_tag3: 

article_section:  
meta_keywords: Android, Intent
last_modified_at: '2020-03-02 10:00:00 +0800'
---

## 컴포넌트(Activity) 간 데이터 전달하기

컴포넌트(Activity)간 데이터 전달을 위해서는 인텐트가 필요하다

```java
Intent intent = new Intent(getApplicationContext(),IntentPage.class);   
//첫번째 인자 나의 클래스명, 두번째 인자 이동할 클래스명
//키 값으로 String이라는 이름을 지정하며 , 두번째 인자로 전송할 데이터 변수 지정   .putExtra("key",value);
intent.putExtra("String",Data);
//IntentPage Activity에 데이터를 전달.
//인텐트를 시작한다. startActivity()호출
startActivity(intent);  

//수신
Intent intent = getIntent(); 
//메소드를 이용하여 액티비티에서 전달 한 인텐트를 가져올 수 있다.
 getIntent() 
 //호출한 액티비티에서 String 이라는 키 값을 가진 데이터 로드
String Receive = intent.getStringExtra("String");

//수행한 작업이 성공적일때 코드
setResult(RESULT_OK,intent);

```

------------------------

## LoginActivity.java 에서 RegisterActivity.java로 데이터 전달 예제

### 요약 

보내는 클래스 : LoginActivity.java 
```java
/*회원등록에 넣을 data를 RegisterRequest로 전달*/
Intent deviceIntent = new Intent(LoginActivity.this, RegisterActivity.class);
deviceIntent.putExtra("phoneNum", getPhone());   //전화번호
deviceIntent.putExtra("android_id", android_id);   //IMEI 단말기 고유번호
startActivity(deviceIntent);
```

받는 클래스 : RegisterActivity.java
```java
Intent deviceIntent = getIntent(); //getIntent()는 onCreate()메서드 안에서 사용할 것
//deviceIntent.getIntExtra("getPhoneNum", 0);
String phoneNum   = deviceIntent.getStringExtra("phoneNum");
String android_id = deviceIntent.getStringExtra("android_id");

//서버로 Volley를 이용하여 요청
RegisterRequest registerRequest = new RegisterRequest(userID, userPass, userName, userAge, phoneNum, android_id, responseListener);
RequestQueue queue = Volley.newRequestQueue(RegisterActivity.this);
queue.add(registerRequest);
```

------------------------
### 전체 코드

RegisterActivity.java
```java
public class RegisterActivity extends AppCompatActivity {

    private EditText et_id, et_pass, et_name, et_age;
    private Button btn_register;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        //아이디 값 찾아주기
        et_id         = findViewById(R.id.et_id);
        et_pass       = findViewById(R.id.et_pass);
        et_name       = findViewById(R.id.et_name);
        et_age        = findViewById(R.id.et_age);

        //회원가입 버튼클릭시 수행
        btn_register  = findViewById(R.id.btn_register);
        btn_register.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //EditText에 현재 입력된 값들을 가져온다.
                String userID       = et_id.getText().toString();
                String userPass     = et_pass.getText().toString();
                String userName     = et_name.getText().toString();
                int    userAge      = Integer.parseInt(et_age.getText().toString());

                Intent deviceIntent = getIntent(); //getIntent()는 onCreate()메서드 안에서 사용할 것
                //deviceIntent.getIntExtra("getPhoneNum", 0);
                String phoneNum   = deviceIntent.getStringExtra("phoneNum");
                String android_id = deviceIntent.getStringExtra("android_id");


                Response.Listener<String> responseListener = new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        //json object를 활용하여 회원가입 실행
                        try {
                            JSONObject jsonObject = new JSONObject(response);
                            boolean success = jsonObject.getBoolean("success"); //boolean형 값으로 ture, false가 반환되므로 분기처리가 가능해진다.
                            if (success){ //등록성공
                                Toast.makeText(getApplicationContext(), "회원등록에 성공하였습니다.", Toast.LENGTH_SHORT).show();
                                Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
                                startActivity(intent);
                            } else { //등록실패
                                Toast.makeText(getApplicationContext(), "회원등록에 실패하였습니다.", Toast.LENGTH_SHORT).show();
                                return;
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }

                    }
                };

                //서버로 Volley를 이용하여 요청
                RegisterRequest registerRequest = new RegisterRequest(userID, userPass, userName, userAge, phoneNum, android_id, responseListener);
                RequestQueue queue = Volley.newRequestQueue(RegisterActivity.this);
                queue.add(registerRequest);
            }
        });
    }
}
```


RegisterRequest.java
```java
public class RegisterRequest extends StringRequest {

    //서버 URL 설정
    final static private String URL = "http://xxx.xxx.xxx.xxx/Register.php"; // apache 서버
    private Map<String, String> map;

    public RegisterRequest(String userID, String userPassword, String userName, int userAge, String phoneNum, String android_id, Response.Listener<String> listener){
        super(Method.POST, URL, listener, null);

        map = new HashMap<>();
        map.put("userID",       userID);
        map.put("userPassword", userPassword);
        map.put("userName",     userName);
        map.put("userAge",      userAge + "");  //Age는 int형이기때문에 ""으로 string처럼 나타낸다.
        map.put("phoneNum",     phoneNum);      //폰번호
        map.put("android_id",   android_id);    //android_id

    }

    @Override
    protected Map<String, String> getParams() throws AuthFailureError {
        return map;
    }
}
```