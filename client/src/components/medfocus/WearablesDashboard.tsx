/**
 * WearablesDashboard - Metriport Integration
 * Displays wearable device data (Fitbit, Garmin, Apple Health, etc.)
 * with health score, activity tracking, sleep analysis, and biometrics.
 */
import React, { useState, useEffect } from 'react';

interface WearableProvider {
  id: string;
  name: string;
  category: string;
  icon: string;
  connected?: boolean;
}

interface HealthMetric {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
  trend?: 'up' | 'down' | 'stable';
  status?: string;
}

interface HealthScoreBreakdown {
  metric: string;
  score: number;
  maxScore: number;
  status: string;
}

export default function WearablesDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'sleep' | 'biometrics' | 'nutrition' | 'devices'>('overview');
  const [connectedDevices, setConnectedDevices] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [healthScore, setHealthScore] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const providers: WearableProvider[] = [
    { id: 'fitbit', name: 'Fitbit', category: 'Fitness Tracker', icon: '⌚' },
    { id: 'garmin', name: 'Garmin', category: 'Fitness/GPS Watch', icon: '🏃' },
    { id: 'apple', name: 'Apple Health', category: 'Health Platform', icon: '🍎' },
    { id: 'google', name: 'Google Fit', category: 'Health Platform', icon: '🔵' },
    { id: 'withings', name: 'Withings', category: 'Health Devices', icon: '⚕️' },
    { id: 'oura', name: 'Oura Ring', category: 'Sleep/Recovery', icon: '💍' },
    { id: 'whoop', name: 'WHOOP', category: 'Performance', icon: '💪' },
    { id: 'dexcom', name: 'Dexcom', category: 'Glucose Monitor', icon: '🩸' },
    { id: 'cronometer', name: 'Cronometer', category: 'Nutrition', icon: '🥗' },
    { id: 'tenovi', name: 'Tenovi', category: 'Remote Monitoring', icon: '📡' },
  ];

  // Demo data for visualization
  const overviewMetrics: HealthMetric[] = [
    { label: 'Passos Hoje', value: '8.432', unit: 'passos', icon: '👟', color: 'from-blue-500 to-cyan-500', trend: 'up', status: 'Bom' },
    { label: 'Calorias', value: '1.847', unit: 'kcal', icon: '🔥', color: 'from-orange-500 to-red-500', trend: 'stable', status: 'Normal' },
    { label: 'Frequencia Cardiaca', value: '72', unit: 'bpm', icon: '❤️', color: 'from-red-500 to-pink-500', trend: 'stable', status: 'Normal' },
    { label: 'Sono', value: '7.2', unit: 'horas', icon: '😴', color: 'from-indigo-500 to-purple-500', trend: 'up', status: 'Bom' },
    { label: 'SpO2', value: '98', unit: '%', icon: '🫁', color: 'from-teal-500 to-emerald-500', trend: 'stable', status: 'Normal' },
    { label: 'Peso', value: '75.4', unit: 'kg', icon: '⚖️', color: 'from-gray-500 to-slate-500', trend: 'down', status: 'Estavel' },
  ];

  const scoreBreakdown: HealthScoreBreakdown[] = [
    { metric: 'Passos Diarios', score: 15, maxScore: 20, status: 'Bom' },
    { metric: 'Qualidade do Sono', score: 20, maxScore: 25, status: 'Bom' },
    { metric: 'FC em Repouso', score: 15, maxScore: 20, status: 'Normal' },
    { metric: 'Saturacao O2', score: 15, maxScore: 15, status: 'Normal' },
    { metric: 'Gasto Calorico', score: 15, maxScore: 20, status: 'Moderado' },
  ];

  const totalScore = scoreBreakdown.reduce((sum, item) => sum + item.score, 0);

  const tabs = [
    { id: 'overview', label: 'Visao Geral', icon: '📊' },
    { id: 'activity', label: 'Atividade', icon: '🏃' },
    { id: 'sleep', label: 'Sono', icon: '😴' },
    { id: 'biometrics', label: 'Biometria', icon: '❤️' },
    { id: 'nutrition', label: 'Nutricao', icon: '🥗' },
    { id: 'devices', label: 'Dispositivos', icon: '⌚' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900/50 to-teal-900/50 rounded-2xl p-6 border border-emerald-700/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-2xl">⌚</div>
            <div>
              <h2 className="text-2xl font-bold text-white">Wearables e Saude Digital</h2>
              <p className="text-emerald-300 text-sm">Dados de dispositivos conectados via Metriport - Fitbit, Garmin, Apple Health e mais</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Health Score */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Health Score</h3>
              <div className="text-3xl font-bold text-emerald-400">{totalScore}/100</div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-4 rounded-full transition-all duration-1000"
                style={{ width: `${totalScore}%` }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {scoreBreakdown.map((item, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">{item.metric}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-white font-bold">{item.score}/{item.maxScore}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      item.status === 'Excelente' || item.status === 'Atletico' ? 'bg-emerald-900 text-emerald-300' :
                      item.status === 'Bom' || item.status === 'Normal' ? 'bg-blue-900 text-blue-300' :
                      item.status === 'Moderado' || item.status === 'Regular' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}>{item.status}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: `${(item.score / item.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {overviewMetrics.map((metric, i) => (
              <div key={i} className="bg-gray-900 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{metric.icon}</span>
                  {metric.trend && (
                    <span className={`text-xs ${
                      metric.trend === 'up' ? 'text-emerald-400' :
                      metric.trend === 'down' ? 'text-red-400' : 'text-gray-400'
                    }`}>
                      {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : '→'}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-bold text-white">{metric.value}</div>
                <div className="text-xs text-gray-400">{metric.unit}</div>
                <div className="text-xs text-gray-500 mt-1">{metric.label}</div>
                {metric.status && (
                  <span className={`inline-block text-xs px-2 py-0.5 rounded mt-2 ${
                    metric.status === 'Bom' ? 'bg-emerald-900/50 text-emerald-300' :
                    metric.status === 'Normal' ? 'bg-blue-900/50 text-blue-300' :
                    'bg-gray-800 text-gray-400'
                  }`}>{metric.status}</span>
                )}
              </div>
            ))}
          </div>

          {/* Weekly Activity Chart Placeholder */}
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Atividade Semanal</h3>
            <div className="flex items-end gap-2 h-40">
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'].map((day, i) => {
                const heights = [65, 80, 45, 90, 70, 95, 55];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${heights[i]}%` }}
                    />
                    <span className="text-xs text-gray-400">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Dados de Atividade Fisica</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">👟</div>
                <div className="text-2xl font-bold text-white">8.432</div>
                <div className="text-xs text-gray-400">Passos</div>
                <div className="text-xs text-emerald-400 mt-1">84% da meta</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">📏</div>
                <div className="text-2xl font-bold text-white">6.2</div>
                <div className="text-xs text-gray-400">Km percorridos</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-2xl font-bold text-white">1.847</div>
                <div className="text-xs text-gray-400">Calorias totais</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-4 text-center">
                <div className="text-3xl mb-2">🏔️</div>
                <div className="text-2xl font-bold text-white">12</div>
                <div className="text-xs text-gray-400">Andares subidos</div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">Intensidade por Periodo</h3>
            <div className="space-y-3">
              {[
                { label: 'Repouso', hours: '16h 30min', pct: 69, color: 'bg-gray-600' },
                { label: 'Leve', hours: '4h 15min', pct: 18, color: 'bg-blue-500' },
                { label: 'Moderada', hours: '2h 30min', pct: 10, color: 'bg-yellow-500' },
                { label: 'Intensa', hours: '45min', pct: 3, color: 'bg-red-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-24">{item.label}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-3">
                    <div className={`${item.color} h-3 rounded-full`} style={{ width: `${item.pct}%` }} />
                  </div>
                  <span className="text-sm text-white w-20 text-right">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sleep Tab */}
      {activeTab === 'sleep' && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Analise do Sono</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-indigo-900/30 rounded-lg p-4 text-center border border-indigo-700/30">
                <div className="text-2xl font-bold text-indigo-300">7h 12min</div>
                <div className="text-xs text-gray-400">Tempo Total</div>
              </div>
              <div className="bg-purple-900/30 rounded-lg p-4 text-center border border-purple-700/30">
                <div className="text-2xl font-bold text-purple-300">1h 45min</div>
                <div className="text-xs text-gray-400">Sono Profundo</div>
              </div>
              <div className="bg-blue-900/30 rounded-lg p-4 text-center border border-blue-700/30">
                <div className="text-2xl font-bold text-blue-300">1h 30min</div>
                <div className="text-xs text-gray-400">Sono REM</div>
              </div>
              <div className="bg-emerald-900/30 rounded-lg p-4 text-center border border-emerald-700/30">
                <div className="text-2xl font-bold text-emerald-300">Bom</div>
                <div className="text-xs text-gray-400">Qualidade</div>
              </div>
            </div>

            <h4 className="text-sm font-bold text-gray-300 mb-3">Estagios do Sono</h4>
            <div className="space-y-2">
              {[
                { stage: 'Acordado', duration: '32min', pct: 7, color: 'bg-red-400' },
                { stage: 'Sono Leve', duration: '3h 25min', pct: 47, color: 'bg-blue-400' },
                { stage: 'Sono Profundo', duration: '1h 45min', pct: 24, color: 'bg-indigo-600' },
                { stage: 'Sono REM', duration: '1h 30min', pct: 21, color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 w-28">{item.stage}</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-4">
                    <div className={`${item.color} h-4 rounded-full flex items-center justify-end pr-2`} style={{ width: `${item.pct}%` }}>
                      <span className="text-xs text-white font-bold">{item.pct}%</span>
                    </div>
                  </div>
                  <span className="text-sm text-white w-20 text-right">{item.duration}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">Biometria durante o Sono</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-red-400">58 bpm</div>
                <div className="text-xs text-gray-400">FC Media</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-blue-400">14.2 rpm</div>
                <div className="text-xs text-gray-400">Respiracao</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center">
                <div className="text-xl font-bold text-emerald-400">42ms</div>
                <div className="text-xs text-gray-400">HRV (RMSSD)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Biometrics Tab */}
      {activeTab === 'biometrics' && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Dados Biometricos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Frequencia Cardiaca', icon: '❤️', values: [
                  { label: 'Repouso', value: '62 bpm', status: 'normal' },
                  { label: 'Media', value: '72 bpm', status: 'normal' },
                  { label: 'Maxima', value: '145 bpm', status: 'normal' },
                ]},
                { title: 'Pressao Arterial', icon: '🩺', values: [
                  { label: 'Sistolica', value: '120 mmHg', status: 'normal' },
                  { label: 'Diastolica', value: '78 mmHg', status: 'normal' },
                  { label: 'Classificacao', value: 'Normal', status: 'good' },
                ]},
                { title: 'Saturacao de Oxigenio', icon: '🫁', values: [
                  { label: 'Media', value: '98%', status: 'normal' },
                  { label: 'Minima', value: '95%', status: 'normal' },
                  { label: 'Status', value: 'Normal', status: 'good' },
                ]},
                { title: 'Temperatura', icon: '🌡️', values: [
                  { label: 'Corporal', value: '36.5 C', status: 'normal' },
                  { label: 'Pele', value: '33.2 C', status: 'normal' },
                  { label: 'Variacao', value: '+0.1 C', status: 'normal' },
                ]},
              ].map((section, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{section.icon}</span>
                    <h4 className="text-white font-bold">{section.title}</h4>
                  </div>
                  <div className="space-y-2">
                    {section.values.map((v, j) => (
                      <div key={j} className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">{v.label}</span>
                        <span className={`text-sm font-bold ${
                          v.status === 'good' ? 'text-emerald-400' :
                          v.status === 'normal' ? 'text-white' :
                          v.status === 'warning' ? 'text-yellow-400' : 'text-red-400'
                        }`}>{v.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">Glicemia (Dexcom)</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gray-800 rounded-lg p-3 text-center flex-1">
                <div className="text-xl font-bold text-emerald-400">95 mg/dL</div>
                <div className="text-xs text-gray-400">Atual</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center flex-1">
                <div className="text-xl font-bold text-white">102 mg/dL</div>
                <div className="text-xs text-gray-400">Media 24h</div>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 text-center flex-1">
                <div className="text-xl font-bold text-blue-400">5.4%</div>
                <div className="text-xs text-gray-400">HbA1c Estimada</div>
              </div>
            </div>
            <div className="text-center text-gray-500 text-sm">
              Conecte um monitor Dexcom para ver dados em tempo real
            </div>
          </div>
        </div>
      )}

      {/* Nutrition Tab */}
      {activeTab === 'nutrition' && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Dados Nutricionais</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-orange-900/30 rounded-lg p-4 text-center border border-orange-700/30">
                <div className="text-2xl font-bold text-orange-300">1.847</div>
                <div className="text-xs text-gray-400">Calorias</div>
              </div>
              <div className="bg-blue-900/30 rounded-lg p-4 text-center border border-blue-700/30">
                <div className="text-2xl font-bold text-blue-300">85g</div>
                <div className="text-xs text-gray-400">Proteinas</div>
              </div>
              <div className="bg-yellow-900/30 rounded-lg p-4 text-center border border-yellow-700/30">
                <div className="text-2xl font-bold text-yellow-300">220g</div>
                <div className="text-xs text-gray-400">Carboidratos</div>
              </div>
              <div className="bg-red-900/30 rounded-lg p-4 text-center border border-red-700/30">
                <div className="text-2xl font-bold text-red-300">65g</div>
                <div className="text-xs text-gray-400">Gorduras</div>
              </div>
            </div>

            <h4 className="text-sm font-bold text-gray-300 mb-3">Distribuicao de Macros</h4>
            <div className="flex h-6 rounded-full overflow-hidden mb-2">
              <div className="bg-blue-500" style={{ width: '30%' }} />
              <div className="bg-yellow-500" style={{ width: '45%' }} />
              <div className="bg-red-500" style={{ width: '25%' }} />
            </div>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Proteinas 30%</span>
              <span>Carboidratos 45%</span>
              <span>Gorduras 25%</span>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">Hidratacao</h3>
            <div className="flex items-center gap-4">
              <div className="text-4xl">💧</div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white font-bold">1.8L / 2.5L</span>
                  <span className="text-blue-400 text-sm">72%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div className="bg-blue-500 h-3 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Devices Tab */}
      {activeTab === 'devices' && (
        <div className="space-y-4">
          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">Dispositivos Compativeis</h3>
            <p className="text-gray-400 text-sm mb-4">
              Conecte seus dispositivos de saude para monitoramento integrado. Dados sincronizados automaticamente via Metriport.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  className={`bg-gray-800 rounded-xl p-4 border text-center transition-all hover:border-emerald-500/50 ${
                    connectedDevices.includes(provider.id) ? 'border-emerald-500' : 'border-gray-700'
                  }`}
                >
                  <div className="text-3xl mb-2">{provider.icon}</div>
                  <div className="text-white text-sm font-bold">{provider.name}</div>
                  <div className="text-xs text-gray-500">{provider.category}</div>
                  {connectedDevices.includes(provider.id) ? (
                    <span className="inline-block mt-2 text-xs bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">Conectado</span>
                  ) : (
                    <span className="inline-block mt-2 text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded">Conectar</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-3">Como Conectar</h3>
            <div className="space-y-3">
              {[
                { step: '1', text: 'Clique no dispositivo que deseja conectar' },
                { step: '2', text: 'Autorize o acesso aos seus dados de saude' },
                { step: '3', text: 'Os dados serao sincronizados automaticamente' },
                { step: '4', text: 'Acompanhe suas metricas no painel integrado' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">{item.step}</div>
                  <span className="text-gray-300 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
