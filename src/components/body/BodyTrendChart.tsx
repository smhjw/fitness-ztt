import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import * as echarts from 'echarts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BodyTrendChartProps {
  title: string;
  data: { date: string; value: number }[];
  unit: string;
  color?: string;
  height?: number;
}

export function BodyTrendChart({ title, data, unit, color = '#38B2AC', height = 300 }: BodyTrendChartProps) {
  const { t } = useTranslation();
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

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
      const date = new Date(d.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    });
    const values = data.map(d => d.value);

    const option: echarts.EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        textStyle: { color: '#333333' },
        formatter: (params: any) => {
          return `
            <div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${params[0].axisValue}</div>
              <div style="color: ${color};">${title}: ${params[0].value} ${unit}</div>
            </div>
          `;
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: '#E5E7EB' } },
        axisLabel: { color: '#718096' },
      },
      yAxis: {
        type: 'value',
        name: unit,
        axisLine: { show: false },
        axisLabel: { color: '#718096' },
        splitLine: { lineStyle: { color: '#F3F4F6' } },
      },
      series: [
        {
          name: title,
          type: 'line',
          data: values,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            color: color,
            width: 3,
            shadowColor: color + '40',
            shadowBlur: 10,
            shadowOffsetY: 5,
          },
          itemStyle: {
            color: color,
            borderWidth: 2,
            borderColor: '#fff',
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: color + '40' },
              { offset: 1, color: color + '05' },
            ]),
          },
        },
      ],
    };

    chartInstance.current.setOption(option);
  }, [data, title, unit, color]);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center text-[#718096]">
            <p>{t('body.noRecords')}</p>
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
        <div ref={chartRef} style={{ height: `${height}px` }} />
      </CardContent>
    </Card>
  );
}

export default BodyTrendChart;
