'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTranslation } from '@/lib/i18n/context';
import {
  LogEntry,
  CATEGORIES,
  calculateVitalScore,
  getScoreColor,
  getScoreLabelKey,
  getTrend,
  hasLoggedToday,
} from '@/lib/vitalscore';
import {
  TrendingUp,
  TrendingDown,
  LogIn,
  Sprout,
  AlertTriangle,
  Brain,
  Moon,
  Apple,
  Dumbbell,
  Droplets,
  Leaf,
} from 'lucide-react';

interface DashboardProps {
  logs: LogEntry[];
  onGoToLog: () => void;
  streak: number;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  mental: Brain,
  sleep: Moon,
  nutrition: Apple,
  exercise: Dumbbell,
  hydration: Droplets,
  habits: Leaf,
};

const CATEGORY_COLORS: Record<string, { icon: string; bg: string; border: string; progress: string }> = {
  mental: { icon: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', progress: '[&>div]:bg-violet-500' },
  sleep: { icon: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', progress: '[&>div]:bg-blue-500' },
  nutrition: { icon: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200', progress: '[&>div]:bg-amber-500' },
  exercise: { icon: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', progress: '[&>div]:bg-orange-500' },
  hydration: { icon: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-200', progress: '[&>div]:bg-cyan-500' },
  habits: { icon: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', progress: '[&>div]:bg-emerald-500' },
};

export default function Dashboard({ logs, onGoToLog, streak }: DashboardProps) {
  const { t } = useTranslation();

  const latestLog = logs.length > 0 ? logs[logs.length - 1] : null;

  const vitalScore = useMemo(() => {
    if (!latestLog) return null;
    return calculateVitalScore(
      latestLog.mental,
      latestLog.sleep,
      latestLog.nutrition,
      latestLog.exercise,
      latestLog.hydration,
      latestLog.habits
    );
  }, [latestLog]);

  const categoryScores = useMemo(() => {
    if (!latestLog) return [];
    return CATEGORIES.map((cat) => ({
      ...cat,
      score: latestLog[cat.key as keyof LogEntry] as number,
    }));
  }, [latestLog]);

  const trend = useMemo(() => {
    if (logs.length < 2) return 'stable' as const;
    const scores = logs.map((l) => {
      if (l.vitalScore != null) return l.vitalScore;
      return calculateVitalScore(l.mental, l.sleep, l.nutrition, l.exercise, l.hydration, l.habits);
    });
    return getTrend(scores);
  }, [logs]);

  // Score difference vs yesterday
  const scoreDiff = useMemo(() => {
    if (logs.length < 2) return null;
    const latest = logs[logs.length - 1];
    const prev = logs[logs.length - 2];
    const latestScore = latest.vitalScore ?? calculateVitalScore(latest.mental, latest.sleep, latest.nutrition, latest.exercise, latest.hydration, latest.habits);
    const prevScore = prev.vitalScore ?? calculateVitalScore(prev.mental, prev.sleep, prev.nutrition, prev.exercise, prev.hydration, prev.habits);
    return latestScore - prevScore;
  }, [logs]);

  const weakest = useMemo(() => {
    if (categoryScores.length === 0) return null;
    return categoryScores.reduce((min, c) => (c.score < min.score ? c : min), categoryScores[0]);
  }, [categoryScores]);

  const loggedToday = useMemo(() => hasLoggedToday(logs), [logs]);

  // Format last update date
  const lastUpdateStr = useMemo(() => {
    if (!latestLog) return null;
    const d = new Date(latestLog.date + 'T12:00:00');
    const days = ['general.common.sunday', 'general.common.monday', 'general.common.tuesday', 'general.common.wednesday', 'general.common.thursday', 'general.common.friday', 'general.common.saturday'];
    const shortDays = ['general.common.shortSunday', 'general.common.shortMonday', 'general.common.shortTuesday', 'general.common.shortWednesday', 'general.common.shortThursday', 'general.common.shortFriday', 'general.common.shortSaturday'];
    const months = ['general.common.january', 'general.common.february', 'general.common.march', 'general.common.april', 'general.common.may', 'general.common.june', 'general.common.july', 'general.common.august', 'general.common.september', 'general.common.october', 'general.common.november', 'general.common.december'];
    const shortMonths = ['general.common.shortJanuary', 'general.common.shortFebruary', 'general.common.shortMarch', 'general.common.shortApril', 'general.common.shortMay', 'general.common.shortJune', 'general.common.shortJuly', 'general.common.shortAugust', 'general.common.shortSeptember', 'general.common.shortOctober', 'general.common.shortNovember', 'general.common.shortDecember'];
    const dayName = t(shortDays[d.getDay()]);
    const monthName = t(shortMonths[d.getMonth()]);
    return `${dayName}, ${d.getDate()} ${monthName}`;
  }, [latestLog, t]);

  const scoreLabelKey = vitalScore !== null ? getScoreLabelKey(vitalScore) : null;

  return (
    <div className="space-y-4">
      {/* ── VitalScore Header Card ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="rounded-2xl bg-[#1a2e44] px-6 pt-7 pb-6 shadow-lg text-center">
          {/* Title */}
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-wider mb-2">
            {t('dashboard.yourVitalScore')}
          </p>

          {/* Score + /100 */}
          <div className="flex items-baseline justify-center gap-1.5 mb-0.5">
            <span className={`text-6xl font-extrabold leading-none ${
              vitalScore !== null
                ? vitalScore >= 80 ? 'text-green-400'
                  : vitalScore >= 60 ? 'text-yellow-400'
                  : vitalScore >= 40 ? 'text-orange-400'
                  : 'text-red-400'
                : 'text-gray-400'
            }`}>
              {vitalScore ?? '—'}
            </span>
            <span className="text-lg text-gray-400 font-medium">/100</span>
          </div>

          {/* Score Label */}
          {scoreLabelKey && (
            <p className={`text-sm font-semibold mb-4 ${
              vitalScore !== null
                ? vitalScore >= 80 ? 'text-green-400'
                  : vitalScore >= 60 ? 'text-yellow-400'
                  : vitalScore >= 40 ? 'text-orange-400'
                  : 'text-red-400'
                : 'text-gray-400'
            }`}>
              {t(scoreLabelKey)}
            </p>
          )}

          {/* Badges Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            {/* vs Yesterday Badge */}
            {scoreDiff !== null && scoreDiff !== 0 && (
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                scoreDiff < 0
                  ? 'bg-[#8b1a1a] text-red-200'
                  : 'bg-green-800/50 text-green-300'
              }`}>
                {scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff} {t('dashboard.vsYesterday')}
              </span>
            )}
            {scoreDiff === 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-gray-600/50 text-gray-300">
                0 {t('dashboard.vsYesterday')}
              </span>
            )}

            {/* Trend Badge */}
            {trend === 'up' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal-700/60 text-teal-300">
                <TrendingUp className="w-3 h-3" /> {t('dashboard.vitalScoreInfo.trend.up')}
              </span>
            )}
            {trend === 'down' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-orange-800/50 text-orange-300">
                <TrendingDown className="w-3 h-3" /> {t('dashboard.vitalScoreInfo.trend.down')}
              </span>
            )}

            {/* Streak Badge */}
            {streak > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-800/50 text-amber-300">
                <span className="text-sm">🔥</span>
                {streak} {streak === 1 ? t('dashboard.daySingular') : t('dashboard.streak')}
              </span>
            )}
          </div>

          {/* Timestamp */}
          {lastUpdateStr && (
            <p className="text-[11px] text-gray-500 mt-4">
              {t('dashboard.lastUpdate')}: {lastUpdateStr}
            </p>
          )}
        </div>
      </motion.div>

      {/* ── Daily Tip Card ─────────────────────────────────────────────── */}
      {weakest && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 px-4 py-3.5 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider">
                  {t('dashboard.dailyTip')}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                  {t('dashboard.weakestCategory').replace('{category}', t(weakest.nameKey))}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── Category Cards Grid (2x3) ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="grid grid-cols-2 gap-3"
      >
        {categoryScores.map((cat, idx) => {
          const colors = CATEGORY_COLORS[cat.key] || CATEGORY_COLORS.mental;
          const Icon = CATEGORY_ICONS[cat.key] || Brain;
          const isLow = cat.score < 60;
          const weightPercent = Math.round(cat.weight * 100);

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.25 + idx * 0.05 }}
            >
              <Card className={`overflow-hidden shadow-sm h-full ${
                isLow
                  ? 'border-2 border-amber-300 dark:border-amber-600'
                  : 'border border-slate-200/80 dark:border-slate-800'
              }`}>
                <CardContent className="p-3.5">
                  {/* Icon + Name */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-4.5 h-4.5 ${colors.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {t(cat.nameKey)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {weightPercent}% {t('dashboard.weight')}
                      </p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="flex items-baseline gap-1 mb-1.5">
                    <span className={`text-2xl font-bold ${getScoreColor(cat.score)}`}>
                      {cat.score}
                    </span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>

                  {/* Progress Bar */}
                  <Progress
                    value={cat.score}
                    className={`h-1.5 ${colors.progress}`}
                  />

                  {/* Low Score Warning */}
                  {isLow && (
                    <div className="flex items-center gap-1 mt-2">
                      <AlertTriangle className="w-3 h-3 text-amber-500" />
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                        {t('dashboard.needsImprovement')}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Log Today CTA ──────────────────────────────────────────────── */}
      {!loggedToday && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={onGoToLog}
            className="w-full h-12 text-base font-semibold bg-[#1a2e44] hover:bg-[#243b54] text-white shadow-md rounded-2xl"
            size="lg"
          >
            <LogIn className="w-5 h-5 mr-2" />
            {t('dashboard.logToday')}
          </Button>
        </motion.div>
      )}

      {loggedToday && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-sm text-emerald-600 dark:text-emerald-400 font-medium">
            ✅ {t('dashboard.alreadyLogged')}
          </span>
        </motion.div>
      )}
    </div>
  );
}
