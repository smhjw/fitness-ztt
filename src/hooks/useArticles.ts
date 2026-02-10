import { useState, useEffect, useCallback, useMemo } from 'react';
import type { KnowledgeArticle, KnowledgeCategory } from '@/types';
import { articlesStorage } from '@/services/storage';

interface UseArticlesReturn {
  articles: KnowledgeArticle[];
  isLoading: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategories: KnowledgeCategory[];
  toggleCategory: (category: KnowledgeCategory) => void;
  clearFilters: () => void;
  filteredArticles: KnowledgeArticle[];
  getArticleById: (id: string) => KnowledgeArticle | null;
  getArticlesByCategory: (category: KnowledgeCategory) => KnowledgeArticle[];
  getRelatedArticles: (articleId: string, limit?: number) => KnowledgeArticle[];
}

export function useArticles(): UseArticlesReturn {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<KnowledgeCategory[]>([]);

  useEffect(() => {
    setIsLoading(true);
    let loadedArticles = articlesStorage.getAll();
    
    // Check if articles need migration (missing imageUrl)
    const needsMigration = loadedArticles.some(a => !a.imageUrl);
    if (needsMigration) {
      localStorage.removeItem('fittrack_articles');
      loadedArticles = articlesStorage.getAll(); // Reloads defaults with images
    }

    setArticles(loadedArticles);
    setIsLoading(false);
  }, []);

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(article =>
        article.title.toLowerCase().includes(query) ||
        article.summary.toLowerCase().includes(query) ||
        article.keywords.some(k => k.toLowerCase().includes(query)) ||
        article.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter(article =>
        article.category.some(cat => selectedCategories.includes(cat))
      );
    }

    return result.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }, [articles, searchQuery, selectedCategories]);

  const toggleCategory = useCallback((category: KnowledgeCategory) => {
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

  const getArticleById = useCallback((id: string): KnowledgeArticle | null => {
    return articles.find(a => a.id === id) || null;
  }, [articles]);

  const getArticlesByCategory = useCallback((category: KnowledgeCategory): KnowledgeArticle[] => {
    return articles
      .filter(a => a.category.includes(category))
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }, [articles]);

  const getRelatedArticles = useCallback((articleId: string, limit = 3): KnowledgeArticle[] => {
    const article = articles.find(a => a.id === articleId);
    if (!article) return [];

    const related = articles
      .filter(a => a.id !== articleId)
      .map(a => {
        let score = 0;
        score += a.category.filter(cat => article.category.includes(cat)).length * 2;
        score += a.tags.filter(tag => article.tags.includes(tag)).length;
        score += a.keywords.filter(kw => article.keywords.includes(kw)).length;
        return { article: a, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.article);

    return related;
  }, [articles]);

  return {
    articles,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    clearFilters,
    filteredArticles,
    getArticleById,
    getArticlesByCategory,
    getRelatedArticles,
  };
}

export const categoryColors: Record<KnowledgeCategory, string> = {
  nutrition: 'bg-green-100 text-green-700 border-green-200',
  strength: 'bg-blue-100 text-blue-700 border-blue-200',
  cardio: 'bg-red-100 text-red-700 border-red-200',
  flexibility: 'bg-purple-100 text-purple-700 border-purple-200',
  recovery: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'mental-health': 'bg-pink-100 text-pink-700 border-pink-200',
  equipment: 'bg-gray-100 text-gray-700 border-gray-200',
  'beginner-guide': 'bg-teal-100 text-teal-700 border-teal-200',
};

export default useArticles;
