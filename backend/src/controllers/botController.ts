import { Response } from 'express';
import Bot from '../models/Bot';
import { AuthRequest } from '../middleware/auth';

export const createBot = async (req: AuthRequest, res: Response) => {
  try {
    const { name, description, strategy, symbol, initialBalance, configuration } = req.body;
    const bot = new Bot({
      userId: req.userId,
      name, description, strategy, symbol, initialBalance,
      currentBalance: initialBalance,
      configuration,
      performanceMetrics: { totalProfit: 0, totalLoss: 0, winningTrades: 0, losingTrades: 0 }
    });
    await bot.save();
    res.status(201).json(bot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create bot' });
  }
};

export const getBots = async (req: AuthRequest, res: Response) => {
  try {
    const bots = await Bot.find({ userId: req.userId });
    res.json(bots);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bots' });
  }
};

export const getBot = async (req: AuthRequest, res: Response) => {
  try {
    const bot = await Bot.findById(req.params.id);
    if (!bot || bot.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Bot not found' });
    }
    res.json(bot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bot' });
  }
};

export const updateBot = async (req: AuthRequest, res: Response) => {
  try {
    const bot = await Bot.findById(req.params.id);
    if (!bot || bot.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Bot not found' });
    }
    Object.assign(bot, req.body);
    await bot.save();
    res.json(bot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bot' });
  }
};

export const deleteBot = async (req: AuthRequest, res: Response) => {
  try {
    const bot = await Bot.findById(req.params.id);
    if (!bot || bot.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Bot not found' });
    }
    await Bot.deleteOne({ _id: req.params.id });
    res.json({ message: 'Bot deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bot' });
  }
};

export const toggleBotStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const bot = await Bot.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(bot);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle bot status' });
  }
};
