import { Router } from 'express';
import { SearchController } from '../controllers/search.controller';

const router = Router();

router.get('/recent', SearchController.getRecent);
router.delete('/:id', SearchController.deleteOne);
router.delete('/', SearchController.clearAll);

export default router;
