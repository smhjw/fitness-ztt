import { TrendingDown, TrendingUp, Minus, Scale, Ruler, Percent, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { BodyStats } from '@/types';

interface BodyStatsCardsProps {
  stats: BodyStats;
}

export function BodyStatsCards({ stats }: BodyStatsCardsProps) {
  const cards = [
    {
      title: '当前体重',
      value: stats.currentWeight.toFixed(1),
      unit: 'kg',
      change: stats.weightChange,
      changePercent: stats.weightChangePercent,
      icon: <Scale className="w-5 h-5" />,
      color: 'from-[#FF6A3D] to-[#F4511E]',
      bgColor: 'bg-[#FFF1EA]',
      textColor: 'text-[#FF6A3D]',
    },
    {
      title: 'BMI',
      value: stats.bmi.toFixed(1),
      unit: '',
      subtitle: stats.bmiCategory,
      icon: <Activity className="w-5 h-5" />,
      color: 'from-[#6D28D9] to-[#5B21B6]',
      bgColor: 'bg-purple-50',
      textColor: 'text-[#6D28D9]',
    },
    {
      title: '体脂率',
      value: stats.currentBodyFat?.toFixed(1) || '-',
      unit: '%',
      change: stats.bodyFatChange,
      icon: <Percent className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: '平均体重',
      value: stats.avgWeight.toFixed(1),
      unit: 'kg',
      extra: `最高 ${stats.maxWeight.toFixed(1)} / 最低 ${stats.minWeight.toFixed(1)}`,
      icon: <Ruler className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
  ];

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4" />;
    if (change < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-red-500';
    if (change < 0) return 'text-green-500';
    return 'text-gray-500';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden hover:shadow-card-hover transition-shadow duration-300">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-[#718096]">{card.title}</p>
              <p className="mt-1 text-2xl font-bold text-[#333333]">
                {card.value}
                {card.unit && <span className="text-sm font-normal text-[#718096] ml-1">{card.unit}</span>}
              </p>

              {/* Change indicator */}
              {(card.change !== undefined && card.change !== 0) && (
                <div className={`flex items-center gap-1 mt-1 text-sm ${getChangeColor(card.change)}`}>
                  {getChangeIcon(card.change)}
                  <span>
                    {card.change > 0 ? '+' : ''}{card.change.toFixed(1)} {card.unit}
                    {card.changePercent !== undefined && ` (${card.changePercent > 0 ? '+' : ''}${card.changePercent.toFixed(1)}%)`}
                  </span>
                </div>
              )}

              {/* Subtitle (BMI category) */}
              {card.subtitle && (
                <p className="mt-1 text-sm text-[#718096]">
                  {card.subtitle === 'underweight' && '偏瘦'}
                  {card.subtitle === 'normal' && '正常'}
                  {card.subtitle === 'overweight' && '偏重'}
                  {card.subtitle === 'obese' && '肥胖'}
                </p>
              )}

              {/* Extra info */}
              {card.extra && (
                <p className="mt-1 text-xs text-[#718096]">{card.extra}</p>
              )}
            </div>
          </CardContent>
          <div className={`h-1 bg-gradient-to-r ${card.color}`} />
        </Card>
      ))}
    </div>
  );
}

export default BodyStatsCards;
