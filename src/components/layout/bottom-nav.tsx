'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PiggyBank,
  Plus,
  Receipt,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Budget', href: '/dashboard/budgets', icon: PiggyBank },
  { name: 'Add', href: '#add', icon: Plus, isAction: true },
  { name: 'History', href: '/dashboard/transactions', icon: Receipt },
  { name: 'Profile', href: '/dashboard/settings', icon: User },
];

interface BottomNavProps {
  onAddClick?: () => void;
}

export function BottomNav({ onAddClick }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav md:hidden">
      {navigation.map((item) => {
        const isActive = item.href !== '#add' &&
          (pathname === item.href || pathname.startsWith(item.href + '/'));

        if (item.isAction) {
          return (
            <button
              key={item.name}
              onClick={onAddClick}
              className="flex flex-col items-center gap-1 -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-cinnamon-500 text-white flex items-center justify-center shadow-lg">
                <item.icon size={24} />
              </div>
            </button>
          );
        }

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              'bottom-nav-item',
              isActive && 'bottom-nav-item-active'
            )}
          >
            <item.icon size={20} />
            <span className="bottom-nav-label">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
