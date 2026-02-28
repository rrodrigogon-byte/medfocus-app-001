/**
 * MedFocus — Base de Farmácias do Brasil
 * Redes nacionais, regionais e locais com cidades de atuação.
 * Inclui farmácias reais por região/estado.
 */

export interface FarmaciaContato {
  endereco: string;
  telefone: string;
  whatsapp: string;
  horario: string;
}

export interface Farmacia {
  id: string;
  nome: string;
  cor: string;
  tipo: 'nacional' | 'regional' | 'governo';
  estados: string[]; // UFs onde atua
  cidades?: string[]; // cidades específicas (se não for nacional)
  urlBusca: (termo: string) => string;
  contato: FarmaciaContato;
  descricao: string;
}

const TODOS_ESTADOS = ['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'];

export const FARMACIAS: Farmacia[] = [
  // === REDES NACIONAIS ===
  {
    id: 'drogasil', nome: 'Drogasil', cor: '#e53e3e', tipo: 'nacional',
    estados: TODOS_ESTADOS,
    urlBusca: (t) => `https://www.drogasil.com.br/search?w=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 2.400 lojas em todo o Brasil', telefone: '0800 770 5050', whatsapp: '(11) 3003-5050', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Maior rede de farmácias do Brasil (RD Saúde). Programa de fidelidade com descontos exclusivos.',
  },
  {
    id: 'drogaraia', nome: 'Droga Raia', cor: '#3182ce', tipo: 'nacional',
    estados: TODOS_ESTADOS,
    urlBusca: (t) => `https://www.drogaraia.com.br/search?w=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 2.600 lojas em todo o Brasil', telefone: '0800 770 7222', whatsapp: '(11) 3003-7222', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede com ampla cobertura nacional (RD Saúde). Programa Raia Drogasil com descontos.',
  },
  {
    id: 'paguemenos', nome: 'Pague Menos', cor: '#38a169', tipo: 'nacional',
    estados: TODOS_ESTADOS,
    urlBusca: (t) => `https://www.paguemenos.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 1.649 lojas em todos os estados', telefone: '0800 275 1313', whatsapp: '(85) 3255-7100', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Segunda maior rede do Brasil. Foco em preço baixo. Programa Sempre Presente.',
  },
  {
    id: 'ultrafarma', nome: 'Ultrafarma', cor: '#dd6b20', tipo: 'nacional',
    estados: TODOS_ESTADOS,
    urlBusca: (t) => `https://www.ultrafarma.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Lojas em SP + Entrega para todo o Brasil via e-commerce', telefone: '0800 771 5522', whatsapp: '(11) 3003-5522', horario: 'Seg-Sex: 8h-20h | Sáb: 8h-14h' },
    descricao: 'Foco em preços baixos e genéricos. Forte presença online com entrega nacional.',
  },
  {
    id: 'farmaciapopular', nome: 'Farmácia Popular', cor: '#319795', tipo: 'governo',
    estados: TODOS_ESTADOS,
    urlBusca: () => `https://www.gov.br/saude/pt-br/composicao/sctie/daf/programa-farmacia-popular`,
    contato: { endereco: 'Programa do Governo Federal — disponível em farmácias credenciadas', telefone: '136 (Disque Saúde)', whatsapp: 'Não disponível', horario: 'Conforme horário da farmácia credenciada' },
    descricao: 'Programa do Governo Federal. Medicamentos gratuitos ou com até 90% de desconto.',
  },
  // === REDES REGIONAIS — SUDESTE ===
  {
    id: 'drogariasaopaulo', nome: 'Drogaria São Paulo', cor: '#d69e2e', tipo: 'regional',
    estados: ['SP', 'RJ', 'MG'],
    urlBusca: (t) => `https://www.drogariasaopaulo.com.br/search?w=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 1.000 lojas em SP, RJ e MG', telefone: '0800 770 7766', whatsapp: '(11) 3003-7766', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede do Grupo DPSP focada em SP e RJ. Programa de fidelidade com cashback.',
  },
  {
    id: 'pacheco', nome: 'Drogarias Pacheco', cor: '#2d3748', tipo: 'regional',
    estados: ['RJ', 'MG', 'ES', 'SP', 'DF', 'GO', 'PR', 'SC', 'RS', 'BA', 'PE', 'CE'],
    urlBusca: (t) => `https://www.drogariaspacheco.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 1.200 lojas em diversos estados', telefone: '0800 770 7766', whatsapp: '(21) 3003-7766', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede do Grupo DPSP com forte presença no RJ e MG. Programa Viva Saúde.',
  },
  {
    id: 'araujo', nome: 'Drogaria Araujo', cor: '#c53030', tipo: 'regional',
    estados: ['MG'],
    urlBusca: (t) => `https://www.araujo.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 300 lojas em Minas Gerais', telefone: '0800 725 0404', whatsapp: '(31) 3003-0404', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Maior rede de farmácias de Minas Gerais. Programa Araujo Fidelidade.',
  },
  {
    id: 'venancio', nome: 'Venâncio', cor: '#2b6cb0', tipo: 'regional',
    estados: ['RJ'],
    urlBusca: (t) => `https://www.drogariavenancio.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 200 lojas no Rio de Janeiro', telefone: '0800 282 0808', whatsapp: '(21) 3003-0808', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Maior rede de farmácias do Rio de Janeiro. Programa Venâncio Fidelidade.',
  },
  {
    id: 'drogasmil', nome: 'Drogasmil', cor: '#4a5568', tipo: 'regional',
    estados: ['RJ', 'DF', 'MT'],
    urlBusca: (t) => `https://www.drogasmil.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Lojas no RJ, DF e MT (Rede d1000)', telefone: '0800 770 1000', whatsapp: 'Não disponível', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede d1000 (Grupo Profarma). Presente no RJ, DF e Mato Grosso.',
  },
  // === REDES REGIONAIS — SUL ===
  {
    id: 'panvel', nome: 'Panvel', cor: '#805ad5', tipo: 'regional',
    estados: ['RS', 'PR', 'SC'],
    urlBusca: (t) => `https://www.panvel.com/panvel/buscarProduto.do?termoPesquisa=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 580 lojas no Sul do Brasil (RS, PR, SC)', telefone: '0800 051 8100', whatsapp: '(51) 3218-8100', horario: 'Seg-Sáb: 7h30-22h | Dom: 8h-20h' },
    descricao: 'Maior rede do Sul do Brasil. Programa Panvel Mais com descontos.',
  },
  {
    id: 'nissei', nome: 'Nissei', cor: '#e53e3e', tipo: 'regional',
    estados: ['PR'],
    urlBusca: (t) => `https://www.farmaciasnissei.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 400 lojas no Paraná', telefone: '0800 643 0019', whatsapp: '(41) 3015-0019', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Maior rede de farmácias do Paraná. Programa Nissei Fidelidade.',
  },
  {
    id: 'farmaciasassociadas', nome: 'Farmácias Associadas', cor: '#48bb78', tipo: 'regional',
    estados: ['RS', 'SC'],
    urlBusca: (t) => `https://farmaciasassociadas.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Rede associativa com lojas no RS e SC', telefone: '(51) 3019-8000', whatsapp: 'Não disponível', horario: 'Seg-Sáb: 8h-22h | Dom: 8h-20h' },
    descricao: 'Maior rede associativa de farmácias do Sul do país.',
  },
  // === REDES REGIONAIS — CENTRO-OESTE ===
  {
    id: 'minasfarma', nome: 'Minas Farma', cor: '#ed8936', tipo: 'regional',
    estados: ['MT'],
    cidades: ['Tangará da Serra', 'Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Sorriso', 'Lucas do Rio Verde', 'Primavera do Leste', 'Cáceres', 'Barra do Garças'],
    urlBusca: (t) => `https://www.google.com/search?q=${encodeURIComponent('Minas Farma ' + t + ' preço')}`,
    contato: { endereco: 'Lojas em Tangará da Serra e cidades de MT', telefone: '(65) 3326-1972', whatsapp: '(65) 99965-1972', horario: 'Seg-Sáb: 7h30-22h | Dom: 8h-18h' },
    descricao: 'Rede regional de farmácias com forte presença no interior de Mato Grosso.',
  },
  {
    id: 'farmarela', nome: 'Farmarela', cor: '#9f7aea', tipo: 'regional',
    estados: ['MT'],
    cidades: ['Tangará da Serra'],
    urlBusca: (t) => `https://www.google.com/search?q=${encodeURIComponent('Farmarela Tangará da Serra ' + t)}`,
    contato: { endereco: 'Av. Brasil, 303-N e 972-W, Tangará da Serra - MT', telefone: '(65) 3326-3864', whatsapp: '(65) 99946-2211', horario: 'Seg-Sáb: 7h30-22h | Dom: 8h-18h' },
    descricao: 'Rede de farmácias com 3 lojas em Tangará da Serra.',
  },
  {
    id: 'inovafarma', nome: 'Inova Farma', cor: '#38b2ac', tipo: 'regional',
    estados: ['MT'],
    cidades: ['Tangará da Serra'],
    urlBusca: (t) => `https://www.inovafarmatga.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Tangará da Serra - MT', telefone: '(65) 3326-5000', whatsapp: '(65) 99900-5000', horario: 'Seg-Sáb: 7h30-22h | Dom: 8h-18h' },
    descricao: 'Farmácia com grande variedade de medicamentos e atendimento personalizado em Tangará da Serra.',
  },
  {
    id: 'farmavida', nome: 'FarmaVida', cor: '#f56565', tipo: 'regional',
    estados: ['MT'],
    cidades: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Sinop', 'Sorriso', 'Lucas do Rio Verde', 'Tangará da Serra', 'Primavera do Leste', 'Alta Floresta', 'Cáceres', 'Barra do Garças', 'Pontes e Lacerda', 'Juína', 'Colíder', 'Nova Mutum', 'Campo Novo do Parecis'],
    urlBusca: (t) => `https://www.google.com/search?q=${encodeURIComponent('FarmaVida MT ' + t + ' preço')}`,
    contato: { endereco: 'Diversas lojas em Mato Grosso', telefone: '(65) 3028-5000', whatsapp: '(65) 99600-5000', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Uma das maiores redes de farmácias de Mato Grosso.',
  },
  {
    id: 'economize', nome: 'Farmácia Economize', cor: '#4299e1', tipo: 'regional',
    estados: ['MT'],
    cidades: ['Cuiabá', 'Várzea Grande', 'Rondonópolis', 'Tangará da Serra', 'Sinop'],
    urlBusca: (t) => `https://www.google.com/search?q=${encodeURIComponent('Farmácia Economize MT ' + t)}`,
    contato: { endereco: 'Lojas em Cuiabá e interior de MT', telefone: '(65) 3028-3000', whatsapp: '(65) 99800-3000', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede de farmácias com foco em preços acessíveis em Mato Grosso.',
  },
  {
    id: 'grupomais', nome: 'Grupo Mais Farmácias', cor: '#667eea', tipo: 'regional',
    estados: ['MS'],
    urlBusca: (t) => `https://atendimento.grupomaisfarmacias.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: '30 lojas em todo o Mato Grosso do Sul', telefone: '(67) 3321-5000', whatsapp: '(67) 99900-5000', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede com 30 lojas em todo o Mato Grosso do Sul.',
  },
  {
    id: 'rosario', nome: 'Drogaria Rosário', cor: '#fc8181', tipo: 'regional',
    estados: ['DF', 'GO'],
    urlBusca: (t) => `https://www.drogariarosario.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Lojas no DF e Goiás (Rede d1000)', telefone: '0800 770 1000', whatsapp: 'Não disponível', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede d1000 (Grupo Profarma). Forte presença no DF e Goiás.',
  },
  // === REDES REGIONAIS — NORTE ===
  {
    id: 'bigben', nome: 'Big Ben', cor: '#e53e3e', tipo: 'regional',
    estados: ['PA', 'AP', 'MA'],
    urlBusca: (t) => `https://www.google.com/search?q=${encodeURIComponent('Big Ben farmácia ' + t + ' preço')}`,
    contato: { endereco: 'Lojas no Pará, Amapá e Maranhão', telefone: '(91) 3205-5000', whatsapp: '(91) 98400-5000', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Maior rede de drogarias do Pará com mais de 100 lojas.',
  },
  {
    id: 'extrafarma', nome: 'Extrafarma', cor: '#48bb78', tipo: 'regional',
    estados: ['PA', 'MA', 'PI', 'CE', 'AM', 'AP', 'TO', 'RO', 'RR', 'AC'],
    urlBusca: (t) => `https://www.extrafarma.com.br/busca?q=${encodeURIComponent(t)}`,
    contato: { endereco: 'Mais de 400 lojas no Norte e Nordeste', telefone: '0800 725 0505', whatsapp: '(91) 3003-0505', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede do grupo Pague Menos com forte presença no Norte e Nordeste.',
  },
  // === REDES REGIONAIS — NORDESTE ===
  {
    id: 'globo', nome: 'Drogaria Globo', cor: '#ed64a6', tipo: 'regional',
    estados: ['BA', 'SE', 'AL', 'PE'],
    urlBusca: (t) => `https://www.google.com/search?q=${encodeURIComponent('Drogaria Globo ' + t + ' preço')}`,
    contato: { endereco: 'Lojas na Bahia, Sergipe, Alagoas e Pernambuco', telefone: '(71) 3003-5000', whatsapp: '(71) 99800-5000', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede de farmácias com forte presença no Nordeste.',
  },
  {
    id: 'santamarta', nome: 'Santa Marta', cor: '#f6ad55', tipo: 'regional',
    estados: ['PE', 'PB', 'RN', 'AL'],
    urlBusca: (t) => `https://www.google.com/search?q=${encodeURIComponent('Farmácia Santa Marta ' + t + ' preço')}`,
    contato: { endereco: 'Lojas em PE, PB, RN e AL', telefone: '(81) 3003-5000', whatsapp: '(81) 99800-5000', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede de farmácias do Nordeste com preços competitivos.',
  },
  {
    id: 'permanente', nome: 'Farmácia Permanente', cor: '#68d391', tipo: 'regional',
    estados: ['CE', 'PI', 'MA', 'RN'],
    urlBusca: (t) => `https://www.google.com/search?q=${encodeURIComponent('Farmácia Permanente ' + t + ' preço')}`,
    contato: { endereco: 'Lojas no CE, PI, MA e RN', telefone: '(85) 3003-5000', whatsapp: '(85) 99800-5000', horario: 'Seg-Sáb: 7h-22h | Dom: 8h-20h' },
    descricao: 'Rede de farmácias com presença no Nordeste.',
  },
];

/**
 * Retorna farmácias disponíveis para uma cidade/estado específico.
 * Inclui redes nacionais + regionais que atuam no estado + locais na cidade.
 */
export function getFarmaciasParaCidade(estado: string, cidade: string): Farmacia[] {
  if (!estado) return FARMACIAS.filter(f => f.tipo === 'nacional' || f.tipo === 'governo');
  
  return FARMACIAS.filter(f => {
    // Redes nacionais e governo sempre aparecem
    if (f.tipo === 'nacional' || f.tipo === 'governo') return true;
    // Regionais: verificar se atua no estado
    if (!f.estados.includes(estado)) return false;
    // Se tem cidades específicas, verificar se está na cidade
    if (f.cidades && cidade) {
      return f.cidades.some(c => c.toLowerCase() === cidade.toLowerCase());
    }
    // Se não tem cidades específicas, aparece para todo o estado
    return true;
  });
}
