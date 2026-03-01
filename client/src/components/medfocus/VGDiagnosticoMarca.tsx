/**
 * VGDiagnosticoMarca — Diagnóstico de Marca Pessoal Médica
 * Análise completa da presença digital do profissional de saúde
 */
import React, { useState } from 'react';

interface DiagnosticResult {
  category: string;
  score: number;
  maxScore: number;
  items: { label: string; status: 'ok' | 'warning' | 'error'; detail: string }[];
}

const DIAGNOSTIC_QUESTIONS = [
  { id: 'bio', category: 'Perfil', question: 'Sua bio inclui CRM, especialidade e cidade?', weight: 10 },
  { id: 'photo', category: 'Perfil', question: 'Você tem foto profissional de alta qualidade?', weight: 8 },
  { id: 'link', category: 'Perfil', question: 'Possui link na bio (Linktree, site, agendamento)?', weight: 7 },
  { id: 'highlights', category: 'Perfil', question: 'Tem destaques organizados por tema?', weight: 6 },
  { id: 'frequency', category: 'Conteúdo', question: 'Publica pelo menos 3x por semana?', weight: 9 },
  { id: 'variety', category: 'Conteúdo', question: 'Varia formatos (post, carrossel, vídeo, stories)?', weight: 8 },
  { id: 'educational', category: 'Conteúdo', question: 'Mais de 60% do conteúdo é educativo?', weight: 9 },
  { id: 'references', category: 'Conteúdo', question: 'Inclui referências científicas nos posts?', weight: 7 },
  { id: 'engagement', category: 'Engajamento', question: 'Responde comentários e DMs em até 24h?', weight: 8 },
  { id: 'cta', category: 'Engajamento', question: 'Usa CTAs (chamadas para ação) nos posts?', weight: 6 },
  { id: 'stories_daily', category: 'Engajamento', question: 'Posta stories diariamente?', weight: 5 },
  { id: 'cfm_compliance', category: 'Compliance', question: 'Todo conteúdo respeita a Resolução CFM 2.336/2023?', weight: 10 },
  { id: 'no_before_after', category: 'Compliance', question: 'Não publica fotos de antes/depois?', weight: 10 },
  { id: 'no_guarantee', category: 'Compliance', question: 'Não faz promessas de resultados?', weight: 10 },
  { id: 'disclaimer', category: 'Compliance', question: 'Inclui disclaimer educativo nos posts?', weight: 8 },
  { id: 'linkedin', category: 'Multi-Plataforma', question: 'Possui perfil ativo no LinkedIn?', weight: 7 },
  { id: 'website', category: 'Multi-Plataforma', question: 'Possui site ou landing page profissional?', weight: 6 },
  { id: 'google', category: 'Multi-Plataforma', question: 'Perfil no Google Meu Negócio atualizado?', weight: 7 },
];

export const VGDiagnosticoMarca: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [showResults, setShowResults] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);

  const categories = [...new Set(DIAGNOSTIC_QUESTIONS.map(q => q.category))];
  const currentQuestions = DIAGNOSTIC_QUESTIONS.filter(q => q.category === categories[currentCategory]);

  const allAnswered = DIAGNOSTIC_QUESTIONS.every(q => answers[q.id] !== undefined && answers[q.id] !== null);
  const totalScore = DIAGNOSTIC_QUESTIONS.reduce((sum, q) => sum + (answers[q.id] ? q.weight : 0), 0);
  const maxScore = DIAGNOSTIC_QUESTIONS.reduce((sum, q) => sum + q.weight, 0);
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  const getResults = (): DiagnosticResult[] => {
    return categories.map(cat => {
      const qs = DIAGNOSTIC_QUESTIONS.filter(q => q.category === cat);
      const score = qs.reduce((s, q) => s + (answers[q.id] ? q.weight : 0), 0);
      const max = qs.reduce((s, q) => s + q.weight, 0);
      return {
        category: cat,
        score,
        maxScore: max,
        items: qs.map(q => ({
          label: q.question,
          status: answers[q.id] ? 'ok' as const : q.weight >= 9 ? 'error' as const : 'warning' as const,
          detail: answers[q.id] ? 'Conforme' : q.weight >= 9 ? 'Crítico — Ação imediata necessária' : 'Recomendado — Melhoria sugerida',
        })),
      };
    });
  };

  const getGrade = () => {
    if (percentage >= 90) return { grade: 'A+', label: 'Excelente', color: 'text-emerald-400', desc: 'Sua marca pessoal médica está em nível de excelência.' };
    if (percentage >= 80) return { grade: 'A', label: 'Muito Bom', color: 'text-green-400', desc: 'Ótima presença digital. Pequenos ajustes podem maximizar resultados.' };
    if (percentage >= 70) return { grade: 'B', label: 'Bom', color: 'text-blue-400', desc: 'Boa base. Há oportunidades significativas de melhoria.' };
    if (percentage >= 50) return { grade: 'C', label: 'Regular', color: 'text-yellow-400', desc: 'Presença digital básica. Investir em conteúdo e consistência.' };
    return { grade: 'D', label: 'Iniciante', color: 'text-red-400', desc: 'Sua marca precisa de atenção urgente. Siga o plano de ação abaixo.' };
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-4 md:p-6">
      <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
        ⚠️ <strong>Compliance CFM:</strong> Este diagnóstico avalia sua presença digital de acordo com a Resolução CFM 2.336/2023 sobre publicidade médica.
      </div>

      <h1 className="text-2xl font-bold mb-1">🔬 Diagnóstico de Marca Pessoal</h1>
      <p className="text-gray-400 text-sm mb-6">Avalie sua presença digital médica e receba um plano de ação personalizado</p>

      {!showResults ? (
        <div className="max-w-2xl mx-auto">
          {/* Progress */}
          <div className="flex gap-1 mb-6">
            {categories.map((cat, i) => (
              <div key={i} className="flex-1">
                <div className={`h-1.5 rounded-full ${i <= currentCategory ? 'bg-emerald-500' : 'bg-white/10'}`} />
                <div className={`text-[10px] mt-1 text-center ${i === currentCategory ? 'text-emerald-400' : 'text-gray-600'}`}>{cat}</div>
              </div>
            ))}
          </div>

          <div className="bg-white/5 rounded-xl border border-white/10 p-6">
            <h3 className="font-bold text-lg mb-1">{categories[currentCategory]}</h3>
            <p className="text-sm text-gray-400 mb-6">Responda com sinceridade para um diagnóstico preciso</p>
            <div className="space-y-4">
              {currentQuestions.map(q => (
                <div key={q.id} className="flex items-center justify-between gap-4 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                  <span className="text-sm flex-1">{q.question}</span>
                  <div className="flex gap-2">
                    <button onClick={() => setAnswers({ ...answers, [q.id]: true })} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${answers[q.id] === true ? 'bg-emerald-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Sim</button>
                    <button onClick={() => setAnswers({ ...answers, [q.id]: false })} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${answers[q.id] === false ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>Não</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button onClick={() => setCurrentCategory(c => Math.max(0, c - 1))} disabled={currentCategory === 0} className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 rounded-lg text-sm">← Anterior</button>
              {currentCategory < categories.length - 1 ? (
                <button onClick={() => setCurrentCategory(c => c + 1)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium">Próximo →</button>
              ) : (
                <button onClick={() => setShowResults(true)} disabled={!allAnswered} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg text-sm font-medium">🔬 Ver Diagnóstico</button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Score Card */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
            <div className={`text-6xl font-black ${getGrade().color}`}>{getGrade().grade}</div>
            <div className="text-xl font-bold mt-2">{getGrade().label}</div>
            <div className="text-sm text-gray-400 mt-1">{getGrade().desc}</div>
            <div className="mt-4">
              <div className="text-3xl font-bold">{percentage}%</div>
              <div className="text-xs text-gray-500">{totalScore}/{maxScore} pontos</div>
            </div>
            <div className="w-full max-w-md mx-auto bg-white/10 rounded-full h-3 mt-4">
              <div className={`h-3 rounded-full transition-all ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }} />
            </div>
          </div>

          {/* Category Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getResults().map((r, i) => (
              <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold">{r.category}</h3>
                  <span className={`text-sm font-bold ${r.maxScore > 0 && (r.score / r.maxScore) >= 0.8 ? 'text-emerald-400' : (r.score / r.maxScore) >= 0.5 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {r.maxScore > 0 ? Math.round((r.score / r.maxScore) * 100) : 0}%
                  </span>
                </div>
                <div className="space-y-2">
                  {r.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5">{item.status === 'ok' ? '✅' : item.status === 'error' ? '🔴' : '🟡'}</span>
                      <div>
                        <div className={item.status === 'ok' ? 'text-gray-400' : 'text-white'}>{item.label}</div>
                        {item.status !== 'ok' && <div className="text-xs text-gray-500">{item.detail}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => { setShowResults(false); setCurrentCategory(0); setAnswers({}); }} className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium">🔄 Refazer Diagnóstico</button>
        </div>
      )}
    </div>
  );
};

export default VGDiagnosticoMarca;
