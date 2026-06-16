import mongoose, { Schema, Document } from 'mongoose';

export interface IBot extends Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  strategy: string;
  symbol: string;
  status: 'active' | 'paused' | 'stopped';
  initialBalance: number;
  currentBalance: number;
  roi: number;
  winRate: number;
  totalTrades: number;
  configuration: any;
  performanceMetrics: any;
  createdAt: Date;
  updatedAt: Date;
}

const botSchema = new Schema<IBot>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    strategy: { type: String, enum: ['RSI', 'MACD', 'MovingAverage', 'BollingerBands', 'Custom'], required: true },
    symbol: { type: String, required: true },
    status: { type: String, enum: ['active', 'paused', 'stopped'], default: 'stopped' },
    initialBalance: { type: Number, required: true },
    currentBalance: Number,
    roi: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    totalTrades: { type: Number, default: 0 },
    configuration: { type: Schema.Types.Mixed },
    performanceMetrics: {
      totalProfit: { type: Number, default: 0 },
      totalLoss: { type: Number, default: 0 },
      winningTrades: { type: Number, default: 0 },
      losingTrades: { type: Number, default: 0 },
      consecutiveWins: { type: Number, default: 0 },
      consecutiveLosses: { type: Number, default: 0 },
      averageWinSize: { type: Number, default: 0 },
      averageLossSize: { type: Number, default: 0 }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IBot>('Bot', botSchema);
