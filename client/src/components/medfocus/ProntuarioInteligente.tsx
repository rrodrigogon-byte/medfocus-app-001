/**
 * MedFocus — Prontuário Inteligente com "Visão de Contexto" (Sprint 10)
 * 
 * Diferencial: Usa Gemini API para gerar um "Flashback do Paciente".
 * Em vez do médico ler 10 evoluções antigas, o sistema gera um resumo automático.
 * 
 * Funcionalidades:
 * - Briefing automático no topo da ficha (Flashback IA)
 * - Transcrição de áudio para texto clínico (Whisper/Gemini)
 * - Gráficos de evolução de exames
 * - Sugestão de protocolos baseados no diagnóstico
 * - Timeline inteligente de evoluções
 * 
 * AVISO: Módulo de simulação educacional. NÃO é prontuário oficial.
 */

import React, { useState, useEffect, useMemo } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type ProntuarioTela = 'lista' | 'ficha' | 'nova-evolucao' | 'exames';

interface PacienteFicticio {
  id: string;
  nome: string;
  idade: number;
  sexo: 'M' | 'F';
  dataNascimento: string;
  cpf: string;
  convenio: string;
  alergias: string[];
  comorbidades: string[];
  medicamentosAtuais: { nome: string; dose: string; frequencia: string }[];
  evolucoes: Evolucao[];
  exames: Exame[];
}

interface Evolucao {
  id: string;
  data: string;
  medico: string;
  tipo: 'consulta' | 'retorno' | 'urgencia' | 'teleconsulta';
  subjetivo: string;
  objetivo: string;
  avaliacao: string;
  plano: string;
  cid10: string;
  prescricao?: string;
}

interface Exame {
  nome: string;
  data: string;
  resultado: string;
  unidade: string;
  referencia: string;
  status: 'normal' | 'alterado' | 'critico';
}

// ============================================================
// DADOS FICTÍCIOS PARA SIMULAÇÃO
// ============================================================
const PACIENTES_DEMO: PacienteFicticio[] = [
  {
    id: 'PAC-001',
    nome: 'Maria Aparecida Silva (fictício)',
    idade: 62,
    sexo: 'F',
    dataNascimento: '1963-08-15',
    cpf: '***.***.***-00',
    convenio: 'Unimed (fictício)',
    alergias: ['Dipirona', 'Sulfa'],
    comorbidades: ['Hipertensão Arterial Sistêmica', 'Diabetes Mellitus Tipo 2', 'Dislipidemia'],
    medicamentosAtuais: [
      { nome: 'Losartana', dose: '50mg', frequencia: '1x/dia' },
      { nome: 'Metformina', dose: '850mg', frequencia: '2x/dia' },
      { nome: 'Sinvastatina', dose: '20mg', frequencia: '1x/dia (noite)' },
      { nome: 'AAS', dose: '100mg', frequencia: '1x/dia' },
    ],
    evolucoes: [
      {
        id: 'EV-001', data: '2026-02-28', medico: 'Dr. Roberto Almeida (CRM fictício)', tipo: 'retorno',
        subjetivo: 'Paciente refere melhora da cefaleia após ajuste de losartana. Nega tontura. Relata episódios de hipoglicemia leve pela manhã (2x na última semana). Mantém dieta, mas relata dificuldade com exercícios.',
        objetivo: 'PA: 138/86 mmHg. FC: 72 bpm. Peso: 78kg (↓1kg). Glicemia capilar: 98 mg/dL. Ausculta cardíaca: BRNF 2T s/ sopros. Pulmões limpos.',
        avaliacao: 'HAS em controle parcial. DM2 com episódios de hipoglicemia — considerar ajuste de metformina. Dislipidemia em tratamento.',
        plano: 'Reduzir metformina para 500mg 2x/dia. Manter losartana 50mg. Solicitar HbA1c, perfil lipídico e função renal. Retorno em 60 dias.',
        cid10: 'I10 - Hipertensão essencial',
        prescricao: 'Metformina 500mg — 1cp 12/12h'
      },
      {
        id: 'EV-002', data: '2026-01-15', medico: 'Dr. Roberto Almeida (CRM fictício)', tipo: 'consulta',
        subjetivo: 'Paciente queixa-se de cefaleia occipital há 2 semanas, pior pela manhã. Nega alteração visual. Refere que parou de tomar losartana há 10 dias por "esquecimento".',
        objetivo: 'PA: 162/98 mmHg. FC: 80 bpm. Peso: 79kg. Fundo de olho: sem alterações. ECG: ritmo sinusal, sem alterações.',
        avaliacao: 'Crise hipertensiva por descontinuação de anti-hipertensivo. HAS descompensada.',
        plano: 'Reiniciar losartana 50mg/dia. Orientar sobre adesão medicamentosa. MAPA em 30 dias. Retorno em 45 dias.',
        cid10: 'I10 - Hipertensão essencial',
      },
      {
        id: 'EV-003', data: '2025-11-20', medico: 'Dra. Camila Santos (CRM fictício)', tipo: 'retorno',
        subjetivo: 'Retorno para avaliação de exames. Paciente assintomática. Boa adesão à dieta. Caminhada 3x/semana.',
        objetivo: 'PA: 130/82 mmHg. Peso: 80kg. HbA1c: 7.2%. Colesterol total: 195 mg/dL. LDL: 118 mg/dL. Creatinina: 0.9 mg/dL.',
        avaliacao: 'HAS controlada. DM2 com HbA1c acima da meta (<7%). Dislipidemia em tratamento adequado.',
        plano: 'Aumentar metformina para 850mg 2x/dia. Manter demais medicações. Reforçar MEV. Retorno em 90 dias com novos exames.',
        cid10: 'E11 - Diabetes mellitus tipo 2',
      },
      {
        id: 'EV-004', data: '2025-09-10', medico: 'Dr. Roberto Almeida (CRM fictício)', tipo: 'consulta',
        subjetivo: 'Primeira consulta. Paciente encaminhada do posto de saúde com diagnóstico recente de DM2. Refere poliúria e polidipsia há 3 meses. Histórico familiar: mãe diabética, pai hipertenso.',
        objetivo: 'PA: 148/92 mmHg. Peso: 82kg. IMC: 31.2. Glicemia jejum: 186 mg/dL. HbA1c: 8.1%. Colesterol total: 240 mg/dL. LDL: 155 mg/dL.',
        avaliacao: 'DM2 recém-diagnosticada com HbA1c elevada. HAS estágio 1. Dislipidemia. Obesidade grau I.',
        plano: 'Iniciar metformina 500mg 2x/dia + losartana 50mg/dia + sinvastatina 20mg/noite + AAS 100mg/dia. Orientar dieta e exercícios. Retorno em 60 dias.',
        cid10: 'E11 - Diabetes mellitus tipo 2',
      },
    ],
    exames: [
      { nome: 'Glicemia Jejum', data: '2026-02-20', resultado: '112', unidade: 'mg/dL', referencia: '70-99', status: 'alterado' },
      { nome: 'HbA1c', data: '2026-02-20', resultado: '7.0', unidade: '%', referencia: '<7.0', status: 'normal' },
      { nome: 'Colesterol Total', data: '2026-02-20', resultado: '195', unidade: 'mg/dL', referencia: '<200', status: 'normal' },
      { nome: 'LDL', data: '2026-02-20', resultado: '118', unidade: 'mg/dL', referencia: '<130', status: 'normal' },
      { nome: 'HDL', data: '2026-02-20', resultado: '48', unidade: 'mg/dL', referencia: '>40', status: 'normal' },
      { nome: 'Creatinina', data: '2026-02-20', resultado: '0.9', unidade: 'mg/dL', referencia: '0.6-1.2', status: 'normal' },
      { nome: 'TFG', data: '2026-02-20', resultado: '78', unidade: 'mL/min', referencia: '>60', status: 'normal' },
      { nome: 'Glicemia Jejum', data: '2025-11-15', resultado: '138', unidade: 'mg/dL', referencia: '70-99', status: 'alterado' },
      { nome: 'HbA1c', data: '2025-11-15', resultado: '7.2', unidade: '%', referencia: '<7.0', status: 'alterado' },
      { nome: 'Colesterol Total', data: '2025-11-15', resultado: '210', unidade: 'mg/dL', referencia: '<200', status: 'alterado' },
      { nome: 'Glicemia Jejum', data: '2025-09-05', resultado: '186', unidade: 'mg/dL', referencia: '70-99', status: 'critico' },
      { nome: 'HbA1c', data: '2025-09-05', resultado: '8.1', unidade: '%', referencia: '<7.0', status: 'critico' },
    ],
  },
  {
    id: 'PAC-002',
    nome: 'João Carlos Pereira (fictício)',
    idade: 45,
    sexo: 'M',
    dataNascimento: '1980-03-22',
    cpf: '***.***.***-00',
    convenio: 'Bradesco Saúde (fictício)',
    alergias: ['Penicilina'],
    comorbidades: ['Asma brônquica', 'DRGE'],
    medicamentosAtuais: [
      { nome: 'Budesonida/Formoterol', dose: '200/6mcg', frequencia: '2x/dia' },
      { nome: 'Omeprazol', dose: '20mg', frequencia: '1x/dia (jejum)' },
      { nome: 'Salbutamol spray', dose: '100mcg', frequencia: 'SOS' },
    ],
    evolucoes: [
      {
        id: 'EV-005', data: '2026-02-25', medico: 'Dra. Juliana Lima (CRM fictício)', tipo: 'retorno',
        subjetivo: 'Paciente refere melhora significativa da asma após início de budesonida/formoterol. Uso de salbutamol SOS apenas 1x no último mês. Nega pirose.',
        objetivo: 'SpO2: 97%. FR: 16 irpm. Ausculta pulmonar: MV+ bilateralmente, sem sibilos. Peak flow: 420 L/min (85% do previsto).',
        avaliacao: 'Asma parcialmente controlada (ACT: 22). DRGE controlada com IBP.',
        plano: 'Manter budesonida/formoterol 200/6mcg 2x/dia. Manter omeprazol. Retorno em 90 dias. Espirometria em 6 meses.',
        cid10: 'J45 - Asma',
      },
    ],
    exames: [
      { nome: 'Espirometria VEF1', data: '2025-12-10', resultado: '82', unidade: '% previsto', referencia: '>80', status: 'normal' },
      { nome: 'SpO2', data: '2026-02-25', resultado: '97', unidade: '%', referencia: '95-100', status: 'normal' },
    ],
  },
];

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export function ProntuarioInteligente() {
  const [tela, setTela] = useState<ProntuarioTela>('lista');
  const [pacienteSelecionado, setPacienteSelecionado] = useState<PacienteFicticio | null>(null);
  const [flashbackIA, setFlashbackIA] = useState<string>('');
  const [gerandoFlashback, setGerandoFlashback] = useState(false);
  const [busca, setBusca] = useState('');
  const [novaEvolucao, setNovaEvolucao] = useState({ subjetivo: '', objetivo: '', avaliacao: '', plano: '' });
  const [transcrevendo, setTranscrevendo] = useState(false);

  // Gerar Flashback IA quando selecionar paciente
  const gerarFlashbackIA = (paciente: PacienteFicticio) => {
    setGerandoFlashback(true);
    setFlashbackIA('');
    
    // Simular chamada à Gemini API para gerar briefing
    setTimeout(() => {
      const evolucoes = paciente.evolucoes;
      const ultimaEvolucao = evolucoes[0];
      const medicamentos = paciente.medicamentosAtuais.map(m => `${m.nome} ${m.dose}`).join(', ');
      const alergias = paciente.alergias.join(', ');
      
      // Simular resposta da Gemini
      let flashback = '';
      
      if (paciente.id === 'PAC-001') {
        flashback = `🧠 FLASHBACK DO PACIENTE — Gerado por IA (Gemini)\n\n` +
          `Paciente ${paciente.nome}, ${paciente.idade} anos, acompanhada há 6 meses por HAS + DM2 + Dislipidemia.\n\n` +
          `📌 PONTOS CRÍTICOS:\n` +
          `• Parou losartana por esquecimento em Jan/26 → crise hipertensiva (PA 162/98). Reiniciada com sucesso.\n` +
          `• DM2: HbA1c caiu de 8.1% (Set/25) → 7.2% (Nov/25) → 7.0% (Fev/26). Meta quase atingida.\n` +
          `• Episódios de hipoglicemia com metformina 850mg → reduzida para 500mg em Fev/26.\n` +
          `• Dislipidemia: LDL caiu de 155 → 118 mg/dL com sinvastatina. Dentro da meta.\n\n` +
          `⚠️ ALERTAS:\n` +
          `• ALERGIA: Dipirona e Sulfa — NÃO prescrever.\n` +
          `• Risco de não-adesão: histórico de interrupção de losartana.\n` +
          `• Monitorar função renal (TFG 78 — limítrofe para DM2).\n\n` +
          `📊 TENDÊNCIA: Melhora progressiva dos parâmetros metabólicos. Peso ↓4kg em 6 meses (82→78kg).\n\n` +
          `💊 EM USO: ${medicamentos}\n` +
          `📅 PRÓXIMO RETORNO: ~60 dias (previsto para Abr/26).`;
      } else {
        flashback = `🧠 FLASHBACK DO PACIENTE — Gerado por IA (Gemini)\n\n` +
          `Paciente ${paciente.nome}, ${paciente.idade} anos, acompanhado por Asma + DRGE.\n\n` +
          `📌 PONTOS CRÍTICOS:\n` +
          `• Asma parcialmente controlada (ACT: 22/25). Uso de SOS apenas 1x/mês.\n` +
          `• Boa resposta ao budesonida/formoterol. Peak flow 85% do previsto.\n` +
          `• DRGE controlada com omeprazol 20mg.\n\n` +
          `⚠️ ALERTAS:\n` +
          `• ALERGIA: Penicilina — NÃO prescrever amoxicilina, ampicilina ou derivados.\n` +
          `• Espirometria de controle prevista para Jun/26.\n\n` +
          `💊 EM USO: ${medicamentos}`;
      }
      
      setFlashbackIA(flashback);
      setGerandoFlashback(false);
    }, 2000);
  };

  const abrirFicha = (paciente: PacienteFicticio) => {
    setPacienteSelecionado(paciente);
    setTela('ficha');
    gerarFlashbackIA(paciente);
  };

  // Simular transcrição de áudio
  const simularTranscricao = () => {
    setTranscrevendo(true);
    setTimeout(() => {
      setNovaEvolucao(prev => ({
        ...prev,
        subjetivo: 'Paciente refere dor torácica atípica há 2 dias, tipo pontada, sem irradiação, piora com respiração profunda. Nega dispneia, sudorese ou náusea. Relata estresse no trabalho.',
        objetivo: 'PA: 128/82 mmHg. FC: 76 bpm. SpO2: 98%. Ausculta cardíaca: BRNF 2T sem sopros. Pulmões: MV+ sem RA. Dor reprodutível à palpação de parede torácica.',
      }));
      setTranscrevendo(false);
    }, 3000);
  };

  // Agrupar exames por nome para gráfico de evolução
  const examesAgrupados = useMemo(() => {
    if (!pacienteSelecionado) return {};
    const grupos: Record<string, Exame[]> = {};
    pacienteSelecionado.exames.forEach(e => {
      if (!grupos[e.nome]) grupos[e.nome] = [];
      grupos[e.nome].push(e);
    });
    // Ordenar por data
    Object.keys(grupos).forEach(k => {
      grupos[k].sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime());
    });
    return grupos;
  }, [pacienteSelecionado]);

  const pacientesFiltrados = PACIENTES_DEMO.filter(p =>
    !busca || p.nome.toLowerCase().includes(busca.toLowerCase()) || p.id.includes(busca)
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Prontuário Inteligente (Simulação)" showAIWarning showEmergencyInfo />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">🧠</span> Prontuário Inteligente
          <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full font-medium">IA GEMINI</span>
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium">SIMULAÇÃO</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão de Contexto com Flashback IA — O sistema entende o histórico, não apenas armazena
        </p>
      </div>

      {/* Lista de Pacientes */}
      {tela === 'lista' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={busca}
              onChange={e => setBusca(e.target.value)}
              placeholder="Buscar paciente por nome ou código..."
              className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {pacientesFiltrados.map(p => (
              <div key={p.id}
                onClick={() => abrirFicha(p)}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition cursor-pointer group">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold group-hover:text-primary transition">{p.nome}</p>
                    <p className="text-xs text-muted-foreground">{p.idade} anos | {p.sexo === 'M' ? 'Masculino' : 'Feminino'} | {p.convenio}</p>
                  </div>
                  <span className="text-xs font-mono bg-muted/50 px-2 py-1 rounded">{p.id}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.comorbidades.map((c, i) => (
                    <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{c}</span>
                  ))}
                </div>
                {p.alergias.length > 0 && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="text-xs text-red-400 font-bold">⚠️ Alergias:</span>
                    {p.alergias.map((a, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400">{a}</span>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Última consulta: {p.evolucoes[0]?.data}</span>
                  <span>{p.evolucoes.length} evoluções | {p.medicamentosAtuais.length} medicamentos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ficha do Paciente */}
      {tela === 'ficha' && pacienteSelecionado && (
        <div className="space-y-6">
          {/* Botão voltar */}
          <button onClick={() => { setTela('lista'); setPacienteSelecionado(null); setFlashbackIA(''); }}
            className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1">
            ← Voltar à lista
          </button>

          {/* ============================================================ */}
          {/* FLASHBACK IA — O GRANDE DIFERENCIAL */}
          {/* ============================================================ */}
          <div className="bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-2 border-purple-500/30 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="text-xl">🧠</span> Flashback do Paciente
                <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">Gemini IA</span>
              </h2>
              <button onClick={() => gerarFlashbackIA(pacienteSelecionado)}
                className="px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium hover:bg-purple-500/30 transition">
                🔄 Regenerar
              </button>
            </div>
            
            {gerandoFlashback ? (
              <div className="flex items-center gap-3 py-8">
                <div className="animate-spin w-6 h-6 border-2 border-purple-400 border-t-transparent rounded-full" />
                <p className="text-sm text-purple-300 animate-pulse">Gemini está analisando {pacienteSelecionado.evolucoes.length} evoluções e {pacienteSelecionado.exames.length} exames...</p>
              </div>
            ) : flashbackIA ? (
              <pre className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap font-sans">{flashbackIA}</pre>
            ) : null}
            
            <p className="text-[10px] text-muted-foreground mt-3 italic">
              ⚠️ Resumo gerado por IA para fins educacionais. Pode conter imprecisões. Sempre verifique os dados originais.
            </p>
          </div>

          {/* Dados do Paciente */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">👤 Dados Pessoais</h3>
              <div className="space-y-1.5 text-xs text-foreground/70">
                <p><strong>Nome:</strong> {pacienteSelecionado.nome}</p>
                <p><strong>Idade:</strong> {pacienteSelecionado.idade} anos ({pacienteSelecionado.dataNascimento})</p>
                <p><strong>Sexo:</strong> {pacienteSelecionado.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
                <p><strong>CPF:</strong> {pacienteSelecionado.cpf}</p>
                <p><strong>Convênio:</strong> {pacienteSelecionado.convenio}</p>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">💊 Medicamentos em Uso</h3>
              <div className="space-y-2">
                {pacienteSelecionado.medicamentosAtuais.map((m, i) => (
                  <div key={i} className="text-xs bg-background/50 rounded-lg p-2 border border-border/50">
                    <p className="font-medium">{m.nome} {m.dose}</p>
                    <p className="text-foreground/60">{m.frequencia}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="font-bold text-sm mb-3 flex items-center gap-2">⚠️ Alertas</h3>
              {pacienteSelecionado.alergias.length > 0 && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
                  <p className="text-xs font-bold text-red-400 mb-1">ALERGIAS:</p>
                  <div className="flex flex-wrap gap-1">
                    {pacienteSelecionado.alergias.map((a, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-bold">{a}</span>
                    ))}
                  </div>
                </div>
              )}
              <div className="space-y-1">
                {pacienteSelecionado.comorbidades.map((c, i) => (
                  <span key={i} className="block text-xs px-2 py-1 rounded bg-blue-500/10 text-blue-400">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setTela('nova-evolucao')}
              className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 shadow-lg transition">
              📝 Nova Evolução
            </button>
            <button onClick={() => setTela('exames')}
              className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium hover:bg-accent transition">
              📊 Evolução de Exames
            </button>
            <button className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium hover:bg-accent transition">
              💊 Nova Prescrição
            </button>
            <button className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium hover:bg-accent transition">
              📄 Exportar Prontuário
            </button>
          </div>

          {/* Timeline de Evoluções */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">📋 Timeline de Evoluções</h3>
            <div className="space-y-4">
              {pacienteSelecionado.evolucoes.map((ev, i) => (
                <div key={ev.id} className="relative pl-6 border-l-2 border-primary/30 pb-4">
                  <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary/20 border-2 border-primary" />
                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">{ev.data}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          ev.tipo === 'urgencia' ? 'bg-red-500/10 text-red-400' :
                          ev.tipo === 'retorno' ? 'bg-blue-500/10 text-blue-400' :
                          ev.tipo === 'teleconsulta' ? 'bg-purple-500/10 text-purple-400' :
                          'bg-green-500/10 text-green-400'
                        }`}>{ev.tipo}</span>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">{ev.cid10}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{ev.medico}</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="font-bold text-blue-400 mb-1">S — Subjetivo</p>
                        <p className="text-foreground/70 leading-relaxed">{ev.subjetivo}</p>
                      </div>
                      <div>
                        <p className="font-bold text-green-400 mb-1">O — Objetivo</p>
                        <p className="text-foreground/70 leading-relaxed">{ev.objetivo}</p>
                      </div>
                      <div>
                        <p className="font-bold text-yellow-400 mb-1">A — Avaliação</p>
                        <p className="text-foreground/70 leading-relaxed">{ev.avaliacao}</p>
                      </div>
                      <div>
                        <p className="font-bold text-purple-400 mb-1">P — Plano</p>
                        <p className="text-foreground/70 leading-relaxed">{ev.plano}</p>
                      </div>
                    </div>
                    {ev.prescricao && (
                      <div className="mt-2 bg-primary/5 border border-primary/20 rounded-lg p-2 text-xs">
                        <span className="font-bold text-primary">💊 Prescrição:</span> {ev.prescricao}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Nova Evolução com Transcrição */}
      {tela === 'nova-evolucao' && pacienteSelecionado && (
        <div className="space-y-6">
          <button onClick={() => setTela('ficha')}
            className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1">
            ← Voltar à ficha
          </button>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">📝 Nova Evolução — {pacienteSelecionado.nome}</h3>
              <button onClick={simularTranscricao}
                disabled={transcrevendo}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  transcrevendo ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                }`}>
                {transcrevendo ? '🔴 Transcrevendo...' : '🎤 Transcrever Áudio (Whisper)'}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                { key: 'subjetivo', label: 'S — Subjetivo', placeholder: 'Queixa principal, HDA, revisão de sistemas...' },
                { key: 'objetivo', label: 'O — Objetivo', placeholder: 'Exame físico, sinais vitais, achados...' },
                { key: 'avaliacao', label: 'A — Avaliação', placeholder: 'Hipóteses diagnósticas, CID-10...' },
                { key: 'plano', label: 'P — Plano', placeholder: 'Conduta, prescrição, exames, retorno...' },
              ].map(field => (
                <div key={field.key}>
                  <label className="text-xs font-bold text-primary mb-1 block">{field.label}</label>
                  <textarea
                    value={novaEvolucao[field.key as keyof typeof novaEvolucao]}
                    onChange={e => setNovaEvolucao(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="w-full bg-background border border-border rounded-lg p-3 text-sm resize-none h-32 focus:border-primary focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button className="px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-medium hover:bg-accent transition">
                Salvar Rascunho
              </button>
              <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-medium hover:bg-primary/90 shadow-lg transition">
                ✓ Salvar Evolução
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evolução de Exames */}
      {tela === 'exames' && pacienteSelecionado && (
        <div className="space-y-6">
          <button onClick={() => setTela('ficha')}
            className="text-sm text-muted-foreground hover:text-foreground transition flex items-center gap-1">
            ← Voltar à ficha
          </button>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">📊 Evolução de Exames — {pacienteSelecionado.nome}</h3>
            
            {Object.entries(examesAgrupados).map(([nome, exames]) => (
              <div key={nome} className="mb-6">
                <h4 className="font-medium text-sm text-primary mb-3">{nome}</h4>
                <div className="flex items-end gap-4 h-32 bg-background/50 rounded-lg p-4 border border-border/50">
                  {exames.map((ex, i) => {
                    const valor = parseFloat(ex.resultado);
                    const maxVal = Math.max(...exames.map(e => parseFloat(e.resultado))) * 1.2;
                    const height = (valor / maxVal) * 100;
                    return (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <span className={`text-xs font-bold ${
                          ex.status === 'critico' ? 'text-red-400' :
                          ex.status === 'alterado' ? 'text-yellow-400' :
                          'text-green-400'
                        }`}>{ex.resultado}</span>
                        <div className="w-full max-w-[40px] rounded-t-lg transition-all"
                          style={{ 
                            height: `${height}%`,
                            backgroundColor: ex.status === 'critico' ? 'rgba(239,68,68,0.3)' :
                              ex.status === 'alterado' ? 'rgba(234,179,8,0.3)' : 'rgba(34,197,94,0.3)',
                            border: `1px solid ${ex.status === 'critico' ? 'rgba(239,68,68,0.5)' :
                              ex.status === 'alterado' ? 'rgba(234,179,8,0.5)' : 'rgba(34,197,94,0.5)'}`
                          }} />
                        <span className="text-[10px] text-muted-foreground">{ex.data.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Referência: {exames[0]?.referencia} {exames[0]?.unidade}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <EducationalDisclaimer variant="footer" showAIWarning />
    </div>
  );
}
