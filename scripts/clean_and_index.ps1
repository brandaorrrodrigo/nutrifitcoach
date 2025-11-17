param(
  [string]$InRaw   = "D:\NFC\Scripts\library\library_md_raw",
  [string]$OutClean= "D:\NFC\Scripts\library\library_md",
  [int]$MinSizeKB  = 10
)

$ErrorActionPreference = "Stop"
function Ensure-Dir($p){ if(!(Test-Path $p)){ New-Item -ItemType Directory -Force -Path $p | Out-Null } }
Ensure-Dir $OutClean

Write-Host "🧹 Limpando MD bruto → $OutClean" -ForegroundColor Cyan
$folders = Get-ChildItem $InRaw -Directory

foreach($d in $folders){
  $src = Join-Path $d.FullName 'index.md'
  if(!(Test-Path $src)){ continue }
  if((Get-Item $src).Length -lt ($MinSizeKB*1024)){ continue }

  $text = Get-Content $src -Raw -Encoding UTF8
  $text = [Regex]::Replace($text, '```[\s\S]*?```', '', 'Singleline')
  $text = [Regex]::Replace($text, '<[^>]+>', ' ')
  $text = [Regex]::Replace($text, '\[[^\]]*\]\([^)]+\)', ' ')
  $text = ($text -split "`r?`n" | ForEach-Object { $_.Trim() } | Where-Object { $_.Length -ge 80 }) -join "`n`n"
  if([string]::IsNullOrWhiteSpace($text)){ continue }

  $dest = Join-Path $OutClean $d.Name
  Ensure-Dir $dest
  "# $($d.Name.Replace('-',' ').ToUpper())`n`n$text" | Set-Content -Path (Join-Path $dest 'index.md') -Encoding UTF8
}
Write-Host "✅ Limpeza concluída." -ForegroundColor Green
