import { Router } from 'express';
import { getMarketData, getMarketHistory, createAlert, getAlerts, deleteAlert, scanMarkets } from '../controllers/marketController';
import { authMiddleware } from '../middleware/auth';

const router = Router();
router.get('/data/:symbol', getMarketData);
router.get('/history/:symbol', getMarketHistory);
router.post('/scan', authMiddleware, scanMarkets);
router.post('/alerts', authMiddleware, createAlert);
router.get('/alerts', authMiddleware, getAlerts);
router.delete('/alerts/:id', authMiddleware, deleteAlert);

export default router;
