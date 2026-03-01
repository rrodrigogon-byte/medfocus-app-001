/**
 * FHIRPatientRecord - Electronic Health Record (EHR) using GCP Healthcare API
 * Displays patient data in FHIR R4 format: demographics, conditions, medications,
 * observations, encounters, and DICOM images.
 */
import React, { useState } from 'react';

interface PatientData {
  id: string;
  name: string;
  birthDate: string;
  gender: string;
  cpf?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface Condition {
  id: string;
  code: string;
  display: string;
  status: string;
  severity: string;
  onsetDate: string;
  category: string;
}

interface Observation {
  id: string;
  code: string;
  display: string;
  value: string;
  unit: string;
  date: string;
  status: string;
  category: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  status: string;
  prescriber: string;
  startDate: string;
}

interface Encounter {
  id: string;
  type: string;
  status: string;
  date: string;
  reason: string;
  practitioner: string;
  location: string;
}

export default function FHIRPatientRecord() {
  const [activeTab, setActiveTab] = useState<'demographics' | 'conditions' | 'medications' | 'observations' | 'encounters' | 'dicom'>('demographics');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);

  // Demo data
  const demoPatient: PatientData = {
    id: 'fhir-001',
    name: 'Maria Silva Santos',
    birthDate: '1985-03-15',
    gender: 'Feminino',
    cpf: '***.***.***-12',
    phone: '(11) 9****-1234',
    email: 'm***@email.com',
    address: 'Sao Paulo, SP',
  };

  const demoConditions: Condition[] = [
    { id: 'c1', code: 'I10', display: 'Hipertensao Arterial Sistemica', status: 'active', severity: 'moderate', onsetDate: '2020-06-15', category: 'Cardiovascular' },
    { id: 'c2', code: 'E11', display: 'Diabetes Mellitus Tipo 2', status: 'active', severity: 'moderate', onsetDate: '2021-01-20', category: 'Endocrinologia' },
    { id: 'c3', code: 'J45', display: 'Asma', status: 'active', severity: 'mild', onsetDate: '2015-09-10', category: 'Pneumologia' },
    { id: 'c4', code: 'K21', display: 'Doenca do Refluxo Gastroesofagico', status: 'resolved', severity: 'mild', onsetDate: '2022-03-05', category: 'Gastroenterologia' },
  ];

  const demoObservations: Observation[] = [
    { id: 'o1', code: '85354-9', display: 'Pressao Arterial', value: '130/85', unit: 'mmHg', date: '2026-02-28', status: 'final', category: 'Sinais Vitais' },
    { id: 'o2', code: '8867-4', display: 'Frequencia Cardiaca', value: '72', unit: 'bpm', date: '2026-02-28', status: 'final', category: 'Sinais Vitais' },
    { id: 'o3', code: '2339-0', display: 'Glicemia de Jejum', value: '126', unit: 'mg/dL', date: '2026-02-25', status: 'final', category: 'Laboratorio' },
    { id: 'o4', code: '4548-4', display: 'Hemoglobina Glicada (HbA1c)', value: '7.2', unit: '%', date: '2026-02-25', status: 'final', category: 'Laboratorio' },
    { id: 'o5', code: '29463-7', display: 'Peso Corporal', value: '75.4', unit: 'kg', date: '2026-02-28', status: 'final', category: 'Sinais Vitais' },
    { id: 'o6', code: '8302-2', display: 'Altura', value: '165', unit: 'cm', date: '2026-02-28', status: 'final', category: 'Sinais Vitais' },
    { id: 'o7', code: '39156-5', display: 'IMC', value: '27.7', unit: 'kg/m2', date: '2026-02-28', status: 'final', category: 'Sinais Vitais' },
    { id: 'o8', code: '2093-3', display: 'Colesterol Total', value: '210', unit: 'mg/dL', date: '2026-02-20', status: 'final', category: 'Laboratorio' },
  ];

  const demoMedications: Medication[] = [
    { id: 'm1', name: 'Losartana 50mg', dosage: '1 comprimido', frequency: '1x ao dia', status: 'active', prescriber: 'Dr. Carlos Mendes', startDate: '2020-07-01' },
    { id: 'm2', name: 'Metformina 850mg', dosage: '1 comprimido', frequency: '2x ao dia', status: 'active', prescriber: 'Dra. Ana Paula', startDate: '2021-02-15' },
    { id: 'm3', name: 'Salbutamol Spray', dosage: '2 jatos', frequency: 'SOS', status: 'active', prescriber: 'Dr. Roberto Lima', startDate: '2015-10-01' },
    { id: 'm4', name: 'Omeprazol 20mg', dosage: '1 capsula', frequency: '1x ao dia', status: 'stopped', prescriber: 'Dra. Fernanda', startDate: '2022-03-10' },
  ];

  const demoEncounters: Encounter[] = [
    { id: 'e1', type: 'Consulta Ambulatorial', status: 'finished', date: '2026-02-28', reason: 'Acompanhamento HAS e DM2', practitioner: 'Dr. Carlos Mendes', location: 'Clinica MedFocus' },
    { id: 'e2', type: 'Exames Laboratoriais', status: 'finished', date: '2026-02-25', reason: 'Exames de rotina', practitioner: 'Lab. Central', location: 'Laboratorio Central' },
    { id: 'e3', type: 'Consulta Especialista', status: 'finished', date: '2026-01-15', reason: 'Avaliacao pneumologica', practitioner: 'Dr. Roberto Lima', location: 'Hospital Sao Paulo' },
  ];

  const tabs = [
    { id: 'demographics', label: 'Dados do Paciente', icon: '👤' },
    { id: 'conditions', label: 'Condicoes', icon: '🏥' },
    { id: 'medications', label: 'Medicacoes', icon: '💊' },
    { id: 'observations', label: 'Observacoes', icon: '📊' },
    { id: 'encounters', label: 'Encontros', icon: '📋' },
    { id: 'dicom', label: 'Imagens DICOM', icon: '🩻' },
  ];

  const severityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'bg-green-900/50 text-green-300';
      case 'moderate': return 'bg-yellow-900/50 text-yellow-300';
      case 'severe': return 'bg-red-900/50 text-red-300';
      default: return 'bg-gray-700 text-gray-300';
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-900/50 text-emerald-300';
      case 'resolved': case 'stopped': case 'finished': return 'bg-gray-700 text-gray-400';
      default: return 'bg-blue-900/50 text-blue-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-900/50 to-cyan-900/50 rounded-2xl p-6 border border-teal-700/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-2xl">☁️</div>
          <div>
            <h2 className="text-2xl font-bold text-white">Prontuario Eletronico FHIR</h2>
            <p className="text-teal-300 text-sm">Google Cloud Healthcare API - FHIR R4, HL7v2, DICOM</p>
          </div>
        </div>
      </div>

      {/* Patient Search */}
      <div className="bg-gray-900 rounded-xl p-5 border border-gray-700">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar paciente por nome, CPF ou ID FHIR..."
            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white"
          />
          <button
            onClick={() => setSelectedPatient(demoPatient)}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg font-bold hover:bg-teal-500"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Patient Record */}
      {selectedPatient && (
        <>
          {/* Patient Banner */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-teal-600 rounded-full flex items-center justify-center text-2xl text-white font-bold">
                {selectedPatient.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedPatient.name}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{selectedPatient.gender}</span>
                  <span>Nascimento: {selectedPatient.birthDate}</span>
                  <span>ID: {selectedPatient.id}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-900/50 text-emerald-300 rounded-full text-xs font-bold">FHIR R4</span>
              <span className="px-3 py-1 bg-teal-900/50 text-teal-300 rounded-full text-xs font-bold">GCP Healthcare</span>
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
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Demographics */}
          {activeTab === 'demographics' && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Dados Demograficos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Nome Completo', value: selectedPatient.name },
                  { label: 'Data de Nascimento', value: selectedPatient.birthDate },
                  { label: 'Genero', value: selectedPatient.gender },
                  { label: 'CPF', value: selectedPatient.cpf },
                  { label: 'Telefone', value: selectedPatient.phone },
                  { label: 'Email', value: selectedPatient.email },
                  { label: 'Endereco', value: selectedPatient.address },
                  { label: 'ID FHIR', value: selectedPatient.id },
                ].map((field, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">{field.label}</div>
                    <div className="text-white font-medium">{field.value || '-'}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditions */}
          {activeTab === 'conditions' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Condicoes Clinicas ({demoConditions.length})</h3>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-500">
                  + Nova Condicao
                </button>
              </div>
              {demoConditions.map((condition) => (
                <div key={condition.id} className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-bold">{condition.display}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400">CID-10: {condition.code}</span>
                        <span className="text-xs text-gray-400">{condition.category}</span>
                        <span className="text-xs text-gray-400">Inicio: {condition.onsetDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded ${severityColor(condition.severity)}`}>
                        {condition.severity === 'mild' ? 'Leve' : condition.severity === 'moderate' ? 'Moderada' : 'Grave'}
                      </span>
                      <span className={`px-2 py-0.5 text-xs rounded ${statusColor(condition.status)}`}>
                        {condition.status === 'active' ? 'Ativa' : 'Resolvida'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Medications */}
          {activeTab === 'medications' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">Medicacoes ({demoMedications.length})</h3>
                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-bold hover:bg-teal-500">
                  + Nova Prescricao
                </button>
              </div>
              {demoMedications.map((med) => (
                <div key={med.id} className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-bold">{med.name}</h4>
                      <div className="text-sm text-gray-400 mt-1">
                        {med.dosage} - {med.frequency}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">Prescrito por: {med.prescriber}</span>
                        <span className="text-xs text-gray-500">Inicio: {med.startDate}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded ${statusColor(med.status)}`}>
                      {med.status === 'active' ? 'Em uso' : 'Suspenso'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Observations */}
          {activeTab === 'observations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white">Observacoes Clinicas ({demoObservations.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {demoObservations.map((obs) => (
                  <div key={obs.id} className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{obs.category}</span>
                      <span className="text-xs text-gray-500">{obs.date}</span>
                    </div>
                    <h4 className="text-white font-bold text-sm">{obs.display}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xl font-bold text-teal-400">{obs.value} {obs.unit}</span>
                      <span className="text-xs text-gray-500">LOINC: {obs.code}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Encounters */}
          {activeTab === 'encounters' && (
            <div className="space-y-3">
              <h3 className="text-lg font-bold text-white">Encontros Clinicos ({demoEncounters.length})</h3>
              {demoEncounters.map((enc) => (
                <div key={enc.id} className="bg-gray-900 rounded-xl p-4 border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white font-bold">{enc.type}</h4>
                      <div className="text-sm text-gray-400 mt-1">{enc.reason}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500">{enc.practitioner}</span>
                        <span className="text-xs text-gray-500">{enc.location}</span>
                        <span className="text-xs text-gray-500">{enc.date}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded ${statusColor(enc.status)}`}>
                      {enc.status === 'finished' ? 'Concluido' : enc.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DICOM */}
          {activeTab === 'dicom' && (
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-4">Imagens DICOM</h3>
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🩻</div>
                <h4 className="text-white font-bold text-lg mb-2">Visualizador DICOM</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Suporte a CT, MRI, Raio-X e Ultrassom via Google Cloud Healthcare DICOM Store
                </p>
                <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                  {['CT Scan', 'MRI', 'Raio-X'].map((type, i) => (
                    <div key={i} className="bg-gray-800 rounded-lg p-3 text-center">
                      <div className="text-2xl mb-1">{['🧠', '🫀', '🦴'][i]}</div>
                      <div className="text-xs text-gray-400">{type}</div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-4">
                  Conecte ao GCP DICOM Store para visualizar imagens medicas
                </p>
              </div>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!selectedPatient && (
        <div className="bg-gray-900 rounded-xl p-12 border border-gray-700 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-white font-bold text-lg mb-2">Busque um Paciente</h3>
          <p className="text-gray-400 text-sm">
            Use a barra de busca acima para encontrar o prontuario do paciente no FHIR R4
          </p>
        </div>
      )}
    </div>
  );
}
