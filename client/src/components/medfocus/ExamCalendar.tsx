/**
 * ExamCalendar — Calendário de Provas com Sugestões Automáticas de Estudo
 * Integra com IA para gerar plano de estudo personalizado baseado nas provas
 */
import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { useAuth } from '@/_core/hooks/useAuth';

type ViewMode = 'calendar' | 'create' | 'detail';

const EXAM_TYPES = [
  { value: 'prova_modulo', label: 'Prova de Módulo' },
  { value: 'prova_final', label: 'Prova Final' },
  { value: 'simulado', label: 'Simulado' },
  { value: 'residencia', label: 'Prova de Residência' },
  { value: 'revalida', label: 'REVALIDA' },
  { value: 'enare', label: 'ENARE' },
  { value: 'osce', label: 'OSCE / Prova Prática' },
  { value: 'outro', label: 'Outro' },
];

const IMPORTANCE_COLORS: Record<string, { bg: string; text: string; border: string; label: string }> = {
  low: { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30', label: 'Baixa' },
  medium: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: 'Média' },
  high: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: 'Alta' },
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30', label: 'Crítica' },
};

const SUGGESTION_ICONS: Record<string, string> = {
  simulado: '📝',
  caso_clinico: '🏥',
  flashcard: '📚',
  resumo: '📋',
};

const MEDICAL_SUBJECTS = [
  'Clínica Médica', 'Cirurgia', 'Pediatria', 'Ginecologia e Obstetrícia',
  'Saúde Coletiva', 'Medicina Preventiva', 'Cardiologia', 'Pneumologia',
  'Neurologia', 'Ortopedia', 'Dermatologia', 'Psiquiatria',
  'Endocrinologia', 'Nefrologia', 'Gastroenterologia', 'Infectologia',
  'Anatomia', 'Fisiologia', 'Farmacologia', 'Patologia',
  'Microbiologia', 'Bioquímica', 'Semiologia', 'Emergência',
];

const ExamCalendar: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [view, setView] = useState<ViewMode>('calendar');
  const [selectedExamId, setSelectedExamId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '', examType: 'prova_modulo', examDate: '',
    description: '', subjects: [] as string[],
    importance: 'medium' as 'low' | 'medium' | 'high' | 'critical', reminderDays: 7,
  });

  // Queries
  const exams = trpc.examCalendar.list.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const upcomingExams = trpc.examCalendar.upcoming.useQuery({ days: 90 }, { enabled: isAuthenticated, retry: false });
  const suggestions = trpc.examCalendar.suggestions.useQuery(
    { examId: selectedExamId! },
    { enabled: !!selectedExamId && view === 'detail', retry: false }
  );

  // Mutations
  const createExam = trpc.examCalendar.create.useMutation({
    onSuccess: () => { toast.success('Prova adicionada!'); exams.refetch(); upcomingExams.refetch(); setView('calendar'); },
    onError: () => toast.error('Erro ao criar prova'),
  });

  const deleteExam = trpc.examCalendar.delete.useMutation({
    onSuccess: () => { toast.success('Prova removida'); exams.refetch(); upcomingExams.refetch(); setView('calendar'); },
  });

  const generateSuggestions = trpc.examCalendar.generateSuggestions.useMutation({
    onSuccess: () => { toast.success('Plano de estudo gerado!'); suggestions.refetch(); },
    onError: () => toast.error('Erro ao gerar sugestões'),
  });

  const completeSuggestion = trpc.examCalendar.completeSuggestion.useMutation({
    onSuccess: () => { toast.success('Atividade concluída! +10 XP'); suggestions.refetch(); },
  });

  const toggleSubject = (s: string) => {
    setFormData(f => ({
      ...f,
      subjects: f.subjects.includes(s) ? f.subjects.filter(x => x !== s) : [...f.subjects, s],
    }));
  };

  const getDaysUntil = (dateStr: string | Date) => {
    const d = new Date(dateStr);
    const now = new Date();
    return Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const selectedExam = useMemo(() => {
    if (!selectedExamId || !exams.data) return null;
    return exams.data.find((e: any) => e.id === selectedExamId);
  }, [selectedExamId, exams.data]);

  // ─── Create Exam View ──────────────────────────────────
  if (view === 'create') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('calendar')} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="text-xl font-display font-bold">Adicionar Prova</h2>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Nome da Prova</label>
            <input type="text" value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: P2 de Clínica Médica" className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-teal-500" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Tipo</label>
              <select value={formData.examType} onChange={e => setFormData(f => ({ ...f, examType: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground">
                {EXAM_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Data</label>
              <input type="date" value={formData.examDate} onChange={e => setFormData(f => ({ ...f, examDate: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Importância</label>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(IMPORTANCE_COLORS).map(([key, val]) => (
                  <button key={key} onClick={() => setFormData(f => ({ ...f, importance: key as 'low' | 'medium' | 'high' | 'critical' }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      formData.importance === key ? `${val.bg} ${val.text} ${val.border}` : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50'
                    }`}>
                    {val.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Lembrete (dias antes)</label>
              <select value={formData.reminderDays} onChange={e => setFormData(f => ({ ...f, reminderDays: Number(e.target.value) }))}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground">
                {[1, 3, 5, 7, 14, 21, 30].map(d => <option key={d} value={d}>{d} dias</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Descrição (opcional)</label>
            <textarea value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
              placeholder="Detalhes sobre a prova..." rows={2}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Matérias</label>
            <div className="flex flex-wrap gap-2">
              {MEDICAL_SUBJECTS.map(s => (
                <button key={s} onClick={() => toggleSubject(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    formData.subjects.includes(s) ? 'bg-teal-500/20 border-teal-500/40 text-teal-400' : 'bg-muted/30 border-border text-muted-foreground hover:bg-muted/50'
                  }`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              if (!formData.title.trim() || !formData.examDate) { toast.error('Preencha nome e data'); return; }
              createExam.mutate({ ...formData, importance: formData.importance as 'low' | 'medium' | 'high' | 'critical' });
            }}
            disabled={createExam.isPending}
            className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors disabled:opacity-50"
          >
            {createExam.isPending ? 'Salvando...' : 'Adicionar Prova'}
          </button>
        </div>
      </div>
    );
  }

  // ─── Exam Detail View ──────────────────────────────────
  if (view === 'detail' && selectedExam) {
    const daysLeft = getDaysUntil(selectedExam.examDate);
    const imp = IMPORTANCE_COLORS[selectedExam.importance || 'medium'];
    const subjects = selectedExam.subjects ? (typeof selectedExam.subjects === 'string' ? JSON.parse(selectedExam.subjects) : selectedExam.subjects) : [];

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => { setView('calendar'); setSelectedExamId(null); }} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </button>
          <h2 className="text-xl font-display font-bold">{selectedExam.title}</h2>
        </div>

        {/* Exam Info Card */}
        <div className={`bg-gradient-to-br ${daysLeft <= 7 ? 'from-red-500/10 to-orange-500/10 border-red-500/20' : daysLeft <= 30 ? 'from-amber-500/10 to-yellow-500/10 border-amber-500/20' : 'from-teal-500/10 to-emerald-500/10 border-teal-500/20'} border rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${daysLeft <= 7 ? 'bg-red-500/20' : daysLeft <= 30 ? 'bg-amber-500/20' : 'bg-teal-500/20'} flex items-center justify-center`}>
                <span className="text-2xl">{daysLeft <= 0 ? '✅' : daysLeft <= 7 ? '🔥' : '📅'}</span>
              </div>
              <div>
                <div className={`text-3xl font-bold ${daysLeft <= 7 ? 'text-red-400' : daysLeft <= 30 ? 'text-amber-400' : 'text-teal-400'}`}>
                  {daysLeft <= 0 ? 'Hoje!' : `${daysLeft} dias`}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(selectedExam.examDate).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${imp.bg} ${imp.text}`}>{imp.label}</span>
          </div>

          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {subjects.map((s: string) => (
                <span key={s} className="px-2 py-1 rounded-lg bg-background/50 text-xs text-foreground">{s}</span>
              ))}
            </div>
          )}

          {selectedExam.description && (
            <p className="text-sm text-muted-foreground">{selectedExam.description}</p>
          )}
        </div>

        {/* Generate Study Plan */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-foreground">Plano de Estudo</h3>
          <button
            onClick={() => {
              generateSuggestions.mutate({
                examId: selectedExam.id,
                examTitle: selectedExam.title,
                examDate: typeof selectedExam.examDate === 'string' ? selectedExam.examDate : new Date(selectedExam.examDate).toISOString(),
                subjects: subjects,
              });
            }}
            disabled={generateSuggestions.isPending}
            className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {generateSuggestions.isPending ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                Gerando...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                Gerar Plano com IA
              </>
            )}
          </button>
        </div>

        {/* Suggestions List */}
        {suggestions.data && suggestions.data.length > 0 ? (
          <div className="space-y-3">
            {suggestions.data.map((s: any) => (
              <div key={s.id} className={`bg-card border rounded-xl p-4 transition-colors ${s.isCompleted ? 'border-emerald-500/30 opacity-60' : 'border-border hover:border-violet-500/30'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{SUGGESTION_ICONS[s.type] || '📌'}</span>
                    <div>
                      <h4 className={`font-bold text-sm ${s.isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{s.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{s.subject}</span>
                        <span className="text-xs text-muted-foreground">
                          Prioridade: {'⭐'.repeat(Math.min(s.priority || 1, 5))}
                        </span>
                        {s.suggestedDate && (
                          <span className="text-xs text-muted-foreground">
                            Sugerido: {new Date(s.suggestedDate).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {!s.isCompleted && (
                    <button
                      onClick={() => completeSuggestion.mutate({ id: s.id })}
                      className="p-2 rounded-lg hover:bg-emerald-500/10 text-muted-foreground hover:text-emerald-400 transition-colors flex-shrink-0"
                      title="Marcar como concluído"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-muted/20 rounded-xl border border-dashed border-border">
            <div className="text-3xl mb-2">🤖</div>
            <p className="text-sm text-muted-foreground">Clique em "Gerar Plano com IA" para criar um plano de estudo personalizado</p>
          </div>
        )}

        {/* Delete Exam */}
        <button
          onClick={() => { if (confirm('Excluir esta prova?')) deleteExam.mutate({ id: selectedExam.id }); }}
          className="w-full py-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors"
        >
          Excluir Prova
        </button>
      </div>
    );
  }

  // ─── Calendar View (Default) ───────────────────────────
  const sortedExams = useMemo(() => {
    if (!exams.data) return [];
    return [...exams.data].sort((a: any, b: any) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime());
  }, [exams.data]);

  const upcomingCount = upcomingExams.data?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-display font-bold text-foreground">Calendário de Provas</h2>
        <button
          onClick={() => setView('create')}
          className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
          Nova Prova
        </button>
      </div>

      {/* Stats */}
      {upcomingCount > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📅</span>
            <div>
              <span className="font-bold text-foreground">{upcomingCount} prova{upcomingCount > 1 ? 's' : ''}</span>
              <span className="text-muted-foreground"> nos próximos 90 dias</span>
            </div>
          </div>
        </div>
      )}

      {/* Exam List */}
      {exams.isLoading ? (
        <div className="flex justify-center py-8">
          <svg className="animate-spin h-8 w-8 text-teal-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
        </div>
      ) : sortedExams.length > 0 ? (
        <div className="space-y-3">
          {sortedExams.map((exam: any) => {
            const daysLeft = getDaysUntil(exam.examDate);
            const imp = IMPORTANCE_COLORS[exam.importance || 'medium'];
            const isPast = daysLeft < 0;

            return (
              <button
                key={exam.id}
                onClick={() => { setSelectedExamId(exam.id); setView('detail'); }}
                className={`w-full text-left bg-card border rounded-xl p-4 hover:border-teal-500/30 transition-all ${isPast ? 'opacity-50' : ''} ${
                  daysLeft <= 7 && daysLeft >= 0 ? 'border-red-500/30 animate-pulse-slow' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl ${
                      isPast ? 'bg-muted' : daysLeft <= 7 ? 'bg-red-500/20' : daysLeft <= 30 ? 'bg-amber-500/20' : 'bg-teal-500/20'
                    } flex items-center justify-center`}>
                      <span className="text-lg">{isPast ? '✅' : daysLeft <= 7 ? '🔥' : '📅'}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground">{exam.title}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {new Date(exam.examDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${imp.bg} ${imp.text}`}>{imp.label}</span>
                        <span className="text-xs text-muted-foreground">
                          {EXAM_TYPES.find(t => t.value === exam.examType)?.label || exam.examType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={`text-right ${daysLeft <= 7 && daysLeft >= 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                    <div className="text-lg font-bold">{isPast ? 'Passou' : `${daysLeft}d`}</div>
                    <div className="text-xs">{isPast ? '' : 'restantes'}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
          <div className="text-4xl mb-3">📅</div>
          <h4 className="font-bold text-foreground mb-1">Nenhuma prova cadastrada</h4>
          <p className="text-sm text-muted-foreground mb-4">Adicione suas provas e receba sugestões de estudo personalizadas</p>
          <button
            onClick={() => setView('create')}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition-colors"
          >
            Adicionar Primeira Prova
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamCalendar;
