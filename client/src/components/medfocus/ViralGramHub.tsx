/**
 * MedFocus — ViralGram Hub (Integração)
 * 
 * Hub de integração do ViralGram dentro do MedFocus.
 * Permite acesso direto a todas as funcionalidades do ViralGram:
 * - Personal Branding Engine com IA
 * - Pipeline Nexus IA (agência autônoma)
 * - Geração de conteúdo viral
 * - Analytics e métricas
 * - Squad NOSSA GENTE
 * - Calendário editorial
 * - Instagram/LinkedIn integração
 */

import React, { useState } from 'react';

interface ViralGramModulo {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  rota: string;
  categoria: string;
  status: 'ativo' | 'beta' | 'em-breve';
}

const VIRALGRAM_URL = 'https://viralgram.uisa.com.br';

const MODULOS_VIRALGRAM: ViralGramModulo[] = [
  // Núcleo IA
  { id: 'nexus', nome: 'Nexus AI', descricao: 'Agência autônoma completa — Pipeline de conteúdo com IA', icone: '🧠', rota: '/nexus', categoria: 'Núcleo IA', status: 'ativo' },
  { id: 'diagnostic', nome: 'Diagnóstico', descricao: 'Análise completa do perfil com IA', icone: '🔍', rota: '/diagnostic', categoria: 'Núcleo IA', status: 'ativo' },
  { id: 'strategy', nome: 'Estratégia', descricao: 'Roadmap e pilares de conteúdo', icone: '🗺️', rota: '/strategy', categoria: 'Núcleo IA', status: 'ativo' },
  { id: 'auto-content', nome: 'Auto Conteúdo', descricao: 'Geração automática de posts virais', icone: '✨', rota: '/auto-content', categoria: 'Núcleo IA', status: 'ativo' },
  { id: 'reviews', nome: 'Revisões IA', descricao: 'Revisão inteligente de conteúdo', icone: '📝', rota: '/reviews', categoria: 'Núcleo IA', status: 'ativo' },
  { id: 'ab-testing', nome: 'A/B Testing', descricao: 'Testes de variação de conteúdo', icone: '🧪', rota: '/ab-testing', categoria: 'Núcleo IA', status: 'ativo' },
  
  // Conteúdo
  { id: 'content', nome: 'Conteúdo', descricao: 'Criação e gestão de posts', icone: '📄', rota: '/content', categoria: 'Conteúdo', status: 'ativo' },
  { id: 'approvals', nome: 'Aprovações', descricao: 'Fluxo de aprovação de conteúdo', icone: '✅', rota: '/approvals', categoria: 'Conteúdo', status: 'ativo' },
  { id: 'templates', nome: 'Templates', descricao: 'Modelos prontos para posts', icone: '📋', rota: '/templates', categoria: 'Conteúdo', status: 'ativo' },
  { id: 'images', nome: 'Imagens', descricao: 'Geração de imagens com IA', icone: '🖼️', rota: '/images', categoria: 'Conteúdo', status: 'ativo' },
  { id: 'videos', nome: 'Vídeos IA', descricao: 'Criação de vídeos com IA', icone: '🎬', rota: '/videos', categoria: 'Conteúdo', status: 'ativo' },
  
  // Publicação
  { id: 'calendar', nome: 'Calendário', descricao: 'Calendário editorial completo', icone: '📅', rota: '/calendar', categoria: 'Publicação', status: 'ativo' },
  { id: 'scheduling', nome: 'Agendamento', descricao: 'Agendar publicações', icone: '⏰', rota: '/scheduling', categoria: 'Publicação', status: 'ativo' },
  { id: 'auto-publish', nome: 'Auto Publish', descricao: 'Publicação automática', icone: '🚀', rota: '/auto-publish', categoria: 'Publicação', status: 'ativo' },
  { id: 'publish-queue', nome: 'Fila de Publicação', descricao: 'Gerenciar fila de posts', icone: '📤', rota: '/publish-queue', categoria: 'Publicação', status: 'ativo' },
  { id: 'instagram', nome: 'Instagram API', descricao: 'Integração direta com Instagram', icone: '📸', rota: '/instagram', categoria: 'Publicação', status: 'ativo' },
  { id: 'historical', nome: 'Histórico LinkedIn', descricao: 'Posts publicados no LinkedIn', icone: '💼', rota: '/historical', categoria: 'Publicação', status: 'ativo' },
  
  // Analytics
  { id: 'metrics', nome: 'Métricas', descricao: 'Dashboard de métricas', icone: '📊', rota: '/metrics', categoria: 'Analytics', status: 'ativo' },
  { id: 'analytics', nome: 'Analytics', descricao: 'Análise avançada de dados', icone: '📈', rota: '/analytics', categoria: 'Analytics', status: 'ativo' },
  { id: 'engagement', nome: 'Engajamento', descricao: 'Relatório de engajamento', icone: '💬', rota: '/engagement', categoria: 'Analytics', status: 'ativo' },
  { id: 'roi', nome: 'Dashboard ROI', descricao: 'Retorno sobre investimento', icone: '💰', rota: '/roi', categoria: 'Analytics', status: 'ativo' },
  { id: 'benchmark', nome: 'Benchmarking', descricao: 'Comparação global', icone: '🌍', rota: '/benchmark', categoria: 'Analytics', status: 'ativo' },
  { id: 'influencers', nome: 'Influencers', descricao: 'Benchmark com top influencers', icone: '👑', rota: '/influencers', categoria: 'Analytics', status: 'ativo' },
  { id: 'competitors', nome: 'Concorrentes', descricao: 'Análise de concorrentes', icone: '🎯', rota: '/competitors', categoria: 'Analytics', status: 'ativo' },
  { id: 'trending', nome: 'Trending Topics', descricao: 'Temas em alta', icone: '🔥', rota: '/trending', categoria: 'Analytics', status: 'ativo' },
  
  // Operações
  { id: 'squad', nome: 'NOSSA GENTE', descricao: 'Squad de agentes IA + tickets', icone: '🤖', rota: '/squad', categoria: 'Operações', status: 'ativo' },
  { id: 'reports', nome: 'Relatórios', descricao: 'Relatórios gerenciais', icone: '📑', rota: '/reports', categoria: 'Operações', status: 'ativo' },
  { id: 'weekly-report', nome: 'Relatório Semanal', descricao: 'Resumo semanal automático', icone: '📧', rota: '/weekly-report', categoria: 'Operações', status: 'ativo' },
  { id: 'collaboration', nome: 'Colaboração', descricao: 'Trabalho em equipe', icone: '🤝', rota: '/collaboration', categoria: 'Operações', status: 'ativo' },
  { id: 'webhooks', nome: 'Webhooks', descricao: 'Integrações via webhook', icone: '🔗', rota: '/webhooks', categoria: 'Operações', status: 'ativo' },
];

export function ViralGramHub() {
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>('todos');
  const [busca, setBusca] = useState('');

  const categorias = ['todos', ...new Set(MODULOS_VIRALGRAM.map(m => m.categoria))];

  const modulosFiltrados = MODULOS_VIRALGRAM.filter(m => {
    const matchCategoria = categoriaAtiva === 'todos' || m.categoria === categoriaAtiva;
    const matchBusca = !busca || m.nome.toLowerCase().includes(busca.toLowerCase()) || m.descricao.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  const abrirModulo = (rota: string) => {
    window.open(`${VIRALGRAM_URL}${rota}`, '_blank');
  };

  const stats = [
    { label: 'Módulos Ativos', valor: MODULOS_VIRALGRAM.filter(m => m.status === 'ativo').length, cor: 'text-green-400' },
    { label: 'Categorias', valor: categorias.length - 1, cor: 'text-blue-400' },
    { label: 'Agentes IA', valor: 8, cor: 'text-purple-400' },
    { label: 'Integrações', valor: 4, cor: 'text-cyan-400' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl shadow-lg">
            🚀
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              ViralGram Hub
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full font-medium">INTEGRADO</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Personal Branding Engine com IA — Acesso direto a todas as funcionalidades
            </p>
          </div>
        </div>

        {/* Link direto */}
        <a href={VIRALGRAM_URL} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl text-sm text-purple-300 hover:bg-purple-500/30 transition">
          🌐 Abrir ViralGram Completo → {VIRALGRAM_URL}
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={`text-2xl font-bold ${s.cor}`}>{s.valor}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Busca e Filtros */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar módulo..."
          className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm focus:border-primary focus:outline-none"
        />
        <div className="flex gap-2 flex-wrap">
          {categorias.map(cat => (
            <button key={cat} onClick={() => setCategoriaAtiva(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition ${
                categoriaAtiva === cat
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'bg-card border border-border hover:bg-accent'
              }`}>
              {cat === 'todos' ? '📦 Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Módulos */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modulosFiltrados.map(modulo => (
          <div key={modulo.id}
            onClick={() => abrirModulo(modulo.rota)}
            className="bg-card border border-border rounded-xl p-5 hover:border-purple-500/30 hover:shadow-lg transition cursor-pointer group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{modulo.icone}</span>
                <div>
                  <p className="font-bold group-hover:text-purple-400 transition">{modulo.nome}</p>
                  <p className="text-xs text-muted-foreground">{modulo.descricao}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                modulo.status === 'ativo' ? 'bg-green-500/10 text-green-400' :
                modulo.status === 'beta' ? 'bg-yellow-500/10 text-yellow-400' :
                'bg-muted/50 text-muted-foreground'
              }`}>
                {modulo.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{modulo.categoria}</span>
              <span className="group-hover:text-purple-400 transition">Abrir →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ações Rápidas */}
      <div className="mt-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/30 rounded-2xl p-6">
        <h3 className="font-bold mb-4">⚡ Ações Rápidas</h3>
        <div className="grid md:grid-cols-4 gap-3">
          {[
            { label: 'Pipeline Nexus IA', desc: 'Executar pipeline completo', rota: '/nexus', icone: '🧠' },
            { label: 'Novo Diagnóstico', desc: 'Analisar perfil com IA', rota: '/diagnostic', icone: '🔍' },
            { label: 'Gerar Conteúdo', desc: 'Criar posts virais', rota: '/content', icone: '✨' },
            { label: 'NOSSA GENTE', desc: 'Squad de agentes IA', rota: '/squad', icone: '🤖' },
          ].map((acao, i) => (
            <button key={i} onClick={() => abrirModulo(acao.rota)}
              className="bg-card border border-border rounded-xl p-4 hover:border-purple-500/30 transition text-left">
              <span className="text-2xl">{acao.icone}</span>
              <p className="font-medium text-sm mt-2">{acao.label}</p>
              <p className="text-xs text-muted-foreground">{acao.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
