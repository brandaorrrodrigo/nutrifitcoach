param(
  [string]$SourceRoot = "D:\NFC\Scripts\library\ebooks",
  [string]$OutRootRaw = "D:\NFC\Scripts\library\library_md_raw"
)

function Ensure-Dir($p) {
  if (!(Test-Path $p)) { New-Item -ItemType Directory -Force -Path $p | Out-Null }
}

function New-Slug([string]$name) {
  $s = $name.ToLower() -replace '[^\p{L}\p{Nd}\- ]','' -replace '\s+','-'
  return $s.Trim('-')
}

function Write-MD($folder, [string]$title, [string]$body) {
  Ensure-Dir $folder
  ("# {0}`n`n{1}" -f $title, $body) | Set-Content -LiteralPath (Join-Path $folder 'index.md') -Encoding UTF8
}

if (!(Test-Path $SourceRoot)) {
  throw "SourceRoot nao encontrado: $SourceRoot"
}

Ensure-Dir $OutRootRaw

$pdftotext = Get-Command pdftotext -ErrorAction SilentlyContinue
$pandoc    = Get-Command pandoc    -ErrorAction SilentlyContinue
$ocrmypdf  = Get-Command ocrmypdf  -ErrorAction SilentlyContinue

if (-not $pdftotext) {
  throw "'pdftotext' nao encontrado (instale Poppler)."
}

$files = Get-ChildItem -Path $SourceRoot -Recurse -File -Include *.pdf,*.docx,*.epub,*.html,*.htm,*.txt

Write-Host ("Arquivos encontrados: {0}" -f $files.Count)

foreach ($f in $files) {
  try {
    $title = [IO.Path]::GetFileNameWithoutExtension($f.Name)
    $slug  = New-Slug $title
    $dest  = Join-Path $OutRootRaw $slug

    switch ($f.Extension.ToLower()) {

      '.pdf' {
        Write-Host "Processando PDF: $($f.Name)"
        $srcPdf = $f.FullName

        if ($ocrmypdf) {
          $tmpPdf = Join-Path $env:TEMP ("ocr_" + [guid]::NewGuid().ToString() + ".pdf")
          & $ocrmypdf.Source --force-ocr --rotate-pages --deskew --remove-background --clean -j 2 "$srcPdf" "$tmpPdf" 2>$null
          if (Test-Path $tmpPdf) { $srcPdf = $tmpPdf }
        }

        $tmpTxt = Join-Path $env:TEMP ("pdf_" + [guid]::NewGuid().ToString() + ".txt")
        & $pdftotext.Source "$srcPdf" "$tmpTxt" -layout -enc UTF-8

        if (Test-Path $tmpTxt) {
          $txt = Get-Content -LiteralPath $tmpTxt -Raw -Encoding UTF8
          if ($txt -and $txt.Trim().Length -gt 0) {
            Write-MD $dest $title $txt
          }
        }

        Remove-Item -Force -ErrorAction SilentlyContinue $tmpTxt,$tmpPdf
      }

      '.docx' {
        if ($pandoc) {
          Write-Host "Processando DOCX: $($f.Name)"
          Ensure-Dir $dest
          & $pandoc.Source -f docx -t gfm -o (Join-Path $dest 'index.md') "$($f.FullName)"
        }
      }

      '.epub' {
        if ($pandoc) {
          Write-Host "Processando EPUB: $($f.Name)"
          Ensure-Dir $dest
          & $pandoc.Source -f epub -t gfm -o (Join-Path $dest 'index.md') "$($f.FullName)"
        }
      }

      '.html' {
        if ($pandoc) {
          Write-Host "Processando HTML: $($f.Name)"
          Ensure-Dir $dest
          & $pandoc.Source -f html -t gfm -o (Join-Path $dest 'index.md') "$($f.FullName)"
        }
      }

      '.htm' {
        if ($pandoc) {
          Write-Host "Processando HTML: $($f.Name)"
          Ensure-Dir $dest
          & $pandoc.Source -f html -t gfm -o (Join-Path $dest 'index.md') "$($f.FullName)"
        }
      }

      '.txt' {
        Write-Host "Processando TXT: $($f.Name)"
        $txt = Get-Content -LiteralPath $f.FullName -Raw -Encoding UTF8
        if ($txt -and $txt.Trim().Length -gt 0) {
          Write-MD $dest $title $txt
        }
      }
    }
  }
  catch {
    Write-Host "Erro em: $($f.FullName) -> $($_.Exception.Message)"
  }
}

Write-Host "Conversao concluida para: $OutRootRaw"
