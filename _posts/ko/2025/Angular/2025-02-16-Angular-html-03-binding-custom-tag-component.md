---
title: Angular - 3 -커스텀 태그(Custom Tag)란? 컴포넌트(Component)와의 관계는?
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
description: Angular 커스텀 태그(Custom Tag), 컴포넌트(Component), HTML 랜더링 순서
article_tag1: Angular
article_tag2: Framework
article_tag3: html
article_section: Angular
meta_keywords: Angular, html
last_modified_at: '2025-02-16 21:00:00 +0800'
---


## 🔹 **Angular 커스텀 태그(Custom Tag)란?**
Angular에서 **커스텀 태그(Custom Tag)**는 사용자가 직접 만든 **컴포넌트(Component)**를 HTML 요소처럼 사용할 수 있도록 하는 기능입니다.  
즉, Angular의 **`@Component()` 데코레이터**에서 `selector` 값을 지정하면 해당 이름의 HTML 태그를 사용할 수 있습니다.

---

## 🔹 **코드 분석**
```typescript
@Component({
    selector: 'view-table-dashboard',
    templateUrl: './view-table-dashboard.component.html',
})
export class ViewTableDashboardComponent {
    @Input() filterSet: FilterSet;
    @Input() group: string;
    @Input() chartData: ChartData;
    @Input() tableData: TableData;
}
```

### ✅ **1) `@Component()` 데코레이터**
- **`selector: 'view-table-dashboard'`**  
  → 이 컴포넌트는 `<view-table-dashboard></view-table-dashboard>` 형태로 사용됩니다.
  
- **`templateUrl: './view-table-dashboard.component.html'`**  
  → HTML 템플릿이 이 컴포넌트의 화면을 렌더링할 때 사용됩니다.

---

### ✅ **2) 커스텀 태그 사용 예시 (부모 컴포넌트에서 사용)**
```html
<view-table-dashboard 
    [filterSet]="currentFilterSet"
    [group]="'Sales'"
    [chartData]="salesChartData"
    [tableData]="salesTableData">
</view-table-dashboard>
```
📌 **설명:**  
- 부모 컴포넌트에서 `<view-table-dashboard>` 태그를 사용하여 자식 컴포넌트(ViewTableDashboardComponent)에 데이터를 전달합니다.
- `@Input()` 데코레이터를 사용하여 데이터를 바인딩할 수 있습니다.

---

## 🔹 **HTML에서 렌더링되는 순서**
Angular에서 HTML이 렌더링되는 과정은 다음과 같이 진행됩니다.

### ✅ **1. Angular 애플리케이션 부트스트랩 (Bootstrap)**
1. `main.ts`에서 `AppModule`이 실행됨
2. `AppModule`에서 `AppComponent`가 실행됨

### ✅ **2. 부모 컴포넌트가 로드됨**
1. 부모 컴포넌트의 `template`이 읽혀짐
2. HTML 내의 `<view-table-dashboard>` 커스텀 태그가 발견됨
3. `ViewTableDashboardComponent` 컴포넌트가 로드됨

### ✅ **3. 자식 컴포넌트가 초기화됨**
1. `ViewTableDashboardComponent`의 `@Input()` 바인딩된 값들이 부모로부터 전달됨
2. `ngOnInit()`가 실행됨 (초기 로딩 시)
3. `templateUrl`에 연결된 HTML이 화면에 렌더링됨
4. `{{ }}` (Interpolation), `[ ]` (Property Binding) 등이 적용됨

### ✅ **4. 화면이 렌더링 완료됨**
1. 모든 데이터가 표시됨
2. 사용자의 인터랙션이 발생하면 Angular의 **Change Detection(변경 감지)**이 동작하여 화면이 다시 업데이트됨

---

## 🔹 **바인딩 매커니즘 순서**
Angular에서 데이터 바인딩이 이루어지는 순서를 이해하면 **어떤 값이 언제 적용되는지**를 알 수 있습니다.

### ✅ **1) 바인딩 데이터 전달 순서**
1. **부모 컴포넌트에서 자식 컴포넌트로 `@Input()` 데이터를 전달**
   - 예: `<view-table-dashboard [group]="'Sales'">`
   - `group`이라는 속성이 전달됨
   - 자식 컴포넌트 `ViewTableDashboardComponent`에서 `@Input() group`으로 받음

2. **HTML 템플릿에서 바인딩 적용**
   - 예: `<h2>그룹: {{ group }}</h2>`
   - `group` 값이 `'Sales'`이면 화면에서 `"그룹: Sales"`로 표시됨

3. **Property Binding (`[property]`) 적용**
   ```html
   <img [src]="chartData.imageUrl">
   ```
   - `chartData.imageUrl` 값이 적용됨

4. **이벤트 바인딩 (`(event)`) 적용**
   ```html
   <button (click)="refreshData()">새로고침</button>
   ```
   - 클릭 이벤트가 바인딩됨

5. **양방향 바인딩 (`[(ngModel)]`) 적용**
   ```html
   <input [(ngModel)]="filterSet.keyword">
   ```
   - `filterSet.keyword` 값이 입력 필드에서 변경될 때 동기화됨

---

## 🔹 **📌 결론**

| 단계 | 동작 |
|------|------|
| **1. Angular 앱 부트스트랩** | `AppModule`이 실행되며 부모 컴포넌트가 로드됨 |
| **2. 부모 컴포넌트가 HTML을 렌더링** | `<view-table-dashboard>` 커스텀 태그가 발견됨 |
| **3. 자식 컴포넌트가 초기화됨** | `@Input()`을 통해 부모의 데이터가 자식으로 전달됨 |
| **4. 바인딩 매커니즘이 실행됨** | `{{ }}`, `[property]`, `(event)`, `[(ngModel)]` 등이 동작 |
| **5. 화면이 렌더링 완료됨** | UI가 완성되며 사용자 입력을 기다림 |
