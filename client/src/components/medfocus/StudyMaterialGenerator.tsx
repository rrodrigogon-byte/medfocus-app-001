
import React, { useState } from 'react';
import { generateDeepContent } from '../../services/gemini';

interface StudyMaterial {
  type: 'summary' | 'flashcards' | 'quiz' | 'checklist';
  subject: string;
  university: string;
  year: number;
  content: string;
  generatedAt: string;
}

interface StudyMaterialGeneratorProps {
  university: string;
  year: number;
  subjects: string[];
}

const StudyMaterialGenerator: React.FC<StudyMaterialGeneratorProps> = ({ university, year, subjects }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>(subjects[0] || '');
  const [materialType, setMaterialType] = useState<'summary' | 'flashcards' | 'quiz' | 'checklist'>('summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedMaterial, setGeneratedMaterial] = useState<StudyMaterial | null>(null);
  const [savedMaterials, setSavedMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem(`medfocus_materials_${university}_${year}`);
    return saved ? JSON.parse(saved) : [];
  });

  const handleGenerateMaterial = async () => {
    if (!selectedSubject) return;
    
    setIsGenerating(true);
    try {
      const prompt = `Gere um ${materialType === 'summary' ? 'resumo profundo' : 
                                materialType === 'flashcards' ? 'conjunto de flashcards' :
                                materialType === 'quiz' ? 'quiz com 10 questões' :
                                'checklist de estudo'} sobre "${selectedSubject}" para estudantes de medicina do ${year}º ano de ${university}. 
                                ${materialType === 'flashcards' ? 'Formato: Pergunta | Resposta' : ''}
                                ${materialType === 'quiz' ? 'Inclua gabarito ao final' : ''}
                                ${materialType === 'checklist' ? 'Organize por tópicos principais com subtópicos' : ''}`;
      
      const content = await generateDeepContent(selectedSubject, university, year);
      
      const newMaterial: StudyMaterial = {
        type: materialType,
        subject: selectedSubject,
        university,
        year,
        content,
        generatedAt: new Date().toLocaleString('pt-BR')
      };
      
      setGeneratedMaterial(newMaterial);
      
      // Salvar no histórico
      const updated = [...savedMaterials, newMaterial];
      setSavedMaterials(updated);
      localStorage.setItem(`medfocus_materials_${university}_${year}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Erro ao gerar material:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadMaterial = () => {
    if (!generatedMaterial) return;
    
    const element = document.createElement('a');
    const file = new Blob([generatedMaterial.content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${generatedMaterial.subject}_${generatedMaterial.type}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-8">
          Gerador de Materiais de Estudo
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Disciplina
            </label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] font-bold outline-none focus:border-indigo-600 transition-all"
            >
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
              Tipo de Material
            </label>
            <select 
              value={materialType}
              onChange={(e) => setMaterialType(e.target.value as any)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[16px] font-bold outline-none focus:border-indigo-600 transition-all"
            >
              <option value="summary">Resumo Profundo</option>
              <option value="flashcards">Flashcards</option>
              <option value="quiz">Quiz</option>
              <option value="checklist">Checklist Semanal</option>
            </select>
          </div>

          <div className="flex items-end">
            <button 
              onClick={handleGenerateMaterial}
              disabled={isGenerating}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-[16px] font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg"
            >
              {isGenerating ? 'Gerando...' : 'Gerar Material'}
            </button>
          </div>
        </div>

        {generatedMaterial && (
          <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-[32px] space-y-6 border border-slate-100 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-black uppercase tracking-tighter text-slate-900 dark:text-white">
                  {generatedMaterial.subject}
                </h4>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  {generatedMaterial.type.toUpperCase()} • {generatedMaterial.generatedAt}
                </p>
              </div>
              <button 
                onClick={downloadMaterial}
                className="bg-indigo-600 text-white px-6 py-3 rounded-[16px] font-black uppercase text-[10px] tracking-widest hover:bg-indigo-700 transition-all"
              >
                ⬇️ Baixar
              </button>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[24px] max-h-96 overflow-y-auto">
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap text-sm">
                {generatedMaterial.content}
              </p>
            </div>
          </div>
        )}
      </div>

      {savedMaterials.length > 0 && (
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[48px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <h4 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-6">
            Histórico de Materiais
          </h4>
          <div className="space-y-3">
            {savedMaterials.slice(-5).reverse().map((material, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-[16px] border border-slate-100 dark:border-slate-700">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{material.subject}</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {material.type} • {material.generatedAt}
                  </p>
                </div>
                <button 
                  onClick={() => setGeneratedMaterial(material)}
                  className="text-indigo-600 hover:text-indigo-700 font-black uppercase text-[10px]"
                >
                  Ver
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyMaterialGenerator;
