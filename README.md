# 이벤터스 솔루션 데모 페이지

백엔드 없이 독립적으로 작동하는 정적 웹사이트. 이벤트 관리 솔루션의 참가자 경험을 시뮬레이션하는 데모 페이지.

---

## 프로젝트 구조

```
solution demo/
├── index.html              # 메인 HTML (모든 화면이 단일 파일에 포함)
├── admin.html              # 관리자 페이지 (말풍선 편집)
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
| `demo-screen` | 메인 화면 (기능 버튼 목록) | ✅ 완성 |
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

### 반응형 브레이크포인트

- `1279px`: 중간 화면 조정
- `1024px`: 모바일 전환 (아이폰 프레임 제거, 전체화면 모드)

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
