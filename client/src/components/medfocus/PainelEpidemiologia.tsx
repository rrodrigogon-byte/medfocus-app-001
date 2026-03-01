/**
 * MedFocus — Painel de Epidemiologia
 * Sprint 48: Vigilância epidemiológica com mapas, surtos, notificação compulsória e indicadores de saúde
 */
import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface DadoEpidemiologico {
  doenca: string;
  casosUltimaSemana: number;
  tendencia: 'alta' | 'estavel' | 'queda';
  incidencia: number;
  letalidade: number;
  regiao: string;
  notificacaoCompulsoria: boolean;
}

const dadosEpidemiologicos: DadoEpidemiologico[] = [
  { doenca: 'Dengue', casosUltimaSemana: 45230, tendencia: 'alta', incidencia: 21.3, letalidade: 0.04, regiao: 'Sudeste', notificacaoCompulsoria: true },
  { doenca: 'COVID-19', casosUltimaSemana: 12450, tendencia: 'queda', incidencia: 5.9, letalidade: 0.8, regiao: 'Nacional', notificacaoCompulsoria: true },
  { doenca: 'Influenza A (H3N2)', casosUltimaSemana: 8920, tendencia: 'estavel', incidencia: 4.2, letalidade: 0.1, regiao: 'Sul', notificacaoCompulsoria: true },
  { doenca: 'Chikungunya', casosUltimaSemana: 3210, tendencia: 'alta', incidencia: 1.5, letalidade: 0.02, regiao: 'Nordeste', notificacaoCompulsoria: true },
  { doenca: 'Tuberculose', casosUltimaSemana: 1890, tendencia: 'estavel', incidencia: 0.9, letalidade: 2.1, regiao: 'Nacional', notificacaoCompulsoria: true },
  { doenca: 'Sífilis Congênita', casosUltimaSemana: 420, tendencia: 'alta', incidencia: 0.2, letalidade: 0.5, regiao: 'Norte', notificacaoCompulsoria: true },
  { doenca: 'Hepatite B', casosUltimaSemana: 310, tendencia: 'queda', incidencia: 0.15, letalidade: 0.3, regiao: 'Nacional', notificacaoCompulsoria: true },
  { doenca: 'Meningite Bacteriana', casosUltimaSemana: 85, tendencia: 'estavel', incidencia: 0.04, letalidade: 15.2, regiao: 'Sudeste', notificacaoCompulsoria: true },
  { doenca: 'Leishmaniose Visceral', casosUltimaSemana: 67, tendencia: 'queda', incidencia: 0.03, letalidade: 7.8, regiao: 'Nordeste', notificacaoCompulsoria: true },
  { doenca: 'Febre Amarela', casosUltimaSemana: 12, tendencia: 'queda', incidencia: 0.006, letalidade: 32.0, regiao: 'Sudeste', notificacaoCompulsoria: true },
];

const doencasNotificacaoImediata = [
  'Botulismo', 'Cólera', 'Febre Amarela', 'Peste', 'Raiva Humana',
  'Síndrome Respiratória Aguda Grave (SRAG)', 'Varíola', 'Ebola',
  'Antraz', 'Difteria', 'Poliomielite', 'Sarampo', 'Tétano Neonatal',
  'Eventos de Saúde Pública de Importância Nacional (ESPIN)',
];

const PainelEpidemiologia: React.FC = () => {
  const [tab, setTab] = useState<'painel' | 'notificacao' | 'indicadores' | 'calendario'>('painel');
  const [filtroRegiao, setFiltroRegiao] = useState('Todas');

  const tabs = [
    { id: 'painel' as const, label: 'Painel', icon: '📊' },
    { id: 'notificacao' as const, label: 'Notificação', icon: '🔔' },
    { id: 'indicadores' as const, label: 'Indicadores', icon: '📈' },
    { id: 'calendario' as const, label: 'Calendário Vacinal', icon: '💉' },
  ];

  const dadosFiltrados = filtroRegiao === 'Todas' ? dadosEpidemiologicos : dadosEpidemiologicos.filter(d => d.regiao === filtroRegiao);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <EducationalDisclaimer moduleName="Epidemiologia" />

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🌍 Painel de Epidemiologia</h1>
        <p className="text-gray-400">Vigilância epidemiológica, notificação compulsória e indicadores de saúde pública</p>
      </div>

      <div className="flex gap-2 border-b border-gray-700 pb-2 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-white'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'painel' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-red-400">{dadosEpidemiologicos.filter(d => d.tendencia === 'alta').length}</div>
              <div className="text-gray-500 text-sm">Em Alta</div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{dadosEpidemiologicos.filter(d => d.tendencia === 'estavel').length}</div>
              <div className="text-gray-500 text-sm">Estável</div>
            </div>
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{dadosEpidemiologicos.filter(d => d.tendencia === 'queda').length}</div>
              <div className="text-gray-500 text-sm">Em Queda</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{dadosEpidemiologicos.reduce((s, d) => s + d.casosUltimaSemana, 0).toLocaleString('pt-BR')}</div>
              <div className="text-gray-500 text-sm">Casos/Semana</div>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-gray-400 text-sm">Região:</span>
            {['Todas', 'Nacional', 'Norte', 'Nordeste', 'Sudeste', 'Sul', 'Centro-Oeste'].map(r => (
              <button key={r} onClick={() => setFiltroRegiao(r)} className={`px-3 py-1 rounded-lg text-xs ${filtroRegiao === r ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>{r}</button>
            ))}
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700 text-gray-400">
                  <th className="text-left p-3">Doença</th>
                  <th className="text-right p-3">Casos/Sem</th>
                  <th className="text-center p-3">Tendência</th>
                  <th className="text-right p-3">Incidência (/100k)</th>
                  <th className="text-right p-3">Letalidade (%)</th>
                  <th className="text-center p-3">Região</th>
                </tr>
              </thead>
              <tbody>
                {dadosFiltrados.map(d => (
                  <tr key={d.doenca} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                    <td className="p-3 text-white font-medium">{d.doenca}</td>
                    <td className="p-3 text-right text-gray-300">{d.casosUltimaSemana.toLocaleString('pt-BR')}</td>
                    <td className="p-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded ${d.tendencia === 'alta' ? 'bg-red-500/20 text-red-400' : d.tendencia === 'queda' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                        {d.tendencia === 'alta' ? '↑ Alta' : d.tendencia === 'queda' ? '↓ Queda' : '→ Estável'}
                      </span>
                    </td>
                    <td className="p-3 text-right text-gray-300">{d.incidencia}</td>
                    <td className={`p-3 text-right ${d.letalidade > 10 ? 'text-red-400 font-bold' : d.letalidade > 1 ? 'text-yellow-400' : 'text-gray-300'}`}>{d.letalidade}%</td>
                    <td className="p-3 text-center text-gray-400">{d.regiao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'notificacao' && (
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
            <h3 className="text-red-400 font-semibold mb-3">🚨 Doenças de Notificação Imediata (até 24h)</h3>
            <p className="text-gray-400 text-sm mb-4">Portaria GM/MS nº 217/2023 — Lista Nacional de Notificação Compulsória</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {doencasNotificacaoImediata.map(d => (
                <div key={d} className="bg-red-500/5 border border-red-500/20 rounded-lg p-2 text-red-300 text-sm">{d}</div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">📝 Ficha de Notificação (SINAN)</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Tipo de Notificação</label>
                  <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                    <option>Individual</option>
                    <option>Surto</option>
                    <option>Agregado</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Agravo/Doença</label>
                  <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                    {dadosEpidemiologicos.map(d => <option key={d.doenca}>{d.doenca}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Data dos Primeiros Sintomas</label>
                  <input type="date" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Data da Notificação</label>
                  <input type="date" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">UF de Notificação</label>
                  <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                    {['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'].map(uf => <option key={uf}>{uf}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Nome do Paciente</label>
                <input type="text" placeholder="Nome completo" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Data de Nascimento</label>
                  <input type="date" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Sexo</label>
                  <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                    <option>Masculino</option>
                    <option>Feminino</option>
                    <option>Ignorado</option>
                  </select>
                </div>
                <div>
                  <label className="text-gray-400 text-sm block mb-1">Gestante</label>
                  <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                    <option>Não se aplica</option>
                    <option>1º Trimestre</option>
                    <option>2º Trimestre</option>
                    <option>3º Trimestre</option>
                    <option>Ignorado</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Observações Clínicas</label>
                <textarea rows={3} placeholder="Descreva sinais, sintomas e evolução..." className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
              </div>
              <button className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700">🔔 Enviar Notificação (SINAN)</button>
            </div>
          </div>
        </div>
      )}

      {tab === 'indicadores' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">📈 Indicadores de Saúde Pública — Brasil 2025</h3>
            <div className="space-y-3">
              {[
                { indicador: 'Taxa de Mortalidade Infantil', valor: '11,9', unidade: 'por 1.000 NV', fonte: 'DATASUS/SIM', tendencia: 'queda' },
                { indicador: 'Razão de Mortalidade Materna', valor: '55,3', unidade: 'por 100.000 NV', fonte: 'DATASUS/SIM', tendencia: 'estavel' },
                { indicador: 'Expectativa de Vida ao Nascer', valor: '76,8', unidade: 'anos', fonte: 'IBGE', tendencia: 'alta' },
                { indicador: 'Cobertura Vacinal (Penta)', valor: '82,4', unidade: '%', fonte: 'SI-PNI', tendencia: 'alta' },
                { indicador: 'Incidência de Tuberculose', valor: '33,2', unidade: 'por 100.000 hab', fonte: 'SINAN', tendencia: 'estavel' },
                { indicador: 'Taxa de Detecção de HIV', valor: '17,8', unidade: 'por 100.000 hab', fonte: 'SINAN', tendencia: 'queda' },
                { indicador: 'Cobertura de ESF', valor: '76,1', unidade: '%', fonte: 'e-SUS AB', tendencia: 'alta' },
                { indicador: 'Leitos UTI/10.000 hab', valor: '2,3', unidade: 'leitos', fonte: 'CNES', tendencia: 'estavel' },
                { indicador: 'Taxa de Cesáreas', valor: '56,3', unidade: '%', fonte: 'SINASC', tendencia: 'estavel' },
                { indicador: 'Proporção de Óbitos por DCNT', valor: '72,8', unidade: '%', fonte: 'SIM', tendencia: 'alta' },
              ].map(item => (
                <div key={item.indicador} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{item.indicador}</div>
                    <div className="text-gray-500 text-xs">Fonte: {item.fonte}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold">{item.valor} <span className="text-gray-500 font-normal text-xs">{item.unidade}</span></span>
                    <span className={`text-xs px-2 py-0.5 rounded ${item.tendencia === 'alta' ? 'bg-green-500/20 text-green-400' : item.tendencia === 'queda' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {item.tendencia === 'alta' ? '↑' : item.tendencia === 'queda' ? '↓' : '→'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h4 className="text-blue-400 font-semibold mb-2">📚 Sistemas de Informação em Saúde (SIS)</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                { sigla: 'SINAN', nome: 'Sistema de Informação de Agravos de Notificação' },
                { sigla: 'SIM', nome: 'Sistema de Informação sobre Mortalidade' },
                { sigla: 'SINASC', nome: 'Sistema de Informação sobre Nascidos Vivos' },
                { sigla: 'SI-PNI', nome: 'Sistema de Informação do Programa Nacional de Imunizações' },
                { sigla: 'SIH-SUS', nome: 'Sistema de Informações Hospitalares' },
                { sigla: 'SIA-SUS', nome: 'Sistema de Informações Ambulatoriais' },
                { sigla: 'CNES', nome: 'Cadastro Nacional de Estabelecimentos de Saúde' },
                { sigla: 'e-SUS AB', nome: 'Sistema de Atenção Básica' },
              ].map(s => (
                <div key={s.sigla} className="flex gap-2 p-2 bg-blue-500/5 rounded">
                  <span className="text-blue-400 font-mono font-bold">{s.sigla}</span>
                  <span className="text-gray-400">{s.nome}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'calendario' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">💉 Calendário Nacional de Vacinação — PNI 2025</h3>
            <div className="space-y-3">
              {[
                { faixa: 'Ao nascer', vacinas: ['BCG (dose única)', 'Hepatite B (1ª dose)'] },
                { faixa: '2 meses', vacinas: ['Penta (1ª dose)', 'VIP (1ª dose)', 'Pneumo 10 (1ª dose)', 'Rotavírus (1ª dose)'] },
                { faixa: '3 meses', vacinas: ['Meningo C (1ª dose)'] },
                { faixa: '4 meses', vacinas: ['Penta (2ª dose)', 'VIP (2ª dose)', 'Pneumo 10 (2ª dose)', 'Rotavírus (2ª dose)'] },
                { faixa: '5 meses', vacinas: ['Meningo C (2ª dose)'] },
                { faixa: '6 meses', vacinas: ['Penta (3ª dose)', 'VIP (3ª dose)', 'COVID-19 (1ª dose)'] },
                { faixa: '9 meses', vacinas: ['Febre Amarela (dose única)'] },
                { faixa: '12 meses', vacinas: ['Tríplice Viral (1ª dose)', 'Pneumo 10 (reforço)', 'Meningo C (reforço)'] },
                { faixa: '15 meses', vacinas: ['DTP (1º reforço)', 'VOP (1º reforço)', 'Hepatite A', 'Tetra Viral'] },
                { faixa: '4 anos', vacinas: ['DTP (2º reforço)', 'VOP (2º reforço)', 'Varicela (2ª dose)'] },
                { faixa: 'Adolescente', vacinas: ['HPV (2 doses)', 'Meningo ACWY', 'dT (reforço a cada 10 anos)'] },
                { faixa: 'Adulto', vacinas: ['Hepatite B (3 doses se não vacinado)', 'dT (reforço)', 'Febre Amarela (reforço)'] },
                { faixa: 'Gestante', vacinas: ['dTpa (a partir da 20ª semana)', 'Influenza (dose anual)'] },
                { faixa: 'Idoso (60+)', vacinas: ['Influenza (dose anual)', 'Pneumo 23 (dose única)', 'COVID-19 (dose anual)'] },
              ].map(faixa => (
                <div key={faixa.faixa} className="flex gap-4 p-3 bg-gray-900/50 rounded-lg">
                  <div className="w-32 shrink-0">
                    <span className="text-emerald-400 font-medium text-sm">{faixa.faixa}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {faixa.vacinas.map(v => (
                      <span key={v} className="text-xs bg-emerald-500/10 text-emerald-300 px-2 py-1 rounded">{v}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <p className="text-yellow-400 text-sm">⚠️ Calendário baseado no PNI/MS. Consulte sempre a versão mais atualizada no site do Ministério da Saúde. Vacinas especiais disponíveis nos CRIEs.</p>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-600 text-center">
        Fontes: DATASUS | SINAN | SIM | SINASC | SI-PNI | IBGE | Ministério da Saúde
      </div>
    </div>
  );
};

export default PainelEpidemiologia;
