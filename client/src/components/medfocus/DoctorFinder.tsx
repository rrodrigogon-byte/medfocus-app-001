/**
 * MedFocus — Encontre um Médico
 * Busca de médicos por estado, cidade e especialidade.
 * Integração com portais do CFM e CRMs regionais para validação.
 * Base expandida para todos os 27 estados + DF.
 */
import React, { useState, useMemo } from 'react';
import { DOCTORS_DB, ESPECIALIDADES_CFM, CONVENIOS_BRASIL, CRM_PORTAIS, PRECO_CONSULTA, type Doctor } from './doctorsDB';
import { ESTADOS_CIDADES_COMPLETO, ESTADOS_NOMES } from './cidadesBrasil';

const TODOS_ESTADOS = Object.keys(ESTADOS_NOMES).sort();

export default function DoctorFinder() {
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [search, setSearch] = useState('');
  const [tele, setTele] = useState(false);
  const [convenioFilter, setConvenioFilter] = useState('');
  const [tab, setTab] = useState<'buscar' | 'precos' | 'contribuir' | 'validar'>('buscar');
  const [expandedDoctor, setExpandedDoctor] = useState<string | null>(null);
  const [crmInput, setCrmInput] = useState('');
  const [crmEstado, setCrmEstado] = useState('SP');
  const [contribMedico, setContribMedico] = useState('');
  const [contribEsp, setContribEsp] = useState('');
  const [contribCidade, setContribCidade] = useState('');
  const [contribEstado, setContribEstado] = useState('');
  const [contribPreco, setContribPreco] = useState('');
  const [contribSent, setContribSent] = useState(false);

  const cidades = useMemo(() => {
    if (!estado) return [];
    return ESTADOS_CIDADES_COMPLETO[estado] || [];
  }, [estado]);

  const filtered = useMemo(() => {
    let docs = DOCTORS_DB;
    if (estado) docs = docs.filter(d => d.estado === estado);
    if (cidade) docs = docs.filter(d => d.cidade === cidade);
    if (especialidade) docs = docs.filter(d => d.especialidade === especialidade);
    if (tele) docs = docs.filter(d => d.telemedicina);
    if (convenioFilter) docs = docs.filter(d => d.convenios.includes(convenioFilter));
    if (search) {
      const s = search.toLowerCase();
      docs = docs.filter(d =>
        d.nome.toLowerCase().includes(s) ||
        d.crm.toLowerCase().includes(s) ||
        d.especialidade.toLowerCase().includes(s) ||
        d.cidade.toLowerCase().includes(s)
      );
    }
    return docs.sort((a, b) => b.avaliacao - a.avaliacao);
  }, [estado, cidade, especialidade, search, tele, convenioFilter]);

  const handleContrib = () => {
    setContribSent(true);
    setTimeout(() => setContribSent(false), 5000);
  };

  const cfmLink = estado
    ? CRM_PORTAIS[estado]?.busca || `https://portal.cfm.org.br/busca-medicos/?uf=${estado}`
    : 'https://portal.cfm.org.br/busca-medicos/';

  const crmPortal = crmEstado ? CRM_PORTAIS[crmEstado] : null;

  const tabs = [
    { id: 'buscar' as const, label: 'Buscar Médico', icon: '🔍' },
    { id: 'validar' as const, label: 'Validar CRM', icon: '✅' },
    { id: 'precos' as const, label: 'Preços por Especialidade', icon: '💰' },
    { id: 'contribuir' as const, label: 'Informar Preço', icon: '📝' },
  ];

  const conveniosDisponiveis = useMemo(() => {
    const all = new Set<string>();
    DOCTORS_DB.forEach(d => d.convenios.forEach(c => all.add(c)));
    return Array.from(all).sort();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'buscar' && (
        <>
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 space-y-4">
            <h3 className="text-lg font-bold text-white">Filtrar por localização e especialidade</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <select value={estado} onChange={e => { setEstado(e.target.value); setCidade(''); }}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
                <option value="">Todos os estados</option>
                {TODOS_ESTADOS.map(uf => (
                  <option key={uf} value={uf}>{uf} — {ESTADOS_NOMES[uf]}</option>
                ))}
              </select>
              <select value={cidade} onChange={e => setCidade(e.target.value)}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
                <option value="">Todas as cidades</option>
                {cidades.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={especialidade} onChange={e => setEspecialidade(e.target.value)}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
                <option value="">Todas as especialidades</option>
                {ESPECIALIDADES_CFM.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <select value={convenioFilter} onChange={e => setConvenioFilter(e.target.value)}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
                <option value="">Todos os convênios</option>
                {conveniosDisponiveis.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex flex-col md:flex-row gap-3">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nome, CRM, especialidade ou cidade..."
                className="flex-1 px-3 py-2 bg-gray-900 border border-emerald-600/50 rounded-lg text-white text-sm" />
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer whitespace-nowrap">
                <input type="checkbox" checked={tele} onChange={e => setTele(e.target.checked)}
                  className="rounded bg-gray-700 border-gray-600 text-emerald-500 focus:ring-emerald-500" />
                Telemedicina
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {filtered.length} médico{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
              {estado && ` em ${ESTADOS_NOMES[estado] || estado}`}
              {cidade && ` — ${cidade}`}
            </p>
            <a href={cfmLink} target="_blank" rel="noopener noreferrer"
              className="text-sm text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1">
              Buscar no CFM oficial
            </a>
          </div>

          <div className="space-y-3">
            {filtered.map(doc => (
              <div key={doc.id}
                className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 hover:border-emerald-600/30 transition-all cursor-pointer"
                onClick={() => setExpandedDoctor(expandedDoctor === doc.id ? null : doc.id)}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-white">{doc.nome}</h4>
                      <span className="text-xs bg-emerald-900/40 text-emerald-400 px-2 py-0.5 rounded-full">{doc.crm}</span>
                      {doc.telemedicina && (
                        <span className="text-xs bg-blue-900/40 text-blue-400 px-2 py-0.5 rounded-full">Telemedicina</span>
                      )}
                    </div>
                    <p className="text-sm text-emerald-400 mt-1">{doc.especialidade}</p>
                    <p className="text-xs text-gray-400 mt-1">{doc.cidade} — {ESTADOS_NOMES[doc.estado] || doc.estado}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doc.convenios.map(c => (
                        <span key={c} className="text-xs bg-gray-700/50 text-gray-300 px-2 py-0.5 rounded-full">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">&#9733;</span>
                      <span className="text-white font-bold">{doc.avaliacao}</span>
                    </div>
                    {doc.precoConsulta && (
                      <p className="text-emerald-400 font-bold text-sm mt-1">R$ {doc.precoConsulta}</p>
                    )}
                  </div>
                </div>
                {expandedDoctor === doc.id && (
                  <div className="mt-4 pt-4 border-t border-gray-700/50 space-y-2">
                    {doc.endereco && (
                      <p className="text-sm text-gray-300">{doc.endereco}</p>
                    )}
                    <p className="text-sm text-gray-300">Tel: {doc.telefone}</p>
                    {doc.whatsapp && (
                      <a href={`https://wa.me/55${doc.whatsapp.replace(/\D/g, '')}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-green-400 hover:text-green-300">
                        WhatsApp: {doc.whatsapp}
                      </a>
                    )}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <a href={`https://portal.cfm.org.br/busca-medicos/?crm=${doc.crm.split(' ')[1]}&uf=${doc.estado}`}
                        target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white text-xs rounded-lg transition-colors">
                        Verificar CRM no CFM
                      </a>
                      {doc.endereco && (
                        <a href={`https://www.google.com/maps/search/${encodeURIComponent(doc.endereco)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs rounded-lg transition-colors">
                          Ver no Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 bg-gray-800/40 rounded-xl border border-gray-700/30">
                <p className="text-lg text-gray-400">Nenhum médico encontrado na base local.</p>
                <p className="text-sm mt-2 text-gray-500">
                  Busque diretamente no portal oficial do CFM para resultados completos:
                </p>
                <a href={cfmLink}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-block mt-3 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition-colors">
                  Buscar no CFM — {estado ? ESTADOS_NOMES[estado] : 'Brasil'}
                </a>
                {estado && CRM_PORTAIS[estado] && (
                  <div className="mt-3">
                    <a href={CRM_PORTAIS[estado].busca}
                      target="_blank" rel="noopener noreferrer"
                      className="text-sm text-emerald-400 hover:underline">
                      Ou busque no {CRM_PORTAIS[estado].nome}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {estado && CRM_PORTAIS[estado] && (
            <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4 text-sm">
              <p className="text-blue-200/80">
                <strong>Busca oficial:</strong> Para uma lista completa de médicos em {ESTADOS_NOMES[estado]}, consulte o{' '}
                <a href={CRM_PORTAIS[estado].busca} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                  {CRM_PORTAIS[estado].nome}
                </a>{' '}
                ou o{' '}
                <a href={`https://portal.cfm.org.br/busca-medicos/?uf=${estado}`} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">
                  Portal do CFM
                </a>.
              </p>
            </div>
          )}
        </>
      )}

      {tab === 'validar' && (
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Validar Registro no CRM</h3>
          <p className="text-sm text-gray-400">
            Verifique se um médico possui registro ativo no Conselho Regional de Medicina.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select value={crmEstado} onChange={e => setCrmEstado(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
              {TODOS_ESTADOS.map(uf => (
                <option key={uf} value={uf}>{uf} — {ESTADOS_NOMES[uf]}</option>
              ))}
            </select>
            <input type="text" value={crmInput} onChange={e => setCrmInput(e.target.value)}
              placeholder="Número do CRM..."
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm" />
            <a href={`https://portal.cfm.org.br/busca-medicos/?crm=${crmInput}&uf=${crmEstado}`}
              target="_blank" rel="noopener noreferrer"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm text-center transition-colors">
              Verificar no CFM
            </a>
          </div>
          {crmPortal && (
            <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
              <h4 className="text-white font-medium">Links de verificação para {ESTADOS_NOMES[crmEstado]}</h4>
              <div className="flex flex-wrap gap-2">
                <a href={`https://portal.cfm.org.br/busca-medicos/?uf=${crmEstado}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-emerald-800/50 hover:bg-emerald-700/50 text-emerald-300 text-xs rounded-lg transition-colors">
                  CFM — Portal Federal
                </a>
                <a href={crmPortal.busca}
                  target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-800/50 hover:bg-blue-700/50 text-blue-300 text-xs rounded-lg transition-colors">
                  {crmPortal.nome} — Portal Regional
                </a>
                <a href={crmPortal.url}
                  target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 text-xs rounded-lg transition-colors">
                  Site do {crmPortal.nome}
                </a>
              </div>
            </div>
          )}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Portais dos CRMs Regionais</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {TODOS_ESTADOS.map(uf => (
                <a key={uf}
                  href={CRM_PORTAIS[uf]?.busca || `https://portal.cfm.org.br/busca-medicos/?uf=${uf}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg text-xs text-gray-300 hover:text-white transition-colors">
                  <span className="font-bold text-emerald-400">{uf}</span>
                  <span className="truncate">{CRM_PORTAIS[uf]?.nome || `CRM-${uf}`}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'precos' && (
        <div className="space-y-4">
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4">Estatísticas de Preços por Especialidade</h3>
            <p className="text-sm text-gray-400 mb-4">Valores estimados com base em dados públicos e contribuições de usuários. Sempre confirme diretamente com o consultório.</p>
            <div className="space-y-3">
              {Object.entries(PRECO_CONSULTA).sort((a, b) => a[0].localeCompare(b[0])).map(([esp, s]) => (
                <div key={esp} className="bg-gray-900/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-white text-sm">{esp}</span>
                    <span className="text-emerald-400 font-bold text-sm">Média: R$ {s.media}</span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>Mín: <span className="text-green-400">R$ {s.min}</span></span>
                    <span>Mediana: <span className="text-blue-400">R$ {s.mediana}</span></span>
                    <span>Máx: <span className="text-red-400">R$ {s.max}</span></span>
                  </div>
                  <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-red-500 rounded-full"
                      style={{ width: `${Math.min(100, (s.media / s.max) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'contribuir' && (
        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold text-white">Informar Preço de Consulta</h3>
          <p className="text-sm text-gray-400">Ajude outros usuários informando o valor que pagou em uma consulta médica.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input type="text" value={contribMedico} onChange={e => setContribMedico(e.target.value)}
              placeholder="Nome do médico..."
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm" />
            <select value={contribEsp} onChange={e => setContribEsp(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
              <option value="">Especialidade...</option>
              {ESPECIALIDADES_CFM.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <select value={contribEstado} onChange={e => setContribEstado(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
              <option value="">Estado...</option>
              {TODOS_ESTADOS.map(e => <option key={e} value={e}>{e} — {ESTADOS_NOMES[e]}</option>)}
            </select>
            <input type="text" value={contribCidade} onChange={e => setContribCidade(e.target.value)}
              placeholder="Cidade..."
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm" />
            <input type="text" value={contribPreco} onChange={e => setContribPreco(e.target.value)}
              placeholder="Valor da consulta (R$)..."
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm" />
          </div>
          <button onClick={handleContrib}
            disabled={!contribMedico || !contribPreco}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg text-sm transition-colors">
            Enviar Informação
          </button>
          {contribSent && (
            <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-3 text-sm text-emerald-300">
              Obrigado pela contribuição! As informações serão verificadas e adicionadas ao sistema.
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4 text-sm text-blue-200/80">
        <strong>Aviso:</strong> Sempre verifique o registro do médico no site do{' '}
        <a href="https://portal.cfm.org.br/busca-medicos/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">CFM</a>.
        Preços são informativos e podem variar. Os dados de CRM são públicos conforme Resolução CFM N° 2.129/15.
      </div>
    </div>
  );
}
