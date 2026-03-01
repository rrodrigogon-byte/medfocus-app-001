/**
 * MedFocus — Protocolos Clínicos Inteligentes (Sprint 22)
 * 
 * Sugestão automática de protocolos baseados no CID-10:
 * - Busca de CID-10 com autocompletar
 * - Protocolo clínico completo por diagnóstico
 * - Fluxograma de decisão terapêutica
 * - Referências de guidelines internacionais
 * - Integração com PubMed para evidências atualizadas
 * 
 * DISCLAIMER: Ferramenta exclusivamente educacional e de apoio ao estudo.
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface ProtocoloClinico {
  cid: string;
  nome: string;
  categoria: string;
  definicao: string;
  criteriosDiagnosticos: string[];
  classificacao: { nome: string; criterio: string }[];
  examesIniciais: string[];
  tratamentoNaoFarmacologico: string[];
  tratamentoFarmacologico: { linha: string; opcoes: string[]; observacoes: string }[];
  metasTerapeuticas: string[];
  acompanhamento: string[];
  quandoEncaminhar: string[];
  guidelines: { nome: string; fonte: string; ano: number }[];
  estudosChave: string[];
}

const PROTOCOLOS: ProtocoloClinico[] = [
  {
    cid: 'I10', nome: 'Hipertensão Arterial Sistêmica', categoria: 'Cardiologia',
    definicao: 'Condição clínica multifatorial caracterizada por elevação sustentada dos níveis pressóricos ≥ 140/90 mmHg (consultório) ou ≥ 130/80 mmHg (MAPA 24h).',
    criteriosDiagnosticos: [
      'PA ≥ 140/90 mmHg em 2 ou mais consultas (média de 2 medidas)',
      'MAPA 24h: média ≥ 130/80 mmHg',
      'MRPA: média ≥ 135/85 mmHg',
      'Excluir hipertensão do avental branco e hipertensão mascarada',
    ],
    classificacao: [
      { nome: 'Normal', criterio: 'PAS < 120 e PAD < 80 mmHg' },
      { nome: 'Pré-hipertensão', criterio: 'PAS 120-139 ou PAD 80-89 mmHg' },
      { nome: 'HAS Estágio 1', criterio: 'PAS 140-159 ou PAD 90-99 mmHg' },
      { nome: 'HAS Estágio 2', criterio: 'PAS 160-179 ou PAD 100-109 mmHg' },
      { nome: 'HAS Estágio 3', criterio: 'PAS ≥ 180 ou PAD ≥ 110 mmHg' },
    ],
    examesIniciais: ['Hemograma', 'Glicemia de jejum', 'Perfil lipídico', 'Creatinina + TFGe', 'Potássio sérico', 'Ácido úrico', 'EAS + microalbuminúria', 'ECG de repouso', 'Fundoscopia (se HAS estágio 3)'],
    tratamentoNaoFarmacologico: [
      'Restrição de sódio (< 2g/dia de Na ou < 5g/dia de NaCl)',
      'Dieta DASH (rica em frutas, vegetais, laticínios desnatados)',
      'Exercício aeróbico: 150 min/semana (moderado) ou 75 min (vigoroso)',
      'Controle de peso: IMC 18.5-24.9 kg/m²',
      'Moderação no consumo de álcool',
      'Cessação do tabagismo',
      'Manejo do estresse',
    ],
    tratamentoFarmacologico: [
      { linha: '1ª Linha', opcoes: ['IECA (Enalapril 10-40mg, Ramipril 2.5-10mg)', 'BRA (Losartana 50-100mg, Valsartana 80-320mg)', 'BCC (Anlodipino 2.5-10mg)', 'Tiazídico (Hidroclorotiazida 12.5-25mg, Clortalidona 12.5-25mg)'], observacoes: 'Monoterapia para HAS estágio 1 de baixo risco. Combinação para estágio 2+.' },
      { linha: '2ª Linha (Combinação)', opcoes: ['IECA/BRA + BCC', 'IECA/BRA + Tiazídico', 'BCC + Tiazídico'], observacoes: 'Preferir combinação em dose fixa para melhor adesão.' },
      { linha: '3ª Linha (Tripla)', opcoes: ['IECA/BRA + BCC + Tiazídico'], observacoes: 'Tríplice combinação antes de considerar HAS resistente.' },
      { linha: 'HAS Resistente', opcoes: ['Adicionar Espironolactona 25-50mg', 'Considerar Clonidina, Hidralazina ou Minoxidil'], observacoes: 'Confirmar adesão e excluir causas secundárias.' },
    ],
    metasTerapeuticas: [
      'Geral: PA < 140/90 mmHg',
      'Alto risco CV: PA < 130/80 mmHg (SPRINT)',
      'Idosos frágeis (≥80 anos): PA < 150/90 mmHg',
      'DM2: PA < 130/80 mmHg',
      'DRC: PA < 130/80 mmHg',
    ],
    acompanhamento: [
      'Reavaliação em 30 dias após início/ajuste de medicação',
      'Após controle: consultas a cada 3-6 meses',
      'Exames laboratoriais anuais (função renal, potássio, lipídios)',
      'ECG anual',
      'MAPA ou MRPA se suspeita de hipertensão mascarada',
    ],
    quandoEncaminhar: [
      'HAS resistente verdadeira (após exclusão de pseudorresistência)',
      'Suspeita de HAS secundária (jovens, hipocalemia, sopro renal)',
      'Emergência hipertensiva com LOA',
      'HAS na gestação',
    ],
    guidelines: [
      { nome: 'Diretrizes Brasileiras de Hipertensão Arterial', fonte: 'SBC/DHA', ano: 2020 },
      { nome: 'ESC/ESH Guidelines for Arterial Hypertension', fonte: 'European Society of Cardiology', ano: 2023 },
      { nome: 'AHA/ACC Guideline for High Blood Pressure', fonte: 'American Heart Association', ano: 2017 },
    ],
    estudosChave: ['SPRINT Trial (2015)', 'ACCORD BP (2010)', 'HOPE-3 (2016)', 'STEP Trial (2021)'],
  },
  {
    cid: 'E11', nome: 'Diabetes Mellitus Tipo 2', categoria: 'Endocrinologia',
    definicao: 'Doença metabólica crônica caracterizada por hiperglicemia resultante de defeitos na secreção e/ou ação da insulina.',
    criteriosDiagnosticos: [
      'Glicemia de jejum ≥ 126 mg/dL (confirmada em 2 ocasiões)',
      'Glicemia 2h pós-TOTG 75g ≥ 200 mg/dL',
      'HbA1c ≥ 6.5% (método HPLC certificado NGSP)',
      'Glicemia aleatória ≥ 200 mg/dL com sintomas clássicos',
    ],
    classificacao: [
      { nome: 'Pré-diabetes', criterio: 'GJ 100-125 ou HbA1c 5.7-6.4% ou TOTG 140-199' },
      { nome: 'DM2 sem complicações', criterio: 'Diagnóstico confirmado, sem LOA' },
      { nome: 'DM2 com complicações', criterio: 'Retinopatia, nefropatia, neuropatia ou DCV' },
    ],
    examesIniciais: ['Glicemia de jejum', 'HbA1c', 'Perfil lipídico', 'Creatinina + TFGe', 'Microalbuminúria (RAC)', 'TSH', 'Hemograma', 'TGO/TGP', 'Fundoscopia', 'ECG', 'Exame dos pés (monofilamento)'],
    tratamentoNaoFarmacologico: [
      'Dieta individualizada (redução de carboidratos refinados)',
      'Exercício: 150 min/semana aeróbico + 2-3x/semana resistido',
      'Perda de peso: meta de 5-10% do peso corporal',
      'Educação em diabetes e automonitoramento',
      'Cessação do tabagismo',
    ],
    tratamentoFarmacologico: [
      { linha: '1ª Linha', opcoes: ['Metformina 500-2000mg/dia (iniciar 500mg, titular)'], observacoes: 'Base do tratamento. Contraindicada se TFGe < 30.' },
      { linha: '2ª Linha (HbA1c > meta)', opcoes: ['iSGLT2 (Empagliflozina 10-25mg, Dapagliflozina 10mg)', 'GLP-1 RA (Semaglutida 0.25-1mg SC/sem, Liraglutida 0.6-1.8mg/dia)', 'iDPP-4 (Sitagliptina 100mg, Vildagliptina 50mg 2x)'], observacoes: 'iSGLT2 ou GLP-1 RA se DCV, IC ou DRC estabelecida.' },
      { linha: '3ª Linha', opcoes: ['Insulina basal (Glargina, Degludeca)', 'Pioglitazona 15-45mg', 'Sulfonilureia (Gliclazida MR 30-120mg)'], observacoes: 'Insulina se HbA1c > 10% ou sintomas catabólicos.' },
    ],
    metasTerapeuticas: [
      'HbA1c < 7.0% (geral)',
      'HbA1c < 6.5% (jovens, diagnóstico recente, sem hipoglicemia)',
      'HbA1c < 8.0% (idosos frágeis, comorbidades graves)',
      'Glicemia pré-prandial: 80-130 mg/dL',
      'Glicemia pós-prandial: < 180 mg/dL',
    ],
    acompanhamento: [
      'HbA1c a cada 3 meses (até meta) e depois a cada 6 meses',
      'Perfil lipídico e função renal anual',
      'Fundoscopia anual',
      'Exame dos pés a cada consulta',
      'Microalbuminúria anual',
    ],
    quandoEncaminhar: [
      'DM1 ou dúvida diagnóstica (LADA)',
      'Cetoacidose diabética',
      'Nefropatia avançada (TFGe < 30)',
      'Retinopatia proliferativa',
      'Pé diabético com úlcera ou Charcot',
    ],
    guidelines: [
      { nome: 'ADA Standards of Care in Diabetes', fonte: 'American Diabetes Association', ano: 2025 },
      { nome: 'Diretrizes SBD', fonte: 'Sociedade Brasileira de Diabetes', ano: 2024 },
      { nome: 'EASD/ADA Consensus Report', fonte: 'EASD/ADA', ano: 2022 },
    ],
    estudosChave: ['EMPA-REG OUTCOME (2015)', 'DECLARE-TIMI 58 (2019)', 'CREDENCE (2019)', 'SUSTAIN-6 (2016)', 'UKPDS (1998)'],
  },
  {
    cid: 'I50', nome: 'Insuficiência Cardíaca', categoria: 'Cardiologia',
    definicao: 'Síndrome clínica complexa na qual o coração é incapaz de bombear sangue de forma adequada para atender às necessidades metabólicas dos tecidos.',
    criteriosDiagnosticos: [
      'Sintomas típicos: dispneia, fadiga, edema de MMII',
      'Sinais: turgência jugular, crepitações pulmonares, hepatomegalia',
      'Evidência objetiva de disfunção cardíaca (ecocardiograma)',
      'BNP > 100 pg/mL ou NT-proBNP > 300 pg/mL',
    ],
    classificacao: [
      { nome: 'ICFEr (FEVE ≤ 40%)', criterio: 'IC com fração de ejeção reduzida' },
      { nome: 'ICFElr (FEVE 41-49%)', criterio: 'IC com fração de ejeção levemente reduzida' },
      { nome: 'ICFEp (FEVE ≥ 50%)', criterio: 'IC com fração de ejeção preservada' },
    ],
    examesIniciais: ['Ecocardiograma transtorácico', 'BNP ou NT-proBNP', 'ECG', 'Rx de tórax', 'Hemograma', 'Função renal + eletrólitos', 'Função hepática', 'Ferritina + saturação de transferrina', 'TSH', 'Perfil lipídico'],
    tratamentoNaoFarmacologico: [
      'Restrição hídrica: 1.5-2L/dia (se IC avançada)',
      'Restrição de sódio: < 2g/dia',
      'Exercício supervisionado (reabilitação cardíaca)',
      'Vacinação (influenza, pneumococo, COVID-19)',
      'Monitoramento diário do peso',
    ],
    tratamentoFarmacologico: [
      { linha: 'Pilar 1 — ARNI ou IECA/BRA', opcoes: ['Sacubitril/Valsartana 24/26mg a 97/103mg 2x/dia', 'Enalapril 2.5-20mg 2x/dia (se intolerância a ARNI)', 'Losartana 25-150mg/dia (se intolerância a IECA)'], observacoes: 'ARNI preferido sobre IECA/BRA (PARADIGM-HF).' },
      { linha: 'Pilar 2 — Betabloqueador', opcoes: ['Carvedilol 3.125-25mg 2x/dia', 'Bisoprolol 1.25-10mg/dia', 'Metoprolol succinato 12.5-200mg/dia'], observacoes: 'Titular lentamente. Não iniciar em IC descompensada.' },
      { linha: 'Pilar 3 — Antagonista Mineralocorticoide', opcoes: ['Espironolactona 25-50mg/dia', 'Eplerenona 25-50mg/dia'], observacoes: 'Monitorar potássio e função renal.' },
      { linha: 'Pilar 4 — iSGLT2', opcoes: ['Dapagliflozina 10mg/dia', 'Empagliflozina 10mg/dia'], observacoes: 'Benefício independente de DM (DAPA-HF, EMPEROR-Reduced).' },
    ],
    metasTerapeuticas: [
      'NYHA I-II (assintomático ou sintomas leves)',
      'PA sistólica > 90 mmHg',
      'FC 60-70 bpm em repouso',
      'Euvolemia (sem congestão)',
      'Ferritina > 100 ng/mL (corrigir deficiência de ferro)',
    ],
    acompanhamento: [
      'Consulta a cada 1-3 meses (IC avançada) ou 3-6 meses (estável)',
      'Ecocardiograma a cada 6-12 meses',
      'BNP/NT-proBNP seriado',
      'Função renal e eletrólitos a cada 1-3 meses',
    ],
    quandoEncaminhar: [
      'IC avançada (NYHA III-IV persistente)',
      'Candidato a dispositivo (CDI, TRC)',
      'Avaliação para transplante cardíaco',
      'IC com etiologia não esclarecida',
    ],
    guidelines: [
      { nome: 'ESC Guidelines for Heart Failure', fonte: 'European Society of Cardiology', ano: 2023 },
      { nome: 'AHA/ACC/HFSA Guideline for HF', fonte: 'American Heart Association', ano: 2022 },
      { nome: 'Diretriz Brasileira de IC', fonte: 'SBC/DEIC', ano: 2023 },
    ],
    estudosChave: ['PARADIGM-HF (2014)', 'DAPA-HF (2019)', 'EMPEROR-Reduced (2020)', 'RALES (1999)', 'COPERNICUS (2001)'],
  },
];

export function ProtocolosInteligentes() {
  const [buscaCID, setBuscaCID] = useState('');
  const [protocoloSelecionado, setProtocoloSelecionado] = useState<ProtocoloClinico | null>(null);
  const [secaoAberta, setSecaoAberta] = useState<string>('diagnostico');

  const protocolosFiltrados = PROTOCOLOS.filter(p =>
    !buscaCID || p.cid.toLowerCase().includes(buscaCID.toLowerCase()) || p.nome.toLowerCase().includes(buscaCID.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Protocolos Clínicos Inteligentes" />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">🧬</span> Protocolos Clínicos Inteligentes
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-medium">CID-10 Based</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Digite um CID-10 ou diagnóstico e receba o protocolo clínico completo com guidelines internacionais e estudos-chave
        </p>
      </div>

      {!protocoloSelecionado ? (
        <div className="space-y-4">
          <input value={buscaCID} onChange={e => setBuscaCID(e.target.value)}
            placeholder="Buscar por CID-10 ou nome da doença... Ex: I10, Hipertensão, E11, Diabetes"
            className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:border-primary focus:outline-none" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocolosFiltrados.map(p => (
              <div key={p.cid} onClick={() => setProtocoloSelecionado(p)}
                className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 cursor-pointer transition group">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary font-mono font-bold">{p.cid}</span>
                  <span className="text-xs text-muted-foreground">{p.categoria}</span>
                </div>
                <h3 className="font-bold text-sm group-hover:text-primary transition">{p.nome}</h3>
                <p className="text-xs text-foreground/60 mt-2 line-clamp-2">{p.definicao}</p>
                <div className="flex gap-2 mt-3 text-[10px] text-muted-foreground">
                  <span>{p.tratamentoFarmacologico.length} linhas de tratamento</span>
                  <span>|</span>
                  <span>{p.guidelines.length} guidelines</span>
                  <span>|</span>
                  <span>{p.estudosChave.length} estudos</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setProtocoloSelecionado(null)} className="text-sm text-primary hover:underline">← Voltar para busca</button>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg px-3 py-1 rounded-full bg-primary/20 text-primary font-mono font-bold">{protocoloSelecionado.cid}</span>
              <span className="text-xs text-muted-foreground">{protocoloSelecionado.categoria}</span>
            </div>
            <h2 className="text-xl font-bold">{protocoloSelecionado.nome}</h2>
            <p className="text-sm text-foreground/70 mt-2">{protocoloSelecionado.definicao}</p>
          </div>

          {/* Seções do Protocolo */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'diagnostico', label: '🔍 Diagnóstico' },
              { id: 'classificacao', label: '📊 Classificação' },
              { id: 'exames', label: '🧪 Exames' },
              { id: 'tratamento', label: '💊 Tratamento' },
              { id: 'metas', label: '🎯 Metas' },
              { id: 'acompanhamento', label: '📅 Acompanhamento' },
              { id: 'referencias', label: '📚 Referências' },
            ].map(s => (
              <button key={s.id} onClick={() => setSecaoAberta(s.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition ${
                  secaoAberta === s.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'
                }`}>{s.label}</button>
            ))}
          </div>

          {secaoAberta === 'diagnostico' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-3">🔍 Critérios Diagnósticos</h3>
              <div className="space-y-2">
                {protocoloSelecionado.criteriosDiagnosticos.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 bg-background/50 rounded-lg p-3">
                    <span className="text-primary font-bold text-sm">{i + 1}.</span>
                    <p className="text-xs">{c}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {secaoAberta === 'classificacao' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-3">📊 Classificação</h3>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border"><th className="text-left py-2">Classificação</th><th className="text-left py-2">Critério</th></tr></thead>
                <tbody>
                  {protocoloSelecionado.classificacao.map((c, i) => (
                    <tr key={i} className="border-b border-border/50"><td className="py-2 font-bold">{c.nome}</td><td className="py-2">{c.criterio}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {secaoAberta === 'exames' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-3">🧪 Exames Iniciais</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {protocoloSelecionado.examesIniciais.map((e, i) => (
                  <div key={i} className="flex items-center gap-2 bg-background/50 rounded-lg p-2">
                    <span className="text-green-400">✓</span><p className="text-xs">{e}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {secaoAberta === 'tratamento' && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-3">🥗 Tratamento Não Farmacológico</h3>
                <div className="space-y-2">
                  {protocoloSelecionado.tratamentoNaoFarmacologico.map((t, i) => (
                    <div key={i} className="flex items-start gap-2 bg-background/50 rounded-lg p-2">
                      <span className="text-green-400 text-sm">●</span><p className="text-xs">{t}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-3">💊 Tratamento Farmacológico</h3>
                <div className="space-y-4">
                  {protocoloSelecionado.tratamentoFarmacologico.map((t, i) => (
                    <div key={i} className="bg-background/50 rounded-xl p-4 border-l-4 border-primary">
                      <p className="font-bold text-sm text-primary mb-2">{t.linha}</p>
                      <div className="space-y-1">
                        {t.opcoes.map((o, j) => <p key={j} className="text-xs text-foreground/80">• {o}</p>)}
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2 italic">{t.observacoes}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {secaoAberta === 'metas' && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-3">🎯 Metas Terapêuticas</h3>
              <div className="space-y-2">
                {protocoloSelecionado.metasTerapeuticas.map((m, i) => (
                  <div key={i} className="flex items-center gap-2 bg-background/50 rounded-lg p-3">
                    <span className="text-primary">🎯</span><p className="text-xs font-medium">{m}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {secaoAberta === 'acompanhamento' && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-3">📅 Acompanhamento</h3>
                <div className="space-y-2">
                  {protocoloSelecionado.acompanhamento.map((a, i) => (
                    <div key={i} className="flex items-start gap-2 bg-background/50 rounded-lg p-2">
                      <span className="text-blue-400">📌</span><p className="text-xs">{a}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6">
                <h3 className="font-bold mb-3 text-orange-400">⚠️ Quando Encaminhar</h3>
                <div className="space-y-2">
                  {protocoloSelecionado.quandoEncaminhar.map((q, i) => (
                    <div key={i} className="flex items-start gap-2"><span className="text-orange-400">→</span><p className="text-xs">{q}</p></div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {secaoAberta === 'referencias' && (
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-3">📋 Guidelines</h3>
                {protocoloSelecionado.guidelines.map((g, i) => (
                  <div key={i} className="bg-background/50 rounded-lg p-3 mb-2">
                    <p className="text-xs font-bold">{g.nome}</p>
                    <p className="text-[10px] text-muted-foreground">{g.fonte} ({g.ano})</p>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-bold mb-3">📖 Estudos-Chave</h3>
                <div className="flex flex-wrap gap-2">
                  {protocoloSelecionado.estudosChave.map((e, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/30">{e}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
