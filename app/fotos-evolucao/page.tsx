'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  calculateGamificationData,
  getConsistencyEmoji,
  formatWeightChange,
  formatBodyFatChange
} from '@/lib/gamification/progress-metrics';

// Tipos
interface ProgressPhoto {
  id: string;
  photoType: 'frontal' | 'posterior' | 'lado_direito' | 'lado_esquerdo';
  watermarkedUrl: string;
  thumbUrl: string;
  width: number;
  height: number;
  takenAt: string;
  sharedTo: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
}

interface ProgressSession {
  id: string;
  sessionDate: string;
  weightKg: number;
  heightCm: number;
  ageYears: number;
  bodyFatPercent: number | null;
  bmi: number | null;
  leanMassKg: number | null;
  fatMassKg: number | null;
  isComplete: boolean;
  photosCount: number;
  notes: string | null;
  photos: ProgressPhoto[];
  comparison?: {
    weightChangeKg: number;
    bfChangePercent: number | null;
    daysSinceLast: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface ValidationError {
  field: string;
  message: string;
}

const PHOTO_TYPE_LABELS = {
  frontal: 'Frontal',
  posterior: 'Costas',
  lado_direito: 'Lado Direito',
  lado_esquerdo: 'Lado Esquerdo'
} as const;

const PHOTO_TYPE_DESCRIPTIONS = {
  frontal: 'De frente, braços ao lado do corpo',
  posterior: 'De costas, braços ao lado do corpo',
  lado_direito: 'Perfil direito, braços ao lado',
  lado_esquerdo: 'Perfil esquerdo, braços ao lado'
} as const;

const PHOTO_TYPE_ICONS = {
  frontal: '👤',
  posterior: '🔄',
  lado_direito: '➡️',
  lado_esquerdo: '⬅️'
} as const;

// Constantes de validação
const VALIDATION_RULES = {
  weight: { min: 30, max: 300 },
  height: { min: 100, max: 250 },
  age: { min: 10, max: 100 },
  bodyFat: { min: 3, max: 70 }
} as const;

// Componente de foto com marca d'água
function WatermarkedPhoto({ imageUrl, photoType }: { imageUrl: string; photoType: string }) {
  return (
    <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-slate-800/50 group">
      <img
        src={imageUrl}
        alt={PHOTO_TYPE_LABELS[photoType as keyof typeof PHOTO_TYPE_LABELS]}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {/* Overlay de marca d'água visual */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent h-20" />
        <div className="absolute bottom-2 right-2 text-white/70 text-[10px] font-semibold backdrop-blur-sm bg-black/30 px-2 py-1 rounded">
          NutriFitCoach
        </div>
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
    </div>
  );
}

function FotosEvolucaoContent() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sessions, setSessions] = useState<ProgressSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Estados para novo upload
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [uploadData, setUploadData] = useState({
    weight: '',
    height: '',
    age: '',
    bodyFat: '',
    notes: ''
  });
  const [selectedPhotos, setSelectedPhotos] = useState<{
    frontal: File | null;
    posterior: File | null;
    lado_direito: File | null;
    lado_esquerdo: File | null;
  }>({
    frontal: null,
    posterior: null,
    lado_direito: null,
    lado_esquerdo: null
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{
    frontal: boolean;
    posterior: boolean;
    lado_direito: boolean;
    lado_esquerdo: boolean;
  }>({
    frontal: false,
    posterior: false,
    lado_direito: false,
    lado_esquerdo: false
  });

  // Refs para inputs de arquivo
  const fileInputRefs = {
    frontal: useRef<HTMLInputElement>(null),
    posterior: useRef<HTMLInputElement>(null),
    lado_direito: useRef<HTMLInputElement>(null),
    lado_esquerdo: useRef<HTMLInputElement>(null)
  };

  // Verificar autenticação
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Carregar sessões
  useEffect(() => {
    if (status === 'authenticated') {
      fetchSessions();
    }
  }, [status]);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('/api/progress-photos/sessions', {
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erro ao carregar sessões' }));
        throw new Error(errorData.error || 'Erro ao carregar sessões');
      }

      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Erro ao buscar sessões:', err);
      const message = err instanceof Error ? err.message : 'Erro ao carregar fotos';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Validação de formulário
  const validateForm = (): boolean => {
    const errors: ValidationError[] = [];

    // Validar peso
    const weight = parseFloat(uploadData.weight);
    if (!uploadData.weight || isNaN(weight)) {
      errors.push({ field: 'weight', message: 'Peso é obrigatório' });
    } else if (weight < VALIDATION_RULES.weight.min || weight > VALIDATION_RULES.weight.max) {
      errors.push({
        field: 'weight',
        message: `Peso deve estar entre ${VALIDATION_RULES.weight.min} e ${VALIDATION_RULES.weight.max} kg`
      });
    }

    // Validar altura
    const height = parseFloat(uploadData.height);
    if (!uploadData.height || isNaN(height)) {
      errors.push({ field: 'height', message: 'Altura é obrigatória' });
    } else if (height < VALIDATION_RULES.height.min || height > VALIDATION_RULES.height.max) {
      errors.push({
        field: 'height',
        message: `Altura deve estar entre ${VALIDATION_RULES.height.min} e ${VALIDATION_RULES.height.max} cm`
      });
    }

    // Validar idade
    const age = parseInt(uploadData.age);
    if (!uploadData.age || isNaN(age)) {
      errors.push({ field: 'age', message: 'Idade é obrigatória' });
    } else if (age < VALIDATION_RULES.age.min || age > VALIDATION_RULES.age.max) {
      errors.push({
        field: 'age',
        message: `Idade deve estar entre ${VALIDATION_RULES.age.min} e ${VALIDATION_RULES.age.max} anos`
      });
    }

    // Validar % gordura (opcional)
    if (uploadData.bodyFat) {
      const bodyFat = parseFloat(uploadData.bodyFat);
      if (isNaN(bodyFat) || bodyFat < VALIDATION_RULES.bodyFat.min || bodyFat > VALIDATION_RULES.bodyFat.max) {
        errors.push({
          field: 'bodyFat',
          message: `% Gordura deve estar entre ${VALIDATION_RULES.bodyFat.min} e ${VALIDATION_RULES.bodyFat.max}%`
        });
      }
    }

    // Validar pelo menos uma foto
    const photosToUpload = Object.values(selectedPhotos).filter(file => file !== null);
    if (photosToUpload.length === 0) {
      errors.push({ field: 'photos', message: 'Selecione pelo menos uma foto' });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handlePhotoSelect = (photoType: keyof typeof selectedPhotos, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Formato inválido. Use JPEG, PNG ou WebP');
      setTimeout(() => setError(''), 5000);
      return;
    }

    // Validar tamanho (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Arquivo muito grande. Tamanho máximo: 10MB');
      setTimeout(() => setError(''), 5000);
      return;
    }

    setSelectedPhotos(prev => ({
      ...prev,
      [photoType]: file
    }));

    // Limpar erro de fotos se houver
    setValidationErrors(prev => prev.filter(e => e.field !== 'photos'));
  };

  const handleUploadSession = async () => {
    // Limpar mensagens anteriores
    setError('');
    setSuccessMessage('');
    setValidationErrors([]);

    // Validar formulário
    if (!validateForm()) {
      setError('Por favor, corrija os erros no formulário');
      return;
    }

    try {
      setUploading(true);
      let sessionId = currentSessionId;

      const photosToUpload = Object.entries(selectedPhotos).filter(([_, file]) => file !== null) as Array<[string, File]>;

      // Upload de cada foto
      for (const [photoType, file] of photosToUpload) {
        setUploadProgress(prev => ({ ...prev, [photoType]: true }));

        const formData = new FormData();
        formData.append('photo', file);
        formData.append('photoType', photoType);
        formData.append('weight', uploadData.weight);
        formData.append('height', uploadData.height);
        formData.append('age', uploadData.age);
        if (uploadData.bodyFat) {
          formData.append('bodyFat', uploadData.bodyFat);
        }
        if (uploadData.notes) {
          formData.append('notes', uploadData.notes);
        }
        if (sessionId) {
          formData.append('sessionId', sessionId);
        }

        const response = await fetch('/api/progress-photos/upload', {
          method: 'POST',
          credentials: 'include',
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Erro ao fazer upload' }));
          throw new Error(errorData.error || 'Erro ao fazer upload');
        }

        const result = await response.json();

        // Salvar sessionId para próximas fotos
        if (!sessionId) {
          sessionId = result.session.id;
          setCurrentSessionId(sessionId);
        }
      }

      // Sucesso!
      setSuccessMessage('Fotos salvas com sucesso! Esse registro será muito importante para acompanhar sua jornada.');
      setShowUploadModal(false);
      resetUploadForm();
      await fetchSessions();

    } catch (err) {
      console.error('Erro no upload:', err);
      const message = err instanceof Error ? err.message : 'Erro ao enviar fotos. Tente novamente.';
      setError(message);
    } finally {
      setUploading(false);
      setUploadProgress({
        frontal: false,
        posterior: false,
        lado_direito: false,
        lado_esquerdo: false
      });
    }
  };

  const resetUploadForm = () => {
    setUploadData({
      weight: '',
      height: '',
      age: '',
      bodyFat: '',
      notes: ''
    });
    setSelectedPhotos({
      frontal: null,
      posterior: null,
      lado_direito: null,
      lado_esquerdo: null
    });
    setCurrentSessionId(null);
    setValidationErrors([]);
  };

  const handleShare = async (photoUrl: string, photoType: string) => {
    try {
      // Web Share API
      if (navigator.share) {
        await navigator.share({
          title: 'Minha Evolução - NutriFitCoach',
          text: `Confira minha evolução (${PHOTO_TYPE_LABELS[photoType as keyof typeof PHOTO_TYPE_LABELS]})!`,
          url: window.location.origin + photoUrl
        });
      } else {
        // Fallback: copiar link
        await navigator.clipboard.writeText(window.location.origin + photoUrl);
        setSuccessMessage('Link copiado para a área de transferência!');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    } catch (err) {
      console.error('Erro ao compartilhar:', err);
      // Silenciar erro se usuário cancelar compartilhamento
    }
  };

  const handleDownload = (photoUrl: string, photoType: string) => {
    try {
      const link = document.createElement('a');
      link.href = photoUrl;
      link.download = `evolucao_${photoType}_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Erro ao baixar foto:', err);
      setError('Erro ao baixar foto. Tente novamente.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getFieldError = (field: string): string | undefined => {
    return validationErrors.find(e => e.field === field)?.message;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Carregando sua evolução...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">

        {/* HERO SECTION */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
            <span className="text-2xl">📸</span>
            <span className="text-emerald-400 font-semibold text-sm">Registro de Evolução</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Fotos de Evolução
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-2">
            Registre sua evolução física com fotos padronizadas e acompanhe seu progresso ao longo do tempo
          </p>

          <p className="text-emerald-400 font-medium">
            Cada registro é um passo a mais na sua transformação
          </p>
        </div>

        {/* MENSAGENS DE FEEDBACK */}
        {successMessage && (
          <div className="mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div className="flex-1">
                <p className="text-emerald-400 font-medium">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {validationErrors.length > 0 && (
          <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <p className="text-yellow-400 font-semibold mb-2">Corrija os seguintes erros:</p>
                <ul className="list-disc list-inside text-yellow-300 text-sm space-y-1">
                  {validationErrors.map((err, idx) => (
                    <li key={idx}>{err.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* INDICADORES MOTIVACIONAIS DE GAMIFICAÇÃO */}
        {/* FUTURO: Expandir para incluir badges, ranking position, e social sharing */}
        {sessions.length > 0 && (() => {
          const gamification = calculateGamificationData(sessions);
          const { consistency, progress, nextMilestone, motivationalMessage } = gamification;
          const emoji = getConsistencyEmoji(consistency.consistencyScore);

          return (
            <div className="mb-12">
              {/* FUTURO: Este card será clicável para abrir página de ranking/leaderboard */}
              <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-500/20 rounded-3xl p-6 sm:p-8 shadow-xl">

                {/* Header com pontuação */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-5xl">{emoji}</div>
                    <div>
                      <h3 className="text-white font-bold text-xl">Sua Jornada</h3>
                      <p className="text-purple-300 text-sm">Continue assim!</p>
                    </div>
                  </div>
                  {/* FUTURO: NFC Score será usado no ranking global */}
                  <div className="text-right">
                    <div className="text-purple-300 text-xs font-medium mb-1">Consistência</div>
                    <div className="text-3xl font-bold text-white">{consistency.consistencyScore}</div>
                    <div className="text-purple-400 text-xs">/ 100</div>
                  </div>
                </div>

                {/* Mensagem motivacional */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/10">
                  <p className="text-white text-center font-medium">
                    {motivationalMessage}
                  </p>
                </div>

                {/* Métricas em grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">

                  {/* Total de sessões */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-1">📊</div>
                    <div className="text-2xl font-bold text-white">{consistency.totalSessions}</div>
                    <div className="text-purple-300 text-xs">Sessões</div>
                  </div>

                  {/* Dias desde última */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-1">📅</div>
                    <div className="text-2xl font-bold text-white">
                      {consistency.daysSinceLastSession !== null ? consistency.daysSinceLastSession : '-'}
                    </div>
                    <div className="text-purple-300 text-xs">Dias atrás</div>
                  </div>

                  {/* Streak atual */}
                  {/* FUTURO: Gamificar com badges de streak (7, 30, 90 dias) */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-1">🔥</div>
                    <div className="text-2xl font-bold text-white">{consistency.currentStreakDays}</div>
                    <div className="text-purple-300 text-xs">Dias seguidos</div>
                  </div>

                  {/* Progresso de peso */}
                  {/* FUTURO: Usar para ranking de "maior transformação" */}
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                    <div className="text-2xl mb-1">
                      {formatWeightChange(progress.totalWeightChangeLbs).icon}
                    </div>
                    <div className={`text-2xl font-bold ${
                      progress.totalWeightChangeLbs < 0 ? 'text-emerald-400' :
                      progress.totalWeightChangeLbs > 0 ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {progress.totalWeightChangeLbs === 0 ? '-' :
                       `${progress.totalWeightChangeLbs > 0 ? '+' : ''}${progress.totalWeightChangeLbs.toFixed(1)}`}
                    </div>
                    <div className="text-purple-300 text-xs">kg total</div>
                  </div>

                </div>

                {/* Meta sugerida e próximo milestone */}
                <div className="grid sm:grid-cols-2 gap-3">

                  {/* Meta sugerida */}
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🎯</span>
                      <span className="text-cyan-400 font-semibold text-sm">Meta Sugerida</span>
                    </div>
                    <p className="text-white text-sm">
                      Registrar fotos a cada 30 dias
                    </p>
                  </div>

                  {/* Próximo milestone */}
                  {/* FUTURO: Ao atingir milestone, mostrar animação e oferecer compartilhamento social */}
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">🏆</span>
                      <span className="text-yellow-400 font-semibold text-sm">Próximo Badge</span>
                    </div>
                    <p className="text-white text-sm">
                      {nextMilestone}
                    </p>
                  </div>

                </div>

                {/* FUTURO: Botão para compartilhar conquistas no feed NutriFitCoach */}
                {/*
                <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:scale-105 transition-transform">
                  📣 Compartilhar minha evolução no feed
                </button>
                */}

              </div>
            </div>
          );
        })()}

        {/* BOTÃO DE NOVA SESSÃO */}
        <div className="mb-12 text-center">
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105"
          >
            <span className="text-2xl">📷</span>
            Registrar Nova Sessão
          </button>
        </div>

        {/* HISTÓRICO DE SESSÕES */}
        {/* FUTURO: Esta seção se tornará o "feed pessoal" do usuário */}
        {/* FUTURO: Adicionar filtros por período (30/60/90 dias) e tipo de progresso */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Seu histórico de evolução</h2>

          {sessions.length === 0 ? (
            // ESTADO VAZIO
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-3xl p-12 text-center">
              <div className="text-8xl mb-6 opacity-50">📸</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Nenhuma sessão registrada ainda
              </h3>
              <p className="text-slate-400 text-lg mb-8 max-w-md mx-auto">
                Você ainda não registrou suas fotos de evolução. Comece hoje e acompanhe de perto suas mudanças
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                <span>📷</span>
                Começar Agora
              </button>
            </div>
          ) : (
            // LISTA DE SESSÕES
            {/* FUTURO: Cada card de sessão pode se tornar um "post" compartilhável */}
            <div className="space-y-6">
              {sessions.map((session, index) => (
                // FUTURO: Este card será clicável para abrir modal de detalhes expandido
                // FUTURO: Ao clicar, mostrar comparação com sessões anteriores e gráficos de evolução
                <div
                  key={session.id}
                  className={`bg-slate-900/50 backdrop-blur-sm border ${
                    index === 0
                      ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                      : 'border-slate-800'
                  } rounded-2xl p-6 transition-all hover:border-slate-700`}
                >
                  {/* HEADER DA SESSÃO */}
                  {/* FUTURO: Adicionar botões de ação: Editar, Publicar no feed, Deletar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {new Date(session.sessionDate).toLocaleDateString('pt-BR', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </h3>
                        {index === 0 && (
                          <span className="bg-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-1 rounded-full">
                            Mais recente
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm">
                        {session.photosCount} foto{session.photosCount !== 1 ? 's' : ''}
                        {!session.isComplete && (
                          <span className="text-yellow-500"> • Incompleta</span>
                        )}
                      </p>
                    </div>

                    {session.comparison && (
                      <div className="bg-slate-800/50 rounded-xl px-4 py-3">
                        <div className="text-slate-400 text-xs mb-1">
                          {session.comparison.daysSinceLast} dias desde a última
                        </div>
                        <div className={`text-xl font-bold ${
                          session.comparison.weightChangeKg < 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {session.comparison.weightChangeKg > 0 ? '+' : ''}
                          {session.comparison.weightChangeKg.toFixed(1)}kg
                        </div>
                      </div>
                    )}
                  </div>

                  {/* METADADOS */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                      <div className="text-blue-400 text-xs font-medium mb-1">Peso</div>
                      <div className="text-xl font-bold text-white">{session.weightKg}kg</div>
                    </div>
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                      <div className="text-green-400 text-xs font-medium mb-1">Altura</div>
                      <div className="text-xl font-bold text-white">{session.heightCm}cm</div>
                    </div>
                    {session.bmi && (
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3">
                        <div className="text-purple-400 text-xs font-medium mb-1">IMC</div>
                        <div className="text-xl font-bold text-white">{session.bmi.toFixed(1)}</div>
                      </div>
                    )}
                    {session.bodyFatPercent && (
                      <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                        <div className="text-orange-400 text-xs font-medium mb-1">BF%</div>
                        <div className="text-xl font-bold text-white">{session.bodyFatPercent}%</div>
                      </div>
                    )}
                    <div className="bg-slate-700/30 border border-slate-700 rounded-xl p-3">
                      <div className="text-slate-400 text-xs font-medium mb-1">Idade</div>
                      <div className="text-xl font-bold text-white">{session.ageYears}</div>
                    </div>
                  </div>

                  {/* GRID DE FOTOS */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {(['frontal', 'posterior', 'lado_direito', 'lado_esquerdo'] as const).map((photoType) => {
                      const photo = session.photos.find(p => p.photoType === photoType);

                      return (
                        <div key={photoType} className="group">
                          {photo ? (
                            <div className="relative">
                              <WatermarkedPhoto
                                imageUrl={photo.watermarkedUrl}
                                photoType={photoType}
                              />

                              {/* BOTÕES DE AÇÃO */}
                              {/* FUTURO: Adicionar botões de interação social: */}
                              {/* - ❤️ Curtir (exibir contador de likes) */}
                              {/* - 💬 Comentar (abrir modal de comentários) */}
                              {/* - 👁️ Visualizações (analytics) */}
                              {/* - 🏆 Marcar como conquista (highlight no perfil) */}
                              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                <button
                                  onClick={() => handleDownload(photo.watermarkedUrl, photoType)}
                                  className="bg-slate-900/90 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
                                  title="Download"
                                  aria-label="Baixar foto"
                                >
                                  ⬇️
                                </button>
                                {/* FUTURO: Botão de compartilhar abrirá modal com opções: */}
                                {/* - Compartilhar no feed NutriFitCoach (público/seguidores/privado) */}
                                {/* - Compartilhar em redes sociais externas (Instagram, WhatsApp, etc) */}
                                {/* - Gerar link de compartilhamento único */}
                                <button
                                  onClick={() => handleShare(photo.watermarkedUrl, photoType)}
                                  className="bg-slate-900/90 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-slate-800 transition-colors shadow-lg"
                                  title="Compartilhar"
                                  aria-label="Compartilhar foto"
                                >
                                  🔗
                                </button>
                              </div>

                              <div className="text-center mt-2 text-sm font-medium text-slate-400">
                                {PHOTO_TYPE_LABELS[photoType]}
                              </div>
                            </div>
                          ) : (
                            <div className="aspect-[3/4] bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center">
                              <div className="text-4xl mb-2 opacity-30">{PHOTO_TYPE_ICONS[photoType]}</div>
                              <div className="text-xs text-slate-600">Sem foto</div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* NOTAS */}
                  {session.notes && (
                    <div className="mt-6 pt-6 border-t border-slate-800">
                      <div className="text-sm text-slate-400 font-medium mb-2">Observações:</div>
                      <div className="text-slate-300 bg-slate-800/30 rounded-lg p-3">{session.notes}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SEÇÃO DE COMPARTILHAMENTO */}
        {/* FUTURO: Esta seção se tornará o "Social Hub" do NutriFitCoach */}
        {/* FUTURO: Recursos planejados: */}
        {/* - Feed interno NutriFitCoach (público/seguidores/privado) */}
        {/* - Sistema de curtidas e comentários de profissionais certificados */}
        {/* - Integração direta com Instagram, TikTok, WhatsApp Status */}
        {/* - Stories de transformação (antes/depois) */}
        {/* - Desafios mensais com premiações */}
        {/* - Wall of Fame (maiores transformações do mês) */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-8 text-center">
          <div className="text-4xl mb-4">🌟</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Compartilhe sua evolução (quando se sentir pronto)
          </h3>
          <p className="text-slate-400 max-w-2xl mx-auto mb-6">
            No futuro, você poderá compartilhar suas fotos de evolução diretamente nas redes sociais. Por enquanto, já deixamos tudo preparado para você baixar suas imagens com marca d'água
          </p>

          {/* ÍCONES SOCIAIS */}
          {/* FUTURO: Estes ícones se tornarão botões funcionais */}
          {/* Ao clicar: modal de compartilhamento com preview e opções de privacidade */}
          <div className="flex items-center justify-center gap-4">
            <div className="h-12 w-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-2xl opacity-50" title="WhatsApp">
              💬
            </div>
            <div className="h-12 w-12 rounded-full bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-2xl opacity-50" title="Instagram">
              📷
            </div>
            <div className="h-12 w-12 rounded-full bg-slate-500/20 border border-slate-500/30 flex items-center justify-center text-2xl opacity-50" title="TikTok">
              🎵
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-2xl opacity-50" title="Facebook">
              👥
            </div>
          </div>
        </div>
      </div>

      {/* MODAL DE UPLOAD */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-5xl w-full my-8">

            {/* HEADER DO MODAL */}
            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📸</span>
                  <h2 className="text-2xl font-bold text-white">Nova Sessão de Fotos</h2>
                </div>
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadForm();
                  }}
                  className="text-white/80 hover:text-white text-3xl transition-colors"
                  aria-label="Fechar modal"
                >
                  ✕
                </button>
              </div>
              <p className="text-white/80 mt-2">
                Use sempre roupas similares e boa iluminação para melhor comparação
              </p>
            </div>

            <div className="p-6 sm:p-8">

              {/* SEÇÃO DE UPLOAD DE FOTOS */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Selecione suas fotos</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Selecione de 1 a 4 fotos seguindo os padrões abaixo. Isso ajuda a comparar sua evolução ao longo do tempo
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {(['frontal', 'posterior', 'lado_direito', 'lado_esquerdo'] as const).map((photoType) => (
                    <div key={photoType}>
                      <input
                        ref={fileInputRefs[photoType]}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={(e) => handlePhotoSelect(photoType, e)}
                        className="hidden"
                        aria-label={`Selecionar foto ${PHOTO_TYPE_LABELS[photoType]}`}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs[photoType].current?.click()}
                        className={`w-full aspect-[3/4] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${
                          selectedPhotos[photoType]
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/50'
                        } ${uploadProgress[photoType] ? 'opacity-50' : ''}`}
                        disabled={uploading}
                      >
                        {uploadProgress[photoType] ? (
                          <div className="animate-spin text-4xl mb-2">⏳</div>
                        ) : selectedPhotos[photoType] ? (
                          <>
                            <div className="text-5xl mb-3">✅</div>
                            <div className="text-xs text-emerald-400 font-semibold">Selecionada</div>
                          </>
                        ) : (
                          <>
                            <div className="text-5xl mb-3">{PHOTO_TYPE_ICONS[photoType]}</div>
                            <div className="text-sm font-semibold text-white mb-1">
                              {PHOTO_TYPE_LABELS[photoType]}
                            </div>
                            <div className="text-xs text-slate-500 text-center px-4">
                              {PHOTO_TYPE_DESCRIPTIONS[photoType]}
                            </div>
                          </>
                        )}
                      </button>
                      {selectedPhotos[photoType] && (
                        <div className="text-xs text-slate-400 mt-2 truncate text-center">
                          {selectedPhotos[photoType]?.name}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {getFieldError('photos') && (
                  <p className="text-red-400 text-sm mt-2">{getFieldError('photos')}</p>
                )}
              </div>

              {/* FORMULÁRIO DE METADADOS */}
              <div className="bg-slate-800/30 border border-slate-800 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Dados corporais</h3>
                <p className="text-sm text-slate-400 mb-6">
                  Essas informações ajudam o sistema a analisar sua evolução
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-slate-300 mb-2">
                      Peso (kg) *
                    </label>
                    <input
                      id="weight"
                      type="number"
                      step="0.1"
                      min={VALIDATION_RULES.weight.min}
                      max={VALIDATION_RULES.weight.max}
                      value={uploadData.weight}
                      onChange={(e) => {
                        setUploadData(prev => ({ ...prev, weight: e.target.value }));
                        setValidationErrors(prev => prev.filter(err => err.field !== 'weight'));
                      }}
                      className={`w-full px-4 py-3 bg-slate-900 border ${
                        getFieldError('weight') ? 'border-red-500' : 'border-slate-700'
                      } rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                      placeholder="75.5"
                      aria-describedby={getFieldError('weight') ? 'weight-error' : undefined}
                    />
                    {getFieldError('weight') && (
                      <p id="weight-error" className="text-red-400 text-xs mt-1">{getFieldError('weight')}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="height" className="block text-sm font-medium text-slate-300 mb-2">
                      Altura (cm) *
                    </label>
                    <input
                      id="height"
                      type="number"
                      step="0.1"
                      min={VALIDATION_RULES.height.min}
                      max={VALIDATION_RULES.height.max}
                      value={uploadData.height}
                      onChange={(e) => {
                        setUploadData(prev => ({ ...prev, height: e.target.value }));
                        setValidationErrors(prev => prev.filter(err => err.field !== 'height'));
                      }}
                      className={`w-full px-4 py-3 bg-slate-900 border ${
                        getFieldError('height') ? 'border-red-500' : 'border-slate-700'
                      } rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                      placeholder="175"
                      aria-describedby={getFieldError('height') ? 'height-error' : undefined}
                    />
                    {getFieldError('height') && (
                      <p id="height-error" className="text-red-400 text-xs mt-1">{getFieldError('height')}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-slate-300 mb-2">
                      Idade (anos) *
                    </label>
                    <input
                      id="age"
                      type="number"
                      min={VALIDATION_RULES.age.min}
                      max={VALIDATION_RULES.age.max}
                      value={uploadData.age}
                      onChange={(e) => {
                        setUploadData(prev => ({ ...prev, age: e.target.value }));
                        setValidationErrors(prev => prev.filter(err => err.field !== 'age'));
                      }}
                      className={`w-full px-4 py-3 bg-slate-900 border ${
                        getFieldError('age') ? 'border-red-500' : 'border-slate-700'
                      } rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                      placeholder="30"
                      aria-describedby={getFieldError('age') ? 'age-error' : undefined}
                    />
                    {getFieldError('age') && (
                      <p id="age-error" className="text-red-400 text-xs mt-1">{getFieldError('age')}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="bodyFat" className="block text-sm font-medium text-slate-300 mb-2">
                      % Gordura (opcional)
                    </label>
                    <input
                      id="bodyFat"
                      type="number"
                      step="0.1"
                      min={VALIDATION_RULES.bodyFat.min}
                      max={VALIDATION_RULES.bodyFat.max}
                      value={uploadData.bodyFat}
                      onChange={(e) => {
                        setUploadData(prev => ({ ...prev, bodyFat: e.target.value }));
                        setValidationErrors(prev => prev.filter(err => err.field !== 'bodyFat'));
                      }}
                      className={`w-full px-4 py-3 bg-slate-900 border ${
                        getFieldError('bodyFat') ? 'border-red-500' : 'border-slate-700'
                      } rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all`}
                      placeholder="15.5"
                      aria-describedby={getFieldError('bodyFat') ? 'bodyFat-error' : undefined}
                    />
                    {getFieldError('bodyFat') && (
                      <p id="bodyFat-error" className="text-red-400 text-xs mt-1">{getFieldError('bodyFat')}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">
                      Observações (opcional)
                    </label>
                    <textarea
                      id="notes"
                      value={uploadData.notes}
                      onChange={(e) => setUploadData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                      rows={3}
                      placeholder="Ex: Início de cutting, pós-férias, etc."
                      maxLength={500}
                    />
                  </div>
                </div>
              </div>

              {/* BOTÕES DE AÇÃO */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetUploadForm();
                  }}
                  disabled={uploading}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-white px-6 py-4 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleUploadSession}
                  disabled={uploading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-6 py-4 rounded-xl font-semibold shadow-lg shadow-emerald-500/20 transition-all hover:shadow-xl hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                >
                  {uploading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin">⏳</span>
                      Enviando fotos...
                    </span>
                  ) : (
                    'Salvar fotos de evolução'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function FotosEvolucaoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Carregando...</p>
        </div>
      </div>
    }>
      <FotosEvolucaoContent />
    </Suspense>
  );
}
