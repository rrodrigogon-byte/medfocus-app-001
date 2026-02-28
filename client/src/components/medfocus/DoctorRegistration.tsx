/**
 * DoctorRegistration — Cadastro de Médicos
 * Permite que médicos se cadastrem e solicitem inclusão na plataforma MedFocus
 * Os dados são enviados para a equipe de gestão validar e aprovar
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  UserPlus, CheckCircle, AlertCircle, Stethoscope, Shield,
  FileText, Clock, Send, ArrowLeft, Building2, MapPin
} from 'lucide-react';
import { ESTADOS_NOMES as ESTADOS, ESTADOS_CIDADES_COMPLETO as CIDADES_POR_ESTADO } from './cidadesBrasil';

const ESPECIALIDADES = [
  'Acupuntura', 'Alergia e Imunologia', 'Anestesiologia', 'Angiologia', 'Cancerologia',
  'Cardiologia', 'Cirurgia Cardiovascular', 'Cirurgia da Mão', 'Cirurgia de Cabeça e Pescoço',
  'Cirurgia do Aparelho Digestivo', 'Cirurgia Geral', 'Cirurgia Pediátrica', 'Cirurgia Plástica',
  'Cirurgia Torácica', 'Cirurgia Vascular', 'Clínica Médica', 'Coloproctologia',
  'Dermatologia', 'Endocrinologia', 'Endoscopia', 'Gastroenterologia', 'Genética Médica',
  'Geriatria', 'Ginecologia e Obstetrícia', 'Hematologia e Hemoterapia', 'Homeopatia',
  'Infectologia', 'Mastologia', 'Medicina de Emergência', 'Medicina de Família e Comunidade',
  'Medicina do Trabalho', 'Medicina Esportiva', 'Medicina Física e Reabilitação',
  'Medicina Intensiva', 'Medicina Legal e Perícia Médica', 'Medicina Nuclear',
  'Medicina Preventiva e Social', 'Nefrologia', 'Neurocirurgia', 'Neurologia',
  'Nutrologia', 'Oftalmologia', 'Oncologia Clínica', 'Ortopedia e Traumatologia',
  'Otorrinolaringologia', 'Patologia', 'Patologia Clínica', 'Pediatria', 'Pneumologia',
  'Psiquiatria', 'Radiologia e Diagnóstico por Imagem', 'Radioterapia', 'Reumatologia',
  'Urologia',
];

const CONVENIOS_LIST = [
  'SUS', 'Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'NotreDame Intermédica',
  'Hapvida', 'Porto Seguro', 'Cassi', 'Geap', 'Ipsemg', 'Saúde Caixa',
  'Prevent Senior', 'São Francisco', 'Golden Cross', 'Particular',
];

interface FormData {
  nomeCompleto: string;
  crm: string;
  crmEstado: string;
  email: string;
  telefone: string;
  especialidade1: string;
  especialidade2: string;
  rqe1: string;
  rqe2: string;
  estado: string;
  cidade: string;
  endereco: string;
  clinicaHospital: string;
  convenios: string[];
  valorConsulta: string;
  formacao: string;
  anoFormacao: string;
  universidade: string;
  residencia: string;
  experienciaAnos: string;
  sobre: string;
  aceitaTermos: boolean;
}

const initialForm: FormData = {
  nomeCompleto: '', crm: '', crmEstado: '', email: '', telefone: '',
  especialidade1: '', especialidade2: '', rqe1: '', rqe2: '',
  estado: '', cidade: '', endereco: '', clinicaHospital: '',
  convenios: [], valorConsulta: '', formacao: '', anoFormacao: '',
  universidade: '', residencia: '', experienciaAnos: '', sobre: '',
  aceitaTermos: false,
};

export default function DoctorRegistration() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const cidades = form.estado ? (CIDADES_POR_ESTADO[form.estado] || []) : [];

  const updateField = (field: keyof FormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const toggleConvenio = (conv: string) => {
    setForm(prev => ({
      ...prev,
      convenios: prev.convenios.includes(conv)
        ? prev.convenios.filter(c => c !== conv)
        : [...prev.convenios, conv],
    }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.nomeCompleto.trim()) newErrors.nomeCompleto = 'Nome completo é obrigatório';
    if (!form.crm.trim()) newErrors.crm = 'CRM é obrigatório';
    if (!form.crmEstado) newErrors.crmEstado = 'Estado do CRM é obrigatório';
    if (!form.email.trim() || !form.email.includes('@')) newErrors.email = 'Email válido é obrigatório';
    if (!form.telefone.trim()) newErrors.telefone = 'Telefone é obrigatório';
    if (!form.especialidade1) newErrors.especialidade1 = 'Especialidade principal é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    if (!form.estado) newErrors.estado = 'Estado é obrigatório';
    if (!form.cidade) newErrors.cidade = 'Cidade é obrigatória';
    if (!form.universidade.trim()) newErrors.universidade = 'Universidade é obrigatória';
    if (!form.anoFormacao.trim()) newErrors.anoFormacao = 'Ano de formação é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = () => {
    if (!form.aceitaTermos) {
      setErrors({ aceitaTermos: 'Você deve aceitar os termos' });
      return;
    }
    // In production, this would send to the server via tRPC
    console.log('Doctor registration submitted:', form);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-bold text-green-400">Cadastro Enviado com Sucesso!</h2>
            <p className="text-muted-foreground">
              Obrigado, Dr(a). <strong>{form.nomeCompleto}</strong>! Seu cadastro foi recebido e será analisado pela equipe de gestão MedFocus.
            </p>
            <div className="bg-background/50 rounded-xl p-4 text-left space-y-2">
              <p className="text-sm"><strong>CRM:</strong> {form.crm}/{form.crmEstado}</p>
              <p className="text-sm"><strong>Especialidade:</strong> {form.especialidade1}{form.especialidade2 ? ` / ${form.especialidade2}` : ''}</p>
              <p className="text-sm"><strong>Localização:</strong> {form.cidade}/{form.estado}</p>
              <p className="text-sm"><strong>Email:</strong> {form.email}</p>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-sm text-yellow-400">
                <Clock className="w-4 h-4 inline mr-1" />
                Prazo de análise: até 5 dias úteis. Você receberá um email com o resultado da validação.
              </p>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>O que verificamos:</p>
              <p>1. Validação do CRM no portal do CFM</p>
              <p>2. Verificação do RQE (se aplicável)</p>
              <p>3. Confirmação dos dados profissionais</p>
            </div>
            <Button onClick={() => { setSubmitted(false); setForm(initialForm); setStep(1); }} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />Fazer Novo Cadastro
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Cadastro de Médicos</h1>
        <p className="text-muted-foreground">Solicite sua inclusão na plataforma MedFocus. Seus dados serão validados pela nossa equipe.</p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>{s}</div>
            <span className={`text-sm hidden md:inline ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
              {s === 1 ? 'Dados Profissionais' : s === 2 ? 'Localização e Formação' : 'Revisão e Envio'}
            </span>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Professional Data */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Stethoscope className="w-5 h-5" />Dados Profissionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome Completo *</label>
                <input type="text" value={form.nomeCompleto} onChange={e => updateField('nomeCompleto', e.target.value)}
                  placeholder="Dr(a). Nome Completo" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
                {errors.nomeCompleto && <p className="text-xs text-red-400 mt-1">{errors.nomeCompleto}</p>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-sm font-medium">CRM *</label>
                  <input type="text" value={form.crm} onChange={e => updateField('crm', e.target.value)}
                    placeholder="123456" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
                  {errors.crm && <p className="text-xs text-red-400 mt-1">{errors.crm}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium">UF do CRM *</label>
                  <select value={form.crmEstado} onChange={e => updateField('crmEstado', e.target.value)}
                    className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground">
                    <option value="">UF</option>
                    {Object.entries(ESTADOS).map(([sigla, nome]) => <option key={sigla} value={sigla}>{sigla}</option>)}
                  </select>
                  {errors.crmEstado && <p className="text-xs text-red-400 mt-1">{errors.crmEstado}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Email *</label>
                <input type="email" value={form.email} onChange={e => updateField('email', e.target.value)}
                  placeholder="medico@email.com" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Telefone *</label>
                <input type="tel" value={form.telefone} onChange={e => updateField('telefone', e.target.value)}
                  placeholder="(65) 99999-9999" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
                {errors.telefone && <p className="text-xs text-red-400 mt-1">{errors.telefone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Especialidade Principal *</label>
                <select value={form.especialidade1} onChange={e => updateField('especialidade1', e.target.value)}
                  className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground">
                  <option value="">Selecione...</option>
                  {ESPECIALIDADES.map(e => <option key={e} value={e}>{e}</option>)}
                </select>
                {errors.especialidade1 && <p className="text-xs text-red-400 mt-1">{errors.especialidade1}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">RQE (Especialidade 1)</label>
                <input type="text" value={form.rqe1} onChange={e => updateField('rqe1', e.target.value)}
                  placeholder="Número RQE" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Especialidade Secundária (opcional)</label>
                <select value={form.especialidade2} onChange={e => updateField('especialidade2', e.target.value)}
                  className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground">
                  <option value="">Nenhuma</option>
                  {ESPECIALIDADES.filter(e => e !== form.especialidade1).map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">RQE (Especialidade 2)</label>
                <input type="text" value={form.rqe2} onChange={e => updateField('rqe2', e.target.value)}
                  placeholder="Número RQE" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Valor da Consulta Particular (R$)</label>
              <input type="text" value={form.valorConsulta} onChange={e => updateField('valorConsulta', e.target.value)}
                placeholder="Ex: 350,00" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Convênios Aceitos</label>
              <div className="flex flex-wrap gap-2">
                {CONVENIOS_LIST.map(c => (
                  <Badge key={c} variant={form.convenios.includes(c) ? 'default' : 'outline'}
                    className="cursor-pointer" onClick={() => toggleConvenio(c)}>
                    {c}
                  </Badge>
                ))}
              </div>
            </div>

            <Button onClick={handleNext} className="w-full">Próximo: Localização e Formação</Button>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Location and Education */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5" />Localização e Formação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Estado de Atuação *</label>
                <select value={form.estado} onChange={e => { updateField('estado', e.target.value); updateField('cidade', ''); }}
                  className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground">
                  <option value="">Selecione...</option>
                  {Object.entries(ESTADOS).map(([sigla, nome]) => <option key={sigla} value={sigla}>{sigla} — {nome}</option>)}
                </select>
                {errors.estado && <p className="text-xs text-red-400 mt-1">{errors.estado}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Cidade *</label>
                <select value={form.cidade} onChange={e => updateField('cidade', e.target.value)}
                  className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" disabled={!form.estado}>
                  <option value="">Selecione...</option>
                  {cidades.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.cidade && <p className="text-xs text-red-400 mt-1">{errors.cidade}</p>}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Endereço do Consultório/Clínica</label>
              <input type="text" value={form.endereco} onChange={e => updateField('endereco', e.target.value)}
                placeholder="Rua, número, bairro" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
            </div>

            <div>
              <label className="text-sm font-medium">Clínica/Hospital onde atende</label>
              <input type="text" value={form.clinicaHospital} onChange={e => updateField('clinicaHospital', e.target.value)}
                placeholder="Nome da clínica ou hospital" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
            </div>

            <hr className="border-border/50" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Universidade de Graduação *</label>
                <input type="text" value={form.universidade} onChange={e => updateField('universidade', e.target.value)}
                  placeholder="Ex: UFMT, USP, UNICAMP" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
                {errors.universidade && <p className="text-xs text-red-400 mt-1">{errors.universidade}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Ano de Formação *</label>
                <input type="text" value={form.anoFormacao} onChange={e => updateField('anoFormacao', e.target.value)}
                  placeholder="Ex: 2015" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
                {errors.anoFormacao && <p className="text-xs text-red-400 mt-1">{errors.anoFormacao}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Residência Médica</label>
                <input type="text" value={form.residencia} onChange={e => updateField('residencia', e.target.value)}
                  placeholder="Instituição e especialidade" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
              </div>
              <div>
                <label className="text-sm font-medium">Anos de Experiência</label>
                <input type="text" value={form.experienciaAnos} onChange={e => updateField('experienciaAnos', e.target.value)}
                  placeholder="Ex: 10" className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Sobre Você (mini-bio)</label>
              <textarea value={form.sobre} onChange={e => updateField('sobre', e.target.value)}
                placeholder="Conte um pouco sobre sua experiência, áreas de interesse, diferenciais..."
                rows={4} className="w-full mt-1 p-3 bg-background border border-border rounded-xl text-foreground resize-none" />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />Voltar
              </Button>
              <Button onClick={handleNext} className="flex-1">Próximo: Revisão</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Review and Submit */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5" />Revisão e Envio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-background/50 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold text-lg">{form.nomeCompleto}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <p><strong>CRM:</strong> {form.crm}/{form.crmEstado}</p>
                <p><strong>Email:</strong> {form.email}</p>
                <p><strong>Telefone:</strong> {form.telefone}</p>
                <p><strong>Especialidade:</strong> {form.especialidade1}{form.especialidade2 ? ` / ${form.especialidade2}` : ''}</p>
                {form.rqe1 && <p><strong>RQE 1:</strong> {form.rqe1}</p>}
                {form.rqe2 && <p><strong>RQE 2:</strong> {form.rqe2}</p>}
                <p><strong>Localização:</strong> {form.cidade}/{form.estado}</p>
                {form.endereco && <p><strong>Endereço:</strong> {form.endereco}</p>}
                {form.clinicaHospital && <p><strong>Local:</strong> {form.clinicaHospital}</p>}
                <p><strong>Universidade:</strong> {form.universidade} ({form.anoFormacao})</p>
                {form.residencia && <p><strong>Residência:</strong> {form.residencia}</p>}
                {form.experienciaAnos && <p><strong>Experiência:</strong> {form.experienciaAnos} anos</p>}
                {form.valorConsulta && <p><strong>Consulta:</strong> R$ {form.valorConsulta}</p>}
              </div>
              {form.convenios.length > 0 && (
                <div>
                  <strong className="text-sm">Convênios:</strong>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {form.convenios.map(c => <Badge key={c} variant="outline" className="text-xs">{c}</Badge>)}
                  </div>
                </div>
              )}
              {form.sobre && <p className="text-sm"><strong>Sobre:</strong> {form.sobre}</p>}
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-sm">
              <h4 className="font-semibold text-yellow-400 mb-2"><Shield className="w-4 h-4 inline mr-1" />Processo de Validação</h4>
              <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                <li>Seu CRM será verificado no portal do Conselho Federal de Medicina (CFM)</li>
                <li>O RQE será validado para confirmar a especialidade declarada</li>
                <li>A equipe MedFocus entrará em contato se necessário</li>
                <li>Após aprovação, seu perfil será publicado na plataforma</li>
                <li>Prazo estimado: até 5 dias úteis</li>
              </ol>
            </div>

            <label className="flex items-start gap-3 p-4 bg-background border border-border rounded-xl cursor-pointer">
              <input type="checkbox" checked={form.aceitaTermos} onChange={e => updateField('aceitaTermos', e.target.checked)}
                className="mt-1 rounded" />
              <span className="text-sm">
                Declaro que as informações fornecidas são verdadeiras e autorizo a equipe MedFocus a verificar meus dados profissionais junto ao CFM e CRMs regionais. Concordo com os termos de uso e política de privacidade da plataforma.
              </span>
            </label>
            {errors.aceitaTermos && <p className="text-xs text-red-400">{errors.aceitaTermos}</p>}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />Voltar
              </Button>
              <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
                <Send className="w-4 h-4 mr-2" />Enviar Cadastro
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
