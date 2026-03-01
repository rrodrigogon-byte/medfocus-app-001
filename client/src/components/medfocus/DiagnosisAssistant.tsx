import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';
import EducationalDisclaimer from './EducationalDisclaimer';

const COMMON_SYMPTOMS = [
  'Febre', 'Cefaleia', 'Dor torácica', 'Dispneia', 'Dor abdominal', 'Náusea', 'Vômito',
  'Diarreia', 'Tosse', 'Fadiga', 'Mialgia', 'Artralgia', 'Edema', 'Tontura', 'Síncope',
  'Palpitações', 'Dor lombar', 'Disúria', 'Hematúria', 'Icterícia', 'Prurido', 'Rash cutâneo',
  'Perda de peso', 'Sudorese noturna', 'Linfonodomegalia', 'Hemoptise', 'Odinofagia',
  'Disfagia', 'Constipação', 'Melena', 'Hematoquezia', 'Oligúria', 'Poliúria', 'Parestesia',
];

export default function DiagnosisAssistant() {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [customSymptom, setCustomSymptom] = useState('');
  const [patientAge, setPatientAge] = useState<number | undefined>();
  const [patientSex, setPatientSex] = useState<'male' | 'female' | 'other'>('male');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [labResults, setLabResults] = useState('');
  const [vitalSigns, setVitalSigns] = useState({
    temperature: undefined as number | undefined,
    heartRate: undefined as number | undefined,
    bloodPressure: '',
    respiratoryRate: undefined as number | undefined,
    oxygenSaturation: undefined as number | undefined,
  });
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'result'>('input');

  const diagnosisMutation = trpc.diagnosis.differential.useMutation({
    onSuccess: (data) => {
      setResult(data);
      setActiveTab('result');
      toast.success('Diagnóstico diferencial gerado com sucesso!');
    },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const toggleSymptom = (symptom: string) => {
    setSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]);
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !symptoms.includes(customSymptom.trim())) {
      setSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const handleSubmit = () => {
    if (symptoms.length === 0) { toast.error('Adicione pelo menos um sintoma'); return; }
    diagnosisMutation.mutate({
      symptoms,
      patientAge,
      patientSex,
      medicalHistory: medicalHistory || undefined,
      labResults: labResults || undefined,
      vitalSigns: vitalSigns.temperature || vitalSigns.heartRate ? vitalSigns : undefined,
    });
  };

  const getSeverityColor = (severity: string) => {
    const s = severity.toLowerCase();
    if (s.includes('alta') || s.includes('high') || s.includes('emergên') || s.includes('urgent')) return 'text-red-400 bg-red-900/30';
    if (s.includes('moderada') || s.includes('medium')) return 'text-yellow-400 bg-yellow-900/30';
    return 'text-green-400 bg-green-900/30';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <EducationalDisclaimer variant="banner" moduleName="Assistente de Diagnóstico" showAIWarning showEmergencyInfo />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-6 border border-blue-700/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-2xl">🩺</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Apoio a Diagnóstico com IA</h2>
            <p className="text-blue-300 text-sm">Sistema de apoio à decisão clínica baseado em evidências — Powered by Dr. Focus</p>
          </div>
        </div>
        <div className="mt-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-3">
          <p className="text-yellow-300 text-xs">⚠️ <strong>AVISO:</strong> Este é um sistema de apoio à decisão clínica. O diagnóstico final deve ser feito pelo médico responsável. Não substitui a avaliação médica presencial.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveTab('input')} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'input' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
          📋 Dados do Paciente
        </button>
        <button onClick={() => setActiveTab('result')} disabled={!result} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === 'result' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'} disabled:opacity-50`}>
          🔬 Diagnóstico Diferencial
        </button>
      </div>

      {activeTab === 'input' && (
        <div className="space-y-6">
          {/* Patient Info */}
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">👤 Dados do Paciente</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Idade</label>
                <input type="number" value={patientAge || ''} onChange={e => setPatientAge(e.target.value ? parseInt(e.target.value) : undefined)} placeholder="Ex: 45" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Sexo</label>
                <select value={patientSex} onChange={e => setPatientSex(e.target.value as any)} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
                  <option value="male">Masculino</option>
                  <option value="female">Feminino</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">PA (mmHg)</label>
                <input type="text" value={vitalSigns.bloodPressure} onChange={e => setVitalSigns(v => ({ ...v, bloodPressure: e.target.value }))} placeholder="120/80" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
          </div>

          {/* Vital Signs */}
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">📊 Sinais Vitais</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Temperatura (°C)</label>
                <input type="number" step="0.1" value={vitalSigns.temperature || ''} onChange={e => setVitalSigns(v => ({ ...v, temperature: e.target.value ? parseFloat(e.target.value) : undefined }))} placeholder="36.5" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">FC (bpm)</label>
                <input type="number" value={vitalSigns.heartRate || ''} onChange={e => setVitalSigns(v => ({ ...v, heartRate: e.target.value ? parseInt(e.target.value) : undefined }))} placeholder="80" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">FR (irpm)</label>
                <input type="number" value={vitalSigns.respiratoryRate || ''} onChange={e => setVitalSigns(v => ({ ...v, respiratoryRate: e.target.value ? parseInt(e.target.value) : undefined }))} placeholder="16" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">SpO₂ (%)</label>
                <input type="number" value={vitalSigns.oxygenSaturation || ''} onChange={e => setVitalSigns(v => ({ ...v, oxygenSaturation: e.target.value ? parseInt(e.target.value) : undefined }))} placeholder="98" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              </div>
            </div>
          </div>

          {/* Symptoms */}
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">🤒 Sintomas ({symptoms.length} selecionados)</h3>
            <div className="flex gap-2 mb-4">
              <input type="text" value={customSymptom} onChange={e => setCustomSymptom(e.target.value)} onKeyDown={e => e.key === 'Enter' && addCustomSymptom()} placeholder="Adicionar sintoma personalizado..." className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              <button onClick={addCustomSymptom} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500">+ Adicionar</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map(s => (
                <button key={s} onClick={() => toggleSymptom(s)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${symptoms.includes(s) ? 'bg-blue-600 text-white ring-2 ring-blue-400' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {s}
                </button>
              ))}
            </div>
            {symptoms.filter(s => !COMMON_SYMPTOMS.includes(s)).length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-500 mb-2">Personalizados:</p>
                <div className="flex flex-wrap gap-2">
                  {symptoms.filter(s => !COMMON_SYMPTOMS.includes(s)).map(s => (
                    <button key={s} onClick={() => toggleSymptom(s)} className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-600 text-white ring-2 ring-purple-400">
                      {s} ✕
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Medical History & Labs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">📝 História Médica</h3>
              <textarea value={medicalHistory} onChange={e => setMedicalHistory(e.target.value)} placeholder="Comorbidades, cirurgias prévias, medicamentos em uso, alergias..." rows={4} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none" />
            </div>
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-semibold text-white mb-3">🧪 Exames Laboratoriais</h3>
              <textarea value={labResults} onChange={e => setLabResults(e.target.value)} placeholder="Hemograma, bioquímica, gasometria, culturas..." rows={4} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none" />
            </div>
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={diagnosisMutation.isPending || symptoms.length === 0} className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
            {diagnosisMutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                Analisando com Dr. Focus IA...
              </span>
            ) : '🔬 Gerar Diagnóstico Diferencial'}
          </button>
        </div>
      )}

      {activeTab === 'result' && result && (
        <div className="space-y-6">
          {/* Disclaimer */}
          <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">{result.disclaimer}</p>
          </div>

          {/* Urgency */}
          <div className={`rounded-xl p-4 ${getSeverityColor(result.urgency)}`}>
            <p className="font-bold text-lg">🚨 Urgência: {result.urgency}</p>
          </div>

          {/* Red Flags */}
          {result.redFlags?.length > 0 && (
            <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-red-400 mb-3">🚩 Sinais de Alarme (Red Flags)</h3>
              <ul className="space-y-2">
                {result.redFlags.map((flag: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-red-300">
                    <span className="text-red-500 mt-0.5">⚠️</span> {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Differentials */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-white">📋 Diagnósticos Diferenciais</h3>
            {result.differentials?.map((d: any, i: number) => (
              <div key={i} className="bg-gray-900 rounded-xl p-5 border border-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-white">{i + 1}. {d.diagnosis}</h4>
                    <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded">CID-10: {d.icd10}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold ${d.probability?.includes('Alta') || d.probability?.includes('High') ? 'bg-red-900/50 text-red-300' : d.probability?.includes('Moderada') || d.probability?.includes('Medium') ? 'bg-yellow-900/50 text-yellow-300' : 'bg-green-900/50 text-green-300'}`}>
                    {d.probability}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-xs text-green-400 font-semibold mb-1">✅ Critérios a favor:</p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {d.supportingCriteria?.map((c: string, j: number) => <li key={j}>• {c}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-red-400 font-semibold mb-1">❌ Critérios contra:</p>
                    <ul className="text-sm text-gray-300 space-y-1">
                      {d.againstCriteria?.map((c: string, j: number) => <li key={j}>• {c}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-blue-400 font-semibold mb-1">🧪 Exames recomendados:</p>
                  <div className="flex flex-wrap gap-1">
                    {d.recommendedExams?.map((e: string, j: number) => (
                      <span key={j} className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded">{e}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-700">
                  <p className="text-xs text-purple-400 font-semibold mb-1">💊 Conduta inicial:</p>
                  <p className="text-sm text-gray-300">{d.initialManagement}</p>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-gray-500">📚 Ref: {d.references?.join('; ')}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Suggested Workup */}
          {result.suggestedWorkup?.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">🔬 Propedêutica Sugerida</h3>
              <ul className="space-y-2">
                {result.suggestedWorkup.map((w: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-blue-400">→</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={() => setActiveTab('input')} className="w-full py-3 bg-gray-800 text-gray-300 rounded-xl hover:bg-gray-700 transition-all">
            ← Voltar e Editar Dados
          </button>
        </div>
      )}
    </div>
  );
}
