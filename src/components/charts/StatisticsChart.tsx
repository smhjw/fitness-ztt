import { useMemo } from 'react';
import { TrendingUp, Calendar, Activity } from 'lucide-react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Granularity = 'day' | 'week' | 'month';

interface StatisticsChartProps {
  data: { date: string; duration: number; count: number }[];
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
}

export function StatisticsChart({ data, granularity, onGranularityChange }: StatisticsChartProps) {
  const chartData = useMemo(
    () =>
      data.map((item) => {
        if (granularity === 'month') {
          const [year, month] = item.date.split('-');
          return { ...item, label: `${year}/${month}` };
        }

        const date = new Date(item.date);
        return { ...item, label: `${date.getMonth() + 1}/${date.getDate()}` };
      }),
    [data, granularity]
  );

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-[#38B2AC]" />
            趋势分析
          </CardTitle>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={granularity === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onGranularityChange('day')}
              className={granularity === 'day' ? 'bg-[#38B2AC] hover:bg-[#2C9B95]' : ''}
            >
              <Calendar className="w-4 h-4 mr-1" />
              天
            </Button>
            <Button
              variant={granularity === 'week' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onGranularityChange('week')}
              className={granularity === 'week' ? 'bg-[#38B2AC] hover:bg-[#2C9B95]' : ''}
            >
              <Activity className="w-4 h-4 mr-1" />
              周
            </Button>
            <Button
              variant={granularity === 'month' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onGranularityChange('month')}
              className={granularity === 'month' ? 'bg-[#38B2AC] hover:bg-[#2C9B95]' : ''}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              月
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="w-full h-[280px] sm:h-[320px] lg:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#718096', fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
                <YAxis yAxisId="duration" tick={{ fill: '#718096', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="count" orientation="right" tick={{ fill: '#718096', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderColor: '#E5E7EB',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar yAxisId="count" dataKey="count" name="总次数" fill="#6D28D9" radius={[4, 4, 0, 0]} maxBarSize={28} />
                <Line
                  yAxisId="duration"
                  type="monotone"
                  dataKey="duration"
                  name="总时长"
                  stroke="#38B2AC"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[280px] sm:h-[320px] lg:h-[360px] flex items-center justify-center text-[#718096]">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>暂无记录</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StatisticsChart;
