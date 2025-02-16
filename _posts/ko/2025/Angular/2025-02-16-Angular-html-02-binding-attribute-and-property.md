---
title: Angular - 2 - HTML 속성 바인딩(Property Binding)과 일반 바인딩의 차이
author_profile: true
read_time: true
comments: true
share: true
related: true
categories:
- Angular
tags:
- Angular
- binding
- html
toc: true
toc_sticky: true
toc_label: 목차
description: Angular HTML 속성 바인딩(Property Binding)과 일반 바인딩의 차이
article_tag1: Angular
article_tag2: Framework
article_tag3: html
article_section: Angular
meta_keywords: Angular, html
last_modified_at: '2025-02-16 21:00:00 +0800'
---


### 🔹 **Angular에서 속성 바인딩(Property Binding)과 일반 바인딩의 차이**

Angular에서는 HTML 요소의 속성을 바인딩할 때 **속성 바인딩(Property Binding)**과 **일반 바인딩(Attribute Binding)** 두 가지 방식이 있습니다. 이 두 가지는 동작 방식과 사용처가 다릅니다.

---

## 🔹 1. **속성 바인딩 (Property Binding) - `[property]`**
### ✅ **설명**
- HTML 요소의 **DOM 속성(DOM Property)**에 데이터를 바인딩하는 방식입니다.
- Angular에서 직접 DOM을 조작하여 속성 값을 변경합니다.
- **`[]` (대괄호) 안에 변수명을 넣어 사용**합니다.

### ✅ **사용법**
```html
<input [value]="inputValue">
<img [src]="imageUrl">
<button [disabled]="isDisabled">클릭 불가</button>
```

```typescript
export class AppComponent {
  inputValue = '초기값';
  imageUrl = 'https://example.com/photo.jpg';
  isDisabled = true;
}
```

📌 **결과:**  
- `input` 필드에 `inputValue`의 값이 설정됩니다.
- `img` 태그의 `src`가 `imageUrl` 값으로 설정됩니다.
- `button`이 `disabled=true`로 설정되어 클릭할 수 없습니다.

---

## 🔹 2. **일반 바인딩 (Attribute Binding) - `attr.`**
### ✅ **설명**
- HTML 태그의 **일반 속성(attribute)**에 값을 바인딩하는 방식입니다.
- HTML 자체에 적용되는 속성을 변경할 때 사용됩니다.
- **`attr.` 접두사를 사용하여 속성을 지정**합니다.

### ✅ **사용법**
```html
<td [attr.colspan]="colSpanValue">테이블 셀</td>
<p [attr.data-info]="infoData">데이터 속성</p>
```

```typescript
export class AppComponent {
  colSpanValue = 2;
  infoData = '속성 정보';
}
```

📌 **결과:**  
- `<td>` 요소의 `colspan` 속성이 `2`로 설정됩니다.
- `<p>` 요소의 `data-info` 속성이 `속성 정보`로 설정됩니다.

---

## 🔹 3. **속성 바인딩 vs 일반 바인딩 차이점**

| 비교 항목 | 속성 바인딩 (Property Binding) | 일반 바인딩 (Attribute Binding) |
|-----------|---------------------------------|----------------------------------|
| 바인딩 대상 | DOM 속성 (Property) | HTML 속성 (Attribute) |
| 적용 방식 | Angular가 DOM을 직접 변경 | HTML 속성을 직접 변경 |
| 기호 | `[속성]` | `[attr.속성]` |
| 사용 예시 | `[value]="변수명"`, `[disabled]="true"` | `[attr.colspan]="2"`, `[attr.data-info]="값"` |
| 동적 변화 | 즉시 반영됨 | 주로 초기 렌더링 시 설정됨 |
| 예제 | `<input [value]="name">` | `<td [attr.colspan]="2">` |

---

## 🔹 4. **속성 바인딩과 일반 바인딩의 차이점 예제**

### ✅ 1) **속성 바인딩 예제**
```html
<input [value]="inputValue">
<button [disabled]="isDisabled">비활성화 버튼</button>
```

```typescript
export class AppComponent {
  inputValue = '초기 값';
  isDisabled = true;
}
```

📌 **설명:**  
- Angular가 `value` 속성을 동적으로 바꿉니다.
- `isDisabled` 값이 `true`이면 `button`이 비활성화됩니다.

---

### ✅ 2) **일반 바인딩 예제**
```html
<td [attr.colspan]="colSpanValue">합쳐진 셀</td>
<p [attr.data-info]="infoData">데이터 속성</p>
```

```typescript
export class AppComponent {
  colSpanValue = 3;
  infoData = '추가 정보';
}
```

📌 **설명:**  
- HTML 속성인 `colspan`과 `data-info` 값을 바인딩합니다.
- Angular가 직접 HTML 속성을 업데이트합니다.

---

## 🔹 5. **속성 바인딩과 일반 바인딩의 올바른 사용법**
✅ **속성 바인딩을 사용할 때**
- 요소의 **DOM 속성**을 제어해야 할 때 사용합니다.
- 동적으로 값을 변경할 수 있습니다.
- `class`, `style`, `disabled`, `checked`, `value` 등은 **속성 바인딩**을 사용해야 합니다.

✅ **일반 바인딩을 사용할 때**
- 요소의 **HTML 속성(Attribute)**을 변경해야 할 때 사용합니다.
- `colspan`, `aria-label`, `data-*` 속성과 같은 **HTML 속성(attribute)**을 제어할 때 사용합니다.

---

## 📌 결론

| 사용 목적 | 추천 방식 |
|-----------|--------------|
| 요소의 속성을 동적으로 업데이트 | **속성 바인딩** (`[property]`) 사용 |
| HTML의 일반 속성을 바인딩할 때 | **일반 바인딩** (`[attr.attribute]`) 사용 |
