/**
 * Professor Study Room Manager
 * 
 * Features for professors (FREE access):
 * - Create and manage study rooms
 * - Add course materials
 * - Post announcements
 * - Create assignments
 * - Monitor student progress
 * - Validate community content
 */
import React, { useState } from 'react';
import { StudyRoom, ProfessorProfile, Announcement, Assignment } from '../../types';

interface ProfessorDashboardProps {
  professor: ProfessorProfile;
}

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ professor }) => {
  const [activeTab, setActiveTab] = useState<'rooms' | 'content' | 'validation'>('rooms');
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '',
    description: '',
    isPublic: true,
    maxStudents: undefined as number | undefined,
  });

  // Mock data
  const mockRooms: StudyRoom[] = [
    {
      id: 'room_1',
      name: 'Cardiologia Clínica - 5º Ano',
      description: 'Discussão de casos clínicos e preparação para prova prática',
      professorId: professor.id,
      professorName: professor.name,
      universityId: professor.universityId,
      isPublic: true,
      materials: ['mat_1', 'mat_2', 'mat_3'],
      announcements: [
        {
          id: 'ann_1',
          studyRoomId: 'room_1',
          title: 'Aula prática na quinta-feira',
          content: 'Lembrete: aula prática de ECG na quinta às 14h. Tragam casos interessantes!',
          createdAt: '2024-02-10T10:00:00Z',
          createdBy: professor.id,
          isPinned: true,
        },
      ],
      assignments: [
        {
          id: 'assign_1',
          studyRoomId: 'room_1',
          title: 'Análise de ECG - Casos Complexos',
          description: 'Analisar os 5 ECGs disponíveis na biblioteca e enviar interpretação completa',
          materials: ['mat_ecg_1', 'mat_ecg_2'],
          dueDate: '2024-02-20',
          submissions: [],
          createdAt: '2024-02-12T09:00:00Z',
          createdBy: professor.id,
        },
      ],
      students: Array.from({ length: 32 }, (_, i) => `student_${i + 1}`),
      createdAt: '2024-01-15T08:00:00Z',
      updatedAt: '2024-02-12T09:00:00Z',
    },
  ];

  const handleCreateRoom = () => {
    // In production, this would call API
    console.log('Creating room:', newRoom);
    setShowCreateRoom(false);
    setNewRoom({ name: '', description: '', isPublic: true, maxStudents: undefined });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-background border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-3xl">👨‍🏫</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Painel do Professor
              </h1>
              <p className="text-muted-foreground">
                {professor.name} • {professor.universityName}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">{mockRooms.length}</div>
              <div className="text-xs text-muted-foreground">Salas Ativas</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">
                {mockRooms.reduce((acc, room) => acc + room.students.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Estudantes Impactados</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">{professor.materialsContributed}</div>
              <div className="text-xs text-muted-foreground">Materiais Contribuídos</div>
            </div>
            <div className="bg-card border border-border rounded-xl p-4">
              <div className="text-3xl font-bold text-primary mb-1">{professor.validationsPerformed}</div>
              <div className="text-xs text-muted-foreground">Validações Realizadas</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-2 mb-6 border-b border-border">
          <button
            onClick={() => setActiveTab('rooms')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'rooms'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🏫 Salas de Estudo
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === 'content'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            📚 Conteúdo
          </button>
          {professor.canValidateMaterials && (
            <button
              onClick={() => setActiveTab('validation')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'validation'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ✅ Validação
            </button>
          )}
        </div>

        {/* Study Rooms Tab */}
        {activeTab === 'rooms' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Suas Salas de Estudo</h2>
              <button
                onClick={() => setShowCreateRoom(true)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all"
              >
                + Criar Nova Sala
              </button>
            </div>

            {/* Create Room Modal */}
            {showCreateRoom && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
                <div className="bg-card border border-border rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Criar Nova Sala de Estudo</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Nome da Sala *
                      </label>
                      <input
                        type="text"
                        value={newRoom.name}
                        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                        placeholder="Ex: Cardiologia Clínica - 5º Ano"
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-foreground mb-2">
                        Descrição *
                      </label>
                      <textarea
                        value={newRoom.description}
                        onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                        placeholder="Descreva os objetivos e tópicos da sala"
                        rows={4}
                        className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={newRoom.isPublic}
                          onChange={(e) => setNewRoom({ ...newRoom, isPublic: e.target.checked })}
                          className="w-5 h-5 text-primary"
                        />
                        <span className="text-sm font-semibold text-foreground">
                          Sala Pública (qualquer estudante pode entrar)
                        </span>
                      </label>
                    </div>

                    {!newRoom.isPublic && (
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Limite de Estudantes (opcional)
                        </label>
                        <input
                          type="number"
                          value={newRoom.maxStudents || ''}
                          onChange={(e) => setNewRoom({ ...newRoom, maxStudents: e.target.value ? parseInt(e.target.value) : undefined })}
                          placeholder="Ex: 50"
                          className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={() => setShowCreateRoom(false)}
                      className="flex-1 px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleCreateRoom}
                      disabled={!newRoom.name || !newRoom.description}
                      className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
                        !newRoom.name || !newRoom.description
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      Criar Sala
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rooms Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockRooms.map(room => (
                <div key={room.id} className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-foreground">{room.name}</h3>
                      {room.isPublic && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                          PÚBLICA
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4">{room.description}</p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xl font-bold text-foreground">{room.students.length}</div>
                        <div className="text-[10px] text-muted-foreground">Estudantes</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xl font-bold text-foreground">{room.materials.length}</div>
                        <div className="text-[10px] text-muted-foreground">Materiais</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-xl font-bold text-foreground">{room.assignments.length}</div>
                        <div className="text-[10px] text-muted-foreground">Atividades</div>
                      </div>
                    </div>

                    {/* Pinned Announcement */}
                    {room.announcements.filter(a => a.isPinned).length > 0 && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg mb-4">
                        <div className="flex items-start gap-2">
                          <span className="text-lg">📌</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-amber-900 mb-1">
                              {room.announcements.find(a => a.isPinned)?.title}
                            </h4>
                            <p className="text-xs text-amber-800 line-clamp-2">
                              {room.announcements.find(a => a.isPinned)?.content}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/20 transition-all">
                        Gerenciar
                      </button>
                      <button className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-semibold hover:bg-muted/80 transition-all">
                        ⚙️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div>
            <div className="bg-card border border-border rounded-xl p-12 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <span className="text-4xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Gerenciamento de Conteúdo
              </h3>
              <p className="text-muted-foreground mb-6">
                Adicione artigos, materiais e recursos para suas salas de estudo
              </p>
              <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:bg-primary/90 transition-all">
                + Adicionar Conteúdo
              </button>
            </div>
          </div>
        )}

        {/* Validation Tab */}
        {activeTab === 'validation' && professor.canValidateMaterials && (
          <div>
            <div className="bg-gradient-to-br from-amber-50 to-background border border-amber-200 rounded-xl p-8 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
                  <span className="text-2xl">✅</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Validação de Conteúdo
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Como professor verificado, você pode validar materiais da comunidade, garantindo qualidade acadêmica
                  </p>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">8</span>
                      <span className="text-muted-foreground">pendentes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground">{professor.validationsPerformed}</span>
                      <span className="text-muted-foreground">validados por você</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pending Validations */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-foreground mb-4">Materiais Aguardando Validação</h3>
              
              <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-3xl">📝</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-foreground mb-2">
                      Resumo de Farmacologia Cardiovascular
                    </h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Material criado por estudantes da comunidade sobre fármacos cardiovasculares
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-800 text-xs font-bold rounded">
                        3º Ano
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                        Farmacologia
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • 234 downloads • 4.2⭐
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 transition-all">
                        ✓ Validar
                      </button>
                      <button className="px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold hover:bg-amber-600 transition-all">
                        📝 Solicitar Revisão
                      </button>
                      <button className="px-4 py-2 bg-muted text-foreground rounded-lg text-sm font-bold hover:bg-muted/80 transition-all">
                        👁️ Visualizar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorDashboard;
