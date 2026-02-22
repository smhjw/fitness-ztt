import { Sparkles } from 'lucide-react';
import AIChat from '@/components/ai/AIChat';

export function AISection() {
  return (
    <section className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E6F7F6] text-[#38B2AC] text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            AI 驱动
          </div>
          <h1 className="text-3xl font-bold text-[#333333] mb-2">AI 健身助手</h1>
          <p className="text-[#718096]">训练、饮食、恢复，一问即得</p>
        </div>

        {/* Chat */}
        <AIChat />

        {/* Tips */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl shadow-card">
            <h3 className="font-medium text-[#333333] mb-2">健身训练</h3>
            <p className="text-sm text-[#718096]">
              询问关于训练计划、动作技巧、训练频率等问题
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-card">
            <h3 className="font-medium text-[#333333] mb-2">营养饮食</h3>
            <p className="text-sm text-[#718096]">
              获取关于饮食搭配、营养补充、减脂增肌饮食建议
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow-card">
            <h3 className="font-medium text-[#333333] mb-2">恢复休息</h3>
            <p className="text-sm text-[#718096]">
              了解如何更好地恢复、避免运动损伤、改善睡眠质量
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AISection;
