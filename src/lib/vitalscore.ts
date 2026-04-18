import { useTranslation } from '@/lib/i18n/context';

// ── LogEntry shared interface ──────────────────────────────────────────
export interface LogEntry {
  date: string;
  mental: number;
  sleep: number;
  nutrition: number;
  exercise: number;
  hydration: number;
  habits: number;
  vitalScore: number | null;
  sleepHours: number | null;
  stressLevel: number | null;
  exercised: boolean;
  waterGlasses: number | null;
  mealsHealthy: number | null;
  alcoholUnits: number | null;
}

// ── Category definitions ───────────────────────────────────────────────
export interface CategoryDef {
  key: string;
  nameKey: string;
  weight: number;
  emoji: string;
  color: string;
  bgColor: string;
}

export const CATEGORIES: CategoryDef[] = [
  { key: 'mental', nameKey: 'category.mental', weight: 0.25, emoji: '🧠', color: 'text-violet-500', bgColor: 'bg-violet-500' },
  { key: 'sleep', nameKey: 'category.sleep', weight: 0.20, emoji: '😴', color: 'text-indigo-400', bgColor: 'bg-indigo-400' },
  { key: 'nutrition', nameKey: 'category.nutrition', weight: 0.18, emoji: '🥗', color: 'text-emerald-500', bgColor: 'bg-emerald-500' },
  { key: 'exercise', nameKey: 'category.exercise', weight: 0.15, emoji: '🏃', color: 'text-orange-500', bgColor: 'bg-orange-500' },
  { key: 'hydration', nameKey: 'category.hydration', weight: 0.12, emoji: '💧', color: 'text-sky-500', bgColor: 'bg-sky-500' },
  { key: 'habits', nameKey: 'category.habits', weight: 0.10, emoji: '🎯', color: 'text-rose-500', bgColor: 'bg-rose-500' },
];

// ── Score calculation functions ────────────────────────────────────────

/**
 * Calculate mental score from stress level (1-10).
 * Lower stress = higher score. stress 1 → 100, stress 10 → 0
 */
export function calculateMentalScore(stressLevel: number): number {
  const clamped = Math.max(1, Math.min(10, stressLevel));
  return Math.round(((10 - clamped) / 9) * 100);
}

/**
 * Calculate sleep score from hours.
 * 7-9h = 100, linear penalty outside that range.
 */
export function calculateSleepScore(hours: number): number {
  const clamped = Math.max(0, Math.min(14, hours));
  if (clamped >= 7 && clamped <= 9) return 100;
  if (clamped < 7) return Math.round((clamped / 7) * 100);
  // > 9 hours: penalty of ~15 per extra hour
  return Math.round(Math.max(0, 100 - (clamped - 9) * 15));
}

/**
 * Calculate nutrition score from number of healthy meals (0-3).
 * 3 = 100, 2 = 70, 1 = 40, 0 = 0
 */
export function calculateNutritionScore(healthyMeals: number): number {
  const clamped = Math.max(0, Math.min(3, healthyMeals));
  const scores = [0, 40, 70, 100];
  return scores[clamped];
}

/**
 * Calculate exercise score.
 * Exercised = 100, not = 20
 */
export function calculateExerciseScore(exercised: boolean): number {
  return exercised ? 100 : 20;
}

/**
 * Calculate hydration score from water glasses (0-12).
 * 8+ = 100, linear below 8.
 */
export function calculateHydrationScore(waterGlasses: number): number {
  const clamped = Math.max(0, Math.min(12, waterGlasses));
  if (clamped >= 8) return 100;
  return Math.round((clamped / 8) * 100);
}

/**
 * Calculate habits score from alcohol units.
 * 0 units = 100, linear penalty up to 6+ units = 0
 */
export function calculateHabitsScore(alcoholUnits: number): number {
  const clamped = Math.max(0, Math.min(10, alcoholUnits));
  if (clamped === 0) return 100;
  if (clamped >= 6) return 0;
  return Math.round(((6 - clamped) / 6) * 100);
}

/**
 * Calculate overall VitalScore as weighted sum of category scores.
 */
export function calculateVitalScore(
  mental: number,
  sleep: number,
  nutrition: number,
  exercise: number,
  hydration: number,
  habits: number
): number {
  const scores = [mental, sleep, nutrition, exercise, hydration, habits];
  let total = 0;
  for (let i = 0; i < CATEGORIES.length; i++) {
    total += scores[i] * CATEGORIES[i].weight;
  }
  return Math.round(Math.max(0, Math.min(100, total)));
}

// ── Score display helpers ──────────────────────────────────────────────

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-500';
  if (score >= 60) return 'text-amber-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

export function getScoreGradient(score: number): string {
  if (score >= 80) return 'from-emerald-400 to-teal-500';
  if (score >= 60) return 'from-amber-400 to-yellow-500';
  if (score >= 40) return 'from-orange-400 to-amber-500';
  return 'from-red-400 to-rose-500';
}

/**
 * Get a human-readable label for a score. Returns the translation key
 * so the component can pass it through t(). This avoids direct hook usage
 * in a non-component file.
 */
export function getScoreLabelKey(score: number): string {
  if (score >= 80) return 'score.excellent';
  if (score >= 60) return 'score.good';
  if (score >= 40) return 'score.fair';
  if (score >= 20) return 'score.poor';
  return 'score.critical';
}

/**
 * Convenience: get score label using t function (pass t from a component).
 */
export function getScoreLabel(score: number, t: (key: string) => string): string {
  return t(getScoreLabelKey(score));
}

// ── Trend calculation ──────────────────────────────────────────────────

export type Trend = 'up' | 'down' | 'stable';

export function getTrend(logs: number[]): Trend {
  if (logs.length < 2) return 'stable';
  const recent = logs.slice(-3);
  const older = logs.slice(-6, -3);
  if (older.length === 0) return 'stable';

  const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;

  const diff = recentAvg - olderAvg;
  if (diff > 3) return 'up';
  if (diff < -3) return 'down';
  return 'stable';
}

// ── Greeting helper ────────────────────────────────────────────────────

export function getGreetingKey(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'dashboard.greeting.morning';
  if (hour >= 12 && hour < 17) return 'dashboard.greeting.afternoon';
  if (hour >= 17 && hour < 21) return 'dashboard.greeting.evening';
  return 'dashboard.greeting.night';
}

// ── Date helpers ───────────────────────────────────────────────────────

export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function hasLoggedToday(logs: LogEntry[]): boolean {
  const today = getTodayStr();
  return logs.some((l) => l.date === today);
}

// ── Quick log presets ──────────────────────────────────────────────────

export interface QuickLogPreset {
  labelKey: string;
  stressLevel: number;
  sleepHours: number;
  waterGlasses: number;
  exercised: boolean;
  mealsHealthy: number;
  alcoholUnits: number;
}

export const QUICK_LOG_PRESETS: QuickLogPreset[] = [
  {
    labelKey: 'log.preset.perfect',
    stressLevel: 1,
    sleepHours: 8,
    waterGlasses: 8,
    exercised: true,
    mealsHealthy: 3,
    alcoholUnits: 0,
  },
  {
    labelKey: 'log.preset.normal',
    stressLevel: 4,
    sleepHours: 7,
    waterGlasses: 5,
    exercised: false,
    mealsHealthy: 2,
    alcoholUnits: 1,
  },
  {
    labelKey: 'log.preset.hard',
    stressLevel: 8,
    sleepHours: 5,
    waterGlasses: 2,
    exercised: false,
    mealsHealthy: 1,
    alcoholUnits: 3,
  },
];

// ── Mood emoji mapping ─────────────────────────────────────────────────

export interface MoodOption {
  emoji: string;
  labelKey: string;
  stressLevel: number;
}

export const MOOD_OPTIONS: MoodOption[] = [
  { emoji: '😄', labelKey: 'log.mood.great', stressLevel: 1 },
  { emoji: '🙂', labelKey: 'log.mood.good', stressLevel: 3 },
  { emoji: '😐', labelKey: 'log.mood.okay', stressLevel: 5 },
  { emoji: '😔', labelKey: 'log.mood.bad', stressLevel: 7 },
  { emoji: '😫', labelKey: 'log.mood.awful', stressLevel: 9 },
];

// ── Achievement definitions ────────────────────────────────────────────

export interface AchievementDef {
  id: string;
  nameKey: string;
  descKey: string;
  emoji: string;
  maxProgress: number;
  check: (logs: LogEntry[]) => { unlocked: boolean; progress: number };
}

export const ACHIEVEMENT_DEFS: AchievementDef[] = [
  {
    id: 'first_log',
    nameKey: 'achievements.first_log',
    descKey: 'achievements.first_log.desc',
    emoji: '🌱',
    maxProgress: 1,
    check: (logs) => ({ unlocked: logs.length >= 1, progress: Math.min(1, logs.length) }),
  },
  {
    id: 'seven_days',
    nameKey: 'achievements.seven_days',
    descKey: 'achievements.seven_days.desc',
    emoji: '🔥',
    maxProgress: 7,
    check: (logs) => {
      const streak = calcConsecutiveStreak(logs);
      return { unlocked: streak >= 7, progress: Math.min(7, streak) };
    },
  },
  {
    id: 'fourteen_days',
    nameKey: 'achievements.fourteen_days',
    descKey: 'achievements.fourteen_days.desc',
    emoji: '⚡',
    maxProgress: 14,
    check: (logs) => {
      const streak = calcConsecutiveStreak(logs);
      return { unlocked: streak >= 14, progress: Math.min(14, streak) };
    },
  },
  {
    id: 'one_month',
    nameKey: 'achievements.one_month',
    descKey: 'achievements.one_month.desc',
    emoji: '👑',
    maxProgress: 30,
    check: (logs) => ({ unlocked: logs.length >= 30, progress: Math.min(30, logs.length) }),
  },
  {
    id: 'perfect_score',
    nameKey: 'achievements.perfect_score',
    descKey: 'achievements.perfect_score.desc',
    emoji: '💯',
    maxProgress: 1,
    check: (logs) => ({
      unlocked: logs.some((l) => l.vitalScore === 100),
      progress: logs.some((l) => l.vitalScore === 100) ? 1 : 0,
    }),
  },
  {
    id: 'golden_sleep',
    nameKey: 'achievements.golden_sleep',
    descKey: 'achievements.golden_sleep.desc',
    emoji: '🌙',
    maxProgress: 1,
    check: (logs) => ({
      unlocked: logs.some((l) => l.sleepHours === 8),
      progress: logs.some((l) => l.sleepHours === 8) ? 1 : 0,
    }),
  },
  {
    id: 'hydration_hero',
    nameKey: 'achievements.hydration_hero',
    descKey: 'achievements.hydration_hero.desc',
    emoji: '💦',
    maxProgress: 1,
    check: (logs) => ({
      unlocked: logs.some((l) => (l.waterGlasses ?? 0) >= 8),
      progress: logs.some((l) => (l.waterGlasses ?? 0) >= 8) ? 1 : 0,
    }),
  },
  {
    id: 'exercise_streak',
    nameKey: 'achievements.exercise_streak',
    descKey: 'achievements.exercise_streak.desc',
    emoji: '💪',
    maxProgress: 5,
    check: (logs) => {
      const exStreak = calcExerciseStreak(logs);
      return { unlocked: exStreak >= 5, progress: Math.min(5, exStreak) };
    },
  },
  {
    id: 'stress_master',
    nameKey: 'achievements.stress_master',
    descKey: 'achievements.stress_master.desc',
    emoji: '🧘',
    maxProgress: 1,
    check: (logs) => ({
      unlocked: logs.some((l) => l.stressLevel === 1),
      progress: logs.some((l) => l.stressLevel === 1) ? 1 : 0,
    }),
  },
  {
    id: 'nutrition_king',
    nameKey: 'achievements.nutrition_king',
    descKey: 'achievements.nutrition_king.desc',
    emoji: '🥬',
    maxProgress: 1,
    check: (logs) => ({
      unlocked: logs.some((l) => (l.mealsHealthy ?? 0) >= 3),
      progress: logs.some((l) => (l.mealsHealthy ?? 0) >= 3) ? 1 : 0,
    }),
  },
];

function calcConsecutiveStreak(logs: LogEntry[]): number {
  if (logs.length === 0) return 0;
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 1;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].date);
    const curr = new Date(sorted[i].date);
    const diffDays = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

function calcExerciseStreak(logs: LogEntry[]): number {
  if (logs.length === 0) return 0;
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date));
  let streak = 0;
  for (const log of sorted) {
    if (log.exercised) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// ── Insight / Recommendation types ─────────────────────────────────────

export type InsightType = 'positive' | 'negative' | 'neutral' | 'info';

export interface InsightItem {
  id: string;
  emoji: string;
  title: string;
  description: string;
  type: InsightType;
}

export type Priority = 'high' | 'medium' | 'low';

export interface RecommendationItem {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
}

// ── LogData for QuickLog form output ───────────────────────────────────

export interface LogData {
  date: string;
  stressLevel: number;
  sleepHours: number;
  waterGlasses: number;
  exercised: boolean;
  mealsHealthy: number;
  alcoholUnits: number;
}
