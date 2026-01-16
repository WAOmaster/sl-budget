'use client';

import { PageHeader } from '@/components/layout';
import { Card, Button, Select, Input } from '@/components/ui';
import { User, Globe, Bell, Shield, Database, Moon } from 'lucide-react';

export default function SettingsPage() {
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
            <span className="text-cinnamon-700 text-2xl font-semibold">S</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-900">Sashi Perera</h2>
            <p className="text-sm text-stone-500">waoearth2013@gmail.com</p>
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
          <h3 className="font-semibold text-stone-900 flex items-center gap-2">
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
            defaultValue="en"
          />
          <Select
            label="Currency"
            options={[
              { value: 'LKR', label: 'Sri Lankan Rupee (Rs.)' },
              { value: 'USD', label: 'US Dollar ($)' },
              { value: 'EUR', label: 'Euro (€)' },
            ]}
            defaultValue="LKR"
          />
          <Select
            label="Date Format"
            options={[
              { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY (15/01/2026)' },
              { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY (01/15/2026)' },
              { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD (2026-01-15)' },
            ]}
            defaultValue="dd/mm/yyyy"
          />
        </div>
      </Card>

      {/* Notifications */}
      <Card className="mb-6" padding={false}>
        <div className="card-header">
          <h3 className="font-semibold text-stone-900 flex items-center gap-2">
            <Bell size={18} className="text-stone-500" />
            Notifications
          </h3>
        </div>
        <div className="card-body space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-900">Bill Reminders</p>
              <p className="text-sm text-stone-500">Get notified before bills are due</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cinnamon-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-900">Budget Alerts</p>
              <p className="text-sm text-stone-500">Alert when nearing budget limits</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cinnamon-500"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-900">Weekly Summary</p>
              <p className="text-sm text-stone-500">Receive weekly spending reports</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cinnamon-500"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="mb-6" padding={false}>
        <div className="card-header">
          <h3 className="font-semibold text-stone-900 flex items-center gap-2">
            <Moon size={18} className="text-stone-500" />
            Appearance
          </h3>
        </div>
        <div className="card-body">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-900">Dark Mode</p>
              <p className="text-sm text-stone-500">Switch to dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cinnamon-500"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Data & Privacy */}
      <Card className="mb-6" padding={false}>
        <div className="card-header">
          <h3 className="font-semibold text-stone-900 flex items-center gap-2">
            <Shield size={18} className="text-stone-500" />
            Data & Privacy
          </h3>
        </div>
        <div className="card-body space-y-3">
          <Button variant="secondary" className="w-full justify-start">
            <Database size={16} />
            Export All Data
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50">
            Delete Account
          </Button>
        </div>
      </Card>

      {/* Version Info */}
      <div className="text-center text-sm text-stone-400 py-4">
        <p>SL Budget v2.0.0</p>
        <p>Made with ❤️ in Sri Lanka</p>
      </div>
    </div>
  );
}
