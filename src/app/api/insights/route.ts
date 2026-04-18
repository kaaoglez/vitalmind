import { NextResponse } from 'next/server';
import type { LogEntry, InsightItem } from '@/lib/vitalscore';

// ── Rule-based fallback insights ─────────────────────────────────────

function generateRuleBasedInsights(logs: LogEntry[]): InsightItem[] {
  const insights: InsightItem[] = [];
  let idCounter = 0;

  if (logs.length === 0) {
    return [
      {
        id: `insight-${idCounter++}`,
        emoji: '📋',
        title: 'No data yet',
        description: 'Start logging your daily wellness to receive personalized insights about your health patterns.',
        type: 'info',
      },
    ];
  }

  // Calculate averages
  const avgStress = logs.reduce((s, l) => s + (l.stressLevel ?? 5), 0) / logs.length;
  const avgSleep = logs.reduce((s, l) => s + (l.sleepHours ?? 7), 0) / logs.length;
  const avgWater = logs.reduce((s, l) => s + (l.waterGlasses ?? 4), 0) / logs.length;
  const avgMeals = logs.reduce((s, l) => s + (l.mealsHealthy ?? 0), 0) / logs.length;
  const exerciseRate = logs.filter((l) => l.exercised).length / logs.length;
  const avgAlcohol = logs.reduce((s, l) => s + (l.alcoholUnits ?? 0), 0) / logs.length;
  const avgVitalScore = logs.reduce((s, l) => s + (l.vitalScore ?? 50), 0) / logs.length;

  // Stress insights
  if (avgStress >= 7) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '😰',
      title: 'High Stress Levels',
      description: `Your average stress level is ${avgStress.toFixed(1)}/10. Consider mindfulness exercises, deep breathing, or talking to someone you trust.`,
      type: 'negative',
    });
  } else if (avgStress <= 3) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '😌',
      title: 'Low Stress Levels',
      description: `Great job! Your average stress level is only ${avgStress.toFixed(1)}/10. Keep up whatever you're doing to maintain this calm state.`,
      type: 'positive',
    });
  }

  // Sleep insights
  if (avgSleep < 6) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '😴',
      title: 'Insufficient Sleep',
      description: `You're averaging ${avgSleep.toFixed(1)} hours of sleep. Most adults need 7-9 hours for optimal health and cognitive function.`,
      type: 'negative',
    });
  } else if (avgSleep >= 7 && avgSleep <= 9) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🌙',
      title: 'Healthy Sleep Pattern',
      description: `You're averaging ${avgSleep.toFixed(1)} hours of sleep, which is within the recommended 7-9 hour range. Well done!`,
      type: 'positive',
    });
  } else if (avgSleep > 9) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🛌',
      title: 'Oversleeping Detected',
      description: `You're averaging ${avgSleep.toFixed(1)} hours of sleep. Consistently sleeping more than 9 hours may indicate underlying health issues.`,
      type: 'neutral',
    });
  }

  // Hydration insights
  if (avgWater < 5) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '💧',
      title: 'Low Hydration',
      description: `You're drinking an average of ${avgWater.toFixed(1)} glasses of water daily. Aim for at least 8 glasses to stay properly hydrated.`,
      type: 'negative',
    });
  } else if (avgWater >= 8) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '💦',
      title: 'Well Hydrated',
      description: `You're averaging ${avgWater.toFixed(1)} glasses of water daily. Great hydration habits support overall wellness.`,
      type: 'positive',
    });
  }

  // Exercise insights
  if (exerciseRate < 0.3) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🏃',
      title: 'Low Exercise Frequency',
      description: `You exercised on only ${(exerciseRate * 100).toFixed(0)}% of logged days. Regular physical activity significantly improves mental and physical health.`,
      type: 'negative',
    });
  } else if (exerciseRate >= 0.7) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '💪',
      title: 'Active Lifestyle',
      description: `You exercised on ${(exerciseRate * 100).toFixed(0)}% of logged days. Your commitment to physical activity is paying off!`,
      type: 'positive',
    });
  }

  // Nutrition insights
  if (avgMeals < 1.5) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🥗',
      title: 'Room for Nutritional Improvement',
      description: `You're averaging ${avgMeals.toFixed(1)} healthy meals per day. Try incorporating more whole foods, fruits, and vegetables into your diet.`,
      type: 'negative',
    });
  } else if (avgMeals >= 2.5) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🥬',
      title: 'Nutritious Eating Habits',
      description: `You're averaging ${avgMeals.toFixed(1)} healthy meals per day. Your nutritional choices are supporting your overall wellness.`,
      type: 'positive',
    });
  }

  // Alcohol insights
  if (avgAlcohol >= 3) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🍷',
      title: 'High Alcohol Consumption',
      description: `You're averaging ${avgAlcohol.toFixed(1)} alcohol units daily. Consider reducing intake for better sleep, mental clarity, and overall health.`,
      type: 'negative',
    });
  }

  // Overall VitalScore insight
  if (avgVitalScore >= 80) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🌟',
      title: 'Excellent Overall Wellness',
      description: `Your average VitalScore is ${avgVitalScore.toFixed(0)}/100. You're doing great across all wellness categories!`,
      type: 'positive',
    });
  } else if (avgVitalScore < 40) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '⚠️',
      title: 'Wellness Needs Attention',
      description: `Your average VitalScore is ${avgVitalScore.toFixed(0)}/100. Focus on small improvements in your weakest areas for the biggest impact.`,
      type: 'negative',
    });
  }

  // Trend insight if enough data
  if (logs.length >= 5) {
    const recentScores = logs.slice(0, Math.min(3, logs.length)).map((l) => l.vitalScore ?? 50);
    const olderScores = logs.slice(Math.min(3, logs.length), Math.min(6, logs.length)).map((l) => l.vitalScore ?? 50);
    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg = olderScores.length > 0 ? olderScores.reduce((a, b) => a + b, 0) / olderScores.length : recentAvg;
    const diff = recentAvg - olderAvg;

    if (diff > 5) {
      insights.push({
        id: `insight-${idCounter++}`,
        emoji: '📈',
        title: 'Upward Trend',
        description: `Your VitalScore has improved by ${diff.toFixed(0)} points recently. Your positive habits are making a difference!`,
        type: 'positive',
      });
    } else if (diff < -5) {
      insights.push({
        id: `insight-${idCounter++}`,
        emoji: '📉',
        title: 'Downward Trend',
        description: `Your VitalScore has decreased by ${Math.abs(diff).toFixed(0)} points recently. Consider reviewing recent changes in your routine.`,
        type: 'negative',
      });
    }
  }

  // If no specific insights were generated, add a general one
  if (insights.length === 0) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '📊',
      title: 'Tracking Your Progress',
      description: `You've logged ${logs.length} day${logs.length === 1 ? '' : 's'}. Keep logging consistently to unlock more detailed insights about your wellness patterns.`,
      type: 'neutral',
    });
  }

  return insights;
}

// ── POST handler ─────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { logs } = body as { logs: LogEntry[] };

    if (!logs || !Array.isArray(logs) || logs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No log data provided' },
        { status: 400 }
      );
    }

    // Try AI-powered insights first
    try {
      const ZAI = (await import('z-ai-web-dev-sdk')).default;
      const zai = await ZAI.create();

      // Prepare a summary of the logs for the LLM
      const logSummary = logs.map((l) => ({
        date: l.date,
        vitalScore: l.vitalScore,
        stressLevel: l.stressLevel,
        sleepHours: l.sleepHours,
        exercised: l.exercised,
        waterGlasses: l.waterGlasses,
        mealsHealthy: l.mealsHealthy,
        alcoholUnits: l.alcoholUnits,
        mental: l.mental,
        sleep: l.sleep,
        nutrition: l.nutrition,
        exercise: l.exercise,
        hydration: l.hydration,
        habits: l.habits,
      }));

      const prompt = `You are a wellness analysis AI. Analyze the following daily wellness logs and provide insights. Each log contains scores from 0-100 for mental, sleep, nutrition, exercise, hydration, and habits categories, plus raw inputs.

Logs (most recent first):
${JSON.stringify(logSummary, null, 2)}

Provide 3-6 insights as a JSON array. Each insight must have:
- id: a unique string like "insight-0", "insight-1", etc.
- emoji: a single relevant emoji
- title: a short title (5-8 words)
- description: a helpful description (1-2 sentences with specific data from the logs)
- type: one of "positive", "negative", "neutral", "info"

Focus on patterns, trends, correlations, and actionable observations. Be specific with numbers from the data.

Return ONLY the JSON array, no other text.`;

      const response = await zai.chat.completions.create({
        model: 'default',
        messages: [
          {
            role: 'system',
            content: 'You are a wellness analysis AI that provides insights based on health tracking data. Always respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      });

      const content = response.choices?.[0]?.message?.content;
      if (content) {
        // Try to parse the AI response as JSON
        let parsed: InsightItem[];
        try {
          // Handle potential markdown code blocks
          const jsonStr = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
          parsed = JSON.parse(jsonStr);
        } catch {
          // If parsing fails, fall back to rule-based
          console.warn('Failed to parse AI insights response, falling back to rule-based');
          parsed = generateRuleBasedInsights(logs);
        }

        if (Array.isArray(parsed) && parsed.length > 0) {
          return NextResponse.json({
            success: true,
            insights: parsed,
          });
        }
      }
    } catch (aiError) {
      console.warn('AI insights generation failed, falling back to rule-based:', aiError);
    }

    // Fallback to rule-based insights
    const insights = generateRuleBasedInsights(logs);
    return NextResponse.json({
      success: true,
      insights,
    });
  } catch (error) {
    console.error('Insights error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
