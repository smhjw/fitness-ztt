import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ClipboardList,
  Dumbbell,
  Flame,
  HeartPulse,
  Salad,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import useAuth from '@/hooks/useAuth';

export function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 6) return '凌晨好';
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  }, []);

  const stats = [
    { label: '连续打卡', value: '7 天', icon: Flame },
    { label: '本周训练', value: '4 次', icon: Dumbbell },
    { label: '累计热量', value: '980 千卡', icon: TrendingUp },
  ];

  const categories = [
    { label: '燃脂', href: '/records?tag=燃脂' },
    { label: '塑形', href: '/records?tag=塑形' },
    { label: '拉伸', href: '/records?tag=拉伸' },
    { label: '瑜伽', href: '/records?tag=瑜伽' },
    { label: '跑步', href: '/records?tag=跑步' },
    { label: '新手', href: '/records?tag=新手' },
  ];

  const gridActions = [
    { label: '训练记录', subtitle: '快速开记', icon: Dumbbell, href: '/records', tone: 'bg-[#FFF1EA] text-[#FF6A3D]' },
    { label: '训练计划', subtitle: '课程安排', icon: ClipboardList, href: '/plans', tone: 'bg-[#FFF6E9] text-[#FF8A3D]' },
    { label: '社区打卡', subtitle: '热门动态', icon: Users, href: '/community', tone: 'bg-[#EAF7FF] text-[#2F80ED]' },
    { label: '饮食灵感', subtitle: '健康搭配', icon: Salad, href: '/diet', tone: 'bg-[#F1F5FF] text-[#5B6DFF]' },
    { label: '知识库', subtitle: '科学指南', icon: BookOpen, href: '/knowledge', tone: 'bg-[#EEFDF4] text-[#10B981]' },
    { label: '训练日历', subtitle: '目标追踪', icon: Calendar, href: '/calendar', tone: 'bg-[#FFF0F5] text-[#E64980]' },
    { label: '数据统计', subtitle: '趋势洞察', icon: TrendingUp, href: '/statistics', tone: 'bg-[#F3F0FF] text-[#7950F2]' },
    { label: '身体数据', subtitle: '体脂围度', icon: HeartPulse, href: '/body', tone: 'bg-[#FFEDED] text-[#E03131]' },
    { label: '装备商城', subtitle: '好物推荐', icon: ShoppingBag, href: '/shop', tone: 'bg-[#FFF7E6] text-[#FF922B]' },
  ];

  const trainingPlans = [
    {
      title: '燃脂 HIIT 20 分钟',
      duration: '20 分钟 · 200 千卡',
      tag: '燃脂',
      level: '初级',
      href: '/records',
    },
    {
      title: '上肢塑形 35 分钟',
      duration: '35 分钟 · 力量提升',
      tag: '塑形',
      level: '进阶',
      href: '/records',
    },
    {
      title: '拉伸恢复 15 分钟',
      duration: '15 分钟 · 放松肌群',
      tag: '恢复',
      level: '入门',
      href: '/records',
    },
  ];

  const communityPosts = [
    {
      title: '30 天核心挑战打卡第 12 天',
      user: '小鹿 · 3 小时前',
      tag: '打卡',
      href: '/community',
    },
    {
      title: '晨跑 5 公里，心情超好',
      user: '阿杰 · 1 小时前',
      tag: '跑步',
      href: '/community',
    },
    {
      title: '居家无器械燃脂组合分享',
      user: 'Kaya · 5 小时前',
      tag: '分享',
      href: '/community',
    },
  ];

  const dietCards = [
    {
      title: '高蛋白轻食',
      description: '适合训练后补给',
      kcal: '420 千卡',
      href: '/diet',
    },
    {
      title: '低脂能量碗',
      description: '均衡营养更轻盈',
      kcal: '360 千卡',
      href: '/diet',
    },
  ];

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, href: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate(href);
    }
  };

  return (
    <section className="min-h-screen bg-gradient-to-b from-[#FFF4ED] via-[#FFF9F6] to-[#F5F7FA]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-[#718096]">{greeting}</p>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] mt-1">
                {user?.name ? `${user.name}，继续保持节奏` : '今天也要坚持训练'}
              </h1>
            </div>
            {isAuthenticated ? (
              <Button
                onClick={() => navigate('/records')}
                className="bg-[#FF6A3D] hover:bg-[#F4511E] text-white rounded-full px-4 h-10"
              >
                开始训练
              </Button>
            ) : (
              <Button
                onClick={() => navigate('/register')}
                className="bg-[#FF6A3D] hover:bg-[#F4511E] text-white rounded-full px-4 h-10"
              >
                快速注册
              </Button>
            )}
          </div>

          <Card
            role="button"
            tabIndex={0}
            onClick={() => navigate('/search')}
            onKeyDown={(event) => handleCardKeyDown(event, '/search')}
            className="border-none shadow-card bg-white/95 cursor-pointer"
          >
            <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FFF1EA] flex items-center justify-center text-[#FF6A3D]">
                  <Search className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-[#718096]">搜索课程 / 训练 / 饮食</p>
                  <p className="text-base font-semibold text-[#333333] mt-1">今天想练什么？</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate('/search');
                }}
                className="sm:ml-auto bg-[#FF6A3D] hover:bg-[#F4511E] text-white rounded-full"
              >
                去搜索
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-3 gap-3">
            {stats.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.label} className="border-none bg-white/95">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-[#FF6A3D]">
                      <Icon className="w-4 h-4" />
                      <p className="text-xs text-[#718096]">{item.label}</p>
                    </div>
                    <p className="text-lg font-semibold text-[#333333] mt-2">{item.value}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-[#333333]">热门分类</h2>
              <Button
                variant="ghost"
                onClick={() => navigate('/records')}
                className="text-sm text-[#718096]"
              >
                查看更多
              </Button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map((category) => (
                <button
                  key={category.label}
                  type="button"
                  onClick={() => navigate(category.href)}
                  className="whitespace-nowrap rounded-full border border-[#FFE3D6] bg-white px-4 py-2 text-xs font-medium text-[#FF6A3D] transition-colors hover:bg-[#FFF1EA]"
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold text-[#333333]">功能入口</h2>
              <Button
                variant="ghost"
                onClick={() => navigate('/features')}
                className="text-sm text-[#718096]"
              >
                功能说明
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {gridActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Card
                    key={action.label}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(action.href)}
                    onKeyDown={(event) => handleCardKeyDown(event, action.href)}
                    className="cursor-pointer border border-gray-100 hover:shadow-card-hover transition-shadow"
                  >
                    <CardContent className="p-3 flex flex-col items-center text-center gap-2">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${action.tone}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#333333]">{action.label}</p>
                        <p className="text-[11px] text-[#718096] mt-1">{action.subtitle}</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card className="border-none bg-gradient-to-br from-[#FF6A3D] to-[#F4511E] text-white">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <Badge className="bg-white/20 text-white border-white/30">今日计划</Badge>
                <span className="text-xs text-white/80">已完成 2 / 4</span>
              </div>
              <h2 className="text-2xl font-semibold mt-4">燃脂 HIIT 20 分钟</h2>
              <p className="text-sm text-white/80 mt-2">暴汗燃脂 · 零器械</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  220 千卡
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  难度：中等
                </span>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <div className="text-xs text-white/70">建议晨练 · 适合燃脂</div>
                <Button
                  size="sm"
                  onClick={() => navigate('/records')}
                  className="bg-white text-[#FF6A3D] hover:bg-[#FFF1EA] rounded-full"
                >
                  立即开始
                </Button>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#333333]">推荐计划</h2>
              <Button
                variant="ghost"
                onClick={() => navigate('/plans')}
                className="text-sm text-[#718096]"
              >
                更多计划
              </Button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
              {trainingPlans.map((plan) => (
                <Card
                  key={plan.title}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(plan.href)}
                  onKeyDown={(event) => handleCardKeyDown(event, plan.href)}
                  className="min-w-[240px] snap-start bg-white/95 border border-gray-100 shadow-card"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-[#FFF1EA] text-[#FF6A3D] border-[#FFE3D6]">{plan.tag}</Badge>
                      <span className="text-xs text-[#718096]">{plan.level}</span>
                    </div>
                    <h3 className="text-lg font-semibold mt-4 text-[#333333]">{plan.title}</h3>
                    <p className="text-sm text-[#718096] mt-2">{plan.duration}</p>
                    <div className="mt-6 flex items-center justify-between text-sm text-[#FF6A3D]">
                      <span>查看详情</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#333333]">AI 训练助手</h2>
              <Button
                variant="ghost"
                onClick={() => navigate('/ai')}
                className="text-sm text-[#718096]"
              >
                立即咨询
              </Button>
            </div>
            <Card
              role="button"
              tabIndex={0}
              onClick={() => navigate('/ai')}
              onKeyDown={(event) => handleCardKeyDown(event, '/ai')}
              className="border-none bg-gradient-to-br from-[#FFE7D9] via-white to-white shadow-card"
            >
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6A3D] text-white flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#333333]">今日训练建议</h3>
                  <p className="text-sm text-[#718096] mt-1">根据你的记录生成个性化训练与恢复方案。</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#FF6A3D]" />
              </CardContent>
            </Card>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#333333]">社区精选</h2>
              <Button
                variant="ghost"
                onClick={() => navigate('/community')}
                className="text-sm text-[#718096]"
              >
                去社区
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {communityPosts.map((post) => (
                <Card
                  key={post.title}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(post.href)}
                  onKeyDown={(event) => handleCardKeyDown(event, post.href)}
                  className="cursor-pointer border border-gray-100 hover:shadow-card-hover transition-shadow"
                >
                  <CardContent className="p-5">
                    <Badge className="bg-[#FFF7E6] text-[#FF922B] border-[#FFE3D6]">{post.tag}</Badge>
                    <h3 className="text-lg font-semibold text-[#333333] mt-3">{post.title}</h3>
                    <p className="text-xs text-[#718096] mt-2">{post.user}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-[#333333]">饮食灵感</h2>
              <Button
                variant="ghost"
                onClick={() => navigate('/diet')}
                className="text-sm text-[#718096]"
              >
                查看更多
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {dietCards.map((item) => (
                <Card
                  key={item.title}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(item.href)}
                  onKeyDown={(event) => handleCardKeyDown(event, item.href)}
                  className="cursor-pointer border border-gray-100 hover:shadow-card-hover transition-shadow"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-[#333333]">{item.title}</h3>
                        <p className="text-sm text-[#718096] mt-1">{item.description}</p>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-[#FFF1EA] flex items-center justify-center">
                        <Salad className="w-5 h-5 text-[#FF6A3D]" />
                      </div>
                    </div>
                    <p className="text-sm text-[#718096] mt-3">{item.kcal}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
