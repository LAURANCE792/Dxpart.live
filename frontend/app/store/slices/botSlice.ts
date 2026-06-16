import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Bot {
  _id: string;
  name: string;
  strategy: string;
  symbol: string;
  status: 'active' | 'paused' | 'stopped';
  initialBalance: number;
  currentBalance: number;
  roi: number;
  winRate: number;
  totalTrades: number;
}

interface BotState {
  bots: Bot[];
  selectedBot: Bot | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: BotState = {
  bots: [],
  selectedBot: null,
  isLoading: false,
  error: null
};

const botSlice = createSlice({
  name: 'bot',
  initialState,
  reducers: {
    setBots: (state, action: PayloadAction<Bot[]>) => {
      state.bots = action.payload;
    },
    addBot: (state, action: PayloadAction<Bot>) => {
      state.bots.push(action.payload);
    },
    updateBot: (state, action: PayloadAction<Bot>) => {
      const index = state.bots.findIndex(b => b._id === action.payload._id);
      if (index !== -1) {
        state.bots[index] = action.payload;
      }
    },
    deleteBot: (state, action: PayloadAction<string>) => {
      state.bots = state.bots.filter(b => b._id !== action.payload);
    },
    setSelectedBot: (state, action: PayloadAction<Bot | null>) => {
      state.selectedBot = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setBots, addBot, updateBot, deleteBot, setSelectedBot, setLoading, setError } = botSlice.actions;
export default botSlice.reducer;
