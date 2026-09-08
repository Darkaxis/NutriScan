import { Router } from 'express';
import { ProductController } from '../controllers/product.controller';
import { requireSubscription } from '../middlewares/subscriptionCheck.middleware';
import { searchRateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.get('/search', searchRateLimiter, ProductController.search);
router.get('/:barcode', ProductController.getByBarcode);
router.get('/:barcode/nutrition', requireSubscription, ProductController.getNutrition);

export default router;
