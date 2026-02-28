/**
 * MedFocus — Base Completa de Medicamentos
 * Baseada na tabela CMED/ANVISA com preços de referência, genéricos e similares.
 * Inclui aliases populares (ex: Viagra → Sildenafila) e busca por laboratório.
 */

export interface MedicamentoApresentacao {
  nome: string;
  laboratorio: string;
  preco: number;
  apresentacao: string;
  tipo: 'Referência' | 'Genérico' | 'Similar';
  ean?: string;
}

export interface MedicamentoCompleto {
  id: number;
  substancia: string;
  classe: string;
  tarja: 'sem' | 'vermelha' | 'preta' | 'amarela';
  aliases: string[]; // nomes populares/comerciais para busca
  referencia: MedicamentoApresentacao;
  genericos: MedicamentoApresentacao[];
  similares: MedicamentoApresentacao[];
  farmaciaPopular: boolean; // disponível no programa Farmácia Popular
}

// Mapeamento de nomes populares/comerciais para substâncias
export const ALIASES_POPULARES: Record<string, string[]> = {
  'viagra': ['CITRATO DE SILDENAFILA', 'TADALAFILA'],
  'cialis': ['TADALAFILA'],
  'rivotril': ['CLONAZEPAM'],
  'tylenol': ['PARACETAMOL'],
  'novalgina': ['DIPIRONA', 'DIPIRONA SÓDICA'],
  'dorflex': ['DIPIRONA', 'CITRATO DE ORFENADRINA;DIPIRONA SÓDICA;CAFEÍNA'],
  'buscopan': ['BUTILBROMETO DE ESCOPOLAMINA'],
  'neosaldina': ['DIPIRONA SÓDICA;MUCATO DE ISOMETEPTENO;CAFEÍNA'],
  'amoxil': ['AMOXICILINA'],
  'lexapro': ['OXALATO DE ESCITALOPRAM'],
  'frontal': ['ALPRAZOLAM'],
  'puran': ['LEVOTIROXINA SÓDICA'],
  'glifage': ['CLORIDRATO DE METFORMINA'],
  'losartan': ['LOSARTANA POTÁSSICA'],
  'losartana': ['LOSARTANA POTÁSSICA'],
  'atenolol': ['ATENOLOL'],
  'omeprazol': ['OMEPRAZOL'],
  'sinvastatina': ['SINVASTATINA'],
  'fluoxetina': ['CLORIDRATO DE FLUOXETINA'],
  'sertralina': ['CLORIDRATO DE SERTRALINA'],
  'zoloft': ['CLORIDRATO DE SERTRALINA'],
  'prozac': ['CLORIDRATO DE FLUOXETINA'],
  'ritalina': ['CLORIDRATO DE METILFENIDATO'],
  'venvanse': ['DIMESILATO DE LISDEXANFETAMINA'],
  'concerta': ['CLORIDRATO DE METILFENIDATO'],
  'diazepam': ['DIAZEPAM'],
  'valium': ['DIAZEPAM'],
  'xanax': ['ALPRAZOLAM'],
  'aspirina': ['ÁCIDO ACETILSALICÍLICO'],
  'aas': ['ÁCIDO ACETILSALICÍLICO'],
  'ibuprofeno': ['IBUPROFENO'],
  'advil': ['IBUPROFENO'],
  'nimesulida': ['NIMESULIDA'],
  'cataflan': ['DICLOFENACO'],
  'voltaren': ['DICLOFENACO SÓDICO'],
  'prednisona': ['PREDNISONA'],
  'prednisolona': ['PREDNISOLONA'],
  'dexametasona': ['DEXAMETASONA'],
  'azitromicina': ['AZITROMICINA', 'AZITROMICINA DI-HIDRATADA'],
  'amoxicilina': ['AMOXICILINA', 'AMOXICILINA TRI-HIDRATADA'],
  'cefalexina': ['CEFALEXINA', 'CEFALEXINA MONOIDRATADA'],
  'metformina': ['CLORIDRATO DE METFORMINA'],
  'insulina': ['INSULINA HUMANA', 'INSULINA GLARGINA', 'INSULINA ASPARTE', 'INSULINA LISPRO'],
  'captopril': ['CAPTOPRIL'],
  'enalapril': ['MALEATO DE ENALAPRIL'],
  'anlodipino': ['BESILATO DE ANLODIPINO'],
  'hidroclorotiazida': ['HIDROCLOROTIAZIDA'],
  'pantoprazol': ['PANTOPRAZOL SÓDICO SESQUI-HIDRATADO'],
  'lansoprazol': ['LANSOPRAZOL'],
  'ranitidina': ['CLORIDRATO DE RANITIDINA'],
  'loratadina': ['LORATADINA'],
  'cetirizina': ['DICLORIDRATO DE CETIRIZINA'],
  'allegra': ['CLORIDRATO DE FEXOFENADINA'],
  'fexofenadina': ['CLORIDRATO DE FEXOFENADINA'],
  'desloratadina': ['DESLORATADINA'],
  'amitriptilina': ['CLORIDRATO DE AMITRIPTILINA'],
  'tryptanol': ['CLORIDRATO DE AMITRIPTILINA'],
  'clonazepam': ['CLONAZEPAM'],
  'bromazepam': ['BROMAZEPAM'],
  'lexotan': ['BROMAZEPAM'],
  'dormonid': ['MALEATO DE MIDAZOLAM'],
  'zolpidem': ['HEMITARTARATO DE ZOLPIDEM'],
  'quetiapina': ['FUMARATO DE QUETIAPINA'],
  'seroquel': ['FUMARATO DE QUETIAPINA'],
  'risperidona': ['RISPERIDONA'],
  'carbamazepina': ['CARBAMAZEPINA'],
  'tegretol': ['CARBAMAZEPINA'],
  'lamotrigina': ['LAMOTRIGINA'],
  'topiramato': ['TOPIRAMATO'],
  'gabapentina': ['GABAPENTINA'],
  'pregabalina': ['PREGABALINA'],
  'lyrica': ['PREGABALINA'],
  'tramadol': ['CLORIDRATO DE TRAMADOL'],
  'codeina': ['FOSFATO DE CODEÍNA'],
  'morfina': ['SULFATO DE MORFINA'],
  'dipirona': ['DIPIRONA', 'DIPIRONA SÓDICA', 'DIPIRONA MONOIDRATADA'],
  'paracetamol': ['PARACETAMOL'],
  'sildenafila': ['CITRATO DE SILDENAFILA'],
  'tadalafila': ['TADALAFILA'],
  'minoxidil': ['MINOXIDIL'],
  'finasterida': ['FINASTERIDA'],
  'dutasterida': ['DUTASTERIDA'],
  'levotiroxina': ['LEVOTIROXINA SÓDICA'],
  'propranolol': ['CLORIDRATO DE PROPRANOLOL'],
  'atorvastatina': ['ATORVASTATINA CÁLCICA'],
  'rosuvastatina': ['ROSUVASTATINA CÁLCICA'],
  'clopidogrel': ['BISSULFATO DE CLOPIDOGREL'],
  'varfarina': ['VARFARINA SÓDICA'],
  'rivaroxabana': ['RIVAROXABANA'],
  'xarelto': ['RIVAROXABANA'],
  'apixabana': ['APIXABANA'],
  'eliquis': ['APIXABANA'],
  'metoprolol': ['SUCCINATO DE METOPROLOL'],
  'carvedilol': ['CARVEDILOL'],
  'espironolactona': ['ESPIRONOLACTONA'],
  'furosemida': ['FUROSEMIDA'],
  'valsartana': ['VALSARTANA'],
  'candesartana': ['CANDESARTANA CILEXETILA'],
  'irbesartana': ['IRBESARTANA'],
  'telmisartana': ['TELMISARTANA'],
  'ramipril': ['RAMIPRIL'],
  'lisinopril': ['LISINOPRIL'],
  'amlodipina': ['BESILATO DE ANLODIPINO'],
  'nifedipino': ['NIFEDIPINO'],
  'diltiazem': ['CLORIDRATO DE DILTIAZEM'],
  'verapamil': ['CLORIDRATO DE VERAPAMIL'],
  'glibenclamida': ['GLIBENCLAMIDA'],
  'glimepirida': ['GLIMEPIRIDA'],
  'gliclazida': ['GLICLAZIDA'],
  'pioglitazona': ['CLORIDRATO DE PIOGLITAZONA'],
  'sitagliptina': ['FOSFATO DE SITAGLIPTINA MONOIDRATADA'],
  'januvia': ['FOSFATO DE SITAGLIPTINA MONOIDRATADA'],
  'empagliflozina': ['EMPAGLIFLOZINA'],
  'jardiance': ['EMPAGLIFLOZINA'],
  'dapagliflozina': ['DAPAGLIFLOZINA'],
  'forxiga': ['DAPAGLIFLOZINA'],
  'liraglutida': ['LIRAGLUTIDA'],
  'ozempic': ['SEMAGLUTIDA'],
  'semaglutida': ['SEMAGLUTIDA'],
  'wegovy': ['SEMAGLUTIDA'],
  'mounjaro': ['TIRZEPATIDA'],
  'tirzepatida': ['TIRZEPATIDA'],
  'ciprofloxacino': ['CLORIDRATO DE CIPROFLOXACINO'],
  'levofloxacino': ['LEVOFLOXACINO HEMI-HIDRATADO'],
  'metronidazol': ['METRONIDAZOL'],
  'sulfametoxazol': ['SULFAMETOXAZOL;TRIMETOPRIMA'],
  'bactrim': ['SULFAMETOXAZOL;TRIMETOPRIMA'],
  'fluconazol': ['FLUCONAZOL'],
  'aciclovir': ['ACICLOVIR'],
  'oseltamivir': ['FOSFATO DE OSELTAMIVIR'],
  'tamiflu': ['FOSFATO DE OSELTAMIVIR'],
  'ivermectina': ['IVERMECTINA'],
  'albendazol': ['ALBENDAZOL'],
  'salbutamol': ['SULFATO DE SALBUTAMOL'],
  'aerolin': ['SULFATO DE SALBUTAMOL'],
  'budesonida': ['BUDESONIDA'],
  'formoterol': ['FUMARATO DE FORMOTEROL DI-HIDRATADO'],
  'montelucaste': ['MONTELUCASTE DE SÓDIO'],
  'singulair': ['MONTELUCASTE DE SÓDIO'],
  'melatonina': ['MELATONINA'],
  'vitamina d': ['COLECALCIFEROL'],
  'vitamina c': ['ÁCIDO ASCÓRBICO'],
  'acido folico': ['ÁCIDO FÓLICO'],
  'sulfato ferroso': ['SULFATO FERROSO'],
};

// Medicamentos do Programa Farmácia Popular (gratuitos ou com desconto)
export const FARMACIA_POPULAR_GRATUITOS = [
  'LOSARTANA POTÁSSICA', 'CAPTOPRIL', 'HIDROCLOROTIAZIDA', 'MALEATO DE ENALAPRIL',
  'ATENOLOL', 'CLORIDRATO DE PROPRANOLOL', 'BESILATO DE ANLODIPINO',
  'CLORIDRATO DE METFORMINA', 'GLIBENCLAMIDA', 'INSULINA HUMANA', 'INSULINA GLARGINA',
  'SINVASTATINA', 'SULFATO DE SALBUTAMOL', 'DIPROPIONATO DE BECLOMETASONA',
  'BROMETO DE IPRATRÓPIO', 'CARBIDOPA;LEVODOPA',
  'DIAZEPAM', 'CLORIDRATO DE FLUOXETINA', 'CLORIDRATO DE AMITRIPTILINA',
  'CLORIDRATO DE SERTRALINA', 'CARBAMAZEPINA', 'FENOBARBITAL',
  'ÁCIDO FÓLICO', 'SULFATO FERROSO',
];

// Laboratórios principais do Brasil
export const LABORATORIOS_PRINCIPAIS = [
  'CIMED INDUSTRIA S.A',
  'EUROFARMA LABORATORIOS S.A.',
  'EMS S/A',
  'EMS SIGMA PHARMA LTDA',
  'ACHÉ LABORATÓRIOS FARMACÊUTICOS S.A',
  'SANOFI MEDLEY FARMACÊUTICA LTDA.',
  'LABORATORIOS PFIZER LTDA',
  'PFIZER BRASIL LTDA',
  'NOVARTIS BIOCIENCIAS S.A',
  'BAYER S.A.',
  'PRODUTOS ROCHE QUÍMICOS E FARMACÊUTICOS S.A.',
  'HYPERA S.A.',
  'CRISTÁLIA PRODUTOS QUÍMICOS FARMACÊUTICOS LTDA',
  'BIOLAB SANUS FARMACÊUTICA LTDA',
  'LIBBS FARMACÊUTICA LTDA',
  'TORRENT DO BRASIL LTDA',
  'SANDOZ DO BRASIL INDÚSTRIA FARMACÊUTICA LTDA',
  'MERCK S.A.',
  'ABBOTT LABORATÓRIOS DO BRASIL LTDA',
  'ASTRAZENECA DO BRASIL LTDA',
  'BOEHRINGER INGELHEIM DO BRASIL QUÍMICA E FARMACÊUTICA LTDA',
  'ELI LILLY DO BRASIL LTDA',
  'JANSSEN-CILAG FARMACÊUTICA LTDA',
  'NOVO NORDISK FARMACÊUTICA DO BRASIL LTDA',
  'VIATRIS FARMACEUTICA DO BRASIL LTDA',
  'GERMED FARMACEUTICA LTDA',
  'PRATI DONADUZZI & CIA LTDA',
  'BRAINFARMA INDÚSTRIA QUÍMICA E FARMACÊUTICA S.A',
  'TEUTO BRASILEIRO S/A',
  'UNIÃO QUÍMICA FARMACÊUTICA NACIONAL S/A',
  'LEGRAND PHARMA INDÚSTRIA FARMACÊUTICA LTDA',
  'GLENMARK FARMACÊUTICA LTDA',
  'RANBAXY FARMACÊUTICA LTDA',
  'SUN PHARMACEUTICAL INDUSTRIES LIMITED',
  'DR. REDDY\'S FARMACÊUTICA DO BRASIL LTDA',
  'AUROBINDO PHARMA INDÚSTRIA FARMACÊUTICA LIMITADA',
];

// Classificação terapêutica simplificada
export const CLASSES_TERAPEUTICAS: Record<string, string> = {
  'DIPIRONA': 'Analgésico/Antitérmico',
  'PARACETAMOL': 'Analgésico/Antitérmico',
  'IBUPROFENO': 'Anti-inflamatório',
  'NIMESULIDA': 'Anti-inflamatório',
  'DICLOFENACO': 'Anti-inflamatório',
  'AMOXICILINA': 'Antibiótico',
  'AZITROMICINA': 'Antibiótico',
  'CEFALEXINA': 'Antibiótico',
  'CIPROFLOXACINO': 'Antibiótico',
  'LOSARTANA': 'Anti-hipertensivo',
  'CAPTOPRIL': 'Anti-hipertensivo',
  'ENALAPRIL': 'Anti-hipertensivo',
  'ANLODIPINO': 'Anti-hipertensivo',
  'ATENOLOL': 'Anti-hipertensivo',
  'PROPRANOLOL': 'Anti-hipertensivo',
  'METFORMINA': 'Antidiabético',
  'GLIBENCLAMIDA': 'Antidiabético',
  'INSULINA': 'Antidiabético',
  'SEMAGLUTIDA': 'Antidiabético/Emagrecimento',
  'OMEPRAZOL': 'Antiulceroso',
  'PANTOPRAZOL': 'Antiulceroso',
  'SINVASTATINA': 'Estatina',
  'ATORVASTATINA': 'Estatina',
  'ROSUVASTATINA': 'Estatina',
  'FLUOXETINA': 'Antidepressivo',
  'SERTRALINA': 'Antidepressivo',
  'ESCITALOPRAM': 'Antidepressivo',
  'CLONAZEPAM': 'Ansiolítico',
  'ALPRAZOLAM': 'Ansiolítico',
  'DIAZEPAM': 'Ansiolítico',
  'SILDENAFILA': 'Disfunção Erétil',
  'TADALAFILA': 'Disfunção Erétil',
  'LEVOTIROXINA': 'Hormônio Tireoidiano',
  'PREDNISONA': 'Corticosteroide',
  'DEXAMETASONA': 'Corticosteroide',
  'SALBUTAMOL': 'Broncodilatador',
  'BUDESONIDA': 'Corticosteroide Inalatório',
  'LORATADINA': 'Anti-histamínico',
  'CETIRIZINA': 'Anti-histamínico',
  'PREGABALINA': 'Anticonvulsivante/Dor Neuropática',
  'GABAPENTINA': 'Anticonvulsivante',
  'CARBAMAZEPINA': 'Anticonvulsivante',
  'METILFENIDATO': 'Estimulante/TDAH',
  'FINASTERIDA': 'Tratamento Capilar/Próstata',
  'MINOXIDIL': 'Tratamento Capilar',
};

// Função para classificar a tarja do medicamento
export function classificarTarja(substancia: string): 'sem' | 'vermelha' | 'preta' | 'amarela' {
  const sub = substancia.toUpperCase();
  // Tarja preta (controlados especiais)
  if (['CLONAZEPAM','DIAZEPAM','ALPRAZOLAM','BROMAZEPAM','MIDAZOLAM','ZOLPIDEM',
       'METILFENIDATO','LISDEXANFETAMINA','MORFINA','CODEÍNA','TRAMADOL','FENTANILA',
       'OXICODONA','FENOBARBITAL'].some(t => sub.includes(t))) return 'preta';
  // Sem tarja (OTC)
  if (['DIPIRONA','PARACETAMOL','IBUPROFENO','LORATADINA','DIMETICONA','SIMETICONA',
       'ÁCIDO ASCÓRBICO','COLECALCIFEROL','MELATONINA','CLORETO DE SÓDIO'].some(t => sub.includes(t))) return 'sem';
  // Amarela (genéricos)
  // Default: vermelha
  return 'vermelha';
}

// Função para buscar classe terapêutica
export function getClasseTerapeutica(substancia: string): string {
  const sub = substancia.toUpperCase();
  for (const [key, value] of Object.entries(CLASSES_TERAPEUTICAS)) {
    if (sub.includes(key.toUpperCase())) return value;
  }
  return 'Medicamento';
}
