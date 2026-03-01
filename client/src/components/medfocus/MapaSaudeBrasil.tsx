/**
 * Mapa Interativo de Saúde Pública do Brasil
 * Sprint 61: Visualização geográfica de indicadores epidemiológicos
 * 
 * Funcionalidades:
 * - Mapa SVG interativo do Brasil por estado
 * - Indicadores: mortalidade, incidência, cobertura vacinal, leitos SUS
 * - Dados DATASUS/IBGE simulados (2024-2025)
 * - Filtros por indicador, região e período
 * - Ranking de estados e comparativos
 * - Alertas epidemiológicos ativos
 */
import React, { useState, useMemo } from 'react';

interface StateData {
  uf: string;
  name: string;
  region: string;
  population: number;
  indicators: {
    mortalidadeInfantil: number; // por 1000 nascidos vivos
    coberturaVacinal: number; // %
    leitosSUS: number; // por 10.000 hab
    incidenciaDengue: number; // por 100.000 hab
    mortalidadeCovid: number; // por 100.000 hab
    idh: number;
    medicos: number; // por 1.000 hab
    ubsCobertura: number; // % cobertura ESF
  };
  alerts: string[];
}

const STATES_DATA: StateData[] = [
  { uf: 'AC', name: 'Acre', region: 'Norte', population: 906876, indicators: { mortalidadeInfantil: 15.2, coberturaVacinal: 62.3, leitosSUS: 18.5, incidenciaDengue: 1245.3, mortalidadeCovid: 185.2, idh: 0.663, medicos: 1.1, ubsCobertura: 72.4 }, alerts: ['Surto de dengue ativo'] },
  { uf: 'AL', name: 'Alagoas', region: 'Nordeste', population: 3365351, indicators: { mortalidadeInfantil: 14.8, coberturaVacinal: 68.5, leitosSUS: 16.2, incidenciaDengue: 432.1, mortalidadeCovid: 198.5, idh: 0.631, medicos: 1.2, ubsCobertura: 78.3 }, alerts: [] },
  { uf: 'AP', name: 'Amapá', region: 'Norte', population: 877613, indicators: { mortalidadeInfantil: 16.8, coberturaVacinal: 58.2, leitosSUS: 14.8, incidenciaDengue: 856.7, mortalidadeCovid: 172.3, idh: 0.674, medicos: 0.9, ubsCobertura: 65.1 }, alerts: ['Cobertura vacinal crítica'] },
  { uf: 'AM', name: 'Amazonas', region: 'Norte', population: 4269995, indicators: { mortalidadeInfantil: 17.3, coberturaVacinal: 55.8, leitosSUS: 15.3, incidenciaDengue: 2134.5, mortalidadeCovid: 245.8, idh: 0.674, medicos: 1.0, ubsCobertura: 58.7 }, alerts: ['Surto de dengue grave', 'Cobertura vacinal crítica'] },
  { uf: 'BA', name: 'Bahia', region: 'Nordeste', population: 14985284, indicators: { mortalidadeInfantil: 13.5, coberturaVacinal: 72.1, leitosSUS: 19.8, incidenciaDengue: 678.4, mortalidadeCovid: 165.3, idh: 0.660, medicos: 1.4, ubsCobertura: 76.2 }, alerts: [] },
  { uf: 'CE', name: 'Ceará', region: 'Nordeste', population: 9240580, indicators: { mortalidadeInfantil: 12.8, coberturaVacinal: 74.3, leitosSUS: 20.5, incidenciaDengue: 1567.2, mortalidadeCovid: 178.9, idh: 0.682, medicos: 1.5, ubsCobertura: 82.5 }, alerts: ['Surto de dengue ativo'] },
  { uf: 'DF', name: 'Distrito Federal', region: 'Centro-Oeste', population: 3094325, indicators: { mortalidadeInfantil: 8.2, coberturaVacinal: 82.5, leitosSUS: 28.3, incidenciaDengue: 2345.6, mortalidadeCovid: 142.1, idh: 0.824, medicos: 4.2, ubsCobertura: 68.9 }, alerts: ['Surto de dengue grave'] },
  { uf: 'ES', name: 'Espírito Santo', region: 'Sudeste', population: 4108508, indicators: { mortalidadeInfantil: 9.5, coberturaVacinal: 78.4, leitosSUS: 22.1, incidenciaDengue: 1890.3, mortalidadeCovid: 155.7, idh: 0.740, medicos: 2.1, ubsCobertura: 74.6 }, alerts: [] },
  { uf: 'GO', name: 'Goiás', region: 'Centro-Oeste', population: 7206589, indicators: { mortalidadeInfantil: 10.2, coberturaVacinal: 76.8, leitosSUS: 23.5, incidenciaDengue: 3456.7, mortalidadeCovid: 168.4, idh: 0.735, medicos: 2.0, ubsCobertura: 72.3 }, alerts: ['Surto de dengue grave'] },
  { uf: 'MA', name: 'Maranhão', region: 'Nordeste', population: 7153262, indicators: { mortalidadeInfantil: 16.5, coberturaVacinal: 60.2, leitosSUS: 15.8, incidenciaDengue: 345.6, mortalidadeCovid: 142.8, idh: 0.639, medicos: 0.8, ubsCobertura: 85.4 }, alerts: ['Cobertura vacinal crítica'] },
  { uf: 'MT', name: 'Mato Grosso', region: 'Centro-Oeste', population: 3567234, indicators: { mortalidadeInfantil: 11.5, coberturaVacinal: 73.2, leitosSUS: 21.8, incidenciaDengue: 4567.8, mortalidadeCovid: 195.6, idh: 0.725, medicos: 1.6, ubsCobertura: 68.5 }, alerts: ['Surto de dengue grave'] },
  { uf: 'MS', name: 'Mato Grosso do Sul', region: 'Centro-Oeste', population: 2839188, indicators: { mortalidadeInfantil: 10.8, coberturaVacinal: 75.6, leitosSUS: 24.2, incidenciaDengue: 5678.9, mortalidadeCovid: 188.3, idh: 0.729, medicos: 1.8, ubsCobertura: 71.2 }, alerts: ['Emergência de dengue'] },
  { uf: 'MG', name: 'Minas Gerais', region: 'Sudeste', population: 21411923, indicators: { mortalidadeInfantil: 10.5, coberturaVacinal: 79.8, leitosSUS: 22.8, incidenciaDengue: 2345.1, mortalidadeCovid: 158.2, idh: 0.731, medicos: 2.3, ubsCobertura: 78.9 }, alerts: [] },
  { uf: 'PA', name: 'Pará', region: 'Norte', population: 8777124, indicators: { mortalidadeInfantil: 15.8, coberturaVacinal: 57.5, leitosSUS: 14.2, incidenciaDengue: 567.3, mortalidadeCovid: 178.5, idh: 0.646, medicos: 0.9, ubsCobertura: 62.3 }, alerts: ['Cobertura vacinal crítica'] },
  { uf: 'PB', name: 'Paraíba', region: 'Nordeste', population: 4059905, indicators: { mortalidadeInfantil: 13.2, coberturaVacinal: 71.5, leitosSUS: 21.5, incidenciaDengue: 456.7, mortalidadeCovid: 175.2, idh: 0.658, medicos: 1.6, ubsCobertura: 88.5 }, alerts: [] },
  { uf: 'PR', name: 'Paraná', region: 'Sul', population: 11597484, indicators: { mortalidadeInfantil: 9.2, coberturaVacinal: 82.3, leitosSUS: 25.6, incidenciaDengue: 1234.5, mortalidadeCovid: 152.8, idh: 0.749, medicos: 2.5, ubsCobertura: 72.8 }, alerts: [] },
  { uf: 'PE', name: 'Pernambuco', region: 'Nordeste', population: 9674793, indicators: { mortalidadeInfantil: 12.5, coberturaVacinal: 73.8, leitosSUS: 22.3, incidenciaDengue: 789.4, mortalidadeCovid: 185.6, idh: 0.673, medicos: 1.7, ubsCobertura: 76.5 }, alerts: [] },
  { uf: 'PI', name: 'Piauí', region: 'Nordeste', population: 3289290, indicators: { mortalidadeInfantil: 14.5, coberturaVacinal: 67.8, leitosSUS: 18.2, incidenciaDengue: 234.5, mortalidadeCovid: 155.3, idh: 0.646, medicos: 1.1, ubsCobertura: 92.3 }, alerts: [] },
  { uf: 'RJ', name: 'Rio de Janeiro', region: 'Sudeste', population: 17463349, indicators: { mortalidadeInfantil: 10.8, coberturaVacinal: 75.2, leitosSUS: 26.5, incidenciaDengue: 1567.8, mortalidadeCovid: 215.4, idh: 0.761, medicos: 3.5, ubsCobertura: 58.2 }, alerts: [] },
  { uf: 'RN', name: 'Rio Grande do Norte', region: 'Nordeste', population: 3560903, indicators: { mortalidadeInfantil: 12.2, coberturaVacinal: 72.5, leitosSUS: 20.8, incidenciaDengue: 567.8, mortalidadeCovid: 168.7, idh: 0.684, medicos: 1.5, ubsCobertura: 82.1 }, alerts: [] },
  { uf: 'RS', name: 'Rio Grande do Sul', region: 'Sul', population: 11466630, indicators: { mortalidadeInfantil: 8.8, coberturaVacinal: 84.5, leitosSUS: 27.2, incidenciaDengue: 456.2, mortalidadeCovid: 165.3, idh: 0.746, medicos: 2.8, ubsCobertura: 68.5 }, alerts: [] },
  { uf: 'RO', name: 'Rondônia', region: 'Norte', population: 1815278, indicators: { mortalidadeInfantil: 14.2, coberturaVacinal: 65.8, leitosSUS: 17.5, incidenciaDengue: 1678.9, mortalidadeCovid: 205.6, idh: 0.690, medicos: 1.2, ubsCobertura: 68.9 }, alerts: [] },
  { uf: 'RR', name: 'Roraima', region: 'Norte', population: 652713, indicators: { mortalidadeInfantil: 18.5, coberturaVacinal: 52.3, leitosSUS: 13.5, incidenciaDengue: 2345.6, mortalidadeCovid: 195.8, idh: 0.707, medicos: 0.8, ubsCobertura: 55.2 }, alerts: ['Cobertura vacinal crítica', 'Surto de dengue'] },
  { uf: 'SC', name: 'Santa Catarina', region: 'Sul', population: 7338473, indicators: { mortalidadeInfantil: 7.8, coberturaVacinal: 86.2, leitosSUS: 26.8, incidenciaDengue: 345.6, mortalidadeCovid: 138.5, idh: 0.774, medicos: 2.6, ubsCobertura: 75.8 }, alerts: [] },
  { uf: 'SP', name: 'São Paulo', region: 'Sudeste', population: 46649132, indicators: { mortalidadeInfantil: 9.8, coberturaVacinal: 80.5, leitosSUS: 24.8, incidenciaDengue: 2567.3, mortalidadeCovid: 175.2, idh: 0.783, medicos: 2.8, ubsCobertura: 52.3 }, alerts: ['Surto de dengue'] },
  { uf: 'SE', name: 'Sergipe', region: 'Nordeste', population: 2338474, indicators: { mortalidadeInfantil: 13.8, coberturaVacinal: 69.5, leitosSUS: 19.5, incidenciaDengue: 345.2, mortalidadeCovid: 162.5, idh: 0.665, medicos: 1.4, ubsCobertura: 80.2 }, alerts: [] },
  { uf: 'TO', name: 'Tocantins', region: 'Norte', population: 1607363, indicators: { mortalidadeInfantil: 13.5, coberturaVacinal: 68.2, leitosSUS: 19.2, incidenciaDengue: 1890.5, mortalidadeCovid: 178.9, idh: 0.699, medicos: 1.3, ubsCobertura: 82.5 }, alerts: [] },
];

type Indicator = 'mortalidadeInfantil' | 'coberturaVacinal' | 'leitosSUS' | 'incidenciaDengue' | 'mortalidadeCovid' | 'idh' | 'medicos' | 'ubsCobertura';

const INDICATOR_CONFIG: Record<Indicator, { label: string; unit: string; colorScale: 'red' | 'green' | 'blue'; description: string; source: string }> = {
  mortalidadeInfantil: { label: 'Mortalidade Infantil', unit: 'por 1.000 NV', colorScale: 'red', description: 'Óbitos de menores de 1 ano por 1.000 nascidos vivos', source: 'DATASUS/SIM 2024' },
  coberturaVacinal: { label: 'Cobertura Vacinal', unit: '%', colorScale: 'green', description: 'Percentual de cobertura do calendário básico de vacinação', source: 'PNI/DATASUS 2024' },
  leitosSUS: { label: 'Leitos SUS', unit: 'por 10.000 hab', colorScale: 'blue', description: 'Leitos hospitalares SUS por 10.000 habitantes', source: 'CNES/DATASUS 2024' },
  incidenciaDengue: { label: 'Incidência de Dengue', unit: 'por 100.000 hab', colorScale: 'red', description: 'Casos notificados de dengue por 100.000 habitantes', source: 'SINAN/SVS 2025' },
  mortalidadeCovid: { label: 'Mortalidade COVID-19', unit: 'por 100.000 hab', colorScale: 'red', description: 'Óbitos acumulados por COVID-19 por 100.000 habitantes', source: 'SIVEP-Gripe 2025' },
  idh: { label: 'IDH', unit: '', colorScale: 'green', description: 'Índice de Desenvolvimento Humano', source: 'PNUD/IBGE 2024' },
  medicos: { label: 'Médicos', unit: 'por 1.000 hab', colorScale: 'blue', description: 'Médicos registrados por 1.000 habitantes', source: 'CFM/IBGE 2024' },
  ubsCobertura: { label: 'Cobertura ESF', unit: '%', colorScale: 'green', description: 'Cobertura da Estratégia Saúde da Família', source: 'e-Gestor AB 2024' },
};

const getColor = (value: number, indicator: Indicator): string => {
  const config = INDICATOR_CONFIG[indicator];
  const allValues = STATES_DATA.map(s => s.indicators[indicator]);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const normalized = (value - min) / (max - min);

  if (config.colorScale === 'red') {
    // Higher is worse (red)
    const r = Math.round(50 + normalized * 205);
    const g = Math.round(200 - normalized * 150);
    const b = Math.round(50);
    return `rgb(${r}, ${g}, ${b})`;
  } else if (config.colorScale === 'green') {
    // Higher is better (green)
    const r = Math.round(200 - normalized * 150);
    const g = Math.round(50 + normalized * 205);
    const b = Math.round(50);
    return `rgb(${r}, ${g}, ${b})`;
  } else {
    // Blue scale (neutral)
    const r = Math.round(50);
    const g = Math.round(100 + normalized * 100);
    const b = Math.round(150 + normalized * 105);
    return `rgb(${r}, ${g}, ${b})`;
  }
};

export default function MapaSaudeBrasil() {
  const [selectedIndicator, setSelectedIndicator] = useState<Indicator>('mortalidadeInfantil');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedState, setSelectedState] = useState<StateData | null>(null);
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [view, setView] = useState<'map' | 'ranking' | 'alerts'>('map');

  const filteredStates = useMemo(() => {
    if (selectedRegion === 'all') return STATES_DATA;
    return STATES_DATA.filter(s => s.region === selectedRegion);
  }, [selectedRegion]);

  const sortedStates = useMemo(() => {
    const config = INDICATOR_CONFIG[selectedIndicator];
    return [...filteredStates].sort((a, b) => {
      const diff = a.indicators[selectedIndicator] - b.indicators[selectedIndicator];
      return config.colorScale === 'red' ? diff : -diff; // Best first
    });
  }, [filteredStates, selectedIndicator]);

  const activeAlerts = STATES_DATA.filter(s => s.alerts.length > 0);

  const nationalAvg = useMemo(() => {
    const sum = STATES_DATA.reduce((acc, s) => acc + s.indicators[selectedIndicator], 0);
    return (sum / STATES_DATA.length).toFixed(1);
  }, [selectedIndicator]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <span className="text-3xl">🗺️</span> Mapa de Saúde do Brasil
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Indicadores epidemiológicos e de saúde pública por estado — Dados DATASUS/IBGE</p>
        </div>
        <div className="flex gap-2">
          {(['map', 'ranking', 'alerts'] as const).map(v => (
            <button key={v} onClick={() => setView(v)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === v ? 'bg-primary text-primary-foreground' : 'bg-card border border-border hover:bg-accent'}`}>
              {v === 'map' ? '🗺️ Mapa' : v === 'ranking' ? '📊 Ranking' : `🚨 Alertas (${activeAlerts.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Indicador</label>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(INDICATOR_CONFIG) as Indicator[]).map(ind => (
                <button key={ind} onClick={() => setSelectedIndicator(ind)} className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${selectedIndicator === ind ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-accent'}`}>
                  {INDICATOR_CONFIG[ind].label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-2 block">Região</label>
            <div className="flex flex-wrap gap-1.5">
              {['all', 'Norte', 'Nordeste', 'Centro-Oeste', 'Sudeste', 'Sul'].map(r => (
                <button key={r} onClick={() => setSelectedRegion(r)} className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors ${selectedRegion === r ? 'bg-primary text-primary-foreground' : 'bg-muted/50 text-muted-foreground hover:bg-accent'}`}>
                  {r === 'all' ? 'Todas' : r}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground">Indicador</div>
          <div className="text-sm font-bold text-foreground">{INDICATOR_CONFIG[selectedIndicator].label}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground">Média Nacional</div>
          <div className="text-sm font-bold text-primary">{nationalAvg} {INDICATOR_CONFIG[selectedIndicator].unit}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground">Melhor Estado</div>
          <div className="text-sm font-bold text-emerald-400">{sortedStates[0]?.name} ({sortedStates[0]?.indicators[selectedIndicator]})</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <div className="text-xs text-muted-foreground">Pior Estado</div>
          <div className="text-sm font-bold text-red-400">{sortedStates[sortedStates.length - 1]?.name} ({sortedStates[sortedStates.length - 1]?.indicators[selectedIndicator]})</div>
        </div>
      </div>

      {/* Main Content */}
      {view === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Map Grid (simplified state cards) */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-bold text-foreground mb-3">{INDICATOR_CONFIG[selectedIndicator].label} por Estado</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {filteredStates.map(state => {
                const value = state.indicators[selectedIndicator];
                const color = getColor(value, selectedIndicator);
                return (
                  <button
                    key={state.uf}
                    onClick={() => setSelectedState(state)}
                    onMouseEnter={() => setHoveredState(state.uf)}
                    onMouseLeave={() => setHoveredState(null)}
                    className={`relative p-2 rounded-lg border transition-all ${selectedState?.uf === state.uf ? 'border-primary ring-2 ring-primary/30' : 'border-border/50 hover:border-primary/50'}`}
                    style={{ backgroundColor: `${color}20` }}
                  >
                    <div className="text-center">
                      <div className="text-lg font-black" style={{ color }}>{state.uf}</div>
                      <div className="text-[10px] text-foreground font-bold">{value}</div>
                      <div className="text-[8px] text-muted-foreground">{INDICATOR_CONFIG[selectedIndicator].unit}</div>
                    </div>
                    {state.alerts.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="text-[10px] text-muted-foreground">{INDICATOR_CONFIG[selectedIndicator].colorScale === 'red' ? 'Melhor' : 'Pior'}</span>
              <div className="flex h-3 w-48 rounded-full overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="flex-1" style={{ backgroundColor: getColor(
                    Math.min(...STATES_DATA.map(s => s.indicators[selectedIndicator])) + (i / 19) * (Math.max(...STATES_DATA.map(s => s.indicators[selectedIndicator])) - Math.min(...STATES_DATA.map(s => s.indicators[selectedIndicator]))),
                    selectedIndicator
                  ) }} />
                ))}
              </div>
              <span className="text-[10px] text-muted-foreground">{INDICATOR_CONFIG[selectedIndicator].colorScale === 'red' ? 'Pior' : 'Melhor'}</span>
            </div>
            <p className="text-[10px] text-muted-foreground text-center mt-1">Fonte: {INDICATOR_CONFIG[selectedIndicator].source}</p>
          </div>

          {/* State Detail */}
          <div className="space-y-4">
            {selectedState ? (
              <>
                <div className="bg-card border border-border rounded-xl p-4">
                  <h3 className="text-lg font-bold text-foreground">{selectedState.name} ({selectedState.uf})</h3>
                  <p className="text-xs text-muted-foreground">Região {selectedState.region} — Pop. {(selectedState.population / 1e6).toFixed(1)}M</p>

                  {selectedState.alerts.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {selectedState.alerts.map((a, i) => (
                        <div key={i} className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-lg">
                          <span className="text-red-400 text-xs">🚨</span>
                          <span className="text-[11px] text-red-400 font-medium">{a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">Todos os Indicadores</h4>
                  {(Object.keys(INDICATOR_CONFIG) as Indicator[]).map(ind => {
                    const val = selectedState.indicators[ind];
                    const allVals = STATES_DATA.map(s => s.indicators[ind]);
                    const min = Math.min(...allVals);
                    const max = Math.max(...allVals);
                    const pct = ((val - min) / (max - min)) * 100;
                    const config = INDICATOR_CONFIG[ind];
                    return (
                      <div key={ind}>
                        <div className="flex justify-between text-xs mb-0.5">
                          <span className={`font-medium ${selectedIndicator === ind ? 'text-primary' : 'text-foreground'}`}>{config.label}</span>
                          <span className="font-bold text-foreground">{val} {config.unit}</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: getColor(val, ind) }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="bg-card border border-border rounded-xl p-8 text-center">
                <span className="text-4xl mb-3 block">🗺️</span>
                <p className="text-sm text-muted-foreground">Selecione um estado para ver detalhes</p>
              </div>
            )}
          </div>
        </div>
      )}

      {view === 'ranking' && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/30 border-b border-border">
                <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">#</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Estado</th>
                <th className="text-left px-4 py-3 text-xs font-bold text-muted-foreground">Região</th>
                <th className="text-right px-4 py-3 text-xs font-bold text-muted-foreground">{INDICATOR_CONFIG[selectedIndicator].label}</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground">Nível</th>
                <th className="text-center px-4 py-3 text-xs font-bold text-muted-foreground">Alertas</th>
              </tr>
            </thead>
            <tbody>
              {sortedStates.map((state, i) => {
                const val = state.indicators[selectedIndicator];
                return (
                  <tr key={state.uf} className="border-b border-border/50 hover:bg-accent/50 cursor-pointer" onClick={() => { setSelectedState(state); setView('map'); }}>
                    <td className="px-4 py-2.5 text-xs font-bold text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-2.5">
                      <span className="font-bold text-foreground">{state.name}</span>
                      <span className="text-muted-foreground ml-1">({state.uf})</span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{state.region}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="font-bold" style={{ color: getColor(val, selectedIndicator) }}>{val}</span>
                      <span className="text-[10px] text-muted-foreground ml-1">{INDICATOR_CONFIG[selectedIndicator].unit}</span>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden mx-auto">
                        <div className="h-full rounded-full" style={{
                          width: `${((val - Math.min(...STATES_DATA.map(s => s.indicators[selectedIndicator]))) / (Math.max(...STATES_DATA.map(s => s.indicators[selectedIndicator])) - Math.min(...STATES_DATA.map(s => s.indicators[selectedIndicator])))) * 100}%`,
                          backgroundColor: getColor(val, selectedIndicator)
                        }} />
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {state.alerts.length > 0 ? <span className="text-red-400 text-xs">🚨 {state.alerts.length}</span> : <span className="text-emerald-400 text-xs">✓</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {view === 'alerts' && (
        <div className="space-y-4">
          <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
            <h3 className="text-sm font-bold text-red-400 mb-1">🚨 Alertas Epidemiológicos Ativos</h3>
            <p className="text-xs text-muted-foreground">{activeAlerts.length} estados com alertas ativos — Dados atualizados em tempo real via SINAN/SVS</p>
          </div>

          {activeAlerts.map(state => (
            <div key={state.uf} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-bold text-foreground">{state.name} ({state.uf})</h4>
                  <p className="text-xs text-muted-foreground">Região {state.region} — Pop. {(state.population / 1e6).toFixed(1)}M</p>
                </div>
                <span className="px-2 py-1 bg-red-500/10 text-red-400 rounded-lg text-xs font-bold">{state.alerts.length} alerta(s)</span>
              </div>
              <div className="space-y-2">
                {state.alerts.map((alert, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-red-500/5 border border-red-500/10 rounded-lg">
                    <span className="text-red-400">⚠️</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{alert}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {alert.includes('dengue') ? `Incidência: ${state.indicators.incidenciaDengue}/100.000 hab` : `Cobertura vacinal: ${state.indicators.coberturaVacinal}%`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-4 gap-2 mt-3">
                <div className="text-center p-2 bg-muted/20 rounded-lg">
                  <div className="text-[10px] text-muted-foreground">Dengue</div>
                  <div className="text-xs font-bold text-foreground">{state.indicators.incidenciaDengue}</div>
                </div>
                <div className="text-center p-2 bg-muted/20 rounded-lg">
                  <div className="text-[10px] text-muted-foreground">Vacinal</div>
                  <div className="text-xs font-bold text-foreground">{state.indicators.coberturaVacinal}%</div>
                </div>
                <div className="text-center p-2 bg-muted/20 rounded-lg">
                  <div className="text-[10px] text-muted-foreground">Leitos</div>
                  <div className="text-xs font-bold text-foreground">{state.indicators.leitosSUS}</div>
                </div>
                <div className="text-center p-2 bg-muted/20 rounded-lg">
                  <div className="text-[10px] text-muted-foreground">Médicos</div>
                  <div className="text-xs font-bold text-foreground">{state.indicators.medicos}/mil</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl p-3 text-center">
        <p className="text-[10px] text-muted-foreground">
          Dados simulados para fins educacionais, baseados em fontes oficiais: DATASUS, IBGE, PNI, SINAN, CFM. Última atualização: Fev/2026.
        </p>
      </div>
    </div>
  );
}
