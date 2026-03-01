/**
 * MedFocus — Assinatura Digital ICP-Brasil e Receita Digital (Sprint 40)
 * Assinatura de documentos com certificado digital ICP-Brasil
 * Receita Digital conforme Portaria MS 467/2020
 * Atestados, laudos e prescrições com validade jurídica
 */
import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface Certificado {
  id: string;
  titular: string;
  crm: string;
  tipo: 'A1' | 'A3' | 'cloud';
  emissora: string;
  validade: string;
  status: 'ativo' | 'expirado' | 'revogado';
}

interface DocumentoAssinado {
  id: string;
  tipo: 'receita' | 'atestado' | 'laudo' | 'encaminhamento' | 'declaracao';
  paciente: string;
  dataAssinatura: string;
  medico: string;
  crm: string;
  hashSHA256: string;
  status: 'assinado' | 'verificado' | 'enviado';
  qrCodeValidacao: boolean;
}

const DEMO_CERTIFICADOS: Certificado[] = [
  { id: '1', titular: 'Dr. Carlos Eduardo Silva', crm: 'CRM/SP 123456', tipo: 'A3', emissora: 'Certisign', validade: '15/08/2027', status: 'ativo' },
  { id: '2', titular: 'Dra. Ana Beatriz Costa', crm: 'CRM/SP 789012', tipo: 'cloud', emissora: 'BirdID (Soluti)', validade: '20/12/2026', status: 'ativo' },
];

const DEMO_DOCUMENTOS: DocumentoAssinado[] = [
  { id: '1', tipo: 'receita', paciente: 'Maria Silva Santos', dataAssinatura: '01/03/2026 14:30', medico: 'Dr. Carlos Eduardo Silva', crm: 'CRM/SP 123456', hashSHA256: 'a3f2b8c1...d4e5f6', status: 'enviado', qrCodeValidacao: true },
  { id: '2', tipo: 'atestado', paciente: 'João Pedro Oliveira', dataAssinatura: '01/03/2026 11:15', medico: 'Dr. Carlos Eduardo Silva', crm: 'CRM/SP 123456', hashSHA256: 'b7c8d9e0...f1a2b3', status: 'assinado', qrCodeValidacao: true },
  { id: '3', tipo: 'laudo', paciente: 'Ana Beatriz Lima', dataAssinatura: '28/02/2026 16:45', medico: 'Dra. Ana Beatriz Costa', crm: 'CRM/SP 789012', hashSHA256: 'c4d5e6f7...a8b9c0', status: 'verificado', qrCodeValidacao: true },
  { id: '4', tipo: 'receita', paciente: 'Roberto Almeida Neto', dataAssinatura: '28/02/2026 10:00', medico: 'Dr. Carlos Eduardo Silva', crm: 'CRM/SP 123456', hashSHA256: 'd1e2f3a4...b5c6d7', status: 'enviado', qrCodeValidacao: true },
  { id: '5', tipo: 'encaminhamento', paciente: 'Fernanda Souza', dataAssinatura: '27/02/2026 09:30', medico: 'Dra. Ana Beatriz Costa', crm: 'CRM/SP 789012', hashSHA256: 'e8f9a0b1...c2d3e4', status: 'assinado', qrCodeValidacao: true },
];

const TIPOS_DOCUMENTO = [
  { id: 'receita', label: 'Receita Digital', icon: '💊', description: 'Prescrição de medicamentos com validade jurídica', legislacao: 'Portaria MS 467/2020' },
  { id: 'receita_especial', label: 'Receita Especial', icon: '🔴', description: 'Receita de controle especial (C1, C2, B1, B2, A)', legislacao: 'Portaria SVS/MS 344/1998' },
  { id: 'atestado', label: 'Atestado Médico', icon: '📄', description: 'Atestado de comparecimento ou afastamento', legislacao: 'CFM 1.658/2002' },
  { id: 'laudo', label: 'Laudo Médico', icon: '📋', description: 'Laudo para convênio, perícia ou judicial', legislacao: 'CFM 1.851/2008' },
  { id: 'encaminhamento', label: 'Encaminhamento', icon: '🔄', description: 'Encaminhamento para especialista ou exame', legislacao: 'CFM 1.974/2011' },
  { id: 'declaracao', label: 'Declaração', icon: '📝', description: 'Declaração de acompanhamento ou saúde', legislacao: 'CFM 2.217/2018' },
];

const AssinaturaDigital: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'assinar' | 'certificados' | 'historico' | 'validar'>('assinar');
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);

  const handleSign = async () => {
    setIsSigning(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsSigning(false);
    setSelectedTipo(null);
  };

  const handleValidate = async () => {
    setIsValidating(true);
    setValidationResult(null);
    await new Promise(r => setTimeout(r, 1500));
    setValidationResult('valid');
    setIsValidating(false);
  };

  const getTipoIcon = (tipo: string) => {
    const map: Record<string, string> = { receita: '💊', atestado: '📄', laudo: '📋', encaminhamento: '🔄', declaracao: '📝' };
    return map[tipo] || '📄';
  };

  return (
    <div className="space-y-6">
      <EducationalDisclaimer module="Assinatura Digital" />

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-2xl">🔏</div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">Assinatura Digital ICP-Brasil</h1>
            <p className="text-sm text-muted-foreground">Receita Digital, Atestados e Laudos com validade jurídica — Conforme MP 2.200-2/2001</p>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3 mt-4">
          {[
            { label: 'Certificados Ativos', value: '2', color: 'text-emerald-400' },
            { label: 'Docs Assinados (Mês)', value: '127', color: 'text-violet-400' },
            { label: 'Receitas Digitais', value: '89', color: 'text-blue-400' },
            { label: 'Atestados', value: '24', color: 'text-amber-400' },
            { label: 'Laudos', value: '14', color: 'text-cyan-400' },
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
          { id: 'assinar' as const, label: 'Assinar Documento', icon: '✍️' },
          { id: 'certificados' as const, label: 'Certificados', icon: '🔐' },
          { id: 'historico' as const, label: 'Histórico', icon: '📚' },
          { id: 'validar' as const, label: 'Validar Assinatura', icon: '✅' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            <span className="mr-1.5">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Assinar Tab */}
      {activeTab === 'assinar' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Tipo de Documento</h3>
            <div className="grid grid-cols-2 gap-3">
              {TIPOS_DOCUMENTO.map(tipo => (
                <button key={tipo.id} onClick={() => setSelectedTipo(tipo.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${selectedTipo === tipo.id ? 'bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20' : 'bg-card border-border hover:bg-muted/50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{tipo.icon}</span>
                    <p className="text-xs font-bold text-foreground">{tipo.label}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{tipo.description}</p>
                  <p className="text-[9px] text-violet-400 mt-1">{tipo.legislacao}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {selectedTipo && (
              <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Preencher {TIPOS_DOCUMENTO.find(t => t.id === selectedTipo)?.label}</h3>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Paciente</label>
                  <input type="text" placeholder="Buscar paciente por nome ou CPF..." className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground" />
                </div>
                {(selectedTipo === 'receita' || selectedTipo === 'receita_especial') && (
                  <>
                    <div>
                      <label className="text-xs font-medium text-foreground mb-1 block">Medicamento</label>
                      <input type="text" placeholder="Buscar medicamento..." className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground" />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] font-medium text-foreground mb-1 block">Dosagem</label>
                        <input type="text" placeholder="Ex: 500mg" className="w-full px-2 py-1.5 rounded-lg bg-muted border border-border text-xs text-foreground" />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-foreground mb-1 block">Posologia</label>
                        <input type="text" placeholder="Ex: 8/8h" className="w-full px-2 py-1.5 rounded-lg bg-muted border border-border text-xs text-foreground" />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-foreground mb-1 block">Duração</label>
                        <input type="text" placeholder="Ex: 7 dias" className="w-full px-2 py-1.5 rounded-lg bg-muted border border-border text-xs text-foreground" />
                      </div>
                    </div>
                  </>
                )}
                {selectedTipo === 'atestado' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-medium text-foreground mb-1 block">Dias de Afastamento</label>
                      <input type="number" placeholder="0" className="w-full px-2 py-1.5 rounded-lg bg-muted border border-border text-xs text-foreground" />
                    </div>
                    <div>
                      <label className="text-[10px] font-medium text-foreground mb-1 block">CID-10 (opcional)</label>
                      <input type="text" placeholder="Ex: J06.9" className="w-full px-2 py-1.5 rounded-lg bg-muted border border-border text-xs text-foreground" />
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Observações</label>
                  <textarea rows={3} placeholder="Informações adicionais..." className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground resize-none" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Certificado Digital</label>
                  <select className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground">
                    {DEMO_CERTIFICADOS.filter(c => c.status === 'ativo').map(cert => (
                      <option key={cert.id} value={cert.id}>{cert.titular} — {cert.crm} ({cert.tipo.toUpperCase()})</option>
                    ))}
                  </select>
                </div>
                <div className="bg-violet-500/5 border border-violet-500/20 rounded-lg p-3">
                  <p className="text-[10px] text-violet-300 font-medium">O documento será assinado digitalmente com certificado ICP-Brasil, gerando um hash SHA-256 único e QR Code para validação. A assinatura tem validade jurídica conforme MP 2.200-2/2001.</p>
                </div>
                <button onClick={handleSign} disabled={isSigning}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-all disabled:opacity-50">
                  {isSigning ? '🔏 Assinando com Certificado Digital...' : '🔏 Assinar Digitalmente'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Certificados Tab */}
      {activeTab === 'certificados' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Certificados Digitais Cadastrados</h3>
            <button className="px-3 py-1.5 text-[10px] font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-lg hover:bg-violet-500/20">
              + Adicionar Certificado
            </button>
          </div>
          {DEMO_CERTIFICADOS.map(cert => (
            <div key={cert.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center text-lg">🔐</div>
                  <div>
                    <p className="text-sm font-bold text-foreground">{cert.titular}</p>
                    <p className="text-xs text-muted-foreground">{cert.crm}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${cert.status === 'ativo' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {cert.status === 'ativo' ? '✓ Ativo' : 'Expirado'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><p className="text-[10px] text-muted-foreground">Tipo</p><p className="text-xs font-bold text-foreground">{cert.tipo.toUpperCase()}</p></div>
                <div><p className="text-[10px] text-muted-foreground">Emissora</p><p className="text-xs font-bold text-foreground">{cert.emissora}</p></div>
                <div><p className="text-[10px] text-muted-foreground">Validade</p><p className="text-xs font-bold text-foreground">{cert.validade}</p></div>
              </div>
              <div className="mt-3 bg-muted/30 rounded-lg p-3">
                <p className="text-[10px] text-muted-foreground">
                  {cert.tipo === 'A1' && 'Certificado armazenado em software (arquivo .pfx). Válido por 1 ano.'}
                  {cert.tipo === 'A3' && 'Certificado armazenado em token USB ou smartcard. Válido por até 5 anos.'}
                  {cert.tipo === 'cloud' && 'Certificado em nuvem (BirdID/Soluti). Assinatura via app mobile. Válido por até 5 anos.'}
                </p>
              </div>
            </div>
          ))}

          <div className="bg-card border border-border rounded-2xl p-5">
            <h4 className="text-sm font-bold text-foreground mb-3">Emissoras de Certificado Digital Homologadas</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Certisign', tipos: 'A1, A3', url: 'certisign.com.br' },
                { name: 'Serasa Experian', tipos: 'A1, A3', url: 'serasa.certificadodigital.com.br' },
                { name: 'Soluti (BirdID)', tipos: 'A1, Cloud', url: 'soluti.com.br' },
                { name: 'Valid Certificadora', tipos: 'A1, A3', url: 'valid.com.br' },
                { name: 'AC Digitalsign', tipos: 'A1, A3', url: 'digitalsignbrasil.com.br' },
                { name: 'Safeweb', tipos: 'A1, A3, Cloud', url: 'safeweb.com.br' },
                { name: 'AC OAB', tipos: 'A3', url: 'certificado.oab.org.br' },
                { name: 'CFM Digital', tipos: 'Cloud', url: 'portalmedico.org.br' },
              ].map((emissora, i) => (
                <div key={i} className="bg-muted/30 border border-border/50 rounded-lg p-3">
                  <p className="text-xs font-bold text-foreground">{emissora.name}</p>
                  <p className="text-[10px] text-muted-foreground">Tipos: {emissora.tipos}</p>
                  <p className="text-[10px] text-violet-400">{emissora.url}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Histórico Tab */}
      {activeTab === 'historico' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Documentos Assinados Digitalmente</h3>
            <div className="flex gap-2">
              <input type="text" placeholder="Buscar por paciente..." className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground w-48" />
              <select className="px-3 py-1.5 text-xs bg-muted border border-border rounded-lg text-foreground">
                <option value="">Todos os tipos</option>
                <option value="receita">Receitas</option>
                <option value="atestado">Atestados</option>
                <option value="laudo">Laudos</option>
              </select>
            </div>
          </div>
          {DEMO_DOCUMENTOS.map(doc => (
            <div key={doc.id} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTipoIcon(doc.tipo)}</span>
                  <div>
                    <p className="text-sm font-bold text-foreground">{doc.paciente}</p>
                    <p className="text-[10px] text-muted-foreground">{doc.tipo.charAt(0).toUpperCase() + doc.tipo.slice(1)} — {doc.dataAssinatura}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.qrCodeValidacao && <span className="px-1.5 py-0.5 text-[9px] font-bold bg-violet-500/10 text-violet-400 rounded">QR ✓</span>}
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${doc.status === 'enviado' ? 'bg-emerald-500/10 text-emerald-400' : doc.status === 'verificado' ? 'bg-blue-500/10 text-blue-400' : 'bg-violet-500/10 text-violet-400'}`}>
                    {doc.status === 'enviado' ? 'Enviado' : doc.status === 'verificado' ? 'Verificado' : 'Assinado'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span>👨‍⚕️ {doc.medico}</span>
                <span>🏥 {doc.crm}</span>
                <span className="font-mono">SHA-256: {doc.hashSHA256}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="px-2 py-1 text-[10px] font-medium bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20">Visualizar</button>
                <button className="px-2 py-1 text-[10px] font-medium bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20">Download PDF</button>
                <button className="px-2 py-1 text-[10px] font-medium bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20">Enviar ao Paciente</button>
                <button className="px-2 py-1 text-[10px] font-medium bg-muted text-muted-foreground rounded-lg hover:bg-muted/80">Verificar</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Validar Tab */}
      {activeTab === 'validar' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4 text-center">Validar Assinatura Digital</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Verifique a autenticidade de documentos assinados digitalmente pelo MedFocus. 
              Insira o código de verificação ou faça upload do documento PDF assinado.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Código de Verificação</label>
                <input type="text" placeholder="Ex: MF-2026-ABC123DEF456" className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-sm text-foreground text-center font-mono tracking-wider" />
              </div>
              <div className="text-center text-xs text-muted-foreground">— ou —</div>
              <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all">
                <div className="w-12 h-12 mx-auto rounded-full bg-violet-500/10 flex items-center justify-center text-2xl mb-2">📄</div>
                <p className="text-sm font-medium text-foreground">Upload do PDF Assinado</p>
                <p className="text-xs text-muted-foreground mt-1">Arraste ou clique para enviar</p>
              </div>
              <button onClick={handleValidate} disabled={isValidating}
                className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-all disabled:opacity-50">
                {isValidating ? 'Verificando assinatura...' : '✅ Validar Assinatura'}
              </button>
            </div>

            {validationResult === 'valid' && (
              <div className="mt-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">✅</span>
                  <p className="text-sm font-bold text-emerald-400">Assinatura Válida</p>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p><strong className="text-foreground">Signatário:</strong> Dr. Carlos Eduardo Silva — CRM/SP 123456</p>
                  <p><strong className="text-foreground">Data:</strong> 01/03/2026 às 14:30</p>
                  <p><strong className="text-foreground">Certificado:</strong> ICP-Brasil A3 — Certisign</p>
                  <p><strong className="text-foreground">Hash SHA-256:</strong> <span className="font-mono">a3f2b8c1d4e5f6a7b8c9d0e1f2a3b4c5</span></p>
                  <p><strong className="text-foreground">Integridade:</strong> Documento não foi alterado após assinatura</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-muted/30 border border-border/50 rounded-xl p-4">
            <h4 className="text-xs font-bold text-foreground mb-2">Base Legal</h4>
            <div className="space-y-1 text-[10px] text-muted-foreground">
              <p><strong>MP 2.200-2/2001:</strong> Institui a ICP-Brasil e confere validade jurídica a documentos eletrônicos assinados digitalmente.</p>
              <p><strong>Portaria MS 467/2020:</strong> Autoriza receitas médicas digitais com certificado ICP-Brasil durante e após a pandemia.</p>
              <p><strong>CFM 2.299/2021:</strong> Regulamenta a telemedicina e aceita assinatura digital em documentos médicos.</p>
              <p><strong>Lei 14.063/2020:</strong> Define os tipos de assinatura eletrônica (simples, avançada e qualificada) para o setor público e saúde.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssinaturaDigital;
