import React, { useState } from 'react';
import { ArrowLeft, Clock, Heart, Share2, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { KnowledgeArticle } from '@/types';
import { categoryColors, categoryLabels } from '@/hooks/useArticles';
import ArticleCard from './ArticleCard';

interface ArticleDetailProps {
  article: KnowledgeArticle;
  relatedArticles: KnowledgeArticle[];
  onBack: () => void;
  onSelectRelated?: (articleId: string) => void;
}

export function ArticleDetail({ article, relatedArticles, onBack, onSelectRelated }: ArticleDetailProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  // Parse markdown-like content to HTML
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let inList = false;
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-2 my-4">
            {listItems.map((item, i) => (
              <li key={i} className="text-[#333333]" dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        );
        listItems = [];
        inList = false;
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      if (trimmed.startsWith('## ')) {
        flushList();
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-[#333333] mt-8 mb-4">
            {trimmed.replace('## ', '')}
          </h2>
        );
      } else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        flushList();
        elements.push(
          <p key={index} className="font-semibold text-[#333333] mt-4 mb-2">
            {trimmed.replace(/\*\*/g, '')}
          </p>
        );
      } else if (trimmed.startsWith('- ')) {
        inList = true;
        listItems.push(trimmed.replace('- ', ''));
      } else if (trimmed === '') {
        flushList();
      } else {
        flushList();
        elements.push(
          <p key={index} className="text-[#333333] leading-relaxed my-3">
            {trimmed}
          </p>
        );
      }
    });

    flushList();
    return elements;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </Button>
      </div>

      {/* Article Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {article.category.map((cat) => (
            <Badge 
              key={cat} 
              variant="outline" 
              className={categoryColors[cat]}
            >
              {categoryLabels[cat]}
            </Badge>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#333333] mb-4">
          {article.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-[#718096]">
          <span>{article.author}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {article.readTime} 分钟阅读
          </span>
          <span>•</span>
          <span>{article.publishedAt}</span>
        </div>
      </div>

      {/* Featured Image */}
      {article.imageUrl && (
        <div className="mb-8 rounded-2xl overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={article.title}
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 mb-8">
        <Button
          variant="outline"
          onClick={handleLike}
          className={`gap-2 ${isLiked ? 'text-red-500 border-red-200 bg-red-50' : ''}`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          {likeCount}
        </Button>
        <Button
          variant="outline"
          onClick={handleBookmark}
          className={`gap-2 ${isBookmarked ? 'text-[#38B2AC] border-[#38B2AC] bg-[#E6F7F6]' : ''}`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          收藏
        </Button>
        <Button
          variant="outline"
          onClick={handleShare}
          className="gap-2"
        >
          <Share2 className="w-4 h-4" />
          分享
        </Button>
      </div>

      {/* Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-xl text-[#718096] leading-relaxed mb-8">
          {article.summary}
        </p>
        <Separator className="my-8" />
        <div className="article-content">
          {renderContent(article.content)}
        </div>
      </div>

      {/* Tags */}
      <div className="mb-12">
        <h3 className="text-sm font-medium text-[#718096] mb-3">标签</h3>
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-[#333333] mb-4">相关文章</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard
                key={relatedArticle.id}
                article={relatedArticle}
                variant="compact"
                onClick={
                  onSelectRelated
                    ? () => onSelectRelated(relatedArticle.id)
                    : undefined
                }
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ArticleDetail;
