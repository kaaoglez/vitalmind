import { NextResponse } from 'next/server';
import type { LogEntry, InsightItem } from '@/lib/vitalscore';

// ── Language support ──────────────────────────────────────────────────

type SupportedLocale = 'es' | 'en' | 'pt' | 'fr';

const LANGUAGE_NAMES: Record<SupportedLocale, string> = {
  es: 'Spanish (Español)',
  en: 'English',
  pt: 'Portuguese (Português)',
  fr: 'French (Français)',
};

// ── Rule-based fallback insights (multilingual) ──────────────────────

function generateRuleBasedInsights(logs: LogEntry[], locale: SupportedLocale = 'en'): InsightItem[] {
  const insights: InsightItem[] = [];
  let idCounter = 0;

  const t: Record<SupportedLocale, Record<string, string>> = {
    es: {
      noData: 'Sin datos aún',
      noDataDesc: 'Comienza a registrar tu bienestar diario para recibir insights personalizados sobre tus patrones de salud.',
      highStress: 'Niveles altos de estrés',
      highStressDesc: 'Tu nivel promedio de estrés es {stress}/10. Considera ejercicios de mindfulness, respiración profunda o hablar con alguien de confianza.',
      lowStress: 'Niveles bajos de estrés',
      lowStressDesc: '¡Excelente! Tu nivel promedio de estrés es solo {stress}/10. Sigue haciendo lo que haces para mantener este estado de calma.',
      insufficientSleep: 'Sueño insuficiente',
      insufficientSleepDesc: 'Estás promediando {sleep} horas de sueño. La mayoría de los adultos necesitan 7-9 horas para una salud y función cognitiva óptimas.',
      healthySleep: 'Patrón de sueño saludable',
      healthySleepDesc: 'Estás promediando {sleep} horas de sueño, dentro del rango recomendado de 7-9 horas. ¡Bien hecho!',
      oversleeping: 'Exceso de sueño detectado',
      oversleepingDesc: 'Estás promediando {sleep} horas de sueño. Dormir consistentemente más de 9 horas puede indicar problemas de salud subyacentes.',
      lowHydration: 'Hidratación baja',
      lowHydrationDesc: 'Estás bebiendo un promedio de {water} vasos de agua diarios. Intenta al menos 8 vasos para mantenerte adecuadamente hidratado.',
      wellHydrated: 'Bien hidratado',
      wellHydratedDesc: 'Estás promediando {water} vasos de agua diarios. Excelentes hábitos de hidratación que apoyan tu bienestar general.',
      lowExercise: 'Frecuencia de ejercicio baja',
      lowExerciseDesc: 'Solo ejercitaste el {rate}% de los días registrados. La actividad física regular mejora significativamente la salud mental y física.',
      activeLifestyle: 'Estilo de vida activo',
      activeLifestyleDesc: 'Ejercitaste el {rate}% de los días registrados. ¡Tu compromiso con la actividad física está dando resultados!',
      roomNutrition: 'Mejora nutricional posible',
      roomNutritionDesc: 'Estás promediando {meals} comidas saludables por día. Intenta incorporar más alimentos integrales, frutas y vegetales en tu dieta.',
      nutritiousEating: 'Hábitos nutricionales saludables',
      nutritiousEatingDesc: 'Estás promediando {meals} comidas saludables por día. Tus elecciones nutricionales apoyan tu bienestar general.',
      highAlcohol: 'Consumo alto de alcohol',
      highAlcoholDesc: 'Estás promediando {alcohol} unidades de alcohol diarias. Considera reducir el consumo para mejorar el sueño, la claridad mental y la salud general.',
      excellentWellness: 'Bienestar general excelente',
      excellentWellnessDesc: 'Tu VitalScore promedio es {score}/100. ¡Estás haciendo un gran trabajo en todas las categorías de bienestar!',
      wellnessNeeds: 'El bienestar necesita atención',
      wellnessNeedsDesc: 'Tu VitalScore promedio es {score}/100. Enfócate en pequeñas mejoras en tus áreas más débiles para el mayor impacto.',
      upwardTrend: 'Tendencia ascendente',
      upwardTrendDesc: 'Tu VitalScore ha mejorado {diff} puntos recientemente. ¡Tus hábitos positivos están marcando la diferencia!',
      downwardTrend: 'Tendencia descendente',
      downwardTrendDesc: 'Tu VitalScore ha disminuido {diff} puntos recientemente. Considera revisar los cambios recientes en tu rutina.',
      trackingProgress: 'Monitoreando tu progreso',
      trackingProgressDesc: 'Has registrado {days} día(s). Sigue registrando consistentemente para desbloquear insights más detallados sobre tus patrones de bienestar.',
    },
    en: {
      noData: 'No data yet',
      noDataDesc: 'Start logging your daily wellness to receive personalized insights about your health patterns.',
      highStress: 'High Stress Levels',
      highStressDesc: 'Your average stress level is {stress}/10. Consider mindfulness exercises, deep breathing, or talking to someone you trust.',
      lowStress: 'Low Stress Levels',
      lowStressDesc: "Great job! Your average stress level is only {stress}/10. Keep up whatever you're doing to maintain this calm state.",
      insufficientSleep: 'Insufficient Sleep',
      insufficientSleepDesc: "You're averaging {sleep} hours of sleep. Most adults need 7-9 hours for optimal health and cognitive function.",
      healthySleep: 'Healthy Sleep Pattern',
      healthySleepDesc: "You're averaging {sleep} hours of sleep, which is within the recommended 7-9 hour range. Well done!",
      oversleeping: 'Oversleeping Detected',
      oversleepingDesc: "You're averaging {sleep} hours of sleep. Consistently sleeping more than 9 hours may indicate underlying health issues.",
      lowHydration: 'Low Hydration',
      lowHydrationDesc: "You're drinking an average of {water} glasses of water daily. Aim for at least 8 glasses to stay properly hydrated.",
      wellHydrated: 'Well Hydrated',
      wellHydratedDesc: "You're averaging {water} glasses of water daily. Great hydration habits support overall wellness.",
      lowExercise: 'Low Exercise Frequency',
      lowExerciseDesc: 'You exercised on only {rate}% of logged days. Regular physical activity significantly improves mental and physical health.',
      activeLifestyle: 'Active Lifestyle',
      activeLifestyleDesc: 'You exercised on {rate}% of logged days. Your commitment to physical activity is paying off!',
      roomNutrition: 'Room for Nutritional Improvement',
      roomNutritionDesc: "You're averaging {meals} healthy meals per day. Try incorporating more whole foods, fruits, and vegetables into your diet.",
      nutritiousEating: 'Nutritious Eating Habits',
      nutritiousEatingDesc: "You're averaging {meals} healthy meals per day. Your nutritional choices are supporting your overall wellness.",
      highAlcohol: 'High Alcohol Consumption',
      highAlcoholDesc: "You're averaging {alcohol} alcohol units daily. Consider reducing intake for better sleep, mental clarity, and overall health.",
      excellentWellness: 'Excellent Overall Wellness',
      excellentWellnessDesc: "Your average VitalScore is {score}/100. You're doing great across all wellness categories!",
      wellnessNeeds: 'Wellness Needs Attention',
      wellnessNeedsDesc: 'Your average VitalScore is {score}/100. Focus on small improvements in your weakest areas for the biggest impact.',
      upwardTrend: 'Upward Trend',
      upwardTrendDesc: 'Your VitalScore has improved by {diff} points recently. Your positive habits are making a difference!',
      downwardTrend: 'Downward Trend',
      downwardTrendDesc: 'Your VitalScore has decreased by {diff} points recently. Consider reviewing recent changes in your routine.',
      trackingProgress: 'Tracking Your Progress',
      trackingProgressDesc: "You've logged {days} day(s). Keep logging consistently to unlock more detailed insights about your wellness patterns.",
    },
    pt: {
      noData: 'Sem dados ainda',
      noDataDesc: 'Comece a registrar seu bem-estar diário para receber insights personalizados sobre seus padrões de saúde.',
      highStress: 'Níveis altos de estresse',
      highStressDesc: 'Seu nível médio de estresse é {stress}/10. Considere exercícios de mindfulness, respiração profunda ou conversar com alguém de confiança.',
      lowStress: 'Níveis baixos de estresse',
      lowStressDesc: 'Excelente! Seu nível médio de estresse é apenas {stress}/10. Continue fazendo o que você faz para manter este estado de calma.',
      insufficientSleep: 'Sono insuficiente',
      insufficientSleepDesc: 'Você está dormindo em média {sleep} horas. A maioria dos adultos precisa de 7-9 horas para saúde e função cognitiva ideais.',
      healthySleep: 'Padrão de sono saudável',
      healthySleepDesc: 'Você está dormindo em média {sleep} horas, dentro da faixa recomendada de 7-9 horas. Muito bem!',
      oversleeping: 'Excesso de sono detectado',
      oversleepingDesc: 'Você está dormindo em média {sleep} horas. Dormir consistentemente mais de 9 horas pode indicar problemas de saúde subjacentes.',
      lowHydration: 'Hidratação baixa',
      lowHydrationDesc: 'Você está bebendo em média {water} copos de água por dia. Tente pelo menos 8 copos para se manter adequadamente hidratado.',
      wellHydrated: 'Bem hidratado',
      wellHydratedDesc: 'Você está bebendo em média {water} copos de água por dia. Ótimos hábitos de hidratação que apoiam seu bem-estar geral.',
      lowExercise: 'Frequência de exercício baixa',
      lowExerciseDesc: 'Você se exercitou apenas em {rate}% dos dias registrados. A atividade física regular melhora significativamente a saúde mental e física.',
      activeLifestyle: 'Estilo de vida ativo',
      activeLifestyleDesc: 'Você se exercitou em {rate}% dos dias registrados. Seu compromisso com a atividade física está dando resultados!',
      roomNutrition: 'Melhoria nutricional possível',
      roomNutritionDesc: 'Você está com uma média de {meals} refeições saudáveis por dia. Tente incorporar mais alimentos integrais, frutas e vegetais na sua dieta.',
      nutritiousEating: 'Hábitos nutricionais saudáveis',
      nutritiousEatingDesc: 'Você está com uma média de {meals} refeições saudáveis por dia. Suas escolhas nutricionais apoiam seu bem-estar geral.',
      highAlcohol: 'Consumo alto de álcool',
      highAlcoholDesc: 'Você está com uma média de {alcohol} unidades de álcool por dia. Considere reduzir o consumo para melhorar o sono, a clareza mental e a saúde geral.',
      excellentWellness: 'Bem-estar geral excelente',
      excellentWellnessDesc: 'Seu VitalScore médio é {score}/100. Você está se saindo muito bem em todas as categorias de bem-estar!',
      wellnessNeeds: 'Bem-estar precisa de atenção',
      wellnessNeedsDesc: 'Seu VitalScore médio é {score}/100. Foque em pequenas melhorias nas suas áreas mais fracas para o maior impacto.',
      upwardTrend: 'Tendência ascendente',
      upwardTrendDesc: 'Seu VitalScore melhorou {diff} pontos recentemente. Seus hábitos positivos estão fazendo a diferença!',
      downwardTrend: 'Tendência descendente',
      downwardTrendDesc: 'Seu VitalScore diminuiu {diff} pontos recentemente. Considere revisar as mudanças recentes na sua rotina.',
      trackingProgress: 'Monitorando seu progresso',
      trackingProgressDesc: 'Você registrou {days} dia(s). Continue registrando consistentemente para desbloquear insights mais detalhados sobre seus padrões de bem-estar.',
    },
    fr: {
      noData: 'Pas encore de données',
      noDataDesc: 'Commencez à enregistrer votre bien-être quotidien pour recevoir des insights personnalisés sur vos habitudes de santé.',
      highStress: 'Niveaux de stress élevés',
      highStressDesc: 'Votre niveau de stress moyen est de {stress}/10. Envisagez des exercices de pleine conscience, la respiration profonde ou parler à quelqu\'un en qui vous avez confiance.',
      lowStress: 'Niveaux de stress faibles',
      lowStressDesc: 'Bravo ! Votre niveau de stress moyen n\'est que de {stress}/10. Continuez ce que vous faites pour maintenir cet état de calme.',
      insufficientSleep: 'Sommeil insuffisant',
      insufficientSleepDesc: 'Vous dormez en moyenne {sleep} heures. La plupart des adultes ont besoin de 7-9 heures pour une santé et une fonction cognitive optimales.',
      healthySleep: 'Habitudes de sommeil saines',
      healthySleepDesc: 'Vous dormez en moyenne {sleep} heures, ce qui est dans la plage recommandée de 7-9 heures. Bien fait !',
      oversleeping: 'Excès de sommeil détecté',
      oversleepingDesc: 'Vous dormez en moyenne {sleep} heures. Dormir constamment plus de 9 heures peut indiquer des problèmes de santé sous-jacents.',
      lowHydration: 'Hydratation faible',
      lowHydrationDesc: 'Vous buvez en moyenne {water} verres d\'eau par jour. Visez au moins 8 verres pour rester correctement hydraté.',
      wellHydrated: 'Bien hydraté',
      wellHydratedDesc: 'Vous buvez en moyenne {water} verres d\'eau par jour. De bonnes habitudes d\'hydratation soutiennent votre bien-être général.',
      lowExercise: 'Fréquence d\'exercice faible',
      lowExerciseDesc: 'Vous vous êtes exercé seulement {rate}% des jours enregistrés. L\'activité physique régulière améliore significativement la santé mentale et physique.',
      activeLifestyle: 'Mode de vie actif',
      activeLifestyleDesc: 'Vous vous êtes exercé {rate}% des jours enregistrés. Votre engagement envers l\'activité physique porte ses fruits !',
      roomNutrition: 'Amélioration nutritionnelle possible',
      roomNutritionDesc: 'Vous avez en moyenne {meals} repas sains par jour. Essayez d\'incorporer plus d\'aliments complets, de fruits et de légumes dans votre alimentation.',
      nutritiousEating: 'Habitudes nutritionnelles saines',
      nutritiousEatingDesc: 'Vous avez en moyenne {meals} repas sains par jour. Vos choix nutritionnels soutiennent votre bien-être général.',
      highAlcohol: 'Consommation d\'alcool élevée',
      highAlcoholDesc: 'Vous consommez en moyenne {alcohol} unités d\'alcool par jour. Envisagez de réduire votre consommation pour améliorer le sommeil, la clarté mentale et la santé générale.',
      excellentWellness: 'Bien-être général excellent',
      excellentWellnessDesc: 'Votre VitalScore moyen est de {score}/100. Vous vous débrouillez très bien dans toutes les catégories de bien-être !',
      wellnessNeeds: 'Le bien-être nécessite de l\'attention',
      wellnessNeedsDesc: 'Votre VitalScore moyen est de {score}/100. Concentrez-vous sur de petites améliorations dans vos domaines les plus faibles pour un impact maximal.',
      upwardTrend: 'Tendance à la hausse',
      upwardTrendDesc: 'Votre VitalScore s\'est amélioré de {diff} points récemment. Vos habitudes positives font la différence !',
      downwardTrend: 'Tendance à la baisse',
      downwardTrendDesc: 'Votre VitalScore a diminué de {diff} points récemment. Envisagez de revoir les changements récents dans votre routine.',
      trackingProgress: 'Suivi de votre progression',
      trackingProgressDesc: 'Vous avez enregistré {days} jour(s). Continuez à enregistrer régulièrement pour débloquer des insights plus détaillés sur vos habitudes de bien-être.',
    },
  };

  const s = t[locale] || t.en;

  const fmt = (template: string, vars: Record<string, string | number>) =>
    template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));

  if (logs.length === 0) {
    return [
      {
        id: `insight-${idCounter++}`,
        emoji: '📋',
        title: s.noData,
        description: s.noDataDesc,
        type: 'info',
      },
    ];
  }

  // Calculate averages
  const avgStress = logs.reduce((acc, l) => acc + (l.stressLevel ?? 5), 0) / logs.length;
  const avgSleep = logs.reduce((acc, l) => acc + (l.sleepHours ?? 7), 0) / logs.length;
  const avgWater = logs.reduce((acc, l) => acc + (l.waterGlasses ?? 4), 0) / logs.length;
  const avgMeals = logs.reduce((acc, l) => acc + (l.mealsHealthy ?? 0), 0) / logs.length;
  const exerciseRate = logs.filter((l) => l.exercised).length / logs.length;
  const avgAlcohol = logs.reduce((acc, l) => acc + (l.alcoholUnits ?? 0), 0) / logs.length;
  const avgVitalScore = logs.reduce((acc, l) => acc + (l.vitalScore ?? 50), 0) / logs.length;

  // Stress insights
  if (avgStress >= 7) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '😰',
      title: s.highStress,
      description: fmt(s.highStressDesc, { stress: avgStress.toFixed(1) }),
      type: 'negative',
    });
  } else if (avgStress <= 3) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '😌',
      title: s.lowStress,
      description: fmt(s.lowStressDesc, { stress: avgStress.toFixed(1) }),
      type: 'positive',
    });
  }

  // Sleep insights
  if (avgSleep < 6) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '😴',
      title: s.insufficientSleep,
      description: fmt(s.insufficientSleepDesc, { sleep: avgSleep.toFixed(1) }),
      type: 'negative',
    });
  } else if (avgSleep >= 7 && avgSleep <= 9) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🌙',
      title: s.healthySleep,
      description: fmt(s.healthySleepDesc, { sleep: avgSleep.toFixed(1) }),
      type: 'positive',
    });
  } else if (avgSleep > 9) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🛌',
      title: s.oversleeping,
      description: fmt(s.oversleepingDesc, { sleep: avgSleep.toFixed(1) }),
      type: 'neutral',
    });
  }

  // Hydration insights
  if (avgWater < 5) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '💧',
      title: s.lowHydration,
      description: fmt(s.lowHydrationDesc, { water: avgWater.toFixed(1) }),
      type: 'negative',
    });
  } else if (avgWater >= 8) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '💦',
      title: s.wellHydrated,
      description: fmt(s.wellHydratedDesc, { water: avgWater.toFixed(1) }),
      type: 'positive',
    });
  }

  // Exercise insights
  if (exerciseRate < 0.3) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🏃',
      title: s.lowExercise,
      description: fmt(s.lowExerciseDesc, { rate: (exerciseRate * 100).toFixed(0) }),
      type: 'negative',
    });
  } else if (exerciseRate >= 0.7) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '💪',
      title: s.activeLifestyle,
      description: fmt(s.activeLifestyleDesc, { rate: (exerciseRate * 100).toFixed(0) }),
      type: 'positive',
    });
  }

  // Nutrition insights
  if (avgMeals < 1.5) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🥗',
      title: s.roomNutrition,
      description: fmt(s.roomNutritionDesc, { meals: avgMeals.toFixed(1) }),
      type: 'negative',
    });
  } else if (avgMeals >= 2.5) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🥬',
      title: s.nutritiousEating,
      description: fmt(s.nutritiousEatingDesc, { meals: avgMeals.toFixed(1) }),
      type: 'positive',
    });
  }

  // Alcohol insights
  if (avgAlcohol >= 3) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🍷',
      title: s.highAlcohol,
      description: fmt(s.highAlcoholDesc, { alcohol: avgAlcohol.toFixed(1) }),
      type: 'negative',
    });
  }

  // Overall VitalScore insight
  if (avgVitalScore >= 80) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🌟',
      title: s.excellentWellness,
      description: fmt(s.excellentWellnessDesc, { score: avgVitalScore.toFixed(0) }),
      type: 'positive',
    });
  } else if (avgVitalScore < 40) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '⚠️',
      title: s.wellnessNeeds,
      description: fmt(s.wellnessNeedsDesc, { score: avgVitalScore.toFixed(0) }),
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
        title: s.upwardTrend,
        description: fmt(s.upwardTrendDesc, { diff: diff.toFixed(0) }),
        type: 'positive',
      });
    } else if (diff < -5) {
      insights.push({
        id: `insight-${idCounter++}`,
        emoji: '📉',
        title: s.downwardTrend,
        description: fmt(s.downwardTrendDesc, { diff: Math.abs(diff).toFixed(0) }),
        type: 'negative',
      });
    }
  }

  // If no specific insights were generated, add a general one
  if (insights.length === 0) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '📊',
      title: s.trackingProgress,
      description: fmt(s.trackingProgressDesc, { days: logs.length }),
      type: 'neutral',
    });
  }

  return insights;
}

// ── POST handler ─────────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { logs, locale } = body as { logs: LogEntry[]; locale?: string };

    // Validate and normalize locale
    const validLocales: SupportedLocale[] = ['es', 'en', 'pt', 'fr'];
    const userLocale: SupportedLocale = validLocales.includes(locale as SupportedLocale)
      ? (locale as SupportedLocale)
      : 'en';

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

      const languageName = LANGUAGE_NAMES[userLocale];

      const prompt = `You are a wellness analysis AI. Analyze the following daily wellness logs and provide insights. Each log contains scores from 0-100 for mental, sleep, nutrition, exercise, hydration, and habits categories, plus raw inputs.

IMPORTANT: You MUST write ALL insights (titles AND descriptions) in ${languageName}. Do not use English unless the user's locale is English.

Logs (most recent first):
${JSON.stringify(logSummary, null, 2)}

Provide 3-6 insights as a JSON array. Each insight must have:
- id: a unique string like "insight-0", "insight-1", etc.
- emoji: a single relevant emoji
- title: a short title (5-8 words) in ${languageName}
- description: a helpful description (1-2 sentences with specific data from the logs) in ${languageName}
- type: one of "positive", "negative", "neutral", "info"

Focus on patterns, trends, correlations, and actionable observations. Be specific with numbers from the data.

Return ONLY the JSON array, no other text. All text content must be in ${languageName}.`;

      const response = await zai.chat.completions.create({
        model: 'default',
        messages: [
          {
            role: 'system',
            content: `You are a wellness analysis AI that provides insights based on health tracking data. You MUST respond in ${languageName}. Always respond with valid JSON only. All title and description fields must be written in ${languageName}.`,
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
          parsed = generateRuleBasedInsights(logs, userLocale);
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
    const insights = generateRuleBasedInsights(logs, userLocale);
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
