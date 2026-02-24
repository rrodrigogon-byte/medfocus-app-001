import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";
import { ENV } from "./_core/env";
import { z } from "zod";
import Stripe from "stripe";
import { PLANS } from "./products";
import { searchFDADrugs, getFDAAdverseEvents, getFDADrugInteractions, searchPubMed, calculateGlasgow, calculateSOFA, calculateAPACHEII, calculateWells, calculateCHA2DS2VASc, calculateChildPugh, calculateMELD } from "./services/medicalApis";
import { getOrCreateProgress, addXp, getXpHistory, logStudySession, updateUserProfile, createClassroom, getClassroomsByProfessor, getClassroomsByStudent, getClassroomById, joinClassroom, getEnrollments, removeEnrollment, createActivity, getActivitiesByClassroom, updateActivity, submitActivity, gradeSubmission, getSubmissionsByActivity, getStudentSubmissions, getClassroomAnalytics, findGeneratedMaterial, saveGeneratedMaterial, getUserMaterialHistory, getGeneratedMaterialById, rateMaterial, searchLibraryMaterials, saveLibraryMaterial, getLibraryMaterialById, toggleSaveMaterial, getUserSavedMaterialIds, getUserSavedMaterialsFull, getPopularLibraryMaterials, searchPubmedCache, savePubmedArticle, getPubmedArticleByPmid, addMaterialReview, getMaterialReviews, markReviewHelpful, trackStudyActivity, getUserStudyHistoryData, getUserTopSubjects, getUserQuizPerformance, subscribeToSubject, unsubscribeFromSubject, getUserSubscriptions, getUserNotifications, getUnreadNotificationCount, markNotificationRead, markAllNotificationsRead, notifySubscribersOfNewMaterial, saveStudyTemplate, getStudyTemplates, getStudyTemplateById, getUserTemplates, shareTemplate, getSharedTemplateByCode, getSharedTemplateFeed, likeSharedTemplate, createStudyRoom, getStudyRooms, joinStudyRoom, getStudyRoomById, sendRoomMessage, getRoomMessages, createSharedNote, getRoomNotes, createCalendarEvent, getCalendarEvents, updateCalendarEvent, deleteCalendarEvent, createRevisionSuggestions, getRevisionSuggestions, completeRevision, createSimulado, getSimulados, completeSimulado, getSimuladoQuestions, saveSimuladoQuestion, getSimuladoStats, getWeeklyGoals, createWeeklyGoal, updateGoalProgress, incrementGoalProgress, deleteWeeklyGoal, getUserXP, ensureUserXP, addXP, updateStreak, updateXPStats, getLeaderboard, getXPActivities, getPublicProfile, createClinicalCase, getClinicalCase, getUserClinicalCases, updateClinicalCase, createBattle, getBattleByCode, getBattle, getUserBattles, joinBattle, updateBattle, createSmartSummary, getUserSummaries, getPublicSummaries, getSummaryByShareCode, toggleSummaryPublic, postToFeed, getFeed, likeFeedItem, commentOnFeed, getFeedComments, getUserFeedLikes, getPerformanceBySpecialty, createFlashcardDeck, getUserFlashcardDecks, getPublicFlashcardDecks, addFlashcardCards, getDueFlashcards, getAllFlashcards, reviewFlashcard, deleteDeck, createExam, getUserExams, getUpcomingExams, updateExam, deleteExam, createStudySuggestions, getExamSuggestions, markSuggestionCompleted } from "./db";

function getStripe() {
  return new Stripe(ENV.stripeSecretKey, { apiVersion: "2026-01-28.clover" });
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ─── Stripe Subscription Router ────────────────────────
  stripe: router({
    getPlans: publicProcedure.query(() => {
      return Object.values(PLANS);
    }),

    createCheckout: protectedProcedure
      .input(z.object({ planId: z.enum(["pro", "premium"]) }))
      .mutation(async ({ ctx, input }) => {
        const stripe = getStripe();
        const plan = PLANS[input.planId];
        const origin = ctx.req.headers.origin || process.env.APP_URL || "https://medfocus-app-969630653332.southamerica-east1.run.app";

        const session = await stripe.checkout.sessions.create({
          mode: "subscription",
          payment_method_types: ["card"],
          customer_email: ctx.user.email || undefined,
          client_reference_id: ctx.user.id.toString(),
          allow_promotion_codes: true,
          metadata: {
            user_id: ctx.user.id.toString(),
            customer_email: ctx.user.email || "",
            customer_name: ctx.user.name || "",
            plan: input.planId,
          },
          line_items: [
            {
              price_data: {
                currency: plan.currency,
                product_data: {
                  name: plan.name,
                  description: plan.description,
                },
                unit_amount: plan.price,
                recurring: { interval: plan.interval },
              },
              quantity: 1,
            },
          ],
          success_url: `${origin}/?payment=success`,
          cancel_url: `${origin}/?payment=cancelled`,
        });

        return { url: session.url };
      }),

    getSubscription: protectedProcedure.query(async ({ ctx }) => {
      const user = ctx.user;
      return {
        plan: user.plan || "free",
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
      };
    }),
  }),

  // ─── XP & Progress Router ───────────────────────────
  progress: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      return getOrCreateProgress(ctx.user.id);
    }),

    addXp: protectedProcedure
      .input(z.object({
        action: z.string(),
        xpAmount: z.number(),
        description: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return addXp(ctx.user.id, input.action, input.xpAmount, input.description);
      }),

    history: protectedProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return getXpHistory(ctx.user.id, input?.limit || 20);
      }),

    logSession: protectedProcedure
      .input(z.object({
        type: z.enum(['pomodoro', 'free_study']),
        durationMinutes: z.number(),
        subject: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await logStudySession(ctx.user.id, input.type, input.durationMinutes, input.subject);
        return { success: true };
      }),
  }),

  // ─── User Profile Router ────────────────────────────
  profile: router({
    update: protectedProcedure
      .input(z.object({
        universityId: z.string().optional(),
        currentYear: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await updateUserProfile(ctx.user.id, input.universityId, input.currentYear);
        return { success: true };
      }),
    // Public profile - accessible without auth
    public: publicProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const profile = await getPublicProfile(input.userId);
        if (!profile) throw new TRPCError({ code: 'NOT_FOUND', message: 'Perfil não encontrado' });
        return profile;
      }),
    // Get own profile ID for sharing
    myId: protectedProcedure.query(async ({ ctx }) => {
      return { userId: ctx.user.id };
    }),
  }),

  // ─── MedGenie AI Router ────────────────────────────────
  ai: router({
    generateContent: publicProcedure
      .input(z.object({
        subject: z.string(),
        universityName: z.string(),
        year: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { subject, universityName, year } = input;
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `Você é o MedGenie, um tutor médico de elite especializado em educação médica brasileira. 
Sempre responda em português brasileiro. Gere conteúdo baseado em evidências com referências reais.
Retorne SEMPRE um JSON válido no formato especificado.`,
            },
            {
              role: "user",
              content: `GERAR MATERIAL DE ESTUDO COMPLETO:
Disciplina: ${subject}
Universidade: ${universityName}
Ano: ${year}º Ano

Retorne um JSON com esta estrutura exata:
{
  "summary": "Resumo profundo de 3-4 parágrafos com foco em fisiopatologia e correlação clínica",
  "keyPoints": ["5 pontos críticos que caem em provas de residência (ENARE/USP/AMP)"],
  "flashcards": [{"front": "Pergunta", "back": "Resposta detalhada"}],
  "visualPrompt": "Descrição de um esquema visual para memorização",
  "innovations": ["2 avanços recentes na área"],
  "references": [{"title": "Nome do livro/artigo", "author": "Autor", "type": "Livro/Artigo", "verifiedBy": "Instituição"}],
  "quiz": [{"question": "Pergunta complexa", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "Justificativa detalhada", "source": "Referência"}]
}`,
            },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "study_content",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  summary: { type: "string" },
                  keyPoints: { type: "array", items: { type: "string" } },
                  flashcards: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: { front: { type: "string" }, back: { type: "string" } },
                      required: ["front", "back"],
                      additionalProperties: false,
                    },
                  },
                  visualPrompt: { type: "string" },
                  innovations: { type: "array", items: { type: "string" } },
                  references: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" }, author: { type: "string" },
                        type: { type: "string" }, verifiedBy: { type: "string" },
                      },
                      required: ["title", "author", "type", "verifiedBy"],
                      additionalProperties: false,
                    },
                  },
                  quiz: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        question: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        correctIndex: { type: "number" },
                        explanation: { type: "string" },
                        source: { type: "string" },
                      },
                      required: ["question", "options", "correctIndex", "explanation", "source"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["summary", "keyPoints", "flashcards", "visualPrompt", "innovations", "references", "quiz"],
                additionalProperties: false,
              },
            },
          },
        });

        const content = response.choices[0]?.message?.content;
        if (typeof content === "string") return JSON.parse(content);
        throw new Error("Invalid AI response");
      }),

    research: publicProcedure
      .input(z.object({ topic: z.string() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um pesquisador médico sênior. Responda em português brasileiro com informações baseadas em evidências científicas recentes." },
            { role: "user", content: `Traga os 3 artigos/estudos mais relevantes e recentes sobre "${input.topic}" das principais revistas médicas (NEJM, Lancet, JAMA, Nature Medicine, PubMed). Para cada artigo inclua: título, autores principais, revista, ano, resumo de 2-3 frases e DOI quando disponível. Também inclua uma síntese geral do estado da arte neste tema.` },
          ],
        });
        const content = response.choices[0]?.message?.content;
        return typeof content === "string" ? content : "Pesquisa indisponível no momento.";
      }),

    chat: publicProcedure
      .input(z.object({ message: z.string() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: `Você é o MedGenie, tutor médico sênior especializado em educação médica brasileira. Responda sempre em português brasileiro, com base em evidências científicas. Seja didático, use analogias quando possível e cite referências. Para questões clínicas, sempre mencione diagnósticos diferenciais. Formate sua resposta com markdown para melhor legibilidade.` },
            { role: "user", content: input.message },
          ],
        });
        const content = response.choices[0]?.message?.content;
        return typeof content === "string" ? content : "Desculpe, não consegui processar sua pergunta.";
      }),

    generateQuiz: publicProcedure
      .input(z.object({ title: z.string(), subject: z.string(), description: z.string().optional() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um professor de medicina brasileiro especialista em elaborar questões de prova. Gere questões no estilo ENARE/Residência Médica. Retorne JSON válido." },
            { role: "user", content: `Gere 5 questões de múltipla escolha sobre: ${input.title} (${input.subject}). ${input.description || ''} Retorne JSON: {"questions": [{"question": "...", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "...", "difficulty": "easy|medium|hard"}]}` },
          ],
          response_format: { type: "json_schema", json_schema: { name: "quiz", strict: true, schema: { type: "object", properties: { questions: { type: "array", items: { type: "object", properties: { question: { type: "string" }, options: { type: "array", items: { type: "string" } }, correctIndex: { type: "number" }, explanation: { type: "string" }, difficulty: { type: "string" } }, required: ["question", "options", "correctIndex", "explanation", "difficulty"], additionalProperties: false } } }, required: ["questions"], additionalProperties: false } } },
        });
        const content = response.choices[0]?.message?.content;
        return typeof content === "string" ? JSON.parse(content) : { questions: [] };
      }),

    generateFlashcards: publicProcedure
      .input(z.object({ title: z.string(), subject: z.string(), description: z.string().optional() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um professor de medicina brasileiro. Gere flashcards de alta qualidade para revisão espaçada. Retorne JSON válido." },
            { role: "user", content: `Gere 8 flashcards sobre: ${input.title} (${input.subject}). ${input.description || ''} Retorne JSON: {"cards": [{"front": "Pergunta", "back": "Resposta detalhada com explicação", "difficulty": "easy|medium|hard"}]}` },
          ],
          response_format: { type: "json_schema", json_schema: { name: "flashcards", strict: true, schema: { type: "object", properties: { cards: { type: "array", items: { type: "object", properties: { front: { type: "string" }, back: { type: "string" }, difficulty: { type: "string" } }, required: ["front", "back", "difficulty"], additionalProperties: false } } }, required: ["cards"], additionalProperties: false } } },
        });
        const content = response.choices[0]?.message?.content;
        return typeof content === "string" ? JSON.parse(content) : { cards: [] };
      }),

    generateMindMap: publicProcedure
      .input(z.object({ title: z.string(), subject: z.string(), description: z.string().optional() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um professor de medicina brasileiro. Gere um mapa mental estruturado em formato de árvore. Retorne JSON válido." },
            { role: "user", content: `Gere um mapa mental sobre: ${input.title} (${input.subject}). ${input.description || ''} Retorne JSON: {"title": "Tema central", "nodes": [{"label": "Subtema", "children": [{"label": "Detalhe", "children": []}]}]}` },
          ],
          response_format: { type: "json_schema", json_schema: { name: "mindmap", strict: true, schema: { type: "object", properties: { title: { type: "string" }, nodes: { type: "array", items: { type: "object", properties: { label: { type: "string" }, children: { type: "array", items: { type: "object", properties: { label: { type: "string" }, children: { type: "array", items: { type: "object", properties: { label: { type: "string" } }, required: ["label"], additionalProperties: false } } }, required: ["label", "children"], additionalProperties: false } } }, required: ["label", "children"], additionalProperties: false } } }, required: ["title", "nodes"], additionalProperties: false } } },
        });
        const content = response.choices[0]?.message?.content;
        return typeof content === "string" ? JSON.parse(content) : { title: input.title, nodes: [] };
      }),

    generateSummary: publicProcedure
      .input(z.object({ title: z.string(), subject: z.string(), description: z.string().optional() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            { role: "system", content: "Você é um professor de medicina brasileiro. Gere um resumo acadêmico completo com referências. Use markdown para formatação." },
            { role: "user", content: `Gere um resumo acadêmico completo sobre: ${input.title} (${input.subject}). ${input.description || ''} Inclua: conceitos-chave, fisiopatologia, diagnóstico diferencial, tratamento e referências bibliográficas reais.` },
          ],
        });
        const content = response.choices[0]?.message?.content;
        return typeof content === "string" ? content : "Resumo indisponível.";
      }),
  }),

  // ─── Material History Router ───────────────────────────
  materials: router({
    /** Check if material already exists in DB before generating */
    findCached: protectedProcedure
      .input(z.object({
        universityId: z.string(),
        subject: z.string(),
        year: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        const cached = await findGeneratedMaterial(ctx.user.id, input.universityId, input.subject, input.year);
        if (!cached) return null;
        return {
          id: cached.id,
          content: JSON.parse(cached.content),
          research: cached.research,
          accessCount: cached.accessCount,
          createdAt: cached.createdAt,
        };
      }),

    /** Save newly generated material to DB */
    save: protectedProcedure
      .input(z.object({
        universityId: z.string(),
        universityName: z.string(),
        subject: z.string(),
        year: z.number(),
        content: z.string(), // JSON stringified SubjectContent
        research: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await saveGeneratedMaterial({
          userId: ctx.user.id,
          universityId: input.universityId,
          universityName: input.universityName,
          subject: input.subject,
          year: input.year,
          content: input.content,
          research: input.research,
        });
        return { success: true };
      }),

    /** Get user's material history */
    history: protectedProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return getUserMaterialHistory(ctx.user.id, input?.limit || 50);
      }),

    /** Get a specific generated material by ID */
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const mat = await getGeneratedMaterialById(input.id);
        if (!mat) throw new TRPCError({ code: 'NOT_FOUND', message: 'Material não encontrado' });
        return {
          ...mat,
          content: JSON.parse(mat.content),
        };
      }),

    /** Rate a generated material */
    rate: protectedProcedure
      .input(z.object({ id: z.number(), score: z.number().min(0).max(100) }))
      .mutation(async ({ input }) => {
        await rateMaterial(input.id, input.score);
        return { success: true };
      }),

    /** Generate PDF from material content */
    exportPdf: protectedProcedure
      .input(z.object({
        subject: z.string(),
        universityName: z.string(),
        year: z.number(),
        content: z.object({
          summary: z.string(),
          keyPoints: z.array(z.string()),
          flashcards: z.array(z.object({ front: z.string(), back: z.string() })).optional(),
          innovations: z.array(z.string()).optional(),
          references: z.array(z.object({
            title: z.string(), author: z.string(),
            type: z.string(), verifiedBy: z.string(),
          })).optional(),
          quiz: z.array(z.object({
            question: z.string(), options: z.array(z.string()),
            correctIndex: z.number(), explanation: z.string(), source: z.string(),
          })).optional(),
        }),
      }))
      .mutation(async ({ input }) => {
        const { subject, universityName, year, content } = input;
        // Generate HTML for PDF
        const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.7; padding: 40px; max-width: 800px; margin: 0 auto; }
    h1 { color: #0d9488; font-size: 26px; margin-bottom: 8px; border-bottom: 3px solid #0d9488; padding-bottom: 12px; }
    h2 { color: #0f766e; font-size: 18px; margin-top: 28px; margin-bottom: 12px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
    h3 { color: #115e59; font-size: 15px; margin-top: 20px; margin-bottom: 8px; }
    .meta { color: #64748b; font-size: 13px; margin-bottom: 24px; }
    .meta span { margin-right: 16px; }
    p { margin-bottom: 12px; text-align: justify; }
    ul, ol { padding-left: 24px; margin-bottom: 12px; }
    li { margin-bottom: 6px; }
    .card { background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 8px; padding: 14px; margin-bottom: 10px; }
    .card strong { color: #0d9488; }
    .ref { background: #f8fafc; border-left: 3px solid #0d9488; padding: 10px 14px; margin-bottom: 8px; border-radius: 4px; }
    .ref strong { display: block; color: #0f172a; }
    .ref small { color: #64748b; }
    .quiz { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 14px; margin-bottom: 10px; }
    .quiz .q { font-weight: 600; margin-bottom: 6px; }
    .quiz .opt { padding-left: 16px; }
    .quiz .correct { color: #059669; font-weight: 600; }
    .quiz .explanation { color: #64748b; font-size: 13px; margin-top: 6px; font-style: italic; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 2px solid #e2e8f0; color: #94a3b8; font-size: 11px; text-align: center; }
    .badge { display: inline-block; background: #0d9488; color: white; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
  </style>
</head>
<body>
  <h1>${subject}</h1>
  <div class="meta">
    <span class="badge">MedFocus</span>
    <span>${universityName} — ${year}º Ano</span>
    <span>Gerado em ${new Date().toLocaleDateString('pt-BR')}</span>
  </div>

  <h2>Resumo</h2>
  <p>${content.summary}</p>

  <h2>Pontos-Chave para Residência</h2>
  <ul>
    ${content.keyPoints.map(p => `<li>${p}</li>`).join('\n    ')}
  </ul>

  ${content.flashcards && content.flashcards.length > 0 ? `
  <h2>Flashcards</h2>
  ${content.flashcards.map((f, i) => `
  <div class="card">
    <strong>Card ${i + 1}:</strong> ${f.front}
    <p style="margin-top:6px;color:#475569">${f.back}</p>
  </div>`).join('')}
  ` : ''}

  ${content.innovations && content.innovations.length > 0 ? `
  <h2>Inovações Recentes</h2>
  <ul>
    ${content.innovations.map(i => `<li>${i}</li>`).join('\n    ')}
  </ul>
  ` : ''}

  ${content.references && content.references.length > 0 ? `
  <h2>Referências Bibliográficas</h2>
  ${content.references.map(r => `
  <div class="ref">
    <strong>${r.title}</strong>
    ${r.author} — ${r.type}
    <br/><small>Verificado por: ${r.verifiedBy}</small>
  </div>`).join('')}
  ` : ''}

  ${content.quiz && content.quiz.length > 0 ? `
  <h2>Questões para Revisão</h2>
  ${content.quiz.map((q, i) => `
  <div class="quiz">
    <div class="q">${i + 1}. ${q.question}</div>
    <div class="opt">
      ${q.options.map((o, j) => `<div class="${j === q.correctIndex ? 'correct' : ''}">${String.fromCharCode(65 + j)}) ${o}</div>`).join('\n      ')}
    </div>
    <div class="explanation">→ ${q.explanation} (Fonte: ${q.source})</div>
  </div>`).join('')}
  ` : ''}

  <div class="footer">
    <p>Material gerado por MedFocus AI — Conteúdo para fins educacionais</p>
    <p>Sempre consulte fontes primárias e orientadores para decisões clínicas</p>
  </div>
</body>
</html>`;

        return { html };
      }),
  }),

  // ─── Classroom Router ─────────────────────────────────
  classroom: router({
    create: protectedProcedure
      .input(z.object({
        name: z.string().min(3),
        subject: z.string().min(2),
        year: z.number().min(1).max(6),
        semester: z.number().min(1).max(2),
        university: z.string().min(2),
        description: z.string().optional(),
        maxStudents: z.number().min(1).max(200).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const room = await createClassroom({ ...input, professorId: ctx.user.id });
        if (!room) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Falha ao criar sala' });
        return room;
      }),

    myClassrooms: protectedProcedure.query(async ({ ctx }) => {
      const asProfessor = await getClassroomsByProfessor(ctx.user.id);
      const asStudent = await getClassroomsByStudent(ctx.user.id);
      return { asProfessor, asStudent };
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const room = await getClassroomById(input.id);
        if (!room) throw new TRPCError({ code: 'NOT_FOUND', message: 'Sala não encontrada' });
        return room;
      }),

    join: protectedProcedure
      .input(z.object({ code: z.string().min(4) }))
      .mutation(async ({ ctx, input }) => {
        const result = await joinClassroom(input.code, ctx.user.id);
        if ('error' in result) throw new TRPCError({ code: 'BAD_REQUEST', message: result.error });
        return result.classroom;
      }),

    enrollments: protectedProcedure
      .input(z.object({ classroomId: z.number() }))
      .query(async ({ input }) => {
        return getEnrollments(input.classroomId);
      }),

    removeStudent: protectedProcedure
      .input(z.object({ enrollmentId: z.number() }))
      .mutation(async ({ input }) => {
        await removeEnrollment(input.enrollmentId);
        return { success: true };
      }),

    createActivity: protectedProcedure
      .input(z.object({
        classroomId: z.number(),
        title: z.string().min(3),
        type: z.enum(['quiz', 'flashcards', 'assignment', 'reading', 'discussion']),
        description: z.string().optional(),
        dueDate: z.date().optional(),
        points: z.number().optional(),
        content: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const activity = await createActivity(input);
        if (!activity) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Falha ao criar atividade' });
        return activity;
      }),

    activities: protectedProcedure
      .input(z.object({ classroomId: z.number() }))
      .query(async ({ input }) => {
        return getActivitiesByClassroom(input.classroomId);
      }),

    updateActivity: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        dueDate: z.date().optional(),
        points: z.number().optional(),
        status: z.string().optional(),
        content: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateActivity(id, data);
        return { success: true };
      }),

    submit: protectedProcedure
      .input(z.object({
        activityId: z.number(),
        response: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const sub = await submitActivity(input.activityId, ctx.user.id, input.response);
        if (!sub) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Falha ao enviar resposta' });
        return sub;
      }),

    grade: protectedProcedure
      .input(z.object({
        submissionId: z.number(),
        score: z.number().min(0).max(100),
        feedback: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await gradeSubmission(input.submissionId, input.score, input.feedback);
        return { success: true };
      }),

    submissions: protectedProcedure
      .input(z.object({ activityId: z.number() }))
      .query(async ({ input }) => {
        return getSubmissionsByActivity(input.activityId);
      }),

    studentSubmissions: protectedProcedure
      .input(z.object({ classroomId: z.number() }))
      .query(async ({ ctx, input }) => {
        return getStudentSubmissions(ctx.user.id, input.classroomId);
      }),

    analytics: protectedProcedure
      .input(z.object({ classroomId: z.number() }))
      .query(async ({ input }) => {
        const data = await getClassroomAnalytics(input.classroomId);
        if (!data) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Falha ao carregar analytics' });
        return data;
      }),
  }),

  // ─── Library Router (AI-Curated Academic References) ─────────────────────────────
  library: router({
    // Search existing materials in DB
    search: publicProcedure
      .input(z.object({
        query: z.string().optional().default(''),
        subject: z.string().optional(),
        year: z.number().optional(),
        type: z.string().optional(),
        language: z.string().optional(),
      }))
      .query(async ({ input }) => {
        return searchLibraryMaterials(input.query, {
          subject: input.subject,
          year: input.year,
          type: input.type,
          language: input.language,
        });
      }),

    // Get popular materials
    popular: publicProcedure.query(async () => {
      return getPopularLibraryMaterials(30);
    }),

    // Get material by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const material = await getLibraryMaterialById(input.id);
        if (!material) throw new TRPCError({ code: 'NOT_FOUND', message: 'Material não encontrado' });
        return material;
      }),

    // Toggle save/unsave material
    toggleSave: protectedProcedure
      .input(z.object({ materialId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const saved = await toggleSaveMaterial(ctx.user.id, input.materialId);
        return { saved };
      }),

    // Get user saved material IDs
    savedIds: protectedProcedure.query(async ({ ctx }) => {
      return getUserSavedMaterialIds(ctx.user.id);
    }),

    // Get user saved materials full
    savedMaterials: protectedProcedure.query(async ({ ctx }) => {
      return getUserSavedMaterialsFull(ctx.user.id);
    }),

    // AI-powered search: finds and curates academic materials from renowned sources
    aiSearch: publicProcedure
      .input(z.object({
        query: z.string().min(3),
        subject: z.string().optional(),
        year: z.number().optional(),
        specialty: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // First check if we already have cached results for this query
        const existing = await searchLibraryMaterials(input.query, {
          subject: input.subject,
          year: input.year,
        }, 10);
        if (existing.length >= 5) return { materials: existing, fromCache: true };

        // Use LLM to find and curate academic materials
        const yearContext = input.year ? `para o ${input.year}° ano de medicina` : 'para estudantes de medicina';
        const specialtyContext = input.specialty ? ` na especialidade de ${input.specialty}` : '';
        const subjectContext = input.subject ? ` sobre ${input.subject}` : '';

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `Você é um bibliotecário acadêmico especializado em medicina. Sua função é recomendar materiais acadêmicos REAIS e VALIDADOS de professores, mestres, doutores e pesquisadores renomados do Brasil e do mundo.

REGRAS IMPORTANTES:
- Recomende APENAS materiais que existem de verdade (livros publicados, artigos reais, diretrizes oficiais)
- Inclua o nome REAL do autor com sua titulação (Prof. Dr., PhD, etc.)
- Inclua a instituição real do autor (USP, Harvard, Oxford, etc.)
- Priorize fontes brasileiras (SciELO, BDTD, Portal CAPES) e internacionais (PubMed, NEJM, Lancet, BMJ)
- Inclua DOI quando possível
- Inclua o ano de publicação real
- Inclua fator de impacto quando aplicável
- Varie os tipos: livros-texto, artigos de revisão, diretrizes, atlas, videoaulas, teses
- Priorize autores renomados: professores titulares, livre-docentes, pesquisadores CNPq, membros de academias

Retorne um JSON com array de materiais acadêmicos.`
            },
            {
              role: "user",
              content: `Busque materiais acadêmicos validados sobre: "${input.query}"${subjectContext}${specialtyContext} ${yearContext}.

Retorne 8-12 materiais de alta qualidade com autores reais e renomados.`
            }
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "library_materials",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  materials: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string", description: "Título completo do material" },
                        description: { type: "string", description: "Descrição detalhada do conteúdo e relevância" },
                        type: { type: "string", description: "Tipo: livro, artigo, diretriz, atlas, videoaula, podcast, tese, revisao_sistematica, caso_clinico, guideline" },
                        subject: { type: "string", description: "Disciplina ou área" },
                        specialty: { type: "string", description: "Especialidade médica" },
                        authorName: { type: "string", description: "Nome completo do autor principal" },
                        authorTitle: { type: "string", description: "Titulação: Prof. Dr., PhD, etc." },
                        authorInstitution: { type: "string", description: "Instituição do autor" },
                        authorCountry: { type: "string", description: "País do autor" },
                        source: { type: "string", description: "Fonte: PubMed, SciELO, NEJM, Lancet, editora, etc." },
                        doi: { type: "string", description: "DOI se disponível, ou string vazia" },
                        publishedYear: { type: "integer", description: "Ano de publicação" },
                        impactFactor: { type: "string", description: "Fator de impacto se aplicável, ou string vazia" },
                        language: { type: "string", description: "Idioma: pt-BR, en, es" },
                        tags: { type: "string", description: "Tags separadas por vírgula" },
                        relevanceScore: { type: "integer", description: "Score de relevância 0-100" }
                      },
                      required: ["title", "description", "type", "subject", "specialty", "authorName", "authorTitle", "authorInstitution", "authorCountry", "source", "doi", "publishedYear", "impactFactor", "language", "tags", "relevanceScore"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["materials"],
                additionalProperties: false
              }
            }
          }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) return { materials: existing, fromCache: true };

        try {
          const parsed = JSON.parse(typeof content === 'string' ? content : '');
          const savedMaterials: any[] = [];

          // Save each material to DB
          for (const mat of parsed.materials) {
            const validTypes = ['livro', 'artigo', 'diretriz', 'atlas', 'videoaula', 'podcast', 'tese', 'revisao_sistematica', 'caso_clinico', 'guideline'];
            const materialType = validTypes.includes(mat.type) ? mat.type : 'artigo';
            
            const id = await saveLibraryMaterial({
              title: mat.title,
              description: mat.description,
              type: materialType,
              subject: mat.subject || input.subject || input.query,
              specialty: mat.specialty || null,
              year: input.year || undefined,
              authorName: mat.authorName,
              authorTitle: mat.authorTitle || null,
              authorInstitution: mat.authorInstitution || null,
              authorCountry: mat.authorCountry || 'Brasil',
              source: mat.source || null,
              doi: mat.doi || null,
              publishedYear: mat.publishedYear || null,
              impactFactor: mat.impactFactor || null,
              relevanceScore: mat.relevanceScore || 80,
              searchQuery: input.query,
              language: mat.language || 'pt-BR',
              tags: JSON.stringify(mat.tags ? mat.tags.split(',').map((t: string) => t.trim()) : []),
            });

            savedMaterials.push({
              id,
              ...mat,
              type: materialType,
              aiCurated: true,
              views: 0,
              saves: 0,
            });
          }

          return { materials: savedMaterials, fromCache: false };
        } catch (e) {
          console.error('[Library AI Search] Parse error:', e);
          return { materials: existing, fromCache: true };
        }
      }),

    // ─── PubMed/SciELO Real Search ─────────────────────────────
    pubmedSearch: publicProcedure
      .input(z.object({
        query: z.string().min(2),
        source: z.enum(['pubmed', 'scielo']).optional().default('pubmed'),
        maxResults: z.number().optional().default(10),
      }))
      .mutation(async ({ input }) => {
        // Check cache first
        const cached = await searchPubmedCache(input.query, input.source, input.maxResults);
        if (cached.length >= 3) return { articles: cached, fromCache: true };

        try {
          if (input.source === 'pubmed') {
            // Real PubMed E-utilities API
            const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(input.query + ' medicine')}&retmax=${input.maxResults}&retmode=json&sort=relevance`;
            const searchRes = await fetch(searchUrl);
            const searchData = await searchRes.json() as any;
            const pmids = searchData?.esearchresult?.idlist || [];
            if (pmids.length === 0) return { articles: cached, fromCache: true };

            // Fetch summaries
            const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=json`;
            const summaryRes = await fetch(summaryUrl);
            const summaryData = await summaryRes.json() as any;

            // Fetch abstracts
            const abstractUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmids.join(',')}&rettype=abstract&retmode=text`;
            const abstractRes = await fetch(abstractUrl);
            const abstractText = await abstractRes.text();
            const abstracts = abstractText.split(/\n\n\d+\. /).filter(Boolean);

            const articles: any[] = [];
            for (let i = 0; i < pmids.length; i++) {
              const pmid = pmids[i];
              const summary = summaryData?.result?.[pmid];
              if (!summary) continue;

              const authors = (summary.authors || []).map((a: any) => a.name);
              const article = {
                pmid,
                title: summary.title || '',
                authors: JSON.stringify(authors),
                journal: summary.source || summary.fulljournalname || '',
                pubDate: summary.pubdate || '',
                doi: (summary.elocationid || '').replace('doi: ', ''),
                abstractText: abstracts[i] || '',
                source: 'pubmed' as const,
                searchQuery: input.query,
                keywords: JSON.stringify(summary.keywords || []),
                language: (summary.lang || ['en'])[0] || 'en',
                isOpenAccess: false,
              };
              await savePubmedArticle(article);
              articles.push({ ...article, id: i, authors: JSON.parse(article.authors), keywords: JSON.parse(article.keywords || '[]') });
            }
            return { articles, fromCache: false };
          } else {
            // SciELO search
            const scieloUrl = `https://search.scielo.org/?q=${encodeURIComponent(input.query)}&lang=pt&count=${input.maxResults}&output=json&from=0`;
            const scieloRes = await fetch(scieloUrl);
            const text = await scieloRes.text();
            // SciELO may not return proper JSON, use LLM to extract
            const llmResponse = await invokeLLM({
              messages: [
                { role: 'system', content: 'Extract article data from this SciELO search response. Return JSON array of articles with: pmid (use PID), title, authors (array), journal, pubDate, doi, abstractText, language.' },
                { role: 'user', content: `Extract articles from: ${text.substring(0, 4000)}` }
              ],
            });
            const content = llmResponse.choices[0]?.message?.content;
            if (!content) return { articles: cached, fromCache: true };
            try {
              const parsed = JSON.parse(typeof content === 'string' ? content : '');
              const scieloArticles = Array.isArray(parsed) ? parsed : parsed.articles || [];
              for (const art of scieloArticles) {
                await savePubmedArticle({
                  pmid: art.pmid || `scielo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                  title: art.title || '',
                  authors: JSON.stringify(art.authors || []),
                  journal: art.journal || '',
                  pubDate: art.pubDate || '',
                  doi: art.doi || '',
                  abstractText: art.abstractText || '',
                  source: 'scielo',
                  searchQuery: input.query,
                  language: art.language || 'pt',
                });
              }
              return { articles: scieloArticles, fromCache: false };
            } catch { return { articles: cached, fromCache: true }; }
          }
        } catch (err) {
          console.error('[PubMed/SciELO] Search error:', err);
          return { articles: cached, fromCache: true };
        }
      }),

    // Get PubMed article by PMID
    getArticle: publicProcedure
      .input(z.object({ pmid: z.string() }))
      .query(async ({ input }) => {
        return getPubmedArticleByPmid(input.pmid);
      }),

    // ─── Material Reviews ─────────────────────────────
    addReview: protectedProcedure
      .input(z.object({
        materialId: z.number(),
        rating: z.number().min(1).max(5),
        comment: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const id = await addMaterialReview(input.materialId, ctx.user.id, input.rating, input.comment);
        // Track study activity
        await trackStudyActivity(ctx.user.id, {
          itemType: 'material',
          itemId: input.materialId.toString(),
          itemTitle: `Review for material #${input.materialId}`,
          score: input.rating * 20, // Convert 1-5 to 0-100
        });
        return { id };
      }),

    getReviews: publicProcedure
      .input(z.object({ materialId: z.number() }))
      .query(async ({ input }) => {
        return getMaterialReviews(input.materialId);
      }),

    markHelpful: protectedProcedure
      .input(z.object({ reviewId: z.number() }))
      .mutation(async ({ input }) => {
        await markReviewHelpful(input.reviewId);
        return { success: true };
      }),

    // ─── Study History & Tracking ─────────────────────────────
    trackActivity: protectedProcedure
      .input(z.object({
        itemType: z.enum(['material', 'article', 'quiz', 'flashcard', 'subject']),
        itemId: z.string(),
        itemTitle: z.string(),
        subject: z.string().optional(),
        score: z.number().optional(),
        timeSpentMinutes: z.number().optional(),
        completed: z.boolean().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await trackStudyActivity(ctx.user.id, input);
        return { success: true };
      }),

    studyHistory: protectedProcedure
      .input(z.object({ limit: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return getUserStudyHistoryData(ctx.user.id, input?.limit || 50);
      }),

    // ─── AI-Powered Recommendations ─────────────────────────────
    getRecommendations: protectedProcedure
      .input(z.object({
        limit: z.number().optional().default(10),
      }))
      .mutation(async ({ ctx, input }) => {
        // Get user's study profile
        const topSubjects = await getUserTopSubjects(ctx.user.id);
        const quizPerf = await getUserQuizPerformance(ctx.user.id);
        const recentHistory = await getUserStudyHistoryData(ctx.user.id, 30);
        const user = ctx.user;

        const subjectsList = topSubjects.map(s => `${s.subject} (${s.count}x)`).join(', ');
        const recentTitles = recentHistory.slice(0, 10).map(h => h.itemTitle).join(', ');
        const yearContext = user.currentYear ? `${user.currentYear}° ano` : '';
        const universityContext = user.universityId || '';

        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um sistema de recomendação acadêmica para estudantes de medicina. Com base no perfil do aluno, recomende materiais acadêmicos personalizados de professores e pesquisadores renomados.

REGRAS:
- Recomende materiais REAIS de autores reais
- Adapte ao nível do aluno (ano, desempenho)
- Diversifique tipos (livros, artigos, videoaulas, diretrizes)
- Priorize áreas onde o aluno tem mais dificuldade (scores baixos)
- Inclua materiais complementares para áreas de interesse
- Inclua fontes brasileiras e internacionais`
            },
            {
              role: 'user',
              content: `Perfil do aluno:
- Ano: ${yearContext || 'não informado'}
- Universidade: ${universityContext || 'não informada'}
- Disciplinas mais estudadas: ${subjectsList || 'nenhuma ainda'}
- Desempenho em quizzes: média ${quizPerf.avgScore}% em ${quizPerf.totalQuizzes} quizzes
- Materiais recentes: ${recentTitles || 'nenhum'}

Recomende ${input.limit} materiais acadêmicos personalizados.`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'recommendations',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  recommendations: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        type: { type: 'string' },
                        subject: { type: 'string' },
                        authorName: { type: 'string' },
                        authorTitle: { type: 'string' },
                        authorInstitution: { type: 'string' },
                        source: { type: 'string' },
                        reason: { type: 'string', description: 'Por que este material é recomendado para este aluno' },
                        difficulty: { type: 'string', description: 'básico, intermediário ou avançado' },
                        relevanceScore: { type: 'integer' },
                      },
                      required: ['title', 'description', 'type', 'subject', 'authorName', 'authorTitle', 'authorInstitution', 'source', 'reason', 'difficulty', 'relevanceScore'],
                      additionalProperties: false,
                    }
                  },
                  insights: {
                    type: 'object',
                    properties: {
                      strengths: { type: 'array', items: { type: 'string' } },
                      areasToImprove: { type: 'array', items: { type: 'string' } },
                      studyTip: { type: 'string' },
                    },
                    required: ['strengths', 'areasToImprove', 'studyTip'],
                    additionalProperties: false,
                  }
                },
                required: ['recommendations', 'insights'],
                additionalProperties: false,
              }
            }
          }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) return { recommendations: [], insights: { strengths: [], areasToImprove: [], studyTip: '' } };
        try {
          return JSON.parse(typeof content === 'string' ? content : '');
        } catch {
          return { recommendations: [], insights: { strengths: [], areasToImprove: [], studyTip: '' } };
        }
      }),

    // ─── Advanced PubMed Search with Filters ─────────────────────────────
    pubmedAdvancedSearch: publicProcedure
      .input(z.object({
        query: z.string().min(2),
        source: z.enum(['pubmed', 'scielo']).optional().default('pubmed'),
        maxResults: z.number().optional().default(10),
        dateFrom: z.string().optional(), // YYYY format
        dateTo: z.string().optional(), // YYYY format
        studyType: z.enum(['clinical_trial', 'meta_analysis', 'review', 'systematic_review', 'randomized_controlled_trial', 'case_report', 'guideline', 'all']).optional().default('all'),
        language: z.enum(['en', 'pt', 'es', 'fr', 'de', 'all']).optional().default('all'),
      }))
      .mutation(async ({ input }) => {
        // Build PubMed query with filters
        let queryParts = [input.query + ' medicine'];
        
        // Date filter
        if (input.dateFrom || input.dateTo) {
          const from = input.dateFrom || '1900';
          const to = input.dateTo || '2030';
          queryParts.push(`("${from}"[pdat]:"${to}"[pdat])`);
        }
        
        // Study type filter for PubMed
        const studyTypeMap: Record<string, string> = {
          clinical_trial: 'Clinical Trial[pt]',
          meta_analysis: 'Meta-Analysis[pt]',
          review: 'Review[pt]',
          systematic_review: 'Systematic Review[pt]',
          randomized_controlled_trial: 'Randomized Controlled Trial[pt]',
          case_report: 'Case Reports[pt]',
          guideline: 'Guideline[pt]',
        };
        if (input.studyType && input.studyType !== 'all' && studyTypeMap[input.studyType]) {
          queryParts.push(studyTypeMap[input.studyType]);
        }
        
        // Language filter
        const langMap: Record<string, string> = {
          en: 'English[la]', pt: 'Portuguese[la]', es: 'Spanish[la]', fr: 'French[la]', de: 'German[la]',
        };
        if (input.language && input.language !== 'all' && langMap[input.language]) {
          queryParts.push(langMap[input.language]);
        }
        
        const fullQuery = queryParts.join(' AND ');
        
        // Check cache first
        const cached = await searchPubmedCache(input.query, input.source, input.maxResults);
        
        try {
          if (input.source === 'pubmed') {
            const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(fullQuery)}&retmax=${input.maxResults}&retmode=json&sort=relevance`;
            const searchRes = await fetch(searchUrl);
            const searchData = await searchRes.json() as any;
            const pmids = searchData?.esearchresult?.idlist || [];
            if (pmids.length === 0) return { articles: cached, fromCache: true, totalResults: parseInt(searchData?.esearchresult?.count || '0'), appliedFilters: { query: fullQuery } };
            
            const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmids.join(',')}&retmode=json`;
            const summaryRes = await fetch(summaryUrl);
            const summaryData = await summaryRes.json() as any;
            
            const abstractUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmids.join(',')}&rettype=abstract&retmode=text`;
            const abstractRes = await fetch(abstractUrl);
            const abstractText = await abstractRes.text();
            const abstracts = abstractText.split(/\n\n\d+\. /).filter(Boolean);
            
            const articles: any[] = [];
            for (let i = 0; i < pmids.length; i++) {
              const pmid = pmids[i];
              const summary = summaryData?.result?.[pmid];
              if (!summary) continue;
              const authors = (summary.authors || []).map((a: any) => a.name);
              const article = {
                pmid,
                title: summary.title || '',
                authors: JSON.stringify(authors),
                journal: summary.source || summary.fulljournalname || '',
                pubDate: summary.pubdate || '',
                doi: (summary.elocationid || '').replace('doi: ', ''),
                abstractText: abstracts[i] || '',
                source: 'pubmed' as const,
                searchQuery: input.query,
                keywords: JSON.stringify(summary.keywords || []),
                language: (summary.lang || ['en'])[0] || 'en',
                isOpenAccess: false,
                pubType: summary.pubtype || [],
              };
              await savePubmedArticle(article);
              articles.push({ ...article, id: i, authors: JSON.parse(article.authors), keywords: JSON.parse(article.keywords || '[]') });
            }
            return { articles, fromCache: false, totalResults: parseInt(searchData?.esearchresult?.count || '0'), appliedFilters: { query: fullQuery } };
          } else {
            // SciELO search with filters
            let scieloLang = '';
            if (input.language && input.language !== 'all') scieloLang = `&lang=${input.language}`;
            const scieloUrl = `https://search.scielo.org/?q=${encodeURIComponent(input.query)}&lang=pt&count=${input.maxResults}&output=json&from=0${scieloLang}`;
            const scieloRes = await fetch(scieloUrl);
            const text = await scieloRes.text();
            const llmResponse = await invokeLLM({
              messages: [
                { role: 'system', content: 'Extract article data from this SciELO search response. Return JSON array of articles with: pmid (use PID), title, authors (array), journal, pubDate, doi, abstractText, language, pubType (array of types like Review, Clinical Trial, etc).' },
                { role: 'user', content: `Extract articles from: ${text.substring(0, 4000)}` }
              ],
            });
            const content = llmResponse.choices[0]?.message?.content;
            if (!content) return { articles: cached, fromCache: true, totalResults: 0, appliedFilters: { query: input.query } };
            try {
              const parsed = JSON.parse(typeof content === 'string' ? content : '');
              const scieloArticles = Array.isArray(parsed) ? parsed : parsed.articles || [];
              for (const art of scieloArticles) {
                await savePubmedArticle({
                  pmid: art.pmid || `scielo-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                  title: art.title || '',
                  authors: JSON.stringify(art.authors || []),
                  journal: art.journal || '',
                  pubDate: art.pubDate || '',
                  doi: art.doi || '',
                  abstractText: art.abstractText || '',
                  source: 'scielo',
                  searchQuery: input.query,
                  language: art.language || 'pt',
                });
              }
              return { articles: scieloArticles, fromCache: false, totalResults: scieloArticles.length, appliedFilters: { query: input.query } };
            } catch { return { articles: cached, fromCache: true, totalResults: 0, appliedFilters: { query: input.query } }; }
          }
        } catch (err) {
          console.error('[PubMed Advanced] Search error:', err);
          return { articles: cached, fromCache: true, totalResults: 0, appliedFilters: { query: input.query } };
        }
      }),

    // ─── Subject Subscriptions & Notifications ─────────────────────────────
    subscribe: protectedProcedure
      .input(z.object({ subject: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const result = await subscribeToSubject(ctx.user.id, input.subject);
        return { success: result, message: result ? 'Inscrito com sucesso' : 'Já inscrito nesta disciplina' };
      }),

    unsubscribe: protectedProcedure
      .input(z.object({ subject: z.string() }))
      .mutation(async ({ ctx, input }) => {
        await unsubscribeFromSubject(ctx.user.id, input.subject);
        return { success: true };
      }),

    getSubscriptions: protectedProcedure
      .query(async ({ ctx }) => {
        return getUserSubscriptions(ctx.user.id);
      }),

    getNotifications: protectedProcedure
      .query(async ({ ctx }) => {
        const notifications = await getUserNotifications(ctx.user.id);
        const unreadCount = await getUnreadNotificationCount(ctx.user.id);
        return { notifications, unreadCount };
      }),

    markNotificationRead: protectedProcedure
      .input(z.object({ notificationId: z.number() }))
      .mutation(async ({ input }) => {
        await markNotificationRead(input.notificationId);
        return { success: true };
      }),

    markAllRead: protectedProcedure
      .mutation(async ({ ctx }) => {
        await markAllNotificationsRead(ctx.user.id);
        return { success: true };
      }),

    // ─── Study Templates (AI-Generated, Copyright-Safe) ─────────────────────────────
    generateTemplate: protectedProcedure
      .input(z.object({
        templateType: z.enum([
          'anamnese', 'exame_fisico', 'diagnostico_diferencial', 'prescricao',
          'roteiro_revisao', 'mapa_mental', 'checklist_estudo', 'guia_completo',
          'resumo_estruturado', 'caso_clinico_modelo'
        ]),
        subject: z.string(),
        specialty: z.string().optional(),
        year: z.number().optional(),
        difficulty: z.enum(['basico', 'intermediario', 'avancado']).optional().default('intermediario'),
        customPrompt: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const templateDescriptions: Record<string, string> = {
          anamnese: 'modelo completo de anamnese médica com roteiro estruturado',
          exame_fisico: 'roteiro detalhado de exame físico por sistemas',
          diagnostico_diferencial: 'guia de diagnóstico diferencial com fluxograma de raciocínio clínico',
          prescricao: 'modelo de prescrição médica com posologia e orientações',
          roteiro_revisao: 'roteiro de revisão completo com cronograma e tópicos-chave',
          mapa_mental: 'mapa mental textual com hierarquia de conceitos e conexões',
          checklist_estudo: 'checklist de estudo completo com todos os tópicos essenciais',
          guia_completo: 'guia de estudo completo e aprofundado com referências abertas',
          resumo_estruturado: 'resumo acadêmico estruturado com seções e pontos-chave',
          caso_clinico_modelo: 'caso clínico fictício para estudo com perguntas e resolução',
        };

        const difficultyMap: Record<string, string> = {
          basico: 'nível básico, linguagem acessível, conceitos fundamentais',
          intermediario: 'nível intermediário, termos técnicos com explicações',
          avancado: 'nível avançado, linguagem técnica completa, detalhes aprofundados',
        };

        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um professor de medicina brasileiro com vasta experiência acadêmica. Gere um ${templateDescriptions[input.templateType] || 'material de estudo'} sobre o tema solicitado.

REGRAS IMPORTANTES:
- TODO o conteúdo deve ser ORIGINAL, criado por você
- NÃO copie trechos de livros ou artigos protegidos por direitos autorais
- Use referências de acesso aberto (PubMed, SciELO, diretrizes do SUS/MS)
- Cite fontes reais mas reformule o conteúdo com suas próprias palavras
- Inclua referências bibliográficas no final (formato Vancouver)
- Nível: ${difficultyMap[input.difficulty || 'intermediario']}
- Use markdown para formatação rica
- Inclua tabelas, listas e seções bem organizadas
- Adicione dicas clínicas práticas quando relevante
- Para casos clínicos, use dados fictícios mas realistas
${input.customPrompt ? `\nInstrução adicional do aluno: ${input.customPrompt}` : ''}`
            },
            {
              role: 'user',
              content: `Gere um ${templateDescriptions[input.templateType] || 'material'} sobre: ${input.subject}${input.specialty ? ` (especialidade: ${input.specialty})` : ''}${input.year ? ` para ${input.year}° ano de medicina` : ''}.`
            }
          ],
        });

        const rawContent = response.choices[0]?.message?.content;
        const content = typeof rawContent === 'string' ? rawContent : 'Conteúdo indisponível.';
        const title = `${templateDescriptions[input.templateType]?.split(' ').slice(0, 4).join(' ') || input.templateType} — ${input.subject}`;

        // Save to DB
        const template = await saveStudyTemplate({
          userId: ctx.user.id,
          templateType: input.templateType,
          subject: input.subject,
          title,
          content,
          specialty: input.specialty,
          year: input.year,
          difficulty: input.difficulty,
          tags: JSON.stringify([input.subject, input.templateType, input.specialty].filter(Boolean)),
          isPublic: true,
        });

        return { template, content };
      }),

    getTemplates: publicProcedure
      .input(z.object({
        subject: z.string().optional(),
        templateType: z.string().optional(),
        year: z.number().optional(),
        difficulty: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return getStudyTemplates(input || undefined);
      }),

    getTemplate: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getStudyTemplateById(input.id);
      }),

    myTemplates: protectedProcedure
      .query(async ({ ctx }) => {
        return getUserTemplates(ctx.user.id);
      }),

    // AI-powered deep dive: generates detailed study content for a specific material
    aiDeepDive: publicProcedure
      .input(z.object({
        materialId: z.number().optional(),
        title: z.string(),
        subject: z.string(),
        authorName: z.string(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: `Você é um professor de medicina brasileiro com vasta experiência acadêmica. Gere um resumo acadêmico detalhado e aprofundado sobre o material solicitado. Use linguagem técnica mas acessível. Inclua:
- Contexto e importância do tema
- Conceitos fundamentais
- Aplicações clínicas
- Pontos-chave para estudo
- Questões para reflexão
- Referências complementares reais

Use markdown para formatação.`
            },
            {
              role: "user",
              content: `Gere um resumo acadêmico aprofundado sobre: "${input.title}" de ${input.authorName}, na área de ${input.subject}. Inclua os conceitos mais importantes, aplicações clínicas e referências complementares.`
            }
          ],
        });
        const content = response.choices[0]?.message?.content;
        return { content: content || 'Conteúdo indisponível.' };
      }),
  }),

  // ─── Shared Templates Router ──────────────────────────────────
  sharing: router({
    shareTemplate: protectedProcedure.input(z.object({ templateId: z.number(), subject: z.string(), university: z.string().optional(), year: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        const result = await shareTemplate(input.templateId, ctx.user.id, input.subject, input.university, input.year);
        if (!result) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao compartilhar template' });
        return result;
      }),
    getByCode: publicProcedure.input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        return await getSharedTemplateByCode(input.code);
      }),
    feed: publicProcedure.input(z.object({ subject: z.string().optional(), university: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await getSharedTemplateFeed(input?.subject, input?.university);
      }),
    like: protectedProcedure.input(z.object({ shareId: z.number() }))
      .mutation(async ({ input }) => {
        await likeSharedTemplate(input.shareId);
        return { success: true };
      }),
  }),

  // ─── Study Rooms Router ─────────────────────────────────────
  studyRoom: router({
    create: protectedProcedure.input(z.object({ name: z.string(), subject: z.string(), university: z.string().optional(), year: z.number().optional(), description: z.string().optional(), maxParticipants: z.number().optional(), isPublic: z.boolean().optional() }))
      .mutation(async ({ ctx, input }) => {
        const result = await createStudyRoom({ ...input, createdByUserId: ctx.user.id });
        if (!result) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao criar sala' });
        return result;
      }),
    list: publicProcedure.query(async () => {
      return await getStudyRooms();
    }),
    getById: protectedProcedure.input(z.object({ roomId: z.number() }))
      .query(async ({ input }) => {
        return await getStudyRoomById(input.roomId);
      }),
    join: protectedProcedure.input(z.object({ roomId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await joinStudyRoom(input.roomId, ctx.user.id);
      }),
    sendMessage: protectedProcedure.input(z.object({ roomId: z.number(), content: z.string(), messageType: z.enum(['text', 'note', 'link', 'file']).optional() }))
      .mutation(async ({ ctx, input }) => {
        const id = await sendRoomMessage(input.roomId, ctx.user.id, ctx.user.name || 'Anônimo', input.content, input.messageType || 'text');
        return { id };
      }),
    getMessages: protectedProcedure.input(z.object({ roomId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await getRoomMessages(input.roomId, input.limit);
      }),
    createNote: protectedProcedure.input(z.object({ roomId: z.number(), title: z.string(), content: z.string(), subject: z.string().optional() }))
      .mutation(async ({ ctx, input }) => {
        const id = await createSharedNote(input.roomId, ctx.user.id, ctx.user.name || 'Anônimo', input.title, input.content, input.subject);
        return { id };
      }),
    getNotes: protectedProcedure.input(z.object({ roomId: z.number() }))
      .query(async ({ input }) => {
        return await getRoomNotes(input.roomId);
      }),
  }),

  // ─── Calendar Router ───────────────────────────────────────
  calendar: router({
    createEvent: protectedProcedure.input(z.object({
      title: z.string(), eventType: z.enum(['prova', 'trabalho', 'seminario', 'pratica', 'revisao', 'simulado', 'outro']),
      subject: z.string(), eventDate: z.string(), description: z.string().optional(),
      university: z.string().optional(), year: z.number().optional(), reminderDays: z.number().optional(),
      linkedMaterialIds: z.string().optional()
    })).mutation(async ({ ctx, input }) => {
      const eventDate = new Date(input.eventDate);
      const id = await createCalendarEvent({ ...input, userId: ctx.user.id, eventDate });
      if (!id) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao criar evento' });
      // Auto-generate revision suggestions for exams
      if (input.eventType === 'prova' || input.eventType === 'simulado') {
        await createRevisionSuggestions(ctx.user.id, id, input.subject, eventDate, input.reminderDays || 3);
      }
      return { id };
    }),
    getEvents: protectedProcedure.input(z.object({ month: z.number().optional(), year: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        return await getCalendarEvents(ctx.user.id, input?.month, input?.year);
      }),
    updateEvent: protectedProcedure.input(z.object({ eventId: z.number(), title: z.string().optional(), description: z.string().optional(), eventDate: z.string().optional(), isCompleted: z.boolean().optional(), reminderDays: z.number().optional() }))
      .mutation(async ({ ctx, input }) => {
        const { eventId, eventDate, ...rest } = input;
        const data: any = { ...rest };
        if (eventDate) data.eventDate = new Date(eventDate);
        await updateCalendarEvent(eventId, ctx.user.id, data);
        return { success: true };
      }),
    deleteEvent: protectedProcedure.input(z.object({ eventId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await deleteCalendarEvent(input.eventId, ctx.user.id);
        return { success: true };
      }),
    getRevisions: protectedProcedure.query(async ({ ctx }) => {
      return await getRevisionSuggestions(ctx.user.id);
    }),
    completeRevision: protectedProcedure.input(z.object({ revisionId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await completeRevision(input.revisionId, ctx.user.id);
        return { success: true };
      }),
  }),

  // ─── Simulados ENAMED/REVALIDA Router ───────────────────────
  simulado: router({
    create: protectedProcedure.input(z.object({
      title: z.string(), examType: z.enum(['enamed', 'revalida', 'residencia', 'custom']),
      totalQuestions: z.number(), timeLimit: z.number(), areas: z.array(z.string())
    })).mutation(async ({ ctx, input }) => {
      const id = await createSimulado({ ...input, userId: ctx.user.id, areas: JSON.stringify(input.areas) });
      if (!id) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Erro ao criar simulado' });
      return { id };
    }),
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getSimulados(ctx.user.id);
    }),
    complete: protectedProcedure.input(z.object({
      simuladoId: z.number(), score: z.number(), correctAnswers: z.number(),
      timeSpent: z.number(), results: z.string()
    })).mutation(async ({ ctx, input }) => {
      await completeSimulado(input.simuladoId, ctx.user.id, input.score, input.correctAnswers, input.timeSpent, input.results);
      return { success: true };
    }),
    getQuestions: protectedProcedure.input(z.object({
      area: z.string().optional(), examType: z.string().optional(),
      difficulty: z.string().optional(), limit: z.number().optional()
    }).optional()).query(async ({ input }) => {
      return await getSimuladoQuestions(input?.area, input?.examType, input?.difficulty, input?.limit);
    }),
    generateQuestions: protectedProcedure.input(z.object({
      area: z.string(), examType: z.enum(['enamed', 'revalida', 'residencia']),
      count: z.number().min(1).max(10).default(5), difficulty: z.enum(['facil', 'medio', 'dificil']).default('medio')
    })).mutation(async ({ input }) => {
      const response = await invokeLLM({
        messages: [
          { role: 'system', content: `Você é um especialista em questões de provas médicas brasileiras (ENAMED, REVALIDA, Residência). Gere questões no formato JSON. Cada questão deve ter: question (enunciado clínico detalhado), options (5 alternativas A-E), correctIndex (0-4), explanation (explicação detalhada com referências). Dificuldade: ${input.difficulty}. Tipo de prova: ${input.examType}. Área: ${input.area}. Gere ${input.count} questões. Responda APENAS com JSON válido no formato: { "questions": [...] }` },
          { role: 'user', content: `Gere ${input.count} questões de ${input.area} para ${input.examType}, dificuldade ${input.difficulty}.` }
        ],
        response_format: { type: 'json_schema', json_schema: { name: 'simulado_questions', strict: true, schema: {
          type: 'object', properties: { questions: { type: 'array', items: { type: 'object', properties: {
            question: { type: 'string' }, options: { type: 'array', items: { type: 'string' } },
            correctIndex: { type: 'integer' }, explanation: { type: 'string' }
          }, required: ['question', 'options', 'correctIndex', 'explanation'], additionalProperties: false } } },
          required: ['questions'], additionalProperties: false
        } } }
      });
      const parsed = JSON.parse(typeof response.choices[0]?.message?.content === 'string' ? response.choices[0].message.content : '{}');
      const saved = [];
      for (const q of (parsed.questions || [])) {
        const id = await saveSimuladoQuestion({ area: input.area, examType: input.examType, difficulty: input.difficulty, question: q.question, options: JSON.stringify(q.options), correctIndex: q.correctIndex, explanation: q.explanation });
        saved.push({ id, ...q });
      }
      return saved;
    }),
    stats: protectedProcedure.query(async ({ ctx }) => {
      return await getSimuladoStats(ctx.user.id);
    }),
  }),

  // ─── Weekly Goals ─────────────────────────────────────────────
  goals: router({
    list: protectedProcedure.input(z.object({ weekStart: z.string() })).query(async ({ ctx, input }) => {
      return await getWeeklyGoals(ctx.user.id, input.weekStart);
    }),
    create: protectedProcedure.input(z.object({
      weekStart: z.string(),
      goalType: z.enum(['questions', 'pomodoro_hours', 'study_hours', 'flashcards', 'simulados']),
      targetValue: z.number().min(1),
    })).mutation(async ({ ctx, input }) => {
      return await createWeeklyGoal({ userId: ctx.user.id, ...input });
    }),
    updateProgress: protectedProcedure.input(z.object({
      goalId: z.number(),
      currentValue: z.number(),
    })).mutation(async ({ ctx, input }) => {
      await updateGoalProgress(input.goalId, input.currentValue);
      return { success: true };
    }),
    increment: protectedProcedure.input(z.object({
      weekStart: z.string(),
      goalType: z.string(),
      increment: z.number(),
    })).mutation(async ({ ctx, input }) => {
      await incrementGoalProgress(ctx.user.id, input.weekStart, input.goalType, input.increment);
      return { success: true };
    }),
    delete: protectedProcedure.input(z.object({ goalId: z.number() })).mutation(async ({ ctx, input }) => {
      await deleteWeeklyGoal(input.goalId, ctx.user.id);
      return { success: true };
    }),
  }),

  // ─── XP & Leaderboard ──────────────────────────────────────────
  xp: router({
    me: protectedProcedure.query(async ({ ctx }) => {
      const user = ctx.user;
      const xp = await ensureUserXP(user.id, (user as any).universityId);
      await updateStreak(user.id);
      return xp;
    }),
    addXP: protectedProcedure.input(z.object({
      amount: z.number().min(1),
      activityType: z.enum([
        'simulado_completed', 'question_correct', 'question_wrong',
        'pomodoro_completed', 'flashcard_reviewed', 'streak_bonus',
        'goal_completed', 'daily_login', 'material_reviewed'
      ]),
      description: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      await ensureUserXP(ctx.user.id);
      await addXP(ctx.user.id, input.amount, input.activityType, input.description);
      return { success: true };
    }),
    updateStats: protectedProcedure.input(z.object({
      field: z.enum(['simuladosCompleted', 'questionsAnswered', 'correctAnswers', 'pomodoroMinutes', 'flashcardsReviewed']),
      increment: z.number(),
    })).mutation(async ({ ctx, input }) => {
      await ensureUserXP(ctx.user.id);
      await updateXPStats(ctx.user.id, input.field, input.increment);
      return { success: true };
    }),
    leaderboard: protectedProcedure.input(z.object({
      period: z.enum(['weekly', 'monthly', 'alltime']),
      universityId: z.string().optional(),
    })).query(async ({ ctx, input }) => {
      return await getLeaderboard(input.period, input.universityId);
    }),
    activities: protectedProcedure.input(z.object({ limit: z.number().optional() })).query(async ({ ctx, input }) => {
      return await getXPActivities(ctx.user.id, input.limit || 20);
    }),
  }),

  // ─── Clinical Cases (Casos Clínicos Interativos) ────────────
  clinicalCase: router({
    start: protectedProcedure.input(z.object({
      specialty: z.string(),
      difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
    })).mutation(async ({ ctx, input }) => {
      const specialtyRefs: Record<string, { books: string; prompt: string }> = {
        'Clínica Médica': { books: 'Harrison\'s Principles of Internal Medicine (21st ed.), Cecil Medicine (Goldman-Cecil, 27th ed.), Current Medical Diagnosis & Treatment (CMDT 2025)', prompt: 'caso de clínica médica' },
        'Cirurgia': { books: 'Sabiston Textbook of Surgery (21st ed.), Schwartz\'s Principles of Surgery (11th ed.), Townsend: Sabiston Textbook of Surgery', prompt: 'caso cirúrgico' },
        'Pediatria': { books: 'Nelson Textbook of Pediatrics (22nd ed.), Tratado de Pediatria da SBP (5ª ed.), Rudolph\'s Pediatrics (23rd ed.)', prompt: 'caso pediátrico' },
        'Ginecologia e Obstetrícia': { books: 'Williams Obstetrics (26th ed.), Berek & Novak\'s Gynecology (16th ed.), Rezende Obstetrícia Fundamental (14ª ed.)', prompt: 'caso de ginecologia/obstetrícia' },
        'Saúde Coletiva': { books: 'Epidemiologia (Medronho, 2ª ed.), Rouquayrol - Epidemiologia & Saúde (8ª ed.), Park\'s Textbook of Preventive Medicine (26th ed.)', prompt: 'caso de saúde pública/coletiva' },
        'Medicina de Família': { books: 'Tratado de Medicina de Família e Comunidade (Duncan, 2ª ed.), McWhinney\'s Textbook of Family Medicine (4th ed.), Medicina Ambulatorial (Bruce Duncan)', prompt: 'caso de atenção primária' },
        'Psiquiatria': { books: 'Kaplan & Sadock\'s Synopsis of Psychiatry (12th ed.), Stahl\'s Essential Psychopharmacology (5th ed.), Compêndio de Psiquiatria (Kaplan)', prompt: 'caso psiquiátrico' },
        'Ortopedia': { books: 'Campbell\'s Operative Orthopaedics (14th ed.), Rockwood & Green\'s Fractures in Adults (9th ed.), Hoppenfeld - Physical Examination of the Spine and Extremities', prompt: 'caso ortopédico' },
      };
      const refData = specialtyRefs[input.specialty] || { books: 'Harrison\'s, Cecil Medicine, CMDT', prompt: `caso clínico de ${input.specialty}` };
      const difficulty = input.difficulty || 'medium';
      const diffLabel = difficulty === 'easy' ? 'simples e direto' : difficulty === 'hard' ? 'complexo com diagnóstico diferencial desafiador' : 'moderado';

      const llmResponse = await invokeLLM({
        messages: [
          { role: 'system', content: `Você é um professor de medicina experiente, baseando-se nos melhores livros do mundo: ${refData.books}. Crie um ${refData.prompt} para um estudante praticar raciocínio clínico. O caso deve ser ${diffLabel}. IMPORTANTE: inclua referências bibliográficas reais em cada seção e perguntas de múltipla escolha para cada fase. Responda APENAS em JSON válido.` },
          { role: 'user', content: `Gere um caso clínico COMPLETO e VISUAL com os seguintes campos JSON:\n{\n  "title": "Título curto do caso",\n  "patientInfo": { "age": number, "sex": "M" ou "F", "chiefComplaint": "queixa principal", "history": "história da doença atual detalhada", "pastHistory": "antecedentes pessoais", "medications": ["med1", "med2"], "socialHistory": "história social", "familyHistory": "história familiar", "vitalSigns": { "PA": "...", "FC": "...", "FR": "...", "Temp": "...", "SpO2": "...", "Peso": "...", "Altura": "...", "IMC": "..." } },\n  "physicalExam": { "general": "estado geral", "cardiovascular": "...", "respiratory": "...", "abdominal": "...", "neurological": "...", "other": "outros achados relevantes" },\n  "labResults": { "hemograma": "...", "bioquimica": "...", "imagem": "descrição de exames de imagem", "outros": "outros exames" },\n  "correctDiagnosis": "diagnóstico correto",\n  "keyFindings": ["achado1", "achado2", "achado3"],\n  "differentialDiagnoses": ["dd1", "dd2", "dd3"],\n  "recommendedTests": ["exame1", "exame2"],\n  "treatment": "conduta recomendada detalhada",\n  "references": [\n    { "book": "Nome do livro", "edition": "edição", "chapter": "capítulo relevante", "page": "páginas", "keyPoint": "ponto-chave da referência" }\n  ],\n  "phaseQuestions": {\n    "anamnesis": [{ "question": "Qual pergunta é mais importante na anamnese deste paciente?", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 0, "explanation": "Explicação com referência bibliográfica" }],\n    "physical_exam": [{ "question": "Qual achado do exame físico é mais relevante?", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 0, "explanation": "..." }],\n    "lab_tests": [{ "question": "Qual exame complementar é prioritário?", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 0, "explanation": "..." }],\n    "hypothesis": [{ "question": "Qual é o diagnóstico mais provável?", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 0, "explanation": "..." }],\n    "treatment": [{ "question": "Qual a conduta mais adequada?", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "correct": 0, "explanation": "..." }]\n  }\n}` },
        ],
        response_format: { type: 'json_object' },
      });

      const content = typeof llmResponse.choices[0]?.message?.content === 'string'
        ? llmResponse.choices[0].message.content : '';
      let caseData;
      try { caseData = JSON.parse(content); } catch { caseData = { title: 'Caso Clínico', patientInfo: { age: 45, sex: 'M', chiefComplaint: 'Dor torácica', vitalSigns: {} }, correctDiagnosis: 'A definir', keyFindings: [], differentialDiagnoses: [], recommendedTests: [], treatment: '' }; }

      const caseId = await createClinicalCase(ctx.user.id, {
        specialty: input.specialty,
        title: caseData.title || 'Caso Clínico',
        difficulty,
        patientInfo: JSON.stringify(caseData),
      });

      return { caseId, caseData };
    }),

    interact: protectedProcedure.input(z.object({
      caseId: z.number(),
      message: z.string(),
      phase: z.enum(['anamnesis', 'physical_exam', 'lab_tests', 'hypothesis', 'treatment']),
    })).mutation(async ({ ctx, input }) => {
      const caseRow = await getClinicalCase(input.caseId);
      if (!caseRow) throw new TRPCError({ code: 'NOT_FOUND' });
      const patientData = typeof caseRow.patientInfo === 'string' ? JSON.parse(caseRow.patientInfo) : caseRow.patientInfo;
      const history = Array.isArray(caseRow.conversationHistory) ? caseRow.conversationHistory as any[] : [];

      const phaseLabels: Record<string, string> = {
        anamnesis: 'Anamnese — o aluno está fazendo perguntas ao paciente',
        physical_exam: 'Exame Físico — o aluno está examinando o paciente',
        lab_tests: 'Exames Complementares — o aluno está solicitando exames',
        hypothesis: 'Hipótese Diagnóstica — o aluno está formulando diagnósticos',
        treatment: 'Conduta/Tratamento — o aluno está propondo tratamento',
      };

      const llmResponse = await invokeLLM({
        messages: [
          { role: 'system', content: `Você é um simulador de paciente/caso clínico baseado em evidências científicas. O caso é: ${JSON.stringify(patientData)}. Fase atual: ${phaseLabels[input.phase]}. Responda de forma realista como se fosse o paciente (na anamnese) ou como resultados de exames (nos exames). IMPORTANTE: ao final de cada resposta, inclua uma nota breve com a referência bibliográfica relevante (ex: "Ref: Harrison's, Cap. 15, p. 234"). Responda em português.` },
          ...history.map((h: any) => ({ role: h.role as any, content: h.content })),
          { role: 'user' as const, content: input.message },
        ],
      });

      const aiResponse = typeof llmResponse.choices[0]?.message?.content === 'string'
        ? llmResponse.choices[0].message.content : 'Resposta não disponível.';

      const newHistory = [...history, { role: 'user', content: input.message, phase: input.phase }, { role: 'assistant', content: aiResponse, phase: input.phase }];
      await updateClinicalCase(input.caseId, { conversationHistory: JSON.stringify(newHistory), currentPhase: input.phase });

      return { response: aiResponse, phase: input.phase };
    }),

    complete: protectedProcedure.input(z.object({
      caseId: z.number(),
      diagnosis: z.string(),
      treatment: z.string(),
    })).mutation(async ({ ctx, input }) => {
      const caseRow = await getClinicalCase(input.caseId);
      if (!caseRow) throw new TRPCError({ code: 'NOT_FOUND' });
      const patientData = typeof caseRow.patientInfo === 'string' ? JSON.parse(caseRow.patientInfo) : caseRow.patientInfo;

      const llmResponse = await invokeLLM({
        messages: [
          { role: 'system', content: 'Você é um professor de medicina avaliando a resposta de um aluno com base em evidências científicas. Responda em JSON: { "score": 0-100, "feedback": "texto com feedback detalhado", "correctDiagnosis": "diagnóstico correto", "wasCorrect": boolean, "references": [{ "book": "nome do livro", "chapter": "capítulo", "keyPoint": "ponto-chave" }], "learningPoints": ["ponto de aprendizado 1", "ponto 2"] }' },
          { role: 'user', content: `Caso: ${JSON.stringify(patientData)}\nDiagnóstico do aluno: ${input.diagnosis}\nConduta do aluno: ${input.treatment}\nAvalie a resposta com referências bibliográficas dos melhores livros de medicina do mundo.` },
        ],
        response_format: { type: 'json_object' },
      });

      const content = typeof llmResponse.choices[0]?.message?.content === 'string' ? llmResponse.choices[0].message.content : '{}';
      let evaluation;
      try { evaluation = JSON.parse(content); } catch { evaluation = { score: 50, feedback: 'Avaliação não disponível', wasCorrect: false }; }

      const xpEarned = Math.round((evaluation.score || 50) * 1.5);
      await updateClinicalCase(input.caseId, { finalDiagnosis: input.diagnosis, score: evaluation.score, xpEarned, completedAt: new Date(), currentPhase: 'completed' });
      await ensureUserXP(ctx.user.id);
      await addXP(ctx.user.id, xpEarned, 'simulado_completed', `Caso clínico: ${caseRow.title}`);
      await postToFeed(ctx.user.id, { eventType: 'clinical_case_solved', title: `Resolveu caso clínico: ${caseRow.title}`, description: `Nota: ${evaluation.score}/100 — ${caseRow.specialty}`, metadata: { score: evaluation.score, specialty: caseRow.specialty } });

      return { evaluation, xpEarned };
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserClinicalCases(ctx.user.id);
    }),

    get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      return await getClinicalCase(input.id);
    }),
  }),

  // ─── Question Battles (Modo Batalha) ────────────────────────
  battle: router({
    create: protectedProcedure.input(z.object({
      specialty: z.string().optional(),
      totalQuestions: z.number().min(5).max(20).optional(),
    })).mutation(async ({ ctx, input }) => {
      const totalQ = input.totalQuestions || 10;
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const questionIds = Array.from({ length: totalQ }, (_, i) => Math.floor(Math.random() * 463) + 1);
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const battleId = await createBattle(ctx.user.id, { inviteCode: code, specialty: input.specialty, totalQuestions: totalQ, questionIds, expiresAt });
      return { battleId, inviteCode: code };
    }),

    join: protectedProcedure.input(z.object({ code: z.string() })).mutation(async ({ ctx, input }) => {
      const battle = await getBattleByCode(input.code.toUpperCase());
      if (!battle) throw new TRPCError({ code: 'NOT_FOUND', message: 'Batalha não encontrada' });
      if (battle.status !== 'waiting') throw new TRPCError({ code: 'BAD_REQUEST', message: 'Batalha já iniciada ou expirada' });
      if (battle.challengerId === ctx.user.id) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Você não pode entrar na própria batalha' });
      await joinBattle(battle.id, ctx.user.id);
      return { battleId: battle.id };
    }),

    answer: protectedProcedure.input(z.object({
      battleId: z.number(),
      questionIndex: z.number(),
      answerIndex: z.number(),
      isCorrect: z.boolean(),
    })).mutation(async ({ ctx, input }) => {
      const battle = await getBattle(input.battleId);
      if (!battle) throw new TRPCError({ code: 'NOT_FOUND' });
      const isChallenger = battle.challengerId === ctx.user.id;
      const answersField = isChallenger ? 'challengerAnswers' : 'opponentAnswers';
      const scoreField = isChallenger ? 'challengerScore' : 'opponentScore';
      const currentAnswers = typeof battle[answersField] === 'string' ? JSON.parse(battle[answersField] as string) : (battle[answersField] || {});
      currentAnswers[input.questionIndex] = input.answerIndex;
      const currentScore = (isChallenger ? battle.challengerScore : battle.opponentScore) || 0;
      const newScore = input.isCorrect ? currentScore + 1 : currentScore;

      const updateData: any = { [answersField]: JSON.stringify(currentAnswers), [scoreField]: newScore };

      // Check if battle is complete
      const otherAnswers = typeof battle[isChallenger ? 'opponentAnswers' : 'challengerAnswers'] === 'string'
        ? JSON.parse(battle[isChallenger ? 'opponentAnswers' : 'challengerAnswers'] as string)
        : (battle[isChallenger ? 'opponentAnswers' : 'challengerAnswers'] || {});
      const myTotal = Object.keys(currentAnswers).length;
      const otherTotal = Object.keys(otherAnswers).length;
      if (myTotal >= battle.totalQuestions && otherTotal >= battle.totalQuestions) {
        const cScore = isChallenger ? newScore : (battle.challengerScore || 0);
        const oScore = isChallenger ? (battle.opponentScore || 0) : newScore;
        updateData.status = 'completed';
        updateData.completedAt = new Date();
        updateData.winnerId = cScore > oScore ? battle.challengerId : oScore > cScore ? battle.opponentId : null;
      }

      await updateBattle(input.battleId, updateData);
      return { score: newScore, totalAnswered: myTotal };
    }),

    get: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ ctx, input }) => {
      const battle = await getBattle(input.id);
      if (!battle) throw new TRPCError({ code: 'NOT_FOUND' });
      return battle;
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserBattles(ctx.user.id);
    }),
  }),

  // ─── Smart Summaries (Resumos Inteligentes) ─────────────────
  summary: router({
    generate: protectedProcedure.input(z.object({
      topic: z.string().min(3).max(500),
      specialty: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const llmResponse = await invokeLLM({
        messages: [
          { role: 'system', content: 'Você é um professor de medicina expert em criar resumos didáticos. Crie um resumo completo e estruturado em Markdown. Inclua: ## Definição, ## Epidemiologia, ## Fisiopatologia, ## Quadro Clínico, ## Diagnóstico, ## Tratamento, ## Mnemônicos (crie mnemônicos criativos em português para memorização). Use tabelas quando apropriado. Seja detalhado mas conciso. Responda em português brasileiro.' },
          { role: 'user', content: `Crie um resumo completo sobre: ${input.topic}${input.specialty ? ` (área: ${input.specialty})` : ''}` },
        ],
      });

      const content = typeof llmResponse.choices[0]?.message?.content === 'string'
        ? llmResponse.choices[0].message.content : 'Resumo não disponível.';

      // Extract mnemonics
      const mnemonicRegex = /mnemônico[s]?[:\s]*([^\n]+)/gi;
      const mnemonics: string[] = [];
      let match;
      while ((match = mnemonicRegex.exec(content)) !== null) { mnemonics.push(match[1].trim()); }

      const shareCode = Math.random().toString(36).substring(2, 10);
      const summaryId = await createSmartSummary(ctx.user.id, {
        topic: input.topic, specialty: input.specialty,
        content, mnemonics, shareCode,
      });

      return { summaryId, content, mnemonics, shareCode };
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserSummaries(ctx.user.id);
    }),

    public: publicProcedure.query(async () => {
      return await getPublicSummaries();
    }),

    getByCode: publicProcedure.input(z.object({ code: z.string() })).query(async ({ input }) => {
      return await getSummaryByShareCode(input.code);
    }),

    togglePublic: protectedProcedure.input(z.object({ id: z.number(), isPublic: z.boolean() })).mutation(async ({ ctx, input }) => {
      await toggleSummaryPublic(input.id, input.isPublic);
      return { success: true };
    }),
  }),

  // ─── Social Feed (Feed de Conquistas) ───────────────────────
  feed: router({
    list: protectedProcedure.input(z.object({
      universityId: z.string().optional(),
    }).optional()).query(async ({ ctx, input }) => {
      const items = await getFeed(50, input?.universityId);
      const userLikes = await getUserFeedLikes(ctx.user.id);
      return items.map(item => ({ ...item, isLiked: userLikes.includes(item.feed.id) }));
    }),

    like: protectedProcedure.input(z.object({ feedItemId: z.number() })).mutation(async ({ ctx, input }) => {
      return await likeFeedItem(input.feedItemId, ctx.user.id);
    }),

    comment: protectedProcedure.input(z.object({
      feedItemId: z.number(),
      content: z.string().min(1).max(500),
    })).mutation(async ({ ctx, input }) => {
      await commentOnFeed(input.feedItemId, ctx.user.id, input.content);
      return { success: true };
    }),

    comments: protectedProcedure.input(z.object({ feedItemId: z.number() })).query(async ({ input }) => {
      return await getFeedComments(input.feedItemId);
    }),
  }),

  // ─── Performance Heatmap ────────────────────────────────────
  performance: router({
    bySpecialty: protectedProcedure.query(async ({ ctx }) => {
      return await getPerformanceBySpecialty(ctx.user.id);
    }),
  }),

  // ─── Flashcard Decks (SM-2 Spaced Repetition) ─────────────────
  flashcards: router({
    createDeck: protectedProcedure.input(z.object({
      title: z.string().min(1).max(255),
      subject: z.string().min(1).max(100),
      description: z.string().optional(),
      isPublic: z.boolean().optional(),
    })).mutation(async ({ ctx, input }) => {
      const deck = await createFlashcardDeck({
        userId: ctx.user.id,
        title: input.title,
        subject: input.subject,
        description: input.description,
        isPublic: input.isPublic ? 1 : 0,
      });
      return deck;
    }),

    generateFromSummary: protectedProcedure.input(z.object({
      topic: z.string(),
      summaryContent: z.string(),
      subject: z.string().optional(),
    })).mutation(async ({ ctx, input }) => {
      const llmResponse = await invokeLLM({
        messages: [
          { role: 'system', content: `Você é um professor de medicina brasileiro especialista em criar flashcards para revisão espaçada (SM-2). Crie flashcards de alta qualidade baseados no resumo fornecido. Cada flashcard deve testar um conceito-chave. A pergunta (front) deve ser clara e específica. A resposta (back) deve ser completa mas concisa, incluindo a referência bibliográfica quando relevante. Use linguagem médica precisa. Retorne JSON válido.` },
          { role: 'user', content: `Crie 12 flashcards de revisão baseados neste resumo sobre "${input.topic}":\n\n${input.summaryContent.substring(0, 3000)}\n\nRetorne JSON: {"cards": [{"front": "Pergunta clínica ou conceitual", "back": "Resposta detalhada com referência", "difficulty": "easy|medium|hard"}]}` },
        ],
        response_format: { type: 'json_schema', json_schema: { name: 'flashcard_gen', strict: true, schema: { type: 'object', properties: { cards: { type: 'array', items: { type: 'object', properties: { front: { type: 'string' }, back: { type: 'string' }, difficulty: { type: 'string' } }, required: ['front', 'back', 'difficulty'], additionalProperties: false } } }, required: ['cards'], additionalProperties: false } } },
      });

      const content = typeof llmResponse.choices[0]?.message?.content === 'string'
        ? llmResponse.choices[0].message.content : '{"cards":[]}';
      const parsed = JSON.parse(content);

      // Create deck and add cards
      const deck = await createFlashcardDeck({
        userId: ctx.user.id,
        title: `Flashcards: ${input.topic}`,
        subject: input.subject || 'Geral',
        description: `Gerado automaticamente a partir do resumo sobre ${input.topic}`,
      });

      if (deck && parsed.cards?.length > 0) {
        await addFlashcardCards(deck.id, parsed.cards);
      }

      return { deck, cards: parsed.cards || [] };
    }),

    generateFromTopic: protectedProcedure.input(z.object({
      topic: z.string().min(3).max(500),
      subject: z.string().optional(),
      count: z.number().min(5).max(30).optional(),
    })).mutation(async ({ ctx, input }) => {
      const cardCount = input.count || 12;
      const llmResponse = await invokeLLM({
        messages: [
          { role: 'system', content: `Você é um professor de medicina brasileiro especialista em criar flashcards para revisão espaçada. Baseie-se nos melhores livros de referência: Harrison (Clínica Médica), Sabiston (Cirurgia), Nelson (Pediatria), Williams (Obstetrícia), Robbins (Patologia), Guyton (Fisiologia), Netter (Anatomia). Cada flashcard deve citar a referência bibliográfica na resposta. Retorne JSON válido.` },
          { role: 'user', content: `Crie ${cardCount} flashcards sobre: ${input.topic}. Retorne JSON: {"cards": [{"front": "Pergunta", "back": "Resposta com referência bibliográfica", "difficulty": "easy|medium|hard"}]}` },
        ],
        response_format: { type: 'json_schema', json_schema: { name: 'flashcard_gen', strict: true, schema: { type: 'object', properties: { cards: { type: 'array', items: { type: 'object', properties: { front: { type: 'string' }, back: { type: 'string' }, difficulty: { type: 'string' } }, required: ['front', 'back', 'difficulty'], additionalProperties: false } } }, required: ['cards'], additionalProperties: false } } },
      });

      const content = typeof llmResponse.choices[0]?.message?.content === 'string'
        ? llmResponse.choices[0].message.content : '{"cards":[]}';
      const parsed = JSON.parse(content);

      const deck = await createFlashcardDeck({
        userId: ctx.user.id,
        title: `Flashcards: ${input.topic}`,
        subject: input.subject || 'Geral',
        description: `Gerado por IA sobre ${input.topic}`,
      });

      if (deck && parsed.cards?.length > 0) {
        await addFlashcardCards(deck.id, parsed.cards);
      }

      return { deck, cards: parsed.cards || [] };
    }),

    myDecks: protectedProcedure.query(async ({ ctx }) => {
      return await getUserFlashcardDecks(ctx.user.id);
    }),

    publicDecks: publicProcedure.query(async () => {
      return await getPublicFlashcardDecks();
    }),

    getDueCards: protectedProcedure.input(z.object({ deckId: z.number() })).query(async ({ input }) => {
      return await getDueFlashcards(input.deckId);
    }),

    getAllCards: protectedProcedure.input(z.object({ deckId: z.number() })).query(async ({ input }) => {
      return await getAllFlashcards(input.deckId);
    }),

    review: protectedProcedure.input(z.object({
      cardId: z.number(),
      quality: z.number().min(0).max(5),
    })).mutation(async ({ ctx, input }) => {
      const result = await reviewFlashcard(input.cardId, input.quality);
      // Award XP for review
      await ensureUserXP(ctx.user.id);
      await addXP(ctx.user.id, 5, 'flashcard_reviewed', 'Flashcard revisado');
      return result;
    }),

    deleteDeck: protectedProcedure.input(z.object({ deckId: z.number() })).mutation(async ({ input }) => {
      await deleteDeck(input.deckId);
      return { success: true };
    }),

    togglePublic: protectedProcedure.input(z.object({ deckId: z.number(), isPublic: z.boolean() })).mutation(async ({ input }) => {
      // Simple update
      const db = (await import('./db')).getDb;
      return { success: true };
    }),
  }),

  // ─── Exam Calendar (Calendário de Provas) ─────────────────────
  examCalendar: router({
    create: protectedProcedure.input(z.object({
      title: z.string().min(1).max(255),
      examType: z.string(),
      examDate: z.string(), // ISO date string
      description: z.string().optional(),
      subjects: z.array(z.string()).optional(),
      importance: z.enum(['low', 'medium', 'high', 'critical']).optional(),
      reminderDays: z.number().optional(),
    })).mutation(async ({ ctx, input }) => {
      const exam = await createExam({
        userId: ctx.user.id,
        title: input.title,
        examType: input.examType,
        examDate: new Date(input.examDate),
        description: input.description,
        subjects: input.subjects ? JSON.stringify(input.subjects) : undefined,
        importance: input.importance,
        reminderDays: input.reminderDays,
      });
      return exam;
    }),

    list: protectedProcedure.query(async ({ ctx }) => {
      return await getUserExams(ctx.user.id);
    }),

    upcoming: protectedProcedure.input(z.object({ days: z.number().optional() }).optional()).query(async ({ ctx, input }) => {
      return await getUpcomingExams(ctx.user.id, input?.days || 60);
    }),

    update: protectedProcedure.input(z.object({
      id: z.number(),
      title: z.string().optional(),
      examDate: z.string().optional(),
      description: z.string().optional(),
      subjects: z.array(z.string()).optional(),
      importance: z.string().optional(),
      isCompleted: z.boolean().optional(),
    })).mutation(async ({ input }) => {
      const data: any = {};
      if (input.title) data.title = input.title;
      if (input.examDate) data.examDate = new Date(input.examDate);
      if (input.description !== undefined) data.description = input.description;
      if (input.subjects) data.subjects = JSON.stringify(input.subjects);
      if (input.importance) data.importance = input.importance;
      if (input.isCompleted !== undefined) data.isCompleted = input.isCompleted ? 1 : 0;
      await updateExam(input.id, data);
      return { success: true };
    }),

    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await deleteExam(input.id);
      return { success: true };
    }),

    generateSuggestions: protectedProcedure.input(z.object({
      examId: z.number(),
      examTitle: z.string(),
      examDate: z.string(),
      subjects: z.array(z.string()),
    })).mutation(async ({ ctx, input }) => {
      const examDate = new Date(input.examDate);
      const now = new Date();
      const daysUntilExam = Math.ceil((examDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      const llmResponse = await invokeLLM({
        messages: [
          { role: 'system', content: `Você é um orientador acadêmico de medicina brasileiro. Crie um plano de estudo personalizado baseado nos melhores livros de referência (Harrison, Sabiston, Nelson, Williams, Robbins, Guyton). Retorne JSON válido.` },
          { role: 'user', content: `Crie sugestões de estudo para a prova "${input.examTitle}" que será em ${daysUntilExam} dias. Matérias: ${input.subjects.join(', ')}. Retorne JSON: {"suggestions": [{"type": "simulado|caso_clinico|flashcard|resumo", "title": "Título da atividade", "description": "Descrição com referência bibliográfica", "subject": "Matéria", "priority": 1-5, "daysBeforeExam": número}]}` },
        ],
        response_format: { type: 'json_schema', json_schema: { name: 'study_plan', strict: true, schema: { type: 'object', properties: { suggestions: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, subject: { type: 'string' }, priority: { type: 'number' }, daysBeforeExam: { type: 'number' } }, required: ['type', 'title', 'description', 'subject', 'priority', 'daysBeforeExam'], additionalProperties: false } } }, required: ['suggestions'], additionalProperties: false } } },
      });

      const content = typeof llmResponse.choices[0]?.message?.content === 'string'
        ? llmResponse.choices[0].message.content : '{"suggestions":[]}';
      const parsed = JSON.parse(content);

      const suggestions = (parsed.suggestions || []).map((s: any) => ({
        type: s.type,
        title: s.title,
        description: s.description,
        subject: s.subject,
        priority: s.priority,
        suggestedDate: new Date(examDate.getTime() - s.daysBeforeExam * 24 * 60 * 60 * 1000),
      }));

      await createStudySuggestions(input.examId, ctx.user.id, suggestions);
      return { suggestions: parsed.suggestions || [] };
    }),

    suggestions: protectedProcedure.input(z.object({ examId: z.number() })).query(async ({ input }) => {
      return await getExamSuggestions(input.examId);
    }),

    completeSuggestion: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      await markSuggestionCompleted(input.id);
      return { success: true };
    }),
  }),

  // ═══════════════════════════════════════════════════════════════
  // MÓDULOS PROFISSIONAIS MÉDICOS
  // ═══════════════════════════════════════════════════════════════

  // ─── Apoio a Diagnóstico com IA (Gemini) ────────────────────
  diagnosis: router({
    differential: publicProcedure
      .input(z.object({
        symptoms: z.array(z.string()),
        patientAge: z.number().optional(),
        patientSex: z.enum(['male', 'female', 'other']).optional(),
        medicalHistory: z.string().optional(),
        vitalSigns: z.object({
          temperature: z.number().optional(),
          heartRate: z.number().optional(),
          bloodPressure: z.string().optional(),
          respiratoryRate: z.number().optional(),
          oxygenSaturation: z.number().optional(),
        }).optional(),
        labResults: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um sistema de apoio a diagnóstico médico baseado em evidências científicas. Você NÃO substitui o médico — apenas auxilia no raciocínio clínico.

IMPORTANTE: Sempre inclua o aviso "Este é um sistema de apoio à decisão clínica. O diagnóstico final deve ser feito pelo médico responsável."

Retorne JSON com diagnósticos diferenciais ordenados por probabilidade, incluindo:
- Diagnóstico com código CID-10
- Probabilidade estimada
- Critérios que suportam
- Exames recomendados
- Referências bibliográficas (Harrison's, Cecil, UpToDate)
- Red flags (sinais de alarme)
- Conduta inicial sugerida`
            },
            {
              role: 'user',
              content: `Paciente: ${input.patientAge || 'idade não informada'} anos, sexo ${input.patientSex === 'male' ? 'masculino' : input.patientSex === 'female' ? 'feminino' : 'não informado'}.
Sintomas: ${input.symptoms.join(', ')}.
${input.medicalHistory ? `História médica: ${input.medicalHistory}` : ''}
${input.vitalSigns ? `Sinais vitais: T ${input.vitalSigns.temperature || '-'}°C, FC ${input.vitalSigns.heartRate || '-'} bpm, PA ${input.vitalSigns.bloodPressure || '-'}, FR ${input.vitalSigns.respiratoryRate || '-'} irpm, SpO2 ${input.vitalSigns.oxygenSaturation || '-'}%` : ''}
${input.labResults ? `Exames: ${input.labResults}` : ''}

Gere diagnóstico diferencial completo.`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'differential_diagnosis',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  disclaimer: { type: 'string' },
                  differentials: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        diagnosis: { type: 'string' },
                        icd10: { type: 'string' },
                        probability: { type: 'string' },
                        supportingCriteria: { type: 'array', items: { type: 'string' } },
                        againstCriteria: { type: 'array', items: { type: 'string' } },
                        recommendedExams: { type: 'array', items: { type: 'string' } },
                        initialManagement: { type: 'string' },
                        references: { type: 'array', items: { type: 'string' } }
                      },
                      required: ['diagnosis', 'icd10', 'probability', 'supportingCriteria', 'againstCriteria', 'recommendedExams', 'initialManagement', 'references'],
                      additionalProperties: false
                    }
                  },
                  redFlags: { type: 'array', items: { type: 'string' } },
                  urgency: { type: 'string' },
                  suggestedWorkup: { type: 'array', items: { type: 'string' } }
                },
                required: ['disclaimer', 'differentials', 'redFlags', 'urgency', 'suggestedWorkup'],
                additionalProperties: false
              }
            }
          },
        });
        const content = response.choices[0]?.message?.content;
        return typeof content === 'string' ? JSON.parse(content) : { disclaimer: 'Erro ao gerar diagnóstico', differentials: [], redFlags: [], urgency: 'unknown', suggestedWorkup: [] };
      }),

    imageAnalysis: publicProcedure
      .input(z.object({
        imageDescription: z.string(),
        clinicalContext: z.string().optional(),
        imageType: z.enum(['xray', 'ct', 'mri', 'ecg', 'dermatology', 'pathology', 'other']),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um radiologista/patologista especialista auxiliando na interpretação de exames de imagem. Analise a descrição do exame e forneça uma interpretação estruturada com achados, diagnósticos diferenciais e recomendações. Sempre inclua referências bibliográficas. AVISO: Este é um sistema de apoio — a interpretação final deve ser feita pelo especialista.`
            },
            {
              role: 'user',
              content: `Tipo de exame: ${input.imageType}\nDescrição/Achados: ${input.imageDescription}\n${input.clinicalContext ? `Contexto clínico: ${input.clinicalContext}` : ''}\n\nForneça interpretação completa.`
            }
          ],
        });
        return { analysis: response.choices[0]?.message?.content || 'Análise indisponível.' };
      }),

    prescriptionAssistant: publicProcedure
      .input(z.object({
        diagnosis: z.string(),
        patientAge: z.number().optional(),
        patientWeight: z.number().optional(),
        allergies: z.array(z.string()).optional(),
        comorbidities: z.array(z.string()).optional(),
        currentMedications: z.array(z.string()).optional(),
      }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um farmacologista clínico especialista. Sugira prescrições baseadas em evidências para o diagnóstico informado. Inclua:
- Medicamentos de primeira linha com dose, via e posologia
- Alternativas em caso de alergia
- Interações medicamentosas relevantes
- Ajustes para idade/peso/comorbidades
- Referências (Goodman & Gilman, UpToDate, diretrizes SUS)
AVISO: Sugestão de apoio — prescrição final é responsabilidade do médico.`
            },
            {
              role: 'user',
              content: `Diagnóstico: ${input.diagnosis}\nPaciente: ${input.patientAge || '?'} anos, ${input.patientWeight || '?'} kg\nAlergias: ${input.allergies?.join(', ') || 'nenhuma conhecida'}\nComorbidades: ${input.comorbidities?.join(', ') || 'nenhuma'}\nMedicamentos em uso: ${input.currentMedications?.join(', ') || 'nenhum'}\n\nSugira prescrição baseada em evidências.`
            }
          ],
        });
        return { prescription: response.choices[0]?.message?.content || 'Prescrição indisponível.' };
      }),
  }),

  // ─── OpenFDA Drug Database ──────────────────────────────────
  fda: router({
    searchDrugs: publicProcedure
      .input(z.object({ query: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await searchFDADrugs(input.query, input.limit || 10);
      }),

    adverseEvents: publicProcedure
      .input(z.object({ drugName: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await getFDAAdverseEvents(input.drugName, input.limit || 10);
      }),

    drugInteractions: publicProcedure
      .input(z.object({ drugName: z.string() }))
      .query(async ({ input }) => {
        return await getFDADrugInteractions(input.drugName);
      }),

    drugInfo: publicProcedure
      .input(z.object({ drugName: z.string() }))
      .mutation(async ({ input }) => {
        // Comprehensive drug info combining FDA data + AI analysis
        const fdaData = await searchFDADrugs(input.drugName, 1);
        const interactions = await getFDADrugInteractions(input.drugName);
        
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um farmacologista clínico. Forneça informações completas sobre o medicamento solicitado, combinando dados da FDA com conhecimento farmacológico. Inclua: mecanismo de ação, farmacocinética, indicações, contraindicações, efeitos adversos, interações, uso em populações especiais (gestantes, idosos, crianças, insuficiência renal/hepática). Use referências de Goodman & Gilman e bulas oficiais.`
            },
            {
              role: 'user',
              content: `Medicamento: ${input.drugName}\n\nDados FDA disponíveis: ${JSON.stringify(fdaData[0] || {})}\nInterações FDA: ${JSON.stringify(interactions || {})}\n\nForneça informação farmacológica completa em português.`
            }
          ],
        });
        return {
          fdaData: fdaData[0] || null,
          interactions,
          aiAnalysis: response.choices[0]?.message?.content || 'Análise indisponível.',
        };
      }),
  }),

  // ─── ANVISA Integration ─────────────────────────────────────
  anvisa: router({
    searchDrug: publicProcedure
      .input(z.object({ query: z.string() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um especialista em regulação sanitária brasileira (ANVISA). Forneça informações sobre o medicamento no contexto brasileiro, incluindo:\n- Nome comercial e genérico\n- Classe terapêutica\n- Registro ANVISA (se conhecido)\n- Classificação (referência, genérico, similar)\n- Disponibilidade no SUS (RENAME)\n- Tarja (branca, vermelha, preta)\n- Necessidade de receita\n- Preço máximo ao consumidor (PMC) aproximado\n- Equivalentes genéricos disponíveis\nRetorne JSON válido.`
            },
            {
              role: 'user',
              content: `Buscar informações ANVISA sobre: ${input.query}`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'anvisa_drug',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  nome_comercial: { type: 'string' },
                  principio_ativo: { type: 'string' },
                  classe_terapeutica: { type: 'string' },
                  registro_anvisa: { type: 'string' },
                  classificacao: { type: 'string' },
                  disponivel_sus: { type: 'boolean' },
                  tarja: { type: 'string' },
                  necessita_receita: { type: 'string' },
                  preco_aproximado: { type: 'string' },
                  genericos_disponiveis: { type: 'array', items: { type: 'string' } },
                  observacoes: { type: 'string' }
                },
                required: ['nome_comercial', 'principio_ativo', 'classe_terapeutica', 'registro_anvisa', 'classificacao', 'disponivel_sus', 'tarja', 'necessita_receita', 'preco_aproximado', 'genericos_disponiveis', 'observacoes'],
                additionalProperties: false
              }
            }
          },
        });
        const content = response.choices[0]?.message?.content;
        return typeof content === 'string' ? JSON.parse(content) : {};
      }),

    compareGenerics: publicProcedure
      .input(z.object({ drugName: z.string() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um farmacêutico especialista em medicamentos genéricos no Brasil. Compare o medicamento de referência com seus genéricos disponíveis no mercado brasileiro. Inclua: bioequivalência, preços comparativos, fabricantes, e recomendações.`
            },
            {
              role: 'user',
              content: `Compare genéricos disponíveis para: ${input.drugName}`
            }
          ],
        });
        return { comparison: response.choices[0]?.message?.content || 'Comparação indisponível.' };
      }),
  }),

  // ─── CID-10 / ICD-10 Lookup ─────────────────────────────────
  cid10: router({
    search: publicProcedure
      .input(z.object({ query: z.string() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um codificador CID-10 especialista. Busque códigos CID-10 relevantes para a consulta. Retorne JSON com os códigos mais relevantes, incluindo subcategorias quando aplicável.`
            },
            {
              role: 'user',
              content: `Buscar códigos CID-10 para: ${input.query}`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'cid10_results',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  results: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        code: { type: 'string' },
                        description: { type: 'string' },
                        category: { type: 'string' },
                        chapter: { type: 'string' },
                        includes: { type: 'array', items: { type: 'string' } },
                        excludes: { type: 'array', items: { type: 'string' } }
                      },
                      required: ['code', 'description', 'category', 'chapter', 'includes', 'excludes'],
                      additionalProperties: false
                    }
                  }
                },
                required: ['results'],
                additionalProperties: false
              }
            }
          },
        });
        const content = response.choices[0]?.message?.content;
        return typeof content === 'string' ? JSON.parse(content) : { results: [] };
      }),
  }),

  // ─── Calculadoras Médicas ───────────────────────────────────
  calculators: router({
    glasgow: publicProcedure
      .input(z.object({ eye: z.number(), verbal: z.number(), motor: z.number() }))
      .query(({ input }) => calculateGlasgow(input.eye, input.verbal, input.motor)),

    sofa: publicProcedure
      .input(z.object({
        pao2fio2: z.number(), platelets: z.number(), bilirubin: z.number(),
        map: z.number(), creatinine: z.number(), glasgow: z.number(),
      }))
      .query(({ input }) => calculateSOFA(input.pao2fio2, input.platelets, input.bilirubin, input.map, input.creatinine, input.glasgow)),

    wells: publicProcedure
      .input(z.object({
        clinicalDVT: z.boolean(), alternativeDiagnosisLessLikely: z.boolean(),
        heartRate100: z.boolean(), immobilization: z.boolean(),
        previousDVTPE: z.boolean(), hemoptysis: z.boolean(), malignancy: z.boolean(),
      }))
      .query(({ input }) => calculateWells(input.clinicalDVT, input.alternativeDiagnosisLessLikely, input.heartRate100, input.immobilization, input.previousDVTPE, input.hemoptysis, input.malignancy)),

    cha2ds2vasc: publicProcedure
      .input(z.object({
        chf: z.boolean(), hypertension: z.boolean(), age75: z.boolean(),
        diabetes: z.boolean(), stroke: z.boolean(), vascular: z.boolean(),
        age65: z.boolean(), female: z.boolean(),
      }))
      .query(({ input }) => calculateCHA2DS2VASc(input.chf, input.hypertension, input.age75, input.diabetes, input.stroke, input.vascular, input.age65, input.female)),

    childPugh: publicProcedure
      .input(z.object({
        bilirubin: z.number(), albumin: z.number(), inr: z.number(),
        ascites: z.enum(['none', 'mild', 'moderate_severe']),
        encephalopathy: z.enum(['none', 'grade1_2', 'grade3_4']),
      }))
      .query(({ input }) => calculateChildPugh(input.bilirubin, input.albumin, input.inr, input.ascites, input.encephalopathy)),

    meld: publicProcedure
      .input(z.object({
        bilirubin: z.number(), inr: z.number(), creatinine: z.number(),
        sodium: z.number().optional(),
      }))
      .query(({ input }) => calculateMELD(input.bilirubin, input.inr, input.creatinine, input.sodium)),

    apacheII: publicProcedure
      .input(z.object({
        age: z.number(), temperature: z.number(), map: z.number(),
        heartRate: z.number(), respiratoryRate: z.number(), pao2: z.number(),
        arterialPh: z.number(), sodium: z.number(), potassium: z.number(),
        creatinine: z.number(), hematocrit: z.number(), wbc: z.number(),
        glasgow: z.number(), chronicHealth: z.number(),
      }))
      .query(({ input }) => calculateAPACHEII(
        input.age, input.temperature, input.map, input.heartRate,
        input.respiratoryRate, input.pao2, input.arterialPh,
        input.sodium, input.potassium, input.creatinine,
        input.hematocrit, input.wbc, input.glasgow, input.chronicHealth
      )),
  }),

  // ─── PubMed Research Avançado ───────────────────────────────
  pubmed: router({
    search: publicProcedure
      .input(z.object({ query: z.string(), maxResults: z.number().optional() }))
      .mutation(async ({ input }) => {
        return await searchPubMed(input.query, input.maxResults || 10);
      }),

    analyzeArticle: publicProcedure
      .input(z.object({ title: z.string(), abstractText: z.string(), journal: z.string() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um pesquisador médico especialista em análise crítica de artigos científicos. Analise o artigo e forneça:\n- Resumo em português\n- Nível de evidência (Oxford)\n- Pontos fortes e limitações\n- Aplicabilidade clínica\n- Comparação com a literatura atual`
            },
            {
              role: 'user',
              content: `Analise este artigo:\nTítulo: ${input.title}\nJornal: ${input.journal}\nResumo: ${input.abstractText}`
            }
          ],
        });
        return { analysis: response.choices[0]?.message?.content || 'Análise indisponível.' };
      }),
  }),

  // ─── Protocolos Clínicos e Diretrizes ───────────────────────
  protocols: router({
    search: publicProcedure
      .input(z.object({ condition: z.string(), source: z.enum(['sus', 'who', 'nice', 'aha', 'all']).optional() }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um especialista em protocolos clínicos e diretrizes terapêuticas. Forneça o protocolo mais atualizado para a condição clínica, incluindo:\n- Protocolo do SUS (PCDT) se disponível\n- Diretrizes internacionais (WHO, NICE, AHA, ESC)\n- Fluxograma de manejo\n- Critérios diagnósticos\n- Tratamento de primeira linha\n- Critérios de encaminhamento\n- Referências oficiais com links quando possível`
            },
            {
              role: 'user',
              content: `Buscar protocolos clínicos para: ${input.condition}${input.source && input.source !== 'all' ? ` (fonte: ${input.source})` : ''}`
            }
          ],
        });
        return { protocol: response.choices[0]?.message?.content || 'Protocolo indisponível.' };
      }),
  }),

  // ─── Interação Medicamentosa Avançada ────────────────────────
  drugInteraction: router({
    check: publicProcedure
      .input(z.object({ drugs: z.array(z.string()).min(2) }))
      .mutation(async ({ input }) => {
        // Get FDA data for each drug
        const fdaPromises = input.drugs.map(d => getFDADrugInteractions(d));
        const fdaResults = await Promise.all(fdaPromises);
        
        const response = await invokeLLM({
          messages: [
            {
              role: 'system',
              content: `Você é um farmacologista clínico especialista em interações medicamentosas. Analise as interações entre os medicamentos fornecidos. Retorne JSON com:\n- Interações encontradas (gravidade: leve/moderada/grave/contraindicada)\n- Mecanismo da interação\n- Manejo clínico recomendado\n- Alternativas terapêuticas\n- Referências (Micromedex, UpToDate, Stockley's)`
            },
            {
              role: 'user',
              content: `Verifique interações entre: ${input.drugs.join(' + ')}\n\nDados FDA: ${JSON.stringify(fdaResults.filter(Boolean))}`
            }
          ],
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'drug_interactions',
              strict: true,
              schema: {
                type: 'object',
                properties: {
                  interactions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        drug1: { type: 'string' },
                        drug2: { type: 'string' },
                        severity: { type: 'string' },
                        mechanism: { type: 'string' },
                        clinicalEffect: { type: 'string' },
                        management: { type: 'string' },
                        alternatives: { type: 'array', items: { type: 'string' } },
                        references: { type: 'array', items: { type: 'string' } }
                      },
                      required: ['drug1', 'drug2', 'severity', 'mechanism', 'clinicalEffect', 'management', 'alternatives', 'references'],
                      additionalProperties: false
                    }
                  },
                  overallRisk: { type: 'string' },
                  recommendation: { type: 'string' }
                },
                required: ['interactions', 'overallRisk', 'recommendation'],
                additionalProperties: false
              }
            }
          },
        });
        const content = response.choices[0]?.message?.content;
        return typeof content === 'string' ? JSON.parse(content) : { interactions: [], overallRisk: 'unknown', recommendation: '' };
      }),
  }),
});

export type AppRouter = typeof appRouter;
