import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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

const categories: RecipeCategory[] = [
  'breakfast', 'lunch', 'dinner', 'snack',
  'low-carb', 'high-protein', 'vegetarian', 'pre-workout', 'post-workout'
];

export function DietSection() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
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

  const selectedRecipe = selectedRecipeId ? getRecipeById(selectedRecipeId) : null;
  const relatedRecipes = selectedRecipeId 
    ? filteredRecipes.filter(r => r.id !== selectedRecipeId).slice(0, 4)
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

  if (selectedRecipe) {
    return (
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <RecipeDetail
            recipe={selectedRecipe}
            isFavorite={isFavorite(selectedRecipe.id)}
            relatedRecipes={relatedRecipes}
            onBack={() => setSelectedRecipeId(null)}
            onToggleFavorite={() => toggleFavorite(selectedRecipe.id)}
            onToggleLike={() => toggleLike(selectedRecipe.id)}
            onAddComment={(content) => addComment(selectedRecipe.id, content)}
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
            <h1 className="text-3xl font-bold text-[#333333]">{t('diet.title')}</h1>
            <p className="text-[#718096] mt-1">{t('diet.subtitle')}</p>
          </div>
          <Button 
            onClick={() => setIsUploadOpen(true)}
            className="bg-[#38B2AC] hover:bg-[#2C9B95] text-white rounded-full gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('diet.uploadRecipe')}
          </Button>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
            <Input
              type="text"
              placeholder={t('diet.searchPlaceholder')}
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
              {t('records.clearFilters')}
            </button>
          )}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-full">
            <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
              <BookOpen className="w-4 h-4" />
              {t('diet.recommended')}
            </TabsTrigger>
            <TabsTrigger value="favorites" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
              <Heart className="w-4 h-4" />
              {t('diet.favorites')}
            </TabsTrigger>
            <TabsTrigger value="my" className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2">
              <ChefHat className="w-4 h-4" />
              {t('diet.myRecipes')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={isFavorite(recipe.id)}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  onToggleFavorite={() => toggleFavorite(recipe.id)}
                  onToggleLike={() => toggleLike(recipe.id)}
                />
              ))}
            </div>
            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-[#718096]">{t('knowledge.noArticles')}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={true}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  onToggleFavorite={() => toggleFavorite(recipe.id)}
                  onToggleLike={() => toggleLike(recipe.id)}
                />
              ))}
            </div>
            {favoriteRecipes.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-[#718096]">{t('diet.noFavorites') || '暂无收藏'}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="my" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={isFavorite(recipe.id)}
                  onClick={() => setSelectedRecipeId(recipe.id)}
                  onToggleFavorite={() => toggleFavorite(recipe.id)}
                  onToggleLike={() => toggleLike(recipe.id)}
                />
              ))}
            </div>
            {myRecipes.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-[#718096]">{t('diet.noMyRecipes') || '暂无我的菜谱'}</p>
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
