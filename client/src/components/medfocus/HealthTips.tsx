import React, { useState, useMemo } from 'react';

interface Tip { id: string; titulo: string; categoria: string; resumo: string; conteudo: string; fonte: string; icone: string; }

const TIPS: Tip[] = [
  { id:'1', titulo:'Hidratação: Quanto de água beber por dia?', categoria:'Nutrição', resumo:'A quantidade ideal varia conforme peso e atividade.', conteudo:'Recomendação: 35mL/kg/dia. Pessoa de 70kg: ~2,5L. Em dias quentes ou exercício, aumente 500mL-1L. Sinais de desidratação: urina escura, boca seca, fadiga.', fonte:'OMS / SBN', icone:'💧' },
  { id:'2', titulo:'Exercícios: 150 minutos por semana', categoria:'Exercícios', resumo:'A OMS recomenda 150 min de atividade moderada/semana.', conteudo:'Reduz 30% risco cardíaco, 27% diabetes tipo 2, 25% câncer mama/cólon. Comece com caminhadas 30min 5x/semana. Inclua fortalecimento muscular 2x/semana.', fonte:'OMS 2020 / AHA', icone:'🏃' },
  { id:'3', titulo:'Sono: 7-9 horas de descanso', categoria:'Sono', resumo:'Dormir bem é tão importante quanto alimentação.', conteudo:'Privação crônica aumenta risco de obesidade, diabetes, doenças CV e depressão. Dicas: horários regulares, evite telas 1h antes, quarto escuro 18-22°C, sem cafeína após 14h.', fonte:'NSF / SBN', icone:'😴' },
  { id:'4', titulo:'Saúde Mental: Sinais de alerta', categoria:'Saúde Mental', resumo:'Ansiedade e depressão são tratáveis.', conteudo:'Sinais: tristeza >2 semanas, perda de interesse, alterações sono/apetite, pensamentos negativos. Procure psicólogo/psiquiatra. CVV: 188 (24h).', fonte:'OMS / ABP / CVV', icone:'🧠' },
  { id:'5', titulo:'Alimentação: O prato saudável', categoria:'Nutrição', resumo:'Metade vegetais, 1/4 proteínas, 1/4 carboidratos.', conteudo:'Base: alimentos in natura. Evite ultraprocessados. 5 porções frutas/vegetais/dia. Prefira integrais. Limite sal 5g/dia, açúcar 25g/dia.', fonte:'Guia Alimentar MS', icone:'🥗' },
  { id:'6', titulo:'Vacinas essenciais para adultos', categoria:'Prevenção', resumo:'Adultos também precisam manter vacinas em dia.', conteudo:'Influenza (anual), COVID-19, Hepatite B (3 doses), dT/dTpa (10/10 anos), Febre Amarela. 60+: Pneumocócica, Herpes Zóster.', fonte:'PNI / SBIm', icone:'💉' },
  { id:'7', titulo:'Pressão Arterial: Conheça seus números', categoria:'Prevenção', resumo:'Hipertensão afeta 1 em 4 brasileiros.', conteudo:'Normal: <120/80. Pré-HAS: 120-139/80-89. HAS: ≥140/90. Reduza sal, exercite-se, mantenha peso saudável.', fonte:'SBC / Diretriz HAS 2020', icone:'❤️' },
  { id:'8', titulo:'Diabetes: Prevenir e controlar', categoria:'Prevenção', resumo:'DM2 pode ser prevenido com mudanças no estilo de vida.', conteudo:'Glicemia jejum normal: <100. Pré-DM: 100-125. DM: ≥126. Perda de 5-7% peso, 150min exercício/semana, fibras, evitar açúcar. Meta HbA1c <7%.', fonte:'SBD / ADA', icone:'🩸' },
  { id:'9', titulo:'Saúde da Mulher: Exames preventivos', categoria:'Saúde da Mulher', resumo:'Papanicolau e mamografia salvam vidas.', conteudo:'Papanicolau: 25+ anos, anual. Mamografia: 40+ anos, anual (SBM). Densitometria: 65+ ou pós-menopausa. Autoexame mamas: mensal.', fonte:'INCA / SBM / FEBRASGO', icone:'👩' },
  { id:'10', titulo:'Saúde do Homem: Check-up', categoria:'Saúde do Homem', resumo:'Homens vivem 7 anos menos. Prevenção é essencial.', conteudo:'PSA + toque: 50+ (45 se histórico). Colesterol/glicemia: 20+. Colonoscopia: 45+. PA: anual. Não ignore dor no peito ou sangue nas fezes.', fonte:'SBU / AUA / INCA', icone:'👨' },
  { id:'11', titulo:'Primeiros Socorros', categoria:'Emergências', resumo:'Saber agir nos primeiros minutos salva vidas.', conteudo:'PCR: ligue 192, compressões 100-120/min. Engasgo: Heimlich. AVC: Face-Arm-Speech-Time 192. Queimadura: água fria 20min. Convulsão: proteja cabeça.', fonte:'AHA / SAMU', icone:'🚑' },
  { id:'12', titulo:'Saúde Bucal', categoria:'Prevenção', resumo:'Problemas bucais afetam a saúde geral.', conteudo:'Escove 3x/dia com flúor. Fio dental diário. Dentista 6/6 meses. Periodontite ligada a doenças cardíacas e diabetes. Troque escova 3/3 meses.', fonte:'CFO / ADA', icone:'🦷' },
];

const CATS = ['Todas',...[...new Set(TIPS.map(t=>t.categoria))].sort()];

export default function HealthTips() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Todas');
  const [sel, setSel] = useState<Tip|null>(null);
  const filtered = useMemo(() => TIPS.filter(t => { const s = search.toLowerCase(); return (!s || t.titulo.toLowerCase().includes(s) || t.resumo.toLowerCase().includes(s)) && (cat === 'Todas' || t.categoria === cat); }), [search, cat]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6"><h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3"><span className="text-3xl">💡</span> Dicas de Saúde</h1><p className="text-sm text-muted-foreground mt-1">Informações confiáveis para cuidar da sua saúde</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[{v:TIPS.length,l:'Artigos',c:'text-primary'},{v:new Set(TIPS.map(t=>t.categoria)).size,l:'Categorias',c:'text-blue-400'},{v:TIPS.filter(t=>t.categoria==='Prevenção').length,l:'Prevenção',c:'text-green-400'},{v:TIPS.filter(t=>t.categoria==='Nutrição').length,l:'Nutrição',c:'text-orange-400'}].map((s,i)=>(
          <div key={i} className="bg-card border border-border rounded-xl p-4 text-center"><div className={`text-2xl font-bold ${s.c}`}>{s.v}</div><div className="text-xs text-muted-foreground">{s.l}</div></div>
        ))}
      </div>
      <div className="space-y-3 mb-6">
        <input type="text" placeholder="Buscar dicas..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none"/>
        <div className="flex flex-wrap gap-2">{CATS.map(c=><button key={c} onClick={()=>setCat(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium ${cat===c?'bg-primary text-primary-foreground':'bg-card border border-border hover:bg-accent'}`}>{c}</button>)}</div>
      </div>
      {sel ? (
        <div className="bg-card border border-border rounded-xl p-6">
          <button onClick={()=>setSel(null)} className="text-primary text-sm mb-4 hover:underline">← Voltar</button>
          <div className="flex items-center gap-3 mb-4"><span className="text-4xl">{sel.icone}</span><div><h2 className="text-xl font-bold">{sel.titulo}</h2><span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{sel.categoria}</span></div></div>
          <p className="text-sm text-foreground/80 leading-relaxed mb-4">{sel.conteudo}</p>
          <div className="p-3 bg-muted/30 rounded-lg"><p className="text-xs text-muted-foreground"><strong>Fonte:</strong> {sel.fonte}</p></div>
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"><p className="text-xs text-yellow-400">⚠️ Informações educacionais. Consulte seu médico.</p></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(t=>(
            <button key={t.id} onClick={()=>setSel(t)} className="bg-card border border-border rounded-xl p-4 text-left hover:bg-accent transition-all">
              <div className="flex items-center gap-2 mb-2"><span className="text-2xl">{t.icone}</span><span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t.categoria}</span></div>
              <h3 className="font-semibold text-sm mb-1">{t.titulo}</h3><p className="text-xs text-muted-foreground line-clamp-2">{t.resumo}</p>
            </button>
          ))}
          {!filtered.length && <div className="col-span-3 text-center py-12 text-muted-foreground"><p>Nenhuma dica encontrada.</p></div>}
        </div>
      )}
    </div>
  );
}
