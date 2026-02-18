/**
 * MedFocus Academic Library — AI-Curated Academic References
 * Busca inteligente por IA de materiais validados de professores, mestres, doutores e pesquisadores renomados
 * Integração com tRPC backend para busca, curadoria, deep dive, PubMed/SciELO, reviews, recomendações,
 * filtros avançados, exportação ABNT/Vancouver, notificações e templates inovadores
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
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

interface PubmedArticle {
  id?: number;
  pmid: string;
  title: string;
  authors: string[] | string;
  journal: string;
  pubDate: string;
  doi: string;
  abstractText: string;
  source: string;
  keywords?: string[] | string;
  language?: string;
  isOpenAccess?: boolean;
  pubType?: string[];
}

interface MaterialReview {
  id: number;
  materialId: number;
  userId: number;
  rating: number;
  comment: string | null;
  helpful: number;
  createdAt: string | Date;
  userName?: string;
  reported?: boolean;
  updatedAt?: string | Date;
}

interface Recommendation {
  title: string;
  description: string;
  type: string;
  subject: string;
  authorName: string;
  authorTitle: string;
  authorInstitution: string;
  source: string;
  reason: string;
  difficulty: string;
  relevanceScore: number;
}

interface RecommendationInsights {
  strengths: string[];
  areasToImprove: string[];
  studyTip: string;
}

interface StudyTemplate {
  id: number;
  userId: number | null;
  templateType: string;
  subject: string;
  title: string;
  content: string;
  specialty: string | null;
  year: number | null;
  difficulty: string | null;
  tags: string | null;
  views: number;
  saves: number;
  rating: number | null;
  isPublic: boolean;
  createdAt: string | Date;
}

interface MaterialNotification {
  id: number;
  userId: number;
  materialId: number;
  subject: string;
  title: string;
  isRead: boolean;
  createdAt: string | Date;
}

type ViewMode = 'catalog' | 'search' | 'detail' | 'saved' | 'deepdive' | 'pubmed' | 'recommendations' | 'templates' | 'template-detail' | 'template-generate';

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

const TEMPLATE_TYPES = [
  { value: 'anamnese', label: 'Anamnese', emoji: '📝', desc: 'Modelo completo de anamnese médica' },
  { value: 'exame_fisico', label: 'Exame Físico', emoji: '🩺', desc: 'Roteiro de exame físico por sistemas' },
  { value: 'diagnostico_diferencial', label: 'Diagnóstico Diferencial', emoji: '🔍', desc: 'Guia de raciocínio clínico' },
  { value: 'prescricao', label: 'Prescrição', emoji: '💊', desc: 'Modelo de prescrição com posologia' },
  { value: 'roteiro_revisao', label: 'Roteiro de Revisão', emoji: '📅', desc: 'Cronograma e tópicos-chave' },
  { value: 'mapa_mental', label: 'Mapa Mental', emoji: '🧠', desc: 'Hierarquia de conceitos e conexões' },
  { value: 'checklist_estudo', label: 'Checklist de Estudo', emoji: '✅', desc: 'Todos os tópicos essenciais' },
  { value: 'guia_completo', label: 'Guia Completo', emoji: '📚', desc: 'Estudo aprofundado com referências' },
  { value: 'resumo_estruturado', label: 'Resumo Estruturado', emoji: '📋', desc: 'Seções e pontos-chave' },
  { value: 'caso_clinico_modelo', label: 'Caso Clínico', emoji: '🏥', desc: 'Caso fictício para estudo' },
];

const STUDY_TYPES = [
  { value: 'all', label: 'Todos os Tipos' },
  { value: 'clinical_trial', label: 'Ensaio Clínico' },
  { value: 'meta_analysis', label: 'Meta-análise' },
  { value: 'review', label: 'Revisão' },
  { value: 'systematic_review', label: 'Revisão Sistemática' },
  { value: 'randomized_controlled_trial', label: 'Ensaio Randomizado' },
  { value: 'case_report', label: 'Relato de Caso' },
  { value: 'guideline', label: 'Diretriz' },
];

const LANGUAGES = [
  { value: 'all', label: 'Todos os Idiomas' },
  { value: 'en', label: 'Inglês' },
  { value: 'pt', label: 'Português' },
  { value: 'es', label: 'Espanhol' },
  { value: 'fr', label: 'Francês' },
  { value: 'de', label: 'Alemão' },
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

function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case 'básico': case 'basico': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950';
    case 'intermediário': case 'intermediario': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-950';
    case 'avançado': case 'avancado': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950';
    default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-950';
  }
}

function getTemplateTypeLabel(type: string) {
  return TEMPLATE_TYPES.find(t => t.value === type)?.label || type;
}

function getTemplateTypeEmoji(type: string) {
  return TEMPLATE_TYPES.find(t => t.value === type)?.emoji || '📄';
}

// ─── Reference Export Utilities ─────────────────────────────────────────────
function parseAuthors(authors: string[] | string): string[] {
  if (Array.isArray(authors)) return authors;
  if (typeof authors === 'string') {
    try { return JSON.parse(authors); } catch { return [authors]; }
  }
  return [];
}

function formatAuthorABNT(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].toUpperCase();
  const lastName = parts[parts.length - 1].toUpperCase();
  const firstNames = parts.slice(0, -1).map(n => n.charAt(0).toUpperCase() + '.').join(' ');
  return `${lastName}, ${firstNames}`;
}

function formatAuthorVancouver(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const lastName = parts[parts.length - 1];
  const initials = parts.slice(0, -1).map(n => n.charAt(0).toUpperCase()).join('');
  return `${lastName} ${initials}`;
}

function exportABNT(article: PubmedArticle): string {
  const authors = parseAuthors(article.authors);
  const authorStr = authors.length > 3
    ? `${formatAuthorABNT(authors[0])} et al.`
    : authors.map(formatAuthorABNT).join('; ');
  const title = article.title.replace(/\.$/, '');
  const journal = article.journal || '';
  const year = article.pubDate ? article.pubDate.split(/[\s\/\-]/)[0] : '';
  const doi = article.doi ? ` DOI: ${article.doi}.` : '';
  return `${authorStr}. ${title}. **${journal}**, ${year}.${doi}`;
}

function exportVancouver(article: PubmedArticle): string {
  const authors = parseAuthors(article.authors);
  const authorStr = authors.length > 6
    ? `${authors.slice(0, 6).map(formatAuthorVancouver).join(', ')}, et al.`
    : authors.map(formatAuthorVancouver).join(', ');
  const title = article.title.replace(/\.$/, '');
  const journal = article.journal || '';
  const year = article.pubDate ? article.pubDate.split(/[\s\/\-]/)[0] : '';
  const doi = article.doi ? ` doi: ${article.doi}` : '';
  const pmid = article.pmid ? ` PMID: ${article.pmid}.` : '';
  return `${authorStr}. ${title}. ${journal}. ${year}.${doi}${pmid}`;
}

function exportMaterialABNT(material: LibraryMaterial): string {
  const author = formatAuthorABNT(material.authorName);
  const title = material.title.replace(/\.$/, '');
  const source = material.source || '';
  const year = material.publishedYear || '';
  const doi = material.doi ? ` DOI: ${material.doi}.` : '';
  return `${author}. ${title}. **${source}**, ${year}.${doi}`;
}

function exportMaterialVancouver(material: LibraryMaterial): string {
  const author = formatAuthorVancouver(material.authorName);
  const title = material.title.replace(/\.$/, '');
  const source = material.source || '';
  const year = material.publishedYear || '';
  const doi = material.doi ? ` doi: ${material.doi}` : '';
  return `${author}. ${title}. ${source}. ${year}.${doi}`;
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    toast.success('Referência copiada para a área de transferência');
  }).catch(() => {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    toast.success('Referência copiada');
  });
}

function downloadReference(text: string, filename: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success('Referência baixada como arquivo .txt');
}

// ─── Star Rating Component ─────────────────────────────────────────────────
const StarRating: React.FC<{
  rating: number;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}> = ({ rating, onRate, size = 'md', interactive = false }) => {
  const [hovered, setHovered] = useState(0);
  const sizeClass = size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5';

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          className={`${interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`${sizeClass} ${
              star <= (hovered || rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-muted-foreground/30 fill-none'
            } transition-colors`}
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.562.562 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
        </button>
      ))}
    </div>
  );
};

// ─── Reference Export Buttons ─────────────────────────────────────────────
const ReferenceExportButtons: React.FC<{
  abntText: string;
  vancouverText: string;
  title: string;
}> = ({ abntText, vancouverText, title }) => {
  const [showMenu, setShowMenu] = useState(false);
  const safeTitle = title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-semibold transition-all"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
        </svg>
        Exportar Referência
      </button>
      {showMenu && (
        <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg z-50 py-2 min-w-[220px] animate-fade-in">
          <p className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Formato ABNT</p>
          <button onClick={() => { copyToClipboard(abntText); setShowMenu(false); }}
            className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/></svg>
            Copiar ABNT
          </button>
          <button onClick={() => { downloadReference(abntText, `ref_abnt_${safeTitle}.txt`); setShowMenu(false); }}
            className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
            Baixar ABNT (.txt)
          </button>
          <div className="border-t border-border my-1" />
          <p className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Formato Vancouver</p>
          <button onClick={() => { copyToClipboard(vancouverText); setShowMenu(false); }}
            className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"/></svg>
            Copiar Vancouver
          </button>
          <button onClick={() => { downloadReference(vancouverText, `ref_vancouver_${safeTitle}.txt`); setShowMenu(false); }}
            className="w-full text-left px-3 py-2 text-xs hover:bg-muted transition-colors flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
            Baixar Vancouver (.txt)
          </button>
        </div>
      )}
    </div>
  );
};

// ─── Notification Bell ─────────────────────────────────────────────────────
const NotificationBell: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const notifQuery = trpc.library.getNotifications.useQuery(undefined, { enabled: isAuthenticated, staleTime: 30000 });
  const markRead = trpc.library.markNotificationRead.useMutation({ onSuccess: () => notifQuery.refetch() });
  const markAllRead = trpc.library.markAllRead.useMutation({ onSuccess: () => notifQuery.refetch() });

  if (!isAuthenticated) return null;

  const unread = notifQuery.data?.unreadCount || 0;
  const notifications = notifQuery.data?.notifications || [];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] px-1">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>
      {showDropdown && (
        <div className="absolute right-0 top-full mt-2 bg-card border border-border rounded-xl shadow-xl z-50 w-80 max-h-96 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h4 className="text-sm font-bold text-foreground">Notificações</h4>
            {unread > 0 && (
              <button onClick={() => markAllRead.mutate()} className="text-xs text-primary font-semibold hover:underline">
                Marcar todas como lidas
              </button>
            )}
          </div>
          <div className="overflow-y-auto max-h-72">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-xs text-muted-foreground">Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notif: MaterialNotification) => (
                <div
                  key={notif.id}
                  onClick={() => { if (!notif.isRead) markRead.mutate({ notificationId: notif.id }); }}
                  className={`px-4 py-3 border-b border-border/50 cursor-pointer hover:bg-muted/50 transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    {!notif.isRead && <div className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground line-clamp-2">{notif.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {notif.subject} · {new Date(notif.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Subject Subscribe Button ──────────────────────────────────────────────
const SubjectSubscribeButton: React.FC<{
  subject: string;
  subscriptions: Array<{ subject: string }>;
  onRefresh: () => void;
}> = ({ subject, subscriptions, onRefresh }) => {
  const isSubscribed = subscriptions.some(s => s.subject === subject);
  const subscribe = trpc.library.subscribe.useMutation({ onSuccess: () => { onRefresh(); toast.success(`Inscrito em ${subject}`); } });
  const unsubscribe = trpc.library.unsubscribe.useMutation({ onSuccess: () => { onRefresh(); toast.info(`Desinscrito de ${subject}`); } });

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (isSubscribed) unsubscribe.mutate({ subject });
        else subscribe.mutate({ subject });
      }}
      disabled={subscribe.isPending || unsubscribe.isPending}
      className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all ${
        isSubscribed
          ? 'bg-primary/10 text-primary hover:bg-primary/20'
          : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
      }`}
      title={isSubscribed ? 'Cancelar notificações' : 'Receber notificações de novos materiais'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill={isSubscribed ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
      </svg>
      {isSubscribed ? 'Inscrito' : 'Notificar'}
    </button>
  );
};

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

      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getTypeColor(material.type)}`}>
          {getTypeEmoji(material.type)} {getTypeLabel(material.type)}
        </span>
        {material.aiCurated && (
          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-primary/10 text-primary">IA VALIDADA</span>
        )}
        {material.impactFactor && (
          <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400">IF: {material.impactFactor}</span>
        )}
      </div>

      <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2 pr-8">{material.title}</h3>

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

      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{material.description}</p>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 4).map((tag, i) => (
            <span key={i} className="px-2 py-0.5 rounded text-[9px] font-medium bg-muted text-muted-foreground">{tag}</span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/50">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {material.views}
          </span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
            {material.saves}
          </span>
        </div>
        <span className="font-semibold">{material.subject}</span>
      </div>
    </div>
  );
};

// ─── PubMed Article Card ───────────────────────────────────────────────────
const PubmedArticleCard: React.FC<{
  article: PubmedArticle;
  onViewAbstract: (article: PubmedArticle) => void;
}> = ({ article, onViewAbstract }) => {
  const authors = parseAuthors(article.authors);

  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-blue-400/50 hover:shadow-lg transition-all group">
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
          article.source === 'pubmed'
            ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950'
            : 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950'
        }`}>
          {article.source === 'pubmed' ? 'PubMed' : 'SciELO'}
        </span>
        {article.isOpenAccess && (
          <span className="px-2 py-1 rounded-lg text-[10px] font-bold text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-950">Open Access</span>
        )}
        {article.pubType && article.pubType.length > 0 && (
          <span className="px-2 py-1 rounded-lg text-[10px] font-medium text-muted-foreground bg-muted">
            {article.pubType[0]}
          </span>
        )}
      </div>

      <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2">{article.title}</h3>
      <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
        {authors.slice(0, 3).join(', ')}{authors.length > 3 ? ` et al.` : ''}
      </p>

      <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-3">
        {article.journal && <span className="font-semibold">{article.journal}</span>}
        {article.pubDate && <span>{article.pubDate}</span>}
      </div>

      {article.abstractText && (
        <p className="text-xs text-muted-foreground/80 line-clamp-3 mb-3">{article.abstractText}</p>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-border/50">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          {article.pmid && <span>PMID: {article.pmid}</span>}
        </div>
        <div className="flex items-center gap-2">
          <ReferenceExportButtons
            abntText={exportABNT(article)}
            vancouverText={exportVancouver(article)}
            title={article.title}
          />
          <button
            onClick={() => onViewAbstract(article)}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Ver Resumo
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── PubMed Abstract View ───────────────────────────────────────────────────
const PubmedAbstractView: React.FC<{
  article: PubmedArticle;
  onBack: () => void;
}> = ({ article, onBack }) => {
  const authors = parseAuthors(article.authors);
  const keywords = Array.isArray(article.keywords)
    ? article.keywords
    : typeof article.keywords === 'string'
      ? (() => { try { return JSON.parse(article.keywords as string); } catch { return []; } })()
      : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        Voltar à busca
      </button>

      <div className="bg-card border border-border rounded-2xl p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${
              article.source === 'pubmed'
                ? 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950'
                : 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950'
            }`}>
              {article.source === 'pubmed' ? 'PubMed' : 'SciELO'}
            </span>
          </div>
          <ReferenceExportButtons
            abntText={exportABNT(article)}
            vancouverText={exportVancouver(article)}
            title={article.title}
          />
        </div>

        <h1 className="text-2xl font-display font-bold text-foreground mb-4">{article.title}</h1>

        <div className="bg-muted/50 rounded-xl p-4 mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Autores</p>
          <p className="text-sm text-foreground">{authors.join(', ')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {article.journal && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Revista</p>
              <p className="text-sm font-semibold text-foreground">{article.journal}</p>
            </div>
          )}
          {article.pubDate && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Data</p>
              <p className="text-sm font-semibold text-foreground">{article.pubDate}</p>
            </div>
          )}
          {article.pmid && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">PMID</p>
              <p className="text-sm font-mono text-foreground">{article.pmid}</p>
            </div>
          )}
          {article.doi && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">DOI</p>
              <p className="text-xs font-mono text-foreground truncate">{article.doi}</p>
            </div>
          )}
        </div>

        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {keywords.map((kw: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground">{kw}</span>
            ))}
          </div>
        )}

        <div>
          <h3 className="text-base font-bold text-foreground mb-3">Resumo (Abstract)</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {article.abstractText || 'Resumo não disponível.'}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t border-border">
          {article.pmid && article.source === 'pubmed' && (
            <a href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              Ver no PubMed
            </a>
          )}
          {article.doi && (
            <a href={`https://doi.org/${article.doi}`} target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-semibold hover:bg-muted/80 transition-colors">
              Acessar via DOI
            </a>
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
  const { isAuthenticated } = useAuth();
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');
  const reviewsQuery = trpc.library.getReviews.useQuery({ materialId: material.id });
  const addReview = trpc.library.addReview.useMutation({ onSuccess: () => { reviewsQuery.refetch(); setReviewRating(0); setReviewComment(''); toast.success('Avaliação enviada!'); } });
  const markHelpful = trpc.library.markHelpful.useMutation({ onSuccess: () => reviewsQuery.refetch() });

  const reviews = reviewsQuery.data || [];
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: MaterialReview) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        Voltar ao catálogo
      </button>

      <div className="bg-card border border-border rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${getTypeColor(material.type)}`}>
              {getTypeEmoji(material.type)} {getTypeLabel(material.type)}
            </span>
            {material.aiCurated && (
              <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary">IA VALIDADA</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <ReferenceExportButtons
              abntText={exportMaterialABNT(material)}
              vancouverText={exportMaterialVancouver(material)}
              title={material.title}
            />
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
        </div>

        <h1 className="text-2xl font-display font-bold text-foreground mb-4">{material.title}</h1>

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

        <p className="text-sm text-foreground/80 leading-relaxed mb-6">{material.description}</p>

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
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, i) => (
              <span key={i} className="px-3 py-1 rounded-lg text-xs font-medium bg-muted text-muted-foreground">{tag}</span>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-4 border-t border-border">
          <button onClick={onDeepDive}
            className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            Deep Dive com IA
          </button>
          {material.externalUrl && (
            <a href={material.externalUrl} target="_blank" rel="noopener noreferrer"
              className="px-6 py-3 bg-muted text-foreground rounded-xl font-semibold hover:bg-muted/80 transition-colors">
              Acessar Fonte
            </a>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-foreground">Avaliações</h3>
            {reviews.length > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRating rating={Math.round(avgRating)} size="sm" />
                <span className="text-sm font-semibold text-foreground">{avgRating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({reviews.length})</span>
              </div>
            )}
          </div>
        </div>

        {isAuthenticated && (
          <div className="bg-muted/30 rounded-xl p-4 mb-4">
            <p className="text-xs font-semibold text-foreground mb-2">Sua Avaliação</p>
            <StarRating rating={reviewRating} onRate={setReviewRating} interactive size="lg" />
            {reviewRating > 0 && (
              <div className="mt-3">
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Comentário opcional..."
                  className="w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary resize-none"
                  rows={2}
                />
                <button
                  onClick={() => addReview.mutate({ materialId: material.id, rating: reviewRating, comment: reviewComment || undefined })}
                  disabled={addReview.isPending}
                  className="mt-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {addReview.isPending ? 'Enviando...' : 'Enviar Avaliação'}
                </button>
              </div>
            )}
          </div>
        )}

        {reviews.length > 0 ? (
          <div className="space-y-3">
            {reviews.map((review: MaterialReview) => (
              <div key={review.id} className="border-b border-border/50 pb-3 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{review.userName || 'Anônimo'}</span>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                {review.comment && <p className="text-xs text-foreground/80 mb-1">{review.comment}</p>}
                <button
                  onClick={() => markHelpful.mutate({ reviewId: review.id })}
                  className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                  </svg>
                  Útil ({review.helpful})
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4">Nenhuma avaliação ainda. Seja o primeiro!</p>
        )}
      </div>
    </div>
  );
};

// ─── Deep Dive View ────────────────────────────────────────────────────────
const DeepDiveView: React.FC<{
  material: LibraryMaterial;
  onBack: () => void;
}> = ({ material, onBack }) => {
  const deepDive = trpc.library.aiDeepDive.useMutation();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!content && !deepDive.isPending) {
      deepDive.mutateAsync({
        materialId: material.id,
        title: material.title,
        subject: material.subject,
        authorName: material.authorName,
      }).then(res => setContent(typeof res.content === 'string' ? res.content : ''));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        Voltar ao material
      </button>

      <div className="bg-card border border-border rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-foreground">Deep Dive — {material.title}</h2>
            <p className="text-xs text-muted-foreground">Resumo acadêmico gerado por IA</p>
          </div>
        </div>

        {deepDive.isPending ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Gerando resumo aprofundado...</h3>
            <p className="text-sm text-muted-foreground">A IA está analisando o material e criando um resumo detalhado</p>
          </div>
        ) : (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <Streamdown>{content}</Streamdown>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Recommendations View ──────────────────────────────────────────────────
const RecommendationsView: React.FC = () => {
  const getRecommendations = trpc.library.getRecommendations.useMutation();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [insights, setInsights] = useState<RecommendationInsights | null>(null);
  const [loaded, setLoaded] = useState(false);

  const handleLoadRecommendations = async () => {
    try {
      const result = await getRecommendations.mutateAsync({ limit: 10 });
      setRecommendations(result.recommendations || []);
      setInsights(result.insights || null);
      setLoaded(true);
    } catch {
      toast.error('Erro ao gerar recomendações. Tente novamente.');
    }
  };

  if (!loaded && !getRecommendations.isPending) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <h3 className="text-xl font-display font-bold text-foreground mb-2">Recomendações Personalizadas</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-lg mx-auto">
          A IA vai analisar seu histórico de estudo, desempenho em quizzes e disciplinas favoritas para recomendar materiais acadêmicos sob medida para você.
        </p>
        <button onClick={handleLoadRecommendations}
          className="px-8 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all">
          Gerar Minhas Recomendações
        </button>
      </div>
    );
  }

  if (getRecommendations.isPending) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">Analisando seu perfil de estudo...</h3>
        <p className="text-sm text-muted-foreground">A IA está avaliando seu histórico, desempenho e preferências</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {insights && (
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              </svg>
            </div>
            <h3 className="text-sm font-bold text-foreground">Análise do Seu Perfil</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card/50 rounded-xl p-4">
              <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-2">Pontos Fortes</p>
              <ul className="space-y-1">
                {insights.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                    <span className="text-green-500 mt-0.5">+</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card/50 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-2">Áreas para Melhorar</p>
              <ul className="space-y-1">
                {insights.areasToImprove.map((a, i) => (
                  <li key={i} className="text-xs text-foreground/80 flex items-start gap-1.5">
                    <span className="text-amber-500 mt-0.5">!</span> {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-card/50 rounded-xl p-4">
              <p className="text-xs font-bold text-primary uppercase tracking-wider mb-2">Dica de Estudo</p>
              <p className="text-xs text-foreground/80 leading-relaxed">{insights.studyTip}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{recommendations.length} materiais recomendados para você</p>
        <button onClick={handleLoadRecommendations} disabled={getRecommendations.isPending}
          className="text-xs font-semibold text-primary hover:underline">
          Atualizar Recomendações
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {recommendations.map((rec, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg transition-all">
            <div className="flex items-center gap-2 mb-3">
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getTypeColor(rec.type)}`}>
                {getTypeEmoji(rec.type)} {getTypeLabel(rec.type)}
              </span>
              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(rec.difficulty)}`}>
                {rec.difficulty}
              </span>
              <span className="ml-auto text-xs font-bold text-primary">{rec.relevanceScore}%</span>
            </div>
            <h3 className="font-semibold text-foreground text-sm mb-2">{rec.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{rec.authorTitle} {rec.authorName}</p>
                <p className="text-[10px] text-muted-foreground truncate">{rec.authorInstitution}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{rec.description}</p>
            <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">Por que recomendado</p>
              <p className="text-xs text-foreground/80">{rec.reason}</p>
            </div>
            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-3 mt-3 border-t border-border/50">
              <span className="font-semibold">{rec.source}</span>
              <span>{rec.subject}</span>
            </div>
          </div>
        ))}
      </div>

      {recommendations.length === 0 && loaded && (
        <div className="text-center py-12">
          <p className="text-sm text-muted-foreground">Nenhuma recomendação disponível. Estude mais materiais para receber sugestões personalizadas!</p>
        </div>
      )}
    </div>
  );
};

// ─── Templates View ────────────────────────────────────────────────────────
const TemplatesView: React.FC<{
  onViewTemplate: (template: StudyTemplate) => void;
  onGenerateTemplate: () => void;
}> = ({ onViewTemplate, onGenerateTemplate }) => {
  const { isAuthenticated } = useAuth();
  const [filterSubject, setFilterSubject] = useState('');
  const [filterType, setFilterType] = useState('');
  const templatesQuery = trpc.library.getTemplates.useQuery(
    { subject: filterSubject || undefined, templateType: filterType || undefined },
    { staleTime: 30000 }
  );
  const myTemplatesQuery = trpc.library.myTemplates.useQuery(undefined, { enabled: isAuthenticated, staleTime: 30000 });
  const [showMine, setShowMine] = useState(false);

  const templates = showMine ? (myTemplatesQuery.data || []) : (templatesQuery.data || []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-500/5 to-primary/5 border border-violet-200/30 dark:border-violet-800/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Templates de Estudo</h3>
              <p className="text-xs text-muted-foreground">Materiais originais gerados por IA, respeitando direitos autorais</p>
            </div>
          </div>
          {isAuthenticated && (
            <button onClick={onGenerateTemplate}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Gerar Template
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer">
            <option value="">Todas Disciplinas</option>
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer">
            <option value="">Todos os Tipos</option>
            {TEMPLATE_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
          </select>
          {isAuthenticated && (
            <button onClick={() => setShowMine(!showMine)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                showMine ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
              }`}>
              {showMine ? 'Meus Templates' : 'Ver Meus Templates'}
            </button>
          )}
        </div>
      </div>

      {/* Template Type Cards (when no filter) */}
      {!filterSubject && !filterType && !showMine && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {TEMPLATE_TYPES.map(t => (
            <button key={t.value} onClick={() => setFilterType(t.value)}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:shadow-md transition-all text-left group">
              <span className="text-2xl mb-2 block">{t.emoji}</span>
              <p className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">{t.label}</p>
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2">{t.desc}</p>
            </button>
          ))}
        </div>
      )}

      {/* Templates Grid */}
      {(templatesQuery.isLoading || myTemplatesQuery.isLoading) ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
              <path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">Carregando templates...</p>
        </div>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {templates.map((template: any) => (
            <div key={template.id} onClick={() => onViewTemplate(template)}
              className="bg-card border border-border rounded-xl p-5 hover:border-violet-400/50 hover:shadow-lg transition-all cursor-pointer group">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                  {getTemplateTypeEmoji(template.templateType)} {getTemplateTypeLabel(template.templateType)}
                </span>
                {template.difficulty && (
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${getDifficultyColor(template.difficulty)}`}>
                    {template.difficulty}
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors line-clamp-2 mb-2">{template.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{template.content.substring(0, 150)}...</p>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2 border-t border-border/50">
                <span className="font-semibold">{template.subject}</span>
                <div className="flex items-center gap-2">
                  <span>{template.views} views</span>
                  <span>{new Date(template.createdAt).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-sm font-semibold text-muted-foreground mb-2">
            {showMine ? 'Você ainda não gerou templates' : 'Nenhum template encontrado'}
          </p>
          <p className="text-xs text-muted-foreground/60 mb-4">
            {showMine ? 'Clique em "Gerar Template" para criar seu primeiro' : 'Tente ajustar os filtros ou gere um novo template'}
          </p>
          {isAuthenticated && (
            <button onClick={onGenerateTemplate}
              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-all">
              Gerar Template
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Template Detail View ──────────────────────────────────────────────────
const TemplateDetailView: React.FC<{
  template: StudyTemplate;
  onBack: () => void;
}> = ({ template, onBack }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        Voltar aos templates
      </button>

      <div className="bg-card border border-border rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
            {getTemplateTypeEmoji(template.templateType)} {getTemplateTypeLabel(template.templateType)}
          </span>
          {template.difficulty && (
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase ${getDifficultyColor(template.difficulty)}`}>
              {template.difficulty}
            </span>
          )}
          <span className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary/10 text-primary">
            {template.subject}
          </span>
        </div>

        <h1 className="text-2xl font-display font-bold text-foreground mb-6">{template.title}</h1>

        <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/30 dark:border-amber-800/30 rounded-xl p-4 mb-6">
          <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            Conteúdo original gerado por IA — Referências de acesso aberto, sem violação de direitos autorais
          </p>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none">
          <Streamdown>{template.content}</Streamdown>
        </div>

        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
          <span>{template.views} visualizações</span>
          <span>Criado em {new Date(template.createdAt).toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </div>
  );
};

// ─── Template Generator View ───────────────────────────────────────────────
const TemplateGeneratorView: React.FC<{
  onBack: () => void;
  onGenerated: (template: StudyTemplate) => void;
}> = ({ onBack, onGenerated }) => {
  const [templateType, setTemplateType] = useState('');
  const [subject, setSubject] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [year, setYear] = useState<number | undefined>();
  const [difficulty, setDifficulty] = useState<'basico' | 'intermediario' | 'avancado'>('intermediario');
  const [customPrompt, setCustomPrompt] = useState('');

  const generate = trpc.library.generateTemplate.useMutation({
    onSuccess: (data) => {
      if (data.template) {
        toast.success('Template gerado com sucesso!');
        onGenerated(data.template as StudyTemplate);
      }
    },
    onError: () => toast.error('Erro ao gerar template. Tente novamente.'),
  });

  const handleGenerate = () => {
    if (!templateType || !subject) {
      toast.error('Selecione o tipo de template e a disciplina');
      return;
    }
    generate.mutate({
      templateType: templateType as any,
      subject,
      specialty: specialty || undefined,
      year,
      difficulty,
      customPrompt: customPrompt || undefined,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M15 19l-7-7 7-7"/></svg>
        Voltar aos templates
      </button>

      <div className="bg-card border border-border rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-primary/10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-display font-bold text-foreground">Gerar Template de Estudo</h2>
            <p className="text-xs text-muted-foreground">Conteúdo original gerado por IA, respeitando direitos autorais</p>
          </div>
        </div>

        {generate.isPending ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-violet-600 dark:text-violet-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Gerando template...</h3>
            <p className="text-sm text-muted-foreground">A IA está criando conteúdo original e validado para você</p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Template Type Selection */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-3 block">Tipo de Template *</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {TEMPLATE_TYPES.map(t => (
                  <button key={t.value} onClick={() => setTemplateType(t.value)}
                    className={`p-3 rounded-xl text-left transition-all ${
                      templateType === t.value
                        ? 'bg-violet-100 dark:bg-violet-900/30 border-2 border-violet-500'
                        : 'bg-muted/50 border-2 border-transparent hover:border-border'
                    }`}>
                    <span className="text-lg block mb-1">{t.emoji}</span>
                    <p className="text-[10px] font-bold text-foreground">{t.label}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="text-sm font-semibold text-foreground mb-2 block">Disciplina *</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-sm font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer">
                <option value="">Selecione a disciplina</option>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Optional fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Especialidade</label>
                <select value={specialty} onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-xs font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer">
                  <option value="">Opcional</option>
                  {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Ano</label>
                <select value={year || ''} onChange={(e) => setYear(e.target.value ? Number(e.target.value) : undefined)}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-xs font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer">
                  <option value="">Opcional</option>
                  {[1, 2, 3, 4, 5, 6].map(y => <option key={y} value={y}>{y}° Ano</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Dificuldade</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-xs font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer">
                  <option value="basico">Básico</option>
                  <option value="intermediario">Intermediário</option>
                  <option value="avancado">Avançado</option>
                </select>
              </div>
            </div>

            {/* Custom prompt */}
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">Instruções adicionais (opcional)</label>
              <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Ex: Foque nos diagnósticos diferenciais de dor torácica, inclua tabelas comparativas..."
                className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary resize-none"
                rows={3}
              />
            </div>

            <button onClick={handleGenerate} disabled={!templateType || !subject}
              className="w-full px-6 py-3 bg-gradient-to-r from-violet-600 to-primary text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              Gerar Template com IA
            </button>

            <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/30 dark:border-amber-800/30 rounded-xl p-4">
              <p className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                Todo conteúdo é original, gerado por IA. Referências citadas são de acesso aberto (PubMed, SciELO, diretrizes do SUS/MS). Nenhum material protegido por direitos autorais é copiado.
              </p>
            </div>
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
  const [previousView, setPreviousView] = useState<ViewMode>('catalog');

  // PubMed/SciELO state
  const [pubmedQuery, setPubmedQuery] = useState('');
  const [pubmedSource, setPubmedSource] = useState<'pubmed' | 'scielo'>('pubmed');
  const [pubmedArticles, setPubmedArticles] = useState<PubmedArticle[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<PubmedArticle | null>(null);
  const [pubmedSearchDone, setPubmedSearchDone] = useState(false);

  // Advanced PubMed filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [studyType, setStudyType] = useState('all');
  const [pubmedLanguage, setPubmedLanguage] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  // Templates state
  const [selectedTemplate, setSelectedTemplate] = useState<StudyTemplate | null>(null);

  // Subscriptions
  const subscriptionsQuery = trpc.library.getSubscriptions.useQuery(undefined, { enabled: isAuthenticated, staleTime: 30000 });

  // tRPC queries
  const popularQuery = trpc.library.popular.useQuery(undefined, { staleTime: 60000 });
  const searchQueryResult = trpc.library.search.useQuery(
    { query: searchQuery, subject: selectedSubject || undefined, year: selectedYear, type: selectedType || undefined },
    { enabled: view === 'catalog' || view === 'search', staleTime: 30000 }
  );
  const savedIdsQuery = trpc.library.savedIds.useQuery(undefined, { enabled: isAuthenticated, staleTime: 30000 });
  const savedMaterialsQuery = trpc.library.savedMaterials.useQuery(undefined, { enabled: view === 'saved' && isAuthenticated });

  // AI search

  const aiSearch = trpc.library.aiSearch.useMutation();
  const pubmedAdvancedSearch = trpc.library.pubmedAdvancedSearch.useMutation();
  const toggleSave = trpc.library.toggleSave.useMutation({
    onSuccess: () => { savedIdsQuery.refetch(); savedMaterialsQuery.refetch(); },
  });

  const savedIds = useMemo(() => new Set(savedIdsQuery.data || []), [savedIdsQuery.data]);

  const handleToggleSave = useCallback((materialId: number) => {
    if (!isAuthenticated) { toast.error('Faça login para salvar materiais'); return; }
    toggleSave.mutate({ materialId });
  }, [isAuthenticated, toggleSave]);

  const handleAiSearch = async () => {
    if (!aiSearchQuery.trim()) return;
    try {
      const result = await aiSearch.mutateAsync({
        query: aiSearchQuery,
        subject: selectedSubject || undefined,
        year: selectedYear,
        specialty: selectedSpecialty || undefined,
      });
      if (result.materials) {
        setView('search');
      }
    } catch {
      toast.error('Erro na busca. Tente novamente.');
    }
  };

  const handlePubmedSearch = async () => {
    if (!pubmedQuery.trim()) return;
    try {
      const result = await pubmedAdvancedSearch.mutateAsync({
        query: pubmedQuery,
        source: pubmedSource,
        maxResults: 15,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        studyType: studyType as any,
        language: pubmedLanguage as any,
      });
      setPubmedArticles(result.articles || []);
      setTotalResults(result.totalResults || 0);
      setPubmedSearchDone(true);
    } catch {
      toast.error('Erro na busca PubMed. Tente novamente.');
    }
  };

  const handleViewMaterial = (material: LibraryMaterial) => {
    setSelectedMaterial(material);
    setPreviousView(view);
    setView('detail');
  };

  const handleViewTemplate = (template: StudyTemplate) => {
    setSelectedTemplate(template);
    setView('template-detail');
  };

  const materials = searchQuery || selectedSubject || selectedType
    ? (searchQueryResult.data || [])
    : (popularQuery.data || []);

  // ─── Tab Navigation ────────────────────────────────────────────────────
  const tabs: { id: ViewMode; label: string; icon: React.ReactNode; requireAuth?: boolean }[] = [
    {
      id: 'catalog', label: 'Catálogo',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
    },
    {
      id: 'pubmed', label: 'PubMed/SciELO',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" /></svg>,
    },
    {
      id: 'templates', label: 'Templates',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    },
    {
      id: 'recommendations', label: 'Para Você',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
      requireAuth: true,
    },
    {
      id: 'saved', label: 'Salvos',
      icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
      requireAuth: true,
    },
  ];

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Biblioteca Acadêmica</h1>
          <p className="text-sm text-muted-foreground mt-1">Referências curadas por IA, bases científicas reais e templates originais</p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationBell />
        </div>
      </div>

      {/* Tab Navigation */}
      {!['detail', 'deepdive', 'template-detail', 'template-generate'].includes(view) && (
        <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 overflow-x-auto">
          {tabs.filter(t => !t.requireAuth || isAuthenticated).map(tab => (
            <button
              key={tab.id}
              onClick={() => { setView(tab.id); setSelectedArticle(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                (view === tab.id || (tab.id === 'catalog' && view === 'search'))
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Catalog / Search View */}
      {(view === 'catalog' || view === 'search') && (
        <div className="space-y-6">
          {/* AI Search Bar */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground">Busca Inteligente por IA</h3>
                <p className="text-xs text-muted-foreground">Descreva o que precisa estudar e a IA encontra os melhores materiais</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
                placeholder="Ex: Materiais sobre diagnóstico diferencial de dor torácica..."
                className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all"
              />
              <button onClick={handleAiSearch} disabled={aiSearch.isPending || !aiSearchQuery.trim()}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2">
                {aiSearch.isPending ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                )}
                Buscar
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrar por título, autor..."
              className="px-4 py-2.5 bg-card border border-border rounded-xl text-xs font-medium text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all w-64"
            />
            <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-2.5 bg-card border border-border rounded-xl text-xs font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer">
              <option value="">Todas Disciplinas</option>
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2.5 bg-card border border-border rounded-xl text-xs font-medium text-foreground outline-none focus:border-primary transition-all cursor-pointer">
              <option value="">Todos os Tipos</option>
              {MATERIAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
            </select>
            {isAuthenticated && selectedSubject && (
              <SubjectSubscribeButton
                subject={selectedSubject}
                subscriptions={subscriptionsQuery.data || []}
                onRefresh={() => subscriptionsQuery.refetch()}
              />
            )}
          </div>

          {/* Materials Grid */}
          {searchQueryResult.isLoading || popularQuery.isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/3 mb-3" />
                  <div className="h-5 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2 mb-3" />
                  <div className="h-3 bg-muted rounded w-full mb-2" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : materials.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(materials as LibraryMaterial[]).map(material => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  isSaved={savedIds.has(material.id)}
                  onToggleSave={handleToggleSave}
                  onClick={handleViewMaterial}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Nenhum material encontrado</h3>
              <p className="text-sm text-muted-foreground">Use a busca inteligente por IA para encontrar materiais acadêmicos</p>
            </div>
          )}
        </div>
      )}

      {/* PubMed/SciELO View */}
      {view === 'pubmed' && !selectedArticle && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-500/5 to-emerald-500/5 border border-blue-200/30 dark:border-blue-800/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Busca em Bases Científicas</h3>
                  <p className="text-xs text-muted-foreground">Pesquise diretamente no PubMed (NCBI) e SciELO com filtros avançados</p>
                </div>
              </div>
              <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
                {showAdvancedFilters ? 'Ocultar Filtros' : 'Filtros Avançados'}
              </button>
            </div>

            {/* Source toggle */}
            <div className="flex items-center gap-2 mb-4">
              <button onClick={() => setPubmedSource('pubmed')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  pubmedSource === 'pubmed' ? 'bg-blue-600 text-white' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}>
                PubMed
              </button>
              <button onClick={() => setPubmedSource('scielo')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  pubmedSource === 'scielo' ? 'bg-emerald-600 text-white' : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                }`}>
                SciELO
              </button>
            </div>

            {/* Search bar */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={pubmedQuery}
                onChange={(e) => setPubmedQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePubmedSearch()}
                placeholder={`Buscar no ${pubmedSource === 'pubmed' ? 'PubMed' : 'SciELO'}...`}
                className="flex-1 px-4 py-3 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary transition-all"
              />
              <button onClick={handlePubmedSearch} disabled={pubmedAdvancedSearch.isPending || !pubmedQuery.trim()}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center gap-2">
                {pubmedAdvancedSearch.isPending ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                )}
                Buscar
              </button>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="bg-card/50 rounded-xl p-4 border border-border/50 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Ano Inicial</label>
                    <input type="number" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
                      placeholder="Ex: 2020" min="1900" max="2030"
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Ano Final</label>
                    <input type="number" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
                      placeholder="Ex: 2026" min="1900" max="2030"
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Tipo de Estudo</label>
                    <select value={studyType} onChange={(e) => setStudyType(e.target.value)}
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer">
                      {STUDY_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">Idioma</label>
                    <select value={pubmedLanguage} onChange={(e) => setPubmedLanguage(e.target.value)}
                      className="w-full px-3 py-2 bg-card border border-border rounded-lg text-xs font-medium text-foreground outline-none focus:border-primary cursor-pointer">
                      {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                  <p className="text-[10px] text-muted-foreground">Filtros aplicados à busca no {pubmedSource === 'pubmed' ? 'PubMed' : 'SciELO'}</p>
                  <button onClick={() => { setDateFrom(''); setDateTo(''); setStudyType('all'); setPubmedLanguage('all'); }}
                    className="text-[10px] font-semibold text-primary hover:underline">Limpar Filtros</button>
                </div>
              </div>
            )}
          </div>

          {/* Results info */}
          {pubmedSearchDone && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {pubmedArticles.length} artigos encontrados
                {totalResults > pubmedArticles.length && ` (de ${totalResults.toLocaleString('pt-BR')} total)`}
              </p>
              {pubmedArticles.length > 0 && (
                <button
                  onClick={() => {
                    const allRefs = pubmedArticles.map((a, i) => `${i + 1}. ${exportVancouver(a)}`).join('\n\n');
                    copyToClipboard(allRefs);
                  }}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                  Exportar Todas (Vancouver)
                </button>
              )}
            </div>
          )}

          {/* Articles */}
          {pubmedAdvancedSearch.isPending ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Buscando no {pubmedSource === 'pubmed' ? 'PubMed' : 'SciELO'}...</h3>
              <p className="text-sm text-muted-foreground">Consultando bases científicas em tempo real</p>
            </div>
          ) : pubmedArticles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pubmedArticles.map((article, i) => (
                <PubmedArticleCard key={article.pmid || i} article={article} onViewAbstract={setSelectedArticle} />
              ))}
            </div>
          ) : pubmedSearchDone ? (
            <div className="text-center py-16">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Nenhum artigo encontrado</p>
              <p className="text-xs text-muted-foreground/60">Tente ajustar os termos de busca ou os filtros avançados</p>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">Busca em Bases Científicas</h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Pesquise artigos científicos diretamente no PubMed e SciELO. Use os filtros avançados para refinar por data, tipo de estudo e idioma.
              </p>
            </div>
          )}
        </div>
      )}

      {/* PubMed Abstract View */}
      {view === 'pubmed' && selectedArticle && (
        <PubmedAbstractView article={selectedArticle} onBack={() => setSelectedArticle(null)} />
      )}

      {/* Material Detail */}
      {view === 'detail' && selectedMaterial && (
        <MaterialDetail
          material={selectedMaterial}
          isSaved={savedIds.has(selectedMaterial.id)}
          onToggleSave={handleToggleSave}
          onBack={() => setView(previousView)}
          onDeepDive={() => setView('deepdive')}
        />
      )}

      {/* Deep Dive */}
      {view === 'deepdive' && selectedMaterial && (
        <DeepDiveView material={selectedMaterial} onBack={() => setView('detail')} />
      )}

      {/* Saved Materials */}
      {view === 'saved' && (
        <div className="space-y-6">
          <h2 className="text-lg font-display font-bold text-foreground">Materiais Salvos</h2>
          {savedMaterialsQuery.isLoading ? (
            <div className="text-center py-16">
              <p className="text-sm text-muted-foreground">Carregando...</p>
            </div>
          ) : (savedMaterialsQuery.data || []).length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {(savedMaterialsQuery.data as LibraryMaterial[] || []).map(material => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  isSaved={true}
                  onToggleSave={handleToggleSave}
                  onClick={handleViewMaterial}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-sm font-semibold text-muted-foreground mb-2">Nenhum material salvo</p>
              <p className="text-xs text-muted-foreground/60">Salve materiais do catálogo para acessá-los rapidamente aqui</p>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {view === 'recommendations' && <RecommendationsView />}

      {/* Templates */}
      {view === 'templates' && (
        <TemplatesView
          onViewTemplate={handleViewTemplate}
          onGenerateTemplate={() => setView('template-generate')}
        />
      )}

      {/* Template Detail */}
      {view === 'template-detail' && selectedTemplate && (
        <TemplateDetailView template={selectedTemplate} onBack={() => { setView('templates'); setSelectedTemplate(null); }} />
      )}

      {/* Template Generator */}
      {view === 'template-generate' && (
        <TemplateGeneratorView
          onBack={() => setView('templates')}
          onGenerated={(template) => { setSelectedTemplate(template); setView('template-detail'); }}
        />
      )}
    </div>
  );
};

export default AcademicLibrary;
