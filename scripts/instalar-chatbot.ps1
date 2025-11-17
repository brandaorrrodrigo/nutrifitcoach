# Script de Instalação Automática do ChatBot - NutriFitCoach AI
# Execute este arquivo no PowerShell na pasta raiz do projeto

Write-Host "🤖 Instalando ChatBot com Ollama..." -ForegroundColor Cyan
Write-Host ""

# Verificar se está na pasta correta
if (-not (Test-Path "app\layout.tsx")) {
    Write-Host "❌ ERRO: Execute este script na pasta raiz do projeto nutrifitcoach-ai!" -ForegroundColor Red
    exit
}

# 1. Criar pasta da API
Write-Host "📂 Criando estrutura da API..." -ForegroundColor Yellow
New-Item -Path "app\api\chat" -ItemType Directory -Force | Out-Null
Write-Host "✅ Pasta criada!" -ForegroundColor Green

# 2. Copiar arquivo da API configurado
Write-Host "📂 Copiando arquivo da API..." -ForegroundColor Yellow
Copy-Item route-CONFIGURADO.ts app\api\chat\route.ts -Force
Write-Host "✅ API configurada com Ngrok!" -ForegroundColor Green

# 3. Atualizar home (opcional)
$resposta = Read-Host "Deseja atualizar a home page sem números falsos? (S/N)"
if ($resposta -eq "S" -or $resposta -eq "s") {
    Write-Host "📂 Atualizando home page..." -ForegroundColor Yellow
    Copy-Item page-honesta.tsx app\page.tsx -Force
    Write-Host "✅ Home atualizada!" -ForegroundColor Green
}

# 4. Limpar cache
Write-Host ""
Write-Host "🧹 Limpando cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
    Write-Host "✅ Cache limpo!" -ForegroundColor Green
}

# 5. Mensagem final
Write-Host ""
Write-Host "🎉 CHATBOT INSTALADO COM SUCESSO!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANTE: Mantenha esses 3 PowerShells abertos:" -ForegroundColor Yellow
Write-Host ""
Write-Host "PowerShell 1 - Ollama:" -ForegroundColor Cyan
Write-Host "  ollama serve" -ForegroundColor White
Write-Host ""
Write-Host "PowerShell 2 - Ngrok:" -ForegroundColor Cyan
Write-Host "  ngrok http 11434" -ForegroundColor White
Write-Host ""
Write-Host "PowerShell 3 - Next.js:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Agora execute:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "E teste o chat em:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "URL do Ngrok configurada: https://f7ba3ebf4ef5.ngrok-free.app" -ForegroundColor Green
Write-Host ""
