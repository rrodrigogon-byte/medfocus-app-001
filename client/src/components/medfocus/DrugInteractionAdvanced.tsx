/**
 * Verificador de Interações Medicamentosas Avançado
 * Permite adicionar múltiplos medicamentos e verifica interações entre eles
 * Baseado em dados farmacológicos e classificação de severidade
 */
import React, { useState } from 'react';

interface Drug {
  id: string;
  name: string;
  genericName: string;
  class: string;
  commonUse: string;
}

interface Interaction {
  drug1: string;
  drug2: string;
  severity: 'contraindicated' | 'serious' | 'moderate' | 'minor';
  description: string;
  mechanism: string;
  recommendation: string;
  evidence: string;
}

const DRUG_DATABASE: Drug[] = [
  // Analgésicos e Anti-inflamatórios
  { id: 'dipirona', name: 'Dipirona', genericName: 'Metamizol', class: 'Analgésico/Antipirético', commonUse: 'Dor e febre' },
  { id: 'paracetamol', name: 'Paracetamol', genericName: 'Acetaminofeno', class: 'Analgésico/Antipirético', commonUse: 'Dor e febre' },
  { id: 'ibuprofeno', name: 'Ibuprofeno', genericName: 'Ibuprofeno', class: 'AINE', commonUse: 'Dor, inflamação, febre' },
  { id: 'aas', name: 'AAS (Aspirina)', genericName: 'Ácido Acetilsalicílico', class: 'AINE/Antiagregante', commonUse: 'Dor, prevenção cardiovascular' },
  { id: 'diclofenaco', name: 'Diclofenaco', genericName: 'Diclofenaco sódico', class: 'AINE', commonUse: 'Dor e inflamação' },
  { id: 'nimesulida', name: 'Nimesulida', genericName: 'Nimesulida', class: 'AINE', commonUse: 'Dor e inflamação' },
  // Cardiovascular
  { id: 'losartana', name: 'Losartana', genericName: 'Losartana potássica', class: 'BRA', commonUse: 'Hipertensão' },
  { id: 'enalapril', name: 'Enalapril', genericName: 'Maleato de enalapril', class: 'IECA', commonUse: 'Hipertensão, ICC' },
  { id: 'captopril', name: 'Captopril', genericName: 'Captopril', class: 'IECA', commonUse: 'Hipertensão, ICC' },
  { id: 'atenolol', name: 'Atenolol', genericName: 'Atenolol', class: 'Betabloqueador', commonUse: 'Hipertensão, arritmia' },
  { id: 'propranolol', name: 'Propranolol', genericName: 'Cloridrato de propranolol', class: 'Betabloqueador', commonUse: 'Hipertensão, ansiedade' },
  { id: 'anlodipino', name: 'Anlodipino', genericName: 'Besilato de anlodipino', class: 'BCC', commonUse: 'Hipertensão, angina' },
  { id: 'hidroclorotiazida', name: 'Hidroclorotiazida', genericName: 'Hidroclorotiazida', class: 'Diurético tiazídico', commonUse: 'Hipertensão, edema' },
  { id: 'furosemida', name: 'Furosemida', genericName: 'Furosemida', class: 'Diurético de alça', commonUse: 'Edema, ICC' },
  { id: 'espironolactona', name: 'Espironolactona', genericName: 'Espironolactona', class: 'Diurético poupador K+', commonUse: 'ICC, hiperaldosteronismo' },
  { id: 'sinvastatina', name: 'Sinvastatina', genericName: 'Sinvastatina', class: 'Estatina', commonUse: 'Dislipidemia' },
  { id: 'atorvastatina', name: 'Atorvastatina', genericName: 'Atorvastatina cálcica', class: 'Estatina', commonUse: 'Dislipidemia' },
  { id: 'varfarina', name: 'Varfarina', genericName: 'Varfarina sódica', class: 'Anticoagulante', commonUse: 'Trombose, FA' },
  { id: 'clopidogrel', name: 'Clopidogrel', genericName: 'Bissulfato de clopidogrel', class: 'Antiagregante', commonUse: 'Prevenção trombótica' },
  { id: 'digoxina', name: 'Digoxina', genericName: 'Digoxina', class: 'Digitálico', commonUse: 'ICC, FA' },
  { id: 'amiodarona', name: 'Amiodarona', genericName: 'Cloridrato de amiodarona', class: 'Antiarrítmico', commonUse: 'Arritmias' },
  // Diabetes
  { id: 'metformina', name: 'Metformina', genericName: 'Cloridrato de metformina', class: 'Biguanida', commonUse: 'Diabetes tipo 2' },
  { id: 'glibenclamida', name: 'Glibenclamida', genericName: 'Glibenclamida', class: 'Sulfonilureia', commonUse: 'Diabetes tipo 2' },
  { id: 'insulina', name: 'Insulina NPH', genericName: 'Insulina humana', class: 'Insulina', commonUse: 'Diabetes' },
  // Antibióticos
  { id: 'amoxicilina', name: 'Amoxicilina', genericName: 'Amoxicilina tri-hidratada', class: 'Penicilina', commonUse: 'Infecções bacterianas' },
  { id: 'azitromicina', name: 'Azitromicina', genericName: 'Azitromicina di-hidratada', class: 'Macrolídeo', commonUse: 'Infecções respiratórias' },
  { id: 'ciprofloxacino', name: 'Ciprofloxacino', genericName: 'Cloridrato de ciprofloxacino', class: 'Fluoroquinolona', commonUse: 'Infecções urinárias, respiratórias' },
  { id: 'metronidazol', name: 'Metronidazol', genericName: 'Metronidazol', class: 'Nitroimidazólico', commonUse: 'Infecções anaeróbias' },
  { id: 'cefalexina', name: 'Cefalexina', genericName: 'Cefalexina mono-hidratada', class: 'Cefalosporina 1ª', commonUse: 'Infecções de pele, urinárias' },
  // Psiquiátricos
  { id: 'fluoxetina', name: 'Fluoxetina', genericName: 'Cloridrato de fluoxetina', class: 'ISRS', commonUse: 'Depressão, ansiedade' },
  { id: 'sertralina', name: 'Sertralina', genericName: 'Cloridrato de sertralina', class: 'ISRS', commonUse: 'Depressão, TOC, pânico' },
  { id: 'escitalopram', name: 'Escitalopram', genericName: 'Oxalato de escitalopram', class: 'ISRS', commonUse: 'Depressão, ansiedade' },
  { id: 'clonazepam', name: 'Clonazepam', genericName: 'Clonazepam', class: 'Benzodiazepínico', commonUse: 'Ansiedade, epilepsia' },
  { id: 'diazepam', name: 'Diazepam', genericName: 'Diazepam', class: 'Benzodiazepínico', commonUse: 'Ansiedade, espasmo muscular' },
  { id: 'alprazolam', name: 'Alprazolam', genericName: 'Alprazolam', class: 'Benzodiazepínico', commonUse: 'Ansiedade, pânico' },
  { id: 'haloperidol', name: 'Haloperidol', genericName: 'Haloperidol', class: 'Antipsicótico típico', commonUse: 'Psicose, agitação' },
  { id: 'risperidona', name: 'Risperidona', genericName: 'Risperidona', class: 'Antipsicótico atípico', commonUse: 'Esquizofrenia, bipolar' },
  { id: 'carbamazepina', name: 'Carbamazepina', genericName: 'Carbamazepina', class: 'Anticonvulsivante', commonUse: 'Epilepsia, neuralgia' },
  { id: 'valproato', name: 'Ácido Valproico', genericName: 'Valproato de sódio', class: 'Anticonvulsivante', commonUse: 'Epilepsia, bipolar' },
  { id: 'lítio', name: 'Carbonato de Lítio', genericName: 'Carbonato de lítio', class: 'Estabilizador de humor', commonUse: 'Transtorno bipolar' },
  // Gastrointestinal
  { id: 'omeprazol', name: 'Omeprazol', genericName: 'Omeprazol', class: 'IBP', commonUse: 'Úlcera, DRGE' },
  { id: 'pantoprazol', name: 'Pantoprazol', genericName: 'Pantoprazol sódico', class: 'IBP', commonUse: 'Úlcera, DRGE' },
  { id: 'domperidona', name: 'Domperidona', genericName: 'Domperidona', class: 'Procinético', commonUse: 'Náusea, gastroparesia' },
  { id: 'metoclopramida', name: 'Metoclopramida', genericName: 'Cloridrato de metoclopramida', class: 'Procinético', commonUse: 'Náusea, vômito' },
  // Outros
  { id: 'levotiroxina', name: 'Levotiroxina', genericName: 'Levotiroxina sódica', class: 'Hormônio tireoidiano', commonUse: 'Hipotireoidismo' },
  { id: 'prednisona', name: 'Prednisona', genericName: 'Prednisona', class: 'Corticosteroide', commonUse: 'Inflamação, autoimune' },
  { id: 'dexametasona', name: 'Dexametasona', genericName: 'Dexametasona', class: 'Corticosteroide', commonUse: 'Inflamação grave' },
  { id: 'loratadina', name: 'Loratadina', genericName: 'Loratadina', class: 'Anti-histamínico', commonUse: 'Alergia' },
  { id: 'prometazina', name: 'Prometazina', genericName: 'Cloridrato de prometazina', class: 'Anti-histamínico 1ª', commonUse: 'Alergia, sedação' },
  { id: 'tramadol', name: 'Tramadol', genericName: 'Cloridrato de tramadol', class: 'Opioide fraco', commonUse: 'Dor moderada a intensa' },
  { id: 'codeina', name: 'Codeína', genericName: 'Fosfato de codeína', class: 'Opioide fraco', commonUse: 'Dor, tosse' },
  { id: 'sildenafila', name: 'Sildenafila', genericName: 'Citrato de sildenafila', class: 'Inibidor PDE5', commonUse: 'Disfunção erétil' },
  { id: 'alopurinol', name: 'Alopurinol', genericName: 'Alopurinol', class: 'Inibidor xantina oxidase', commonUse: 'Gota, hiperuricemia' },
];

const INTERACTION_DATABASE: Interaction[] = [
  // Interações Contraindicadas
  { drug1: 'varfarina', drug2: 'aas', severity: 'contraindicated', description: 'Risco extremamente alto de sangramento grave', mechanism: 'Ambos inibem a coagulação por mecanismos diferentes (anticoagulante + antiagregante)', recommendation: 'CONTRAINDICADO — Não usar juntos. Consultar médico para alternativa.', evidence: 'Forte — Múltiplos estudos clínicos' },
  { drug1: 'metronidazol', drug2: 'varfarina', severity: 'serious', description: 'Aumento significativo do efeito anticoagulante', mechanism: 'Metronidazol inibe o metabolismo da varfarina via CYP2C9', recommendation: 'Se necessário, monitorar INR rigorosamente e ajustar dose da varfarina.', evidence: 'Forte' },
  { drug1: 'fluoxetina', drug2: 'tramadol', severity: 'contraindicated', description: 'Risco de Síndrome Serotoninérgica — potencialmente fatal', mechanism: 'Ambos aumentam serotonina no SNC por mecanismos diferentes', recommendation: 'CONTRAINDICADO — Risco de hipertermia, rigidez, convulsões. Usar analgésico alternativo.', evidence: 'Forte' },
  { drug1: 'sertralina', drug2: 'tramadol', severity: 'contraindicated', description: 'Risco de Síndrome Serotoninérgica', mechanism: 'Efeito serotoninérgico aditivo', recommendation: 'CONTRAINDICADO — Substituir tramadol por analgésico não serotoninérgico.', evidence: 'Forte' },
  { drug1: 'sildenafila', drug2: 'anlodipino', severity: 'serious', description: 'Risco de hipotensão severa', mechanism: 'Efeito vasodilatador aditivo', recommendation: 'Usar com cautela. Iniciar sildenafila em dose baixa. Monitorar PA.', evidence: 'Moderada' },
  { drug1: 'lítio', drug2: 'ibuprofeno', severity: 'serious', description: 'Aumento dos níveis de lítio — risco de toxicidade', mechanism: 'AINEs reduzem excreção renal do lítio', recommendation: 'Evitar AINEs. Se necessário, monitorar litemia frequentemente.', evidence: 'Forte' },
  { drug1: 'lítio', drug2: 'enalapril', severity: 'serious', description: 'Aumento dos níveis de lítio', mechanism: 'IECA reduz excreção renal do lítio', recommendation: 'Monitorar litemia. Considerar alternativa anti-hipertensiva.', evidence: 'Forte' },
  { drug1: 'lítio', drug2: 'losartana', severity: 'serious', description: 'Aumento dos níveis de lítio', mechanism: 'BRA pode reduzir excreção renal do lítio', recommendation: 'Monitorar litemia. Ajustar dose se necessário.', evidence: 'Moderada' },
  // Interações Sérias
  { drug1: 'enalapril', drug2: 'espironolactona', severity: 'serious', description: 'Risco de hipercalemia grave', mechanism: 'Ambos retêm potássio por mecanismos diferentes', recommendation: 'Monitorar potássio sérico regularmente. Evitar suplementos de K+.', evidence: 'Forte' },
  { drug1: 'captopril', drug2: 'espironolactona', severity: 'serious', description: 'Risco de hipercalemia grave', mechanism: 'IECA + diurético poupador de potássio = retenção de K+', recommendation: 'Monitorar K+ sérico. Considerar alternativa.', evidence: 'Forte' },
  { drug1: 'digoxina', drug2: 'amiodarona', severity: 'serious', description: 'Aumento dos níveis de digoxina — risco de intoxicação digitálica', mechanism: 'Amiodarona inibe P-glicoproteína e clearance renal da digoxina', recommendation: 'Reduzir dose de digoxina em 50%. Monitorar digoxinemia.', evidence: 'Forte' },
  { drug1: 'digoxina', drug2: 'furosemida', severity: 'serious', description: 'Hipocalemia induzida pela furosemida aumenta toxicidade da digoxina', mechanism: 'Depleção de K+ sensibiliza miocárdio à digoxina', recommendation: 'Monitorar K+ e Mg2+. Repor eletrólitos.', evidence: 'Forte' },
  { drug1: 'sinvastatina', drug2: 'amiodarona', severity: 'serious', description: 'Risco aumentado de rabdomiólise', mechanism: 'Amiodarona inibe CYP3A4, aumentando níveis de sinvastatina', recommendation: 'Limitar sinvastatina a 20mg/dia. Considerar trocar para atorvastatina.', evidence: 'Forte' },
  { drug1: 'carbamazepina', drug2: 'valproato', severity: 'serious', description: 'Interação complexa — redução mútua de níveis', mechanism: 'Carbamazepina induz metabolismo do valproato; valproato inibe epóxido-hidrolase', recommendation: 'Monitorar níveis séricos de ambos. Ajustar doses.', evidence: 'Forte' },
  { drug1: 'ciprofloxacino', drug2: 'metformina', severity: 'serious', description: 'Risco de hipoglicemia ou hiperglicemia', mechanism: 'Fluoroquinolonas alteram secreção de insulina', recommendation: 'Monitorar glicemia frequentemente durante o tratamento.', evidence: 'Moderada' },
  { drug1: 'omeprazol', drug2: 'clopidogrel', severity: 'serious', description: 'Redução da eficácia do clopidogrel', mechanism: 'Omeprazol inibe CYP2C19, reduzindo ativação do clopidogrel', recommendation: 'Trocar omeprazol por pantoprazol (menor interação via CYP2C19).', evidence: 'Forte' },
  { drug1: 'clonazepam', drug2: 'codeina', severity: 'serious', description: 'Risco de depressão respiratória grave', mechanism: 'Efeito depressor do SNC aditivo', recommendation: 'Evitar combinação. Se necessário, usar doses mínimas e monitorar.', evidence: 'Forte' },
  { drug1: 'diazepam', drug2: 'codeina', severity: 'serious', description: 'Risco de depressão respiratória', mechanism: 'Depressão aditiva do SNC', recommendation: 'Evitar. Risco de sedação excessiva e parada respiratória.', evidence: 'Forte' },
  // Interações Moderadas
  { drug1: 'ibuprofeno', drug2: 'losartana', severity: 'moderate', description: 'Redução do efeito anti-hipertensivo e risco renal', mechanism: 'AINEs antagonizam efeito dos BRA e reduzem fluxo renal', recommendation: 'Usar AINE pelo menor tempo possível. Monitorar PA e função renal.', evidence: 'Forte' },
  { drug1: 'ibuprofeno', drug2: 'enalapril', severity: 'moderate', description: 'Redução do efeito anti-hipertensivo', mechanism: 'AINEs reduzem síntese de prostaglandinas renais', recommendation: 'Preferir paracetamol para dor. Monitorar PA.', evidence: 'Forte' },
  { drug1: 'ibuprofeno', drug2: 'aas', severity: 'moderate', description: 'Risco aumentado de sangramento GI e redução do efeito cardioprotetor do AAS', mechanism: 'Competição pela COX-1 plaquetária', recommendation: 'Tomar AAS 30min antes do ibuprofeno. Considerar paracetamol.', evidence: 'Forte' },
  { drug1: 'metformina', drug2: 'prednisona', severity: 'moderate', description: 'Corticosteroide antagoniza efeito hipoglicemiante', mechanism: 'Prednisona aumenta gliconeogênese e resistência à insulina', recommendation: 'Monitorar glicemia. Pode ser necessário ajustar dose de metformina.', evidence: 'Forte' },
  { drug1: 'levotiroxina', drug2: 'omeprazol', severity: 'moderate', description: 'Redução da absorção de levotiroxina', mechanism: 'IBP altera pH gástrico, reduzindo absorção', recommendation: 'Tomar levotiroxina em jejum, 30-60min antes do omeprazol.', evidence: 'Moderada' },
  { drug1: 'levotiroxina', drug2: 'metformina', severity: 'moderate', description: 'Metformina pode alterar níveis de TSH', mechanism: 'Mecanismo não totalmente esclarecido', recommendation: 'Monitorar TSH periodicamente.', evidence: 'Moderada' },
  { drug1: 'fluoxetina', drug2: 'clonazepam', severity: 'moderate', description: 'Aumento dos níveis de clonazepam', mechanism: 'Fluoxetina inibe CYP3A4', recommendation: 'Monitorar sedação. Pode ser necessário reduzir dose do clonazepam.', evidence: 'Moderada' },
  { drug1: 'propranolol', drug2: 'insulina', severity: 'moderate', description: 'Mascaramento dos sintomas de hipoglicemia', mechanism: 'Betabloqueadores mascaram taquicardia e tremor da hipoglicemia', recommendation: 'Monitorar glicemia com mais frequência. Orientar paciente.', evidence: 'Forte' },
  { drug1: 'atenolol', drug2: 'insulina', severity: 'moderate', description: 'Mascaramento dos sintomas de hipoglicemia', mechanism: 'Betabloqueadores mascaram sinais adrenérgicos', recommendation: 'Monitorar glicemia. Preferir betabloqueadores cardiosseletivos.', evidence: 'Forte' },
  // Interações Menores
  { drug1: 'omeprazol', drug2: 'paracetamol', severity: 'minor', description: 'Leve aumento da absorção de paracetamol', mechanism: 'Alteração do pH gástrico', recommendation: 'Sem ajuste necessário em doses terapêuticas.', evidence: 'Fraca' },
  { drug1: 'loratadina', drug2: 'omeprazol', severity: 'minor', description: 'Possível aumento leve dos níveis de loratadina', mechanism: 'Inibição leve do metabolismo hepático', recommendation: 'Sem significância clínica na maioria dos casos.', evidence: 'Fraca' },
  { drug1: 'metformina', drug2: 'omeprazol', severity: 'minor', description: 'Possível redução da absorção de vitamina B12', mechanism: 'Ambos podem reduzir absorção de B12 a longo prazo', recommendation: 'Monitorar B12 em uso prolongado. Suplementar se necessário.', evidence: 'Moderada' },
];

export default function DrugInteractionAdvanced() {
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [expandedInteraction, setExpandedInteraction] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState('Todos');

  const classes = ['Todos', ...Array.from(new Set(DRUG_DATABASE.map(d => d.class))).sort()];

  const filteredDrugs = DRUG_DATABASE.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.genericName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchClass = selectedClass === 'Todos' || d.class === selectedClass;
    return matchSearch && matchClass && !selectedDrugs.includes(d.id);
  });

  const addDrug = (id: string) => {
    if (!selectedDrugs.includes(id)) {
      setSelectedDrugs([...selectedDrugs, id]);
      setSearchTerm('');
      setShowResults(false);
    }
  };

  const removeDrug = (id: string) => {
    setSelectedDrugs(selectedDrugs.filter(d => d !== id));
    setShowResults(false);
    setInteractions([]);
  };

  const checkInteractions = () => {
    const found: Interaction[] = [];
    for (let i = 0; i < selectedDrugs.length; i++) {
      for (let j = i + 1; j < selectedDrugs.length; j++) {
        const d1 = selectedDrugs[i];
        const d2 = selectedDrugs[j];
        const interaction = INTERACTION_DATABASE.find(
          int => (int.drug1 === d1 && int.drug2 === d2) || (int.drug1 === d2 && int.drug2 === d1)
        );
        if (interaction) found.push(interaction);
      }
    }
    found.sort((a, b) => {
      const order = { contraindicated: 0, serious: 1, moderate: 2, minor: 3 };
      return order[a.severity] - order[b.severity];
    });
    setInteractions(found);
    setShowResults(true);
  };

  const getDrugName = (id: string) => DRUG_DATABASE.find(d => d.id === id)?.name || id;

  const severityConfig = {
    contraindicated: { label: 'CONTRAINDICADO', color: 'bg-red-500/20 text-red-400 border-red-500', icon: '🚫', bg: 'bg-red-500/5 border-red-500/30' },
    serious: { label: 'GRAVE', color: 'bg-orange-500/20 text-orange-400 border-orange-500', icon: '⚠️', bg: 'bg-orange-500/5 border-orange-500/30' },
    moderate: { label: 'MODERADA', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500', icon: '🟡', bg: 'bg-yellow-500/5 border-yellow-500/30' },
    minor: { label: 'LEVE', color: 'bg-green-500/20 text-green-400 border-green-500', icon: '💚', bg: 'bg-green-500/5 border-green-500/30' },
  };

  const totalByLevel = {
    contraindicated: interactions.filter(i => i.severity === 'contraindicated').length,
    serious: interactions.filter(i => i.severity === 'serious').length,
    moderate: interactions.filter(i => i.severity === 'moderate').length,
    minor: interactions.filter(i => i.severity === 'minor').length,
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <span className="text-3xl">💊</span> Interações Medicamentosas
        </h2>
        <p className="text-gray-400 mt-1">Verifique interações entre medicamentos. Adicione até 10 medicamentos simultaneamente.</p>
      </div>

      {/* Drug Selection */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-white">Medicamentos em uso</h3>

        {/* Selected Drugs */}
        {selectedDrugs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedDrugs.map(id => {
              const drug = DRUG_DATABASE.find(d => d.id === id);
              return drug ? (
                <div key={id} className="flex items-center gap-2 bg-teal-500/20 border border-teal-500/30 rounded-lg px-3 py-2">
                  <div>
                    <span className="text-teal-400 font-medium text-sm">{drug.name}</span>
                    <span className="text-gray-500 text-xs ml-2">({drug.class})</span>
                  </div>
                  <button onClick={() => removeDrug(id)} className="text-gray-400 hover:text-red-400 text-lg">×</button>
                </div>
              ) : null;
            })}
          </div>
        )}

        {/* Search Input */}
        {selectedDrugs.length < 10 && (
          <div className="relative">
            <input type="text" placeholder="Buscar medicamento..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none" />
            
            {searchTerm.length >= 2 && (
              <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-600 rounded-lg max-h-60 overflow-y-auto shadow-xl">
                {/* Class filter */}
                <div className="p-2 border-b border-gray-700 flex flex-wrap gap-1">
                  {['Todos', 'AINE', 'IECA', 'BRA', 'Betabloqueador', 'Estatina', 'ISRS', 'Benzodiazepínico', 'IBP'].map(c => (
                    <button key={c} onClick={() => setSelectedClass(c)}
                      className={`px-2 py-0.5 rounded text-[10px] ${selectedClass === c ? 'bg-teal-500/20 text-teal-400' : 'bg-gray-700 text-gray-400'}`}>
                      {c}
                    </button>
                  ))}
                </div>
                {filteredDrugs.slice(0, 10).map(d => (
                  <button key={d.id} onClick={() => addDrug(d.id)}
                    className="w-full p-3 text-left hover:bg-gray-700/50 border-b border-gray-700/50 last:border-0">
                    <span className="text-white font-medium">{d.name}</span>
                    <span className="text-gray-500 text-xs ml-2">({d.genericName})</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-teal-400 bg-teal-500/10 px-1.5 py-0.5 rounded">{d.class}</span>
                      <span className="text-[10px] text-gray-500">{d.commonUse}</span>
                    </div>
                  </button>
                ))}
                {filteredDrugs.length === 0 && (
                  <p className="p-3 text-gray-500 text-sm">Nenhum medicamento encontrado</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Check Button */}
        <button onClick={checkInteractions}
          disabled={selectedDrugs.length < 2}
          className={`w-full py-3 rounded-lg font-semibold transition-all ${selectedDrugs.length >= 2 ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
          🔍 Verificar Interações ({selectedDrugs.length} medicamentos)
        </button>
      </div>

      {/* Results */}
      {showResults && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-red-400">{totalByLevel.contraindicated}</p>
              <p className="text-xs text-red-400/70">Contraindicadas</p>
            </div>
            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-400">{totalByLevel.serious}</p>
              <p className="text-xs text-orange-400/70">Graves</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-yellow-400">{totalByLevel.moderate}</p>
              <p className="text-xs text-yellow-400/70">Moderadas</p>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{totalByLevel.minor}</p>
              <p className="text-xs text-green-400/70">Leves</p>
            </div>
          </div>

          {interactions.length === 0 ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
              <span className="text-4xl">✅</span>
              <h3 className="text-lg font-semibold text-green-400 mt-2">Nenhuma interação encontrada</h3>
              <p className="text-gray-400 text-sm mt-1">Não foram identificadas interações conhecidas entre os medicamentos selecionados no nosso banco de dados.</p>
              <p className="text-gray-500 text-xs mt-2">Nota: Sempre consulte seu médico ou farmacêutico para orientação completa.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {interactions.map((int, idx) => {
                const config = severityConfig[int.severity];
                return (
                  <div key={idx} className={`border rounded-xl overflow-hidden ${config.bg}`}>
                    <button onClick={() => setExpandedInteraction(expandedInteraction === idx ? null : idx)}
                      className="w-full p-4 flex items-center justify-between text-left">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-semibold">{getDrugName(int.drug1)}</span>
                            <span className="text-gray-500">+</span>
                            <span className="text-white font-semibold">{getDrugName(int.drug2)}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${config.color}`}>{config.label}</span>
                            <span className="text-gray-400 text-xs">{int.description}</span>
                          </div>
                        </div>
                      </div>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedInteraction === idx ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {expandedInteraction === idx && (
                      <div className="px-4 pb-4 border-t border-gray-600/30 pt-4 space-y-3">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase">Mecanismo</h4>
                          <p className="text-sm text-gray-300 mt-1">{int.mechanism}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase">Recomendação</h4>
                          <p className="text-sm text-white font-medium mt-1">{int.recommendation}</p>
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase">Nível de Evidência</h4>
                          <p className="text-sm text-gray-300 mt-1">{int.evidence}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              <strong>⚠️ Aviso:</strong> Este verificador cobre as interações mais comuns entre os medicamentos mais prescritos no Brasil. 
              Não substitui a avaliação de um farmacêutico ou médico. Referências: Micromedex, UpToDate, Bulário ANVISA.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
