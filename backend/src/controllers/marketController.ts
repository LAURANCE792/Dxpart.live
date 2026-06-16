import { Response } from 'express';
import MarketData from '../models/MarketData';
import Alert from '../models/Alert';
import { AuthRequest } from '../middleware/auth';

export const getMarketData = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol } = req.params;
    const marketData = await MarketData.findOne({ symbol }).sort({ timestamp: -1 });
    if (!marketData) {
      return res.status(404).json({ error: 'Market data not found' });
    }
    res.json(marketData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
};

export const getMarketHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol } = req.params;
    const { limit = 100 } = req.query;
    const history = await MarketData.find({ symbol }).sort({ timestamp: -1 }).limit(parseInt(limit as string));
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market history' });
  }
};

export const createAlert = async (req: AuthRequest, res: Response) => {
  try {
    const { symbol, type, condition, targetPrice } = req.body;
    const alert = new Alert({ userId: req.userId, symbol, type, condition, targetPrice });
    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
};

export const getAlerts = async (req: AuthRequest, res: Response) => {
  try {
    const alerts = await Alert.find({ userId: req.userId });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
};

export const deleteAlert = async (req: AuthRequest, res: Response) => {
  try {
    await Alert.deleteOne({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Alert deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
};

export const scanMarkets = async (req: AuthRequest, res: Response) => {
  try {
    const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'BTCUSD', 'ETHUSD'];
    const scanResults = await Promise.all(symbols.map(symbol => MarketData.findOne({ symbol }).sort({ timestamp: -1 })));
    res.json(scanResults);
  } catch (error) {
    res.status(500).json({ error: 'Failed to scan markets' });
  }
};
