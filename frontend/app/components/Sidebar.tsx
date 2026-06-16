'use client';

import { FiHome, FiTrendingUp, FiActivity, FiMessageSquare, FiLogOut, FiGitlab } from 'react-icons/fi';
import Link from 'next/link';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', href: '/dashboard' },
    { icon: FiTrendingUp, label: 'Bots', href: '/dashboard/bots' },
    { icon: FiActivity, label: 'Trades', href: '/dashboard/trades' },
    { icon: FiMessageSquare, label: 'Chat', href: '/dashboard/chat' }
  ];

  return (
    <div className="w-64 bg-primary border-r border-gray-700 p-4 flex flex-col">
      <div className="text-2xl font-bold text-accent mb-8 flex items-center gap-2">
        <FiGitlab size={28} />
        DXPart
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map(item => (
          <Link key={item.href} href={item.href}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/50 text-gray-300 hover:text-white transition cursor-pointer">
              <item.icon size={20} />
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/20 text-gray-300 hover:text-red-400 transition w-full"
      >
        <FiLogOut size={20} />
        <span>Logout</span>
      </button>
    </div>
  );
}
