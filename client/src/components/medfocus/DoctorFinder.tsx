import React, { useState, useMemo } from 'react';

interface Doctor {
  id: string; nome: string; crm: string; especialidade: string;
  cidade: string; estado: string; telefone: string;
  convenios: string[]; telemedicina: boolean; avaliacao: number;
}

const DOCTORS: Doctor[] = [
  { id:'1', nome:'Dr. Carlos Alberto Silva', crm:'CRM/SP 123456', especialidade:'Cardiologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 3456-7890', convenios:['Unimed','SulAmérica','Bradesco Saúde'], telemedicina:true, avaliacao:4.8 },
  { id:'2', nome:'Dra. Maria Fernanda Costa', crm:'CRM/SP 234567', especialidade:'Dermatologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 2345-6789', convenios:['Amil','Unimed','Porto Seguro'], telemedicina:true, avaliacao:4.9 },
  { id:'3', nome:'Dr. João Pedro Santos', crm:'CRM/RJ 345678', especialidade:'Ortopedia', cidade:'Rio de Janeiro', estado:'RJ', telefone:'(21) 3456-7890', convenios:['Unimed','Bradesco Saúde'], telemedicina:false, avaliacao:4.7 },
  { id:'4', nome:'Dra. Ana Beatriz Oliveira', crm:'CRM/MG 456789', especialidade:'Pediatria', cidade:'Belo Horizonte', estado:'MG', telefone:'(31) 3456-7890', convenios:['Unimed','SulAmérica','Hapvida'], telemedicina:true, avaliacao:4.9 },
  { id:'5', nome:'Dr. Roberto Mendes', crm:'CRM/RS 567890', especialidade:'Neurologia', cidade:'Porto Alegre', estado:'RS', telefone:'(51) 3456-7890', convenios:['Unimed','IPE Saúde'], telemedicina:true, avaliacao:4.6 },
  { id:'6', nome:'Dra. Juliana Ferreira', crm:'CRM/PR 678901', especialidade:'Ginecologia', cidade:'Curitiba', estado:'PR', telefone:'(41) 3456-7890', convenios:['Unimed','Amil','Paraná Clínicas'], telemedicina:false, avaliacao:4.8 },
  { id:'7', nome:'Dr. Marcos Antônio Lima', crm:'CRM/BA 789012', especialidade:'Endocrinologia', cidade:'Salvador', estado:'BA', telefone:'(71) 3456-7890', convenios:['Unimed','Bradesco Saúde','Cassi'], telemedicina:true, avaliacao:4.7 },
  { id:'8', nome:'Dra. Patrícia Souza', crm:'CRM/PE 890123', especialidade:'Psiquiatria', cidade:'Recife', estado:'PE', telefone:'(81) 3456-7890', convenios:['Unimed','Hapvida','SulAmérica'], telemedicina:true, avaliacao:4.9 },
  { id:'9', nome:'Dr. Fernando Almeida', crm:'CRM/CE 901234', especialidade:'Oftalmologia', cidade:'Fortaleza', estado:'CE', telefone:'(85) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.5 },
  { id:'10', nome:'Dra. Camila Rodrigues', crm:'CRM/DF 012345', especialidade:'Clínica Geral', cidade:'Brasília', estado:'DF', telefone:'(61) 3456-7890', convenios:['Unimed','Amil','SulAmérica','Bradesco Saúde'], telemedicina:true, avaliacao:4.8 },
  { id:'11', nome:'Dr. Lucas Barbosa', crm:'CRM/GO 112233', especialidade:'Urologia', cidade:'Goiânia', estado:'GO', telefone:'(62) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.6 },
  { id:'12', nome:'Dra. Renata Pires', crm:'CRM/SC 223344', especialidade:'Reumatologia', cidade:'Florianópolis', estado:'SC', telefone:'(48) 3456-7890', convenios:['Unimed','SulAmérica'], telemedicina:true, avaliacao:4.7 },
];

const ESPS = ['Todas',...[...new Set(DOCTORS.map(d=>d.especialidade))].sort()];
const ESTS = ['Todos',...[...new Set(DOCTORS.map(d=>d.estado))].sort()];

export default function DoctorFinder() {
  const [search, setSearch] = useState('');
  const [esp, setEsp] = useState('Todas');
  const [est, setEst] = useState('Todos');
  const [tele, setTele] = useState(false);

  const filtered = useMemo(() => DOCTORS.filter(d => {
    const s = search.toLowerCase();
    return (!s || d.nome.toLowerCase().includes(s) || d.cidade.toLowerCase().includes(s) || d.especialidade.toLowerCase().includes(s))
      && (esp === 'Todas' || d.especialidade === esp)
      && (est === 'Todos' || d.estado === est)
      && (!tele || d.telemedicina);
  }), [search, esp, est, tele]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3"><span className="text-3xl">🏥</span> Encontrar Médicos</h1>
        <p className="text-sm text-muted-foreground mt-1">Busque médicos por especialidade, cidade, estado e convênio</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[{v:DOCTORS.length,l:'Médicos',c:'text-primary'},{v:new Set(DOCTORS.map(d=>d.especialidade)).size,l:'Especialidades',c:'text-blue-400'},{v:new Set(DOCTORS.map(d=>d.estado)).size,l:'Estados',c:'text-green-400'},{v:DOCTORS.filter(d=>d.telemedicina).length,l:'Telemedicina',c:'text-purple-400'}].map((s,i)=>(
          <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div><div className="text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3 mb-6">
        <input type="text" placeholder="Buscar por nome, cidade ou especialidade..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none"/>
        <div className="flex flex-wrap gap-2 items-center">
          <select value={esp} onChange={e=>setEsp(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm">{ESPS.map(e=><option key={e}>{e}</option>)}</select>
          <select value={est} onChange={e=>setEst(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm">{ESTS.map(e=><option key={e}>{e}</option>)}</select>
          <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={tele} onChange={e=>setTele(e.target.checked)} className="accent-primary"/> Telemedicina</label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map(d=>(
          <div key={d.id} className="bg-card border border-border rounded-xl p-4 hover:bg-accent transition-all">
            <div className="flex items-start justify-between mb-2">
              <div><h3 className="font-semibold text-sm">{d.nome}</h3><p className="text-xs text-muted-foreground">{d.crm}</p></div>
              <div className="flex items-center gap-1"><span className="text-yellow-400 text-xs">★</span><span className="text-xs font-medium">{d.avaliacao}</span></div>
            </div>
            <p className="text-xs"><span className="text-primary font-medium">{d.especialidade}</span></p>
            <p className="text-xs text-muted-foreground">📍 {d.cidade}, {d.estado} | 📞 {d.telefone}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {d.convenios.map(c=><span key={c} className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px]">{c}</span>)}
              {d.telemedicina && <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px]">📹 Telemedicina</span>}
            </div>
          </div>
        ))}
        {!filtered.length && <div className="col-span-2 text-center py-12 text-muted-foreground"><p>Nenhum médico encontrado.</p></div>}
      </div>
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"><p className="text-xs text-blue-400"><strong>Aviso:</strong> Verifique o registro no site do CFM/CRM do respectivo estado.</p></div>
    </div>
  );
}
