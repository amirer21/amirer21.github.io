---
title: Blockchain 토큰 만들기 & 지갑 전송 실습 예제
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
article_tag1: blockchain
article_tag2: geth
article_tag3: remix
article_section: blockchain
meta_keywords: geth, remix, metamask
last_modified_at: '2022-03-24 14:00:00 +0800'
---

## 에러 : Cannot start service peer0.org2.example.com: driver failed programming external

 ![img](/assets/images/hyperledger/1.hyperledger.jpg "hyperledger")

https://stackoverflow.com/questions/49334173/cannot-create-container-for-hyperledger-service-windows-10

### 도커 재시작 제안

#### 도커 restart 명령어

Run this command to list all the services:
sudo systemctl list-units --type=service
Look for the correct Docker service name (in my case it is snap.docker.dockerd.service) then run:
> sudo systemctl restart snap.docker.dockerd.service

https://stackoverflow.com/questions/43569781/unable-to-start-docker-service-with-error-failed-to-start-docker-service-unit


![img](/assets/images/hyperledger/2.hyperledger.jpg "hyperledger")

```cmd
Creating peer1.org2.example.com ... done
Creating peer1.org1.example.com ... done
Creating peer0.org1.example.com ... done
Creating peer0.org2.example.com ... done
```
잘 생성되었다…

![img](/assets/images/hyperledger/3.hyperledger.jpg "hyperledger")
