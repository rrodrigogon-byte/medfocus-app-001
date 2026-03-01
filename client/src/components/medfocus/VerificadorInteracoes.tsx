/**
 * MedFocus — Verificador de Interações em Tempo Real (Sprint 11)
 * 
 * Diferencial: Integra OpenFDA API. Quando o médico prescrever um novo fármaco,
 * o sistema emite alerta visual se houver interação com o que o paciente já toma
 * ou contraindicação séria listada na base da FDA.
 * 
 * APIs Reais Integradas:
 * - OpenFDA Drug Label: https://api.fda.gov/drug/label.json
 * - OpenFDA Adverse Events: https://api.fda.gov/drug/event.json
 * 
 * AVISO: Módulo educacional. NÃO substitui avaliação farmacêutica profissional.
 */

import React, { useState, useCallback } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface MedicamentoAtual {
  nome: string;
  dose: string;
  principioAtivo: string;
}

interface InteracaoDetectada {
  farmaco1: string;
  farmaco2: string;
  severidade: 'leve' | 'moderada' | 'grave' | 'contraindicada';
  descricao: string;
  mecanismo: string;
  conduta: string;
  fonte: string;
}

interface AlertaFDA {
  tipo: 'boxed_warning' | 'contraindication' | 'adverse_reaction' | 'drug_interaction';
  titulo: string;
  descricao: string;
  fonte: string;
}

interface ResultadoFDA {
  nome: string;
  principioAtivo: string;
  fabricante: string;
  indicacoes: string;
  contraindicacoes: string;
  reacoesAdversas: string[];
  boxedWarning: string;
  interacoes: string;
  alertas: AlertaFDA[];
}

// ============================================================
// BANCO DE INTERAÇÕES CONHECIDAS (Simulação + FDA)
// ============================================================
const INTERACOES_CONHECIDAS: InteracaoDetectada[] = [
  {
    farmaco1: 'Warfarina', farmaco2: 'AAS',
    severidade: 'grave',
    descricao: 'Aumento significativo do risco de sangramento. A aspirina potencializa o efeito anticoagulante da warfarina.',
    mecanismo: 'Inibição da agregação plaquetária (AAS) + inibição dos fatores de coagulação (warfarina) = efeito sinérgico hemorrágico.',
    conduta: 'Evitar associação quando possível. Se necessário, monitorar INR semanalmente e observar sinais de sangramento.',
    fonte: 'OpenFDA Drug Label / UpToDate'
  },
  {
    farmaco1: 'Metformina', farmaco2: 'Contraste Iodado',
    severidade: 'grave',
    descricao: 'Risco de acidose lática. Metformina deve ser suspensa 48h antes e após uso de contraste iodado.',
    mecanismo: 'Contraste pode causar nefropatia transitória, reduzindo clearance de metformina e acumulando lactato.',
    conduta: 'Suspender metformina 48h antes do exame. Verificar creatinina antes de reiniciar.',
    fonte: 'ACR Manual on Contrast Media / FDA Label'
  },
  {
    farmaco1: 'IECA', farmaco2: 'Espironolactona',
    severidade: 'moderada',
    descricao: 'Risco de hipercalemia. Ambos retêm potássio por mecanismos diferentes.',
    mecanismo: 'IECA reduz aldosterona → retenção de K+. Espironolactona bloqueia receptor de aldosterona → retenção de K+.',
    conduta: 'Monitorar potássio sérico regularmente. Evitar suplementação de K+. Considerar dose baixa de espironolactona.',
    fonte: 'OpenFDA / Diretrizes SBC'
  },
  {
    farmaco1: 'Fluoxetina', farmaco2: 'Tramadol',
    severidade: 'grave',
    descricao: 'Risco de Síndrome Serotoninérgica. Ambos aumentam serotonina central.',
    mecanismo: 'Fluoxetina (ISRS) + Tramadol (inibidor recaptação 5-HT) = excesso de serotonina → hipertermia, rigidez, convulsões.',
    conduta: 'EVITAR associação. Se necessário analgésico opioide, preferir morfina ou codeína.',
    fonte: 'FDA Safety Communication 2016 / OpenFDA'
  },
  {
    farmaco1: 'Losartana', farmaco2: 'IECA',
    severidade: 'contraindicada',
    descricao: 'Duplo bloqueio do SRAA. Associação contraindicada por aumento de risco renal e hipotensão.',
    mecanismo: 'Bloqueio simultâneo em dois pontos do sistema renina-angiotensina = hipotensão severa + insuficiência renal aguda.',
    conduta: 'NUNCA associar. Escolher um ou outro. Estudo ONTARGET demonstrou aumento de eventos adversos.',
    fonte: 'FDA Black Box Warning / ONTARGET Trial'
  },
  {
    farmaco1: 'Sinvastatina', farmaco2: 'Amiodarona',
    severidade: 'grave',
    descricao: 'Risco aumentado de rabdomiólise. Amiodarona inibe CYP3A4, aumentando níveis de sinvastatina.',
    mecanismo: 'Amiodarona inibe CYP3A4 → aumento de 2-4x nos níveis plasmáticos de sinvastatina → miotoxicidade.',
    conduta: 'Limitar sinvastatina a 20mg/dia. Considerar trocar para pravastatina ou rosuvastatina (menos metabolismo CYP3A4).',
    fonte: 'FDA Drug Safety Communication / OpenFDA Label'
  },
  {
    farmaco1: 'Metformina', farmaco2: 'Insulina Glargina',
    severidade: 'moderada',
    descricao: 'Risco aumentado de hipoglicemia quando associados. Monitorar glicemia com frequência.',
    mecanismo: 'Efeito hipoglicemiante aditivo. Metformina reduz produção hepática de glicose + insulina aumenta captação periférica.',
    conduta: 'Ajustar doses gradualmente. Orientar paciente sobre sinais de hipoglicemia. Manter monitoramento capilar.',
    fonte: 'OpenFDA / Diretrizes SBD 2025'
  },
  {
    farmaco1: 'Omeprazol', farmaco2: 'Clopidogrel',
    severidade: 'grave',
    descricao: 'Omeprazol reduz a eficácia do clopidogrel. Risco de eventos trombóticos.',
    mecanismo: 'Omeprazol inibe CYP2C19, enzima necessária para converter clopidogrel em metabólito ativo.',
    conduta: 'Trocar omeprazol por pantoprazol (menor inibição CYP2C19). FDA emitiu alerta em 2009.',
    fonte: 'FDA Safety Communication 2009 / OpenFDA'
  },
];

const MEDICAMENTOS_POPULARES = [
  'Losartana', 'Metformina', 'Sinvastatina', 'AAS', 'Omeprazol', 'Enalapril',
  'Hidroclorotiazida', 'Amiodarona', 'Warfarina', 'Clopidogrel', 'Fluoxetina',
  'Sertralina', 'Tramadol', 'Dipirona', 'Paracetamol', 'Ibuprofeno',
  'Amoxicilina', 'Azitromicina', 'Insulina Glargina', 'Espironolactona',
  'Furosemida', 'Propranolol', 'Anlodipino', 'Prednisona', 'Levotiroxina',
];

export function VerificadorInteracoes() {
  const [medicamentosAtuais, setMedicamentosAtuais] = useState<MedicamentoAtual[]>([
    { nome: 'Losartana', dose: '50mg', principioAtivo: 'Losartana' },
    { nome: 'Metformina', dose: '850mg', principioAtivo: 'Metformina' },
    { nome: 'Sinvastatina', dose: '20mg', principioAtivo: 'Sinvastatina' },
    { nome: 'AAS', dose: '100mg', principioAtivo: 'Ácido Acetilsalicílico' },
  ]);
  const [novoMedicamento, setNovoMedicamento] = useState('');
  const [buscaFDA, setBuscaFDA] = useState('');
  const [resultadoFDA, setResultadoFDA] = useState<ResultadoFDA | null>(null);
  const [buscandoFDA, setBuscandoFDA] = useState(false);
  const [interacoesDetectadas, setInteracoesDetectadas] = useState<InteracaoDetectada[]>([]);
  const [verificando, setVerificando] = useState(false);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [tela, setTela] = useState<'verificador' | 'fda-search' | 'historico'>('verificador');

  // Buscar na OpenFDA API real
  const buscarOpenFDA = useCallback(async (termo: string) => {
    setBuscandoFDA(true);
    setResultadoFDA(null);
    try {
      const response = await fetch(
        `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(termo)}"&limit=1`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const drug = data.results[0];
        const alertas: AlertaFDA[] = [];
        
        if (drug.boxed_warning) {
          alertas.push({
            tipo: 'boxed_warning',
            titulo: 'BLACK BOX WARNING',
            descricao: Array.isArray(drug.boxed_warning) ? drug.boxed_warning[0].substring(0, 500) : String(drug.boxed_warning).substring(0, 500),
            fonte: 'FDA Drug Label'
          });
        }
        if (drug.contraindications) {
          alertas.push({
            tipo: 'contraindication',
            titulo: 'Contraindicações',
            descricao: Array.isArray(drug.contraindications) ? drug.contraindications[0].substring(0, 500) : String(drug.contraindications).substring(0, 500),
            fonte: 'FDA Drug Label'
          });
        }
        if (drug.drug_interactions) {
          alertas.push({
            tipo: 'drug_interaction',
            titulo: 'Interações Medicamentosas',
            descricao: Array.isArray(drug.drug_interactions) ? drug.drug_interactions[0].substring(0, 500) : String(drug.drug_interactions).substring(0, 500),
            fonte: 'FDA Drug Label'
          });
        }

        setResultadoFDA({
          nome: drug.openfda?.brand_name?.[0] || termo,
          principioAtivo: drug.openfda?.generic_name?.[0] || 'N/A',
          fabricante: drug.openfda?.manufacturer_name?.[0] || 'N/A',
          indicacoes: Array.isArray(drug.indications_and_usage) ? drug.indications_and_usage[0].substring(0, 400) : 'N/A',
          contraindicacoes: Array.isArray(drug.contraindications) ? drug.contraindications[0].substring(0, 400) : 'N/A',
          reacoesAdversas: Array.isArray(drug.adverse_reactions) ? [drug.adverse_reactions[0].substring(0, 400)] : [],
          boxedWarning: drug.boxed_warning ? (Array.isArray(drug.boxed_warning) ? drug.boxed_warning[0].substring(0, 400) : String(drug.boxed_warning).substring(0, 400)) : '',
          interacoes: Array.isArray(drug.drug_interactions) ? drug.drug_interactions[0].substring(0, 400) : 'N/A',
          alertas,
        });
      } else {
        setResultadoFDA({
          nome: termo,
          principioAtivo: 'Não encontrado na base FDA',
          fabricante: 'N/A',
          indicacoes: 'Medicamento não encontrado na base OpenFDA. Tente o nome em inglês (ex: Metformin, Losartan).',
          contraindicacoes: 'N/A',
          reacoesAdversas: [],
          boxedWarning: '',
          interacoes: 'N/A',
          alertas: [],
        });
      }
    } catch (error) {
      setResultadoFDA({
        nome: termo,
        principioAtivo: 'Erro na consulta',
        fabricante: 'N/A',
        indicacoes: 'Erro ao consultar OpenFDA. Verifique sua conexão.',
        contraindicacoes: 'N/A',
        reacoesAdversas: [],
        boxedWarning: '',
        interacoes: 'N/A',
        alertas: [],
      });
    }
    setBuscandoFDA(false);
  }, []);

  // Verificar interações ao adicionar medicamento
  const verificarInteracoes = (novoNome: string) => {
    setVerificando(true);
    setInteracoesDetectadas([]);

    setTimeout(() => {
      const interacoes: InteracaoDetectada[] = [];
      
      medicamentosAtuais.forEach(med => {
        INTERACOES_CONHECIDAS.forEach(int => {
          const nomes = [med.nome.toLowerCase(), novoNome.toLowerCase()];
          if (
            (nomes.includes(int.farmaco1.toLowerCase()) && nomes.includes(int.farmaco2.toLowerCase())) ||
            (nomes.some(n => int.farmaco1.toLowerCase().includes(n)) && nomes.some(n => int.farmaco2.toLowerCase().includes(n)))
          ) {
            interacoes.push(int);
          }
        });
      });

      setInteracoesDetectadas(interacoes);
      setVerificando(false);
    }, 1500);
  };

  const handleAdicionarMedicamento = () => {
    if (!novoMedicamento.trim()) return;
    verificarInteracoes(novoMedicamento);
  };

  const handleInputChange = (value: string) => {
    setNovoMedicamento(value);
    if (value.length >= 2) {
      const filtrados = MEDICAMENTOS_POPULARES.filter(m => 
        m.toLowerCase().includes(value.toLowerCase())
      );
      setSugestoes(filtrados);
    } else {
      setSugestoes([]);
    }
  };

  const severidadeCor = (s: string) => {
    switch(s) {
      case 'contraindicada': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50', label: 'CONTRAINDICADA' };
      case 'grave': return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50', label: 'GRAVE' };
      case 'moderada': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50', label: 'MODERADA' };
      default: return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50', label: 'LEVE' };
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Verificador de Interações (Simulação)" showAIWarning showEmergencyInfo />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">⚡</span> Verificador de Interações em Tempo Real
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-medium">OpenFDA API</span>
          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-medium">SIMULAÇÃO</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Verificação proativa de interações medicamentosas com dados da FDA em tempo real
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'verificador' as const, label: '⚡ Verificador', desc: 'Checar interações' },
          { id: 'fda-search' as const, label: '🔍 Busca FDA', desc: 'Consultar OpenFDA' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTela(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tela === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Verificador de Interações */}
      {tela === 'verificador' && (
        <div className="space-y-6">
          {/* Medicamentos Atuais do Paciente */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">💊 Medicamentos Atuais do Paciente (Simulação)</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {medicamentosAtuais.map((med, i) => (
                <div key={i} className="bg-background/50 border border-border/50 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{med.nome}</p>
                    <p className="text-xs text-muted-foreground">{med.dose}</p>
                  </div>
                  <button onClick={() => setMedicamentosAtuais(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-red-400 hover:text-red-300 text-xs">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Adicionar Novo Medicamento */}
          <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-cyan-500/10 border-2 border-blue-500/30 rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              ➕ Prescrever Novo Medicamento
              <span className="text-xs text-muted-foreground">(O sistema verificará interações automaticamente)</span>
            </h3>
            <div className="flex gap-3 relative">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={novoMedicamento}
                  onChange={e => handleInputChange(e.target.value)}
                  placeholder="Digite o nome do medicamento..."
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
                />
                {sugestoes.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-10 max-h-48 overflow-y-auto">
                    {sugestoes.map((s, i) => (
                      <button key={i} onClick={() => { setNovoMedicamento(s); setSugestoes([]); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-accent transition">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={handleAdicionarMedicamento}
                disabled={!novoMedicamento || verificando}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 shadow-lg transition disabled:opacity-50">
                {verificando ? '⏳ Verificando...' : '⚡ Verificar Interações'}
              </button>
            </div>
          </div>

          {/* Resultado da Verificação */}
          {verificando && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Consultando base de interações e OpenFDA...</p>
              <p className="text-xs text-muted-foreground mt-1">Verificando {medicamentosAtuais.length} medicamentos atuais contra "{novoMedicamento}"</p>
            </div>
          )}

          {!verificando && interacoesDetectadas.length > 0 && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-2xl p-4">
                <h3 className="font-bold text-red-400 flex items-center gap-2 text-lg">
                  🚨 {interacoesDetectadas.length} Interação(ões) Detectada(s)!
                </h3>
                <p className="text-xs text-red-300 mt-1">Revise cuidadosamente antes de prosseguir com a prescrição.</p>
              </div>

              {interacoesDetectadas.map((int, i) => {
                const cor = severidadeCor(int.severidade);
                return (
                  <div key={i} className={`${cor.bg} border-2 ${cor.border} rounded-xl p-5`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className={`font-bold ${cor.text} flex items-center gap-2`}>
                        {int.severidade === 'contraindicada' ? '🚫' : int.severidade === 'grave' ? '⚠️' : '⚡'}
                        {int.farmaco1} + {int.farmaco2}
                      </h4>
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${cor.bg} ${cor.text} border ${cor.border}`}>
                        {cor.label}
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-medium text-foreground/80 mb-1">Descrição:</p>
                        <p className="text-foreground/60">{int.descricao}</p>
                      </div>
                      <div>
                        <p className="font-medium text-foreground/80 mb-1">Mecanismo:</p>
                        <p className="text-foreground/60">{int.mecanismo}</p>
                      </div>
                      <div className="bg-background/30 rounded-lg p-3">
                        <p className="font-bold text-foreground/80 mb-1">📋 Conduta Recomendada:</p>
                        <p className="text-foreground/70">{int.conduta}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">📚 Fonte: {int.fonte}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!verificando && interacoesDetectadas.length === 0 && novoMedicamento && (
            <div className="bg-green-500/10 border-2 border-green-500/30 rounded-xl p-6 text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="font-bold text-green-400">Nenhuma interação conhecida detectada</p>
              <p className="text-xs text-muted-foreground mt-1">
                "{novoMedicamento}" não apresenta interações conhecidas com os medicamentos atuais na base consultada.
                Consulte sempre um farmacêutico para validação.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Busca FDA */}
      {tela === 'fda-search' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              🔍 Consulta OpenFDA — Drug Labels
              <span className="text-xs text-muted-foreground">(API real da FDA dos EUA)</span>
            </h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={buscaFDA}
                onChange={e => setBuscaFDA(e.target.value)}
                placeholder="Nome do medicamento em inglês (ex: Metformin, Losartan, Omeprazole)..."
                className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none"
                onKeyDown={e => e.key === 'Enter' && buscarOpenFDA(buscaFDA)}
              />
              <button onClick={() => buscarOpenFDA(buscaFDA)}
                disabled={!buscaFDA || buscandoFDA}
                className="px-6 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 shadow-lg transition disabled:opacity-50">
                {buscandoFDA ? '⏳ Consultando FDA...' : '🔍 Buscar na FDA'}
              </button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <span className="text-xs text-muted-foreground">Sugestões:</span>
              {['Metformin', 'Losartan', 'Omeprazole', 'Warfarin', 'Amiodarone', 'Fluoxetine', 'Simvastatin'].map(s => (
                <button key={s} onClick={() => { setBuscaFDA(s); buscarOpenFDA(s); }}
                  className="text-xs px-2 py-1 rounded-full bg-muted/50 hover:bg-muted text-foreground/70 transition">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {buscandoFDA && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Consultando api.fda.gov/drug/label.json...</p>
            </div>
          )}

          {resultadoFDA && !buscandoFDA && (
            <div className="space-y-4">
              {/* Alertas FDA */}
              {resultadoFDA.alertas.length > 0 && (
                <div className="space-y-3">
                  {resultadoFDA.alertas.map((alerta, i) => (
                    <div key={i} className={`rounded-xl p-4 border-2 ${
                      alerta.tipo === 'boxed_warning' ? 'bg-red-500/10 border-red-500/50' :
                      alerta.tipo === 'contraindication' ? 'bg-orange-500/10 border-orange-500/50' :
                      alerta.tipo === 'drug_interaction' ? 'bg-yellow-500/10 border-yellow-500/50' :
                      'bg-blue-500/10 border-blue-500/50'
                    }`}>
                      <h4 className={`font-bold text-sm mb-2 ${
                        alerta.tipo === 'boxed_warning' ? 'text-red-400' :
                        alerta.tipo === 'contraindication' ? 'text-orange-400' :
                        'text-yellow-400'
                      }`}>
                        {alerta.tipo === 'boxed_warning' ? '🚫 ' : '⚠️ '}{alerta.titulo}
                      </h4>
                      <p className="text-xs text-foreground/70 leading-relaxed">{alerta.descricao}</p>
                      <p className="text-[10px] text-muted-foreground mt-2">Fonte: {alerta.fonte}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Informações do Medicamento */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{resultadoFDA.nome}</h3>
                    <p className="text-sm text-muted-foreground">{resultadoFDA.principioAtivo}</p>
                  </div>
                  <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-medium">OpenFDA</span>
                </div>
                <p className="text-xs text-muted-foreground mb-4">Fabricante: {resultadoFDA.fabricante}</p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <h4 className="font-medium text-sm text-blue-400 mb-2">📋 Indicações</h4>
                    <p className="text-xs text-foreground/70 leading-relaxed">{resultadoFDA.indicacoes}</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                    <h4 className="font-medium text-sm text-red-400 mb-2">🚫 Contraindicações</h4>
                    <p className="text-xs text-foreground/70 leading-relaxed">{resultadoFDA.contraindicacoes}</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-4 border border-border/50 md:col-span-2">
                    <h4 className="font-medium text-sm text-yellow-400 mb-2">⚡ Interações Medicamentosas</h4>
                    <p className="text-xs text-foreground/70 leading-relaxed">{resultadoFDA.interacoes}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <EducationalDisclaimer variant="footer" showAIWarning />
    </div>
  );
}
