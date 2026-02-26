import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';

export default function DrugInteractionChecker() {
  const [drugs, setDrugs] = useState<string[]>(['', '']);
  const [result, setResult] = useState<any>(null);

  const checkMutation = trpc.drugInteraction.check.useMutation({
    onSuccess: (data) => { setResult(data); toast.success('Análise de interações concluída!'); },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const addDrug = () => setDrugs(prev => [...prev, '']);
  const removeDrug = (i: number) => setDrugs(prev => prev.filter((_, idx) => idx !== i));
  const updateDrug = (i: number, val: string) => setDrugs(prev => prev.map((d, idx) => idx === i ? val : d));

  const handleCheck = () => {
    const validDrugs = drugs.filter(d => d.trim());
    if (validDrugs.length < 2) { toast.error('Adicione pelo menos 2 medicamentos'); return; }
    checkMutation.mutate({ drugs: validDrugs });
  };

  const getSeverityStyle = (severity: string) => {
    const s = severity.toLowerCase();
    if (s.includes('contraindicad') || s.includes('grave') || s.includes('major')) return { bg: 'bg-red-900/30', border: 'border-red-700/50', text: 'text-red-400', badge: 'bg-red-600' };
    if (s.includes('moderada') || s.includes('moderate')) return { bg: 'bg-yellow-900/30', border: 'border-yellow-700/50', text: 'text-yellow-400', badge: 'bg-yellow-600' };
    return { bg: 'bg-green-900/30', border: 'border-green-700/50', text: 'text-green-400', badge: 'bg-green-600' };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-red-900/50 to-orange-900/50 rounded-2xl p-6 border border-red-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-2xl">⚠️</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Verificador de Interações Medicamentosas</h2>
            <p className="text-red-300 text-sm">Análise de interações com dados FDA + IA Dr. Focus — Baseado em Micromedex e Stockley's</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">💊 Medicamentos</h3>
        <div className="space-y-3">
          {drugs.map((drug, i) => (
            <div key={i} className="flex gap-2">
              <div className="w-8 h-10 flex items-center justify-center bg-blue-900/30 rounded-lg text-blue-400 font-bold text-sm">{i + 1}</div>
              <input type="text" value={drug} onChange={e => updateDrug(i, e.target.value)} placeholder={`Nome do medicamento ${i + 1}...`} className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" />
              {drugs.length > 2 && (
                <button onClick={() => removeDrug(i)} className="px-3 py-2 bg-red-900/30 text-red-400 rounded-lg hover:bg-red-900/50">✕</button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={addDrug} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700">+ Adicionar Medicamento</button>
          <button onClick={handleCheck} disabled={checkMutation.isPending} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-500 disabled:opacity-50">
            {checkMutation.isPending ? '⏳ Analisando interações...' : '🔍 Verificar Interações'}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className={`rounded-xl p-5 ${getSeverityStyle(result.overallRisk).bg} ${getSeverityStyle(result.overallRisk).border} border`}>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${getSeverityStyle(result.overallRisk).badge}`}>
                Risco Geral: {result.overallRisk}
              </span>
            </div>
            <p className="text-gray-300">{result.recommendation}</p>
          </div>

          {result.interactions?.map((inter: any, i: number) => {
            const style = getSeverityStyle(inter.severity);
            return (
              <div key={i} className={`${style.bg} ${style.border} border rounded-xl p-5`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-lg font-bold text-white">{inter.drug1} ↔ {inter.drug2}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${style.badge}`}>{inter.severity}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">⚙️ Mecanismo:</p>
                    <p className="text-sm text-gray-300">{inter.mechanism}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">🩺 Efeito Clínico:</p>
                    <p className="text-sm text-gray-300">{inter.clinicalEffect}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold mb-1">📋 Manejo:</p>
                    <p className="text-sm text-gray-300">{inter.management}</p>
                  </div>
                  {inter.alternatives?.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-500 font-semibold mb-1">💡 Alternativas:</p>
                      <div className="flex flex-wrap gap-1">
                        {inter.alternatives.map((alt: string, j: number) => (
                          <span key={j} className="text-xs bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded">{alt}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-xs text-gray-500">📚 {inter.references?.join('; ')}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
