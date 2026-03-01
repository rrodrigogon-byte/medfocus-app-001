import React, { useState, useMemo, useRef } from 'react';
import { EXPANDED_DRUGS, EXPANDED_PRESCRIPTION_TEMPLATES } from '../../data/expandedDrugDatabase';

// ═══════════════════════════════════════════════════════════
// PRESCRIÇÃO DIGITAL — Com doses sugeridas e modelos prontos
// ═══════════════════════════════════════════════════════════

interface DrugTemplate {
  id: string;
  name: string;
  activeIngredient: string;
  category: string;
  presentations: { form: string; concentration: string }[];
  usualDose: string;
  route: string;
  frequency: string;
  duration: string;
  adjustments: string;
  contraindications: string[];
  interactions: string[];
  renalAdjust: string;
  hepaticAdjust: string;
  pregnancyCategory: string;
  reference: string;
}

interface PrescriptionItem {
  id: string;
  drug: string;
  presentation: string;
  dose: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PatientInfo {
  name: string;
  age: string;
  weight: string;
  allergies: string;
  creatinine: string;
  diagnosis: string;
}

const DRUG_DATABASE: DrugTemplate[] = [
  // ═══ ANALGÉSICOS / ANTI-INFLAMATÓRIOS ═══
  { id: 'dipirona', name: 'Dipirona Sódica', activeIngredient: 'Metamizol sódico', category: 'Analgésico/Antitérmico',
    presentations: [{ form: 'Comprimido', concentration: '500 mg' }, { form: 'Comprimido', concentration: '1g' }, { form: 'Gotas', concentration: '500 mg/mL (20 gotas = 1mL)' }, { form: 'Injetável', concentration: '500 mg/mL (2mL)' }],
    usualDose: '500mg-1g a cada 6h', route: 'VO / IV / IM', frequency: '6/6h', duration: 'Conforme necessidade',
    adjustments: 'Reduzir dose se TFG < 30 mL/min', contraindications: ['Alergia a pirazolônicos', 'Porfiria', 'Deficiência de G6PD', 'Agranulocitose prévia'],
    interactions: ['Metotrexato (aumento de toxicidade)', 'Ciclosporina (redução de nível)'], renalAdjust: 'TFG < 30: reduzir para 500mg 8/8h', hepaticAdjust: 'Evitar em hepatopatia grave', pregnancyCategory: 'C (evitar no 3° trimestre)', reference: 'Bulário ANVISA 2024' },
  { id: 'paracetamol', name: 'Paracetamol', activeIngredient: 'Acetaminofeno', category: 'Analgésico/Antitérmico',
    presentations: [{ form: 'Comprimido', concentration: '500 mg' }, { form: 'Comprimido', concentration: '750 mg' }, { form: 'Gotas pediátrico', concentration: '200 mg/mL' }],
    usualDose: '500-750mg a cada 6h (máx 4g/dia)', route: 'VO', frequency: '6/6h', duration: 'Conforme necessidade',
    adjustments: 'Máximo 2g/dia se hepatopatia', contraindications: ['Hepatopatia grave', 'Alergia ao paracetamol'],
    interactions: ['Varfarina (aumento de INR)', 'Álcool (hepatotoxicidade)'], renalAdjust: 'TFG < 10: intervalo 8/8h', hepaticAdjust: 'Máximo 2g/dia. Evitar se Child-Pugh C', pregnancyCategory: 'B (seguro)', reference: 'FDA / ANVISA 2024' },
  { id: 'ibuprofeno', name: 'Ibuprofeno', activeIngredient: 'Ibuprofeno', category: 'AINE',
    presentations: [{ form: 'Comprimido', concentration: '400 mg' }, { form: 'Comprimido', concentration: '600 mg' }, { form: 'Gotas pediátrico', concentration: '50 mg/mL' }],
    usualDose: '400-600mg a cada 8h (máx 2400mg/dia)', route: 'VO', frequency: '8/8h', duration: '3-7 dias',
    adjustments: 'Menor dose pelo menor tempo possível', contraindications: ['Úlcera péptica ativa', 'DRC estágio 4-5', 'IC grave', 'Gestação 3° trimestre', 'Alergia a AINEs'],
    interactions: ['AAS (reduz efeito antiagregante)', 'IECA/BRA (piora função renal)', 'Anticoagulantes (risco de sangramento)'], renalAdjust: 'Evitar se TFG < 30', hepaticAdjust: 'Evitar se Child-Pugh C', pregnancyCategory: 'D (3° tri)', reference: 'ANVISA 2024' },
  // ═══ ANTIBIÓTICOS ═══
  { id: 'amoxicilina', name: 'Amoxicilina', activeIngredient: 'Amoxicilina tri-hidratada', category: 'Antibiótico — Penicilina',
    presentations: [{ form: 'Cápsula', concentration: '500 mg' }, { form: 'Suspensão', concentration: '250 mg/5mL' }, { form: 'Suspensão', concentration: '400 mg/5mL' }],
    usualDose: '500mg 8/8h ou 875mg 12/12h', route: 'VO', frequency: '8/8h', duration: '7-10 dias',
    adjustments: 'Ajustar em insuficiência renal', contraindications: ['Alergia a penicilinas', 'Mononucleose (rash)'],
    interactions: ['Metotrexato (aumento de toxicidade)', 'Alopurinol (rash)', 'Anticoagulantes orais (aumento de INR)'], renalAdjust: 'TFG 10-30: 500mg 12/12h. TFG < 10: 500mg 24/24h', hepaticAdjust: 'Sem ajuste necessário', pregnancyCategory: 'B (seguro)', reference: 'Sanford Guide 2024' },
  { id: 'azitromicina', name: 'Azitromicina', activeIngredient: 'Azitromicina di-hidratada', category: 'Antibiótico — Macrolídeo',
    presentations: [{ form: 'Comprimido', concentration: '500 mg' }, { form: 'Suspensão', concentration: '200 mg/5mL' }],
    usualDose: '500mg 1x/dia por 3-5 dias', route: 'VO', frequency: '1x/dia', duration: '3-5 dias',
    adjustments: 'Sem ajuste renal necessário', contraindications: ['Alergia a macrolídeos', 'QT longo', 'Uso concomitante de ergotamina'],
    interactions: ['Varfarina (aumento de INR)', 'Digoxina (aumento de nível)', 'Antiarrítmicos classe IA/III (QT longo)'], renalAdjust: 'Sem ajuste', hepaticAdjust: 'Evitar se Child-Pugh C', pregnancyCategory: 'B', reference: 'Sanford Guide 2024' },
  { id: 'ceftriaxona', name: 'Ceftriaxona', activeIngredient: 'Ceftriaxona dissódica', category: 'Antibiótico — Cefalosporina 3ª',
    presentations: [{ form: 'Injetável', concentration: '500 mg (frasco-ampola)' }, { form: 'Injetável', concentration: '1g (frasco-ampola)' }],
    usualDose: '1-2g IV/IM 1x/dia (até 4g/dia)', route: 'IV / IM', frequency: '1x/dia', duration: '7-14 dias',
    adjustments: 'Não diluir em soluções com cálcio', contraindications: ['Alergia a cefalosporinas (reação cruzada com penicilina ~2%)', 'Neonatos hiperbilirrubinêmicos', 'Neonatos recebendo cálcio IV'],
    interactions: ['Cálcio IV (precipitação — FATAL em neonatos)', 'Varfarina (aumento de INR)'], renalAdjust: 'Sem ajuste até TFG > 10. Hemodiálise: dose após sessão', hepaticAdjust: 'Sem ajuste se função renal normal', pregnancyCategory: 'B', reference: 'Sanford Guide 2024' },
  // ═══ CARDIOVASCULAR ═══
  { id: 'losartana', name: 'Losartana Potássica', activeIngredient: 'Losartana potássica', category: 'Anti-hipertensivo — BRA',
    presentations: [{ form: 'Comprimido', concentration: '50 mg' }, { form: 'Comprimido', concentration: '100 mg' }],
    usualDose: '50-100mg 1x/dia', route: 'VO', frequency: '1x/dia', duration: 'Contínuo',
    adjustments: 'Iniciar com 25mg se depleção volêmica', contraindications: ['Gestação', 'Hipercalemia > 5,5', 'Estenose bilateral de artéria renal'],
    interactions: ['IECA (hipercalemia — NÃO associar)', 'Espironolactona (hipercalemia)', 'AINEs (reduz efeito anti-hipertensivo)', 'Lítio (aumento de nível)'], renalAdjust: 'Sem ajuste. Monitorar K+ e creatinina', hepaticAdjust: 'Iniciar com 25mg/dia', pregnancyCategory: 'D (CONTRAINDICADO)', reference: 'SBC 2024' },
  { id: 'enalapril', name: 'Enalapril', activeIngredient: 'Maleato de enalapril', category: 'Anti-hipertensivo — IECA',
    presentations: [{ form: 'Comprimido', concentration: '5 mg' }, { form: 'Comprimido', concentration: '10 mg' }, { form: 'Comprimido', concentration: '20 mg' }],
    usualDose: '10-20mg 1-2x/dia', route: 'VO', frequency: '12/12h', duration: 'Contínuo',
    adjustments: 'Iniciar com 5mg se IC ou depleção volêmica', contraindications: ['Gestação', 'Angioedema prévio por IECA', 'Estenose bilateral de artéria renal', 'Hipercalemia'],
    interactions: ['BRA (NÃO associar)', 'Espironolactona (hipercalemia)', 'AINEs (reduz efeito)', 'Lítio (aumento de nível)'], renalAdjust: 'TFG 30-60: iniciar 5mg/dia. TFG < 30: iniciar 2,5mg/dia', hepaticAdjust: 'Sem ajuste', pregnancyCategory: 'D (CONTRAINDICADO)', reference: 'SBC 2024' },
  { id: 'anlodipino', name: 'Anlodipino', activeIngredient: 'Besilato de anlodipino', category: 'Anti-hipertensivo — BCC',
    presentations: [{ form: 'Comprimido', concentration: '5 mg' }, { form: 'Comprimido', concentration: '10 mg' }],
    usualDose: '5-10mg 1x/dia', route: 'VO', frequency: '1x/dia', duration: 'Contínuo',
    adjustments: 'Iniciar com 2,5mg em idosos', contraindications: ['Estenose aórtica grave', 'Choque cardiogênico'],
    interactions: ['Sinvastatina (limitar a 20mg/dia)', 'Ciclosporina (aumento de nível)'], renalAdjust: 'Sem ajuste', hepaticAdjust: 'Iniciar com 2,5mg/dia', pregnancyCategory: 'C', reference: 'SBC 2024' },
  { id: 'atorvastatina', name: 'Atorvastatina', activeIngredient: 'Atorvastatina cálcica', category: 'Hipolipemiante — Estatina',
    presentations: [{ form: 'Comprimido', concentration: '10 mg' }, { form: 'Comprimido', concentration: '20 mg' }, { form: 'Comprimido', concentration: '40 mg' }, { form: 'Comprimido', concentration: '80 mg' }],
    usualDose: '10-80mg 1x/dia (à noite)', route: 'VO', frequency: '1x/dia', duration: 'Contínuo',
    adjustments: 'Alta intensidade (40-80mg) em DCV estabelecida', contraindications: ['Hepatopatia ativa', 'Gestação/lactação', 'Miopatia ativa'],
    interactions: ['Fibratos (risco de rabdomiólise)', 'Ciclosporina', 'Inibidores de CYP3A4 (claritromicina, itraconazol)'], renalAdjust: 'Sem ajuste', hepaticAdjust: 'Contraindicada se TGO/TGP > 3x LSN', pregnancyCategory: 'X (CONTRAINDICADO)', reference: 'SBC 2024 / AHA 2018' },
  // ═══ ENDOCRINOLOGIA ═══
  { id: 'metformina', name: 'Metformina', activeIngredient: 'Cloridrato de metformina', category: 'Antidiabético — Biguanida',
    presentations: [{ form: 'Comprimido', concentration: '500 mg' }, { form: 'Comprimido', concentration: '850 mg' }, { form: 'Comprimido XR', concentration: '500 mg' }, { form: 'Comprimido XR', concentration: '1000 mg' }],
    usualDose: '500mg → titular até 2000mg/dia', route: 'VO (com refeições)', frequency: '12/12h ou 8/8h', duration: 'Contínuo',
    adjustments: 'Titular lentamente para minimizar efeitos GI', contraindications: ['TFG < 30 mL/min', 'Acidose metabólica', 'Insuficiência hepática grave', 'Alcoolismo', 'Uso de contraste iodado (suspender 48h antes)'],
    interactions: ['Álcool (risco de acidose lática)', 'Contraste iodado (acidose lática)', 'Cimetidina (aumento de nível)'], renalAdjust: 'TFG 30-45: máx 1000mg/dia. TFG < 30: CONTRAINDICADA', hepaticAdjust: 'Contraindicada', pregnancyCategory: 'B', reference: 'SBD 2024 / ADA 2025' },
  { id: 'insulina_nph', name: 'Insulina NPH', activeIngredient: 'Insulina humana NPH', category: 'Insulina — Ação intermediária',
    presentations: [{ form: 'Frasco 10mL', concentration: '100 UI/mL' }, { form: 'Caneta', concentration: '100 UI/mL (3mL)' }],
    usualDose: '10 UI ao deitar → titular por GJ', route: 'SC', frequency: '1-2x/dia', duration: 'Contínuo',
    adjustments: 'Titular 2 UI a cada 3 dias até GJ 80-130', contraindications: ['Hipoglicemia', 'Alergia à insulina'],
    interactions: ['Betabloqueadores (mascaram hipoglicemia)', 'Corticoides (aumentam necessidade)', 'Álcool (hipoglicemia)'], renalAdjust: 'Reduzir dose se TFG < 30 (menor clearance de insulina)', hepaticAdjust: 'Reduzir dose (menor gliconeogênese)', pregnancyCategory: 'B (seguro)', reference: 'SBD 2024' },
  // ═══ PSIQUIATRIA ═══
  { id: 'sertralina', name: 'Sertralina', activeIngredient: 'Cloridrato de sertralina', category: 'Antidepressivo — ISRS',
    presentations: [{ form: 'Comprimido', concentration: '25 mg' }, { form: 'Comprimido', concentration: '50 mg' }, { form: 'Comprimido', concentration: '100 mg' }],
    usualDose: '50mg/dia → titular até 200mg/dia', route: 'VO', frequency: '1x/dia (manhã)', duration: 'Mínimo 6-12 meses',
    adjustments: 'Iniciar com 25mg em idosos ou TAG. Efeito em 2-4 semanas', contraindications: ['Uso concomitante de IMAO (intervalo mínimo 14 dias)', 'Síndrome serotoninérgica'],
    interactions: ['IMAO (síndrome serotoninérgica — FATAL)', 'Tramadol (convulsões)', 'Varfarina (aumento de INR)', 'Triptanos (síndrome serotoninérgica)'], renalAdjust: 'Sem ajuste', hepaticAdjust: 'Reduzir dose ou aumentar intervalo', pregnancyCategory: 'C', reference: 'Stahl 6ª ed. / APA 2023' },
  // ═══ GASTROENTEROLOGIA ═══
  { id: 'omeprazol', name: 'Omeprazol', activeIngredient: 'Omeprazol', category: 'IBP — Inibidor de Bomba de Prótons',
    presentations: [{ form: 'Cápsula', concentration: '20 mg' }, { form: 'Cápsula', concentration: '40 mg' }, { form: 'Injetável', concentration: '40 mg (frasco-ampola)' }],
    usualDose: '20-40mg 1x/dia (em jejum, 30 min antes do café)', route: 'VO / IV', frequency: '1x/dia', duration: '4-8 semanas (DRGE) / 14 dias (H. pylori)',
    adjustments: 'Uso prolongado: avaliar risco de fraturas, hipomagnesemia, deficiência de B12', contraindications: ['Alergia a IBPs'],
    interactions: ['Clopidogrel (reduz ativação — preferir pantoprazol)', 'Metotrexato (aumento de nível)', 'Atazanavir (reduz absorção)'], renalAdjust: 'Sem ajuste', hepaticAdjust: 'Máximo 20mg/dia se Child-Pugh C', pregnancyCategory: 'C', reference: 'ACG Guidelines 2022' },
];

const PRESCRIPTION_TEMPLATES = [
  { name: 'Amigdalite bacteriana', items: ['amoxicilina', 'dipirona', 'ibuprofeno'] },
  { name: 'Pneumonia comunitária', items: ['amoxicilina', 'azitromicina', 'dipirona'] },
  { name: 'HAS — Início de tratamento', items: ['losartana', 'anlodipino'] },
  { name: 'DM2 — Início de tratamento', items: ['metformina'] },
  { name: 'Depressão — Início de tratamento', items: ['sertralina'] },
  { name: 'DRGE', items: ['omeprazol'] },
];

// Merge expanded drugs (adapt format)
const EXPANDED_AS_TEMPLATES: DrugTemplate[] = EXPANDED_DRUGS.filter(e => !DRUG_DATABASE.some(d => d.id === e.id)).map(e => ({
  id: e.id, name: e.name, activeIngredient: e.activeIngredient, category: e.category,
  presentations: e.presentations.map(p => ({ form: p.split(' ')[1] || 'Comprimido', concentration: p })),
  usualDose: e.defaultDose, route: e.route, frequency: e.frequency, duration: e.duration,
  adjustments: e.notes, contraindications: e.contraindications, interactions: e.interactions,
  renalAdjust: e.renalAdjust, hepaticAdjust: e.hepaticAdjust, pregnancyCategory: 'Consultar bula', reference: 'ANVISA / Diretrizes 2024',
}));
const ALL_DRUGS = [...DRUG_DATABASE, ...EXPANDED_AS_TEMPLATES];
const ALL_TEMPLATES = [...PRESCRIPTION_TEMPLATES, ...EXPANDED_PRESCRIPTION_TEMPLATES];
const CATEGORIES = ['Todos', ...new Set(ALL_DRUGS.map(d => d.category))];

export default function DigitalPrescription() {
  const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({ name: '', age: '', weight: '', allergies: '', creatinine: '', diagnosis: '' });
  const [searchDrug, setSearchDrug] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showDrugDB, setShowDrugDB] = useState(false);
  const [selectedDrugDetail, setSelectedDrugDetail] = useState<DrugTemplate | null>(null);
  const [doctorInfo, setDoctorInfo] = useState({ name: '', crm: '', specialty: '' });
  const printRef = useRef<HTMLDivElement>(null);

  const filteredDrugs = useMemo(() => {
    return ALL_DRUGS.filter(d => {
      const matchCat = selectedCategory === 'Todos' || d.category === selectedCategory;
      const matchSearch = searchDrug === '' || d.name.toLowerCase().includes(searchDrug.toLowerCase()) || d.activeIngredient.toLowerCase().includes(searchDrug.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [searchDrug, selectedCategory]);

  const addDrugToPrescription = (drug: DrugTemplate) => {
    const newItem: PrescriptionItem = {
      id: Date.now().toString(),
      drug: drug.name,
      presentation: drug.presentations[0] ? `${drug.presentations[0].form} ${drug.presentations[0].concentration}` : '',
      dose: drug.usualDose,
      route: drug.route,
      frequency: drug.frequency,
      duration: drug.duration,
      instructions: '',
    };
    setPrescriptionItems(prev => [...prev, newItem]);
    setShowDrugDB(false);
  };

  const removeItem = (id: string) => setPrescriptionItems(prev => prev.filter(i => i.id !== id));

  const updateItem = (id: string, field: keyof PrescriptionItem, value: string) => {
    setPrescriptionItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const loadTemplate = (template: typeof PRESCRIPTION_TEMPLATES[0]) => {
    const items: PrescriptionItem[] = template.items.map(drugId => {
      const drug = ALL_DRUGS.find(d => d.id === drugId);
      if (!drug) return null;
      return {
        id: Date.now().toString() + Math.random(),
        drug: drug.name,
        presentation: drug.presentations[0] ? `${drug.presentations[0].form} ${drug.presentations[0].concentration}` : '',
        dose: drug.usualDose,
        route: drug.route,
        frequency: drug.frequency,
        duration: drug.duration,
        instructions: '',
      };
    }).filter(Boolean) as PrescriptionItem[];
    setPrescriptionItems(items);
  };

  const handlePrint = () => {
    const content = printRef.current;
    if (!content) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html><head><title>Prescrição Médica</title>
      <style>
        body { font-family: 'Times New Roman', serif; padding: 40px; color: #000; }
        h1 { text-align: center; font-size: 18px; border-bottom: 2px solid #000; padding-bottom: 10px; }
        .header { text-align: center; margin-bottom: 20px; }
        .patient { border: 1px solid #ccc; padding: 10px; margin-bottom: 20px; }
        .item { margin-bottom: 15px; padding-left: 20px; }
        .item-number { font-weight: bold; }
        .drug-name { font-weight: bold; font-size: 14px; }
        .details { font-size: 12px; color: #333; }
        .footer { margin-top: 40px; text-align: center; border-top: 1px solid #000; padding-top: 20px; }
        .signature { margin-top: 60px; text-align: center; }
        .signature-line { border-top: 1px solid #000; width: 300px; margin: 0 auto; }
        @media print { body { padding: 20px; } }
      </style></head><body>
      <div class="header">
        <h1>PRESCRIÇÃO MÉDICA</h1>
        <p>${doctorInfo.name || 'Dr(a). _______________'} — CRM: ${doctorInfo.crm || '______'} — ${doctorInfo.specialty || '_______________'}</p>
      </div>
      <div class="patient">
        <p><strong>Paciente:</strong> ${patientInfo.name || '_______________'} | <strong>Idade:</strong> ${patientInfo.age || '___'} | <strong>Peso:</strong> ${patientInfo.weight || '___'} kg</p>
        <p><strong>Diagnóstico:</strong> ${patientInfo.diagnosis || '_______________'} | <strong>Alergias:</strong> ${patientInfo.allergies || 'NKDA'}</p>
      </div>
      <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
      ${prescriptionItems.map((item, i) => `
        <div class="item">
          <p class="item-number">${i + 1})</p>
          <p class="drug-name">${item.drug} — ${item.presentation}</p>
          <p class="details">Dose: ${item.dose} | Via: ${item.route} | Frequência: ${item.frequency} | Duração: ${item.duration}</p>
          ${item.instructions ? `<p class="details"><em>${item.instructions}</em></p>` : ''}
        </div>
      `).join('')}
      <div class="signature">
        <div class="signature-line"></div>
        <p>${doctorInfo.name || 'Assinatura e Carimbo'}</p>
        <p>CRM: ${doctorInfo.crm || '______'}</p>
      </div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // Drug detail modal
  if (selectedDrugDetail) {
    const d = selectedDrugDetail;
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        <button onClick={() => setSelectedDrugDetail(null)} className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </button>
        <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-6 border border-purple-700/30">
          <h2 className="text-2xl font-bold text-white">{d.name}</h2>
          <p className="text-purple-300 text-sm">{d.activeIngredient} — {d.category}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            <h3 className="text-white font-bold mb-2">Apresentações</h3>
            {d.presentations.map((p, i) => (
              <div key={i} className="text-sm text-gray-300 mb-1">• {p.form} {p.concentration}</div>
            ))}
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            <h3 className="text-white font-bold mb-2">Posologia</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <p><span className="text-gray-500">Dose usual:</span> <span className="text-emerald-400">{d.usualDose}</span></p>
              <p><span className="text-gray-500">Via:</span> {d.route}</p>
              <p><span className="text-gray-500">Frequência:</span> {d.frequency}</p>
              <p><span className="text-gray-500">Duração:</span> {d.duration}</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            <h3 className="text-white font-bold mb-2">Ajuste Renal</h3>
            <p className="text-sm text-yellow-400">{d.renalAdjust}</p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
            <h3 className="text-white font-bold mb-2">Ajuste Hepático</h3>
            <p className="text-sm text-yellow-400">{d.hepaticAdjust}</p>
          </div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-red-700/30">
          <h3 className="text-red-400 font-bold mb-2">Contraindicações</h3>
          {d.contraindications.map((c, i) => <div key={i} className="text-sm text-red-300 mb-1">• {c}</div>)}
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-orange-700/30">
          <h3 className="text-orange-400 font-bold mb-2">Interações Importantes</h3>
          {d.interactions.map((c, i) => <div key={i} className="text-sm text-orange-300 mb-1">• {c}</div>)}
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
          <p className="text-sm"><span className="text-gray-500">Gestação:</span> <span className={d.pregnancyCategory.includes('X') || d.pregnancyCategory.includes('D') ? 'text-red-400 font-bold' : 'text-green-400'}>{d.pregnancyCategory}</span></p>
          <p className="text-sm mt-1"><span className="text-gray-500">Referência:</span> <span className="text-blue-400">{d.reference}</span></p>
        </div>
        <button onClick={() => { addDrugToPrescription(d); setSelectedDrugDetail(null); }}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
          + Adicionar à Prescrição
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-6 border border-purple-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-2xl">📝</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Prescrição Digital</h2>
            <p className="text-purple-300 text-sm">{ALL_DRUGS.length} medicamentos com doses sugeridas, ajustes renais/hepáticos e interações</p>
          </div>
        </div>
      </div>

      {/* Doctor Info */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
        <h3 className="text-white font-bold mb-3">Dados do Prescritor</h3>
        <div className="grid grid-cols-3 gap-3">
          <input placeholder="Nome do médico" value={doctorInfo.name} onChange={e => setDoctorInfo(p => ({ ...p, name: e.target.value }))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" />
          <input placeholder="CRM" value={doctorInfo.crm} onChange={e => setDoctorInfo(p => ({ ...p, crm: e.target.value }))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" />
          <input placeholder="Especialidade" value={doctorInfo.specialty} onChange={e => setDoctorInfo(p => ({ ...p, specialty: e.target.value }))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" />
        </div>
      </div>

      {/* Patient Info */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
        <h3 className="text-white font-bold mb-3">Dados do Paciente</h3>
        <div className="grid grid-cols-3 gap-3">
          <input placeholder="Nome do paciente" value={patientInfo.name} onChange={e => setPatientInfo(p => ({ ...p, name: e.target.value }))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" />
          <input placeholder="Idade" value={patientInfo.age} onChange={e => setPatientInfo(p => ({ ...p, age: e.target.value }))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" />
          <input placeholder="Peso (kg)" value={patientInfo.weight} onChange={e => setPatientInfo(p => ({ ...p, weight: e.target.value }))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" />
          <input placeholder="Alergias" value={patientInfo.allergies} onChange={e => setPatientInfo(p => ({ ...p, allergies: e.target.value }))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" />
          <input placeholder="Creatinina sérica" value={patientInfo.creatinine} onChange={e => setPatientInfo(p => ({ ...p, creatinine: e.target.value }))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" />
          <input placeholder="Diagnóstico / CID-10" value={patientInfo.diagnosis} onChange={e => setPatientInfo(p => ({ ...p, diagnosis: e.target.value }))}
            className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm" />
        </div>
      </div>

      {/* Templates */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
        <h3 className="text-white font-bold mb-3">Modelos Prontos</h3>
        <div className="flex flex-wrap gap-2">
          {ALL_TEMPLATES.map((t, i) => (
            <button key={i} onClick={() => loadTemplate(t)}
              className="px-3 py-1.5 bg-gray-800 hover:bg-blue-900/50 text-gray-300 hover:text-blue-300 rounded-lg text-xs border border-gray-700 hover:border-blue-600 transition-all">
              {t.name}
            </button>
          ))}
        </div>
      </div>

      {/* Prescription Items */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-bold">Prescrição ({prescriptionItems.length} itens)</h3>
          <button onClick={() => setShowDrugDB(!showDrugDB)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">
            + Adicionar Medicamento
          </button>
        </div>

        {prescriptionItems.length === 0 && !showDrugDB && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📋</div>
            <p>Nenhum medicamento adicionado. Clique em "Adicionar Medicamento" ou use um modelo pronto.</p>
          </div>
        )}

        <div className="space-y-3">
          {prescriptionItems.map((item, index) => (
            <div key={item.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-bold text-sm">{index + 1}. {item.drug}</span>
                <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 text-xs">Remover</button>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <input value={item.presentation} onChange={e => updateItem(item.id, 'presentation', e.target.value)} placeholder="Apresentação"
                  className="px-2 py-1.5 bg-gray-900 border border-gray-600 rounded text-gray-300" />
                <input value={item.dose} onChange={e => updateItem(item.id, 'dose', e.target.value)} placeholder="Dose"
                  className="px-2 py-1.5 bg-gray-900 border border-gray-600 rounded text-emerald-400" />
                <input value={item.route} onChange={e => updateItem(item.id, 'route', e.target.value)} placeholder="Via"
                  className="px-2 py-1.5 bg-gray-900 border border-gray-600 rounded text-gray-300" />
                <input value={item.frequency} onChange={e => updateItem(item.id, 'frequency', e.target.value)} placeholder="Frequência"
                  className="px-2 py-1.5 bg-gray-900 border border-gray-600 rounded text-gray-300" />
                <input value={item.duration} onChange={e => updateItem(item.id, 'duration', e.target.value)} placeholder="Duração"
                  className="px-2 py-1.5 bg-gray-900 border border-gray-600 rounded text-gray-300" />
                <input value={item.instructions} onChange={e => updateItem(item.id, 'instructions', e.target.value)} placeholder="Observações"
                  className="px-2 py-1.5 bg-gray-900 border border-gray-600 rounded text-yellow-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Drug Database Search */}
      {showDrugDB && (
        <div className="bg-gray-900 rounded-xl p-4 border border-blue-700/30">
          <h3 className="text-white font-bold mb-3">Base de Medicamentos</h3>
          <input type="text" placeholder="Buscar medicamento..." value={searchDrug} onChange={e => setSearchDrug(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm mb-3" />
          <div className="flex flex-wrap gap-1 mb-3">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`px-2 py-1 rounded text-xs ${selectedCategory === c ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filteredDrugs.map(d => (
              <div key={d.id} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3 hover:bg-gray-700/50 transition-all">
                <div>
                  <span className="text-white font-medium text-sm">{d.name}</span>
                  <span className="text-gray-500 text-xs ml-2">{d.activeIngredient}</span>
                  <div className="text-xs text-emerald-400 mt-0.5">{d.usualDose} — {d.route}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setSelectedDrugDetail(d)} className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600">Detalhes</button>
                  <button onClick={() => addDrugToPrescription(d)} className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">+ Adicionar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {prescriptionItems.length > 0 && (
        <div className="flex gap-3">
          <button onClick={handlePrint} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm">
            🖨️ Imprimir Prescrição
          </button>
          <button onClick={() => setPrescriptionItems([])} className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-xl font-bold text-sm border border-red-700/30">
            Limpar Tudo
          </button>
        </div>
      )}

      {/* Hidden print ref */}
      <div ref={printRef} className="hidden" />

      {/* Disclaimer */}
      <div className="bg-yellow-900/20 rounded-xl p-4 border border-yellow-700/30 text-center">
        <p className="text-yellow-400 text-xs">
          As doses sugeridas são baseadas em diretrizes e bulários oficiais (ANVISA, Sanford Guide, SBC, SBD, ADA).
          Sempre verificar contraindicações, interações e ajustes individuais. A prescrição é de responsabilidade do médico prescritor.
        </p>
      </div>
    </div>
  );
}
