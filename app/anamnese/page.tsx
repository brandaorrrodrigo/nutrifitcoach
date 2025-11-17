'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  nome: string; email: string; telefone: string; dataNascimento: string; sexo: string;
  estadoCivil: string; profissao: string; peso: string; altura: string;
  circunferenciaCintura: string; circunferenciaQuadril: string; circunferenciaBraco: string;
  circunferenciaCoxa: string; circunferenciaPanturrilha: string; percentualGordura: string;
  massaMagra: string; doencasPreExistentes: string[]; cirurgias: string; medicamentos: string;
  suplementos: string; alergias: string; intolerancias: string; glicemia: string;
  colesterolTotal: string; hdl: string; ldl: string; triglicerideos: string; tsh: string;
  t3: string; t4: string; vitaminaD: string; vitaminaB12: string; dietasAnteriores: string;
  tempoUltimaDieta: string; resultadosObtidos: string; motivoParada: string; horasSono: string;
  qualidadeSono: string; nivelEstresse: string; tipoTrabalho: string; horarioTrabalho: string;
  consumoAgua: string; consumoAlcool: string; fumante: boolean; praticaExercicio: boolean;
  tipoExercicio: string; frequenciaSemanal: string; duracaoTreino: string; objetivoTreino: string;
  cicloMenstrual: string; usaAnticoncepcional: boolean; amamentando: boolean; gestante: boolean;
  menopausa: boolean; sintomaTpm: string[]; problemasProstata: boolean; calvicie: boolean;
  objetivo: string; metaPeso: string; prazoDesejado: string; motivacaoPrincipal: string;
  jaFezDieta: boolean; expectativas: string; belisca: boolean; comeCompulsivo: boolean;
  comePorAnsiedade: boolean; prefereDoce: boolean; prefereSalgado: boolean; pulaPefeicoes: boolean;
  alimentosQueGosta: string; alimentosQueNaoGosta: string; restricoesReligiosas: string;
  dietasEspecificas: string[];
}

export default function AnamneseCompleta() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [examesFiles, setExamesFiles] = useState<File[]>([]);
  const [fotosFiles, setFotosFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<FormData>({
    nome: '', email: '', telefone: '', dataNascimento: '', sexo: 'masculino',
    estadoCivil: '', profissao: '', peso: '', altura: '', circunferenciaCintura: '',
    circunferenciaQuadril: '', circunferenciaBraco: '', circunferenciaCoxa: '',
    circunferenciaPanturrilha: '', percentualGordura: '', massaMagra: '',
    doencasPreExistentes: [], cirurgias: '', medicamentos: '', suplementos: '',
    alergias: '', intolerancias: '', glicemia: '', colesterolTotal: '', hdl: '',
    ldl: '', triglicerideos: '', tsh: '', t3: '', t4: '', vitaminaD: '',
    vitaminaB12: '', dietasAnteriores: '', tempoUltimaDieta: '', resultadosObtidos: '',
    motivoParada: '', horasSono: '', qualidadeSono: '', nivelEstresse: '',
    tipoTrabalho: '', horarioTrabalho: '', consumoAgua: '', consumoAlcool: '',
    fumante: false, praticaExercicio: false, tipoExercicio: '', frequenciaSemanal: '',
    duracaoTreino: '', objetivoTreino: '', cicloMenstrual: '', usaAnticoncepcional: false,
    amamentando: false, gestante: false, menopausa: false, sintomaTpm: [],
    problemasProstata: false, calvicie: false, objetivo: '', metaPeso: '',
    prazoDesejado: '', motivacaoPrincipal: '', jaFezDieta: false, expectativas: '',
    belisca: false, comeCompulsivo: false, comePorAnsiedade: false, prefereDoce: false,
    prefereSalgado: false, pulaPefeicoes: false, alimentosQueGosta: '',
    alimentosQueNaoGosta: '', restricoesReligiosas: '', dietasEspecificas: []
  });

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const examesUrls: string[] = [];
      const fotosUrls: string[] = [];
      
      for (const file of examesFiles) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload-foto', { method: 'POST', body: fd });
        const data = await res.json();
        examesUrls.push(data.url);
      }
      
      for (const file of fotosFiles) {
        const fd = new FormData();
        fd.append('file', file);
        const res = await fetch('/api/upload-foto', { method: 'POST', body: fd });
        const data = await res.json();
        fotosUrls.push(data.url);
      }
      
      const response = await fetch('/api/anamnese-completa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, examesUrls, fotosUrls })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('plano', JSON.stringify(data.plano));
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        userData.points = (userData.points || 0) + 100;
        if (!userData.badges) userData.badges = [];
        if (!userData.badges.includes('COMPLETE_PROFILE')) {
          userData.badges.push('COMPLETE_PROFILE');
          userData.points += 50;
        }
        localStorage.setItem('userData', JSON.stringify(userData));
        router.push('/selecionar-dieta');
      } else {
        alert('Erro ao salvar anamnese');
      }
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar anamnese');
    } finally {
      setLoading(false);
    }
  };

  const totalSteps = 10;
  const progressPercent = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-green-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 via-green-600 to-purple-600 bg-clip-text text-transparent">
            🏥 Anamnese Nutricional Completa
          </h1>
          <p className="text-xl text-gray-700">Etapa {step} de {totalSteps}</p>
        </div>

        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-gradient-to-r from-cyan-500 via-green-500 to-purple-600 h-4 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Início</span><span>{Math.round(progressPercent)}%</span><span>Conclusão</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 border-2 border-gray-200">
          
          {/* STEP 1-4 já criados anteriormente */}
          
          {/* STEP 5: HISTÓRICO ALIMENTAR */}
          {step === 5 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">🍽️ Histórico Alimentar</h2>
              
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Já fez dietas antes?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={formData.jaFezDieta} onChange={() => updateField('jaFezDieta', true)} />
                    <span>Sim</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={!formData.jaFezDieta} onChange={() => updateField('jaFezDieta', false)} />
                    <span>Não</span>
                  </label>
                </div>
              </div>

              {formData.jaFezDieta && (
                <>
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Quais dietas você já fez?</label>
                    <textarea value={formData.dietasAnteriores} onChange={(e) => updateField('dietasAnteriores', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" rows={3} placeholder="Ex: Low carb, jejum intermitente, dieta dos pontos..." />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">Quanto tempo fez a última dieta?</label>
                      <input type="text" value={formData.tempoUltimaDieta} onChange={(e) => updateField('tempoUltimaDieta', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" placeholder="Ex: 3 meses, 1 ano..." />
                    </div>

                    <div>
                      <label className="block font-semibold mb-2 text-gray-700">Resultados obtidos?</label>
                      <input type="text" value={formData.resultadosObtidos} onChange={(e) => updateField('resultadosObtidos', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" placeholder="Ex: Perdi 8kg" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Por que parou?</label>
                    <textarea value={formData.motivoParada} onChange={(e) => updateField('motivoParada', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" rows={2} placeholder="Descreva o motivo..." />
                  </div>
                </>
              )}
            </div>
          )}

          {/* STEP 6: ROTINA E ESTILO DE VIDA */}
          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">😴 Rotina e Estilo de Vida</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Quantas horas dorme por noite? *</label>
                  <input type="number" step="0.5" value={formData.horasSono} onChange={(e) => updateField('horasSono', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" placeholder="Ex: 7.5" required />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Qualidade do sono *</label>
                  <select value={formData.qualidadeSono} onChange={(e) => updateField('qualidadeSono', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900">
                    <option value="">Selecione</option>
                    <option value="excelente">Excelente</option>
                    <option value="boa">Boa</option>
                    <option value="regular">Regular</option>
                    <option value="ruim">Ruim</option>
                    <option value="pessima">Péssima</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Nível de Estresse *</label>
                  <select value={formData.nivelEstresse} onChange={(e) => updateField('nivelEstresse', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900">
                    <option value="">Selecione</option>
                    <option value="baixo">Baixo</option>
                    <option value="moderado">Moderado</option>
                    <option value="alto">Alto</option>
                    <option value="muito-alto">Muito Alto</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Tipo de Trabalho *</label>
                  <select value={formData.tipoTrabalho} onChange={(e) => updateField('tipoTrabalho', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900">
                    <option value="">Selecione</option>
                    <option value="sedentario">Sedentário (sentado o dia todo)</option>
                    <option value="leve">Levemente ativo (em pé algumas horas)</option>
                    <option value="moderado">Moderadamente ativo</option>
                    <option value="intenso">Muito ativo (trabalho físico)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Horário de Trabalho</label>
                  <input type="text" value={formData.horarioTrabalho} onChange={(e) => updateField('horarioTrabalho', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" placeholder="Ex: 8h às 18h" />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Consumo de Água (litros/dia) *</label>
                  <input type="number" step="0.5" value={formData.consumoAgua} onChange={(e) => updateField('consumoAgua', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" placeholder="Ex: 2.0" />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Consumo de Álcool</label>
                  <select value={formData.consumoAlcool} onChange={(e) => updateField('consumoAlcool', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900">
                    <option value="">Selecione</option>
                    <option value="nao-bebe">Não bebe</option>
                    <option value="ocasional">Ocasional (festas)</option>
                    <option value="social">Social (1-2x semana)</option>
                    <option value="frequente">Frequente (3-5x semana)</option>
                    <option value="diario">Diário</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Fuma?</label>
                  <div className="flex gap-4 mt-3">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" checked={formData.fumante} onChange={(e) => updateField('fumante', e.target.checked)} className="w-5 h-5" />
                      <span>Sim, sou fumante</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: ATIVIDADE FÍSICA */}
          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">🏃 Atividade Física</h2>
              
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Pratica exercícios físicos?</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={formData.praticaExercicio} onChange={() => updateField('praticaExercicio', true)} />
                    <span>Sim</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" checked={!formData.praticaExercicio} onChange={() => updateField('praticaExercicio', false)} />
                    <span>Não</span>
                  </label>
                </div>
              </div>

              {formData.praticaExercicio && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Tipo de Exercício</label>
                    <select value={formData.tipoExercicio} onChange={(e) => updateField('tipoExercicio', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900">
                      <option value="">Selecione</option>
                      <option value="musculacao">Musculação</option>
                      <option value="crossfit">CrossFit</option>
                      <option value="corrida">Corrida</option>
                      <option value="natacao">Natação</option>
                      <option value="ciclismo">Ciclismo</option>
                      <option value="lutas">Lutas/Artes Marciais</option>
                      <option value="pilates">Pilates/Yoga</option>
                      <option value="funcional">Treino Funcional</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Frequência Semanal</label>
                    <select value={formData.frequenciaSemanal} onChange={(e) => updateField('frequenciaSemanal', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900">
                      <option value="">Selecione</option>
                      <option value="1-2">1-2x por semana</option>
                      <option value="3-4">3-4x por semana</option>
                      <option value="5-6">5-6x por semana</option>
                      <option value="7">Todos os dias</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Duração do Treino</label>
                    <select value={formData.duracaoTreino} onChange={(e) => updateField('duracaoTreino', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900">
                      <option value="">Selecione</option>
                      <option value="30min">30 minutos</option>
                      <option value="45min">45 minutos</option>
                      <option value="1h">1 hora</option>
                      <option value="1h30">1h30</option>
                      <option value="2h">2 horas ou mais</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Objetivo do Treino</label>
                    <select value={formData.objetivoTreino} onChange={(e) => updateField('objetivoTreino', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900">
                      <option value="">Selecione</option>
                      <option value="emagrecimento">Emagrecimento</option>
                      <option value="hipertrofia">Ganho de Massa Muscular</option>
                      <option value="performance">Performance/Rendimento</option>
                      <option value="saude">Saúde e Bem-estar</option>
                      <option value="condicionamento">Condicionamento</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 8: ESPECÍFICO POR GÊNERO */}
          {step === 8 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {formData.sexo === 'feminino' ? '👩 Saúde da Mulher' : '👨 Saúde do Homem'}
              </h2>
              
              {formData.sexo === 'feminino' ? (
                <>
                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Ciclo Menstrual</label>
                    <select value={formData.cicloMenstrual} onChange={(e) => updateField('cicloMenstrual', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900">
                      <option value="">Selecione</option>
                      <option value="regular">Regular (28-35 dias)</option>
                      <option value="irregular">Irregular</option>
                      <option value="ausente">Ausente (amenorreia)</option>
                      <option value="menopausa">Menopausa</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                      <input type="checkbox" checked={formData.usaAnticoncepcional} onChange={(e) => updateField('usaAnticoncepcional', e.target.checked)} className="w-5 h-5" />
                      <span className="font-semibold">Usa anticoncepcional</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                      <input type="checkbox" checked={formData.gestante} onChange={(e) => updateField('gestante', e.target.checked)} className="w-5 h-5" />
                      <span className="font-semibold">Gestante</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                      <input type="checkbox" checked={formData.amamentando} onChange={(e) => updateField('amamentando', e.target.checked)} className="w-5 h-5" />
                      <span className="font-semibold">Amamentando</span>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                      <input type="checkbox" checked={formData.menopausa} onChange={(e) => updateField('menopausa', e.target.checked)} className="w-5 h-5" />
                      <span className="font-semibold">Menopausa</span>
                    </label>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2 text-gray-700">Sintomas de TPM</label>
                    <div className="grid md:grid-cols-2 gap-3">
                      {['Inchaço', 'Cólicas', 'Dor de cabeça', 'Irritabilidade', 'Ansiedade', 'Compulsão alimentar', 'Fadiga', 'Nenhum'].map(sintoma => (
                        <label key={sintoma} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                          <input type="checkbox" checked={formData.sintomaTpm.includes(sintoma)} onChange={(e) => {
                            if (e.target.checked) {
                              updateField('sintomaTpm', [...formData.sintomaTpm, sintoma]);
                            } else {
                              updateField('sintomaTpm', formData.sintomaTpm.filter(s => s !== sintoma));
                            }
                          }} className="w-5 h-5" />
                          <span>{sintoma}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" checked={formData.problemasProstata} onChange={(e) => updateField('problemasProstata', e.target.checked)} className="w-5 h-5" />
                    <span className="font-semibold">Problemas de próstata</span>
                  </label>

                  <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" checked={formData.calvicie} onChange={(e) => updateField('calvicie', e.target.checked)} className="w-5 h-5" />
                    <span className="font-semibold">Calvície/Queda de cabelo</span>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* STEP 9: OBJETIVOS DETALHADOS */}
          {step === 9 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">🎯 Seus Objetivos</h2>
              
              <div>
                <label className="block font-semibold mb-2 text-gray-700">Objetivo Principal *</label>
                <select value={formData.objetivo} onChange={(e) => updateField('objetivo', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" required>
                  <option value="">Selecione</option>
                  <option value="perda de peso">Perda de Peso</option>
                  <option value="ganho de massa">Ganho de Massa Muscular</option>
                  <option value="manutencao">Manutenção/Saúde</option>
                  <option value="performance">Performance Esportiva</option>
                  <option value="recomposicao">Recomposição Corporal</option>
                </select>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Meta de Peso (kg)</label>
                  <input type="number" step="0.1" value={formData.metaPeso} onChange={(e) => updateField('metaPeso', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" placeholder="Ex: 70.0" />
                </div>

                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Prazo Desejado</label>
                  <select value={formData.prazoDesejado} onChange={(e) => updateField('prazoDesejado', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900">
                    <option value="">Selecione</option>
                    <option value="1-mes">1 mês</option>
                    <option value="2-meses">2 meses</option>
                    <option value="3-meses">3 meses</option>
                    <option value="6-meses">6 meses</option>
                    <option value="1-ano">1 ano</option>
                    <option value="sem-pressa">Sem pressa, no meu ritmo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">Qual sua MAIOR motivação? *</label>
                <textarea value={formData.motivacaoPrincipal} onChange={(e) => updateField('motivacaoPrincipal', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" rows={3} placeholder="Ex: Melhorar minha saúde, ter mais disposição, sentir-me bem comigo..." required />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">O que você espera deste programa?</label>
                <textarea value={formData.expectativas} onChange={(e) => updateField('expectativas', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" rows={3} placeholder="Compartilhe suas expectativas..." />
              </div>
            </div>
          )}

          {/* STEP 10: COMPORTAMENTO E PREFERÊNCIAS */}
          {step === 10 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">🍴 Comportamento Alimentar</h2>
              
              <div>
                <label className="block font-semibold mb-3 text-gray-700">Marque os comportamentos que você tem:</label>
                <div className="grid md:grid-cols-2 gap-3">
                  <label className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" checked={formData.belisca} onChange={(e) => updateField('belisca', e.target.checked)} className="w-5 h-5" />
                    <span>Belisca entre refeições</span>
                  </label>

                  <label className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" checked={formData.comeCompulsivo} onChange={(e) => updateField('comeCompulsivo', e.target.checked)} className="w-5 h-5" />
                    <span>Come compulsivamente</span>
                  </label>

                  <label className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" checked={formData.comePorAnsiedade} onChange={(e) => updateField('comePorAnsiedade', e.target.checked)} className="w-5 h-5" />
                    <span>Come por ansiedade/estresse</span>
                  </label>

                  <label className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" checked={formData.pulaPefeicoes} onChange={(e) => updateField('pulaPefeicoes', e.target.checked)} className="w-5 h-5" />
                    <span>Pula refeições</span>
                  </label>

                  <label className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" checked={formData.prefereDoce} onChange={(e) => updateField('prefereDoce', e.target.checked)} className="w-5 h-5" />
                    <span>Prefere doces</span>
                  </label>

                  <label className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" checked={formData.prefereSalgado} onChange={(e) => updateField('prefereSalgado', e.target.checked)} className="w-5 h-5" />
                    <span>Prefere salgados</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">Alimentos que você GOSTA *</label>
                <textarea value={formData.alimentosQueGosta} onChange={(e) => updateField('alimentosQueGosta', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" rows={3} placeholder="Liste os alimentos que você ama e come com prazer" required />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">Alimentos que você NÃO GOSTA *</label>
                <textarea value={formData.alimentosQueNaoGosta} onChange={(e) => updateField('alimentosQueNaoGosta', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" rows={3} placeholder="Liste os alimentos que você não quer no cardápio" required />
              </div>

              <div>
                <label className="block font-semibold mb-2 text-gray-700">Restrições Religiosas/Culturais</label>
                <input type="text" value={formData.restricoesReligiosas} onChange={(e) => updateField('restricoesReligiosas', e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl text-gray-900" placeholder="Ex: Não como carne de porco, Vegetariano..." />
              </div>

              <div>
                <label className="block font-semibold mb-3 text-gray-700">Segue alguma dieta específica?</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {['Vegetariana', 'Vegana', 'Low Carb', 'Cetogênica', 'Paleo', 'Sem Glúten', 'Sem Lactose', 'Nenhuma'].map(dieta => (
                    <label key={dieta} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                      <input type="checkbox" checked={formData.dietasEspecificas.includes(dieta)} onChange={(e) => {
                        if (e.target.checked) {
                          updateField('dietasEspecificas', [...formData.dietasEspecificas, dieta]);
                        } else {
                          updateField('dietasEspecificas', formData.dietasEspecificas.filter(d => d !== dieta));
                        }
                      }} className="w-5 h-5" />
                      <span>{dieta}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
                <p className="text-xl font-bold text-gray-900 mb-3">🎉 Parabéns! Você está quase lá!</p>
                <p className="text-gray-700">Suas informações serão analisadas por nossa IA para criar o plano nutricional PERFEITO para você!</p>
              </div>
            </div>
          )}

          {/* NAVEGAÇÃO */}
          <div className="flex justify-between mt-8 pt-8 border-t-2 border-gray-200">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold text-lg hover:bg-gray-300">
                ← Voltar
              </button>
            )}
            
            {step < 10 ? (
              <button onClick={() => setStep(step + 1)} className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold text-lg ml-auto hover:shadow-xl">
                Próximo →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="px-12 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-xl ml-auto hover:shadow-xl disabled:opacity-50">
                {loading ? '⏳ Processando...' : '🎉 Finalizar e Gerar Plano'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

