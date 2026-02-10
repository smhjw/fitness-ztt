import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Recipe, RecipeComment, RecipeCategory } from '@/types';
import { dietStorage } from '@/services/dietStorage';
import useAuth from './useAuth';

interface UseDietReturn {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  favoriteRecipes: Recipe[];
  myRecipes: Recipe[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: RecipeCategory[];
  toggleCategory: (category: RecipeCategory) => void;
  clearFilters: () => void;
  createRecipe: (data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'favorites' | 'comments'>) => Promise<Recipe>;
  updateRecipe: (id: string, data: Partial<Recipe>) => Promise<Recipe | null>;
  deleteRecipe: (id: string) => Promise<boolean>;
  getRecipeById: (id: string) => Recipe | null;
  toggleLike: (recipeId: string) => number;
  toggleFavorite: (recipeId: string) => boolean;
  isFavorite: (recipeId: string) => boolean;
  addComment: (recipeId: string, content: string) => RecipeComment;
  deleteComment: (recipeId: string, commentId: string) => boolean;
}

export function useDiet(): UseDietReturn {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<RecipeCategory[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setIsLoading(true);
    const loadedRecipes = dietStorage.getAllRecipes();
    setRecipes(loadedRecipes);
    if (user) {
      setFavorites(dietStorage.getUserFavorites(user.id));
    }
    setIsLoading(false);
  }, [user]);

  const filteredRecipes = useMemo(() => {
    let result = [...recipes];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(query))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(r =>
        r.category.some(cat => selectedCategories.includes(cat))
      );
    }

    return result.sort((a, b) => b.likes - a.likes);
  }, [recipes, searchQuery, selectedCategories]);

  const favoriteRecipes = useMemo(() => {
    return recipes.filter(r => favorites.includes(r.id));
  }, [recipes, favorites]);

  const myRecipes = useMemo(() => {
    if (!user) return [];
    return recipes.filter(r => r.userId === user.id);
  }, [recipes, user]);

  const toggleCategory = useCallback((category: RecipeCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories([]);
  }, []);

  const createRecipe = useCallback(async (data: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'favorites' | 'comments'>): Promise<Recipe> => {
    const newRecipe = dietStorage.createRecipe(data);
    setRecipes(prev => [newRecipe, ...prev]);
    return newRecipe;
  }, []);

  const updateRecipe = useCallback(async (id: string, data: Partial<Recipe>): Promise<Recipe | null> => {
    const updated = dietStorage.updateRecipe(id, data);
    if (updated) {
      setRecipes(prev => prev.map(r => r.id === id ? updated : r));
    }
    return updated;
  }, []);

  const deleteRecipe = useCallback(async (id: string): Promise<boolean> => {
    const success = dietStorage.deleteRecipe(id);
    if (success) {
      setRecipes(prev => prev.filter(r => r.id !== id));
    }
    return success;
  }, []);

  const getRecipeById = useCallback((id: string): Recipe | null => {
    return recipes.find(r => r.id === id) || null;
  }, [recipes]);

  const toggleLike = useCallback((recipeId: string): number => {
    if (!user) return 0;
    const newLikes = dietStorage.toggleLike(recipeId, user.id);
    setRecipes(prev => prev.map(r => 
      r.id === recipeId ? { ...r, likes: newLikes } : r
    ));
    return newLikes;
  }, [user]);

  const toggleFavorite = useCallback((recipeId: string): boolean => {
    if (!user) return false;
    const isFav = dietStorage.toggleFavorite(recipeId, user.id);
    setFavorites(prev => 
      isFav ? [...prev, recipeId] : prev.filter(id => id !== recipeId)
    );
    return isFav;
  }, [user]);

  const isFavorite = useCallback((recipeId: string): boolean => {
    return favorites.includes(recipeId);
  }, [favorites]);

  const addComment = useCallback((recipeId: string, content: string): RecipeComment => {
    if (!user) throw new Error('User not logged in');
    
    const comment = dietStorage.addComment(recipeId, {
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content,
    });
    
    setRecipes(prev => prev.map(r => 
      r.id === recipeId 
        ? { ...r, comments: [...r.comments, comment] }
        : r
    ));
    
    return comment;
  }, [user]);

  const deleteComment = useCallback((recipeId: string, commentId: string): boolean => {
    const success = dietStorage.deleteComment(recipeId, commentId);
    if (success) {
      setRecipes(prev => prev.map(r => 
        r.id === recipeId 
          ? { ...r, comments: r.comments.filter(c => c.id !== commentId) }
          : r
      ));
    }
    return success;
  }, []);

  return {
    recipes,
    filteredRecipes,
    favoriteRecipes,
    myRecipes,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    clearFilters,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
    toggleLike,
    toggleFavorite,
    isFavorite,
    addComment,
    deleteComment,
  };
}

export const recipeCategoryLabels: Record<RecipeCategory, string> = {
  'breakfast': '早餐',
  'lunch': '午餐',
  'dinner': '晚餐',
  'snack': '加餐',
  'low-carb': '低碳',
  'high-protein': '高蛋白',
  'vegetarian': '素食',
  'pre-workout': '训练前',
  'post-workout': '训练后',
};

export const recipeCategoryColors: Record<RecipeCategory, string> = {
  'breakfast': 'bg-orange-100 text-orange-700 border-orange-200',
  'lunch': 'bg-green-100 text-green-700 border-green-200',
  'dinner': 'bg-blue-100 text-blue-700 border-blue-200',
  'snack': 'bg-pink-100 text-pink-700 border-pink-200',
  'low-carb': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'high-protein': 'bg-red-100 text-red-700 border-red-200',
  'vegetarian': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  'pre-workout': 'bg-purple-100 text-purple-700 border-purple-200',
  'post-workout': 'bg-cyan-100 text-cyan-700 border-cyan-200',
};

export default useDiet;
