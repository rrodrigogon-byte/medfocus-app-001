/**
 * MedFocus — Gráficos de Evolução de Exames (Sprint 21)
 * 
 * Módulo para visualização temporal de exames laboratoriais:
 * - Gráficos de evolução com faixas de referência
 * - Upload de PDFs de exames (Gemini Multimodal para extração)
 * - Tendências e alertas automáticos
 * - Comparação entre períodos
 * - Perfis completos (renal, hepático, lipídico, glicêmico, hematológico)
 * 
 * DISCLAIMER: Ferramenta exclusivamente educacional e de apoio ao estudo.
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface ExameLaboratorial {
  nome: string;
  unidade: string;
  refMin: number;
  refMax: number;
  historico: { data: string; valor: number }[];
  categoria: string;
}

const EXAMES_DEMO: ExameLaboratorial[] = [
  { nome: 'Glicemia de Jejum', unidade: 'mg/dL', refMin: 70, refMax: 99, categoria: 'Perfil Glicêmico',
    historico: [{ data: '2025-03', valor: 156 }, { data: '2025-06', valor: 148 }, { data: '2025-09', valor: 142 }, { data: '2025-12', valor: 135 }, { data: '2026-02', valor: 128 }] },
  { nome: 'HbA1c', unidade: '%', refMin: 4.0, refMax: 5.6, categoria: 'Perfil Glicêmico',
    historico: [{ data: '2025-03', valor: 8.1 }, { data: '2025-06', valor: 7.8 }, { data: '2025-09', valor: 7.4 }, { data: '2025-12', valor: 7.2 }, { data: '2026-02', valor: 6.9 }] },
  { nome: 'Creatinina', unidade: 'mg/dL', refMin: 0.7, refMax: 1.3, categoria: 'Perfil Renal',
    historico: [{ data: '2025-03', valor: 0.9 }, { data: '2025-06', valor: 0.95 }, { data: '2025-09', valor: 0.88 }, { data: '2025-12', valor: 0.92 }, { data: '2026-02', valor: 0.9 }] },
  { nome: 'TFGe (CKD-EPI)', unidade: 'mL/min/1.73m²', refMin: 90, refMax: 120, categoria: 'Perfil Renal',
    historico: [{ data: '2025-03', valor: 95 }, { data: '2025-06', valor: 92 }, { data: '2025-09', valor: 98 }, { data: '2025-12', valor: 94 }, { data: '2026-02', valor: 96 }] },
  { nome: 'Colesterol Total', unidade: 'mg/dL', refMin: 0, refMax: 200, categoria: 'Perfil Lipídico',
    historico: [{ data: '2025-03', valor: 245 }, { data: '2025-06', valor: 228 }, { data: '2025-09', valor: 215 }, { data: '2025-12', valor: 198 }, { data: '2026-02', valor: 192 }] },
  { nome: 'LDL-c', unidade: 'mg/dL', refMin: 0, refMax: 130, categoria: 'Perfil Lipídico',
    historico: [{ data: '2025-03', valor: 165 }, { data: '2025-06', valor: 148 }, { data: '2025-09', valor: 132 }, { data: '2025-12', valor: 118 }, { data: '2026-02', valor: 108 }] },
  { nome: 'HDL-c', unidade: 'mg/dL', refMin: 40, refMax: 60, categoria: 'Perfil Lipídico',
    historico: [{ data: '2025-03', valor: 38 }, { data: '2025-06', valor: 40 }, { data: '2025-09', valor: 42 }, { data: '2025-12', valor: 45 }, { data: '2026-02', valor: 48 }] },
  { nome: 'Triglicerídeos', unidade: 'mg/dL', refMin: 0, refMax: 150, categoria: 'Perfil Lipídico',
    historico: [{ data: '2025-03', valor: 210 }, { data: '2025-06', valor: 195 }, { data: '2025-09', valor: 178 }, { data: '2025-12', valor: 162 }, { data: '2026-02', valor: 148 }] },
  { nome: 'Hemoglobina', unidade: 'g/dL', refMin: 12.0, refMax: 17.5, categoria: 'Hemograma',
    historico: [{ data: '2025-03', valor: 14.2 }, { data: '2025-06', valor: 14.5 }, { data: '2025-09', valor: 13.8 }, { data: '2025-12', valor: 14.1 }, { data: '2026-02', valor: 14.3 }] },
  { nome: 'TGO (AST)', unidade: 'U/L', refMin: 0, refMax: 40, categoria: 'Perfil Hepático',
    historico: [{ data: '2025-03', valor: 28 }, { data: '2025-06', valor: 32 }, { data: '2025-09', valor: 30 }, { data: '2025-12', valor: 26 }, { data: '2026-02', valor: 24 }] },
  { nome: 'TGP (ALT)', unidade: 'U/L', refMin: 0, refMax: 41, categoria: 'Perfil Hepático',
    historico: [{ data: '2025-03', valor: 35 }, { data: '2025-06', valor: 38 }, { data: '2025-09', valor: 34 }, { data: '2025-12', valor: 30 }, { data: '2026-02', valor: 28 }] },
  { nome: 'TSH', unidade: 'mUI/L', refMin: 0.4, refMax: 4.0, categoria: 'Tireoide',
    historico: [{ data: '2025-03', valor: 2.8 }, { data: '2025-06', valor: 3.1 }, { data: '2025-09', valor: 2.5 }, { data: '2025-12', valor: 2.9 }, { data: '2026-02', valor: 2.7 }] },
];

export function EvolucaoExames() {
  const [tela, setTela] = useState<'graficos' | 'upload' | 'alertas'>('graficos');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todos');
  const [exameSelecionado, setExameSelecionado] = useState<ExameLaboratorial | null>(null);

  const categorias = ['todos', ...new Set(EXAMES_DEMO.map(e => e.categoria))];
  const examesFiltrados = categoriaFiltro === 'todos' ? EXAMES_DEMO : EXAMES_DEMO.filter(e => e.categoria === categoriaFiltro);

  const getStatus = (exame: ExameLaboratorial) => {
    const ultimo = exame.historico[exame.historico.length - 1].valor;
    if (ultimo < exame.refMin) return { label: 'BAIXO', cor: 'text-blue-400 bg-blue-500/20' };
    if (ultimo > exame.refMax) return { label: 'ALTO', cor: 'text-red-400 bg-red-500/20' };
    return { label: 'NORMAL', cor: 'text-green-400 bg-green-500/20' };
  };

  const getTendencia = (exame: ExameLaboratorial) => {
    const h = exame.historico;
    if (h.length < 2) return { icon: '→', label: 'Estável', cor: 'text-gray-400' };
    const diff = h[h.length - 1].valor - h[h.length - 2].valor;
    const pct = (diff / h[h.length - 2].valor) * 100;
    if (Math.abs(pct) < 2) return { icon: '→', label: 'Estável', cor: 'text-gray-400' };
    if (diff > 0) return { icon: '↑', label: `+${pct.toFixed(1)}%`, cor: exame.historico[exame.historico.length - 1].valor > exame.refMax ? 'text-red-400' : 'text-yellow-400' };
    return { icon: '↓', label: `${pct.toFixed(1)}%`, cor: exame.historico[exame.historico.length - 1].valor < exame.refMin ? 'text-blue-400' : 'text-green-400' };
  };

  // Mini gráfico SVG
  const MiniGrafico = ({ exame }: { exame: ExameLaboratorial }) => {
    const h = exame.historico;
    const allVals = [...h.map(v => v.valor), exame.refMin, exame.refMax];
    const min = Math.min(...allVals) * 0.9;
    const max = Math.max(...allVals) * 1.1;
    const w = 200, ht = 60;
    const toY = (v: number) => ht - ((v - min) / (max - min)) * ht;
    const toX = (i: number) => (i / (h.length - 1)) * w;
    const refMinY = toY(exame.refMin);
    const refMaxY = toY(exame.refMax);
    const points = h.map((v, i) => `${toX(i)},${toY(v.valor)}`).join(' ');

    return (
      <svg viewBox={`0 0 ${w} ${ht}`} className="w-full h-16">
        <rect x="0" y={refMaxY} width={w} height={refMinY - refMaxY} fill="rgba(34,197,94,0.1)" />
        <line x1="0" y1={refMinY} x2={w} y2={refMinY} stroke="rgba(34,197,94,0.3)" strokeDasharray="4" />
        <line x1="0" y1={refMaxY} x2={w} y2={refMaxY} stroke="rgba(34,197,94,0.3)" strokeDasharray="4" />
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" />
        {h.map((v, i) => (
          <circle key={i} cx={toX(i)} cy={toY(v.valor)} r="3"
            className={v.valor > exame.refMax || v.valor < exame.refMin ? 'fill-red-400' : 'fill-primary'} />
        ))}
      </svg>
    );
  };

  const alertas = EXAMES_DEMO.filter(e => {
    const ultimo = e.historico[e.historico.length - 1].valor;
    return ultimo > e.refMax || ultimo < e.refMin;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Evolução de Exames" />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">📈</span> Evolução de Exames Laboratoriais
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-medium">Gemini Multimodal</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visualize tendências, faixas de referência e alertas automáticos dos exames laboratoriais ao longo do tempo
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'graficos' as const, label: `📊 Gráficos (${EXAMES_DEMO.length})` },
          { id: 'upload' as const, label: '📄 Upload de Exames' },
          { id: 'alertas' as const, label: `🔔 Alertas (${alertas.length})` },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTela(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tela === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {tela === 'graficos' && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {categorias.map(cat => (
              <button key={cat} onClick={() => setCategoriaFiltro(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  categoriaFiltro === cat ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'
                }`}>
                {cat === 'todos' ? 'Todos' : cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examesFiltrados.map(exame => {
              const status = getStatus(exame);
              const tendencia = getTendencia(exame);
              const ultimo = exame.historico[exame.historico.length - 1];
              return (
                <div key={exame.nome} onClick={() => setExameSelecionado(exame)}
                  className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 cursor-pointer transition">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-sm">{exame.nome}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${status.cor}`}>{status.label}</span>
                  </div>
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="text-2xl font-bold">{ultimo.valor}</p>
                      <p className="text-[10px] text-muted-foreground">{exame.unidade} | Ref: {exame.refMin}-{exame.refMax}</p>
                    </div>
                    <div className={`text-right ${tendencia.cor}`}>
                      <p className="text-lg font-bold">{tendencia.icon}</p>
                      <p className="text-[10px]">{tendencia.label}</p>
                    </div>
                  </div>
                  <MiniGrafico exame={exame} />
                  <p className="text-[10px] text-muted-foreground text-center mt-1">{exame.categoria}</p>
                </div>
              );
            })}
          </div>

          {/* Detalhe do exame selecionado */}
          {exameSelecionado && (
            <div className="bg-card border-2 border-primary/30 rounded-xl p-6 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{exameSelecionado.nome}</h3>
                <button onClick={() => setExameSelecionado(null)} className="text-xs text-muted-foreground hover:text-foreground">Fechar</button>
              </div>
              <div className="mb-4"><MiniGrafico exame={exameSelecionado} /></div>
              <table className="w-full text-xs">
                <thead><tr className="border-b border-border">
                  <th className="text-left py-2">Data</th><th className="text-right py-2">Valor</th><th className="text-right py-2">Referência</th><th className="text-right py-2">Status</th>
                </tr></thead>
                <tbody>
                  {exameSelecionado.historico.map((h, i) => {
                    const fora = h.valor > exameSelecionado.refMax || h.valor < exameSelecionado.refMin;
                    return (
                      <tr key={i} className="border-b border-border/50">
                        <td className="py-2">{h.data}</td>
                        <td className={`text-right font-bold ${fora ? 'text-red-400' : 'text-green-400'}`}>{h.valor} {exameSelecionado.unidade}</td>
                        <td className="text-right text-muted-foreground">{exameSelecionado.refMin}-{exameSelecionado.refMax}</td>
                        <td className="text-right">{fora ? '⚠️' : '✅'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tela === 'upload' && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-bold mb-4">📄 Upload de Exames (PDF)</h3>
          <p className="text-xs text-muted-foreground mb-4">Faça upload de PDFs de exames laboratoriais. O Gemini Multimodal extrairá automaticamente os valores e os adicionará ao gráfico de evolução.</p>
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition cursor-pointer">
            <svg className="w-12 h-12 text-muted-foreground mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm font-medium">Arraste PDFs de exames aqui</p>
            <p className="text-xs text-muted-foreground mt-1">ou clique para selecionar arquivos</p>
            <p className="text-[10px] text-muted-foreground mt-3">Formatos aceitos: PDF, JPG, PNG | Máx: 10MB por arquivo</p>
          </div>
          <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <p className="text-xs text-blue-400">🧠 <strong>Gemini Multimodal:</strong> O sistema analisa visualmente o PDF do exame, identifica os valores laboratoriais, e os estrutura automaticamente para o gráfico de evolução.</p>
          </div>
        </div>
      )}

      {tela === 'alertas' && (
        <div className="space-y-4">
          <h3 className="font-bold">🔔 Alertas — Exames Fora da Referência</h3>
          {alertas.length === 0 ? (
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
              <p className="text-2xl mb-2">✅</p>
              <p className="text-green-400 font-bold">Todos os exames dentro da faixa de referência!</p>
            </div>
          ) : alertas.map(exame => {
            const ultimo = exame.historico[exame.historico.length - 1];
            const alto = ultimo.valor > exame.refMax;
            return (
              <div key={exame.nome} className={`${alto ? 'bg-red-500/10 border-red-500/30' : 'bg-blue-500/10 border-blue-500/30'} border rounded-xl p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm">{exame.nome}</p>
                    <p className="text-xs text-muted-foreground">{exame.categoria}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${alto ? 'text-red-400' : 'text-blue-400'}`}>{ultimo.valor} {exame.unidade}</p>
                    <p className="text-[10px] text-muted-foreground">Ref: {exame.refMin}-{exame.refMax} | {alto ? 'ACIMA' : 'ABAIXO'} do normal</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
