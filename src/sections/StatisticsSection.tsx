import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StatisticsChart from '@/components/charts/StatisticsChart';
import StatisticsCards from '@/components/charts/StatisticsCards';
import { useRecords } from '@/hooks/useRecords';
import type { ExerciseRecord } from '@/types';

type Granularity = 'day' | 'week' | 'month';

export function StatisticsSection() {
  const { records, getStatistics, getChartData } = useRecords();
  const [granularity, setGranularity] = useState<Granularity>('week');
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    averageDuration: 0,
    streakDays: 0,
    favoriteType: null as any,
    thisWeekWorkouts: 0,
    thisWeekDuration: 0,
  });
  const [chartData, setChartData] = useState<{ date: string; duration: number; count: number }[]>([]);

  useEffect(() => {
    setStats(getStatistics());
    setChartData(getChartData(granularity));
  }, [records, granularity, getStatistics, getChartData]);

  // Calculate exercise type distribution
  const typeDistribution = records.reduce((acc, record) => {
    acc[record.type] = (acc[record.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeLabels: Record<string, string> = {
    running: '跑步',
    walking: '步行',
    cycling: '骑行',
    swimming: '游泳',
    weightlifting: '力量训练',
    yoga: '瑜伽',
    pilates: '普拉提',
    hiit: 'HIIT',
    cardio: '有氧',
    sports: '球类运动',
    other: '其他',
  };

  const typeColors: Record<string, string> = {
    running: 'bg-[#38B2AC]',
    walking: 'bg-green-500',
    cycling: 'bg-blue-500',
    swimming: 'bg-cyan-500',
    weightlifting: 'bg-purple-500',
    yoga: 'bg-yellow-500',
    pilates: 'bg-pink-500',
    hiit: 'bg-red-500',
    cardio: 'bg-orange-500',
    sports: 'bg-indigo-500',
    other: 'bg-gray-500',
  };

  const sortedTypes = Object.entries(typeDistribution)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const totalTypeCount = Object.values(typeDistribution).reduce((a, b) => a + b, 0);

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#333333]">运动统计</h1>
          <p className="text-[#718096] mt-1">查看你的运动数据分析和趋势</p>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8">
          <StatisticsCards stats={stats} />
        </div>

        {/* Main Chart */}
        <div className="mb-8">
          <StatisticsChart
            data={chartData}
            granularity={granularity}
            onGranularityChange={setGranularity}
          />
        </div>

        {/* Additional Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Exercise Type Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="w-5 h-5 text-[#38B2AC]" />
                运动类型分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sortedTypes.length > 0 ? (
                <div className="space-y-4">
                  {sortedTypes.map(([type, count]) => {
                    const percentage = Math.round((count / totalTypeCount) * 100);
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-[#333333]">{typeLabels[type]}</span>
                          <span className="text-sm text-[#718096]">{count} 次 ({percentage}%)</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${typeColors[type]} rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-[#718096]">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>暂无数据</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="w-5 h-5 text-[#38B2AC]" />
                月度概览
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(() => {
                const monthlyData: Record<string, { count: number; duration: number }> = {};
                records.forEach(r => {
                  const month = r.date.substring(0, 7);
                  if (!monthlyData[month]) {
                    monthlyData[month] = { count: 0, duration: 0 };
                  }
                  monthlyData[month].count++;
                  monthlyData[month].duration += r.duration;
                });

                const sortedMonths = Object.entries(monthlyData)
                  .sort((a, b) => b[0].localeCompare(a[0]))
                  .slice(0, 6);

                if (sortedMonths.length === 0) {
                  return (
                    <div className="text-center py-8 text-[#718096]">
                      <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>暂无数据</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {sortedMonths.map(([month, data]) => (
                      <div
                        key={month}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium text-[#333333]">
                          {month.replace('-', '年')}月
                        </span>
                        <div className="text-right">
                          <p className="text-sm text-[#333333]">{data.count} 次</p>
                          <p className="text-xs text-[#718096]">{data.duration} 分钟</p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>

        {/* Weekly Activity Heatmap */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-[#38B2AC]" />
              最近7天活动
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const last7Days = Array.from({ length: 7 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - i));
                return date.toISOString().split('T')[0];
              });

              const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

              return (
                <div className="flex justify-between items-end h-32 gap-2">
                  {last7Days.map((date, index) => {
                    const dayRecords = records.filter(r => r.date === date);
                    const totalDuration = dayRecords.reduce((sum, r) => sum + r.duration, 0);
                    const maxDuration = 120; // Max expected duration for scaling
                    const height = Math.min((totalDuration / maxDuration) * 100, 100);
                    const hasActivity = dayRecords.length > 0;

                    return (
                      <div key={date} className="flex-1 flex flex-col items-center">
                        <div className="relative w-full flex-1 flex items-end justify-center">
                          <div
                            className={`w-full max-w-[40px] rounded-t-lg transition-all duration-500 ${
                              hasActivity
                                ? 'bg-gradient-to-t from-[#38B2AC] to-[#2C9B95]'
                                : 'bg-gray-100'
                            }`}
                            style={{ height: `${Math.max(height, 5)}%` }}
                          />
                          {hasActivity && (
                            <div className="absolute -top-6 text-xs font-medium text-[#38B2AC]">
                              {totalDuration}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-xs text-[#718096] text-center">
                          <div>{dayNames[new Date(date).getDay()]}</div>
                          <div>{date.slice(5)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export default StatisticsSection;
