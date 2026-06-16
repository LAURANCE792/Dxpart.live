'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setBots, addBot, updateBot, deleteBot, setSelectedBot, setLoading, setError } from '../store/slices/botSlice';
import api from '../services/api';

export const useBot = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bots, selectedBot, isLoading, error } = useSelector((state: RootState) => state.bot);

  const getBots = async () => {
    try {
      dispatch(setLoading(true));
      const response = await api.get('/api/bots');
      dispatch(setBots(response.data));
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Failed to fetch bots'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const createBot = async (botData: any) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post('/api/bots', botData);
      dispatch(addBot(response.data));
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Failed to create bot'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const updateBotData = async (id: string, botData: any) => {
    try {
      const response = await api.put(`/api/bots/${id}`, botData);
      dispatch(updateBot(response.data));
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Failed to update bot'));
      throw err;
    }
  };

  const deleteBot = async (id: string) => {
    try {
      await api.delete(`/api/bots/${id}`);
      dispatch(deleteBot(id));
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Failed to delete bot'));
      throw err;
    }
  };

  const toggleBotStatus = async (id: string, status: string) => {
    try {
      const response = await api.patch(`/api/bots/${id}/status`, { status });
      dispatch(updateBot(response.data));
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Failed to toggle bot status'));
      throw err;
    }
  };

  return { bots, selectedBot, isLoading, error, getBots, createBot, updateBot: updateBotData, deleteBot, toggleBotStatus, setSelectedBot: (bot) => dispatch(setSelectedBot(bot)) };
};
