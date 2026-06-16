'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { setUser, setToken, setLoading, setError, logout } from '../store/slices/authSlice';
import api from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isLoading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const signup = async (email: string, password: string, username: string, firstName: string, lastName: string) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post('/api/auth/signup', { email, password, username, firstName, lastName });
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Signup failed'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const login = async (email: string, password: string) => {
    try {
      dispatch(setLoading(true));
      const response = await api.post('/api/auth/login', { email, password });
      dispatch(setToken(response.data.token));
      dispatch(setUser(response.data.user));
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Login failed'));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getProfile = async () => {
    try {
      const response = await api.get('/api/auth/profile');
      dispatch(setUser(response.data));
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Failed to fetch profile'));
      throw err;
    }
  };

  const updateProfile = async (data: any) => {
    try {
      const response = await api.put('/api/auth/profile', data);
      dispatch(setUser(response.data));
      return response.data;
    } catch (err: any) {
      dispatch(setError(err.response?.data?.error || 'Failed to update profile'));
      throw err;
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return { user, token, isLoading, error, isAuthenticated, signup, login, getProfile, updateProfile, logout: handleLogout };
};
