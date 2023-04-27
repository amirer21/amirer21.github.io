---
title: 리눅스 명령어 - & vs &&
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- linux
toc: true
toc_sticky: true
toc_label: 목차
description: 리눅스 명령어 - & vs &&
article_tag1: linux
article_tag2: &
article_tag3: &&
article_section:  
meta_keywords: linux, &&
last_modified_at: '2019-08-23 10:00:00 +0800'
---

### 리눅스 명령어
- & : & 앞의 명령어는 백그라운드실행 +  & 뒤의 명령어를 실행
- && : & 앞의 명령어가 성공 후 & 뒤의 명령어를 실행
- ; : & 앞의 명령어가 실패해도 & 뒤의 명령를 실행

&&의 의미
&&는 앞의 명령어가 실행되었을 때 성공한 경우에 다음 명령어를 실행합니다. ;와는 다릅니다. 예를들어보죠. 아래와 같은 명령어가 있을 때
1	mkdir test; cd test; touch abc
test 디렉토리가 이미 있어서 아래와 같은 상황이라고 해보죠. 
mkdir test(실패); cd test; touch abc
이 경우 cd test가 실행되고, touch abc도 실행됩니다. 
 
반면에 아래의 경우는 cd test와 touch abc가 실행되지 않습니다. 
mkdir test(실패) && cd test && touch abc
성공&실패와 무관하게 연속적으로 실행해야 할 명령이 있을 때 ;를 씁니다. 이전 명령이 성공했을 때 다음 명령을 실행하려면 &&를 씁니다. 대체로 &&를 쓰는게 좋을 때가 많습니다. 좀 더 정확하게는 &&는 이전 명령어의 실행결과가 참(true)일 때만 다음 명령을 실행합니다. 아래 내용은 참고삼아 읽어보세요. 

## & vs &&

> mkdir test & cd test

>(1) & (2)

(1) 백그라운드로 test 디렉토리를 생성하면서 (2) 동시에 test 디렉토리로 이동하게되므로 & 뒤에 명령어가 실행될 수 없다.

> mkdir test && cd test

>(1) && (2)
이전 명령이 성공했을 때에만 다음 명령을 실행하려면 &&를 사용한다.

성공, 실패와 상관없이 연속적으로 실행해야 할 명령이 있을 때 ;를 쓴다. 