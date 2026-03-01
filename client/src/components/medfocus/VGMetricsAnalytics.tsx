/**
 * VGMetricsAnalytics — Métricas e Analytics ViralGram
 * Dashboard completo de performance de redes sociais médicas
 */
import React, { useState } from 'react';

interface MetricCard {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: string;
}

interface PlatformMetrics {
  platform: string;
  icon: string;
  followers: number;
  followersGrowth: number;
  engagement: number;
  reach: number;
  impressions: number;
  clicks: number;
  topPost: string;
  topPostEngagement: number;
}

const OVERVIEW_METRICS: MetricCard[] = [
  { label: 'Seguidores Total', value: '12.847', change: '+342 (2.7%)', positive: true, icon: '👥' },
  { label: 'Engajamento Médio', value: '4.8%', change: '+0.3%', positive: true, icon: '💬' },
  { label: 'Alcance Semanal', value: '45.2K', change: '+12%', positive: true, icon: '📡' },
  { label: 'Posts Publicados', value: '24', change: '+6 vs mês anterior', positive: true, icon: '📝' },
  { label: 'Cliques no Perfil', value: '1.832', change: '+18%', positive: true, icon: '🔗' },
  { label: 'Score CFM', value: '96%', change: 'Conformidade', positive: true, icon: '🛡️' },
];

const PLATFORM_DATA: PlatformMetrics[] = [
  { platform: 'Instagram', icon: '📸', followers: 8420, followersGrowth: 3.2, engagement: 5.1, reach: 32000, impressions: 78000, clicks: 1200, topPost: 'Carrossel: Mitos sobre Diabetes', topPostEngagement: 8.7 },
  { platform: 'LinkedIn', icon: '💼', followers: 3890, followersGrowth: 2.1, engagement: 4.3, reach: 12000, impressions: 28000, clicks: 580, topPost: 'Artigo: IA na Medicina', topPostEngagement: 6.2 },
  { platform: 'WhatsApp', icon: '💬', followers: 537, followersGrowth: 5.8, engagement: 12.4, reach: 1200, impressions: 1200, clicks: 52, topPost: 'Lembrete de Consulta', topPostEngagement: 15.3 },
];

const CONTENT_PERFORMANCE = [
  { type: 'Carrossel', posts: 8, avgEngagement: 6.2, avgReach: 4500, bestTime: '09:00' },
  { type: 'Post Único', posts: 10, avgEngagement: 3.8, avgReach: 2800, bestTime: '12:00' },
  { type: 'Artigo', posts: 3, avgEngagement: 4.5, avgReach: 3200, bestTime: '08:00' },
  { type: 'Vídeo/Reels', posts: 2, avgEngagement: 7.1, avgReach: 8200, bestTime: '18:00' },
  { type: 'Stories', posts: 12, avgEngagement: 2.1, avgReach: 1500, bestTime: '20:00' },
];

const WEEKLY_DATA = [
  { day: 'Seg', posts: 2, engagement: 4.2, reach: 5800 },
  { day: 'Ter', posts: 1, engagement: 3.8, reach: 4200 },
  { day: 'Qua', posts: 3, engagement: 5.1, reach: 7200 },
  { day: 'Qui', posts: 2, engagement: 4.5, reach: 6100 },
  { day: 'Sex', posts: 1, engagement: 3.2, reach: 3800 },
  { day: 'Sáb', posts: 0, engagement: 0, reach: 1200 },
  { day: 'Dom', posts: 1, engagement: 6.8, reach: 9200 },
];

const HASHTAG_PERFORMANCE = [
  { tag: '#cardiologia', uses: 12, avgReach: 4200, avgEngagement: 5.1 },
  { tag: '#saude', uses: 18, avgReach: 3800, avgEngagement: 4.2 },
  { tag: '#medicina', uses: 15, avgReach: 3500, avgEngagement: 3.9 },
  { tag: '#prevencao', uses: 8, avgReach: 5100, avgEngagement: 5.8 },
  { tag: '#diabetes', uses: 6, avgReach: 6200, avgEngagement: 6.5 },
  { tag: '#educacaomedica', uses: 10, avgReach: 2800, avgEngagement: 3.4 },
  { tag: '#dermatologia', uses: 4, avgReach: 7500, avgEngagement: 7.2 },
  { tag: '#nutricao', uses: 7, avgReach: 4800, avgEngagement: 5.5 },
];

export const VGMetricsAnalytics: React.FC = () => {
  const [tab, setTab] = useState<'overview' | 'platforms' | 'content' | 'hashtags' | 'roi'>('overview');
  const [period, setPeriod] = useState('30d');

  const maxReach = Math.max(...WEEKLY_DATA.map(d => d.reach));

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-4 md:p-6">
      <div className="mb-4 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs">
        📊 <strong>Dados Simulados:</strong> Em produção, estes dados serão alimentados em tempo real pelas APIs do Instagram Graph, LinkedIn e WhatsApp Business.
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">📊 Métricas & Analytics</h1>
          <p className="text-gray-400 text-sm mt-1">Performance completa das suas redes sociais médicas</p>
        </div>
        <div className="flex gap-2">
          {['7d', '30d', '90d', '12m'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1.5 rounded-lg text-sm ${period === p ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{p}</button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {[
          { id: 'overview', label: '📈 Visão Geral' },
          { id: 'platforms', label: '📱 Plataformas' },
          { id: 'content', label: '📝 Conteúdo' },
          { id: 'hashtags', label: '#️⃣ Hashtags' },
          { id: 'roi', label: '💰 ROI' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as typeof tab)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t.id ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{t.label}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {OVERVIEW_METRICS.map((m, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                <div className="text-lg mb-1">{m.icon}</div>
                <div className="text-xl font-bold">{m.value}</div>
                <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                <div className={`text-xs mt-1 ${m.positive ? 'text-emerald-400' : 'text-red-400'}`}>{m.change}</div>
              </div>
            ))}
          </div>

          {/* Weekly Chart */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h3 className="font-bold mb-4">📅 Performance Semanal</h3>
            <div className="grid grid-cols-7 gap-2">
              {WEEKLY_DATA.map((d, i) => (
                <div key={i} className="text-center">
                  <div className="mb-2 relative h-32 flex items-end justify-center">
                    <div className="w-8 bg-emerald-500/30 rounded-t transition-all" style={{ height: `${maxReach > 0 ? (d.reach / maxReach) * 100 : 0}%` }}>
                      <div className="w-full bg-emerald-500 rounded-t" style={{ height: `${d.engagement * 10}%` }} />
                    </div>
                  </div>
                  <div className="text-xs font-medium">{d.day}</div>
                  <div className="text-[10px] text-gray-500">{d.posts} posts</div>
                  <div className="text-[10px] text-emerald-400">{d.engagement}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Platforms Tab */}
      {tab === 'platforms' && (
        <div className="space-y-4">
          {PLATFORM_DATA.map((p, i) => (
            <div key={i} className="bg-white/5 rounded-xl border border-white/10 p-5">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <h3 className="font-bold">{p.platform}</h3>
                  <span className="text-xs text-emerald-400">+{p.followersGrowth}% crescimento</span>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                {[
                  { label: 'Seguidores', value: p.followers.toLocaleString() },
                  { label: 'Engajamento', value: `${p.engagement}%` },
                  { label: 'Alcance', value: `${(p.reach / 1000).toFixed(1)}K` },
                  { label: 'Impressões', value: `${(p.impressions / 1000).toFixed(1)}K` },
                  { label: 'Cliques', value: p.clicks.toLocaleString() },
                ].map((m, j) => (
                  <div key={j} className="bg-black/20 rounded-lg p-3 text-center">
                    <div className="text-lg font-bold">{m.value}</div>
                    <div className="text-xs text-gray-500">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">🏆 Post com Melhor Performance</div>
                <div className="text-sm font-medium">{p.topPost}</div>
                <div className="text-xs text-emerald-400 mt-1">Engajamento: {p.topPostEngagement}%</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Content Tab */}
      {tab === 'content' && (
        <div className="space-y-4">
          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h3 className="font-bold mb-4">📝 Performance por Tipo de Conteúdo</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-gray-500 border-b border-white/10">
                    <th className="text-left py-2">Tipo</th>
                    <th className="text-center py-2">Posts</th>
                    <th className="text-center py-2">Eng. Médio</th>
                    <th className="text-center py-2">Alcance Médio</th>
                    <th className="text-center py-2">Melhor Horário</th>
                  </tr>
                </thead>
                <tbody>
                  {CONTENT_PERFORMANCE.sort((a, b) => b.avgEngagement - a.avgEngagement).map((c, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-3 font-medium">{c.type}</td>
                      <td className="py-3 text-center">{c.posts}</td>
                      <td className="py-3 text-center">
                        <span className={`px-2 py-0.5 rounded ${c.avgEngagement >= 5 ? 'bg-emerald-500/20 text-emerald-400' : c.avgEngagement >= 3 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{c.avgEngagement}%</span>
                      </td>
                      <td className="py-3 text-center text-gray-400">{c.avgReach.toLocaleString()}</td>
                      <td className="py-3 text-center text-gray-400">{c.bestTime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h3 className="font-bold mb-4">💡 Insights de Conteúdo</h3>
            <div className="space-y-3">
              <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                <div className="text-sm font-medium text-emerald-400">🎬 Vídeos/Reels têm o maior engajamento (7.1%)</div>
                <div className="text-xs text-gray-400 mt-1">Considere aumentar a frequência de vídeos curtos. Melhor horário: 18:00.</div>
              </div>
              <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
                <div className="text-sm font-medium text-blue-400">🎠 Carrosséis são o segundo melhor formato (6.2%)</div>
                <div className="text-xs text-gray-400 mt-1">Carrosséis educativos com 5-7 slides performam melhor. Melhor horário: 09:00.</div>
              </div>
              <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                <div className="text-sm font-medium text-amber-400">📅 Domingos têm o maior alcance orgânico</div>
                <div className="text-xs text-gray-400 mt-1">Posts publicados aos domingos alcançam 2.4x mais pessoas que nos dias úteis.</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hashtags Tab */}
      {tab === 'hashtags' && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-5">
          <h3 className="font-bold mb-4">#️⃣ Performance de Hashtags</h3>
          <div className="space-y-3">
            {HASHTAG_PERFORMANCE.sort((a, b) => b.avgEngagement - a.avgEngagement).map((h, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-8 text-center text-sm font-bold text-gray-500">#{i + 1}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-blue-400">{h.tag}</span>
                    <span className="text-xs text-gray-500">{h.uses} usos</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>Alcance: {h.avgReach.toLocaleString()}</span>
                    <span className="text-emerald-400">Eng: {h.avgEngagement}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 mt-1">
                    <div className="bg-emerald-500 rounded-full h-1.5" style={{ width: `${(h.avgEngagement / 8) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ROI Tab */}
      {tab === 'roi' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h3 className="font-bold mb-4">💰 ROI das Redes Sociais</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Novos pacientes via redes</span>
                <span className="font-bold text-emerald-400">+18 /mês</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Ticket médio por paciente</span>
                <span className="font-bold">R$ 350,00</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Receita estimada (redes)</span>
                <span className="font-bold text-emerald-400">R$ 6.300/mês</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Custo da ferramenta</span>
                <span className="font-bold text-red-400">R$ 49,99/mês</span>
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                <span className="text-sm font-bold">ROI</span>
                <span className="text-2xl font-bold text-emerald-400">12.501%</span>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h3 className="font-bold mb-4">📈 Crescimento de Autoridade</h3>
            <div className="space-y-3">
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-sm font-medium">Posicionamento como Especialista</div>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2"><div className="bg-emerald-500 rounded-full h-2" style={{ width: '78%' }} /></div>
                <div className="text-xs text-gray-500 mt-1">78% — Acima da média do setor</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-sm font-medium">Confiança do Público</div>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2"><div className="bg-blue-500 rounded-full h-2" style={{ width: '85%' }} /></div>
                <div className="text-xs text-gray-500 mt-1">85% — Excelente</div>
              </div>
              <div className="bg-black/20 rounded-lg p-3">
                <div className="text-sm font-medium">Compliance CFM</div>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2"><div className="bg-green-500 rounded-full h-2" style={{ width: '96%' }} /></div>
                <div className="text-xs text-gray-500 mt-1">96% — Conformidade alta</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VGMetricsAnalytics;
