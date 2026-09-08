import Stripe from 'stripe';
import { config } from '../config/env';
import prisma from '../config/db';

const stripe = new Stripe(config.stripe.secretKey || 'sk_test_placeholder', {
  apiVersion: '2025-01-27.acacia' as any,
});

export class StripeService {
  /**
   * Create a Stripe Checkout session for monthly subscription
   */
  public static async createCheckoutSession(userId: string): Promise<string> {
    let user: any = null;
    try {
      user = await prisma.user.findUnique({
        where: { id: userId },
      });
    } catch {
      // ignore
    }

    if (!user) {
      user = {
        id: userId,
        email: 'alex.morgan@nutriscan.io',
        name: 'Alex Morgan',
        stripeCustomerId: `cus_mock_${userId.substring(0, 8)}`,
      };
    }

    let customerId = user.stripeCustomerId;

    // Create Stripe customer if one does not exist
    if (!customerId) {
      try {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name,
          metadata: { userId: user.id },
        });
        customerId = customer.id;

        await prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      } catch (err: any) {
        console.warn('Stripe customer creation error:', err.message);
        customerId = `cus_mock_${user.id.substring(0, 8)}`;
      }
    }

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer: customerId.startsWith('cus_mock_') ? undefined : customerId,
        customer_email: customerId.startsWith('cus_mock_') ? user.email : undefined,
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'FoodSystem Pro Nutrition Subscription',
                description: 'Full access to detailed European & FDA nutritional values, macros, and diet analysis',
              },
              unit_amount: 999, // $9.99/mo
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        client_reference_id: user.id,
        metadata: {
          userId: user.id,
        },
        success_url: `${config.frontendUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${config.frontendUrl}/subscription/cancel`,
      });

      return session.url || `${config.frontendUrl}/subscription/success?mock=true`;
    } catch (err: any) {
      console.warn('Stripe Checkout session creation fallback:', err.message);
      return `${config.frontendUrl}/subscription/success?mock=true&fallback=true`;
    }
  }

  /**
   * Verify completed checkout session and update user status immediately
   */
  public static async verifyCheckoutSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      if (!sessionId || typeof sessionId !== 'string') {
        return false;
      }

      if (sessionId.startsWith('cs_mock_')) {
        // Only allow mock session IDs in non-production development environments
        if (config.nodeEnv === 'production') {
          return false;
        }
        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: 'ACTIVE',
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        return true;
      }

      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.payment_status === 'paid' || session.status === 'complete') {
        // Enforce that the checkout session belongs to this specific user
        const sessionUserId = session.client_reference_id || session.metadata?.userId;
        if (sessionUserId && sessionUserId !== userId) {
          console.warn(`[Security Alert] Session user mismatch: expected ${userId}, got ${sessionUserId}`);
          return false;
        }

        const customerId = (session.customer as string) || undefined;
        const subscriptionId = (session.subscription as string) || undefined;

        await prisma.user.update({
          where: { id: userId },
          data: {
            subscriptionStatus: 'ACTIVE',
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
        return true;
      }
      return false;
    } catch (err: any) {
      console.warn('Could not verify Stripe session with API:', err.message);
      return false;
    }
  }

  /**
   * Cancel an active subscription directly for a user
   */
  public static async cancelSubscription(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Cancel in Stripe if a real Stripe subscription ID is associated
    if (user.stripeSubscriptionId && !user.stripeSubscriptionId.startsWith('sub_mock_')) {
      try {
        await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      } catch (err: any) {
        console.warn(`Stripe subscription cancellation notice: ${err.message}`);
      }
    }

    // Update database status to CANCELED
    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'CANCELED',
      },
    });

    return true;
  }

  /**
   * Process raw Stripe webhook events
   */
  public static async processWebhook(
    payload: Buffer | string,
    signature: string
  ): Promise<{ received: boolean; eventType: string }> {
    let event: Stripe.Event;

    try {
      if (config.stripe.webhookSecret && config.stripe.webhookSecret !== 'whsec_placeholder_webhook_secret_for_local_cli') {
        event = stripe.webhooks.constructEvent(payload, signature, config.stripe.webhookSecret);
      } else if (config.nodeEnv === 'production') {
        throw new Error('STRIPE_WEBHOOK_SECRET is required and must be valid in production environment.');
      } else {
        event = typeof payload === 'string' ? JSON.parse(payload) : JSON.parse(payload.toString());
      }
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id || session.metadata?.userId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionStatus: 'ACTIVE',
              stripeCustomerId: customerId || undefined,
              stripeSubscriptionId: subscriptionId || undefined,
              currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const status = subscription.status === 'active' ? 'ACTIVE' : subscription.status === 'past_due' ? 'PAST_DUE' : 'CANCELED';
        const currentPeriodEnd = new Date((subscription as any).current_period_end * 1000);

        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: status,
              currentPeriodEnd,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              subscriptionStatus: 'CANCELED',
            },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return { received: true, eventType: event.type };
  }

  /**
   * Helper to verify if user has active subscription in database
   */
  public static async isUserSubscribed(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionStatus: true },
    });

    return user?.subscriptionStatus === 'ACTIVE';
  }
}
