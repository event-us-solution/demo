# HubSpot 업로드용 폴더 생성 스크립트
# 실행 시 "hubspot-upload" 폴더에 업로드에 필요한 파일만 복사됩니다.
# 그 폴더를 ZIP으로 압축한 뒤 HubSpot File Manager에 올리면 됩니다.

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
$out = Join-Path $root "hubspot-upload"

if (Test-Path $out) {
    Remove-Item $out -Recurse -Force
}
New-Item -ItemType Directory -Path $out | Out-Null

# HTML
Copy-Item (Join-Path $root "index.html") $out
Copy-Item (Join-Path $root "admin.html") $out

# CSS
$cssOut = Join-Path $out "css"
New-Item -ItemType Directory -Path $cssOut -Force | Out-Null
Copy-Item (Join-Path $root "css\style.css") $cssOut

# JS
$jsOut = Join-Path $out "js"
New-Item -ItemType Directory -Path $jsOut -Force | Out-Null
Copy-Item (Join-Path $root "js\main.js") $jsOut
Copy-Item (Join-Path $root "js\data.js") $jsOut
Copy-Item (Join-Path $root "js\admin.js") $jsOut

# assets (폴더 구조 유지)
$assetsRoot = Join-Path $root "assets"
$assetsOut = Join-Path $out "assets"
New-Item -ItemType Directory -Path $assetsOut -Force | Out-Null

$assetFolders = @("logo", "main", "info", "qna", "survey", "lucky-draw", "myinfo")
foreach ($folder in $assetFolders) {
    $src = Join-Path $assetsRoot $folder
    if (Test-Path $src) {
        $dest = Join-Path $assetsOut $folder
        New-Item -ItemType Directory -Path $dest -Force | Out-Null
        Get-ChildItem $src -File | Copy-Item -Destination $dest
    }
}

Write-Host "완료: hubspot-upload 폴더가 생성되었습니다."
Write-Host "이 폴더를 ZIP으로 압축한 뒤 HubSpot File Manager에 업로드하세요."
Write-Host "자세한 절차는 HUBSPOT_UPLOAD.md 를 참고하세요."
