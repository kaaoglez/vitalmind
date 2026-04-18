'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/context';
import type { RecommendationItem, Priority } from '@/lib/vitalscore';
import { Compass, AlertTriangle, Info } from 'lucide-react';

interface RecommendationsProps {
  recommendations: RecommendationItem[];
  loading: boolean;
}

const priorityStyles: Record<Priority, { badge: string; card: string; icon: React.ReactNode }> = {
  high: {
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    card: 'bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 border-red-200 dark:border-red-900/40',
    icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
  },
  medium: {
    badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    card: '',
    icon: <Info className="w-4 h-4 text-amber-500" />,
  },
  low: {
    badge: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
    card: '',
    icon: <Info className="w-4 h-4 text-sky-500" />,
  },
};

const priorityLabelKeys: Record<Priority, string> = {
  high: 'recs.priority.high',
  medium: 'recs.priority.medium',
  low: 'recs.priority.low',
};

export default function Recommendations({ recommendations, loading }: RecommendationsProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-teal-500" />
          <h2 className="text-lg font-bold">{t('recs.title')}</h2>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/3" />
            </CardContent>
          </Card>
        ))}
        <p className="text-center text-xs text-muted-foreground">{t('recs.loading')}</p>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-teal-500" />
          <h2 className="text-lg font-bold">{t('recs.title')}</h2>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Compass className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">{t('recs.empty')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const highPriority = recommendations.filter((r) => r.priority === 'high');
  const otherPriority = recommendations.filter((r) => r.priority !== 'high');

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Compass className="w-5 h-5 text-teal-500" />
        <h2 className="text-lg font-bold">{t('recs.title')}</h2>
      </div>

      {/* High Priority Card with Gradient */}
      {highPriority.map((rec, index) => (
        <motion.div
          key={rec.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className={priorityStyles.high.card}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                {priorityStyles.high.icon}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold">{rec.title}</h3>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 ${priorityStyles.high.badge}`}
                    >
                      {t(priorityLabelKeys.high)}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Medium / Low Priority Cards */}
      {otherPriority.map((rec, index) => {
        const style = priorityStyles[rec.priority];
        return (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (highPriority.length + index) * 0.08 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {style.icon}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold">{rec.title}</h3>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 ${style.badge}`}
                      >
                        {t(priorityLabelKeys[rec.priority])}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {rec.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* AI Disclaimer */}
      <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed px-4">
        ⚠️ {t('recs.disclaimer')}
      </p>
    </div>
  );
}
