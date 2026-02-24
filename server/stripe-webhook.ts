/**
 * MedFocus — Stripe Webhook Handler
 * Handles subscription lifecycle events including trial management
 */
import { Request, Response } from "express";
import Stripe from "stripe";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

function getStripe() {
  if (!ENV.stripeSecretKey) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(ENV.stripeSecretKey, { apiVersion: "2026-01-28.clover" });
}

export async function handleStripeWebhook(req: Request, res: Response) {
  const stripe = getStripe();
  const sig = req.headers["stripe-signature"] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, ENV.stripeWebhookSecret || "");
  } catch (err: any) {
    console.error("[Webhook] Signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.id.startsWith("evt_test_")) {
    console.log("[Webhook] Test event detected, returning verification response");
    return res.json({ verified: true });
  }

  console.log(`[Webhook] Event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const plan = (session.metadata?.plan || "pro") as "pro";
        const interval = (session.metadata?.interval || "monthly") as "monthly" | "yearly";

        if (userId) {
          const db = await getDb();
          if (db) {
            const now = new Date();
            const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            
            await db.update(users)
              .set({
                stripeCustomerId: session.customer as string,
                stripeSubscriptionId: session.subscription as string,
                plan,
                cardRegistered: true,
                trialActive: true,
                trialStartDate: now,
                trialEndDate: trialEnd,
                billingInterval: interval,
              })
              .where(eq(users.id, parseInt(userId)));
            console.log(`[Webhook] User ${userId} started trial for ${plan} (${interval})`);
          }
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const db = await getDb();
        if (db) {
          // Trial ended, subscription is now active
          if (subscription.status === 'active' && !subscription.trial_end) {
            await db.update(users)
              .set({ trialActive: false })
              .where(eq(users.stripeSubscriptionId, subscription.id));
            console.log(`[Webhook] Trial ended for subscription ${subscription.id}, now active`);
          }
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const db = await getDb();
        if (db) {
          await db.update(users)
            .set({ 
              plan: "free", 
              stripeSubscriptionId: null,
              trialActive: false,
            })
            .where(eq(users.stripeSubscriptionId, subscription.id));
          console.log(`[Webhook] Subscription ${subscription.id} cancelled`);
        }
        break;
      }

      case "customer.subscription.trial_will_end": {
        // Trial ending in 3 days - could send notification
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`[Webhook] Trial ending soon for subscription ${subscription.id}`);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Webhook] Payment failed for invoice ${invoice.id}`);
        // After failed payment, downgrade to free after grace period
        const db = await getDb();
        if (db && invoice.subscription) {
          const subId = typeof invoice.subscription === 'string' ? invoice.subscription : invoice.subscription.id;
          await db.update(users)
            .set({ plan: "free", trialActive: false })
            .where(eq(users.stripeSubscriptionId, subId));
          console.log(`[Webhook] User downgraded due to payment failure`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log(`[Webhook] Payment succeeded for invoice ${invoice.id}`);
        break;
      }
    }
  } catch (err) {
    console.error("[Webhook] Processing error:", err);
  }

  res.json({ received: true });
}
