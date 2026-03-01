/**
 * CarteiraVacinacao — Carteira de Vacinação Digital
 * Calendário Nacional de Vacinação com lembretes e registro familiar
 */
import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Syringe, Search, Calendar, Baby, User, UserCheck, ChevronDown, ChevronUp, AlertTriangle, Info, Shield, Clock, CheckCircle2, XCircle, Heart } from 'lucide-react';

type AgeGroup = 'crianca' | 'adolescente' | 'adulto' | 'idoso' | 'gestante';

interface Vaccine {
  id: string;
  name: string;
  fullName: string;
  diseases: string[];
  doses: { dose: string; age: string; interval?: string }[];
  ageGroups: AgeGroup[];
  route: string;
  contraindications: string[];
  sideEffects: string[];
  notes: string;
  available: 'SUS' | 'Particular' | 'Ambos';
  priority: 'essencial' | 'recomendada' | 'especial';
}

const VACCINES: Vaccine[] = [
  {
    id: 'bcg', name: 'BCG', fullName: 'Bacilo de Calmette-Guérin',
    diseases: ['Tuberculose miliar', 'Meningite tuberculosa'],
    doses: [{ dose: 'Dose única', age: 'Ao nascer' }],
    ageGroups: ['crianca'], route: 'Intradérmica',
    contraindications: ['Imunossuprimidos', 'RN < 2kg', 'HIV sintomático'],
    sideEffects: ['Úlcera local', 'Cicatriz', 'Linfadenopatia axilar'],
    notes: 'Deve ser aplicada o mais precocemente possível, preferencialmente nas primeiras 12 horas de vida.',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'hepb', name: 'Hepatite B', fullName: 'Vacina Hepatite B recombinante',
    diseases: ['Hepatite B'],
    doses: [{ dose: '1ª dose', age: 'Ao nascer (até 12h)' }, { dose: '2ª dose', age: '1 mês' }, { dose: '3ª dose', age: '6 meses' }],
    ageGroups: ['crianca', 'adulto'], route: 'Intramuscular',
    contraindications: ['Alergia grave a componentes'],
    sideEffects: ['Dor local', 'Febre baixa'],
    notes: 'A 1ª dose deve ser aplicada nas primeiras 12 horas de vida. Adultos não vacinados devem completar o esquema.',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'penta', name: 'Pentavalente', fullName: 'DTP + HB + Hib',
    diseases: ['Difteria', 'Tétano', 'Coqueluche', 'Hepatite B', 'Meningite por Hib'],
    doses: [{ dose: '1ª dose', age: '2 meses' }, { dose: '2ª dose', age: '4 meses' }, { dose: '3ª dose', age: '6 meses' }],
    ageGroups: ['crianca'], route: 'Intramuscular',
    contraindications: ['Encefalopatia nos 7 dias pós-dose anterior', 'Convulsão nas 72h pós-dose'],
    sideEffects: ['Febre', 'Irritabilidade', 'Dor e vermelhidão local'],
    notes: 'Esquema básico com 3 doses. Reforço com DTP aos 15 meses e 4 anos.',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'vip', name: 'VIP/VOP', fullName: 'Vacina Inativada Poliomielite / Oral',
    diseases: ['Poliomielite (paralisia infantil)'],
    doses: [{ dose: '1ª dose (VIP)', age: '2 meses' }, { dose: '2ª dose (VIP)', age: '4 meses' }, { dose: '3ª dose (VIP)', age: '6 meses' }, { dose: '1º reforço (VOP)', age: '15 meses' }, { dose: '2º reforço (VOP)', age: '4 anos' }],
    ageGroups: ['crianca'], route: 'IM (VIP) / Oral (VOP)',
    contraindications: ['VOP: imunossuprimidos, contactantes de imunossuprimidos'],
    sideEffects: ['Dor local (VIP)', 'Raramente: VAPP (VOP)'],
    notes: 'Brasil usa esquema sequencial: 3 doses de VIP + 2 reforços de VOP. Campanhas anuais de vacinação.',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'pneumo10', name: 'Pneumocócica 10v', fullName: 'Vacina Pneumocócica 10-valente conjugada',
    diseases: ['Pneumonia', 'Meningite pneumocócica', 'Otite média'],
    doses: [{ dose: '1ª dose', age: '2 meses' }, { dose: '2ª dose', age: '4 meses' }, { dose: 'Reforço', age: '12 meses' }],
    ageGroups: ['crianca'], route: 'Intramuscular',
    contraindications: ['Alergia grave a componentes'],
    sideEffects: ['Febre', 'Dor local', 'Irritabilidade'],
    notes: 'Protege contra 10 sorotipos de pneumococo. Disponível no SUS para crianças até 5 anos.',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'rotavirus', name: 'Rotavírus', fullName: 'Vacina Rotavírus Humano G1P1',
    diseases: ['Diarreia grave por rotavírus'],
    doses: [{ dose: '1ª dose', age: '2 meses' }, { dose: '2ª dose', age: '4 meses' }],
    ageGroups: ['crianca'], route: 'Oral',
    contraindications: ['Imunossuprimidos', 'Invaginação intestinal prévia', 'Malformação GI'],
    sideEffects: ['Irritabilidade', 'Diarreia leve', 'Vômitos'],
    notes: '1ª dose: 1m15d a 3m15d. 2ª dose: 3m15d a 7m29d. Intervalo mínimo de 30 dias.',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'meningo_c', name: 'Meningocócica C', fullName: 'Vacina Meningocócica C conjugada',
    diseases: ['Meningite meningocócica tipo C'],
    doses: [{ dose: '1ª dose', age: '3 meses' }, { dose: '2ª dose', age: '5 meses' }, { dose: 'Reforço', age: '12 meses' }, { dose: 'Reforço', age: '11-12 anos' }],
    ageGroups: ['crianca', 'adolescente'], route: 'Intramuscular',
    contraindications: ['Alergia grave a componentes'],
    sideEffects: ['Dor local', 'Febre', 'Irritabilidade'],
    notes: 'Reforço na adolescência para manter proteção. Sorogrupo C é o mais prevalente no Brasil.',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'triplice_viral', name: 'Tríplice Viral', fullName: 'SCR - Sarampo, Caxumba, Rubéola',
    diseases: ['Sarampo', 'Caxumba', 'Rubéola'],
    doses: [{ dose: '1ª dose', age: '12 meses' }, { dose: '2ª dose', age: '15 meses (tetra viral)' }],
    ageGroups: ['crianca', 'adulto'], route: 'Subcutânea',
    contraindications: ['Gestantes', 'Imunossuprimidos graves', 'Alergia a neomicina'],
    sideEffects: ['Febre', 'Exantema leve', 'Artralgia (rubéola)'],
    notes: 'Adultos até 29 anos: 2 doses. 30-59 anos: 1 dose. Fundamental para eliminação do sarampo.',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'febre_amarela', name: 'Febre Amarela', fullName: 'Vacina Febre Amarela atenuada',
    diseases: ['Febre Amarela'],
    doses: [{ dose: 'Dose única', age: '9 meses' }, { dose: 'Reforço', age: '4 anos' }],
    ageGroups: ['crianca', 'adulto'], route: 'Subcutânea',
    contraindications: ['Gestantes', 'Imunossuprimidos', 'Alergia a ovo grave', '> 60 anos (avaliar risco)'],
    sideEffects: ['Febre', 'Cefaleia', 'Mialgia', 'Raramente: doença viscerotrópica'],
    notes: 'Obrigatória para viajantes a áreas endêmicas. Dose única é considerada suficiente para proteção ao longo da vida (OMS).',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'hepatite_a', name: 'Hepatite A', fullName: 'Vacina Hepatite A inativada',
    diseases: ['Hepatite A'],
    doses: [{ dose: 'Dose única', age: '15 meses' }],
    ageGroups: ['crianca'], route: 'Intramuscular',
    contraindications: ['Alergia grave a componentes'],
    sideEffects: ['Dor local', 'Febre baixa'],
    notes: 'No SUS: dose única aos 15 meses. Na rede privada: 2 doses (12 e 18 meses) para melhor proteção.',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'varicela', name: 'Varicela', fullName: 'Vacina Varicela atenuada',
    diseases: ['Catapora (varicela)'],
    doses: [{ dose: '1ª dose', age: '15 meses (tetra viral)' }, { dose: '2ª dose', age: '4 anos' }],
    ageGroups: ['crianca'], route: 'Subcutânea',
    contraindications: ['Gestantes', 'Imunossuprimidos graves'],
    sideEffects: ['Febre', 'Exantema vesicular leve'],
    notes: 'A 1ª dose é dada como Tetra Viral (SCRV) aos 15 meses. A 2ª dose é varicela isolada aos 4 anos.',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'hpv', name: 'HPV', fullName: 'Vacina HPV quadrivalente',
    diseases: ['Câncer de colo de útero', 'Câncer de pênis', 'Câncer anal', 'Verrugas genitais'],
    doses: [{ dose: '1ª dose', age: '9-14 anos' }, { dose: '2ª dose', age: '6 meses após a 1ª' }],
    ageGroups: ['adolescente'], route: 'Intramuscular',
    contraindications: ['Gestantes', 'Alergia grave a componentes'],
    sideEffects: ['Dor local', 'Cefaleia', 'Síncope (rara)'],
    notes: 'Meninos e meninas de 9 a 14 anos: 2 doses. Imunossuprimidos até 45 anos: 3 doses. Previne 70% dos cânceres de colo uterino.',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'dt', name: 'dT (Dupla Adulto)', fullName: 'Vacina Difteria e Tétano adulto',
    diseases: ['Difteria', 'Tétano'],
    doses: [{ dose: '1ª dose', age: 'A partir de 7 anos' }, { dose: '2ª dose', age: '2 meses após 1ª' }, { dose: '3ª dose', age: '4 meses após 2ª' }, { dose: 'Reforço', age: 'A cada 10 anos' }],
    ageGroups: ['adulto', 'idoso', 'gestante'], route: 'Intramuscular',
    contraindications: ['Alergia grave a componentes'],
    sideEffects: ['Dor local', 'Febre baixa'],
    notes: 'Reforço a cada 10 anos para toda a vida. Gestantes devem receber dTpa (com componente pertussis) a partir da 20ª semana.',
    available: 'SUS', priority: 'essencial',
  },
  {
    id: 'influenza', name: 'Influenza (Gripe)', fullName: 'Vacina Influenza trivalente/quadrivalente',
    diseases: ['Gripe (Influenza A e B)'],
    doses: [{ dose: 'Dose anual', age: 'Campanha (abril-maio)' }],
    ageGroups: ['crianca', 'adulto', 'idoso', 'gestante'], route: 'Intramuscular',
    contraindications: ['Alergia grave a ovo (avaliar)', 'Síndrome de Guillain-Barré pós-vacina prévia'],
    sideEffects: ['Dor local', 'Febre baixa', 'Mialgia'],
    notes: 'Grupos prioritários no SUS: idosos ≥60, crianças 6m-5a, gestantes, puérperas, profissionais de saúde, professores, indígenas.',
    available: 'SUS', priority: 'recomendada',
  },
  {
    id: 'covid19', name: 'COVID-19', fullName: 'Vacina COVID-19 (atualizada)',
    diseases: ['COVID-19 (SARS-CoV-2)'],
    doses: [{ dose: 'Esquema primário', age: '6 meses+' }, { dose: 'Reforço anual', age: 'Grupos prioritários' }],
    ageGroups: ['crianca', 'adulto', 'idoso', 'gestante'], route: 'Intramuscular',
    contraindications: ['Alergia grave a componentes da vacina'],
    sideEffects: ['Dor local', 'Fadiga', 'Cefaleia', 'Mialgia', 'Febre'],
    notes: 'Esquema atualizado conforme recomendações do MS. Reforço anual para grupos de risco (idosos, imunossuprimidos, gestantes).',
    available: 'SUS', priority: 'recomendada',
  },
  {
    id: 'pneumo23', name: 'Pneumocócica 23v', fullName: 'Vacina Pneumocócica 23-valente polissacarídica',
    diseases: ['Pneumonia', 'Meningite', 'Sepse pneumocócica'],
    doses: [{ dose: '1ª dose', age: '≥ 60 anos' }, { dose: 'Reforço', age: '5 anos após 1ª dose' }],
    ageGroups: ['idoso'], route: 'Intramuscular',
    contraindications: ['Alergia grave a componentes'],
    sideEffects: ['Dor local', 'Febre baixa'],
    notes: 'Disponível no SUS para idosos institucionalizados e em CRIE para grupos especiais. Na rede privada para todos ≥60 anos.',
    available: 'Ambos', priority: 'recomendada',
  },
  {
    id: 'herpes_zoster', name: 'Herpes Zóster', fullName: 'Vacina Herpes Zóster recombinante (Shingrix)',
    diseases: ['Herpes Zóster (cobreiro)', 'Neuralgia pós-herpética'],
    doses: [{ dose: '1ª dose', age: '≥ 50 anos' }, { dose: '2ª dose', age: '2-6 meses após 1ª' }],
    ageGroups: ['idoso'], route: 'Intramuscular',
    contraindications: ['Alergia grave a componentes'],
    sideEffects: ['Dor local intensa', 'Mialgia', 'Fadiga', 'Febre'],
    notes: 'Eficácia > 90% mesmo em idosos. Disponível apenas na rede privada (custo ~R$ 800-1.200 por dose).',
    available: 'Particular', priority: 'recomendada',
  },
  {
    id: 'dtpa_gestante', name: 'dTpa (Gestante)', fullName: 'Tríplice Bacteriana Acelular Adulto',
    diseases: ['Difteria', 'Tétano', 'Coqueluche'],
    doses: [{ dose: 'Dose única', age: '20ª semana de gestação (cada gravidez)' }],
    ageGroups: ['gestante'], route: 'Intramuscular',
    contraindications: ['Alergia grave a componentes'],
    sideEffects: ['Dor local', 'Febre baixa'],
    notes: 'Fundamental para proteger o recém-nascido contra coqueluche nos primeiros meses de vida (anticorpos maternos).',
    available: 'SUS', priority: 'essencial',
  },
];

const AGE_GROUP_CONFIG: Record<AgeGroup, { label: string; icon: any; color: string; description: string }> = {
  crianca: { label: 'Criança (0-9 anos)', icon: Baby, color: '#3B82F6', description: 'Calendário básico da criança' },
  adolescente: { label: 'Adolescente (10-19 anos)', icon: User, color: '#8B5CF6', description: 'Reforços e novas vacinas' },
  adulto: { label: 'Adulto (20-59 anos)', icon: UserCheck, color: '#10B981', description: 'Manutenção e atualização' },
  idoso: { label: 'Idoso (60+ anos)', icon: Heart, color: '#F59E0B', description: 'Proteção especial' },
  gestante: { label: 'Gestante', icon: Baby, color: '#EC4899', description: 'Proteção mãe e bebê' },
};

export default function CarteiraVacinacao() {
  const [selectedGroup, setSelectedGroup] = useState<AgeGroup>('crianca');
  const [expandedVaccine, setExpandedVaccine] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailable, setFilterAvailable] = useState<string>('');

  const filteredVaccines = useMemo(() => {
    return VACCINES.filter(v => {
      const matchGroup = v.ageGroups.includes(selectedGroup);
      const matchSearch = !searchTerm || v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.diseases.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchAvailable = !filterAvailable || v.available === filterAvailable;
      return matchGroup && matchSearch && matchAvailable;
    });
  }, [selectedGroup, searchTerm, filterAvailable]);

  const groupConfig = AGE_GROUP_CONFIG[selectedGroup];
  const totalVaccines = filteredVaccines.length;
  const essentialCount = filteredVaccines.filter(v => v.priority === 'essencial').length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
          <Syringe className="w-8 h-8 text-primary" /> Carteira de Vacinação Digital
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Calendário Nacional de Vacinação completo. Consulte vacinas por faixa etária, doses e disponibilidade no SUS.
        </p>
      </div>

      {/* Age Group Selector */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {(Object.entries(AGE_GROUP_CONFIG) as [AgeGroup, typeof AGE_GROUP_CONFIG[AgeGroup]][]).map(([key, config]) => {
          const Icon = config.icon;
          const count = VACCINES.filter(v => v.ageGroups.includes(key)).length;
          return (
            <button key={key} onClick={() => setSelectedGroup(key)}
              className={`p-3 rounded-xl text-center transition-all border ${selectedGroup === key ? 'ring-2 ring-primary bg-primary/10 border-primary/30' : 'bg-card border-border hover:bg-accent'}`}>
              <Icon className="w-6 h-6 mx-auto mb-1" style={{ color: config.color }} />
              <div className="font-semibold text-xs" style={{ color: config.color }}>{config.label.split('(')[0].trim()}</div>
              <div className="text-[10px] text-muted-foreground">{count} vacinas</div>
            </button>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-primary">{totalVaccines}</div>
            <div className="text-[10px] text-muted-foreground">Vacinas para {groupConfig.label.split('(')[0].trim()}</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-green-400">{essentialCount}</div>
            <div className="text-[10px] text-muted-foreground">Essenciais</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-3 text-center">
            <div className="text-xl font-bold text-yellow-400">{filteredVaccines.reduce((s, v) => s + v.doses.length, 0)}</div>
            <div className="text-[10px] text-muted-foreground">Total de doses</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" placeholder="Buscar vacina ou doença..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none" />
        </div>
        <select value={filterAvailable} onChange={e => setFilterAvailable(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none">
          <option value="">Todas</option>
          <option value="SUS">Disponível no SUS</option>
          <option value="Particular">Rede privada</option>
          <option value="Ambos">SUS + Privada</option>
        </select>
      </div>

      {/* Vaccine List */}
      <div className="space-y-3">
        {filteredVaccines.map(vaccine => {
          const isExpanded = expandedVaccine === vaccine.id;
          return (
            <Card key={vaccine.id} className="bg-card border-border hover:border-primary/30 transition-all">
              <button className="w-full text-left p-4" onClick={() => setExpandedVaccine(isExpanded ? null : vaccine.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${vaccine.priority === 'essencial' ? 'bg-green-500/10' : vaccine.priority === 'recomendada' ? 'bg-yellow-500/10' : 'bg-blue-500/10'}`}>
                      <Syringe className={`w-5 h-5 ${vaccine.priority === 'essencial' ? 'text-green-400' : vaccine.priority === 'recomendada' ? 'text-yellow-400' : 'text-blue-400'}`} />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{vaccine.name}</div>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <Badge className={`text-[10px] ${vaccine.available === 'SUS' ? 'bg-green-500/20 text-green-400' : vaccine.available === 'Particular' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                          {vaccine.available}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">{vaccine.doses.length} dose{vaccine.doses.length > 1 ? 's' : ''}</Badge>
                        {vaccine.priority === 'essencial' && <Badge className="text-[10px] bg-green-500/20 text-green-400">Essencial</Badge>}
                      </div>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </div>
              </button>

              {isExpanded && (
                <CardContent className="pt-0 pb-4 px-4 border-t border-border mt-2">
                  <div className="mt-3 space-y-4">
                    {/* Full Name */}
                    <div>
                      <div className="text-xs font-semibold text-primary mb-1">Nome completo</div>
                      <div className="text-sm text-muted-foreground">{vaccine.fullName}</div>
                    </div>

                    {/* Diseases */}
                    <div>
                      <div className="text-xs font-semibold text-primary mb-1">Protege contra:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {vaccine.diseases.map(d => (
                          <span key={d} className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-lg">{d}</span>
                        ))}
                      </div>
                    </div>

                    {/* Doses Schedule */}
                    <div>
                      <div className="text-xs font-semibold text-primary mb-2">Esquema de doses:</div>
                      <div className="space-y-2">
                        {vaccine.doses.map((dose, i) => (
                          <div key={i} className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-primary">{i + 1}</span>
                            </div>
                            <div>
                              <div className="font-medium text-xs">{dose.dose}</div>
                              <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Calendar className="w-3 h-3" /> {dose.age}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex items-center gap-2">
                      <div className="text-xs font-semibold text-primary">Via de administração:</div>
                      <Badge variant="outline" className="text-[10px]">{vaccine.route}</Badge>
                    </div>

                    {/* Side Effects */}
                    <div>
                      <div className="text-xs font-semibold text-yellow-400 mb-1">Efeitos adversos comuns:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {vaccine.sideEffects.map(se => (
                          <span key={se} className="text-xs bg-yellow-500/10 text-yellow-400 px-2 py-0.5 rounded-lg">{se}</span>
                        ))}
                      </div>
                    </div>

                    {/* Contraindications */}
                    <div>
                      <div className="text-xs font-semibold text-red-400 mb-1">Contraindicações:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {vaccine.contraindications.map(ci => (
                          <span key={ci} className="text-xs bg-red-500/10 text-red-400 px-2 py-0.5 rounded-lg">{ci}</span>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-blue-500/5 rounded-xl p-3 border border-blue-500/10">
                      <div className="flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <p className="text-xs text-muted-foreground">{vaccine.notes}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {filteredVaccines.length === 0 && (
        <div className="text-center py-12">
          <Syringe className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhuma vacina encontrada para os filtros selecionados.</p>
        </div>
      )}

      {/* Important Notes */}
      <div className="mt-8 space-y-3">
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-4 flex items-start gap-3">
            <Shield className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm text-green-400">Vacinas são seguras e salvam vidas</div>
              <p className="text-xs text-muted-foreground mt-1">
                O Programa Nacional de Imunizações (PNI) do Brasil é referência mundial. Todas as vacinas do calendário passam por rigorosos testes de segurança e eficácia antes de serem aprovadas pela ANVISA.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500/5 border-yellow-500/20">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-sm text-yellow-400">Caderneta perdida?</div>
              <p className="text-xs text-muted-foreground mt-1">
                Se perdeu sua caderneta de vacinação, procure a UBS mais próxima. O profissional de saúde pode consultar o sistema e-SUS e reconstruir seu histórico vacinal. Na dúvida, é seguro revacinar.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
