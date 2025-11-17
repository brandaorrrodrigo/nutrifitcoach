# ==========================================
# INSTALAÇÃO AUTOMÁTICA - REDESIGN COMPLETO
# ==========================================

Write-Host "🎨 INSTALANDO REDESIGN COMPLETO DO NUTRIFITCOACH" -ForegroundColor Cyan
Write-Host ""

# ==========================================
# 1. COPIAR ARQUIVOS
# ==========================================
Write-Host "📋 Copiando arquivos..." -ForegroundColor Yellow

# Páginas
Write-Host "  → Home..." -ForegroundColor Gray
Copy-Item REDESIGN\home-page.tsx app\page.tsx -Force -ErrorAction Stop

Write-Host "  → Planos..." -ForegroundColor Gray
Copy-Item REDESIGN\planos-page.tsx app\planos\page.tsx -Force -ErrorAction Stop

Write-Host "  → Login..." -ForegroundColor Gray
Copy-Item REDESIGN\login-page.tsx app\login\page.tsx -Force -ErrorAction Stop

Write-Host "  → Registro..." -ForegroundColor Gray
Copy-Item REDESIGN\registro-page.tsx app\registro\page.tsx -Force -ErrorAction Stop

Write-Host "  → Dashboard..." -ForegroundColor Gray
Copy-Item REDESIGN\dashboard-page.tsx app\dashboard\page.tsx -Force -ErrorAction Stop

# Componente
Write-Host "  → Navbar..." -ForegroundColor Gray
Copy-Item REDESIGN\Navbar.tsx components\Navbar.tsx -Force -ErrorAction Stop

# Logo
Write-Host "  → Logo..." -ForegroundColor Gray
Copy-Item nfc-logo_png.png public\nfc-logo.png -Force -ErrorAction Stop

Write-Host "✅ Arquivos copiados!" -ForegroundColor Green
Write-Host ""

# ==========================================
# 2. ATUALIZAR LAYOUT
# ==========================================
Write-Host "🔧 Atualizando layout..." -ForegroundColor Yellow

$layoutContent = @'
import Navbar from '@/components/Navbar';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NutriFitCoach - Nutrição Inteligente com IA',
  description: 'Planos alimentares personalizados com inteligência artificial',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
'@

$layoutContent | Out-File app\layout.tsx -Encoding UTF8 -Force
Write-Host "✅ Layout atualizado!" -ForegroundColor Green
Write-Host ""

# ==========================================
# 3. LIMPAR CACHE
# ==========================================
Write-Host "🧹 Limpando cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next
}
Write-Host "✅ Cache limpo!" -ForegroundColor Green
Write-Host ""

# ==========================================
# 4. MENSAGEM FINAL
# ==========================================
Write-Host "════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "🎉 REDESIGN INSTALADO COM SUCESSO!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "🚀 EXECUTE AGORA:" -ForegroundColor Cyan
Write-Host ""
Write-Host "npm run dev" -ForegroundColor Yellow
Write-Host ""

Write-Host "📱 DEPOIS TESTE:" -ForegroundColor Cyan
Write-Host "  ✅ http://localhost:3000 (Home)" -ForegroundColor White
Write-Host "  ✅ http://localhost:3000/planos (Planos)" -ForegroundColor White
Write-Host "  ✅ http://localhost:3000/registro (Registro)" -ForegroundColor White
Write-Host "  ✅ http://localhost:3000/login (Login)" -ForegroundColor White
Write-Host "  ✅ http://localhost:3000/dashboard (Dashboard)" -ForegroundColor White
Write-Host ""

Write-Host "🎨 CORES DA LOGO:" -ForegroundColor Cyan
Write-Host "  Ciano → Verde → Azul → Roxo" -ForegroundColor White
Write-Host "  Gradiente moderno aplicado em todo site!" -ForegroundColor White
Write-Host ""

Write-Host "════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "BOA SORTE! 🚀" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
