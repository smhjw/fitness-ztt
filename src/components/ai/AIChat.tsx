import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Trash2, Sparkles, Dumbbell, Apple, Heart, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAIChat } from '@/hooks/useAIChat';

const suggestions = [
  { icon: <Dumbbell className="w-4 h-4" />, text: '帮我生成一周训练计划' },
  { icon: <Apple className="w-4 h-4" />, text: '推荐低脂高蛋白菜谱' },
  { icon: <Heart className="w-4 h-4" />, text: '提高心肺能力的训练' },
  { icon: <Zap className="w-4 h-4" />, text: '训练后如何恢复' },
];

export function AIChat() {
  const { messages, isLoading, sendMessage, clearMessages } = useAIChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput('');
  };

  const handleSuggestionClick = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-[70dvh] min-h-[420px] max-h-[720px] md:h-[calc(100vh-200px)] md:max-h-[800px] bg-white rounded-2xl shadow-card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-[#38B2AC] to-[#2C9B95]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">FitTrack AI 助手</h3>
            <p className="text-xs text-white/80">训练、饮食、恢复随问随答</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearMessages}
          className="text-white/80 hover:text-white hover:bg-white/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea viewportRef={scrollRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? 'bg-[#38B2AC]'
                  : 'bg-gradient-to-br from-[#38B2AC] to-[#2C9B95]'
              }`}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-white" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>
              <div className={`max-w-[80%] p-3 rounded-2xl ${
                message.role === 'user'
                  ? 'bg-[#38B2AC] text-white rounded-tr-none'
                  : 'bg-gray-100 text-[#333333] rounded-tl-none'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-white/70' : 'text-[#718096]'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#38B2AC] to-[#2C9B95] flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 p-3 rounded-2xl rounded-tl-none">
                <div className="flex items-center gap-2 text-sm text-[#718096]">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  正在思考...
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="mt-6">
            <p className="text-sm text-[#718096] mb-3">常用提问</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="flex items-center gap-2 px-3 py-2 bg-[#E6F7F6] text-[#38B2AC] rounded-full text-sm hover:bg-[#38B2AC] hover:text-white transition-colors"
                >
                  {suggestion.icon}
                  {suggestion.text}
                </button>
              ))}
            </div>
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入你的问题..."
            className="flex-1 h-12 rounded-full"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-12 w-12 rounded-full bg-[#38B2AC] hover:bg-[#2C9B95] p-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}

export default AIChat;
