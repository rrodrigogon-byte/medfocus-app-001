/**
 * StudyRooms — Salas de Estudo Colaborativo em Tempo Real
 * Chat, anotações compartilhadas e compartilhamento de templates.
 */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Users, MessageSquare, Plus, Send, ArrowLeft, FileText, Pin,
  Copy, ExternalLink, Heart, Share2, Loader2, BookOpen, Search,
  DoorOpen, Crown, UserPlus, StickyNote, Hash
} from 'lucide-react';

type RoomView = 'list' | 'room' | 'create' | 'shared-feed';

const StudyRooms: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<RoomView>('list');
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'notes'>('chat');

  // ─── Create Room State ─────────────────────────────────────
  const [newRoom, setNewRoom] = useState({ name: '', subject: '', description: '', university: '', maxParticipants: 20, isPublic: true });

  // ─── Chat State ────────────────────────────────────────────
  const [message, setMessage] = useState('');
  const [newNote, setNewNote] = useState({ title: '', content: '', subject: '' });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // ─── Queries ───────────────────────────────────────────────
  const roomsQuery = trpc.studyRoom.list.useQuery(undefined, { retry: false });
  const roomDetailQuery = trpc.studyRoom.getById.useQuery(
    { roomId: activeRoomId! },
    { enabled: !!activeRoomId, refetchInterval: 10000 }
  );
  const messagesQuery = trpc.studyRoom.getMessages.useQuery(
    { roomId: activeRoomId!, limit: 100 },
    { enabled: !!activeRoomId && activeTab === 'chat', refetchInterval: 5000 }
  );
  const notesQuery = trpc.studyRoom.getNotes.useQuery(
    { roomId: activeRoomId! },
    { enabled: !!activeRoomId && activeTab === 'notes', refetchInterval: 10000 }
  );
  const sharedFeedQuery = trpc.sharing.feed.useQuery(undefined, { retry: false });

  // ─── Mutations ─────────────────────────────────────────────
  const createRoomMutation = trpc.studyRoom.create.useMutation();
  const joinRoomMutation = trpc.studyRoom.join.useMutation();
  const sendMessageMutation = trpc.studyRoom.sendMessage.useMutation();
  const createNoteMutation = trpc.studyRoom.createNote.useMutation();
  const likeMutation = trpc.sharing.like.useMutation();

  const utils = trpc.useUtils();

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesQuery.data]);

  // ─── Handlers ──────────────────────────────────────────────
  const handleCreateRoom = async () => {
    if (!newRoom.name || !newRoom.subject) {
      toast.error('Nome e disciplina são obrigatórios');
      return;
    }
    try {
      const result = await createRoomMutation.mutateAsync({
        name: newRoom.name, subject: newRoom.subject, description: newRoom.description || undefined,
        university: newRoom.university || undefined, maxParticipants: newRoom.maxParticipants, isPublic: newRoom.isPublic,
      });
      toast.success(`Sala criada! Código: ${result.code}`);
      setActiveRoomId(result.id);
      setView('room');
      utils.studyRoom.list.invalidate();
    } catch (e) {
      toast.error('Erro ao criar sala');
    }
  };

  const handleJoinRoom = async (roomId: number) => {
    try {
      await joinRoomMutation.mutateAsync({ roomId });
      setActiveRoomId(roomId);
      setView('room');
      toast.success('Você entrou na sala!');
    } catch (e) {
      toast.error('Erro ao entrar na sala');
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeRoomId) return;
    try {
      await sendMessageMutation.mutateAsync({ roomId: activeRoomId, content: message });
      setMessage('');
      utils.studyRoom.getMessages.invalidate({ roomId: activeRoomId });
    } catch (e) {
      toast.error('Erro ao enviar mensagem');
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.title || !newNote.content || !activeRoomId) {
      toast.error('Título e conteúdo são obrigatórios');
      return;
    }
    try {
      await createNoteMutation.mutateAsync({ roomId: activeRoomId, title: newNote.title, content: newNote.content, subject: newNote.subject || undefined });
      setNewNote({ title: '', content: '', subject: '' });
      utils.studyRoom.getNotes.invalidate({ roomId: activeRoomId });
      toast.success('Anotação compartilhada!');
    } catch (e) {
      toast.error('Erro ao criar anotação');
    }
  };

  // ─── SHARED FEED VIEW ──────────────────────────────────────
  if (view === 'shared-feed') {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setView('list')}><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
          <div>
            <h2 className="text-xl font-bold">Templates Compartilhados</h2>
            <p className="text-sm text-muted-foreground">Templates públicos da comunidade</p>
          </div>
        </div>
        {sharedFeedQuery.isLoading && <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>}
        {sharedFeedQuery.data && sharedFeedQuery.data.length === 0 && (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum template compartilhado ainda. Seja o primeiro!</CardContent></Card>
        )}
        <div className="grid gap-4">
          {sharedFeedQuery.data?.map((item: any) => (
            <Card key={item.share.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{item.template?.title || 'Template'}</h3>
                    <p className="text-sm text-muted-foreground mt-1">por {item.userName || 'Anônimo'}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{item.share.subject}</Badge>
                      {item.share.university && <Badge variant="outline">{item.share.university}</Badge>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={() => { likeMutation.mutate({ shareId: item.share.id }); toast.success('Curtido!'); }}>
                      <Heart className="w-4 h-4 mr-1" /> {item.share.likes}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => { navigator.clipboard.writeText(item.share.shareCode); toast.success('Código copiado!'); }}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {item.template?.content && (
                  <p className="text-sm text-muted-foreground mt-3 line-clamp-3">{item.template.content.substring(0, 200)}...</p>
                )}
                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                  <span>{item.share.views} visualizações</span>
                  <span>{item.share.copies} cópias</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // ─── CREATE ROOM VIEW ──────────────────────────────────────
  if (view === 'create') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => setView('list')}><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Criar Sala de Estudo</CardTitle>
            <CardDescription>Crie uma sala para estudar com colegas em tempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome da Sala *</label>
              <input value={newRoom.name} onChange={e => setNewRoom(r => ({ ...r, name: e.target.value }))}
                placeholder="Ex: Revisão de Anatomia - P1" className="w-full mt-1 p-2.5 rounded-lg border border-border bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Disciplina *</label>
              <input value={newRoom.subject} onChange={e => setNewRoom(r => ({ ...r, subject: e.target.value }))}
                placeholder="Ex: Anatomia, Fisiologia..." className="w-full mt-1 p-2.5 rounded-lg border border-border bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <textarea value={newRoom.description} onChange={e => setNewRoom(r => ({ ...r, description: e.target.value }))}
                placeholder="Descreva o objetivo da sala..." rows={3} className="w-full mt-1 p-2.5 rounded-lg border border-border bg-background resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Universidade</label>
                <input value={newRoom.university} onChange={e => setNewRoom(r => ({ ...r, university: e.target.value }))}
                  placeholder="Ex: UNIVAG" className="w-full mt-1 p-2.5 rounded-lg border border-border bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium">Máx. Participantes</label>
                <input type="number" value={newRoom.maxParticipants} onChange={e => setNewRoom(r => ({ ...r, maxParticipants: Number(e.target.value) }))}
                  className="w-full mt-1 p-2.5 rounded-lg border border-border bg-background" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={newRoom.isPublic} onChange={e => setNewRoom(r => ({ ...r, isPublic: e.target.checked }))} id="isPublic" />
              <label htmlFor="isPublic" className="text-sm">Sala pública (qualquer aluno pode entrar)</label>
            </div>
            <Button className="w-full" onClick={handleCreateRoom} disabled={createRoomMutation.isPending}>
              {createRoomMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
              Criar Sala
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── ROOM VIEW (Chat + Notes) ──────────────────────────────
  if (view === 'room' && activeRoomId) {
    const room = roomDetailQuery.data;
    const messages = messagesQuery.data || [];
    const notes = notesQuery.data || [];
    const sortedMessages = [...messages].reverse();

    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Room Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => { setView('list'); setActiveRoomId(null); }}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h2 className="text-lg font-bold">{room?.room?.name || 'Sala de Estudo'}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-3 h-3" />
                <span>{room?.participants?.length || 0} participantes</span>
                <span>•</span>
                <Badge variant="secondary" className="text-xs">{room?.room?.subject}</Badge>
                {room?.room?.code && (
                  <>
                    <span>•</span>
                    <button onClick={() => { navigator.clipboard.writeText(room.room!.code); toast.success('Código copiado!'); }}
                      className="flex items-center gap-1 text-primary hover:underline">
                      <Hash className="w-3 h-3" />{room.room.code}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border pb-2">
          <Button variant={activeTab === 'chat' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('chat')}>
            <MessageSquare className="w-4 h-4 mr-1" /> Chat
          </Button>
          <Button variant={activeTab === 'notes' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('notes')}>
            <StickyNote className="w-4 h-4 mr-1" /> Anotações ({notes.length})
          </Button>
        </div>

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <Card className="border">
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-[400px] overflow-y-auto p-4 space-y-3">
                {sortedMessages.length === 0 && (
                  <div className="text-center text-muted-foreground py-12">
                    <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma mensagem ainda. Comece a conversa!</p>
                  </div>
                )}
                {sortedMessages.map((msg: any) => {
                  const isMe = msg.userId === user?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-3 rounded-xl ${isMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        {!isMe && <p className="text-xs font-bold mb-1 opacity-70">{msg.userName}</p>}
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className="text-[10px] opacity-50 mt-1">{new Date(msg.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatEndRef} />
              </div>

              {/* Input */}
              <div className="border-t border-border p-3 flex gap-2">
                <input
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 p-2.5 rounded-lg border border-border bg-background text-sm"
                />
                <Button size="sm" onClick={handleSendMessage} disabled={!message.trim() || sendMessageMutation.isPending}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            {/* Create Note */}
            <Card>
              <CardContent className="pt-4 space-y-3">
                <input value={newNote.title} onChange={e => setNewNote(n => ({ ...n, title: e.target.value }))}
                  placeholder="Título da anotação" className="w-full p-2.5 rounded-lg border border-border bg-background text-sm font-medium" />
                <textarea value={newNote.content} onChange={e => setNewNote(n => ({ ...n, content: e.target.value }))}
                  placeholder="Conteúdo da anotação (suporta Markdown)" rows={4}
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-sm resize-none" />
                <div className="flex justify-between items-center">
                  <input value={newNote.subject} onChange={e => setNewNote(n => ({ ...n, subject: e.target.value }))}
                    placeholder="Disciplina (opcional)" className="p-2 rounded-lg border border-border bg-background text-sm w-48" />
                  <Button size="sm" onClick={handleCreateNote} disabled={createNoteMutation.isPending}>
                    <FileText className="w-4 h-4 mr-1" /> Compartilhar Anotação
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notes List */}
            {notes.map((note: any) => (
              <Card key={note.id}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-foreground">{note.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">por {note.userName} • {new Date(note.createdAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                    {note.isPinned && <Pin className="w-4 h-4 text-primary" />}
                  </div>
                  <p className="text-sm text-foreground/80 mt-3 whitespace-pre-wrap">{note.content}</p>
                  {note.subject && <Badge variant="secondary" className="mt-2">{note.subject}</Badge>}
                </CardContent>
              </Card>
            ))}
            {notes.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                <StickyNote className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Nenhuma anotação compartilhada ainda</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ─── ROOMS LIST VIEW ───────────────────────────────────────
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Estudo Colaborativo</h2>
          <p className="text-muted-foreground mt-1">Salas de estudo em tempo real com chat e anotações</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView('shared-feed')}>
            <Share2 className="w-4 h-4 mr-2" /> Templates
          </Button>
          <Button onClick={() => setView('create')}>
            <Plus className="w-4 h-4 mr-2" /> Criar Sala
          </Button>
        </div>
      </div>

      {roomsQuery.isLoading && <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin" /></div>}

      {roomsQuery.data && roomsQuery.data.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <DoorOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-bold text-foreground mb-2">Nenhuma sala ativa</h3>
            <p className="text-muted-foreground mb-4">Crie a primeira sala de estudo para começar!</p>
            <Button onClick={() => setView('create')}><Plus className="w-4 h-4 mr-2" /> Criar Sala</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {roomsQuery.data?.map((room: any) => (
          <Card key={room.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleJoinRoom(room.id)}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-foreground flex items-center gap-2">
                    {room.name}
                    {room.isPublic ? <Badge variant="secondary" className="text-xs">Pública</Badge> : <Badge variant="outline" className="text-xs">Privada</Badge>}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <Badge variant="secondary">{room.subject}</Badge>
                    {room.university && <span>{room.university}</span>}
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {room.maxParticipants} max</span>
                  </div>
                  {room.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{room.description}</p>}
                </div>
                <Button variant="outline" size="sm" onClick={e => { e.stopPropagation(); handleJoinRoom(room.id); }}>
                  <UserPlus className="w-4 h-4 mr-1" /> Entrar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudyRooms;
