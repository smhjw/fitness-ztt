import { useState, useRef } from 'react';
import { Calendar, Clock, Dumbbell, Smile, Frown, Meh, Laugh, Annoyed, Flame, Zap, Activity, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { ExerciseFormData, ExerciseType, MoodLevel, IntensityLevel } from '@/types';

interface ExerciseFormProps {
  initialData?: Partial<ExerciseFormData>;
  onSubmit: (data: ExerciseFormData) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function ExerciseForm({ initialData, onSubmit, onCancel, isSubmitting }: ExerciseFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<ExerciseFormData>({
    type: initialData?.type || 'running',
    duration: initialData?.duration || 30,
    date: initialData?.date || new Date().toISOString().split('T')[0],
    intensity: initialData?.intensity || 'medium',
    mood: initialData?.mood || 3,
    notes: initialData?.notes || '',
    images: initialData?.images || [],
  });

  const exerciseTypes: { value: ExerciseType; label: string; icon: React.ReactNode }[] = [
    { value: 'running', label: '跑步', icon: <Activity className="w-4 h-4" /> },
    { value: 'walking', label: '步行', icon: <Activity className="w-4 h-4" /> },
    { value: 'cycling', label: '骑行', icon: <Activity className="w-4 h-4" /> },
    { value: 'swimming', label: '游泳', icon: <Activity className="w-4 h-4" /> },
    { value: 'weightlifting', label: '力量训练', icon: <Dumbbell className="w-4 h-4" /> },
    { value: 'yoga', label: '瑜伽', icon: <Activity className="w-4 h-4" /> },
    { value: 'pilates', label: '普拉提', icon: <Activity className="w-4 h-4" /> },
    { value: 'hiit', label: 'HIIT', icon: <Zap className="w-4 h-4" /> },
    { value: 'cardio', label: '有氧', icon: <Flame className="w-4 h-4" /> },
    { value: 'sports', label: '球类运动', icon: <Activity className="w-4 h-4" /> },
    { value: 'other', label: '其他', icon: <Activity className="w-4 h-4" /> },
  ];

  const moodOptions: { value: MoodLevel; label: string; icon: React.ReactNode; color: string }[] = [
    { value: 1, label: '很差', icon: <Frown className="w-6 h-6" />, color: 'text-red-500' },
    { value: 2, label: '较差', icon: <Annoyed className="w-6 h-6" />, color: 'text-orange-500' },
    { value: 3, label: '一般', icon: <Meh className="w-6 h-6" />, color: 'text-yellow-500' },
    { value: 4, label: '不错', icon: <Smile className="w-6 h-6" />, color: 'text-lime-500' },
    { value: 5, label: '很棒', icon: <Laugh className="w-6 h-6" />, color: 'text-green-500' },
  ];

  const intensityOptions: { value: IntensityLevel; label: string; color: string }[] = [
    { value: 'low', label: '低强度', color: 'bg-green-100 text-green-700 border-green-200' },
    { value: 'medium', label: '中等强度', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { value: 'high', label: '高强度', color: 'bg-orange-100 text-orange-700 border-orange-200' },
    { value: 'very-high', label: '极高强度', color: 'bg-red-100 text-red-700 border-red-200' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...(prev.images || []), reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index) || []
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Exercise Type */}
      <div className="space-y-2">
        <Label>运动类型</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as ExerciseType })}
        >
          <SelectTrigger className="h-12 rounded-xl">
            <SelectValue placeholder="运动类型" />
          </SelectTrigger>
          <SelectContent>
            {exerciseTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  {type.icon}
                  {type.label}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <Label>时长</Label>
        <div className="flex items-center gap-4">
          <Clock className="w-5 h-5 text-[#718096]" />
          <Slider
            value={[formData.duration]}
            onValueChange={([value]) => setFormData({ ...formData, duration: value })}
            min={5}
            max={180}
            step={5}
            className="flex-1"
          />
          <span className="w-16 text-right font-medium text-[#333333]">
            {formData.duration} 分钟
          </span>
        </div>
      </div>

      {/* Date */}
      <div className="space-y-2">
        <Label>日期</Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
          <Input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="pl-10 h-12 rounded-xl"
            required
          />
        </div>
      </div>

      {/* Intensity */}
      <div className="space-y-2">
        <Label>强度</Label>
        <div className="grid grid-cols-2 gap-2">
          {intensityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, intensity: option.value })}
              className={`px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                formData.intensity === option.value
                  ? option.color + ' border-current'
                  : 'bg-gray-50 text-[#718096] border-transparent hover:bg-gray-100'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mood */}
      <div className="space-y-2">
        <Label>心情</Label>
        <div className="flex justify-between gap-2">
          {moodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, mood: option.value })}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                formData.mood === option.value
                  ? 'bg-[#E6F7F6] ' + option.color
                  : 'text-[#718096] hover:bg-gray-50'
              }`}
            >
              {option.icon}
              <span className="text-xs">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Images */}
      <div className="space-y-2">
        <Label>上传图片</Label>
        <div className="flex flex-wrap gap-2">
          {formData.images?.map((img, index) => (
            <div key={index} className="relative w-20 h-20">
              <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#38B2AC] transition-colors"
          >
            <ImageIcon className="w-6 h-6 text-gray-400" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label>备注（可选）</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="写点感受或训练要点"
          className="min-h-[100px] rounded-xl resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 h-12 rounded-xl"
          >
            取消
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-12 bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-xl font-medium"
        >
          {isSubmitting ? '加载中...' : initialData ? '更新记录' : '保存记录'}
        </Button>
      </div>
    </form>
  );
}

export default ExerciseForm;
