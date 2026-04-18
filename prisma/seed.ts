import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ── Score calculation functions (mirroring src/lib/vitalscore.ts) ──────────

function calculateMentalScore(stressLevel: number): number {
  const clamped = Math.max(1, Math.min(10, stressLevel));
  return Math.round(((10 - clamped) / 9) * 100);
}

function calculateSleepScore(hours: number): number {
  const clamped = Math.max(0, Math.min(14, hours));
  if (clamped >= 7 && clamped <= 9) return 100;
  if (clamped < 7) return Math.round((clamped / 7) * 100);
  return Math.round(Math.max(0, 100 - (clamped - 9) * 15));
}

function calculateNutritionScore(healthyMeals: number): number {
  const clamped = Math.max(0, Math.min(3, healthyMeals));
  const scores = [0, 40, 70, 100];
  return scores[clamped];
}

function calculateExerciseScore(exercised: boolean): number {
  return exercised ? 100 : 20;
}

function calculateHydrationScore(waterGlasses: number): number {
  const clamped = Math.max(0, Math.min(12, waterGlasses));
  if (clamped >= 8) return 100;
  return Math.round((clamped / 8) * 100);
}

function calculateHabitsScore(alcoholUnits: number): number {
  const clamped = Math.max(0, Math.min(10, alcoholUnits));
  if (clamped === 0) return 100;
  if (clamped >= 6) return 0;
  return Math.round(((6 - clamped) / 6) * 100);
}

function calculateVitalScore(
  mental: number,
  sleep: number,
  nutrition: number,
  exercise: number,
  hydration: number,
  habits: number
): number {
  const weights = [0.25, 0.20, 0.18, 0.15, 0.12, 0.10];
  const scores = [mental, sleep, nutrition, exercise, hydration, habits];
  let total = 0;
  for (let i = 0; i < weights.length; i++) {
    total += scores[i] * weights[i];
  }
  return Math.round(Math.max(0, Math.min(100, total)));
}

// ── Day data definition ────────────────────────────────────────────────

interface DayData {
  daysAgo: number;
  stressLevel: number;
  sleepHours: number;
  exercised: boolean;
  waterGlasses: number;
  mealsHealthy: number;
  alcoholUnits: number;
}

/**
 * 30 days of realistic data telling a story of improvement.
 * 
 * Week 1 (days 30-24): Rough start - high stress, poor sleep, inconsistent habits
 * Week 2 (days 23-17): Starting to improve - moderate stress, better sleep
 * Week 3 (days 16-10): Good momentum - lower stress, good sleep, regular exercise
 * Week 4 (days 9-1): Best week - low stress, great sleep, consistent habits
 * 
 * Patterns included:
 * - Weekend alcohol bumps (Fri/Sat)
 * - A few bad days even in good weeks
 * - One "perfect" day near the end for the perfect_score achievement
 * - 3 skipped days for realism (days 26, 19, 12)
 */
const SEED_DATA: DayData[] = [
  // ═══ Week 1: Rough start (days 30-24) ═══
  // Day 30: Monday - rough Monday, high stress, poor sleep
  { daysAgo: 30, stressLevel: 7, sleepHours: 5, exercised: false, waterGlasses: 3, mealsHealthy: 1, alcoholUnits: 0 },
  // Day 29: Tuesday - still struggling
  { daysAgo: 29, stressLevel: 8, sleepHours: 5.5, exercised: false, waterGlasses: 4, mealsHealthy: 1, alcoholUnits: 0 },
  // Day 28: Wednesday - tried to exercise but still stressed
  { daysAgo: 28, stressLevel: 6, sleepHours: 6, exercised: true, waterGlasses: 4, mealsHealthy: 2, alcoholUnits: 0 },
  // Day 27: Thursday - slight improvement
  { daysAgo: 27, stressLevel: 7, sleepHours: 5.5, exercised: false, waterGlasses: 3, mealsHealthy: 1, alcoholUnits: 0 },
  // Day 26: SKIPPED (Friday) - was too overwhelmed to log
  // Day 25: Saturday - weekend, went out, some drinks
  { daysAgo: 25, stressLevel: 6, sleepHours: 6, exercised: false, waterGlasses: 3, mealsHealthy: 1, alcoholUnits: 2 },
  // Day 24: Sunday - hungover, didn't exercise
  { daysAgo: 24, stressLevel: 7, sleepHours: 5, exercised: false, waterGlasses: 3, mealsHealthy: 1, alcoholUnits: 1 },

  // ═══ Week 2: Starting to improve (days 23-17) ═══
  // Day 23: Monday - decided to make changes
  { daysAgo: 23, stressLevel: 6, sleepHours: 6.5, exercised: true, waterGlasses: 4, mealsHealthy: 2, alcoholUnits: 0 },
  // Day 22: Tuesday - better sleep
  { daysAgo: 22, stressLevel: 5, sleepHours: 7, exercised: true, waterGlasses: 5, mealsHealthy: 2, alcoholUnits: 0 },
  // Day 21: Wednesday - stress spike from work deadline
  { daysAgo: 21, stressLevel: 8, sleepHours: 5, exercised: false, waterGlasses: 3, mealsHealthy: 1, alcoholUnits: 0 },
  // Day 20: Thursday - recovered from stress spike
  { daysAgo: 20, stressLevel: 5, sleepHours: 6.5, exercised: true, waterGlasses: 5, mealsHealthy: 2, alcoholUnits: 0 },
  // Day 19: SKIPPED (Friday) - busy evening, forgot to log
  // Day 18: Saturday - weekend drinks but less than before
  { daysAgo: 18, stressLevel: 4, sleepHours: 7, exercised: false, waterGlasses: 4, mealsHealthy: 2, alcoholUnits: 2 },
  // Day 17: Sunday - relaxing day, light exercise
  { daysAgo: 17, stressLevel: 4, sleepHours: 7, exercised: true, waterGlasses: 5, mealsHealthy: 2, alcoholUnits: 0 },

  // ═══ Week 3: Good momentum (days 16-10) ═══
  // Day 16: Monday - great start to the week
  { daysAgo: 16, stressLevel: 4, sleepHours: 7.5, exercised: true, waterGlasses: 6, mealsHealthy: 2, alcoholUnits: 0 },
  // Day 15: Tuesday - building consistency
  { daysAgo: 15, stressLevel: 3, sleepHours: 7.5, exercised: true, waterGlasses: 6, mealsHealthy: 3, alcoholUnits: 0 },
  // Day 14: Wednesday - solid day
  { daysAgo: 14, stressLevel: 4, sleepHours: 8, exercised: true, waterGlasses: 7, mealsHealthy: 2, alcoholUnits: 0 },
  // Day 13: Thursday - slight stress from work but managed
  { daysAgo: 13, stressLevel: 5, sleepHours: 6.5, exercised: true, waterGlasses: 6, mealsHealthy: 2, alcoholUnits: 0 },
  // Day 12: SKIPPED (Friday) - night out, didn't log
  // Day 11: Saturday - weekend but keeping it moderate
  { daysAgo: 11, stressLevel: 3, sleepHours: 8, exercised: true, waterGlasses: 6, mealsHealthy: 2, alcoholUnits: 1 },
  // Day 10: Sunday - rest day but active
  { daysAgo: 10, stressLevel: 3, sleepHours: 8, exercised: false, waterGlasses: 7, mealsHealthy: 3, alcoholUnits: 0 },

  // ═══ Week 4: Best week (days 9-1) ═══
  // Day 9: Monday - strong start
  { daysAgo: 9, stressLevel: 3, sleepHours: 7.5, exercised: true, waterGlasses: 7, mealsHealthy: 3, alcoholUnits: 0 },
  // Day 8: Tuesday - very good day
  { daysAgo: 8, stressLevel: 2, sleepHours: 8, exercised: true, waterGlasses: 7, mealsHealthy: 3, alcoholUnits: 0 },
  // Day 7: Wednesday - hit a rough patch (bad day in good week)
  { daysAgo: 7, stressLevel: 6, sleepHours: 5.5, exercised: false, waterGlasses: 4, mealsHealthy: 1, alcoholUnits: 0 },
  // Day 6: Thursday - bounced back
  { daysAgo: 6, stressLevel: 3, sleepHours: 7, exercised: true, waterGlasses: 7, mealsHealthy: 2, alcoholUnits: 0 },
  // Day 5: Friday - weekend starting but staying disciplined
  { daysAgo: 5, stressLevel: 2, sleepHours: 8, exercised: true, waterGlasses: 7, mealsHealthy: 3, alcoholUnits: 1 },
  // Day 4: Saturday - social but moderate
  { daysAgo: 4, stressLevel: 3, sleepHours: 7.5, exercised: true, waterGlasses: 6, mealsHealthy: 2, alcoholUnits: 2 },
  // Day 3: Sunday - great rest day
  { daysAgo: 3, stressLevel: 2, sleepHours: 8, exercised: true, waterGlasses: 8, mealsHealthy: 3, alcoholUnits: 0 },
  // Day 2: Monday - near perfect
  { daysAgo: 2, stressLevel: 2, sleepHours: 8, exercised: true, waterGlasses: 8, mealsHealthy: 3, alcoholUnits: 0 },
  // Day 1: Tuesday - PERFECT DAY (triggers perfect_score achievement!)
  { daysAgo: 1, stressLevel: 1, sleepHours: 8, exercised: true, waterGlasses: 8, mealsHealthy: 3, alcoholUnits: 0 },
];

// ── Helper: format date as YYYY-MM-DD ──────────────────────────────────

function formatDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

// ── Main seed function ─────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding VitalMind database...');

  // 1. Create demo user with upsert (idempotent)
  const hashedPassword = await bcrypt.hash('demo123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@vitalmind.com' },
    update: {
      name: 'Alex',
      password: hashedPassword,
    },
    create: {
      email: 'demo@vitalmind.com',
      name: 'Alex',
      password: hashedPassword,
    },
  });

  console.log(`✅ Demo user created: ${user.email} (id: ${user.id})`);

  // 2. Generate 30 days of DailyLog data
  let createdCount = 0;
  let skippedCount = 0;

  for (const day of SEED_DATA) {
    const date = formatDate(day.daysAgo);

    // Calculate category scores using exact app formulas
    const mental = calculateMentalScore(day.stressLevel);
    const sleep = calculateSleepScore(day.sleepHours);
    const nutrition = calculateNutritionScore(day.mealsHealthy);
    const exercise = calculateExerciseScore(day.exercised);
    const hydration = calculateHydrationScore(day.waterGlasses);
    const habits = calculateHabitsScore(day.alcoholUnits);
    const vitalScore = calculateVitalScore(mental, sleep, nutrition, exercise, hydration, habits);

    const log = await prisma.dailyLog.upsert({
      where: {
        userId_date: {
          userId: user.id,
          date,
        },
      },
      update: {
        mental,
        sleep,
        nutrition,
        exercise,
        hydration,
        habits,
        sleepHours: day.sleepHours,
        stressLevel: day.stressLevel,
        mealsHealthy: day.mealsHealthy,
        exercised: day.exercised,
        waterGlasses: day.waterGlasses,
        alcoholUnits: day.alcoholUnits,
        vitalScore,
      },
      create: {
        userId: user.id,
        date,
        mental,
        sleep,
        nutrition,
        exercise,
        hydration,
        habits,
        sleepHours: day.sleepHours,
        stressLevel: day.stressLevel,
        mealsHealthy: day.mealsHealthy,
        exercised: day.exercised,
        waterGlasses: day.waterGlasses,
        alcoholUnits: day.alcoholUnits,
        vitalScore,
      },
    });

    if (log) {
      createdCount++;
      console.log(`  📅 ${date}: VitalScore=${vitalScore} (stress=${day.stressLevel}, sleep=${day.sleepHours}h, exercise=${day.exercised}, water=${day.waterGlasses}, meals=${day.mealsHealthy}, alcohol=${day.alcoholUnits})`);
    }
  }

  skippedCount = 30 - SEED_DATA.length; // Days skipped intentionally (3 days)
  console.log(`\n📊 Seed complete: ${createdCount} logs created, ${skippedCount} days skipped for realism`);
  console.log(`👤 Login with: demo@vitalmind.com / demo123`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
