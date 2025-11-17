import { NextResponse } from 'next/server';
import { getAIClient } from '@/lib/ai-client/unified-client';

export async function GET() {
  try {
    const aiClient = getAIClient();
    
    // Verificar status dos provedores
    const status = await aiClient.checkStatus();
    
    // Listar modelos Ollama se disponível
    let ollamaModels: string[] = [];
    if (status.ollama) {
      ollamaModels = await aiClient.listOllamaModels();
    }
    
    const defaultProvider = process.env.DEFAULT_AI_PROVIDER || 'ollama';
    const fallbackEnabled = process.env.AI_FALLBACK_ENABLED === 'true';
    
    return NextResponse.json({
      success: true,
      providers: status,
      defaultProvider,
      fallbackEnabled,
      ollamaModels,
      config: {
        ollamaUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
        ollamaModel: process.env.OLLAMA_MODEL || 'llama3.1:8b',
      }
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
