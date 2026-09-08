import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.get('/me', UserController.getCurrentUser);

export default router;

