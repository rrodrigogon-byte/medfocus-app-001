import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';

type Calculator = 'glasgow' | 'sofa' | 'wells' | 'cha2ds2vasc' | 'childPugh' | 'meld' | 'apacheII';

const CALCULATORS: { id: Calculator; name: string; icon: string; desc: string }[] = [
  { id: 'glasgow', name: 'Glasgow (ECG)', icon: '🧠', desc: 'Escala de Coma de Glasgow' },
  { id: 'sofa', name: 'SOFA', icon: '🫁', desc: 'Sequential Organ Failure Assessment' },
  { id: 'wells', name: 'Wells (TEP)', icon: '🫀', desc: 'Critérios de Wells para TEP' },
  { id: 'cha2ds2vasc', name: 'CHA₂DS₂-VASc', icon: '💓', desc: 'Risco de AVC em FA' },
  { id: 'childPugh', name: 'Child-Pugh', icon: '🫘', desc: 'Classificação de cirrose hepática' },
  { id: 'meld', name: 'MELD/MELD-Na', icon: '🔬', desc: 'Prioridade para transplante hepático' },
  { id: 'apacheII', name: 'APACHE II', icon: '🏥', desc: 'Gravidade em UTI' },
];

export default function MedicalCalculators() {
  const [selected, setSelected] = useState<Calculator>('glasgow');
  const [result, setResult] = useState<any>(null);

  // Glasgow state
  const [gEye, setGEye] = useState(4);
  const [gVerbal, setGVerbal] = useState(5);
  const [gMotor, setGMotor] = useState(6);

  // SOFA state
  const [sofaPao2, setSofaPao2] = useState(400);
  const [sofaPlatelets, setSofaPlatelets] = useState(200);
  const [sofaBilirubin, setSofaBilirubin] = useState(0.8);
  const [sofaMap, setSofaMap] = useState(80);
  const [sofaCreatinine, setSofaCreatinine] = useState(0.9);
  const [sofaGlasgow, setSofaGlasgow] = useState(15);

  // Wells state
  const [wellsClinicalDVT, setWellsClinicalDVT] = useState(false);
  const [wellsAltDiag, setWellsAltDiag] = useState(false);
  const [wellsHR100, setWellsHR100] = useState(false);
  const [wellsImmob, setWellsImmob] = useState(false);
  const [wellsPrevDVT, setWellsPrevDVT] = useState(false);
  const [wellsHemoptysis, setWellsHemoptysis] = useState(false);
  const [wellsMalignancy, setWellsMalignancy] = useState(false);

  // CHA2DS2-VASc state
  const [chaCHF, setChaCHF] = useState(false);
  const [chaHTN, setChaHTN] = useState(false);
  const [chaAge75, setChaAge75] = useState(false);
  const [chaDM, setChaDM] = useState(false);
  const [chaStroke, setChaStroke] = useState(false);
  const [chaVasc, setChaVasc] = useState(false);
  const [chaAge65, setChaAge65] = useState(false);
  const [chaFemale, setChaFemale] = useState(false);

  // Child-Pugh state
  const [cpBilirubin, setCpBilirubin] = useState(1.5);
  const [cpAlbumin, setCpAlbumin] = useState(3.8);
  const [cpINR, setCpINR] = useState(1.2);
  const [cpAscites, setCpAscites] = useState<'none' | 'mild' | 'moderate_severe'>('none');
  const [cpEnceph, setCpEnceph] = useState<'none' | 'grade1_2' | 'grade3_4'>('none');

  // MELD state
  const [meldBil, setMeldBil] = useState(1.5);
  const [meldINR, setMeldINR] = useState(1.2);
  const [meldCr, setMeldCr] = useState(0.9);
  const [meldNa, setMeldNa] = useState<number | undefined>();

  const glasgowQ = trpc.calculators.glasgow.useQuery({ eye: gEye, verbal: gVerbal, motor: gMotor }, { enabled: false });
  const sofaQ = trpc.calculators.sofa.useQuery({ pao2fio2: sofaPao2, platelets: sofaPlatelets, bilirubin: sofaBilirubin, map: sofaMap, creatinine: sofaCreatinine, glasgow: sofaGlasgow }, { enabled: false });
  const wellsQ = trpc.calculators.wells.useQuery({ clinicalDVT: wellsClinicalDVT, alternativeDiagnosisLessLikely: wellsAltDiag, heartRate100: wellsHR100, immobilization: wellsImmob, previousDVTPE: wellsPrevDVT, hemoptysis: wellsHemoptysis, malignancy: wellsMalignancy }, { enabled: false });
  const chaQ = trpc.calculators.cha2ds2vasc.useQuery({ chf: chaCHF, hypertension: chaHTN, age75: chaAge75, diabetes: chaDM, stroke: chaStroke, vascular: chaVasc, age65: chaAge65, female: chaFemale }, { enabled: false });
  const cpQ = trpc.calculators.childPugh.useQuery({ bilirubin: cpBilirubin, albumin: cpAlbumin, inr: cpINR, ascites: cpAscites, encephalopathy: cpEnceph }, { enabled: false });
  const meldQ = trpc.calculators.meld.useQuery({ bilirubin: meldBil, inr: meldINR, creatinine: meldCr, sodium: meldNa }, { enabled: false });

  const calculate = async () => {
    let r: any;
    switch (selected) {
      case 'glasgow': r = await glasgowQ.refetch(); break;
      case 'sofa': r = await sofaQ.refetch(); break;
      case 'wells': r = await wellsQ.refetch(); break;
      case 'cha2ds2vasc': r = await chaQ.refetch(); break;
      case 'childPugh': r = await cpQ.refetch(); break;
      case 'meld': r = await meldQ.refetch(); break;
    }
    if (r?.data) setResult(r.data);
  };

  const NumberInput = ({ label, value, onChange, min, max, step }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number }) => (
    <div>
      <label className="text-sm text-gray-400 mb-1 block">{label}</label>
      <input type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} min={min} max={max} step={step || 1} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" />
    </div>
  );

  const CheckInput = ({ label, checked, onChange, points }: { label: string; checked: boolean; onChange: (v: boolean) => void; points?: string }) => (
    <label className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-pointer hover:bg-gray-750 transition-all">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="w-5 h-5 rounded accent-blue-500" />
      <span className="text-gray-300 flex-1">{label}</span>
      {points && <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-0.5 rounded">{points}</span>}
    </label>
  );

  const renderCalculator = () => {
    switch (selected) {
      case 'glasgow':
        return (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">👁️ Abertura Ocular (1-4)</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ v: 1, l: '1 - Nenhuma' }, { v: 2, l: '2 - À dor' }, { v: 3, l: '3 - Ao comando verbal' }, { v: 4, l: '4 - Espontânea' }].map(o => (
                  <button key={o.v} onClick={() => setGEye(o.v)} className={`p-2 rounded-lg text-sm ${gEye === o.v ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{o.l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">🗣️ Resposta Verbal (1-5)</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ v: 1, l: '1 - Nenhuma' }, { v: 2, l: '2 - Sons incompreensíveis' }, { v: 3, l: '3 - Palavras inapropriadas' }, { v: 4, l: '4 - Confusa' }, { v: 5, l: '5 - Orientada' }].map(o => (
                  <button key={o.v} onClick={() => setGVerbal(o.v)} className={`p-2 rounded-lg text-sm ${gVerbal === o.v ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{o.l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">💪 Resposta Motora (1-6)</label>
              <div className="grid grid-cols-2 gap-2">
                {[{ v: 1, l: '1 - Nenhuma' }, { v: 2, l: '2 - Extensão anormal' }, { v: 3, l: '3 - Flexão anormal' }, { v: 4, l: '4 - Retirada à dor' }, { v: 5, l: '5 - Localiza dor' }, { v: 6, l: '6 - Obedece comandos' }].map(o => (
                  <button key={o.v} onClick={() => setGMotor(o.v)} className={`p-2 rounded-lg text-sm ${gMotor === o.v ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{o.l}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'sofa':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <NumberInput label="PaO₂/FiO₂" value={sofaPao2} onChange={setSofaPao2} min={0} max={600} />
            <NumberInput label="Plaquetas (×10³/µL)" value={sofaPlatelets} onChange={setSofaPlatelets} min={0} max={500} />
            <NumberInput label="Bilirrubina (mg/dL)" value={sofaBilirubin} onChange={setSofaBilirubin} min={0} max={30} step={0.1} />
            <NumberInput label="PAM (mmHg)" value={sofaMap} onChange={setSofaMap} min={0} max={200} />
            <NumberInput label="Creatinina (mg/dL)" value={sofaCreatinine} onChange={setSofaCreatinine} min={0} max={15} step={0.1} />
            <NumberInput label="Glasgow" value={sofaGlasgow} onChange={setSofaGlasgow} min={3} max={15} />
          </div>
        );
      case 'wells':
        return (
          <div className="space-y-2">
            <CheckInput label="Sinais clínicos de TVP" checked={wellsClinicalDVT} onChange={setWellsClinicalDVT} points="+3" />
            <CheckInput label="Diagnóstico alternativo menos provável que TEP" checked={wellsAltDiag} onChange={setWellsAltDiag} points="+3" />
            <CheckInput label="FC > 100 bpm" checked={wellsHR100} onChange={setWellsHR100} points="+1.5" />
            <CheckInput label="Imobilização ou cirurgia nas últimas 4 semanas" checked={wellsImmob} onChange={setWellsImmob} points="+1.5" />
            <CheckInput label="TVP/TEP prévio" checked={wellsPrevDVT} onChange={setWellsPrevDVT} points="+1.5" />
            <CheckInput label="Hemoptise" checked={wellsHemoptysis} onChange={setWellsHemoptysis} points="+1" />
            <CheckInput label="Neoplasia ativa" checked={wellsMalignancy} onChange={setWellsMalignancy} points="+1" />
          </div>
        );
      case 'cha2ds2vasc':
        return (
          <div className="space-y-2">
            <CheckInput label="Insuficiência Cardíaca (C)" checked={chaCHF} onChange={setChaCHF} points="+1" />
            <CheckInput label="Hipertensão (H)" checked={chaHTN} onChange={setChaHTN} points="+1" />
            <CheckInput label="Idade ≥ 75 anos (A₂)" checked={chaAge75} onChange={setChaAge75} points="+2" />
            <CheckInput label="Diabetes (D)" checked={chaDM} onChange={setChaDM} points="+1" />
            <CheckInput label="AVC/AIT prévio (S₂)" checked={chaStroke} onChange={setChaStroke} points="+2" />
            <CheckInput label="Doença vascular (V)" checked={chaVasc} onChange={setChaVasc} points="+1" />
            <CheckInput label="Idade 65-74 anos (A)" checked={chaAge65} onChange={setChaAge65} points="+1" />
            <CheckInput label="Sexo feminino (Sc)" checked={chaFemale} onChange={setChaFemale} points="+1" />
          </div>
        );
      case 'childPugh':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <NumberInput label="Bilirrubina (mg/dL)" value={cpBilirubin} onChange={setCpBilirubin} step={0.1} />
              <NumberInput label="Albumina (g/dL)" value={cpAlbumin} onChange={setCpAlbumin} step={0.1} />
              <NumberInput label="INR" value={cpINR} onChange={setCpINR} step={0.1} />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Ascite</label>
              <div className="grid grid-cols-3 gap-2">
                {[{ v: 'none', l: 'Ausente' }, { v: 'mild', l: 'Leve' }, { v: 'moderate_severe', l: 'Moderada/Grave' }].map(o => (
                  <button key={o.v} onClick={() => setCpAscites(o.v as any)} className={`p-2 rounded-lg text-sm ${cpAscites === o.v ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{o.l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Encefalopatia</label>
              <div className="grid grid-cols-3 gap-2">
                {[{ v: 'none', l: 'Ausente' }, { v: 'grade1_2', l: 'Grau I-II' }, { v: 'grade3_4', l: 'Grau III-IV' }].map(o => (
                  <button key={o.v} onClick={() => setCpEnceph(o.v as any)} className={`p-2 rounded-lg text-sm ${cpEnceph === o.v ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{o.l}</button>
                ))}
              </div>
            </div>
          </div>
        );
      case 'meld':
        return (
          <div className="grid grid-cols-2 gap-4">
            <NumberInput label="Bilirrubina (mg/dL)" value={meldBil} onChange={setMeldBil} step={0.1} />
            <NumberInput label="INR" value={meldINR} onChange={setMeldINR} step={0.1} />
            <NumberInput label="Creatinina (mg/dL)" value={meldCr} onChange={setMeldCr} step={0.1} />
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Sódio (mEq/L) — opcional para MELD-Na</label>
              <input type="number" value={meldNa || ''} onChange={e => setMeldNa(e.target.value ? parseFloat(e.target.value) : undefined)} placeholder="135" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" />
            </div>
          </div>
        );
      default:
        return <p className="text-gray-400">Selecione uma calculadora.</p>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-2xl p-6 border border-emerald-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-2xl">🧮</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Calculadoras Médicas</h2>
            <p className="text-emerald-300 text-sm">Scores e escalas clínicas validadas cientificamente</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {CALCULATORS.map(c => (
          <button key={c.id} onClick={() => { setSelected(c.id); setResult(null); }} className={`p-3 rounded-xl text-center transition-all ${selected === c.id ? 'bg-emerald-600 text-white ring-2 ring-emerald-400' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-700'}`}>
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className="text-xs font-bold">{c.name}</div>
          </button>
        ))}
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-1">{CALCULATORS.find(c => c.id === selected)?.icon} {CALCULATORS.find(c => c.id === selected)?.name}</h3>
        <p className="text-sm text-gray-400 mb-4">{CALCULATORS.find(c => c.id === selected)?.desc}</p>
        {renderCalculator()}
        <button onClick={calculate} className="w-full mt-4 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-500 transition-all">
          Calcular
        </button>
      </div>

      {result && (
        <div className={`rounded-xl p-6 border ${result.score <= (result.details?.max || 15) * 0.3 ? 'bg-green-900/20 border-green-700/50' : result.score <= (result.details?.max || 15) * 0.6 ? 'bg-yellow-900/20 border-yellow-700/50' : 'bg-red-900/20 border-red-700/50'}`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-white">{result.name}</h3>
            <div className="text-4xl font-black text-white">{result.score}</div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
            <div className={`h-3 rounded-full transition-all ${result.score <= (result.details?.max || 15) * 0.3 ? 'bg-green-500' : result.score <= (result.details?.max || 15) * 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (result.score / (result.details?.max || 15)) * 100)}%` }} />
          </div>
          <p className="text-lg font-medium text-gray-200">{result.interpretation}</p>
        </div>
      )}
    </div>
  );
}
