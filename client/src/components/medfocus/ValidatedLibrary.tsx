/**
 * MedFocus Validated Library — Tier-based Content System
 * Separates validated academic content from community contributions
 * 
 * Tier Structure:
 * 🥇 VALIDATED - Reviewed and approved by professors/institutions
 * 🥈 COMMUNITY - Quality user contributions pending review
 * 🥉 EXPERIMENTAL - New content under evaluation
 */
import React, { useState, useMemo } from 'react';
import { TieredMaterial, ContentTier, UserRole, MedicalYear } from '../../types';
import MaterialViewer from './MaterialViewer';

interface ValidatedLibraryProps {
  userRole: UserRole;
  currentYear?: MedicalYear;
}

const ValidatedLibrary: React.FC<ValidatedLibraryProps> = ({ userRole, currentYear = 1 }) => {
  const [selectedTier, setSelectedTier] = useState<ContentTier>('validated');
  const [selectedMaterial, setSelectedMaterial] = useState<TieredMaterial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState<MedicalYear | 'all'>('all');

  // Mock data - In production, this would come from API
  const mockMaterials: TieredMaterial[] = [
    {
      id: '1',
      title: 'Anatomia de Gray - 42ª Edição (Tradução Oficial)',
      description: 'Referência mundial em anatomia humana, validada pela Sociedade Brasileira de Anatomia',
      type: 'livro',
      universityId: 'usp',
      universityName: 'USP',
      course: 'Medicina',
      year: 1,
      semester: 1,
      subjectId: 'anatomia',
      subjectName: 'Anatomia',
      tags: ['anatomia', 'atlas', 'oficial', 'gray'],
      language: 'pt-BR',
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
      downloads: 8540,
      views: 25000,
      rating: 4.9,
      verified: true,
      tier: 'validated',
      validationStatus: {
        isValidated: true,
        validatedBy: ['prof_123', 'prof_456', 'prof_789'],
        validationDate: '2024-01-15',
        qualityScore: 98,
        hasConsensus: true,
      },
      references: [
        {
          id: 'ref_1',
          title: 'Gray\'s Anatomy: The Anatomical Basis of Clinical Practice',
          authors: ['Susan Standring'],
          source: 'Elsevier',
          year: 2020,
          isbn: '978-0-7020-7705-0',
          quality: 'gold',
          citationCount: 15420,
        },
      ],
    },
    {
      id: '2',
      title: 'Fisiologia Guyton & Hall - 14ª Edição',
      description: 'Livro-texto padrão de fisiologia médica, aprovado por docentes das principais universidades',
      type: 'livro',
      universityId: 'unicamp',
      universityName: 'UNICAMP',
      course: 'Medicina',
      year: 2,
      semester: 1,
      subjectId: 'fisiologia',
      subjectName: 'Fisiologia',
      tags: ['fisiologia', 'guyton', 'oficial'],
      language: 'pt-BR',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10',
      downloads: 7200,
      views: 19000,
      rating: 4.9,
      verified: true,
      tier: 'validated',
      validationStatus: {
        isValidated: true,
        validatedBy: ['prof_222', 'prof_333'],
        validationDate: '2024-01-20',
        qualityScore: 97,
        hasConsensus: true,
      },
      references: [
        {
          id: 'ref_2',
          title: 'Guyton and Hall Textbook of Medical Physiology',
          authors: ['John E. Hall'],
          source: 'Elsevier',
          year: 2020,
          isbn: '978-0-323-59712-8',
          quality: 'gold',
          citationCount: 12350,
        },
      ],
    },
    {
      id: '3',
      title: 'Resumo de Farmacologia - Sistema Cardiovascular',
      description: 'Resumo detalhado criado por estudantes de medicina da USP',
      type: 'resumo',
      universityId: 'usp',
      universityName: 'USP',
      course: 'Medicina',
      year: 3,
      semester: 2,
      subjectId: 'farmacologia',
      subjectName: 'Farmacologia',
      tags: ['farmacologia', 'cardiovascular', 'resumo'],
      language: 'pt-BR',
      createdAt: '2024-02-01',
      updatedAt: '2024-02-15',
      downloads: 450,
      views: 1200,
      rating: 4.3,
      verified: false,
      tier: 'community',
      validationStatus: {
        isValidated: false,
        validatedBy: [],
        qualityScore: 72,
        hasConsensus: false,
      },
      references: [
        {
          id: 'ref_3',
          title: 'Farmacologia Básica e Clínica - Katzung',
          authors: ['Bertram G. Katzung'],
          source: 'McGraw-Hill',
          year: 2021,
          isbn: '978-1-260-45231-0',
          quality: 'silver',
        },
      ],
    },
    {
      id: '4',
      title: 'Videoaulas de Neuroanatomia com IA',
      description: 'Conteúdo experimental usando visualização 3D gerada por IA',
      type: 'video',
      universityId: 'ufrj',
      universityName: 'UFRJ',
      course: 'Medicina',
      year: 1,
      semester: 2,
      subjectId: 'anatomia',
      subjectName: 'Anatomia',
      duration: 45,
      tags: ['neuroanatomia', 'IA', 'experimental', '3D'],
      language: 'pt-BR',
      createdAt: '2024-03-01',
      updatedAt: '2024-03-01',
      downloads: 89,
      views: 234,
      rating: 4.0,
      verified: false,
      tier: 'experimental',
      validationStatus: {
        isValidated: false,
        validatedBy: [],
        qualityScore: 65,
        hasConsensus: false,
      },
      references: [
        {
          id: 'ref_4',
          title: 'Neuroanatomia Funcional',
          authors: ['Angelo Machado', 'Lúcia Machado Haertel'],
          source: 'Atheneu',
          year: 2020,
          isbn: '978-8538807766',
          quality: 'bronze',
        },
      ],
    },
  ];

  // Tier configuration
  const tiers = [
    {
      id: 'validated' as ContentTier,
      name: 'Conteúdo Consagrado',
      icon: '🥇',
      description: 'Material validado por professores e instituições',
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'community' as ContentTier,
      name: 'Contribuições da Comunidade',
      icon: '🥈',
      description: 'Conteúdo de qualidade aguardando validação',
      color: 'text-slate-600 bg-slate-50 border-slate-200',
      badge: 'bg-slate-100 text-slate-800',
    },
    {
      id: 'experimental' as ContentTier,
      name: 'Conteúdo Experimental',
      icon: '🥉',
      description: 'Material novo em fase de avaliação',
      color: 'text-orange-600 bg-orange-50 border-orange-200',
      badge: 'bg-orange-100 text-orange-800',
    },
  ];

  // Filter materials by tier and search
  const filteredMaterials = useMemo(() => {
    return mockMaterials.filter(material => {
      const matchesTier = material.tier === selectedTier;
      const matchesSearch = searchTerm === '' || 
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesYear = selectedYear === 'all' || material.year === selectedYear;
      
      return matchesTier && matchesSearch && matchesYear;
    });
  }, [mockMaterials, selectedTier, searchTerm, selectedYear]);

  // Get statistics for each tier
  const tierStats = useMemo(() => {
    return tiers.map(tier => ({
      ...tier,
      count: mockMaterials.filter(m => m.tier === tier.id).length,
      avgScore: Math.round(
        mockMaterials
          .filter(m => m.tier === tier.id)
          .reduce((acc, m) => acc + m.validationStatus.qualityScore, 0) /
          mockMaterials.filter(m => m.tier === tier.id).length
      ) || 0,
    }));
  }, [mockMaterials, tiers]);

  const currentTier = tiers.find(t => t.id === selectedTier);

  return (
    <>
      {selectedMaterial && (
        <MaterialViewer
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
          userId="user_123"
        />
      )}

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <span className="text-3xl">📚</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  Biblioteca Acadêmica Validada
                </h1>
                <p className="text-muted-foreground text-lg">
                  Conteúdo revisado pelas maiores mentes da medicina brasileira
                </p>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {tierStats.map(tier => (
                <div
                  key={tier.id}
                  className={`p-6 rounded-xl border-2 ${tier.color} cursor-pointer transition-all hover:scale-[1.02]`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{tier.icon}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-bold ${tier.badge}`}>
                      {tier.count} materiais
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{tier.description}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold">Qualidade Média:</span>
                    <div className="flex-1 bg-background/50 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-current h-full rounded-full transition-all"
                        style={{ width: `${tier.avgScore}%` }}
                      />
                    </div>
                    <span className="font-bold">{tier.avgScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Buscar materiais..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Year Filter */}
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value === 'all' ? 'all' : parseInt(e.target.value) as MedicalYear)}
                className="px-4 py-2.5 bg-muted border border-border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">Todos os Anos</option>
                <option value="1">1º Ano</option>
                <option value="2">2º Ano</option>
                <option value="3">3º Ano</option>
                <option value="4">4º Ano</option>
                <option value="5">5º Ano</option>
                <option value="6">6º Ano</option>
              </select>

              {/* Professor Actions (if applicable) */}
              {(userRole === 'professor' || userRole === 'coordinator') && (
                <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                  Validar Conteúdo
                </button>
              )}
            </div>
          </div>

          {/* Active Tier Banner */}
          <div className={`${currentTier?.color} border-2 rounded-xl p-4 mb-6`}>
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentTier?.icon}</span>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{currentTier?.name}</h2>
                <p className="text-sm text-muted-foreground">{currentTier?.description}</p>
              </div>
              <span className={`px-4 py-2 rounded-lg text-lg font-bold ${currentTier?.badge}`}>
                {filteredMaterials.length} {filteredMaterials.length === 1 ? 'material' : 'materiais'}
              </span>
            </div>
          </div>

          {/* Materials Grid */}
          {filteredMaterials.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <span className="text-4xl">📭</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Nenhum material encontrado</h3>
              <p className="text-muted-foreground">
                Tente ajustar os filtros ou buscar por outro termo
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMaterials.map(material => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onClick={() => setSelectedMaterial(material)}
                  userRole={userRole}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Material Card Component
interface MaterialCardProps {
  material: TieredMaterial;
  onClick: () => void;
  userRole: UserRole;
}

const MaterialCard: React.FC<MaterialCardProps> = ({ material, onClick, userRole }) => {
  return (
    <div
      onClick={onClick}
      className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer"
    >
      {/* Validation Badge */}
      <div className="relative">
        <div className="aspect-video bg-muted flex items-center justify-center">
          <span className="text-5xl">
            {material.type === 'livro' ? '📘' :
             material.type === 'video' ? '🎥' :
             material.type === 'artigo' ? '📄' :
             material.type === 'resumo' ? '📝' :
             material.type === 'prova' ? '📋' :
             material.type === 'slides' ? '📊' : '📚'}
          </span>
        </div>
        
        {material.tier === 'validated' && (
          <div className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            VALIDADO
          </div>
        )}
        
        {material.tier === 'community' && (
          <div className="absolute top-3 right-3 bg-slate-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            COMUNIDADE
          </div>
        )}
        
        {material.tier === 'experimental' && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
            EXPERIMENTAL
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2 leading-snug">
            {material.title}
          </h3>
        </div>
        
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{material.description}</p>

        {/* References */}
        {material.references.length > 0 && (
          <div className="mb-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-foreground">Referência:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                material.references[0].quality === 'gold' ? 'bg-amber-100 text-amber-800' :
                material.references[0].quality === 'silver' ? 'bg-slate-100 text-slate-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {material.references[0].quality === 'gold' ? '🥇 OURO' :
                 material.references[0].quality === 'silver' ? '🥈 PRATA' : '🥉 BRONZE'}
              </span>
            </div>
          </div>
        )}

        {/* Validation Status */}
        {material.validationStatus.isValidated && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-xs">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="text-amber-800 font-semibold">
                Validado por {material.validationStatus.validatedBy.length} {material.validationStatus.validatedBy.length === 1 ? 'professor' : 'professores'}
              </span>
            </div>
          </div>
        )}

        {/* Meta Info */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`px-2 py-1 rounded text-[10px] font-semibold ${
            material.type === 'livro' ? 'bg-blue-100 text-blue-800' :
            material.type === 'video' ? 'bg-purple-100 text-purple-800' :
            material.type === 'artigo' ? 'bg-green-100 text-green-800' :
            'bg-slate-100 text-slate-800'
          }`}>
            {material.type}
          </span>
          <span className="text-[10px] text-muted-foreground font-medium">{material.universityName}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-[10px] text-muted-foreground border-t border-border pt-3">
          <div className="flex items-center gap-1">
            <span>{material.year}º Ano</span>
            <span>•</span>
            <span>{material.subjectName}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold">Score: {material.validationStatus.qualityScore}%</span>
            {material.rating && (
              <div className="flex items-center gap-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-bold">{material.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValidatedLibrary;
