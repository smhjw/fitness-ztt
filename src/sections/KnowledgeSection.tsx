import { useState } from 'react';
import { Search, BookOpen, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useArticles, categoryLabels, categoryColors } from '@/hooks/useArticles';
import ArticleCard from '@/components/knowledge/ArticleCard';
import ArticleDetail from '@/components/knowledge/ArticleDetail';
import type { KnowledgeCategory } from '@/types';

const categories: KnowledgeCategory[] = [
  'nutrition',
  'strength',
  'cardio',
  'flexibility',
  'recovery',
  'mental-health',
  'equipment',
  'beginner-guide',
];

export function KnowledgeSection() {
  const {
    filteredArticles,
    isLoading,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    clearFilters,
    getArticleById,
    getRelatedArticles,
  } = useArticles();

  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  const selectedArticle = selectedArticleId ? getArticleById(selectedArticleId) : null;
  const relatedArticles = selectedArticleId ? getRelatedArticles(selectedArticleId) : [];

  // Group articles by category for tab view
  const articlesByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredArticles.filter(a => a.category.includes(category));
    return acc;
  }, {} as Record<KnowledgeCategory, typeof filteredArticles>);

  if (selectedArticle) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleDetail
            article={selectedArticle}
            relatedArticles={relatedArticles}
            onBack={() => setSelectedArticleId(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#333333] mb-2">健身知识专栏</h1>
          <p className="text-[#718096]">专业的健身指导和健康知识</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
            <Input
              type="text"
              placeholder="搜索文章、标签或关键词..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-14 rounded-full text-base border-gray-200 focus:border-[#38B2AC] focus:ring-[#38B2AC]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#718096] hover:text-[#333333]"
              >
                <X className="w-5 h-5" />
              </button>
            )}
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
                  ? categoryColors[category]
                  : 'bg-gray-100 text-[#718096] hover:bg-gray-200'
              }`}
            >
              {categoryLabels[category]}
            </button>
          ))}
          {selectedCategories.length > 0 && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-full text-sm font-medium text-[#718096] hover:bg-gray-100 transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              清除筛选
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-[#718096]">
            共 {filteredArticles.length} 篇文章
          </p>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-full">
            <TabsTrigger 
              value="all" 
              className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2"
            >
              <BookOpen className="w-4 h-4" />
              全部
            </TabsTrigger>
            {categories.slice(0, 4).map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white"
              >
                {categoryLabels[category]}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {/* Featured Article */}
            {filteredArticles.length > 0 && !searchQuery && selectedCategories.length === 0 && (
              <div className="mb-8">
                <ArticleCard
                  article={filteredArticles[0]}
                  variant="featured"
                  onClick={() => setSelectedArticleId(filteredArticles[0].id)}
                />
              </div>
            )}

            {/* Article Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(searchQuery || selectedCategories.length > 0 
                ? filteredArticles 
                : filteredArticles.slice(1)
              ).map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onClick={() => setSelectedArticleId(article.id)}
                />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-[#333333] mb-1">没有找到相关文章</h3>
                <p className="text-[#718096]">尝试其他关键词或筛选条件</p>
              </div>
            )}
          </TabsContent>

          {categories.map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articlesByCategory[category]?.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => setSelectedArticleId(article.id)}
                  />
                ))}
              </div>
              {articlesByCategory[category]?.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-[#718096]">该分类下暂无文章</p>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export default KnowledgeSection;
