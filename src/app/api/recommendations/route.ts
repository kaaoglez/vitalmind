import { NextResponse } from 'next/server';
import type { LogEntry, RecommendationItem } from '@/lib/vitalscore';

// ── Language-specific rule-based recommendations ─────────────────────

type SupportedLocale = 'es' | 'en' | 'pt' | 'fr';

const LANGUAGE_NAMES: Record<SupportedLocale, string> = {
  es: 'Spanish (Español)',
  en: 'English',
  pt: 'Portuguese (Português)',
  fr: 'French (Français)',
};

function generateRuleBasedRecommendations(logs: LogEntry[], locale: SupportedLocale = 'en'): RecommendationItem[] {
  const recommendations: RecommendationItem[] = [];
  let idCounter = 0;

  // Translated strings for each locale
  const t: Record<SupportedLocale, Record<string, string>> = {
    es: {
      startJourney: 'Comienza tu viaje de bienestar',
      startJourneyDesc: 'Comienza registrando tu primer check-in diario. El seguimiento constante es el primer paso hacia un mejor bienestar.',
      practiceStress: 'Practica manejo del estrés diario',
      practiceStressDesc: 'Tus niveles de estrés son consistentemente altos. Prueba 10 minutos de meditación, ejercicios de respiración profunda o relajación muscular progresiva cada día.',
      buildRelaxation: 'Construye una rutina de relajación',
      buildRelaxationDesc: 'El estrés moderado puede acumularse con el tiempo. Considera agregar una práctica corta de mindfulness o journaling a tu rutina diaria, especialmente antes de dormir.',
      prioritizeSleep: 'Prioriza la duración del sueño',
      prioritizeSleepDesc: 'Estás promediando solo {sleep} horas de sueño. Establece una hora consistente para dormir, evita pantallas 30 minutos antes y crea un ambiente fresco y oscuro. Busca 7-8 horas.',
      extendSleep: 'Extiende un poco tu sueño',
      extendSleepDesc: 'Con {sleep} horas, estás cerca del rango recomendado. Intenta ir a la cama 30 minutos antes para alcanzar la ventana óptima de 7-9 horas.',
      evaluateOversleeping: 'Evalúa las causas del exceso de sueño',
      evaluateOversleepingDesc: 'Promediar {sleep} horas puede indicar problemas subyacentes. Considera consultar a un profesional de salud si el exceso de sueño persiste junto con baja energía o cambios de ánimo.',
      startExercise: 'Comienza una rutina básica de ejercicio',
      startExerciseDesc: 'Estás ejercitándote solo el {rate}% de los días. Comienza con solo 15-20 minutos de caminata, estiramientos o ejercicios con el peso corporal. La consistencia importa más que la intensidad.',
      increaseExercise: 'Aumenta la frecuencia de ejercicio',
      increaseExerciseDesc: 'Estás activo el {rate}% de los días. Intenta agregar una sesión más de ejercicio por semana. Incluso una caminata corta en los días de descanso puede mejorar tu VitalScore.',
      increaseWater: 'Aumenta significativamente tu consumo de agua',
      increaseWaterDesc: 'Con {water} vasos diarios, estás muy por debajo de los 8 recomendados. Intenta llevar una botella de agua contigo, establecer recordatorios por hora o agregar fruta para hacer el agua más atractiva.',
      boostHydration: 'Mejora tu hidratación',
      boostHydrationDesc: 'Estás en {water} vasos. Intenta beber un vaso de agua antes de cada comida y mantener una botella en tu escritorio para alcanzar la meta de 8 vasos.',
      improveDiet: 'Mejora la calidad de tu dieta',
      improveDietDesc: 'Con solo {meals} comidas saludables por día, enfócate en agregar más alimentos integrales. Comienza haciendo una comida más saludable cada día — agrega vegetales, elige granos enteros o prepara una comida casera.',
      optimizeNutrition: 'Optimiza tu nutrición',
      optimizeNutritionDesc: 'Estás promediando {meals} comidas saludables diarias. Intenta preparar comidas con anticipación para facilitar las elecciones saludables, y busca un balance de proteína, carbohidratos complejos y grasas saludables.',
      reduceAlcohol: 'Reduce el consumo de alcohol',
      reduceAlcoholDesc: 'Promediar {alcohol} unidades diarias puede afectar la calidad del sueño, la claridad mental y la salud general. Intenta días sin alcohol, alternar con agua o explorar alternativas sin alcohol.',
      monitorAlcohol: 'Monitorea tu consumo de alcohol',
      monitorAlcoholDesc: 'Con {alcohol} unidades diarias, considera tener 2-3 días sin alcohol por semana para mejorar la calidad del sueño y el bienestar general.',
      focusMental: 'Enfócate en tu bienestar mental',
      focusMentalDesc: 'Tu puntaje de bienestar mental ({score}/100) es tu área más débil. Considera técnicas de reducción de estrés, conexión social y apoyo profesional si lo necesitas.',
      improveSleep: 'Mejora tu calidad de sueño',
      improveSleepDesc: 'Tu puntaje de sueño ({score}/100) necesita la mayor atención. Establece un horario de sueño consistente, limita la cafeína después de las 2 PM y crea una rutina relajante antes de dormir.',
      elevateNutrition: 'Eleva tu nutrición',
      elevateNutritionDesc: 'Tu puntaje de nutrición ({score}/100) es tu mayor oportunidad. Planifica comidas balanceadas, aumenta el consumo de frutas y vegetales y reduce los alimentos procesados.',
      getMoving: 'Muévete más',
      getMovingDesc: 'Tu puntaje de ejercicio ({score}/100) es el área con mayor margen de crecimiento. Comienza con metas alcanzables como una caminata diaria de 20 minutos.',
      stayHydrated: 'Mejor hidratación',
      stayHydratedDesc: 'Tu puntaje de hidratación ({score}/100) sugiere que necesitas más agua. Rastrea tu consumo y establece recordatorios a lo largo del día.',
      buildHabits: 'Construye hábitos más saludables',
      buildHabitsDesc: 'Tu puntaje de hábitos ({score}/100) indica espacio para mejorar. Enfócate en reducir el alcohol y construir rutinas diarias positivas.',
      buildConsistency: 'Construye consistencia',
      buildConsistencyDesc: 'Has registrado {days} día(s) hasta ahora. El registro diario consistente ayuda a identificar patrones y generar insights más precisos. Intenta registrar todos los días.',
      maintainHabits: 'Mantén tus buenos hábitos',
      maintainHabitsDesc: '¡Tus métricas de bienestar se ven bien en general! Mantén tu rutina actual y continúa registrando para mantener el conocimiento de cualquier cambio.',
    },
    en: {
      startJourney: 'Start Your Wellness Journey',
      startJourneyDesc: 'Begin by logging your first daily check-in. Consistent tracking is the first step toward better wellness.',
      practiceStress: 'Practice Daily Stress Management',
      practiceStressDesc: 'Your stress levels are consistently high. Try 10 minutes of meditation, deep breathing exercises, or progressive muscle relaxation each day.',
      buildRelaxation: 'Build a Relaxation Routine',
      buildRelaxationDesc: 'Moderate stress can accumulate over time. Consider adding a short mindfulness practice or journaling session to your daily routine, especially before bed.',
      prioritizeSleep: 'Prioritize Sleep Duration',
      prioritizeSleepDesc: "You're averaging only {sleep} hours of sleep. Set a consistent bedtime, avoid screens 30 minutes before sleep, and create a cool, dark sleeping environment. Aim for 7-8 hours.",
      extendSleep: 'Extend Your Sleep Slightly',
      extendSleepDesc: "At {sleep} hours, you're close to the recommended range. Try going to bed 30 minutes earlier to reach the optimal 7-9 hour window.",
      evaluateOversleeping: 'Evaluate Oversleeping Causes',
      evaluateOversleepingDesc: 'Averaging {sleep} hours may indicate underlying issues. Consider consulting a healthcare provider if oversleeping persists alongside low energy or mood changes.',
      startExercise: 'Start a Basic Exercise Routine',
      startExerciseDesc: "You're exercising on only {rate}% of days. Begin with just 15-20 minutes of walking, stretching, or bodyweight exercises. Consistency matters more than intensity.",
      increaseExercise: 'Increase Exercise Frequency',
      increaseExerciseDesc: "You're active on {rate}% of days. Try adding one more exercise session per week. Even a short walk on rest days can boost your VitalScore.",
      increaseWater: 'Significantly Increase Water Intake',
      increaseWaterDesc: "At {water} glasses daily, you're well below the recommended 8 glasses. Try keeping a water bottle with you, setting hourly reminders, or adding fruit to make water more appealing.",
      boostHydration: 'Boost Your Hydration',
      boostHydrationDesc: "You're at {water} glasses. Try drinking a glass of water before each meal and keeping a bottle at your desk to reach the 8-glass goal.",
      improveDiet: 'Improve Your Diet Quality',
      improveDietDesc: 'With only {meals} healthy meals per day, focus on adding more whole foods. Start by making one meal healthier each day — add vegetables, choose whole grains, or prepare a home-cooked meal.',
      optimizeNutrition: 'Optimize Your Nutrition',
      optimizeNutritionDesc: "You're averaging {meals} healthy meals daily. Try meal prepping to make healthy choices easier, and aim for a balance of protein, complex carbs, and healthy fats.",
      reduceAlcohol: 'Reduce Alcohol Consumption',
      reduceAlcoholDesc: 'Averaging {alcohol} units daily can impact sleep quality, mental clarity, and overall health. Try alcohol-free days, alternate with water, or explore non-alcoholic alternatives.',
      monitorAlcohol: 'Monitor Alcohol Intake',
      monitorAlcoholDesc: 'At {alcohol} units daily, consider having 2-3 alcohol-free days per week to improve sleep quality and overall wellness.',
      focusMental: 'Focus on Mental Wellness',
      focusMentalDesc: 'Your mental wellness score ({score}/100) is your weakest area. Consider stress-reduction techniques, social connection, and professional support if needed.',
      improveSleep: 'Improve Your Sleep Quality',
      improveSleepDesc: 'Your sleep score ({score}/100) needs the most attention. Establish a consistent sleep schedule, limit caffeine after 2 PM, and create a calming bedtime routine.',
      elevateNutrition: 'Elevate Your Nutrition',
      elevateNutritionDesc: 'Your nutrition score ({score}/100) is your biggest opportunity. Plan balanced meals, increase fruit and vegetable intake, and reduce processed foods.',
      getMoving: 'Get Moving More',
      getMovingDesc: 'Your exercise score ({score}/100) is the area with the most room for growth. Start with achievable goals like a 20-minute daily walk.',
      stayHydrated: 'Stay Better Hydrated',
      stayHydratedDesc: 'Your hydration score ({score}/100) suggests you need more water. Track your intake and set reminders throughout the day.',
      buildHabits: 'Build Healthier Habits',
      buildHabitsDesc: 'Your habits score ({score}/100) indicates room for improvement. Focus on reducing alcohol and building positive daily routines.',
      buildConsistency: 'Build Consistency',
      buildConsistencyDesc: "You've logged {days} day(s) so far. Consistent daily logging helps identify patterns and generate more accurate insights. Try to log every day.",
      maintainHabits: 'Maintain Your Great Habits',
      maintainHabitsDesc: 'Your wellness metrics look good across the board! Keep up your current routine and continue tracking to maintain awareness of any changes.',
    },
    pt: {
      startJourney: 'Comece sua jornada de bem-estar',
      startJourneyDesc: 'Comece registrando seu primeiro check-in diário. O acompanhamento consistente é o primeiro passo para um melhor bem-estar.',
      practiceStress: 'Pratique manejo diário do estresse',
      practiceStressDesc: 'Seus níveis de estresse estão consistentemente altos. Tente 10 minutos de meditação, exercícios de respiração profunda ou relaxamento muscular progressivo cada dia.',
      buildRelaxation: 'Construa uma rotina de relaxamento',
      buildRelaxationDesc: 'O estresse moderado pode se acumular com o tempo. Considere adicionar uma prática curta de mindfulness ou sessão de journaling à sua rotina diária, especialmente antes de dormir.',
      prioritizeSleep: 'Priorize a duração do sono',
      prioritizeSleepDesc: 'Você está dormindo em média apenas {sleep} horas. Estabeleça um horário consistente para dormir, evite telas 30 minutos antes e crie um ambiente fresco e escuro. Busque 7-8 horas.',
      extendSleep: 'Estenda um pouco seu sono',
      extendSleepDesc: 'Com {sleep} horas, você está perto da faixa recomendada. Tente ir para a cama 30 minutos mais cedo para alcançar a janela ideal de 7-9 horas.',
      evaluateOversleeping: 'Avalie as causas do excesso de sono',
      evaluateOversleepingDesc: 'Dormir em média {sleep} horas pode indicar problemas subjacentes. Considere consultar um profissional de saúde se o excesso de sono persistir junto com baixa energia ou mudanças de humor.',
      startExercise: 'Comece uma rotina básica de exercícios',
      startExerciseDesc: 'Você está se exercitando em apenas {rate}% dos dias. Comece com apenas 15-20 minutos de caminhada, alongamento ou exercícios com peso corporal. A consistência importa mais que a intensidade.',
      increaseExercise: 'Aumente a frequência de exercícios',
      increaseExerciseDesc: 'Você está ativo em {rate}% dos dias. Tente adicionar mais uma sessão de exercício por semana. Mesmo uma caminhada curta nos dias de descanso pode melhorar seu VitalScore.',
      increaseWater: 'Aumente significativamente o consumo de água',
      increaseWaterDesc: 'Com {water} copos diários, você está bem abaixo dos 8 recomendados. Tente levar uma garrafa de água com você, definir lembretes por hora ou adicionar fruta para tornar a água mais atraente.',
      boostHydration: 'Melhore sua hidratação',
      boostHydrationDesc: 'Você está em {water} copos. Tente beber um copo de água antes de cada refeição e manter uma garrafa na sua mesa para alcançar a meta de 8 copos.',
      improveDiet: 'Melhore a qualidade da sua dieta',
      improveDietDesc: 'Com apenas {meals} refeições saudáveis por dia, foque em adicionar mais alimentos integrais. Comece fazendo uma refeição mais saudável cada dia — adicione vegetais, escolha grãos integrais ou prepare uma refeição caseira.',
      optimizeNutrition: 'Otimize sua nutrição',
      optimizeNutritionDesc: 'Você está com uma média de {meals} refeições saudáveis diárias. Tente preparar refeições com antecedência para facilitar escolhas saudáveis, e busque um equilíbrio de proteína, carboidratos complexos e gorduras saudáveis.',
      reduceAlcohol: 'Reduza o consumo de álcool',
      reduceAlcoholDesc: 'Uma média de {alcohol} unidades diárias pode afetar a qualidade do sono, a clareza mental e a saúde geral. Tente dias sem álcool, alternar com água ou explorar alternativas sem álcool.',
      monitorAlcohol: 'Monitore seu consumo de álcool',
      monitorAlcoholDesc: 'Com {alcohol} unidades diárias, considere ter 2-3 dias sem álcool por semana para melhorar a qualidade do sono e o bem-estar geral.',
      focusMental: 'Foque no bem-estar mental',
      focusMentalDesc: 'Sua pontuação de bem-estar mental ({score}/100) é sua área mais fraca. Considere técnicas de redução de estresse, conexão social e apoio profissional se necessário.',
      improveSleep: 'Melhore sua qualidade de sono',
      improveSleepDesc: 'Sua pontuação de sono ({score}/100) precisa de mais atenção. Estabeleça um horário de sono consistente, limite a cafeína após as 14h e crie uma rotina relaxante antes de dormir.',
      elevateNutrition: 'Eleve sua nutrição',
      elevateNutritionDesc: 'Sua pontuação de nutrição ({score}/100) é sua maior oportunidade. Planeje refeições balanceadas, aumente o consumo de frutas e vegetais e reduza alimentos processados.',
      getMoving: 'Movimente-se mais',
      getMovingDesc: 'Sua pontuação de exercício ({score}/100) é a área com maior margem de crescimento. Comece com metas alcançáveis como uma caminhada diária de 20 minutos.',
      stayHydrated: 'Melhore sua hidratação',
      stayHydratedDesc: 'Sua pontuação de hidratação ({score}/100) sugere que você precisa de mais água. Acompanhe seu consumo e defina lembretes ao longo do dia.',
      buildHabits: 'Construa hábitos mais saudáveis',
      buildHabitsDesc: 'Sua pontuação de hábitos ({score}/100) indica espaço para melhoria. Foque em reduzir o álcool e construir rotinas diárias positivas.',
      buildConsistency: 'Construa consistência',
      buildConsistencyDesc: 'Você registrou {days} dia(s) até agora. O registro diário consistente ajuda a identificar padrões e gerar insights mais precisos. Tente registrar todos os dias.',
      maintainHabits: 'Mantenha seus bons hábitos',
      maintainHabitsDesc: 'Suas métricas de bem-estar parecem boas em geral! Mantenha sua rotina atual e continue registrando para manter a consciência de quaisquer mudanças.',
    },
    fr: {
      startJourney: 'Commencez votre parcours de bien-être',
      startJourneyDesc: 'Commencez par enregistrer votre premier bilan quotidien. Le suivi régulier est la première étape vers un meilleur bien-être.',
      practiceStress: 'Pratiquez la gestion quotidienne du stress',
      practiceStressDesc: 'Vos niveaux de stress sont constamment élevés. Essayez 10 minutes de méditation, d\'exercices de respiration profonde ou de relaxation musculaire progressive chaque jour.',
      buildRelaxation: 'Créez une routine de relaxation',
      buildRelaxationDesc: 'Le stress modéré peut s\'accumuler avec le temps. Envisagez d\'ajouter une courte pratique de pleine conscience ou une séance d\'écriture à votre routine quotidienne, surtout avant le coucher.',
      prioritizeSleep: 'Priorisez la durée du sommeil',
      prioritizeSleepDesc: 'Vous dormez en moyenne seulement {sleep} heures. Fixez une heure de coucher cohérente, évitez les écrans 30 minutes avant de dormir et créez un environnement frais et sombre. Visez 7-8 heures.',
      extendSleep: 'Prolongez légèrement votre sommeil',
      extendSleepDesc: 'Avec {sleep} heures, vous êtes proche de la plage recommandée. Essayez d\'aller au lit 30 minutes plus tôt pour atteindre la fenêtre optimale de 7-9 heures.',
      evaluateOversleeping: 'Évaluez les causes du sommeil excessif',
      evaluateOversleepingDesc: 'Dormir en moyenne {sleep} heures peut indiquer des problèmes sous-jacents. Consultez un professionnel de santé si le sommeil excessif persiste avec une faible énergie ou des changements d\'humeur.',
      startExercise: 'Commencez une routine d\'exercice de base',
      startExerciseDesc: 'Vous faites de l\'exercice seulement {rate}% des jours. Commencez par seulement 15-20 minutes de marche, d\'étirements ou d\'exercices au poids du corps. La régularité compte plus que l\'intensité.',
      increaseExercise: 'Augmentez la fréquence d\'exercice',
      increaseExerciseDesc: 'Vous êtes actif {rate}% des jours. Essayez d\'ajouter une séance d\'exercice supplémentaire par semaine. Même une courte marche les jours de repos peut améliorer votre VitalScore.',
      increaseWater: 'Augmentez considérablement votre consommation d\'eau',
      increaseWaterDesc: 'Avec {water} verres par jour, vous êtes bien en dessous des 8 recommandés. Essayez de garder une bouteille d\'eau avec vous, de définir des rappels horaires ou d\'ajouter des fruits pour rendre l\'eau plus attrayante.',
      boostHydration: 'Améliorez votre hydratation',
      boostHydrationDesc: 'Vous êtes à {water} verres. Essayez de boire un verre d\'eau avant chaque repas et de garder une bouteille sur votre bureau pour atteindre l\'objectif de 8 verres.',
      improveDiet: 'Améliorez la qualité de votre alimentation',
      improveDietDesc: 'Avec seulement {meals} repas sains par jour, concentrez-vous sur l\'ajout d\'aliments complets. Commencez par rendre un repas plus sain chaque jour — ajoutez des légumes, choisissez des céréales complètes ou préparez un repas maison.',
      optimizeNutrition: 'Optimisez votre nutrition',
      optimizeNutritionDesc: 'Vous avez en moyenne {meals} repas sains par jour. Essayez la préparation de repas pour faciliter les choix sains, et visez un équilibre de protéines, de glucides complexes et de graisses saines.',
      reduceAlcohol: 'Réduisez votre consommation d\'alcool',
      reduceAlcoholDesc: 'Une moyenne de {alcohol} unités par jour peut affecter la qualité du sommeil, la clarté mentale et la santé générale. Essayez des jours sans alcool, alternez avec de l\'eau ou explorez des alternatives sans alcool.',
      monitorAlcohol: 'Surveillez votre consommation d\'alcool',
      monitorAlcoholDesc: 'Avec {alcohol} unités par jour, envisagez d\'avoir 2-3 jours sans alcool par semaine pour améliorer la qualité du sommeil et le bien-être général.',
      focusMental: 'Concentrez-vous sur le bien-être mental',
      focusMentalDesc: 'Votre score de bien-être mental ({score}/100) est votre domaine le plus faible. Envisagez des techniques de réduction du stress, la connexion sociale et un soutien professionnel si nécessaire.',
      improveSleep: 'Améliorez votre qualité de sommeil',
      improveSleepDesc: 'Votre score de sommeil ({score}/100) nécessite le plus d\'attention. Établissez un horaire de sommeil régulier, limitez la caféine après 14h et créez une routine apaisante avant le coucher.',
      elevateNutrition: 'Élevez votre nutrition',
      elevateNutritionDesc: 'Votre score de nutrition ({score}/100) est votre plus grande opportunité. Planifiez des repas équilibrés, augmentez la consommation de fruits et légumes et réduisez les aliments transformés.',
      getMoving: 'Bougez davantage',
      getMovingDesc: 'Votre score d\'exercice ({score}/100) est le domaine avec la plus grande marge de progression. Commencez par des objectifs atteignables comme une marche quotidienne de 20 minutes.',
      stayHydrated: 'Mieux vous hydrater',
      stayHydratedDesc: 'Votre score d\'hydratation ({score}/100) suggère que vous avez besoin de plus d\'eau. Suivez votre consommation et définissez des rappels tout au long de la journée.',
      buildHabits: 'Construisez des habitudes plus saines',
      buildHabitsDesc: 'Votre score d\'habitudes ({score}/100) indique une marge d\'amélioration. Concentrez-vous sur la réduction de l\'alcool et la construction de routines quotidiennes positives.',
      buildConsistency: 'Développez la régularité',
      buildConsistencyDesc: 'Vous avez enregistré {days} jour(s) jusqu\'ici. L\'enregistrement quotidien régulier aide à identifier les schémas et à générer des insights plus précis. Essayez d\'enregistrer chaque jour.',
      maintainHabits: 'Maintenez vos bonnes habitudes',
      maintainHabitsDesc: 'Vos métriques de bien-être sont bonnes dans l\'ensemble ! Maintenez votre routine actuelle et continuez le suivi pour rester conscient de tout changement.',
    },
  };

  const s = t[locale] || t.en;

  if (logs.length === 0) {
    return [
      {
        id: `rec-${idCounter++}`,
        title: s.startJourney,
        description: s.startJourneyDesc,
        priority: 'high',
        category: 'general',
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

  // Category averages
  const avgMental = logs.reduce((acc, l) => acc + l.mental, 0) / logs.length;
  const avgSleepScore = logs.reduce((acc, l) => acc + l.sleep, 0) / logs.length;
  const avgNutrition = logs.reduce((acc, l) => acc + l.nutrition, 0) / logs.length;
  const avgExercise = logs.reduce((acc, l) => acc + l.exercise, 0) / logs.length;
  const avgHydration = logs.reduce((acc, l) => acc + l.hydration, 0) / logs.length;
  const avgHabits = logs.reduce((acc, l) => acc + l.habits, 0) / logs.length;

  // Find the weakest category
  const categoryScores = [
    { category: 'mental', score: avgMental },
    { category: 'sleep', score: avgSleepScore },
    { category: 'nutrition', score: avgNutrition },
    { category: 'exercise', score: avgExercise },
    { category: 'hydration', score: avgHydration },
    { category: 'habits', score: avgHabits },
  ];
  const weakest = categoryScores.reduce((min, c) => (c.score < min.score ? c : min), categoryScores[0]);

  const fmt = (template: string, vars: Record<string, string | number>) =>
    template.replace(/\{(\w+)\}/g, (_, key) => String(vars[key] ?? ''));

  // Stress/Mental recommendations
  if (avgStress >= 7) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.practiceStress,
      description: s.practiceStressDesc,
      priority: 'high',
      category: 'mental',
    });
  } else if (avgStress >= 5) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.buildRelaxation,
      description: s.buildRelaxationDesc,
      priority: 'medium',
      category: 'mental',
    });
  }

  // Sleep recommendations
  if (avgSleep < 6) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.prioritizeSleep,
      description: fmt(s.prioritizeSleepDesc, { sleep: avgSleep.toFixed(1) }),
      priority: 'high',
      category: 'sleep',
    });
  } else if (avgSleep < 7) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.extendSleep,
      description: fmt(s.extendSleepDesc, { sleep: avgSleep.toFixed(1) }),
      priority: 'medium',
      category: 'sleep',
    });
  } else if (avgSleep > 9) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.evaluateOversleeping,
      description: fmt(s.evaluateOversleepingDesc, { sleep: avgSleep.toFixed(1) }),
      priority: 'medium',
      category: 'sleep',
    });
  }

  // Exercise recommendations
  if (exerciseRate < 0.3) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.startExercise,
      description: fmt(s.startExerciseDesc, { rate: (exerciseRate * 100).toFixed(0) }),
      priority: 'high',
      category: 'exercise',
    });
  } else if (exerciseRate < 0.5) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.increaseExercise,
      description: fmt(s.increaseExerciseDesc, { rate: (exerciseRate * 100).toFixed(0) }),
      priority: 'medium',
      category: 'exercise',
    });
  }

  // Hydration recommendations
  if (avgWater < 5) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.increaseWater,
      description: fmt(s.increaseWaterDesc, { water: avgWater.toFixed(1) }),
      priority: 'high',
      category: 'hydration',
    });
  } else if (avgWater < 8) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.boostHydration,
      description: fmt(s.boostHydrationDesc, { water: avgWater.toFixed(1) }),
      priority: 'medium',
      category: 'hydration',
    });
  }

  // Nutrition recommendations
  if (avgMeals < 1.5) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.improveDiet,
      description: fmt(s.improveDietDesc, { meals: avgMeals.toFixed(1) }),
      priority: 'high',
      category: 'nutrition',
    });
  } else if (avgMeals < 2.5) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.optimizeNutrition,
      description: fmt(s.optimizeNutritionDesc, { meals: avgMeals.toFixed(1) }),
      priority: 'medium',
      category: 'nutrition',
    });
  }

  // Habits/Alcohol recommendations
  if (avgAlcohol >= 3) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.reduceAlcohol,
      description: fmt(s.reduceAlcoholDesc, { alcohol: avgAlcohol.toFixed(1) }),
      priority: 'high',
      category: 'habits',
    });
  } else if (avgAlcohol >= 1.5) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.monitorAlcohol,
      description: fmt(s.monitorAlcoholDesc, { alcohol: avgAlcohol.toFixed(1) }),
      priority: 'low',
      category: 'habits',
    });
  }

  // Add a recommendation focused on the weakest category
  if (weakest.score < 50) {
    const categoryTips: Record<string, { title: string; description: string }> = {
      mental: {
        title: s.focusMental,
        description: fmt(s.focusMentalDesc, { score: weakest.score.toFixed(0) }),
      },
      sleep: {
        title: s.improveSleep,
        description: fmt(s.improveSleepDesc, { score: weakest.score.toFixed(0) }),
      },
      nutrition: {
        title: s.elevateNutrition,
        description: fmt(s.elevateNutritionDesc, { score: weakest.score.toFixed(0) }),
      },
      exercise: {
        title: s.getMoving,
        description: fmt(s.getMovingDesc, { score: weakest.score.toFixed(0) }),
      },
      hydration: {
        title: s.stayHydrated,
        description: fmt(s.stayHydratedDesc, { score: weakest.score.toFixed(0) }),
      },
      habits: {
        title: s.buildHabits,
        description: fmt(s.buildHabitsDesc, { score: weakest.score.toFixed(0) }),
      },
    };

    const tip = categoryTips[weakest.category];
    if (tip && !recommendations.some((r) => r.category === weakest.category && r.priority === 'high')) {
      recommendations.push({
        id: `rec-${idCounter++}`,
        title: tip.title,
        description: tip.description,
        priority: 'high',
        category: weakest.category,
      });
    }
  }

  // Consistency recommendation
  if (logs.length < 7) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.buildConsistency,
      description: fmt(s.buildConsistencyDesc, { days: logs.length }),
      priority: 'medium',
      category: 'general',
    });
  }

  // If no specific recommendations were generated
  if (recommendations.length === 0) {
    recommendations.push({
      id: `rec-${idCounter++}`,
      title: s.maintainHabits,
      description: s.maintainHabitsDesc,
      priority: 'low',
      category: 'general',
    });
  }

  // Sort by priority: high first, then medium, then low
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return recommendations;
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

    // Try AI-powered recommendations first
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

      // Calculate averages for context
      const avgStress = logs.reduce((s, l) => s + (l.stressLevel ?? 5), 0) / logs.length;
      const avgSleep = logs.reduce((s, l) => s + (l.sleepHours ?? 7), 0) / logs.length;
      const avgWater = logs.reduce((s, l) => s + (l.waterGlasses ?? 4), 0) / logs.length;
      const avgMeals = logs.reduce((s, l) => s + (l.mealsHealthy ?? 0), 0) / logs.length;
      const exerciseRate = logs.filter((l) => l.exercised).length / logs.length;
      const avgAlcohol = logs.reduce((s, l) => s + (l.alcoholUnits ?? 0), 0) / logs.length;

      const languageName = LANGUAGE_NAMES[userLocale];

      const prompt = `You are a wellness coaching AI. Based on the following daily wellness logs, provide personalized recommendations for improvement.

IMPORTANT: You MUST write ALL recommendations (titles AND descriptions) in ${languageName}. Do not use English unless the user's locale is English.

User's average stats:
- Stress level: ${avgStress.toFixed(1)}/10
- Sleep: ${avgSleep.toFixed(1)} hours
- Water: ${avgWater.toFixed(1)} glasses/day
- Healthy meals: ${avgMeals.toFixed(1)}/day
- Exercise rate: ${(exerciseRate * 100).toFixed(0)}%
- Alcohol: ${avgAlcohol.toFixed(1)} units/day

Detailed logs (most recent first):
${JSON.stringify(logSummary, null, 2)}

Provide 3-6 personalized recommendations as a JSON array. Each recommendation must have:
- id: a unique string like "rec-0", "rec-1", etc.
- title: a short actionable title (5-8 words) in ${languageName}
- description: a detailed recommendation with specific, actionable advice (2-3 sentences with concrete steps) in ${languageName}
- priority: one of "high", "medium", "low" (based on urgency and potential impact)
- category: one of "mental", "sleep", "nutrition", "exercise", "hydration", "habits", "general"

Focus on the areas that need the most improvement and provide practical, specific advice. Prioritize recommendations that address the user's weakest areas.

Return ONLY the JSON array, no other text. All text content must be in ${languageName}.`;

      const response = await zai.chat.completions.create({
        model: 'default',
        messages: [
          {
            role: 'system',
            content: `You are a wellness coaching AI that provides personalized, actionable recommendations based on health tracking data. You MUST respond in ${languageName}. Always respond with valid JSON only. All title and description fields must be written in ${languageName}.`,
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
        let parsed: RecommendationItem[];
        try {
          // Handle potential markdown code blocks
          const jsonStr = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
          parsed = JSON.parse(jsonStr);
        } catch {
          // If parsing fails, fall back to rule-based
          console.warn('Failed to parse AI recommendations response, falling back to rule-based');
          parsed = generateRuleBasedRecommendations(logs, userLocale);
        }

        if (Array.isArray(parsed) && parsed.length > 0) {
          // Sort by priority
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          parsed.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

          return NextResponse.json({
            success: true,
            recommendations: parsed,
          });
        }
      }
    } catch (aiError) {
      console.warn('AI recommendations generation failed, falling back to rule-based:', aiError);
    }

    // Fallback to rule-based recommendations
    const recommendations = generateRuleBasedRecommendations(logs, userLocale);
    return NextResponse.json({
      success: true,
      recommendations,
    });
  } catch (error) {
    console.error('Recommendations error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
