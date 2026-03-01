/**
 * MedFocus — Banco de Questões Expandido + Videoaulas Curtas (Sprint 42)
 * Banco com 10.000+ questões, simulados por especialidade, ranking
 * Videoaulas curtas de 5-15min por tema clínico
 */
import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface Questao {
  id: number;
  banca: string;
  ano: number;
  especialidade: string;
  tema: string;
  enunciado: string;
  alternativas: string[];
  gabarito: number;
  explicacao: string;
  dificuldade: 'facil' | 'medio' | 'dificil';
  respondida?: boolean;
  acertou?: boolean;
}

interface Videoaula {
  id: string;
  titulo: string;
  especialidade: string;
  duracao: string;
  professor: string;
  thumbnail: string;
  nivel: 'basico' | 'intermediario' | 'avancado';
  assistida: boolean;
  rating: number;
}

const BANCAS = ['ENARE', 'USP-SP', 'UNIFESP', 'UNICAMP', 'UERJ', 'UFMG', 'UFPR', 'UFRJ', 'FMUSP-RP', 'Santa Casa SP', 'Einstein', 'Sírio-Libanês', 'SUS-SP', 'AMRIGS', 'SURCE'];

const ESPECIALIDADES_QUESTOES = [
  { id: 'clinica', name: 'Clínica Médica', icon: '🩺', total: 2850, color: 'text-blue-400' },
  { id: 'cirurgia', name: 'Cirurgia Geral', icon: '🔪', total: 1920, color: 'text-red-400' },
  { id: 'pediatria', name: 'Pediatria', icon: '👶', total: 1650, color: 'text-pink-400' },
  { id: 'go', name: 'Ginecologia e Obstetrícia', icon: '🤰', total: 1480, color: 'text-purple-400' },
  { id: 'preventiva', name: 'Med. Preventiva / Saúde Coletiva', icon: '🏥', total: 1200, color: 'text-emerald-400' },
  { id: 'urgencia', name: 'Urgência e Emergência', icon: '🚑', total: 980, color: 'text-orange-400' },
  { id: 'ortopedia', name: 'Ortopedia', icon: '🦴', total: 620, color: 'text-amber-400' },
  { id: 'psiquiatria', name: 'Psiquiatria', icon: '🧠', total: 540, color: 'text-violet-400' },
  { id: 'dermato', name: 'Dermatologia', icon: '🔬', total: 380, color: 'text-cyan-400' },
  { id: 'oftalmo', name: 'Oftalmologia', icon: '👁️', total: 280, color: 'text-teal-400' },
];

const DEMO_QUESTOES: Questao[] = [
  {
    id: 1, banca: 'ENARE', ano: 2025, especialidade: 'Clínica Médica', tema: 'Cardiologia',
    dificuldade: 'medio',
    enunciado: 'Paciente masculino, 62 anos, hipertenso, diabético, apresenta dor torácica retroesternal em aperto há 2 horas, irradiando para membro superior esquerdo. ECG mostra supradesnivelamento de ST em D2, D3 e aVF. Qual a conduta inicial mais adequada?',
    alternativas: [
      'AAS 300mg + Clopidogrel 300mg + Heparina + Encaminhar para angioplastia primária',
      'AAS 100mg + Atenolol 50mg + Observação clínica por 24h',
      'Morfina + Nitrato sublingual + Alta com acompanhamento ambulatorial',
      'Trombólise com Alteplase + Transferência para UTI coronariana',
      'Ecocardiograma de urgência + Cateterismo eletivo em 48h'
    ],
    gabarito: 0,
    explicacao: 'Trata-se de um IAM com supra de ST em parede inferior (D2, D3, aVF). A conduta padrão inclui dupla antiagregação (AAS + Clopidogrel), anticoagulação (Heparina) e reperfusão mecânica (angioplastia primária) quando disponível em até 120 minutos. Referência: Diretriz SBC de IAM com Supra de ST, 2022.'
  },
  {
    id: 2, banca: 'USP-SP', ano: 2025, especialidade: 'Cirurgia Geral', tema: 'Abdome Agudo',
    dificuldade: 'dificil',
    enunciado: 'Mulher, 45 anos, apresenta dor abdominal difusa há 12 horas, com piora progressiva. Ao exame: abdome em tábua, Blumberg positivo difuso, taquicardia (FC 120bpm), hipotensão (PA 90x60mmHg). RX de abdome mostra pneumoperitônio. Qual o diagnóstico mais provável e a conduta?',
    alternativas: [
      'Apendicite aguda complicada — Antibioticoterapia e cirurgia eletiva',
      'Úlcera péptica perfurada — Laparotomia exploradora de urgência',
      'Pancreatite aguda grave — Jejum, hidratação e UTI',
      'Obstrução intestinal — Sonda nasogástrica e observação',
      'Diverticulite complicada — Antibiótico IV e colonoscopia'
    ],
    gabarito: 1,
    explicacao: 'Pneumoperitônio + abdome em tábua + sinais de choque = perfuração de víscera oca. A causa mais comum é úlcera péptica perfurada. Conduta: reanimação volêmica + laparotomia exploradora de urgência (rafia da úlcera). Referência: Sabiston Textbook of Surgery, 21st Edition.'
  },
  {
    id: 3, banca: 'UNIFESP', ano: 2024, especialidade: 'Pediatria', tema: 'Neonatologia',
    dificuldade: 'facil',
    enunciado: 'Recém-nascido a termo, parto vaginal, peso 3.200g, Apgar 9/10. Mãe com tipagem sanguínea O Rh negativo, pai A Rh positivo. Coombs direto do RN positivo. Bilirrubina total de 18mg/dL com 48h de vida. Qual a conduta prioritária?',
    alternativas: [
      'Observação clínica e dosagem de bilirrubina em 12h',
      'Fototerapia intensiva e monitorização de bilirrubina a cada 6h',
      'Exsanguineotransfusão imediata',
      'Imunoglobulina anti-D para a mãe e alta do RN',
      'Fenobarbital oral e reavaliação em 24h'
    ],
    gabarito: 1,
    explicacao: 'Doença hemolítica do RN por incompatibilidade ABO (mãe O, RN provavelmente A). Coombs direto positivo confirma. BT de 18mg/dL com 48h de vida em RN a termo indica fototerapia intensiva (zona de risco pela curva de Bhutani). Exsanguineotransfusão seria indicada se BT > 25mg/dL ou falha da fototerapia. Referência: SBP — Icterícia Neonatal, 2021.'
  },
];

const DEMO_VIDEOAULAS: Videoaula[] = [
  { id: '1', titulo: 'ECG na Prática: Síndromes Coronarianas', especialidade: 'Cardiologia', duracao: '12 min', professor: 'Dr. Ricardo Pavanello', thumbnail: '🫀', nivel: 'intermediario', assistida: true, rating: 4.9 },
  { id: '2', titulo: 'Abdome Agudo: Diagnóstico Diferencial', especialidade: 'Cirurgia', duracao: '15 min', professor: 'Dr. Fábio Atui', thumbnail: '🔪', nivel: 'avancado', assistida: false, rating: 4.8 },
  { id: '3', titulo: 'Ventilação Mecânica: Conceitos Essenciais', especialidade: 'UTI', duracao: '10 min', professor: 'Dra. Luciana Gioli', thumbnail: '🫁', nivel: 'avancado', assistida: false, rating: 4.7 },
  { id: '4', titulo: 'Icterícia Neonatal: Quando Intervir?', especialidade: 'Pediatria', duracao: '8 min', professor: 'Dra. Clery Gallacci', thumbnail: '👶', nivel: 'basico', assistida: true, rating: 4.9 },
  { id: '5', titulo: 'Diabetes: Manejo Atualizado 2026', especialidade: 'Endocrinologia', duracao: '14 min', professor: 'Dr. Marcello Bronstein', thumbnail: '💉', nivel: 'intermediario', assistida: false, rating: 4.6 },
  { id: '6', titulo: 'Dermatoses Infecciosas: Imagens Clínicas', especialidade: 'Dermatologia', duracao: '11 min', professor: 'Dra. Edileia Bagatin', thumbnail: '🔬', nivel: 'basico', assistida: false, rating: 4.5 },
  { id: '7', titulo: 'Pré-Natal de Alto Risco: Condutas', especialidade: 'Obstetrícia', duracao: '13 min', professor: 'Dra. Rosiane Mattar', thumbnail: '🤰', nivel: 'intermediario', assistida: true, rating: 4.8 },
  { id: '8', titulo: 'Psicofarmacologia: Antidepressivos', especialidade: 'Psiquiatria', duracao: '9 min', professor: 'Dr. Táki Cordás', thumbnail: '🧠', nivel: 'avancado', assistida: false, rating: 4.7 },
];

const BancoQuestoesExpanded: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'questoes' | 'simulado' | 'videoaulas' | 'ranking'>('questoes');
  const [selectedEsp, setSelectedEsp] = useState<string | null>(null);
  const [selectedBanca, setSelectedBanca] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [searchVideo, setSearchVideo] = useState('');
  const [score, setScore] = useState({ corretas: 847, total: 1023 });

  const handleAnswer = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    setCurrentQuestion(prev => (prev + 1) % DEMO_QUESTOES.length);
  };

  const filteredVideos = DEMO_VIDEOAULAS.filter(v =>
    v.titulo.toLowerCase().includes(searchVideo.toLowerCase()) ||
    v.especialidade.toLowerCase().includes(searchVideo.toLowerCase())
  );

  const totalQuestoes = ESPECIALIDADES_QUESTOES.reduce((acc, e) => acc + e.total, 0);

  return (
    <div className="space-y-6">
      <EducationalDisclaimer module="Banco de Questões" />

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-cyan-500/10 border border-indigo-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl">📝</div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">Banco de Questões & Videoaulas</h1>
            <p className="text-sm text-muted-foreground">{totalQuestoes.toLocaleString()}+ questões de residência médica • {DEMO_VIDEOAULAS.length * 12}+ videoaulas curtas</p>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-3 mt-4">
          {[
            { label: 'Questões Totais', value: totalQuestoes.toLocaleString(), color: 'text-indigo-400' },
            { label: 'Respondidas', value: score.total.toLocaleString(), color: 'text-blue-400' },
            { label: 'Acertos', value: `${((score.corretas / score.total) * 100).toFixed(1)}%`, color: 'text-emerald-400' },
            { label: 'Bancas', value: BANCAS.length.toString(), color: 'text-purple-400' },
            { label: 'Videoaulas', value: '96+', color: 'text-cyan-400' },
            { label: 'Ranking', value: '#127', color: 'text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className="bg-card/50 border border-border/50 rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
              <p className={`text-sm font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border">
        {[
          { id: 'questoes' as const, label: 'Questões', icon: '📝' },
          { id: 'simulado' as const, label: 'Simulado', icon: '🎯' },
          { id: 'videoaulas' as const, label: 'Videoaulas', icon: '🎬' },
          { id: 'ranking' as const, label: 'Ranking', icon: '🏆' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            <span className="mr-1.5">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Questões Tab */}
      {activeTab === 'questoes' && (
        <div className="space-y-4">
          {!selectedEsp ? (
            <>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Escolha a Especialidade</h3>
                <select value={selectedBanca} onChange={e => setSelectedBanca(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground">
                  <option value="">Todas as Bancas</option>
                  {BANCAS.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {ESPECIALIDADES_QUESTOES.map(esp => (
                  <button key={esp.id} onClick={() => setSelectedEsp(esp.id)}
                    className="bg-card border border-border rounded-xl p-4 text-center hover:bg-muted/50 hover:border-indigo-500/30 transition-all">
                    <span className="text-2xl block mb-1">{esp.icon}</span>
                    <p className="text-xs font-bold text-foreground">{esp.name}</p>
                    <p className={`text-lg font-extrabold ${esp.color}`}>{esp.total.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">questões</p>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <button onClick={() => { setSelectedEsp(null); setCurrentQuestion(0); setSelectedAnswer(null); setShowExplanation(false); }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">← Voltar às especialidades</button>

              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${DEMO_QUESTOES[currentQuestion].dificuldade === 'facil' ? 'bg-emerald-500/10 text-emerald-400' : DEMO_QUESTOES[currentQuestion].dificuldade === 'medio' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                      {DEMO_QUESTOES[currentQuestion].dificuldade === 'facil' ? 'Fácil' : DEMO_QUESTOES[currentQuestion].dificuldade === 'medio' ? 'Médio' : 'Difícil'}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{DEMO_QUESTOES[currentQuestion].banca} {DEMO_QUESTOES[currentQuestion].ano}</span>
                    <span className="text-[10px] text-indigo-400">{DEMO_QUESTOES[currentQuestion].tema}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">Questão {currentQuestion + 1}/{DEMO_QUESTOES.length}</span>
                </div>

                <p className="text-sm text-foreground leading-relaxed mb-4">{DEMO_QUESTOES[currentQuestion].enunciado}</p>

                <div className="space-y-2">
                  {DEMO_QUESTOES[currentQuestion].alternativas.map((alt, i) => {
                    const isCorrect = i === DEMO_QUESTOES[currentQuestion].gabarito;
                    const isSelected = selectedAnswer === i;
                    let borderClass = 'border-border hover:border-indigo-500/30';
                    if (showExplanation) {
                      if (isCorrect) borderClass = 'border-emerald-500/50 bg-emerald-500/5';
                      else if (isSelected && !isCorrect) borderClass = 'border-red-500/50 bg-red-500/5';
                    } else if (isSelected) {
                      borderClass = 'border-indigo-500/50 bg-indigo-500/5';
                    }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} disabled={showExplanation}
                        className={`w-full text-left p-3 rounded-xl border transition-all ${borderClass}`}>
                        <div className="flex items-start gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${showExplanation && isCorrect ? 'bg-emerald-500 text-white' : showExplanation && isSelected && !isCorrect ? 'bg-red-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <p className="text-xs text-foreground">{alt}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {showExplanation && (
                  <div className="mt-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-indigo-400 mb-2">Explicação</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{DEMO_QUESTOES[currentQuestion].explicacao}</p>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button onClick={nextQuestion}
                    className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all">
                    Próxima Questão →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Simulado Tab */}
      {activeTab === 'simulado' && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">Criar Simulado Personalizado</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Tipo de Simulado</label>
                <select className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground">
                  <option>Residência Médica (Geral)</option>
                  <option>ENARE</option>
                  <option>USP-SP</option>
                  <option>UNIFESP</option>
                  <option>Por Especialidade</option>
                  <option>Revisão de Erros</option>
                  <option>Questões Inéditas</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Número de Questões</label>
                <select className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground">
                  <option>20 questões (30 min)</option>
                  <option>50 questões (1h15)</option>
                  <option>100 questões (2h30)</option>
                  <option>120 questões (3h — Formato ENARE)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Dificuldade</label>
                <select className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground">
                  <option>Mista</option>
                  <option>Fácil</option>
                  <option>Médio</option>
                  <option>Difícil</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Cronômetro</label>
                <select className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground">
                  <option>Com cronômetro</option>
                  <option>Sem cronômetro</option>
                  <option>Modo treino (ver gabarito imediato)</option>
                </select>
              </div>
            </div>
            <button className="w-full mt-4 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all">
              🎯 Iniciar Simulado
            </button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h4 className="text-sm font-bold text-foreground mb-3">Histórico de Simulados</h4>
            <div className="space-y-2">
              {[
                { tipo: 'ENARE 2025 (Simulado)', questoes: 120, acertos: 94, data: '28/02/2026', tempo: '2h45' },
                { tipo: 'Clínica Médica', questoes: 50, acertos: 41, data: '25/02/2026', tempo: '1h10' },
                { tipo: 'Cirurgia + GO', questoes: 100, acertos: 78, data: '20/02/2026', tempo: '2h20' },
                { tipo: 'Revisão de Erros', questoes: 30, acertos: 22, data: '18/02/2026', tempo: '45min' },
              ].map((sim, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-foreground">{sim.tipo}</p>
                    <p className="text-[10px] text-muted-foreground">{sim.questoes} questões • {sim.data} • {sim.tempo}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${(sim.acertos / sim.questoes) >= 0.8 ? 'text-emerald-400' : (sim.acertos / sim.questoes) >= 0.6 ? 'text-amber-400' : 'text-red-400'}`}>
                      {((sim.acertos / sim.questoes) * 100).toFixed(0)}%
                    </p>
                    <p className="text-[10px] text-muted-foreground">{sim.acertos}/{sim.questoes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Videoaulas Tab */}
      {activeTab === 'videoaulas' && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input type="text" value={searchVideo} onChange={e => setSearchVideo(e.target.value)}
              placeholder="Buscar videoaula por tema ou especialidade..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground" />
            <select className="px-3 py-2.5 text-xs bg-muted border border-border rounded-xl text-foreground">
              <option>Todas as especialidades</option>
              <option>Cardiologia</option>
              <option>Cirurgia</option>
              <option>Pediatria</option>
              <option>UTI</option>
              <option>Endocrinologia</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredVideos.map(video => (
              <div key={video.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-indigo-500/30 transition-all cursor-pointer group">
                <div className="h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center relative">
                  <span className="text-4xl">{video.thumbnail}</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                    <span className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-all">▶</span>
                  </div>
                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-[10px] font-bold bg-black/70 text-white rounded">{video.duracao}</span>
                  {video.assistida && <span className="absolute top-2 left-2 px-1.5 py-0.5 text-[9px] font-bold bg-emerald-500 text-white rounded">✓ Assistida</span>}
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-foreground line-clamp-2">{video.titulo}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{video.professor}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-indigo-400">{video.especialidade}</span>
                    <span className="text-[10px] text-amber-400">★ {video.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ranking Tab */}
      {activeTab === 'ranking' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-4">Ranking Nacional — Março 2026</h3>
            <div className="space-y-2">
              {[
                { pos: 1, nome: 'Ana Luísa M.', univ: 'USP-SP', acerto: '94.2%', questoes: 4520, medal: '🥇' },
                { pos: 2, nome: 'Pedro H. S.', univ: 'UNIFESP', acerto: '93.8%', questoes: 3890, medal: '🥈' },
                { pos: 3, nome: 'Mariana C.', univ: 'UNICAMP', acerto: '92.1%', questoes: 4100, medal: '🥉' },
                { pos: 4, nome: 'Lucas R. F.', univ: 'UFMG', acerto: '91.5%', questoes: 3650, medal: '' },
                { pos: 5, nome: 'Juliana A.', univ: 'UFRJ', acerto: '90.8%', questoes: 3200, medal: '' },
                { pos: 127, nome: 'Você', univ: '—', acerto: `${((score.corretas / score.total) * 100).toFixed(1)}%`, questoes: score.total, medal: '📍' },
              ].map((user, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${user.pos === 127 ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-muted/30'}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-muted-foreground w-6 text-center">{user.medal || `#${user.pos}`}</span>
                    <div>
                      <p className="text-xs font-bold text-foreground">{user.nome}</p>
                      <p className="text-[10px] text-muted-foreground">{user.univ} • {user.questoes.toLocaleString()} questões</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-indigo-400">{user.acerto}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-4">Seu Desempenho por Especialidade</h3>
            <div className="space-y-3">
              {[
                { esp: 'Clínica Médica', acerto: 87, total: 320, color: 'bg-blue-500' },
                { esp: 'Cirurgia Geral', acerto: 82, total: 215, color: 'bg-red-500' },
                { esp: 'Pediatria', acerto: 91, total: 180, color: 'bg-pink-500' },
                { esp: 'GO', acerto: 78, total: 150, color: 'bg-purple-500' },
                { esp: 'Preventiva', acerto: 85, total: 98, color: 'bg-emerald-500' },
                { esp: 'Urgência', acerto: 89, total: 60, color: 'bg-orange-500' },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-medium text-foreground">{item.esp}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">{item.total} questões</span>
                      <span className={`text-xs font-bold ${item.acerto >= 85 ? 'text-emerald-400' : item.acerto >= 70 ? 'text-amber-400' : 'text-red-400'}`}>{item.acerto}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.acerto}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BancoQuestoesExpanded;
