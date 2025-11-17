import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Verificar disponibilidade dos provedores
    const claudeAvailable = !!process.env.ANTHROPIC_API_KEY;
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';

    let ollamaAvailable = false;
    try {
      const response = await fetch(`${ollamaUrl}/api/version`, {
        signal: AbortSignal.timeout(5000)
      });
      ollamaAvailable = response.ok;
    } catch {
      ollamaAvailable = false;
    }

    return NextResponse.json({
      success: true,
      providers: {
        claude: claudeAvailable,
        ollama: ollamaAvailable
      },
      defaultProvider: claudeAvailable ? 'claude' : 'ollama',
      config: {
        ollamaUrl,
        ollamaModel: process.env.OLLAMA_MODEL || 'llama3:latest',
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
