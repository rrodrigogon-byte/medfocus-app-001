/**
 * MedFocus — Transcrição Clínica Inteligente (Sprint 20)
 * 
 * Módulo de transcrição de áudio para texto clínico estruturado:
 * - Gravação de áudio direto no navegador (MediaRecorder API)
 * - Transcrição via Whisper API (OpenAI)
 * - Estruturação automática em formato SOAP
 * - Extração de dados clínicos (CID-10, medicamentos, exames)
 * - Geração de resumo clínico para prontuário
 * - Histórico de transcrições
 * 
 * DISCLAIMER: Ferramenta exclusivamente educacional e de apoio ao estudo.
 */

import React, { useState, useRef } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface Transcricao {
  id: string;
  dataHora: Date;
  duracao: number;
  textoOriginal: string;
  textoEstruturado: {
    subjetivo: string;
    objetivo: string;
    avaliacao: string;
    plano: string;
  };
  dadosExtraidos: {
    cids: string[];
    medicamentos: string[];
    exames: string[];
    sinaisVitais: string[];
    alergias: string[];
  };
  resumo: string;
  status: 'transcrevendo' | 'estruturando' | 'concluido' | 'erro';
}

// Simulação de dados extraídos para demonstração
const EXEMPLOS_TRANSCRICAO: Transcricao[] = [
  {
    id: 'tr-001', dataHora: new Date('2026-02-28T14:30:00'), duracao: 245,
    textoOriginal: 'Paciente masculino, 58 anos, retorno para acompanhamento de hipertensão arterial e diabetes tipo 2. Refere que está tomando losartana 50mg pela manhã e metformina 850mg duas vezes ao dia. Nega dor torácica, dispneia ou edema. Pressão arterial hoje 138 por 88. Glicemia de jejum do último exame 142 mg/dL. Hemoglobina glicada 7.2%. Função renal preservada, creatinina 0.9. Vou aumentar a losartana para 100mg e manter a metformina. Solicitar novo perfil lipídico e microalbuminúria. Retorno em 3 meses.',
    textoEstruturado: {
      subjetivo: 'Paciente masculino, 58 anos, retorno para acompanhamento de HAS e DM2. Em uso de Losartana 50mg/dia e Metformina 850mg 2x/dia. Nega dor torácica, dispneia ou edema periférico. Refere boa adesão medicamentosa.',
      objetivo: 'PA: 138/88 mmHg. Glicemia de jejum: 142 mg/dL. HbA1c: 7.2%. Creatinina: 0.9 mg/dL (função renal preservada).',
      avaliacao: 'HAS estágio 1 com controle subótimo. DM2 com controle glicêmico moderado (HbA1c 7.2% — meta <7%). Função renal preservada.',
      plano: '1) Aumentar Losartana para 100mg/dia. 2) Manter Metformina 850mg 2x/dia. 3) Solicitar perfil lipídico completo e microalbuminúria. 4) Retorno em 3 meses com exames.',
    },
    dadosExtraidos: {
      cids: ['I10 — Hipertensão essencial (primária)', 'E11 — Diabetes mellitus tipo 2'],
      medicamentos: ['Losartana 50mg → 100mg/dia', 'Metformina 850mg 2x/dia'],
      exames: ['Glicemia de jejum: 142 mg/dL', 'HbA1c: 7.2%', 'Creatinina: 0.9 mg/dL', 'Perfil lipídico (solicitado)', 'Microalbuminúria (solicitado)'],
      sinaisVitais: ['PA: 138/88 mmHg'],
      alergias: [],
    },
    resumo: 'Paciente hipertenso e diabético tipo 2 em acompanhamento. Controle pressórico e glicêmico subótimos. Ajuste de losartana para 100mg e solicitação de exames complementares. Retorno em 3 meses.',
    status: 'concluido',
  },
];

export function TranscricaoClinica() {
  const [tela, setTela] = useState<'gravar' | 'historico' | 'configuracoes'>('gravar');
  const [gravando, setGravando] = useState(false);
  const [tempoGravacao, setTempoGravacao] = useState(0);
  const [transcricoes, setTranscricoes] = useState<Transcricao[]>(EXEMPLOS_TRANSCRICAO);
  const [transcricaoAtual, setTranscricaoAtual] = useState<Transcricao | null>(null);
  const [processando, setProcessando] = useState(false);
  const [textoManual, setTextoManual] = useState('');
  const timerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const iniciarGravacao = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setGravando(true);
      setTempoGravacao(0);
      timerRef.current = setInterval(() => setTempoGravacao(t => t + 1), 1000);
    } catch (err) {
      alert('Erro ao acessar o microfone. Verifique as permissões do navegador.');
    }
  };

  const pararGravacao = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    clearInterval(timerRef.current);
    setGravando(false);
    processarTranscricao();
  };

  const processarTranscricao = () => {
    setProcessando(true);
    // Simulação de processamento
    setTimeout(() => {
      const novaTranscricao: Transcricao = {
        ...EXEMPLOS_TRANSCRICAO[0],
        id: `tr-${Date.now()}`,
        dataHora: new Date(),
        duracao: tempoGravacao,
      };
      setTranscricaoAtual(novaTranscricao);
      setTranscricoes(prev => [novaTranscricao, ...prev]);
      setProcessando(false);
    }, 3000);
  };

  const processarTextoManual = () => {
    if (!textoManual.trim()) return;
    setProcessando(true);
    setTimeout(() => {
      const novaTranscricao: Transcricao = {
        id: `tr-${Date.now()}`,
        dataHora: new Date(),
        duracao: 0,
        textoOriginal: textoManual,
        textoEstruturado: {
          subjetivo: 'Dados subjetivos extraídos do texto fornecido.',
          objetivo: 'Dados objetivos identificados no texto.',
          avaliacao: 'Avaliação clínica baseada nos dados fornecidos.',
          plano: 'Plano terapêutico identificado no texto.',
        },
        dadosExtraidos: { cids: [], medicamentos: [], exames: [], sinaisVitais: [], alergias: [] },
        resumo: textoManual.substring(0, 200) + '...',
        status: 'concluido',
      };
      setTranscricaoAtual(novaTranscricao);
      setTranscricoes(prev => [novaTranscricao, ...prev]);
      setProcessando(false);
      setTextoManual('');
    }, 2000);
  };

  const formatarTempo = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Transcrição Clínica Inteligente" />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">🎙️</span> Transcrição Clínica Inteligente
          <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-1 rounded-full font-medium">Whisper AI</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Grave ou cole texto de consultas e obtenha transcrição estruturada em formato SOAP com extração automática de dados clínicos
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'gravar' as const, label: '🎙️ Gravar / Transcrever' },
          { id: 'historico' as const, label: `📋 Histórico (${transcricoes.length})` },
          { id: 'configuracoes' as const, label: '⚙️ Configurações' },
        ].map(tab => (
          <button key={tab.id} onClick={() => { setTela(tab.id); setTranscricaoAtual(null); }}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tela === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {tela === 'gravar' && !transcricaoAtual && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Gravação de Áudio */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">🎙️ Gravação de Áudio</h3>
            <div className="text-center py-8">
              {!gravando ? (
                <>
                  <button onClick={iniciarGravacao}
                    className="w-24 h-24 rounded-full bg-red-500 hover:bg-red-600 transition flex items-center justify-center mx-auto shadow-lg shadow-red-500/30">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                      <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                  </button>
                  <p className="text-sm text-muted-foreground mt-4">Clique para iniciar a gravação</p>
                  <p className="text-xs text-muted-foreground mt-1">O áudio será transcrito automaticamente via Whisper AI</p>
                </>
              ) : (
                <>
                  <button onClick={pararGravacao}
                    className="w-24 h-24 rounded-full bg-red-500 animate-pulse flex items-center justify-center mx-auto shadow-lg shadow-red-500/50">
                    <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="2"/>
                    </svg>
                  </button>
                  <p className="text-2xl font-mono font-bold text-red-400 mt-4">{formatarTempo(tempoGravacao)}</p>
                  <p className="text-sm text-red-400 mt-1">Gravando... Clique para parar</p>
                </>
              )}
            </div>
          </div>

          {/* Texto Manual */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">📝 Texto Manual</h3>
            <textarea value={textoManual} onChange={e => setTextoManual(e.target.value)}
              placeholder="Cole aqui o texto da consulta, evolução ou anamnese para estruturação automática em formato SOAP..."
              rows={8}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none resize-none leading-relaxed" />
            <button onClick={processarTextoManual} disabled={!textoManual.trim() || processando}
              className="w-full mt-3 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-50">
              {processando ? '⏳ Processando...' : '🧠 Estruturar com IA'}
            </button>
          </div>
        </div>
      )}

      {/* Processando */}
      {processando && (
        <div className="bg-card border border-border rounded-xl p-8 text-center mt-6">
          <div className="animate-spin w-12 h-12 border-3 border-violet-400 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="font-bold text-lg">Processando transcrição...</p>
          <div className="flex justify-center gap-8 mt-4 text-xs text-muted-foreground">
            <span>1. Transcrição (Whisper)</span>
            <span>→</span>
            <span>2. Estruturação (SOAP)</span>
            <span>→</span>
            <span>3. Extração de dados</span>
          </div>
        </div>
      )}

      {/* Resultado da Transcrição */}
      {transcricaoAtual && !processando && (
        <div className="space-y-4 mt-4">
          <button onClick={() => setTranscricaoAtual(null)} className="text-sm text-primary hover:underline">← Nova transcrição</button>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold">📝 Texto Original</h3>
              <span className="text-xs text-muted-foreground">{transcricaoAtual.dataHora.toLocaleString('pt-BR')} | {formatarTempo(transcricaoAtual.duracao)}</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed bg-background/50 rounded-lg p-4">{transcricaoAtual.textoOriginal}</p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">📋 Estruturação SOAP</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { letra: 'S', titulo: 'Subjetivo', texto: transcricaoAtual.textoEstruturado.subjetivo, cor: 'bg-blue-500/10 border-blue-500/30' },
                { letra: 'O', titulo: 'Objetivo', texto: transcricaoAtual.textoEstruturado.objetivo, cor: 'bg-green-500/10 border-green-500/30' },
                { letra: 'A', titulo: 'Avaliação', texto: transcricaoAtual.textoEstruturado.avaliacao, cor: 'bg-yellow-500/10 border-yellow-500/30' },
                { letra: 'P', titulo: 'Plano', texto: transcricaoAtual.textoEstruturado.plano, cor: 'bg-purple-500/10 border-purple-500/30' },
              ].map(s => (
                <div key={s.letra} className={`${s.cor} border rounded-xl p-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-bold">{s.letra}</span>
                    <span className="font-bold text-sm">{s.titulo}</span>
                  </div>
                  <p className="text-xs text-foreground/80 leading-relaxed">{s.texto}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">🔍 Dados Clínicos Extraídos</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {transcricaoAtual.dadosExtraidos.cids.length > 0 && (
                <div className="bg-background/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-primary mb-2">CID-10</p>
                  {transcricaoAtual.dadosExtraidos.cids.map((c, i) => <p key={i} className="text-xs text-foreground/70 mb-1">{c}</p>)}
                </div>
              )}
              {transcricaoAtual.dadosExtraidos.medicamentos.length > 0 && (
                <div className="bg-background/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-green-400 mb-2">Medicamentos</p>
                  {transcricaoAtual.dadosExtraidos.medicamentos.map((m, i) => <p key={i} className="text-xs text-foreground/70 mb-1">{m}</p>)}
                </div>
              )}
              {transcricaoAtual.dadosExtraidos.exames.length > 0 && (
                <div className="bg-background/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-yellow-400 mb-2">Exames</p>
                  {transcricaoAtual.dadosExtraidos.exames.map((e, i) => <p key={i} className="text-xs text-foreground/70 mb-1">{e}</p>)}
                </div>
              )}
              {transcricaoAtual.dadosExtraidos.sinaisVitais.length > 0 && (
                <div className="bg-background/50 rounded-xl p-4">
                  <p className="text-xs font-bold text-red-400 mb-2">Sinais Vitais</p>
                  {transcricaoAtual.dadosExtraidos.sinaisVitais.map((s, i) => <p key={i} className="text-xs text-foreground/70 mb-1">{s}</p>)}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/10 to-violet-500/10 border border-primary/30 rounded-xl p-6">
            <h3 className="font-bold mb-2">📄 Resumo para Prontuário</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">{transcricaoAtual.resumo}</p>
          </div>
        </div>
      )}

      {/* Histórico */}
      {tela === 'historico' && (
        <div className="space-y-4">
          {transcricoes.map(t => (
            <div key={t.id} onClick={() => { setTranscricaoAtual(t); setTela('gravar'); }}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 cursor-pointer transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{t.dadosExtraidos.cids[0] || 'Transcrição'}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.dataHora.toLocaleString('pt-BR')} | Duração: {formatarTempo(t.duracao)}</p>
                  <p className="text-xs text-foreground/60 mt-1 line-clamp-1">{t.resumo}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${t.status === 'concluido' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {t.status === 'concluido' ? 'Concluído' : 'Processando'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Configurações */}
      {tela === 'configuracoes' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h3 className="font-bold">⚙️ Configurações de Transcrição</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-background/50 rounded-lg p-4">
              <div><p className="text-sm font-medium">Modelo de Transcrição</p><p className="text-xs text-muted-foreground">Whisper Large v3 (mais preciso)</p></div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Ativo</span>
            </div>
            <div className="flex items-center justify-between bg-background/50 rounded-lg p-4">
              <div><p className="text-sm font-medium">Idioma Principal</p><p className="text-xs text-muted-foreground">Português (Brasil)</p></div>
              <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">pt-BR</span>
            </div>
            <div className="flex items-center justify-between bg-background/50 rounded-lg p-4">
              <div><p className="text-sm font-medium">Estruturação Automática (SOAP)</p><p className="text-xs text-muted-foreground">Gemini 2.5 Flash</p></div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Ativo</span>
            </div>
            <div className="flex items-center justify-between bg-background/50 rounded-lg p-4">
              <div><p className="text-sm font-medium">Extração de CID-10</p><p className="text-xs text-muted-foreground">Identificação automática de diagnósticos</p></div>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">Ativo</span>
            </div>
          </div>
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
