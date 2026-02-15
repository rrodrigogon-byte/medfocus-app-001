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
import { getOrCreateProgress, addXp, getXpHistory, logStudySession, updateUserProfile, createClassroom, getClassroomsByProfessor, getClassroomsByStudent, getClassroomById, joinClassroom, getEnrollments, removeEnrollment, createActivity, getActivitiesByClassroom, updateActivity, submitActivity, gradeSubmission, getSubmissionsByActivity, getStudentSubmissions, getClassroomAnalytics } from "./db";

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
});

export type AppRouter = typeof appRouter;
