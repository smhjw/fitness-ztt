import { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Flame, 
  Heart, 
  Bookmark, 
  Share2, 
  User,
  Send,
  MessageCircle,
  ChefHat,
  UtensilsCrossed
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Recipe } from '@/types';
import { recipeCategoryLabels, recipeCategoryColors } from '@/hooks/useDiet';
import useAuth from '@/hooks/useAuth';

interface RecipeDetailProps {
  recipe: Recipe;
  isFavorite: boolean;
  relatedRecipes: Recipe[];
  onBack: () => void;
  onToggleFavorite: () => void;
  onToggleLike: () => void;
  onAddComment: (content: string) => void;
}

export function RecipeDetail({ 
  recipe, 
  isFavorite,
  relatedRecipes,
  onBack,
  onToggleFavorite,
  onToggleLike,
  onAddComment,
}: RecipeDetailProps) {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(recipe.likes);
  const [commentText, setCommentText] = useState('');

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(prev => liked ? prev - 1 : prev + 1);
    onToggleLike();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: recipe.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSubmitComment = () => {
    if (!commentText.trim()) return;
    onAddComment(commentText);
    setCommentText('');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          返回
        </Button>
      </div>

      {/* Recipe Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.category.map((cat) => (
            <Badge key={cat} variant="outline" className={recipeCategoryColors[cat]}>
              {recipeCategoryLabels[cat]}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
          {recipe.name}
        </h1>
        <p className="text-lg text-[#718096] mb-4">{recipe.description}</p>
        <div className="flex items-center gap-4 text-sm text-[#718096]">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {recipe.cookingTime}分钟
          </span>
          <span className="flex items-center gap-1">
            <Flame className="w-4 h-4" />
            {recipe.calories} 千卡
          </span>
          <span className="flex items-center gap-1">
            <UtensilsCrossed className="w-4 h-4" />
            {recipe.servings} 份
          </span>
        </div>
      </div>

      {/* Featured Image */}
      {recipe.images[0] && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img src={recipe.images[0]} alt={recipe.name} className="w-full h-64 md:h-80 object-cover" />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mb-8">
        <Button
          variant="outline"
          onClick={handleLike}
          className={`gap-2 ${liked ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
        >
          <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
          {likeCount}
        </Button>
        <Button
          variant="outline"
          onClick={onToggleFavorite}
          className={`gap-2 ${isFavorite ? 'text-[#38B2AC] border-[#38B2AC] bg-[#E6F7F6]' : ''}`}
        >
          <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          收藏
        </Button>
        <Button variant="outline" onClick={handleShare} className="gap-2">
          <Share2 className="w-4 h-4" />
          分享
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="ingredients" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1 rounded-full overflow-x-auto flex-nowrap max-w-full justify-start md:justify-center">
          <TabsTrigger value="ingredients" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
            <ChefHat className="w-4 h-4" />
            食材
          </TabsTrigger>
          <TabsTrigger value="steps" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
            <UtensilsCrossed className="w-4 h-4" />
            步骤
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
            <Flame className="w-4 h-4" />
            营养
          </TabsTrigger>
          <TabsTrigger value="comments" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
            <MessageCircle className="w-4 h-4" />
            评论 ({recipe.comments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ingredients" className="space-y-4">
          <h3 className="text-xl font-semibold text-[#333333]">食材</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-[#333333]">{ingredient.name}</span>
                <span className="text-[#718096]">{ingredient.amount} {ingredient.unit}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="steps" className="space-y-4">
          <h3 className="text-xl font-semibold text-[#333333]">步骤</h3>
          <div className="space-y-4">
            {recipe.steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#38B2AC] text-white flex items-center justify-center flex-shrink-0 font-medium">
                  {index + 1}
                </div>
                <p className="text-[#333333] pt-1">{step}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <h3 className="text-xl font-semibold text-[#333333]">营养信息</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#38B2AC]">{recipe.nutrition.calories}</p>
              <p className="text-sm text-[#718096]">热量</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#6D28D9]">{recipe.nutrition.protein}g</p>
              <p className="text-sm text-[#718096]">蛋白质</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#F59E0B]">{recipe.nutrition.carbs}g</p>
              <p className="text-sm text-[#718096]">碳水</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl text-center">
              <p className="text-2xl font-bold text-[#EF4444]">{recipe.nutrition.fat}g</p>
              <p className="text-sm text-[#718096]">脂肪</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <h3 className="text-xl font-semibold text-[#333333]">评论</h3>
          
          {/* Add Comment */}
          {user && (
            <div className="flex gap-3">
              <Textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="写下你的评论..."
                className="flex-1 min-h-[80px]"
              />
              <Button 
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                className="bg-[#38B2AC] hover:bg-[#2C9B95]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {recipe.comments.length > 0 ? (
              recipe.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3 p-4 bg-gray-50 rounded-xl">
                  {comment.userAvatar ? (
                    <img src={comment.userAvatar} alt={comment.userName} className="w-10 h-10 rounded-full" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#E6F7F6] flex items-center justify-center">
                      <User className="w-5 h-5 text-[#38B2AC]" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-[#333333]">{comment.userName}</span>
                      <span className="text-xs text-[#718096]">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-[#333333]">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-[#718096]">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>暂无评论</p>
                <p className="text-sm">成为第一个评论的人吧</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Related Recipes */}
      {relatedRecipes.length > 0 && (
        <div className="mt-12">
          <h3 className="text-xl font-bold text-[#333333] mb-4">相关菜谱</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {relatedRecipes.map((relatedRecipe) => (
              <div 
                key={relatedRecipe.id}
                className="flex gap-3 p-3 bg-white rounded-xl shadow-card hover:shadow-card-hover transition-shadow cursor-pointer"
              >
                {relatedRecipe.images[0] && (
                  <img 
                    src={relatedRecipe.images[0]} 
                    alt={relatedRecipe.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h4 className="font-medium text-[#333333] line-clamp-1">{relatedRecipe.name}</h4>
                  <p className="text-sm text-[#718096] line-clamp-2 mt-1">{relatedRecipe.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecipeDetail;
