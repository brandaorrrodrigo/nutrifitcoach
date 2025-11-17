# 📸 SISTEMA DE FOTOS ANTES/DEPOIS

## 🎯 Funcionalidades

### Upload de Fotos
- Upload múltiplo (frente, lado, costas)
- Registro de peso atual
- Notas sobre como está se sentindo
- +20 pontos por upload

### Galeria
- Visualização de todas as fotos
- Organização por data
- Exibição de peso e notas
- Filtro por tipo (frente/lado/costas)

### Comparação Antes/Depois
- Seleção de 2 fotos para comparar
- Visualização lado a lado
- Cálculo automático de:
  - Diferença de peso
  - Dias entre as fotos
  - Média kg/semana
- Estatísticas visuais

### Estatísticas
- Total de fotos registradas
- Evolução de peso
- Tempo de jornada
- Progresso visual

## 🎨 Interface

### Página: /minhas-fotos

**Seções:**
1. **Estatísticas Gerais**
   - Diferença total de peso
   - Tempo de jornada
   - Número de fotos

2. **Upload de Novas Fotos**
   - Seleção múltipla de arquivos
   - Campo de peso
   - Campo de notas
   - Preview antes de enviar

3. **Visualização em Galeria**
   - Grid 3 colunas
   - Cards com foto + dados
   - Hover effects
   - Data e peso visíveis

4. **Comparação Antes/Depois**
   - Dropdowns para selecionar fotos
   - Visualização lado a lado
   - Estatísticas da comparação
   - Mensagem motivacional

## 💾 Armazenamento

**LocalStorage:**
```javascript
progressRecords: [
  {
    id: "timestamp",
    foto: "url",
    peso: 75.5,
    notas: "Sentindo melhor",
    createdAt: "2025-01-01"
  }
]
```

**Fotos da Anamnese:**
- Salvas em `plano.fotosUrls`
- Carregadas automaticamente na galeria
- Marcadas como "Foto inicial"

## 🎮 Gamificação

- **+20 pontos** por cada upload de foto
- **Badge "Fotógrafo"** após 5 fotos
- **Badge "Transformação"** com 10+ fotos
- **Badge "Jornada Visual"** após 20 fotos

## 🔗 Integração

**Dashboard:**
- Card "Minhas Fotos" (rosa/pink)
- Acesso rápido

**Progresso:**
- Seção "Últimas Fotos" (3 mais recentes)
- Botão "Ver Todas"

**Anamnese:**
- Upload inicial de fotos corporais
- Automático na galeria

## 📱 Mobile

- Responsive completo
- Grid adaptativo (3 → 2 → 1 coluna)
- Touch-friendly
- Upload via câmera

## 🎯 Casos de Uso

### Para o Usuário:
1. **Registro Inicial**
   - Tira 3 fotos na anamnese
   - Automático na galeria

2. **Updates Semanais**
   - Tira novas fotos
   - Registra peso
   - Adiciona notas

3. **Ver Progresso**
   - Compara antes/depois
   - Vê estatísticas
   - Motiva-se visualmente

4. **Compartilhar**
   - Download das comparações
   - Share social (futuro)

## 🚀 Melhorias Futuras

- [ ] IA para análise de composição corporal
- [ ] Detecção automática de mudanças
- [ ] Sobreposição de fotos (overlay)
- [ ] Timeline de evolução
- [ ] Compartilhamento social
- [ ] Watermark automático
- [ ] Edição básica (crop, rotate)
- [ ] Tags nas fotos (pré-treino, pós-treino)

## 💡 Dicas de Uso

**Para melhores resultados:**
1. Mesma iluminação sempre
2. Mesmo local/fundo
3. Mesma hora do dia
4. Roupas similares
5. Mesma distância da câmera
6. Fotos semanais ou quinzenais

## 🔒 Privacidade

- Fotos salvas localmente
- Não compartilhadas por padrão
- Usuário controla tudo
- Opção de deletar qualquer foto

---

**Acesse: /minhas-fotos**
