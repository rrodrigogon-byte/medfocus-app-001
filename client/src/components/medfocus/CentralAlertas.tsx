/**
 * MedFocus — Central de Notificações Inteligentes e Alertas Clínicos (Sprint 24)
 * 
 * Sistema centralizado de alertas e notificações:
 * - Alertas de interações medicamentosas
 * - Lembretes de exames e retornos
 * - Alertas de valores críticos de exames
 * - Notificações de guidelines atualizados
 * - Alertas de vacinas pendentes
 * - Integração com todos os módulos do MedFocus
 * 
 * DISCLAIMER: Ferramenta exclusivamente educacional e de apoio ao estudo.
 */

import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type PrioridadeAlerta = 'critica' | 'alta' | 'media' | 'baixa' | 'info';
type CategoriaAlerta = 'interacao' | 'exame' | 'retorno' | 'guideline' | 'vacina' | 'valor-critico' | 'alergia' | 'protocolo' | 'sistema';

interface Alerta {
  id: string;
  dataHora: Date;
  prioridade: PrioridadeAlerta;
  categoria: CategoriaAlerta;
  titulo: string;
  descricao: string;
  paciente?: string;
  acao?: string;
  lido: boolean;
  referencia?: string;
}

const ALERTAS_DEMO: Alerta[] = [
  {
    id: 'al-001', dataHora: new Date('2026-03-01T08:30:00'), prioridade: 'critica', categoria: 'interacao',
    titulo: 'Interação Grave: Metformina + Contraste Iodado',
    descricao: 'Paciente João Carlos Silva (58a) tem exame com contraste agendado para 03/03. A Metformina deve ser suspensa 48h antes e 48h após o procedimento pelo risco de acidose lática.',
    paciente: 'João Carlos Silva', acao: 'Suspender Metformina 48h antes do exame', lido: false,
    referencia: 'ACR Manual on Contrast Media 2024'
  },
  {
    id: 'al-002', dataHora: new Date('2026-03-01T08:00:00'), prioridade: 'critica', categoria: 'alergia',
    titulo: 'ALERGIA: Contraste Iodado — Anafilaxia',
    descricao: 'Paciente João Carlos Silva possui alergia GRAVE a contraste iodado (anafilaxia prévia). Exame com contraste agendado requer pré-medicação obrigatória ou substituição por método sem contraste.',
    paciente: 'João Carlos Silva', acao: 'Protocolo de pré-medicação ou substituir exame', lido: false,
    referencia: 'ACR Guidelines on Contrast Media Reactions'
  },
  {
    id: 'al-003', dataHora: new Date('2026-02-28T14:00:00'), prioridade: 'alta', categoria: 'valor-critico',
    titulo: 'Potássio Sérico: 5.8 mEq/L (ALTO)',
    descricao: 'Resultado de potássio acima do limite superior (ref: 3.5-5.0 mEq/L). Paciente em uso de Losartana + Espironolactona. Risco de hipercalemia.',
    paciente: 'Maria Fernanda Santos', acao: 'Reavaliar medicações e repetir exame', lido: false,
    referencia: 'KDIGO 2024 — Electrolyte Management'
  },
  {
    id: 'al-004', dataHora: new Date('2026-02-28T10:00:00'), prioridade: 'alta', categoria: 'exame',
    titulo: 'Exames Pendentes — HbA1c Trimestral',
    descricao: 'Paciente João Carlos Silva está há 4 meses sem dosagem de HbA1c. A meta é avaliação trimestral até atingir controle glicêmico adequado.',
    paciente: 'João Carlos Silva', acao: 'Solicitar HbA1c e glicemia de jejum', lido: true,
    referencia: 'ADA Standards of Care 2025'
  },
  {
    id: 'al-005', dataHora: new Date('2026-02-27T16:00:00'), prioridade: 'media', categoria: 'retorno',
    titulo: 'Retorno Agendado — Cardiologia',
    descricao: 'Paciente João Carlos Silva tem retorno agendado para 15/03/2026 com Dr. Ricardo Mendes. Última consulta: 28/02/2026.',
    paciente: 'João Carlos Silva', lido: true
  },
  {
    id: 'al-006', dataHora: new Date('2026-02-27T09:00:00'), prioridade: 'media', categoria: 'guideline',
    titulo: 'Atualização: ESC 2026 — Novas Diretrizes de HAS',
    descricao: 'A European Society of Cardiology publicou novas diretrizes para manejo da Hipertensão Arterial. Principais mudanças: meta de PA < 130/80 mmHg para todos os pacientes de alto risco.',
    acao: 'Revisar protocolos de HAS', lido: false,
    referencia: 'ESC Guidelines 2026'
  },
  {
    id: 'al-007', dataHora: new Date('2026-02-26T11:00:00'), prioridade: 'media', categoria: 'vacina',
    titulo: 'Vacina Pendente — Pneumococo (PCV23)',
    descricao: 'Paciente João Carlos Silva (58a, DM2) não possui registro de vacinação contra pneumococo. Recomendação: PCV13 seguida de PPSV23 após 8 semanas.',
    paciente: 'João Carlos Silva', acao: 'Prescrever esquema vacinal pneumocócico', lido: true,
    referencia: 'PNI/MS 2025 — Calendário do Adulto'
  },
  {
    id: 'al-008', dataHora: new Date('2026-02-25T08:00:00'), prioridade: 'baixa', categoria: 'protocolo',
    titulo: 'Sugestão: Considerar iSGLT2 para Paciente com DM2 + HAS',
    descricao: 'Paciente João Carlos Silva apresenta DM2 + HAS + alto risco CV. Guidelines ADA 2025 e ESC 2023 recomendam iSGLT2 (empagliflozina ou dapagliflozina) como 2ª linha após metformina.',
    paciente: 'João Carlos Silva', acao: 'Avaliar adição de iSGLT2 ao esquema', lido: true,
    referencia: 'ADA 2025 + EMPA-REG OUTCOME + DECLARE-TIMI 58'
  },
  {
    id: 'al-009', dataHora: new Date('2026-02-24T14:00:00'), prioridade: 'info', categoria: 'sistema',
    titulo: 'Novo Módulo: Evidence-Based Medicine Hub',
    descricao: 'O MedFocus agora conta com o Evidence-Based Medicine Hub, com 12+ estudos clínicos validados, busca PubMed em tempo real e calculadora NNT.',
    lido: true
  },
  {
    id: 'al-010', dataHora: new Date('2026-02-23T10:00:00'), prioridade: 'info', categoria: 'sistema',
    titulo: 'Atualização: Base de Interações Medicamentosas',
    descricao: 'A base de dados de interações medicamentosas (OpenFDA) foi atualizada com 15.000+ novas interações catalogadas.',
    lido: true
  },
];

export function CentralAlertas() {
  const [filtro, setFiltro] = useState<'todos' | PrioridadeAlerta>('todos');
  const [filtroCat, setFiltroCat] = useState<'todos' | CategoriaAlerta>('todos');
  const [alertas, setAlertas] = useState(ALERTAS_DEMO);
  const [alertaSelecionado, setAlertaSelecionado] = useState<Alerta | null>(null);

  const marcarComoLido = (id: string) => {
    setAlertas(prev => prev.map(a => a.id === id ? { ...a, lido: true } : a));
  };

  const marcarTodosLidos = () => {
    setAlertas(prev => prev.map(a => ({ ...a, lido: true })));
  };

  const alertasFiltrados = alertas.filter(a => {
    const matchPrioridade = filtro === 'todos' || a.prioridade === filtro;
    const matchCategoria = filtroCat === 'todos' || a.categoria === filtroCat;
    return matchPrioridade && matchCategoria;
  });

  const naoLidos = alertas.filter(a => !a.lido).length;
  const criticos = alertas.filter(a => a.prioridade === 'critica' && !a.lido).length;

  const corPrioridade = (p: PrioridadeAlerta) => {
    switch (p) {
      case 'critica': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'alta': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'media': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'baixa': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'info': return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const iconeCategoria = (c: CategoriaAlerta) => {
    switch (c) {
      case 'interacao': return '💊';
      case 'exame': return '🧪';
      case 'retorno': return '📅';
      case 'guideline': return '📋';
      case 'vacina': return '💉';
      case 'valor-critico': return '🔴';
      case 'alergia': return '⚠️';
      case 'protocolo': return '🧬';
      case 'sistema': return '🔔';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="Central de Alertas Clínicos" />

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">🔔</span> Central de Notificações e Alertas
          {naoLidos > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full font-bold animate-pulse">{naoLidos} não lidos</span>
          )}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Alertas clínicos inteligentes, interações medicamentosas, exames pendentes e atualizações de guidelines
        </p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'Críticos', valor: criticos, cor: 'bg-red-500/20 text-red-400 border-red-500/30' },
          { label: 'Não Lidos', valor: naoLidos, cor: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
          { label: 'Interações', valor: alertas.filter(a => a.categoria === 'interacao').length, cor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
          { label: 'Exames', valor: alertas.filter(a => a.categoria === 'exame' || a.categoria === 'valor-critico').length, cor: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
          { label: 'Total', valor: alertas.length, cor: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
        ].map(s => (
          <div key={s.label} className={`${s.cor} border rounded-xl p-3 text-center`}>
            <p className="text-2xl font-bold">{s.valor}</p>
            <p className="text-[10px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-4 flex-wrap">
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground self-center mr-1">Prioridade:</span>
          {(['todos', 'critica', 'alta', 'media', 'baixa', 'info'] as const).map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition ${
                filtro === f ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'
              }`}>{f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
          ))}
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <span className="text-xs text-muted-foreground self-center mr-1">Categoria:</span>
          {(['todos', 'interacao', 'alergia', 'valor-critico', 'exame', 'retorno', 'guideline', 'vacina'] as const).map(f => (
            <button key={f} onClick={() => setFiltroCat(f)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition ${
                filtroCat === f ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'
              }`}>{f === 'todos' ? 'Todos' : f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}</button>
          ))}
        </div>
      </div>

      {naoLidos > 0 && (
        <button onClick={marcarTodosLidos} className="text-xs text-primary hover:underline mb-4 block">
          Marcar todos como lidos ({naoLidos})
        </button>
      )}

      {/* Lista de Alertas */}
      {!alertaSelecionado ? (
        <div className="space-y-3">
          {alertasFiltrados.map(alerta => (
            <div key={alerta.id} onClick={() => { setAlertaSelecionado(alerta); marcarComoLido(alerta.id); }}
              className={`bg-card border rounded-xl p-4 cursor-pointer transition hover:border-primary/50 ${
                !alerta.lido ? 'border-primary/30 bg-primary/5' : 'border-border'
              }`}>
              <div className="flex items-start gap-3">
                <span className="text-lg">{iconeCategoria(alerta.categoria)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${corPrioridade(alerta.prioridade)}`}>
                      {alerta.prioridade.toUpperCase()}
                    </span>
                    {!alerta.lido && <span className="w-2 h-2 rounded-full bg-primary" />}
                    <span className="text-[10px] text-muted-foreground">{alerta.dataHora.toLocaleString('pt-BR')}</span>
                  </div>
                  <h4 className="font-bold text-sm">{alerta.titulo}</h4>
                  <p className="text-xs text-foreground/60 mt-1 line-clamp-1">{alerta.descricao}</p>
                  {alerta.paciente && <p className="text-[10px] text-primary mt-1">Paciente: {alerta.paciente}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => setAlertaSelecionado(null)} className="text-sm text-primary hover:underline">← Voltar</button>
          <div className={`border-2 rounded-xl p-6 ${
            alertaSelecionado.prioridade === 'critica' ? 'border-red-500/50 bg-red-500/5' :
            alertaSelecionado.prioridade === 'alta' ? 'border-orange-500/50 bg-orange-500/5' : 'border-border bg-card'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{iconeCategoria(alertaSelecionado.categoria)}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${corPrioridade(alertaSelecionado.prioridade)}`}>
                    {alertaSelecionado.prioridade.toUpperCase()}
                  </span>
                  <span className="text-xs text-muted-foreground">{alertaSelecionado.dataHora.toLocaleString('pt-BR')}</span>
                </div>
                <h3 className="text-lg font-bold mt-1">{alertaSelecionado.titulo}</h3>
              </div>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{alertaSelecionado.descricao}</p>
            {alertaSelecionado.paciente && (
              <div className="mt-4 bg-background/50 rounded-lg p-3">
                <p className="text-xs"><strong>Paciente:</strong> {alertaSelecionado.paciente}</p>
              </div>
            )}
            {alertaSelecionado.acao && (
              <div className="mt-3 bg-primary/10 border border-primary/30 rounded-lg p-3">
                <p className="text-xs"><strong>Ação Recomendada:</strong> {alertaSelecionado.acao}</p>
              </div>
            )}
            {alertaSelecionado.referencia && (
              <div className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                <p className="text-xs text-blue-400"><strong>Referência:</strong> {alertaSelecionado.referencia}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
