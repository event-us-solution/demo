# CSS / JS 연결이 안 될 때 수정 방법

CSS와 JS가 **파일 매니저**(Marketing > Files > solution-demo)에 있다면,  
템플릿에서 **반드시 “파일 매니저 주소”**로 불러와야 합니다.

---

## 방법 1: 실제 URL로 고정 (가장 확실)

1. HubSpot **Marketing > Files and Templates > Files** 이동
2. **solution-demo > css** 폴더 열기
3. **style.css** 파일 클릭 → 오른쪽 또는 메뉴에서 **URL 복사**
4. 복사한 URL 예시:  
   `https://22319584.fs1.hubspotusercontent-na1.net/hubfs/22319584/solution-demo/css/style.css`
5. **마지막 `/css/style.css` 를 지운 부분**이 `file_base` 입니다.  
   예: `https://22319584.fs1.hubspotusercontent-na1.net/hubfs/22319584/solution-demo`

### 템플릿에 넣을 코드 (solution-demo.html 상단)

**기존 `file_base` 줄을 지우고**, 아래 한 줄로 **직접 넣기** (URL은 본인 걸로 바꾸기):

```hubL
{% set file_base = 'https://22319584.fs1.hubspotusercontent-na1.net/hubfs/22319584/solution-demo' %}
```

- `22319584` → 본인 포털 ID  
- `fs1`, `na1` → 파일 URL 복사한 것과 **완전히 동일**하게 맞추기 (na2, eu1 등일 수 있음)

### head 안 – CSS

```html
<link rel="stylesheet" href="{{ file_base }}/css/style.css">
```

### </body> 직전 – JS

```html
<script src="{{ file_base }}/js/data.js"></script>
<script src="{{ file_base }}/js/main.js"></script>
```

이렇게 하면 **같은 파일 매니저 경로**를 쓰므로 CSS/JS가 연결됩니다.

---

## 방법 2: Design Manager에 CSS/JS 두기 (get_asset_url 사용)

CSS/JS를 **Design Manager**에도 두면 `get_asset_url()` 로 연결할 수 있습니다.

1. **Design Manager** 열기 (Marketing > Files and Templates > Design Tools)
2. **Solution demo** 폴더 선택
3. **css** 폴더 만들기 → 그 안에 **style.css** 업로드
4. **js** 폴더 만들기 → 그 안에 **main.js**, **data.js** 업로드
5. 템플릿에서는 아래처럼만 쓰기:

```html
<link rel="stylesheet" href="{{ get_asset_url('Solution demo/css/style.css') }}">
```

```html
<script src="{{ get_asset_url('Solution demo/js/data.js') }}"></script>
<script src="{{ get_asset_url('Solution demo/js/main.js') }}"></script>
```

- 경로는 Design Manager 왼쪽 폴더 구조에 맞게 (예: `Solution demo/css/style.css`) 조정

---

## 체크리스트

- [ ] `file_base` 에 **na1** 이라고 썼다면, 오타 **nal** 이 아닌지 확인
- [ ] 파일 매니저에서 **style.css** URL 복사해서, 브라우저 새 탭에 붙여넣었을 때 파일이 열리는지 확인
- [ ] `file_base` 를 **복사한 URL에서 /css/style.css 뺀 값**으로 정확히 넣었는지 확인
- [ ] 템플릿 저장 후 **페이지 새로고침** (캐시 없이: Ctrl+F5)

위 중 **방법 1**으로 실제 복사한 URL을 넣으면 CSS/JS 연결 문제는 대부분 해결됩니다.
