/**
 * MedicalApisHub - Central Hub for all Medical API Integrations
 * Shows status, usage, and quick access to PubMed, Infermedica, GCP Healthcare, and Metriport.
 */
import React, { useState } from 'react';

interface ApiCard {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  status: 'active' | 'configured' | 'not_configured';
  features: string[];
  tier: string;
  link: string;
}

export default function MedicalApisHub() {
  const [selectedApi, setSelectedApi] = useState<string | null>(null);

  const apis: ApiCard[] = [
    {
      id: 'pubmed',
      name: 'PubMed / Entrez',
      description: 'Busca avancada de artigos cientificos com acesso a milhoes de citacoes, resumos e publicacoes do NCBI/PubMed.',
      icon: '📚',
      color: 'amber',
      gradient: 'from-amber-900/50 to-orange-900/50',
      status: 'active',
      features: [
        'Busca avancada com filtros por data, tipo e idioma',
        'Artigos relacionados e citacoes',
        'Busca por especialidade medica',
        'Ensaios clinicos e revisoes sistematicas',
        'Topicos em alta na medicina',
        'Geracao automatica de citacoes (APA, Vancouver, ABNT)',
        'Analise critica por IA integrada',
      ],
      tier: 'Gratuita - Sem limites',
      link: '/pubmed-research',
    },
    {
      id: 'infermedica',
      name: 'Infermedica',
      description: 'Triagem e verificacao de sintomas baseada em IA. Logica de diagnostico e encaminhamento inteligente de pacientes.',
      icon: '🩺',
      color: 'blue',
      gradient: 'from-blue-900/50 to-indigo-900/50',
      status: 'configured',
      features: [
        'Verificacao de sintomas com IA',
        'Triagem inteligente (Protocolo Manchester)',
        'Analise de linguagem natural (NLP)',
        'Sugestao de sintomas relacionados',
        'Explicacao detalhada de condicoes',
        'Base com 1.500+ sintomas e 800+ condicoes',
        'Fatores de risco personalizados',
      ],
      tier: 'Free Tier para desenvolvedores',
      link: '/symptom-checker',
    },
    {
      id: 'gcp-healthcare',
      name: 'Google Cloud Healthcare',
      description: 'Suporte aos padroes FHIR R4, HL7v2 e DICOM. Armazenamento seguro de dados clinicos estruturados na nuvem.',
      icon: '☁️',
      color: 'teal',
      gradient: 'from-teal-900/50 to-cyan-900/50',
      status: 'configured',
      features: [
        'FHIR R4 - Pacientes, Observacoes, Condicoes',
        'Prescricoes e Encontros clinicos',
        'HL7v2 - Mensagens de integracao hospitalar',
        'DICOM - Imagens medicas (CT, MRI, Raio-X)',
        'Bundle Transactions para operacoes em lote',
        'Patient Everything - Dados completos do paciente',
        '1 GB gratuito de armazenamento',
      ],
      tier: 'Free Tier - 1 GB armazenamento',
      link: '/healthcare-fhir',
    },
    {
      id: 'metriport',
      name: 'Metriport',
      description: 'Consolidacao de dados de pacientes de multiplas fontes. Integracao com wearables (Fitbit, Garmin, Apple Health).',
      icon: '⌚',
      color: 'emerald',
      gradient: 'from-emerald-900/50 to-green-900/50',
      status: 'configured',
      features: [
        'Dados de 10+ dispositivos wearables',
        'Atividade fisica, sono, biometria e nutricao',
        'Consolidacao FHIR de multiplas fontes',
        'Documentos medicos unificados',
        'Health Score calculado automaticamente',
        'Monitoramento remoto de pacientes',
        'API open-source e extensivel',
      ],
      tier: 'Open Source - Gratuito',
      link: '/wearables',
    },
  ];

  const statusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-1 text-xs rounded-full bg-emerald-900 text-emerald-300 font-bold">Ativo</span>;
      case 'configured':
        return <span className="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-300 font-bold">Configurado</span>;
      default:
        return <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-400 font-bold">Nao Configurado</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900/50 to-purple-900/50 rounded-2xl p-6 border border-violet-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-violet-600 rounded-xl flex items-center justify-center text-2xl">🔗</div>
          <div>
            <h2 className="text-2xl font-bold text-white">APIs Medicas Integradas</h2>
            <p className="text-violet-300 text-sm">
              Central de integracao com PubMed, Infermedica, Google Cloud Healthcare e Metriport
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
          <div className="text-3xl font-bold text-emerald-400">4</div>
          <div className="text-xs text-gray-400">APIs Integradas</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
          <div className="text-3xl font-bold text-blue-400">36M+</div>
          <div className="text-xs text-gray-400">Artigos PubMed</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
          <div className="text-3xl font-bold text-purple-400">1.500+</div>
          <div className="text-xs text-gray-400">Sintomas Infermedica</div>
        </div>
        <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 text-center">
          <div className="text-3xl font-bold text-teal-400">10+</div>
          <div className="text-xs text-gray-400">Wearables Suportados</div>
        </div>
      </div>

      {/* API Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apis.map((api) => (
          <div
            key={api.id}
            className={`bg-gradient-to-br ${api.gradient} rounded-xl p-5 border border-gray-700 hover:border-gray-600 transition-all cursor-pointer`}
            onClick={() => setSelectedApi(selectedApi === api.id ? null : api.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{api.icon}</div>
                <div>
                  <h3 className="text-lg font-bold text-white">{api.name}</h3>
                  <span className="text-xs text-gray-400">{api.tier}</span>
                </div>
              </div>
              {statusBadge(api.status)}
            </div>

            <p className="text-gray-300 text-sm mb-4">{api.description}</p>

            {selectedApi === api.id && (
              <div className="space-y-3 mt-4 pt-4 border-t border-gray-700/50">
                <h4 className="text-sm font-bold text-white">Funcionalidades:</h4>
                <ul className="space-y-1">
                  {api.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                      <span className="text-emerald-400">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between mt-4">
              <span className="text-xs text-gray-500">
                Clique para {selectedApi === api.id ? 'recolher' : 'expandir'}
              </span>
              <span className="text-xs text-gray-500">
                {selectedApi === api.id ? '▲' : '▼'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Integration Architecture */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Arquitetura de Integracao</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-emerald-400 font-bold text-sm mb-2">Camada de Dados</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>PubMed Entrez E-utilities</li>
              <li>Google Cloud Healthcare FHIR R4</li>
              <li>Metriport FHIR Consolidado</li>
              <li>DICOM / HL7v2</li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-blue-400 font-bold text-sm mb-2">Camada de Inteligencia</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>Infermedica Symptom Checker</li>
              <li>Dr. Focus IA (Gemini/GPT)</li>
              <li>Analise Critica de Artigos</li>
              <li>Health Score Algorithm</li>
            </ul>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-purple-400 font-bold text-sm mb-2">Camada de Apresentacao</h4>
            <ul className="space-y-1 text-xs text-gray-400">
              <li>Dashboard de Wearables</li>
              <li>Pesquisa PubMed Avancada</li>
              <li>Triagem de Sintomas</li>
              <li>Prontuario FHIR do Paciente</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Environment Variables Guide */}
      <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <h3 className="text-lg font-bold text-white mb-4">Configuracao de Variaveis de Ambiente</h3>
        <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm space-y-2">
          <div className="text-gray-500"># PubMed (opcional - aumenta limites)</div>
          <div className="text-emerald-400">NCBI_API_KEY=sua_chave_ncbi</div>
          <div className="text-gray-500 mt-3"># Infermedica (obrigatorio)</div>
          <div className="text-blue-400">INFERMEDICA_APP_ID=seu_app_id</div>
          <div className="text-blue-400">INFERMEDICA_APP_KEY=sua_app_key</div>
          <div className="text-gray-500 mt-3"># Google Cloud Healthcare (obrigatorio)</div>
          <div className="text-teal-400">GCP_PROJECT_ID=seu_projeto_gcp</div>
          <div className="text-teal-400">GCP_HEALTHCARE_LOCATION=southamerica-east1</div>
          <div className="text-teal-400">GCP_HEALTHCARE_DATASET=medfocus-health</div>
          <div className="text-teal-400">GCP_FHIR_STORE=medfocus-fhir</div>
          <div className="text-gray-500 mt-3"># Metriport (obrigatorio)</div>
          <div className="text-purple-400">METRIPORT_API_KEY=sua_chave_metriport</div>
          <div className="text-purple-400">METRIPORT_FACILITY_ID=seu_facility_id</div>
        </div>
      </div>
    </div>
  );
}
