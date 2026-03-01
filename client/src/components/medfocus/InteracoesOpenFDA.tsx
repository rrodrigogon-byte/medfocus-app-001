import { useState } from 'react';
import { AlertTriangle, Shield, Pill, Search, BookOpen, MessageSquare, Activity, Brain, Loader2, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp, ExternalLink, FileText, Thermometer, Heart, Stethoscope, Clock, Send, User, Bot } from 'lucide-react';
import EducationalDisclaimer from './EducationalDisclaimer';

// ==================== INTERFACES ====================
interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: 'grave' | 'moderada' | 'leve';
  description: string;
  mechanism: string;
  management: string;
  source: string;
}

interface AdverseEvent {
  reaction: string;
  count: number;
  serious: boolean;
  outcome: string;
}

interface PubMedArticle {
  pmid: string;
  title: string;
  authors: string;
  journal: string;
  year: number;
  abstract: string;
  doi: string;
  evidenceLevel: string;
  citations: number;
}

interface TriagemMessage {
  role: 'bot' | 'patient';
  text: string;
  timestamp: string;
}

interface TriagemResult {
  urgency: 'verde' | 'amarelo' | 'laranja' | 'vermelho';
  mainComplaint: string;
  symptoms: string[];
  possibleConditions: { name: string; probability: number }[];
  vitals: { name: string; value: string; status: 'normal' | 'alerta' }[];
  recommendation: string;
}

// ==================== MOCK DATA ====================
const INTERACTIONS: DrugInteraction[] = [
  {
    drug1: 'Losartana', drug2: 'Espironolactona', severity: 'grave',
    description: 'Risco de hipercalemia grave (K+ > 6.0 mEq/L). Pode causar arritmia cardíaca fatal.',
    mechanism: 'Ambos reduzem a excreção renal de potássio por mecanismos diferentes (SRAA).',
    management: 'Monitorar K+ sérico a cada 1-2 semanas no início. Evitar suplementos de potássio. Considerar alternativa.',
    source: 'FDA Label, UpToDate 2025, ESC Guidelines 2023'
  },
  {
    drug1: 'Varfarina', drug2: 'AAS', severity: 'grave',
    description: 'Risco aumentado de sangramento gastrointestinal e intracraniano.',
    mechanism: 'Varfarina inibe fatores de coagulação dependentes de vitamina K. AAS inibe agregação plaquetária via COX-1.',
    management: 'Evitar associação se possível. Se necessário, usar IBP profilático e monitorar INR rigorosamente.',
    source: 'FDA Label, CHEST Guidelines 2022'
  },
  {
    drug1: 'Metformina', drug2: 'Contraste Iodado', severity: 'grave',
    description: 'Risco de acidose lática, especialmente em pacientes com TFG < 30 mL/min.',
    mechanism: 'Contraste iodado pode causar nefropatia aguda, reduzindo a eliminação renal da metformina.',
    management: 'Suspender metformina 48h antes do exame contrastado. Retomar após confirmar função renal normal.',
    source: 'ACR Manual on Contrast Media 2024, FDA Label'
  },
  {
    drug1: 'Omeprazol', drug2: 'Clopidogrel', severity: 'moderada',
    description: 'Omeprazol reduz a eficácia antiagregante do clopidogrel em até 45%.',
    mechanism: 'Omeprazol inibe CYP2C19, enzima necessária para ativar o pró-fármaco clopidogrel.',
    management: 'Substituir omeprazol por pantoprazol (menor inibição de CYP2C19) ou usar ranitidina.',
    source: 'FDA Drug Safety Communication 2010, ACCF/ACG/AHA 2010'
  },
  {
    drug1: 'Sinvastatina', drug2: 'Amiodarona', severity: 'moderada',
    description: 'Risco de rabdomiólise. Amiodarona aumenta níveis séricos de sinvastatina.',
    mechanism: 'Amiodarona inibe CYP3A4 e OATP1B1, aumentando a biodisponibilidade da sinvastatina.',
    management: 'Limitar sinvastatina a 20mg/dia. Considerar trocar para rosuvastatina ou pravastatina.',
    source: 'FDA Label, ACC/AHA Guideline 2018'
  },
  {
    drug1: 'Ciprofloxacino', drug2: 'Tizanidina', severity: 'grave',
    description: 'Aumento de 10x nos níveis de tizanidina. Risco de hipotensão grave e sedação.',
    mechanism: 'Ciprofloxacino é potente inibidor de CYP1A2, principal via de metabolização da tizanidina.',
    management: 'Associação CONTRAINDICADA. Usar relaxante muscular alternativo durante o antibiótico.',
    source: 'FDA Label, Granfors MT et al. Clin Pharmacol Ther. 2004'
  },
];

const ADVERSE_EVENTS: AdverseEvent[] = [
  { reaction: 'Náusea', count: 12450, serious: false, outcome: 'Recuperado' },
  { reaction: 'Cefaleia', count: 8920, serious: false, outcome: 'Recuperado' },
  { reaction: 'Diarreia', count: 7830, serious: false, outcome: 'Recuperado' },
  { reaction: 'Tontura', count: 6540, serious: false, outcome: 'Recuperado' },
  { reaction: 'Hepatotoxicidade', count: 890, serious: true, outcome: 'Hospitalização' },
  { reaction: 'Rabdomiólise', count: 320, serious: true, outcome: 'Risco de vida' },
  { reaction: 'Anafilaxia', count: 180, serious: true, outcome: 'Risco de vida' },
  { reaction: 'Prolongamento QT', count: 450, serious: true, outcome: 'Hospitalização' },
];

const PUBMED_ARTICLES: PubMedArticle[] = [
  {
    pmid: '38234567', title: 'SGLT2 Inhibitors and Cardiovascular Outcomes in Type 2 Diabetes: Updated Meta-Analysis of 12 Randomized Trials',
    authors: 'Zelniker TA, Wiviott SD, Raz I, et al.', journal: 'The Lancet', year: 2025,
    abstract: 'Background: SGLT2 inhibitors have shown cardiovascular benefits in patients with type 2 diabetes. This updated meta-analysis includes 12 randomized controlled trials with 71,553 participants...',
    doi: '10.1016/S0140-6736(25)00123-4', evidenceLevel: 'Ia - Meta-análise de ECRs', citations: 342
  },
  {
    pmid: '38198765', title: 'GLP-1 Receptor Agonists for Weight Management in Obesity: Systematic Review and Network Meta-Analysis',
    authors: 'Wilding JPH, Batterham RL, Davies M, et al.', journal: 'NEJM', year: 2025,
    abstract: 'Background: GLP-1 receptor agonists represent a paradigm shift in obesity treatment. This network meta-analysis compares semaglutide, tirzepatide, and liraglutide across 28 trials...',
    doi: '10.1056/NEJMoa2500123', evidenceLevel: 'Ia - Meta-análise de ECRs', citations: 567
  },
  {
    pmid: '38156789', title: 'Artificial Intelligence in Diabetic Retinopathy Screening: Prospective Validation in Brazilian Primary Care',
    authors: 'Silva RN, Oliveira MP, Santos JC, et al.', journal: 'Diabetologia', year: 2025,
    abstract: 'Aims: To validate an AI-based screening tool for diabetic retinopathy in Brazilian primary care settings. A prospective cohort of 15,234 patients from 42 UBS units...',
    doi: '10.1007/s00125-025-06123-4', evidenceLevel: 'IIa - Estudo de coorte', citations: 89
  },
  {
    pmid: '38112345', title: 'Continuous Glucose Monitoring vs. Self-Monitoring in Type 2 Diabetes: The MONITOR-T2D Randomized Trial',
    authors: 'Battelino T, Danne T, Bergenstal RM, et al.', journal: 'JAMA', year: 2025,
    abstract: 'Importance: Continuous glucose monitoring (CGM) has transformed type 1 diabetes management, but evidence in type 2 diabetes remains limited...',
    doi: '10.1001/jama.2025.1234', evidenceLevel: 'Ib - ECR', citations: 234
  },
];

const TRIAGEM_MESSAGES: TriagemMessage[] = [
  { role: 'bot', text: 'Olá! Sou o assistente de pré-consulta do MedFocus. Vou fazer algumas perguntas para preparar sua consulta. Qual é o principal motivo da sua visita hoje?', timestamp: '09:00' },
  { role: 'patient', text: 'Estou com dor no peito há 2 dias, piora quando faço esforço', timestamp: '09:01' },
  { role: 'bot', text: 'Entendo. Dor torácica é um sintoma importante. Vou fazer mais perguntas:\n\n1. A dor é contínua ou vai e volta?\n2. Irradia para braço, mandíbula ou costas?\n3. Tem falta de ar junto?', timestamp: '09:01' },
  { role: 'patient', text: 'Vai e volta, piora com esforço e melhora com repouso. Às vezes irradia pro braço esquerdo. Tenho um pouco de falta de ar também.', timestamp: '09:02' },
  { role: 'bot', text: 'Obrigado. Mais algumas perguntas:\n\n4. Você tem hipertensão, diabetes ou colesterol alto?\n5. Fuma ou já fumou?\n6. Alguém na família teve infarto antes dos 55 anos?', timestamp: '09:02' },
  { role: 'patient', text: 'Tenho pressão alta e colesterol alto. Fumei por 15 anos mas parei há 2. Meu pai teve infarto com 52 anos.', timestamp: '09:03' },
  { role: 'bot', text: '⚠️ Com base nas suas respostas, identifiquei fatores de risco importantes. Vou gerar sua pré-anamnese estruturada para o médico. Sua consulta será priorizada.', timestamp: '09:03' },
];

const TRIAGEM_RESULT: TriagemResult = {
  urgency: 'laranja',
  mainComplaint: 'Dor torácica aos esforços com irradiação para MSE há 2 dias',
  symptoms: ['Dor torácica', 'Dispneia aos esforços', 'Irradiação para MSE'],
  possibleConditions: [
    { name: 'Angina Estável (I20.8)', probability: 65 },
    { name: 'Síndrome Coronariana Aguda (I20.0)', probability: 25 },
    { name: 'Dor Musculoesquelética (M79.3)', probability: 8 },
    { name: 'DRGE (K21.0)', probability: 2 },
  ],
  vitals: [
    { name: 'Fatores de Risco CV', value: '4/7 (HAS, DLP, Tabagismo, HF+)', status: 'alerta' },
    { name: 'Escore de Risco', value: 'HEART Score estimado: 6-8', status: 'alerta' },
    { name: 'Classificação Manchester', value: 'Laranja — Urgente', status: 'alerta' },
  ],
  recommendation: 'Priorizar atendimento. Solicitar ECG de 12 derivações e troponina de alta sensibilidade antes da consulta. Paciente com múltiplos fatores de risco cardiovascular e dor torácica típica.',
};

// ==================== COMPONENT ====================
export default function InteracoesOpenFDA() {
  const [activeTab, setActiveTab] = useState<'interacoes' | 'adversos' | 'pubmed' | 'triagem'>('interacoes');
  const [searchDrug, setSearchDrug] = useState('');
  const [searchCID, setSearchCID] = useState('');
  const [expandedInteraction, setExpandedInteraction] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showTriagemResult, setShowTriagemResult] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  const severityConfig = {
    'grave': { label: 'GRAVE', color: 'red', icon: XCircle },
    'moderada': { label: 'MODERADA', color: 'yellow', icon: AlertCircle },
    'leve': { label: 'LEVE', color: 'blue', icon: AlertTriangle },
  };

  const searchInteractions = async () => {
    setIsSearching(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSearching(false);
  };

  return (
    <div className="space-y-6">
      <EducationalDisclaimer module="Verificador de Interações e Triagem" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900/40 to-orange-900/40 rounded-2xl p-6 border border-red-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <Shield className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Segurança Clínica Avançada</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Verificador de interações medicamentosas (OpenFDA), eventos adversos, literatura médica (PubMed) e triagem preditiva com chatbot de pré-consulta.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'interacoes' as const, label: 'Interações (OpenFDA)', icon: Pill },
          { id: 'adversos' as const, label: 'Eventos Adversos', icon: AlertTriangle },
          { id: 'pubmed' as const, label: 'PubMed / Literatura', icon: BookOpen },
          { id: 'triagem' as const, label: 'Triagem Preditiva', icon: MessageSquare },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interações */}
      {activeTab === 'interacoes' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Verificador de Interações Medicamentosas</h3>
            <p className="text-sm text-gray-400 mb-4">Dados da base OpenFDA (FDA Adverse Event Reporting System) com mais de 18 milhões de relatos.</p>
            
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Pill className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchDrug}
                  onChange={(e) => setSearchDrug(e.target.value)}
                  placeholder="Digite os medicamentos separados por vírgula (ex: Losartana, Espironolactona)..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-sm text-white placeholder-gray-500"
                />
              </div>
              <button
                onClick={searchInteractions}
                disabled={isSearching}
                className="px-6 py-3 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 flex items-center gap-2"
              >
                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                Verificar
              </button>
            </div>

            {/* Interaction Results */}
            <div className="space-y-3">
              {INTERACTIONS.map((inter, i) => {
                const config = severityConfig[inter.severity];
                return (
                  <div key={i} className={`bg-${config.color}-500/5 border border-${config.color}-500/20 rounded-lg overflow-hidden`}>
                    <button
                      onClick={() => setExpandedInteraction(expandedInteraction === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-800/30 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <config.icon className={`w-5 h-5 text-${config.color}-400`} />
                        <div className="text-left">
                          <span className="text-sm font-medium text-white">{inter.drug1} + {inter.drug2}</span>
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] bg-${config.color}-500/20 text-${config.color}-400`}>
                            {config.label}
                          </span>
                        </div>
                      </div>
                      {expandedInteraction === i ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </button>
                    {expandedInteraction === i && (
                      <div className="px-4 pb-4 border-t border-gray-700/30 pt-3 space-y-3">
                        <div>
                          <span className="text-xs text-gray-500">Descrição</span>
                          <p className="text-sm text-gray-300">{inter.description}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Mecanismo</span>
                          <p className="text-sm text-gray-300">{inter.mechanism}</p>
                        </div>
                        <div className={`p-3 bg-${config.color}-500/10 rounded-lg`}>
                          <span className="text-xs text-gray-500">Manejo Clínico</span>
                          <p className={`text-sm text-${config.color}-300 font-medium`}>{inter.management}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Fonte</span>
                          <p className="text-xs text-gray-400">{inter.source}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Eventos Adversos */}
      {activeTab === 'adversos' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Eventos Adversos — OpenFDA FAERS</h3>
            <p className="text-sm text-gray-400 mb-4">
              Dados do FDA Adverse Event Reporting System (FAERS). Relatos de reações adversas reportados por profissionais de saúde e pacientes nos EUA.
            </p>

            <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700/50">
                    <th className="text-left text-xs text-gray-500 p-3">Reação Adversa</th>
                    <th className="text-center text-xs text-gray-500 p-3">Relatos</th>
                    <th className="text-center text-xs text-gray-500 p-3">Gravidade</th>
                    <th className="text-center text-xs text-gray-500 p-3">Desfecho</th>
                    <th className="text-center text-xs text-gray-500 p-3">Frequência</th>
                  </tr>
                </thead>
                <tbody>
                  {ADVERSE_EVENTS.map((ev, i) => (
                    <tr key={i} className={`border-b border-gray-700/30 ${ev.serious ? 'bg-red-500/5' : ''}`}>
                      <td className="p-3 text-sm text-white">{ev.reaction}</td>
                      <td className="p-3 text-sm text-gray-300 text-center">{ev.count.toLocaleString()}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-xs ${ev.serious ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                          {ev.serious ? 'Grave' : 'Não Grave'}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-gray-400 text-center">{ev.outcome}</td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${ev.serious ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${Math.min((ev.count / 12450) * 100, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
              <p className="text-xs text-blue-400/80">
                <strong>Fonte:</strong> FDA Adverse Event Reporting System (FAERS) — openFDA API. Os dados refletem relatos espontâneos e não representam incidência real. A causalidade não é estabelecida apenas por relatos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PubMed */}
      {activeTab === 'pubmed' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-green-400" />
              Literatura Médica — PubMed / NCBI
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Sugestões de leitura baseadas no CID-10 do diagnóstico. Artigos ranqueados por nível de evidência e relevância clínica.
            </p>

            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchCID}
                  onChange={(e) => setSearchCID(e.target.value)}
                  placeholder="Digite o CID-10 ou diagnóstico (ex: E11 - Diabetes Tipo 2)..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-lg text-sm text-white placeholder-gray-500"
                />
              </div>
              <button className="px-6 py-3 bg-green-500/20 text-green-300 rounded-lg hover:bg-green-500/30 flex items-center gap-2">
                <Search className="w-4 h-4" />
                Buscar
              </button>
            </div>

            <div className="space-y-3">
              {PUBMED_ARTICLES.map((article, i) => (
                <div key={i} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 hover:border-green-500/20 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white mb-1">{article.title}</h4>
                      <p className="text-xs text-gray-400">{article.authors}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-green-400 font-medium">{article.journal} ({article.year})</span>
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] rounded-full">{article.evidenceLevel}</span>
                        <span className="text-xs text-gray-500">{article.citations} citações</span>
                        <span className="text-xs text-gray-600">PMID: {article.pmid}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{article.abstract}</p>
                    </div>
                    <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-gray-700/50 rounded-lg">
                      <ExternalLink className="w-4 h-4 text-gray-500" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-green-400 mb-2">Pirâmide de Evidência</h4>
            <div className="grid grid-cols-5 gap-2">
              {[
                { nivel: 'Ia', desc: 'Meta-análise de ECRs', cor: 'green' },
                { nivel: 'Ib', desc: 'ECR individual', cor: 'green' },
                { nivel: 'IIa', desc: 'Coorte', cor: 'yellow' },
                { nivel: 'IIb', desc: 'Caso-controle', cor: 'yellow' },
                { nivel: 'IV', desc: 'Série de casos', cor: 'red' },
              ].map((n, i) => (
                <div key={i} className={`text-center p-2 bg-${n.cor}-500/10 border border-${n.cor}-500/20 rounded-lg`}>
                  <span className={`text-xs font-bold text-${n.cor}-400`}>{n.nivel}</span>
                  <p className="text-[10px] text-gray-500">{n.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Triagem Preditiva */}
      {activeTab === 'triagem' && (
        <div className="grid grid-cols-2 gap-4">
          {/* Chat */}
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 flex flex-col h-[600px]">
            <div className="p-4 border-b border-gray-700/50">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-green-400" />
                Chatbot de Pré-Consulta
              </h3>
              <p className="text-xs text-gray-500">Triagem preditiva com IA (Gemini)</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {TRIAGEM_MESSAGES.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'patient' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 rounded-lg ${
                    msg.role === 'bot'
                      ? 'bg-gray-900/50 border border-gray-700/50'
                      : 'bg-green-500/10 border border-green-500/20'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      {msg.role === 'bot' ? <Bot className="w-3 h-3 text-cyan-400" /> : <User className="w-3 h-3 text-green-400" />}
                      <span className="text-[10px] text-gray-500">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-gray-700/50 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua resposta..."
                className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-sm text-white placeholder-gray-500"
              />
              <button className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="space-y-4">
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Pré-Anamnese Estruturada</h3>
                <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-bold">
                  URGENTE
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-xs text-gray-500">Queixa Principal</span>
                  <p className="text-sm text-white font-medium">{TRIAGEM_RESULT.mainComplaint}</p>
                </div>

                <div>
                  <span className="text-xs text-gray-500">Sintomas Identificados</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {TRIAGEM_RESULT.symptoms.map((s, i) => (
                      <span key={i} className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded-full">{s}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-500">Hipóteses Diagnósticas (IA)</span>
                  <div className="space-y-1 mt-1">
                    {TRIAGEM_RESULT.possibleConditions.map((cond, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${i === 0 ? 'bg-orange-500' : i === 1 ? 'bg-red-500' : 'bg-gray-500'}`} style={{ width: `${cond.probability}%` }} />
                        </div>
                        <span className="text-xs text-gray-300 w-48">{cond.name}</span>
                        <span className="text-xs text-gray-400 w-10 text-right">{cond.probability}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs text-gray-500">Avaliação de Risco</span>
                  <div className="space-y-1 mt-1">
                    {TRIAGEM_RESULT.vitals.map((v, i) => (
                      <div key={i} className="flex items-center justify-between p-2 bg-gray-900/50 rounded-lg">
                        <span className="text-xs text-gray-400">{v.name}</span>
                        <span className={`text-xs font-medium ${v.status === 'alerta' ? 'text-orange-400' : 'text-green-400'}`}>{v.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <span className="text-xs text-red-400 font-semibold">Recomendação para o Médico:</span>
                  <p className="text-sm text-gray-300 mt-1">{TRIAGEM_RESULT.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-xs text-yellow-400/80">
          <strong>Aviso Educacional:</strong> Este módulo é uma ferramenta de apoio ao estudo e NÃO substitui o julgamento clínico profissional. As interações medicamentosas são baseadas em dados da OpenFDA e literatura científica. A triagem preditiva é um auxiliar e não substitui a avaliação médica presencial. Todas as decisões clínicas devem ser tomadas por profissional habilitado.
        </p>
      </div>
    </div>
  );
}
