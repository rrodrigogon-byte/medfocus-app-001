import { useState } from 'react';
import { GraduationCap, BookOpen, Calculator, Shield, Eye, EyeOff, Brain, FileText, Award, Users, Beaker, Stethoscope, Heart, Activity, Loader2, Copy, CheckCircle, Search, ChevronDown, ChevronUp } from 'lucide-react';
import EducationalDisclaimer from './EducationalDisclaimer';

// ==================== INTERFACES ====================
interface Calculadora {
  id: string;
  nome: string;
  categoria: string;
  descricao: string;
  referencia: string;
  campos: { nome: string; tipo: 'number' | 'select'; opcoes?: string[]; unidade?: string; placeholder?: string }[];
  formula: string;
  interpretacao: { faixa: string; resultado: string; cor: string }[];
}

interface CasoAnonimizado {
  id: string;
  titulo: string;
  especialidade: string;
  resumo: string;
  dadosOriginais: Record<string, string>;
  dadosAnonimizados: Record<string, string>;
}

// ==================== MOCK DATA ====================
const CALCULADORAS: Calculadora[] = [
  {
    id: 'framingham', nome: 'Escore de Framingham', categoria: 'Cardiologia',
    descricao: 'Risco cardiovascular em 10 anos. Validado pelo Framingham Heart Study (1998).',
    referencia: 'Wilson PWF et al. Circulation. 1998;97(18):1837-1847',
    campos: [
      { nome: 'Idade', tipo: 'number', unidade: 'anos', placeholder: '30-74' },
      { nome: 'Sexo', tipo: 'select', opcoes: ['Masculino', 'Feminino'] },
      { nome: 'Colesterol Total', tipo: 'number', unidade: 'mg/dL', placeholder: '130-320' },
      { nome: 'HDL', tipo: 'number', unidade: 'mg/dL', placeholder: '20-100' },
      { nome: 'PAS', tipo: 'number', unidade: 'mmHg', placeholder: '90-200' },
      { nome: 'Tabagista', tipo: 'select', opcoes: ['Sim', 'Não'] },
      { nome: 'Diabetes', tipo: 'select', opcoes: ['Sim', 'Não'] },
    ],
    formula: 'Pontuação baseada em idade, sexo, colesterol, HDL, PAS, tabagismo e diabetes',
    interpretacao: [
      { faixa: '< 10%', resultado: 'Baixo Risco', cor: 'green' },
      { faixa: '10-20%', resultado: 'Risco Intermediário', cor: 'yellow' },
      { faixa: '> 20%', resultado: 'Alto Risco', cor: 'red' },
    ]
  },
  {
    id: 'cha2ds2vasc', nome: 'CHA₂DS₂-VASc', categoria: 'Cardiologia',
    descricao: 'Risco de AVC em pacientes com fibrilação atrial. Guia anticoagulação.',
    referencia: 'Lip GYH et al. Chest. 2010;137(2):263-272',
    campos: [
      { nome: 'ICC', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
      { nome: 'Hipertensão', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
      { nome: 'Idade ≥75', tipo: 'select', opcoes: ['Sim (+2)', 'Não (0)'] },
      { nome: 'Diabetes', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
      { nome: 'AVC/AIT prévio', tipo: 'select', opcoes: ['Sim (+2)', 'Não (0)'] },
      { nome: 'Doença vascular', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
      { nome: 'Idade 65-74', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
      { nome: 'Sexo feminino', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
    ],
    formula: 'Soma dos pontos: C(1) + H(1) + A₂(2) + D(1) + S₂(2) + V(1) + A(1) + Sc(1) = 0-9',
    interpretacao: [
      { faixa: '0 (homem) / 1 (mulher)', resultado: 'Baixo — Sem anticoagulação', cor: 'green' },
      { faixa: '1 (homem) / 2 (mulher)', resultado: 'Intermediário — Considerar anticoagulação', cor: 'yellow' },
      { faixa: '≥ 2 (homem) / ≥ 3 (mulher)', resultado: 'Alto — Anticoagulação indicada', cor: 'red' },
    ]
  },
  {
    id: 'wells', nome: 'Escore de Wells (TEP)', categoria: 'Pneumologia',
    descricao: 'Probabilidade clínica de tromboembolismo pulmonar.',
    referencia: 'Wells PS et al. Thromb Haemost. 2000;83(3):416-420',
    campos: [
      { nome: 'Sinais clínicos de TVP', tipo: 'select', opcoes: ['Sim (+3)', 'Não (0)'] },
      { nome: 'TEP como diagnóstico provável', tipo: 'select', opcoes: ['Sim (+3)', 'Não (0)'] },
      { nome: 'FC > 100 bpm', tipo: 'select', opcoes: ['Sim (+1.5)', 'Não (0)'] },
      { nome: 'Imobilização/Cirurgia recente', tipo: 'select', opcoes: ['Sim (+1.5)', 'Não (0)'] },
      { nome: 'TVP/TEP prévio', tipo: 'select', opcoes: ['Sim (+1.5)', 'Não (0)'] },
      { nome: 'Hemoptise', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
      { nome: 'Neoplasia ativa', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
    ],
    formula: 'Soma dos pontos: 0-12.5',
    interpretacao: [
      { faixa: '< 2', resultado: 'Baixa probabilidade', cor: 'green' },
      { faixa: '2-6', resultado: 'Probabilidade intermediária', cor: 'yellow' },
      { faixa: '> 6', resultado: 'Alta probabilidade', cor: 'red' },
    ]
  },
  {
    id: 'sofa', nome: 'SOFA Score', categoria: 'Terapia Intensiva',
    descricao: 'Avaliação sequencial de falência orgânica. Critério para sepse (Sepsis-3).',
    referencia: 'Singer M et al. JAMA. 2016;315(8):801-810',
    campos: [
      { nome: 'PaO2/FiO2', tipo: 'number', unidade: 'mmHg', placeholder: '100-500' },
      { nome: 'Plaquetas', tipo: 'number', unidade: '×10³/mm³', placeholder: '0-400' },
      { nome: 'Bilirrubina', tipo: 'number', unidade: 'mg/dL', placeholder: '0-15' },
      { nome: 'PAM ou vasopressores', tipo: 'select', opcoes: ['PAM ≥70 (0)', 'PAM <70 (1)', 'Dopa ≤5 (2)', 'Dopa >5 (3)', 'Nora >0.1 (4)'] },
      { nome: 'Glasgow', tipo: 'number', unidade: '', placeholder: '3-15' },
      { nome: 'Creatinina', tipo: 'number', unidade: 'mg/dL', placeholder: '0-10' },
    ],
    formula: 'Soma dos pontos de 6 sistemas orgânicos: 0-24',
    interpretacao: [
      { faixa: '0-6', resultado: 'Mortalidade < 10%', cor: 'green' },
      { faixa: '7-9', resultado: 'Mortalidade 15-20%', cor: 'yellow' },
      { faixa: '10-12', resultado: 'Mortalidade 40-50%', cor: 'orange' },
      { faixa: '≥ 13', resultado: 'Mortalidade > 80%', cor: 'red' },
    ]
  },
  {
    id: 'childpugh', nome: 'Child-Pugh', categoria: 'Hepatologia',
    descricao: 'Classificação de gravidade da cirrose hepática.',
    referencia: 'Pugh RNH et al. Br J Surg. 1973;60(8):646-649',
    campos: [
      { nome: 'Bilirrubina', tipo: 'select', opcoes: ['< 2 (1pt)', '2-3 (2pt)', '> 3 (3pt)'] },
      { nome: 'Albumina', tipo: 'select', opcoes: ['> 3.5 (1pt)', '2.8-3.5 (2pt)', '< 2.8 (3pt)'] },
      { nome: 'INR', tipo: 'select', opcoes: ['< 1.7 (1pt)', '1.7-2.3 (2pt)', '> 2.3 (3pt)'] },
      { nome: 'Ascite', tipo: 'select', opcoes: ['Ausente (1pt)', 'Leve (2pt)', 'Moderada/Grave (3pt)'] },
      { nome: 'Encefalopatia', tipo: 'select', opcoes: ['Ausente (1pt)', 'Grau I-II (2pt)', 'Grau III-IV (3pt)'] },
    ],
    formula: 'Soma: 5-15 pontos → Classe A (5-6), B (7-9), C (10-15)',
    interpretacao: [
      { faixa: 'Classe A (5-6)', resultado: 'Cirrose compensada — Mortalidade 1 ano: 10%', cor: 'green' },
      { faixa: 'Classe B (7-9)', resultado: 'Comprometimento significativo — Mortalidade 1 ano: 30%', cor: 'yellow' },
      { faixa: 'Classe C (10-15)', resultado: 'Cirrose descompensada — Mortalidade 1 ano: 70-80%', cor: 'red' },
    ]
  },
  {
    id: 'apache2', nome: 'APACHE II', categoria: 'Terapia Intensiva',
    descricao: 'Predição de mortalidade em UTI nas primeiras 24h de internação.',
    referencia: 'Knaus WA et al. Crit Care Med. 1985;13(10):818-829',
    campos: [
      { nome: 'Temperatura', tipo: 'number', unidade: '°C', placeholder: '30-42' },
      { nome: 'PAM', tipo: 'number', unidade: 'mmHg', placeholder: '40-200' },
      { nome: 'FC', tipo: 'number', unidade: 'bpm', placeholder: '30-200' },
      { nome: 'FR', tipo: 'number', unidade: 'irpm', placeholder: '5-50' },
      { nome: 'Idade', tipo: 'number', unidade: 'anos', placeholder: '16-100' },
      { nome: 'Glasgow', tipo: 'number', unidade: '', placeholder: '3-15' },
    ],
    formula: 'Soma de 12 variáveis fisiológicas + idade + doença crônica: 0-71',
    interpretacao: [
      { faixa: '0-4', resultado: 'Mortalidade ~4%', cor: 'green' },
      { faixa: '5-9', resultado: 'Mortalidade ~8%', cor: 'green' },
      { faixa: '10-14', resultado: 'Mortalidade ~15%', cor: 'yellow' },
      { faixa: '15-19', resultado: 'Mortalidade ~25%', cor: 'yellow' },
      { faixa: '20-24', resultado: 'Mortalidade ~40%', cor: 'orange' },
      { faixa: '25-29', resultado: 'Mortalidade ~55%', cor: 'red' },
      { faixa: '≥ 30', resultado: 'Mortalidade ~75%', cor: 'red' },
    ]
  },
  {
    id: 'curb65', nome: 'CURB-65', categoria: 'Pneumologia',
    descricao: 'Gravidade de pneumonia adquirida na comunidade (PAC).',
    referencia: 'Lim WS et al. Thorax. 2003;58(5):377-382. British Thoracic Society',
    campos: [
      { nome: 'Confusão mental', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
      { nome: 'Ureia > 50 mg/dL', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
      { nome: 'FR ≥ 30 irpm', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
      { nome: 'PAS < 90 ou PAD ≤ 60', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
      { nome: 'Idade ≥ 65 anos', tipo: 'select', opcoes: ['Sim (+1)', 'Não (0)'] },
    ],
    formula: 'Soma: 0-5 pontos',
    interpretacao: [
      { faixa: '0-1', resultado: 'Baixo risco — Tratamento ambulatorial', cor: 'green' },
      { faixa: '2', resultado: 'Risco intermediário — Considerar internação', cor: 'yellow' },
      { faixa: '3-5', resultado: 'Alto risco — Internação (≥4: considerar UTI)', cor: 'red' },
    ]
  },
  {
    id: 'meld', nome: 'MELD-Na', categoria: 'Hepatologia',
    descricao: 'Priorização para transplante hepático. Mortalidade em 90 dias.',
    referencia: 'Kim WR et al. Hepatology. 2008;47(4):1363-1370. UNOS/OPTN',
    campos: [
      { nome: 'Bilirrubina', tipo: 'number', unidade: 'mg/dL', placeholder: '0.1-40' },
      { nome: 'INR', tipo: 'number', unidade: '', placeholder: '0.8-8' },
      { nome: 'Creatinina', tipo: 'number', unidade: 'mg/dL', placeholder: '0.5-10' },
      { nome: 'Sódio', tipo: 'number', unidade: 'mEq/L', placeholder: '120-145' },
      { nome: 'Diálise', tipo: 'select', opcoes: ['Sim', 'Não'] },
    ],
    formula: 'MELD = 3.78×ln(Bili) + 11.2×ln(INR) + 9.57×ln(Creat) + 6.43 + MELD-Na ajuste',
    interpretacao: [
      { faixa: '< 10', resultado: 'Mortalidade 90d: 1.9%', cor: 'green' },
      { faixa: '10-19', resultado: 'Mortalidade 90d: 6.0%', cor: 'yellow' },
      { faixa: '20-29', resultado: 'Mortalidade 90d: 19.6%', cor: 'orange' },
      { faixa: '30-39', resultado: 'Mortalidade 90d: 52.6%', cor: 'red' },
      { faixa: '≥ 40', resultado: 'Mortalidade 90d: 71.3%', cor: 'red' },
    ]
  },
];

const CASO_ANONIMIZADO: CasoAnonimizado = {
  id: 'ANON001',
  titulo: 'Síndrome Coronariana Aguda em Paciente Diabético',
  especialidade: 'Cardiologia',
  resumo: 'Paciente com dor torácica típica, ECG com supra de ST em parede anterior, troponina elevada.',
  dadosOriginais: {
    'Nome': 'Carlos Eduardo Lima da Silva',
    'CPF': '123.456.789-00',
    'Data Nasc.': '15/03/1968',
    'Endereço': 'Rua das Flores, 123 - São Paulo/SP',
    'Telefone': '(11) 99876-5432',
    'Convênio': 'Unimed - 0012345678',
  },
  dadosAnonimizados: {
    'Nome': 'Paciente A.B., 58 anos',
    'CPF': '***.***.***-**',
    'Data Nasc.': '1968 (58 anos)',
    'Endereço': '[REMOVIDO]',
    'Telefone': '[REMOVIDO]',
    'Convênio': '[REMOVIDO]',
  },
};

// ==================== COMPONENT ====================
export default function HubAcademico() {
  const [activeTab, setActiveTab] = useState<'calculadoras' | 'anonimizacao' | 'estudo' | 'flashcards'>('calculadoras');
  const [selectedCalc, setSelectedCalc] = useState<Calculadora | null>(null);
  const [showAnonimizado, setShowAnonimizado] = useState(true);
  const [searchCalc, setSearchCalc] = useState('');
  const [expandedInterp, setExpandedInterp] = useState<string | null>(null);

  const filteredCalcs = CALCULADORAS.filter(c =>
    searchCalc === '' || c.nome.toLowerCase().includes(searchCalc.toLowerCase()) || c.categoria.toLowerCase().includes(searchCalc.toLowerCase())
  );

  const categorias = [...new Set(CALCULADORAS.map(c => c.categoria))];

  return (
    <div className="space-y-6">
      <EducationalDisclaimer module="Hub Acadêmico" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 rounded-2xl p-6 border border-violet-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-violet-500/20 rounded-lg">
            <GraduationCap className="w-6 h-6 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Hub Acadêmico</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Calculadoras médicas validadas, anonimização LGPD para casos clínicos, modo estudo e flashcards para residência médica.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Calculadoras', value: CALCULADORAS.length, icon: Calculator, color: 'violet' },
          { label: 'Especialidades', value: categorias.length, icon: Stethoscope, color: 'fuchsia' },
          { label: 'Referências', value: CALCULADORAS.length, icon: BookOpen, color: 'blue' },
          { label: 'Flashcards', value: '120+', icon: Brain, color: 'cyan' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              <span className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</span>
            </div>
            <span className="text-xs text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'calculadoras' as const, label: 'Calculadoras Médicas', icon: Calculator },
          { id: 'anonimizacao' as const, label: 'Anonimização LGPD', icon: Shield },
          { id: 'estudo' as const, label: 'Modo Estudo', icon: BookOpen },
          { id: 'flashcards' as const, label: 'Flashcards', icon: Brain },
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

      {/* Calculadoras */}
      {activeTab === 'calculadoras' && (
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchCalc}
              onChange={(e) => setSearchCalc(e.target.value)}
              placeholder="Buscar calculadora por nome ou especialidade..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-white placeholder-gray-500"
            />
          </div>

          {selectedCalc ? (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">{selectedCalc.nome}</h3>
                  <span className="text-xs text-violet-400">{selectedCalc.categoria}</span>
                </div>
                <button onClick={() => setSelectedCalc(null)} className="text-xs text-gray-500 hover:text-gray-300">Voltar</button>
              </div>
              <p className="text-sm text-gray-400 mb-4">{selectedCalc.descricao}</p>

              {/* Campos */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {selectedCalc.campos.map((campo, i) => (
                  <div key={i}>
                    <label className="text-xs text-gray-500 block mb-1">{campo.nome} {campo.unidade && `(${campo.unidade})`}</label>
                    {campo.tipo === 'number' ? (
                      <input type="number" placeholder={campo.placeholder} className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-sm text-white" />
                    ) : (
                      <select className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700/50 rounded-lg text-sm text-gray-300">
                        <option value="">Selecione...</option>
                        {campo.opcoes?.map((op, j) => <option key={j} value={op}>{op}</option>)}
                      </select>
                    )}
                  </div>
                ))}
              </div>

              <button className="w-full py-2 bg-violet-500/20 text-violet-300 rounded-lg hover:bg-violet-500/30 text-sm mb-4">
                Calcular
              </button>

              {/* Fórmula */}
              <div className="p-3 bg-gray-900/50 rounded-lg mb-4">
                <span className="text-xs text-gray-500">Fórmula:</span>
                <p className="text-sm text-gray-300 font-mono">{selectedCalc.formula}</p>
              </div>

              {/* Interpretação */}
              <div className="space-y-2">
                <span className="text-xs text-gray-500">Interpretação:</span>
                {selectedCalc.interpretacao.map((interp, i) => (
                  <div key={i} className={`flex items-center justify-between p-2 bg-${interp.cor}-500/5 border border-${interp.cor}-500/20 rounded-lg`}>
                    <span className="text-xs text-gray-400">{interp.faixa}</span>
                    <span className={`text-xs font-medium text-${interp.cor}-400`}>{interp.resultado}</span>
                  </div>
                ))}
              </div>

              {/* Referência */}
              <div className="mt-4 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <span className="text-xs text-blue-400">Referência:</span>
                <p className="text-xs text-gray-400 mt-1">{selectedCalc.referencia}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredCalcs.map(calc => (
                <button
                  key={calc.id}
                  onClick={() => setSelectedCalc(calc)}
                  className="text-left p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-violet-500/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white">{calc.nome}</span>
                    <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[10px] rounded-full">{calc.categoria}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{calc.descricao}</p>
                  <p className="text-[10px] text-gray-600 mt-2 truncate">{calc.referencia}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Anonimização */}
      {activeTab === 'anonimizacao' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-400" />
              Anonimização de Dados — LGPD Compliance
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Ferramenta para anonimizar prontuários e casos clínicos para uso acadêmico, pesquisa e publicação, em conformidade com a LGPD (Lei 13.709/2018) e a Resolução CFM 2.217/2018.
            </p>

            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => setShowAnonimizado(!showAnonimizado)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm ${
                  showAnonimizado ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'
                }`}
              >
                {showAnonimizado ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showAnonimizado ? 'Dados Anonimizados' : 'Dados Originais (Demo)'}
              </button>
            </div>

            <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
              <h4 className="text-sm font-semibold text-white mb-3">{CASO_ANONIMIZADO.titulo}</h4>
              <span className="text-xs text-violet-400">{CASO_ANONIMIZADO.especialidade}</span>
              <p className="text-sm text-gray-400 mt-2">{CASO_ANONIMIZADO.resumo}</p>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {Object.entries(showAnonimizado ? CASO_ANONIMIZADO.dadosAnonimizados : CASO_ANONIMIZADO.dadosOriginais).map(([key, val]) => (
                  <div key={key} className="p-2 bg-gray-800/50 rounded-lg">
                    <span className="text-xs text-gray-500">{key}</span>
                    <p className={`text-sm ${showAnonimizado ? 'text-green-400' : 'text-red-400'}`}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { campo: 'Nome completo', acao: 'Iniciais + idade', lei: 'Art. 12 LGPD' },
                { campo: 'CPF / RG', acao: 'Mascarado', lei: 'Art. 5º, II LGPD' },
                { campo: 'Endereço', acao: 'Removido', lei: 'Art. 5º, II LGPD' },
                { campo: 'Telefone', acao: 'Removido', lei: 'Art. 5º, II LGPD' },
                { campo: 'Convênio/Matrícula', acao: 'Removido', lei: 'Art. 5º, II LGPD' },
                { campo: 'Data de nascimento', acao: 'Apenas ano/idade', lei: 'Art. 12 LGPD' },
              ].map((item, i) => (
                <div key={i} className="p-2 bg-gray-900/50 rounded-lg text-center">
                  <span className="text-xs text-white block">{item.campo}</span>
                  <span className="text-xs text-green-400 block">{item.acao}</span>
                  <span className="text-[10px] text-gray-600">{item.lei}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modo Estudo */}
      {activeTab === 'estudo' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Modo Estudo — Simulação de Prontuário
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Pratique o preenchimento de prontuários com casos clínicos simulados. O sistema avalia sua evolução SOAP e sugere melhorias.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {[
                { titulo: 'Caso 1: IAM com Supra ST', especialidade: 'Cardiologia', dificuldade: 'Intermediário', tempo: '20 min', completado: true },
                { titulo: 'Caso 2: Cetoacidose Diabética', especialidade: 'Endocrinologia', dificuldade: 'Avançado', tempo: '25 min', completado: true },
                { titulo: 'Caso 3: Pneumonia Comunitária', especialidade: 'Pneumologia', dificuldade: 'Básico', tempo: '15 min', completado: false },
                { titulo: 'Caso 4: AVC Isquêmico', especialidade: 'Neurologia', dificuldade: 'Avançado', tempo: '30 min', completado: false },
                { titulo: 'Caso 5: Abdome Agudo', especialidade: 'Cirurgia', dificuldade: 'Intermediário', tempo: '20 min', completado: false },
                { titulo: 'Caso 6: Crise Asmática', especialidade: 'Pneumologia', dificuldade: 'Básico', tempo: '15 min', completado: false },
              ].map((caso, i) => (
                <div key={i} className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  caso.completado ? 'bg-green-500/5 border-green-500/20' : 'bg-gray-900/50 border-gray-700/50 hover:border-blue-500/30'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                      caso.dificuldade === 'Básico' ? 'bg-green-500/20 text-green-400' :
                      caso.dificuldade === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>{caso.dificuldade}</span>
                    {caso.completado && <CheckCircle className="w-4 h-4 text-green-400" />}
                  </div>
                  <h4 className="text-sm font-medium text-white">{caso.titulo}</h4>
                  <span className="text-xs text-gray-500">{caso.especialidade} • {caso.tempo}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-cyan-400" />
              Flashcards — Revisão Espaçada (Anki-style)
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Sistema de flashcards com repetição espaçada para fixação de conteúdo. Ideal para preparação de provas de residência médica.
            </p>

            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { area: 'Clínica Médica', cards: 45, revisados: 32, cor: 'blue' },
                { area: 'Cirurgia', cards: 30, revisados: 18, cor: 'red' },
                { area: 'Pediatria', cards: 25, revisados: 20, cor: 'green' },
                { area: 'GO', cards: 20, revisados: 12, cor: 'purple' },
              ].map((deck, i) => (
                <div key={i} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700/50 cursor-pointer hover:border-cyan-500/30">
                  <h4 className={`text-sm font-medium text-${deck.cor}-400`}>{deck.area}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{deck.cards} cards</span>
                    <span className="text-xs text-gray-400">{deck.revisados}/{deck.cards}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div className={`h-full bg-${deck.cor}-500 rounded-full`} style={{ width: `${(deck.revisados / deck.cards) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Demo Flashcard */}
            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-xl p-8 border border-cyan-500/20 text-center">
              <span className="text-xs text-cyan-400 mb-4 block">Clínica Médica — Card 33/45</span>
              <h3 className="text-xl font-bold text-white mb-2">Critérios de Light para Derrame Pleural</h3>
              <p className="text-sm text-gray-400 mb-6">Quais são os 3 critérios que diferenciam exsudato de transudato?</p>
              
              <div className="bg-gray-900/50 rounded-lg p-4 text-left mb-4">
                <p className="text-sm text-cyan-300 font-medium mb-2">Exsudato se qualquer um dos critérios:</p>
                <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                  <li>Proteína pleural / sérica &gt; 0.5</li>
                  <li>LDH pleural / sérica &gt; 0.6</li>
                  <li>LDH pleural &gt; 2/3 do limite superior normal sérico</li>
                </ol>
                <p className="text-xs text-gray-500 mt-3">Ref: Light RW et al. Ann Intern Med. 1972;77(4):507-513</p>
              </div>

              <div className="flex justify-center gap-3">
                <button className="px-6 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30">Errei</button>
                <button className="px-6 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30">Difícil</button>
                <button className="px-6 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30">Fácil</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-xs text-yellow-400/80">
          <strong>Aviso Educacional:</strong> As calculadoras médicas são ferramentas de apoio ao estudo e NÃO substituem o julgamento clínico. Todas as referências são de publicações indexadas e guidelines oficiais. A anonimização segue os critérios da LGPD (Lei 13.709/2018). Dados de pacientes são fictícios.
        </p>
      </div>
    </div>
  );
}
