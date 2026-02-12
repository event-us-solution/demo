# HubSpot 템플릿 에러/경고 수정 방법

---

## 1. 에러: `standard_header_includes` / `standard_footer_includes` 누락

**원인:** HubSpot에서 필수로 요구하는 태그가 템플릿에 없음.

**수정:**

### ① `<head>` 안에 한 줄 추가

`</head>` 바로 **위**에 아래 한 줄을 넣으세요.

```hubL
{{ standard_header_includes }}
```

**위치 예시:**
```html
<head>
    <meta charset="UTF-8">
    ...
    <link rel="stylesheet" href="...">
    {{ standard_header_includes }}
</head>
```

### ② `</body>` 직전에 한 줄 추가

`</body>` 바로 **위**에 아래 한 줄을 넣으세요.

```hubL
{{ standard_footer_includes }}
```

**위치 예시:**
```html
    <script src="...js/main.js"></script>
    {{ standard_footer_includes }}
</body>
```

- `standard_header_includes`: HubSpot 스크립트/스타일용  
- `standard_footer_includes`: HubSpot 분석 등용  

둘 다 넣으면 해당 에러는 사라집니다.

---

## 2. 경고: `get_asset_url` – "no resource at path"

**원인:** Design Manager에 `Solution demo/css/style.css` 같은 경로로 파일이 없거나, 경로 형식이 맞지 않음.

**해결:** Design Manager 대신 **파일 매니저 URL**로 CSS/JS를 불러오기.

### ① 파일 매니저에서 URL 확인

1. **Marketing > Files and Templates > Files** 이동  
2. **solution-demo > css > style.css** 열기  
3. **URL 복사** (예: `https://22319584.fs1.hubspotusercontent-na1.net/hubfs/22319584/solution-demo/css/style.css`)

### ② 템플릿 상단에 `file_base` 설정

`<!DOCTYPE html>` **위**(변수 정의하는 곳)에 다음을 넣으세요.  
**복사한 URL에서 `/css/style.css` 를 뺀 부분**으로 바꿉니다.

```hubL
{% set file_base = 'https://22319584.fs1.hubspotusercontent-na1.net/hubfs/22319584/solution-demo' %}
```

### ③ CSS/JS를 `file_base` 로 연결

**기존 `get_asset_url` 줄을 지우고** 아래로 교체하세요.

**CSS (head 안):**
```html
<link rel="stylesheet" href="{{ file_base }}/css/style.css">
```

**JS (</body> 직전):**
```html
<script src="{{ file_base }}/js/data.js"></script>
<script src="{{ file_base }}/js/main.js"></script>
```

이렇게 하면 Design Manager 경로가 아니라 **파일 매니저 URL**로 불러와서 "no resource at path" 경고가 사라집니다.

---

## 한 번에 복사용 체크리스트

1. **`<head>` 안:**  
   `{{ standard_header_includes }}` 있는지 확인  
2. **`</body>` 직전:**  
   `{{ standard_footer_includes }}` 있는지 확인  
3. **상단:**  
   `{% set file_base = '복사한_URL_에서_/css/style.css_뺀_값' %}`  
4. **CSS:**  
   `href="{{ file_base }}/css/style.css"`  
5. **JS:**  
   `src="{{ file_base }}/js/data.js"` , `src="{{ file_base }}/js/main.js"`  

이렇게 수정하면 에러 1~4와 경고 5~7이 해결됩니다.
