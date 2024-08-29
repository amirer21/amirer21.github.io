---
title: Blockchain Truffle로 solidity 개발환경 구축하기
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Blockchain
tags:
- Blockchain
- Truffle
- Solidity
toc: true
toc_sticky: true
toc_label: 목차
description: Blockchain Truffle로 solidity 개발환경 구축하기
article_tag1: Blockchain
article_tag2: truffle
article_tag3: solidity
article_section:  
meta_keywords: Blockchain, truffle, solidity
last_modified_at: '2019-01-15 10:00:00 +0800'
---

# Truffle로 솔리디티 개발환경 구축하기 

## 1. Truffle 설치, 프로젝트 빌드

**Truffle란?** Truffle Famework는 솔리디티 코드(스마트 컨트랙트)를 로컬 환경에서 Compile, Deploy를 지원해주는 프레임워크이다.

### (1) 설치 
(아래 과정을 진행하기 전에 node.js가 설치되어 있어야함)

참고 : https://truffleframework.com/truffle 

cmd에서 다음 입력하여 설치
> npm install truffle -g


### (2) 폴더생성 : git/eth/truffle_01 폴더생성 
> mkdir truffle_01

### (3) 프로젝트 빌드 (프로젝트에 필요한 것들을 다운받아 설치됨)
> truffle init
compile, migrate, test contracts의 3가지로 구성이 되어있다.

### (4) IDE(Atom)에서 다음 내용을 코딩한다.
(WebStorm 텍스트 편집기의 경우는 Intellij-solidity 플러그인을 설치 )

#### HelloToken.sol 소스 
(새파일 HelloToken.sol을 만들어서 아래 소스를 입력한다.)

```js
pragma solidity >=0.4.21 <0.6.0;

contract HelloToken {
  
  function HelloToken(){

  }

}
```

## 2. Ganache Test Network

블록체인 Token을 배포하려면 블록체인 네트워크가 필요하다.
이더리움 메인넷에 배포하기 위해 이더리움이 필요하므로, 로컬에 개발환경을 설치하도록 하자.

### ganache 다운로드 및 설치
https://truffleframework.com/ganache 

실행해보면 로컬 네트워크인 서버를 볼 수 있다. 

윈도우 : cmd 에서 다음 명령어로 설치
> npm install -g ganache-cli 

### ganache 서버 실행

> ganache-cli -u 0 

### 스마트컨트랙트 배포
(92 버전은 7545, 이 버전은 8545이다.)
**주의** 서버를 실행하는 cmd 창은 그대로 두고, 새로운 cmd를 열어서 다음 작업 과정을 수행하도록 한다.

Ganache를 이용해 네트워크를 실행하였으니, 배포를 해서 테스트 해보자
Migrations에서 스크립트를 구성해주어야한다. truffle프레임워크이므로 여기의 가이드대로 사용한다.
Migrations에서 2_deploy_hello.js를 생성한 후 아래 코드(1_initial_migration.js의 코드)를 복사해 붙여넣는다. 여기서 "Migrations"를 "HelloToken"으로 변경해준다.

#### 1_initial_migration.js의 소스
```js
var Migrations = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
```

#### 2_deploy_hello.js의 소스
```js
var HelloToken = artifacts.require("./Migrations.sol");

module.exports = function(deployer) {
  deployer.deploy(HelloToken);
};
```

배포 터미널에서 다음 명령어로 배포
(**참고** 위의 파일이 있는 디렉터리에서 다음 내용을 입력 후 실행)
>truffle migrage


## 3. 로컬 네트워크에 토큰 배포하기
위에서 작성한 토큰은 일종의 contract 프로그램이며, 잘 작동되는지 확인할 수 있다.
이 contract프로그램은 이더리움 네트워크에서 사용될 것이므로 이더리움 네트워크에서 배포해서 사용해야되지만, ganache를 이용해서 로컬 네트워크에서도 사용할 수 있다.

>truffle migrate --network development

truffle.js 읽어와서 작업하게 된다. 이후 실행내용을 커맨드창에서 transaction 로그를 확인할 수 있다.
migrations 디렉터리 안의 스크립트를 모두 실행하는데, network development에 배포한다.

만약, 네트워크 객체에 development이외의 qa가 있다면 다음 명령어로 qa 네트워크에 배포된다.
> truffle migrate --network qa 



## 4. hello 출력하기

test 디렉터리에서 hello_token_test.js 새 파일만들기

https://truffleframework.com/docs/truffle/testing/writing-tests-in-javascript 에 있는 
소스 중 아래 소스부분만 복사해 붙여넣기

```js
const MetaCoin = artifacts.require("MetaCoin");

contract("MetaCoin", accounts => {
it("should put 10000 MetaCoin in the first account", () =>

```

붙여넣은 후에는 아래와 같이 우리 프로젝트에 맞게 고쳐준다.

hello_token_test.js 소스
```js
const HelloToken = artifacts.require("HelloToken");

contract("HelloToken", accounts => {
  
  it("hello", () =>{
    console.log("hello")
  })

  it("hello test", () =>{
    return HelloToken.deploy().then(instance =>{ 
      instance.printHello.then(result =>{
        console.log(result);
      });
    })//then은 비동기 promise 
      //instance안의 함수를 실행시킬 수 있다.
      //버전이 맞지 않아서 경고가 뜰 수 있음.
  })
});
```

위에서 생성해둔 HelloToken.sol에서 아래 소스를 수정 및 추가한다.

HelloToken.sol 소스
```js
pragma solidity >=0.4.21 <0.6.0;

contract HelloToken {
  function HelloToken(){
  }
  //No visibility specified...에러 : public 토큰은 있지만, 접근할 수 없으면 사용할 수 없기 때문에 접근할 수 있도록해줌
  function printHello() public pure returns(string){
    //returns,string타입을 명시
    return "hello"; //목표 : 여기서의 hello가 출력되게 할 것이다.
  }
}
```

실행 : hello가 출력되는지 확인해보자.
cmd에서 를 입력 (이렇게 입력하면 test폴더의 모든 것이 실행됨)
> truffle test

### 5. 가나슈(Ganache)와 메타마스크(Metamask) 연동 & 이더리움 전송

Ganache와 Metamask는 서버와 클라이언트의 관계이다.
- 서버 : Ganache는 로컬 블록체인 서버 이다.
- 클라이언트 : metamask는 블록체인에 토큰을 전송하거나 스마트 컨트랙트를 실행할 수 있는 클라이언트이다. 메타마스크를 이용하여 이더리움 네트워크에 account를 만들 수 있고 토큰을 주고받을 수 있다.

> ganache-cli

설치 : 
> npm install -g ganache-cli (-g: global에 설치)

실행 : 
> ganache-cli로 

### metamask 설치

chrome extension 에서 metamask를 설치한다.

ganache-cli에 있는 account secret 복사하기
(위 cmd에서 accounts, private key를 볼 수 있는데, metamask에 account 등록할 수 있다.)

메타마스크 네트워크 -> 로컬호스트로 바꿔주면 cmd에서는 아래와 같이 변화된다.

**tip** cmd 내용 복사하는 방법
> cmd창 위에서 마우스 오른쪽 클릭 -> 속성에서 빠른편집모드 체크

이후에 metamask에서 계정 가져와서 이더리움 추가

이 프로젝트의 구조
 
> contracts/ : Solidity 컨트랙트 소스 디렉토리
> migrations/ : 이더리움 네트워크에 배포(deploy)할 때 사용되는 JavaScript 파일 디렉토리
> test/ : Application, Contract 테스트 파일 디렉토리
> truffle.js : Truffle configration file

참고: 
-Truffle을 이용한 DApp 개발환경 구성
https://medium.com/@weekly.teckle/truffle%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%9C-dapp-%EA%B0%9C%EB%B0%9C%ED%99%98%EA%B2%BD-%EA%B5%AC%EC%84%B1-14a98dc49db2