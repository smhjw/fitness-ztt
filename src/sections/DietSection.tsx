import { useState } from 'react';
import { Search, Plus, BookOpen, Heart, ChefHat } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDiet, recipeCategoryLabels, recipeCategoryColors } from '@/hooks/useDiet';
import type { RecipeCategory } from '@/types';
import RecipeCard from '@/components/diet/RecipeCard';
import RecipeDetail from '@/components/diet/RecipeDetail';
import UploadRecipeDialog from '@/components/diet/UploadRecipeDialog';
import useAuth from '@/hooks/useAuth';
import { useNavigate, useParams } from 'react-router-dom';

const categories: RecipeCategory[] = [
  'breakfast', 'lunch', 'dinner', 'snack',
  'low-carb', 'high-protein', 'vegetarian', 'pre-workout', 'post-workout'
];

export function DietSection() {
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const { user } = useAuth();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  const {
    filteredRecipes,
    favoriteRecipes,
    myRecipes,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    clearFilters,
    createRecipe,
    getRecipeById,
    toggleLike,
    toggleFavorite,
    isFavorite,
    addComment,
  } = useDiet();

  const selectedRecipe = recipeId ? getRecipeById(recipeId) : null;
  const relatedRecipes = recipeId 
    ? filteredRecipes.filter(r => r.id !== recipeId).slice(0, 4)
    : [];

  const handleCreateRecipe = (data: any) => {
    if (!user) return;
    createRecipe({
      ...data,
      userId: user.id,
      author: user.name,
      authorAvatar: user.avatar,
    });
  };

  if (recipeId && !selectedRecipe) {
    return (
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#333333] mb-2">菜谱不存在</h2>
          <p className="text-[#718096] mb-6">该菜谱可能已被删除或不存在。</p>
          <Button onClick={() => navigate('/diet')} className="rounded-full">
            返回饮食页
          </Button>
        </div>
      </section>
    );
  }

  if (selectedRecipe) {
    return (
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecipeDetail
            recipe={selectedRecipe}
            isFavorite={isFavorite(selectedRecipe.id)}
            relatedRecipes={relatedRecipes}
            onBack={() => navigate('/diet')}
            onToggleFavorite={() => toggleFavorite(selectedRecipe.id)}
            onToggleLike={() => toggleLike(selectedRecipe.id)}
            onAddComment={(content) => addComment(selectedRecipe.id, content)}
            onSelectRelated={(id) => navigate(`/diet/${id}`)}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">饮食</h1>
            <p className="text-[#718096] mt-1">高质量菜谱与营养建议</p>
          </div>
          <Button 
            onClick={() => setIsUploadOpen(true)}
            className="bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-full gap-2 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            上传菜谱
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
            <Input
              type="text"
              placeholder="搜索菜谱、食材或营养关键词"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-14 rounded-full text-base"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => toggleCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategories.includes(category)
                  ? recipeCategoryColors[category]
                  : 'bg-gray-100 text-[#718096] hover:bg-gray-200'
              }`}
            >
              {recipeCategoryLabels[category]}
            </button>
          ))}
          {selectedCategories.length > 0 && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-full text-sm font-medium text-[#718096] hover:bg-gray-100"
            >
              清除筛选
            </button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-full overflow-x-auto flex-nowrap max-w-full justify-start md:justify-center">
            <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
              <BookOpen className="w-4 h-4" />
              推荐
            </TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
              <Heart className="w-4 h-4" />
              收藏
            </TabsTrigger>
            <TabsTrigger value="my" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
              <ChefHat className="w-4 h-4" />
              我的
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={isFavorite(recipe.id)}
                  onClick={() => navigate(`/diet/${recipe.id}`)}
                  onToggleFavorite={() => toggleFavorite(recipe.id)}
                  onToggleLike={() => toggleLike(recipe.id)}
                />
              ))}
            </div>
            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-[#718096]">暂无内容</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {favoriteRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={true}
                  onClick={() => navigate(`/diet/${recipe.id}`)}
                  onToggleFavorite={() => toggleFavorite(recipe.id)}
                  onToggleLike={() => toggleLike(recipe.id)}
                />
              ))}
            </div>
            {favoriteRecipes.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-[#718096]">暂无收藏</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {myRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={isFavorite(recipe.id)}
                  onClick={() => navigate(`/diet/${recipe.id}`)}
                  onToggleFavorite={() => toggleFavorite(recipe.id)}
                  onToggleLike={() => toggleLike(recipe.id)}
                />
              ))}
            </div>
            {myRecipes.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-[#718096]">暂无我的菜谱</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Upload Dialog */}
      <UploadRecipeDialog
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSubmit={handleCreateRecipe}
      />
    </section>
  );
}

export default DietSection;
