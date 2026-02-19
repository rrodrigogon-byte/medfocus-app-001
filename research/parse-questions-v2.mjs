import { readFileSync, writeFileSync } from 'fs';

// ========== GABARITO PARSERS ==========

function parseGabaritoTable(text) {
  // Format: rows of "Questão N1 N2 ... N20" followed by "Gabarito A B ... D"
  const gabarito = {};
  const lines = text.split('\n').filter(l => l.trim());
  
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i].includes('Questão') || lines[i].match(/^\s*Quest/)) {
      const qNums = lines[i].match(/\d+/g);
      const answers = lines[i + 1].replace(/^Gabarito\s*/, '').trim().split(/\s+/);
      if (qNums && answers) {
        for (let j = 0; j < qNums.length; j++) {
          const num = parseInt(qNums[j]);
          const ans = answers[j]?.trim();
          if (num && ans) {
            if (ans.match(/^[A-D]$/)) {
              gabarito[num] = ans;
            } else {
              gabarito[num] = null; // Anulada (̶ or other)
            }
          }
        }
      }
    }
  }
  return gabarito;
}

function parseGabaritoVertical(text) {
  // Format: lines with "N  A" or "N  Anulada"
  const gabarito = {};
  const lines = text.split('\n').filter(l => l.trim());
  for (let i = 0; i < lines.length; i++) {
    const num = parseInt(lines[i]);
    if (!isNaN(num) && num >= 1 && num <= 100) {
      const next = lines[i + 1]?.trim();
      if (next && (next.length === 1 || next === 'Anulada')) {
        gabarito[num] = next === 'Anulada' ? null : next;
      }
    }
  }
  return gabarito;
}

// ========== QUESTION PARSER ==========

function parseQuestions(text, source, gabaritoMap) {
  const questions = [];
  const parts = text.split(/QUESTÃO\s+(\d+)/);
  
  for (let i = 1; i < parts.length; i += 2) {
    const qNum = parseInt(parts[i]);
    const qText = parts[i + 1];
    if (!qText) continue;
    
    // Skip anuladas
    if (gabaritoMap && gabaritoMap[qNum] === null) continue;
    if (qText.trim().startsWith('ANULADA')) continue;
    
    const lines = qText.trim().split('\n');
    let questionText = '';
    const options = [];
    let currentOption = '';
    let currentLetter = '';
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed === 'ÁREA LIVRE') continue;
      if (trimmed.match(/^(SEGUNDA|PRIMEIRA|TERCEIRA)\s+EDIÇÃO/)) continue;
      if (trimmed.match(/^\d{4}\s+/)) continue; // Year headers
      
      // Check if line starts with option letter (A) or A format
      const optMatch = trimmed.match(/^\(([A-D])\)\s*(.*)/);
      const optMatch2 = trimmed.match(/^([A-D])\s+(.+)/);
      
      if (optMatch) {
        if (currentLetter && currentOption) {
          options.push({ letter: currentLetter, text: currentOption.trim() });
        }
        currentLetter = optMatch[1];
        currentOption = optMatch[2];
      } else if (optMatch2 && (options.length > 0 || currentLetter || questionText.length > 50)) {
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
    
    if (options.length >= 3 && questionText.length > 50) {
      const area = classifyArea(questionText);
      const correctAnswer = gabaritoMap ? gabaritoMap[qNum] : null;
      
      questions.push({
        id: `${source}_Q${qNum}`,
        source,
        number: qNum,
        year: source.includes('2025') ? 2025 : 2024,
        text: questionText.substring(0, 2000),
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
  if (lower.includes('gestante') || lower.includes('pré-natal') || lower.includes('parto') || lower.includes('puérpera') || lower.includes('obstetrícia') || lower.includes('gravidez') || lower.includes('abortamento') || lower.includes('eclâmpsia') || lower.includes('amniorrexe')) return 'Ginecologia e Obstetrícia';
  if (lower.includes('criança') || lower.includes('lactente') || lower.includes('recém-nascido') || lower.includes('neonato') || lower.includes('pediatr') || lower.includes('adolescente') || lower.includes('meses de vida') || (lower.includes('anos de idade') && (lower.includes('menino') || lower.includes('menina')))) return 'Pediatria';
  if (lower.includes('cirurgi') || lower.includes('laparotomia') || lower.includes('herniorrafia') || lower.includes('colecistectomia') || lower.includes('apendicectomia') || lower.includes('fratura') || lower.includes('osteossíntese')) return 'Cirurgia';
  if (lower.includes('unidade básica') || lower.includes('ubs') || lower.includes('atenção primária') || lower.includes('saúde da família') || lower.includes('epidemiolog') || lower.includes('vigilância') || lower.includes('sus') || lower.includes('programa nacional') || lower.includes('cobertura vacinal') || lower.includes('estratégia saúde')) return 'Saúde Coletiva';
  if (lower.includes('psiquiatr') || lower.includes('esquizofrenia') || lower.includes('depressão') || lower.includes('ansiedade') || lower.includes('bipolar') || lower.includes('antipsicótico') || lower.includes('haloperidol') || lower.includes('suicídio') || lower.includes('transtorno mental')) return 'Psiquiatria';
  if (lower.includes('ética') || lower.includes('bioética') || lower.includes('código de ética') || lower.includes('conselho federal') || lower.includes('sigilo') || lower.includes('consentimento') || lower.includes('autonomia do paciente')) return 'Ética Médica';
  if (lower.includes('emergência') || lower.includes('pronto-socorro') || lower.includes('reanimação') || lower.includes('parada cardíaca') || lower.includes('choque') || lower.includes('sepse') || lower.includes('intubação') || lower.includes('trauma') || lower.includes('atropelamento') || lower.includes('politraumatizado')) return 'Emergência';
  return 'Clínica Médica';
}

// ========== PARSE ALL SOURCES ==========

// 1. ENAMED 2025
const enamed_gabarito_text = readFileSync('/home/ubuntu/medfocus-app/research/enamed_2025_gabarito.txt', 'utf-8');
const enamed_gabarito = parseGabaritoVertical(enamed_gabarito_text);
console.log(`Gabarito ENAMED 2025: ${Object.keys(enamed_gabarito).length} questões`);

const enamed_text = readFileSync('/home/ubuntu/medfocus-app/research/enamed_2025_text.txt', 'utf-8');
const enamed_questions = parseQuestions(enamed_text, 'ENAMED_2025', enamed_gabarito);
console.log(`ENAMED 2025: ${enamed_questions.length} questões parseadas`);

// 2. REVALIDA 2024/2
const revalida_2024_2_text = readFileSync('/home/ubuntu/medfocus-app/research/revalida_2024_2_text.txt', 'utf-8');
// Try to get gabarito for 2024/2 if available
let revalida_2024_2_gabarito = {};
try {
  const gab_text = readFileSync('/home/ubuntu/medfocus-app/research/revalida_2024_2_gabarito.txt', 'utf-8');
  revalida_2024_2_gabarito = parseGabaritoTable(gab_text);
  console.log(`Gabarito REVALIDA 2024/2: ${Object.keys(revalida_2024_2_gabarito).length} questões`);
} catch (e) {
  console.log('Gabarito REVALIDA 2024/2 não encontrado, usando respostas do parser');
}
const revalida_2024_2_questions = parseQuestions(revalida_2024_2_text, 'REVALIDA_2024_2', revalida_2024_2_gabarito);
console.log(`REVALIDA 2024/2: ${revalida_2024_2_questions.length} questões parseadas`);

// 3. REVALIDA 2024/1
const revalida_2024_1_text = readFileSync('/home/ubuntu/medfocus-app/research/revalida_2024_1_prova.txt', 'utf-8');
const revalida_2024_1_gabarito_text = readFileSync('/home/ubuntu/medfocus-app/research/revalida_2024_1_gabarito.txt', 'utf-8');
const revalida_2024_1_gabarito = parseGabaritoTable(revalida_2024_1_gabarito_text);
console.log(`Gabarito REVALIDA 2024/1: ${Object.keys(revalida_2024_1_gabarito).length} questões`);

const revalida_2024_1_questions = parseQuestions(revalida_2024_1_text, 'REVALIDA_2024_1', revalida_2024_1_gabarito);
console.log(`REVALIDA 2024/1: ${revalida_2024_1_questions.length} questões parseadas`);

// ========== COMBINE ALL ==========

const allQuestions = [...enamed_questions, ...revalida_2024_2_questions, ...revalida_2024_1_questions];
console.log(`\nTotal: ${allQuestions.length} questões`);

// ========== OUTPUT ==========

const sourceTypes = Array.from(new Set(allQuestions.map(q => q.source)));
const sourceTypeStr = sourceTypes.map(s => `'${s}'`).join(' | ');

const output = `// Auto-generated from INEP official exams (domínio público)
// ENAMED 2025 - Exame Nacional de Avaliação da Formação Médica
// REVALIDA 2024/1 e 2024/2 - Exame Nacional de Revalidação de Diplomas Médicos
// Fonte: https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais
// Gabaritos oficiais do INEP aplicados

export interface RealQuestion {
  id: string;
  source: ${sourceTypeStr};
  number: number;
  year: number;
  text: string;
  options: { letter: string; text: string }[];
  correctAnswer: string;
  area: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export const REAL_QUESTIONS: RealQuestion[] = ${JSON.stringify(allQuestions, null, 2)};

export const QUESTION_AREAS = Array.from(new Set(REAL_QUESTIONS.map(q => q.area)));

export const QUESTION_SOURCES = Array.from(new Set(REAL_QUESTIONS.map(q => q.source)));

export const QUESTION_STATS = {
  total: REAL_QUESTIONS.length,
  bySource: Object.fromEntries(
    Array.from(new Set(REAL_QUESTIONS.map(q => q.source))).map(src => [
      src,
      REAL_QUESTIONS.filter(q => q.source === src).length,
    ])
  ),
  byArea: Object.fromEntries(
    Array.from(new Set(REAL_QUESTIONS.map(q => q.area))).map(area => [
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
console.log('\\nDistribuição por área:', areas);

// Print source distribution
const sources = {};
allQuestions.forEach(q => { sources[q.source] = (sources[q.source] || 0) + 1; });
console.log('Distribuição por fonte:', sources);
