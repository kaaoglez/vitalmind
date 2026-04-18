'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/context';
import { LogEntry, ACHIEVEMENT_DEFS } from '@/lib/vitalscore';
import { Lock, Trophy, Star } from 'lucide-react';

interface AchievementsProps {
  logs: LogEntry[];
}

export default function Achievements({ logs }: AchievementsProps) {
  const { t } = useTranslation();

  const achievementStates = useMemo(() => {
    return ACHIEVEMENT_DEFS.map((def) => {
      const result = def.check(logs);
      return {
        ...def,
        unlocked: result.unlocked,
        progress: result.progress,
      };
    });
  }, [logs]);

  const unlockedCount = achievementStates.filter((a) => a.unlocked).length;
  const totalCount = achievementStates.length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{t('achievements.title')}</h2>
        <Badge variant="secondary" className="text-xs">
          <Trophy className="w-3 h-3 mr-1" />
          {unlockedCount}/{totalCount}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {achievementStates.map((ach, index) => {
          const progressPct = ach.maxProgress > 0 ? (ach.progress / ach.maxProgress) * 100 : 0;

          return (
            <motion.div
              key={ach.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={`h-full transition-all ${
                  ach.unlocked
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-900/40'
                    : 'opacity-60'
                }`}
              >
                <CardContent className="p-3 flex flex-col items-center text-center space-y-2">
                  {/* Emoji / Lock */}
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      ach.unlocked
                        ? 'bg-emerald-100 dark:bg-emerald-900/40'
                        : 'bg-muted/50'
                    }`}
                  >
                    {ach.unlocked ? (
                      <span>{ach.emoji}</span>
                    ) : (
                      <Lock className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Name */}
                  <h3 className="text-xs font-semibold leading-tight">
                    {t(ach.nameKey)}
                  </h3>

                  {/* Description */}
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    {t(ach.descKey)}
                  </p>

                  {/* Progress bar for incomplete */}
                  {!ach.unlocked && ach.maxProgress > 1 && (
                    <div className="w-full space-y-1">
                      <Progress value={progressPct} className="h-1.5" />
                      <p className="text-[9px] text-muted-foreground">
                        {ach.progress}/{ach.maxProgress}
                      </p>
                    </div>
                  )}

                  {/* Unlocked badge */}
                  {ach.unlocked && (
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1.5 py-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    >
                      <Star className="w-2.5 h-2.5 mr-0.5" />
                      {t('achievements.unlocked')}
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Motivational message */}
      {unlockedCount < totalCount && (
        <p className="text-center text-sm text-muted-foreground mt-4">
          ✨ {t('achievements.motivation')}
        </p>
      )}
    </div>
  );
}
