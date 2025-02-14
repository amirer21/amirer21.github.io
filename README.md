# server start

> bundle exec jekyll clean

> bundle exec jekyll serve

> bundle exec jekyll serve --trace

## connect

> localhost:4000

## 프로필 설정
> _config.yml 파일


---------------

## sitemap.xml

- Gemfile과 동일한 경로에 sitemap.xml파일 생성
- 생성해주는 사이트 :  https://www.xml-sitemaps.com/

### 경로

- 프로젝트 root 경로



---------------

## favicon 추가

- 빌드에 문제는 없지만, 없다면 다음과 같은 에러가 발생한다.
```error
favicon.ico 404 (not found)
```
- 소스 코드 추가 경로 : /_include/head.html
- 소스 코드 

```html
<link rel="shortcut icon" type="image/vnd.microsoft.icon" href="{{ site.asset_url }}/favicon.ico"/>
```

- 생성해주는 사이트 :  https://www.degraeve.com/favicon/index.php


## Script 추가

### 파일

> /_inculde/haed.html 또는 /_layouts/default.html


## 구글 애스센스 - ads.txt 상태 : 찾을 수 없음

![img](/assets/images/adsense/adstxt.png "ads.txt")

- 해결 

파일 경로 : root경로에 /ads.txt 파일로 위치(Gemfile과 같은 위치)

> 적용 확인 : https://[블로그 주소].github.io/ads.txt

> amirer21.github.io/ads.txt


## comments 기능 추가하기

Gitblog(Jekyll) 에 댓글 기능을 추가해보자.
Github에서 utteranc를 설치해야된다.
그리고 repository는 기본적으로 "public"으로 설정되어있어야한다.
아래 순서에 따라서 설정을 하면 적용된다.

- comments :: utteranc
- link :: https://utteranc.es/

### 순서

(1) Github에서 utteranc 설치하기

(2) utterance client java scirpt 가져오기

- 연결할 repository 설정
![img](/assets/images/gitblog_comments_utterances/gitblog_commets_1.png "utterances")

- 블로그 포스트와 GitHub 이슈 매핑 설정
![img](/assets/images/gitblog_comments_utterances/gitblog_commets_2.png "utterances")

- Theme 설정 및 스크립트 코드 생성
![img](/assets/images/gitblog_comments_utterances/gitblog_commets_3.png "utterances")

(3) posts.html 설정하기
   ```js
   <script src="https://utteranc.es/client.js"
        repo="amirer21/amirer21.github.io"
        issue-term="pathname"
        label="comment"
        theme="github-dark"
        crossorigin="anonymous"
        async>
   </script>
   ```
(4) _config.yml 설정하기

   ```yml
   comments:  
   provider               : "utterances" 
   utterances:
    #repo                 : "amirer21/amirer21.github.io"
    theme                : "github-dark" # "github-light" (default), "github-dark"
    issue_term           
    : "pathname" # "pathname" (default)
    ```

(5) utterances.json 설정하기

   ```json
   {
    "origins": ["https://amirer21.github.io/"]
   }
   ```

(5) 배포해서 확인하기

-------------------------------------------

## 테마 변경(참고)

### _config.yml 
```
minimal_mistakes_skin    : "air"
```

### post.html

```
<script src="https://utteranc.es/client.js"
        repo="amirer21/amirer21.github.io"
        issue-term="pathname"
        label="comment"
        theme="github-air"
        crossorigin="anonymous"
        async>
</script>
```

### _config.yml

```
minimal_mistakes_skin    : "air"
```

## Math, Mermaid 라이브러리 추가

### head.html

### defaul.html

-------------------------------------------

## 폰트(글자체), 폰트 크기 변경 방법 (2024.09.14)

### 폰트 변경

#### 폰트 불러오기
/home/hong/amirer21.github.io/_includes/head/custom.html

#### 폰트 설정
/assets/css/main.scss

### 폰트 크기 변경

- 2px씩 줄임
/_sass/minimal-mistakes/_reset.scss

-------------------------------------------

(2025.02.15)
### ** GitBlog에 Simple-Jekyll-Search 기반 검색 기능 추가**
**Simple-Jekyll-Search**를 사용하여 Jekyll 기반 블로그에 검색 기능을 추가하였습니다.  
아래는 구현된 파일과 주요 변경 사항입니다.

---

## ** 구현 순서**
1. **검색 데이터를 위한 `search.json` 파일 생성**
2. **검색 입력창 및 결과 리스트 UI 추가 (`search.html`)**
3. **검색 스타일 적용 (`search.css`)**
4. **`default.html`에 검색 기능 연동**
5. **Jekyll 설정 파일 수정 (`_config.yml` 등)**
6. **Jekyll 빌드 및 테스트 (`bundle exec jekyll serve`)**

---

## **📂 파일별 코드 설명**
### **1️⃣ `default.html` (레이아웃)**
 **파일:** `/home/hong/amirer21.github.io/_layouts/default.html`  
 **추가 내용:** 검색 입력창과 `Simple-Jekyll-Search` 스크립트 추가  
```html
<input type="text" id="search-input" placeholder="검색어를 입력하세요...">
<ul id="results-container"></ul>
<script src="/assets/js/simple-jekyll-search.min.js"></script>
<script>
  SimpleJekyllSearch({
    searchInput: document.getElementById('search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: '/assets/search.json',
    searchResultTemplate: '<li><a href="{url}">{title}</a></li>',
    noResultsText: '검색 결과가 없습니다.',
    fuzzy: true
  });
</script>
```

---

### **2️⃣ `search.html` (검색 페이지)**
 **파일:** `/home/hong/amirer21.github.io/_pages/search.html`  
 **추가 내용:** 검색 전용 페이지 추가  
```html
---
layout: default
title: 검색
permalink: /search/
---

<h1>검색</h1>
<input type="text" id="search-input" placeholder="검색어를 입력하세요...">
<ul id="results-container"></ul>
```

---

### **3️⃣ `search.css` (검색 스타일)**
 **파일:** `/home/hong/amirer21.github.io/assets/css/search.css`  
 **추가 내용:** 검색창 스타일 추가  
```css
#search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

#results-container {
  list-style: none;
  padding: 0;
}

#results-container li {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

#results-container li a {
  text-decoration: none;
  color: #333;
}
```

---

### **4️⃣ `search.json` (검색 데이터 생성)**
 **파일:** `/home/hong/amirer21.github.io/assets/search.json`  
 **추가 내용:** JSON 파일 자동 생성 (Liquid 사용)  
```liquid
---
layout: null
---

[
  {% for post in site.posts %}
  {
    "title": "{{ post.title | replace: '\"', '\\"' | json_escape }}",
    "url": "{{ post.url | relative_url }}",
    "date": "{{ post.date | date: '%Y-%m-%d' }}",
    "content": "{{ post.content | strip_html | truncatewords: 50 | json_escape }}",
    "tags": "{% if post.tags %}{{ post.tags | join: ', ' | json_escape }}{% else %}null{% endif %}"
  }{% unless forloop.last %},{% endunless %}
  {% endfor %}
]
```
 **설명:**  
- 블로그 글(`site.posts`)을 검색 대상 데이터로 JSON 생성  
- `title`, `url`, `date`, `content`, `tags` 포함  
- JSON에서 특수 문자(`"`, `$`, `:` 등)를 올바르게 Escape 처리  

---

### **5️⃣ `_config.yml` (Jekyll 설정)**
 **파일:**  
- `/home/hong/amirer21.github.io/_config.yml`
- `/home/hong/amirer21.github.io/_config.ko.yml`
- `/home/hong/amirer21.github.io/_config.en.yml`  
 **추가 내용:** `search.json`을 포함하도록 설정  
```yaml
include:
  - assets/search.json
```
 **설명:**  
- Jekyll 빌드시 `search.json`을 `_site/` 디렉토리에 포함하도록 설정  

## **추가 내용 요약약**
- **Simple-Jekyll-Search**를 활용하여 검색 기능 추가  
- **검색 UI 및 JSON 데이터 자동 생성**  

-------------------------------------------

# 설치 방법

### 1. Ruby 및 관련 도구 설치

#### 1.1. Ruby 설치
1. [RubyInstaller](https://rubyinstaller.org/)를 통해 Windows용 Ruby를 설치합니다.
2. 설치 중 "MSYS2 and MINGW development toolchain" 옵션을 선택하여 설치합니다. 이는 이후 gem 설치와 빌드에 필요한 도구들을 포함합니다.

#### 1.2. Bundler 설치
Ruby 설치가 완료되면, 터미널 또는 명령 프롬프트를 열고 다음 명령어로 `bundler`를 설치합니다:

```bash
gem install bundler
```

### 2. Jekyll 프로젝트 설정

#### 2.1. Jekyll 프로젝트 생성
Jekyll 프로젝트를 생성하려면 다음 명령어를 실행합니다:

```bash
jekyll new my-blog
cd my-blog
```

#### 2.2. Gemfile 설정
`Gemfile`은 프로젝트의 의존성을 관리합니다. `Gemfile`을 다음과 같이 설정합니다:

```ruby
source "https://rubygems.org"
gemspec

gem 'jekyll-admin', group: :jekyll_plugins
gem 'jekyll-sitemap'

gem 'rack'
gem 'webrick', '>= 1.7.0'

gem 'wdm', '>= 0.1.0' if Gem.win_platform?
```

### 3. 의존성 설치 및 서버 실행

#### 3.1. Gemfile.lock 파일 삭제 (필요 시)
만약 의존성 충돌이나 문제가 의심된다면, `Gemfile.lock` 파일을 삭제합니다:

```bash
rm Gemfile.lock
```

#### 3.2. 의존성 설치
`bundle install` 명령어를 실행하여 `Gemfile`에 명시된 모든 의존성을 설치합니다:

```bash
bundle install
```

#### 3.3. Jekyll 서버 실행
Jekyll 서버를 실행하여 로컬에서 사이트를 확인합니다:

```bash
bundle exec jekyll serve
```

### 4. 문제 해결

#### 4.1. `Rack::Handler` 관련 오류 해결
`rack`과 `webrick`이 제대로 설치되지 않았거나 충돌이 발생할 경우, 다음 단계를 통해 해결할 수 있습니다:

1. `rack`과 `webrick`을 명시적으로 재설치:

   ```bash
   gem uninstall rack webrick
   gem install rack webrick
   ```

2. `bundle install`을 다시 실행하여 모든 의존성을 설치합니다.

3. `jekyll-admin`을 비활성화하여 문제가 `jekyll-admin`에서 발생하는지 확인합니다. 필요시 `Gemfile`에서 `jekyll-admin`을 주석 처리합니다:

   ```ruby
   # gem 'jekyll-admin', group: :jekyll_plugins
   ```

4. `--trace` 옵션을 사용하여 Jekyll을 실행하고 추가적인 디버깅 정보를 얻습니다:

   ```bash
   bundle exec jekyll serve --trace
   ```

### 5. 추가 팁
- `Gemfile.lock`을 삭제하고 gem들을 다시 설치하는 방법은 자주 유용합니다.
- `bundle update` 명령어를 사용하여 모든 gem을 최신 버전으로 업데이트할 수 있습니다.
- Ruby와 Jekyll의 호환성을 확인하여 최신 버전의 Ruby와 Jekyll이 호환되는지 확인하세요.

--------------------------

# [Minimal Mistakes Jekyll theme](https://mmistakes.github.io/minimal-mistakes/)

[![LICENSE](https://img.shields.io/badge/license-MIT-lightgrey.svg)](https://raw.githubusercontent.com/mmistakes/minimal-mistakes/master/LICENSE)
[![Jekyll](https://img.shields.io/badge/jekyll-%3E%3D%203.7-blue.svg)](https://jekyllrb.com/)
[![Ruby gem](https://img.shields.io/gem/v/minimal-mistakes-jekyll.svg)](https://rubygems.org/gems/minimal-mistakes-jekyll)
[![Tip Me via PayPal](https://img.shields.io/badge/PayPal-tip%20me-green.svg?logo=paypal)](https://www.paypal.me/mmistakes)
[![Donate to this project using Buy Me A Coffee](https://img.shields.io/badge/buy%20me%20a%20coffee-donate-yellow.svg)](https://www.buymeacoffee.com/mmistakes)

Minimal Mistakes is a flexible two-column Jekyll theme, perfect for building personal sites, blogs, and portfolios. As the name implies, styling is purposely minimalistic to be enhanced and customized by you :smile:.

:sparkles: See what's new in the [CHANGELOG](CHANGELOG.md).

**If you enjoy this theme, please consider sponsoring:**

[!["Buy Me A Coffee"](https://user-images.githubusercontent.com/1376749/120938564-50c59780-c6e1-11eb-814f-22a0399623c5.png)](https://www.buymeacoffee.com/mmistakes)
 [![Support via PayPal](https://cdn.jsdelivr.net/gh/twolfson/paypal-github-button@1.0.0/dist/button.svg)](https://www.paypal.me/mmistakes)

**Note:** The theme uses the [jekyll-include-cache](https://github.com/benbalter/jekyll-include-cache) plugin which will need to be installed in your `Gemfile` and added to the `plugins` array of `_config.yml`. Otherwise you'll encounter `Unknown tag 'include_cached'` errors at build.

[![Minimal Mistakes live preview][2]][1]

[1]: https://mmistakes.github.io/minimal-mistakes/
[2]: screenshot.png (live preview)

![layout examples](screenshot-layouts.png)

## Notable features

- Bundled as a "theme gem" for easier installation/upgrading.
- Compatible with GitHub Pages.
- Support for Jekyll's built-in Sass/SCSS preprocessor.
- Nine different skins (color variations).
- Several responsive layout options (single, archive index, search, splash, and paginated home page).
- Optimized for search engines with support for [Twitter Cards](https://dev.twitter.com/cards/overview) and [Open Graph](http://ogp.me/) data.
- Optional [header images](https://mmistakes.github.io/minimal-mistakes/docs/layouts/#headers), [custom sidebars](https://mmistakes.github.io/minimal-mistakes/docs/layouts/#sidebars), [table of contents](https://mmistakes.github.io/minimal-mistakes/docs/helpers/#table-of-contents), [galleries](https://mmistakes.github.io/minimal-mistakes/docs/helpers/#gallery), related posts, [breadcrumb links](https://mmistakes.github.io/minimal-mistakes/docs/configuration/#breadcrumb-navigation-beta), [navigation lists](https://mmistakes.github.io/minimal-mistakes/docs/helpers/#navigation-list), and more.
- Commenting support (powered by [Disqus](https://disqus.com/), [Facebook](https://developers.facebook.com/docs/plugins/comments), Google+, [Discourse](https://www.discourse.org/), static-based via [Staticman](https://staticman.net/), and [utterances](https://utteranc.es/)).
- [Google Analytics](https://www.google.com/analytics/) support.
- UI localized text in English (default), Arabic (عربي), Brazilian Portuguese (Português brasileiro), Catalan, Chinese, Danish, Dutch, Finnish, French (Français), German (Deutsch), Greek, Hebrew, Hindi (हिंदी), Hungarian, Indonesian, Irish (Gaeilge), Italian (Italiano), Japanese, Korean, Malayalam, Myanmar (Burmese), Nepali (Nepalese), Norwegian (Norsk), Persian (فارسی), Polish, Punjabi (ਪੰਜਾਬੀ), Romanian, Russian, Slovak, Spanish (Español), Swedish, Thai, Turkish (Türkçe), and Vietnamese.

## Skins (color variations)

This theme comes in nine different skins (in addition to the default one).

| `air` | `contrast` | `dark` |
| --- | --- | --- |
| [![air skin](https://mmistakes.github.io/minimal-mistakes/assets/images/air-skin-archive.png)](https://mmistakes.github.io/minimal-mistakes/assets/images/air-skin-archive-large.png) | [![contrast skin](https://mmistakes.github.io/minimal-mistakes/assets/images/contrast-skin-archive.png)](https://mmistakes.github.io/minimal-mistakes/assets/images/contrast-skin-archive-large.png) | [![dark skin](https://mmistakes.github.io/minimal-mistakes/assets/images/dark-skin-archive.png)](https://mmistakes.github.io/minimal-mistakes/assets/images/dark-skin-archive-large.png) |

| `dirt` | `mint` | `sunrise` |
| --- | --- | --- |
| [![dirt skin](https://mmistakes.github.io/minimal-mistakes/assets/images/dirt-skin-archive.png)](https://mmistakes.github.io/minimal-mistakes/assets/images/dirt-skin-archive-large.png) | [![mint skin](https://mmistakes.github.io/minimal-mistakes/assets/images/mint-skin-archive.png)](https://mmistakes.github.io/minimal-mistakes/assets/images/mint-skin-archive-large.png) | [![sunrise skin](https://mmistakes.github.io/minimal-mistakes/assets/images/sunrise-skin-archive.png)](https://mmistakes.github.io/minimal-mistakes/assets/images/sunrise-skin-archive-large.png) |

| `aqua` | `neon` | `plum` |
| --- | --- | --- |
| [![aqua skin](https://mmistakes.github.io/minimal-mistakes/assets/images/aqua-skin-archive.png)](https://mmistakes.github.io/minimal-mistakes/assets/images/aqua-skin-archive-large.png) | [![neon skin](https://mmistakes.github.io/minimal-mistakes/assets/images/neon-skin-archive.png)](https://mmistakes.github.io/minimal-mistakes/assets/images/neon-skin-archive-large.png) | [![plum skin](https://mmistakes.github.io/minimal-mistakes/assets/images/plum-skin-archive.png)](https://mmistakes.github.io/minimal-mistakes/assets/images/plum-skin-archive-large.png) |

## Demo pages

| Name                                        | Description                                           |
| ------------------------------------------- | ----------------------------------------------------- |
| [Post with Header Image][header-image-post] | A post with a large header image. |
| [HTML Tags and Formatting Post][html-tags-post] | A variety of common markup showing how the theme styles them. |
| [Syntax Highlighting Post][syntax-post] | Post displaying highlighted code. |
| [Post with a Gallery][gallery-post] | A post showing several images wrapped in `<figure>` elements. |
| [Sample Collection Page][sample-collection] | Single page from a collection. |
| [Categories Archive][categories-archive] | Posts grouped by category. |
| [Tags Archive][tags-archive] | Posts grouped by tag. |

Additional sample posts are available under [posts archive][year-archive] on the demo site. Source files for these (and the entire demo site) can be found in [`/docs`](docs).

[header-image-post]: https://mmistakes.github.io/minimal-mistakes/layout-header-image-text-readability/
[gallery-post]: https://mmistakes.github.io/minimal-mistakes/post%20formats/post-gallery/
[html-tags-post]: https://mmistakes.github.io/minimal-mistakes/markup/markup-html-tags-and-formatting/
[syntax-post]: https://mmistakes.github.io/minimal-mistakes/markup-syntax-highlighting/
[sample-collection]: https://mmistakes.github.io/minimal-mistakes/recipes/chocolate-chip-cookies/
[categories-archive]: https://mmistakes.github.io/minimal-mistakes/categories/
[tags-archive]: https://mmistakes.github.io/minimal-mistakes/tags/
[year-archive]: https://mmistakes.github.io/minimal-mistakes/year-archive/

## Installation

There are three ways to install: as a [gem-based theme](https://jekyllrb.com/docs/themes/#understanding-gem-based-themes), as a [remote theme](https://blog.github.com/2017-11-29-use-any-theme-with-github-pages/) (GitHub Pages compatible), or forking/directly copying all of the theme files into your project.

### Gem-based method

With Gem-based themes, directories such as the `assets`, `_layouts`, `_includes`, and `_sass` are stored in the theme’s gem, hidden from your immediate view. Yet all of the necessary directories will be read and processed during Jekyll’s build process.

This allows for easier installation and updating as you don't have to manage any of the theme files. To install:

1. Add the following to your `Gemfile`:

   ```ruby
   gem "minimal-mistakes-jekyll"
   ```

2. Fetch and update bundled gems by running the following [Bundler](http://bundler.io/) command:

   ```bash
   bundle
   ```

3. Set the `theme` in your project's Jekyll `_config.yml` file:

   ```yaml
   theme: minimal-mistakes-jekyll
   ```

To update the theme run `bundle update`.

### Remote theme method

Remote themes are similar to Gem-based themes, but do not require `Gemfile` changes or whitelisting making them ideal for sites hosted with GitHub Pages.

To install:

1. Create/replace the contents of your `Gemfile` with the following:

   ```ruby
   source "https://rubygems.org"

   gem "github-pages", group: :jekyll_plugins
   gem "jekyll-include-cache", group: :jekyll_plugins
   ```

2. Add `jekyll-include-cache` to the `plugins` array of your `_config.yml`.

3. Fetch and update bundled gems by running the following [Bundler](http://bundler.io/) command:

   ```bash
   bundle
   ```

4. Add `remote_theme: "mmistakes/minimal-mistakes@4.23.0"` to your `_config.yml` file. Remove any other `theme:` or `remote_theme:` entry.

**Looking for an example?** Use the [Minimal Mistakes remote theme starter](https://github.com/mmistakes/mm-github-pages-starter/generate) for the quickest method of getting a GitHub Pages hosted site up and running. Generate a new repository from the starter, replace sample content with your own, and configure as needed.

## Usage

For detailed instructions on how to configure, customize, add/migrate content, and more read the [theme's documentation](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/).

---

## Contributing

Found a typo in the documentation or interested in [fixing a bug](https://github.com/mmistakes/minimal-mistakes/issues)? Then by all means [submit an issue](https://github.com/mmistakes/minimal-mistakes/issues/new) or [pull request](https://help.github.com/articles/using-pull-requests/). If this is your first pull request, it may be helpful to read up on the [GitHub Flow](https://guides.github.com/introduction/flow/) first.

For help with using the theme or general Jekyll support questions, please use the [Jekyll Talk forums](https://talk.jekyllrb.com/).

### Pull Requests

When submitting a pull request:

1. Clone the repo.
2. Create a branch off of `master` and give it a meaningful name (e.g. `my-awesome-new-feature`).
3. Open a pull request on GitHub and describe the feature or fix.

Theme documentation and demo pages can be found in the [`/docs`](docs) if submitting improvements, typo corrections, etc.

## Development

To set up your environment to develop this theme, run `bundle install`.

To test the theme, run `bundle exec rake preview` and open your browser at `http://localhost:4000/test/`. This starts a Jekyll server using content in the `test/` directory. As modifications are made to the theme and test site, it will regenerate and you should see the changes in the browser after a refresh.

---

## Credits

### Creator

**Michael Rose**

- <https://mademistakes.com>
- <https://twitter.com/mmistakes>
- <https://github.com/mmistakes>

### Icons + Demo Images:

- [The Noun Project](https://thenounproject.com) -- Garrett Knoll, Arthur Shlain, and [tracy tam](https://thenounproject.com/tracytam)
- [Font Awesome](http://fontawesome.io/)
- [Unsplash](https://unsplash.com/)

### Other:

- [Jekyll](http://jekyllrb.com/)
- [jQuery](http://jquery.com/)
- [Susy](http://susy.oddbird.net/)
- [Breakpoint](http://breakpoint-sass.com/)
- [Magnific Popup](http://dimsemenov.com/plugins/magnific-popup/)
- [FitVids.JS](http://fitvidsjs.com/)
- [GreedyNav.js](https://github.com/lukejacksonn/GreedyNav)
- [Smooth Scroll](https://github.com/cferdinandi/smooth-scroll)
- [Gumshoe](https://github.com/cferdinandi/gumshoe)
- [jQuery throttle / debounce](http://benalman.com/projects/jquery-throttle-debounce-plugin/)
- [Lunr](http://lunrjs.com)

---

## License

The MIT License (MIT)

Copyright (c) 2013-2020 Michael Rose and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Minimal Mistakes incorporates icons from [The Noun Project](https://thenounproject.com/) 
creators Garrett Knoll, Arthur Shlain, and tracy tam.
Icons are distributed under Creative Commons Attribution 3.0 United States (CC BY 3.0 US).

Minimal Mistakes incorporates [Font Awesome](http://fontawesome.io/),
Copyright (c) 2017 Dave Gandy.
Font Awesome is distributed under the terms of the [SIL OFL 1.1](http://scripts.sil.org/OFL) 
and [MIT License](http://opensource.org/licenses/MIT).

Minimal Mistakes incorporates photographs from [Unsplash](https://unsplash.com).

Minimal Mistakes incorporates [Susy](http://susy.oddbird.net/),
Copyright (c) 2017, Miriam Eric Suzanne.
Susy is distributed under the terms of the [BSD 3-clause "New" or "Revised" License](https://opensource.org/licenses/BSD-3-Clause).

Minimal Mistakes incorporates [Breakpoint](http://breakpoint-sass.com/).
Breakpoint is distributed under the terms of the [MIT/GPL Licenses](http://opensource.org/licenses/MIT).

Minimal Mistakes incorporates [FitVids.js](https://github.com/davatron5000/FitVids.js/),
Copyright (c) 2013 Dave Rubert and Chris Coyier.
FitVids is distributed under the terms of the [WTFPL License](http://www.wtfpl.net/).

Minimal Mistakes incorporates [Magnific Popup](http://dimsemenov.com/plugins/magnific-popup/),
Copyright (c) 2014-2016 Dmitry Semenov, http://dimsemenov.com.
Magnific Popup is distributed under the terms of the MIT License.

Minimal Mistakes incorporates [Smooth Scroll](http://github.com/cferdinandi/smooth-scroll),
Copyright (c) 2019 Chris Ferdinandi.
Smooth Scroll is distributed under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Minimal Mistakes incorporates [Gumshoejs](http://github.com/cferdinandi/gumshoe),
Copyright (c) 2019 Chris Ferdinandi.
Smooth Scroll is distributed under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Minimal Mistakes incorporates [jQuery throttle / debounce](http://benalman.com/projects/jquery-throttle-debounce-plugin/),
Copyright (c) 2010 "Cowboy" Ben Alman.
jQuery throttle / debounce is distributed under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Minimal Mistakes incorporates [GreedyNav.js](https://github.com/lukejacksonn/GreedyNav),
Copyright (c) 2015 Luke Jackson.
GreedyNav.js is distributed under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Minimal Mistakes incorporates [Jekyll Group-By-Array](https://github.com/mushishi78/jekyll-group-by-array),
Copyright (c) 2015 Max White <mushishi78@gmail.com>.
Jekyll Group-By-Array is distributed under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Minimal Mistakes incorporates [@allejo's Pure Liquid Jekyll Table of Contents](https://allejo.io/blog/a-jekyll-toc-in-liquid-only/),
Copyright (c) 2017 Vladimir Jimenez.
Pure Liquid Jekyll Table of Contents is distributed under the terms of the [MIT License](http://opensource.org/licenses/MIT).

Minimal Mistakes incorporates [Lunr](http://lunrjs.com),
Copyright (c) 2018 Oliver Nightingale.
Lunr is distributed under the terms of the [MIT License](http://opensource.org/licenses/MIT).
