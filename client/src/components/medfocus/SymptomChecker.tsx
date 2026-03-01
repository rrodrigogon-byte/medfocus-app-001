/**
 * Verificador de Sintomas com IA
 * Triagem inteligente baseada em protocolos Manchester e Adams
 * Orienta o paciente sobre nível de atendimento necessário
 */
import React, { useState } from 'react';

interface Symptom {
  id: string;
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  relatedConditions: string[];
}

interface TriageResult {
  level: 'green' | 'yellow' | 'orange' | 'red' | 'blue';
  title: string;
  description: string;
  timeframe: string;
  where: string;
  icon: string;
  actions: string[];
}

interface PossibleCondition {
  name: string;
  probability: 'alta' | 'média' | 'baixa';
  specialty: string;
  description: string;
  urgency: 'green' | 'yellow' | 'orange' | 'red';
}

const SYMPTOM_DATABASE: Symptom[] = [
  // Sintomas Gerais
  { id: 'febre', name: 'Febre', category: 'Geral', severity: 'medium', relatedConditions: ['Infecção viral', 'Infecção bacteriana', 'COVID-19', 'Dengue', 'Pneumonia'] },
  { id: 'febre-alta', name: 'Febre alta (>39°C)', category: 'Geral', severity: 'high', relatedConditions: ['Infecção grave', 'Meningite', 'Sepse', 'Dengue hemorrágica'] },
  { id: 'fadiga', name: 'Cansaço/Fadiga', category: 'Geral', severity: 'low', relatedConditions: ['Anemia', 'Hipotireoidismo', 'Depressão', 'Síndrome da fadiga crônica'] },
  { id: 'perda-peso', name: 'Perda de peso inexplicada', category: 'Geral', severity: 'high', relatedConditions: ['Diabetes', 'Hipertireoidismo', 'Câncer', 'HIV/AIDS', 'Tuberculose'] },
  { id: 'sudorese', name: 'Sudorese noturna', category: 'Geral', severity: 'medium', relatedConditions: ['Tuberculose', 'Linfoma', 'Infecção', 'Menopausa'] },
  // Cabeça e Pescoço
  { id: 'cefaleia', name: 'Dor de cabeça', category: 'Cabeça', severity: 'low', relatedConditions: ['Cefaleia tensional', 'Enxaqueca', 'Sinusite', 'Hipertensão'] },
  { id: 'cefaleia-subita', name: 'Dor de cabeça súbita e intensa', category: 'Cabeça', severity: 'critical', relatedConditions: ['AVC hemorrágico', 'Aneurisma cerebral', 'Meningite'] },
  { id: 'tontura', name: 'Tontura/Vertigem', category: 'Cabeça', severity: 'medium', relatedConditions: ['VPPB', 'Labirintite', 'Hipotensão', 'Anemia'] },
  { id: 'visao-turva', name: 'Visão turva', category: 'Cabeça', severity: 'medium', relatedConditions: ['Diabetes', 'Glaucoma', 'Catarata', 'AVC'] },
  { id: 'rigidez-nuca', name: 'Rigidez na nuca', category: 'Cabeça', severity: 'critical', relatedConditions: ['Meningite', 'Hemorragia subaracnóidea'] },
  // Tórax
  { id: 'dor-peito', name: 'Dor no peito', category: 'Tórax', severity: 'high', relatedConditions: ['Infarto', 'Angina', 'Embolia pulmonar', 'Pneumotórax', 'DRGE'] },
  { id: 'dor-peito-esforco', name: 'Dor no peito ao esforço', category: 'Tórax', severity: 'critical', relatedConditions: ['Angina instável', 'Infarto agudo do miocárdio', 'Estenose aórtica'] },
  { id: 'falta-ar', name: 'Falta de ar/Dispneia', category: 'Tórax', severity: 'high', relatedConditions: ['Asma', 'DPOC', 'Insuficiência cardíaca', 'Embolia pulmonar', 'Pneumonia'] },
  { id: 'tosse', name: 'Tosse persistente', category: 'Tórax', severity: 'medium', relatedConditions: ['Bronquite', 'Asma', 'Tuberculose', 'DRGE', 'Câncer de pulmão'] },
  { id: 'palpitacao', name: 'Palpitações', category: 'Tórax', severity: 'medium', relatedConditions: ['Arritmia', 'Ansiedade', 'Hipertireoidismo', 'Anemia'] },
  // Abdômen
  { id: 'dor-abdominal', name: 'Dor abdominal', category: 'Abdômen', severity: 'medium', relatedConditions: ['Gastrite', 'Apendicite', 'Cálculo renal', 'Pancreatite'] },
  { id: 'dor-abd-intensa', name: 'Dor abdominal intensa e súbita', category: 'Abdômen', severity: 'critical', relatedConditions: ['Apendicite aguda', 'Perfuração de úlcera', 'Pancreatite aguda', 'Obstrução intestinal'] },
  { id: 'nausea', name: 'Náusea/Vômito', category: 'Abdômen', severity: 'low', relatedConditions: ['Gastroenterite', 'Gravidez', 'Enxaqueca', 'Intoxicação alimentar'] },
  { id: 'diarreia', name: 'Diarreia', category: 'Abdômen', severity: 'low', relatedConditions: ['Gastroenterite', 'Intolerância alimentar', 'Doença inflamatória intestinal'] },
  { id: 'sangue-fezes', name: 'Sangue nas fezes', category: 'Abdômen', severity: 'high', relatedConditions: ['Hemorroidas', 'Fissura anal', 'Câncer colorretal', 'Doença inflamatória intestinal'] },
  // Musculoesquelético
  { id: 'dor-costas', name: 'Dor nas costas', category: 'Musculoesquelético', severity: 'low', relatedConditions: ['Lombalgia', 'Hérnia de disco', 'Espondiloartrose', 'Cálculo renal'] },
  { id: 'dor-articular', name: 'Dor nas articulações', category: 'Musculoesquelético', severity: 'low', relatedConditions: ['Artrite', 'Artrose', 'Gota', 'Lúpus', 'Dengue'] },
  { id: 'edema-membros', name: 'Inchaço nas pernas', category: 'Musculoesquelético', severity: 'medium', relatedConditions: ['Insuficiência cardíaca', 'Trombose venosa profunda', 'Insuficiência renal', 'Varizes'] },
  // Neurológico
  { id: 'dormencia', name: 'Dormência/Formigamento', category: 'Neurológico', severity: 'medium', relatedConditions: ['Neuropatia diabética', 'Síndrome do túnel do carpo', 'AVC', 'Hérnia de disco'] },
  { id: 'fraqueza-subita', name: 'Fraqueza súbita em um lado do corpo', category: 'Neurológico', severity: 'critical', relatedConditions: ['AVC isquêmico', 'AIT'] },
  { id: 'confusao', name: 'Confusão mental', category: 'Neurológico', severity: 'critical', relatedConditions: ['AVC', 'Hipoglicemia', 'Meningite', 'Intoxicação', 'Sepse'] },
  { id: 'convulsao', name: 'Convulsão', category: 'Neurológico', severity: 'critical', relatedConditions: ['Epilepsia', 'Febre alta', 'AVC', 'Tumor cerebral'] },
  // Pele
  { id: 'manchas-pele', name: 'Manchas na pele', category: 'Pele', severity: 'low', relatedConditions: ['Alergia', 'Dermatite', 'Micose', 'Psoríase'] },
  { id: 'petequias', name: 'Manchas vermelhas que não somem ao pressionar', category: 'Pele', severity: 'critical', relatedConditions: ['Dengue hemorrágica', 'Meningococcemia', 'Púrpura trombocitopênica'] },
  { id: 'urticaria', name: 'Urticária/Coceira intensa', category: 'Pele', severity: 'medium', relatedConditions: ['Alergia', 'Reação medicamentosa', 'Urticária crônica'] },
  // Urinário
  { id: 'dor-urinar', name: 'Dor ao urinar', category: 'Urinário', severity: 'medium', relatedConditions: ['Infecção urinária', 'Cálculo renal', 'DST', 'Prostatite'] },
  { id: 'sangue-urina', name: 'Sangue na urina', category: 'Urinário', severity: 'high', relatedConditions: ['Cálculo renal', 'Infecção urinária', 'Câncer de bexiga', 'Glomerulonefrite'] },
  // Respiratório
  { id: 'coriza', name: 'Coriza/Congestão nasal', category: 'Respiratório', severity: 'low', relatedConditions: ['Resfriado', 'Gripe', 'Rinite alérgica', 'Sinusite'] },
  { id: 'dor-garganta', name: 'Dor de garganta', category: 'Respiratório', severity: 'low', relatedConditions: ['Faringite viral', 'Amigdalite', 'Mononucleose'] },
  { id: 'chiado-peito', name: 'Chiado no peito', category: 'Respiratório', severity: 'high', relatedConditions: ['Asma', 'Bronquite', 'DPOC', 'Reação alérgica grave'] },
  // Psicológico
  { id: 'ansiedade', name: 'Ansiedade intensa', category: 'Psicológico', severity: 'medium', relatedConditions: ['Transtorno de ansiedade', 'Síndrome do pânico', 'Hipertireoidismo'] },
  { id: 'tristeza', name: 'Tristeza persistente', category: 'Psicológico', severity: 'medium', relatedConditions: ['Depressão', 'Luto', 'Transtorno bipolar', 'Hipotireoidismo'] },
  { id: 'pensamentos-suicidas', name: 'Pensamentos suicidas', category: 'Psicológico', severity: 'critical', relatedConditions: ['Depressão grave', 'Transtorno bipolar', 'Crise suicida'] },
];

const TRIAGE_LEVELS: Record<string, TriageResult> = {
  red: {
    level: 'red',
    title: 'EMERGÊNCIA — Procure atendimento IMEDIATO',
    description: 'Seus sintomas indicam uma possível emergência médica. Procure o pronto-socorro mais próximo ou ligue 192 (SAMU) imediatamente.',
    timeframe: 'Atendimento imediato (0 minutos)',
    where: 'SAMU (192) ou Pronto-Socorro',
    icon: '🚨',
    actions: ['Ligue 192 (SAMU) imediatamente', 'Vá ao pronto-socorro mais próximo', 'Não dirija — peça ajuda para ir', 'Não tome medicamentos sem orientação']
  },
  orange: {
    level: 'orange',
    title: 'URGÊNCIA — Procure atendimento em até 30 minutos',
    description: 'Seus sintomas indicam urgência. Procure uma UPA ou pronto-socorro nas próximas horas.',
    timeframe: 'Atendimento em até 30 minutos',
    where: 'UPA ou Pronto-Socorro',
    icon: '⚠️',
    actions: ['Vá à UPA ou pronto-socorro mais próximo', 'Leve documentos e cartão SUS', 'Informe todos os medicamentos em uso', 'Não se automedique']
  },
  yellow: {
    level: 'yellow',
    title: 'ATENÇÃO — Agende consulta em até 24-48h',
    description: 'Seus sintomas requerem avaliação médica, mas não são uma emergência imediata.',
    timeframe: 'Atendimento em até 24-48 horas',
    where: 'UBS ou Consulta médica',
    icon: '🟡',
    actions: ['Agende consulta na UBS ou com médico particular', 'Monitore os sintomas', 'Se piorar, procure a UPA', 'Mantenha-se hidratado e em repouso']
  },
  green: {
    level: 'green',
    title: 'BAIXA URGÊNCIA — Agende consulta de rotina',
    description: 'Seus sintomas não indicam urgência, mas é importante acompanhar com um profissional de saúde.',
    timeframe: 'Atendimento em até 7 dias',
    where: 'UBS — Unidade Básica de Saúde',
    icon: '✅',
    actions: ['Agende consulta na UBS de referência', 'Mantenha hábitos saudáveis', 'Observe se os sintomas persistem ou pioram', 'Anote os sintomas para informar ao médico']
  },
  blue: {
    level: 'blue',
    title: 'NÃO URGENTE — Autocuidado e monitoramento',
    description: 'Seus sintomas são leves e podem ser manejados com autocuidado. Procure um médico se persistirem.',
    timeframe: 'Acompanhamento em consulta de rotina',
    where: 'Autocuidado + UBS se persistir',
    icon: '💙',
    actions: ['Repouso e hidratação adequada', 'Medicamentos de venda livre se necessário', 'Monitore por 3-5 dias', 'Procure a UBS se não melhorar']
  }
};

const AGE_GROUPS = ['0-2 anos', '3-12 anos', '13-17 anos', '18-39 anos', '40-59 anos', '60+ anos'];
const GENDERS = ['Masculino', 'Feminino', 'Prefiro não informar'];

export default function SymptomChecker() {
  const [step, setStep] = useState<'profile' | 'symptoms' | 'details' | 'result'>('profile');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [conditions, setConditions] = useState<PossibleCondition[]>([]);
  const [expandedCondition, setExpandedCondition] = useState<string | null>(null);

  const categories = ['Todos', ...Array.from(new Set(SYMPTOM_DATABASE.map(s => s.category)))];

  const filteredSymptoms = SYMPTOM_DATABASE.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'Todos' || s.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  const toggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const calculateTriage = () => {
    const selected = SYMPTOM_DATABASE.filter(s => selectedSymptoms.includes(s.id));
    const hasCritical = selected.some(s => s.severity === 'critical');
    const hasHigh = selected.some(s => s.severity === 'high');
    const hasMedium = selected.some(s => s.severity === 'medium');
    const multipleHigh = selected.filter(s => s.severity === 'high').length >= 2;
    const isElderly = age === '60+ anos';
    const isChild = age === '0-2 anos' || age === '3-12 anos';

    // Pensamentos suicidas — encaminhamento especial
    if (selectedSymptoms.includes('pensamentos-suicidas')) {
      setTriageResult({
        ...TRIAGE_LEVELS.red,
        title: 'EMERGÊNCIA — Ligue agora para o CVV: 188',
        description: 'Você não está sozinho(a). O Centro de Valorização da Vida (CVV) oferece apoio emocional 24 horas, gratuito. Ligue 188 ou acesse cvv.org.br.',
        actions: ['Ligue 188 (CVV) — 24h, gratuito', 'Vá ao CAPS mais próximo', 'Converse com alguém de confiança', 'Se estiver em perigo imediato, ligue 192 (SAMU)']
      });
    } else if (hasCritical) {
      setTriageResult(TRIAGE_LEVELS.red);
    } else if (multipleHigh || (hasHigh && isElderly) || (hasHigh && isChild)) {
      setTriageResult(TRIAGE_LEVELS.orange);
    } else if (hasHigh) {
      setTriageResult(TRIAGE_LEVELS.orange);
    } else if (hasMedium && (isElderly || isChild)) {
      setTriageResult(TRIAGE_LEVELS.yellow);
    } else if (hasMedium) {
      setTriageResult(TRIAGE_LEVELS.yellow);
    } else if (selected.length >= 3) {
      setTriageResult(TRIAGE_LEVELS.yellow);
    } else {
      setTriageResult(selected.length > 0 ? TRIAGE_LEVELS.green : TRIAGE_LEVELS.blue);
    }

    // Calcular condições possíveis
    const conditionMap: Record<string, { count: number; maxSeverity: string; specialty: string }> = {};
    selected.forEach(s => {
      s.relatedConditions.forEach(c => {
        if (!conditionMap[c]) conditionMap[c] = { count: 0, maxSeverity: 'low', specialty: '' };
        conditionMap[c].count++;
        if (['critical', 'high'].includes(s.severity)) conditionMap[c].maxSeverity = s.severity;
      });
    });

    const specialtyMap: Record<string, string> = {
      'Infarto': 'Cardiologia', 'Angina': 'Cardiologia', 'Angina instável': 'Cardiologia', 'Infarto agudo do miocárdio': 'Cardiologia',
      'AVC isquêmico': 'Neurologia', 'AVC hemorrágico': 'Neurologia', 'AIT': 'Neurologia', 'Epilepsia': 'Neurologia', 'Meningite': 'Neurologia',
      'Pneumonia': 'Pneumologia', 'Asma': 'Pneumologia', 'DPOC': 'Pneumologia', 'Embolia pulmonar': 'Pneumologia',
      'Diabetes': 'Endocrinologia', 'Hipotireoidismo': 'Endocrinologia', 'Hipertireoidismo': 'Endocrinologia',
      'Dengue': 'Infectologia', 'COVID-19': 'Infectologia', 'Tuberculose': 'Infectologia', 'HIV/AIDS': 'Infectologia',
      'Depressão': 'Psiquiatria', 'Depressão grave': 'Psiquiatria', 'Transtorno de ansiedade': 'Psiquiatria', 'Síndrome do pânico': 'Psiquiatria',
      'Câncer colorretal': 'Oncologia', 'Câncer de pulmão': 'Oncologia', 'Câncer de bexiga': 'Oncologia',
      'Apendicite': 'Cirurgia Geral', 'Apendicite aguda': 'Cirurgia Geral',
      'Gastrite': 'Gastroenterologia', 'DRGE': 'Gastroenterologia', 'Pancreatite': 'Gastroenterologia',
      'Cálculo renal': 'Urologia/Nefrologia', 'Infecção urinária': 'Urologia',
      'Artrite': 'Reumatologia', 'Gota': 'Reumatologia', 'Lúpus': 'Reumatologia',
      'Anemia': 'Hematologia', 'Linfoma': 'Hematologia',
    };

    const possibleConditions: PossibleCondition[] = Object.entries(conditionMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 6)
      .map(([name, data]) => ({
        name,
        probability: data.count >= 3 ? 'alta' : data.count >= 2 ? 'média' : 'baixa',
        specialty: specialtyMap[name] || 'Clínica Geral',
        description: `Condição possivelmente associada a ${data.count} dos seus sintomas selecionados.`,
        urgency: data.maxSeverity === 'critical' ? 'red' : data.maxSeverity === 'high' ? 'orange' : 'yellow'
      }));

    setConditions(possibleConditions);
    setStep('result');
  };

  const resetAll = () => {
    setStep('profile');
    setAge('');
    setGender('');
    setSelectedSymptoms([]);
    setDuration('');
    setSearchTerm('');
    setSelectedCategory('Todos');
    setTriageResult(null);
    setConditions([]);
  };

  const severityColor = (s: string) => {
    switch (s) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-green-400 bg-green-500/20';
    }
  };

  const triageColor = (level: string) => {
    switch (level) {
      case 'red': return 'border-red-500 bg-red-500/10';
      case 'orange': return 'border-orange-500 bg-orange-500/10';
      case 'yellow': return 'border-yellow-500 bg-yellow-500/10';
      case 'green': return 'border-green-500 bg-green-500/10';
      default: return 'border-blue-500 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <span className="text-3xl">🩺</span> Verificador de Sintomas
        </h2>
        <p className="text-gray-400 mt-1">Triagem inteligente baseada em protocolos clínicos. <span className="text-yellow-400 font-semibold">Não substitui consulta médica.</span></p>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <p className="text-yellow-300 text-sm">
          <strong>⚠️ Aviso Importante:</strong> Este verificador é uma ferramenta de orientação e triagem inicial. 
          Não substitui a avaliação de um profissional de saúde. Em caso de emergência, ligue <strong>192 (SAMU)</strong> ou <strong>193 (Bombeiros)</strong>.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-2">
        {['Perfil', 'Sintomas', 'Detalhes', 'Resultado'].map((label, i) => {
          const steps = ['profile', 'symptoms', 'details', 'result'];
          const isActive = steps.indexOf(step) >= i;
          return (
            <React.Fragment key={label}>
              <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${isActive ? 'bg-teal-500/20 text-teal-400' : 'bg-gray-700/50 text-gray-500'}`}>
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${isActive ? 'bg-teal-500 text-white' : 'bg-gray-600 text-gray-400'}`}>{i + 1}</span>
                {label}
              </div>
              {i < 3 && <div className={`w-8 h-0.5 ${isActive ? 'bg-teal-500' : 'bg-gray-700'}`} />}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step 1: Profile */}
      {step === 'profile' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">Informações do Paciente</h3>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Faixa etária</label>
            <div className="grid grid-cols-3 gap-2">
              {AGE_GROUPS.map(a => (
                <button key={a} onClick={() => setAge(a)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${age === a ? 'bg-teal-500/20 border-teal-500 text-teal-400 border' : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:border-gray-500'}`}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Sexo biológico</label>
            <div className="grid grid-cols-3 gap-2">
              {GENDERS.map(g => (
                <button key={g} onClick={() => setGender(g)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${gender === g ? 'bg-teal-500/20 border-teal-500 text-teal-400 border' : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:border-gray-500'}`}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => age && gender ? setStep('symptoms') : null}
            disabled={!age || !gender}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${age && gender ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
            Continuar →
          </button>
        </div>
      )}

      {/* Step 2: Symptoms */}
      {step === 'symptoms' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-white">Selecione seus sintomas</h3>
          <p className="text-gray-400 text-sm">Selecione todos os sintomas que você está sentindo. Quanto mais preciso, melhor a orientação.</p>
          
          {/* Search */}
          <input type="text" placeholder="Buscar sintoma..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none" />
          
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${selectedCategory === c ? 'bg-teal-500/20 text-teal-400 border border-teal-500' : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:border-gray-500'}`}>
                {c}
              </button>
            ))}
          </div>

          {/* Selected count */}
          {selectedSymptoms.length > 0 && (
            <div className="bg-teal-500/10 border border-teal-500/30 rounded-lg p-3 flex items-center justify-between">
              <span className="text-teal-400 text-sm font-medium">{selectedSymptoms.length} sintoma(s) selecionado(s)</span>
              <button onClick={() => setSelectedSymptoms([])} className="text-xs text-gray-400 hover:text-white">Limpar</button>
            </div>
          )}

          {/* Symptom Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2">
            {filteredSymptoms.map(s => (
              <button key={s.id} onClick={() => toggleSymptom(s.id)}
                className={`p-3 rounded-lg text-left transition-all flex items-center gap-3 ${selectedSymptoms.includes(s.id) ? 'bg-teal-500/20 border-teal-500 border' : 'bg-gray-700/30 border border-gray-600 hover:border-gray-500'}`}>
                <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${selectedSymptoms.includes(s.id) ? 'bg-teal-500 text-white' : 'bg-gray-600'}`}>
                  {selectedSymptoms.includes(s.id) && '✓'}
                </div>
                <div className="flex-1">
                  <span className="text-sm text-white">{s.name}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-500">{s.category}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${severityColor(s.severity)}`}>
                      {s.severity === 'critical' ? 'Crítico' : s.severity === 'high' ? 'Alto' : s.severity === 'medium' ? 'Médio' : 'Baixo'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('profile')} className="px-6 py-3 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 font-medium">← Voltar</button>
            <button onClick={() => selectedSymptoms.length > 0 ? setStep('details') : null}
              disabled={selectedSymptoms.length === 0}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${selectedSymptoms.length > 0 ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
              Continuar → ({selectedSymptoms.length} selecionados)
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Details */}
      {step === 'details' && (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold text-white">Detalhes adicionais</h3>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Há quanto tempo sente esses sintomas?</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Menos de 1 hora', 'Algumas horas', '1-3 dias', '4-7 dias', '1-2 semanas', '2-4 semanas', '1-3 meses', 'Mais de 3 meses'].map(d => (
                <button key={d} onClick={() => setDuration(d)}
                  className={`p-3 rounded-lg text-xs font-medium transition-all ${duration === d ? 'bg-teal-500/20 border-teal-500 text-teal-400 border' : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:border-gray-500'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-700/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Resumo dos sintomas selecionados:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map(id => {
                const s = SYMPTOM_DATABASE.find(sym => sym.id === id);
                return s ? (
                  <span key={id} className="px-2 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs">{s.name}</span>
                ) : null;
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep('symptoms')} className="px-6 py-3 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 font-medium">← Voltar</button>
            <button onClick={calculateTriage}
              disabled={!duration}
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${duration ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
              🩺 Analisar Sintomas
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Result */}
      {step === 'result' && triageResult && (
        <div className="space-y-6">
          {/* Triage Result */}
          <div className={`border-2 rounded-xl p-6 ${triageColor(triageResult.level)}`}>
            <div className="text-center mb-4">
              <span className="text-4xl">{triageResult.icon}</span>
              <h3 className="text-xl font-bold text-white mt-2">{triageResult.title}</h3>
              <p className="text-gray-300 mt-2">{triageResult.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <span className="text-xs text-gray-500">Tempo para atendimento</span>
                <p className="text-white font-semibold mt-1">{triageResult.timeframe}</p>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4">
                <span className="text-xs text-gray-500">Onde procurar</span>
                <p className="text-white font-semibold mt-1">{triageResult.where}</p>
              </div>
            </div>
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-white mb-2">O que fazer agora:</h4>
              <div className="space-y-2">
                {triageResult.actions.map((a, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-teal-400 mt-0.5">•</span>
                    <span className="text-gray-300 text-sm">{a}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Emergency Numbers */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { number: '192', label: 'SAMU', color: 'bg-red-500/20 border-red-500/30 text-red-400' },
              { number: '193', label: 'Bombeiros', color: 'bg-orange-500/20 border-orange-500/30 text-orange-400' },
              { number: '188', label: 'CVV (Saúde Mental)', color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' },
              { number: '136', label: 'Disque Saúde', color: 'bg-green-500/20 border-green-500/30 text-green-400' },
            ].map(t => (
              <div key={t.number} className={`border rounded-lg p-3 text-center ${t.color}`}>
                <p className="text-2xl font-bold">{t.number}</p>
                <p className="text-xs mt-1">{t.label}</p>
              </div>
            ))}
          </div>

          {/* Possible Conditions */}
          {conditions.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-1">Condições possivelmente associadas</h3>
              <p className="text-xs text-gray-500 mb-4">Baseado nos sintomas informados. Apenas um médico pode confirmar o diagnóstico.</p>
              <div className="space-y-3">
                {conditions.map(c => (
                  <div key={c.name} className="bg-gray-700/30 rounded-lg overflow-hidden">
                    <button onClick={() => setExpandedCondition(expandedCondition === c.name ? null : c.name)}
                      className="w-full p-4 flex items-center justify-between text-left">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${c.urgency === 'red' ? 'bg-red-500' : c.urgency === 'orange' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                        <div>
                          <span className="text-white font-medium">{c.name}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${c.probability === 'alta' ? 'bg-red-500/20 text-red-400' : c.probability === 'média' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                              Probabilidade {c.probability}
                            </span>
                            <span className="text-[10px] text-gray-500">{c.specialty}</span>
                          </div>
                        </div>
                      </div>
                      <svg className={`w-4 h-4 text-gray-400 transition-transform ${expandedCondition === c.name ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedCondition === c.name && (
                      <div className="px-4 pb-4 border-t border-gray-600/50 pt-3">
                        <p className="text-sm text-gray-400">{c.description}</p>
                        <p className="text-sm text-gray-400 mt-2">
                          <strong className="text-teal-400">Especialidade recomendada:</strong> {c.specialty}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-300 text-sm">
              <strong>⚠️ Atenção:</strong> Esta análise é apenas uma orientação inicial baseada nos sintomas informados. 
              Não constitui diagnóstico médico. Procure sempre um profissional de saúde para avaliação adequada. 
              Referências: Protocolo de Manchester, Ministério da Saúde, OMS.
            </p>
          </div>

          <button onClick={resetAll} className="w-full py-3 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 font-semibold">
            ↻ Nova Avaliação
          </button>
        </div>
      )}
    </div>
  );
}
