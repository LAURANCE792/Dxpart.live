'use client';

import { useAuth } from '@/app/hooks/useAuth';
import { FiBell, FiUser } from 'react-icons/fi';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-secondary border-b border-gray-700 px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-white">DXPart Trading Platform</h1>
      <div className="flex items-center gap-4">
        <button className="text-gray-400 hover:text-white">
          <FiBell size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-white font-semibold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <span className="text-gray-300">{user?.username}</span>
        </div>
      </div>
    </header>
  );
}
