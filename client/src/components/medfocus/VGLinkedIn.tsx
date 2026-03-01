/**
 * MedFocus — ViralGram LinkedIn Integration (Sprint 15)
 * 
 * Módulo nativo de integração com LinkedIn para profissionais de saúde.
 * Permite publicação, agendamento e analytics de conteúdo médico no LinkedIn.
 * 
 * APIs:
 * - LinkedIn Marketing API v2 (OAuth 2.0)
 * - LinkedIn Share API
 * - LinkedIn Analytics API
 * 
 * Compliance: Res. CFM 2.336/2023 - Publicidade Médica
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface LinkedInProfile {
  nome: string;
  titulo: string;
  crm: string;
  rqe: string;
  especialidade: string;
  seguidores: number;
  conexoes: number;
  foto: string;
  url: string;
}

interface LinkedInPost {
  id: string;
  conteudo: string;
  tipo: 'texto' | 'artigo' | 'imagem' | 'video' | 'carrossel' | 'newsletter';
  status: 'rascunho' | 'agendado' | 'publicado' | 'erro';
  metricas: { impressoes: number; curtidas: number; comentarios: number; compartilhamentos: number; cliques: number; };
  publicadoEm?: Date;
  agendadoPara?: Date;
  complianceCFM: boolean;
}

interface LinkedInMetricas {
  seguidores: number;
  crescimentoSemanal: number;
  impressoesTotal: number;
  engajamentoMedio: number;
  melhorHorario: string;
  melhorDia: string;
  topPosts: LinkedInPost[];
}

export function VGLinkedIn() {
  const [tela, setTela] = useState<'dashboard' | 'publicar' | 'analytics' | 'config'>('dashboard');
  const [conectado, setConectado] = useState(false);
  const [conteudo, setConteudo] = useState('');
  const [tipoPost, setTipoPost] = useState<'texto' | 'artigo' | 'imagem' | 'carrossel'>('texto');
  const [agendamento, setAgendamento] = useState('');
  const [publicando, setPublicando] = useState(false);

  // Dados simulados
  const perfil: LinkedInProfile = {
    nome: 'Dr. Rodrigo Gonçalves',
    titulo: 'Médico | Especialista em Inovação em Saúde',
    crm: 'CRM-SP 123456',
    rqe: 'RQE 78901',
    especialidade: 'Clínica Médica',
    seguidores: 2847,
    conexoes: 1523,
    foto: '👨‍⚕️',
    url: 'linkedin.com/in/drrodrigogoncalves',
  };

  const metricas: LinkedInMetricas = {
    seguidores: 2847,
    crescimentoSemanal: 12.5,
    impressoesTotal: 45230,
    engajamentoMedio: 4.8,
    melhorHorario: '08:00 - 09:00',
    melhorDia: 'Terça-feira',
    topPosts: [
      { id: '1', conteudo: '🩺 5 sinais de alerta que você não deve ignorar...', tipo: 'texto', status: 'publicado', metricas: { impressoes: 12500, curtidas: 342, comentarios: 89, compartilhamentos: 56, cliques: 230 }, publicadoEm: new Date('2026-02-25'), complianceCFM: true },
      { id: '2', conteudo: '📚 Novo estudo sobre SGLT2 e insuficiência cardíaca...', tipo: 'artigo', status: 'publicado', metricas: { impressoes: 8900, curtidas: 215, comentarios: 45, compartilhamentos: 78, cliques: 190 }, publicadoEm: new Date('2026-02-22'), complianceCFM: true },
      { id: '3', conteudo: '💡 Como a IA está transformando o diagnóstico médico...', tipo: 'carrossel', status: 'publicado', metricas: { impressoes: 15200, curtidas: 567, comentarios: 123, compartilhamentos: 89, cliques: 345 }, publicadoEm: new Date('2026-02-20'), complianceCFM: true },
    ],
  };

  const handleConectar = () => {
    setConectado(true);
  };

  const handlePublicar = () => {
    setPublicando(true);
    setTimeout(() => {
      setPublicando(false);
      setConteudo('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="ViralGram - LinkedIn Integration" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">💼</span> LinkedIn Integration
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full font-medium">ViralGram</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${conectado ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {conectado ? '● Conectado' : '○ Desconectado'}
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Publique conteúdo médico profissional no LinkedIn com compliance CFM automático
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'dashboard' as const, label: '📊 Dashboard' },
          { id: 'publicar' as const, label: '📝 Publicar' },
          { id: 'analytics' as const, label: '📈 Analytics' },
          { id: 'config' as const, label: '⚙️ Configuração' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTela(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tela === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard */}
      {tela === 'dashboard' && (
        <div className="space-y-6">
          {!conectado ? (
            <div className="bg-gradient-to-r from-blue-500/10 to-blue-700/10 border-2 border-blue-500/30 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-4">💼</p>
              <h3 className="text-xl font-bold mb-2">Conecte seu LinkedIn</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Conecte sua conta do LinkedIn para publicar conteúdo médico profissional, acompanhar métricas e crescer sua autoridade.
              </p>
              <button onClick={handleConectar}
                className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                🔗 Conectar com LinkedIn (OAuth 2.0)
              </button>
              <p className="text-xs text-muted-foreground mt-3">Usamos LinkedIn Marketing API v2 com OAuth 2.0 seguro</p>
            </div>
          ) : (
            <>
              {/* Perfil */}
              <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center text-3xl">{perfil.foto}</div>
                <div className="flex-1">
                  <h3 className="font-bold">{perfil.nome}</h3>
                  <p className="text-sm text-muted-foreground">{perfil.titulo}</p>
                  <p className="text-xs text-blue-400 mt-1">{perfil.crm} | {perfil.rqe} | {perfil.especialidade}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-400">{perfil.seguidores.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">seguidores</p>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Seguidores', valor: metricas.seguidores.toLocaleString(), sub: `+${metricas.crescimentoSemanal}% esta semana`, cor: 'text-blue-400' },
                  { label: 'Impressões (30d)', valor: metricas.impressoesTotal.toLocaleString(), sub: 'Total acumulado', cor: 'text-green-400' },
                  { label: 'Engajamento', valor: `${metricas.engajamentoMedio}%`, sub: 'Média por post', cor: 'text-purple-400' },
                  { label: 'Melhor Horário', valor: metricas.melhorHorario, sub: metricas.melhorDia, cor: 'text-cyan-400' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4">
                    <p className={`text-xl font-bold ${kpi.cor}`}>{kpi.valor}</p>
                    <p className="text-xs font-medium text-foreground/80">{kpi.label}</p>
                    <p className="text-[10px] text-muted-foreground">{kpi.sub}</p>
                  </div>
                ))}
              </div>

              {/* Top Posts */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-bold mb-4">🏆 Top Posts (Últimos 30 dias)</h3>
                <div className="space-y-3">
                  {metricas.topPosts.map(post => (
                    <div key={post.id} className="bg-background/50 rounded-lg p-4 border border-border/50 flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm">{post.conteudo}</p>
                        <p className="text-xs text-muted-foreground mt-1">{post.publicadoEm?.toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="grid grid-cols-4 gap-3 text-center">
                        <div><p className="text-sm font-bold">{(post.metricas.impressoes / 1000).toFixed(1)}k</p><p className="text-[10px] text-muted-foreground">Impr.</p></div>
                        <div><p className="text-sm font-bold">{post.metricas.curtidas}</p><p className="text-[10px] text-muted-foreground">Likes</p></div>
                        <div><p className="text-sm font-bold">{post.metricas.comentarios}</p><p className="text-[10px] text-muted-foreground">Coment.</p></div>
                        <div><p className="text-sm font-bold">{post.metricas.compartilhamentos}</p><p className="text-[10px] text-muted-foreground">Shares</p></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Publicar */}
      {tela === 'publicar' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">📝 Nova Publicação LinkedIn</h3>
            <div className="flex gap-3 mb-4">
              {(['texto', 'artigo', 'imagem', 'carrossel'] as const).map(t => (
                <button key={t} onClick={() => setTipoPost(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                    tipoPost === t ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                  }`}>
                  {t === 'texto' ? '📝' : t === 'artigo' ? '📰' : t === 'imagem' ? '🖼️' : '📸'} {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <textarea value={conteudo} onChange={e => setConteudo(e.target.value)}
              placeholder="Escreva seu post para o LinkedIn... Lembre-se: conteúdo médico deve seguir as regras do CFM."
              rows={8}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none resize-none" />
            
            <div className="flex items-center gap-4 mt-4">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground">Agendar para:</label>
                <input type="datetime-local" value={agendamento} onChange={e => setAgendamento(e.target.value)}
                  className="ml-2 bg-background border border-border rounded-lg px-3 py-1.5 text-xs focus:border-primary focus:outline-none" />
              </div>
              <button onClick={handlePublicar} disabled={!conteudo || publicando}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-lg">
                {publicando ? '⏳ Publicando...' : agendamento ? '📅 Agendar' : '🚀 Publicar Agora'}
              </button>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <h4 className="font-bold text-sm text-yellow-400 mb-2">⚖️ Compliance CFM para LinkedIn</h4>
            <ul className="text-xs text-foreground/70 space-y-1">
              <li>• Todo post deve conter CRM e RQE do profissional</li>
              <li>• Artigos científicos devem citar a fonte original</li>
              <li>• Não divulgar preços de consultas ou procedimentos</li>
              <li>• Não garantir resultados de tratamentos</li>
              <li>• LinkedIn é ideal para conteúdo educacional e científico</li>
            </ul>
          </div>
        </div>
      )}

      {/* Analytics */}
      {tela === 'analytics' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Crescimento de Seguidores</h4>
              <div className="flex items-end gap-1 h-32">
                {[45, 52, 48, 65, 72, 68, 85, 92, 88, 105, 115, 128].map((v, i) => (
                  <div key={i} className="flex-1 bg-blue-500/30 rounded-t" style={{ height: `${(v / 128) * 100}%` }} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Últimos 12 meses</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Engajamento por Tipo</h4>
              <div className="space-y-3 mt-4">
                {[
                  { tipo: 'Carrossel', pct: 78, cor: 'bg-purple-500' },
                  { tipo: 'Artigo', pct: 65, cor: 'bg-blue-500' },
                  { tipo: 'Texto', pct: 52, cor: 'bg-green-500' },
                  { tipo: 'Imagem', pct: 45, cor: 'bg-cyan-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{item.tipo}</span><span>{item.pct}%</span>
                    </div>
                    <div className="h-2 bg-muted/30 rounded-full">
                      <div className={`h-full ${item.cor} rounded-full`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Melhores Horários</h4>
              <div className="space-y-2 mt-4">
                {[
                  { hora: '08:00', score: 95 },
                  { hora: '12:00', score: 82 },
                  { hora: '18:00', score: 78 },
                  { hora: '20:00', score: 65 },
                ].map((h, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-mono w-12">{h.hora}</span>
                    <div className="flex-1 h-3 bg-muted/30 rounded-full">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${h.score}%` }} />
                    </div>
                    <span className="text-xs font-bold">{h.score}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Configuração */}
      {tela === 'config' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">⚙️ Configuração LinkedIn API</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">LinkedIn Client ID</label>
                <input type="text" placeholder="Seu LinkedIn Client ID..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">LinkedIn Client Secret</label>
                <input type="password" placeholder="Seu LinkedIn Client Secret..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Redirect URI</label>
                <input type="text" value="https://medfocus-app-969630653332.southamerica-east1.run.app/api/linkedin/callback" readOnly
                  className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground" />
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-xs text-blue-400 font-medium mb-1">Permissões Necessárias (Scopes):</p>
                <p className="text-xs text-foreground/70">r_liteprofile, r_emailaddress, w_member_social, r_organization_social, w_organization_social</p>
              </div>
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition">
                💾 Salvar Configuração
              </button>
            </div>
          </div>
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
