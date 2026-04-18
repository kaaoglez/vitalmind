import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import {
  calculateMentalScore,
  calculateSleepScore,
  calculateNutritionScore,
  calculateExerciseScore,
  calculateHydrationScore,
  calculateHabitsScore,
  calculateVitalScore,
} from '@/lib/vitalscore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const days = parseInt(searchParams.get('days') || '30', 10);

    if (!userId) {
      return NextResponse.json(
        { success: false, logs: [] },
        { status: 400 }
      );
    }

    // Calculate the date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split('T')[0];

    // Fetch logs within the date range, ordered by date descending
    const logs = await db.dailyLog.findMany({
      where: {
        userId,
        date: {
          gte: startDateStr,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      logs,
    });
  } catch (error) {
    console.error('Fetch logs error:', error);
    return NextResponse.json(
      { success: false, logs: [] },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      date,
      sleepHours,
      stressLevel,
      waterGlasses,
      exercised,
      mealsHealthy,
      alcoholUnits,
    } = body;

    // Validate required fields
    if (!userId || !date) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: userId, date' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { success: false, error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Calculate all category scores
    const mental = calculateMentalScore(stressLevel ?? 5);
    const sleep = calculateSleepScore(sleepHours ?? 7);
    const nutrition = calculateNutritionScore(mealsHealthy ?? 0);
    const exercise = calculateExerciseScore(exercised ?? false);
    const hydration = calculateHydrationScore(waterGlasses ?? 4);
    const habits = calculateHabitsScore(alcoholUnits ?? 0);

    // Calculate overall VitalScore
    const vitalScore = calculateVitalScore(mental, sleep, nutrition, exercise, hydration, habits);

    // Upsert the daily log (create or update if same userId+date)
    const log = await db.dailyLog.upsert({
      where: {
        userId_date: {
          userId,
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
        sleepHours: sleepHours ?? null,
        stressLevel: stressLevel ?? null,
        mealsHealthy: mealsHealthy ?? null,
        exercised: exercised ?? false,
        waterGlasses: waterGlasses ?? null,
        alcoholUnits: alcoholUnits ?? null,
        vitalScore,
      },
      create: {
        userId,
        date,
        mental,
        sleep,
        nutrition,
        exercise,
        hydration,
        habits,
        sleepHours: sleepHours ?? null,
        stressLevel: stressLevel ?? null,
        mealsHealthy: mealsHealthy ?? null,
        exercised: exercised ?? false,
        waterGlasses: waterGlasses ?? null,
        alcoholUnits: alcoholUnits ?? null,
        vitalScore,
      },
    });

    return NextResponse.json({
      success: true,
      log,
      vitalScore,
    });
  } catch (error) {
    console.error('Save log error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save daily log' },
      { status: 500 }
    );
  }
}
