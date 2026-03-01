import { useState, useRef, useCallback, useEffect } from 'react';
import { Mic, MicOff, Brain, FileText, AlertTriangle, Search, Clock, Pill, Activity, ChevronDown, ChevronUp, Sparkles, Volume2, Pause, Play, Save, RefreshCw, Stethoscope, Heart, Thermometer, Eye, Clipboard, Send, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import EducationalDisclaimer from './EducationalDisclaimer';

// ==================== INTERFACES ====================
interface PatientRecord {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F';
  allergies: string[];
  comorbidities: string[];
  medications: string[];
  lastVisit: string;
  evolutions: Evolution[];
}

interface Evolution {
  date: string;
  type: 'consulta' | 'retorno' | 'urgencia';
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  cid10: string[];
  prescriptions: string[];
}

interface CIDSuggestion {
  code: string;
  description: string;
  confidence: number;
}

interface TranscriptionSegment {
  timestamp: string;
  speaker: 'medico' | 'paciente';
  text: string;
}

// ==================== MOCK DATA ====================
const DEMO_PATIENTS: PatientRecord[] = [
  {
    id: 'P001',
    name: 'Maria Silva Santos',
    age: 58,
    sex: 'F',
    allergies: ['Dipirona', 'AAS'],
    comorbidities: ['Hipertensão Arterial Sistêmica', 'Diabetes Mellitus tipo 2', 'Dislipidemia'],
    medications: ['Losartana 50mg 12/12h', 'Metformina 850mg 2x/dia', 'Atorvastatina 20mg à noite'],
    lastVisit: '2026-01-15',
    evolutions: [
      {
        date: '2026-01-15',
        type: 'consulta',
        subjective: 'Paciente refere cefaleia occipital há 3 dias, associada a tontura. Nega dor torácica. Relata que parou Losartana há 1 semana por conta própria por "estar se sentindo bem".',
        objective: 'PA: 170x100 mmHg. FC: 82 bpm. IMC: 31.2. Ausculta cardíaca: RCR 2T BNF sem sopros. Ausculta pulmonar: MV+ bilateralmente sem RA. Edema MMII: +/4+.',
        assessment: 'Crise hipertensiva por abandono de medicação. DM2 em controle regular (HbA1c 7.2% em dez/25).',
        plan: 'Retomar Losartana 50mg 12/12h. Associar Anlodipino 5mg/dia. Solicitar: ECG, ecocardiograma, microalbuminúria. Retorno em 15 dias com exames.',
        cid10: ['I10', 'E11.9'],
        prescriptions: ['Losartana 50mg - 1cp 12/12h', 'Anlodipino 5mg - 1cp pela manhã', 'Metformina 850mg - 1cp 2x/dia']
      },
      {
        date: '2025-10-20',
        type: 'retorno',
        subjective: 'Retorno para avaliação de exames. Assintomática. Boa adesão medicamentosa. Nega hipoglicemia.',
        objective: 'PA: 130x85 mmHg. FC: 76 bpm. HbA1c: 7.2%. Glicemia jejum: 132 mg/dL. Creatinina: 0.9. TFG: 78. Colesterol total: 198. LDL: 118. HDL: 45. TG: 175.',
        assessment: 'HAS controlada. DM2 com controle regular — considerar intensificar se HbA1c não reduzir. Dislipidemia: LDL acima da meta para alto risco CV.',
        plan: 'Manter medicações. Aumentar Atorvastatina para 40mg. Orientar dieta e exercício. Retorno em 3 meses.',
        cid10: ['I10', 'E11.9', 'E78.5'],
        prescriptions: ['Losartana 50mg - 1cp 12/12h', 'Metformina 850mg - 1cp 2x/dia', 'Atorvastatina 40mg - 1cp à noite']
      },
      {
        date: '2025-07-12',
        type: 'consulta',
        subjective: 'Paciente refere poliúria e polidipsia há 2 meses. Perda de peso de 3kg. Nega febre.',
        objective: 'PA: 145x92 mmHg. Glicemia capilar: 287 mg/dL. IMC: 32.5. Acantose nigricans em pescoço.',
        assessment: 'Diagnóstico de DM2 (glicemia jejum 256 + HbA1c 9.1%). HAS em tratamento.',
        plan: 'Iniciar Metformina 500mg 2x/dia, titular para 850mg em 2 semanas. Solicitar: HbA1c, perfil lipídico, creatinina, microalbuminúria, fundo de olho. Retorno em 30 dias.',
        cid10: ['E11.9', 'I10'],
        prescriptions: ['Metformina 500mg - 1cp 2x/dia (titular para 850mg em 2 semanas)', 'Losartana 50mg - 1cp 12/12h']
      }
    ]
  },
  {
    id: 'P002',
    name: 'João Carlos Oliveira',
    age: 42,
    sex: 'M',
    allergies: [],
    comorbidities: ['Asma moderada persistente'],
    medications: ['Budesonida/Formoterol 200/6mcg 12/12h', 'Salbutamol SOS'],
    lastVisit: '2026-02-10',
    evolutions: [
      {
        date: '2026-02-10',
        type: 'urgencia',
        subjective: 'Paciente chega com dispneia progressiva há 2 dias, piora noturna. Uso de Salbutamol 6x nas últimas 24h sem melhora completa. Relata exposição a poeira em reforma residencial.',
        objective: 'FR: 28 irpm. SpO2: 92% AA. Sibilos difusos bilaterais. Uso de musculatura acessória. Peak flow: 45% do previsto. FC: 110 bpm.',
        assessment: 'Crise asmática moderada-grave. Trigger: exposição a poeira.',
        plan: 'Salbutamol 400mcg (4 jatos) a cada 20min x 3 doses. Ipratrópio 80mcg associado. Prednisona 40mg VO. Reavaliar em 1h. Se sem melhora: considerar sulfato de magnésio IV.',
        cid10: ['J45.1'],
        prescriptions: ['Salbutamol 100mcg spray - 4 jatos a cada 20min x 3', 'Ipratrópio 20mcg spray - 4 jatos a cada 20min x 3', 'Prednisona 20mg - 2cp VO agora']
      }
    ]
  },
  {
    id: 'P003',
    name: 'Ana Beatriz Ferreira',
    age: 32,
    sex: 'F',
    allergies: ['Amoxicilina'],
    comorbidities: ['Hipotireoidismo'],
    medications: ['Levotiroxina 75mcg/dia'],
    lastVisit: '2026-02-25',
    evolutions: [
      {
        date: '2026-02-25',
        type: 'consulta',
        subjective: 'Paciente refere fadiga persistente, ganho de peso de 5kg em 3 meses, constipação e pele seca. Relata que esquece de tomar Levotiroxina com frequência.',
        objective: 'PA: 110x70 mmHg. FC: 58 bpm. Pele seca, cabelos quebradiços. Tireoide: sem nódulos palpáveis. Reflexos aquileus com relaxamento lento. TSH: 18.5 (ref: 0.4-4.0). T4L: 0.6 (ref: 0.8-1.8).',
        assessment: 'Hipotireoidismo descompensado por má adesão medicamentosa.',
        plan: 'Aumentar Levotiroxina para 100mcg/dia. Orientar: tomar em jejum, 30-60min antes do café, longe de cálcio e ferro. Solicitar: Anti-TPO, perfil lipídico. Retorno em 6-8 semanas com TSH.',
        cid10: ['E03.9'],
        prescriptions: ['Levotiroxina 100mcg - 1cp em jejum pela manhã']
      }
    ]
  }
];

const CID10_DATABASE: CIDSuggestion[] = [
  { code: 'I10', description: 'Hipertensão essencial (primária)', confidence: 0 },
  { code: 'I11.9', description: 'Doença cardíaca hipertensiva sem ICC', confidence: 0 },
  { code: 'I20.9', description: 'Angina pectoris, não especificada', confidence: 0 },
  { code: 'I21.9', description: 'Infarto agudo do miocárdio, não especificado', confidence: 0 },
  { code: 'I25.1', description: 'Doença aterosclerótica do coração', confidence: 0 },
  { code: 'I48', description: 'Fibrilação e flutter atrial', confidence: 0 },
  { code: 'I50.9', description: 'Insuficiência cardíaca, não especificada', confidence: 0 },
  { code: 'E10.9', description: 'Diabetes mellitus tipo 1 sem complicações', confidence: 0 },
  { code: 'E11.9', description: 'Diabetes mellitus tipo 2 sem complicações', confidence: 0 },
  { code: 'E03.9', description: 'Hipotireoidismo, não especificado', confidence: 0 },
  { code: 'E05.9', description: 'Tireotoxicose, não especificada', confidence: 0 },
  { code: 'E66.9', description: 'Obesidade, não especificada', confidence: 0 },
  { code: 'E78.5', description: 'Hiperlipidemia, não especificada', confidence: 0 },
  { code: 'J06.9', description: 'IVAS, não especificada', confidence: 0 },
  { code: 'J15.9', description: 'Pneumonia bacteriana, não especificada', confidence: 0 },
  { code: 'J18.9', description: 'Pneumonia, não especificada', confidence: 0 },
  { code: 'J44.1', description: 'DPOC com exacerbação aguda', confidence: 0 },
  { code: 'J45.0', description: 'Asma predominantemente alérgica', confidence: 0 },
  { code: 'J45.1', description: 'Asma não-alérgica', confidence: 0 },
  { code: 'K21.0', description: 'DRGE com esofagite', confidence: 0 },
  { code: 'K29.7', description: 'Gastrite, não especificada', confidence: 0 },
  { code: 'K80.2', description: 'Colelitíase sem colecistite', confidence: 0 },
  { code: 'M54.5', description: 'Dor lombar baixa', confidence: 0 },
  { code: 'N39.0', description: 'Infecção do trato urinário, local não especificado', confidence: 0 },
  { code: 'F32.1', description: 'Episódio depressivo moderado', confidence: 0 },
  { code: 'F41.1', description: 'Ansiedade generalizada', confidence: 0 },
  { code: 'G43.9', description: 'Enxaqueca, não especificada', confidence: 0 },
  { code: 'R10.4', description: 'Outras dores abdominais e as não especificadas', confidence: 0 },
  { code: 'R50.9', description: 'Febre, não especificada', confidence: 0 },
  { code: 'R51', description: 'Cefaleia', confidence: 0 },
  { code: 'A09', description: 'Diarreia e gastroenterite de origem infecciosa presumível', confidence: 0 },
  { code: 'B34.9', description: 'Infecção viral, não especificada', confidence: 0 },
  { code: 'L30.9', description: 'Dermatite, não especificada', confidence: 0 },
  { code: 'N18.9', description: 'Doença renal crônica, não especificada', confidence: 0 },
  { code: 'D50.9', description: 'Anemia por deficiência de ferro, não especificada', confidence: 0 },
];

// ==================== COMPONENT ====================
export default function ProntuarioZeroDigitacao() {
  // State
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [transcription, setTranscription] = useState<TranscriptionSegment[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [activeTab, setActiveTab] = useState<'flashback' | 'scribe' | 'soap' | 'prescricao'>('flashback');
  const [flashbackText, setFlashbackText] = useState('');
  const [isGeneratingFlashback, setIsGeneratingFlashback] = useState(false);
  const [soapNote, setSoapNote] = useState({ subjective: '', objective: '', assessment: '', plan: '' });
  const [cidSuggestions, setCidSuggestions] = useState<CIDSuggestion[]>([]);
  const [selectedCIDs, setSelectedCIDs] = useState<string[]>([]);
  const [cidSearch, setCidSearch] = useState('');
  const [prescriptions, setPrescriptions] = useState<string[]>([]);
  const [newPrescription, setNewPrescription] = useState('');
  const [showEvolutions, setShowEvolutions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [isGeneratingSOAP, setIsGeneratingSOAP] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setRecordingTime(t => t + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  // Generate Flashback when patient is selected
  const generateFlashback = useCallback(async (patient: PatientRecord) => {
    setIsGeneratingFlashback(true);
    setFlashbackText('');
    
    // Simulate AI generating flashback from patient history
    await new Promise(r => setTimeout(r, 1500));
    
    const evolutions = patient.evolutions;
    const lastEvo = evolutions[0];
    const allCIDs = [...new Set(evolutions.flatMap(e => e.cid10))];
    const allMeds = patient.medications;
    
    let flashback = `**Resumo Inteligente — ${patient.name}** (${patient.age}a, ${patient.sex})\n\n`;
    flashback += `**Comorbidades ativas:** ${patient.comorbidities.join(', ')}.\n\n`;
    
    if (patient.allergies.length > 0) {
      flashback += `⚠️ **ALERGIAS:** ${patient.allergies.join(', ')}.\n\n`;
    }
    
    flashback += `**Medicações em uso:** ${allMeds.join('; ')}.\n\n`;
    flashback += `**Última consulta** (${lastEvo.date}): ${lastEvo.assessment}\n\n`;
    
    // Generate insights
    flashback += `**Insights da IA:**\n`;
    
    if (patient.name === 'Maria Silva Santos') {
      flashback += `• Paciente hipertensa com histórico de abandono de medicação — última crise há 6 semanas por ter parado Losartana por conta própria.\n`;
      flashback += `• DM2 diagnosticada em jul/2025 (HbA1c inicial 9.1%), em melhora progressiva (7.2% em out/2025). Considerar meta < 7%.\n`;
      flashback += `• Dislipidemia com LDL acima da meta para alto risco CV — Atorvastatina aumentada para 40mg em out/2025.\n`;
      flashback += `• Anlodipino 5mg associado na última consulta. Verificar resposta pressórica.\n`;
      flashback += `• **Atenção:** Paciente com IMC 31.2 (obesidade grau I) — reforçar orientação nutricional.\n`;
      flashback += `• **Pendências:** ECG, ecocardiograma e microalbuminúria solicitados em jan/2026 — verificar se realizou.\n`;
    } else if (patient.name === 'João Carlos Oliveira') {
      flashback += `• Asmático moderado persistente com crise recente por exposição a poeira (reforma).\n`;
      flashback += `• Último atendimento foi urgência com SpO2 92% e Peak Flow 45% — crise moderada-grave.\n`;
      flashback += `• Verificar se completou curso de Prednisona e se retomou controle com Budesonida/Formoterol.\n`;
      flashback += `• **Atenção:** Avaliar necessidade de step-up na terapia de manutenção.\n`;
    } else if (patient.name === 'Ana Beatriz Ferreira') {
      flashback += `• Hipotireoidismo descompensado por má adesão (TSH 18.5 em fev/2026).\n`;
      flashback += `• Levotiroxina aumentada de 75 para 100mcg. Verificar se aderiu ao novo esquema.\n`;
      flashback += `• Sintomas clássicos: fadiga, ganho de peso, constipação, pele seca.\n`;
      flashback += `• **Alergia a Amoxicilina** — evitar penicilinas sem teste.\n`;
      flashback += `• **Pendências:** Anti-TPO e perfil lipídico solicitados — verificar resultados.\n`;
    }
    
    setFlashbackText(flashback);
    setIsGeneratingFlashback(false);
  }, []);

  // Select patient
  const handleSelectPatient = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setActiveTab('flashback');
    setTranscription([]);
    setSoapNote({ subjective: '', objective: '', assessment: '', plan: '' });
    setCidSuggestions([]);
    setSelectedCIDs([]);
    setPrescriptions([]);
    setSavedSuccess(false);
    generateFlashback(patient);
  };

  // Start/Stop recording
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate transcription processing
      setIsTranscribing(true);
      setTimeout(() => {
        if (selectedPatient?.name === 'Maria Silva Santos') {
          setTranscription([
            { timestamp: '00:00', speaker: 'medico', text: 'Bom dia, Dona Maria. Como a senhora está se sentindo desde a última consulta?' },
            { timestamp: '00:08', speaker: 'paciente', text: 'Olá doutor. Estou melhor da dor de cabeça, mas ainda sinto um pouco de tontura quando levanto rápido.' },
            { timestamp: '00:18', speaker: 'medico', text: 'Entendo. A senhora voltou a tomar a Losartana certinho?' },
            { timestamp: '00:23', speaker: 'paciente', text: 'Sim, estou tomando a Losartana e o remédio novo que o senhor passou, o Anlodipino.' },
            { timestamp: '00:32', speaker: 'medico', text: 'Ótimo. E a Metformina para o diabetes, está tomando também?' },
            { timestamp: '00:38', speaker: 'paciente', text: 'Sim, duas vezes por dia. Mas às vezes dá uma dor de barriga.' },
            { timestamp: '00:45', speaker: 'medico', text: 'Isso pode acontecer. Vamos verificar a pressão e os exames. A senhora fez o ecocardiograma que eu pedi?' },
            { timestamp: '00:55', speaker: 'paciente', text: 'Fiz sim, trouxe aqui. E o ECG também.' },
            { timestamp: '01:02', speaker: 'medico', text: 'Vamos ver. Pressão hoje está 142 por 88. Melhorou bastante, mas ainda não está na meta. Vou examinar a senhora.' },
            { timestamp: '01:15', speaker: 'medico', text: 'Coração com ritmo regular, sem sopros. Pulmão limpo. Edema discreto nos tornozelos, melhorou em relação à última vez.' },
          ]);
        } else {
          setTranscription([
            { timestamp: '00:00', speaker: 'medico', text: 'Boa tarde. Como está se sentindo hoje?' },
            { timestamp: '00:05', speaker: 'paciente', text: 'Estou com alguns sintomas que gostaria de relatar.' },
            { timestamp: '00:12', speaker: 'medico', text: 'Pode me contar com detalhes, por favor.' },
          ]);
        }
        setIsTranscribing(false);
      }, 2000);
    } else {
      setIsRecording(true);
      setRecordingTime(0);
    }
  };

  // Generate SOAP from transcription
  const generateSOAPFromTranscription = async () => {
    setIsGeneratingSOAP(true);
    await new Promise(r => setTimeout(r, 2000));
    
    if (selectedPatient?.name === 'Maria Silva Santos') {
      setSoapNote({
        subjective: 'Paciente refere melhora da cefaleia occipital. Persiste com tontura ortostática. Retomou uso regular de Losartana 50mg 12/12h e Anlodipino 5mg/dia. Mantém Metformina 850mg 2x/dia com queixa de desconforto gastrointestinal ocasional. Realizou ECG e ecocardiograma solicitados.',
        objective: 'PA: 142x88 mmHg (melhora em relação a 170x100 da última consulta). FC: 78 bpm. Ausculta cardíaca: RCR 2T BNF sem sopros. Ausculta pulmonar: MV+ bilateral sem RA. Edema MMII: discreto, melhora em relação à consulta anterior. ECG: ritmo sinusal, sem alterações agudas. Ecocardiograma: pendente avaliação.',
        assessment: 'HAS em melhora com terapia combinada (Losartana + Anlodipino), porém ainda acima da meta (< 130x80 para alto risco CV). DM2 em uso de Metformina com intolerância GI leve. Dislipidemia em tratamento com Atorvastatina 40mg.',
        plan: 'Aumentar Anlodipino para 10mg/dia (PA ainda acima da meta). Manter Losartana 50mg 12/12h. Orientar tomar Metformina durante as refeições para reduzir desconforto GI. Avaliar ecocardiograma trazido. Solicitar: HbA1c, perfil lipídico, creatinina, potássio. Retorno em 30 dias.'
      });
      setCidSuggestions([
        { code: 'I10', description: 'Hipertensão essencial (primária)', confidence: 95 },
        { code: 'E11.9', description: 'Diabetes mellitus tipo 2 sem complicações', confidence: 88 },
        { code: 'E78.5', description: 'Hiperlipidemia, não especificada', confidence: 82 },
        { code: 'R42', description: 'Tontura e instabilidade', confidence: 65 },
      ]);
      setSelectedCIDs(['I10', 'E11.9']);
      setPrescriptions([
        'Losartana 50mg — 1 comprimido de 12/12h (manter)',
        'Anlodipino 10mg — 1 comprimido pela manhã (aumentar dose)',
        'Metformina 850mg — 1 comprimido 2x/dia durante refeições (manter)',
        'Atorvastatina 40mg — 1 comprimido à noite (manter)',
      ]);
    } else {
      setSoapNote({
        subjective: 'Paciente relata sintomas a esclarecer.',
        objective: 'Exame físico em andamento.',
        assessment: 'Avaliação pendente.',
        plan: 'Completar anamnese e exame físico.'
      });
    }
    
    setIsGeneratingSOAP(false);
    setActiveTab('soap');
  };

  // CID search
  const filteredCIDs = cidSearch.length >= 2
    ? CID10_DATABASE.filter(c => 
        c.code.toLowerCase().includes(cidSearch.toLowerCase()) ||
        c.description.toLowerCase().includes(cidSearch.toLowerCase())
      ).slice(0, 8)
    : [];

  // Add prescription
  const addPrescription = () => {
    if (newPrescription.trim()) {
      setPrescriptions(prev => [...prev, newPrescription.trim()]);
      setNewPrescription('');
    }
  };

  // Save consultation
  const saveConsultation = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Format time
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Filter patients
  const filteredPatients = DEMO_PATIENTS.filter(p =>
    p.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.id.toLowerCase().includes(patientSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <EducationalDisclaimer module="Prontuário Zero Digitação" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900/40 to-indigo-900/40 rounded-2xl p-6 border border-violet-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-500/20 rounded-lg">
            <Mic className="w-6 h-6 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Prontuário Zero Digitação</h1>
          <span className="px-2 py-0.5 bg-violet-500/30 text-violet-300 text-xs rounded-full">IA Avançada</span>
        </div>
        <p className="text-gray-400 text-sm">
          Ambient Scribe com transcrição em tempo real, Flashback do Paciente via Gemini, auto-CID e geração automática de SOAP.
        </p>
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Brain className="w-4 h-4" /> Gemini API
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Volume2 className="w-4 h-4" /> Whisper API
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Search className="w-4 h-4" /> Auto-CID-10
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FileText className="w-4 h-4" /> SOAP Automático
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Patient List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">Pacientes</h3>
            <input
              type="text"
              placeholder="Buscar paciente..."
              value={patientSearch}
              onChange={e => setPatientSearch(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 mb-3"
            />
            <div className="space-y-2">
              {filteredPatients.map(patient => (
                <button
                  key={patient.id}
                  onClick={() => handleSelectPatient(patient)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedPatient?.id === patient.id
                      ? 'bg-violet-500/20 border border-violet-500/40'
                      : 'bg-gray-700/30 border border-gray-700/50 hover:bg-gray-700/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white">{patient.name}</span>
                    <span className="text-xs text-gray-500">{patient.id}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{patient.age}a, {patient.sex}</span>
                    {patient.allergies.length > 0 && (
                      <span className="text-xs text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Alergias
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Última: {patient.lastVisit}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {!selectedPatient ? (
            <div className="bg-gray-800/50 rounded-xl p-12 border border-gray-700/50 text-center">
              <Stethoscope className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-400">Selecione um paciente</h3>
              <p className="text-sm text-gray-500 mt-2">Escolha um paciente na lista ao lado para iniciar o atendimento com IA.</p>
            </div>
          ) : (
            <>
              {/* Patient Header Bar */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedPatient.name}</h2>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{selectedPatient.age} anos, {selectedPatient.sex === 'M' ? 'Masculino' : 'Feminino'}</span>
                      <span>ID: {selectedPatient.id}</span>
                      <span>Última consulta: {selectedPatient.lastVisit}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedPatient.allergies.length > 0 && (
                      <div className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <span className="text-xs text-red-400 font-medium">⚠️ Alergias: {selectedPatient.allergies.join(', ')}</span>
                      </div>
                    )}
                    <button
                      onClick={() => setShowEvolutions(!showEvolutions)}
                      className="px-3 py-1 bg-gray-700/50 border border-gray-600 rounded-lg text-xs text-gray-300 hover:bg-gray-700 flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3" /> Histórico ({selectedPatient.evolutions.length})
                      {showEvolutions ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                
                {/* Comorbidities & Medications */}
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <span className="text-xs text-gray-500">Comorbidades:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPatient.comorbidities.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs rounded-full">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Medicações em uso:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selectedPatient.medications.map((m, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-xs rounded-full">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Evolution History */}
                {showEvolutions && (
                  <div className="mt-4 space-y-3 border-t border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold text-gray-300">Histórico de Evoluções</h4>
                    {selectedPatient.evolutions.map((evo, i) => (
                      <div key={i} className="bg-gray-900/50 rounded-lg p-3 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              evo.type === 'urgencia' ? 'bg-red-500/20 text-red-400' :
                              evo.type === 'retorno' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-green-500/20 text-green-400'
                            }`}>{evo.type === 'urgencia' ? 'Urgência' : evo.type === 'retorno' ? 'Retorno' : 'Consulta'}</span>
                            <span className="text-xs text-gray-400">{evo.date}</span>
                          </div>
                          <div className="flex gap-1">
                            {evo.cid10.map(c => (
                              <span key={c} className="px-1.5 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded">{c}</span>
                            ))}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div><span className="text-gray-500">S:</span> <span className="text-gray-300">{evo.subjective.substring(0, 120)}...</span></div>
                          <div><span className="text-gray-500">O:</span> <span className="text-gray-300">{evo.objective.substring(0, 120)}...</span></div>
                          <div><span className="text-gray-500">A:</span> <span className="text-gray-300">{evo.assessment.substring(0, 120)}...</span></div>
                          <div><span className="text-gray-500">P:</span> <span className="text-gray-300">{evo.plan.substring(0, 120)}...</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-2">
                {[
                  { id: 'flashback' as const, label: 'Flashback IA', icon: Brain },
                  { id: 'scribe' as const, label: 'Ambient Scribe', icon: Mic },
                  { id: 'soap' as const, label: 'Nota SOAP', icon: FileText },
                  { id: 'prescricao' as const, label: 'Prescrição', icon: Pill },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40'
                        : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Flashback Tab */}
              {activeTab === 'flashback' && (
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-violet-400" />
                      <h3 className="text-lg font-semibold text-white">Flashback do Paciente</h3>
                      <span className="px-2 py-0.5 bg-violet-500/20 text-violet-300 text-xs rounded-full">Gemini</span>
                    </div>
                    <button
                      onClick={() => generateFlashback(selectedPatient)}
                      className="px-3 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-lg hover:bg-violet-500/30 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" /> Regenerar
                    </button>
                  </div>
                  
                  {isGeneratingFlashback ? (
                    <div className="flex items-center gap-3 py-8 justify-center">
                      <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
                      <span className="text-gray-400">Analisando histórico do paciente...</span>
                    </div>
                  ) : (
                    <div className="prose prose-invert max-w-none">
                      {flashbackText.split('\n').map((line, i) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <h4 key={i} className="text-violet-300 font-semibold mt-3">{line.replace(/\*\*/g, '')}</h4>;
                        }
                        if (line.startsWith('⚠️')) {
                          return <p key={i} className="text-red-400 font-medium bg-red-500/10 px-3 py-2 rounded-lg">{line}</p>;
                        }
                        if (line.startsWith('•')) {
                          return <p key={i} className="text-gray-300 text-sm ml-4">{line}</p>;
                        }
                        if (line.includes('**')) {
                          const parts = line.split('**');
                          return (
                            <p key={i} className="text-gray-300 text-sm">
                              {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-white">{part}</strong> : part)}
                            </p>
                          );
                        }
                        return line ? <p key={i} className="text-gray-300 text-sm">{line}</p> : <br key={i} />;
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Ambient Scribe Tab */}
              {activeTab === 'scribe' && (
                <div className="space-y-4">
                  {/* Recording Controls */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Volume2 className="w-5 h-5 text-green-400" />
                        Ambient Scribe — Transcrição de Consulta
                      </h3>
                      <span className="text-xs text-gray-500">Whisper API + Gemini</span>
                    </div>
                    
                    <div className="flex items-center justify-center gap-6 py-6">
                      <button
                        onClick={toggleRecording}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                          isRecording
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/30'
                            : 'bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30'
                        }`}
                      >
                        {isRecording ? <MicOff className="w-8 h-8 text-white" /> : <Mic className="w-8 h-8 text-white" />}
                      </button>
                      <div className="text-center">
                        <div className="text-3xl font-mono text-white">{formatTime(recordingTime)}</div>
                        <div className={`text-sm mt-1 ${isRecording ? 'text-red-400' : 'text-gray-500'}`}>
                          {isRecording ? '● Gravando...' : 'Clique para iniciar'}
                        </div>
                      </div>
                    </div>

                    {isRecording && (
                      <div className="flex justify-center gap-1 mt-2">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-green-400 rounded-full animate-pulse"
                            style={{
                              height: `${Math.random() * 30 + 5}px`,
                              animationDelay: `${i * 0.05}s`
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Transcription Result */}
                  {isTranscribing && (
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50 text-center">
                      <Loader2 className="w-8 h-8 text-violet-400 animate-spin mx-auto mb-3" />
                      <p className="text-gray-400">Processando transcrição com Whisper API...</p>
                      <p className="text-xs text-gray-500 mt-1">Identificando falantes e estruturando texto clínico</p>
                    </div>
                  )}

                  {transcription.length > 0 && !isTranscribing && (
                    <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-semibold text-gray-300">Transcrição da Consulta</h4>
                        <button
                          onClick={generateSOAPFromTranscription}
                          disabled={isGeneratingSOAP}
                          className="px-4 py-2 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-600 text-white text-sm rounded-lg flex items-center gap-2 transition-all"
                        >
                          {isGeneratingSOAP ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Gerando SOAP...</>
                          ) : (
                            <><Sparkles className="w-4 h-4" /> Gerar SOAP com IA</>
                          )}
                        </button>
                      </div>
                      <div className="space-y-3 max-h-80 overflow-y-auto">
                        {transcription.map((seg, i) => (
                          <div key={i} className={`flex gap-3 ${seg.speaker === 'medico' ? '' : 'flex-row-reverse'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              seg.speaker === 'medico' ? 'bg-blue-500/20' : 'bg-green-500/20'
                            }`}>
                              {seg.speaker === 'medico' ? (
                                <Stethoscope className="w-4 h-4 text-blue-400" />
                              ) : (
                                <Heart className="w-4 h-4 text-green-400" />
                              )}
                            </div>
                            <div className={`max-w-[70%] p-3 rounded-lg ${
                              seg.speaker === 'medico' ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-green-500/10 border border-green-500/20'
                            }`}>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-medium ${seg.speaker === 'medico' ? 'text-blue-400' : 'text-green-400'}`}>
                                  {seg.speaker === 'medico' ? 'Médico' : 'Paciente'}
                                </span>
                                <span className="text-xs text-gray-500">{seg.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-300">{seg.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SOAP Tab */}
              {activeTab === 'soap' && (
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      Nota SOAP
                      {soapNote.subjective && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Gerado por IA</span>}
                    </h3>
                    
                    <div className="space-y-4">
                      {[
                        { key: 'subjective' as const, label: 'S — Subjetivo', icon: Clipboard, color: 'blue', hint: 'Queixa principal, HDA, sintomas relatados pelo paciente' },
                        { key: 'objective' as const, label: 'O — Objetivo', icon: Eye, color: 'green', hint: 'Exame físico, sinais vitais, resultados de exames' },
                        { key: 'assessment' as const, label: 'A — Avaliação', icon: Brain, color: 'yellow', hint: 'Diagnóstico(s), hipóteses diagnósticas, CID-10' },
                        { key: 'plan' as const, label: 'P — Plano', icon: Activity, color: 'purple', hint: 'Conduta, prescrições, exames solicitados, encaminhamentos' },
                      ].map(field => (
                        <div key={field.key}>
                          <label className={`text-sm font-medium text-${field.color}-400 flex items-center gap-2 mb-1`}>
                            <field.icon className="w-4 h-4" />
                            {field.label}
                          </label>
                          <textarea
                            value={soapNote[field.key]}
                            onChange={e => setSoapNote(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.hint}
                            rows={3}
                            className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-violet-500 focus:outline-none resize-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CID-10 Auto-suggest */}
                  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <Search className="w-4 h-4" /> CID-10 — Sugestão Automática por IA
                    </h4>
                    
                    {cidSuggestions.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <span className="text-xs text-gray-500">Sugestões baseadas na transcrição:</span>
                        {cidSuggestions.map(cid => (
                          <div
                            key={cid.code}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${
                              selectedCIDs.includes(cid.code)
                                ? 'bg-violet-500/20 border border-violet-500/40'
                                : 'bg-gray-700/30 border border-gray-700/50 hover:bg-gray-700/50'
                            }`}
                            onClick={() => {
                              setSelectedCIDs(prev =>
                                prev.includes(cid.code)
                                  ? prev.filter(c => c !== cid.code)
                                  : [...prev, cid.code]
                              );
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`w-5 h-5 rounded flex items-center justify-center ${
                                selectedCIDs.includes(cid.code) ? 'bg-violet-500' : 'bg-gray-600'
                              }`}>
                                {selectedCIDs.includes(cid.code) && <CheckCircle className="w-3 h-3 text-white" />}
                              </span>
                              <span className="text-sm font-mono text-violet-300">{cid.code}</span>
                              <span className="text-sm text-gray-300">{cid.description}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    cid.confidence >= 80 ? 'bg-green-500' : cid.confidence >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${cid.confidence}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500">{cid.confidence}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Buscar CID-10 por código ou descrição..."
                        value={cidSearch}
                        onChange={e => setCidSearch(e.target.value)}
                        className="w-full bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600"
                      />
                      {filteredCIDs.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                          {filteredCIDs.map(cid => (
                            <button
                              key={cid.code}
                              onClick={() => {
                                if (!selectedCIDs.includes(cid.code)) {
                                  setSelectedCIDs(prev => [...prev, cid.code]);
                                }
                                setCidSearch('');
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-gray-700/50 flex items-center gap-3"
                            >
                              <span className="text-sm font-mono text-violet-300">{cid.code}</span>
                              <span className="text-sm text-gray-300">{cid.description}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {selectedCIDs.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {selectedCIDs.map(code => {
                          const cid = CID10_DATABASE.find(c => c.code === code) || cidSuggestions.find(c => c.code === code);
                          return (
                            <span key={code} className="px-3 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full flex items-center gap-2">
                              {code} {cid && `— ${cid.description}`}
                              <button onClick={() => setSelectedCIDs(prev => prev.filter(c => c !== code))}>
                                <XCircle className="w-3 h-3 text-violet-400 hover:text-red-400" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Prescription Tab */}
              {activeTab === 'prescricao' && (
                <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-green-400" />
                    Prescrição Digital
                    {prescriptions.length > 0 && <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">Gerada por IA</span>}
                  </h3>

                  {selectedPatient.allergies.length > 0 && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4">
                      <span className="text-sm text-red-400 font-medium">⚠️ ALERGIAS: {selectedPatient.allergies.join(', ')}</span>
                    </div>
                  )}

                  <div className="space-y-2 mb-4">
                    {prescriptions.map((rx, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 border border-gray-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center justify-center font-medium">{i + 1}</span>
                          <span className="text-sm text-gray-300">{rx}</span>
                        </div>
                        <button
                          onClick={() => setPrescriptions(prev => prev.filter((_, j) => j !== i))}
                          className="text-gray-500 hover:text-red-400"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Adicionar medicamento (ex: Amoxicilina 500mg - 1cp 8/8h por 7 dias)"
                      value={newPrescription}
                      onChange={e => setNewPrescription(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addPrescription()}
                      className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-600"
                    />
                    <button
                      onClick={addPrescription}
                      className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 text-sm"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={saveConsultation}
                  disabled={isSaving}
                  className="px-6 py-3 bg-violet-500 hover:bg-violet-600 disabled:bg-gray-600 text-white rounded-lg flex items-center gap-2 transition-all font-medium"
                >
                  {isSaving ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Salvando...</>
                  ) : savedSuccess ? (
                    <><CheckCircle className="w-5 h-5" /> Salvo com Sucesso!</>
                  ) : (
                    <><Save className="w-5 h-5" /> Salvar Atendimento</>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-xs text-yellow-400/80">
          <strong>Aviso Educacional:</strong> Este módulo é uma ferramenta de apoio ao estudo e simulação. A transcrição por IA, sugestões de CID-10 e geração de SOAP são demonstrações tecnológicas para fins educacionais. Em ambiente clínico real, todas as informações devem ser validadas pelo profissional médico responsável. As APIs Whisper e Gemini são utilizadas para processamento de linguagem natural e não substituem o julgamento clínico.
        </p>
      </div>
    </div>
  );
}
