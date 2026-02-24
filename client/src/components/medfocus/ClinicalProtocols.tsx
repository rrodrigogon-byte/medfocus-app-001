import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';
import { toast } from 'sonner';

const COMMON_CONDITIONS = [
  { name: 'Hipertensão Arterial', icon: '💓' },
  { name: 'Diabetes Mellitus tipo 2', icon: '🩸' },
  { name: 'Infarto Agudo do Miocárdio', icon: '🫀' },
  { name: 'AVC Isquêmico', icon: '🧠' },
  { name: 'Pneumonia Comunitária', icon: '🫁' },
  { name: 'Sepse', icon: '🦠' },
  { name: 'Insuficiência Cardíaca', icon: '❤️' },
  { name: 'DPOC Exacerbada', icon: '💨' },
  { name: 'Asma Aguda', icon: '🌬️' },
  { name: 'Cetoacidose Diabética', icon: '⚗️' },
  { name: 'Tromboembolismo Pulmonar', icon: '🩺' },
  { name: 'Insuficiência Renal Aguda', icon: '🫘' },
];

export default function ClinicalProtocols() {
  const [condition, setCondition] = useState('');
  const [source, setSource] = useState<'sus' | 'who' | 'nice' | 'aha' | 'all'>('all');
  const [protocol, setProtocol] = useState<string | null>(null);

  const searchMutation = trpc.protocols.search.useMutation({
    onSuccess: (data) => { setProtocol(data.protocol); toast.success('Protocolo encontrado!'); },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const handleSearch = (cond?: string) => {
    const q = cond || condition;
    if (!q.trim()) { toast.error('Informe a condição clínica'); return; }
    setCondition(q);
    searchMutation.mutate({ condition: q, source });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 rounded-2xl p-6 border border-cyan-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-600 rounded-xl flex items-center justify-center text-2xl">📘</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Protocolos Clínicos e Diretrizes</h2>
            <p className="text-cyan-300 text-sm">PCDT/SUS, WHO, NICE, AHA/ACC — Diretrizes baseadas em evidências</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
        <div className="flex gap-3 mb-4">
          <input type="text" value={condition} onChange={e => setCondition(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Condição clínica (ex: Hipertensão, Sepse, IAM)..." className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white" />
          <select value={source} onChange={e => setSource(e.target.value as any)} className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
            <option value="all">Todas as fontes</option>
            <option value="sus">SUS/PCDT</option>
            <option value="who">OMS/WHO</option>
            <option value="nice">NICE</option>
            <option value="aha">AHA/ACC</option>
          </select>
          <button onClick={() => handleSearch()} disabled={searchMutation.isPending} className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-500 disabled:opacity-50">
            {searchMutation.isPending ? '⏳' : '🔍 Buscar'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {COMMON_CONDITIONS.map(c => (
            <button key={c.name} onClick={() => handleSearch(c.name)} className="p-3 bg-gray-800 rounded-lg text-center hover:bg-gray-700 transition-all">
              <div className="text-xl mb-1">{c.icon}</div>
              <div className="text-xs text-gray-400">{c.name}</div>
            </button>
          ))}
        </div>
      </div>

      {protocol && (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">📘 Protocolo: {condition}</h3>
          <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-wrap leading-relaxed">{protocol}</div>
        </div>
      )}
    </div>
  );
}
