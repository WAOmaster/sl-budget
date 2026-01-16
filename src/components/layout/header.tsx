'use client';

import { Bell, Menu } from 'lucide-react';
import { getGreeting } from '@/lib/utils';

interface HeaderProps {
  userName?: string;
  onMenuClick?: () => void;
}

export function Header({ userName = 'there', onMenuClick }: HeaderProps) {
  const greeting = getGreeting();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-stone-100">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 -ml-2 rounded-lg text-stone-600 hover:bg-stone-100"
        >
          <Menu size={24} />
        </button>

        {/* Greeting */}
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-stone-900">
            {greeting}, {userName}
          </h1>
        </div>

        {/* Mobile Logo */}
        <div className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cinnamon-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">SL</span>
          </div>
          <span className="font-semibold text-stone-900">SL Budget</span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors">
            <Bell size={20} />
            {/* Notification dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cinnamon-500 rounded-full" />
          </button>

          {/* Profile - Desktop */}
          <div className="hidden md:flex items-center gap-2 pl-2">
            <div className="w-8 h-8 rounded-full bg-cinnamon-100 flex items-center justify-center">
              <span className="text-cinnamon-700 text-sm font-medium">
                {userName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
