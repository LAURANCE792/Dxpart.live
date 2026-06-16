import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Trade {
  _id: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  exitPrice?: number;
  status: 'open' | 'closed';
  profit?: number;
  profitPercentage?: number;
  entryTime: string;
  exitTime?: string;
}

interface TradingStats {
  totalTrades: number;
  openTrades: number;
  closedTrades: number;
  totalProfit: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
}

interface TradeState {
  trades: Trade[];
  stats: TradingStats | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TradeState = {
  trades: [],
  stats: null,
  isLoading: false,
  error: null
};

const tradeSlice = createSlice({
  name: 'trade',
  initialState,
  reducers: {
    setTrades: (state, action: PayloadAction<Trade[]>) => {
      state.trades = action.payload;
    },
    addTrade: (state, action: PayloadAction<Trade>) => {
      state.trades.push(action.payload);
    },
    updateTrade: (state, action: PayloadAction<Trade>) => {
      const index = state.trades.findIndex(t => t._id === action.payload._id);
      if (index !== -1) {
        state.trades[index] = action.payload;
      }
    },
    setStats: (state, action: PayloadAction<TradingStats>) => {
      state.stats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setTrades, addTrade, updateTrade, setStats, setLoading, setError } = tradeSlice.actions;
export default tradeSlice.reducer;
