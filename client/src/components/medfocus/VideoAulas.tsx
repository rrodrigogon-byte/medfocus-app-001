/**
 * MedFocus — Vídeo-Aulas v2.0
 * Sistema de vídeo-aulas organizadas por disciplina e semestre
 * Com player, notas, transcrição e analytics de visualização
 */
import { useState, useMemo } from 'react';

interface VideoLesson {
  id: string;
  title: string;
  discipline: string;
  professor: string;
  duration: string;
  year: number;
  semester: number;
  description: string;
  topics: string[];
  thumbnail?: string;
  videoUrl?: string;
  views: number;
  rating: number;
  difficulty: 'basico' | 'intermediario' | 'avancado';
}

const VIDEO_LIBRARY: VideoLesson[] = [
  // Anatomia
  { id: 'v1', title: 'Anatomia do Coração — Câmaras e Valvas', discipline: 'Anatomia', professor: 'Prof. Dr. Silva', duration: '45:00', year: 1, semester: 1, description: 'Estudo detalhado das 4 câmaras cardíacas, valvas atrioventriculares e semilunares, com correlação clínica.', topics: ['Átrios', 'Ventrículos', 'Valva Mitral', 'Valva Aórtica', 'Coronárias'], views: 1250, rating: 4.8, difficulty: 'basico' },
  { id: 'v2', title: 'Neuroanatomia — Lobos Cerebrais e Áreas Funcionais', discipline: 'Anatomia', professor: 'Prof. Dr. Santos', duration: '52:00', year: 1, semester: 1, description: 'Lobos frontal, parietal, temporal e occipital. Áreas de Broca e Wernicke. Homúnculo motor e sensorial.', topics: ['Lobo Frontal', 'Lobo Parietal', 'Broca', 'Wernicke', 'Homúnculo'], views: 980, rating: 4.7, difficulty: 'intermediario' },
  { id: 'v3', title: 'Anatomia do Abdome — Peritônio e Vísceras', discipline: 'Anatomia', professor: 'Prof. Dr. Silva', duration: '38:00', year: 1, semester: 1, description: 'Cavidade peritoneal, órgãos intra e retroperitoneais, irrigação mesentérica.', topics: ['Peritônio', 'Estômago', 'Intestinos', 'Fígado', 'Pâncreas'], views: 870, rating: 4.6, difficulty: 'basico' },
  // Fisiologia
  { id: 'v4', title: 'Fisiologia Cardiovascular — Ciclo Cardíaco', discipline: 'Fisiologia', professor: 'Prof. Dra. Oliveira', duration: '50:00', year: 1, semester: 2, description: 'Sístole atrial, sístole ventricular, diástole. Curvas de pressão-volume. Frank-Starling.', topics: ['Ciclo Cardíaco', 'Débito Cardíaco', 'Frank-Starling', 'Pressão Arterial'], views: 1100, rating: 4.9, difficulty: 'intermediario' },
  { id: 'v5', title: 'Fisiologia Respiratória — Trocas Gasosas', discipline: 'Fisiologia', professor: 'Prof. Dra. Oliveira', duration: '42:00', year: 1, semester: 2, description: 'Ventilação alveolar, difusão, relação V/Q, transporte de O2 e CO2.', topics: ['Hematose', 'Curva de Dissociação', 'V/Q', 'Surfactante'], views: 920, rating: 4.7, difficulty: 'intermediario' },
  { id: 'v6', title: 'Fisiologia Renal — Filtração Glomerular', discipline: 'Fisiologia', professor: 'Prof. Dr. Costa', duration: '48:00', year: 1, semester: 2, description: 'TFG, forças de Starling no glomérulo, SRAA, ADH, mecanismo de contracorrente.', topics: ['TFG', 'SRAA', 'ADH', 'Néfron', 'Clearance'], views: 780, rating: 4.6, difficulty: 'avancado' },
  // Bioquímica
  { id: 'v7', title: 'Metabolismo de Carboidratos — Glicólise e Krebs', discipline: 'Bioquímica', professor: 'Prof. Dr. Lima', duration: '55:00', year: 1, semester: 1, description: 'Via glicolítica, piruvato desidrogenase, ciclo de Krebs, cadeia respiratória.', topics: ['Glicólise', 'Krebs', 'Cadeia Respiratória', 'ATP'], views: 650, rating: 4.5, difficulty: 'intermediario' },
  // Patologia
  { id: 'v8', title: 'Inflamação Aguda e Crônica', discipline: 'Patologia', professor: 'Prof. Dra. Mendes', duration: '47:00', year: 2, semester: 1, description: 'Mediadores inflamatórios, fases da inflamação, granulomas, reparo tecidual.', topics: ['Inflamação Aguda', 'Inflamação Crônica', 'Granuloma', 'Reparo'], views: 890, rating: 4.8, difficulty: 'intermediario' },
  { id: 'v9', title: 'Neoplasias — Carcinogênese e Estadiamento', discipline: 'Patologia', professor: 'Prof. Dra. Mendes', duration: '53:00', year: 2, semester: 1, description: 'Proto-oncogenes, genes supressores, TNM, marcadores tumorais.', topics: ['Carcinogênese', 'TNM', 'Marcadores', 'Metástase'], views: 1020, rating: 4.9, difficulty: 'avancado' },
  // Farmacologia
  { id: 'v10', title: 'Farmacologia do SNA — Colinérgicos e Adrenérgicos', discipline: 'Farmacologia', professor: 'Prof. Dr. Ferreira', duration: '50:00', year: 2, semester: 1, description: 'Receptores muscarínicos e nicotínicos, alfa e beta adrenérgicos, fármacos agonistas e antagonistas.', topics: ['Colinérgicos', 'Adrenérgicos', 'Receptores', 'Atropina', 'Adrenalina'], views: 760, rating: 4.7, difficulty: 'intermediario' },
  { id: 'v11', title: 'Antimicrobianos — Mecanismos e Resistência', discipline: 'Farmacologia', professor: 'Prof. Dr. Ferreira', duration: '58:00', year: 2, semester: 1, description: 'Beta-lactâmicos, quinolonas, aminoglicosídeos, macrolídeos. Mecanismos de resistência bacteriana.', topics: ['Beta-lactâmicos', 'Quinolonas', 'Resistência', 'Espectro'], views: 940, rating: 4.8, difficulty: 'avancado' },
  // Clínica Médica
  { id: 'v12', title: 'Cardiologia — Síndrome Coronariana Aguda', discipline: 'Clínica Médica', professor: 'Prof. Dr. Almeida', duration: '60:00', year: 3, semester: 2, description: 'IAM com e sem supra de ST, angina instável, diagnóstico, tratamento, reperfusão.', topics: ['IAMCSST', 'IAMSSST', 'Troponina', 'Cateterismo', 'Trombolítico'], views: 1350, rating: 4.9, difficulty: 'avancado' },
  { id: 'v13', title: 'Pneumologia — DPOC e Asma', discipline: 'Clínica Médica', professor: 'Prof. Dra. Ribeiro', duration: '45:00', year: 3, semester: 2, description: 'Diagnóstico diferencial, espirometria, classificação GOLD, tratamento escalonado.', topics: ['DPOC', 'Asma', 'Espirometria', 'GOLD', 'Broncodilatadores'], views: 880, rating: 4.7, difficulty: 'intermediario' },
  { id: 'v14', title: 'Endocrinologia — Diabetes Mellitus', discipline: 'Clínica Médica', professor: 'Prof. Dr. Almeida', duration: '55:00', year: 3, semester: 2, description: 'DM1 vs DM2, diagnóstico, HbA1c, tratamento, complicações crônicas.', topics: ['DM1', 'DM2', 'Insulina', 'Metformina', 'Complicações'], views: 1180, rating: 4.8, difficulty: 'intermediario' },
  // Cirurgia
  { id: 'v15', title: 'Abdome Agudo — Diagnóstico e Conduta', discipline: 'Cirurgia', professor: 'Prof. Dr. Pereira', duration: '48:00', year: 4, semester: 1, description: 'Abdome agudo inflamatório, obstrutivo, perfurativo, vascular e hemorrágico.', topics: ['Apendicite', 'Obstrução', 'Perfuração', 'FAST', 'Laparotomia'], views: 1050, rating: 4.8, difficulty: 'avancado' },
  { id: 'v16', title: 'Trauma — ATLS Simplificado', discipline: 'Cirurgia', professor: 'Prof. Dr. Pereira', duration: '62:00', year: 4, semester: 1, description: 'ABCDE do trauma, choque hemorrágico, trauma torácico e abdominal.', topics: ['ABCDE', 'Choque', 'FAST', 'Pneumotórax', 'Hemotórax'], views: 1420, rating: 4.9, difficulty: 'avancado' },
  // Pediatria
  { id: 'v17', title: 'Neonatologia — Reanimação Neonatal', discipline: 'Pediatria', professor: 'Prof. Dra. Campos', duration: '40:00', year: 4, semester: 1, description: 'Passos iniciais, VPP, intubação, massagem cardíaca, medicações.', topics: ['Apgar', 'VPP', 'Intubação', 'Surfactante'], views: 720, rating: 4.6, difficulty: 'avancado' },
  // GO
  { id: 'v18', title: 'Pré-eclâmpsia e Eclâmpsia', discipline: 'Ginecologia e Obstetrícia', professor: 'Prof. Dra. Martins', duration: '43:00', year: 4, semester: 2, description: 'Diagnóstico, classificação, manejo, MgSO4, indicação de parto.', topics: ['Pré-eclâmpsia', 'HELLP', 'MgSO4', 'Eclâmpsia'], views: 950, rating: 4.8, difficulty: 'avancado' },
  // Emergência
  { id: 'v19', title: 'ACLS — Parada Cardiorrespiratória', discipline: 'Emergência', professor: 'Prof. Dr. Souza', duration: '55:00', year: 5, semester: 2, description: 'Ritmos chocáveis e não-chocáveis, algoritmo ACLS, drogas, cuidados pós-PCR.', topics: ['FV/TV', 'Assistolia', 'AESP', 'Adrenalina', 'Amiodarona'], views: 1580, rating: 4.9, difficulty: 'avancado' },
  { id: 'v20', title: 'AVC Isquêmico — Diagnóstico e Trombólise', discipline: 'Emergência', professor: 'Prof. Dr. Souza', duration: '42:00', year: 5, semester: 2, description: 'NIHSS, janela terapêutica, trombolítico, trombectomia mecânica.', topics: ['AVC', 'NIHSS', 'Alteplase', 'Trombectomia', 'TC Crânio'], views: 1200, rating: 4.8, difficulty: 'avancado' },
];

const DISCIPLINES_LIST = [...new Set(VIDEO_LIBRARY.map(v => v.discipline))];

export default function VideoAulas() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'rating'>('popular');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showAnalytics, setShowAnalytics] = useState(false);

  const filteredVideos = useMemo(() => {
    let v = VIDEO_LIBRARY;
    if (selectedDiscipline) v = v.filter(x => x.discipline === selectedDiscipline);
    if (searchTerm) v = v.filter(x => x.title.toLowerCase().includes(searchTerm.toLowerCase()) || x.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    if (sortBy === 'popular') v = [...v].sort((a, b) => b.views - a.views);
    if (sortBy === 'rating') v = [...v].sort((a, b) => b.rating - a.rating);
    return v;
  }, [selectedDiscipline, searchTerm, sortBy]);

  const currentVideo = VIDEO_LIBRARY.find(v => v.id === selectedVideo);
  const totalViews = VIDEO_LIBRARY.reduce((s, v) => s + v.views, 0);

  // Analytics data
  const disciplineStats = useMemo(() => {
    const stats: Record<string, { count: number; views: number; avgRating: number }> = {};
    VIDEO_LIBRARY.forEach(v => {
      if (!stats[v.discipline]) stats[v.discipline] = { count: 0, views: 0, avgRating: 0 };
      stats[v.discipline].count++;
      stats[v.discipline].views += v.views;
      stats[v.discipline].avgRating += v.rating;
    });
    Object.keys(stats).forEach(k => stats[k].avgRating /= stats[k].count);
    return stats;
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">🎬</span> Vídeo-Aulas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{VIDEO_LIBRARY.length} aulas • {DISCIPLINES_LIST.length} disciplinas • {totalViews.toLocaleString()} visualizações</p>
        </div>
        <button onClick={() => setShowAnalytics(!showAnalytics)} className="px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 text-xs hover:bg-blue-500/30">
          📊 Analytics
        </button>
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="mb-6 p-4 rounded-xl bg-card border border-border">
          <h3 className="font-bold text-sm mb-3">📊 Analytics de Vídeo-Aulas</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div className="p-3 rounded-lg bg-blue-500/10 text-center">
              <div className="text-2xl font-bold text-blue-400">{VIDEO_LIBRARY.length}</div>
              <div className="text-xs text-muted-foreground">Total de Aulas</div>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 text-center">
              <div className="text-2xl font-bold text-green-400">{totalViews.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Visualizações</div>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500/10 text-center">
              <div className="text-2xl font-bold text-yellow-400">{(VIDEO_LIBRARY.reduce((s, v) => s + v.rating, 0) / VIDEO_LIBRARY.length).toFixed(1)}</div>
              <div className="text-xs text-muted-foreground">Nota Média</div>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10 text-center">
              <div className="text-2xl font-bold text-purple-400">{DISCIPLINES_LIST.length}</div>
              <div className="text-xs text-muted-foreground">Disciplinas</div>
            </div>
          </div>
          <h4 className="text-xs font-semibold mb-2">Por Disciplina</h4>
          <div className="space-y-2">
            {Object.entries(disciplineStats).sort((a, b) => b[1].views - a[1].views).map(([disc, stats]) => (
              <div key={disc} className="flex items-center gap-3">
                <div className="w-32 text-xs truncate">{disc}</div>
                <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(stats.views / Math.max(...Object.values(disciplineStats).map(s => s.views))) * 100}%` }} />
                </div>
                <div className="text-xs text-muted-foreground w-20 text-right">{stats.views.toLocaleString()} views</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input type="text" placeholder="🔍 Buscar aula ou tópico..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none" />
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
          className="px-3 py-2.5 rounded-xl bg-card border border-border text-sm">
          <option value="popular">Mais Populares</option>
          <option value="rating">Melhor Avaliadas</option>
          <option value="recent">Mais Recentes</option>
        </select>
      </div>

      {/* Discipline filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => setSelectedDiscipline(null)}
          className={`px-3 py-1.5 rounded-lg text-xs ${!selectedDiscipline ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
          Todas
        </button>
        {DISCIPLINES_LIST.map(d => (
          <button key={d} onClick={() => setSelectedDiscipline(selectedDiscipline === d ? null : d)}
            className={`px-3 py-1.5 rounded-lg text-xs ${selectedDiscipline === d ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
            {d}
          </button>
        ))}
      </div>

      {/* Video player */}
      {currentVideo && (
        <div className="mb-6 p-5 rounded-xl bg-card border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{currentVideo.title}</h2>
            <button onClick={() => setSelectedVideo(null)} className="text-xs text-muted-foreground hover:text-foreground">✕ Fechar</button>
          </div>
          {/* Video placeholder */}
          <div className="w-full aspect-video bg-black rounded-xl flex items-center justify-center">
            <div className="text-center">
              <span className="text-6xl">▶️</span>
              <p className="text-white/60 mt-3 text-sm">Player de Vídeo</p>
              <p className="text-white/40 text-xs mt-1">Duração: {currentVideo.duration}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400">{currentVideo.discipline}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400">{currentVideo.rating} ⭐</span>
                <span className="text-xs text-muted-foreground">{currentVideo.views.toLocaleString()} views</span>
              </div>
              <p className="text-sm text-muted-foreground">{currentVideo.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {currentVideo.topics.map((t, i) => <span key={i} className="px-2 py-0.5 rounded-full bg-accent text-[10px]">{t}</span>)}
              </div>
              <p className="text-xs text-muted-foreground mt-2">👨‍🏫 {currentVideo.professor} • {currentVideo.year}º Ano</p>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-primary mb-1">📝 Minhas Anotações</h4>
              <textarea
                value={notes[currentVideo.id] || ''}
                onChange={e => setNotes(prev => ({ ...prev, [currentVideo.id]: e.target.value }))}
                placeholder="Faça suas anotações aqui..."
                className="w-full h-32 px-3 py-2 rounded-lg bg-accent border border-border text-xs resize-none focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Video grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map(video => (
          <button key={video.id} onClick={() => setSelectedVideo(video.id)}
            className={`p-4 rounded-xl text-left transition-all hover:shadow-lg ${selectedVideo === video.id ? 'bg-primary/10 border-primary border-2' : 'bg-card border border-border hover:bg-accent'}`}>
            {/* Thumbnail */}
            <div className="w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-3 flex items-center justify-center relative">
              <span className="text-4xl opacity-50">🎬</span>
              <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px]">{video.duration}</div>
              <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px]" style={{
                backgroundColor: video.difficulty === 'basico' ? '#22c55e20' : video.difficulty === 'intermediario' ? '#f59e0b20' : '#ef444420',
                color: video.difficulty === 'basico' ? '#22c55e' : video.difficulty === 'intermediario' ? '#f59e0b' : '#ef4444'
              }}>
                {video.difficulty === 'basico' ? 'Básico' : video.difficulty === 'intermediario' ? 'Intermediário' : 'Avançado'}
              </div>
            </div>
            <div className="font-medium text-sm line-clamp-2">{video.title}</div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-muted-foreground">{video.professor}</span>
              <span className="text-[10px] text-muted-foreground">•</span>
              <span className="text-[10px] text-muted-foreground">{video.views.toLocaleString()} views</span>
              <span className="text-[10px] text-yellow-400">{video.rating} ⭐</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent">{video.discipline}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent">{video.year}º Ano</span>
            </div>
          </button>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="flex items-center justify-center h-48 rounded-xl bg-card border border-border">
          <div className="text-center"><span className="text-4xl">🔍</span><p className="text-muted-foreground mt-2 text-sm">Nenhuma aula encontrada</p></div>
        </div>
      )}
    </div>
  );
}
