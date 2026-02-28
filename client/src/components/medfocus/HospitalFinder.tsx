/**
 * HospitalFinder — Encontre Hospitais e Clínicas
 * Mapeamento de hospitais e clínicas do Brasil por cidade, especialidade e convênio
 * Dados baseados no CNES (Cadastro Nacional de Estabelecimentos de Saúde)
 */
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2, MapPin, Phone, Globe, Star, Search, Filter,
  Stethoscope, Clock, Shield, Users, ChevronDown, ChevronUp,
  ExternalLink, Heart, Brain, Baby, Eye, Bone, Activity
} from 'lucide-react';
import { ESTADOS, CIDADES_POR_ESTADO } from '@/data/cidadesBrasil';

// ─── Hospital/Clinic Types ────────────────────────────────────
interface Hospital {
  id: string;
  name: string;
  type: 'hospital_geral' | 'hospital_especializado' | 'upa' | 'clinica' | 'laboratorio' | 'pronto_socorro' | 'maternidade';
  estado: string;
  cidade: string;
  endereco: string;
  telefone: string;
  website?: string;
  cnes?: string;
  sus: boolean;
  particular: boolean;
  convenios: string[];
  especialidades: string[];
  servicos: string[];
  leitos?: number;
  emergencia24h: boolean;
  uti: boolean;
  rating: number;
  avaliacoes: number;
  horario: string;
  destaque?: string;
}

const TIPO_LABELS: Record<string, { label: string; color: string }> = {
  hospital_geral: { label: 'Hospital Geral', color: 'bg-blue-500/20 text-blue-400' },
  hospital_especializado: { label: 'Hospital Especializado', color: 'bg-purple-500/20 text-purple-400' },
  upa: { label: 'UPA 24h', color: 'bg-red-500/20 text-red-400' },
  clinica: { label: 'Clínica', color: 'bg-green-500/20 text-green-400' },
  laboratorio: { label: 'Laboratório', color: 'bg-yellow-500/20 text-yellow-400' },
  pronto_socorro: { label: 'Pronto-Socorro', color: 'bg-orange-500/20 text-orange-400' },
  maternidade: { label: 'Maternidade', color: 'bg-pink-500/20 text-pink-400' },
};

const ESPECIALIDADES_HOSPITAL = [
  'Cardiologia', 'Ortopedia', 'Neurologia', 'Oncologia', 'Pediatria',
  'Ginecologia', 'Obstetrícia', 'Cirurgia Geral', 'Urologia', 'Oftalmologia',
  'Otorrinolaringologia', 'Dermatologia', 'Psiquiatria', 'Pneumologia',
  'Gastroenterologia', 'Nefrologia', 'Endocrinologia', 'Reumatologia',
  'Infectologia', 'Hematologia', 'Geriatria', 'Medicina de Emergência',
  'Anestesiologia', 'Radiologia', 'Patologia', 'Medicina Intensiva',
  'Cirurgia Cardiovascular', 'Neurocirurgia', 'Cirurgia Plástica',
  'Cirurgia Pediátrica', 'Mastologia', 'Proctologia', 'Medicina do Trabalho',
];

const CONVENIOS = [
  'SUS', 'Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'NotreDame Intermédica',
  'Hapvida', 'Porto Seguro', 'Cassi', 'Geap', 'Ipsemg', 'Saúde Caixa',
  'Particular', 'Prevent Senior', 'São Francisco', 'Golden Cross',
];

// ─── Hospital Database ────────────────────────────────────────
const HOSPITALS: Hospital[] = [
  // === MATO GROSSO ===
  { id: 'hgc', name: 'Hospital Geral de Cuiabá', type: 'hospital_geral', estado: 'MT', cidade: 'Cuiabá', endereco: 'Rua 13 de Junho, 2101 - Centro', telefone: '(65) 3623-0000', website: 'https://www.hgc.mt.gov.br', cnes: '2504103', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cirurgia Geral', 'Ortopedia', 'Neurologia', 'Cardiologia', 'Medicina de Emergência', 'Medicina Intensiva'], servicos: ['Pronto-Socorro 24h', 'UTI Adulto', 'Centro Cirúrgico', 'Radiologia', 'Laboratório'], leitos: 250, emergencia24h: true, uti: true, rating: 4.0, avaliacoes: 342, horario: '24 horas', destaque: 'Maior hospital público de MT' },
  { id: 'hsc_cba', name: 'Hospital Santa Casa de Cuiabá', type: 'hospital_geral', estado: 'MT', cidade: 'Cuiabá', endereco: 'Praça do Seminário, s/n - Centro', telefone: '(65) 3624-1000', website: 'https://www.santacasacuiaba.com.br', cnes: '2504200', sus: true, particular: true, convenios: ['SUS', 'Unimed', 'Bradesco Saúde', 'SulAmérica', 'Hapvida'], especialidades: ['Cardiologia', 'Oncologia', 'Ortopedia', 'Neurologia', 'Cirurgia Geral', 'Pediatria', 'Obstetrícia', 'Urologia'], servicos: ['Pronto-Socorro 24h', 'UTI Adulto', 'UTI Neonatal', 'Centro Cirúrgico', 'Hemodinâmica', 'Quimioterapia'], leitos: 400, emergencia24h: true, uti: true, rating: 4.2, avaliacoes: 567, horario: '24 horas', destaque: 'Referência em cardiologia e oncologia' },
  { id: 'hsjc', name: 'Hospital São Judas Tadeu', type: 'hospital_geral', estado: 'MT', cidade: 'Cuiabá', endereco: 'Av. Beira Rio, 3000 - Jardim Europa', telefone: '(65) 3645-5000', sus: false, particular: true, convenios: ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Particular'], especialidades: ['Cardiologia', 'Ortopedia', 'Neurologia', 'Cirurgia Geral', 'Urologia', 'Oftalmologia'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Radiologia'], leitos: 150, emergencia24h: true, uti: true, rating: 4.5, avaliacoes: 234, horario: '24 horas' },
  { id: 'hmu_tgs', name: 'Hospital Municipal de Tangará da Serra', type: 'hospital_geral', estado: 'MT', cidade: 'Tangará da Serra', endereco: 'Av. Brasil, 1500 - Centro', telefone: '(65) 3326-1000', cnes: '2505100', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cirurgia Geral', 'Pediatria', 'Obstetrícia', 'Medicina de Emergência'], servicos: ['Pronto-Socorro 24h', 'Centro Cirúrgico', 'Maternidade', 'Laboratório'], leitos: 80, emergencia24h: true, uti: false, rating: 3.8, avaliacoes: 156, horario: '24 horas' },
  { id: 'clinica_tgs1', name: 'Clínica São Lucas', type: 'clinica', estado: 'MT', cidade: 'Tangará da Serra', endereco: 'Rua Cuiabá, 850 - Centro', telefone: '(65) 3326-2500', sus: false, particular: true, convenios: ['Unimed', 'Hapvida', 'Particular'], especialidades: ['Cardiologia', 'Ortopedia', 'Dermatologia', 'Endocrinologia', 'Ginecologia'], servicos: ['Consultas', 'Exames', 'Pequenas Cirurgias'], emergencia24h: false, uti: false, rating: 4.3, avaliacoes: 89, horario: 'Seg-Sex 7h-18h, Sáb 7h-12h' },
  { id: 'upa_tgs', name: 'UPA 24h Tangará da Serra', type: 'upa', estado: 'MT', cidade: 'Tangará da Serra', endereco: 'Av. Tancredo Neves, 1200', telefone: '(65) 3326-3000', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Medicina de Emergência'], servicos: ['Atendimento de Urgência 24h', 'Raio-X', 'Laboratório'], emergencia24h: true, uti: false, rating: 3.5, avaliacoes: 210, horario: '24 horas' },
  // === SÃO PAULO ===
  { id: 'hcfmusp', name: 'Hospital das Clínicas da FMUSP', type: 'hospital_geral', estado: 'SP', cidade: 'São Paulo', endereco: 'Av. Dr. Enéas Carvalho de Aguiar, 255 - Cerqueira César', telefone: '(11) 2661-0000', website: 'https://www.hc.fm.usp.br', cnes: '2077485', sus: true, particular: true, convenios: ['SUS', 'Particular'], especialidades: ['Cardiologia', 'Oncologia', 'Neurologia', 'Ortopedia', 'Transplantes', 'Neurocirurgia', 'Cirurgia Cardiovascular', 'Hematologia', 'Reumatologia', 'Endocrinologia', 'Nefrologia', 'Pneumologia', 'Gastroenterologia', 'Infectologia', 'Dermatologia', 'Oftalmologia', 'Otorrinolaringologia', 'Psiquiatria', 'Pediatria', 'Ginecologia', 'Obstetrícia', 'Urologia', 'Cirurgia Plástica', 'Geriatria', 'Medicina Intensiva'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes', 'Radioterapia', 'Quimioterapia', 'Hemodinâmica', 'Ressonância Magnética', 'PET-CT'], leitos: 2400, emergencia24h: true, uti: true, rating: 4.3, avaliacoes: 2100, horario: '24 horas', destaque: 'Maior hospital da América Latina' },
  { id: 'einstein', name: 'Hospital Israelita Albert Einstein', type: 'hospital_geral', estado: 'SP', cidade: 'São Paulo', endereco: 'Av. Albert Einstein, 627 - Morumbi', telefone: '(11) 2151-1233', website: 'https://www.einstein.br', cnes: '2688689', sus: false, particular: true, convenios: ['Bradesco Saúde', 'SulAmérica', 'Amil', 'Porto Seguro', 'Particular'], especialidades: ['Cardiologia', 'Oncologia', 'Neurologia', 'Ortopedia', 'Transplantes', 'Neurocirurgia', 'Cirurgia Robótica', 'Medicina Intensiva'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes', 'Robótica', 'PET-CT', 'RM 3T'], leitos: 700, emergencia24h: true, uti: true, rating: 4.8, avaliacoes: 3500, horario: '24 horas', destaque: 'Top 1 América Latina (Newsweek)' },
  { id: 'sirio', name: 'Hospital Sírio-Libanês', type: 'hospital_geral', estado: 'SP', cidade: 'São Paulo', endereco: 'Rua Dona Adma Jafet, 91 - Bela Vista', telefone: '(11) 3394-0200', website: 'https://www.hospitalsiriolibanes.org.br', cnes: '2077396', sus: false, particular: true, convenios: ['Bradesco Saúde', 'SulAmérica', 'Particular'], especialidades: ['Oncologia', 'Cardiologia', 'Neurologia', 'Transplantes', 'Cirurgia Robótica'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes', 'Oncologia Integrativa'], leitos: 500, emergencia24h: true, uti: true, rating: 4.7, avaliacoes: 2800, horario: '24 horas', destaque: 'Referência em oncologia' },
  { id: 'incor', name: 'InCor - Instituto do Coração', type: 'hospital_especializado', estado: 'SP', cidade: 'São Paulo', endereco: 'Av. Dr. Enéas Carvalho de Aguiar, 44 - Cerqueira César', telefone: '(11) 2661-5000', website: 'https://www.incor.usp.br', cnes: '2077477', sus: true, particular: true, convenios: ['SUS', 'Particular'], especialidades: ['Cardiologia', 'Cirurgia Cardiovascular', 'Medicina Intensiva'], servicos: ['Hemodinâmica', 'Cirurgia Cardíaca', 'Transplante Cardíaco', 'UTI Cardiológica'], leitos: 500, emergencia24h: true, uti: true, rating: 4.6, avaliacoes: 1200, horario: '24 horas', destaque: 'Maior centro cardiológico da América Latina' },
  // === RIO DE JANEIRO ===
  { id: 'copa_dor', name: 'Hospital Copa D\'Or', type: 'hospital_geral', estado: 'RJ', cidade: 'Rio de Janeiro', endereco: 'Rua Figueiredo Magalhães, 875 - Copacabana', telefone: '(21) 2545-3600', website: 'https://www.copadorsaoluiz.com.br', sus: false, particular: true, convenios: ['Bradesco Saúde', 'SulAmérica', 'Amil', 'Particular'], especialidades: ['Cardiologia', 'Ortopedia', 'Neurologia', 'Oncologia', 'Cirurgia Geral'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Hemodinâmica'], leitos: 300, emergencia24h: true, uti: true, rating: 4.5, avaliacoes: 1500, horario: '24 horas' },
  { id: 'inca', name: 'INCA - Instituto Nacional de Câncer', type: 'hospital_especializado', estado: 'RJ', cidade: 'Rio de Janeiro', endereco: 'Praça Cruz Vermelha, 23 - Centro', telefone: '(21) 3207-1000', website: 'https://www.inca.gov.br', cnes: '2269880', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Oncologia', 'Radioterapia', 'Hematologia', 'Cirurgia Oncológica'], servicos: ['Quimioterapia', 'Radioterapia', 'Cirurgia Oncológica', 'Pesquisa Clínica'], leitos: 400, emergencia24h: false, uti: true, rating: 4.4, avaliacoes: 800, horario: 'Seg-Sex 7h-19h', destaque: 'Referência nacional em oncologia' },
  // === MINAS GERAIS ===
  { id: 'hcufmg', name: 'Hospital das Clínicas da UFMG', type: 'hospital_geral', estado: 'MG', cidade: 'Belo Horizonte', endereco: 'Av. Prof. Alfredo Balena, 110 - Santa Efigênia', telefone: '(31) 3409-9100', website: 'https://www.ebserh.gov.br/web/hc-ufmg', cnes: '2165082', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cardiologia', 'Neurologia', 'Ortopedia', 'Oncologia', 'Pediatria', 'Transplantes', 'Nefrologia', 'Infectologia'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes', 'Hemodiálise'], leitos: 500, emergencia24h: true, uti: true, rating: 4.1, avaliacoes: 650, horario: '24 horas', destaque: 'Hospital universitário referência em MG' },
  // === RIO GRANDE DO SUL ===
  { id: 'hcpa', name: 'Hospital de Clínicas de Porto Alegre', type: 'hospital_geral', estado: 'RS', cidade: 'Porto Alegre', endereco: 'Rua Ramiro Barcelos, 2350 - Santa Cecília', telefone: '(51) 3359-8000', website: 'https://www.hcpa.edu.br', cnes: '2237601', sus: true, particular: true, convenios: ['SUS', 'Unimed', 'Particular'], especialidades: ['Cardiologia', 'Neurologia', 'Oncologia', 'Transplantes', 'Pediatria', 'Psiquiatria', 'Genética Médica'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes', 'Pesquisa Clínica'], leitos: 842, emergencia24h: true, uti: true, rating: 4.4, avaliacoes: 900, horario: '24 horas', destaque: 'Referência em transplantes e pesquisa' },
  // === BAHIA ===
  { id: 'hge_ba', name: 'Hospital Geral do Estado da Bahia', type: 'hospital_geral', estado: 'BA', cidade: 'Salvador', endereco: 'Av. Vasco da Gama, s/n - Vasco da Gama', telefone: '(71) 3116-3000', cnes: '2802139', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cirurgia Geral', 'Ortopedia', 'Neurologia', 'Medicina de Emergência', 'Medicina Intensiva'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Trauma'], leitos: 400, emergencia24h: true, uti: true, rating: 3.9, avaliacoes: 450, horario: '24 horas', destaque: 'Referência em trauma na Bahia' },
  // === DISTRITO FEDERAL ===
  { id: 'hbdf', name: 'Hospital de Base do Distrito Federal', type: 'hospital_geral', estado: 'DF', cidade: 'Brasília', endereco: 'SMHS Área Especial Q. 101 - Asa Sul', telefone: '(61) 3550-8900', website: 'https://www.ihbdf.org.br', cnes: '2645394', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cardiologia', 'Neurologia', 'Ortopedia', 'Oncologia', 'Cirurgia Geral', 'Transplantes', 'Medicina Intensiva'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes', 'Hemodinâmica'], leitos: 750, emergencia24h: true, uti: true, rating: 4.0, avaliacoes: 700, horario: '24 horas', destaque: 'Maior hospital público do DF' },
  // === PERNAMBUCO ===
  { id: 'hcr', name: 'Hospital das Clínicas de Recife (UFPE)', type: 'hospital_geral', estado: 'PE', cidade: 'Recife', endereco: 'Av. Prof. Moraes Rego, 1235 - Cidade Universitária', telefone: '(81) 2126-3600', cnes: '2400316', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cardiologia', 'Neurologia', 'Oncologia', 'Pediatria', 'Nefrologia', 'Infectologia'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Hemodiálise'], leitos: 600, emergencia24h: true, uti: true, rating: 4.0, avaliacoes: 500, horario: '24 horas' },
  // === CEARÁ ===
  { id: 'hgf', name: 'Hospital Geral de Fortaleza', type: 'hospital_geral', estado: 'CE', cidade: 'Fortaleza', endereco: 'Rua Ávila Goulart, 900 - Papicu', telefone: '(85) 3101-7300', cnes: '2497654', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cirurgia Geral', 'Ortopedia', 'Neurologia', 'Cardiologia', 'Transplantes'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes'], leitos: 500, emergencia24h: true, uti: true, rating: 4.0, avaliacoes: 400, horario: '24 horas', destaque: 'Referência em transplantes no Ceará' },
  // === PARANÁ ===
  { id: 'hcufpr', name: 'Hospital de Clínicas da UFPR', type: 'hospital_geral', estado: 'PR', cidade: 'Curitiba', endereco: 'Rua General Carneiro, 181 - Alto da Glória', telefone: '(41) 3360-1800', website: 'https://www.ebserh.gov.br/web/chc-ufpr', cnes: '2406292', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cardiologia', 'Neurologia', 'Oncologia', 'Transplantes', 'Pediatria', 'Hematologia'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplante de Medula'], leitos: 600, emergencia24h: true, uti: true, rating: 4.2, avaliacoes: 550, horario: '24 horas', destaque: 'Referência em transplante de medula' },
  // === GOIÁS ===
  { id: 'hcufg', name: 'Hospital das Clínicas da UFG', type: 'hospital_geral', estado: 'GO', cidade: 'Goiânia', endereco: 'Primeira Avenida, s/n - Setor Leste Universitário', telefone: '(62) 3269-8200', cnes: '2338424', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cardiologia', 'Neurologia', 'Ortopedia', 'Oncologia', 'Pediatria'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico'], leitos: 300, emergencia24h: true, uti: true, rating: 4.0, avaliacoes: 350, horario: '24 horas' },
  // === PARÁ ===
  { id: 'hujbb', name: 'Hospital Universitário João de Barros Barreto', type: 'hospital_geral', estado: 'PA', cidade: 'Belém', endereco: 'Rua dos Mundurucus, 4487 - Guamá', telefone: '(91) 3201-6600', cnes: '2337991', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Infectologia', 'Pneumologia', 'Oncologia', 'Cirurgia Geral'], servicos: ['Internação', 'UTI', 'Centro Cirúrgico', 'Ambulatório'], leitos: 250, emergencia24h: false, uti: true, rating: 3.8, avaliacoes: 200, horario: 'Seg-Sex 7h-19h' },
  // === AMAZONAS ===
  { id: 'hps_am', name: 'Hospital e Pronto-Socorro 28 de Agosto', type: 'pronto_socorro', estado: 'AM', cidade: 'Manaus', endereco: 'Av. Mário Ypiranga, 1581 - Adrianópolis', telefone: '(92) 3643-7100', cnes: '2012774', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Medicina de Emergência', 'Cirurgia Geral', 'Ortopedia'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico'], leitos: 350, emergencia24h: true, uti: true, rating: 3.7, avaliacoes: 300, horario: '24 horas', destaque: 'Maior PS do Amazonas' },
];

// ─── Component ────────────────────────────────────────────────
export default function HospitalFinder() {
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedEspecialidade, setSelectedEspecialidade] = useState('');
  const [selectedConvenio, setSelectedConvenio] = useState('');
  const [onlyEmergencia, setOnlyEmergencia] = useState(false);
  const [onlySUS, setOnlySUS] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const cidades = useMemo(() => {
    if (!selectedEstado) return [];
    return CIDADES_POR_ESTADO[selectedEstado] || [];
  }, [selectedEstado]);

  const filteredHospitals = useMemo(() => {
    let results = [...HOSPITALS];
    if (selectedEstado) results = results.filter(h => h.estado === selectedEstado);
    if (selectedCidade) results = results.filter(h => h.cidade === selectedCidade);
    if (selectedTipo) results = results.filter(h => h.type === selectedTipo);
    if (selectedEspecialidade) results = results.filter(h => h.especialidades.includes(selectedEspecialidade));
    if (selectedConvenio) results = results.filter(h => h.convenios.includes(selectedConvenio) || (selectedConvenio === 'SUS' && h.sus));
    if (onlyEmergencia) results = results.filter(h => h.emergencia24h);
    if (onlySUS) results = results.filter(h => h.sus);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(h =>
        h.name.toLowerCase().includes(q) ||
        h.cidade.toLowerCase().includes(q) ||
        h.especialidades.some(e => e.toLowerCase().includes(q)) ||
        h.servicos.some(s => s.toLowerCase().includes(q))
      );
    }
    return results.sort((a, b) => b.rating - a.rating);
  }, [selectedEstado, selectedCidade, searchQuery, selectedTipo, selectedEspecialidade, selectedConvenio, onlyEmergencia, onlySUS]);

  const stats = useMemo(() => ({
    total: HOSPITALS.length,
    estados: new Set(HOSPITALS.map(h => h.estado)).size,
    cidades: new Set(HOSPITALS.map(h => h.cidade)).size,
    comUTI: HOSPITALS.filter(h => h.uti).length,
    emergencia24h: HOSPITALS.filter(h => h.emergencia24h).length,
  }), []);

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Encontre Hospitais e Clínicas</h1>
        <p className="text-muted-foreground">Mapeamento de estabelecimentos de saúde do Brasil por cidade, especialidade e convênio</p>
        <div className="flex flex-wrap justify-center gap-3 mt-3">
          <Badge variant="outline" className="text-sm"><Building2 className="w-3 h-3 mr-1" />{stats.total} estabelecimentos</Badge>
          <Badge variant="outline" className="text-sm"><MapPin className="w-3 h-3 mr-1" />{stats.estados} estados, {stats.cidades} cidades</Badge>
          <Badge variant="outline" className="text-sm"><Activity className="w-3 h-3 mr-1" />{stats.emergencia24h} com emergência 24h</Badge>
          <Badge variant="outline" className="text-sm"><Heart className="w-3 h-3 mr-1" />{stats.comUTI} com UTI</Badge>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="bg-card/50 border-border/50">
        <CardContent className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nome, cidade, especialidade..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Location filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={selectedEstado}
              onChange={e => { setSelectedEstado(e.target.value); setSelectedCidade(''); }}
              className="w-full p-3 bg-background border border-border rounded-xl text-foreground"
            >
              <option value="">Todos os Estados</option>
              {ESTADOS.map(e => <option key={e.sigla} value={e.sigla}>{e.sigla} — {e.nome}</option>)}
            </select>
            <select
              value={selectedCidade}
              onChange={e => setSelectedCidade(e.target.value)}
              className="w-full p-3 bg-background border border-border rounded-xl text-foreground"
              disabled={!selectedEstado}
            >
              <option value="">Todas as Cidades</option>
              {cidades.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Toggle filters */}
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="w-full">
            <Filter className="w-4 h-4 mr-2" />Filtros Avançados {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
          </Button>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select value={selectedTipo} onChange={e => setSelectedTipo(e.target.value)} className="w-full p-3 bg-background border border-border rounded-xl text-foreground">
                <option value="">Tipo de Estabelecimento</option>
                {Object.entries(TIPO_LABELS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <select value={selectedEspecialidade} onChange={e => setSelectedEspecialidade(e.target.value)} className="w-full p-3 bg-background border border-border rounded-xl text-foreground">
                <option value="">Especialidade</option>
                {ESPECIALIDADES_HOSPITAL.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
              <select value={selectedConvenio} onChange={e => setSelectedConvenio(e.target.value)} className="w-full p-3 bg-background border border-border rounded-xl text-foreground">
                <option value="">Convênio</option>
                {CONVENIOS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <label className="flex items-center gap-2 p-3 bg-background border border-border rounded-xl cursor-pointer">
                <input type="checkbox" checked={onlyEmergencia} onChange={e => setOnlyEmergencia(e.target.checked)} className="rounded" />
                <span className="text-sm">Apenas Emergência 24h</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-background border border-border rounded-xl cursor-pointer">
                <input type="checkbox" checked={onlySUS} onChange={e => setOnlySUS(e.target.checked)} className="rounded" />
                <span className="text-sm">Apenas SUS</span>
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="text-sm text-muted-foreground">{filteredHospitals.length} resultado(s) encontrado(s)</div>

      <div className="space-y-4">
        {filteredHospitals.map(hospital => {
          const tipo = TIPO_LABELS[hospital.type] || { label: hospital.type, color: 'bg-gray-500/20 text-gray-400' };
          const isExpanded = expandedId === hospital.id;

          return (
            <Card key={hospital.id} className="bg-card/50 border-border/50 hover:border-primary/30 transition-all cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : hospital.id)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg">{hospital.name}</h3>
                      <Badge className={tipo.color}>{tipo.label}</Badge>
                      {hospital.emergencia24h && <Badge className="bg-red-500/20 text-red-400">24h</Badge>}
                      {hospital.uti && <Badge className="bg-purple-500/20 text-purple-400">UTI</Badge>}
                      {hospital.sus && <Badge className="bg-green-500/20 text-green-400">SUS</Badge>}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />{hospital.cidade}, {hospital.estado} — {hospital.endereco}
                    </div>
                    {hospital.destaque && <p className="text-sm text-primary mt-1">{hospital.destaque}</p>}
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{hospital.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">({hospital.avaliacoes})</span>
                      </div>
                      {hospital.leitos && <span className="text-xs text-muted-foreground">{hospital.leitos} leitos</span>}
                      <span className="text-xs text-muted-foreground"><Clock className="w-3 h-3 inline mr-1" />{hospital.horario}</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                    {/* Contact */}
                    <div className="flex flex-wrap gap-3">
                      <a href={`tel:${hospital.telefone}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                        <Phone className="w-4 h-4" />{hospital.telefone}
                      </a>
                      {hospital.website && (
                        <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                          <Globe className="w-4 h-4" />Website <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {hospital.cnes && <span className="text-xs text-muted-foreground">CNES: {hospital.cnes}</span>}
                    </div>

                    {/* Especialidades */}
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Especialidades</h4>
                      <div className="flex flex-wrap gap-1">
                        {hospital.especialidades.map(e => <Badge key={e} variant="outline" className="text-xs">{e}</Badge>)}
                      </div>
                    </div>

                    {/* Serviços */}
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Serviços</h4>
                      <div className="flex flex-wrap gap-1">
                        {hospital.servicos.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                    </div>

                    {/* Convênios */}
                    <div>
                      <h4 className="text-sm font-semibold mb-1">Convênios Aceitos</h4>
                      <div className="flex flex-wrap gap-1">
                        {hospital.convenios.map(c => <Badge key={c} className={c === 'SUS' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'} >{c}</Badge>)}
                        {hospital.particular && <Badge className="bg-yellow-500/20 text-yellow-400">Particular</Badge>}
                      </div>
                    </div>

                    {/* CNES Link */}
                    {hospital.cnes && (
                      <a
                        href={`https://cnes.datasus.gov.br/pages/estabelecimentos/ficha/identificacao/${hospital.cnes}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />Ver ficha completa no CNES/DataSUS
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {filteredHospitals.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg">Nenhum estabelecimento encontrado</p>
            <p className="text-sm">Tente ajustar os filtros ou buscar por outra cidade</p>
          </div>
        )}
      </div>

      {/* CNES Link */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 text-center">
          <p className="text-sm text-muted-foreground mb-2">Dados baseados no CNES (Cadastro Nacional de Estabelecimentos de Saúde)</p>
          <a
            href="https://cnes.datasus.gov.br"
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
          >
            <ExternalLink className="w-4 h-4" />Consultar CNES/DataSUS para dados completos
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
