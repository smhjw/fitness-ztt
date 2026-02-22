import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, TrendingUp, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import useAuth from '@/hooks/useAuth';

export function HeroSection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.01;
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(56, 178, 172, ${0.1 + i * 0.05})`;
        ctx.lineWidth = 2;

        for (let x = 0; x < width; x += 10) {
          const y =
            height / 2 +
            Math.sin((x / width) * Math.PI * 2 + time + i * 0.5) * 50 +
            Math.sin((x / width) * Math.PI * 4 + time * 1.5) * 25;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const features = [
    { icon: <Activity className="w-5 h-5" />, title: '运动记录', description: '记录每次训练', href: '/records' },
    { icon: <TrendingUp className="w-5 h-5" />, title: '数据统计', description: '掌握训练趋势', href: '/statistics' },
    { icon: <Calendar className="w-5 h-5" />, title: '日历', description: '一眼查看安排', href: '/calendar' },
    { icon: <BookOpen className="w-5 h-5" />, title: '知识库', description: '专业健身与健康知识', href: '/knowledge' },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-12 md:pt-20 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F7FA] pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6F7F6] text-[#38B2AC] text-sm font-medium">
              <Activity className="w-4 h-4" />
              记录你的健身旅程
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#333333] leading-tight">
              记录你的健身旅程
            </h1>

            <p className="text-lg text-[#718096] max-w-lg">记录训练、追踪进度、保持动力</p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              {isAuthenticated ? (
                <Button
                  size="lg"
                  onClick={() => navigate('/records')}
                  className="bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-full px-8 h-14 text-base gap-2 w-full sm:w-auto"
                >
                  新增记录
                  <ArrowRight className="w-5 h-5" />
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-full px-8 h-14 text-base gap-2 w-full sm:w-auto"
                >
                  立即注册
                  <ArrowRight className="w-5 h-5" />
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/knowledge')}
                className="rounded-full px-8 h-14 text-base border-[#38B2AC] text-[#38B2AC] hover:bg-[#E6F7F6] w-full sm:w-auto"
              >
                知识库
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8">
              {features.map((feature, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => navigate(feature.href)}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/80 backdrop-blur-sm shadow-card hover:shadow-card-hover transition-shadow text-left"
                  aria-label={`前往${feature.title}`}
                >
                  <div className="w-10 h-10 rounded-lg bg-[#E6F7F6] text-[#38B2AC] flex items-center justify-center flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="font-medium text-[#333333]">{feature.title}</h3>
                    <p className="text-sm text-[#718096]">{feature.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative mx-auto w-[300px] h-[600px] animate-float">
              <div className="absolute inset-0 bg-[#333333] rounded-[3rem] shadow-2xl p-3">
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  <div className="h-full bg-[#F5F7FA]">
                    <div className="bg-[#38B2AC] p-6 pb-12">
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-8 h-8 rounded-full bg-white/20" />
                        <div className="w-8 h-8 rounded-full bg-white/20" />
                      </div>
                      <p className="text-white/80 text-sm">今日</p>
                      <p className="text-white text-3xl font-bold">45 分钟</p>
                    </div>

                    <div className="px-4 -mt-6">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-4 rounded-xl shadow-card">
                          <p className="text-[#718096] text-xs">本周训练</p>
                          <p className="text-[#333333] text-xl font-bold">5</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow-card">
                          <p className="text-[#718096] text-xs">连续打卡</p>
                          <p className="text-[#333333] text-xl font-bold">12</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 mt-4">
                      <p className="text-[#333333] font-medium mb-3">运动记录</p>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-card">
                            <div className="w-10 h-10 rounded-lg bg-[#E6F7F6] flex items-center justify-center">
                              <Activity className="w-5 h-5 text-[#38B2AC]" />
                            </div>
                            <div className="flex-1">
                              <p className="text-[#333333] text-sm font-medium">跑步</p>
                              <p className="text-[#718096] text-xs">30 分钟</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-[#38B2AC]/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#6D28D9]/20 rounded-full blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
