/**
 * HospitalFinder — Encontre Hospitais e Clínicas
 * Integração com CNES/DataSUS API (300.000+ estabelecimentos)
 * + base local de hospitais de referência com dados enriquecidos
 */
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2, MapPin, Phone, Globe, Star, Search, Filter,
  Clock, ChevronDown, ChevronUp, ExternalLink, Heart,
  Activity, Loader2, Database, RefreshCw, AlertCircle
} from 'lucide-react';
import { ESTADOS_NOMES as ESTADOS, ESTADOS_CIDADES_COMPLETO as CIDADES_POR_ESTADO } from './cidadesBrasil';
import { getIBGECode, ibgeToCnes } from './ibgeCodes';

// ─── Types ───────────────────────────────────────────────────
interface CnesEstabelecimento {
  codigo_cnes: number;
  nome_razao_social: string;
  nome_fantasia: string;
  codigo_tipo_unidade: number;
  descricao_tipo_unidade?: string;
  codigo_uf: number;
  codigo_municipio: number;
  nome_municipio?: string;
  sigla_uf?: string;
  endereco_estabelecimento: string;
  numero_estabelecimento: string;
  bairro_estabelecimento: string;
  codigo_cep_estabelecimento: string;
  numero_telefone_estabelecimento: string;
  endereco_email_estabelecimento: string;
  latitude_estabelecimento_decimo_grau: number | null;
  longitude_estabelecimento_decimo_grau: number | null;
  descricao_turno_atendimento: string;
  estabelecimento_faz_atendimento_ambulatorial_sus: string;
  estabelecimento_possui_centro_cirurgico: number;
  estabelecimento_possui_centro_obstetrico: number;
  estabelecimento_possui_centro_neonatal: number;
  estabelecimento_possui_atendimento_hospitalar: number;
  estabelecimento_possui_servico_apoio: number;
  estabelecimento_possui_atendimento_ambulatorial: number;
  descricao_esfera_administrativa: string;
  descricao_natureza_juridica_estabelecimento: string;
  tipo_gestao: string;
  data_atualizacao: string;
}

interface LocalHospital {
  id: string;
  name: string;
  type: string;
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

// Unified display type
interface DisplayHospital {
  id: string;
  nome: string;
  tipo: string;
  tipoLabel: string;
  tipoColor: string;
  estado: string;
  cidade: string;
  endereco: string;
  bairro: string;
  telefone: string;
  email?: string;
  website?: string;
  cnes?: string;
  sus: boolean;
  emergencia24h: boolean;
  uti: boolean;
  centroCirurgico: boolean;
  centroObstetrico: boolean;
  atendimentoHospitalar: boolean;
  leitos?: number;
  rating?: number;
  avaliacoes?: number;
  horario: string;
  destaque?: string;
  especialidades: string[];
  servicos: string[];
  convenios: string[];
  lat?: number | null;
  lng?: number | null;
  dataAtualizacao?: string;
  fonte: 'cnes' | 'local';
}

// ─── Constants ───────────────────────────────────────────────

const TIPO_LABELS: Record<number, { label: string; color: string }> = {
  1: { label: 'Posto de Saúde', color: 'bg-teal-500/20 text-teal-400' },
  2: { label: 'UBS', color: 'bg-teal-500/20 text-teal-400' },
  4: { label: 'Policlínica', color: 'bg-indigo-500/20 text-indigo-400' },
  5: { label: 'Hospital Geral', color: 'bg-blue-500/20 text-blue-400' },
  7: { label: 'Hospital Especializado', color: 'bg-purple-500/20 text-purple-400' },
  15: { label: 'Unidade Mista', color: 'bg-cyan-500/20 text-cyan-400' },
  20: { label: 'Pronto-Socorro', color: 'bg-red-500/20 text-red-400' },
  21: { label: 'PS Especializado', color: 'bg-red-500/20 text-red-400' },
  22: { label: 'Consultório', color: 'bg-gray-500/20 text-gray-400' },
  36: { label: 'Clínica/Especialidade', color: 'bg-green-500/20 text-green-400' },
  39: { label: 'Diagnose/Terapia', color: 'bg-yellow-500/20 text-yellow-400' },
  43: { label: 'Farmácia', color: 'bg-orange-500/20 text-orange-400' },
  61: { label: 'Centro de Parto', color: 'bg-pink-500/20 text-pink-400' },
  62: { label: 'Hospital/Dia', color: 'bg-blue-500/20 text-blue-400' },
  69: { label: 'Hemoterapia', color: 'bg-red-500/20 text-red-400' },
  70: { label: 'CAPS', color: 'bg-violet-500/20 text-violet-400' },
  73: { label: 'Pronto Atendimento', color: 'bg-orange-500/20 text-orange-400' },
  85: { label: 'Centro de Imunização', color: 'bg-emerald-500/20 text-emerald-400' },
};

const LOCAL_TIPO_LABELS: Record<string, { label: string; color: string }> = {
  hospital_geral: { label: 'Hospital Geral', color: 'bg-blue-500/20 text-blue-400' },
  hospital_especializado: { label: 'Hospital Especializado', color: 'bg-purple-500/20 text-purple-400' },
  upa: { label: 'UPA 24h', color: 'bg-red-500/20 text-red-400' },
  clinica: { label: 'Clínica', color: 'bg-green-500/20 text-green-400' },
  laboratorio: { label: 'Laboratório', color: 'bg-yellow-500/20 text-yellow-400' },
  pronto_socorro: { label: 'Pronto-Socorro', color: 'bg-orange-500/20 text-orange-400' },
  maternidade: { label: 'Maternidade', color: 'bg-pink-500/20 text-pink-400' },
};

const FILTER_TYPES = [
  { value: '5', label: 'Hospital Geral' },
  { value: '7', label: 'Hospital Especializado' },
  { value: '20', label: 'Pronto-Socorro' },
  { value: '73', label: 'Pronto Atendimento' },
  { value: '36', label: 'Clínica/Especialidade' },
  { value: '2', label: 'UBS/Centro de Saúde' },
  { value: '4', label: 'Policlínica' },
  { value: '39', label: 'Diagnose e Terapia' },
  { value: '70', label: 'CAPS' },
  { value: '85', label: 'Centro de Imunização' },
];

const UF_CODES: Record<string, number> = {
  AC: 12, AL: 27, AM: 13, AP: 16, BA: 29, CE: 23, DF: 53,
  ES: 32, GO: 52, MA: 21, MG: 31, MS: 50, MT: 51, PA: 15,
  PB: 25, PE: 26, PI: 22, PR: 41, RJ: 33, RN: 24, RO: 11,
  RR: 14, RS: 43, SC: 42, SE: 28, SP: 35, TO: 17,
};

// ─── Local Hospital Database (referência) ────────────────────
const LOCAL_HOSPITALS: LocalHospital[] = [
  { id: 'hgc', name: 'Hospital Geral de Cuiabá', type: 'hospital_geral', estado: 'MT', cidade: 'Cuiabá', endereco: 'Rua 13 de Junho, 2101 - Centro', telefone: '(65) 3623-0000', website: 'https://www.hgc.mt.gov.br', cnes: '2504103', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cirurgia Geral', 'Ortopedia', 'Neurologia', 'Cardiologia', 'Medicina de Emergência', 'Medicina Intensiva'], servicos: ['Pronto-Socorro 24h', 'UTI Adulto', 'Centro Cirúrgico', 'Radiologia', 'Laboratório'], leitos: 250, emergencia24h: true, uti: true, rating: 4.0, avaliacoes: 342, horario: '24 horas', destaque: 'Maior hospital público de MT' },
  { id: 'hsc_cba', name: 'Hospital Santa Casa de Cuiabá', type: 'hospital_geral', estado: 'MT', cidade: 'Cuiabá', endereco: 'Praça do Seminário, s/n - Centro', telefone: '(65) 3624-1000', website: 'https://www.santacasacuiaba.com.br', cnes: '2504200', sus: true, particular: true, convenios: ['SUS', 'Unimed', 'Bradesco Saúde', 'SulAmérica', 'Hapvida'], especialidades: ['Cardiologia', 'Oncologia', 'Ortopedia', 'Neurologia', 'Cirurgia Geral', 'Pediatria', 'Obstetrícia', 'Urologia'], servicos: ['Pronto-Socorro 24h', 'UTI Adulto', 'UTI Neonatal', 'Centro Cirúrgico', 'Hemodinâmica', 'Quimioterapia'], leitos: 400, emergencia24h: true, uti: true, rating: 4.2, avaliacoes: 567, horario: '24 horas', destaque: 'Referência em cardiologia e oncologia' },
  { id: 'hsjc', name: 'Hospital São Judas Tadeu', type: 'hospital_geral', estado: 'MT', cidade: 'Cuiabá', endereco: 'Av. Beira Rio, 3000 - Jardim Europa', telefone: '(65) 3645-5000', sus: false, particular: true, convenios: ['Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Particular'], especialidades: ['Cardiologia', 'Ortopedia', 'Neurologia', 'Cirurgia Geral', 'Urologia', 'Oftalmologia'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Radiologia'], leitos: 150, emergencia24h: true, uti: true, rating: 4.5, avaliacoes: 234, horario: '24 horas' },
  { id: 'hmu_tgs', name: 'Hospital Municipal de Tangará da Serra', type: 'hospital_geral', estado: 'MT', cidade: 'Tangará da Serra', endereco: 'Av. Brasil, 1500 - Centro', telefone: '(65) 3326-1000', cnes: '2505100', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cirurgia Geral', 'Pediatria', 'Obstetrícia', 'Medicina de Emergência'], servicos: ['Pronto-Socorro 24h', 'Centro Cirúrgico', 'Maternidade', 'Laboratório'], leitos: 80, emergencia24h: true, uti: false, rating: 3.8, avaliacoes: 156, horario: '24 horas' },
  { id: 'hcfmusp', name: 'Hospital das Clínicas da FMUSP', type: 'hospital_geral', estado: 'SP', cidade: 'São Paulo', endereco: 'Av. Dr. Enéas Carvalho de Aguiar, 255 - Cerqueira César', telefone: '(11) 2661-0000', website: 'https://www.hc.fm.usp.br', cnes: '2077485', sus: true, particular: true, convenios: ['SUS', 'Particular'], especialidades: ['Cardiologia', 'Oncologia', 'Neurologia', 'Ortopedia', 'Transplantes', 'Neurocirurgia', 'Cirurgia Cardiovascular', 'Hematologia', 'Reumatologia', 'Endocrinologia', 'Nefrologia', 'Pneumologia', 'Gastroenterologia', 'Infectologia', 'Dermatologia', 'Oftalmologia', 'Otorrinolaringologia', 'Psiquiatria', 'Pediatria', 'Ginecologia', 'Obstetrícia', 'Urologia', 'Cirurgia Plástica', 'Geriatria', 'Medicina Intensiva'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes', 'Radioterapia', 'Quimioterapia', 'Hemodinâmica', 'Ressonância Magnética', 'PET-CT'], leitos: 2400, emergencia24h: true, uti: true, rating: 4.3, avaliacoes: 2100, horario: '24 horas', destaque: 'Maior hospital da América Latina' },
  { id: 'einstein', name: 'Hospital Israelita Albert Einstein', type: 'hospital_geral', estado: 'SP', cidade: 'São Paulo', endereco: 'Av. Albert Einstein, 627 - Morumbi', telefone: '(11) 2151-1233', website: 'https://www.einstein.br', cnes: '2688689', sus: false, particular: true, convenios: ['Bradesco Saúde', 'SulAmérica', 'Amil', 'Porto Seguro', 'Particular'], especialidades: ['Cardiologia', 'Oncologia', 'Neurologia', 'Ortopedia', 'Transplantes', 'Neurocirurgia', 'Cirurgia Robótica', 'Medicina Intensiva'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes', 'Robótica', 'PET-CT', 'RM 3T'], leitos: 700, emergencia24h: true, uti: true, rating: 4.8, avaliacoes: 3500, horario: '24 horas', destaque: 'Top 1 América Latina (Newsweek)' },
  { id: 'sirio', name: 'Hospital Sírio-Libanês', type: 'hospital_geral', estado: 'SP', cidade: 'São Paulo', endereco: 'Rua Dona Adma Jafet, 91 - Bela Vista', telefone: '(11) 3394-0200', website: 'https://www.hospitalsiriolibanes.org.br', cnes: '2077396', sus: false, particular: true, convenios: ['Bradesco Saúde', 'SulAmérica', 'Particular'], especialidades: ['Oncologia', 'Cardiologia', 'Neurologia', 'Transplantes', 'Cirurgia Robótica'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes', 'Oncologia Integrativa'], leitos: 500, emergencia24h: true, uti: true, rating: 4.7, avaliacoes: 2800, horario: '24 horas', destaque: 'Referência em oncologia' },
  { id: 'incor', name: 'InCor - Instituto do Coração', type: 'hospital_especializado', estado: 'SP', cidade: 'São Paulo', endereco: 'Av. Dr. Enéas Carvalho de Aguiar, 44 - Cerqueira César', telefone: '(11) 2661-5000', website: 'https://www.incor.usp.br', cnes: '2077477', sus: true, particular: true, convenios: ['SUS', 'Particular'], especialidades: ['Cardiologia', 'Cirurgia Cardiovascular', 'Medicina Intensiva'], servicos: ['Hemodinâmica', 'Cirurgia Cardíaca', 'Transplante Cardíaco', 'UTI Cardiológica'], leitos: 500, emergencia24h: true, uti: true, rating: 4.6, avaliacoes: 1200, horario: '24 horas', destaque: 'Maior centro cardiológico da América Latina' },
  { id: 'copa_dor', name: 'Hospital Copa D\'Or', type: 'hospital_geral', estado: 'RJ', cidade: 'Rio de Janeiro', endereco: 'Rua Figueiredo Magalhães, 875 - Copacabana', telefone: '(21) 2545-3600', website: 'https://www.copadorsaoluiz.com.br', sus: false, particular: true, convenios: ['Bradesco Saúde', 'SulAmérica', 'Amil', 'Particular'], especialidades: ['Cardiologia', 'Ortopedia', 'Neurologia', 'Oncologia', 'Cirurgia Geral'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Hemodinâmica'], leitos: 300, emergencia24h: true, uti: true, rating: 4.5, avaliacoes: 1500, horario: '24 horas' },
  { id: 'inca', name: 'INCA - Instituto Nacional de Câncer', type: 'hospital_especializado', estado: 'RJ', cidade: 'Rio de Janeiro', endereco: 'Praça Cruz Vermelha, 23 - Centro', telefone: '(21) 3207-1000', website: 'https://www.inca.gov.br', cnes: '2269880', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Oncologia', 'Radioterapia', 'Hematologia', 'Cirurgia Oncológica'], servicos: ['Quimioterapia', 'Radioterapia', 'Cirurgia Oncológica', 'Pesquisa Clínica'], leitos: 400, emergencia24h: false, uti: true, rating: 4.4, avaliacoes: 800, horario: 'Seg-Sex 7h-19h', destaque: 'Referência nacional em oncologia' },
  { id: 'hcufmg', name: 'Hospital das Clínicas da UFMG', type: 'hospital_geral', estado: 'MG', cidade: 'Belo Horizonte', endereco: 'Av. Prof. Alfredo Balena, 110 - Santa Efigênia', telefone: '(31) 3409-9100', website: 'https://www.ebserh.gov.br/web/hc-ufmg', cnes: '2165082', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cardiologia', 'Neurologia', 'Ortopedia', 'Oncologia', 'Pediatria', 'Transplantes', 'Nefrologia', 'Infectologia'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes', 'Hemodiálise'], leitos: 500, emergencia24h: true, uti: true, rating: 4.1, avaliacoes: 650, horario: '24 horas', destaque: 'Hospital universitário referência em MG' },
  { id: 'hcpa', name: 'Hospital de Clínicas de Porto Alegre', type: 'hospital_geral', estado: 'RS', cidade: 'Porto Alegre', endereco: 'Rua Ramiro Barcelos, 2350 - Santa Cecília', telefone: '(51) 3359-8000', website: 'https://www.hcpa.edu.br', cnes: '2237601', sus: true, particular: true, convenios: ['SUS', 'Unimed', 'Particular'], especialidades: ['Cardiologia', 'Neurologia', 'Oncologia', 'Transplantes', 'Pediatria', 'Psiquiatria', 'Genética Médica'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes', 'Pesquisa Clínica'], leitos: 842, emergencia24h: true, uti: true, rating: 4.4, avaliacoes: 900, horario: '24 horas', destaque: 'Referência em transplantes e pesquisa' },
  { id: 'hge_ba', name: 'Hospital Geral do Estado da Bahia', type: 'hospital_geral', estado: 'BA', cidade: 'Salvador', endereco: 'Av. Vasco da Gama, s/n - Vasco da Gama', telefone: '(71) 3116-3000', cnes: '2802139', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cirurgia Geral', 'Ortopedia', 'Neurologia', 'Medicina de Emergência', 'Medicina Intensiva'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Trauma'], leitos: 400, emergencia24h: true, uti: true, rating: 3.9, avaliacoes: 450, horario: '24 horas', destaque: 'Referência em trauma na Bahia' },
  { id: 'hbdf', name: 'Hospital de Base do Distrito Federal', type: 'hospital_geral', estado: 'DF', cidade: 'Brasília', endereco: 'SMHS Área Especial Q. 101 - Asa Sul', telefone: '(61) 3550-8900', website: 'https://www.ihbdf.org.br', cnes: '2645394', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cardiologia', 'Neurologia', 'Ortopedia', 'Oncologia', 'Cirurgia Geral', 'Transplantes', 'Medicina Intensiva'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes', 'Hemodinâmica'], leitos: 750, emergencia24h: true, uti: true, rating: 4.0, avaliacoes: 700, horario: '24 horas', destaque: 'Maior hospital público do DF' },
  { id: 'hcr', name: 'Hospital das Clínicas de Recife (UFPE)', type: 'hospital_geral', estado: 'PE', cidade: 'Recife', endereco: 'Av. Prof. Moraes Rego, 1235 - Cidade Universitária', telefone: '(81) 2126-3600', cnes: '2400316', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cardiologia', 'Neurologia', 'Oncologia', 'Pediatria', 'Nefrologia', 'Infectologia'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Hemodiálise'], leitos: 600, emergencia24h: true, uti: true, rating: 4.0, avaliacoes: 500, horario: '24 horas' },
  { id: 'hgf', name: 'Hospital Geral de Fortaleza', type: 'hospital_geral', estado: 'CE', cidade: 'Fortaleza', endereco: 'Rua Ávila Goulart, 900 - Papicu', telefone: '(85) 3101-7300', cnes: '2497654', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cirurgia Geral', 'Ortopedia', 'Neurologia', 'Cardiologia', 'Transplantes'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplantes'], leitos: 500, emergencia24h: true, uti: true, rating: 4.0, avaliacoes: 400, horario: '24 horas', destaque: 'Referência em transplantes no Ceará' },
  { id: 'hcufpr', name: 'Hospital de Clínicas da UFPR', type: 'hospital_geral', estado: 'PR', cidade: 'Curitiba', endereco: 'Rua General Carneiro, 181 - Alto da Glória', telefone: '(41) 3360-1800', website: 'https://www.ebserh.gov.br/web/chc-ufpr', cnes: '2406292', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cardiologia', 'Neurologia', 'Oncologia', 'Transplantes', 'Pediatria', 'Hematologia'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico', 'Transplante de Medula'], leitos: 600, emergencia24h: true, uti: true, rating: 4.2, avaliacoes: 550, horario: '24 horas', destaque: 'Referência em transplante de medula' },
  { id: 'hcufg', name: 'Hospital das Clínicas da UFG', type: 'hospital_geral', estado: 'GO', cidade: 'Goiânia', endereco: 'Primeira Avenida, s/n - Setor Leste Universitário', telefone: '(62) 3269-8200', cnes: '2338424', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Cardiologia', 'Neurologia', 'Ortopedia', 'Oncologia', 'Pediatria'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico'], leitos: 300, emergencia24h: true, uti: true, rating: 4.0, avaliacoes: 350, horario: '24 horas' },
  { id: 'hujbb', name: 'Hospital Universitário João de Barros Barreto', type: 'hospital_geral', estado: 'PA', cidade: 'Belém', endereco: 'Rua dos Mundurucus, 4487 - Guamá', telefone: '(91) 3201-6600', cnes: '2337991', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Infectologia', 'Pneumologia', 'Oncologia', 'Cirurgia Geral'], servicos: ['Internação', 'UTI', 'Centro Cirúrgico', 'Ambulatório'], leitos: 250, emergencia24h: false, uti: true, rating: 3.8, avaliacoes: 200, horario: 'Seg-Sex 7h-19h' },
  { id: 'hps_am', name: 'Hospital e Pronto-Socorro 28 de Agosto', type: 'pronto_socorro', estado: 'AM', cidade: 'Manaus', endereco: 'Av. Mário Ypiranga, 1581 - Adrianópolis', telefone: '(92) 3643-7100', cnes: '2012774', sus: true, particular: false, convenios: ['SUS'], especialidades: ['Medicina de Emergência', 'Cirurgia Geral', 'Ortopedia'], servicos: ['Pronto-Socorro 24h', 'UTI', 'Centro Cirúrgico'], leitos: 350, emergencia24h: true, uti: true, rating: 3.7, avaliacoes: 300, horario: '24 horas', destaque: 'Maior PS do Amazonas' },
];

// ─── Helper Functions ────────────────────────────────────────

function localToDisplay(h: LocalHospital): DisplayHospital {
  const tipo = LOCAL_TIPO_LABELS[h.type] || { label: h.type, color: 'bg-gray-500/20 text-gray-400' };
  return {
    id: `local_${h.id}`,
    nome: h.name,
    tipo: h.type,
    tipoLabel: tipo.label,
    tipoColor: tipo.color,
    estado: h.estado,
    cidade: h.cidade,
    endereco: h.endereco,
    bairro: '',
    telefone: h.telefone,
    website: h.website,
    cnes: h.cnes,
    sus: h.sus,
    emergencia24h: h.emergencia24h,
    uti: h.uti,
    centroCirurgico: h.servicos.some(s => s.toLowerCase().includes('cirúrgico')),
    centroObstetrico: h.servicos.some(s => s.toLowerCase().includes('obstet') || s.toLowerCase().includes('maternidade')),
    atendimentoHospitalar: true,
    leitos: h.leitos,
    rating: h.rating,
    avaliacoes: h.avaliacoes,
    horario: h.horario,
    destaque: h.destaque,
    especialidades: h.especialidades,
    servicos: h.servicos,
    convenios: h.convenios,
    fonte: 'local',
  };
}

function cnesServicosFromFlags(e: CnesEstabelecimento): string[] {
  const servicos: string[] = [];
  if (e.estabelecimento_possui_centro_cirurgico) servicos.push('Centro Cirúrgico');
  if (e.estabelecimento_possui_centro_obstetrico) servicos.push('Centro Obstétrico');
  if (e.estabelecimento_possui_centro_neonatal) servicos.push('Centro Neonatal');
  if (e.estabelecimento_possui_atendimento_hospitalar) servicos.push('Internação');
  if (e.estabelecimento_possui_servico_apoio) servicos.push('Serviço de Apoio');
  if (e.estabelecimento_possui_atendimento_ambulatorial) servicos.push('Ambulatório');
  if (e.estabelecimento_faz_atendimento_ambulatorial_sus === 'SIM') servicos.push('Ambulatório SUS');
  return servicos;
}

function cnesIsSUS(e: CnesEstabelecimento): boolean {
  return e.estabelecimento_faz_atendimento_ambulatorial_sus === 'SIM' ||
    (e.descricao_esfera_administrativa || '').toUpperCase().includes('MUNICIPAL') ||
    (e.descricao_esfera_administrativa || '').toUpperCase().includes('ESTADUAL') ||
    (e.descricao_esfera_administrativa || '').toUpperCase().includes('FEDERAL');
}

function cnesIsEmergencia(e: CnesEstabelecimento): boolean {
  const turno = (e.descricao_turno_atendimento || '').toUpperCase();
  const tipo = e.codigo_tipo_unidade;
  return turno.includes('CONTÍNUO') || turno.includes('24') ||
    tipo === 20 || tipo === 21 || tipo === 73;
}

function cnesHorario(e: CnesEstabelecimento): string {
  const turno = (e.descricao_turno_atendimento || '').toUpperCase();
  if (turno.includes('CONTÍNUO') || turno.includes('24')) return '24 horas';
  if (turno.includes('MANHÃ') && turno.includes('TARDE')) return 'Manhã e Tarde';
  if (turno.includes('MANHÃ')) return 'Manhã';
  if (turno.includes('TARDE')) return 'Tarde';
  if (turno.includes('NOITE')) return 'Noite';
  if (turno.includes('INTERMITENTE')) return 'Turnos Intermitentes';
  return turno || 'Não informado';
}

function cnesFormatPhone(phone: string): string {
  if (!phone) return '';
  const clean = phone.replace(/[^\d]/g, '');
  if (clean.length === 10) return `(${clean.slice(0,2)}) ${clean.slice(2,6)}-${clean.slice(6)}`;
  if (clean.length === 11) return `(${clean.slice(0,2)}) ${clean.slice(2,7)}-${clean.slice(7)}`;
  return phone;
}

function cnesToDisplay(e: CnesEstabelecimento): DisplayHospital {
  const tipoInfo = TIPO_LABELS[e.codigo_tipo_unidade] || { label: `Tipo ${e.codigo_tipo_unidade}`, color: 'bg-gray-500/20 text-gray-400' };
  return {
    id: `cnes_${e.codigo_cnes}`,
    nome: e.nome_fantasia || e.nome_razao_social,
    tipo: String(e.codigo_tipo_unidade),
    tipoLabel: e.descricao_tipo_unidade || tipoInfo.label,
    tipoColor: tipoInfo.color,
    estado: e.sigla_uf || '',
    cidade: e.nome_municipio || '',
    endereco: `${e.endereco_estabelecimento}${e.numero_estabelecimento ? ', ' + e.numero_estabelecimento : ''}`,
    bairro: e.bairro_estabelecimento || '',
    telefone: cnesFormatPhone(e.numero_telefone_estabelecimento),
    email: e.endereco_email_estabelecimento,
    cnes: String(e.codigo_cnes),
    sus: cnesIsSUS(e),
    emergencia24h: cnesIsEmergencia(e),
    uti: false, // Not available in basic CNES data
    centroCirurgico: !!e.estabelecimento_possui_centro_cirurgico,
    centroObstetrico: !!e.estabelecimento_possui_centro_obstetrico,
    atendimentoHospitalar: !!e.estabelecimento_possui_atendimento_hospitalar,
    horario: cnesHorario(e),
    especialidades: [],
    servicos: cnesServicosFromFlags(e),
    convenios: cnesIsSUS(e) ? ['SUS'] : [],
    lat: e.latitude_estabelecimento_decimo_grau,
    lng: e.longitude_estabelecimento_decimo_grau,
    dataAtualizacao: e.data_atualizacao,
    fonte: 'cnes',
  };
}

// ─── Component ───────────────────────────────────────────────
export default function HospitalFinder() {
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [onlyEmergencia, setOnlyEmergencia] = useState(false);
  const [onlySUS, setOnlySUS] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // CNES API state
  const [cnesResults, setCnesResults] = useState<DisplayHospital[]>([]);
  const [cnesLoading, setCnesLoading] = useState(false);
  const [cnesError, setCnesError] = useState('');
  const [cnesPage, setCnesPage] = useState(0);
  const [cnesHasMore, setCnesHasMore] = useState(false);
  const [useCnesAPI, setUseCnesAPI] = useState(true);
  const [totalCnesLoaded, setTotalCnesLoaded] = useState(0);

  const cidades = useMemo(() => {
    if (!selectedEstado) return [];
    return (CIDADES_POR_ESTADO[selectedEstado] || []).sort();
  }, [selectedEstado]);

  // Fetch from CNES API when filters change
  const fetchCnes = useCallback(async (page: number = 0, append: boolean = false) => {
    if (!selectedEstado) {
      setCnesResults([]);
      setTotalCnesLoaded(0);
      return;
    }

    setCnesLoading(true);
    setCnesError('');

    try {
      // If a city is selected, use the multi-page endpoint with municipality code
      if (selectedCidade) {
        const ibgeCode = getIBGECode(selectedEstado, selectedCidade);
        if (ibgeCode) {
          const cnesCode = ibgeToCnes(ibgeCode);
          const params = new URLSearchParams();
          params.set('uf', selectedEstado);
          params.set('municipio', String(cnesCode));
          if (selectedTipo) params.set('tipo', selectedTipo);
          params.set('paginas', '10'); // Up to 200 results

          const res = await fetch(`/api/cnes/buscar?${params.toString()}`);
          if (!res.ok) throw new Error(`Erro ${res.status}`);

          const data = await res.json();
          const converted = (data.estabelecimentos || []).map(cnesToDisplay);
          setCnesResults(converted);
          setTotalCnesLoaded(converted.length);
          setCnesHasMore(false); // All pages already fetched
          setCnesPage(0);
        } else {
          // Fallback: use state-level search
          const params = new URLSearchParams();
          params.set('uf', selectedEstado);
          if (selectedTipo) params.set('tipo', selectedTipo);
          params.set('limit', '20');
          params.set('offset', String(page * 20));

          const res = await fetch(`/api/cnes/estabelecimentos?${params.toString()}`);
          if (!res.ok) throw new Error(`Erro ${res.status}`);

          const data = await res.json();
          const converted = (data.estabelecimentos || []).map(cnesToDisplay);
          if (append) {
            setCnesResults(prev => [...prev, ...converted]);
          } else {
            setCnesResults(converted);
          }
          setTotalCnesLoaded(prev => append ? prev + converted.length : converted.length);
          setCnesHasMore(converted.length === 20);
          setCnesPage(page);
        }
      } else {
        // State-level search with pagination
        const params = new URLSearchParams();
        params.set('uf', selectedEstado);
        if (selectedTipo) params.set('tipo', selectedTipo);
        params.set('limit', '20');
        params.set('offset', String(page * 20));

        const res = await fetch(`/api/cnes/estabelecimentos?${params.toString()}`);
        if (!res.ok) throw new Error(`Erro ${res.status}`);

        const data = await res.json();
        const converted = (data.estabelecimentos || []).map(cnesToDisplay);

        if (append) {
          setCnesResults(prev => [...prev, ...converted]);
        } else {
          setCnesResults(converted);
        }

        setTotalCnesLoaded(prev => append ? prev + converted.length : converted.length);
        setCnesHasMore(converted.length === 20);
        setCnesPage(page);
      }
    } catch (err: any) {
      setCnesError(err.message || 'Erro ao buscar dados do CNES');
      if (!append) setCnesResults([]);
    } finally {
      setCnesLoading(false);
    }
  }, [selectedEstado, selectedCidade, selectedTipo]);

  // Auto-fetch when state or city changes
  useEffect(() => {
    if (useCnesAPI && selectedEstado) {
      fetchCnes(0, false);
    }
  }, [selectedEstado, selectedCidade, selectedTipo, useCnesAPI]);

  // Load more pages
  const loadMore = useCallback(() => {
    if (!cnesLoading && cnesHasMore) {
      fetchCnes(cnesPage + 1, true);
    }
  }, [cnesLoading, cnesHasMore, cnesPage, fetchCnes]);

  // Combine local + CNES results
  const allHospitals = useMemo(() => {
    const localConverted = LOCAL_HOSPITALS.map(localToDisplay);
    const localCnesCodes = new Set(LOCAL_HOSPITALS.filter(h => h.cnes).map(h => h.cnes));

    // Filter CNES results to avoid duplicates with local data
    const filteredCnes = cnesResults.filter(c => !localCnesCodes.has(c.cnes));

    // Combine: local first (richer data), then CNES
    return [...localConverted, ...filteredCnes];
  }, [cnesResults]);

  // Apply filters
  const filteredHospitals = useMemo(() => {
    let results = [...allHospitals];

    if (selectedEstado) results = results.filter(h => h.estado === selectedEstado);
    if (selectedCidade) {
      const q = selectedCidade.toLowerCase();
      results = results.filter(h =>
        h.cidade.toLowerCase() === q ||
        h.bairro.toLowerCase().includes(q) ||
        h.endereco.toLowerCase().includes(q)
      );
    }
    if (selectedTipo) {
      results = results.filter(h =>
        h.tipo === selectedTipo ||
        h.tipoLabel.toLowerCase().includes(FILTER_TYPES.find(f => f.value === selectedTipo)?.label.toLowerCase() || '')
      );
    }
    if (onlyEmergencia) results = results.filter(h => h.emergencia24h);
    if (onlySUS) results = results.filter(h => h.sus);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(h =>
        h.nome.toLowerCase().includes(q) ||
        h.cidade.toLowerCase().includes(q) ||
        h.bairro.toLowerCase().includes(q) ||
        h.especialidades.some(e => e.toLowerCase().includes(q)) ||
        h.servicos.some(s => s.toLowerCase().includes(q)) ||
        h.tipoLabel.toLowerCase().includes(q)
      );
    }

    // Sort: local (enriched) first, then by name
    return results.sort((a, b) => {
      if (a.fonte !== b.fonte) return a.fonte === 'local' ? -1 : 1;
      if (a.rating && b.rating) return b.rating - a.rating;
      return a.nome.localeCompare(b.nome);
    });
  }, [allHospitals, selectedEstado, selectedCidade, searchQuery, selectedTipo, onlyEmergencia, onlySUS]);

  const stats = useMemo(() => ({
    totalLocal: LOCAL_HOSPITALS.length,
    totalCnes: totalCnesLoaded,
    estados: new Set(LOCAL_HOSPITALS.map(h => h.estado)).size,
  }), [totalCnesLoaded]);

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Encontre Hospitais e Clínicas</h1>
        <p className="text-muted-foreground">Integração com CNES/DataSUS — acesso a 300.000+ estabelecimentos de saúde do Brasil</p>
        <div className="flex flex-wrap justify-center gap-3 mt-3">
          <Badge variant="outline" className="text-sm"><Database className="w-3 h-3 mr-1" />300.000+ no CNES/DataSUS</Badge>
          <Badge variant="outline" className="text-sm"><Building2 className="w-3 h-3 mr-1" />{stats.totalLocal} hospitais de referência</Badge>
          {totalCnesLoaded > 0 && (
            <Badge variant="outline" className="text-sm"><Activity className="w-3 h-3 mr-1" />{totalCnesLoaded} carregados do CNES</Badge>
          )}
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
              placeholder="Buscar por nome, cidade, bairro, especialidade..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Location filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <select
              value={selectedEstado}
              onChange={e => { setSelectedEstado(e.target.value); setSelectedCidade(''); setCnesResults([]); setTotalCnesLoaded(0); }}
              className="w-full p-3 bg-background border border-border rounded-xl text-foreground"
            >
              <option value="">Selecione o Estado</option>
              {Object.entries(ESTADOS).sort((a, b) => a[1].localeCompare(b[1])).map(([sigla, nome]) => (
                <option key={sigla} value={sigla}>{sigla} — {nome}</option>
              ))}
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
                {FILTER_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
              <label className="flex items-center gap-2 p-3 bg-background border border-border rounded-xl cursor-pointer">
                <input type="checkbox" checked={onlyEmergencia} onChange={e => setOnlyEmergencia(e.target.checked)} className="rounded" />
                <span className="text-sm">Apenas Emergência 24h</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-background border border-border rounded-xl cursor-pointer">
                <input type="checkbox" checked={onlySUS} onChange={e => setOnlySUS(e.target.checked)} className="rounded" />
                <span className="text-sm">Apenas SUS</span>
              </label>
              <label className="flex items-center gap-2 p-3 bg-background border border-border rounded-xl cursor-pointer">
                <input type="checkbox" checked={useCnesAPI} onChange={e => setUseCnesAPI(e.target.checked)} className="rounded" />
                <span className="text-sm">Buscar no CNES/DataSUS (API em tempo real)</span>
              </label>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading / Error */}
      {cnesLoading && (
        <div className="flex items-center justify-center gap-2 py-4 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Buscando estabelecimentos no CNES/DataSUS...</span>
        </div>
      )}

      {cnesError && (
        <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          <span>{cnesError} — Mostrando dados locais de referência</span>
        </div>
      )}

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        {filteredHospitals.length} resultado(s) encontrado(s)
        {totalCnesLoaded > 0 && ` (${filteredHospitals.filter(h => h.fonte === 'local').length} de referência + ${filteredHospitals.filter(h => h.fonte === 'cnes').length} do CNES)`}
        {!selectedEstado && ' — selecione um estado para buscar no CNES/DataSUS'}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredHospitals.map(hospital => {
          const isExpanded = expandedId === hospital.id;

          return (
            <Card key={hospital.id} className="bg-card/50 border-border/50 hover:border-primary/30 transition-all cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : hospital.id)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg">{hospital.nome}</h3>
                      <Badge className={hospital.tipoColor}>{hospital.tipoLabel}</Badge>
                      {hospital.emergencia24h && <Badge className="bg-red-500/20 text-red-400">24h</Badge>}
                      {hospital.uti && <Badge className="bg-purple-500/20 text-purple-400">UTI</Badge>}
                      {hospital.centroCirurgico && <Badge className="bg-indigo-500/20 text-indigo-400">Cirurgia</Badge>}
                      {hospital.sus && <Badge className="bg-green-500/20 text-green-400">SUS</Badge>}
                      {hospital.fonte === 'local' && <Badge className="bg-amber-500/20 text-amber-400 text-xs">Referência</Badge>}
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {hospital.cidade && `${hospital.cidade}, `}{hospital.estado} — {hospital.endereco}
                      {hospital.bairro && ` - ${hospital.bairro}`}
                    </div>
                    {hospital.destaque && <p className="text-sm text-primary mt-1">{hospital.destaque}</p>}
                    <div className="flex items-center gap-4 mt-2 flex-wrap">
                      {hospital.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-semibold">{hospital.rating.toFixed(1)}</span>
                          {hospital.avaliacoes && <span className="text-xs text-muted-foreground">({hospital.avaliacoes})</span>}
                        </div>
                      )}
                      {hospital.leitos && <span className="text-xs text-muted-foreground">{hospital.leitos} leitos</span>}
                      <span className="text-xs text-muted-foreground"><Clock className="w-3 h-3 inline mr-1" />{hospital.horario}</span>
                      {hospital.cnes && <span className="text-xs text-muted-foreground">CNES: {hospital.cnes}</span>}
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-border/50 space-y-3">
                    {/* Contact */}
                    <div className="flex flex-wrap gap-3">
                      {hospital.telefone && (
                        <a href={`tel:${hospital.telefone}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                          <Phone className="w-4 h-4" />{hospital.telefone}
                        </a>
                      )}
                      {hospital.website && (
                        <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm text-primary hover:underline">
                          <Globe className="w-4 h-4" />Website <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {hospital.email && (
                        <a href={`mailto:${hospital.email}`} className="flex items-center gap-1 text-sm text-primary hover:underline">
                          {hospital.email}
                        </a>
                      )}
                    </div>

                    {/* Services from CNES flags */}
                    {hospital.servicos.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Serviços</h4>
                        <div className="flex flex-wrap gap-1">
                          {hospital.servicos.map(s => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                        </div>
                      </div>
                    )}

                    {/* Especialidades (local only) */}
                    {hospital.especialidades.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Especialidades</h4>
                        <div className="flex flex-wrap gap-1">
                          {hospital.especialidades.map(e => <Badge key={e} variant="outline" className="text-xs">{e}</Badge>)}
                        </div>
                      </div>
                    )}

                    {/* Convênios (local only) */}
                    {hospital.convenios.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold mb-1">Convênios</h4>
                        <div className="flex flex-wrap gap-1">
                          {hospital.convenios.map(c => (
                            <Badge key={c} className={c === 'SUS' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}>{c}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional info */}
                    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                      {hospital.dataAtualizacao && <span>Atualizado: {hospital.dataAtualizacao}</span>}
                      {hospital.fonte === 'cnes' && <Badge variant="outline" className="text-xs">Fonte: CNES/DataSUS</Badge>}
                      {hospital.fonte === 'local' && <Badge variant="outline" className="text-xs">Fonte: Base de Referência MedFocus</Badge>}
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

                    {/* Google Maps link */}
                    {hospital.lat && hospital.lng && (
                      <a
                        href={`https://www.google.com/maps?q=${hospital.lat},${hospital.lng}`}
                        target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline ml-3"
                      >
                        <MapPin className="w-3 h-3" />Ver no Google Maps
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {/* Load More */}
        {cnesHasMore && selectedEstado && (
          <div className="text-center">
            <Button variant="outline" onClick={loadMore} disabled={cnesLoading} className="gap-2">
              {cnesLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Carregar mais do CNES/DataSUS
            </Button>
          </div>
        )}

        {filteredHospitals.length === 0 && !cnesLoading && (
          <div className="text-center py-12 text-muted-foreground">
            <Building2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-lg">Nenhum estabelecimento encontrado</p>
            <p className="text-sm">
              {!selectedEstado
                ? 'Selecione um estado para buscar estabelecimentos no CNES/DataSUS'
                : 'Tente ajustar os filtros ou buscar por outra cidade'}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Dados integrados com o CNES/DataSUS — Cadastro Nacional de Estabelecimentos de Saúde do Ministério da Saúde
          </p>
          <p className="text-xs text-muted-foreground">
            Base com 300.000+ estabelecimentos ativos em todo o Brasil. Dados atualizados em tempo real via API oficial.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="https://cnes.datasus.gov.br"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
            >
              <ExternalLink className="w-4 h-4" />CNES/DataSUS
            </a>
            <a
              href="https://apidadosabertos.saude.gov.br/v1/#/CNES"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline text-sm"
            >
              <Database className="w-4 h-4" />API Dados Abertos
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
