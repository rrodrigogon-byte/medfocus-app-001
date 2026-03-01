/**
 * MedFocusIA SaaS — PEP (Prontuário Eletrônico do Paciente)
 * Sprint 4: SOAP Notes, CID-10, Prescrição Digital, Exames, Assinatura Digital
 * Conformidade: CFM, FHIR R4, LGPD
 */
import React, { useState } from 'react';

// ============================================================
// CID-10 Database (subset for demo)
// ============================================================
const CID10_DATABASE = [
  { code: 'I10', desc: 'Hipertensão essencial (primária)' },
  { code: 'E11', desc: 'Diabetes mellitus tipo 2' },
  { code: 'J06.9', desc: 'Infecção aguda das vias aéreas superiores' },
  { code: 'M54.5', desc: 'Dor lombar baixa' },
  { code: 'J11', desc: 'Influenza (gripe)' },
  { code: 'K21.0', desc: 'Doença do refluxo gastroesofágico com esofagite' },
  { code: 'F32.0', desc: 'Episódio depressivo leve' },
  { code: 'F41.1', desc: 'Ansiedade generalizada' },
  { code: 'N39.0', desc: 'Infecção do trato urinário' },
  { code: 'R51', desc: 'Cefaleia' },
  { code: 'J45.0', desc: 'Asma predominantemente alérgica' },
  { code: 'E78.0', desc: 'Hipercolesterolemia pura' },
  { code: 'G43.9', desc: 'Enxaqueca sem especificação' },
  { code: 'B34.9', desc: 'Infecção viral não especificada' },
  { code: 'K29.7', desc: 'Gastrite não especificada' },
  { code: 'I25.1', desc: 'Doença aterosclerótica do coração' },
  { code: 'E03.9', desc: 'Hipotireoidismo não especificado' },
  { code: 'M79.3', desc: 'Paniculite não especificada' },
  { code: 'R10.4', desc: 'Outras dores abdominais e as não especificadas' },
  { code: 'J20.9', desc: 'Bronquite aguda não especificada' },
];

// ============================================================
// TUSS Procedures
// ============================================================
const TUSS_EXAMS = [
  { code: '40301630', name: 'Hemograma completo', type: 'Laboratorial' },
  { code: '40302040', name: 'Glicemia de jejum', type: 'Laboratorial' },
  { code: '40301508', name: 'Creatinina', type: 'Laboratorial' },
  { code: '40301940', name: 'Ureia', type: 'Laboratorial' },
  { code: '40302199', name: 'Colesterol total', type: 'Laboratorial' },
  { code: '40302202', name: 'HDL colesterol', type: 'Laboratorial' },
  { code: '40302210', name: 'LDL colesterol', type: 'Laboratorial' },
  { code: '40302237', name: 'Triglicerídeos', type: 'Laboratorial' },
  { code: '40301630', name: 'TSH', type: 'Laboratorial' },
  { code: '40301648', name: 'T4 livre', type: 'Laboratorial' },
  { code: '40301150', name: 'Urina tipo I (EAS)', type: 'Laboratorial' },
  { code: '40301168', name: 'Urocultura', type: 'Laboratorial' },
  { code: '41001010', name: 'Radiografia de tórax PA', type: 'Imagem' },
  { code: '41001028', name: 'Radiografia de tórax PA+P', type: 'Imagem' },
  { code: '41001036', name: 'Eletrocardiograma', type: 'Cardiológico' },
  { code: '41001044', name: 'Ecocardiograma transtorácico', type: 'Cardiológico' },
  { code: '41001052', name: 'Ultrassonografia abdominal total', type: 'Imagem' },
  { code: '41001060', name: 'Tomografia computadorizada de crânio', type: 'Imagem' },
  { code: '41001079', name: 'Ressonância magnética de coluna lombar', type: 'Imagem' },
  { code: '41001087', name: 'Endoscopia digestiva alta', type: 'Procedimento' },
];

// ============================================================
// Medications for prescription
// ============================================================
const MEDICATIONS_DB = [
  { name: 'Losartana 50mg', class: 'Anti-hipertensivo', controlled: false, dosage: '1 comprimido 1x/dia' },
  { name: 'Metformina 850mg', class: 'Antidiabético', controlled: false, dosage: '1 comprimido 2x/dia' },
  { name: 'Amoxicilina 500mg', class: 'Antibiótico', controlled: false, dosage: '1 cápsula 8/8h por 7 dias' },
  { name: 'Omeprazol 20mg', class: 'Inibidor bomba de prótons', controlled: false, dosage: '1 cápsula em jejum' },
  { name: 'Dipirona 500mg', class: 'Analgésico/Antipirético', controlled: false, dosage: '1 comprimido 6/6h se dor' },
  { name: 'Ibuprofeno 600mg', class: 'Anti-inflamatório', controlled: false, dosage: '1 comprimido 8/8h por 5 dias' },
  { name: 'Sinvastatina 20mg', class: 'Estatina', controlled: false, dosage: '1 comprimido à noite' },
  { name: 'Levotiroxina 50mcg', class: 'Hormônio tireoidiano', controlled: false, dosage: '1 comprimido em jejum' },
  { name: 'Fluoxetina 20mg', class: 'Antidepressivo ISRS', controlled: true, dosage: '1 cápsula pela manhã' },
  { name: 'Clonazepam 2mg', class: 'Benzodiazepínico', controlled: true, dosage: '½ comprimido à noite' },
  { name: 'Prednisona 20mg', class: 'Corticosteroide', controlled: false, dosage: 'Conforme prescrição médica' },
  { name: 'Azitromicina 500mg', class: 'Antibiótico macrolídeo', controlled: false, dosage: '1 comprimido 1x/dia por 3 dias' },
];

interface MedicalRecord {
  id: string;
  patientName: string;
  patientAge: number;
  doctorName: string;
  date: string;
  time: string;
  type: string;
  status: 'draft' | 'signed' | 'locked';
  soapS: string;
  soapO: string;
  soapA: string;
  soapP: string;
  diagnoses: { code: string; desc: string; type: string }[];
  prescriptions: { medication: string; dosage: string; duration: string; controlled: boolean }[];
  exams: { code: string; name: string; priority: string }[];
}

const SAMPLE_RECORDS: MedicalRecord[] = [
  {
    id: 'PEP-2026-0001',
    patientName: 'Maria da Silva Santos',
    patientAge: 41,
    doctorName: 'Dr. Carlos Mendes',
    date: '01/03/2026',
    time: '08:00',
    type: 'Consulta',
    status: 'signed',
    soapS: 'Paciente refere cefaleia frontal há 3 dias, de moderada intensidade (EVA 6/10), pulsátil, com fotofobia associada. Nega febre, vômitos ou alterações visuais. Relata estresse no trabalho nas últimas semanas.',
    soapO: 'BEG, corada, hidratada, acianótica, anictérica. PA: 130/85 mmHg, FC: 78 bpm, FR: 16 irpm, T: 36.5°C, SpO2: 98%. Exame neurológico: pupilas isocóricas e fotorreagentes, sem sinais meníngeos, força muscular preservada nos 4 membros.',
    soapA: 'Cefaleia tensional crônica com componente migranoso. Hipertensão arterial estágio 1 (a confirmar).',
    soapP: 'Dipirona 500mg se dor (máx 4x/dia). Solicitar hemograma, glicemia, creatinina. Retorno em 15 dias com exames. Orientações sobre higiene do sono e manejo do estresse.',
    diagnoses: [
      { code: 'G43.9', desc: 'Enxaqueca sem especificação', type: 'principal' },
      { code: 'I10', desc: 'Hipertensão essencial (primária)', type: 'secundário' },
    ],
    prescriptions: [
      { medication: 'Dipirona 500mg', dosage: '1 comprimido 6/6h se dor', duration: '7 dias', controlled: false },
    ],
    exams: [
      { code: '40301630', name: 'Hemograma completo', priority: 'routine' },
      { code: '40302040', name: 'Glicemia de jejum', priority: 'routine' },
      { code: '40301508', name: 'Creatinina', priority: 'routine' },
    ],
  },
  {
    id: 'PEP-2026-0002',
    patientName: 'João Pedro Costa',
    patientAge: 36,
    doctorName: 'Dra. Ana Oliveira',
    date: '01/03/2026',
    time: '08:30',
    type: 'Retorno',
    status: 'signed',
    soapS: 'Retorno para avaliação de exames. Paciente refere melhora parcial da dor lombar com uso de ibuprofeno. Nega irradiação para membros inferiores. Conseguiu iniciar fisioterapia.',
    soapO: 'BEG, deambulando sem claudicação. Coluna lombar: dor à palpação de L4-L5, Lasègue negativo bilateral. Reflexos patelares e aquileus preservados. Força muscular 5/5 em MMII.',
    soapA: 'Lombalgia mecânica em melhora com tratamento conservador.',
    soapP: 'Manter fisioterapia 3x/semana. Paracetamol 750mg se dor. Retorno em 30 dias.',
    diagnoses: [
      { code: 'M54.5', desc: 'Dor lombar baixa', type: 'principal' },
    ],
    prescriptions: [
      { medication: 'Paracetamol 750mg', dosage: '1 comprimido 6/6h se dor', duration: '30 dias', controlled: false },
    ],
    exams: [],
  },
  {
    id: 'PEP-2026-0003',
    patientName: 'Ana Beatriz Ferreira',
    patientAge: 48,
    doctorName: 'Dr. Carlos Mendes',
    date: '01/03/2026',
    time: '09:00',
    type: 'Consulta',
    status: 'draft',
    soapS: 'Paciente com diagnóstico prévio de DM2 e HAS. Refere polidipsia e poliúria há 2 semanas. Última HbA1c: 8.2%. Em uso de metformina 850mg 2x/dia e losartana 50mg 1x/dia.',
    soapO: 'PA: 140/90 mmHg, FC: 82 bpm, Peso: 78kg, IMC: 29.4. Glicemia capilar: 210 mg/dL. Pés: pulsos pediais presentes, sensibilidade preservada com monofilamento.',
    soapA: 'DM2 descompensado. HAS não controlada. Sobrepeso.',
    soapP: 'Ajustar metformina para 1000mg 2x/dia. Adicionar gliclazida 30mg 1x/dia. Aumentar losartana para 100mg/dia. Solicitar HbA1c, perfil lipídico, função renal, urina I. Encaminhar para nutricionista. Retorno em 30 dias.',
    diagnoses: [
      { code: 'E11', desc: 'Diabetes mellitus tipo 2', type: 'principal' },
      { code: 'I10', desc: 'Hipertensão essencial (primária)', type: 'secundário' },
    ],
    prescriptions: [
      { medication: 'Metformina 1000mg', dosage: '1 comprimido 2x/dia (almoço e jantar)', duration: 'Uso contínuo', controlled: false },
      { medication: 'Gliclazida 30mg MR', dosage: '1 comprimido 1x/dia (café da manhã)', duration: 'Uso contínuo', controlled: false },
      { medication: 'Losartana 100mg', dosage: '1 comprimido 1x/dia', duration: 'Uso contínuo', controlled: false },
    ],
    exams: [
      { code: '40302040', name: 'Hemoglobina glicada (HbA1c)', priority: 'routine' },
      { code: '40302199', name: 'Colesterol total', priority: 'routine' },
      { code: '40302202', name: 'HDL colesterol', priority: 'routine' },
      { code: '40302237', name: 'Triglicerídeos', priority: 'routine' },
      { code: '40301508', name: 'Creatinina', priority: 'routine' },
      { code: '40301150', name: 'Urina tipo I (EAS)', priority: 'routine' },
    ],
  },
  {
    id: 'PEP-2026-0004',
    patientName: 'Carlos Eduardo Ribeiro',
    patientAge: 61,
    doctorName: 'Dr. Roberto Lima',
    date: '28/02/2026',
    time: '14:00',
    type: 'Consulta',
    status: 'locked',
    soapS: 'Paciente com queixa de dor torácica atípica há 1 semana, não relacionada ao esforço. Nega dispneia, palpitações ou síncope. Tabagista 20 maços-ano, parou há 5 anos. HAS em tratamento.',
    soapO: 'PA: 125/80 mmHg, FC: 72 bpm, SpO2: 97%. ACV: BRNF 2T, sem sopros. AR: MV+ bilateral, sem RA. ECG: ritmo sinusal, sem alterações de ST.',
    soapA: 'Dor torácica atípica para investigação. Risco cardiovascular moderado (Framingham).',
    soapP: 'Solicitar teste ergométrico, ecocardiograma, perfil lipídico. Manter enalapril 10mg. Retorno com exames em 15 dias.',
    diagnoses: [
      { code: 'R07.4', desc: 'Dor torácica não especificada', type: 'principal' },
      { code: 'I10', desc: 'Hipertensão essencial (primária)', type: 'secundário' },
    ],
    prescriptions: [
      { medication: 'Enalapril 10mg', dosage: '1 comprimido 1x/dia', duration: 'Uso contínuo', controlled: false },
    ],
    exams: [
      { code: '41001036', name: 'Eletrocardiograma', priority: 'urgent' },
      { code: '41001044', name: 'Ecocardiograma transtorácico', priority: 'routine' },
      { code: '40302199', name: 'Colesterol total', priority: 'routine' },
    ],
  },
];

// ============================================================
// PEP LIST VIEW
// ============================================================
export const MedFocusIAPEP: React.FC = () => {
  const [activeView, setActiveView] = useState<'list' | 'detail' | 'new'>('list');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [searchCID, setSearchCID] = useState('');
  const [searchExam, setSearchExam] = useState('');
  const [searchMed, setSearchMed] = useState('');
  const [newRecord, setNewRecord] = useState({
    soapS: '', soapO: '', soapA: '', soapP: '',
    diagnoses: [] as { code: string; desc: string; type: string }[],
    prescriptions: [] as { medication: string; dosage: string; duration: string; controlled: boolean }[],
    exams: [] as { code: string; name: string; priority: string }[],
  });

  const statusColors: Record<string, string> = {
    draft: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    signed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    locked: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  const statusLabels: Record<string, string> = {
    draft: 'Rascunho',
    signed: 'Assinado',
    locked: 'Bloqueado',
  };
  const priorityColors: Record<string, string> = {
    routine: 'bg-blue-500/20 text-blue-400',
    urgent: 'bg-amber-500/20 text-amber-400',
    emergency: 'bg-red-500/20 text-red-400',
  };

  const filteredCID = CID10_DATABASE.filter(c =>
    searchCID && (c.code.toLowerCase().includes(searchCID.toLowerCase()) || c.desc.toLowerCase().includes(searchCID.toLowerCase()))
  );
  const filteredExams = TUSS_EXAMS.filter(e =>
    searchExam && (e.code.includes(searchExam) || e.name.toLowerCase().includes(searchExam.toLowerCase()))
  );
  const filteredMeds = MEDICATIONS_DB.filter(m =>
    searchMed && m.name.toLowerCase().includes(searchMed.toLowerCase())
  );

  const addDiagnosis = (cid: typeof CID10_DATABASE[0]) => {
    if (!newRecord.diagnoses.find(d => d.code === cid.code)) {
      setNewRecord(prev => ({
        ...prev,
        diagnoses: [...prev.diagnoses, { code: cid.code, desc: cid.desc, type: prev.diagnoses.length === 0 ? 'principal' : 'secundário' }]
      }));
    }
    setSearchCID('');
  };

  const addExam = (exam: typeof TUSS_EXAMS[0]) => {
    if (!newRecord.exams.find(e => e.code === exam.code && e.name === exam.name)) {
      setNewRecord(prev => ({
        ...prev,
        exams: [...prev.exams, { code: exam.code, name: exam.name, priority: 'routine' }]
      }));
    }
    setSearchExam('');
  };

  const addPrescription = (med: typeof MEDICATIONS_DB[0]) => {
    setNewRecord(prev => ({
      ...prev,
      prescriptions: [...prev.prescriptions, { medication: med.name, dosage: med.dosage, duration: '30 dias', controlled: med.controlled }]
    }));
    setSearchMed('');
  };

  // ── LIST VIEW ──
  if (activeView === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Prontuário Eletrônico (PEP)</h1>
            <p className="text-sm text-gray-400 mt-1">SOAP Notes | CID-10 | Prescrição Digital | FHIR R4 | Assinatura CFM</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveView('new')} className="px-4 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition">
              + Novo Atendimento
            </button>
            <span className="px-3 py-2 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-500/30">
              CFM Compliant
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Prontuários Hoje', value: '12', icon: '📋', color: 'from-blue-500 to-cyan-500' },
            { label: 'Assinados', value: '8', icon: '✅', color: 'from-emerald-500 to-teal-500' },
            { label: 'Rascunhos', value: '3', icon: '📝', color: 'from-amber-500 to-orange-500' },
            { label: 'Prescrições', value: '15', icon: '💊', color: 'from-purple-500 to-pink-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl">{stat.icon}</span>
              </div>
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              <div className={`h-1 rounded-full bg-gradient-to-r ${stat.color} mt-2 opacity-60`} />
            </div>
          ))}
        </div>

        {/* Records Table */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
          <div className="p-4 border-b border-gray-700/50">
            <input type="text" placeholder="Buscar prontuário por paciente, CID-10 ou médico..."
              className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none" />
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="text-left text-xs text-gray-400 font-semibold p-4">ID</th>
                <th className="text-left text-xs text-gray-400 font-semibold p-4">Paciente</th>
                <th className="text-left text-xs text-gray-400 font-semibold p-4">Médico</th>
                <th className="text-left text-xs text-gray-400 font-semibold p-4">Data</th>
                <th className="text-left text-xs text-gray-400 font-semibold p-4">Tipo</th>
                <th className="text-left text-xs text-gray-400 font-semibold p-4">Diagnóstico</th>
                <th className="text-left text-xs text-gray-400 font-semibold p-4">Status</th>
                <th className="text-left text-xs text-gray-400 font-semibold p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {SAMPLE_RECORDS.map(rec => (
                <tr key={rec.id} className="border-b border-gray-700/20 hover:bg-gray-700/20 transition cursor-pointer"
                    onClick={() => { setSelectedRecord(rec); setActiveView('detail'); }}>
                  <td className="p-4 text-xs text-cyan-400 font-mono">{rec.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs">
                        {rec.patientName.split(' ').slice(0, 2).map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="text-sm text-white font-medium">{rec.patientName}</div>
                        <div className="text-xs text-gray-500">{rec.patientAge} anos</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{rec.doctorName}</td>
                  <td className="p-4 text-sm text-gray-400 font-mono">{rec.date} {rec.time}</td>
                  <td className="p-4"><span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">{rec.type}</span></td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {rec.diagnoses.map((d, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-[10px] font-mono rounded">{d.code}</span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[rec.status]}`}>
                      {statusLabels[rec.status]}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1">
                      <button className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded hover:bg-cyan-500/30 transition"
                              onClick={(e) => { e.stopPropagation(); setSelectedRecord(rec); setActiveView('detail'); }}>
                        Ver
                      </button>
                      {rec.status === 'draft' && (
                        <button className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded hover:bg-emerald-500/30 transition"
                                onClick={(e) => e.stopPropagation()}>
                          Assinar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FHIR R4 Export Info */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Exportação FHIR R4</h3>
              <p className="text-xs text-gray-400 mt-1">Prontuários podem ser exportados no padrão FHIR R4 Bundle para interoperabilidade</p>
            </div>
            <div className="flex gap-2">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded border border-blue-500/30">FHIR R4</span>
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded border border-purple-500/30">HL7</span>
              <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded border border-emerald-500/30">JSON/XML</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DETAIL VIEW ──
  if (activeView === 'detail' && selectedRecord) {
    const rec = selectedRecord;
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveView('list')} className="px-3 py-1.5 bg-gray-700/50 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition">
              ← Voltar
            </button>
            <div>
              <h1 className="text-xl font-bold text-white">Prontuário {rec.id}</h1>
              <p className="text-sm text-gray-400">{rec.patientName} — {rec.patientAge} anos — {rec.date} {rec.time}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[rec.status]}`}>
              {statusLabels[rec.status]}
            </span>
            {rec.status === 'signed' && (
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                Assinado Digitalmente ✓
              </span>
            )}
          </div>
        </div>

        {/* SOAP Notes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'S — Subjetivo', content: rec.soapS, color: 'border-blue-500/50', icon: '🗣️' },
            { label: 'O — Objetivo', content: rec.soapO, color: 'border-emerald-500/50', icon: '🔬' },
            { label: 'A — Avaliação', content: rec.soapA, color: 'border-purple-500/50', icon: '🧠' },
            { label: 'P — Plano', content: rec.soapP, color: 'border-amber-500/50', icon: '📋' },
          ].map((section, i) => (
            <div key={i} className={`bg-gray-800/50 rounded-xl border-l-4 ${section.color} border border-gray-700/50 p-5`}>
              <div className="flex items-center gap-2 mb-3">
                <span>{section.icon}</span>
                <h3 className="text-sm font-bold text-white">{section.label}</h3>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Diagnoses */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
          <h3 className="text-sm font-bold text-white mb-3">Diagnósticos (CID-10)</h3>
          <div className="space-y-2">
            {rec.diagnoses.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-mono font-bold rounded">{d.code}</span>
                  <span className="text-sm text-white">{d.desc}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.type === 'principal' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-600/30 text-gray-400'}`}>
                  {d.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Prescriptions */}
        {rec.prescriptions.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Prescrição Digital</h3>
            <div className="space-y-2">
              {rec.prescriptions.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💊</span>
                    <div>
                      <div className="text-sm text-white font-medium">{p.medication}</div>
                      <div className="text-xs text-gray-400">{p.dosage} — {p.duration}</div>
                    </div>
                  </div>
                  {p.controlled && (
                    <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded border border-red-500/30">
                      Controlado
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exams */}
        {rec.exams.length > 0 && (
          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
            <h3 className="text-sm font-bold text-white mb-3">Solicitação de Exames (TUSS/CBHPM)</h3>
            <div className="space-y-2">
              {rec.exams.map((e, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">{e.code}</span>
                    <span className="text-sm text-white">{e.name}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${priorityColors[e.priority]}`}>
                    {e.priority === 'routine' ? 'Rotina' : e.priority === 'urgent' ? 'Urgente' : 'Emergência'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Digital Signature Info */}
        {rec.status !== 'draft' && (
          <div className="bg-gray-800/50 rounded-xl border border-emerald-500/30 p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔐</span>
              <div>
                <div className="text-sm font-bold text-emerald-400">Assinatura Digital CFM</div>
                <div className="text-xs text-gray-400 mt-1">
                  Assinado por {rec.doctorName} em {rec.date} às {rec.time} | Hash SHA-256: a7f3...e2b1 | Certificado ICP-Brasil válido
                </div>
                {rec.status === 'locked' && (
                  <div className="text-xs text-red-400 mt-1">
                    Prontuário bloqueado — Não pode ser alterado após assinatura (CFM Resolução 1.821/2007)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-500/20 text-blue-400 text-sm font-bold rounded-lg hover:bg-blue-500/30 transition border border-blue-500/30">
            Exportar FHIR R4
          </button>
          <button className="px-4 py-2 bg-purple-500/20 text-purple-400 text-sm font-bold rounded-lg hover:bg-purple-500/30 transition border border-purple-500/30">
            Imprimir PDF
          </button>
          <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 text-sm font-bold rounded-lg hover:bg-emerald-500/30 transition border border-emerald-500/30">
            Enviar ao Paciente
          </button>
        </div>
      </div>
    );
  }

  // ── NEW RECORD VIEW ──
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveView('list')} className="px-3 py-1.5 bg-gray-700/50 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition">
            ← Voltar
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">Novo Atendimento</h1>
            <p className="text-sm text-gray-400">Prontuário SOAP com CID-10, prescrição e exames</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-700/50 text-gray-300 text-sm rounded-lg hover:bg-gray-700 transition">
            Salvar Rascunho
          </button>
          <button className="px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-lg hover:bg-emerald-600 transition">
            Assinar Digitalmente
          </button>
        </div>
      </div>

      {/* Patient Selection */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
        <h3 className="text-sm font-bold text-white mb-3">Paciente</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Paciente</label>
            <select className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none">
              <option>Maria da Silva Santos</option>
              <option>João Pedro Costa</option>
              <option>Ana Beatriz Ferreira</option>
              <option>Carlos Eduardo Ribeiro</option>
              <option>Lucia Helena Souza</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Tipo de Atendimento</label>
            <select className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none">
              <option>Consulta</option>
              <option>Retorno</option>
              <option>Primeira vez</option>
              <option>Exame</option>
              <option>Telemedicina</option>
              <option>Procedimento</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Convênio</label>
            <select className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none">
              <option>Particular</option>
              <option>SUS</option>
              <option>Unimed</option>
              <option>Bradesco Saúde</option>
              <option>Amil</option>
              <option>SulAmérica</option>
            </select>
          </div>
        </div>
      </div>

      {/* SOAP Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'soapS', label: 'S — Subjetivo (Anamnese)', placeholder: 'Queixa principal, HDA, antecedentes...', color: 'border-blue-500/50', icon: '🗣️' },
          { key: 'soapO', label: 'O — Objetivo (Exame Físico)', placeholder: 'Sinais vitais, exame físico segmentar...', color: 'border-emerald-500/50', icon: '🔬' },
          { key: 'soapA', label: 'A — Avaliação (Hipótese Diagnóstica)', placeholder: 'Hipóteses diagnósticas, diagnóstico diferencial...', color: 'border-purple-500/50', icon: '🧠' },
          { key: 'soapP', label: 'P — Plano (Conduta)', placeholder: 'Medicações, exames, encaminhamentos, retorno...', color: 'border-amber-500/50', icon: '📋' },
        ].map((section) => (
          <div key={section.key} className={`bg-gray-800/50 rounded-xl border-l-4 ${section.color} border border-gray-700/50 p-5`}>
            <div className="flex items-center gap-2 mb-3">
              <span>{section.icon}</span>
              <h3 className="text-sm font-bold text-white">{section.label}</h3>
            </div>
            <textarea
              rows={5}
              placeholder={section.placeholder}
              value={(newRecord as any)[section.key]}
              onChange={e => setNewRecord(prev => ({ ...prev, [section.key]: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none resize-none"
            />
          </div>
        ))}
      </div>

      {/* CID-10 Diagnosis */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
        <h3 className="text-sm font-bold text-white mb-3">Diagnósticos CID-10</h3>
        <div className="relative mb-3">
          <input type="text" placeholder="Buscar CID-10 por código ou descrição..." value={searchCID} onChange={e => setSearchCID(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none" />
          {filteredCID.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg max-h-48 overflow-y-auto">
              {filteredCID.map((cid, i) => (
                <button key={i} onClick={() => addDiagnosis(cid)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-800 transition flex items-center gap-3">
                  <span className="text-xs text-purple-400 font-mono font-bold">{cid.code}</span>
                  <span className="text-sm text-gray-300">{cid.desc}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {newRecord.diagnoses.length > 0 && (
          <div className="space-y-2">
            {newRecord.diagnoses.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-mono font-bold rounded">{d.code}</span>
                  <span className="text-sm text-white">{d.desc}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${d.type === 'principal' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-600/30 text-gray-400'}`}>
                    {d.type}
                  </span>
                </div>
                <button onClick={() => setNewRecord(prev => ({ ...prev, diagnoses: prev.diagnoses.filter((_, idx) => idx !== i) }))}
                  className="text-red-400 hover:text-red-300 text-xs">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prescription */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
        <h3 className="text-sm font-bold text-white mb-3">Prescrição Digital</h3>
        <div className="relative mb-3">
          <input type="text" placeholder="Buscar medicamento..." value={searchMed} onChange={e => setSearchMed(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none" />
          {filteredMeds.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg max-h-48 overflow-y-auto">
              {filteredMeds.map((med, i) => (
                <button key={i} onClick={() => addPrescription(med)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-800 transition flex items-center justify-between">
                  <div>
                    <span className="text-sm text-white">{med.name}</span>
                    <span className="text-xs text-gray-400 ml-2">— {med.class}</span>
                  </div>
                  {med.controlled && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] rounded">Controlado</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        {newRecord.prescriptions.length > 0 && (
          <div className="space-y-2">
            {newRecord.prescriptions.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                <div className="flex items-center gap-3">
                  <span>💊</span>
                  <div>
                    <div className="text-sm text-white font-medium">{p.medication}</div>
                    <div className="text-xs text-gray-400">{p.dosage} — {p.duration}</div>
                  </div>
                  {p.controlled && <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] font-bold rounded border border-red-500/30">Controlado</span>}
                </div>
                <button onClick={() => setNewRecord(prev => ({ ...prev, prescriptions: prev.prescriptions.filter((_, idx) => idx !== i) }))}
                  className="text-red-400 hover:text-red-300 text-xs">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Exam Requests */}
      <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-5">
        <h3 className="text-sm font-bold text-white mb-3">Solicitação de Exames (TUSS/CBHPM)</h3>
        <div className="relative mb-3">
          <input type="text" placeholder="Buscar exame por código TUSS ou nome..." value={searchExam} onChange={e => setSearchExam(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900/50 border border-gray-700/30 rounded-lg text-white text-sm placeholder-gray-500 focus:border-cyan-500/50 focus:outline-none" />
          {filteredExams.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-gray-900 border border-gray-700 rounded-lg max-h-48 overflow-y-auto">
              {filteredExams.map((exam, i) => (
                <button key={i} onClick={() => addExam(exam)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-800 transition flex items-center gap-3">
                  <span className="text-xs text-blue-400 font-mono">{exam.code}</span>
                  <span className="text-sm text-gray-300">{exam.name}</span>
                  <span className="text-xs text-gray-500 ml-auto">{exam.type}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {newRecord.exams.length > 0 && (
          <div className="space-y-2">
            {newRecord.exams.map((e, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg border border-gray-700/30">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs font-mono rounded">{e.code}</span>
                  <span className="text-sm text-white">{e.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select className="px-2 py-1 bg-gray-800 border border-gray-700 rounded text-xs text-gray-300 focus:outline-none"
                    value={e.priority}
                    onChange={ev => {
                      const updated = [...newRecord.exams];
                      updated[i] = { ...updated[i], priority: ev.target.value };
                      setNewRecord(prev => ({ ...prev, exams: updated }));
                    }}>
                    <option value="routine">Rotina</option>
                    <option value="urgent">Urgente</option>
                    <option value="emergency">Emergência</option>
                  </select>
                  <button onClick={() => setNewRecord(prev => ({ ...prev, exams: prev.exams.filter((_, idx) => idx !== i) }))}
                    className="text-red-400 hover:text-red-300 text-xs">✕</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* IA Suggestion */}
      <div className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl border border-purple-500/20 p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <div className="text-sm font-bold text-purple-400">Sugestão IA (MedFocusIA)</div>
            <div className="text-xs text-gray-400 mt-1">
              Com base nos sintomas descritos, a IA sugere considerar os diagnósticos diferenciais e exames complementares.
              A sugestão é apenas auxiliar — a decisão clínica é sempre do médico responsável.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
