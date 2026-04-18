'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTranslation, Locale } from '@/lib/i18n/context';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { CrisisButton } from '@/components/vitalmind/CrisisButton';
import {
  Brain,
  Moon,
  Apple,
  Dumbbell,
  Droplets,
  Leaf,
  ArrowRight,
  Sparkles,
  Shield,
  Phone,
  Zap,
  Target,
  ChevronDown,
  Globe,
  Check,
  Heart,
} from 'lucide-react';

// ── Language Selector (minimal: globe + 2 letters, auto-close on select) ──
function LandingLanguageSelector({
  locale,
  setLocale,
  localeFlags,
  localeNames,
  locales,
}: {
  locale: Locale;
  setLocale: (l: Locale) => void;
  localeFlags: Record<Locale, string>;
  localeNames: Record<Locale, string>;
  locales: Locale[];
}) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (loc: Locale) => {
    setLocale(loc);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1 h-8 px-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/10 text-white/80 hover:text-white transition-colors text-xs font-medium backdrop-blur-sm"
          aria-label="Language"
          title="Language"
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

interface LandingProps {
  onLogin: () => void;
  onRegister: () => void;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  localeFlags: Record<Locale, string>;
  localeNames: Record<Locale, string>;
  locales: Locale[];
}

// ── Animation variants ────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

// ── Category mini-data ────────────────────────────────────────────────
const CATEGORIES_PREVIEW = [
  { key: 'mental', Icon: Brain, color: 'text-violet-500', bg: 'bg-violet-100 dark:bg-violet-900/30', score: 78, label: 'Mental' },
  { key: 'sleep', Icon: Moon, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30', score: 85, label: 'Sleep' },
  { key: 'nutrition', Icon: Apple, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30', score: 62, label: 'Nutrition' },
  { key: 'exercise', Icon: Dumbbell, color: 'text-orange-500', bg: 'bg-orange-100 dark:bg-orange-900/30', score: 71, label: 'Exercise' },
  { key: 'hydration', Icon: Droplets, color: 'text-cyan-500', bg: 'bg-cyan-100 dark:bg-cyan-900/30', score: 90, label: 'Hydration' },
  { key: 'habits', Icon: Leaf, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30', score: 88, label: 'Habits' },
];

// ── Component ──────────────────────────────────────────────────────────
export default function Landing({ onLogin, onRegister, locale, setLocale, localeFlags, localeNames, locales }: LandingProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950">
      {/* ═══════════════════════════════════════════════════════════════
          HERO — Dark Navy Full-Screen
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#1a2e44]">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-500/8 rounded-full blur-3xl animate-pulse [animation-delay:2s]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-lg mx-auto px-6 py-12 text-center flex flex-col items-center">
          {/* Top bar: Logo + Crisis + Language */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full flex items-center justify-between mb-8"
          >
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white text-lg font-bold">V</span>
              </div>
              <span className="text-xl font-bold text-white">VitalMind</span>
            </div>

            {/* Right side: Crisis + Language */}
            <div className="flex items-center gap-2">
              {/* Crisis button — minimal */}
              <CrisisButton language={locale as 'es' | 'en' | 'pt' | 'fr'} inline />

              {/* Language selector — minimal: globe + 2 letters, auto-close */}
              <LandingLanguageSelector
                locale={locale}
                setLocale={setLocale}
                localeFlags={localeFlags}
                localeNames={localeNames}
                locales={locales}
              />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/10 px-4 py-1.5 mb-6 backdrop-blur-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-300">{t('landing.badge')}</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl md:text-5xl font-extrabold text-white leading-[1.1] mb-4"
          >
            {t('landing.hero.title')}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-base text-slate-300 max-w-md mb-8 leading-relaxed"
          >
            {t('landing.hero.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto mb-10"
          >
            <Button
              size="lg"
              onClick={onRegister}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-base font-semibold px-8 h-12 rounded-xl shadow-lg shadow-emerald-500/25"
            >
              {t('landing.hero.cta')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={onLogin}
              className="w-full sm:w-auto text-white/80 hover:text-white hover:bg-white/10 text-base px-8 h-12 rounded-xl"
            >
              {t('landing.login')}
            </Button>
          </motion.div>

          {/* Phone Preview — VitalScore Card Mock */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            custom={4}
            className="w-full max-w-[280px]"
          >
            <div className="rounded-3xl bg-[#0f1f30] border border-white/10 p-5 shadow-2xl shadow-black/30">
              {/* Status bar mock */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] text-slate-400">9:41</span>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-2 rounded-sm bg-slate-500" />
                  <div className="w-3 h-2 rounded-sm bg-slate-500" />
                </div>
              </div>
              {/* VitalScore card */}
              <div className="rounded-2xl bg-[#1a2e44] p-4 mb-3">
                <p className="text-blue-400 text-[10px] font-semibold uppercase tracking-wider mb-1">Tu VitalScore</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-extrabold text-green-400">82</span>
                  <span className="text-sm text-gray-400">/100</span>
                </div>
                <p className="text-center text-xs text-green-400 font-semibold mt-0.5">Bueno</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-green-800/50 text-green-300">
                    +3 vs ayer
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-teal-700/60 text-teal-300">
                    ↑ Mejorando
                  </span>
                </div>
              </div>
              {/* Mini category bars */}
              <div className="space-y-2">
                {CATEGORIES_PREVIEW.slice(0, 4).map((cat) => (
                  <div key={cat.key} className="flex items-center gap-2">
                    <cat.Icon className={`w-3 h-3 ${cat.color}`} />
                    <span className="text-[10px] text-slate-400 flex-1">{cat.label}</span>
                    <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${cat.key === 'mental' ? 'bg-violet-500' : cat.key === 'sleep' ? 'bg-blue-500' : cat.key === 'nutrition' ? 'bg-amber-500' : 'bg-orange-500'}`}
                        style={{ width: `${cat.score}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-300 font-medium w-6 text-right">{cat.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ChevronDown className="w-5 h-5 text-white/30" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SOCIAL PROOF BAR
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: t('landing.socialProof.users'), icon: '👥' },
              { value: t('landing.socialProof.rating'), icon: '⭐' },
              { value: t('landing.socialProof.languages'), icon: '🌍' },
              { value: t('landing.socialProof.support'), icon: '❤️' },
            ].map((stat, i) => (
              <motion.div
                key={stat.value}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="flex items-center justify-center gap-2 py-1"
              >
                <span className="text-base">{stat.icon}</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          BENTO GRID FEATURES
          ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            {t('landing.features.title')}
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {t('landing.features.subtitle')}
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[minmax(140px,auto)]">
          {/* VitalScore — Large card (2x2) */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="col-span-2 row-span-2 rounded-2xl bg-[#1a2e44] p-6 flex flex-col justify-between text-white relative overflow-hidden group"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold mb-1">{t('landing.bento.vitalscore.title')}</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-[200px]">
                {t('landing.bento.vitalscore.description')}
              </p>
            </div>
            <div className="flex items-end gap-3 mt-4">
              <span className="text-5xl font-extrabold text-green-400">82</span>
              <span className="text-lg text-slate-400 pb-2">/100</span>
              {/* Mini score ring */}
              <div className="ml-auto">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none"
                    stroke="url(#bentoGrad)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={2 * Math.PI * 42 * 0.18}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="bentoGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Quick Tracking */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-800/30 p-5 flex flex-col justify-between group hover:shadow-md transition-shadow"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mb-3">
              <Zap className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">{t('landing.bento.tracking.title')}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{t('landing.bento.tracking.description')}</p>
            </div>
          </motion.div>

          {/* AI Insights */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={2}
            className="rounded-2xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200/50 dark:border-violet-800/30 p-5 flex flex-col justify-between group hover:shadow-md transition-shadow"
          >
            <div className="w-9 h-9 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mb-3">
              <Brain className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">{t('landing.bento.insights.title')}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{t('landing.bento.insights.description')}</p>
            </div>
          </motion.div>

          {/* Personalized Plan */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={3}
            className="rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-800/30 p-5 flex flex-col justify-between group hover:shadow-md transition-shadow"
          >
            <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center mb-3">
              <Target className="w-4.5 h-4.5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">{t('landing.bento.plan.title')}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{t('landing.bento.plan.description')}</p>
            </div>
          </motion.div>

          {/* Crisis Lines */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={4}
            className="rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-800/30 p-5 flex flex-col justify-between group hover:shadow-md transition-shadow"
          >
            <div className="w-9 h-9 rounded-lg bg-rose-100 dark:bg-rose-900/50 flex items-center justify-center mb-3">
              <Phone className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">{t('landing.bento.crisis.title')}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{t('landing.bento.crisis.description')}</p>
            </div>
          </motion.div>

          {/* Privacy — Wide card (2 cols) */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={5}
            className="col-span-2 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/30 p-5 flex items-center gap-4 group hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-700/50 flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-slate-600 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground mb-1">{t('landing.bento.privacy.title')}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{t('landing.bento.privacy.description')}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-slate-50 dark:bg-slate-900/30 py-16 md:py-20">
        <div className="max-w-lg mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {t('landing.howItWorks.title')}
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-emerald-300 via-teal-300 to-cyan-300 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700" />

            <div className="space-y-8">
              {[
                { num: '1', key: 'step1', emoji: '📝', color: 'from-emerald-400 to-emerald-500' },
                { num: '2', key: 'step2', emoji: '🔍', color: 'from-teal-400 to-teal-500' },
                { num: '3', key: 'step3', emoji: '🚀', color: 'from-cyan-400 to-cyan-500' },
              ].map((step, i) => (
                <motion.div
                  key={step.key}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="flex items-start gap-4"
                >
                  <div className={`relative z-10 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                    <span className="text-lg">{step.emoji}</span>
                  </div>
                  <div className="pt-1.5">
                    <h3 className="text-base font-bold text-foreground">
                      {t(`landing.howItWorks.${step.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {t(`landing.howItWorks.${step.key}.description`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════════════════════════ */}
      <section className="max-w-4xl mx-auto px-6 py-16 md:py-20">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            {t('landing.testimonial.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['quote1', 'quote2', 'quote3'].map((qKey, i) => (
            <motion.div
              key={qKey}
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 p-5 shadow-sm"
            >
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, s) => (
                  <span key={s} className="text-amber-400 text-xs">★</span>
                ))}
              </div>
              <p className="text-sm text-foreground leading-relaxed italic">
                &ldquo;{t(`landing.testimonial.${qKey}`)}&rdquo;
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA — Dark Navy
          ═══════════════════════════════════════════════════════════════ */}
      <section className="bg-[#1a2e44] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-lg mx-auto px-6 py-16 md:py-20 text-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {t('landing.cta.title')}
            </h2>
            <p className="text-sm text-slate-300 mb-8 max-w-md mx-auto leading-relaxed">
              {t('landing.cta.subtitle')}
            </p>
            <Button
              size="lg"
              onClick={onRegister}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-base font-semibold px-10 h-13 rounded-xl shadow-lg shadow-emerald-500/25"
            >
              {t('landing.cta.button')}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <p className="text-xs text-slate-400 mt-4">
              {t('landing.cta.noCreditCard')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">V</span>
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">VitalMind</span>
            </div>
            <p className="text-xs text-muted-foreground">{t('landing.footer')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
