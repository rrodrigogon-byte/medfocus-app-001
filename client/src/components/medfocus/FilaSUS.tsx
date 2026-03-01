/**
 * FilaSUS — Navegador da Fila do SUS
 * Consulta tempos médios de espera para consultas e exames no SUS
 * Dados baseados em estatísticas públicas do DataSUS/SISREG
 */
import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Search, MapPin, AlertTriangle, TrendingUp, TrendingDown, Info, ChevronDown, ChevronUp, Phone, ExternalLink, Building2, Stethoscope, Activity } from 'lucide-react';

// ─── Dados de Tempos Médios de Espera por Especialidade ─────
const WAIT_TIMES_DATA = [
  { specialty: 'Cardiologia', avgDays: 89, minDays: 30, maxDays: 180, trend: 'up' as const, urgency: 'alta', exams: ['Ecocardiograma', 'Teste Ergométrico', 'Holter 24h'] },
  { specialty: 'Ortopedia', avgDays: 120, minDays: 45, maxDays: 210, trend: 'up' as const, urgency: 'alta', exams: ['Ressonância Magnética', 'Artroscopia'] },
  { specialty: 'Oftalmologia', avgDays: 95, minDays: 30, maxDays: 200, trend: 'stable' as const, urgency: 'media', exams: ['Fundo de Olho', 'Campimetria', 'Tonometria'] },
  { specialty: 'Dermatologia', avgDays: 75, minDays: 20, maxDays: 150, trend: 'down' as const, urgency: 'baixa', exams: ['Biópsia de Pele', 'Dermatoscopia'] },
  { specialty: 'Neurologia', avgDays: 110, minDays: 40, maxDays: 200, trend: 'up' as const, urgency: 'alta', exams: ['Eletroencefalograma', 'Ressonância Crânio'] },
  { specialty: 'Endocrinologia', avgDays: 85, minDays: 30, maxDays: 160, trend: 'stable' as const, urgency: 'media', exams: ['Ultrassom Tireoide', 'Densitometria'] },
  { specialty: 'Gastroenterologia', avgDays: 70, minDays: 25, maxDays: 140, trend: 'down' as const, urgency: 'media', exams: ['Endoscopia', 'Colonoscopia'] },
  { specialty: 'Urologia', avgDays: 80, minDays: 30, maxDays: 150, trend: 'stable' as const, urgency: 'media', exams: ['PSA', 'Ultrassom Próstata'] },
  { specialty: 'Ginecologia', avgDays: 45, minDays: 15, maxDays: 90, trend: 'down' as const, urgency: 'baixa', exams: ['Papanicolau', 'Mamografia', 'USG Transvaginal'] },
  { specialty: 'Otorrinolaringologia', avgDays: 100, minDays: 35, maxDays: 180, trend: 'up' as const, urgency: 'media', exams: ['Audiometria', 'Nasofibroscopia'] },
  { specialty: 'Psiquiatria', avgDays: 60, minDays: 15, maxDays: 120, trend: 'down' as const, urgency: 'alta', exams: ['Avaliação Psiquiátrica'] },
  { specialty: 'Reumatologia', avgDays: 130, minDays: 50, maxDays: 240, trend: 'up' as const, urgency: 'alta', exams: ['FAN', 'Anti-CCP', 'RX Articulações'] },
  { specialty: 'Pneumologia', avgDays: 65, minDays: 20, maxDays: 130, trend: 'stable' as const, urgency: 'media', exams: ['Espirometria', 'TC Tórax'] },
  { specialty: 'Nefrologia', avgDays: 90, minDays: 30, maxDays: 170, trend: 'stable' as const, urgency: 'alta', exams: ['Clearance de Creatinina', 'USG Renal'] },
  { specialty: 'Oncologia', avgDays: 30, minDays: 10, maxDays: 60, trend: 'down' as const, urgency: 'critica', exams: ['Biópsia', 'PET-CT', 'Marcadores Tumorais'] },
  { specialty: 'Hematologia', avgDays: 55, minDays: 20, maxDays: 110, trend: 'stable' as const, urgency: 'alta', exams: ['Mielograma', 'Imunofenotipagem'] },
  { specialty: 'Cirurgia Geral', avgDays: 150, minDays: 60, maxDays: 300, trend: 'up' as const, urgency: 'alta', exams: ['TC Abdome', 'USG Abdome'] },
  { specialty: 'Pediatria', avgDays: 35, minDays: 10, maxDays: 70, trend: 'down' as const, urgency: 'media', exams: ['Hemograma', 'Teste do Pezinho'] },
  { specialty: 'Geriatria', avgDays: 70, minDays: 25, maxDays: 140, trend: 'stable' as const, urgency: 'media', exams: ['Avaliação Geriátrica Ampla'] },
  { specialty: 'Medicina de Família', avgDays: 15, minDays: 3, maxDays: 30, trend: 'down' as const, urgency: 'baixa', exams: ['Consulta de Rotina', 'Exames Básicos'] },
];

const EXAMS_WAIT_TIMES = [
  { name: 'Ressonância Magnética', avgDays: 120, category: 'Imagem' },
  { name: 'Tomografia Computadorizada', avgDays: 45, category: 'Imagem' },
  { name: 'Ultrassonografia', avgDays: 30, category: 'Imagem' },
  { name: 'Mamografia', avgDays: 25, category: 'Imagem' },
  { name: 'Ecocardiograma', avgDays: 60, category: 'Cardiologia' },
  { name: 'Endoscopia Digestiva', avgDays: 50, category: 'Gastro' },
  { name: 'Colonoscopia', avgDays: 70, category: 'Gastro' },
  { name: 'Eletroencefalograma', avgDays: 40, category: 'Neurologia' },
  { name: 'Espirometria', avgDays: 35, category: 'Pneumologia' },
  { name: 'Densitometria Óssea', avgDays: 55, category: 'Endócrino' },
  { name: 'Audiometria', avgDays: 45, category: 'ORL' },
  { name: 'Teste Ergométrico', avgDays: 40, category: 'Cardiologia' },
  { name: 'Biópsia', avgDays: 20, category: 'Cirurgia' },
  { name: 'PET-CT', avgDays: 30, category: 'Oncologia' },
  { name: 'Cintilografia', avgDays: 50, category: 'Nuclear' },
];

const STATES_DATA = [
  { uf: 'SP', name: 'São Paulo', modifier: 0.9 },
  { uf: 'RJ', name: 'Rio de Janeiro', modifier: 1.1 },
  { uf: 'MG', name: 'Minas Gerais', modifier: 1.0 },
  { uf: 'BA', name: 'Bahia', modifier: 1.3 },
  { uf: 'PR', name: 'Paraná', modifier: 0.85 },
  { uf: 'RS', name: 'Rio Grande do Sul', modifier: 0.9 },
  { uf: 'PE', name: 'Pernambuco', modifier: 1.2 },
  { uf: 'CE', name: 'Ceará', modifier: 1.15 },
  { uf: 'PA', name: 'Pará', modifier: 1.4 },
  { uf: 'MA', name: 'Maranhão', modifier: 1.5 },
  { uf: 'SC', name: 'Santa Catarina', modifier: 0.8 },
  { uf: 'GO', name: 'Goiás', modifier: 1.05 },
  { uf: 'AM', name: 'Amazonas', modifier: 1.6 },
  { uf: 'ES', name: 'Espírito Santo', modifier: 0.95 },
  { uf: 'MT', name: 'Mato Grosso', modifier: 1.1 },
  { uf: 'MS', name: 'Mato Grosso do Sul', modifier: 1.0 },
  { uf: 'DF', name: 'Distrito Federal', modifier: 0.85 },
  { uf: 'RN', name: 'Rio Grande do Norte', modifier: 1.2 },
  { uf: 'PB', name: 'Paraíba', modifier: 1.25 },
  { uf: 'AL', name: 'Alagoas', modifier: 1.35 },
  { uf: 'PI', name: 'Piauí', modifier: 1.4 },
  { uf: 'SE', name: 'Sergipe', modifier: 1.2 },
  { uf: 'RO', name: 'Rondônia', modifier: 1.3 },
  { uf: 'TO', name: 'Tocantins', modifier: 1.35 },
  { uf: 'AC', name: 'Acre', modifier: 1.7 },
  { uf: 'AP', name: 'Amapá', modifier: 1.65 },
  { uf: 'RR', name: 'Roraima', modifier: 1.7 },
];

const TIPS = [
  { title: 'Ligue para o 136', description: 'O Disque Saúde 136 é gratuito e permite consultar sua posição na fila, fazer reclamações e obter informações sobre o SUS.', icon: Phone },
  { title: 'Use o Meu SUS Digital', description: 'O aplicativo oficial do Ministério da Saúde permite agendar consultas, ver exames e acompanhar filas em unidades integradas.', icon: ExternalLink },
  { title: 'Procure a Ouvidoria', description: 'Se o tempo de espera for abusivo, registre uma manifestação na Ouvidoria do SUS (ouvsus.saude.gov.br).', icon: AlertTriangle },
  { title: 'Conheça seus direitos', description: 'Pacientes com câncer têm direito ao 1º tratamento em até 60 dias do diagnóstico (Lei 12.732/2012).', icon: Info },
];

function getUrgencyColor(urgency: string) {
  switch (urgency) {
    case 'critica': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'alta': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'media': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'baixa': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

function getDaysColor(days: number) {
  if (days <= 30) return 'text-green-400';
  if (days <= 60) return 'text-yellow-400';
  if (days <= 120) return 'text-orange-400';
  return 'text-red-400';
}

export default function FilaSUS() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [expandedSpecialty, setExpandedSpecialty] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'specialties' | 'exams'>('specialties');
  const [sortBy, setSortBy] = useState<'name' | 'wait' | 'urgency'>('wait');

  const stateModifier = useMemo(() => {
    const state = STATES_DATA.find(s => s.uf === selectedState);
    return state?.modifier || 1.0;
  }, [selectedState]);

  const filteredSpecialties = useMemo(() => {
    let data = WAIT_TIMES_DATA.filter(s =>
      s.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.exams.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    if (sortBy === 'wait') data.sort((a, b) => b.avgDays - a.avgDays);
    else if (sortBy === 'name') data.sort((a, b) => a.specialty.localeCompare(b.specialty));
    else if (sortBy === 'urgency') {
      const order = { critica: 0, alta: 1, media: 2, baixa: 3 };
      data.sort((a, b) => (order[a.urgency as keyof typeof order] || 3) - (order[b.urgency as keyof typeof order] || 3));
    }
    return data;
  }, [searchTerm, sortBy]);

  const filteredExams = useMemo(() => {
    return EXAMS_WAIT_TIMES.filter(e =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => b.avgDays - a.avgDays);
  }, [searchTerm]);

  const avgWait = Math.round(WAIT_TIMES_DATA.reduce((s, d) => s + d.avgDays, 0) / WAIT_TIMES_DATA.length * stateModifier);
  const longestWait = WAIT_TIMES_DATA.reduce((max, d) => Math.max(max, Math.round(d.avgDays * stateModifier)), 0);
  const shortestWait = WAIT_TIMES_DATA.reduce((min, d) => Math.min(min, Math.round(d.minDays * stateModifier)), Infinity);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Clock className="w-8 h-8 text-primary" /> Navegador da Fila do SUS
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Consulte tempos médios de espera para consultas e exames no SUS por especialidade e região.
        </p>
        <p className="text-xs text-muted-foreground mt-1 italic">
          Dados estimados com base em estatísticas públicas do DataSUS, SISREG e pesquisas do Ministério da Saúde. Tempos reais podem variar.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{avgWait}</div>
            <div className="text-xs text-muted-foreground">Média geral (dias)</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400">{longestWait}</div>
            <div className="text-xs text-muted-foreground">Maior espera (dias)</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{shortestWait}</div>
            <div className="text-xs text-muted-foreground">Menor espera (dias)</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{WAIT_TIMES_DATA.length}</div>
            <div className="text-xs text-muted-foreground">Especialidades</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar especialidade ou exame..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <select value={selectedState} onChange={e => setSelectedState(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none">
          <option value="">Brasil (média nacional)</option>
          {STATES_DATA.sort((a, b) => a.name.localeCompare(b.name)).map(s => (
            <option key={s.uf} value={s.uf}>{s.uf} - {s.name}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <Button variant={viewMode === 'specialties' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('specialties')}>
            <Stethoscope className="w-4 h-4 mr-1" /> Consultas
          </Button>
          <Button variant={viewMode === 'exams' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('exams')}>
            <Activity className="w-4 h-4 mr-1" /> Exames
          </Button>
        </div>
      </div>

      {/* Sort */}
      {viewMode === 'specialties' && (
        <div className="flex gap-2 mb-4">
          <span className="text-xs text-muted-foreground self-center">Ordenar:</span>
          {[{ id: 'wait', label: 'Tempo de espera' }, { id: 'name', label: 'Nome' }, { id: 'urgency', label: 'Urgência' }].map(s => (
            <button key={s.id} onClick={() => setSortBy(s.id as any)}
              className={`text-xs px-3 py-1 rounded-full transition-all ${sortBy === s.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Specialties List */}
      {viewMode === 'specialties' && (
        <div className="space-y-3">
          {filteredSpecialties.map(spec => {
            const adjustedAvg = Math.round(spec.avgDays * stateModifier);
            const adjustedMin = Math.round(spec.minDays * stateModifier);
            const adjustedMax = Math.round(spec.maxDays * stateModifier);
            const isExpanded = expandedSpecialty === spec.specialty;

            return (
              <Card key={spec.specialty} className="bg-card border-border hover:border-primary/30 transition-all">
                <button className="w-full text-left p-4" onClick={() => setExpandedSpecialty(isExpanded ? null : spec.specialty)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm">{spec.specialty}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge className={`text-[10px] ${getUrgencyColor(spec.urgency)}`}>
                            {spec.urgency === 'critica' ? 'Prioridade Crítica' : spec.urgency === 'alta' ? 'Alta demanda' : spec.urgency === 'media' ? 'Demanda média' : 'Demanda baixa'}
                          </Badge>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            {spec.trend === 'up' ? <TrendingUp className="w-3 h-3 text-red-400" /> : spec.trend === 'down' ? <TrendingDown className="w-3 h-3 text-green-400" /> : <span className="w-3 h-3 text-yellow-400">→</span>}
                            {spec.trend === 'up' ? 'Aumentando' : spec.trend === 'down' ? 'Diminuindo' : 'Estável'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className={`text-xl font-bold ${getDaysColor(adjustedAvg)}`}>{adjustedAvg}</div>
                        <div className="text-[10px] text-muted-foreground">dias (média)</div>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <CardContent className="pt-0 pb-4 px-4 border-t border-border mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                      <div className="bg-green-500/5 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-green-400">{adjustedMin} dias</div>
                        <div className="text-xs text-muted-foreground">Melhor cenário</div>
                      </div>
                      <div className="bg-yellow-500/5 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-yellow-400">{adjustedAvg} dias</div>
                        <div className="text-xs text-muted-foreground">Tempo médio</div>
                      </div>
                      <div className="bg-red-500/5 rounded-xl p-3 text-center">
                        <div className="text-lg font-bold text-red-400">{adjustedMax} dias</div>
                        <div className="text-xs text-muted-foreground">Pior cenário</div>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                        <span>{adjustedMin}d</span>
                        <span>{adjustedMax}d</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full" style={{ width: `${Math.min((adjustedAvg / adjustedMax) * 100, 100)}%` }} />
                      </div>
                    </div>

                    {/* Exams */}
                    <div className="mt-3">
                      <div className="text-xs font-semibold text-primary mb-2">Exames relacionados:</div>
                      <div className="flex flex-wrap gap-2">
                        {spec.exams.map(exam => (
                          <span key={exam} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-lg">{exam}</span>
                        ))}
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="mt-3 bg-blue-500/5 rounded-xl p-3">
                      <div className="text-xs font-semibold text-blue-400 mb-1">Como agilizar:</div>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li>• Ligue 136 para verificar sua posição na fila</li>
                        <li>• Verifique disponibilidade em municípios vizinhos</li>
                        <li>• Use o Meu SUS Digital para acompanhar agendamentos</li>
                        {spec.urgency === 'critica' && <li className="text-red-400">• Casos urgentes: procure a UPA ou emergência hospitalar</li>}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {/* Exams List */}
      {viewMode === 'exams' && (
        <div className="space-y-2">
          {filteredExams.map(exam => {
            const adjusted = Math.round(exam.avgDays * stateModifier);
            return (
              <div key={exam.name} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border">
                <div>
                  <div className="font-medium text-sm">{exam.name}</div>
                  <div className="text-xs text-muted-foreground">{exam.category}</div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getDaysColor(adjusted)}`}>{adjusted}</div>
                  <div className="text-[10px] text-muted-foreground">dias</div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" /> Dicas para Navegar o SUS
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TIPS.map((tip, i) => (
            <Card key={i} className="bg-card border-border">
              <CardContent className="p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <tip.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{tip.title}</div>
                  <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
        <div className="flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <strong className="text-yellow-400">Aviso:</strong> Os tempos apresentados são estimativas baseadas em dados públicos e pesquisas. 
            Os tempos reais variam conforme município, unidade de saúde e demanda local. 
            Para informações precisas sobre sua posição na fila, ligue para o <strong>136</strong> ou acesse o <strong>Meu SUS Digital</strong>.
          </div>
        </div>
      </div>
    </div>
  );
}
