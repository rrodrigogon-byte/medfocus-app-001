/**
 * MedFocus Academy — Plataforma de Mentorias ao Vivo
 * Sprint 64: Mentorias, masterclasses e networking médico
 * 
 * Funcionalidades:
 * - Agenda de mentorias ao vivo por especialidade
 * - Perfis de mentores com avaliações
 * - Masterclasses gravadas e ao vivo
 * - Sistema de agendamento 1:1
 * - Networking entre profissionais
 * - Certificados de participação
 */
import React, { useState, useMemo } from 'react';

interface Mentor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  institution: string;
  photo: string;
  rating: number;
  reviews: number;
  sessions: number;
  bio: string;
  expertise: string[];
  price: number;
  availability: string[];
  featured: boolean;
}

interface Masterclass {
  id: string;
  title: string;
  mentor: string;
  specialty: string;
  date: string;
  duration: string;
  type: 'live' | 'recorded';
  attendees: number;
  maxAttendees: number;
  description: string;
  topics: string[];
  level: 'Básico' | 'Intermediário' | 'Avançado';
  price: number;
  rating?: number;
}

const MENTORS: Mentor[] = [
  { id: 'm1', name: 'Prof. Dr. Roberto Kalil Filho', title: 'Professor Titular de Cardiologia', specialty: 'Cardiologia', institution: 'FMUSP / InCor', photo: '👨‍⚕️', rating: 4.9, reviews: 234, sessions: 456, bio: 'Cardiologista com mais de 30 anos de experiência. Referência em cardiologia intervencionista e insuficiência cardíaca.', expertise: ['Insuficiência Cardíaca', 'Cardiologia Intervencionista', 'Ecocardiografia', 'Pesquisa Clínica'], price: 350, availability: ['Seg 19h', 'Qua 20h', 'Sex 18h'], featured: true },
  { id: 'm2', name: 'Profa. Dra. Ana Claudia Latronico', title: 'Professora de Endocrinologia', specialty: 'Endocrinologia', institution: 'FMUSP / HC-SP', photo: '👩‍⚕️', rating: 4.8, reviews: 189, sessions: 312, bio: 'Endocrinologista especialista em distúrbios da tireoide e diabetes. Pesquisadora do CNPq.', expertise: ['Diabetes Mellitus', 'Tireoide', 'Obesidade', 'Endocrinologia Pediátrica'], price: 280, availability: ['Ter 19h', 'Qui 20h'], featured: true },
  { id: 'm3', name: 'Dr. Drauzio Varella', title: 'Oncologista e Comunicador', specialty: 'Oncologia', institution: 'Hospital Sírio-Libanês', photo: '👨‍🔬', rating: 5.0, reviews: 567, sessions: 890, bio: 'Médico oncologista, escritor e comunicador de saúde. Referência em saúde pública e prevenção.', expertise: ['Oncologia Clínica', 'Saúde Pública', 'Comunicação Médica', 'Prevenção'], price: 500, availability: ['Sáb 10h'], featured: true },
  { id: 'm4', name: 'Dra. Nise Yamaguchi', title: 'Imunologista e Oncologista', specialty: 'Imunologia', institution: 'Hospital Albert Einstein', photo: '👩‍🔬', rating: 4.7, reviews: 145, sessions: 234, bio: 'Especialista em imunoterapia oncológica e medicina personalizada.', expertise: ['Imunoterapia', 'Oncologia Molecular', 'Medicina Personalizada'], price: 320, availability: ['Seg 20h', 'Qua 19h'], featured: false },
  { id: 'm5', name: 'Prof. Dr. Miguel Srougi', title: 'Professor Emérito de Urologia', specialty: 'Urologia', institution: 'FMUSP', photo: '👨‍⚕️', rating: 4.9, reviews: 298, sessions: 567, bio: 'Urologista pioneiro em cirurgia robótica no Brasil. Mais de 10.000 cirurgias realizadas.', expertise: ['Cirurgia Robótica', 'Câncer de Próstata', 'Urologia Oncológica'], price: 400, availability: ['Ter 18h', 'Sex 19h'], featured: false },
  { id: 'm6', name: 'Dra. Ludhmila Hajjar', title: 'Cardiologista Intensivista', specialty: 'Cardiologia/UTI', institution: 'InCor / FMUSP', photo: '👩‍⚕️', rating: 4.8, reviews: 176, sessions: 289, bio: 'Referência em cardio-oncologia e cuidados intensivos cardiovasculares.', expertise: ['Cardio-Oncologia', 'Terapia Intensiva', 'Hemodinâmica', 'Pesquisa Clínica'], price: 300, availability: ['Qua 20h', 'Sáb 9h'], featured: false },
];

const MASTERCLASSES: Masterclass[] = [
  { id: 'mc1', title: 'Insuficiência Cardíaca: Do Diagnóstico ao Tratamento Avançado', mentor: 'Prof. Dr. Roberto Kalil Filho', specialty: 'Cardiologia', date: '2026-03-05', duration: '2h', type: 'live', attendees: 234, maxAttendees: 500, description: 'Masterclass completa sobre IC com foco em novas terapias (SGLT2i, sacubitril-valsartana) e dispositivos.', topics: ['Classificação NYHA', 'ICFEr vs ICFEp', 'Terapia quádrupla', 'Dispositivos (CDI, TRC)', 'Transplante cardíaco'], level: 'Avançado', price: 0 },
  { id: 'mc2', title: 'Diabetes na Prática: Algoritmo de Tratamento 2026', mentor: 'Profa. Dra. Ana Claudia Latronico', specialty: 'Endocrinologia', date: '2026-03-08', duration: '1.5h', type: 'live', attendees: 189, maxAttendees: 300, description: 'Atualização sobre o manejo do DM2 com foco em GLP-1 RA, SGLT2i e insulinização.', topics: ['Algoritmo SBD 2026', 'GLP-1 RA (semaglutida, tirzepatida)', 'SGLT2i', 'Insulinização', 'Metas glicêmicas'], level: 'Intermediário', price: 0 },
  { id: 'mc3', title: 'Como Publicar seu Primeiro Artigo Científico', mentor: 'Dr. Drauzio Varella', specialty: 'Pesquisa', date: '2026-03-12', duration: '2h', type: 'live', attendees: 456, maxAttendees: 1000, description: 'Guia prático para publicação científica: da ideia ao paper aceito.', topics: ['Escolha do tema', 'Metodologia', 'Escrita científica', 'Submissão', 'Peer review'], level: 'Básico', price: 0 },
  { id: 'mc4', title: 'ECG na Emergência: 20 Traçados que Salvam Vidas', mentor: 'Dra. Ludhmila Hajjar', specialty: 'Emergência', date: '2026-03-01', duration: '1.5h', type: 'recorded', attendees: 1234, maxAttendees: 9999, description: 'Interpretação rápida de ECG em cenários de emergência com casos reais.', topics: ['IAM com supra', 'Arritmias letais', 'TEP', 'Hipercalemia', 'Tamponamento'], level: 'Intermediário', price: 29.90, rating: 4.9 },
  { id: 'mc5', title: 'Imunoterapia Oncológica: Revolução no Tratamento do Câncer', mentor: 'Dra. Nise Yamaguchi', specialty: 'Oncologia', date: '2026-02-25', duration: '2h', type: 'recorded', attendees: 567, maxAttendees: 9999, description: 'Panorama completo da imunoterapia: checkpoint inhibitors, CAR-T e vacinas terapêuticas.', topics: ['Anti-PD1/PDL1', 'Anti-CTLA4', 'CAR-T cells', 'Biomarcadores', 'Manejo de irAEs'], level: 'Avançado', price: 49.90, rating: 4.8 },
  { id: 'mc6', title: 'Cirurgia Robótica: O Futuro é Agora', mentor: 'Prof. Dr. Miguel Srougi', specialty: 'Cirurgia', date: '2026-02-20', duration: '1.5h', type: 'recorded', attendees: 345, maxAttendees: 9999, description: 'Evolução da cirurgia robótica no Brasil e perspectivas futuras.', topics: ['Plataforma Da Vinci', 'Prostatectomia robótica', 'Curva de aprendizado', 'Custos vs benefícios'], level: 'Intermediário', price: 39.90, rating: 4.7 },
];

export default function MedFocusAcademy() {
  const [view, setView] = useState<'home' | 'mentors' | 'masterclasses' | 'mentor-detail'>('home');
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterType, setFilterType] = useState<'all' | 'live' | 'recorded'>('all');

  const specialties = useMemo(() => [...new Set(MENTORS.map(m => m.specialty))], []);

  const filteredMentors = useMemo(() => {
    if (filterSpecialty === 'all') return MENTORS;
    return MENTORS.filter(m => m.specialty === filterSpecialty);
  }, [filterSpecialty]);

  const filteredMasterclasses = useMemo(() => {
    let result = MASTERCLASSES;
    if (filterSpecialty !== 'all') result = result.filter(m => m.specialty === filterSpecialty);
    if (filterType !== 'all') result = result.filter(m => m.type === filterType);
    return result;
  }, [filterSpecialty, filterType]);

  const upcomingLive = MASTERCLASSES.filter(m => m.type === 'live' && new Date(m.date) >= new Date()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (view === 'mentor-detail' && selectedMentor) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        <button onClick={() => setView('mentors')} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          Voltar
        </button>

        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-2xl flex items-center justify-center text-4xl">{selectedMentor.photo}</div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-foreground">{selectedMentor.name}</h2>
              <p className="text-sm text-primary">{selectedMentor.title}</p>
              <p className="text-xs text-muted-foreground">{selectedMentor.institution}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-yellow-400">{'★'.repeat(Math.floor(selectedMentor.rating))} {selectedMentor.rating}</span>
                <span className="text-xs text-muted-foreground">{selectedMentor.reviews} avaliações</span>
                <span className="text-xs text-muted-foreground">{selectedMentor.sessions} sessões</span>
              </div>
            </div>
            {selectedMentor.featured && <span className="px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-bold">Destaque</span>}
          </div>
          <p className="text-sm text-muted-foreground mt-4">{selectedMentor.bio}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedMentor.expertise.map(e => <span key={e} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-medium">{e}</span>)}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Agendar Mentoria 1:1</h3>
            <p className="text-2xl font-bold text-primary mb-2">R$ {selectedMentor.price}<span className="text-xs text-muted-foreground font-normal">/sessão (50min)</span></p>
            <div className="space-y-2 mb-4">
              <p className="text-xs font-bold text-muted-foreground">Horários disponíveis:</p>
              {selectedMentor.availability.map(a => (
                <button key={a} className="w-full px-3 py-2 bg-muted/30 border border-border rounded-lg text-sm text-foreground hover:bg-accent transition-colors text-left">
                  📅 {a}
                </button>
              ))}
            </div>
            <button className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold hover:bg-primary/90 transition-colors">
              Agendar Mentoria
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-bold text-foreground mb-3">Masterclasses deste Mentor</h3>
            <div className="space-y-3">
              {MASTERCLASSES.filter(mc => mc.mentor === selectedMentor.name).map(mc => (
                <div key={mc.id} className="p-3 bg-muted/20 rounded-lg">
                  <h4 className="text-xs font-bold text-foreground">{mc.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${mc.type === 'live' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {mc.type === 'live' ? '🔴 AO VIVO' : '▶️ GRAVADO'}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{mc.duration}</span>
                    {mc.rating && <span className="text-[10px] text-yellow-400">★ {mc.rating}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">🎓</span> MedFocus Academy
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Mentorias, masterclasses e networking com os melhores médicos do Brasil</p>
        </div>
        <div className="flex gap-2">
          {(['home', 'mentors', 'masterclasses'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
              {v === 'home' ? '🏠 Início' : v === 'mentors' ? '👨‍⚕️ Mentores' : '🎬 Masterclasses'}
            </button>
          ))}
        </div>
      </div>

      {view === 'home' && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Mentores', value: '48', icon: '👨‍⚕️' },
              { label: 'Masterclasses', value: '156', icon: '🎬' },
              { label: 'Sessões realizadas', value: '12.5K', icon: '📅' },
              { label: 'Satisfação', value: '4.8/5', icon: '⭐' },
            ].map(s => (
              <div key={s.label} className="bg-card border border-border rounded-xl p-4 text-center">
                <span className="text-2xl">{s.icon}</span>
                <div className="text-xl font-bold text-foreground mt-1">{s.value}</div>
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Upcoming Live */}
          {upcomingLive.length > 0 && (
            <div className="bg-gradient-to-r from-red-500/5 to-orange-500/5 border border-red-500/20 rounded-xl p-5">
              <h3 className="text-sm font-bold text-red-400 mb-3">🔴 Próximas Masterclasses ao Vivo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {upcomingLive.map(mc => (
                  <div key={mc.id} className="bg-card border border-border rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-[10px] font-bold animate-pulse">AO VIVO</span>
                      <span className="text-[10px] text-muted-foreground">{new Date(mc.date).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{mc.title}</h4>
                    <p className="text-xs text-primary mt-1">{mc.mentor}</p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${mc.level === 'Básico' ? 'bg-emerald-500/20 text-emerald-400' : mc.level === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{mc.level}</span>
                        <span className="text-[10px] text-muted-foreground">{mc.duration}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{mc.attendees}/{mc.maxAttendees} inscritos</span>
                    </div>
                    <button className="w-full mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors">
                      {mc.price === 0 ? 'Inscrever-se (Gratuito)' : `Inscrever-se — R$ ${mc.price.toFixed(2)}`}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Featured Mentors */}
          <div>
            <h3 className="text-sm font-bold text-foreground mb-3">Mentores em Destaque</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MENTORS.filter(m => m.featured).map(m => (
                <button key={m.id} onClick={() => { setSelectedMentor(m); setView('mentor-detail'); }} className="bg-card border border-border rounded-xl p-4 text-left hover:border-primary/50 hover:shadow-lg transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center text-2xl">{m.photo}</div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{m.name}</h4>
                      <p className="text-[10px] text-muted-foreground">{m.specialty} — {m.institution}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-yellow-400">★ {m.rating}</span>
                    <span className="text-muted-foreground">{m.reviews} avaliações</span>
                    <span className="text-muted-foreground">{m.sessions} sessões</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{m.bio}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm font-bold text-primary">R$ {m.price}/sessão</span>
                    <span className="text-[10px] text-emerald-400">Disponível</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {view === 'mentors' && (
        <>
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setFilterSpecialty('all')} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterSpecialty === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>Todas</button>
            {specialties.map(s => (
              <button key={s} onClick={() => setFilterSpecialty(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterSpecialty === s ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>{s}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMentors.map(m => (
              <button key={m.id} onClick={() => { setSelectedMentor(m); setView('mentor-detail'); }} className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/50 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-teal-500/20 rounded-xl flex items-center justify-center text-3xl shrink-0">{m.photo}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-foreground group-hover:text-primary">{m.name}</h3>
                      {m.featured && <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 rounded text-[9px] font-bold">Destaque</span>}
                    </div>
                    <p className="text-xs text-primary">{m.title}</p>
                    <p className="text-[10px] text-muted-foreground">{m.institution}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs">
                      <span className="text-yellow-400">★ {m.rating} ({m.reviews})</span>
                      <span className="text-muted-foreground">{m.sessions} sessões</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {m.expertise.slice(0, 3).map(e => <span key={e} className="px-1.5 py-0.5 bg-muted/50 rounded text-[9px] text-muted-foreground">{e}</span>)}
                    </div>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-bold text-primary">R$ {m.price}/sessão</span>
                      <span className="text-[10px] text-emerald-400 font-medium">Ver perfil →</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {view === 'masterclasses' && (
        <>
          <div className="flex gap-2">
            {(['all', 'live', 'recorded'] as const).map(t => (
              <button key={t} onClick={() => setFilterType(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filterType === t ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
                {t === 'all' ? 'Todas' : t === 'live' ? '🔴 Ao Vivo' : '▶️ Gravadas'}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMasterclasses.map(mc => (
              <div key={mc.id} className="bg-card border border-border rounded-xl p-5 hover:border-primary/50 transition-all">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${mc.type === 'live' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    {mc.type === 'live' ? '🔴 AO VIVO' : '▶️ GRAVADO'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${mc.level === 'Básico' ? 'bg-emerald-500/20 text-emerald-400' : mc.level === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{mc.level}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground mb-1">{mc.title}</h3>
                <p className="text-xs text-primary">{mc.mentor} — {mc.specialty}</p>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{mc.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {mc.topics.slice(0, 3).map(t => <span key={t} className="px-1.5 py-0.5 bg-muted/50 rounded text-[9px] text-muted-foreground">{t}</span>)}
                  {mc.topics.length > 3 && <span className="text-[9px] text-muted-foreground">+{mc.topics.length - 3}</span>}
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{mc.duration}</span>
                    {mc.rating && <span className="text-xs text-yellow-400">★ {mc.rating}</span>}
                    <span className="text-xs text-muted-foreground">{mc.attendees} participantes</span>
                  </div>
                  <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:bg-primary/90">
                    {mc.price === 0 ? 'Gratuito' : `R$ ${mc.price.toFixed(2)}`}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
