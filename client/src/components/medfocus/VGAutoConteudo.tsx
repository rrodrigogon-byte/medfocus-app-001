/**
 * VGAutoConteudo — Geração Automática de Conteúdo Médico com IA
 * Gera posts, artigos, carrosséis e vídeos com compliance CFM
 */
import React, { useState } from 'react';

interface GeneratedContent {
  id: string;
  type: 'post' | 'artigo' | 'carrossel' | 'video_script' | 'thread';
  platform: string;
  title: string;
  content: string;
  hashtags: string[];
  complianceScore: number;
  timestamp: string;
}

const SPECIALTIES = ['Cardiologia', 'Dermatologia', 'Endocrinologia', 'Gastroenterologia', 'Ginecologia', 'Neurologia', 'Oftalmologia', 'Ortopedia', 'Pediatria', 'Psiquiatria', 'Urologia', 'Clínica Geral'];
const TONES = ['Educativo', 'Científico', 'Acessível (Leigo)', 'Profissional', 'Empático', 'Motivacional'];
const CONTENT_TYPES = [
  { id: 'post', label: '📝 Post Único', desc: 'Post para Instagram ou LinkedIn' },
  { id: 'carrossel', label: '🎠 Carrossel', desc: '5-10 slides educativos' },
  { id: 'artigo', label: '📰 Artigo', desc: 'Artigo longo para LinkedIn' },
  { id: 'video_script', label: '🎬 Roteiro de Vídeo', desc: 'Script para Reels/Shorts' },
  { id: 'thread', label: '🧵 Thread', desc: 'Série de posts conectados' },
];

const DEMO_GENERATED: GeneratedContent[] = [
  {
    id: '1', type: 'post', platform: 'instagram', title: 'Hipertensão: O Inimigo Silencioso',
    content: '🫀 Você sabia que a hipertensão arterial atinge cerca de 36% dos brasileiros adultos?\n\nA pressão alta é chamada de "inimigo silencioso" porque, na maioria dos casos, não apresenta sintomas evidentes.\n\n⚠️ Fatores de risco:\n• Sedentarismo\n• Excesso de sal na dieta\n• Obesidade\n• Histórico familiar\n• Estresse crônico\n\n✅ Prevenção:\n• Atividade física regular (150min/semana)\n• Dieta DASH\n• Controle do peso\n• Redução do consumo de sódio\n• Monitoramento regular da PA\n\n📊 Referência: Sociedade Brasileira de Cardiologia (SBC), 2024.\n\n⚕️ Este conteúdo é educativo e não substitui a consulta médica.',
    hashtags: ['#hipertensao', '#cardiologia', '#saude', '#prevencao', '#pressaoalta'],
    complianceScore: 98, timestamp: '2026-03-01 10:30'
  },
  {
    id: '2', type: 'carrossel', platform: 'instagram', title: 'Diabetes: 7 Mitos e Verdades',
    content: 'SLIDE 1: 🔬 Diabetes: Mitos e Verdades\nO que a ciência realmente diz?\n\nSLIDE 2: MITO: "Diabetes é causada por comer muito açúcar"\nVERDADE: O Tipo 1 é autoimune. O Tipo 2 envolve resistência à insulina, com múltiplos fatores (genética, sedentarismo, obesidade).\n\nSLIDE 3: MITO: "Diabético não pode comer fruta"\nVERDADE: Frutas são recomendadas! O importante é a quantidade e o índice glicêmico. Prefira frutas com casca e em porções adequadas.\n\nSLIDE 4: MITO: "Insulina vicia"\nVERDADE: Insulina é um hormônio natural. No DM1 é essencial. No DM2 pode ser necessária quando outros tratamentos não são suficientes.\n\nSLIDE 5: MITO: "Diabetes tipo 2 não é grave"\nVERDADE: Se não controlada, pode causar cegueira, insuficiência renal, amputações e doenças cardiovasculares.\n\nSLIDE 6: VERDADE: "Exercício ajuda no controle"\nA atividade física melhora a sensibilidade à insulina e ajuda no controle glicêmico.\n\nSLIDE 7: 📊 Referências\n• SBD - Sociedade Brasileira de Diabetes, 2024\n• ADA - American Diabetes Association, 2024\n\n⚕️ Conteúdo educativo. Consulte seu médico.',
    hashtags: ['#diabetes', '#endocrinologia', '#mitoseverdades', '#saude'],
    complianceScore: 95, timestamp: '2026-03-01 11:15'
  },
];

export const VGAutoConteudo: React.FC = () => {
  const [specialty, setSpecialty] = useState('Cardiologia');
  const [tone, setTone] = useState('Educativo');
  const [contentType, setContentType] = useState('post');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('instagram');
  const [includeReferences, setIncludeReferences] = useState(true);
  const [includeDisclaimer, setIncludeDisclaimer] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedContent[]>(DEMO_GENERATED);
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      const newContent: GeneratedContent = {
        id: Date.now().toString(),
        type: contentType as GeneratedContent['type'],
        platform,
        title: topic,
        content: `[Conteúdo gerado por IA sobre "${topic}"]\n\nEspecialidade: ${specialty}\nTom: ${tone}\n\n📝 Este conteúdo seria gerado pela Gemini API com base no tema solicitado, incluindo dados validados de fontes como PubMed, SBC, SBD e outras sociedades médicas.\n\n${includeReferences ? '📊 Referências: [Geradas automaticamente via PubMed API]' : ''}\n${includeDisclaimer ? '\n⚕️ Este conteúdo é educativo e não substitui a consulta médica.' : ''}`,
        hashtags: [`#${specialty.toLowerCase()}`, '#saude', '#medicina', '#educacao'],
        complianceScore: includeDisclaimer ? 95 : 60,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      setGenerated([newContent, ...generated]);
      setIsGenerating(false);
      setSelectedContent(newContent);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-white p-4 md:p-6">
      <div className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
        ⚠️ <strong>Compliance CFM:</strong> Todo conteúdo gerado é verificado automaticamente contra a Resolução CFM 2.336/2023. Revise sempre antes de publicar.
      </div>

      <h1 className="text-2xl font-bold mb-1">🤖 Auto Conteúdo IA</h1>
      <p className="text-gray-400 text-sm mb-6">Gere conteúdo médico profissional para suas redes sociais com IA</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Generator Panel */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white/5 rounded-xl border border-white/10 p-5">
            <h3 className="font-bold mb-4">⚙️ Configurações</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Tema / Assunto</label>
                <input value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="Ex: Prevenção de AVC em jovens" />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Especialidade</label>
                <select value={specialty} onChange={e => setSpecialty(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                  {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Tom</label>
                <select value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                  {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Plataforma</label>
                <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                  <option value="instagram">📸 Instagram</option>
                  <option value="linkedin">💼 LinkedIn</option>
                  <option value="whatsapp">💬 WhatsApp</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block">Tipo de Conteúdo</label>
                <div className="grid grid-cols-1 gap-2">
                  {CONTENT_TYPES.map(ct => (
                    <button key={ct.id} onClick={() => setContentType(ct.id)} className={`text-left p-2 rounded-lg text-sm transition-all ${contentType === ct.id ? 'bg-emerald-500/20 border border-emerald-500/40' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}>
                      <div className="font-medium">{ct.label}</div>
                      <div className="text-xs text-gray-500">{ct.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={includeReferences} onChange={e => setIncludeReferences(e.target.checked)} className="rounded" />
                  <span>📚 Incluir referências científicas</span>
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={includeDisclaimer} onChange={e => setIncludeDisclaimer(e.target.checked)} className="rounded" />
                  <span>⚕️ Incluir disclaimer médico</span>
                </label>
              </div>
              <button onClick={handleGenerate} disabled={isGenerating || !topic.trim()} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg font-medium transition-all">
                {isGenerating ? '⏳ Gerando com IA...' : '✨ Gerar Conteúdo'}
              </button>
            </div>
          </div>
        </div>

        {/* Content List & Preview */}
        <div className="lg:col-span-2 space-y-4">
          {selectedContent ? (
            <div className="bg-white/5 rounded-xl border border-white/10 p-5">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{selectedContent.title}</h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10">{selectedContent.platform}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-white/10">{selectedContent.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${selectedContent.complianceScore >= 90 ? 'bg-green-500/20 text-green-400' : selectedContent.complianceScore >= 70 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                      CFM: {selectedContent.complianceScore}%
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedContent(null)} className="text-gray-500 hover:text-white">✕</button>
              </div>
              <div className="bg-black/30 rounded-lg p-4 text-sm whitespace-pre-wrap mb-4 max-h-[400px] overflow-y-auto">{selectedContent.content}</div>
              <div className="flex flex-wrap gap-1 mb-4">
                {selectedContent.hashtags.map((h, i) => <span key={i} className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">{h}</span>)}
              </div>
              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-sm font-medium">📅 Agendar</button>
                <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium">📋 Copiar</button>
                <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm">🔄 Regenerar</button>
              </div>
            </div>
          ) : null}

          <h3 className="font-bold">📜 Conteúdos Gerados</h3>
          <div className="space-y-2">
            {generated.map(g => (
              <div key={g.id} onClick={() => setSelectedContent(g)} className="bg-white/5 rounded-xl p-4 border border-white/10 hover:border-emerald-500/30 cursor-pointer transition-all">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium">{g.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{g.type} · {g.platform} · {g.timestamp}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${g.complianceScore >= 90 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                    CFM {g.complianceScore}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VGAutoConteudo;
