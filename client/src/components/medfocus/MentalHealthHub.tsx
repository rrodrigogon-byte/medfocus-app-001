/**
 * Hub de Saúde Mental
 * Acesso rápido a ajuda em crises emocionais, CAPS, CVV
 * Exercícios de respiração, meditação e recursos de apoio
 */
import React, { useState, useEffect, useRef } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type Tab = 'emergencia' | 'respiracao' | 'caps' | 'recursos' | 'autoavaliacao';

interface CAPSInfo {
  tipo: string;
  descricao: string;
  publico: string;
  horario: string;
  servicos: string[];
}

const CAPS_TYPES: CAPSInfo[] = [
  { tipo: 'CAPS I', descricao: 'Atende municípios com mais de 15 mil habitantes', publico: 'Adultos com transtornos mentais graves e persistentes', horario: 'Segunda a sexta, horário comercial', servicos: ['Acolhimento', 'Atendimento individual', 'Atendimento em grupo', 'Oficinas terapêuticas', 'Visitas domiciliares', 'Dispensação de medicamentos'] },
  { tipo: 'CAPS II', descricao: 'Atende municípios com mais de 70 mil habitantes', publico: 'Adultos com transtornos mentais graves e persistentes', horario: 'Segunda a sexta, podendo funcionar até 21h', servicos: ['Todos os serviços do CAPS I', 'Atendimento noturno', 'Acolhimento noturno em situações de crise', 'Atividades comunitárias'] },
  { tipo: 'CAPS III', descricao: 'Atende municípios com mais de 150 mil habitantes', publico: 'Adultos com transtornos mentais graves', horario: '24 horas, incluindo feriados e fins de semana', servicos: ['Todos os serviços do CAPS II', 'Acolhimento noturno contínuo', 'Leitos de observação (até 14 dias)', 'Equipe multiprofissional 24h'] },
  { tipo: 'CAPSi', descricao: 'Atende municípios com mais de 70 mil habitantes', publico: 'Crianças e adolescentes com transtornos mentais', horario: 'Segunda a sexta, horário comercial', servicos: ['Atendimento infantojuvenil', 'Terapia familiar', 'Articulação com escolas', 'Oficinas lúdicas e terapêuticas'] },
  { tipo: 'CAPSad', descricao: 'Atende municípios com mais de 70 mil habitantes', publico: 'Pessoas com problemas relacionados ao uso de álcool e drogas', horario: 'Segunda a sexta, podendo funcionar 24h (CAPSad III)', servicos: ['Desintoxicação ambulatorial', 'Grupos de apoio', 'Redução de danos', 'Acolhimento de crise', 'Articulação com comunidades terapêuticas'] },
];

const EMERGENCY_CONTACTS = [
  { name: 'CVV — Centro de Valorização da Vida', number: '188', description: 'Apoio emocional e prevenção do suicídio. 24h, gratuito, sigilo total.', color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400', link: 'https://www.cvv.org.br', chatAvailable: true },
  { name: 'SAMU', number: '192', description: 'Emergências médicas, incluindo crises psiquiátricas graves.', color: 'bg-red-500/20 border-red-500/30 text-red-400', link: null, chatAvailable: false },
  { name: 'Disque Saúde', number: '136', description: 'Informações sobre serviços de saúde mental no SUS.', color: 'bg-green-500/20 border-green-500/30 text-green-400', link: null, chatAvailable: false },
  { name: 'Ligue 180 — Violência contra Mulher', number: '180', description: 'Central de Atendimento à Mulher. 24h, gratuito.', color: 'bg-purple-500/20 border-purple-500/30 text-purple-400', link: null, chatAvailable: false },
  { name: 'Disque 100 — Direitos Humanos', number: '100', description: 'Denúncias de violações de direitos humanos.', color: 'bg-blue-500/20 border-blue-500/30 text-blue-400', link: null, chatAvailable: false },
];

const SELF_ASSESSMENT_QUESTIONS = [
  { id: 1, text: 'Nas últimas 2 semanas, com que frequência você sentiu pouco interesse ou prazer em fazer as coisas?', category: 'depressão' },
  { id: 2, text: 'Nas últimas 2 semanas, com que frequência você se sentiu para baixo, deprimido(a) ou sem esperança?', category: 'depressão' },
  { id: 3, text: 'Nas últimas 2 semanas, com que frequência você teve dificuldade para dormir, ou dormiu demais?', category: 'sono' },
  { id: 4, text: 'Nas últimas 2 semanas, com que frequência você se sentiu cansado(a) ou com pouca energia?', category: 'energia' },
  { id: 5, text: 'Nas últimas 2 semanas, com que frequência você sentiu nervosismo, ansiedade ou tensão?', category: 'ansiedade' },
  { id: 6, text: 'Nas últimas 2 semanas, com que frequência você não conseguiu parar de se preocupar?', category: 'ansiedade' },
  { id: 7, text: 'Nas últimas 2 semanas, com que frequência você teve dificuldade para se concentrar?', category: 'concentração' },
  { id: 8, text: 'Nas últimas 2 semanas, com que frequência você se sentiu irritado(a) ou facilmente incomodado(a)?', category: 'humor' },
  { id: 9, text: 'Nas últimas 2 semanas, com que frequência você teve pensamentos de que seria melhor estar morto(a) ou de se machucar?', category: 'risco' },
];

const ANSWER_OPTIONS = [
  { value: 0, label: 'Nenhuma vez' },
  { value: 1, label: 'Vários dias' },
  { value: 2, label: 'Mais da metade dos dias' },
  { value: 3, label: 'Quase todos os dias' },
];

const RESOURCES = [
  { title: 'Meditação Guiada — 5 minutos', description: 'Exercício simples de atenção plena para acalmar a mente', type: 'Meditação', duration: '5 min', icon: '🧘' },
  { title: 'Diário de Gratidão', description: 'Escreva 3 coisas pelas quais você é grato(a) hoje', type: 'Exercício', duration: '3 min', icon: '📝' },
  { title: 'Relaxamento Muscular Progressivo', description: 'Técnica de tensão e relaxamento de grupos musculares', type: 'Relaxamento', duration: '10 min', icon: '💆' },
  { title: 'Grounding — Técnica 5-4-3-2-1', description: 'Identifique 5 coisas que vê, 4 que toca, 3 que ouve, 2 que cheira, 1 que saboreia', type: 'Ansiedade', duration: '5 min', icon: '🌿' },
  { title: 'Higiene do Sono', description: 'Dicas para melhorar a qualidade do seu sono', type: 'Sono', duration: 'Leitura', icon: '🌙' },
  { title: 'Atividade Física e Saúde Mental', description: 'Como o exercício ajuda na depressão e ansiedade', type: 'Educação', duration: 'Leitura', icon: '🏃' },
];

export default function MentalHealthHub() {
  const [activeTab, setActiveTab] = useState<Tab>('emergencia');
  const [breathPhase, setBreathPhase] = useState<'idle' | 'inhale' | 'hold' | 'exhale'>('idle');
  const [breathCount, setBreathCount] = useState(0);
  const [breathTimer, setBreathTimer] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [expandedCAPS, setExpandedCAPS] = useState<string | null>(null);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({});
  const [showAssessmentResult, setShowAssessmentResult] = useState(false);
  const [expandedResource, setExpandedResource] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'emergencia', label: 'Emergência', icon: '🆘' },
    { id: 'respiracao', label: 'Respiração', icon: '🫁' },
    { id: 'autoavaliacao', label: 'Autoavaliação', icon: '📋' },
    { id: 'caps', label: 'CAPS', icon: '🏥' },
    { id: 'recursos', label: 'Recursos', icon: '📚' },
  ];

  // Breathing exercise logic
  useEffect(() => {
    if (!isBreathing) return;
    let phase: 'inhale' | 'hold' | 'exhale' = 'inhale';
    let seconds = 0;
    const durations = { inhale: 4, hold: 7, exhale: 8 }; // 4-7-8 technique

    setBreathPhase('inhale');
    setBreathTimer(durations.inhale);

    intervalRef.current = setInterval(() => {
      seconds++;
      const currentDuration = durations[phase];
      const elapsed = seconds % (durations.inhale + durations.hold + durations.exhale);

      if (elapsed < durations.inhale) {
        phase = 'inhale';
        setBreathPhase('inhale');
        setBreathTimer(durations.inhale - elapsed);
      } else if (elapsed < durations.inhale + durations.hold) {
        phase = 'hold';
        setBreathPhase('hold');
        setBreathTimer(durations.inhale + durations.hold - elapsed);
      } else {
        phase = 'exhale';
        setBreathPhase('exhale');
        setBreathTimer(durations.inhale + durations.hold + durations.exhale - elapsed);
      }

      if (elapsed === 0 && seconds > 0) {
        setBreathCount(prev => prev + 1);
      }
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isBreathing]);

  const startBreathing = () => {
    setIsBreathing(true);
    setBreathCount(0);
  };

  const stopBreathing = () => {
    setIsBreathing(false);
    setBreathPhase('idle');
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const calculateAssessment = () => {
    const total = Object.values(assessmentAnswers).reduce((sum, v) => sum + v, 0);
    const hasRisk = assessmentAnswers[9] >= 1;
    setShowAssessmentResult(true);
    return { total, hasRisk };
  };

  const getAssessmentLevel = () => {
    const total = Object.values(assessmentAnswers).reduce((sum, v) => sum + v, 0);
    const hasRisk = assessmentAnswers[9] >= 1;
    if (hasRisk) return { level: 'critical', color: 'red', title: 'Procure ajuda profissional AGORA', description: 'Suas respostas indicam que você pode estar passando por um momento muito difícil. Ligue 188 (CVV) agora ou procure o CAPS mais próximo.' };
    if (total >= 20) return { level: 'severe', color: 'red', title: 'Sintomas graves — Procure ajuda profissional', description: 'Seus sintomas são significativos. Recomendamos fortemente que procure um profissional de saúde mental (psicólogo ou psiquiatra) o mais breve possível.' };
    if (total >= 15) return { level: 'moderate-severe', color: 'orange', title: 'Sintomas moderados a graves', description: 'Seus sintomas merecem atenção profissional. Agende uma consulta com psicólogo ou psiquiatra.' };
    if (total >= 10) return { level: 'moderate', color: 'yellow', title: 'Sintomas moderados', description: 'Você pode se beneficiar de acompanhamento profissional. Considere procurar um psicólogo.' };
    if (total >= 5) return { level: 'mild', color: 'green', title: 'Sintomas leves', description: 'Seus sintomas são leves, mas fique atento. Pratique autocuidado e procure ajuda se piorar.' };
    return { level: 'minimal', color: 'teal', title: 'Sintomas mínimos', description: 'Seus resultados são positivos! Continue cuidando da sua saúde mental com hábitos saudáveis.' };
  };

  const breathPhaseConfig = {
    idle: { text: 'Pronto para começar', color: 'text-gray-400', bg: 'bg-gray-700/50', size: 'w-32 h-32' },
    inhale: { text: 'INSPIRE', color: 'text-blue-400', bg: 'bg-blue-500/20', size: 'w-48 h-48' },
    hold: { text: 'SEGURE', color: 'text-yellow-400', bg: 'bg-yellow-500/20', size: 'w-44 h-44' },
    exhale: { text: 'EXPIRE', color: 'text-green-400', bg: 'bg-green-500/20', size: 'w-32 h-32' },
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Saúde Mental" showEmergencyInfo />
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          <span className="text-3xl">🧠</span> Hub de Saúde Mental
        </h2>
        <p className="text-gray-400 mt-1">Apoio emocional, exercícios de bem-estar e acesso a serviços de saúde mental.</p>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-red-300 font-semibold">Em crise? Precisa conversar agora?</p>
          <p className="text-red-300/70 text-sm">CVV — 24h, gratuito, sigilo total</p>
        </div>
        <div className="flex gap-2">
          <a href="tel:188" className="px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all">
            📞 Ligar 188
          </a>
          <a href="https://www.cvv.org.br" target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg font-medium hover:bg-yellow-500/30 transition-all">
            💬 Chat Online
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-teal-500/20 text-teal-400 border border-teal-500' : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:border-gray-500'}`}>
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Emergência */}
      {activeTab === 'emergencia' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Contatos de Emergência</h3>
          <div className="space-y-3">
            {EMERGENCY_CONTACTS.map(c => (
              <div key={c.number} className={`border rounded-xl p-4 ${c.color}`}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <h4 className="font-bold text-white">{c.name}</h4>
                    <p className="text-sm text-gray-300 mt-1">{c.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={`tel:${c.number}`} className="px-4 py-2 bg-white/10 rounded-lg font-bold text-white text-lg hover:bg-white/20 transition-all">
                      📞 {c.number}
                    </a>
                    {c.chatAvailable && c.link && (
                      <a href={c.link} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-2 bg-white/10 rounded-lg text-sm text-white hover:bg-white/20 transition-all">
                        💬 Chat
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h4 className="text-sm font-semibold text-white mb-2">Sinais de alerta — quando procurar ajuda imediata:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {['Pensamentos de se machucar ou suicídio', 'Automutilação', 'Uso excessivo de álcool ou drogas em crise', 'Alucinações ou delírios',
                'Agitação extrema ou agressividade', 'Incapacidade de cuidar de si mesmo', 'Pânico intenso e prolongado', 'Isolamento total por dias'].map(s => (
                <div key={s} className="flex items-start gap-2">
                  <span className="text-red-400 mt-0.5 text-xs">●</span>
                  <span className="text-gray-300 text-sm">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Respiração */}
      {activeTab === 'respiracao' && (
        <div className="space-y-6">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Técnica de Respiração 4-7-8</h3>
            <p className="text-gray-400 text-sm mb-6">Inspire por 4 segundos, segure por 7, expire por 8. Comprovada cientificamente para reduzir ansiedade.</p>

            {/* Breathing Circle */}
            <div className="flex justify-center mb-6">
              <div className={`rounded-full flex items-center justify-center transition-all duration-1000 ease-in-out ${breathPhaseConfig[breathPhase].bg} ${breathPhaseConfig[breathPhase].size}`}>
                <div className="text-center">
                  <p className={`text-2xl font-bold ${breathPhaseConfig[breathPhase].color}`}>{breathPhaseConfig[breathPhase].text}</p>
                  {isBreathing && <p className="text-3xl font-bold text-white mt-2">{breathTimer}</p>}
                </div>
              </div>
            </div>

            {isBreathing && (
              <p className="text-gray-400 text-sm mb-4">Ciclos completados: <span className="text-teal-400 font-bold">{breathCount}</span></p>
            )}

            <button onClick={isBreathing ? stopBreathing : startBreathing}
              className={`px-8 py-3 rounded-lg font-semibold transition-all ${isBreathing ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-teal-500 text-white hover:bg-teal-600'}`}>
              {isBreathing ? '⏹ Parar' : '▶ Iniciar Exercício'}
            </button>
          </div>

          {/* Other techniques */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h4 className="font-semibold text-white flex items-center gap-2"><span>🌊</span> Respiração Diafragmática</h4>
              <p className="text-gray-400 text-sm mt-2">Coloque uma mão no peito e outra no abdômen. Inspire pelo nariz fazendo o abdômen expandir (não o peito). Expire lentamente pela boca.</p>
              <p className="text-teal-400 text-xs mt-2">Ideal para: ansiedade, pânico, insônia</p>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <h4 className="font-semibold text-white flex items-center gap-2"><span>🔲</span> Respiração Quadrada (Box Breathing)</h4>
              <p className="text-gray-400 text-sm mt-2">Inspire 4s → Segure 4s → Expire 4s → Segure 4s. Repita por 4 ciclos. Usada por militares e atletas.</p>
              <p className="text-teal-400 text-xs mt-2">Ideal para: foco, estresse, antes de provas</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Autoavaliação */}
      {activeTab === 'autoavaliacao' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-1">Autoavaliação de Bem-Estar Emocional</h3>
            <p className="text-gray-400 text-sm mb-4">Baseado nos questionários PHQ-9 e GAD-7 (validados cientificamente). Não é diagnóstico — é uma orientação.</p>

            {!showAssessmentResult ? (
              <div className="space-y-6">
                {SELF_ASSESSMENT_QUESTIONS.map(q => (
                  <div key={q.id} className="space-y-2">
                    <p className="text-white text-sm font-medium">{q.id}. {q.text}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {ANSWER_OPTIONS.map(o => (
                        <button key={o.value} onClick={() => setAssessmentAnswers({ ...assessmentAnswers, [q.id]: o.value })}
                          className={`p-2 rounded-lg text-xs font-medium transition-all ${assessmentAnswers[q.id] === o.value ? 'bg-teal-500/20 border-teal-500 text-teal-400 border' : 'bg-gray-700/50 border border-gray-600 text-gray-400 hover:border-gray-500'}`}>
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button onClick={calculateAssessment}
                  disabled={Object.keys(assessmentAnswers).length < SELF_ASSESSMENT_QUESTIONS.length}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${Object.keys(assessmentAnswers).length >= SELF_ASSESSMENT_QUESTIONS.length ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}>
                  📊 Ver Resultado ({Object.keys(assessmentAnswers).length}/{SELF_ASSESSMENT_QUESTIONS.length} respondidas)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {(() => {
                  const result = getAssessmentLevel();
                  const total = Object.values(assessmentAnswers).reduce((sum, v) => sum + v, 0);
                  const colorMap: Record<string, string> = { red: 'border-red-500 bg-red-500/10', orange: 'border-orange-500 bg-orange-500/10', yellow: 'border-yellow-500 bg-yellow-500/10', green: 'border-green-500 bg-green-500/10', teal: 'border-teal-500 bg-teal-500/10' };
                  return (
                    <>
                      <div className={`border-2 rounded-xl p-6 text-center ${colorMap[result.color]}`}>
                        <p className="text-3xl font-bold text-white">{total}/27</p>
                        <h4 className="text-lg font-bold text-white mt-2">{result.title}</h4>
                        <p className="text-gray-300 mt-2 text-sm">{result.description}</p>
                      </div>

                      {result.level === 'critical' && (
                        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4 text-center">
                          <p className="text-red-300 font-bold text-lg">Ligue agora: 188 (CVV)</p>
                          <p className="text-red-300/70 text-sm mt-1">24 horas, gratuito, sigilo total. Você não está sozinho(a).</p>
                        </div>
                      )}

                      <div className="bg-gray-700/30 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-white mb-2">Onde buscar ajuda:</h4>
                        <div className="space-y-2 text-sm text-gray-300">
                          <p>• <strong className="text-teal-400">CAPS</strong> — Centro de Atenção Psicossocial (gratuito pelo SUS)</p>
                          <p>• <strong className="text-teal-400">UBS</strong> — Solicite encaminhamento para psicólogo/psiquiatra</p>
                          <p>• <strong className="text-teal-400">CVV (188)</strong> — Apoio emocional imediato</p>
                          <p>• <strong className="text-teal-400">Psicólogo particular</strong> — Muitos oferecem valor social</p>
                        </div>
                      </div>

                      <button onClick={() => { setShowAssessmentResult(false); setAssessmentAnswers({}); }}
                        className="w-full py-3 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 font-medium">
                        ↻ Refazer Avaliação
                      </button>
                    </>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-300 text-sm">
              <strong>⚠️ Aviso:</strong> Esta autoavaliação é uma ferramenta de rastreamento, não um diagnóstico. 
              Baseada nos instrumentos PHQ-9 e GAD-7 validados pela OMS. Procure um profissional para avaliação completa.
            </p>
          </div>
        </div>
      )}

      {/* Tab: CAPS */}
      {activeTab === 'caps' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-1">CAPS — Centro de Atenção Psicossocial</h3>
            <p className="text-gray-400 text-sm mb-4">Serviço gratuito do SUS para atendimento em saúde mental. Não precisa de encaminhamento — é porta aberta.</p>

            <div className="space-y-3">
              {CAPS_TYPES.map(caps => (
                <div key={caps.tipo} className="bg-gray-700/30 rounded-lg overflow-hidden">
                  <button onClick={() => setExpandedCAPS(expandedCAPS === caps.tipo ? null : caps.tipo)}
                    className="w-full p-4 flex items-center justify-between text-left">
                    <div>
                      <span className="text-white font-bold">{caps.tipo}</span>
                      <p className="text-gray-400 text-sm mt-0.5">{caps.descricao}</p>
                    </div>
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedCAPS === caps.tipo ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedCAPS === caps.tipo && (
                    <div className="px-4 pb-4 border-t border-gray-600/50 pt-3 space-y-3">
                      <div>
                        <span className="text-xs text-gray-500 font-semibold">PÚBLICO-ALVO</span>
                        <p className="text-sm text-gray-300">{caps.publico}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 font-semibold">HORÁRIO</span>
                        <p className="text-sm text-gray-300">{caps.horario}</p>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 font-semibold">SERVIÇOS</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {caps.servicos.map(s => (
                            <span key={s} className="px-2 py-1 bg-teal-500/10 text-teal-400 rounded text-xs">{s}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-4">
            <h4 className="text-teal-400 font-semibold text-sm">Como encontrar o CAPS mais próximo?</h4>
            <p className="text-gray-300 text-sm mt-1">
              Ligue <strong>136 (Disque Saúde)</strong> ou acesse o site do CNES (Cadastro Nacional de Estabelecimentos de Saúde) 
              para buscar o CAPS da sua cidade. Você também pode ir diretamente à UBS de referência para ser encaminhado.
            </p>
          </div>
        </div>
      )}

      {/* Tab: Recursos */}
      {activeTab === 'recursos' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Recursos de Autocuidado</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {RESOURCES.map((r, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
                <button onClick={() => setExpandedResource(expandedResource === i ? null : i)}
                  className="w-full p-4 text-left">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{r.icon}</span>
                    <div className="flex-1">
                      <h4 className="text-white font-medium text-sm">{r.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 bg-teal-500/10 text-teal-400 rounded">{r.type}</span>
                        <span className="text-[10px] text-gray-500">{r.duration}</span>
                      </div>
                    </div>
                  </div>
                </button>
                {expandedResource === i && (
                  <div className="px-4 pb-4 border-t border-gray-700 pt-3">
                    <p className="text-sm text-gray-400">{r.description}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Books and Apps */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Apps e Livros Recomendados</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-teal-400 mb-2">Apps Gratuitos</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• <strong>Cíngulo</strong> — Terapia guiada e meditação</p>
                  <p>• <strong>Headspace</strong> — Meditação e mindfulness</p>
                  <p>• <strong>Calm</strong> — Sono e relaxamento</p>
                  <p>• <strong>Fique Vivo</strong> — Saúde mental (brasileiro)</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-teal-400 mb-2">Leituras Recomendadas</h4>
                <div className="space-y-2 text-sm text-gray-300">
                  <p>• <strong>O poder do agora</strong> — Eckhart Tolle</p>
                  <p>• <strong>Ansiedade: como enfrentar o mal do século</strong> — Augusto Cury</p>
                  <p>• <strong>Mente sem medo</strong> — Mark Freeman</p>
                  <p>• <strong>Razões para continuar vivo</strong> — Matt Haig</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
