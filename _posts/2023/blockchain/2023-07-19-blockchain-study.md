---
title: Python으로 공부하는 블록체인 (1) 블록체인이란?
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
description: Blockchain
article_tag1: python
article_tag2: blockchain
article_tag3: 
article_section: blockchain
meta_keywords: python, blockchain
last_modified_at: '2023-07-19 21:00:00 +0800'
---

## 블록체인이란?

'블록체인', 이름만 살펴보면 무언가 블록이 사슬처럼 연결되어 있는 것이라고 생각해볼 수 있다. 실제로 블록체인에서 블록에는 데이터가 저장되어 있고, 블록은 이전 블록과 연결되어 있다.

블록체인은 암호학 알고리즘을 통해서 데이터를 담은 블록들이 연결되고 데이터를 분산 처리하는 기술이다. 비트코인, 이더리움 등에서 기본적으로 데이터를 분산 처리하는 구조는 비슷하지만 세부적으로 블록 생성, 블록 데이터, 증명 방식 등에서 차이가 있다.

블록체인의 동작 구조에서는 해시값을 구하는 알고리즘이 포함되어 있지만, 여기에서는 간단하게 블록을 구조를 이해해보자.

Block 이라는 클래스에 파이썬의 __init__ 메서드를 통해  self.속성(val)에 값(data)을 할당한다.' 블록에 데이터를 담아서 next 메서드를 통해 이어간다.


[소스코드 바로가기](https://github.com/amirer21/python-exam/tree/main/blockChain/simpleChain "소스코드 바로가기")

```py
class Block:
    ''' 블록체인의 블록을 구현한 클래스 '''
    def __init__(self, data):
        self.val = data
        self.next = None

def print_block(block):
    while block is not None:
        print(block.val)
        block = block.next

if __name__ == '__main__':    
    block = Block(1) # 첫 번째 블록 생성
    block.next = Block(2) # 두 번째 블록 생성. 첫 번째 블록의 다음 블록으로 생성
    block.next.next = Block(3) # 계속 연결
    block.next.next.next = Block(4)

    print_block(block)
```

