---
title: "카테고리별 연도별 목차"
permalink: /posts/toc.html
layout: single
author_profile: true
---

<ul>
  {%- assign posts_ko = site.posts | where_exp: "post", "post.path contains '/ko/'" -%}
  {%- assign catlist = "" | split: "" -%}
  {%- for post in posts_ko -%}
    {%- for cat in post.categories -%}
      {%- assign catlist = catlist | push: cat -%}
    {%- endfor -%}
  {%- endfor -%}
  {%- assign categories = catlist | uniq | sort -%}
  {%- for cat in categories %}
    {% if cat != "" %}
      <li>
        <strong>{{ cat }}</strong>
        <ul>
          {%- assign posts_in_cat = posts_ko | where_exp: "post", "post.categories contains cat" -%}
          {%- assign yearlist = "" | split: "" -%}
          {%- for post in posts_in_cat -%}
            {%- assign year = post.date | date: "%Y" -%}
            {%- assign yearlist = yearlist | push: year -%}
          {%- endfor -%}
          {%- assign years = yearlist | uniq | sort | reverse -%}
          {%- for year in years %}
            <li>
              <span style="font-weight:bold; color:#555;">{{ year }}</span>
              <ul>
                {%- for post in posts_in_cat %}
                  {% assign post_year = post.date | date: "%Y" %}
                  {% if post_year == year %}
                    <li><a href="{{ post.url }}">{{ post.title }}</a></li>
                  {% endif %}
                {%- endfor %}
              </ul>
            </li>
          {%- endfor %}
        </ul>
      </li>
    {% endif %}
  {%- endfor %}
</ul>
