/**
 * MedFocus Academic Library — Material Aggregation System
 * Comprehensive university materials from all Brazilian medical schools
 * Filters: University, Year, Semester, Subject, Type
 */
import React, { useState, useMemo, useEffect } from 'react';
import { AcademicMaterial, MaterialFilter, MaterialType, Semester } from '../../types';
import MaterialUpload from './MaterialUpload';
import MaterialViewer from './MaterialViewer';

// Mock data - In production, this would come from API/database
const MOCK_MATERIALS: AcademicMaterial[] = [
  {
    id: '1',
    title: 'Anatomia Cardiovascular - Apostila Completa',
    description: 'Material completo sobre anatomia do sistema cardiovascular com ilustrações detalhadas',
    type: 'apostila',
    universityId: 'usp',
    universityName: 'USP',
    course: 'Medicina',
    year: 1,
    semester: 1,
    academicYear: '2024',
    subjectId: 'anatomia',
    subjectName: 'Anatomia',
    module: 'Sistema Cardiovascular',
    professor: 'Dr. Carlos Silva',
    tags: ['coração', 'vasos', 'circulação'],
    language: 'pt-BR',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    downloads: 1250,
    views: 3400,
    rating: 4.8,
    verified: true,
  },
  {
    id: '2',
    title: 'Fisiologia Renal - Videoaulas Completas',
    description: 'Série de videoaulas sobre fisiologia renal e equilíbrio hidroeletrolítico',
    type: 'video',
    universityId: 'unicamp',
    universityName: 'UNICAMP',
    course: 'Medicina',
    year: 2,
    semester: 1,
    academicYear: '2024',
    subjectId: 'fisiologia',
    subjectName: 'Fisiologia',
    module: 'Sistema Renal',
    professor: 'Dra. Ana Paula',
    duration: 120,
    tags: ['rins', 'néfrons', 'filtração'],
    language: 'pt-BR',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
    downloads: 890,
    views: 2100,
    rating: 4.6,
    verified: true,
  },
  {
    id: '3',
    title: 'Farmacologia Cardiovascular - Resumo',
    description: 'Resumo dos principais fármacos cardiovasculares e mecanismos de ação',
    type: 'resumo',
    universityId: 'ufrj',
    universityName: 'UFRJ',
    course: 'Medicina',
    year: 3,
    semester: 2,
    academicYear: '2023',
    subjectId: 'farmacologia',
    subjectName: 'Farmacologia',
    module: 'Fármacos Cardiovasculares',
    tags: ['anti-hipertensivos', 'antiarrítmicos', 'diuréticos'],
    language: 'pt-BR',
    createdAt: '2023-08-20',
    updatedAt: '2024-01-05',
    downloads: 2100,
    views: 5600,
    rating: 4.9,
    verified: true,
  },
  {
    id: '4',
    title: 'Provas Anteriores - Anatomia 2023',
    description: 'Compilação das provas de anatomia dos últimos 3 anos com gabaritos',
    type: 'prova',
    universityId: 'usp',
    universityName: 'USP',
    course: 'Medicina',
    year: 1,
    semester: 2,
    academicYear: '2023',
    subjectId: 'anatomia',
    subjectName: 'Anatomia',
    tags: ['questões', 'gabarito', 'revisão'],
    language: 'pt-BR',
    createdAt: '2023-12-01',
    updatedAt: '2023-12-01',
    downloads: 1890,
    views: 4200,
    rating: 4.7,
    verified: true,
  },
  {
    id: '5',
    title: 'Pesquisa: Novos Biomarcadores Cardíacos',
    description: 'Artigo de pesquisa sobre biomarcadores emergentes em cardiologia',
    type: 'pesquisa',
    universityId: 'unifesp',
    universityName: 'UNIFESP',
    course: 'Medicina',
    year: 5,
    semester: 1,
    academicYear: '2024',
    subjectId: 'cardiologia',
    subjectName: 'Cardiologia',
    authors: ['Dr. Roberto Lima', 'Dra. Maria Santos'],
    tags: ['troponina', 'biomarcadores', 'infarto'],
    language: 'pt-BR',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01',
    downloads: 450,
    views: 1100,
    rating: 4.5,
    verified: true,
  },
];

const UNIVERSITIES = [
  { id: 'usp', name: 'USP', state: 'SP' },
  { id: 'unicamp', name: 'UNICAMP', state: 'SP' },
  { id: 'ufrj', name: 'UFRJ', state: 'RJ' },
  { id: 'unifesp', name: 'UNIFESP', state: 'SP' },
  { id: 'ufmg', name: 'UFMG', state: 'MG' },
  { id: 'ufrgs', name: 'UFRGS', state: 'RS' },
];

const MATERIAL_TYPES: { value: MaterialType; label: string; icon: string }[] = [
  { value: 'apostila', label: 'Apostilas', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
  { value: 'video', label: 'Vídeos', icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z' },
  { value: 'resumo', label: 'Resumos', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
  { value: 'prova', label: 'Provas', icon: 'M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z' },
  { value: 'pesquisa', label: 'Pesquisas', icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5' },
  { value: 'slides', label: 'Slides', icon: 'M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605' },
];

const SUBJECTS = [
  'Anatomia', 'Fisiologia', 'Farmacologia', 'Patologia', 'Cardiologia',
  'Neurologia', 'Pediatria', 'Ginecologia', 'Cirurgia', 'Clínica Médica'
];


// Material Card Component
interface MaterialCardProps {
  material: AcademicMaterial;
  viewMode: 'grid' | 'list';
  getTypeColor: (type: MaterialType) => string;
  onClick: (material: AcademicMaterial) => void;
}

const MaterialCard = ({ material, viewMode, getTypeColor, onClick }: MaterialCardProps) => {
  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onClick(material)}
        className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-all group cursor-pointer"
      >
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
            <span className="text-2xl">📚</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-1">
                {material.title}
              </h3>
              {material.verified && (
                <div className="w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{material.description}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${getTypeColor(material.type)}`}>
                {material.type}
              </span>
              <span className="text-[10px] text-muted-foreground">{material.universityName}</span>
              <span className="text-[10px] text-muted-foreground">•</span>
              <span className="text-[10px] text-muted-foreground">{material.year}º Ano - {material.semester}º Sem</span>
              <span className="text-[10px] text-muted-foreground">•</span>
              <span className="text-[10px] text-muted-foreground">{material.subjectName}</span>
              <span className="text-[10px] text-muted-foreground">•</span>
              <span className="text-[10px] text-muted-foreground">{material.downloads} downloads</span>
              {material.rating && (
                <>
                  <span className="text-[10px] text-muted-foreground">•</span>
                  <div className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-[10px] font-semibold text-foreground">{material.rating}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div 
      onClick={() => onClick(material)}
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer"
    >
      <div className="aspect-video bg-muted flex items-center justify-center">
        <span className="text-5xl">📚</span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {material.title}
          </h3>
          {material.verified && (
            <div className="w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-primary" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{material.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded text-[10px] font-semibold ${getTypeColor(material.type)}`}>
            {material.type}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">{material.universityName}</span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>{material.year}º Ano</span>
            <span>•</span>
            <span>{material.semester}º Sem</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{material.downloads}↓</span>
            {material.rating && (
              <div className="flex items-center gap-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold">{material.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const AcademicLibrary: React.FC = () => {
  const [materials, setMaterials] = useState<AcademicMaterial[]>(MOCK_MATERIALS);
  const [filter, setFilter] = useState<MaterialFilter>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('recent');
  
  // New states for upload and viewer
  const [showUpload, setShowUpload] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<AcademicMaterial | null>(null);
  const [userId] = useState('user123'); // In real app, would come from auth context

  // Filtered and sorted materials
  const filteredMaterials = useMemo(() => {
    let result = [...materials];

    // Apply filters
    if (filter.universityId) {
      result = result.filter(m => m.universityId === filter.universityId);
    }
    if (filter.year) {
      result = result.filter(m => m.year === filter.year);
    }
    if (filter.semester) {
      result = result.filter(m => m.semester === filter.semester);
    }
    if (filter.type) {
      result = result.filter(m => m.type === filter.type);
    }
    if (filter.verified !== undefined) {
      result = result.filter(m => m.verified === filter.verified);
    }

    // Search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(m =>
        m.title.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term) ||
        m.subjectName.toLowerCase().includes(term) ||
        m.tags.some(t => t.toLowerCase().includes(term))
      );
    }

    // Sort
    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    } else if (sortBy === 'popular') {
      result.sort((a, b) => b.downloads - a.downloads);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [materials, filter, searchTerm, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: materials.length,
      universities: new Set(materials.map(m => m.universityId)).size,
      subjects: new Set(materials.map(m => m.subjectId)).size,
      verified: materials.filter(m => m.verified).length,
    };
  }, [materials]);

  const getTypeColor = (type: MaterialType) => {
    const colors: Record<MaterialType, string> = {
      apostila: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
      video: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950',
      resumo: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950',
      prova: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950',
      pesquisa: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950',
      slides: 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-950',
      artigo: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950',
      livro: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950',
      exercicio: 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950',
    };
    return colors[type] || 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-950';
  };

  const handleUploadSuccess = (material: AcademicMaterial) => {
    setMaterials(prev => [material, ...prev]);
    setShowUpload(false);
  };

  const handleMaterialClick = (material: AcademicMaterial) => {
    setSelectedMaterial(material);
    // Increment views count in real implementation
  };

  return (
    <>
      {/* Material Viewer Modal */}
      {selectedMaterial && (
        <MaterialViewer
          material={selectedMaterial}
          userId={userId}
          onClose={() => setSelectedMaterial(null)}
        />
      )}

      {/* Material Upload Modal */}
      {showUpload && (
        <MaterialUpload
          onSuccess={handleUploadSuccess}
          onCancel={() => setShowUpload(false)}
        />
      )}

    <div className="space-y-6 animate-fade-in pb-20">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl p-8 border border-border">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
                </svg>
              </div>
              <span className="text-primary text-xs font-semibold uppercase tracking-wider">Biblioteca Acadêmica</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Hub de Materiais</h1>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Acervo completo de materiais acadêmicos de todas as universidades brasileiras.
              Apostilas, vídeos, resumos, provas e pesquisas organizadas por ano, semestre e disciplina.
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 4v16m8-8H4"/>
              </svg>
              Enviar Material
            </button>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 min-w-[120px]">
              <div className="text-2xl font-display font-bold text-foreground">{stats.total}</div>
              <div className="text-xs text-muted-foreground font-medium">Materiais</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 min-w-[120px]">
              <div className="text-2xl font-display font-bold text-foreground">{stats.universities}</div>
              <div className="text-xs text-muted-foreground font-medium">Universidades</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por título, disciplina, tags..."
            className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* University Filter */}
          <select
            value={filter.universityId || ''}
            onChange={(e) => setFilter({ ...filter, universityId: e.target.value || undefined })}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            <option value="">Todas Universidades</option>
            {UNIVERSITIES.map(uni => (
              <option key={uni.id} value={uni.id}>{uni.name} - {uni.state}</option>
            ))}
          </select>

          {/* Year Filter */}
          <select
            value={filter.year || ''}
            onChange={(e) => setFilter({ ...filter, year: e.target.value ? Number(e.target.value) : undefined })}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            <option value="">Todos os Anos</option>
            {[1, 2, 3, 4, 5, 6].map(y => (
              <option key={y} value={y}>{y}º Ano</option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            value={filter.semester || ''}
            onChange={(e) => setFilter({ ...filter, semester: e.target.value ? Number(e.target.value) as Semester : undefined })}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            <option value="">Ambos Semestres</option>
            <option value="1">1º Semestre</option>
            <option value="2">2º Semestre</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm font-medium text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            <option value="recent">Mais Recentes</option>
            <option value="popular">Mais Populares</option>
            <option value="rating">Melhor Avaliados</option>
          </select>
        </div>

        {/* Type Filter Pills */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter({ ...filter, type: undefined })}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              !filter.type
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Todos Tipos
          </button>
          {MATERIAL_TYPES.map(type => (
            <button
              key={type.value}
              onClick={() => setFilter({ ...filter, type: type.value })}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter.type === type.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d={type.icon} />
              </svg>
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material encontrado' : 'materiais encontrados'}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'grid'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/>
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-all ${
              viewMode === 'list'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Materials Grid/List */}
      {filteredMaterials.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">Nenhum material encontrado</p>
          <p className="text-xs text-muted-foreground/60 mt-1">Tente ajustar os filtros ou termo de busca</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
          {filteredMaterials.map(material => (
            <MaterialCard key={material.id} material={material} viewMode={viewMode} getTypeColor={getTypeColor} onClick={handleMaterialClick} />
          ))}
        </div>
      )}
    </div>
    </>
  );
};
export default AcademicLibrary;
