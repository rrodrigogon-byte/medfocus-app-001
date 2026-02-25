/**
 * ProfessorPortal v2.0 — Portal Completo do Professor
 * - Upload de conteúdo e materiais
 * - Correções assistidas por IA (professor confirma/rejeita)
 * - Tirar dúvidas dos alunos
 * - Gestão de turmas e convites
 * - Parceria Universitária (min 30 alunos)
 * - Analytics de turma
 */
import React, { useState, useRef } from 'react';

interface Student {
  id: string; name: string; email: string; avatar: string; performance: number; lastActive: string; status: 'active' | 'invited' | 'inactive';
}

interface Question {
  id: string; studentName: string; studentAvatar: string; subject: string; question: string; date: string; status: 'pending' | 'answered'; answer?: string; aiSuggestion?: string;
}

interface Document {
  id: string; studentName: string; title: string; type: string; date: string; status: 'pending' | 'ai-reviewed' | 'confirmed' | 'rejected' | 'returned';
  grade?: number; feedback?: string; aiGrade?: number; aiFeedback?: string; aiCorrections?: string[];
}

interface UploadedContent {
  id: string; title: string; type: 'material' | 'slide' | 'video' | 'exercise' | 'exam'; subject: string; date: string; classId: string; downloads: number; fileSize: string;
}

interface ClassRoom {
  id: string; name: string; subject: string; studentCount: number; avgPerformance: number; nextClass: string; inviteCode: string; isPartnership: boolean;
}

export default function ProfessorPortal() {
  const [tab, setTab] = useState<'overview' | 'questions' | 'documents' | 'classes' | 'content' | 'upload' | 'invites' | 'ai-assistant'>('overview');
  const [answerText, setAnswerText] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteSent, setInviteSent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedContent[]>([
    { id: '1', title: 'Aula 01 — Introdução à Farmacologia', type: 'slide', subject: 'Farmacologia', date: '2026-02-20', classId: '1', downloads: 38, fileSize: '12.4 MB' },
    { id: '2', title: 'Roteiro de Estudo — Antibióticos', type: 'material', subject: 'Farmacologia', date: '2026-02-18', classId: '1', downloads: 42, fileSize: '3.2 MB' },
    { id: '3', title: 'Caso Clínico — Pneumonia Comunitária', type: 'exercise', subject: 'Clínica Médica', date: '2026-02-15', classId: '2', downloads: 35, fileSize: '1.8 MB' },
    { id: '4', title: 'Prova P1 — Farmacologia Básica', type: 'exam', subject: 'Farmacologia', date: '2026-02-10', classId: '1', downloads: 42, fileSize: '2.1 MB' },
    { id: '5', title: 'Videoaula — Exame Físico Cardiovascular', type: 'video', subject: 'Semiologia', date: '2026-02-08', classId: '2', downloads: 28, fileSize: '245 MB' },
  ]);

  const [classes] = useState<ClassRoom[]>([
    { id: '1', name: 'Turma A — 3° Ano', subject: 'Farmacologia', studentCount: 42, avgPerformance: 78, nextClass: '2026-02-25 08:00', inviteCode: 'MF-FARMA-2026A', isPartnership: false },
    { id: '2', name: 'Turma B — 4° Ano', subject: 'Clínica Médica', studentCount: 38, avgPerformance: 82, nextClass: '2026-02-25 10:00', inviteCode: 'MF-CLIN-2026B', isPartnership: true },
    { id: '3', name: 'Turma C — 5° Ano', subject: 'Cirurgia', studentCount: 35, avgPerformance: 75, nextClass: '2026-02-26 14:00', inviteCode: 'MF-CIR-2026C', isPartnership: false },
  ]);

  const [students] = useState<Student[]>([
    { id: '1', name: 'Ana Silva', email: 'ana.silva@uni.edu.br', avatar: 'A', performance: 92, lastActive: '2026-02-24', status: 'active' },
    { id: '2', name: 'Carlos Mendes', email: 'carlos.m@uni.edu.br', avatar: 'C', performance: 85, lastActive: '2026-02-24', status: 'active' },
    { id: '3', name: 'Maria Santos', email: 'maria.s@uni.edu.br', avatar: 'M', performance: 78, lastActive: '2026-02-23', status: 'active' },
    { id: '4', name: 'João Oliveira', email: 'joao.o@uni.edu.br', avatar: 'J', performance: 71, lastActive: '2026-02-22', status: 'active' },
    { id: '5', name: 'Convite Pendente', email: 'lucas.f@uni.edu.br', avatar: 'L', performance: 0, lastActive: '-', status: 'invited' },
  ]);

  const [questions, setQuestions] = useState<Question[]>([
    { id: '1', studentName: 'Ana Silva', studentAvatar: 'A', subject: 'Farmacologia', question: 'Professor, qual a diferença entre IECA e BRA no mecanismo de ação?', date: '2026-02-24', status: 'pending', aiSuggestion: 'Os IECA bloqueiam a conversão de Angiotensina I em Angiotensina II, enquanto os BRA bloqueiam o receptor AT1 da Angiotensina II. Clinicamente, IECA pode causar tosse seca (acúmulo de bradicinina), enquanto BRA não.\n\nRef: Goodman & Gilman, 14ª ed., Cap. 26.' },
    { id: '2', studentName: 'Carlos Mendes', studentAvatar: 'C', subject: 'Clínica Médica', question: 'Na aula sobre ICC, o senhor mencionou critérios de Framingham. Poderia detalhar?', date: '2026-02-23', status: 'pending', aiSuggestion: 'Critérios de Framingham para ICC:\n\nMAIORES: Dispneia paroxística noturna, turgência jugular, estertores, cardiomegalia, EAP, galope B3, PVC > 16 cmH2O, refluxo hepatojugular.\n\nMENORES: Edema de MMII, tosse noturna, dispneia aos esforços, hepatomegalia, derrame pleural, FC > 120.\n\nDiagnóstico: 2 maiores OU 1 maior + 2 menores.\n\nRef: McKee PA et al. N Engl J Med. 1971;285(26):1441-6.' },
    { id: '3', studentName: 'Maria Santos', studentAvatar: 'M', subject: 'Cirurgia', question: 'Sobre apendicite aguda, quando é indicada laparoscopia vs. aberta?', date: '2026-02-22', status: 'answered', answer: 'Laparoscopia é preferida na maioria dos casos. Abordagem aberta em peritonite difusa ou instabilidade hemodinâmica.' },
  ]);

  const [documents, setDocuments] = useState<Document[]>([
    { id: '1', studentName: 'Ana Silva', title: 'Relatório de Caso Clínico — Pneumonia', type: 'PDF', date: '2026-02-23', status: 'ai-reviewed', aiGrade: 8.5, aiFeedback: 'Trabalho bem estruturado com boa revisão bibliográfica. Pontos fortes: diagnóstico diferencial completo. Pontos a melhorar: poderia incluir mais detalhes sobre o tratamento empírico.', aiCorrections: ['Página 3: "Streptococcus pneumoniae" deve ser em itálico', 'Página 5: Referência Harrison 21ª ed. está desatualizada (usar 22ª)', 'Conclusão: adicionar prognóstico e seguimento ambulatorial'] },
    { id: '2', studentName: 'Carlos Mendes', title: 'Trabalho — Farmacologia dos Opioides', type: 'DOCX', date: '2026-02-22', status: 'ai-reviewed', aiGrade: 7.0, aiFeedback: 'Conteúdo adequado, mas faltou abordar os efeitos adversos de forma mais detalhada. A seção sobre tolerância e dependência precisa ser expandida.', aiCorrections: ['Seção 2: Faltou mencionar receptores mu, kappa e delta', 'Tabela 1: Doses de morfina estão incorretas (verificar Goodman & Gilman)', 'Faltou referência sobre Escala OMS de Dor'] },
    { id: '3', studentName: 'Maria Santos', title: 'Resumo — Semiologia Abdominal', type: 'PDF', date: '2026-02-21', status: 'confirmed', grade: 9.0, feedback: 'Excelente trabalho! Boa organização e referências atualizadas.' },
    { id: '4', studentName: 'João Oliveira', title: 'Apresentação — Diabetes Mellitus', type: 'PPTX', date: '2026-02-20', status: 'returned', grade: 7.5, feedback: 'Bom conteúdo, mas faltou abordar o tratamento com insulina.' },
  ]);

  const [newContent, setNewContent] = useState({ title: '', type: 'material', subject: '', content: '', classId: '1' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const answerQuestion = (id: string) => {
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: 'answered' as const, answer: answerText } : q));
    setAnswerText(''); setSelectedQuestion(null);
    import('sonner').then(m => m.toast.success('Resposta enviada ao aluno!'));
  };

  const confirmAIReview = (id: string, approve: boolean) => {
    if (approve) {
      const doc = documents.find(d => d.id === id);
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'confirmed' as const, grade: d.aiGrade, feedback: feedbackText || d.aiFeedback } : d));
      import('sonner').then(m => m.toast.success(`Correção confirmada! Nota ${doc?.aiGrade} enviada ao aluno.`));
    } else {
      setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'pending' as const } : d));
      import('sonner').then(m => m.toast.info('Correção rejeitada. Revise manualmente.'));
    }
    setFeedbackText(''); setSelectedDoc(null);
  };

  const reviewDocument = (id: string, grade: number) => {
    setDocuments(prev => prev.map(d => d.id === id ? { ...d, status: 'confirmed' as const, grade, feedback: feedbackText } : d));
    setFeedbackText(''); setSelectedDoc(null);
    import('sonner').then(m => m.toast.success('Documento avaliado!'));
  };

  const useAISuggestion = (q: Question) => { setAnswerText(q.aiSuggestion || ''); };

  const handleFileUpload = () => {
    setIsUploading(true); setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(p => {
        if (p >= 100) { clearInterval(interval); setIsUploading(false); return 100; }
        return p + 10;
      });
    }, 200);
    setTimeout(() => {
      setUploadedFiles(prev => [{ id: Date.now().toString(), title: newContent.title || 'Novo Material', type: newContent.type as any, subject: newContent.subject || 'Geral', date: new Date().toISOString().split('T')[0], classId: newContent.classId, downloads: 0, fileSize: '2.5 MB' }, ...prev]);
      import('sonner').then(m => m.toast.success('Material enviado para a turma!'));
    }, 2200);
  };

  const sendInvites = () => {
    const emails = inviteEmails.split(/[,;\n]/).map(e => e.trim()).filter(Boolean);
    if (emails.length < 1) return;
    setInviteSent(true);
    import('sonner').then(m => m.toast.success(`${emails.length} convites enviados!`));
    setTimeout(() => setInviteSent(false), 3000);
  };

  const pendingQuestions = questions.filter(q => q.status === 'pending').length;
  const pendingDocs = documents.filter(d => d.status === 'pending' || d.status === 'ai-reviewed').length;
  const totalStudents = classes.reduce((s, c) => s + c.studentCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"><span className="text-xl">👨‍🏫</span></div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Portal do Professor</h2>
            <p className="text-xs text-muted-foreground">Gerencie turmas, corrija com IA, responda alunos e envie materiais</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
          {[
            { label: 'Turmas', value: classes.length, icon: '🏫', color: 'text-blue-400' },
            { label: 'Alunos', value: totalStudents, icon: '👥', color: 'text-green-400' },
            { label: 'Perguntas', value: pendingQuestions, icon: '❓', color: pendingQuestions > 0 ? 'text-amber-400' : 'text-muted-foreground' },
            { label: 'Correções IA', value: documents.filter(d => d.status === 'ai-reviewed').length, icon: '🤖', color: 'text-violet-400' },
            { label: 'Materiais', value: uploadedFiles.length, icon: '📚', color: 'text-cyan-400' },
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
          { id: 'questions', label: `❓ Dúvidas ${pendingQuestions > 0 ? `(${pendingQuestions})` : ''}` },
          { id: 'documents', label: `🤖 Correções ${pendingDocs > 0 ? `(${pendingDocs})` : ''}` },
          { id: 'upload', label: '📤 Upload' },
          { id: 'classes', label: '🏫 Turmas' },
          { id: 'invites', label: '✉️ Convites' },
          { id: 'content', label: '📝 Criar' },
          { id: 'ai-assistant', label: '🤖 IA' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as any)}
            className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${tab === t.id ? 'bg-primary/10 text-primary border border-primary/20' : 'text-muted-foreground hover:bg-muted/50'}`}
          >{t.label}</button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div className="space-y-4">
          {/* AI Corrections Pending */}
          {documents.filter(d => d.status === 'ai-reviewed').length > 0 && (
            <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4">
              <h3 className="text-sm font-bold text-violet-400 mb-2">🤖 Correções da IA aguardando sua confirmação</h3>
              <p className="text-xs text-muted-foreground mb-3">A IA analisou os trabalhos abaixo. Revise e confirme ou rejeite as correções.</p>
              {documents.filter(d => d.status === 'ai-reviewed').map(d => (
                <div key={d.id} className="flex items-center gap-3 p-3 bg-card/50 rounded-lg mb-2">
                  <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center text-sm">📄</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">{d.title}</p>
                    <p className="text-[10px] text-muted-foreground">{d.studentName} · Nota IA: <span className="text-violet-400 font-bold">{d.aiGrade}</span></p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => confirmAIReview(d.id, true)} className="px-2 py-1 bg-green-500/10 text-green-400 rounded text-[10px] font-bold hover:bg-green-500/20">Confirmar</button>
                    <button onClick={() => confirmAIReview(d.id, false)} className="px-2 py-1 bg-red-500/10 text-red-400 rounded text-[10px] font-bold hover:bg-red-500/20">Rejeitar</button>
                    <button onClick={() => { setTab('documents'); setSelectedDoc(d.id); }} className="px-2 py-1 bg-primary/10 text-primary rounded text-[10px] font-bold">Detalhar</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recent Questions */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Dúvidas Recentes dos Alunos</h3>
            <div className="space-y-2">
              {questions.filter(q => q.status === 'pending').slice(0, 3).map(q => (
                <div key={q.id} className="flex items-start gap-3 p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-xs font-bold text-amber-400">{q.studentAvatar}</div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">{q.studentName} — {q.subject}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{q.question}</p>
                  </div>
                  <button onClick={() => { setTab('questions'); setSelectedQuestion(q.id); }} className="text-[10px] text-primary hover:underline">Responder</button>
                </div>
              ))}
            </div>
          </div>

          {/* Classes Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {classes.map(c => (
              <div key={c.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-foreground">{c.name}</h4>
                  {c.isPartnership && <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-bold">PARCERIA</span>}
                </div>
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

      {/* Questions Tab — Tirar Dúvidas */}
      {tab === 'questions' && (
        <div className="space-y-3">
          <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-3 mb-2">
            <p className="text-xs text-violet-400">A IA sugere respostas baseadas no conteúdo da disciplina. Você pode usar, editar ou escrever sua própria resposta.</p>
          </div>
          {questions.map(q => (
            <div key={q.id} className={`bg-card border rounded-xl p-4 ${q.status === 'pending' ? 'border-amber-500/20' : 'border-border'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${q.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-green-500/20 text-green-400'}`}>{q.studentAvatar}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
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
                      <p className="text-xs text-muted-foreground whitespace-pre-line">{q.answer}</p>
                    </div>
                  )}

                  {q.status === 'pending' && selectedQuestion === q.id && (
                    <div className="mt-3 space-y-2">
                      {q.aiSuggestion && (
                        <div className="p-3 bg-violet-500/5 border border-violet-500/10 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs font-bold text-violet-400">🤖 Sugestão da IA:</p>
                            <button onClick={() => useAISuggestion(q)} className="text-[10px] text-violet-400 hover:underline font-bold">Usar sugestão</button>
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-pre-line">{q.aiSuggestion}</p>
                        </div>
                      )}
                      <textarea value={answerText} onChange={(e) => setAnswerText(e.target.value)} placeholder="Digite sua resposta..." rows={4}
                        className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none" />
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

      {/* Documents Tab — Correções IA */}
      {tab === 'documents' && (
        <div className="space-y-3">
          <div className="bg-violet-500/5 border border-violet-500/10 rounded-lg p-3 mb-2">
            <p className="text-xs text-violet-400 font-bold">Sistema de Correção com IA</p>
            <p className="text-[10px] text-muted-foreground mt-1">A IA analisa os trabalhos e sugere nota + feedback. Você confirma, rejeita ou ajusta. A responsabilidade final é sempre do professor.</p>
          </div>
          {documents.map(d => (
            <div key={d.id} className={`bg-card border rounded-xl p-4 ${d.status === 'ai-reviewed' ? 'border-violet-500/20' : d.status === 'pending' ? 'border-amber-500/20' : 'border-border'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${d.status === 'ai-reviewed' ? 'bg-violet-500/20' : 'bg-blue-500/20'}`}>
                  {d.status === 'ai-reviewed' ? '🤖' : '📄'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-foreground">{d.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      d.status === 'ai-reviewed' ? 'bg-violet-500/10 text-violet-400' :
                      d.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                      d.status === 'confirmed' ? 'bg-green-500/10 text-green-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {d.status === 'ai-reviewed' ? '🤖 IA Revisou' : d.status === 'pending' ? 'Pendente' : d.status === 'confirmed' ? 'Confirmado' : 'Devolvido'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{d.studentName} · {d.type} · {d.date}</p>

                  {/* AI Review Details */}
                  {d.status === 'ai-reviewed' && (
                    <div className="mt-3 space-y-2">
                      <div className="p-3 bg-violet-500/5 border border-violet-500/10 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-bold text-violet-400">Nota sugerida pela IA:</span>
                          <span className={`text-lg font-bold ${(d.aiGrade || 0) >= 7 ? 'text-green-400' : 'text-amber-400'}`}>{d.aiGrade?.toFixed(1)}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{d.aiFeedback}</p>
                        {d.aiCorrections && d.aiCorrections.length > 0 && (
                          <div className="mt-2">
                            <p className="text-[10px] font-bold text-violet-400 mb-1">Correções identificadas:</p>
                            <ul className="space-y-1">
                              {d.aiCorrections.map((c, i) => (
                                <li key={i} className="text-[10px] text-muted-foreground flex items-start gap-1">
                                  <span className="text-amber-400 mt-0.5">•</span> {c}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => confirmAIReview(d.id, true)} className="px-4 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-xs font-bold hover:bg-green-500/20">
                          Confirmar Nota {d.aiGrade?.toFixed(1)}
                        </button>
                        <button onClick={() => confirmAIReview(d.id, false)} className="px-4 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/20">
                          Rejeitar — Corrigir Manualmente
                        </button>
                        <button onClick={() => setSelectedDoc(d.id)} className="px-4 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-bold">
                          Ajustar Nota/Feedback
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Manual Review */}
                  {(d.status === 'pending') && selectedDoc === d.id && (
                    <div className="mt-3 space-y-2">
                      <div className="flex gap-2">
                        <input type="number" min="0" max="10" step="0.5" placeholder="Nota (0-10)" id={`grade-${d.id}`}
                          className="w-24 px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40" />
                      </div>
                      <textarea value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} placeholder="Feedback para o aluno..." rows={3}
                        className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none" />
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedDoc(null)} className="px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground">Cancelar</button>
                        <button onClick={() => { const g = document.getElementById(`grade-${d.id}`) as HTMLInputElement; reviewDocument(d.id, parseFloat(g?.value || '0')); }}
                          className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold">Avaliar</button>
                      </div>
                    </div>
                  )}

                  {/* Confirmed Grade */}
                  {(d.status === 'confirmed' || d.status === 'returned') && d.grade !== undefined && (
                    <div className="mt-2 flex items-center gap-3">
                      <span className={`text-lg font-bold ${d.grade >= 7 ? 'text-green-400' : 'text-red-400'}`}>{d.grade.toFixed(1)}</span>
                      {d.feedback && <p className="text-xs text-muted-foreground">{d.feedback}</p>}
                    </div>
                  )}

                  {d.status === 'pending' && selectedDoc !== d.id && (
                    <button onClick={() => setSelectedDoc(d.id)} className="mt-2 text-xs text-primary hover:underline">Avaliar manualmente</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Tab */}
      {tab === 'upload' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-sm font-bold text-foreground mb-4">📤 Upload de Material para Turma</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
              {[
                { type: 'material', icon: '📚', label: 'Material' },
                { type: 'slide', icon: '📊', label: 'Slides' },
                { type: 'video', icon: '🎬', label: 'Vídeo' },
                { type: 'exercise', icon: '📝', label: 'Exercício' },
                { type: 'exam', icon: '📋', label: 'Prova' },
              ].map(t => (
                <button key={t.type} onClick={() => setNewContent(prev => ({ ...prev, type: t.type }))}
                  className={`p-3 rounded-xl border text-center transition-colors ${newContent.type === t.type ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:border-primary/20'}`}>
                  <div className="text-xl mb-1">{t.icon}</div>
                  <div className="text-[10px] font-bold">{t.label}</div>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input type="text" placeholder="Título do material" value={newContent.title} onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
                className="px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40" />
              <select value={newContent.classId} onChange={(e) => setNewContent(prev => ({ ...prev, classId: e.target.value }))}
                className="px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40">
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* Drop Zone */}
            <div onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors">
              <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.mp3,.zip" />
              <div className="text-3xl mb-2">📁</div>
              <p className="text-sm font-bold text-foreground">Arraste arquivos aqui ou clique para selecionar</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, PPTX, MP4, MP3, ZIP (máx. 500MB)</p>
            </div>

            {isUploading && (
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">Enviando...</span>
                  <span className="text-primary font-bold">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            <button onClick={handleFileUpload} disabled={!newContent.title || isUploading}
              className="mt-3 w-full py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-all">
              {isUploading ? 'Enviando...' : 'Enviar para Turma'}
            </button>
          </div>

          {/* Uploaded Files History */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Materiais Enviados</h3>
            <div className="space-y-2">
              {uploadedFiles.map(f => (
                <div key={f.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm">
                    {f.type === 'slide' ? '📊' : f.type === 'video' ? '🎬' : f.type === 'exam' ? '📋' : f.type === 'exercise' ? '📝' : '📚'}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">{f.title}</p>
                    <p className="text-[10px] text-muted-foreground">{f.subject} · {f.date} · {f.fileSize}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-primary">{f.downloads}</p>
                    <p className="text-[10px] text-muted-foreground">downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Classes Tab */}
      {tab === 'classes' && (
        <div className="space-y-4">
          {classes.map(c => (
            <div key={c.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-foreground">{c.name}</h3>
                    {c.isPartnership && <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-bold">PARCERIA UNIV.</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{c.subject} · Próxima aula: {c.nextClass}</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium">Enviar Material</button>
                  <button className="px-3 py-1.5 bg-violet-500/10 text-violet-400 rounded-lg text-xs font-medium">Criar Quiz IA</button>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
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
                <div className="bg-muted/30 rounded-lg p-3 text-center">
                  <div className="text-xs font-mono font-bold text-cyan-400">{c.inviteCode}</div>
                  <div className="text-[10px] text-muted-foreground">Código</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Invites Tab — Convites e Parceria */}
      {tab === 'invites' && (
        <div className="space-y-4">
          {/* Partnership Info */}
          <div className="bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border border-purple-500/20 rounded-xl p-5">
            <h3 className="text-sm font-bold text-purple-400 mb-2">🏛️ Parceria Universitária</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Na parceria, o professor mentor envia convites para mínimo de 30 alunos. O professor é <span className="text-emerald-400 font-bold">gratuito</span> e os alunos recebem <span className="text-purple-400 font-bold">40% de desconto</span> no plano anual.
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-emerald-400">{totalStudents}</p>
                <p className="text-[10px] text-muted-foreground">Alunos ativos</p>
              </div>
              <div className="bg-card/50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-purple-400">30</p>
                <p className="text-[10px] text-muted-foreground">Mínimo parceria</p>
              </div>
              <div className="bg-card/50 rounded-lg p-3 text-center">
                <p className={`text-lg font-bold ${totalStudents >= 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {totalStudents >= 30 ? 'Elegível' : `Faltam ${30 - totalStudents}`}
                </p>
                <p className="text-[10px] text-muted-foreground">Status</p>
              </div>
            </div>
          </div>

          {/* Send Invites */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">✉️ Enviar Convites para Alunos</h3>
            <p className="text-xs text-muted-foreground mb-3">Cole os e-mails dos alunos (separados por vírgula ou um por linha). Eles receberão um link para se cadastrar com desconto de parceria.</p>
            <textarea value={inviteEmails} onChange={(e) => setInviteEmails(e.target.value)} placeholder="aluno1@universidade.edu.br&#10;aluno2@universidade.edu.br&#10;aluno3@universidade.edu.br" rows={6}
              className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none font-mono" />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-muted-foreground">
                {inviteEmails.split(/[,;\n]/).filter(e => e.trim()).length} e-mails detectados
              </p>
              <button onClick={sendInvites} disabled={inviteEmails.split(/[,;\n]/).filter(e => e.trim()).length < 1}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold disabled:opacity-50 hover:opacity-90">
                {inviteSent ? 'Convites Enviados!' : 'Enviar Convites'}
              </button>
            </div>
          </div>

          {/* Student List */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">👥 Alunos Cadastrados</h3>
            <div className="space-y-2">
              {students.map(s => (
                <div key={s.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${s.status === 'active' ? 'bg-green-500/20 text-green-400' : s.status === 'invited' ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-500/20 text-gray-400'}`}>
                    {s.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-foreground">{s.name}</p>
                    <p className="text-[10px] text-muted-foreground">{s.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${s.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {s.status === 'active' ? 'Ativo' : 'Convidado'}
                    </span>
                    {s.performance > 0 && <p className="text-[10px] text-muted-foreground mt-0.5">{s.performance}%</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create Content Tab */}
      {tab === 'content' && (
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-foreground">Criar Material para Turma</h3>
          <div className="grid grid-cols-2 gap-3">
            {['Material de Aula', 'Quiz/Prova', 'Caso Clínico', 'Lista de Exercícios'].map(type => (
              <button key={type} onClick={() => setNewContent(prev => ({ ...prev, type }))}
                className={`p-4 rounded-xl border text-center transition-colors ${newContent.type === type ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:border-primary/20'}`}>
                <div className="text-2xl mb-1">{type === 'Material de Aula' ? '📚' : type === 'Quiz/Prova' ? '📝' : type === 'Caso Clínico' ? '🏥' : '📋'}</div>
                <div className="text-xs font-bold">{type}</div>
              </button>
            ))}
          </div>
          <input type="text" placeholder="Título do material" value={newContent.title} onChange={(e) => setNewContent(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40" />
          <textarea placeholder="Conteúdo do material... (Markdown suportado)" value={newContent.content} onChange={(e) => setNewContent(prev => ({ ...prev, content: e.target.value }))} rows={10}
            className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/40 resize-none" />
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
              <p className="text-xs text-muted-foreground">Gere provas, corrija trabalhos, crie materiais — IA Gemini integrada</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📝', title: 'Gerar Prova', desc: 'Crie provas com questões baseadas no conteúdo da turma' },
              { icon: '✅', title: 'Corrigir Trabalhos', desc: 'IA analisa e sugere notas — você confirma ou rejeita' },
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
