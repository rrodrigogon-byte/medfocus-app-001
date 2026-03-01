/**
 * DireitosSUS — Navegador "Meus Direitos no SUS"
 * Guia interativo baseado na Carta dos Direitos dos Usuários da Saúde
 */
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Shield, Scale, Phone, FileText, AlertTriangle, ChevronDown, ChevronUp, BookOpen, MessageSquare, Heart, Clock, Users, Info, ExternalLink, CheckCircle2 } from 'lucide-react';

interface Right {
  id: string;
  title: string;
  category: string;
  icon: string;
  summary: string;
  details: string;
  legalBasis: string;
  howToExercise: string[];
  example: string;
  penalties: string;
}

const RIGHTS: Right[] = [
  {
    id: 'acesso', title: 'Direito ao Acesso Universal', category: 'Acesso',
    icon: '🏥', summary: 'Todo cidadão tem direito ao acesso ordenado e organizado aos sistemas de saúde.',
    details: 'O SUS garante acesso universal, igualitário e gratuito a todos os brasileiros e estrangeiros residentes no país. Nenhuma unidade de saúde pode negar atendimento por qualquer motivo, incluindo falta de documentos.',
    legalBasis: 'Constituição Federal Art. 196; Lei 8.080/1990 Art. 2º; Carta dos Direitos dos Usuários - 1º Princípio',
    howToExercise: ['Procure a UBS mais próxima da sua residência', 'Em caso de urgência, vá à UPA ou emergência hospitalar', 'Não é necessário apresentar documentos para atendimento de urgência', 'Ligue 136 para informações sobre acesso'],
    example: 'Se você for recusado em uma UPA por não ter cartão SUS, isso é ilegal. O atendimento de urgência não pode ser condicionado a documentos.',
    penalties: 'A recusa de atendimento pode configurar crime de omissão de socorro (Art. 135, Código Penal) e infração administrativa.',
  },
  {
    id: 'acompanhante', title: 'Direito a Acompanhante', category: 'Atendimento',
    icon: '👥', summary: 'Crianças, adolescentes, idosos, gestantes e pessoas com deficiência têm direito a acompanhante.',
    details: 'O Estatuto da Criança e do Adolescente (ECA), o Estatuto do Idoso e a Lei do Acompanhante garantem a presença de um acompanhante durante todo o período de internação e atendimento.',
    legalBasis: 'Lei 8.069/1990 (ECA) Art. 12; Lei 10.741/2003 (Estatuto do Idoso) Art. 16; Lei 11.108/2005 (Lei do Acompanhante para gestantes)',
    howToExercise: ['Informe ao hospital que deseja acompanhante', 'Cite a lei específica se houver resistência', 'Gestantes: direito durante pré-parto, parto e pós-parto', 'Idosos: direito durante toda a internação', 'Crianças: direito a permanência integral de um dos pais'],
    example: 'Uma gestante tem direito a um acompanhante de sua escolha durante todo o trabalho de parto, parto e pós-parto imediato, conforme a Lei 11.108/2005.',
    penalties: 'O hospital que negar acompanhante pode ser multado e responder administrativamente perante o Conselho de Saúde.',
  },
  {
    id: 'informacao', title: 'Direito à Informação', category: 'Atendimento',
    icon: '📋', summary: 'O paciente tem direito a informações claras sobre seu diagnóstico, tratamento e prognóstico.',
    details: 'Todo paciente tem direito de receber informações sobre seu estado de saúde em linguagem clara e acessível. O profissional deve explicar o diagnóstico, opções de tratamento, riscos e benefícios de cada procedimento.',
    legalBasis: 'Código de Ética Médica Art. 34; Lei 10.241/1999 (SP); Carta dos Direitos dos Usuários - 3º Princípio',
    howToExercise: ['Pergunte ao médico sobre seu diagnóstico e tratamento', 'Peça explicações em linguagem simples', 'Solicite cópia do prontuário médico', 'Peça segunda opinião se desejar'],
    example: 'Antes de uma cirurgia, o médico deve explicar detalhadamente o procedimento, riscos, alternativas e o que esperar na recuperação.',
    penalties: 'A omissão de informações pode configurar infração ética perante o CRM e responsabilidade civil.',
  },
  {
    id: 'consentimento', title: 'Consentimento Livre e Esclarecido', category: 'Atendimento',
    icon: '✍️', summary: 'Nenhum procedimento pode ser realizado sem o consentimento informado do paciente.',
    details: 'O paciente tem direito de consentir ou recusar qualquer procedimento, exame ou tratamento, após receber informações adequadas. O consentimento deve ser livre, sem coerção, e pode ser revogado a qualquer momento.',
    legalBasis: 'Código de Ética Médica Art. 22 e 24; Resolução CFM 1.931/2009; Código Civil Art. 15',
    howToExercise: ['Leia atentamente o Termo de Consentimento antes de assinar', 'Faça perguntas sobre tudo que não entender', 'Você pode recusar um procedimento', 'Em emergência com risco de vida, o médico pode agir sem consentimento'],
    example: 'Um paciente pode recusar uma transfusão de sangue por motivos religiosos, exceto em situação de risco iminente de morte.',
    penalties: 'Procedimento sem consentimento pode configurar lesão corporal e responsabilidade civil e criminal do profissional.',
  },
  {
    id: 'prontuario', title: 'Acesso ao Prontuário Médico', category: 'Documentação',
    icon: '📁', summary: 'O paciente tem direito a cópia do seu prontuário médico a qualquer momento.',
    details: 'O prontuário pertence ao paciente, embora fique sob guarda da instituição. O paciente pode solicitar cópia integral a qualquer momento, e a instituição tem até 30 dias para fornecer.',
    legalBasis: 'Resolução CFM 1.638/2002; Lei 13.787/2018 (prontuário eletrônico); Código de Ética Médica Art. 88',
    howToExercise: ['Solicite por escrito ao setor de prontuários do hospital', 'A instituição tem até 30 dias para fornecer', 'Não podem cobrar pelo fornecimento', 'Em caso de recusa, procure a ouvidoria ou o CRM'],
    example: 'Ao trocar de médico ou hospital, você pode solicitar cópia completa do prontuário para levar ao novo profissional.',
    penalties: 'A recusa em fornecer prontuário é infração ética e pode gerar ação judicial.',
  },
  {
    id: 'tempo_maximo', title: 'Tempo Máximo de Espera', category: 'Acesso',
    icon: '⏰', summary: 'Existem prazos legais para atendimento no SUS, incluindo consultas, exames e cirurgias.',
    details: 'Embora não exista uma lei federal única que defina tempos máximos para todas as situações, existem normas específicas: tratamento de câncer em até 60 dias, e diversos estados possuem legislação própria sobre tempos de espera.',
    legalBasis: 'Lei 12.732/2012 (câncer: 60 dias); Lei 13.896/2019 (exames: 30 dias); Portaria MS 1.559/2008',
    howToExercise: ['Câncer: 1º tratamento em até 60 dias do diagnóstico', 'Exames: resultado em até 30 dias', 'Se o prazo for descumprido, registre reclamação no 136', 'Procure a Defensoria Pública para ação judicial'],
    example: 'Se você recebeu diagnóstico de câncer e não conseguiu iniciar o tratamento em 60 dias, pode acionar a Defensoria Pública para garantir o tratamento.',
    penalties: 'O descumprimento dos prazos pode gerar ação judicial contra o Estado/Município e responsabilização do gestor.',
  },
  {
    id: 'medicamentos', title: 'Direito a Medicamentos', category: 'Tratamento',
    icon: '💊', summary: 'O SUS deve fornecer gratuitamente os medicamentos prescritos que constam nas listas oficiais.',
    details: 'O SUS disponibiliza medicamentos através da RENAME (Relação Nacional de Medicamentos Essenciais). Medicamentos não listados podem ser obtidos via processo administrativo ou judicial (judicialização da saúde).',
    legalBasis: 'Lei 8.080/1990 Art. 6º; Decreto 7.508/2011; RENAME',
    howToExercise: ['Verifique se o medicamento está na RENAME', 'Retire na farmácia da UBS ou Farmácia Popular', 'Se não disponível, solicite via processo administrativo na Secretaria de Saúde', 'Último recurso: ação judicial via Defensoria Pública'],
    example: 'Insulina, anti-hipertensivos e antidiabéticos orais são disponíveis gratuitamente nas UBS e Farmácias Populares.',
    penalties: 'A falta de medicamentos essenciais pode gerar responsabilização do gestor e ação civil pública.',
  },
  {
    id: 'sigilo', title: 'Sigilo e Privacidade', category: 'Atendimento',
    icon: '🔒', summary: 'Todas as informações sobre sua saúde são sigilosas e protegidas por lei.',
    details: 'O sigilo médico é inviolável. Nenhum profissional de saúde pode revelar informações sobre o paciente sem sua autorização, exceto em situações previstas em lei (doenças de notificação compulsória, risco a terceiros).',
    legalBasis: 'Código de Ética Médica Art. 73-79; Constituição Federal Art. 5º, X; LGPD (Lei 13.709/2018)',
    howToExercise: ['Exija atendimento em ambiente privado', 'Seus dados médicos não podem ser compartilhados sem autorização', 'Denuncie quebra de sigilo ao CRM', 'A LGPD protege seus dados de saúde como dados sensíveis'],
    example: 'Um empregador não pode exigir que o médico do trabalho revele o diagnóstico específico do funcionário. O ASO informa apenas "apto" ou "inapto".',
    penalties: 'Quebra de sigilo: infração ética (CRM), crime (Art. 154, CP) e violação da LGPD.',
  },
  {
    id: 'segunda_opiniao', title: 'Direito à Segunda Opinião', category: 'Tratamento',
    icon: '🔍', summary: 'O paciente pode buscar segunda opinião médica antes de qualquer procedimento.',
    details: 'É direito do paciente consultar outro profissional sobre seu diagnóstico e tratamento. O médico não pode se opor a isso e deve facilitar o acesso às informações necessárias.',
    legalBasis: 'Código de Ética Médica Art. 39; Carta dos Direitos dos Usuários - 3º Princípio',
    howToExercise: ['Solicite encaminhamento para outro especialista', 'Peça cópia dos exames e prontuário', 'No SUS, peça ao médico da UBS para encaminhar', 'Na rede privada, consulte outro profissional livremente'],
    example: 'Antes de uma cirurgia de coluna, o paciente pode consultar outro ortopedista ou neurocirurgião para confirmar a indicação.',
    penalties: 'O médico que dificultar a segunda opinião pode responder por infração ética.',
  },
  {
    id: 'reclamacao', title: 'Direito de Reclamar', category: 'Fiscalização',
    icon: '📢', summary: 'O cidadão pode registrar reclamações, elogios e sugestões sobre os serviços de saúde.',
    details: 'A Ouvidoria do SUS é o canal oficial para manifestações dos usuários. As reclamações devem ser investigadas e respondidas em prazo determinado.',
    legalBasis: 'Lei 13.460/2017 (Código de Defesa do Usuário de Serviço Público); Decreto 9.492/2018',
    howToExercise: ['Ligue 136 (Disque Saúde)', 'Acesse ouvsus.saude.gov.br', 'Procure a ouvidoria do hospital/secretaria de saúde', 'Registre na plataforma Fala.BR (falabr.cgu.gov.br)', 'Procure o Ministério Público se necessário'],
    example: 'Se você esperou mais de 4 horas na UPA sem ser atendido e sem classificação de risco, registre reclamação no 136.',
    penalties: 'Reclamações geram investigação e podem resultar em sanções administrativas ao gestor ou profissional.',
  },
  {
    id: 'nao_discriminacao', title: 'Não Discriminação', category: 'Acesso',
    icon: '🤝', summary: 'É proibida qualquer forma de discriminação no atendimento à saúde.',
    details: 'Nenhum cidadão pode ser discriminado no SUS por raça, cor, etnia, religião, orientação sexual, identidade de gênero, condição social, deficiência ou qualquer outro motivo.',
    legalBasis: 'Constituição Federal Art. 5º; Lei 7.716/1989 (crimes de racismo); Carta dos Direitos dos Usuários - 1º Princípio',
    howToExercise: ['Denuncie discriminação ao 136', 'Registre boletim de ocorrência', 'Procure a Defensoria Pública', 'Pessoas trans têm direito ao nome social em todos os documentos do SUS'],
    example: 'Uma pessoa em situação de rua não pode ser recusada em uma UBS por sua aparência ou falta de endereço fixo.',
    penalties: 'Discriminação no atendimento pode configurar crime (racismo, injúria) e infração administrativa grave.',
  },
  {
    id: 'tratamento_digno', title: 'Tratamento Digno e Humanizado', category: 'Atendimento',
    icon: '💛', summary: 'Todo paciente tem direito a ser tratado com respeito, dignidade e sem preconceito.',
    details: 'A Política Nacional de Humanização (HumanizaSUS) estabelece que o atendimento deve ser acolhedor, com escuta qualificada, respeito à autonomia e protagonismo do paciente.',
    legalBasis: 'Política Nacional de Humanização (PNH/2003); Carta dos Direitos dos Usuários - 4º Princípio',
    howToExercise: ['Exija ser chamado pelo nome (ou nome social)', 'Denuncie maus-tratos ao 136 ou ouvidoria', 'Você tem direito a ambiente limpo e confortável', 'Profissionais devem se identificar com crachá'],
    example: 'Um profissional de saúde que grita com paciente, usa termos pejorativos ou ignora suas queixas está violando a PNH.',
    penalties: 'Maus-tratos podem gerar processo ético, administrativo e até criminal.',
  },
];

const CATEGORIES = Array.from(new Set(RIGHTS.map(r => r.category)));

const HOW_TO_COMPLAIN = [
  { step: 1, title: 'Identifique o problema', description: 'Anote data, hora, local, nome do profissional (se possível) e o que aconteceu.' },
  { step: 2, title: 'Tente resolver localmente', description: 'Procure o responsável pela unidade de saúde ou o serviço de ouvidoria local.' },
  { step: 3, title: 'Registre formalmente', description: 'Ligue 136, acesse ouvsus.saude.gov.br ou use o Fala.BR para registrar sua manifestação.' },
  { step: 4, title: 'Acompanhe o protocolo', description: 'Anote o número do protocolo e acompanhe a resposta (prazo de até 30 dias).' },
  { step: 5, title: 'Escale se necessário', description: 'Se não resolvido, procure o Ministério Público, Defensoria Pública ou Conselho de Saúde.' },
];

export default function DireitosSUS() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [expandedRight, setExpandedRight] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showComplaintGuide, setShowComplaintGuide] = useState(false);

  const filteredRights = useMemo(() => {
    return RIGHTS.filter(r => {
      const matchCategory = !selectedCategory || r.category === selectedCategory;
      const matchSearch = !searchTerm || r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.summary.toLowerCase().includes(searchTerm.toLowerCase()) || r.details.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchTerm]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Scale className="w-8 h-8 text-primary" /> Meus Direitos no SUS
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Conheça seus direitos como usuário do SUS. Baseado na Carta dos Direitos dos Usuários da Saúde e legislação brasileira.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-primary">{RIGHTS.length}</div>
            <div className="text-[10px] text-muted-foreground">Direitos documentados</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-green-400">{CATEGORIES.length}</div>
            <div className="text-[10px] text-muted-foreground">Categorias</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-yellow-400">136</div>
            <div className="text-[10px] text-muted-foreground">Disque Saúde</div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Banner */}
      <Card className="bg-red-500/5 border-red-500/20 mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Phone className="w-8 h-8 text-red-400 shrink-0" />
            <div>
              <div className="font-bold text-sm text-red-400">Seus direitos estão sendo violados?</div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ligue <strong className="text-red-400">136</strong> (Disque Saúde - gratuito) ou acesse <strong className="text-red-400">ouvsus.saude.gov.br</strong> para registrar sua reclamação.
                Em casos graves, procure a <strong>Defensoria Pública</strong> ou o <strong>Ministério Público</strong>.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar direito..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setSelectedCategory('')}
            className={`text-xs px-3 py-1.5 rounded-full transition-all ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
            Todos
          </button>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
              className={`text-xs px-3 py-1.5 rounded-full transition-all ${selectedCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rights List */}
      <div className="space-y-3">
        {filteredRights.map(right => {
          const isExpanded = expandedRight === right.id;
          return (
            <Card key={right.id} className="bg-card border-border hover:border-primary/30 transition-all">
              <button className="w-full text-left p-4" onClick={() => setExpandedRight(isExpanded ? null : right.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{right.icon}</div>
                    <div>
                      <div className="font-semibold text-sm">{right.title}</div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{right.summary}</p>
                      <Badge variant="outline" className="text-[10px] mt-1">{right.category}</Badge>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
                </div>
              </button>

              {isExpanded && (
                <CardContent className="pt-0 pb-4 px-4 border-t border-border mt-2">
                  <div className="mt-3 space-y-4">
                    {/* Details */}
                    <div>
                      <div className="text-xs font-semibold text-primary mb-1">O que diz a lei:</div>
                      <p className="text-sm text-muted-foreground">{right.details}</p>
                    </div>

                    {/* Legal Basis */}
                    <div className="bg-blue-500/5 rounded-xl p-3 border border-blue-500/10">
                      <div className="text-xs font-semibold text-blue-400 mb-1 flex items-center gap-1">
                        <Scale className="w-3 h-3" /> Base Legal:
                      </div>
                      <p className="text-xs text-muted-foreground">{right.legalBasis}</p>
                    </div>

                    {/* How to Exercise */}
                    <div>
                      <div className="text-xs font-semibold text-green-400 mb-2">Como exercer este direito:</div>
                      <div className="space-y-1.5">
                        {right.howToExercise.map((step, i) => (
                          <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Example */}
                    <div className="bg-yellow-500/5 rounded-xl p-3 border border-yellow-500/10">
                      <div className="text-xs font-semibold text-yellow-400 mb-1">Exemplo prático:</div>
                      <p className="text-xs text-muted-foreground">{right.example}</p>
                    </div>

                    {/* Penalties */}
                    <div className="bg-red-500/5 rounded-xl p-3 border border-red-500/10">
                      <div className="text-xs font-semibold text-red-400 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Se o direito for violado:
                      </div>
                      <p className="text-xs text-muted-foreground">{right.penalties}</p>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* How to Complain Guide */}
      <div className="mt-8">
        <button onClick={() => setShowComplaintGuide(!showComplaintGuide)}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-card border border-border hover:bg-accent transition-all">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Como Registrar uma Reclamação (Passo a Passo)
          </h2>
          {showComplaintGuide ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        {showComplaintGuide && (
          <div className="mt-3 space-y-3">
            {HOW_TO_COMPLAIN.map(step => (
              <div key={step.step} className="flex items-start gap-3 p-3 bg-card rounded-xl border border-border">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{step.step}</span>
                </div>
                <div>
                  <div className="font-semibold text-sm">{step.title}</div>
                  <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Useful Links */}
      <Card className="bg-card border-border mt-6">
        <CardContent className="p-5">
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-primary" /> Links Úteis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { name: 'Disque Saúde', url: 'Ligue 136 (gratuito)', description: 'Informações, reclamações e ouvidoria do SUS' },
              { name: 'Ouvidoria do SUS', url: 'ouvsus.saude.gov.br', description: 'Registre manifestações online' },
              { name: 'Fala.BR', url: 'falabr.cgu.gov.br', description: 'Plataforma integrada de ouvidoria do governo' },
              { name: 'Defensoria Pública', url: 'Procure a Defensoria do seu estado', description: 'Assistência jurídica gratuita para garantir seus direitos' },
              { name: 'Ministério Público', url: 'Procure o MP do seu estado', description: 'Denúncias de violações graves e ações coletivas' },
              { name: 'Conselho de Saúde', url: 'conselho.saude.gov.br', description: 'Participação social no controle do SUS' },
            ].map(link => (
              <div key={link.name} className="p-3 bg-muted/30 rounded-xl">
                <div className="font-semibold text-sm text-primary">{link.name}</div>
                <div className="text-xs text-yellow-400">{link.url}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{link.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <strong className="text-blue-400">Nota:</strong> Este guia tem caráter informativo e educativo. 
            Para orientação jurídica específica, consulte um advogado ou a Defensoria Pública do seu estado. 
            As informações são baseadas na legislação vigente até 2025.
          </div>
        </div>
      </div>
    </div>
  );
}
