import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BodyTrendChartProps {
  title: string;
  data: { date: string; value: number }[];
  unit: string;
  color?: string;
  height?: number;
}

export function BodyTrendChart({ title, data, unit, color = '#38B2AC', height = 300 }: BodyTrendChartProps) {
  const chartData = useMemo(
    () =>
      data.map((item) => {
        const date = new Date(item.date);
        return {
          ...item,
          label: `${date.getMonth() + 1}/${date.getDate()}`,
        };
      }),
    [data]
  );

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-[#718096]">
            <p>暂无记录</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
              <defs>
                <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#F3F4F6" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#718096', fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} tickLine={false} />
              <YAxis tick={{ fill: '#718096', fontSize: 12 }} axisLine={false} tickLine={false} width={40} />
              <Tooltip
                formatter={(value) => [`${value} ${unit}`, title]}
                contentStyle={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  borderColor: '#E5E7EB',
                  borderRadius: '10px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="value" stroke={color} strokeWidth={3} fill={`url(#grad-${title})`} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default BodyTrendChart;
