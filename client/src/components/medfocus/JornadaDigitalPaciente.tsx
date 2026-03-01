import { useState } from 'react';
import { Smartphone, QrCode, MessageSquare, Star, FileText, Clock, Bell, CheckCircle, Users, TrendingUp, Calendar, Heart, Shield, Send, Download, Eye, BarChart3, Loader2, ChevronDown, ChevronUp, Clipboard, ThumbsUp, ThumbsDown, Meh } from 'lucide-react';
import EducationalDisclaimer from './EducationalDisclaimer';

// ==================== INTERFACES ====================
interface PatientJourney {
  id: string;
  name: string;
  phone: string;
  status: 'agendado' | 'checkin' | 'triagem' | 'atendimento' | 'pos-consulta';
  appointment: string;
  doctor: string;
  specialty: string;
  checkinTime?: string;
  triagemData?: TriagemData;
  npsScore?: number;
  npsComment?: string;
}

interface TriagemData {
  mainComplaint: string;
  painLevel: number;
  symptoms: string[];
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  oxygenSat?: number;
  urgencyLevel: 'verde' | 'amarelo' | 'laranja' | 'vermelho';
}

interface NPSResult {
  period: string;
  promoters: number;
  passives: number;
  detractors: number;
  score: number;
  totalResponses: number;
}

// ==================== MOCK DATA ====================
const DEMO_PATIENTS: PatientJourney[] = [
  {
    id: 'J001', name: 'Carlos Eduardo Lima', phone: '(11) 99876-5432', status: 'pos-consulta',
    appointment: '2026-03-01 08:00', doctor: 'Dr. Roberto Almeida', specialty: 'Cardiologia',
    checkinTime: '07:45', npsScore: 9, npsComment: 'Excelente atendimento, médico muito atencioso.',
    triagemData: { mainComplaint: 'Dor torácica aos esforços', painLevel: 5, symptoms: ['Dor torácica', 'Dispneia', 'Cansaço'], temperature: 36.5, bloodPressure: '150/95', heartRate: 88, oxygenSat: 96, urgencyLevel: 'laranja' }
  },
  {
    id: 'J002', name: 'Fernanda Costa Souza', phone: '(11) 98765-4321', status: 'atendimento',
    appointment: '2026-03-01 08:30', doctor: 'Dra. Ana Paula Santos', specialty: 'Endocrinologia',
    checkinTime: '08:20',
    triagemData: { mainComplaint: 'Controle de diabetes', painLevel: 0, symptoms: ['Poliúria', 'Sede excessiva'], temperature: 36.2, bloodPressure: '130/85', heartRate: 72, oxygenSat: 98, urgencyLevel: 'verde' }
  },
  {
    id: 'J003', name: 'Roberto Mendes Filho', phone: '(11) 97654-3210', status: 'triagem',
    appointment: '2026-03-01 09:00', doctor: 'Dr. Roberto Almeida', specialty: 'Cardiologia',
    checkinTime: '08:50',
    triagemData: { mainComplaint: 'Palpitações e tontura', painLevel: 3, symptoms: ['Palpitações', 'Tontura', 'Ansiedade'], urgencyLevel: 'amarelo' }
  },
  {
    id: 'J004', name: 'Mariana Oliveira', phone: '(11) 96543-2109', status: 'checkin',
    appointment: '2026-03-01 09:30', doctor: 'Dra. Ana Paula Santos', specialty: 'Endocrinologia',
    checkinTime: '09:15'
  },
  {
    id: 'J005', name: 'Pedro Augusto Reis', phone: '(11) 95432-1098', status: 'agendado',
    appointment: '2026-03-01 10:00', doctor: 'Dr. Roberto Almeida', specialty: 'Cardiologia'
  },
  {
    id: 'J006', name: 'Lucia Helena Martins', phone: '(11) 94321-0987', status: 'agendado',
    appointment: '2026-03-01 10:30', doctor: 'Dra. Ana Paula Santos', specialty: 'Endocrinologia'
  },
];

const NPS_HISTORY: NPSResult[] = [
  { period: 'Fev/2026', promoters: 68, passives: 22, detractors: 10, score: 58, totalResponses: 145 },
  { period: 'Jan/2026', promoters: 62, passives: 25, detractors: 13, score: 49, totalResponses: 132 },
  { period: 'Dez/2025', promoters: 70, passives: 20, detractors: 10, score: 60, totalResponses: 128 },
  { period: 'Nov/2025', promoters: 65, passives: 23, detractors: 12, score: 53, totalResponses: 140 },
];

const WHATSAPP_TEMPLATES = [
  { id: 'confirm', name: 'Confirmação de Consulta', message: 'Olá {nome}! Sua consulta com {medico} está agendada para {data} às {hora}. Confirme respondendo SIM ou reagende respondendo NÃO. MedFocus Clínica.' },
  { id: 'reminder', name: 'Lembrete 24h', message: 'Olá {nome}! Lembramos que sua consulta com {medico} é amanhã, {data} às {hora}. Chegue 15 min antes para check-in digital. MedFocus Clínica.' },
  { id: 'checkin', name: 'Check-in Digital', message: 'Olá {nome}! Bem-vindo(a) à MedFocus Clínica. Faça seu check-in digital acessando: {link_checkin}. Ou escaneie o QR Code na recepção. Bom atendimento!' },
  { id: 'pos_consulta', name: 'Pós-Consulta', message: 'Olá {nome}! Esperamos que seu atendimento tenha sido excelente. Suas orientações médicas estão disponíveis em: {link_portal}. Cuide-se!' },
  { id: 'nps', name: 'Pesquisa NPS', message: 'Olá {nome}! De 0 a 10, quanto você recomendaria a MedFocus Clínica? Responda com o número. Sua opinião é muito importante!' },
  { id: 'retorno', name: 'Lembrete de Retorno', message: 'Olá {nome}! Faz {dias} dias desde sua última consulta. Que tal agendar seu retorno com {medico}? Acesse: {link_agendamento}. MedFocus Clínica.' },
  { id: 'exames', name: 'Lembrete de Exames', message: 'Olá {nome}! Lembrete: você tem exames pendentes solicitados pelo(a) {medico}. Não esqueça de realizá-los antes do retorno. MedFocus Clínica.' },
];

// ==================== COMPONENT ====================
export default function JornadaDigitalPaciente() {
  const [activeTab, setActiveTab] = useState<'painel' | 'checkin' | 'portal' | 'whatsapp' | 'nps'>('painel');
  const [selectedPatient, setSelectedPatient] = useState<PatientJourney | null>(null);
  const [showTemplateDetail, setShowTemplateDetail] = useState<string | null>(null);
  const [sendingMessage, setSendingMessage] = useState<string | null>(null);
  const [expandedNPS, setExpandedNPS] = useState(false);

  const statusConfig = {
    'agendado': { label: 'Agendado', color: 'gray', icon: Calendar },
    'checkin': { label: 'Check-in', color: 'blue', icon: QrCode },
    'triagem': { label: 'Triagem', color: 'yellow', icon: Clipboard },
    'atendimento': { label: 'Em Atendimento', color: 'green', icon: Heart },
    'pos-consulta': { label: 'Pós-Consulta', color: 'purple', icon: CheckCircle },
  };

  const urgencyConfig = {
    'verde': { label: 'Não Urgente', color: 'green', priority: 4 },
    'amarelo': { label: 'Pouco Urgente', color: 'yellow', priority: 3 },
    'laranja': { label: 'Urgente', color: 'orange', priority: 2 },
    'vermelho': { label: 'Emergência', color: 'red', priority: 1 },
  };

  const sendWhatsApp = async (templateId: string) => {
    setSendingMessage(templateId);
    await new Promise(r => setTimeout(r, 1500));
    setSendingMessage(null);
  };

  // Stats
  const totalToday = DEMO_PATIENTS.length;
  const checkedIn = DEMO_PATIENTS.filter(p => p.status !== 'agendado').length;
  const inProgress = DEMO_PATIENTS.filter(p => p.status === 'atendimento').length;
  const completed = DEMO_PATIENTS.filter(p => p.status === 'pos-consulta').length;

  return (
    <div className="space-y-6">
      <EducationalDisclaimer module="Jornada Digital do Paciente" />
      
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-900/40 to-teal-900/40 rounded-2xl p-6 border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Smartphone className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Jornada Digital do Paciente</h1>
        </div>
        <p className="text-gray-400 text-sm">
          Check-in digital, triagem pré-consulta, portal do paciente, engajamento pós-consulta e pesquisa NPS — tudo integrado com WhatsApp Business.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Agendados Hoje', value: totalToday, icon: Calendar, color: 'blue' },
          { label: 'Check-in Realizado', value: checkedIn, icon: QrCode, color: 'cyan' },
          { label: 'Em Atendimento', value: inProgress, icon: Heart, color: 'green' },
          { label: 'Finalizados', value: completed, icon: CheckCircle, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className={`bg-gray-800/50 rounded-xl p-4 border border-gray-700/50`}>
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
          { id: 'painel' as const, label: 'Painel de Fluxo', icon: Users },
          { id: 'checkin' as const, label: 'Check-in Digital', icon: QrCode },
          { id: 'portal' as const, label: 'Portal do Paciente', icon: FileText },
          { id: 'whatsapp' as const, label: 'WhatsApp Business', icon: MessageSquare },
          { id: 'nps' as const, label: 'Pesquisa NPS', icon: Star },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'bg-gray-800/50 text-gray-400 border border-gray-700/50 hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Painel de Fluxo */}
      {activeTab === 'painel' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4">Fluxo de Pacientes — Hoje</h3>
            
            {/* Pipeline View */}
            <div className="grid grid-cols-5 gap-3">
              {(['agendado', 'checkin', 'triagem', 'atendimento', 'pos-consulta'] as const).map(status => {
                const config = statusConfig[status];
                const patients = DEMO_PATIENTS.filter(p => p.status === status);
                return (
                  <div key={status} className="space-y-2">
                    <div className={`text-center p-2 rounded-lg bg-${config.color}-500/10 border border-${config.color}-500/20`}>
                      <config.icon className={`w-4 h-4 text-${config.color}-400 mx-auto mb-1`} />
                      <span className={`text-xs font-medium text-${config.color}-400`}>{config.label}</span>
                      <div className={`text-lg font-bold text-${config.color}-300`}>{patients.length}</div>
                    </div>
                    {patients.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedPatient(p)}
                        className={`w-full text-left p-2 rounded-lg text-xs transition-all ${
                          selectedPatient?.id === p.id
                            ? 'bg-cyan-500/20 border border-cyan-500/40'
                            : 'bg-gray-900/50 border border-gray-700/50 hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="font-medium text-white truncate">{p.name}</div>
                        <div className="text-gray-500">{p.appointment.split(' ')[1]}</div>
                        <div className="text-gray-500">{p.doctor}</div>
                        {p.triagemData && (
                          <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] bg-${urgencyConfig[p.triagemData.urgencyLevel].color}-500/20 text-${urgencyConfig[p.triagemData.urgencyLevel].color}-400`}>
                            {urgencyConfig[p.triagemData.urgencyLevel].label}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Patient Detail */}
          {selectedPatient && (
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Detalhes — {selectedPatient.name}</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-xs text-gray-500">Telefone</span>
                  <p className="text-sm text-white">{selectedPatient.phone}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Médico</span>
                  <p className="text-sm text-white">{selectedPatient.doctor}</p>
                </div>
                <div>
                  <span className="text-xs text-gray-500">Especialidade</span>
                  <p className="text-sm text-white">{selectedPatient.specialty}</p>
                </div>
              </div>
              {selectedPatient.triagemData && (
                <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50">
                  <h5 className="text-xs font-semibold text-gray-400 mb-2">Triagem Pré-Consulta</h5>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <span className="text-xs text-gray-500">Queixa Principal</span>
                      <p className="text-sm text-white">{selectedPatient.triagemData.mainComplaint}</p>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Nível de Dor</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className={`w-3 h-3 rounded-full ${i < selectedPatient.triagemData!.painLevel ? 'bg-red-500' : 'bg-gray-700'}`} />
                        ))}
                        <span className="text-sm text-white ml-2">{selectedPatient.triagemData.painLevel}/10</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Sintomas</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedPatient.triagemData.symptoms.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                    {selectedPatient.triagemData.bloodPressure && (
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <span className="text-xs text-gray-500">PA</span>
                          <p className="text-sm text-white">{selectedPatient.triagemData.bloodPressure}</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">FC</span>
                          <p className="text-sm text-white">{selectedPatient.triagemData.heartRate} bpm</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">Temp</span>
                          <p className="text-sm text-white">{selectedPatient.triagemData.temperature}°C</p>
                        </div>
                        <div>
                          <span className="text-xs text-gray-500">SpO2</span>
                          <p className="text-sm text-white">{selectedPatient.triagemData.oxygenSat}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {selectedPatient.npsScore !== undefined && (
                <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">NPS</span>
                    <span className={`text-lg font-bold ${selectedPatient.npsScore >= 9 ? 'text-green-400' : selectedPatient.npsScore >= 7 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {selectedPatient.npsScore}/10
                    </span>
                  </div>
                  {selectedPatient.npsComment && <p className="text-xs text-gray-400 mt-1">"{selectedPatient.npsComment}"</p>}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Check-in Digital */}
      {activeTab === 'checkin' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-cyan-400" />
              QR Code — Totem de Check-in
            </h3>
            <div className="bg-white rounded-xl p-8 flex items-center justify-center">
              <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                <div className="grid grid-cols-8 gap-0.5">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`w-5 h-5 ${Math.random() > 0.5 ? 'bg-black' : 'bg-white'}`} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              Paciente escaneia o QR Code na recepção para fazer check-in automático e preencher triagem digital.
            </p>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-green-400" />
              Check-in via WhatsApp
            </h3>
            <div className="bg-gray-900/50 rounded-lg p-4 space-y-3">
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 max-w-[80%]">
                <p className="text-xs text-green-400 font-medium mb-1">MedFocus Clínica</p>
                <p className="text-sm text-gray-300">Olá! Bem-vindo(a) à MedFocus Clínica. Para fazer seu check-in, responda:</p>
                <p className="text-sm text-gray-300 mt-1">1 - Confirmar chegada</p>
                <p className="text-sm text-gray-300">2 - Preencher triagem</p>
                <p className="text-sm text-gray-300">3 - Falar com recepção</p>
              </div>
              <div className="bg-gray-700/50 rounded-lg p-3 max-w-[60%] ml-auto">
                <p className="text-sm text-gray-300">1</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 max-w-[80%]">
                <p className="text-xs text-green-400 font-medium mb-1">MedFocus Clínica</p>
                <p className="text-sm text-gray-300">Check-in confirmado! Sua consulta com Dr. Roberto Almeida é às 10:00. Tempo estimado de espera: 15 min. Aguarde ser chamado(a).</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-900/50 rounded-lg text-center">
                <span className="text-2xl font-bold text-cyan-400">78%</span>
                <p className="text-xs text-gray-500">Taxa de check-in digital</p>
              </div>
              <div className="p-3 bg-gray-900/50 rounded-lg text-center">
                <span className="text-2xl font-bold text-green-400">-12min</span>
                <p className="text-xs text-gray-500">Redução tempo de espera</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portal do Paciente */}
      {activeTab === 'portal' && (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Portal do Paciente — Área Restrita
          </h3>
          <p className="text-sm text-gray-400 mb-6">O paciente acessa via link enviado por WhatsApp para baixar receitas, atestados e orientações com assinatura digital ICP-Brasil.</p>
          
          <div className="grid grid-cols-3 gap-4">
            {[
              { title: 'Receitas Digitais', desc: 'Receitas com assinatura digital ICP-Brasil, válidas em qualquer farmácia.', icon: FileText, count: 3, color: 'blue' },
              { title: 'Atestados Médicos', desc: 'Atestados com QR Code de validação e assinatura digital.', icon: Shield, count: 1, color: 'green' },
              { title: 'Orientações Médicas', desc: 'Cuidados pós-consulta, dieta, exercícios e lembretes.', icon: Heart, count: 5, color: 'purple' },
              { title: 'Resultados de Exames', desc: 'Laudos e resultados com gráficos de evolução.', icon: BarChart3, count: 8, color: 'cyan' },
              { title: 'Histórico de Consultas', desc: 'Todas as consultas com resumo SOAP anonimizado.', icon: Clock, count: 12, color: 'yellow' },
              { title: 'Agendamento Online', desc: 'Agendar retorno ou nova consulta diretamente.', icon: Calendar, count: 0, color: 'orange' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                  {item.count > 0 && <span className={`px-2 py-0.5 bg-${item.color}-500/20 text-${item.color}-400 text-xs rounded-full`}>{item.count}</span>}
                </div>
                <h4 className="text-sm font-medium text-white">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-400 mb-2">Assinatura Digital ICP-Brasil</h4>
            <p className="text-xs text-gray-400">
              Todas as receitas e atestados são assinados digitalmente com certificado ICP-Brasil, garantindo validade jurídica conforme a Medida Provisória nº 2.200-2/2001 e a Lei nº 14.063/2020. O paciente pode validar a autenticidade pelo QR Code presente no documento.
            </p>
          </div>
        </div>
      )}

      {/* WhatsApp Business */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-green-400" />
              Templates de Mensagem — WhatsApp Business API
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Mensagens automáticas enviadas via API oficial do WhatsApp Business. Todos os templates são aprovados pela Meta e seguem as diretrizes de comunicação médica.
            </p>
            
            <div className="space-y-3">
              {WHATSAPP_TEMPLATES.map(template => (
                <div key={template.id} className="bg-gray-900/50 rounded-lg border border-gray-700/50 overflow-hidden">
                  <button
                    onClick={() => setShowTemplateDetail(showTemplateDetail === template.id ? null : template.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-800/50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-4 h-4 text-green-400" />
                      </div>
                      <div className="text-left">
                        <span className="text-sm font-medium text-white">{template.name}</span>
                        <p className="text-xs text-gray-500 truncate max-w-md">{template.message.substring(0, 60)}...</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); sendWhatsApp(template.id); }}
                        disabled={sendingMessage === template.id}
                        className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-lg hover:bg-green-500/30 flex items-center gap-1"
                      >
                        {sendingMessage === template.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                        Enviar
                      </button>
                      {showTemplateDetail === template.id ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </div>
                  </button>
                  {showTemplateDetail === template.id && (
                    <div className="px-4 pb-4 border-t border-gray-700/50 pt-3">
                      <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{template.message}</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-gray-700/50 text-gray-400 text-xs rounded-full">Aprovado pela Meta</span>
                        <span className="px-2 py-0.5 bg-gray-700/50 text-gray-400 text-xs rounded-full">LGPD Compliant</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-green-400">92%</span>
              <p className="text-xs text-gray-500">Taxa de entrega</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-blue-400">78%</span>
              <p className="text-xs text-gray-500">Taxa de leitura</p>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 text-center">
              <span className="text-2xl font-bold text-cyan-400">-30%</span>
              <p className="text-xs text-gray-500">Redução de faltas</p>
            </div>
          </div>
        </div>
      )}

      {/* NPS */}
      {activeTab === 'nps' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              Net Promoter Score (NPS)
            </h3>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-900/50 rounded-lg p-4 text-center border border-gray-700/50">
                <span className="text-3xl font-bold text-green-400">58</span>
                <p className="text-xs text-gray-500 mt-1">NPS Atual (Fev/2026)</p>
                <span className="text-xs text-green-400">Zona de Qualidade</span>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 text-center border border-gray-700/50">
                <div className="flex items-center justify-center gap-1">
                  <ThumbsUp className="w-4 h-4 text-green-400" />
                  <span className="text-2xl font-bold text-green-400">68%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Promotores (9-10)</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 text-center border border-gray-700/50">
                <div className="flex items-center justify-center gap-1">
                  <Meh className="w-4 h-4 text-yellow-400" />
                  <span className="text-2xl font-bold text-yellow-400">22%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Neutros (7-8)</p>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 text-center border border-gray-700/50">
                <div className="flex items-center justify-center gap-1">
                  <ThumbsDown className="w-4 h-4 text-red-400" />
                  <span className="text-2xl font-bold text-red-400">10%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Detratores (0-6)</p>
              </div>
            </div>

            {/* NPS History */}
            <h4 className="text-sm font-semibold text-gray-300 mb-3">Evolução do NPS</h4>
            <div className="space-y-2">
              {NPS_HISTORY.map((nps, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-sm text-gray-400 w-20">{nps.period}</span>
                  <div className="flex-1">
                    <div className="flex h-4 rounded-full overflow-hidden">
                      <div className="bg-green-500" style={{ width: `${nps.promoters}%` }} />
                      <div className="bg-yellow-500" style={{ width: `${nps.passives}%` }} />
                      <div className="bg-red-500" style={{ width: `${nps.detractors}%` }} />
                    </div>
                  </div>
                  <span className={`text-sm font-bold w-12 text-right ${nps.score >= 50 ? 'text-green-400' : nps.score >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {nps.score}
                  </span>
                  <span className="text-xs text-gray-500 w-20 text-right">{nps.totalResponses} resp.</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-xs text-yellow-400/80">
              <strong>Referência NPS:</strong> Zona de Excelência: 75-100 | Zona de Qualidade: 50-74 | Zona de Aperfeiçoamento: 0-49 | Zona Crítica: -100 a -1. O NPS é enviado automaticamente 24h após a consulta via WhatsApp.
            </p>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
        <p className="text-xs text-yellow-400/80">
          <strong>Aviso Educacional:</strong> Este módulo demonstra a jornada digital do paciente para fins de estudo e simulação de gestão clínica. A integração com WhatsApp Business API requer conta comercial verificada pela Meta. Todos os dados de pacientes são fictícios. Em conformidade com a LGPD (Lei 13.709/2018), o consentimento do paciente é obrigatório para envio de mensagens.
        </p>
      </div>
    </div>
  );
}
