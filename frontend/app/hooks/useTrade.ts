'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setTrades, addTrade, updateTrade, setStats, setLoading, setError } from '../store/slices/tradeSlice';
import api from '../services/api';

export const useTrade = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { trades, stats, isLoading, error } = useSelector((state: RootState) => state.trade);

  const getTrades = async (botId?: string) => {
    try {
      dispatch(setLoading(true));
      const response = await api.get('/api/trades', { params: { botId } });
      dispatch(setTrades(response.data));
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Failed to fetch trades'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createTrade = async (tradeData: any) => {
    try {
      const response = await api.post('/api/trades', tradeData);
      dispatch(addTrade(response.data));
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Failed to create trade'));
      throw err;
    }
  };

  const closeTrade = async (id: string, exitPrice: number) => {
    try {
      const response = await api.patch(`/api/trades/${id}/close`, { exitPrice });
      dispatch(updateTrade(response.data));
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Failed to close trade'));
      throw err;
    }
  };

  const getTradingStats = async () => {
    try {
      const response = await api.get('/api/trades/stats');
      dispatch(setStats(response.data));
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Failed to fetch stats'));
      throw err;
    }
  };

  return { trades, stats, isLoading, error, getTrades, createTrade, closeTrade, getTradingStats };
};
