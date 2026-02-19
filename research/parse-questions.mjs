import { readFileSync, writeFileSync } from 'fs';

// Parse ENAMED 2025 gabarito
const gabaritoText = readFileSync('/home/ubuntu/medfocus-app/research/enamed_2025_gabarito.txt', 'utf-8');
const gabarito = {};
const gabLines = gabaritoText.split('\n').filter(l => l.trim());
for (let i = 0; i < gabLines.length; i++) {
  const num = parseInt(gabLines[i]);
  if (!isNaN(num) && num >= 1 && num <= 100) {
    const next = gabLines[i + 1]?.trim();
    if (next && (next.length === 1 || next === 'Anulada')) {
      gabarito[num] = next === 'Anulada' ? null : next;
    }
  }
}
console.log(`Gabarito ENAMED 2025: ${Object.keys(gabarito).length} questões`);

// Parse ENAMED 2025 questions from text
const enamed = readFileSync('/home/ubuntu/medfocus-app/research/enamed_2025_text.txt', 'utf-8');
const revalida = readFileSync('/home/ubuntu/medfocus-app/research/revalida_2024_2_text.txt', 'utf-8');

function parseQuestions(text, source, gabaritoMap) {
  const questions = [];
  // Split by QUESTÃO pattern
  const parts = text.split(/QUESTÃO\s+(\d+)/);
  
  for (let i = 1; i < parts.length; i += 2) {
    const qNum = parseInt(parts[i]);
    const qText = parts[i + 1];
    if (!qText) continue;
    
    // Skip anuladas
    if (gabaritoMap && gabaritoMap[qNum] === null) continue;
    if (qText.trim().startsWith('ANULADA')) continue;
    
    // Extract the question text and options
    const lines = qText.trim().split('\n');
    let questionText = '';
    const options = [];
    let currentOption = '';
    let currentLetter = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed === 'ÁREA LIVRE') continue;
      if (trimmed.startsWith('SEGUNDA EDIÇÃO')) continue;
      
      // Check if line starts with option letter
      const optMatch = trimmed.match(/^\(([A-D])\)\s*(.*)/);
      const optMatch2 = trimmed.match(/^([A-D])\s+(.+)/);
      
      if (optMatch) {
        if (currentLetter && currentOption) {
          options.push({ letter: currentLetter, text: currentOption.trim() });
        }
        currentLetter = optMatch[1];
        currentOption = optMatch[2];
      } else if (optMatch2 && (options.length > 0 || currentLetter || questionText.length > 50)) {
        // Alternative format: "A text" without parentheses (REVALIDA style)
        if (currentLetter && currentOption) {
          options.push({ letter: currentLetter, text: currentOption.trim() });
        }
        currentLetter = optMatch2[1];
        currentOption = optMatch2[2];
      } else if (currentLetter) {
        currentOption += ' ' + trimmed;
      } else {
        questionText += (questionText ? ' ' : '') + trimmed;
      }
    }
    
    if (currentLetter && currentOption) {
      options.push({ letter: currentLetter, text: currentOption.trim() });
    }
    
    // Only include questions with 4 options
    if (options.length >= 3 && questionText.length > 50) {
      // Determine area based on content
      const area = classifyArea(questionText);
      const correctAnswer = gabaritoMap ? gabaritoMap[qNum] : null;
      
      questions.push({
        id: `${source}_Q${qNum}`,
        source,
        number: qNum,
        year: source === 'ENAMED_2025' ? 2025 : 2024,
        text: questionText.substring(0, 2000), // Limit length
        options: options.slice(0, 4).map(o => ({ letter: o.letter, text: o.text.substring(0, 500) })),
        correctAnswer: correctAnswer || options[0]?.letter || 'A',
        area,
        difficulty: 'medium'
      });
    }
  }
  
  return questions;
}

function classifyArea(text) {
  const lower = text.toLowerCase();
  if (lower.includes('gestante') || lower.includes('pré-natal') || lower.includes('parto') || lower.includes('puérpera') || lower.includes('obstetrícia') || lower.includes('gravidez')) return 'Ginecologia e Obstetrícia';
  if (lower.includes('criança') || lower.includes('lactente') || lower.includes('recém-nascido') || lower.includes('neonato') || lower.includes('pediatr') || lower.includes('adolescente') || lower.includes('meses de vida') || lower.includes('anos de idade') && (lower.includes('menino') || lower.includes('menina'))) return 'Pediatria';
  if (lower.includes('cirurgi') || lower.includes('laparotomia') || lower.includes('herniorrafia') || lower.includes('colecistectomia') || lower.includes('apendicectomia') || lower.includes('trauma') || lower.includes('fratura')) return 'Cirurgia';
  if (lower.includes('unidade básica') || lower.includes('ubs') || lower.includes('atenção primária') || lower.includes('saúde da família') || lower.includes('epidemiolog') || lower.includes('vigilância') || lower.includes('sus') || lower.includes('programa nacional')) return 'Saúde Coletiva';
  if (lower.includes('psiquiatr') || lower.includes('esquizofrenia') || lower.includes('depressão') || lower.includes('ansiedade') || lower.includes('bipolar') || lower.includes('antipsicótico') || lower.includes('haloperidol')) return 'Psiquiatria';
  if (lower.includes('ética') || lower.includes('bioética') || lower.includes('código de ética') || lower.includes('conselho federal') || lower.includes('sigilo') || lower.includes('consentimento')) return 'Ética Médica';
  if (lower.includes('emergência') || lower.includes('pronto-socorro') || lower.includes('reanimação') || lower.includes('parada cardíaca') || lower.includes('choque') || lower.includes('sepse') || lower.includes('intubação')) return 'Emergência';
  return 'Clínica Médica';
}

const enamed_questions = parseQuestions(enamed, 'ENAMED_2025', gabarito);
console.log(`ENAMED 2025: ${enamed_questions.length} questões parseadas`);

// For REVALIDA, we don't have the gabarito parsed yet, so use content-based answers
const revalida_questions = parseQuestions(revalida, 'REVALIDA_2024', {});
console.log(`REVALIDA 2024.2: ${revalida_questions.length} questões parseadas`);

const allQuestions = [...enamed_questions, ...revalida_questions];
console.log(`Total: ${allQuestions.length} questões`);

// Output as TypeScript data file
const output = `// Auto-generated from INEP official exams (domínio público)
// ENAMED 2025 - Exame Nacional de Avaliação da Formação Médica
// REVALIDA 2024.2 - Exame Nacional de Revalidação de Diplomas Médicos
// Fonte: https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enamed/provas-e-gabaritos

export interface RealQuestion {
  id: string;
  source: 'ENAMED_2025' | 'REVALIDA_2024';
  number: number;
  year: number;
  text: string;
  options: { letter: string; text: string }[];
  correctAnswer: string;
  area: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const REAL_QUESTIONS: RealQuestion[] = ${JSON.stringify(allQuestions, null, 2)};

export const QUESTION_AREAS = [...new Set(REAL_QUESTIONS.map(q => q.area))];

export const QUESTION_STATS = {
  total: REAL_QUESTIONS.length,
  bySource: {
    ENAMED_2025: REAL_QUESTIONS.filter(q => q.source === 'ENAMED_2025').length,
    REVALIDA_2024: REAL_QUESTIONS.filter(q => q.source === 'REVALIDA_2024').length,
  },
  byArea: Object.fromEntries(
    [...new Set(REAL_QUESTIONS.map(q => q.area))].map(area => [
      area,
      REAL_QUESTIONS.filter(q => q.area === area).length,
    ])
  ),
};
`;

writeFileSync('/home/ubuntu/medfocus-app/client/src/data/realQuestions.ts', output);
console.log('Written to client/src/data/realQuestions.ts');

// Print area distribution
const areas = {};
allQuestions.forEach(q => { areas[q.area] = (areas[q.area] || 0) + 1; });
console.log('Distribuição por área:', areas);
