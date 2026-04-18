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

// ── Rule-based fallback insights (multilingual, comprehensive) ───────

function generateRuleBasedInsights(logs: LogEntry[], locale: SupportedLocale = 'en'): InsightItem[] {
  const insights: InsightItem[] = [];
  let idCounter = 0;

  const t: Record<SupportedLocale, Record<string, string>> = {
    es: {
      noData: 'Sin datos aún',
      noDataDesc: 'Comienza a registrar tu bienestar diario para recibir insights personalizados sobre tus patrones de salud.',
      highStress: 'Niveles altos de estrés',
      highStressDesc: 'Tu nivel promedio de estrés es {stress}/10. Considera ejercicios de mindfulness, respiración profunda o hablar con alguien de confianza.',
      moderateStress: 'Estrés moderado',
      moderateStressDesc: 'Tu nivel promedio de estrés es {stress}/10. Está en un rango manejable, pero vigila los días de mayor presión para evitar que se acumule.',
      lowStress: 'Niveles bajos de estrés',
      lowStressDesc: '¡Excelente! Tu nivel promedio de estrés es solo {stress}/10. Sigue haciendo lo que haces para mantener este estado de calma.',
      insufficientSleep: 'Sueño insuficiente',
      insufficientSleepDesc: 'Estás promediando {sleep} horas de sueño. La mayoría de los adultos necesitan 7-9 horas para una salud y función cognitiva óptimas.',
      approachingSleep: 'Casi alcanzas el sueño ideal',
      approachingSleepDesc: 'Estás promediando {sleep} horas de sueño, cerca del rango recomendado de 7-9 horas. Un poco más de descanso podría marcar una gran diferencia.',
      healthySleep: 'Patrón de sueño saludable',
      healthySleepDesc: 'Estás promediando {sleep} horas de sueño, dentro del rango recomendado de 7-9 horas. ¡Bien hecho!',
      oversleeping: 'Exceso de sueño detectado',
      oversleepingDesc: 'Estás promediando {sleep} horas de sueño. Dormir consistentemente más de 9 horas puede indicar problemas de salud subyacentes.',
      lowHydration: 'Hidratación baja',
      lowHydrationDesc: 'Estás bebiendo un promedio de {water} vasos de agua diarios. Intenta al menos 8 vasos para mantenerte adecuadamente hidratado.',
      moderateHydration: 'Hidratación moderada',
      moderateHydrationDesc: 'Estás bebiendo {water} vasos de agua diarios en promedio. Estás en camino, pero alcanzar 8 vasos mejoraría tu energía y concentración.',
      wellHydrated: 'Bien hidratado',
      wellHydratedDesc: 'Estás promediando {water} vasos de agua diarios. Excelentes hábitos de hidratación que apoyan tu bienestar general.',
      lowExercise: 'Frecuencia de ejercicio baja',
      lowExerciseDesc: 'Solo ejercitaste el {rate}% de los días registrados. La actividad física regular mejora significativamente la salud mental y física.',
      moderateExercise: 'Ejercicio regular pero mejorable',
      moderateExerciseDesc: 'Ejercitaste el {rate}% de los días registrados. ¡Buen comienzo! Intenta alcanzar al menos 5 días por semana para resultados óptimos.',
      activeLifestyle: 'Estilo de vida activo',
      activeLifestyleDesc: 'Ejercitaste el {rate}% de los días registrados. ¡Tu compromiso con la actividad física está dando resultados!',
      roomNutrition: 'Mejora nutricional posible',
      roomNutritionDesc: 'Estás promediando {meals} comidas saludables por día. Intenta incorporar más alimentos integrales, frutas y vegetales en tu dieta.',
      moderateNutrition: 'Nutrición aceptable',
      moderateNutritionDesc: 'Estás promediando {meals} comidas saludables por día. Estás en el camino correcto; agrega una porción más de vegetales o frutas para optimizar.',
      nutritiousEating: 'Hábitos nutricionales saludables',
      nutritiousEatingDesc: 'Estás promediando {meals} comidas saludables por día. Tus elecciones nutricionales apoyan tu bienestar general.',
      highAlcohol: 'Consumo alto de alcohol',
      highAlcoholDesc: 'Estás promediando {alcohol} unidades de alcohol diarias. Considera reducir el consumo para mejorar el sueño, la claridad mental y la salud general.',
      moderateAlcohol: 'Consumo moderado de alcohol',
      moderateAlcoholDesc: 'Estás promediando {alcohol} unidades de alcohol diarias. Está en un rango moderado, pero los días sin alcohol benefician tu recuperación.',
      lowAlcohol: 'Consumo bajo de alcohol',
      lowAlcoholDesc: 'Estás promediando solo {alcohol} unidades de alcohol diarias. ¡Excelente! Tus hábitos apoyan un sueño y salud mental óptimos.',
      excellentWellness: 'Bienestar general excelente',
      excellentWellnessDesc: 'Tu VitalScore promedio es {score}/100. ¡Estás haciendo un gran trabajo en todas las categorías de bienestar!',
      goodWellness: 'Buen bienestar general',
      goodWellnessDesc: 'Tu VitalScore promedio es {score}/100. Estás en buen camino; pequeños ajustes pueden llevarte al nivel óptimo.',
      moderateWellness: 'Bienestar moderado',
      moderateWellnessDesc: 'Tu VitalScore promedio es {score}/100. Hay espacio para mejorar — enfócate en las áreas más débiles para el mayor impacto.',
      wellnessNeeds: 'El bienestar necesita atención',
      wellnessNeedsDesc: 'Tu VitalScore promedio es {score}/100. Enfócate en pequeñas mejoras en tus áreas más débiles para el mayor impacto.',
      upwardTrend: 'Tendencia ascendente',
      upwardTrendDesc: 'Tu VitalScore ha mejorado {diff} puntos recientemente. ¡Tus hábitos positivos están marcando la diferencia!',
      downwardTrend: 'Tendencia descendente',
      downwardTrendDesc: 'Tu VitalScore ha disminuido {diff} puntos recientemente. Considera revisar los cambios recientes en tu rutina.',
      stableTrend: 'Bienestar estable',
      stableTrendDesc: 'Tu VitalScore se mantiene estable en {score}/100. La consistencia es clave; sigue construyendo sobre tu base actual.',
      stressExerciseCorrelation: 'El ejercicio reduce tu estrés',
      stressExerciseCorrelationDesc: 'En los días que haces ejercicio, tu estrés promedio es {exerciseStress}/10 vs {noExerciseStress}/10 sin ejercicio. La actividad física es tu aliada contra el estrés.',
      sleepStressCorrelation: 'El estrés afecta tu sueño',
      sleepStressCorrelationDesc: 'En los días de mayor estrés (≥6), duermes {highStressSleep}h vs {lowStressSleep}h en días tranquilos. Reducir el estrés podría mejorar tu descanso.',
      weekendEffect: 'Efecto de fin de semana',
      weekendEffectDesc: 'Tu bienestar {weekendDirection} los fines de semana. Los fines de semana tu VitalScore promedio es {weekendScore} vs {weekdayScore} entre semana.',
      consistency: 'Consistencia en el registro',
      consistencyDesc: 'Has registrado {days} días de {total} posibles. {message}',
      consistencyGood: '¡Tu dedicación al registro está revelando patrones valiosos!',
      consistencyImprove: 'Intenta registrar más consistentemente para obtener insights más precisos.',
      trackingProgress: 'Monitoreando tu progreso',
      trackingProgressDesc: 'Has registrado {days} día(s). Sigue registrando consistentemente para desbloquear insights más detallados sobre tus patrones de bienestar.',
      weekImprovement: 'Mejora semanal notable',
      weekImprovementDesc: 'Comparando la última semana con la anterior, tu VitalScore subió de {prevScore} a {recentScore}. ¡Sigue así!',
      weekDecline: 'Declive semanal',
      weekDeclineDesc: 'Comparando la última semana con la anterior, tu VitalScore bajó de {prevScore} a {recentScore}. Revisa si algo cambió en tu rutina.',
      bestCategory: 'Tu punto más fuerte',
      bestCategoryDesc: 'Tu categoría más fuerte es {category} con un promedio de {score}/100. ¡Sigue cuidando esta área!',
      weakestCategory: 'Área de oportunidad',
      weakestCategoryDesc: 'Tu categoría más débil es {category} con un promedio de {score}/100. Pequeños cambios aquí tendrán el mayor impacto en tu bienestar.',
    },
    en: {
      noData: 'No data yet',
      noDataDesc: 'Start logging your daily wellness to receive personalized insights about your health patterns.',
      highStress: 'High Stress Levels',
      highStressDesc: 'Your average stress level is {stress}/10. Consider mindfulness exercises, deep breathing, or talking to someone you trust.',
      moderateStress: 'Moderate Stress',
      moderateStressDesc: 'Your average stress level is {stress}/10. It\'s manageable, but watch out for high-pressure days to prevent it from building up.',
      lowStress: 'Low Stress Levels',
      lowStressDesc: "Great job! Your average stress level is only {stress}/10. Keep up whatever you're doing to maintain this calm state.",
      insufficientSleep: 'Insufficient Sleep',
      insufficientSleepDesc: "You're averaging {sleep} hours of sleep. Most adults need 7-9 hours for optimal health and cognitive function.",
      approachingSleep: 'Close to Ideal Sleep',
      approachingSleepDesc: "You're averaging {sleep} hours of sleep, close to the recommended 7-9 hour range. A little more rest could make a big difference.",
      healthySleep: 'Healthy Sleep Pattern',
      healthySleepDesc: "You're averaging {sleep} hours of sleep, which is within the recommended 7-9 hour range. Well done!",
      oversleeping: 'Oversleeping Detected',
      oversleepingDesc: "You're averaging {sleep} hours of sleep. Consistently sleeping more than 9 hours may indicate underlying health issues.",
      lowHydration: 'Low Hydration',
      lowHydrationDesc: "You're drinking an average of {water} glasses of water daily. Aim for at least 8 glasses to stay properly hydrated.",
      moderateHydration: 'Moderate Hydration',
      moderateHydrationDesc: "You're averaging {water} glasses of water daily. You're on your way, but reaching 8 glasses would boost your energy and focus.",
      wellHydrated: 'Well Hydrated',
      wellHydratedDesc: "You're averaging {water} glasses of water daily. Great hydration habits support overall wellness.",
      lowExercise: 'Low Exercise Frequency',
      lowExerciseDesc: 'You exercised on only {rate}% of logged days. Regular physical activity significantly improves mental and physical health.',
      moderateExercise: 'Regular Exercise, Room to Grow',
      moderateExerciseDesc: 'You exercised on {rate}% of logged days. Good start! Try reaching at least 5 days per week for optimal results.',
      activeLifestyle: 'Active Lifestyle',
      activeLifestyleDesc: 'You exercised on {rate}% of logged days. Your commitment to physical activity is paying off!',
      roomNutrition: 'Room for Nutritional Improvement',
      roomNutritionDesc: "You're averaging {meals} healthy meals per day. Try incorporating more whole foods, fruits, and vegetables into your diet.",
      moderateNutrition: 'Acceptable Nutrition',
      moderateNutritionDesc: "You're averaging {meals} healthy meals per day. You're on the right track; add one more serving of veggies or fruit to optimize.",
      nutritiousEating: 'Nutritious Eating Habits',
      nutritiousEatingDesc: "You're averaging {meals} healthy meals per day. Your nutritional choices are supporting your overall wellness.",
      highAlcohol: 'High Alcohol Consumption',
      highAlcoholDesc: "You're averaging {alcohol} alcohol units daily. Consider reducing intake for better sleep, mental clarity, and overall health.",
      moderateAlcohol: 'Moderate Alcohol Consumption',
      moderateAlcoholDesc: "You're averaging {alcohol} alcohol units daily. It's moderate, but alcohol-free days benefit your recovery.",
      lowAlcohol: 'Low Alcohol Consumption',
      lowAlcoholDesc: "You're averaging only {alcohol} alcohol units daily. Great! Your habits support optimal sleep and mental health.",
      excellentWellness: 'Excellent Overall Wellness',
      excellentWellnessDesc: "Your average VitalScore is {score}/100. You're doing great across all wellness categories!",
      goodWellness: 'Good Overall Wellness',
      goodWellnessDesc: 'Your average VitalScore is {score}/100. You\'re on the right track; small tweaks could take you to the optimal level.',
      moderateWellness: 'Moderate Overall Wellness',
      moderateWellnessDesc: 'Your average VitalScore is {score}/100. There\'s room for improvement — focus on your weakest areas for the biggest impact.',
      wellnessNeeds: 'Wellness Needs Attention',
      wellnessNeedsDesc: 'Your average VitalScore is {score}/100. Focus on small improvements in your weakest areas for the biggest impact.',
      upwardTrend: 'Upward Trend',
      upwardTrendDesc: 'Your VitalScore has improved by {diff} points recently. Your positive habits are making a difference!',
      downwardTrend: 'Downward Trend',
      downwardTrendDesc: 'Your VitalScore has decreased by {diff} points recently. Consider reviewing recent changes in your routine.',
      stableTrend: 'Stable Wellness',
      stableTrendDesc: 'Your VitalScore remains stable at {score}/100. Consistency is key; keep building on your current foundation.',
      stressExerciseCorrelation: 'Exercise Reduces Your Stress',
      stressExerciseCorrelationDesc: 'On days you exercise, your average stress is {exerciseStress}/10 vs {noExerciseStress}/10 on rest days. Physical activity is your ally against stress.',
      sleepStressCorrelation: 'Stress Affects Your Sleep',
      sleepStressCorrelationDesc: 'On high-stress days (≥6), you sleep {highStressSleep}h vs {lowStressSleep}h on calm days. Reducing stress could improve your rest.',
      weekendEffect: 'Weekend Effect',
      weekendEffectDesc: 'Your wellness {weekendDirection} on weekends. Your average weekend VitalScore is {weekendScore} vs {weekdayScore} on weekdays.',
      consistency: 'Tracking Consistency',
      consistencyDesc: 'You\'ve logged {days} out of {total} possible days. {message}',
      consistencyGood: 'Your dedication to tracking is revealing valuable patterns!',
      consistencyImprove: 'Try logging more consistently for more accurate insights.',
      trackingProgress: 'Tracking Your Progress',
      trackingProgressDesc: "You've logged {days} day(s). Keep logging consistently to unlock more detailed insights about your wellness patterns.",
      weekImprovement: 'Notable Weekly Improvement',
      weekImprovementDesc: 'Comparing the last week to the previous one, your VitalScore rose from {prevScore} to {recentScore}. Keep it up!',
      weekDecline: 'Weekly Decline',
      weekDeclineDesc: 'Comparing the last week to the previous one, your VitalScore dropped from {prevScore} to {recentScore}. Review any changes in your routine.',
      bestCategory: 'Your Strongest Area',
      bestCategoryDesc: 'Your strongest category is {category} with an average of {score}/100. Keep nurturing this area!',
      weakestCategory: 'Area of Opportunity',
      weakestCategoryDesc: 'Your weakest category is {category} with an average of {score}/100. Small changes here will have the biggest impact on your wellness.',
    },
    pt: {
      noData: 'Sem dados ainda',
      noDataDesc: 'Comece a registrar seu bem-estar diário para receber insights personalizados sobre seus padrões de saúde.',
      highStress: 'Níveis altos de estresse',
      highStressDesc: 'Seu nível médio de estresse é {stress}/10. Considere exercícios de mindfulness, respiração profunda ou conversar com alguém de confiança.',
      moderateStress: 'Estresse moderado',
      moderateStressDesc: 'Seu nível médio de estresse é {stress}/10. Está gerenciável, mas fique atento aos dias de maior pressão para evitar acúmulo.',
      lowStress: 'Níveis baixos de estresse',
      lowStressDesc: 'Excelente! Seu nível médio de estresse é apenas {stress}/10. Continue fazendo o que você faz para manter este estado de calma.',
      insufficientSleep: 'Sono insuficiente',
      insufficientSleepDesc: 'Você está dormindo em média {sleep} horas. A maioria dos adultos precisa de 7-9 horas para saúde e função cognitiva ideais.',
      approachingSleep: 'Quase no sono ideal',
      approachingSleepDesc: 'Você está dormindo em média {sleep} horas, perto da faixa recomendada de 7-9 horas. Um pouco mais de descanso pode fazer uma grande diferença.',
      healthySleep: 'Padrão de sono saudável',
      healthySleepDesc: 'Você está dormindo em média {sleep} horas, dentro da faixa recomendada de 7-9 horas. Muito bem!',
      oversleeping: 'Excesso de sono detectado',
      oversleepingDesc: 'Você está dormindo em média {sleep} horas. Dormir consistentemente mais de 9 horas pode indicar problemas de saúde subjacentes.',
      lowHydration: 'Hidratação baixa',
      lowHydrationDesc: 'Você está bebendo em média {water} copos de água por dia. Tente pelo menos 8 copos para se manter adequadamente hidratado.',
      moderateHydration: 'Hidratação moderada',
      moderateHydrationDesc: 'Você está bebendo {water} copos de água por dia em média. Está no caminho, mas atingir 8 copos melhoraria sua energia e concentração.',
      wellHydrated: 'Bem hidratado',
      wellHydratedDesc: 'Você está bebendo em média {water} copos de água por dia. Ótimos hábitos de hidratação que apoiam seu bem-estar geral.',
      lowExercise: 'Frequência de exercício baixa',
      lowExerciseDesc: 'Você se exercitou apenas em {rate}% dos dias registrados. A atividade física regular melhora significativamente a saúde mental e física.',
      moderateExercise: 'Exercício regular, mas melhável',
      moderateExerciseDesc: 'Você se exercitou em {rate}% dos dias registrados. Bom começo! Tente alcançar pelo menos 5 dias por semana para resultados ideais.',
      activeLifestyle: 'Estilo de vida ativo',
      activeLifestyleDesc: 'Você se exercitou em {rate}% dos dias registrados. Seu compromisso com a atividade física está dando resultados!',
      roomNutrition: 'Melhoria nutricional possível',
      roomNutritionDesc: 'Você está com uma média de {meals} refeições saudáveis por dia. Tente incorporar mais alimentos integrais, frutas e vegetais na sua dieta.',
      moderateNutrition: 'Nutrição aceitável',
      moderateNutritionDesc: 'Você está com uma média de {meals} refeições saudáveis por dia. Está no caminho certo; adicione uma porção a mais de vegetais ou frutas para otimizar.',
      nutritiousEating: 'Hábitos nutricionais saudáveis',
      nutritiousEatingDesc: 'Você está com uma média de {meals} refeições saudáveis por dia. Suas escolhas nutricionais apoiam seu bem-estar geral.',
      highAlcohol: 'Consumo alto de álcool',
      highAlcoholDesc: 'Você está com uma média de {alcohol} unidades de álcool por dia. Considere reduzir o consumo para melhorar o sono, a clareza mental e a saúde geral.',
      moderateAlcohol: 'Consumo moderado de álcool',
      moderateAlcoholDesc: 'Você está com uma média de {alcohol} unidades de álcool por dia. É moderado, mas dias sem álcool beneficiam sua recuperação.',
      lowAlcohol: 'Consumo baixo de álcool',
      lowAlcoholDesc: 'Você está com uma média de apenas {alcohol} unidades de álcool por dia. Excelente! Seus hábitos apoiam sono e saúde mental ideais.',
      excellentWellness: 'Bem-estar geral excelente',
      excellentWellnessDesc: 'Seu VitalScore médio é {score}/100. Você está se saindo muito bem em todas as categorias de bem-estar!',
      goodWellness: 'Bom bem-estar geral',
      goodWellnessDesc: 'Seu VitalScore médio é {score}/100. Você está no caminho certo; pequenos ajustes podem levá-lo ao nível ótimo.',
      moderateWellness: 'Bem-estar moderado',
      moderateWellnessDesc: 'Seu VitalScore médio é {score}/100. Há espaço para melhorar — foque nas áreas mais fracas para o maior impacto.',
      wellnessNeeds: 'Bem-estar precisa de atenção',
      wellnessNeedsDesc: 'Seu VitalScore médio é {score}/100. Foque em pequenas melhorias nas suas áreas mais fracas para o maior impacto.',
      upwardTrend: 'Tendência ascendente',
      upwardTrendDesc: 'Seu VitalScore melhorou {diff} pontos recentemente. Seus hábitos positivos estão fazendo a diferença!',
      downwardTrend: 'Tendência descendente',
      downwardTrendDesc: 'Seu VitalScore diminuiu {diff} pontos recentemente. Considere revisar as mudanças recentes na sua rotina.',
      stableTrend: 'Bem-estar estável',
      stableTrendDesc: 'Seu VitalScore permanece estável em {score}/100. A consistência é fundamental; continue construindo sobre sua base atual.',
      stressExerciseCorrelation: 'Exercício reduz seu estresse',
      stressExerciseCorrelationDesc: 'Nos dias em que você se exercita, seu estresse médio é {exerciseStress}/10 vs {noExerciseStress}/10 nos dias de descanso. A atividade física é sua aliada contra o estresse.',
      sleepStressCorrelation: 'Estresse afeta seu sono',
      sleepStressCorrelationDesc: 'Em dias de alto estresse (≥6), você dorme {highStressSleep}h vs {lowStressSleep}h em dias tranquilos. Reduzir o estresse pode melhorar seu descanso.',
      weekendEffect: 'Efeito de fim de semana',
      weekendEffectDesc: 'Seu bem-estar {weekendDirection} nos fins de semana. Seu VitalScore médio nos fins de semana é {weekendScore} vs {weekdayScore} nos dias úteis.',
      consistency: 'Consistência no registro',
      consistencyDesc: 'Você registrou {days} de {total} dias possíveis. {message}',
      consistencyGood: 'Sua dedicação ao registro está revelando padrões valiosos!',
      consistencyImprove: 'Tente registrar mais consistentemente para insights mais precisos.',
      trackingProgress: 'Monitorando seu progresso',
      trackingProgressDesc: 'Você registrou {days} dia(s). Continue registrando consistentemente para desbloquear insights mais detalhados sobre seus padrões de bem-estar.',
      weekImprovement: 'Melhoria semanal notável',
      weekImprovementDesc: 'Comparando a última semana com a anterior, seu VitalScore subiu de {prevScore} para {recentScore}. Continue assim!',
      weekDecline: 'Declínio semanal',
      weekDeclineDesc: 'Comparando a última semana com a anterior, seu VitalScore caiu de {prevScore} para {recentScore}. Revise mudanças na sua rotina.',
      bestCategory: 'Seu ponto mais forte',
      bestCategoryDesc: 'Sua categoria mais forte é {category} com uma média de {score}/100. Continue cuidando desta área!',
      weakestCategory: 'Área de oportunidade',
      weakestCategoryDesc: 'Sua categoria mais fraca é {category} com uma média de {score}/100. Pequenas mudanças aqui terão o maior impacto no seu bem-estar.',
    },
    fr: {
      noData: 'Pas encore de données',
      noDataDesc: 'Commencez à enregistrer votre bien-être quotidien pour recevoir des insights personnalisés sur vos habitudes de santé.',
      highStress: 'Niveaux de stress élevés',
      highStressDesc: 'Votre niveau de stress moyen est de {stress}/10. Envisagez des exercices de pleine conscience, la respiration profonde ou parler à quelqu\'un en qui vous avez confiance.',
      moderateStress: 'Stress modéré',
      moderateStressDesc: 'Votre niveau de stress moyen est de {stress}/10. C\'est gérable, mais surveillez les jours de forte pression pour éviter l\'accumulation.',
      lowStress: 'Niveaux de stress faibles',
      lowStressDesc: 'Bravo ! Votre niveau de stress moyen n\'est que de {stress}/10. Continuez ce que vous faites pour maintenir cet état de calme.',
      insufficientSleep: 'Sommeil insuffisant',
      insufficientSleepDesc: 'Vous dormez en moyenne {sleep} heures. La plupart des adultes ont besoin de 7-9 heures pour une santé et une fonction cognitive optimales.',
      approachingSleep: 'Presque le sommeil idéal',
      approachingSleepDesc: 'Vous dormez en moyenne {sleep} heures, proche de la plage recommandée de 7-9 heures. Un peu plus de repos pourrait faire une grande différence.',
      healthySleep: 'Habitudes de sommeil saines',
      healthySleepDesc: 'Vous dormez en moyenne {sleep} heures, ce qui est dans la plage recommandée de 7-9 heures. Bien fait !',
      oversleeping: 'Excès de sommeil détecté',
      oversleepingDesc: 'Vous dormez en moyenne {sleep} heures. Dormir constamment plus de 9 heures peut indiquer des problèmes de santé sous-jacents.',
      lowHydration: 'Hydratation faible',
      lowHydrationDesc: 'Vous buvez en moyenne {water} verres d\'eau par jour. Visez au moins 8 verres pour rester correctement hydraté.',
      moderateHydration: 'Hydratation modérée',
      moderateHydrationDesc: 'Vous buvez en moyenne {water} verres d\'eau par jour. Vous êtes sur la bonne voie, mais atteindre 8 verres améliorerait votre énergie et concentration.',
      wellHydrated: 'Bien hydraté',
      wellHydratedDesc: 'Vous buvez en moyenne {water} verres d\'eau par jour. De bonnes habitudes d\'hydratation soutiennent votre bien-être général.',
      lowExercise: 'Fréquence d\'exercice faible',
      lowExerciseDesc: 'Vous vous êtes exercé seulement {rate}% des jours enregistrés. L\'activité physique régulière améliore significativement la santé mentale et physique.',
      moderateExercise: 'Exercice régulier, perfectible',
      moderateExerciseDesc: 'Vous vous êtes exercé {rate}% des jours enregistrés. Bon début ! Essayez d\'atteindre au moins 5 jours par semaine pour des résultats optimaux.',
      activeLifestyle: 'Mode de vie actif',
      activeLifestyleDesc: 'Vous vous êtes exercé {rate}% des jours enregistrés. Votre engagement envers l\'activité physique porte ses fruits !',
      roomNutrition: 'Amélioration nutritionnelle possible',
      roomNutritionDesc: 'Vous avez en moyenne {meals} repas sains par jour. Essayez d\'incorporer plus d\'aliments complets, de fruits et de légumes dans votre alimentation.',
      moderateNutrition: 'Nutrition acceptable',
      moderateNutritionDesc: 'Vous avez en moyenne {meals} repas sains par jour. Vous êtes sur la bonne voie ; ajoutez une portion de plus de légumes ou fruits pour optimiser.',
      nutritiousEating: 'Habitudes nutritionnelles saines',
      nutritiousEatingDesc: 'Vous avez en moyenne {meals} repas sains par jour. Vos choix nutritionnels soutiennent votre bien-être général.',
      highAlcohol: 'Consommation d\'alcool élevée',
      highAlcoholDesc: 'Vous consommez en moyenne {alcohol} unités d\'alcool par jour. Envisagez de réduire votre consommation pour améliorer le sommeil, la clarté mentale et la santé générale.',
      moderateAlcohol: 'Consommation d\'alcool modérée',
      moderateAlcoholDesc: 'Vous consommez en moyenne {alcohol} unités d\'alcool par jour. C\'est modéré, mais les jours sans alcool bénéficient à votre récupération.',
      lowAlcohol: 'Faible consommation d\'alcool',
      lowAlcoholDesc: 'Vous consommez en moyenne seulement {alcohol} unités d\'alcool par jour. Excellent ! Vos habitudes favorisent un sommeil et une santé mentale optimaux.',
      excellentWellness: 'Bien-être général excellent',
      excellentWellnessDesc: 'Votre VitalScore moyen est de {score}/100. Vous vous débrouillez très bien dans toutes les catégories de bien-être !',
      goodWellness: 'Bon bien-être général',
      goodWellnessDesc: 'Votre VitalScore moyen est de {score}/100. Vous êtes sur la bonne voie ; de petits ajustements pourraient vous amener au niveau optimal.',
      moderateWellness: 'Bien-être modéré',
      moderateWellnessDesc: 'Votre VitalScore moyen est de {score}/100. Il y a de la place pour s\'améliorer — concentrez-vous sur vos domaines les plus faibles pour un impact maximal.',
      wellnessNeeds: 'Le bien-être nécessite de l\'attention',
      wellnessNeedsDesc: 'Votre VitalScore moyen est de {score}/100. Concentrez-vous sur de petites améliorations dans vos domaines les plus faibles pour un impact maximal.',
      upwardTrend: 'Tendance à la hausse',
      upwardTrendDesc: 'Votre VitalScore s\'est amélioré de {diff} points récemment. Vos habitudes positives font la différence !',
      downwardTrend: 'Tendance à la baisse',
      downwardTrendDesc: 'Votre VitalScore a diminué de {diff} points récemment. Envisagez de revoir les changements récents dans votre routine.',
      stableTrend: 'Bien-être stable',
      stableTrendDesc: 'Votre VitalScore reste stable à {score}/100. La constance est essentielle ; continuez à construire sur votre base actuelle.',
      stressExerciseCorrelation: 'L\'exercice réduit votre stress',
      stressExerciseCorrelationDesc: 'Les jours où vous faites de l\'exercice, votre stress moyen est de {exerciseStress}/10 contre {noExerciseStress}/10 les jours de repos. L\'activité physique est votre alliée contre le stress.',
      sleepStressCorrelation: 'Le stress affecte votre sommeil',
      sleepStressCorrelationDesc: 'Les jours de stress élevé (≥6), vous dormez {highStressSleep}h contre {lowStressSleep}h les jours calmes. Réduire le stress pourrait améliorer votre repos.',
      weekendEffect: 'Effet week-end',
      weekendEffectDesc: 'Votre bien-être {weekendDirection} le week-end. Votre VitalScore moyen le week-end est de {weekendScore} contre {weekdayScore} en semaine.',
      consistency: 'Régularité du suivi',
      consistencyDesc: 'Vous avez enregistré {days} sur {total} jours possibles. {message}',
      consistencyGood: 'Votre dedication au suivi révèle des tendances précieuses !',
      consistencyImprove: 'Essayez d\'enregistrer plus régulièrement pour des insights plus précis.',
      trackingProgress: 'Suivi de votre progression',
      trackingProgressDesc: 'Vous avez enregistré {days} jour(s). Continuez à enregistrer régulièrement pour débloquer des insights plus détaillés sur vos habitudes de bien-être.',
      weekImprovement: 'Amélioration hebdomadaire notable',
      weekImprovementDesc: 'En comparant la dernière semaine à la précédente, votre VitalScore est passé de {prevScore} à {recentScore}. Continuez !',
      weekDecline: 'Déclin hebdomadaire',
      weekDeclineDesc: 'En comparant la dernière semaine à la précédente, votre VitalScore est passé de {prevScore} à {recentScore}. Revoyez les changements dans votre routine.',
      bestCategory: 'Votre point fort',
      bestCategoryDesc: 'Votre catégorie la plus forte est {category} avec une moyenne de {score}/100. Continuez à entretenir ce domaine !',
      weakestCategory: 'Domaine à améliorer',
      weakestCategoryDesc: 'Votre catégorie la plus faible est {category} avec une moyenne de {score}/100. De petits changements ici auront le plus grand impact sur votre bien-être.',
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

  // ── Calculate averages ───────────────────────────────────────────
  const avgStress = logs.reduce((acc, l) => acc + (l.stressLevel ?? 5), 0) / logs.length;
  const avgSleep = logs.reduce((acc, l) => acc + (l.sleepHours ?? 7), 0) / logs.length;
  const avgWater = logs.reduce((acc, l) => acc + (l.waterGlasses ?? 4), 0) / logs.length;
  const avgMeals = logs.reduce((acc, l) => acc + (l.mealsHealthy ?? 0), 0) / logs.length;
  const exerciseRate = logs.filter((l) => l.exercised).length / logs.length;
  const avgAlcohol = logs.reduce((acc, l) => acc + (l.alcoholUnits ?? 0), 0) / logs.length;
  const avgVitalScore = logs.reduce((acc, l) => acc + (l.vitalScore ?? 50), 0) / logs.length;

  // Category averages (0-100 scores)
  const avgMental = logs.reduce((acc, l) => acc + (l.mental ?? 50), 0) / logs.length;
  const avgSleepScore = logs.reduce((acc, l) => acc + (l.sleep ?? 50), 0) / logs.length;
  const avgNutrition = logs.reduce((acc, l) => acc + (l.nutrition ?? 50), 0) / logs.length;
  const avgExerciseScore = logs.reduce((acc, l) => acc + (l.exercise ?? 50), 0) / logs.length;
  const avgHydrationScore = logs.reduce((acc, l) => acc + (l.hydration ?? 50), 0) / logs.length;
  const avgHabits = logs.reduce((acc, l) => acc + (l.habits ?? 50), 0) / logs.length;

  // ── Stress insights (3 levels) ───────────────────────────────────
  if (avgStress >= 7) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '😰',
      title: s.highStress,
      description: fmt(s.highStressDesc, { stress: avgStress.toFixed(1) }),
      type: 'negative',
    });
  } else if (avgStress >= 4) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🤔',
      title: s.moderateStress,
      description: fmt(s.moderateStressDesc, { stress: avgStress.toFixed(1) }),
      type: 'neutral',
    });
  } else {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '😌',
      title: s.lowStress,
      description: fmt(s.lowStressDesc, { stress: avgStress.toFixed(1) }),
      type: 'positive',
    });
  }

  // ── Sleep insights (4 levels) ────────────────────────────────────
  if (avgSleep < 6) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '😴',
      title: s.insufficientSleep,
      description: fmt(s.insufficientSleepDesc, { sleep: avgSleep.toFixed(1) }),
      type: 'negative',
    });
  } else if (avgSleep < 7) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🌙',
      title: s.approachingSleep,
      description: fmt(s.approachingSleepDesc, { sleep: avgSleep.toFixed(1) }),
      type: 'neutral',
    });
  } else if (avgSleep <= 9) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '😴',
      title: s.healthySleep,
      description: fmt(s.healthySleepDesc, { sleep: avgSleep.toFixed(1) }),
      type: 'positive',
    });
  } else {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🛌',
      title: s.oversleeping,
      description: fmt(s.oversleepingDesc, { sleep: avgSleep.toFixed(1) }),
      type: 'neutral',
    });
  }

  // ── Hydration insights (3 levels) ────────────────────────────────
  if (avgWater < 5) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '💧',
      title: s.lowHydration,
      description: fmt(s.lowHydrationDesc, { water: avgWater.toFixed(1) }),
      type: 'negative',
    });
  } else if (avgWater < 8) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '💧',
      title: s.moderateHydration,
      description: fmt(s.moderateHydrationDesc, { water: avgWater.toFixed(1) }),
      type: 'neutral',
    });
  } else {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '💦',
      title: s.wellHydrated,
      description: fmt(s.wellHydratedDesc, { water: avgWater.toFixed(1) }),
      type: 'positive',
    });
  }

  // ── Exercise insights (3 levels) ─────────────────────────────────
  if (exerciseRate < 0.3) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🏃',
      title: s.lowExercise,
      description: fmt(s.lowExerciseDesc, { rate: (exerciseRate * 100).toFixed(0) }),
      type: 'negative',
    });
  } else if (exerciseRate < 0.7) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🏃',
      title: s.moderateExercise,
      description: fmt(s.moderateExerciseDesc, { rate: (exerciseRate * 100).toFixed(0) }),
      type: 'neutral',
    });
  } else {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '💪',
      title: s.activeLifestyle,
      description: fmt(s.activeLifestyleDesc, { rate: (exerciseRate * 100).toFixed(0) }),
      type: 'positive',
    });
  }

  // ── Nutrition insights (3 levels) ────────────────────────────────
  if (avgMeals < 1.5) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🥗',
      title: s.roomNutrition,
      description: fmt(s.roomNutritionDesc, { meals: avgMeals.toFixed(1) }),
      type: 'negative',
    });
  } else if (avgMeals < 2.5) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🥗',
      title: s.moderateNutrition,
      description: fmt(s.moderateNutritionDesc, { meals: avgMeals.toFixed(1) }),
      type: 'neutral',
    });
  } else {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🥬',
      title: s.nutritiousEating,
      description: fmt(s.nutritiousEatingDesc, { meals: avgMeals.toFixed(1) }),
      type: 'positive',
    });
  }

  // ── Alcohol insights (3 levels) ──────────────────────────────────
  if (avgAlcohol >= 3) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🍷',
      title: s.highAlcohol,
      description: fmt(s.highAlcoholDesc, { alcohol: avgAlcohol.toFixed(1) }),
      type: 'negative',
    });
  } else if (avgAlcohol >= 1) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🍷',
      title: s.moderateAlcohol,
      description: fmt(s.moderateAlcoholDesc, { alcohol: avgAlcohol.toFixed(1) }),
      type: 'neutral',
    });
  } else {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🚫',
      title: s.lowAlcohol,
      description: fmt(s.lowAlcoholDesc, { alcohol: avgAlcohol.toFixed(1) }),
      type: 'positive',
    });
  }

  // ── Overall VitalScore insight (4 levels) ─────────────────────────
  if (avgVitalScore >= 80) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '🌟',
      title: s.excellentWellness,
      description: fmt(s.excellentWellnessDesc, { score: avgVitalScore.toFixed(0) }),
      type: 'positive',
    });
  } else if (avgVitalScore >= 60) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '👍',
      title: s.goodWellness,
      description: fmt(s.goodWellnessDesc, { score: avgVitalScore.toFixed(0) }),
      type: 'positive',
    });
  } else if (avgVitalScore >= 40) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '📊',
      title: s.moderateWellness,
      description: fmt(s.moderateWellnessDesc, { score: avgVitalScore.toFixed(0) }),
      type: 'neutral',
    });
  } else {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '⚠️',
      title: s.wellnessNeeds,
      description: fmt(s.wellnessNeedsDesc, { score: avgVitalScore.toFixed(0) }),
      type: 'negative',
    });
  }

  // ── Trend insight (3 levels) ─────────────────────────────────────
  if (logs.length >= 5) {
    const recentCount = Math.min(5, Math.ceil(logs.length * 0.3));
    const recentScores = logs.slice(0, recentCount).map((l) => l.vitalScore ?? 50);
    const olderScores = logs.slice(recentCount, recentCount * 2).map((l) => l.vitalScore ?? 50);
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
    } else {
      insights.push({
        id: `insight-${idCounter++}`,
        emoji: '➡️',
        title: s.stableTrend,
        description: fmt(s.stableTrendDesc, { score: avgVitalScore.toFixed(0) }),
        type: 'neutral',
      });
    }
  }

  // ── Best / Weakest category insights ─────────────────────────────
  if (logs.length >= 3) {
    const categoryNames: Record<SupportedLocale, Record<string, string>> = {
      es: { mental: 'Salud Mental', sleep: 'Sueño', nutrition: 'Nutrición', exercise: 'Ejercicio', hydration: 'Hidratación', habits: 'Hábitos' },
      en: { mental: 'Mental Health', sleep: 'Sleep', nutrition: 'Nutrition', exercise: 'Exercise', hydration: 'Hydration', habits: 'Habits' },
      pt: { mental: 'Saúde Mental', sleep: 'Sono', nutrition: 'Nutrição', exercise: 'Exercício', hydration: 'Hidratação', habits: 'Hábitos' },
      fr: { mental: 'Santé Mentale', sleep: 'Sommeil', nutrition: 'Nutrition', exercise: 'Exercice', hydration: 'Hydratation', habits: 'Habitudes' },
    };

    const catNames = categoryNames[locale] || categoryNames.en;
    const categories: { key: string; avg: number }[] = [
      { key: 'mental', avg: avgMental },
      { key: 'sleep', avg: avgSleepScore },
      { key: 'nutrition', avg: avgNutrition },
      { key: 'exercise', avg: avgExerciseScore },
      { key: 'hydration', avg: avgHydrationScore },
      { key: 'habits', avg: avgHabits },
    ];

    categories.sort((a, b) => b.avg - a.avg);
    const best = categories[0];
    const weakest = categories[categories.length - 1];

    // Only show best/weakest if there's meaningful difference
    if (best.avg - weakest.avg >= 10) {
      insights.push({
        id: `insight-${idCounter++}`,
        emoji: '🏆',
        title: s.bestCategory,
        description: fmt(s.bestCategoryDesc, { category: catNames[best.key], score: best.avg.toFixed(0) }),
        type: 'positive',
      });

      insights.push({
        id: `insight-${idCounter++}`,
        emoji: '🎯',
        title: s.weakestCategory,
        description: fmt(s.weakestCategoryDesc, { category: catNames[weakest.key], score: weakest.avg.toFixed(0) }),
        type: 'neutral',
      });
    }
  }

  // ── Correlation insights (exercise ↔ stress) ─────────────────────
  if (logs.length >= 5) {
    const exerciseDays = logs.filter((l) => l.exercised);
    const noExerciseDays = logs.filter((l) => !l.exercised);

    if (exerciseDays.length >= 2 && noExerciseDays.length >= 2) {
      const exerciseStressAvg = exerciseDays.reduce((acc, l) => acc + (l.stressLevel ?? 5), 0) / exerciseDays.length;
      const noExerciseStressAvg = noExerciseDays.reduce((acc, l) => acc + (l.stressLevel ?? 5), 0) / noExerciseDays.length;

      if (noExerciseStressAvg - exerciseStressAvg >= 1) {
        insights.push({
          id: `insight-${idCounter++}`,
          emoji: '🧠',
          title: s.stressExerciseCorrelation,
          description: fmt(s.stressExerciseCorrelationDesc, {
            exerciseStress: exerciseStressAvg.toFixed(1),
            noExerciseStress: noExerciseStressAvg.toFixed(1),
          }),
          type: 'info',
        });
      }
    }

    // ── Correlation insights (stress ↔ sleep) ──────────────────────
    const highStressDays = logs.filter((l) => (l.stressLevel ?? 5) >= 6);
    const lowStressDays = logs.filter((l) => (l.stressLevel ?? 5) <= 3);

    if (highStressDays.length >= 2 && lowStressDays.length >= 2) {
      const highStressSleep = highStressDays.reduce((acc, l) => acc + (l.sleepHours ?? 7), 0) / highStressDays.length;
      const lowStressSleep = lowStressDays.reduce((acc, l) => acc + (l.sleepHours ?? 7), 0) / lowStressDays.length;

      if (lowStressSleep - highStressSleep >= 0.5) {
        insights.push({
          id: `insight-${idCounter++}`,
          emoji: '🔗',
          title: s.sleepStressCorrelation,
          description: fmt(s.sleepStressCorrelationDesc, {
            highStressSleep: highStressSleep.toFixed(1),
            lowStressSleep: lowStressSleep.toFixed(1),
          }),
          type: 'info',
        });
      }
    }
  }

  // ── Weekend vs weekday effect ─────────────────────────────────────
  if (logs.length >= 7) {
    const weekendLogs = logs.filter((l) => {
      const d = new Date(l.date);
      const day = d.getDay();
      return day === 0 || day === 6;
    });
    const weekdayLogs = logs.filter((l) => {
      const d = new Date(l.date);
      const day = d.getDay();
      return day !== 0 && day !== 6;
    });

    if (weekendLogs.length >= 2 && weekdayLogs.length >= 3) {
      const weekendAvg = weekendLogs.reduce((acc, l) => acc + (l.vitalScore ?? 50), 0) / weekendLogs.length;
      const weekdayAvg = weekdayLogs.reduce((acc, l) => acc + (l.vitalScore ?? 50), 0) / weekdayLogs.length;
      const diff = Math.abs(weekendAvg - weekdayAvg);

      if (diff >= 5) {
        const weekendDirection = weekendAvg > weekdayAvg ? 'improves' : 'declines';
        const weekendDirectionTranslations: Record<SupportedLocale, { improves: string; declines: string }> = {
          es: { improves: 'mejora', declines: 'empeora' },
          en: { improves: 'improves', declines: 'declines' },
          pt: { improves: 'melhora', declines: 'piora' },
          fr: { improves: 's\'améliore', declines: 'diminue' },
        };
        const dir = weekendDirectionTranslations[locale]?.[weekendDirection] ?? weekendDirection;

        insights.push({
          id: `insight-${idCounter++}`,
          emoji: weekendAvg > weekdayAvg ? '🎉' : '📉',
          title: s.weekendEffect,
          description: fmt(s.weekendEffectDesc, {
            weekendDirection: dir,
            weekendScore: weekendAvg.toFixed(0),
            weekdayScore: weekdayAvg.toFixed(0),
          }),
          type: weekendAvg > weekdayAvg ? 'positive' : 'neutral',
        });
      }
    }
  }

  // ── Weekly improvement/decline ────────────────────────────────────
  if (logs.length >= 10) {
    // Sort logs by date ascending for weekly comparison
    const sortedByDate = [...logs].sort((a, b) => a.date.localeCompare(b.date));
    const last7 = sortedByDate.slice(-7);
    const prev7 = sortedByDate.slice(-14, -7);

    if (prev7.length >= 3) {
      const last7Avg = last7.reduce((acc, l) => acc + (l.vitalScore ?? 50), 0) / last7.length;
      const prev7Avg = prev7.reduce((acc, l) => acc + (l.vitalScore ?? 50), 0) / prev7.length;
      const diff = last7Avg - prev7Avg;

      if (diff > 3) {
        insights.push({
          id: `insight-${idCounter++}`,
          emoji: '📅',
          title: s.weekImprovement,
          description: fmt(s.weekImprovementDesc, { prevScore: prev7Avg.toFixed(0), recentScore: last7Avg.toFixed(0) }),
          type: 'positive',
        });
      } else if (diff < -3) {
        insights.push({
          id: `insight-${idCounter++}`,
          emoji: '📅',
          title: s.weekDecline,
          description: fmt(s.weekDeclineDesc, { prevScore: prev7Avg.toFixed(0), recentScore: last7Avg.toFixed(0) }),
          type: 'negative',
        });
      }
    }
  }

  // ── If still no specific insights, add a general one ──────────────
  if (insights.length === 0) {
    insights.push({
      id: `insight-${idCounter++}`,
      emoji: '📊',
      title: s.trackingProgress,
      description: fmt(s.trackingProgressDesc, { days: logs.length }),
      type: 'neutral',
    });
  }

  // Limit to 8 insights max to avoid overwhelming the user
  return insights.slice(0, 8);
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

Provide 4-6 insights as a JSON array. Each insight must have:
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
