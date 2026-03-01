import { useState } from 'react';
import { FileText, Upload, Eye, Download, Shield, Search, CheckCircle, AlertTriangle, Camera, FileImage, FilePlus, Stamp, Lock, QrCode, Loader2, Trash2, Clock, Pen, FileCheck, Folder } from 'lucide-react';
import EducationalDisclaimer from './EducationalDisclaimer';

// ==================== INTERFACES ====================
interface Documento {
  id: string;
  tipo: 'receita' | 'atestado' | 'laudo' | 'exame' | 'guia_tiss' | 'termo' | 'encaminhamento';
  titulo: string;
  paciente: string;
  medico: string;
  data: string;
  assinado: boolean;
  assinaturaICP: boolean;
  qrValidacao: boolean;
  tamanho: string;
  formato: string;
  ocrProcessado?: boolean;
  dadosExtraidos?: Record<string, string>;
}

interface ExameOCR {
  id: string;
  nomeExame: string;
  laboratorio: string;
  dataColeta: string;
  resultados: { parametro: string; valor: string; unidade: string; referencia: string; status: 'normal' | 'alto' | 'baixo' | 'critico' }[];
  confiancaOCR: number;
}

// ==================== MOCK DATA ====================
const DOCUMENTOS: Documento[] = [
  { id: 'D001', tipo: 'receita', titulo: 'Receita Digital — Losartana 50mg + Hidroclorotiazida 12.5mg', paciente: 'Carlos Eduardo Lima', medico: 'Dr. Roberto Almeida', data: '2026-03-01', assinado: true, assinaturaICP: true, qrValidacao: true, tamanho: '245 KB', formato: 'PDF' },
  { id: 'D002', tipo: 'atestado', titulo: 'Atestado Médico — 3 dias de afastamento', paciente: 'Fernanda Costa Souza', medico: 'Dra. Ana Paula Santos', data: '2026-02-28', assinado: true, assinaturaICP: true, qrValidacao: true, tamanho: '180 KB', formato: 'PDF' },
  { id: 'D003', tipo: 'laudo', titulo: 'Laudo de Ecocardiograma Transtorácico', paciente: 'Roberto Mendes Filho', medico: 'Dr. Roberto Almeida', data: '2026-02-27', assinado: true, assinaturaICP: true, qrValidacao: true, tamanho: '1.2 MB', formato: 'PDF' },
  { id: 'D004', tipo: 'exame', titulo: 'Hemograma Completo + Perfil Lipídico', paciente: 'Carlos Eduardo Lima', medico: 'Dr. Roberto Almeida', data: '2026-02-25', assinado: false, assinaturaICP: false, qrValidacao: false, tamanho: '890 KB', formato: 'PDF', ocrProcessado: true },
  { id: 'D005', tipo: 'guia_tiss', titulo: 'Guia TISS SP/SADT — Ecocardiograma', paciente: 'Roberto Mendes Filho', medico: 'Dr. Roberto Almeida', data: '2026-02-26', assinado: true, assinaturaICP: false, qrValidacao: false, tamanho: '320 KB', formato: 'XML/PDF' },
  { id: 'D006', tipo: 'termo', titulo: 'Termo de Consentimento — Cateterismo Cardíaco', paciente: 'Pedro Augusto Reis', medico: 'Dr. Roberto Almeida', data: '2026-02-24', assinado: true, assinaturaICP: true, qrValidacao: true, tamanho: '410 KB', formato: 'PDF' },
  { id: 'D007', tipo: 'encaminhamento', titulo: 'Encaminhamento para Cirurgia Cardíaca', paciente: 'Lucia Helena Martins', medico: 'Dr. Roberto Almeida', data: '2026-02-22', assinado: true, assinaturaICP: true, qrValidacao: true, tamanho: '195 KB', formato: 'PDF' },
  { id: 'D008', tipo: 'receita', titulo: 'Receita Especial — Clonazepam 2mg (Tarja Preta)', paciente: 'Mariana Oliveira', medico: 'Dra. Ana Paula Santos', data: '2026-02-20', assinado: true, assinaturaICP: true, qrValidacao: true, tamanho: '260 KB', formato: 'PDF' },
];

const EXAME_OCR_DEMO: ExameOCR = {
  id: 'OCR001',
  nomeExame: 'Hemograma Completo + Perfil Lipídico',
  laboratorio: 'Laboratório Fleury',
  dataColeta: '2026-02-24',
  confiancaOCR: 97.3,
  resultados: [
    { parametro: 'Hemoglobina', valor: '14.2', unidade: 'g/dL', referencia: '12.0-17.5', status: 'normal' },
    { parametro: 'Hematócrito', valor: '42.5', unidade: '%', referencia: '36.0-54.0', status: 'normal' },
    { parametro: 'Leucócitos', valor: '7.800', unidade: '/mm³', referencia: '4.000-11.000', status: 'normal' },
    { parametro: 'Plaquetas', valor: '245.000', unidade: '/mm³', referencia: '150.000-400.000', status: 'normal' },
    { parametro: 'Colesterol Total', valor: '242', unidade: 'mg/dL', referencia: '< 190', status: 'alto' },
    { parametro: 'LDL-Colesterol', valor: '165', unidade: 'mg/dL', referencia: '< 130', status: 'alto' },
    { parametro: 'HDL-Colesterol', valor: '38', unidade: 'mg/dL', referencia: '> 40', status: 'baixo' },
    { parametro: 'Triglicerídeos', valor: '285', unidade: 'mg/dL', referencia: '< 150', status: 'critico' },
    { parametro: 'Glicemia Jejum', valor: '118', unidade: 'mg/dL', referencia: '70-99', status: 'alto' },
    { parametro: 'HbA1c', valor: '6.2', unidade: '%', referencia: '< 5.7', status: 'alto' },
    { parametro: 'Creatinina', valor: '1.0', unidade: 'mg/dL', referencia: '0.7-1.3', status: 'normal' },
    { parametro: 'TGO (AST)', valor: '28', unidade: 'U/L', referencia: '< 40', status: 'normal' },
    { parametro: 'TGP (ALT)', valor: '32', unidade: 'U/L', referencia: '< 41', status: 'normal' },
    { parametro: 'TSH', valor: '2.8', unidade: 'mUI/L', referencia: '0.4-4.0', status: 'normal' },
  ]
};

const TIPO_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  'receita': { label: 'Receita', color: 'green', icon: FileText },
  'atestado': { label: 'Atestado', color: 'blue', icon: FileCheck },
  'laudo': { label: 'Laudo', color: 'purple', icon: FileText },
  'exame': { label: 'Exame', color: 'cyan', icon: FileImage },
  'guia_tiss': { label: 'Guia TISS', color: 'yellow', icon: Folder },
  'termo': { label: 'Termo', color: 'orange', icon: Pen },
  'encaminhamento': { label: 'Encaminhamento', color: 'indigo', icon: FilePlus },
};

// ==================== COMPONENT ====================
export default function GestaoDocumentos() {
  const [activeTab, setActiveTab] = useState<'documentos' | 'ocr' | 'assinatura' | 'modelos'>('documentos');
  const [filterTipo, setFilterTipo] = useState<string>('todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [showOCRResult, setShowOCRResult] = useState(false);
  const [isProcessingOCR, setIsProcessingOCR] = useState(false);

  const filteredDocs = DOCUMENTOS.filter(d => {
    const matchTipo = filterTipo === 'todos' || d.tipo === filterTipo;
    const matchSearch = searchTerm === '' || d.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || d.paciente.toLowerCase().includes(searchTerm.toLowerCase());
    return matchTipo && matchSearch;
  });

  const processOCR = async () => {
    setIsProcessingOCR(true);
    await new Promise(r => setTimeout(r, 3000));
    setIsProcessingOCR(false);
    setShowOCRResult(true);
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'normal': return 'text-green-400';
      case 'alto': return 'text-yellow-400';
      case 'baixo': return 'text-blue-400';
      case 'critico': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <EducationalDisclaimer module="Gestão de Documentos" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/40 rounded-2xl p-6 border border-emerald-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-emerald-500/20 rounded-lg">
            <FileText className="w-6 h-6 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Gestão de Documentos Multimodal</h1>
        </div>
        <p className="text-gray-400 text-sm">
          OCR inteligente para exames, assinatura digital ICP-Brasil, QR Code de validação, modelos de documentos e gestão centralizada de prontuário.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Documentos', value: DOCUMENTOS.length, icon: FileText, color: 'emerald' },
          { label: 'Assinados ICP', value: DOCUMENTOS.filter(d => d.assinaturaICP).length, icon: Shield, color: 'green' },
          { label: 'OCR Processados', value: DOCUMENTOS.filter(d => d.ocrProcessado).length, icon: Camera, color: 'cyan' },
          { label: 'QR Validação', value: DOCUMENTOS.filter(d => d.qrValidacao).length, icon: QrCode, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex items-center justify-between">
              <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
              <span className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</span>
            </div>
            <span className="text-xs text-gray-500">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'documentos' as const, label: 'Documentos', icon: Folder },
          { id: 'ocr' as const, label: 'OCR de Exames', icon: Camera },
          { id: 'assinatura' as const, label: 'Assinatura Digital', icon: Stamp },
          { id: 'modelos' as const, label: 'Modelos', icon: FilePlus },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Documentos */}
      {activeTab === 'documentos' && (
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título ou paciente..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-white placeholder-gray-500"
              />
            </div>
            <select
              value={filterTipo}
              onChange={(e) => setFilterTipo(e.target.value)}
              className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm text-gray-300"
            >
              <option value="todos">Todos os Tipos</option>
              {Object.entries(TIPO_CONFIG).map(([key, conf]) => (
                <option key={key} value={key}>{conf.label}</option>
              ))}
            </select>
          </div>

          <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700/50">
                  <th className="text-left text-xs text-gray-500 p-3">Tipo</th>
                  <th className="text-left text-xs text-gray-500 p-3">Documento</th>
                  <th className="text-left text-xs text-gray-500 p-3">Paciente</th>
                  <th className="text-left text-xs text-gray-500 p-3">Data</th>
                  <th className="text-center text-xs text-gray-500 p-3">ICP-Brasil</th>
                  <th className="text-center text-xs text-gray-500 p-3">QR</th>
                  <th className="text-center text-xs text-gray-500 p-3">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.map(doc => {
                  const tipoConf = TIPO_CONFIG[doc.tipo];
                  return (
                    <tr key={doc.id} className="border-b border-gray-700/30 hover:bg-gray-700/20">
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs bg-${tipoConf.color}-500/20 text-${tipoConf.color}-400`}>
                          {tipoConf.label}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-sm text-white">{doc.titulo}</span>
                        <span className="block text-xs text-gray-500">{doc.medico} • {doc.formato} • {doc.tamanho}</span>
                      </td>
                      <td className="p-3 text-sm text-gray-300">{doc.paciente}</td>
                      <td className="p-3 text-sm text-gray-400">{doc.data}</td>
                      <td className="p-3 text-center">
                        {doc.assinaturaICP ? (
                          <Shield className="w-4 h-4 text-green-400 mx-auto" />
                        ) : (
                          <span className="text-xs text-gray-600">—</span>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {doc.qrValidacao ? (
                          <QrCode className="w-4 h-4 text-purple-400 mx-auto" />
                        ) : (
                          <span className="text-xs text-gray-600">—</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1 hover:bg-gray-700/50 rounded" title="Visualizar">
                            <Eye className="w-4 h-4 text-gray-400" />
                          </button>
                          <button className="p-1 hover:bg-gray-700/50 rounded" title="Download">
                            <Download className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* OCR de Exames */}
      {activeTab === 'ocr' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Camera className="w-5 h-5 text-cyan-400" />
              OCR Inteligente — Extração de Exames (Gemini Vision)
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Faça upload de um PDF ou foto de exame laboratorial. A IA extrai automaticamente os valores, identifica alterações e gera gráficos de evolução.
            </p>

            {!showOCRResult ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center hover:border-cyan-500/50 transition-all cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-400">Arraste um PDF/imagem de exame ou clique para selecionar</p>
                  <p className="text-xs text-gray-600 mt-1">Suporta: PDF, JPG, PNG, HEIC — Máx: 10MB</p>
                </div>
                <button
                  onClick={processOCR}
                  disabled={isProcessingOCR}
                  className="w-full py-3 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 flex items-center justify-center gap-2"
                >
                  {isProcessingOCR ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processando OCR com Gemini Vision...
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      Processar Exame (Demo)
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <span className="text-sm font-medium text-green-400">OCR Concluído com Sucesso</span>
                      <span className="block text-xs text-gray-400">Confiança: {EXAME_OCR_DEMO.confiancaOCR}% — {EXAME_OCR_DEMO.laboratorio} — Coleta: {EXAME_OCR_DEMO.dataColeta}</span>
                    </div>
                  </div>
                  <button onClick={() => setShowOCRResult(false)} className="text-xs text-gray-500 hover:text-gray-300">Novo Exame</button>
                </div>

                <div className="bg-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700/50">
                        <th className="text-left text-xs text-gray-500 p-3">Parâmetro</th>
                        <th className="text-center text-xs text-gray-500 p-3">Valor</th>
                        <th className="text-center text-xs text-gray-500 p-3">Unidade</th>
                        <th className="text-center text-xs text-gray-500 p-3">Referência</th>
                        <th className="text-center text-xs text-gray-500 p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {EXAME_OCR_DEMO.resultados.map((r, i) => (
                        <tr key={i} className={`border-b border-gray-700/30 ${r.status !== 'normal' ? 'bg-yellow-500/5' : ''}`}>
                          <td className="p-3 text-sm text-white">{r.parametro}</td>
                          <td className={`p-3 text-sm text-center font-medium ${statusColor(r.status)}`}>{r.valor}</td>
                          <td className="p-3 text-xs text-gray-400 text-center">{r.unidade}</td>
                          <td className="p-3 text-xs text-gray-500 text-center">{r.referencia}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              r.status === 'normal' ? 'bg-green-500/20 text-green-400' :
                              r.status === 'alto' ? 'bg-yellow-500/20 text-yellow-400' :
                              r.status === 'baixo' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {r.status === 'normal' ? 'Normal' : r.status === 'alto' ? '↑ Alto' : r.status === 'baixo' ? '↓ Baixo' : '⚠ Crítico'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-red-400 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Alertas Clínicos Detectados pela IA
                  </h4>
                  <ul className="text-xs text-gray-400 space-y-1">
                    <li>• <strong className="text-red-400">Triglicerídeos 285 mg/dL (Crítico):</strong> Valor muito acima do limite (150 mg/dL). Risco de pancreatite se &gt; 500. Considerar fibrato.</li>
                    <li>• <strong className="text-yellow-400">LDL 165 mg/dL (Alto):</strong> Acima da meta para paciente com risco cardiovascular. Avaliar estatina.</li>
                    <li>• <strong className="text-yellow-400">Glicemia 118 mg/dL + HbA1c 6.2% (Pré-diabetes):</strong> Critérios ADA para pré-diabetes. Orientar mudança de estilo de vida.</li>
                    <li>• <strong className="text-blue-400">HDL 38 mg/dL (Baixo):</strong> Fator de risco cardiovascular independente. Estimular exercício aeróbico.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assinatura Digital */}
      {activeTab === 'assinatura' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Stamp className="w-5 h-5 text-green-400" />
              Assinatura Digital ICP-Brasil
            </h3>
            <p className="text-sm text-gray-400 mb-6">
              Sistema de assinatura digital com certificado ICP-Brasil, garantindo validade jurídica para receitas, atestados e laudos conforme a legislação brasileira.
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-300">Níveis de Assinatura (Lei 14.063/2020)</h4>
                {[
                  { nivel: 'Assinatura Simples', desc: 'Login + senha. Para documentos internos e comunicação.', lei: 'Art. 4º, I', color: 'yellow', seguranca: 1 },
                  { nivel: 'Assinatura Avançada', desc: 'Certificado digital em nuvem (gov.br). Para documentos SUS e RNDS.', lei: 'Art. 4º, II', color: 'blue', seguranca: 2 },
                  { nivel: 'Assinatura Qualificada (ICP-Brasil)', desc: 'Certificado A1/A3 ICP-Brasil. Validade jurídica plena para receitas e laudos.', lei: 'Art. 4º, III', color: 'green', seguranca: 3 },
                ].map((item, i) => (
                  <div key={i} className={`p-4 bg-${item.color}-500/5 border border-${item.color}-500/20 rounded-lg`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium text-${item.color}-400`}>{item.nivel}</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 3 }).map((_, j) => (
                          <Lock key={j} className={`w-3 h-3 ${j < item.seguranca ? `text-${item.color}-400` : 'text-gray-700'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                    <span className="text-[10px] text-gray-600">{item.lei}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-gray-300">Documentos que Exigem ICP-Brasil</h4>
                {[
                  { doc: 'Receita de Medicamentos Controlados', obrigatorio: true, portaria: 'Portaria 344/1998 ANVISA' },
                  { doc: 'Atestado Médico Digital', obrigatorio: true, portaria: 'Resolução CFM 2.299/2021' },
                  { doc: 'Laudo para Convênio (TISS)', obrigatorio: true, portaria: 'RN 501/2022 ANS' },
                  { doc: 'Prontuário Eletrônico', obrigatorio: true, portaria: 'Resolução CFM 1.821/2007' },
                  { doc: 'Termo de Consentimento', obrigatorio: false, portaria: 'Recomendado' },
                  { doc: 'Encaminhamento', obrigatorio: false, portaria: 'Recomendado' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div>
                      <span className="text-sm text-white">{item.doc}</span>
                      <span className="block text-[10px] text-gray-500">{item.portaria}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${item.obrigatorio ? 'bg-red-500/20 text-red-400' : 'bg-gray-700/50 text-gray-400'}`}>
                      {item.obrigatorio ? 'Obrigatório' : 'Opcional'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Validação de Documento por QR Code</h4>
            <div className="flex items-center gap-6">
              <div className="bg-white rounded-lg p-4">
                <div className="w-24 h-24 grid grid-cols-6 gap-0.5">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className={`w-3.5 h-3.5 ${Math.random() > 0.4 ? 'bg-black' : 'bg-white'}`} />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-300 mb-2">Cada documento assinado recebe um QR Code único que permite a qualquer pessoa verificar:</p>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Autenticidade do documento e integridade do conteúdo</li>
                  <li>• Identidade do médico assinante (CRM verificado)</li>
                  <li>• Data e hora da assinatura (carimbo de tempo)</li>
                  <li>• Validade do certificado ICP-Brasil utilizado</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modelos */}
      {activeTab === 'modelos' && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FilePlus className="w-5 h-5 text-purple-400" />
            Modelos de Documentos
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Modelos pré-configurados com preenchimento automático de dados do paciente, médico e clínica. Todos seguem as normas do CFM e ANVISA.
          </p>

          <div className="grid grid-cols-2 gap-4">
            {[
              { nome: 'Receita Simples', desc: 'Receita branca para medicamentos sem controle especial.', norma: 'RDC 20/2011', campos: 8 },
              { nome: 'Receita Especial (Azul)', desc: 'Para medicamentos da lista B1 e B2 (benzodiazepínicos).', norma: 'Portaria 344/1998', campos: 12 },
              { nome: 'Receita Especial (Amarela)', desc: 'Para medicamentos da lista A1, A2 e A3 (entorpecentes).', norma: 'Portaria 344/1998', campos: 14 },
              { nome: 'Atestado Médico', desc: 'Atestado de comparecimento ou afastamento com CID opcional.', norma: 'CFM 2.299/2021', campos: 6 },
              { nome: 'Laudo Médico', desc: 'Laudo descritivo para exames e procedimentos.', norma: 'CFM 1.821/2007', campos: 10 },
              { nome: 'Guia TISS SP/SADT', desc: 'Guia para solicitação de procedimentos ao convênio.', norma: 'RN 501/2022 ANS', campos: 25 },
              { nome: 'Termo de Consentimento', desc: 'TCLE para procedimentos invasivos e cirurgias.', norma: 'CFM 2.217/2018', campos: 8 },
              { nome: 'Encaminhamento', desc: 'Encaminhamento para outro especialista ou serviço.', norma: 'Padrão CFM', campos: 7 },
              { nome: 'Relatório para Convênio', desc: 'Relatório médico para autorização de procedimentos.', norma: 'RN 501/2022 ANS', campos: 15 },
              { nome: 'Declaração de Óbito', desc: 'Declaração de óbito conforme modelo do Ministério da Saúde.', norma: 'MS/SVS', campos: 20 },
            ].map((modelo, i) => (
              <div key={i} className="p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 hover:border-purple-500/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{modelo.nome}</span>
                  <span className="px-2 py-0.5 bg-gray-700/50 text-gray-400 text-[10px] rounded-full">{modelo.campos} campos</span>
                </div>
                <p className="text-xs text-gray-400">{modelo.desc}</p>
                <span className="text-[10px] text-gray-600 mt-1 block">{modelo.norma}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-xs text-yellow-400/80">
          <strong>Aviso Educacional:</strong> Este módulo demonstra funcionalidades de gestão documental para fins de estudo. A assinatura digital ICP-Brasil requer certificado A1/A3 válido emitido por Autoridade Certificadora credenciada pela ICP-Brasil. O OCR utiliza Gemini Vision para extração e os resultados devem ser sempre validados pelo profissional de saúde. Dados de pacientes são fictícios.
        </p>
      </div>
    </div>
  );
}
