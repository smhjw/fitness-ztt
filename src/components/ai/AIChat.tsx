import { useEffect, useRef, useState } from 'react';
import { Send, Sparkles, Bot, User, Zap } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAIChat } from '@/hooks/useAIChat';

const suggestions = [
  {
    text: '帮我设计一套 30 分钟燃脂训练计划',
    icon: Zap,
  },
  {
    text: '训练后应该吃什么？',
    icon: Sparkles,
  },
  {
    text: '如何改善深蹲姿势？',
    icon: Bot,
  },
  {
    text: '拉伸恢复有哪些推荐？',
    icon: User,
  },
];

export function AIChat() {
  const { messages, sendMessage, isLoading } = useAIChat();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    await sendMessage(input);
    setInput('');
  };

  const handleSuggestionClick = async (text: string) => {
    if (isLoading) return;
    await sendMessage(text);
  };

  return (
    <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
      <Card className="h-[600px] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6A3D] to-[#F4511E] flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-[#333333]">AI 训练助手</h2>
              <p className="text-sm text-[#718096]">随时为你解答健身相关问题</p>
            </div>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-[#FF6A3D] mx-auto mb-4" />
                <p className="text-[#718096]">开始对话，获取个性化建议</p>
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[#FF6A3D] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-[#FF6A3D] text-white rounded-br-md'
                      : 'bg-gray-100 text-[#333333] rounded-bl-md'
                  }`}
                >
                  {message.content}
                </div>
                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-100">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入你的问题..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-[#FF6A3D] hover:bg-[#F4511E] text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>

      <div className="space-y-4">
        <Card className="p-6">
          <h3 className="font-semibold text-[#333333] mb-4">推荐问题</h3>
          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.text}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="w-full p-3 text-left rounded-xl bg-gray-50 hover:bg-[#FFF1EA] transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <suggestion.icon className="w-4 h-4 text-[#FF6A3D]" />
                  <span className="text-sm text-[#333333] group-hover:text-[#FF6A3D] transition-colors">
                    {suggestion.text}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-[#FF6A3D] to-[#F4511E] text-white">
          <h3 className="font-semibold mb-2">专业建议提醒</h3>
          <p className="text-sm text-white/80">
            AI 助手提供的建议仅供参考，重要训练请咨询专业教练。
          </p>
        </Card>
      </div>
    </div>
  );
}

export default AIChat;
