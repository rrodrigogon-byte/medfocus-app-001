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
import { getOrCreateProgress, addXp, getXpHistory, logStudySession, updateUserProfile, createClassroom, getClassroomsByProfessor, getClassroomsByStudent, getClassroomById, joinClassroom, getEnrollments, removeEnrollment, createActivity, getActivitiesByClassroom, updateActivity, submitActivity, gradeSubmission, getSubmissionsByActivity, getStudentSubmissions, getClassroomAnalytics, findGeneratedMaterial, saveGeneratedMaterial, getUserMaterialHistory, getGeneratedMaterialById, rateMaterial, searchLibraryMaterials, saveLibraryMaterial, getLibraryMaterialById, toggleSaveMaterial, getUserSavedMaterialIds, getUserSavedMaterialsFull, getPopularLibraryMaterials, searchPubmedCache, savePubmedArticle, getPubmedArticleByPmid, addMaterialReview, getMaterialReviews, markReviewHelpful, trackStudyActivity, getUserStudyHistoryData, getUserTopSubjects, getUserQuizPerformance } from "./db";

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
        const origin = ctx.req.headers.origin || "https://medfocus-h6i7pa9q.manus.space";

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
});

export type AppRouter = typeof appRouter;
