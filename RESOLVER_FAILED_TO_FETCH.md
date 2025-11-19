# 🔧 RESOLVER "Failed to fetch" ao criar conta

## ❌ PROBLEMA

Erro "Failed to fetch" ao tentar registrar usuário.

## ✅ SOLUÇÃO

### **1. Reiniciar o servidor**

```bash
# Parar servidor se estiver rodando (Ctrl+C no terminal)

# Iniciar novamente
npm run dev
```

### **2. Verificar se está rodando**

Acesse: http://localhost:3000/api/health

Deve retornar:
```json
{"status":"ok"}
```

### **3. Testar registro novamente**

1. Acesse: http://localhost:3000/registro
2. Preencha o formulário
3. Clique em "Criar Conta"

---

## 🔍 OUTRAS CAUSAS POSSÍVEIS

### **Causa 1: Erro no Prisma Client**

Se mesmo reiniciando não funcionar:

```bash
# Regenerar Prisma Client
npx prisma generate

# Reiniciar servidor
npm run dev
```

### **Causa 2: Banco de dados não conectado**

Verificar se executou o SQL no Supabase:
- Acesse: https://supabase.com/dashboard/project/yjcelqyndhvmcsiihmko
- Vá em "Table Editor"
- Verifique se a tabela `AppUser` existe

Se não existir, execute o SQL em:
```
D:\nutrifitcoach\EXECUTAR_NO_SUPABASE.sql
```

### **Causa 3: CORS / Network Error**

Abra o Console do navegador (F12) e veja se há erro de rede.

Se houver erro CORS, adicione no arquivo `next.config.js`:

```javascript
async headers() {
  return [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Access-Control-Allow-Origin', value: '*' },
        { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
        { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
      ],
    },
  ];
}
```

### **Causa 4: Porta ocupada**

Se a porta 3000 estiver ocupada:

```bash
# Verificar processo na porta 3000
netstat -ano | findstr :3000

# Matar processo (substituir PID)
taskkill /PID <numero> /F

# Iniciar novamente
npm run dev
```

---

## 📝 TESTAR DIRETAMENTE A API

Para ter certeza que a API funciona:

```bash
# Teste via curl ou PowerShell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{"nome":"Teste","email":"teste@teste.com","password":"123456"}'
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Conta criada com sucesso!",
  "user": {
    "id": "...",
    "nome": "Teste",
    "email": "teste@teste.com"
  }
}
```

---

## ✅ CHECKLIST

- [ ] Servidor rodando (`npm run dev`)
- [ ] Health check funcionando (`/api/health`)
- [ ] Tabela `AppUser` existe no Supabase
- [ ] `.env` com `DATABASE_URL` correto
- [ ] Prisma Client gerado (`npx prisma generate`)
- [ ] Console do navegador sem erros (F12)

---

## 🚀 PRÓXIMO PASSO

Depois de criar conta com sucesso:

1. Fazer login
2. Ir para: http://localhost:3000/anamnese-feminina
3. Testar o NFC Hormonal Engine completo!
