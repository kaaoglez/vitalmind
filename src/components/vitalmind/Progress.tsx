'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from '@/lib/i18n/context';
import { LogEntry, CATEGORIES, calculateVitalScore, getScoreColor, getTrend } from '@/lib/vitalscore';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
} from 'recharts';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  BarChart3,
  Activity,
  TrendingUp,
  TrendingDown,
  Minus,
  Hash,
  Crown,
  AlertTriangle,
} from 'lucide-react';

interface ProgressProps {
  logs: LogEntry[];
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

export default function Progress({ logs }: ProgressProps) {
  const { t } = useTranslation();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('calendar');

  // Callback ref: scrolls as soon as the detail element mounts in the DOM
  const detailScrollRef = React.useCallback((node: HTMLDivElement | null) => {
    if (node) {
      // Small delay to let the browser paint, then smooth scroll
      setTimeout(() => {
        node.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
    setSelectedDay(null);
  };

  // Build log map for quick lookup
  const logMap = useMemo(() => {
    const map = new Map<string, LogEntry>();
    for (const log of logs) {
      map.set(log.date, log);
    }
    return map;
  }, [logs]);

  // Compute all scores for stats
  const allScores = useMemo(() => {
    return logs.map((log) => {
      if (log.vitalScore != null) return { score: log.vitalScore, date: log.date };
      return {
        score: calculateVitalScore(log.mental, log.sleep, log.nutrition, log.exercise, log.hydration, log.habits),
        date: log.date,
      };
    });
  }, [logs]);

  // Summary stats
  const stats = useMemo(() => {
    if (allScores.length === 0) {
      return { avg: 0, totalDays: 0, bestScore: 0, bestDate: '', worstScore: 0, worstDate: '', trend: 'stable' as const };
    }

    const totalDays = allScores.length;
    const avg = Math.round(allScores.reduce((sum, s) => sum + s.score, 0) / totalDays);

    let best = allScores[0];
    let worst = allScores[0];
    for (const s of allScores) {
      if (s.score > best.score) best = s;
      if (s.score < worst.score) worst = s;
    }

    const trend = getTrend(allScores.map((s) => s.score));

    return {
      avg,
      totalDays,
      bestScore: best.score,
      bestDate: best.date,
      worstScore: worst.score,
      worstDate: worst.date,
      trend,
    };
  }, [allScores]);

  // Format date to short form: "15 abr"
  const formatShortDate = (dateStr: string): string => {
    const d = new Date(dateStr + 'T12:00:00');
    const day = d.getDate();
    const months = t('progress.stats.shortMonths').split(',');
    const monthIdx = d.getMonth();
    return `${day} ${months[monthIdx] || ''}`.trim();
  };

  // Calendar data
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
    const days: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  }, [viewYear, viewMonth]);

  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const getDayScore = (day: number): number | null => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const log = logMap.get(dateStr);
    if (!log) return null;
    if (log.vitalScore != null) return log.vitalScore;
    return calculateVitalScore(log.mental, log.sleep, log.nutrition, log.exercise, log.hydration, log.habits);
  };

  const getScoreBg = (score: number | null): string => {
    if (score === null) return 'bg-muted/30';
    if (score >= 80) return 'bg-emerald-400 text-white';
    if (score >= 60) return 'bg-amber-300 text-amber-900';
    if (score >= 40) return 'bg-orange-300 text-orange-900';
    return 'bg-red-300 text-red-900';
  };

  // Selected day detail
  const selectedLog = useMemo(() => {
    if (!selectedDay) return null;
    return logMap.get(selectedDay) ?? null;
  }, [selectedDay, logMap]);

  // Line chart data
  const lineChartData = useMemo(() => {
    return logs.slice(-30).map((log) => {
      const score =
        log.vitalScore ?? calculateVitalScore(log.mental, log.sleep, log.nutrition, log.exercise, log.hydration, log.habits);
      return {
        date: log.date.slice(5), // MM-DD
        score,
      };
    });
  }, [logs]);

  // Radar chart data — averages over recent logs
  const radarData = useMemo(() => {
    const recent = logs.slice(-14);
    if (recent.length === 0) return [];
    const sums: Record<string, number> = {};
    for (const cat of CATEGORIES) {
      sums[cat.key] = 0;
    }
    for (const log of recent) {
      for (const cat of CATEGORIES) {
        sums[cat.key] += (log[cat.key as keyof LogEntry] as number) ?? 0;
      }
    }
    return CATEGORIES.map((cat) => ({
      category: t(cat.nameKey),
      score: Math.round(sums[cat.key] / recent.length),
    }));
  }, [logs, t]);

  // Bar chart data — last 7 days by category
  const barChartData = useMemo(() => {
    return logs.slice(-7).map((log) => {
      const entry: Record<string, string | number> = { date: log.date.slice(5) };
      for (const cat of CATEGORIES) {
        entry[cat.key] = (log[cat.key as keyof LogEntry] as number) ?? 0;
      }
      return entry;
    });
  }, [logs]);

  // Trend icon + color
  const TrendIcon = stats.trend === 'up' ? TrendingUp : stats.trend === 'down' ? TrendingDown : Minus;
  const trendColor = stats.trend === 'up' ? 'text-emerald-500' : stats.trend === 'down' ? 'text-red-500' : 'text-muted-foreground';
  const trendLabel = stats.trend === 'up' ? t('progress.stats.improving') : stats.trend === 'down' ? t('progress.stats.declining') : t('progress.stats.stable');

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold">{t('progress.title')}</h2>

      {/* Summary Stats Cards */}
      {allScores.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {/* Average Score */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-1">
                <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground">{t('progress.stats.average')}</span>
              </div>
              <span className={`text-2xl font-bold ${getScoreColor(stats.avg)}`}>{stats.avg}</span>
              <div className={`flex items-center gap-0.5 mt-1 ${trendColor}`}>
                <TrendIcon className="w-3 h-3" />
                <span className="text-[10px] font-medium">{trendLabel}</span>
              </div>
            </CardContent>
          </Card>

          {/* Total Days */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-1">
                <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground">{t('progress.stats.totalDays')}</span>
              </div>
              <span className="text-2xl font-bold text-foreground">{stats.totalDays}</span>
              <span className="text-[10px] text-muted-foreground mt-1">{t('progress.stats.registered')}</span>
            </CardContent>
          </Card>

          {/* Best Day */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-1">
                <Crown className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[10px] font-medium text-muted-foreground">{t('progress.stats.bestDay')}</span>
              </div>
              <span className={`text-2xl font-bold ${getScoreColor(stats.bestScore)}`}>{stats.bestScore}</span>
              <span className="text-[10px] text-muted-foreground mt-1">{formatShortDate(stats.bestDate)}</span>
            </CardContent>
          </Card>

          {/* Worst Day */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-3 flex flex-col items-center text-center">
              <div className="flex items-center gap-1 mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                <span className="text-[10px] font-medium text-muted-foreground">{t('progress.stats.worstDay')}</span>
              </div>
              <span className={`text-2xl font-bold ${getScoreColor(stats.worstScore)}`}>{stats.worstScore}</span>
              <span className="text-[10px] text-muted-foreground mt-1">{formatShortDate(stats.worstDate)}</span>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="calendar" className="text-xs">
            <Calendar className="w-3.5 h-3.5 mr-1" />
            {t('progress.calendar')}
          </TabsTrigger>
          <TabsTrigger value="chart" className="text-xs">
            <BarChart3 className="w-3.5 h-3.5 mr-1" />
            {t('progress.chart')}
          </TabsTrigger>
          <TabsTrigger value="radar" className="text-xs">
            <Activity className="w-3.5 h-3.5 mr-1" />
            {t('progress.radar')}
          </TabsTrigger>
        </TabsList>

        {/* Calendar View */}
        <TabsContent value="calendar" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={prevMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-sm font-semibold">{monthLabel}</span>
            <Button variant="ghost" size="icon" onClick={nextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
                {d}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              if (day === null) return <div key={`empty-${i}`} />;
              const score = getDayScore(day);
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDay === dateStr;
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => setSelectedDay(dateStr)}
                  className={`h-12 w-full rounded-lg transition-all flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? 'ring-2 ring-emerald-500 ring-offset-1'
                      : ''
                  } ${getScoreBg(score)}`}
                >
                  <span className="text-[10px] leading-none font-medium">{day}</span>
                  {score !== null && (
                    <span className="text-[9px] leading-none font-bold">{score}</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-3 text-[10px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" /> 80+</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-amber-300" /> 60+</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-300" /> 40+</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-red-300" /> &lt;40</span>
          </div>

          {/* Hint */}
          <p className="text-center text-[10px] text-muted-foreground">{t('progress.stats.hint')}</p>

          {/* Selected Day Detail */}
          {selectedLog && (
            <div ref={detailScrollRef} className="scroll-mt-20">
            <Card className="transition-all duration-300 animate-in fade-in-0 slide-in-from-top-2">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-medium">{selectedDay}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4 space-y-2">
                {CATEGORIES.map((cat) => {
                  const val = selectedLog[cat.key as keyof LogEntry] as number;
                  return (
                    <div key={cat.key} className="flex items-center justify-between text-xs">
                      <span>
                        {cat.emoji} {t(cat.nameKey)}
                      </span>
                      <span className={`font-semibold ${getScoreColor(val)}`}>{val}</span>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
            </div>
          )}

          {logs.length === 0 && (
            <p className="text-center text-sm text-muted-foreground">{t('progress.noData')}</p>
          )}
        </TabsContent>

        {/* Line Chart View */}
        <TabsContent value="chart" className="mt-4">
          {lineChartData.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3">{t('progress.vitalScore')}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#10b981' }}
                      activeDot={{ r: 5, fill: '#14b8a6' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <p className="text-center text-sm text-muted-foreground">{t('progress.noData')}</p>
          )}

          {/* Bar Chart — Category breakdown */}
          {barChartData.length > 0 && (
            <Card className="mt-4">
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3">{t('progress.categoryBreakdown')}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--card)',
                        borderColor: 'var(--border)',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    {CATEGORIES.map((cat) => (
                      <Bar
                        key={cat.key}
                        dataKey={cat.key}
                        stackId="a"
                        fill={
                          cat.key === 'mental'
                            ? '#8b5cf6'
                            : cat.key === 'sleep'
                            ? '#818cf8'
                            : cat.key === 'nutrition'
                            ? '#10b981'
                            : cat.key === 'exercise'
                            ? '#f97316'
                            : cat.key === 'hydration'
                            ? '#0ea5e9'
                            : '#f43f5e'
                        }
                      />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Radar Chart View */}
        <TabsContent value="radar" className="mt-4">
          {radarData.length > 0 ? (
            <Card>
              <CardContent className="p-4">
                <h3 className="text-sm font-semibold mb-3">{t('progress.categoryBreakdown')}</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 9 }} stroke="var(--muted-foreground)" />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <p className="text-center text-sm text-muted-foreground">{t('progress.noData')}</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
