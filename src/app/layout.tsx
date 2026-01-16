import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'SL Budget - Personal Finance Manager for Sri Lanka',
  description: 'Smart budgeting app designed for Sri Lankan life. Track expenses, manage budgets, import bank statements, and reach your savings goals.',
  keywords: ['budget', 'finance', 'sri lanka', 'expense tracker', 'money management', 'LKR'],
  authors: [{ name: 'Sashi Perera' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SL Budget',
  },
};

export const viewport: Viewport = {
  themeColor: '#e87a1b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider defaultTheme="system" storageKey="sl-budget-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
