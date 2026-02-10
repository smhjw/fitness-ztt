import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, Heart, Share2, ChevronRight, ImageOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { KnowledgeArticle, KnowledgeCategory } from '@/types';
import { categoryColors } from '@/hooks/useArticles';

interface ArticleCardProps {
  article: KnowledgeArticle;
  variant?: 'default' | 'compact' | 'featured';
  onClick?: () => void;
}

export function ArticleCard({ article, variant = 'default', onClick }: ArticleCardProps) {
  const { t } = useTranslation();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(article.likes);
  const [imageError, setImageError] = useState(false);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  const renderImage = (className: string) => {
    if (!article.imageUrl || imageError) {
      return (
        <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
          <ImageOff className="w-8 h-8 text-gray-300" />
        </div>
      );
    }
    return (
      <img 
        src={article.imageUrl} 
        alt={article.title}
        className={className}
        onError={() => setImageError(true)}
      />
    );
  };

  if (variant === 'compact') {
    return (
      <Card 
        className="cursor-pointer hover:shadow-card-hover transition-all duration-300 group"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              {renderImage("w-full h-full object-cover group-hover:scale-110 transition-transform duration-300")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap gap-1 mb-2">
                {article.category.slice(0, 2).map((cat) => (
                  <Badge 
                    key={cat} 
                    variant="outline" 
                    className={`text-xs ${categoryColors[cat]}`}
                  >
                    {t(`knowledge.categories.${cat}`)}
                  </Badge>
                ))}
              </div>
              <h4 className="font-medium text-[#333333] line-clamp-2 group-hover:text-[#38B2AC] transition-colors">
                {article.title}
              </h4>
              <div className="flex items-center gap-3 mt-2 text-xs text-[#718096]">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {t('knowledge.readTime', { minutes: article.readTime })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card 
        className="cursor-pointer hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
        onClick={onClick}
      >
        <div className="h-48 overflow-hidden">
          {renderImage("w-full h-full object-cover group-hover:scale-105 transition-transform duration-500")}
        </div>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {article.category.map((cat) => (
              <Badge 
                key={cat} 
                variant="outline" 
                className={categoryColors[cat]}
              >
                {t(`knowledge.categories.${cat}`)}
              </Badge>
            ))}
          </div>
          <h3 className="text-xl font-bold text-[#333333] mb-2 group-hover:text-[#38B2AC] transition-colors">
            {article.title}
          </h3>
          <p className="text-[#718096] line-clamp-2 mb-4">
            {article.summary}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-[#718096]">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {t('knowledge.readTime', { minutes: article.readTime })}
              </span>
              <span>{article.author}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-[#38B2AC] group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className="cursor-pointer hover:shadow-card-hover transition-all duration-300 group"
      onClick={onClick}
    >
      <CardContent className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {article.category.map((cat) => (
            <Badge 
              key={cat} 
              variant="outline" 
              className={categoryColors[cat]}
            >
              {t(`knowledge.categories.${cat}`)}
            </Badge>
          ))}
        </div>
        <h3 className="text-lg font-semibold text-[#333333] mb-2 group-hover:text-[#38B2AC] transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-[#718096] line-clamp-2 mb-4">
          {article.summary}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-[#718096]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {t('knowledge.readTime', { minutes: article.readTime })}
            </span>
            <span>{article.publishedAt}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-8 px-2 ${isLiked ? 'text-red-500' : 'text-[#718096]'}`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="ml-1 text-xs">{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-8 px-2 text-[#718096]"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ArticleCard;
