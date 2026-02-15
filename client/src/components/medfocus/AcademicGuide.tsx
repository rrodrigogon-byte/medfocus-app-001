
import React, { useState, useEffect } from 'react';
import { User, University, SubjectContent, Reference } from '../../types';
import { syncToCloud } from '../../services/analytics';
import { generateDeepContent, fetchGlobalResearch } from '../../services/gemini';

const UNIVERSITIES: University[] = [
  { id: 'usp', name: 'USP - Faculdade de Medicina', state: 'SP', curriculumType: 'Tradicional', curriculumByYear: { 1: { subjects: ['Anatomia Descritiva', 'Morfologia I', 'Bioquímica', 'Biofísica', 'Histologia'], references: [{ title: 'Anatomia Orientada para a Clínica', author: 'Moore & Dalley', type: 'book', verifiedBy: 'FMUSP Board' }] }, 2: { subjects: ['Fisiologia Médica', 'Patologia I', 'Imunologia', 'Microbiologia'], references: [{ title: 'Tratado de Fisiologia Médica', author: 'Guyton & Hall', type: 'book', verifiedBy: 'FMUSP Board' }] }, 3: { subjects: ['Semiologia', 'Farmacologia I', 'Técnica Cirúrgica', 'Psicologia Médica'], references: [] }, 4: { subjects: ['Clínica Médica', 'Cirurgia', 'Pediatria', 'Ginecologia e Obstetrícia'], references: [] }, 5: { subjects: ['Internato I - Clínica e Cirurgia'], references: [] }, 6: { subjects: ['Internato II - Saúde Coletiva e Emergência'], references: [] } } },
  { id: 'univag', name: 'UNIVAG - Várzea Grande', state: 'MT', curriculumType: 'PBL', curriculumByYear: { 1: { subjects: ['Tutorial I - Célula', 'Habilidades I', 'Interação Ensino-Serviço-Comunidade I'], references: [] }, 2: { subjects: ['Tutorial III - Sistemas', 'Habilidades III', 'IESC III'], references: [] }, 3: { subjects: ['Tutorial V - Patologia', 'Habilidades V', 'IESC V'], references: [] }, 4: { subjects: ['Clínica Médica Integrada', 'Saúde da Família', 'Especialidades'], references: [] }, 5: { subjects: ['Internato em Pediatria/GO', 'Internato em Saúde Mental'], references: [] }, 6: { subjects: ['Internato em Clínica/Cirurgia', 'Internato em Urgência'], references: [] } } },
  { id: 'puc', name: 'PUC - Medicina', state: 'PR/SP/MG', curriculumType: 'Misto', curriculumByYear: { 1: { subjects: ['Ciências Morfofuncionais I', 'Saúde e Sociedade'], references: [] }, 2: { subjects: ['Ciências Morfofuncionais III', 'Mecanismos de Doença'], references: [] }, 3: { subjects: ['Propedêutica Médica', 'Farmacologia Clínica'], references: [] }, 4: { subjects: ['Clínica Médica', 'Pediatria', 'Cirurgia'], references: [] }, 5: { subjects: ['Internato'], references: [] }, 6: { subjects: ['Internato'], references: [] } } },
  { id: 'ufrj', name: 'UFRJ - Faculdade de Medicina', state: 'RJ', curriculumType: 'Tradicional', curriculumByYear: { 1: { subjects: ['Anatomia', 'Histologia', 'Embriologia'], references: [] }, 2: { subjects: ['Fisiologia', 'Bioquímica', 'Microbiologia'], references: [] }, 3: { subjects: ['Patologia', 'Semiologia', 'Farmacologia'], references: [] }, 4: { subjects: ['Clínica Médica', 'Cirurgia', 'Pediatria'], references: [] }, 5: { subjects: ['Internato'], references: [] }, 6: { subjects: ['Internato'], references: [] } } },
  { id: 'unifesp', name: 'UNIFESP - Escola Paulista de Medicina', state: 'SP', curriculumType: 'Tradicional', curriculumByYear: { 1: { subjects: ['Anatomia', 'Biologia Celular', 'Bioestatística'], references: [] }, 2: { subjects: ['Fisiologia', 'Patologia', 'Farmacologia'], references: [] }, 3: { subjects: ['Semiologia', 'Medicina Preventiva'], references: [] }, 4: { subjects: ['Clínica Médica', 'Cirurgia', 'GO'], references: [] }, 5: { subjects: ['Internato'], references: [] }, 6: { subjects: ['Internato'], references: [] } } },
  { id: 'ufmg', name: 'UFMG - Faculdade de Medicina', state: 'MG', curriculumType: 'Tradicional', curriculumByYear: { 1: { subjects: ['Anatomia Humana', 'Histologia e Embriologia', 'Bioquímica'], references: [] }, 2: { subjects: ['Fisiologia Humana', 'Patologia Geral', 'Microbiologia'], references: [] }, 3: { subjects: ['Farmacologia', 'Semiologia', 'Medicina Legal'], references: [] }, 4: { subjects: ['Clínica Médica', 'Cirurgia', 'Pediatria'], references: [] }, 5: { subjects: ['Internato'], references: [] }, 6: { subjects: ['Internato'], references: [] } } },
];

interface GuideProps {
  user: User;
  onUpdateUser: (data: Partial<User>) => void;
}

const AcademicGuide: React.FC<GuideProps> = ({ user, onUpdateUser }) => {
  const [selectedUnivId, setSelectedUnivId] = useState<string>(user.universityId || '');
  const [activeYear, setActiveYear] = useState<number>(user.currentYear || 1);
  const [viewMode, setViewMode] = useState<'selection' | 'guide' | 'subject'>('selection');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [subjectData, setSubjectData] = useState<any | null>(null);
  const [researchData, setResearchData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState<'none' | 'quota' | 'general'>('none');
  const [selectedAnswer, setSelectedAnswer] = useState<{qIndex: number, aIndex: number} | null>(null);
  const [activeFlashcard, setActiveFlashcard] = useState<number | null>(null);

  const selectedUniv = UNIVERSITIES.find(u => u.id === selectedUnivId);

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
    const cacheKey = `medfocus_cache_${selectedUnivId}_${activeYear}_${subject.replace(/\s+/g, '_')}`;
    const cachedData = localStorage.getItem(cacheKey);

    setIsLoading(true);
    setActiveSubject(subject);
    setViewMode('subject');
    setErrorType('none');
    setSubjectData(null);
    setActiveFlashcard(null);

    if (cachedData) {
      try {
        const parsed = JSON.parse(cachedData);
        setSubjectData(parsed.content);
        setResearchData(parsed.research);
        setIsLoading(false);
        return;
      } catch (e) {
        localStorage.removeItem(cacheKey);
      }
    }

    try {
      const uName = selectedUniv?.name || 'Universidade';
      const [content, research] = await Promise.all([
        generateDeepContent(subject, uName, activeYear),
        fetchGlobalResearch(subject)
      ]);
      
      setSubjectData(content);
      setResearchData(research);
      
      // Salvar no Cache
      localStorage.setItem(cacheKey, JSON.stringify({ content, research, timestamp: Date.now() }));
    } catch (e: any) {
      if (e.message === 'QUOTA_EXCEEDED') {
        setErrorType('quota');
      } else {
        setErrorType('general');
      }
      console.error("Erro no MedGenie:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadGuide = () => {
    if (!subjectData || !activeSubject) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<html><head><title>${activeSubject}</title><style>body{font-family:sans-serif;padding:40px;line-height:1.6}h1{color:#4f46e5}h2{border-bottom:2px solid #e2e8f0;padding-bottom:10px}</style></head><body><h1>${activeSubject}</h1><p>${subjectData.summary}</p><h2>Pontos Chave</h2><ul>${subjectData.keyPoints.map((p:any)=>`<li>${p}</li>`).join('')}</ul></body></html>`);
    printWindow.document.close();
    printWindow.print();
  };

  if (viewMode === 'selection') {
    return (
      <div className="space-y-12 animate-in fade-in duration-700 pb-24">
        <header className="text-center space-y-4">
          <h2 className="text-6xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
            Hub Acadêmico <span className="text-indigo-600">MedFocus</span>
          </h2>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Ecossistema Digital de Alta Performance</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
          {UNIVERSITIES.map(u => (
            <button key={u.id} onClick={() => handleStartGuide(u.id)} className="group relative bg-white dark:bg-slate-900 p-12 rounded-[56px] border-4 border-slate-100 dark:border-slate-800 hover:border-indigo-600 transition-all shadow-xl overflow-hidden text-left">
              <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{u.state}</span>
              <h3 className="text-3xl font-black uppercase mt-6 leading-tight tracking-tighter dark:text-white">{u.name}</h3>
              <p className="mt-8 text-slate-400 font-bold text-[10px] uppercase tracking-widest group-hover:text-indigo-600">Acessar Plano Diretor →</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (viewMode === 'subject' && activeSubject) {
    return (
      <div className="space-y-10 animate-in slide-in-from-bottom-12 duration-700 pb-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex gap-4">
            <button onClick={() => setViewMode('guide')} className="group flex items-center gap-3 bg-white dark:bg-slate-900 px-8 py-4 rounded-[32px] border border-slate-200 dark:border-slate-800 text-indigo-600 font-black uppercase text-[10px] hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="m15 18-6-6 6-6"/></svg> 
              Voltar ao Ano
            </button>
            {subjectData && (
              <button onClick={downloadGuide} className="group flex items-center gap-3 bg-indigo-600 px-8 py-4 rounded-[32px] text-white font-black uppercase text-[10px] hover:bg-indigo-700 transition-all shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                PDF do Guia
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Inteligência Validada</span>
          </div>
        </div>

        {isLoading ? (
          <div className="h-[60vh] flex flex-col items-center justify-center space-y-8">
            <div className="w-20 h-20 border-8 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-black uppercase tracking-[0.4em] text-indigo-600 animate-pulse">Gerando Material de Excelência...</p>
          </div>
        ) : errorType === 'quota' ? (
          <div className="bg-rose-50 dark:bg-rose-950/20 p-16 rounded-[64px] border-4 border-rose-100 dark:border-rose-900/40 text-center space-y-8">
            <div className="w-24 h-24 bg-rose-600 text-white rounded-[32px] flex items-center justify-center mx-auto shadow-2xl">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter text-rose-900 dark:text-rose-100">Limite de Cota Atingido</h3>
              <p className="mt-4 text-rose-600 dark:text-rose-400 font-bold max-w-lg mx-auto">Nossos servidores de IA precisam de um breve descanso. Este material será disponibilizado automaticamente assim que sua cota for renovada.</p>
            </div>
            <div className="flex justify-center gap-4">
               <button onClick={() => setViewMode('guide')} className="px-10 py-4 bg-rose-600 text-white rounded-full font-black uppercase text-[10px] tracking-widest shadow-xl">Voltar ao Currículo</button>
               <a href="https://pubmed.ncbi.nlm.nih.gov/" target="_blank" className="px-10 py-4 bg-white dark:bg-slate-900 border-2 border-rose-200 dark:border-rose-800 text-rose-600 rounded-full font-black uppercase text-[10px] tracking-widest">Pesquisar no PubMed</a>
            </div>
          </div>
        ) : subjectData && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-8 space-y-12">
              {/* Atlas Mental */}
              <section className="bg-slate-950 rounded-[72px] p-2 shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] group-hover:bg-indigo-500/20 transition-all"></div>
                <div className="relative aspect-video bg-slate-900 rounded-[68px] flex flex-col items-center justify-center p-12 text-center border border-white/5">
                   <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mb-8 border border-white/10 shadow-3xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1"><path d="M12 2v20"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12a15.3 15.3 0 0 0 10 4 15.3 15.3 0 0 0 10-4 15.3 15.3 0 0 0-10-4 15.3 15.3 0 0 0-10 4z"/></svg>
                   </div>
                   <h3 className="text-white font-black text-3xl uppercase tracking-tighter mb-4">Spatial Atlas: Visualização</h3>
                   <p className="text-indigo-400 text-[11px] font-black uppercase tracking-[0.3em] max-w-md leading-relaxed">
                      {subjectData.visualPrompt}
                   </p>
                </div>
              </section>

              {/* Sumário */}
              <section className="bg-white dark:bg-slate-900 p-16 rounded-[64px] border border-slate-100 dark:border-slate-800 shadow-sm">
                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] mb-10 flex items-center gap-4">
                   <span className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
                   </span>
                   Sumário de Excelência
                </h4>
                <p className="text-2xl font-bold leading-relaxed text-slate-800 dark:text-slate-100 border-l-8 border-indigo-600 pl-10 italic mb-12">
                   {subjectData.summary}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12 border-t border-slate-50 dark:border-slate-800">
                  {subjectData.keyPoints.map((p:string, i:number) => (
                    <div key={i} className="p-8 bg-slate-50 dark:bg-slate-800/40 rounded-[40px] border border-slate-100 dark:border-slate-800 flex gap-6 group hover:border-indigo-600 transition-all">
                       <span className="text-indigo-600 font-black text-2xl opacity-40 group-hover:opacity-100">0{i+1}</span>
                       <p className="text-[11px] font-black uppercase leading-relaxed text-slate-600 dark:text-slate-400">{p}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Flashcards (Active Recall) */}
              <section className="space-y-8">
                <h4 className="text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] px-4">Módulo de Active Recall</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {subjectData.flashcards?.map((fc:any, i:number) => (
                     <div 
                      key={i} 
                      onClick={() => setActiveFlashcard(activeFlashcard === i ? null : i)}
                      className={`h-64 rounded-[40px] cursor-pointer perspective-1000 transition-all duration-700 relative ${activeFlashcard === i ? 'rotate-y-180' : ''}`}
                     >
                       <div className="absolute inset-0 bg-white dark:bg-slate-900 border-2 border-indigo-100 dark:border-indigo-900/40 rounded-[40px] p-8 flex flex-col items-center justify-center text-center backface-hidden shadow-sm hover:shadow-xl transition-shadow">
                          <span className="text-[10px] font-black text-indigo-500 uppercase mb-4 tracking-widest">PERGUNTA</span>
                          <p className="text-sm font-bold leading-tight">{fc.front}</p>
                          <div className="mt-6 text-[8px] font-black text-slate-300 uppercase">Clique para Virar</div>
                       </div>
                       <div className="absolute inset-0 bg-indigo-600 text-white rounded-[40px] p-8 flex flex-col items-center justify-center text-center rotate-y-180 backface-hidden shadow-2xl">
                          <span className="text-[10px] font-black text-indigo-200 uppercase mb-4 tracking-widest">RESPOSTA</span>
                          <p className="text-sm font-bold leading-tight italic">{fc.back}</p>
                       </div>
                     </div>
                   ))}
                </div>
              </section>
              
              {/* Bibliografia */}
              <section className="bg-indigo-600 p-16 rounded-[64px] text-white shadow-2xl">
                 <h4 className="text-[11px] font-black uppercase text-indigo-200 tracking-[0.4em] mb-12">Fontes de Autoridade Médica</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {subjectData.references.map((ref:any, i:number) => (
                      <div key={i} className="p-10 bg-white/10 rounded-[48px] border border-white/10 backdrop-blur-md hover:bg-white/20 transition-all">
                         <p className="text-sm font-black uppercase mb-2">{ref.title}</p>
                         <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-6">{ref.author}</p>
                         <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-emerald-400"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span className="text-[9px] font-black uppercase tracking-widest text-emerald-300">{ref.verifiedBy}</span>
                         </div>
                      </div>
                    ))}
                 </div>
              </section>
            </div>

            <div className="lg:col-span-4 space-y-10">
               {/* Research Hub */}
               <section className="bg-white dark:bg-slate-900 p-12 rounded-[56px] border border-slate-200 dark:border-slate-800 shadow-sm sticky top-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-rose-600 rounded-[20px] flex items-center justify-center text-white shadow-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <div>
                      <h4 className="text-[11px] font-black uppercase tracking-[0.3em]">Global Research</h4>
                      <p className="text-[10px] font-bold text-rose-500 uppercase">Science Node 2025</p>
                    </div>
                  </div>
                  <div className="space-y-8">
                     <div className="text-[12px] font-bold text-slate-700 dark:text-slate-300 leading-relaxed space-y-6">
                        {researchData?.split('\n').map((line, i) => (
                          <div key={i} className={`p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[24px] border border-slate-100 dark:border-slate-800 transition-all ${line.startsWith('-') ? 'border-l-4 border-rose-500' : ''}`}>
                             {line}
                          </div>
                        )) || "Analisando literatura global..."}
                     </div>
                  </div>
               </section>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col xl:flex-row items-center justify-between gap-10 bg-white dark:bg-slate-900 p-12 rounded-[56px] border border-slate-200 dark:border-slate-800 shadow-sm transition-all">
        <div className="flex items-center gap-10">
          <button onClick={() => setViewMode('selection')} className="w-20 h-20 rounded-[32px] bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all shadow-sm group">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="group-hover:scale-110 transition-transform"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div>
            <h2 className="text-5xl font-black uppercase tracking-tighter text-slate-900 dark:text-white leading-none">{selectedUniv?.name}</h2>
            <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.5em] mt-4">Matriz Acadêmica {selectedUniv?.curriculumType}</p>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-[40px] border border-slate-200 dark:border-slate-700">
          {[1,2,3,4,5,6].map(y => (
            <button key={y} onClick={() => setActiveYear(y)} className={`px-10 py-4 rounded-[32px] text-[10px] font-black uppercase transition-all ${activeYear === y ? 'bg-indigo-600 text-white shadow-2xl scale-105' : 'text-slate-400 hover:text-indigo-600'}`}>{y}º Ano</button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {selectedUniv?.curriculumByYear[activeYear]?.subjects.map((s, idx) => (
          <button 
            key={s} 
            onClick={() => loadSubjectDetails(s)} 
            className="group relative bg-white dark:bg-slate-900 p-16 rounded-[64px] border-4 border-slate-50 dark:border-slate-800 text-left hover:border-indigo-600 hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full -mr-24 -mt-24 group-hover:bg-indigo-600/10 transition-colors"></div>
            <div className="flex justify-between items-start mb-12">
               <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-[24px] flex items-center justify-center text-indigo-600 font-black text-xl border-2 border-slate-100 dark:border-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  {idx < 9 ? `0${idx+1}` : idx+1}
               </div>
               <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <h4 className="text-3xl font-black uppercase tracking-tighter leading-tight text-slate-800 dark:text-white mb-8 group-hover:translate-x-2 transition-transform">{s}</h4>
            <div className="flex items-center gap-4 text-indigo-600 font-black text-[11px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
               Exploração MedGenie
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default AcademicGuide;
