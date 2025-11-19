# 🔐 COMO USAR O RESET DE SENHA

## 📋 PASSO A PASSO PARA ATIVAR

### 1️⃣ EXECUTAR SQL NO SUPABASE

1. Acesse: https://supabase.com/dashboard/project/yjcelqyndhvmcsiihmko/sql/new

2. Cole TODO o conteúdo do arquivo: `ADD_PASSWORD_RESET_TABLE.sql`

3. Click em **"Run"**

4. Deve aparecer: `"Tabela PasswordResetToken criada com sucesso!"`

---

### 2️⃣ AGUARDAR DEPLOY (2-3 minutos)

A Vercel está fazendo redeploy automático agora.

---

### 3️⃣ TESTAR O FLUXO COMPLETO

#### A. Esqueceu a senha

1. Acesse: https://nutrifitcoach.vercel.app/login

2. Click em **"Esqueceu sua senha?"** (você vai adicionar este link)

3. OU acesse direto: https://nutrifitcoach.vercel.app/esqueci-senha

4. Digite seu email

5. Click em **"Enviar link de recuperação"**

6. **Em desenvolvimento:** Você verá o link direto na tela

7. **Em produção:** O link será enviado por email (quando integrar serviço de email)

---

#### B. Redefinir senha

1. Click no link de recuperação (ou copie e cole no navegador)

2. Você será levado para: https://nutrifitcoach.vercel.app/reset-password?token=...

3. Digite sua nova senha (mínimo 6 caracteres)

4. Confirme a nova senha

5. Click em **"Redefinir Senha"**

6. Sucesso! Você será redirecionado para o login

7. Faça login com sua nova senha ✅

---

## 🔗 ADICIONAR LINK NA PÁGINA DE LOGIN

Você precisa adicionar o link "Esqueceu sua senha?" na sua página de login.

Procure a página de login e adicione algo assim:

```tsx
<Link href="/esqueci-senha" className="text-purple-600 hover:underline text-sm">
  Esqueceu sua senha?
</Link>
```

---

## 🛡️ SEGURANÇA

### O que foi implementado:

✅ **Tokens únicos e seguros** (crypto.randomBytes)
✅ **Expiração automática** (1 hora)
✅ **Uso único** (token marcado como usado após reset)
✅ **Senha hasheada** com bcrypt
✅ **Validação de email e senha**
✅ **Proteção contra enumeração** (não revela se email existe)

---

## 📧 INTEGRAR COM SERVIÇO DE EMAIL (OPCIONAL)

Por enquanto, em desenvolvimento, o link aparece diretamente na tela. Para produção, você pode integrar com:

### Opções de serviço de email:

1. **Resend** (recomendado - fácil e gratuito)
   - https://resend.com
   - 3.000 emails/mês grátis
   - Fácil integração

2. **SendGrid**
   - https://sendgrid.com
   - 100 emails/dia grátis

3. **Mailgun**
   - https://mailgun.com

### Como integrar (exemplo com Resend):

1. Instalar: `npm install resend`

2. Adicionar `RESEND_API_KEY` nas env vars da Vercel

3. No arquivo `app/api/auth/forgot-password/route.ts`, adicionar após gerar o token:

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

await resend.emails.send({
  from: 'NutriFitCoach <noreply@seudominio.com>',
  to: [email],
  subject: 'Recuperação de Senha - NutriFitCoach',
  html: `
    <h1>Recuperação de Senha</h1>
    <p>Olá ${user.name},</p>
    <p>Você solicitou a recuperação de senha. Click no link abaixo para criar uma nova senha:</p>
    <a href="${resetLink}">${resetLink}</a>
    <p>Este link expira em 1 hora.</p>
    <p>Se você não solicitou isso, ignore este email.</p>
  `
});
```

---

## 🧪 TESTAR AGORA

Depois que o deploy terminar e você executar o SQL:

1. Vá em: https://nutrifitcoach.vercel.app/esqueci-senha

2. Digite o email da conta que você criou antes

3. Copie o link que aparecer na tela

4. Abra o link e defina uma nova senha

5. Faça login com a nova senha!

---

## ✅ CHECKLIST

- [ ] SQL executado no Supabase (tabela PasswordResetToken criada)
- [ ] Deploy completado na Vercel
- [ ] Link "Esqueceu sua senha?" adicionado na página de login
- [ ] Testado o fluxo completo de reset de senha
- [ ] Funcionando! 🎉

---

## 🆘 SE DER ERRO

### "relation PasswordResetToken does not exist"
→ Você não executou o SQL no Supabase. Execute o `ADD_PASSWORD_RESET_TABLE.sql`

### "Token inválido ou expirado"
→ O token expirou (1 hora) ou já foi usado. Solicite um novo.

### "Erro ao atualizar senha"
→ Verifique os logs da Vercel para ver o erro específico

---

**Pronto! Agora seu sistema tem recuperação de senha completa!** 🎉
