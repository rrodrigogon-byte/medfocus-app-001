/**
 * MedFocus — Marketplace de Serviços Médicos
 * Sprint 50: Plataforma de conexão entre profissionais de saúde, serviços e fornecedores
 */
import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface Servico {
  id: string;
  nome: string;
  categoria: string;
  fornecedor: string;
  descricao: string;
  preco: string;
  avaliacao: number;
  avaliacoes: number;
  destaque: boolean;
  tags: string[];
}

const servicos: Servico[] = [
  { id: 'SRV-001', nome: 'Laudo de Radiologia à Distância (Telerradiologia)', categoria: 'Diagnóstico', fornecedor: 'TeleRad Brasil', descricao: 'Laudos de RX, TC e RM por radiologistas especialistas em até 2h', preco: 'A partir de R$ 35/laudo', avaliacao: 4.8, avaliacoes: 342, destaque: true, tags: ['Telerradiologia', 'Laudo', 'Urgente'] },
  { id: 'SRV-002', nome: 'Assessoria Jurídica Médica Especializada', categoria: 'Jurídico', fornecedor: 'MedLaw Advocacia', descricao: 'Consultoria em direito médico, defesa em processos éticos e judiciais', preco: 'A partir de R$ 500/consulta', avaliacao: 4.9, avaliacoes: 128, destaque: true, tags: ['Direito Médico', 'CRM', 'Defesa'] },
  { id: 'SRV-003', nome: 'Contabilidade para Médicos (PJ e PF)', categoria: 'Financeiro', fornecedor: 'ContaMed', descricao: 'Contabilidade especializada, abertura de CNPJ, IRPF médico', preco: 'A partir de R$ 299/mês', avaliacao: 4.7, avaliacoes: 215, destaque: false, tags: ['Contabilidade', 'CNPJ', 'Impostos'] },
  { id: 'SRV-004', nome: 'Locação de Consultório por Turno', categoria: 'Infraestrutura', fornecedor: 'MedSpace', descricao: 'Consultórios equipados para locação por turno em diversas cidades', preco: 'A partir de R$ 150/turno', avaliacao: 4.5, avaliacoes: 89, destaque: false, tags: ['Consultório', 'Locação', 'Coworking'] },
  { id: 'SRV-005', nome: 'Marketing Médico Digital (CFM Compliant)', categoria: 'Marketing', fornecedor: 'MedMarketing Pro', descricao: 'Gestão de redes sociais, site, Google Ads conforme Res. CFM 2.336/2023', preco: 'A partir de R$ 1.500/mês', avaliacao: 4.6, avaliacoes: 176, destaque: true, tags: ['Marketing', 'CFM', 'Redes Sociais'] },
  { id: 'SRV-006', nome: 'Equipamentos Médicos — Venda e Locação', categoria: 'Equipamentos', fornecedor: 'MedEquip Brasil', descricao: 'Ultrassom, dermatoscópio, eletrocardiógrafo e mais com garantia', preco: 'Sob consulta', avaliacao: 4.4, avaliacoes: 67, destaque: false, tags: ['Equipamentos', 'Ultrassom', 'ECG'] },
  { id: 'SRV-007', nome: 'Tradução e Revisão de Artigos Científicos', categoria: 'Acadêmico', fornecedor: 'SciTranslate', descricao: 'Tradução EN-PT/PT-EN, revisão por pares, formatação para periódicos', preco: 'A partir de R$ 0,12/palavra', avaliacao: 4.8, avaliacoes: 203, destaque: false, tags: ['Artigo', 'Tradução', 'Publicação'] },
  { id: 'SRV-008', nome: 'Seguro de Responsabilidade Civil Profissional', categoria: 'Seguros', fornecedor: 'MedProtect Seguros', descricao: 'Cobertura para erros médicos, processos e danos morais', preco: 'A partir de R$ 89/mês', avaliacao: 4.7, avaliacoes: 312, destaque: true, tags: ['Seguro', 'RC Profissional', 'Proteção'] },
  { id: 'SRV-009', nome: 'Mentoria para Abertura de Clínica', categoria: 'Gestão', fornecedor: 'ClinicaPro Consultoria', descricao: 'Planejamento, licenças ANVISA, projeto arquitetônico e gestão', preco: 'A partir de R$ 3.000', avaliacao: 4.9, avaliacoes: 54, destaque: false, tags: ['Clínica', 'ANVISA', 'Gestão'] },
  { id: 'SRV-010', nome: 'Recrutamento de Profissionais de Saúde', categoria: 'RH', fornecedor: 'MedTalent', descricao: 'Recrutamento especializado de médicos, enfermeiros e equipe', preco: 'Sob consulta', avaliacao: 4.5, avaliacoes: 91, destaque: false, tags: ['Recrutamento', 'Vagas', 'Equipe'] },
];

const categorias = ['Todas', ...new Set(servicos.map(s => s.categoria))];

const MarketplaceMedico: React.FC = () => {
  const [tab, setTab] = useState<'servicos' | 'plantoes' | 'parcerias' | 'avaliacoes'>('servicos');
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [busca, setBusca] = useState('');

  const tabs = [
    { id: 'servicos' as const, label: 'Serviços', icon: '🏪' },
    { id: 'plantoes' as const, label: 'Plantões', icon: '🏥' },
    { id: 'parcerias' as const, label: 'Parcerias', icon: '🤝' },
    { id: 'avaliacoes' as const, label: 'Avaliações', icon: '⭐' },
  ];

  const servicosFiltrados = servicos.filter(s => {
    const matchCategoria = filtroCategoria === 'Todas' || s.categoria === filtroCategoria;
    const matchBusca = !busca || s.nome.toLowerCase().includes(busca.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(busca.toLowerCase()));
    return matchCategoria && matchBusca;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <EducationalDisclaimer moduleName="Marketplace Médico" />

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🏪 Marketplace Médico</h1>
        <p className="text-gray-400">Serviços, plantões, parcerias e fornecedores para profissionais de saúde</p>
      </div>

      <div className="flex gap-2 border-b border-gray-700 pb-2 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-white'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'servicos' && (
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <input type="text" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar serviços..." className="flex-1 bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {categorias.map(c => (
              <button key={c} onClick={() => setFiltroCategoria(c)} className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap ${filtroCategoria === c ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>{c}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {servicosFiltrados.map(srv => (
              <div key={srv.id} className={`bg-gray-800/50 border rounded-xl p-5 hover:border-emerald-500/50 transition-all ${srv.destaque ? 'border-emerald-500/30' : 'border-gray-700'}`}>
                {srv.destaque && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded mb-2 inline-block">Destaque</span>}
                <h3 className="text-white font-semibold mb-1">{srv.nome}</h3>
                <p className="text-gray-500 text-sm mb-2">{srv.descricao}</p>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">{srv.categoria}</span>
                  <span className="text-gray-500 text-xs">{srv.fornecedor}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400 font-bold text-sm">{srv.preco}</span>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-sm">{'★'.repeat(Math.floor(srv.avaliacao))}</span>
                    <span className="text-gray-400 text-xs">{srv.avaliacao} ({srv.avaliacoes})</span>
                  </div>
                </div>
                <div className="flex gap-1 mt-2">
                  {srv.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
                <button className="w-full mt-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Solicitar Orçamento</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'plantoes' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">🏥 Bolsa de Plantões</h3>
            <div className="space-y-3">
              {[
                { hospital: 'Hospital Municipal de São Paulo', especialidade: 'Clínica Médica', turno: 'Noturno (19h-07h)', valor: 'R$ 1.800', data: '05/03/2026', urgente: true },
                { hospital: 'UPA 24h Guarulhos', especialidade: 'Emergência', turno: 'Diurno (07h-19h)', valor: 'R$ 1.500', data: '06/03/2026', urgente: true },
                { hospital: 'Hospital Regional de Campinas', especialidade: 'Pediatria', turno: 'Noturno (19h-07h)', valor: 'R$ 2.000', data: '07/03/2026', urgente: false },
                { hospital: 'Santa Casa de Santos', especialidade: 'Ortopedia', turno: 'Final de Semana (12h)', valor: 'R$ 2.200', data: '08/03/2026', urgente: false },
                { hospital: 'Hospital Estadual de Ribeirão Preto', especialidade: 'Anestesiologia', turno: 'Diurno (07h-19h)', valor: 'R$ 2.500', data: '09/03/2026', urgente: false },
                { hospital: 'UBS Vila Mariana - SP', especialidade: 'Medicina de Família', turno: 'Comercial (08h-17h)', valor: 'R$ 1.200', data: '10/03/2026', urgente: false },
              ].map((plantao, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition-all">
                  <div className="flex-1">
                    <div className="flex gap-2 mb-1">
                      {plantao.urgente && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Urgente</span>}
                      <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">{plantao.especialidade}</span>
                    </div>
                    <h4 className="text-white font-medium">{plantao.hospital}</h4>
                    <p className="text-gray-500 text-sm">{plantao.turno} — {plantao.data}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 font-bold">{plantao.valor}</div>
                    <button className="mt-1 px-3 py-1 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700">Candidatar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'parcerias' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">🤝 Programa de Parcerias MedFocus</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { tipo: 'Laboratórios', desc: 'Parceria com laboratórios de análises clínicas para resultados integrados', beneficio: 'Resultados diretos no PEP', parceiros: 12 },
                { tipo: 'Farmácias', desc: 'Integração com redes de farmácias para prescrição digital', beneficio: 'Envio eletrônico de receitas', parceiros: 8 },
                { tipo: 'Centros de Imagem', desc: 'Conexão com centros de diagnóstico por imagem', beneficio: 'Laudos e imagens no prontuário', parceiros: 6 },
                { tipo: 'Operadoras de Saúde', desc: 'Integração TISS com operadoras de planos de saúde', beneficio: 'Faturamento automático', parceiros: 15 },
                { tipo: 'Universidades', desc: 'Convênios acadêmicos para pesquisa e ensino', beneficio: 'Acesso a conteúdo premium', parceiros: 4 },
                { tipo: 'Fornecedores OPME', desc: 'Catálogo de materiais e próteses com rastreabilidade', beneficio: 'Cotação integrada', parceiros: 9 },
              ].map(p => (
                <div key={p.tipo} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <h4 className="text-white font-medium mb-1">{p.tipo}</h4>
                  <p className="text-gray-500 text-sm mb-2">{p.desc}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-400 text-xs">{p.beneficio}</span>
                    <span className="text-gray-400 text-xs">{p.parceiros} parceiros</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'avaliacoes' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">⭐ Avaliações Recentes</h3>
            <div className="space-y-3">
              {[
                { servico: 'TeleRad Brasil', avaliador: 'Dr. Carlos M.', nota: 5, comentario: 'Laudos rápidos e precisos. Excelente qualidade.', data: '28/02/2026' },
                { servico: 'MedLaw Advocacia', avaliador: 'Dra. Fernanda S.', nota: 5, comentario: 'Resolveram meu processo ético com maestria. Recomendo.', data: '25/02/2026' },
                { servico: 'ContaMed', avaliador: 'Dr. Roberto L.', nota: 4, comentario: 'Boa contabilidade, mas poderiam melhorar o app.', data: '22/02/2026' },
                { servico: 'MedProtect Seguros', avaliador: 'Dra. Ana P.', nota: 5, comentario: 'Seguro com ótimo custo-benefício. Atendimento rápido.', data: '20/02/2026' },
                { servico: 'MedSpace', avaliador: 'Dr. Marcos T.', nota: 4, comentario: 'Consultórios bem localizados e equipados. Preço justo.', data: '18/02/2026' },
              ].map((av, i) => (
                <div key={i} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-emerald-400 font-medium text-sm">{av.servico}</span>
                      <span className="text-gray-500 text-xs ml-2">por {av.avaliador}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400 text-sm">{'★'.repeat(av.nota)}</span>
                      <span className="text-gray-500 text-xs">{av.data}</span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">{av.comentario}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <p className="text-yellow-400 text-sm">⚠️ O MedFocus atua como intermediário. Verifique sempre as credenciais dos fornecedores. Serviços médicos devem respeitar o Código de Ética Médica (CFM) e legislação vigente.</p>
      </div>

      <div className="text-xs text-gray-600 text-center">
        Marketplace MedFocus — Conectando profissionais de saúde a serviços de qualidade
      </div>
    </div>
  );
};

export default MarketplaceMedico;
