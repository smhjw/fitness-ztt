import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  
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
        <Label>{t('body.date')}</Label>
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
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            {t('body.height')} ({t('common.cm')})
          </Label>
          <Input
            type="number"
            step="0.1"
            value={formData.height}
            onChange={(e) => setFormData({ ...formData, height: e.target.value })}
            placeholder="175"
            className="h-12 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Weight className="w-4 h-4" />
            {t('body.weight')} ({t('common.kg')})
          </Label>
          <Input
            type="number"
            step="0.1"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            placeholder="70"
            className="h-12 rounded-xl"
            required
          />
        </div>
      </div>

      {/* Body Fat */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Percent className="w-4 h-4" />
          {t('body.bodyFat')} (%)
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
        />
      </div>

      {/* Body Measurements */}
      <div className="space-y-2">
        <Label className="text-sm font-medium text-[#718096]">{t('body.measurementTrend')}</Label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs">{t('body.chest')} ({t('common.cm')})</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.chest}
              onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
              placeholder="100"
              className="h-10 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-xs">{t('body.waist')} ({t('common.cm')})</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.waist}
              onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
              placeholder="80"
              className="h-10 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-xs">{t('body.hips')} ({t('common.cm')})</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.hips}
              onChange={(e) => setFormData({ ...formData, hips: e.target.value })}
              placeholder="95"
              className="h-10 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-xs">{t('body.arms')} ({t('common.cm')})</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.arms}
              onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
              placeholder="35"
              className="h-10 rounded-xl"
            />
          </div>
          <div>
            <Label className="text-xs">{t('body.thighs')} ({t('common.cm')})</Label>
            <Input
              type="number"
              step="0.1"
              value={formData.thighs}
              onChange={(e) => setFormData({ ...formData, thighs: e.target.value })}
              placeholder="55"
              className="h-10 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {t('body.notes')} ({t('records.optional')})
        </Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder={t('body.notes')}
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
            {t('common.cancel')}
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-12 bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-xl font-medium"
        >
          {isSubmitting ? t('common.loading') : initialData ? t('body.editRecord') : t('body.addRecord')}
        </Button>
      </div>
    </form>
  );
}

export default BodyMeasurementForm;
