/**
 * MedFocus — Importação de Pacientes e Backup/Exportação (Sprint 38)
 * Importação em massa via CSV/Excel, backup automático, exportação de dados
 * Conformidade com LGPD para transferência e portabilidade de dados
 */
import React, { useState, useRef } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface ImportLog {
  id: string;
  date: Date;
  fileName: string;
  totalRecords: number;
  imported: number;
  errors: number;
  duplicates: number;
  status: 'success' | 'partial' | 'error';
}

interface BackupEntry {
  id: string;
  date: Date;
  type: 'full' | 'incremental' | 'manual';
  size: string;
  status: 'completed' | 'in_progress' | 'failed';
  modules: string[];
}

const IMPORT_TEMPLATES = [
  { id: 'patients', name: 'Pacientes', icon: '👥', fields: ['nome', 'cpf', 'data_nascimento', 'telefone', 'email', 'endereco', 'convenio', 'plano'], description: 'Importar cadastro de pacientes' },
  { id: 'appointments', name: 'Agendamentos', icon: '📅', fields: ['paciente_cpf', 'data', 'hora', 'medico', 'especialidade', 'tipo', 'status'], description: 'Importar histórico de agendamentos' },
  { id: 'medical_records', name: 'Prontuários', icon: '📋', fields: ['paciente_cpf', 'data', 'cid10', 'anamnese', 'exame_fisico', 'diagnostico', 'conduta'], description: 'Importar evoluções clínicas' },
  { id: 'medications', name: 'Prescrições', icon: '💊', fields: ['paciente_cpf', 'data', 'medicamento', 'dosagem', 'posologia', 'duracao', 'medico'], description: 'Importar histórico de prescrições' },
  { id: 'exams', name: 'Exames', icon: '🔬', fields: ['paciente_cpf', 'data', 'tipo_exame', 'resultado', 'valor_referencia', 'laboratorio'], description: 'Importar resultados de exames' },
  { id: 'financial', name: 'Financeiro', icon: '💰', fields: ['paciente_cpf', 'data', 'valor', 'tipo', 'forma_pagamento', 'convenio', 'guia_tiss'], description: 'Importar lançamentos financeiros' },
];

const EXPORT_MODULES = [
  { id: 'all', name: 'Backup Completo', icon: '💾', description: 'Todos os dados do sistema', size: '~250MB' },
  { id: 'patients', name: 'Pacientes', icon: '👥', description: 'Cadastro completo de pacientes', size: '~15MB' },
  { id: 'records', name: 'Prontuários', icon: '📋', description: 'Todas as evoluções clínicas', size: '~120MB' },
  { id: 'financial', name: 'Financeiro', icon: '💰', description: 'Lançamentos e faturamento', size: '~30MB' },
  { id: 'appointments', name: 'Agendamentos', icon: '📅', description: 'Histórico de consultas', size: '~8MB' },
  { id: 'tiss', name: 'Guias TISS', icon: '🏥', description: 'Guias e faturamento de convênios', size: '~45MB' },
  { id: 'documents', name: 'Documentos', icon: '📄', description: 'Laudos, receitas, atestados', size: '~80MB' },
  { id: 'images', name: 'Imagens Médicas', icon: '🖼️', description: 'Exames de imagem anexados', size: '~500MB' },
];

const DEMO_IMPORT_LOGS: ImportLog[] = [
  { id: '1', date: new Date(2026, 1, 28), fileName: 'pacientes_clinica_abc.csv', totalRecords: 1250, imported: 1230, errors: 8, duplicates: 12, status: 'partial' },
  { id: '2', date: new Date(2026, 1, 25), fileName: 'agendamentos_jan2026.xlsx', totalRecords: 340, imported: 340, errors: 0, duplicates: 0, status: 'success' },
  { id: '3', date: new Date(2026, 1, 20), fileName: 'financeiro_2025.csv', totalRecords: 5600, imported: 5580, errors: 20, duplicates: 0, status: 'partial' },
];

const DEMO_BACKUPS: BackupEntry[] = [
  { id: '1', date: new Date(2026, 2, 1, 3, 0), type: 'full', size: '248 MB', status: 'completed', modules: ['Todos'] },
  { id: '2', date: new Date(2026, 1, 28, 3, 0), type: 'incremental', size: '12 MB', status: 'completed', modules: ['Prontuários', 'Agendamentos'] },
  { id: '3', date: new Date(2026, 1, 27, 14, 30), type: 'manual', size: '180 MB', status: 'completed', modules: ['Pacientes', 'Prontuários', 'Financeiro'] },
  { id: '4', date: new Date(2026, 1, 25, 3, 0), type: 'full', size: '245 MB', status: 'completed', modules: ['Todos'] },
];

const ImportacaoBackup: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'import' | 'export' | 'backup' | 'lgpd'>('import');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [selectedExports, setSelectedExports] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'json' | 'xml'>('csv');
  const [backupSchedule, setBackupSchedule] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [encryptBackup, setEncryptBackup] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async () => {
    if (!selectedTemplate) return;
    setIsImporting(true);
    setImportProgress(0);
    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 150));
      setImportProgress(i);
    }
    setIsImporting(false);
    setImportProgress(0);
  };

  const handleExport = async (moduleId: string) => {
    setIsExporting(moduleId);
    await new Promise(r => setTimeout(r, 2000));
    setIsExporting(null);
  };

  const toggleExport = (id: string) => {
    setSelectedExports(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  return (
    <div className="space-y-6">
      <EducationalDisclaimer module="Importação e Backup" />

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-2xl">💾</div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">Importação & Backup</h1>
            <p className="text-sm text-muted-foreground">Importação em massa, backup automático e exportação de dados — Conforme LGPD</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Último Backup', value: '01/03/2026 03:00', color: 'text-emerald-400' },
            { label: 'Dados Protegidos', value: '248 MB', color: 'text-cyan-400' },
            { label: 'Importações', value: '7.170 registros', color: 'text-blue-400' },
            { label: 'Criptografia', value: 'AES-256', color: 'text-violet-400' },
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
          { id: 'import' as const, label: 'Importar Dados', icon: '📥' },
          { id: 'export' as const, label: 'Exportar Dados', icon: '📤' },
          { id: 'backup' as const, label: 'Backup Automático', icon: '💾' },
          { id: 'lgpd' as const, label: 'LGPD & Portabilidade', icon: '🔒' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            <span className="mr-1.5">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Import Tab */}
      {activeTab === 'import' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Selecione o Tipo de Dados</h3>
            <div className="grid grid-cols-2 gap-3">
              {IMPORT_TEMPLATES.map(tmpl => (
                <button key={tmpl.id} onClick={() => setSelectedTemplate(tmpl.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${selectedTemplate === tmpl.id ? 'bg-cyan-500/10 border-cyan-500/30 ring-1 ring-cyan-500/20' : 'bg-card border-border hover:bg-muted/50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{tmpl.icon}</span>
                    <p className="text-sm font-semibold text-foreground">{tmpl.name}</p>
                  </div>
                  <p className="text-[10px] text-muted-foreground">{tmpl.description}</p>
                </button>
              ))}
            </div>

            {selectedTemplate && (
              <div className="bg-card border border-border rounded-xl p-4">
                <h4 className="text-xs font-bold text-foreground mb-2">Campos Esperados no Arquivo</h4>
                <div className="flex flex-wrap gap-1.5">
                  {IMPORT_TEMPLATES.find(t => t.id === selectedTemplate)?.fields.map((field, i) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] font-mono bg-muted rounded-md text-foreground">{field}</span>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <button className="px-3 py-1.5 text-[10px] font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20">
                    Baixar Template CSV
                  </button>
                  <button className="px-3 py-1.5 text-[10px] font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg hover:bg-blue-500/20">
                    Baixar Template XLSX
                  </button>
                </div>
              </div>
            )}

            <div onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all">
              <div className="w-12 h-12 mx-auto rounded-full bg-cyan-500/10 flex items-center justify-center text-2xl mb-2">📁</div>
              <p className="text-sm font-medium text-foreground">Arraste ou clique para enviar arquivo</p>
              <p className="text-xs text-muted-foreground mt-1">CSV, XLSX, XLS — Máximo 50MB / 100.000 registros</p>
            </div>
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx,.xls" className="hidden" />

            {isImporting && (
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-foreground">Importando dados...</p>
                  <p className="text-xs text-cyan-400 font-bold">{importProgress}%</p>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full transition-all duration-300" style={{ width: `${importProgress}%` }} />
                </div>
                <div className="mt-2 text-[10px] text-muted-foreground">
                  Validando CPFs... Verificando duplicatas... Inserindo registros...
                </div>
              </div>
            )}

            <button onClick={handleImport} disabled={!selectedTemplate || isImporting}
              className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm transition-all disabled:opacity-50">
              {isImporting ? 'Importando...' : '📥 Iniciar Importação'}
            </button>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-foreground">Histórico de Importações</h3>
            {DEMO_IMPORT_LOGS.map(log => (
              <div key={log.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-foreground">{log.fileName}</p>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${log.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' : log.status === 'partial' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'}`}>
                    {log.status === 'success' ? 'Sucesso' : log.status === 'partial' ? 'Parcial' : 'Erro'}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground mb-2">{log.date.toLocaleDateString('pt-BR')}</p>
                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center"><p className="text-[10px] text-muted-foreground">Total</p><p className="text-xs font-bold text-foreground">{log.totalRecords.toLocaleString()}</p></div>
                  <div className="text-center"><p className="text-[10px] text-muted-foreground">Importados</p><p className="text-xs font-bold text-emerald-400">{log.imported.toLocaleString()}</p></div>
                  <div className="text-center"><p className="text-[10px] text-muted-foreground">Erros</p><p className="text-xs font-bold text-red-400">{log.errors}</p></div>
                  <div className="text-center"><p className="text-[10px] text-muted-foreground">Duplicatas</p><p className="text-xs font-bold text-amber-400">{log.duplicates}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Tab */}
      {activeTab === 'export' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-foreground">Selecione os Módulos para Exportar</h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Formato:</span>
              {(['csv', 'xlsx', 'json', 'xml'] as const).map(fmt => (
                <button key={fmt} onClick={() => setExportFormat(fmt)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border transition-all ${exportFormat === fmt ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-muted text-muted-foreground border-border'}`}>
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {EXPORT_MODULES.map(mod => (
              <button key={mod.id} onClick={() => toggleExport(mod.id)}
                className={`text-left p-4 rounded-xl border transition-all ${selectedExports.includes(mod.id) ? 'bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/20' : 'bg-card border-border hover:bg-muted/50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{mod.icon}</span>
                  <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${selectedExports.includes(mod.id) ? 'bg-blue-500 border-blue-500' : 'border-border'}`}>
                    {selectedExports.includes(mod.id) && <span className="text-white text-xs">✓</span>}
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground">{mod.name}</p>
                <p className="text-[10px] text-muted-foreground">{mod.description}</p>
                <p className="text-[10px] text-blue-400 mt-1">{mod.size}</p>
              </button>
            ))}
          </div>
          <button disabled={selectedExports.length === 0}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm transition-all disabled:opacity-50">
            📤 Exportar {selectedExports.length} módulo(s) em {exportFormat.toUpperCase()}
          </button>
        </div>
      )}

      {/* Backup Tab */}
      {activeTab === 'backup' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-bold text-foreground mb-4">Configuração de Backup Automático</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block">Frequência</label>
                  <div className="flex gap-2">
                    {(['daily', 'weekly', 'monthly'] as const).map(freq => (
                      <button key={freq} onClick={() => setBackupSchedule(freq)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${backupSchedule === freq ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-muted text-muted-foreground border-border'}`}>
                        {freq === 'daily' ? 'Diário' : freq === 'weekly' ? 'Semanal' : 'Mensal'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block">Horário do Backup</label>
                  <input type="time" defaultValue="03:00" className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground" />
                  <p className="text-[10px] text-muted-foreground mt-1">Recomendado: horário de menor uso do sistema</p>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-foreground">Criptografia AES-256</p>
                    <p className="text-[10px] text-muted-foreground">Protege dados sensíveis no backup</p>
                  </div>
                  <button onClick={() => setEncryptBackup(!encryptBackup)}
                    className={`w-10 h-5 rounded-full transition-all ${encryptBackup ? 'bg-emerald-500' : 'bg-muted-foreground/30'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-all ${encryptBackup ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-2 block">Destino do Backup</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                      <span className="text-sm">☁️</span>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground">Google Cloud Storage</p>
                        <p className="text-[10px] text-muted-foreground">gs://medfocus-backups/ — Primário</p>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold">Ativo</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 bg-muted/50 border border-border rounded-lg">
                      <span className="text-sm">💾</span>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-foreground">Download Local</p>
                        <p className="text-[10px] text-muted-foreground">Backup manual sob demanda</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground">Disponível</span>
                    </div>
                  </div>
                </div>
                <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all">
                  💾 Salvar Configuração de Backup
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Histórico de Backups</h3>
              <button className="px-3 py-1.5 text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg hover:bg-cyan-500/20">
                Backup Manual Agora
              </button>
            </div>
            {DEMO_BACKUPS.map(backup => (
              <div key={backup.id} className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${backup.type === 'full' ? 'bg-emerald-500/10 text-emerald-400' : backup.type === 'incremental' ? 'bg-blue-500/10 text-blue-400' : 'bg-violet-500/10 text-violet-400'}`}>
                      {backup.type === 'full' ? 'Completo' : backup.type === 'incremental' ? 'Incremental' : 'Manual'}
                    </span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${backup.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {backup.status === 'completed' ? '✓ Concluído' : 'Em andamento'}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-foreground">{backup.size}</p>
                </div>
                <p className="text-[10px] text-muted-foreground">{backup.date.toLocaleString('pt-BR')}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Módulos: {backup.modules.join(', ')}</p>
                <div className="flex gap-2 mt-2">
                  <button className="px-2 py-1 text-[10px] font-medium bg-muted text-foreground rounded-lg hover:bg-muted/80">Restaurar</button>
                  <button className="px-2 py-1 text-[10px] font-medium bg-muted text-foreground rounded-lg hover:bg-muted/80">Download</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* LGPD Tab */}
      {activeTab === 'lgpd' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Portabilidade de Dados — LGPD Art. 18</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Conforme a Lei Geral de Proteção de Dados (Lei 13.709/2018), o titular dos dados tem direito à portabilidade 
              de seus dados a outro fornecedor de serviço. O MedFocus garante este direito de forma simples e transparente.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Exportação de Dados do Paciente', description: 'Gerar pacote completo com todos os dados de um paciente específico (prontuário, exames, prescrições, agendamentos)', action: 'Exportar Dados do Paciente', icon: '👤' },
                { title: 'Exclusão de Dados (Art. 18, VI)', description: 'Solicitar a exclusão completa dos dados pessoais de um paciente, conforme direito ao esquecimento da LGPD', action: 'Solicitar Exclusão', icon: '🗑️' },
                { title: 'Relatório de Tratamento de Dados', description: 'Gerar relatório completo de como os dados do paciente são tratados, armazenados e compartilhados', action: 'Gerar Relatório', icon: '📊' },
                { title: 'Consentimento e Termos', description: 'Gerenciar termos de consentimento assinados pelos pacientes para tratamento de dados pessoais e sensíveis', action: 'Gerenciar Consentimentos', icon: '✍️' },
              ].map((item, i) => (
                <div key={i} className="bg-muted/30 border border-border/50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{item.icon}</span>
                    <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                  <button className="px-3 py-1.5 text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20">
                    {item.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-sm font-bold text-foreground mb-3">Registro de Atividades de Tratamento (ROPA)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Atividade</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Base Legal</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Dados Tratados</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Retenção</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { activity: 'Cadastro de Pacientes', legal: 'Art. 7, V — Execução de contrato', data: 'Nome, CPF, endereço, telefone', retention: '5 anos após último atendimento' },
                    { activity: 'Prontuário Eletrônico', legal: 'Art. 7, VIII — Tutela da saúde', data: 'Dados de saúde (sensíveis)', retention: '20 anos (CFM 1.821/2007)' },
                    { activity: 'Faturamento e NFS-e', legal: 'Art. 7, II — Obrigação legal', data: 'CPF, valores, serviços', retention: '5 anos (CTN Art. 173)' },
                    { activity: 'Comunicação WhatsApp', legal: 'Art. 7, I — Consentimento', data: 'Telefone, mensagens', retention: 'Até revogação do consentimento' },
                    { activity: 'Marketing (ViralGram)', legal: 'Art. 7, I — Consentimento', data: 'Imagem, depoimentos', retention: 'Até revogação do consentimento' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-2 text-foreground font-medium">{row.activity}</td>
                      <td className="py-2 text-muted-foreground">{row.legal}</td>
                      <td className="py-2 text-muted-foreground">{row.data}</td>
                      <td className="py-2 text-muted-foreground">{row.retention}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportacaoBackup;
