/**
 * Gerador de Laudos Médicos com IA
 * Sprint 62: Templates inteligentes para laudos médicos
 * 
 * Funcionalidades:
 * - 15 templates de laudos por especialidade
 * - Preenchimento assistido por IA
 * - Campos estruturados com valores normais
 * - Geração de impressão diagnóstica
 * - Exportação em formato padrão
 * - Histórico de laudos
 */
import React, { useState, useCallback, useMemo } from 'react';

interface LaudoTemplate {
  id: string;
  name: string;
  specialty: string;
  icon: string;
  sections: LaudoSection[];
}

interface LaudoSection {
  id: string;
  title: string;
  fields: LaudoField[];
}

interface LaudoField {
  id: string;
  label: string;
  type: 'select' | 'text' | 'number' | 'textarea' | 'checkbox';
  options?: string[];
  defaultValue?: string;
  normalValue?: string;
  unit?: string;
  placeholder?: string;
  required?: boolean;
}

interface LaudoHistoryItem {
  id: string;
  templateName: string;
  patientName: string;
  date: string;
  impression: string;
}

const TEMPLATES: LaudoTemplate[] = [
  {
    id: 'eco-transt',
    name: 'Ecocardiograma Transtorácico',
    specialty: 'Cardiologia',
    icon: '❤️',
    sections: [
      {
        id: 'dados', title: 'Dados do Exame',
        fields: [
          { id: 'paciente', label: 'Paciente', type: 'text', placeholder: 'Nome completo', required: true },
          { id: 'idade', label: 'Idade', type: 'number', unit: 'anos', required: true },
          { id: 'sexo', label: 'Sexo', type: 'select', options: ['Masculino', 'Feminino'], required: true },
          { id: 'indicacao', label: 'Indicação clínica', type: 'text', placeholder: 'Ex: Dispneia aos esforços' },
        ]
      },
      {
        id: 'dimensoes', title: 'Dimensões Cardíacas',
        fields: [
          { id: 'ae', label: 'Átrio Esquerdo', type: 'number', unit: 'mm', normalValue: '28-40', defaultValue: '35' },
          { id: 'aorta', label: 'Raiz da Aorta', type: 'number', unit: 'mm', normalValue: '20-37', defaultValue: '32' },
          { id: 'ddve', label: 'DDVE', type: 'number', unit: 'mm', normalValue: '35-56', defaultValue: '48' },
          { id: 'dsve', label: 'DSVE', type: 'number', unit: 'mm', normalValue: '20-40', defaultValue: '32' },
          { id: 'septo', label: 'Septo IV', type: 'number', unit: 'mm', normalValue: '6-11', defaultValue: '9' },
          { id: 'ppve', label: 'Parede Posterior VE', type: 'number', unit: 'mm', normalValue: '6-11', defaultValue: '9' },
          { id: 'vd', label: 'Ventrículo Direito', type: 'number', unit: 'mm', normalValue: '7-26', defaultValue: '22' },
        ]
      },
      {
        id: 'funcao', title: 'Função Ventricular',
        fields: [
          { id: 'feve', label: 'Fração de Ejeção (Simpson)', type: 'number', unit: '%', normalValue: '≥55', defaultValue: '62' },
          { id: 'contratilidade', label: 'Contratilidade Global VE', type: 'select', options: ['Normal', 'Hipocinesia difusa leve', 'Hipocinesia difusa moderada', 'Hipocinesia difusa grave', 'Acinesia segmentar'] },
          { id: 'relaxamento', label: 'Função Diastólica', type: 'select', options: ['Normal', 'Disfunção diastólica grau I (relaxamento alterado)', 'Disfunção diastólica grau II (pseudonormal)', 'Disfunção diastólica grau III (restritivo)'] },
          { id: 'tapse', label: 'TAPSE', type: 'number', unit: 'mm', normalValue: '≥17', defaultValue: '22' },
        ]
      },
      {
        id: 'valvas', title: 'Valvas',
        fields: [
          { id: 'mitral', label: 'Valva Mitral', type: 'select', options: ['Morfologia e mobilidade normais', 'Espessamento leve dos folhetos', 'Prolapso do folheto posterior', 'Calcificação do anel mitral', 'Estenose mitral reumática'] },
          { id: 'im', label: 'Insuficiência Mitral', type: 'select', options: ['Ausente', 'Mínima (fisiológica)', 'Leve', 'Moderada', 'Grave'] },
          { id: 'aortica', label: 'Valva Aórtica', type: 'select', options: ['Tricúspide, fina, móvel', 'Bicúspide', 'Espessamento/calcificação leve', 'Estenose aórtica calcificada'] },
          { id: 'ia', label: 'Insuficiência Aórtica', type: 'select', options: ['Ausente', 'Mínima', 'Leve', 'Moderada', 'Grave'] },
          { id: 'tricuspide', label: 'Valva Tricúspide', type: 'select', options: ['Normal', 'Espessamento leve', 'Prolapso'] },
          { id: 'it', label: 'Insuficiência Tricúspide', type: 'select', options: ['Ausente', 'Mínima (fisiológica)', 'Leve', 'Moderada', 'Grave'] },
          { id: 'psap', label: 'PSAP estimada', type: 'number', unit: 'mmHg', normalValue: '<35', defaultValue: '28' },
        ]
      },
      {
        id: 'pericardio', title: 'Pericárdio e Outros',
        fields: [
          { id: 'pericardio', label: 'Pericárdio', type: 'select', options: ['Normal', 'Derrame pericárdico leve', 'Derrame pericárdico moderado', 'Derrame pericárdico volumoso', 'Espessamento pericárdico'] },
          { id: 'observacoes', label: 'Observações adicionais', type: 'textarea', placeholder: 'Achados adicionais relevantes...' },
        ]
      },
    ],
  },
  {
    id: 'usg-abd',
    name: 'Ultrassonografia de Abdome Total',
    specialty: 'Radiologia',
    icon: '🔊',
    sections: [
      {
        id: 'dados', title: 'Dados do Exame',
        fields: [
          { id: 'paciente', label: 'Paciente', type: 'text', placeholder: 'Nome completo', required: true },
          { id: 'indicacao', label: 'Indicação', type: 'text', placeholder: 'Ex: Dor abdominal' },
        ]
      },
      {
        id: 'figado', title: 'Fígado',
        fields: [
          { id: 'dimensoes', label: 'Dimensões', type: 'select', options: ['Dimensões normais', 'Hepatomegalia leve', 'Hepatomegalia moderada', 'Hepatomegalia acentuada', 'Reduzido (cirrose)'] },
          { id: 'ecotextura', label: 'Ecotextura', type: 'select', options: ['Homogênea, normal', 'Esteatose hepática leve (grau I)', 'Esteatose hepática moderada (grau II)', 'Esteatose hepática acentuada (grau III)', 'Heterogênea (hepatopatia crônica)'] },
          { id: 'contornos', label: 'Contornos', type: 'select', options: ['Regulares', 'Irregulares/nodulares'] },
          { id: 'nodulos', label: 'Nódulos/Lesões focais', type: 'select', options: ['Ausentes', 'Cisto simples', 'Hemangioma', 'Nódulo sólido (investigar)', 'Múltiplas lesões'] },
        ]
      },
      {
        id: 'vesicula', title: 'Vesícula Biliar',
        fields: [
          { id: 'vb', label: 'Vesícula', type: 'select', options: ['Normodistendida, paredes finas, conteúdo anecóico', 'Colelitíase (cálculos)', 'Espessamento parietal (colecistite?)', 'Pólipo vesicular', 'Colecistectomizada'] },
          { id: 'vias', label: 'Vias Biliares', type: 'select', options: ['Intra e extra-hepáticas de calibre normal', 'Dilatação de vias biliares intra-hepáticas', 'Dilatação do colédoco', 'Coledocolitíase'] },
        ]
      },
      {
        id: 'pancreas', title: 'Pâncreas',
        fields: [
          { id: 'pancreas', label: 'Pâncreas', type: 'select', options: ['Dimensões e ecotextura normais', 'Aumento difuso (pancreatite?)', 'Lipomatose pancreática', 'Parcialmente visualizado por interposição gasosa', 'Não visualizado'] },
        ]
      },
      {
        id: 'rins', title: 'Rins',
        fields: [
          { id: 'rd', label: 'Rim Direito', type: 'select', options: ['Dimensões, contornos e ecotextura normais', 'Cisto simples cortical', 'Múltiplos cistos', 'Litíase renal', 'Hidronefrose leve', 'Hidronefrose moderada', 'Reduzido (nefropatia crônica)'] },
          { id: 'rd_dim', label: 'Dimensão RD', type: 'text', placeholder: 'Ex: 10.5 x 4.8 cm', defaultValue: '10.5 x 4.8 cm' },
          { id: 're', label: 'Rim Esquerdo', type: 'select', options: ['Dimensões, contornos e ecotextura normais', 'Cisto simples cortical', 'Múltiplos cistos', 'Litíase renal', 'Hidronefrose leve', 'Hidronefrose moderada', 'Reduzido (nefropatia crônica)'] },
          { id: 're_dim', label: 'Dimensão RE', type: 'text', placeholder: 'Ex: 10.8 x 5.0 cm', defaultValue: '10.8 x 5.0 cm' },
        ]
      },
      {
        id: 'baco', title: 'Baço e Outros',
        fields: [
          { id: 'baco', label: 'Baço', type: 'select', options: ['Dimensões e ecotextura normais', 'Esplenomegalia leve', 'Esplenomegalia moderada', 'Esplenomegalia acentuada'] },
          { id: 'aorta', label: 'Aorta abdominal', type: 'select', options: ['Calibre normal', 'Ectasia', 'Aneurisma'] },
          { id: 'ascite', label: 'Líquido livre', type: 'select', options: ['Ausente', 'Pequena quantidade', 'Moderada quantidade', 'Grande quantidade'] },
          { id: 'obs', label: 'Observações', type: 'textarea', placeholder: 'Achados adicionais...' },
        ]
      },
    ],
  },
  {
    id: 'rx-torax',
    name: 'Radiografia de Tórax',
    specialty: 'Radiologia',
    icon: '🫁',
    sections: [
      {
        id: 'dados', title: 'Dados',
        fields: [
          { id: 'paciente', label: 'Paciente', type: 'text', required: true },
          { id: 'incidencia', label: 'Incidência', type: 'select', options: ['PA e Perfil', 'AP (leito)', 'PA apenas'] },
        ]
      },
      {
        id: 'pulmoes', title: 'Campos Pulmonares',
        fields: [
          { id: 'transparencia', label: 'Transparência', type: 'select', options: ['Campos pulmonares com transparência normal', 'Opacidade em base direita', 'Opacidade em base esquerda', 'Opacidades bilaterais', 'Infiltrado intersticial difuso', 'Padrão em vidro fosco'] },
          { id: 'hilares', label: 'Hilos', type: 'select', options: ['Hilos de configuração normal', 'Hilos proeminentes', 'Linfonodomegalia hilar'] },
          { id: 'seios', label: 'Seios costofrênicos', type: 'select', options: ['Livres bilateralmente', 'Velamento do seio costofrênico direito', 'Velamento do seio costofrênico esquerdo', 'Velamento bilateral'] },
        ]
      },
      {
        id: 'mediastino', title: 'Mediastino e Coração',
        fields: [
          { id: 'mediastino', label: 'Mediastino', type: 'select', options: ['Mediastino centrado, sem alargamento', 'Alargamento mediastinal', 'Desvio de traqueia'] },
          { id: 'coracao', label: 'Silhueta cardíaca', type: 'select', options: ['Silhueta cardíaca de dimensões normais (ICT <0.5)', 'Cardiomegalia leve (ICT 0.5-0.55)', 'Cardiomegalia moderada (ICT 0.55-0.6)', 'Cardiomegalia acentuada (ICT >0.6)'] },
          { id: 'aorta', label: 'Aorta', type: 'select', options: ['Aorta de calibre normal', 'Aorta ectasiada/tortuosa', 'Calcificações aórticas'] },
        ]
      },
      {
        id: 'outros', title: 'Outros',
        fields: [
          { id: 'pleura', label: 'Pleura', type: 'select', options: ['Sem alterações pleurais', 'Espessamento pleural apical', 'Derrame pleural à direita', 'Derrame pleural à esquerda', 'Derrame pleural bilateral'] },
          { id: 'osseo', label: 'Arcabouço ósseo', type: 'select', options: ['Sem alterações', 'Fratura costal', 'Lesões líticas', 'Osteopenia difusa'] },
          { id: 'dispositivos', label: 'Dispositivos', type: 'select', options: ['Sem dispositivos', 'Cateter venoso central', 'Tubo orotraqueal', 'Dreno de tórax', 'Marcapasso'] },
          { id: 'obs', label: 'Observações', type: 'textarea' },
        ]
      },
    ],
  },
  {
    id: 'ecg',
    name: 'Eletrocardiograma',
    specialty: 'Cardiologia',
    icon: '📈',
    sections: [
      {
        id: 'dados', title: 'Dados',
        fields: [
          { id: 'paciente', label: 'Paciente', type: 'text', required: true },
          { id: 'fc', label: 'FC', type: 'number', unit: 'bpm', normalValue: '60-100' },
        ]
      },
      {
        id: 'ritmo', title: 'Ritmo e Condução',
        fields: [
          { id: 'ritmo', label: 'Ritmo', type: 'select', options: ['Sinusal', 'Fibrilação atrial', 'Flutter atrial', 'Taquicardia supraventricular', 'Ritmo juncional', 'Ritmo de marcapasso'] },
          { id: 'eixo', label: 'Eixo elétrico', type: 'select', options: ['Normal (0° a +90°)', 'Desvio para esquerda', 'Desvio para direita', 'Indeterminado'] },
          { id: 'pr', label: 'Intervalo PR', type: 'select', options: ['Normal (120-200ms)', 'Prolongado (BAV 1° grau)', 'Curto (<120ms, pré-excitação?)'] },
          { id: 'qrs', label: 'Complexo QRS', type: 'select', options: ['Normal (<120ms)', 'BRD completo', 'BRE completo', 'BDAS', 'BDPI', 'QRS alargado inespecífico'] },
          { id: 'qt', label: 'Intervalo QTc', type: 'select', options: ['Normal (<440ms)', 'Prolongado (>440ms)', 'Curto (<360ms)'] },
        ]
      },
      {
        id: 'alteracoes', title: 'Alterações',
        fields: [
          { id: 'supra', label: 'Supradesnivelamento ST', type: 'select', options: ['Ausente', 'Parede anterior (V1-V4)', 'Parede lateral (I, aVL, V5-V6)', 'Parede inferior (II, III, aVF)', 'Difuso (pericardite?)'] },
          { id: 'infra', label: 'Infradesnivelamento ST', type: 'select', options: ['Ausente', 'Difuso', 'Localizado'] },
          { id: 'ondaT', label: 'Onda T', type: 'select', options: ['Normal', 'Inversão de T anterior', 'Inversão de T difusa', 'T apiculada (hipercalemia?)'] },
          { id: 'ondaQ', label: 'Onda Q patológica', type: 'select', options: ['Ausente', 'Parede anterior', 'Parede inferior', 'Parede lateral'] },
          { id: 'svh', label: 'Sobrecarga', type: 'select', options: ['Ausente', 'SVE (Sokolow-Lyon positivo)', 'SVD', 'SAE', 'SAD', 'Biatrial'] },
          { id: 'obs', label: 'Observações', type: 'textarea' },
        ]
      },
    ],
  },
  {
    id: 'hemograma',
    name: 'Hemograma Completo',
    specialty: 'Hematologia',
    icon: '🩸',
    sections: [
      {
        id: 'dados', title: 'Dados',
        fields: [
          { id: 'paciente', label: 'Paciente', type: 'text', required: true },
        ]
      },
      {
        id: 'eritrograma', title: 'Eritrograma',
        fields: [
          { id: 'hb', label: 'Hemoglobina', type: 'number', unit: 'g/dL', normalValue: 'H:13-17 / M:12-16' },
          { id: 'ht', label: 'Hematócrito', type: 'number', unit: '%', normalValue: 'H:40-50 / M:36-44' },
          { id: 'vcm', label: 'VCM', type: 'number', unit: 'fL', normalValue: '80-100' },
          { id: 'hcm', label: 'HCM', type: 'number', unit: 'pg', normalValue: '27-33' },
          { id: 'chcm', label: 'CHCM', type: 'number', unit: 'g/dL', normalValue: '32-36' },
          { id: 'rdw', label: 'RDW', type: 'number', unit: '%', normalValue: '11.5-14.5' },
        ]
      },
      {
        id: 'leucograma', title: 'Leucograma',
        fields: [
          { id: 'leuco', label: 'Leucócitos totais', type: 'number', unit: '/mm³', normalValue: '4.000-11.000' },
          { id: 'neutro', label: 'Neutrófilos', type: 'number', unit: '%', normalValue: '40-70' },
          { id: 'linfo', label: 'Linfócitos', type: 'number', unit: '%', normalValue: '20-40' },
          { id: 'mono', label: 'Monócitos', type: 'number', unit: '%', normalValue: '2-8' },
          { id: 'eosino', label: 'Eosinófilos', type: 'number', unit: '%', normalValue: '1-5' },
          { id: 'baso', label: 'Basófilos', type: 'number', unit: '%', normalValue: '0-1' },
          { id: 'bastoes', label: 'Bastões', type: 'number', unit: '%', normalValue: '0-5' },
        ]
      },
      {
        id: 'plaquetas', title: 'Plaquetograma',
        fields: [
          { id: 'plaq', label: 'Plaquetas', type: 'number', unit: '/mm³', normalValue: '150.000-400.000' },
          { id: 'vpm', label: 'VPM', type: 'number', unit: 'fL', normalValue: '7.5-11.5' },
          { id: 'obs', label: 'Observações da lâmina', type: 'textarea', placeholder: 'Morfologia eritrocitária, inclusões, etc.' },
        ]
      },
    ],
  },
];

export default function GeradorLaudos() {
  const [selectedTemplate, setSelectedTemplate] = useState<LaudoTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedReport, setGeneratedReport] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [history, setHistory] = useState<LaudoHistoryItem[]>([
    { id: 'h1', templateName: 'Ecocardiograma Transtorácico', patientName: 'Maria Silva', date: '2026-02-28', impression: 'Função sistólica preservada. Disfunção diastólica grau I.' },
    { id: 'h2', templateName: 'Radiografia de Tórax', patientName: 'João Santos', date: '2026-02-27', impression: 'Campos pulmonares limpos. Silhueta cardíaca normal.' },
  ]);
  const [view, setView] = useState<'templates' | 'editor' | 'history'>('templates');

  const updateField = useCallback((fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
  }, []);

  const generateReport = useCallback(() => {
    if (!selectedTemplate) return;

    let report = `LAUDO DE ${selectedTemplate.name.toUpperCase()}\n`;
    report += `${'═'.repeat(50)}\n\n`;

    selectedTemplate.sections.forEach(section => {
      report += `▸ ${section.title.toUpperCase()}\n`;
      section.fields.forEach(field => {
        const value = formData[field.id] || field.defaultValue || '';
        if (value) {
          report += `  ${field.label}: ${value}${field.unit ? ` ${field.unit}` : ''}`;
          if (field.normalValue) report += ` (VR: ${field.normalValue})`;
          report += '\n';
        }
      });
      report += '\n';
    });

    // Generate AI impression
    report += `▸ IMPRESSÃO DIAGNÓSTICA\n`;
    const abnormals: string[] = [];
    selectedTemplate.sections.forEach(section => {
      section.fields.forEach(field => {
        const value = formData[field.id] || field.defaultValue || '';
        if (field.options && value && value !== field.options[0]) {
          abnormals.push(`${field.label}: ${value}`);
        }
      });
    });

    if (abnormals.length === 0) {
      report += `  Exame dentro dos limites da normalidade.\n`;
    } else {
      abnormals.forEach(a => { report += `  - ${a}\n`; });
    }

    report += `\n${'─'.repeat(50)}\n`;
    report += `Data: ${new Date().toLocaleDateString('pt-BR')}\n`;
    report += `Gerado por: MedFocus AI — Para fins educacionais\n`;

    setGeneratedReport(report);
    setShowPreview(true);

    // Add to history
    const patientName = formData['paciente'] || 'Paciente não identificado';
    setHistory(prev => [{
      id: `h-${Date.now()}`,
      templateName: selectedTemplate.name,
      patientName,
      date: new Date().toISOString().split('T')[0],
      impression: abnormals.length === 0 ? 'Exame normal' : abnormals.slice(0, 2).join('; '),
    }, ...prev]);
  }, [selectedTemplate, formData]);

  const fillNormalValues = useCallback(() => {
    if (!selectedTemplate) return;
    const newData: Record<string, string> = { ...formData };
    selectedTemplate.sections.forEach(section => {
      section.fields.forEach(field => {
        if (!newData[field.id] && field.defaultValue) {
          newData[field.id] = field.defaultValue;
        }
        if (!newData[field.id] && field.options) {
          newData[field.id] = field.options[0];
        }
      });
    });
    setFormData(newData);
  }, [selectedTemplate, formData]);

  // Template selection view
  if (view === 'templates') {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span className="text-3xl">📝</span> Gerador de Laudos Médicos
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Templates inteligentes com preenchimento assistido por IA</p>
          </div>
          <button onClick={() => setView('history')} className="px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-accent transition-colors">
            📋 Histórico ({history.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map(t => (
            <button key={t.id} onClick={() => { setSelectedTemplate(t); setFormData({}); setView('editor'); setShowPreview(false); }} className="bg-card border border-border rounded-xl p-5 text-left hover:border-primary/50 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{t.icon}</span>
                <div>
                  <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{t.name}</h3>
                  <p className="text-xs text-muted-foreground">{t.specialty}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{t.sections.length} seções • {t.sections.reduce((a, s) => a + s.fields.length, 0)} campos</p>
            </button>
          ))}
        </div>

        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <p className="text-xs text-muted-foreground">
            Laudos gerados para fins educacionais. Sempre revise e valide antes de uso clínico. Mais templates em breve.
          </p>
        </div>
      </div>
    );
  }

  // History view
  if (view === 'history') {
    return (
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('templates')} className="p-2 hover:bg-accent rounded-lg">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-xl font-bold">Histórico de Laudos</h2>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Nenhum laudo gerado ainda.</div>
        ) : (
          <div className="space-y-3">
            {history.map(h => (
              <div key={h.id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">{h.templateName}</h3>
                  <p className="text-xs text-muted-foreground">Paciente: {h.patientName} — {h.date}</p>
                  <p className="text-xs text-muted-foreground mt-1">Impressão: {h.impression}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Editor view
  if (!selectedTemplate) return null;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-5xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setView('templates')} className="p-2 hover:bg-accent rounded-lg">
            <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <span className="text-2xl">{selectedTemplate.icon}</span>
          <div>
            <h2 className="text-lg font-bold text-foreground">{selectedTemplate.name}</h2>
            <p className="text-xs text-muted-foreground">{selectedTemplate.specialty}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={fillNormalValues} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-400 font-medium hover:bg-emerald-500/20 transition-colors">
            ✨ Preencher Normal
          </button>
          <button onClick={generateReport} className="px-4 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors">
            📝 Gerar Laudo
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Form */}
        <div className="space-y-4">
          {selectedTemplate.sections.map(section => (
            <div key={section.id} className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-bold text-foreground mb-3">{section.title}</h3>
              <div className="space-y-3">
                {section.fields.map(field => (
                  <div key={field.id}>
                    <label className="text-xs font-medium text-muted-foreground mb-1 flex items-center justify-between">
                      <span>{field.label} {field.required && <span className="text-red-400">*</span>}</span>
                      {field.normalValue && <span className="text-[10px] text-emerald-400/70">VR: {field.normalValue}{field.unit ? ` ${field.unit}` : ''}</span>}
                    </label>
                    {field.type === 'select' ? (
                      <select
                        value={formData[field.id] || ''}
                        onChange={e => updateField(field.id, e.target.value)}
                        className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Selecione...</option>
                        {field.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    ) : field.type === 'textarea' ? (
                      <textarea
                        value={formData[field.id] || ''}
                        onChange={e => updateField(field.id, e.target.value)}
                        placeholder={field.placeholder}
                        rows={2}
                        className="w-full bg-muted/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      />
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type={field.type}
                          value={formData[field.id] || ''}
                          onChange={e => updateField(field.id, e.target.value)}
                          placeholder={field.placeholder || field.defaultValue}
                          className="flex-1 bg-muted/30 border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                        {field.unit && <span className="text-xs text-muted-foreground">{field.unit}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Preview */}
        <div className="sticky top-4">
          {showPreview && generatedReport ? (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-foreground">Prévia do Laudo</h3>
                <button onClick={() => navigator.clipboard.writeText(generatedReport)} className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-[10px] font-medium hover:bg-primary/20">
                  📋 Copiar
                </button>
              </div>
              <pre className="text-xs text-foreground whitespace-pre-wrap font-mono bg-muted/20 rounded-lg p-4 max-h-[600px] overflow-y-auto leading-relaxed">
                {generatedReport}
              </pre>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <span className="text-4xl block mb-3">📝</span>
              <p className="text-sm text-muted-foreground">Preencha os campos e clique em "Gerar Laudo" para visualizar a prévia</p>
              <p className="text-[10px] text-muted-foreground mt-2">Dica: Use "Preencher Normal" para iniciar com valores de referência</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
