import Bot from '../models/Bot';
import MarketData from '../models/MarketData';

class BotService {
  async analyzeTechnicalIndicators(symbol: string, strategy: string) {
    try {
      const recentData = await MarketData.find({ symbol }).sort({ timestamp: -1 }).limit(50);
      if (strategy === 'RSI') {
        return this.calculateRSI(recentData);
      } else if (strategy === 'MACD') {
        return this.calculateMACD(recentData);
      } else if (strategy === 'MovingAverage') {
        return this.calculateMovingAverages(recentData);
      } else if (strategy === 'BollingerBands') {
        return this.calculateBollingerBands(recentData);
      }
    } catch (error) {
      console.error('Error analyzing indicators:', error);
      throw error;
    }
  }

  private calculateRSI(data: any[]) {
    const prices = data.map(d => d.price).reverse();
    const period = 14;
    let gains = 0, losses = 0;
    for (let i = 1; i < period; i++) {
      const diff = prices[i] - prices[i - 1];
      if (diff > 0) gains += diff;
      else losses += Math.abs(diff);
    }
    const avgGain = gains / period;
    const avgLoss = losses / period;
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));
    return { rsi, signal: rsi > 70 ? 'OVERBOUGHT' : rsi < 30 ? 'OVERSOLD' : 'NEUTRAL' };
  }

  private calculateMACD(data: any[]) {
    const prices = data.map(d => d.price).reverse();
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macd = ema12 - ema26;
    return { macd, ema12, ema26, signal: macd > 0 ? 'BUY' : 'SELL' };
  }

  private calculateMovingAverages(data: any[]) {
    const prices = data.map(d => d.price).reverse();
    const sma20 = prices.slice(0, 20).reduce((a, b) => a + b) / 20;
    const sma50 = prices.slice(0, 50).reduce((a, b) => a + b) / 50;
    return { sma20, sma50, signal: sma20 > sma50 ? 'BUY' : 'SELL' };
  }

  private calculateBollingerBands(data: any[]) {
    const prices = data.map(d => d.price).reverse();
    const period = 20;
    const sma = prices.slice(0, period).reduce((a, b) => a + b) / period;
    const variance = prices.slice(0, period).reduce((acc, p) => acc + Math.pow(p - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    const upper = sma + stdDev * 2;
    const lower = sma - stdDev * 2;
    return { upper, middle: sma, lower, signal: prices[0] > upper ? 'SELL' : prices[0] < lower ? 'BUY' : 'HOLD' };
  }

  private calculateEMA(prices: number[], period: number): number {
    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b) / period;
    for (let i = period; i < prices.length; i++) {
      ema = prices[i] * multiplier + ema * (1 - multiplier);
    }
    return ema;
  }

  async executeBot(botId: string) {
    try {
      const bot = await Bot.findById(botId);
      if (!bot || bot.status !== 'active') return;
      const analysis = await this.analyzeTechnicalIndicators(bot.symbol, bot.strategy);
      return analysis;
    } catch (error) {
      console.error('Error executing bot:', error);
      throw error;
    }
  }
}

export default new BotService();
