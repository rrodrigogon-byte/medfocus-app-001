/**
 * MedFocus Academic Guide — Premium University Hub
 * Design: Teal accent, card-based layout, clean typography
 * Uses tRPC backend for AI content generation (LLM built-in)
 * Features: DB-cached materials, PDF export, personalized content
 */
import React, { useState, useEffect, useMemo } from 'react';
import { User } from '../../types';
import { trpc } from '@/lib/trpc';
import { UNIVERSITIES, curriculumIcons } from '../../data/universities';
import { useAuth } from '@/_core/hooks/useAuth';

const STUDY_IMG = "https://private-us-east-1.manuscdn.com/sessionFile/IjuoZIpKtB1FShC9GQ88GW/sandbox/gZMRigkW6C4ldwaPiTYiad-img-3_1771179159000_na1fn_bWVkZm9jdXMtc3R1ZHktaWxsdXN0cmF0aW9u.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWp1b1pJcEt0QjFGU2hDOUdRODhHVy9zYW5kYm94L2daTVJpZ2tXNkM0bGR3YVBpVFlpYWQtaW1nLTNfMTc3MTE3OTE1OTAwMF9uYTFmbl9iV1ZrWm05amRYTXRjM1IxWkhrdGFXeHNkWE4wY21GMGFXOXUucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=Fd8pgxfsoS6I-SoQUOOJcsFNHrltDUeqbobSeXnurwPJQmBrOz~vq40gkdrb4FCFtlBu8ssNeU56nvRrxeDUIZBxdKdLuMc1MJxt4lmVw87D~Irg24-O8fhcYv1K1QP641YvlTwmCjYBvkYfae0BzxZyrWspL~P3kEQQe5y-k1f5mRRWX1pvqlbqHxehOP5JanZ-l7CQMld3bbrNcBI2EZcOC0XtZKlLNZ-lBT7TQjnwqY-0XHmcN9ynjvWwvOCtqr0pEw8cOXjx-w-CAEk~CkgW6THHV8q3p7P0JFa~NCK3rI8ejqjEIPTNegEwEDqS-wTzPWnxN7iKX9GzZcxg5A__";

interface GuideProps { user: User; onUpdateUser: (data: Partial<User>) => void; }

const AcademicGuide: React.FC<GuideProps> = ({ user, onUpdateUser }) => {
  const { isAuthenticated } = useAuth();
  const [selectedUnivId, setSelectedUnivId] = useState<string>(user.universityId || '');
  const [activeYear, setActiveYear] = useState<number>(user.currentYear || 1);
  const [viewMode, setViewMode] = useState<'selection' | 'guide' | 'subject' | 'history'>('selection');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [subjectData, setSubjectData] = useState<any | null>(null);
  const [researchData, setResearchData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState<'none' | 'quota' | 'general'>('none');
  const [activeFlashcard, setActiveFlashcard] = useState<number | null>(null);
  const [cachedMaterialId, setCachedMaterialId] = useState<number | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // tRPC mutations for AI content generation
  const generateContentMutation = trpc.ai.generateContent.useMutation();
  const researchMutation = trpc.ai.research.useMutation();
  const saveMaterialMutation = trpc.materials.save.useMutation();
  const exportPdfMutation = trpc.materials.exportPdf.useMutation();

  // Material history query
  const historyQuery = trpc.materials.history.useQuery(undefined, {
    enabled: isAuthenticated && viewMode === 'history',
  });

  const selectedUniv = UNIVERSITIES.find(u => u.id === selectedUnivId);

  // Personalization: determine content depth based on year
  const contentDepthLabel = useMemo(() => {
    if (activeYear <= 2) return 'Básico — Foco em fundamentos e conceitos essenciais';
    if (activeYear <= 4) return 'Intermediário — Correlação clínica e fisiopatologia';
    return 'Avançado — Nível residência com diagnóstico diferencial';
  }, [activeYear]);

  useEffect(() => {
    if (user.universityId && viewMode === 'selection') {
      setSelectedUnivId(user.universityId);
      setViewMode('guide');
    }
  }, [user.universityId]);

  const handleStartGuide = (univId: string) => {
    setSelectedUnivId(univId);
    onUpdateUser({ universityId: univId });
    setViewMode('guide');
  };

  const loadSubjectDetails = async (subject: string) => {
    setIsLoading(true); setActiveSubject(subject); setViewMode('subject');
    setErrorType('none'); setSubjectData(null); setActiveFlashcard(null);
    setIsFromCache(false); setCachedMaterialId(null);

    // 1) Try localStorage cache first (quick, offline-friendly)
    const cacheKey = `medfocus_cache_${selectedUnivId}_${activeYear}_${subject.replace(/\s+/g, '_')}`;
    const cachedLocal = localStorage.getItem(cacheKey);
    if (cachedLocal) {
      try {
        const p = JSON.parse(cachedLocal);
        if (p.timestamp && Date.now() - p.timestamp < 24 * 60 * 60 * 1000) {
          setSubjectData(p.content);
          setResearchData(p.research);
          setIsFromCache(true);
          setIsLoading(false);
          return;
        }
        localStorage.removeItem(cacheKey);
      } catch { localStorage.removeItem(cacheKey); }
    }

    // 2) Try DB cache (persisted across sessions, for authenticated users)
    if (isAuthenticated) {
      try {
        const cachedDb = await fetch(`/api/trpc/materials.findCached?batch=1&input=${encodeURIComponent(JSON.stringify({ "0": { json: { universityId: selectedUnivId, subject, year: activeYear } } }))}`, {
          credentials: 'include',
        }).then(r => r.json());
        
        const result = cachedDb?.[0]?.result?.data?.json;
        if (result && result.content) {
          setSubjectData(result.content);
          setResearchData(result.research || null);
          setCachedMaterialId(result.id);
          setIsFromCache(true);
          setIsLoading(false);
          // Also update localStorage
          localStorage.setItem(cacheKey, JSON.stringify({ content: result.content, research: result.research, timestamp: Date.now() }));
          return;
        }
      } catch (e) {
        console.warn('[AcademicGuide] DB cache lookup failed, generating fresh:', e);
      }
    }

    // 3) Generate fresh content with AI
    try {
      const uName = selectedUniv?.name || 'Universidade';

      // Personalization: adjust prompt depth based on year
      const depthInstruction = activeYear <= 2
        ? 'Foque em conceitos fundamentais, definições claras e analogias didáticas. Nível básico.'
        : activeYear <= 4
        ? 'Inclua correlação clínica, fisiopatologia detalhada e casos clínicos. Nível intermediário.'
        : 'Nível residência: diagnóstico diferencial completo, condutas baseadas em evidências, questões estilo ENARE/USP. Nível avançado.';

      const [content, research] = await Promise.all([
        generateContentMutation.mutateAsync({
          subject,
          universityName: uName,
          year: activeYear,
        }),
        researchMutation.mutateAsync({ topic: `${subject} ${depthInstruction}` }).catch(() => 'Pesquisa indisponível no momento.'),
      ]);

      setSubjectData(content);
      setResearchData(research);
      localStorage.setItem(cacheKey, JSON.stringify({ content, research, timestamp: Date.now() }));

      // 4) Save to DB for future sessions (authenticated users)
      if (isAuthenticated) {
        try {
          await saveMaterialMutation.mutateAsync({
            universityId: selectedUnivId,
            universityName: uName,
            subject,
            year: activeYear,
            content: JSON.stringify(content),
            research: typeof research === 'string' ? research : undefined,
          });
        } catch (e) {
          console.warn('[AcademicGuide] Failed to save material to DB:', e);
        }
      }
    } catch (e: any) {
      console.error('[AcademicGuide] Error generating content:', e);
      setErrorType(e.message?.includes('quota') || e.message?.includes('QUOTA') ? 'quota' : 'general');
    } finally { setIsLoading(false); }
  };

  const handleExportPdf = async () => {
    if (!subjectData || !activeSubject) return;
    setIsExporting(true);
    try {
      const result = await exportPdfMutation.mutateAsync({
        subject: activeSubject,
        universityName: selectedUniv?.name || 'Universidade',
        year: activeYear,
        content: {
          summary: subjectData.summary || '',
          keyPoints: subjectData.keyPoints || [],
          flashcards: subjectData.flashcards,
          innovations: subjectData.innovations,
          references: subjectData.references,
          quiz: subjectData.quiz,
        },
      });

      // Open HTML in new tab for print/save as PDF
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(result.html);
        w.document.close();
        setTimeout(() => w.print(), 500);
      }
    } catch (e) {
      console.error('[AcademicGuide] PDF export failed:', e);
      // Fallback to simple print
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(`<html><head><title>${activeSubject}</title><style>body{font-family:sans-serif;padding:40px;line-height:1.8;color:#1e293b}h1{color:#0d9488}h2{border-bottom:2px solid #e2e8f0;padding-bottom:8px;margin-top:32px}ul{padding-left:20px}li{margin-bottom:8px}</style></head><body><h1>${activeSubject}</h1><p>${subjectData.summary}</p><h2>Pontos-Chave</h2><ul>${subjectData.keyPoints?.map((p:any)=>`<li>${p}</li>`).join('') || ''}</ul></body></html>`);
        w.document.close();
        w.print();
      }
    } finally { setIsExporting(false); }
  };

  // ============ HISTORY VIEW ============
  if (viewMode === 'history') {
    return (
      <div className="space-y-6 animate-fade-in pb-20">
        <div className="flex items-center gap-3">
          <button onClick={() => setViewMode('selection')} className="flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Voltar
          </button>
          <h2 className="text-xl font-display font-extrabold text-foreground">Histórico de Materiais</h2>
        </div>

        {!isAuthenticated ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center space-y-4">
            <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3 className="font-display font-bold text-foreground text-lg">Faça login para acessar seu histórico</h3>
            <p className="text-sm text-muted-foreground">O histórico de materiais gerados é salvo na sua conta para acesso rápido.</p>
          </div>
        ) : historyQuery.isLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !historyQuery.data || historyQuery.data.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-10 text-center space-y-4">
            <div className="w-14 h-14 bg-muted rounded-xl flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5Z"/></svg>
            </div>
            <h3 className="font-display font-bold text-foreground text-lg">Nenhum material gerado ainda</h3>
            <p className="text-sm text-muted-foreground">Escolha uma universidade e disciplina para gerar seu primeiro material com IA.</p>
            <button onClick={() => setViewMode('selection')} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all">
              Explorar Universidades
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyQuery.data.map((mat: any) => (
              <button key={mat.id} onClick={() => {
                // Navigate to the material's university and subject
                setSelectedUnivId(mat.universityId);
                setActiveYear(mat.year);
                loadSubjectDetails(mat.subject);
              }}
                className="group bg-card border border-border rounded-xl p-5 text-left hover:border-primary/50 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5Z"/></svg>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-muted rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    <span className="text-[10px] font-semibold text-muted-foreground">{mat.accessCount}x</span>
                  </div>
                </div>
                <h4 className="font-display font-bold text-foreground text-sm leading-tight mb-1 group-hover:text-primary transition-colors">{mat.subject}</h4>
                <p className="text-[11px] text-muted-foreground font-medium">{mat.universityName} — {mat.year}º Ano</p>
                <p className="text-[10px] text-muted-foreground mt-2">
                  {new Date(mat.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ============ SELECTION VIEW ============
  if (viewMode === 'selection') {
    return (
      <div className="space-y-8 animate-fade-in pb-20">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden h-44">
          <img src={STUDY_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c1829]/95 via-[#0f2035]/85 to-transparent" />
          <div className="relative z-10 h-full flex flex-col justify-center p-8">
            <p className="text-teal-300/80 text-xs font-semibold uppercase tracking-wider mb-1">Hub Acadêmico</p>
            <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Escolha sua Universidade</h1>
            <p className="text-white/50 text-sm font-medium mt-1">{UNIVERSITIES.length} instituições com currículos detalhados</p>
          </div>
        </div>

        {/* History button */}
        {isAuthenticated && (
          <button onClick={() => setViewMode('history')}
            className="w-full bg-card border border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/50 hover:shadow-md transition-all group">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            </div>
            <div className="flex-1 text-left">
              <h3 className="text-sm font-display font-bold text-foreground group-hover:text-primary transition-colors">Histórico de Materiais</h3>
              <p className="text-xs text-muted-foreground">Acesse materiais gerados anteriormente sem re-gerar</p>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-muted-foreground group-hover:text-primary transition-colors"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </button>
        )}

        {/* University Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {UNIVERSITIES.map(univ => (
            <button key={univ.id} onClick={() => handleStartGuide(univ.id)}
              className="group bg-card border border-border rounded-xl p-6 text-left hover:border-primary/50 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  {univ.name.split(' ').pop()?.substring(0, 3).toUpperCase() || univ.id.toUpperCase().substring(0, 3)}
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  univ.curriculumType === 'PBL' ? 'bg-violet-500/10 text-violet-600' :
                  univ.curriculumType === 'Misto' ? 'bg-amber-500/10 text-amber-600' :
                  'bg-blue-500/10 text-blue-600'
                }`}>{univ.curriculumType}</span>
              </div>
              <h3 className="font-display font-bold text-foreground text-base leading-tight mb-1 group-hover:text-primary transition-colors">{univ.name}</h3>
              <p className="text-xs text-muted-foreground font-medium">{univ.state}</p>
              <div className="flex items-center gap-1.5 text-primary text-xs font-semibold mt-4 opacity-0 group-hover:opacity-100 transition-all">
                Ver currículo completo
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ============ SUBJECT DETAIL VIEW ============
  if (viewMode === 'subject' && activeSubject) {
    return (
      <div className="space-y-6 animate-fade-in pb-20">
        {/* Header */}
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={() => setViewMode('guide')} className="flex items-center gap-2 bg-card border border-border px-4 py-2.5 rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            Voltar
          </button>
          {subjectData && (
            <button onClick={handleExportPdf} disabled={isExporting}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50">
              {isExporting ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
              )}
              Exportar PDF
            </button>
          )}
          <div className="ml-auto flex items-center gap-2">
            {isFromCache && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Cache</span>
              </div>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-soft" />
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">IA Validada</span>
            </div>
          </div>
        </div>

        {/* Personalization badge */}
        {subjectData && (
          <div className="bg-gradient-to-r from-primary/5 to-violet-500/5 border border-primary/20 rounded-lg px-4 py-2.5 flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-primary shrink-0"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="text-xs text-foreground/70 font-medium">{contentDepthLabel}</span>
          </div>
        )}

        {isLoading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center gap-6">
            <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="text-center space-y-2">
              <p className="text-sm font-semibold text-primary animate-pulse-soft">Gerando material de excelência...</p>
              <p className="text-xs text-muted-foreground">A IA está analisando o currículo de {selectedUniv?.name}</p>
              <p className="text-[10px] text-muted-foreground/60">{contentDepthLabel}</p>
            </div>
          </div>
        ) : errorType !== 'none' ? (
          <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-10 text-center space-y-4">
            <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-destructive"><path d="m21.73 18-8-14a2 2 0 00-3.48 0l-8 14A2 2 0 004 21h16a2 2 0 001.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h3 className="font-display font-bold text-foreground text-lg">{errorType === 'quota' ? 'Limite de Cota Atingido' : 'Erro ao Gerar Conteúdo'}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {errorType === 'quota' ? 'A API de IA atingiu o limite. Tente novamente em alguns minutos.' : 'Ocorreu um erro inesperado. Verifique sua conexão e tente novamente.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => activeSubject && loadSubjectDetails(activeSubject)} className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all">
                Tentar Novamente
              </button>
              <button onClick={() => setViewMode('guide')} className="bg-card border border-border px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted transition-colors">Voltar ao Currículo</button>
            </div>
          </div>
        ) : subjectData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Summary */}
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5Z"/></svg>
                  </div>
                  <h3 className="font-display font-bold text-foreground">Resumo Profundo</h3>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed border-l-3 border-primary pl-4">{subjectData.summary}</p>
              </div>

              {/* Key Points */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                  Pontos-Chave para Residência
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {subjectData.keyPoints?.map((p: string, i: number) => (
                    <div key={i} className="flex gap-3 p-3 bg-muted/50 rounded-lg border border-border/50">
                      <span className="text-primary font-display font-bold text-sm shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-xs text-foreground/80 leading-relaxed font-medium">{p}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flashcards */}
              {subjectData.flashcards?.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-display font-bold text-foreground flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"/><path d="M12 12h.01"/></svg>
                    Active Recall — Flashcards
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {subjectData.flashcards.map((fc: any, i: number) => (
                      <div key={i} onClick={() => setActiveFlashcard(activeFlashcard === i ? null : i)}
                        className="cursor-pointer group">
                        <div className={`relative h-48 rounded-xl border-2 transition-all duration-500 overflow-hidden ${activeFlashcard === i ? 'bg-primary border-primary' : 'bg-card border-border hover:border-primary/50'}`}>
                          <div className={`absolute inset-0 flex flex-col items-center justify-center p-5 text-center transition-opacity duration-300 ${activeFlashcard === i ? 'opacity-0' : 'opacity-100'}`}>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-3">Pergunta</span>
                            <p className="text-sm font-semibold text-foreground leading-snug">{fc.front}</p>
                            <span className="text-[9px] text-muted-foreground mt-3 font-medium">Toque para revelar</span>
                          </div>
                          <div className={`absolute inset-0 flex flex-col items-center justify-center p-5 text-center transition-opacity duration-300 ${activeFlashcard === i ? 'opacity-100' : 'opacity-0'}`}>
                            <span className="text-[10px] font-bold text-primary-foreground/70 uppercase tracking-wider mb-3">Resposta</span>
                            <p className="text-sm font-semibold text-primary-foreground leading-snug">{fc.back}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quiz */}
              {subjectData.quiz?.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
                    Quiz — Estilo Residência
                  </h3>
                  <div className="space-y-6">
                    {subjectData.quiz.map((q: any, qi: number) => (
                      <QuizItem key={qi} question={q} index={qi} />
                    ))}
                  </div>
                </div>
              )}

              {/* References */}
              {subjectData.references?.length > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                  <h3 className="font-display font-bold text-foreground mb-4">Referências Bibliográficas</h3>
                  <div className="space-y-3">
                    {subjectData.references.map((ref: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{ref.title}</p>
                          <p className="text-xs text-muted-foreground font-medium">{ref.author}</p>
                          {ref.verifiedBy && (
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" className="text-emerald-500"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                              <span className="text-[10px] font-bold text-emerald-600">{ref.verifiedBy}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar — Research + Innovations */}
            <div className="space-y-6">
              {/* Visual Prompt */}
              {subjectData.visualPrompt && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </div>
                    <h4 className="text-sm font-display font-bold text-foreground">Atlas Visual</h4>
                  </div>
                  <p className="text-xs text-foreground/70 leading-relaxed">{subjectData.visualPrompt}</p>
                </div>
              )}

              {/* Innovations */}
              {subjectData.innovations?.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <div>
                      <h4 className="text-sm font-display font-bold text-foreground">Inovações Recentes</h4>
                      <p className="text-[10px] text-amber-500 font-semibold">Avanços 2025/2026</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {subjectData.innovations.map((inn: string, i: number) => (
                      <div key={i} className="p-3 bg-amber-500/5 rounded-lg border-l-2 border-amber-500 text-xs text-foreground/80 leading-relaxed font-medium">
                        {inn}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Research */}
              <div className="bg-card border border-border rounded-xl p-5 sticky top-20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-display font-bold text-foreground">Pesquisa Global</h4>
                    <p className="text-[10px] text-rose-500 font-semibold">Artigos Recentes</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {researchData?.split('\n').filter(Boolean).map((line, i) => (
                    <div key={i} className={`p-3 bg-muted/50 rounded-lg text-xs text-foreground/80 leading-relaxed font-medium ${line.startsWith('-') || line.startsWith('*') ? 'border-l-2 border-rose-500' : ''}`}>
                      {line}
                    </div>
                  )) || <p className="text-xs text-muted-foreground">Analisando literatura global...</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============ GUIDE VIEW (Year/Subjects) ============
  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* University Header */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <button onClick={() => setViewMode('selection')} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-display font-extrabold text-foreground tracking-tight">{selectedUniv?.name}</h2>
            <p className="text-xs text-primary font-semibold mt-0.5">Currículo {selectedUniv?.curriculumType} — {selectedUniv?.state}</p>
          </div>
        </div>

        {/* Year Tabs */}
        <div className="flex flex-wrap gap-2 mt-5 p-1.5 bg-muted/50 rounded-lg border border-border/50">
          {[1,2,3,4,5,6].map(y => (
            <button key={y} onClick={() => setActiveYear(y)}
              className={`px-5 py-2 rounded-md text-xs font-semibold transition-all ${
                activeYear === y ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-card'
              }`}>
              {y}º Ano
            </button>
          ))}
        </div>

        {/* Personalization indicator */}
        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {contentDepthLabel}
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
        {selectedUniv?.curriculumByYear[activeYear]?.subjects.map((s, idx) => (
          <button key={s} onClick={() => loadSubjectDetails(s)}
            className="group bg-card border border-border rounded-xl p-6 text-left hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground/60 font-display font-bold text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors" />
            </div>
            <h4 className="font-display font-bold text-foreground text-base leading-tight mb-3 group-hover:text-primary transition-colors">{s}</h4>
            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all">
              Gerar Material com IA
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============ Quiz Item Component ============
const QuizItem: React.FC<{ question: any; index: number }> = ({ question, index }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelect = (optIdx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(optIdx);
    setShowExplanation(true);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-foreground">
        <span className="text-primary mr-2">{index + 1}.</span>
        {question.question}
      </p>
      <div className="space-y-2">
        {question.options?.map((opt: string, oi: number) => {
          const isCorrect = oi === question.correctIndex;
          const isSelected = oi === selectedOption;
          let optClass = 'bg-muted/50 border-border/50 hover:border-primary/30';
          if (selectedOption !== null) {
            if (isCorrect) optClass = 'bg-emerald-500/10 border-emerald-500/50 text-emerald-700';
            else if (isSelected) optClass = 'bg-destructive/10 border-destructive/50 text-destructive';
          }
          return (
            <button key={oi} onClick={() => handleSelect(oi)} disabled={selectedOption !== null}
              className={`w-full text-left p-3 rounded-lg border text-xs font-medium transition-all ${optClass}`}>
              <span className="font-bold mr-2">{String.fromCharCode(65 + oi)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      {showExplanation && question.explanation && (
        <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-xs text-foreground/80 leading-relaxed"><span className="font-bold text-primary">Explicação:</span> {question.explanation}</p>
          {question.source && <p className="text-[10px] text-muted-foreground mt-1">Fonte: {question.source}</p>}
        </div>
      )}
    </div>
  );
};

export default AcademicGuide;
