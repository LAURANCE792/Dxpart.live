'use client';

interface TradingStatsProps {
  stats: any;
}

export default function TradingStats({ stats }: TradingStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
      <div className="bg-secondary/50 border border-gray-700 rounded-lg p-4">
        <div className="text-gray-400 text-sm mb-1">Total Trades</div>
        <div className="text-2xl font-bold text-white">{stats.totalTrades}</div>
      </div>
      <div className="bg-secondary/50 border border-gray-700 rounded-lg p-4">
        <div className="text-gray-400 text-sm mb-1">Open Trades</div>
        <div className="text-2xl font-bold text-yellow-400">{stats.openTrades}</div>
      </div>
      <div className="bg-secondary/50 border border-gray-700 rounded-lg p-4">
        <div className="text-gray-400 text-sm mb-1">Winning Trades</div>
        <div className="text-2xl font-bold text-green-400">{stats.winningTrades}</div>
      </div>
      <div className="bg-secondary/50 border border-gray-700 rounded-lg p-4">
        <div className="text-gray-400 text-sm mb-1">Losing Trades</div>
        <div className="text-2xl font-bold text-red-400">{stats.losingTrades}</div>
      </div>
      <div className="bg-secondary/50 border border-gray-700 rounded-lg p-4">
        <div className="text-gray-400 text-sm mb-1">Win Rate</div>
        <div className="text-2xl font-bold text-white">{stats.winRate.toFixed(2)}%</div>
      </div>
      <div className="bg-secondary/50 border border-gray-700 rounded-lg p-4">
        <div className="text-gray-400 text-sm mb-1">Total Profit</div>
        <div className={`text-2xl font-bold ${stats.totalProfit > 0 ? 'text-green-400' : 'text-red-400'}`}>${stats.totalProfit.toFixed(2)}</div>
      </div>
    </div>
  );
}
