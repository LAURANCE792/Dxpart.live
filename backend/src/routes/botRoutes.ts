import { Router } from 'express';
import { createBot, getBots, getBot, updateBot, deleteBot, toggleBotStatus } from '../controllers/botController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);
router.post('/', createBot);
router.get('/', getBots);
router.get('/:id', getBot);
router.put('/:id', updateBot);
router.delete('/:id', deleteBot);
router.patch('/:id/status', toggleBotStatus);

export default router;
