import { Response } from 'express';
import Trade from '../models/Trade';
import Bot from '../models/Bot';
import { AuthRequest } from '../middleware/auth';

export const createTrade = async (req: AuthRequest, res: Response) => {
  try {
    const { botId, symbol, type, entryPrice, quantity, stopLoss, takeProfit, reason } = req.body;
    const bot = await Bot.findById(botId);
    if (!bot || bot.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Bot not found' });
    }
    const trade = new Trade({
      botId, userId: req.userId, symbol, type, entryPrice, quantity, stopLoss, takeProfit, reason, status: 'open'
    });
    await trade.save();
    bot.totalTrades += 1;
    await bot.save();
    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trade' });
  }
};

export const getTrades = async (req: AuthRequest, res: Response) => {
  try {
    const { botId } = req.query;
    const query: any = { userId: req.userId };
    if (botId) query.botId = botId;
    const trades = await Trade.find(query).sort({ createdAt: -1 });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trades' });
  }
};

export const closeTrade = async (req: AuthRequest, res: Response) => {
  try {
    const { exitPrice } = req.body;
    const trade = await Trade.findById(req.params.id);
    if (!trade || trade.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    trade.exitPrice = exitPrice;
    trade.exitTime = new Date();
    trade.status = 'closed';
    trade.profit = trade.type === 'buy' ? (exitPrice - trade.entryPrice) * trade.quantity : (trade.entryPrice - exitPrice) * trade.quantity;
    trade.profitPercentage = (trade.profit / (trade.entryPrice * trade.quantity)) * 100;
    await trade.save();
    const bot = await Bot.findById(trade.botId);
    if (bot) {
      bot.currentBalance = (bot.currentBalance || 0) + (trade.profit || 0);
      bot.roi = ((bot.currentBalance - bot.initialBalance) / bot.initialBalance) * 100;
      if ((trade.profit || 0) > 0) {
        bot.performanceMetrics.winningTrades += 1;
        bot.performanceMetrics.totalProfit += trade.profit || 0;
      } else {
        bot.performanceMetrics.losingTrades += 1;
        bot.performanceMetrics.totalLoss += Math.abs(trade.profit || 0);
      }
      bot.winRate = (bot.performanceMetrics.winningTrades / (bot.performanceMetrics.winningTrades + bot.performanceMetrics.losingTrades)) * 100;
      await bot.save();
    }
    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: 'Failed to close trade' });
  }
};

export const getTrade = async (req: AuthRequest, res: Response) => {
  try {
    const trade = await Trade.findById(req.params.id);
    if (!trade || trade.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trade' });
  }
};

export const getTradingStats = async (req: AuthRequest, res: Response) => {
  try {
    const trades = await Trade.find({ userId: req.userId });
    const closedTrades = trades.filter(t => t.status === 'closed');
    const stats = {
      totalTrades: trades.length,
      openTrades: trades.filter(t => t.status === 'open').length,
      closedTrades: closedTrades.length,
      totalProfit: closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0),
      winningTrades: closedTrades.filter(t => (t.profit || 0) > 0).length,
      losingTrades: closedTrades.filter(t => (t.profit || 0) <= 0).length,
      winRate: closedTrades.length > 0 ? (closedTrades.filter(t => (t.profit || 0) > 0).length / closedTrades.length) * 100 : 0
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trading stats' });
  }
};
