import { Router } from 'express';
import { createTrade, getTrades, closeTrade, getTrade, getTradingStats } from '../controllers/tradeController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.use(authMiddleware);
router.post('/', createTrade);
router.get('/', getTrades);
router.get('/stats', getTradingStats);
router.get('/:id', getTrade);
router.patch('/:id/close', closeTrade);

export default router;
