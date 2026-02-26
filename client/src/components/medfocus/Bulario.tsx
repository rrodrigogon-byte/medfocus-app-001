/**
 * MedFocus — Bulário Digital
 * Consulta de bulas de medicamentos com busca por nome, princípio ativo ou laboratório.
 */
import React, { useState, useMemo } from 'react';

interface BulaInfo {
  id: string; nome: string; principioAtivo: string; laboratorio: string;
  classe: string; tarja: 'sem_receita' | 'vermelha' | 'preta';
  indicacoes: string; contraindicacoes: string; posologia: string;
  efeitosColaterais: string; interacoes: string; armazenamento: string; apresentacao: string;
}

const DB: BulaInfo[] = [
  { id:'1', nome:'Paracetamol', principioAtivo:'Paracetamol', laboratorio:'Medley', classe:'Analgésico/Antitérmico', tarja:'sem_receita', indicacoes:'Dores leves a moderadas, febre, cefaleia, dores musculares.', contraindicacoes:'Hipersensibilidade. Insuficiência hepática grave.', posologia:'Adultos: 500-1000mg a cada 4-6h. Máx: 4g/dia.', efeitosColaterais:'Raros: reações alérgicas. Doses elevadas: hepatotoxicidade.', interacoes:'Varfarina, álcool, fenitoína.', armazenamento:'15-30°C, proteger da luz.', apresentacao:'Comp 500mg/750mg. Gotas 200mg/mL.' },
  { id:'2', nome:'Dipirona Sódica', principioAtivo:'Metamizol Sódico', laboratorio:'EMS', classe:'Analgésico/Antitérmico', tarja:'sem_receita', indicacoes:'Dor aguda, febre alta, cólicas.', contraindicacoes:'Discrasias sanguíneas. Porfiria. Deficiência G6PD.', posologia:'500-1000mg até 4x/dia.', efeitosColaterais:'Agranulocitose (rara), reações anafiláticas.', interacoes:'Ciclosporina, metotrexato.', armazenamento:'15-30°C.', apresentacao:'Comp 500mg/1g. Gotas 500mg/mL.' },
  { id:'3', nome:'Ibuprofeno', principioAtivo:'Ibuprofeno', laboratorio:'Aché', classe:'AINE', tarja:'sem_receita', indicacoes:'Dor, inflamação, febre, artrite, dismenorreia.', contraindicacoes:'Úlcera ativa, IR/IC grave, 3º tri gestação.', posologia:'200-400mg a cada 4-6h. Máx: 1200mg/dia.', efeitosColaterais:'Dispepsia, úlcera, retenção hídrica.', interacoes:'Anticoagulantes, anti-hipertensivos, lítio.', armazenamento:'15-30°C.', apresentacao:'Comp 200/400/600mg. Susp 50/100mg/mL.' },
  { id:'4', nome:'Amoxicilina', principioAtivo:'Amoxicilina', laboratorio:'Eurofarma', classe:'Antibiótico/Penicilina', tarja:'vermelha', indicacoes:'Otite, sinusite, pneumonia, ITU, H. pylori.', contraindicacoes:'Alergia a penicilinas. Mononucleose.', posologia:'500mg 8/8h ou 875mg 12/12h por 7-14 dias.', efeitosColaterais:'Diarreia, náusea, rash, candidíase.', interacoes:'Probenecida, metotrexato, ACO.', armazenamento:'Susp: refrigeração até 14 dias.', apresentacao:'Cáps 500mg. Comp 875mg. Susp 250/500mg/5mL.' },
  { id:'5', nome:'Losartana', principioAtivo:'Losartana Potássica', laboratorio:'Medley', classe:'Anti-hipertensivo/BRA', tarja:'vermelha', indicacoes:'HAS, proteção renal DM2, IC.', contraindicacoes:'Gestação 2º/3º tri, estenose bilateral art renal.', posologia:'50mg 1x/dia. Pode aumentar para 100mg.', efeitosColaterais:'Tontura, hipotensão, hipercalemia.', interacoes:'Supl potássio, AINEs, lítio.', armazenamento:'15-30°C.', apresentacao:'Comp 25/50/100mg.' },
  { id:'6', nome:'Metformina', principioAtivo:'Cloridrato de Metformina', laboratorio:'Merck', classe:'Antidiabético/Biguanida', tarja:'vermelha', indicacoes:'DM2, SOP (off-label), pré-diabetes.', contraindicacoes:'IR grave (TFG<30), acidose metabólica.', posologia:'Iniciar 500mg 1-2x/dia. Máx: 2550mg/dia.', efeitosColaterais:'Náusea, diarreia, gosto metálico. Raro: acidose lática.', interacoes:'Contraste iodado, álcool, cimetidina.', armazenamento:'15-30°C.', apresentacao:'Comp 500/850/1000mg. LP 500/750mg.' },
  { id:'7', nome:'Omeprazol', principioAtivo:'Omeprazol', laboratorio:'EMS', classe:'IBP', tarja:'sem_receita', indicacoes:'Úlcera, DRGE, esofagite, H. pylori.', contraindicacoes:'Hipersensibilidade a benzimidazóis.', posologia:'20mg 1x/dia em jejum por 4-8 semanas.', efeitosColaterais:'Cefaleia, diarreia. Longo prazo: def Mg, B12.', interacoes:'Clopidogrel, diazepam, varfarina.', armazenamento:'15-30°C.', apresentacao:'Cáps 10/20/40mg.' },
  { id:'8', nome:'Atenolol', principioAtivo:'Atenolol', laboratorio:'Biosintética', classe:'Betabloqueador', tarja:'vermelha', indicacoes:'HAS, angina, arritmias, pós-IAM.', contraindicacoes:'Bradicardia severa, BAV 2º/3º grau, asma grave.', posologia:'25-100mg 1x/dia.', efeitosColaterais:'Bradicardia, fadiga, extremidades frias.', interacoes:'Verapamil, clonidina, insulina.', armazenamento:'15-30°C.', apresentacao:'Comp 25/50/100mg.' },
  { id:'9', nome:'Sinvastatina', principioAtivo:'Sinvastatina', laboratorio:'Medley', classe:'Estatina', tarja:'vermelha', indicacoes:'Hipercolesterolemia, prevenção CV.', contraindicacoes:'Doença hepática ativa, gestação.', posologia:'20-40mg à noite. Máx: 80mg/dia.', efeitosColaterais:'Mialgia, rabdomiólise (rara), hepatotoxicidade.', interacoes:'Fibratos, ciclosporina, amiodarona, grapefruit.', armazenamento:'15-30°C.', apresentacao:'Comp 10/20/40/80mg.' },
  { id:'10', nome:'Levotiroxina', principioAtivo:'Levotiroxina Sódica', laboratorio:'Merck', classe:'Hormônio Tireoidiano', tarja:'vermelha', indicacoes:'Hipotireoidismo, supressão TSH.', contraindicacoes:'Tireotoxicose, IAM, insuf adrenal.', posologia:'1,6mcg/kg/dia em jejum.', efeitosColaterais:'Doses excessivas: taquicardia, tremores, insônia.', interacoes:'Cálcio, ferro (separar 4h), varfarina.', armazenamento:'15-30°C.', apresentacao:'Comp 25-200mcg (12 doses).' },
  { id:'11', nome:'Clonazepam', principioAtivo:'Clonazepam', laboratorio:'Roche', classe:'Benzodiazepínico', tarja:'preta', indicacoes:'Epilepsia, pânico, ansiedade.', contraindicacoes:'Miastenia gravis, IR grave, glaucoma ângulo fechado.', posologia:'0,25-0,5mg 2x/dia. Máx: 4mg/dia.', efeitosColaterais:'Sonolência, dependência, amnésia.', interacoes:'Álcool, opioides, depressores SNC.', armazenamento:'15-30°C.', apresentacao:'Comp 0,25/0,5/2mg. Gotas 2,5mg/mL.' },
  { id:'12', nome:'Prednisona', principioAtivo:'Prednisona', laboratorio:'EMS', classe:'Corticosteroide', tarja:'vermelha', indicacoes:'Doenças autoimunes, asma grave, artrite.', contraindicacoes:'Infecções fúngicas sistêmicas.', posologia:'5-60mg/dia. Desmame gradual obrigatório.', efeitosColaterais:'Cushing, hiperglicemia, osteoporose.', interacoes:'AINEs, anticoagulantes, vacinas vivas.', armazenamento:'15-30°C.', apresentacao:'Comp 5/20mg.' },
  { id:'13', nome:'Fluoxetina', principioAtivo:'Cloridrato de Fluoxetina', laboratorio:'Medley', classe:'Antidepressivo/ISRS', tarja:'vermelha', indicacoes:'Depressão, TOC, bulimia, pânico.', contraindicacoes:'Uso concomitante de IMAO.', posologia:'20mg/dia pela manhã. Até 80mg/dia.', efeitosColaterais:'Náusea, insônia, disfunção sexual.', interacoes:'IMAO, tramadol, triptanos, varfarina.', armazenamento:'15-30°C.', apresentacao:'Cáps/Comp 20mg. Sol 20mg/5mL.' },
  { id:'14', nome:'Enalapril', principioAtivo:'Maleato de Enalapril', laboratorio:'Biolab', classe:'Anti-hipertensivo/IECA', tarja:'vermelha', indicacoes:'HAS, IC, nefropatia diabética.', contraindicacoes:'Gestação, angioedema prévio.', posologia:'5-20mg 1-2x/dia.', efeitosColaterais:'Tosse seca (10-15%), hipotensão, angioedema.', interacoes:'Poupadores de K, AINEs, lítio.', armazenamento:'15-30°C.', apresentacao:'Comp 5/10/20mg.' },
  { id:'15', nome:'Azitromicina', principioAtivo:'Azitromicina', laboratorio:'EMS', classe:'Antibiótico/Macrolídeo', tarja:'vermelha', indicacoes:'Pneumonia, sinusite, faringite, clamídia.', contraindicacoes:'Alergia a macrolídeos, prolongamento QT.', posologia:'500mg 1x/dia por 3 dias.', efeitosColaterais:'Diarreia, náusea. Raro: prolongamento QT.', interacoes:'Antiácidos, varfarina, digoxina.', armazenamento:'15-30°C.', apresentacao:'Comp 500mg. Susp 600mg/15mL.' },
  { id:'16', nome:'Hidroclorotiazida', principioAtivo:'Hidroclorotiazida', laboratorio:'Medley', classe:'Diurético Tiazídico', tarja:'vermelha', indicacoes:'HAS, edema.', contraindicacoes:'Anúria, hipocalemia grave.', posologia:'12,5-25mg 1x/dia pela manhã.', efeitosColaterais:'Hipocalemia, hiperuricemia, hiperglicemia.', interacoes:'Lítio, digoxina, AINEs.', armazenamento:'15-30°C.', apresentacao:'Comp 25/50mg.' },
  { id:'17', nome:'Dexametasona', principioAtivo:'Dexametasona', laboratorio:'Aché', classe:'Corticosteroide', tarja:'vermelha', indicacoes:'Edema cerebral, alergias graves, COVID grave.', contraindicacoes:'Infecções fúngicas sistêmicas.', posologia:'0,5-9mg/dia. COVID: 6mg/dia por 10 dias.', efeitosColaterais:'Hiperglicemia, imunossupressão, Cushing.', interacoes:'AINEs, anticoagulantes, vacinas vivas.', armazenamento:'15-30°C.', apresentacao:'Comp 0,5/0,75/4mg. Elixir. Injetável.' },
  { id:'18', nome:'Captopril', principioAtivo:'Captopril', laboratorio:'EMS', classe:'Anti-hipertensivo/IECA', tarja:'vermelha', indicacoes:'HAS, crise hipertensiva, IC.', contraindicacoes:'Gestação, angioedema prévio.', posologia:'25-50mg 2-3x/dia. Crise: 25mg SL.', efeitosColaterais:'Tosse seca, hipotensão, disgeusia.', interacoes:'Poupadores de K, AINEs, lítio.', armazenamento:'15-30°C.', apresentacao:'Comp 12,5/25/50mg.' },
  { id:'19', nome:'Diclofenaco', principioAtivo:'Diclofenaco Sódico', laboratorio:'Novartis', classe:'AINE', tarja:'sem_receita', indicacoes:'Dor, inflamação, artrite, trauma.', contraindicacoes:'Úlcera ativa, IR/IC grave, pós-CRVM.', posologia:'50mg 2-3x/dia. Máx: 150mg/dia.', efeitosColaterais:'Dispepsia, úlcera GI, risco CV.', interacoes:'Anticoagulantes, lítio, metotrexato.', armazenamento:'15-30°C.', apresentacao:'Comp 50mg. Retard 100mg. Gel 1%.' },
  { id:'20', nome:'Insulina NPH', principioAtivo:'Insulina Humana NPH', laboratorio:'Novo Nordisk', classe:'Insulina', tarja:'vermelha', indicacoes:'DM1 e DM2 (insulina basal).', contraindicacoes:'Hipoglicemia.', posologia:'Individualizada. DM2: iniciar 10UI ao deitar.', efeitosColaterais:'Hipoglicemia, ganho de peso, lipodistrofia.', interacoes:'Betabloqueadores, corticoides, álcool.', armazenamento:'Refrigeração 2-8°C. Em uso: temp amb 28 dias.', apresentacao:'Frasco 100UI/mL. Refil caneta 3mL.' },
];

const CATS = ['Todas','Analgésico','AINE','Antibiótico','Anti-hipertensivo','Antidiabético','Corticosteroide','Antidepressivo','Benzodiazepínico','Diurético','Hormônio','Estatina','IBP','Insulina'];

export default function Bulario() {
  const [search, setSearch] = useState('');
  const [sel, setSel] = useState<BulaInfo|null>(null);
  const [cat, setCat] = useState('Todas');
  const [tarja, setTarja] = useState('todas');

  const filtered = useMemo(() => DB.filter(b => {
    const s = search.toLowerCase();
    const ms = !s || b.nome.toLowerCase().includes(s) || b.principioAtivo.toLowerCase().includes(s) || b.laboratorio.toLowerCase().includes(s) || b.classe.toLowerCase().includes(s);
    const mc = cat === 'Todas' || b.classe.toLowerCase().includes(cat.toLowerCase());
    const mt = tarja === 'todas' || b.tarja === tarja;
    return ms && mc && mt;
  }), [search, cat, tarja]);

  const tl = (t:string) => ({ sem_receita:{text:'Sem Receita',c:'bg-green-500/20 text-green-400'}, vermelha:{text:'Tarja Vermelha',c:'bg-red-500/20 text-red-400'}, preta:{text:'Tarja Preta',c:'bg-gray-800 text-white border border-gray-600'} }[t] || {text:t,c:'bg-gray-500/20'});

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3"><span className="text-3xl">📖</span> Bulário Digital</h1>
        <p className="text-sm text-muted-foreground mt-1">Consulte bulas completas com indicações, posologia, efeitos colaterais e interações</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[{v:DB.length,l:'Bulas',c:'text-primary'},{v:DB.filter(b=>b.tarja==='sem_receita').length,l:'Sem Receita',c:'text-green-400'},{v:DB.filter(b=>b.tarja==='vermelha').length,l:'Tarja Vermelha',c:'text-red-400'},{v:DB.filter(b=>b.tarja==='preta').length,l:'Tarja Preta',c:'text-gray-400'}].map((s,i)=>(
          <div key={i} className="bg-card border border-border rounded-xl p-4 text-center">
            <div className={`text-2xl font-bold ${s.c}`}>{s.v}</div>
            <div className="text-xs text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
      <div className="space-y-3 mb-6">
        <input type="text" placeholder="Buscar por nome, princípio ativo, laboratório..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none"/>
        <div className="flex flex-wrap gap-2">
          <select value={cat} onChange={e=>setCat(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm">{CATS.map(c=><option key={c}>{c}</option>)}</select>
          <select value={tarja} onChange={e=>setTarja(e.target.value)} className="px-3 py-2 rounded-lg bg-card border border-border text-sm">
            <option value="todas">Todas as Tarjas</option><option value="sem_receita">Sem Receita</option><option value="vermelha">Tarja Vermelha</option><option value="preta">Tarja Preta</option>
          </select>
        </div>
      </div>
      {sel ? (
        <div className="bg-card border border-border rounded-xl p-6">
          <button onClick={()=>setSel(null)} className="text-primary text-sm mb-4 hover:underline">← Voltar</button>
          <div className="flex items-start justify-between mb-4">
            <div><h2 className="text-xl font-bold">{sel.nome}</h2><p className="text-sm text-muted-foreground">{sel.principioAtivo} — {sel.laboratorio}</p><p className="text-xs text-muted-foreground mt-1">{sel.classe}</p></div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${tl(sel.tarja).c}`}>{tl(sel.tarja).text}</span>
          </div>
          <div className="space-y-4">
            {[{t:'💊 Apresentação',c:sel.apresentacao},{t:'✅ Indicações',c:sel.indicacoes},{t:'🚫 Contraindicações',c:sel.contraindicacoes},{t:'📋 Posologia',c:sel.posologia},{t:'⚠️ Efeitos Colaterais',c:sel.efeitosColaterais},{t:'🔄 Interações',c:sel.interacoes},{t:'📦 Armazenamento',c:sel.armazenamento}].map(s=>(
              <div key={s.t} className="bg-muted/30 rounded-lg p-4"><h3 className="font-semibold text-sm mb-2">{s.t}</h3><p className="text-sm text-foreground/80 leading-relaxed">{s.c}</p></div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"><p className="text-xs text-yellow-400">⚠️ Informações educacionais. Consulte sempre o médico ou farmacêutico.</p></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(b=>(
            <button key={b.id} onClick={()=>setSel(b)} className="bg-card border border-border rounded-xl p-4 text-left hover:bg-accent transition-all">
              <div className="flex items-start justify-between"><div><h3 className="font-semibold text-sm">{b.nome}</h3><p className="text-xs text-muted-foreground">{b.principioAtivo} — {b.laboratorio}</p></div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${tl(b.tarja).c}`}>{tl(b.tarja).text}</span></div>
              <p className="text-xs text-foreground/60 mt-2 line-clamp-2">{b.indicacoes}</p>
            </button>
          ))}
          {!filtered.length && <div className="col-span-2 text-center py-12 text-muted-foreground"><p>Nenhuma bula encontrada.</p></div>}
        </div>
      )}
    </div>
  );
}
