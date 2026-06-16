'use client';

import { useEffect, useState } from 'react';
import { useBot } from '@/app/hooks/useBot';
import CreateBotForm from '@/app/components/CreateBotForm';

export default function BotsPage() {
  const { bots, getBots, createBot } = useBot();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    getBots();
  }, []);

  const handleCreateBot = async (botData: any) => {
    await createBot(botData);
    setShowForm(false);
    getBots();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Trading Bots</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Create Bot'}
        </button>
      </div>

      {showForm && <CreateBotForm onSubmit={handleCreateBot} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bots.map(bot => (
          <div key={bot._id} className="bg-secondary/50 border border-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-2">{bot.name}</h3>
            <p className="text-gray-400 mb-4">{bot.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-400">Strategy:</span> <span className="text-white font-semibold">{bot.strategy}</span></div>
              <div><span className="text-gray-400">Status:</span> <span className={`font-semibold ${bot.status === 'active' ? 'text-green-400' : 'text-gray-400'}`}>{bot.status}</span></div>
              <div><span className="text-gray-400">ROI:</span> <span className="text-white font-semibold">{bot.roi.toFixed(2)}%</span></div>
              <div><span className="text-gray-400">Win Rate:</span> <span className="text-white font-semibold">{bot.winRate.toFixed(2)}%</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
