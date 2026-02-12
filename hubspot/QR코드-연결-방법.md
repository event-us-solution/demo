# 내정보 화면 QR코드 연결 방법

QR코드가 안 보이면 **파일 위치**와 **주소(file_base)** 를 확인하세요.

---

## 1. 파일 매니저에 QR 이미지가 있는지 확인

QR코드는 이 경로에서 불러옵니다:

```
solution-demo / assets / myinfo / myinfo_qr.png
```

**확인 순서:**

1. HubSpot **Marketing > Files and Templates > Files** 이동
2. **solution-demo** 폴더 열기
3. **assets** 폴더 열기
4. **myinfo** 폴더가 있는지 확인
5. **myinfo** 안에 **myinfo_qr.png** 파일이 있는지 확인

---

## 2. 없으면 업로드하기

**myinfo_qr.png** 가 없으면 아래처럼 올리세요.

1. 로컬에서 **`solution demo/assets/myinfo/myinfo_qr.png`** 파일을 엽니다.
2. **파일 매니저**에서 **solution-demo > assets** 로 이동합니다.
3. **myinfo** 폴더가 없으면 **폴더 만들기**로 **myinfo** 를 만듭니다.
4. **myinfo** 폴더를 연 다음 **파일 업로드**로 **myinfo_qr.png** 를 올립니다.

최종 경로가 이렇게 되면 됩니다:

- `solution-demo/assets/myinfo/myinfo_qr.png`

---

## 3. file_base 가 맞는지 확인

템플릿에서 QR 이미지는 다음 주소로 불러옵니다:

```
{{ file_base }}/assets/myinfo/myinfo_qr.png
```

- **file_base** 가 잘못되어 있으면 CSS/JS는 되는데 QR만 안 보일 수도 있습니다.
- **file_base** 는 **style.css** URL에서 맨 뒤 `/css/style.css` 를 뺀 값이어야 합니다.  
  예: `https://22319584.fs1.hubspotusercontent-na1.net/hubfs/22319584/solution-demo`

템플릿 상단의 `{% set file_base = "..." %}` 를 위와 같은 주소로 맞춰 주세요.

---

## 4. 브라우저에서 이미지 주소 확인

QR이 여전히 안 보이면:

1. 페이지를 연 상태에서 **F12** (개발자 도구) 를 누릅니다.
2. **Elements** (또는 요소) 탭에서 **QR코드** 근처의 `<img>` 를 찾습니다.
3. **src** 속성에 나온 주소를 복사해서 **새 탭**에 붙여넣습니다.
4. 그 주소로 **이미지가 직접 열리면** → file_base 는 맞고, 캐시/캐시 삭제 후 새로고침을 해 보세요.
5. **404 또는 이미지가 안 열리면** → 파일 매니저 경로(`solution-demo/assets/myinfo/myinfo_qr.png`)와 **file_base** 를 다시 확인하세요.

---

## 요약

| 확인할 것 | 조치 |
|-----------|------|
| 파일 매니저에 `solution-demo/assets/myinfo/myinfo_qr.png` 있는지 | 없으면 로컬 `assets/myinfo/myinfo_qr.png` 를 그 경로에 업로드 |
| 템플릿 상단 `file_base` 값 | style.css URL에서 `/css/style.css` 뺀 주소로 설정 |

이렇게 하면 내정보 화면의 QR코드가 연결됩니다.
