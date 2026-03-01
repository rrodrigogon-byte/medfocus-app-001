/**
 * MedFocus — WhatsApp Business Integration (Sprint 17)
 * 
 * Módulo nativo de integração com WhatsApp Business API para
 * comunicação profissional com pacientes, agendamentos e lembretes.
 * 
 * APIs:
 * - WhatsApp Business Cloud API (Meta)
 * - Webhooks para recebimento de mensagens
 * - Templates de mensagem aprovados pelo Meta
 * 
 * Compliance:
 * - Res. CFM 2.336/2023 (Publicidade Médica)
 * - Res. CFM 2.314/2022 (Telemedicina)
 * - LGPD (Lei 13.709/2018) — Dados sensíveis de saúde
 * - Não é permitido diagnóstico ou prescrição via WhatsApp
 */

import React, { useState, useRef, useEffect } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

type StatusConexao = 'desconectado' | 'conectando' | 'conectado' | 'erro';
type TipoMensagem = 'texto' | 'template' | 'imagem' | 'documento' | 'audio';
type CategoriaTemplate = 'agendamento' | 'lembrete' | 'resultado' | 'orientacao' | 'marketing';

interface Conversa {
  id: string;
  paciente: string;
  telefone: string;
  ultimaMensagem: string;
  timestamp: Date;
  naoLidas: number;
  status: 'ativa' | 'aguardando' | 'encerrada';
}

interface Mensagem {
  id: string;
  remetente: 'clinica' | 'paciente';
  conteudo: string;
  tipo: TipoMensagem;
  timestamp: Date;
  status: 'enviada' | 'entregue' | 'lida' | 'erro';
}

interface TemplateWA {
  id: string;
  nome: string;
  categoria: CategoriaTemplate;
  conteudo: string;
  variaveis: string[];
  aprovado: boolean;
  lgpdCompliant: boolean;
}

// Templates pré-aprovados (conformes com CFM e LGPD)
const TEMPLATES_WHATSAPP: TemplateWA[] = [
  {
    id: 'tpl-001', nome: 'Confirmação de Consulta', categoria: 'agendamento',
    conteudo: 'Olá {{nome}}! Sua consulta está confirmada para {{data}} às {{hora}} com {{medico}}. Local: {{endereco}}. Para remarcar, responda esta mensagem. Att, {{clinica}}.',
    variaveis: ['nome', 'data', 'hora', 'medico', 'endereco', 'clinica'], aprovado: true, lgpdCompliant: true,
  },
  {
    id: 'tpl-002', nome: 'Lembrete de Consulta (24h)', categoria: 'lembrete',
    conteudo: 'Olá {{nome}}! Lembramos que sua consulta é amanhã, {{data}} às {{hora}}. Por favor, traga seus exames recentes. Caso precise remarcar, entre em contato. {{clinica}}.',
    variaveis: ['nome', 'data', 'hora', 'clinica'], aprovado: true, lgpdCompliant: true,
  },
  {
    id: 'tpl-003', nome: 'Resultado Disponível', categoria: 'resultado',
    conteudo: 'Olá {{nome}}! Informamos que seus resultados de exames estão disponíveis. Para retirá-los, compareça à clínica com documento de identificação ou acesse nosso portal. {{clinica}}.',
    variaveis: ['nome', 'clinica'], aprovado: true, lgpdCompliant: true,
  },
  {
    id: 'tpl-004', nome: 'Orientação Pós-Consulta', categoria: 'orientacao',
    conteudo: 'Olá {{nome}}! Seguem as orientações discutidas na sua consulta de hoje:\n\n{{orientacoes}}\n\nEm caso de dúvidas, entre em contato. Lembre-se: este canal não substitui atendimento presencial em emergências. {{clinica}}.',
    variaveis: ['nome', 'orientacoes', 'clinica'], aprovado: true, lgpdCompliant: true,
  },
  {
    id: 'tpl-005', nome: 'Lembrete de Retorno', categoria: 'lembrete',
    conteudo: 'Olá {{nome}}! Sua consulta de retorno está prevista para {{data}}. Gostaria de confirmar o agendamento? Responda SIM para confirmar ou NÃO para remarcar. {{clinica}}.',
    variaveis: ['nome', 'data', 'clinica'], aprovado: true, lgpdCompliant: true,
  },
  {
    id: 'tpl-006', nome: 'Pesquisa de Satisfação', categoria: 'marketing',
    conteudo: 'Olá {{nome}}! Como foi sua experiência em nossa clínica? De 1 a 5, qual nota você daria ao atendimento? Sua opinião é muito importante para nós. {{clinica}}.',
    variaveis: ['nome', 'clinica'], aprovado: true, lgpdCompliant: true,
  },
];

export function VGWhatsApp() {
  const [tela, setTela] = useState<'conversas' | 'templates' | 'broadcast' | 'config' | 'compliance'>('conversas');
  const [statusConexao, setStatusConexao] = useState<StatusConexao>('desconectado');
  const [conversaSelecionada, setConversaSelecionada] = useState<string | null>(null);
  const [mensagemInput, setMensagemInput] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  // Dados simulados
  const conversas: Conversa[] = [
    { id: '1', paciente: 'Maria Silva', telefone: '+55 11 9xxxx-1234', ultimaMensagem: 'Ok, obrigada pela confirmação!', timestamp: new Date('2026-03-01T10:30:00'), naoLidas: 0, status: 'ativa' },
    { id: '2', paciente: 'João Santos', telefone: '+55 11 9xxxx-5678', ultimaMensagem: 'Posso remarcar para sexta?', timestamp: new Date('2026-03-01T09:15:00'), naoLidas: 1, status: 'aguardando' },
    { id: '3', paciente: 'Ana Oliveira', telefone: '+55 11 9xxxx-9012', ultimaMensagem: 'Recebi os resultados, obrigada!', timestamp: new Date('2026-02-28T16:45:00'), naoLidas: 0, status: 'ativa' },
    { id: '4', paciente: 'Carlos Pereira', telefone: '+55 11 9xxxx-3456', ultimaMensagem: 'Qual horário tem disponível?', timestamp: new Date('2026-02-28T14:20:00'), naoLidas: 2, status: 'aguardando' },
  ];

  const mensagensExemplo: Mensagem[] = [
    { id: 'm1', remetente: 'clinica', conteudo: 'Olá Maria! Sua consulta está confirmada para 01/03/2026 às 14:00 com Dr. Rodrigo. Local: Rua das Flores, 123. Para remarcar, responda esta mensagem.', tipo: 'template', timestamp: new Date('2026-03-01T08:00:00'), status: 'lida' },
    { id: 'm2', remetente: 'paciente', conteudo: 'Ok, obrigada pela confirmação! Estarei lá.', tipo: 'texto', timestamp: new Date('2026-03-01T10:30:00'), status: 'lida' },
    { id: 'm3', remetente: 'clinica', conteudo: 'Perfeito! Lembramos de trazer seus exames recentes. Até amanhã!', tipo: 'texto', timestamp: new Date('2026-03-01T10:35:00'), status: 'entregue' },
  ];

  const handleConectar = () => {
    setStatusConexao('conectando');
    setTimeout(() => setStatusConexao('conectado'), 2000);
  };

  const handleEnviarMensagem = () => {
    if (!mensagemInput.trim()) return;
    setMensagemInput('');
  };

  const stats = [
    { label: 'Mensagens Hoje', valor: '47', cor: 'text-green-400' },
    { label: 'Conversas Ativas', valor: '12', cor: 'text-blue-400' },
    { label: 'Taxa de Resposta', valor: '94%', cor: 'text-purple-400' },
    { label: 'Tempo Médio', valor: '8min', cor: 'text-cyan-400' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto">
      <EducationalDisclaimer variant="banner" moduleName="WhatsApp Business Integration" />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <span className="text-3xl">💬</span> WhatsApp Business
          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-medium">Meta Cloud API</span>
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
            statusConexao === 'conectado' ? 'bg-green-500/20 text-green-400' :
            statusConexao === 'conectando' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {statusConexao === 'conectado' ? '● Conectado' : statusConexao === 'conectando' ? '◌ Conectando...' : '○ Desconectado'}
          </span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Comunicação profissional com pacientes — Agendamentos, lembretes e orientações (LGPD Compliant)
        </p>
      </div>

      {/* Alerta CFM */}
      <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 mb-6">
        <h4 className="font-bold text-sm text-red-400 flex items-center gap-2">🚫 ATENÇÃO — Regras CFM para WhatsApp</h4>
        <div className="grid md:grid-cols-3 gap-3 mt-2 text-xs text-foreground/70">
          <div>• <strong>PROIBIDO:</strong> Diagnóstico via WhatsApp</div>
          <div>• <strong>PROIBIDO:</strong> Prescrição via WhatsApp</div>
          <div>• <strong>PROIBIDO:</strong> Enviar dados sensíveis sem consentimento</div>
          <div>• <strong>PERMITIDO:</strong> Agendamentos e confirmações</div>
          <div>• <strong>PERMITIDO:</strong> Lembretes de consulta</div>
          <div>• <strong>PERMITIDO:</strong> Orientações gerais pós-consulta</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { id: 'conversas' as const, label: '💬 Conversas' },
          { id: 'templates' as const, label: '📋 Templates' },
          { id: 'broadcast' as const, label: '📢 Broadcast' },
          { id: 'compliance' as const, label: '🛡️ Compliance' },
          { id: 'config' as const, label: '⚙️ Config' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTela(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
              tela === tab.id ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-card border border-border hover:bg-accent'
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      {statusConexao === 'conectado' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {stats.map((s, i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
              <p className={`text-xl font-bold ${s.cor}`}>{s.valor}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Conversas */}
      {tela === 'conversas' && (
        <div className="space-y-6">
          {statusConexao !== 'conectado' ? (
            <div className="bg-gradient-to-r from-green-500/10 to-green-700/10 border-2 border-green-500/30 rounded-2xl p-8 text-center">
              <p className="text-4xl mb-4">💬</p>
              <h3 className="text-xl font-bold mb-2">Conecte o WhatsApp Business</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
                Conecte sua conta WhatsApp Business para gerenciar comunicação com pacientes de forma profissional e segura.
              </p>
              <button onClick={handleConectar}
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-lg">
                {statusConexao === 'conectando' ? '⏳ Conectando...' : '🔗 Conectar WhatsApp Business API'}
              </button>
              <p className="text-xs text-muted-foreground mt-3">Requer conta Meta Business verificada + número WhatsApp Business</p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-4 h-[500px]">
              {/* Lista de Conversas */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-3 border-b border-border">
                  <input type="text" placeholder="Buscar paciente..."
                    className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs focus:border-primary focus:outline-none" />
                </div>
                <div className="overflow-y-auto h-[440px]">
                  {conversas.map(conv => (
                    <button key={conv.id} onClick={() => setConversaSelecionada(conv.id)}
                      className={`w-full text-left p-3 border-b border-border/50 hover:bg-accent transition ${
                        conversaSelecionada === conv.id ? 'bg-accent' : ''
                      }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center text-sm">👤</div>
                          <div>
                            <p className="text-sm font-medium">{conv.paciente}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[180px]">{conv.ultimaMensagem}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-muted-foreground">{conv.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                          {conv.naoLidas > 0 && (
                            <span className="inline-block w-5 h-5 bg-green-500 text-white text-[10px] rounded-full text-center leading-5 mt-1">{conv.naoLidas}</span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat */}
              <div className="lg:col-span-2 bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                {conversaSelecionada ? (
                  <>
                    <div className="p-3 border-b border-border flex items-center gap-3 bg-green-500/5">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">👤</div>
                      <div>
                        <p className="text-sm font-medium">{conversas.find(c => c.id === conversaSelecionada)?.paciente}</p>
                        <p className="text-[10px] text-muted-foreground">{conversas.find(c => c.id === conversaSelecionada)?.telefone}</p>
                      </div>
                    </div>
                    <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                      {mensagensExemplo.map(msg => (
                        <div key={msg.id} className={`flex ${msg.remetente === 'clinica' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                            msg.remetente === 'clinica'
                              ? 'bg-green-500/20 text-foreground rounded-br-sm'
                              : 'bg-muted/50 text-foreground rounded-bl-sm'
                          }`}>
                            <p className="text-sm leading-relaxed">{msg.conteudo}</p>
                            <div className="flex items-center justify-end gap-1 mt-1">
                              <p className="text-[10px] opacity-50">{msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                              {msg.remetente === 'clinica' && (
                                <span className="text-[10px]">{msg.status === 'lida' ? '✓✓' : msg.status === 'entregue' ? '✓✓' : '✓'}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border p-3 flex gap-2">
                      <input type="text" value={mensagemInput} onChange={e => setMensagemInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleEnviarMensagem()}
                        placeholder="Digite uma mensagem..."
                        className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm focus:border-primary focus:outline-none" />
                      <button onClick={handleEnviarMensagem}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition">
                        Enviar
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div>
                      <p className="text-4xl mb-3">💬</p>
                      <p className="text-muted-foreground">Selecione uma conversa</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Templates */}
      {tela === 'templates' && (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-bold mb-2">📋 Templates de Mensagem (Aprovados pelo Meta)</h3>
            <p className="text-xs text-muted-foreground">Templates pré-aprovados e conformes com CFM e LGPD para comunicação profissional.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {TEMPLATES_WHATSAPP.map(tpl => (
              <div key={tpl.id} className="bg-card border border-border rounded-xl p-5 hover:border-green-500/30 transition">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-sm">{tpl.nome}</h4>
                  <div className="flex gap-1">
                    {tpl.aprovado && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded">Aprovado</span>}
                    {tpl.lgpdCompliant && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">LGPD ✓</span>}
                  </div>
                </div>
                <div className="bg-green-500/5 rounded-lg p-3 mb-3">
                  <p className="text-xs text-foreground/70 leading-relaxed">{tpl.conteudo}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {tpl.variaveis.map(v => (
                      <span key={v} className="text-[10px] bg-muted/50 px-1.5 py-0.5 rounded font-mono">{`{{${v}}}`}</span>
                    ))}
                  </div>
                  <button className="text-xs text-green-400 hover:text-green-300 font-medium">Usar →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Broadcast */}
      {tela === 'broadcast' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">📢 Envio em Massa (Broadcast)</h3>
            <p className="text-xs text-muted-foreground mb-4">Envie mensagens para múltiplos pacientes usando templates aprovados. Todos os envios respeitam a LGPD e exigem opt-in prévio.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Selecionar Template</label>
                <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none">
                  <option>Selecione um template...</option>
                  {TEMPLATES_WHATSAPP.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Destinatários</label>
                <select className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none">
                  <option>Todos os pacientes com opt-in (234)</option>
                  <option>Consultas da semana (18)</option>
                  <option>Retornos pendentes (42)</option>
                  <option>Aniversariantes do mês (12)</option>
                </select>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-xs text-yellow-400 font-medium">⚠️ Lembrete LGPD:</p>
                <p className="text-xs text-foreground/70">Apenas pacientes que deram consentimento explícito (opt-in) receberão mensagens. O paciente pode solicitar exclusão a qualquer momento.</p>
              </div>
              <button className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition">
                📢 Enviar Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compliance */}
      {tela === 'compliance' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">🛡️ Compliance WhatsApp — CFM + LGPD</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <h4 className="font-bold text-sm text-red-400 mb-3">🚫 PROIBIDO via WhatsApp</h4>
                <ul className="text-xs text-foreground/70 space-y-2">
                  <li>• Realizar diagnósticos médicos</li>
                  <li>• Emitir prescrições ou receitas</li>
                  <li>• Enviar resultados de exames sem consentimento</li>
                  <li>• Compartilhar dados de pacientes com terceiros</li>
                  <li>• Fazer propaganda de serviços com preços</li>
                  <li>• Enviar mensagens sem opt-in do paciente</li>
                  <li>• Armazenar dados sensíveis sem criptografia</li>
                </ul>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <h4 className="font-bold text-sm text-green-400 mb-3">✅ PERMITIDO via WhatsApp</h4>
                <ul className="text-xs text-foreground/70 space-y-2">
                  <li>• Confirmar e lembrar agendamentos</li>
                  <li>• Enviar orientações gerais pós-consulta</li>
                  <li>• Informar sobre disponibilidade de resultados</li>
                  <li>• Pesquisas de satisfação</li>
                  <li>• Informações institucionais (horários, endereço)</li>
                  <li>• Lembretes de retorno e acompanhamento</li>
                  <li>• Conteúdo educacional em saúde</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">📋 Checklist LGPD para WhatsApp</h3>
            <div className="space-y-3">
              {[
                { item: 'Consentimento explícito (opt-in) coletado', status: true },
                { item: 'Política de privacidade disponível', status: true },
                { item: 'Canal de exclusão (opt-out) ativo', status: true },
                { item: 'Dados criptografados em trânsito e repouso', status: true },
                { item: 'DPO (Encarregado de Dados) designado', status: false },
                { item: 'Registro de operações de tratamento', status: true },
                { item: 'Relatório de Impacto à Proteção de Dados (RIPD)', status: false },
              ].map((check, i) => (
                <div key={i} className="flex items-center gap-3 bg-background/50 rounded-lg p-3">
                  <span className={`text-sm ${check.status ? 'text-green-400' : 'text-red-400'}`}>
                    {check.status ? '✅' : '❌'}
                  </span>
                  <p className="text-xs text-foreground/80">{check.item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Config */}
      {tela === 'config' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-bold mb-4">⚙️ Configuração WhatsApp Business Cloud API</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">WhatsApp Business Account ID</label>
                <input type="text" placeholder="Seu WABA ID..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Phone Number ID</label>
                <input type="text" placeholder="ID do número de telefone..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Access Token (Permanent)</label>
                <input type="password" placeholder="Token de acesso permanente..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Webhook Verify Token</label>
                <input type="text" placeholder="Token de verificação do webhook..."
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none" />
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Webhook URL</label>
                <input type="text" value="https://medfocus-app-969630653332.southamerica-east1.run.app/api/whatsapp/webhook" readOnly
                  className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground" />
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-xs text-green-400 font-medium mb-1">Webhook Events:</p>
                <p className="text-xs text-foreground/70">messages, message_deliveries, message_reads, message_reactions</p>
              </div>
              <button className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition">
                💾 Salvar Configuração
              </button>
            </div>
          </div>

          {/* QR Code */}
          <div className="bg-card border border-border rounded-xl p-6 text-center">
            <h3 className="font-bold mb-4">📱 QR Code para Ativação</h3>
            <div className="w-48 h-48 bg-muted/30 rounded-xl mx-auto flex items-center justify-center border-2 border-dashed border-border">
              <div className="text-center">
                <p className="text-4xl mb-2">📱</p>
                <p className="text-xs text-muted-foreground">QR Code será gerado após configuração</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Escaneie com o WhatsApp Business para vincular o número</p>
          </div>
        </div>
      )}

      <EducationalDisclaimer variant="footer" />
    </div>
  );
}
