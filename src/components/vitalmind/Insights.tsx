'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from '@/lib/i18n/context';
import type { InsightItem, InsightType } from '@/lib/vitalscore';
import { Lightbulb, Sparkles } from 'lucide-react';

interface InsightsProps {
  insights: InsightItem[];
  loading: boolean;
}

const typeBadgeStyles: Record<InsightType, string> = {
  positive: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  negative: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  neutral: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
};

const typeLabelKeys: Record<InsightType, string> = {
  positive: 'insights.positive',
  negative: 'insights.negative',
  neutral: 'insights.neutral',
  info: 'insights.info',
};

export default function Insights({ insights, loading }: InsightsProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-teal-500" />
          <h2 className="text-lg font-bold">{t('insights.title')}</h2>
        </div>
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-1/2" />
            </CardContent>
          </Card>
        ))}
        <p className="text-center text-xs text-muted-foreground">{t('insights.loading')}</p>
      </div>
    );
  }

  if (insights.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-teal-500" />
          <h2 className="text-lg font-bold">{t('insights.title')}</h2>
        </div>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Sparkles className="w-10 h-10 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">{t('insights.empty')}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-teal-500" />
        <h2 className="text-lg font-bold">{t('insights.title')}</h2>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => (
          <motion.div
            key={insight.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
          >
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0 mt-0.5">{insight.emoji}</span>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold">{insight.title}</h3>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] px-1.5 py-0 ${typeBadgeStyles[insight.type]}`}
                      >
                        {t(typeLabelKeys[insight.type])}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
