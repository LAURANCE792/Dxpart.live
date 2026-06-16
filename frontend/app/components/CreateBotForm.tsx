'use client';

import { useState } from 'react';

interface CreateBotFormProps {
  onSubmit: (data: any) => Promise<void>;
}

export default function CreateBotForm({ onSubmit }: CreateBotFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    strategy: 'RSI',
    symbol: 'EURUSD',
    initialBalance: 1000,
    configuration: {
      riskPerTrade: 0.02,
      stopLoss: 50,
      takeProfit: 100,
      maxOpenPositions: 3
    }
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setFormData({
        name: '',
        description: '',
        strategy: 'RSI',
        symbol: 'EURUSD',
        initialBalance: 1000,
        configuration: {
          riskPerTrade: 0.02,
          stopLoss: 50,
          takeProfit: 100,
          maxOpenPositions: 3
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-secondary/50 border border-gray-700 rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-white mb-4">Create New Bot</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Bot Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="bg-primary/50 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-primary/50 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
        />
        <select
          value={formData.strategy}
          onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
          className="bg-primary/50 border border-gray-600 rounded px-4 py-2 text-white focus:outline-none focus:border-accent"
        >
          <option value="RSI">RSI</option>
          <option value="MACD">MACD</option>
          <option value="MovingAverage">Moving Average</option>
          <option value="BollingerBands">Bollinger Bands</option>
        </select>
        <input
          type="text"
          placeholder="Symbol (e.g., EURUSD)"
          value={formData.symbol}
          onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
          className="bg-primary/50 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
          required
        />
        <input
          type="number"
          placeholder="Initial Balance"
          value={formData.initialBalance}
          onChange={(e) => setFormData({ ...formData, initialBalance: parseFloat(e.target.value) })}
          className="bg-primary/50 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-accent"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-4 bg-accent text-white px-6 py-2 rounded font-semibold hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Bot'}
      </button>
    </form>
  );
}
