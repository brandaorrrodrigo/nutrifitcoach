# scripts\setup_tools.ps1
# Instala Poppler (pdftotext), Pandoc, Ghostscript e ocrmypdf

$ErrorActionPreference = "Stop"

Write-Host "▶ Instalando Poppler..." -ForegroundColor Cyan
winget install --id=oschwartz10612.Poppler --silent -e

Write-Host "▶ Instalando Pandoc..." -ForegroundColor Cyan
winget install --id=JohnMacFarlane.Pandoc --silent -e

Write-Host "▶ Instalando Ghostscript..." -ForegroundColor Cyan
winget install --id=ArtifexSoftware.Ghostscript --silent -e

Write-Host "▶ Instalando ocrmypdf via pip..." -ForegroundColor Cyan
python -m pip install --upgrade pip
python -m pip install ocrmypdf

# Adiciona Poppler ao PATH da sessão atual (ajuste o caminho caso o instalador mude)
$poppler = "C:\Program Files\poppler-*\Library\bin"
$dir = Get-ChildItem "C:\Program Files" -Directory -Filter "poppler-*" -ErrorAction SilentlyContinue | Select-Object -First 1
if ($dir) { $env:Path = "$($dir.FullName)\Library\bin;$env:Path" }

Write-Host "✅ Ferramentas instaladas." -ForegroundColor Green
