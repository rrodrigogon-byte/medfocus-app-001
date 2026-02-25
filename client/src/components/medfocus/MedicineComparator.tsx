import { useState, useMemo, useCallback } from 'react';

// ============================================================
// BANCO DE DADOS DE MEDICAMENTOS — Genéricos vs Referência
// Fonte: CMED/ANVISA, Consulta Remédios, Procon-SP (2024/2025)
// ============================================================

interface Medicamento {
  id: string;
  principioAtivo: string;
  categoria: string;
  indicacao: string;
  referencia: {
    nome: string;
    laboratorio: string;
    preco: number; // PMC médio (ICMS 18%)
  };
  genericos: {
    laboratorio: string;
    preco: number;
  }[];
  similar?: {
    nome: string;
    laboratorio: string;
    preco: number;
  }[];
  apresentacao: string;
  classeTerap: string;
  retencaoReceita: string;
  observacoes?: string;
}

const MEDICAMENTOS_DB: Medicamento[] = [
  // ===== ANALGÉSICOS E ANTI-INFLAMATÓRIOS =====
  {
    id: 'paracetamol-750',
    principioAtivo: 'Paracetamol',
    categoria: 'Analgésico / Antipirético',
    indicacao: 'Dor leve a moderada, febre',
    referencia: { nome: 'Tylenol', laboratorio: 'Johnson & Johnson', preco: 22.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 7.50 },
      { laboratorio: 'Medley', preco: 8.20 },
      { laboratorio: 'Cimed', preco: 6.90 },
      { laboratorio: 'Prati-Donaduzzi', preco: 7.10 },
    ],
    similar: [{ nome: 'Dôrico', laboratorio: 'Sanofi', preco: 14.50 }],
    apresentacao: '750mg - 20 comprimidos',
    classeTerap: 'Analgésico não opioide',
    retencaoReceita: 'Venda livre',
  },
  {
    id: 'ibuprofeno-600',
    principioAtivo: 'Ibuprofeno',
    categoria: 'Anti-inflamatório / Analgésico',
    indicacao: 'Dor, inflamação, febre, artrite',
    referencia: { nome: 'Advil', laboratorio: 'Pfizer', preco: 28.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 9.80 },
      { laboratorio: 'Medley', preco: 10.50 },
      { laboratorio: 'Neo Química', preco: 8.90 },
      { laboratorio: 'Cimed', preco: 9.20 },
    ],
    similar: [{ nome: 'Alivium', laboratorio: 'Hypera', preco: 19.90 }],
    apresentacao: '600mg - 20 comprimidos',
    classeTerap: 'AINE',
    retencaoReceita: 'Venda livre',
  },
  {
    id: 'dipirona-500',
    principioAtivo: 'Dipirona Sódica',
    categoria: 'Analgésico / Antipirético',
    indicacao: 'Dor e febre',
    referencia: { nome: 'Novalgina', laboratorio: 'Sanofi', preco: 18.50 },
    genericos: [
      { laboratorio: 'EMS', preco: 5.90 },
      { laboratorio: 'Medley', preco: 6.40 },
      { laboratorio: 'Prati-Donaduzzi', preco: 5.50 },
      { laboratorio: 'Neo Química', preco: 6.10 },
    ],
    apresentacao: '500mg - 30 comprimidos',
    classeTerap: 'Analgésico / Antipirético',
    retencaoReceita: 'Venda livre',
  },
  {
    id: 'diclofenaco-50',
    principioAtivo: 'Diclofenaco Sódico',
    categoria: 'Anti-inflamatório',
    indicacao: 'Dor, inflamação, artrite, tendinite',
    referencia: { nome: 'Voltaren', laboratorio: 'Novartis', preco: 32.50 },
    genericos: [
      { laboratorio: 'EMS', preco: 8.90 },
      { laboratorio: 'Medley', preco: 9.50 },
      { laboratorio: 'Cimed', preco: 8.20 },
    ],
    similar: [{ nome: 'Cataflan', laboratorio: 'Novartis', preco: 26.90 }],
    apresentacao: '50mg - 20 comprimidos',
    classeTerap: 'AINE',
    retencaoReceita: 'Venda livre',
  },
  {
    id: 'nimesulida-100',
    principioAtivo: 'Nimesulida',
    categoria: 'Anti-inflamatório',
    indicacao: 'Dor, inflamação, febre',
    referencia: { nome: 'Nisulid', laboratorio: 'Aché', preco: 35.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 11.50 },
      { laboratorio: 'Medley', preco: 12.80 },
      { laboratorio: 'Neo Química', preco: 10.90 },
    ],
    apresentacao: '100mg - 12 comprimidos',
    classeTerap: 'AINE seletivo COX-2',
    retencaoReceita: 'Venda livre',
  },
  // ===== ANTIBIÓTICOS =====
  {
    id: 'amoxicilina-500',
    principioAtivo: 'Amoxicilina',
    categoria: 'Antibiótico',
    indicacao: 'Infecções bacterianas (respiratórias, urinárias, otite)',
    referencia: { nome: 'Amoxil', laboratorio: 'GSK', preco: 45.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 15.90 },
      { laboratorio: 'Medley', preco: 16.50 },
      { laboratorio: 'Prati-Donaduzzi', preco: 14.80 },
      { laboratorio: 'Neo Química', preco: 15.20 },
    ],
    apresentacao: '500mg - 21 cápsulas',
    classeTerap: 'Penicilina de amplo espectro',
    retencaoReceita: 'Receita simples (retenção)',
  },
  {
    id: 'azitromicina-500',
    principioAtivo: 'Azitromicina',
    categoria: 'Antibiótico',
    indicacao: 'Infecções respiratórias, sinusite, otite, faringite',
    referencia: { nome: 'Zitromax', laboratorio: 'Pfizer', preco: 52.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 18.90 },
      { laboratorio: 'Medley', preco: 19.50 },
      { laboratorio: 'Cimed', preco: 17.80 },
      { laboratorio: 'Eurofarma', preco: 20.10 },
    ],
    apresentacao: '500mg - 3 comprimidos',
    classeTerap: 'Macrolídeo',
    retencaoReceita: 'Receita simples (retenção)',
  },
  {
    id: 'cefalexina-500',
    principioAtivo: 'Cefalexina',
    categoria: 'Antibiótico',
    indicacao: 'Infecções de pele, urinárias, respiratórias',
    referencia: { nome: 'Keflex', laboratorio: 'Bagó', preco: 58.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 22.90 },
      { laboratorio: 'Medley', preco: 24.50 },
      { laboratorio: 'Prati-Donaduzzi', preco: 21.80 },
    ],
    apresentacao: '500mg - 8 cápsulas',
    classeTerap: 'Cefalosporina 1ª geração',
    retencaoReceita: 'Receita simples (retenção)',
  },
  {
    id: 'ciprofloxacino-500',
    principioAtivo: 'Ciprofloxacino',
    categoria: 'Antibiótico',
    indicacao: 'Infecções urinárias, respiratórias, gastrointestinais',
    referencia: { nome: 'Cipro', laboratorio: 'Bayer', preco: 62.50 },
    genericos: [
      { laboratorio: 'EMS', preco: 19.90 },
      { laboratorio: 'Medley', preco: 21.50 },
      { laboratorio: 'Cimed', preco: 18.90 },
    ],
    apresentacao: '500mg - 14 comprimidos',
    classeTerap: 'Fluoroquinolona',
    retencaoReceita: 'Receita simples (retenção)',
  },
  // ===== CARDIOVASCULAR =====
  {
    id: 'losartana-50',
    principioAtivo: 'Losartana Potássica',
    categoria: 'Anti-hipertensivo',
    indicacao: 'Hipertensão arterial, insuficiência cardíaca',
    referencia: { nome: 'Cozaar', laboratorio: 'MSD', preco: 68.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 14.90 },
      { laboratorio: 'Medley', preco: 15.80 },
      { laboratorio: 'Neo Química', preco: 13.90 },
      { laboratorio: 'Prati-Donaduzzi', preco: 14.20 },
    ],
    apresentacao: '50mg - 30 comprimidos',
    classeTerap: 'Antagonista do receptor AT1 da angiotensina II',
    retencaoReceita: 'Receita simples',
  },
  {
    id: 'enalapril-10',
    principioAtivo: 'Maleato de Enalapril',
    categoria: 'Anti-hipertensivo',
    indicacao: 'Hipertensão arterial, insuficiência cardíaca',
    referencia: { nome: 'Renitec', laboratorio: 'MSD', preco: 42.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 11.90 },
      { laboratorio: 'Medley', preco: 12.50 },
      { laboratorio: 'Cimed', preco: 10.90 },
    ],
    apresentacao: '10mg - 30 comprimidos',
    classeTerap: 'Inibidor da ECA',
    retencaoReceita: 'Receita simples',
  },
  {
    id: 'anlodipino-5',
    principioAtivo: 'Besilato de Anlodipino',
    categoria: 'Anti-hipertensivo',
    indicacao: 'Hipertensão arterial, angina',
    referencia: { nome: 'Norvasc', laboratorio: 'Pfizer', preco: 55.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 12.90 },
      { laboratorio: 'Medley', preco: 13.50 },
      { laboratorio: 'Neo Química', preco: 11.90 },
      { laboratorio: 'Eurofarma', preco: 13.20 },
    ],
    apresentacao: '5mg - 30 comprimidos',
    classeTerap: 'Bloqueador de canal de cálcio',
    retencaoReceita: 'Receita simples',
  },
  {
    id: 'atenolol-50',
    principioAtivo: 'Atenolol',
    categoria: 'Anti-hipertensivo',
    indicacao: 'Hipertensão, arritmias, angina',
    referencia: { nome: 'Atenol', laboratorio: 'Aché', preco: 38.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 9.90 },
      { laboratorio: 'Medley', preco: 10.50 },
      { laboratorio: 'Cimed', preco: 9.20 },
    ],
    apresentacao: '50mg - 30 comprimidos',
    classeTerap: 'Betabloqueador seletivo',
    retencaoReceita: 'Receita simples',
  },
  {
    id: 'sinvastatina-20',
    principioAtivo: 'Sinvastatina',
    categoria: 'Antilipêmico',
    indicacao: 'Colesterol alto, prevenção cardiovascular',
    referencia: { nome: 'Zocor', laboratorio: 'MSD', preco: 72.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 15.90 },
      { laboratorio: 'Medley', preco: 16.80 },
      { laboratorio: 'Neo Química', preco: 14.90 },
      { laboratorio: 'Prati-Donaduzzi', preco: 15.20 },
    ],
    apresentacao: '20mg - 30 comprimidos',
    classeTerap: 'Estatina (inibidor da HMG-CoA redutase)',
    retencaoReceita: 'Receita simples',
  },
  {
    id: 'atorvastatina-20',
    principioAtivo: 'Atorvastatina Cálcica',
    categoria: 'Antilipêmico',
    indicacao: 'Colesterol alto, prevenção cardiovascular',
    referencia: { nome: 'Lipitor', laboratorio: 'Pfizer', preco: 89.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 25.90 },
      { laboratorio: 'Medley', preco: 27.50 },
      { laboratorio: 'Eurofarma', preco: 24.90 },
    ],
    apresentacao: '20mg - 30 comprimidos',
    classeTerap: 'Estatina (inibidor da HMG-CoA redutase)',
    retencaoReceita: 'Receita simples',
  },
  {
    id: 'aas-100',
    principioAtivo: 'Ácido Acetilsalicílico',
    categoria: 'Antiagregante plaquetário',
    indicacao: 'Prevenção de trombose, infarto, AVC',
    referencia: { nome: 'Aspirina Prevent', laboratorio: 'Bayer', preco: 28.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 8.90 },
      { laboratorio: 'Medley', preco: 9.50 },
      { laboratorio: 'Neo Química', preco: 8.20 },
    ],
    apresentacao: '100mg - 30 comprimidos',
    classeTerap: 'Antiagregante plaquetário',
    retencaoReceita: 'Venda livre',
  },
  // ===== DIABETES =====
  {
    id: 'metformina-850',
    principioAtivo: 'Cloridrato de Metformina',
    categoria: 'Antidiabético',
    indicacao: 'Diabetes mellitus tipo 2',
    referencia: { nome: 'Glifage', laboratorio: 'Merck', preco: 35.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 10.90 },
      { laboratorio: 'Medley', preco: 11.50 },
      { laboratorio: 'Prati-Donaduzzi', preco: 9.90 },
      { laboratorio: 'Neo Química', preco: 10.20 },
    ],
    apresentacao: '850mg - 30 comprimidos',
    classeTerap: 'Biguanida',
    retencaoReceita: 'Receita simples',
  },
  {
    id: 'glibenclamida-5',
    principioAtivo: 'Glibenclamida',
    categoria: 'Antidiabético',
    indicacao: 'Diabetes mellitus tipo 2',
    referencia: { nome: 'Daonil', laboratorio: 'Sanofi', preco: 18.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 5.90 },
      { laboratorio: 'Medley', preco: 6.50 },
      { laboratorio: 'Prati-Donaduzzi', preco: 5.20 },
    ],
    apresentacao: '5mg - 30 comprimidos',
    classeTerap: 'Sulfonilureia',
    retencaoReceita: 'Receita simples',
  },
  // ===== GASTRO =====
  {
    id: 'omeprazol-20',
    principioAtivo: 'Omeprazol',
    categoria: 'Antiulceroso',
    indicacao: 'Úlcera gástrica, refluxo, gastrite',
    referencia: { nome: 'Losec', laboratorio: 'AstraZeneca', preco: 58.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 12.90 },
      { laboratorio: 'Medley', preco: 13.50 },
      { laboratorio: 'Neo Química', preco: 11.90 },
      { laboratorio: 'Prati-Donaduzzi', preco: 12.20 },
    ],
    similar: [{ nome: 'Peprazol', laboratorio: 'Libbs', preco: 32.90 }],
    apresentacao: '20mg - 28 cápsulas',
    classeTerap: 'Inibidor de bomba de prótons (IBP)',
    retencaoReceita: 'Venda livre',
  },
  {
    id: 'pantoprazol-40',
    principioAtivo: 'Pantoprazol Sódico',
    categoria: 'Antiulceroso',
    indicacao: 'Úlcera, refluxo gastroesofágico, Zollinger-Ellison',
    referencia: { nome: 'Pantozol', laboratorio: 'Takeda', preco: 65.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 22.90 },
      { laboratorio: 'Medley', preco: 24.50 },
      { laboratorio: 'Eurofarma', preco: 21.90 },
    ],
    apresentacao: '40mg - 28 comprimidos',
    classeTerap: 'Inibidor de bomba de prótons (IBP)',
    retencaoReceita: 'Receita simples',
  },
  // ===== PSIQUIATRIA / SNC =====
  {
    id: 'fluoxetina-20',
    principioAtivo: 'Cloridrato de Fluoxetina',
    categoria: 'Antidepressivo',
    indicacao: 'Depressão, TOC, bulimia, ansiedade',
    referencia: { nome: 'Prozac', laboratorio: 'Eli Lilly', preco: 78.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 18.90 },
      { laboratorio: 'Medley', preco: 19.50 },
      { laboratorio: 'Neo Química', preco: 17.90 },
      { laboratorio: 'Eurofarma', preco: 20.50 },
    ],
    apresentacao: '20mg - 30 cápsulas',
    classeTerap: 'ISRS (Inibidor Seletivo da Recaptação de Serotonina)',
    retencaoReceita: 'Receita C1 (branca, 2 vias, retenção)',
  },
  {
    id: 'sertralina-50',
    principioAtivo: 'Cloridrato de Sertralina',
    categoria: 'Antidepressivo',
    indicacao: 'Depressão, TOC, pânico, TEPT, fobia social',
    referencia: { nome: 'Zoloft', laboratorio: 'Pfizer', preco: 85.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 22.90 },
      { laboratorio: 'Medley', preco: 24.50 },
      { laboratorio: 'Eurofarma', preco: 21.90 },
      { laboratorio: 'Torrent', preco: 20.90 },
    ],
    apresentacao: '50mg - 30 comprimidos',
    classeTerap: 'ISRS',
    retencaoReceita: 'Receita C1 (branca, 2 vias, retenção)',
  },
  {
    id: 'escitalopram-10',
    principioAtivo: 'Oxalato de Escitalopram',
    categoria: 'Antidepressivo',
    indicacao: 'Depressão, ansiedade generalizada, pânico',
    referencia: { nome: 'Lexapro', laboratorio: 'Lundbeck', preco: 115.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 35.90 },
      { laboratorio: 'Medley', preco: 38.50 },
      { laboratorio: 'Eurofarma', preco: 34.90 },
    ],
    apresentacao: '10mg - 30 comprimidos',
    classeTerap: 'ISRS',
    retencaoReceita: 'Receita C1 (branca, 2 vias, retenção)',
  },
  {
    id: 'clonazepam-2',
    principioAtivo: 'Clonazepam',
    categoria: 'Ansiolítico / Anticonvulsivante',
    indicacao: 'Ansiedade, epilepsia, pânico',
    referencia: { nome: 'Rivotril', laboratorio: 'Roche', preco: 22.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 8.90 },
      { laboratorio: 'Medley', preco: 9.50 },
      { laboratorio: 'Prati-Donaduzzi', preco: 8.20 },
    ],
    apresentacao: '2mg - 30 comprimidos',
    classeTerap: 'Benzodiazepínico',
    retencaoReceita: 'Receita B (azul, notificação especial)',
    observacoes: 'Controlado — pode causar dependência. Uso sob orientação médica.',
  },
  // ===== ALERGIA =====
  {
    id: 'loratadina-10',
    principioAtivo: 'Loratadina',
    categoria: 'Antialérgico',
    indicacao: 'Rinite alérgica, urticária, alergias',
    referencia: { nome: 'Claritin', laboratorio: 'Bayer', preco: 38.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 10.90 },
      { laboratorio: 'Medley', preco: 11.50 },
      { laboratorio: 'Neo Química', preco: 9.90 },
      { laboratorio: 'Cimed', preco: 10.20 },
    ],
    apresentacao: '10mg - 12 comprimidos',
    classeTerap: 'Anti-histamínico H1 (2ª geração)',
    retencaoReceita: 'Venda livre',
  },
  // ===== HORMONAL / TIREOIDE =====
  {
    id: 'levotiroxina-50',
    principioAtivo: 'Levotiroxina Sódica',
    categoria: 'Hormônio tireoidiano',
    indicacao: 'Hipotireoidismo',
    referencia: { nome: 'Puran T4', laboratorio: 'Sanofi', preco: 22.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 10.90 },
      { laboratorio: 'Merck', preco: 11.50 },
    ],
    similar: [{ nome: 'Euthyrox', laboratorio: 'Merck', preco: 18.90 }],
    apresentacao: '50mcg - 30 comprimidos',
    classeTerap: 'Hormônio tireoidiano sintético',
    retencaoReceita: 'Receita simples',
  },
  // ===== CONTRACEPTIVOS =====
  {
    id: 'etinilestradiol-levonorgestrel',
    principioAtivo: 'Etinilestradiol + Levonorgestrel',
    categoria: 'Contraceptivo oral',
    indicacao: 'Contracepção, regulação do ciclo menstrual',
    referencia: { nome: 'Ciclo 21', laboratorio: 'Biolab', preco: 8.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 4.90 },
      { laboratorio: 'Medley', preco: 5.20 },
    ],
    similar: [{ nome: 'Microvlar', laboratorio: 'Bayer', preco: 7.50 }],
    apresentacao: '0,03mg + 0,15mg - 21 comprimidos',
    classeTerap: 'Contraceptivo hormonal combinado',
    retencaoReceita: 'Receita simples',
  },
  // ===== DISFUNÇÃO ERÉTIL =====
  {
    id: 'sildenafila-50',
    principioAtivo: 'Citrato de Sildenafila',
    categoria: 'Disfunção erétil',
    indicacao: 'Disfunção erétil, hipertensão pulmonar',
    referencia: { nome: 'Viagra', laboratorio: 'Pfizer', preco: 89.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 18.90 },
      { laboratorio: 'Medley', preco: 20.50 },
      { laboratorio: 'Neo Química', preco: 17.90 },
      { laboratorio: 'Eurofarma', preco: 19.50 },
    ],
    apresentacao: '50mg - 4 comprimidos',
    classeTerap: 'Inibidor da PDE-5',
    retencaoReceita: 'Receita simples',
  },
  {
    id: 'tadalafila-20',
    principioAtivo: 'Tadalafila',
    categoria: 'Disfunção erétil',
    indicacao: 'Disfunção erétil, hiperplasia prostática benigna',
    referencia: { nome: 'Cialis', laboratorio: 'Eli Lilly', preco: 145.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 28.90 },
      { laboratorio: 'Medley', preco: 32.50 },
      { laboratorio: 'Neo Química', preco: 26.90 },
      { laboratorio: 'Eurofarma', preco: 30.50 },
    ],
    apresentacao: '20mg - 4 comprimidos',
    classeTerap: 'Inibidor da PDE-5',
    retencaoReceita: 'Receita simples',
    observacoes: 'Variação de até 1551% entre genéricos mais baratos e referência (Procon-SP 2025).',
  },
  // ===== RESPIRATÓRIO =====
  {
    id: 'salbutamol-spray',
    principioAtivo: 'Sulfato de Salbutamol',
    categoria: 'Broncodilatador',
    indicacao: 'Asma, broncoespasmo, DPOC',
    referencia: { nome: 'Aerolin Spray', laboratorio: 'GSK', preco: 32.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 15.90 },
      { laboratorio: 'Biosintética', preco: 16.50 },
    ],
    apresentacao: '100mcg/dose - 200 doses',
    classeTerap: 'Agonista beta-2 adrenérgico de curta duração',
    retencaoReceita: 'Receita simples',
  },
  // ===== DERMATOLOGIA =====
  {
    id: 'cetoconazol-creme',
    principioAtivo: 'Cetoconazol',
    categoria: 'Antifúngico tópico',
    indicacao: 'Micoses de pele, dermatite seborreica',
    referencia: { nome: 'Nizoral Creme', laboratorio: 'Johnson & Johnson', preco: 42.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 12.90 },
      { laboratorio: 'Medley', preco: 13.50 },
      { laboratorio: 'Neo Química', preco: 11.90 },
    ],
    apresentacao: '20mg/g - 30g creme',
    classeTerap: 'Antifúngico imidazólico',
    retencaoReceita: 'Venda livre',
  },
  // ===== CORTICOIDES =====
  {
    id: 'prednisona-20',
    principioAtivo: 'Prednisona',
    categoria: 'Corticosteroide',
    indicacao: 'Inflamações, alergias graves, doenças autoimunes',
    referencia: { nome: 'Meticorten', laboratorio: 'MSD', preco: 28.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 8.90 },
      { laboratorio: 'Medley', preco: 9.50 },
      { laboratorio: 'Prati-Donaduzzi', preco: 8.20 },
    ],
    apresentacao: '20mg - 10 comprimidos',
    classeTerap: 'Glicocorticoide',
    retencaoReceita: 'Receita simples',
  },
  // ===== ANTICOAGULANTE =====
  {
    id: 'varfarina-5',
    principioAtivo: 'Varfarina Sódica',
    categoria: 'Anticoagulante',
    indicacao: 'Prevenção de trombose, embolia pulmonar, fibrilação atrial',
    referencia: { nome: 'Marevan', laboratorio: 'Farmoquímica', preco: 18.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 7.90 },
      { laboratorio: 'Medley', preco: 8.50 },
    ],
    apresentacao: '5mg - 30 comprimidos',
    classeTerap: 'Antagonista da vitamina K',
    retencaoReceita: 'Receita simples',
    observacoes: 'Requer monitoramento regular do INR.',
  },
  // ===== PRÓSTATA =====
  {
    id: 'finasterida-5',
    principioAtivo: 'Finasterida',
    categoria: 'Inibidor da 5-alfa-redutase',
    indicacao: 'Hiperplasia prostática benigna, alopecia androgenética',
    referencia: { nome: 'Proscar', laboratorio: 'MSD', preco: 95.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 28.90 },
      { laboratorio: 'Medley', preco: 30.50 },
      { laboratorio: 'Neo Química', preco: 26.90 },
    ],
    apresentacao: '5mg - 30 comprimidos',
    classeTerap: 'Inibidor da 5-alfa-redutase',
    retencaoReceita: 'Receita simples',
  },
  // ===== ANTIPARASITÁRIO =====
  {
    id: 'ivermectina-6',
    principioAtivo: 'Ivermectina',
    categoria: 'Antiparasitário',
    indicacao: 'Verminoses, escabiose, pediculose',
    referencia: { nome: 'Revectina', laboratorio: 'Abbott', preco: 28.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 9.90 },
      { laboratorio: 'Medley', preco: 10.50 },
      { laboratorio: 'Vitamedic', preco: 8.90 },
    ],
    apresentacao: '6mg - 4 comprimidos',
    classeTerap: 'Antiparasitário de amplo espectro',
    retencaoReceita: 'Venda livre',
  },
  // ===== ANTIFÚNGICO ORAL =====
  {
    id: 'fluconazol-150',
    principioAtivo: 'Fluconazol',
    categoria: 'Antifúngico',
    indicacao: 'Candidíase vaginal, oral, sistêmica',
    referencia: { nome: 'Zoltec', laboratorio: 'Pfizer', preco: 32.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 8.90 },
      { laboratorio: 'Medley', preco: 9.50 },
      { laboratorio: 'Neo Química', preco: 7.90 },
    ],
    apresentacao: '150mg - 2 cápsulas',
    classeTerap: 'Antifúngico triazólico',
    retencaoReceita: 'Receita simples',
  },
  // ===== RELAXANTE MUSCULAR =====
  {
    id: 'ciclobenzaprina-10',
    principioAtivo: 'Cloridrato de Ciclobenzaprina',
    categoria: 'Relaxante muscular',
    indicacao: 'Espasmos musculares, dor lombar, torcicolo',
    referencia: { nome: 'Miosan', laboratorio: 'Apsen', preco: 42.90 },
    genericos: [
      { laboratorio: 'EMS', preco: 14.90 },
      { laboratorio: 'Medley', preco: 15.50 },
      { laboratorio: 'Neo Química', preco: 13.90 },
    ],
    apresentacao: '10mg - 15 comprimidos',
    classeTerap: 'Relaxante muscular de ação central',
    retencaoReceita: 'Receita simples',
  },
];

// ============================================================
// CATEGORIAS
// ============================================================
const CATEGORIAS = [
  'Todas',
  'Analgésico / Antipirético',
  'Anti-inflamatório',
  'Anti-inflamatório / Analgésico',
  'Antibiótico',
  'Anti-hipertensivo',
  'Antilipêmico',
  'Antiagregante plaquetário',
  'Antidiabético',
  'Antiulceroso',
  'Antidepressivo',
  'Ansiolítico / Anticonvulsivante',
  'Antialérgico',
  'Hormônio tireoidiano',
  'Contraceptivo oral',
  'Disfunção erétil',
  'Broncodilatador',
  'Antifúngico tópico',
  'Antifúngico',
  'Corticosteroide',
  'Anticoagulante',
  'Inibidor da 5-alfa-redutase',
  'Antiparasitário',
  'Relaxante muscular',
];

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================
export default function MedicineComparator() {
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todas');
  const [selecionado, setSelecionado] = useState<Medicamento | null>(null);
  const [ordenacao, setOrdenacao] = useState<'economia' | 'nome' | 'preco'>('economia');
  const [mostrarSoVendaLivre, setMostrarSoVendaLivre] = useState(false);

  const medicamentosFiltrados = useMemo(() => {
    let lista = [...MEDICAMENTOS_DB];

    if (busca.trim()) {
      const q = busca.toLowerCase();
      lista = lista.filter(
        (m) =>
          m.principioAtivo.toLowerCase().includes(q) ||
          m.referencia.nome.toLowerCase().includes(q) ||
          m.indicacao.toLowerCase().includes(q) ||
          m.categoria.toLowerCase().includes(q)
      );
    }

    if (categoriaFiltro !== 'Todas') {
      lista = lista.filter((m) => m.categoria === categoriaFiltro);
    }

    if (mostrarSoVendaLivre) {
      lista = lista.filter((m) => m.retencaoReceita === 'Venda livre');
    }

    // Ordenação
    lista.sort((a, b) => {
      if (ordenacao === 'economia') {
        const econA = calcEconomia(a);
        const econB = calcEconomia(b);
        return econB - econA;
      }
      if (ordenacao === 'nome') return a.principioAtivo.localeCompare(b.principioAtivo);
      if (ordenacao === 'preco') return menorGenerico(a) - menorGenerico(b);
      return 0;
    });

    return lista;
  }, [busca, categoriaFiltro, ordenacao, mostrarSoVendaLivre]);

  const calcEconomia = useCallback((m: Medicamento) => {
    const menor = Math.min(...m.genericos.map((g) => g.preco));
    return ((m.referencia.preco - menor) / m.referencia.preco) * 100;
  }, []);

  const menorGenerico = useCallback((m: Medicamento) => {
    return Math.min(...m.genericos.map((g) => g.preco));
  }, []);

  const formatBRL = (v: number) =>
    v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Estatísticas gerais
  const stats = useMemo(() => {
    const economias = MEDICAMENTOS_DB.map((m) => calcEconomia(m));
    const mediaEcon = economias.reduce((a, b) => a + b, 0) / economias.length;
    const maxEcon = Math.max(...economias);
    const medMaxEcon = MEDICAMENTOS_DB.find((m) => calcEconomia(m) === maxEcon);
    return {
      total: MEDICAMENTOS_DB.length,
      mediaEconomia: mediaEcon.toFixed(1),
      maxEconomia: maxEcon.toFixed(1),
      medMaxEconomia: medMaxEcon?.principioAtivo || '',
    };
  }, [calcEconomia]);

  // ============================================================
  // RENDER — DETALHE DO MEDICAMENTO
  // ============================================================
  if (selecionado) {
    const m = selecionado;
    const menorG = Math.min(...m.genericos.map((g) => g.preco));
    const economia = ((m.referencia.preco - menorG) / m.referencia.preco) * 100;
    const economiaValor = m.referencia.preco - menorG;

    return (
      <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
        {/* Header */}
        <button
          onClick={() => setSelecionado(null)}
          style={{
            background: 'rgba(16,185,129,0.15)',
            border: '1px solid rgba(16,185,129,0.3)',
            color: '#10b981',
            padding: '8px 16px',
            borderRadius: 8,
            cursor: 'pointer',
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          ← Voltar à lista
        </button>

        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(59,130,246,0.1))',
            borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            border: '1px solid rgba(16,185,129,0.2)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 28, color: '#10b981' }}>{m.principioAtivo}</h2>
          <p style={{ margin: '8px 0 0', opacity: 0.7, fontSize: 14 }}>
            {m.categoria} — {m.apresentacao}
          </p>
          <p style={{ margin: '4px 0 0', opacity: 0.8, fontSize: 15 }}>
            <strong>Indicação:</strong> {m.indicacao}
          </p>
          <p style={{ margin: '4px 0 0', opacity: 0.7, fontSize: 13 }}>
            <strong>Classe terapêutica:</strong> {m.classeTerap}
          </p>
          <p style={{ margin: '4px 0 0', opacity: 0.7, fontSize: 13 }}>
            <strong>Receita:</strong> {m.retencaoReceita}
          </p>
          {m.observacoes && (
            <p
              style={{
                margin: '8px 0 0',
                padding: '8px 12px',
                background: 'rgba(245,158,11,0.15)',
                borderRadius: 8,
                fontSize: 13,
                color: '#f59e0b',
              }}
            >
              ⚠ {m.observacoes}
            </p>
          )}
        </div>

        {/* Economia destaque */}
        <div
          style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            borderRadius: 16,
            padding: 24,
            textAlign: 'center',
            marginBottom: 24,
            color: '#fff',
          }}
        >
          <div style={{ fontSize: 14, opacity: 0.9 }}>Economia com Genérico</div>
          <div style={{ fontSize: 48, fontWeight: 800, lineHeight: 1.1 }}>
            {economia.toFixed(0)}%
          </div>
          <div style={{ fontSize: 16, opacity: 0.9 }}>
            Você economiza até <strong>{formatBRL(economiaValor)}</strong> por compra
          </div>
        </div>

        {/* Comparação visual */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {/* Referência */}
          <div
            style={{
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: '#ef4444',
                marginBottom: 8,
              }}
            >
              Referência (Marca)
            </div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{m.referencia.nome}</div>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 12 }}>
              {m.referencia.laboratorio}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#ef4444' }}>
              {formatBRL(m.referencia.preco)}
            </div>
          </div>

          {/* Genérico mais barato */}
          <div
            style={{
              background: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.3)',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 1,
                color: '#10b981',
                marginBottom: 8,
              }}
            >
              Genérico Mais Barato
            </div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>
              {m.genericos.find((g) => g.preco === menorG)?.laboratorio}
            </div>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 12 }}>
              Genérico — {m.principioAtivo}
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#10b981' }}>
              {formatBRL(menorG)}
            </div>
          </div>
        </div>

        {/* Barra de economia visual */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, marginBottom: 8, opacity: 0.7 }}>
            Comparação visual de preço
          </div>
          <div style={{ position: 'relative', height: 40, borderRadius: 8, overflow: 'hidden' }}>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(239,68,68,0.2)',
                borderRadius: 8,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${(menorG / m.referencia.preco) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #059669)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                paddingLeft: 12,
                fontSize: 13,
                fontWeight: 600,
                color: '#fff',
              }}
            >
              Genérico: {formatBRL(menorG)}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 12,
              marginTop: 4,
              opacity: 0.5,
            }}
          >
            <span>R$ 0</span>
            <span>Referência: {formatBRL(m.referencia.preco)}</span>
          </div>
        </div>

        {/* Todos os genéricos */}
        <h3 style={{ fontSize: 18, marginBottom: 12 }}>
          Todos os Genéricos Disponíveis ({m.genericos.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {[...m.genericos]
            .sort((a, b) => a.preco - b.preco)
            .map((g, i) => {
              const econ = ((m.referencia.preco - g.preco) / m.referencia.preco) * 100;
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 16px',
                    background: i === 0 ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.05)',
                    borderRadius: 10,
                    border: i === 0 ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>
                      {g.laboratorio}
                      {i === 0 && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: 11,
                            background: '#10b981',
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: 4,
                          }}
                        >
                          MELHOR PREÇO
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.6 }}>
                      Economia de {econ.toFixed(1)}% vs referência
                    </div>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#10b981' }}>
                    {formatBRL(g.preco)}
                  </div>
                </div>
              );
            })}
        </div>

        {/* Similares */}
        {m.similar && m.similar.length > 0 && (
          <>
            <h3 style={{ fontSize: 18, marginBottom: 12 }}>Similares Intercambiáveis</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
              {m.similar.map((s, i) => {
                const econ = ((m.referencia.preco - s.preco) / m.referencia.preco) * 100;
                return (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 16px',
                      background: 'rgba(59,130,246,0.1)',
                      borderRadius: 10,
                      border: '1px solid rgba(59,130,246,0.2)',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        {s.nome}{' '}
                        <span style={{ fontSize: 12, opacity: 0.6 }}>({s.laboratorio})</span>
                      </div>
                      <div style={{ fontSize: 12, opacity: 0.6 }}>
                        Economia de {econ.toFixed(1)}% vs referência
                      </div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#3b82f6' }}>
                      {formatBRL(s.preco)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Disclaimer */}
        <div
          style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.2)',
            borderRadius: 12,
            padding: 16,
            fontSize: 12,
            opacity: 0.8,
          }}
        >
          <strong>Aviso importante:</strong> Os preços são valores médios de referência (PMC com ICMS
          18%) e podem variar conforme a região, farmácia e estado. Consulte sempre um médico ou
          farmacêutico antes de substituir medicamentos. Dados baseados na tabela CMED/ANVISA e
          pesquisas Procon-SP 2024/2025.
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER — LISTA PRINCIPAL
  // ============================================================
  return (
    <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>💊</div>
        <h1 style={{ fontSize: 28, margin: 0, fontWeight: 800 }}>
          Comparador de Medicamentos
        </h1>
        <p style={{ opacity: 0.7, fontSize: 15, marginTop: 8 }}>
          Compare preços de medicamentos genéricos vs. referência (marca) e descubra quanto você
          pode economizar
        </p>
      </div>

      {/* Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
            border: '1px solid rgba(16,185,129,0.2)',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>{stats.total}</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Medicamentos</div>
        </div>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(59,130,246,0.05))',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
            border: '1px solid rgba(59,130,246,0.2)',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 800, color: '#3b82f6' }}>
            {stats.mediaEconomia}%
          </div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Economia Média</div>
        </div>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
            border: '1px solid rgba(168,85,247,0.2)',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 800, color: '#a855f7' }}>
            {stats.maxEconomia}%
          </div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Maior Economia</div>
        </div>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
            borderRadius: 12,
            padding: 16,
            textAlign: 'center',
            border: '1px solid rgba(245,158,11,0.2)',
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 800, color: '#f59e0b' }}>ANVISA</div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Fonte: CMED 2025</div>
        </div>
      </div>

      {/* Info banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.1))',
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          border: '1px solid rgba(16,185,129,0.2)',
          fontSize: 14,
        }}
      >
        <strong>Você sabia?</strong> Segundo o Conselho Federal de Farmácia (CFF), medicamentos
        genéricos são em média <strong style={{ color: '#10b981' }}>66,83% mais baratos</strong> que
        os de referência. A ANVISA garante que genéricos têm a mesma eficácia, segurança e qualidade
        do medicamento de marca.
      </div>

      {/* Busca e filtros */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Buscar por nome, princípio ativo ou indicação..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          style={{
            flex: 1,
            minWidth: 250,
            padding: '12px 16px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.05)',
            color: 'inherit',
            fontSize: 14,
            outline: 'none',
          }}
        />
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.05)',
            color: 'inherit',
            fontSize: 14,
            cursor: 'pointer',
          }}
        >
          {CATEGORIAS.map((c) => (
            <option key={c} value={c} style={{ background: '#1a1a2e' }}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {(['economia', 'nome', 'preco'] as const).map((o) => (
            <button
              key={o}
              onClick={() => setOrdenacao(o)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: ordenacao === o ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
                background: ordenacao === o ? 'rgba(16,185,129,0.2)' : 'transparent',
                color: ordenacao === o ? '#10b981' : 'inherit',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              {o === 'economia' ? '% Economia' : o === 'nome' ? 'A-Z' : 'Menor Preço'}
            </button>
          ))}
        </div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            cursor: 'pointer',
            opacity: 0.8,
          }}
        >
          <input
            type="checkbox"
            checked={mostrarSoVendaLivre}
            onChange={(e) => setMostrarSoVendaLivre(e.target.checked)}
            style={{ accentColor: '#10b981' }}
          />
          Somente venda livre (sem receita)
        </label>
        <span style={{ fontSize: 13, opacity: 0.5, marginLeft: 'auto' }}>
          {medicamentosFiltrados.length} resultado(s)
        </span>
      </div>

      {/* Lista de medicamentos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {medicamentosFiltrados.map((m) => {
          const menorG = Math.min(...m.genericos.map((g) => g.preco));
          const economia = ((m.referencia.preco - menorG) / m.referencia.preco) * 100;
          const economiaValor = m.referencia.preco - menorG;

          return (
            <div
              key={m.id}
              onClick={() => setSelecionado(m)}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '16px 20px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: 16,
                alignItems: 'center',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(16,185,129,0.4)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(16,185,129,0.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 18, fontWeight: 700 }}>{m.principioAtivo}</span>
                  <span
                    style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 4,
                      background: 'rgba(59,130,246,0.15)',
                      color: '#3b82f6',
                    }}
                  >
                    {m.referencia.nome}
                  </span>
                  {m.retencaoReceita === 'Venda livre' && (
                    <span
                      style={{
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 4,
                        background: 'rgba(16,185,129,0.15)',
                        color: '#10b981',
                      }}
                    >
                      SEM RECEITA
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 13, opacity: 0.6, marginTop: 4 }}>
                  {m.indicacao} — {m.apresentacao}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 13 }}>
                  <span>
                    Referência:{' '}
                    <span style={{ textDecoration: 'line-through', color: '#ef4444' }}>
                      {formatBRL(m.referencia.preco)}
                    </span>
                  </span>
                  <span>
                    Genérico:{' '}
                    <strong style={{ color: '#10b981' }}>{formatBRL(menorG)}</strong>
                  </span>
                  <span style={{ opacity: 0.6 }}>{m.genericos.length} opções</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', minWidth: 100 }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: economia > 60 ? '#10b981' : economia > 40 ? '#3b82f6' : '#f59e0b',
                    lineHeight: 1,
                  }}
                >
                  {economia.toFixed(0)}%
                </div>
                <div style={{ fontSize: 11, opacity: 0.6 }}>economia</div>
                <div style={{ fontSize: 12, color: '#10b981', fontWeight: 600, marginTop: 2 }}>
                  -{formatBRL(economiaValor)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {medicamentosFiltrados.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, opacity: 0.5 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🔍</div>
          <p>Nenhum medicamento encontrado com os filtros selecionados.</p>
          <p style={{ fontSize: 13 }}>Tente buscar por outro nome ou altere os filtros.</p>
        </div>
      )}

      {/* Footer disclaimer */}
      <div
        style={{
          marginTop: 32,
          padding: 16,
          background: 'rgba(245,158,11,0.08)',
          borderRadius: 12,
          fontSize: 12,
          opacity: 0.7,
          border: '1px solid rgba(245,158,11,0.15)',
        }}
      >
        <strong>Aviso legal:</strong> Este comparador é uma ferramenta informativa. Os preços são
        valores médios de referência (PMC com ICMS 18%) baseados na tabela CMED/ANVISA e pesquisas
        do Procon-SP (2024/2025). Preços reais podem variar conforme farmácia, região e promoções.
        Nunca substitua um medicamento sem orientação do seu médico ou farmacêutico. Medicamentos
        genéricos são aprovados pela ANVISA com testes de bioequivalência que garantem a mesma
        eficácia do medicamento de referência.
      </div>
    </div>
  );
}
