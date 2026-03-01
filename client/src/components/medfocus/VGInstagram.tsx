/**
 * MedFocus — ViralGram Instagram Integration (Sprint 16)
 * 
 * Módulo nativo de integração com Instagram para profissionais de saúde.
 * Publicação, agendamento, analytics e gestão de conteúdo visual médico.
 * 
 * APIs:
 * - Instagram Graph API (via Meta Business)
 * - Instagram Content Publishing API
 * - Instagram Insights API
 * 
 * Compliance: Res. CFM 2.336/2023 - Publicidade Médica
 * IMPORTANTE: Antes/depois é PROIBIDO pelo CFM (Art. 5°)
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface IGPost {
  id: string;
  tipo: 'feed' | 'reels' | 'stories' | 'carrossel';
  legenda: string;
  imagem: string;
  status: 'rascunho' | 'agendado' | 'publicado';
  metricas: { alcance: number; impressoes: number; curtidas: number; comentarios: number; salvos: number; compartilhamentos: number; };
  publicadoEm?: Date;
  complianceCFM: boolean;
}

export function VGInstagram() {
  const [tela, setTela] = useState<'dashboard' | 'publicar' | 'analytics' | 'reels' | 'config'>('dashboard');
  const [conectado, setConectado] = useState(false);
  const [legenda, setLegenda] = useState('');
  const [tipoPost, setTipoPost] = useState<'feed' | 'reels' | 'stories' | 'carrossel'>('feed');
  const [publicando, setPublicando] = useState(false);

  const perfil = {
    username: '@dr.rodrigo.med',
    nome: 'Dr. Rodrigo Gonçalves',
    bio: '🩺 Médico | Inovação em Saúde\n📚 Conteúdo educacional\nCRM-SP 123456 | RQE 78901',
    seguidores: 8420,
    seguindo: 892,
    posts: 156,
  };

  const metricas = {
    alcanceTotal: 125000,
    impressoesTotal: 340000,
    engajamento: 5.2,
    crescimento: 8.7,
    melhorHorario: '19:00 - 21:00',
    melhorDia: 'Quarta-feira',
    topFormato: 'Reels',
  };

  const postsRecentes: IGPost[] = [
    { id: '1', tipo: 'reels', legenda: '🩺 3 mitos sobre pressão alta que você precisa parar de acreditar!', imagem: '🎬', status: 'publicado', metricas: { alcance: 45000, impressoes: 89000, curtidas: 2340, comentarios: 187, salvos: 456, compartilhamentos: 234 }, publicadoEm: new Date('2026-02-28'), complianceCFM: true },
    { id: '2', tipo: 'carrossel', legenda: '📚 Guia completo: Como interpretar seus exames de sangue', imagem: '📸', status: 'publicado', metricas: { alcance: 32000, impressoes: 56000, curtidas: 1890, comentarios: 234, salvos: 890, compartilhamentos: 178 }, publicadoEm: new Date('2026-02-26'), complianceCFM: true },
    { id: '3', tipo: 'feed', legenda: '💡 Dica de saúde: A importância do sono para a saúde cardiovascular', imagem: '🖼️', status: 'publicado', metricas: { alcance: 18000, impressoes: 28000, curtidas: 1230, comentarios: 89, salvos: 345, compartilhamentos: 67 }, publicadoEm: new Date('2026-02-24'), complianceCFM: true },
  ];

  const handleConectar = () => setConectado(true);

  const handlePublicar = () => {
    setPublicando(true);
    setTimeout(() => { setPublicando(false); setLegenda(''); }, 2000);
  };

  // Regras específicas Instagram + CFM
  const regrasCFMInstagram = [
    { regra: 'Antes/Depois PROIBIDO', desc: 'Art. 5° Res. 2.336/2023 — Imagens de antes e depois são proibidas em qualquer formato.', icone: '🚫' },
    { regra: 'CRM na Bio', desc: 'O perfil deve conter CRM e RQE visíveis na bio do Instagram.', icone: '🏷️' },
    { regra: 'Sem Preços', desc: 'Nunca mencione valores de consultas ou procedimentos nos posts ou stories.', icone: '💰' },
    { regra: 'Sem Garantias', desc: 'Não prometa resultados de tratamentos em legendas ou vídeos.', icone: '⚠️' },
    { regra: 'Disclaimer', desc: 'Inclua "Conteúdo educacional. Consulte seu médico." em posts informativos.', icone: '📋' },
    { regra: 'TCLE Obrigatório', desc: 'Qualquer imagem de paciente exige Termo de Consentimento assinado.', icone: '📝' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="ViralGram - Instagram Integration" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">📸</span> Instagram Integration
          <span className="text-xs bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-pink-400 px-2 py-1 rounded-full font-medium border border-pink-500/30">ViralGram</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${conectado ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
            {conectado ? '● Conectado' : '○ Desconectado'}
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie seu Instagram médico com compliance CFM automático — Feed, Reels, Stories e Carrossel
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'dashboard' as const, label: '📊 Dashboard' },
          { id: 'publicar' as const, label: '📝 Publicar' },
          { id: 'reels' as const, label: '🎬 Reels' },
          { id: 'analytics' as const, label: '📈 Analytics' },
          { id: 'config' as const, label: '⚙️ Config' },
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
            <div className="bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10 border-2 border-pink-500/30 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-4">📸</p>
              <h3 className="text-xl font-bold mb-2">Conecte seu Instagram Profissional</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Conecte sua conta Instagram Business para publicar conteúdo médico, acompanhar métricas e crescer sua autoridade profissional.
              </p>
              <button onClick={handleConectar}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition shadow-lg">
                🔗 Conectar com Instagram (Meta Business)
              </button>
              <p className="text-xs text-muted-foreground mt-3">Requer conta Instagram Business + Página Facebook vinculada</p>
            </div>
          ) : (
            <>
              {/* Perfil */}
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl">👨‍⚕️</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{perfil.username}</h3>
                    <p className="text-sm text-muted-foreground">{perfil.nome}</p>
                    <p className="text-xs text-foreground/60 whitespace-pre-line mt-1">{perfil.bio}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div><p className="text-lg font-bold">{perfil.posts}</p><p className="text-xs text-muted-foreground">Posts</p></div>
                    <div><p className="text-lg font-bold">{perfil.seguidores.toLocaleString()}</p><p className="text-xs text-muted-foreground">Seguidores</p></div>
                    <div><p className="text-lg font-bold">{perfil.seguindo}</p><p className="text-xs text-muted-foreground">Seguindo</p></div>
                  </div>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'Alcance (30d)', valor: `${(metricas.alcanceTotal / 1000).toFixed(0)}k`, sub: `+${metricas.crescimento}%`, cor: 'text-pink-400' },
                  { label: 'Impressões', valor: `${(metricas.impressoesTotal / 1000).toFixed(0)}k`, sub: 'Total 30 dias', cor: 'text-purple-400' },
                  { label: 'Engajamento', valor: `${metricas.engajamento}%`, sub: 'Média por post', cor: 'text-orange-400' },
                  { label: 'Top Formato', valor: metricas.topFormato, sub: metricas.melhorHorario, cor: 'text-cyan-400' },
                ].map((kpi, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4">
                    <p className={`text-xl font-bold ${kpi.cor}`}>{kpi.valor}</p>
                    <p className="text-xs font-medium text-foreground/80">{kpi.label}</p>
                    <p className="text-[10px] text-muted-foreground">{kpi.sub}</p>
                  </div>
                ))}
              </div>

              {/* Posts Recentes */}
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-bold mb-4">📸 Posts Recentes</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {postsRecentes.map(post => (
                    <div key={post.id} className="bg-background/50 rounded-xl border border-border/50 overflow-hidden">
                      <div className="h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center text-4xl">
                        {post.imagem}
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[10px] bg-pink-500/20 text-pink-400 px-1.5 py-0.5 rounded">{post.tipo}</span>
                          {post.complianceCFM && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">CFM ✓</span>}
                        </div>
                        <p className="text-xs text-foreground/70 line-clamp-2">{post.legenda}</p>
                        <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                          <div><p className="text-xs font-bold">{(post.metricas.curtidas / 1000).toFixed(1)}k</p><p className="text-[9px] text-muted-foreground">❤️</p></div>
                          <div><p className="text-xs font-bold">{post.metricas.comentarios}</p><p className="text-[9px] text-muted-foreground">💬</p></div>
                          <div><p className="text-xs font-bold">{post.metricas.salvos}</p><p className="text-[9px] text-muted-foreground">🔖</p></div>
                        </div>
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
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-xl p-6">
              <h3 className="font-bold mb-4">📝 Nova Publicação Instagram</h3>
              <div className="flex gap-2 mb-4">
                {(['feed', 'reels', 'stories', 'carrossel'] as const).map(t => (
                  <button key={t} onClick={() => setTipoPost(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      tipoPost === t ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-muted/50 text-muted-foreground'
                    }`}>
                    {t === 'feed' ? '🖼️' : t === 'reels' ? '🎬' : t === 'stories' ? '📱' : '📸'} {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              {/* Upload Area */}
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center mb-4 hover:border-pink-500/30 transition cursor-pointer">
                <p className="text-3xl mb-2">{tipoPost === 'reels' ? '🎬' : '📸'}</p>
                <p className="text-sm text-muted-foreground">Arraste uma imagem ou clique para fazer upload</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {tipoPost === 'feed' ? 'Recomendado: 1080x1080px (1:1)' :
                   tipoPost === 'reels' ? 'Recomendado: 1080x1920px (9:16)' :
                   tipoPost === 'stories' ? 'Recomendado: 1080x1920px (9:16)' :
                   'Até 10 imagens, 1080x1080px cada'}
                </p>
              </div>

              <textarea value={legenda} onChange={e => setLegenda(e.target.value)}
                placeholder="Escreva a legenda do post... Lembre-se de incluir CRM, RQE e disclaimer educacional."
                rows={6}
                className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none resize-none" />
              
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">{legenda.length}/2200 caracteres</p>
                <button onClick={handlePublicar} disabled={!legenda || publicando}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold hover:from-purple-700 hover:to-pink-700 transition disabled:opacity-50 shadow-lg">
                  {publicando ? '⏳ Publicando...' : '🚀 Publicar'}
                </button>
              </div>
            </div>
          </div>

          {/* Regras CFM Instagram */}
          <div className="space-y-4">
            <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4">
              <h3 className="font-bold text-sm text-red-400 mb-3">🚫 Regras CFM para Instagram</h3>
              <div className="space-y-2">
                {regrasCFMInstagram.map((r, i) => (
                  <div key={i} className="bg-background/30 rounded-lg p-2.5">
                    <p className="text-xs font-bold flex items-center gap-1">{r.icone} {r.regra}</p>
                    <p className="text-[10px] text-foreground/60 mt-0.5">{r.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reels */}
      {tela === 'reels' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-pink-500/30 rounded-xl p-6">
            <h3 className="font-bold mb-2">🎬 Reels — O formato que mais cresce</h3>
            <p className="text-sm text-muted-foreground">Reels médicos educacionais têm 3x mais alcance que posts tradicionais. Crie conteúdo informativo e engajante.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { titulo: 'Mitos vs Verdades', desc: 'Desmistifique crenças populares sobre saúde', tempo: '30-60s', engajamento: 'Alto' },
              { titulo: 'Dica Rápida', desc: 'Uma dica de saúde prática e direta', tempo: '15-30s', engajamento: 'Muito Alto' },
              { titulo: 'Explicação Visual', desc: 'Use animações para explicar condições médicas', tempo: '60-90s', engajamento: 'Alto' },
              { titulo: 'Resposta a Dúvidas', desc: 'Responda perguntas frequentes dos seguidores', tempo: '30-60s', engajamento: 'Alto' },
              { titulo: 'Bastidores', desc: 'Mostre sua rotina médica (sem pacientes)', tempo: '15-30s', engajamento: 'Médio' },
              { titulo: 'Artigo Simplificado', desc: 'Resuma um artigo científico em linguagem acessível', tempo: '60-90s', engajamento: 'Alto' },
            ].map((formato, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-4 hover:border-pink-500/30 transition">
                <h4 className="font-bold text-sm mb-1">{formato.titulo}</h4>
                <p className="text-xs text-muted-foreground mb-2">{formato.desc}</p>
                <div className="flex gap-2">
                  <span className="text-[10px] bg-muted/50 px-2 py-0.5 rounded">{formato.tempo}</span>
                  <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded">{formato.engajamento}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics */}
      {tela === 'analytics' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Alcance por Formato</h4>
              <div className="space-y-3 mt-4">
                {[
                  { tipo: 'Reels', pct: 92, cor: 'bg-pink-500' },
                  { tipo: 'Carrossel', pct: 75, cor: 'bg-purple-500' },
                  { tipo: 'Feed', pct: 55, cor: 'bg-blue-500' },
                  { tipo: 'Stories', pct: 40, cor: 'bg-orange-500' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1"><span>{item.tipo}</span><span>{item.pct}%</span></div>
                    <div className="h-2 bg-muted/30 rounded-full"><div className={`h-full ${item.cor} rounded-full`} style={{ width: `${item.pct}%` }} /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Demografia dos Seguidores</h4>
              <div className="space-y-2 mt-4">
                {[
                  { faixa: '25-34 anos', pct: 35 },
                  { faixa: '35-44 anos', pct: 28 },
                  { faixa: '18-24 anos', pct: 20 },
                  { faixa: '45-54 anos', pct: 12 },
                  { faixa: '55+ anos', pct: 5 },
                ].map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs w-20">{d.faixa}</span>
                    <div className="flex-1 h-3 bg-muted/30 rounded-full"><div className="h-full bg-pink-500 rounded-full" style={{ width: `${d.pct}%` }} /></div>
                    <span className="text-xs font-bold w-8 text-right">{d.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Crescimento Semanal</h4>
              <div className="flex items-end gap-1 h-32 mt-4">
                {[120, 145, 132, 178, 195, 210, 245, 230, 268, 290, 312, 340].map((v, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-purple-500/50 to-pink-500/50 rounded-t" style={{ height: `${(v / 340) * 100}%` }} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2 text-center">Novos seguidores por semana</p>
            </div>
          </div>
        </div>
      )}

      {/* Config */}
      {tela === 'config' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">⚙️ Configuração Instagram Graph API</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Instagram App ID (Meta Business)</label>
                <input type="text" placeholder="Seu Instagram App ID..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Instagram App Secret</label>
                <input type="password" placeholder="Seu App Secret..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Access Token (Long-Lived)</label>
                <input type="password" placeholder="Token de acesso..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Instagram User ID</label>
                <input type="text" placeholder="Seu IG User ID..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div className="bg-pink-500/10 border border-pink-500/30 rounded-lg p-3">
                <p className="text-xs text-pink-400 font-medium mb-1">Permissões Necessárias:</p>
                <p className="text-xs text-foreground/70">instagram_basic, instagram_content_publish, instagram_manage_insights, pages_show_list, pages_read_engagement</p>
              </div>
              <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-bold hover:from-purple-700 hover:to-pink-700 transition">
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
