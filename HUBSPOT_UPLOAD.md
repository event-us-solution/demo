# HubSpot 업로드 가이드

이벤터스 솔루션 데모를 HubSpot File Manager에 올릴 때 참고하는 문서입니다.

---

## 1. 업로드할 폴더 구조

HubSpot **File Manager**에 아래와 **같은 폴더 구조**로 업로드하세요.  
(예: `solution-demo` 폴더를 만들고, 그 안에 아래 구조대로 넣기)

```
solution-demo/
├── index.html              ← 메인 체험 페이지 (진입점)
├── admin.html              ← 관리자 페이지 (로그인 필요)
├── css/
│   └── style.css
├── js/
│   ├── main.js
│   ├── data.js
│   └── admin.js
└── assets/
    ├── logo/
    │   └── 02. 로고_기본형_투명.png
    ├── main/
    │   └── main_setting.mp4
    ├── info/
    │   ├── information.gif
    │   └── information.mp4
    ├── qna/
    │   ├── qna_demo.mp4
    │   ├── james.png
    │   ├── june.png
    │   └── lucy.png
    ├── survey/
    │   └── survey.mp4
    ├── lucky-draw/
    │   └── lucky-draw.mp4
    └── myinfo/
        └── myinfo_qr.png
```

- **루트**에 `index.html`, `admin.html`  
- **css/** 에 `style.css`  
- **js/** 에 `main.js`, `data.js`, `admin.js`  
- **assets/** 아래에 위와 같이 하위 폴더·파일 유지  

이 구조를 지키면 HTML에서 사용하는 상대 경로(`css/style.css`, `js/main.js`, `assets/...`)가 그대로 동작합니다.

---

## 2. HubSpot에서 하는 작업

### 2-1. File Manager 열기

1. HubSpot 로그인
2. **마케팅(Marketing)** → **파일 및 템플릿(Files and Templates)** → **파일(Files)**
3. 또는 **설정(Settings)** → **파일 관리(File Manager)** (계정에 따라 이름이 다를 수 있음)

### 2-2. 폴더 만들고 업로드

1. **새 폴더** 만들기 → 이름 예: `solution-demo`
2. `solution-demo` 폴더 안에 들어간 뒤:
   - **index.html**, **admin.html** 을 **직접 이 폴더에** 업로드
   - **css** 폴더 생성 → 그 안에 **style.css** 업로드
   - **js** 폴더 생성 → 그 안에 **main.js**, **data.js**, **admin.js** 업로드
   - **assets** 폴더 생성 → 그 안에 다시 **logo**, **main**, **info**, **qna**, **survey**, **lucky-draw**, **myinfo** 폴더를 만들고, 위 목록대로 이미지·영상 파일 업로드

3. **한글/공백 파일명**  
   - `02. 로고_기본형_투명.png` 같은 파일은 HubSpot에서 지원하지만, 문제가 생기면 영문 파일명으로 바꾼 뒤 `index.html`·`admin.html`에서 해당 경로만 수정해 주세요.

### 2-3. 업로드 후 접속 URL

- File Manager에 올린 파일은 HubSpot CDN URL로 제공됩니다.
- 예시 형태:  
  `https://[회사명 또는 포털].fs.hubspotusercontent[-eu1 등].net/[경로]/solution-demo/index.html`
- HubSpot에서 해당 파일을 클릭하면 **파일 URL** 또는 **공개 URL**을 복사할 수 있습니다.
- **메인 체험 페이지**: `index.html` 의 URL을 북마크하거나 링크로 배포
- **관리자 페이지**: `admin.html` 의 URL (관리자만 알도록 관리)

---

## 3. 경로/동작 확인 사항

- 모든 리소스는 **상대 경로**로 되어 있어, 위 구조대로 올리면 **별도 코드 수정 없이** 동작해야 합니다.
- **로고 링크**: `index.html` 상단 로고의 `href="/"` 는 사이트 **루트**로 갑니다.  
  데모가 HubSpot 서브경로(예: `/solution-demo/`)에만 올라가는 경우, 로고 클릭 시 데모 메인으로 돌아가게 하려면:
  - `href="index.html"` 또는 `href="./"` 로 바꾸는 것을 권장합니다.
- **관리자 로그인**: ID/PW는 `js/admin.js` 안 `AdminAuthConfig` 에 있습니다. 배포 후 필요하면 해당 파일만 수정해 비밀번호를 바꿀 수 있습니다.

---

## 4. 제공해야 할 “코드” 요약

HubSpot에 올릴 때 **실제로 필요한 코드/파일**은 아래와 같습니다.

| 구분 | 내용 |
|------|------|
| **HTML** | `index.html`, `admin.html` (프로젝트 루트에 있는 그대로) |
| **CSS** | `css/style.css` (루트의 `style.css` 는 사용하지 않음) |
| **JS** | `js/main.js`, `js/data.js`, `js/admin.js` |
| **에셋** | `assets/` 아래 모든 이미지·영상 (위 폴더 구조 참고) |

현재 프로젝트 폴더(`solution demo`) 전체를 ZIP으로 압축한 뒤, HubSpot File Manager에 **폴더 구조를 유지한 채** 업로드하면 됩니다.  
(README.md, HUBSPOT_UPLOAD.md, 루트의 `style.css` 는 업로드해도 되고, 올리지 않아도 데모 동작에는 영향 없습니다.)

---

## 5. 요약 체크리스트

- [ ] HubSpot File Manager에서 `solution-demo` (또는 원하는 이름) 폴더 생성
- [ ] `index.html`, `admin.html` 업로드
- [ ] `css/style.css` 업로드
- [ ] `js/main.js`, `js/data.js`, `js/admin.js` 업로드
- [ ] `assets/` 하위 폴더·파일 모두 업로드 (구조 유지)
- [ ] `index.html` URL로 접속해 메인 체험 동작 확인
- [ ] `admin.html` URL로 접속해 로그인 후 관리자 기능 확인
- [ ] (선택) 데모가 서브경로에만 있을 경우 로고 `href` 를 `index.html` 또는 `./` 로 변경

이 순서대로 진행하면 HubSpot에 올린 데모를 그대로 사용할 수 있습니다.
