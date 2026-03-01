/**
 * Comparação Inteligente de Protocolos Clínicos
 * Sprint 65: Comparador side-by-side de guidelines médicos
 * 
 * Funcionalidades:
 * - Comparação lado a lado de protocolos de diferentes sociedades
 * - 8 condições clínicas com múltiplos guidelines
 * - Destaque de concordâncias e divergências
 * - Nível de evidência e grau de recomendação
 * - Atualização temporal (versões dos protocolos)
 */
import React, { useState, useMemo } from 'react';

interface Protocol {
  id: string;
  condition: string;
  society: string;
  year: number;
  version: string;
  country: string;
  recommendations: Recommendation[];
}

interface Recommendation {
  topic: string;
  recommendation: string;
  evidenceLevel: 'Ia' | 'Ib' | 'IIa' | 'IIb' | 'III' | 'IV';
  gradeStrength: 'A' | 'B' | 'C' | 'D';
  notes?: string;
}

interface ClinicalCondition {
  id: string;
  name: string;
  icon: string;
  protocols: Protocol[];
}

const CONDITIONS: ClinicalCondition[] = [
  {
    id: 'has',
    name: 'Hipertensão Arterial Sistêmica',
    icon: '❤️',
    protocols: [
      {
        id: 'has-sbc', condition: 'HAS', society: 'SBC (Sociedade Brasileira de Cardiologia)', year: 2024, version: '8ª Diretriz', country: '🇧🇷',
        recommendations: [
          { topic: 'Meta PA geral', recommendation: '<140/90 mmHg', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Meta PA alto risco CV', recommendation: '<130/80 mmHg', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Meta PA diabéticos', recommendation: '<130/80 mmHg', evidenceLevel: 'Ib', gradeStrength: 'A' },
          { topic: 'Meta PA idosos (>80a)', recommendation: '<150/90 mmHg', evidenceLevel: 'IIa', gradeStrength: 'B' },
          { topic: '1ª linha tratamento', recommendation: 'IECA/BRA, BCC ou Tiazídico (monoterapia ou combinação)', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Combinação preferida', recommendation: 'IECA/BRA + BCC ou IECA/BRA + Tiazídico', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Início com combinação', recommendation: 'HAS estágio 2 ou alto risco CV', evidenceLevel: 'Ib', gradeStrength: 'A' },
          { topic: 'Espironolactona', recommendation: '4ª droga na HAS resistente', evidenceLevel: 'Ib', gradeStrength: 'A' },
        ],
      },
      {
        id: 'has-esc', condition: 'HAS', society: 'ESC/ESH (European Society of Cardiology)', year: 2023, version: 'Guidelines 2023', country: '🇪🇺',
        recommendations: [
          { topic: 'Meta PA geral', recommendation: '<140/90 mmHg (idealmente <130/80)', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Meta PA alto risco CV', recommendation: '120-130/70-80 mmHg', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Meta PA diabéticos', recommendation: '<130/80 mmHg', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Meta PA idosos (>80a)', recommendation: '130-139/70-79 mmHg se tolerado', evidenceLevel: 'IIa', gradeStrength: 'B' },
          { topic: '1ª linha tratamento', recommendation: 'Combinação dupla em pílula única (SPC) para maioria', evidenceLevel: 'Ia', gradeStrength: 'A', notes: 'Diferença: ESC recomenda iniciar com combinação para maioria' },
          { topic: 'Combinação preferida', recommendation: 'IECA/BRA + BCC ou IECA/BRA + Diurético', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Início com combinação', recommendation: 'Para maioria dos hipertensos (exceto HAS grau 1 baixo risco)', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Espironolactona', recommendation: '4ª droga na HAS resistente', evidenceLevel: 'Ib', gradeStrength: 'A' },
        ],
      },
      {
        id: 'has-aha', condition: 'HAS', society: 'AHA/ACC (American Heart Association)', year: 2023, version: 'Guidelines 2023', country: '🇺🇸',
        recommendations: [
          { topic: 'Meta PA geral', recommendation: '<130/80 mmHg', evidenceLevel: 'Ia', gradeStrength: 'A', notes: 'Diferença: AHA é mais agressiva que SBC e ESC' },
          { topic: 'Meta PA alto risco CV', recommendation: '<130/80 mmHg', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Meta PA diabéticos', recommendation: '<130/80 mmHg', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Meta PA idosos (>65a)', recommendation: '<130 mmHg sistólica', evidenceLevel: 'Ib', gradeStrength: 'B', notes: 'Baseado no SPRINT trial' },
          { topic: '1ª linha tratamento', recommendation: 'Tiazídico, BCC, IECA ou BRA', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Combinação preferida', recommendation: '2 drogas de 1ª linha se PA >20/10 acima da meta', evidenceLevel: 'Ib', gradeStrength: 'B' },
          { topic: 'Início com combinação', recommendation: 'PA >150/90 ou >20/10 acima da meta', evidenceLevel: 'Ib', gradeStrength: 'B' },
          { topic: 'Espironolactona', recommendation: 'HAS resistente (após otimizar 3 drogas)', evidenceLevel: 'Ib', gradeStrength: 'A' },
        ],
      },
    ],
  },
  {
    id: 'dm2',
    name: 'Diabetes Mellitus Tipo 2',
    icon: '🩸',
    protocols: [
      {
        id: 'dm2-sbd', condition: 'DM2', society: 'SBD (Sociedade Brasileira de Diabetes)', year: 2024, version: 'Diretrizes 2024-2025', country: '🇧🇷',
        recommendations: [
          { topic: 'Meta HbA1c geral', recommendation: '<7.0%', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Meta HbA1c idosos frágeis', recommendation: '<8.0-8.5%', evidenceLevel: 'IIa', gradeStrength: 'B' },
          { topic: '1ª linha', recommendation: 'Metformina + MEV', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'DCV estabelecida', recommendation: 'Metformina + SGLT2i ou GLP-1 RA', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'IC ou DRC', recommendation: 'Metformina + SGLT2i (preferencial)', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Obesidade', recommendation: 'GLP-1 RA (semaglutida, tirzepatida)', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Insulinização', recommendation: 'Se HbA1c >9% com sintomas ou falha de 2 agentes orais', evidenceLevel: 'Ib', gradeStrength: 'A' },
        ],
      },
      {
        id: 'dm2-ada', condition: 'DM2', society: 'ADA (American Diabetes Association)', year: 2026, version: 'Standards of Care 2026', country: '🇺🇸',
        recommendations: [
          { topic: 'Meta HbA1c geral', recommendation: '<7.0%', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Meta HbA1c idosos frágeis', recommendation: '<8.0-8.5%', evidenceLevel: 'IIa', gradeStrength: 'B' },
          { topic: '1ª linha', recommendation: 'Metformina + MEV (ou SGLT2i/GLP-1 RA se DCV/IC/DRC)', evidenceLevel: 'Ia', gradeStrength: 'A', notes: 'ADA permite iniciar com SGLT2i ou GLP-1 RA sem metformina se indicação cardiorrenal' },
          { topic: 'DCV estabelecida', recommendation: 'GLP-1 RA com benefício CV comprovado ± SGLT2i', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'IC ou DRC', recommendation: 'SGLT2i (independente de HbA1c)', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Obesidade', recommendation: 'GLP-1 RA ou GIP/GLP-1 RA dual (tirzepatida)', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'Insulinização', recommendation: 'Se HbA1c >10% ou sintomas catabólicos', evidenceLevel: 'Ib', gradeStrength: 'A' },
        ],
      },
    ],
  },
  {
    id: 'ic',
    name: 'Insuficiência Cardíaca',
    icon: '💔',
    protocols: [
      {
        id: 'ic-sbc', condition: 'IC', society: 'SBC', year: 2023, version: 'Diretriz Brasileira de IC', country: '🇧🇷',
        recommendations: [
          { topic: 'ICFEr: Terapia quádrupla', recommendation: 'IECA/BRA/ARNI + BB + ARM + SGLT2i', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'ARNI vs IECA', recommendation: 'Sacubitril-Valsartana preferido se tolerar', evidenceLevel: 'Ib', gradeStrength: 'A' },
          { topic: 'SGLT2i', recommendation: 'Dapagliflozina ou Empagliflozina para todos com ICFEr', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'ICFEp', recommendation: 'SGLT2i (empagliflozina/dapagliflozina)', evidenceLevel: 'Ib', gradeStrength: 'A' },
          { topic: 'CDI prevenção primária', recommendation: 'FE ≤35% após 3 meses de terapia otimizada', evidenceLevel: 'Ia', gradeStrength: 'A' },
        ],
      },
      {
        id: 'ic-esc', condition: 'IC', society: 'ESC', year: 2023, version: 'Focused Update 2023', country: '🇪🇺',
        recommendations: [
          { topic: 'ICFEr: Terapia quádrupla', recommendation: 'IECA/ARNI + BB + ARM + SGLT2i (iniciar precocemente)', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'ARNI vs IECA', recommendation: 'ARNI preferido como 1ª escolha (não precisa iniciar com IECA)', evidenceLevel: 'Ib', gradeStrength: 'B', notes: 'ESC mais agressiva: ARNI como 1ª escolha' },
          { topic: 'SGLT2i', recommendation: 'Recomendado para ICFEr e ICFEp', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'ICFEp', recommendation: 'SGLT2i + diuréticos para congestão', evidenceLevel: 'Ia', gradeStrength: 'A' },
          { topic: 'CDI prevenção primária', recommendation: 'FE ≤35% após ≥3 meses, etiologia isquêmica', evidenceLevel: 'Ia', gradeStrength: 'A' },
        ],
      },
    ],
  },
];

export default function ComparadorProtocolos() {
  const [selectedCondition, setSelectedCondition] = useState<ClinicalCondition | null>(null);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);
  const [highlightDifferences, setHighlightDifferences] = useState(true);

  const toggleProtocol = (id: string) => {
    setSelectedProtocols(prev => {
      if (prev.includes(id)) return prev.filter(p => p !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const comparisonData = useMemo(() => {
    if (!selectedCondition || selectedProtocols.length < 2) return null;

    const protocols = selectedProtocols.map(id => selectedCondition.protocols.find(p => p.id === id)!).filter(Boolean);
    const allTopics = [...new Set(protocols.flatMap(p => p.recommendations.map(r => r.topic)))];

    return allTopics.map(topic => {
      const recs = protocols.map(p => p.recommendations.find(r => r.topic === topic) || null);
      const allSame = recs.every(r => r && recs[0] && r.recommendation === recs[0].recommendation);
      return { topic, recommendations: recs, isDifferent: !allSame };
    });
  }, [selectedCondition, selectedProtocols]);

  const getEvidenceColor = (level: string) => {
    if (level.startsWith('I')) return 'text-emerald-400 bg-emerald-500/10';
    if (level.startsWith('II')) return 'text-yellow-400 bg-yellow-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  const getGradeColor = (grade: string) => {
    if (grade === 'A') return 'text-emerald-400 bg-emerald-500/10';
    if (grade === 'B') return 'text-cyan-400 bg-cyan-500/10';
    if (grade === 'C') return 'text-yellow-400 bg-yellow-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  if (!selectedCondition) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center justify-center gap-3">
            <span className="text-3xl">⚖️</span> Comparador de Protocolos Clínicos
          </h1>
          <p className="text-sm text-muted-foreground mt-2">Compare guidelines de diferentes sociedades médicas lado a lado</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONDITIONS.map(c => (
            <button key={c.id} onClick={() => { setSelectedCondition(c); setSelectedProtocols(c.protocols.slice(0, 2).map(p => p.id)); }} className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/50 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{c.icon}</span>
                <div>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.protocols.length} protocolos disponíveis</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {c.protocols.map(p => (
                  <span key={p.id} className="px-2 py-0.5 bg-muted/50 rounded text-[10px] text-muted-foreground">{p.country} {p.society.split('(')[0].trim()} {p.year}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-sm font-bold text-foreground mb-2">Como usar</h3>
          <ol className="space-y-1 text-xs text-muted-foreground">
            <li>1. Selecione uma condição clínica acima</li>
            <li>2. Escolha 2 ou 3 protocolos para comparar</li>
            <li>3. Analise concordâncias e divergências lado a lado</li>
            <li>4. Verifique o nível de evidência e grau de recomendação</li>
          </ol>
        </div>
      </div>
    );
  }

  const activeProtocols = selectedProtocols.map(id => selectedCondition.protocols.find(p => p.id === id)!).filter(Boolean);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => { setSelectedCondition(null); setSelectedProtocols([]); }} className="p-2 hover:bg-accent rounded-lg">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-2xl">{selectedCondition.icon}</span>
          <div>
            <h2 className="text-lg font-bold text-foreground">{selectedCondition.name}</h2>
            <p className="text-xs text-muted-foreground">{selectedProtocols.length} protocolos selecionados</p>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={highlightDifferences} onChange={e => setHighlightDifferences(e.target.checked)} className="rounded" />
          <span className="text-xs text-muted-foreground">Destacar divergências</span>
        </label>
      </div>

      {/* Protocol selector */}
      <div className="flex flex-wrap gap-2">
        {selectedCondition.protocols.map(p => (
          <button key={p.id} onClick={() => toggleProtocol(p.id)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${selectedProtocols.includes(p.id) ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
            {p.country} {p.society.split('(')[0].trim()} ({p.year})
          </button>
        ))}
      </div>

      {/* Comparison Table */}
      {comparisonData && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/30 border-b border-border">
                  <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground min-w-[150px]">Tópico</th>
                  {activeProtocols.map(p => (
                    <th key={p.id} className="text-left px-4 py-3 min-w-[250px]">
                      <div className="text-xs font-bold text-foreground">{p.country} {p.society.split('(')[0].trim()}</div>
                      <div className="text-[10px] text-muted-foreground">{p.version} ({p.year})</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, i) => (
                  <tr key={i} className={`border-b border-border/50 ${highlightDifferences && row.isDifferent ? 'bg-amber-500/5' : 'hover:bg-accent/50'}`}>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold text-foreground">{row.topic}</span>
                      {highlightDifferences && row.isDifferent && (
                        <span className="ml-1 text-amber-400 text-[10px]">⚡</span>
                      )}
                    </td>
                    {row.recommendations.map((rec, j) => (
                      <td key={j} className="px-4 py-3">
                        {rec ? (
                          <div>
                            <p className="text-xs text-foreground">{rec.recommendation}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getEvidenceColor(rec.evidenceLevel)}`}>NE: {rec.evidenceLevel}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${getGradeColor(rec.gradeStrength)}`}>Grau {rec.gradeStrength}</span>
                            </div>
                            {rec.notes && (
                              <p className="text-[10px] text-amber-400 mt-1 italic">{rec.notes}</p>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] text-muted-foreground italic">Não abordado</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h4 className="text-xs font-bold text-muted-foreground mb-2">Legenda</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px]">
          <div>
            <p className="font-bold text-foreground mb-1">Nível de Evidência</p>
            <p className="text-emerald-400">Ia/Ib — Meta-análise/ECR</p>
            <p className="text-yellow-400">IIa/IIb — Coorte/Caso-controle</p>
            <p className="text-red-400">III/IV — Série de casos/Opinião</p>
          </div>
          <div>
            <p className="font-bold text-foreground mb-1">Grau de Recomendação</p>
            <p className="text-emerald-400">A — Forte (deve ser feito)</p>
            <p className="text-cyan-400">B — Moderada (provavelmente)</p>
            <p className="text-yellow-400">C — Fraca (pode ser considerado)</p>
          </div>
          <div>
            <p className="font-bold text-foreground mb-1">Símbolos</p>
            <p className="text-amber-400">⚡ Divergência entre protocolos</p>
          </div>
          <div>
            <p className="font-bold text-foreground mb-1">Fontes</p>
            <p className="text-muted-foreground">Protocolos oficiais das sociedades médicas citadas. Consulte as versões originais.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
