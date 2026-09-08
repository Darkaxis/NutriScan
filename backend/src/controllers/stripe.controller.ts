import { Request, Response, NextFunction } from 'express';
import { StripeService } from '../services/stripe.service';
import { AuthService } from '../services/auth.service';
import prisma from '../config/db';

export class StripeController {
  public static async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'You must be logged in to create a subscription checkout session.',
        });
      }

      const checkoutUrl = await StripeService.createCheckoutSession(req.user.id);
      return res.json({ checkoutUrl });
    } catch (error: any) {
      next(error);
    }
  }

  public static async verifySession(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'You must be logged in to verify your checkout session.',
        });
      }

      const { sessionId } = req.body;
      if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({
          error: 'BadRequest',
          message: 'A valid sessionId string is required.',
        });
      }

      const verified = await StripeService.verifyCheckoutSession(sessionId, req.user.id);
      if (!verified) {
        return res.status(400).json({
          error: 'PaymentVerificationFailed',
          message: 'Could not verify that the Stripe checkout session was completed.',
        });
      }

      await AuthService.updateSubscription(req.user.id, 'ACTIVE');
      return res.json({ success: true, isSubscribed: true });
    } catch (error) {
      next(error);
    }
  }

  public static async cancelSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({
          error: 'Unauthorized',
          message: 'You must be logged in to cancel your subscription.',
        });
      }

      await StripeService.cancelSubscription(req.user.id);
      await AuthService.updateSubscription(req.user.id, 'CANCELED');

      return res.json({
        success: true,
        isSubscribed: false,
        message: 'Subscription canceled successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async handleWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'] as string;

    try {
      const result = await StripeService.processWebhook(req.body, sig || '');
      return res.json({ received: true, event: result.eventType });
    } catch (err: any) {
      console.error('Webhook error:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }
}
