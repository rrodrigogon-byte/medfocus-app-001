/**
 * ReportExporter — Exportação de Relatórios em PDF
 * Gera relatórios de desempenho nos simulados e progresso no calendário.
 * Usa jsPDF para geração client-side.
 */
import React, { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Download, FileText, BarChart3, Calendar, Loader2,
  Trophy, Target, Clock, BookOpen, GraduationCap,
  TrendingUp, Activity, CheckCircle2
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type ReportType = 'simulado' | 'calendar' | 'progress';

const REPORT_TYPES = [
  {
    id: 'simulado' as ReportType,
    name: 'Relatório de Simulados',
    description: 'Desempenho detalhado por área médica, histórico de notas e evolução',
    icon: BarChart3,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    id: 'calendar' as ReportType,
    name: 'Relatório do Calendário',
    description: 'Eventos acadêmicos, provas realizadas e revisões pendentes',
    icon: Calendar,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    id: 'progress' as ReportType,
    name: 'Relatório de Progresso',
    description: 'Visão geral do progresso acadêmico, XP, horas de estudo e conquistas',
    icon: TrendingUp,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
  },
];

const ReportExporter: React.FC = () => {
  const [generating, setGenerating] = useState<ReportType | null>(null);

  const statsQuery = trpc.simulado.stats.useQuery(undefined, { retry: false });
  const historyQuery = trpc.simulado.list.useQuery(undefined, { retry: false });
  const calendarQuery = trpc.calendar.getEvents.useQuery(
    undefined,
    { retry: false }
  );

  // ─── Generate Simulado Report ──────────────────────────────
  const generateSimuladoReport = async () => {
    setGenerating('simulado');
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('MedFocus — Relatório de Simulados', pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth / 2, y, { align: 'center' });
      y += 15;
      doc.setTextColor(0);

      // Stats Summary
      if (statsQuery.data) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Resumo Geral', 14, y);
        y += 8;

        autoTable(doc, {
          startY: y,
          head: [['Métrica', 'Valor']],
          body: [
            ['Total de Simulados Realizados', String(statsQuery.data.totalCompleted)],
            ['Nota Média', `${Math.round(statsQuery.data.avgScore)}%`],
          ],
          theme: 'striped',
          headStyles: { fillColor: [20, 184, 166] },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 15;
      }

      // History Table
      if (historyQuery.data && historyQuery.data.length > 0) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Histórico de Simulados', 14, y);
        y += 8;

        autoTable(doc, {
          startY: y,
          head: [['Data', 'Tipo', 'Nota', 'Acertos', 'Status']],
          body: historyQuery.data.map((sim: any) => [
            new Date(sim.createdAt).toLocaleDateString('pt-BR'),
            sim.examType?.toUpperCase() || 'N/A',
            sim.score !== null ? `${sim.score}%` : '-',
            sim.correctAnswers !== null ? `${sim.correctAnswers}/${sim.totalQuestions}` : '-',
            sim.status === 'completed' ? 'Concluído' : 'Em andamento',
          ]),
          theme: 'striped',
          headStyles: { fillColor: [20, 184, 166] },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 15;

        // Area Performance from latest completed simulado
        const latestCompleted = historyQuery.data.find((s: any) => s.status === 'completed' && s.results);
        if (latestCompleted?.results) {
          try {
            const areaResults = JSON.parse(latestCompleted.results);
            if (y > 240) { doc.addPage(); y = 20; }

            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text('Desempenho por Área (Último Simulado)', 14, y);
            y += 8;

            autoTable(doc, {
              startY: y,
              head: [['Área Médica', 'Acertos', 'Total', 'Aproveitamento']],
              body: Object.entries(areaResults).map(([area, data]: [string, any]) => [
                area,
                String(data.correct),
                String(data.total),
                `${data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0}%`,
              ]),
              theme: 'striped',
              headStyles: { fillColor: [20, 184, 166] },
              margin: { left: 14, right: 14 },
            });
          } catch (e) {
            // ignore parse errors
          }
        }
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`MedFocus — Página ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }

      doc.save(`MedFocus_Simulados_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Relatório de simulados exportado com sucesso!');
    } catch (e) {
      console.error('Erro ao gerar PDF:', e);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setGenerating(null);
    }
  };

  // ─── Generate Calendar Report ──────────────────────────────
  const generateCalendarReport = async () => {
    setGenerating('calendar');
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('MedFocus — Relatório do Calendário', pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth / 2, y, { align: 'center' });
      y += 15;
      doc.setTextColor(0);

      if (calendarQuery.data && calendarQuery.data.length > 0) {
        // Separate past and future events
        const now = new Date();
        const pastEvents = calendarQuery.data.filter((e: any) => new Date(e.eventDate) < now);
        const futureEvents = calendarQuery.data.filter((e: any) => new Date(e.eventDate) >= now);

        // Summary
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Resumo', 14, y);
        y += 8;

        const eventTypes = calendarQuery.data.reduce((acc: any, e: any) => {
          acc[e.eventType] = (acc[e.eventType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        autoTable(doc, {
          startY: y,
          head: [['Métrica', 'Valor']],
          body: [
            ['Total de Eventos', String(calendarQuery.data.length)],
            ['Eventos Passados', String(pastEvents.length)],
            ['Eventos Futuros', String(futureEvents.length)],
            ...Object.entries(eventTypes).map(([type, count]) => [
              `Tipo: ${type === 'exam' ? 'Prova' : type === 'study' ? 'Estudo' : type === 'revision' ? 'Revisão' : type === 'deadline' ? 'Prazo' : type}`,
              String(count),
            ]),
          ],
          theme: 'striped',
          headStyles: { fillColor: [20, 184, 166] },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 15;

        // Upcoming Events
        if (futureEvents.length > 0) {
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Próximos Eventos', 14, y);
          y += 8;

          autoTable(doc, {
            startY: y,
            head: [['Data', 'Tipo', 'Título', 'Disciplina']],
            body: futureEvents.slice(0, 20).map((e: any) => [
              new Date(e.eventDate).toLocaleDateString('pt-BR'),
              e.eventType === 'exam' ? 'Prova' : e.eventType === 'study' ? 'Estudo' : e.eventType === 'revision' ? 'Revisão' : e.eventType === 'deadline' ? 'Prazo' : e.eventType,
              e.title,
              e.subject || '-',
            ]),
            theme: 'striped',
            headStyles: { fillColor: [20, 184, 166] },
            margin: { left: 14, right: 14 },
          });
          y = (doc as any).lastAutoTable.finalY + 15;
        }

        // Past Events
        if (pastEvents.length > 0) {
          if (y > 200) { doc.addPage(); y = 20; }
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          doc.text('Eventos Realizados (Últimos 90 dias)', 14, y);
          y += 8;

          autoTable(doc, {
            startY: y,
            head: [['Data', 'Tipo', 'Título', 'Disciplina']],
            body: pastEvents.slice(0, 30).map((e: any) => [
              new Date(e.eventDate).toLocaleDateString('pt-BR'),
              e.eventType === 'exam' ? 'Prova' : e.eventType === 'study' ? 'Estudo' : e.eventType === 'revision' ? 'Revisão' : e.eventType === 'deadline' ? 'Prazo' : e.eventType,
              e.title,
              e.subject || '-',
            ]),
            theme: 'striped',
            headStyles: { fillColor: [20, 184, 166] },
            margin: { left: 14, right: 14 },
          });
        }
      } else {
        doc.setFontSize(12);
        doc.text('Nenhum evento encontrado no período.', 14, y);
      }

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`MedFocus — Página ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }

      doc.save(`MedFocus_Calendario_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Relatório do calendário exportado com sucesso!');
    } catch (e) {
      console.error('Erro ao gerar PDF:', e);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setGenerating(null);
    }
  };

  // ─── Generate Progress Report ──────────────────────────────
  const generateProgressReport = async () => {
    setGenerating('progress');
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('MedFocus — Relatório de Progresso', pageWidth / 2, y, { align: 'center' });
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100);
      doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`, pageWidth / 2, y, { align: 'center' });
      y += 15;
      doc.setTextColor(0);

      // Simulado Stats
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Desempenho em Simulados', 14, y);
      y += 8;

      if (statsQuery.data) {
        autoTable(doc, {
          startY: y,
          head: [['Indicador', 'Valor', 'Meta', 'Status']],
          body: [
            ['Simulados Realizados', String(statsQuery.data.totalCompleted), '10+', statsQuery.data.totalCompleted >= 10 ? 'Atingido' : 'Em progresso'],
            ['Nota Média', `${Math.round(statsQuery.data.avgScore)}%`, '60%', statsQuery.data.avgScore >= 60 ? 'Atingido' : 'Em progresso'],
          ],
          theme: 'striped',
          headStyles: { fillColor: [20, 184, 166] },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 15;
      }

      // Calendar Activity
      if (calendarQuery.data) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Atividade no Calendário', 14, y);
        y += 8;

        const exams = calendarQuery.data.filter((e: any) => e.eventType === 'exam').length;
        const studies = calendarQuery.data.filter((e: any) => e.eventType === 'study').length;
        const revisions = calendarQuery.data.filter((e: any) => e.eventType === 'revision').length;

        autoTable(doc, {
          startY: y,
          head: [['Tipo de Evento', 'Quantidade']],
          body: [
            ['Provas Agendadas', String(exams)],
            ['Sessões de Estudo', String(studies)],
            ['Revisões Programadas', String(revisions)],
            ['Total de Eventos', String(calendarQuery.data.length)],
          ],
          theme: 'striped',
          headStyles: { fillColor: [20, 184, 166] },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 15;
      }

      // Recommendations
      if (y > 200) { doc.addPage(); y = 20; }
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Recomendações', 14, y);
      y += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const recommendations = [
        'Realize pelo menos 2 simulados por semana para manter a consistência.',
        'Foque nas áreas com menor aproveitamento nos simulados anteriores.',
        'Utilize o calendário para agendar revisões espaçadas (curva de Ebbinghaus).',
        'Revise as questões erradas dos simulados para consolidar o aprendizado.',
        'Mantenha um ritmo constante de estudo — regularidade supera intensidade.',
      ];

      recommendations.forEach((rec, i) => {
        doc.text(`${i + 1}. ${rec}`, 14, y, { maxWidth: pageWidth - 28 });
        y += 8;
      });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(`MedFocus — Página ${i} de ${pageCount}`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
      }

      doc.save(`MedFocus_Progresso_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('Relatório de progresso exportado com sucesso!');
    } catch (e) {
      console.error('Erro ao gerar PDF:', e);
      toast.error('Erro ao gerar relatório. Tente novamente.');
    } finally {
      setGenerating(null);
    }
  };

  const handleGenerate = (type: ReportType) => {
    switch (type) {
      case 'simulado': return generateSimuladoReport();
      case 'calendar': return generateCalendarReport();
      case 'progress': return generateProgressReport();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <FileText className="w-7 h-7 text-primary" /> Exportar Relatórios
        </h2>
        <p className="text-muted-foreground mt-1">
          Gere relatórios em PDF para acompanhamento com orientadores e autoavaliação
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {REPORT_TYPES.map(report => {
          const Icon = report.icon;
          const isGenerating = generating === report.id;
          return (
            <Card key={report.id} className="border-2 hover:border-primary/50 transition-all">
              <CardHeader>
                <div className={`w-12 h-12 rounded-xl ${report.bgColor} flex items-center justify-center mb-3`}>
                  <Icon className={`w-6 h-6 ${report.color}`} />
                </div>
                <CardTitle className="text-lg">{report.name}</CardTitle>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => handleGenerate(report.id)}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando...</>
                  ) : (
                    <><Download className="w-4 h-4 mr-2" /> Baixar PDF</>
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5" /> Prévia dos Dados
          </CardTitle>
          <CardDescription>Resumo dos dados que serão incluídos nos relatórios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-center">
              <Trophy className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{statsQuery.data?.totalCompleted || 0}</p>
              <p className="text-xs text-muted-foreground">Simulados</p>
            </div>
            <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20 text-center">
              <Target className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{statsQuery.data ? Math.round(statsQuery.data.avgScore) : 0}%</p>
              <p className="text-xs text-muted-foreground">Nota Média</p>
            </div>
            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-center">
              <Calendar className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{calendarQuery.data?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Eventos</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
              <CheckCircle2 className="w-6 h-6 text-amber-500 mx-auto mb-2" />
              <p className="text-2xl font-bold">{statsQuery.data?.totalCompleted || 0}</p>
              <p className="text-xs text-muted-foreground">Concluídos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportExporter;
