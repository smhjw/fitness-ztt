import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { TrendingUp, Calendar, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Granularity = 'day' | 'week' | 'month';

interface StatisticsChartProps {
  data: { date: string; duration: number; count: number }[];
  granularity: Granularity;
  onGranularityChange: (g: Granularity) => void;
}

export function StatisticsChart({ data, granularity, onGranularityChange }: StatisticsChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current || data.length === 0) return;

    const dates = data.map(d => {
      if (granularity === 'month') {
        const [year, month] = d.date.split('-');
        return `${year}年${month}月`;
      }
      const date = new Date(d.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });

    const durations = data.map(d => d.duration);
    const counts = data.map(d => d.count);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        textStyle: {
          color: '#333333',
        },
        formatter: (params: any) => {
          const date = params[0].axisValue;
          const duration = params.find((p: any) => p.seriesName === '运动时长')?.value || 0;
          const count = params.find((p: any) => p.seriesName === '运动次数')?.value || 0;
          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${date}</div>
              <div style="color: #38B2AC;">运动时长: ${duration} 分钟</div>
              <div style="color: #6D28D9;">运动次数: ${count} 次</div>
            </div>
          `;
        },
      },
      legend: {
        data: ['运动时长', '运动次数'],
        bottom: 0,
        textStyle: {
          color: '#718096',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: {
          lineStyle: {
            color: '#E5E7EB',
          },
        },
        axisLabel: {
          color: '#718096',
        },
      },
      yAxis: [
        {
          type: 'value',
          name: '时长(分钟)',
          position: 'left',
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: '#718096',
          },
          splitLine: {
            lineStyle: {
              color: '#F3F4F6',
            },
          },
        },
        {
          type: 'value',
          name: '次数',
          position: 'right',
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: '#718096',
          },
          splitLine: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: '运动时长',
          type: 'line',
          data: durations,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: '#38B2AC',
            width: 3,
            shadowColor: 'rgba(56, 178, 172, 0.3)',
            shadowBlur: 10,
            shadowOffsetY: 5,
          },
          itemStyle: {
            color: '#38B2AC',
            borderWidth: 2,
            borderColor: '#fff',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(56, 178, 172, 0.4)' },
              { offset: 1, color: 'rgba(56, 178, 172, 0.05)' },
            ]),
          },
        },
        {
          name: '运动次数',
          type: 'bar',
          yAxisIndex: 1,
          data: counts,
          barWidth: '30%',
          itemStyle: {
            color: '#6D28D9',
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    };

    chartInstance.current.setOption(option);
  }, [data, granularity]);

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="w-5 h-5 text-[#38B2AC]" />
            运动趋势
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant={granularity === 'day' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onGranularityChange('day')}
              className={granularity === 'day' ? 'bg-[#38B2AC] hover:bg-[#2C9B95]' : ''}
            >
              <Calendar className="w-4 h-4 mr-1" />
              日
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
        {data.length > 0 ? (
          <div ref={chartRef} className="w-full h-[350px]" />
        ) : (
          <div className="h-[350px] flex items-center justify-center text-[#718096]">
            <div className="text-center">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>暂无数据，开始记录运动吧！</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StatisticsChart;
