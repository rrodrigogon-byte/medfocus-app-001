import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { ENV } from "./_core/env";
import { z } from "zod";
import Stripe from "stripe";
import { PLANS } from "./products";
import { getOrCreateProgress, addXp, getXpHistory, logStudySession, updateUserProfile } from "./db";

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
  }),
});

export type AppRouter = typeof appRouter;
