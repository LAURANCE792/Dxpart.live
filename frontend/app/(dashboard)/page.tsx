'use client';

import { useEffect } from 'react';
import { useBot } from '@/app/hooks/useBot';
import { useTrade } from '@/app/hooks/useTrade';
import BotCard from '@/app/components/BotCard';
import TradingStats from '@/app/components/TradingStats';

export default function DashboardPage() {
  const { bots, getBots } = useBot();
  const { getTradingStats, stats } = useTrade();

  useEffect(() => {
    getBots();
    getTradingStats();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      
      {stats && <TradingStats stats={stats} />}
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-4">Your Bots</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bots.map(bot => (
            <BotCard key={bot._id} bot={bot} />
          ))}
        </div>
      </div>
    </div>
  );
}
