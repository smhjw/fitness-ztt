import { 
  Flame, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Trophy,
  Activity
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ExerciseType } from '@/types';

interface StatisticsCardsProps {
  stats: {
    totalWorkouts: number;
    totalDuration: number;
    averageDuration: number;
    streakDays: number;
    favoriteType: ExerciseType | null;
    thisWeekWorkouts: number;
    thisWeekDuration: number;
  };
}

const exerciseTypeLabels: Record<ExerciseType, string> = {
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

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  const cards = [
    {
      title: '总运动次数',
      value: stats.totalWorkouts,
      unit: '次',
      icon: <Activity className="w-5 h-5" />,
      color: 'from-[#38B2AC] to-[#2C9B95]',
      bgColor: 'bg-[#E6F7F6]',
      textColor: 'text-[#38B2AC]',
    },
    {
      title: '总运动时长',
      value: stats.totalDuration,
      unit: '分钟',
      icon: <Clock className="w-5 h-5" />,
      color: 'from-[#6D28D9] to-[#5B21B6]',
      bgColor: 'bg-purple-50',
      textColor: 'text-[#6D28D9]',
    },
    {
      title: '平均时长',
      value: stats.averageDuration,
      unit: '分钟/次',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: '连续打卡',
      value: stats.streakDays,
      unit: '天',
      icon: <Flame className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: '本周运动',
      value: `${stats.thisWeekWorkouts}次 / ${stats.thisWeekDuration}分钟`,
      unit: '',
      icon: <Calendar className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      isText: true,
    },
    {
      title: '最爱运动',
      value: stats.favoriteType ? exerciseTypeLabels[stats.favoriteType] : '暂无',
      unit: '',
      icon: <Trophy className="w-5 h-5" />,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600',
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <Card 
          key={index} 
          className="overflow-hidden hover:shadow-card-hover transition-shadow duration-300"
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 rounded-xl ${card.bgColor} ${card.textColor} flex items-center justify-center`}>
                {card.icon}
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-[#718096]">{card.title}</p>
              <p className="mt-1 text-2xl font-bold text-[#333333]">
                {card.isText ? card.value : (
                  <>
                    {card.value}
                    <span className="text-sm font-normal text-[#718096] ml-1">
                      {card.unit}
                    </span>
                  </>
                )}
              </p>
            </div>
          </CardContent>
          <div className={`h-1 bg-gradient-to-r ${card.color}`} />
        </Card>
      ))}
    </div>
  );
}

export default StatisticsCards;
