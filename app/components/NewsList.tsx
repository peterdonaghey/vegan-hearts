'use client';

import NewsCard from './NewsCard';
import Link from 'next/link';

interface NewsArticle {
  newsId: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishDate: string;
  imageUrl?: string;
  tags: string[];
}

interface NewsListProps {
  articles: NewsArticle[];
  limit?: number;
  showViewAll?: boolean;
  variant?: 'compact' | 'full';
  loading?: boolean;
  onArticleClick?: (slug: string) => void;
}

export default function NewsList({
  articles,
  limit,
  showViewAll = false,
  variant = 'full',
  loading = false,
  onArticleClick,
}: NewsListProps) {
  const displayArticles = limit ? articles.slice(0, limit) : articles;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vh-green"></div>
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-12 bg-green-50 rounded-2xl">
        <p className="text-gray-600 text-lg">No news articles yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div>
      <div
        className={`grid gap-6 ${
          variant === 'compact'
            ? 'grid-cols-1'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {displayArticles.map((article) => (
          <NewsCard
            key={article.newsId}
            article={article}
            variant={variant}
            onClick={() => {
              if (onArticleClick) {
                onArticleClick(article.slug);
              } else {
                window.location.href = `/news/${article.slug}`;
              }
            }}
          />
        ))}
      </div>

      {showViewAll && limit && articles.length > limit && (
        <div className="text-center mt-8">
          <Link
            href="/news"
            className="inline-block px-8 py-3 bg-vh-orange text-white rounded-full font-semibold hover:bg-orange-600 transition-colors"
          >
            View All News
          </Link>
        </div>
      )}
    </div>
  );
}

