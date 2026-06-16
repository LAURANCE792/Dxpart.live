'use client';

import { useBot } from '@/app/hooks/useBot';

interface BotCardProps {
  bot: any;
}

export default function BotCard({ bot }: BotCardProps) {
  const { toggleBotStatus } = useBot();

  const handleToggle = async () => {
    const newStatus = bot.status === 'active' ? 'stopped' : 'active';
    await toggleBotStatus(bot._id, newStatus);
  };

  return (
    <div className="bg-secondary/50 border border-gray-700 rounded-lg p-6 hover:border-accent transition">
      <h3 className="text-lg font-semibold text-white mb-2">{bot.name}</h3>
      <p className="text-gray-400 text-sm mb-4">{bot.strategy} • {bot.symbol}</p>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">ROI:</span>
          <span className={bot.roi > 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>{bot.roi.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Win Rate:</span>
          <span className="text-white font-semibold">{bot.winRate.toFixed(2)}%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Trades:</span>
          <span className="text-white font-semibold">{bot.totalTrades}</span>
        </div>
      </div>

      <button
        onClick={handleToggle}
        className={`w-full py-2 rounded font-semibold transition ${
          bot.status === 'active'
            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
        }`}
      >
        {bot.status === 'active' ? 'Stop Bot' : 'Start Bot'}
      </button>
    </div>
  );
}
