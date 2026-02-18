/**
 * AcademicCalendar — Calendário Acadêmico com Revisões Automáticas
 * Vincula materiais e templates às datas de provas, sugere revisões automáticas.
 */
import React, { useState, useMemo } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Calendar, Plus, ChevronLeft, ChevronRight, BookOpen, Clock,
  AlertTriangle, CheckCircle2, Loader2, Trash2, Bell, Brain,
  Target, GraduationCap, FileText, ArrowLeft
} from 'lucide-react';

const MONTHS_PT = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DAYS_PT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const EVENT_TYPES = [
  { id: 'prova', label: 'Prova', color: 'bg-red-500', icon: Target },
  { id: 'trabalho', label: 'Trabalho', color: 'bg-blue-500', icon: FileText },
  { id: 'seminario', label: 'Seminário', color: 'bg-purple-500', icon: GraduationCap },
  { id: 'revisao', label: 'Revisão', color: 'bg-green-500', icon: Brain },
  { id: 'aula', label: 'Aula Especial', color: 'bg-amber-500', icon: BookOpen },
];

const REVISION_INTERVALS = [
  { days: 1, label: '1 dia antes', method: 'Revisão rápida: flashcards e resumos' },
  { days: 3, label: '3 dias antes', method: 'Revisão ativa: questões e exercícios' },
  { days: 7, label: '7 dias antes', method: 'Revisão profunda: releitura e mapas mentais' },
  { days: 14, label: '14 dias antes', method: 'Primeira revisão: visão geral do conteúdo' },
];

type CalendarView = 'calendar' | 'create' | 'detail' | 'revisions';

const AcademicCalendar: React.FC = () => {
  const [view, setView] = useState<CalendarView>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // ─── Create Event State ────────────────────────────────────
  const [newEvent, setNewEvent] = useState({
    title: '', subject: '', eventType: 'prova', description: '',
    eventDate: '', eventTime: '', autoRevisions: true,
  });

  // ─── Queries ───────────────────────────────────────────────
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const eventsQuery = trpc.calendar.getEvents.useQuery({ year, month }, { retry: false });
  const revisionsQuery = trpc.calendar.getRevisions.useQuery(undefined, { retry: false });
  // Use the same events query for upcoming - filter client-side
  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    const in14Days = now + 14 * 24 * 60 * 60 * 1000;
    return (eventsQuery.data || []).filter((ev: any) => {
      const d = new Date(ev.eventDate).getTime();
      return d >= now && d <= in14Days;
    });
  }, [eventsQuery.data]);

  // ─── Mutations ─────────────────────────────────────────────
  const createEventMutation = trpc.calendar.createEvent.useMutation();
  const deleteEventMutation = trpc.calendar.deleteEvent.useMutation();
  const completeRevisionMutation = trpc.calendar.completeRevision.useMutation();

  const utils = trpc.useUtils();

  // ─── Calendar Grid ─────────────────────────────────────────
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startPad = firstDay.getDay();
    const days: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month - 1, d));
    return days;
  }, [year, month]);

  const eventsByDate = useMemo(() => {
    const map: Record<string, any[]> = {};
    (eventsQuery.data || []).forEach((ev: any) => {
      const key = new Date(ev.eventDate).toISOString().split('T')[0];
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    });
    return map;
  }, [eventsQuery.data]);

  // ─── Handlers ──────────────────────────────────────────────
  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.subject || !newEvent.eventDate) {
      toast.error('Título, disciplina e data são obrigatórios');
      return;
    }
    try {
      await createEventMutation.mutateAsync({
        title: newEvent.title,
        subject: newEvent.subject,
        eventType: newEvent.eventType as 'prova' | 'trabalho' | 'seminario' | 'pratica' | 'revisao' | 'simulado' | 'outro',
        description: newEvent.description || undefined,
        eventDate: new Date(newEvent.eventDate + (newEvent.eventTime ? `T${newEvent.eventTime}` : 'T08:00')).toISOString(),
      });
      toast.success('Evento criado!' + (newEvent.autoRevisions ? ' Revisões automáticas agendadas.' : ''));
      setView('calendar');
      setNewEvent({ title: '', subject: '', eventType: 'prova', description: '', eventDate: '', eventTime: '', autoRevisions: true });
      utils.calendar.getEvents.invalidate();
      utils.calendar.getRevisions.invalidate();
      utils.calendar.getEvents.invalidate();
    } catch (e) {
      toast.error('Erro ao criar evento');
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    try {
      await deleteEventMutation.mutateAsync({ eventId });
      toast.success('Evento removido');
      utils.calendar.getEvents.invalidate();
      utils.calendar.getEvents.invalidate();
    } catch (e) {
      toast.error('Erro ao remover evento');
    }
  };

  const handleCompleteRevision = async (revisionId: number) => {
    try {
      await completeRevisionMutation.mutateAsync({ revisionId });
      toast.success('Revisão marcada como concluída!');
      utils.calendar.getRevisions.invalidate();
    } catch (e) {
      toast.error('Erro ao completar revisão');
    }
  };

  const navigateMonth = (dir: number) => {
    setCurrentDate(new Date(year, month - 1 + dir, 1));
  };

  const today = new Date();
  const todayKey = today.toISOString().split('T')[0];

  // ─── REVISIONS VIEW ───────────────────────────────────────
  if (view === 'revisions') {
    const pendingRevisions = (revisionsQuery.data || []).filter((r: any) => !r.completed);
    const completedRevisions = (revisionsQuery.data || []).filter((r: any) => r.completed);
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => setView('calendar')}><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
          <div>
            <h2 className="text-xl font-bold">Revisões Programadas</h2>
            <p className="text-sm text-muted-foreground">Baseadas na curva de esquecimento de Ebbinghaus</p>
          </div>
        </div>

        {pendingRevisions.length === 0 && (
          <Card><CardContent className="py-12 text-center text-muted-foreground">
            <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma revisão pendente. Adicione provas ao calendário para gerar revisões automáticas!</p>
          </CardContent></Card>
        )}

        {pendingRevisions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-foreground flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-yellow-500" /> Pendentes ({pendingRevisions.length})</h3>
            {pendingRevisions.map((rev: any) => {
              const revDate = new Date(rev.revisionDate);
              const isOverdue = revDate < today;
              const isToday = revDate.toISOString().split('T')[0] === todayKey;
              return (
                <Card key={rev.id} className={`border-l-4 ${isOverdue ? 'border-l-red-500' : isToday ? 'border-l-yellow-500' : 'border-l-green-500'}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-foreground">{rev.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{rev.subject} • {rev.method}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {isOverdue ? '⚠️ Atrasada — ' : isToday ? '📌 Hoje — ' : ''}
                          {revDate.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button size="sm" onClick={() => handleCompleteRevision(rev.id)}>
                        <CheckCircle2 className="w-4 h-4 mr-1" /> Concluir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {completedRevisions.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-muted-foreground flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Concluídas ({completedRevisions.length})</h3>
            {completedRevisions.slice(0, 5).map((rev: any) => (
              <Card key={rev.id} className="opacity-60">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium text-sm">{rev.title}</p>
                      <p className="text-xs text-muted-foreground">{rev.subject} • {new Date(rev.revisionDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── CREATE EVENT VIEW ─────────────────────────────────────
  if (view === 'create') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Button variant="ghost" onClick={() => setView('calendar')}><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Plus className="w-5 h-5" /> Novo Evento Acadêmico</CardTitle>
            <CardDescription>Adicione provas, trabalhos e seminários ao calendário</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Título *</label>
              <input value={newEvent.title} onChange={e => setNewEvent(ev => ({ ...ev, title: e.target.value }))}
                placeholder="Ex: P1 de Anatomia" className="w-full mt-1 p-2.5 rounded-lg border border-border bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Disciplina *</label>
              <input value={newEvent.subject} onChange={e => setNewEvent(ev => ({ ...ev, subject: e.target.value }))}
                placeholder="Ex: Anatomia Humana" className="w-full mt-1 p-2.5 rounded-lg border border-border bg-background" />
            </div>
            <div>
              <label className="text-sm font-medium">Tipo de Evento</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-1">
                {EVENT_TYPES.map(type => {
                  const Icon = type.icon;
                  return (
                    <button key={type.id} onClick={() => setNewEvent(ev => ({ ...ev, eventType: type.id }))}
                      className={`p-2 rounded-lg border-2 text-center transition-all ${newEvent.eventType === type.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-xs">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Data *</label>
                <input type="date" value={newEvent.eventDate} onChange={e => setNewEvent(ev => ({ ...ev, eventDate: e.target.value }))}
                  className="w-full mt-1 p-2.5 rounded-lg border border-border bg-background" />
              </div>
              <div>
                <label className="text-sm font-medium">Horário</label>
                <input type="time" value={newEvent.eventTime} onChange={e => setNewEvent(ev => ({ ...ev, eventTime: e.target.value }))}
                  className="w-full mt-1 p-2.5 rounded-lg border border-border bg-background" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <textarea value={newEvent.description} onChange={e => setNewEvent(ev => ({ ...ev, description: e.target.value }))}
                placeholder="Conteúdo da prova, capítulos..." rows={3}
                className="w-full mt-1 p-2.5 rounded-lg border border-border bg-background resize-none" />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <input type="checkbox" checked={newEvent.autoRevisions} onChange={e => setNewEvent(ev => ({ ...ev, autoRevisions: e.target.checked }))} id="autoRev" />
              <label htmlFor="autoRev" className="text-sm">
                <span className="font-medium">Gerar revisões automáticas</span>
                <span className="text-muted-foreground block text-xs">Baseado na curva de esquecimento: 14, 7, 3 e 1 dia antes</span>
              </label>
            </div>
            {newEvent.autoRevisions && newEvent.eventDate && (
              <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                <p className="text-xs font-bold text-muted-foreground">Revisões que serão criadas:</p>
                {REVISION_INTERVALS.map(rev => {
                  const revDate = new Date(newEvent.eventDate);
                  revDate.setDate(revDate.getDate() - rev.days);
                  return (
                    <div key={rev.days} className="flex items-center gap-2 text-xs">
                      <Brain className="w-3 h-3 text-primary" />
                      <span className="font-medium">{revDate.toLocaleDateString('pt-BR')}</span>
                      <span className="text-muted-foreground">— {rev.method}</span>
                    </div>
                  );
                })}
              </div>
            )}
            <Button className="w-full" onClick={handleCreateEvent} disabled={createEventMutation.isPending}>
              {createEventMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Calendar className="w-4 h-4 mr-2" />}
              Criar Evento
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ─── CALENDAR VIEW ─────────────────────────────────────────
  const pendingRevisions = (revisionsQuery.data || []).filter((r: any) => !r.completed);
  const upcoming = upcomingEvents;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-foreground">Calendário Acadêmico</h2>
          <p className="text-muted-foreground mt-1">Organize provas, trabalhos e revisões automáticas</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setView('revisions')}>
            <Brain className="w-4 h-4 mr-2" /> Revisões
            {pendingRevisions.length > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">{pendingRevisions.length}</Badge>
            )}
          </Button>
          <Button onClick={() => setView('create')}>
            <Plus className="w-4 h-4 mr-2" /> Novo Evento
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={() => navigateMonth(-1)}><ChevronLeft className="w-4 h-4" /></Button>
              <CardTitle className="text-lg">{MONTHS_PT[month - 1]} {year}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigateMonth(1)}><ChevronRight className="w-4 h-4" /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {DAYS_PT.map(d => (
                <div key={d} className="text-center text-xs font-bold text-muted-foreground py-2">{d}</div>
              ))}
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={`pad-${idx}`} />;
                const key = day.toISOString().split('T')[0];
                const dayEvents = eventsByDate[key] || [];
                const isToday = key === todayKey;
                const isSelected = selectedDate && key === selectedDate.toISOString().split('T')[0];
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(day)}
                    className={`p-1 rounded-lg text-center min-h-[60px] transition-all border ${
                      isSelected ? 'border-primary bg-primary/5' :
                      isToday ? 'border-primary/50 bg-primary/5' :
                      'border-transparent hover:bg-muted/50'
                    }`}
                  >
                    <span className={`text-sm ${isToday ? 'font-bold text-primary' : ''}`}>{day.getDate()}</span>
                    <div className="flex flex-wrap gap-0.5 justify-center mt-1">
                      {dayEvents.slice(0, 3).map((ev: any) => {
                        const typeInfo = EVENT_TYPES.find(t => t.id === ev.eventType);
                        return <div key={ev.id} className={`w-2 h-2 rounded-full ${typeInfo?.color || 'bg-gray-400'}`} />;
                      })}
                    </div>
                  </button>
                );
              })}
            </div>
            {/* Legend */}
            <div className="flex flex-wrap gap-3 mt-4 pt-3 border-t border-border">
              {EVENT_TYPES.map(type => (
                <div key={type.id} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className={`w-2.5 h-2.5 rounded-full ${type.color}`} />
                  {type.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar: Selected Day + Upcoming */}
        <div className="space-y-4">
          {/* Selected Day Events */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(eventsByDate[selectedDate.toISOString().split('T')[0]] || []).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento neste dia</p>
                )}
                {(eventsByDate[selectedDate.toISOString().split('T')[0]] || []).map((ev: any) => {
                  const typeInfo = EVENT_TYPES.find(t => t.id === ev.eventType);
                  const Icon = typeInfo?.icon || Calendar;
                  return (
                    <div key={ev.id} className="p-3 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg ${typeInfo?.color || 'bg-gray-400'} bg-opacity-20 flex items-center justify-center`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-sm">{ev.title}</p>
                            <p className="text-xs text-muted-foreground">{ev.subject}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteEvent(ev.id)}>
                          <Trash2 className="w-3 h-3 text-muted-foreground" />
                        </Button>
                      </div>
                      {ev.description && <p className="text-xs text-muted-foreground mt-2">{ev.description}</p>}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="w-4 h-4" /> Próximos 14 dias
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {upcoming.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum evento próximo</p>
              )}
              {upcoming.map((ev: any) => {
                const typeInfo = EVENT_TYPES.find(t => t.id === ev.eventType);
                const daysUntil = Math.ceil((new Date(ev.eventDate).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                return (
                  <div key={ev.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                    <div className={`w-2 h-8 rounded-full ${typeInfo?.color || 'bg-gray-400'}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{ev.title}</p>
                      <p className="text-xs text-muted-foreground">{ev.subject}</p>
                    </div>
                    <Badge variant={daysUntil <= 3 ? 'destructive' : 'secondary'} className="text-xs shrink-0">
                      {daysUntil === 0 ? 'Hoje' : daysUntil === 1 ? 'Amanhã' : `${daysUntil}d`}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Pending Revisions Summary */}
          {pendingRevisions.length > 0 && (
            <Card className="border-yellow-500/30">
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-bold">{pendingRevisions.length} revisões pendentes</span>
                </div>
                {pendingRevisions.slice(0, 3).map((rev: any) => (
                  <div key={rev.id} className="flex items-center gap-2 text-xs py-1">
                    <Brain className="w-3 h-3 text-primary" />
                    <span className="truncate">{rev.title}</span>
                    <span className="text-muted-foreground shrink-0">{new Date(rev.revisionDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => setView('revisions')}>
                  Ver todas as revisões
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AcademicCalendar;
