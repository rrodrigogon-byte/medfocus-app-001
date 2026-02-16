/**
 * MedFocus Academic Library — AI-Curated Academic References
 * Busca inteligente por IA de materiais validados de professores, mestres, doutores e pesquisadores renomados
 * Integração com tRPC backend para busca, curadoria e deep dive
 */
import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Streamdown } from 'streamdown';
import { toast } from 'sonner';

// Types for library materials from DB
interface LibraryMaterial {
  id: number;
  title: string;
  description: string;
  type: string;
  subject: string;
  specialty: string | null;
  year: number | null;
  authorName: string;
  authorTitle: string | null;
  authorInstitution: string | null;
  authorCountry: string | null;
  source: string | null;
  doi: string | null;
  externalUrl: string | null;
  publishedYear: number | null;
  impactFactor: string | null;
  aiCurated: boolean;
  relevanceScore: number | null;
  views: number;
  saves: number;
  language: string | null;
  tags: string | null;
}

type ViewMode = 'catalog' | 'search' | 'detail' | 'saved' | 'deepdive';

const SUBJECTS = [
  'Anatomia Humana', 'Histologia', 'Bioquímica', 'Biologia Celular',
  'Fisiologia', 'Microbiologia', 'Imunologia', 'Parasitologia',
  'Patologia', 'Farmacologia', 'Semiologia Médica',
  'Clínica Médica', 'Cirurgia Geral', 'Psiquiatria',
  'Pediatria', 'Ginecologia e Obstetrícia', 'Ortopedia', 'Dermatologia',
  'Medicina de Emergência', 'Saúde Coletiva', 'Cardiologia', 'Infectologia',
  'Endocrinologia', 'Neurologia', 'Oncologia', 'Nefrologia',
  'Pneumologia', 'Gastroenterologia', 'Hematologia', 'Radiologia',
];

const MATERIAL_TYPES = [
  { value: 'livro', label: 'Livros', emoji: '📖' },
  { value: 'artigo', label: 'Artigos', emoji: '📄' },
  { value: 'diretriz', label: 'Diretrizes', emoji: '📋' },
  { value: 'atlas', label: 'Atlas', emoji: '🗺️' },
  { value: 'videoaula', label: 'Videoaulas', emoji: '🎥' },
  { value: 'podcast', label: 'Podcasts', emoji: '🎙️' },
  { value: 'tese', label: 'Teses', emoji: '🎓' },
  { value: 'revisao_sistematica', label: 'Revisões', emoji: '🔬' },
  { value: 'caso_clinico', label: 'Casos Clínicos', emoji: '🏥' },
  { value: 'guideline', label: 'Guidelines', emoji: '📐' },
];

const SPECIALTIES = [
  'Clínica Geral', 'Cardiologia', 'Neurologia', 'Ortopedia', 'Pediatria',
  'Ginecologia', 'Cirurgia', 'Psiquiatria', 'Dermatologia', 'Oncologia',
  'Infectologia', 'Endocrinologia', 'Nefrologia', 'Pneumologia', 'Gastroenterologia',
];

function getTypeEmoji(type: string) {
  return MATERIAL_TYPES.find(t => t.value === type)?.emoji || '📚';
}

function getTypeLabel(type: string) {
  return MATERIAL_TYPES.find(t => t.value === type)?.label || type;
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    livro: 'text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950',
    artigo: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950',
    diretriz: 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950',
    atlas: 'text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950',
    videoaula: 'text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950',
    podcast: 'text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-950',
    tese: 'text-cyan-600 bg-cyan-50 dark:text-cyan-400 dark:bg-cyan-950',
    revisao_sistematica: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950',
    caso_clinico: 'text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950',
    guideline: 'text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-950',
  };
  return colors[type] || 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-950';
}

function parseTags(tags: string | null): string[] {
  if (!tags) return [];
  try { return JSON.parse(tags); } catch { return tags.split(',').map(t => t.trim()); }
}

// ─── Material Card ──────────────────────────────────────────────────────────
const MaterialCard: React.FC<{
  material: LibraryMaterial;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
  onClick: (material: LibraryMaterial) => void;
}> = ({ material, isSaved, onToggleSave, onClick }) => {
  const tags = parseTags(material.tags);
  return (
    <div
      onClick={() => onClick(material)}
      className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg transition-all group cursor-pointer relative"
    >
      {/* Save button */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleSave(material.id); }}
        className={`absolute top-4 right-4 p-1.5 rounded-lg transition-all ${
          isSaved ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
        }`}
        title={isSaved ? 'Remover dos salvos' : 'Salvar material'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>

      {/* Type badge + AI curated */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getTypeColor(material.type)}`}>
          {getTypeEmoji(material.type)} {getTypeLabel(material.type)}
        </span>
        {material.aiCurated && (
          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-primary/10 text-primary">
            IA VALIDADA
          </span>
        )}
        {material.impactFactor && (
          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            IF: {material.impactFactor}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2 pr-8">
        {material.title}
      </h3>

      {/* Author info */}
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-foreground truncate">
            {material.authorTitle ? `${material.authorTitle} ` : ''}{material.authorName}
          </p>
          <p className="text-[10px] text-muted-foreground truncate">
            {material.authorInstitution}{material.authorCountry ? ` · ${material.authorCountry}` : ''}
          </p>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{material.description}</p>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="text-[9px] text-muted-foreground">+{tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Footer: source, year, views */}
      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/50">
        <div className="flex items-center gap-2">
          {material.source && <span className="font-semibold">{material.source}</span>}
          {material.publishedYear && <span>{material.publishedYear}</span>}
          {material.language && <span className="uppercase">{material.language}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {material.views}
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {material.saves}
          </span>
          {material.relevanceScore && (
            <span className="font-bold text-primary">{material.relevanceScore}%</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Material Detail View ───────────────────────────────────────────────────
const MaterialDetail: React.FC<{
  material: LibraryMaterial;
  isSaved: boolean;
  onToggleSave: (id: number) => void;
  onBack: () => void;
  onDeepDive: () => void;
}> = ({ material, isSaved, onToggleSave, onBack, onDeepDive }) => {
  const tags = parseTags(material.tags);
  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        Voltar ao catálogo
      </button>

      <div className="bg-card border border-border rounded-2xl p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${getTypeColor(material.type)}`}>
              {getTypeEmoji(material.type)} {getTypeLabel(material.type)}
            </span>
            {material.aiCurated && (
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary">IA VALIDADA</span>
            )}
          </div>
          <button
            onClick={() => onToggleSave(material.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              isSaved ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground hover:bg-primary/10'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            {isSaved ? 'Salvo' : 'Salvar'}
          </button>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-display font-bold text-foreground mb-4">{material.title}</h1>

        {/* Author card */}
        <div className="bg-muted/50 rounded-xl p-5 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-foreground">
                {material.authorTitle ? `${material.authorTitle} ` : ''}{material.authorName}
              </p>
              <p className="text-sm text-muted-foreground">
                {material.authorInstitution}{material.authorCountry ? ` · ${material.authorCountry}` : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground/80 leading-relaxed mb-6">{material.description}</p>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {material.source && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Fonte</p>
              <p className="text-sm font-semibold text-foreground">{material.source}</p>
            </div>
          )}
          {material.publishedYear && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Publicação</p>
              <p className="text-sm font-semibold text-foreground">{material.publishedYear}</p>
            </div>
          )}
          {material.impactFactor && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Fator de Impacto</p>
              <p className="text-sm font-semibold text-amber-600">{material.impactFactor}</p>
            </div>
          )}
          {material.doi && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">DOI</p>
              <p className="text-xs font-mono text-foreground truncate">{material.doi}</p>
            </div>
          )}
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Disciplina</p>
            <p className="text-sm font-semibold text-foreground">{material.subject}</p>
          </div>
          {material.specialty && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Especialidade</p>
              <p className="text-sm font-semibold text-foreground">{material.specialty}</p>
            </div>
          )}
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Idioma</p>
            <p className="text-sm font-semibold text-foreground">{material.language === 'pt-BR' ? 'Português' : material.language === 'en' ? 'English' : material.language}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-3">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Relevância</p>
            <p className="text-sm font-bold text-primary">{material.relevanceScore || 80}%</p>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Deep Dive button */}
        <button
          onClick={onDeepDive}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
          </svg>
          Gerar Resumo Acadêmico Aprofundado com IA
        </button>
      </div>
    </div>
  );
};

// ─── Deep Dive View ─────────────────────────────────────────────────────────
const DeepDiveView: React.FC<{
  material: LibraryMaterial;
  onBack: () => void;
}> = ({ material, onBack }) => {
  const deepDive = trpc.library.aiDeepDive.useMutation();
  const [content, setContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    try {
      const result = await deepDive.mutateAsync({
        materialId: material.id,
        title: material.title,
        subject: material.subject,
        authorName: material.authorName,
      });
      setContent(typeof result.content === 'string' ? result.content : JSON.stringify(result.content));
    } catch {
      toast.error('Erro ao gerar resumo. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        Voltar ao material
      </button>

      <div className="bg-card border border-border rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-foreground">Resumo Acadêmico Aprofundado</h2>
            <p className="text-xs text-muted-foreground">{material.title} — {material.authorName}</p>
          </div>
        </div>

        {!content && !deepDive.isPending && (
          <div className="text-center py-12">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Pronto para gerar</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
              A IA vai gerar um resumo acadêmico detalhado com conceitos fundamentais, aplicações clínicas, pontos-chave e referências complementares.
            </p>
            <button
              onClick={handleGenerate}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all"
            >
              Gerar Resumo com IA
            </button>
          </div>
        )}

        {deepDive.isPending && (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Gerando resumo acadêmico...</h3>
            <p className="text-sm text-muted-foreground">Analisando material e compilando informações relevantes</p>
          </div>
        )}

        {content && (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Streamdown>{content}</Streamdown>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Main Library Component ─────────────────────────────────────────────────
const AcademicLibrary: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [view, setView] = useState<ViewMode>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedMaterial, setSelectedMaterial] = useState<LibraryMaterial | null>(null);
  const [aiSearchQuery, setAiSearchQuery] = useState('');

  // tRPC queries
  const popularQuery = trpc.library.popular.useQuery(undefined, { staleTime: 60000 });
  const searchQueryResult = trpc.library.search.useQuery(
    { query: searchQuery, subject: selectedSubject || undefined, year: selectedYear, type: selectedType || undefined },
    { enabled: view === 'catalog' || view === 'search', staleTime: 30000 }
  );
  const savedIdsQuery = trpc.library.savedIds.useQuery(undefined, { enabled: isAuthenticated, staleTime: 30000 });
  const savedMaterialsQuery = trpc.library.savedMaterials.useQuery(undefined, { enabled: view === 'saved' && isAuthenticated });

  // AI search mutation
  const aiSearch = trpc.library.aiSearch.useMutation();
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [aiSearchDone, setAiSearchDone] = useState(false);

  // Toggle save mutation
  const toggleSave = trpc.library.toggleSave.useMutation({
    onSuccess: () => {
      savedIdsQuery.refetch();
      savedMaterialsQuery.refetch();
    },
  });

  const savedIds = useMemo(() => new Set(savedIdsQuery.data || []), [savedIdsQuery.data]);

  const handleToggleSave = (materialId: number) => {
    if (!isAuthenticated) {
      toast.error('Faça login para salvar materiais');
      return;
    }
    toggleSave.mutate({ materialId });
  };

  const handleAiSearch = async () => {
    if (!aiSearchQuery.trim() || aiSearchQuery.length < 3) {
      toast.error('Digite pelo menos 3 caracteres para buscar');
      return;
    }
    setAiSearchDone(false);
    try {
      const result = await aiSearch.mutateAsync({
        query: aiSearchQuery,
        subject: selectedSubject || undefined,
        year: selectedYear,
        specialty: selectedSpecialty || undefined,
      });
      setAiResults(result.materials);
      setAiSearchDone(true);
      if (result.fromCache) {
        toast.info('Resultados encontrados no catálogo existente');
      } else {
        toast.success(`${result.materials.length} materiais curados por IA adicionados ao catálogo`);
      }
    } catch {
      toast.error('Erro na busca por IA. Tente novamente.');
    }
  };

  const handleMaterialClick = (material: LibraryMaterial) => {
    setSelectedMaterial(material);
    setView('detail');
  };

  // Determine which materials to show
  const displayMaterials = useMemo(() => {
    if (view === 'search' && aiSearchDone) return aiResults;
    if (view === 'saved') return savedMaterialsQuery.data || [];
    if (searchQuery || selectedSubject || selectedType || selectedYear) return searchQueryResult.data || [];
    return popularQuery.data || [];
  }, [view, aiSearchDone, aiResults, savedMaterialsQuery.data, searchQuery, selectedSubject, selectedType, selectedYear, searchQueryResult.data, popularQuery.data]);

  // Detail view
  if (view === 'detail' && selectedMaterial) {
    return (
      <div className="pb-20">
        <MaterialDetail
          material={selectedMaterial}
          isSaved={savedIds.has(selectedMaterial.id)}
          onToggleSave={handleToggleSave}
          onBack={() => { setView(aiSearchDone ? 'search' : 'catalog'); setSelectedMaterial(null); }}
          onDeepDive={() => setView('deepdive')}
        />
      </div>
    );
  }

  // Deep dive view
  if (view === 'deepdive' && selectedMaterial) {
    return (
      <div className="pb-20">
        <DeepDiveView
          material={selectedMaterial}
          onBack={() => setView('detail')}
        />
      </div>
    );
  }

  return (
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
              <span className="text-primary text-xs font-semibold uppercase tracking-wider">Biblioteca Acadêmica com IA</span>
            </div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">Referências Validadas</h1>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Materiais acadêmicos curados por IA de professores, mestres, doutores e pesquisadores renomados do Brasil e do mundo.
              Livros, artigos, diretrizes, atlas e mais — com fontes como PubMed, SciELO, NEJM, Lancet e BMJ.
            </p>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-xl p-4 min-w-[120px]">
              <div className="text-2xl font-display font-bold text-foreground">{popularQuery.data?.length || 0}</div>
              <div className="text-xs text-muted-foreground font-medium">No Catálogo</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4 min-w-[120px]">
              <div className="text-2xl font-display font-bold text-foreground">{savedIds.size}</div>
              <div className="text-xs text-muted-foreground font-medium">Salvos</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          onClick={() => { setView('catalog'); setAiSearchDone(false); }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            view === 'catalog' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          Catálogo
        </button>
        <button
          onClick={() => setView('search')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            view === 'search' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          Busca por IA
        </button>
        {isAuthenticated && (
          <button
            onClick={() => setView('saved')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              view === 'saved' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Salvos ({savedIds.size})
          </button>
        )}
      </div>

      {/* AI Search Section */}
      {view === 'search' && (
        <div className="bg-gradient-to-br from-primary/5 to-background border border-primary/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Busca Inteligente por IA</h3>
              <p className="text-xs text-muted-foreground">Encontre materiais de professores, mestres e doutores renomados</p>
            </div>
          </div>

          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={aiSearchQuery}
              onChange={(e) => setAiSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
              placeholder="Ex: Anatomia do sistema cardiovascular, Farmacologia de anti-hipertensivos..."
              className="flex-1 px-4 py-3 bg-card border border-border rounded-xl outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              onClick={handleAiSearch}
              disabled={aiSearch.isPending || aiSearchQuery.length < 3}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {aiSearch.isPending ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                  Buscando...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                  </svg>
                  Buscar com IA
                </>
              )}
            </button>
          </div>

          {/* Optional filters for AI search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="">Todas Disciplinas</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="">Todas Especialidades</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
              className="px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="">Todos os Anos</option>
              {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>{y}º Ano</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Catalog Filters */}
      {view === 'catalog' && (
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título, autor, disciplina..."
              className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-border rounded-xl outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="">Todas Disciplinas</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="">Todos os Tipos</option>
              {MATERIAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
            </select>
            <select
              value={selectedYear || ''}
              onChange={(e) => setSelectedYear(e.target.value ? Number(e.target.value) : undefined)}
              className="px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer"
            >
              <option value="">Todos os Anos</option>
              {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>{y}º Ano</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {view === 'search' && aiSearchDone
            ? `${aiResults.length} materiais encontrados por IA`
            : view === 'saved'
              ? `${(savedMaterialsQuery.data || []).length} materiais salvos`
              : `${displayMaterials.length} materiais no catálogo`}
        </p>
        {view === 'catalog' && !searchQuery && !selectedSubject && !selectedType && !selectedYear && (
          <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-lg">
            Populares
          </span>
        )}
      </div>

      {/* Loading state */}
      {(searchQueryResult.isLoading || popularQuery.isLoading || aiSearch.isPending) && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            {aiSearch.isPending ? 'IA buscando materiais acadêmicos...' : 'Carregando catálogo...'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {aiSearch.isPending ? 'Consultando bases de dados e curando referências de professores renomados' : 'Buscando materiais validados'}
          </p>
        </div>
      )}

      {/* Empty state */}
      {!searchQueryResult.isLoading && !popularQuery.isLoading && !aiSearch.isPending && displayMaterials.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"/>
            </svg>
          </div>
          <p className="text-sm font-semibold text-muted-foreground mb-2">
            {view === 'saved' ? 'Nenhum material salvo ainda' : view === 'search' ? 'Use a busca por IA para encontrar materiais' : 'Nenhum material encontrado'}
          </p>
          <p className="text-xs text-muted-foreground/60">
            {view === 'saved' ? 'Salve materiais do catálogo para acesso rápido' : view === 'search' ? 'Digite um tema e clique em "Buscar com IA"' : 'Tente ajustar os filtros ou use a busca por IA'}
          </p>
          {view !== 'search' && (
            <button
              onClick={() => setView('search')}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-all"
            >
              Buscar com IA
            </button>
          )}
        </div>
      )}

      {/* Materials Grid */}
      {displayMaterials.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {displayMaterials.map((material: any) => (
            <MaterialCard
              key={material.id}
              material={material}
              isSaved={savedIds.has(material.id)}
              onToggleSave={handleToggleSave}
              onClick={handleMaterialClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AcademicLibrary;
