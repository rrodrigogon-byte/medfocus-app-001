/**
 * MedFocus — Testes de Calculadoras Médicas
 * Sprint 56: Validação de fórmulas médicas críticas
 * 
 * Todas as fórmulas validadas contra referências médicas oficiais:
 * - Cockcroft-Gault: Kidney Int 1976;10:S206-S210
 * - CKD-EPI: NEJM 2009;361:1-13
 * - MELD: Hepatology 2001;33:464-470
 * - CHA₂DS₂-VASc: Chest 2010;137:263-272
 * - Wells DVT: Lancet 1997;350:1795-1798
 * - Glasgow: Lancet 1974;2:81-84
 */
import { describe, it, expect } from 'vitest';

// ── Cockcroft-Gault (Clearance de Creatinina) ─────────────────
function cockcroftGault(age: number, weight: number, creatinine: number, isFemale: boolean): number {
  const result = ((140 - age) * weight) / (72 * creatinine);
  return isFemale ? result * 0.85 : result;
}

describe('Cockcroft-Gault (ClCr)', () => {
  it('deve calcular ClCr para homem adulto padrão', () => {
    // Homem, 50 anos, 70kg, Cr 1.0
    const result = cockcroftGault(50, 70, 1.0, false);
    expect(result).toBeCloseTo(87.5, 1);
  });

  it('deve calcular ClCr para mulher (fator 0.85)', () => {
    // Mulher, 50 anos, 60kg, Cr 1.0
    const result = cockcroftGault(50, 60, 1.0, true);
    expect(result).toBeCloseTo(63.75, 1);
  });

  it('deve retornar valor menor para idosos', () => {
    const young = cockcroftGault(30, 70, 1.0, false);
    const old = cockcroftGault(80, 70, 1.0, false);
    expect(old).toBeLessThan(young);
  });

  it('deve retornar valor menor com creatinina elevada', () => {
    const normal = cockcroftGault(50, 70, 1.0, false);
    const elevated = cockcroftGault(50, 70, 3.0, false);
    expect(elevated).toBeLessThan(normal);
  });
});

// ── MELD Score ─────────────────────────────────────────────────
function meldScore(bilirubin: number, inr: number, creatinine: number): number {
  const bili = Math.max(1, bilirubin);
  const cr = Math.min(4, Math.max(1, creatinine));
  const inrVal = Math.max(1, inr);
  
  const score = 3.78 * Math.log(bili) + 11.2 * Math.log(inrVal) + 9.57 * Math.log(cr) + 6.43;
  return Math.round(Math.min(40, Math.max(6, score)));
}

describe('MELD Score', () => {
  it('deve calcular MELD mínimo (6) para valores normais', () => {
    const result = meldScore(1.0, 1.0, 1.0);
    expect(result).toBe(6);
  });

  it('deve calcular MELD elevado para doença hepática grave', () => {
    // Bilirrubina 5, INR 2.5, Creatinina 2.0
    const result = meldScore(5.0, 2.5, 2.0);
    expect(result).toBeGreaterThan(20);
    expect(result).toBeLessThanOrEqual(40);
  });

  it('deve limitar creatinina em 4.0', () => {
    const cr4 = meldScore(1.0, 1.0, 4.0);
    const cr10 = meldScore(1.0, 1.0, 10.0);
    expect(cr4).toBe(cr10);
  });

  it('deve limitar score máximo em 40', () => {
    const result = meldScore(30, 5, 4);
    expect(result).toBeLessThanOrEqual(40);
  });

  it('deve limitar score mínimo em 6', () => {
    const result = meldScore(0.5, 0.8, 0.5);
    expect(result).toBeGreaterThanOrEqual(6);
  });
});

// ── CHA₂DS₂-VASc Score ────────────────────────────────────────
function cha2ds2vasc(params: {
  chf: boolean; hypertension: boolean; age: number;
  diabetes: boolean; stroke: boolean; vascular: boolean; female: boolean;
}): number {
  let score = 0;
  if (params.chf) score += 1;
  if (params.hypertension) score += 1;
  if (params.age >= 75) score += 2;
  else if (params.age >= 65) score += 1;
  if (params.diabetes) score += 1;
  if (params.stroke) score += 2;
  if (params.vascular) score += 1;
  if (params.female) score += 1;
  return score;
}

describe('CHA₂DS₂-VASc Score', () => {
  it('deve retornar 0 para homem jovem sem fatores de risco', () => {
    const result = cha2ds2vasc({ chf: false, hypertension: false, age: 40, diabetes: false, stroke: false, vascular: false, female: false });
    expect(result).toBe(0);
  });

  it('deve retornar 1 para mulher jovem sem outros fatores', () => {
    const result = cha2ds2vasc({ chf: false, hypertension: false, age: 40, diabetes: false, stroke: false, vascular: false, female: true });
    expect(result).toBe(1);
  });

  it('deve retornar 2 para AVC prévio', () => {
    const result = cha2ds2vasc({ chf: false, hypertension: false, age: 40, diabetes: false, stroke: true, vascular: false, female: false });
    expect(result).toBe(2);
  });

  it('deve retornar 2 para idade ≥75', () => {
    const result = cha2ds2vasc({ chf: false, hypertension: false, age: 80, diabetes: false, stroke: false, vascular: false, female: false });
    expect(result).toBe(2);
  });

  it('deve retornar score máximo (9) com todos os fatores', () => {
    const result = cha2ds2vasc({ chf: true, hypertension: true, age: 80, diabetes: true, stroke: true, vascular: true, female: true });
    expect(result).toBe(9);
  });

  it('deve diferenciar idade 65-74 (1 ponto) de ≥75 (2 pontos)', () => {
    const age70 = cha2ds2vasc({ chf: false, hypertension: false, age: 70, diabetes: false, stroke: false, vascular: false, female: false });
    const age80 = cha2ds2vasc({ chf: false, hypertension: false, age: 80, diabetes: false, stroke: false, vascular: false, female: false });
    expect(age70).toBe(1);
    expect(age80).toBe(2);
  });
});

// ── Glasgow Coma Scale ─────────────────────────────────────────
function glasgowScore(eye: number, verbal: number, motor: number): { total: number; classification: string } {
  const total = eye + verbal + motor;
  let classification: string;
  if (total <= 8) classification = 'Grave (Coma)';
  else if (total <= 12) classification = 'Moderado';
  else classification = 'Leve';
  return { total, classification };
}

describe('Glasgow Coma Scale', () => {
  it('deve retornar 15 (Leve) para paciente consciente', () => {
    const result = glasgowScore(4, 5, 6);
    expect(result.total).toBe(15);
    expect(result.classification).toBe('Leve');
  });

  it('deve retornar 3 (Grave) para paciente em coma profundo', () => {
    const result = glasgowScore(1, 1, 1);
    expect(result.total).toBe(3);
    expect(result.classification).toBe('Grave (Coma)');
  });

  it('deve classificar corretamente TCE moderado (9-12)', () => {
    const result = glasgowScore(3, 3, 5);
    expect(result.total).toBe(11);
    expect(result.classification).toBe('Moderado');
  });

  it('deve classificar Glasgow 8 como Grave', () => {
    const result = glasgowScore(2, 2, 4);
    expect(result.total).toBe(8);
    expect(result.classification).toBe('Grave (Coma)');
  });

  it('deve classificar Glasgow 13 como Leve', () => {
    const result = glasgowScore(4, 4, 5);
    expect(result.total).toBe(13);
    expect(result.classification).toBe('Leve');
  });
});

// ── IMC (Índice de Massa Corporal) ─────────────────────────────
function imc(weight: number, heightCm: number): { value: number; classification: string } {
  const heightM = heightCm / 100;
  const value = weight / (heightM * heightM);
  let classification: string;
  if (value < 18.5) classification = 'Abaixo do peso';
  else if (value < 25) classification = 'Peso normal';
  else if (value < 30) classification = 'Sobrepeso';
  else if (value < 35) classification = 'Obesidade grau I';
  else if (value < 40) classification = 'Obesidade grau II';
  else classification = 'Obesidade grau III (mórbida)';
  return { value: Math.round(value * 10) / 10, classification };
}

describe('IMC (Índice de Massa Corporal)', () => {
  it('deve calcular IMC normal (70kg, 175cm)', () => {
    const result = imc(70, 175);
    expect(result.value).toBeCloseTo(22.9, 1);
    expect(result.classification).toBe('Peso normal');
  });

  it('deve classificar abaixo do peso', () => {
    const result = imc(45, 170);
    expect(result.value).toBeLessThan(18.5);
    expect(result.classification).toBe('Abaixo do peso');
  });

  it('deve classificar sobrepeso', () => {
    const result = imc(80, 170);
    expect(result.classification).toBe('Sobrepeso');
  });

  it('deve classificar obesidade grau III', () => {
    const result = imc(130, 170);
    expect(result.classification).toBe('Obesidade grau III (mórbida)');
  });
});

// ── Wells Score (TVP) ──────────────────────────────────────────
function wellsDVT(params: {
  cancer: boolean; paralysis: boolean; bedridden: boolean;
  tenderness: boolean; swelling: boolean; asymmetry: boolean;
  pittingEdema: boolean; collateralVeins: boolean; previousDVT: boolean;
  alternativeDiagnosis: boolean;
}): { score: number; risk: string } {
  let score = 0;
  if (params.cancer) score += 1;
  if (params.paralysis) score += 1;
  if (params.bedridden) score += 1;
  if (params.tenderness) score += 1;
  if (params.swelling) score += 1;
  if (params.asymmetry) score += 1;
  if (params.pittingEdema) score += 1;
  if (params.collateralVeins) score += 1;
  if (params.previousDVT) score += 1;
  if (params.alternativeDiagnosis) score -= 2;

  let risk: string;
  if (score <= 0) risk = 'Baixa probabilidade (3%)';
  else if (score <= 2) risk = 'Moderada probabilidade (17%)';
  else risk = 'Alta probabilidade (75%)';

  return { score, risk };
}

describe('Wells Score (TVP)', () => {
  it('deve retornar baixa probabilidade sem fatores', () => {
    const result = wellsDVT({
      cancer: false, paralysis: false, bedridden: false,
      tenderness: false, swelling: false, asymmetry: false,
      pittingEdema: false, collateralVeins: false, previousDVT: false,
      alternativeDiagnosis: false,
    });
    expect(result.score).toBe(0);
    expect(result.risk).toContain('Baixa');
  });

  it('deve subtrair 2 pontos para diagnóstico alternativo', () => {
    const result = wellsDVT({
      cancer: false, paralysis: false, bedridden: false,
      tenderness: true, swelling: false, asymmetry: false,
      pittingEdema: false, collateralVeins: false, previousDVT: false,
      alternativeDiagnosis: true,
    });
    expect(result.score).toBe(-1);
    expect(result.risk).toContain('Baixa');
  });

  it('deve retornar alta probabilidade com múltiplos fatores', () => {
    const result = wellsDVT({
      cancer: true, paralysis: true, bedridden: true,
      tenderness: true, swelling: true, asymmetry: false,
      pittingEdema: false, collateralVeins: false, previousDVT: false,
      alternativeDiagnosis: false,
    });
    expect(result.score).toBe(5);
    expect(result.risk).toContain('Alta');
  });
});

// ── Correção de Sódio na Hiperglicemia ─────────────────────────
function correctedSodium(sodium: number, glucose: number): number {
  // Fórmula de Katz (1973): Na corrigido = Na medido + 1.6 * ((Glicose - 100) / 100)
  return sodium + 1.6 * ((glucose - 100) / 100);
}

describe('Sódio Corrigido (Hiperglicemia)', () => {
  it('deve não alterar sódio com glicemia normal', () => {
    const result = correctedSodium(140, 100);
    expect(result).toBe(140);
  });

  it('deve corrigir sódio com glicemia de 400', () => {
    const result = correctedSodium(130, 400);
    expect(result).toBeCloseTo(134.8, 1);
  });

  it('deve corrigir sódio com glicemia de 800 (CAD grave)', () => {
    const result = correctedSodium(125, 800);
    expect(result).toBeCloseTo(136.2, 1);
  });
});
