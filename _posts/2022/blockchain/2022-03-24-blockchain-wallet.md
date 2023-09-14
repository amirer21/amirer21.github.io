---
title: Blockchain ERC20 토큰 만들기 & 지갑 전송 실습 예제
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Blockchain
toc: true
toc_sticky: true
toc_label: 목차
description: Geth, Remix(Web IDE), Metamask(Wallet) 연동
article_tag1: Blockchain
article_tag2: geth
article_tag3: remix
article_section: Blockchain
meta_keywords: geth, remix, metamask
last_modified_at: '2022-03-24 14:00:00 +0800'
---

## ERC20 토큰 만들기 & 지갑 전송 실습 예제

### Geth, Remix(Web IDE), Metamask(Wallet) 연동

##### - 주의 : 아래 예제는 로컬 환경에서 Geth 구동한 실습 예제입니다. 지갑에 대한 주소, 비밀번호 등은 안전한 방식으로 보관하여야 합니다. 실습 진행에 있어서 경제적 손실이 발생하는 경우 책임지지 않습니다.

## 1. Geth 설치

### (1) Genesis block 생성 (genesis.json)

```json
{
"config": {
        "chainId": 1234,
        "homesteadBlock": 0,
        "eip155Block": 0,
        "eip158Block": 0
          },
"difficulty" : "0x20000",
"gasLimit"   : "0x2fefd8",
"alloc"      : {},
"coinbase"   : "0x0000000000000000000000000000000000000000",
"extraData"  : "",
"nonce"      : "0x0000000000000000",
"mixhash"    : "0x0000000000000000000000000000000000000000000000000000000000000000",
"parentHash" : "0x0000000000000000000000000000000000000000000000000000000000000000",
"timestamp"  : "0x00"
}
```

### (2) json 파일 생성 경로
 ![img](/assets/images/geth/1.metamask.png "geth")

### - Geth cli 명령어 실행창 실행
 
> geth attach http://localhost:8545

![img](/assets/images/geth/2.metamask.jpg "geth")

#### - 지갑 주소 생성
> personal.newAccount("password");

#### - 잔액 조회
>eth.getBalance(eth.accounts[주소인덱스]);

#### - 코인베이스
> eth.coinbase; 
 
 ![img](/assets/images/geth/3.metamask.jpg "geth")



--------------


## 2. 메타마스크
### (1) 네트워크 연결

geth에 대한 설정값은 기본 값으로 설정이 되어있다.
그러므로 설정을 해야되는 부분은 체인ID뿐이다.
체인 아이디는 geth를 처음 구성할 때 설정한 값을 넣어준다. ex:1234
  
![img](/assets/images/geth/4.metamask.png "geth")

### (2) 주소 가져오기
생성된 JSON 파일, 비밀번호는 personal.newAccount(“비밀번호"); 에 입력한 비밀번호
 
![img](/assets/images/geth/5.metamask.jpg "geth")

### (3) 키 파일 경로
주소 정보는 geth keystore 폴더에 있다.

![img](/assets/images/geth/6.metamask.jpg "geth")

### 결과
![img](/assets/images/geth/7.wallet.png "geth")


---------------

## 3. ERC20 소스코드

간단한 ERC20 토큰 생성 코드

```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ImbToken { 

    //Creates an array with all balances
    mapping (address => uint256) public balanceOf;
    uint8 public decimals;  // 토큰을 얼마나 나눌 수 있는지 나타냄(소수점)
    string public name;     // 토큰 이름 설정
    string public symbol;   // 토큰 기호 설정

    //Initializes contract with initial supply tokens to the creator of the contract
    constructor (uint256 initialSupply) {
        balanceOf[msg.sender] = initialSupply;
        decimals = 0;         // 기본적으로 0 ~ 18 까지 나눔
        name = "IMB Token";    // 토큰 이름 입력
        symbol = "IMB";       // 토큰 기호 입력
    }
    
    //Send Tokens
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] > _value);
        require(balanceOf[_to] + _value > balanceOf[_to]);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        return true;
    }
    
    function burn(uint256 _value) public returns (bool success) { //token소각(_value 소각할 양)
        require(balanceOf[msg.sender] >= _value); //보낸사람의 자산이 충분한지 확인
        balanceOf[msg.sender] -= _value; // 발신자의 자산에서 뺌
        return true;
    }    
}  
```

## 4. remix에 geth 연동 
ENVIRONMENT는 Injected Web로 설정.
주소값은 가져온다.

 ![img](/assets/images/geth/8.wallet.png "geth")

Deploy로 Contract 배포하면 geth에 로그로 표시된다.
> 0xa6B06BF421bC690fe8e742a3f177B969D801eaB7
 
INFO [03-24|14:15:41.527] Submitted contract creation              fullhash=0xa88e938ad1bf0cf2541df40a43729cd9f3318062d0e71ef4aff925ce8b4de630 contract=0xa6B06BF421bC690fe8e742a3f177B969D801eaB7

![img](/assets/images/geth/9.wallet.png "geth")