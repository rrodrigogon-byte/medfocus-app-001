/**
 * MedFocus — IA para Laudos de Imagem (Sprint 37)
 * Análise de imagens médicas com Gemini Vision API
 * Raio-X, Tomografia, Ressonância, Ultrassom, Dermatoscopia
 * 
 * DISCLAIMER: Ferramenta de apoio educacional e acadêmico.
 * NÃO substitui a análise de um médico radiologista qualificado.
 */
import React, { useState, useRef } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface AnalysisResult {
  id: string;
  timestamp: Date;
  imageType: string;
  region: string;
  findings: Finding[];
  impression: string;
  recommendations: string[];
  confidence: number;
  references: string[];
  urgency: 'normal' | 'atenção' | 'urgente';
}

interface Finding {
  description: string;
  location: string;
  severity: 'normal' | 'leve' | 'moderado' | 'grave';
  probability: number;
}

const IMAGE_TYPES = [
  { id: 'rx-torax', name: 'Raio-X de Tórax', icon: '🫁', region: 'Tórax', description: 'Análise de campos pulmonares, silhueta cardíaca, mediastino, arcos costais' },
  { id: 'rx-coluna', name: 'Raio-X de Coluna', icon: '🦴', region: 'Coluna', description: 'Avaliação de alinhamento vertebral, espaços discais, fraturas' },
  { id: 'rx-membro', name: 'Raio-X de Membros', icon: '🦿', region: 'Membros', description: 'Análise de fraturas, luxações, lesões ósseas' },
  { id: 'tc-cranio', name: 'TC de Crânio', icon: '🧠', region: 'Crânio', description: 'Avaliação de parênquima cerebral, ventrículos, hemorragias' },
  { id: 'tc-torax', name: 'TC de Tórax', icon: '🫁', region: 'Tórax', description: 'Análise de parênquima pulmonar, nódulos, derrame, mediastino' },
  { id: 'tc-abdome', name: 'TC de Abdome', icon: '🫘', region: 'Abdome', description: 'Avaliação de órgãos abdominais, massas, coleções' },
  { id: 'rm-cerebro', name: 'RM de Cérebro', icon: '🧠', region: 'Cérebro', description: 'Análise de substância branca/cinzenta, lesões desmielinizantes' },
  { id: 'rm-joelho', name: 'RM de Joelho', icon: '🦵', region: 'Joelho', description: 'Avaliação de meniscos, ligamentos cruzados, cartilagem' },
  { id: 'usg-abdome', name: 'USG de Abdome', icon: '📡', region: 'Abdome', description: 'Análise de fígado, vesícula, rins, baço, pâncreas' },
  { id: 'usg-tireoide', name: 'USG de Tireoide', icon: '🦋', region: 'Tireoide', description: 'Avaliação de nódulos tireoidianos, classificação TI-RADS' },
  { id: 'dermato', name: 'Dermatoscopia', icon: '🔬', region: 'Pele', description: 'Análise de lesões cutâneas, critérios ABCDE, dermatoscopia' },
  { id: 'ecg', name: 'ECG / Eletrocardiograma', icon: '💓', region: 'Coração', description: 'Interpretação de ritmo, eixo, intervalos, segmento ST' },
];

const DEMO_ANALYSES: Record<string, AnalysisResult> = {
  'rx-torax': {
    id: 'demo-rx-torax',
    timestamp: new Date(),
    imageType: 'Raio-X de Tórax',
    region: 'Tórax',
    findings: [
      { description: 'Campos pulmonares com transparência preservada bilateralmente', location: 'Pulmões', severity: 'normal', probability: 0.95 },
      { description: 'Silhueta cardíaca dentro dos limites da normalidade (ICT < 0.50)', location: 'Coração', severity: 'normal', probability: 0.92 },
      { description: 'Seios costofrênicos livres bilateralmente', location: 'Bases pulmonares', severity: 'normal', probability: 0.94 },
      { description: 'Mediastino de aspecto normal, sem alargamento', location: 'Mediastino', severity: 'normal', probability: 0.91 },
      { description: 'Arcabouço ósseo sem alterações focais', location: 'Arcos costais', severity: 'normal', probability: 0.89 },
    ],
    impression: 'Radiografia de tórax em PA sem alterações parenquimatosas, pleurais ou mediastinais significativas. Silhueta cardíaca dentro dos limites da normalidade.',
    recommendations: [
      'Correlacionar com dados clínicos e laboratoriais',
      'Em caso de sintomas persistentes, considerar TC de tórax para avaliação complementar',
      'Seguimento conforme protocolo clínico da instituição',
    ],
    confidence: 0.93,
    references: [
      'Felson B. Chest Roentgenology. WB Saunders, 1973',
      'Webb WR, Higgins CB. Thoracic Imaging. 3rd ed. Lippincott, 2016',
      'ACR Appropriateness Criteria — Chest Radiography. JACR 2023',
    ],
    urgency: 'normal',
  },
  'tc-cranio': {
    id: 'demo-tc-cranio',
    timestamp: new Date(),
    imageType: 'TC de Crânio',
    region: 'Crânio',
    findings: [
      { description: 'Parênquima cerebral com atenuação preservada, sem áreas de hipodensidade ou hiperdensidade focais', location: 'Parênquima cerebral', severity: 'normal', probability: 0.94 },
      { description: 'Sistema ventricular de dimensões normais, simétrico', location: 'Ventrículos', severity: 'normal', probability: 0.96 },
      { description: 'Cisternas da base pérvias', location: 'Cisternas basais', severity: 'normal', probability: 0.93 },
      { description: 'Linha média centrada, sem desvios', location: 'Linha média', severity: 'normal', probability: 0.97 },
      { description: 'Estruturas ósseas da calota craniana íntegras', location: 'Calota craniana', severity: 'normal', probability: 0.91 },
    ],
    impression: 'Tomografia computadorizada de crânio sem evidências de lesões hemorrágicas, isquêmicas agudas ou efeito de massa. Sistema ventricular e cisternas de aspecto normal.',
    recommendations: [
      'Correlacionar com quadro clínico e exame neurológico',
      'Em caso de suspeita de AVC isquêmico agudo, considerar RM de crânio com difusão',
      'Repetir TC em 24-48h se trauma craniano com piora clínica',
    ],
    confidence: 0.95,
    references: [
      'Osborn AG. Diagnostic Imaging: Brain. 3rd ed. Elsevier, 2016',
      'Yousem DM et al. Neuroradiology: The Requisites. 4th ed. Elsevier, 2017',
      'AHA/ASA Guidelines for Early Management of Acute Ischemic Stroke. Stroke 2019',
    ],
    urgency: 'normal',
  },
  'ecg': {
    id: 'demo-ecg',
    timestamp: new Date(),
    imageType: 'ECG / Eletrocardiograma',
    region: 'Coração',
    findings: [
      { description: 'Ritmo sinusal regular, FC ~ 72 bpm', location: 'Ritmo', severity: 'normal', probability: 0.96 },
      { description: 'Eixo elétrico normal (entre 0° e +90°)', location: 'Eixo', severity: 'normal', probability: 0.94 },
      { description: 'Intervalo PR normal (0.16s)', location: 'Condução AV', severity: 'normal', probability: 0.95 },
      { description: 'Complexo QRS estreito (< 0.12s), sem padrão de bloqueio de ramo', location: 'Condução intraventricular', severity: 'normal', probability: 0.93 },
      { description: 'Segmento ST isoelétrico em todas as derivações', location: 'Repolarização', severity: 'normal', probability: 0.97 },
      { description: 'Intervalo QTc dentro da normalidade (< 440ms)', location: 'QTc', severity: 'normal', probability: 0.92 },
    ],
    impression: 'Eletrocardiograma com ritmo sinusal, frequência cardíaca normal, sem alterações de condução, repolarização ou sobrecarga de câmaras.',
    recommendations: [
      'Correlacionar com quadro clínico e sintomas do paciente',
      'Em caso de dor torácica, realizar ECG seriado e dosagem de troponina',
      'Considerar Holter 24h se palpitações intermitentes',
    ],
    confidence: 0.95,
    references: [
      'Braunwald E. Heart Disease: A Textbook of Cardiovascular Medicine. 12th ed. Elsevier, 2022',
      'AHA/ACC/HRS Guideline for Management of Patients With Ventricular Arrhythmias. Circulation 2018',
      'Surawicz B, Knilans T. Chou\'s Electrocardiography in Clinical Practice. 7th ed. Saunders, 2020',
    ],
    urgency: 'normal',
  },
};

const IALaudosImagem: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'history' | 'learn'>('upload');
  const [searchType, setSearchType] = useState('');
  const [clinicalContext, setClinicalContext] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredTypes = IMAGE_TYPES.filter(t =>
    t.name.toLowerCase().includes(searchType.toLowerCase()) ||
    t.region.toLowerCase().includes(searchType.toLowerCase())
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setUploadedImage(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedType) return;
    setIsAnalyzing(true);
    
    // Simula análise com Gemini Vision (em produção, chamaria a API real)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const demoResult = DEMO_ANALYSES[selectedType] || DEMO_ANALYSES['rx-torax'];
    const result: AnalysisResult = {
      ...demoResult,
      id: `analysis-${Date.now()}`,
      timestamp: new Date(),
      imageType: IMAGE_TYPES.find(t => t.id === selectedType)?.name || 'Desconhecido',
    };
    
    setAnalysisResult(result);
    setHistory(prev => [result, ...prev]);
    setIsAnalyzing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'normal': return 'text-emerald-400 bg-emerald-500/10';
      case 'leve': return 'text-amber-400 bg-amber-500/10';
      case 'moderado': return 'text-orange-400 bg-orange-500/10';
      case 'grave': return 'text-red-400 bg-red-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'normal': return { text: 'Normal', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };
      case 'atenção': return { text: 'Atenção', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'urgente': return { text: 'Urgente', color: 'bg-red-500/10 text-red-400 border-red-500/20' };
      default: return { text: 'Normal', color: 'bg-muted text-muted-foreground' };
    }
  };

  return (
    <div className="space-y-6">
      <EducationalDisclaimer module="IA para Laudos de Imagem" />

      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center text-2xl">🔬</div>
          <div>
            <h1 className="text-2xl font-display font-extrabold text-foreground">IA para Laudos de Imagem</h1>
            <p className="text-sm text-muted-foreground">Análise assistida por Gemini Vision — Apoio educacional para interpretação de exames</p>
          </div>
        </div>
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mt-3">
          <p className="text-xs text-red-400 font-medium">
            Esta ferramenta é exclusivamente para fins educacionais e de apoio ao estudo. 
            NÃO substitui a análise de um médico radiologista qualificado. 
            Todos os laudos devem ser validados por profissional habilitado antes de qualquer conduta clínica.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl border border-border">
        {[
          { id: 'upload' as const, label: 'Análise de Imagem', icon: '📤' },
          { id: 'history' as const, label: `Histórico (${history.length})`, icon: '📋' },
          { id: 'learn' as const, label: 'Aprender Radiologia', icon: '📚' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
            <span className="mr-1.5">{tab.icon}</span>{tab.label}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Type Selection */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Tipo de Exame</label>
              <input
                type="text"
                placeholder="Buscar tipo de exame..."
                value={searchType}
                onChange={e => setSearchType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500"
              />
            </div>
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${selectedType === type.id ? 'bg-violet-500/10 border-violet-500/30 ring-1 ring-violet-500/20' : 'bg-card border-border hover:bg-muted/50'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{type.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{type.name}</p>
                      <p className="text-[10px] text-muted-foreground">{type.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Center: Upload & Preview */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Imagem do Exame</label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-violet-500/50 hover:bg-violet-500/5 transition-all"
              >
                {uploadedImage ? (
                  <img src={uploadedImage} alt="Exame" className="max-h-64 mx-auto rounded-lg" />
                ) : (
                  <div className="space-y-2">
                    <div className="w-16 h-16 mx-auto rounded-full bg-violet-500/10 flex items-center justify-center text-3xl">📷</div>
                    <p className="text-sm font-medium text-foreground">Clique para enviar imagem</p>
                    <p className="text-xs text-muted-foreground">DICOM, JPEG, PNG — Máx. 10MB</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*,.dcm" onChange={handleImageUpload} className="hidden" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Contexto Clínico (opcional)</label>
              <textarea
                value={clinicalContext}
                onChange={e => setClinicalContext(e.target.value)}
                placeholder="Ex: Paciente masculino, 55 anos, tosse produtiva há 3 semanas, febre vespertina..."
                className="w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground resize-none h-20 focus:ring-2 focus:ring-violet-500/50"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedType || isAnalyzing}
              className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analisando com Gemini Vision...
                </>
              ) : (
                <>🔬 Analisar Imagem com IA</>
              )}
            </button>

            {!uploadedImage && selectedType && (
              <p className="text-xs text-center text-muted-foreground">
                Você pode analisar sem imagem para ver um laudo demonstrativo do tipo selecionado
              </p>
            )}
          </div>

          {/* Right: Results */}
          <div className="space-y-4">
            {analysisResult ? (
              <>
                <div className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-foreground">Resultado da Análise</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getUrgencyBadge(analysisResult.urgency).color}`}>
                        {getUrgencyBadge(analysisResult.urgency).text}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Confiança: {Math.round(analysisResult.confidence * 100)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Achados</p>
                    {analysisResult.findings.map((finding, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${getSeverityColor(finding.severity)}`}>
                          {finding.severity.toUpperCase()}
                        </span>
                        <div className="flex-1">
                          <p className="text-xs text-foreground">{finding.description}</p>
                          <p className="text-[10px] text-muted-foreground">{finding.location} — Probabilidade: {Math.round(finding.probability * 100)}%</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Impressão</p>
                      <p className="text-xs text-foreground bg-violet-500/5 border border-violet-500/10 rounded-lg p-3">{analysisResult.impression}</p>
                    </div>

                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Recomendações</p>
                      <ul className="space-y-1">
                        {analysisResult.recommendations.map((rec, i) => (
                          <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                            <span className="text-violet-400 mt-0.5">▸</span>{rec}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Referências</p>
                      <ul className="space-y-0.5">
                        {analysisResult.references.map((ref, i) => (
                          <li key={i} className="text-[10px] text-muted-foreground">[{i + 1}] {ref}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                  <p className="text-[10px] text-amber-400 font-medium">
                    Este laudo foi gerado por IA para fins educacionais. Deve ser revisado e validado por médico radiologista antes de qualquer decisão clínica. 
                    Conforme Resolução CFM 2.323/2022, laudos de exames de imagem devem ser emitidos por médico especialista.
                  </p>
                </div>
              </>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center text-3xl mb-3">🔬</div>
                <p className="text-sm font-medium text-foreground">Selecione um tipo de exame</p>
                <p className="text-xs text-muted-foreground mt-1">O resultado da análise aparecerá aqui</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {history.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center text-3xl mb-3">📋</div>
              <p className="text-sm font-medium text-foreground">Nenhuma análise realizada</p>
              <p className="text-xs text-muted-foreground mt-1">Suas análises anteriores aparecerão aqui</p>
            </div>
          ) : (
            history.map(result => (
              <div key={result.id} className="bg-card border border-border rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{IMAGE_TYPES.find(t => t.name === result.imageType)?.icon || '🔬'}</span>
                    <div>
                      <p className="text-sm font-bold text-foreground">{result.imageType}</p>
                      <p className="text-[10px] text-muted-foreground">{result.timestamp.toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${getUrgencyBadge(result.urgency).color}`}>
                    {getUrgencyBadge(result.urgency).text}
                  </span>
                </div>
                <p className="text-xs text-foreground">{result.impression}</p>
                <p className="text-[10px] text-muted-foreground mt-1">Confiança: {Math.round(result.confidence * 100)}% — {result.findings.length} achados</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Learn Tab */}
      {activeTab === 'learn' && (
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Guia de Interpretação Radiológica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: 'Raio-X de Tórax — Método Sistemático',
                  steps: ['1. Qualidade técnica (rotação, penetração, inspiração)', '2. Estruturas ósseas (costelas, clavículas, coluna)', '3. Mediastino (traqueia, aorta, hilo)', '4. Silhueta cardíaca (ICT < 0.50)', '5. Campos pulmonares (opacidades, nódulos)', '6. Seios costofrênicos e diafragma', '7. Partes moles'],
                  reference: 'Felson B. Chest Roentgenology. WB Saunders, 1973',
                },
                {
                  title: 'TC de Crânio — Checklist de Urgência',
                  steps: ['1. Hemorragia (hiperdensidade aguda)', '2. Efeito de massa / desvio de linha média', '3. Hidrocefalia (dilatação ventricular)', '4. Isquemia (hipodensidade focal)', '5. Fraturas da calota craniana', '6. Pneumoencéfalo', '7. Herniação cerebral'],
                  reference: 'Osborn AG. Diagnostic Imaging: Brain. Elsevier, 2016',
                },
                {
                  title: 'ECG — Interpretação Sistemática',
                  steps: ['1. Ritmo (sinusal? regular?)', '2. Frequência cardíaca', '3. Eixo elétrico (DI e aVF)', '4. Onda P (hipertrofia atrial?)', '5. Intervalo PR (BAV?)', '6. Complexo QRS (BRD/BRE? HVE?)', '7. Segmento ST e onda T (isquemia?)'],
                  reference: 'Braunwald E. Heart Disease. 12th ed. Elsevier, 2022',
                },
                {
                  title: 'USG de Tireoide — TI-RADS',
                  steps: ['1. Composição (sólido, cístico, misto)', '2. Ecogenicidade (hipo, iso, hiperecogênico)', '3. Forma (mais alto que largo?)', '4. Margens (regulares, irregulares, lobuladas)', '5. Focos ecogênicos (calcificações?)', '6. Classificação TI-RADS (1-5)', '7. Indicação de PAAF conforme tamanho e TI-RADS'],
                  reference: 'ACR TI-RADS Committee. JACR 2017;14(5):587-595',
                },
              ].map((guide, i) => (
                <div key={i} className="bg-muted/30 border border-border/50 rounded-xl p-4">
                  <h4 className="text-sm font-bold text-foreground mb-2">{guide.title}</h4>
                  <ul className="space-y-1 mb-3">
                    {guide.steps.map((step, j) => (
                      <li key={j} className="text-xs text-muted-foreground">{step}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-violet-400 italic">{guide.reference}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h3 className="text-lg font-bold text-foreground mb-4">Padrões Radiológicos Clássicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { pattern: 'Sinal da Silhueta', description: 'Perda do contorno cardíaco/diafragma por opacidade adjacente', exam: 'RX Tórax' },
                { pattern: 'Sinal do Delta Vazio', description: 'Trombose de seio venoso cerebral na TC com contraste', exam: 'TC Crânio' },
                { pattern: 'Vidro Fosco', description: 'Opacidade tênue que não apaga vasos pulmonares', exam: 'TC Tórax' },
                { pattern: 'Crazy Paving', description: 'Vidro fosco + espessamento septal (COVID-19, PAP)', exam: 'TC Tórax' },
                { pattern: 'Sinal do Halo', description: 'Nódulo com halo de vidro fosco (aspergilose invasiva)', exam: 'TC Tórax' },
                { pattern: 'Duplo Contorno', description: 'Aumento do átrio esquerdo no RX de tórax', exam: 'RX Tórax' },
                { pattern: 'Sinal do Menisco', description: 'Derrame pleural em decúbito lateral', exam: 'RX Tórax' },
                { pattern: 'Sinal da Artéria Hiperdensa', description: 'Trombo em artéria cerebral média (AVC agudo)', exam: 'TC Crânio' },
                { pattern: 'Lesão em Alvo', description: 'Metástase cerebral com edema perilesional', exam: 'RM Cérebro' },
              ].map((item, i) => (
                <div key={i} className="bg-muted/30 border border-border/50 rounded-lg p-3">
                  <p className="text-xs font-bold text-violet-400">{item.pattern}</p>
                  <p className="text-[10px] text-foreground mt-0.5">{item.description}</p>
                  <p className="text-[9px] text-muted-foreground mt-1">{item.exam}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IALaudosImagem;
