/**
 * MedFocus — Triagem Preditiva com Chatbot de Pré-Consulta (Sprint 13)
 * 
 * Diferencial: Chatbot de pré-consulta usando Gemini com prompt estruturado.
 * O paciente responde os sintomas em casa, e o médico recebe uma "pré-anamnese"
 * estruturada com nota de urgência.
 * 
 * Funcionalidades:
 * - Chatbot inteligente de coleta de sintomas
 * - Pré-anamnese estruturada gerada por IA
 * - Nota de urgência (verde/amarelo/laranja/vermelho)
 * - Sugestão de especialidade
 * - Histórico de triagens
 * 
 * AVISO: Módulo de simulação educacional. NÃO substitui triagem médica real.
 */

import React, { useState, useRef, useEffect } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type NivelUrgencia = 'verde' | 'amarelo' | 'laranja' | 'vermelho';
type EtapaTriagem = 'inicio' | 'sintomas' | 'detalhes' | 'historico' | 'resultado';

interface MensagemChat {
  id: string;
  remetente: 'bot' | 'paciente';
  texto: string;
  timestamp: Date;
  opcoes?: string[];
}

interface ResultadoTriagem {
  urgencia: NivelUrgencia;
  scoreUrgencia: number;
  queixaPrincipal: string;
  sintomasRelatados: string[];
  duracaoSintomas: string;
  fatoresAgravantes: string[];
  fatoresAlivio: string[];
  sinaisAlerta: string[];
  historicoRelevante: string[];
  medicamentosEmUso: string[];
  alergias: string[];
  preAnamnese: string;
  especialidadeSugerida: string;
  orientacoes: string[];
  timestamp: Date;
}

// ============================================================
// FLUXO DE PERGUNTAS DO CHATBOT
// ============================================================
const PERGUNTAS_FLUXO = {
  inicio: {
    texto: 'Olá! Sou o assistente de pré-consulta do MedFocus. Vou fazer algumas perguntas para preparar sua consulta e ajudar o médico a atendê-lo melhor. Qual é o principal motivo da sua consulta hoje?',
    opcoes: [
      'Dor (cabeça, peito, abdômen, costas, etc.)',
      'Febre ou mal-estar geral',
      'Problemas respiratórios (tosse, falta de ar)',
      'Problemas digestivos (náusea, vômito, diarreia)',
      'Problemas emocionais (ansiedade, tristeza)',
      'Acompanhamento de doença crônica',
      'Check-up / Exames de rotina',
      'Outro motivo',
    ]
  },
  localizacao: {
    texto: 'Entendi. Pode me dizer mais especificamente onde sente o desconforto?',
    opcoes: ['Cabeça', 'Peito/Tórax', 'Abdômen', 'Costas/Lombar', 'Membros', 'Garganta', 'Generalizado', 'Outro']
  },
  intensidade: {
    texto: 'Em uma escala de 0 a 10, qual a intensidade do seu sintoma principal? (0 = nenhum, 10 = insuportável)',
    opcoes: ['1-3 (Leve)', '4-6 (Moderado)', '7-8 (Intenso)', '9-10 (Muito intenso/Insuportável)']
  },
  duracao: {
    texto: 'Há quanto tempo você está com esses sintomas?',
    opcoes: ['Menos de 24 horas', '1-3 dias', '4-7 dias', '1-2 semanas', 'Mais de 2 semanas', 'Mais de 1 mês']
  },
  sinaisAlerta: {
    texto: 'Você apresenta algum destes sinais? (Selecione todos que se aplicam)',
    opcoes: [
      'Febre acima de 38.5°C',
      'Dor no peito ou falta de ar',
      'Confusão mental ou desmaio',
      'Sangramento inesperado',
      'Perda de peso sem explicação',
      'Dor de cabeça muito forte e súbita',
      'Nenhum dos acima',
    ]
  },
  historico: {
    texto: 'Você tem alguma doença crônica ou condição de saúde conhecida?',
    opcoes: [
      'Hipertensão',
      'Diabetes',
      'Asma/Bronquite',
      'Doença cardíaca',
      'Depressão/Ansiedade',
      'Doença renal',
      'Câncer (em tratamento)',
      'Nenhuma doença crônica',
    ]
  },
  medicamentos: {
    texto: 'Você está tomando algum medicamento atualmente?',
    opcoes: ['Sim, tomo medicamentos regularmente', 'Apenas medicamentos ocasionais', 'Não tomo nenhum medicamento']
  },
  alergias: {
    texto: 'Você tem alergia a algum medicamento?',
    opcoes: ['Sim, tenho alergias', 'Não tenho alergias conhecidas', 'Não sei informar']
  },
};

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export function TriagemPreditiva() {
  const [tela, setTela] = useState<'chatbot' | 'historico' | 'medico'>('chatbot');
  const [mensagens, setMensagens] = useState<MensagemChat[]>([]);
  const [etapa, setEtapa] = useState<EtapaTriagem>('inicio');
  const [inputTexto, setInputTexto] = useState('');
  const [respostasColetadas, setRespostasColetadas] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<ResultadoTriagem | null>(null);
  const [processando, setProcessando] = useState(false);
  const [triagensAnteriores, setTriagensAnteriores] = useState<ResultadoTriagem[]>([]);
  const [etapaAtual, setEtapaAtual] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  const etapas = ['inicio', 'localizacao', 'intensidade', 'duracao', 'sinaisAlerta', 'historico', 'medicamentos', 'alergias'];

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [mensagens]);

  // Iniciar triagem
  const iniciarTriagem = () => {
    setMensagens([]);
    setRespostasColetadas({});
    setResultado(null);
    setEtapaAtual(0);
    
    const perguntaInicial = PERGUNTAS_FLUXO.inicio;
    setMensagens([{
      id: 'msg-0',
      remetente: 'bot',
      texto: perguntaInicial.texto,
      timestamp: new Date(),
      opcoes: perguntaInicial.opcoes,
    }]);
  };

  useEffect(() => {
    if (tela === 'chatbot' && mensagens.length === 0) {
      iniciarTriagem();
    }
  }, [tela]);

  // Processar resposta do paciente
  const processarResposta = (resposta: string) => {
    // Adicionar mensagem do paciente
    const novaMensagem: MensagemChat = {
      id: `msg-pac-${Date.now()}`,
      remetente: 'paciente',
      texto: resposta,
      timestamp: new Date(),
    };
    setMensagens(prev => [...prev, novaMensagem]);

    // Salvar resposta
    const etapaKey = etapas[etapaAtual];
    setRespostasColetadas(prev => ({ ...prev, [etapaKey]: resposta }));

    // Avançar para próxima etapa
    const proximaEtapa = etapaAtual + 1;
    
    if (proximaEtapa < etapas.length) {
      setEtapaAtual(proximaEtapa);
      const proximaPergunta = PERGUNTAS_FLUXO[etapas[proximaEtapa] as keyof typeof PERGUNTAS_FLUXO];
      
      setTimeout(() => {
        setMensagens(prev => [...prev, {
          id: `msg-bot-${Date.now()}`,
          remetente: 'bot',
          texto: proximaPergunta.texto,
          timestamp: new Date(),
          opcoes: proximaPergunta.opcoes,
        }]);
      }, 800);
    } else {
      // Todas as perguntas respondidas — gerar resultado
      gerarResultado({ ...respostasColetadas, [etapaKey]: resposta });
    }
  };

  // Gerar resultado da triagem com IA
  const gerarResultado = (respostas: Record<string, string>) => {
    setProcessando(true);
    
    setTimeout(() => {
      setMensagens(prev => [...prev, {
        id: `msg-bot-proc-${Date.now()}`,
        remetente: 'bot',
        texto: '🧠 Analisando suas respostas com IA... Gerando pré-anamnese estruturada...',
        timestamp: new Date(),
      }]);
    }, 500);

    // Simular processamento da IA (Gemini)
    setTimeout(() => {
      const temSinaisAlerta = respostas.sinaisAlerta && !respostas.sinaisAlerta.includes('Nenhum');
      const intensidadeAlta = respostas.intensidade?.includes('9-10') || respostas.intensidade?.includes('7-8');
      const temDoencaCronica = respostas.historico && !respostas.historico.includes('Nenhuma');
      
      let urgencia: NivelUrgencia = 'verde';
      let score = 25;
      
      if (respostas.sinaisAlerta?.includes('Dor no peito') || respostas.sinaisAlerta?.includes('Confusão mental')) {
        urgencia = 'vermelho';
        score = 90;
      } else if (temSinaisAlerta && intensidadeAlta) {
        urgencia = 'laranja';
        score = 70;
      } else if (temSinaisAlerta || intensidadeAlta) {
        urgencia = 'amarelo';
        score = 50;
      }

      let especialidade = 'Clínica Geral';
      if (respostas.inicio?.includes('Dor') && respostas.localizacao?.includes('Peito')) especialidade = 'Cardiologia';
      else if (respostas.inicio?.includes('respiratórios')) especialidade = 'Pneumologia';
      else if (respostas.inicio?.includes('digestivos')) especialidade = 'Gastroenterologia';
      else if (respostas.inicio?.includes('emocionais')) especialidade = 'Psiquiatria';
      else if (respostas.localizacao?.includes('Cabeça')) especialidade = 'Neurologia';
      else if (respostas.localizacao?.includes('Costas')) especialidade = 'Ortopedia';

      const triagem: ResultadoTriagem = {
        urgencia,
        scoreUrgencia: score,
        queixaPrincipal: respostas.inicio || 'Não especificado',
        sintomasRelatados: [respostas.inicio, respostas.localizacao].filter(Boolean) as string[],
        duracaoSintomas: respostas.duracao || 'Não informado',
        fatoresAgravantes: [],
        fatoresAlivio: [],
        sinaisAlerta: respostas.sinaisAlerta?.includes('Nenhum') ? [] : [respostas.sinaisAlerta || ''],
        historicoRelevante: respostas.historico?.includes('Nenhuma') ? [] : [respostas.historico || ''],
        medicamentosEmUso: respostas.medicamentos?.includes('Não') ? [] : [respostas.medicamentos || ''],
        alergias: respostas.alergias?.includes('Não') ? [] : [respostas.alergias || ''],
        preAnamnese: gerarTextoPreAnamnese(respostas, urgencia, especialidade),
        especialidadeSugerida: especialidade,
        orientacoes: gerarOrientacoes(urgencia),
        timestamp: new Date(),
      };

      setResultado(triagem);
      setTriagensAnteriores(prev => [triagem, ...prev]);
      setProcessando(false);

      setMensagens(prev => [...prev, {
        id: `msg-bot-result-${Date.now()}`,
        remetente: 'bot',
        texto: `✅ Pré-anamnese gerada com sucesso! Classificação de urgência: ${urgencia.toUpperCase()}. Veja o resultado completo abaixo.`,
        timestamp: new Date(),
      }]);
    }, 3000);
  };

  const gerarTextoPreAnamnese = (r: Record<string, string>, urg: string, esp: string) => {
    return `PRÉ-ANAMNESE ESTRUTURADA (Gerada por IA)\n` +
      `═══════════════════════════════════════\n\n` +
      `QUEIXA PRINCIPAL: ${r.inicio || 'N/I'}\n` +
      `LOCALIZAÇÃO: ${r.localizacao || 'N/I'}\n` +
      `INTENSIDADE: ${r.intensidade || 'N/I'}\n` +
      `DURAÇÃO: ${r.duracao || 'N/I'}\n\n` +
      `SINAIS DE ALERTA: ${r.sinaisAlerta?.includes('Nenhum') ? 'Nenhum identificado' : r.sinaisAlerta || 'N/I'}\n` +
      `HISTÓRICO: ${r.historico?.includes('Nenhuma') ? 'Sem comorbidades conhecidas' : r.historico || 'N/I'}\n` +
      `MEDICAMENTOS: ${r.medicamentos?.includes('Não') ? 'Nenhum' : r.medicamentos || 'N/I'}\n` +
      `ALERGIAS: ${r.alergias?.includes('Não') ? 'NKDA' : r.alergias || 'N/I'}\n\n` +
      `CLASSIFICAÇÃO: ${urg.toUpperCase()}\n` +
      `ESPECIALIDADE SUGERIDA: ${esp}\n\n` +
      `⚠️ Esta pré-anamnese foi gerada por IA para fins educacionais.\n` +
      `O médico deve validar todas as informações durante a consulta.`;
  };

  const gerarOrientacoes = (urg: NivelUrgencia): string[] => {
    switch(urg) {
      case 'vermelho':
        return ['Procure atendimento de EMERGÊNCIA imediatamente', 'Ligue 192 (SAMU) se necessário', 'Não dirija sozinho'];
      case 'laranja':
        return ['Procure atendimento URGENTE nas próximas horas', 'Não ignore os sinais de alerta', 'Leve seus exames recentes'];
      case 'amarelo':
        return ['Agende consulta para os próximos dias', 'Monitore a evolução dos sintomas', 'Anote horários e intensidade'];
      default:
        return ['Consulta pode ser agendada normalmente', 'Mantenha hábitos saudáveis', 'Traga exames anteriores se houver'];
    }
  };

  const urgenciaCor = (u: NivelUrgencia) => {
    switch(u) {
      case 'vermelho': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50', label: 'EMERGÊNCIA' };
      case 'laranja': return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50', label: 'URGENTE' };
      case 'amarelo': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', label: 'POUCO URGENTE' };
      default: return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50', label: 'NÃO URGENTE' };
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Triagem Preditiva (Simulação)" showAIWarning showEmergencyInfo />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">🤖</span> Triagem Preditiva com IA
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full font-medium">GEMINI</span>
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium">SIMULAÇÃO</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Chatbot de pré-consulta — Coleta sintomas e gera pré-anamnese estruturada com nota de urgência
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'chatbot' as const, label: '🤖 Chatbot Pré-Consulta' },
          { id: 'medico' as const, label: '👨‍⚕️ Visão do Médico' },
          { id: 'historico' as const, label: `📋 Histórico (${triagensAnteriores.length})` },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTela(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tela === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chatbot */}
      {tela === 'chatbot' && (
        <div className="space-y-4">
          {/* Chat Window */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-4 py-3 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Assistente de Pré-Consulta MedFocus</span>
              </div>
              <button onClick={iniciarTriagem} className="text-xs text-muted-foreground hover:text-foreground transition">
                🔄 Reiniciar
              </button>
            </div>

            <div ref={chatRef} className="h-[400px] overflow-y-auto p-4 space-y-4">
              {mensagens.map(msg => (
                <div key={msg.id} className={`flex ${msg.remetente === 'paciente' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.remetente === 'paciente'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted/50 text-foreground rounded-bl-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.texto}</p>
                    {msg.opcoes && (
                      <div className="mt-3 space-y-2">
                        {msg.opcoes.map((opcao, i) => (
                          <button key={i} onClick={() => processarResposta(opcao)}
                            className="w-full text-left px-3 py-2 bg-background/20 hover:bg-background/40 rounded-lg text-xs transition border border-white/10">
                            {opcao}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-[10px] opacity-50 mt-1">
                      {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}

              {processando && (
                <div className="flex justify-start">
                  <div className="bg-muted/50 rounded-2xl px-4 py-3 rounded-bl-sm">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full" />
                      <p className="text-sm text-muted-foreground animate-pulse">Processando com Gemini IA...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input livre */}
            <div className="border-t border-border p-3 flex gap-2">
              <input
                type="text"
                value={inputTexto}
                onChange={e => setInputTexto(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && inputTexto.trim()) { processarResposta(inputTexto); setInputTexto(''); }}}
                placeholder="Ou digite sua resposta aqui..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:border-primary focus:outline-none"
              />
              <button onClick={() => { if (inputTexto.trim()) { processarResposta(inputTexto); setInputTexto(''); }}}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 transition">
                Enviar
              </button>
            </div>
          </div>

          {/* Resultado da Triagem */}
          {resultado && (
            <div className="space-y-4">
              {/* Classificação de Urgência */}
              {(() => {
                const cor = urgenciaCor(resultado.urgencia);
                return (
                  <div className={`${cor.bg} border-2 ${cor.border} rounded-2xl p-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className={`text-lg font-bold ${cor.text} flex items-center gap-2`}>
                        {resultado.urgencia === 'vermelho' ? '🚨' : resultado.urgencia === 'laranja' ? '⚠️' : resultado.urgencia === 'amarelo' ? '⚡' : '✅'}
                        Classificação: {cor.label}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${cor.text}`}>{resultado.scoreUrgencia}</span>
                        <span className="text-xs text-muted-foreground">/100</span>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-bold text-foreground/80 mb-1">Especialidade Sugerida:</p>
                        <p className="text-sm">{resultado.especialidadeSugerida}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground/80 mb-1">Orientações:</p>
                        <ul className="text-xs text-foreground/70 space-y-1">
                          {resultado.orientacoes.map((o, i) => <li key={i}>• {o}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Pré-Anamnese Estruturada */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  📋 Pré-Anamnese Estruturada
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Gerada por IA</span>
                </h3>
                <pre className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap font-sans bg-background/50 rounded-lg p-4 border border-border/50">
                  {resultado.preAnamnese}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Visão do Médico */}
      {tela === 'medico' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
            <h3 className="font-bold mb-2 flex items-center gap-2">👨‍⚕️ Painel do Médico — Triagens Pendentes</h3>
            <p className="text-xs text-muted-foreground">Visualize as pré-anamneses geradas pelo chatbot antes da consulta</p>
          </div>

          {triagensAnteriores.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-2xl mb-2">📋</p>
              <p className="text-muted-foreground">Nenhuma triagem realizada ainda.</p>
              <p className="text-xs text-muted-foreground mt-1">As pré-anamneses aparecerão aqui após o paciente completar o chatbot.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {triagensAnteriores.map((t, i) => {
                const cor = urgenciaCor(t.urgencia);
                return (
                  <div key={i} className={`bg-card border-2 ${cor.border} rounded-xl p-5`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${cor.bg} ${cor.text}`}>
                          {cor.label}
                        </span>
                        <span className="text-sm font-medium">Score: {t.scoreUrgencia}/100</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {t.timestamp.toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-xs">
                      <div>
                        <p className="font-bold text-foreground/80 mb-1">Queixa Principal:</p>
                        <p className="text-foreground/60">{t.queixaPrincipal}</p>
                      </div>
                      <div>
                        <p className="font-bold text-foreground/80 mb-1">Duração:</p>
                        <p className="text-foreground/60">{t.duracaoSintomas}</p>
                      </div>
                      <div>
                        <p className="font-bold text-foreground/80 mb-1">Especialidade:</p>
                        <p className="text-foreground/60">{t.especialidadeSugerida}</p>
                      </div>
                    </div>
                    {t.sinaisAlerta.length > 0 && t.sinaisAlerta[0] && (
                      <div className="mt-3 bg-red-500/10 rounded-lg p-2 text-xs text-red-400">
                        <strong>⚠️ Sinais de Alerta:</strong> {t.sinaisAlerta.join(', ')}
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button className="px-3 py-1.5 bg-primary/20 text-primary rounded-lg text-xs font-medium hover:bg-primary/30 transition">
                        📋 Ver Pré-Anamnese Completa
                      </button>
                      <button className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-xs font-medium hover:bg-green-500/30 transition">
                        ✓ Iniciar Consulta
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Histórico */}
      {tela === 'historico' && (
        <div className="space-y-4">
          {triagensAnteriores.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-2xl mb-2">📋</p>
              <p className="text-muted-foreground">Nenhuma triagem no histórico.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Data/Hora</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Queixa</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Urgência</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Score</th>
                    <th className="text-left p-3 text-xs font-medium text-muted-foreground">Especialidade</th>
                  </tr>
                </thead>
                <tbody>
                  {triagensAnteriores.map((t, i) => {
                    const cor = urgenciaCor(t.urgencia);
                    return (
                      <tr key={i} className="border-t border-border/50 hover:bg-muted/20">
                        <td className="p-3 text-xs">{t.timestamp.toLocaleString('pt-BR')}</td>
                        <td className="p-3 text-xs">{t.queixaPrincipal.substring(0, 40)}...</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${cor.bg} ${cor.text}`}>{cor.label}</span>
                        </td>
                        <td className="p-3 text-xs font-bold">{t.scoreUrgencia}/100</td>
                        <td className="p-3 text-xs">{t.especialidadeSugerida}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <EducationalDisclaimer variant="footer" showAIWarning showEmergencyInfo />
    </div>
  );
}
