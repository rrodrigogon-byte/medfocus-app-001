/**
 * AcademicResourcesPanel - Painel de Recursos Acadêmicos
 * Exibe grades curriculares por universidade, livros recomendados por disciplina,
 * e fontes acadêmicas confiáveis (SciELO, PubMed, CAPES, teses, etc.)
 */
import React, { useState, useMemo } from 'react';
import {
  UNIVERSITIES,
  BOOK_RECOMMENDATIONS,
  ACADEMIC_SOURCES,
  getBooksByYear,
  getCategoryLabel,
  type University,
  type Semester,
  type BookRecommendation,
  type AcademicSource,
} from '../../data/academicResources';

type Tab = 'grades' | 'livros' | 'fontes';

const AcademicResourcesPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('grades');
  const [selectedUni, setSelectedUni] = useState<string>('usp');
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [bookFilter, setBookFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const university = useMemo(
    () => UNIVERSITIES.find(u => u.id === selectedUni),
    [selectedUni]
  );

  const yearSemesters = useMemo(
    () => university?.semesters.filter(s => s.year === selectedYear) || [],
    [university, selectedYear]
  );

  const filteredBooks = useMemo(() => {
    let books = bookFilter === 'all'
      ? BOOK_RECOMMENDATIONS
      : BOOK_RECOMMENDATIONS.filter(b => b.discipline.toLowerCase().includes(bookFilter.toLowerCase()));
    return books.sort((a, b) => a.discipline.localeCompare(b.discipline));
  }, [bookFilter]);

  const filteredSources = useMemo(() => {
    return sourceFilter === 'all'
      ? ACADEMIC_SOURCES
      : ACADEMIC_SOURCES.filter(s => s.type === sourceFilter);
  }, [sourceFilter]);

  const uniqueDisciplines = useMemo(() => {
    const set = new Set(BOOK_RECOMMENDATIONS.map(b => b.discipline));
    return Array.from(set).sort();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Recursos Acadêmicos
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Grades curriculares reais, livros recomendados e fontes acadêmicas confiáveis
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl">
        {([
          { key: 'grades', label: 'Grades Curriculares', icon: '🎓' },
          { key: 'livros', label: 'Livros Recomendados', icon: '📚' },
          { key: 'fontes', label: 'Fontes Acadêmicas', icon: '🔬' },
        ] as { key: Tab; label: string; icon: string }[]).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <span className="mr-1">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* GRADES CURRICULARES */}
      {activeTab === 'grades' && (
        <div className="space-y-4">
          {/* University Selector */}
          <div className="flex flex-wrap gap-2">
            {UNIVERSITIES.map(uni => (
              <button
                key={uni.id}
                onClick={() => setSelectedUni(uni.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  selectedUni === uni.id
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                }`}
              >
                {uni.shortName}
              </button>
            ))}
          </div>

          {university && (
            <>
              {/* University Info */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h3 className="font-display font-bold text-foreground">{university.name}</h3>
                <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                  <span>{university.city}, {university.state}</span>
                  <span className="text-primary font-medium capitalize">{university.type}</span>
                  {university.ranking && <span>Ranking: #{university.ranking}</span>}
                  <span>{university.semesters.length} semestres</span>
                </div>
              </div>

              {/* Year Selector */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6].map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`flex-1 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                      selectedYear === year
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {year}º Ano
                  </button>
                ))}
              </div>

              {/* Semesters & Disciplines */}
              <div className="space-y-4">
                {yearSemesters.map(semester => (
                  <SemesterCard key={semester.number} semester={semester} />
                ))}
              </div>

              {/* Books for this year */}
              <div className="bg-card border border-border rounded-xl p-4">
                <h4 className="font-display font-bold text-foreground text-sm mb-3">
                  Livros Recomendados para o {selectedYear}º Ano
                </h4>
                <div className="space-y-2">
                  {getBooksByYear(selectedYear).slice(0, 5).map((book, i) => (
                    <div key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
                        {book.type === 'atlas' ? 'AT' : book.type === 'manual' ? 'MN' : 'RF'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{book.title}</p>
                        <p className="text-[10px] text-muted-foreground">{book.author} — {book.discipline}</p>
                      </div>
                    </div>
                  ))}
                  {getBooksByYear(selectedYear).length > 5 && (
                    <button
                      onClick={() => { setActiveTab('livros'); }}
                      className="text-xs text-primary hover:underline mt-1"
                    >
                      Ver todos os {getBooksByYear(selectedYear).length} livros →
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* LIVROS RECOMENDADOS */}
      {activeTab === 'livros' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setBookFilter('all')}
              className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                bookFilter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              Todas
            </button>
            {uniqueDisciplines.map(d => (
              <button
                key={d}
                onClick={() => setBookFilter(d)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                  bookFilter === d ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* Book Cards */}
          <div className="grid gap-3">
            {filteredBooks.map((book, i) => (
              <BookCard key={i} book={book} />
            ))}
          </div>
        </div>
      )}

      {/* FONTES ACADÊMICAS */}
      {activeTab === 'fontes' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex flex-wrap gap-1">
            {[
              { key: 'all', label: 'Todas' },
              { key: 'artigos', label: 'Artigos' },
              { key: 'teses', label: 'Teses' },
              { key: 'livros', label: 'Livros' },
              { key: 'diretrizes', label: 'Diretrizes' },
              { key: 'periodicos', label: 'Periódicos' },
              { key: 'repositorio', label: 'Repositórios' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setSourceFilter(f.key)}
                className={`px-2 py-1 rounded-md text-[10px] font-medium transition-all ${
                  sourceFilter === f.key ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Source Cards */}
          <div className="grid gap-3">
            {filteredSources.map((source, i) => (
              <SourceCard key={i} source={source} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

function SemesterCard({ semester }: { semester: Semester }) {
  const totalHours = semester.disciplines.reduce((sum, d) => sum + d.hours, 0);
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-display font-bold text-foreground text-sm">
          {semester.label}
        </h4>
        <span className="text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
          {totalHours}h total
        </span>
      </div>
      <div className="space-y-1.5">
        {semester.disciplines.map((disc, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                disc.category === 'basica' ? 'bg-blue-500' :
                disc.category === 'clinica' ? 'bg-emerald-500' :
                disc.category === 'cirurgica' ? 'bg-red-500' :
                disc.category === 'saude_publica' ? 'bg-amber-500' :
                disc.category === 'internato' ? 'bg-purple-500' :
                'bg-gray-500'
              }`} />
              <span className="text-xs text-foreground truncate">{disc.name}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 ml-2">
              <span className="text-[10px] text-muted-foreground">{disc.hours}h</span>
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                disc.category === 'basica' ? 'bg-blue-500/10 text-blue-600' :
                disc.category === 'clinica' ? 'bg-emerald-500/10 text-emerald-600' :
                disc.category === 'cirurgica' ? 'bg-red-500/10 text-red-600' :
                disc.category === 'saude_publica' ? 'bg-amber-500/10 text-amber-600' :
                disc.category === 'internato' ? 'bg-purple-500/10 text-purple-600' :
                'bg-gray-500/10 text-gray-600'
              }`}>
                {getCategoryLabel(disc.category)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookCard({ book }: { book: BookRecommendation }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          book.type === 'referencia' ? 'bg-primary/10 text-primary' :
          book.type === 'atlas' ? 'bg-blue-500/10 text-blue-600' :
          book.type === 'manual' ? 'bg-amber-500/10 text-amber-600' :
          book.type === 'complementar' ? 'bg-emerald-500/10 text-emerald-600' :
          'bg-purple-500/10 text-purple-600'
        }`}>
          {book.type === 'atlas' ? 'AT' : book.type === 'manual' ? 'MN' : book.type === 'consulta_rapida' ? 'QR' : 'RF'}
        </div>
        <div className="min-w-0 flex-1">
          <h5 className="text-sm font-medium text-foreground">{book.title}</h5>
          <p className="text-[10px] text-muted-foreground mt-0.5">{book.author}</p>
          {book.edition && (
            <p className="text-[10px] text-muted-foreground">{book.edition} — {book.publisher}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{book.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {book.discipline}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {book.yearRange.map(y => `${y}º`).join('-')} ano
            </span>
            {book.free && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                Gratuito
              </span>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            {book.purchaseUrl && (
              <a
                href={book.purchaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-primary hover:underline"
              >
                Comprar →
              </a>
            )}
            {book.freeUrl && (
              <a
                href={book.freeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] text-emerald-600 hover:underline"
              >
                Acesso gratuito →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceCard({ source }: { source: AcademicSource }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-sm transition-all"
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
          source.type === 'artigos' ? 'bg-blue-500/10' :
          source.type === 'teses' ? 'bg-purple-500/10' :
          source.type === 'livros' ? 'bg-amber-500/10' :
          source.type === 'diretrizes' ? 'bg-emerald-500/10' :
          source.type === 'periodicos' ? 'bg-red-500/10' :
          'bg-gray-500/10'
        }`}>
          {source.type === 'artigos' ? '📄' :
           source.type === 'teses' ? '📜' :
           source.type === 'livros' ? '📚' :
           source.type === 'diretrizes' ? '📋' :
           source.type === 'periodicos' ? '📰' :
           '🗄️'}
        </div>
        <div className="min-w-0 flex-1">
          <h5 className="text-sm font-medium text-foreground">{source.name}</h5>
          {source.institution && (
            <p className="text-[10px] text-primary font-medium">{source.institution}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{source.description}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
              {source.type}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground">
              {source.language === 'pt' ? 'Português' : source.language === 'en' ? 'Inglês' : 'Multilíngue'}
            </span>
            {source.free ? (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-medium">
                Acesso Aberto
              </span>
            ) : (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-medium">
                Acesso Institucional
              </span>
            )}
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground flex-shrink-0 mt-1">
          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
          <polyline points="15 3 21 3 21 9" />
          <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
      </div>
    </a>
  );
}

export default AcademicResourcesPanel;
