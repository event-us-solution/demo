# HubSpot 업로드 가이드

이 가이드는 이벤터스 솔루션 데모 페이지를 HubSpot CMS에 업로드하는 방법을 설명합니다.

---

## 📁 폴더 구조

```
hubspot/
├── templates/
│   ├── demo-page.html      # HubL 템플릿 (메인 페이지)
│   └── fields.json         # 편집 가능한 필드 정의
├── css/
│   └── style.css           # 스타일시트 (오버레이 비활성화됨)
├── js/
│   ├── main.js             # 메인 JavaScript (오버레이 비활성화됨)
│   └── data.js             # 데이터 관리 JavaScript
└── HUBSPOT_UPLOAD_GUIDE.md # 이 가이드
```

---

## 🚀 업로드 순서

### 1단계: 파일 매니저에 에셋 업로드

1. HubSpot 계정 로그인
2. **Marketing > Files and Templates > Files** 이동
3. 다음 파일들을 업로드:
   - `css/style.css`
   - `js/main.js`
   - `js/data.js`
   - 원본 프로젝트의 `assets/` 폴더 전체 (이미지, 비디오)

**중요**: 업로드 후 각 파일의 URL을 메모해두세요.

### 2단계: 비디오 파일 업로드

파일 매니저에 다음 비디오 파일들을 업로드:
- `assets/main/main_setting.mp4` - 메인 화면 영상
- `assets/info/information.mp4` - 행사정보 영상
- `assets/qna/qna_demo.mp4` - 질의응답 영상
- `assets/survey/survey.mp4` - 설문조사 영상
- `assets/lucky-draw/lucky-draw.mp4` - 경품추첨 영상

### 3단계: Design Manager에서 템플릿에 전체 코드 넣기

**⚠️ 중요:** 이 데모 페이지는 **드래그앤드롭(dnd_area)을 사용하지 않습니다.**  
HubSpot에서 "Coded Template"을 만들면 기본으로 `{% dnd_area %}...{% end_dnd_area %}`만 있는 빈 템플릿이 나옵니다. **그걸 그대로 쓰지 마세요.**

**다음 중 하나로 진행하세요.**

#### 방법 A: 이미 만든 템플릿이 있다면 (예: solution-demo.html)

1. 로컬 프로젝트에서 `hubspot/templates/demo-page.html` 파일을 연다.
2. **전체 선택(Ctrl+A)** 후 **전체 복사(Ctrl+C)**.
3. HubSpot Design Manager에서 `solution-demo.html`(또는 해당 템플릿)을 연다.
4. 편집기에서 **전체 선택(Ctrl+A)** 후, 방금 복사한 내용으로 **붙여넣기(Ctrl+V)**.
5. **기본으로 있던 `dnd_area` 포함한 모든 내용이 우리 코드로 통째로 바뀌어야 합니다.**
6. **Publish changes**로 저장.

이렇게 하면 `dnd_area`는 사라지고, 데모 페이지 전체 HTML이 템플릿에 들어갑니다.

#### 방법 B: 처음부터 새로 만든다면

1. **Marketing > Files and Templates > Design Tools** 이동.
2. 원하는 폴더(예: Solution demo)에서 **New File > Coded Template** 선택.
3. 템플릿 타입: **Page**, 파일명 입력 후 생성.
4. **생성된 파일 내용 전체를 지우고**, 로컬의 `hubspot/templates/demo-page.html` 내용 **전체**를 붙여넣기.
5. **Publish changes**로 저장.

### 4단계: CSS / JS 연결 (Design Manager에 올린 경우)

CSS와 JS를 **Design Manager**의 **Solution demo** 폴더 안에 올렸다면, 아래 코드로 바로 불러올 수 있습니다.

**폴더 구조 (Design Manager):**
```
Solution demo/
├── solution-demo.html
├── css/
│   └── style.css
└── js/
    ├── main.js
    └── data.js
```

**solution-demo.html 에 넣을 코드:**

```html
<!-- <head> 안 – CSS -->
<link rel="stylesheet" href="{{ get_asset_url('Solution demo/css/style.css') }}">

<!-- </body> 직전 – JS -->
<script src="{{ get_asset_url('Solution demo/js/data.js') }}"></script>
<script src="{{ get_asset_url('Solution demo/js/main.js') }}"></script>
```

- 경로 `Solution demo/css/style.css` 에서 **Solution demo** 는 왼쪽 폴더 이름과 **완전히 동일**하게 맞추세요 (띄어쓰기, 대소문자 포함).
- 폴더 이름이 다르면 (예: `solution-demo`) 그에 맞게 바꾸세요:  
  `{{ get_asset_url('solution-demo/css/style.css') }}`

**한 번에 복사용:**
```html
<link rel="stylesheet" href="{{ get_asset_url('Solution demo/css/style.css') }}">
<script src="{{ get_asset_url('Solution demo/js/data.js') }}"></script>
<script src="{{ get_asset_url('Solution demo/js/main.js') }}"></script>
```

---

### 4-2. CSS/JS를 파일 매니저(Marketing > Files)에 올린 경우

CSS/JS를 **파일 매니저**(Marketing > Files > solution-demo)에 올렸다면 `get_asset_url()` 이 아니라 **파일 매니저 URL**을 써야 합니다.  
자세한 내용은 `hubspot/CSS-JS-연결-수정방법.md` 를 참고하세요.

### 5단계: 이미지/비디오 URL 수정

템플릿 내 에셋 경로를 HubSpot 파일 매니저 URL로 수정:

```html
<!-- 로고 예시 -->
<img src="https://your-hubspot-file-url.com/logo.png" alt="이벤터스 로고" class="header-logo">

<!-- 비디오 예시 -->
<source src="https://your-hubspot-file-url.com/main_setting.mp4" type="video/mp4">
```

### 6단계: 페이지 생성

1. **Marketing > Website > Website Pages** 이동
2. **Create > Website page** 클릭
3. 템플릿 선택: `이벤터스 솔루션 데모 페이지`
4. 페이지 설정에서 영상 URL 입력

---

## 🎥 영상 URL 편집 방법

페이지 편집 화면에서 **Settings** 탭을 열면 다음 필드가 표시됩니다:

| 필드명 | 설명 |
|--------|------|
| 메인 화면 영상 URL | 세션/기능 메인 화면에서 재생되는 영상 |
| 행사정보 영상 URL | 행사정보 화면에서 재생되는 영상 |
| 질의응답 영상 URL | 질의응답 화면에서 재생되는 영상 |
| 설문조사 영상 URL | 설문조사 화면에서 재생되는 영상 |
| 경품추첨 영상 URL | 경품추첨 화면에서 재생되는 영상 |

각 필드에 HubSpot 파일 매니저에 업로드한 영상의 URL을 입력하세요.

---

## 📝 HubSpot 폼 연동 (선택사항)

참가자 등록을 CRM과 연동하려면:

1. **Marketing > Lead Capture > Forms** 에서 새 폼 생성
2. 필드 추가: 이름, 이메일, 휴대전화
3. 폼 ID 복사
4. 페이지 설정에서 **HubSpot 폼 ID** 필드에 입력

---

## ⚠️ 주의사항

### 레이아웃 관련
- **드래그앤드롭 편집기 사용 금지**: 이 템플릿은 복잡한 SPA 구조로 되어 있어 드래그앤드롭 편집 시 레이아웃이 깨질 수 있습니다.
- 영상 URL만 편집하고, HTML 구조는 수정하지 마세요.

### 영상 관련
- 영상 오버레이(음영+텍스트)는 비활성화되었습니다.
- 필요한 텍스트는 영상 자체에 편집하여 포함시키세요.
- 권장 영상 포맷: MP4 (H.264)
- 권장 해상도: 1920x1080 (16:9)

### 브라우저 지원
- Chrome, Firefox, Safari, Edge 최신 버전
- 모바일 반응형 지원

---

## 📞 문의

이벤터스 솔루션 팀
- 웹사이트: https://event-us.kr
- 상담 신청: https://blog.event-us.kr/solutiontype/offline

---

## 변경 이력

| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-02-05 | 1.0 | 최초 HubSpot 버전 생성 |
| - | - | 영상 오버레이 제거 |
| - | - | 영상 URL 편집 기능 추가 |
| - | - | HubSpot 폼 연동 위치 추가 |
