import { useState, useCallback } from 'react';
import type { ChatMessage } from '@/types';

// AI responses for common fitness and diet questions
const aiResponses: Record<string, string[]> = {
  greeting: [
    '你好！我是你的健身AI助手，有什么可以帮助你的吗？',
    '欢迎回来！我可以帮你制定训练计划、饮食建议或恢复方案。',
  ],
  workout: [
    '对于初学者，我建议从每周3次、每次30分钟的有氧运动开始，比如快走或慢跑。随着体能提升，可以逐渐增加强度和时间。',
    '力量训练时，注意保持正确的姿势比重量更重要。建议每组8-12次，做3-4组，组间休息60-90秒。',
    'HIIT训练非常高效，可以在短时间内燃烧大量卡路里。建议每周进行2-3次，每次20-30分钟。',
  ],
  diet: [
    '健身期间，蛋白质摄入很重要。建议每公斤体重摄入1.6-2.2克蛋白质，可以通过鸡胸肉、鱼、蛋、豆类等食物获取。',
    '减脂期间，建议控制碳水化合物的摄入，选择低GI的食物如燕麦、糙米、红薯等，避免精制糖和加工食品。',
    '训练前1-2小时可以吃一些易消化的碳水化合物，如香蕉或全麦面包；训练后30分钟内补充蛋白质和碳水，有助于肌肉恢复。',
  ],
  weightLoss: [
    '减重的关键是热量赤字，即消耗的热量大于摄入的热量。建议每天减少300-500卡路里的摄入，配合规律运动。',
    '不要过度节食，这会导致基础代谢率下降。建议采用渐进式减重，每周减重0.5-1公斤是健康的速度。',
    '多喝水有助于减重，建议每天至少喝2-3升水。饭前喝一杯水可以增加饱腹感，减少食量。',
  ],
  muscleGain: [
    '增肌需要热量盈余，即摄入的热量大于消耗的热量。建议每天增加300-500卡路里的摄入，以蛋白质为主。',
    '复合动作如深蹲、硬拉、卧推、引体向上等，可以同时锻炼多个肌群，是增肌的最佳选择。',
    '充足的睡眠对肌肉恢复和生长至关重要。建议每晚睡7-9小时，并保持规律的作息时间。',
  ],
  recovery: [
    '训练后的拉伸和放松非常重要，可以减少肌肉酸痛，提高柔韧性。建议每次训练后进行10-15分钟的拉伸。',
    '休息日也是训练的一部分。建议每周安排1-2天的完全休息，让肌肉有时间恢复和生长。',
    '按摩和泡沫轴放松可以促进血液循环，加速肌肉恢复。建议每周进行1-2次。',
  ],
  supplement: [
    '蛋白粉是方便的蛋白质补充来源，但不是必需品。如果你能从食物中获取足够的蛋白质，就不需要额外补充。',
    '肌酸是被研究最多的运动补剂之一，可以提高力量和爆发力。建议每天摄入3-5克。',
    'BCAA（支链氨基酸）可以帮助减少训练中的肌肉分解，但如果你已经摄入足够的蛋白质，效果可能不明显。',
  ],
  default: [
    '这是一个很好的问题！建议咨询专业的健身教练或营养师，以获得更个性化的建议。',
    '每个人的身体状况不同，建议根据自己的实际情况调整训练和饮食计划。',
    '坚持是最重要的！无论选择什么样的训练和饮食方式，长期坚持才能看到效果。',
  ],
};

function getAIResponse(message: string): string {
  const lowerMessage = message.toLowerCase();
  
  // Check for greetings
  if (/(你好|您好|hello|hi|hey)/i.test(lowerMessage)) {
    return aiResponses.greeting[0];
  }
  
  // Check for workout-related questions
  if (/训练|锻炼|运动|健身|workout|exercise|training/i.test(lowerMessage)) {
    return aiResponses.workout[Math.floor(Math.random() * aiResponses.workout.length)];
  }
  
  // Check for diet-related questions
  if (/饮食|食物|营养|吃|diet|nutrition|food/i.test(lowerMessage)) {
    return aiResponses.diet[Math.floor(Math.random() * aiResponses.diet.length)];
  }
  
  // Check for weight loss questions
  if (/减肥|减重|瘦身|减脂|weight loss|lose weight/i.test(lowerMessage)) {
    return aiResponses.weightLoss[Math.floor(Math.random() * aiResponses.weightLoss.length)];
  }
  
  // Check for muscle gain questions
  if (/增肌|增重|肌肉|muscle gain|build muscle|gain weight/i.test(lowerMessage)) {
    return aiResponses.muscleGain[Math.floor(Math.random() * aiResponses.muscleGain.length)];
  }
  
  // Check for recovery questions
  if (/恢复|休息|放松|拉伸|recovery|rest|relax|stretch/i.test(lowerMessage)) {
    return aiResponses.recovery[Math.floor(Math.random() * aiResponses.recovery.length)];
  }
  
  // Check for supplement questions
  if (/补剂|蛋白粉|肌酸|supplement|protein|creatine/i.test(lowerMessage)) {
    return aiResponses.supplement[Math.floor(Math.random() * aiResponses.supplement.length)];
  }
  
  // Default response
  return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
}

interface UseAIChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

export function useAIChat(): UseAIChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: aiResponses.greeting[0],
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Generate AI response
    const aiResponse = getAIResponse(content);
    
    const assistantMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: aiResponses.greeting[0],
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default useAIChat;
