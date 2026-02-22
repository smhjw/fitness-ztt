import { useState } from 'react';
import { Calendar, Ruler, Weight, Percent, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { BodyMeasurement } from '@/types';

interface BodyMeasurementFormProps {
  initialData?: Partial<BodyMeasurement>;
  onSubmit: (data: {
    date: string;
    height?: number;
    weight: number;
    bodyFat?: number;
    chest?: number;
    waist?: number;
    hips?: number;
    arms?: number;
    thighs?: number;
    notes?: string;
  }) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function BodyMeasurementForm({ initialData, onSubmit, onCancel, isSubmitting }: BodyMeasurementFormProps) {
  const [formData, setFormData] = useState({
    date: initialData?.date || new Date().toISOString().split('T')[0],
    height: initialData?.height || '',
    weight: initialData?.weight || '',
    bodyFat: initialData?.bodyFat || '',
    chest: initialData?.chest || '',
    waist: initialData?.waist || '',
    hips: initialData?.hips || '',
    arms: initialData?.arms || '',
    thighs: initialData?.thighs || '',
    notes: initialData?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: formData.date,
      height: formData.height ? Number(formData.height) : undefined,
      weight: Number(formData.weight),
      bodyFat: formData.bodyFat ? Number(formData.bodyFat) : undefined,
      chest: formData.chest ? Number(formData.chest) : undefined,
      waist: formData.waist ? Number(formData.waist) : undefined,
      hips: formData.hips ? Number(formData.hips) : undefined,
      arms: formData.arms ? Number(formData.arms) : undefined,
      thighs: formData.thighs ? Number(formData.thighs) : undefined,
      notes: formData.notes || undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* Basic Measurements */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            身高 (cm)
          </Label>
          <Input
            type="number"
            step="0.1"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            placeholder="175"
            className="h-12 rounded-xl"
            inputMode="decimal"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Weight className="w-4 h-4" />
            体重 (kg)
          </Label>
          <Input
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            placeholder="70"
            className="h-12 rounded-xl"
            inputMode="decimal"
            required
          />
        </div>
      </div>

      {/* Body Fat */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Percent className="w-4 h-4" />
          体脂率 (%)
        </Label>
        <Input
          type="number"
          step="0.1"
          min="0"
          max="100"
          value={formData.bodyFat}
          onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
          placeholder="15"
          className="h-12 rounded-xl"
          inputMode="decimal"
        />
      </div>

      {/* Body Measurements */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#718096]">围度</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">胸围 (cm)</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.chest}
              onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
              placeholder="100"
              className="h-10 rounded-xl"
              inputMode="decimal"
            />
          </div>
          <div>
            <Label className="text-xs">腰围 (cm)</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.waist}
              onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
              placeholder="80"
              className="h-10 rounded-xl"
              inputMode="decimal"
            />
          </div>
          <div>
            <Label className="text-xs">臀围 (cm)</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.hips}
              onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
              placeholder="95"
              className="h-10 rounded-xl"
              inputMode="decimal"
            />
          </div>
          <div>
            <Label className="text-xs">臂围 (cm)</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.arms}
              onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
              placeholder="35"
              className="h-10 rounded-xl"
              inputMode="decimal"
            />
          </div>
          <div>
            <Label className="text-xs">大腿围 (cm)</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.thighs}
              onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
              placeholder="55"
              className="h-10 rounded-xl"
              inputMode="decimal"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          备注
        </Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="记录身体状态或备注"
          className="min-h-[80px] rounded-xl resize-none"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
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
          className="flex-1 h-12 bg-[#FF6A3D] hover:bg-[#F4511E] text-white rounded-xl font-medium"
        >
          {isSubmitting ? '保存中...' : initialData ? '保存修改' : '保存记录'}
        </Button>
      </div>
    </form>
  );
}

export default BodyMeasurementForm;
