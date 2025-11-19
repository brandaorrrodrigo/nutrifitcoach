# 🗄️ Instruções para Migração SQL no Supabase

## Passo a Passo para Executar as Migrações

### 1. Acessar o Supabase Dashboard

1. Acesse: https://supabase.com/dashboard
2. Faça login com sua conta
3. Selecione o projeto **NutriFitCoach**

### 2. Abrir o SQL Editor

1. No menu lateral esquerdo, clique em **SQL Editor**
2. Ou acesse diretamente: `https://supabase.com/dashboard/project/[seu-project-id]/sql`

### 3. Executar Migração Principal (Criar Tabelas)

1. Clique em **New Query** (Nova Consulta)
2. Copie todo o conteúdo do arquivo: `prisma/migrations/add_nutritional_system.sql`
3. Cole no editor SQL
4. Clique em **Run** (ou pressione Ctrl+Enter)
5. Aguarde a mensagem: ✅ "Sistema de nutrição criado com sucesso!"

**O que será criado:**
- 5 ENUMs: ActivityLevel, NutritionalGoal, DietaryRestriction, MealTime, FoodCategory
- 4 Tabelas:
  - `NutritionalProfile` (perfil nutricional do usuário)
  - `Food` (banco de alimentos TACO)
  - `MealPlan` (cardápios gerados)
  - `ShoppingList` (lista de compras)

### 4. Popular Banco de Alimentos (Seed Data)

1. Clique em **New Query** novamente
2. Copie todo o conteúdo do arquivo: `prisma/migrations/seed_food_database.sql`
3. Cole no editor SQL
4. Clique em **Run**
5. Verifique a mensagem final com o total de alimentos inseridos (47 alimentos)

**Alimentos incluídos:**
- 11 Proteínas (frango, carne, peixe, ovos, whey)
- 11 Carboidratos (arroz, batata, macarrão, pães, aveia)
- 4 Leguminosas (feijões, lentilha, grão de bico)
- 9 Vegetais (brócolis, alface, tomate, etc)
- 6 Frutas (banana, maçã, morango, etc)
- 5 Laticínios (leite, iogurte, queijos)
- 5 Gorduras (azeite, abacate, castanhas, amendoim)
- 2 Bebidas (café, água de coco)

### 5. Verificar Criação das Tabelas

Execute no SQL Editor para verificar:

```sql
-- Ver todas as tabelas
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Contar alimentos
SELECT COUNT(*) as total_alimentos FROM "Food";

-- Ver categorias de alimentos
SELECT category, COUNT(*) as quantidade
FROM "Food"
GROUP BY category
ORDER BY categoria;

-- Ver exemplos de alimentos
SELECT name, category, calories, protein, carbs, fat
FROM "Food"
LIMIT 10;
```

## 🎯 Estrutura Final do Banco

Após executar as migrações, você terá:

```
AppUser (já existente)
├── NutritionalProfile (1:1)
│   ├── dados antropométricos
│   ├── nível de atividade
│   ├── objetivo
│   ├── restrições
│   └── macros calculados
│
├── MealPlan (1:N)
│   ├── informações do plano
│   ├── meals_data (JSONB com refeições)
│   └── totais calculados
│
└── ShoppingList (1:N)
    └── items (JSONB com lista de compras)

Food (tabela global)
└── 47 alimentos brasileiros com dados nutricionais
```

## ⚠️ Troubleshooting

### Erro: "type already exists"
- Significa que os ENUMs já foram criados
- Não é um erro, pode continuar normalmente
- O script usa `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object` para lidar com isso

### Erro: "relation already exists"
- Significa que as tabelas já existem
- Use `DROP TABLE` se quiser recriar (cuidado: apaga dados!)
- Ou ignore o erro se as tabelas estão corretas

### Erro: "foreign key constraint"
- Verifique se a tabela `AppUser` existe
- Execute: `SELECT * FROM "AppUser" LIMIT 1;`
- Se não existir, execute primeiro as migrações de autenticação

### Limpar tudo e começar do zero:

```sql
-- ⚠️ CUIDADO: Isso apaga TUDO!
DROP TABLE IF EXISTS "ShoppingList" CASCADE;
DROP TABLE IF EXISTS "MealPlan" CASCADE;
DROP TABLE IF EXISTS "Food" CASCADE;
DROP TABLE IF EXISTS "NutritionalProfile" CASCADE;

DROP TYPE IF EXISTS "FoodCategory" CASCADE;
DROP TYPE IF EXISTS "MealTime" CASCADE;
DROP TYPE IF EXISTS "DietaryRestriction" CASCADE;
DROP TYPE IF EXISTS "NutritionalGoal" CASCADE;
DROP TYPE IF EXISTS "ActivityLevel" CASCADE;

-- Depois execute novamente os scripts de migração
```

## ✅ Próximos Passos

Após executar as migrações com sucesso:

1. **Testar Anamnese:** Acesse `/anamnese-nutricional`
2. **Gerar Cardápio:** Complete o formulário e gere um cardápio
3. **Visualizar Cardápio:** Veja o cardápio gerado em `/meu-cardapio`
4. **Verificar Banco:** Confira se os dados foram salvos corretamente

## 🔗 Links Úteis

- Supabase Dashboard: https://supabase.com/dashboard
- Documentação Supabase SQL: https://supabase.com/docs/guides/database
- Documentação TACO: http://www.tbca.net.br/

## 📝 Notas

- Os valores nutricionais são por 100g
- Fonte: Tabela TACO (Tabela Brasileira de Composição de Alimentos)
- Método de cálculo: Dr. Mike Israetel (Renaissance Periodization)
- Todos os alimentos são comuns na dieta brasileira
