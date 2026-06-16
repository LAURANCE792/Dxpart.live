import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MarketData {
  symbol: string;
  price: number;
  bidPrice: number;
  askPrice: number;
  percentChange24h: number;
}

interface Alert {
  _id: string;
  symbol: string;
  type: string;
  condition: string;
  isActive: boolean;
}

interface MarketState {
  marketData: MarketData[];
  alerts: Alert[];
  isScanning: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  marketData: [],
  alerts: [],
  isScanning: false,
  isLoading: false,
  error: null
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setMarketData: (state, action: PayloadAction<MarketData[]>) => {
      state.marketData = action.payload;
    },
    updateMarketData: (state, action: PayloadAction<MarketData>) => {
      const index = state.marketData.findIndex(m => m.symbol === action.payload.symbol);
      if (index !== -1) {
        state.marketData[index] = action.payload;
      } else {
        state.marketData.push(action.payload);
      }
    },
    setAlerts: (state, action: PayloadAction<Alert[]>) => {
      state.alerts = action.payload;
    },
    addAlert: (state, action: PayloadAction<Alert>) => {
      state.alerts.push(action.payload);
    },
    removeAlert: (state, action: PayloadAction<string>) => {
      state.alerts = state.alerts.filter(a => a._id !== action.payload);
    },
    setScanning: (state, action: PayloadAction<boolean>) => {
      state.isScanning = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { setMarketData, updateMarketData, setAlerts, addAlert, removeAlert, setScanning, setLoading, setError } = marketSlice.actions;
export default marketSlice.reducer;
