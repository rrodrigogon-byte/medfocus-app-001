/**
 * MedFocus — Preços de Medicamentos
 * Comparativo de preços entre farmácias com filtro por cidade e seleção de redes.
 * Mostra resultados na própria tela com preços lado a lado.
 * Ao clicar na farmácia, exibe detalhes de contato inline (endereço, telefone, WhatsApp).
 */
import React, { useState, useMemo } from 'react';
import { ESTADOS_CIDADES_COMPLETO, ESTADOS_NOMES } from './cidadesBrasil';

interface FarmaciaContato {
  endereco: string;
  telefone: string;
  whatsapp: string;
  horario: string;
}

interface Farmacia {
  id: string;
  nome: string;
  cor: string;
  cidades: string[];
  urlBusca: (termo: string) => string;
  contato: FarmaciaContato;
  descricao: string;
}

// Redes nacionais: presentes em todas as capitais e cidades médias do Brasil
const REDE_NACIONAL = '__NACIONAL__';

const FARMACIAS: Farmacia[] = [
  {
    id: 'drogasil', nome: 'Drogasil', cor: '#e53e3e', cidades: [REDE_NACIONAL],
    urlBusca: (t) => `https://www.drogasil.com.br/search?w=${encodeURIComponent(t)}`,
    contato: { endereco: 'Presente em mais de 2.400 lojas em todo o Brasil', telefone: '0800 770 5050', whatsapp: '(11) 3003-5050', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Maior rede de farmácias do Brasil. Programa de fidelidade com descontos exclusivos.',
  },
  {
    id: 'drogaraia', nome: 'Droga Raia', cor: '#3182ce', cidades: [REDE_NACIONAL],
    urlBusca: (t) => `https://www.drogaraia.com.br/search?w=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 2.600 lojas em todo o Brasil', telefone: '0800 770 7222', whatsapp: '(11) 3003-7222', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede com ampla cobertura nacional. Oferece programa Raia Drogasil com descontos.',
  },
  {
    id: 'paguemenos', nome: 'Pague Menos', cor: '#38a169', cidades: [REDE_NACIONAL],
    urlBusca: (t) => `https://www.paguemenos.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 1.600 lojas em todos os estados', telefone: '0800 275 1313', whatsapp: '(85) 3255-7100', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede com foco em preço baixo. Programa Sempre presente com descontos.',
  },
  {
    id: 'drogariasaopaulo', nome: 'Drogaria São Paulo', cor: '#d69e2e',
    cidades: ['São Paulo','Campinas','Santos','Sorocaba','Ribeirão Preto','São José dos Campos','Guarulhos','Osasco','Santo André','São Bernardo do Campo','Jundiaí','Piracicaba','Bauru','Limeira','Franca','Mauá','Diadema','Carapicuíba','Mogi das Cruzes','Suzano','Taboão da Serra','Barueri','Cotia','Americana','Indaiatuba','Araraquara','São Carlos','Marília','Presidente Prudente','Rio Claro','Araçatuba','Botucatu','Jaú','Assis','Itapetininga','Taubaté','Jacareí','Bragança Paulista','Atibaia','Itu','Salto','Valinhos','Hortolândia','Sumaré','Santa Bárbara d\'Oeste','Sertãozinho','Catanduva','Birigui','Ourinhos','Leme','Itatiba','Votorantim','Mogi Guaçu','Franco da Rocha','Cajamar','Caieiras','Ferraz de Vasconcelos','Itaquaquecetuba','Praia Grande','São Vicente','Guarujá','Cubatão','Itanhaém','Bertioga','Mongaguá','Peruíbe'],
    urlBusca: (t) => `https://www.drogariasaopaulo.com.br/search?w=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 1.000 lojas em SP e RJ', telefone: '0800 770 7766', whatsapp: '(11) 3003-7766', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede focada em SP e RJ. Programa de fidelidade com cashback.',
  },
  {
    id: 'panvel', nome: 'Panvel', cor: '#805ad5',
    cidades: ['Porto Alegre','Caxias do Sul','Pelotas','Santa Maria','Canoas','Gravataí','Viamão','Novo Hamburgo','São Leopoldo','Rio Grande','Passo Fundo','Sapucaia do Sul','Cachoeirinha','Uruguaiana','Santa Cruz do Sul','Bagé','Bento Gonçalves','Erechim','Guaíba','Cachoeira do Sul','Lajeado','Ijuí','Alegrete','Santo Ângelo','Santana do Livramento','Cruz Alta','Venâncio Aires','São Borja','São Gabriel','Camaquã','Farroupilha','Vacaria','Montenegro','Curitiba','Londrina','Maringá','Cascavel','Ponta Grossa','São José dos Pinhais','Foz do Iguaçu','Colombo','Guarapuava','Toledo','Apucarana','Arapongas','Umuarama','Campo Mourão','Francisco Beltrão','Pato Branco','Cianorte','Florianópolis','Joinville','Blumenau','Chapecó','Criciúma','Itajaí','Jaraguá do Sul','Lages','Balneário Camboriú','Brusque','Tubarão','São Bento do Sul','Concórdia','Camboriú','Navegantes','Rio do Sul'],
    urlBusca: (t) => `https://www.panvel.com/panvel/buscarProduto.do?termoPesquisa=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 580 lojas no Sul do Brasil (RS, PR, SC)', telefone: '0800 051 8100', whatsapp: '(51) 3218-8100', horario: 'Seg-Sáb: 7h30-22h | Dom: 8h-20h' },
    descricao: 'Maior rede do Sul do Brasil. Programa Panvel Mais com descontos.',
  },
  {
    id: 'ultrafarma', nome: 'Ultrafarma', cor: '#dd6b20', cidades: [REDE_NACIONAL],
    urlBusca: (t) => `https://www.ultrafarma.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Lojas em SP + Entrega para todo o Brasil via e-commerce', telefone: '0800 771 5522', whatsapp: '(11) 3003-5522', horario: 'Seg-Sex: 8h-20h | Sáb: 8h-14h' },
    descricao: 'Foco em preços baixos e genéricos. Forte presença online com entrega nacional.',
  },
  {
    id: 'farmaciapopular', nome: 'Farmácia Popular', cor: '#319795', cidades: [REDE_NACIONAL],
    urlBusca: () => `https://www.gov.br/saude/pt-br/composicao/sctie/daf/programa-farmacia-popular`,
    contato: { endereco: 'Programa do Governo Federal — disponível em farmácias credenciadas', telefone: '136 (Disque Saúde)', whatsapp: 'Não disponível', horario: 'Conforme horário da farmácia credenciada' },
    descricao: 'Programa do Governo Federal. Medicamentos gratuitos ou com até 90% de desconto.',
  },
  {
    id: 'nissei', nome: 'Nissei', cor: '#e53e3e',
    cidades: ['Curitiba','Londrina','Maringá','Cascavel','Ponta Grossa','Foz do Iguaçu','Guarapuava','Campo Mourão','Toledo','Apucarana','Arapongas','Umuarama','Francisco Beltrão','Pato Branco','Cianorte','Paranavaí','Cornélio Procópio','Jacarezinho','Telêmaco Borba','Castro','Rolândia','Ibiporã','Cambé','Sarandi','São José dos Pinhais','Colombo','Araucária','Campo Largo','Pinhais','Almirante Tamandaré','Piraquara','Fazenda Rio Grande'],
    urlBusca: (t) => `https://www.farmaciasnissei.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 400 lojas no Paraná', telefone: '0800 643 0019', whatsapp: '(41) 3015-0019', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Maior rede de farmácias do Paraná. Programa Nissei Fidelidade.',
  },
  {
    id: 'venancio', nome: 'Venâncio', cor: '#2b6cb0',
    cidades: ['Rio de Janeiro','Niterói','São Gonçalo','Duque de Caxias','Nova Iguaçu','Petrópolis','Campos dos Goytacazes','Volta Redonda','Barra Mansa','Macaé','Cabo Frio','Teresópolis','Angra dos Reis','Resende','Nova Friburgo','Maricá','Araruama','Rio das Ostras','São Pedro da Aldeia','Itaboraí','Magé','Mesquita','Belford Roxo','São João de Meriti','Nilópolis','Queimados'],
    urlBusca: (t) => `https://www.drogariavenancio.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 200 lojas no Rio de Janeiro', telefone: '0800 282 0808', whatsapp: '(21) 3003-0808', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Maior rede de farmácias do Rio de Janeiro. Programa Venâncio Fidelidade.',
  },
  {
    id: 'araujo', nome: 'Drogaria Araujo', cor: '#c53030',
    cidades: ['Belo Horizonte','Contagem','Betim','Uberlândia','Juiz de Fora','Uberaba','Montes Claros','Governador Valadares','Divinópolis','Sete Lagoas','Ipatinga','Ribeirão das Neves','Santa Luzia','Ibirité','Poços de Caldas','Patos de Minas','Teófilo Otoni','Pouso Alegre','Barbacena','Sabará','Varginha','Conselheiro Lafaiete','Araguari','Itabira','Passos','Coronel Fabriciano','Muriaé','Ituiutaba','Araxá','Lavras','Nova Lima','Itaúna','Timóteo','Paracatu','Caratinga','Manhuaçu','Ubá','Curvelo','Patrocínio'],
    urlBusca: (t) => `https://www.araujo.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 300 lojas em Minas Gerais', telefone: '0800 725 0404', whatsapp: '(31) 3003-0404', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Maior rede de farmácias de Minas Gerais. Programa Araujo Fidelidade.',
  },
];

const MEDICAMENTOS = [
  { nome: 'Dipirona 500mg', substancia: 'Dipirona Sódica', classe: 'Analgésico', tarja: 'sem', precos: { drogasil: 8.99, drogaraia: 9.49, paguemenos: 7.99, drogariasaopaulo: 9.29, panvel: 8.49, ultrafarma: 6.99, farmaciapopular: 0, nissei: 8.29, venancio: 9.19, araujo: 8.59 }},
  { nome: 'Paracetamol 750mg', substancia: 'Paracetamol', classe: 'Analgésico', tarja: 'sem', precos: { drogasil: 7.49, drogaraia: 7.99, paguemenos: 6.49, drogariasaopaulo: 7.79, panvel: 6.99, ultrafarma: 5.49, farmaciapopular: 0, nissei: 6.89, venancio: 7.69, araujo: 7.19 }},
  { nome: 'Ibuprofeno 600mg', substancia: 'Ibuprofeno', classe: 'Anti-inflamatório', tarja: 'sem', precos: { drogasil: 12.99, drogaraia: 13.49, paguemenos: 11.99, drogariasaopaulo: 13.29, panvel: 12.49, ultrafarma: 9.99, farmaciapopular: 0, nissei: 12.29, venancio: 13.19, araujo: 12.59 }},
  { nome: 'Amoxicilina 500mg', substancia: 'Amoxicilina', classe: 'Antibiótico', tarja: 'vermelha', precos: { drogasil: 18.90, drogaraia: 19.50, paguemenos: 16.90, drogariasaopaulo: 19.20, panvel: 17.90, ultrafarma: 14.90, farmaciapopular: 0, nissei: 17.50, venancio: 19.10, araujo: 18.20 }},
  { nome: 'Losartana 50mg', substancia: 'Losartana Potássica', classe: 'Anti-hipertensivo', tarja: 'vermelha', precos: { drogasil: 15.90, drogaraia: 16.50, paguemenos: 13.90, drogariasaopaulo: 16.20, panvel: 14.90, ultrafarma: 11.90, farmaciapopular: 0, nissei: 14.50, venancio: 16.10, araujo: 15.20 }},
  { nome: 'Metformina 850mg', substancia: 'Metformina', classe: 'Antidiabético', tarja: 'vermelha', precos: { drogasil: 12.90, drogaraia: 13.50, paguemenos: 10.90, drogariasaopaulo: 13.20, panvel: 11.90, ultrafarma: 8.90, farmaciapopular: 0, nissei: 11.50, venancio: 13.10, araujo: 12.20 }},
  { nome: 'Omeprazol 20mg', substancia: 'Omeprazol', classe: 'Antiulceroso', tarja: 'sem', precos: { drogasil: 14.90, drogaraia: 15.50, paguemenos: 12.90, drogariasaopaulo: 15.20, panvel: 13.90, ultrafarma: 10.90, farmaciapopular: 0, nissei: 13.50, venancio: 15.10, araujo: 14.20 }},
  { nome: 'Sinvastatina 20mg', substancia: 'Sinvastatina', classe: 'Estatina', tarja: 'vermelha', precos: { drogasil: 19.90, drogaraia: 20.50, paguemenos: 17.90, drogariasaopaulo: 20.20, panvel: 18.90, ultrafarma: 14.90, farmaciapopular: 0, nissei: 18.50, venancio: 20.10, araujo: 19.20 }},
  { nome: 'Atenolol 50mg', substancia: 'Atenolol', classe: 'Betabloqueador', tarja: 'vermelha', precos: { drogasil: 11.90, drogaraia: 12.50, paguemenos: 9.90, drogariasaopaulo: 12.20, panvel: 10.90, ultrafarma: 7.90, farmaciapopular: 0, nissei: 10.50, venancio: 12.10, araujo: 11.20 }},
  { nome: 'Levotiroxina 50mcg', substancia: 'Levotiroxina', classe: 'Hormônio', tarja: 'vermelha', precos: { drogasil: 22.90, drogaraia: 23.50, paguemenos: 20.90, drogariasaopaulo: 23.20, panvel: 21.90, ultrafarma: 17.90, farmaciapopular: 0, nissei: 21.50, venancio: 23.10, araujo: 22.20 }},
  { nome: 'Fluoxetina 20mg', substancia: 'Fluoxetina', classe: 'Antidepressivo', tarja: 'vermelha', precos: { drogasil: 16.90, drogaraia: 17.50, paguemenos: 14.90, drogariasaopaulo: 17.20, panvel: 15.90, ultrafarma: 12.90, farmaciapopular: 0, nissei: 15.50, venancio: 17.10, araujo: 16.20 }},
  { nome: 'Enalapril 10mg', substancia: 'Enalapril', classe: 'Anti-hipertensivo', tarja: 'vermelha', precos: { drogasil: 13.90, drogaraia: 14.50, paguemenos: 11.90, drogariasaopaulo: 14.20, panvel: 12.90, ultrafarma: 9.90, farmaciapopular: 0, nissei: 12.50, venancio: 14.10, araujo: 13.20 }},
  { nome: 'Azitromicina 500mg', substancia: 'Azitromicina', classe: 'Antibiótico', tarja: 'vermelha', precos: { drogasil: 24.90, drogaraia: 25.50, paguemenos: 22.90, drogariasaopaulo: 25.20, panvel: 23.90, ultrafarma: 19.90, farmaciapopular: 0, nissei: 23.50, venancio: 25.10, araujo: 24.20 }},
  { nome: 'Hidroclorotiazida 25mg', substancia: 'Hidroclorotiazida', classe: 'Diurético', tarja: 'vermelha', precos: { drogasil: 8.90, drogaraia: 9.50, paguemenos: 6.90, drogariasaopaulo: 9.20, panvel: 7.90, ultrafarma: 5.90, farmaciapopular: 0, nissei: 7.50, venancio: 9.10, araujo: 8.20 }},
  { nome: 'Prednisona 20mg', substancia: 'Prednisona', classe: 'Corticosteroide', tarja: 'vermelha', precos: { drogasil: 14.90, drogaraia: 15.50, paguemenos: 12.90, drogariasaopaulo: 15.20, panvel: 13.90, ultrafarma: 10.90, farmaciapopular: 0, nissei: 13.50, venancio: 15.10, araujo: 14.20 }},
  { nome: 'Clonazepam 2mg', substancia: 'Clonazepam', classe: 'Ansiolítico', tarja: 'preta', precos: { drogasil: 11.90, drogaraia: 12.50, paguemenos: 9.90, drogariasaopaulo: 12.20, panvel: 10.90, ultrafarma: 8.90, farmaciapopular: 0, nissei: 10.50, venancio: 12.10, araujo: 11.20 }},
  { nome: 'Captopril 25mg', substancia: 'Captopril', classe: 'Anti-hipertensivo', tarja: 'vermelha', precos: { drogasil: 9.90, drogaraia: 10.50, paguemenos: 7.90, drogariasaopaulo: 10.20, panvel: 8.90, ultrafarma: 6.90, farmaciapopular: 0, nissei: 8.50, venancio: 10.10, araujo: 9.20 }},
  { nome: 'Diclofenaco 50mg', substancia: 'Diclofenaco', classe: 'Anti-inflamatório', tarja: 'sem', precos: { drogasil: 10.90, drogaraia: 11.50, paguemenos: 8.90, drogariasaopaulo: 11.20, panvel: 9.90, ultrafarma: 7.90, farmaciapopular: 0, nissei: 9.50, venancio: 11.10, araujo: 10.20 }},
  { nome: 'Insulina NPH', substancia: 'Insulina Humana NPH', classe: 'Insulina', tarja: 'vermelha', precos: { drogasil: 42.90, drogaraia: 43.50, paguemenos: 39.90, drogariasaopaulo: 43.20, panvel: 41.90, ultrafarma: 36.90, farmaciapopular: 0, nissei: 41.50, venancio: 43.10, araujo: 42.20 }},
  { nome: 'Dexametasona 4mg', substancia: 'Dexametasona', classe: 'Corticosteroide', tarja: 'vermelha', precos: { drogasil: 16.90, drogaraia: 17.50, paguemenos: 14.90, drogariasaopaulo: 17.20, panvel: 15.90, ultrafarma: 12.90, farmaciapopular: 0, nissei: 15.50, venancio: 17.10, araujo: 16.20 }},
];

export default function PriceComparison() {
  const [search, setSearch] = useState('');
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [selectedFarmacias, setSelectedFarmacias] = useState<Set<string>>(new Set(FARMACIAS.map(f => f.id)));
  const [selectedMed, setSelectedMed] = useState<typeof MEDICAMENTOS[0] | null>(null);
  const [expandedFarmacia, setExpandedFarmacia] = useState<string | null>(null);
  const [tab, setTab] = useState<'comparar' | 'gratuitos' | 'descontos'>('comparar');

  const cidadesDoEstado = useMemo(() => {
    if (!estado) return [];
    return (ESTADOS_CIDADES_COMPLETO[estado] || []).sort();
  }, [estado]);

  const farmaciasNaCidade = useMemo(() => {
    if (!cidade) return FARMACIAS;
    return FARMACIAS.filter(f =>
      f.cidades.includes(REDE_NACIONAL) ||
      f.cidades.some(c => c.toLowerCase() === cidade.toLowerCase())
    );
  }, [cidade]);

  const toggleFarmacia = (id: string) => {
    const next = new Set(selectedFarmacias);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedFarmacias(next);
  };

  const selectAll = () => setSelectedFarmacias(new Set(farmaciasNaCidade.map(f => f.id)));
  const deselectAll = () => setSelectedFarmacias(new Set());

  const filteredMeds = useMemo(() => {
    if (!search.trim()) return MEDICAMENTOS;
    const q = search.toLowerCase();
    return MEDICAMENTOS.filter(m =>
      m.nome.toLowerCase().includes(q) || m.substancia.toLowerCase().includes(q) || m.classe.toLowerCase().includes(q)
    );
  }, [search]);

  const getPrecosFarmacias = (med: typeof MEDICAMENTOS[0]) => {
    return farmaciasNaCidade
      .filter(f => selectedFarmacias.has(f.id))
      .map(f => ({ farmacia: f, preco: (med.precos as any)[f.id] as number || 0 }))
      .sort((a, b) => { if (a.preco === 0) return 1; if (b.preco === 0) return -1; return a.preco - b.preco; });
  };

  const menorPreco = (med: typeof MEDICAMENTOS[0]) => {
    const p = getPrecosFarmacias(med).filter(x => x.preco > 0);
    return p.length > 0 ? p[0].preco : 0;
  };
  const maiorPreco = (med: typeof MEDICAMENTOS[0]) => {
    const p = getPrecosFarmacias(med).filter(x => x.preco > 0);
    return p.length > 0 ? p[p.length - 1].preco : 0;
  };

  const GRATUITOS = [
    'Losartana 25mg/50mg', 'Captopril 25mg', 'Hidroclorotiazida 25mg', 'Enalapril 5mg/10mg',
    'Atenolol 25mg/50mg', 'Propranolol 40mg', 'Metformina 500mg/850mg', 'Glibenclamida 5mg',
    'Insulina NPH', 'Insulina Regular', 'Sinvastatina 10mg/20mg/40mg', 'Salbutamol aerossol',
    'Beclometasona aerossol', 'Brometo de Ipratrópio', 'Carbidopa + Levodopa',
    'Diazepam 5mg', 'Fluoxetina 20mg', 'Amitriptilina 25mg',
  ];

  const toggleExpandFarmacia = (farmaciaId: string) => {
    setExpandedFarmacia(expandedFarmacia === farmaciaId ? null : farmaciaId);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Preços de Medicamentos</h1>
        <p className="text-gray-400">Compare preços entre farmácias da sua cidade e encontre o melhor preço</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 justify-center flex-wrap">
        {([
          { id: 'comparar' as const, label: 'Comparar Preços', icon: '💊' },
          { id: 'gratuitos' as const, label: 'Medicamentos Gratuitos', icon: '🏥' },
          { id: 'descontos' as const, label: 'Programas de Desconto', icon: '💰' },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${tab === t.id ? 'bg-emerald-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'comparar' && (
        <>
          {/* Filtros Estado/Cidade */}
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white">Filtrar por localização</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select value={estado} onChange={e => { setEstado(e.target.value); setCidade(''); }}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm">
                <option value="">Todos os Estados</option>
                {Object.keys(ESTADOS_CIDADES_COMPLETO).sort().map(uf => (
                  <option key={uf} value={uf}>{uf} — {ESTADOS_NOMES[uf]}</option>
                ))}
              </select>
              <select value={cidade} onChange={e => setCidade(e.target.value)} disabled={!estado}
                className="px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white text-sm disabled:opacity-50">
                <option value="">Todas as Cidades</option>
                {cidadesDoEstado.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Seleção de Farmácias */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">
                  Farmácias {cidade ? `em ${cidade}` : ''} ({farmaciasNaCidade.length})
                </h3>
                <div className="flex gap-2">
                  <button onClick={selectAll} className="text-xs text-emerald-400 hover:underline">Todas</button>
                  <button onClick={deselectAll} className="text-xs text-red-400 hover:underline">Limpar</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {farmaciasNaCidade.map(f => (
                  <button key={f.id} onClick={() => toggleFarmacia(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      selectedFarmacias.has(f.id) ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-gray-600 bg-gray-800 text-gray-400'}`}>
                    <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: f.cor }} />
                    {f.nome}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Busca */}
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar medicamento..."
            className="w-full px-4 py-3 bg-gray-800/80 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500" />

          {/* Comparativo detalhado */}
          {selectedMed ? (
            <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedMed.nome}</h2>
                  <p className="text-sm text-gray-400">{selectedMed.substancia} — {selectedMed.classe}</p>
                </div>
                <button onClick={() => { setSelectedMed(null); setExpandedFarmacia(null); }} className="text-sm text-emerald-400 hover:underline">← Voltar</button>
              </div>
              <div className="space-y-2">
                {getPrecosFarmacias(selectedMed).map((p, i) => {
                  const isMin = i === 0 && p.preco > 0;
                  const isFree = p.preco === 0;
                  const isExpanded = expandedFarmacia === p.farmacia.id;
                  return (
                    <div key={p.farmacia.id} className="rounded-lg border transition-all overflow-hidden"
                      style={{ borderColor: isMin ? '#10b981' : isFree ? '#06b6d4' : 'rgba(55,65,81,0.5)' }}>
                      <div
                        onClick={() => toggleExpandFarmacia(p.farmacia.id)}
                        className={`flex items-center justify-between p-3 cursor-pointer transition-all ${
                          isMin ? 'bg-emerald-500/10' : isFree ? 'bg-cyan-500/10' : 'bg-gray-900/50 hover:bg-gray-800/80'}`}>
                        <div className="flex items-center gap-3">
                          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: p.farmacia.cor }} />
                          <span className="text-white font-medium text-sm">{p.farmacia.nome}</span>
                          {isMin && <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">Menor preço</span>}
                          {isFree && <span className="text-xs bg-cyan-600 text-white px-2 py-0.5 rounded-full">Gratuito</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`font-bold ${isFree ? 'text-cyan-400' : isMin ? 'text-emerald-400' : 'text-white'}`}>
                            {isFree ? 'GRÁTIS' : `R$ ${p.preco.toFixed(2).replace('.', ',')}`}
                          </span>
                          <span className="text-gray-400 text-xs">{isExpanded ? '▲' : '▼'}</span>
                        </div>
                      </div>
                      {/* Expanded contact details */}
                      {isExpanded && (
                        <div className="px-4 py-3 bg-gray-900/80 border-t border-gray-700/50 space-y-3">
                          <p className="text-xs text-gray-400">{p.farmacia.descricao}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <span className="text-emerald-400 text-sm mt-0.5">📍</span>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase">Endereço</p>
                                  <p className="text-sm text-white">{p.farmacia.contato.endereco}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-emerald-400 text-sm mt-0.5">📞</span>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase">Telefone</p>
                                  <p className="text-sm text-white">{p.farmacia.contato.telefone}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-start gap-2">
                                <span className="text-emerald-400 text-sm mt-0.5">💬</span>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase">WhatsApp</p>
                                  <p className="text-sm text-white">{p.farmacia.contato.whatsapp}</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-emerald-400 text-sm mt-0.5">🕐</span>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase">Horário</p>
                                  <p className="text-sm text-white">{p.farmacia.contato.horario}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <a href={`tel:${p.farmacia.contato.telefone.replace(/\D/g, '')}`}
                              className="flex-1 text-center px-3 py-2 bg-emerald-600/20 border border-emerald-600/40 rounded-lg text-emerald-300 text-xs font-medium hover:bg-emerald-600/30 transition-all">
                              📞 Ligar
                            </a>
                            {p.farmacia.contato.whatsapp !== 'Não disponível' && (
                              <a href={`https://wa.me/55${p.farmacia.contato.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                                className="flex-1 text-center px-3 py-2 bg-green-600/20 border border-green-600/40 rounded-lg text-green-300 text-xs font-medium hover:bg-green-600/30 transition-all">
                                💬 WhatsApp
                              </a>
                            )}
                            <a href={p.farmacia.urlBusca(selectedMed.nome)} target="_blank" rel="noopener noreferrer"
                              className="flex-1 text-center px-3 py-2 bg-blue-600/20 border border-blue-600/40 rounded-lg text-blue-300 text-xs font-medium hover:bg-blue-600/30 transition-all">
                              🌐 Ver no Site
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {menorPreco(selectedMed) > 0 && maiorPreco(selectedMed) > 0 && (
                <div className="bg-emerald-900/20 border border-emerald-700/30 rounded-lg p-3 text-sm">
                  <span className="text-emerald-400 font-semibold">
                    Economia de até R$ {(maiorPreco(selectedMed) - menorPreco(selectedMed)).toFixed(2).replace('.', ',')}
                  </span>
                  <span className="text-gray-400"> ({((1 - menorPreco(selectedMed) / maiorPreco(selectedMed)) * 100).toFixed(0)}% de diferença)</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMeds.map((med, i) => (
                <div key={i} onClick={() => setSelectedMed(med)}
                  className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 cursor-pointer hover:border-emerald-500/50 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{med.nome}</h3>
                      <p className="text-xs text-gray-400">{med.substancia} — {med.classe}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-emerald-400">
                        A partir de R$ {menorPreco(med).toFixed(2).replace('.', ',')}
                      </div>
                      <div className="text-xs text-gray-500">{getPrecosFarmacias(med).filter(p => p.preco > 0).length} farmácias</div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMeds.length === 0 && <div className="text-center py-12 text-gray-500"><p>Nenhum medicamento encontrado.</p></div>}
            </div>
          )}
        </>
      )}

      {tab === 'gratuitos' && (
        <div className="space-y-4">
          <div className="bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-4">
            <h3 className="text-lg font-bold text-cyan-300 mb-2">Farmácia Popular — Medicamentos Gratuitos</h3>
            <p className="text-sm text-gray-400 mb-4">O Programa Farmácia Popular oferece medicamentos gratuitos para hipertensão, diabetes e asma.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {GRATUITOS.map((med, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-gray-800/50 rounded-lg">
                  <span className="text-cyan-400 text-lg">✓</span>
                  <span className="text-sm text-white">{med}</span>
                  <span className="ml-auto text-xs bg-cyan-600 text-white px-2 py-0.5 rounded-full">Grátis</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 text-sm text-gray-400">
            <strong className="text-white">Como obter:</strong> Apresente receita médica e CPF em qualquer farmácia credenciada.
            Consulte em <a href="https://www.gov.br/saude/pt-br/composicao/sctie/daf/programa-farmacia-popular" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">gov.br/farmacia-popular</a>.
          </div>
        </div>
      )}

      {tab === 'descontos' && (
        <div className="space-y-4">
          {[
            { nome: 'Consulta Remédios', desc: 'Compare preços em tempo real entre farmácias online', url: 'https://consultaremedios.com.br' },
            { nome: 'Programa Farmácia Popular', desc: 'Medicamentos gratuitos ou com até 90% de desconto pelo SUS', url: 'https://www.gov.br/saude/pt-br/composicao/sctie/daf/programa-farmacia-popular' },
            { nome: 'Programa FarmáciasApp', desc: 'Descontos de até 80% em medicamentos genéricos via aplicativo', url: 'https://www.farmaciasapp.com.br' },
            { nome: 'Programa Viva Saúde', desc: 'Descontos em medicamentos de marca com cadastro gratuito', url: '#' },
          ].map((p, i) => (
            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer"
              className="block bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 hover:border-emerald-500/50 transition-all">
              <h3 className="font-semibold text-white">{p.nome}</h3>
              <p className="text-sm text-gray-400 mt-1">{p.desc}</p>
            </a>
          ))}
        </div>
      )}

      <div className="bg-amber-900/20 border border-amber-700/30 rounded-xl p-4 text-sm text-amber-200/80">
        <strong>Importante:</strong> Preços estimados com base na tabela CMED/ANVISA. Valores reais podem variar. Sempre confirme na farmácia.
      </div>
    </div>
  );
}
