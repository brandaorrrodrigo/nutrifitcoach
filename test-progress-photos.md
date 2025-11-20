# 🧪 TESTE RÁPIDO - FOTOS DE EVOLUÇÃO

## 📋 CHECKLIST DE TESTES

### ✅ PASSO 1: Executar Migration SQL

1. Abra Supabase Dashboard
2. Vá em **SQL Editor**
3. Cole o conteúdo de `prisma/migrations/add_progress_photos.sql`
4. Execute
5. ✅ Deve criar 2 tabelas: `ProgressPhoto` e `ProgressSession`

**Verificar:**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('ProgressPhoto', 'ProgressSession');
```

Deve retornar 2 linhas.

---

### ✅ PASSO 2: Gerar Prisma Client

```bash
cd D:\nutrifitcoach
npx prisma generate
```

✅ Deve compilar sem erros.

---

### ✅ PASSO 3: Testar Localmente

```bash
npm run dev
```

Acesse: http://localhost:3000

---

### ✅ PASSO 4: Fluxo de Anamnese

1. Faça login (ou crie conta)
2. Vá para `/anamnese-nutricional`
3. Complete todas as 5 etapas
4. Clique em "Gerar Cardápio"
5. ✅ **DEVE REDIRECIONAR para `/fotos-evolucao`** ← TESTE PRINCIPAL

---

### ✅ PASSO 5: Upload de Fotos

Na página `/fotos-evolucao`:

1. Clique em **"Nova Sessão de Fotos"**
2. Preencha:
   - Peso: `75`
   - Altura: `175`
   - Idade: `30`
   - % Gordura: `15` (opcional)
   - Observações: `Teste inicial`
3. Clique nos 4 cards de foto
4. Selecione 4 fotos diferentes do seu computador
5. ✅ **Deve aparecer "✅ Selecionada"** em cada card
6. Clique em **"Enviar Fotos"**
7. ✅ **Deve aparecer "Fotos enviadas com sucesso!"**

---

### ✅ PASSO 6: Verificar Marca D'água

1. Recarregue a página `/fotos-evolucao`
2. ✅ **Deve aparecer 1 sessão** com data de hoje
3. ✅ **Deve mostrar os metadados:** peso, altura, IMC, BF%
4. ✅ **Deve exibir as 4 fotos** no grid 2x2
5. Passe o mouse sobre uma foto
6. ✅ **Deve aparecer overlay** com botões de download e compartilhar
7. Clique com botão direito → "Abrir imagem em nova aba"
8. ✅ **DEVE TER A MARCA D'ÁGUA:**
   - Logo "NutriFitCoach" com gradiente verde→azul
   - URL "NutriFitCoach.com.br"
   - Posição: canto inferior direito
   - Opacidade ~40%

---

### ✅ PASSO 7: Download e Compartilhamento

1. Passe mouse sobre uma foto
2. Clique no botão **⬇️ (Download)**
3. ✅ **Deve baixar a foto COM marca d'água**
4. Clique no botão **🔗 (Compartilhar)**
5. ✅ **Deve abrir Web Share API** (mobile) ou **copiar link** (desktop)

---

### ✅ PASSO 8: Segunda Sessão (Teste de Comparação)

1. Clique em **"Nova Sessão de Fotos"** novamente
2. Preencha com dados DIFERENTES:
   - Peso: `72` (3kg a menos)
   - Altura: `175`
   - Idade: `30`
   - % Gordura: `13` (2% a menos)
3. Envie 4 fotos
4. ✅ **Deve aparecer 2 sessões** na lista
5. ✅ **Na sessão mais recente, deve aparecer:**
   - "0 dias desde a última" (ou N dias se esperou)
   - "-3kg" em verde (perda de peso)
   - "-2%" de BF em verde

---

### ✅ PASSO 9: Menu de Navegação

1. Vá para `/dashboard`
2. ✅ **Deve ter um card rosa** com:
   - Ícone 📸
   - Título "Fotos de Evolução"
   - Texto "Acompanhe seu progresso"
3. Clique no card
4. ✅ **Deve navegar para `/fotos-evolucao`**

---

### ✅ PASSO 10: Verificar Banco de Dados

No Supabase → Table Editor:

**Tabela `ProgressSession`:**
```sql
SELECT * FROM "ProgressSession" ORDER BY session_date DESC;
```

✅ Deve ter 1-2 registros com:
- `user_id`
- `session_date`
- `weight_kg`, `height_cm`, `bmi`
- `is_complete = true`
- `photos_count = 4`

**Tabela `ProgressPhoto`:**
```sql
SELECT * FROM "ProgressPhoto" ORDER BY taken_at DESC;
```

✅ Deve ter 4-8 fotos (4 por sessão) com:
- `photo_type`: frontal, posterior, lado_direito, lado_esquerdo
- `original_url`, `watermarked_url`, `thumb_url`
- `width`, `height`, `file_size_bytes`
- `sha256` (hash único)

---

### ✅ PASSO 11: Verificar Arquivos

No Windows Explorer, navegue para:
```
D:\nutrifitcoach\public\uploads\progress\[user-id]\[session-id]\
```

✅ Deve ter **12 arquivos** (3 por foto × 4 fotos):
- `original_frontal_*.jpg`
- `watermarked_frontal_*.jpg`
- `thumb_frontal_*.jpg`
- (e assim para posterior, lado_direito, lado_esquerdo)

**Tamanhos esperados:**
- Original: ~200-500KB (max 1200px)
- Watermarked: ~200-500KB (com marca d'água)
- Thumb: ~20-50KB (300x300px)

---

## 🐛 PROBLEMAS COMUNS

### ❌ "Não autenticado"
**Solução:** Faça login novamente

### ❌ "Configuração do Supabase não encontrada"
**Solução:**
```bash
# Verifique .env.local
SUPABASE_URL="https://..."
SUPABASE_SERVICE_ROLE_KEY="..."
```

### ❌ "Imagem inválida"
**Solução:** Use JPEG, PNG ou WebP (200px-8000px, max 10MB)

### ❌ Marca d'água não aparece
**Solução:**
```bash
npm install sharp
```

### ❌ "Já existe uma foto deste tipo"
**Solução:** Crie uma NOVA sessão (cada sessão aceita apenas 1 foto de cada tipo)

---

## ✅ SUCESSO!

Se todos os 11 passos funcionaram, a implementação está **100% COMPLETA** e pronta para produção! 🎉

**Próximo passo:**
```bash
git add .
git commit -m "feat: sistema completo de fotos de evolução"
git push
```

Deploy automático na Vercel! 🚀
