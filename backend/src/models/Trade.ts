import mongoose, { Schema, Document } from 'mongoose';

export interface ITrade extends Document {
  botId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  status: 'open' | 'closed';
  profit?: number;
  profitPercentage?: number;
  entryTime: Date;
  exitTime?: Date;
  stopLoss: number;
  takeProfit: number;
  reason: string;
  createdAt: Date;
}

const tradeSchema = new Schema<ITrade>(
  {
    botId: { type: Schema.Types.ObjectId, ref: 'Bot', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    type: { type: String, enum: ['buy', 'sell'], required: true },
    entryPrice: { type: Number, required: true },
    exitPrice: Number,
    quantity: { type: Number, required: true },
    status: { type: String, enum: ['open', 'closed'], default: 'open' },
    profit: Number,
    profitPercentage: Number,
    entryTime: { type: Date, default: Date.now },
    exitTime: Date,
    stopLoss: Number,
    takeProfit: Number,
    reason: String
  },
  { timestamps: true }
);

export default mongoose.model<ITrade>('Trade', tradeSchema);
