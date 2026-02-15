/**
 * MedFocus Global Research — Premium Design
 * Real-time scientific research discovery
 */
import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';

const MEDICAL_PATTERN = "https://private-us-east-1.manuscdn.com/sessionFile/IjuoZIpKtB1FShC9GQ88GW/sandbox/gZMRigkW6C4ldwaPiTYiad-img-4_1771179144000_na1fn_bWVkZm9jdXMtcGF0dGVybi1tZWRpY2Fs.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvSWp1b1pJcEt0QjFGU2hDOUdRODhHVy9zYW5kYm94L2daTVJpZ2tXNkM0bGR3YVBpVFlpYWQtaW1nLTRfMTc3MTE3OTE0NDAwMF9uYTFmbl9iV1ZrWm05amRYTXRjR0YwZEdWeWJpMXRaV1JwWTJGcy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=PMHEGPMmfd1Swv0AgXhhFevyzzN~VHK19lnO0wpJMpMa1xkBFs25MKwhYGKPu1lRacfYiyb6mQY6aDn-7ZPjfEgLf4OLXbcaUjXntbyhH7dIJRY4o4q-Z6fS4S1OF5unM7GmbePZt37qULV4yu1SoWF2P2cm5O6XM5bvf78RYfQg5c2IKirTTrGPDacDl6JDIkXxnEjYLgnuajI8OE1BUaAKcanzKdKDgcQ072j9u3051I8TrlQPPmhykyWUFvd1HPBQj-x7emE30BcltbqkKJhwldAjac6ZQEjJn9bXbggOd7WKAFxiRV-0UJgGY6gmHbaprvV7bX6oVebJRMwlHw__";

const trendingTopics = [
  { label: 'Imunoterapia', icon: 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z', color: 'text-rose-500 bg-rose-500/10' },
  { label: 'CRISPR', icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5', color: 'text-violet-500 bg-violet-500/10' },
  { label: 'IA Diagnóstica', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', color: 'text-blue-500 bg-blue-500/10' },
  { label: 'Vacinas RNAm', icon: 'M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18', color: 'text-emerald-500 bg-emerald-500/10' },
  { label: 'Microbioma', icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z', color: 'text-amber-500 bg-amber-500/10' },
  { label: 'Neuroplasticidade', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', color: 'text-cyan-500 bg-cyan-500/10' },
];

const GlobalResearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [research, setResearch] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTopic, setActiveTopic] = useState('');

  const researchMutation = trpc.ai.research.useMutation();

  const handleSearch = async (topic: string) => {
    if (!topic.trim()) return;
    setIsLoading(true); setSearchTerm(topic); setActiveTopic(topic);
    try {
      const result = await researchMutation.mutateAsync({ topic });
      setResearch(result);
    } catch { setResearch("Erro ao buscar pesquisas. Verifique sua conexão e tente novamente."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-44">
        <img src={MEDICAL_PATTERN} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c1829]/95 via-[#0f2035]/85 to-[#0d3b4a]/70" />
        <div className="relative z-10 h-full flex flex-col justify-center p-8">
          <p className="text-teal-300/80 text-xs font-semibold uppercase tracking-wider mb-1">Pesquisa Global</p>
          <h1 className="text-3xl font-display font-extrabold text-white tracking-tight">Avanços Científicos</h1>
          <p className="text-white/50 text-sm font-medium mt-1">Descubra as pesquisas mais recentes em medicina</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchTerm)}
              placeholder="Pesquisar avanços, cientistas ou patologias..."
              className="w-full pl-11 pr-4 py-3 bg-muted/50 border border-border rounded-lg outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>
          <button onClick={() => handleSearch(searchTerm)}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all active:scale-95 shrink-0">
            Buscar
          </button>
        </div>

        {/* Trending */}
        <div className="flex flex-wrap gap-2 mt-4">
          {trendingTopics.map((t, i) => (
            <button key={i} onClick={() => handleSearch(t.label)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border border-border hover:border-primary/50 transition-all ${activeTopic === t.label ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-card text-muted-foreground hover:text-foreground'}`}>
              <div className={`w-5 h-5 rounded flex items-center justify-center ${t.color}`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d={t.icon} /></svg>
              </div>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="h-60 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-primary animate-pulse-soft">Analisando literatura global...</p>
        </div>
      ) : research && (
        <div className="bg-card border border-border rounded-xl overflow-hidden animate-slide-up">
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"/></svg>
            </div>
            <div>
              <h3 className="font-display font-bold text-foreground text-sm">Resultados para "{activeTopic}"</h3>
              <p className="text-[10px] text-muted-foreground font-medium">Fontes: PubMed, NEJM, Nature Medicine, The Lancet</p>
            </div>
          </div>
          <div className="p-5 space-y-3">
            {research.split('\n').filter(Boolean).map((line, i) => (
              <div key={i} className={`p-4 rounded-lg text-sm text-foreground/80 leading-relaxed font-medium ${
                line.startsWith('-') || line.startsWith('•') ? 'bg-primary/5 border-l-3 border-primary' : 'bg-muted/30'
              }`}>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {!research && !isLoading && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-muted rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <p className="text-sm font-semibold text-muted-foreground">Pesquise um tema ou selecione um tópico em alta</p>
          <p className="text-xs text-muted-foreground/60 mt-1">A IA analisará as publicações mais recentes para você</p>
        </div>
      )}
    </div>
  );
};

export default GlobalResearch;
