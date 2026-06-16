import mongoose, { Schema, Document } from 'mongoose';

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId;
  symbol: string;
  type: 'price' | 'trend' | 'volume' | 'technical';
  condition: string;
  targetPrice?: number;
  isActive: boolean;
  isTriggered: boolean;
  createdAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    symbol: { type: String, required: true },
    type: { type: String, enum: ['price', 'trend', 'volume', 'technical'], required: true },
    condition: { type: String, required: true },
    targetPrice: Number,
    isActive: { type: Boolean, default: true },
    isTriggered: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model<IAlert>('Alert', alertSchema);
