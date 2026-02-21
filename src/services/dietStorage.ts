import type { Recipe, RecipeComment, RecipeCategory } from '@/types';

const STORAGE_KEYS = {
  RECIPES: 'fittrack_recipes',
  FAVORITES: 'fittrack_favorites',
} as const;

// Default recipes
const defaultRecipes: Recipe[] = [
  {
    id: '1',
    userId: 'system',
    name: '鸡胸肉沙拉',
    description: '高蛋白低脂肪的健康沙拉，适合健身后食用',
    category: ['lunch', 'dinner', 'high-protein'],
    ingredients: [
      { name: '鸡胸肉', amount: '200', unit: 'g' },
      { name: '生菜', amount: '100', unit: 'g' },
      { name: '小番茄', amount: '8', unit: '个' },
      { name: '黄瓜', amount: '1', unit: '根' },
      { name: '橄榄油', amount: '1', unit: '勺' },
    ],
    steps: [
      '鸡胸肉洗净，用盐和黑胡椒腌制15分钟',
      '平底锅加热，放入鸡胸肉煎至两面金黄',
      '生菜洗净撕成小块，黄瓜切片，小番茄对半切',
      '将蔬菜放入碗中，放上切好的鸡胸肉',
      '淋上橄榄油和少许柠檬汁即可',
    ],
    images: ['https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800'],
    nutrition: { calories: 320, protein: 35, carbs: 12, fat: 14 },
    cookingTime: 20,
    servings: 1,
    calories: 320,
    author: 'FitTrack营养师',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    likes: 256,
    favorites: 128,
    comments: [],
  },
  {
    id: '2',
    userId: 'system',
    name: '燕麦蛋白奶昔',
    description: '早餐首选，快速补充能量和蛋白质',
    category: ['breakfast', 'pre-workout', 'high-protein'],
    ingredients: [
      { name: '燕麦', amount: '50', unit: 'g' },
      { name: '蛋白粉', amount: '30', unit: 'g' },
      { name: '香蕉', amount: '1', unit: '根' },
      { name: '牛奶', amount: '250', unit: 'ml' },
      { name: '花生酱', amount: '1', unit: '勺' },
    ],
    steps: [
      '将燕麦、蛋白粉、香蕉切块放入搅拌机',
      '加入牛奶和花生酱',
      '搅拌30秒至顺滑',
      '倒入杯中即可享用',
    ],
    images: ['https://images.unsplash.com/photo-1553530979-7ee52a2670c4?w=800'],
    nutrition: { calories: 450, protein: 30, carbs: 55, fat: 12 },
    cookingTime: 5,
    servings: 1,
    calories: 450,
    author: 'FitTrack营养师',
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
    likes: 189,
    favorites: 95,
    comments: [],
  },
  {
    id: '3',
    userId: 'system',
    name: '三文鱼藜麦碗',
    description: '富含Omega-3和完整蛋白质的健康晚餐',
    category: ['dinner', 'high-protein', 'low-carb'],
    ingredients: [
      { name: '三文鱼', amount: '150', unit: 'g' },
      { name: '藜麦', amount: '80', unit: 'g' },
      { name: '牛油果', amount: '1/2', unit: '个' },
      { name: '西兰花', amount: '100', unit: 'g' },
      { name: '柠檬', amount: '1/2', unit: '个' },
    ],
    steps: [
      '藜麦淘洗干净，加水煮15分钟至熟透',
      '三文鱼用盐和黑胡椒腌制10分钟',
      '平底锅煎三文鱼至两面金黄',
      '西兰花焯水2分钟',
      '将藜麦铺底，放上三文鱼、西兰花和牛油果',
      '淋上柠檬汁即可',
    ],
    images: ['https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800'],
    nutrition: { calories: 520, protein: 38, carbs: 35, fat: 22 },
    cookingTime: 25,
    servings: 1,
    calories: 520,
    author: 'FitTrack营养师',
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
    likes: 312,
    favorites: 156,
    comments: [],
  },
  {
    id: '4',
    userId: 'system',
    name: '蔬菜蛋白煎蛋',
    description: '简单快捷的高蛋白早餐',
    category: ['breakfast', 'vegetarian', 'high-protein'],
    ingredients: [
      { name: '鸡蛋', amount: '3', unit: '个' },
      { name: '菠菜', amount: '50', unit: 'g' },
      { name: '蘑菇', amount: '3', unit: '个' },
      { name: '洋葱', amount: '1/4', unit: '个' },
      { name: '橄榄油', amount: '1', unit: '勺' },
    ],
    steps: [
      '菠菜洗净，蘑菇切片，洋葱切丁',
      '平底锅加热橄榄油',
      '炒香洋葱和蘑菇',
      '加入菠菜翻炒至软',
      '倒入打散的鸡蛋',
      '小火煎至蛋液凝固即可',
    ],
    images: ['https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800'],
    nutrition: { calories: 280, protein: 22, carbs: 8, fat: 18 },
    cookingTime: 10,
    servings: 1,
    calories: 280,
    author: 'FitTrack营养师',
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10',
    likes: 178,
    favorites: 89,
    comments: [],
  },
  {
    id: '5',
    userId: 'system',
    name: '希腊酸奶碗',
    description: '训练后的完美恢复餐',
    category: ['snack', 'post-workout', 'vegetarian'],
    ingredients: [
      { name: '希腊酸奶', amount: '200', unit: 'g' },
      { name: '蓝莓', amount: '50', unit: 'g' },
      { name: '坚果', amount: '20', unit: 'g' },
      { name: '蜂蜜', amount: '1', unit: '勺' },
      { name: '奇亚籽', amount: '1', unit: '勺' },
    ],
    steps: [
      '将希腊酸奶倒入碗中',
      '撒上洗净的蓝莓',
      '加入坚果和奇亚籽',
      '淋上蜂蜜即可',
    ],
    images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800'],
    nutrition: { calories: 350, protein: 25, carbs: 35, fat: 12 },
    cookingTime: 5,
    servings: 1,
    calories: 350,
    author: 'FitTrack营养师',
    createdAt: '2024-02-15',
    updatedAt: '2024-02-15',
    likes: 234,
    favorites: 117,
    comments: [],
  },
  {
    id: '6',
    userId: 'system',
    name: '牛肉蔬菜炒饭',
    description: '训练后的碳水补充餐',
    category: ['lunch', 'dinner', 'post-workout'],
    ingredients: [
      { name: '牛肉', amount: '150', unit: 'g' },
      { name: '糙米饭', amount: '150', unit: 'g' },
      { name: '胡萝卜', amount: '1', unit: '根' },
      { name: '豌豆', amount: '50', unit: 'g' },
      { name: '鸡蛋', amount: '1', unit: '个' },
    ],
    steps: [
      '牛肉切丁，用生抽腌制10分钟',
      '胡萝卜切丁，鸡蛋打散',
      '热锅下油，炒熟牛肉盛出',
      '炒蛋，加入胡萝卜和豌豆翻炒',
      '加入米饭和牛肉，翻炒均匀',
      '加盐调味即可',
    ],
    images: ['https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800'],
    nutrition: { calories: 580, protein: 35, carbs: 65, fat: 18 },
    cookingTime: 20,
    servings: 1,
    calories: 580,
    author: 'FitTrack营养师',
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20',
    likes: 289,
    favorites: 145,
    comments: [],
  },
];

export const dietStorage = {
  // Get all recipes
  getAllRecipes: (): Recipe[] => {
    const data = localStorage.getItem(STORAGE_KEYS.RECIPES);
    if (data) return JSON.parse(data);
    
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(defaultRecipes));
    return defaultRecipes;
  },

  // Get recipe by ID
  getRecipeById: (id: string): Recipe | null => {
    const recipes = dietStorage.getAllRecipes();
    return recipes.find(r => r.id === id) || null;
  },

  // Create new recipe
  createRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'likes' | 'favorites' | 'comments'>): Recipe => {
    const recipes = dietStorage.getAllRecipes();
    const newRecipe: Recipe = {
      ...recipe,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      favorites: 0,
      comments: [],
    };
    recipes.push(newRecipe);
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
    return newRecipe;
  },

  // Update recipe
  updateRecipe: (id: string, updates: Partial<Recipe>): Recipe | null => {
    const recipes = dietStorage.getAllRecipes();
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) return null;
    
    recipes[index] = { ...recipes[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
    return recipes[index];
  },

  // Delete recipe
  deleteRecipe: (id: string): boolean => {
    const recipes = dietStorage.getAllRecipes();
    const filtered = recipes.filter(r => r.id !== id);
    if (filtered.length === recipes.length) return false;
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(filtered));
    return true;
  },

  // Search recipes
  searchRecipes: (query: string, categories?: RecipeCategory[]): Recipe[] => {
    let recipes = dietStorage.getAllRecipes();
    
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      recipes = recipes.filter(r =>
        r.name.toLowerCase().includes(lowerQuery) ||
        r.description.toLowerCase().includes(lowerQuery) ||
        r.ingredients.some(i => i.name.toLowerCase().includes(lowerQuery))
      );
    }
    
    if (categories?.length) {
      recipes = recipes.filter(r =>
        r.category.some(cat => categories.includes(cat))
      );
    }
    
    return recipes.sort((a, b) => b.likes - a.likes);
  },

  // Get recipes by category
  getRecipesByCategory: (category: RecipeCategory): Recipe[] => {
    const recipes = dietStorage.getAllRecipes();
    return recipes.filter(r => r.category.includes(category))
      .sort((a, b) => b.likes - a.likes);
  },

  // Toggle like
  toggleLike: (recipeId: string, userId: string): number => {
    const recipes = dietStorage.getAllRecipes();
    const index = recipes.findIndex(r => r.id === recipeId);
    if (index === -1) return 0;
    
    recipes[index].likes += 1;
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
    return recipes[index].likes;
  },

  // Toggle favorite
  toggleFavorite: (recipeId: string, userId: string): boolean => {
    const favorites = dietStorage.getUserFavorites(userId);
    const index = favorites.indexOf(recipeId);
    
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(recipeId);
    }
    
    localStorage.setItem(`${STORAGE_KEYS.FAVORITES}_${userId}`, JSON.stringify(favorites));
    return index === -1;
  },

  // Get user favorites
  getUserFavorites: (userId: string): string[] => {
    const data = localStorage.getItem(`${STORAGE_KEYS.FAVORITES}_${userId}`);
    return data ? JSON.parse(data) : [];
  },

  // Get favorite recipes
  getFavoriteRecipes: (userId: string): Recipe[] => {
    const favoriteIds = dietStorage.getUserFavorites(userId);
    const recipes = dietStorage.getAllRecipes();
    return recipes.filter(r => favoriteIds.includes(r.id));
  },

  // Add comment
  addComment: (recipeId: string, comment: Omit<RecipeComment, 'id' | 'createdAt'>): RecipeComment => {
    const recipes = dietStorage.getAllRecipes();
    const index = recipes.findIndex(r => r.id === recipeId);
    if (index === -1) throw new Error('未找到该食谱');
    
    const newComment: RecipeComment = {
      ...comment,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    recipes[index].comments.push(newComment);
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
    return newComment;
  },

  // Delete comment
  deleteComment: (recipeId: string, commentId: string): boolean => {
    const recipes = dietStorage.getAllRecipes();
    const index = recipes.findIndex(r => r.id === recipeId);
    if (index === -1) return false;
    
    const commentIndex = recipes[index].comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return false;
    
    recipes[index].comments.splice(commentIndex, 1);
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
    return true;
  },
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export default dietStorage;
