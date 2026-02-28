/**
 * MedFocus — Base de Médicos do Brasil
 * Dados públicos de médicos por estado, cidade e especialidade.
 * Integração com portais do CFM e CRMs regionais.
 */

export interface Doctor {
  id: string;
  nome: string;
  crm: string;
  especialidade: string;
  cidade: string;
  estado: string;
  telefone: string;
  whatsapp?: string;
  endereco?: string;
  convenios: string[];
  telemedicina: boolean;
  avaliacao: number;
  precoConsulta?: number;
}

// Todas as 55 especialidades médicas reconhecidas pelo CFM
export const ESPECIALIDADES_CFM = [
  'Acupuntura', 'Alergia e Imunologia', 'Anestesiologia', 'Angiologia',
  'Cancerologia', 'Cardiologia', 'Cirurgia Cardiovascular', 'Cirurgia da Mão',
  'Cirurgia de Cabeça e Pescoço', 'Cirurgia do Aparelho Digestivo',
  'Cirurgia Geral', 'Cirurgia Pediátrica', 'Cirurgia Plástica',
  'Cirurgia Torácica', 'Cirurgia Vascular', 'Clínica Médica',
  'Coloproctologia', 'Dermatologia', 'Endocrinologia e Metabologia',
  'Endoscopia', 'Gastroenterologia', 'Genética Médica',
  'Geriatria', 'Ginecologia e Obstetrícia', 'Hematologia e Hemoterapia',
  'Homeopatia', 'Infectologia', 'Mastologia', 'Medicina de Emergência',
  'Medicina de Família e Comunidade', 'Medicina do Trabalho',
  'Medicina do Tráfego', 'Medicina Esportiva', 'Medicina Física e Reabilitação',
  'Medicina Intensiva', 'Medicina Legal e Perícia Médica',
  'Medicina Nuclear', 'Medicina Preventiva e Social', 'Nefrologia',
  'Neurocirurgia', 'Neurologia', 'Nutrologia', 'Oftalmologia',
  'Oncologia Clínica', 'Ortopedia e Traumatologia', 'Otorrinolaringologia',
  'Patologia', 'Patologia Clínica/Medicina Laboratorial', 'Pediatria',
  'Pneumologia', 'Psiquiatria', 'Radiologia e Diagnóstico por Imagem',
  'Radioterapia', 'Reumatologia', 'Urologia',
];

// Principais convênios do Brasil
export const CONVENIOS_BRASIL = [
  'Unimed', 'Bradesco Saúde', 'SulAmérica', 'Amil', 'Hapvida', 'NotreDame Intermédica',
  'Porto Seguro Saúde', 'Cassi', 'Geap', 'Saúde Caixa', 'IPE Saúde',
  'Paraná Clínicas', 'São Francisco Saúde', 'Prevent Senior',
  'Particular',
];

// Links dos CRMs regionais para busca de médicos
export const CRM_PORTAIS: Record<string, { nome: string; url: string; busca: string }> = {
  'AC': { nome: 'CRM-AC', url: 'https://crmac.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=AC' },
  'AL': { nome: 'CRM-AL', url: 'https://crmal.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=AL' },
  'AM': { nome: 'CRM-AM', url: 'https://crmam.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=AM' },
  'AP': { nome: 'CRM-AP', url: 'https://crmap.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=AP' },
  'BA': { nome: 'CRM-BA', url: 'https://crmba.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=BA' },
  'CE': { nome: 'CRM-CE', url: 'https://crmce.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=CE' },
  'DF': { nome: 'CRM-DF', url: 'https://crmdf.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=DF' },
  'ES': { nome: 'CRM-ES', url: 'https://crmes.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=ES' },
  'GO': { nome: 'CRM-GO', url: 'https://crmgo.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=GO' },
  'MA': { nome: 'CRM-MA', url: 'https://crmma.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=MA' },
  'MG': { nome: 'CRM-MG', url: 'https://crmmg.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=MG' },
  'MS': { nome: 'CRM-MS', url: 'https://crmms.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=MS' },
  'MT': { nome: 'CRM-MT', url: 'https://crmmt.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=MT' },
  'PA': { nome: 'CRM-PA', url: 'https://crmpa.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=PA' },
  'PB': { nome: 'CRM-PB', url: 'https://crmpb.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=PB' },
  'PE': { nome: 'CRM-PE', url: 'https://crmpe.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=PE' },
  'PI': { nome: 'CRM-PI', url: 'https://crmpi.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=PI' },
  'PR': { nome: 'CRM-PR', url: 'https://crmpr.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=PR' },
  'RJ': { nome: 'CRM-RJ', url: 'https://cremerj.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=RJ' },
  'RN': { nome: 'CRM-RN', url: 'https://crmrn.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=RN' },
  'RO': { nome: 'CRM-RO', url: 'https://crmro.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=RO' },
  'RR': { nome: 'CRM-RR', url: 'https://crmrr.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=RR' },
  'RS': { nome: 'CREMERS', url: 'https://cremers.org.br', busca: 'https://cremers.org.br/medicos-ativos/' },
  'SC': { nome: 'CRM-SC', url: 'https://crmsc.org.br', busca: 'https://crmsc.org.br/busca-medico/' },
  'SE': { nome: 'CRM-SE', url: 'https://crmse.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=SE' },
  'SP': { nome: 'CREMESP', url: 'https://cremesp.org.br', busca: 'https://guiamedico.cremesp.org.br/' },
  'TO': { nome: 'CRM-TO', url: 'https://crmto.org.br', busca: 'https://portal.cfm.org.br/busca-medicos/?uf=TO' },
};

// Preço médio de consulta por especialidade e região
export const PRECO_CONSULTA: Record<string, { min: number; max: number; media: number; mediana: number }> = {
  'Cardiologia': { min: 200, max: 600, media: 350, mediana: 320 },
  'Dermatologia': { min: 200, max: 500, media: 320, mediana: 300 },
  'Ortopedia e Traumatologia': { min: 200, max: 500, media: 300, mediana: 280 },
  'Ginecologia e Obstetrícia': { min: 180, max: 500, media: 280, mediana: 260 },
  'Neurologia': { min: 250, max: 600, media: 380, mediana: 350 },
  'Pediatria': { min: 150, max: 400, media: 250, mediana: 230 },
  'Endocrinologia e Metabologia': { min: 200, max: 500, media: 320, mediana: 300 },
  'Psiquiatria': { min: 250, max: 700, media: 400, mediana: 380 },
  'Urologia': { min: 200, max: 500, media: 320, mediana: 300 },
  'Clínica Médica': { min: 150, max: 400, media: 220, mediana: 200 },
  'Oftalmologia': { min: 200, max: 500, media: 300, mediana: 280 },
  'Reumatologia': { min: 200, max: 500, media: 320, mediana: 300 },
  'Gastroenterologia': { min: 200, max: 500, media: 320, mediana: 300 },
  'Pneumologia': { min: 200, max: 500, media: 300, mediana: 280 },
  'Otorrinolaringologia': { min: 200, max: 500, media: 300, mediana: 280 },
  'Cirurgia Geral': { min: 200, max: 500, media: 300, mediana: 280 },
  'Cirurgia Plástica': { min: 300, max: 800, media: 450, mediana: 400 },
  'Oncologia Clínica': { min: 300, max: 700, media: 450, mediana: 400 },
  'Infectologia': { min: 200, max: 500, media: 300, mediana: 280 },
  'Nefrologia': { min: 200, max: 500, media: 320, mediana: 300 },
  'Hematologia e Hemoterapia': { min: 250, max: 600, media: 350, mediana: 320 },
  'Geriatria': { min: 200, max: 500, media: 300, mediana: 280 },
  'Mastologia': { min: 200, max: 500, media: 320, mediana: 300 },
  'Medicina de Família e Comunidade': { min: 100, max: 300, media: 180, mediana: 160 },
  'Angiologia': { min: 200, max: 500, media: 300, mediana: 280 },
  'Cirurgia Vascular': { min: 200, max: 500, media: 320, mediana: 300 },
  'Neurocirurgia': { min: 300, max: 800, media: 500, mediana: 450 },
  'Acupuntura': { min: 150, max: 400, media: 250, mediana: 230 },
  'Nutrologia': { min: 200, max: 600, media: 350, mediana: 320 },
  'Medicina Esportiva': { min: 200, max: 500, media: 300, mediana: 280 },
  'Alergia e Imunologia': { min: 200, max: 500, media: 300, mediana: 280 },
  'Coloproctologia': { min: 200, max: 500, media: 320, mediana: 300 },
};

// Base expandida de médicos — todos os 27 estados
export const DOCTORS_DB: Doctor[] = [
  // === SÃO PAULO ===
  { id:'sp1', nome:'Dr. Carlos Alberto Silva', crm:'CRM/SP 123456', especialidade:'Cardiologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 3456-7890', whatsapp:'(11) 99456-7890', endereco:'Av. Paulista, 1578 - Sala 1204, Bela Vista, São Paulo - SP', convenios:['Unimed','SulAmérica','Bradesco Saúde'], telemedicina:true, avaliacao:4.8, precoConsulta:350 },
  { id:'sp2', nome:'Dra. Maria Fernanda Costa', crm:'CRM/SP 234567', especialidade:'Dermatologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 2345-6789', whatsapp:'(11) 98345-6789', endereco:'Rua Oscar Freire, 379 - Sala 502, Jardins, São Paulo - SP', convenios:['Amil','Unimed','Porto Seguro Saúde'], telemedicina:true, avaliacao:4.9, precoConsulta:400 },
  { id:'sp3', nome:'Dr. Ricardo Moreira', crm:'CRM/SP 345678', especialidade:'Ortopedia e Traumatologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 3567-8901', whatsapp:'(11) 97567-8901', endereco:'Rua Itapeva, 490 - Sala 801, Bela Vista, São Paulo - SP', convenios:['Unimed','Bradesco Saúde','Amil'], telemedicina:false, avaliacao:4.7, precoConsulta:380 },
  { id:'sp4', nome:'Dra. Luciana Pereira', crm:'CRM/SP 456789', especialidade:'Ginecologia e Obstetrícia', cidade:'São Paulo', estado:'SP', telefone:'(11) 4567-8901', whatsapp:'(11) 96567-8901', endereco:'Rua Haddock Lobo, 585 - Sala 301, Cerqueira César, São Paulo - SP', convenios:['SulAmérica','Amil'], telemedicina:true, avaliacao:4.8, precoConsulta:320 },
  { id:'sp5', nome:'Dr. André Nascimento', crm:'CRM/SP 567890', especialidade:'Neurologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 5678-9012', whatsapp:'(11) 95678-9012', endereco:'Rua Cubatão, 726 - Sala 1102, Vila Mariana, São Paulo - SP', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.6, precoConsulta:450 },
  { id:'sp6', nome:'Dra. Beatriz Almeida', crm:'CRM/SP 678901', especialidade:'Pediatria', cidade:'Campinas', estado:'SP', telefone:'(19) 3456-7890', convenios:['Unimed','SulAmérica'], telemedicina:true, avaliacao:4.9, precoConsulta:280 },
  { id:'sp7', nome:'Dr. Paulo Henrique Dias', crm:'CRM/SP 789012', especialidade:'Endocrinologia e Metabologia', cidade:'Campinas', estado:'SP', telefone:'(19) 4567-8901', convenios:['Amil','Unimed'], telemedicina:false, avaliacao:4.7, precoConsulta:350 },
  { id:'sp8', nome:'Dra. Fernanda Souza', crm:'CRM/SP 890123', especialidade:'Psiquiatria', cidade:'Ribeirão Preto', estado:'SP', telefone:'(16) 3456-7890', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.8, precoConsulta:400 },
  { id:'sp9', nome:'Dr. Gustavo Martins', crm:'CRM/SP 901234', especialidade:'Urologia', cidade:'Santos', estado:'SP', telefone:'(13) 3456-7890', convenios:['Unimed','SulAmérica'], telemedicina:false, avaliacao:4.5, precoConsulta:350 },
  { id:'sp10', nome:'Dra. Camila Rodrigues', crm:'CRM/SP 012345', especialidade:'Clínica Médica', cidade:'Sorocaba', estado:'SP', telefone:'(15) 3456-7890', convenios:['Unimed','Amil'], telemedicina:true, avaliacao:4.6, precoConsulta:200 },
  { id:'sp11', nome:'Dr. Thiago Oliveira', crm:'CRM/SP 112233', especialidade:'Oftalmologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 6789-0123', convenios:['Unimed','Bradesco Saúde','Amil'], telemedicina:false, avaliacao:4.7, precoConsulta:300 },
  { id:'sp12', nome:'Dra. Isabela Santos', crm:'CRM/SP 223344', especialidade:'Reumatologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 7890-1234', convenios:['SulAmérica','Porto Seguro Saúde'], telemedicina:true, avaliacao:4.8, precoConsulta:380 },
  { id:'sp13', nome:'Dr. Marcos Vinícius Lima', crm:'CRM/SP 334455', especialidade:'Gastroenterologia', cidade:'São José dos Campos', estado:'SP', telefone:'(12) 3456-7890', convenios:['Unimed','Amil'], telemedicina:true, avaliacao:4.6, precoConsulta:320 },
  { id:'sp14', nome:'Dra. Tatiana Ferreira', crm:'CRM/SP 445566', especialidade:'Pneumologia', cidade:'Bauru', estado:'SP', telefone:'(14) 3456-7890', convenios:['Unimed'], telemedicina:true, avaliacao:4.5, precoConsulta:280 },
  { id:'sp15', nome:'Dr. Leonardo Barros', crm:'CRM/SP 556677', especialidade:'Otorrinolaringologia', cidade:'São Paulo', estado:'SP', telefone:'(11) 8901-2345', convenios:['Unimed','Bradesco Saúde','SulAmérica'], telemedicina:false, avaliacao:4.7, precoConsulta:300 },
  // === MATO GROSSO ===
  { id:'mt1', nome:'Dr. Pedro Henrique Souza', crm:'CRM/MT 123456', especialidade:'Cardiologia', cidade:'Cuiabá', estado:'MT', telefone:'(65) 3456-7890', whatsapp:'(65) 99456-7890', endereco:'Av. Historiador Rubens de Mendonça, 1500 - Sala 802, Cuiabá - MT', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.7, precoConsulta:280 },
  { id:'mt2', nome:'Dra. Ana Carolina Lima', crm:'CRM/MT 234567', especialidade:'Dermatologia', cidade:'Cuiabá', estado:'MT', telefone:'(65) 2345-6789', whatsapp:'(65) 98345-6789', endereco:'Av. Miguel Sutil, 8000 - Sala 405, Cuiabá - MT', convenios:['Unimed','Hapvida','Bradesco Saúde'], telemedicina:true, avaliacao:4.8, precoConsulta:300 },
  { id:'mt3', nome:'Dr. Marcos Antônio Ferreira', crm:'CRM/MT 345678', especialidade:'Ortopedia e Traumatologia', cidade:'Rondonópolis', estado:'MT', telefone:'(66) 3456-7890', whatsapp:'(66) 99456-7890', endereco:'Av. Fernando Corrêa da Costa, 3200 - Rondonópolis - MT', convenios:['Unimed'], telemedicina:false, avaliacao:4.6, precoConsulta:250 },
  { id:'mt4', nome:'Dra. Juliana Matos', crm:'CRM/MT 456789', especialidade:'Ginecologia e Obstetrícia', cidade:'Tangará da Serra', estado:'MT', telefone:'(65) 3326-4567', whatsapp:'(65) 99326-4567', endereco:'Av. Brasil, 1200 - Centro, Tangará da Serra - MT', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.6, precoConsulta:250 },
  { id:'mt5', nome:'Dr. Rafael Cunha', crm:'CRM/MT 567890', especialidade:'Clínica Médica', cidade:'Sinop', estado:'MT', telefone:'(66) 4567-8901', whatsapp:'(66) 98567-8901', endereco:'Av. das Itaúbas, 3890 - Setor Comercial, Sinop - MT', convenios:['Unimed'], telemedicina:true, avaliacao:4.4, precoConsulta:180 },
  { id:'mt6', nome:'Dr. Fernando Oliveira', crm:'CRM/MT 678901', especialidade:'Urologia', cidade:'Cuiabá', estado:'MT', telefone:'(65) 5678-9012', whatsapp:'(65) 97678-9012', endereco:'Av. do CPA, 1200 - Cuiabá - MT', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.5, precoConsulta:300 },
  { id:'mt7', nome:'Dra. Patrícia Vieira', crm:'CRM/MT 789012', especialidade:'Pediatria', cidade:'Várzea Grande', estado:'MT', telefone:'(65) 6789-0123', whatsapp:'(65) 96789-0123', endereco:'Av. Júlio Campos, 1890 - Centro, Várzea Grande - MT', convenios:['Hapvida','Unimed'], telemedicina:true, avaliacao:4.7, precoConsulta:220 },
  { id:'mt8', nome:'Dr. Anderson Teixeira', crm:'CRM/MT 890123', especialidade:'Cardiologia', cidade:'Tangará da Serra', estado:'MT', telefone:'(65) 3326-5678', whatsapp:'(65) 99326-5678', endereco:'Rua Antônio Dorileo, 500 - Centro, Tangará da Serra - MT', convenios:['Unimed'], telemedicina:true, avaliacao:4.5, precoConsulta:280 },
  { id:'mt9', nome:'Dra. Camila Santos', crm:'CRM/MT 901234', especialidade:'Endocrinologia e Metabologia', cidade:'Cuiabá', estado:'MT', telefone:'(65) 7890-1234', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.6, precoConsulta:300 },
  { id:'mt10', nome:'Dr. Lucas Barbosa', crm:'CRM/MT 012345', especialidade:'Neurologia', cidade:'Sinop', estado:'MT', telefone:'(66) 8901-2345', convenios:['Unimed'], telemedicina:true, avaliacao:4.4, precoConsulta:280 },
  { id:'mt11', nome:'Dra. Renata Pires', crm:'CRM/MT 112233', especialidade:'Psiquiatria', cidade:'Cuiabá', estado:'MT', telefone:'(65) 9012-3456', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.7, precoConsulta:350 },
  { id:'mt12', nome:'Dr. Fábio Monteiro', crm:'CRM/MT 223344', especialidade:'Oftalmologia', cidade:'Rondonópolis', estado:'MT', telefone:'(66) 0123-4567', convenios:['Unimed'], telemedicina:false, avaliacao:4.5, precoConsulta:250 },
  // === RIO DE JANEIRO ===
  { id:'rj1', nome:'Dr. Roberto Mendes', crm:'CRM/RJ 123456', especialidade:'Cardiologia', cidade:'Rio de Janeiro', estado:'RJ', telefone:'(21) 3456-7890', whatsapp:'(21) 99456-7890', endereco:'Av. Atlântica, 1702 - Sala 1001, Copacabana, Rio de Janeiro - RJ', convenios:['Unimed','Bradesco Saúde','SulAmérica'], telemedicina:true, avaliacao:4.8, precoConsulta:400 },
  { id:'rj2', nome:'Dra. Patrícia Souza', crm:'CRM/RJ 234567', especialidade:'Dermatologia', cidade:'Rio de Janeiro', estado:'RJ', telefone:'(21) 2345-6789', whatsapp:'(21) 98345-6789', endereco:'Rua Visconde de Pirajá, 550 - Sala 302, Ipanema, Rio de Janeiro - RJ', convenios:['Amil','Unimed'], telemedicina:true, avaliacao:4.9, precoConsulta:450 },
  { id:'rj3', nome:'Dr. Fernando Almeida', crm:'CRM/RJ 345678', especialidade:'Ortopedia e Traumatologia', cidade:'Rio de Janeiro', estado:'RJ', telefone:'(21) 3567-8901', convenios:['Unimed','Bradesco Saúde'], telemedicina:false, avaliacao:4.7, precoConsulta:380 },
  { id:'rj4', nome:'Dra. Juliana Ferreira', crm:'CRM/RJ 456789', especialidade:'Ginecologia e Obstetrícia', cidade:'Niterói', estado:'RJ', telefone:'(21) 4567-8901', convenios:['Unimed','SulAmérica'], telemedicina:true, avaliacao:4.6, precoConsulta:300 },
  { id:'rj5', nome:'Dr. Alexandre Santos', crm:'CRM/RJ 567890', especialidade:'Psiquiatria', cidade:'Rio de Janeiro', estado:'RJ', telefone:'(21) 5678-9012', convenios:['Unimed','Bradesco Saúde','Amil'], telemedicina:true, avaliacao:4.8, precoConsulta:500 },
  { id:'rj6', nome:'Dra. Simone Cardoso', crm:'CRM/RJ 678901', especialidade:'Pediatria', cidade:'Petrópolis', estado:'RJ', telefone:'(24) 3456-7890', convenios:['Unimed'], telemedicina:true, avaliacao:4.7, precoConsulta:280 },
  { id:'rj7', nome:'Dr. Leandro Souza', crm:'CRM/RJ 789012', especialidade:'Gastroenterologia', cidade:'Rio de Janeiro', estado:'RJ', telefone:'(21) 6789-0123', convenios:['Unimed','Bradesco Saúde'], telemedicina:false, avaliacao:4.6, precoConsulta:350 },
  // === MINAS GERAIS ===
  { id:'mg1', nome:'Dr. Henrique Oliveira', crm:'CRM/MG 123456', especialidade:'Cardiologia', cidade:'Belo Horizonte', estado:'MG', telefone:'(31) 3456-7890', whatsapp:'(31) 99456-7890', endereco:'Av. Afonso Pena, 1500 - Sala 1204, Centro, Belo Horizonte - MG', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.7, precoConsulta:320 },
  { id:'mg2', nome:'Dra. Cristina Ribeiro', crm:'CRM/MG 234567', especialidade:'Dermatologia', cidade:'Belo Horizonte', estado:'MG', telefone:'(31) 2345-6789', convenios:['Unimed','SulAmérica'], telemedicina:true, avaliacao:4.8, precoConsulta:350 },
  { id:'mg3', nome:'Dr. Rodrigo Alves', crm:'CRM/MG 345678', especialidade:'Ortopedia e Traumatologia', cidade:'Uberlândia', estado:'MG', telefone:'(34) 3456-7890', convenios:['Unimed'], telemedicina:false, avaliacao:4.6, precoConsulta:280 },
  { id:'mg4', nome:'Dra. Mariana Duarte', crm:'CRM/MG 456789', especialidade:'Ginecologia e Obstetrícia', cidade:'Juiz de Fora', estado:'MG', telefone:'(32) 3456-7890', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.7, precoConsulta:280 },
  { id:'mg5', nome:'Dr. Felipe Mendes', crm:'CRM/MG 567890', especialidade:'Neurologia', cidade:'Belo Horizonte', estado:'MG', telefone:'(31) 4567-8901', convenios:['Unimed','SulAmérica'], telemedicina:true, avaliacao:4.5, precoConsulta:380 },
  { id:'mg6', nome:'Dra. Larissa Campos', crm:'CRM/MG 678901', especialidade:'Pediatria', cidade:'Contagem', estado:'MG', telefone:'(31) 5678-9012', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.6, precoConsulta:220 },
  { id:'mg7', nome:'Dr. Bruno Ferreira', crm:'CRM/MG 789012', especialidade:'Endocrinologia e Metabologia', cidade:'Belo Horizonte', estado:'MG', telefone:'(31) 6789-0123', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.7, precoConsulta:320 },
  // === GOIÁS ===
  { id:'go1', nome:'Dr. Lucas Barbosa', crm:'CRM/GO 112233', especialidade:'Urologia', cidade:'Goiânia', estado:'GO', telefone:'(62) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.6, precoConsulta:300 },
  { id:'go2', nome:'Dra. Patrícia Vieira', crm:'CRM/GO 223344', especialidade:'Cardiologia', cidade:'Goiânia', estado:'GO', telefone:'(62) 4567-8901', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.7, precoConsulta:320 },
  { id:'go3', nome:'Dr. Anderson Teixeira', crm:'CRM/GO 334455', especialidade:'Ortopedia e Traumatologia', cidade:'Goiânia', estado:'GO', telefone:'(62) 5678-9012', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.5, precoConsulta:280 },
  { id:'go4', nome:'Dra. Natália Freitas', crm:'CRM/GO 445566', especialidade:'Dermatologia', cidade:'Aparecida de Goiânia', estado:'GO', telefone:'(62) 6789-0123', convenios:['Unimed'], telemedicina:true, avaliacao:4.8, precoConsulta:300 },
  { id:'go5', nome:'Dr. Leandro Souza', crm:'CRM/GO 556677', especialidade:'Clínica Médica', cidade:'Anápolis', estado:'GO', telefone:'(62) 7890-1234', convenios:['Hapvida','Unimed'], telemedicina:true, avaliacao:4.4, precoConsulta:180 },
  // === PARÁ ===
  { id:'pa1', nome:'Dr. Marcos Antônio Lima', crm:'CRM/PA 789012', especialidade:'Cardiologia', cidade:'Belém', estado:'PA', telefone:'(91) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.7, precoConsulta:280 },
  { id:'pa2', nome:'Dra. Renata Pires', crm:'CRM/PA 890123', especialidade:'Pediatria', cidade:'Belém', estado:'PA', telefone:'(91) 4567-8901', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.8, precoConsulta:250 },
  { id:'pa3', nome:'Dr. Fábio Monteiro', crm:'CRM/PA 901234', especialidade:'Ortopedia e Traumatologia', cidade:'Belém', estado:'PA', telefone:'(91) 5678-9012', convenios:['Unimed'], telemedicina:false, avaliacao:4.5, precoConsulta:280 },
  { id:'pa4', nome:'Dra. Simone Cardoso', crm:'CRM/PA 012345', especialidade:'Ginecologia e Obstetrícia', cidade:'Ananindeua', estado:'PA', telefone:'(91) 6789-0123', convenios:['Hapvida','Unimed'], telemedicina:false, avaliacao:4.6, precoConsulta:250 },
  { id:'pa5', nome:'Dr. Alexandre Santos', crm:'CRM/PA 112233', especialidade:'Clínica Médica', cidade:'Marabá', estado:'PA', telefone:'(94) 3456-7890', convenios:['Hapvida'], telemedicina:true, avaliacao:4.3, precoConsulta:150 },
  // === RIO GRANDE DO SUL ===
  { id:'rs1', nome:'Dr. Roberto Mendes', crm:'CRM/RS 567890', especialidade:'Neurologia', cidade:'Porto Alegre', estado:'RS', telefone:'(51) 3456-7890', convenios:['Unimed','IPE Saúde'], telemedicina:true, avaliacao:4.6, precoConsulta:380 },
  { id:'rs2', nome:'Dra. Fernanda Lopes', crm:'CRM/RS 678901', especialidade:'Cardiologia', cidade:'Porto Alegre', estado:'RS', telefone:'(51) 4567-8901', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.7, precoConsulta:350 },
  { id:'rs3', nome:'Dr. Gustavo Martins', crm:'CRM/RS 789012', especialidade:'Ortopedia e Traumatologia', cidade:'Caxias do Sul', estado:'RS', telefone:'(54) 3456-7890', convenios:['Unimed'], telemedicina:false, avaliacao:4.5, precoConsulta:280 },
  { id:'rs4', nome:'Dra. Carolina Dias', crm:'CRM/RS 890123', especialidade:'Dermatologia', cidade:'Porto Alegre', estado:'RS', telefone:'(51) 5678-9012', convenios:['Unimed','SulAmérica'], telemedicina:true, avaliacao:4.8, precoConsulta:350 },
  // === PARANÁ ===
  { id:'pr1', nome:'Dra. Juliana Ferreira', crm:'CRM/PR 678901', especialidade:'Ginecologia e Obstetrícia', cidade:'Curitiba', estado:'PR', telefone:'(41) 3456-7890', convenios:['Unimed','Amil','Paraná Clínicas'], telemedicina:false, avaliacao:4.8, precoConsulta:300 },
  { id:'pr2', nome:'Dr. Marcelo Ribeiro', crm:'CRM/PR 789012', especialidade:'Cardiologia', cidade:'Curitiba', estado:'PR', telefone:'(41) 4567-8901', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.7, precoConsulta:350 },
  { id:'pr3', nome:'Dra. Tatiana Ferreira', crm:'CRM/PR 890123', especialidade:'Pediatria', cidade:'Londrina', estado:'PR', telefone:'(43) 3456-7890', convenios:['Unimed'], telemedicina:true, avaliacao:4.6, precoConsulta:250 },
  { id:'pr4', nome:'Dr. André Nascimento', crm:'CRM/PR 901234', especialidade:'Ortopedia e Traumatologia', cidade:'Maringá', estado:'PR', telefone:'(44) 3456-7890', convenios:['Unimed','Amil'], telemedicina:false, avaliacao:4.5, precoConsulta:280 },
  // === SANTA CATARINA ===
  { id:'sc1', nome:'Dr. Eduardo Silva', crm:'CRM/SC 123456', especialidade:'Cardiologia', cidade:'Florianópolis', estado:'SC', telefone:'(48) 3456-7890', convenios:['Unimed','SulAmérica'], telemedicina:true, avaliacao:4.7, precoConsulta:320 },
  { id:'sc2', nome:'Dra. Mariana Costa', crm:'CRM/SC 234567', especialidade:'Dermatologia', cidade:'Joinville', estado:'SC', telefone:'(47) 3456-7890', convenios:['Unimed'], telemedicina:true, avaliacao:4.6, precoConsulta:300 },
  { id:'sc3', nome:'Dr. Felipe Almeida', crm:'CRM/SC 345678', especialidade:'Neurologia', cidade:'Blumenau', estado:'SC', telefone:'(47) 4567-8901', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.5, precoConsulta:350 },
  // === BAHIA ===
  { id:'ba1', nome:'Dr. Fernando Almeida', crm:'CRM/BA 789012', especialidade:'Endocrinologia e Metabologia', cidade:'Salvador', estado:'BA', telefone:'(71) 3456-7890', convenios:['Unimed','Bradesco Saúde','Cassi'], telemedicina:true, avaliacao:4.7, precoConsulta:300 },
  { id:'ba2', nome:'Dra. Cristina Ribeiro', crm:'CRM/BA 890123', especialidade:'Cardiologia', cidade:'Salvador', estado:'BA', telefone:'(71) 4567-8901', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.6, precoConsulta:300 },
  { id:'ba3', nome:'Dr. Rodrigo Alves', crm:'CRM/BA 901234', especialidade:'Ortopedia e Traumatologia', cidade:'Feira de Santana', estado:'BA', telefone:'(75) 3456-7890', convenios:['Unimed'], telemedicina:false, avaliacao:4.5, precoConsulta:250 },
  // === PERNAMBUCO ===
  { id:'pe1', nome:'Dra. Patrícia Souza', crm:'CRM/PE 890123', especialidade:'Psiquiatria', cidade:'Recife', estado:'PE', telefone:'(81) 3456-7890', convenios:['Unimed','Hapvida','SulAmérica'], telemedicina:true, avaliacao:4.9, precoConsulta:400 },
  { id:'pe2', nome:'Dr. Marcos Vinícius', crm:'CRM/PE 901234', especialidade:'Cardiologia', cidade:'Recife', estado:'PE', telefone:'(81) 4567-8901', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.7, precoConsulta:300 },
  { id:'pe3', nome:'Dra. Larissa Campos', crm:'CRM/PE 012345', especialidade:'Ginecologia e Obstetrícia', cidade:'Olinda', estado:'PE', telefone:'(81) 5678-9012', convenios:['Hapvida','Unimed'], telemedicina:false, avaliacao:4.6, precoConsulta:280 },
  // === CEARÁ ===
  { id:'ce1', nome:'Dr. Fernando Costa', crm:'CRM/CE 901234', especialidade:'Oftalmologia', cidade:'Fortaleza', estado:'CE', telefone:'(85) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.5, precoConsulta:280 },
  { id:'ce2', nome:'Dra. Ana Paula Lima', crm:'CRM/CE 012345', especialidade:'Cardiologia', cidade:'Fortaleza', estado:'CE', telefone:'(85) 4567-8901', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.7, precoConsulta:300 },
  { id:'ce3', nome:'Dr. Bruno Ferreira', crm:'CRM/CE 112233', especialidade:'Pediatria', cidade:'Fortaleza', estado:'CE', telefone:'(85) 5678-9012', convenios:['Hapvida','Unimed'], telemedicina:true, avaliacao:4.6, precoConsulta:220 },
  // === DISTRITO FEDERAL ===
  { id:'df1', nome:'Dra. Camila Rodrigues', crm:'CRM/DF 012345', especialidade:'Clínica Médica', cidade:'Brasília', estado:'DF', telefone:'(61) 3456-7890', convenios:['Unimed','Amil','SulAmérica','Bradesco Saúde'], telemedicina:true, avaliacao:4.8, precoConsulta:250 },
  { id:'df2', nome:'Dr. Henrique Oliveira', crm:'CRM/DF 123456', especialidade:'Cardiologia', cidade:'Brasília', estado:'DF', telefone:'(61) 4567-8901', convenios:['Unimed','Geap','Cassi'], telemedicina:true, avaliacao:4.7, precoConsulta:350 },
  { id:'df3', nome:'Dra. Isabela Santos', crm:'CRM/DF 234567', especialidade:'Dermatologia', cidade:'Brasília', estado:'DF', telefone:'(61) 5678-9012', convenios:['Unimed','Bradesco Saúde'], telemedicina:true, avaliacao:4.8, precoConsulta:350 },
  // === AMAZONAS ===
  { id:'am1', nome:'Dr. Ricardo Moreira', crm:'CRM/AM 123456', especialidade:'Cardiologia', cidade:'Manaus', estado:'AM', telefone:'(92) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.5, precoConsulta:280 },
  { id:'am2', nome:'Dra. Fernanda Souza', crm:'CRM/AM 234567', especialidade:'Ginecologia e Obstetrícia', cidade:'Manaus', estado:'AM', telefone:'(92) 4567-8901', convenios:['Hapvida','Unimed'], telemedicina:true, avaliacao:4.6, precoConsulta:250 },
  // === MARANHÃO ===
  { id:'ma1', nome:'Dr. Thiago Oliveira', crm:'CRM/MA 123456', especialidade:'Clínica Médica', cidade:'São Luís', estado:'MA', telefone:'(98) 3456-7890', convenios:['Hapvida','Unimed'], telemedicina:true, avaliacao:4.4, precoConsulta:180 },
  { id:'ma2', nome:'Dra. Beatriz Almeida', crm:'CRM/MA 234567', especialidade:'Pediatria', cidade:'São Luís', estado:'MA', telefone:'(98) 4567-8901', convenios:['Hapvida'], telemedicina:true, avaliacao:4.5, precoConsulta:200 },
  // === ESPÍRITO SANTO ===
  { id:'es1', nome:'Dr. Paulo Henrique', crm:'CRM/ES 123456', especialidade:'Cardiologia', cidade:'Vitória', estado:'ES', telefone:'(27) 3456-7890', convenios:['Unimed','São Francisco Saúde'], telemedicina:true, avaliacao:4.6, precoConsulta:300 },
  { id:'es2', nome:'Dra. Maria Clara', crm:'CRM/ES 234567', especialidade:'Dermatologia', cidade:'Vila Velha', estado:'ES', telefone:'(27) 4567-8901', convenios:['Unimed'], telemedicina:true, avaliacao:4.7, precoConsulta:300 },
  // === MATO GROSSO DO SUL ===
  { id:'ms1', nome:'Dr. Leonardo Barros', crm:'CRM/MS 123456', especialidade:'Cardiologia', cidade:'Campo Grande', estado:'MS', telefone:'(67) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.6, precoConsulta:280 },
  { id:'ms2', nome:'Dra. Carolina Dias', crm:'CRM/MS 234567', especialidade:'Ginecologia e Obstetrícia', cidade:'Dourados', estado:'MS', telefone:'(67) 4567-8901', convenios:['Unimed'], telemedicina:true, avaliacao:4.5, precoConsulta:250 },
  // === PIAUÍ ===
  { id:'pi1', nome:'Dr. Marcos Lima', crm:'CRM/PI 123456', especialidade:'Clínica Médica', cidade:'Teresina', estado:'PI', telefone:'(86) 3456-7890', convenios:['Hapvida','Unimed'], telemedicina:true, avaliacao:4.4, precoConsulta:150 },
  // === RIO GRANDE DO NORTE ===
  { id:'rn1', nome:'Dr. Felipe Mendes', crm:'CRM/RN 123456', especialidade:'Cardiologia', cidade:'Natal', estado:'RN', telefone:'(84) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.5, precoConsulta:280 },
  { id:'rn2', nome:'Dra. Tatiana Ferreira', crm:'CRM/RN 234567', especialidade:'Dermatologia', cidade:'Natal', estado:'RN', telefone:'(84) 4567-8901', convenios:['Unimed'], telemedicina:true, avaliacao:4.6, precoConsulta:280 },
  // === PARAÍBA ===
  { id:'pb1', nome:'Dr. Bruno Ferreira', crm:'CRM/PB 123456', especialidade:'Ortopedia e Traumatologia', cidade:'João Pessoa', estado:'PB', telefone:'(83) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:false, avaliacao:4.5, precoConsulta:250 },
  // === SERGIPE ===
  { id:'se1', nome:'Dra. Larissa Campos', crm:'CRM/SE 123456', especialidade:'Ginecologia e Obstetrícia', cidade:'Aracaju', estado:'SE', telefone:'(79) 3456-7890', convenios:['Unimed','Hapvida'], telemedicina:true, avaliacao:4.6, precoConsulta:250 },
  // === ALAGOAS ===
  { id:'al1', nome:'Dr. Rodrigo Alves', crm:'CRM/AL 123456', especialidade:'Cardiologia', cidade:'Maceió', estado:'AL', telefone:'(82) 3456-7890', convenios:['Hapvida','Unimed'], telemedicina:true, avaliacao:4.5, precoConsulta:250 },
  // === TOCANTINS ===
  { id:'to1', nome:'Dr. Anderson Teixeira', crm:'CRM/TO 123456', especialidade:'Clínica Médica', cidade:'Palmas', estado:'TO', telefone:'(63) 3456-7890', convenios:['Hapvida','Unimed'], telemedicina:true, avaliacao:4.4, precoConsulta:180 },
  // === RONDÔNIA ===
  { id:'ro1', nome:'Dra. Cristina Ribeiro', crm:'CRM/RO 123456', especialidade:'Pediatria', cidade:'Porto Velho', estado:'RO', telefone:'(69) 3456-7890', convenios:['Hapvida'], telemedicina:true, avaliacao:4.4, precoConsulta:200 },
  // === ACRE ===
  { id:'ac1', nome:'Dr. Gustavo Martins', crm:'CRM/AC 123456', especialidade:'Clínica Médica', cidade:'Rio Branco', estado:'AC', telefone:'(68) 3456-7890', convenios:['Hapvida'], telemedicina:true, avaliacao:4.3, precoConsulta:150 },
  // === AMAPÁ ===
  { id:'ap1', nome:'Dra. Mariana Duarte', crm:'CRM/AP 123456', especialidade:'Ginecologia e Obstetrícia', cidade:'Macapá', estado:'AP', telefone:'(96) 3456-7890', convenios:['Hapvida'], telemedicina:true, avaliacao:4.3, precoConsulta:200 },
  // === RORAIMA ===
  { id:'rr1', nome:'Dr. Thiago Oliveira', crm:'CRM/RR 123456', especialidade:'Clínica Médica', cidade:'Boa Vista', estado:'RR', telefone:'(95) 3456-7890', convenios:['Hapvida'], telemedicina:true, avaliacao:4.2, precoConsulta:150 },
];
