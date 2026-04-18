'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/context';
import {
  LogData,
  MOOD_OPTIONS,
  QUICK_LOG_PRESETS,
  calculateMentalScore,
  calculateSleepScore,
  calculateNutritionScore,
  calculateExerciseScore,
  calculateHydrationScore,
  calculateHabitsScore,
  calculateVitalScore,
  getScoreColor,
  getTodayStr,
} from '@/lib/vitalscore';
import { Minus, Plus, Check, Save, Sparkles } from 'lucide-react';

export type { LogData };

interface QuickLogProps {
  onSave: (data: LogData) => Promise<void>;
  streak: number;
}

export default function QuickLog({ onSave, streak }: QuickLogProps) {
  const { t } = useTranslation();

  const [stressLevel, setStressLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(7);
  const [waterGlasses, setWaterGlasses] = useState(4);
  const [exercised, setExercised] = useState(false);
  const [mealsHealthy, setMealsHealthy] = useState(2);
  const [alcoholUnits, setAlcoholUnits] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedMood = useMemo(
    () => MOOD_OPTIONS.find((m) => m.stressLevel === stressLevel) ?? MOOD_OPTIONS[2],
    [stressLevel]
  );

  const estimatedScore = useMemo(() => {
    const mental = calculateMentalScore(stressLevel);
    const sleep = calculateSleepScore(sleepHours);
    const nutrition = calculateNutritionScore(mealsHealthy);
    const exercise = calculateExerciseScore(exercised);
    const hydration = calculateHydrationScore(waterGlasses);
    const habits = calculateHabitsScore(alcoholUnits);
    return calculateVitalScore(mental, sleep, nutrition, exercise, hydration, habits);
  }, [stressLevel, sleepHours, mealsHealthy, exercised, waterGlasses, alcoholUnits]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await onSave({
        date: getTodayStr(),
        stressLevel,
        sleepHours,
        waterGlasses,
        exercised,
        mealsHealthy,
        alcoholUnits,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }, [onSave, stressLevel, sleepHours, waterGlasses, exercised, mealsHealthy, alcoholUnits]);

  const applyPreset = useCallback((presetIndex: number) => {
    const preset = QUICK_LOG_PRESETS[presetIndex];
    setStressLevel(preset.stressLevel);
    setSleepHours(preset.sleepHours);
    setWaterGlasses(preset.waterGlasses);
    setExercised(preset.exercised);
    setMealsHealthy(preset.mealsHealthy);
    setAlcoholUnits(preset.alcoholUnits);
  }, []);

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-foreground">{t('log.title')}</h2>
        {streak > 0 && (
          <p className="text-sm text-muted-foreground mt-1">
            🔥 {streak} {t('dashboard.streak')}
          </p>
        )}
      </div>

      {/* Estimated Score Preview */}
      <Card className="border-none bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
        <CardContent className="flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span className="text-sm font-medium">{t('log.estimatedScore')}</span>
          </div>
          <span className={`text-2xl font-bold ${getScoreColor(estimatedScore)}`}>
            {estimatedScore}
          </span>
        </CardContent>
      </Card>

      {/* Quick Presets */}
      <div className="flex gap-2">
        {QUICK_LOG_PRESETS.map((preset, idx) => (
          <Button
            key={preset.labelKey}
            variant="outline"
            size="sm"
            className="flex-1 text-xs"
            onClick={() => applyPreset(idx)}
          >
            {idx === 0 ? '🌟' : idx === 1 ? '👌' : '😓'} {t(preset.labelKey)}
          </Button>
        ))}
      </div>

      {/* Mood Selector */}
      <Card>
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium">{t('log.mood')}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex justify-between gap-1">
            {MOOD_OPTIONS.map((mood) => (
              <button
                key={mood.stressLevel}
                type="button"
                onClick={() => setStressLevel(mood.stressLevel)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                  stressLevel === mood.stressLevel
                    ? 'bg-emerald-100 dark:bg-emerald-900/40 scale-110'
                    : 'hover:bg-muted/50'
                }`}
              >
                <span className="text-2xl">{mood.emoji}</span>
                <span className="text-[10px] text-muted-foreground">{t(mood.labelKey)}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sleep Hours */}
      <Card>
        <CardContent className="flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">😴</span>
            <span className="text-sm font-medium">{t('log.sleep')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSleepHours(Math.max(0, sleepHours - 0.5))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-lg font-bold w-12 text-center">{sleepHours}h</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setSleepHours(Math.min(14, sleepHours + 0.5))}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Water Glasses */}
      <Card>
        <CardContent className="flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">💧</span>
            <span className="text-sm font-medium">{t('log.water')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setWaterGlasses(Math.max(0, waterGlasses - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-lg font-bold w-8 text-center">{waterGlasses}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setWaterGlasses(Math.min(12, waterGlasses + 1))}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Exercise Toggle */}
      <Card>
        <CardContent className="flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏃</span>
            <span className="text-sm font-medium">{t('log.exercise')}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">
              {exercised ? t('log.exercise.yes') : t('log.exercise.no')}
            </span>
            <Switch checked={exercised} onCheckedChange={setExercised} />
          </div>
        </CardContent>
      </Card>

      {/* Healthy Meals */}
      <Card>
        <CardContent className="flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🥗</span>
            <span className="text-sm font-medium">{t('log.meals')}</span>
          </div>
          <div className="flex items-center gap-2">
            {[0, 1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMealsHealthy(n)}
                className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                  n <= mealsHealthy
                    ? 'bg-emerald-500 text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alcohol Units */}
      <Card>
        <CardContent className="flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🍷</span>
            <span className="text-sm font-medium">{t('log.alcohol')}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setAlcoholUnits(Math.max(0, alcoholUnits - 1))}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="text-lg font-bold w-8 text-center">{alcoholUnits}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setAlcoholUnits(Math.min(10, alcoholUnits + 1))}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="w-full h-12 text-base font-semibold bg-[#1a2e44] hover:bg-[#243b54] text-white shadow-md rounded-2xl"
          size="lg"
        >
          <AnimatePresence mode="wait">
            {saved ? (
              <motion.span
                key="saved"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2"
              >
                <Check className="w-5 h-5" /> {t('log.saved')}
              </motion.span>
            ) : saving ? (
              <motion.span
                key="saving"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                  <Save className="w-5 h-5" />
                </motion.span>
                {t('log.saving')}
              </motion.span>
            ) : (
              <motion.span
                key="save"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Save className="w-5 h-5" /> {t('log.save')}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
    </div>
  );
}
