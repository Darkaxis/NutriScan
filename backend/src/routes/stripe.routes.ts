import { Router } from 'express';
import { StripeController } from '../controllers/stripe.controller';

const router = Router();

router.post('/create-checkout-session', StripeController.createCheckoutSession);
router.post('/verify-session', StripeController.verifySession);
router.post('/cancel-subscription', StripeController.cancelSubscription);

export default router;
