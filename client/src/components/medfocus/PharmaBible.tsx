import { useState } from "react";
import { trpc } from "../../lib/trpc";
import EducationalDisclaimer from './EducationalDisclaimer';

type Tab = 'classes' | 'search' | 'monograph' | 'prescriptionGuide' | 'compare' | 'ask' | 'classDetail' | 'bulaAnvisa';

interface DrugClass {
  id: string;
  name: string;
  icon: string;
  description: string;
  subclassCount: number;
  prototypeCount: number;
  subclasses: string[];
  prototypes: string[];
}

export default function PharmaBible() {
  const [activeTab, setActiveTab] = useState<Tab>('classes');
  const [userProfile, setUserProfile] = useState<'student' | 'professor' | 'doctor'>('student');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'name' | 'class' | 'indication' | 'mechanism' | 'interaction'>('name');
  const [drugName, setDrugName] = useState('');
  const [condition, setCondition] = useState('');
  const [compareDrugs, setCompareDrugs] = useState<string[]>(['', '']);
  const [question, setQuestion] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');

  // ANVISA Bula state
  const [bulaSearchQuery, setBulaSearchQuery] = useState('');
  const [bulaResults, setBulaResults] = useState<any[]>([]);
  const [bulaLoading, setBulaLoading] = useState(false);
  const [farmacoData, setFarmacoData] = useState<any>(null);
  const [selectedBulaDrug, setSelectedBulaDrug] = useState('');

  // Results
  const [monographResult, setMonographResult] = useState<any>(null);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [prescriptionResult, setPrescriptionResult] = useState<any>(null);
  const [compareResult, setCompareResult] = useState<any>(null);
  const [askResult, setAskResult] = useState<any>(null);
  const [classDetailResult, setClassDetailResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // tRPC
  const classesQuery = trpc.pharmaBible.getClasses.useQuery();
  const monographMutation = trpc.pharmaBible.getDrugMonograph.useMutation();
  const searchMutation = trpc.pharmaBible.smartSearch.useMutation();
  const prescriptionMutation = trpc.pharmaBible.getPrescriptionGuide.useMutation();
  const compareMutation = trpc.pharmaBible.compareDrugs.useMutation();
  const askMutation = trpc.pharmaBible.askPharmacologist.useMutation();
  const classDetailMutation = trpc.pharmaBible.getClassDetails.useMutation();

  const handleMonograph = async () => {
    if (!drugName.trim()) return;
    setLoading(true);
    try {
      const result = await monographMutation.mutateAsync({ drugName, userProfile });
      setMonographResult(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const result = await searchMutation.mutateAsync({ query: searchQuery, searchType });
      setSearchResult(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handlePrescription = async () => {
    if (!condition.trim()) return;
    setLoading(true);
    try {
      const result = await prescriptionMutation.mutateAsync({ condition });
      setPrescriptionResult(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleCompare = async () => {
    const drugs = compareDrugs.filter(d => d.trim());
    if (drugs.length < 2) return;
    setLoading(true);
    try {
      const result = await compareMutation.mutateAsync({ drugs });
      setCompareResult(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const result = await askMutation.mutateAsync({ question });
      setAskResult(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleBulaSearch = async () => {
    if (!bulaSearchQuery.trim()) return;
    handleBulaSearchDirect(bulaSearchQuery);
  };

  const handleBulaSearchDirect = async (nome: string) => {
    setBulaLoading(true);
    setSelectedBulaDrug(nome);
    try {
      const res = await fetch(`/api/anvisa/farmaco/${encodeURIComponent(nome)}`);
      if (res.ok) {
        const data = await res.json();
        setFarmacoData(data);
        setBulaResults(data.bulas || []);
      }
    } catch (e) { console.error(e); }
    setBulaLoading(false);
  };

  const handleClassDetail = async (classId: string) => {
    setSelectedClassId(classId);
    setActiveTab('classDetail');
    setLoading(true);
    try {
      const result = await classDetailMutation.mutateAsync({ classId });
      setClassDetailResult(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const openMonograph = (name: string) => {
    setDrugName(name);
    setActiveTab('monograph');
    setTimeout(() => handleMonographDirect(name), 100);
  };

  const handleMonographDirect = async (name: string) => {
    setLoading(true);
    try {
      const result = await monographMutation.mutateAsync({ drugName: name, userProfile });
      setMonographResult(result);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'classes', label: 'Classes Terapêuticas', icon: '📚' },
    { id: 'search', label: 'Busca Inteligente', icon: '🔍' },
    { id: 'monograph', label: 'Monografia', icon: '📋' },
    { id: 'prescriptionGuide', label: 'Guia de Prescrição', icon: '📝' },
    { id: 'compare', label: 'Comparar Fármacos', icon: '⚖️' },
    { id: 'ask', label: 'Pergunte ao Farmacologista', icon: '🤖' },
    { id: 'bulaAnvisa', label: 'Bula ANVISA', icon: '📄' },
  ];

  return (
    <div className="space-y-6">
      <EducationalDisclaimer variant="banner" moduleName="Bíblia Farmacológica" />
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">💊</span> Bíblia Farmacológica
            </h1>
            <p className="mt-2 text-emerald-100 text-lg">
              Referência completa de farmacologia clínica com IA — 20 classes terapêuticas, 200+ fármacos
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="text-sm text-emerald-200">Perfil de visualização:</span>
            <div className="flex gap-1 bg-white/20 rounded-lg p-1">
              {(['student', 'professor', 'doctor'] as const).map(p => (
                <button key={p} onClick={() => setUserProfile(p)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${userProfile === p ? 'bg-white text-emerald-700' : 'text-white/80 hover:bg-white/10'}`}>
                  {p === 'student' ? '🎓 Estudante' : p === 'professor' ? '👨‍🏫 Professor' : '🩺 Médico'}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Stats */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[
            { label: 'Classes Terapêuticas', value: '20', icon: '📂' },
            { label: 'Subclasses', value: '120+', icon: '📁' },
            { label: 'Fármacos Protótipo', value: '200+', icon: '💊' },
            { label: 'Fontes de Dados', value: 'OpenFDA + Dr. Focus AI', icon: '🔗' },
          ].map((s, i) => (
            <div key={i} className="bg-white/15 rounded-xl p-3 text-center">
              <div className="text-2xl">{s.icon}</div>
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-emerald-100">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-700 dark:text-emerald-400' : 'text-gray-600 dark:text-gray-400 hover:bg-white/50'}`}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">Consultando base farmacológica com IA...</p>
          </div>
        </div>
      )}

      {/* Tab: Classes Terapêuticas */}
      {activeTab === 'classes' && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {(classesQuery.data || []).map((cls: DrugClass) => (
            <div key={cls.id} onClick={() => handleClassDetail(cls.id)}
              className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-emerald-400 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{cls.icon}</span>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 transition-colors">{cls.name}</h3>
                  <div className="flex gap-2 text-xs text-gray-500">
                    <span>{cls.subclassCount} subclasses</span>
                    <span>•</span>
                    <span>{cls.prototypeCount} protótipos</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{cls.description}</p>
              <div className="flex flex-wrap gap-1">
                {cls.prototypes.slice(0, 4).map((p: string, i: number) => (
                  <span key={i} className="text-xs bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">{p}</span>
                ))}
                {cls.prototypes.length > 4 && (
                  <span className="text-xs text-gray-400">+{cls.prototypes.length - 4}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Class Detail */}
      {activeTab === 'classDetail' && !loading && classDetailResult && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <button onClick={() => setActiveTab('classes')} className="text-sm text-emerald-600 hover:underline mb-4 flex items-center gap-1">
            ← Voltar às classes
          </button>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{classDetailResult.className}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{classDetailResult.overview}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-lg mb-3 text-emerald-700">Mecanismo Comum</h3>
              <p className="text-gray-700 dark:text-gray-300 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">{classDetailResult.commonMechanism}</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3 text-blue-700">Fármaco Protótipo</h3>
              <p className="text-gray-700 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">{classDetailResult.prototypeDrug}</p>
            </div>
          </div>

          {classDetailResult.drugs?.length > 0 && (
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-3">Fármacos da Classe</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="text-left p-3 font-semibold">Fármaco</th>
                    <th className="text-left p-3 font-semibold">Característica Distintiva</th>
                    <th className="text-left p-3 font-semibold">Eficácia Relativa</th>
                    <th className="text-center p-3 font-semibold">Ação</th>
                  </tr></thead>
                  <tbody>
                    {classDetailResult.drugs.map((d: any, i: number) => (
                      <tr key={i} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750">
                        <td className="p-3 font-medium text-emerald-700 dark:text-emerald-400">{d.name}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">{d.distinguishingFeature}</td>
                        <td className="p-3 text-gray-600 dark:text-gray-400">{d.relativeEfficacy}</td>
                        <td className="p-3 text-center">
                          <button onClick={() => openMonograph(d.name)} className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full hover:bg-emerald-200">
                            Ver Monografia
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {classDetailResult.commonIndications?.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <h4 className="font-bold text-green-800 dark:text-green-400 mb-2">Indicações Comuns</h4>
                <ul className="space-y-1">{classDetailResult.commonIndications.map((ind: string, i: number) => (
                  <li key={i} className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> {ind}</li>
                ))}</ul>
              </div>
            )}
            {classDetailResult.classContraindications?.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                <h4 className="font-bold text-red-800 dark:text-red-400 mb-2">Contraindicações da Classe</h4>
                <ul className="space-y-1">{classDetailResult.classContraindications.map((c: string, i: number) => (
                  <li key={i} className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2"><span className="text-red-500 mt-0.5">✗</span> {c}</li>
                ))}</ul>
              </div>
            )}
          </div>

          {classDetailResult.clinicalPearls?.length > 0 && (
            <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
              <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-2">Pérolas Clínicas</h4>
              <ul className="space-y-1">{classDetailResult.clinicalPearls.map((p: string, i: number) => (
                <li key={i} className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2"><span>💡</span> {p}</li>
              ))}</ul>
            </div>
          )}

          {classDetailResult.mnemonics?.length > 0 && (
            <div className="mt-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <h4 className="font-bold text-purple-800 dark:text-purple-400 mb-2">Mnemônicos</h4>
              <ul className="space-y-1">{classDetailResult.mnemonics.map((m: string, i: number) => (
                <li key={i} className="text-sm text-purple-700 dark:text-purple-300 flex items-start gap-2"><span>🧠</span> {m}</li>
              ))}</ul>
            </div>
          )}
        </div>
      )}

      {/* Tab: Busca Inteligente */}
      {activeTab === 'search' && !loading && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">Busca Inteligente de Fármacos</h2>
            <div className="flex gap-2 mb-4">
              {(['name', 'class', 'indication', 'mechanism', 'interaction'] as const).map(t => (
                <button key={t} onClick={() => setSearchType(t)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${searchType === t ? 'bg-emerald-100 text-emerald-700 font-medium' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                  {t === 'name' ? 'Por Nome' : t === 'class' ? 'Por Classe' : t === 'indication' ? 'Por Indicação' : t === 'mechanism' ? 'Por Mecanismo' : 'Por Interação'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Ex: anti-hipertensivos para gestante, inibidor de bomba de prótons, alternativa ao metformina..."
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <button onClick={handleSearch} className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">Buscar</button>
            </div>
          </div>

          {searchResult?.results?.length > 0 && (
            <div className="space-y-3">
              {searchResult.results.map((r: any, i: number) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-emerald-400 cursor-pointer transition-all"
                  onClick={() => openMonograph(r.genericName || r.name)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{r.name}</h3>
                      <p className="text-sm text-gray-500">{r.genericName} — {r.drugClass}</p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full">{r.mainIndication}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{r.briefDescription}</p>
                </div>
              ))}
              {searchResult.suggestedSearches?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm text-gray-500">Sugestões:</span>
                  {searchResult.suggestedSearches.map((s: string, i: number) => (
                    <button key={i} onClick={() => { setSearchQuery(s); handleSearch(); }}
                      className="text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full hover:bg-emerald-100 text-gray-600 dark:text-gray-400">{s}</button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Monografia */}
      {activeTab === 'monograph' && !loading && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">Monografia Farmacológica Completa</h2>
            <div className="flex gap-2">
              <input value={drugName} onChange={e => setDrugName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleMonograph()}
                placeholder="Nome do fármaco (ex: Enalapril, Metformina, Amoxicilina...)"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <button onClick={handleMonograph} className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">Gerar Monografia</button>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="text-xs text-gray-500">Populares:</span>
              {['Enalapril', 'Metformina', 'Amoxicilina', 'Losartana', 'Omeprazol', 'Atorvastatina'].map(d => (
                <button key={d} onClick={() => { setDrugName(d); }} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full hover:bg-emerald-100">{d}</button>
              ))}
            </div>
          </div>

          {monographResult?.monograph && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Monograph Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                <h2 className="text-2xl font-bold">{monographResult.monograph.genericName}</h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {monographResult.monograph.brandNames?.map((b: string, i: number) => (
                    <span key={i} className="bg-white/20 px-2 py-0.5 rounded text-sm">{b}</span>
                  ))}
                </div>
                <div className="flex gap-4 mt-3 text-sm text-emerald-100">
                  <span>Classe: {monographResult.monograph.drugClass}</span>
                  <span>•</span>
                  <span>Subclasse: {monographResult.monograph.subClass}</span>
                </div>
                {monographResult.fdaData?.available && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">FDA Verificado</span>
                    {monographResult.fdaData.recalls?.length > 0 && (
                      <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">{monographResult.fdaData.recalls.length} Recall(s)</span>
                    )}
                  </div>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Mecanismo de Ação */}
                <section>
                  <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-2 flex items-center gap-2"><span>⚙️</span> Mecanismo de Ação</h3>
                  <p className="text-gray-700 dark:text-gray-300 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg">{monographResult.monograph.mechanismOfAction}</p>
                </section>

                {/* Farmacocinética */}
                {monographResult.monograph.pharmacokinetics && (
                  <section>
                    <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2"><span>📊</span> Farmacocinética</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                      {Object.entries(monographResult.monograph.pharmacokinetics).map(([key, val]: [string, any]) => (
                        <div key={key} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase">
                            {key === 'halfLife' ? 'Meia-vida' : key === 'bioavailability' ? 'Biodisponibilidade' : key === 'proteinBinding' ? 'Ligação Proteica' : key === 'onsetOfAction' ? 'Início de Ação' : key === 'peakEffect' ? 'Pico de Efeito' : key === 'duration' ? 'Duração' : key === 'absorption' ? 'Absorção' : key === 'distribution' ? 'Distribuição' : key === 'metabolism' ? 'Metabolismo' : 'Eliminação'}
                          </div>
                          <div className="text-sm text-gray-800 dark:text-gray-200 mt-1 font-medium">{val}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Farmacodinâmica */}
                <section>
                  <h3 className="text-lg font-bold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2"><span>🎯</span> Farmacodinâmica</h3>
                  <p className="text-gray-700 dark:text-gray-300 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">{monographResult.monograph.pharmacodynamics}</p>
                </section>

                {/* Indicações e Contraindicações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <section className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                    <h3 className="font-bold text-green-800 dark:text-green-400 mb-2">Indicações</h3>
                    <ul className="space-y-1">{monographResult.monograph.indications?.map((ind: string, i: number) => (
                      <li key={i} className="text-sm text-green-700 dark:text-green-300 flex items-start gap-2"><span className="mt-0.5">✓</span> {ind}</li>
                    ))}</ul>
                  </section>
                  <section className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                    <h3 className="font-bold text-red-800 dark:text-red-400 mb-2">Contraindicações</h3>
                    <ul className="space-y-1">{monographResult.monograph.contraindications?.map((c: string, i: number) => (
                      <li key={i} className="text-sm text-red-700 dark:text-red-300 flex items-start gap-2"><span className="mt-0.5">✗</span> {c}</li>
                    ))}</ul>
                  </section>
                </div>

                {/* Posologia */}
                {monographResult.monograph.dosage && (
                  <section>
                    <h3 className="text-lg font-bold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-2"><span>💉</span> Posologia</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(monographResult.monograph.dosage).map(([key, val]: [string, any]) => (
                        <div key={key} className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                          <div className="text-xs text-orange-600 dark:text-orange-400 font-medium uppercase">
                            {key === 'adult' ? 'Adulto' : key === 'pediatric' ? 'Pediátrico' : key === 'geriatric' ? 'Geriátrico' : key === 'renalAdjustment' ? 'Ajuste Renal' : key === 'hepaticAdjustment' ? 'Ajuste Hepático' : 'Dose Máxima'}
                          </div>
                          <div className="text-sm text-gray-800 dark:text-gray-200 mt-1">{val}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Efeitos Adversos */}
                {monographResult.monograph.adverseEffects && (
                  <section>
                    <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2"><span>⚠️</span> Efeitos Adversos</h3>
                    {monographResult.monograph.adverseEffects.blackBoxWarning && (
                      <div className="bg-black text-white p-4 rounded-lg mb-3 border-2 border-red-600">
                        <div className="font-bold text-red-400 mb-1">⬛ BLACK BOX WARNING</div>
                        <p className="text-sm">{monographResult.monograph.adverseEffects.blackBoxWarning}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                        <h4 className="font-medium text-yellow-800 dark:text-yellow-400 text-sm mb-2">Comuns (&gt;10%)</h4>
                        <ul className="space-y-0.5">{monographResult.monograph.adverseEffects.common?.map((e: string, i: number) => (
                          <li key={i} className="text-xs text-yellow-700 dark:text-yellow-300">• {e}</li>
                        ))}</ul>
                      </div>
                      <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                        <h4 className="font-medium text-orange-800 dark:text-orange-400 text-sm mb-2">Graves</h4>
                        <ul className="space-y-0.5">{monographResult.monograph.adverseEffects.serious?.map((e: string, i: number) => (
                          <li key={i} className="text-xs text-orange-700 dark:text-orange-300">• {e}</li>
                        ))}</ul>
                      </div>
                      <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                        <h4 className="font-medium text-red-800 dark:text-red-400 text-sm mb-2">Raros (&lt;1%)</h4>
                        <ul className="space-y-0.5">{monographResult.monograph.adverseEffects.rare?.map((e: string, i: number) => (
                          <li key={i} className="text-xs text-red-700 dark:text-red-300">• {e}</li>
                        ))}</ul>
                      </div>
                    </div>
                  </section>
                )}

                {/* Interações */}
                {monographResult.monograph.interactions && (
                  <section>
                    <h3 className="text-lg font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2"><span>🔄</span> Interações</h3>
                    {monographResult.monograph.interactions.drugs?.length > 0 && (
                      <div className="overflow-x-auto mb-3">
                        <table className="w-full text-sm">
                          <thead><tr className="bg-amber-50 dark:bg-amber-900/20">
                            <th className="text-left p-2 font-semibold">Fármaco</th>
                            <th className="text-left p-2 font-semibold">Gravidade</th>
                            <th className="text-left p-2 font-semibold">Efeito</th>
                          </tr></thead>
                          <tbody>{monographResult.monograph.interactions.drugs.map((d: any, i: number) => (
                            <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                              <td className="p-2 font-medium">{d.name}</td>
                              <td className="p-2"><span className={`text-xs px-2 py-0.5 rounded-full ${d.severity?.toLowerCase().includes('grave') || d.severity?.toLowerCase().includes('major') ? 'bg-red-100 text-red-700' : d.severity?.toLowerCase().includes('moder') ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>{d.severity}</span></td>
                              <td className="p-2 text-gray-600 dark:text-gray-400">{d.effect}</td>
                            </tr>
                          ))}</tbody>
                        </table>
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {monographResult.monograph.interactions.food?.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                          <h4 className="font-medium text-amber-800 text-sm mb-1">Alimentos</h4>
                          <ul>{monographResult.monograph.interactions.food.map((f: string, i: number) => (
                            <li key={i} className="text-xs text-amber-700">• {f}</li>
                          ))}</ul>
                        </div>
                      )}
                      {monographResult.monograph.interactions.alcohol && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                          <h4 className="font-medium text-amber-800 text-sm mb-1">Álcool</h4>
                          <p className="text-xs text-amber-700">{monographResult.monograph.interactions.alcohol}</p>
                        </div>
                      )}
                      {monographResult.monograph.interactions.labTests?.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                          <h4 className="font-medium text-amber-800 text-sm mb-1">Exames Laboratoriais</h4>
                          <ul>{monographResult.monograph.interactions.labTests.map((t: string, i: number) => (
                            <li key={i} className="text-xs text-amber-700">• {t}</li>
                          ))}</ul>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {/* Populações Especiais */}
                {monographResult.monograph.specialPopulations && (
                  <section>
                    <h3 className="text-lg font-bold text-indigo-700 dark:text-indigo-400 mb-2 flex items-center gap-2"><span>👥</span> Populações Especiais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {Object.entries(monographResult.monograph.specialPopulations).map(([key, val]: [string, any]) => (
                        <div key={key} className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3">
                          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium uppercase">
                            {key === 'pregnancy' ? '🤰 Gravidez' : key === 'lactation' ? '🤱 Lactação' : key === 'pediatric' ? '👶 Pediátrico' : key === 'geriatric' ? '🧓 Geriátrico' : key === 'renalImpairment' ? '🫘 Insuf. Renal' : '🫁 Insuf. Hepática'}
                          </div>
                          <div className="text-sm text-gray-800 dark:text-gray-200 mt-1">{val}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Monitoramento e Orientações */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monographResult.monograph.monitoring?.length > 0 && (
                    <section className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                      <h3 className="font-bold text-cyan-800 dark:text-cyan-400 mb-2">Monitoramento</h3>
                      <ul className="space-y-1">{monographResult.monograph.monitoring.map((m: string, i: number) => (
                        <li key={i} className="text-sm text-cyan-700 dark:text-cyan-300 flex items-start gap-2"><span>📋</span> {m}</li>
                      ))}</ul>
                    </section>
                  )}
                  {monographResult.monograph.patientCounseling?.length > 0 && (
                    <section className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4">
                      <h3 className="font-bold text-teal-800 dark:text-teal-400 mb-2">Orientação ao Paciente</h3>
                      <ul className="space-y-1">{monographResult.monograph.patientCounseling.map((p: string, i: number) => (
                        <li key={i} className="text-sm text-teal-700 dark:text-teal-300 flex items-start gap-2"><span>💬</span> {p}</li>
                      ))}</ul>
                    </section>
                  )}
                </div>

                {/* Pérolas Clínicas */}
                {monographResult.monograph.clinicalPearls?.length > 0 && (
                  <section className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                    <h3 className="font-bold text-amber-800 dark:text-amber-400 mb-2">Pérolas Clínicas</h3>
                    <ul className="space-y-1">{monographResult.monograph.clinicalPearls.map((p: string, i: number) => (
                      <li key={i} className="text-sm text-amber-700 dark:text-amber-300 flex items-start gap-2"><span>💡</span> {p}</li>
                    ))}</ul>
                  </section>
                )}

                {/* FDA Adverse Events Stats */}
                {monographResult.fdaData?.adverseStats?.length > 0 && (
                  <section>
                    <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <span>📈</span> Eventos Adversos Reportados (FDA)
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      {monographResult.fdaData.adverseStats.map((s: any, i: number) => (
                        <div key={i} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
                          <div className="text-lg font-bold text-blue-700 dark:text-blue-400">{s.count?.toLocaleString()}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 truncate" title={s.term}>{s.term}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Referências */}
                {monographResult.monograph.references?.length > 0 && (
                  <section className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Referências</h3>
                    <ol className="list-decimal list-inside space-y-0.5">
                      {monographResult.monograph.references.map((r: string, i: number) => (
                        <li key={i} className="text-xs text-gray-500 dark:text-gray-400">{r}</li>
                      ))}
                    </ol>
                  </section>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Guia de Prescrição */}
      {activeTab === 'prescriptionGuide' && !loading && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">Guia de Prescrição por Condição Clínica</h2>
            <div className="flex gap-2">
              <input value={condition} onChange={e => setCondition(e.target.value)} onKeyDown={e => e.key === 'Enter' && handlePrescription()}
                placeholder="Condição clínica (ex: Hipertensão arterial, Diabetes tipo 2, Pneumonia comunitária...)"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <button onClick={handlePrescription} className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">Gerar Guia</button>
            </div>
            <div className="flex gap-2 mt-2">
              <span className="text-xs text-gray-500">Sugestões:</span>
              {['Hipertensão Arterial', 'Diabetes Tipo 2', 'Pneumonia Comunitária', 'Insuficiência Cardíaca', 'Asma', 'Depressão'].map(c => (
                <button key={c} onClick={() => setCondition(c)} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full hover:bg-emerald-100">{c}</button>
              ))}
            </div>
          </div>

          {prescriptionResult?.condition && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{prescriptionResult.condition}</h2>
              <p className="text-gray-600 dark:text-gray-400">{prescriptionResult.overview}</p>

              {[{ title: '1ª Linha', data: prescriptionResult.firstLine, color: 'green' },
                { title: '2ª Linha', data: prescriptionResult.secondLine, color: 'blue' },
                { title: '3ª Linha', data: prescriptionResult.thirdLine, color: 'purple' }].map((line, idx) => (
                line.data?.length > 0 && (
                  <div key={idx}>
                    <h3 className={`font-bold text-lg text-${line.color}-700 dark:text-${line.color}-400 mb-2`}>{line.title}</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead><tr className={`bg-${line.color}-50 dark:bg-${line.color}-900/20`}>
                          <th className="text-left p-2">Fármaco</th>
                          <th className="text-left p-2">Dose</th>
                          <th className="text-left p-2">Duração</th>
                          <th className="text-left p-2">Evidência</th>
                        </tr></thead>
                        <tbody>{line.data.map((d: any, i: number) => (
                          <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                            <td className="p-2 font-medium text-emerald-700 dark:text-emerald-400 cursor-pointer hover:underline" onClick={() => openMonograph(d.drug)}>{d.drug}</td>
                            <td className="p-2">{d.dose}</td>
                            <td className="p-2">{d.duration}</td>
                            <td className="p-2"><span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{d.evidence}</span></td>
                          </tr>
                        ))}</tbody>
                      </table>
                    </div>
                  </div>
                )
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptionResult.specialConsiderations?.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4">
                    <h4 className="font-bold text-amber-800 mb-2">Considerações Especiais</h4>
                    <ul className="space-y-1">{prescriptionResult.specialConsiderations.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-amber-700 flex items-start gap-2"><span>⚠️</span> {s}</li>
                    ))}</ul>
                  </div>
                )}
                {prescriptionResult.monitoringRequired?.length > 0 && (
                  <div className="bg-cyan-50 dark:bg-cyan-900/20 rounded-lg p-4">
                    <h4 className="font-bold text-cyan-800 mb-2">Monitoramento Necessário</h4>
                    <ul className="space-y-1">{prescriptionResult.monitoringRequired.map((m: string, i: number) => (
                      <li key={i} className="text-sm text-cyan-700 flex items-start gap-2"><span>📋</span> {m}</li>
                    ))}</ul>
                  </div>
                )}
              </div>

              {prescriptionResult.referenceGuidelines?.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-bold text-gray-700 mb-2">Diretrizes de Referência</h4>
                  <ul>{prescriptionResult.referenceGuidelines.map((r: string, i: number) => (
                    <li key={i} className="text-xs text-gray-500">📖 {r}</li>
                  ))}</ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Comparar Fármacos */}
      {activeTab === 'compare' && !loading && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">Comparar Fármacos</h2>
            <div className="space-y-2">
              {compareDrugs.map((d, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <span className="text-sm text-gray-500 w-24">Fármaco {i + 1}:</span>
                  <input value={d} onChange={e => { const nd = [...compareDrugs]; nd[i] = e.target.value; setCompareDrugs(nd); }}
                    placeholder={`Nome do fármaco ${i + 1}`}
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  {i > 1 && (
                    <button onClick={() => setCompareDrugs(compareDrugs.filter((_, idx) => idx !== i))} className="text-red-500 hover:text-red-700 text-sm">Remover</button>
                  )}
                </div>
              ))}
              <div className="flex gap-2">
                {compareDrugs.length < 5 && (
                  <button onClick={() => setCompareDrugs([...compareDrugs, ''])} className="text-sm text-emerald-600 hover:underline">+ Adicionar fármaco</button>
                )}
                <button onClick={handleCompare} className="ml-auto px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm">Comparar</button>
              </div>
            </div>
          </div>

          {compareResult?.comparison?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold mb-4">{compareResult.drugs?.join(' vs ')}</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead><tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="text-left p-3 font-semibold">Parâmetro</th>
                    {compareResult.drugs?.map((d: string, i: number) => (
                      <th key={i} className="text-left p-3 font-semibold text-emerald-700 dark:text-emerald-400">{d}</th>
                    ))}
                  </tr></thead>
                  <tbody>{compareResult.comparison.map((row: any, i: number) => (
                    <tr key={i} className="border-t border-gray-100 dark:border-gray-700">
                      <td className="p-3 font-medium">{row.parameter}</td>
                      {compareResult.drugs?.map((d: string, j: number) => (
                        <td key={j} className="p-3 text-gray-600 dark:text-gray-400">{row.values?.[d] || '-'}</td>
                      ))}
                    </tr>
                  ))}</tbody>
                </table>
              </div>
              {compareResult.summary && (
                <div className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4">
                  <h4 className="font-bold text-emerald-800 mb-1">Resumo</h4>
                  <p className="text-sm text-emerald-700">{compareResult.summary}</p>
                </div>
              )}
              {compareResult.recommendation && (
                <div className="mt-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                  <h4 className="font-bold text-blue-800 mb-1">Recomendação</h4>
                  <p className="text-sm text-blue-700">{compareResult.recommendation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab: Bula ANVISA */}
      {activeTab === 'bulaAnvisa' && !loading && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-2 flex items-center gap-2">📄 Busca de Bula — Bulário ANVISA</h2>
            <p className="text-sm text-gray-500 mb-4">Busque bulas oficiais diretamente do Bulário Eletrônico da ANVISA e dados farmacológicos completos.</p>
            <div className="flex gap-2">
              <input value={bulaSearchQuery} onChange={e => setBulaSearchQuery(e.target.value)}
                placeholder="Nome do medicamento (ex: Amoxicilina, Losartana, Omeprazol...)"
                onKeyDown={e => e.key === 'Enter' && handleBulaSearch()}
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
              <button onClick={handleBulaSearch} disabled={bulaLoading}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium disabled:opacity-50">
                {bulaLoading ? '🔄 Buscando...' : '🔍 Buscar'}
              </button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {['Dipirona', 'Amoxicilina', 'Losartana', 'Metformina', 'Omeprazol', 'Enalapril', 'Sinvastatina', 'Ibuprofeno'].map(d => (
                <button key={d} onClick={() => { setBulaSearchQuery(d); handleBulaSearchDirect(d); }}
                  className="text-xs bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
                  💊 {d}
                </button>
              ))}
            </div>
          </div>

          {/* Farmacological Data */}
          {farmacoData?.farmacoInfo && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-emerald-200 dark:border-emerald-700">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">💊 Dados Farmacológicos — {selectedBulaDrug}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-3">
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-400 text-sm mb-1">⚙️ Mecanismo de Ação</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{farmacoData.farmacoInfo.mecanismoAcao}</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                    <h4 className="font-bold text-blue-800 dark:text-blue-400 text-sm mb-1">📊 Farmacocinética</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{farmacoData.farmacoInfo.farmacocinetica}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                    <h4 className="font-bold text-purple-800 dark:text-purple-400 text-sm mb-1">💉 Posologia</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{farmacoData.farmacoInfo.posologia}</p>
                  </div>
                  <div className="bg-pink-50 dark:bg-pink-900/20 rounded-lg p-3">
                    <h4 className="font-bold text-pink-800 dark:text-pink-400 text-sm mb-1">🤰 Populações Especiais</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{farmacoData.farmacoInfo.populacoesEspeciais}</p>
                    <div className="mt-1"><span className={`text-xs font-bold px-2 py-0.5 rounded ${farmacoData.farmacoInfo.classificacaoRisco === 'X' ? 'bg-red-600 text-white' : farmacoData.farmacoInfo.classificacaoRisco === 'D' ? 'bg-orange-500 text-white' : farmacoData.farmacoInfo.classificacaoRisco === 'C' ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}>Risco na Gestação: {farmacoData.farmacoInfo.classificacaoRisco}</span></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                    <h4 className="font-bold text-green-800 dark:text-green-400 text-sm mb-1">✅ Indicações</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">{farmacoData.farmacoInfo.indicacoes.map((i: string, idx: number) => <li key={idx}>• {i}</li>)}</ul>
                  </div>
                  <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                    <h4 className="font-bold text-red-800 dark:text-red-400 text-sm mb-1">❌ Contraindicações</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">{farmacoData.farmacoInfo.contraindicacoes.map((c: string, idx: number) => <li key={idx}>• {c}</li>)}</ul>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
                    <h4 className="font-bold text-orange-800 dark:text-orange-400 text-sm mb-1">⚠️ Efeitos Adversos</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">{farmacoData.farmacoInfo.efeitosAdversos.map((e: string, idx: number) => <li key={idx}>• {e}</li>)}</ul>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                    <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm mb-1">🔄 Interações</h4>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-0.5">{farmacoData.farmacoInfo.interacoes.map((i: string, idx: number) => <li key={idx}>• {i}</li>)}</ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANVISA Bula Results */}
          {bulaResults.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-3">📄 Bulas encontradas no Bulário ANVISA ({bulaResults.length})</h3>
              <div className="space-y-2">
                {bulaResults.map((bula: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{bula.nomeProduto}</div>
                      <div className="text-xs text-gray-500">{bula.nomeEmpresa} — {bula.tipoBula} — {bula.dataBula}</div>
                    </div>
                    {bula.urlBula && (
                      <a href={bula.urlBula} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700">Ver Bula PDF</a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* OpenFDA Data */}
          {farmacoData?.openFdaData && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold mb-3">🌐 Dados OpenFDA (Internacional)</h3>
              <div className="space-y-3 text-sm">
                {farmacoData.openFdaData.indicationsAndUsage && (
                  <div><h4 className="font-bold text-gray-700 dark:text-gray-300">Indications & Usage</h4><p className="text-gray-600 dark:text-gray-400 mt-1">{farmacoData.openFdaData.indicationsAndUsage.substring(0, 500)}...</p></div>
                )}
                {farmacoData.openFdaData.mechanismOfAction && (
                  <div><h4 className="font-bold text-gray-700 dark:text-gray-300">Mechanism of Action</h4><p className="text-gray-600 dark:text-gray-400 mt-1">{farmacoData.openFdaData.mechanismOfAction.substring(0, 500)}...</p></div>
                )}
              </div>
            </div>
          )}

          {/* Quick link to ANVISA Bulário */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 text-sm">
            <strong>Fonte oficial:</strong> Dados obtidos do{' '}
            <a href="https://consultas.anvisa.gov.br/#/bulario/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">Bulário Eletrônico da ANVISA</a>{' '}
            e da API <a href="https://open.fda.gov/" target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline">OpenFDA</a>.
            Para bulas completas, consulte sempre o site oficial da ANVISA.
          </div>
        </div>
      )}

      {/* Tab: Pergunte ao Farmacologista */}
      {activeTab === 'ask' && !loading && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-2">Pergunte ao Farmacologista IA</h2>
            <p className="text-sm text-gray-500 mb-4">Faça qualquer pergunta sobre farmacologia, medicamentos, interações, doses ou protocolos.</p>
            <textarea value={question} onChange={e => setQuestion(e.target.value)}
              placeholder="Ex: Qual a diferença entre IECA e BRA? Quando usar um em vez do outro? Quais os ajustes de dose da vancomicina em insuficiência renal?"
              rows={4} className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none" />
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2">
                {['Diferença IECA vs BRA', 'Antibiótico na gestação', 'Ajuste renal vancomicina', 'Antidepressivos na amamentação'].map(q => (
                  <button key={q} onClick={() => setQuestion(q)} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full hover:bg-emerald-100">{q}</button>
                ))}
              </div>
              <button onClick={handleAsk} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium">Perguntar</button>
            </div>
          </div>

          {askResult?.answer && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🤖</span>
                <h3 className="font-bold text-lg">Resposta do Farmacologista IA</h3>
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                {askResult.answer}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
