import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';
import EducationalDisclaimer from './EducationalDisclaimer';

type Calculator = 'glasgow' | 'sofa' | 'wells' | 'cha2ds2vasc' | 'childPugh' | 'meld' | 'apacheII'
  | 'curb65' | 'heart' | 'perc' | 'news2' | 'qsofa' | 'hasbled' | 'grace' | 'nihss';

const CALCULATORS: { id: Calculator; name: string; icon: string; desc: string; category: string }[] = [
  // Emergência & Triagem
  { id: 'glasgow', name: 'Glasgow (ECG)', icon: '🧠', desc: 'Escala de Coma de Glasgow', category: 'Neurologia' },
  { id: 'nihss', name: 'NIHSS', icon: '🧠', desc: 'NIH Stroke Scale — Gravidade do AVC', category: 'Neurologia' },
  { id: 'news2', name: 'NEWS-2', icon: '📊', desc: 'National Early Warning Score 2', category: 'Triagem' },
  { id: 'qsofa', name: 'qSOFA', icon: '🦠', desc: 'Quick SOFA — Triagem de sepse', category: 'Sepse' },
  { id: 'sofa', name: 'SOFA', icon: '🫁', desc: 'Sequential Organ Failure Assessment', category: 'Sepse' },
  { id: 'apacheII', name: 'APACHE II', icon: '🏥', desc: 'Gravidade em UTI', category: 'UTI' },
  // Cardiologia
  { id: 'heart', name: 'HEART Score', icon: '❤️', desc: 'Risco de MACE em dor torácica', category: 'Cardiologia' },
  { id: 'grace', name: 'GRACE', icon: '💔', desc: 'Risco em SCA — Síndrome Coronariana Aguda', category: 'Cardiologia' },
  { id: 'cha2ds2vasc', name: 'CHA₂DS₂-VASc', icon: '💓', desc: 'Risco de AVC em FA', category: 'Cardiologia' },
  { id: 'hasbled', name: 'HAS-BLED', icon: '🩸', desc: 'Risco de sangramento em FA', category: 'Cardiologia' },
  // Pneumologia
  { id: 'wells', name: 'Wells (TEP)', icon: '🫀', desc: 'Critérios de Wells para TEP', category: 'Pneumologia' },
  { id: 'perc', name: 'PERC Rule', icon: '🫁', desc: 'Exclusão de TEP sem D-dímero', category: 'Pneumologia' },
  { id: 'curb65', name: 'CURB-65', icon: '🤒', desc: 'Gravidade de pneumonia comunitária', category: 'Pneumologia' },
  // Hepatologia
  { id: 'childPugh', name: 'Child-Pugh', icon: '🫘', desc: 'Classificação de cirrose hepática', category: 'Hepatologia' },
  { id: 'meld', name: 'MELD/MELD-Na', icon: '🔬', desc: 'Prioridade para transplante hepático', category: 'Hepatologia' },
];

export default function MedicalCalculators() {
  const [selected, setSelected] = useState<Calculator>('glasgow');
  const [result, setResult] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');

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

  // CURB-65 state
  const [curbConfusion, setCurbConfusion] = useState(false);
  const [curbUrea, setCurbUrea] = useState(5.0);
  const [curbRR, setCurbRR] = useState(18);
  const [curbSBP, setCurbSBP] = useState(120);
  const [curbDBP, setCurbDBP] = useState(80);
  const [curbAge, setCurbAge] = useState(50);

  // HEART Score state
  const [heartHistory, setHeartHistory] = useState<0 | 1 | 2>(0);
  const [heartEcg, setHeartEcg] = useState<0 | 1 | 2>(0);
  const [heartAge, setHeartAge] = useState<0 | 1 | 2>(0);
  const [heartRisk, setHeartRisk] = useState<0 | 1 | 2>(0);
  const [heartTroponin, setHeartTroponin] = useState<0 | 1 | 2>(0);

  // PERC state
  const [percAge50, setPercAge50] = useState(false);
  const [percHR100, setPercHR100] = useState(false);
  const [percSpO2, setPercSpO2] = useState(false);
  const [percLegSwelling, setPercLegSwelling] = useState(false);
  const [percHemoptysis, setPercHemoptysis] = useState(false);
  const [percSurgery, setPercSurgery] = useState(false);
  const [percPriorDVT, setPercPriorDVT] = useState(false);
  const [percEstrogen, setPercEstrogen] = useState(false);

  // NEWS-2 state
  const [newsRR, setNewsRR] = useState(16);
  const [newsSpO2, setNewsSpO2] = useState(97);
  const [newsO2, setNewsO2] = useState(false);
  const [newsTemp, setNewsTemp] = useState(37.0);
  const [newsSBP, setNewsSBP] = useState(120);
  const [newsHR, setNewsHR] = useState(75);
  const [newsConsc, setNewsConsc] = useState<'alert' | 'confusion' | 'voice' | 'pain' | 'unresponsive'>('alert');

  // qSOFA state
  const [qsofaMentation, setQsofaMentation] = useState(false);
  const [qsofaRR, setQsofaRR] = useState(18);
  const [qsofaSBP, setQsofaSBP] = useState(120);

  // HAS-BLED state
  const [hbHTN, setHbHTN] = useState(false);
  const [hbRenal, setHbRenal] = useState(false);
  const [hbLiver, setHbLiver] = useState(false);
  const [hbStroke, setHbStroke] = useState(false);
  const [hbBleeding, setHbBleeding] = useState(false);
  const [hbINR, setHbINR] = useState(false);
  const [hbElderly, setHbElderly] = useState(false);
  const [hbDrugs, setHbDrugs] = useState(false);
  const [hbAlcohol, setHbAlcohol] = useState(false);

  // GRACE state
  const [graceAge, setGraceAge] = useState(60);
  const [graceHR, setGraceHR] = useState(80);
  const [graceSBP, setGraceSBP] = useState(130);
  const [graceCr, setGraceCr] = useState(1.0);
  const [graceKillip, setGraceKillip] = useState<1 | 2 | 3 | 4>(1);
  const [graceArrest, setGraceArrest] = useState(false);
  const [graceST, setGraceST] = useState(false);
  const [graceBiomarkers, setGraceBiomarkers] = useState(false);

  // NIHSS state
  const [nihssConsc, setNihssConsc] = useState<0 | 1 | 2 | 3>(0);
  const [nihssQuestions, setNihssQuestions] = useState<0 | 1 | 2>(0);
  const [nihssCommands, setNihssCommands] = useState<0 | 1 | 2>(0);
  const [nihssGaze, setNihssGaze] = useState<0 | 1 | 2>(0);
  const [nihssVisual, setNihssVisual] = useState<0 | 1 | 2 | 3>(0);
  const [nihssFacial, setNihssFacial] = useState<0 | 1 | 2 | 3>(0);
  const [nihssArmL, setNihssArmL] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [nihssArmR, setNihssArmR] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [nihssLegL, setNihssLegL] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [nihssLegR, setNihssLegR] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [nihssAtaxia, setNihssAtaxia] = useState<0 | 1 | 2>(0);
  const [nihssSensory, setNihssSensory] = useState<0 | 1 | 2>(0);
  const [nihssLanguage, setNihssLanguage] = useState<0 | 1 | 2 | 3>(0);
  const [nihssDysarthria, setNihssDysarthria] = useState<0 | 1 | 2>(0);
  const [nihssExtinction, setNihssExtinction] = useState<0 | 1 | 2>(0);

  // tRPC queries
  const glasgowQ = trpc.calculators.glasgow.useQuery({ eye: gEye, verbal: gVerbal, motor: gMotor }, { enabled: false });
  const sofaQ = trpc.calculators.sofa.useQuery({ pao2fio2: sofaPao2, platelets: sofaPlatelets, bilirubin: sofaBilirubin, map: sofaMap, creatinine: sofaCreatinine, glasgow: sofaGlasgow }, { enabled: false });
  const wellsQ = trpc.calculators.wells.useQuery({ clinicalDVT: wellsClinicalDVT, alternativeDiagnosisLessLikely: wellsAltDiag, heartRate100: wellsHR100, immobilization: wellsImmob, previousDVTPE: wellsPrevDVT, hemoptysis: wellsHemoptysis, malignancy: wellsMalignancy }, { enabled: false });
  const chaQ = trpc.calculators.cha2ds2vasc.useQuery({ chf: chaCHF, hypertension: chaHTN, age75: chaAge75, diabetes: chaDM, stroke: chaStroke, vascular: chaVasc, age65: chaAge65, female: chaFemale }, { enabled: false });
  const cpQ = trpc.calculators.childPugh.useQuery({ bilirubin: cpBilirubin, albumin: cpAlbumin, inr: cpINR, ascites: cpAscites, encephalopathy: cpEnceph }, { enabled: false });
  const meldQ = trpc.calculators.meld.useQuery({ bilirubin: meldBil, inr: meldINR, creatinine: meldCr, sodium: meldNa }, { enabled: false });
  const curb65Q = trpc.calculators.curb65.useQuery({ confusion: curbConfusion, urea: curbUrea, respiratoryRate: curbRR, systolicBP: curbSBP, diastolicBP: curbDBP, age: curbAge }, { enabled: false });
  const heartQ = trpc.calculators.heart.useQuery({ history: heartHistory, ecg: heartEcg, age: heartAge, riskFactors: heartRisk, troponin: heartTroponin }, { enabled: false });
  const percQ = trpc.calculators.perc.useQuery({ age50: percAge50, hr100: percHR100, spo2_95: percSpO2, unilateralLegSwelling: percLegSwelling, hemoptysis: percHemoptysis, recentSurgery: percSurgery, priorDVTPE: percPriorDVT, estrogenUse: percEstrogen }, { enabled: false });
  const news2Q = trpc.calculators.news2.useQuery({ respiratoryRate: newsRR, spo2: newsSpO2, onSupplementalO2: newsO2, temperature: newsTemp, systolicBP: newsSBP, heartRate: newsHR, consciousness: newsConsc }, { enabled: false });
  const qsofaQ = trpc.calculators.qsofa.useQuery({ alteredMentation: qsofaMentation, respiratoryRate: qsofaRR, systolicBP: qsofaSBP }, { enabled: false });
  const hasBledQ = trpc.calculators.hasbled.useQuery({ hypertension: hbHTN, abnormalRenal: hbRenal, abnormalLiver: hbLiver, stroke: hbStroke, bleeding: hbBleeding, labileINR: hbINR, elderly: hbElderly, drugs: hbDrugs, alcohol: hbAlcohol }, { enabled: false });
  const graceQ = trpc.calculators.grace.useQuery({ age: graceAge, heartRate: graceHR, systolicBP: graceSBP, creatinine: graceCr, killipClass: graceKillip, cardiacArrest: graceArrest, stDeviation: graceST, elevatedBiomarkers: graceBiomarkers }, { enabled: false });
  const nihssQ = trpc.calculators.nihss.useQuery({ consciousness: nihssConsc, questions: nihssQuestions, commands: nihssCommands, gaze: nihssGaze, visual: nihssVisual, facialPalsy: nihssFacial, motorArmLeft: nihssArmL, motorArmRight: nihssArmR, motorLegLeft: nihssLegL, motorLegRight: nihssLegR, ataxia: nihssAtaxia, sensory: nihssSensory, language: nihssLanguage, dysarthria: nihssDysarthria, extinction: nihssExtinction }, { enabled: false });

  const calculate = async () => {
    let r: any;
    switch (selected) {
      case 'glasgow': r = await glasgowQ.refetch(); break;
      case 'sofa': r = await sofaQ.refetch(); break;
      case 'wells': r = await wellsQ.refetch(); break;
      case 'cha2ds2vasc': r = await chaQ.refetch(); break;
      case 'childPugh': r = await cpQ.refetch(); break;
      case 'meld': r = await meldQ.refetch(); break;
      case 'curb65': r = await curb65Q.refetch(); break;
      case 'heart': r = await heartQ.refetch(); break;
      case 'perc': r = await percQ.refetch(); break;
      case 'news2': r = await news2Q.refetch(); break;
      case 'qsofa': r = await qsofaQ.refetch(); break;
      case 'hasbled': r = await hasBledQ.refetch(); break;
      case 'grace': r = await graceQ.refetch(); break;
      case 'nihss': r = await nihssQ.refetch(); break;
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

  const ScoreSelector = ({ label, value, onChange, options }: { label: string; value: number; onChange: (v: any) => void; options: { v: number; l: string }[] }) => (
    <div>
      <label className="text-sm text-gray-400 mb-2 block">{label}</label>
      <div className="grid grid-cols-1 gap-1">
        {options.map(o => (
          <button key={o.v} onClick={() => onChange(o.v)} className={`p-2 rounded-lg text-sm text-left ${value === o.v ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-750'}`}>{o.l}</button>
        ))}
      </div>
    </div>
  );

  const categories = ['Todos', ...Array.from(new Set(CALCULATORS.map(c => c.category)))];
  const filteredCalcs = categoryFilter === 'Todos' ? CALCULATORS : CALCULATORS.filter(c => c.category === categoryFilter);

  const renderCalculator = () => {
    switch (selected) {
      case 'glasgow':
        return (
          <div className="space-y-4">
      <EducationalDisclaimer variant="banner" moduleName="Calculadoras Médicas" />
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

      // ─── NEW CALCULATORS ────────────────────────────────────────

      case 'curb65':
        return (
          <div className="space-y-4">
            <CheckInput label="Confusão mental (AMTS ≤ 8)" checked={curbConfusion} onChange={setCurbConfusion} points="+1" />
            <div className="grid grid-cols-2 gap-4">
              <NumberInput label="Ureia (mmol/L)" value={curbUrea} onChange={setCurbUrea} min={0} max={50} step={0.1} />
              <NumberInput label="Frequência Respiratória" value={curbRR} onChange={setCurbRR} min={0} max={60} />
              <NumberInput label="PA Sistólica (mmHg)" value={curbSBP} onChange={setCurbSBP} min={0} max={300} />
              <NumberInput label="PA Diastólica (mmHg)" value={curbDBP} onChange={setCurbDBP} min={0} max={200} />
              <NumberInput label="Idade (anos)" value={curbAge} onChange={setCurbAge} min={0} max={120} />
            </div>
            <div className="text-xs text-gray-500 p-3 bg-gray-800/50 rounded-lg">
              <strong>Critérios:</strong> C = Confusão | U = Ureia &gt; 7 mmol/L | R = FR ≥ 30 | B = PAS &lt; 90 ou PAD ≤ 60 | 65 = Idade ≥ 65
              <br /><strong>Ref:</strong> Lim WS et al. Thorax. 2003;58(5):377-382
            </div>
          </div>
        );

      case 'heart':
        return (
          <div className="space-y-4">
            <ScoreSelector label="📋 História (H)" value={heartHistory} onChange={setHeartHistory} options={[
              { v: 0, l: '0 — Levemente suspeita' },
              { v: 1, l: '1 — Moderadamente suspeita' },
              { v: 2, l: '2 — Altamente suspeita' },
            ]} />
            <ScoreSelector label="📈 ECG (E)" value={heartEcg} onChange={setHeartEcg} options={[
              { v: 0, l: '0 — Normal' },
              { v: 1, l: '1 — Alterações inespecíficas' },
              { v: 2, l: '2 — Desvio ST significativo' },
            ]} />
            <ScoreSelector label="🎂 Idade (A)" value={heartAge} onChange={setHeartAge} options={[
              { v: 0, l: '0 — < 45 anos' },
              { v: 1, l: '1 — 45-64 anos' },
              { v: 2, l: '2 — ≥ 65 anos' },
            ]} />
            <ScoreSelector label="⚠️ Fatores de Risco (R)" value={heartRisk} onChange={setHeartRisk} options={[
              { v: 0, l: '0 — Nenhum fator conhecido' },
              { v: 1, l: '1 — 1-2 fatores (HAS, DM, tabagismo, obesidade, DLP, HF)' },
              { v: 2, l: '2 — ≥ 3 fatores ou DAC/AVC/DAP prévio' },
            ]} />
            <ScoreSelector label="🔬 Troponina (T)" value={heartTroponin} onChange={setHeartTroponin} options={[
              { v: 0, l: '0 — Normal' },
              { v: 1, l: '1 — 1-3x limite superior' },
              { v: 2, l: '2 — > 3x limite superior' },
            ]} />
            <div className="text-xs text-gray-500 p-3 bg-gray-800/50 rounded-lg">
              <strong>Ref:</strong> Six AJ et al. Neth Heart J. 2008;16(6):191-196. Backus BE et al. Int J Cardiol. 2013;168(3):2153-2158
            </div>
          </div>
        );

      case 'perc':
        return (
          <div className="space-y-2">
            <div className="text-sm text-yellow-400 bg-yellow-900/20 p-3 rounded-lg mb-3">
              Aplicar apenas se probabilidade pré-teste de TEP for BAIXA (&lt; 15%). Se todos negativos, TEP pode ser excluído sem D-dímero.
            </div>
            <CheckInput label="Idade ≥ 50 anos" checked={percAge50} onChange={setPercAge50} />
            <CheckInput label="FC ≥ 100 bpm" checked={percHR100} onChange={setPercHR100} />
            <CheckInput label="SpO₂ < 95% em ar ambiente" checked={percSpO2} onChange={setPercSpO2} />
            <CheckInput label="Edema unilateral de membro inferior" checked={percLegSwelling} onChange={setPercLegSwelling} />
            <CheckInput label="Hemoptise" checked={percHemoptysis} onChange={setPercHemoptysis} />
            <CheckInput label="Cirurgia ou trauma nas últimas 4 semanas" checked={percSurgery} onChange={setPercSurgery} />
            <CheckInput label="TVP ou TEP prévio" checked={percPriorDVT} onChange={setPercPriorDVT} />
            <CheckInput label="Uso de estrogênio (ACO, TRH)" checked={percEstrogen} onChange={setPercEstrogen} />
            <div className="text-xs text-gray-500 p-3 bg-gray-800/50 rounded-lg">
              <strong>Ref:</strong> Kline JA et al. J Thromb Haemost. 2008;6(5):772-780
            </div>
          </div>
        );

      case 'news2':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <NumberInput label="Frequência Respiratória" value={newsRR} onChange={setNewsRR} min={0} max={60} />
              <NumberInput label="SpO₂ (%)" value={newsSpO2} onChange={setNewsSpO2} min={50} max={100} />
              <NumberInput label="Temperatura (°C)" value={newsTemp} onChange={setNewsTemp} min={30} max={42} step={0.1} />
              <NumberInput label="PA Sistólica (mmHg)" value={newsSBP} onChange={setNewsSBP} min={0} max={300} />
              <NumberInput label="FC (bpm)" value={newsHR} onChange={setNewsHR} min={0} max={250} />
            </div>
            <CheckInput label="Em uso de O₂ suplementar" checked={newsO2} onChange={setNewsO2} points="+2" />
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Nível de Consciência (ACVPU)</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {([
                  { v: 'alert', l: 'Alerta (A)' },
                  { v: 'confusion', l: 'Confusão nova (C)' },
                  { v: 'voice', l: 'Responde à voz (V)' },
                  { v: 'pain', l: 'Responde à dor (P)' },
                  { v: 'unresponsive', l: 'Não responde (U)' },
                ] as const).map(o => (
                  <button key={o.v} onClick={() => setNewsConsc(o.v)} className={`p-2 rounded-lg text-sm ${newsConsc === o.v ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{o.l}</button>
                ))}
              </div>
            </div>
            <div className="text-xs text-gray-500 p-3 bg-gray-800/50 rounded-lg">
              <strong>Ref:</strong> Royal College of Physicians. National Early Warning Score (NEWS) 2. 2017
            </div>
          </div>
        );

      case 'qsofa':
        return (
          <div className="space-y-4">
            <div className="text-sm text-blue-400 bg-blue-900/20 p-3 rounded-lg mb-3">
              Triagem rápida à beira-leito para identificar pacientes com suspeita de infecção com risco de desfecho desfavorável. ≥ 2 pontos = alto risco.
            </div>
            <CheckInput label="Alteração do nível de consciência (Glasgow < 15)" checked={qsofaMentation} onChange={setQsofaMentation} points="+1" />
            <div className="grid grid-cols-2 gap-4">
              <NumberInput label="Frequência Respiratória" value={qsofaRR} onChange={setQsofaRR} min={0} max={60} />
              <NumberInput label="PA Sistólica (mmHg)" value={qsofaSBP} onChange={setQsofaSBP} min={0} max={300} />
            </div>
            <div className="text-xs text-gray-500 p-3 bg-gray-800/50 rounded-lg">
              <strong>Critérios:</strong> FR ≥ 22 (+1) | PAS ≤ 100 (+1) | Alteração mental (+1)
              <br /><strong>Ref:</strong> Seymour CW et al. JAMA. 2016;315(8):762-774
            </div>
          </div>
        );

      case 'hasbled':
        return (
          <div className="space-y-2">
            <div className="text-sm text-orange-400 bg-orange-900/20 p-3 rounded-lg mb-3">
              Avalia risco de sangramento em pacientes com FA em uso de anticoagulação. Score ≥ 3 = alto risco — não contraindica anticoagulação, mas requer vigilância.
            </div>
            <CheckInput label="Hipertensão (PAS > 160 mmHg)" checked={hbHTN} onChange={setHbHTN} points="+1" />
            <CheckInput label="Função renal anormal (diálise, transplante, Cr > 2.26)" checked={hbRenal} onChange={setHbRenal} points="+1" />
            <CheckInput label="Função hepática anormal (cirrose, Bil > 2x, AST/ALT > 3x)" checked={hbLiver} onChange={setHbLiver} points="+1" />
            <CheckInput label="AVC prévio" checked={hbStroke} onChange={setHbStroke} points="+1" />
            <CheckInput label="Sangramento prévio ou predisposição" checked={hbBleeding} onChange={setHbBleeding} points="+1" />
            <CheckInput label="INR lábil (TTR < 60%)" checked={hbINR} onChange={setHbINR} points="+1" />
            <CheckInput label="Idade > 65 anos" checked={hbElderly} onChange={setHbElderly} points="+1" />
            <CheckInput label="Uso de antiplaquetários ou AINEs" checked={hbDrugs} onChange={setHbDrugs} points="+1" />
            <CheckInput label="Uso abusivo de álcool" checked={hbAlcohol} onChange={setHbAlcohol} points="+1" />
            <div className="text-xs text-gray-500 p-3 bg-gray-800/50 rounded-lg">
              <strong>Ref:</strong> Pisters R et al. Chest. 2010;138(5):1093-1100
            </div>
          </div>
        );

      case 'grace':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <NumberInput label="Idade (anos)" value={graceAge} onChange={setGraceAge} min={0} max={120} />
              <NumberInput label="FC (bpm)" value={graceHR} onChange={setGraceHR} min={0} max={250} />
              <NumberInput label="PA Sistólica (mmHg)" value={graceSBP} onChange={setGraceSBP} min={0} max={300} />
              <NumberInput label="Creatinina (mg/dL)" value={graceCr} onChange={setGraceCr} min={0} max={15} step={0.1} />
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Classe de Killip</label>
              <div className="grid grid-cols-4 gap-2">
                {([
                  { v: 1, l: 'I — Sem IC' },
                  { v: 2, l: 'II — Estertores/B3' },
                  { v: 3, l: 'III — Edema pulmonar' },
                  { v: 4, l: 'IV — Choque cardiogênico' },
                ] as const).map(o => (
                  <button key={o.v} onClick={() => setGraceKillip(o.v as 1|2|3|4)} className={`p-2 rounded-lg text-xs ${graceKillip === o.v ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{o.l}</button>
                ))}
              </div>
            </div>
            <CheckInput label="PCR na admissão" checked={graceArrest} onChange={setGraceArrest} />
            <CheckInput label="Desvio do segmento ST" checked={graceST} onChange={setGraceST} />
            <CheckInput label="Biomarcadores cardíacos elevados (troponina)" checked={graceBiomarkers} onChange={setGraceBiomarkers} />
            <div className="text-xs text-gray-500 p-3 bg-gray-800/50 rounded-lg">
              <strong>Ref:</strong> Fox KAA et al. BMJ. 2006;333(7578):1091. Granger CB et al. Arch Intern Med. 2003;163(19):2345-2353
            </div>
          </div>
        );

      case 'nihss':
        return (
          <div className="space-y-4">
            <div className="text-sm text-purple-400 bg-purple-900/20 p-3 rounded-lg mb-3">
              Escala padronizada para quantificar déficit neurológico no AVC agudo. Fundamental para decisão de trombólise e trombectomia.
            </div>
            <ScoreSelector label="1a. Nível de Consciência" value={nihssConsc} onChange={setNihssConsc} options={[
              { v: 0, l: '0 — Alerta' }, { v: 1, l: '1 — Não alerta, mas desperta com estímulo mínimo' },
              { v: 2, l: '2 — Não alerta, requer estímulo repetido' }, { v: 3, l: '3 — Coma/não responsivo' },
            ]} />
            <ScoreSelector label="1b. Perguntas (mês e idade)" value={nihssQuestions} onChange={setNihssQuestions} options={[
              { v: 0, l: '0 — Ambas corretas' }, { v: 1, l: '1 — Uma correta' }, { v: 2, l: '2 — Nenhuma correta' },
            ]} />
            <ScoreSelector label="1c. Comandos (abrir/fechar olhos, apertar mão)" value={nihssCommands} onChange={setNihssCommands} options={[
              { v: 0, l: '0 — Ambos corretos' }, { v: 1, l: '1 — Um correto' }, { v: 2, l: '2 — Nenhum correto' },
            ]} />
            <ScoreSelector label="2. Olhar conjugado" value={nihssGaze} onChange={setNihssGaze} options={[
              { v: 0, l: '0 — Normal' }, { v: 1, l: '1 — Paralisia parcial do olhar' }, { v: 2, l: '2 — Desvio forçado' },
            ]} />
            <ScoreSelector label="3. Campo visual" value={nihssVisual} onChange={setNihssVisual} options={[
              { v: 0, l: '0 — Sem perda' }, { v: 1, l: '1 — Hemianopsia parcial' },
              { v: 2, l: '2 — Hemianopsia completa' }, { v: 3, l: '3 — Cegueira bilateral' },
            ]} />
            <ScoreSelector label="4. Paralisia facial" value={nihssFacial} onChange={setNihssFacial} options={[
              { v: 0, l: '0 — Normal' }, { v: 1, l: '1 — Paralisia menor' },
              { v: 2, l: '2 — Paralisia parcial (inferior)' }, { v: 3, l: '3 — Paralisia completa' },
            ]} />
            <div className="grid grid-cols-2 gap-4">
              <ScoreSelector label="5a. Motor — Braço Esquerdo" value={nihssArmL} onChange={setNihssArmL} options={[
                { v: 0, l: '0 — Sem queda' }, { v: 1, l: '1 — Queda parcial' },
                { v: 2, l: '2 — Algum esforço contra gravidade' }, { v: 3, l: '3 — Sem esforço contra gravidade' }, { v: 4, l: '4 — Sem movimento' },
              ]} />
              <ScoreSelector label="5b. Motor — Braço Direito" value={nihssArmR} onChange={setNihssArmR} options={[
                { v: 0, l: '0 — Sem queda' }, { v: 1, l: '1 — Queda parcial' },
                { v: 2, l: '2 — Algum esforço contra gravidade' }, { v: 3, l: '3 — Sem esforço contra gravidade' }, { v: 4, l: '4 — Sem movimento' },
              ]} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ScoreSelector label="6a. Motor — Perna Esquerda" value={nihssLegL} onChange={setNihssLegL} options={[
                { v: 0, l: '0 — Sem queda' }, { v: 1, l: '1 — Queda parcial' },
                { v: 2, l: '2 — Algum esforço contra gravidade' }, { v: 3, l: '3 — Sem esforço contra gravidade' }, { v: 4, l: '4 — Sem movimento' },
              ]} />
              <ScoreSelector label="6b. Motor — Perna Direita" value={nihssLegR} onChange={setNihssLegR} options={[
                { v: 0, l: '0 — Sem queda' }, { v: 1, l: '1 — Queda parcial' },
                { v: 2, l: '2 — Algum esforço contra gravidade' }, { v: 3, l: '3 — Sem esforço contra gravidade' }, { v: 4, l: '4 — Sem movimento' },
              ]} />
            </div>
            <ScoreSelector label="7. Ataxia de membros" value={nihssAtaxia} onChange={setNihssAtaxia} options={[
              { v: 0, l: '0 — Ausente' }, { v: 1, l: '1 — Em um membro' }, { v: 2, l: '2 — Em dois membros' },
            ]} />
            <ScoreSelector label="8. Sensibilidade" value={nihssSensory} onChange={setNihssSensory} options={[
              { v: 0, l: '0 — Normal' }, { v: 1, l: '1 — Perda leve a moderada' }, { v: 2, l: '2 — Perda grave ou total' },
            ]} />
            <ScoreSelector label="9. Linguagem" value={nihssLanguage} onChange={setNihssLanguage} options={[
              { v: 0, l: '0 — Normal' }, { v: 1, l: '1 — Afasia leve a moderada' },
              { v: 2, l: '2 — Afasia grave' }, { v: 3, l: '3 — Mutismo/afasia global' },
            ]} />
            <ScoreSelector label="10. Disartria" value={nihssDysarthria} onChange={setNihssDysarthria} options={[
              { v: 0, l: '0 — Normal' }, { v: 1, l: '1 — Leve a moderada' }, { v: 2, l: '2 — Grave/anartria' },
            ]} />
            <ScoreSelector label="11. Extinção/Inatenção" value={nihssExtinction} onChange={setNihssExtinction} options={[
              { v: 0, l: '0 — Normal' }, { v: 1, l: '1 — Inatenção em uma modalidade' }, { v: 2, l: '2 — Inatenção em mais de uma modalidade' },
            ]} />
            <div className="text-xs text-gray-500 p-3 bg-gray-800/50 rounded-lg">
              <strong>Ref:</strong> Brott T et al. Stroke. 1989;20(7):864-870. Powers WJ et al. Stroke. 2019;50(12):e344-e418 (AHA/ASA Guidelines)
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
            <p className="text-emerald-300 text-sm">15 scores e escalas clínicas validadas cientificamente</p>
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${categoryFilter === cat ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-5 gap-2">
        {filteredCalcs.map(c => (
          <button key={c.id} onClick={() => { setSelected(c.id); setResult(null); }} className={`p-3 rounded-xl text-center transition-all ${selected === c.id ? 'bg-emerald-600 text-white ring-2 ring-emerald-400' : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-700'}`}>
            <div className="text-2xl mb-1">{c.icon}</div>
            <div className="text-xs font-bold truncate">{c.name}</div>
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
            <div className="text-4xl font-black text-white">{typeof result.score === 'number' ? result.score : result.score}</div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
            <div className={`h-3 rounded-full transition-all ${result.score <= (result.details?.max || 15) * 0.3 ? 'bg-green-500' : result.score <= (result.details?.max || 15) * 0.6 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (result.score / (result.details?.max || 15)) * 100)}%` }} />
          </div>
          <p className="text-lg font-medium text-gray-200">{result.interpretation}</p>
          {result.details?.reference && (
            <p className="text-xs text-gray-500 mt-3 pt-3 border-t border-gray-700">
              📚 <strong>Referência:</strong> {result.details.reference}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
