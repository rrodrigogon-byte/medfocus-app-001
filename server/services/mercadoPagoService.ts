/**
 * MedFocus — Mercado Pago Payment Service
 * 
 * Integração com Mercado Pago Checkout Pro para assinaturas no Brasil.
 * Suporta: Pix, Cartão de Crédito, Boleto Bancário
 * 
 * Fluxo:
 * 1. Cria preferência de pagamento com trial de 7 dias
 * 2. Redireciona para checkout do Mercado Pago
 * 3. Webhook recebe notificação de pagamento
 * 4. Ativa/desativa assinatura do usuário
 */

import { ENV } from "../_core/env";

// Mercado Pago API base URL
const MP_API_BASE = "https://api.mercadopago.com";

interface MPPreferenceItem {
  id: string;
  title: string;
  description: string;
  currency_id: string;
  unit_price: number;
  quantity: number;
}

interface MPPreferenceResponse {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  date_created: string;
}

interface MPPaymentResponse {
  id: number;
  status: string;
  status_detail: string;
  transaction_amount: number;
  currency_id: string;
  payer: {
    email: string;
    id: string;
  };
  metadata: Record<string, any>;
  external_reference: string;
}

interface MPSubscriptionResponse {
  id: string;
  status: string;
  reason: string;
  external_reference: string;
  payer_id: number;
  init_point: string;
  auto_recurring: {
    frequency: number;
    frequency_type: string;
    transaction_amount: number;
    currency_id: string;
    free_trial?: {
      frequency: number;
      frequency_type: string;
    };
  };
}

/**
 * Helper to make authenticated requests to Mercado Pago API
 */
async function mpFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = ENV.mpAccessToken;
  if (!token) {
    throw new Error("MP_ACCESS_TOKEN não configurado");
  }

  const url = `${MP_API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`[MercadoPago] API Error ${response.status}: ${errorBody}`);
    throw new Error(`Mercado Pago API error: ${response.status} - ${errorBody}`);
  }

  return response.json() as Promise<T>;
}

/**
 * Plan configuration for Mercado Pago
 */
const MP_PLANS = {
  publico: {
    title: "MedFocus Público Geral",
    description: "Acesso a módulos de Saúde Pública",
    monthlyPrice: 6.99,
    yearlyPrice: 67.10,
    partnershipYearlyPrice: 0,
  },
  estudante: {
    title: "MedFocus Estudante",
    description: "Plano completo para estudantes de medicina",
    monthlyPrice: 49.90,
    yearlyPrice: 479.04,
    partnershipYearlyPrice: 287.42,
  },
  medico: {
    title: "MedFocus Médico",
    description: "Plano profissional para médicos em exercício",
    monthlyPrice: 59.90,
    yearlyPrice: 575.04,
    partnershipYearlyPrice: 0,
  },
  professor: {
    title: "MedFocus Professor",
    description: "Plano para docentes universitários",
    monthlyPrice: 49.90,
    yearlyPrice: 479.04,
    partnershipYearlyPrice: 0,
  },
};

/**
 * Create a Mercado Pago Checkout Pro preference for subscription
 * Uses preapproval (subscription) API for recurring payments
 */
export async function createMPSubscription(params: {
  userId: number;
  userEmail: string;
  userName: string;
  planId: "publico" | "estudante" | "medico" | "professor";
  interval: "monthly" | "yearly";
  partnershipCode?: string;
  origin: string;
}): Promise<{ initPoint: string; subscriptionId: string }> {
  const plan = MP_PLANS[params.planId];
  if (!plan) {
    throw new Error(`Plano inválido: ${params.planId}`);
  }

  const isYearly = params.interval === "yearly";
  const isPartnership = !!params.partnershipCode;

  let price: number;
  let intervalLabel: string;

  if (isPartnership && isYearly && plan.partnershipYearlyPrice > 0) {
    price = plan.partnershipYearlyPrice;
    intervalLabel = "Anual (Parceria 40% desc)";
  } else if (isYearly) {
    price = plan.yearlyPrice;
    intervalLabel = "Anual (20% desc)";
  } else {
    price = plan.monthlyPrice;
    intervalLabel = "Mensal";
  }

  const frequencyType = isYearly ? "months" : "months";
  const frequency = isYearly ? 12 : 1;

  console.log(`[MercadoPago] Creating subscription for user ${params.userId}, plan: ${params.planId}, price: R$${price}, interval: ${intervalLabel}`);

  // Use the preapproval (subscription) endpoint
  const subscription = await mpFetch<MPSubscriptionResponse>("/preapproval", {
    method: "POST",
    body: JSON.stringify({
      reason: `${plan.title} (${intervalLabel})`,
      auto_recurring: {
        frequency: frequency,
        frequency_type: frequencyType,
        transaction_amount: price,
        currency_id: "BRL",
        free_trial: {
          frequency: 7,
          frequency_type: "days",
        },
      },
      back_url: `${params.origin}/?payment=success`,
      payer_email: params.userEmail,
      external_reference: JSON.stringify({
        user_id: params.userId,
        plan: params.planId,
        interval: params.interval,
        partnership_code: params.partnershipCode || "",
      }),
      status: "pending",
    }),
  });

  console.log(`[MercadoPago] Subscription created: ${subscription.id}, init_point: ${subscription.init_point}`);

  return {
    initPoint: subscription.init_point,
    subscriptionId: subscription.id,
  };
}

/**
 * Create a simple Checkout Pro preference (one-time or first payment)
 * This is a simpler alternative that works immediately
 */
export async function createMPCheckoutPreference(params: {
  userId: number;
  userEmail: string;
  userName: string;
  planId: "publico" | "estudante" | "medico" | "professor";
  interval: "monthly" | "yearly";
  partnershipCode?: string;
  origin: string;
}): Promise<{ initPoint: string; preferenceId: string }> {
  const plan = MP_PLANS[params.planId];
  if (!plan) {
    throw new Error(`Plano inválido: ${params.planId}`);
  }

  const isYearly = params.interval === "yearly";
  const isPartnership = !!params.partnershipCode;

  let price: number;
  let intervalLabel: string;

  if (isPartnership && isYearly && plan.partnershipYearlyPrice > 0) {
    price = plan.partnershipYearlyPrice;
    intervalLabel = "Anual (Parceria 40% desc)";
  } else if (isYearly) {
    price = plan.yearlyPrice;
    intervalLabel = "Anual (20% desc)";
  } else {
    price = plan.monthlyPrice;
    intervalLabel = "Mensal";
  }

  console.log(`[MercadoPago] Creating checkout preference for user ${params.userId}, plan: ${params.planId}, price: R$${price}`);

  const preference = await mpFetch<MPPreferenceResponse>("/checkout/preferences", {
    method: "POST",
    body: JSON.stringify({
      items: [
        {
          id: `medfocus-${params.planId}-${params.interval}`,
          title: `${plan.title} (${intervalLabel})`,
          description: `${plan.description} - 7 dias grátis, depois R$ ${price.toFixed(2)}/${isYearly ? 'ano' : 'mês'}`,
          currency_id: "BRL",
          unit_price: price,
          quantity: 1,
        },
      ],
      payer: {
        email: params.userEmail,
        name: params.userName,
      },
      back_urls: {
        success: `${params.origin}/?payment=success&gateway=mercadopago`,
        failure: `${params.origin}/?payment=failed&gateway=mercadopago`,
        pending: `${params.origin}/?payment=pending&gateway=mercadopago`,
      },
      auto_return: "approved",
      external_reference: JSON.stringify({
        user_id: params.userId,
        plan: params.planId,
        interval: params.interval,
        partnership_code: params.partnershipCode || "",
      }),
      notification_url: `${params.origin}/api/mercadopago/webhook`,
      statement_descriptor: "MEDFOCUS",
      payment_methods: {
        excluded_payment_types: [],
        installments: 1,
      },
      metadata: {
        user_id: params.userId,
        plan: params.planId,
        interval: params.interval,
      },
    }),
  });

  console.log(`[MercadoPago] Preference created: ${preference.id}`);

  return {
    initPoint: preference.init_point,
    preferenceId: preference.id,
  };
}

/**
 * Get payment details by ID
 */
export async function getMPPayment(paymentId: string): Promise<MPPaymentResponse> {
  return mpFetch<MPPaymentResponse>(`/v1/payments/${paymentId}`);
}

/**
 * Get subscription details by ID
 */
export async function getMPSubscription(subscriptionId: string): Promise<MPSubscriptionResponse> {
  return mpFetch<MPSubscriptionResponse>(`/preapproval/${subscriptionId}`);
}

/**
 * Cancel a subscription
 */
export async function cancelMPSubscription(subscriptionId: string): Promise<void> {
  await mpFetch(`/preapproval/${subscriptionId}`, {
    method: "PUT",
    body: JSON.stringify({ status: "cancelled" }),
  });
  console.log(`[MercadoPago] Subscription ${subscriptionId} cancelled`);
}

/**
 * Process webhook notification from Mercado Pago
 */
export async function processMPWebhook(body: any): Promise<{
  action: string;
  userId?: number;
  planId?: string;
  status?: string;
  paymentId?: string;
}> {
  console.log(`[MercadoPago] Webhook received:`, JSON.stringify(body));

  const { type, data, action } = body;

  if (type === "payment") {
    const paymentId = data?.id;
    if (!paymentId) return { action: "ignored" };

    try {
      const payment = await getMPPayment(paymentId.toString());
      console.log(`[MercadoPago] Payment ${paymentId}: status=${payment.status}, amount=${payment.transaction_amount}`);

      let externalRef: any = {};
      try {
        externalRef = JSON.parse(payment.external_reference || "{}");
      } catch (e) {
        console.warn("[MercadoPago] Could not parse external_reference");
      }

      if (payment.status === "approved") {
        return {
          action: "payment_approved",
          userId: externalRef.user_id || payment.metadata?.user_id,
          planId: externalRef.plan || payment.metadata?.plan,
          status: "approved",
          paymentId: paymentId.toString(),
        };
      } else if (payment.status === "rejected" || payment.status === "cancelled") {
        return {
          action: "payment_failed",
          userId: externalRef.user_id,
          planId: externalRef.plan,
          status: payment.status,
          paymentId: paymentId.toString(),
        };
      }
    } catch (err: any) {
      console.error(`[MercadoPago] Error processing payment webhook:`, err.message);
    }
  }

  if (type === "subscription_preapproval" || type === "subscription_authorized_payment") {
    const subscriptionId = data?.id;
    if (!subscriptionId) return { action: "ignored" };

    try {
      const subscription = await getMPSubscription(subscriptionId.toString());
      console.log(`[MercadoPago] Subscription ${subscriptionId}: status=${subscription.status}`);

      let externalRef: any = {};
      try {
        externalRef = JSON.parse(subscription.external_reference || "{}");
      } catch (e) {
        console.warn("[MercadoPago] Could not parse external_reference");
      }

      if (subscription.status === "authorized") {
        return {
          action: "subscription_activated",
          userId: externalRef.user_id,
          planId: externalRef.plan,
          status: "active",
        };
      } else if (subscription.status === "paused" || subscription.status === "cancelled") {
        return {
          action: "subscription_cancelled",
          userId: externalRef.user_id,
          planId: externalRef.plan,
          status: subscription.status,
        };
      }
    } catch (err: any) {
      console.error(`[MercadoPago] Error processing subscription webhook:`, err.message);
    }
  }

  return { action: "ignored" };
}

/**
 * Verify if Mercado Pago is properly configured
 */
export function isMPConfigured(): boolean {
  return !!(ENV.mpAccessToken && ENV.mpPublicKey);
}
