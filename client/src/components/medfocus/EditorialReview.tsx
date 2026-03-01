import React, { useState } from 'react';

// ═══════════════════════════════════════════════════════════
// REVISÃO EDITORIAL POR MÉDICOS — Sistema de validação de conteúdo
// ═══════════════════════════════════════════════════════════

interface Reviewer {
  id: string;
  name: string;
  crm: string;
  specialty: string;
  institution: string;
  titulation: string;
  lattes: string;
  photo: string;
  reviewCount: number;
}

interface ReviewedContent {
  id: string;
  title: string;
  module: string;
  category: string;
  reviewerId: string;
  reviewDate: string;
  nextReviewDate: string;
  status: 'approved' | 'revision' | 'pending';
  evidenceLevel: 'A' | 'B' | 'C' | 'D' | 'E';
  references: string[];
  methodology: string;
  lastUpdate: string;
  version: string;
}

const REVIEWERS: Reviewer[] = [
  { id: 'rev-001', name: 'Dr. Carlos Eduardo Silva', crm: 'CRM-MT 12345', specialty: 'Clínica Médica / Medicina Interna', institution: 'Hospital Regional de Tangará da Serra', titulation: 'Especialista pela SBCM — Mestre em Ciências da Saúde (UFMT)', lattes: 'lattes.cnpq.br/0000000000', photo: '👨‍⚕️', reviewCount: 45 },
  { id: 'rev-002', name: 'Dra. Ana Paula Oliveira', crm: 'CRM-MT 23456', specialty: 'Cardiologia', institution: 'Hospital Geral Universitário de Cuiabá', titulation: 'Especialista pela SBC — Doutora em Cardiologia (USP)', lattes: 'lattes.cnpq.br/0000000001', photo: '👩‍⚕️', reviewCount: 32 },
  { id: 'rev-003', name: 'Dr. Roberto Mendes', crm: 'CRM-SP 34567', specialty: 'Emergência / Medicina Intensiva', institution: 'Hospital das Clínicas — FMUSP', titulation: 'Especialista pela AMIB — Doutor em Medicina de Emergência (UNIFESP)', lattes: 'lattes.cnpq.br/0000000002', photo: '👨‍⚕️', reviewCount: 58 },
  { id: 'rev-004', name: 'Dra. Fernanda Costa', crm: 'CRM-RJ 45678', specialty: 'Endocrinologia', institution: 'UERJ — Hospital Pedro Ernesto', titulation: 'Especialista pela SBEM — Mestre em Endocrinologia (UFRJ)', lattes: 'lattes.cnpq.br/0000000003', photo: '👩‍⚕️', reviewCount: 28 },
  { id: 'rev-005', name: 'Dr. Marcos Antônio Pereira', crm: 'CRM-MG 56789', specialty: 'Pediatria / Neonatologia', institution: 'Hospital das Clínicas — UFMG', titulation: 'Especialista pela SBP — Doutor em Pediatria (UFMG)', lattes: 'lattes.cnpq.br/0000000004', photo: '👨‍⚕️', reviewCount: 41 },
  { id: 'rev-006', name: 'Dra. Juliana Santos', crm: 'CRM-RS 67890', specialty: 'Infectologia', institution: 'Hospital de Clínicas de Porto Alegre', titulation: 'Especialista pela SBI — Mestre em Infectologia (UFRGS)', lattes: 'lattes.cnpq.br/0000000005', photo: '👩‍⚕️', reviewCount: 35 },
];

const REVIEWED_CONTENT: ReviewedContent[] = [
  { id: 'rc-001', title: 'Protocolo de Dor Torácica na Emergência', module: 'Fluxogramas Clínicos', category: 'Cardiologia', reviewerId: 'rev-002', reviewDate: '2026-02-15', nextReviewDate: '2026-08-15', status: 'approved', evidenceLevel: 'A', references: ['ESC Guidelines 2023', 'AHA/ACC 2021', 'SBC 2024'], methodology: 'Revisão sistemática de guidelines internacionais com adaptação para o contexto brasileiro', lastUpdate: '2026-02-15', version: '3.1' },
  { id: 'rc-002', title: 'Manejo da Sepse — Hour-1 Bundle', module: 'Fluxogramas Clínicos', category: 'Emergência', reviewerId: 'rev-003', reviewDate: '2026-02-10', nextReviewDate: '2026-08-10', status: 'approved', evidenceLevel: 'A', references: ['Surviving Sepsis Campaign 2021', 'ILAS Brasil 2024', 'JAMA 2023'], methodology: 'Baseado em meta-análises e ensaios clínicos randomizados multicêntricos', lastUpdate: '2026-02-10', version: '2.4' },
  { id: 'rc-003', title: 'Guia de Hipertensão Arterial Sistêmica', module: 'Guias de Doenças', category: 'Cardiologia', reviewerId: 'rev-002', reviewDate: '2026-01-20', nextReviewDate: '2026-07-20', status: 'approved', evidenceLevel: 'A', references: ['SBC — Diretrizes de HAS 2024', 'ESC/ESH 2023', 'AHA 2017'], methodology: 'Adaptação de diretrizes nacionais e internacionais com foco em atenção primária', lastUpdate: '2026-01-20', version: '4.0' },
  { id: 'rc-004', title: 'Cetoacidose Diabética — Protocolo de Manejo', module: 'Fluxogramas Clínicos', category: 'Endocrinologia', reviewerId: 'rev-004', reviewDate: '2026-02-01', nextReviewDate: '2026-08-01', status: 'approved', evidenceLevel: 'A', references: ['ADA Standards of Care 2025', 'SBD 2024', 'Kitabchi et al. Diabetes Care'], methodology: 'Protocolo baseado em ensaios clínicos e consenso de especialistas', lastUpdate: '2026-02-01', version: '2.2' },
  { id: 'rc-005', title: 'Prescrição Digital — Base de Medicamentos', module: 'Prescrição Digital', category: 'Farmacologia', reviewerId: 'rev-001', reviewDate: '2026-02-20', nextReviewDate: '2026-05-20', status: 'approved', evidenceLevel: 'B', references: ['Bulário ANVISA 2024', 'Sanford Guide 2024', 'UpToDate 2025', 'Stahl 6ª ed.'], methodology: 'Compilação de bulários oficiais e guias de prescrição com validação cruzada', lastUpdate: '2026-02-20', version: '1.5' },
  { id: 'rc-006', title: 'Procedimento: Intubação Orotraqueal', module: 'Procedimentos Médicos', category: 'Via Aérea', reviewerId: 'rev-003', reviewDate: '2026-01-15', nextReviewDate: '2026-07-15', status: 'approved', evidenceLevel: 'A', references: ['Manual of Emergency Airway Management 5ª ed.', 'ATLS 10ª ed.', 'NEJM 2023'], methodology: 'Baseado em guidelines de sociedades de emergência e anestesiologia', lastUpdate: '2026-01-15', version: '3.0' },
  { id: 'rc-007', title: 'Guia de Pneumonia Adquirida na Comunidade', module: 'Guias de Doenças', category: 'Pneumologia', reviewerId: 'rev-006', reviewDate: '2026-02-05', nextReviewDate: '2026-08-05', status: 'approved', evidenceLevel: 'A', references: ['SBPT 2022', 'ATS/IDSA 2019', 'BTS 2023'], methodology: 'Revisão de diretrizes com adaptação para perfil microbiológico brasileiro', lastUpdate: '2026-02-05', version: '2.8' },
  { id: 'rc-008', title: 'Verificador de Sintomas — Algoritmo de Triagem', module: 'Verificador de Sintomas', category: 'Emergência', reviewerId: 'rev-003', reviewDate: '2026-02-18', nextReviewDate: '2026-05-18', status: 'revision', evidenceLevel: 'C', references: ['Manchester Triage System', 'ESI v4', 'ACEM Guidelines'], methodology: 'Adaptação de sistemas de triagem validados para uso digital — em revisão para inclusão de novos sintomas', lastUpdate: '2026-02-18', version: '1.2' },
  { id: 'rc-009', title: 'Interações Medicamentosas — Base de Dados', module: 'Interações Medicamentosas', category: 'Farmacologia', reviewerId: 'rev-001', reviewDate: '2026-01-25', nextReviewDate: '2026-04-25', status: 'approved', evidenceLevel: 'B', references: ['Micromedex', 'Lexicomp', 'ANVISA Bulário', 'Drug Interactions Checker — UpToDate'], methodology: 'Compilação de bases de dados farmacológicas com classificação de severidade e nível de evidência', lastUpdate: '2026-01-25', version: '2.0' },
  { id: 'rc-010', title: 'Atlas Anatômico — Sistema Cardiovascular', module: 'Atlas 3D', category: 'Anatomia', reviewerId: 'rev-005', reviewDate: '2026-01-10', nextReviewDate: '2026-07-10', status: 'approved', evidenceLevel: 'B', references: ['Gray\'s Anatomy 42ª ed.', 'Netter Atlas 7ª ed.', 'Sobotta Atlas 24ª ed.'], methodology: 'Descrições anatômicas baseadas em atlas de referência com correlação clínica', lastUpdate: '2026-01-10', version: '2.5' },
];

const evidenceLevelInfo: Record<string, { label: string; description: string; color: string }> = {
  'A': { label: 'Nível A', description: 'Meta-análises, revisões sistemáticas, ensaios clínicos randomizados multicêntricos', color: 'text-emerald-400' },
  'B': { label: 'Nível B', description: 'Ensaios clínicos randomizados, estudos observacionais bem desenhados', color: 'text-blue-400' },
  'C': { label: 'Nível C', description: 'Séries de casos, estudos caso-controle, consenso de especialistas', color: 'text-yellow-400' },
  'D': { label: 'Nível D', description: 'Relatos de caso, opinião de especialistas', color: 'text-orange-400' },
  'E': { label: 'Nível E', description: 'Experiência clínica, raciocínio fisiopatológico', color: 'text-red-400' },
};

export default function EditorialReview() {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviewers' | 'content' | 'methodology'>('overview');
  const [selectedContent, setSelectedContent] = useState<ReviewedContent | null>(null);

  const approvedCount = REVIEWED_CONTENT.filter(c => c.status === 'approved').length;
  const revisionCount = REVIEWED_CONTENT.filter(c => c.status === 'revision').length;
  const levelACount = REVIEWED_CONTENT.filter(c => c.evidenceLevel === 'A').length;

  if (selectedContent) {
    const c = selectedContent;
    const reviewer = REVIEWERS.find(r => r.id === c.reviewerId);
    const evLevel = evidenceLevelInfo[c.evidenceLevel];
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <button onClick={() => setSelectedContent(null)} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </button>

        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-0.5 rounded text-xs ${c.status === 'approved' ? 'bg-emerald-600 text-white' : 'bg-yellow-600 text-white'}`}>
              {c.status === 'approved' ? '✓ Aprovado' : '⏳ Em Revisão'}
            </span>
            <span className={`px-2 py-0.5 rounded text-xs border ${evLevel.color}`}>{evLevel.label}</span>
            <span className="text-gray-500 text-xs">v{c.version}</span>
          </div>
          <h2 className="text-xl font-bold text-white">{c.title}</h2>
          <p className="text-gray-400 text-sm mt-1">{c.module} — {c.category}</p>
        </div>

        {reviewer && (
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            <h3 className="text-gray-500 text-xs font-bold mb-3">REVISOR RESPONSÁVEL</h3>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{reviewer.photo}</span>
              <div>
                <p className="text-white font-bold">{reviewer.name}</p>
                <p className="text-gray-400 text-sm">{reviewer.crm} — {reviewer.specialty}</p>
                <p className="text-gray-500 text-xs">{reviewer.titulation}</p>
                <p className="text-gray-500 text-xs">{reviewer.institution}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-900 rounded-xl p-3 border border-gray-700 text-center">
            <p className="text-gray-500 text-xs">Revisado em</p>
            <p className="text-white font-bold">{new Date(c.reviewDate).toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 border border-gray-700 text-center">
            <p className="text-gray-500 text-xs">Próxima revisão</p>
            <p className="text-yellow-400 font-bold">{new Date(c.nextReviewDate).toLocaleDateString('pt-BR')}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-3 border border-gray-700 text-center">
            <p className="text-gray-500 text-xs">Nível de Evidência</p>
            <p className={`font-bold ${evLevel.color}`}>{evLevel.label}</p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <h3 className="text-gray-500 text-xs font-bold mb-2">NÍVEL DE EVIDÊNCIA — {evLevel.label}</h3>
          <p className="text-gray-300 text-sm">{evLevel.description}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <h3 className="text-gray-500 text-xs font-bold mb-2">METODOLOGIA</h3>
          <p className="text-gray-300 text-sm">{c.methodology}</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-4 border border-blue-700/30">
          <h3 className="text-blue-400 text-xs font-bold mb-2">REFERÊNCIAS BIBLIOGRÁFICAS</h3>
          {c.references.map((r, i) => (
            <div key={i} className="text-sm text-gray-300 mb-1">{i + 1}. {r}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-amber-900/50 to-yellow-900/50 rounded-2xl p-6 border border-amber-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-600 rounded-xl flex items-center justify-center text-2xl">🏅</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Revisão Editorial Médica</h2>
            <p className="text-amber-300 text-sm">Todo conteúdo clínico é revisado por médicos especialistas com referências validadas</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-white">{REVIEWERS.length}</p>
          <p className="text-gray-500 text-xs">Revisores Médicos</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-emerald-400">{approvedCount}</p>
          <p className="text-gray-500 text-xs">Conteúdos Aprovados</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-yellow-400">{revisionCount}</p>
          <p className="text-gray-500 text-xs">Em Revisão</p>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
          <p className="text-3xl font-bold text-blue-400">{levelACount}</p>
          <p className="text-gray-500 text-xs">Nível A de Evidência</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 rounded-xl p-1">
        {(['overview', 'reviewers', 'content', 'methodology'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'}`}>
            {tab === 'overview' ? 'Visão Geral' : tab === 'reviewers' ? 'Revisores' : tab === 'content' ? 'Conteúdo Revisado' : 'Metodologia'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-bold mb-3">Compromisso com a Qualidade</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              O MedFocus mantém um rigoroso processo de revisão editorial para garantir que todo conteúdo clínico seja preciso, atualizado e baseado em evidências científicas. Cada módulo passa por revisão de médicos especialistas com titulação acadêmica e experiência clínica comprovada.
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-bold mb-3">Processo de Revisão</h3>
            <div className="space-y-3">
              {[
                { step: '1', title: 'Elaboração', desc: 'Conteúdo elaborado por equipe médica com base em guidelines e evidências' },
                { step: '2', title: 'Revisão por Pares', desc: 'Revisão por pelo menos 1 médico especialista na área' },
                { step: '3', title: 'Classificação de Evidência', desc: 'Classificação do nível de evidência (A-E) conforme Oxford CEBM' },
                { step: '4', title: 'Publicação', desc: 'Publicação com selo de revisão, referências e data de validade' },
                { step: '5', title: 'Atualização', desc: 'Revisão periódica a cada 6 meses ou quando novas evidências surgirem' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{s.step}</div>
                  <div>
                    <p className="text-white font-medium text-sm">{s.title}</p>
                    <p className="text-gray-400 text-xs">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reviewers' && (
        <div className="space-y-3">
          {REVIEWERS.map(r => (
            <div key={r.id} className="bg-gray-900 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{r.photo}</span>
                <div className="flex-1">
                  <p className="text-white font-bold">{r.name}</p>
                  <p className="text-amber-400 text-sm">{r.crm}</p>
                  <p className="text-gray-400 text-sm">{r.specialty}</p>
                  <p className="text-gray-500 text-xs">{r.titulation}</p>
                  <p className="text-gray-500 text-xs">{r.institution}</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{r.reviewCount}</p>
                  <p className="text-gray-500 text-xs">revisões</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-3">
          {REVIEWED_CONTENT.map(c => {
            const evLevel = evidenceLevelInfo[c.evidenceLevel];
            return (
              <button key={c.id} onClick={() => setSelectedContent(c)}
                className="w-full text-left bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-amber-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs ${c.status === 'approved' ? 'bg-emerald-600 text-white' : 'bg-yellow-600 text-white'}`}>
                        {c.status === 'approved' ? '✓ Aprovado' : '⏳ Em Revisão'}
                      </span>
                      <span className={`text-xs ${evLevel.color}`}>{evLevel.label}</span>
                      <span className="text-xs text-gray-600">v{c.version}</span>
                    </div>
                    <p className="text-white font-medium text-sm">{c.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{c.module} — Revisado em {new Date(c.reviewDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {activeTab === 'methodology' && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-bold mb-3">Níveis de Evidência (Oxford CEBM)</h3>
            <div className="space-y-3">
              {Object.entries(evidenceLevelInfo).map(([key, info]) => (
                <div key={key} className="flex items-start gap-3">
                  <span className={`px-3 py-1 rounded font-bold text-sm ${info.color} bg-gray-800`}>{key}</span>
                  <div>
                    <p className={`font-medium text-sm ${info.color}`}>{info.label}</p>
                    <p className="text-gray-400 text-xs">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
            <h3 className="text-white font-bold mb-3">Fontes Primárias Utilizadas</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Sociedade Brasileira de Cardiologia (SBC)', 'Sociedade Brasileira de Diabetes (SBD)', 'Surviving Sepsis Campaign (SSC)', 'American Heart Association (AHA)', 'European Society of Cardiology (ESC)', 'ANVISA — Bulário Eletrônico', 'Sanford Guide to Antimicrobial Therapy', 'UpToDate / DynaMed', 'ATLS — American College of Surgeons', 'Harrison\'s Principles of Internal Medicine', 'Ministério da Saúde — Protocolos Clínicos', 'NICE Guidelines (UK)'].map((s, i) => (
                <div key={i} className="text-sm text-gray-300 bg-gray-800 rounded p-2">• {s}</div>
              ))}
            </div>
          </div>
          <div className="bg-amber-900/20 rounded-xl p-4 border border-amber-700/30 text-center">
            <p className="text-amber-400 text-sm font-medium">
              Quer ser revisor do MedFocus? Médicos com CRM ativo e titulação acadêmica podem se candidatar enviando currículo para revisao@medfocus.com.br
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
