/**
 * MedFocus — Relatórios TISS XML (Sprint 39)
 * Exportação de guias TISS no padrão ANS 4.01.00
 * Geração de lotes, validação XML, envio para operadoras
 */
import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface GuiaTISS {
  id: string;
  numero: string;
  tipo: 'consulta' | 'sadt' | 'internacao' | 'honorarios' | 'odonto';
  paciente: string;
  operadora: string;
  dataExecucao: string;
  valorTotal: number;
  status: 'pendente' | 'validado' | 'enviado' | 'pago' | 'glosado';
  procedimentos: { codigo: string; descricao: string; valor: number }[];
}

interface LoteTISS {
  id: string;
  numero: string;
  operadora: string;
  dataGeracao: string;
  quantidadeGuias: number;
  valorTotal: number;
  status: 'gerado' | 'validado' | 'enviado' | 'processado' | 'erro';
  xmlGerado: boolean;
}

const DEMO_GUIAS: GuiaTISS[] = [
  { id: '1', numero: 'G2026030001', tipo: 'consulta', paciente: 'Maria Silva Santos', operadora: 'Unimed', dataExecucao: '01/03/2026', valorTotal: 180.00, status: 'validado', procedimentos: [{ codigo: '10101012', descricao: 'Consulta em consultório', valor: 180.00 }] },
  { id: '2', numero: 'G2026030002', tipo: 'sadt', paciente: 'João Pedro Oliveira', operadora: 'Bradesco Saúde', dataExecucao: '01/03/2026', valorTotal: 450.00, status: 'pendente', procedimentos: [{ codigo: '40301010', descricao: 'Hemograma completo', valor: 25.00 }, { codigo: '40302040', descricao: 'Glicemia de jejum', valor: 15.00 }, { codigo: '41001010', descricao: 'Raio-X de tórax PA', valor: 120.00 }, { codigo: '40301150', descricao: 'TSH', valor: 45.00 }, { codigo: '40301184', descricao: 'T4 livre', valor: 45.00 }, { codigo: '40302199', descricao: 'Perfil lipídico', valor: 200.00 }] },
  { id: '3', numero: 'G2026030003', tipo: 'consulta', paciente: 'Ana Beatriz Costa', operadora: 'SulAmérica', dataExecucao: '28/02/2026', valorTotal: 200.00, status: 'enviado', procedimentos: [{ codigo: '10101012', descricao: 'Consulta em consultório', valor: 200.00 }] },
  { id: '4', numero: 'G2026030004', tipo: 'sadt', paciente: 'Carlos Eduardo Lima', operadora: 'Amil', dataExecucao: '27/02/2026', valorTotal: 850.00, status: 'pago', procedimentos: [{ codigo: '41001125', descricao: 'TC de crânio', valor: 450.00 }, { codigo: '41001290', descricao: 'RM de coluna lombar', valor: 400.00 }] },
  { id: '5', numero: 'G2026030005', tipo: 'internacao', paciente: 'Roberto Almeida Neto', operadora: 'Unimed', dataExecucao: '25/02/2026', valorTotal: 12500.00, status: 'glosado', procedimentos: [{ codigo: '31003079', descricao: 'Apendicectomia', valor: 3500.00 }, { codigo: '80001010', descricao: 'Diárias de enfermaria', valor: 4500.00 }, { codigo: '90001010', descricao: 'Materiais e medicamentos', valor: 4500.00 }] },
];

const DEMO_LOTES: LoteTISS[] = [
  { id: '1', numero: 'L2026030001', operadora: 'Unimed', dataGeracao: '01/03/2026', quantidadeGuias: 45, valorTotal: 28500.00, status: 'gerado', xmlGerado: true },
  { id: '2', numero: 'L2026020015', operadora: 'Bradesco Saúde', dataGeracao: '28/02/2026', quantidadeGuias: 32, valorTotal: 18900.00, status: 'enviado', xmlGerado: true },
  { id: '3', numero: 'L2026020014', operadora: 'SulAmérica', dataGeracao: '25/02/2026', quantidadeGuias: 28, valorTotal: 15200.00, status: 'processado', xmlGerado: true },
  { id: '4', numero: 'L2026020013', operadora: 'Amil', dataGeracao: '20/02/2026', quantidadeGuias: 38, valorTotal: 22100.00, status: 'processado', xmlGerado: true },
];

const OPERADORAS = ['Todas', 'Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Hapvida', 'NotreDame', 'Porto Seguro'];

const RelatoriosTISS: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'guias' | 'lotes' | 'validacao' | 'relatorios'>('guias');
  const [selectedOperadora, setSelectedOperadora] = useState('Todas');
  const [selectedGuias, setSelectedGuias] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResults, setValidationResults] = useState<{passed: number; warnings: number; errors: number} | null>(null);

  const filteredGuias = selectedOperadora === 'Todas' ? DEMO_GUIAS : DEMO_GUIAS.filter(g => g.operadora === selectedOperadora);

  const toggleGuia = (id: string) => {
    setSelectedGuias(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const getStatusBadge = (status: string) => {
    const map: Record<string, { text: string; color: string }> = {
      pendente: { text: 'Pendente', color: 'bg-amber-500/10 text-amber-400' },
      validado: { text: 'Validado', color: 'bg-blue-500/10 text-blue-400' },
      enviado: { text: 'Enviado', color: 'bg-indigo-500/10 text-indigo-400' },
      pago: { text: 'Pago', color: 'bg-emerald-500/10 text-emerald-400' },
      glosado: { text: 'Glosado', color: 'bg-red-500/10 text-red-400' },
      gerado: { text: 'Gerado', color: 'bg-cyan-500/10 text-cyan-400' },
      processado: { text: 'Processado', color: 'bg-emerald-500/10 text-emerald-400' },
      erro: { text: 'Erro', color: 'bg-red-500/10 text-red-400' },
    };
    return map[status] || { text: status, color: 'bg-muted text-muted-foreground' };
  };

  const getTipoLabel = (tipo: string) => {
    const map: Record<string, string> = {
      consulta: 'Consulta', sadt: 'SP/SADT', internacao: 'Internação', honorarios: 'Honorários', odonto: 'Odontológica',
    };
    return map[tipo] || tipo;
  };

  const handleGenerateLote = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 2500));
    setIsGenerating(false);
    setSelectedGuias([]);
  };

  const handleValidateXML = async () => {
    setIsValidating(true);
    setValidationResults(null);
    await new Promise(r => setTimeout(r, 2000));
    setValidationResults({ passed: 42, warnings: 3, errors: 0 });
    setIsValidating(false);
  };

  return (
    <div className="space-y-6">
      <EducationalDisclaimer module="Relatórios TISS XML" />

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/10 to-green-500/10 border border-teal-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center text-2xl">🏥</div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">Relatórios TISS XML</h1>
            <p className="text-sm text-muted-foreground">Padrão ANS 4.01.00 — Geração de lotes, validação e envio para operadoras</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3 mt-4">
          {[
            { label: 'Guias Pendentes', value: '12', color: 'text-amber-400' },
            { label: 'Guias Validadas', value: '45', color: 'text-blue-400' },
            { label: 'Lotes Enviados', value: '8', color: 'text-indigo-400' },
            { label: 'Valor Faturado', value: 'R$ 84.700', color: 'text-emerald-400' },
            { label: 'Taxa de Glosa', value: '3.2%', color: 'text-red-400' },
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
          { id: 'guias' as const, label: 'Guias TISS', icon: '📋' },
          { id: 'lotes' as const, label: 'Lotes XML', icon: '📦' },
          { id: 'validacao' as const, label: 'Validação XML', icon: '✅' },
          { id: 'relatorios' as const, label: 'Relatórios', icon: '📊' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            <span className="mr-1.5">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Guias Tab */}
      {activeTab === 'guias' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Operadora:</span>
              <select value={selectedOperadora} onChange={e => setSelectedOperadora(e.target.value)}
                className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground">
                {OPERADORAS.map(op => <option key={op} value={op}>{op}</option>)}
              </select>
            </div>
            <button onClick={handleGenerateLote} disabled={selectedGuias.length === 0 || isGenerating}
              className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all disabled:opacity-50">
              {isGenerating ? 'Gerando XML...' : `📦 Gerar Lote XML (${selectedGuias.length} guias)`}
            </button>
          </div>

          <div className="space-y-3">
            {filteredGuias.map(guia => (
              <div key={guia.id} className={`bg-card border rounded-xl p-4 transition-all ${selectedGuias.includes(guia.id) ? 'border-teal-500/30 ring-1 ring-teal-500/20' : 'border-border'}`}>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleGuia(guia.id)}
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${selectedGuias.includes(guia.id) ? 'bg-teal-500 border-teal-500' : 'border-border'}`}>
                    {selectedGuias.includes(guia.id) && <span className="text-white text-xs">✓</span>}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-foreground">{guia.numero}</p>
                        <span className="px-1.5 py-0.5 text-[9px] font-bold bg-muted text-muted-foreground rounded">{getTipoLabel(guia.tipo)}</span>
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${getStatusBadge(guia.status).color}`}>{getStatusBadge(guia.status).text}</span>
                      </div>
                      <p className="text-sm font-bold text-emerald-400">R$ {guia.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                      <span>👤 {guia.paciente}</span>
                      <span>🏥 {guia.operadora}</span>
                      <span>📅 {guia.dataExecucao}</span>
                      <span>📋 {guia.procedimentos.length} procedimento(s)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-2 ml-8">
                  <div className="flex flex-wrap gap-1">
                    {guia.procedimentos.map((proc, i) => (
                      <span key={i} className="px-2 py-0.5 text-[9px] bg-muted/50 text-muted-foreground rounded-md">
                        {proc.codigo} — {proc.descricao} (R$ {proc.valor.toFixed(2)})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lotes Tab */}
      {activeTab === 'lotes' && (
        <div className="space-y-4">
          {DEMO_LOTES.map(lote => (
            <div key={lote.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-foreground">{lote.numero}</p>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${getStatusBadge(lote.status).color}`}>{getStatusBadge(lote.status).text}</span>
                  {lote.xmlGerado && <span className="px-1.5 py-0.5 text-[9px] font-bold bg-teal-500/10 text-teal-400 rounded">XML ✓</span>}
                </div>
                <p className="text-sm font-bold text-emerald-400">R$ {lote.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground mb-3">
                <span>🏥 {lote.operadora}</span>
                <span>📅 {lote.dataGeracao}</span>
                <span>📋 {lote.quantidadeGuias} guias</span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-[10px] font-bold bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-lg hover:bg-teal-500/20">Download XML</button>
                <button className="px-3 py-1.5 text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20">Validar XML</button>
                <button className="px-3 py-1.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20">Enviar para Operadora</button>
                <button className="px-3 py-1.5 text-[10px] font-bold bg-muted text-muted-foreground border border-border rounded-lg hover:bg-muted/80">Visualizar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Validação Tab */}
      {activeTab === 'validacao' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Validador XML TISS — Padrão ANS 4.01.00</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Valide seus arquivos XML TISS antes de enviar para as operadoras. O validador verifica a conformidade 
              com o schema XSD oficial da ANS, campos obrigatórios, códigos TUSS e regras de negócio.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-all">
                <div className="w-12 h-12 mx-auto rounded-full bg-teal-500/10 flex items-center justify-center text-2xl mb-2">📄</div>
                <p className="text-sm font-medium text-foreground">Upload de XML TISS</p>
                <p className="text-xs text-muted-foreground mt-1">Arraste ou clique para enviar o arquivo .xml</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground">Verificações Realizadas</h4>
                {[
                  'Schema XSD ANS 4.01.00',
                  'Campos obrigatórios preenchidos',
                  'Códigos TUSS válidos',
                  'CPF/CNPJ válidos (dígitos verificadores)',
                  'Datas no formato correto',
                  'Valores dentro das faixas permitidas',
                  'Registro ANS da operadora válido',
                  'Hash de integridade do lote',
                ].map((check, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="text-emerald-400">✓</span>{check}
                  </div>
                ))}
              </div>
            </div>
            <button onClick={handleValidateXML} disabled={isValidating}
              className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all disabled:opacity-50">
              {isValidating ? 'Validando XML...' : '✅ Validar Último Lote Gerado'}
            </button>

            {validationResults && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-emerald-400">{validationResults.passed}</p>
                  <p className="text-xs text-muted-foreground">Aprovados</p>
                </div>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-amber-400">{validationResults.warnings}</p>
                  <p className="text-xs text-muted-foreground">Avisos</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-400">{validationResults.errors}</p>
                  <p className="text-xs text-muted-foreground">Erros</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Relatórios Tab */}
      {activeTab === 'relatorios' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Faturamento por Operadora', description: 'Resumo de valores faturados, pagos e glosados por operadora', icon: '🏥', period: 'Mensal' },
            { title: 'Análise de Glosas', description: 'Detalhamento de glosas por tipo, operadora e motivo', icon: '❌', period: 'Mensal' },
            { title: 'Produtividade Médica', description: 'Quantidade de guias e valor faturado por profissional', icon: '👨‍⚕️', period: 'Mensal' },
            { title: 'Procedimentos Mais Realizados', description: 'Ranking de procedimentos TUSS por frequência e valor', icon: '📊', period: 'Trimestral' },
            { title: 'Tempo Médio de Recebimento', description: 'Prazo entre envio do lote e pagamento pela operadora', icon: '⏱️', period: 'Mensal' },
            { title: 'Demonstrativo de Pagamento', description: 'Conciliação entre valores faturados e recebidos', icon: '💰', period: 'Mensal' },
          ].map((report, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{report.icon}</span>
                <div>
                  <p className="text-sm font-bold text-foreground">{report.title}</p>
                  <p className="text-[10px] text-muted-foreground">{report.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="px-2 py-0.5 text-[9px] font-bold bg-muted text-muted-foreground rounded">{report.period}</span>
                <div className="flex gap-2">
                  <button className="px-2 py-1 text-[10px] font-medium bg-teal-500/10 text-teal-400 rounded-lg hover:bg-teal-500/20">PDF</button>
                  <button className="px-2 py-1 text-[10px] font-medium bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20">Excel</button>
                  <button className="px-2 py-1 text-[10px] font-medium bg-muted text-foreground rounded-lg hover:bg-muted/80">Gerar</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RelatoriosTISS;
