/**
 * MedFocus Study Material Generator — Premium Design
 * AI-powered study material generation based on curriculum
 */
import React, { useState } from 'react';
import { trpc } from '../../lib/trpc';

interface StudyMaterial {
  type: string; subject: string; university: string; year: number; content: any; generatedAt: string;
}

interface Props { university: string; year: number; subjects: string[]; }

const materialTypes = [
  { id: 'summary', label: 'Resumo Profundo', icon: 'M4 19.5v-15A2.5 2.5 0 016.5 2H20v20H6.5a2.5 2.5 0 01-2.5-2.5Z', desc: 'Resumo completo com pontos-chave' },
  { id: 'flashcards', label: 'Flashcards', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', desc: 'Active Recall interativo' },
  { id: 'quiz', label: 'Quiz', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', desc: '10 questões com gabarito' },
  { id: 'checklist', label: 'Checklist', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', desc: 'Tópicos organizados por prioridade' },
];

const StudyMaterialGenerator: React.FC<Props> = ({ university, year, subjects }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0] || '');
  const [materialType, setMaterialType] = useState('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMaterial, setGeneratedMaterial] = useState<StudyMaterial | null>(null);
  const [savedMaterials, setSavedMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem(`medfocus_materials_${university}_${year}`);
    return saved ? JSON.parse(saved) : [];
  });

  const generateMutation = trpc.ai.generateContent.useMutation();

  const handleGenerate = async () => {
    if (!selectedSubject) return;
    setIsGenerating(true);
    try {
      const content = await generateMutation.mutateAsync({ subject: selectedSubject, universityName: university, year });
      const mat: StudyMaterial = { type: materialType, subject: selectedSubject, university, year, content, generatedAt: new Date().toISOString() };
      setGeneratedMaterial(mat);
    } catch { setGeneratedMaterial(null); }
    finally { setIsGenerating(false); }
  };

  const handleSave = () => {
    if (!generatedMaterial) return;
    const updated = [generatedMaterial, ...savedMaterials].slice(0, 20);
    setSavedMaterials(updated);
    localStorage.setItem(`medfocus_materials_${university}_${year}`, JSON.stringify(updated));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Config Card */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-display font-bold text-foreground text-lg mb-1">Gerador de Materiais</h2>
        <p className="text-xs text-muted-foreground font-medium mb-5">Selecione a disciplina e o tipo de material para gerar com IA</p>

        {/* Subject Selection */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Disciplina</label>
          <div className="flex flex-wrap gap-2">
            {subjects.map(s => (
              <button key={s} onClick={() => setSelectedSubject(s)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all ${
                  selectedSubject === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Material Type */}
        <div className="mb-5">
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Tipo de Material</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {materialTypes.map(mt => (
              <button key={mt.id} onClick={() => setMaterialType(mt.id)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  materialType === mt.id ? 'bg-primary/10 border-primary/30 ring-1 ring-primary/20' : 'bg-card border-border hover:border-primary/30'
                }`}>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${materialType === mt.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d={mt.icon} /></svg>
                </div>
                <p className={`text-xs font-bold ${materialType === mt.id ? 'text-primary' : 'text-foreground'}`}>{mt.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{mt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleGenerate} disabled={isGenerating || !selectedSubject}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">
          {isGenerating ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
              Gerando com IA...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              Gerar Material
            </>
          )}
        </button>
      </div>

      {/* Generated Content */}
      {generatedMaterial && generatedMaterial.content && (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-slide-up">
          <div className="p-5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground text-sm">{generatedMaterial.subject}</h3>
                <p className="text-[10px] text-muted-foreground font-medium">Gerado por MedGenie AI</p>
              </div>
            </div>
            <button onClick={handleSave} className="flex items-center gap-2 bg-emerald-500/10 text-emerald-600 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
              Salvar
            </button>
          </div>
          <div className="p-5">
            {generatedMaterial.content.summary && (
              <div className="mb-4 p-4 bg-muted/30 rounded-lg border-l-3 border-primary">
                <p className="text-sm text-foreground/80 leading-relaxed">{generatedMaterial.content.summary}</p>
              </div>
            )}
            {generatedMaterial.content.keyPoints?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                {generatedMaterial.content.keyPoints.map((p: string, i: number) => (
                  <div key={i} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                    <span className="text-primary font-display font-bold text-sm shrink-0">{String(i+1).padStart(2,'0')}</span>
                    <p className="text-xs text-foreground/80 font-medium leading-relaxed">{p}</p>
                  </div>
                ))}
              </div>
            )}
            {generatedMaterial.content.flashcards?.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generatedMaterial.content.flashcards.map((fc: any, i: number) => (
                  <div key={i} className="p-4 bg-card border border-border rounded-lg">
                    <p className="text-xs font-bold text-primary mb-1">Q: {fc.front}</p>
                    <p className="text-xs text-foreground/70">A: {fc.back}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Saved Materials */}
      {savedMaterials.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="font-display font-bold text-foreground mb-4">Materiais Salvos ({savedMaterials.length})</h3>
          <div className="space-y-2">
            {savedMaterials.map((m, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setGeneratedMaterial(m)}>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary text-xs font-bold">{m.type.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{m.subject}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(m.generatedAt).toLocaleDateString('pt-BR')}</p>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded">{m.type}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialGenerator;
