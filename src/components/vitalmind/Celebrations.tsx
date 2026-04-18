'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/context';
import { LogEntry, ACHIEVEMENT_DEFS, calculateVitalScore } from '@/lib/vitalscore';
import { X, PartyPopper } from 'lucide-react';

interface CelebrationsProps {
  logs: LogEntry[];
  currentScore: number | null;
}

interface CelebrationItem {
  id: string;
  emoji: string;
  title: string;
  message: string;
}

// Score milestone definitions
const SCORE_MILESTONES = [
  { threshold: 95, key: 'celebration.score95', emoji: '🏆' },
  { threshold: 90, key: 'celebration.score90', emoji: '🌟' },
  { threshold: 80, key: 'celebration.score80', emoji: '🎉' },
  { threshold: 70, key: 'celebration.score70', emoji: '💪' },
  { threshold: 60, key: 'celebration.score60', emoji: '🚀' },
];

export default function Celebrations({ logs, currentScore }: CelebrationsProps) {
  const { t } = useTranslation();
  const [celebrations, setCelebrations] = useState<CelebrationItem[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [prevLogCount, setPrevLogCount] = useState(0);

  // Check for new achievements when logs change
  useEffect(() => {
    if (logs.length <= prevLogCount) {
      setPrevLogCount(logs.length);
      return;
    }
    setPrevLogCount(logs.length);

    const newCelebrations: CelebrationItem[] = [];

    // Check achievements
    for (const def of ACHIEVEMENT_DEFS) {
      const result = def.check(logs);
      if (result.unlocked) {
        const id = `ach-${def.id}`;
        if (!dismissed.has(id)) {
          // Check if this is a newly unlocked achievement
          const prevLogs = logs.slice(0, -1);
          const prevResult = def.check(prevLogs);
          if (!prevResult.unlocked) {
            newCelebrations.push({
              id,
              emoji: def.emoji,
              title: t('celebration.achievement'),
              message: `${t(def.nameKey)} — ${t(def.descKey)}`,
            });
          }
        }
      }
    }

    // Check score milestones
    if (currentScore !== null) {
      for (const milestone of SCORE_MILESTONES) {
        if (currentScore >= milestone.threshold) {
          const id = `score-${milestone.threshold}`;
          if (!dismissed.has(id)) {
            newCelebrations.push({
              id,
              emoji: milestone.emoji,
              title: t('celebration.milestone'),
              message: t(milestone.key),
            });
            break; // Only show highest milestone
          }
        }
      }
    }

    if (newCelebrations.length > 0) {
      setCelebrations((prev) => [...prev, ...newCelebrations]);
    }
  }, [logs, currentScore, dismissed, prevLogCount, t]);

  const dismissCelebration = useCallback((id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
    setCelebrations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  // Generate confetti pieces
  const confettiPieces = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.5,
      duration: 1.5 + Math.random() * 1.5,
      size: 6 + Math.random() * 8,
      color: ['#10b981', '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#0ea5e9'][Math.floor(Math.random() * 6)],
      rotation: Math.random() * 360,
    }));
  }, []);

  if (celebrations.length === 0) return null;

  return (
    <AnimatePresence>
      {celebrations.length > 0 && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Confetti */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            {confettiPieces.map((piece) => (
              <motion.div
                key={piece.id}
                className="absolute rounded-sm"
                style={{
                  left: `${piece.left}%`,
                  top: '-20px',
                  width: piece.size,
                  height: piece.size,
                  backgroundColor: piece.color,
                  rotate: piece.rotation,
                }}
                animate={{
                  y: ['0vh', '110vh'],
                  rotate: [piece.rotation, piece.rotation + 720],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: piece.duration,
                  delay: piece.delay,
                  ease: 'easeIn',
                }}
              />
            ))}
          </div>

          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              celebrations.forEach((c) => dismissCelebration(c.id));
            }}
          />

          {/* Celebration Card */}
          <motion.div
            className="relative z-10 w-full max-w-sm"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-emerald-300 dark:border-emerald-800">
              <CardContent className="p-6 text-center space-y-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="text-5xl"
                >
                  {celebrations[0].emoji}
                </motion.div>

                <h3 className="text-xl font-bold text-foreground">
                  {celebrations[0].title}
                </h3>

                <p className="text-sm text-muted-foreground">
                  {celebrations[0].message}
                </p>

                <Button
                  onClick={() => dismissCelebration(celebrations[0].id)}
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                >
                  <X className="w-4 h-4 mr-1" />
                  {t('celebration.dismiss')}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
