/**
 * LocalizadorUBS — Guia de Serviços e Localizador de UBS/UPA
 * Mostra a diferença entre UBS e UPA, serviços oferecidos, horários e localização
 */
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Search, Clock, Phone, Building2, Heart, AlertTriangle, Info, ChevronDown, ChevronUp, Stethoscope, Shield, Baby, Syringe, Activity } from 'lucide-react';

// ─── Tipos de Unidade ─────
const UNIT_TYPES = [
  {
    type: 'UBS',
    fullName: 'Unidade Básica de Saúde',
    icon: '🏥',
    color: '#10B981',
    description: 'Porta de entrada preferencial do SUS. Oferece atendimento de atenção primária, prevenção, promoção da saúde e acompanhamento de doenças crônicas.',
    whenToGo: [
      'Consultas de rotina e check-up',
      'Acompanhamento de hipertensão e diabetes',
      'Pré-natal e puericultura',
      'Vacinação',
      'Curativos simples',
      'Exames básicos (sangue, urina)',
      'Saúde mental (leve a moderada)',
      'Planejamento familiar',
      'Saúde bucal',
    ],
    whenNotToGo: [
      'Emergências com risco de vida',
      'Fraturas expostas',
      'Dor no peito intensa',
      'AVC (perda de força, fala)',
      'Hemorragias graves',
    ],
    hours: 'Seg a Sex: 7h às 17h (varia por município)',
    team: ['Médico de Família', 'Enfermeiro', 'Técnico de Enfermagem', 'ACS', 'Dentista', 'Auxiliar de Saúde Bucal'],
    programs: ['Estratégia Saúde da Família (ESF)', 'Hiperdia', 'Pré-natal', 'Puericultura', 'Saúde Mental', 'Saúde Bucal', 'NASF-AP'],
  },
  {
    type: 'UPA',
    fullName: 'Unidade de Pronto Atendimento',
    icon: '🚑',
    color: '#EF4444',
    description: 'Atendimento de urgência e emergência 24 horas. Funciona como ponte entre a UBS e o hospital, atendendo casos de média complexidade.',
    whenToGo: [
      'Febre alta persistente',
      'Fraturas e torções',
      'Cortes que necessitam sutura',
      'Crises de asma',
      'Dor abdominal intensa',
      'Vômitos e diarreia com desidratação',
      'Infecções urinárias com febre',
      'Crises hipertensivas',
      'Reações alérgicas',
    ],
    whenNotToGo: [
      'Consultas de rotina',
      'Renovação de receitas',
      'Exames de rotina',
      'Vacinação',
      'Acompanhamento de crônicos',
    ],
    hours: '24 horas, todos os dias (inclusive feriados)',
    team: ['Médico Clínico', 'Médico Pediatra', 'Enfermeiro', 'Técnico de Enfermagem', 'Farmacêutico', 'Assistente Social'],
    programs: ['Classificação de Risco Manchester', 'Sala Vermelha', 'Sala Amarela', 'Sala Verde', 'Observação (até 24h)'],
  },
  {
    type: 'CAPS',
    fullName: 'Centro de Atenção Psicossocial',
    icon: '🧠',
    color: '#8B5CF6',
    description: 'Atendimento especializado em saúde mental. Oferece acompanhamento para transtornos mentais graves e uso de substâncias.',
    whenToGo: [
      'Transtornos mentais graves (esquizofrenia, bipolar)',
      'Dependência de álcool e drogas (CAPS AD)',
      'Crises psicóticas',
      'Ideação suicida',
      'Transtornos alimentares graves',
      'Saúde mental infantojuvenil (CAPSi)',
    ],
    whenNotToGo: [
      'Ansiedade leve (procure a UBS)',
      'Insônia simples (procure a UBS)',
      'Emergências clínicas',
    ],
    hours: 'CAPS I: Seg a Sex 8h-18h | CAPS III: 24h',
    team: ['Psiquiatra', 'Psicólogo', 'Assistente Social', 'Terapeuta Ocupacional', 'Enfermeiro', 'Técnico de Enfermagem'],
    programs: ['Acolhimento', 'Projeto Terapêutico Singular', 'Oficinas Terapêuticas', 'Atendimento em Crise', 'Matriciamento'],
  },
  {
    type: 'CEO',
    fullName: 'Centro de Especialidades Odontológicas',
    icon: '🦷',
    color: '#06B6D4',
    description: 'Atendimento odontológico especializado. Referência para procedimentos que não são realizados na UBS.',
    whenToGo: [
      'Tratamento de canal (endodontia)',
      'Cirurgia oral menor',
      'Periodontia (doença gengival avançada)',
      'Atendimento a pacientes especiais',
      'Diagnóstico de câncer bucal',
    ],
    whenNotToGo: [
      'Limpeza de rotina (procure a UBS)',
      'Restaurações simples (procure a UBS)',
    ],
    hours: 'Seg a Sex: 7h às 17h',
    team: ['Cirurgião-Dentista Especialista', 'Auxiliar de Saúde Bucal', 'Técnico em Saúde Bucal'],
    programs: ['Endodontia', 'Periodontia', 'Cirurgia Oral', 'Estomatologia', 'Pacientes Especiais'],
  },
];

// ─── Serviços da UBS detalhados ─────
const UBS_SERVICES = [
  { name: 'Consulta Médica', icon: Stethoscope, description: 'Clínico geral / Médico de Família', available: true },
  { name: 'Enfermagem', icon: Heart, description: 'Consulta de enfermagem, curativos, aferição de PA', available: true },
  { name: 'Vacinação', icon: Syringe, description: 'Calendário Nacional de Vacinação completo', available: true },
  { name: 'Pré-natal', icon: Baby, description: 'Acompanhamento gestacional de baixo risco', available: true },
  { name: 'Saúde Bucal', icon: Activity, description: 'Dentista, limpeza, restaurações, extrações', available: true },
  { name: 'Saúde Mental', icon: Shield, description: 'Acolhimento, escuta qualificada, encaminhamento', available: true },
  { name: 'Coleta de Exames', icon: Activity, description: 'Sangue, urina, fezes, Papanicolau', available: true },
  { name: 'Dispensação de Medicamentos', icon: Activity, description: 'Farmácia básica com medicamentos essenciais', available: true },
];

// ─── Classificação de Risco Manchester ─────
const MANCHESTER_COLORS = [
  { color: 'Vermelho', name: 'Emergência', time: 'Atendimento imediato (0 min)', description: 'Risco de morte: parada cardíaca, hemorragia grave, insuficiência respiratória', bgColor: 'bg-red-600', textColor: 'text-white' },
  { color: 'Laranja', name: 'Muito Urgente', time: 'Até 10 minutos', description: 'Dor intensa, alteração de consciência, febre alta em criança', bgColor: 'bg-orange-500', textColor: 'text-white' },
  { color: 'Amarelo', name: 'Urgente', time: 'Até 60 minutos', description: 'Dor moderada, vômitos persistentes, febre alta em adulto', bgColor: 'bg-yellow-500', textColor: 'text-black' },
  { color: 'Verde', name: 'Pouco Urgente', time: 'Até 120 minutos', description: 'Dor leve, sintomas gripais, pequenos ferimentos', bgColor: 'bg-green-500', textColor: 'text-white' },
  { color: 'Azul', name: 'Não Urgente', time: 'Até 240 minutos', description: 'Queixas crônicas, renovação de receitas (deveria ir à UBS)', bgColor: 'bg-blue-500', textColor: 'text-white' },
];

export default function LocalizadorUBS() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showManchester, setShowManchester] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedUnit = UNIT_TYPES.find(u => u.type === selectedType);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Building2 className="w-8 h-8 text-primary" /> Guia de Serviços SUS
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Entenda a diferença entre UBS, UPA, CAPS e CEO. Saiba quando ir a cada unidade e quais serviços estão disponíveis.
        </p>
      </div>

      {/* Quick Decision Helper */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 mb-6">
        <CardContent className="p-4">
          <h2 className="font-bold text-sm mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary" /> Para onde devo ir?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-green-500/10 rounded-xl p-3 border border-green-500/20">
              <div className="font-semibold text-sm text-green-400 mb-1">🏥 Vá à UBS se:</div>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• Precisa de consulta de rotina</li>
                <li>• Quer vacinar</li>
                <li>• Precisa de pré-natal</li>
                <li>• Acompanhamento de pressão/diabetes</li>
                <li>• Exames de rotina</li>
              </ul>
            </div>
            <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/20">
              <div className="font-semibold text-sm text-red-400 mb-1">🚑 Vá à UPA se:</div>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• Febre alta que não cede</li>
                <li>• Fratura ou torção</li>
                <li>• Corte que precisa de pontos</li>
                <li>• Crise de asma ou falta de ar</li>
                <li>• Dor intensa no peito ou abdômen</li>
              </ul>
            </div>
            <div className="bg-purple-500/10 rounded-xl p-3 border border-purple-500/20">
              <div className="font-semibold text-sm text-purple-400 mb-1">🧠 Vá ao CAPS se:</div>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• Transtorno mental grave</li>
                <li>• Dependência de álcool/drogas</li>
                <li>• Crise psicótica</li>
                <li>• Pensamentos suicidas</li>
              </ul>
            </div>
            <div className="bg-cyan-500/10 rounded-xl p-3 border border-cyan-500/20">
              <div className="font-semibold text-sm text-cyan-400 mb-1">🦷 Vá ao CEO se:</div>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• Tratamento de canal</li>
                <li>• Cirurgia oral</li>
                <li>• Doença gengival avançada</li>
                <li>• Suspeita de câncer bucal</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Unit Type Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {UNIT_TYPES.map(unit => (
          <button key={unit.type} onClick={() => setSelectedType(selectedType === unit.type ? null : unit.type)}
            className={`p-4 rounded-xl text-center transition-all border ${selectedType === unit.type ? 'ring-2 ring-primary bg-primary/10 border-primary/30' : 'bg-card border-border hover:bg-accent'}`}>
            <div className="text-3xl mb-1">{unit.icon}</div>
            <div className="font-bold text-sm" style={{ color: unit.color }}>{unit.type}</div>
            <div className="text-[10px] text-muted-foreground mt-0.5">{unit.fullName}</div>
          </button>
        ))}
      </div>

      {/* Selected Unit Detail */}
      {selectedUnit && (
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl">{selectedUnit.icon}</span>
              <div>
                <h2 className="text-xl font-bold" style={{ color: selectedUnit.color }}>{selectedUnit.type} — {selectedUnit.fullName}</h2>
                <p className="text-sm text-muted-foreground">{selectedUnit.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* When to go */}
              <div className="bg-green-500/5 rounded-xl p-4 border border-green-500/10">
                <h3 className="font-semibold text-sm text-green-400 mb-2">✅ Quando procurar:</h3>
                <ul className="space-y-1">
                  {selectedUnit.whenToGo.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-green-400 mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* When NOT to go */}
              <div className="bg-red-500/5 rounded-xl p-4 border border-red-500/10">
                <h3 className="font-semibold text-sm text-red-400 mb-2">❌ NÃO procure para:</h3>
                <ul className="space-y-1">
                  {selectedUnit.whenNotToGo.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <span className="text-red-400 mt-0.5">•</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              <div className="bg-muted/30 rounded-xl p-3">
                <div className="text-xs font-semibold text-primary mb-1 flex items-center gap-1"><Clock className="w-3 h-3" /> Horário</div>
                <div className="text-xs text-muted-foreground">{selectedUnit.hours}</div>
              </div>
              <div className="bg-muted/30 rounded-xl p-3">
                <div className="text-xs font-semibold text-primary mb-1 flex items-center gap-1"><Stethoscope className="w-3 h-3" /> Equipe</div>
                <div className="text-xs text-muted-foreground">{selectedUnit.team.join(', ')}</div>
              </div>
              <div className="bg-muted/30 rounded-xl p-3">
                <div className="text-xs font-semibold text-primary mb-1 flex items-center gap-1"><Shield className="w-3 h-3" /> Programas</div>
                <div className="text-xs text-muted-foreground">{selectedUnit.programs.join(', ')}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* UBS Services Grid */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary" /> Serviços Disponíveis na UBS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {UBS_SERVICES.map(service => (
            <Card key={service.name} className="bg-card border-border">
              <CardContent className="p-3 text-center">
                <service.icon className="w-6 h-6 text-primary mx-auto mb-1" />
                <div className="font-semibold text-xs">{service.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{service.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Manchester Classification */}
      <div className="mb-6">
        <button onClick={() => setShowManchester(!showManchester)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-accent transition-all">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" /> Classificação de Risco Manchester (UPA)
          </h2>
          {showManchester ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {showManchester && (
          <div className="mt-3 space-y-2">
            {MANCHESTER_COLORS.map(mc => (
              <div key={mc.color} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                <div className={`w-12 h-12 rounded-xl ${mc.bgColor} flex items-center justify-center shrink-0`}>
                  <span className={`font-bold text-sm ${mc.textColor}`}>{mc.color.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{mc.color} — {mc.name}</span>
                    <Badge variant="outline" className="text-[10px]">{mc.time}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{mc.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How to find your UBS */}
      <Card className="bg-card border-border mb-6">
        <CardContent className="p-5">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" /> Como encontrar sua UBS de referência
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">1</div>
              <div>
                <div className="font-semibold text-sm">Descubra seu endereço de referência</div>
                <p className="text-xs text-muted-foreground">Cada endereço está vinculado a uma UBS específica (adscrição). Sua UBS de referência é determinada pelo seu endereço residencial.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">2</div>
              <div>
                <div className="font-semibold text-sm">Acesse o CNES</div>
                <p className="text-xs text-muted-foreground">O Cadastro Nacional de Estabelecimentos de Saúde (cnes.datasus.gov.br) lista todas as unidades de saúde do Brasil com endereço e telefone.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">3</div>
              <div>
                <div className="font-semibold text-sm">Use o módulo "Hospitais e Clínicas" do MedFocus</div>
                <p className="text-xs text-muted-foreground">No menu lateral, acesse "Hospitais e Clínicas" para buscar todas as unidades de saúde da sua cidade, incluindo UBS, UPA, CAPS e hospitais.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 text-sm font-bold text-primary">4</div>
              <div>
                <div className="font-semibold text-sm">Ligue para o 136</div>
                <p className="text-xs text-muted-foreground">O Disque Saúde 136 é gratuito e pode informar qual é sua UBS de referência com base no seu endereço.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Numbers */}
      <Card className="bg-red-500/5 border-red-500/20">
        <CardContent className="p-5">
          <h2 className="text-lg font-bold mb-3 text-red-400 flex items-center gap-2">
            <Phone className="w-5 h-5" /> Telefones de Emergência
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { number: '192', name: 'SAMU', description: 'Urgência e emergência médica' },
              { number: '193', name: 'Bombeiros', description: 'Incêndio, resgate, afogamento' },
              { number: '190', name: 'Polícia Militar', description: 'Segurança e ordem pública' },
              { number: '136', name: 'Disque Saúde', description: 'Informações sobre o SUS' },
              { number: '188', name: 'CVV', description: 'Prevenção do suicídio (24h)' },
              { number: '180', name: 'Central da Mulher', description: 'Violência contra a mulher' },
              { number: '100', name: 'Disque Direitos Humanos', description: 'Denúncias de violações' },
              { number: '181', name: 'Disque Denúncia', description: 'Denúncias anônimas' },
            ].map(tel => (
              <div key={tel.number} className="bg-card rounded-xl p-3 border border-border text-center">
                <div className="text-2xl font-bold text-red-400">{tel.number}</div>
                <div className="font-semibold text-xs">{tel.name}</div>
                <div className="text-[10px] text-muted-foreground">{tel.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
