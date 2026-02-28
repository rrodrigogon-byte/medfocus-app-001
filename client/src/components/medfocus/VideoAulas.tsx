/**
 * MedFocus — Vídeo-Aulas Colaborativas v3.0
 * Sistema de vídeo-aulas com upload por professores, aprovação, rating e notas.
 * Suporta vídeos locais (GCS) e links externos (YouTube, Vimeo).
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Play, Upload, Search, Filter, Star, Clock, Eye, ThumbsUp,
  ChevronDown, ChevronUp, Send, CheckCircle2, XCircle, Loader2,
  BarChart3, GraduationCap, BookOpen, ExternalLink, MessageSquare,
  Video, FileVideo, Link2, AlertCircle, Shield
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
interface VideoLesson {
  id: string | number;
  title: string;
  discipline: string;
  professor: string;
  professorId?: number;
  duration: string;
  year: number;
  semester: number;
  description: string;
  topics: string[];
  thumbnail?: string;
  videoUrl?: string;
  externalLink?: string;
  views: number;
  likes: number;
  rating: number;
  ratingCount: number;
  difficulty: 'basico' | 'intermediario' | 'avancado';
  status: 'pending' | 'approved' | 'rejected' | 'archived';
  createdAt?: string;
  source: 'local' | 'db';
}

// ─── Built-in Video Library ──────────────────────────────────
const BUILTIN_VIDEOS: VideoLesson[] = [
  { id: 'v1', title: 'Anatomia do Coração — Câmaras e Valvas', discipline: 'Anatomia', professor: 'Prof. Dr. Silva', duration: '45:00', year: 1, semester: 1, description: 'Estudo detalhado das 4 câmaras cardíacas, valvas atrioventriculares e semilunares, com correlação clínica.', topics: ['Átrios', 'Ventrículos', 'Valva Mitral', 'Valva Aórtica', 'Coronárias'], views: 1250, likes: 89, rating: 4.8, ratingCount: 45, difficulty: 'basico', status: 'approved', source: 'local' },
  { id: 'v2', title: 'Neuroanatomia — Lobos Cerebrais e Áreas Funcionais', discipline: 'Anatomia', professor: 'Prof. Dr. Santos', duration: '52:00', year: 1, semester: 1, description: 'Lobos frontal, parietal, temporal e occipital. Áreas de Broca e Wernicke. Homúnculo motor e sensorial.', topics: ['Lobo Frontal', 'Lobo Parietal', 'Broca', 'Wernicke', 'Homúnculo'], views: 980, likes: 72, rating: 4.7, ratingCount: 38, difficulty: 'intermediario', status: 'approved', source: 'local' },
  { id: 'v3', title: 'Anatomia do Abdome — Peritônio e Vísceras', discipline: 'Anatomia', professor: 'Prof. Dr. Silva', duration: '38:00', year: 1, semester: 1, description: 'Cavidade peritoneal, órgãos intra e retroperitoneais, irrigação mesentérica.', topics: ['Peritônio', 'Estômago', 'Intestinos', 'Fígado', 'Pâncreas'], views: 870, likes: 56, rating: 4.6, ratingCount: 32, difficulty: 'basico', status: 'approved', source: 'local' },
  { id: 'v4', title: 'Fisiologia Cardiovascular — Ciclo Cardíaco', discipline: 'Fisiologia', professor: 'Prof. Dra. Oliveira', duration: '50:00', year: 1, semester: 2, description: 'Sístole atrial, sístole ventricular, diástole. Curvas de pressão-volume. Frank-Starling.', topics: ['Ciclo Cardíaco', 'Débito Cardíaco', 'Frank-Starling', 'Pressão Arterial'], views: 1100, likes: 95, rating: 4.9, ratingCount: 52, difficulty: 'intermediario', status: 'approved', source: 'local' },
  { id: 'v5', title: 'Fisiologia Respiratória — Trocas Gasosas', discipline: 'Fisiologia', professor: 'Prof. Dra. Oliveira', duration: '42:00', year: 1, semester: 2, description: 'Ventilação alveolar, difusão, relação V/Q, transporte de O2 e CO2.', topics: ['Hematose', 'Curva de Dissociação', 'V/Q', 'Surfactante'], views: 920, likes: 67, rating: 4.7, ratingCount: 35, difficulty: 'intermediario', status: 'approved', source: 'local' },
  { id: 'v6', title: 'Fisiologia Renal — Filtração Glomerular', discipline: 'Fisiologia', professor: 'Prof. Dr. Costa', duration: '48:00', year: 1, semester: 2, description: 'TFG, forças de Starling no glomérulo, SRAA, ADH, mecanismo de contracorrente.', topics: ['TFG', 'SRAA', 'ADH', 'Néfron', 'Clearance'], views: 780, likes: 48, rating: 4.6, ratingCount: 28, difficulty: 'avancado', status: 'approved', source: 'local' },
  { id: 'v7', title: 'Metabolismo de Carboidratos — Glicólise e Krebs', discipline: 'Bioquímica', professor: 'Prof. Dr. Lima', duration: '55:00', year: 1, semester: 1, description: 'Via glicolítica, piruvato desidrogenase, ciclo de Krebs, cadeia respiratória.', topics: ['Glicólise', 'Krebs', 'Cadeia Respiratória', 'ATP'], views: 650, likes: 42, rating: 4.5, ratingCount: 25, difficulty: 'intermediario', status: 'approved', source: 'local' },
  { id: 'v8', title: 'Inflamação Aguda e Crônica', discipline: 'Patologia', professor: 'Prof. Dra. Mendes', duration: '47:00', year: 2, semester: 1, description: 'Mediadores inflamatórios, fases da inflamação, granulomas, reparo tecidual.', topics: ['Inflamação Aguda', 'Inflamação Crônica', 'Granuloma', 'Reparo'], views: 890, likes: 63, rating: 4.8, ratingCount: 40, difficulty: 'intermediario', status: 'approved', source: 'local' },
  { id: 'v9', title: 'Neoplasias — Carcinogênese e Estadiamento', discipline: 'Patologia', professor: 'Prof. Dra. Mendes', duration: '53:00', year: 2, semester: 1, description: 'Proto-oncogenes, genes supressores, TNM, marcadores tumorais.', topics: ['Carcinogênese', 'TNM', 'Marcadores', 'Metástase'], views: 1020, likes: 78, rating: 4.9, ratingCount: 48, difficulty: 'avancado', status: 'approved', source: 'local' },
  { id: 'v10', title: 'Farmacologia do SNA — Colinérgicos e Adrenérgicos', discipline: 'Farmacologia', professor: 'Prof. Dr. Ferreira', duration: '50:00', year: 2, semester: 1, description: 'Receptores muscarínicos e nicotínicos, alfa e beta adrenérgicos, fármacos agonistas e antagonistas.', topics: ['Colinérgicos', 'Adrenérgicos', 'Receptores', 'Atropina', 'Adrenalina'], views: 760, likes: 55, rating: 4.7, ratingCount: 33, difficulty: 'intermediario', status: 'approved', source: 'local' },
  { id: 'v11', title: 'Antimicrobianos — Mecanismos e Resistência', discipline: 'Farmacologia', professor: 'Prof. Dr. Ferreira', duration: '58:00', year: 2, semester: 1, description: 'Beta-lactâmicos, quinolonas, aminoglicosídeos, macrolídeos. Mecanismos de resistência bacteriana.', topics: ['Beta-lactâmicos', 'Quinolonas', 'Resistência', 'Espectro'], views: 940, likes: 71, rating: 4.8, ratingCount: 42, difficulty: 'avancado', status: 'approved', source: 'local' },
  { id: 'v12', title: 'Cardiologia — Síndrome Coronariana Aguda', discipline: 'Clínica Médica', professor: 'Prof. Dr. Almeida', duration: '60:00', year: 3, semester: 2, description: 'IAM com e sem supra de ST, angina instável, diagnóstico, tratamento, reperfusão.', topics: ['IAMCSST', 'IAMSSST', 'Troponina', 'Cateterismo', 'Trombolítico'], views: 1350, likes: 112, rating: 4.9, ratingCount: 58, difficulty: 'avancado', status: 'approved', source: 'local' },
  { id: 'v13', title: 'Pneumologia — DPOC e Asma', discipline: 'Clínica Médica', professor: 'Prof. Dra. Ribeiro', duration: '45:00', year: 3, semester: 2, description: 'Diagnóstico diferencial, espirometria, classificação GOLD, tratamento escalonado.', topics: ['DPOC', 'Asma', 'Espirometria', 'GOLD', 'Broncodilatadores'], views: 880, likes: 64, rating: 4.7, ratingCount: 36, difficulty: 'intermediario', status: 'approved', source: 'local' },
  { id: 'v14', title: 'Endocrinologia — Diabetes Mellitus', discipline: 'Clínica Médica', professor: 'Prof. Dr. Almeida', duration: '55:00', year: 3, semester: 2, description: 'DM1 vs DM2, diagnóstico, HbA1c, tratamento, complicações crônicas.', topics: ['DM1', 'DM2', 'Insulina', 'Metformina', 'Complicações'], views: 1180, likes: 88, rating: 4.8, ratingCount: 45, difficulty: 'intermediario', status: 'approved', source: 'local' },
  { id: 'v15', title: 'Abdome Agudo — Diagnóstico e Conduta', discipline: 'Cirurgia', professor: 'Prof. Dr. Pereira', duration: '48:00', year: 4, semester: 1, description: 'Abdome agudo inflamatório, obstrutivo, perfurativo, vascular e hemorrágico.', topics: ['Apendicite', 'Obstrução', 'Perfuração', 'FAST', 'Laparotomia'], views: 1050, likes: 79, rating: 4.8, ratingCount: 43, difficulty: 'avancado', status: 'approved', source: 'local' },
  { id: 'v16', title: 'Trauma — ATLS Simplificado', discipline: 'Cirurgia', professor: 'Prof. Dr. Pereira', duration: '62:00', year: 4, semester: 1, description: 'ABCDE do trauma, choque hemorrágico, trauma torácico e abdominal.', topics: ['ABCDE', 'Choque', 'FAST', 'Pneumotórax', 'Hemotórax'], views: 1420, likes: 118, rating: 4.9, ratingCount: 62, difficulty: 'avancado', status: 'approved', source: 'local' },
  { id: 'v17', title: 'Neonatologia — Reanimação Neonatal', discipline: 'Pediatria', professor: 'Prof. Dra. Campos', duration: '40:00', year: 4, semester: 1, description: 'Passos iniciais, VPP, intubação, massagem cardíaca, medicações.', topics: ['Apgar', 'VPP', 'Intubação', 'Surfactante'], views: 720, likes: 45, rating: 4.6, ratingCount: 26, difficulty: 'avancado', status: 'approved', source: 'local' },
  { id: 'v18', title: 'Pré-eclâmpsia e Eclâmpsia', discipline: 'Ginecologia e Obstetrícia', professor: 'Prof. Dra. Martins', duration: '43:00', year: 4, semester: 2, description: 'Diagnóstico, classificação, manejo, MgSO4, indicação de parto.', topics: ['Pré-eclâmpsia', 'HELLP', 'MgSO4', 'Eclâmpsia'], views: 950, likes: 68, rating: 4.8, ratingCount: 39, difficulty: 'avancado', status: 'approved', source: 'local' },
  { id: 'v19', title: 'ACLS — Parada Cardiorrespiratória', discipline: 'Emergência', professor: 'Prof. Dr. Souza', duration: '55:00', year: 5, semester: 2, description: 'Ritmos chocáveis e não-chocáveis, algoritmo ACLS, drogas, cuidados pós-PCR.', topics: ['FV/TV', 'Assistolia', 'AESP', 'Adrenalina', 'Amiodarona'], views: 1580, likes: 132, rating: 4.9, ratingCount: 68, difficulty: 'avancado', status: 'approved', source: 'local' },
  { id: 'v20', title: 'AVC Isquêmico — Diagnóstico e Trombólise', discipline: 'Emergência', professor: 'Prof. Dr. Souza', duration: '42:00', year: 5, semester: 2, description: 'NIHSS, janela terapêutica, trombolítico, trombectomia mecânica.', topics: ['AVC', 'NIHSS', 'Alteplase', 'Trombectomia', 'TC Crânio'], views: 1200, likes: 92, rating: 4.8, ratingCount: 50, difficulty: 'avancado', status: 'approved', source: 'local' },
];

const DISCIPLINES = [...new Set(BUILTIN_VIDEOS.map(v => v.discipline))];
const DIFFICULTY_LABELS = { basico: 'Básico', intermediario: 'Intermediário', avancado: 'Avançado' };
const DIFFICULTY_COLORS = { basico: 'bg-green-500/20 text-green-400', intermediario: 'bg-yellow-500/20 text-yellow-400', avancado: 'bg-red-500/20 text-red-400' };
const STATUS_LABELS = { pending: 'Pendente', approved: 'Aprovado', rejected: 'Rejeitado', archived: 'Arquivado' };
const STATUS_COLORS = { pending: 'bg-yellow-500/20 text-yellow-400', approved: 'bg-green-500/20 text-green-400', rejected: 'bg-red-500/20 text-red-400', archived: 'bg-gray-500/20 text-gray-400' };

// ─── Component ───────────────────────────────────────────────
export default function VideoAulas() {
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoLesson | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'recent'>('popular');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showPending, setShowPending] = useState(false);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '', discipline: '', professor: '', description: '',
    year: 1, semester: 1, difficulty: 'intermediario' as const,
    topics: '', externalLink: '', duration: '',
  });
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

  // DB videos state
  const [dbVideos, setDbVideos] = useState<VideoLesson[]>([]);
  const [dbLoading, setDbLoading] = useState(false);

  // Fetch DB videos
  const fetchDbVideos = useCallback(async () => {
    setDbLoading(true);
    try {
      const res = await fetch('/api/videos?status=approved');
      if (res.ok) {
        const data = await res.json();
        setDbVideos(data.videos || []);
      }
    } catch {
      // Silently fail — builtin videos are always available
    } finally {
      setDbLoading(false);
    }
  }, []);

  useEffect(() => { fetchDbVideos(); }, []);

  // Combine builtin + DB videos
  const allVideos = useMemo(() => {
    return [...BUILTIN_VIDEOS, ...dbVideos.map(v => ({ ...v, source: 'db' as const }))];
  }, [dbVideos]);

  const filteredVideos = useMemo(() => {
    let v = allVideos.filter(x => x.status === 'approved');
    if (selectedDiscipline) v = v.filter(x => x.discipline === selectedDiscipline);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      v = v.filter(x =>
        x.title.toLowerCase().includes(q) ||
        x.professor.toLowerCase().includes(q) ||
        x.topics.some(t => t.toLowerCase().includes(q)) ||
        x.description.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'popular') v = [...v].sort((a, b) => b.views - a.views);
    if (sortBy === 'rating') v = [...v].sort((a, b) => b.rating - a.rating);
    return v;
  }, [allVideos, selectedDiscipline, searchTerm, sortBy]);

  const totalViews = allVideos.reduce((s, v) => s + v.views, 0);
  const allDisciplines = [...new Set(allVideos.map(v => v.discipline))];

  // Handle video upload/submit
  const handleSubmitVideo = async () => {
    if (!uploadForm.title || !uploadForm.discipline || !uploadForm.professor) return;
    setUploadStatus('uploading');
    try {
      const res = await fetch('/api/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...uploadForm,
          topics: uploadForm.topics.split(',').map(t => t.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        setUploadStatus('success');
        setUploadForm({ title: '', discipline: '', professor: '', description: '', year: 1, semester: 1, difficulty: 'intermediario', topics: '', externalLink: '', duration: '' });
        setTimeout(() => { setUploadStatus('idle'); setShowUploadForm(false); }, 2000);
      } else {
        setUploadStatus('error');
      }
    } catch {
      setUploadStatus('error');
    }
  };

  // Analytics
  const disciplineStats = useMemo(() => {
    const stats: Record<string, { count: number; views: number; avgRating: number }> = {};
    allVideos.filter(v => v.status === 'approved').forEach(v => {
      if (!stats[v.discipline]) stats[v.discipline] = { count: 0, views: 0, avgRating: 0 };
      stats[v.discipline].count++;
      stats[v.discipline].views += v.views;
      stats[v.discipline].avgRating += v.rating;
    });
    Object.keys(stats).forEach(k => stats[k].avgRating = stats[k].count > 0 ? stats[k].avgRating / stats[k].count : 0);
    return stats;
  }, [allVideos]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <Video className="w-8 h-8 text-primary" /> Vídeo-Aulas Colaborativas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {allVideos.filter(v => v.status === 'approved').length} aulas aprovadas — {allDisciplines.length} disciplinas — {totalViews.toLocaleString()} visualizações
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowAnalytics(!showAnalytics)} className="gap-1">
            <BarChart3 className="w-4 h-4" /> Analytics
          </Button>
          <Button size="sm" onClick={() => setShowUploadForm(!showUploadForm)} className="gap-1">
            <Upload className="w-4 h-4" /> Enviar Aula
          </Button>
        </div>
      </div>

      {/* Upload Form */}
      {showUploadForm && (
        <Card className="mb-6 border-primary/30">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FileVideo className="w-5 h-5 text-primary" /> Enviar Nova Vídeo-Aula
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setShowUploadForm(false)}>Fechar</Button>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-sm text-blue-400 flex items-start gap-2">
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Vídeos enviados passam por aprovação antes de ficarem disponíveis. Professores e monitores podem contribuir com conteúdo educacional.</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Título da aula *" value={uploadForm.title}
                onChange={e => setUploadForm(p => ({ ...p, title: e.target.value }))}
                className="w-full p-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground" />
              <input type="text" placeholder="Nome do Professor *" value={uploadForm.professor}
                onChange={e => setUploadForm(p => ({ ...p, professor: e.target.value }))}
                className="w-full p-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground" />
              <select value={uploadForm.discipline}
                onChange={e => setUploadForm(p => ({ ...p, discipline: e.target.value }))}
                className="w-full p-3 bg-background border border-border rounded-xl text-foreground">
                <option value="">Disciplina *</option>
                {DISCIPLINES.map(d => <option key={d} value={d}>{d}</option>)}
                <option value="Histologia">Histologia</option>
                <option value="Microbiologia">Microbiologia</option>
                <option value="Imunologia">Imunologia</option>
                <option value="Parasitologia">Parasitologia</option>
                <option value="Genética">Genética</option>
                <option value="Saúde Coletiva">Saúde Coletiva</option>
                <option value="Psiquiatria">Psiquiatria</option>
                <option value="Dermatologia">Dermatologia</option>
                <option value="Oftalmologia">Oftalmologia</option>
                <option value="Otorrinolaringologia">Otorrinolaringologia</option>
              </select>
              <select value={uploadForm.difficulty}
                onChange={e => setUploadForm(p => ({ ...p, difficulty: e.target.value as any }))}
                className="w-full p-3 bg-background border border-border rounded-xl text-foreground">
                <option value="basico">Básico</option>
                <option value="intermediario">Intermediário</option>
                <option value="avancado">Avançado</option>
              </select>
              <div className="flex gap-2">
                <select value={uploadForm.year}
                  onChange={e => setUploadForm(p => ({ ...p, year: Number(e.target.value) }))}
                  className="flex-1 p-3 bg-background border border-border rounded-xl text-foreground">
                  {[1,2,3,4,5,6].map(y => <option key={y} value={y}>{y}° Ano</option>)}
                </select>
                <select value={uploadForm.semester}
                  onChange={e => setUploadForm(p => ({ ...p, semester: Number(e.target.value) }))}
                  className="flex-1 p-3 bg-background border border-border rounded-xl text-foreground">
                  <option value={1}>1° Semestre</option>
                  <option value={2}>2° Semestre</option>
                </select>
              </div>
              <input type="text" placeholder="Duração (ex: 45:00)" value={uploadForm.duration}
                onChange={e => setUploadForm(p => ({ ...p, duration: e.target.value }))}
                className="w-full p-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground" />
            </div>

            <textarea placeholder="Descrição da aula..." value={uploadForm.description}
              onChange={e => setUploadForm(p => ({ ...p, description: e.target.value }))}
              className="w-full p-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground h-24 resize-none" />

            <input type="text" placeholder="Tópicos (separados por vírgula)" value={uploadForm.topics}
              onChange={e => setUploadForm(p => ({ ...p, topics: e.target.value }))}
              className="w-full p-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground" />

            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-muted-foreground" />
              <input type="url" placeholder="Link do vídeo (YouTube, Vimeo, Google Drive...)" value={uploadForm.externalLink}
                onChange={e => setUploadForm(p => ({ ...p, externalLink: e.target.value }))}
                className="flex-1 p-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground" />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowUploadForm(false)}>Cancelar</Button>
              <Button onClick={handleSubmitVideo} disabled={uploadStatus === 'uploading' || !uploadForm.title || !uploadForm.discipline || !uploadForm.professor} className="gap-2">
                {uploadStatus === 'uploading' ? <Loader2 className="w-4 h-4 animate-spin" /> :
                 uploadStatus === 'success' ? <CheckCircle2 className="w-4 h-4" /> :
                 <Send className="w-4 h-4" />}
                {uploadStatus === 'uploading' ? 'Enviando...' :
                 uploadStatus === 'success' ? 'Enviado!' :
                 uploadStatus === 'error' ? 'Erro — Tentar novamente' :
                 'Enviar para Aprovação'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Panel */}
      {showAnalytics && (
        <Card className="mb-6">
          <CardContent className="p-5">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> Analytics de Vídeo-Aulas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-3 rounded-lg bg-blue-500/10 text-center">
                <div className="text-2xl font-bold text-blue-400">{allVideos.filter(v => v.status === 'approved').length}</div>
                <div className="text-xs text-muted-foreground">Total de Aulas</div>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 text-center">
                <div className="text-2xl font-bold text-green-400">{totalViews.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Visualizações</div>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500/10 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {(allVideos.filter(v => v.status === 'approved').reduce((s, v) => s + v.rating, 0) / Math.max(allVideos.filter(v => v.status === 'approved').length, 1)).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">Nota Média</div>
              </div>
              <div className="p-3 rounded-lg bg-purple-500/10 text-center">
                <div className="text-2xl font-bold text-purple-400">{allDisciplines.length}</div>
                <div className="text-xs text-muted-foreground">Disciplinas</div>
              </div>
            </div>
            <h4 className="text-xs font-semibold mb-2">Por Disciplina</h4>
            <div className="space-y-2">
              {Object.entries(disciplineStats).sort((a, b) => b[1].views - a[1].views).map(([disc, stats]) => (
                <div key={disc} className="flex items-center gap-3">
                  <div className="w-36 text-xs truncate">{disc}</div>
                  <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(stats.views / Math.max(...Object.values(disciplineStats).map(s => s.views), 1)) * 100}%` }} />
                  </div>
                  <div className="text-xs text-muted-foreground w-24 text-right">{stats.count} aulas • {stats.views.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar aula, professor ou tópico..."
            value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
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
          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${!selectedDiscipline ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
          Todas
        </button>
        {allDisciplines.map(d => (
          <button key={d} onClick={() => setSelectedDiscipline(selectedDiscipline === d ? null : d)}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${selectedDiscipline === d ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
            {d}
          </button>
        ))}
      </div>

      {/* Video player */}
      {selectedVideo && (
        <Card className="mb-6 border-primary/30">
          <CardContent className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{selectedVideo.title}</h2>
              <Button variant="ghost" size="sm" onClick={() => setSelectedVideo(null)}>Fechar</Button>
            </div>

            {/* Video embed or placeholder */}
            <div className="w-full aspect-video bg-black rounded-xl flex items-center justify-center overflow-hidden">
              {selectedVideo.externalLink && selectedVideo.externalLink.includes('youtube') ? (
                <iframe
                  src={selectedVideo.externalLink.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full" allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              ) : selectedVideo.videoUrl ? (
                <video src={selectedVideo.videoUrl} controls className="w-full h-full" />
              ) : (
                <div className="text-center">
                  <Play className="w-16 h-16 text-white/30 mx-auto" />
                  <p className="text-white/60 mt-3 text-sm">Player de Vídeo</p>
                  <p className="text-white/40 text-xs mt-1">Duração: {selectedVideo.duration}</p>
                  {selectedVideo.externalLink && (
                    <a href={selectedVideo.externalLink} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary text-sm mt-3 hover:underline">
                      <ExternalLink className="w-4 h-4" /> Abrir link externo
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <Badge className={DIFFICULTY_COLORS[selectedVideo.difficulty]}>{DIFFICULTY_LABELS[selectedVideo.difficulty]}</Badge>
                  <Badge variant="outline">{selectedVideo.discipline}</Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{selectedVideo.rating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">({selectedVideo.ratingCount})</span>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Eye className="w-3 h-3" />{selectedVideo.views.toLocaleString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">{selectedVideo.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedVideo.topics.map((t, i) => <Badge key={i} variant="secondary" className="text-xs">{t}</Badge>)}
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> {selectedVideo.professor} — {selectedVideo.year}° Ano, {selectedVideo.semester}° Semestre
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-primary mb-1 flex items-center gap-1">
                  <BookOpen className="w-3 h-3" /> Minhas Anotações
                </h4>
                <textarea
                  value={notes[String(selectedVideo.id)] || ''}
                  onChange={e => setNotes(prev => ({ ...prev, [String(selectedVideo.id)]: e.target.value }))}
                  placeholder="Faça suas anotações aqui..."
                  className="w-full h-32 px-3 py-2 rounded-lg bg-accent border border-border text-xs resize-none focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVideos.map(video => (
          <Card key={video.id} className={`cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 ${selectedVideo?.id === video.id ? 'border-primary border-2' : ''}`}
            onClick={() => setSelectedVideo(video)}>
            <CardContent className="p-4">
              {/* Thumbnail */}
              <div className="w-full aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-3 flex items-center justify-center relative">
                <Play className="w-10 h-10 text-white/30" />
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-white text-[10px] flex items-center gap-1">
                  <Clock className="w-3 h-3" />{video.duration}
                </div>
                <Badge className={`absolute top-2 left-2 text-[10px] ${DIFFICULTY_COLORS[video.difficulty]}`}>
                  {DIFFICULTY_LABELS[video.difficulty]}
                </Badge>
                {video.source === 'db' && (
                  <Badge className="absolute top-2 right-2 text-[10px] bg-primary/20 text-primary">Colaborativo</Badge>
                )}
              </div>
              <div className="font-medium text-sm line-clamp-2">{video.title}</div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[10px] text-muted-foreground">{video.professor}</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><Eye className="w-3 h-3" />{video.views.toLocaleString()}</span>
                <span className="text-[10px] text-yellow-400 flex items-center gap-0.5"><Star className="w-3 h-3 fill-yellow-400" />{video.rating.toFixed(1)}</span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" />{video.likes}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="outline" className="text-[10px]">{video.discipline}</Badge>
                <Badge variant="outline" className="text-[10px]">{video.year}° Ano</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="flex items-center justify-center h-48 rounded-xl bg-card border border-border">
          <div className="text-center">
            <Video className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mt-2 text-sm">Nenhuma aula encontrada</p>
            <p className="text-xs text-muted-foreground mt-1">Tente ajustar os filtros ou contribua enviando uma aula</p>
          </div>
        </div>
      )}

      {/* Footer */}
      <Card className="mt-6 bg-primary/5 border-primary/20">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Plataforma colaborativa — Professores e monitores podem enviar vídeo-aulas para aprovação
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Todo conteúdo passa por revisão antes de ser publicado
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
