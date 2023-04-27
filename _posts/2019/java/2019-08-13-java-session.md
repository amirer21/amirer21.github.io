---
title: java HttpSession 클래스 (java Session)
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Java
toc: true
toc_sticky: true
toc_label: 목차
description: java HttpSession 클래스 (java Session)
article_tag1: java
article_tag2: HttpSession
article_tag3: Session
article_section:  
meta_keywords: java, HttpSession, Session
last_modified_at: '2019-08-13 10:00:00 +0800'
---

## java HttpSession 클래스 (Session)

- javax.servlet.http.HttpSession

javax.servlet.http.HttpSession의 객체인 session에는 getAttribute() 메소드, setAttribute 메소드가 있다.

    1.세션값 넣기 : 로그인 후 세션값을 넣어두는 함수는 'MainController.java'에 두었다. 로그아웃 후 세션삭제

    2.세션값 읽기 : 각 페이지에서 세션을 가져오기위해 tiles(foTop.jsp)에  함수(getAttribute)를 두었음.

### 컨트롤러 (MainController.java)
```java
/**
* 로그인+세션
* 
* @param	req		HTTP요청
* @param	res		HTTP응답
* @param	session		session
* 
* @return	로그인 결과 JSON 문자열
* @throws	Exception	예외

*/
@RequestMapping(value="/login.json", method=RequestMethod.POST, produces=MediaType.APPLICATION_JSON_VALUE)
public @ResponseBody KLResultVO login (HttpServletRequest req, HttpServletResponse res, HttpSession session) throws Exception
	{	
/*login ID 파라미터*/
		String	memberId = KLWebTool.getString (req, "memberId");
		String 	userSession = null;

/*기존에 login 세션 값이 존재하면 기존 값을 제거*/		
if (session.getAttribute("memberId") != null) {
                  session.removeAttribute("memberId");
        }
		
		//session 객체에 admin이라는 값을 id라는 키로 저장
		//name은 String형, value는 Object형 이어야만 한다
		//session.setAttribute(String name, Object obj);
		//session.setAttribute("id", memberId);
		
/*세션 넣기 session 객체에 memberId이라는 값을 userSession라는 키로 저장*/
	if (memberId != null) {
	           session.setAttribute("userSession", memberId);
	     }
	System.out.println("----Login Controller---session----");
	System.out.println("아이디 :"+memberId);
	System.out.println(req);
	System.out.println(res);
	System.out.println(session);		
		
/*세션 가져오기*/
userSession = (String) session.getAttribute("userSession");
	System.out.println("----get userSession----");
	System.out.println(userSession);
	System.out.println("----Login Controller----");
	
	return this.service. login (req, res);
	}
```


### session 값 넣기
```java
   session().setAttribute("SS_Userid", "관리자")
   request.getSession().setAttribute("SS_Userid", "관리자")
<@ page session = "true" %>
```
- page 디렉티브의 session 속성의 기본값은 ture 이므로 false로 지정하지 않으면 자동 생성된다.

```java
session.setAttribute("id", "value");
```

이때 주의할 사항은 세션의 속성 값은 객체 형태만 올 수 있다는 것이다.
session 객체는 웹 브라우저와 매핑되므로 해당 웹 브라우저를 닫지 않는 한 같은 창에서 열려진 페이지는 모두 같은 session 객체를 공유하게 된다. 따라서 session 객체의 setAttribute() 메소드를 사용해서 세션의 속성을 지정하게 되면 계속 상태를 유지하는 기능을 사용할 수 있게 된다.


### session 가져오기

foTop.jsp
```jsp
<!--세션 가져오기-->
<% 	
String userSession = (String)session.getAttribute("userSession");
%>	
<p>세션 이름 : <b>${userSession}</b></p>
```


### 세션값 읽기
```java
   (String)session.getAttribute("SS_Userid")  // String 형식
   (String)request.getSession().getAttribute("SS_Userid")  // String 형식
   (Integer)session.getAttribute("SS_Userid")  // Integer 형식
   (Integer)request.getSession().getAttribute("SS_Userid")  // Integer 형식
String id = (String)session.getAttribute("id");
```
getAttribute() 메소드는 리턴 타입이 Object 타입이므로 사용 시 실제 할당된 객체 타입으로 형변환(casting)을 해야 한다.


### jsp 에서 session 가져오기
```jsp
<html>
<body>
세션에 저장된 이름 : ${sessionUserName}
</body>
</html>
```

### 세션값 초기화하기 invalidate()
```java
session.setAttribute("member", null);
session.invalidate();
```

### 세션변수 목록 보기(getAttributeNames)

> javax.servlet.http.HttpSession의 getAttributeNames

> java.util.Enumeration


```java
Enumeration enum=session.getAttributeNames();
String tmp="";
while (enum.hasMoreElements())
 {
     tmp=(String)enum.nextElement();
     out.print("<br>"+tmp+":"+session.getAttribute(tmp));
}
```

### 세션(Session) API
- getAttribute(String name) : java.lang.Object, 세션 속성명이 name인 속성의 값을 Object 타입으로 리턴한다. 해당 되는 속성명이 없을 경우에는 null 값을 리턴한다.
- getId() : java.lang.String,세션에 할당된 고유 식별자를 String 타입으로 리턴한다. 

### 세션(Session) 사용 예제
```jsp
<%@ page language ="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<% request.setCharacterEncoding("euc-kr");%>
 
<%
String id = request.getParameter("id");                // request에서 id 파라미터를 가져온다
String passwd = request.getparameter("passwd");        // request에서 passwd 파라미터를 가져온다.
 
--- 로그인 처리 ...   로그인 성공시 check 는 TRUE --
 
if(check){                                             // 로그인 성공시
    session.setAttribute("id", id);                    // 세션에 "id" 이름으로 id 등록
    response.sendRedirect("main.jsp");                 // 로그인 성공 메인페이지 이동
}else{
%>
                                                       // 로그인 실패
<script>
    alert("로그인 실패");
    history.go(-1);                                    // 이전 페이지로 이동
</script>
 
<%
}
%>
```

### 세션(Session) 가져오기 (세션에서 아이디를 가져와 로그인 상태를 인증하고, 값이 없을 경우 로그인 페이지로 넘긴다.)

```jsp
<%@ page language ="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<% request.setCharacterEncoding("euc-kr");%>
 
<%
String id = "";
 
try{
    id = (String)session.getAttribute("id");        // request에서 id 파라미터를 가져온다
 
    if(id==null||id.equals(""){                     // id가 Null 이거나 없을 경우
        response.sendRedirect("loginform.jsp");     // 로그인 페이지로 리다이렉트 한다.
    }
<%
}
%>
```

### 세션(Session) 제거하기 (로그아웃 시 현재의 세션 정보를 제거한다.)

 ```jsp
<%@ page language ="java" contentType="text/html; charset=EUC-KR" pageEncoding="EUC-KR"%>
<% session.invalidate(); %>                         // 세션 정보 제거
 
<script>
    alert("로그아웃 되었습니다.");
    location.href="logout.jsp";                     // 로그아웃 페이지로 이동
</script>
```
