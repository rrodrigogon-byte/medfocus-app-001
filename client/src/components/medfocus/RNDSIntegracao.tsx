/**
 * MedFocus — RNDS Integração (Rede Nacional de Dados em Saúde)
 * Sprint 44: Integração com a RNDS do Ministério da Saúde para troca de informações em saúde (FHIR R4)
 */
import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface RegistroRNDS {
  id: string;
  tipo: 'Imunização' | 'Resultado de Exame' | 'Atendimento' | 'Medicamento' | 'Alergia' | 'Condição';
  descricao: string;
  data: string;
  profissional: string;
  cnes: string;
  status: 'Enviado' | 'Pendente' | 'Erro' | 'Validado';
  recursoFHIR: string;
}

const registrosDemo: RegistroRNDS[] = [
  { id: 'R001', tipo: 'Imunização', descricao: 'COVID-19 Pfizer/BioNTech - 3ª dose (Reforço)', data: '2025-11-15', profissional: 'Dr. Ana Silva - CRM 12345/SP', cnes: '2345678', status: 'Enviado', recursoFHIR: 'Immunization' },
  { id: 'R002', tipo: 'Resultado de Exame', descricao: 'RT-PCR SARS-CoV-2 - Não Detectado', data: '2025-12-01', profissional: 'Lab. Central - CNES 3456789', cnes: '3456789', status: 'Validado', recursoFHIR: 'Observation' },
  { id: 'R003', tipo: 'Atendimento', descricao: 'Consulta Clínica Geral - CID J06.9 (IVAS)', data: '2026-01-10', profissional: 'Dr. Carlos Mendes - CRM 54321/RJ', cnes: '4567890', status: 'Enviado', recursoFHIR: 'Encounter' },
  { id: 'R004', tipo: 'Medicamento', descricao: 'Losartana 50mg - Uso contínuo', data: '2026-01-10', profissional: 'Dr. Carlos Mendes - CRM 54321/RJ', cnes: '4567890', status: 'Pendente', recursoFHIR: 'MedicationRequest' },
  { id: 'R005', tipo: 'Alergia', descricao: 'Alergia a Penicilina - Reação anafilática', data: '2026-02-05', profissional: 'Dra. Maria Oliveira - CRM 67890/MG', cnes: '5678901', status: 'Validado', recursoFHIR: 'AllergyIntolerance' },
  { id: 'R006', tipo: 'Condição', descricao: 'Hipertensão Arterial Sistêmica - I10 (Ativa)', data: '2026-02-05', profissional: 'Dra. Maria Oliveira - CRM 67890/MG', cnes: '5678901', status: 'Enviado', recursoFHIR: 'Condition' },
];

const recursosFHIR = [
  { recurso: 'Patient', descricao: 'Dados demográficos do paciente', campos: ['CPF', 'CNS', 'Nome', 'Data de Nascimento', 'Sexo', 'Endereço', 'Telefone'] },
  { recurso: 'Immunization', descricao: 'Registro de imunizações', campos: ['Vacina (CVX)', 'Dose', 'Lote', 'Fabricante', 'Data', 'Via de administração', 'Local'] },
  { recurso: 'Observation', descricao: 'Resultados de exames laboratoriais', campos: ['Código LOINC', 'Valor', 'Unidade', 'Referência', 'Status', 'Data da coleta'] },
  { recurso: 'Encounter', descricao: 'Registro de atendimentos clínicos', campos: ['Tipo', 'CID-10', 'CNES', 'Profissional', 'Data início/fim', 'Desfecho'] },
  { recurso: 'MedicationRequest', descricao: 'Prescrições de medicamentos', campos: ['Medicamento (CATMAT)', 'Dose', 'Frequência', 'Via', 'Duração', 'Prescritor'] },
  { recurso: 'AllergyIntolerance', descricao: 'Alergias e intolerâncias', campos: ['Substância', 'Tipo de reação', 'Gravidade', 'Manifestação', 'Data de início'] },
  { recurso: 'Condition', descricao: 'Condições/diagnósticos do paciente', campos: ['CID-10', 'Status clínico', 'Gravidade', 'Data de início', 'Evidência'] },
  { recurso: 'Procedure', descricao: 'Procedimentos realizados', campos: ['Código SIGTAP', 'Descrição', 'Data', 'Local anatômico', 'Desfecho'] },
];

const RNDSIntegracao: React.FC = () => {
  const [tab, setTab] = useState<'painel' | 'registros' | 'fhir' | 'config'>('painel');
  const [cnsPaciente, setCnsPaciente] = useState('');
  const [buscando, setBuscando] = useState(false);
  const [resultadoBusca, setResultadoBusca] = useState<RegistroRNDS[] | null>(null);
  const [filtroTipo, setFiltroTipo] = useState('Todos');
  const [selectedFHIR, setSelectedFHIR] = useState<typeof recursosFHIR[0] | null>(null);

  const buscarPaciente = () => {
    if (!cnsPaciente.trim()) return;
    setBuscando(true);
    setTimeout(() => {
      setResultadoBusca(registrosDemo);
      setBuscando(false);
    }, 1500);
  };

  const registrosFiltrados = (resultadoBusca || registrosDemo).filter(r => filtroTipo === 'Todos' || r.tipo === filtroTipo);

  const statusColor = (s: string) => {
    switch (s) {
      case 'Enviado': return 'bg-blue-500/20 text-blue-400';
      case 'Validado': return 'bg-emerald-500/20 text-emerald-400';
      case 'Pendente': return 'bg-yellow-500/20 text-yellow-400';
      case 'Erro': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const tabs = [
    { id: 'painel' as const, label: 'Painel RNDS', icon: '🏛️' },
    { id: 'registros' as const, label: 'Registros', icon: '📋' },
    { id: 'fhir' as const, label: 'Recursos FHIR', icon: '🔗' },
    { id: 'config' as const, label: 'Configuração', icon: '⚙️' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <EducationalDisclaimer moduleName="RNDS - Rede Nacional de Dados em Saúde" />

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🏛️ RNDS — Rede Nacional de Dados em Saúde</h1>
        <p className="text-gray-400">Integração com o Ministério da Saúde via padrão HL7 FHIR R4</p>
      </div>

      <div className="flex gap-2 border-b border-gray-700 pb-2 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-white'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'painel' && (
        <div className="space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">247</div>
              <div className="text-gray-500 text-sm">Registros Enviados</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">198</div>
              <div className="text-gray-500 text-sm">Validados</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">12</div>
              <div className="text-gray-500 text-sm">Pendentes</div>
            </div>
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-red-400">3</div>
              <div className="text-gray-500 text-sm">Erros</div>
            </div>
          </div>

          {/* Busca por CNS */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">🔍 Consultar Sumário do Paciente (RNDS)</h3>
            <div className="flex gap-3">
              <input type="text" value={cnsPaciente} onChange={e => setCnsPaciente(e.target.value)} placeholder="CNS ou CPF do paciente..." className="flex-1 bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
              <button onClick={buscarPaciente} disabled={buscando} className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50">
                {buscando ? 'Consultando...' : '🔍 Consultar'}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-2">Consulta o Sumário de Saúde do Paciente na RNDS via API FHIR R4</p>
          </div>

          {/* Fluxo de Dados */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">📊 Fluxo de Dados RNDS</h3>
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
              {['Estabelecimento (CNES)', '→', 'Certificado Digital (ICP-Brasil)', '→', 'API Gateway (RNDS)', '→', 'Barramento FHIR R4', '→', 'DATASUS'].map((item, i) => (
                <span key={i} className={item === '→' ? 'text-emerald-400 text-xl' : 'bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-300 whitespace-nowrap'}>{item}</span>
              ))}
            </div>
          </div>

          {/* Tipos de Registro */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">📋 Tipos de Registro Suportados</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { tipo: 'Imunização', desc: 'Registro Nacional de Vacinação', icon: '💉' },
                { tipo: 'Exames COVID', desc: 'RT-PCR e Teste Rápido', icon: '🧪' },
                { tipo: 'Atendimento Clínico', desc: 'Registro de Atendimento Clínico (RAC)', icon: '🏥' },
                { tipo: 'Medicamentos', desc: 'Dispensação e prescrição', icon: '💊' },
                { tipo: 'Sumário de Alta', desc: 'Resumo de internação hospitalar', icon: '📄' },
                { tipo: 'Exames Laboratoriais', desc: 'Resultados LOINC padronizados', icon: '🔬' },
              ].map(item => (
                <div key={item.tipo} className="bg-gray-900/50 border border-gray-600 rounded-lg p-3">
                  <div className="text-lg mb-1">{item.icon}</div>
                  <div className="text-white text-sm font-medium">{item.tipo}</div>
                  <div className="text-gray-500 text-xs">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'registros' && (
        <div className="space-y-4">
          <div className="flex gap-3 items-center">
            <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2">
              <option>Todos</option>
              <option>Imunização</option>
              <option>Resultado de Exame</option>
              <option>Atendimento</option>
              <option>Medicamento</option>
              <option>Alergia</option>
              <option>Condição</option>
            </select>
            <span className="text-gray-500 text-sm">{registrosFiltrados.length} registro(s)</span>
          </div>

          <div className="space-y-3">
            {registrosFiltrados.map(reg => (
              <div key={reg.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded">{reg.tipo}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${statusColor(reg.status)}`}>{reg.status}</span>
                    </div>
                    <h4 className="text-white font-medium">{reg.descricao}</h4>
                    <div className="text-gray-500 text-sm mt-1">{reg.profissional}</div>
                    <div className="text-gray-600 text-xs mt-1">CNES: {reg.cnes} | Recurso FHIR: {reg.recursoFHIR}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-400 text-sm">{new Date(reg.data).toLocaleDateString('pt-BR')}</div>
                    <div className="text-gray-600 text-xs mt-1">ID: {reg.id}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'fhir' && (
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <p className="text-blue-300 text-sm">A RNDS utiliza o padrão <strong>HL7 FHIR R4</strong> (Fast Healthcare Interoperability Resources) para troca de informações em saúde. Abaixo estão os recursos suportados e seus campos.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recursosFHIR.map(r => (
              <div key={r.recurso} className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-emerald-500/50 cursor-pointer transition-all" onClick={() => setSelectedFHIR(selectedFHIR?.recurso === r.recurso ? null : r)}>
                <h4 className="text-emerald-400 font-semibold mb-1">{r.recurso}</h4>
                <p className="text-gray-400 text-sm mb-2">{r.descricao}</p>
                {selectedFHIR?.recurso === r.recurso && (
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <p className="text-gray-500 text-xs mb-2">Campos obrigatórios:</p>
                    <div className="flex flex-wrap gap-1">
                      {r.campos.map(c => <span key={c} className="text-xs bg-gray-900 text-gray-300 px-2 py-0.5 rounded">{c}</span>)}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2">📚 Documentação Oficial</h4>
            <div className="space-y-2 text-sm">
              <div className="text-gray-400">• <strong className="text-emerald-400">RNDS:</strong> rnds.saude.gov.br — Portal oficial do Ministério da Saúde</div>
              <div className="text-gray-400">• <strong className="text-emerald-400">HL7 FHIR:</strong> hl7.org/fhir — Especificação internacional</div>
              <div className="text-gray-400">• <strong className="text-emerald-400">Perfis BR:</strong> simplifier.net/redenacionaldedadosemsaude — Perfis FHIR brasileiros</div>
              <div className="text-gray-400">• <strong className="text-emerald-400">Portaria:</strong> Portaria GM/MS nº 1.434/2020 — Base legal da RNDS</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'config' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">⚙️ Configuração da Integração RNDS</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-1">CNES do Estabelecimento</label>
                <input type="text" placeholder="0000000" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Certificado Digital ICP-Brasil (.pfx)</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                  <p className="text-gray-500 text-sm">Arraste o certificado digital ou clique para selecionar</p>
                  <p className="text-gray-600 text-xs mt-1">Formato: .pfx ou .p12 (ICP-Brasil e-CNPJ ou e-CPF)</p>
                </div>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Ambiente</label>
                <select className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2">
                  <option>Homologação (ehr-auth-hmg.saude.gov.br)</option>
                  <option>Produção (ehr-auth.saude.gov.br)</option>
                </select>
              </div>
              <div>
                <label className="text-gray-400 text-sm block mb-1">Client ID (Solicitante)</label>
                <input type="text" placeholder="ID fornecido pelo DATASUS" className="w-full bg-gray-900 text-white border border-gray-600 rounded-lg px-4 py-2" />
              </div>
              <button className="w-full py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">🔗 Testar Conexão</button>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <h4 className="text-yellow-400 font-semibold mb-2">📋 Pré-requisitos para Integração</h4>
            <ol className="text-gray-400 text-sm space-y-1 list-decimal list-inside">
              <li>Cadastro do estabelecimento no CNES ativo</li>
              <li>Certificado digital ICP-Brasil (e-CNPJ ou e-CPF do responsável)</li>
              <li>Solicitação de acesso no Portal de Serviços do DATASUS</li>
              <li>Homologação dos recursos FHIR no ambiente de testes</li>
              <li>Aprovação pelo DATASUS para ambiente de produção</li>
            </ol>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-600 text-center">
        Ref: Portaria GM/MS nº 1.434/2020 | HL7 FHIR R4 | RNDS - Ministério da Saúde
      </div>
    </div>
  );
};

export default RNDSIntegracao;
