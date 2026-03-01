/**
 * VGAgendamento — Agendamento e Auto-Publicação ViralGram
 * Fila de publicação, agendamento e auto-publish para redes sociais médicas
 */
import React, { useState } from 'react';

interface ScheduledPost {
  id: string;
  title: string;
  platform: 'instagram' | 'linkedin' | 'whatsapp';
  scheduledDate: string;
  scheduledTime: string;
  status: 'queued' | 'scheduled' | 'published' | 'failed';
  content: string;
  autoPublish: boolean;
  complianceCFM: boolean;
}

const DEMO_QUEUE: ScheduledPost[] = [
  { id: '1', title: 'Dicas de Prevenção Cardiovascular', platform: 'instagram', scheduledDate: '2026-03-02', scheduledTime: '09:00', status: 'scheduled', content: 'A prevenção cardiovascular começa com hábitos simples...', autoPublish: true, complianceCFM: true },
  { id: '2', title: 'Artigo: Avanços em Imunologia', platform: 'linkedin', scheduledDate: '2026-03-03', scheduledTime: '14:00', status: 'queued', content: 'Revisão dos últimos avanços em imunoterapia...', autoPublish: false, complianceCFM: true },
  { id: '3', title: 'Lembrete: Campanha de Vacinação', platform: 'whatsapp', scheduledDate: '2026-03-04', scheduledTime: '08:00', status: 'scheduled', content: 'Lembrete sobre a campanha de vacinação...', autoPublish: true, complianceCFM: true },
  { id: '4', title: 'Carrossel: Alimentação e Saúde', platform: 'instagram', scheduledDate: '2026-03-05', scheduledTime: '12:00', status: 'queued', content: 'Guia prático de alimentação saudável...', autoPublish: true, complianceCFM: true },
  { id: '5', title: 'Post: Saúde Mental no Trabalho', platform: 'linkedin', scheduledDate: '2026-03-06', scheduledTime: '10:00', status: 'queued', content: 'A importância do cuidado com a saúde mental...', autoPublish: false, complianceCFM: false },
  { id: '6', title: 'Dica: Hidratação no Verão', platform: 'instagram', scheduledDate: '2026-02-28', scheduledTime: '09:00', status: 'published', content: 'Dicas de hidratação para o verão...', autoPublish: true, complianceCFM: true },
  { id: '7', title: 'Artigo: Telemedicina 2026', platform: 'linkedin', scheduledDate: '2026-02-27', scheduledTime: '08:00', status: 'published', content: 'O futuro da telemedicina...', autoPublish: true, complianceCFM: true },
];

const BEST_TIMES = {
  instagram: [
    { day: 'Segunda', times: ['09:00', '12:00', '18:00'] },
    { day: 'Terça', times: ['08:00', '13:00', '19:00'] },
    { day: 'Quarta', times: ['09:00', '12:00', '18:00'] },
    { day: 'Quinta', times: ['08:00', '14:00', '20:00'] },
    { day: 'Sexta', times: ['09:00', '12:00', '17:00'] },
    { day: 'Sábado', times: ['10:00', '14:00'] },
    { day: 'Domingo', times: ['10:00', '18:00'] },
  ],
  linkedin: [
    { day: 'Segunda', times: ['08:00', '12:00'] },
    { day: 'Terça', times: ['08:00', '10:00'] },
    { day: 'Quarta', times: ['09:00', '12:00'] },
    { day: 'Quinta', times: ['08:00', '14:00'] },
    { day: 'Sexta', times: ['08:00', '11:00'] },
  ],
};

export const VGAgendamento: React.FC = () => {
  const [queue, setQueue] = useState<ScheduledPost[]>(DEMO_QUEUE);
  const [tab, setTab] = useState<'queue' | 'scheduled' | 'published' | 'settings'>('queue');
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);

  const platformIcon = (p: string) => p === 'instagram' ? '📸' : p === 'linkedin' ? '💼' : '💬';
  const statusColor = (s: string) => {
    switch (s) {
      case 'queued': return 'bg-yellow-500/20 text-yellow-400';
      case 'scheduled': return 'bg-emerald-500/20 text-emerald-400';
      case 'published': return 'bg-purple-500/20 text-purple-400';
      case 'failed': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };
  const statusLabel = (s: string) => ({ queued: 'Na Fila', scheduled: 'Agendado', published: 'Publicado', failed: 'Falhou' }[s] || s);

  const filteredQueue = queue.filter(p => {
    if (tab === 'queue') return p.status === 'queued';
    if (tab === 'scheduled') return p.status === 'scheduled';
    if (tab === 'published') return p.status === 'published';
    return true;
  });

  const stats = {
    queued: queue.filter(p => p.status === 'queued').length,
    scheduled: queue.filter(p => p.status === 'scheduled').length,
    published: queue.filter(p => p.status === 'published').length,
    autoPublish: queue.filter(p => p.autoPublish).length,
    cfmOk: queue.filter(p => p.complianceCFM).length,
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-4 md:p-6">
      <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
        ⚠️ <strong>Auto-Publicação:</strong> Posts com auto-publish ativado serão publicados automaticamente no horário agendado. Certifique-se de que o conteúdo está verificado pelo Compliance CFM antes de ativar.
      </div>

      <h1 className="text-2xl font-bold mb-1">📤 Agendamento & Auto-Publish</h1>
      <p className="text-gray-400 text-sm mb-6">Gerencie sua fila de publicação e agende conteúdo automaticamente</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Na Fila', value: stats.queued, color: 'text-yellow-400', icon: '📋' },
          { label: 'Agendados', value: stats.scheduled, color: 'text-emerald-400', icon: '📅' },
          { label: 'Publicados', value: stats.published, color: 'text-purple-400', icon: '✅' },
          { label: 'Auto-Publish', value: stats.autoPublish, color: 'text-blue-400', icon: '🤖' },
          { label: 'CFM OK', value: stats.cfmOk, color: 'text-green-400', icon: '🛡️' },
        ].map((s, i) => (
          <div key={i} className="bg-white/5 rounded-xl p-3 text-center border border-white/10">
            <div className="text-lg">{s.icon}</div>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: 'queue', label: `📋 Fila (${stats.queued})` },
          { id: 'scheduled', label: `📅 Agendados (${stats.scheduled})` },
          { id: 'published', label: `✅ Publicados (${stats.published})` },
          { id: 'settings', label: '⚙️ Configurações' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{t.label}</button>
        ))}
      </div>

      {/* Queue/Scheduled/Published Lists */}
      {tab !== 'settings' && (
        <div className="space-y-2">
          {filteredQueue.length === 0 ? (
            <div className="bg-white/5 rounded-xl p-8 text-center border border-white/10">
              <div className="text-4xl mb-3">📭</div>
              <div className="text-gray-400">Nenhum post nesta categoria</div>
            </div>
          ) : (
            filteredQueue.sort((a, b) => `${a.scheduledDate}${a.scheduledTime}`.localeCompare(`${b.scheduledDate}${b.scheduledTime}`)).map(p => (
              <div key={p.id} onClick={() => setSelectedPost(p)} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-500/30 cursor-pointer transition-all">
                <div className="flex items-center gap-4">
                  <div className="text-2xl">{platformIcon(p.platform)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{p.title}</span>
                      {p.autoPublish && <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">🤖 Auto</span>}
                      {!p.complianceCFM && <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/20 text-red-400">⚠️ CFM</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">📅 {p.scheduledDate} às {p.scheduledTime}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor(p.status)}`}>{statusLabel(p.status)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Settings Tab */}
      {tab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h3 className="font-bold mb-4">📸 Melhores Horários — Instagram</h3>
            <div className="space-y-2">
              {BEST_TIMES.instagram.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 w-20">{d.day}</span>
                  <div className="flex gap-1">
                    {d.times.map((t, j) => <span key={j} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h3 className="font-bold mb-4">💼 Melhores Horários — LinkedIn</h3>
            <div className="space-y-2">
              {BEST_TIMES.linkedin.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400 w-20">{d.day}</span>
                  <div className="flex gap-1">
                    {d.times.map((t, j) => <span key={j} className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/5 rounded-xl border border-white/10 p-5 md:col-span-2">
            <h3 className="font-bold mb-4">⚙️ Configurações de Auto-Publish</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                <div>
                  <div className="text-sm font-medium">Auto-Publish Global</div>
                  <div className="text-xs text-gray-500">Publicar automaticamente posts aprovados no horário agendado</div>
                </div>
                <div className="w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" /></div>
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                <div>
                  <div className="text-sm font-medium">Verificação CFM Obrigatória</div>
                  <div className="text-xs text-gray-500">Bloquear publicação de posts sem verificação de compliance</div>
                </div>
                <div className="w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" /></div>
              </label>
              <label className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5">
                <div>
                  <div className="text-sm font-medium">Notificações de Publicação</div>
                  <div className="text-xs text-gray-500">Receber notificação quando um post for publicado automaticamente</div>
                </div>
                <div className="w-12 h-6 bg-emerald-600 rounded-full relative cursor-pointer"><div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5" /></div>
              </label>
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
                <span className={`text-xs px-2 py-1 rounded-full ${statusColor(selectedPost.status)}`}>{statusLabel(selectedPost.status)}</span>
                {selectedPost.autoPublish && <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">🤖 Auto-Publish</span>}
                {selectedPost.complianceCFM ? <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">✅ CFM OK</span> : <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">⚠️ CFM Pendente</span>}
              </div>
              <div className="text-sm text-gray-400">📅 {selectedPost.scheduledDate} às {selectedPost.scheduledTime}</div>
              <div className="bg-white/5 rounded-lg p-3 text-sm">{selectedPost.content}</div>
            </div>
            <div className="flex gap-2 mt-4">
              {selectedPost.status === 'queued' && (
                <button onClick={() => { setQueue(queue.map(p => p.id === selectedPost.id ? { ...p, status: 'scheduled' } : p)); setSelectedPost({ ...selectedPost, status: 'scheduled' }); }} className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm">📅 Agendar</button>
              )}
              {selectedPost.status === 'scheduled' && (
                <button onClick={() => { setQueue(queue.map(p => p.id === selectedPost.id ? { ...p, status: 'published' } : p)); setSelectedPost({ ...selectedPost, status: 'published' }); }} className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm">🚀 Publicar Agora</button>
              )}
              <button onClick={() => setSelectedPost(null)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VGAgendamento;
