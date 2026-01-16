import Link from 'next/link';
import { ArrowRight, PiggyBank, Smartphone, BarChart3, Shield, Zap, Globe } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="px-6 py-4">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-cinnamon-500 flex items-center justify-center">
              <span className="text-white font-bold">SL</span>
            </div>
            <span className="font-semibold text-stone-900 text-lg">SL Budget</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="hidden md:inline-flex text-stone-600 hover:text-stone-900 font-medium"
            >
              Demo
            </Link>
            <Link
              href="/dashboard"
              className="btn btn-primary"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cinnamon-100 text-cinnamon-700 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cinnamon-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cinnamon-500"></span>
            </span>
            Built for Sri Lanka
          </div>

          <h1 className="text-display text-stone-900 mb-6">
            Smart budgeting for{' '}
            <span className="text-gradient">your life</span>
          </h1>

          <p className="text-body-lg text-stone-600 mb-8 max-w-2xl mx-auto">
            The personal finance app designed for Sri Lankan life. Track expenses,
            manage budgets, and reach your savings goals — all in one beautiful app.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/dashboard" className="btn btn-primary btn-lg w-full sm:w-auto">
              Start Free
              <ArrowRight size={20} />
            </Link>
            <Link href="#features" className="btn btn-secondary btn-lg w-full sm:w-auto">
              See Features
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-stone-500">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-tea-500" />
              <span>Your data stays private</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-ocean-500" />
              <span>15 Sri Lankan banks supported</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-cinnamon-500" />
              <span>Works offline (PWA)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-h2 text-stone-900 mb-4">
              Everything you need to manage money
            </h2>
            <p className="text-body-lg text-stone-600 max-w-2xl mx-auto">
              Simple tools designed for how Sri Lankans actually manage their finances.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card card-padding card-hover">
              <div className="w-12 h-12 rounded-xl bg-cinnamon-100 flex items-center justify-center mb-4">
                <PiggyBank className="text-cinnamon-600" size={24} />
              </div>
              <h3 className="text-h4 text-stone-900 mb-2">Budget Tracking</h3>
              <p className="text-stone-600">
                Set monthly budgets for each category. Get alerts when you're close to limits.
                Know exactly where your money goes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card card-padding card-hover">
              <div className="w-12 h-12 rounded-xl bg-ocean-100 flex items-center justify-center mb-4">
                <Smartphone className="text-ocean-600" size={24} />
              </div>
              <h3 className="text-h4 text-stone-900 mb-2">Bank Import</h3>
              <p className="text-stone-600">
                Import statements from Commercial Bank, Sampath, HNB, BOC, and 11 more.
                CSV and PDF formats supported.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card card-padding card-hover">
              <div className="w-12 h-12 rounded-xl bg-tea-100 flex items-center justify-center mb-4">
                <BarChart3 className="text-tea-600" size={24} />
              </div>
              <h3 className="text-h4 text-stone-900 mb-2">Smart Insights</h3>
              <p className="text-stone-600">
                See spending patterns, get practical tips, and understand your finances
                with clear, actionable insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sri Lankan Context Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-12 bg-gradient-to-br from-stone-900 to-stone-800 text-white">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-h2 mb-4">Made for Sri Lanka</h2>
                <p className="text-stone-300 mb-6">
                  Not just another generic budget app. SL Budget understands the local context —
                  from LKR formatting to festival budgets to local bank integration.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="text-tea-400">✓</span>
                    <span>LKR currency with proper formatting</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-tea-400">✓</span>
                    <span>Sinhala & Tamil language support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-tea-400">✓</span>
                    <span>15 local bank statement formats</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-tea-400">✓</span>
                    <span>Festival budget planning (Avurudu, Vesak)</span>
                  </li>
                </ul>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="text-9xl">🇱🇰</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-cinnamon-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-h2 text-stone-900 mb-4">
            Start managing your money today
          </h2>
          <p className="text-body-lg text-stone-600 mb-8">
            Free to use. No credit card required. Your data stays on your device.
          </p>
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            Open Dashboard
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cinnamon-500 flex items-center justify-center">
                <span className="text-white font-bold text-xs">SL</span>
              </div>
              <span className="font-medium text-stone-600">SL Budget</span>
            </div>
            <p className="text-sm text-stone-500">
              Made with ❤️ in Sri Lanka • Open Source
            </p>
            <div className="flex items-center gap-6 text-sm text-stone-500">
              <a href="https://github.com/WAOmaster/sl-budget" className="hover:text-stone-900">
                GitHub
              </a>
              <a href="#" className="hover:text-stone-900">Privacy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
