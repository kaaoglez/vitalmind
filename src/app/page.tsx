'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTranslation, Locale } from '@/lib/i18n/context';
import { LogEntry, LogData, InsightItem, RecommendationItem, calculateVitalScore } from '@/lib/vitalscore';
import Landing from '@/components/vitalmind/Landing';
import Auth from '@/components/vitalmind/Auth';
import Dashboard from '@/components/vitalmind/Dashboard';
import QuickLog from '@/components/vitalmind/QuickLog';
import Insights from '@/components/vitalmind/Insights';
import Recommendations from '@/components/vitalmind/Recommendations';
import Progress from '@/components/vitalmind/Progress';
import Achievements from '@/components/vitalmind/Achievements';
import Celebrations from '@/components/vitalmind/Celebrations';
import { CrisisButton } from '@/components/vitalmind/CrisisButton';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import {
  LayoutDashboard,
  PenLine,
  TrendingUp,
  Trophy,
  Lightbulb,
  Target,
  Heart,
  LogOut,
  Globe,
  Check,
} from 'lucide-react';

// ── Language Selector (minimal: globe + 2 letters, auto-close on select) ──
function MinimalLanguageSelector({
  locale,
  setLocale,
  localeFlags,
  localeNames,
  locales,
  t,
  variant = 'light',
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
  localeFlags: Record<Locale, string>;
  localeNames: Record<Locale, string>;
  locales: Locale[];
  t: (key: string) => string;
  variant?: 'light' | 'dark';
}) {
  const [open, setOpen] = useState(false);

  const handleSelect = (loc: Locale) => {
    setLocale(loc);
    setOpen(false);
  };

  const isDark = variant === 'dark';
  const triggerClass = isDark
    ? 'flex items-center gap-1 h-8 px-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white backdrop-blur-sm transition-colors text-xs font-medium'
    : 'flex items-center gap-1 h-8 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors text-xs font-medium';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={triggerClass}
          aria-label={t('general.language.title')}
          title={t('general.language.title')}
        >
          <Globe className="w-3.5 h-3.5" />
          <span className="uppercase">{locale.slice(0, 2)}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-1.5" align="end">
        <div className="space-y-0.5">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => handleSelect(loc)}
              className={
                locale === loc
                  ? 'flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm transition-colors bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-medium'
                  : 'flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground'
              }
            >
              <span className="text-base">{localeFlags[loc]}</span>
              <span className="flex-1 text-left">{localeNames[loc]}</span>
              {locale === loc && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ── Types ──────────────────────────────────────────────────────────────
type AppView = 'landing' | 'auth' | 'app';
type AppTab = 'dashboard' | 'log' | 'progress' | 'achievements' | 'insights' | 'recommendations';

// ── Tab definitions ────────────────────────────────────────────────────
const TAB_CONFIG: { id: AppTab; icon: React.ElementType; labelKey: string }[] = [
  { id: 'dashboard', icon: LayoutDashboard, labelKey: 'general.nav.dashboard' },
  { id: 'log', icon: PenLine, labelKey: 'general.nav.register' },
  { id: 'progress', icon: TrendingUp, labelKey: 'general.nav.progress' },
  { id: 'achievements', icon: Trophy, labelKey: 'general.nav.achievements' },
  { id: 'insights', icon: Lightbulb, labelKey: 'general.nav.insights' },
  { id: 'recommendations', icon: Target, labelKey: 'general.nav.plan' },
];

// ── Main Component ─────────────────────────────────────────────────────
export default function VitalMindApp() {
  const { t, locale, setLocale, localeFlags, localeNames, locales } = useTranslation();
  const { data: session, status } = useSession();

  // App state
  const [view, setView] = useState<AppView>('landing');
  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [insights, setInsights] = useState<InsightItem[]>([]);
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [recsLoading, setRecsLoading] = useState(false);

  // Derive user from NextAuth session
  const user = useMemo(() => {
    if (status === 'authenticated' && session?.user) {
      return {
        id: session.user.id ?? '',
        name: session.user.name ?? null,
        email: session.user.email ?? '',
      };
    }
    return null;
  }, [session, status]);

  // Auto-switch to app view when session becomes authenticated
  useEffect(() => {
    if (status === 'authenticated' && user) {
      setView('app');
    } else if (status === 'unauthenticated') {
      if (view === 'app') {
        setView('landing');
      }
    }
  }, [status, user]);

  // Fetch logs when user changes
  useEffect(() => {
    if (!user) return;
    fetchLogs();
  }, [user]);

  // Compute streak
  const streak = useMemo(() => {
    if (logs.length === 0) return 0;
    const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (sorted[0].date !== today && sorted[0].date !== yesterday) return 0;
    let count = 1;
    for (let i = 0; i < sorted.length - 1; i++) {
      const curr = new Date(sorted[i].date + 'T12:00:00');
      const prev = new Date(sorted[i + 1].date + 'T12:00:00');
      const diff = (curr.getTime() - prev.getTime()) / 86400000;
      if (Math.abs(diff - 1) < 0.5) count++;
      else break;
    }
    return count;
  }, [logs]);

  // Current vital score
  const currentScore = useMemo(() => {
    if (logs.length === 0) return null;
    const latest = logs[logs.length - 1];
    if (latest.vitalScore != null) return latest.vitalScore;
    return calculateVitalScore(latest.mental, latest.sleep, latest.nutrition, latest.exercise, latest.hydration, latest.habits);
  }, [logs]);

  // Fetch logs from API
  const fetchLogs = useCallback(async () => {
    if (!user) return;
    try {
      const res = await fetch(`/api/logs?userId=${user.id}&days=30`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  }, [user]);

  // Auth handler — credentials (email/password) via NextAuth
  const handleAuth = useCallback(async (mode: 'login' | 'register', data: { email: string; password: string; name?: string }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (mode === 'register') {
        // First create the user via our API
        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'register', ...data }),
        });
        const result = await res.json();
        if (!result.success) {
          setAuthError(result.error || 'Registration failed');
          setAuthLoading(false);
          return;
        }
      }

      // Then sign in via NextAuth
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setAuthError(result.error);
      }
    } catch {
      setAuthError('Network error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Google sign-in handler
  const handleGoogleLogin = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch {
      setAuthError('Google sign-in failed. Please try again.');
    }
  }, []);

  // Demo login handler
  const handleDemoLogin = useCallback(async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Seed demo data first
      const seedRes = await fetch('/api/demo', { method: 'POST' });
      const seedData = await seedRes.json();
      if (seedData.success) {
        // Sign in as demo user via NextAuth
        const result = await signIn('credentials', {
          email: 'demo@vitalmind.com',
          password: 'demo123',
          redirect: false,
        });
        if (result?.error) {
          setAuthError(result.error);
        }
      } else {
        setAuthError('Failed to load demo data. Please try again.');
      }
    } catch {
      setAuthError('Network error. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  }, []);

  // Log save handler
  const handleSaveLog = useCallback(async (data: LogData) => {
    if (!user) return;
    try {
      const res = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...data }),
      });
      const result = await res.json();
      if (result.success) {
        await fetchLogs();
        setActiveTab('dashboard');
      }
    } catch (err) {
      console.error('Failed to save log:', err);
    }
  }, [user, fetchLogs]);

  // Load insights
  const loadInsights = useCallback(async () => {
    if (logs.length < 2) return;
    setInsightsLoading(true);
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs }),
      });
      const data = await res.json();
      if (data.success) {
        setInsights(data.insights);
      }
    } catch {
      // fallback to empty
    } finally {
      setInsightsLoading(false);
    }
  }, [logs]);

  // Load recommendations
  const loadRecommendations = useCallback(async () => {
    if (logs.length < 1) return;
    setRecsLoading(true);
    try {
      const res = await fetch('/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs, locale }),
      });
      const data = await res.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch {
      // fallback to empty
    } finally {
      setRecsLoading(false);
    }
  }, [logs, locale]);

  // Reset recommendations when locale changes so they reload in the new language
  useEffect(() => {
    setRecommendations([]);
  }, [locale]);

  // Auto-load insights/recommendations when tab changes
  useEffect(() => {
    if (activeTab === 'insights' && insights.length === 0 && !insightsLoading) {
      loadInsights();
    }
    if (activeTab === 'recommendations' && recommendations.length === 0 && !recsLoading) {
      loadRecommendations();
    }
  }, [activeTab]);

  // Logout handler
  const handleLogout = useCallback(() => {
    setLogs([]);
    setInsights([]);
    setRecommendations([]);
    signOut({ redirect: false });
    setView('landing');
  }, []);

  // Loading screen — while session is being checked
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">🧬</div>
          <p className="text-sm text-muted-foreground">VitalMind</p>
        </div>
      </div>
    );
  }

  // ── Landing View ───────────────────────────────────────────────────
  if (view === 'landing' && !user) {
    return (
      <Landing
        onLogin={() => { setView('auth'); setAuthError(null); }}
        onRegister={() => { setView('auth'); setAuthError(null); }}
        locale={locale}
        setLocale={setLocale}
        localeFlags={localeFlags}
        localeNames={localeNames}
        locales={locales}
      />
    );
  }

  // ── Auth View ──────────────────────────────────────────────────────
  if (view === 'auth' && !user) {
    return (
      <div className="min-h-screen relative">
        <Auth
          onAuth={handleAuth}
          onDemoLogin={handleDemoLogin}
          onGoogleLogin={handleGoogleLogin}
          loading={authLoading}
          error={authError}
        />
        {/* Minimal top-right controls */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <CrisisButton language={locale as 'es' | 'en' | 'pt' | 'fr'} inline />
          <MinimalLanguageSelector
            locale={locale}
            setLocale={setLocale}
            localeFlags={localeFlags}
            localeNames={localeNames}
            locales={locales}
            t={t}
            variant="light"
          />
        </div>
      </div>
    );
  }

  // ── App View ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-lg mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              VitalMind
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Crisis Button */}
            <CrisisButton language={locale as 'es' | 'en' | 'pt' | 'fr'} inline />

            {/* Language Switcher — minimal: globe + 2 letters, auto-close */}
            <MinimalLanguageSelector
              locale={locale}
              setLocale={setLocale}
              localeFlags={localeFlags}
              localeNames={localeNames}
              locales={locales}
              t={t}
              variant="light"
            />

            {/* User Menu */}
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleLogout} title={t('auth.logout')}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard logs={logs} onGoToLog={() => setActiveTab('log')} streak={streak} />
        )}
        {activeTab === 'log' && (
          <QuickLog onSave={handleSaveLog} streak={streak} />
        )}
        {activeTab === 'progress' && (
          <Progress logs={logs} />
        )}
        {activeTab === 'achievements' && (
          <Achievements logs={logs} />
        )}
        {activeTab === 'insights' && (
          <Insights insights={insights} loading={insightsLoading} />
        )}
        {activeTab === 'recommendations' && (
          <Recommendations recommendations={recommendations} loading={recsLoading} />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/50 dark:border-slate-800/50 safe-area-bottom">
        <div className="max-w-lg mx-auto px-2">
          <div className="flex items-center justify-around h-16">
            {TAB_CONFIG.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                  <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                    {t(tab.labelKey)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Celebrations Overlay */}
      <Celebrations logs={logs} currentScore={currentScore} />
    </div>
  );
}
