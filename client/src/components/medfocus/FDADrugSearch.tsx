import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';
import EducationalDisclaimer from './EducationalDisclaimer';

export default function FDADrugSearch() {
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'info' | 'adverse'>('search');
  const [selectedDrug, setSelectedDrug] = useState('');
  const [drugInfo, setDrugInfo] = useState<any>(null);

  const searchQuery = trpc.fda.searchDrugs.useQuery({ query, limit: 10 }, { enabled: query.length > 2 });
  const adverseQuery = trpc.fda.adverseEvents.useQuery({ drugName: selectedDrug, limit: 10 }, { enabled: !!selectedDrug && activeTab === 'adverse' });

  const drugInfoMutation = trpc.fda.drugInfo.useMutation({
    onSuccess: (data) => { setDrugInfo(data); setActiveTab('info'); },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const handleDrugSelect = (drugName: string) => {
    setSelectedDrug(drugName);
    drugInfoMutation.mutate({ drugName });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <EducationalDisclaimer variant="compact" moduleName="Busca FDA" dismissible={false} />
      <div className="bg-gradient-to-r from-indigo-900/50 to-blue-900/50 rounded-2xl p-6 border border-indigo-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-2xl">🏛️</div>
          <div>
            <h2 className="text-2xl font-bold text-white">FDA Drug Database</h2>
            <p className="text-indigo-300 text-sm">Consulta de medicamentos via OpenFDA — Dados oficiais da Food and Drug Administration</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {[
          { id: 'search', label: '🔍 Buscar', icon: '' },
          { id: 'info', label: '📋 Informações', icon: '' },
          { id: 'adverse', label: '⚠️ Eventos Adversos', icon: '' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar medicamento (ex: metformin, amoxicillin, omeprazole)..." className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white text-lg" />
      </div>

      {activeTab === 'search' && searchQuery.data && (
        <div className="space-y-3">
          {searchQuery.data.map((drug: any, i: number) => (
            <div key={i} className="bg-gray-900 rounded-xl p-5 border border-gray-700 hover:border-indigo-600 transition-all cursor-pointer" onClick={() => handleDrugSelect(drug.generic_name || drug.brand_name || query)}>
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-lg font-bold text-white">{drug.brand_name || 'N/A'}</h4>
                  <p className="text-indigo-400 text-sm">{drug.generic_name}</p>
                  <p className="text-gray-500 text-xs mt-1">{drug.manufacturer_name} — {drug.dosage_form} — Via: {drug.route?.join(', ')}</p>
                </div>
                <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-500">Ver Detalhes</button>
              </div>
              {drug.boxed_warning && (
                <div className="mt-3 bg-red-900/20 border border-red-700/50 rounded-lg p-3">
                  <p className="text-xs text-red-400 font-bold mb-1">⚠️ BOXED WARNING:</p>
                  <p className="text-xs text-red-300">{drug.boxed_warning.substring(0, 300)}...</p>
                </div>
              )}
              {drug.indications_and_usage && (
                <div className="mt-2">
                  <p className="text-xs text-gray-500 font-semibold">Indicações:</p>
                  <p className="text-sm text-gray-400">{drug.indications_and_usage[0]?.substring(0, 200)}...</p>
                </div>
              )}
            </div>
          ))}
          {searchQuery.data.length === 0 && query.length > 2 && (
            <p className="text-center text-gray-500 py-8">Nenhum medicamento encontrado para "{query}"</p>
          )}
        </div>
      )}

      {activeTab === 'info' && drugInfo && (
        <div className="space-y-4">
          {drugInfo.fdaData && (
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">📋 Dados FDA Oficiais</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Nome comercial:</span> <span className="text-white">{drugInfo.fdaData.brand_name}</span></div>
                <div><span className="text-gray-500">Genérico:</span> <span className="text-white">{drugInfo.fdaData.generic_name}</span></div>
                <div><span className="text-gray-500">Fabricante:</span> <span className="text-white">{drugInfo.fdaData.manufacturer_name}</span></div>
                <div><span className="text-gray-500">Via:</span> <span className="text-white">{drugInfo.fdaData.route?.join(', ')}</span></div>
              </div>
              {drugInfo.fdaData.warnings && (
                <div className="mt-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3">
                  <p className="text-xs text-yellow-400 font-bold mb-1">Advertências:</p>
                  <p className="text-xs text-yellow-300">{drugInfo.fdaData.warnings.substring(0, 500)}...</p>
                </div>
              )}
            </div>
          )}
          {drugInfo.aiAnalysis && (
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">🤖 Análise Farmacológica (Dr. Focus IA)</h3>
              <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap">{drugInfo.aiAnalysis}</div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'adverse' && selectedDrug && (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-white">⚠️ Eventos Adversos Reportados — {selectedDrug}</h3>
          {adverseQuery.data?.map((event: any, i: number) => (
            <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${event.serious === '1' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                  {event.serious === '1' ? 'GRAVE' : 'Não grave'}
                </span>
                <span className="text-gray-500 text-xs">{event.receivedate}</span>
                <span className="text-gray-500 text-xs">Paciente: {event.patient?.sex}, {event.patient?.age} anos</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {event.patient?.reactions?.map((r: string, j: number) => (
                  <span key={j} className="text-xs bg-red-900/30 text-red-300 px-2 py-0.5 rounded">{r}</span>
                ))}
              </div>
            </div>
          )) || <p className="text-gray-500">Carregando eventos adversos...</p>}
        </div>
      )}
    </div>
  );
}
