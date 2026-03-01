/**
 * MedFocus — Módulo de Residência Médica
 * Sprint 45: Preparação para provas de residência com simulados, ranking e análise de desempenho
 */
import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface Questao {
  id: number;
  prova: string;
  ano: number;
  especialidade: string;
  enunciado: string;
  alternativas: string[];
  correta: number;
  comentario: string;
  referencia: string;
  dificuldade: 'Fácil' | 'Média' | 'Difícil';
}

const questoesDB: Questao[] = [
  { id: 1, prova: 'USP-SP', ano: 2025, especialidade: 'Clínica Médica', dificuldade: 'Média',
    enunciado: 'Paciente de 62 anos, diabético tipo 2, em uso de metformina 2g/dia, apresenta creatinina de 3,2 mg/dL e TFG estimada de 22 mL/min. Qual a conduta mais adequada em relação à metformina?',
    alternativas: ['Manter a dose atual', 'Reduzir para 1g/dia', 'Suspender a metformina', 'Trocar por glibenclamida'],
    correta: 2, comentario: 'A metformina deve ser suspensa quando a TFG < 30 mL/min pelo risco de acidose lática. A glibenclamida também é contraindicada em DRC avançada pelo risco de hipoglicemia prolongada. A conduta é suspender e considerar insulina ou inibidores de DPP-4 ajustados para função renal.', referencia: 'KDIGO 2024 Guidelines for Diabetes Management in CKD' },
  { id: 2, prova: 'UNIFESP', ano: 2025, especialidade: 'Cirurgia Geral', dificuldade: 'Difícil',
    enunciado: 'Paciente de 45 anos, vítima de FAB (ferimento por arma branca) em flanco esquerdo, hemodinamicamente estável, com evisceração de omento. Qual a conduta?',
    alternativas: ['Observação clínica e exames seriados', 'TC de abdome com contraste', 'Lavagem peritoneal diagnóstica', 'Laparotomia exploradora'],
    correta: 3, comentario: 'Evisceração é indicação absoluta de laparotomia exploradora, independentemente da estabilidade hemodinâmica. Outros achados que indicam laparotomia imediata: instabilidade hemodinâmica, peritonite difusa, evisceração e empalamento.', referencia: 'ATLS 10th Ed. + Eastern Association for the Surgery of Trauma (EAST) Guidelines' },
  { id: 3, prova: 'ENARE', ano: 2025, especialidade: 'Pediatria', dificuldade: 'Média',
    enunciado: 'Lactente de 8 meses apresenta diarreia aquosa há 3 dias, olhos fundos, sinal da prega positivo (retorno lento), bebe avidamente. Qual o grau de desidratação segundo a OMS?',
    alternativas: ['Sem desidratação', 'Desidratação leve', 'Alguma desidratação (moderada)', 'Desidratação grave'],
    correta: 2, comentario: '"Alguma desidratação" (Plano B da OMS): 2 ou mais sinais — olhos fundos, sinal da prega lento, bebe avidamente, inquieto/irritado. Se houvesse letargia, incapacidade de beber ou sinal da prega muito lento (>2s), seria desidratação grave (Plano C).', referencia: 'OMS — Tratamento da Diarreia: Manual Clínico para Profissionais de Saúde, 2005 (atualizado 2023)' },
  { id: 4, prova: 'USP-RP', ano: 2024, especialidade: 'Ginecologia e Obstetrícia', dificuldade: 'Difícil',
    enunciado: 'Gestante de 32 semanas com pré-eclâmpsia grave (PA 170x110, proteinúria 3+, plaquetas 85.000). Qual a conduta prioritária?',
    alternativas: ['Sulfato de magnésio e anti-hipertensivo, seguido de parto', 'Apenas anti-hipertensivo e observação', 'Parto cesáreo imediato sem estabilização', 'Corticoide e manter gestação por mais 48h'],
    correta: 0, comentario: 'Pré-eclâmpsia grave com sinais de deterioração (plaquetopenia < 100.000 sugere HELLP): estabilizar com MgSO4 (prevenção de eclâmpsia) + anti-hipertensivo (hidralazina ou nifedipina) e programar o parto. O corticoide pode ser feito, mas não deve atrasar o parto se houver deterioração materna.', referencia: 'ACOG Practice Bulletin 222 (2020) + FEBRASGO — Pré-eclâmpsia 2023' },
  { id: 5, prova: 'UNICAMP', ano: 2025, especialidade: 'Clínica Médica', dificuldade: 'Fácil',
    enunciado: 'Paciente de 28 anos com quadro de faringite aguda, febre 38.5°C, exsudato amigdaliano bilateral e adenomegalia cervical anterior dolorosa. Critérios de Centor: 4 pontos. Qual a conduta?',
    alternativas: ['Sintomáticos apenas', 'Teste rápido para Streptococcus e tratar se positivo', 'Antibioticoterapia empírica com penicilina benzatina', 'Amoxicilina + clavulanato por 14 dias'],
    correta: 2, comentario: 'Com 4 critérios de Centor (febre, exsudato, adenomegalia cervical anterior, ausência de tosse), a probabilidade de faringite estreptocócica é de 50-60%. A conduta aceita é tratar empiricamente ou fazer teste rápido. Penicilina benzatina dose única (1.200.000 UI IM) ou amoxicilina 500mg 8/8h por 10 dias são as opções de primeira linha.', referencia: 'IDSA Guidelines for Group A Streptococcal Pharyngitis 2012 + AHA Rheumatic Fever Prevention' },
  { id: 6, prova: 'SANTA CASA SP', ano: 2024, especialidade: 'Medicina de Emergência', dificuldade: 'Difícil',
    enunciado: 'Paciente de 55 anos, trazido pelo SAMU em PCR (ritmo: FV). Após 1 choque + 2 min de RCP + adrenalina, mantém FV refratária. Qual o próximo antiarrítmico?',
    alternativas: ['Lidocaína 1mg/kg', 'Amiodarona 300mg IV', 'Procainamida 20mg/min', 'Atropina 1mg IV'],
    correta: 1, comentario: 'FV/TV sem pulso refratária ao primeiro choque: Amiodarona 300mg IV em bolus é o antiarrítmico de primeira escolha. Se persistir, segunda dose de 150mg. Lidocaína é alternativa se amiodarona não disponível. Atropina NÃO é mais recomendada em PCR pelo ACLS 2020.', referencia: 'AHA ACLS Guidelines 2020 + ERC Resuscitation Guidelines 2021' },
];

const provas = [...new Set(questoesDB.map(q => q.prova))];
const especialidadesProva = [...new Set(questoesDB.map(q => q.especialidade))];

const ResidenciaMedica: React.FC = () => {
  const [tab, setTab] = useState<'inicio' | 'simulado' | 'resultado' | 'ranking'>('inicio');
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, number>>({});
  const [mostrarComentario, setMostrarComentario] = useState(false);
  const [filtroProva, setFiltroProva] = useState('Todas');
  const [filtroEsp, setFiltroEsp] = useState('Todas');
  const [tempoInicio, setTempoInicio] = useState(0);
  const [tempoFim, setTempoFim] = useState(0);

  const iniciarSimulado = () => {
    let qs = [...questoesDB];
    if (filtroProva !== 'Todas') qs = qs.filter(q => q.prova === filtroProva);
    if (filtroEsp !== 'Todas') qs = qs.filter(q => q.especialidade === filtroEsp);
    qs.sort(() => Math.random() - 0.5);
    setQuestoes(qs);
    setQuestaoAtual(0);
    setRespostas({});
    setMostrarComentario(false);
    setTempoInicio(Date.now());
    setTab('simulado');
  };

  const responder = (idx: number) => {
    if (respostas[questaoAtual] !== undefined) return;
    setRespostas(prev => ({ ...prev, [questaoAtual]: idx }));
    setMostrarComentario(true);
  };

  const proximaQuestao = () => {
    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual(prev => prev + 1);
      setMostrarComentario(false);
    } else {
      setTempoFim(Date.now());
      setTab('resultado');
    }
  };

  const acertos = Object.entries(respostas).filter(([idx, resp]) => questoes[Number(idx)]?.correta === resp).length;
  const tempoTotal = tempoFim > 0 ? Math.round((tempoFim - tempoInicio) / 1000) : 0;
  const nota = questoes.length > 0 ? ((acertos / questoes.length) * 100).toFixed(1) : '0';

  const rankingData = [
    { pos: 1, nome: 'Ana C. (USP)', acertos: 95, nota: '95.0%' },
    { pos: 2, nome: 'Pedro M. (UNIFESP)', acertos: 92, nota: '92.0%' },
    { pos: 3, nome: 'Maria L. (UNICAMP)', acertos: 89, nota: '89.0%' },
    { pos: 4, nome: 'João S. (USP-RP)', acertos: 87, nota: '87.0%' },
    { pos: 5, nome: 'Carla F. (ENARE)', acertos: 85, nota: '85.0%' },
    { pos: 6, nome: 'Você', acertos: Number(nota), nota: `${nota}%` },
  ].sort((a, b) => b.acertos - a.acertos);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <EducationalDisclaimer moduleName="Residência Médica - Preparação" />

      {tab === 'inicio' && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">🎓 Residência Médica — Preparação</h1>
            <p className="text-gray-400">Simulados com questões reais de provas de residência + ranking + análise de desempenho</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">{questoesDB.length}</div>
              <div className="text-gray-500 text-sm">Questões</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{provas.length}</div>
              <div className="text-gray-500 text-sm">Instituições</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{especialidadesProva.length}</div>
              <div className="text-gray-500 text-sm">Especialidades</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">2024-25</div>
              <div className="text-gray-500 text-sm">Provas</div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">⚙️ Configurar Simulado</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">Instituição</label>
                <select value={filtroProva} onChange={e => setFiltroProva(e.target.value)} className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                  <option>Todas</option>
                  {provas.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Especialidade</label>
                <select value={filtroEsp} onChange={e => setFiltroEsp(e.target.value)} className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                  <option>Todas</option>
                  {especialidadesProva.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
            </div>
            <button onClick={iniciarSimulado} className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">🚀 Iniciar Simulado</button>
          </div>

          <button onClick={() => setTab('ranking')} className="w-full py-3 bg-gray-800 text-white rounded-xl border border-gray-700 hover:border-emerald-500/50">🏆 Ver Ranking Nacional</button>
        </>
      )}

      {tab === 'simulado' && questoes.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <button onClick={() => setTab('inicio')} className="text-emerald-400 hover:text-emerald-300">← Sair</button>
            <span className="text-gray-400">Questão {questaoAtual + 1}/{questoes.length}</span>
            <span className={`text-xs px-2 py-1 rounded ${questoes[questaoAtual].dificuldade === 'Fácil' ? 'bg-green-500/20 text-green-400' : questoes[questaoAtual].dificuldade === 'Média' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{questoes[questaoAtual].dificuldade}</span>
          </div>

          <div className="w-full bg-gray-800 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${((questaoAtual + 1) / questoes.length) * 100}%` }} />
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <div className="flex gap-2 mb-3">
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">{questoes[questaoAtual].prova} {questoes[questaoAtual].ano}</span>
              <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">{questoes[questaoAtual].especialidade}</span>
            </div>
            <p className="text-white text-lg leading-relaxed mb-6">{questoes[questaoAtual].enunciado}</p>

            <div className="space-y-3">
              {questoes[questaoAtual].alternativas.map((alt, idx) => {
                const respondida = respostas[questaoAtual] !== undefined;
                const selecionada = respostas[questaoAtual] === idx;
                const correta = questoes[questaoAtual].correta === idx;
                let borderClass = 'border-gray-600 hover:border-gray-500';
                if (respondida && correta) borderClass = 'border-emerald-500 bg-emerald-500/10';
                else if (respondida && selecionada && !correta) borderClass = 'border-red-500 bg-red-500/10';

                return (
                  <button key={idx} onClick={() => responder(idx)} disabled={respondida} className={`w-full text-left p-4 border rounded-xl transition-all ${borderClass}`}>
                    <span className="text-gray-400 mr-3 font-bold">{String.fromCharCode(65 + idx)})</span>
                    <span className={respondida && correta ? 'text-emerald-400' : respondida && selecionada ? 'text-red-400' : 'text-gray-300'}>{alt}</span>
                  </button>
                );
              })}
            </div>

            {mostrarComentario && (
              <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <h4 className="text-blue-400 font-semibold mb-2">📖 Comentário</h4>
                <p className="text-gray-300 text-sm">{questoes[questaoAtual].comentario}</p>
                <p className="text-gray-600 text-xs mt-2">Ref: {questoes[questaoAtual].referencia}</p>
                <button onClick={proximaQuestao} className="mt-3 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
                  {questaoAtual < questoes.length - 1 ? 'Próxima Questão →' : '🏆 Ver Resultado'}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'resultado' && (
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold text-white">🏆 Resultado do Simulado</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className={`text-3xl font-bold ${Number(nota) >= 70 ? 'text-emerald-400' : Number(nota) >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{nota}%</div>
              <div className="text-gray-500 text-sm">Nota</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-blue-400">{acertos}/{questoes.length}</div>
              <div className="text-gray-500 text-sm">Acertos</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
              <div className="text-3xl font-bold text-yellow-400">{Math.floor(tempoTotal / 60)}:{String(tempoTotal % 60).padStart(2, '0')}</div>
              <div className="text-gray-500 text-sm">Tempo</div>
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 text-left">
            <h3 className="text-white font-semibold mb-3">📊 Desempenho por Especialidade</h3>
            {especialidadesProva.map(esp => {
              const qEsp = questoes.filter(q => q.especialidade === esp);
              if (qEsp.length === 0) return null;
              const acertosEsp = qEsp.filter((q, i) => {
                const idx = questoes.indexOf(q);
                return respostas[idx] === q.correta;
              }).length;
              const pct = ((acertosEsp / qEsp.length) * 100).toFixed(0);
              return (
                <div key={esp} className="flex items-center gap-3 mb-2">
                  <span className="text-gray-400 text-sm w-48">{esp}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${Number(pct) >= 70 ? 'bg-emerald-500' : Number(pct) >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-gray-400 text-sm w-16 text-right">{acertosEsp}/{qEsp.length}</span>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <button onClick={iniciarSimulado} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">🔄 Novo Simulado</button>
            <button onClick={() => setTab('ranking')} className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">🏆 Ranking</button>
            <button onClick={() => setTab('inicio')} className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">← Voltar</button>
          </div>
        </div>
      )}

      {tab === 'ranking' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">🏆 Ranking Nacional</h2>
            <button onClick={() => setTab('inicio')} className="text-emerald-400 hover:text-emerald-300">← Voltar</button>
          </div>
          <div className="space-y-2">
            {rankingData.map((r, i) => (
              <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border ${r.nome === 'Você' ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-gray-800/50 border-gray-700'}`}>
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${i === 0 ? 'bg-yellow-500 text-black' : i === 1 ? 'bg-gray-400 text-black' : i === 2 ? 'bg-orange-600 text-white' : 'bg-gray-700 text-gray-300'}`}>{i + 1}</span>
                <span className={`flex-1 font-medium ${r.nome === 'Você' ? 'text-emerald-400' : 'text-white'}`}>{r.nome}</span>
                <span className="text-gray-400">{r.nota}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResidenciaMedica;
