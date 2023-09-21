---
title: Gitblog - (Error) bundle exec jekyll serve
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Error
toc: true
toc_sticky: true
toc_label: 목차
description: Gitblog - solve to bundle exec jekyll serve Error
article_tag1: gitblog
article_tag2: error
article_tag3: resolve
article_section: Error
meta_keywords: gitblog, error, resolve
last_modified_at: '2023-09-22 21:00:00 +0800'
---

# gitblog, bundle exec jekyll serve 에러 해결
- 에러 (1) : "vs code 'bundle'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다."
- 에러 (2) "bundle install 에러" : "Could not find jekyll-admin-0.11.1, jekyll-sitemap-1.4.0, jekyll-4.3.1, jekyll-feed-0.17.0, jekyll-include-cache-0.2.1, rouge-4.0.1, listen-3.7.1 in locally installed gems"


## 에러 발생

### 실행 내용
그동안 잘 실행되던 jekyll가 갑자기 실행되지 않았다.

> bundle exec jekyll serve

## 에러 (1)
```
vs code 'bundle'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다.
```

### 루비 설치 확인
> $ruby -v 

루비 버전도 나오지 않았다.
어딘가 경로 설정이나 파일이 사라진 것 같다. 정확한 원인은 모르지만, 재설치 해보기로함.

## 해결

#### ruby 재설치(다운로드 Ruby+Devkit 3.1.4 )
> 접속 https://rubyinstaller.org/downloads/

> $ruby -v
```
ruby 3.1.4p223 (2023-03-30 revision 957bb7cb81) [x64-mingw-ucrt]
```

### jekyll 설치
> gem install jekyll

Ruby gem은 루비 언어에서 사용하는 패키지 매니저
설치가 오래걸림...

### 설치 확인
> jekyll -v
```
출력 : jekyll 4.3.2
```

>gem install bundler

gem은 실행시키기 위한 파일들을 모아서 관리를 지원해준다.
```
출력 :
Fetching bundler-2.4.19.gem
Successfully installed bundler-2.4.19
Parsing documentation for bundler-2.4.19
Installing ri documentation for bundler-2.4.19
Done installing documentation for bundler after 0 seconds
1 gem installed
```

### 다시 실행해보자.

> $bundle exec jekyll serve
```
에러 발생:
Could not find jekyll-admin-0.11.1, jekyll-sitemap-1.4.0, jekyll-4.3.1, jekyll-paginate-1.1.0, jekyll-gist-1.5.0, jekyll-feed-0.17.0, jekyll-include-cache-0.2.1, sinatra-3.0.5, sinatra-contrib-3.0.5, addressable-2.8.1, i18n-1.12.0, liquid-4.0.3, rouge-4.0.1, webrick-1.7.0, octokit-4.25.1, mustermann-3.0.0, rack-2.2.4, rack-protection-3.0.5, tilt-2.0.11, multi_json-1.15.0, public_suffix-5.0.1, concurrent-ruby-1.1.10, listen-3.7.1, unicode-display_width-2.3.0, faraday-2.7.2, sawyer-0.9.2, faraday-net_http-3.0.2 in locally installed gems
Run `bundle install` to install missing gems.
```

### bundle gem 도구 설치
> bundle install 명령어로 설치

## 에러 (2) bundle install 에서도 에러 발생

## 해결
### gem update
>  gem update --system

> gem -v
```
3.4.19
```

### 다시 한번 실행하여 확인해본다.

> $bundle exec jekyll serve
```
Could not find jekyll-admin-0.11.1, jekyll-sitemap-1.4.0, jekyll-4.3.1, jekyll-feed-0.17.0, jekyll-include-cache-0.2.1, rouge-4.0.1, listen-3.7.1 in locally installed gems
Run `bundle install` to install missing gems.
```

### 필요한 것들을 다시 설치해보자.
> $bundle install
```
Fetching gem metadata from https://rubygems.org/...........
Using rake 13.0.6
Using bundler 2.4.1
Using public_suffix 5.0.1
Using ruby2_keywords 0.0.5...
.
.
.
```

이전에는 $ bundle install 을 실행하면 에러가 났었는데 잘 설치된다.

### 서버 실행
> $bundle exec jekyll serve

정상적으로 잘 실행되었다.