import React, { useState, useMemo } from 'react';
interface MedPrice { id:string; nome:string; pa:string; ap:string; precos:{f:string;p:number}[]; }
const MEDS:MedPrice[]=[
  {id:'1',nome:'Paracetamol 750mg',pa:'Paracetamol',ap:'Cx 20 comp',precos:[{f:'Drogasil',p:12.9},{f:'Droga Raia',p:11.5},{f:'Pacheco',p:13.2},{f:'Ultrafarma',p:8.9},{f:'Pague Menos',p:10.5}]},
  {id:'2',nome:'Dipirona 500mg',pa:'Metamizol',ap:'Cx 30 comp',precos:[{f:'Drogasil',p:15.9},{f:'Droga Raia',p:14.2},{f:'Ultrafarma',p:9.9},{f:'Pague Menos',p:12.5},{f:'Panvel',p:13.8}]},
  {id:'3',nome:'Losartana 50mg',pa:'Losartana',ap:'Cx 30 comp',precos:[{f:'Drogasil',p:18.9},{f:'Droga Raia',p:17.5},{f:'Ultrafarma',p:12.9},{f:'Pague Menos',p:15.9},{f:'Panvel',p:16.5}]},
  {id:'4',nome:'Metformina 850mg',pa:'Metformina',ap:'Cx 30 comp',precos:[{f:'Drogasil',p:14.5},{f:'Droga Raia',p:13.9},{f:'Ultrafarma',p:8.5},{f:'Pague Menos',p:11.9},{f:'Panvel',p:12.8}]},
  {id:'5',nome:'Omeprazol 20mg',pa:'Omeprazol',ap:'Cx 28 cáps',precos:[{f:'Drogasil',p:22.9},{f:'Droga Raia',p:21.5},{f:'Ultrafarma',p:14.9},{f:'Pague Menos',p:18.5},{f:'Panvel',p:19.9}]},
  {id:'6',nome:'Amoxicilina 500mg',pa:'Amoxicilina',ap:'Cx 21 cáps',precos:[{f:'Drogasil',p:28.9},{f:'Droga Raia',p:26.5},{f:'Ultrafarma',p:18.9},{f:'Pague Menos',p:23.5},{f:'Panvel',p:25.0}]},
  {id:'7',nome:'Sinvastatina 20mg',pa:'Sinvastatina',ap:'Cx 30 comp',precos:[{f:'Drogasil',p:24.9},{f:'Droga Raia',p:22.5},{f:'Ultrafarma',p:15.9},{f:'Pague Menos',p:19.9},{f:'Panvel',p:21.0}]},
  {id:'8',nome:'Atenolol 50mg',pa:'Atenolol',ap:'Cx 30 comp',precos:[{f:'Drogasil',p:16.9},{f:'Droga Raia',p:15.5},{f:'Ultrafarma',p:9.9},{f:'Pague Menos',p:13.5},{f:'Panvel',p:14.2}]},
  {id:'9',nome:'Fluoxetina 20mg',pa:'Fluoxetina',ap:'Cx 30 cáps',precos:[{f:'Drogasil',p:19.9},{f:'Droga Raia',p:18.5},{f:'Ultrafarma',p:11.9},{f:'Pague Menos',p:15.9},{f:'Panvel',p:16.8}]},
  {id:'10',nome:'Levotiroxina 50mcg',pa:'Levotiroxina',ap:'Cx 30 comp',precos:[{f:'Drogasil',p:21.9},{f:'Droga Raia',p:20.5},{f:'Ultrafarma',p:14.9},{f:'Pague Menos',p:17.9},{f:'Panvel',p:18.5}]},
];
export default function PriceComparison(){
  const[search,setSearch]=useState('');const[sel,setSel]=useState<MedPrice|null>(null);const[sortBy,setSortBy]=useState<'preco'|'nome'>('preco');
  const filtered=useMemo(()=>{const f=MEDS.filter(m=>{const s=search.toLowerCase();return!s||m.nome.toLowerCase().includes(s)||m.pa.toLowerCase().includes(s);});return sortBy==='nome'?[...f].sort((a,b)=>a.nome.localeCompare(b.nome)):f;},[search,sortBy]);
  const mn=(m:MedPrice)=>Math.min(...m.precos.map(p=>p.p));const mx=(m:MedPrice)=>Math.max(...m.precos.map(p=>p.p));const ec=(m:MedPrice)=>((1-mn(m)/mx(m))*100).toFixed(0);
  return(
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-6"><h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3"><span className="text-3xl">💰</span> Comparador de Preços</h1><p className="text-sm text-muted-foreground mt-1">Compare preços entre farmácias e economize</p></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[{v:MEDS.length,l:'Medicamentos',c:'text-primary'},{v:new Set(MEDS.flatMap(m=>m.precos.map(p=>p.f))).size,l:'Farmácias',c:'text-blue-400'},{v:`${Math.max(...MEDS.map(m=>parseInt(ec(m))))}%`,l:'Maior Economia',c:'text-green-400'},{v:`R$ ${(MEDS.reduce((a,m)=>a+mn(m),0)/MEDS.length).toFixed(2)}`,l:'Preço Médio',c:'text-orange-400'}].map((s,i)=>(
          <div key={i} className="bg-card border border-border rounded-xl p-4 text-center"><div className={`text-2xl font-bold ${s.c}`}>{s.v}</div><div className="text-xs text-muted-foreground">{s.l}</div></div>
        ))}
      </div>
      <div className="space-y-3 mb-6">
        <input type="text" placeholder="Buscar medicamento..." value={search} onChange={e=>setSearch(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary outline-none"/>
        <div className="flex gap-2">
          <button onClick={()=>setSortBy('preco')} className={`px-3 py-1.5 rounded-full text-xs font-medium ${sortBy==='preco'?'bg-primary text-primary-foreground':'bg-card border border-border'}`}>Menor Preço</button>
          <button onClick={()=>setSortBy('nome')} className={`px-3 py-1.5 rounded-full text-xs font-medium ${sortBy==='nome'?'bg-primary text-primary-foreground':'bg-card border border-border'}`}>A-Z</button>
        </div>
      </div>
      {sel?(
        <div className="bg-card border border-border rounded-xl p-6">
          <button onClick={()=>setSel(null)} className="text-primary text-sm mb-4 hover:underline">← Voltar</button>
          <h2 className="text-xl font-bold mb-1">{sel.nome}</h2><p className="text-sm text-muted-foreground mb-4">{sel.pa} — {sel.ap}</p>
          <div className="space-y-2">
            {[...sel.precos].sort((a,b)=>a.p-b.p).map((p,i)=>(
              <div key={p.f} className={`flex items-center justify-between p-3 rounded-lg ${i===0?'bg-green-500/10 border border-green-500/30':'bg-muted/30'}`}>
                <div className="flex items-center gap-3">{i===0&&<span className="text-green-400 text-xs font-bold">MENOR</span>}<span className="text-sm font-medium">{p.f}</span></div>
                <div className="text-right"><span className={`text-lg font-bold ${i===0?'text-green-400':'text-foreground'}`}>R$ {p.p.toFixed(2)}</span>{i>0&&<p className="text-xs text-red-400">+R$ {(p.p-mn(sel)).toFixed(2)}</p>}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg"><p className="text-sm text-green-400">Economia de até <strong>{ec(sel)}%</strong> (R$ {(mx(sel)-mn(sel)).toFixed(2)})</p></div>
        </div>
      ):(
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map(m=>(
            <button key={m.id} onClick={()=>setSel(m)} className="bg-card border border-border rounded-xl p-4 text-left hover:bg-accent transition-all">
              <div className="flex items-start justify-between"><div><h3 className="font-semibold text-sm">{m.nome}</h3><p className="text-xs text-muted-foreground">{m.pa} — {m.ap}</p></div><span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-xs font-bold">-{ec(m)}%</span></div>
              <div className="flex items-center justify-between mt-2"><span className="text-lg font-bold text-green-400">R$ {mn(m).toFixed(2)}</span><span className="text-xs text-muted-foreground line-through">R$ {mx(m).toFixed(2)}</span></div>
              <p className="text-xs text-muted-foreground mt-1">{m.precos.length} farmácias</p>
            </button>
          ))}
          {!filtered.length&&<div className="col-span-2 text-center py-12 text-muted-foreground"><p>Nenhum medicamento encontrado.</p></div>}
        </div>
      )}
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl"><p className="text-xs text-blue-400"><strong>Aviso:</strong> Preços referenciais. Consulte a farmácia para valores atualizados.</p></div>
    </div>
  );
}
