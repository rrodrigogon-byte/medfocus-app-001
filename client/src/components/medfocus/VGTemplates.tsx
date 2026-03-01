/**
 * VGTemplates — Templates de Conteúdo Médico ViralGram
 * Biblioteca de templates prontos para redes sociais médicas com compliance CFM
 */
import React, { useState } from 'react';

interface Template {
  id: string;
  name: string;
  category: string;
  platform: string[];
  type: string;
  description: string;
  structure: string[];
  example: string;
  hashtags: string[];
  complianceTips: string[];
}

const TEMPLATES: Template[] = [
  {
    id: '1', name: 'Dica de Saúde Rápida', category: 'Educativo', platform: ['instagram', 'linkedin'], type: 'Post',
    description: 'Post curto e direto com uma dica prática de saúde para o público geral.',
    structure: ['Gancho (pergunta ou dado impactante)', 'Explicação simples (2-3 linhas)', 'Dica prática', 'CTA (salve, compartilhe)', 'Disclaimer médico'],
    example: '🫀 Você sabia que caminhar 30 minutos por dia reduz em 35% o risco de infarto?\n\nA atividade física regular é o melhor remédio preventivo que existe.\n\n✅ Dica: Comece com 15 minutos e aumente gradualmente.\n\n💾 Salve este post e compartilhe com quem precisa!\n\n⚕️ Conteúdo educativo. Consulte seu médico.',
    hashtags: ['#saude', '#dicadesaude', '#prevencao', '#medicina'],
    complianceTips: ['Não prometa resultados', 'Use dados de fontes confiáveis', 'Inclua disclaimer']
  },
  {
    id: '2', name: 'Carrossel Educativo', category: 'Educativo', platform: ['instagram'], type: 'Carrossel',
    description: 'Carrossel com 5-8 slides explicando um tema de saúde de forma visual.',
    structure: ['Slide 1: Título chamativo + pergunta', 'Slides 2-6: Conteúdo (1 informação por slide)', 'Slide 7: Resumo/Conclusão', 'Slide 8: CTA + Disclaimer'],
    example: 'SLIDE 1: 🧠 5 Sinais de que seu corpo precisa de atenção\n\nSLIDE 2: 1. Fadiga constante → Pode indicar anemia ou problemas tireoidianos\n\nSLIDE 3: 2. Dores de cabeça frequentes → Avalie pressão arterial e hidratação\n\n[...]\n\nSLIDE 8: ⚕️ Se identificou algum sinal, procure um médico. Este conteúdo é educativo.',
    hashtags: ['#saude', '#educacao', '#medicina', '#carrossel'],
    complianceTips: ['Não faça diagnósticos', 'Oriente a buscar profissional', 'Cite fontes']
  },
  {
    id: '3', name: 'Caso Clínico Anonimizado', category: 'Acadêmico', platform: ['linkedin'], type: 'Artigo',
    description: 'Discussão de caso clínico com dados completamente anonimizados.',
    structure: ['Introdução do caso (sem dados identificáveis)', 'Apresentação clínica', 'Hipóteses diagnósticas', 'Exames e resultados', 'Diagnóstico e conduta', 'Discussão e referências'],
    example: 'Paciente do sexo masculino, 58 anos, procurou atendimento com queixa de dor torácica retroesternal há 2 horas...\n\n[Caso completamente anonimizado conforme CFM]\n\nReferências: ESC Guidelines 2024',
    hashtags: ['#casoclinico', '#cardiologia', '#medicina', '#educacaomedica'],
    complianceTips: ['NUNCA identifique o paciente', 'Obtenha consentimento', 'Anonimize TODOS os dados', 'Não publique imagens do paciente']
  },
  {
    id: '4', name: 'Mitos e Verdades', category: 'Educativo', platform: ['instagram', 'linkedin'], type: 'Carrossel',
    description: 'Formato popular que desmistifica crenças sobre saúde.',
    structure: ['Slide 1: Título "Mitos e Verdades sobre [tema]"', 'Slides 2-6: MITO vs VERDADE (1 por slide)', 'Slide final: Referências + Disclaimer'],
    example: 'MITO: "Gripe se cura com antibiótico"\nVERDADE: Gripe é viral. Antibióticos tratam bactérias. O tratamento é sintomático + repouso.',
    hashtags: ['#mitoseverdades', '#saude', '#ciencia', '#educacao'],
    complianceTips: ['Use linguagem acessível', 'Cite fontes científicas', 'Não ridicularize crenças populares']
  },
  {
    id: '5', name: 'Roteiro de Reels/Vídeo', category: 'Vídeo', platform: ['instagram'], type: 'Vídeo',
    description: 'Script para vídeo curto (30-60s) explicando um tema médico.',
    structure: ['Hook (0-3s): Frase de impacto', 'Problema (3-10s): Contextualização', 'Solução (10-25s): Explicação', 'CTA (25-30s): Chamada para ação', 'Texto na tela: Disclaimer'],
    example: 'HOOK: "Esse hábito simples pode salvar sua vida"\n\nPROBLEMA: "A hipertensão atinge 1 em cada 4 brasileiros e muitos não sabem"\n\nSOLUÇÃO: "Medir a pressão regularmente é o primeiro passo. Veja como..."\n\nCTA: "Siga para mais dicas de saúde baseadas em ciência"',
    hashtags: ['#reels', '#saude', '#medicina', '#video'],
    complianceTips: ['Não use jaleco em contexto promocional', 'Não prometa resultados', 'Inclua disclaimer na tela']
  },
  {
    id: '6', name: 'Artigo LinkedIn Longo', category: 'Autoridade', platform: ['linkedin'], type: 'Artigo',
    description: 'Artigo profundo para construção de autoridade no LinkedIn.',
    structure: ['Título SEO-friendly', 'Introdução com gancho', 'Desenvolvimento (3-5 seções)', 'Dados e estatísticas', 'Conclusão com opinião profissional', 'Referências bibliográficas'],
    example: 'Título: "O Futuro da Telemedicina no Brasil: Oportunidades e Desafios para 2026"\n\nA telemedicina no Brasil cresceu 400% desde 2020...',
    hashtags: ['#telemedicina', '#saudeDigital', '#medicina', '#inovacao'],
    complianceTips: ['Cite suas credenciais', 'Use dados verificáveis', 'Mantenha tom profissional']
  },
  {
    id: '7', name: 'Bastidores do Consultório', category: 'Humanização', platform: ['instagram'], type: 'Stories/Post',
    description: 'Conteúdo humanizado mostrando a rotina profissional (sem pacientes).',
    structure: ['Contexto (onde você está)', 'O que está fazendo', 'Insight ou reflexão', 'Interação com seguidores'],
    example: 'Começando mais um dia no consultório! ☕\n\nHoje tenho 12 pacientes agendados. Entre uma consulta e outra, sempre reservo tempo para estudar os casos.\n\nO que vocês gostariam de saber sobre a rotina de um [especialidade]?',
    hashtags: ['#rotina', '#medicina', '#bastidores', '#consultorio'],
    complianceTips: ['NUNCA mostre pacientes', 'Não filme áreas com prontuários visíveis', 'Mantenha profissionalismo']
  },
  {
    id: '8', name: 'Lembrete de Saúde WhatsApp', category: 'WhatsApp', platform: ['whatsapp'], type: 'Mensagem',
    description: 'Template de mensagem para lembretes e comunicação com pacientes.',
    structure: ['Saudação personalizada', 'Informação objetiva', 'Orientação clara', 'Contato para dúvidas'],
    example: 'Olá, [Nome]! 👋\n\nLembramos que sua consulta está agendada para [data] às [hora].\n\n📋 Orientações:\n- Traga exames recentes\n- Chegue 15min antes\n- Traga documento com foto\n\nDúvidas? Responda esta mensagem.\n\nEquipe [Clínica]',
    hashtags: [],
    complianceTips: ['Use templates aprovados', 'Não envie diagnósticos por WhatsApp', 'Respeite LGPD']
  },
];

const CATEGORIES = [...new Set(TEMPLATES.map(t => t.category))];

export const VGTemplates: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const filtered = TEMPLATES.filter(t => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || t.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-4 md:p-6">
      <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
        ⚠️ <strong>Compliance CFM:</strong> Todos os templates incluem dicas de conformidade com a Resolução CFM 2.336/2023. Sempre revise o conteúdo antes de publicar.
      </div>

      <h1 className="text-2xl font-bold mb-1">📄 Templates de Conteúdo</h1>
      <p className="text-gray-400 text-sm mb-6">Biblioteca de templates prontos para suas redes sociais médicas</p>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input value={search} onChange={e => setSearch(e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm" placeholder="Buscar template..." />
        <div className="flex gap-2 overflow-x-auto">
          <button onClick={() => setSelectedCategory(null)} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${!selectedCategory ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-gray-400'}`}>Todos</button>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setSelectedCategory(c)} className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap ${selectedCategory === c ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-gray-400'}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(t => (
          <div key={t.id} onClick={() => setSelectedTemplate(t)} className="bg-white/5 rounded-xl p-5 border border-white/10 hover:border-emerald-500/30 cursor-pointer transition-all">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold">{t.name}</h3>
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-400">{t.type}</span>
            </div>
            <p className="text-sm text-gray-400 mb-3">{t.description}</p>
            <div className="flex gap-1 mb-2">
              {t.platform.map(p => <span key={p} className="text-xs px-2 py-0.5 rounded bg-white/10">{p === 'instagram' ? '📸' : p === 'linkedin' ? '💼' : '💬'} {p}</span>)}
            </div>
            <div className="text-xs text-emerald-400">{t.category}</div>
          </div>
        ))}
      </div>

      {/* Template Detail Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] rounded-2xl border border-white/10 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">{selectedTemplate.name}</h3>
                <div className="flex gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded bg-white/10">{selectedTemplate.type}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">{selectedTemplate.category}</span>
                </div>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="text-gray-500 hover:text-white text-xl">✕</button>
            </div>

            <p className="text-sm text-gray-400 mb-4">{selectedTemplate.description}</p>

            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-sm mb-2">📋 Estrutura</h4>
                <div className="bg-white/5 rounded-lg p-3 space-y-1">
                  {selectedTemplate.structure.map((s, i) => <div key={i} className="text-sm text-gray-300">• {s}</div>)}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm mb-2">💡 Exemplo</h4>
                <div className="bg-black/30 rounded-lg p-4 text-sm whitespace-pre-wrap">{selectedTemplate.example}</div>
              </div>

              {selectedTemplate.hashtags.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm mb-2">#️⃣ Hashtags Sugeridas</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedTemplate.hashtags.map((h, i) => <span key={i} className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">{h}</span>)}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-bold text-sm mb-2">🛡️ Dicas de Compliance CFM</h4>
                <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20 space-y-1">
                  {selectedTemplate.complianceTips.map((tip, i) => <div key={i} className="text-sm text-amber-300">⚠️ {tip}</div>)}
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium">✨ Usar Template</button>
              <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">📋 Copiar Exemplo</button>
              <button onClick={() => setSelectedTemplate(null)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VGTemplates;
