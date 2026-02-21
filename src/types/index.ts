// User Types
export interface User {
  id: string;
  email: string;
  phone?: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  loginType: 'email' | 'phone' | 'wechat' | 'guest';
}

export interface UserPreferences {
  dateFormat: 'YYYY-MM-DD' | 'DD/MM/YYYY' | 'MM/DD/YYYY';
  unitSystem: 'metric' | 'imperial';
  defaultView: 'dashboard' | 'calendar' | 'records';
  language: 'zh-CN';
}

// Exercise Record Types
export interface ExerciseRecord {
  id: string;
  userId: string;
  type: ExerciseType;
  duration: number;
  date: string;
  intensity: IntensityLevel;
  mood: MoodLevel;
  notes?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
}

export type ExerciseType = 
  | 'running'
  | 'walking'
  | 'cycling'
  | 'swimming'
  | 'weightlifting'
  | 'yoga'
  | 'pilates'
  | 'hiit'
  | 'cardio'
  | 'sports'
  | 'other';

export type IntensityLevel = 'low' | 'medium' | 'high' | 'very-high';

export type MoodLevel = 1 | 2 | 3 | 4 | 5;

// Filter Types
export interface RecordFilter {
  dateRange?: {
    start: string;
    end: string;
  };
  types?: ExerciseType[];
  moods?: MoodLevel[];
  intensity?: IntensityLevel[];
}

// Knowledge Article Types
export interface KnowledgeArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: KnowledgeCategory[];
  tags: string[];
  keywords: string[];
  imageUrl?: string;
  author: string;
  publishedAt: string;
  readTime: number;
  likes: number;
}

export type KnowledgeCategory = 
  | 'nutrition'
  | 'strength'
  | 'cardio'
  | 'flexibility'
  | 'recovery'
  | 'mental-health'
  | 'equipment'
  | 'beginner-guide';

// Diet Recipe Types
export interface Recipe {
  id: string;
  userId: string;
  name: string;
  description: string;
  category: RecipeCategory[];
  ingredients: Ingredient[];
  steps: string[];
  images: string[];
  nutrition: NutritionInfo;
  cookingTime: number;
  servings: number;
  calories: number;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  favorites: number;
  comments: RecipeComment[];
}

export type RecipeCategory = 
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack'
  | 'low-carb'
  | 'high-protein'
  | 'vegetarian'
  | 'pre-workout'
  | 'post-workout';

export interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface RecipeComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

// Chart Data Types
export interface ChartDataPoint {
  date: string;
  value: number;
  count: number;
}

export interface StatisticsSummary {
  totalWorkouts: number;
  totalDuration: number;
  averageDuration: number;
  streakDays: number;
  favoriteType: ExerciseType;
  weeklyProgress: number;
}

// Calendar Event Types
export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: ExerciseType;
  duration: number;
  intensity: IntensityLevel;
}

// Form States
export interface ExerciseFormData {
  type: ExerciseType;
  duration: number;
  date: string;
  intensity: IntensityLevel;
  mood: MoodLevel;
  notes: string;
  images?: string[];
}

// Auth Types
export interface LoginCredentials {
  email?: string;
  phone?: string;
  password?: string;
  verificationCode?: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  confirmPassword?: string;
}

// Body Measurement Types
export interface BodyMeasurement {
  id: string;
  userId: string;
  date: string;
  height?: number; // cm
  weight: number; // kg
  bodyFat?: number; // percentage
  chest?: number; // cm
  waist?: number; // cm
  hips?: number; // cm
  arms?: number; // cm
  thighs?: number; // cm
  notes?: string;
  createdAt: string;
}

export interface BodyStats {
  currentWeight: number;
  weightChange: number;
  weightChangePercent: number;
  minWeight: number;
  maxWeight: number;
  avgWeight: number;
  currentBodyFat?: number;
  bodyFatChange?: number;
  bmi: number;
  bmiCategory: 'underweight' | 'normal' | 'overweight' | 'obese';
}

// AI Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// App State
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
