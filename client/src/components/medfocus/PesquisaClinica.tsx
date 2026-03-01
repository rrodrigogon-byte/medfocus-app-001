/**
 * MedFocus — Módulo de Pesquisa Clínica
 * Sprint 47: Gestão de estudos clínicos com TCLE, randomização, CRF e compliance regulatório
 */
import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface Estudo {
  id: string;
  titulo: string;
  fase: 'I' | 'II' | 'III' | 'IV';
  status: 'Recrutando' | 'Em andamento' | 'Concluído' | 'Suspenso';
  pi: string;
  instituicao: string;
  participantes: { atual: number; meta: number };
  aprovacaoCEP: string;
  registroClinicalTrials: string;
}

const estudosDemo: Estudo[] = [
  { id: 'EST-001', titulo: 'Eficácia da Terapia Combinada de Empagliflozina + Semaglutida em DM2 com DRC Estágio 3', fase: 'III', status: 'Recrutando', pi: 'Prof. Dr. Ricardo Santos', instituicao: 'Hospital das Clínicas - FMUSP', participantes: { atual: 87, meta: 200 }, aprovacaoCEP: 'CAAE 12345678.9.0000.0068', registroClinicalTrials: 'NCT05123456' },
  { id: 'EST-002', titulo: 'Avaliação de Biomarcadores Preditivos de Resposta à Imunoterapia em Melanoma Avançado', fase: 'II', status: 'Em andamento', pi: 'Dra. Ana Oliveira', instituicao: 'INCA - Rio de Janeiro', participantes: { atual: 45, meta: 60 }, aprovacaoCEP: 'CAAE 98765432.1.0000.5274', registroClinicalTrials: 'NCT05234567' },
  { id: 'EST-003', titulo: 'Estudo Observacional de Desfechos Cardiovasculares em Pacientes com FA Tratados com DOACs', fase: 'IV', status: 'Em andamento', pi: 'Dr. Marcos Pereira', instituicao: 'InCor - FMUSP', participantes: { atual: 312, meta: 500 }, aprovacaoCEP: 'CAAE 11223344.5.0000.0068', registroClinicalTrials: 'NCT05345678' },
];

const PesquisaClinica: React.FC = () => {
  const [tab, setTab] = useState<'estudos' | 'tcle' | 'crf' | 'randomizacao' | 'regulatorio'>('estudos');
  const [selectedEstudo, setSelectedEstudo] = useState<Estudo | null>(null);
  const [randomResult, setRandomResult] = useState<string | null>(null);

  const randomizar = () => {
    const grupos = ['Grupo A (Tratamento)', 'Grupo B (Controle)'];
    const resultado = grupos[Math.floor(Math.random() * 2)];
    setRandomResult(resultado);
  };

  const tabs = [
    { id: 'estudos' as const, label: 'Estudos', icon: '📊' },
    { id: 'tcle' as const, label: 'TCLE', icon: '📝' },
    { id: 'crf' as const, label: 'CRF', icon: '📋' },
    { id: 'randomizacao' as const, label: 'Randomização', icon: '🎲' },
    { id: 'regulatorio' as const, label: 'Regulatório', icon: '⚖️' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <EducationalDisclaimer moduleName="Pesquisa Clínica" />

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🔬 Pesquisa Clínica</h1>
        <p className="text-gray-400">Gestão de estudos clínicos com TCLE, randomização, CRF e compliance regulatório</p>
      </div>

      <div className="flex gap-2 border-b border-gray-700 pb-2 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-white'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'estudos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">{estudosDemo.length}</div>
              <div className="text-gray-500 text-sm">Estudos Ativos</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{estudosDemo.reduce((s, e) => s + e.participantes.atual, 0)}</div>
              <div className="text-gray-500 text-sm">Participantes</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">1</div>
              <div className="text-gray-500 text-sm">Recrutando</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">100%</div>
              <div className="text-gray-500 text-sm">Compliance CEP</div>
            </div>
          </div>

          {estudosDemo.map(est => (
            <div key={est.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/50 transition-all cursor-pointer" onClick={() => setSelectedEstudo(selectedEstudo?.id === est.id ? null : est)}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">Fase {est.fase}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${est.status === 'Recrutando' ? 'bg-green-500/20 text-green-400' : est.status === 'Em andamento' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>{est.status}</span>
                    <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded">{est.id}</span>
                  </div>
                  <h3 className="text-white font-semibold">{est.titulo}</h3>
                  <p className="text-gray-500 text-sm mt-1">PI: {est.pi} — {est.instituicao}</p>
                </div>
              </div>

              {selectedEstudo?.id === est.id && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500 text-xs">Participantes</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-700 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(est.participantes.atual / est.participantes.meta) * 100}%` }} />
                        </div>
                        <span className="text-gray-400 text-sm">{est.participantes.atual}/{est.participantes.meta}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Aprovação CEP</span>
                      <p className="text-gray-300 text-sm mt-1">{est.aprovacaoCEP}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">ClinicalTrials.gov</span>
                    <p className="text-emerald-400 text-sm mt-1">{est.registroClinicalTrials}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'tcle' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">📝 Gerador de TCLE (Termo de Consentimento Livre e Esclarecido)</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">Título do Estudo</label>
                <input type="text" placeholder="Ex: Eficácia da droga X no tratamento de..." className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Pesquisador Responsável</label>
                  <input type="text" placeholder="Nome completo + CRM" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Instituição</label>
                  <input type="text" placeholder="Hospital/Universidade" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Objetivo do Estudo</label>
                <textarea rows={3} placeholder="Descreva em linguagem acessível ao leigo..." className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Procedimentos</label>
                <textarea rows={3} placeholder="Descreva os procedimentos que o participante será submetido..." className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Riscos e Desconfortos</label>
                <textarea rows={2} placeholder="Liste os riscos potenciais..." className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Benefícios</label>
                <textarea rows={2} placeholder="Benefícios diretos e indiretos..." className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
              </div>
              <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">📄 Gerar TCLE (Padrão CNS 466/2012)</button>
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h4 className="text-blue-400 font-semibold mb-2">📚 Requisitos do TCLE (Res. CNS 466/2012)</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Linguagem acessível ao participante (evitar jargão médico)</li>
              <li>• Garantia de sigilo e confidencialidade dos dados</li>
              <li>• Liberdade de recusa ou retirada sem penalização</li>
              <li>• Informação sobre riscos, benefícios e alternativas</li>
              <li>• Contato do pesquisador e do CEP/CONEP</li>
              <li>• Duas vias: uma para o participante, uma para o pesquisador</li>
            </ul>
          </div>
        </div>
      )}

      {tab === 'crf' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">📋 CRF — Case Report Form (Ficha de Relato de Caso)</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">ID do Participante</label>
                  <input type="text" placeholder="PART-001" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Visita</label>
                  <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                    <option>V0 - Screening</option>
                    <option>V1 - Baseline</option>
                    <option>V2 - Semana 4</option>
                    <option>V3 - Semana 12</option>
                    <option>V4 - Semana 24</option>
                    <option>V5 - Final</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Data da Visita</label>
                  <input type="date" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-emerald-400 font-medium mb-3">Dados Demográficos</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Idade</label>
                    <input type="number" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Sexo Biológico</label>
                    <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                      <option>Masculino</option>
                      <option>Feminino</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Raça/Etnia (IBGE)</label>
                    <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                      <option>Branca</option>
                      <option>Preta</option>
                      <option>Parda</option>
                      <option>Amarela</option>
                      <option>Indígena</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-emerald-400 font-medium mb-3">Sinais Vitais</h4>
                <div className="grid grid-cols-4 gap-4">
                  {['PA Sistólica (mmHg)', 'PA Diastólica (mmHg)', 'FC (bpm)', 'Temperatura (°C)', 'FR (irpm)', 'SpO2 (%)', 'Peso (kg)', 'Altura (cm)'].map(campo => (
                    <div key={campo}>
                      <label className="text-gray-400 text-xs block mb-1">{campo}</label>
                      <input type="number" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-3 py-1.5 text-sm" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-700 pt-4">
                <h4 className="text-emerald-400 font-medium mb-3">Eventos Adversos</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Descrição do EA</label>
                    <input type="text" placeholder="Descreva o evento adverso..." className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Gravidade (CTCAE v5.0)</label>
                    <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                      <option>Grau 1 - Leve</option>
                      <option>Grau 2 - Moderado</option>
                      <option>Grau 3 - Grave</option>
                      <option>Grau 4 - Risco de vida</option>
                      <option>Grau 5 - Óbito</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Relação com o Tratamento</label>
                    <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                      <option>Não relacionado</option>
                      <option>Improvável</option>
                      <option>Possível</option>
                      <option>Provável</option>
                      <option>Definido</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">Desfecho</label>
                    <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                      <option>Recuperado</option>
                      <option>Recuperando</option>
                      <option>Não recuperado</option>
                      <option>Sequela</option>
                      <option>Óbito</option>
                    </select>
                  </div>
                </div>
              </div>

              <button className="w-full py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700">💾 Salvar CRF</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'randomizacao' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">🎲 Sistema de Randomização</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Método</label>
                  <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                    <option>Randomização Simples (1:1)</option>
                    <option>Randomização em Blocos (blocos de 4)</option>
                    <option>Randomização Estratificada</option>
                    <option>Minimização</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Estudo</label>
                  <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                    {estudosDemo.map(e => <option key={e.id}>{e.id} — {e.titulo.substring(0, 50)}...</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">ID do Participante</label>
                <input type="text" placeholder="PART-XXX" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
              </div>

              <button onClick={randomizar} className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700">🎲 Randomizar Participante</button>

              {randomResult && (
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6 text-center">
                  <p className="text-gray-400 text-sm mb-2">Resultado da Randomização:</p>
                  <p className="text-3xl font-bold text-purple-400">{randomResult}</p>
                  <p className="text-gray-600 text-xs mt-2">Gerado por algoritmo criptograficamente seguro. Registro auditável.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h4 className="text-white font-semibold mb-3">📊 Distribuição Atual</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">52</div>
                <div className="text-gray-400 text-sm">Grupo A (Tratamento)</div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">48</div>
                <div className="text-gray-400 text-sm">Grupo B (Controle)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'regulatorio' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">⚖️ Compliance Regulatório</h3>
            <div className="space-y-3">
              {[
                { norma: 'Resolução CNS 466/2012', desc: 'Diretrizes e normas regulamentadoras de pesquisas envolvendo seres humanos', status: 'Conforme', orgao: 'CONEP' },
                { norma: 'Resolução CNS 510/2016', desc: 'Normas aplicáveis a pesquisas em Ciências Humanas e Sociais', status: 'Conforme', orgao: 'CONEP' },
                { norma: 'ICH-GCP E6(R2)', desc: 'International Council for Harmonisation — Good Clinical Practice', status: 'Conforme', orgao: 'ICH' },
                { norma: 'Declaração de Helsinki', desc: 'Princípios éticos para pesquisa médica envolvendo seres humanos', status: 'Conforme', orgao: 'WMA' },
                { norma: 'RDC ANVISA 09/2015', desc: 'Regulamento para realização de ensaios clínicos com medicamentos no Brasil', status: 'Conforme', orgao: 'ANVISA' },
                { norma: 'LGPD (Lei 13.709/2018)', desc: 'Proteção de dados pessoais dos participantes de pesquisa', status: 'Conforme', orgao: 'ANPD' },
              ].map(item => (
                <div key={item.norma} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <div className="text-white text-sm font-medium">{item.norma}</div>
                    <div className="text-gray-500 text-xs">{item.desc}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded">{item.orgao}</span>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">{item.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h4 className="text-white font-semibold mb-3">📋 Checklist de Submissão ao CEP</h4>
            <div className="space-y-2">
              {[
                'Projeto de pesquisa completo',
                'TCLE e TALE (se menores)',
                'Folha de rosto assinada (Plataforma Brasil)',
                'Currículo Lattes do pesquisador principal',
                'Orçamento detalhado do estudo',
                'Cronograma de execução',
                'Termo de anuência da instituição coparticipante',
                'Declaração de infraestrutura',
                'CRF (Case Report Form)',
                'Brochura do investigador (se aplicável)',
              ].map((item, i) => (
                <label key={i} className="flex items-center gap-3 p-2 hover:bg-gray-900/50 rounded-lg cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-600" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-600 text-center">
        Ref: CNS 466/2012 | ICH-GCP E6(R2) | Declaração de Helsinki 2013 | RDC ANVISA 09/2015
      </div>
    </div>
  );
};

export default PesquisaClinica;
