import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketData extends Document {
  symbol: string;
  price: number;
  bidPrice: number;
  askPrice: number;
  high24h: number;
  low24h: number;
  volume24h: number;
  percentChange24h: number;
  timestamp: Date;
}

const marketDataSchema = new Schema<IMarketData>(
  {
    symbol: { type: String, required: true, index: true },
    price: { type: Number, required: true },
    bidPrice: Number,
    askPrice: Number,
    high24h: Number,
    low24h: Number,
    volume24h: Number,
    percentChange24h: Number,
    timestamp: { type: Date, default: Date.now, expires: 86400 }
  },
  { timestamps: true }
);

export default mongoose.model<IMarketData>('MarketData', marketDataSchema);
