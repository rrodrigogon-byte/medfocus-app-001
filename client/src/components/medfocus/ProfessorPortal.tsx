/**
 * ProfessorPortal — Portal Completo do Professor
 * Receber documentos, responder alunos, gerenciar turmas, criar conteúdo
 */
import React, { useState } from 'react';

interface Student {
  id: string;
  name: string;
  email: string;
  avatar: string;
  performance: number;
  lastActive: string;
}

interface Question {
  id: string;
  studentName: string;
  studentAvatar: string;
  subject: string;
  question: string;
  date: string;
  status: 'pending' | 'answered';
  answer?: string;
  aiSuggestion?: string;
}

interface Document {
  id: string;
  studentName: string;
  title: string;
  type: string;
  date: string;
  status: 'pending' | 'reviewed' | 'returned';
  grade?: number;
  feedback?: string;
}

interface ClassRoom {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  avgPerformance: number;
  nextClass: string;
}

export default function ProfessorPortal() {
  const [tab, setTab] = useState<'overview' | 'questions' | 'documents' | 'classes' | 'content' | 'ai-assistant'>('overview');
  const [answerText, setAnswerText] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

  const [classes] = useState<ClassRoom[]>([
    { id: '1', name: 'Turma A — 3° Ano', subject: 'Farmacologia', studentCount: 42, avgPerformance: 78, nextClass: '2026-02-25 08:00' },
    { id: '2', name: 'Turma B — 4° Ano', subject: 'Clínica Médica', studentCount: 38, avgPerformance: 82, nextClass: '2026-02-25 10:00' },
    { id: '3', name: 'Turma C — 5° Ano', subject: 'Cirurgia', studentCount: 35, avgPerformance: 75, nextClass: '2026-02-26 14:00' },
  ]);

  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', studentName: 'Ana Silva', studentAvatar: 'A', subject: 'Farmacologia', question: 'Professor, qual a diferença entre IECA e BRA no mecanismo de ação? Ambos atuam no SRAA mas de formas diferentes?', date: '2026-02-24', status: 'pending', aiSuggestion: 'Os IECA (Inibidores da Enzima Conversora de Angiotensina) bloqueiam a conversão de Angiotensina I em Angiotensina II, enquanto os BRA (Bloqueadores do Receptor de Angiotensina) bloqueiam o receptor AT1 da Angiotensina II. A principal diferença clínica é que IECA pode causar tosse seca (acúmulo de bradicinina), enquanto BRA não apresenta esse efeito.' },
    { id: '2', studentName: 'Carlos Mendes', studentAvatar: 'C', subject: 'Clínica Médica', question: 'Na aula sobre ICC, o senhor mencionou critérios de Framingham. Poderia detalhar os critérios maiores e menores?', date: '2026-02-23', status: 'pending', aiSuggestion: 'Critérios de Framingham para ICC:\n\nMAIORES: Dispneia paroxística noturna, turgência jugular, estertores, cardiomegalia, edema agudo de pulmão, galope B3, PVC > 16 cmH2O, refluxo hepatojugular.\n\nMENORES: Edema de MMII, tosse noturna, dispneia aos esforços, hepatomegalia, derrame pleural, taquicardia > 120 bpm.\n\nDiagnóstico: 2 maiores OU 1 maior + 2 menores.' },
    { id: '3', studentName: 'Maria Santos', studentAvatar: 'M', subject: 'Cirurgia', question: 'Sobre apendicite aguda, quando é indicada a abordagem laparoscópica vs. aberta?', date: '2026-02-22', status: 'answered', answer: 'A laparoscopia é preferida na maioria dos casos por menor dor pós-operatória e recuperação mais rápida. A abordagem aberta é indicada em casos complicados com peritonite difusa ou instabilidade hemodinâmica.' },
  ]);

  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', studentName: 'Ana Silva', title: 'Relatório de Caso Clínico — Pneumonia', type: 'PDF', date: '2026-02-23', status: 'pending' },
    { id: '2', studentName: 'Carlos Mendes', title: 'Trabalho — Farmacologia dos Opioides', type: 'DOCX', date: '2026-02-22', status: 'pending' },
    { id: '3', studentName: 'Maria Santos', title: 'Resumo — Semiologia Abdominal', type: 'PDF', date: '2026-02-21', status: 'reviewed', grade: 9.0, feedback: 'Excelente trabalho! Boa organização e referências atualizadas.' },
    { id: '4', studentName: 'João Oliveira', title: 'Apresentação — Diabetes Mellitus', type: 'PPTX', date: '2026-02-20', status: 'returned', grade: 7.5, feedback: 'Bom conteúdo, mas faltou abordar o tratamento com insulina.' },
  ]);

  const [newContent, setNewContent] = useState({ title: '', type: 'material', subject: '', content: '' });

  const answerQuestion = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: 'answered' as const, answer: answerText } : q));
    setAnswerText('');
    setSelectedQuestion(null);
    import('sonner').then(m => m.toast.success('Resposta enviada ao aluno!'));
  };

  const reviewDocument = (id: string, grade: number) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'reviewed' as const, grade, feedback: feedbackText } : d));
    setFeedbackText('');
    setSelectedDoc(null);
    import('sonner').then(m => m.toast.success('Documento avaliado!'));
  };

  const useAISuggestion = (q: Question) => {
    setAnswerText(q.aiSuggestion || '');
  };

  const pendingQuestions = questions.filter(q => q.status === 'pending').length;
  const pendingDocs = documents.filter(d => d.status === 'pending').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <span className="text-xl">👨‍🏫</span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Portal do Professor</h2>
            <p className="text-xs text-muted-foreground">Gerencie turmas, responda alunos e avalie documentos</p>
          </div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Turmas', value: classes.length, icon: '🏫', color: 'text-blue-400' },
            { label: 'Alunos', value: classes.reduce((s, c) => s + c.studentCount, 0), icon: '👥', color: 'text-green-400' },
            { label: 'Perguntas', value: pendingQuestions, icon: '❓', color: pendingQuestions > 0 ? 'text-amber-400' : 'text-muted-foreground' },
            { label: 'Documentos', value: pendingDocs, icon: '📄', color: pendingDocs > 0 ? 'text-red-400' : 'text-muted-foreground' },
          ].map((s, i) => (
            <div key={i} className="bg-card/50 border border-border rounded-lg p-3 text-center">
              <div className="text-lg">{s.icon}</div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {[
          { id: 'overview', label: '📊 Visão Geral' },
          { id: 'questions', label: `❓ Perguntas ${pendingQuestions > 0 ? `(${pendingQuestions})` : ''}` },
          { id: 'documents', label: `📄 Documentos ${pendingDocs > 0 ? `(${pendingDocs})` : ''}` },
          { id: 'classes', label: '🏫 Turmas' },
          { id: 'content', label: '📝 Criar Conteúdo' },
          { id: 'ai-assistant', label: '🤖 Assistente IA' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              tab === t.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-4">
          {/* Recent Activity */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Atividade Recente</h3>
            <div className="space-y-3">
              {questions.filter(q => q.status === 'pending').slice(0, 3).map(q => (
                <div key={q.id} className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">{q.studentAvatar}</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">{q.studentName} perguntou sobre {q.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{q.question}</p>
                  </div>
                  <button onClick={() => { setTab('questions'); setSelectedQuestion(q.id); }} className="text-[10px] text-primary hover:underline">Responder</button>
                </div>
              ))}
              {documents.filter(d => d.status === 'pending').slice(0, 2).map(d => (
                <div key={d.id} className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs">📄</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">{d.studentName} enviou {d.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{d.type} · {d.date}</p>
                  </div>
                  <button onClick={() => { setTab('documents'); setSelectedDoc(d.id); }} className="text-[10px] text-primary hover:underline">Avaliar</button>
                </div>
              ))}
            </div>
          </div>

          {/* Classes Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {classes.map(c => (
              <div key={c.id} className="bg-card border border-border rounded-xl p-4">
                <h4 className="text-sm font-bold text-foreground">{c.name}</h4>
                <p className="text-xs text-muted-foreground">{c.subject}</p>
                <div className="flex items-center gap-4 mt-3 text-xs">
                  <span className="text-muted-foreground">👥 {c.studentCount}</span>
                  <span className="text-muted-foreground">📊 {c.avgPerformance}%</span>
                </div>
                <div className="mt-2 w-full bg-muted rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full" style={{ width: `${c.avgPerformance}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Questions Tab */}
      {tab === 'questions' && (
        <div className="space-y-3">
          {questions.map(q => (
            <div key={q.id} className={`bg-card border rounded-xl p-4 ${q.status === 'pending' ? 'border-amber-500/20' : 'border-border'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${q.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>
                  {q.studentAvatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{q.studentName}</span>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{q.subject}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${q.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>
                      {q.status === 'pending' ? 'Pendente' : 'Respondida'}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{q.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{q.question}</p>

                  {q.status === 'answered' && q.answer && (
                    <div className="mt-3 p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
                      <p className="text-xs font-bold text-green-400 mb-1">Sua resposta:</p>
                      <p className="text-xs text-muted-foreground">{q.answer}</p>
                    </div>
                  )}

                  {q.status === 'pending' && selectedQuestion === q.id && (
                    <div className="mt-3 space-y-2">
                      {q.aiSuggestion && (
                        <div className="p-3 bg-violet-500/5 border border-violet-500/10 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-bold text-violet-400">🤖 Sugestão da IA:</p>
                            <button onClick={() => useAISuggestion(q)} className="text-[10px] text-violet-400 hover:underline">Usar sugestão</button>
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-pre-line">{q.aiSuggestion}</p>
                        </div>
                      )}
                      <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Digite sua resposta..."
                        rows={4}
                        className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedQuestion(null)} className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground">Cancelar</button>
                        <button onClick={() => answerQuestion(q.id)} disabled={!answerText.trim()} className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold disabled:opacity-50">Enviar Resposta</button>
                      </div>
                    </div>
                  )}

                  {q.status === 'pending' && selectedQuestion !== q.id && (
                    <button onClick={() => setSelectedQuestion(q.id)} className="mt-2 text-xs text-primary hover:underline">Responder</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Documents Tab */}
      {tab === 'documents' && (
        <div className="space-y-3">
          {documents.map(d => (
            <div key={d.id} className={`bg-card border rounded-xl p-4 ${d.status === 'pending' ? 'border-blue-500/20' : 'border-border'}`}>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-sm">📄</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">{d.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      d.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : d.status === 'reviewed' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'
                    }`}>
                      {d.status === 'pending' ? 'Pendente' : d.status === 'reviewed' ? 'Avaliado' : 'Devolvido'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{d.studentName} · {d.type} · {d.date}</p>

                  {d.grade !== undefined && (
                    <div className="mt-2 flex items-center gap-3">
                      <span className={`text-lg font-bold ${d.grade >= 7 ? 'text-green-400' : 'text-red-400'}`}>{d.grade.toFixed(1)}</span>
                      {d.feedback && <p className="text-xs text-muted-foreground">{d.feedback}</p>}
                    </div>
                  )}

                  {d.status === 'pending' && selectedDoc === d.id && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          placeholder="Nota (0-10)"
                          className="w-24 px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
                          id={`grade-${d.id}`}
                        />
                      </div>
                      <textarea
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Feedback para o aluno..."
                        rows={3}
                        className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none"
                      />
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedDoc(null)} className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground">Cancelar</button>
                        <button
                          onClick={() => {
                            const gradeInput = document.getElementById(`grade-${d.id}`) as HTMLInputElement;
                            const grade = parseFloat(gradeInput?.value || '0');
                            reviewDocument(d.id, grade);
                          }}
                          className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold"
                        >
                          Avaliar
                        </button>
                      </div>
                    </div>
                  )}

                  {d.status === 'pending' && selectedDoc !== d.id && (
                    <button onClick={() => setSelectedDoc(d.id)} className="mt-2 text-xs text-primary hover:underline">Avaliar documento</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Classes Tab */}
      {tab === 'classes' && (
        <div className="space-y-4">
          {classes.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{c.name}</h3>
                  <p className="text-xs text-muted-foreground">{c.subject} · Próxima aula: {c.nextClass}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium">Enviar Material</button>
                  <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium">Criar Quiz</button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-foreground">{c.studentCount}</div>
                  <div className="text-[10px] text-muted-foreground">Alunos</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-primary">{c.avgPerformance}%</div>
                  <div className="text-[10px] text-muted-foreground">Média</div>
                </div>
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-foreground">92%</div>
                  <div className="text-[10px] text-muted-foreground">Frequência</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Content Tab */}
      {tab === 'content' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Criar Material para Turma</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Material de Aula', 'Quiz/Prova', 'Caso Clínico', 'Lista de Exercícios'].map(type => (
              <button
                key={type}
                onClick={() => setNewContent(prev => ({ ...prev, type }))}
                className={`p-4 rounded-xl border text-center transition-colors ${
                  newContent.type === type ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:border-primary/20'
                }`}
              >
                <div className="text-2xl mb-1">{type === 'Material de Aula' ? '📚' : type === 'Quiz/Prova' ? '📝' : type === 'Caso Clínico' ? '🏥' : '📋'}</div>
                <div className="text-xs font-bold">{type}</div>
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Título do material"
            value={newContent.title}
            onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40"
          />
          <textarea
            placeholder="Conteúdo do material... (Markdown suportado)"
            value={newContent.content}
            onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))}
            rows={10}
            className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none"
          />
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg text-xs font-bold hover:bg-violet-500/20">🤖 Gerar com IA</button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold ml-auto">Publicar para Turma</button>
          </div>
        </div>
      )}

      {/* AI Assistant Tab */}
      {tab === 'ai-assistant' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-xl">🤖</div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Assistente IA do Professor</h3>
              <p className="text-xs text-muted-foreground">Gere provas, corrija trabalhos, crie materiais automaticamente</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📝', title: 'Gerar Prova', desc: 'Crie provas com questões baseadas no conteúdo da turma' },
              { icon: '✅', title: 'Corrigir Trabalhos', desc: 'IA analisa e sugere notas para trabalhos enviados' },
              { icon: '📊', title: 'Relatório de Turma', desc: 'Análise de desempenho e recomendações personalizadas' },
              { icon: '📚', title: 'Gerar Material', desc: 'Crie slides, resumos e exercícios automaticamente' },
              { icon: '💬', title: 'Responder Alunos', desc: 'IA sugere respostas baseadas no conteúdo da disciplina' },
              { icon: '🎯', title: 'Plano de Aula', desc: 'Gere planos de aula completos com objetivos e atividades' },
            ].map((tool, i) => (
              <button key={i} className="p-4 bg-muted/30 border border-border rounded-xl text-left hover:border-primary/30 transition-colors">
                <div className="text-2xl mb-2">{tool.icon}</div>
                <div className="text-sm font-bold text-foreground">{tool.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{tool.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
