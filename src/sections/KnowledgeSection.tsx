import { useState } from 'react';
import { Search, BookOpen, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useArticles, categoryColors, categoryLabels } from '@/hooks/useArticles';
import ArticleCard from '@/components/knowledge/ArticleCard';
import ArticleDetail from '@/components/knowledge/ArticleDetail';
import type { KnowledgeCategory } from '@/types';
import { useNavigate, useParams } from 'react-router-dom';

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
  const navigate = useNavigate();
  const { articleId } = useParams();
  const {
    filteredArticles,
    searchQuery,
    setSearchQuery,
    selectedCategories,
    toggleCategory,
    clearFilters,
    getArticleById,
    getRelatedArticles,
  } = useArticles();

  const selectedArticle = articleId ? getArticleById(articleId) : null;
  const relatedArticles = articleId ? getRelatedArticles(articleId) : [];

  // Group articles by category for tab view
  const articlesByCategory = categories.reduce((acc, category) => {
    acc[category] = filteredArticles.filter(a => a.category.includes(category));
    return acc;
  }, {} as Record<KnowledgeCategory, typeof filteredArticles>);

  if (articleId && !selectedArticle) {
    return (
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-[#333333] mb-2">文章不存在</h2>
          <p className="text-[#718096] mb-6">该文章可能已被删除或不存在。</p>
          <Button onClick={() => navigate('/knowledge')} className="rounded-full">
            返回知识库
          </Button>
        </div>
      </section>
    );
  }

  if (selectedArticle) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ArticleDetail
            article={selectedArticle}
            relatedArticles={relatedArticles}
            onBack={() => navigate('/knowledge')}
            onSelectRelated={(id) => navigate(`/knowledge/${id}`)}
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
          <h1 className="text-3xl font-bold text-[#333333] mb-2">知识库</h1>
          <p className="text-[#718096]">科学训练与健康生活指南</p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#718096]" />
            <Input
              type="text"
              placeholder="搜索文章、关键词或标签"
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
            共 {filteredArticles.length} 篇
          </p>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-full overflow-x-auto flex-nowrap max-w-full justify-start md:justify-center">
            <TabsTrigger 
              value="all" 
              className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white gap-2 px-6"
            >
              <BookOpen className="w-4 h-4" />
              全部
            </TabsTrigger>
            {categories.slice(0, 4).map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="rounded-full data-[state=active]:bg-[#38B2AC] data-[state=active]:text-white whitespace-nowrap"
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
                  onClick={() => navigate(`/knowledge/${filteredArticles[0].id}`)}
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
                  onClick={() => navigate(`/knowledge/${article.id}`)}
                />
              ))}
            </div>

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-[#333333] mb-1">暂无内容</h3>
                <p className="text-[#718096]">试试其他关键词或分类</p>
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
                    onClick={() => navigate(`/knowledge/${article.id}`)}
                  />
                ))}
              </div>
              {articlesByCategory[category]?.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-[#718096]">该分类暂无文章</p>
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
