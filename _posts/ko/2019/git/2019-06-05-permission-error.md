---
title: Ubuntu git pull error
layout: single
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Git
tags:
- Git
toc: true
toc_sticky: true
toc_label: 목차
description: Ubuntu git pull error
article_tag1: ubuntu
article_tag2: git
article_tag3: error
article_section:  
meta_keywords: ubuntu, git, error
last_modified_at: '2019-06-05 10:00:00 +0800'
---

## 에러 내용 error: insufficient permission for adding an object to repository database .git/objects

```
error: insufficient permission for adding an object to repository database .git/objects
fatal: failed to write object
fatal: unpack-objects failed
```

## 해결 
> sudo chmod 777 -R .git/