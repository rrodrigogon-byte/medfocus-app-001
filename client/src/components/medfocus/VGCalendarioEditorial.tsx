/**
 * VGCalendarioEditorial — Calendário Editorial ViralGram
 * Planejamento visual de conteúdo para redes sociais médicas
 * Compliance CFM integrado em todas as publicações
 */
import React, { useState } from 'react';

interface Post {
  id: string;
  title: string;
  platform: 'instagram' | 'linkedin' | 'whatsapp' | 'all';
  type: 'educativo' | 'caso_clinico' | 'dica_saude' | 'bastidores' | 'artigo' | 'video' | 'carrossel';
  status: 'rascunho' | 'aprovado' | 'agendado' | 'publicado';
  date: string;
  time: string;
  content: string;
  hashtags: string[];
  complianceCFM: boolean;
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const DEMO_POSTS: Post[] = [
  { id: '1', title: 'Dicas de Prevenção Cardiovascular', platform: 'instagram', type: 'dica_saude', status: 'agendado', date: '2026-03-03', time: '09:00', content: 'A prevenção cardiovascular começa com hábitos simples...', hashtags: ['#cardiologia', '#prevencao', '#saude'], complianceCFM: true },
  { id: '2', title: 'Artigo: Avanços em Imunologia', platform: 'linkedin', type: 'artigo', status: 'rascunho', date: '2026-03-05', time: '14:00', content: 'Revisão dos últimos avanços em imunoterapia...', hashtags: ['#imunologia', '#pesquisa'], complianceCFM: true },
  { id: '3', title: 'Bastidores do Consultório', platform: 'instagram', type: 'bastidores', status: 'aprovado', date: '2026-03-07', time: '18:00', content: 'Um dia na rotina do consultório...', hashtags: ['#rotina', '#medicina'], complianceCFM: true },
  { id: '4', title: 'Caso Clínico: Diabetes Tipo 2', platform: 'all', type: 'caso_clinico', status: 'agendado', date: '2026-03-10', time: '10:00', content: 'Paciente de 55 anos com diagnóstico recente...', hashtags: ['#diabetes', '#endocrinologia'], complianceCFM: true },
  { id: '5', title: 'Carrossel: 5 Sinais de Alerta', platform: 'instagram', type: 'carrossel', status: 'rascunho', date: '2026-03-12', time: '11:00', content: 'Conheça os 5 sinais que não devem ser ignorados...', hashtags: ['#saude', '#prevencao'], complianceCFM: false },
  { id: '6', title: 'Vídeo: Mitos sobre Vacinas', platform: 'instagram', type: 'video', status: 'aprovado', date: '2026-03-15', time: '08:00', content: 'Desmistificando as principais fake news...', hashtags: ['#vacinas', '#ciencia'], complianceCFM: true },
  { id: '7', title: 'Artigo: Saúde Mental no Trabalho', platform: 'linkedin', type: 'artigo', status: 'agendado', date: '2026-03-18', time: '09:00', content: 'A importância do cuidado com a saúde mental...', hashtags: ['#saudemental', '#trabalho'], complianceCFM: true },
  { id: '8', title: 'Dica: Alimentação Saudável', platform: 'all', type: 'educativo', status: 'publicado', date: '2026-02-28', time: '10:00', content: 'Guia prático de alimentação para pacientes...', hashtags: ['#nutricao', '#saude'], complianceCFM: true },
];

const TEMPLATES = [
  { name: 'Dica de Saúde', type: 'dica_saude', desc: 'Post educativo curto com dica prática', platforms: ['instagram', 'linkedin'] },
  { name: 'Caso Clínico Anonimizado', type: 'caso_clinico', desc: 'Discussão de caso com dados anonimizados (CFM)', platforms: ['linkedin'] },
  { name: 'Carrossel Educativo', type: 'carrossel', desc: '5-10 slides com informações visuais', platforms: ['instagram'] },
  { name: 'Artigo Científico', type: 'artigo', desc: 'Artigo longo com referências PubMed', platforms: ['linkedin'] },
  { name: 'Vídeo Explicativo', type: 'video', desc: 'Vídeo curto (60s) explicando um tema', platforms: ['instagram'] },
  { name: 'Bastidores', type: 'bastidores', desc: 'Rotina do consultório (sem pacientes)', platforms: ['instagram'] },
];

export const VGCalendarioEditorial: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(2); // March
  const [currentYear, setCurrentYear] = useState(2026);
  const [posts, setPosts] = useState<Post[]>(DEMO_POSTS);
  const [view, setView] = useState<'calendar' | 'list' | 'templates' | 'analytics'>('calendar');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [newPost, setNewPost] = useState<Partial<Post>>({ platform: 'instagram', type: 'educativo', status: 'rascunho', complianceCFM: false, hashtags: [] });

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);

  const getPostsForDate = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return posts.filter(p => p.date === dateStr);
  };

  const platformIcon = (p: string) => {
    switch (p) {
      case 'instagram': return '📸';
      case 'linkedin': return '💼';
      case 'whatsapp': return '💬';
      case 'all': return '🌐';
      default: return '📝';
    }
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'rascunho': return 'bg-gray-500/20 text-gray-400';
      case 'aprovado': return 'bg-blue-500/20 text-blue-400';
      case 'agendado': return 'bg-emerald-500/20 text-emerald-400';
      case 'publicado': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const typeLabel = (t: string) => {
    const map: Record<string, string> = { educativo: 'Educativo', caso_clinico: 'Caso Clínico', dica_saude: 'Dica de Saúde', bastidores: 'Bastidores', artigo: 'Artigo', video: 'Vídeo', carrossel: 'Carrossel' };
    return map[t] || t;
  };

  const stats = {
    total: posts.length,
    agendados: posts.filter(p => p.status === 'agendado').length,
    publicados: posts.filter(p => p.status === 'publicado').length,
    rascunhos: posts.filter(p => p.status === 'rascunho').length,
    compliance: posts.filter(p => p.complianceCFM).length,
    nonCompliance: posts.filter(p => !p.complianceCFM).length,
  };

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.date) return;
    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title || '',
      platform: (newPost.platform as Post['platform']) || 'instagram',
      type: (newPost.type as Post['type']) || 'educativo',
      status: 'rascunho',
      date: newPost.date || '',
      time: newPost.time || '09:00',
      content: newPost.content || '',
      hashtags: newPost.hashtags || [],
      complianceCFM: newPost.complianceCFM || false,
    };
    setPosts([...posts, post]);
    setShowNewPost(false);
    setNewPost({ platform: 'instagram', type: 'educativo', status: 'rascunho', complianceCFM: false, hashtags: [] });
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-4 md:p-6">
      {/* Disclaimer */}
      <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
        ⚠️ <strong>Compliance CFM:</strong> Todo conteúdo médico publicado deve respeitar a Resolução CFM 2.336/2023. Não publique: antes/depois, garantias de resultado, autopromoção sensacionalista ou dados de pacientes sem consentimento.
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">📅 Calendário Editorial</h1>
          <p className="text-gray-400 text-sm mt-1">Planeje e agende seu conteúdo médico para redes sociais</p>
        </div>
        <div className="flex gap-2">
          {(['calendar', 'list', 'templates', 'analytics'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${view === v ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {v === 'calendar' ? '📅 Calendário' : v === 'list' ? '📋 Lista' : v === 'templates' ? '📄 Templates' : '📊 Analytics'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {[
          { label: 'Total Posts', value: stats.total, color: 'text-white' },
          { label: 'Agendados', value: stats.agendados, color: 'text-emerald-400' },
          { label: 'Publicados', value: stats.publicados, color: 'text-purple-400' },
          { label: 'Rascunhos', value: stats.rascunhos, color: 'text-gray-400' },
          { label: 'CFM ✅', value: stats.compliance, color: 'text-green-400' },
          { label: 'CFM ⚠️', value: stats.nonCompliance, color: 'text-red-400' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Calendar View */}
      {view === 'calendar' && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
          <div className="flex justify-between items-center mb-4">
            <button onClick={() => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); } else setCurrentMonth(m => m - 1); }} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">← Anterior</button>
            <h2 className="text-lg font-bold">{MONTHS[currentMonth]} {currentYear}</h2>
            <button onClick={() => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); } else setCurrentMonth(m => m + 1); }} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm">Próximo →</button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {DAYS.map(d => <div key={d} className="text-center text-xs font-medium text-gray-500 py-2">{d}</div>)}
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="min-h-[80px]" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayPosts = getPostsForDate(day);
              const isToday = day === 1 && currentMonth === 2 && currentYear === 2026;
              return (
                <div key={day} className={`min-h-[80px] rounded-lg p-1 border ${isToday ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/5 bg-white/[0.02]'} hover:bg-white/5 transition-all cursor-pointer`} onClick={() => { setNewPost({ ...newPost, date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` }); setShowNewPost(true); }}>
                  <div className={`text-xs font-medium mb-1 ${isToday ? 'text-emerald-400' : 'text-gray-500'}`}>{day}</div>
                  {dayPosts.map(p => (
                    <div key={p.id} onClick={(e) => { e.stopPropagation(); setSelectedPost(p); }} className={`text-[10px] px-1 py-0.5 rounded mb-0.5 truncate cursor-pointer hover:opacity-80 ${statusColor(p.status)}`}>
                      {platformIcon(p.platform)} {p.title}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Todos os Posts</h3>
            <button onClick={() => setShowNewPost(true)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium">+ Novo Post</button>
          </div>
          {posts.sort((a, b) => a.date.localeCompare(b.date)).map(p => (
            <div key={p.id} onClick={() => setSelectedPost(p)} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-500/30 cursor-pointer transition-all flex items-center gap-4">
              <div className="text-2xl">{platformIcon(p.platform)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{p.title}</span>
                  {!p.complianceCFM && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">⚠️ CFM</span>}
                </div>
                <div className="text-xs text-gray-500 mt-1">{typeLabel(p.type)} · {p.date} às {p.time}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColor(p.status)}`}>{p.status}</span>
            </div>
          ))}
        </div>
      )}

      {/* Templates View */}
      {view === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map((t, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-emerald-500/30 transition-all cursor-pointer" onClick={() => { setNewPost({ ...newPost, type: t.type as Post['type'], title: t.name }); setShowNewPost(true); }}>
              <h3 className="font-bold text-lg mb-2">{t.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{t.desc}</p>
              <div className="flex gap-1">
                {t.platforms.map(p => <span key={p} className="text-xs px-2 py-0.5 rounded bg-white/10">{platformIcon(p)} {p}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics View */}
      {view === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <h3 className="font-bold mb-4">📊 Posts por Plataforma</h3>
            {['instagram', 'linkedin', 'whatsapp', 'all'].map(p => {
              const count = posts.filter(post => post.platform === p).length;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={p} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{platformIcon(p)} {p}</span>
                    <span className="text-gray-400">{count} posts ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-emerald-500 rounded-full h-2 transition-all" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <h3 className="font-bold mb-4">📈 Posts por Tipo</h3>
            {['educativo', 'caso_clinico', 'dica_saude', 'bastidores', 'artigo', 'video', 'carrossel'].map(t => {
              const count = posts.filter(post => post.type === t).length;
              const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
              return (
                <div key={t} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{typeLabel(t)}</span>
                    <span className="text-gray-400">{count}</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2"><div className="bg-blue-500 rounded-full h-2 transition-all" style={{ width: `${pct}%` }} /></div>
                </div>
              );
            })}
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <h3 className="font-bold mb-4">🛡️ Compliance CFM</h3>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{stats.total > 0 ? ((stats.compliance / stats.total) * 100).toFixed(0) : 0}%</div>
                <div className="text-xs text-gray-500 mt-1">Taxa de Conformidade</div>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-green-400">✅ Aprovados</span><span>{stats.compliance}</span></div>
                <div className="flex justify-between text-sm"><span className="text-red-400">⚠️ Pendentes</span><span>{stats.nonCompliance}</span></div>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-5 border border-white/10">
            <h3 className="font-bold mb-4">📅 Frequência Recomendada</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>📸 Instagram</span><span className="text-emerald-400">3-5x/semana</span></div>
              <div className="flex justify-between"><span>💼 LinkedIn</span><span className="text-emerald-400">2-3x/semana</span></div>
              <div className="flex justify-between"><span>💬 WhatsApp</span><span className="text-emerald-400">1-2x/semana</span></div>
              <p className="text-xs text-gray-500 mt-2">Baseado em benchmarks de profissionais de saúde com maior engajamento.</p>
            </div>
          </div>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] rounded-2xl border border-white/10 p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">📝 Novo Post</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Título</label>
                <input value={newPost.title || ''} onChange={e => setNewPost({ ...newPost, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Título do post" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Plataforma</label>
                  <select value={newPost.platform} onChange={e => setNewPost({ ...newPost, platform: e.target.value as Post['platform'] })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                    <option value="instagram">📸 Instagram</option>
                    <option value="linkedin">💼 LinkedIn</option>
                    <option value="whatsapp">💬 WhatsApp</option>
                    <option value="all">🌐 Todas</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Tipo</label>
                  <select value={newPost.type} onChange={e => setNewPost({ ...newPost, type: e.target.value as Post['type'] })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                    <option value="educativo">Educativo</option>
                    <option value="caso_clinico">Caso Clínico</option>
                    <option value="dica_saude">Dica de Saúde</option>
                    <option value="bastidores">Bastidores</option>
                    <option value="artigo">Artigo</option>
                    <option value="video">Vídeo</option>
                    <option value="carrossel">Carrossel</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Data</label>
                  <input type="date" value={newPost.date || ''} onChange={e => setNewPost({ ...newPost, date: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Horário</label>
                  <input type="time" value={newPost.time || '09:00'} onChange={e => setNewPost({ ...newPost, time: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Conteúdo</label>
                <textarea value={newPost.content || ''} onChange={e => setNewPost({ ...newPost, content: e.target.value })} rows={4} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Escreva o conteúdo do post..." />
              </div>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={newPost.complianceCFM || false} onChange={e => setNewPost({ ...newPost, complianceCFM: e.target.checked })} className="rounded" />
                <span>✅ Verificado Compliance CFM 2.336/2023</span>
              </label>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={handleCreatePost} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium">Criar Post</button>
              <button onClick={() => setShowNewPost(false)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] rounded-2xl border border-white/10 p-6 max-w-lg w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">{platformIcon(selectedPost.platform)} {selectedPost.title}</h3>
              <button onClick={() => setSelectedPost(null)} className="text-gray-500 hover:text-white">✕</button>
            </div>
            <div className="space-y-3">
              <div className="flex gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor(selectedPost.status)}`}>{selectedPost.status}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-white/10">{typeLabel(selectedPost.type)}</span>
                {selectedPost.complianceCFM ? <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">✅ CFM OK</span> : <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">⚠️ CFM Pendente</span>}
              </div>
              <div className="text-sm text-gray-400">📅 {selectedPost.date} às {selectedPost.time}</div>
              <div className="bg-white/5 rounded-lg p-3 text-sm">{selectedPost.content}</div>
              <div className="flex flex-wrap gap-1">
                {selectedPost.hashtags.map((h, i) => <span key={i} className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">{h}</span>)}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => { setPosts(posts.map(p => p.id === selectedPost.id ? { ...p, status: 'aprovado' } : p)); setSelectedPost({ ...selectedPost, status: 'aprovado' }); }} className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">Aprovar</button>
              <button onClick={() => { setPosts(posts.map(p => p.id === selectedPost.id ? { ...p, status: 'agendado' } : p)); setSelectedPost({ ...selectedPost, status: 'agendado' }); }} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm">Agendar</button>
              <button onClick={() => setSelectedPost(null)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VGCalendarioEditorial;
