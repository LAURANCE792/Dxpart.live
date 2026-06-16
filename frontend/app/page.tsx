'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary">
      <nav className="bg-black/50 backdrop-blur-md border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-accent">DXPart.live</div>
          <div className="flex gap-4">
            <Link href="#features" className="text-gray-300 hover:text-white">Features</Link>
            <button className="bg-accent text-white px-6 py-2 rounded-lg hover:bg-blue-600">Login</button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-5xl font-bold text-white mb-6">Advanced Deriv Trading Platform</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Professional trading tools, real-time analytics, automated bots, and community insights.
        </p>
        <button className="bg-accent text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-600">Get Started Free</button>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h2 className="text-4xl font-bold text-white text-center mb-16">Powerful Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { title: '📊 Analysis Tools', desc: 'Advanced technical indicators and charting' },
            { title: '💰 Live Data', desc: 'Real-time price feeds and market data' },
            { title: '🤖 Trading Bots', desc: 'Automated trading strategies' },
            { title: '🔍 Market Scanner', desc: 'Scan and monitor markets in real-time' },
            { title: '🛠️ Bot Builder', desc: 'Create custom trading strategies' },
            { title: '💬 Trading Chat', desc: 'Community and trading discussions' }
          ].map((feature, i) => (
            <div key={i} className="bg-secondary/50 backdrop-blur-sm border border-gray-700 p-6 rounded-lg hover:border-accent">
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-black/50 border-t border-gray-700 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-gray-400">
          <p>&copy; 2024 DXPart. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
