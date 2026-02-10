import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { RecipeCategory, Ingredient } from '@/types';
import { recipeCategoryLabels, recipeCategoryColors } from '@/hooks/useDiet';
import useAuth from '@/hooks/useAuth';

interface UploadRecipeDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    description: string;
    category: RecipeCategory[];
    ingredients: Ingredient[];
    steps: string[];
    images: string[];
    cookingTime: number;
    servings: number;
    calories: number;
    nutrition: { calories: number; protein: number; carbs: number; fat: number };
  }) => void;
}

const categories: RecipeCategory[] = [
  'breakfast', 'lunch', 'dinner', 'snack',
  'low-carb', 'high-protein', 'vegetarian', 'pre-workout', 'post-workout'
];

export function UploadRecipeDialog({ open, onClose, onSubmit }: UploadRecipeDialogProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: [] as RecipeCategory[],
    ingredients: [{ name: '', amount: '', unit: '' }] as Ingredient[],
    steps: [''],
    images: [] as string[],
    cookingTime: 15,
    servings: 1,
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

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
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const toggleCategory = (cat: RecipeCategory) => {
    setFormData(prev => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter(c => c !== cat)
        : [...prev.category, cat]
    }));
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', amount: '', unit: '' }]
    }));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const updateStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  const removeStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      name: formData.name,
      description: formData.description,
      category: formData.category,
      ingredients: formData.ingredients.filter(i => i.name.trim()),
      steps: formData.steps.filter(s => s.trim()),
      images: formData.images,
      cookingTime: formData.cookingTime,
      servings: formData.servings,
      calories: formData.calories,
      nutrition: {
        calories: formData.calories,
        protein: formData.protein,
        carbs: formData.carbs,
        fat: formData.fat,
      },
    });
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      category: [],
      ingredients: [{ name: '', amount: '', unit: '' }],
      steps: [''],
      images: [],
      cookingTime: 15,
      servings: 1,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('diet.uploadRecipe')}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Images */}
          <div className="space-y-2">
            <Label>{t('diet.uploadImage')}</Label>
            <div className="flex flex-wrap gap-2">
              {formData.images.map((img, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img src={img} alt="" className="w-full h-full object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index)
                    }))}
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

          {/* Basic Info */}
          <div className="space-y-2">
            <Label>{t('diet.recipeName')}</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder={t('diet.recipeName')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>{t('diet.description')}</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('diet.description')}
              rows={2}
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <Label>{t('diet.categories')}</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.category.includes(cat)
                      ? recipeCategoryColors[cat]
                      : 'bg-gray-100 text-[#718096] hover:bg-gray-200'
                  }`}
                >
                  {recipeCategoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Time & Servings */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t('diet.cookingTime')} ({t('common.minutes')})</Label>
              <Input
                type="number"
                value={formData.cookingTime}
                onChange={(e) => setFormData(prev => ({ ...prev, cookingTime: parseInt(e.target.value) || 0 }))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('diet.servings')}</Label>
              <Input
                type="number"
                value={formData.servings}
                onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) || 1 }))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label>{t('diet.calories')}</Label>
              <Input
                type="number"
                value={formData.calories}
                onChange={(e) => setFormData(prev => ({ ...prev, calories: parseInt(e.target.value) || 0 }))}
                min={0}
              />
            </div>
          </div>

          {/* Nutrition */}
          <div className="space-y-2">
            <Label>{t('diet.nutrition')}</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs">{t('diet.protein')} (g)</Label>
                <Input
                  type="number"
                  value={formData.protein}
                  onChange={(e) => setFormData(prev => ({ ...prev, protein: parseInt(e.target.value) || 0 }))}
                  min={0}
                />
              </div>
              <div>
                <Label className="text-xs">{t('diet.carbs')} (g)</Label>
                <Input
                  type="number"
                  value={formData.carbs}
                  onChange={(e) => setFormData(prev => ({ ...prev, carbs: parseInt(e.target.value) || 0 }))}
                  min={0}
                />
              </div>
              <div>
                <Label className="text-xs">{t('diet.fat')} (g)</Label>
                <Input
                  type="number"
                  value={formData.fat}
                  onChange={(e) => setFormData(prev => ({ ...prev, fat: parseInt(e.target.value) || 0 }))}
                  min={0}
                />
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('diet.ingredients')}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
                <Plus className="w-4 h-4 mr-1" />
                {t('common.add')}
              </Button>
            </div>
            {formData.ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="食材名称"
                  className="flex-1"
                />
                <Input
                  value={ing.amount}
                  onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                  placeholder="数量"
                  className="w-20"
                />
                <Input
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  placeholder="单位"
                  className="w-20"
                />
                {formData.ingredients.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeIngredient(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Steps */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('diet.steps')}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addStep}>
                <Plus className="w-4 h-4 mr-1" />
                {t('common.add')}
              </Button>
            </div>
            {formData.steps.map((step, index) => (
              <div key={index} className="flex gap-2">
                <span className="w-8 h-8 rounded-full bg-[#38B2AC] text-white flex items-center justify-center flex-shrink-0 text-sm">
                  {index + 1}
                </span>
                <Textarea
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder={`步骤 ${index + 1}`}
                  className="flex-1 min-h-[60px]"
                />
                {formData.steps.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeStep(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              className="flex-1 bg-[#38B2AC] hover:bg-[#2C9B95]"
              disabled={!formData.name.trim() || formData.category.length === 0}
            >
              {t('common.submit')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UploadRecipeDialog;
