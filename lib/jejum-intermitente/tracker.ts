// Tracker de Jejum com Histórico

export interface SessaoJejum {
  id: string;
  usuario_id: string;
  protocolo_id: string;
  inicio: Date;
  fim_previsto: Date;
  fim_real?: Date;
  duracao_horas: number;
  status: 'em_andamento' | 'concluido' | 'cancelado';
  fase_atual?: string;
  proxima_fase?: {
    nome: string;
    em_horas: number;
  };
  notas?: string;
  como_se_sentiu?: 'otimo' | 'bom' | 'regular' | 'dificil' | 'muito_dificil';
  sintomas?: string[];
  peso_antes?: number;
  peso_depois?: number;
}

export interface EstatisticasJejum {
  total_jejuns: number;
  jejuns_completos: number;
  jejuns_cancelados: number;
  horas_totais: number;
  media_horas: number;
  maior_jejum: number;
  sequencia_atual: number;
  sequencia_maxima: number;
  protocolo_favorito: string;
  ultimo_jejum: Date;
}

export class TrackerJejum {
  
  static iniciarJejum(
    usuarioId: string,
    protocoloId: string,
    horarioInicio: Date = new Date()
  ): SessaoJejum {
    
    const protocolo = PROTOCOLOS_JEJUM[protocoloId];
    const fimPrevisto = new Date(horarioInicio);
    fimPrevisto.setHours(fimPrevisto.getHours() + protocolo.horas_jejum);
    
    const sessao: SessaoJejum = {
      id: `jejum_${Date.now()}`,
      usuario_id: usuarioId,
      protocolo_id: protocoloId,
      inicio: horarioInicio,
      fim_previsto: fimPrevisto,
      duracao_horas: protocolo.horas_jejum,
      status: 'em_andamento',
      fase_atual: this.calcularFaseAtual(0, protocolo)
    };
    
    // Salvar no localStorage
    this.salvarSessao(sessao);
    
    return sessao;
  }
  
  static calcularProgresso(sessao: SessaoJejum): {
    horas_passadas: number;
    horas_restantes: number;
    percentual: number;
    fase_atual: string;
    proxima_fase?: { nome: string; em_horas: number };
  } {
    
    const agora = new Date();
    const inicio = new Date(sessao.inicio);
    const fim = new Date(sessao.fim_previsto);
    
    const msPassados = agora.getTime() - inicio.getTime();
    const horasPassadas = msPassados / (1000 * 60 * 60);
    
    const msRestantes = fim.getTime() - agora.getTime();
    const horasRestantes = Math.max(0, msRestantes / (1000 * 60 * 60));
    
    const percentual = Math.min(100, (horasPassadas / sessao.duracao_horas) * 100);
    
    const protocolo = PROTOCOLOS_JEJUM[sessao.protocolo_id];
    const faseAtual = this.calcularFaseAtual(horasPassadas, protocolo);
    const proximaFase = this.calcularProximaFase(horasPassadas, protocolo);
    
    return {
      horas_passadas: Math.floor(horasPassadas * 10) / 10,
      horas_restantes: Math.floor(horasRestantes * 10) / 10,
      percentual: Math.floor(percentual),
      fase_atual: faseAtual,
      proxima_fase: proximaFase
    };
  }
  
  static calcularFaseAtual(horasPassadas: number, protocolo: any): string {
    if (!protocolo.fases_jejum || protocolo.fases_jejum.length === 0) {
      return 'Em jejum';
    }
    
    for (const fase of protocolo.fases_jejum) {
      const [inicio, fim] = fase.horas.split('-').map((h: string) => 
        parseInt(h.replace('h', ''))
      );
      
      if (horasPassadas >= inicio && horasPassadas < fim) {
        return fase.nome;
      }
    }
    
    return protocolo.fases_jejum[protocolo.fases_jejum.length - 1].nome;
  }
  
  static calcularProximaFase(horasPassadas: number, protocolo: any) {
    if (!protocolo.fases_jejum || protocolo.fases_jejum.length === 0) {
      return undefined;
    }
    
    for (const fase of protocolo.fases_jejum) {
      const [inicio, fim] = fase.horas.split('-').map((h: string) => 
        parseInt(h.replace('h', ''))
      );
      
      if (horasPassadas < inicio) {
        return {
          nome: fase.nome,
          em_horas: inicio - horasPassadas
        };
      }
    }
    
    return undefined;
  }
  
  static finalizarJejum(
    sessaoId: string,
    comoSeSentiu: 'otimo' | 'bom' | 'regular' | 'dificil' | 'muito_dificil',
    sintomas?: string[],
    notas?: string
  ): SessaoJejum {
    
    const sessao = this.buscarSessao(sessaoId);
    if (!sessao) throw new Error('Sessão não encontrada');
    
    sessao.fim_real = new Date();
    sessao.status = 'concluido';
    sessao.como_se_sentiu = comoSeSentiu;
    sessao.sintomas = sintomas;
    sessao.notas = notas;
    
    this.salvarSessao(sessao);
    
    return sessao;
  }
  
  static cancelarJejum(sessaoId: string, motivo?: string): SessaoJejum {
    const sessao = this.buscarSessao(sessaoId);
    if (!sessao) throw new Error('Sessão não encontrada');
    
    sessao.fim_real = new Date();
    sessao.status = 'cancelado';
    sessao.notas = motivo;
    
    this.salvarSessao(sessao);
    
    return sessao;
  }
  
  static buscarHistorico(usuarioId: string): SessaoJejum[] {
    const historico = localStorage.getItem(`jejum_historico_${usuarioId}`);
    return historico ? JSON.parse(historico) : [];
  }
  
  static calcularEstatisticas(usuarioId: string): EstatisticasJejum {
    const historico = this.buscarHistorico(usuarioId);
    
    const completos = historico.filter(s => s.status === 'concluido');
    const cancelados = historico.filter(s => s.status === 'cancelado');
    
    const horasTotais = completos.reduce((acc, s) => {
      if (s.fim_real) {
        const diff = new Date(s.fim_real).getTime() - new Date(s.inicio).getTime();
        return acc + (diff / (1000 * 60 * 60));
      }
      return acc;
    }, 0);
    
    const maiorJejum = Math.max(...completos.map(s => {
      if (s.fim_real) {
        const diff = new Date(s.fim_real).getTime() - new Date(s.inicio).getTime();
        return diff / (1000 * 60 * 60);
      }
      return 0;
    }), 0);
    
    // Calcular sequência atual
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    let sequenciaAtual = 0;
    
    for (let i = historico.length - 1; i >= 0; i--) {
      const inicio = new Date(historico[i].inicio);
      inicio.setHours(0, 0, 0, 0);
      
      const diffDias = Math.floor((hoje.getTime() - inicio.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDias === sequenciaAtual && historico[i].status === 'concluido') {
        sequenciaAtual++;
      } else {
        break;
      }
    }
    
    // Protocolo favorito
    const protocolos = completos.map(s => s.protocolo_id);
    const protocoloFavorito = protocolos.sort((a, b) =>
      protocolos.filter(p => p === a).length - protocolos.filter(p => p === b).length
    ).pop() || '';
    
    return {
      total_jejuns: historico.length,
      jejuns_completos: completos.length,
      jejuns_cancelados: cancelados.length,
      horas_totais: Math.floor(horasTotais),
      media_horas: completos.length > 0 ? Math.floor(horasTotais / completos.length) : 0,
      maior_jejum: Math.floor(maiorJejum),
      sequencia_atual: sequenciaAtual,
      sequencia_maxima: sequenciaAtual, // Simplificado
      protocolo_favorito: protocoloFavorito,
      ultimo_jejum: historico.length > 0 ? new Date(historico[historico.length - 1].inicio) : new Date()
    };
  }
  
  private static salvarSessao(sessao: SessaoJejum) {
    const historico = this.buscarHistorico(sessao.usuario_id);
    const index = historico.findIndex(s => s.id === sessao.id);
    
    if (index >= 0) {
      historico[index] = sessao;
    } else {
      historico.push(sessao);
    }
    
    localStorage.setItem(`jejum_historico_${sessao.usuario_id}`, JSON.stringify(historico));
  }
  
  private static buscarSessao(sessaoId: string): SessaoJejum | null {
    const usuarios = ['user']; // Simplificado
    
    for (const userId of usuarios) {
      const historico = this.buscarHistorico(userId);
      const sessao = historico.find(s => s.id === sessaoId);
      if (sessao) return sessao;
    }
    
    return null;
  }
}

import { PROTOCOLOS_JEJUM } from './protocolos';
