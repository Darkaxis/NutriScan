import { Router } from 'express';
import productRoutes from './product.routes';
import searchRoutes from './search.routes';
import stripeRoutes from './stripe.routes';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';

const router = Router();

router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Food System Backend API',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/searches', searchRoutes);
router.use('/stripe', stripeRoutes);
router.use('/user', userRoutes);

export default router;
