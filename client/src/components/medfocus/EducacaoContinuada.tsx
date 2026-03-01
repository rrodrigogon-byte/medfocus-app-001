/**
 * MedFocus — Módulo de Educação Médica Continuada (CME)
 * Sprint 49: Pontos CNA, certificações, trilhas de aprendizado e gestão de créditos
 */
import React, { useState } from 'react';
import EducationalDisclaimer from './EducationalDisclaimer';

interface Curso {
  id: string;
  titulo: string;
  especialidade: string;
  pontosCNA: number;
  duracao: string;
  formato: string;
  instituicao: string;
  status: 'disponivel' | 'em_andamento' | 'concluido';
  progresso: number;
  validade: string;
}

const cursos: Curso[] = [
  { id: 'CME-001', titulo: 'Atualização em Insuficiência Cardíaca: Diretrizes SBC 2025', especialidade: 'Cardiologia', pontosCNA: 12, duracao: '20h', formato: 'EAD', instituicao: 'SBC', status: 'em_andamento', progresso: 65, validade: '2027' },
  { id: 'CME-002', titulo: 'Manejo da Sepse: Surviving Sepsis Campaign 2024', especialidade: 'Medicina Intensiva', pontosCNA: 8, duracao: '12h', formato: 'EAD', instituicao: 'AMIB', status: 'concluido', progresso: 100, validade: '2027' },
  { id: 'CME-003', titulo: 'Antibioticoterapia Racional na Prática Clínica', especialidade: 'Infectologia', pontosCNA: 10, duracao: '16h', formato: 'Híbrido', instituicao: 'SBI', status: 'disponivel', progresso: 0, validade: '2028' },
  { id: 'CME-004', titulo: 'Ultrassonografia Point-of-Care (POCUS) para Emergencistas', especialidade: 'Medicina de Emergência', pontosCNA: 15, duracao: '24h', formato: 'Presencial', instituicao: 'ABRAMEDE', status: 'disponivel', progresso: 0, validade: '2028' },
  { id: 'CME-005', titulo: 'Imunoterapia em Oncologia: Avanços e Manejo de Toxicidades', especialidade: 'Oncologia', pontosCNA: 10, duracao: '16h', formato: 'EAD', instituicao: 'SBOC', status: 'em_andamento', progresso: 30, validade: '2027' },
  { id: 'CME-006', titulo: 'LGPD Aplicada à Prática Médica', especialidade: 'Ética Médica', pontosCNA: 4, duracao: '6h', formato: 'EAD', instituicao: 'CFM', status: 'concluido', progresso: 100, validade: '2028' },
  { id: 'CME-007', titulo: 'Ventilação Mecânica: Do Básico ao Avançado', especialidade: 'Pneumologia', pontosCNA: 12, duracao: '20h', formato: 'EAD', instituicao: 'SBPT', status: 'disponivel', progresso: 0, validade: '2028' },
  { id: 'CME-008', titulo: 'Dermatoscopia Digital e Inteligência Artificial', especialidade: 'Dermatologia', pontosCNA: 8, duracao: '12h', formato: 'EAD', instituicao: 'SBD', status: 'disponivel', progresso: 0, validade: '2028' },
];

const EducacaoContinuada: React.FC = () => {
  const [tab, setTab] = useState<'cursos' | 'creditos' | 'trilhas' | 'certificados'>('cursos');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const totalPontos = cursos.filter(c => c.status === 'concluido').reduce((s, c) => s + c.pontosCNA, 0);
  const metaAnual = 40;

  const tabs = [
    { id: 'cursos' as const, label: 'Cursos', icon: '📚' },
    { id: 'creditos' as const, label: 'Créditos CNA', icon: '🏆' },
    { id: 'trilhas' as const, label: 'Trilhas', icon: '🗺️' },
    { id: 'certificados' as const, label: 'Certificados', icon: '📜' },
  ];

  const cursosFiltrados = filtroStatus === 'todos' ? cursos : cursos.filter(c => c.status === filtroStatus);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <EducationalDisclaimer moduleName="Educação Médica Continuada" />

      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">🎓 Educação Médica Continuada</h1>
        <p className="text-gray-400">Gestão de créditos CNA, certificações e trilhas de aprendizado contínuo</p>
      </div>

      <div className="flex gap-2 border-b border-gray-700 pb-2 overflow-x-auto">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 rounded-t-lg text-sm font-medium transition-all whitespace-nowrap ${tab === t.id ? 'bg-emerald-500/20 text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-400 hover:text-white'}`}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'cursos' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-emerald-400">{totalPontos}</div>
              <div className="text-gray-500 text-sm">Pontos CNA</div>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{cursos.filter(c => c.status === 'em_andamento').length}</div>
              <div className="text-gray-500 text-sm">Em Andamento</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-purple-400">{cursos.filter(c => c.status === 'concluido').length}</div>
              <div className="text-gray-500 text-sm">Concluídos</div>
            </div>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{Math.round((totalPontos / metaAnual) * 100)}%</div>
              <div className="text-gray-500 text-sm">Meta Anual ({metaAnual}pts)</div>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <span className="text-gray-400 text-sm">Status:</span>
            {[{ v: 'todos', l: 'Todos' }, { v: 'disponivel', l: 'Disponíveis' }, { v: 'em_andamento', l: 'Em Andamento' }, { v: 'concluido', l: 'Concluídos' }].map(f => (
              <button key={f.v} onClick={() => setFiltroStatus(f.v)} className={`px-3 py-1 rounded-lg text-xs ${filtroStatus === f.v ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>{f.l}</button>
            ))}
          </div>

          {cursosFiltrados.map(curso => (
            <div key={curso.id} className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 hover:border-emerald-500/50 transition-all">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex gap-2 mb-2">
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">{curso.especialidade}</span>
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">{curso.pontosCNA} pts CNA</span>
                    <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded">{curso.formato}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${curso.status === 'concluido' ? 'bg-green-500/20 text-green-400' : curso.status === 'em_andamento' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-400'}`}>
                      {curso.status === 'concluido' ? 'Concluído' : curso.status === 'em_andamento' ? 'Em Andamento' : 'Disponível'}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold">{curso.titulo}</h3>
                  <p className="text-gray-500 text-sm mt-1">{curso.instituicao} — {curso.duracao} — Válido até {curso.validade}</p>
                </div>
              </div>
              {curso.progresso > 0 && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progresso</span>
                    <span>{curso.progresso}%</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div className={`h-2 rounded-full ${curso.progresso === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${curso.progresso}%` }} />
                  </div>
                </div>
              )}
              {curso.status === 'disponivel' && (
                <button className="mt-3 px-4 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700">Iniciar Curso</button>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'creditos' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">🏆 Gestão de Créditos CNA (Comissão Nacional de Acreditação)</h3>
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Progresso da Meta Anual</span>
                <span className="text-emerald-400 font-bold">{totalPontos}/{metaAnual} pontos</span>
              </div>
              <div className="bg-gray-700 rounded-full h-4">
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-4 rounded-full transition-all" style={{ width: `${Math.min((totalPontos / metaAnual) * 100, 100)}%` }} />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-gray-400 text-sm font-medium">Distribuição por Categoria</h4>
              {[
                { categoria: 'Atividades de Ensino (Cursos, Congressos)', pontos: 8, max: 20 },
                { categoria: 'Atividades de Pesquisa (Publicações, Orientações)', pontos: 2, max: 15 },
                { categoria: 'Atividades Assistenciais (Preceptoria, Supervisão)', pontos: 2, max: 10 },
                { categoria: 'Atividades de Gestão (Comissões, Coordenação)', pontos: 0, max: 10 },
              ].map(cat => (
                <div key={cat.categoria} className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">{cat.categoria}</span>
                    <span className="text-gray-400">{cat.pontos}/{cat.max} pts</span>
                  </div>
                  <div className="bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(cat.pontos / cat.max) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <h4 className="text-blue-400 font-semibold mb-2">📋 Requisitos para Revalidação do Título</h4>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Mínimo de 40 pontos CNA por período de 5 anos</li>
              <li>• Distribuição obrigatória entre categorias (ensino, pesquisa, assistência)</li>
              <li>• Participação em pelo menos 1 congresso da especialidade/ano</li>
              <li>• Comprovação de atividade profissional regular</li>
              <li>• Quitação com o CRM e sociedade de especialidade</li>
            </ul>
          </div>
        </div>
      )}

      {tab === 'trilhas' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">🗺️ Trilhas de Aprendizado</h3>
            <div className="space-y-4">
              {[
                { nome: 'Cardiologia de Emergência', modulos: 6, concluidos: 2, pontos: 24, cor: 'red' },
                { nome: 'Infectologia Clínica', modulos: 5, concluidos: 1, pontos: 20, cor: 'green' },
                { nome: 'Medicina Baseada em Evidências', modulos: 4, concluidos: 3, pontos: 16, cor: 'blue' },
                { nome: 'Gestão em Saúde e Liderança', modulos: 5, concluidos: 0, pontos: 18, cor: 'purple' },
                { nome: 'Ultrassonografia Clínica', modulos: 8, concluidos: 0, pontos: 32, cor: 'yellow' },
                { nome: 'Cuidados Paliativos', modulos: 4, concluidos: 4, pontos: 16, cor: 'pink' },
              ].map(trilha => (
                <div key={trilha.nome} className="p-4 bg-gray-900/50 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-white font-medium">{trilha.nome}</h4>
                    <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">{trilha.pontos} pts CNA</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {Array.from({ length: trilha.modulos }).map((_, i) => (
                      <div key={i} className={`w-8 h-2 rounded-full ${i < trilha.concluidos ? 'bg-emerald-500' : 'bg-gray-700'}`} />
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{trilha.concluidos}/{trilha.modulos} módulos</span>
                    <span>{trilha.concluidos === trilha.modulos ? '✅ Concluída' : `${Math.round((trilha.concluidos / trilha.modulos) * 100)}% completo`}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'certificados' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">📜 Certificados Emitidos</h3>
            <div className="space-y-3">
              {cursos.filter(c => c.status === 'concluido').map(curso => (
                <div key={curso.id} className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <div>
                    <h4 className="text-white font-medium">{curso.titulo}</h4>
                    <p className="text-gray-500 text-sm">{curso.instituicao} — {curso.duracao} — {curso.pontosCNA} pts CNA</p>
                    <p className="text-gray-600 text-xs">Válido até {curso.validade}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700">📥 PDF</button>
                    <button className="px-3 py-1.5 bg-emerald-600 text-white text-xs rounded-lg hover:bg-emerald-700">🔗 Verificar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="text-white font-semibold mb-4">📊 Histórico de Títulos e Certificações</h3>
            <div className="space-y-2">
              {[
                { titulo: 'Título de Especialista em Clínica Médica', orgao: 'AMB/SBCM', ano: '2020', status: 'Válido' },
                { titulo: 'ACLS Provider', orgao: 'AHA', ano: '2024', status: 'Válido' },
                { titulo: 'ATLS Provider', orgao: 'ACS', ano: '2023', status: 'Válido' },
                { titulo: 'Certificação em Ultrassonografia POCUS', orgao: 'ABRAMEDE', ano: '2024', status: 'Válido' },
              ].map(t => (
                <div key={t.titulo} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <div className="text-white text-sm font-medium">{t.titulo}</div>
                    <div className="text-gray-500 text-xs">{t.orgao} — {t.ano}</div>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="text-xs text-gray-600 text-center">
        Ref: CNA/AMB | CFM Resolução 2.149/2016 | Sociedades de Especialidade
      </div>
    </div>
  );
};

export default EducacaoContinuada;
