/**
 * MedFocus — Roadmap Visual da Jornada Médica (1° ao 6° Ano)
 * Guia visual interativo com fases, competências, habilidades e referências
 * Baseado nas DCN 2014 e grades curriculares reais
 */
import React, { useState } from 'react';
import { MEDICAL_ROADMAP, MEC_DATA, WORLD_RANKINGS_QS, type MedicalPhase, type WorldUniversity } from '../../data/universities';

interface RoadmapProps {
  onSelectYear?: (year: number) => void;
  currentYear?: number;
}

const MedicalRoadmap: React.FC<RoadmapProps> = ({ onSelectYear, currentYear = 1 }) => {
  const [expandedYear, setExpandedYear] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'mec' | 'world'>('roadmap');

  const toggleYear = (year: number) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Navigation */}
      <div className="flex gap-2 p-1.5 bg-muted/50 rounded-lg border border-border/50">
        {[
          { id: 'roadmap' as const, label: 'Jornada Médica', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
          { id: 'mec' as const, label: 'Dados MEC/ENAMED', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
          { id: 'world' as const, label: 'Rankings Mundiais', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-xs font-semibold transition-all ${
              activeTab === tab.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-card'
            }`}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d={tab.icon}/></svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ ROADMAP TAB ═══ */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          {/* Timeline Header */}
          <div className="bg-gradient-to-r from-primary/5 to-violet-500/5 border border-primary/20 rounded-xl p-5">
            <h2 className="text-lg font-display font-extrabold text-foreground mb-1">Jornada do 1° ao 6° Ano</h2>
            <p className="text-xs text-muted-foreground">Baseado nas Diretrizes Curriculares Nacionais (DCN 2014) e grades reais das principais faculdades de medicina do Brasil.</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

            {MEDICAL_ROADMAP.map((phase: MedicalPhase) => {
              const isExpanded = expandedYear === phase.year;
              const isCurrent = phase.year === currentYear;

              return (
                <div key={phase.year} className="relative mb-4">
                  {/* Timeline dot */}
                  <div className="absolute left-4 top-6 w-5 h-5 rounded-full border-2 border-background hidden md:flex items-center justify-center z-10"
                    style={{ backgroundColor: phase.color }}>
                    {isCurrent && <div className="w-2 h-2 rounded-full bg-white animate-pulse-soft" />}
                  </div>

                  {/* Card */}
                  <div className={`md:ml-14 bg-card border rounded-xl overflow-hidden transition-all ${
                    isCurrent ? 'border-primary shadow-lg' : 'border-border hover:border-primary/30'
                  }`}>
                    {/* Header */}
                    <button onClick={() => toggleYear(phase.year)}
                      className="w-full p-5 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${phase.color}15` }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={phase.color} strokeWidth="2">
                          <path d={phase.icon} />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-display font-bold text-foreground text-sm">{phase.title}</h3>
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider"
                            style={{ backgroundColor: `${phase.color}15`, color: phase.color }}>
                            {phase.phase}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-md text-[9px] font-bold uppercase tracking-wider">
                              Você está aqui
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{phase.description}</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                        className={`text-muted-foreground transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`}>
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-4 border-t border-border pt-4 animate-fade-in">
                        {/* Key Topics */}
                        <div>
                          <h4 className="text-xs font-display font-bold text-foreground mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-primary"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                            Disciplinas Principais
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.keyTopics.map((topic, i) => (
                              <span key={i} className="px-2.5 py-1 bg-muted rounded-md text-[10px] font-medium text-foreground/80">{topic}</span>
                            ))}
                          </div>
                        </div>

                        {/* Practical Focus */}
                        <div className="p-3 rounded-lg border-l-2" style={{ borderColor: phase.color, backgroundColor: `${phase.color}08` }}>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: phase.color }}>Foco Prático</h4>
                          <p className="text-xs text-foreground/80">{phase.practicalFocus}</p>
                        </div>

                        {/* Assessment Types */}
                        <div>
                          <h4 className="text-xs font-display font-bold text-foreground mb-2 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-amber-500"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            Avaliações
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {phase.assessmentTypes.map((type, i) => (
                              <span key={i} className="px-2.5 py-1 bg-amber-500/10 text-amber-700 rounded-md text-[10px] font-medium">{type}</span>
                            ))}
                          </div>
                        </div>

                        {/* CTA */}
                        {onSelectYear && (
                          <button onClick={() => onSelectYear(phase.year)}
                            className="w-full mt-2 py-2.5 rounded-lg text-xs font-semibold transition-all text-primary-foreground"
                            style={{ backgroundColor: phase.color }}>
                            Explorar Disciplinas do {phase.year}° Ano
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ MEC TAB ═══ */}
      {activeTab === 'mec' && (
        <div className="space-y-6">
          {/* MEC Overview */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-blue-500"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
              </div>
              <div>
                <h3 className="font-display font-bold text-foreground">Panorama MEC/ENAMED {MEC_DATA.year}</h3>
                <p className="text-xs text-muted-foreground">Dados oficiais do Ministério da Educação</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { label: 'Cursos de Medicina', value: MEC_DATA.totalCourses.toString(), color: 'text-blue-500' },
                { label: 'Avaliados', value: MEC_DATA.coursesEvaluated.toString(), color: 'text-emerald-500' },
                { label: 'Satisfatórios', value: MEC_DATA.satisfactory.toString(), color: 'text-green-500' },
                { label: 'Insatisfatórios', value: MEC_DATA.unsatisfactory.toString(), color: 'text-red-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-muted/50 rounded-lg p-3 text-center">
                  <p className={`text-2xl font-display font-extrabold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Estudantes que realizaram ENAMED</p>
                <p className="text-xl font-display font-extrabold text-primary">{MEC_DATA.totalStudents.toLocaleString('pt-BR')}</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground mb-1">Taxa de Proficiência</p>
                <p className="text-xl font-display font-extrabold text-emerald-500">{MEC_DATA.proficiencyRate}%</p>
              </div>
            </div>

            {/* DCN Info */}
            <div className="bg-muted/30 border border-border rounded-lg p-4">
              <h4 className="text-xs font-display font-bold text-foreground mb-2">Diretrizes Curriculares Nacionais</h4>
              <p className="text-xs text-muted-foreground mb-3">{MEC_DATA.dcnDescription}</p>
              <div className="space-y-1.5">
                {MEC_DATA.keyCompetencies.map((comp, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-foreground/80">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="text-primary shrink-0 mt-0.5"><path d="M5 13l4 4L19 7"/></svg>
                    {comp}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ WORLD RANKINGS TAB ═══ */}
      {activeTab === 'world' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-violet-500/5 to-blue-500/5 border border-violet-500/20 rounded-xl p-5">
            <h3 className="font-display font-bold text-foreground mb-1">Top 20 — QS World University Rankings 2025</h3>
            <p className="text-xs text-muted-foreground">Ranking mundial de faculdades de medicina. Referências para benchmarking e intercâmbio.</p>
          </div>

          <div className="space-y-2">
            {WORLD_RANKINGS_QS.map((uni: WorldUniversity) => (
              <WorldRankingCard key={uni.rank} uni={uni} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══ World Ranking Card ═══
const WorldRankingCard: React.FC<{ uni: WorldUniversity }> = ({ uni }) => {
  const [expanded, setExpanded] = useState(false);

  const medalColor = uni.rank <= 3 ? (uni.rank === 1 ? '#FFD700' : uni.rank === 2 ? '#C0C0C0' : '#CD7F32') : undefined;

  return (
    <div className={`bg-card border rounded-xl overflow-hidden transition-all ${expanded ? 'border-violet-500/50 shadow-md' : 'border-border hover:border-violet-500/30'}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full p-4 flex items-center gap-4 text-left hover:bg-muted/30 transition-colors">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-display font-extrabold text-sm"
          style={{ backgroundColor: medalColor ? `${medalColor}20` : 'var(--muted)', color: medalColor || 'var(--muted-foreground)' }}>
          #{uni.rank}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-display font-bold text-foreground text-sm truncate">{uni.name}</h4>
          <p className="text-[10px] text-muted-foreground">{uni.country} — Score: {uni.score}</p>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
          className={`text-muted-foreground transition-transform shrink-0 ${expanded ? 'rotate-180' : ''}`}>
          <path d="m6 9 6 6 6-6"/>
        </svg>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-border pt-3 animate-fade-in">
          <div>
            <h5 className="text-[10px] font-bold uppercase tracking-wider text-violet-500 mb-1.5">Pontos Fortes</h5>
            <div className="flex flex-wrap gap-1.5">
              {uni.strengths.map((s, i) => (
                <span key={i} className="px-2 py-0.5 bg-violet-500/10 text-violet-600 rounded-md text-[10px] font-medium">{s}</span>
              ))}
            </div>
          </div>
          <a href={uni.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-primary font-semibold hover:underline">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>
            Visitar site oficial
          </a>
        </div>
      )}
    </div>
  );
};

export default MedicalRoadmap;
