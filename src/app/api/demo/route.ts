import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

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

// ── Seed data definition ───────────────────────────────────────────────

interface DayData {
  daysAgo: number;
  stressLevel: number;
  sleepHours: number;
  exercised: boolean;
  waterGlasses: number;
  mealsHealthy: number;
  alcoholUnits: number;
}

const SEED_DATA: DayData[] = [
  // ═══ Week 1: Rough start (days 30-24) ═══
  { daysAgo: 30, stressLevel: 7, sleepHours: 5, exercised: false, waterGlasses: 3, mealsHealthy: 1, alcoholUnits: 0 },
  { daysAgo: 29, stressLevel: 8, sleepHours: 5.5, exercised: false, waterGlasses: 4, mealsHealthy: 1, alcoholUnits: 0 },
  { daysAgo: 28, stressLevel: 6, sleepHours: 6, exercised: true, waterGlasses: 4, mealsHealthy: 2, alcoholUnits: 0 },
  { daysAgo: 27, stressLevel: 7, sleepHours: 5.5, exercised: false, waterGlasses: 3, mealsHealthy: 1, alcoholUnits: 0 },
  // Day 26: SKIPPED
  { daysAgo: 25, stressLevel: 6, sleepHours: 6, exercised: false, waterGlasses: 3, mealsHealthy: 1, alcoholUnits: 2 },
  { daysAgo: 24, stressLevel: 7, sleepHours: 5, exercised: false, waterGlasses: 3, mealsHealthy: 1, alcoholUnits: 1 },

  // ═══ Week 2: Starting to improve (days 23-17) ═══
  { daysAgo: 23, stressLevel: 6, sleepHours: 6.5, exercised: true, waterGlasses: 4, mealsHealthy: 2, alcoholUnits: 0 },
  { daysAgo: 22, stressLevel: 5, sleepHours: 7, exercised: true, waterGlasses: 5, mealsHealthy: 2, alcoholUnits: 0 },
  { daysAgo: 21, stressLevel: 8, sleepHours: 5, exercised: false, waterGlasses: 3, mealsHealthy: 1, alcoholUnits: 0 },
  { daysAgo: 20, stressLevel: 5, sleepHours: 6.5, exercised: true, waterGlasses: 5, mealsHealthy: 2, alcoholUnits: 0 },
  // Day 19: SKIPPED
  { daysAgo: 18, stressLevel: 4, sleepHours: 7, exercised: false, waterGlasses: 4, mealsHealthy: 2, alcoholUnits: 2 },
  { daysAgo: 17, stressLevel: 4, sleepHours: 7, exercised: true, waterGlasses: 5, mealsHealthy: 2, alcoholUnits: 0 },

  // ═══ Week 3: Good momentum (days 16-10) ═══
  { daysAgo: 16, stressLevel: 4, sleepHours: 7.5, exercised: true, waterGlasses: 6, mealsHealthy: 2, alcoholUnits: 0 },
  { daysAgo: 15, stressLevel: 3, sleepHours: 7.5, exercised: true, waterGlasses: 6, mealsHealthy: 3, alcoholUnits: 0 },
  { daysAgo: 14, stressLevel: 4, sleepHours: 8, exercised: true, waterGlasses: 7, mealsHealthy: 2, alcoholUnits: 0 },
  { daysAgo: 13, stressLevel: 5, sleepHours: 6.5, exercised: true, waterGlasses: 6, mealsHealthy: 2, alcoholUnits: 0 },
  // Day 12: SKIPPED
  { daysAgo: 11, stressLevel: 3, sleepHours: 8, exercised: true, waterGlasses: 6, mealsHealthy: 2, alcoholUnits: 1 },
  { daysAgo: 10, stressLevel: 3, sleepHours: 8, exercised: false, waterGlasses: 7, mealsHealthy: 3, alcoholUnits: 0 },

  // ═══ Week 4: Best week (days 9-1) ═══
  { daysAgo: 9, stressLevel: 3, sleepHours: 7.5, exercised: true, waterGlasses: 7, mealsHealthy: 3, alcoholUnits: 0 },
  { daysAgo: 8, stressLevel: 2, sleepHours: 8, exercised: true, waterGlasses: 7, mealsHealthy: 3, alcoholUnits: 0 },
  { daysAgo: 7, stressLevel: 6, sleepHours: 5.5, exercised: false, waterGlasses: 4, mealsHealthy: 1, alcoholUnits: 0 },
  { daysAgo: 6, stressLevel: 3, sleepHours: 7, exercised: true, waterGlasses: 7, mealsHealthy: 2, alcoholUnits: 0 },
  { daysAgo: 5, stressLevel: 2, sleepHours: 8, exercised: true, waterGlasses: 7, mealsHealthy: 3, alcoholUnits: 1 },
  { daysAgo: 4, stressLevel: 3, sleepHours: 7.5, exercised: true, waterGlasses: 6, mealsHealthy: 2, alcoholUnits: 2 },
  { daysAgo: 3, stressLevel: 2, sleepHours: 8, exercised: true, waterGlasses: 8, mealsHealthy: 3, alcoholUnits: 0 },
  { daysAgo: 2, stressLevel: 2, sleepHours: 8, exercised: true, waterGlasses: 8, mealsHealthy: 3, alcoholUnits: 0 },
  // PERFECT DAY - triggers perfect_score achievement!
  { daysAgo: 1, stressLevel: 1, sleepHours: 8, exercised: true, waterGlasses: 8, mealsHealthy: 3, alcoholUnits: 0 },
];

// ── Helper: format date as YYYY-MM-DD ──────────────────────────────────

function formatDate(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
}

// ── GET: Check if demo user exists ─────────────────────────────────────

export async function GET() {
  try {
    const user = await db.user.findUnique({
      where: { email: 'demo@vitalmind.com' },
    });

    if (!user) {
      return NextResponse.json({
        success: true,
        exists: false,
        userId: null,
      });
    }

    // Count how many logs the demo user has
    const logCount = await db.dailyLog.count({
      where: { userId: user.id },
    });

    return NextResponse.json({
      success: true,
      exists: true,
      userId: user.id,
      logCount,
    });
  } catch (error) {
    console.error('Demo check error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to check demo user' },
      { status: 500 }
    );
  }
}

// ── POST: Seed demo data ───────────────────────────────────────────────

export async function POST() {
  try {
    // 1. Create or update demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);

    const user = await db.user.upsert({
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

    // 2. Generate 30 days of DailyLog data
    let createdCount = 0;

    for (const day of SEED_DATA) {
      const date = formatDate(day.daysAgo);

      const mental = calculateMentalScore(day.stressLevel);
      const sleep = calculateSleepScore(day.sleepHours);
      const nutrition = calculateNutritionScore(day.mealsHealthy);
      const exercise = calculateExerciseScore(day.exercised);
      const hydration = calculateHydrationScore(day.waterGlasses);
      const habits = calculateHabitsScore(day.alcoholUnits);
      const vitalScore = calculateVitalScore(mental, sleep, nutrition, exercise, hydration, habits);

      await db.dailyLog.upsert({
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

      createdCount++;
    }

    const skippedDays = 30 - SEED_DATA.length;

    return NextResponse.json({
      success: true,
      userId: user.id,
      message: `Demo data seeded: ${createdCount} logs created, ${skippedDays} days skipped. Login: demo@vitalmind.com / demo123`,
    });
  } catch (error) {
    console.error('Demo seed error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to seed demo data' },
      { status: 500 }
    );
  }
}
