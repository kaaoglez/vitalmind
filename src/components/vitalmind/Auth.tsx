'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTranslation } from '@/lib/i18n/context';
import { Mail, Lock, User, Loader2 } from 'lucide-react';

interface AuthProps {
  onAuth: (
    mode: 'login' | 'register',
    data: { email: string; password: string; name?: string }
  ) => Promise<void>;
  onDemoLogin?: () => Promise<void>;
  onGoogleLogin?: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export default function Auth({ onAuth, onDemoLogin, onGoogleLogin, loading, error }: AuthProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await onAuth(mode, {
        email,
        password,
        ...(mode === 'register' && name ? { name } : {}),
      });
    },
    [mode, email, password, name, onAuth]
  );

  const switchMode = useCallback(() => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
  }, []);

  const handleDemo = useCallback(async () => {
    if (!onDemoLogin) return;
    setDemoLoading(true);
    try {
      await onDemoLogin();
    } finally {
      setDemoLoading(false);
    }
  }, [onDemoLogin]);

  const handleGoogle = useCallback(async () => {
    if (!onGoogleLogin) return;
    setGoogleLoading(true);
    try {
      await onGoogleLogin();
    } finally {
      setGoogleLoading(false);
    }
  }, [onGoogleLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50/50 via-background to-teal-50/50 dark:from-emerald-950/10 dark:via-background dark:to-teal-950/10">
      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Logo */}
        <div className="text-center mb-6">
          <span className="text-3xl">🧬</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mt-2">
            VitalMind
          </h1>
        </div>

        <Card>
          <CardHeader className="pb-3 pt-5 px-5">
            <CardTitle className="text-center text-lg">
              {mode === 'login' ? t('auth.login') : t('auth.register')}
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {/* ── Google Sign In ─────────────────────────────────────── */}
            {onGoogleLogin && (
              <Button
                type="button"
                variant="outline"
                disabled={loading || googleLoading}
                onClick={handleGoogle}
                className="w-full h-10 mb-4 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
              >
                {googleLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    ...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    {t('auth.loginForm.googleLogin')}
                  </span>
                )}
              </Button>
            )}

            {/* ── Divider ────────────────────────────────────────────── */}
            <div className="relative flex items-center justify-center mb-4">
              <div className="border-t border-slate-200 dark:border-slate-700 absolute w-full" />
              <span className="bg-white dark:bg-slate-900 px-3 text-xs text-muted-foreground relative z-10">
                {t('auth.orDivider')}
              </span>
            </div>

            {/* ── Email/Password Form ────────────────────────────────── */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name (register only) */}
              <AnimatePresence>
                {mode === 'register' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-1.5"
                  >
                    <Label htmlFor="name" className="text-xs">
                      {t('auth.name')}
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9 h-10"
                        disabled={loading}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs">
                  {t('auth.email')}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-10"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs">
                  {t('auth.password')}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 h-10"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 px-3 py-2"
                >
                  <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('auth.submit')}
                  </span>
                ) : (
                  t('auth.submit')
                )}
              </Button>
            </form>

            {/* Demo Mode Button */}
            {onDemoLogin && (
              <div className="mt-4">
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-slate-200 dark:border-slate-700 absolute w-full" />
                  <span className="bg-white dark:bg-slate-900 px-3 text-xs text-muted-foreground relative z-10">
                    {t('auth.orDivider')}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={loading || demoLoading}
                  onClick={handleDemo}
                  className="w-full h-10 border-dashed border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-semibold"
                >
                  {demoLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('auth.demoLoading')}
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="text-base">🧪</span>
                      {t('auth.demoButton')}
                    </span>
                  )}
                </Button>
                <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                  {t('auth.demoDescription')}
                </p>
              </div>
            )}

            {/* Switch Mode */}
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                {mode === 'login' ? t('auth.noAccount') : t('auth.hasAccount')}{' '}
                <button
                  type="button"
                  onClick={switchMode}
                  className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                  disabled={loading}
                >
                  {mode === 'login' ? t('auth.switchToRegister') : t('auth.switchToLogin')}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
