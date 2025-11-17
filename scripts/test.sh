#!/bin/bash
echo "========================================"
echo "TESTANDO NUTRIFITCOACH"
echo "========================================"
echo ""
echo "1. Testando instalacao..."
npm install

echo ""
echo "2. Gerando Prisma Client..."
npx prisma generate

echo ""
echo "3. Iniciando servidor..."
echo ""
echo "IMPORTANTE:"
echo "- Em outro terminal: ollama serve"
echo "- Acesse: http://localhost:3000"
echo "- Va em /anamnese e teste!"
echo ""
npm run dev
