"use client";

import { useEffect, useRef, useState } from "react";
import { getColorScheme } from "@/lib/colors";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "text" | "chart" | "vision";
  chartData?: any[];
}

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sexo, setSexo] = useState<string>("masculino");
  const [planoInfo, setPlanoInfo] = useState<{ calorias?: number; objetivo?: string; macros?: any }>({});
  const [recognizing, setRecognizing] = useState(false);
  const [typing, setTyping] = useState(false);

  // Voz
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    const s = localStorage.getItem("nfc_voice_enabled");
    return s ? JSON.parse(s) : true; // voz ligada por padrão
  });

  const colors = getColorScheme(sexo);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ===== Histórico & Plano =====
  useEffect(() => {
    const saved = localStorage.getItem("nfc_chat_history");
    const plano = localStorage.getItem("plano");
    if (saved) setMessages(JSON.parse(saved));
    else setMessages([{ role: "assistant", content: "Olá! 👋 Sou o assistente do NutriFitCoach. Como posso ajudar hoje?" }]);

    if (plano) {
      try {
        const parsed = JSON.parse(plano);
        setSexo(parsed?.usuario?.sexo || "masculino");
        setPlanoInfo({
          calorias: parsed?.calorias || 2000,
          objetivo: parsed?.usuario?.objetivo || "manutenção",
          macros: parsed?.macros
        });
      } catch {}
    }
  }, []);
  useEffect(() => localStorage.setItem("nfc_chat_history", JSON.stringify(messages)), [messages]);
  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  // ===== Voz – carregar vozes e helpers =====
  useEffect(() => {
    const load = () => setVoices(window.speechSynthesis?.getVoices?.() || []);
    load();
    window.speechSynthesis?.addEventListener?.("voiceschanged", load);
    return () => window.speechSynthesis?.removeEventListener?.("voiceschanged", load);
  }, []);
  useEffect(() => {
    localStorage.setItem("nfc_voice_enabled", JSON.stringify(voiceEnabled));
  }, [voiceEnabled]);

  const stripEmojis = (text: string) => text.replace(/[\u{1F300}-\u{1FAFF}]/gu, "");
  const detectLang = (text: string) => {
    if (/[áéíóúâêîôûãõç]/i.test(text)) return "pt-BR";
    if (/[¿¡ñ]/i.test(text)) return "es-ES";
    return "en-US";
  };
  const pickVoice = (lang: string) => {
    return voices.find(v =>
      v.lang?.startsWith(lang) &&
      (v.name?.includes("Google") || v.name?.includes("Brasil") || v.name?.includes("Premium"))
    ) || voices.find(v => v.lang?.startsWith(lang));
  };
  const speakText = (text: string) => {
    if (!voiceEnabled) return;
    if (!window.speechSynthesis) return;
    const clean = stripEmojis(text);
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = detectLang(text);
    u.rate = 1; u.pitch = 1; // natural
    const v = pickVoice(u.lang);
    if (v) u.voice = v;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  // ===== Digitação simulada =====
  const simulateTyping = async (text: string) => {
    setTyping(true);
    let current = "";
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    for (const ch of text) {
      current += ch;
      setMessages((prev) => {
        const cp = [...prev]; cp[cp.length - 1].content = current + "▌"; return cp;
      });
      await new Promise((r) => setTimeout(r, 16));
    }
    setMessages((prev) => { const cp = [...prev]; cp[cp.length - 1].content = current; return cp; });
    setTyping(false); speakText(text);
  };

  // ===== Chat texto =====
  const guardNutrition = (text: string) => {
    // evita respostas “fora do tema”
    const bad = /(matérias escolares|assuntos mais gerais|gerais\.)/i;
    if (bad.test(text)) {
      return "Vamos focar no seu plano nutricional: cardápio, substituições, pré/pós-treino e gráficos de macros/IG/CG. O que você quer ajustar agora?";
    }
    return text;
  };

  const sendMessage = async (msg?: string) => {
    const message = msg || input.trim();
    if (!message || loading) return;
    setInput(""); setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: message }]);

    try {
      // prefixo leve para guiar o modelo a ficar em Nutrição
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: `NUTRIÇÃO: ${message}` }),
      });
      const data = await res.json();
      let text = data.message || "Entendido! ✅";
      text = guardNutrition(text);

      if (/(gráfic|macro|IG|CG)/i.test(text)) {
        const chartData = [
          { name: "Proteína", value: planoInfo?.macros?.proteina ?? 120 },
          { name: "Carboidrato", value: planoInfo?.macros?.carboidrato ?? 220 },
          { name: "Gordura", value: planoInfo?.macros?.gordura ?? 60 },
        ];
        setMessages((prev) => [...prev, { role: "assistant", content: "Aqui está o gráfico solicitado:", type: "chart", chartData }]);
        speakText("Aqui está o gráfico solicitado.");
      } else {
        await simulateTyping(text);
      }
    } catch {
      await simulateTyping("Estou à disposição para sua NUTRIÇÃO: revisão do cardápio, substituições, pré/pós-treino e gráficos. Vamos focar nisso! 💚");
    } finally { setLoading(false); }
  };

  // ===== Microfone =====
  const startRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) { alert("Seu navegador não suporta reconhecimento de voz."); return; }
    const rec = new (window as any).webkitSpeechRecognition();
    rec.lang = "pt-BR"; rec.interimResults = false; rec.continuous = false;
    rec.onstart = () => setRecognizing(true);
    rec.onresult = (e: any) => { const t = e.results[0][0].transcript; setInput(t); sendMessage(t); };
    rec.onend = () => setRecognizing(false);
    rec.start();
  };

  // ===== Saudação contextual =====
  const contextualGreeting = () => {
    let msg = "";
    if (planoInfo.calorias && planoInfo.objetivo) {
      msg = `Plano atual: ~${planoInfo.calorias} kcal para ${planoInfo.objetivo.toLowerCase()}. Posso analisar foto da refeição, auto-ajustar o plano, sugerir substituições ou exibir gráficos.`;
    } else {
      msg = "Envie uma foto da refeição, peça gráficos de macros/IG/CG ou solicite auto-ajuste do plano com base no seu histórico.";
    }
    simulateTyping(msg);
  };

  // ===== Upload de foto (Visão) =====
  const onUploadPhoto = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = (reader.result as string).split(",")[1];
        setMessages((prev)=>[...prev, { role: "user", content: "Enviei uma foto da refeição." }]);
        const r = await fetch("/api/vision", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64, language: "pt-BR" })
        });
        const data = await r.json();
        const txt = data.analysis || "Análise indisponível agora.";
        setMessages((prev)=>[...prev, { role: "assistant", content: txt, type: "vision" }]);
        speakText(txt);
      } catch { await simulateTyping("Não consegui analisar a foto agora."); }
    };
    reader.readAsDataURL(file);
  };

  // ===== Auto-ajuste (ADI) =====
  const autoAdjustPlan = async () => {
    try {
      const r = await fetch("/api/adi", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planoAtual: { calorias: planoInfo.calorias || 2000, macros: planoInfo.macros || { proteina:120, carboidrato:220, gordura:60 } },
          historico: { adesao7d: [0.8,0.7,0.9,0.85,0.6,0.8,0.75], fome: 0.5, treino: 0.6, perdaPesoSem2: 0.4 },
          objetivo: (planoInfo.objetivo || "manutenção")
        })
      });
      const data = await r.json();
      const texto =
`Sugestão de ajuste:
• Calorias: ${data.novasCalorias} kcal
• Proteína: ${data.novosMacros.proteina} g
• Carboidrato: ${data.novosMacros.carboidrato} g
• Gordura: ${data.novosMacros.gordura} g
${data.justificativa}`;
      await simulateTyping(texto);
    } catch { await simulateTyping("Não consegui auto-ajustar agora."); }
  };

  // ===== Recomendações =====
  const recommendMeals = async () => {
    try {
      const r = await fetch("/api/recommend", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objetivo: (planoInfo.objetivo || "manutenção").toLowerCase() })
      });
      const data = await r.json();
      const linhas = (data.recomendacoes||[]).map((x:any)=>`• ${x.title} — ${x.motivo}`).join("\n");
      await simulateTyping(linhas || "Sem recomendações no momento.");
    } catch { await simulateTyping("Não consegui gerar recomendações agora."); }
  };

  // ===== UI =====
  const QuickActions = () => (
    <div className="flex flex-wrap gap-2 mt-3">
      {[
        { label: "Auto-ajustar Plano", on: autoAdjustPlan },
        { label: "Recomendar Refeições", on: recommendMeals },
        { label: "Mostrar gráfico de macros", on: ()=>sendMessage("Mostrar gráfico de macros") },
      ].map((a, i) => (
        <button key={i} onClick={a.on} className="text-xs px-3 py-2 rounded-full border border-gray-300 hover:bg-gray-200 transition-all text-gray-700">
          {a.label}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => { setIsOpen(true); setTimeout(contextualGreeting, 800); }}
          className={`fixed bottom-6 right-6 bg-gradient-to-r ${colors.button} text-white rounded-full p-4 shadow-xl hover:shadow-2xl transition-all z-50 hover:scale-110`}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 01-2 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[680px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 transition-all duration-300 ease-in-out animate-fadeIn">
          <div className={`bg-gradient-to-r ${colors.primary} text-white p-4 rounded-t-2xl flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl">🤖</div>
              <div><h3 className="font-semibold">NFC Assistant</h3><p className="text-xs text-green-100">Online</p></div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                title={voiceEnabled ? "Desativar voz" : "Ativar voz"}
                className="text-white hover:bg-white/20 rounded-lg p-2"
              >
                {voiceEnabled ? "🔊" : "🔇"}
              </button>
              <button onClick={() => setIsOpen(false)} title="Fechar" className="text-white hover:bg-white/20 rounded-lg p-2">❌</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === "user" ? `bg-gradient-to-r ${colors.button} text-white` : "bg-white text-gray-800 shadow-sm border border-gray-100"}`}>
                  {msg.type === "chart" ? (
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie dataKey="value" data={msg.chartData} cx="50%" cy="50%" outerRadius={60} label>
                          {msg.chartData!.map((_: any, i: number) => (<Cell key={i} fill={["#10b981", "#3b82f6", "#f59e0b"][i % 3]} />))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  )}
                  {msg.role === "assistant" && idx === messages.length - 1 && !typing && <QuickActions />}
                </div>
              </div>
            ))}
            {loading && <p className="text-gray-500 text-sm">Digitando...</p>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl flex gap-2">
            <label className="px-3 py-3 rounded-xl border border-gray-300 hover:bg-gray-50 cursor-pointer text-sm">
              📷 Enviar Foto
              <input type="file" accept="image/*" className="hidden" onChange={(e)=>{const f=e.target.files?.[0]; if(f) onUploadPhoto(f);}} />
            </label>
            <button onClick={() => {
              if (!("webkitSpeechRecognition" in window)) { alert("Seu navegador não suporta reconhecimento de voz."); return; }
              const rec = new (window as any).webkitSpeechRecognition();
              rec.lang = "pt-BR"; rec.interimResults = false; rec.continuous = false;
              rec.onstart = () => setRecognizing(true);
              rec.onresult = (e: any) => { const t = e.results[0][0].transcript; setInput(t); sendMessage(t); };
              rec.onend = () => setRecognizing(false);
              rec.start();
            }} className={`p-3 rounded-full ${recognizing ? "bg-red-500" : "bg-gray-200"} text-white transition-all`} title="Falar com o assistente">🎤</button>
            <input type="text" value={input} onChange={(e)=>setInput(e.target.value)} onKeyPress={(e)=>e.key==="Enter"&&sendMessage()} placeholder="Digite ou fale..." disabled={loading} className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 text-sm" />
            <button onClick={()=>sendMessage()} disabled={loading||!input.trim()} className={`bg-gradient-to-r ${colors.button} text-white px-5 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50`}>📩</button>
          </div>
        </div>
      )}
    </>
  );
}
