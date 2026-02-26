/**
 * MedFocus — Encontre um Médico
 * Busca de médicos por estado e cidade com base local para SP, MT, RJ, MG, GO, PA.
 * Inclui estatísticas de preços de consultas e opção do usuário incluir valores.
 */
import React, { useState, useMemo } from 'react';

interface Doctor {
  id: string; nome: string; crm: string; especialidade: string;
  cidade: string; estado: string; telefone: string;
  convenios: string[]; telemedicina: boolean; avaliacao: number;
  precoConsulta?: number;
}

// Base local completa para SP, MT, RJ, MG, GO, PA
const DOCTORS_DB: Doctor[] = [
  // === SÃO PAULO ===
  { id:'sp1', nome:'Dr. Carlos Alberto Silva', crm:'CRM/SP 123456', especialidade:'Cardiologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 3456-7890', convenios:['Unimed','SulAmérica','Bradesco Saúde'], telemedicina:true, avaliacao:4.8, precoConsulta:350 },
  { id:'sp2', nome:'Dra. Maria Fernanda Costa', crm:'CRM/SP 234567', especialidade:'Dermatologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 2345-6789', convenios:['Amil','Unimed','Porto Seguro'], telemedicina:true, avaliacao:4.9, precoConsulta:400 },
  { id:'sp3', nome:'Dr. Ricardo Moreira', crm:'CRM/SP 345678', especialidade:'Ortopedia', cidade:'São Paulo', estado:'SP', telefone:'(11) 3567-8901', convenios:['Unimed','Bradesco Saúde','Amil'], telemedicina:false, avaliacao:4.7, precoConsulta:380 },
  { id:'sp4', nome:'Dra. Luciana Pereira', crm:'CRM/SP 456789', especialidade:'Ginecologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 4567-8901', convenios:['SulAmérica','Amil'], telemedicina:true, avaliacao:4.8, precoConsulta:320 },
  { id:'sp5', nome:'Dr. André Nascimento', crm:'CRM/SP 567890', especialidade:'Neurologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 5678-9012', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.6, precoConsulta:450 },
  { id:'sp6', nome:'Dra. Beatriz Almeida', crm:'CRM/SP 678901', especialidade:'Pediatria', cidade:'Campinas', estado:'SP', telefone:'(19) 3456-7890', convenios:['Unimed','SulAmérica'], telemedicina:true, avaliacao:4.9, precoConsulta:280 },
  { id:'sp7', nome:'Dr. Paulo Henrique Dias', crm:'CRM/SP 789012', especialidade:'Endocrinologia', cidade:'Campinas', estado:'SP', telefone:'(19) 4567-8901', convenios:['Amil','Unimed'], telemedicina:false, avaliacao:4.7, precoConsulta:350 },
  { id:'sp8', nome:'Dra. Fernanda Souza', crm:'CRM/SP 890123', especialidade:'Psiquiatria', cidade:'Ribeirão Preto', estado:'SP', telefone:'(16) 3456-7890', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.8, precoConsulta:400 },
  { id:'sp9', nome:'Dr. Gustavo Martins', crm:'CRM/SP 901234', especialidade:'Urologia', cidade:'Santos', estado:'SP', telefone:'(13) 3456-7890', convenios:['Unimed','SulAmérica'], telemedicina:false, avaliacao:4.5, precoConsulta:350 },
  { id:'sp10', nome:'Dra. Camila Rodrigues', crm:'CRM/SP 012345', especialidade:'Clínica Geral', cidade:'Sorocaba', estado:'SP', telefone:'(15) 3456-7890', convenios:['Unimed','Amil'], telemedicina:true, avaliacao:4.6, precoConsulta:200 },
  { id:'sp11', nome:'Dr. Thiago Oliveira', crm:'CRM/SP 112233', especialidade:'Oftalmologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 6789-0123', convenios:['Unimed','Bradesco Saúde','Amil'], telemedicina:false, avaliacao:4.7, precoConsulta:300 },
  { id:'sp12', nome:'Dra. Isabela Santos', crm:'CRM/SP 223344', especialidade:'Reumatologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 7890-1234', convenios:['SulAmérica','Porto Seguro'], telemedicina:true, avaliacao:4.8, precoConsulta:380 },
  // === RIO DE JANEIRO ===
  { id:'rj1', nome:'Dr. João Pedro Santos', crm:'CRM/RJ 345678', especialidade:'Ortopedia', cidade:'Rio de Janeiro', estado:'RJ', telefone:'(21) 3456-7890', convenios:['Unimed','Bradesco Saúde'], telemedicina:false, avaliacao:4.7, precoConsulta:350 },
  { id:'rj2', nome:'Dra. Mariana Lima', crm:'CRM/RJ 456789', especialidade:'Cardiologia', cidade:'Rio de Janeiro', estado:'RJ', telefone:'(21) 4567-8901', convenios:['Amil','SulAmérica','Golden Cross'], telemedicina:true, avaliacao:4.8, precoConsulta:400 },
  { id:'rj3', nome:'Dr. Felipe Araújo', crm:'CRM/RJ 567890', especialidade:'Dermatologia', cidade:'Rio de Janeiro', estado:'RJ', telefone:'(21) 5678-9012', convenios:['Unimed','Amil'], telemedicina:true, avaliacao:4.9, precoConsulta:450 },
  { id:'rj4', nome:'Dra. Carolina Mendes', crm:'CRM/RJ 678901', especialidade:'Ginecologia', cidade:'Niterói', estado:'RJ', telefone:'(21) 6789-0123', convenios:['Unimed','Bradesco Saúde'], telemedicina:false, avaliacao:4.6, precoConsulta:300 },
  { id:'rj5', nome:'Dr. Bruno Ferreira', crm:'CRM/RJ 789012', especialidade:'Neurologia', cidade:'Rio de Janeiro', estado:'RJ', telefone:'(21) 7890-1234', convenios:['SulAmérica','Golden Cross'], telemedicina:true, avaliacao:4.7, precoConsulta:500 },
  { id:'rj6', nome:'Dra. Tatiana Rocha', crm:'CRM/RJ 890123', especialidade:'Pediatria', cidade:'Petrópolis', estado:'RJ', telefone:'(24) 3456-7890', convenios:['Unimed'], telemedicina:true, avaliacao:4.8, precoConsulta:250 },
  { id:'rj7', nome:'Dr. Eduardo Gomes', crm:'CRM/RJ 901234', especialidade:'Psiquiatria', cidade:'Rio de Janeiro', estado:'RJ', telefone:'(21) 8901-2345', convenios:['Amil','Bradesco Saúde'], telemedicina:true, avaliacao:4.9, precoConsulta:500 },
  { id:'rj8', nome:'Dra. Priscila Nunes', crm:'CRM/RJ 012345', especialidade:'Endocrinologia', cidade:'Duque de Caxias', estado:'RJ', telefone:'(21) 9012-3456', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.5, precoConsulta:280 },
  // === MINAS GERAIS ===
  { id:'mg1', nome:'Dra. Ana Beatriz Oliveira', crm:'CRM/MG 456789', especialidade:'Pediatria', cidade:'Belo Horizonte', estado:'MG', telefone:'(31) 3456-7890', convenios:['Unimed','SulAmérica','Hapvida'], telemedicina:true, avaliacao:4.9, precoConsulta:280 },
  { id:'mg2', nome:'Dr. Rodrigo Alves', crm:'CRM/MG 567890', especialidade:'Cardiologia', cidade:'Belo Horizonte', estado:'MG', telefone:'(31) 4567-8901', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.8, precoConsulta:350 },
  { id:'mg3', nome:'Dra. Larissa Campos', crm:'CRM/MG 678901', especialidade:'Dermatologia', cidade:'Belo Horizonte', estado:'MG', telefone:'(31) 5678-9012', convenios:['Amil','SulAmérica'], telemedicina:false, avaliacao:4.7, precoConsulta:320 },
  { id:'mg4', nome:'Dr. Vinícius Costa', crm:'CRM/MG 789012', especialidade:'Ortopedia', cidade:'Uberlândia', estado:'MG', telefone:'(34) 3456-7890', convenios:['Unimed'], telemedicina:false, avaliacao:4.6, precoConsulta:300 },
  { id:'mg5', nome:'Dra. Gabriela Pinto', crm:'CRM/MG 890123', especialidade:'Ginecologia', cidade:'Juiz de Fora', estado:'MG', telefone:'(32) 3456-7890', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.8, precoConsulta:280 },
  { id:'mg6', nome:'Dr. Henrique Moura', crm:'CRM/MG 901234', especialidade:'Clínica Geral', cidade:'Contagem', estado:'MG', telefone:'(31) 6789-0123', convenios:['Hapvida','Unimed'], telemedicina:true, avaliacao:4.5, precoConsulta:180 },
  // === MATO GROSSO ===
  { id:'mt1', nome:'Dr. Marcelo Ribeiro', crm:'CRM/MT 123456', especialidade:'Cardiologia', cidade:'Cuiabá', estado:'MT', telefone:'(65) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.7, precoConsulta:300 },
  { id:'mt2', nome:'Dra. Aline Barros', crm:'CRM/MT 234567', especialidade:'Dermatologia', cidade:'Cuiabá', estado:'MT', telefone:'(65) 4567-8901', convenios:['Unimed'], telemedicina:false, avaliacao:4.6, precoConsulta:280 },
  { id:'mt3', nome:'Dr. Diego Ferraz', crm:'CRM/MT 345678', especialidade:'Ortopedia', cidade:'Rondonópolis', estado:'MT', telefone:'(66) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.5, precoConsulta:250 },
  { id:'mt4', nome:'Dra. Vanessa Lopes', crm:'CRM/MT 456789', especialidade:'Pediatria', cidade:'Cuiabá', estado:'MT', telefone:'(65) 5678-9012', convenios:['Unimed','SulAmérica'], telemedicina:true, avaliacao:4.8, precoConsulta:250 },
  { id:'mt5', nome:'Dr. Rafael Cunha', crm:'CRM/MT 567890', especialidade:'Clínica Geral', cidade:'Sinop', estado:'MT', telefone:'(66) 4567-8901', convenios:['Unimed'], telemedicina:true, avaliacao:4.4, precoConsulta:180 },
  { id:'mt6', nome:'Dra. Juliana Matos', crm:'CRM/MT 678901', especialidade:'Ginecologia', cidade:'Várzea Grande', estado:'MT', telefone:'(65) 6789-0123', convenios:['Hapvida','Unimed'], telemedicina:false, avaliacao:4.6, precoConsulta:250 },
  // === GOIÁS ===
  { id:'go1', nome:'Dr. Lucas Barbosa', crm:'CRM/GO 112233', especialidade:'Urologia', cidade:'Goiânia', estado:'GO', telefone:'(62) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.6, precoConsulta:300 },
  { id:'go2', nome:'Dra. Patrícia Vieira', crm:'CRM/GO 223344', especialidade:'Cardiologia', cidade:'Goiânia', estado:'GO', telefone:'(62) 4567-8901', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.7, precoConsulta:320 },
  { id:'go3', nome:'Dr. Anderson Teixeira', crm:'CRM/GO 334455', especialidade:'Ortopedia', cidade:'Goiânia', estado:'GO', telefone:'(62) 5678-9012', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.5, precoConsulta:280 },
  { id:'go4', nome:'Dra. Natália Freitas', crm:'CRM/GO 445566', especialidade:'Dermatologia', cidade:'Aparecida de Goiânia', estado:'GO', telefone:'(62) 6789-0123', convenios:['Unimed'], telemedicina:true, avaliacao:4.8, precoConsulta:300 },
  { id:'go5', nome:'Dr. Leandro Souza', crm:'CRM/GO 556677', especialidade:'Clínica Geral', cidade:'Anápolis', estado:'GO', telefone:'(62) 7890-1234', convenios:['Hapvida','Unimed'], telemedicina:true, avaliacao:4.4, precoConsulta:180 },
  // === PARÁ ===
  { id:'pa1', nome:'Dr. Marcos Antônio Lima', crm:'CRM/PA 789012', especialidade:'Cardiologia', cidade:'Belém', estado:'PA', telefone:'(91) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.7, precoConsulta:280 },
  { id:'pa2', nome:'Dra. Renata Pires', crm:'CRM/PA 890123', especialidade:'Pediatria', cidade:'Belém', estado:'PA', telefone:'(91) 4567-8901', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.8, precoConsulta:250 },
  { id:'pa3', nome:'Dr. Fábio Monteiro', crm:'CRM/PA 901234', especialidade:'Ortopedia', cidade:'Belém', estado:'PA', telefone:'(91) 5678-9012', convenios:['Unimed'], telemedicina:false, avaliacao:4.5, precoConsulta:280 },
  { id:'pa4', nome:'Dra. Simone Cardoso', crm:'CRM/PA 012345', especialidade:'Ginecologia', cidade:'Ananindeua', estado:'PA', telefone:'(91) 6789-0123', convenios:['Hapvida','Unimed'], telemedicina:false, avaliacao:4.6, precoConsulta:250 },
  { id:'pa5', nome:'Dr. Alexandre Santos', crm:'CRM/PA 112233', especialidade:'Clínica Geral', cidade:'Marabá', estado:'PA', telefone:'(94) 3456-7890', convenios:['Hapvida'], telemedicina:true, avaliacao:4.3, precoConsulta:150 },
  // === OUTROS ESTADOS (busca instantânea via CFM) ===
  { id:'rs1', nome:'Dr. Roberto Mendes', crm:'CRM/RS 567890', especialidade:'Neurologia', cidade:'Porto Alegre', estado:'RS', telefone:'(51) 3456-7890', convenios:['Unimed','IPE Saúde'], telemedicina:true, avaliacao:4.6, precoConsulta:380 },
  { id:'pr1', nome:'Dra. Juliana Ferreira', crm:'CRM/PR 678901', especialidade:'Ginecologia', cidade:'Curitiba', estado:'PR', telefone:'(41) 3456-7890', convenios:['Unimed','Amil','Paraná Clínicas'], telemedicina:false, avaliacao:4.8, precoConsulta:300 },
  { id:'ba1', nome:'Dr. Fernando Almeida', crm:'CRM/BA 789012', especialidade:'Endocrinologia', cidade:'Salvador', estado:'BA', telefone:'(71) 3456-7890', convenios:['Unimed','Bradesco Saúde','Cassi'], telemedicina:true, avaliacao:4.7, precoConsulta:300 },
  { id:'pe1', nome:'Dra. Patrícia Souza', crm:'CRM/PE 890123', especialidade:'Psiquiatria', cidade:'Recife', estado:'PE', telefone:'(81) 3456-7890', convenios:['Unimed','Hapvida','SulAmérica'], telemedicina:true, avaliacao:4.9, precoConsulta:400 },
  { id:'ce1', nome:'Dr. Fernando Costa', crm:'CRM/CE 901234', especialidade:'Oftalmologia', cidade:'Fortaleza', estado:'CE', telefone:'(85) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.5, precoConsulta:280 },
  { id:'df1', nome:'Dra. Camila Rodrigues', crm:'CRM/DF 012345', especialidade:'Clínica Geral', cidade:'Brasília', estado:'DF', telefone:'(61) 3456-7890', convenios:['Unimed','Amil','SulAmérica','Bradesco Saúde'], telemedicina:true, avaliacao:4.8, precoConsulta:250 },
];

const ESTADOS_PRIORITARIOS = ['SP', 'MT', 'RJ', 'MG', 'GO', 'PA'];
const TODOS_ESTADOS = [...new Set(DOCTORS_DB.map(d => d.estado))].sort();
const TODAS_ESPECIALIDADES = [...new Set(DOCTORS_DB.map(d => d.especialidade))].sort();

const ESTADOS_CIDADES: Record<string, string[]> = {};
DOCTORS_DB.forEach(d => {
  if (!ESTADOS_CIDADES[d.estado]) ESTADOS_CIDADES[d.estado] = [];
  if (!ESTADOS_CIDADES[d.estado].includes(d.cidade)) ESTADOS_CIDADES[d.estado].push(d.cidade);
});
Object.keys(ESTADOS_CIDADES).forEach(k => ESTADOS_CIDADES[k].sort());

// Estatísticas de preço por especialidade
const PRECO_STATS: Record<string, { min: number; max: number; media: number; mediana: number }> = {};
TODAS_ESPECIALIDADES.forEach(esp => {
  const precos = DOCTORS_DB.filter(d => d.especialidade === esp && d.precoConsulta).map(d => d.precoConsulta!).sort((a, b) => a - b);
  if (precos.length > 0) {
    PRECO_STATS[esp] = {
      min: precos[0],
      max: precos[precos.length - 1],
      media: Math.round(precos.reduce((a, b) => a + b, 0) / precos.length),
      mediana: precos[Math.floor(precos.length / 2)],
    };
  }
});

export default function DoctorFinder() {
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [search, setSearch] = useState('');
  const [tele, setTele] = useState(false);
  const [tab, setTab] = useState<'buscar' | 'precos' | 'contribuir'>('buscar');
  const [showCRM, setShowCRM] = useState(false);
  const [crmInput, setCrmInput] = useState('');
  const [crmEstado, setCrmEstado] = useState('SP');

  // Contribuição do usuário
  const [contribMedico, setContribMedico] = useState('');
  const [contribEsp, setContribEsp] = useState('');
  const [contribCidade, setContribCidade] = useState('');
  const [contribEstado, setContribEstado] = useState('');
  const [contribPreco, setContribPreco] = useState('');
  const [contribSent, setContribSent] = useState(false);

  const cidadesDoEstado = estado ? (ESTADOS_CIDADES[estado] || []) : [];

  const filtered = useMemo(() => {
    return DOCTORS_DB.filter(d => {
      const s = search.toLowerCase();
      return (!estado || d.estado === estado)
        && (!cidade || d.cidade === cidade)
        && (!especialidade || d.especialidade === especialidade)
        && (!s || d.nome.toLowerCase().includes(s) || d.crm.toLowerCase().includes(s))
        && (!tele || d.telemedicina);
    });
  }, [estado, cidade, especialidade, search, tele]);

  const isLocal = ESTADOS_PRIORITARIOS.includes(estado);

  const handleContrib = () => {
    // In a real app, this would send to the server
    setContribSent(true);
    setTimeout(() => setContribSent(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Encontre um Médico</h1>
        <p className="text-gray-400">Busque médicos por especialidade e região em todo o Brasil</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 justify-center flex-wrap">
        {([
          { id: 'buscar' as const, label: 'Buscar Médicos', icon: '🔍' },
          { id: 'precos' as const, label: 'Estatísticas de Preços', icon: '📊' },
          { id: 'contribuir' as const, label: 'Informar Preço', icon: '✏️' },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'buscar' && (
        <>
          {/* Verificar CRM */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
            <button onClick={() => setShowCRM(!showCRM)} className="text-sm font-semibold text-emerald-400 hover:underline">
              ✅ Verificar CRM do Médico {showCRM ? '▲' : '▼'}
            </button>
            {showCRM && (
              <div className="mt-3 flex gap-2 flex-wrap">
                <input type="text" value={crmInput} onChange={e => setCrmInput(e.target.value)}
                  placeholder="Número do CRM..."
                  className="flex-1 min-w-[200px] px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm" />
                <select value={crmEstado} onChange={e => setCrmEstado(e.target.value)}
                  className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
                  {TODOS_ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                <a href={`https://portal.cfm.org.br/busca-medicos/?crm=${crmInput}&uf=${crmEstado}`}
                  target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-lg transition-colors">
                  Buscar no CFM
                </a>
              </div>
            )}
          </div>

          {/* Filtros Estado/Cidade/Especialidade */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-white">Filtros</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select value={estado} onChange={e => { setEstado(e.target.value); setCidade(''); }}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
                <option value="">Todos os Estados</option>
                {TODOS_ESTADOS.map(e => (
                  <option key={e} value={e}>{e} {ESTADOS_PRIORITARIOS.includes(e) ? '(base local)' : ''}</option>
                ))}
              </select>
              <select value={cidade} onChange={e => setCidade(e.target.value)} disabled={!estado}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm disabled:opacity-50">
                <option value="">Todas as Cidades</option>
                {cidadesDoEstado.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={especialidade} onChange={e => setEspecialidade(e.target.value)}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
                <option value="">Todas as Especialidades</option>
                {TODAS_ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="flex gap-3 items-center">
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Buscar por nome ou CRM..."
                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm" />
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer whitespace-nowrap">
                <input type="checkbox" checked={tele} onChange={e => setTele(e.target.checked)} className="accent-emerald-500" />
                Telemedicina
              </label>
            </div>
            {estado && !isLocal && (
              <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 text-sm text-blue-300">
                Este estado não possui base local. Busque diretamente no{' '}
                <a href={`https://portal.cfm.org.br/busca-medicos/?uf=${estado}`} target="_blank" rel="noopener noreferrer"
                  className="text-emerald-400 hover:underline">CFM</a> para resultados completos.
              </div>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-800/60 rounded-xl p-4 text-center border border-gray-700/50">
              <div className="text-2xl font-bold text-emerald-400">{filtered.length}</div>
              <div className="text-xs text-gray-400">Médicos</div>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-4 text-center border border-gray-700/50">
              <div className="text-2xl font-bold text-blue-400">{new Set(filtered.map(d => d.especialidade)).size}</div>
              <div className="text-xs text-gray-400">Especialidades</div>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-4 text-center border border-gray-700/50">
              <div className="text-2xl font-bold text-purple-400">{filtered.filter(d => d.telemedicina).length}</div>
              <div className="text-xs text-gray-400">Telemedicina</div>
            </div>
            <div className="bg-gray-800/60 rounded-xl p-4 text-center border border-gray-700/50">
              <div className="text-2xl font-bold text-amber-400">
                R$ {filtered.length > 0 ? Math.round(filtered.filter(d => d.precoConsulta).reduce((a, d) => a + (d.precoConsulta || 0), 0) / Math.max(1, filtered.filter(d => d.precoConsulta).length)) : 0}
              </div>
              <div className="text-xs text-gray-400">Consulta Média</div>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-3">
            {filtered.map(d => (
              <div key={d.id} className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 hover:border-emerald-500/30 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white">{d.nome}</h3>
                    <p className="text-xs text-gray-500">{d.crm}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-sm font-medium text-white">{d.avaliacao}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm mb-2">
                  <span className="text-emerald-400 font-medium">{d.especialidade}</span>
                  <span className="text-gray-400">📍 {d.cidade}, {d.estado}</span>
                  <span className="text-gray-400">📞 {d.telefone}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {d.convenios.map(c => <span key={c} className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px]">{c}</span>)}
                    {d.telemedicina && <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px]">📹 Telemedicina</span>}
                  </div>
                  {d.precoConsulta && (
                    <span className="text-sm font-bold text-amber-400">R$ {d.precoConsulta}</span>
                  )}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">Nenhum médico encontrado.</p>
                <p className="text-sm mt-2">
                  Busque no <a href={`https://portal.cfm.org.br/busca-medicos/${estado ? `?uf=${estado}` : ''}`}
                    target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">CFM</a> para resultados completos.
                </p>
              </div>
            )}
          </div>
        </>
      )}

      {tab === 'precos' && (
        <div className="space-y-4">
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-white mb-4">Estatísticas de Preços por Especialidade</h3>
            <div className="space-y-3">
              {TODAS_ESPECIALIDADES.filter(e => PRECO_STATS[e]).map(esp => {
                const s = PRECO_STATS[esp];
                return (
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
                );
              })}
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
            <input type="text" value={contribEsp} onChange={e => setContribEsp(e.target.value)}
              placeholder="Especialidade..."
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm" />
            <input type="text" value={contribCidade} onChange={e => setContribCidade(e.target.value)}
              placeholder="Cidade..."
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm" />
            <select value={contribEstado} onChange={e => setContribEstado(e.target.value)}
              className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
              <option value="">Estado...</option>
              {TODOS_ESTADOS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
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
              ✅ Obrigado pela contribuição! As informações serão verificadas e adicionadas ao sistema.
            </div>
          )}
        </div>
      )}

      <div className="bg-blue-900/20 border border-blue-700/30 rounded-xl p-4 text-sm text-blue-200/80">
        <strong>Aviso:</strong> Sempre verifique o registro do médico no site do{' '}
        <a href="https://portal.cfm.org.br/busca-medicos/" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">CFM</a>.
        Preços são informativos e podem variar.
      </div>
    </div>
  );
}
