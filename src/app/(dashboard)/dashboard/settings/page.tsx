'use client';

import { PageHeader } from '@/components/layout';
import { Card, Button, Select } from '@/components/ui';
import { useTheme } from '@/components/providers';
import { useAppStore } from '@/stores/app-store';
import { User, Globe, Bell, Shield, Database, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, preferences, updatePreferences } = useAppStore();

  const handleNotificationToggle = (key: keyof typeof preferences.notifications) => {
    updatePreferences({
      notifications: {
        ...preferences.notifications,
        [key]: !preferences.notifications[key],
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <PageHeader
        title="Settings"
        subtitle="Manage your preferences"
      />

      {/* Profile Section */}
      <Card className="mb-6" padding>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-cinnamon-100 flex items-center justify-center">
            <span className="text-cinnamon-700 text-2xl font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
              {user?.name || 'User'}
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>
        <Button variant="secondary" className="w-full">
          <User size={16} />
          Edit Profile
        </Button>
      </Card>

      {/* Preferences */}
      <Card className="mb-6" padding={false}>
        <div className="card-header">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Globe size={18} className="text-stone-500" />
            Preferences
          </h3>
        </div>
        <div className="card-body space-y-4">
          <Select
            label="Language / භාෂාව / மொழி"
            options={[
              { value: 'en', label: 'English' },
              { value: 'si', label: 'සිංහල (Sinhala)' },
              { value: 'ta', label: 'தமிழ் (Tamil)' },
            ]}
            value={preferences.language}
            onChange={(e) => updatePreferences({ language: e.target.value as 'en' | 'si' | 'ta' })}
          />
          <Select
            label="Currency"
            options={[
              { value: 'LKR', label: 'Sri Lankan Rupee (Rs.)' },
              { value: 'USD', label: 'US Dollar ($)' },
              { value: 'EUR', label: 'Euro (€)' },
            ]}
            value={preferences.currency}
            onChange={(e) => updatePreferences({ currency: e.target.value })}
          />
        </div>
      </Card>

      {/* Notifications */}
      <Card className="mb-6" padding={false}>
        <div className="card-header">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Bell size={18} className="text-stone-500" />
            Notifications
          </h3>
        </div>
        <div className="card-body space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-900 dark:text-stone-100">Bill Reminders</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">Get notified before bills are due</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.billReminders}
                onChange={() => handleNotificationToggle('billReminders')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cinnamon-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-900 dark:text-stone-100">Budget Alerts</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">Alert when nearing budget limits</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.budgetAlerts}
                onChange={() => handleNotificationToggle('budgetAlerts')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cinnamon-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-900 dark:text-stone-100">Weekly Summary</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">Receive weekly spending reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications.weeklySummary}
                onChange={() => handleNotificationToggle('weeklySummary')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-200 dark:bg-stone-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cinnamon-500"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="mb-6" padding={false}>
        <div className="card-header">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            {resolvedTheme === 'dark' ? (
              <Moon size={18} className="text-stone-500" />
            ) : (
              <Sun size={18} className="text-stone-500" />
            )}
            Appearance
          </h3>
        </div>
        <div className="card-body">
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-3">Choose your preferred theme</p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme === 'light'
                  ? 'border-cinnamon-500 bg-cinnamon-50 dark:bg-cinnamon-900/20'
                  : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
              }`}
            >
              <Sun size={20} className="mx-auto mb-2 text-amber-500" />
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Light</p>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme === 'dark'
                  ? 'border-cinnamon-500 bg-cinnamon-50 dark:bg-cinnamon-900/20'
                  : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
              }`}
            >
              <Moon size={20} className="mx-auto mb-2 text-indigo-500" />
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100">Dark</p>
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`p-4 rounded-xl border-2 transition-all ${
                theme === 'system'
                  ? 'border-cinnamon-500 bg-cinnamon-50 dark:bg-cinnamon-900/20'
                  : 'border-stone-200 dark:border-stone-700 hover:border-stone-300'
              }`}
            >
              <div className="flex justify-center mb-2">
                <Sun size={14} className="text-amber-500" />
                <Moon size={14} className="text-indigo-500 -ml-1" />
              </div>
              <p className="text-sm font-medium text-stone-900 dark:text-stone-100">System</p>
            </button>
          </div>
        </div>
      </Card>

      {/* Data & Privacy */}
      <Card className="mb-6" padding={false}>
        <div className="card-header">
          <h3 className="font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Shield size={18} className="text-stone-500" />
            Data & Privacy
          </h3>
        </div>
        <div className="card-body space-y-3">
          <Button variant="secondary" className="w-full justify-start">
            <Database size={16} />
            Export All Data
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
            Delete Account
          </Button>
        </div>
      </Card>

      {/* Version Info */}
      <div className="text-center text-sm text-stone-400 py-4">
        <p>SL Budget v2.0.0</p>
        <p>Made with love in Sri Lanka</p>
      </div>
    </div>
  );
}
