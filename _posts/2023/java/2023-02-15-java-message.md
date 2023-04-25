---
title: JAVA [Message] properties 메시징 처리하기
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- JAVA
toc: true
toc_sticky: true
toc_label: 목차
description: JAVA properties 메시징 처리하기
article_tag1: Properties
article_tag2: Message
article_tag3: a
article_section: 메시징 처리
meta_keywords: java, message, properties
last_modified_at: '2023-02-15 10:00:00 +0800'
---

## JAVA [Message] properties 메시징 처리하기

**메시징 처리**
자바 스프링 프레임워크에서 별도의 메시지 파일을 통한 메시징 처리.여러가지 알림 문구들을 모아서 관리.


## Step 1: MessageSource messageSource()
Spring boot를 사용하지 않으면 메시지를 빈으로 직접 등록해야 한다.
<br>Java 10 미만이라면 MessageSource 인스턴스를 ResourceBundleMessageSource 타입으로 생성해준다.

① *java 10* 미만인경우
```java
import org.springframework.context.MessageSource;

@Bean
public MessageSource messageSource() {
    var messageSource = new ResourceBundleMessageSource();
	// ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
    messageSource.setBasename("messages");
    messageSource.setDefaultEncoding("UTF-8");
 
    return messageSource;
}
````

② Spring Boot를 사용하는 경우
```java
@Autowired
private MessageSource messageSource;

throw new RuntimeException(messageSource.getMessage("프로퍼티 key", null, Locale.getDefault()), ie);
```

# API 살펴보기 (MessageSource 클래스)

getMessage의 매개변수 메시지(메세지 내용이 있는 프로퍼티의 key 값 "{0}", "{1,date}", "{2,time}"과 같은 매개변수)

```java
String getMessage(String code, Object[] args, Locale locale) throws NoSuchMessageException;

//api
public RuntimeException(String message, Throwable cause) {
	super(message, cause);
}
```

	
# Step 2 : pom.xml
```xml
<!-- Spring caching framework inside this -->
<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-context</artifactId>
	<version>4.1.2.RELEASE</version>
	<exclusions>
		<exclusion>
			<groupId>commons-logging</groupId>
			<artifactId>commons-logging</artifactId>
		</exclusion>
	</exclusions>			
</dependency>
<!-- Support for Ehcache and others -->
<dependency>
	<groupId>org.springframework</groupId>
	<artifactId>spring-context-support</artifactId>
	<version>4.1.2.RELEASE</version>
</dependency>		
```		
	
# Step 3 : web.xml
web.xml 파일에서 추가된 스프링 설정파일인 message-context.xml 파일을 로딩 <br>
경로 : src\main\webapp\WEB-INF\web.xml
```xml
<!--contextConfigLocation 설정파일 -->
<context-param>
	<param-name>contextConfigLocation</param-name>
	<param-value>classpath*:egovframework/spring/context-*.xml</param-value>
</context-param>
<listener>
	<listener-class>org.springframework.web.context.ContextLoaderListener</listener-class>
</listener>
<listener>
	<listener-class>org.springframework.web.context.request.RequestContextListener</listener-class>
</listener>
<servlet>
	<servlet-name>action</servlet-name>
	<servlet-class>org.springframework.web.servlet.DispatcherServlet</servlet-class>
	<init-param>
		<param-name>contextConfigLocation</param-name>
		<param-value>/WEB-INF/config/egovframework/springmvc/dispatcher-servlet.xml</param-value>
	</init-param>
	<load-on-startup>1</load-on-startup>
</servlet>
```

# Step 4 : context-common.xml
경로 : \src\main\resources\egovframework\spring\context-common.xml
```xml
<bean id="messageSource" class="org.springframework.context.support.ReloadableResourceBundleMessageSource">
	<!-- 파일의 기본 인코딩을 지정한다. -->
	<property name="defaultEncoding" value="UTF-8"/>
	<!-- 메세지 파일의 위치를 지정한다. message_언어.properties 파일을 찾는다. -->	
	<!--해당 {basename}으로 시작하는 모든 Property를 읽어서 사용하는 Locale에 해당하는 Property를 사용하게 된다.-->
	<property name="basenames">	
		<!-- <list>...</list>인 것처럼 여러 Message Property를 등록할 수 있다. -->	
		<list>
			<!-- basenames 설정: 아래처럼 하면 WEB-INF 밑의 message 폴더 아래의 message로 시작하는 모든 Property를 찾는다-->			
			<value></value>에는 root(src/main/resource)로부터 경로를 적어준다
			<value>classpath:/egovframework/message/message</value>
			<value>classpath:/egovframework/rte/fdl/idgnr/messages/idgnr</value>
			<value>classpath:/egovframework/rte/fdl/property/messages/properties</value>
		</list>
	</property>
	<!-- properties 파일이 변경되었는지 확인하는 주기를 지정한다. 아래는 60초 간격으로 지정. -->
	<property name="cacheSeconds">
		<value>60</value>
	</property>
</bean>
<!-- 언어 정보를 세션에 저장하여 사용한다. -->
<bean id="localeResolver" class="org.springframework.web.servlet.i18n.SessionLocaleResolver">
    	<property name="defaultLocale" value="ko" />
</bean>
```

# Step 5 : dispatcher-servlet.xml
경로 : \src\main\webapp\WEB-INF\config\egovframework\springmvc\dispatcher-servlet.xml
```xml
<bean id="localeResolver" class="org.springframework.web.servlet.i18n.SessionLocaleResolver" />
<!-- 쿠키를 이용한 Locale 이용시 <bean id="localeResolver" class="org.springframework.web.servlet.i18n.CookieLocaleResolver"/> -->
<bean id="localeChangeInterceptor" class="org.springframework.web.servlet.i18n.LocaleChangeInterceptor">
	<property name="paramName" value="language" />
</bean>
```


# Step 6 : message_ko.properties

properties 파일에 따른 구분 : 
- properties 가 1개인 경우 : res.setBasename("/WEB-INF/properties/파일명")<br>
- properties 가 여러개인 경우 : res.setBasenames("/WEB-INF/properties/파일명1", "/WEB-INF/properties/파일명2") <br>

**{0} 값을 넣어줄 수 있다. {0}, {1}, {2}... 등으로 여러개를 사용할 수 있다.** <br>
경로 : \src\main\resources\egovframework\message\message_ko.properties
```xml
msg.0110 ={0}을 다시 입력해 주십시오.
msg.0111 ={0}를 다시 입력해 주십시오.
msg.0112 =서버 오류입니다.
msg.0113 =잘못된 접근입니다.
msg.0114 =다운로드할 수 없는 파일입니다.
msg.0115 =파일이 존재하지 않거나, 읽을 수 없습니다.
msg.0116 =다시 시도해 주십시오.
msg.0118 =로그인 후 사용해 주십시오.
msg.0119 =해당 파일을 찾을수 없습니다.
msg.0120 =검색어가 누락 되었습니다.
msg.0121 =검색어를 입력 후 다시 실행해 주십시오.
msg.0122 =기간을 입력해주세요.
msg.0123 =시작일은 종료일보다 클 수 없습니다.
msg.0124 =최대 90일까지 설정 가능합니다.
msg.0126 =서버와 통신중 오류가 발생하였습니다.
```


# Step 7 : jsp 에서 사용하기
## 가져오기(import)
```jsp
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
```

## 사용
```javascript
alert("<spring:message code='msg.0055'/>");
```

# Java example
```java
/**
  * @Method Name : invokeBeanMethod
  * @작성일 : 
  * @작성자 : 
  * @변경이력 : 
  * @Method 설명 : BeanMethod 호출
  * @param applicationContext
  * @param serviceBean
  * @param serviceMethod
  * @param serviceArgs
  * @param request
  * @return
  */
public Object invokeBeanMethod(ApplicationContext applicationContext, Object serviceBean, Method serviceMethod, Object[] serviceArgs, HttpServletRequest request) {
	Object result = null;
	try {
		result = serviceMethod.invoke(serviceBean, serviceArgs);
		Class<?> serviceMethodReturnType = serviceMethod.getReturnType();
		if(void.class.equals(serviceMethodReturnType)) {
			return null;
		}
	} catch (InvocationTargetException ie) {
		if(ie.getTargetException().getClass().equals(test.common.util.AjaxMessageException.class)){
			return ie.getTargetException().getMessage() == null ? "에러발생" : ie.getTargetException().getMessage();
		}else if(ie.getTargetException().getClass().equals(test.common.util.AjaxMapException.class)){
			Map<String, Object> errMap = new HashMap<String, Object>();
			errMap.put("RESULT", "ERROR");
			errMap.put("CODE", "52");
			errMap.put("MSG", ie.getTargetException().getMessage());
			return errMap;
		}else{
			logger.debug("Service Method 호출 에러", ie);
			throw new RuntimeException(messageSource.getMessage("msg.0126", null, Locale.getDefault()), ie);
		}
	} catch (Exception e) {
		logger.debug("Service Method 호출 에러", e);
		throw new RuntimeException(messageSource.getMessage("msg.0126", null, Locale.getDefault()), e);
	}
	return result;
}
```