#!/usr/bin/env node

/**
 * MedFocus PhD - Mock Data Generator
 * Generates sample data for local development and testing
 */

const fs = require('fs');
const path = require('path');

// Utility to create directories if they don't exist
const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Mock data generators
const generateMockDrugs = (count = 100) => {
  const drugs = [];
  const drugNames = [
    'Amoxicilina', 'Dipirona', 'Paracetamol', 'Ibuprofeno', 'Losartana',
    'Atenolol', 'Metformina', 'Sinvastatina', 'Omeprazol', 'Captopril',
    'Enalapril', 'Propranolol', 'Hidroclorotiazida', 'Furosemida', 'Espironolactona',
    'Levotiroxina', 'Insulina NPH', 'Insulina Regular', 'Glibenclamida', 'Metoclopramida'
  ];

  for (let i = 0; i < count; i++) {
    const name = drugNames[i % drugNames.length];
    const suffix = i >= drugNames.length ? ` ${Math.floor(i / drugNames.length)}` : '';
    
    drugs.push({
      id: `drug_${i + 1}`,
      active_ingredient: `${name}${suffix}`,
      commercial_name: `${name}${suffix} Pharma`,
      dosage: ['500mg', '250mg', '100mg', '50mg'][i % 4],
      presentation: ['Comprimido', 'Cápsula', 'Solução Oral', 'Injetável'][i % 4],
      manufacturer: ['Eurofarma', 'Cimed', 'EMS', 'Neo Química', 'Aché'][i % 5],
      anvisa_registry: `1.0000.${1000 + i}`,
      price_cmed: (10 + (i * 2.5)).toFixed(2),
      evidence_level: (i % 5) + 1, // Oxford 1-5
      indication: 'Tratamento conforme indicação médica',
      contraindications: ['Hipersensibilidade ao princípio ativo'],
      side_effects: ['Náusea', 'Cefaleia', 'Sonolência'],
      interactions: [],
      phd_notes: `Nota técnica sobre ${name}. Evidência clínica disponível.`,
      student_hacks: [`Dica: ${name} é mais eficaz quando...`],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  return drugs;
};

const generateMockDiseases = (count = 50) => {
  const diseases = [];
  const diseaseNames = [
    { name: 'Hipertensão Arterial', cid: 'I10' },
    { name: 'Diabetes Mellitus Tipo 2', cid: 'E11' },
    { name: 'Insuficiência Cardíaca', cid: 'I50' },
    { name: 'DPOC', cid: 'J44' },
    { name: 'Pneumonia', cid: 'J18' },
    { name: 'Infecção Urinária', cid: 'N39.0' },
    { name: 'Gastrite', cid: 'K29' },
    { name: 'Asma', cid: 'J45' },
    { name: 'Ansiedade', cid: 'F41' },
    { name: 'Depressão', cid: 'F32' }
  ];

  for (let i = 0; i < count; i++) {
    const disease = diseaseNames[i % diseaseNames.length];
    
    diseases.push({
      id: `disease_${i + 1}`,
      name: disease.name,
      cid10: disease.cid,
      category: ['Cardiovascular', 'Endócrino', 'Respiratório', 'Neurológico', 'Gastrointestinal'][i % 5],
      layers: {
        emergency: {
          title: 'Conduta de Plantão',
          protocol: 'ABC, estabilização, exames iniciais',
          red_flags: ['Instabilidade hemodinâmica', 'Alteração de consciência'],
          first_line_treatment: 'Suporte vital e tratamento sintomático'
        },
        specialist: {
          title: 'Abordagem do Especialista',
          diagnostic_criteria: 'Critérios diagnósticos conforme guidelines',
          treatment_algorithm: 'Protocolo escalonado',
          follow_up: 'Reavaliação periódica conforme indicação'
        },
        phd_frontier: {
          title: 'Fronteira do Conhecimento',
          latest_trials: ['Ensaio clínico fase III 2025', 'Meta-análise Cochrane 2024'],
          controversies: 'Debate sobre nova terapia',
          future_directions: 'Terapias em investigação'
        }
      },
      collaboration: {
        last_update: new Date().toISOString(),
        contributors: ['Prof. Dr. João Silva', 'Dra. Maria Santos'],
        upvotes: Math.floor(Math.random() * 100),
        status: 'validated'
      },
      references: [
        {
          type: 'gold',
          title: 'NEJM 2024 - Clinical Trial',
          url: 'https://pubmed.example.com/12345',
          citation_count: 250
        }
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }

  return diseases;
};

const generateMockCalculators = (count = 50) => {
  const calculators = [];
  const calcNames = [
    'CHA2DS2-VASc (Risco de AVC em FA)',
    'GRACE Score (Risco em SCA)',
    'CURB-65 (Severidade de Pneumonia)',
    'Child-Pugh (Cirrose Hepática)',
    'Glasgow (Nível de Consciência)',
    'APACHE II (Gravidade em UTI)',
    'MELD Score (Insuficiência Hepática)',
    'TIMI Risk Score (Infarto)',
    'Wells Score (Tromboembolismo)',
    'HAS-BLED (Risco de Sangramento)'
  ];

  for (let i = 0; i < count; i++) {
    const name = calcNames[i % calcNames.length];
    
    calculators.push({
      id: `calc_${i + 1}`,
      name: name,
      category: ['Cardiologia', 'Pneumologia', 'Neurologia', 'Emergência', 'UTI'][i % 5],
      description: `Calculadora para ${name}`,
      formula: 'score = sum(factors)',
      inputs: [
        { name: 'factor1', type: 'number', label: 'Fator 1', min: 0, max: 10 },
        { name: 'factor2', type: 'select', label: 'Fator 2', options: ['Sim', 'Não'] }
      ],
      interpretation: [
        { range: '0-2', risk: 'Baixo', color: 'green' },
        { range: '3-4', risk: 'Moderado', color: 'yellow' },
        { range: '5+', risk: 'Alto', color: 'red' }
      ],
      references: ['Guideline XYZ 2024'],
      usage_count: Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString()
    });
  }

  return calculators;
};

const generateMockGuidelines = (count = 30) => {
  const guidelines = [];
  const societies = ['SBC', 'SBPT', 'SBD', 'SBN', 'SBEM'];
  const topics = ['Hipertensão', 'Diabetes', 'DPOC', 'Pneumonia', 'AVC'];

  for (let i = 0; i < count; i++) {
    guidelines.push({
      id: `guideline_${i + 1}`,
      title: `Diretriz ${societies[i % societies.length]} - ${topics[i % topics.length]} ${2020 + (i % 5)}`,
      society: societies[i % societies.length],
      year: 2020 + (i % 5),
      version: `${1 + (i % 3)}.0`,
      topic: topics[i % topics.length],
      summary: 'Resumo das principais recomendações',
      key_points: [
        'Recomendação Classe I, Nível A',
        'Nova abordagem terapêutica',
        'Algoritmo de tratamento atualizado'
      ],
      pdf_url: `https://storage.example.com/guidelines/guideline_${i + 1}.pdf`,
      parsed_content: 'Conteúdo extraído via Document AI',
      status: 'parsed',
      created_at: new Date().toISOString()
    });
  }

  return guidelines;
};

// Main execution
console.log('🚀 Generating mock data for MedFocus PhD...\n');

const dataDir = path.join(__dirname, '..', 'data', 'mock-data');
ensureDir(dataDir);

// Generate and save each dataset
const datasets = [
  { name: 'drugs', generator: generateMockDrugs, count: 100 },
  { name: 'diseases', generator: generateMockDiseases, count: 50 },
  { name: 'calculators', generator: generateMockCalculators, count: 50 },
  { name: 'guidelines', generator: generateMockGuidelines, count: 30 }
];

datasets.forEach(({ name, generator, count }) => {
  console.log(`📝 Generating ${count} ${name}...`);
  const data = generator(count);
  const filePath = path.join(dataDir, `${name}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Saved to ${filePath}\n`);
});

// Generate summary file
const summary = {
  generated_at: new Date().toISOString(),
  total_items: datasets.reduce((sum, ds) => sum + ds.count, 0),
  datasets: datasets.map(ds => ({
    name: ds.name,
    count: ds.count,
    file: `${ds.name}.json`
  }))
};

const summaryPath = path.join(dataDir, 'summary.json');
fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));

console.log('✨ Mock data generation complete!');
console.log(`📊 Total items: ${summary.total_items}`);
console.log(`📁 Location: ${dataDir}\n`);
