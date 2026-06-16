'use client';

import { useEffect } from 'react';
import { useTrade } from '@/app/hooks/useTrade';

export default function TradesPage() {
  const { trades, getTrades } = useTrade();

  useEffect(() => {
    getTrades();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Trading History</h1>
      <div className="bg-secondary/50 border border-gray-700 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-primary/50 border-b border-gray-700">
            <tr>
              <th className="text-left p-4 text-gray-300">Symbol</th>
              <th className="text-left p-4 text-gray-300">Type</th>
              <th className="text-left p-4 text-gray-300">Entry Price</th>
              <th className="text-left p-4 text-gray-300">Exit Price</th>
              <th className="text-left p-4 text-gray-300">Profit</th>
              <th className="text-left p-4 text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {trades.map(trade => (
              <tr key={trade._id} className="border-b border-gray-700 hover:bg-primary/30">
                <td className="p-4 text-white font-semibold">{trade.symbol}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{trade.type.toUpperCase()}</span></td>
                <td className="p-4 text-gray-300">${trade.entryPrice.toFixed(2)}</td>
                <td className="p-4 text-gray-300">${trade.exitPrice?.toFixed(2) || '-'}</td>
                <td className="p-4"><span className={trade.profit && trade.profit > 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>{trade.profit ? '$' + trade.profit.toFixed(2) : '-'}</span></td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-semibold ${trade.status === 'closed' ? 'bg-gray-500/20 text-gray-400' : 'bg-yellow-500/20 text-yellow-400'}`}>{trade.status.toUpperCase()}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
