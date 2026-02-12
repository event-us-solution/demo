# 이벤터스 솔루션 데모 페이지

백엔드 없이 독립적으로 작동하는 정적 웹사이트. 이벤트 관리 솔루션의 참가자 경험을 시뮬레이션하는 데모 페이지.

---

## 프로젝트 구조

```
solution demo/
├── index.html              # 메인 HTML (모든 화면이 단일 파일에 포함)
├── admin.html              # 관리자 페이지 (로그인 후 영상/말풍선 편집)
├── css/
│   └── style.css           # 전체 스타일 (약 2500줄)
├── js/
│   ├── data.js             # 데이터 모델 및 localStorage 관리
│   ├── main.js             # 메인 로직 및 화면 전환 (약 1860줄)
│   └── admin.js            # 관리자 페이지 로직
├── assets/
│   ├── info/               # 행사정보 관련 미디어
│   │   └── information.gif
│   ├── main/               # 메인 화면 관련 미디어
│   │   └── main_setting.mp4
│   ├── qna/                # 질의응답 관련 미디어
│   │   ├── james.png, lucy.png, june.png (연사 프로필)
│   │   └── qna_demo.mp4
│   └── survey/             # 설문조사 관련 미디어
│       └── survey.mp4
└── README.md
```

---

## 아키텍처 개요

### 화면 관리 시스템 (ScreenManager)

모든 화면은 `index.html` 내 `.phone-screen-inner` 클래스를 가진 div로 구현됨.
`ScreenManager` 객체가 화면 전환, 히스토리, 상태를 관리함.

```javascript
// 핵심 구조
const ScreenManager = {
    currentScreen: 'demo-screen',      // 현재 활성 화면 ID
    screenHistory: ['demo-screen'],    // 뒤로가기용 히스토리 스택
    
    show(screenId, options)            // 화면 전환
    goBack()                           // 이전 화면으로
    setPage(page)                      // 페이지 상태 설정 (헤더 버튼 표시용)
    updateBalloons()                   // 화면별 말풍선 업데이트
}
```

### 화면 ID 매핑

| 화면 ID | 기능 | 상태 |
|---------|------|------|
| `demo-screen` | 메인 화면 (세션/기능, 하단 탭) | ✅ 완성 |
| `myinfo-screen` | 내정보 (QR / 내정보 / 참여기록 서브탭) | ✅ 완성 |
| `networking-screen` | 네트워킹 (참가자 검색·연결, 하단 탭) | ✅ 완성 |
| `settings-screen` | 설정 (하단 탭) | ✅ 완성 |
| `info-screen` | 행사정보 | ✅ 완성 |
| `qna-screen` | 질의응답 목록 | ✅ 완성 |
| `qna-question-screen` | 질문 작성 폼 | ✅ 완성 |
| `survey-screen` | 설문조사 | ✅ 완성 |
| `lottery-screen` | 경품추첨 | ⚠️ 플레이스홀더 |
| `notice-screen` | 공지사항 | ✅ 완성 |
| `files-screen` | 파일공유 | ⚠️ 플레이스홀더 |
| `program-screen` | 프로그램 | ⚠️ 플레이스홀더 |
| `speaker-screen` | 기조강연 | ⚠️ 플레이스홀더 |
| `panel-screen` | 패널토의 | ⚠️ 플레이스홀더 |
| `vote-screen` | 현장투표 | ⚠️ 플레이스홀더 |
| `competition-screen` | 모의투자 | ⚠️ 플레이스홀더 |
| `webinar-screen` | 웨비나 | ⚠️ 플레이스홀더 |
| `chat-screen` | 채팅 | ⚠️ 플레이스홀더 |
| `attendance-screen` | 출석체크 | ⚠️ 플레이스홀더 |

### 영상 오버레이

메인 프로젝트와 HubSpot 랜딩 동일: **영상 오버레이(타이핑 효과) 비활성화**. `schedule*VideoOverlay()` 함수는 no-op이며, 영상 자체에 텍스트가 포함된 것을 전제로 함.

### 화면별 연동 미디어

화면 전환 시 우측에 표시되는 미디어 (데스크톱 전용):

| 화면 | 미디어 요소 ID | 파일 |
|------|---------------|------|
| `demo-screen` | `#main-video` | `assets/main/main_setting.mp4` |
| `info-screen` | `#info-gif` | `assets/info/information.gif` |
| `qna-screen` | `#qna-video` | `assets/qna/qna_demo.mp4` |
| `survey-screen` | `#survey-video` | `assets/survey/survey.mp4` |

---

## 데이터 관리 (data.js)

### DemoData 객체 구조

```javascript
const DemoData = {
    preRegisteredPhone: '01041283217',  // 테스트용 전화번호
    participants: [],                    // 참가자 목록
    notices: [],                         // 공지사항
    speakers: [],                        // 연사 정보
    qnas: [],                            // Q&A 데이터
    votes: {},                           // 투표 데이터
    lottery: {},                         // 경품 추첨 데이터
    competition: {},                     // 경연대회 데이터
    attendance: {},                      // 출석 데이터
    balloons: {},                        // 말풍선 설정
    currentUser: null                    // 현재 사용자
}
```

### 저장 방식
- `localStorage` 사용
- 키: `demoData`
- 함수: `saveData()`, `loadData()`

---

## 관리자 페이지 로그인 (admin.html)

- **접근**: `admin.html` 접속 시 로그인 화면이 먼저 표시됨.
- **인증**: ID/비밀번호는 `js/admin.js` 상단의 `AdminAuthConfig` 객체에 설정됨.
- **세션**: 로그인 성공 시 `sessionStorage`에 저장되며, **탭/창을 닫으면 자동 로그아웃**됨.
- **보안**: 데모/체험용 클라이언트 측 검증이며, 실제 서비스 배포 시에는 서버 측 인증으로 교체해야 함.

---

## CSS 구조 및 네이밍 컨벤션

### 주요 CSS 변수 (`:root`)

```css
--primary-color: #4A90E2;    /* 기본 파란색 */
--purple: #795cde;           /* 보라색 (헤더, 버튼) */
--red: #E74C3C;              /* 빨간색 */
--teal: #20B2AA;             /* 청록색 */
--blue: #4A90E2;             /* 파란색 */
--qna-font: 'SUIT Variable'; /* Q&A 전용 폰트 */
```

### 화면별 헤더 색상

| 화면 | 배경색 |
|------|--------|
| 행사정보, 질의응답, 설문조사 | `#5c3fbf` (보라) |
| 경품추첨 | `#ff5e7e` (핑크) |
| 현장투표, 모의투자 | `var(--teal)` |
| 웨비나, 채팅, 출석체크 | `var(--blue)` |

### 클래스 네이밍 패턴

- **화면 컨테이너**: `{기능}-content` (예: `qna-content`, `survey-content`)
- **탭 버튼**: `{기능}-tab-button` (예: `qna-tab-button`)
- **탭 패널**: `{기능}-tab-panel` (예: `survey-tab-panel`)
- **활성 상태**: `.is-active`
- **숨김 상태**: `[hidden]` 속성 또는 `.is-visible` 클래스

### 하단 탭 네비게이션 (원본 솔루션 체험페이지 동일)

- **세션/기능** → `demo-screen` (오프라인 솔루션 버튼 목록)
- **내정보** → `myinfo-screen` (서브탭: QR / 내정보 / 참여기록)
- **네트워킹** → `networking-screen` (참가자 검색, 전체/연결됨 탭, 연결하기)
- **설정** → `settings-screen`
- 하단 탭은 `demo-screen`, `myinfo-screen`, `networking-screen`, `settings-screen`에서만 표시. 말풍선은 이 네 화면에서는 숨김.

### 반응형 브레이크포인트

- `1279px`: 중간 화면 조정
- `1024px`: 모바일 전환 (아이폰 프레임 제거, 전체화면 모드)

### 네트워킹 프로필 이미지 업로드 (클라이언트 전용)

- **위치**: 참여하기 모달(`#networking-join-modal`), 내 정보 수정 모달(`#networking-edit-modal`) 상단 프로필 카드의 '업로드' 버튼.
- **동작**: 숨김 `<input type="file" accept="image/*">`를 두고, 업로드 버튼 클릭 시 해당 input을 트리거. 모바일은 사진첩/카메라, PC는 파일 탐색기.
- **처리**: 서버 전송 없음. `URL.createObjectURL(file)`로 임시 URL 생성 후 `.networking-join-photo-preview` `<img>`의 `src`에 반영. 성씨 placeholder는 이미지가 있으면 숨김(`.has-image`).
- **상태**: `networkingProfilePhotoUrl` 변수로 세션 동안 유지. 모달을 닫았다 다시 열어도 같은 세션에서는 이미지 유지. 새로고침 시 초기화. 새 이미지 선택 시 이전 URL은 `URL.revokeObjectURL()`로 해제.

---

## 기능별 구현 패턴

### 탭 네비게이션 패턴 (공통)

```html
<!-- 탭 버튼 -->
<div class="{기능}-tabs">
    <button class="{기능}-tab-button" data-tab="{기능}-tab-{탭명}">탭명</button>
    <button class="{기능}-tab-button is-active" data-tab="{기능}-tab-{탭명2}">탭명2</button>
</div>

<!-- 탭 패널 -->
<div class="{기능}-tab-panel" id="{기능}-tab-{탭명}">내용</div>
<div class="{기능}-tab-panel is-active" id="{기능}-tab-{탭명2}">내용</div>
```

```javascript
// 초기화 함수 패턴
function init{기능}Tabs() {
    const buttons = document.querySelectorAll('.{기능}-tab-button');
    const panels = document.querySelectorAll('.{기능}-tab-panel');
    // ... 클릭 이벤트로 is-active 토글
}
```

### 완료 화면 패턴

설문조사의 제출 완료 화면 참고:

```html
<div class="{기능}-complete" id="{기능}-complete">
    <div class="{기능}-complete-icon">
        <span class="material-icons">check</span>
    </div>
    <p class="{기능}-complete-text">완료 메시지</p>
    <button class="{기능}-complete-btn">확인</button>
</div>
```

---

## 새 화면 추가 시 체크리스트

1. **HTML 추가** (`index.html`)
   - `.phone-screen-inner` 클래스로 화면 컨테이너 추가
   - 고유 ID 부여 (예: `id="lottery-screen"`)
   - `.detail-header`에 배경색 지정
   - `.back-btn` 숨김 여부 CSS에 추가

2. **CSS 추가** (`css/style.css`)
   - `#{화면ID} .back-btn { display: none; }` (뒤로가기 버튼 숨김 시)
   - `#{화면ID} .detail-title { margin-left: 0; }` (제목 정렬)
   - 화면 전용 스타일 클래스 추가

3. **JS 추가** (`js/main.js`)
   - `handleFeatureClick()` 함수에 case 추가
   - 필요 시 탭 초기화 함수 추가
   - `DOMContentLoaded`에서 초기화 함수 호출

4. **미디어 연동** (선택사항)
   - `assets/` 폴더에 미디어 파일 추가
   - `getAdminMediaForScreen()` 함수에 매핑 추가
   - `update{기능}VideoVisibility()` 함수 추가

---

## 메인 화면 버튼 추가 방법

`#demo-screen` 내 `.section-buttons`에 버튼 추가:

```html
<button class="section-btn btn-{기능}" data-feature="{기능키}">
    <span class="btn-icon"><span class="material-icons">{아이콘명}</span></span>
    <span class="btn-text">{버튼텍스트}</span>
</button>
```

CSS에 버튼 색상 추가:
```css
.section-btn.btn-{기능} {
    background: #{색상코드};
}
.section-btn.btn-{기능}:hover {
    background: #{hover색상};
}
```

---

## 외부 의존성

- **Google Fonts**: Noto Sans KR, Material Icons, Material Symbols Outlined
- **SUIT Variable Font**: CDN (`cdn.jsdelivr.net`)
- **외부 링크**: `blog.event-us.kr` (상담 신청, 솔루션 소개)
- **YouTube Embed**: `youtube-nocookie.com`

---

## 주의사항

1. **단일 페이지 구조**: 모든 화면이 `index.html`에 있음. 화면 분리 금지.
2. **localStorage 의존**: 새로고침 시 데이터 유지됨. 개발 시 캐시 초기화 필요할 수 있음.
3. **아이폰 프레임**: 데스크톱에서만 표시. 1024px 이하에서는 전체화면 모드.
4. **미디어 오토플레이**: 비디오는 `muted`, `playsinline` 속성 필수.
5. **화면 히스토리**: `ScreenManager.screenHistory` 배열로 관리. 직접 조작 시 주의.

---

## 테스트

로컬 서버 실행 후 `index.html` 접속:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```
브라우저에서 `http://localhost:8000` 접속.

---

## HubSpot CMS 버전

HubSpot CMS에 업로드하기 위한 변환 버전이 `hubspot/` 폴더에 있습니다.

### 폴더 구조

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
└── HUBSPOT_UPLOAD_GUIDE.md # 업로드 가이드
```

### 원본과의 차이점

| 항목 | 원본 | HubSpot 버전 |
|------|------|-------------|
| 영상 오버레이 | 음영 + 타이핑 텍스트 효과 | **제거됨** (영상 자체에 텍스트 포함) |
| 영상 URL | 로컬 파일 경로 | HubSpot 필드로 편집 가능 |
| 폼 | HTML 폼 | HubSpot 폼 연동 가능 (CRM 연동) |
| 드래그앤드롭 | 해당 없음 | 사용하지 않음 (레이아웃 유지) |

### 편집 가능한 항목

HubSpot 페이지 편집기에서 다음 항목을 수정할 수 있습니다:

1. **메인 화면 영상 URL** - 세션/기능 메인 화면
2. **행사정보 영상 URL** - 행사정보 화면
3. **질의응답 영상 URL** - 질의응답 화면
4. **설문조사 영상 URL** - 설문조사 화면
5. **경품추첨 영상 URL** - 경품추첨 화면
6. **HubSpot 폼 ID** - CRM 연동용 (선택사항)

### 업로드 방법

자세한 업로드 방법은 `hubspot/HUBSPOT_UPLOAD_GUIDE.md` 파일을 참조하세요.

---

## 다른 PC(노트북)에서 작업 이어가기

이 프로젝트는 **Git**으로 버전 관리되고 있으며, 원격 저장소는 GitHub(`event-us-solution/demo`)에 연결되어 있습니다.

### 방법 1: Git 사용 (권장)

**지금 쓰는 PC에서 (작업 마무리 후)**  
1. 변경사항 커밋 후 푸시  
   - Cursor/VS Code에서: 소스 제어 탭 → 메시지 입력 → 체크 표시(커밋) → "..." → Push  
   - 또는 터미널: `git add .` → `git commit -m "작업 내용 요약"` → `git push origin main`

**다른 노트북에서**  
1. Git이 설치되어 있다면:  
   - `git clone https://github.com/event-us-solution/demo.git`  
   - 또는 이미 클론해 둔 폴더가 있다면 해당 폴더에서 `git pull origin main`  
2. Cursor에서 해당 폴더 열기  
3. `README.md`를 참고해 구조·진행 상황 확인 후 작업 이어가기  

- **Git을 잘 모르시면**: Cursor 소스 제어 탭에서 "커밋"과 "Push" 버튼만 사용해도 됩니다.  
- **원격에 푸시하지 않고** 로컬만 쓰고 계시다면 방법 2를 사용하세요.

### 방법 2: 폴더 복사 (Git 없이)

- **지금 PC**: `solution demo` 폴더 전체를 USB나 클라우드(OneDrive, Google 드라이브 등)에 복사  
- **다른 노트북**: 복사한 폴더를 원하는 위치에 붙여넣기 후 Cursor에서 해당 폴더 열기  
- **주의**: 두 PC에서 동시에 수정하면 나중에 덮어쓰기가 생길 수 있으므로, 한쪽에서만 수정하거나 파일명에 날짜를 붙여 백업해 두는 것이 좋습니다.

---

## 변경 이력| 날짜 | 버전 | 내용 |
|------|------|------|
| 2026-02-10 | 1.2 | 네트워킹 탭 추가 (하단 탭 4개: 세션/기능, 내정보, 네트워킹, 설정) |
| 2026-02-10 | 1.2 | HubSpot 랜딩 반영: 영상 오버레이 비활성화(타이핑 효과 제거), 재생속도 1로 통일 |
| 2026-02-05 | 1.1 | HubSpot CMS 버전 추가 |
| - | - | 영상 오버레이 제거 옵션 |
| - | - | 영상 URL 편집 가능 필드 추가 |
| - | - | HubSpot 폼 연동 위치 준비 |