import { useState } from 'react';
import { Clock, Flame, Heart, Bookmark, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Recipe } from '@/types';
import { recipeCategoryLabels, recipeCategoryColors } from '@/hooks/useDiet';

interface RecipeCardProps {
  recipe: Recipe;
  variant?: 'default' | 'compact';
  isFavorite?: boolean;
  onClick?: () => void;
  onToggleFavorite?: () => void;
  onToggleLike?: () => void;
}

export function RecipeCard({ 
  recipe, 
  variant = 'default', 
  isFavorite = false,
  onClick,
  onToggleFavorite,
  onToggleLike,
}: RecipeCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(recipe.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onToggleLike?.();
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  if (variant === 'compact') {
    return (
      <Card 
        className="cursor-pointer hover:shadow-card-hover transition-all duration-300 group overflow-hidden"
        onClick={onClick}
      >
        <div className="flex">
          {recipe.images[0] && (
            <div className="w-24 h-24 flex-shrink-0 overflow-hidden">
              <img 
                src={recipe.images[0]} 
                alt={recipe.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          )}
          <CardContent className="p-3 flex-1">
            <div className="flex flex-wrap gap-1 mb-1">
              {recipe.category.slice(0, 2).map((cat) => (
                <Badge 
                  key={cat} 
                  variant="outline" 
                  className={`text-xs ${recipeCategoryColors[cat]}`}
                >
                  {recipeCategoryLabels[cat]}
                </Badge>
              ))}
            </div>
            <h4 className="font-medium text-[#333333] line-clamp-1 group-hover:text-[#38B2AC] transition-colors">
              {recipe.name}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs text-[#718096]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {recipe.cookingTime}分钟
              </span>
              <span className="flex items-center gap-1">
                <Flame className="w-3 h-3" />
                {recipe.calories} 千卡
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-card-hover transition-all duration-300 group overflow-hidden"
      onClick={onClick}
    >
      {recipe.images[0] && (
        <div className="h-48 overflow-hidden relative">
          <img 
            src={recipe.images[0]} 
            alt={recipe.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavorite}
              className={`w-8 h-8 rounded-full bg-white/80 hover:bg-white ${
                isFavorite ? 'text-red-500' : 'text-[#718096]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      )}
      <CardContent className="p-4">
        <div className="flex flex-wrap gap-1 mb-2">
          {recipe.category.slice(0, 3).map((cat) => (
            <Badge 
              key={cat} 
              variant="outline" 
              className={`text-xs ${recipeCategoryColors[cat]}`}
            >
              {recipeCategoryLabels[cat]}
            </Badge>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-[#333333] mb-1 group-hover:text-[#38B2AC] transition-colors line-clamp-1">
          {recipe.name}
        </h3>
        <p className="text-sm text-[#718096] line-clamp-2 mb-3">
          {recipe.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#718096]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {recipe.cookingTime}分钟
            </span>
            <span className="flex items-center gap-1">
              <Flame className="w-3 h-3" />
              {recipe.calories} 千卡
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-8 px-2 ${liked ? 'text-red-500' : 'text-[#718096]'}`}
            >
              <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
              <span className="ml-1 text-xs">{likeCount}</span>
            </Button>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
          {recipe.authorAvatar ? (
            <img src={recipe.authorAvatar} alt={recipe.author} className="w-6 h-6 rounded-full" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#E6F7F6] flex items-center justify-center">
              <User className="w-3 h-3 text-[#38B2AC]" />
            </div>
          )}
          <span className="text-xs text-[#718096]">{recipe.author}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default RecipeCard;
